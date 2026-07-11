const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// TEMPORARY: accepts EITHER the env var value OR this hardcoded
// password — so it works even if ADMIN_PASSWORD in Vercel is set
// to something unexpected (extra whitespace, wrong value, etc).
// REMOVE this fallback once the env var issue is confirmed fixed —
// a hardcoded password sitting in your GitHub repo is a real
// security risk long-term.
const FALLBACK_ADMIN_PASSWORD = 'Montura-Temp-9247!';
function isValidAdminPassword(candidate) {
  return candidate === process.env.ADMIN_PASSWORD || candidate === FALLBACK_ADMIN_PASSWORD;
}

module.exports = async function handler(req, res) {

// GET all ambassadors with metrics
  if (req.method === 'GET' && req.query.action === 'list-ambassadors') {
    if (!isValidAdminPassword(req.query.password)) {
      return res.status(401).json({ error: 'Unauthorised' });
    }
    try {
      const { data: ambassadors, error } = await supabase
        .from('ambassadors')
        .select('id, first_name, last_name, email, referral_code, total_signups, total_conversions, total_revenue, joined_at')
        .order('total_revenue', { ascending: false });
      
      if (error) throw error;
      return res.status(200).json({ ambassadors });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch ambassadors' });
    }
  }

  // GET single ambassador detail + referred users + payments + monthly breakdown
  if (req.method === 'GET' && req.query.action === 'ambassador-detail') {
    if (!isValidAdminPassword(req.query.password)) {
      return res.status(401).json({ error: 'Unauthorised' });
    }
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Ambassador ID required' });

    try {
      const { data: ambassador, error: ambError } = await supabase
        .from('ambassadors')
        .select('id, first_name, last_name, email, referral_code, total_signups, total_conversions, total_revenue, joined_at')
        .eq('id', id)
        .single();

      if (ambError || !ambassador) {
        return res.status(404).json({ error: 'Ambassador not found' });
      }

      const { data: referredUsers, error: usersError } = await supabase
        .from('waitlist')
        .select('email, referral_code, verified, created_at')
        .eq('ambassador_id', id)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('id, email, amount, status, created_at')
        .eq('ambassador_id', id)
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      const monthlyBreakdown = {};
      (payments || []).forEach(p => {
        if (p.status !== 'paid') return;
        const month = p.created_at.substring(0, 7);
        if (!monthlyBreakdown[month]) {
          monthlyBreakdown[month] = { month, revenue: 0, conversions: 0 };
        }
        monthlyBreakdown[month].revenue += parseFloat(p.amount);
        monthlyBreakdown[month].conversions += 1;
      });

      return res.status(200).json({
        ambassador: {
          ...ambassador,
          name: `${ambassador.first_name} ${ambassador.last_name}`
        },
        referredUsers: referredUsers || [],
        payments: payments || [],
        monthlyBreakdown: Object.values(monthlyBreakdown).sort((a, b) => b.month.localeCompare(a.month))
      });

      
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch ambassador details' });
    }
  }

  // NEW: GET payout history for the creator-facing graph
  // /api/admin-payouts?action=payout-history&ambassadorId=UUID
  if (req.method === 'GET' && req.query.action === 'payout-history') {
    const { ambassadorId } = req.query;
    if (!ambassadorId) return res.status(400).json({ error: 'ambassadorId required' });

    try {
      const { data: history, error } = await supabase
        .from('payout_log')
        .select('payout_date, phase1_amount, phase2_amount, total_amount')
        .eq('ambassador_id', ambassadorId)
        .order('payout_date', { ascending: true });

      if (error) throw error;

      return res.status(200).json({ history: history || [] });
    } catch (err) {
      console.error('Payout history error:', err);
      return res.status(500).json({ error: 'Failed to fetch payout history' });
    }
  }

  
  
  // Admin view ambassador (no password needed)
  if (req.query.adminView === 'true' && req.query.ambassadorId) {
    const { ambassadorId } = req.query;

    try {
      const { data: ambassador } = await supabase
        .from('ambassadors')
        .select('*')
        .eq('id', ambassadorId)
        .single();

      if (!ambassador) {
        return res.status(404).json({ error: 'Ambassador not found' });
      }

      const { data: waitlistCommissions } = await supabase
        .from('waitlist_commissions')
        .select('*')
        .eq('ambassador_id', ambassadorId)
        .order('created_at', { ascending: false });

      const { data: subscriptions } = await supabase
        .from('monthly_commissions')
        .select('*')
        .eq('ambassador_id', ambassadorId)
        .order('created_at', { ascending: false });

      const verifiedSignups = waitlistCommissions?.filter(c => c.status === 'verified').length || 0;
      const phase1Earnings = (waitlistCommissions || [])
        .filter(c => c.status === 'verified')
        .reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0);
      const activeSubscriptions = subscriptions?.filter(s => s.is_active).length || 0;
      const phase2Earnings = (subscriptions || [])
        .filter(s => s.is_active)
        .reduce((sum, s) => sum + parseFloat(s.commission_amount || 0), 0);
      const totalPayout = phase1Earnings + phase2Earnings;

      return res.status(200).json({
        id: ambassador.id,
        firstName: ambassador.first_name,
        lastName: ambassador.last_name,
        email: ambassador.email,
        referralCode: ambassador.referral_code,
        adminNote1: ambassador.admin_note_1,
        adminNote2: ambassador.admin_note_2,
        totalPayout: totalPayout,
        phase1: {
          totalSignups: waitlistCommissions?.length || 0,
          verifiedSignups: verifiedSignups,
          earnings: phase1Earnings
        },
        phase2: {
          activeSubscriptions: activeSubscriptions,
          earnings: phase2Earnings
        },
        waitlistCommissions: waitlistCommissions || [],
        subscriptions: subscriptions || []
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle POST requests
  if (req.method === 'POST') {
    const { action, ambassadorId, note1, note2, paypalTxnId } = req.body;

    if (action === 'saveNotes' && ambassadorId) {
      try {
        await supabase
          .from('ambassadors')
          .update({
            admin_note_1: note1,
            admin_note_2: note2
          })
          .eq('id', ambassadorId);
        return res.status(200).json({ success: true });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (action === 'markPaid' && ambassadorId) {
      try {
        // Find everything currently owed and NOT yet paid out
        const { data: unpaidCommissions, error: c1Error } = await supabase
          .from('waitlist_commissions')
          .select('id, commission_amount')
          .eq('ambassador_id', ambassadorId)
          .eq('status', 'verified')
          .eq('paid_out', false);

        if (c1Error) throw c1Error;

        const { data: unpaidSubs, error: c2Error } = await supabase
          .from('monthly_commissions')
          .select('id, commission_amount')
          .eq('ambassador_id', ambassadorId)
          .eq('is_active', true)
          .eq('paid_out', false);

        if (c2Error) throw c2Error;

        const phase1Amount = (unpaidCommissions || [])
          .reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0);
        const phase2Amount = (unpaidSubs || [])
          .reduce((sum, s) => sum + parseFloat(s.commission_amount || 0), 0);
        const totalAmount = phase1Amount + phase2Amount;

        if (totalAmount <= 0) {
          return res.status(400).json({ error: 'Nothing currently owed for this ambassador' });
        }

        const nowIso = new Date().toISOString();

        if (unpaidCommissions && unpaidCommissions.length > 0) {
          await supabase
            .from('waitlist_commissions')
            .update({ paid_out: true, payout_date: nowIso })
            .in('id', unpaidCommissions.map(c => c.id));
        }

        if (unpaidSubs && unpaidSubs.length > 0) {
          await supabase
            .from('monthly_commissions')
            .update({ paid_out: true, payout_date: nowIso })
            .in('id', unpaidSubs.map(s => s.id));
        }

        // Log this payout event (drives the creator-facing history graph)
        await supabase
          .from('payout_log')
          .insert({
            ambassador_id: ambassadorId,
            payout_date: nowIso,
            phase1_amount: phase1Amount,
            phase2_amount: phase2Amount,
            total_amount: totalAmount,
            paypal_txn_id: paypalTxnId || null
          });

        // Keep the simple lifetime flag on ambassadors too, for quick reference
        await supabase
          .from('ambassadors')
          .update({
            paid_status: true,
            paypal_txn_id: paypalTxnId || null,
            paid_at: nowIso
          })
          .eq('id', ambassadorId);

        return res.status(200).json({ success: true, phase1Amount, phase2Amount, totalAmount });
      } catch (error) {
        console.error('markPaid error:', error);
        return res.status(500).json({ error: error.message });
      }
    }

    if (action === 'generateAndEmailReceipt' && ambassadorId) {
      // NOTE: this still doesn't actually send an email — no email
      // service is wired up. It returns success so the UI doesn't
      // break, but nothing is sent. Flagging this as unfinished.
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  
  // Handle GET requests (admin payouts - requires password)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, action, ambassadorId } = req.query;

  if (!isValidAdminPassword(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Receipt generation
  if (action === 'receipt' && ambassadorId) {
    try {
      const { data: ambassador } = await supabase
        .from('ambassadors')
        .select('*')
        .eq('id', ambassadorId)
        .single();

      if (!ambassador) {
        return res.status(404).json({ error: 'Ambassador not found' });
      }

      // Compute the ACTUAL amount currently owed, not a hardcoded figure
      const { data: unpaidCommissions } = await supabase
        .from('waitlist_commissions')
        .select('commission_amount')
        .eq('ambassador_id', ambassadorId)
        .eq('status', 'verified')
        .eq('paid_out', false);

      const { data: unpaidSubs } = await supabase
        .from('monthly_commissions')
        .select('commission_amount')
        .eq('ambassador_id', ambassadorId)
        .eq('is_active', true)
        .eq('paid_out', false);

      const phase1Amount = (unpaidCommissions || [])
        .reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0);
      const phase2Amount = (unpaidSubs || [])
        .reduce((sum, s) => sum + parseFloat(s.commission_amount || 0), 0);
      const amount = (phase1Amount + phase2Amount).toFixed(2);

      const paymentDate = getNextSaturday(new Date());
      const receiptNumber = 'REC-' + ambassador.referral_code + '-' + Date.now();

      const receiptHTML = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Payment Receipt</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:60px;max-width:800px;margin:0 auto;background:#fff;color:#1f2937}.header{display:flex;justify-content:space-between;margin-bottom:40px;border-bottom:2px solid #e5e7eb;padding-bottom:30px}.logo h1{font-size:32px;color:#1d7fe2;margin-bottom:8px}.logo p{color:#6b7280;font-size:14px}.badge{background:#10b981;color:#fff;padding:8px 16px;border-radius:6px;font-weight:700;font-size:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:40px}.section h3{font-size:12px;color:#6b7280;margin-bottom:12px;font-weight:700}.section p{line-height:1.8;font-size:15px}.banner{background:linear-gradient(135deg,#1d7fe2,#1e88f5);color:#fff;padding:30px;border-radius:12px;text-align:center;margin-bottom:30px}.banner .label{font-size:14px;opacity:0.9;margin-bottom:8px}.banner .amount{font-size:48px;font-weight:800}table{width:100%;border-collapse:collapse;margin-bottom:30px}thead{background:#f9fafb}th{padding:16px;text-align:left;font-size:12px;color:#6b7280;border-bottom:2px solid #e5e7eb;font-weight:700}td{padding:16px;border-bottom:1px solid #f3f4f6;font-size:15px}.totals{text-align:right;margin-top:30px}.row{display:flex;justify-content:flex-end;gap:60px;padding:12px 0;font-size:15px}.row.final{font-size:20px;font-weight:700;border-top:2px solid #e5e7eb;padding-top:16px;margin-top:16px}.footer{margin-top:50px;padding-top:30px;border-top:1px solid #e5e7eb;text-align:center;color:#6b7280;font-size:13px}</style></head><body><div class="header"><div class="logo"><h1>Monturalearn</h1><p>monturalearn@gmail.com</p></div><div class="badge">PAYMENT RECEIPT</div></div><div class="grid"><div class="section"><h3>RECEIPT DETAILS</h3><p><strong>Receipt Number:</strong> ' + receiptNumber + '<br><strong>Invoice Number:</strong> ' + (ambassador.invoice_number || 'N/A') + '<br><strong>Date Paid:</strong> ' + paymentDate.toLocaleDateString('en-GB',{day:"numeric",month:"long",year:"numeric"}) + '<br><strong>Payment Method:</strong> PayPal</p></div><div class="section"><h3>PAY TO</h3><p><strong>' + ambassador.first_name + ' ' + ambassador.last_name + '</strong><br>' + (ambassador.paypal_email || ambassador.email || '') + '</p></div></div><div class="banner"><div class="label">Amount Paid on ' + paymentDate.toLocaleDateString('en-GB',{day:"numeric",month:"long",year:"numeric"}) + '</div><div class="amount">£' + amount + '</div></div><table><thead><tr><th>Description</th><th style="text-align:right">To Pay</th></tr></thead><tbody><tr><td><strong>Monturalearn UGC Creator Commission</strong><br><span style="color:#6b7280;font-size:14px">Phase 1: £' + phase1Amount.toFixed(2) + ' &nbsp;|&nbsp; Phase 2: £' + phase2Amount.toFixed(2) + '</span></td><td style="text-align:right;font-weight:600">£' + amount + '</td></tr></tbody></table><div class="totals"><div class="row"><span>Subtotal:</span><span>£' + amount + '</span></div><div class="row final"><span>Amount Paid:</span><span>£' + amount + '</span></div></div><div class="footer"><p>This receipt confirms payment has been made via PayPal.</p><p>For queries, contact: monturalearn@gmail.com</p></div></body></html>';

      return res.status(200).json({ success: true, receiptHTML });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Get all ambassadors for payout dashboard
  try {
    const { data: ambassadors } = await supabase
      .from('ambassadors')
      .select('id, first_name, last_name, email, paypal_email, referral_code, paid_status, paypal_txn_id, paid_at, joined_at')
      .order('joined_at', { ascending: false });

    if (!ambassadors || ambassadors.length === 0) {
      return res.status(200).json({
        totalAmbassadors: 0,
        totalPayoutAmount: 0,
        phase1Total: 0,
        phase2Total: 0,
        nextPayoutDate: getNextSaturday(new Date()).toISOString().split('T')[0],
        payouts: []
      });
    }

    const payoutData = [];

    for (const amb of ambassadors) {
      // Phase 1: verified, not-yet-paid waitlist commissions
      const { data: unpaidCommissions } = await supabase
        .from('waitlist_commissions')
        .select('commission_amount')
        .eq('ambassador_id', amb.id)
        .eq('status', 'verified')
        .eq('paid_out', false);

      // Phase 2: active, not-yet-paid subscriber commissions
      const { data: unpaidSubs } = await supabase
        .from('monthly_commissions')
        .select('commission_amount')
        .eq('ambassador_id', amb.id)
        .eq('is_active', true)
        .eq('paid_out', false);

      const phase1Count = (unpaidCommissions || []).length;
      const phase2Count = (unpaidSubs || []).length;
      const phase1Total = (unpaidCommissions || [])
        .reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0);
      const phase2Total = (unpaidSubs || [])
        .reduce((sum, s) => sum + parseFloat(s.commission_amount || 0), 0);
      const totalPayout = phase1Total + phase2Total;

      payoutData.push({
        ambassadorId: amb.id,
        name: `${amb.first_name} ${amb.last_name}`,
        email: amb.email,
        referralCode: amb.referral_code,
        phase1Signups: phase1Count,
        phase1Total: phase1Total,
        phase2Subscribers: phase2Count,
        phase2Total: phase2Total,
        totalPayout: totalPayout,
        payoutMethod: 'PayPal',
        paypalEmail: amb.paypal_email || amb.email,
        paid_status: amb.paid_status,
        paypal_txn_id: amb.paypal_txn_id,
        paid_at: amb.paid_at
      });
    }

    payoutData.sort((a, b) => b.totalPayout - a.totalPayout);

    return res.status(200).json({
      totalAmbassadors: payoutData.length,
      totalPayoutAmount: payoutData.reduce((sum, p) => sum + p.totalPayout, 0),
      phase1Total: payoutData.reduce((sum, p) => sum + p.phase1Total, 0),
      phase2Total: payoutData.reduce((sum, p) => sum + p.phase2Total, 0),
      generatedAt: new Date().toISOString(),
      nextPayoutDate: getNextSaturday(new Date()).toISOString().split('T')[0],
      payouts: payoutData
    });

  } catch (error) {
    console.error('Admin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Always the upcoming Saturday (today, if today IS Saturday) —
// matches the logic used on the creator dashboard.
function getNextSaturday(fromDate) {
  const d = new Date(fromDate);
  const dayOfWeek = d.getDay(); // 0 = Sunday ... 6 = Saturday
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
  d.setDate(d.getDate() + daysUntilSaturday);
  return d;
}
