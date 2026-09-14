// api/diagnose.js
//
// Shared endpoint for Feature 1 (AI thought-diagnosis) and Feature 2 (voice
// tutor), routed by an `action` field so the two features don't cost a
// second Vercel serverless function each — see HANDOFF.md §7. Same
// action-routing pattern as api/create-checkout-session.js (checkout/portal).
//
//   action: 'tts'      -> Feature 2, live. ElevenLabs text-to-speech, one
//                          voice per subject (see VOICE_IDS below).
//   action: 'diagnose' -> Feature 1/3, live. Claude (Anthropic) reconstructs
//                          why the student got this question wrong: a short
//                          handwritten-style correction note, a step-by-step
//                          thought-process breakdown, and a one-sentence root
//                          cause. The client (english-base-template.txt)
//                          builds the actual on-screen annotation positions
//                          itself from the DOM — this endpoint never receives
//                          or returns pixel/fraction coordinates, only text.
//   action: 'mark'      -> Phase 2-4 wrong-answer flow (Maths base-template.txt,
//                          added by a separate Maths-focused session, lives
//                          in this same shared file to stay under the 12-file
//                          cap). See handleMark() below for the full contract.
//
// CORS is locked to the same origin allowlist as api/chat.js (not '*') —
// this calls a paid ElevenLabs API, so an open origin would let any site
// burn API credits on this endpoint.
//
// Every branch is wrapped so a missing/bad API key, an unset voice ID, or a
// failed upstream call degrades to a soft response ({ok:false} / {audio:null})
// — never a thrown error — per the "never block the student" rule in the
// handoff notes. Both ELEVENLABS_API_KEY and ANTHROPIC_API_KEY are now set
// in Vercel and confirmed working end-to-end in production.

const ALLOWED_ORIGINS = [
  'https://www.monturalearn.co.uk',
  'https://monturalearn.co.uk',
  /^https:\/\/.*-anakins-projects-5f9470f9\.vercel\.app$/,
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
].filter(Boolean);

// Keyed by the lowercased `subject` string the template sends — matches the
// human-readable convention api/chat.js already uses (e.g. 'GCSE Maths',
// 'GCSE English Literature'), NOT a short slug. English Language and English
// Literature are separate subjects/templates and must not share a key.
const VOICE_IDS = {
    'gcse english language': 'kdmDKE6EkgrWrrykO9Qt',  // Alexandra
    'gcse english literature': 'kdmDKE6EkgrWrrykO9Qt', // Alexandra
    'gcse maths': 'InRyolULHTXjegISsXuJ',              // Alex
    'gcse biology': 'eXpIbVcVbLo8ZJQDlDnl',            // Siren
    'gcse chemistry': 'eXpIbVcVbLo8ZJQDlDnl',          // Siren
    'gcse physics': 'eXpIbVcVbLo8ZJQDlDnl',            // Siren
    'gcse history': 'REPLACE_WITH_ELEVENLABS_VOICE_ID_HISTORY',
    'gcse geography': 'REPLACE_WITH_ELEVENLABS_VOICE_ID_GEOGRAPHY',
};

export default async function handler(req, res) {
    const origin = req.headers.origin;
    const isAllowed = ALLOWED_ORIGINS.some(allowed =>
        typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
    );
    if (!origin || !isAllowed) return res.status(403).json({ error: 'Forbidden' });

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const action = req.body?.action || 'diagnose';

    if (action === 'tts') {
        return handleTTS(req, res);
    }

    if (action === 'mark') {
        return handleMark(req, res);
    }

    return handleDiagnose(req, res);
}

