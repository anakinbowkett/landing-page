const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {

// NEW: GET all ambassadors with metrics
  if (req.method === 'GET' && req.query.action === 'list-ambassadors') {
    if (req.query.password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorised' });
    }
    try {
      const { data: ambassadors, error } = await supabase
        .from('ambassadors')
        .select('id, first_name, last_name, email, referral_code, total_signups, total_conversions, total_revenue, created_at')
        .order('total_revenue', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ ambassadors });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch ambassadors' });
    }
  }

  // NEW: GET single ambassador detail + referred users + payments + monthly breakdown
  if (req.method === 'GET' && req.query.action === 'ambassador-detail') {
    if (req.query.password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorised' });
    }
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Ambassador ID required' });

    try {
      const { data: ambassador, error: ambError } = await supabase
        .from('ambassadors')
        .select('id, first_name, last_name, email, referral_code, total_signups, total_conversions, total_revenue, created_at')
        .eq('id', id)
        .single();

      if (ambError || !ambassador) {
        return res.status(404).json({ error: 'Ambassador not found' });
      }

      const { data: referredUsers, error: usersError } = await supabase
        .from('waitlist')
        .select('email, referral_code, verified, created_at')
        .eq('ambassador_id', id)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('id, email, amount, status, created_at')
        .eq('ambassador_id', id)
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Monthly breakdown
      const monthlyBreakdown = {};
      (payments || []).forEach(p => {
        if (p.status !== 'paid') return;
        const month = p.created_at.substring(0, 7);
        if (!monthlyBreakdown[month]) {
          monthlyBreakdown[month] = { month, revenue: 0, conversions: 0 };
        }
        monthlyBreakdown[month].revenue += parseFloat(p.amount);
        monthlyBreakdown[month].conversions += 1;
      });

      return res.status(200).json({
        ambassador: {
          ...ambassador,
          name: `${ambassador.first_name} ${ambassador.last_name}`
        },
        referredUsers: referredUsers || [],
        payments: payments || [],
        monthlyBreakdown: Object.values(monthlyBreakdown).sort((a, b) => b.month.localeCompare(a.month))
      });

      
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch ambassador details' });
    }
  }

  
  
  // Admin view ambassador (no password needed)
  if (req.query.adminView === 'true' && req.query.ambassadorId) {
    const { ambassadorId } = req.query;

    try {
      const { data: ambassador } = await supabase
        .from('ambassadors')
        .select('*')
        .eq('id', ambassadorId)
        .single();

      if (!ambassador) {
        return res.status(404).json({ error: 'Ambassador not found' });
      }

      const { data: waitlistCommissions } = await supabase
        .from('waitlist_commissions')
        .select('*')
        .eq('ambassador_id', ambassadorId)
        .order('created_at', { ascending: false });

      const { data: subscriptions } = await supabase
        .from('monthly_commissions')
        .select('*')
        .eq('ambassador_id', ambassadorId)
        .order('created_at', { ascending: false });

      const verifiedSignups = waitlistCommissions?.filter(c => c.verified).length || 0;
      const phase1Earnings = verifiedSignups * 0.50;
      const activeSubscriptions = subscriptions?.filter(s => s.is_active).length || 0;
      const phase2Earnings = activeSubscriptions * 2.00;
      const totalPayout = phase1Earnings + phase2Earnings;

      return res.status(200).json({
        id: ambassador.id,
        firstName: ambassador.first_name,
        lastName: ambassador.last_name,
        email: ambassador.email,
        referralCode: ambassador.referral_code,
        adminNote1: ambassador.admin_note_1,
        adminNote2: ambassador.admin_note_2,
        totalPayout: totalPayout,
        phase1: {
          totalSignups: waitlistCommissions?.length || 0,
          verifiedSignups: verifiedSignups,
          earnings: phase1Earnings
        },
        phase2: {
          activeSubscriptions: activeSubscriptions,
          earnings: phase2Earnings
        },
        waitlistCommissions: waitlistCommissions || [],
        subscriptions: subscriptions || []
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle POST requests
  if (req.method === 'POST') {
    const { action, ambassadorId, note1, note2 } = req.body;

    // Save admin notes
    if (action === 'saveNotes' && ambassadorId) {
      try {
        await supabase
          .from('ambassadors')
          .update({
            admin_note_1: note1,
            admin_note_2: note2
          })
          .eq('id', ambassadorId);

        return res.status(200).json({ success: true });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  
  // Handle GET requests (admin payouts - requires password)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, action, ambassadorId } = req.query;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Receipt generation
  if (action === 'receipt' && ambassadorId) {
    try {
      const { data: ambassador } = await supabase
        .from('ambassadors')
        .select('*')
        .eq('id', ambassadorId)
        .single();

      if (!ambassador) {
        return res.status(404).json({ error: 'Ambassador not found' });
      }

      const today = new Date();
      const paymentDate = new Date(today.getFullYear(), today.getMonth(), 15);
      const receiptNumber = 'REC-' + ambassador.referral_code + '-' + Date.now();
      const amount = '0.50';

      const receiptHTML = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Payment Receipt</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:60px;max-width:800px;margin:0 auto;background:#fff;color:#1f2937}.header{display:flex;justify-content:space-between;margin-bottom:40px;border-bottom:2px solid #e5e7eb;padding-bottom:30px}.logo h1{font-size:32px;color:#1d7fe2;margin-bottom:8px}.logo p{color:#6b7280;font-size:14px}.badge{background:#10b981;color:#fff;padding:8px 16px;border-radius:6px;font-weight:700;font-size:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:40px}.section h3{font-size:12px;color:#6b7280;margin-bottom:12px;font-weight:700}.section p{line-height:1.8;font-size:15px}.banner{background:linear-gradient(135deg,#1d7fe2,#1e88f5);color:#fff;padding:30px;border-radius:12px;text-align:center;margin-bottom:30px}.banner .label{font-size:14px;opacity:0.9;margin-bottom:8px}.banner .amount{font-size:48px;font-weight:800}table{width:100%;border-collapse:collapse;margin-bottom:30px}thead{background:#f9fafb}th{padding:16px;text-align:left;font-size:12px;color:#6b7280;border-bottom:2px solid #e5e7eb;font-weight:700}td{padding:16px;border-bottom:1px solid #f3f4f6;font-size:15px}.totals{text-align:right;margin-top:30px}.row{display:flex;justify-content:flex-end;gap:60px;padding:12px 0;font-size:15px}.row.final{font-size:20px;font-weight:700;border-top:2px solid #e5e7eb;padding-top:16px;margin-top:16px}.footer{margin-top:50px;padding-top:30px;border-top:1px solid #e5e7eb;text-align:center;color:#6b7280;font-size:13px}</style></head><body><div class="header"><div class="logo"><h1>Monturalearn</h1><p>monturalearn@gmail.com</p></div><div class="badge">PAYMENT RECEIPT</div></div><div class="grid"><div class="section"><h3>RECEIPT DETAILS</h3><p><strong>Receipt Number:</strong> ' + receiptNumber + '<br><strong>Invoice Number:</strong> ' + (ambassador.invoice_number || 'N/A') + '<br><strong>Date Paid:</strong> ' + paymentDate.toLocaleDateString('en-GB',{day:"numeric",month:"long",year:"numeric"}) + '<br><strong>Payment Method:</strong> PayPal</p></div><div class="section"><h3>PAY TO</h3><p><strong>' + ambassador.first_name + ' ' + ambassador.last_name + '</strong><br>' + (ambassador.email || '') + '</p></div></div><div class="banner"><div class="label">Amount Paid on ' + paymentDate.toLocaleDateString('en-GB',{day:"numeric",month:"long",year:"numeric"}) + '</div><div class="amount">£' + amount + '</div></div><table><thead><tr><th>Description</th><th style="text-align:right">To Pay</th></tr></thead><tbody><tr><td><strong>Monturalearn UGC Creator Commission</strong><br><span style="color:#6b7280;font-size:14px">Joined: ' + new Date(ambassador.joined_at).toLocaleDateString('en-GB',{day:"numeric",month:"long",year:"numeric"}) + '</span></td><td style="text-align:right;font-weight:600">£' + amount + '</td></tr></tbody></table><div class="totals"><div class="row"><span>Subtotal:</span><span>£' + amount + '</span></div><div class="row final"><span>Amount Paid:</span><span>£' + amount + '</span></div></div><div class="footer"><p>This receipt confirms payment has been made via PayPal.</p><p>For queries, contact: monturalearn@gmail.com</p></div></body></html>';

      return res.status(200).json({ success: true, receiptHTML });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Get all ambassadors for payout dashboard
  try {
    const { data: ambassadors } = await supabase
      .from('ambassadors')
      .select('*')
      .order('joined_at', { ascending: false });

    if (!ambassadors || ambassadors.length === 0) {
      return res.status(200).json({
        totalAmbassadors: 0,
        totalPayoutAmount: 0,
        payouts: []
      });
    }

    const payoutData = [];

    for (const amb of ambassadors) {
      const { data: waitlistComms } = await supabase
        .from('waitlist_commissions')
        .select('*')
        .eq('ambassador_id', amb.id)
        .eq('status', 'payable');

      const { data: subComms } = await supabase
        .from('monthly_commissions')
        .select('*')
        .eq('ambassador_id', amb.id)
        .eq('is_active', true);

      const phase1Count = waitlistComms?.length || 0;
      const phase2Count = subComms?.length || 0;
      const phase1Total = phase1Count * 0.50;
      const phase2Total = phase2Count * 2.00;
      const totalPayout = phase1Total + phase2Total;

      if (totalPayout >= 0) {
        payoutData.push({
  ambassadorId: amb.id,
  name: `${amb.first_name} ${amb.last_name}`,
  email: amb.email,
  referralCode: amb.referral_code,
  phase1Signups: phase1Count,
  phase1Total: phase1Total,
  phase2Subscribers: phase2Count,
  phase2Total: phase2Total,
  totalPayout: totalPayout,
  payoutMethod: 'PayPal',
  paypalEmail: amb.email,

  paid_status: amb.paid_status,
  paypal_txn_id: amb.paypal_txn_id,
  paid_at: amb.paid_at
});
      }
    }

    payoutData.sort((a, b) => b.totalPayout - a.totalPayout);

    return res.status(200).json({
      totalAmbassadors: payoutData.length,
      totalPayoutAmount: payoutData.reduce((sum, p) => sum + p.totalPayout, 0),
      phase1Total: payoutData.reduce((sum, p) => sum + p.phase1Total, 0),
      phase2Total: payoutData.reduce((sum, p) => sum + p.phase2Total, 0),
      generatedAt: new Date().toISOString(),
      nextPayoutDate: getNextPayoutDate(),
      payouts: payoutData
    });

  } catch (error) {
    console.error('Admin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

function getNextPayoutDate() {
  const today = new Date();
  let payoutMonth = today.getMonth();
  let payoutYear = today.getFullYear();

  if (today.getDate() >= 15) {
    payoutMonth += 1;
    if (payoutMonth > 11) {
      payoutMonth = 0;
      payoutYear += 1;
    }
  }

  const payout = new Date(payoutYear, payoutMonth, 15);
  return payout.toISOString().split('T')[0];
}
