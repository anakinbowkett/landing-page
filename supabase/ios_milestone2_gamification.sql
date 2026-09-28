-- iOS Milestone 2: gamification (2026-09-28). Run once in the Supabase SQL Editor.
-- Rules: BUILD_SPEC.md → "Gamification Layer" in the iOS repo.
--
-- SAFE FOR THE WEBSITE AS IT IS TODAY. It only ADDS columns, tables and
-- functions. It does NOT:
--   * stop the website writing user_streaks.current_streak / last_login_date,
--   * stop the website writing user_profiles.enigma_balance,
--   * convert balances to the new scale (÷100).
-- Those three happen in ios_milestone2_release.sql, run in the SAME release as
-- the website switching over (MISTAKES.md release-order rule).
--
-- How writes are protected: every award/spend goes through the security-definer
-- functions below. They set a transaction-local flag (montura.trusted) while
-- they write; the protect triggers ignore student changes to gamification
-- columns unless that flag is on. A student can't set the flag: PostgREST
-- doesn't expose set_config, and the flag only lasts one transaction.

-- ============================================================================
-- 1. Columns
-- ============================================================================

-- Lifetime Enigma earned: only ever goes up. Levels are based on this.
alter table public.user_profiles
  add column if not exists enigma_lifetime integer not null default 0;

-- Daily goal: casual 30 / regular 60 / serious 120 / intense 200 Enigma.
alter table public.user_profiles
  add column if not exists daily_goal text not null default 'regular';
alter table public.user_profiles drop constraint if exists user_profiles_daily_goal_valid;
alter table public.user_profiles add constraint user_profiles_daily_goal_valid
  check (daily_goal in ('casual', 'regular', 'serious', 'intense'));

-- Streak freezes, repair and badges bookkeeping.
alter table public.user_streaks add column if not exists freeze_used_week date;  -- Monday of the week the free freeze was used
alter table public.user_streaks add column if not exists freeze_saved_on  date;  -- the day a freeze covered
alter table public.user_streaks add column if not exists freeze_note_seen boolean not null default true;
alter table public.user_streaks add column if not exists freezes_held    smallint not null default 0;
alter table public.user_streaks add column if not exists broken_streak   integer;   -- streak before it broke (repairable)
alter table public.user_streaks add column if not exists broken_on       date;      -- UK day the break was found
alter table public.user_streaks drop constraint if exists user_streaks_freezes_held_range;
alter table public.user_streaks add constraint user_streaks_freezes_held_range
  check (freezes_held between 0 and 2);

