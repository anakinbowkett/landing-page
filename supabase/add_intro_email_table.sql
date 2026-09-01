-- Run this once in the Supabase SQL Editor.
-- Tracks which real inboxes (normalized — dots/plus-aliases collapsed for
-- Gmail, plus-aliases collapsed for everyone) have already redeemed the
-- 99p intro offer. Free, no third-party cost. Catches the common trick of
-- signing up again with john.doe@gmail.com / johndoe@gmail.com /
-- john+2@gmail.com, all of which are actually the same mailbox.

create table if not exists used_intro_normalized_emails (
    normalized_email text primary key,
    first_used_by uuid references user_profiles(id),
    first_used_at timestamptz not null default now()
);
