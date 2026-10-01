-- iOS Milestone 3: what the app's Steal button needs (2026-10-01). Run once in
-- the Supabase SQL Editor, AFTER ios_milestone3_steal.sql.
--
-- The league list never shows account ids (BUILD_SPEC → Leagues). So each
-- classmate in the list gets a "handle" instead: a one-way code that only
-- means something inside this week's group. The app steals by handle; the
-- server turns it back into the student and runs steal_league_enigma().
--
-- SAFE FOR THE WEBSITE: get_my_league() only GAINS fields ('handle' on each
-- row, and a 'steal' object). Nothing is removed or renamed.

-- One-way code for a group member this week (not their account id).
create or replace function public._member_handle(p_user uuid, p_week date)
returns text language sql immutable as $$
  select md5(p_user::text || ':' || p_week::text || ':montura-steal');
$$;

-- Same as before, plus 'handle' on other students' rows and the caller's steal status.
create or replace function public.get_my_league()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_week date := _week_start(_uk_today());
  v_tier smallint;
  me league_members;
  v_last_result text;
  v_last_at timestamptz;
  v_last_target uuid;
begin
  if v_user is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  if not check_entitlement(v_user) then
    return jsonb_build_object('is_pro', false);
  end if;

  perform _process_league_weeks();
  v_tier := coalesce((select tier from user_league where user_id = v_user), 1);
  select result into v_last_result from league_members where week_start = v_week - 7 and user_id = v_user;
  select * into me from league_members where week_start = v_week and user_id = v_user;
  select last_steal_at, last_steal_target into v_last_at, v_last_target
    from league_members
   where user_id = v_user and last_steal_at is not null
   order by last_steal_at desc
   limit 1;

  return jsonb_build_object(
    'is_pro', true,
    'tier', coalesce(me.tier, v_tier),
    'week_start', v_week,
    'ends_at', ((v_week + 7)::timestamp at time zone 'Europe/London'),
    'last_result', v_last_result,
    'joined', me.user_id is not null,
    'steal', jsonb_build_object(
      'available', me.user_id is not null and me.tier = 1,
      'next_steal_at', case when v_last_at > now() - interval '24 hours' then v_last_at + interval '24 hours' end,
      'last_target_handle', case when v_last_target is not null then _member_handle(v_last_target, v_week) end
    ),
    'standings', coalesce((
      select jsonb_agg(jsonb_build_object(
               'rank', r.rank, 'name', r.name, 'enigma', r.weekly_enigma, 'is_me', r.user_id = v_user,
               'handle', case when r.user_id <> v_user then _member_handle(r.user_id, v_week) end)
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

-- Steal from the classmate with this handle (always asks for the most allowed: 100,
-- capped by the server at what they have). Every rule is checked in steal_league_enigma().
create or replace function public.steal_from_member(p_handle text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_week date := _week_start(_uk_today());
  me league_members;
  v_target uuid;
begin
  if v_user is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  if p_handle is null or char_length(p_handle) <> 32 then
    raise exception 'Invalid steal' using errcode = '22023';
  end if;
  perform _process_league_weeks();
  select * into me from league_members where week_start = v_week and user_id = v_user;
  if not found then
    raise exception 'Rookie league only' using errcode = 'P0001', hint = 'not_rookie';
  end if;
  select m.user_id into v_target
    from league_members m
   where m.week_start = v_week and m.tier = me.tier and m.group_no = me.group_no
     and _member_handle(m.user_id, v_week) = p_handle;
  if v_target is null then
    raise exception 'Not in your group' using errcode = 'P0001', hint = 'not_in_group';
  end if;
  return steal_league_enigma(v_target, 100);
end;
$$;

revoke execute on function public._member_handle(uuid, date) from public, anon, authenticated;
revoke execute on function public.steal_from_member(text) from public, anon;
grant execute on function public.steal_from_member(text) to authenticated;
-- get_my_league keeps its existing permissions (create or replace doesn't change them).
