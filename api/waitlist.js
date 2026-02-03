const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

async function addToKlaviyo(email, tiktokUsername) {
    try {
        // Simple API v2 format that works
        const response = await fetch('https://a.klaviyo.com/api/v2/list/' + KLAVIYO_LIST_ID + '/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: KLAVIYO_API_KEY,
                profiles: [
                    {
                        email: email,
                        $tiktok_username: tiktokUsername || ''
                    }
                ]
            })
        });

        const result = await response.json();
        console.log('Klaviyo response:', result);
        return result;

    } catch (err) {
        console.error('Klaviyo error:', err);
        throw err;
    }
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET count
    if (req.method === 'GET' && req.query.count === 'true') {
        try {
            const { count, error } = await supabase
                .from('waitlist')
                .select('*', { count: 'exact', head: true });
            
            if (error) throw error;
            return res.status(200).json({ count: count || 0 });
        } catch (err) {
            console.error('Count error:', err);
            return res.status(500).json({ error: 'Failed to fetch count' });
        }
    }

    // POST signup
    if (req.method === 'POST') {
        const { email, tiktok_username } = req.body || {};

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        try {
            // Check existing
            const { data: existing } = await supabase
                .from('waitlist')
                .select('email')
                .eq('email', email)
                .single();

            if (existing) {
                return res.status(409).json({ message: 'Already on waitlist' });
            }

            // Insert to Supabase
            const { error: insertError } = await supabase
                .from('waitlist')
                .insert({ 
                    email, 
                    tiktok_username: tiktok_username || null 
                });

            if (insertError) {
                console.error('Supabase error:', insertError);
                return res.status(500).json({ error: 'Database error' });
            }

            // Add to Klaviyo (wait for it this time to see errors)
            try {
                await addToKlaviyo(email, tiktok_username);
                console.log('Successfully added to Klaviyo');
            } catch (klaviyoErr) {
                console.error('Klaviyo failed but continuing:', klaviyoErr);
                // Don't fail the request, but log it
            }

            return res.status(200).json({ message: 'Success' });

        } catch (err) {
            console.error('Server error:', err);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
