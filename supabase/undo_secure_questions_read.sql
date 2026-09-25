-- EMERGENCY UNDO for secure_questions_read.sql — only run this if Flashtiles
-- stops showing cards after locking the questions table. It puts back the
-- old "anyone signed in can read questions" rule (NOT the public ones).
drop policy if exists "Entitled users can read questions" on questions;
create policy "Authenticated users can read questions"
  on questions for select to authenticated using (true);
