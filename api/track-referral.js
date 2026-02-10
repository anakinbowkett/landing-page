import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, email, referralCode } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: 'User ID and email required' });
  }

  try {
    // If no referral code, return success (not all users are referred)
    if (!referralCode) {
      return res.status(200).json({ success: true, referred: false });
    }

    // Find ambassador by referral code
    const { data: ambassador, error: ambassadorError } = await supabase
      .from('ambassadors')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (ambassadorError || !ambassador) {
      console.log('Invalid referral code:', referralCode);
      return res.status(200).json({ success: true, referred: false });
    }

    // Update user profile with ambassador reference
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ referred_by_ambassador: ambassador.id })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      throw updateError;
    }

    // Create referral record
    const { error: referralError } = await supabase
      .from('referrals')
      .insert({
        student_user_id: userId,
        ambassador_id: ambassador.id,
        student_email: email,
        status: 'pending'
      });

    if (referralError) {
      console.error('Error creating referral:', referralError);
      throw referralError;
    }

    // Increment ambassador's total_leads
    await supabase.rpc('increment_ambassador_leads', { 
      ambassador_uuid: ambassador.id 
    });

    return res.status(200).json({ 
      success: true, 
      referred: true,
      ambassadorId: ambassador.id
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
