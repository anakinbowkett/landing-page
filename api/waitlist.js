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
        console.log('Adding to Klaviyo...');
        console.log('List ID:', KLAVIYO_LIST_ID);
        console.log('Email:', email);
        
        // Step 1: Create or update the profile
        const profileResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
            method: 'POST',
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
                'revision': '2024-02-15',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    type: 'profile',
                    attributes: {
                        email: email,
                        properties: {
                            tiktok_username: tiktokUsername || ''
                        }
                    }
                }
            })
        });

        const profileResult = await profileResponse.json();
        console.log('Profile response status:', profileResponse.status);
        
        if (!profileResponse.ok && profileResponse.status !== 409) {
            console.error('Profile creation error:', profileResult);
            throw new Error('Failed to create profile');
        }

        // Get profile ID (either from creation or from existing)
        const profileId = profileResult.data?.id;
        
        if (!profileId) {
            console.error('No profile ID returned');
            throw new Error('No profile ID');
        }

        console.log('Profile ID:', profileId);

        // Step 2: Subscribe profile to list
        const subscribeResponse = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
            method: 'POST',
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
                'revision': '2024-02-15',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    type: 'profile-subscription-bulk-create-job',
                    attributes: {
                        profiles: {
                            data: [
                                {
                                    type: 'profile',
                                    id: profileId,
                                    attributes: {
                                        email: email,
                                        subscriptions: {
                                            email: {
                                                marketing: {
                                                    consent: 'SUBSCRIBED'
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    relationships: {
                        list: {
                            data: {
                                type: 'list',
                                id: KLAVIYO_LIST_ID
                            }
                        }
                    }
                }
            })
        });

        const subscribeResult = await subscribeResponse.json();
        console.log('Subscribe response status:', subscribeResponse.status);
        console.log('Subscribe result:', JSON.stringify(subscribeResult, null, 2));

        if (!subscribeResponse.ok) {
            console.error('Subscribe error:', subscribeResult);
            throw new Error('Failed to subscribe to list');
        }

        console.log('Successfully added to Klaviyo!');
        return subscribeResult;

    } catch (err) {
        console.error('Klaviyo error:', err.message);
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
            // Check existing in Supabase
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

            // Add to Klaviyo
            try {
                await addToKlaviyo(email, tiktok_username);
                console.log('Klaviyo completed successfully');
            } catch (klaviyoErr) {
                console.error('Klaviyo failed but continuing:', klaviyoErr.message);
                // Don't fail the whole request
            }

            return res.status(200).json({ message: 'Success' });

        } catch (err) {
            console.error('Server error:', err);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
