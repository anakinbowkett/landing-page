// middleware.mjs
//
// Runs on Vercel's edge, server-side, before ANY /lectures/* file is sent
// to a visitor. This is the real trial/subscription gate — nothing the
// browser does (new tab, incognito, a changed system clock, editing
// localStorage, sharing a bookmarked link) can get past it, because the
// decision is made here against Postgres's own clock, never the visitor's.
//
// Two tiers live here:
//  - Core lecture content is free forever for any signed-in student — no
//    payment check at all, just proof of a real account.
//  - Everything else under /lectures/* (Flashtiles, past papers, quick
//    tests) needs an active trial or paid subscription. A student who isn't
//    entitled can still click into these — the URL stays the same, but the
//    real page never gets sent to them: this function serves a "Subscribe
//    to Montura Pro" box in its place instead. This applies identically to
//    every subject/board/tier automatically, since it's the same matcher
//    and the same check for all of them — nothing to repeat per subject.
//
// Needs one thing from Vercel: an environment variable called
// SUPABASE_SERVICE_ROLE_KEY (Project Settings → Environment Variables).
// This key must NEVER appear in any file that ships to the browser.

import { next } from '@vercel/functions';

export const config = {
  matcher: '/lectures/:path*',
};

const SUPABASE_URL = 'https://bdoesoqpjhpxkwsjauwo.supabase.co';

// Deliberately narrow, and defaults to "not free" for anything that doesn't
// clearly match — a miss here should mean "still needs paying for", never
// "accidentally free", so new page types added later stay protected by
// default until someone explicitly widens this pattern.
const FREE_LECTURE_PATH = /^\/lectures\/[^/]+\/(lectures\.html|lectures\/[^/]+\.html|lectures-data\.js|question-counts\.js|theme\.css|shared\.css)$/;

function getCookie(request, name) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function featureNameFromPath(pathname) {
  if (pathname.includes('flashtiles')) return 'Flashtiles';
  if (pathname.includes('past-papers')) return 'Past Papers';
  if (pathname.includes('quick-test')) return 'Daily Quiz';
  return 'This feature';
}

