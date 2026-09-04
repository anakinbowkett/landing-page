import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PINK = '#DD5A67';
const DEEP = '#A30223';
const INK = '#161616';
const GREY = '#6b7280';

// Reads the logo straight from the repo instead of fetching it over the
// network on every request. The old version fetched an external postimg.cc
// URL with no timeout, which could hang indefinitely and was the actual
// cause of the 504 FUNCTION_INVOCATION_TIMEOUT errors on download.
function loadLocalLogo() {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'assets', 'montura-logo.png'));
  } catch (e) {
    console.error('Could not read local logo asset:', e.message);
    return null;
  }
}

function field(doc, label, value, x, y, width) {
  doc.font('Helvetica-Bold').fontSize(9).fillColor(GREY).text(label, x, y, { width });
  doc.font('Helvetica').fontSize(11).fillColor(INK).text(String(value || '—'), x, y + 13, { width });
}

function buildRecordBuffer(row, logoBuffer) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    if (logoBuffer) doc.image(logoBuffer, 40, 36, { width: 90 });
    doc.font('Helvetica-Bold').fontSize(16).fillColor(DEEP).text('Signed Creator Record', 40, 100);
    doc.font('Helvetica').fontSize(9).fillColor(GREY)
      .text(`Generated ${new Date().toLocaleString('en-GB')} — source: Supabase (ambassadors + ambassador_documents)`, 40, 122);

    let y = 155;
    doc.moveTo(40, y).lineTo(555, y).strokeColor(PINK).lineWidth(1.4).stroke();
    y += 20;

    doc.font('Helvetica-Bold').fontSize(12).fillColor(DEEP).text('Creator details', 40, y);
    y += 20;
    field(doc, 'Full name', `${row.first_name || ''} ${row.last_name || ''}`.trim(), 40, y, 240);
    field(doc, 'Email', row.email, 300, y, 240);
    y += 34;
    field(doc, 'TikTok username', row.tiktok_username, 40, y, 240);
    field(doc, 'Referral code', row.referral_code, 300, y, 240);
    y += 34;
    field(doc, 'Joined', row.joined_at ? new Date(row.joined_at).toLocaleString('en-GB') : '—', 40, y, 240);
    y += 50;

    doc.moveTo(40, y).lineTo(555, y).strokeColor('#e5e5e5').lineWidth(1).stroke();
    y += 20;

    doc.font('Helvetica-Bold').fontSize(12).fillColor(DEEP)
      .text(`Creator Programme Agreement — ${row.accepted_terms ? 'Signed' : 'Not yet signed'}`, 40, y);
    y += 20;
    if (row.accepted_terms) {
      field(doc, 'Document version', row.terms_doc_version || 'v1', 40, y, 240);
      field(doc, 'Date signed', row.terms_date, 300, y, 240);
      y += 34;
      field(doc, 'Creator full name (typed)', row.terms_full_name, 40, y, 240);
      field(doc, 'Creator signature', row.terms_signature, 300, y, 240);
      y += 34;
      field(doc, 'Parent/guardian name', row.terms_parent_guardian_name, 40, y, 240);
      field(doc, 'Parent/guardian signature', row.terms_parent_signature, 300, y, 240);
      y += 34;
      field(doc, 'Parent relationship', row.terms_parent_relationship, 40, y, 240);
      y += 34;
      field(doc, 'Signed from IP', row.terms_signed_ip, 40, y, 240);
      y += 34;
      field(doc, 'Device / browser', (row.terms_user_agent || '—').slice(0, 90), 40, y, 480);
      y += 44;
    } else {
      y += 16;
    }

    doc.moveTo(40, y).lineTo(555, y).strokeColor('#e5e5e5').lineWidth(1).stroke();
    y += 20;

    doc.font('Helvetica-Bold').fontSize(12).fillColor(DEEP)
      .text(`Consent Form — ${row.accepted_consent ? 'Signed' : 'Not yet signed'}`, 40, y);
    y += 20;
    if (row.accepted_consent) {
      field(doc, 'Document version', row.consent_doc_version || 'v1', 40, y, 240);
      field(doc, 'Date signed', row.consent_date, 300, y, 240);
      y += 34;
      field(doc, 'Creator full name (typed)', row.consent_participant_name, 40, y, 240);
      field(doc, 'Creator date of birth', row.consent_participant_dob, 300, y, 240);
      y += 34;
      field(doc, 'Creator signature', row.consent_participant_signature, 40, y, 240);
      field(doc, 'Parent/guardian signature', row.consent_signature, 300, y, 240);
      y += 34;
      field(doc, 'Parent/guardian name', row.consent_parent_name, 40, y, 240);
      field(doc, 'Relationship to creator', row.consent_relationship, 300, y, 240);
      y += 34;
      field(doc, 'Parent email', row.consent_parent_email, 40, y, 240);
      field(doc, 'Parent phone', row.consent_parent_phone, 300, y, 240);
      y += 34;
      field(doc, 'Signed from IP', row.consent_signed_ip, 40, y, 240);
      y += 34;
      field(doc, 'Device / browser', (row.consent_user_agent || '—').slice(0, 90), 40, y, 480);
    }

    doc.font('Helvetica-Oblique').fontSize(8).fillColor(GREY)
      .text('This is a system-generated record of the electronic signatures held in Supabase for this creator, produced for Montura Learn\u2019s own files.', 40, 780, { width: 515 });

    doc.end();
  });
}

async function handleList(req, res) {
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

async function handleGenerate(req, res) {
  const { email } = req.query || {};
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  try {
    const { data: ambassador, error: ambErr } = await supabase
      .from('ambassadors')
      .select('*')
      .ilike('email', email.trim())
      .single();

    if (ambErr || !ambassador) {
      return res.status(404).json({ error: 'No creator found with that email' });
    }

    const { data: docRow, error: docErr } = await supabase
      .from('ambassador_documents')
      .select('*')
      .eq('ambassador_id', ambassador.id)
      .single();

    if (docErr || !docRow) {
      return res.status(404).json({ error: 'No signed documents on file for this creator' });
    }

    let logoBuffer = null;
    try { logoBuffer = loadLocalLogo(); } catch (e) { /* continue without logo */ }

    const merged = Object.assign({}, ambassador, docRow);
    const pdfBuffer = await buildRecordBuffer(merged, logoBuffer);

    const filename = `${(ambassador.first_name || 'creator')}-${(ambassador.last_name || '')}-record.pdf`
      .replace(/[^a-z0-9.-]/gi, '-').toLowerCase();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('generate-creator-record error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Merged from list-signed-creators.js + generate-creator-record.js to stay
// within Vercel's 12-function cap on the Hobby plan - action-routed the
// same way create-checkout-session.js already handles checkout vs portal.
// ?action=generate&email=... downloads a PDF; anything else (or omitted)
// lists signed creators, matching the two original endpoints' behavior.
export default async function handler(req, res) {
  const { action, secret } = req.query || {};

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Missing or incorrect secret' });
  }

  if (action === 'generate') {
    return handleGenerate(req, res);
  }
  return handleList(req, res);
}
