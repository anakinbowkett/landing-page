-- Run this once in the Supabase SQL Editor.
-- Removes columns confirmed unused anywhere in the codebase (checked against
-- every .js and .html file in the repo before writing this). Does NOT touch
-- admin_note_1/2, paypal_txn_id, paid_status, paid_at, or joined_at — those
-- are all actively used by api/admin-payouts.js and the signup flow, and
-- dropping them would break the payout dashboard.

alter table ambassadors drop column if exists discord_username;
alter table ambassadors drop column if exists country_of_origin;
alter table ambassadors drop column if exists is_senior;
alter table ambassadors drop column if exists last_payout_date;
alter table ambassadors drop column if exists address_line1;
alter table ambassadors drop column if exists address_line2;
alter table ambassadors drop column if exists city;
alter table ambassadors drop column if exists postcode;
