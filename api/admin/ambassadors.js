const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_SECRET = process.env.ADMIN_SECRET;

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    // Auth check
    if (req.headers['x-admin-secret'] !== ADMIN_SECRET) {
        return res.status(401).json({ error: 'Unauthorised' });
    }

    try {
        const { data: ambassadors, error } = await supabase
            .from('ambassadors')
            .select('id, name, email, referral_code, total_signups, total_conversions, total_revenue, created_at')
            .order('total_revenue', { ascending: false });

        if (error) throw error;

        return res.status(200).json({ ambassadors });

    } catch (err) {
        console.error('Admin ambassadors error:', err);
        return res.status(500).json({ error: 'Failed to fetch ambassadors' });
    }
};
