// ============================================================
// leaderboard.js — Full Battle Leaderboard System
// GCSE Mastery Platform
// ============================================================

const LB_SUPABASE_URL = 'https://bdoesoqpjhpxkwsjauwo.supabase.co';
const LB_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkb2Vzb3FwamhweGt3c2phdXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODUzODIsImV4cCI6MjA4MTA2MTM4Mn0.R2fgp-wqasPtn86gVcoM2RPpSMc-66_77F6VX-DzG-s';

// Use the already-initialised supabase client from dashboard if available, else create one
const lb_sb = window.sbClient || window.supabase.createClient(LB_SUPABASE_URL, LB_SUPABASE_ANON_KEY);

// ─── State ────────────────────────────────────────────────
let currentUser = null;        // full Supabase user object
let currentProfile = null;     // user_profiles row
let leaderboardData = [];      // sorted array of presence rows
let presenceChannel = null;    // Supabase realtime channel
let battleFeedChannel = null;
let decayInterval = null;
let lastStolenFromMe = null;   // user_id of whoever last stole from current user

// ─── Tier helpers ─────────────────────────────────────────
function getTier(rank) {
    if (rank === 1) return 'prodigy';
    if (rank <= 5) return 'elite';
    if (rank <= 13) return 'superior';
    return 'student';
}

function getTierLabel(rank) {
    const t = getTier(rank);
    return { prodigy: '👑 Prodigy', elite: '⚡ Elite', superior: '🥉 Superior', student: '📚 Student' }[t];
}

function getTierBorderStyle(rank) {
    const tier = getTier(rank);
    if (tier === 'prodigy') return 'border: 2px solid #000; box-shadow: 0 0 12px 3px rgba(0,0,0,0.55), 0 0 24px 6px rgba(80,80,80,0.25);';
    if (tier === 'elite')   return 'border: 2px solid #5b8dee; box-shadow: 0 0 10px 2px rgba(91,141,238,0.5), 0 0 20px 4px rgba(160,200,255,0.2);';
    if (tier === 'superior') return 'border: 2px solid #cd7f32; box-shadow: 0 0 8px 2px rgba(205,127,50,0.4);';
    return 'border: 1px solid #e9ecef;';
}

// ─── Mastery miles lecture earn rate ──────────────────────
function getLectureEarnRate(rank, prodigyMiles) {
    const myMiles = leaderboardData.find(u => u.user_id === currentUser?.id)?.mastery_miles || 0;
    const gap = prodigyMiles - myMiles;
    const tier = getTier(rank);

    // Student base = 2000 (double), with rubber-band on top
    let base = tier === 'student' ? 2000 : 1000;

    // Rubber-band: >50k behind = 1.5x on top of base
    if (gap > 50000) return Math.round(base * 1.5);
    if (gap > 20000) return Math.round(base * 1.2);
    return base;
}

// ─── Supabase: upsert presence (I'm online) ───────────────
async function upsertPresence(online) {
    if (!currentUser || !currentProfile) return;
    await lb_sb.from('leaderboard_presence').upsert({
        user_id: currentUser.id,
        user_name: currentProfile.first_name + ' ' + (currentProfile.last_name || '').trim(),
        mastery_miles: currentProfile.mastery_miles || 0,
        is_online: online,
        last_seen: new Date().toISOString()
    }, { onConflict: 'user_id' });
}

// ─── Fetch + sort leaderboard ─────────────────────────────
async function fetchLeaderboard() {
    console.log('fetchLeaderboard called, currentUser:', currentUser?.id);
    
    const { data, error } = await lb_sb
        .from('leaderboard_presence')
        .select('*')
        .order('mastery_miles', { ascending: false })
        .limit(130);

    console.log('LB data:', data, 'LB error:', error);

    if (error) { console.error('LB fetch error', error); return; }
    leaderboardData = data || [];
    console.log('leaderboardData length:', leaderboardData.length);
    renderLeaderboard();
    renderBattleFeed();
}

// ─── Real-time channel ────────────────────────────────────
function subscribeRealtime() {
    if (presenceChannel) lb_sb.removeChannel(presenceChannel);

    presenceChannel = lb_sb
        .channel('leaderboard-presence')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'leaderboard_presence'
        }, () => fetchLeaderboard())
        .subscribe();

    battleFeedChannel = lb_sb
        .channel('steal-transactions')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'steal_transactions'
        }, (payload) => {
            addBattleFeedEntry(payload.new);
            // If I was the victim, show notification
            if (payload.new.victim_id === currentUser?.id) {
                showStealNotification(payload.new);
            }
        })
        .subscribe();
}

