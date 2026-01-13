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

    // Step 1: Create or update profile
    const profileResponse = await fetch(
      'https://a.klaviyo.com/api/profiles/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_KEY}`,
          'revision': '2024-10-15'
        },
        body: JSON.stringify({
          data: {
            type: 'profile',
            attributes: {
              email: email,
              properties: {
                tiktok_username: tiktokUsername,
                signup_source: 'homepage'
              }
            }
          }
        })
      }
    );

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      console.error('Profile creation error:', errorData);
      throw new Error(`Profile API error: ${JSON.stringify(errorData)}`);
    }

    const profileData = await profileResponse.json();
    const profileId = profileData.data.id;
    console.log('Profile created/updated:', profileId);

    // Step 2: Add profile to list
    const listResponse = await fetch(
      `https://a.klaviyo.com/api/lists/${process.env.KLAVIYO_LIST_ID}/relationships/profiles/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_KEY}`,
          'revision': '2024-10-15'
        },
        body: JSON.stringify({
          data: [
            {
              type: 'profile',
              id: profileId
            }
          ]
        })
      }
    );

    if (!listResponse.ok) {
      const errorData = await listResponse.json();
      console.error('List subscription error:', errorData);
      throw new Error(`List API error: ${JSON.stringify(errorData)}`);
    }

    console.log('Successfully added to list');
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Klaviyo subscription error:', error);
    return res.status(500).json({ error: error.message || 'Failed to subscribe' });
  }
}
