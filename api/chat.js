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
DEFINITION: Ordering numbers arranges them from smallest to largest (ascending) or largest to smallest (descending). Rounding approximates a number to a specific place value.

METHOD:
Step 1: Check the rounding place – Identify which digit to round (nearest 10, 100, whole number, etc.).
Step 2: Look at the next digit – If it’s 5 or more, round up; if less than 5, round down.
Step 3: Adjust remaining digits – Digits to the right of the rounded place become 0 (whole numbers) or are dropped (decimals).
Step 4: Compare and order – Use rounded or original numbers to arrange from smallest to largest or vice versa.

EXAMPLE:
Round 276, 243, 289 to the nearest 10 and order smallest to largest.
Step 1: Round numbers → 276 → 280, 243 → 240, 289 → 290
Step 2: Order → 240, 280, 290

COMMON MISTAKES TO AVOID:
Rounding the wrong place – e.g., 276 → 270 instead of 280.

Halfway confusion – e.g., 45 rounded to nearest 10 → 40 instead of 50.

Ordering decimals incorrectly – e.g., 0.5, 0.45, 0.55 ordered as 0.45, 0.55, 0.5 instead of 0.45, 0.5, 0.55.
`,







'Number Conversions': `
REFERENCE GUIDE: Number Conversions
DEFINITION: Converting numbers lets you switch between fractions, decimals, and percentages. All three forms can represent the same value in different ways.

METHOD:
Step 1: Fraction → Decimal – Divide the numerator (top) by the denominator (bottom). Example: 3 ÷ 4 = 0.75
Step 2: Decimal → Percentage – Multiply the decimal by 100 and add %. Example: 0.75 × 100 = 75%
Step 3: Percentage → Decimal – Divide by 100 and remove %. Example: 40% ÷ 100 = 0.4
Step 4: Fraction → Percentage – Convert to decimal first, then multiply by 100. Example: 3/5 → 0.6 → 60%

EXAMPLE:
Convert 7/8 into a decimal and percentage.
Step 1: Fraction → Decimal → 7 ÷ 8 = 0.875
Step 2: Decimal → Percentage → 0.875 × 100 = 87.5%
Final Answer: Decimal: 0.875, Percentage: 87.5%

COMMON MISTAKES TO AVOID:
Incorrect division for fractions → decimals (e.g., 3/4 → 0.34 instead of 0.75).

Forgetting to multiply by 100 when converting decimals → percentages (e.g., 0.6 → 0.6% instead of 60%).

Not simplifying fractions fully (e.g., 50/100 → 25/50 instead of 1/2).
`,

'Order of Operations (BIDMAS)': `
REFERENCE GUIDE: Order of Operations (BIDMAS)
DEFINITION: BIDMAS shows the order to calculate expressions to get the correct answer: Brackets, Indices, Division/Multiplication (left to right), Addition/Subtraction (left to right).

METHOD:
Step 1: Brackets – Solve anything inside brackets first to simplify the expression.
Step 2: Indices / Powers – Calculate squares, cubes, roots, etc. after brackets.
Step 3: Multiply or Divide – Move left to right across the expression, performing multiplication and division in order.
Step 4: Add or Subtract – Finally, handle addition and subtraction left to right.

EXAMPLE:
Calculate 2 + 3 × (4 + 2)² ÷ 3
Step 1: Brackets → 4 + 2 = 6 → 2 + 3 × 6² ÷ 3
Step 2: Indices → 6² = 36 → 2 + 3 × 36 ÷ 3
Step 3: Multiply / Divide left to right → 3 × 36 = 108 → 108 ÷ 3 = 36 → 2 + 36
Step 4: Add / Subtract → 2 + 36 = 38
Final Answer: 38

COMMON MISTAKES TO AVOID:

Ignoring brackets – calculating outside first leads to wrong results.

Doing addition or subtraction before multiplication/division – violates BIDMAS order.

Left-to-right errors – performing multiplication/division or addition/subtraction out of sequence.
`,



'Inequalities': `
REFERENCE GUIDE: Inequalities
DEFINITION: Inequalities show the relationship between numbers or expressions using <, >, ≤, and ≥. They indicate which values are bigger, smaller, or equal.

METHOD:
Step 1: Identify the inequality – Spot the symbol and determine which side is the variable to know the direction.
Step 2: Isolate the variable – Perform operations to get the variable alone. Remember: multiplying or dividing by a negative flips the inequality.
Step 3: Check your solution – Substitute your answer into the original inequality or represent it on a number line to verify correctness.

EXAMPLE:
Solve 3x - 5 < 7
Step 1: Add 5 → 3x < 12
Step 2: Divide by 3 → x < 4
Step 3: Check: x = 3 → 3×3 - 5 = 4 < 7 ✓
Final Answer: x < 4

COMMON MISTAKES TO AVOID:

Writing the inequality the wrong way – e.g., x > 5 instead of x < 5.

Forgetting to flip the inequality when multiplying/dividing by a negative – changes the solution.

Misrepresenting on a number line – shading the wrong side or using wrong endpoints.
`,


      
'Error Intervals': `
REFERENCE GUIDE: Error Intervals
DEFINITION: An error interval shows the hidden range of values a rounded number could actually be. Rounded values look exact, but the true value lies somewhere within a range.

METHOD:
Step 1: Identify what the number was rounded to – nearest whole number, nearest 10, nearest 0.1, etc. This tells you the rounding unit.
Step 2: Find the halfway point – halve the rounding unit. Rounding always switches halfway between values.
Step 3: Calculate the bounds – subtract the halfway amount to find the lower bound, and add it to find the upper bound.
Step 4: Write the interval correctly – the lower bound is included (≤), but the upper bound is not included (<), because it would round up.

EXAMPLE:
A number rounded to 10 to the nearest whole number:
Rounding unit = 1
Halfway point = 0.5
Lower bound = 10 − 0.5 = 9.5
Upper bound = 10 + 0.5 = 10.5
So the error interval is: 9.5 ≤ x < 10.5

COMMON MISTAKES TO AVOID:

Using the full rounding unit instead of half (e.g. ±1 instead of ±0.5).

Including the upper bound with ≤ (10.5 would round to 11, not 10).

Mixing up the bounds or writing them in the wrong order.
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
