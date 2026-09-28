-- iOS Milestone 2 update (2026-09-28): +10 Enigma streak-extension bonus.
-- Run once in the Supabase SQL Editor, AFTER ios_milestone2_gamification.sql
-- (already installed). Replaces only record_study_day(); nothing else changes,
-- and its permissions stay as they were. Safe for the website (it doesn't call
-- this function yet).

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