async function handleDiagnose(req, res) {
    try {
        const {
            question, options, studentAnswer, correctAnswer,
            subject, attemptCount, hintText
        } = req.body || {};

        if (!question || !studentAnswer) {
            return res.status(200).json({ ok: false });
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            // Key not added in Vercel yet — silent no-op, same contract as 'tts'.
            return res.status(200).json({ ok: false });
        }

        const systemPrompt = 'You are diagnosing why a UK GCSE student just got a question wrong, for '
            + (subject || 'a GCSE subject') + '. Reconstruct their most likely thought process in 2-4 steps, '
            + 'marking each step correct or incorrect (the final step should be where it went wrong), then give '
            + 'one root-cause sentence explaining the core misunderstanding. Also give one short handwritten-style '
            + 'correction note (under 12 words, like something scribbled next to their wrong answer). Be specific '
            + 'to THIS question and THIS mistake — never generic. Warm tone, never harsh or condescending.';

        const userPromptLines = [
            'Question: ' + question,
            Array.isArray(options) && options.length ? 'Options: ' + options.join(' | ') : null,
            'Student\'s answer: ' + studentAnswer,
            'Correct answer: ' + (typeof correctAnswer === 'string' ? correctAnswer : JSON.stringify(correctAnswer)),
            hintText ? 'The exact teaching text the student was shown for this question: "' + hintText + '"' : null,
            attemptCount > 1 ? 'This is attempt ' + attemptCount + ' — they have been here before.' : null
        ].filter(Boolean);

        const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 500,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPromptLines.join('\n') }],
                tools: [{
                    name: 'record_diagnosis',
                    description: 'Record the diagnosis of why the student got this question wrong.',
                    input_schema: {
                        type: 'object',
                        properties: {
                            correction_text: { type: 'string', description: 'Short handwritten-style correction note, under 12 words' },
                            thought_steps: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        step: { type: 'integer' },
                                        what_student_did: { type: 'string' },
                                        correct: { type: 'boolean' },
                                    },
                                    required: ['step', 'what_student_did', 'correct'],
                                },
                            },
                            root_cause: { type: 'string' },
                        },
                        required: ['correction_text', 'thought_steps', 'root_cause'],
                    },
                }],
                tool_choice: { type: 'tool', name: 'record_diagnosis' },
            }),
        });

        if (!anthropicRes.ok) {
            console.error('Anthropic error:', anthropicRes.status, await anthropicRes.text());
            return res.status(200).json({ ok: false });
        }

        const data = await anthropicRes.json();
        const toolUse = (data.content || []).find(block => block.type === 'tool_use');
        if (!toolUse || !toolUse.input) {
            return res.status(200).json({ ok: false });
        }

        return res.status(200).json({ ok: true, ...toolUse.input });

    } catch (error) {
        console.error('Diagnose error:', error);
        return res.status(200).json({ ok: false });
    }
}

