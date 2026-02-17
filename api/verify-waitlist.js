const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { token, email } = req.query;

    if (!token || !email) {
        return res.status(400).send(errorPage('Invalid verification link.'));
    }

    try {
        // Find the waitlist entry
        const { data: entry, error } = await supabase
            .from('waitlist')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .eq('verification_token', token)
            .single();

        if (error || !entry) {
            return res.status(400).send(errorPage('Invalid or expired verification link.'));
        }

        if (entry.verified) {
            return res.status(200).send(successPage('You are already verified!'));
        }

        const now = new Date().toISOString();

        // Mark as verified
        const { error: updateError } = await supabase
            .from('waitlist')
            .update({
                verified: true,
                verified_at: now,
                verification_token: null
            })
            .eq('email', email.toLowerCase().trim())
            .eq('verification_token', token);

        if (updateError) {
            console.error('Update error:', updateError);
            return res.status(500).send(errorPage('Something went wrong. Please try again.'));
        }

        // If referred, update commission to verified + set payable date
        if (entry.ambassador_id) {
            // Payable date = verified_at + 7 days (fraud buffer)
            const payableDate = new Date();
            payableDate.setDate(payableDate.getDate() + 7);

            await supabase
                .from('waitlist_commissions')
                .update({
                    verified: true,
                    verified_at: now,
                    payable_date: payableDate.toISOString(),
                    status: 'verified'
                })
                .eq('waitlist_email', email.toLowerCase().trim())
                .eq('ambassador_id', entry.ambassador_id);

            // Increment ambassador leads count
            const { data: ambassador } = await supabase
                .from('ambassadors')
                .select('leads_acquired')
                .eq('id', entry.ambassador_id)
                .single();

            if (ambassador) {
                await supabase
                    .from('ambassadors')
                    .update({
                        leads_acquired: (ambassador.leads_acquired || 0) + 1
                    })
                    .eq('id', entry.ambassador_id);
            }
        }

        return res.status(200).send(successPage());

    } catch (err) {
        console.error('Verification error:', err);
        return res.status(500).send(errorPage('Something went wrong. Please try again.'));
    }
};

function successPage(message) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified - Montura</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: #f9fafb;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .card {
            background: white;
            border-radius: 16px;
            padding: 3rem;
            max-width: 480px;
            width: 100%;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            border: 2px solid #e5e7eb;
        }
        .tick {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #1d7fe2, #1e88f5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
        }
        .tick svg {
            width: 32px;
            height: 32px;
            color: white;
        }
        h1 {
            font-size: 1.75rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.75rem;
        }
        p {
            font-size: 1rem;
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #1d7fe2, #1e88f5);
            color: white;
            padding: 0.875rem 2rem;
            border-radius: 9999px;
            font-weight: 700;
            text-decoration: none;
            font-size: 0.9375rem;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="tick">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
        </div>
        <h1>${message || "You're on the waitlist!"}</h1>
        <p>Your email has been verified. You'll be the first to know when we launch on 28th February.</p>
        <a href="https://www.monturalearn.co.uk" class="btn">Back to Montura →</a>
    </div>
</body>
</html>`;
}

function errorPage(message) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Failed - Montura</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: #f9fafb;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .card {
            background: white;
            border-radius: 16px;
            padding: 3rem;
            max-width: 480px;
            width: 100%;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            border: 2px solid #fee2e2;
        }
        .icon {
            width: 64px;
            height: 64px;
            background: #fee2e2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
        }
        .icon svg {
            width: 32px;
            height: 32px;
            color: #ef4444;
        }
        h1 {
            font-size: 1.75rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.75rem;
        }
        p {
            font-size: 1rem;
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #1d7fe2, #1e88f5);
            color: white;
            padding: 0.875rem 2rem;
            border-radius: 9999px;
            font-weight: 700;
            text-decoration: none;
            font-size: 0.9375rem;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </div>
        <h1>Verification Failed</h1>
        <p>${message || 'Something went wrong. Please try again.'}</p>
        <a href="https://www.monturalearn.co.uk" class="btn">Back to Montura →</a>
    </div>
</body>
</html>`;
}
