# Monturalearn — Technical Handoff

**Purpose of this document:** you (the next AI session, or future-Claude in a fresh
conversation) are picking up mid-build on a live, real-money UK EdTech product. This
document exists so you do not have to reconstruct architecture decisions, re-discover
bugs that have already been found and fixed, or accidentally undo something that was
changed for a specific, non-obvious reason. Read this in full before touching any
file. Where this document says "do not do X," that instruction exists because X was
tried, or considered, and rejected for a stated reason — do not re-litigate it without
re-reading the reasoning first.

The person you're working with (Anakin Bowkett, goes by "Montura") is a solo,
non-technical founder — self-described "vibe coder," no formal development background.
See the "Working with Montura" section near the end before you send your first message.

---

## 1. What this project is

Monturalearn (monturalearn.co.uk) is a UK GCSE (and, in a separate section, A-Level)
revision platform. Students sign up, pick subjects (exam board + tier), and get
interactive lectures with instant marking, an AI "Insight Guide" embedded in each
lecture, Flashtiles (spaced-repetition practice), past papers, and live quizzes with a
leaderboard ("Mastery Miles"). It is about to launch publicly and take real payments
from what is mostly an under-18 user base.

**The business model, as of the end of this session:**
- **Free tier (forever, no card, no time limit):** any signed-in student can use
  lectures for every subject/board/tier. Nothing else.
- **Montura Pro (£6.99/month):** unlocks Flashtiles, past papers, live quizzes, and
  the leaderboard. First month is **99p** as an acquisition offer, redeemable once per
  person (see the anti-abuse section — this took several iterations to get right and
  is worth reading carefully).
- **3-day free trial:** every new signup gets 3 days where Pro features (Flashtiles
  etc.) are unlocked automatically, no payment needed, so they can try everything.
  After 3 days, Pro features lock; lectures never lock, ever, trial or not.
- There is **no yearly plan** — it existed briefly (£99.50/year, 17% off) and was
  explicitly removed. Do not reintroduce it unless asked.

---

## 2. Stack and access

| Layer | Tool | Notes |
|---|---|---|
| Hosting | **Vercel** | **Hobby plan — hard cap of 12 serverless functions.** This has already caused one real production outage this session. See §7. |
| Repo | **GitHub** — `anakinbowkett/landing-page` | Public repo, `main` branch, Vercel auto-deploys every push to `main`. No staging/preview workflow is currently used — direct-to-main, matching how Montura already worked before this session. |
| Database/Auth | **Supabase** | Postgres + built-in auth. Client-side uses the anon key (public, fine — protected by RLS). Server-side (webhooks, middleware) uses the **service role key**, which bypasses RLS and must never appear in any file shipped to the browser. |
| Payments | **Stripe** | **Live mode**, not test mode. Real cards get charged. |
| Domain | **IONOS** | Domain registrar/DNS only, not otherwise relevant to this work. |

### How to get repo access
Ask Montura for a **fine-grained GitHub PAT**, scoped to just
`anakinbowkett/landing-page`, with **Contents: Read and write** permission, short
expiry (7–30 days). He's done this several times before and knows the flow:
`github.com/settings/personal-access-tokens/new`. He is on **Windows, Command
Prompt** — if you ever need him to run a local script, see §11 for the exact quirks
of that environment (env vars, blocked `.js` downloads, etc.).

If you have a bash/computer-use tool: clone via
`git clone --depth 1 https://<token>@github.com/anakinbowkett/landing-page.git`,
then immediately `git remote set-url origin https://github.com/anakinbowkett/landing-page.git`
so the token doesn't sit in `.git/config`. Push with the token passed as a Basic auth
header rather than embedded in the remote URL:
```
git -c http.extraHeader="Authorization: Basic $(echo -n "x-access-token:<TOKEN>" | base64 -w0)" push origin main
```
**Always `git pull` immediately before starting any edit session.** Another,
unrelated AI session has been working in parallel on creator/ambassador e-sign pages
(`creator-consent.html`, `creator-contract.html`, `ambassador-signup.js`) — several of
its commits landed on `main` mid-session here with zero conflicts. That work is not
yours to manage unless Montura says otherwise; just don't be confused when you see
commits you don't recognise.

**Sandboxed AI environments (like this one) typically cannot reach `api.stripe.com`,
`api.twilio.com`, or other third-party APIs directly** — only package registries
(npm, pypi, etc.) and GitHub. If you need to call the Stripe API directly (create a
product, price, coupon, etc.), you cannot do it from your own tool sandbox. Instead,
write a small zero-dependency Node script using the built-in `fetch`, and have Montura
run it locally with a Stripe **restricted key** (create at Stripe → Developers → API
keys → Restricted keys → give it write access to only the specific resources it
needs, e.g. Products/Prices/Coupons). Two such scripts already exist and were run
this session — see §9.

---

## 3. Core architecture: how entitlement actually works

This is the single most important section. Read it twice.

### 3.1 The three states
Every account has a `subscription_status` column on `user_profiles`, one of:
- `'trial'` — new signup, within (or past) their 3-day window
- `'active'` — paying Pro subscriber
- `'expired'` — trial ended and never paid, OR was paying and cancelled/payment
  failed and the period has ended

There is also `trial_start_date` (timestamptz) — set **once**, at the moment of
account creation, and never touched again (guarded explicitly in code — see §5.3).

### 3.2 The entitlement decision, server-side, in Postgres
`supabase/check_entitlement.sql` defines a function:
```sql
create or replace function check_entitlement(p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select
    case
      when subscription_status = 'active' then true
      when subscription_status = 'trial'
        and trial_start_date is not null
        and now() < (trial_start_date + interval '3 days') then true
      else false
    end
  from user_profiles
  where id = p_user_id;
$$;
```
The critical detail: **`now()` here is Postgres's own clock**, not anything the
browser sends. This is deliberate and is what makes the trial un-gameable by clock
manipulation, incognito windows, new tabs, or editing localStorage — none of those
things can influence what Postgres thinks the time is.

