const GTM_ID = 'GTM-NBCR3F98';
const CONSENT_KEY = 'cookieConsent';

function injectGTM() {
  if (window.gtmLoaded) return;
  window.gtmLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}

export function initAnalytics() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { dataLayer.push(arguments); };

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied'
  });

  if (localStorage.getItem(CONSENT_KEY) === 'accepted') {
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    injectGTM();
  }
}

export function grantAnalyticsConsent() {
  localStorage.setItem(CONSENT_KEY, 'accepted');
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  injectGTM();
}

export function denyAnalyticsConsent() {
  localStorage.setItem(CONSENT_KEY, 'denied');
}