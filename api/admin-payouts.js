import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple password protection
  const { password } = req.query;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get all ambassadors
    const { data: ambassadors } = await supabase
      .from('ambassadors')
      .select('*')
      .order('created_at', { ascending: false });

    // For each ambassador, get their payable commissions
    const payoutData = [];

    for (const amb of ambassadors || []) {
      // Phase 1: Waitlist commissions
      const { data: waitlistComms } = await supabase
        .from('waitlist_commissions')
        .select('*')
        .eq('ambassador_id', amb.id)
        .in('status', ['verified', 'payable'])
        .lte('payable_date', new Date().toISOString());

      // Phase 2: Subscription commissions
      const { data: subComms } = await supabase
        .from('monthly_commissions')
        .select('*')
        .eq('ambassador_id', amb.id)
        .eq('is_active', true)
        .lte('created_at', new Date().toISOString());

      const phase1Total = (waitlistComms?.length || 0) * 0.50;
      const phase2Total = (subComms?.length || 0) * 2.00;
      const totalPayout = phase1Total + phase2Total;

      if (totalPayout > 0) {
        payoutData.push({
          ambassadorId: amb.id,
          name: `${amb.first_name} ${amb.last_name}`,
          email: amb.email,
          referralCode: amb.referral_code,
          phase1Signups: waitlistComms?.length || 0,
          phase1Total: phase1Total,
          phase2Subscribers: subComms?.length || 0,
          phase2Total: phase2Total,
          totalPayout: totalPayout,
          payoutMethod: amb.payout_method || 'PayPal',
          paypalEmail: amb.paypal_email || amb.email
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
      payouts: payoutData
    };

    return res.status(200).json(summary);

  } catch (error) {
    console.error('Admin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
