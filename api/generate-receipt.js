const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, ambassadorId, paymentDate } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!ambassadorId || !paymentDate) {
    return res.status(400).json({ error: 'Ambassador ID and payment date required' });
  }

  try {
    const { data: ambassador } = await supabase
      .from('ambassadors')
      .select('*')
      .eq('id', ambassadorId)
      .single();

    if (!ambassador) {
      return res.status(404).json({ error: 'Ambassador not found' });
    }

    const { data: waitlistComms } = await supabase
      .from('waitlist_commissions')
      .select('*')
      .eq('ambassador_id', ambassadorId)
      .eq('status', 'payable');

    const { data: subComms } = await supabase
      .from('monthly_commissions')
      .select('*')
      .eq('ambassador_id', ambassadorId)
      .eq('is_active', true);

    const phase1Amount = (waitlistComms?.length || 0) * 0.50;
    const phase2Amount = (subComms?.length || 0) * 2.00;
    const totalAmount = phase1Amount + phase2Amount;

    if (totalAmount <= 0) {
      return res.status(400).json({ error: 'No amount to pay' });
    }

    const receiptNumber = `${ambassador.receipt_number_prefix}-${Date.now()}`;

    const { data: receipt, error: receiptError } = await supabase
      .from('payment_receipts')
      .insert({
        receipt_number: receiptNumber,
        ambassador_id: ambassadorId,
        ambassador_name: `${ambassador.first_name} ${ambassador.last_name}`,
        ambassador_email: ambassador.email,
        ambassador_address: [
          ambassador.address_line1,
          ambassador.address_line2,
          ambassador.city,
          ambassador.postcode,
          'United Kingdom'
        ].filter(Boolean).join(', '),
        payment_date: paymentDate,
        amount_paid: totalAmount,
        phase1_amount: phase1Amount,
        phase2_amount: phase2Amount,
        payment_method: 'PayPal',
        join_date: ambassador.joined_at
      })
      .select()
      .single();

    if (receiptError) {
      console.error('Receipt creation error:', receiptError);
      return res.status(500).json({ error: 'Failed to create receipt' });
    }

    if (waitlistComms && waitlistComms.length > 0) {
      await supabase
        .from('waitlist_commissions')
        .update({ status: 'paid' })
        .eq('ambassador_id', ambassadorId)
        .eq('status', 'payable');
    }

    const receiptHTML = generateReceiptHTML({
      receiptNumber,
      invoiceNumber: ambassador.invoice_number,
      paymentDate,
      ambassadorName: `${ambassador.first_name} ${ambassador.last_name}`,
      ambassadorEmail: ambassador.email,
      ambassadorAddress: [
        ambassador.address_line1,
        ambassador.address_line2,
        ambassador.city,
        ambassador.postcode,
        'United Kingdom'
      ].filter(Boolean).join('<br>'),
      joinDate: new Date(ambassador.joined_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      totalAmount: totalAmount.toFixed(2)
    });

    return res.status(200).json({
      success: true,
      receiptNumber,
      receiptHTML,
      receiptId: receipt.id
    });

  } catch (error) {
    console.error('Receipt generation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

function generateReceiptHTML(data) {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            background: white;
            color: #1f2937;
            padding: 3rem;
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 3rem;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 2rem;
        }
        .logo-section h1 {
            font-size: 2rem;
            font-weight: 700;
            color: #1d7fe2;
            margin-bottom: 0.5rem;
        }
        .logo-section p {
            color: #6b7280;
            font-size: 0.875rem;
        }
        .receipt-badge {
            background: #10b981;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 700;
            font-size: 0.875rem;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 3rem;
        }
        .detail-section h3 {
            font-size: 0.75rem;
            font-weight: 700;
            color: #6b7280;
            margin-bottom: 0.75rem;
        }
        .detail-section p {
            color: #1f2937;
            line-height: 1.6;
            font-size: 0.9375rem;
        }
        .amount-banner {
            background: linear-gradient(135deg, #1d7fe2 0%, #1e88f5 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 2rem;
        }
        .amount-banner .label {
            font-size: 0.875rem;
            opacity: 0.9;
            margin-bottom: 0.5rem;
        }
        .amount-banner .amount {
            font-size: 3rem;
            font-weight: 800;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
        }
        thead {
            background: #f9fafb;
        }
        th {
            padding: 1rem;
            text-align: left;
            font-size: 0.75rem;
            font-weight: 700;
            color: #6b7280;
            border-bottom: 2px solid #e5e7eb;
        }
        td {
            padding: 1rem;
            border-bottom: 1px solid #f3f4f6;
            font-size: 0.9375rem;
        }
        .totals {
            text-align: right;
            margin-top: 2rem;
        }
        .total-row {
            display: flex;
            justify-content: flex-end;
            gap: 3rem;
            padding: 0.75rem 0;
            font-size: 0.9375rem;
        }
        .total-row.final {
            font-size: 1.25rem;
            font-weight: 700;
            border-top: 2px solid #e5e7eb;
            padding-top: 1rem;
            margin-top: 1rem;
        }
        .footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 0.8125rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-section">
            <h1>Monturalearn</h1>
            <p>monturalearn@gmail.com</p>
        </div>
        <div class="receipt-badge">PAYMENT RECEIPT</div>
    </div>
    <div class="details-grid">
        <div class="detail-section">
            <h3>Receipt Details</h3>
            <p>
                <strong>Receipt Number:</strong> ${data.receiptNumber}<br>
                <strong>Invoice Number:</strong> ${data.invoiceNumber}<br>
                <strong>Date Paid:</strong> ${new Date(data.paymentDate).toLocaleDateString('en-GB')}<br>
                <strong>Payment Method:</strong> PayPal
            </p>
        </div>
        <div class="detail-section">
            <h3>Pay To</h3>
            <p>
                <strong>${data.ambassadorName}</strong><br>
                ${data.ambassadorAddress}<br>
                ${data.ambassadorEmail}
            </p>
        </div>
    </div>
    <div class="amount-banner">
        <div class="label">Amount Paid on ${new Date(data.paymentDate).toLocaleDateString('en-GB')}</div>
        <div class="amount">£${data.totalAmount}</div>
    </div>
    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th style="text-align: right;">To Pay</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>Monturalearn Startup Circle UGC Creator</strong><br>
                    <span style="color: #6b7280; font-size: 0.875rem;">Joined: ${data.joinDate}</span>
                </td>
                <td style="text-align: right; font-weight: 600;">£${data.totalAmount}</td>
            </tr>
        </tbody>
    </table>
    <div class="totals">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>£${data.totalAmount}</span>
        </div>
        <div class="total-row final">
            <span>Amount Paid:</span>
            <span>£${data.totalAmount}</span>
        </div>
    </div>
    <div class="footer">
        <p>This receipt confirms payment has been made via PayPal.</p>
        <p>For any queries, contact: monturalearn@gmail.com</p>
    </div>
</body>
</html>`;
}
