// update-monthly-pricing.js
//
// One-off script — run this once locally to switch Montura Pro's monthly
// price from £6.99 to £8.99, and create a new intro coupon sized correctly
// for the new price (99p off the first month means £8.00 off, not £6.00).
//
// This does NOT touch the old £6.99 price or the old coupon, and does NOT
// affect anyone already subscribed at £6.99 — it only creates new objects.
// Send both printed IDs back once it's done.
//
// HOW TO RUN (Command Prompt):
//   1. In Stripe Dashboard: Developers -> API keys -> Restricted keys ->
//      create one with WRITE access to "Prices" and "Coupons".
//   2. In Command Prompt:
//        set STRIPE_KEY=rk_live_your_restricted_key_here
//        node update-monthly-pricing.js
//   3. Copy both IDs it prints and send them back.

const STRIPE_KEY = process.env.STRIPE_KEY;
if (!STRIPE_KEY) {
    console.error('Set STRIPE_KEY first, then run again:');
    console.error('  set STRIPE_KEY=rk_live_your_restricted_key_here');
    process.exit(1);
}

const PRODUCT_ID = 'prod_VB4greIAVxrzvZ'; // the existing "Montura Pro" product

async function stripePost(path, params) {
    const res = await fetch(`https://api.stripe.com/v1/${path}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${STRIPE_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    });
    const data = await res.json();
    if (!res.ok) {
        console.error(`Stripe error creating ${path}:`, data);
        process.exit(1);
    }
    return data;
}

async function main() {
    // 1. New monthly price: £8.99/month
    const priceParams = new URLSearchParams();
    priceParams.append('product', PRODUCT_ID);
    priceParams.append('unit_amount', '899'); // £8.99, in pence
    priceParams.append('currency', 'gbp');
    priceParams.append('recurring[interval]', 'month');
    priceParams.append('nickname', 'Montura Pro Monthly (£8.99)');
    const price = await stripePost('prices', priceParams);

    // 2. New intro coupon: £8.00 off, once — nets 99p on an £8.99 first invoice
    const couponParams = new URLSearchParams();
    couponParams.append('amount_off', '800'); // £8.00, in pence
    couponParams.append('currency', 'gbp');
    couponParams.append('duration', 'once');
    couponParams.append('name', '99p First Month (8.99 base)');
    const coupon = await stripePost('coupons', couponParams);

    console.log('');
    console.log('Created successfully. Send both of these back:');
    console.log('New monthly price ID:', price.id);
    console.log('New coupon ID:', coupon.id);
    console.log('');
    console.log('The old £6.99 price and old coupon are untouched — nothing');
    console.log('changes for anyone already subscribed until the site is');
    console.log('updated to point at these new IDs.');
}

main();
