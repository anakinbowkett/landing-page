-- Run this once in the Supabase SQL Editor.
-- Feature 8 (career motivation layer): stores the career a student picked
-- during onboarding (onboarding-step5.html), e.g. 'doctor', 'lawyer',
-- 'footballer', 'vet', 'games_developer' — null if they skipped the
-- question. Read by english-base-template.txt to show career facts
-- during a lecture.

alter table user_profiles
  add column if not exists dream_career text;
