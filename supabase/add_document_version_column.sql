-- Run this once in the Supabase SQL Editor.
-- Tracks which version of the Creator Programme documents (v1 = original
-- flat-£5 terms, v2 = tiered £3→£5 terms with the qualifying-post clause)
-- an ambassador actually signed. Defaults to 'v1' so existing rows and the
-- untouched original creator-contract.html / creator-consent.html pages
-- need no changes — only the new -2.html pages send docVersion: 'v2'.
--
-- Note: ambassador_documents is upserted on ambassador_id, so if the same
-- person ever signs both v1 and v2, this column reflects whichever was
-- submitted most recently, not a full history of both.

alter table ambassador_documents
  add column if not exists terms_doc_version text not null default 'v1';

alter table ambassador_documents
  add column if not exists consent_doc_version text not null default 'v1';
