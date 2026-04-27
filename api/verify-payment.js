import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
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
