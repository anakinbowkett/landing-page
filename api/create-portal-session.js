// api/create-portal-session.js
//
// Opens Stripe's own hosted billing portal — plan, next bill date, invoices,
// payment method, and cancellation all live there, already built and tested
// by Stripe, so there's no custom cancel logic here to get subtly wrong.

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // Trust the caller's own signed-in session, never a userId they send
        // us in the body — otherwise anyone could open anyone else's portal.
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
