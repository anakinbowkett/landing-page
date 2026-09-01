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
//    tests) needs an active trial or paid subscription.
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
    return Response.redirect(new URL('/pricing.html?trial_ended=true', request.url), 302);
  }

  return next();
}
