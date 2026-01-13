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
    console.log('Subscribing:', email);

    // Create profile and subscribe to list in one call
    const response = await fetch(
      `https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`,
      {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_KEY}`,
          'revision': '2024-10-15'
        },
        body: JSON.stringify({
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              custom_source: 'Website Signup',
              profiles: {
                data: [
                  {
                    type: 'profile',
                    attributes: {
                      email: email,
                      properties: {
                        tiktok_username: tiktokUsername
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

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      console.error('API Error:', responseText);
      throw new Error(`Klaviyo returned ${response.status}`);
    }

    const data = responseText ? JSON.parse(responseText) : {};
    console.log('Success:', data);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
