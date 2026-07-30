import { initNavbar } from './navbar.js';
import { initAssistant } from './assistant.js';
import { initContact } from './contact.js';
import { initGallery } from './gallery.js';
import { initReview } from './review.js';
import { initServices } from './services.js';
import { initFooterHours } from './footer.js';
import { initBackToTop } from './back-to-top.js';
initNavbar();
initAssistant();
initContact();
initGallery();
initReview();
initFooterHours();
initServices();
initBackToTop();

const banner = document.getElementById('cookieBanner');
const accept = document.getElementById('cookieAccept');
const reject = document.getElementById('cookieReject');

// if (!localStorage.getItem('cookieConsent')) {
//     banner.classList.remove('hidden');
// }

// accept.addEventListener('click', () => {
//     localStorage.setItem('cookieConsent', 'accepted');
//     banner.classList.add('hidden');
// });

// reject.addEventListener('click', () => {
//     localStorage.setItem('cookieConsent', 'rejected');
//     banner.classList.add('hidden');
// });

