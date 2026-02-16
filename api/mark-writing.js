// Allowed origins - same as chat.js
const ALLOWED_ORIGINS = [
  'https://www.monturalearn.co.uk',
  'https://monturalearn.co.uk',
  /^https:\/\/.*-anakins-projects-5f9470f9\.vercel\.app$/,
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
].filter(Boolean);

export default async function handler(req, res) {
  // CORS
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
    const { studentText, allLineData, questionData } = req.body;
    
    // ENGLISH LITERATURE GUIDE
    const ENGLISH_LIT_GUIDE = `
You are marking GCSE English Literature student writing like an examiner.

STUDENT'S QUESTION:
"${questionData?.question || 'How does the writer use language to describe appearance?'}"

EXTRACT CONTEXT:
"${questionData?.extract || ''}"

MARKING CRITERIA (AQA GCSE English Literature):
- AO1 (4 marks): Clear points supported by well-chosen quotations
- AO2 (4 marks): Analysis of language techniques and their effects

WHAT GETS MARKS:
✓ Direct quotations from the text (embedded or separate)
✓ Named language techniques (metaphor, simile, personification, imagery, etc.)
✓ Explanation of HOW language creates effects
✓ Link to the question (describing appearance/creating mood/etc.)

WHAT LOSES MARKS:
✗ No quotations or vague references ("the writer says")
✗ Technique hunting without explanation ("this is a metaphor")
✗ Not linking back to the question
✗ Very short answers (under 50 words)

YOUR TASK:
1. Read the student's answer carefully
2. Identify SPECIFIC parts that are incorrect, weak, or missing requirements
3. Return highlights and annotations in this format:

{
  "marksAwarded": 6,
  "highlights": [
    {
      "page": 1,
      "lineIndex": 0,
      "startChar": 10,
      "endChar": 35,
      "color": "red"
    }
  ],
  "annotations": [
    {
      "page": 1,
      "lineIndex": 0,
      "text": "Missing quotation marks - embed this quote properly",
      "type": "warning"
    }
  ]
}

ANNOTATION RULES:
- Keep annotations SHORT (max 8 words)
- Be specific about what's wrong
- Use examiner language (AO1, AO2, quotation, technique, effect)
- Type "warning" for all corrections (turns red in UI)

MARK ALLOCATION:
- 0-2 marks: Very weak, no evidence, no technique analysis
- 3-4 marks: Some quotations, mentions techniques but weak explanation
- 5-6 marks: Good quotations, identifies techniques, attempts explanation
- 7-8 marks: Excellent quotations, detailed technique analysis, clear effects

RESPOND ONLY IN VALID JSON. NO EXPLANATORY TEXT BEFORE OR AFTER.
`;

    // Call DeepSeek AI
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: ENGLISH_LIT_GUIDE },
          { 
            role: 'user', 
            content: `Mark this student answer:\n\n${studentText}\n\nLine-by-line data:\n${JSON.stringify(allLineData, null, 2)}\n\nRespond ONLY with valid JSON containing marksAwarded, highlights array, and annotations array.`
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'DeepSeek API error');
    }

    // Extract JSON from AI response
    let aiReply = data.choices[0].message.content;
    
    // Clean markdown code blocks if present
    aiReply = aiReply.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the JSON
    const markingResult = JSON.parse(aiReply);
    
    return res.status(200).json(markingResult);

  } catch (error) {
    console.error('Marking API error:', error);
    return res.status(500).json({ 
      error: 'Failed to mark writing',
      details: error.message 
    });
  }
}
