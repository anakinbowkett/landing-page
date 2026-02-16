const ALLOWED_ORIGINS = [
  'https://www.monturalearn.co.uk',
  'https://monturalearn.co.uk',
  /^https:\/\/.*-anakins-projects-5f9470f9\.vercel\.app$/,
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
].filter(Boolean);

export default async function handler(req, res) {
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
    
    // MODEL ANSWER (Perfect 8/8 response)
    const MODEL_ANSWER = `The writer uses vivid imagery to emphasize the hyena's unappealing appearance. The phrase "ugly beyond redemption" suggests the animal's looks are permanently and irredeemably unpleasant. The description of its coat as a "bungled mix of colours" with spots that lack "the classy ostentation of a leopard's" implies the hyena's markings are chaotic and lack elegance. The metaphor comparing its ears to those of a mouse - "ridiculously mouse-like, large and round" - creates a sense of disproportionate features. The writer's use of negative descriptors such as "scraggly" for the tail and the comparison "like no dog anyone would want as a pet" reinforces the overall impression of an aesthetically displeasing creature.`;

    const MARKING_PROMPT = `You are a strict GCSE English Literature examiner marking Question 2 (Language Analysis, 8 marks).

QUESTION:
"${questionData?.question || 'How does the writer use language to describe appearance?'}"

EXTRACT (what students should quote from):
"${questionData?.extract || ''}"

MODEL ANSWER (8/8 marks - this is the GOLD STANDARD):
${MODEL_ANSWER}

STUDENT'S ANSWER:
${studentText}

STRICT MARKING CRITERIA:
- Must use DIRECT QUOTATIONS with quotation marks (e.g., "ugly beyond redemption")
- Must name LANGUAGE TECHNIQUES (metaphor, simile, imagery, personification)
- Must explain the EFFECT (what the technique shows/suggests/implies)
- Must LINK to question (describing appearance)

MARK SCHEME:
0-1 marks: No quotations, no techniques, very short (under 30 words)
2-3 marks: One weak quotation OR mentions a technique but no explanation
4-5 marks: 1-2 quotations, identifies technique, weak explanation
6-7 marks: 2-3 quotations, good technique analysis, clear effects
8 marks: Multiple quotations, detailed analysis matching model answer quality

YOUR TASK:
1. Compare student answer to model answer
2. Identify SPECIFIC weaknesses:
   - Missing quotations (highlight the text that should have been quoted)
   - Vague language ("the writer shows" without explaining HOW)
   - No technique names
   - Weak explanations

3. Return JSON with:
   - marksAwarded (be STRICT - most students get 3-5 marks)
   - highlights array (red highlight = incorrect/weak writing)
   - annotations array (SHORT feedback, max 8 words)

ANNOTATION EXAMPLES:
"Missing quotation marks"
"Name the technique used"
"Explain HOW this creates effect"
"Too vague - what does it suggest?"
"Link back to question"

HIGHLIGHT RULES:
- Highlight vague phrases like "the writer uses language" or "this shows"
- Highlight any text without quotation marks that should be quoted
- Highlight technique mentions without explanation

RESPOND ONLY IN VALID JSON:
{
  "marksAwarded": 4,
  "highlights": [
    {"page": 1, "lineIndex": 0, "startChar": 5, "endChar": 20, "color": "red"}
  ],
  "annotations": [
    {"page": 1, "lineIndex": 0, "text": "Missing quotation marks", "type": "warning"}
  ]
}

Be HARSH. Compare to model answer. Most students score 3-5 marks.`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a strict GCSE examiner. Compare student answers to the model answer and mark harshly. Most students get 3-5 marks out of 8.' },
          { role: 'user', content: MARKING_PROMPT }
        ],
        temperature: 0.2,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'DeepSeek API error');
    }

    let aiReply = data.choices[0].message.content;
    aiReply = aiReply.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const markingResult = JSON.parse(aiReply);
    
    // Safety check: cap marks at 8
    if (markingResult.marksAwarded > 8) {
      markingResult.marksAwarded = 8;
    }
    
    return res.status(200).json(markingResult);

  } catch (error) {
    console.error('Marking API error:', error);
    return res.status(500).json({ 
      error: 'Failed to mark writing',
      details: error.message 
    });
  }
}
