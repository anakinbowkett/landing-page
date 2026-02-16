// Allowed origins
const ALLOWED_ORIGINS = [
  'https://www.monturalearn.co.uk',
  'https://monturalearn.co.uk',
  /^https:\/\/.*-anakins-projects-5f9470f9\.vercel\.app$/,
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
].filter(Boolean);

export default async function handler(req, res) {
  // CORS setup
  const origin = req.headers.origin;
  const isAllowed = ALLOWED_ORIGINS.some(allowed => 
    typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
  );
  
  if (!origin || !isAllowed) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      message, 
      conversationHistory, 
      questionData,
      // NEW: For marking requests
      isMarkingRequest,
      studentText,
      allLineData
    } = req.body;

    // ============================================
    // ROUTE 1: MARKING REQUEST (English Literature)
    // ============================================
    if (isMarkingRequest) {
      return await handleMarkingRequest(req, res, {
        studentText,
        allLineData,
        questionData
      });
    }

    // ============================================
    // ROUTE 2: CHAT REQUEST (All subjects Q&A)
    // ============================================
    return await handleChatRequest(req, res, {
      message,
      conversationHistory,
      questionData
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
}

// ============================================
// MARKING HANDLER (English Literature Essays)
// ============================================
async function handleMarkingRequest(req, res, { studentText, allLineData, questionData }) {
  
  // MODEL ANSWERS (Perfect 8/8 responses - cached as input tokens)
  const MODEL_ANSWERS = {
  // Q4: 2 marks - Name two features
  'English_Lit_Q4': `Two key features of a Shakespearean tragedy are:
1. Fatal flaw - The hero has a weakness that causes their downfall (Macbeth's ambition)
2. Death of the hero - The tragic hero dies at the end (Macbeth is killed)`,

  // Q5: 3 marks - Explain why tragedy
  'English_Lit_Q5': `Macbeth is considered a tragedy for three reasons:
1. Hero to villain arc - Macbeth starts as a brave hero but becomes a murderous tyrant
2. Fatal flaw destroys him - His ambition (fatal flaw) leads to his downfall
3. Death restores order - Macbeth dies and Malcolm restores peace to Scotland`,

  // Q6: 4 marks - Structure of play
  'English_Lit_Q6': `The structure of Macbeth follows a five-act tragic pattern:
Act 1: Macbeth meets the witches and his ambition is awakened
Act 2: Macbeth murders King Duncan to seize the throne
Act 3: Macbeth becomes paranoid and kills his friend Banquo
Act 4: Macbeth visits the witches again and receives more prophecies
Act 5: Macbeth is killed by Macduff and order is restored to Scotland`
};

  const questionId = questionData?.exerciseId || 'English_Lit_Q1_Hyena';
  const modelAnswer = MODEL_ANSWERS[questionId] || MODEL_ANSWERS['English_Lit_Q1_Hyena'];

  // STRICT MARKING PROMPT (optimized for tokens)
  const markingPrompt = `GCSE English Literature Examiner. Mark strictly.

MODEL ANSWER (8/8 - gold standard):
${modelAnswer}

STUDENT ANSWER:
${studentText}

MARK SCHEME (8 marks total):
- Quotations with marks: 0-2 marks
- Named techniques: 0-2 marks
- Effect explained: 0-2 marks
- Links to question: 0-2 marks

SCORE HARSHLY:
0-1: No quotes, no techniques, under 30 words
2-3: Weak quote OR technique mentioned, no explanation
4-5: 1-2 quotes, technique named, weak explanation
6-7: 2-3 quotes, good analysis, clear effects
8: Matches model answer quality

IDENTIFY WEAKNESSES in student text:
- Missing quotation marks
- Vague language ("shows", "uses")
- No technique names
- Weak explanations

OUTPUT ONLY VALID JSON:
{
  "marksAwarded": 3,
  "highlights": [
    {"page": 1, "lineIndex": 0, "startChar": 5, "endChar": 20, "color": "red"}
  ],
  "annotations": [
    {"page": 1, "lineIndex": 0, "text": "Missing quotation marks", "type": "warning"}
  ]
}

Annotations: MAX 8 words each. Be harsh.`;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { 
          role: 'system', 
          content: 'You are a strict GCSE examiner. Compare student answers to model answers. Most students get 3-5/8. Output ONLY valid JSON.' 
        },
        { role: 'user', content: markingPrompt }
      ],
      temperature: 0.2,
      max_tokens: 800
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'DeepSeek API error');
  }

  let aiReply = data.choices[0].message.content;
  aiReply = aiReply.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  const markingResult = JSON.parse(aiReply);
  
  // Cap marks at 8
  if (markingResult.marksAwarded > 8) {
    markingResult.marksAwarded = 8;
  }
  
  return res.status(200).json(markingResult);
}

