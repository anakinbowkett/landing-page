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
    // Receives the question, student answer, correct answer, and mark scheme.
    // Returns an array of { annotation, weakness, worked_step } pairs — one
    // pair per mistake — that the client plays back one at a time on Continue.
    //
    // annotation: what to draw on the student's work (type, target, text)
    // weakness:   { title, body, apply } — first-principles explanation
    // worked_step: the correct working for this step (shown alongside)
    //
    // Never throws — degrades silently to {ok:false} so the retry buttons
    // always appear even if the AI call fails.
    try {
        const {
            question, student_answer, correct_answer,
            mark_scheme, subject
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

        const systemPrompt =
            'You are an expert ' + subjectLabel + ' tutor marking a GCSE student\'s wrong answer. '
            + 'Apply Elon Musk\'s first-principles thinking: strip each mistake back to the irreducible rule it breaks. '
            + 'Be specific to THIS question and THIS mistake — never generic. '
            + 'Warm, direct tone. Never condescending. Max 2-3 weaknesses.';

        const userPrompt =
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
                max_tokens: 800,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }],
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
                                    properties: {
                                        annotation: {
                                            type: 'object',
                                            description: 'What to draw on the student\'s work for this mistake.',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    enum: ['text', 'underline', 'circle'],
                                                    description: 'text = write a correction note; underline = underline the error; circle = circle the error'
                                                },
                                                text: { type: 'string', description: 'The correction note text (max 10 words, handwritten style). Required for type:text.' },
                                                target: { type: 'string', description: 'data-answer value (A/B/C/D) to target for circle/underline. Omit for type:text.' },
                                                color: { type: 'string', description: 'Hex colour. Use #e16280 for errors, #8b5cf6 for corrections.' }
                                            },
                                            required: ['type']
                                        },
                                        weakness: {
                                            type: 'object',
                                            description: 'First-principles explanation of the underlying gap.',
                                            properties: {
                                                title: { type: 'string', description: 'The root rule broken, in 5 words or fewer.' },
                                                body: { type: 'string', description: 'One sentence: why this specific answer broke that rule.' },
                                                apply: { type: 'string', description: 'Exactly what to do next time this comes up. One sentence.' }
                                            },
                                            required: ['title', 'body', 'apply']
                                        },
                                        worked_step: {
                                            type: 'string',
                                            description: 'The correct working for this step, as a student would write it. Null if not applicable.'
                                        }
                                    },
                                    required: ['annotation', 'weakness']
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

        return res.status(200).json({ ok: true, pairs: toolUse.input.pairs });

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
