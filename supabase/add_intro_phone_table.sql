-- Run this once in the Supabase SQL Editor.
-- Tracks which verified phone numbers have already redeemed the 99p intro
-- offer. Unlike the card-fingerprint table, this one is checked BEFORE
-- checkout happens (phone verification is a required step to claim the
-- discount), so a second account using an already-claimed number simply
-- never gets the discount offered in the first place — full price from
-- the start, no blocking, no punishment, nothing to undo.

create table if not exists used_intro_phone_numbers (
    phone_number text primary key,
    first_used_by uuid references user_profiles(id),
    first_used_at timestamptz not null default now()
);
