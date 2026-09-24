-- Run this once in the Supabase SQL Editor — ONLY AFTER the website update
-- that makes Flashtiles send the student's own login token has gone live on
-- Vercel (otherwise Flashtiles will show no cards until it does).
--
-- SECURITY FIX: questions had read rules for logged-out visitors ('anon')
-- and everyone ('public'), so anyone with the public key could download
-- every Pro question without an account. After this, only students whose
-- trial is running or who are subscribed (check_entitlement) can read them.

drop policy if exists "Public read access" on questions;
drop policy if exists "Public read questions" on questions;
drop policy if exists "Authenticated users can read questions" on questions;

-- (select ...) wrapper makes Postgres run check_entitlement once per
-- request instead of once per question row.
create policy "Entitled users can read questions"
  on questions for select
  to authenticated
  using ((select check_entitlement(auth.uid())));
