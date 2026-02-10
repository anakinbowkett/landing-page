import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'amb_';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, tiktokUsername, discordUsername, country } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !tiktokUsername || !discordUsername || !country) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Generate unique referral code
    let referralCode = generateReferralCode();
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
        referralCode = generateReferralCode();
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
        email: '', // Empty string for now - we'll add email collection later
        tiktok_username: tiktokUsername,
        discord_username: discordUsername,
        country_region: country,
        referral_code: referralCode,
        leads_acquired: 0,
        total_payout: 0.00,
        payout_method: 'PayPal',
        paypal_email: '', // Empty for now
        is_senior: false,
        status: 'active'
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
