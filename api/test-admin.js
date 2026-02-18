import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { password } = req.query;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Just fetch ambassadors
    const { data: ambassadors, error } = await supabase
      .from('ambassadors')
      .select('*');

    // Fetch all waitlist commissions
    const { data: commissions, error: commError } = await supabase
      .from('waitlist_commissions')
      .select('*')
      .eq('status', 'payable');

    return res.status(200).json({
      ambassadorCount: ambassadors?.length || 0,
      ambassadors: ambassadors?.map(a => ({
        id: a.id,
        email: a.email,
        name: `${a.first_name} ${a.last_name}`
      })),
      commissionCount: commissions?.length || 0,
      commissions: commissions,
      errors: { ambError: error, commError }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
