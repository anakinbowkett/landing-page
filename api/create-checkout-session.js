// api/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
        const { priceId, userId, userEmail, successUrl, cancelUrl, quantity = 1 } = req.body;
        
        // Validate required fields
        if (!priceId || !userId || !userEmail) {
            return res.status(400).json({ 
                error: 'Missing required fields: priceId, userId, userEmail' 
            });
        }
        
        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: quantity,
                },
            ],
            mode: 'subscription',
            success_url: successUrl || `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${req.headers.origin}/pricing.html`,
            customer_email: userEmail,
            client_reference_id: userId,
            metadata: {
                userId: userId,
                userEmail: userEmail,
            },
            subscription_data: {
                metadata: {
                    userId: userId,
                }
            }
        });
        
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