// Best-effort, cosmetic only — this only feeds the blurred backdrop behind
// the modal, never anything a screen reader or search engine would read
// carefully, so it doesn't need to be perfect for every subject slug.
const SUBJECT_WORD_OVERRIDES = {
  aqa: 'AQA', ocr: 'OCR', edexcel: 'Edexcel', wjec: 'WJEC',
  f: 'Foundation', h: 'Higher', tier: 'Tier',
};
function subjectNameFromPath(pathname) {
  const slug = pathname.split('/')[2] || '';
  return slug
    .split('-')
    .map((w) => SUBJECT_WORD_OVERRIDES[w] || (w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

function featureIcon(featureName) {
  // Monoline icons, single color, kept deliberately simple - one visual
  // idea per feature rather than a generic padlock for everything.
  if (featureName === 'Flashtiles') {
    return `<rect x="14" y="18" width="24" height="18" rx="3.5" transform="rotate(-6 26 27)" fill="none" stroke="currentColor" stroke-width="2.2"/>
      <rect x="17" y="15" width="24" height="18" rx="3.5" fill="white" stroke="currentColor" stroke-width="2.2"/>`;
  }
  if (featureName === 'Past Papers') {
    return `<path d="M18 14h14l6 6v18a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2z" fill="white" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M32 14v6h6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M20 30h12M20 35h8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  if (featureName === 'Daily Quiz') {
    return `<circle cx="28" cy="27" r="13" fill="white" stroke="currentColor" stroke-width="2.2"/>
      <path d="M22.5 27.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return `<rect x="19" y="26" width="18" height="13" rx="3" fill="white" stroke="currentColor" stroke-width="2.2"/>
    <path d="M22.5 26v-4.5a5.5 5.5 0 0 1 11 0V26" fill="none" stroke="currentColor" stroke-width="2.2"/>`;
}

function lockedFeaturePage(featureName, pathname) {
  const subjectName = subjectNameFromPath(pathname);
  const navItem = (icon, label, isActive) =>
    `<div class="nav-item${isActive ? ' active' : ''}"><span class="nav-icon">${icon}</span><span>${label}</span></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${featureName} — Montura Pro</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    font-family: 'Inter', sans-serif; background: #ffffff;
    -webkit-font-smoothing: antialiased; overflow: hidden;
  }

  /* ---------- Backdrop: a generic stand-in for the real page chrome,
     never the actual gated content, so it's safe to show to anyone ---------- */
  .backdrop {
    position: fixed; inset: 0; display: flex;
    filter: blur(5px); transform: scale(1.02); /* scale hides the blur's soft edge */
  }
  .sidebar {
    width: 280px; padding: 2rem 1.5rem; margin: 20px;
    display: flex; flex-direction: column; flex-shrink: 0;
  }
  .logo { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 2.5rem; }
  .logo img { height: 22px; width: auto; }
  .logo span { font-size: 1.0625rem; font-weight: 600; color: #111827; letter-spacing: -0.02em; }
  .nav-item {
    display: flex; align-items: center; gap: 0.875rem; padding: 0.875rem 1rem;
    margin-bottom: 0.5rem; border-radius: 8px; font-size: 0.9375rem;
    font-weight: 500; color: #374151;
  }
  .nav-item.active { background: #ffffff; color: #111827; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .nav-icon { font-size: 1.125rem; }
  .main-content {
    flex: 1; margin: 20px 20px 20px 0; background: #ffffff; border-radius: 10px;
    overflow: hidden; border: 1px solid #e0e4e9; box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .subject-band {
    background: #dcfce7; padding: 3rem 3rem 2rem;
  }
  .subject-band h2 { font-size: 1.75rem; font-weight: 700; color: #111827; letter-spacing: -0.02em; }
  @media (max-width: 760px) {
    .sidebar { display: none; }
    .main-content { margin-left: 20px; }
  }

  /* ---------- Overlay: the actual, crisp, interactive content ---------- */
  .overlay {
    position: fixed; inset: 0; background: rgba(20,20,22,0.4);
    display: flex; align-items: center; justify-content: center; padding: 1.5rem;
  }
  .card {
    background: #ffffff; border-radius: 20px; padding: 3rem 2.75rem 2.25rem;
    max-width: 430px; width: 100%; text-align: center;
    box-shadow:
      0 1px 2px rgba(0,0,0,0.06),
      0 12px 32px rgba(0,0,0,0.16),
      0 32px 64px rgba(0,0,0,0.18);
  }
  .icon-badge {
    width: 56px; height: 56px; border-radius: 16px; margin: 0 auto 1.5rem;
    background: linear-gradient(160deg, #eaf3fd 0%, #dcecfb 100%);
    display: flex; align-items: center; justify-content: center;
    color: #1d7fe2;
  }
  .icon-badge svg { width: 30px; height: 30px; }
  h1 {
    font-size: 1.375rem; font-weight: 700; color: #1d1d1f;
    letter-spacing: -0.03em; margin-bottom: 0.625rem; line-height: 1.3;
  }
  p {
    font-size: 0.9375rem; color: #6e6e73; line-height: 1.5;
    margin-bottom: 1.875rem; letter-spacing: -0.005em;
  }
  a.primary {
    display: block; text-decoration: none; color: white;
    background: linear-gradient(180deg, #2f8ce8 0%, #1d7fe2 55%, #1a72cc 100%);
    padding: 0.8rem 1.5rem; border-radius: 12px; font-size: 0.9375rem; font-weight: 600;
    margin-bottom: 0.875rem;
    box-shadow: 0 1px 1px rgba(15,60,110,0.15), 0 6px 14px rgba(29,127,226,0.28);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }
  a.primary:active {
    transform: scale(0.97) translateY(1px);
    box-shadow: 0 1px 1px rgba(15,60,110,0.15), 0 3px 8px rgba(29,127,226,0.24);
  }
  a.primary:focus-visible, a.secondary:focus-visible {
    outline: 2px solid #1d7fe2; outline-offset: 2px;
  }
  a.secondary {
    display: block; color: #6e6e73; text-decoration: none; padding: 0.5rem;
    font-size: 0.875rem; border-radius: 8px; margin-bottom: 1.5rem;
  }
  .signature {
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    opacity: 0.38;
  }
  .signature img { height: 14px; width: auto; }
  .signature span { font-size: 0.75rem; font-weight: 600; color: #1d1d1f; }
</style>
</head>
<body>
  <div class="backdrop" aria-hidden="true">
    <div class="sidebar">
      <div class="logo"><img src="/assets/montura-logo.png" alt=""><span>Montura Learn</span></div>
      ${navItem('🏠', 'Dashboard', false)}
      ${navItem('∞', 'Lectures', false)}
      ${navItem('⚡', 'Flashtiles', featureName === 'Flashtiles')}
      ${navItem('🕐', 'Quiz', featureName === 'Daily Quiz')}
      ${navItem('📄', 'Past Papers', featureName === 'Past Papers')}
    </div>
    <div class="main-content">
      <div class="subject-band"><h2>${subjectName}</h2></div>
    </div>
  </div>

  <div class="overlay">
    <div class="card">
      <div class="icon-badge">
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">${featureIcon(featureName)}</svg>
      </div>
      <h1>${featureName} is part of Montura Pro</h1>
      <p>Your lectures stay free, always. Subscribing unlocks ${featureName.toLowerCase()} across every subject.</p>
      <a class="primary" href="/pricing.html?trial_ended=true">Upgrade Now</a>
      <a class="secondary" href="/dashboard.html">Back to dashboard</a>
      <div class="signature">
        <img src="/assets/montura-logo.png" alt="">
        <span>Montura Learn</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export default async function middleware(request) {
  const url = new URL(request.url);

  // The homepage's live demo lectures are meant to be public — that's the
  // whole point of them, so they're the one deliberate exception.
  if (url.pathname.startsWith('/lectures/preview/')) {
    return next();
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    // Mis-set env var should fail closed, not open — never let a config
    // mistake accidentally unlock every lecture for everyone.
    return Response.redirect(new URL('/dashboard.html', request.url), 302);
  }

  const token = getCookie(request, 'sb-access-token');
  if (!token) {
    return Response.redirect(new URL('/signin.html', request.url), 302);
  }

  // Ask Supabase who this token actually belongs to, using the token
  // itself — never trust anything the request merely claims.
  let user;
  try {
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) throw new Error('bad token');
    user = await userRes.json();
  } catch {
    return Response.redirect(new URL('/signin.html', request.url), 302);
  }

  // Core lecture content: free for any real, signed-in account — no
  // trial/subscription check at all.
  if (FREE_LECTURE_PATH.test(url.pathname)) {
    return next();
  }

  // Everything else under /lectures/* (Flashtiles, past papers, quick
  // tests) needs an active trial or paid subscription — server-side entitlement
  // check (SQL function runs inside Postgres, so "now" is the database's
  // clock — see supabase/check_entitlement.sql).
  let entitled = false;
  try {
    const entitlementRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_entitlement`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_user_id: user.id }),
    });
    if (entitlementRes.ok) entitled = await entitlementRes.json();
  } catch {
    entitled = false;
  }

  if (!entitled) {
    // Served on the SAME url the student clicked — the real Flashtiles/past
    // papers/quiz content (and any question data it would otherwise load)
    // never gets sent to the browser at all, so there's nothing to view
    // source or inspect into.
    return new Response(lockedFeaturePage(featureNameFromPath(url.pathname), url.pathname), {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  return next();
}
