/* Montura Learn — desktop "draw on your phone" pairing widget.
   Include supabase-js before this file, then call:
     MonturaPhonePair.init({ lectureSlug: 'slug', getQnum: function () { return currentQuestionIndex; } });
   Pairing is account-based (no QR/camera): the phone and desktop both know the
   signed-in student's id and find each other on a Supabase Realtime channel
   named after it — see iphone/pairing.html for the other side of this handshake. */
(function () {
  var SUPABASE_URL = 'https://bdoesoqpjhpxkwsjauwo.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkb2Vzb3FwamhweGt3c2phdXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODUzODIsImV4cCI6MjA4MTA2MTM4Mn0.R2fgp-wqasPtn86gVcoM2RPpSMc-66_77F6VX-DzG-s';

  var CSS = ''
    + '.mp-trigger-btn{position:fixed;top:9px;left:24px;width:36px;height:36px;border-radius:50%;border:1px solid #e5e7eb;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:101;box-shadow:0 1px 2px rgba(0,0,0,0.05);padding:0;transition:border-color 150ms ease,transform 100ms ease;}'
    + '.mp-trigger-btn:hover{border-color:#1d7fe2;}'
    + '.mp-trigger-btn:active{transform:scale(0.93);}'
    + '.mp-trigger-btn svg{width:18px;height:18px;stroke:#1d7fe2;}'
    + '#mp-overlay{position:fixed;inset:0;z-index:999999;display:none;align-items:center;justify-content:center;background:rgba(10,10,15,0.35);backdrop-filter:blur(18px) saturate(120%);-webkit-backdrop-filter:blur(18px) saturate(120%);opacity:0;transition:opacity 300ms ease;padding:24px;}'
    + '#mp-overlay.open{display:flex;opacity:1;}'
    + '#mp-card{position:relative;width:100%;max-width:400px;background:#fff;border-radius:20px;padding:32px 28px 28px;box-shadow:0 20px 60px rgba(0,0,0,0.25);font-family:Inter,system-ui,sans-serif;text-align:center;}'
    + '#mp-close-btn{position:absolute;top:14px;right:14px;width:28px;height:28px;border-radius:50%;border:none;background:#f3f4f6;color:#6b7280;font-size:16px;line-height:28px;cursor:pointer;}'
    + '.mp-step{display:none;flex-direction:column;align-items:center;gap:14px;}'
    + '.mp-icon-circle{width:64px;height:64px;border-radius:50%;background:#eff6ff;display:flex;align-items:center;justify-content:center;}'
    + '.mp-icon-circle svg{width:30px;height:30px;stroke:#1d7fe2;}'
    + '.mp-icon-circle.mp-ok{background:#ecfdf5;}'
    + '.mp-icon-circle.mp-ok svg{stroke:#10b981;}'
    + '.mp-spinner{width:18px;height:18px;border-radius:50%;border:2.5px solid #dbeafe;border-top-color:#1d7fe2;animation:mpSpin 0.7s linear infinite;}'
    + '@keyframes mpSpin{to{transform:rotate(360deg);}}'
    + '#mp-card h2{margin:0;font-size:17px;font-weight:700;color:#111827;}'
    + '#mp-card p{margin:0;font-size:13.5px;color:#6b7280;line-height:1.5;}'
    + '.mp-status-row{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:#1d7fe2;}'
    + '.mp-guide-list{width:100%;display:flex;flex-direction:column;gap:10px;text-align:left;}'
    + '.mp-guide-item{display:flex;gap:12px;align-items:flex-start;background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:12px 14px;}'
    + '.mp-guide-num{flex:0 0 auto;width:22px;height:22px;border-radius:50%;background:#1d7fe2;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;}'
    + '.mp-guide-item span{font-size:13.5px;color:#111827;font-weight:500;}'
    + '#mp-done-btn{margin-top:4px;width:100%;height:46px;border:none;border-radius:12px;background:#1d7fe2;color:#fff;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;}'
    + '#mp-done-btn:active{opacity:0.85;}';

  var DEFAULT_TRIGGER_MARKUP = ''
    + '<button class="mp-trigger-btn" id="mp-trigger-btn" aria-label="Draw on your phone">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>'
    + '</button>';

  var MARKUP = ''
    + '<div id="mp-overlay">'
    + '<div id="mp-card">'
    + '<button id="mp-close-btn" aria-label="Close">&times;</button>'
    + '<div class="mp-step" id="mp-step-open">'
    + '<div class="mp-icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>'
    + '<h2>Open the Montura Learn app</h2>'
    + '<p>Open the app on your iPhone and sign in — this box will move on by itself once you do.</p>'
    + '<div class="mp-status-row"><span class="mp-spinner" id="mp-open-spinner"></span><span id="mp-open-status">Waiting for your phone&hellip;</span></div>'
    + '</div>'
    + '<div class="mp-step" id="mp-step-accept">'
    + '<div class="mp-icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg></div>'
    + '<h2>Check your phone</h2>'
    + '<p>Tap <b>Accept</b> on your phone, then turn it sideways to landscape.</p>'
    + '<div class="mp-status-row"><span class="mp-spinner"></span><span>Waiting for your phone&hellip;</span></div>'
    + '</div>'
    + '<div class="mp-step" id="mp-step-guide">'
    + '<div class="mp-icon-circle mp-ok"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg></div>'
    + '<h2>You\'re connected</h2>'
    + '<div class="mp-guide-list">'
    + '<div class="mp-guide-item"><span class="mp-guide-num">1</span><span>Draw your working out on your phone — it appears here automatically.</span></div>'
    + '<div class="mp-guide-item"><span class="mp-guide-num">2</span><span>Tap Submit on your phone when you\'re happy with your answer.</span></div>'
    + '</div>'
    + '<button id="mp-done-btn">Got it</button>'
    + '</div>'
    + '</div>'
    + '</div>';

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function injectMarkup() {
    var host = document.createElement('div');
    host.innerHTML = MARKUP;
    while (host.firstChild) document.body.appendChild(host.firstChild);
  }

  function init(opts) {
    opts = opts || {};
    var lectureSlug = opts.lectureSlug || '';
    var getQnum = opts.getQnum || function () { return 1; };

    injectStyles();
    injectMarkup();

    var triggerBtn = opts.triggerId ? document.getElementById(opts.triggerId) : null;
    if (triggerBtn) {
      triggerBtn.onclick = null; // clear any placeholder onclick= stub already on the element
    } else {
      var host = document.createElement('div');
      host.innerHTML = DEFAULT_TRIGGER_MARKUP;
      triggerBtn = host.firstChild;
      document.body.appendChild(triggerBtn);
    }

    var overlay = document.getElementById('mp-overlay');
    var closeBtn = document.getElementById('mp-close-btn');
    var doneBtn = document.getElementById('mp-done-btn');
    var stepOpen = document.getElementById('mp-step-open');
    var stepAccept = document.getElementById('mp-step-accept');
    var stepGuide = document.getElementById('mp-step-guide');
    var openStatus = document.getElementById('mp-open-status');

    var sb = null;
    var channel = null;

    function showStep(el) {
      [stepOpen, stepAccept, stepGuide].forEach(function (s) { s.style.display = 'none'; });
      el.style.display = 'flex';
    }

    function teardownChannel() {
      if (channel && sb) {
        sb.removeChannel(channel);
        channel = null;
      }
    }

    async function openModal() {
      overlay.classList.add('open');
      showStep(stepOpen);
      openStatus.textContent = 'Checking you’re signed in…';

      if (!window.supabase) {
        openStatus.textContent = 'Something went wrong loading — please reload the page.';
        return;
      }

      if (!sb) sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      var sessionResult = await sb.auth.getSession();
      var session = sessionResult.data && sessionResult.data.session;

      if (!session) {
        openStatus.textContent = 'Sign in to monturalearn.co.uk on this browser first, then try again.';
        return;
      }

      openStatus.textContent = 'Waiting for your phone…';

      var studentId = session.user.id;
      channel = sb.channel('montura-pair-' + studentId);

      channel.on('broadcast', { event: 'phone_opened' }, function () {
        channel.send({
          type: 'broadcast',
          event: 'pair_ack',
          payload: { lectureSlug: lectureSlug, qnum: getQnum() }
        });
        showStep(stepAccept);
      });

      channel.on('broadcast', { event: 'phone_ready' }, function () {
        showStep(stepGuide);
      });

      channel.subscribe();
    }

    function closeModal() {
      overlay.classList.remove('open');
      teardownChannel();
    }

    triggerBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    doneBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  window.MonturaPhonePair = { init: init };
})();
