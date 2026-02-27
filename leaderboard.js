// ============================================================
// leaderboard.js — Full Battle Leaderboard System v2
// GCSE Mastery Platform
// ============================================================

const LB_SUPABASE_URL = 'https://bdoesoqpjhpxkwsjauwo.supabase.co';
const LB_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkb2Vzb3FwamhweGt3c2phdXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODUzODIsImV4cCI6MjA4MTA2MTM4Mn0.R2fgp-wqasPtn86gVcoM2RPpSMc-66_77F6VX-DzG-s';

const lb_sb = window.sbClient || window.supabase.createClient(LB_SUPABASE_URL, LB_SUPABASE_ANON_KEY);

// ─── State ────────────────────────────────────────────────
let currentUser = null;
let currentProfile = null;
let leaderboardData = [];
let presenceChannel = null;
let battleFeedChannel = null;
let decayInterval = null;
let heartbeatInterval = null;
let stealCooldownEnd = null;
let cooldownTimerInterval = null;

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
    if (tier === 'prodigy')  return 'border: 2px solid #000; box-shadow: 0 0 12px 3px rgba(0,0,0,0.55), 0 0 24px 6px rgba(80,80,80,0.25);';
    if (tier === 'elite')    return 'border: 2px solid #5b8dee; box-shadow: 0 0 10px 2px rgba(91,141,238,0.5), 0 0 20px 4px rgba(160,200,255,0.2);';
    if (tier === 'superior') return 'border: 2px solid #cd7f32; box-shadow: 0 0 8px 2px rgba(205,127,50,0.4);';
    return 'border: 1px solid #e9ecef;';
}

// ─── Steal cooldown ───────────────────────────────────────
function isOnCooldown() {
    if (!stealCooldownEnd) return false;
    return Date.now() < stealCooldownEnd;
}

function setCooldown() {
    stealCooldownEnd = Date.now() + 60000;
    localStorage.setItem('stealCooldownEnd', stealCooldownEnd);
    startCooldownTimer();
}

function loadCooldown() {
    const saved = localStorage.getItem('stealCooldownEnd');
    if (saved && Date.now() < parseInt(saved)) {
        stealCooldownEnd = parseInt(saved);
        startCooldownTimer();
    }
}

function startCooldownTimer() {
    if (cooldownTimerInterval) clearInterval(cooldownTimerInterval);
    updateCooldownDisplay();
    cooldownTimerInterval = setInterval(() => {
        updateCooldownDisplay();
        if (!isOnCooldown()) {
            clearInterval(cooldownTimerInterval);
            updateCooldownDisplay();
        }
    }, 1000);
}

function updateCooldownDisplay() {
    const display = document.getElementById('steal-cooldown-timer');
    if (!display) return;
    if (!isOnCooldown()) {
        display.style.display = 'none';
        return;
    }
    const secondsLeft = Math.ceil((stealCooldownEnd - Date.now()) / 1000);
    display.style.display = 'inline-flex';
    display.textContent = `⏱ ${secondsLeft}s`;
}

// ─── Presence ─────────────────────────────────────────────
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

// ─── Heartbeat ────────────────────────────────────────────
function startHeartbeat() {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(async () => {
        if (!currentUser || document.hidden) return;
        await lb_sb.from('leaderboard_presence').update({
            is_online: true,
            last_seen: new Date().toISOString()
        }).eq('user_id', currentUser.id);
    }, 30000);
}

function stopHeartbeat() {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
}

// ─── Fetch leaderboard ────────────────────────────────────
async function fetchLeaderboard() {
    const { data, error } = await lb_sb
        .from('leaderboard_presence')
        .select('*')
        .order('mastery_miles', { ascending: false })
        .limit(130);

    if (error) { console.error('LB fetch error', error); return; }
    leaderboardData = data || [];
    renderLeaderboard();
    renderBattleFeed();
}

// ─── Realtime ─────────────────────────────────────────────
function subscribeRealtime() {
    if (presenceChannel) lb_sb.removeChannel(presenceChannel);

    presenceChannel = lb_sb
        .channel('leaderboard-presence')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard_presence' },
            () => fetchLeaderboard())
        .subscribe();

    battleFeedChannel = lb_sb
        .channel('steal-transactions')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'steal_transactions' },
            (payload) => {
                addBattleFeedEntry(payload.new);
                if (payload.new.victim_id === currentUser?.id) {
                    showStealNotification(payload.new);
                }
            })
        .subscribe();
}

