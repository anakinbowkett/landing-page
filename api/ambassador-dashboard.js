import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

// NEW: GET /api/ambassador-dashboard?action=me&ambassadorId=UUID
  if (req.method === 'GET' && req.query.action === 'me') {
    const { ambassadorId } = req.query;
    if (!ambassadorId) return res.status(400).json({ error: 'ambassadorId required' });

    try {
      const { data: ambassador, error: ambError } = await supabase
        .from('ambassadors')
        .select('id, first_name, last_name, email, referral_code, total_signups, total_conversions, total_revenue')
        .eq('id', ambassadorId)
        .single();

      if (ambError || !ambassador) {
        return res.status(404).json({ error: 'Ambassador not found' });
      }

      // Referred users from waitlist
      const { data: referredUsers } = await supabase
        .from('waitlist')
        .select('email, verified, created_at')
        .eq('ambassador_id', ambassadorId)
        .order('created_at', { ascending: false });

      // Monthly revenue breakdown from payments
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, status, created_at')
        .eq('ambassador_id', ambassadorId)
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

      const monthlyBreakdown = {};
      (payments || []).forEach(p => {
        const month = p.created_at.substring(0, 7);
        if (!monthlyBreakdown[month]) {
          monthlyBreakdown[month] = { month, revenue: 0, conversions: 0 };
        }
        monthlyBreakdown[month].revenue += parseFloat(p.amount);
        monthlyBreakdown[month].conversions += 1;
      });

      return res.status(200).json({
        ambassadorId: ambassador.id,
        name: `${ambassador.first_name} ${ambassador.last_name}`,
        email: ambassador.email,
        referralCode: ambassador.referral_code,
        totalSignups: ambassador.total_signups,
        totalConversions: ambassador.total_conversions,
        totalRevenue: ambassador.total_revenue,
        referredUsers: referredUsers || [],
        monthlyBreakdown: Object.values(monthlyBreakdown).sort((a, b) => b.month.localeCompare(a.month))
      });

    } catch (err) {
      console.error('Ambassador me error:', err);
      return res.status(500).json({ error: 'Failed to fetch ambassador data' });
    }
  }



  
  // Handle POST for onboarding saves
  if (req.method === 'POST') {
    const { ambassadorId, stage, formData } = req.body;

    if (!ambassadorId || !stage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      if (stage === 'terms') {
        await supabase
          .from('ambassadors')
          .update({ 
            accepted_terms: true,
            terms_accepted_at: new Date().toISOString()
          })
          .eq('id', ambassadorId);

        await supabase
          .from('ambassador_documents')
          .upsert({
            ambassador_id: ambassadorId,
            terms_full_name: formData.fullName,
            terms_parent_guardian_name: formData.parentName,
            terms_signature: formData.signature,
            terms_date: formData.date,
            updated_at: new Date().toISOString()
          }, { onConflict: 'ambassador_id' });

      } else if (stage === 'consent') {
        // This is now the FINAL onboarding step (UGC Guide).
        // onboarding_completed is set here, not on 'guide'.
        await supabase
          .from('ambassadors')
          .update({ 
            accepted_consent: true,
            consent_accepted_at: new Date().toISOString(),
            onboarding_completed: true
          })
          .eq('id', ambassadorId);

        await supabase
          .from('ambassador_documents')
          .upsert({
            ambassador_id: ambassadorId,
            consent_parent_name: formData.parentName,
            consent_relationship: formData.relationship,
            consent_parent_email: formData.parentEmail,
            consent_parent_phone: formData.parentPhone,
            consent_participant_name: formData.participantName,
            consent_participant_dob: formData.participantDob,
            consent_signature: formData.signature,
            consent_date: formData.date,
            updated_at: new Date().toISOString()
          }, { onConflict: 'ambassador_id' });

      } else if (stage === 'guide') {
        // Guide is now the FIRST onboarding step — it must NOT
        // mark onboarding as complete. That bug was causing the
        // whole modal to be skipped after just this one step.
        await supabase
          .from('ambassadors')
          .update({ 
            accepted_guide: true,
            guide_accepted_at: new Date().toISOString()
          })
          .eq('id', ambassadorId);
      }

      return res.status(200).json({ success: true });

    } catch (error) {
      console.error('Onboarding save error:', error);
      return res.status(500).json({ error: 'Failed to save' });
    }
  }

  // Handle GET for dashboard data
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, referralCode } = req.query;

  if (!email || !referralCode) {
    return res.status(400).json({ error: 'Email and referral code required' });
  }

  try {
    // Fetch ambassador data
    const { data: ambassador, error: ambassadorError } = await supabase
      .from('ambassadors')
      .select('*')
      .eq('email', email)
      .ilike('referral_code', referralCode)
      .single();

    if (ambassadorError || !ambassador) {
      return res.status(404).json({ error: 'Ambassador not found' });
    }

    // PHASE 1: Fetch from waitlist_commissions — the real table linking
    // signups to an ambassador_id with a verified flag. (The old code
    // queried 'waitlist', which has no ambassador_id column at all, so
    // this was always silently returning zero.)
    const { data: waitlistCommissions } = await supabase
      .from('waitlist_commissions')
      .select('waitlist_email, referral_code, verified, verified_at, payable_date')
      .eq('ambassador_id', ambassador.id)
      .order('verified_at', { ascending: false });

    const totalWaitlistSignups = waitlistCommissions?.length || 0;
    const verifiedSignups = (waitlistCommissions || []).filter(w => w.verified).length;
    const phase1Earnings = verifiedSignups * 0.50; // £5 per 10 signups = £0.50/signup

    // PHASE 2: Fetch from monthly_commissions — same issue, 'payments'
    // has no ambassador_id link either.
    const { data: subscriptions } = await supabase
      .from('monthly_commissions')
      .select('*')
      .eq('ambassador_id', ambassador.id)
      .order('created_at', { ascending: false });

    const activeSubscriptions = (subscriptions || []).filter(s => s.is_active).length;
    const phase2Earnings = activeSubscriptions * 2.00;

    const totalPayout = phase1Earnings + phase2Earnings;

    // Payout history — for the "weeks you've been paid" graph on the dashboard
    const { data: payoutHistory } = await supabase
      .from('payout_log')
      .select('payout_date, phase1_amount, phase2_amount, total_amount')
      .eq('ambassador_id', ambassador.id)
      .order('payout_date', { ascending: true });

    return res.status(200).json({
      id: ambassador.id,
      firstName: ambassador.first_name,
      lastName: ambassador.last_name,
      referralCode: ambassador.referral_code,
      accepted_terms: ambassador.accepted_terms || false,
      accepted_consent: ambassador.accepted_consent || false,
      accepted_guide: ambassador.accepted_guide || false,
      onboarding_completed: ambassador.onboarding_completed || false,

      // Phase 1 data
      phase1: {
        totalSignups: totalWaitlistSignups,
        verifiedSignups: verifiedSignups,
        cappedSignups: Math.min(verifiedSignups, 100),
        earnings: phase1Earnings,
        cap: 100,
        remainingCap: Math.max(0, 100 - verifiedSignups)
      },

      // Phase 2 data
      phase2: {
        activeSubscriptions: activeSubscriptions,
        earnings: phase2Earnings,
        payments: subscriptions || []
      },

      // Combined
      totalPayout: totalPayout,
      referrals: [],
      payoutHistory: payoutHistory || [],
      waitlistCommissions: (waitlistCommissions || []).map(w => ({
        waitlist_email: w.waitlist_email,
        created_at: w.verified_at,
        status: w.verified ? 'verified' : 'pending',
        commission_amount: w.verified ? 0.50 : 0,
        payable_date: w.payable_date
      }))
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
