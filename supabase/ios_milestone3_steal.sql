-- iOS Milestone 3: league steal (2026-10-01). Run once in the Supabase SQL Editor,
-- AFTER ios_milestone2_gamification.sql. Rules: BUILD_SPEC.md → Leagues →
-- "Enigma steal mechanic" in the iOS repo.
--
-- Rookie league only. Once every 24 hours a student can take up to 100 from
-- another member of their league group's WEEKLY league score. Balances,
-- lifetime Enigma and levels are never touched.
--
-- SAFE FOR THE WEBSITE: only adds columns and functions. Students still can't
-- write league_members (insert/update/delete stay revoked; no student policies).
-- Every write happens inside steal_league_enigma(), which a signed-in student
-- calls directly (like record_answer) and which checks every rule itself.

-- ============================================================================
-- 1. Columns
-- ============================================================================
alter table public.league_members
  add column if not exists last_steal_at     timestamptz,
  add column if not exists last_steal_target uuid,     -- anti-farming: not the same person twice in a row
  add column if not exists steal_notice      text;     -- shown to the target, cleared once seen

-- ============================================================================
-- 2. The steal
-- ============================================================================
create or replace function public.steal_league_enigma(target_user_id uuid, amount integer)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_week  date;
  me      league_members;
  them    league_members;
  v_last_at     timestamptz;
  v_last_target uuid;
  v_take  integer;
  v_name  text;
begin
  if v_user is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  if target_user_id is null or amount is null or amount not between 1 and 100 then
    raise exception 'Invalid steal' using errcode = '22023';
  end if;
  if target_user_id = v_user then
    raise exception 'Cannot steal from yourself' using errcode = 'P0001', hint = 'self';
  end if;

  -- 1. Pro, and in Rookie league this week.
  if not check_entitlement(v_user) then
    raise exception 'Pro required' using errcode = '42501';
  end if;
  perform _process_league_weeks();
  v_week := _week_start(_uk_today());

  -- Lock both rows in a fixed order so two steals at once can't deadlock.
  perform 1 from league_members
   where week_start = v_week and user_id in (v_user, target_user_id)
   order by user_id for update;

  select * into me from league_members where week_start = v_week and user_id = v_user;
  if not found or me.tier <> 1 then
    raise exception 'Rookie league only' using errcode = 'P0001', hint = 'not_rookie';
  end if;

  -- 2. Target is in the same group this week.
  select * into them from league_members where week_start = v_week and user_id = target_user_id;
  if not found or them.tier <> me.tier or them.group_no <> me.group_no then
    raise exception 'Not in your group' using errcode = 'P0001', hint = 'not_in_group';
  end if;

  -- 3. Not in the last 24 hours (server clock), across weekly resets too.
  -- Anti-farming: not the same target as last time.
  select last_steal_at, last_steal_target into v_last_at, v_last_target
    from league_members
   where user_id = v_user and last_steal_at is not null
   order by last_steal_at desc
   limit 1;
  if v_last_at is not null and now() - v_last_at < interval '24 hours' then
    raise exception 'Once every 24 hours' using errcode = 'P0001', hint = 'steal_cooldown';
  end if;
  if v_last_target = target_user_id then
    raise exception 'Pick someone different' using errcode = 'P0001', hint = 'same_target';
  end if;

  -- 4. At most 100, and never more than the target has this week.
  v_take := least(amount, 100, them.weekly_enigma);
  if v_take <= 0 then
    raise exception 'Nothing to steal' using errcode = 'P0001', hint = 'nothing_to_steal';
  end if;

  -- First name + initial only, as in the standings.
  select coalesce(nullif(trim(first_name), ''), 'Student')
           || coalesce(' ' || upper(left(nullif(trim(last_name), ''), 1)) || '.', '')
    into v_name
    from user_profiles where id = v_user;

  perform set_config('montura.trusted', 'on', true);
  -- 5–7. Move the points, record the steal, leave the target a notice
  -- (a newer notice replaces an older one).
  update league_members
     set weekly_enigma = weekly_enigma - v_take,
         steal_notice  = v_name || ' stole ' || v_take || ' Σ from your league score.'
   where week_start = v_week and user_id = target_user_id;
  update league_members
     set weekly_enigma     = weekly_enigma + v_take,
         last_steal_at     = now(),
         last_steal_target = target_user_id
   where week_start = v_week and user_id = v_user;
  perform set_config('montura.trusted', 'off', true);

  return jsonb_build_object('stolen', v_take, 'next_steal_at', now() + interval '24 hours');
end;
$$;

-- The caller's own notice (if any) for this week.
create or replace function public.get_steal_notice()
returns text
language sql stable security definer set search_path = public as $$
  select steal_notice from league_members
   where user_id = auth.uid() and week_start = _week_start(_uk_today());
$$;

-- Clears the caller's own notice once it has been shown.
create or replace function public.dismiss_steal_notice()
returns void
language plpgsql security definer set search_path = public as $$
begin
  perform set_config('montura.trusted', 'on', true);
  update league_members set steal_notice = null
   where user_id = auth.uid() and steal_notice is not null;
  perform set_config('montura.trusted', 'off', true);
end;
$$;

-- ============================================================================
-- 3. Who can run what
-- ============================================================================
revoke execute on function
  public.steal_league_enigma(uuid, integer), public.get_steal_notice(), public.dismiss_steal_notice()
  from public, anon;
grant execute on function
  public.steal_league_enigma(uuid, integer), public.get_steal_notice(), public.dismiss_steal_notice()
  to authenticated;

-- Belt and braces: students still can't write league rows directly.
revoke insert, update, delete on public.league_members from anon, authenticated;
