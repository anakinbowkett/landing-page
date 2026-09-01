// api/create-checkout-session.js
//
// Handles three related jobs in one function (Vercel's Hobby plan caps
// serverless functions at 12): starting a new Checkout Session, opening
// the Stripe Billing Portal for an existing subscriber, and sending the
// SMS code used to gate the 99p intro offer by phone number. Selected by
// body.action, defaulting to "checkout" so nothing already calling this
// endpoint needs to change.
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// The one-time 99p-first-month coupon. Created once in Stripe — see
// update-montura-pricing.js for how it was set up.
const INTRO_OFFER_COUPON_ID = process.env.STRIPE_INTRO_COUPON_ID;

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_VERIFY_SERVICE = process.env.TWILIO_VERIFY_SERVICE_SID;

function twilioAuthHeader() {
    return 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64');
}

async function twilioSendOtp(phone) {
    const res = await fetch(`https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE}/Verifications`, {
        method: 'POST',
        headers: {
            'Authorization': twilioAuthHeader(),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: phone, Channel: 'sms' }).toString(),
    });
    return res.ok;
}

async function twilioCheckOtp(phone, code) {
    const res = await fetch(`https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE}/VerificationCheck`, {
        method: 'POST',
        headers: {
            'Authorization': twilioAuthHeader(),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: phone, Code: code }).toString(),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'approved';
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.body?.action === 'portal') {
        return handlePortalSession(req, res);
    }
    if (req.body?.action === 'send-otp') {
        return handleSendOtp(req, res);
    }
    return handleCheckoutSession(req, res);
}

async function handleSendOtp(req, res) {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ error: 'Missing phone number' });
        }
        if (!TWILIO_SID || !TWILIO_AUTH || !TWILIO_VERIFY_SERVICE) {
            return res.status(500).json({ error: 'Phone verification is not configured yet' });
        }
        const sent = await twilioSendOtp(phone);
        if (!sent) {
            return res.status(400).json({ error: 'Could not send that code — check the number and try again' });
        }
        return res.status(200).json({ sent: true });
    } catch (error) {
        console.error('Send OTP error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

async function handleCheckoutSession(req, res) {
    try {
        const { priceId, userId, userEmail, successUrl, cancelUrl, quantity = 1, phone, otpCode } = req.body;
        
        // Validate required fields
        if (!priceId || !userId || !userEmail) {
            return res.status(400).json({ 
                error: 'Missing required fields: priceId, userId, userEmail' 
            });
        }

        // Decide the intro-offer eligibility ourselves, server-side, from our
        // own database — never from anything the checkout page claims. This
        // is what actually makes the 99p offer one-time-only.
        let usedIntroOffer = true; // fail closed: unknown account never gets a free discount
        try {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('used_intro_offer')
                .eq('id', userId)
                .single();
            usedIntroOffer = profile?.used_intro_offer ?? true;
        } catch {
            usedIntroOffer = true;
        }

        let verifiedPhone = null;

        // Only an account that hasn't used the offer yet gets asked for phone
        // verification at all — nobody who's already paying full price is
        // ever bothered with this step.
        if (!usedIntroOffer && INTRO_OFFER_COUPON_ID) {
            if (!phone || !otpCode) {
                return res.status(400).json({ error: 'phone_verification_required' });
            }

            const codeOk = await twilioCheckOtp(phone, otpCode);
            if (!codeOk) {
                return res.status(400).json({ error: 'That code didn\'t match — request a new one and try again.' });
            }

            // Genuine, verified phone — now check whether it's already
            // claimed the offer on a different account. New/first-time
            // numbers stay eligible; a reused number just quietly loses
            // the discount, nothing else happens to either account.
            const { data: phoneRecord } = await supabase
                .from('used_intro_phone_numbers')
                .select('first_used_by')
                .eq('phone_number', phone)
                .maybeSingle();

            if (phoneRecord) {
                usedIntroOffer = true; // already claimed elsewhere — full price
            } else {
                verifiedPhone = phone; // eligible — recorded once payment actually completes
            }
        }

        const sessionParams = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: quantity,
                },
            ],
            mode: 'subscription',
            success_url: successUrl || `${req.headers.origin}/dashboard.html?session_id={CHECKOUT_SESSION_ID}&payment_success=true`,
            cancel_url: cancelUrl || `${req.headers.origin}/pricing.html`,
            customer_email: userEmail,
            client_reference_id: userId,
            metadata: {
                userId: userId,
                userEmail: userEmail,
                productType: req.body.productType || 'standard',
                usedIntroOffer: (!usedIntroOffer && INTRO_OFFER_COUPON_ID) ? 'true' : 'false',
                verifiedPhone: verifiedPhone || '',
            },
            subscription_data: {
                metadata: {
                    userId: userId,
                }
            }
        };

        if (!usedIntroOffer && INTRO_OFFER_COUPON_ID) {
            sessionParams.discounts = [{ coupon: INTRO_OFFER_COUPON_ID }];
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create(sessionParams);
        
        return res.status(200).json({ 
            id: session.id,
            url: session.url 
        });
    } catch (error) {
        console.error('Stripe error:', error);
        return res.status(500).json({ 
            error: error.message || 'Internal server error' 
        });
    }
}

async function handlePortalSession(req, res) {
    try {
        // Trust the caller's own signed-in session, never a userId they
        // send us in the body — otherwise anyone could open anyone else's portal.
        const token = (req.headers.authorization || '').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Missing auth token' });
        }

        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        if (userError || !userData?.user) {
            return res.status(401).json({ error: 'Invalid session' });
        }
        const userId = userData.user.id;

        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single();

        if (profileError || !profile?.stripe_customer_id) {
            return res.status(400).json({ error: 'No billing account yet — subscribe first from the pricing page.' });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${req.headers.origin}/settings.html`,
        });

        return res.status(200).json({ url: portalSession.url });
    } catch (error) {
        console.error('Portal session error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
