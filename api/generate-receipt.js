import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, ambassadorId, paymentDate } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!ambassadorId || !paymentDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data: ambassador } = await supabase
      .from('ambassadors')
      .select('*')
      .eq('id', ambassadorId)
      .single();

    if (!ambassador) {
      return res.status(404).json({ error: 'Ambassador not found' });
    }

    const receiptHTML = `<!DOCTYPE html><html><body><h1>Test Receipt</h1><p>Ambassador: ${ambassador.first_name}</p></body></html>`;

    return res.status(200).json({
      success: true,
      receiptHTML: receiptHTML
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
