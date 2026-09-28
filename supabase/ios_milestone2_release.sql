-- iOS Milestone 2: RELEASE-DAY script. DO NOT RUN YET.
-- Run only in the same release as the website update that:
--   * stops lecture quizzes writing enigma_balance from the browser and calls
--     record_answer() instead (10 per correct answer, the new scale),
--   * stops dashboard.html / alevel/dashboard.html bumping the streak on page
--     load and calls record_study_day() when a session finishes,
--   * removes the Mastery Miles game (leaderboard.js writes enigma_balance too).
-- Order (MISTAKES.md release-order rule): website update live FIRST, then this.
-- Needs ios_milestone2_gamification.sql to have been run already.

begin;

-- 1. Convert existing balances to the new scale (÷100, rounded).
update public.user_profiles
   set enigma_balance = round(enigma_balance / 100.0)
 where enigma_balance > 0;

-- 2. PROPOSED (confirm with MonturaL before running): lifetime Enigma starts at
--    the converted balance, the best record of past earnings.
update public.user_profiles
   set enigma_lifetime = greatest(enigma_lifetime, coalesce(enigma_balance, 0)::int);

-- 3. Students can no longer change enigma_balance, or their streak, directly.
--    Only the server functions (montura.trusted) and server code can.
create or replace function public.protect_gamification_profile_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if gam_is_trusted() then return new; end if;
  if tg_op = 'INSERT' then
    new.enigma_lifetime := 0;
    new.enigma_balance  := 0;
  else
    new.enigma_lifetime := old.enigma_lifetime;
    new.enigma_balance  := old.enigma_balance;
  end if;
  return new;
end;
$$;

create or replace function public.protect_gamification_streak_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if gam_is_trusted() then return new; end if;
  if tg_op = 'INSERT' then
    new.current_streak   := 0;
    new.last_login_date  := null;
    new.freeze_used_week := null;
    new.freeze_saved_on  := null;
    new.freeze_note_seen := true;
    new.freezes_held     := 0;
    new.broken_streak    := null;
    new.broken_on        := null;
  else
    new.current_streak   := old.current_streak;
    new.last_login_date  := old.last_login_date;
    new.freeze_used_week := old.freeze_used_week;
    new.freeze_saved_on  := old.freeze_saved_on;
    new.freeze_note_seen := old.freeze_note_seen;
    new.freezes_held     := old.freezes_held;
    new.broken_streak    := old.broken_streak;
    new.broken_on        := old.broken_on;
  end if;
  return new;
end;
$$;

commit;

-- UNDO for step 3 only (balances can't be un-rounded): re-run section 2 of
-- ios_milestone2_gamification.sql to restore the two protect functions.
