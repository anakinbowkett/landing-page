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

      
      
'Bounds and Truncation': `
REFERENCE GUIDE: Bounds and Truncation
DEFINITION: Bounds show the smallest and largest possible values a number could be. Truncation cuts digits without rounding, keeping the lower bound at the truncated number and setting the upper bound just before the next step.

METHOD:
Step 1: Identify truncation level – Check how many decimal places or digits are kept. This tells you the “unit” being removed.
Step 2: Set the lower bound – The truncated number itself is the lower bound.
Step 3: Set the upper bound – Add the next smallest unit at that decimal to get the upper bound. Example: truncated to 1 decimal → add 0.1.
Step 4: Express as an inequality – Write lower ≤ x < upper.

EXAMPLE:
Truncate 24.76 to 1 decimal:
Truncated number = 24.7
Lower bound = 24.7
Upper bound = 24.8
Inequality: 24.7 ≤ x < 24.8

COMMON MISTAKES TO AVOID:

Confusing truncation with rounding – truncation never increases digits.

Swapping lower and upper bounds – lower bound must always come first.

Forgetting the upper bound adjustment – it must reach just before the next unit.
`,




'Rounding Decimals & Significant Figures': `
REFERENCE GUIDE: Rounding Decimals & Significant Figures
DEFINITION: Rounding adjusts a number to a specified decimal place or a set number of significant figures to simplify it while keeping it close to the original value.

METHOD:
Step 1: Check what to round to – Determine if the question asks for decimal places or significant figures.
Step 2: Locate the target digit – For decimals, count digits after the decimal point; for significant figures, start from the first non-zero digit.
Step 3: Look at the next digit – If it is 5 or more, round up; if less than 5, round down.
Step 4: Adjust remaining digits – For decimals, drop extra digits; for significant figures, keep the correct total number of significant digits, adding zeros if necessary.

EXAMPLE:
Round 0.004567 to 2 significant figures.
Step 1: Identify first 2 non-zero digits → 4 and 5
Step 2: Next digit is 6 → round 5 up to 6
Step 3: Result → 0.0046

COMMON MISTAKES TO AVOID:
Rounding the wrong type – e.g., rounding to decimal places instead of significant figures.

Miscounting digits – e.g., 4.567 to 1 decimal place → writing 4.56 instead of 4.6.

Ignoring leading zeros in significant figures – e.g., 0.00456 to 2 sf → writing 0.0045 instead of 0.0046.
`,



'Multiplying Fractions': `
REFERENCE GUIDE: Multiplying Fractions
DEFINITION: Multiplying fractions combines two or more fractions by multiplying the numerators together and the denominators together, then simplifying if possible.

METHOD:
Step 1: Multiply the numerators – Take the top numbers of each fraction and multiply. Example: 2 × 3 = 6
Step 2: Multiply the denominators – Take the bottom numbers of each fraction and multiply. Example: 5 × 7 = 35
Step 3: Write the new fraction – Combine numerator over denominator. Example: 6/35
Step 4: Simplify – Divide numerator and denominator by any common factor to simplify. Example: 8/12 → 2/3

EXAMPLE:
Multiply 2/3 × 4/5
Step 1: Multiply numerators → 2 × 4 = 8
Step 2: Multiply denominators → 3 × 5 = 15
Step 3: Combine → 8/15
Step 4: Simplify → 8/15 (already simplified)

COMMON MISTAKES TO AVOID:
Multiplying across incorrectly – e.g., 2/3 × 4/5 → 6/15 instead of 8/15.

Not simplifying – e.g., 4/8 × 2/3 → 8/24 left unsimplified instead of 1/3.

Confusing multiplication with addition – e.g., 1/2 × 1/3 → 2/5 (incorrect).
`,




'Dividing Fractions': `
REFERENCE GUIDE: Dividing Fractions
DEFINITION: Dividing fractions means turning the division into a multiplication by using the reciprocal of the second fraction, then simplifying the result.

METHOD:
Step 1: Keep the first fraction – Do not change the first fraction.
Step 2: Change the sign – Change the division sign (÷) into a multiplication sign (×).
Step 3: Flip the second fraction – Swap the numerator and denominator to find the reciprocal.
Step 4: Multiply – Multiply the numerators together and the denominators together.
Step 5: Simplify – Divide the numerator and denominator by any common factor.

EXAMPLE:
Divide 2/3 ÷ 4/5
Step 1: Keep, Change, Flip → 2/3 × 5/4
Step 2: Multiply → 2 × 5 = 10, 3 × 4 = 12
Step 3: Write fraction → 10/12
Step 4: Simplify → 5/6

COMMON MISTAKES TO AVOID:
Forgetting to flip the second fraction – e.g., multiplying by 4/5 instead of 5/4.

Flipping the wrong fraction – flipping the first fraction instead of the second.

Not simplifying – e.g., leaving 10/12 instead of simplifying to 5/6.
`,




