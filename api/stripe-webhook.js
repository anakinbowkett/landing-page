// api/stripe-webhook.js
//
// IMPORTANT HISTORY: as of [live-webhook fix, this session] this endpoint
// had NEVER actually been receiving events - no webhook destination
// existed in Stripe's Live mode at all. subscription_status was only ever
// being set by verify-payment.js's client-side confirmation, which meant
// used_intro_offer, the anti-abuse tables, and (critically) demoting
// subscription_status back to 'expired' on cancellation/payment failure
// had never once run for a real customer. Fixed by creating the actual
// webhook destination in Stripe (Developers -> Webhooks) pointing at
// /api/stripe-webhook, subscribed to exactly the 6 events this file
// handles, with STRIPE_WEBHOOK_SECRET set in Vercel to match. If anything
// webhook-dependent (cancellation, anti-abuse tracking, referral
// commissions) seems broken again, check this destination still exists
// and its signing secret still matches the env var before assuming it's
// a code bug.
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

    let buf;
    let sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Handle different request body formats
    if (req.body && typeof req.body === 'string') {
        buf = Buffer.from(req.body);
    } else if (req.body && req.body.type === 'Buffer') {
        buf = Buffer.from(req.body.data);
    } else if (Buffer.isBuffer(req.body)) {
        buf = req.body;
    } else {
        buf = await buffer(req);
    }

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

            case 'customer.subscription.created':
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

    // productType is set as metadata at checkout time (create-checkout-session.js) —
    // reading it here directly, since Stripe does NOT include line_items on this
    // event unless you explicitly expand it, so the old lookup always fell
    // through to the default.
    const productType = session.metadata?.productType || 'core_bundle';
    const usedIntroOffer = session.metadata?.usedIntroOffer === 'true';

    // Update user profile in Supabase
    const profileUpdate = {
        subscription_status: 'active',
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        updated_at: new Date().toISOString()
    };
    // Only ever flips false -> true, and only once payment has actually
    // gone through — never set at checkout creation, so an abandoned
    // checkout never burns someone's one shot at the offer.
    if (usedIntroOffer) {
        profileUpdate.used_intro_offer = true;
    }

    const { error } = await supabase
        .from('user_profiles')
        .update(profileUpdate)
        .eq('id', userId);

    if (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }

    // Track the card fingerprint on any intro-offer redemption. This never
    // touches the payment that already went through — a duplicate here just
    // means the account's used_intro_offer flag gets set too, so a *future*
    // checkout on either account won't get the discount again. Never blocks
    // sign-in or the purchase itself; a legitimate shared family card only
    // ever loses the discount a second time, nothing more.
    if (usedIntroOffer) {
        try {
            const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
                expand: ['payment_intent.payment_method'],
            });
            const fingerprint = fullSession.payment_intent?.payment_method?.card?.fingerprint;

            if (fingerprint) {
                const { data: existing } = await supabase
                    .from('used_intro_card_fingerprints')
                    .select('first_used_by')
                    .eq('fingerprint', fingerprint)
                    .maybeSingle();

                if (!existing) {
                    await supabase.from('used_intro_card_fingerprints').insert({
                        fingerprint,
                        first_used_by: userId,
                    });
                } else if (existing.first_used_by !== userId) {
                    console.warn(`Intro offer reused: card already claimed by ${existing.first_used_by}, now also on ${userId}`);
                    // This account already got the discount on this purchase (can't
                    // undo that safely), but make sure it can never happen again.
                    await supabase
                        .from('user_profiles')
                        .update({ used_intro_offer: true })
                        .eq('id', userId);
                }
            }
        } catch (fingerprintError) {
            // Never let this side-check break the main checkout flow.
            console.error('Fingerprint tracking error (non-fatal):', fingerprintError);
        }

        // Record the normalized email as claimed. Free check, same pattern
        // as the fingerprint one — only recorded once payment has actually
        // gone through.
        const normalizedEmail = session.metadata?.normalizedEmail;
        if (normalizedEmail) {
            try {
                await supabase
                    .from('used_intro_normalized_emails')
                    .upsert({ normalized_email: normalizedEmail, first_used_by: userId }, { onConflict: 'normalized_email', ignoreDuplicates: true });
            } catch (emailError) {
                console.error('Email normalization tracking error (non-fatal):', emailError);
            }
        }
    }

    // 🆕 AMBASSADOR LOGIC: Check if user was referred
    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('referred_by_ambassador')
        .eq('id', userId)
        .single();

    if (userProfile?.referred_by_ambassador) {
        // Update referral status to active
        await supabase
            .from('referrals')
            .update({ 
                status: 'active',
                stripe_customer_id: customerId,
                first_payment_date: new Date().toISOString()
            })
            .eq('student_user_id', userId);

        console.log(`Referral activated for ambassador: ${userProfile.referred_by_ambassador}`);
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

    let subscriptionStatus = 'expired';
    if (status === 'active' || status === 'trialing') {
        subscriptionStatus = 'active';
    }
    // canceled, unpaid, past_due, incomplete, incomplete_expired, paused
    // all fall through to 'expired' — never silently hand back a fresh trial.

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

    // 🆕 AMBASSADOR LOGIC: Mark referral as cancelled
    await supabase
        .from('referrals')
        .update({ status: 'cancelled' })
        .eq('student_user_id', userId);
}

async function handlePaymentSucceeded(invoice) {
    console.log('Payment succeeded:', invoice.id);
    
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;

    if (!subscriptionId) return;

    // 🆕 AMBASSADOR COMMISSION LOGIC
    // Find user by Stripe customer ID
    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('id, referred_by_ambassador')
        .eq('stripe_customer_id', customerId)
        .single();

    if (!userProfile || !userProfile.referred_by_ambassador) {
        return;
    }

    // Get current billing month (format: YYYY-MM)
    const billingMonth = new Date().toISOString().slice(0, 7);

    // Check if commission already exists for this month
    const { data: existingCommission } = await supabase
        .from('monthly_commissions')
        .select('id')
        .eq('student_user_id', userProfile.id)
        .eq('billing_month', billingMonth)
        .single();

    if (existingCommission) {
        console.log('Commission already exists for this month');
        return;
    }

    // Create new commission record (£2 per month)
    const { error: commissionError } = await supabase
        .from('monthly_commissions')
        .insert({
            student_user_id: userProfile.id,
            ambassador_id: userProfile.referred_by_ambassador,
            billing_month: billingMonth,
            is_active: true,
            commission_amount: 2.00,
            stripe_subscription_id: subscriptionId
        });

    if (commissionError) {
        console.error('Error creating commission:', commissionError);
    } else {
        console.log(`Commission created for user ${userProfile.id} - Month: ${billingMonth}`);
    }
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
