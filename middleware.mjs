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
const FREE_LECTURE_PATH = /^\/lectures\/[^/]+\/(lectures\.html|lectures\/[^/]+\.html|lectures-data\.js|question-counts\.js)$/;

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

function lockedFeaturePage(featureName) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${featureName} — Montura Pro</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', sans-serif; min-height: 100vh; background: #f8f9fa;
    display: flex; align-items: center; justify-content: center; padding: 1.5rem;
  }
  .box {
    background: white; border-radius: 16px; padding: 2.5rem; max-width: 420px;
    text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;
  }
  img { height: 40px; margin-bottom: 1.5rem; }
  h1 { font-size: 1.375rem; font-weight: 700; color: #111827; margin-bottom: 0.75rem; letter-spacing: -0.02em; }
  p { font-size: 0.9375rem; color: #6b7280; line-height: 1.5; margin-bottom: 1.75rem; }
  a.primary {
    display: block; background: #111827; color: white; text-decoration: none;
    padding: 0.875rem 2rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 600;
    margin-bottom: 0.625rem; transition: transform 0.1s ease;
  }
  a.primary:active { transform: scale(0.97) translateY(1px); }
  a.secondary {
    display: block; color: #6b7280; text-decoration: none; padding: 0.625rem;
    font-size: 0.875rem; border-radius: 8px;
  }
</style>
</head>
<body>
  <div class="box">
    <img src="https://i.postimg.cc/kDrBZ2z5/Monturalearn-logo.jpg" alt="Monturalearn">
    <h1>${featureName} is part of Montura Pro</h1>
    <p>Your lectures stay free, always. ${featureName} is one of the Pro features — subscribe to get it back, for every subject.</p>
    <a class="primary" href="/pricing.html?trial_ended=true">Subscribe to Montura Pro</a>
    <a class="secondary" href="/dashboard.html">Back to dashboard</a>
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
    return new Response(lockedFeaturePage(featureNameFromPath(url.pathname)), {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  return next();
}