-- ============================================================================
-- 2. Protect triggers (student logins can't change these columns)
-- ============================================================================

create or replace function public.gam_is_trusted()
returns boolean
language sql
volatile  -- the flag changes between statements; never cache it
as $$
  select coalesce(current_setting('montura.trusted', true), '') = 'on'
      or coalesce(auth.jwt() ->> 'role', '') not in ('authenticated', 'anon');
$$;

create or replace function public.protect_gamification_profile_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if gam_is_trusted() then return new; end if;
  if tg_op = 'INSERT' then
    new.enigma_lifetime := 0;
  else
    new.enigma_lifetime := old.enigma_lifetime;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_gamification_profile_columns on public.user_profiles;
create trigger protect_gamification_profile_columns
  before insert or update on public.user_profiles
  for each row execute function public.protect_gamification_profile_columns();

create or replace function public.protect_gamification_streak_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if gam_is_trusted() then return new; end if;
  if tg_op = 'INSERT' then
    new.freeze_used_week := null;
    new.freeze_saved_on  := null;
    new.freeze_note_seen := true;
    new.freezes_held     := 0;
    new.broken_streak    := null;
    new.broken_on        := null;
  else
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

drop trigger if exists protect_gamification_streak_columns on public.user_streaks;
create trigger protect_gamification_streak_columns
  before insert or update on public.user_streaks
  for each row execute function public.protect_gamification_streak_columns();

-- The existing billing trigger must also let the trusted functions through,
-- otherwise their Enigma update would run the "start a trial" branch for a
-- profile with no trial_start_date. Identical to protect_profile_billing_columns.sql
-- except for the one added gam_is_trusted() check.
create or replace function protect_profile_billing_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if coalesce(auth.jwt() ->> 'role', '') not in ('authenticated', 'anon')
     or coalesce(current_setting('montura.trusted', true), '') = 'on' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.subscription_status     := 'trial';
    new.trial_start_date        := now();
    new.subscription_start_date := null;
    new.subscription_end_date   := null;
    new.stripe_customer_id      := null;
    new.stripe_subscription_id  := null;
    new.used_intro_offer        := false;
    new.is_pro                  := false;
    new.referred_by_ambassador  := null;
    return new;
  end if;

  if old.trial_start_date is null then
    new.trial_start_date := now();
    new.subscription_status :=
      case when coalesce(old.subscription_status, 'trial') = 'trial'
           then 'trial' else old.subscription_status end;
  else
    new.trial_start_date    := old.trial_start_date;
    new.subscription_status := old.subscription_status;
  end if;

  new.subscription_start_date := old.subscription_start_date;
  new.subscription_end_date   := old.subscription_end_date;
  new.stripe_customer_id      := old.stripe_customer_id;
  new.stripe_subscription_id  := old.stripe_subscription_id;
  new.used_intro_offer        := old.used_intro_offer;
  new.is_pro                  := old.is_pro;
  new.referred_by_ambassador  := old.referred_by_ambassador;
  new.trial_end_date          := old.trial_end_date;
  new.trial_ended             := old.trial_ended;
  new.purchased_subjects      := old.purchased_subjects;
  return new;
end;
$$;

-- ============================================================================
-- 3. Tables (students can read only their own rows; they can write none)
-- ============================================================================

-- Every Enigma award (+) and spend (−). Daily goal and weekly league totals
-- are counted from here.
create table if not exists public.enigma_events (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  amount     integer not null,
  reason     text not null,
  uk_day     date not null,
  week_start date not null,
  created_at timestamptz not null default now()
);
create index if not exists enigma_events_user_day on public.enigma_events (user_id, uk_day);

-- Leaves and combo state.
create table if not exists public.user_gamification (
  user_id            uuid primary key references auth.users(id) on delete cascade,
  leaves             smallint not null default 5 check (leaves between 0 and 5),
  leaves_refill_from timestamptz not null default now(),
  combo_session      uuid,
  combo_run          integer not null default 0,
  last_answer_at     timestamptz,
  updated_at         timestamptz not null default now()
);

-- One row per question answered in a session. Wrong ones form the mistake review.
create table if not exists public.answer_log (
  user_id      uuid not null references auth.users(id) on delete cascade,
  session_id   uuid not null,
  question_ref text not null check (char_length(question_ref) between 1 and 200),
  result       text not null check (result in ('correct', 'partial', 'wrong')),
  enigma       integer not null default 0,
  created_at   timestamptz not null default now(),
  reviewed_at  timestamptz,
  primary key (user_id, session_id, question_ref)
);
create index if not exists answer_log_mistakes on public.answer_log (user_id, created_at desc)
  where result = 'wrong' and reviewed_at is null;

-- Streak milestone badges (7, 30, 100, 365). Kept forever once earned.
create table if not exists public.streak_badges (
  user_id   uuid not null references auth.users(id) on delete cascade,
  days      integer not null check (days in (7, 30, 100, 365)),
  earned_at timestamptz not null default now(),
  primary key (user_id, days)
);

-- Outage windows. Only the admin (SQL editor / service role) writes these.
-- Example: insert into service_outages (starts_at, ends_at, note)
--          values ('2026-10-01 14:00+01', '2026-10-01 19:30+01', 'Supabase outage');
create table if not exists public.service_outages (
  id        bigint generated always as identity primary key,
  starts_at timestamptz not null,
  ends_at   timestamptz not null,
  note      text,
  check (ends_at > starts_at)
);

-- Leagues: current tier per student (1 Rookie … 10 Final Boss).
create table if not exists public.user_league (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  tier       smallint not null default 1 check (tier between 1 and 10),
  updated_at timestamptz not null default now()
);

-- Leagues: who is in which group of 30 each week, and their weekly Enigma.
create table if not exists public.league_members (
  week_start    date not null,
  user_id       uuid not null references auth.users(id) on delete cascade,
  tier          smallint not null check (tier between 1 and 10),
  group_no      integer not null,
  weekly_enigma integer not null default 0,
  joined_at     timestamptz not null default now(),
  result        text check (result in ('up', 'down', 'stay')),
  primary key (week_start, user_id)
);
create index if not exists league_members_group on public.league_members (week_start, tier, group_no);

-- Weeks whose promotions/demotions have been applied.
create table if not exists public.league_weeks (
  week_start   date primary key,
  processed_at timestamptz not null default now()
);

alter table public.enigma_events     enable row level security;
alter table public.user_gamification enable row level security;
alter table public.answer_log        enable row level security;
alter table public.streak_badges     enable row level security;
alter table public.service_outages   enable row level security;
alter table public.user_league       enable row level security;
alter table public.league_members    enable row level security;
alter table public.league_weeks      enable row level security;

drop policy if exists "Own enigma events" on public.enigma_events;
create policy "Own enigma events" on public.enigma_events
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Own gamification state" on public.user_gamification;
create policy "Own gamification state" on public.user_gamification
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Own answers" on public.answer_log;
create policy "Own answers" on public.answer_log
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Own streak badges" on public.streak_badges;
create policy "Own streak badges" on public.streak_badges
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Own league tier" on public.user_league;
create policy "Own league tier" on public.user_league
  for select to authenticated using (auth.uid() = user_id);
-- league_members / league_weeks / service_outages: no student policies at all.
-- Standings are read only through get_my_league(), which returns the caller's
-- own group with first name + initial.

revoke insert, update, delete on
  public.enigma_events, public.user_gamification, public.answer_log, public.streak_badges,
  public.service_outages, public.user_league, public.league_members, public.league_weeks
  from anon, authenticated;

-- ============================================================================
-- 4. Internal helpers (NOT callable by students)
-- ============================================================================

create or replace function public._uk_today()
returns date language sql stable as $$
  select (now() at time zone 'Europe/London')::date;
$$;

create or replace function public._week_start(d date)
returns date language sql immutable as $$
  select d - (extract(isodow from d)::int - 1);
$$;

create or replace function public._is_outage_day(d date)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from service_outages o
    where o.starts_at < ((d + 1)::timestamp at time zone 'Europe/London')
      and o.ends_at   > (d::timestamp at time zone 'Europe/London')
  );
