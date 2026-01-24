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

    // GUIDE LIBRARY
    const GUIDES = {


      'Product of Prime Factors': `
REFERENCE GUIDE: Product of Prime Factors
DEFINITION: Writing a number as a multiplication of only prime numbers.
METHOD:
Step 1: Start a factor tree - Write the number at the top. Split it into two factors. Pick easy ones like 2 if the number is even.
Step 2: Keep splitting - If any number is not prime, split it again. Keep going until all the numbers at the bottom are prime.
Step 3: Write the answer - Multiply all the prime numbers at the bottom. Use index form if the same prime appears more than once.
EXAMPLE: 24 = 2³ × 3
- Start: 24 splits to 2 × 12
- 12 splits to 2 × 6
- 6 splits to 2 × 3 (both prime now)
- Result: 2 × 2 × 2 × 3 = 2³ × 3
COMMON MISTAKES TO AVOID:
1. Stopping too early (e.g., writing 18 = 2 × 9). 9 is not prime. You must keep splitting until all numbers are prime.
2. Missing a factor (e.g., 24 = 2 × 2 × 3). This only makes 12. You've lost a factor of 2.
3. Not using index form (e.g., writing 2 × 2 × 2 × 3 instead of 2³ × 3). Foundation questions often ask for index form.
`,


'Highest Common Factor (HCF)': `
REFERENCE GUIDE: Highest Common Factor (HCF)
DEFINITION: The biggest number that divides exactly into two or more numbers.
METHOD:
Step 1: List prime factors of each number.
Step 2: Fill a Venn diagram with common factors in the overlapping section, others in separate sections.
Step 3: Multiply the common factors to get the HCF.
EXAMPLE: HCF of 12 and 18 = 6
COMMON MISTAKES TO AVOID:

Choosing the wrong common factor without checking all factors.

Mixing up HCF and LCM.

Not listing all factors before determining the HCF.
`,




      
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




'Ordering Numbers & Rounding': `
REFERENCE GUIDE: Ordering Numbers & Rounding
DEFINITION: Putting numbers in order or changing them to a simpler form by rounding.
METHOD:
Step 1: Mark numbers on a number line covering their range.
Step 2: Round each number according to the place value, rounding up if the next digit is 5 or more.
Step 3: Order the rounded numbers from smallest to largest.
EXAMPLE: Rounded numbers: 46 → 50, 83 → 80, 29 → 30; Ordered: 30, 50, 80
COMMON MISTAKES TO AVOID:

Not paying attention to decimal places when ordering.

Rounding incorrectly without checking the place value.

Mixing ascending and descending order; read the question carefully.
`,







'Number Conversions': `
REFERENCE GUIDE: Number Conversions
DEFINITION: Changing a number between fractions, decimals, and percentages.
METHOD:
Step 1: Use a hundred grid to understand the decimal as parts of 100.
Step 2: Write the fraction and simplify if possible.
Step 3: Convert to a percentage by expressing as out of 100.
EXAMPLE: 0.25 = 1/4 = 25%
COMMON MISTAKES TO AVOID:

Forgetting to multiply or divide by 100 when converting.

Converting in the wrong direction (e.g., dividing instead of multiplying).

Not simplifying the fraction after conversion.
`,


'Order of Operations (BIDMAS)': `
REFERENCE GUIDE: Order of Operations (BIDMAS)
DEFINITION: BIDMAS tells you the correct order to do calculations so everyone gets the same answer.
METHOD:
Step 1: Do the brackets first.
Step 2: Carry out any multiplication or division, working left to right.
Step 3: Finish with addition or subtraction.
EXAMPLE: 10 − (2 + 3) × 2 = 0
COMMON MISTAKES TO AVOID:

Working left to right without following BIDMAS.

Ignoring brackets.

Doing division before multiplication instead of left to right.
`,



'Inequalities': `
REFERENCE GUIDE: Inequalities
DEFINITION: An inequality shows that one number is bigger or smaller than another.
METHOD:
Step 1: Draw a number line and mark key numbers around the value.
Step 2: Add a circle at the value—open if not included, closed if included.
Step 3: Shade the side that satisfies the inequality.
EXAMPLE: x > 2 → open circle at 2, shaded to the right.
COMMON MISTAKES TO AVOID:

Using the wrong inequality symbol.

Confusing open and closed circles.

Shading the wrong side of the number line.
`,



      


      









      
    };

    const topic = questionData?.topic || '';
    const selectedGuide = GUIDES[topic];

    // Build system prompt - guide FIRST, own knowledge as FALLBACK
    const systemPrompt = `You are a helpful math tutor for GCSE Foundation students (age 13-16).

STUDENT'S CURRENT QUESTION:
"${questionData?.question || 'No question provided'}"

The correct answer is: ${questionData?.correctAnswer || 'Not available'}

${selectedGuide ? `
REFERENCE GUIDE FOR THIS TOPIC:
${selectedGuide}

CRITICAL: Use the guide above as your PRIMARY teaching resource. Reference its method, examples, and common mistakes.
` : ''}

${!selectedGuide ? `
NOTE: No specific guide available for "${topic}". Use your GCSE Foundation maths knowledge to help with this specific question: "${questionData?.question}". Focus specifically on what THIS question asks.
` : ''}

YOUR TEACHING APPROACH:
- You KNOW the exact question the student is working on (shown above)
${selectedGuide ? '- ALWAYS reference the guide method when explaining' : '- Apply your knowledge specifically to THIS question'}
- Keep responses to 1-2 sentences MAXIMUM (saves costs)
- Use Socratic method: ask guiding questions, don't explain everything
- NO formatting (no **, no #, no lists) - plain conversational text only
- Be warm, encouraging, and personal
${!selectedGuide ? '- Since there\'s no guide, use your expertise but keep it directly relevant to the question asked' : ''}

EXAMPLES:
Student: "I don't get it"
${selectedGuide ? 
`You: "No worries! For this question, let's start with step 1 from the guide. What do you think we need to do first?"` :
`You: "No worries! For this specific question about ${questionData?.question?.split(' ').slice(-4).join(' ') || 'this problem'}, what part is confusing you?"`}

Student: "Do you know what the question is?"
You: "Yes! You're working on: ${questionData?.question}. What part are you stuck on?"

Student: "How do I solve this?"
${selectedGuide ?
`You: "Looking at your question, let's use the guide's method. What's the first step we need to do?"` :
`You: "For this question, let's break it down. Can you tell me what you've tried so far?"`}

CRITICAL: ${selectedGuide ? 'Reference the guide method.' : 'Focus specifically on the question at hand.'} Be concise to save tokens.`;

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
        max_tokens: 400
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
