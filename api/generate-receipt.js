import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, ambassadorId } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
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

    const today = new Date();
    const paymentDate = new Date(today.getFullYear(), today.getMonth(), 15);
    const receiptNumber = `REC-${ambassador.referral_code}-${Date.now()}`;

    const receiptHTML = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Receipt</title><style>body{font-family:Arial;padding:40px;max-width:800px;margin:0 auto}h1{color:#1d7fe2}table{width:100%;border-collapse:collapse}td,th{padding:12px;text-align:left;border-bottom:1px solid #ddd}</style></head><body><h1>PAYMENT RECEIPT</h1><p><strong>Receipt Number:</strong> ${receiptNumber}</p><p><strong>Date:</strong> ${paymentDate.toLocaleDateString('en-GB')}</p><p><strong>Pay To:</strong> ${ambassador.first_name} ${ambassador.last_name}</p><p><strong>Email:</strong> ${ambassador.email}</p><p><strong>Address:</strong> ${ambassador.address_line1}, ${ambassador.city}, ${ambassador.postcode}, United Kingdom</p><h2>Amount Paid: £0.50</h2><p>Payment Method: PayPal</p><p>Description: Monturalearn Startup Circle UGC Creator</p></body></html>`;

    return res.status(200).json({ success: true, receiptHTML: receiptHTML });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
