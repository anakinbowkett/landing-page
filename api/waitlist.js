// api/waitlist.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

// ── Klaviyo: identify profile + add to list + fire event ──
async function klaviyoSignup(email, phone) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `pk_${KLAVIYO_API_KEY}`
    };

    // 1. Identify the profile
    await fetch('https://a.klaviyo.com/api/identify', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            data: {
                type: 'profile',
                attributes: {
                    email: email,
                    ...(phone ? { phone_number: phone } : {})
                }
            }
        })
    });

    // 2. Add to your waitlist list
    await fetch(`https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/profiles/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            data: {
                type: 'profile',
                attributes: { email: email }
            }
        })
    });

    // 3. Fire the event that triggers your Klaviyo flow
    await fetch('https://a.klaviyo.com/api/track', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            data: {
                type: 'event',
                attributes: {
                    event_name: 'waitlist_signup',
                    customer_properties: { email: email },
                    time: new Date().toISOString()
                }
            }
        })
    });
}

export const config = {
    api: {
        bodyParser: true
    }
};

export default async function handler(req, res) {

    // ── GET /api/waitlist?count=true → live signup count ──
    if (req.method === 'GET') {
        if (req.query.count === 'true') {
            try {
                const { count } = await supabase
                    .from('waitlist')
                    .select('*', { count: 'exact', head: true });
                return res.status(200).json({ count: count || 0 });
            } catch (err) {
                return res.status(500).json({ error: 'Failed to fetch count' });
            }
        }
        return res.status(400).json({ error: 'Invalid request' });
    }

    // ── POST /api/waitlist → submit email + phone ──
    if (req.method === 'POST') {
        const { email, phone } = req.body || {};

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        try {
            const { error } = await supabase
                .from('waitlist')
                .insert({ email, phone })
                .on('conflict', 'email')
                .ignore();

            // Fire Klaviyo in the background — don't let it block the response
            klaviyoSignup(email, phone).catch(() => {
                console.error('Klaviyo signup failed');
            });

            // 23505 = unique violation, meaning they're already on the list
            if (error && error.code === '23505') {
                return res.status(409).json({ message: 'Already on waitlist' });
            }

            if (error) {
                return res.status(500).json({ error: 'Database error' });
            }

            return res.status(200).json({ message: 'Success' });

        } catch (err) {
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
