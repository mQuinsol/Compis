import { grantAnalyticsConsent, denyAnalyticsConsent } from './analytics.js';

export function initCookieBanner() {
    const banner = document.querySelector('#cookieBanner');
    const accept = document.querySelector('#cookieAccept');
    const reject = document.querySelector('#cookieReject');
    const waFloat = document.querySelector('.whatsapp-float, #waToggle');

    if (!banner || !accept || !reject) return;

    function showBanner() {
        banner.classList.remove('hidden');
        waFloat?.classList.add('is-hidden-by-banner');
    }

    function hideBanner() {
        banner.classList.add('hidden');
        waFloat?.classList.remove('is-hidden-by-banner');
    }

    if (!localStorage.getItem('cookieConsent')) {
        showBanner();
    }

    accept.addEventListener('click', () => {
        grantAnalyticsConsent();
        hideBanner();
    });

    reject.addEventListener('click', () => {
        denyAnalyticsConsent();
        hideBanner();
    });
}