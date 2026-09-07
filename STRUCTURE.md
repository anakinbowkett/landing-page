# Montura Repo Structure
# anakinbowkett/landing-page on GitHub
# Every file here maps to a real path in that repo.

```
anakinbowkett/landing-page/
│
├── api/                          ← Vercel serverless functions (backend)
│   ├── chat.js                   ← EXISTING: AI chat per lecture question
│   ├── create-checkout-session.js← EXISTING: Stripe
│   ├── stripe-webhook.js         ← EXISTING: Stripe
│   ├── verify-payment.js         ← EXISTING: Stripe
│   ├── waitlist.js               ← EXISTING
│   ├── track-referral.js         ← EXISTING
│   ├── ambassador-*.js           ← EXISTING
│   ├── admin-payouts.js          ← EXISTING
│   │
│   ├── diagnose.js               ← TO BUILD: AI thought diagnosis + annotations
│   ├── tts.js                    ← TO BUILD: ElevenLabs text-to-speech proxy
│   └── sync.js                   ← TO BUILD (later): WebSocket draw sync
│
├── db/                           ← Database — all schema changes live here
│   └── migrations/
│       ├── 001_cognitive_diagnosis.sql   ← DONE: thought_diagnoses etc
│       ├── 002_career_profile.sql        ← TO BUILD: career/CV motivation layer
│       └── 003_draw_sessions.sql         ← TO BUILD (later): draw sync sessions
│
├── mobile/                       ← PWA files — makes the site installable
│   ├── manifest.json             ← TO BUILD: PWA manifest (name, icons, colors)
│   ├── sw.js                     ← TO BUILD: service worker (offline support)
│   └── icons/                    ← TO BUILD: app icons (192px, 512px)
│
├── lectures/                     ← EXISTING: generated lecture HTML (inject.py output)
│   └── [subject]/[slug]/index.html
│
├── scripts/                      ← Build/generation scripts
│   ├── inject.py                 ← EXISTING: lecture builder
│   └── generate-icons.py         ← TO BUILD: generates PWA icons from a source image
│
├── shared/                       ← Shared CSS/JS across all pages (new)
│   ├── design-system.css         ← TO BUILD: single source of truth for colors/fonts
│   └── mobile-nav.js             ← TO BUILD: bottom bar JS (wires Insight/Chat buttons)
│
├── english-base-template.txt     ← EXISTING: lecture template (mobile CSS already added)
├── maths-base-template.txt       ← EXISTING: needs mobile CSS added (later)
│
├── dashboard.html                ← EXISTING: needs mobile adaptation
├── onboarding-step1.html         ← EXISTING: needs mobile adaptation
├── onboarding-step2.html         ← EXISTING: needs mobile adaptation
├── onboarding-step3.html         ← EXISTING: needs mobile adaptation
├── onboarding-step4.html         ← EXISTING: needs mobile adaptation
├── onboarding-step5.html         ← EXISTING: needs mobile adaptation
├── pricing.html                  ← EXISTING
├── signin.html                   ← EXISTING: needs mobile adaptation
├── signup.html                   ← EXISTING: needs mobile adaptation
├── safeguarding.html             ← EXISTING
├── terms.html                    ← EXISTING
└── privacy.html                  ← EXISTING
```

## Build order

Phase 1 — Shell (doing now):
  1. Wire bottom bar JS (mobile-nav.js)          ← NEXT
  2. Design system CSS (design-system.css)
  3. Dashboard mobile
  4. Onboarding mobile
  5. Sign in / Sign up mobile

Phase 2 — PWA:
  6. manifest.json
  7. sw.js (service worker)
  8. Test Add to Home Screen on real iPhone

Phase 3 — AI Tutor:
  9.  api/diagnose.js
  10. api/tts.js (ElevenLabs)
  11. Annotation canvas renderer (in english-base-template.txt)

Phase 4 — Draw Sync (M1):
  12. api/sync.js (WebSocket)
  13. db/migrations/003_draw_sessions.sql
  14. Landscape draw mode on iPhone

Phase 5 — Career Layer:
  15. db/migrations/002_career_profile.sql
  16. Career CV dashboard widget
  17. Between-lecture fact display
