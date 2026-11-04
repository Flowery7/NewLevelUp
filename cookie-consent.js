/*!
 * Cookie consent banner — UK GDPR / PECR compliant
 * Level Up Scaffolding
 *
 * Features:
 *  - Equal-prominence "Accept all" / "Reject non-essential" buttons (ICO guidance)
 *  - Granular preferences (essential always on, analytics optional)
 *  - Consent record stored with timestamp, 180-day expiry
 *  - Re-openable via any element with class "ccb-settings" (e.g. footer link)
 *
 * Analytics integration:
 *  - Check window.__cookieConsent.analytics before loading trackers
 *  - Listen for the "cookie-consent-changed" event to react to updates
 */
(function () {
  var COOKIE_NAME = 'cookieConsent';
  var MAX_AGE = 60 * 60 * 24 * 180; // 180 days
  var VERSION = 1;

  /* ---------- Consent storage ---------- */

  function readConsent() {
    var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + COOKIE_NAME + '=([^;]*)'));
    if (!m) return null;
    try {
      var c = JSON.parse(decodeURIComponent(m[1]));
      if (c && c.v === VERSION && typeof c.analytics === 'boolean') return c;
    } catch (e) { /* invalid cookie — treat as no consent */ }
    return null;
  }

  function writeConsent(analytics) {
    var c = {
      v: VERSION,
      essential: true,
      analytics: !!analytics,
      ts: new Date().toISOString()
    };
    document.cookie = COOKIE_NAME + '=' + encodeURIComponent(JSON.stringify(c)) +
      '; max-age=' + MAX_AGE + '; path=/; SameSite=Lax';
    window.__cookieConsent = c;
    document.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: c }));
    return c;
  }

  window.__cookieConsent = readConsent();
  window.__setCookieConsent = writeConsent;

  /* ---------- Banner UI ---------- */

  var CSS = [
    '#ccb-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;display:none;padding:16px;background:linear-gradient(to top,rgba(31,36,41,.55),rgba(31,36,41,0));}',
    '#ccb-banner .ccb-card{max-width:640px;margin:0 auto;background:#1F2429;color:#fff;padding:24px 24px 20px;border-radius:16px 16px 0 0;box-shadow:0 -10px 40px rgba(0,0,0,.35);font-family:ui-sans-serif,system-ui,-apple-system,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;}',
    '#ccb-banner h2{margin:0 0 8px;font-size:1.05rem;font-weight:800;color:#fff;}',
    '#ccb-banner p{margin:0;font-size:.85rem;line-height:1.55;color:rgba(255,255,255,.85);}',
    '#ccb-banner a{color:#fff;text-decoration:underline;}',
    '#ccb-banner .ccb-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;}',
    '#ccb-banner .ccb-btn{flex:1 1 0;min-width:150px;padding:11px 18px;border-radius:999px;font-size:.9rem;font-weight:700;cursor:pointer;border:0;transition:opacity .2s,background .2s;}',
    '#ccb-banner .ccb-btn:hover{opacity:.9;}',
    '#ccb-banner .ccb-btn-accept{background:#D92D20;color:#fff;}',
    '#ccb-banner .ccb-btn-reject{background:#fff;color:#1F2429;}',
    '#ccb-banner .ccb-manage{display:block;margin:14px auto 0;background:none;border:0;color:rgba(255,255,255,.85);font-size:.85rem;font-weight:600;text-decoration:underline;cursor:pointer;padding:4px;}',
    '#ccb-banner .ccb-prefs{display:none;margin-top:16px;border-top:1px solid rgba(255,255,255,.15);padding-top:16px;}',
    '#ccb-banner .ccb-row{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:10px 0;cursor:pointer;}',
    '#ccb-banner .ccb-row + .ccb-row{border-top:1px solid rgba(255,255,255,.1);}',
    '#ccb-banner .ccb-row strong{display:block;font-size:.9rem;color:#fff;}',
    '#ccb-banner .ccb-row small{display:block;margin-top:2px;font-size:.78rem;line-height:1.45;color:rgba(255,255,255,.65);}',
    '#ccb-banner .ccb-row input[type=checkbox]{width:20px;height:20px;flex-shrink:0;margin-top:2px;accent-color:#D92D20;cursor:pointer;}',
    '#ccb-banner .ccb-row input[type=checkbox]:disabled{cursor:not-allowed;opacity:.6;}',
    '#ccb-banner .ccb-save{width:100%;margin-top:14px;}',
    '@media(max-width:480px){#ccb-banner .ccb-btn{min-width:100%;}'
  ].join('');

  var HTML = [
    '<div class="ccb-card" role="dialog" aria-modal="false" aria-labelledby="ccb-title" aria-describedby="ccb-text">',
    '  <h2 id="ccb-title">Cookies on levelupscaffolding.co.uk</h2>',
    '  <p id="ccb-text">We use essential cookies to make this site work. With your permission, we also use optional analytics cookies to understand how visitors use the site. You can accept all, reject non-essential cookies, or manage your preferences. See our <a href="privacy.html">Privacy &amp; Cookie Policy</a> for details.</p>',
    '  <div class="ccb-actions">',
    '    <button type="button" id="ccb-reject" class="ccb-btn ccb-btn-reject">Reject non-essential</button>',
    '    <button type="button" id="ccb-accept" class="ccb-btn ccb-btn-accept">Accept all</button>',
    '  </div>',
    '  <button type="button" id="ccb-manage" class="ccb-manage" aria-expanded="false" aria-controls="ccb-prefs">Manage preferences</button>',
    '  <div id="ccb-prefs" class="ccb-prefs">',
    '    <label class="ccb-row">',
    '      <span><strong>Essential cookies</strong><small>Required for the site to function — for example, remembering this choice. Always on.</small></span>',
    '      <input type="checkbox" checked disabled aria-label="Essential cookies (always enabled)">',
    '    </label>',
    '    <label class="ccb-row">',
    '      <span><strong>Analytics cookies</strong><small>Help us understand how visitors use the site so we can improve it. Optional.</small></span>',
    '      <input type="checkbox" id="ccb-analytics" aria-label="Analytics cookies">',
    '    </label>',
    '    <button type="button" id="ccb-save" class="ccb-btn ccb-btn-accept ccb-save">Save my choices</button>',
    '  </div>',
    '</div>'
  ].join('');

  function init() {
    if (document.getElementById('ccb-banner')) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'ccb-banner';
    banner.innerHTML = HTML;
    document.body.appendChild(banner);

    var prefs = document.getElementById('ccb-prefs');
    var analyticsToggle = document.getElementById('ccb-analytics');
    var manageBtn = document.getElementById('ccb-manage');

    function show(openPrefs) {
      banner.style.display = 'block';
      prefs.style.display = openPrefs ? 'block' : 'none';
      manageBtn.setAttribute('aria-expanded', openPrefs ? 'true' : 'false');
      document.getElementById(openPrefs ? 'ccb-save' : 'ccb-accept').focus();
    }
    function hide() { banner.style.display = 'none'; }

    document.getElementById('ccb-accept').addEventListener('click', function () { writeConsent(true); hide(); });
    document.getElementById('ccb-reject').addEventListener('click', function () { writeConsent(false); hide(); });
    document.getElementById('ccb-save').addEventListener('click', function () { writeConsent(analyticsToggle.checked); hide(); });
    manageBtn.addEventListener('click', function () {
      var open = prefs.style.display === 'none' || prefs.style.display === '';
      prefs.style.display = open ? 'block' : 'none';
      manageBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) analyticsToggle.focus();
    });

    // Footer / any "Cookie settings" links reopen the banner
    document.addEventListener('click', function (e) {
      var el = e.target && e.target.closest ? e.target.closest('.ccb-settings') : null;
      if (el) { e.preventDefault(); show(true); }
    });

    // Show the banner only when we have no valid consent record
    if (!window.__cookieConsent) show(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
