/* trial-popup.js
   Shared "here's what you get" popup, shown once per browser session for a
   non-Pro student (trial or expired). Closing it, or clicking through to
   Subscribe, marks it dismissed for the rest of that session (sessionStorage)
   so it won't pop back up just from navigating to pricing.html and back —
   it shows again on the next genuinely new visit. Every "buy" CTA routes to
   /pricing.html. Included on dashboard.html and alevel/dashboard.html via
   <script src="trial-popup.js"></script> — call window.showTrialPopup({status, trialEndDate}).

   TO EDIT LATER:
   - Swap in the real product visual: replace assets/trial-popup-visual.gif
     with your actual GIF (keep the same filename), or change POPUP_GIF_SRC below.
   - Add more pages to TRIAL_PAGES to make the trial popup multi-page — a
     "Next" button + dots appear automatically once there's more than one.
*/

(function () {
    const POPUP_GIF_SRC = '/assets/trial-popup-visual.gif'; // <-- drop your real GIF here
    const PRICING_URL = '/pricing.html';

    // Shown while the 3-day trial is still running. Add more objects here
    // for extra pages — a Next button + dots will appear automatically.
    const TRIAL_PAGES = [
        {
            heading: "Welcome back — here's what's included",
            bullets: [
                'Interactive lectures with instant AI marking, in every subject',
                'Flashtiles: spaced-repetition practice that adapts to you',
                'Real past papers with instant, detailed analytics',
                'Live quizzes, leaderboard &amp; Mastery Miles'
            ]
        }
    ];

    // Shown once the 3-day trial has ended (always a single page).
    const EXPIRED_PAGE = {
        heading: 'Your 3-day trial has ended',
        bullets: [
            'Lectures stay free for you, always — no change there',
            'Subscribing unlocks Flashtiles, past papers, live quizzes &amp; the leaderboard',
            'Cancel anytime, and 99p covers your entire first month'
        ]
    };

    function formatCountdown(msLeft) {
        if (msLeft <= 0) return '0m left';
        const totalMinutes = Math.floor(msLeft / 60000);
        const d = Math.floor(totalMinutes / (60 * 24));
        const h = Math.floor((totalMinutes % (60 * 24)) / 60);
        const m = totalMinutes % 60;
        if (d > 0) return `${d}d ${h}h ${m}m left`;
        if (h > 0) return `${h}h ${m}m left`;
        return `${m}m left`;
    }

    function injectStyles() {
        if (document.getElementById('trial-popup-styles')) return;
        const style = document.createElement('style');
        style.id = 'trial-popup-styles';
        style.textContent = `
            #trial-popup-overlay {
                position: fixed; inset: 0; z-index: 3000;
                background: rgba(10, 12, 20, 0.6);
                display: flex; align-items: center; justify-content: center;
                padding: 2rem;
                animation: tp-fade-in 0.18s ease;
            }
            @keyframes tp-fade-in { from { opacity: 0; } to { opacity: 1; } }
            #trial-popup-modal {
                width: 80vw; height: 80vh;
                max-width: 1100px; max-height: 680px;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                display: grid;
                grid-template-columns: 1fr 1fr;
                box-shadow: 0 24px 60px rgba(0,0,0,0.35);
                position: relative;
                font-family: 'Inter', sans-serif;
            }
            #trial-popup-close {
                position: absolute; top: 1rem; right: 1rem; z-index: 5;
                width: 32px; height: 32px; border-radius: 50%;
                background: rgba(0,0,0,0.06); border: none;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; font-size: 1rem; color: #6b7280;
                transition: background 0.15s ease;
            }
            #trial-popup-close:hover { background: rgba(0,0,0,0.12); }
            .tp-left {
                padding: 2.75rem 3rem;
                display: flex; flex-direction: column;
                justify-content: space-between;
                overflow-y: auto;
            }
            .tp-heading {
                font-family: 'Crimson Text', serif;
                font-size: 1.85rem; font-weight: 700; color: #0f172a;
                margin-bottom: 1.5rem; line-height: 1.2;
            }
            .tp-bullets { list-style: none; padding: 0; margin: 0 0 2rem 0; }
            .tp-bullets li {
                display: flex; align-items: flex-start; gap: 0.75rem;
                font-size: 0.95rem; color: #374151; margin-bottom: 1rem;
                line-height: 1.4;
            }
            .tp-bullets li::before {
                content: '✓'; color: #1d7fe2; font-weight: 700;
                flex-shrink: 0; margin-top: 0.1rem;
            }
            .tp-cta-primary {
                width: 100%; background: linear-gradient(135deg, #1d7fe2 0%, #1a5fb8 100%);
                color: white; border: none; padding: 0.95rem 1.5rem;
                border-radius: 10px; font-size: 0.95rem; font-weight: 700;
                cursor: pointer; font-family: 'Inter', sans-serif;
                box-shadow: 0 4px 14px rgba(29, 127, 226, 0.3);
                transition: transform 0.12s ease;
                margin-bottom: 1rem;
            }
            .tp-cta-primary:active { transform: scale(0.98); }
            .tp-footer-row {
                display: flex; align-items: center; justify-content: space-between;
            }
            .tp-dots { display: flex; gap: 0.4rem; }
            .tp-dot {
                width: 7px; height: 7px; border-radius: 50%;
                background: #d1d5db; transition: all 0.15s ease;
            }
            .tp-dot.active { background: #1d7fe2; width: 18px; border-radius: 4px; }
            .tp-nav-btn {
                background: #0f172a; color: white; border: none;
                padding: 0.7rem 1.4rem; border-radius: 8px;
                font-size: 0.85rem; font-weight: 700; cursor: pointer;
                font-family: 'Inter', sans-serif; margin-left: auto;
                transition: transform 0.12s ease;
            }
            .tp-nav-btn:active { transform: scale(0.97); }
            .tp-right {
                position: relative; background: #0f172a;
                overflow: hidden;
            }
            .tp-right img {
                width: 100%; height: 100%; object-fit: cover; display: block;
            }
            .tp-right-fallback {
                width: 100%; height: 100%;
                background: linear-gradient(135deg, #1d7fe2 0%, #0f172a 100%);
                display: flex; align-items: center; justify-content: center;
                color: rgba(255,255,255,0.85); font-size: 0.85rem;
                text-align: center; padding: 2rem;
            }
            .tp-countdown {
                position: absolute; bottom: 1.25rem; right: 1.25rem;
                background: rgba(0,0,0,0.6);
                color: #ffffff;
                padding: 0.6rem 1rem;
                border-radius: 10px;
                font-size: 0.8rem; font-weight: 700;
                display: flex; align-items: center; gap: 0.5rem;
                letter-spacing: 0.01em;
                white-space: nowrap;
            }
            .tp-countdown::before { content: '⏳'; }
            @media (max-width: 760px) {
                #trial-popup-modal {
                    width: 92vw; height: 88vh;
                    grid-template-columns: 1fr;
                    grid-template-rows: 34% 66%;
                }
                .tp-right { order: -1; }
                .tp-left { padding: 1.5rem 1.5rem 1.25rem; }
                .tp-heading { font-size: 1.4rem; }
            }
        `;
        document.head.appendChild(style);
    }

    function hasBeenDismissedThisSession() {
        try {
            return sessionStorage.getItem('montura_trial_popup_dismissed') === '1';
        } catch (e) {
            return false; // if storage is blocked, fail open and just show it
        }
    }

    function markDismissedThisSession() {
        try {
            sessionStorage.setItem('montura_trial_popup_dismissed', '1');
        } catch (e) { /* storage blocked — nothing to persist, not fatal */ }
    }

    window.showTrialPopup = function (opts) {
        opts = opts || {};
        const status = opts.status === 'trial' ? 'trial' : 'expired';
        const trialEndDate = opts.trialEndDate;

        // Only once per browser session — closing it (or clicking through to
        // pricing) shouldn't bring it right back on the next page.
        if (hasBeenDismissedThisSession()) return;

        // Never stack two copies
        if (document.getElementById('trial-popup-overlay')) return;

        injectStyles();

        const pages = status === 'trial' ? TRIAL_PAGES : [EXPIRED_PAGE];
        const totalPages = pages.length;
        let currentPage = 0;
        let countdownInterval = null;

        const overlay = document.createElement('div');
        overlay.id = 'trial-popup-overlay';
        overlay.innerHTML = `
            <div id="trial-popup-modal">
                <button id="trial-popup-close" aria-label="Close">✕</button>
                <div class="tp-left" id="trial-popup-left"></div>
                <div class="tp-right">
                    <img src="${POPUP_GIF_SRC}" alt="Montura Learn preview"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="tp-right-fallback" style="display:none;">Add your product GIF at ${POPUP_GIF_SRC}</div>
                    ${status === 'trial' ? `<div class="tp-countdown" id="trial-popup-countdown">calculating…</div>` : ''}
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        function closePopup() {
            markDismissedThisSession();
            if (countdownInterval) clearInterval(countdownInterval);
            overlay.remove();
        }

        function renderLeft() {
            const page = pages[currentPage];
            const isLastPage = currentPage === totalPages - 1;
            const navLabel = status === 'expired' ? 'Learn for free' : (isLastPage ? 'Start Learning' : 'Next');
            const dotsHtml = totalPages > 1
                ? `<div class="tp-dots">${pages.map((_, i) => `<div class="tp-dot${i === currentPage ? ' active' : ''}"></div>`).join('')}</div>`
                : `<div></div>`;

            const left = document.getElementById('trial-popup-left');
            left.innerHTML = `
                <div>
                    <div class="tp-heading">${page.heading}</div>
                    <ul class="tp-bullets">${page.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
                </div>
                <div>
                    <button class="tp-cta-primary" id="trial-popup-subscribe">Subscribe to Montura Pro</button>
                    <div class="tp-footer-row">
                        ${dotsHtml}
                        <button class="tp-nav-btn" id="trial-popup-nav">${navLabel}</button>
                    </div>
                </div>
            `;

            document.getElementById('trial-popup-subscribe').onclick = function () {
                markDismissedThisSession();
                window.location.href = PRICING_URL;
            };
            document.getElementById('trial-popup-nav').onclick = function () {
                if (status !== 'expired' && !isLastPage) {
                    currentPage++;
                    renderLeft();
                } else {
                    closePopup();
                }
            };
        }

        document.getElementById('trial-popup-close').onclick = closePopup;
        renderLeft();

        if (status === 'trial' && trialEndDate) {
            const trialEnd = new Date(trialEndDate).getTime();
            const countdownEl = document.getElementById('trial-popup-countdown');
            function tick() {
                if (!countdownEl) return;
                const msLeft = trialEnd - Date.now();
                countdownEl.textContent = formatCountdown(msLeft);
                if (msLeft <= 0) clearInterval(countdownInterval);
            }
            tick();
            countdownInterval = setInterval(tick, 30000);
        }
    };
})();
