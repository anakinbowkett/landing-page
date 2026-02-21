import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    ambassadorId, 
    stage, 
    formData 
  } = req.body;

  if (!ambassadorId || !stage) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    if (stage === 'terms') {
      // Update ambassador
      await supabase
        .from('ambassadors')
        .update({ 
          accepted_terms: true,
          terms_accepted_at: new Date().toISOString()
        })
        .eq('id', ambassadorId);

      // Upsert document data
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
