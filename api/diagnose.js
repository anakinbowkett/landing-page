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