### 3.3 Where this gets enforced: `middleware.mjs`
This is a **Vercel Routing Middleware** file (framework-agnostic — this is NOT a
Next.js project, so it uses the plain Web `Request`/`Response` API, not
`NextResponse`). It runs server-side, on Vercel's edge, before literally any file
under `/lectures/*` is sent to a browser. Key facts about this API, confirmed via
Vercel's docs this session (worth re-confirming if it's been a while, as this product
surface — "Routing Middleware," formerly "Edge Middleware" — has been actively
evolving):
- `import { next } from '@vercel/functions'` → `return next();` = let the real file
  through, unmodified.
- `return Response.redirect(new URL('/somewhere', request.url), 302);` = send the
  browser elsewhere, URL bar changes.
- `return new Response(htmlString, { status: 200, headers: {...} });` = serve this
  exact content **for the URL the browser already requested**, URL bar does NOT
  change. This is how the "click into Flashtiles, see a locked box, same URL" UX
  works — there is no built-in "rewrite" helper in the framework-agnostic API (that's
  a Next.js-only concept), so the middleware function itself builds and returns the
  locked-page HTML as a literal string.

Two tiers of path inside `/lectures/*`:

**Free forever (lecture content itself)** — matched by this regex, deliberately
narrow:
```js
const FREE_LECTURE_PATH = /^\/lectures\/[^/]+\/(lectures\.html|lectures\/[^/]+\.html|lectures-data\.js|question-counts\.js)$/;
```
Matches things like `/lectures/aqa-biology-higher/lectures.html` (the subject's
lecture menu) and `/lectures/aqa-biology-higher/lectures/sci-bio-p1-l1-....html`
(an actual lecture), plus the two small `.js` data files those pages need to
render. If this regex matches, middleware calls `next()` immediately — **no
entitlement check at all**, just proof of a valid signed-in session (see §3.4).

**Everything else under `/lectures/*`** (Flashtiles: `flashtiles-*.html`; past
papers: `past-papers*.html`; quizzes: `quick-test-daily.html`) — anything that
does **not** match the free regex. For these, middleware calls
`check_entitlement()` via a Supabase RPC request (using the service role key, so
it bypasses RLS and always gets a real answer). If entitled → `next()`. If not →
serve the locked-feature HTML (see §3.5).

**Important design principle, stated explicitly in the code comments and worth
preserving:** the regex/matching approach **defaults to "needs paying for"** for
anything unrecognised, not "free." If a new page type gets added later and nobody
updates the regex, it fails closed (protected) rather than accidentally leaking
free access. Never invert this default.

`/lectures/preview/*` is a deliberate, permanent exception — always public, no
auth check at all. This is the homepage's live interactive demo (embedded in
`index.html` via iframe), and needs to work for anonymous visitors.

**One critical operational fact:** because the actual lecture question content is
baked directly into each static HTML file (not fetched dynamically from Supabase —
confirmed by grepping a real lecture file and finding a `QUESTIONS = [...]` array
inline), the middleware's job of intercepting BEFORE the static file is served is the
*only* thing standing between "not entitled" and "full access via view-source or
disabling JS." There is no secondary defense at the data layer for these particular
pages. If middleware.mjs is ever accidentally disabled, misconfigured, or its
matcher pattern narrowed, Flashtiles/past papers/quizzes become fully public
instantly, with no visible symptom other than people getting access they shouldn't.
Treat changes to this file with proportionate care.

### 3.4 How middleware knows who's asking: the cookie sync problem
Supabase's JS SDK (loaded via CDN script tag, no `@supabase/ssr` package) stores the
session in **localStorage** by default. Middleware runs server-side, before any page
JS executes, and **cannot read localStorage** — it can only read cookies sent with
the HTTP request. So there's a bridge: `auth-check.js` (already included on most
pages via `<script src="auth-check.js"></script>`) was modified to listen for
`sbClient.auth.onAuthStateChange((event, session) => {...})` and mirror the
`session.access_token` into a cookie called `sb-access-token` on every sign-in,
token refresh, and sign-out (clearing it on sign-out). Middleware reads this cookie,
then calls `${SUPABASE_URL}/auth/v1/user` with it as a Bearer token (using the
service role key as the `apikey` header) to get back the real, verified user object
— never trusting anything the request merely claims.

**If entitlement checks start failing for everyone** (e.g. constant redirects to
signin), the first thing to check is whether this cookie is actually being set —
open DevTools → Application → Cookies on a logged-in session and look for
`sb-access-token`. If it's missing, `auth-check.js`'s `onAuthStateChange` listener is
the place to debug.

