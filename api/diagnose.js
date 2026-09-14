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

// Prompt-only "don't stack marks" guidance is not reliably followed — the
// model sometimes picks the same element (often the generic "question_text"
// fallback) for several steps in a row, producing illegible overlapping
// marks. Deterministically nudge any mark that lands within MIN_DIST of one
// already placed earlier in the response, in reading order (weakness → step
// → mark), rather than trusting the model's spacing alone — same reasoning
// as computing triangle vertices by trig instead of asking the model to
// guess pixels. Nudges spiral OUTWARD FROM THE MARK'S OWN ORIGINAL POINT
// (not wherever the previous nudge landed) — a mark that collides 4-5 times
// must still end up near what it was actually pointing at, not teleported
// across the page. An earlier version nudged y-only and wrapped back to the
// top of the image once it ran past the bottom, which put marks nowhere
// near their real target when several steps collided (visible live as a
// mark landing up near the question-number badge instead of the diagram).
function deconflictMarks(weaknesses) {
    const MIN_DIST = 0.08;
    const placed = [];
    weaknesses.forEach(weakness => {
        (weakness.steps || []).forEach(step => {
            (step.marks || []).forEach(mark => {
                const baseX = mark.x, baseY = mark.y;
                let guard = 0;
                while (guard < 8 && placed.some(p => Math.hypot(p.x - mark.x, p.y - mark.y) < MIN_DIST)) {
                    guard++;
                    const radius = MIN_DIST * (0.9 + guard * 0.5);
                    const angle = guard * 2.4; // ~golden angle so successive nudges don't re-collide with each other
                    mark.x = Math.max(0.03, Math.min(0.97, baseX + radius * Math.cos(angle)));
                    mark.y = Math.max(0.03, Math.min(0.97, baseY + radius * Math.sin(angle)));
                }
                placed.push({ x: mark.x, y: mark.y });
            });
        });
    });
}