'Adding Fractions': `
REFERENCE GUIDE: Adding Fractions
DEFINITION: Adding fractions means combining parts of a whole. Fractions can only be added when they have the same denominator, so a common denominator may be needed first.

METHOD:
Step 1: Check the denominators – If they are the same, add straight away. If not, find a common denominator.
Step 2: Find a common denominator – Choose a number both denominators divide into easily.
Step 3: Convert the fractions – Change each fraction so they have the same denominator without changing their value.
Step 4: Add the numerators – Add the top numbers only. Keep the denominator the same.
Step 5: Simplify – Reduce the fraction if possible to get the final answer.

EXAMPLE:
Work out 2/3 + 1/6
Step 1: Denominators are different → 3 and 6
Step 2: Common denominator = 6
Step 3: Convert → 2/3 = 4/6, 1/6 stays the same
Step 4: Add → 4/6 + 1/6 = 5/6

COMMON MISTAKES TO AVOID:
Adding the denominators – e.g., 1/4 + 1/4 = 2/8 (denominators never get added).

Not finding a common denominator – e.g., 1/2 + 1/3 = 2/5.

Not simplifying – e.g., leaving 6/8 instead of simplifying to 3/4.
`,



'Subtracting Fractions': `
REFERENCE GUIDE: Subtracting Fractions
DEFINITION: Subtracting fractions means finding the difference between two fractions. Fractions must have the same denominator before subtraction.

METHOD:
Step 1: Check the denominators – If they match, subtract straight away; if not, find a common denominator first.
Step 2: Find a common denominator – Use a number both denominators divide into so the fractions are comparable.
Step 3: Convert the fractions – Adjust each fraction so they have the same denominator without changing their value.
Step 4: Subtract the numerators – Subtract only the top numbers; keep the denominator the same.
Step 5: Simplify – Reduce the fraction to its lowest terms if possible.

EXAMPLE:
Work out 2/3 − 1/6
Step 1: Denominators 3 and 6 → do not match
Step 2: Lowest common denominator = 6
Step 3: Convert fractions → 2/3 = 4/6, 1/6 stays
Step 4: Subtract numerators → 4/6 − 1/6 = 3/6
Step 5: Simplify → 3/6 = 1/2

COMMON MISTAKES TO AVOID:
Subtracting denominators – e.g., 5/8 − 3/8 = 2/0 (wrong).

No common denominator – e.g., 1/2 − 1/3 = 0/1 (fractions must be converted first).

Negative numerator mistake – e.g., 1/4 − 3/4 = 2/4 instead of −2/4.
`,








      'Simplifying Fractions': `
REFERENCE GUIDE: Simplifying Fractions
DEFINITION: Simplifying fractions means reducing them to their smallest equivalent form without changing their value, by dividing numerator and denominator by their greatest common factor (GCF).

METHOD:
Step 1: Identify numerator and denominator – Know which number is on top and which is on the bottom.
Step 2: Find the GCF – Determine the largest number that divides both numerator and denominator exactly.
Step 3: Divide numerator and denominator – Divide both by the GCF to get a smaller, equivalent fraction.
Step 4: Check – Ensure no further simplification is possible; numerator and denominator share no common factors besides 1.

EXAMPLE:
Simplify 18/24
Step 1: Numerator = 18, Denominator = 24
Step 2: GCF of 18 and 24 = 6
Step 3: Divide → 18 ÷ 6 = 3, 24 ÷ 6 = 4
Step 4: Check → 3 and 4 share no common factors → fully simplified

COMMON MISTAKES TO AVOID:
Dividing by the wrong number – e.g., 12/16 ÷ 2 → 6/8 (not fully simplified).

Only simplifying one number – e.g., 15/25 → 3/25 (forgot denominator).

Assuming simplification isn’t needed – e.g., leaving 4/8 instead of 1/2.
`,