async function handleMark(req, res) {
    // Feature: Phase 2-4 wrong-answer marking flow.
    // Receives the question, student answer, correct answer, mark scheme,
    // and (new) a base64 PNG screenshot of the ENTIRE question box — the
    // diagram AND the answer options/tickboxes together, captured
    // client-side via html2canvas (real Canvas can only draw what it's
    // told to, not screenshot arbitrary DOM/CSS). Claude Haiku 4.5 has
    // real vision input, so when this image is present it SEES the whole
    // box as the student left it, not just text, and can point marks at
    // ANY specific spot in the diagram or question text (x/y) — never at
    // the answer options/tickboxes, which are just the answer choices and
    // have nothing to do with the mistake. Returns an array of
    // { marks, weakness, worked_step } pairs — one pair per mistake — that
    // the client plays back one trio (marks + weakness + numbered apply
    // step) at a time on each Continue press.
    //
    // marks: array of 1-4 things to draw — each { type: text/underline/
    //   circle/arrow, text, color, x, y (+ to_x/to_y for arrow) }. x/y
    //   (0-1 fractions of the captured box image, from the top-left) are
    //   REQUIRED per mark and must target the diagram or question text —
    //   never the answer options. Multiple marks let one weakness explain
    //   itself across several diagram features at once (e.g. one circle
    //   per angle corner for "angles in a triangle sum to 180°"). Only
    //   present when question_box_image was sent (the model has nothing
    //   real to point at otherwise) — the client positions each mark
    //   against the live box's own bounding rect using the same fraction,
    //   so it's correct regardless of what size the box actually renders
    //   at (deliberately NOT raw pixel coordinates, which would break the
    //   moment the box renders at a different size than the captured
    //   image).
    // weakness:   { title, body, apply } — first-principles, 12-year-old-
    //   reading-level explanation. May be 1-4 entries: one per genuinely
    //   distinct root cause, never artificially split, never so many it
    //   overwhelms the student on a complex multi-step topic.
    // worked_step: the correct working for this step (shown alongside)
    //
    // Never throws — degrades silently to {ok:false} so the retry buttons
    // always appear even if the AI call fails.
    try {
        const {
            question, student_answer, correct_answer,
            mark_scheme, subject, question_box_image
        } = req.body || {};

        if (!question || !student_answer) {
            return res.status(200).json({ ok: false, pairs: [] });
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            return res.status(200).json({ ok: false, pairs: [] });
        }

        const subjectLabel = subject || 'GCSE Maths';
        const markSchemeText = Array.isArray(mark_scheme) && mark_scheme.length
            ? mark_scheme.join('\n')
            : 'No mark scheme provided.';
        const hasImage = typeof question_box_image === 'string' && question_box_image.length > 0;

        const systemPrompt =
            'You are explaining to a 12-year-old exactly why they got a GCSE ' + subjectLabel + ' question wrong. '
            + 'Use first-principles thinking: strip the mistake back to the simplest true rule or fact it breaks, '
            + 'and explain that rule from scratch as if the student has never heard it before. '
            + 'Use only simple, everyday words — no jargon, no exam-speak, nothing beyond what a bright 12-year-old '
            + 'already knows. Short sentences. No complex words where a simple one will do. '
            + 'If the mistake genuinely involves more than one separate misunderstanding — e.g. a multi-step '
            + 'problem like simultaneous equations where several different things went wrong — split it into '
            + 'that many separate weaknesses, one per distinct root cause, in the order the steps happen. '
            + 'But do NOT invent extra weaknesses that are not really there: if it is genuinely one simple '
            + 'mistake, give exactly one weakness. Never overwhelm the student — even on a complex multi-step '
            + 'topic, only include a weakness for something that was ACTUALLY wrong, keep each one focused on '
            + 'one single idea, and prefer fewer, clearer weaknesses over many small ones. '
            + 'Every weakness needs an "apply" step that is a concrete, specific action — specific enough that '
            + 'a 12-year-old could actually go and do it, never vague advice like "be more careful" or "check '
            + 'your work". '
            + 'Specific to THIS question and THIS mistake — never generic. Warm, direct, encouraging tone. '
            + 'Never condescending. Prefer 1-2 weaknesses; only go to 3-4 if the mistake truly has that many '
            + 'genuinely distinct root causes.'
            + (hasImage
                ? ' You can SEE a real screenshot of the exact question box the student was looking at — the '
                  + 'diagram, the question text, AND the answer options/tickboxes together, exactly as they left '
                  + 'it. Look at it directly before answering. '
                  + 'CRITICAL RULE: every mark you draw must land on the DIAGRAM or the QUESTION TEXT — never on '
                  + 'the answer options or tickboxes underneath. The answer options are just the list of choices; '
                  + 'they are not what caused the mistake and must never be circled, underlined, or pointed at. '
                  + 'The diagram (or, if there is no diagram, the specific number/word/phrase in the question '
                  + 'text) is where the actual maths lives — that is what every mark must explain. '
                  + 'Mark specific real features, not empty space: if there is a diagram, circle or underline the '
                  + 'actual angle, side, label or number the weakness is about. If a weakness is a general rule '
                  + '(e.g. "angles in a triangle sum to 180°"), mark EACH relevant feature on the diagram — for '
                  + 'that example, one small circle at every angle corner of the triangle — so the rule is shown, '
                  + 'not just told. Use the "marks" array for this: one entry per feature marked, all belonging '
                  + 'to the same weakness. Give x and y (0 to 1, fraction of the image width/height from the '
                  + 'top-left corner) for exactly where that feature sits — be precise, look at where it actually '
                  + 'is before giving coordinates. For type:arrow also give to_x/to_y for where the arrow points TO.'
                : '');

        const userPromptText =
            'Question: ' + question + '\n'
            + 'Student\'s answer: ' + student_answer + '\n'
            + 'Correct answer: ' + correct_answer + '\n'
            + 'Mark scheme:\n' + markSchemeText
            + (hasImage ? '\n\nThe image attached is a real screenshot of this exact question box — look at it before answering.' : '');

        const userContent = hasImage
            ? [
                { type: 'image', source: { type: 'base64', media_type: 'image/png', data: question_box_image } },
                { type: 'text', text: userPromptText },
              ]
            : userPromptText;

        const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 1200,
                system: systemPrompt,
                messages: [{ role: 'user', content: userContent }],
                tools: [{
                    name: 'record_marking',
                    description: 'Record the marking pairs for each mistake the student made.',
                    input_schema: {
                        type: 'object',
                        properties: {
                            pairs: {
                                type: 'array',
                                description: 'One entry per mistake, in order of importance.',
                                items: {
                                    type: 'object',
                                    properties: Object.assign(
                                        {},
                                        hasImage ? {
                                            marks: {
                                                type: 'array',
                                                description: 'One or more marks to draw on the DIAGRAM or QUESTION TEXT for this weakness — never on the answer options/tickboxes. Usually 1 mark; use more when the weakness is a general rule that applies to several features at once (e.g. one circle per angle corner of a triangle for "angles sum to 180°").',
                                                minItems: 1,
                                                maxItems: 4,
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        type: {
                                                            type: 'string',
                                                            enum: ['text', 'underline', 'circle', 'arrow'],
                                                            description: 'text = write a correction note; underline = underline the error; circle = circle the error; arrow = draw a line from one point to another (e.g. connecting a cause to its effect, or pointing from a note to the exact feature it explains).'
                                                        },
                                                        text: { type: 'string', description: 'The correction note text (max 10 words, handwritten style, simple words a 12-year-old would use). Required for type:text.' },
                                                        color: { type: 'string', description: 'Hex colour. Use #e16280 for errors, #8b5cf6 for corrections.' },
                                                        x: { type: 'number', description: 'REQUIRED. Fraction 0-1 across the question box image (left to right) — the exact diagram feature or question-text word/number this mark points at. Must NOT land on the answer options/tickboxes. For type:arrow, this is the START point.' },
                                                        y: { type: 'number', description: 'REQUIRED. Fraction 0-1 down the question box image (top to bottom) — pair with x.' },
                                                        to_x: { type: 'number', description: 'Fraction 0-1 — ONLY for type:arrow, the END point the arrow points to. Required for type:arrow.' },
                                                        to_y: { type: 'number', description: 'Fraction 0-1 — pair with to_x. Required for type:arrow.' }
                                                    },
                                                    required: ['type', 'x', 'y']
                                                }
                                            }
                                        } : {},
                                        {
                                            weakness: {
                                                type: 'object',
                                                description: 'First-principles explanation of the underlying gap, written for a 12-year-old.',
                                                properties: {
                                                    title: { type: 'string', description: 'The root rule broken, in 5 words or fewer, plain simple language.' },
                                                    body: { type: 'string', description: 'One or two short sentences: explain the true rule simply from scratch, then say exactly why this answer broke it. No jargon, no complex words — a 12-year-old who is not confident at maths must be able to understand it completely.' },
                                                    apply: { type: 'string', description: 'The exact, concrete action to do differently next time — specific enough for a 12-year-old to actually follow, not vague advice. One sentence.' }
                                                },
                                                required: ['title', 'body', 'apply']
                                            },
                                            worked_step: {
                                                type: 'string',
                                                description: 'The correct working for this step, as a student would write it. Null if not applicable.'
                                            }
                                        }
                                    ),
                                    required: hasImage ? ['marks', 'weakness'] : ['weakness']
                                }
                            }
                        },
                        required: ['pairs']
                    }
                }],
                tool_choice: { type: 'tool', name: 'record_marking' },
            }),
        });

        if (!anthropicRes.ok) {
            console.error('Anthropic mark error:', anthropicRes.status, await anthropicRes.text());
            return res.status(200).json({ ok: false, pairs: [] });
        }

        const data = await anthropicRes.json();
        const toolUse = (data.content || []).find(block => block.type === 'tool_use');
        if (!toolUse || !toolUse.input || !toolUse.input.pairs) {
            return res.status(200).json({ ok: false, pairs: [] });
        }

        // Defensive: tool-use schema enforcement is reliable for structure
        // (valid JSON, required fields) but NOT guaranteed for optional
        // property naming — observed Haiku occasionally emit legacy
        // diagram_x/diagram_y names from an earlier schema version even
        // though the current schema only defines x/y. Normalize rather
        // than let a good coordinate silently go unused because of a
        // naming mismatch the model made up on its own. Also drop any
        // mark missing real x/y outright (rather than let the client fall
        // back to guessing a target) — a mark with no confirmed position
        // must never be drawn on the answer options.
        const pairs = toolUse.input.pairs.map(pair => {
            const marks = Array.isArray(pair.marks) ? pair.marks : [];
            pair.marks = marks
                .map(m => {
                    if (typeof m.x !== 'number' && typeof m.diagram_x === 'number') m.x = m.diagram_x;
                    if (typeof m.y !== 'number' && typeof m.diagram_y === 'number') m.y = m.diagram_y;
                    return m;
                })
                .filter(m => typeof m.x === 'number' && typeof m.y === 'number');
            return pair;
        });

        return res.status(200).json({ ok: true, pairs });

    } catch (error) {
        console.error('Mark error:', error);
        return res.status(200).json({ ok: false, pairs: [] });
    }
}

