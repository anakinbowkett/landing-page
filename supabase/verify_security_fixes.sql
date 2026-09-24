-- Run AFTER both fixes, in the Supabase SQL Editor. Changes nothing
-- (everything is inside a transaction that is rolled back at the end).
-- Replace BOTH copies of 00000000-0000-0000-0000-000000000000 with the id of
-- a test account that is NOT subscribed (Authentication → Users → copy UID).

begin;

-- Test 1: a logged-out visitor should see 0 questions.
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select 'TEST 1 — logged-out visitor can read questions (expect 0)' as test, count(*) as result from questions;
reset role;

-- Test 2: a student trying to make themselves Pro should NOT succeed.
select set_config('request.jwt.claims',
  '{"role":"authenticated","sub":"00000000-0000-0000-0000-000000000000"}', true);
set local role authenticated;
update user_profiles set subscription_status = 'active', used_intro_offer = false
  where id = '00000000-0000-0000-0000-000000000000';
select 'TEST 2 — status after student tried to set active (expect NOT active)' as test,
       subscription_status as result
  from user_profiles where id = '00000000-0000-0000-0000-000000000000';
reset role;

rollback;
