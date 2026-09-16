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
    //
    // PIVOT (this version): no live annotation at all. Every earlier version
    // of this endpoint tried to get Claude to point at a specific pixel/
    // element on the student's actual diagram — screenshots, numbered
    // markers, keyword matching, deconfliction passes. All of it was
    // patching around the same unreliable core: general-purpose vision
    // models are not good at pixel-grounding, and even structured targeting
    // still depended on the model's in-the-moment judgment about WHERE to
    // point, which kept producing wrong or empty picks under real testing.
    //
    // The fix is to stop trying to annotate an unpredictable live diagram
    // and show a pre-built worked example instead — same principle as the
    // guide-generation system's S5 section (deterministic SVG geometry,
    // calculated at content-authoring time, never guessed at runtime). This
    // endpoint's only job now is the plain-text diagnosis: why THIS answer
    // was wrong, broken into small steps. No image in, no coordinates out.
    // The worked example itself is static per-question content the client
    // already has (see WORKED_EXAMPLE_HTML on the question bank entry) —
    // this endpoint never generates or touches it.
    //
    // Response shape: { ok, weaknesses: [{ title, steps: [{ text }] }] }.
    // Deliberately NOT one dense paragraph per weakness — every weakness is
    // broken into as many small steps as it genuinely takes, no min or max
    // imposed here. The client reveals one step at a time (one Continue
    // press each) so the student never faces a wall of text.
    //
    // Never throws — degrades silently to {ok:false} so the retry buttons
    // always appear even if the AI call fails.
    try {
        const { question, student_answer, correct_answer, mark_scheme, subject } = req.body || {};

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
            + 'Never condescending. A full worked example is shown separately after this, so you do not need to '
            + 'reproduce the whole method here — focus on diagnosing THIS specific mistake.'
            + '\n\nNEVER WRITE A WALL OF TEXT. This is the most important rule. Every weakness must be broken '
            + 'into a "steps" array — many small steps, never one paragraph. Each step.text is ONE idea only, '
            + 'as short as a sentence really needs to be — often just a fragment, never more than about 12 words. '
            + 'Break it down MORE than a textbook would, not less: if a textbook would show a calculation in one '
            + 'line, split it into the separate small moves a student actually has to make in their head — e.g. '
            + '"identify the two angles you\'re given" is its own step, "add them together" is its own step, '
            + '"subtract that from 180" is its own step. There is no minimum and no maximum number of steps — '
            + 'use exactly as many as it takes to make every single move visible, even if that is many more steps '
            + 'than a textbook or a teacher would normally write out. The final step of a weakness should give '
            + 'the concrete action to do differently next time — specific enough for a 12-year-old to actually '
            + 'follow, not vague advice like "be more careful".';

        const userPromptText =
            'Question: ' + question + '\n'
            + 'Student\'s answer: ' + student_answer + '\n'
            + 'Correct answer: ' + correct_answer + '\n'
            + 'Mark scheme:\n' + markSchemeText;

        const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 2048,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPromptText }],
                tools: [{
                    name: 'record_marking',
                    description: 'Record the diagnosis of the mistake the student made, as a sequence of small steps.',
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
                                                properties: {
                                                    text: { type: 'string', description: 'ONE short idea — a sentence or fragment, max ~12 words. Never a paragraph, never more than one idea.' }
                                                },
                                                required: ['text']
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

        return res.status(200).json({ ok: true, weaknesses: toolUse.input.weaknesses });

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
