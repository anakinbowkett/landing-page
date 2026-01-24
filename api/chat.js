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
DEFINITION: An inequality shows that one number is bigger or smaller than another using symbols like >, <, ≥, ≤.
METHOD:
Step 1: Draw the number line – Mark a horizontal line and evenly space the key numbers that will appear in your inequality.
Step 2: Add the circle – Mark the number in your inequality with a circle. Use a filled circle for ≥ or ≤, open for > or <.
Step 3: Draw the arrow – Show the solution region by drawing an arrow from the circle in the correct direction that satisfies the inequality.
EXAMPLE: Number line showing x ≥ 2 with filled circle at 2 and arrow to the right.
COMMON MISTAKES TO AVOID:

Wrong inequality direction (writing < instead of > or vice versa).

Confusing closed vs open circles (filled vs open for ≥, ≤ vs >, <).

Not showing an arrow for the solution region.
`,



      
'Error Intervals': `
REFERENCE GUIDE: Error Intervals
DEFINITION: An error interval shows the range of values a rounded number could actually be.
METHOD:
Step 1: Mark the rounded number on a number line covering the nearby values.
Step 2: Calculate the lower and upper bounds by subtracting and adding the rounding amount.
Step 3: Draw the interval on the number line to show all possible values.
EXAMPLE: 46 rounded to nearest 10 → 45 ≤ x < 55.
COMMON MISTAKES TO AVOID:

Not subtracting or adding the correct amount for bounds.

Mixing ≤ and < symbols incorrectly.

Confusing rounding to different place values.
`,

      
'Bounds and Truncation': `
REFERENCE GUIDE: Bounds and Truncation
DEFINITION: Bounds show the smallest and largest values a number can be, and truncation cuts a number down to a certain decimal without rounding.
METHOD:
Step 1: Identify the precision – Check the number of decimal places or significant figures given. For 1 decimal place, consider ±0.05.
Step 2: Calculate bounds – Lower bound = number − 0.05, Upper bound = number + 0.05. Example: 3.5 → 3.45 and 3.55.
Step 3: Show on number line – Draw a number line covering the bounds, mark lower and upper bounds with closed circles, and shade the interval between them.
EXAMPLE: Lower bound = 3.45, Upper bound = 3.55, shown on a number line.
COMMON MISTAKES TO AVOID:

Mixing upper and lower bounds (writing 1.5 instead of 1.499… for lower bound).

Rounding instead of truncating (truncation always cuts digits).

Using wrong interval notation (ensure correct brackets and ≤, < symbols).
`,




'Rounding, Decimals, and Significant Figures': `
REFERENCE GUIDE: Rounding, Decimals, and Significant Figures
DEFINITION: Rounding changes a number to make it simpler, decimals show fractions as parts of 1, and significant figures show the most important digits.
METHOD:
Step 1: Identify what to round – Check if the question asks for decimal places or significant figures. For 2 decimal places, focus on digits after the point. For 2 sig figs, count the first two non-zero digits from the left.
Step 2: Round to decimal places – Look at the digit after the place you're rounding to. If 5 or more, round up; if less, keep the digit. Example: 3.746 → 3.75 (2 dp).
Step 3: Round to significant figures – Count the first 2 non-zero digits. Round the second digit based on the next digit. Example: 3.746 → 3.7 (2 sig figs).
EXAMPLE: 2 decimal places: 3.75, 2 significant figures: 3.7
COMMON MISTAKES TO AVOID:

Rounding the wrong digit (check the place value carefully).

Confusing significant figures with decimal places (count first non-zero digits for sig figs).

Dropping digits instead of rounding (adjust last digit based on next digit).
`,




'Multiplying Fractions': `
REFERENCE GUIDE: Multiplying Fractions
DEFINITION: Multiplying fractions means multiplying the numerators together and multiplying the denominators together.
METHOD:
Step 1: Multiply the numerators – Multiply the top numbers of each fraction.
Step 2: Multiply the denominators – Multiply the bottom numbers of each fraction.
Step 3: Simplify the fraction – Divide the numerator and denominator by their highest common factor if possible.
EXAMPLE: 2/3 × 1/4 → (2 × 1)/(3 × 4) = 2/12 = 1/6
COMMON MISTAKES TO AVOID:

Adding instead of multiplying the fractions.

Only multiplying the numerators and forgetting the denominators.

Not simplifying the final fraction when possible.
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
