import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  export default async function handler(req, res) {
  // Admin view ambassador - NEW
  if (req.query.ambassadorId && !req.query.password) {
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

  // Original admin-payouts logic continues below...
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, action, ambassadorId } = req.query;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // NEW: Receipt generation
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

const receiptHTML = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Payment Receipt</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:60px;max-width:800px;margin:0 auto;background:#fff;color:#1f2937}.header{display:flex;justify-content:space-between;margin-bottom:40px;border-bottom:2px solid #e5e7eb;padding-bottom:30px}.logo h1{font-size:32px;color:#1d7fe2;margin-bottom:8px}.logo p{color:#6b7280;font-size:14px}.badge{background:#10b981;color:#fff;padding:8px 16px;border-radius:6px;font-weight:700;font-size:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:40px}.section h3{font-size:12px;color:#6b7280;margin-bottom:12px;font-weight:700}.section p{line-height:1.8;font-size:15px}.banner{background:linear-gradient(135deg,#1d7fe2,#1e88f5);color:#fff;padding:30px;border-radius:12px;text-align:center;margin-bottom:30px}.banner .label{font-size:14px;opacity:0.9;margin-bottom:8px}.banner .amount{font-size:48px;font-weight:800}table{width:100%;border-collapse:collapse;margin-bottom:30px}thead{background:#f9fafb}th{padding:16px;text-align:left;font-size:12px;color:#6b7280;border-bottom:2px solid #e5e7eb;font-weight:700}td{padding:16px;border-bottom:1px solid #f3f4f6;font-size:15px}.totals{text-align:right;margin-top:30px}.row{display:flex;justify-content:flex-end;gap:60px;padding:12px 0;font-size:15px}.row.final{font-size:20px;font-weight:700;border-top:2px solid #e5e7eb;padding-top:16px;margin-top:16px}.footer{margin-top:50px;padding-top:30px;border-top:1px solid #e5e7eb;text-align:center;color:#6b7280;font-size:13px}</style></head><body><div class="header"><div class="logo"><h1>Monturalearn</h1><p>monturalearn@gmail.com</p></div><div class="badge">PAYMENT RECEIPT</div></div><div class="grid"><div class="section"><h3>RECEIPT DETAILS</h3><p><strong>Receipt Number:</strong> ' + receiptNumber + '<br><strong>Invoice Number:</strong> ' + (ambassador.invoice_number || 'N/A') + '<br><strong>Date Paid:</strong> ' + paymentDate.toLocaleDateString('en-GB',{day:"numeric",month:"long",year:"numeric"}) + '<br><strong>Payment Method:</strong> PayPal</p></div><div class="section"><h3>PAY TO</h3><p><strong>' + ambassador.first_name + ' ' + ambassador.last_name + '</strong><br>' + (ambassador.address_line1 || '') + '<br>' + (ambassador.address_line2 ? ambassador.address_line2 + '<br>' : '') + (ambassador.city || '') + ', ' + (ambassador.postcode || '') + '<br>United Kingdom<br>' + ambassador.email + '</p></div></div><div class="banner"><div class="label">Amount Paid on ' + paymentDate.toLocaleDateString('en-GB',{day:"numeric",month:"long",year:"numeric"}) + '</div><div class="amount">£' + amount + '</div></div><table><thead><tr><th>Description</th><th style="text-align:right">To Pay</th></tr></thead><tbody><tr><td><strong>Monturalearn Startup Circle UGC Creator</strong><br><span style="color:#6b7280;font-size:14px">Joined: ' + new Date(ambassador.joined_at).toLocaleDateString('en-GB',{day:"numeric",month:"long",year:"numeric"}) + '</span></td><td style="text-align:right;font-weight:600">£' + amount + '</td></tr></tbody></table><div class="totals"><div class="row"><span>Subtotal:</span><span>£' + amount + '</span></div><div class="row final"><span>Amount Paid:</span><span>£' + amount + '</span></div></div><div class="footer"><p>This receipt confirms payment has been made via PayPal.</p><p>For any queries, contact: monturalearn@gmail.com</p></div></body></html>';






      
      return res.status(200).json({ success: true, receiptHTML });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Original payout logic continues below...
  try {
    // Get all ambassadors
    const { data: ambassadors, error: ambError } = await supabase
      .from('ambassadors')
      .select('*')
      .order('joined_at', { ascending: false });

    // If no ambassadors, return early with debug info
    if (!ambassadors || ambassadors.length === 0) {
      return res.status(200).json({
        error: 'No ambassadors found',
        ambError: ambError,
        ambassadorCount: ambassadors?.length || 0
      });
    }

    const payoutData = [];
    const debugInfo = [];

    for (const amb of ambassadors || []) {
      // Phase 1: Waitlist commissions
      const { data: waitlistComms } = await supabase
        .from('waitlist_commissions')
        .select('*')
        .eq('ambassador_id', amb.id)
        .eq('status', 'payable');

      // Phase 2: Subscription commissions  
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

      // Store debug info
      debugInfo.push({
        ambassadorEmail: amb.email,
        ambassadorId: amb.id,
        phase1Count,
        phase2Count,
        totalPayout,
        willBeIncluded: totalPayout > 0
      });

      // Only include ambassadors with payouts > 0
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
          paypalEmail: amb.email
        });
      }
    }

    // Sort by highest payout first
    payoutData.sort((a, b) => b.totalPayout - a.totalPayout);

    const summary = {
      totalAmbassadors: payoutData.length,
      totalPayoutAmount: payoutData.reduce((sum, p) => sum + p.totalPayout, 0),
      phase1Total: payoutData.reduce((sum, p) => sum + p.phase1Total, 0),
      phase2Total: payoutData.reduce((sum, p) => sum + p.phase2Total, 0),
      generatedAt: new Date().toISOString(),
      nextPayoutDate: getNextPayoutDate(),
      debug: debugInfo,
      payouts: payoutData
    };

    return res.status(200).json(summary);

  } catch (error) {
    console.error('Admin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

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
