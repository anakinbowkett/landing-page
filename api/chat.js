export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message, conversationHistory, questionData } = req.body;

    // LCM REFERENCE GUIDE - fed to AI as context
const lcmGuide = `
REFERENCE GUIDE: Lowest Common Multiple (LCM)

DEFINITION:
The smallest number that appears in both times tables.

METHOD:
Step 1: List multiples of the first number (write out its times table)
Step 2: List multiples of the second number (write out its times table)
Step 3: Find the smallest number that appears in BOTH lists

EXAMPLE: LCM of 4 and 6
- Multiples of 4: 4, 8, 12, 16, 20, 24...
- Multiples of 6: 6, 12, 18, 24, 30...
- Both lists contain 12 and 24
- The smallest match is 12
- Therefore, LCM of 4 and 6 = 12

COMMON MISTAKES TO AVOID:
1. Finding HCF instead of LCM (LCM must be larger than both numbers)
2. Just multiplying the numbers (this only works sometimes)
3. Stopping too early when listing multiples
`;

const systemPrompt = `You are a helpful math tutor for GCSE Foundation students (age 13-16).

Use this reference guide to help students:
${lcmGuide}

Current Question: ${questionData?.question || 'No question selected'}
Correct Answer: ${questionData?.correctAnswer || 'Not available'}

CRITICAL INSTRUCTIONS - MUST FOLLOW:
- Keep responses to 1-2 sentences MAXIMUM
- Use the Socratic method: ask guiding questions instead of explaining everything
- Never give the full solution - guide them step-by-step
- Reference the guide's method briefly
- NO formatting (no **, no #, no lists)
- Be conversational and encouraging

EXAMPLES OF GOOD RESPONSES:
User: "How do I solve this?"
You: "Let's use the listing method from the guide. Can you write out the first 5 multiples of 4?"

User: "4, 8, 12, 16, 20"
You: "Perfect! Now list the first 5 multiples of 6."

User: "6, 12, 18, 24, 30"
You: "Great! Look at both lists - which is the smallest number that appears in both?"`;

    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'DeepSeek API error');
    }

   // Remove markdown formatting for cleaner display
let reply = data.choices[0].message.content;
reply = reply.replace(/\*\*/g, ''); // Remove bold **
reply = reply.replace(/\*/g, '');   // Remove italic *
reply = reply.replace(/#{1,6}\s/g, ''); // Remove headers

return res.status(200).json({
  reply: reply
});

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.message 
    });
  }
}