$$;

-- Days strictly between p_last and p_today that the student missed
-- (outage days don't count as missed), and the latest such day.
create or replace function public._missed_days(p_last date, p_today date,
                                               out missed integer, out last_missed date)
language sql stable security definer set search_path = public as $$
  select count(*)::int, max(d)::date
  from generate_series((p_last + 1)::timestamp, (p_today - 1)::timestamp, interval '1 day') as g(d)
  where not _is_outage_day(d::date);
$$;

-- Loads (creating if needed) and locks the caller's leaves/combo row, with
-- leaves refilled 1 per 30 minutes from the stored timestamp.
create or replace function public._load_gamification(p_user uuid)
returns public.user_gamification
language plpgsql security definer set search_path = public as $$
declare
  g user_gamification;
  gained integer;
begin
  insert into user_gamification (user_id) values (p_user) on conflict (user_id) do nothing;
  select * into g from user_gamification where user_id = p_user for update;
  if g.leaves < 5 then
    gained := floor(extract(epoch from (now() - g.leaves_refill_from)) / 1800)::int;
    if gained > 0 then
      g.leaves := least(5, g.leaves + gained);
      g.leaves_refill_from := g.leaves_refill_from + make_interval(secs => gained * 1800);
    end if;
  end if;
  if g.leaves >= 5 then
    g.leaves_refill_from := now();
  end if;
  update user_gamification
     set leaves = g.leaves, leaves_refill_from = g.leaves_refill_from, updated_at = now()
   where user_id = p_user;
  return g;
end;
$$;

-- Applies promotions/demotions for every finished week not yet processed.
-- Called lazily by the league functions (and hourly on Mondays by pg_cron if
-- it's switched on), so a missed cron run never leaves a week unprocessed.
create or replace function public._process_league_weeks()
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_current date := _week_start(_uk_today());
  w date;
begin
  if not exists (
    select 1 from league_members m
    where m.week_start < v_current
      and not exists (select 1 from league_weeks lw where lw.week_start = m.week_start)
  ) then
    return;
  end if;

  perform pg_advisory_xact_lock(hashtext('montura_league_rollover'));

  for w in
    select distinct m.week_start from league_members m
    where m.week_start < v_current
      and not exists (select 1 from league_weeks lw where lw.week_start = m.week_start)
    order by 1
  loop
    -- Top 7 of each group move up; of the rest, the bottom 5 move down.
    with ranked as (
      select user_id, tier,
             row_number() over (partition by tier, group_no order by weekly_enigma desc, joined_at asc) as rn,
             count(*)     over (partition by tier, group_no) as n
      from league_members where week_start = w
    ), moves as (
      select user_id,
             case when rn <= 7 and tier < 10 then 'up'
                  when rn > 7 and rn > n - 5 and tier > 1 then 'down'
                  else 'stay' end as result,
             tier
      from ranked
    ), marked as (
      update league_members m set result = mv.result
      from moves mv
      where m.week_start = w and m.user_id = mv.user_id
      returning m.user_id, mv.result, mv.tier
    )
    insert into user_league (user_id, tier, updated_at)
    select user_id,
           case result when 'up' then tier + 1 when 'down' then tier - 1 else tier end,
           now()
    from marked
    on conflict (user_id) do update set tier = excluded.tier, updated_at = now();

    insert into league_weeks (week_start) values (w) on conflict do nothing;
  end loop;
end;
$$;

-- Adds a positive award to this week's league score, placing the student in
-- a group of 30 in their tier the first time they earn this week. Pro only.
create or replace function public._league_add(p_user uuid, p_amount integer)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_week  date := _week_start(_uk_today());
  v_tier  smallint;
  v_group integer;
begin
  if p_amount <= 0 or not check_entitlement(p_user) then return; end if;
  perform _process_league_weeks();

  update league_members set weekly_enigma = weekly_enigma + p_amount
   where week_start = v_week and user_id = p_user;
  if found then return; end if;

  insert into user_league (user_id) values (p_user) on conflict (user_id) do nothing;
  select tier into v_tier from user_league where user_id = p_user;

  perform pg_advisory_xact_lock(hashtext('montura_league_join'), hashtext(v_week::text || ':' || v_tier));
  select group_no into v_group
    from league_members
   where week_start = v_week and tier = v_tier
   group by group_no
  having count(*) < 30
   order by group_no
   limit 1;
  if v_group is null then
    select coalesce(max(group_no), 0) + 1 into v_group
      from league_members where week_start = v_week and tier = v_tier;
  end if;

  insert into league_members (week_start, user_id, tier, group_no, weekly_enigma)
  values (v_week, p_user, v_tier, v_group, p_amount)
  on conflict (week_start, user_id) do update
    set weekly_enigma = league_members.weekly_enigma + excluded.weekly_enigma;
end;
$$;

-- The ONLY place Enigma balances change (apart from the website, until the
-- release script locks enigma_balance). Positive = award, negative = spend.
create or replace function public._change_enigma(p_user uuid, p_amount integer, p_reason text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_day date := _uk_today();
begin
  if p_amount = 0 then return; end if;
  perform set_config('montura.trusted', 'on', true);
  insert into enigma_events (user_id, amount, reason, uk_day, week_start)
  values (p_user, p_amount, p_reason, v_day, _week_start(v_day));
  update user_profiles
     set enigma_balance  = coalesce(enigma_balance, 0) + p_amount,
         enigma_lifetime = enigma_lifetime + greatest(p_amount, 0)
   where id = p_user;
  perform set_config('montura.trusted', 'off', true);
  if p_amount > 0 then
    perform _league_add(p_user, p_amount);
  end if;
end;
$$;

-- Awards streak badges for every milestone the streak has reached.
-- Returns the ones that are new.
create or replace function public._award_streak_badges(p_user uuid, p_streak integer)
returns integer[]
language sql security definer set search_path = public as $$
  with added as (
    insert into streak_badges (user_id, days)
    select p_user, m from unnest(array[7, 30, 100, 365]) as m where m <= p_streak
    on conflict do nothing
    returning days
  )
  select coalesce(array_agg(days order by days), '{}') from added;
$$;

-- The streak as the student should see it right now, plus freeze/repair state.
create or replace function public._streak_status(p_user uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  s user_streaks;
  v_today date := _uk_today();
  v_last date;
  v_missed integer;
  v_missed_day date;
  v_free_ready boolean;
  v_display integer := 0;
  v_repair_to integer;
begin
  select * into s from user_streaks where user_id = p_user;
  if not found or s.last_login_date is null then
    return jsonb_build_object('streak', 0, 'studied_today', false, 'free_freeze_ready', true,
                              'freezes_held', 0, 'repair_available', false);
  end if;

  v_last := s.last_login_date::date;
  v_free_ready := s.freeze_used_week is distinct from _week_start(v_today);
  select missed, last_missed into v_missed, v_missed_day from _missed_days(v_last, v_today);

  if v_last >= v_today then
    v_display := s.current_streak;
    if s.broken_on = v_today and coalesce(s.broken_streak, 0) > 0 then
      v_repair_to := s.broken_streak + s.current_streak;
    end if;
  elsif v_missed = 0 then
    v_display := s.current_streak;
  elsif v_missed = 1 and (s.freeze_used_week is distinct from _week_start(v_missed_day) or s.freezes_held > 0) then
    v_display := s.current_streak;           -- a freeze will cover the missed day
  elsif v_missed = 1 and v_missed_day = v_today - 1 then
    v_repair_to := s.current_streak;         -- broke last night; repairable today
  end if;

  return jsonb_build_object(
    'streak', v_display,
    'studied_today', v_last >= v_today,
    'free_freeze_ready', v_free_ready,
    'freezes_held', s.freezes_held,
    'freeze_saved_on', s.freeze_saved_on,
    'freeze_note', not s.freeze_note_seen,
    'repair_available', v_repair_to is not null,
    'repair_to', v_repair_to,
    'repair_cost', 200
  );
end;
$$;

-- ============================================================================
-- 5. Functions the app (and later the website) calls
-- ============================================================================

-- Records one answer. The server decides the Enigma (10 / 5 / 2, combo up to 20),
-- uses a leaf for a wrong answer, and awards nothing at 0 leaves.
create or replace function public.record_answer(p_session_id uuid, p_question_ref text, p_result text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  g user_gamification;
  v_run integer;
  v_earn integer;
  v_today_answers integer;
begin
  if v_user is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  if p_session_id is null or p_result not in ('correct', 'partial', 'wrong')
     or p_question_ref is null or char_length(p_question_ref) not between 1 and 200 then
    raise exception 'Invalid answer' using errcode = '22023';
  end if;
  if not check_entitlement(v_user) then
    raise exception 'Pro required' using errcode = '42501';
  end if;

  g := _load_gamification(v_user);   -- also locks the row, so answers are processed one at a time

  if g.last_answer_at is not null and now() - g.last_answer_at < interval '1.5 seconds' then
    raise exception 'Too fast' using errcode = 'P0001', hint = 'too_fast';
  end if;

  insert into answer_log (user_id, session_id, question_ref, result)
  values (v_user, p_session_id, p_question_ref, p_result)
  on conflict do nothing;
  if not found then
    raise exception 'Already answered' using errcode = 'P0001', hint = 'duplicate';
  end if;

  if g.combo_session is distinct from p_session_id then g.combo_run := 0; end if;
  if p_result = 'correct' then
    v_run  := g.combo_run + 1;
    v_earn := case when v_run <= 2 then 10 else least(20, 10 + 2 * (v_run - 2)) end;
  elsif p_result = 'partial' then
    v_run := 0; v_earn := 5;
  else
    v_run := 0; v_earn := 2;
  end if;

  if g.leaves = 0 then
    v_earn := 0;                               -- 0 leaves: keep studying, no Enigma
  elsif p_result = 'wrong' then
    if g.leaves = 5 then g.leaves_refill_from := now(); end if;
    g.leaves := g.leaves - 1;
  end if;

  -- Safety net against a tampered app: at most 1,500 Enigma a day from answers.
  select coalesce(sum(amount), 0) into v_today_answers
    from enigma_events where user_id = v_user and uk_day = _uk_today() and reason = 'answer';
  v_earn := greatest(0, least(v_earn, 1500 - v_today_answers));

  update user_gamification
     set leaves = g.leaves, leaves_refill_from = g.leaves_refill_from,
         combo_session = p_session_id, combo_run = v_run,
         last_answer_at = now(), updated_at = now()
   where user_id = v_user;
  update answer_log set enigma = v_earn
   where user_id = v_user and session_id = p_session_id and question_ref = p_question_ref;

  perform _change_enigma(v_user, v_earn, 'answer');

  return jsonb_build_object(
    'enigma', v_earn,
    'combo', v_run,
    'leaves', g.leaves,
    'next_leaf_at', case when g.leaves < 5 then date_trunc('second', g.leaves_refill_from + interval '30 minutes') end
  );
end;
$$;

-- Up to 5 recent wrong answers not yet reviewed (for the mistake review).
create or replace function public.get_mistake_review()
returns table (question_ref text, answered_at timestamptz)
language sql stable security definer set search_path = public as $$
  select a.question_ref, max(a.created_at)
    from answer_log a
   where a.user_id = auth.uid() and a.result = 'wrong' and a.reviewed_at is null
   group by a.question_ref
   order by max(a.created_at) desc
   limit 5;
$$;

-- Finishing the mistake review refills all 5 leaves. The questions reviewed
-- must be the student's own pending mistakes (at least 1, up to the 5 offered).
create or replace function public.complete_mistake_review(p_question_refs text[])
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_pending integer;
  v_valid integer;
begin
  if v_user is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  if p_question_refs is null or cardinality(p_question_refs) not between 1 and 5 then
    raise exception 'Invalid review' using errcode = '22023';
  end if;
  if not check_entitlement(v_user) then
    raise exception 'Pro required' using errcode = '42501';
  end if;

  perform _load_gamification(v_user);

  select count(distinct question_ref) into v_pending
    from answer_log where user_id = v_user and result = 'wrong' and reviewed_at is null;
  select count(distinct question_ref) into v_valid
    from answer_log
   where user_id = v_user and result = 'wrong' and reviewed_at is null
     and question_ref = any (p_question_refs);

  if v_valid = 0 or v_valid < least(5, v_pending) then
    raise exception 'Review not complete' using errcode = 'P0001', hint = 'incomplete';
  end if;

  update answer_log set reviewed_at = now()
   where user_id = v_user and result = 'wrong' and reviewed_at is null
     and question_ref = any (p_question_refs);
  update user_gamification set leaves = 5, leaves_refill_from = now(), updated_at = now()
   where user_id = v_user;

  return jsonb_build_object('leaves', 5);
end;
$$;

-- Call when a study session finishes. Works out today's streak on the server
-- (UK time), using a free weekly freeze or a held freeze for one missed day,
-- ignoring outage days, awarding milestone badges and the +10 streak bonus.
create or replace function public.record_study_day()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_today date := _uk_today();
  s user_streaks;
  v_last date;
  v_missed integer;
  v_missed_day date;
  v_new integer;
  v_freeze_used boolean := false;
  v_extended boolean := false;
  v_bonus integer := 0;
  v_badges integer[];
begin
  if v_user is null then raise exception 'Not signed in' using errcode = '28000'; end if;

  perform set_config('montura.trusted', 'on', true);

  select * into s from user_streaks where user_id = v_user for update;
  if not found then
    insert into user_streaks (user_id, current_streak, last_login_date)
    values (v_user, 1, v_today);
    v_new := 1;
  else
    v_last := s.last_login_date::date;
    if v_last is not null and v_last >= v_today then
      v_new := s.current_streak;               -- already counted today
    else
      if v_last is null then
        v_missed := 99;
      else
        select missed, last_missed into v_missed, v_missed_day from _missed_days(v_last, v_today);
      end if;

      s.broken_streak := null;
      s.broken_on := null;

      if v_missed = 0 then
        v_new := s.current_streak + 1;
        v_extended := true;
      elsif v_missed = 1 and s.freeze_used_week is distinct from _week_start(v_missed_day) then
        v_new := s.current_streak + 1;         -- free weekly freeze
        v_extended := true;
        s.freeze_used_week := _week_start(v_missed_day);
        s.freeze_saved_on := v_missed_day;
        v_freeze_used := true;
      elsif v_missed = 1 and s.freezes_held > 0 then
        v_new := s.current_streak + 1;         -- a held (bought) freeze
        v_extended := true;
        s.freezes_held := s.freezes_held - 1;
        s.freeze_saved_on := v_missed_day;
        v_freeze_used := true;
      else
        v_new := 1;
        if v_missed = 1 and v_missed_day = v_today - 1 and s.current_streak > 0 then
          s.broken_streak := s.current_streak;  -- repairable until midnight tonight (24h)
          s.broken_on := v_today;
        end if;
      end if;

      update user_streaks
         set current_streak   = v_new,
             last_login_date  = v_today,
             updated_at       = now(),
             freeze_used_week = s.freeze_used_week,
             freeze_saved_on  = s.freeze_saved_on,
             freeze_note_seen = not v_freeze_used,
             freezes_held     = s.freezes_held,
             broken_streak    = s.broken_streak,
             broken_on        = s.broken_on
       where user_id = v_user;
    end if;
  end if;

  perform set_config('montura.trusted', 'off', true);
  v_badges := _award_streak_badges(v_user, v_new);

  -- Streak-extension bonus: +10 Enigma each time the streak goes up by a day.
  if v_extended then
    v_bonus := 10;
    perform _change_enigma(v_user, v_bonus, 'streak_bonus');
  end if;

  return _streak_status(v_user)
      || jsonb_build_object('freeze_used', v_freeze_used, 'new_badges', v_badges, 'streak_bonus', v_bonus);
end;
$$;

-- Streak repair: within 24 hours of the break (the UK day after the missed
-- day), pay 200 Enigma to carry the streak on as if the day had been covered.
create or replace function public.repair_streak()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_today date := _uk_today();
  s user_streaks;
  v_status jsonb;
  v_balance integer;
  v_new integer;
begin
  if v_user is null then raise exception 'Not signed in' using errcode = '28000'; end if;

  select * into s from user_streaks where user_id = v_user for update;
  v_status := _streak_status(v_user);
  if not coalesce((v_status ->> 'repair_available')::boolean, false) then
    raise exception 'Nothing to repair' using errcode = 'P0001', hint = 'not_repairable';
  end if;

  select coalesce(enigma_balance, 0) into v_balance from user_profiles where id = v_user for update;
  if v_balance < 200 then
    raise exception 'Not enough Enigma' using errcode = 'P0001', hint = 'insufficient_enigma';
  end if;

  perform set_config('montura.trusted', 'on', true);
  if s.last_login_date::date >= v_today then
    -- Already studied today (streak was reset to 1): join the two runs back up.
    v_new := s.broken_streak + s.current_streak;
    update user_streaks
       set current_streak = v_new, broken_streak = null, broken_on = null, updated_at = now()
     where user_id = v_user;
  else
    -- Not studied yet today: mark yesterday as covered; today's session adds +1.
    v_new := s.current_streak;
    update user_streaks
       set last_login_date = v_today - 1, freeze_saved_on = v_today - 1, updated_at = now()
     where user_id = v_user;
  end if;
  perform set_config('montura.trusted', 'off', true);

  perform _change_enigma(v_user, -200, 'streak_repair');
  perform _award_streak_badges(v_user, v_new);
  return _streak_status(v_user);
end;
$$;

-- Marks the "your streak was saved by a freeze" note as shown.
create or replace function public.dismiss_freeze_note()
returns void
language plpgsql security definer set search_path = public as $$
begin
  perform set_config('montura.trusted', 'on', true);
  update user_streaks set freeze_note_seen = true where user_id = auth.uid();
  perform set_config('montura.trusted', 'off', true);
end;
$$;

-- Everything the Dashboard needs in one call.
create or replace function public.get_gamification_summary()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_today date := _uk_today();
  p user_profiles;
  g user_gamification;
  v_pro boolean;
  v_today_enigma integer;
begin
  if v_user is null then raise exception 'Not signed in' using errcode = '28000'; end if;

  select * into p from user_profiles where id = v_user;
  v_pro := check_entitlement(v_user);
  g := _load_gamification(v_user);
  perform _process_league_weeks();

  select coalesce(sum(amount), 0) into v_today_enigma
    from enigma_events where user_id = v_user and uk_day = v_today and amount > 0;

  return jsonb_build_object(
    'is_pro', v_pro,
    'enigma_balance', coalesce(p.enigma_balance, 0),
    'enigma_lifetime', coalesce(p.enigma_lifetime, 0),
    'daily_goal', coalesce(p.daily_goal, 'regular'),
    'today_enigma', v_today_enigma,
    'leaves', g.leaves,
    'next_leaf_at', case when g.leaves < 5 then date_trunc('second', g.leaves_refill_from + interval '30 minutes') end,
    'mistakes_to_review', (select count(distinct question_ref) from answer_log
                            where user_id = v_user and result = 'wrong' and reviewed_at is null),
    'league_tier', coalesce((select tier from user_league where user_id = v_user), 1),
    'badges', coalesce((select jsonb_agg(days order by days) from streak_badges where user_id = v_user), '[]'::jsonb),
    'streak', _streak_status(v_user)
  );
end;
$$;

-- The caller's league group this week: first name + initial and weekly Enigma.
create or replace function public.get_my_league()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_week date := _week_start(_uk_today());
  v_tier smallint;
  me league_members;
  v_last_result text;
begin
  if v_user is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  if not check_entitlement(v_user) then
    return jsonb_build_object('is_pro', false);
  end if;

  perform _process_league_weeks();
  v_tier := coalesce((select tier from user_league where user_id = v_user), 1);
  select result into v_last_result from league_members where week_start = v_week - 7 and user_id = v_user;
  select * into me from league_members where week_start = v_week and user_id = v_user;

  return jsonb_build_object(
    'is_pro', true,
    'tier', coalesce(me.tier, v_tier),
    'week_start', v_week,
    'ends_at', ((v_week + 7)::timestamp at time zone 'Europe/London'),
    'last_result', v_last_result,
    'joined', me.user_id is not null,
    'standings', coalesce((
      select jsonb_agg(jsonb_build_object(
               'rank', r.rank, 'name', r.name, 'enigma', r.weekly_enigma, 'is_me', r.user_id = v_user)
             order by r.rank)
      from (
        select m.user_id, m.weekly_enigma,
               row_number() over (order by m.weekly_enigma desc, m.joined_at asc) as rank,
               coalesce(nullif(trim(p.first_name), ''), 'Student')
                 || coalesce(' ' || upper(left(nullif(trim(p.last_name), ''), 1)) || '.', '') as name
        from league_members m
        join user_profiles p on p.id = m.user_id
        where m.week_start = v_week and m.tier = me.tier and m.group_no = me.group_no
      ) r
    ), '[]'::jsonb)
  );
end;
$$;

-- ============================================================================
-- 6. Who can run what
-- ============================================================================

revoke execute on function
  public._uk_today(), public._week_start(date), public._is_outage_day(date),
  public._missed_days(date, date), public._load_gamification(uuid),
  public._process_league_weeks(), public._league_add(uuid, integer),
  public._change_enigma(uuid, integer, text), public._award_streak_badges(uuid, integer),
  public._streak_status(uuid)
  from public, anon, authenticated;

revoke execute on function
  public.record_answer(uuid, text, text), public.get_mistake_review(),
  public.complete_mistake_review(text[]), public.record_study_day(), public.repair_streak(),
  public.dismiss_freeze_note(), public.get_gamification_summary(), public.get_my_league()
  from public, anon;
grant execute on function
  public.record_answer(uuid, text, text), public.get_mistake_review(),
  public.complete_mistake_review(text[]), public.record_study_day(), public.repair_streak(),
  public.dismiss_freeze_note(), public.get_gamification_summary(), public.get_my_league()
  to authenticated;

-- ============================================================================
-- 7. Weekly league reset (optional extra; the functions above already process
--    finished weeks lazily). Only schedules if pg_cron is switched on
--    (Database → Extensions). Cron times are UTC: every hour on Mondays.
-- ============================================================================
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('montura-league-rollover', '5 * * * 1', 'select public._process_league_weeks()');
  end if;
end;
$$;

-- UNDO (only if something breaks; the website doesn't use any of this yet):
--   drop the functions/tables above, drop triggers protect_gamification_profile_columns
--   and protect_gamification_streak_columns, restore protect_profile_billing_columns
--   from protect_profile_billing_columns.sql, and drop the new columns.