### 3.5 The locked-feature page
Generated inline inside `middleware.mjs` as a template literal
(`lockedFeaturePage(featureName)` function) — not a separate static file, so there's
nothing to accidentally serve un-gated. `featureNameFromPath()` inspects the URL to
personalise the heading ("Flashtiles is part of Montura Pro" / "Past Papers is part
of..." / "Daily Quiz is part of..."), falling back to "This feature." The page has a
primary CTA linking to `/pricing.html?trial_ended=true` and a secondary "Back to
dashboard" link.

**In-progress at the end of this session:** Montura asked for this button's label to
change from "Subscribe to Montura Pro" to **"Upgrade Now"**, to match a new button
he wants added to the site header (see §12, item 1 — this was not finished).

---

## 4. The free-tier redesign (subject cards, dashboard)

This took a full correction cycle mid-session, so it's worth understanding *why* the
current state is what it is, not just what it is.

**What used to exist (removed, do not reintroduce):** subject cards on the dashboard
used to render a "Pro" badge and dim/grey out if `shouldSubjectBeLocked(subject)`
returned true, and clicking a locked card triggered a `showPaywall()` modal
("Your free trial has ended... Upgrade to Pro!"). This was the wrong mental model —
it implied *subjects* lock, when actually only three *features within* a subject
lock (Flashtiles/past papers/quiz), and lectures themselves never lock.

**Current, correct state (`dashboard.html` and `alevel/dashboard.html`):**
- `shouldSubjectBeLocked()` — **deleted entirely.**
- `showPaywall()` (the modal) — **deleted entirely.** There is nothing left in
  `dashboard.html` that can trigger it, and nothing should be added that does — any
  "you need Pro" messaging now belongs on the locked-feature page inside the
  subject's own lecture area (§3.5), not on the dashboard.
- `createSubjectCard()` — subject cards are unconditionally clickable, always
  navigate straight to `lectures/${route}/lectures.html` for that subject/board/tier,
  with no lock icon, no Pro badge, no dimming, no `isLocked` branching at all.
- The "+Subjects" button — used to check trial status before allowing navigation to
  `add-subjects.html`; that check was removed. Adding subjects is free (since
  lectures are free), so there's nothing to gate.
- Trial banner copy (both the sticky top banner and the dynamic countdown banner —
  see §12 for their current fate) used to say "...unlock all subjects" — factually
  wrong now. Fixed to describe what actually locks: Flashtiles, past papers, live
  quizzes.

**Data model note:** "Combined Science" is offered as *one* selectable subject in
onboarding but is tracked as **three separate rows** in `user_subjects`
(`Combined Science - Biology`, `Combined Science - Chemistry`,
`Combined Science - Physics`), matching the dashboard's existing per-component
progress-bar rendering. "Separate/Triple Science" (bare `Biology`/`Chemistry`/
`Physics` as standalone subjects, distinct from the Combined Science components) is
built into the onboarding UI as a real option but shown with a "Coming Soon" badge
and `pointer-events: none` — Montura asked for this specifically, to reserve the
option for later without it being selectable yet.

---

## 5. Onboarding — what was actually broken and fixed

### 5.1 Subject list correctness
`onboarding-step2.html`'s subject list used to include subjects that don't exist on
the platform at all (History, Geography, Computer Science, Business, Psychology,
Religious Education, Food & Nutrition) and had backwards Coming-Soon logic (bare
Biology/Chemistry/Physics were live, "Combined Science" was Coming Soon — the
opposite of what should be true). Fixed: only Mathematics, English Language, English
Literature, and Combined Science are live and selectable; bare
Biology/Chemistry/Physics show as Coming Soon (see §4's data model note for why the
*stored* name for these stays bare, e.g. `'Biology'`, even though the *displayed*
label says "Biology (Separate Science)" — matches what `dashboard.html`'s existing
`tripleScienceSubjects` check already expects).

`add-subjects.html`'s dropdown had the same non-existent-subjects problem, plus an
extra exam board (`WJEC`, never actually offered) and inconsistent casing
(`EDEXCEL` vs `Edexcel` elsewhere) — all fixed to match `onboarding-step2.html`'s
canonical list.

### 5.2 The bug that broke every single new signup — root cause
This is the most serious bug found this session, and it's worth understanding
exactly why it happened, because the *symptom* (brand-new accounts, zero seconds
old, showing "trial ended, subscribe now") could easily recur in a different form if
the underlying pattern isn't understood.

`onboarding-step4.html` (and identically, `alevel/onboarding-step4.html`) is where
the `user_profiles` row actually gets written at the end of onboarding. It was
writing:
```js
trial_end_date: trialEndDate.toISOString(),
```
But **every other file that reads trial status** (`dashboard.html`'s
`checkTrialStatus()`, `check_entitlement.sql`, `middleware.mjs`) reads
`trial_start_date`. Different column name entirely. So `trial_start_date` was
**never populated at signup** — it stayed `null` for every account. Every
downstream calculation that did `new Date(profile.trial_start_date)` on a `null`
value got the Unix epoch (1 Jan 1970), and every entitlement check concluded the
trial had ended 55+ years ago. Every new signup was locked out instantly, with
nothing in the UI or logs pointing at the actual cause — it just looked like "the
trial system is broken."

**Fixed:** now writes to `trial_start_date`, with the *actual current signup
timestamp* (`new Date().toISOString()`), not a pre-computed offset date. Also added
an explicit guard so a second write (e.g. if onboarding gets revisited) never resets
an already-set `trial_start_date`:
```js
trial_start_date: existingProfile?.trial_start_date || new Date().toISOString(),
```
**If you ever see "brand new account, instantly locked out" again, check this exact
column-name-mismatch pattern first** — it's an easy mistake to reintroduce if
anyone ever touches this insert/upsert again without checking what column name every
*other* file expects.

### 5.3 Other bugs fixed in the same files
- `onboarding-step4.html` used to **force-insert 6 hardcoded default subjects**
  (Maths/EngLang/EngLit/Combined Science ×3, all AQA Foundation) for literally every
  new signup, in addition to whatever the student actually picked on step 2 —
  meaning everyone got a bogus extra "AQA Foundation" version of subjects they may
  never have chosen. Removed entirely; now only inserts what was actually selected,
  exploding a "Combined Science" pick into its three tracked rows (§4).
- Trial length was hardcoded to **1 minute** (`trialEndDate.setMinutes(+1)`) in
  `onboarding-step4.html` and **20 seconds** in `dashboard.html`'s
  `checkTrialStatus()` — leftover test values, both fixed to the real 3 days.
- `dashboard.html`'s `checkTrialStatus()` had `return 'active';` as its literal
  first line, with a `// TEMPORARY: Unlock all subjects` comment, meaning **every
  single user, regardless of trial or payment status, had full access** — the real
  logic below it was dead code. This was an independent bug from §5.2 (both existed
  simultaneously; fixing one without the other would have left the system either
  fully open or fully broken). Removed.
- Trial countdown/banner logic had scattered hardcoded **48-hour** (instead of
  72-hour/3-day) math in several places (`showTrialBanner`'s internal calculation,
  and two separate call sites that back-derived a "trial start" by subtracting 48h
  from the stored end date — a fragile, error-prone pattern in itself). Also found:
  `showTrialBanner()` was being **called twice** in the same page-load flow,
  inserting the banner into the DOM twice. All fixed by having `showTrialBanner()`
  take the real `trialEndDate` directly (computed once, correctly, in
  `checkTrialStatus()`) rather than reconstructing dates via arithmetic, and by
  de-duplicating the call sites plus adding a `document.getElementById(...)` guard
  so it can never insert itself twice.

### 5.4 Consistent button "press" feel
Montura asked for a Claude-like subtle press-down animation on every interactive
element across onboarding (subject cards, option cards, dropdowns, Continue/Back
buttons) and later on pricing.html's CTA buttons too. Implemented as small CSS
blocks appended to each file's own `<style>`, using `transform: scale(0.97)
translateY(1px)` on `:active`, with the transition duration kept short (~0.1–0.15s)
so it reads as a physical press, not a laggy animation. This is scattered across
many files individually (not a shared stylesheet) — if a new onboarding page or
pricing-style page gets added, it needs its own copy of this block; there is no
central place it's defined.

---

## 6. Pricing psychology and page design (`pricing.html`)

This page has been rebuilt from scratch **three times** this session as the pricing
model itself changed. The current state (as of the last push) is the final,
intended one — do not partially revert toward an earlier model.

**Model history (for context, not to reintroduce):**
1. Original: "Core Subjects Bundle £6.99/mo" + "Pay Per Subject £3.50/subject/mo" —
   replaced entirely.
2. Second: "Montura Pro Monthly £9.99" + "Montura Pro Yearly £99.50 (17% off)" —
   replaced entirely, yearly removed per explicit instruction.
3. **Current:** "Free" (lectures only, £0 forever) vs **"Montura Pro"** (99p first
   month, then £6.99/month, cancel anytime).

**Visual/psychological design choices, all deliberate, explained to Montura at the
time and worth preserving unless he asks to change them again:**
- **Card sizing is asymmetric**, not a plain 50/50 grid: `grid-template-columns:
  0.88fr 1.12fr` — Pro physically occupies more space. More visual real estate reads
  as more value.
- Pro card sits at a **baseline `transform: scale(1.04)`** with a stronger
  drop-shadow — not just on `:hover`. First impression happens before anyone
  interacts with the page, so the hierarchy needs to exist at rest.
- Free card is deliberately **muted**: thin 1px border (not 2px), flat `#fafafa`
  background (not white), no baseline lift. This is the figure-ground effect —
  stronger contrast/elevation reads as "closer/more important," flatter reads as
  "background." Free is still fully legible, correctly labelled, and fully
  clickable — this is standard, ethical de-emphasis (same as Spotify/Notion do for
  their free tiers), not a dark pattern. Do not make Free hard to find or use; that
  crosses a line UK regulators (CMA) actively scrutinise.
- On mobile (`.pricing-grid { grid-template-columns: 1fr; }`), **Pro is reordered to
  show first** (`.pricing-card.featured { order: -1; }`) since the top of a mobile
  scroll is the highest-attention position available.
- **Price numerals were deliberately shrunk and lightened**: `.price-amount` went
  from `3rem`/`font-weight: 800` down to `1.75rem`/`font-weight: 600`. This is a
  real, documented behavioural-pricing effect — large, bold numerals read as
  psychologically larger amounts; small, light ones read as trivial. This is why
  receipts and subscription fine print are never printed huge and bold. The mobile
  media-query override that used to re-enlarge the price back to `2.5rem` was
  **removed** — small/light is the intended look at every screen size, not just
  desktop.
- The old price is shown **struck through** next to 99p (`£6.99` in `.price-was`,
  `text-decoration: line-through`, coloured red) — a standard anchoring technique so
  the discount size is obvious without needing to do mental maths.
- The badge ("FIRST MONTH: 99P") uses **red** (`#dc2626`), not the site's brand
  blue — a badge in the brand colour reads as a neutral label; a contrasting colour
  reads as "deal," which is the actual communicative goal.

**Functional details:**
- Checkout redirects via `window.location.href = data.url` (the Checkout Session's
  own `url` field, returned by `create-checkout-session.js`) — **not**
  `stripe.redirectToCheckout()` via Stripe.js. This was a deliberate simplification:
  it means this page needs **no publishable key at all**, which eliminates an entire
  class of bug (a live/test publishable-key mismatch silently breaking the checkout
  button). If you ever see Stripe.js re-added here, that's a regression.
- A banner (`#trial-ended-banner`, hidden by default) shows when the URL has
  `?trial_ended=true` — i.e. when someone's been served the locked-feature page
  (§3.5) and clicked through to upgrade. Explains that lectures stay free and only
  Pro features need paying for, so the context isn't lost between pages.
- The "Free" card's button, when clicked by a signed-in user, just goes to
  `dashboard.html` — there is no signup flow specific to "choosing" free, since
  every account is on some form of free/trial access by default already.

---

## 7. The Vercel Hobby-plan 12-function limit — read this before adding any API file

**This already caused one real production incident this session.** Full timeline,
because the pattern is exactly the kind of thing that will happen again if not
actively guarded against:

1. `api/` already had exactly 12 files (the Hobby-plan cap) before this session's
   work began: `admin-payouts.js`, `ambassador-dashboard.js`,
   `ambassador-login.js`, `ambassador-signup.js`, `chat.js`,
   `create-checkout-session.js`, `stripe-webhook.js`, `test-admin.js`,
   `track-referral.js`, `verify-payment.js`, `verify-waitlist.js`, `waitlist.js`.
2. A new file, `api/create-portal-session.js`, was added for the Stripe Billing
   Portal integration — bringing the count to **13**.
3. Vercel's build step for every subsequent deploy **failed silently from our
   point of view** — no error surfaced anywhere we could see automatically. The
   live site simply stayed frozen on the last successful deployment while **three
   full commits' worth of work** (the billing section, the webhook's intro-offer
   flag logic, and middleware's free-tier gating changes) sat pushed to `main` but
   never actually went live.
4. Discovered only because Montura manually opened Vercel's Deployments tab and
   found: *"No more than 12 Serverless Functions can be added to a Deployment on
   the Hobby plan. Create a team (Pro plan) to deploy more."*
5. Fixed by **merging** `create-portal-session.js`'s entire logic into
   `create-checkout-session.js`, selected via an `action` field in the POST body
   (`action: 'portal'` vs default `'checkout'`), bringing the count back to 12.

**Rules going forward, non-negotiable unless Montura explicitly upgrades to a paid
Vercel plan:**
- **Before adding any new file under `api/`, run a count first**
  (`ls api/*.js | wc -l` or equivalent) and confirm the result would stay at 12 or
  below.
- **The established pattern for adding new server-side functionality without a new
  file** is action-based routing inside an existing file, e.g.:
  ```js
  if (req.body?.action === 'portal') return handlePortalSession(req, res);
  if (req.body?.action === 'send-otp') return handleSendOtp(req, res);
  return handleCheckoutSession(req, res); // default
  ```
  `create-checkout-session.js` currently uses this pattern for `checkout` (default)
  and `portal`. If new payment/account-related server logic is needed, extend this
  same file rather than creating a new one, unless there's a strong reason not to.
- **Vercel builds failing does not always produce a visible error to whoever pushed
  the code.** After any deploy where you're not 100% sure it succeeded — especially
  after touching anything under `api/` or `middleware.mjs` — either ask Montura to
  check the Deployments tab directly, or fetch a known page and check its actual
  rendered content matches what you just pushed (see §10 for why even that isn't
  fully reliable).
- `middleware.mjs` does **not** count against this limit (confirmed empirically —
  deploys succeeded for a long stretch of this session with middleware.mjs present
  and 12 files in `api/`, and only broke once `api/` itself hit 13). Vercel Routing
  Middleware appears to be billed/limited separately from Serverless Functions, at
  least on Hobby. Don't take this as a place to hide unlimited logic, but it's not
  part of the same budget.

---

## 8. Payments and anti-abuse — the 99p intro offer

### 8.1 Why the account-level flag alone isn't enough
`user_profiles.used_intro_offer` (boolean, default `false`) is the primary source
of truth — checked server-side in `create-checkout-session.js` before deciding
whether to attach the Stripe coupon, and flipped to `true` in the webhook **only
once a payment genuinely completes** (never at checkout-session creation — an
abandoned checkout must never burn someone's one shot at the offer). This alone
stops the *same account* claiming it twice. It does nothing to stop someone
cancelling and making a brand-new account with a new email.

### 8.2 What was tried and explicitly rejected: SMS/phone verification
A full Twilio Verify integration was built this session — phone number entry, SMS
OTP send/check, a `used_intro_phone_numbers` Supabase table, a modal UI on
`pricing.html` — and then **entirely removed** at Montura's explicit request once he
learned Twilio charges per verification (roughly 8–9p per successful UK
verification, and the SMS-send cost is charged even on abandoned/incomplete
attempts). **Do not rebuild this without Montura explicitly asking for it and
being told the real cost again first.** If asked "can we stop the multi-account
trick better," the honest answer is: full protection means phone or similar
identity verification, which costs money; the free layers below are the ceiling
of what's achievable without spending anything.

### 8.3 What's actually in place now: two free layers
Both live in `create-checkout-session.js` (checked before applying the coupon,
server-side) and `api/stripe-webhook.js` (recorded only once payment completes):

**Card fingerprint** (`used_intro_card_fingerprints` table — `fingerprint` text PK,
`first_used_by` uuid, `first_used_at` timestamptz). Stripe provides a card
fingerprint (a hash identifying the physical card, not the card number itself) on
every payment at no extra cost. This can only be checked **after** a payment
completes (Stripe Checkout collects the card on Stripe's own hosted page — the
fingerprint isn't knowable beforehand). So this layer is necessarily reactive: if a
card that already claimed the offer is used again on a *different* account, the
already-completed 99p charge is **left alone** (deliberately — retroactively
refunding/cancelling a real transaction automatically was judged too risky to
false-positive on legitimate shared-card cases, e.g. two siblings on one family
card), but that second account's `used_intro_offer` flag is immediately flipped to
`true`, so it can never claim the discount again on any future attempt.

**Normalized email** (`used_intro_normalized_emails` table — `normalized_email`
text PK, `first_used_by` uuid, `first_used_at` timestamptz). Free, pure string
comparison, computed and checked **before** checkout, so — unlike the card
fingerprint — this one can actually prevent the discount from being offered in the
first place, not just close the door afterward. Normalization logic
(`normalizeEmail()` in `create-checkout-session.js`):
```js
function normalizeEmail(email) {
    const trimmed = (email || '').toLowerCase().trim();
    const [local, domain] = trimmed.split('@');
    if (!domain) return trimmed;
    let normalizedLocal = local.split('+')[0]; // strip +alias, all providers
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
        normalizedLocal = normalizedLocal.replace(/\./g, ''); // Gmail-only: dots insignificant
        return `${normalizedLocal}@gmail.com`;
    }
    return `${normalizedLocal}@${domain}`;
}
```
Catches `john.doe@gmail.com` / `johndoe@gmail.com` / `john+promo@gmail.com` as the
same underlying inbox. Does not catch someone using a genuinely different email
address and a genuinely different card — that combination is the honest ceiling of
what's free. Montura has explicitly accepted this trade-off.

### 8.4 Stripe object IDs currently live (do not recreate — reuse these)
- Product: **"Montura Pro"** — `prod_VB4greIAVxrzvZ`
- **Current live price**: `price_1UAuz8AgI47NcCKvEPF4Lxyq` — £6.99/month
- **Archived/inactive** (do not use — Stripe will error "price is inactive" if
  referenced): `price_1UAiWoAgI47NcCKvHZMMJDp2` (was £9.99/mo),
  `price_1UAiWpAgI47NcCKvbLds4XxL` (was £99.50/yr)
- Coupon: `S5H9GeKC` — £6.00 off, `duration: once` (nets 99p on a £6.99 first
  invoice). Env var `STRIPE_INTRO_COUPON_ID` in Vercel = this value.
- Two one-off local Node scripts were written and run by Montura to set these up
  (not part of the deployed app, just historical record in case something similar
  is needed again): `create-montura-pro.js` (original product + two prices) and
  `update-montura-pricing.js` (archived the old two prices, created the current
  £6.99 price and the coupon). Both used raw `fetch()` against
  `api.stripe.com/v1/...` with a restricted key passed via `set STRIPE_KEY=...` in
  Command Prompt — no npm dependencies, zero-install, because Montura's machine
  needed to just work without setup friction.

---

## 9. Billing management — deliberately NOT custom-built

Montura originally asked for a custom cancel-subscription UI "working exactly like
Claude's own billing screen." The actual implementation uses **Stripe's own hosted
Customer Portal** instead of building a bespoke cancel flow — this was a deliberate
trade-off explained to him at the time: less custom code in the highest-stakes area
of the product (real money), Stripe's own tested UI, PCI compliance handled by
Stripe, not us.

- `settings.html` has a "Billing" section showing plan status (`active`/`trial`/
  none) pulled from `user_profiles`, and a "Manage Billing" button.
- That button calls `create-checkout-session.js` with `action: 'portal'`
  (§7 — folded in to avoid a 13th function), which:
  1. Validates the caller's own bearer token via `supabase.auth.getUser(token)` —
     **never trusts a client-supplied userId** for this, since the whole point is
     preventing anyone from opening someone else's billing portal.
  2. Looks up `stripe_customer_id` from that verified user's `user_profiles` row.
  3. Creates a `stripe.billingPortal.sessions.create({...})` and returns its URL.
- **Portal configuration in Stripe** (one-time dashboard setup, already done):
  Settings → Billing → Customer portal → Cancel subscriptions: **ON**, cancel mode:
  **"Cancel at end of billing period"** (not immediate — this is what makes "keep
  access until the period you already paid for ends" work correctly with zero extra
  code; the subscription's Stripe `status` stays `active` right up until the actual
  period boundary, and the webhook's existing status-mapping logic already handles
  the eventual `canceled` transition correctly), collect cancellation reason: ON
  (optional, no functional effect), business info filled in (required for the
  portal to activate at all), redirect link set to `settings.html`.

**Webhook status mapping** (`api/stripe-webhook.js`,
`handleSubscriptionUpdated()`): maps Stripe's `status` field to the local
`subscription_status`:
```js
let subscriptionStatus = 'expired';
if (status === 'active' || status === 'trialing') {
    subscriptionStatus = 'active';
}
// canceled, unpaid, past_due, incomplete, incomplete_expired, paused
// all fall through to 'expired' — never silently hand back a fresh trial.
```
This used to default unknown statuses to `'trial'`, which was a real bug — it could
have silently re-granted trial-style access to someone whose subscription had
lapsed. Fixed to fail closed to `'expired'`.

Also listens for `customer.subscription.created` (in addition to `.updated`) as a
defensive fallback, in case a `checkout.session.completed` event is ever missed or
delayed — both map to the same handler, idempotently.

---

## 10. A payment bug that was silently breaking every successful purchase

`api/verify-payment.js` (called client-side right after a successful Stripe
redirect back to the dashboard, as a fast UI-confirmation nicety — the webhook is
the actual source of truth and fires independently) was initialising its Supabase
client with:
```js
process.env.SUPABASE_SERVICE_KEY  // wrong name
```
but the real env var, set correctly everywhere else in the codebase (webhook,
middleware), is `SUPABASE_SERVICE_ROLE_KEY`. Different name entirely. This meant
`verify-payment.js` was **silently failing on every single successful payment** —
Stripe charged the customer correctly, the webhook correctly activated their
account, but the "confirming your payment..." screen the customer actually saw
would have errored out, looking exactly like a failed/lost payment even though it
had gone through fine. This is precisely the "customer definitely paid, but the
site is confused about it and support gets a confused, upset email" failure mode
Montura repeatedly flagged as his biggest fear for this whole project. **Fixed** —
now reads `SUPABASE_SERVICE_ROLE_KEY` like everything else.

Also hardened while in this file: added a check that the Checkout Session being
verified actually belongs to the userId making the request
(`session.client_reference_id || session.metadata?.userId` must equal the
requesting `userId`) — previously a valid session ID from *any* completed
checkout could be used to mark *any* account as paid, if someone got hold of a
stray session ID.

---

## 11. Working with Montura — communication notes

- **Non-technical, self-described "vibe coder."** Explain things in plain English.
  Avoid unexplained jargon; if a technical term is necessary, briefly say what it
  means in context.
- **Wants decisions made for him**, not a menu of options, when there's a judgment
  call with a clearly-better technical answer. He's said this explicitly more than
  once. Reserve actual questions for things that are genuinely his call (pricing
  numbers, product/business trade-offs, whether to spend money on something) — not
  implementation details.
- **Often communicates via voice transcription** — messages can be run-on,
  mis-punctuated, or contain transcription artifacts ("dfeal" for "deal," etc.).
  Read for underlying intent rather than parsing literally; ask a clarifying
  question if genuinely ambiguous rather than guessing on something consequential.
- **Wants step-by-step guidance for anything requiring him to click through an
  external dashboard** (Stripe, Vercel, Supabase, GitHub) — he is not familiar with
  these interfaces. Give concrete, numbered, literal steps ("click the ⋯ menu on
  the right of that row," not "rotate the key"). He has repeatedly needed
  corrections when instructions assumed familiarity he doesn't have.
- **Is receptive to direct, unflinching technical honesty** — wants to know about
  bugs, risks, and things that are only "probably" fixed rather than "definitely"
  fixed. Says things like "no corner cutting" and "must be bulletproof" and means
  it. Don't soften bad news or claim something works without it actually having
  been tested (see §13 — this is the most important open item).
- **Is cost-sensitive and wants to know real costs before something gets built**,
  not after. He explicitly rejected a working feature (Twilio phone verification,
  §8.2) once he learned the per-use cost, and was annoyed it wasn't flagged more
  prominently before the build, not that the feature itself was wrong. Front-load
  any "this costs money per use" fact before building, not just as a footnote
  after.
- **Uses Windows, Command Prompt specifically** (not PowerShell, not WSL, not
  git-bash) for anything run locally. Two concrete environment quirks that have
  caused confusion and wasted time:
  - Env vars use `set VAR=value` (Enter) then the command on its own next line —
    **not** Unix-style `VAR=value command` on one line, which silently does the
    wrong thing in `cmd.exe`.
  - Chrome/Edge frequently **silently block or fail to save `.js` file downloads**
    (flagged as a potential-script-risk file type) even though the browser shows no
    obvious error — the file "downloads" but isn't actually there. The reliable
    workaround, used successfully multiple times this session: open Notepad, paste
    the script content directly, File → Save As, type the filename **with quotes**
    (e.g. `"script-name.js"`, so Notepad doesn't silently append `.txt`), set "Save
    as type" to **All Files**, save into the Downloads folder, then run it from
    Command Prompt. Don't offer a `.js` download link as the first suggestion for
    anything he needs to run locally — either lead with this method, or expect to
    need it as the fallback.

---

## 12. Immediate next steps — pick up exactly here

This is precisely where the session ended, mid-task. Do these first, in order,
before moving to anything in §14.

1. **Finish removing the trial banners and adding a header "Upgrade Now" button.**
   Montura's exact request: remove the blue "Free Trial: 2d 23h 56m remaining" box
   (this is the dynamically-inserted `#trial-countdown-banner`, created by
   `showTrialBanner()` in `dashboard.html`) **and** the separate blue sticky banner
   at the very top of the page (`<div id="trial-banner">`, "⏳ Free Trial Active -
   Upgrade to Montura Pro..." — this one is static HTML near the top of the
   `<body>`, distinct from the dynamic one, easy to miss). Both should go away
   entirely. In their place: a compact "Upgrade Now" button living **inside the
   header/nav bar itself** (the `.nav-right` area, near where the streak badge,
   Mastery Miles badge, and user-profile dropdown already live — around line
   1217–1225 in `dashboard.html` as of the last edit), not as a separate banner
   block. It should link to `pricing.html`. Reasonable default (confirm if
   genuinely ambiguous, but this matches everything else about the free-tier model):
   show it whenever `subscriptionStatus !== 'active'` — i.e. during trial and
   after trial-expiry-onto-free-tier alike, always giving an easy path to upgrade,
   not just during the trial countdown window.
   - **Also do the identical fix in `alevel/dashboard.html`** — same bugs, same
     structure, established pattern all session has been "fix GCSE version first,
     then mirror to A-Level."
   - A `grep` had already been run to map the relevant line numbers in
     `dashboard.html` right before the session ended:
     `.nav-right` (~63, ~1063, ~1217), `.user-profile-container` (~144, ~1225),
     `id="trial-banner"` (~1292), `showTrialBanner` function (~1984), its call site
     (~2092), `showTrialBannerIfNeeded` (~2367, ~2389) — re-run the grep yourself
     first, since line numbers will have shifted from any commits since.

2. **Change the locked-feature page's button label** in `middleware.mjs`
   (`lockedFeaturePage()` function) from "Subscribe to Montura Pro" to
   **"Upgrade Now"**, to match the new header button, for consistent terminology
   site-wide. This applies automatically to every subject/board/tier (it's one
   shared function), so no per-subject work is needed — just confirm this to
   Montura once done, since he's asked for reassurance on "every single subject"
   more than once and values hearing it confirmed explicitly.

3. **Before pushing, confirm `api/` is still at 12 files or fewer** (§7). Neither of
   the above two changes touch `api/`, so this should be a non-issue, but check
   anyway — it costs nothing and the failure mode if you don't is silent.

4. **After pushing, verify the deployment actually went live** — see §10 of this
   doc... no, see §13 below, which is the actual highest-priority item.

---

## 13. THE most important open item: nothing has been end-to-end tested yet

This is more important than §12's cosmetic banner work, and should genuinely be
prioritised alongside or even above it if Montura hasn't reported back on testing
by the time you pick this up. As of the end of this session, an extremely large
amount of interconnected logic changed (subject-card behaviour, the free tier, the
locked-feature page, the 99p offer, the anti-abuse checks, the billing portal) and
**none of it has been confirmed working via an actual real test** — only individual
pieces have been sanity-checked (syntax, function counts, a partial manual click
through subject cards). A 7-step test checklist was handed to Montura at the very
end of the session and he had only completed step 1 (new account → lectures open
correctly) by the time the conversation moved on to the banner-removal request.
**Do not assume anything beyond step 1 has been verified.** The remaining steps,
verbatim, still need running:

2. Click into Flashtiles, then past papers, then a quiz, from a trial or
   free-tier (non-Pro) account. Each should show the locked-feature box **on the
   same URL** — no redirect elsewhere, no pre-emptive "Pro" tag anywhere before
   clicking in.
3. A real payment on that account (real card, live Stripe) should charge **99p**,
   not £6.99, confirmed on Stripe's own checkout page before completing.
4. Immediately after paying, those same Flashtiles/past-papers/quiz pages should
   load normally — no more locked box.
5. In Supabase, `user_profiles` for that account should show
   `subscription_status = 'active'`, `used_intro_offer = true`, and there should be
   a new row in `used_intro_normalized_emails` (and `used_intro_card_fingerprints`)
   for that account.
6. Settings → Billing → Manage Billing → cancel ("at end of period"). Immediately
   after cancelling, Pro features should **still work** — access should only
   actually drop once the paid period genuinely ends, not the moment "cancel" is
   clicked.
7. A second, different account, signing up with an email that's a normalized-match
   for an already-used one (e.g. `you+test@gmail.com` if `you@gmail.com` already
   claimed the offer) should be charged **£6.99 immediately**, not 99p — this is
   the actual test of whether the anti-abuse logic works at all, and it has never
   been run once.

Get Montura through all seven, actually report back on each, and fix whatever
breaks — do not tell him "this should all be working now" as a conclusion on its
own; only say it's working once it's actually been shown to work.

---

## 14. Everything else still outstanding (lower priority than §12/§13, but not
forgotten — this was the original scope Montura gave at the very start of this
whole engagement, and only some of it has been done)

- **Logo cleanup sweep.** Fixed on `pricing.html` and the main dashboard nav
  already (duplicate "Montura" text sitting next to a logo image that already
  contains the wordmark — removed the redundant text span, kept just the image).
  **Not yet checked**: `index.html`'s footer, and possibly other pages
  (onboarding steps, `settings.html`, `signin.html`/`signup.html`) — search for
  the same pattern (`<img ... Monturalearn-logo...>` sitting next to a
  `<span>Montura</span>` or similar redundant text) across the whole repo.
- **Full security audit.** Some real vulnerabilities were found and fixed as a
  by-product of other work this session (the entitlement/paywall bypass in §3, the
  silent payment-confirmation failure in §10, an account-ownership gap in
  `verify-payment.js` and the billing portal endpoint), but there has been no
  deliberate, systematic pass looking for XSS, injection points, exposed secrets,
  or Supabase RLS policy gaps across the *whole* codebase. This was explicitly
  requested by Montura at the very start and has not been done as a standalone
  task.
- **UK legal/compliance audit** — not started. Montura explicitly wants this
  covering: Consumer Rights Act 2015, the Consumer Contracts (Information,
  Cancellation and Additional Charges) Regulations 2013 (particularly the 14-day
  cooling-off right for services, and what an explicit "I agree service starts
  immediately and I lose my cancellation right" consent step needs to look like at
  checkout — this has NOT been implemented and the current checkout flow doesn't
  address it at all), UK GDPR/Data Protection Act 2018, and PECR (cookie
  consent — no audit has been done of what's actually tracking visitors, so it's
  unknown whether a consent banner is even needed yet). **One specific point
  flagged early in this engagement and never resolved:** since the user base is
  mostly under-18 GCSE students, a minor generally can't be held to a binding
  subscription contract — this likely means either the account holder must
  confirm they're 18+, or a parent/guardian must be the one who actually signs up
  and pays. This affects how signup/checkout needs to work, not just wording in a
  policy, and has not been decided or built.
- **Terms & Conditions, Privacy Policy, and other required footer legal pages** —
  not written. Deliberately sequenced to come *after* the legal audit above, since
  accurate ToS needs to describe the real, finalised trial/billing/cancellation
  mechanics as source material — which, as of this session, now genuinely are
  finalised, so this can proceed once the audit above happens.
- **GitHub PAT hygiene.** The token used throughout this session has been sitting
  exposed in plain chat text for a very long conversation, with no confirmed
  expiry set when it was created. Recommend Montura revoke it and issue a fresh
  one (short expiry, scoped to just this one repo) before/after handing this off,
  as routine hygiene — not because of any known compromise, just because a
  long-lived, chat-exposed credential is bad practice to leave lying around
  indefinitely.
- **Maths lecture content generation** (unrelated to the platform-engineering work
  in this document, but part of the wider project, per Montura's own working
  notes elsewhere): several Maths tiers still need their lecture content
  generated via a separate local Python pipeline he runs himself — Edexcel
  Foundation is complete, other combinations are in progress or not started. Not
  something to action from an AI coding session unless specifically asked; noted
  here only so you don't assume the platform's content is 100% complete just
  because the payment/access engineering is far along.

---

## 15. Quick-reference: file map

| File | What it's for | Key thing to remember |
|---|---|---|
| `middleware.mjs` | Server-side entitlement gate for `/lectures/*` | Free-lecture regex, locked-feature inline HTML, cookie-based auth. See §3. |
| `supabase/check_entitlement.sql` | Postgres function, source of truth for trial/active status | Uses Postgres's own `now()`, never client-supplied. |
| `supabase/add_intro_offer_column.sql` | Adds `used_intro_offer` boolean to `user_profiles` | Already run. |
| `supabase/add_intro_fingerprint_table.sql` | Card-fingerprint anti-abuse table | Already run. |
| `supabase/add_intro_email_table.sql` | Normalized-email anti-abuse table | Already run. |
| `api/create-checkout-session.js` | Checkout + billing portal (action-routed) | Do not split back into two files without freeing up a slot elsewhere first. §7. |
| `api/stripe-webhook.js` | Source of truth for subscription status changes | Status-mapping fails closed to `expired`, not `trial`. Records anti-abuse flags only on real payment completion. |
| `api/verify-payment.js` | Fast client-side payment confirmation (nicety, not source of truth) | Fixed env-var-name bug that was silently breaking every payment confirmation. §10. |
| `dashboard.html`, `alevel/dashboard.html` | Main student dashboard | Subject cards never lock. Banner removal in progress — §12. |
| `onboarding-step1–5.html`, `alevel/onboarding-step4.html` | Signup flow | `trial_start_date` column-name bug fixed in step4 variants — §5.2. |
| `add-subjects.html` | "+Subjects" post-onboarding flow | Subject list matches `onboarding-step2.html`. |
| `pricing.html` | Public pricing page | Free vs Montura Pro, 99p intro badge, psychological sizing — §6. |
| `settings.html` | Account settings, incl. Billing section | Uses Stripe's hosted portal, not custom cancel UI — §9. |
| `auth-check.js` | Shared auth-check script, included on most pages | Also syncs the `sb-access-token` cookie middleware depends on — §3.4. |

---

*End of handoff. If anything in this document turns out to be stale or wrong by the
time you're reading it (a file's been changed further, a Stripe ID has been
rotated, etc.), trust the actual current state of the repo/Stripe/Supabase over
this document, and consider updating this file to reflect reality if you make a
significant further change — but don't rewrite sections that are still accurate
just to reword them.*
