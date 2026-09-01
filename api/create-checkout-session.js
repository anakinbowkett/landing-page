// api/create-checkout-session.js
//
// Handles two related jobs in one function (Vercel's Hobby plan caps
// serverless functions at 12): starting a new Checkout Session, and
// opening the Stripe Billing Portal for an existing subscriber. Selected
// by body.action, defaulting to "checkout" so nothing already calling
// this endpoint needs to change.
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// The one-time 99p-first-month coupon. Created once in Stripe — see
// update-montura-pricing.js for how it was set up.
const INTRO_OFFER_COUPON_ID = process.env.STRIPE_INTRO_COUPON_ID;

// Free abuse check: collapses "the same real inbox, made to look like
// different addresses" down to one canonical form. Gmail specifically
// ignores dots in the local part and treats anything after a "+" as an
// alias — john.doe@gmail.com, johndoe@gmail.com and john+promo@gmail.com
// all land in the same inbox. Plus-aliasing is stripped for every
// provider since most support it; dot-stripping only applies to Gmail,
// since dots are meaningful on most other providers.
function normalizeEmail(email) {
    const trimmed = (email || '').toLowerCase().trim();
    const [local, domain] = trimmed.split('@');
    if (!domain) return trimmed;
    let normalizedLocal = local.split('+')[0];
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
        normalizedLocal = normalizedLocal.replace(/\./g, '');
        return `${normalizedLocal}@gmail.com`;
    }
    return `${normalizedLocal}@${domain}`;
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
    return handleCheckoutSession(req, res);
}

async function handleCheckoutSession(req, res) {
    try {
        const { priceId, userId, userEmail, successUrl, cancelUrl, quantity = 1 } = req.body;
        
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

        let normalizedEmail = null;

        // Second, free check: has this same real inbox (under a different-
        // looking address) already claimed the offer? Costs nothing —
        // pure string comparison against our own table.
        if (!usedIntroOffer && INTRO_OFFER_COUPON_ID) {
            normalizedEmail = normalizeEmail(userEmail);
            try {
                const { data: emailRecord } = await supabase
                    .from('used_intro_normalized_emails')
                    .select('first_used_by')
                    .eq('normalized_email', normalizedEmail)
                    .maybeSingle();
                if (emailRecord) {
                    usedIntroOffer = true; // same inbox already claimed it — full price
                }
            } catch {
                // If the check itself fails, don't block a genuine first-timer over it.
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
                normalizedEmail: (!usedIntroOffer && INTRO_OFFER_COUPON_ID) ? normalizedEmail : '',
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
