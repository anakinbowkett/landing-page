export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, tiktokUsername } = req.body;

  if (!email || !tiktokUsername) {
    return res.status(400).json({ error: 'Email and TikTok username required' });
  }

  try {
    const response = await fetch('https://a.klaviyo.com/api/v2/list/' + process.env.KLAVIYO_LIST_ID + '/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.KLAVIYO_PRIVATE_KEY
      },
      body: JSON.stringify({
        profiles: [{
          email: email,
          properties: {
            tiktok_username: tiktokUsername,
            signup_source: 'dashboard'
          }
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Klaviyo API error');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Klaviyo subscription error:', error);
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
