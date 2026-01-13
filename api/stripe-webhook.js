// api/stripe-webhook.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
    api: {
        bodyParser: false,
    },
};

async function buffer(readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;

            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
}

async function handleCheckoutCompleted(session) {
    console.log('Checkout completed:', session.id);

    const userId = session.client_reference_id || session.metadata?.userId;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    if (!userId) {
        console.error('No userId found in session');
        return;
    }

    // Determine which product was purchased by checking the line items
    let productType = 'core_bundle'; // default
    
    if (session.line_items?.data?.[0]?.price?.id) {
        const priceId = session.line_items.data[0].price.id;
        // Check if it's the per-subject price
        if (priceId === 'price_1Sn40vCCgLNEbNJs0VMTqmej') {
            productType = 'per_subject';
        }
    }

    // Update user profile in Supabase
    const { error } = await supabase
        .from('user_profiles')
        .update({
            subscription_status: 'active',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            trial_end_date: null,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId);

    if (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }

    console.log(`User ${userId} subscription activated with product type: ${productType}`);
}

async function handleSubscriptionUpdated(subscription) {
    console.log('Subscription updated:', subscription.id);

    const userId = subscription.metadata.userId;
    const status = subscription.status;

    if (!userId) {
        console.error('No userId in subscription metadata');
        return;
    }

    let subscriptionStatus = 'trial';
    if (status === 'active') {
        subscriptionStatus = 'active';
    } else if (status === 'canceled' || status === 'unpaid') {
        subscriptionStatus = 'expired';
    }

    const { error } = await supabase
        .from('user_profiles')
        .update({
            subscription_status: subscriptionStatus,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId);

    if (error) {
        console.error('Error updating subscription status:', error);
        throw error;
    }
}

async function handleSubscriptionDeleted(subscription) {
    console.log('Subscription deleted:', subscription.id);

    const userId = subscription.metadata.userId;

    if (!userId) {
        console.error('No userId in subscription metadata');
        return;
    }

    const { error } = await supabase
        .from('user_profiles')
        .update({
            subscription_status: 'expired',
            stripe_subscription_id: null,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId);

    if (error) {
        console.error('Error updating subscription:', error);
        throw error;
    }
}

async function handlePaymentSucceeded(invoice) {
    console.log('Payment succeeded:', invoice.id);
    // Additional logic if needed
}

async function handlePaymentFailed(invoice) {
    console.log('Payment failed:', invoice.id);
    
    const customerId = invoice.customer;
    
    // Find user by customer ID and update status
    const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (fetchError || !profile) {
        console.error('Could not find user for failed payment');
        return;
    }

    const { error } = await supabase
        .from('user_profiles')
        .update({
            subscription_status: 'expired',
            updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

    if (error) {
        console.error('Error updating failed payment status:', error);
    }
}
