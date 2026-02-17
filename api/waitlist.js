const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const crypto = require('crypto');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

// Get real IP from request
function getIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress;
    return ip || 'unknown';
}

// Generate verification token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

async function sendVerificationEmail(email, token, referralCode) {
    const verifyUrl = `https://www.monturalearn.co.uk/api/verify-waitlist?token=${token}&email=${encodeURIComponent(email)}`;
    
    try {
        // Create or update profile in Klaviyo with verification link
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
                            verification_url: verifyUrl,
                            referral_code: referralCode || '',
                            needs_verification: true
                        }
                    }
                }
            })
        });

        const profileResult = await profileResponse.json();
        const profileId = profileResult.data?.id;

        if (!profileId) {
            throw new Error('No profile ID returned');
        }

        // Add to verification list in Klaviyo
        // This triggers your verification email flow in Klaviyo
        if (KLAVIYO_LIST_ID) {
            await fetch(`https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/relationships/profiles/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
                    'revision': '2024-02-15',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    data: [{ type: 'profile', id: profileId }]
                })
            });
        }

        return { success: true };
    } catch (err) {
        console.error('Email error:', err.message);
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

    // GET count - only count verified signups
    if (req.method === 'GET' && req.query.count === 'true') {
        try {
            const { count, error } = await supabase
                .from('waitlist')
                .select('*', { count: 'exact', head: true })
                .eq('verified', true);
            
            if (error) throw error;
            return res.status(200).json({ count: count || 0 });
        } catch (err) {
            console.error('Count error:', err);
            return res.status(500).json({ error: 'Failed to fetch count' });
        }
    }

    // POST signup
    if (req.method === 'POST') {
        const { email, tiktok_username, referral_code } = req.body || {};
        const ip = getIP(req);

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        try {
            // Check if email already exists
            const { data: existing } = await supabase
                .from('waitlist')
                .select('email, verified')
                .eq('email', email.toLowerCase().trim())
                .single();

            if (existing) {
                return res.status(409).json({ message: 'Already on waitlist' });
            }

            // FRAUD CHECK: Max 1 verified signup per IP per 24 hours
            if (ip !== 'unknown') {
                const yesterday = new Date();
                yesterday.setHours(yesterday.getHours() - 24);

                const { data: ipSignups } = await supabase
                    .from('waitlist')
                    .select('id')
                    .eq('ip_address', ip)
                    .eq('verified', true)
                    .gte('created_at', yesterday.toISOString());

                if (ipSignups && ipSignups.length >= 1) {
                    console.log('IP fraud check failed:', ip);
                    // Still return success to not reveal fraud detection
                    // But don't actually save or count it
                    return res.status(200).json({ message: 'Success' });
                }
            }

            // Find ambassador if referral code provided
            let ambassadorId = null;
            let cleanReferralCode = null;

            if (referral_code) {
                const { data: ambassador } = await supabase
                    .from('ambassadors')
                    .select('id, leads_acquired')
                    .ilike('referral_code', referral_code.trim())
                    .single();

                if (ambassador) {
                    // Check ambassador hasn't hit 100 signup cap
                    if (ambassador.leads_acquired >= 100) {
                        console.log('Ambassador hit cap:', referral_code);
                        ambassadorId = null;
                    } else {
                        ambassadorId = ambassador.id;
                        cleanReferralCode = referral_code.trim();
                    }
                }
            }

            // Generate verification token
            const token = generateToken();

            // Insert to Supabase
            const { error: insertError } = await supabase
                .from('waitlist')
                .insert({ 
                    email: email.toLowerCase().trim(),
                    tiktok_username: tiktok_username || null,
                    referral_code: cleanReferralCode,
                    ambassador_id: ambassadorId,
                    verified: false,
                    verification_token: token,
                    ip_address: ip
                });

            if (insertError) {
                console.error('Supabase error:', insertError);
                return res.status(500).json({ error: 'Database error' });
            }

            // If referred, create pending commission record
            if (ambassadorId) {
                await supabase
                    .from('waitlist_commissions')
                    .insert({
                        ambassador_id: ambassadorId,
                        waitlist_email: email.toLowerCase().trim(),
                        referral_code: cleanReferralCode,
                        verified: false,
                        status: 'pending',
                        commission_amount: 0.50
                    });
            }

            // Send verification email via Klaviyo
            try {
                await sendVerificationEmail(
                    email.toLowerCase().trim(), 
                    token, 
                    cleanReferralCode
                );
            } catch (emailErr) {
                console.error('Email failed but continuing:', emailErr.message);
            }

            return res.status(200).json({ message: 'Success' });

        } catch (err) {
            console.error('Server error:', err);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
