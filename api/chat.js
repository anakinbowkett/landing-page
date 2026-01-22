export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message, conversationHistory, questionData } = req.body;

    // GUIDE LIBRARY - Add all 800 lecture guides here
    const GUIDES = {
      'LCM - Lowest Common Multiple': `
REFERENCE GUIDE: Lowest Common Multiple (LCM)
DEFINITION: The smallest number that appears in both times tables.
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
`,

      'Product of Prime Factors': `
REFERENCE GUIDE: Product of Prime Factors
DEFINITION: A product of prime factors is a number written as the multiplication of only prime numbers.
METHOD:
Step 1: Start with a factor tree - pick two numbers that multiply to your target
Step 2: Break down non-prime numbers - keep splitting until all are prime
Step 3: Write as product of primes - collect all primes and multiply to verify
EXAMPLE: 60 = 2 × 2 × 3 × 5
- Start: 60 splits to 6 × 10
- 6 splits to 2 × 3 (both prime)
- 10 splits to 2 × 5 (both prime)
- Result: 2 × 2 × 3 × 5
COMMON MISTAKES TO AVOID:
1. Including non-primes (using 4, 6, 9 instead of breaking into primes)
2. Missing factors when multiplying back
3. Wrong order or skipping smallest primes first
Prime numbers: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...
`
      
      // ADD MORE GUIDES HERE AS YOU CREATE THEM:
      // 'Trigonometry': `...`,
      // 'Pythagoras Theorem': `...`,
      // etc for all 800 topics
    };

    // Auto-detect which guide to use based on topic
    const topic = questionData?.topic || '';
    const selectedGuide = GUIDES[topic] || `No specific guide available for ${topic}. Use general GCSE maths teaching principles.`;

    const systemPrompt = `You are a helpful math tutor for GCSE Foundation students (age 13-16).

Use this reference guide to help students:
${selectedGuide}

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
You: "Let's use the method from the guide. Can you tell me the first step?"

User: "I don't understand"
You: "No worries! Looking at the guide, what do you think we need to do first?"`;

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

    let reply = data.choices[0].message.content;
    reply = reply.replace(/\*\*/g, '');
    reply = reply.replace(/\*/g, '');
    reply = reply.replace(/#{1,6}\s/g, '');

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
