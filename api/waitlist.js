// api/waitlist.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

// ── Klaviyo: add profile to list (corrected API v2024-10-15) ──
async function klaviyoSignup(email, tiktokUsername) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'revision': '2024-07-15'
    };

    try {
        // Add profile to list
        const response = await fetch(`https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                data: {
                    type: 'profile-subscription-bulk-create-job',
                    attributes: {
                        list_id: KLAVIYO_LIST_ID,
                        subscriptions: [
                            {
                                email: email,
                                phone_number: null
                            }
                        ],
                        historical_import: false
                    }
                }
            })
        });

        const result = await response.json();
        console.log('Klaviyo response:', result);

        if (!response.ok) {
            console.error('Klaviyo error:', result);
        }

    } catch (err) {
        console.error('Klaviyo API error:', err);
    }
}

        // 2. Track custom event to trigger your flow
        const eventResponse = await fetch('https://a.klaviyo.com/api/events/', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                data: {
                    type: 'event',
                    attributes: {
                        profile: {
                            data: {
                                type: 'profile',
                                attributes: {
                                    email: email
                                }
                            }
                        },
                        metric: {
                            data: {
                                type: 'metric',
                                attributes: {
                                    name: 'Waitlist Signup'
                                }
                            }
                        },
                        properties: {
                            tiktok_username: tiktokUsername || ''
                        },
                        time: new Date().toISOString()
                    }
                }
            })
        });

        if (!eventResponse.ok) {
            console.error('Klaviyo event error:', await eventResponse.text());
        }

    } catch (err) {
        console.error('Klaviyo API error:', err);
    }
}

export const config = {
    api: {
        bodyParser: true
    }
};

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ── GET /api/waitlist?count=true → live signup count ──
    if (req.method === 'GET') {
        if (req.query.count === 'true') {
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
        return res.status(400).json({ error: 'Invalid request' });
    }

    // ── POST /api/waitlist → submit email + tiktok username ──
    if (req.method === 'POST') {
        const { email, tiktok_username } = req.body || {};

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        try {
            // Check if email already exists
            const { data: existing } = await supabase
                .from('waitlist')
                .select('email')
                .eq('email', email)
                .single();

            if (existing) {
                return res.status(409).json({ message: 'Already on waitlist' });
            }

            // Insert new record
            const { error: insertError } = await supabase
                .from('waitlist')
                .insert({ 
                    email, 
                    tiktok_username: tiktok_username || null 
                });

            if (insertError) {
                console.error('Insert error:', insertError);
                return res.status(500).json({ error: 'Database error' });
            }

            // Fire Klaviyo and wait for it (with timeout)
            try {
                await Promise.race([
                    klaviyoSignup(email, tiktok_username),
                    new Promise((_, reject) => setTimeout(() => reject('timeout'), 5000))
                ]);
            } catch (err) {
                console.error('Klaviyo signup failed:', err);
                // Continue anyway - don't fail the whole request
            }

            return res.status(200).json({ message: 'Success' });
        } catch (err) {
            console.error('Server error:', err);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