async function handleMark(req, res) {
    // Feature: Phase 2-4 wrong-answer marking flow.
    // Receives the question, student answer, correct answer, mark scheme,
    // a base64 PNG screenshot of the ENTIRE question box (diagram +
    // question text + answer options/tickboxes together, plus anything
    // the student drew, captured client-side via html2canvas), and —
    // when the question has an SVG diagram — `diagram_elements`: a list
    // of that diagram's real parts (each text label, line, curved edge,
    // point) with EXACT positions read from the live DOM via browser SVG
    // geometry APIs (getScreenCTM/getPointAtLength), not guessed.
    //
    // Targeting a mark does NOT ask the model for a pixel coordinate when
    // a manifest is available — it asks it to pick a NAMED element from a
    // known list (a classification task) and the server resolves that
    // name to the exact coordinate already computed client-side. This
    // exists because general-purpose vision models (Claude included) are
    // genuinely unreliable at pixel-grounding from a flat screenshot —
    // that's a different skill from language reasoning — so asking for
    // raw x/y on a real diagram produced marks floating in empty space.
    // Only when no manifest exists (e.g. no SVG diagram, just prose) does
    // the model fall back to giving x/y itself.
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
    // marks (as returned to the client, after server-side resolution):
    //   array of { type: text/underline/circle/arrow, text, color, x, y
    //   (+ to_x/to_y for arrow) } — x/y are always concrete 0-1 fractions
    //   of the captured box image by the time this returns, regardless of
    //   whether they came from the manifest or the freeform fallback. The
    //   client positions each mark against the live box's own bounding
    //   rect using the same fraction, so it's correct regardless of what
    //   size the box actually renders at.
    //
    // Never throws — degrades silently to {ok:false} so the retry buttons
    // always appear even if the AI call fails.
    try {
        const {
            question, student_answer, correct_answer,
            mark_scheme, subject, question_box_image, diagram_elements
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

        // The client reads the diagram's real SVG (via getScreenCTM/
        // getPointAtLength — actual browser geometry, not a guess) and
        // sends each element's EXACT position. When this is present, the
        // model never has to invent a pixel coordinate — it just picks
        // WHICH named element a step is about, a plain classification
        // task, and the server resolves the id to the exact coordinate
        // already computed client-side. This is the fix for marks landing
        // in empty space: general vision models are not reliable at
        // pixel-grounding from a flat screenshot, so that step is removed
        // entirely rather than prompted around.
        const rawEntries = (Array.isArray(diagram_elements) ? diagram_elements : []).filter(el =>
            el && typeof el.id === 'string' && typeof el.x === 'number' && typeof el.y === 'number'
        );
        const realDiagramEntries = rawEntries.filter(el => el.id !== 'question_text');
        // Live testing showed the model taking the easy option: given a
        // choice, it picked the generic "question_text" fallback for
        // nearly every step instead of engaging with the diagram's real
        // parts. Once the diagram has 2+ genuine parts to work with,
        // remove "question_text" from what it's even allowed to pick —
        // structurally forcing diagram engagement is more reliable than
        // asking nicely. Only keep it as a fallback when the diagram
        // genuinely has too few real parts (0-1) to explain a mistake
        // with alone.
        const usableEntries = realDiagramEntries.length >= 2 ? realDiagramEntries : rawEntries;
        const elementMap = new Map();
        usableEntries.forEach(el => elementMap.set(el.id, { x: el.x, y: el.y }));
        const hasManifest = elementMap.size > 0;
        const manifestDescription = Array.from(elementMap.keys())
            .map(id => {
                const el = usableEntries.find(e => e.id === id);
                return '- ' + id + ': ' + (el.text ? 'the text "' + el.text + '"' : (el.kind || 'a diagram element'));
            })
            .join('\n');

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
                  + 'CRITICAL RULE ON PAIRING: EVERY step must have at least one mark in its "marks" array — a '
                  + 'step with no mark is not allowed, because a drawing must always accompany the words.'
                : '')
            + (hasManifest
                ? '\n\nHOW TO TARGET A MARK: the diagram has been read directly from its real source, so you have '
                  + 'an EXACT list of its actual parts below — use this list, do NOT invent a pixel position. '
                  + 'Every mark must give "element_id" set to exactly one id from this list (for type:arrow, also '
                  + 'give "to_element_id" for the second point):\n' + manifestDescription + '\n'
                  + 'Pick whichever element that step.text is actually talking about right now — never the '
                  + 'answer options (they are deliberately not in this list, so they cannot be picked). Use a '
                  + 'DIFFERENT element for each step where possible, like a teacher\'s pen moving to a new part '
                  + 'of the diagram for each new idea, so the explanation visibly builds up across the whole '
                  + 'diagram rather than repeating the same spot — e.g. for an arc-length mistake: one step picks '
                  + 'the angle label, the next picks the radius label, the next picks the curved-edge element to '
                  + 'show what "arc" physically means. Only pick "question_text" when the idea is genuinely about '
                  + 'the wording of the question, not the diagram.'
                : (hasImage
                    ? '\n\nHOW TO TARGET A MARK: no exact element list is available for this diagram, so give x '
                      + 'and y yourself (0 to 1, fraction of the image width/height from the top-left corner) for '
                      + 'exactly where that feature sits — be precise, look at where it actually is. Every mark '
                      + 'must land on the DIAGRAM or the QUESTION TEXT, never on the answer options/tickboxes. '
                      + 'Never reuse the same x/y (or a spot within about 0.08 of one already used) — spread '
                      + 'marks out, never cluster them in one small area. For type:arrow also give to_x/to_y for '
                      + 'where the arrow points TO.'
                    : ''));

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
                                                                properties: Object.assign(
                                                                    {
                                                                        type: {
                                                                            type: 'string',
                                                                            enum: ['text', 'underline', 'circle', 'arrow'],
                                                                            description: 'text = write a short label; underline = underline the error; circle = circle the feature; arrow = draw a line from one point to another (e.g. connecting a cause to its effect).'
                                                                        },
                                                                        text: { type: 'string', description: 'The label text (max 8 words, handwritten style, simple words a 12-year-old would use). Required for type:text.' },
                                                                        color: { type: 'string', description: 'Hex colour. Use #e16280 for errors, #8b5cf6 for corrections/explanation, #54d3ab for confirming something correct.' }
                                                                    },
                                                                    hasManifest ? {
                                                                        element_id: { type: 'string', enum: Array.from(elementMap.keys()), description: 'REQUIRED. The exact id (from the list in the instructions) of the diagram/question part this mark is about. Never invent an id not in that list.' },
                                                                        to_element_id: { type: 'string', enum: Array.from(elementMap.keys()), description: 'ONLY for type:arrow — the id of the second point the arrow points to. Required for type:arrow.' }
                                                                    } : {
                                                                        x: { type: 'number', description: 'REQUIRED. Fraction 0-1 across the question box image (left to right) — the exact diagram feature or question-text word/number this mark points at. Must NOT land on the answer options/tickboxes. For type:arrow, this is the START point.' },
                                                                        y: { type: 'number', description: 'REQUIRED. Fraction 0-1 down the question box image (top to bottom) — pair with x.' },
                                                                        to_x: { type: 'number', description: 'Fraction 0-1 — ONLY for type:arrow, the END point the arrow points to. Required for type:arrow.' },
                                                                        to_y: { type: 'number', description: 'Fraction 0-1 — pair with to_x. Required for type:arrow.' }
                                                                    }
                                                                ),
                                                                required: hasManifest ? ['type', 'element_id'] : ['type', 'x', 'y']
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

        // Resolve each mark to a concrete x/y (the client only ever needs
        // x/y — it doesn't know or care whether a mark came from the
        // manifest or the freeform fallback). When a manifest was used,
        // resolve element_id/to_element_id to the EXACT coordinate already
        // computed client-side — no guessing involved on either end. Also
        // handles the legacy diagram_x/diagram_y field names Haiku has
        // been observed to emit from an earlier schema version, for the
        // freeform fallback path. Any mark that can't be resolved to a
        // real coordinate is dropped outright — a mark with no confirmed
        // position must never be drawn on the answer options.
        const weaknesses = toolUse.input.weaknesses.map(weakness => {
            const steps = Array.isArray(weakness.steps) ? weakness.steps : [];
            weakness.steps = steps.map(step => {
                const marks = Array.isArray(step.marks) ? step.marks : [];
                step.marks = marks
                    .map(m => {
                        if (hasManifest) {
                            const anchor = elementMap.get(m.element_id);
                            if (anchor) { m.x = anchor.x; m.y = anchor.y; }
                            if (m.type === 'arrow') {
                                const target = elementMap.get(m.to_element_id);
                                if (target) { m.to_x = target.x; m.to_y = target.y; }
                            }
                        }
                        if (typeof m.x !== 'number' && typeof m.diagram_x === 'number') m.x = m.diagram_x;
                        if (typeof m.y !== 'number' && typeof m.diagram_y === 'number') m.y = m.diagram_y;
                        return m;
                    })
                    .filter(m => typeof m.x === 'number' && typeof m.y === 'number'
                        && (m.type !== 'arrow' || (typeof m.to_x === 'number' && typeof m.to_y === 'number')));
                return step;
            });
            return weakness;
        });

        deconflictMarks(weaknesses);

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
