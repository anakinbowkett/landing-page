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
    console.log('Subscribing:', email, tiktokUsername);

    // Use Klaviyo's server-side track API
    const response = await fetch('https://a.klaviyo.com/api/events/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_KEY}`,
        'revision': '2024-10-15'
      },
      body: JSON.stringify({
        data: {
          type: 'event',
          attributes: {
            profile: {
              $email: email,
              tiktok_username: tiktokUsername
            },
            metric: {
              name: 'Waitlist Signup'
            },
            properties: {
              source: 'homepage',
              list_id: process.env.KLAVIYO_LIST_ID
            },
            time: new Date().toISOString()
          }
        }
      })
    });

    console.log('Event response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Event API error:', errorText);
    }

    // Now subscribe them to the list using the correct endpoint
    const listResponse = await fetch(
      `https://a.klaviyo.com/api/lists/${process.env.KLAVIYO_LIST_ID}/profiles/`,
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
              attributes: {
                email: email,
                properties: {
                  tiktok_username: tiktokUsername,
                  signup_source: 'homepage'
                }
              }
            }
          ]
        })
      }
    );

    console.log('List add response status:', listResponse.status);

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error('List API error:', errorText);
      throw new Error('Failed to add to list');
    }

    console.log('Successfully added to list!');
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
