-- Run this once in the Supabase SQL Editor (for the iPhone app, milestone 1).
-- Safe for the website: adds a rule and some limits, changes no data.

-- 1. Let students remove their OWN subjects (there was no delete rule, so
--    changing subjects during onboarding / in Settings was impossible).
drop policy if exists "Users can delete own subjects" on user_subjects;
create policy "Users can delete own subjects"
  on user_subjects for delete
  to authenticated
  using (auth.uid() = user_id);

-- 2. Server-side limits on what a student can write to their profile, so a
--    tampered app/browser can't store huge or junk values. NOT VALID = only
--    checked on new writes; existing rows are left alone.
alter table user_profiles drop constraint if exists user_profiles_first_name_len;
alter table user_profiles add constraint user_profiles_first_name_len
  check (first_name is null or char_length(first_name) <= 100) not valid;
alter table user_profiles drop constraint if exists user_profiles_last_name_len;
alter table user_profiles add constraint user_profiles_last_name_len
  check (last_name is null or char_length(last_name) <= 100) not valid;
alter table user_profiles drop constraint if exists user_profiles_year_group_len;
alter table user_profiles add constraint user_profiles_year_group_len
  check (year_group is null or char_length(year_group) <= 20) not valid;
alter table user_profiles drop constraint if exists user_profiles_referral_source_len;
alter table user_profiles add constraint user_profiles_referral_source_len
  check (referral_source is null or char_length(referral_source) <= 50) not valid;
alter table user_profiles drop constraint if exists user_profiles_dream_career_len;
alter table user_profiles add constraint user_profiles_dream_career_len
  check (dream_career is null or char_length(dream_career) <= 50) not valid;
alter table user_profiles drop constraint if exists user_profiles_grade_goals_shape;
alter table user_profiles add constraint user_profiles_grade_goals_shape
  check (grade_goals is null or (jsonb_typeof(grade_goals) = 'object' and pg_column_size(grade_goals) <= 8192)) not valid;

alter table user_subjects drop constraint if exists user_subjects_text_len;
alter table user_subjects add constraint user_subjects_text_len
  check (char_length(subject_name) <= 100
         and (exam_board is null or char_length(exam_board) <= 30)
         and (tier is null or char_length(tier) <= 30)) not valid;
