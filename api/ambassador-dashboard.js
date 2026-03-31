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
        .select('id, name, email, referral_code, total_signups, total_conversions, total_revenue')
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
        name: ambassador.name,
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
        await supabase
          .from('ambassadors')
          .update({ 
            accepted_consent: true,
            consent_accepted_at: new Date().toISOString()
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
        await supabase
          .from('ambassadors')
          .update({ 
            accepted_guide: true,
            guide_accepted_at: new Date().toISOString(),
            onboarding_completed: true
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

    // PHASE 1: Fetch waitlist commissions
    const { data: waitlistCommissions } = await supabase
      .from('waitlist_commissions')
      .select('*')
      .eq('ambassador_id', ambassador.id)
      .order('created_at', { ascending: false });

    // Phase 1 stats
    const totalWaitlistSignups = waitlistCommissions?.length || 0;
    const verifiedSignups = waitlistCommissions?.filter(c => c.verified).length || 0;
    const phase1Earnings = verifiedSignups * 0.50;
    const phase1Cap = Math.min(verifiedSignups, 100);

    // PHASE 2: Fetch subscription commissions
    const { data: subCommissions } = await supabase
      .from('monthly_commissions')
      .select('*')
      .eq('ambassador_id', ambassador.id)
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
      .eq('ambassador_id', ambassador.id)
      .order('signup_date', { ascending: false });

    // Update ambassador totals
    await supabase
      .from('ambassadors')
      .update({ 
        total_payout: totalPayout,
        leads_acquired: verifiedSignups
      })
      .eq('id', ambassador.id);

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
