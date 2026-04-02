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
    // PHASE 1: Fetch from new waitlist table
    const { data: waitlistSignups } = await supabase
      .from('waitlist')
      .select('email, verified, created_at, referral_code')
      .eq('ambassador_id', ambassador.id)
      .order('created_at', { ascending: false });

    const totalWaitlistSignups = ambassador.total_signups || 0;
    const verifiedSignups = waitlistSignups?.filter(w => w.verified).length || 0;

    // PHASE 2: Fetch from new payments table
    const { data: payments } = await supabase
      .from('payments')
      .select('email, amount, status, created_at')
      .eq('ambassador_id', ambassador.id)
      .eq('status', 'paid')
      .order('created_at', { ascending: false });

    const activeSubscriptions = ambassador.total_conversions || 0;
    const phase2Earnings = parseFloat(ambassador.total_revenue) || 0;
    const totalPayout = phase2Earnings;

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
        earnings: 0,
        cap: 100,
        remainingCap: Math.max(0, 100 - verifiedSignups)
      },

      // Phase 2 data
      phase2: {
        activeSubscriptions: activeSubscriptions,
        earnings: phase2Earnings,
        payments: payments || []
      },

      // Combined
      totalPayout: totalPayout,
      referrals: [],
      waitlistCommissions: (waitlistSignups || []).map(w => ({
        waitlist_email: w.email,
        created_at: w.created_at,
        status: w.verified ? 'verified' : 'pending',
        commission_amount: 0,
        payable_date: null
      }))
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
