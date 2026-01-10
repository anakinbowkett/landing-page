// api/verify-payment.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { sessionId, userId } = req.body;
        
        if (!sessionId || !userId) {
            return res.status(400).json({ 
                error: 'Missing required fields: sessionId, userId' 
            });
        }
        
        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ 
                success: false, 
                error: 'Payment not completed' 
            });
        }
        
        // Get product type from metadata
        const productType = session.metadata.productType || 'standard';
        const stripeUserId = session.metadata.userId;
        
        // Verify the userId matches
        if (stripeUserId !== userId) {
            return res.status(403).json({ 
                success: false, 
                error: 'User ID mismatch' 
            });
        }
        
        // Update user in Supabase
        const { data, error } = await supabase
            .from('user_profiles')
            .update({
                subscription_status: 'active',
                subscription_type: productType,
                stripe_customer_id: session.customer,
                stripe_subscription_id: session.subscription,
                subscription_start_date: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', stripeUserId)
            .select();
        
        if (error) {
            console.error('Supabase update error:', error);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to update subscription status' 
            });
        }
        
        return res.status(200).json({ 
            success: true, 
            productType: productType,
            subscriptionId: session.subscription
        });
        
    } catch (error) {
        console.error('Payment verification error:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message || 'Internal server error' 
        });
    }
}
