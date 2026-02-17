import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, referralCode } = req.body;

  if (!email || !referralCode) {
    return res.status(400).json({ error: 'Email and referral code required' });
  }

  try {
    // DEBUG LOGS
    console.log('Login attempt - Email:', email);
    console.log('Login attempt - Referral Code:', referralCode);
    console.log('Uppercase code:', referralCode.toUpperCase());

    // Try exact match first, then try with lowercase amb_ prefix
    const cleanCode = referralCode.trim();
    const lowerCode = cleanCode.toLowerCase().startsWith('amb_') 
      ? 'amb_' + cleanCode.slice(4).toUpperCase()
      : cleanCode;

    console.log('Trying code:', lowerCode);

    const { data: ambassador, error } = await supabase
      .from('ambassadors')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .ilike('referral_code', cleanCode)
      .single();

    console.log('Ambassador found:', ambassador);
    console.log('Supabase error:', error);

    if (error || !ambassador) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({
      success: true,
      ambassadorId: ambassador.id,
      referralCode: ambassador.referral_code
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
