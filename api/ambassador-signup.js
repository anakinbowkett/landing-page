import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateReferralCode(tiktokUsername) {
  // Extract first part of TikTok username, uppercase, max 8 chars, letters/numbers only
  const base = tiktokUsername
    .replace(/^@/, '')           // remove leading @
    .replace(/[^a-zA-Z0-9]/g, '') // remove special chars
    .toUpperCase()
    .substring(0, 8);

  // Add 2 random digits to avoid collisions
  const suffix = Math.floor(10 + Math.random() * 90);
  return base + suffix;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

const { 
  firstName, 
  lastName, 
  email, 
  tiktokUsername
} = req.body;

  // Validate required fields
if (!firstName || !lastName || !email || !tiktokUsername) {
    return res.status(400).json({ error: 'All required fields must be filled' });
  }

  try {
    // Generate unique referral code
    let referralCode = generateReferralCode(tiktokUsername);
    let isUnique = false;
    let attempts = 0;

    // Ensure referral code is unique
    while (!isUnique && attempts < 10) {
      const { data: existing } = await supabase
        .from('ambassadors')
        .select('id')
        .eq('referral_code', referralCode)
        .single();

      if (!existing) {
        isUnique = true;
      } else {
        referralCode = generateReferralCode(tiktokUsername);
        attempts++;
      }
    }

    if (!isUnique) {
      return res.status(500).json({ error: 'Could not generate unique referral code' });
    }

// Insert ambassador into database
    const { data: ambassador, error } = await supabase
  .from('ambassadors')
  .insert({
    first_name: firstName,
    last_name: lastName,
    email: email,
    tiktok_username: tiktokUsername,
    referral_code: referralCode,
    invoice_number: `INV-${referralCode}`,
    receipt_number_prefix: `REC-${referralCode}`,
    paypal_email: email,
    country_region: 'United Kingdom',
    joined_at: new Date().toISOString()
  })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create ambassador account' });
    }

    return res.status(200).json({
      success: true,
      ambassadorId: ambassador.id,
      referralCode: ambassador.referral_code
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
