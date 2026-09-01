-- Run this once in the Supabase SQL Editor.
-- Tracks whether an account has ever redeemed the 99p intro month, so it
-- can never be reused — cancel-and-resignup, new attempt, doesn't matter,
-- this flag lives on the account and is only ever set to true, never back
-- to false.

alter table user_profiles
  add column if not exists used_intro_offer boolean not null default false;
