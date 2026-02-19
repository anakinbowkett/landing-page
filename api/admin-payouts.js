import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
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
      const receiptHTML = `<!DOCTYPE html><html><head><title>Receipt</title></head><body><h1>Receipt for ${ambassador.first_name} ${ambassador.last_name}</h1><p>Amount: £0.50</p></body></html>`;

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
      if (totalPayout > 0) {
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
