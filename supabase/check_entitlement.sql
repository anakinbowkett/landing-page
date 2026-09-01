-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query).
-- It's what middleware.mjs calls on every /lectures/* request.
--
-- Uses Postgres's own now() — not any value sent by the browser — so a
-- visitor's system clock can never affect the trial calculation.

create or replace function check_entitlement(p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select
    case
      when subscription_status = 'active' then true
      when subscription_status = 'trial'
        and trial_start_date is not null
        and now() < (trial_start_date + interval '3 days') then true
      else false
    end
  from user_profiles
  where id = p_user_id;
$$;
