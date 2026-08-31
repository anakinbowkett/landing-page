import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateReferralCode(seed) {
  const base = (seed || 'CREATOR')
    .replace(/^@/, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .substring(0, 8) || 'CREATOR';
  const suffix = Math.floor(10 + Math.random() * 90);
  return base + suffix;
}

function splitName(fullName) {
  const parts = (fullName || '').trim().split(/\s+/);
  const firstName = parts.shift() || 'Creator';
  const lastName = parts.join(' ') || '—';
  return { firstName, lastName };
}

async function findOrCreateAmbassador({ email, tiktokUsername, fullNameGuess }) {
  const normalisedEmail = (email || '').trim().toLowerCase();

  const { data: existing } = await supabase
    .from('ambassadors')
    .select('id')
    .ilike('email', normalisedEmail)
    .maybeSingle();

  if (existing) return existing.id;

  const { firstName, lastName } = splitName(fullNameGuess);

  let referralCode = generateReferralCode(tiktokUsername);
  let isUnique = false;
  let attempts = 0;
  while (!isUnique && attempts < 10) {
    const { data: clash } = await supabase
      .from('ambassadors')
      .select('id')
      .eq('referral_code', referralCode)
      .maybeSingle();
    if (!clash) { isUnique = true; } else { referralCode = generateReferralCode(tiktokUsername); attempts++; }
  }

  const { data: created, error } = await supabase
    .from('ambassadors')
    .insert({
      first_name: firstName,
      last_name: lastName,
      email: normalisedEmail,
      tiktok_username: tiktokUsername,
      referral_code: referralCode,
      invoice_number: `INV-${referralCode}`,
      receipt_number_prefix: `REC-${referralCode}`,
      paypal_email: normalisedEmail,
      country_region: 'United Kingdom',
      joined_at: new Date().toISOString()
    })
    .select('id')
    .single();

  if (error) throw new Error('Could not create your creator record: ' + error.message);
  return created.id;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { stage, identity, formData } = req.body || {};

    if (!stage || !['terms', 'consent'].includes(stage)) {
      return res.status(400).json({ error: 'Invalid or missing stage' });
    }
    if (!identity || !identity.email || !identity.tiktokUsername) {
      return res.status(400).json({ error: 'Email and TikTok username are required' });
    }
    if (!formData) {
      return res.status(400).json({ error: 'Missing form data' });
    }

    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
    const userAgent = req.headers['user-agent'] || '';

    const fullNameGuess = stage === 'terms' ? formData.fullName : formData.participantName;

    if (stage === 'terms') {
      if (!formData.fullName || !formData.signature || !formData.parentName || !formData.parentSignature) {
        return res.status(400).json({ error: 'Missing required signature fields' });
      }
    } else {
      if (!formData.participantName || !formData.participantSignature || !formData.parentName || !formData.signature) {
        return res.status(400).json({ error: 'Missing required signature fields' });
      }
    }

    const ambassadorId = await findOrCreateAmbassador({
      email: identity.email,
      tiktokUsername: identity.tiktokUsername,
      fullNameGuess
    });

    if (stage === 'terms') {
      await supabase
        .from('ambassador_documents')
        .upsert({
          ambassador_id: ambassadorId,
          terms_full_name: formData.fullName,
          terms_parent_guardian_name: formData.parentName,
          terms_parent_relationship: formData.parentRelationship || null,
          terms_signature: formData.signature,
          terms_parent_signature: formData.parentSignature,
          terms_date: formData.date,
          terms_signed_ip: ip,
          terms_user_agent: userAgent,
          updated_at: new Date().toISOString()
        }, { onConflict: 'ambassador_id' });

      await supabase
        .from('ambassadors')
        .update({
          accepted_terms: true,
          terms_accepted_at: new Date().toISOString()
        })
        .eq('id', ambassadorId);

    } else {
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
          consent_participant_signature: formData.participantSignature,
          consent_date: formData.date,
          consent_signed_ip: ip,
          consent_user_agent: userAgent,
          updated_at: new Date().toISOString()
        }, { onConflict: 'ambassador_id' });

      await supabase
        .from('ambassadors')
        .update({
          accepted_consent: true,
          consent_accepted_at: new Date().toISOString()
        })
        .eq('id', ambassadorId);
    }

    return res.status(200).json({ success: true, ambassadorId });

  } catch (err) {
    console.error('creator-sign error:', err);
    return res.status(500).json({ error: err.message || 'Server error saving your signature' });
  }
}
