export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, tiktokUsername } = req.body;

  if (!email || !tiktokUsername) {
    return res.status(400).json({ error: 'Email and TikTok username required' });
  }

  try {
    // Use the simpler client-side compatible endpoint
    const url = `https://a.klaviyo.com/client/subscriptions/?company_id=${process.env.KLAVIYO_PUBLIC_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: email,
                  properties: {
                    tiktok_username: tiktokUsername
                  }
                }
              }
            },
            list_id: process.env.KLAVIYO_LIST_ID
          }
        }
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const error = await response.text();
      console.error('Klaviyo error:', error);
      return res.status(500).json({ success: false, error: 'Subscription failed' });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
