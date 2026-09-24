-- Run this once in the Supabase SQL Editor.
-- SECURITY FIX: the "Users can update own profile" rule lets a signed-in
-- student change EVERY column on their own user_profiles row — including
-- subscription_status (free Pro via browser dev tools), used_intro_offer
-- (claim the 99p offer again) and stripe_customer_id (point "Manage Billing"
-- at someone else's Stripe account).
--
-- This trigger quietly ignores any change to billing/trial/access columns
-- that comes from a student's own login. Server code (service role key —
-- Stripe webhook, verify-payment, track-referral, middleware) and the SQL
-- editor are unaffected. The website needs no change: onboarding-step4
-- still sends subscription_status/trial_start_date, and the trigger simply
-- decides those values itself.
--
-- mastery_miles / enigma_balance are deliberately NOT protected yet:
-- leaderboard.js writes them straight from the browser, so locking them
-- would break the leaderboard game. That needs moving to server code first.

create or replace function protect_profile_billing_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- Only restrict requests made with a student's own login (or no login).
  -- Server code uses the service role; the SQL editor has no JWT at all.
  if coalesce(auth.jwt() ->> 'role', '') not in ('authenticated', 'anon') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    -- A brand-new profile always starts on the free trial, from now,
    -- whatever the browser sent.
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

  -- UPDATE: a trial can be started once (first time trial_start_date is set,
  -- e.g. onboarding on a row that was created empty). After that, never.
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

drop trigger if exists protect_profile_billing_columns on user_profiles;
create trigger protect_profile_billing_columns
  before insert or update on user_profiles
  for each row execute function protect_profile_billing_columns();
