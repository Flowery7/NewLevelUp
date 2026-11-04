/*!
 * Google Analytics (gtag.js) — consent-gated loader + event tracking
 * Level Up Scaffolding
 *
 * MUST be included AFTER cookie-consent.js on every page.
 *
 * Compliance:
 *  - Google Analytics only loads if the visitor has given analytics consent
 *    (UK GDPR / PECR requirement).
 *  - Events fired before consent are queued and flushed once consent is
 *    granted; if consent is never given, nothing is ever sent.
 *
 * Usage:
 *  - Automatic: phone taps, WhatsApp clicks, email clicks, external links
 *  - Manual:    window.trackEvent('category', 'action', { label: 'x', value: 1 })
 */
(function () {
  var GA_ID = 'G-MXBZLCZYKY';

  var loaded = false;
  var queue = [];

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;

    gtag('js', new Date());
    gtag('config', GA_ID);

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    // Flush any events queued before consent was granted
    queue.splice(0).forEach(function (args) { gtag.apply(null, args); });
  }

  /**
   * Track an event. Safe to call at any time — before consent it queues,
   * after consent it sends immediately, without consent it's dropped.
   */
  window.trackEvent = function (category, action, params) {
    var args = ['event', action, Object.assign({ event_category: category }, params || {})];
    if (loaded) {
      gtag.apply(null, args);
    } else {
      queue.push(args);
    }
  };

  if (window.__cookieConsent && window.__cookieConsent.analytics) {
    loadAnalytics();
  } else {
    document.addEventListener('cookie-consent-changed', function (e) {
      if (e.detail && e.detail.analytics) loadAnalytics();
    });
  }

  /* ---------- Automatic click tracking ---------- */

  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('a, button') : null;
    if (!el) return;

    var href = el.getAttribute('href') || '';

    // Phone taps
    if (href.indexOf('tel:') === 0) {
      window.trackEvent('contact', 'phone_call', { label: href.replace('tel:', '') });
      return;
    }
    // WhatsApp clicks
    if (href.indexOf('https://wa.me/') === 0) {
      window.trackEvent('contact', 'whatsapp_click', { label: href });
      return;
    }
    // Email clicks
    if (href.indexOf('mailto:') === 0) {
      window.trackEvent('contact', 'email_click', { label: href.replace('mailto:', '') });
      return;
    }
    // Quote form CTAs (buttons/links pointing at #quote)
    if (href.indexOf('#quote') !== -1 || href.indexOf('index.html#quote') !== -1) {
      window.trackEvent('engagement', 'quote_cta_click', { label: el.textContent.trim().slice(0, 60) });
      return;
    }
    // External links (social profiles, GA opt-out, etc.)
    if (href.indexOf('http') === 0 && el.hostname && el.hostname !== location.hostname) {
      window.trackEvent('engagement', 'external_link', { label: href });
    }
  }, { passive: true });
})();
