export function initExcursiones() {
    const excursiones = document.querySelector('.exc-hero');
    if (!excursiones) return;

    // =============================================
    // VARIABLES LIGHTBOX
    // =============================================
    const lightbox  = document.getElementById('pdfLightbox');
    const pdfImg    = document.getElementById('pdfImg');
    const pdfClose  = document.getElementById('pdfClose');
    const pdfPrev   = document.getElementById('pdfPrev');
    const pdfNext   = document.getElementById('pdfNext');
    let currentLightboxIndex = 0;
    let lightboxImages = [];

    if (!lightbox) return;

    const openLightbox = (src, alt) => {
        pdfImg.src = src;
        pdfImg.alt = alt;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        pdfImg.src = '';
        currentLightboxIndex = 0;
        lightboxImages = [];
    };

    pdfClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

    pdfPrev?.addEventListener('click', () => {
        if (!lightboxImages.length) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        pdfImg.src = lightboxImages[currentLightboxIndex].src;
    });

    pdfNext?.addEventListener('click', () => {
        if (!lightboxImages.length) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
        pdfImg.src = lightboxImages[currentLightboxIndex].src;
    });

    const expImgs = Array.from(document.querySelectorAll('.exc-experiences__card img'));
    expImgs.forEach((img, i) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImages = expImgs;
            currentLightboxIndex = i;
            openLightbox(img.src, img.alt);
        });
    });
}