'Mixed & Improper Fractions': `
REFERENCE GUIDE: Mixed & Improper Fractions
DEFINITION: Mixed fractions have a whole number and a fraction (e.g., 2 1/3). Improper fractions have a numerator equal to or larger than the denominator (e.g., 7/3). You can convert between the two for calculations.

METHOD:
Step 1: Convert mixed to improper – Multiply the whole number by the denominator, then add the numerator. Example: 2 1/3 → (2×3)+1 = 7/3
Step 2: Convert improper to mixed – Divide numerator by denominator: quotient = whole number, remainder = numerator of fraction. Example: 7/3 → 2 1/3
Step 3: Perform operations – For addition, subtraction, multiplication, or division, it is often easier to work with improper fractions.
Step 4: Simplify – Reduce fractions to lowest terms after calculation.
Step 5: Convert back if needed – Express answer as a mixed number if required.

EXAMPLE:
Convert 3 2/5 to improper fraction
Step 1: Multiply whole number by denominator → 3×5 = 15
Step 2: Add numerator → 15 + 2 = 17
Step 3: Write as fraction → 17/5

COMMON MISTAKES TO AVOID:
Adding numerator and denominator separately – e.g., 3 2/5 → 5/7 (wrong).

Forgetting to multiply the whole number when converting mixed to improper.

Leaving answers unsimplified or not converting back when required.
`,



'Fractions of an Amount': `
REFERENCE GUIDE: Fractions of an Amount
DEFINITION: Finding a fraction of an amount means calculating a portion of a total number. To do this, divide by the denominator and then multiply by the numerator.

METHOD:
Step 1: Divide by the denominator – Split the total amount into equal parts according to the denominator. Example: 2/5 of 50 → 50 ÷ 5 = 10
Step 2: Multiply by the numerator – Take the number of parts indicated by the numerator. Example: 10 × 2 = 20
Step 3: Check – Ensure the result makes sense; it should be smaller than the total if the fraction is less than 1.

EXAMPLE:
Find 3/4 of 60
Step 1: Divide by denominator → 60 ÷ 4 = 15
Step 2: Multiply by numerator → 15 × 3 = 45
Step 3: Result → 45

COMMON MISTAKES TO AVOID:
Dividing by the numerator instead of the denominator – e.g., 2/5 of 50 → 50 ÷ 2 × 5 (wrong).

Multiplying before dividing – can sometimes give the right answer by chance but is not systematic.

Not checking reasonableness – e.g., 3/4 of 20 = 5 (too small, should be 15).
`,



'Percentage of an Amount': `
REFERENCE GUIDE: Percentage of an Amount
DEFINITION: Calculating a percentage of an amount means finding a part of the total based on a fraction out of 100. Convert the percentage to a decimal or fraction, then multiply by the amount.

METHOD:
Step 1: Convert percentage – Change the percentage into a decimal or fraction. Example: 20% → 0.2
Step 2: Multiply by total amount – Multiply the decimal or fraction by the total. Example: 0.2 × 50 = 10
Step 3: Check – Ensure the result makes sense; it should be less than the total if percentage < 100.

EXAMPLE:
Find 20% of 50
Step 1: Convert percentage → 20% → 0.2
Step 2: Multiply → 0.2 × 50 = 10
Step 3: Result → 10

COMMON MISTAKES TO AVOID:
Using percentage as a whole number – e.g., 20 × 50 = 1000 (wrong).

Dividing instead of multiplying – e.g., 50 ÷ 0.2 = 250 (wrong).

Forgetting to check reasonableness – e.g., 110% of 50 = 55, but writing 5 (too small).
`,





'Reverse Percentages': `
REFERENCE GUIDE: Reverse Percentages
DEFINITION: Reverse percentage problems find the original amount before a percentage increase or decrease. Work backwards from the new amount to the starting value by dividing by (1 ± decimal).

METHOD:
Step 1: Identify change type – Determine if it’s an increase or decrease; this affects whether you add or subtract the decimal in the calculation.
Step 2: Convert percentage – Divide the percentage by 100 to get a decimal. Example: 20% → 0.2
Step 3: Set up equation – New Amount = Original × (1 ± decimal); plus for increase, minus for decrease.
Step 4: Rearrange and calculate – Original = New Amount ÷ (1 ± decimal)
Step 5: Check – Multiply the original amount by (1 ± decimal) to verify it equals the new amount.

EXAMPLE:
The price after a 20% increase is £120. What was the original price?
Step 1: Convert percentage → 20% → 0.2
Step 2: Equation → 120 = Original × 1.2
Step 3: Solve → Original = 120 ÷ 1.2 = 100
Step 4: Check → 100 × 1.2 = 120 ✅

A value decreased by 15% to £85. Find the original value.
Step 1: Convert percentage → 15% → 0.15
Step 2: Equation → 85 = Original × 0.85
Step 3: Solve → Original = 85 ÷ 0.85 = 100
Step 4: Check → 100 × 0.85 = 85 ✅

COMMON MISTAKES TO AVOID:
Adding instead of subtracting for a decrease – e.g., 15% decrease, but using 1 + 0.15

Forgetting to convert percentage to decimal – e.g., 20 instead of 0.2

Not checking answer – Original × (1 ± decimal) ≠ New Amount
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
