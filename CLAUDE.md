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

### Supabase project (used by desktop AND the iPhone side — same project either way)
- URL: `https://bdoesoqpjhpxkwsjauwo.supabase.co`
- Anon key (public, safe in client code — already live in the repo): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkb2Vzb3FwamhweGt3c2phdXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODUzODIsImV4cCI6MjA4MTA2MTM4Mn0.R2fgp-wqasPtn86gVcoM2RPpSMc-66_77F6VX-DzG-s`

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

## IPHONE BUILD — PIVOTING TO NATIVE (read this first)

**The web-app plan below (Phase 1) is done and deployed, but we are now building the real iPhone client natively instead of continuing on the web.** Reason: iOS's system text-selection/Live Text magnifier pops up over canvas drawing in ANY browser (tried Safari and Chrome — both are WebKit under the hood on iOS, same result) and there is no public web API to fully suppress it. A real native app never triggers it in the first place. Montural wants no shortcuts, so we're rebuilding the iPhone side properly rather than wrapping the website.

### Native stack (decided, do not deviate without asking)
- **Xcode** (Apple's official IDE — the only thing that can build/run/submit an iOS app)
- **Swift** + **SwiftUI** for the app itself
- **PencilKit** for the drawing surface specifically (this is what kills the magnifier problem for good — native drawing views never opt into that system behaviour)
- **Supabase Swift SDK** (or direct REST/Realtime calls) talks to the exact same Supabase project as desktop — see credentials above. No backend changes needed for this pivot.
- Desktop stays exactly as-is: the compiled lecture HTML pages and shared/phone-pair.js are untouched by this pivot. Only the iPhone CLIENT is being rebuilt.

### Environment status (as of this session)
- This Mac only had Xcode Command Line Tools, not full Xcode — `xcodebuild` failed.
- Full Xcode requires macOS 26.6+; this Mac was on macOS 15.4.1 (Sequoia).
- Montural started the System Settings upgrade to macOS Tahoe 26.7. **Next session: confirm the OS upgrade finished, then install Xcode from the Mac App Store, then create a new SwiftUI App project named "Montura Learn."**
- I (Claude) cannot open Xcode's GUI or press Run — Montural does that. I write/edit the .swift files inside the project once it exists, same workflow as the HTML files.

### First native milestone (once Xcode project exists)
A single screen with just PencilKit drawing on it — prove no magnifier, feels native — before porting pairing/lectures/anything else over.

### What to carry over from the web build (protocol + concepts, not code)
The desktop side (shared/phone-pair.js) already speaks a specific Realtime broadcast protocol on channel `montura-pair-{studentId}` (Supabase Auth user id) — the native app needs to speak the exact same protocol so desktop needs zero changes:
- `phone_opened` — phone broadcasts this **continuously** (every ~1.2s, for as long as the app is open, not just once) so any lecture page desktop opens can find it. This was a real bug this session: broadcasting only until the first pairing succeeded meant switching lectures on desktop went silent forever.
- `pair_ack { lectureSlug, qnum, diagramSvg, answerOptionsHtml }` — desktop's reply, sent whenever it hears phone_opened. diagramSvg is the current question's actual `<svg>...</svg>` markup (outerHTML) so the phone renders the identical diagram, not a copy. answerOptionsHtml is the question's real answer-button markup — parse out just the option texts, the native app renders its own styled buttons from that.
- `phone_ready` — phone sends this once the student accepts (see accept-once behaviour below).
- `stroke_start { color, width, erase }`, `stroke_point { x, y }`, `stroke_end` — freehand strokes, broadcast **in the diagram's own SVG viewBox coordinate space**, not raw pixels or a fixed 400x300 (that was the old plan; reality is every diagram has its own viewBox). Convert screen point → viewBox point using "meet" (contain) scaling math on the sending side; the receiver converts viewBox → its own screen point the same way. This is what keeps a stroke lining up on both screens despite being totally different sizes/shapes.
- `clear_canvas` — clears the shared drawing surface both sides.
- `answer_select { qnum, index }` — tapping an answer option on EITHER device selects it on both (index into the option list, not the option text).
- `answer_submit { qnum }` — desktop responds by calling its own real `toggleSingleAnswerN`/`submitAnswerN` functions already on the page, so grading logic is untouched.
- `submit { qnum, imageDataUrl }` — legacy fallback for a free-written (no fixed options) answer: sends a final canvas snapshot.
- Desktop reuses a pre-existing `.student-draw-canvas` element that was already sitting on every diagram from an earlier, separate feature — it does NOT create a second canvas. If you're ever debugging "the shape doesn't match," check this first.
- Pairing is account-based, no QR/camera at all — both sides know the signed-in student's id (same Supabase Auth account on both devices) and that's the whole handshake.
- Accept only happens once per session (remembered via localStorage on the web version — native app should use its own persisted flag, e.g. UserDefaults). After that, opening a different lecture on desktop should make the phone follow automatically with zero taps.

### Concepts carried over from the web build's UX (Montural specified these, keep them)
- **Sketch Space / Write Space**: at the start of each iPhone-required question, a one-time 50/50 landscape split — left = Sketch Space (diagram + free drawing/workings, no submit), right = Write Space (the actual answer — either mirrors the question's real answer buttons, or ruled lines for a free-written answer if there are no fixed options; has the one Submit button, bottom-right circle+arrow). After picking once, swipe to switch between the two without seeing the split again.
- Landscape only, no portrait, ever.
- No clutter while drawing — tools live in a small pop-out tray (was a redesign this session from a permanently-visible toolbar), triggered by a small toggle button bottom-right, with Submit (Write Space only) to its right.
- On desktop, per-question UI: a small permanent grey one-line hint next to the diagram ("Draw on your iPhone to answer") that's always there, PLUS a blue "Answer on your phone" box with a Connect button that hides itself once the phone actually connects.
- The old QR-code pairing flow, the fixed 400x300 coordinate space, and the weakness/career/voice screens below were the ORIGINAL plan before pairing was actually built — superseded by the account-based pairing + per-diagram-viewBox coordinate system above. Kept here only as a reminder of what NOT to rebuild.

### DO NOT
- Touch base-template.txt (desktop owns it)
- Touch api/diagnose.js without checking desktop first
- Add new api/ files (at 12 function cap) — irrelevant to the native app anyway, it talks to Supabase directly
- Use WebSockets (Supabase Realtime Broadcast handles this already)
- Build portrait mode

---

## SESSION LOG
*(Update this at the end of every session)*

### Last desktop session (pre-iPhone-pairing work):
COMPLETED: base-template.txt two-box layout, Phase 2-4 marking flow, fixed notifyWrongAnswer bug, weakness cards confirmed working, diagram pipeline working (generate_diagrams_d3.py + render_diagram.js), api/diagnose.js action:'mark' live

NEXT DESKTOP: Add answer options to test lecture, add diagram annotation canvas overlay, extend pipeline to generate questions+options+markscheme, remove question outline card (still open — not touched this session)

### This session (web-based iPhone pairing — built, working, but now being superseded by native):
Built the whole web iPhone client and desktop pairing end to end: iphone/login.html, iphone/pairing.html, iphone/draw.html, shared/phone-pair.js, and wired lecture 103-angles-in-polygons.html (75/111 got earlier passes but weren't kept current — testing was scoped to 103 only). Live stroke-by-stroke drawing sync, two-way answer selection sync, Sketch Space/Write Space split with swipe switching, account-based pairing with accept-once persistence and auto-follow across lecture switches, no-cache headers in vercel.json to stop iOS from serving stale cached pages. Full protocol and UX details now live in the "IPHONE BUILD — PIVOTING TO NATIVE" section above — read that before doing anything iPhone-related.

Real bugs found and fixed along the way (useful context if similar symptoms show up again): nav strip was hover-only visible (22px sliver, invisible in practice); a failed Supabase channel connection attempt was being cached forever instead of retrying; phone stopped announcing itself after the first successful pairing, so opening a different lecture on desktop had nothing to hear it — fixed by making the phone broadcast continuously.

Ran into a wall that can't be fixed from web code: iOS's system text-selection/Live Text magnifier appears over canvas drawing in both Safari and Chrome (same WebKit engine underneath either way) and there's no public web API to fully suppress it. Montural decided: rebuild the iPhone client natively rather than take that shortcut.

### NEXT (native iOS pivot):
1. Confirm macOS Tahoe 26.7 upgrade finished (was mid-install when session ended)
2. Install Xcode from the Mac App Store
3. Create new SwiftUI App project named "Montura Learn"
4. First milestone: single screen, just PencilKit drawing, prove no magnifier
5. Then port pairing (Supabase Swift SDK, same Realtime channel/protocol — see above), Sketch Space/Write Space, diagram rendering (SVG rendering strategy on native not yet decided — diagrams currently ship as raw SVG markup from desktop, need a plan for rendering that in SwiftUI/PencilKit), answer sync
6. Desktop side (lecture HTML + shared/phone-pair.js) does not need to change for this pivot — only the iPhone client is being rebuilt
