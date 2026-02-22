import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
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

  // Original GET logic continues below
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { id, action } = req.query;
const bodyData = req.body || {};

  // Handle onboarding saves (POST requests)
if (req.method === 'POST' && action === 'onboarding') {
  const { ambassadorId, stage, formData } = bodyData;
  
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
