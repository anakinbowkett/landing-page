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

    // Step 1: Subscribe profile to list (this handles both new and existing profiles)
    const subscribeResponse = await fetch(
      `https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_KEY}`,
          'revision': '2024-10-15'
        },
        body: JSON.stringify({
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              profiles: {
                data: [
                  {
                    type: 'profile',
                    attributes: {
                      email: email,
                      properties: {
                        tiktok_username: tiktokUsername,
                        signup_source: 'homepage'
                      }
                    }
                  }
                ]
              }
            },
            relationships: {
              list: {
                data: {
                  type: 'list',
                  id: process.env.KLAVIYO_LIST_ID
                }
              }
            }
          }
        })
      }
    );

    if (!subscribeResponse.ok) {
      const errorData = await subscribeResponse.json();
      console.error('Subscription error:', errorData);
      throw new Error(`Klaviyo API error: ${JSON.stringify(errorData)}`);
    }

    const subscribeData = await subscribeResponse.json();
    console.log('Successfully subscribed:', subscribeData);
    
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Klaviyo subscription error:', error);
    return res.status(500).json({ error: error.message || 'Failed to subscribe' });
  }
}
