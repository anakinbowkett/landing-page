-- iOS Milestone 1 security gate fixes (2026-09-27). Run once in the Supabase SQL Editor.
-- Safe for the website as it is today:
--   * middleware.js calls check_entitlement with the service role key → still allowed.
--   * The questions rule calls check_entitlement(auth.uid()) → the student's own id → still allowed.
--   * leaderboard.js only runs on signed-in dashboard pages → still a signed-in read.

-- 1. check_entitlement: a student may only ask about THEMSELVES.
--    Before: anyone (even logged out) could pass any account id and learn
--    whether that student is on a trial or paying.
--    Server code (service role) and the SQL editor (no login) can still ask about anyone.
--    Also returns false instead of nothing when there's no match.
create or replace function public.check_entitlement(p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce((
    select
      case
        when subscription_status = 'active' then true
        when subscription_status = 'trial'
          and trial_start_date is not null
          and now() < (trial_start_date + interval '3 days') then true
        else false
      end
    from user_profiles
    where id = p_user_id
      and (
        p_user_id = auth.uid()
        or coalesce(auth.jwt() ->> 'role', '') not in ('authenticated', 'anon')
      )
  ), false);
$$;

-- 2. leaderboard_presence: names are only visible to signed-in students.
--    Before: anyone on the internet could read every student's name and account id.
drop policy if exists "Anyone can read presence" on public.leaderboard_presence;
create policy "Signed-in users can read presence"
  on public.leaderboard_presence for select
  to authenticated
  using (true);

-- 3. join_reason: cap the list size (onboarding offers 7 choices).
alter table public.user_profiles
  drop constraint if exists user_profiles_join_reason_len;
alter table public.user_profiles
  add constraint user_profiles_join_reason_len
  check (join_reason is null or cardinality(join_reason) <= 10) not valid;

-- UNDO (only if something breaks):
--   restore the previous check_entitlement from git history (before 2026-09-27)
--   drop policy "Signed-in users can read presence" on public.leaderboard_presence;
--   create policy "Anyone can read presence" on public.leaderboard_presence for select using (true);
--   alter table public.user_profiles drop constraint user_profiles_join_reason_len;