async function handleTTS(req, res) {
    try {
        const text = (req.body?.text || '').trim();
        const subject = (req.body?.subject || '').toLowerCase().trim();

        if (!text) {
            return res.status(200).json({ audio: null });
        }

        const voiceId = VOICE_IDS[subject];
        if (!voiceId || voiceId.startsWith('REPLACE_WITH')) {
            // No real voice ID assigned for this subject yet — silent no-op.
            return res.status(200).json({ audio: null });
        }

        if (!process.env.ELEVENLABS_API_KEY) {
            // Key not added in Vercel yet — silent no-op.
            return res.status(200).json({ audio: null });
        }

        const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': process.env.ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
                text: text.slice(0, 800),
                model_id: 'eleven_turbo_v2_5',
                voice_settings: { stability: 0.5, similarity_boost: 0.75 },
            }),
        });

        if (!elevenRes.ok) {
            console.error('ElevenLabs error:', elevenRes.status, await elevenRes.text());
            return res.status(200).json({ audio: null });
        }

        const buffer = Buffer.from(await elevenRes.arrayBuffer());
        const base64Audio = 'data:audio/mpeg;base64,' + buffer.toString('base64');

        return res.status(200).json({ audio: base64Audio });

    } catch (error) {
        console.error('TTS error:', error);
        return res.status(200).json({ audio: null });
    }
}
