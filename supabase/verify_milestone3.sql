-- Run AFTER ios_milestone3_steal.sql, in the Supabase SQL Editor.
-- Replace the TWO ids below with two DIFFERENT test accounts
-- (Authentication → Users → copy UID). For the length of the test only, both
-- are made Pro and put in a private Rookie test group; all of that is undone.
--
-- It ENDS WITH A RED ERROR ON PURPOSE: the error message is the test report,
-- and the error makes Postgres undo everything the test did. Nothing is saved.
-- Every line of the report should start with "pass".

do $$
declare
  stealer constant uuid := '00000000-0000-0000-0000-000000000001';
  target  constant uuid := '00000000-0000-0000-0000-000000000002';
  report text := E'MILESTONE 3 STEAL TEST REPORT (nothing was saved)\n';
  v_week date := _week_start(_uk_today());
  test_group constant int := 900000001;   -- a group no real student is in
  r jsonb;
  n int;
  t text;
  ok boolean;
  bal_before numeric; life_before int; bal_after numeric; life_after int;
  s_bal_before numeric; s_life_before int;
begin
  if stealer = '00000000-0000-0000-0000-000000000001' or target = '00000000-0000-0000-0000-000000000002' then
    raise exception 'Replace the two test account ids on lines 12 and 13 first.';
  end if;
  if stealer = target then raise exception 'Use two DIFFERENT test accounts.'; end if;
  if (select count(*) from user_profiles where id in (stealer, target)) <> 2 then
    raise exception 'Both ids need a profile. Copy the UIDs of accounts that finished sign-up.';
  end if;

  -- ---- Setup (as the database owner) ----
  perform set_config('montura.trusted', 'on', true);
  update user_profiles set subscription_status = 'active' where id in (stealer, target);
  delete from league_members where user_id in (stealer, target);
  insert into league_members (week_start, user_id, tier, group_no, weekly_enigma)
  values (v_week, stealer, 1, test_group, 50), (v_week, target, 1, test_group, 250);
  perform set_config('montura.trusted', 'off', true);
  select enigma_balance, enigma_lifetime into bal_before, life_before from user_profiles where id = target;
  select enigma_balance, enigma_lifetime into s_bal_before, s_life_before from user_profiles where id = stealer;
  report := report || case when check_entitlement(stealer) and check_entitlement(target)
    then 'pass' else 'FAIL' end || E': both test accounts made Pro for this test\n';

  -- ---- As the stealer ----
  perform set_config('request.jwt.claims', json_build_object('role', 'authenticated', 'sub', stealer)::text, true);
  set local role authenticated;

  -- Can't write another student's row directly
  begin
    update league_members set weekly_enigma = 0 where user_id = target;
    get diagnostics n = row_count;
    report := report || case when n = 0 then 'pass' else 'FAIL' end
                     || E': student cannot edit another student''s league row directly\n';
  exception when insufficient_privilege then
    report := report || E'pass: student cannot edit another student''s league row directly\n';
  end;
  begin
    update league_members set weekly_enigma = 9999 where user_id = stealer;
    get diagnostics n = row_count;
    report := report || case when n = 0 then 'pass' else 'FAIL' end
                     || E': student cannot edit their own league row directly\n';
  exception when insufficient_privilege then
    report := report || E'pass: student cannot edit their own league row directly\n';
  end;

  -- Bad input
  begin
    perform steal_league_enigma(stealer, 50);
    report := report || E'FAIL: stealing from yourself accepted\n';
  exception when others then
    report := report || case when sqlerrm = 'Cannot steal from yourself' then 'pass' else 'FAIL' end
                     || ': stealing from yourself refused (' || sqlerrm || E')\n';
  end;
  begin
    perform steal_league_enigma(target, 101);
    report := report || E'FAIL: amount 101 accepted\n';
  exception when others then
    report := report || case when sqlerrm = 'Invalid steal' then 'pass' else 'FAIL' end
                     || ': amount over 100 refused (' || sqlerrm || E')\n';
  end;
  begin
    perform steal_league_enigma(target, 0);
    report := report || E'FAIL: amount 0 accepted\n';
  exception when others then
    report := report || case when sqlerrm = 'Invalid steal' then 'pass' else 'FAIL' end
                     || ': amount 0 refused (' || sqlerrm || E')\n';
  end;

  -- Not Pro
  reset role;
  perform set_config('montura.trusted', 'on', true);
  update user_profiles set subscription_status = 'expired', trial_start_date = now() - interval '30 days' where id = stealer;
  perform set_config('montura.trusted', 'off', true);
  set local role authenticated;
  begin
    perform steal_league_enigma(target, 50);
    report := report || E'FAIL: non-Pro student could steal\n';
  exception when others then
    report := report || case when sqlerrm = 'Pro required' then 'pass' else 'FAIL' end
                     || ': non-Pro student refused (' || sqlerrm || E')\n';
  end;
  reset role;
  perform set_config('montura.trusted', 'on', true);
  update user_profiles set subscription_status = 'active' where id = stealer;
  -- Not Rookie
  update league_members set tier = 2 where week_start = v_week and user_id = stealer;
  perform set_config('montura.trusted', 'off', true);
  set local role authenticated;
  begin
    perform steal_league_enigma(target, 50);
    report := report || E'FAIL: steal allowed outside Rookie\n';
  exception when others then
    report := report || case when sqlerrm = 'Rookie league only' then 'pass' else 'FAIL' end
                     || ': steal outside Rookie refused (' || sqlerrm || E')\n';
  end;
  reset role;
  -- Different group
  update league_members set tier = 1 where week_start = v_week and user_id = stealer;
  update league_members set group_no = test_group + 1 where week_start = v_week and user_id = target;
  set local role authenticated;
  begin
    perform steal_league_enigma(target, 50);
    report := report || E'FAIL: steal from another group allowed\n';
  exception when others then
    report := report || case when sqlerrm = 'Not in your group' then 'pass' else 'FAIL' end
                     || ': steal from another group refused (' || sqlerrm || E')\n';
  end;
  reset role;
  update league_members set group_no = test_group where week_start = v_week and user_id = target;

  -- A real steal: 100 moves from target (250) to stealer (50)
  set local role authenticated;
  r := steal_league_enigma(target, 100);
  reset role;
  report := report || case when (r ->> 'stolen')::int = 100 then 'pass' else 'FAIL' end
                   || ': steal of 100 accepted (got ' || r::text || E')\n';
  select weekly_enigma into n from league_members where week_start = v_week and user_id = target;
  report := report || case when n = 150 then 'pass' else 'FAIL' end || ': target weekly score 250 -> 150 (got ' || n || E')\n';
  select weekly_enigma into n from league_members where week_start = v_week and user_id = stealer;
  report := report || case when n = 150 then 'pass' else 'FAIL' end || ': stealer weekly score 50 -> 150 (got ' || n || E')\n';
  select enigma_balance, enigma_lifetime into bal_after, life_after from user_profiles where id = target;
  report := report || case when bal_after is not distinct from bal_before and life_after is not distinct from life_before
    then 'pass' else 'FAIL' end || E': target balance and lifetime Enigma untouched\n';
  select enigma_balance, enigma_lifetime into bal_after, life_after from user_profiles where id = stealer;
  report := report || case when bal_after is not distinct from s_bal_before and life_after is not distinct from s_life_before
    then 'pass' else 'FAIL' end || E': stealer balance and lifetime Enigma untouched\n';
  select steal_notice into t from league_members where week_start = v_week and user_id = target;
  report := report || case when t like '% stole 100 Σ from your league score.' and t !~ '@' then 'pass' else 'FAIL' end
                   || ': target notice stored (' || coalesce(t, 'none') || E')\n';
  select last_steal_at is not null and last_steal_target = target into ok
    from league_members where week_start = v_week and user_id = stealer;
  report := report || case when ok then 'pass' else 'FAIL' end || E': steal time and target recorded on stealer\n';

  -- Again straight away: 24-hour rule
  set local role authenticated;
  begin
    perform steal_league_enigma(target, 10);
    report := report || E'FAIL: second steal within 24 hours accepted\n';
  exception when others then
    report := report || case when sqlerrm = 'Once every 24 hours' then 'pass' else 'FAIL' end
                     || ': second steal within 24 hours refused (' || sqlerrm || E')\n';
  end;
  reset role;

  -- 25 hours later, same target: anti-farming
  update league_members set last_steal_at = now() - interval '25 hours' where week_start = v_week and user_id = stealer;
  set local role authenticated;
  begin
    perform steal_league_enigma(target, 10);
    report := report || E'FAIL: same target twice in a row accepted\n';
  exception when others then
    report := report || case when sqlerrm = 'Pick someone different' then 'pass' else 'FAIL' end
                     || ': same target twice in a row refused (' || sqlerrm || E')\n';
  end;
  reset role;

  -- Can't take more than the target has
  update league_members set last_steal_target = null where week_start = v_week and user_id = stealer;
  update league_members set weekly_enigma = 30 where week_start = v_week and user_id = target;
  set local role authenticated;
  r := steal_league_enigma(target, 100);
  reset role;
  report := report || case when (r ->> 'stolen')::int = 30 then 'pass' else 'FAIL' end
                   || ': steal capped at what the target has, 30 (got ' || r::text || E')\n';

  -- Nothing left to steal
  update league_members set last_steal_at = now() - interval '25 hours', last_steal_target = null
   where week_start = v_week and user_id = stealer;
  set local role authenticated;
  begin
    perform steal_league_enigma(target, 50);
    report := report || E'FAIL: steal from a 0 score accepted\n';
  exception when others then
    report := report || case when sqlerrm = 'Nothing to steal' then 'pass' else 'FAIL' end
                     || ': steal from a 0 score refused (' || sqlerrm || E')\n';
  end;
  reset role;

  -- 24-hour rule carries over the Monday reset
  update league_members set last_steal_at = null, last_steal_target = null, weekly_enigma = 200
   where week_start = v_week and user_id in (stealer, target);
  insert into league_members (week_start, user_id, tier, group_no, weekly_enigma, last_steal_at, result)
  values (v_week - 7, stealer, 1, test_group, 0, now() - interval '2 hours', 'stay');
  insert into league_weeks (week_start) values (v_week - 7) on conflict do nothing;
  set local role authenticated;
  begin
    perform steal_league_enigma(target, 50);
    report := report || E'FAIL: steal allowed 2 hours after a steal last week\n';
  exception when others then
    report := report || case when sqlerrm = 'Once every 24 hours' then 'pass' else 'FAIL' end
                     || ': 24-hour rule carries over the weekly reset (' || sqlerrm || E')\n';
  end;
  reset role;

  -- ---- As the target: read and clear the notice ----
  perform set_config('request.jwt.claims', json_build_object('role', 'authenticated', 'sub', target)::text, true);
  set local role authenticated;
  t := get_steal_notice();
  report := report || case when t like '% stole % Σ from your league score.' then 'pass' else 'FAIL' end
                   || ': target can read their own notice (' || coalesce(t, 'none') || E')\n';
  perform dismiss_steal_notice();
  report := report || case when get_steal_notice() is null then 'pass' else 'FAIL' end
                   || E': target can clear their own notice\n';
  begin
    select count(*) = 0 into ok from league_members;
  exception when insufficient_privilege then ok := true;
  end;
  report := report || case when ok then 'pass' else 'FAIL' end || E': student cannot read the league table directly\n';
  reset role;

  -- ---- Logged-out visitor ----
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  set local role anon;
  begin
    perform steal_league_enigma(target, 50);
    report := report || E'FAIL: logged-out visitor could call the steal\n';
  exception when insufficient_privilege then
    report := report || E'pass: logged-out visitor cannot call the steal\n';
  end;
  begin
    perform get_steal_notice();
    report := report || E'FAIL: logged-out visitor could read notices\n';
  exception when insufficient_privilege then
    report := report || E'pass: logged-out visitor cannot read notices\n';
  end;
  reset role;

  -- Undo everything by ending in an error; the message is the report.
  raise exception '%', report;
end;
$$;