// ─── RENDER leaderboard ───────────────────────────────────
function renderLeaderboard() {
    const container = document.getElementById('lb-list');
    if (!container) return;

    const prodigyMiles = leaderboardData[0]?.mastery_miles || 0;
    const myId = currentUser?.id;

    container.innerHTML = '';

    if (leaderboardData.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:2rem;color:#9ca3af;font-size:0.875rem;">No users online right now</div>';
        return;
    }

    leaderboardData.forEach((user, idx) => {
        const rank = idx + 1;
        const tier = getTier(rank);
        const isMe = user.user_id === myId;
        const myTier = getTier(leaderboardData.findIndex(u => u.user_id === myId) + 1);
        const isVerified = user.mastery_miles >= 500000;
        const earnRate = getLectureEarnRate(rank, prodigyMiles);

        // Build item
        const item = document.createElement('div');
        item.className = `lb-item lb-tier-${tier}`;
        item.dataset.userId = user.user_id;
        item.dataset.rank = rank;
        item.setAttribute('style', `
            position: relative; cursor: pointer; padding: 0.875rem 1rem;
            border-radius: 10px; margin-bottom: 0.5rem;
            background: ${isMe ? '#f0f9ff' : '#fff'};
            display: flex; align-items: center; justify-content: space-between;
            transition: all 0.2s; ${getTierBorderStyle(rank)}
        `);

        // Rank badge colour
        const rankColour = tier === 'prodigy' ? '#000' : tier === 'elite' ? '#5b8dee' : tier === 'superior' ? '#cd7f32' : '#9ca3af';

        item.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.875rem;flex:1;min-width:0;">
                <span style="font-size:0.8rem;font-weight:700;color:${rankColour};min-width:28px;">#${rank}</span>
                <span style="font-size:0.875rem;font-weight:600;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${user.user_name}
                    ${isVerified ? '<span title="500k+ Miles Verified" style="color:#1d9bf0;font-size:0.875rem;margin-left:4px;">✓</span>' : ''}
                    ${isMe ? '<span style="font-size:0.7rem;background:#e0f2fe;color:#0284c7;padding:1px 6px;border-radius:4px;margin-left:6px;">You</span>' : ''}
                </span>
                <span style="font-size:0.7rem;font-weight:600;padding:2px 8px;border-radius:20px;white-space:nowrap;
                    background:${tier==='prodigy'?'#000':tier==='elite'?'#eff6ff':tier==='superior'?'#fef3c7':'#f3f4f6'};
                    color:${tier==='prodigy'?'#fff':tier==='elite'?'#3b82f6':tier==='superior'?'#92400e':'#6b7280'};">
                    ${getTierLabel(rank)}
                </span>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem;flex-shrink:0;">
                <span style="font-size:0.8rem;font-weight:700;color:#111827;">
                    <img src="https://i.postimg.cc/pXSd21QN/Mastery-Miles-currency-removebg-preview.png" 
                         style="width:16px;height:16px;vertical-align:middle;margin-right:3px;">
                    ${Number(user.mastery_miles).toLocaleString()}
                </span>
                <span style="font-size:0.65rem;color:#6b7280;">▼</span>
            </div>

            <!-- Dropdown -->
            <div class="lb-dropdown" data-user-id="${user.user_id}" style="
                display:none; position:absolute; top:calc(100% + 4px); right:0;
                background:white; border:1px solid #e0e4e9; border-radius:10px;
                box-shadow:0 8px 24px rgba(0,0,0,0.12); z-index:999; min-width:220px;
                padding:0.5rem; overflow:hidden;
            ">
                ${buildDropdownButtons(user, rank, tier, myTier, isMe, myId)}
            </div>
        `;

        // Click anywhere on item = toggle dropdown
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            if (!isMe) {
                const dd = item.querySelector('.lb-dropdown');
                dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
            }
        });

        container.appendChild(item);
    });

    // Close all dropdowns on outside click
    document.addEventListener('click', closeAllDropdowns, { once: false });
}

function buildDropdownButtons(user, rank, tier, myTier, isMe, myId) {
    if (isMe) return '';

    const myRank = leaderboardData.findIndex(u => u.user_id === myId) + 1;
    const myTierName = getTier(myRank);
    let html = '';

    // ── STEAL button (shown to everyone except when target is Prodigy and viewer is also Prodigy) ──
    const canSteal = !(myTierName === 'prodigy'); // Prodigy cannot steal
    const targetIsProdigy = tier === 'prodigy';

    if (canSteal) {
        if (targetIsProdigy && myTierName !== 'elite') {
            // Students/Superiors can still steal from Prodigy
            html += ddBtn('🗡️ Steal Miles', '#dc143c', `handleSteal('${user.user_id}','${user.user_name}',${user.mastery_miles})`);
        } else if (!targetIsProdigy) {
            html += ddBtn('🗡️ Steal Miles', '#dc143c', `handleSteal('${user.user_id}','${user.user_name}',${user.mastery_miles})`);
        } else {
            // Elite vs Prodigy = RAID button
            html += ddBtn('⚔️ Raid the Prodigy', '#7c3aed', `handleRaid('${user.user_id}','${user.user_name}',${user.mastery_miles})`);
        }
    }

    // ── DONATE (Students rank 14+ only, target must be Elite rank 2-5) ──
    if (myTierName === 'student' && tier === 'elite') {
        html += ddBtn('🤝 Donate Miles', '#059669', `handleDonate('${user.user_id}','${user.user_name}')`);
    }

    // ── VIEW PROFILE ──
    html += ddBtn('👤 View Profile', '#374151', `showUserCard('${user.user_id}','${user.user_name}',${user.mastery_miles},${rank})`);

    return html;
}

function ddBtn(label, color, onclick) {
    return `<button onclick="${onclick}" style="
        display:block; width:100%; text-align:left; padding:0.625rem 0.875rem;
        background:transparent; border:none; cursor:pointer; font-size:0.8125rem;
        font-weight:600; color:${color}; font-family:'Inter',sans-serif;
        border-radius:6px; margin-bottom:2px; transition:background 0.15s;
    " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
        ${label}
    </button>`;
}

function closeAllDropdowns() {
    document.querySelectorAll('.lb-dropdown').forEach(d => d.style.display = 'none');
}

// ─── STEAL logic ──────────────────────────────────────────
async function handleSteal(victimId, victimName, victimMiles) {
    closeAllDropdowns();
    if (!currentUser) return;

    const myEntry = leaderboardData.find(u => u.user_id === currentUser.id);
    const myMiles = myEntry?.mastery_miles || 0;
    const myRank = leaderboardData.findIndex(u => u.user_id === currentUser.id) + 1;
    const myTier = getTier(myRank);
    const victimRank = leaderboardData.findIndex(u => u.user_id === victimId) + 1;
    const victimTier = getTier(victimRank);

    // Elite stealing from Prodigy = 65% success rate
    let success = true;
    if (myTier === 'elite' && victimTier === 'prodigy') {
        success = Math.random() < 0.65;
    }

    const milesStolen = Math.min(5000, victimMiles);

    if (success) {
        // Deduct from victim
        await lb_sb.from('leaderboard_presence').update({
            mastery_miles: Math.max(0, victimMiles - milesStolen)
        }).eq('user_id', victimId);

        // Add to attacker
        await lb_sb.from('leaderboard_presence').update({
            mastery_miles: myMiles + milesStolen
        }).eq('user_id', currentUser.id);

        // Also update user_profiles
        await lb_sb.from('user_profiles').update({ mastery_miles: myMiles + milesStolen }).eq('id', currentUser.id);
        await lb_sb.from('user_profiles').update({ mastery_miles: Math.max(0, victimMiles - milesStolen) }).eq('id', victimId);

        // Log transaction
        await lb_sb.from('steal_transactions').insert({
            attacker_id: currentUser.id,
            attacker_name: currentProfile.first_name,
            victim_id: victimId,
            victim_name: victimName,
            miles_stolen: milesStolen,
            success: true,
            transaction_type: 'steal'
        });

        // Notify victim
        await lb_sb.from('notifications').insert({
            recipient_id: victimId,
            sender_id: currentUser.id,
            sender_name: currentProfile.first_name,
            type: 'steal_alert',
            message: `${currentProfile.first_name} stole ${milesStolen.toLocaleString()} Mastery Miles from you!`,
            miles_involved: milesStolen
        });

        // Store last stolen victim for Rival Finder
        await lb_sb.from('user_profiles').update({
            last_steal_victim_id: victimId,
            last_steal_victim_name: victimName
        }).eq('id', currentUser.id);

        showToast(`✅ You stole ${milesStolen.toLocaleString()} miles from ${victimName}!`, '#059669');
        currentProfile.mastery_miles = myMiles + milesStolen;
        updateNavMiles(currentProfile.mastery_miles);
        await fetchLeaderboard();
    } else {
        showToast(`❌ Your steal attempt on ${victimName} failed!`, '#dc2626');
        await lb_sb.from('steal_transactions').insert({
            attacker_id: currentUser.id,
            attacker_name: currentProfile.first_name,
            victim_id: victimId,
            victim_name: victimName,
            miles_stolen: 0,
            success: false,
            transaction_type: 'steal'
        });
    }
}

// ─── RAID logic (Elite → Prodigy exclusive) ───────────────
async function handleRaid(victimId, victimName, victimMiles) {
    closeAllDropdowns();
    const myEntry = leaderboardData.find(u => u.user_id === currentUser?.id);
    const myMiles = myEntry?.mastery_miles || 0;
    const raidSteal = Math.min(10000, victimMiles); // Raids steal double

    // 65% success
    const success = Math.random() < 0.65;

    if (success) {
        await lb_sb.from('leaderboard_presence').update({ mastery_miles: Math.max(0, victimMiles - raidSteal) }).eq('user_id', victimId);
        await lb_sb.from('leaderboard_presence').update({ mastery_miles: myMiles + raidSteal }).eq('user_id', currentUser.id);
        await lb_sb.from('user_profiles').update({ mastery_miles: myMiles + raidSteal }).eq('id', currentUser.id);
        await lb_sb.from('user_profiles').update({ mastery_miles: Math.max(0, victimMiles - raidSteal) }).eq('id', victimId);

        await lb_sb.from('steal_transactions').insert({
            attacker_id: currentUser.id,
            attacker_name: currentProfile.first_name,
            victim_id: victimId,
            victim_name: victimName,
            miles_stolen: raidSteal,
            success: true,
            transaction_type: 'raid'
        });

        await lb_sb.from('notifications').insert({
            recipient_id: victimId,
            sender_id: currentUser.id,
            sender_name: currentProfile.first_name,
            type: 'steal_alert',
            message: `⚔️ ${currentProfile.first_name} RAIDED you as an Elite! They took ${raidSteal.toLocaleString()} miles!`,
            miles_involved: raidSteal
        });

        showToast(`⚔️ RAID SUCCESSFUL! Stole ${raidSteal.toLocaleString()} miles from the Prodigy!`, '#7c3aed');
        currentProfile.mastery_miles = myMiles + raidSteal;
        updateNavMiles(currentProfile.mastery_miles);
        await fetchLeaderboard();
    } else {
        showToast(`❌ Raid failed. The Prodigy defended their throne!`, '#dc2626');
    }
}

// ─── DONATE logic (Students → Elite) ─────────────────────
const donationTracker = {}; // eliteId → [{ studentId, timestamp }]

async function handleDonate(eliteId, eliteName) {
    closeAllDropdowns();
    const donationAmount = 500;
    const myEntry = leaderboardData.find(u => u.user_id === currentUser?.id);
    const myMiles = myEntry?.mastery_miles || 0;

    if (myMiles < donationAmount) {
        showToast('Not enough miles to donate!', '#dc2626');
        return;
    }

    const eliteEntry = leaderboardData.find(u => u.user_id === eliteId);
    const eliteMiles = eliteEntry?.mastery_miles || 0;

    // Deduct from donor
    await lb_sb.from('leaderboard_presence').update({ mastery_miles: myMiles - donationAmount }).eq('user_id', currentUser.id);
    await lb_sb.from('user_profiles').update({ mastery_miles: myMiles - donationAmount }).eq('id', currentUser.id);

    // Add to elite
    await lb_sb.from('leaderboard_presence').update({ mastery_miles: eliteMiles + donationAmount }).eq('user_id', eliteId);
    await lb_sb.from('user_profiles').update({ mastery_miles: eliteMiles + donationAmount }).eq('id', eliteId);

    // Track donations for Revolution trigger
    if (!donationTracker[eliteId]) donationTracker[eliteId] = [];
    const now = Date.now();
    donationTracker[eliteId] = donationTracker[eliteId].filter(d => now - d.timestamp < 60000); // last 60s
    donationTracker[eliteId].push({ studentId: currentUser.id, timestamp: now });

    // Check Revolution (3 unique students donated in 60s)
    const uniqueDonors = new Set(donationTracker[eliteId].map(d => d.studentId));
    if (uniqueDonors.size >= 3) {
        triggerRevolution(eliteId, eliteName);
        donationTracker[eliteId] = [];
    }

    showToast(`🤝 Donated ${donationAmount} miles to ${eliteName}!`, '#059669');
    currentProfile.mastery_miles = myMiles - donationAmount;
    updateNavMiles(currentProfile.mastery_miles);
    await fetchLeaderboard();
}

// ─── REVOLUTION event ─────────────────────────────────────
async function triggerRevolution(eliteId, eliteName) {
    // Give elite a 25000 mile surge
    const eliteEntry = leaderboardData.find(u => u.user_id === eliteId);
    const eliteMiles = eliteEntry?.mastery_miles || 0;
    await lb_sb.from('leaderboard_presence').update({ mastery_miles: eliteMiles + 25000 }).eq('user_id', eliteId);
    await lb_sb.from('user_profiles').update({ mastery_miles: eliteMiles + 25000 }).eq('id', eliteId);

    await lb_sb.from('notifications').insert({
        recipient_id: eliteId,
        sender_id: currentUser.id,
        sender_name: 'The People',
        type: 'revolution',
        message: `🔥 REVOLUTION! 3 Students rallied behind you. You received a 25,000 mile boost!`,
        miles_involved: 25000
    });

    showRevolutionBanner(eliteName);
    await fetchLeaderboard();
}

function showRevolutionBanner(eliteName) {
    const banner = document.createElement('div');
    banner.style.cssText = `
        position:fixed; top:80px; left:50%; transform:translateX(-50%);
        background:linear-gradient(135deg,#7c3aed,#dc2626); color:white;
        padding:1rem 2rem; border-radius:12px; z-index:99999;
        font-weight:700; font-size:1rem; text-align:center;
        box-shadow:0 8px 32px rgba(124,58,237,0.4);
        animation: slideDown 0.4s ease;
    `;
    banner.textContent = `🔥 REVOLUTION! The people have spoken — ${eliteName} surges forward!`;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 5000);
}

// ─── Notifications polling ────────────────────────────────
async function pollNotifications() {
    if (!currentUser) return;
    const { data } = await lb_sb
        .from('notifications')
        .select('*')
        .eq('recipient_id', currentUser.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);

    if (data && data.length > 0) {
        data.forEach(n => showStealNotification(n));
        // Mark as read
        await lb_sb.from('notifications').update({ is_read: true })
            .eq('recipient_id', currentUser.id).eq('is_read', false);
    }
}

function showStealNotification(notification) {
    const existing = document.getElementById('steal-notif-' + notification.id);
    if (existing) return;

    const notif = document.createElement('div');
    notif.id = 'steal-notif-' + notification.id;
    notif.style.cssText = `
        position:fixed; bottom:24px; right:24px; z-index:99999;
        background:white; border:1px solid #e0e4e9; border-radius:12px;
        padding:1.25rem 1.5rem; max-width:340px;
        box-shadow:0 8px 32px rgba(0,0,0,0.15);
        animation: slideUp 0.3s ease;
        border-left: 4px solid #dc143c;
    `;

    const attackerId = notification.sender_id;
    const myMiles = leaderboardData.find(u => u.user_id === currentUser?.id)?.mastery_miles || 0;
    const hasEnough = myMiles >= 5000;

    notif.innerHTML = `
        <div style="font-size:0.875rem;font-weight:700;color:#111827;margin-bottom:0.5rem;">
            ⚔️ ${notification.message}
        </div>
        <div style="font-size:0.75rem;color:#6b7280;margin-bottom:0.875rem;">
            Want revenge?
        </div>
        <div style="display:flex;gap:0.5rem;">
            ${hasEnough
                ? `<button onclick="retaliate('${attackerId}','${notification.sender_name}',${notification.miles_involved},'${notif.id}')" style="
                    flex:1;background:#dc143c;color:white;border:none;padding:0.5rem;
                    border-radius:7px;font-size:0.75rem;font-weight:700;cursor:pointer;
                    font-family:'Inter',sans-serif;">Steal Their Miles</button>`
                : `<button onclick="showUserCard('${attackerId}','${notification.sender_name}',0,0)" style="
                    flex:1;background:#111827;color:white;border:none;padding:0.5rem;
                    border-radius:7px;font-size:0.75rem;font-weight:700;cursor:pointer;
                    font-family:'Inter',sans-serif;">Show User Card</button>`
            }
            <button onclick="this.closest('[id^=steal-notif]').remove()" style="
                background:#f3f4f6;color:#374151;border:none;padding:0.5rem 0.75rem;
                border-radius:7px;font-size:0.75rem;font-weight:600;cursor:pointer;
                font-family:'Inter',sans-serif;">Dismiss</button>
        </div>
    `;

    document.body.appendChild(notif);
    setTimeout(() => notif?.remove(), 12000);
}

// ─── RETALIATE ────────────────────────────────────────────
async function retaliate(attackerId, attackerName, milesInvolved, notifId) {
    document.getElementById(notifId)?.remove();
    const attackerEntry = leaderboardData.find(u => u.user_id === attackerId);
    if (attackerEntry) {
        await handleSteal(attackerId, attackerName, attackerEntry.mastery_miles);
    }
}
window.retaliate = retaliate;

// ─── USER CARD modal ──────────────────────────────────────
function showUserCard(userId, userName, miles, rank) {
    closeAllDropdowns();
    const existing = document.getElementById('user-card-modal');
    if (existing) existing.remove();

    const tier = getTier(rank || (leaderboardData.findIndex(u => u.user_id === userId) + 1));
    const isVerified = miles >= 500000;

    const modal = document.createElement('div');
    modal.id = 'user-card-modal';
    modal.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.7);z-index:100000;
        display:flex;align-items:center;justify-content:center;
    `;

    const tierColours = {
        prodigy: { bg: '#000', text: '#fff', glow: '0 0 20px rgba(0,0,0,0.5)' },
        elite:   { bg: '#eff6ff', text: '#3b82f6', glow: '0 0 20px rgba(91,141,238,0.3)' },
        superior:{ bg: '#fef3c7', text: '#92400e', glow: '0 0 20px rgba(205,127,50,0.3)' },
        student: { bg: '#f3f4f6', text: '#374151', glow: 'none' }
    };
    const tc = tierColours[tier];

    modal.innerHTML = `
        <div style="
            background:white; border-radius:16px; padding:2.5rem; max-width:360px; width:90%;
            text-align:center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            border: 2px solid ${tier==='prodigy'?'#000':tier==='elite'?'#5b8dee':tier==='superior'?'#cd7f32':'#e9ecef'};
        ">
            <div style="
                width:72px;height:72px;background:linear-gradient(135deg,#4f46e5,#7c3aed);
                border-radius:50%;display:flex;align-items:center;justify-content:center;
                color:white;font-size:1.75rem;font-weight:700;margin:0 auto 1rem;
                box-shadow:${tc.glow};
            ">${userName.charAt(0).toUpperCase()}</div>

            <div style="font-family:'Crimson Text',serif;font-size:1.75rem;font-weight:700;color:#111827;margin-bottom:0.25rem;">
                ${userName}
                ${isVerified ? '<span style="color:#1d9bf0;font-size:1.25rem;margin-left:6px;" title="500k+ Miles Verified">✓</span>' : ''}
            </div>

            <div style="display:inline-flex;align-items:center;gap:0.5rem;background:${tc.bg};color:${tc.text};
                padding:0.375rem 1rem;border-radius:20px;font-size:0.8rem;font-weight:700;margin-bottom:1.25rem;">
                ${getTierLabel(rank || (leaderboardData.findIndex(u => u.user_id === userId) + 1))}
            </div>

            <div style="background:#f8f9fa;border-radius:10px;padding:1rem;margin-bottom:1.25rem;">
                <div style="font-size:0.75rem;color:#6b7280;margin-bottom:0.25rem;">Mastery Miles</div>
                <div style="font-size:1.75rem;font-weight:700;color:#111827;">
                    <img src="https://i.postimg.cc/pXSd21QN/Mastery-Miles-currency-removebg-preview.png" 
                         style="width:20px;height:20px;vertical-align:middle;margin-right:4px;">
                    ${Number(miles).toLocaleString()}
                </div>
            </div>

            <button onclick="document.getElementById('user-card-modal').remove()" style="
                width:100%;background:#000;color:white;border:none;padding:0.75rem;
                border-radius:8px;font-size:0.875rem;font-weight:600;cursor:pointer;
                font-family:'Inter',sans-serif;">Close</button>
        </div>
    `;

    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
}
window.showUserCard = showUserCard;
window.handleSteal = handleSteal;
window.handleRaid = handleRaid;
window.handleDonate = handleDonate;

// ─── Rival Finder ─────────────────────────────────────────
function scrollToRival() {
    if (!currentProfile?.last_steal_victim_id) {
        showToast('No rival found yet — steal from someone first!', '#6b7280');
        return;
    }
    const rivalItem = document.querySelector(`[data-user-id="${currentProfile.last_steal_victim_id}"]`);
    if (rivalItem) {
        rivalItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        rivalItem.style.outline = '2px solid #dc143c';
        setTimeout(() => rivalItem.style.outline = '', 2000);
    } else {
        showToast('Your rival is offline right now', '#6b7280');
    }
}
window.scrollToRival = scrollToRival;

// ─── Battle Feed ──────────────────────────────────────────
const battleFeedEntries = [];

async function renderBattleFeed() {
    const feed = document.getElementById('battle-feed-list');
    if (!feed) return;

    // Load recent transactions
    const { data } = await lb_sb
        .from('steal_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

    if (data) {
        feed.innerHTML = '';
        data.forEach(tx => {
            const entry = document.createElement('div');
            entry.style.cssText = `
                padding:0.625rem 0.875rem; border-bottom:1px solid #f3f4f6;
                font-size:0.75rem; color:#374151; line-height:1.4;
            `;
            const icon = tx.transaction_type === 'raid' ? '⚔️' : tx.success ? '🗡️' : '🛡️';
            const time = new Date(tx.created_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
            entry.innerHTML = `
                <span style="color:#9ca3af;margin-right:6px;">${time}</span>
                ${icon} <strong>${tx.attacker_name}</strong> 
                ${tx.success ? `stole <strong>${Number(tx.miles_stolen).toLocaleString()} miles</strong> from` : 'failed to steal from'}
                <strong>${tx.victim_name}</strong>
            `;
            feed.appendChild(entry);
        });
    }
}

function addBattleFeedEntry(tx) {
    const feed = document.getElementById('battle-feed-list');
    if (!feed) return;

    const entry = document.createElement('div');
    entry.style.cssText = `
        padding:0.625rem 0.875rem; border-bottom:1px solid #f3f4f6;
        font-size:0.75rem; color:#374151; line-height:1.4;
        background:#fffbeb; animation: fadeIn 0.3s ease;
    `;
    const icon = tx.transaction_type === 'raid' ? '⚔️' : tx.success ? '🗡️' : '🛡️';
    const time = new Date(tx.created_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    entry.innerHTML = `
        <span style="color:#9ca3af;margin-right:6px;">${time}</span>
        ${icon} <strong>${tx.attacker_name}</strong>
        ${tx.success ? `stole <strong>${Number(tx.miles_stolen).toLocaleString()} miles</strong> from` : 'failed to steal from'}
        <strong>${tx.victim_name}</strong>
    `;
    feed.prepend(entry);
    // Keep max 20 entries
    while (feed.children.length > 20) feed.lastChild.remove();
}

// ─── Prodigy decay (Glass Throne) ────────────────────────
function startProdigyDecay() {
    if (decayInterval) clearInterval(decayInterval);
    decayInterval = setInterval(async () => {
        if (!currentUser || !leaderboardData.length) return;
        const myRank = leaderboardData.findIndex(u => u.user_id === currentUser.id) + 1;
        if (myRank !== 1) return;

        const myEntry = leaderboardData.find(u => u.user_id === currentUser.id);
        if (!myEntry) return;

        // Check if user has been inactive (no updates in last hour)
        // For now we apply 0.5% decay per hour = check every 5 mins, apply 0.5%/12
        const decayRate = 0.005 / 12; // per 5 min check
        const newMiles = Math.floor(myEntry.mastery_miles * (1 - decayRate));
        if (newMiles < myEntry.mastery_miles) {
            await lb_sb.from('leaderboard_presence').update({ mastery_miles: newMiles }).eq('user_id', currentUser.id);
            await lb_sb.from('user_profiles').update({ mastery_miles: newMiles }).eq('id', currentUser.id);
            currentProfile.mastery_miles = newMiles;
            updateNavMiles(newMiles);
        }
    }, 5 * 60 * 1000); // every 5 minutes
}

// ─── Quote of the Day ─────────────────────────────────────
async function loadQuoteOfDay() {
    const box = document.getElementById('quote-of-day-box');
    if (!box) return;

    const today = new Date().toISOString().split('T')[0];
    const { data } = await lb_sb
        .from('quote_of_the_day')
        .select('*')
        .eq('quote_date', today)
        .order('vote_miles', { ascending: false })
        .limit(1)
        .single();

    if (data) {
        box.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
                <div style="flex:1;">
                    <div style="font-family:'Crimson Text',serif;font-size:1.375rem;color:#111827;line-height:1.4;margin-bottom:0.5rem;">
                        "${data.quote_text}"
                    </div>
                    <div style="font-size:0.8125rem;color:#6b7280;font-weight:500;">
                        — ${data.author_name} · <span style="color:${data.author_tier==='elite'?'#3b82f6':'#cd7f32'}">${data.author_tier==='elite'?'⚡ Elite':'🥉 Superior'}</span>
                    </div>
                </div>
                <button onclick="voteForQuote('${data.id}')" style="
                    background:#000;color:white;border:none;padding:0.5rem 1rem;
                    border-radius:8px;font-size:0.75rem;font-weight:600;cursor:pointer;
                    font-family:'Inter',sans-serif;white-space:nowrap;flex-shrink:0;">
                    ⭐ Boost (${Number(data.vote_miles).toLocaleString()} miles)
                </button>
            </div>
        `;
    } else {
        // Check if current user is elite/superior and can post
        const myRank = leaderboardData.findIndex(u => u.user_id === currentUser?.id) + 1;
        const myTier = getTier(myRank);
        if (myTier === 'elite' || myTier === 'superior') {
            box.innerHTML = `
                <div style="font-family:'Crimson Text',serif;font-size:1.1rem;color:#9ca3af;margin-bottom:0.75rem;">
                    No quote posted today. Share your wisdom...
                </div>
                <div style="display:flex;gap:0.75rem;">
                    <input id="quote-input" placeholder="Write your quote..." style="
                        flex:1;border:1px solid #e0e4e9;border-radius:8px;padding:0.625rem 0.875rem;
                        font-family:'Crimson Text',serif;font-size:1rem;color:#111827;outline:none;">
                    <button onclick="submitQuote()" style="
                        background:#000;color:white;border:none;padding:0.625rem 1.25rem;
                        border-radius:8px;font-size:0.875rem;font-weight:600;cursor:pointer;
                        font-family:'Inter',sans-serif;">Post</button>
                </div>
            `;
        } else {
            box.innerHTML = `<div style="font-family:'Crimson Text',serif;font-size:1.1rem;color:#9ca3af;text-align:center;">No quote of the day yet — check back soon.</div>`;
        }
    }
}

async function submitQuote() {
    const input = document.getElementById('quote-input');
    if (!input?.value.trim()) return;

    const myRank = leaderboardData.findIndex(u => u.user_id === currentUser?.id) + 1;
    const myTier = getTier(myRank);

    await lb_sb.from('quote_of_the_day').insert({
        author_id: currentUser.id,
        author_name: currentProfile.first_name,
        author_tier: myTier,
        quote_text: input.value.trim(),
        vote_miles: 0,
        quote_date: new Date().toISOString().split('T')[0]
    });

    showToast('Quote posted! Others can now boost it.', '#059669');
    await loadQuoteOfDay();
}
window.submitQuote = submitQuote;

async function voteForQuote(quoteId) {
    const costMiles = 100;
    const myEntry = leaderboardData.find(u => u.user_id === currentUser?.id);
    if (!myEntry || myEntry.mastery_miles < costMiles) {
        showToast('Not enough miles to boost this quote!', '#dc2626');
        return;
    }

    // Deduct from voter
    await lb_sb.from('leaderboard_presence').update({ mastery_miles: myEntry.mastery_miles - costMiles }).eq('user_id', currentUser.id);
    await lb_sb.from('user_profiles').update({ mastery_miles: myEntry.mastery_miles - costMiles }).eq('id', currentUser.id);

    // Add to quote vote_miles
    const { data: quote } = await lb_sb.from('quote_of_the_day').select('vote_miles,author_id').eq('id', quoteId).single();
    if (quote) {
        await lb_sb.from('quote_of_the_day').update({ vote_miles: quote.vote_miles + costMiles }).eq('id', quoteId);
        // Boost quote author on leaderboard
        const authorEntry = leaderboardData.find(u => u.user_id === quote.author_id);
        if (authorEntry) {
            await lb_sb.from('leaderboard_presence').update({ mastery_miles: authorEntry.mastery_miles + costMiles }).eq('user_id', quote.author_id);
            await lb_sb.from('user_profiles').update({ mastery_miles: authorEntry.mastery_miles + costMiles }).eq('id', quote.author_id);
        }
    }

    currentProfile.mastery_miles = myEntry.mastery_miles - costMiles;
    updateNavMiles(currentProfile.mastery_miles);
    showToast('⭐ Quote boosted!', '#059669');
    await Promise.all([loadQuoteOfDay(), fetchLeaderboard()]);
}
window.voteForQuote = voteForQuote;

// ─── Utility ──────────────────────────────────────────────
function showToast(message, color = '#111827') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position:fixed;bottom:80px;right:24px;z-index:99998;
        background:white;border:1px solid #e0e4e9;border-radius:10px;
        padding:0.875rem 1.25rem;font-size:0.875rem;font-weight:600;
        color:${color};box-shadow:0 4px 16px rgba(0,0,0,0.1);
        border-left:4px solid ${color};
        animation: slideUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function updateNavMiles(miles) {
    const badge = document.querySelector('.mastery-miles-badge span');
    if (badge) badge.textContent = Number(miles).toLocaleString();
}

// ─── Tab visibility (presence) ────────────────────────────
document.addEventListener('visibilitychange', async () => {
    if (document.hidden) {
        await upsertPresence(false);
    } else {
        await upsertPresence(true);
        await fetchLeaderboard();
    }
});

window.addEventListener('beforeunload', () => {
    // Best-effort sync on tab close
    if (currentUser) {
        navigator.sendBeacon &&
        navigator.sendBeacon(`${SUPABASE_URL}/rest/v1/leaderboard_presence?user_id=eq.${currentUser.id}`,
            JSON.stringify({ is_online: false }));
    }
});

// ─── INIT ─────────────────────────────────────────────────
async function initLeaderboard(user, profile) {
    currentUser = user;
    currentProfile = profile;

    await upsertPresence(true);
    await fetchLeaderboard();
    subscribeRealtime();
    startProdigyDecay();
    setInterval(pollNotifications, 8000); // poll every 8s
    await loadQuoteOfDay();
}

window.initLeaderboard = initLeaderboard;

// CSS animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
}
@keyframes slideDown {
    from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    to   { transform: translateX(-50%) translateY(0);     opacity: 1; }
}
@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}
.lb-tier-prodigy { transition: box-shadow 0.3s; }
.lb-tier-elite   { transition: box-shadow 0.3s; }
.lb-tier-superior { transition: box-shadow 0.3s; }
.lb-item:hover   { transform: translateX(2px); }
`;
document.head.appendChild(style);
