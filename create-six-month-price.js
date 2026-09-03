// create-six-month-price.js
//
// One-off script — run this once locally to create the "6 Months Access"
// price in Stripe. Not part of the deployed site (same pattern as
// create-montura-pro.js and update-montura-pricing.js before it).
//
// HOW TO RUN (Command Prompt):
//   1. In Stripe Dashboard: Developers -> API keys -> Restricted keys ->
//      create one with WRITE access to "Prices" only.
//   2. In Command Prompt:
//        set STRIPE_KEY=rk_live_your_restricted_key_here
//        node create-six-month-price.js
//   3. Copy the price ID it prints out and send it back so it can be
//      wired into pricing.html and the checkout flow.

const STRIPE_KEY = process.env.STRIPE_KEY;
if (!STRIPE_KEY) {
    console.error('Set STRIPE_KEY first, then run again:');
    console.error('  set STRIPE_KEY=rk_live_your_restricted_key_here');
    process.exit(1);
}

const PRODUCT_ID = 'prod_VB4greIAVxrzvZ'; // the existing "Montura Pro" product

async function main() {
    const params = new URLSearchParams();
    params.append('product', PRODUCT_ID);
    params.append('unit_amount', '3499'); // £34.99, in pence
    params.append('currency', 'gbp');
    params.append('recurring[interval]', 'month');
    params.append('recurring[interval_count]', '6'); // bills every 6 months
    params.append('nickname', '6 Months Access (17% off)');

    const res = await fetch('https://api.stripe.com/v1/prices', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${STRIPE_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    });

    const data = await res.json();

    if (!res.ok) {
        console.error('Stripe error:', data);
        process.exit(1);
    }

    console.log('');
    console.log('Created the 6-month price successfully.');
    console.log('Price ID:', data.id);
    console.log('');
    console.log('Send that ID back so it can be wired into the pricing page.');
}

main();
