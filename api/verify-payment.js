import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Merged with the old verify-waitlist.js to stay under Vercel's 12-function
// cap on the Hobby plan. That page wasn't linked from anywhere in the site
// (checked) and its "launch on 25th April" content is long stale, so its
// static confirmation page now lives here behind a GET request instead of
// its own file. POST still does real payment verification, unchanged.
function waitlistConfirmationPage(req, res) {
    return res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Montura</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f9fafb; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .card { background: white; border-radius: 16px; padding: 3rem; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.12); border: 2px solid #e5e7eb; }
        .tick { width: 64px; height: 64px; background: linear-gradient(135deg, #1d7fe2, #1e88f5); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
        .tick svg { width: 32px; height: 32px; color: white; }
        h1 { font-size: 1.75rem; font-weight: 700; color: #111827; margin-bottom: 0.75rem; }
        p { font-size: 1rem; color: #6b7280; line-height: 1.6; margin-bottom: 2rem; }
        .btn { display: inline-block; background: linear-gradient(135deg, #1d7fe2, #1e88f5); color: white; padding: 0.875rem 2rem; border-radius: 9999px; font-weight: 700; text-decoration: none; font-size: 0.9375rem; }
    </style>
</head>
<body>
    <div class="card">
        <div class="tick">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
        </div>
        <h1>You're on the waitlist!</h1>
        <p>You'll be the first to know when we launch on 25th April.</p>
        <a href="https://www.monturalearn.co.uk" class="btn">Back to Montura →</a>
    </div>
</body>
</html>`);
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        return waitlistConfirmationPage(req, res);
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { sessionId, userId } = req.body;
        
        if (!sessionId || !userId) {
            return res.status(400).json({ error: 'Missing sessionId or userId' });
        }
        
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ error: 'Payment not completed' });
        }

        // Don't let a request with someone else's valid session ID upgrade
        // a different account — the session must actually belong to this user.
        const sessionUserId = session.client_reference_id || session.metadata?.userId;
        if (sessionUserId !== userId) {
            return res.status(403).json({ error: 'Session does not belong to this account' });
        }
        
        const { data, error } = await supabase
            .from('user_profiles')
            .update({
                subscription_status: 'active',
                stripe_customer_id: session.customer,
                stripe_subscription_id: session.subscription,
                subscription_start_date: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select();
        
        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Failed to update subscription' });
        }

        return res.status(200).json({ 
            success: true,
            productType: session.metadata?.productType || 'standard'
        });
        
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
}
