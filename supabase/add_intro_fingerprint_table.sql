-- Run this once in the Supabase SQL Editor.
-- Tracks which physical cards (via Stripe's fingerprint, not the card
-- number itself) have already redeemed the 99p intro offer, so a new
-- email/account with the same card can't claim it again. This never
-- blocks or refunds an already-completed payment — it only stops the
-- discount firing a second time on a future checkout.

create table if not exists used_intro_card_fingerprints (
    fingerprint text primary key,
    first_used_by uuid references user_profiles(id),
    first_used_at timestamptz not null default now()
);
