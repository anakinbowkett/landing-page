import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  // ============================================================
  // DOWNLOAD TRACKING ROUTE
  // Handles GET and POST to /api/track-referral?action=downloads
  // Completely separate from referral logic below.
  // ============================================================
  if (req.query.action === 'downloads') {

    // GET — return all 15 download counts
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('pdf_downloads')
        .select('pdf_index, download_count')
        .order('pdf_index', { ascending: true });

      if (error) {
        console.error('Download GET error:', error);
        return res.status(500).json({ error: 'Failed to fetch counts' });
      }

      const counts = Array(15).fill(0);
      (data || []).forEach(row => {
        counts[row.pdf_index] = row.download_count;
      });

      return res.status(200).json({ counts });
    }

    // POST — increment count for a given pdf_index
    if (req.method === 'POST') {
      const pdfIndex = parseInt(req.body?.pdf_index, 10);

      if (isNaN(pdfIndex) || pdfIndex < 0 || pdfIndex > 14) {
        return res.status(400).json({ error: 'Invalid pdf_index' });
      }

      // Try atomic RPC first, fall back to manual increment
      const { error: rpcError } = await supabase.rpc('increment_download_count', {
        p_index: pdfIndex
      });

      if (rpcError) {
        // Fallback manual increment
        const { data: current } = await supabase
          .from('pdf_downloads')
          .select('download_count')
          .eq('pdf_index', pdfIndex)
          .single();

        const { error: updateError } = await supabase
          .from('pdf_downloads')
          .update({
            download_count: (current?.download_count || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('pdf_index', pdfIndex);

        if (updateError) {
          console.error('Download update error:', updateError);
          return res.status(500).json({ error: 'Failed to update count' });
        }
      }

      // Return all updated counts
      const { data: allData } = await supabase
        .from('pdf_downloads')
        .select('pdf_index, download_count')
        .order('pdf_index', { ascending: true });

      const counts = Array(15).fill(0);
      (allData || []).forEach(row => { counts[row.pdf_index] = row.download_count; });

      return res.status(200).json({ counts });
    }

    // Any other method on downloads route
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ============================================================
  // ORIGINAL REFERRAL TRACKING ROUTE — UNCHANGED
  // Everything below this line is exactly as it was before.
  // ============================================================

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