// ============================================
// CHAT HANDLER (Q&A for all subjects)
// ============================================
async function handleChatRequest(req, res, { message, conversationHistory, questionData }) {
  
  // GUIDE LIBRARY (All subjects)
  const GUIDES = {
    // === MATHS ===
    'Product of Prime Factors': `
REFERENCE GUIDE: Product of Prime Factors
DEFINITION: Writing a number as a multiplication of only prime numbers.
METHOD:
Step 1: Start a factor tree - Write the number at the top. Split it into two factors.
Step 2: Keep splitting - If any number is not prime, split it again.
Step 3: Write the answer - Use index form if the same prime appears more than once.
EXAMPLE: 24 = 2³ × 3
COMMON MISTAKES:
1. Stopping too early (e.g., 18 = 2 × 9)
2. Missing a factor
3. Not using index form
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
DEFINITION: When a value is rounded or truncated, it is not exact. It represents a range of possible values. Bounds describe this range using a lower bound (smallest possible value) and an upper bound (largest possible value).

KEY IDEA:
• Rounding → values are within half a step either side of the rounded number
• Truncation → values start at the truncated number and go up to (but not including) the next step

METHOD (ROUNDED VALUES):
Step 1: Identify the rounding level – e.g. nearest whole number, 1 decimal place, etc.
Step 2: Find the step size – e.g. 1 dp → step = 0.1
Step 3: Halve the step – this gives the distance to each bound
Step 4: Subtract and add half the step to find the bounds
Step 5: Write the bounds using correct inequalities (≤ for lower, < for upper)

METHOD (TRUNCATED VALUES):
Step 1: Identify the truncation level
Step 2: The lower bound is the truncated value
Step 3: The upper bound is the next possible value (not included)
Step 4: Write the bounds using ≤ and <

EXAMPLE (ROUNDING):
A length is 5.6 cm correct to 1 decimal place
Step 1: Step size = 0.1
Step 2: Half step = 0.05
Step 3: Lower bound = 5.6 − 0.05 = 5.55
Step 4: Upper bound = 5.6 + 0.05 = 5.65

Result:
5.55 ≤ x < 5.65

EXAMPLE (TRUNCATION):
A value is truncated to 1 decimal place as 4.2
Lower bound = 4.2
Upper bound = 4.3

Result:
4.2 ≤ x < 4.3

COMMON MISTAKES TO AVOID:
Forgetting half the step – e.g. using 5.5 to 5.7 instead of 5.55 to 5.65

Including the upper bound – rounded values never include the upper limit

Confusing truncation with rounding – truncation never rounds up, it only cuts off digits
`,









      
'Rounding Decimals and Significant Figures': `
REFERENCE GUIDE: Rounding Decimals and Significant Figures
DEFINITION: Rounding makes numbers simpler while keeping them as accurate as possible. You may be asked to round to a number of decimal places or a number of significant figures.

KEY IDEAS:
Decimal places count digits after the decimal point.
Significant figures count meaningful digits starting from the first non-zero digit.
The decision digit is the digit to the right of the rounding digit.

ROUNDING RULE:
If the decision digit is 5 or more, round up.
If the decision digit is less than 5, keep the rounding digit the same.

METHOD:
Step 1: Identify whether the question asks for decimal places or significant figures.
Step 2: Find the rounding digit.
Step 3: Look at the decision digit to decide whether to round up or not.
Step 4: Remove or replace digits after the rounding digit.
Step 5: Check the final answer matches the required accuracy.

EXAMPLES:
Round 6.42 to 1 decimal place
Rounding digit = 4, decision digit = 2 → answer = 6.4

Round 0.005678 to 2 significant figures
First two significant figures = 5 and 6, decision digit = 7 → answer = 0.0057

Round 18,649 to 3 significant figures
First three significant figures = 1, 8, 6, decision digit = 4 → answer = 18,600

COMMON MISTAKES TO AVOID:
Counting decimal places from the wrong position.

Starting significant figures from zero instead of the first non-zero digit.

Leaving extra digits instead of removing or replacing them.
`,









      



'Multiplying Fractions': `
REFERENCE GUIDE: Multiplying Fractions
DEFINITION: Multiplying fractions means finding a fraction of a fraction. You multiply the numerators together and multiply the denominators together, then simplify the result.

KEY IDEA:
Multiply across (top × top, bottom × bottom). No common denominators are needed. Always simplify at the end.

METHOD:
Step 1: Check for mixed numbers – If any fractions are mixed numbers, convert them to improper fractions first.
Step 2: Multiply the numerators – Multiply the top numbers together.
Step 3: Multiply the denominators – Multiply the bottom numbers together.
Step 4: Simplify – Divide the numerator and denominator by the same number to get the simplest form.
Step 5: Sense check – If both fractions are less than 1, the answer should be smaller than both.

EXAMPLE:
Work out 2/3 × 3/4
Step 1: Multiply numerators → 2 × 3 = 6
Step 2: Multiply denominators → 3 × 4 = 12
Step 3: Simplify → 6/12 = 1/2
Result → 1/2

COMMON MISTAKES TO AVOID:
Adding instead of multiplying – e.g., 2/3 + 3/4 (wrong method).

Only multiplying the numerators – e.g., (2×3)/4 = 6/4 (denominator must be multiplied too).

Not simplifying correctly – e.g., leaving 6/12 unsimplified or simplifying to 3/12 instead of 1/2.
`,




'Dividing Fractions': `
REFERENCE GUIDE: Dividing Fractions
DEFINITION: Dividing fractions means finding how many times one fraction fits into another. This is done by multiplying by the reciprocal of the second fraction.

METHOD:
Step 1: Keep the first fraction the same.
Step 2: Change the division sign (÷) to multiplication (×).
Step 3: Flip the second fraction to get its reciprocal.
Step 4: Multiply across and simplify the result.

EXAMPLE:
Work out 3/4 ÷ 2/5
Step 1: Keep–Change–Flip → 3/4 × 5/2
Step 2: Multiply → (3×5)/(4×2) = 15/8
Step 3: Simplify or convert if needed → 15/8 = 1 7/8

COMMON MISTAKES TO AVOID:
Flipping the wrong fraction – only the second fraction is flipped.

Forgetting to change ÷ to × before multiplying.

Not simplifying the final answer or missing a mixed number when asked.
`,

'Adding Fractions': `
REFERENCE GUIDE: Adding Fractions
DEFINITION: Adding fractions combines parts, but only works directly when the fractions have the same denominator (same-sized parts).

METHOD:
Step 1: Check if denominators are the same – if yes, add straight away.
Step 2: Find a common denominator (usually the LCM).
Step 3: Convert both fractions to equivalent fractions with the same denominator.
Step 4: Add the numerators, keep the denominator, then simplify.

EXAMPLE:
Work out 1/3 + 1/4
Step 1: Common denominator = 12
Step 2: Convert → 1/3 = 4/12, 1/4 = 3/12
Step 3: Add → 4/12 + 3/12 = 7/12

COMMON MISTAKES TO AVOID:
Adding denominators instead of keeping them the same.

Changing only the denominator and not the numerator.

Forgetting to simplify the final fraction.
`,

'Subtracting Fractions': `
REFERENCE GUIDE: Subtracting Fractions
DEFINITION: Subtracting fractions finds the difference between two amounts and requires both fractions to have the same denominator.

METHOD:
Step 1: Check if denominators match.
Step 2: If not, find a common denominator (LCM).
Step 3: Convert both fractions to equivalent fractions.
Step 4: Subtract the numerators, keep the denominator, then simplify.

EXAMPLE:
Work out 3/4 − 1/6
Step 1: Common denominator = 12
Step 2: Convert → 3/4 = 9/12, 1/6 = 2/12
Step 3: Subtract → 9/12 − 2/12 = 7/12

COMMON MISTAKES TO AVOID:
Subtracting denominators instead of keeping them the same.

Only changing one fraction to match the denominator.

Forgetting subtraction direction (answer should be smaller than the first fraction).
`,

'Simplifying Fractions': `
REFERENCE GUIDE: Simplifying Fractions
DEFINITION: Simplifying a fraction means reducing it to its smallest form without changing its value by dividing the numerator and denominator by the same factor.

METHOD:
Step 1: Find a common factor of the numerator and denominator.
Step 2: Divide both the numerator and denominator by that factor.
Step 3: Repeat until no common factors greater than 1 remain.
Step 4: Check the fraction is in simplest form.

EXAMPLE:
Simplify 24/36
Step 1: Common factor = 12
Step 2: Divide → 24 ÷ 12 = 2, 36 ÷ 12 = 3
Step 3: Result → 2/3

COMMON MISTAKES TO AVOID:
Dividing only the top or bottom.

Stopping before the fraction is fully simplified.

Using a number that is not a common factor.
`,

'Mixed and Improper Fractions': `
REFERENCE GUIDE: Mixed and Improper Fractions
DEFINITION: A mixed number is a whole number with a fraction, while an improper fraction has a numerator larger than the denominator. You must be able to convert between the two.

METHOD:
Step 1: Mixed → improper: multiply the whole number by the denominator, then add the numerator.
Step 2: Write the result over the original denominator.
Step 3: Improper → mixed: divide the numerator by the denominator.
Step 4: Write the quotient as the whole number and the remainder over the denominator.

EXAMPLE:
Convert 17/4 to a mixed number
Step 1: Divide → 17 ÷ 4 = 4 remainder 1
Step 2: Write → 4 1/4

COMMON MISTAKES TO AVOID:
Forgetting to multiply the whole number when converting to improper.

Changing the denominator during conversion.

Writing the remainder incorrectly.
`,



'Mixed and Improper Fractions': `
REFERENCE GUIDE: Mixed and Improper Fractions
DEFINITION: Fractions can be written as mixed numbers (a whole number and a fraction) or improper fractions (where the numerator is larger than the denominator). You must be able to convert between them accurately.

KEY IDEAS:
A mixed number shows whole parts and a fraction (e.g. 2 1/3).
An improper fraction represents more than one whole (e.g. 7/3).
The denominator never changes during conversion.

METHOD:
Step 1: Decide the direction of conversion (mixed → improper or improper → mixed).
Step 2: Mixed → improper: (whole × denominator) + numerator, over the same denominator.
Step 3: Improper → mixed: divide numerator by denominator.
Step 4: Write the remainder over the original denominator.
Step 5: Check by converting back.

EXAMPLE:
Convert 17/4 to a mixed number
17 ÷ 4 = 4 remainder 1 → 4 1/4

COMMON MISTAKES TO AVOID:
Adding instead of multiplying the whole number.

Changing the denominator.

Writing the remainder incorrectly.
`,

'Fractions of an Amount': `
REFERENCE GUIDE: Fractions of an Amount
DEFINITION: Finding a fraction of an amount means finding a part of a whole by sharing it into equal parts.

KEY IDEAS:
The denominator tells you how many equal parts the whole is split into.
The numerator tells you how many of those parts you want.
A unit fraction (1/n) is the key stepping stone.

METHOD:
Step 1: Divide the total amount by the denominator.
Step 2: Multiply the result by the numerator.
Step 3: Include units if needed.
Step 4: Check the answer makes sense.

EXAMPLE:
Find 3/5 of 40
40 ÷ 5 = 8
8 × 3 = 24

COMMON MISTAKES TO AVOID:
Dividing by the numerator instead of the denominator.

Multiplying first and making arithmetic errors.

Getting an answer bigger than the whole for a fraction less than 1.
`,

'Percentage of an Amount': `
REFERENCE GUIDE: Percentage of an Amount
DEFINITION: A percentage means “out of 100”. Finding a percentage of an amount is finding a fraction of the whole.

KEY IDEAS:
Percent means ÷100.
A multiplier converts a percentage into a decimal.
10% and 1% methods are useful without calculators.

METHOD:
Step 1: Convert the percentage to a decimal (÷100) or use 10%/1%.
Step 2: Multiply the amount by the decimal.
Step 3: Round sensibly and include units.
Step 4: Sense check using 10% or 50%.

EXAMPLE:
Find 12% of 250
12% = 0.12
250 × 0.12 = 30

COMMON MISTAKES TO AVOID:
Forgetting to divide by 100.

Adding the percentage instead of finding the part.

Rounding money incorrectly.
`,

'Reverse Percentages': `
REFERENCE GUIDE: Reverse Percentages
DEFINITION: Reverse percentages find the original amount when you are given the final amount after a percentage increase or decrease.

KEY IDEAS:
Increase → multiplier greater than 1.
Decrease → multiplier less than 1.
Reverse means divide, not multiply.

METHOD:
Step 1: Decide if the change is an increase or decrease.
Step 2: Write the correct multiplier.
Step 3: Divide the final amount by the multiplier.
Step 4: Check by multiplying forward.

EXAMPLE:
After a 20% discount, a coat costs £48
Multiplier = 0.8
Original = 48 ÷ 0.8 = 60

COMMON MISTAKES TO AVOID:
Using the percentage instead of the multiplier.

Multiplying instead of dividing.

Using the wrong direction.
`,

'Simple Interest': `
REFERENCE GUIDE: Simple Interest
DEFINITION: Simple interest is calculated on the original amount only. The interest does not compound.

KEY IDEAS:
Principal is the starting amount.
Rate must be converted to a decimal.
Time is measured in years.

METHOD:
Step 1: Identify principal, rate and time.
Step 2: Convert the rate to a decimal.
Step 3: Use Interest = Principal × Rate × Time.
Step 4: Add interest to principal if total is required.

EXAMPLE:
Find the simple interest on £500 at 6% for 4 years
Interest = 500 × 0.06 × 4 = 120

COMMON MISTAKES TO AVOID:
Not converting the percentage.

Using compound interest instead.

Forgetting to add interest when asked for the total.
`,


      
'Compound Interest': `
REFERENCE GUIDE: Compound Interest
DEFINITION: Compound interest is calculated on the total, including interest from previous periods.

KEY IDEAS:
Use a multiplier (e.g. 5% increase → 1.05).
The number of years is the power.
Money answers round to 2 decimal places.

METHOD:
Step 1: Write the multiplier.
Step 2: Raise it to the power of the number of years.
Step 3: Multiply by the original amount.
Step 4: Round appropriately.

EXAMPLE:
£500 at 10% compound interest for 2 years
Multiplier = 1.10
Final = 500 × 1.10² = 605

COMMON MISTAKES TO AVOID:
Using simple interest.

Forgetting the power.

Using 0.10 instead of 1.10.
`,



'Depreciation': `
REFERENCE GUIDE: Depreciation
DEFINITION: Depreciation is a decrease in value over time, usually calculated using compound percentage decrease.

KEY IDEA:
Final value = Original value × (multiplier)^(number of years)

IMPORTANT TERMS:
Original value – The starting price.
Depreciation rate – The percentage lost each year.
Multiplier – 1 minus the rate as a decimal (e.g. 15% → 0.85).

METHOD:
Step 1: Convert the percentage to a decimal.
Step 2: Subtract from 1 to find the multiplier.
Step 3: Raise the multiplier to the number of years.
Step 4: Multiply by the original value.

EXAMPLE:
£12,000 depreciates by 15% for 2 years.
Multiplier = 0.85
Final value = 12000 × 0.85²

COMMON MISTAKES TO AVOID:
Using 1 + rate instead of 1 − rate.
Forgetting to use powers for multiple years.
Applying the percentage decrease only once.
`,

'Percentage Profit': `
REFERENCE GUIDE: Percentage Profit
DEFINITION: Percentage profit shows how much money is gained compared to the original cost price.

KEY FORMULA:
Percentage profit = (Profit ÷ Cost Price) × 100%

IMPORTANT TERMS:
Cost Price (CP) – Original price.
Selling Price (SP) – Price sold for.
Profit – SP − CP.

METHOD:
Step 1: Subtract cost price from selling price.
Step 2: Divide the profit by the cost price.
Step 3: Multiply by 100 to get a percentage.
Step 4: Sense check – profit should be positive if SP > CP.

EXAMPLE:
Cost = £20, Selling price = £26
Profit = 6
Percentage profit = (6 ÷ 20) × 100 = 30%

COMMON MISTAKES TO AVOID:
Dividing by the selling price.
Forgetting to multiply by 100.
Using the wrong numbers for profit.
`,

'Value for Money': `
REFERENCE GUIDE: Value for Money
DEFINITION: Value for money compares options by finding the cost per unit and choosing the cheapest.

KEY IDEA:
Best value = smallest cost per unit.

IMPORTANT TERMS:
Unit – One item, kilogram, litre, etc.
Cost per unit – Total cost ÷ number of units.

METHOD:
Step 1: Decide what one unit is.
Step 2: Divide the price by the number of units for each option.
Step 3: Compare the costs per unit.
Step 4: State clearly which option is best value.

EXAMPLE:
6 items for £3 → £0.50 per item
10 items for £4 → £0.40 per item
Best value = second option

COMMON MISTAKES TO AVOID:
Comparing total prices instead of unit cost.
Using different units for each option.
Forgetting to explain your choice.
`,

'Standard Form and Ordinary Numbers': `
REFERENCE GUIDE: Standard Form and Ordinary Numbers
DEFINITION: Standard form writes very large or very small numbers using powers of 10.

STANDARD FORM:
a × 10ⁿ where 1 ≤ a < 10

IMPORTANT TERMS:
a – Number between 1 and 10.
n – Number of decimal moves.
Positive power – Large numbers.
Negative power – Small numbers.

METHOD:
Step 1: Move the decimal to make a number between 1 and 10.
Step 2: Count how many places the decimal moved.
Step 3: Use a positive power for big numbers, negative for small.
Step 4: Write the final answer neatly.

EXAMPLE:
6200 → 6.2 × 10³

COMMON MISTAKES TO AVOID:
Forgetting the decimal must be between 1 and 10.
Using the wrong sign on the power.
Miscounting decimal moves.
`,

'Number Powers Calculations': `
REFERENCE GUIDE: Number Powers Calculations
DEFINITION: Powers are a short way to write repeated multiplication.

IMPORTANT TERMS:
Base – The number being multiplied.
Power / Index – Number of times the base is used.
Zero power – Any number to the power of 0 equals 1.

METHOD:
Step 1: Expand the power into multiplication.
Step 2: Multiply step by step.
Step 3: Use known squares and cubes to speed up.
Step 4: Check the size of the answer.

EXAMPLE:
2⁴ = 2 × 2 × 2 × 2 = 16

COMMON MISTAKES TO AVOID:
Adding instead of multiplying.
Using the wrong number of factors.
Thinking any number to the power of 0 equals 0.
`,


'Estimation': `
REFERENCE GUIDE: Estimation
DEFINITION: Estimation means finding an approximate answer by rounding numbers to make calculations quick and sensible.

KEY IDEA:
You round first, then calculate. The answer should be close, not exact.

IMPORTANT TERMS:
Round – Change a number to a nearby easy value.
Significant figures – How many digits you keep when rounding.
Overestimate – Rounded values make the answer larger.
Underestimate – Rounded values make the answer smaller.

METHOD:
Step 1: Identify awkward numbers in the calculation.
Step 2: Round each to an easy number (often 1 significant figure).
Step 3: Do the calculation using the rounded numbers.
Step 4: Decide whether your estimate is an overestimate or underestimate.

EXAMPLE:
Estimate 48 × 19
48 → 50, 19 → 20
50 × 20 = 1000

COMMON MISTAKES TO AVOID:
Not rounding at all.
Rounding inconsistently.
Treating the estimate as an exact answer.
`,

'Negative Numbers and Ordering Operations': `
REFERENCE GUIDE: Negative Numbers and Ordering Operations
DEFINITION: These questions involve working with negative numbers while following the correct order of operations (BIDMAS).

KEY IDEA:
The order matters more than the signs. Handle one step at a time.

IMPORTANT TERMS:
Negative number – A number less than zero.
BIDMAS – Brackets, Indices, Division, Multiplication, Addition, Subtraction.
Opposite signs – Positive × negative = negative.
Same signs – Negative × negative = positive.

METHOD:
Step 1: Work out brackets first.
Step 2: Calculate indices (powers).
Step 3: Multiply and divide from left to right.
Step 4: Add and subtract last, watching the signs.

EXAMPLE:
Work out −3 × 4 + 5
−3 × 4 = −12
−12 + 5 = −7

COMMON MISTAKES TO AVOID:
Ignoring BIDMAS.
Losing track of negative signs.
Adding before multiplying.
`,

'Converting Between Fractions, Decimals and Percentages': `
REFERENCE GUIDE: Converting Between Fractions, Decimals and Percentages
DEFINITION: Fractions, decimals and percentages are equivalent ways of showing the same value.

KEY IDEA:
Fraction → Decimal → Percentage is the smoothest route.

IMPORTANT TERMS:
Fraction – Part of a whole.
Decimal – Uses place value.
Percentage – Out of 100.
Equivalent – Different forms with the same value.

METHOD:
Step 1: Fraction to decimal – divide top by bottom.
Step 2: Decimal to percentage – multiply by 100.
Step 3: Percentage to decimal – divide by 100.
Step 4: Simplify fractions where possible.

EXAMPLE:
Convert 3/4
3 ÷ 4 = 0.75
0.75 × 100 = 75%

COMMON MISTAKES TO AVOID:
Forgetting to multiply or divide by 100.
Not simplifying fractions.
Mixing up numerator and denominator.
`,

'Metric Unit Conversions': `
REFERENCE GUIDE: Metric Unit Conversions
DEFINITION: Metric units convert using powers of 10 by moving the decimal point.

KEY IDEA:
Small units → bigger numbers.
Large units → smaller numbers.

IMPORTANT TERMS:
mm – Millimetres
cm – Centimetres
m – Metres
km – Kilometres

METHOD:
Step 1: Write the unit order (mm → cm → m → km).
Step 2: Decide whether you are going bigger or smaller.
Step 3: Move the decimal the correct number of places.
Step 4: Check the size makes sense.

EXAMPLE:
Convert 3.2 m to cm
3.2 × 100 = 320 cm

COMMON MISTAKES TO AVOID:
Moving the decimal the wrong way.
Forgetting how many zeros are involved.
Not checking if the answer is sensible.
`,

'Calculator Fluency: ANS Key & Multi-Step Calculations': `
REFERENCE GUIDE: Calculator Fluency – ANS Key
DEFINITION: The ANS key recalls your previous calculator result, helping with long calculations.

KEY IDEA:
Each result feeds into the next step.

IMPORTANT TERMS:
ANS – Stores the last answer.
Multi-step calculation – Needs more than one operation.
Accuracy – Avoid rounding too early.

METHOD:
Step 1: Complete the first calculation.
Step 2: Press ANS instead of retyping the result.
Step 3: Continue the calculation.
Step 4: Round only at the final step if required.

EXAMPLE:
(8.4 × 3.5) ÷ 2.1
8.4 × 3.5 = 29.4
ANS ÷ 2.1 = 14

COMMON MISTAKES TO AVOID:
Rounding mid-calculation.
Retyping numbers incorrectly.
Ignoring the order of operations.
`,




'Index Laws': `
REFERENCE GUIDE: Index Laws
DEFINITION: Index laws are rules used to simplify expressions involving powers. They allow you to multiply, divide, or raise powers efficiently without expanding everything.

KEY IDEAS:
The base is the number being powered.
The index (power) shows how many times the base is multiplied by itself.
Index laws only apply when the bases are the same.
Answers should be written using a single power where possible.

INDEX LAWS:
Multiply powers → add the indices.
Divide powers → subtract the indices.
Power of a power → multiply the indices.

METHOD:
Step 1: Check that the bases are the same.
Step 2: Identify the operation (multiply, divide, or power of a power).
Step 3: Apply the correct index law to the indices only.
Step 4: Keep the base the same.
Step 5: Write the final answer in simplest form.

EXAMPLES:
Simplify 2³ × 2⁵
Add indices: 3 + 5 = 8 → answer = 2⁸

Simplify 7⁶ ÷ 7²
Subtract indices: 6 − 2 = 4 → answer = 7⁴

Simplify (3²)³
Multiply indices: 2 × 3 = 6 → answer = 3⁶

COMMON MISTAKES TO AVOID:
Adding or subtracting the bases instead of the indices.

Using index laws when the bases are different.

Adding indices when dividing instead of subtracting them.
`,


 // === ENGLISH LITERATURE ===
  'Macbeth - Foundation of Play': `
GCSE English Literature - Macbeth Foundation Guide

WHAT TYPE OF PLAY IS MACBETH?
Macbeth is a TRAGEDY. A tragedy shows a hero's downfall caused by a fatal flaw.

KEY FEATURES OF SHAKESPEAREAN TRAGEDY:
1. Fatal Flaw: The hero has a weakness (Macbeth's is ambition)
2. Downfall: The hero goes from good to bad (hero to villain)
3. Supernatural: Witches/ghosts influence events
4. Death: The tragic hero dies at the end
5. Order Restored: After death, peace returns

STRUCTURE OF MACBETH (5 ACTS):
Act 1: Macbeth meets witches → Ambition awakens
Act 2: Macbeth murders King Duncan
Act 3: Macbeth becomes paranoid → Kills Banquo
Act 4: Macbeth visits witches again → More prophecies
Act 5: Macbeth dies → Malcolm restores order

WHY IS MACBETH A TRAGEDY?
- Macbeth starts as a HERO (brave soldier)
- His AMBITION (fatal flaw) destroys him
- He becomes a VILLAIN (tyrant, murderer)
- He DIES at the end (killed by Macduff)
- This pattern = classic tragedy

THEMES TO REMEMBER:
- Ambition: Wanting power leads to destruction
- Guilt: Lady Macbeth can't wash away blood
- Fate vs Free Will: Do witches control Macbeth or does he choose?
- Appearance vs Reality: "Fair is foul, foul is fair"

EXAM TIPS:
✓ Link everything to TRAGEDY structure
✓ Mention fatal flaw (ambition)
✓ Show hero → villain transformation
✓ Reference supernatural elements (witches)

COMMON MISTAKES:
✗ Forgetting Macbeth starts as a hero
✗ Not mentioning the fatal flaw
✗ Missing the supernatural elements
✗ Not explaining WHY it's a tragedy
`,
    
};

  const topic = questionData?.topic || '';
  const selectedGuide = GUIDES[topic];

  // Build system prompt
  const systemPrompt = `You are a GCSE tutor for age 13-16 students.

STUDENT'S QUESTION: "${questionData?.question || 'No question'}"
CORRECT ANSWER: ${questionData?.correctAnswer || 'N/A'}

${selectedGuide ? `
GUIDE FOR THIS TOPIC:
${selectedGuide}

Use this guide as your PRIMARY resource.
` : `Use your GCSE knowledge for: "${questionData?.question}"`}

TEACHING RULES:
- Keep responses 1-2 sentences MAX (saves costs)
- Use Socratic method: ask questions, don't explain everything
- NO formatting (no **, no lists)
- Be warm and encouraging
${selectedGuide ? '- Reference the guide method' : '- Focus on the specific question'}

EXAMPLES:
Student: "I don't get it"
You: "No worries! ${selectedGuide ? "Let's start with step 1 from the guide." : "What part is confusing you?"}"

Student: "How do I solve this?"
You: "${selectedGuide ? "Using the guide's method, what's the first step?" : "Can you tell me what you've tried?"}"

Be concise to save tokens.`;

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
      max_tokens: 300
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'DeepSeek API error');
  }

  let reply = data.choices[0].message.content;
  reply = reply.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '');

  return res.status(200).json({ reply });
}
