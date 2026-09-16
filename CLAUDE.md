# Montura Learn — Maths Desktop + iPhone Build
# Read this fully before touching anything. Update this file at the end of every session.

---

## AUTO-UPDATE RULE
At the end of every session, before stopping, update the "SESSION LOG" section at the bottom of this file with what was completed and what needs doing next. This is mandatory — it replaces lost chat history.

---

## HOW TO COMMUNICATE WITH MONTURAL

- One step at a time. Build one thing, hand it back, wait for confirmation.
- Short recaps only — 3-5 bullet points max. One sentence each. No walls of text.
- Screenshots are his primary feedback method — read them carefully.
- Fast shipping over perfection. Binary choices only when asking questions.
- Never ask multiple questions at once.
- He uses voice dictation — expect informal phrasing, interpret the intent.
- He is a non-technical "vibe coder" — explain plainly, no jargon.

---

## PLATFORM OVERVIEW

- **URL:** monturalearn.co.uk
- **Stack:** Static HTML/CSS/vanilla JS. No React. No framework.
- **Hosting:** Vercel Hobby — HARD CAP: 12 serverless functions in api/. Currently AT 12. Do not add new api/ files.
- **Database:** Supabase (Postgres + Auth + Realtime)
- **Repo:** github.com/anakinbowkett/landing-page (main = production)
- **Local Maths folder:** C:\Users\ZhiYongLyu\OneDrive\Desktop\GMM\New lecture design\MATHS\AQA H Tier Maths\LECTURE
- **Compile:** python inject.py [lecture-slug]
- **Push:** cd C:\Users\ZhiYongLyu\Documents\landing-page then git push origin main

### Env vars in Vercel:
- ANTHROPIC_API_KEY
- ELEVENLABS_API_KEY
- STRIPE_WEBHOOK_SECRET

---

## WHAT IS BUILT AND WORKING

### api/diagnose.js (live, do not overwrite)
- action:'diagnose' — diagnoses wrong answer
- action:'tts' — ElevenLabs voice. Voice IDs: Maths=InRyolULHTXjegISsXuJ, Sciences=eXpIbVcVbLo8ZJQDlDnl, English=kdmDKE6EkgrWrrykO9Qt, History/Geography=PLACEHOLDER
- action:'mark' — returns { ok, pairs[] } where pair = { annotation, weakness, worked_step }

### base-template.txt (local only, NOT in GitHub)
- Two-box layout: left white box (flex:2), right white box (flex:1), background shows between
- Progress bar inside left box top, nav strip inside left box bottom
- Pill chat input bottom of right box (mic circle + blue arrow circle)
- Phase 2-4 marking flow fully coded in CSS + JS
- MarkingFlow engine sets window.notifyWrongAnswer(qNum, studentAnswer, correctAnswer)
- CRITICAL: old DeepSeek notifyWrongAnswer was removed — only MarkingFlow version exists
- Every submitAnswerN() calls window.notifyWrongAnswer on wrong answer

### Phase 2-4 flow (confirmed working on live test)
Wrong answer → buttons fade → purple "AI is marking" banner → right box rebuilds → API fires → Continue button enables → each press reveals one weakness card (title + body + HOW TO APPLY IT) → retry buttons appear

### Diagram pipeline (in Maths folder)
- generate_diagrams_d3.py — calls Claude Haiku for geometry as JSON, renders via D3
- render_diagram.js — Node.js, jsdom + D3, outputs clean SVG
- Architecture: AI decides WHAT, real trigonometry decides HOW. No AI arithmetic for positions.
- Triangle test: 90/35/55 degrees rendered at 0.000000 drift. Confirmed accurate.
- SVGs have labelled element IDs (id="angle-A", id="line-AB") for annotation targeting

