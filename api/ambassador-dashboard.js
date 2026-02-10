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

    // Fetch referrals for this ambassador
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('ambassador_id', id)
      .order('signup_date', { ascending: false });

    if (referralsError) {
      console.error('Error fetching referrals:', referralsError);
    }

    // Count active subscriptions (where status = 'active')
    const activeSubscriptions = referrals?.filter(ref => ref.status === 'active').length || 0;

    // Calculate total payout from monthly_commissions
    const { data: commissions, error: commissionsError } = await supabase
      .from('monthly_commissions')
      .select('commission_amount')
      .eq('ambassador_id', id)
      .eq('is_active', true);

    let totalPayout = 0;
    if (commissions && !commissionsError) {
      totalPayout = commissions.reduce((sum, comm) => sum + parseFloat(comm.commission_amount), 0);
    }

    // Update ambassador's total_payout in database
    await supabase
      .from('ambassadors')
      .update({ 
        total_payout: totalPayout,
        total_leads: referrals?.length || 0
      })
      .eq('id', id);

    return res.status(200).json({
      firstName: ambassador.first_name,
      lastName: ambassador.last_name,
      referralCode: ambassador.referral_code,
      totalLeads: referrals?.length || 0,
      totalPayout: totalPayout,
      activeSubscriptions: activeSubscriptions,
      referrals: referrals || []
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