// ─── Render leaderboard ───────────────────────────────────
function renderLeaderboard() {
    const container = document.getElementById('lb-list');
    if (!container) return;

    const myId = currentUser?.id;
    const myRankIndex = leaderboardData.findIndex(u => u.user_id === myId);
    const myRank = myRankIndex + 1;

    // Update welcome box
    const welcomeRank = document.getElementById('welcome-rank');
    if (welcomeRank) welcomeRank.textContent = myRank > 0 ? `#${myRank}` : '#—';

    const myEntry = leaderboardData.find(u => u.user_id === myId);
    if (myEntry) {
        const welcomeMiles = document.getElementById('welcome-miles');
        if (welcomeMiles) welcomeMiles.textContent = Number(myEntry.mastery_miles).toLocaleString();
        const milesBadge = document.querySelector('.mastery-miles-badge span');
        if (milesBadge) milesBadge.textContent = Number(myEntry.mastery_miles).toLocaleString();
    }

    container.innerHTML = '';

    if (leaderboardData.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:2rem;color:#9ca3af;font-size:0.875rem;">No users yet</div>';
        return;
    }

    leaderboardData.forEach((user, idx) => {
        const rank = idx + 1;
        const tier = getTier(rank);
        const isMe = user.user_id === myId;
        const myTierName = getTier(myRank);
        const isVerified = user.mastery_miles >= 500000;
        const rankColour = tier === 'prodigy' ? '#000' : tier === 'elite' ? '#5b8dee' : tier === 'superior' ? '#cd7f32' : '#9ca3af';

        const item = document.createElement('div');
        item.className = `lb-item lb-tier-${tier}`;
        item.dataset.userId = user.user_id;
        item.dataset.rank = rank;
        item.setAttribute('style', `
            position:relative;border-radius:10px;margin-bottom:0.5rem;
            background:${isMe ? '#f0f9ff' : '#fff'};
            transition:all 0.2s;${getTierBorderStyle(rank)}overflow:hidden;
        `);

        item.innerHTML = `
            <div style="width:100%;">
                <div style="display:flex;align-items:center;justify-content:space-between;padding:0.875rem 1rem;cursor:default;">
                    <div style="display:flex;align-items:center;gap:0.875rem;flex:1;min-width:0;">
                        <span style="font-size:0.8rem;font-weight:700;color:${rankColour};min-width:28px;">#${rank}</span>
                        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;
                            background:${user.is_online ? '#22c55e' : '#d1d5db'};flex-shrink:0;"></span>
                        <span style="font-size:0.875rem;font-weight:600;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            ${user.user_name}
                            ${isVerified ? '<span title="500k+ Miles Verified" style="color:#1d9bf0;font-size:0.875rem;margin-left:4px;">✓</span>' : ''}
                            ${isMe ? '<span style="font-size:0.7rem;background:#e0f2fe;color:#0284c7;padding:1px 6px;border-radius:4px;margin-left:6px;">You</span>' : ''}
                        </span>
                        <span style="font-size:0.7rem;font-weight:600;padding:2px 8px;border-radius:20px;white-space:nowrap;flex-shrink:0;
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
                        ${!isMe ? `<span class="lb-arrow" style="
                            font-size:0.75rem;color:#6b7280;cursor:pointer;
                            transition:transform 0.2s;display:inline-block;
                            padding:4px 8px;border-radius:6px;
                            background:#f3f4f6;user-select:none;">▼</span>` : ''}
                    </div>
                </div>
                <div class="lb-dropdown" style="
                    display:none;border-top:1px solid #f3f4f6;
                    padding:0.5rem 1rem;background:#fafafa;
                    border-radius:0 0 10px 10px;">
                    ${buildDropdownButtons(user, rank, tier, myTierName, isMe, myId)}
                </div>
            </div>
        `;

        const arrow = item.querySelector('.lb-arrow');
        if (arrow) {
            arrow.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isMe) return;
                const dd = item.querySelector('.lb-dropdown');
                if (!dd) return;
                const isOpen = dd.style.display === 'block';
                closeAllDropdowns();
                dd.style.display = isOpen ? 'none' : 'block';
                arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            });
        }

        container.appendChild(item);
    });
}

function buildDropdownButtons(user, rank, tier, myTier, isMe, myId) {
    if (isMe) return '';
    const myRank = leaderboardData.findIndex(u => u.user_id === myId) + 1;
    const myTierName = getTier(myRank);
    let html = '';

    const canSteal = myTierName !== 'prodigy';
    const targetIsProdigy = tier === 'prodigy';

    if (canSteal) {
        if (targetIsProdigy && myTierName === 'elite') {
            html += ddBtn('⚔️ Raid the Prodigy', '#7c3aed', `handleRaid('${user.user_id}','${user.user_name}',${user.mastery_miles})`);
        } else {
            html += ddBtn('🗡️ Steal Miles', '#dc143c', `handleSteal('${user.user_id}','${user.user_name}',${user.mastery_miles})`);
        }
    }

    if (myTierName === 'student' && tier === 'elite') {
        html += ddBtn('🤝 Donate Miles', '#059669', `handleDonate('${user.user_id}','${user.user_name}')`);
    }

    html += ddBtn('👤 View Profile', '#374151', `showUserCard('${user.user_id}','${user.user_name}',${user.mastery_miles},${rank})`);
    return html;
}

function ddBtn(label, color, onclick) {
    return `<button onclick="${onclick}" style="
        display:block;width:100%;text-align:left;padding:0.625rem 0.875rem;
        background:transparent;border:none;cursor:pointer;font-size:0.8125rem;
        font-weight:600;color:${color};font-family:'Inter',sans-serif;
        border-radius:6px;margin-bottom:2px;transition:background 0.15s;"
        onmouseover="this.style.background='#f0f0f0'"
        onmouseout="this.style.background='transparent'">${label}</button>`;
}

function closeAllDropdowns() {
    document.querySelectorAll('.lb-dropdown').forEach(d => d.style.display = 'none');
    document.querySelectorAll('.lb-arrow').forEach(a => a.style.transform = 'rotate(0deg)');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.lb-item') && !e.target.closest('.lb-dropdown')) {
        closeAllDropdowns();
    }
});

// ─── Update miles in both tables ─────────────────────────
async function updateMiles(userId, newMiles) {
    const safeVal = Math.max(0, newMiles);
    await lb_sb.from('leaderboard_presence').update({ mastery_miles: safeVal }).eq('user_id', userId);
    await lb_sb.from('user_profiles').update({ mastery_miles: safeVal }).eq('id', userId);
}

// ─── STEAL ────────────────────────────────────────────────
async function handleSteal(victimId, victimName, victimMiles) {
    closeAllDropdowns();
    if (!currentUser) return;

    if (isOnCooldown()) {
        const secs = Math.ceil((stealCooldownEnd - Date.now()) / 1000);
        showToast(`⏱ Cooldown active — ${secs}s remaining`, '#f59e0b');
        return;
    }

    const myEntry = leaderboardData.find(u => u.user_id === currentUser.id);
    const myMiles = myEntry?.mastery_miles || 0;
    const myRank = leaderboardData.findIndex(u => u.user_id === currentUser.id) + 1;
    const myTier = getTier(myRank);
    const victimRank = leaderboardData.findIndex(u => u.user_id === victimId) + 1;
    const victimTier = getTier(victimRank);

    if (myTier === 'prodigy') {
        showToast('👑 The Prodigy cannot steal — defend your throne!', '#6b7280');
        return;
    }

    const milesStolen = Math.min(5000, victimMiles);

    let success = true;
    if (myTier === 'elite' && victimTier === 'prodigy') {
        success = Math.random() < 0.65;
    }

    if (success) {
        await updateMiles(currentUser.id, myMiles + milesStolen);
        await updateMiles(victimId, victimMiles - milesStolen);

        await lb_sb.from('steal_transactions').insert({
            attacker_id: currentUser.id,
            attacker_name: currentProfile.first_name,
            victim_id: victimId,
            victim_name: victimName,
            miles_stolen: milesStolen,
            success: true,
            transaction_type: 'steal'
        });

        await lb_sb.from('notifications').insert({
            recipient_id: victimId,
            sender_id: currentUser.id,
            sender_name: currentProfile.first_name,
            type: 'steal_alert',
            message: `${currentProfile.first_name} stole ${milesStolen.toLocaleString()} Mastery Miles from you!`,
            miles_involved: milesStolen
        });

        await lb_sb.from('user_profiles').update({
            last_steal_victim_id: victimId,
            last_steal_victim_name: victimName
        }).eq('id', currentUser.id);

        currentProfile.mastery_miles = myMiles + milesStolen;
        setCooldown();
        showToast(`✅ Stole ${milesStolen.toLocaleString()} miles from ${victimName}!`, '#059669');
        updateNavMiles(currentProfile.mastery_miles);
        await fetchLeaderboard();
    } else {
        showToast(`❌ Steal attempt on ${victimName} failed!`, '#dc2626');
        await lb_sb.from('steal_transactions').insert({
            attacker_id: currentUser.id,
            attacker_name: currentProfile.first_name,
            victim_id: victimId,
            victim_name: victimName,
            miles_stolen: 0,
            success: false,
            transaction_type: 'steal'
        });
        setCooldown();
    }
}

// ─── RAID ─────────────────────────────────────────────────
async function handleRaid(victimId, victimName, victimMiles) {
    closeAllDropdowns();
    if (isOnCooldown()) {
        const secs = Math.ceil((stealCooldownEnd - Date.now()) / 1000);
        showToast(`⏱ Cooldown active — ${secs}s remaining`, '#f59e0b');
        return;
    }

    const myEntry = leaderboardData.find(u => u.user_id === currentUser?.id);
    const myMiles = myEntry?.mastery_miles || 0;
    const raidSteal = Math.min(10000, victimMiles);
    const success = Math.random() < 0.65;

    if (success) {
        await updateMiles(currentUser.id, myMiles + raidSteal);
        await updateMiles(victimId, victimMiles - raidSteal);

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
            message: `⚔️ ${currentProfile.first_name} RAIDED you! They took ${raidSteal.toLocaleString()} miles!`,
            miles_involved: raidSteal
        });

        currentProfile.mastery_miles = myMiles + raidSteal;
        setCooldown();
        showToast(`⚔️ RAID SUCCESS! Stole ${raidSteal.toLocaleString()} miles!`, '#7c3aed');
        updateNavMiles(currentProfile.mastery_miles);
        await fetchLeaderboard();
    } else {
        setCooldown();
        showToast(`❌ Raid failed. The Prodigy defended!`, '#dc2626');
    }
}

// ─── DONATE ───────────────────────────────────────────────
const donationTracker = {};

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

    await updateMiles(currentUser.id, myMiles - donationAmount);
    await updateMiles(eliteId, eliteMiles + donationAmount);

    if (!donationTracker[eliteId]) donationTracker[eliteId] = [];
    const now = Date.now();
    donationTracker[eliteId] = donationTracker[eliteId].filter(d => now - d.timestamp < 60000);
    donationTracker[eliteId].push({ studentId: currentUser.id, timestamp: now });

    const uniqueDonors = new Set(donationTracker[eliteId].map(d => d.studentId));
    if (uniqueDonors.size >= 3) {
        triggerRevolution(eliteId, eliteName);
        donationTracker[eliteId] = [];
    }

    currentProfile.mastery_miles = myMiles - donationAmount;
    showToast(`🤝 Donated ${donationAmount} miles to ${eliteName}!`, '#059669');
    updateNavMiles(currentProfile.mastery_miles);
    await fetchLeaderboard();
}

// ─── REVOLUTION ───────────────────────────────────────────
async function triggerRevolution(eliteId, eliteName) {
    const eliteEntry = leaderboardData.find(u => u.user_id === eliteId);
    const eliteMiles = eliteEntry?.mastery_miles || 0;
    await updateMiles(eliteId, eliteMiles + 25000);

    await lb_sb.from('notifications').insert({
        recipient_id: eliteId,
        sender_id: currentUser.id,
        sender_name: 'The People',
        type: 'revolution',
        message: `🔥 REVOLUTION! 3 Students rallied behind you. +25,000 mile boost!`,
        miles_involved: 25000
    });

    const banner = document.createElement('div');
    banner.style.cssText = `position:fixed;top:80px;left:50%;transform:translateX(-50%);
        background:linear-gradient(135deg,#7c3aed,#dc2626);color:white;
        padding:1rem 2rem;border-radius:12px;z-index:99999;font-weight:700;
        font-size:1rem;text-align:center;box-shadow:0 8px 32px rgba(124,58,237,0.4);`;
    banner.textContent = `🔥 REVOLUTION! The people have spoken — ${eliteName} surges forward!`;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 5000);
    await fetchLeaderboard();
}

// ─── Notifications ────────────────────────────────────────
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
        await lb_sb.from('notifications').update({ is_read: true })
            .eq('recipient_id', currentUser.id).eq('is_read', false);
    }
}

function showStealNotification(notification) {
    const existing = document.getElementById('steal-notif-' + notification.id);
    if (existing) return;

    const notif = document.createElement('div');
    notif.id = 'steal-notif-' + notification.id;
    notif.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:99999;
        background:white;border:1px solid #e0e4e9;border-radius:12px;
        padding:1.25rem 1.5rem;max-width:340px;
        box-shadow:0 8px 32px rgba(0,0,0,0.15);border-left:4px solid #dc143c;`;

    const myMiles = leaderboardData.find(u => u.user_id === currentUser?.id)?.mastery_miles || 0;
    const hasEnough = myMiles >= 5000;
    const attackerId = notification.sender_id;
    const notifId = 'steal-notif-' + notification.id;

    notif.innerHTML = `
        <div style="font-size:0.875rem;font-weight:700;color:#111827;margin-bottom:0.5rem;">
            ⚔️ ${notification.message}
        </div>
        <div style="font-size:0.75rem;color:#6b7280;margin-bottom:0.875rem;">Want revenge?</div>
        <div style="display:flex;gap:0.5rem;">
            ${hasEnough
                ? `<button onclick="retaliate('${attackerId}','${notification.sender_name}',${notification.miles_involved},'${notifId}')" style="
                    flex:1;background:#dc143c;color:white;border:none;padding:0.5rem;
                    border-radius:7px;font-size:0.75rem;font-weight:700;cursor:pointer;
                    font-family:'Inter',sans-serif;">Steal Their Miles</button>`
                : `<button onclick="showUserCard('${attackerId}','${notification.sender_name}',0,0)" style="
                    flex:1;background:#111827;color:white;border:none;padding:0.5rem;
                    border-radius:7px;font-size:0.75rem;font-weight:700;cursor:pointer;
                    font-family:'Inter',sans-serif;">Show User Card</button>`
            }
            <button onclick="document.getElementById('${notifId}')?.remove()" style="
                background:#f3f4f6;color:#374151;border:none;padding:0.5rem 0.75rem;
                border-radius:7px;font-size:0.75rem;font-weight:600;cursor:pointer;
                font-family:'Inter',sans-serif;">Dismiss</button>
        </div>`;

    document.body.appendChild(notif);
    setTimeout(() => notif?.remove(), 12000);
}

async function retaliate(attackerId, attackerName, milesInvolved, notifId) {
    document.getElementById(notifId)?.remove();
    const attackerEntry = leaderboardData.find(u => u.user_id === attackerId);
    if (attackerEntry) {
        await handleSteal(attackerId, attackerName, attackerEntry.mastery_miles);
    }
}
window.retaliate = retaliate;

// ─── User Card ────────────────────────────────────────────
function showUserCard(userId, userName, miles, rank) {
    closeAllDropdowns();
    document.getElementById('user-card-modal')?.remove();

    const actualRank = rank || (leaderboardData.findIndex(u => u.user_id === userId) + 1);
    const tier = getTier(actualRank);
    const isVerified = miles >= 500000;
    const borderColour = tier==='prodigy'?'#000':tier==='elite'?'#5b8dee':tier==='superior'?'#cd7f32':'#e9ecef';

    const modal = document.createElement('div');
    modal.id = 'user-card-modal';
    modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.7);z-index:100000;
        display:flex;align-items:center;justify-content:center;`;

    modal.innerHTML = `
        <div style="background:white;border-radius:16px;padding:2.5rem;max-width:360px;width:90%;
            text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);border:2px solid ${borderColour};">
            <div style="width:72px;height:72px;background:linear-gradient(135deg,#4f46e5,#7c3aed);
                border-radius:50%;display:flex;align-items:center;justify-content:center;
                color:white;font-size:1.75rem;font-weight:700;margin:0 auto 1rem;">
                ${userName.charAt(0).toUpperCase()}
            </div>
            <div style="font-family:'Crimson Text',serif;font-size:1.75rem;font-weight:700;
                color:#111827;margin-bottom:0.25rem;">
                ${userName}
                ${isVerified ? '<span style="color:#1d9bf0;font-size:1.25rem;margin-left:6px;">✓</span>' : ''}
            </div>
            <div style="display:inline-flex;align-items:center;gap:0.5rem;margin-bottom:1.25rem;
                background:${tier==='prodigy'?'#000':tier==='elite'?'#eff6ff':tier==='superior'?'#fef3c7':'#f3f4f6'};
                color:${tier==='prodigy'?'#fff':tier==='elite'?'#3b82f6':tier==='superior'?'#92400e':'#6b7280'};
                padding:0.375rem 1rem;border-radius:20px;font-size:0.8rem;font-weight:700;">
                ${getTierLabel(actualRank)}
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
        </div>`;

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
        showToast('No rival yet — steal from someone first!', '#6b7280');
        return;
    }
    const rivalItem = document.querySelector(`[data-user-id="${currentProfile.last_steal_victim_id}"]`);
    if (rivalItem) {
        rivalItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        rivalItem.style.outline = '2px solid #dc143c';
        setTimeout(() => rivalItem.style.outline = '', 2000);
    } else {
        showToast('Your rival is not on the leaderboard', '#6b7280');
    }
}
window.scrollToRival = scrollToRival;

// ─── Battle Feed ──────────────────────────────────────────
async function renderBattleFeed() {
    const feed = document.getElementById('battle-feed-list');
    if (!feed) return;

    const { data } = await lb_sb
        .from('steal_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

    if (data && data.length > 0) {
        feed.innerHTML = '';
        data.forEach(tx => feed.appendChild(buildFeedEntry(tx)));
    }
}

function buildFeedEntry(tx) {
    const entry = document.createElement('div');
    entry.style.cssText = `padding:0.625rem 0.875rem;border-bottom:1px solid #f3f4f6;
        font-size:0.75rem;color:#374151;line-height:1.4;`;
    const icon = tx.transaction_type === 'raid' ? '⚔️' : tx.success ? '🗡️' : '🛡️';
    const time = new Date(tx.created_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    entry.innerHTML = `<span style="color:#9ca3af;margin-right:6px;">${time}</span>
        ${icon} <strong>${tx.attacker_name}</strong>
        ${tx.success ? `stole <strong>${Number(tx.miles_stolen).toLocaleString()} miles</strong> from` : 'failed to steal from'}
        <strong>${tx.victim_name}</strong>`;
    return entry;
}

function addBattleFeedEntry(tx) {
    const feed = document.getElementById('battle-feed-list');
    if (!feed) return;
    const entry = buildFeedEntry(tx);
    entry.style.background = '#fffbeb';
    feed.prepend(entry);
    while (feed.children.length > 20) feed.lastChild.remove();
}

// ─── Prodigy decay ────────────────────────────────────────
function startProdigyDecay() {
    if (decayInterval) clearInterval(decayInterval);
    decayInterval = setInterval(async () => {
        if (!currentUser || !leaderboardData.length) return;
        if (!document.hidden) return;
        const myRank = leaderboardData.findIndex(u => u.user_id === currentUser.id) + 1;
        if (myRank !== 1) return;

        const myEntry = leaderboardData.find(u => u.user_id === currentUser.id);
        if (!myEntry) return;

        const newMiles = Math.floor(myEntry.mastery_miles * (1 - 0.005 / 12));
        if (newMiles < myEntry.mastery_miles) {
            await updateMiles(currentUser.id, newMiles);
            currentProfile.mastery_miles = newMiles;
            updateNavMiles(newMiles);
        }
    }, 5 * 60 * 1000);
}

// ─── Quote of the Day (2-hour rotation) ──────────────────
let quoteTimerInterval = null;

async function loadQuoteOfDay() {
    const box = document.getElementById('quote-of-day-box');
    if (!box) return;

    const { data: quotes } = await lb_sb
        .from('quote_of_the_day')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    const now = new Date();
    const activeQuote = quotes && quotes[0] &&
        (now - new Date(quotes[0].created_at)) < 2 * 60 * 60 * 1000
        ? quotes[0] : null;

    if (activeQuote) {
        const expiresAt = new Date(new Date(activeQuote.created_at).getTime() + 2 * 60 * 60 * 1000);
        renderActiveQuote(activeQuote, expiresAt);
    } else {
        renderQuoteSubmitForm();
    }
}

function renderActiveQuote(quote, expiresAt) {
    const box = document.getElementById('quote-of-day-box');
    if (!box) return;

    box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap;">
            <div style="flex:1;min-width:200px;">
                <div style="font-family:'Crimson Text',serif;font-size:1.375rem;color:#111827;
                    line-height:1.4;margin-bottom:0.5rem;">"${quote.quote_text}"</div>
                <div style="font-size:0.8125rem;color:#6b7280;font-weight:500;">
                    — ${quote.author_name} ·
                    <span style="color:${quote.author_tier==='elite'?'#3b82f6':quote.author_tier==='prodigy'?'#000':'#cd7f32'}">
                        ${quote.author_tier==='elite'?'⚡ Elite':quote.author_tier==='prodigy'?'👑 Prodigy':'🥉 Superior'}
                    </span>
                    · <img src="https://i.postimg.cc/pXSd21QN/Mastery-Miles-currency-removebg-preview.png"
                        style="width:12px;height:12px;vertical-align:middle;">
                    <strong>${Number(quote.vote_miles).toLocaleString()}</strong> miles boosted
                </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem;flex-shrink:0;">
                <button onclick="voteForQuote('${quote.id}')" style="
                    background:#000;color:white;border:none;padding:0.5rem 1rem;
                    border-radius:8px;font-size:0.75rem;font-weight:600;cursor:pointer;
                    font-family:'Inter',sans-serif;white-space:nowrap;">⭐ Boost (100 miles)</button>
                <div id="quote-timer" style="font-size:0.75rem;color:#9ca3af;text-align:right;">
                    Calculating...
                </div>
            </div>
        </div>`;

    if (quoteTimerInterval) clearInterval(quoteTimerInterval);
    quoteTimerInterval = setInterval(() => {
        const timerEl = document.getElementById('quote-timer');
        if (!timerEl) { clearInterval(quoteTimerInterval); return; }
        const remaining = expiresAt - new Date();
        if (remaining <= 0) {
            clearInterval(quoteTimerInterval);
            loadQuoteOfDay();
            return;
        }
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        timerEl.textContent = `Next quote in: ${mins}m ${secs}s`;
    }, 1000);
}

function renderQuoteSubmitForm() {
    const box = document.getElementById('quote-of-day-box');
    if (!box) return;

    box.innerHTML = `
        <div style="font-family:'Crimson Text',serif;font-size:1.1rem;color:#9ca3af;margin-bottom:0.75rem;">
            No active quote — be the first to share your wisdom for the next 2 hours...
        </div>
        <div style="display:flex;gap:0.75rem;">
            <input id="quote-input" placeholder="Write your quote..." maxlength="200" style="
                flex:1;border:1px solid #e0e4e9;border-radius:8px;
                padding:0.625rem 0.875rem;font-family:'Crimson Text',serif;
                font-size:1rem;color:#111827;outline:none;">
            <button onclick="submitQuote()" style="
                background:#000;color:white;border:none;padding:0.625rem 1.25rem;
                border-radius:8px;font-size:0.875rem;font-weight:600;cursor:pointer;
                font-family:'Inter',sans-serif;white-space:nowrap;">Post Quote</button>
        </div>`;
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

    showToast('✍️ Quote posted! Live for 2 hours.', '#059669');
    await loadQuoteOfDay();
}
window.submitQuote = submitQuote;

async function voteForQuote(quoteId) {
    const costMiles = 100;
    const myEntry = leaderboardData.find(u => u.user_id === currentUser?.id);
    if (!myEntry || myEntry.mastery_miles < costMiles) {
        showToast('Not enough miles to boost!', '#dc2626');
        return;
    }

    await updateMiles(currentUser.id, myEntry.mastery_miles - costMiles);

    const { data: quote } = await lb_sb
        .from('quote_of_the_day').select('vote_miles,author_id').eq('id', quoteId).single();

    if (quote) {
        await lb_sb.from('quote_of_the_day')
            .update({ vote_miles: quote.vote_miles + costMiles }).eq('id', quoteId);
        const authorEntry = leaderboardData.find(u => u.user_id === quote.author_id);
        if (authorEntry) {
            await updateMiles(quote.author_id, authorEntry.mastery_miles + costMiles);
        }
    }

    currentProfile.mastery_miles = myEntry.mastery_miles - costMiles;
    updateNavMiles(currentProfile.mastery_miles);
    showToast('⭐ Quote boosted! +100 miles to author.', '#059669');
    await Promise.all([loadQuoteOfDay(), fetchLeaderboard()]);
}
window.voteForQuote = voteForQuote;

// ─── Utility ──────────────────────────────────────────────
function showToast(message, color = '#111827') {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:80px;right:24px;z-index:99998;
        background:white;border:1px solid #e0e4e9;border-radius:10px;
        padding:0.875rem 1.25rem;font-size:0.875rem;font-weight:600;
        color:${color};box-shadow:0 4px 16px rgba(0,0,0,0.1);
        border-left:4px solid ${color};`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function updateNavMiles(miles) {
    const badge = document.querySelector('.mastery-miles-badge span');
    if (badge) badge.textContent = Number(miles).toLocaleString();
    const welcomeMiles = document.getElementById('welcome-miles');
    if (welcomeMiles) welcomeMiles.textContent = Number(miles).toLocaleString();
}

// ─── Tab visibility ───────────────────────────────────────
document.addEventListener('visibilitychange', async () => {
    if (document.hidden) {
        stopHeartbeat();
        await upsertPresence(false);
    } else {
        await upsertPresence(true);
        startHeartbeat();
        await fetchLeaderboard();
    }
});

window.addEventListener('beforeunload', () => {
    stopHeartbeat();
    if (!currentUser) return;
    const url = `${LB_SUPABASE_URL}/rest/v1/leaderboard_presence?user_id=eq.${currentUser.id}`;
    const data = JSON.stringify({ is_online: false, last_seen: new Date().toISOString() });
    navigator.sendBeacon(url + '&apikey=' + LB_SUPABASE_ANON_KEY, new Blob([data], { type: 'application/json' }));
});

window.addEventListener('pagehide', () => {
    stopHeartbeat();
    if (!currentUser) return;
    const url = `${LB_SUPABASE_URL}/rest/v1/leaderboard_presence?user_id=eq.${currentUser.id}`;
    const data = JSON.stringify({ is_online: false, last_seen: new Date().toISOString() });
    navigator.sendBeacon(url + '&apikey=' + LB_SUPABASE_ANON_KEY, new Blob([data], { type: 'application/json' }));
});

// ─── INIT ─────────────────────────────────────────────────
async function initLeaderboard(user, profile) {
    currentUser = user;
    currentProfile = profile;

    loadCooldown();
    await upsertPresence(true);
    startHeartbeat();
    await fetchLeaderboard();
    subscribeRealtime();
    startProdigyDecay();
    setInterval(pollNotifications, 8000);
    await loadQuoteOfDay();
    setInterval(loadQuoteOfDay, 2 * 60 * 1000);
}

window.initLeaderboard = initLeaderboard;

// ─── CSS ──────────────────────────────────────────────────
const lbStyle = document.createElement('style');
lbStyle.textContent = `
.lb-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
#steal-cooldown-timer {
    font-size: 0.7rem; font-weight: 700; color: #f59e0b;
    background: #fef3c7; border: 1px solid #fbbf24;
    padding: 2px 8px; border-radius: 6px; margin-left: 8px;
    display: none;
}
`;
document.head.appendChild(lbStyle);