### Career layer (live on site)
- dream_career column in Supabase (NOT career_goal — that doesn't exist)
- Random career fact 3x per lecture + once at end
- Facts database: Doctor, Lawyer, Footballer, Vet, Games Developer (40 facts each)

---

## WHAT NEEDS DOING — DESKTOP

1. Answer options missing — compiled test lecture has no A/B/C/D buttons
2. Diagram annotations not drawing — weakness text shows but no circles/arrows on diagram
3. Continue button may skip straight to retry — check advanceStep() in MarkingFlow
4. Extend diagram pipeline to also generate question + answer options + mark scheme in one call
5. Remove question outline card (pink border around each question)
6. History + Geography voice IDs — Montural needs to pick on ElevenLabs

---

## IPHONE BUILD SPEC

### What it is
Web app, not native. Student opens monturalearn.co.uk/iphone/draw.html in iPhone Safari. Add to Home Screen = feels like real app. No App Store needed yet.

### Strategy
Golden Master — build everything for Maths AQA Higher first, fully working, then clone to all other subjects. Change only: subject name, background colour, voice ID.

### Pages to build (store in /iphone/ in the repo)
1. draw.html — main drawing canvas
2. pairing.html — QR scan to connect to desktop
3. weakness.html — weakness cards after marking
4. career.html — career motivation between questions

### Design rules (NON-NEGOTIABLE)
- Landscape only — lock orientation, no portrait ever
- Full bleed — diagram fills entire screen
- 60fps drawing — smooth, native feel
- Touch targets minimum 44px
- Premium feel — Apple Notes level of polish
- No clutter while drawing — only diagram, tools, submit button
- Tool bar at bottom: Pen (black), Red pen, Blue pen, Eraser, Clear (needs confirm tap), Submit button right side

### Pairing flow
1. Desktop shows QR code encoding { sessionId, lectureSlug, qnum }
2. Student scans on iPhone
3. Both connect to Supabase Realtime channel: montura-draw-{sessionId}
4. Both show "Connected"
5. Use qrcode.js via CDN

### Sync protocol (Supabase Realtime Broadcast ONLY — no WebSockets)
- Stroke: { type:'stroke', points:[{x,y}], color, width, qnum }
- Submit: { type:'submit', qnum, imageDataUrl }
- Marking result: { type:'marking_result', pairs:[] }

### Coordinate system
- All diagrams use SVG viewBox="0 0 400 300"
- iPhone canvas uses same 400x300 internal space
- Scale SVG to fit iPhone landscape screen, keep internal coords identical
- Strokes broadcast in 400x300 space, desktop rescales to its own canvas

### Submit flow
1. iPhone taps Submit → sends imageDataUrl via Supabase
2. Desktop receives → calls api/diagnose.js action:'mark'
3. Desktop broadcasts marking_result back to iPhone
4. Both screens show weakness cards
5. ElevenLabs voice plays on iPhone speaker

### Supabase table needed
CREATE TABLE IF NOT EXISTS draw_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  lecture_slug TEXT NOT NULL,
  student_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

### iPhone build order
1. draw.html static design
2. pairing.html static design
3. Wire pairing (QR + Supabase connect)
4. Wire drawing sync (strokes iPhone to desktop)
5. Wire submit → marking → weakness on both screens
6. Wire voice on iPhone
7. Wire career cards
8. Test on real iPhone landscape
9. Fix what feels wrong
10. Clone to other subjects

### DO NOT
- Touch base-template.txt (desktop owns it)
- Touch api/diagnose.js without checking desktop first
- Add new api/ files (at 12 function cap)
- Use WebSockets
- Build portrait mode

---

## SESSION LOG
*(Update this at the end of every session)*

### Last desktop session:
COMPLETED: base-template.txt two-box layout, Phase 2-4 marking flow, fixed notifyWrongAnswer bug, weakness cards confirmed working, diagram pipeline working (generate_diagrams_d3.py + render_diagram.js), api/diagnose.js action:'mark' live

NEXT DESKTOP: Add answer options to test lecture, add diagram annotation canvas overlay, extend pipeline to generate questions+options+markscheme, remove question outline card

NEXT IPHONE: Build draw.html static design first, then pairing.html, then wire everything in order above
