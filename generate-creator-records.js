// generate-creator-records.js
//
// Pulls signed Creator Programme records from Supabase and turns each one
// into a proper PDF for your own files — not a spreadsheet row, an actual
// document with the creator's details, both signatures, and the audit
// trail (IP address, device, timestamp) that proves when it was signed.
//
// USAGE
//   node generate-creator-records.js                    -> every signed creator
//   node generate-creator-records.js someone@email.com  -> just that one
//
// SETUP (one-off)
//   1. npm install
//   2. Create a .env file in this folder (never commit it — it's already
//      gitignored) with:
//        SUPABASE_URL=https://xxxxx.supabase.co
//        SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
//      Both are in your Supabase dashboard under Project Settings > API —
//      the same two values your Vercel deployment already uses.
//
// OUTPUT
//   One PDF per creator in ./signed-records/ (also gitignored — this is
//   personal data, it stays on your machine, never in the repo).

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const PDFDocument = require('pdfkit');

const OUTPUT_DIR = path.join(__dirname, 'signed-records');
const LOGO_URL = 'https://i.postimg.cc/vH9GHtHV/erasebg-transformed.png';

const PINK = '#DD5A67';
const DEEP = '#A30223';
const INK = '#161616';
const GREY = '#6b7280';

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('Logo fetch failed: ' + res.statusCode));
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function safeFilename(str) {
  return (str || 'creator').replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

function field(doc, label, value, x, y, width) {
  doc.font('Helvetica-Bold').fontSize(9).fillColor(GREY).text(label, x, y, { width });
  doc.font('Helvetica').fontSize(11).fillColor(INK).text(String(value || '—'), x, y + 13, { width });
}

function buildRecord(row, logoBuffer) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const filename = `${safeFilename((row.first_name || '') + '-' + (row.last_name || ''))}-${row.id.slice(0, 8)}.pdf`;
    const outPath = path.join(OUTPUT_DIR, filename);
    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);

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
    stream.on('finish', () => resolve(outPath));
    stream.on('error', reject);
  });
}

async function main() {
  const targetEmail = process.argv[2];

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY — add a .env file first (see the notes at the top of this script).');
    process.exit(1);
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  let ambQuery = supabase.from('ambassadors').select('*').order('joined_at', { ascending: false });
  if (targetEmail) ambQuery = ambQuery.ilike('email', targetEmail.trim());

  const { data: ambassadors, error: ambErr } = await ambQuery;
  if (ambErr) { console.error('Supabase error (ambassadors):', ambErr.message); process.exit(1); }
  if (!ambassadors || ambassadors.length === 0) { console.log('No matching creators found.'); return; }

  const ids = ambassadors.map((a) => a.id);
  const { data: docs, error: docErr } = await supabase
    .from('ambassador_documents')
    .select('*')
    .in('ambassador_id', ids);
  if (docErr) { console.error('Supabase error (documents):', docErr.message); process.exit(1); }

  const docsByAmbassador = {};
  (docs || []).forEach((d) => { docsByAmbassador[d.ambassador_id] = d; });

  let logoBuffer = null;
  try { logoBuffer = await fetchBuffer(LOGO_URL); }
  catch (e) { console.warn('Could not fetch the logo — continuing without it.'); }

  for (const row of ambassadors) {
    const docRow = docsByAmbassador[row.id];
    if (!docRow) { console.log(`Skipping ${row.email} — no signed documents on file.`); continue; }
    const merged = Object.assign({}, row, docRow);
    const outPath = await buildRecord(merged, logoBuffer);
    console.log('Written:', outPath);
  }
}

main();
