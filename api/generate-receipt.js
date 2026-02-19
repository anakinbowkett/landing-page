import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Ambassador ID required' });
  }

  try {
    // Fetch ambassador data
    const { data: ambassador, error: ambassadorError } = await supabase
      .from('ambassadors')
      .select('*')
      .eq('id', id)
      .single();

    if (ambassadorError || !ambassador) {
      return res.status(404).json({ error: 'Ambassador not found' });
    }

    // PHASE 1: Fetch waitlist commissions
    const { data: waitlistCommissions } = await supabase
      .from('waitlist_commissions')
      .select('*')
      .eq('ambassador_id', id)
      .order('created_at', { ascending: false });

    // Phase 1 stats
    const totalWaitlistSignups = waitlistCommissions?.length || 0;
    const verifiedSignups = waitlistCommissions?.filter(c => c.verified).length || 0;
    const payableWaitlist = waitlistCommissions?.filter(c => 
      c.status === 'payable' || c.status === 'verified'
    ) || [];
    const phase1Earnings = verifiedSignups * 0.50;
    const phase1Cap = Math.min(verifiedSignups, 100);

    // PHASE 2: Fetch subscription commissions
    const { data: subCommissions } = await supabase
      .from('monthly_commissions')
      .select('*')
      .eq('ambassador_id', id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    const activeSubscriptions = subCommissions?.length || 0;
    const phase2Earnings = activeSubscriptions * 2.00;

    // Total payout
    const totalPayout = phase1Earnings + phase2Earnings;

    // PHASE 2: Fetch referrals
    const { data: referrals } = await supabase
      .from('referrals')
      .select('*')
      .eq('ambassador_id', id)
      .order('signup_date', { ascending: false });

    // Update ambassador totals
    await supabase
      .from('ambassadors')
      .update({ 
        total_payout: totalPayout,
        leads_acquired: verifiedSignups
      })
      .eq('id', id);

    return res.status(200).json({
      firstName: ambassador.first_name,
      lastName: ambassador.last_name,
      referralCode: ambassador.referral_code,
      
      // Phase 1 data
      phase1: {
        totalSignups: totalWaitlistSignups,
        verifiedSignups: verifiedSignups,
        cappedSignups: phase1Cap,
        earnings: phase1Earnings,
        cap: 100,
        remainingCap: Math.max(0, 100 - verifiedSignups)
      },

      // Phase 2 data
      phase2: {
        activeSubscriptions: activeSubscriptions,
        earnings: phase2Earnings
      },

      // Combined
      totalPayout: totalPayout,
      referrals: referrals || [],
      waitlistCommissions: waitlistCommissions || []
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
