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
    // and a base64 PNG screenshot of the ENTIRE question box — the
    // diagram, the question text, AND the answer options/tickboxes
    // together (plus anything the student drew on the diagram themselves),
    // captured client-side via html2canvas. Claude Haiku 4.5 has real
    // vision input, so when this image is present it SEES the whole box
    // as the student left it and can point marks at ANY specific spot in
    // the diagram or question text — never at the answer options.
    //
    // Response shape: { ok, weaknesses: [{ title, steps: [{ text, marks }] }] }.
    // Deliberately NOT one dense paragraph per weakness — every weakness is
    // broken into as many small steps as it genuinely takes, no min or max
    // imposed here, and EVERY step must carry at least one mark. A step is
    // never text-only and a mark is never unexplained: the two always
    // arrive together. The client reveals one step at a time (one Continue
    // press each), drawing that step's marks as its text appears, so a
    // student watches the full explanation build up on the diagram itself
    // rather than reading one wall of text.
    //
    // marks: array of things to draw for that ONE step — each
    //   { type: text/underline/circle/arrow, text, color, x, y (+ to_x/
    //   to_y for arrow) }. x/y (0-1 fractions of the captured box image,
    //   from the top-left) are REQUIRED per mark and must target the
    //   diagram or question text — never the answer options. Only present
    //   when question_box_image was sent (the model has nothing real to
    //   point at otherwise) — the client positions each mark against the
    //   live box's own bounding rect using the same fraction, so it's
    //   correct regardless of what size the box actually renders at
    //   (deliberately NOT raw pixel coordinates, which would break the
    //   moment the box renders at a different size than the captured
    //   image).
    //
    // Never throws — degrades silently to {ok:false} so the retry buttons
    // always appear even if the AI call fails.
    try {
        const {
            question, student_answer, correct_answer,
            mark_scheme, subject, question_box_image
        } = req.body || {};

        if (!question || !student_answer) {
            return res.status(200).json({ ok: false, weaknesses: [] });
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            return res.status(200).json({ ok: false, weaknesses: [] });
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
            + 'already knows. '
            + 'If the mistake genuinely involves more than one separate misunderstanding — e.g. a multi-step '
            + 'problem like simultaneous equations where several different things went wrong — split it into '
            + 'that many separate weaknesses, one per distinct root cause, in the order the steps happen. '
            + 'But do NOT invent extra weaknesses that are not really there: if it is genuinely one simple '
            + 'mistake, give exactly one weakness — never pad the number of weaknesses. '
            + 'Specific to THIS question and THIS mistake — never generic. Warm, direct, encouraging tone. '
            + 'Never condescending.'
            + '\n\nNEVER WRITE A WALL OF TEXT. This is the most important rule. Every weakness must be broken '
            + 'into a "steps" array — many small steps, never one paragraph. Each step.text is ONE idea only, '
            + 'as short as a sentence really needs to be — often just a fragment, never more than about 12 words. '
            + 'Break it down MORE than a textbook would, not less: if a textbook would show a calculation in one '
            + 'line, split it into the separate small moves a student actually has to make in their head — e.g. '
            + '"identify the two angles you\'re given" is its own step, "add them together" is its own step, '
            + '"subtract that from 180" is its own step, each with its own mark. There is no minimum and no '
            + 'maximum number of steps — use exactly as many as it takes to make every single move visible, even '
            + 'if that is many more steps than a textbook or a teacher would normally write out. The final step '
            + 'of a weakness should give the concrete action to do differently next time — specific enough for a '
            + 'a 12-year-old to actually follow, not vague advice like "be more careful".'
            + (hasImage
                ? '\n\nYou can SEE a real screenshot of the exact question box the student was looking at — the '
                  + 'diagram, the question text, AND the answer options/tickboxes together, exactly as they left '
                  + 'it. The student may also have drawn on the diagram themselves in blue pen (freehand, e.g. '
                  + 'marking angles, sides, or working) — look for this and take it into account: if their own '
                  + 'drawing already shows correct understanding of one part, don\'t re-explain that part; if it '
                  + 'shows a misunderstanding, that IS the mistake to diagnose. Look at the whole image directly '
                  + 'before answering. '
                  + 'CRITICAL RULE ON WHERE MARKS GO: every mark must land on the DIAGRAM or the QUESTION TEXT — '
                  + 'never on the answer options or tickboxes underneath. The answer options are just the list of '
                  + 'choices; they are not what caused the mistake and must never be circled, underlined, or '
                  + 'pointed at. The diagram (or, if there is no diagram, the specific number/word/phrase in the '
                  + 'question text) is where the actual maths lives. '
                  + 'CRITICAL RULE ON PAIRING: EVERY step must have at least one mark in its "marks" array — a '
                  + 'step with no mark is not allowed, because a drawing must always accompany the words. Mark '
                  + 'specific real features, not empty space: circle or underline the actual angle, side, label '
                  + 'or number that step.text is talking about right now — one step, one small drawing move, in '
                  + 'sync. As the steps progress, marks can build on each other (e.g. step 1 circles corner A, '
                  + 'step 2 circles corner B, step 3 draws an arrow connecting them) so the diagram fills in '
                  + 'piece by piece exactly as the explanation does. '
                  + 'Give x and y (0 to 1, fraction of the image width/height from the top-left corner) for '
                  + 'exactly where that feature sits — be precise, look at where it actually is before giving '
                  + 'coordinates. For type:arrow also give to_x/to_y for where the arrow points TO.'
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
                max_tokens: 4096,
                system: systemPrompt,
                messages: [{ role: 'user', content: userContent }],
                tools: [{
                    name: 'record_marking',
                    description: 'Record the marking breakdown for each mistake the student made, as a sequence of small paired text+drawing steps.',
                    input_schema: {
                        type: 'object',
                        properties: {
                            weaknesses: {
                                type: 'array',
                                description: 'One entry per genuinely distinct root cause, in the order the steps happen. No artificial minimum or maximum — usually 1, sometimes more on a multi-part mistake.',
                                minItems: 1,
                                items: {
                                    type: 'object',
                                    properties: {
                                        title: { type: 'string', description: 'The root rule broken, in 5 words or fewer, plain simple language. Shown once as a heading above this weakness\'s steps.' },
                                        steps: {
                                            type: 'array',
                                            description: 'The fine-grained breakdown of this weakness — as many small steps as it genuinely takes, no minimum or maximum. Each step is ONE idea, never a paragraph. Break down further than a textbook would.',
                                            minItems: 1,
                                            items: {
                                                type: 'object',
                                                properties: Object.assign(
                                                    {
                                                        text: { type: 'string', description: 'ONE short idea — a sentence or fragment, max ~12 words. Never a paragraph, never more than one idea.' }
                                                    },
                                                    hasImage ? {
                                                        marks: {
                                                            type: 'array',
                                                            description: 'REQUIRED — at least one mark to draw on the DIAGRAM or QUESTION TEXT for this exact step, never on the answer options/tickboxes. The mark must show what this step\'s text is talking about, right now.',
                                                            minItems: 1,
                                                            items: {
                                                                type: 'object',
                                                                properties: {
                                                                    type: {
                                                                        type: 'string',
                                                                        enum: ['text', 'underline', 'circle', 'arrow'],
                                                                        description: 'text = write a short label; underline = underline the error; circle = circle the feature; arrow = draw a line from one point to another (e.g. connecting a cause to its effect).'
                                                                    },
                                                                    text: { type: 'string', description: 'The label text (max 8 words, handwritten style, simple words a 12-year-old would use). Required for type:text.' },
                                                                    color: { type: 'string', description: 'Hex colour. Use #e16280 for errors, #8b5cf6 for corrections/explanation, #54d3ab for confirming something correct.' },
                                                                    x: { type: 'number', description: 'REQUIRED. Fraction 0-1 across the question box image (left to right) — the exact diagram feature or question-text word/number this mark points at. Must NOT land on the answer options/tickboxes. For type:arrow, this is the START point.' },
                                                                    y: { type: 'number', description: 'REQUIRED. Fraction 0-1 down the question box image (top to bottom) — pair with x.' },
                                                                    to_x: { type: 'number', description: 'Fraction 0-1 — ONLY for type:arrow, the END point the arrow points to. Required for type:arrow.' },
                                                                    to_y: { type: 'number', description: 'Fraction 0-1 — pair with to_x. Required for type:arrow.' }
                                                                },
                                                                required: ['type', 'x', 'y']
                                                            }
                                                        }
                                                    } : {}
                                                ),
                                                required: hasImage ? ['text', 'marks'] : ['text']
                                            }
                                        }
                                    },
                                    required: ['title', 'steps']
                                }
                            }
                        },
                        required: ['weaknesses']
                    }
                }],
                tool_choice: { type: 'tool', name: 'record_marking' },
            }),
        });

        if (!anthropicRes.ok) {
            console.error('Anthropic mark error:', anthropicRes.status, await anthropicRes.text());
            return res.status(200).json({ ok: false, weaknesses: [] });
        }

        const data = await anthropicRes.json();
        const toolUse = (data.content || []).find(block => block.type === 'tool_use');
        if (!toolUse || !toolUse.input || !toolUse.input.weaknesses) {
            return res.status(200).json({ ok: false, weaknesses: [] });
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
        const weaknesses = toolUse.input.weaknesses.map(weakness => {
            const steps = Array.isArray(weakness.steps) ? weakness.steps : [];
            weakness.steps = steps.map(step => {
                const marks = Array.isArray(step.marks) ? step.marks : [];
                step.marks = marks
                    .map(m => {
                        if (typeof m.x !== 'number' && typeof m.diagram_x === 'number') m.x = m.diagram_x;
                        if (typeof m.y !== 'number' && typeof m.diagram_y === 'number') m.y = m.diagram_y;
                        return m;
                    })
                    .filter(m => typeof m.x === 'number' && typeof m.y === 'number');
                return step;
            });
            return weakness;
        });

        return res.status(200).json({ ok: true, weaknesses });

    } catch (error) {
        console.error('Mark error:', error);
        return res.status(200).json({ ok: false, weaknesses: [] });
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
