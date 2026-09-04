import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { secret } = req.query || {};

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Missing or incorrect secret' });
  }

  try {
    const { data: ambassadors, error: ambErr } = await supabase
      .from('ambassadors')
      .select('id, first_name, last_name, email, tiktok_username, joined_at')
      .order('joined_at', { ascending: false });

    if (ambErr) {
      console.error('Supabase error:', ambErr);
      return res.status(500).json({ error: 'Failed to fetch creators' });
    }

    const ids = (ambassadors || []).map((a) => a.id);
    const { data: docs, error: docErr } = await supabase
      .from('ambassador_documents')
      .select('ambassador_id, terms_date, consent_date, terms_doc_version, consent_doc_version')
      .in('ambassador_id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000']);

    if (docErr) {
      console.error('Supabase error:', docErr);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }

    const docsByAmbassador = {};
    (docs || []).forEach((d) => { docsByAmbassador[d.ambassador_id] = d; });

    const signed = (ambassadors || [])
      .filter((a) => docsByAmbassador[a.id])
      .map((a) => ({
        id: a.id,
        name: `${a.first_name || ''} ${a.last_name || ''}`.trim(),
        email: a.email,
        tiktokUsername: a.tiktok_username,
        joinedAt: a.joined_at,
        termsDate: docsByAmbassador[a.id].terms_date,
        consentDate: docsByAmbassador[a.id].consent_date,
        termsDocVersion: docsByAmbassador[a.id].terms_doc_version,
        consentDocVersion: docsByAmbassador[a.id].consent_doc_version,
      }));

    return res.status(200).json({ creators: signed });
  } catch (error) {
    console.error('list-signed-creators error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
