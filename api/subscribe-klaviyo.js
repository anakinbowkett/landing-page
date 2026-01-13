export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
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
    console.log('Attempting to subscribe:', email, tiktokUsername);
    console.log('Using List ID:', process.env.KLAVIYO_LIST_ID);

    const response = await fetch(
      `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_LIST_ID}/subscribe`,
      {
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
              signup_source: 'homepage'
            }
          }]
        })
      }
    );

    const responseData = await response.json();
    console.log('Klaviyo response:', responseData);

    if (!response.ok) {
      throw new Error(`Klaviyo API error: ${JSON.stringify(responseData)}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Klaviyo subscription error:', error);
    return res.status(500).json({ error: error.message || 'Failed to subscribe' });
  }
}
