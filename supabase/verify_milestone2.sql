-- Run AFTER ios_milestone2_gamification.sql, in the Supabase SQL Editor.
-- Replace the ONE 00000000-0000-0000-0000-000000000001 below with the id of
-- any test account (Authentication → Users → copy UID). The test makes it Pro
-- for the length of the test only; that is undone with everything else.
--
-- It ENDS WITH A RED ERROR ON PURPOSE: the error message is the test report,
-- and the error makes Postgres undo everything the test did. Nothing is saved.
-- Every line of the report should start with "pass".

do $$
declare
  test_user constant uuid := '00000000-0000-0000-0000-000000000001';
  report text := E'MILESTONE 2 TEST REPORT (nothing was saved)\n';
  s uuid;
  r jsonb;
  got int[] := '{}';
  i int;
  n int;
  before_life int;
  ok boolean;
begin
  perform set_config('request.jwt.claims',
    json_build_object('role', 'authenticated', 'sub', test_user)::text, true);

  -- Setup
  if test_user = '00000000-0000-0000-0000-000000000001' then
    raise exception 'Replace 00000000-0000-0000-0000-000000000001 on line 11 with a test account id first.';
  end if;
  if not exists (select 1 from user_profiles where id = test_user) then
    raise exception 'No profile found for %. Copy the UID of an account that finished sign-up.', test_user;
  end if;
  perform set_config('montura.trusted', 'on', true);
  update user_profiles set subscription_status = 'active' where id = test_user;
  perform set_config('montura.trusted', 'off', true);
  report := report || case when check_entitlement(test_user)
    then E'pass: test account made Pro for this test (undone at the end)\n'
    else E'FAIL: could not make the test account Pro\n' end;

  -- Combo: 5 correct in a row = 10, 10, 12, 14, 16
  s := gen_random_uuid();
  for i in 1..5 loop
    update user_gamification set last_answer_at = now() - interval '1 minute', leaves = 5 where user_id = test_user;
    r := record_answer(s, 'verify-q' || i, 'correct');
    got := got || (r ->> 'enigma')::int;
  end loop;
  report := report || case when got = array[10,10,12,14,16] then 'pass' else 'FAIL' end
                   || ': combo 10,10,12,14,16 (got ' || array_to_string(got, ',') || E')\n';

  -- Same question twice in a session is refused
  s := gen_random_uuid();
  update user_gamification set last_answer_at = now() - interval '1 minute' where user_id = test_user;
  perform record_answer(s, 'verify-dup', 'correct');
  update user_gamification set last_answer_at = now() - interval '1 minute' where user_id = test_user;
  begin
    perform record_answer(s, 'verify-dup', 'correct');
    report := report || E'FAIL: duplicate answer accepted\n';
  exception when others then
    report := report || case when sqlerrm = 'Already answered' then 'pass' else 'FAIL' end
                     || ': duplicate answer refused (' || sqlerrm || E')\n';
  end;

  -- Answers less than 1.5 s apart are refused
  update user_gamification set last_answer_at = now() where user_id = test_user;
  begin
    perform record_answer(gen_random_uuid(), 'verify-fast', 'correct');
    report := report || E'FAIL: answer 0 seconds later accepted\n';
  exception when others then
    report := report || case when sqlerrm = 'Too fast' then 'pass' else 'FAIL' end
                     || ': too-fast answer refused (' || sqlerrm || E')\n';
  end;

  -- Wrong answer: 2 Enigma and one leaf
  update user_gamification set last_answer_at = now() - interval '1 minute', leaves = 5 where user_id = test_user;
  r := record_answer(gen_random_uuid(), 'verify-wrong', 'wrong');
  report := report || case when (r ->> 'enigma')::int = 2 and (r ->> 'leaves')::int = 4 then 'pass' else 'FAIL' end
                   || ': wrong answer = 2 Enigma, 5 -> 4 leaves (got ' || r::text || E')\n';

  -- Leaves refill 1 per 30 minutes
  update user_gamification set leaves = 2, leaves_refill_from = now() - interval '65 minutes' where user_id = test_user;
  n := (get_gamification_summary() ->> 'leaves')::int;
  report := report || case when n = 4 then 'pass' else 'FAIL' end
                   || ': 2 leaves + 65 minutes = 4 leaves (got ' || n || E')\n';

  -- 0 leaves: allowed, earns nothing
  update user_gamification set leaves = 0, leaves_refill_from = now(), last_answer_at = now() - interval '1 minute'
   where user_id = test_user;
  r := record_answer(gen_random_uuid(), 'verify-zero', 'correct');
  report := report || case when (r ->> 'enigma')::int = 0 then 'pass' else 'FAIL' end
                   || E': 0 leaves = 0 Enigma\n';

  -- Mistake review refills all 5
  r := complete_mistake_review(array['verify-wrong']);
  report := report || case when (r ->> 'leaves')::int = 5 then 'pass' else 'FAIL' end
                   || E': mistake review refills leaves to 5\n';

  -- Spending doesn't lower lifetime Enigma (level)
  select enigma_lifetime into before_life from user_profiles where id = test_user;
  perform _change_enigma(test_user, -1, 'verify-spend');
  select enigma_lifetime = before_life into ok from user_profiles where id = test_user;
  report := report || case when ok then 'pass' else 'FAIL' end || E': spending does not lower lifetime Enigma\n';

  -- Streak: one missed day covered by the free weekly freeze
  insert into user_streaks (user_id, current_streak, last_login_date)
  select test_user, 0, null where not exists (select 1 from user_streaks where user_id = test_user);
  perform set_config('montura.trusted', 'on', true);
  update user_streaks
     set current_streak = 10, last_login_date = _uk_today() - 2, freeze_used_week = null, freezes_held = 0
   where user_id = test_user;
  n := (record_study_day() ->> 'streak')::int;
  report := report || case when n = 11 then 'pass' else 'FAIL' end
                   || ': missed 1 day, free freeze -> streak 11 (got ' || n || E')\n';

  -- Streak: missed day, freeze already used -> repair offered, costs 200
  perform set_config('montura.trusted', 'on', true);
  update user_streaks
     set current_streak = 10, last_login_date = _uk_today() - 2,
         freeze_used_week = _week_start(_uk_today() - 1), freezes_held = 0
   where user_id = test_user;
  update user_profiles set enigma_balance = 500 where id = test_user;
  ok := coalesce((get_gamification_summary() -> 'streak' ->> 'repair_available')::boolean, false);
  report := report || case when ok then 'pass' else 'FAIL' end || E': missed 1 day, no freeze -> repair offered\n';
  begin
    perform repair_streak();
    report := report || E'pass: repair accepted\n';
  exception when others then
    report := report || 'FAIL: repair refused (' || sqlerrm || E')\n';
  end;
  n := (record_study_day() ->> 'streak')::int;
  report := report || case when n = 11 then 'pass' else 'FAIL' end
                   || ': after repair, today counts -> 11 (got ' || n || E')\n';
  select enigma_balance::int into n from user_profiles where id = test_user;
  report := report || case when n = 300 then 'pass' else 'FAIL' end
                   || ': repair cost 200 Enigma (500 -> ' || n || E')\n';

  -- Badges
  perform _award_streak_badges(test_user, 30);
  ok := (get_gamification_summary() -> 'badges') @> '[7, 30]'::jsonb;
  report := report || case when ok then 'pass' else 'FAIL' end || E': badges 7 and 30 at a 30-day streak\n';

  -- Outage day doesn't count as missed
  perform set_config('montura.trusted', 'on', true);
  update user_streaks
     set current_streak = 5, last_login_date = _uk_today() - 2, freeze_used_week = _week_start(_uk_today() - 1)
   where user_id = test_user;
  insert into service_outages (starts_at, ends_at, note)
  values (((_uk_today() - 1)::timestamp at time zone 'Europe/London') + interval '10 hours',
          ((_uk_today() - 1)::timestamp at time zone 'Europe/London') + interval '12 hours', 'verify');
  n := (record_study_day() ->> 'streak')::int;
  report := report || case when n = 6 then 'pass' else 'FAIL' end
                   || ': outage yesterday -> streak continues to 6 (got ' || n || E')\n';

  -- League
  r := get_my_league();
  report := report || case when (r ->> 'joined')::boolean then 'pass' else 'FAIL' end
                   || ': in a league group this week, shown as '
                   || coalesce((select e ->> 'name' from jsonb_array_elements(r -> 'standings') e
                                where (e ->> 'is_me')::boolean), '?') || E'\n';

  -- ---- Security checks, as the real student role ----
  perform set_config('montura.trusted', 'off', true);
  set local role authenticated;

  update user_profiles set enigma_lifetime = 999999 where id = test_user;
  select enigma_lifetime <> 999999 into ok from user_profiles where id = test_user;
  report := report || case when ok then 'pass' else 'FAIL' end || E': student cannot set their own lifetime Enigma\n';

  update user_streaks set freezes_held = 2 where user_id = test_user;
  select freezes_held = 0 into ok from user_streaks where user_id = test_user;
  report := report || case when ok then 'pass' else 'FAIL' end || E': student cannot give themselves freezes\n';

  begin
    insert into enigma_events (user_id, amount, reason, uk_day, week_start)
    values (test_user, 1000, 'hack', current_date, current_date);
    report := report || E'FAIL: student could add Enigma events\n';
  exception when insufficient_privilege then
    report := report || E'pass: student cannot add Enigma events\n';
  end;
  begin
    insert into streak_badges (user_id, days) values (test_user, 365);
    report := report || E'FAIL: student could give themselves a badge\n';
  exception when insufficient_privilege then
    report := report || E'pass: student cannot give themselves a badge\n';
  end;
  begin
    update user_gamification set leaves = 5 where user_id = test_user;
    report := report || E'FAIL: student could change their leaves\n';
  exception when insufficient_privilege then
    report := report || E'pass: student cannot change their leaves\n';
  end;
  begin
    perform _change_enigma(test_user, 1000, 'hack');
    report := report || E'FAIL: student could call the internal Enigma function\n';
  exception when insufficient_privilege then
    report := report || E'pass: student cannot call the internal Enigma function\n';
  end;

  begin
    select count(*) = 0 into ok from league_members;
  exception when insufficient_privilege then ok := true;
  end;
  report := report || case when ok then 'pass' else 'FAIL' end || E': student cannot read the league tables directly\n';
  begin
    select count(*) = 0 into ok from service_outages;
  exception when insufficient_privilege then ok := true;
  end;
  report := report || case when ok then 'pass' else 'FAIL' end || E': student cannot read the outage table\n';
  select coalesce(bool_and(user_id = test_user), true) into ok from enigma_events;
  report := report || case when ok then 'pass' else 'FAIL' end || E': student sees only their own Enigma events\n';

  -- ---- Logged-out visitor ----
  reset role;
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  set local role anon;
  begin
    perform get_gamification_summary();
    report := report || E'FAIL: logged-out visitor could call the summary\n';
  exception when insufficient_privilege then
    report := report || E'pass: logged-out visitor cannot call the summary\n';
  end;
  reset role;

  -- Undo everything by ending in an error; the message is the report.
  raise exception '%', report;
end;
$$;
