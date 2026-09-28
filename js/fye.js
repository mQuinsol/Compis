export function initFye() {
    const page = document.querySelector('.fye-main');
    if (!page) return;

    // =============================================
    // LIGHTBOX — referencias y abrir / cerrar
    // =============================================
    const lightbox = document.getElementById('pdfLightbox');
    const pdfImg   = document.getElementById('pdfImg');
    const pdfClose = document.getElementById('pdfClose');
    const pdfPrev  = document.getElementById('pdfPrev');
    const pdfNext  = document.getElementById('pdfNext');
    const hasLightbox = Boolean(lightbox && pdfImg);

    let lightboxImages = [];
    let currentLightboxIndex = 0;

    const openLightbox = (src, alt) => {
        if (!hasLightbox) return;
        pdfImg.src = src;
        pdfImg.alt = alt;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!hasLightbox || !lightbox.classList.contains('is-open')) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        pdfImg.src = '';
        currentLightboxIndex = 0;
        lightboxImages = [];
    };

    const showLightboxImage = (index) => {
        if (!lightboxImages.length) return;
        currentLightboxIndex = (index + lightboxImages.length) % lightboxImages.length;
        const img = lightboxImages[currentLightboxIndex];
        pdfImg.src = img.src;
        pdfImg.alt = img.alt;
    };

    if (hasLightbox) {
        pdfClose?.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
        pdfPrev?.addEventListener('click', () => showLightboxImage(currentLightboxIndex - 1));
        pdfNext?.addEventListener('click', () => showLightboxImage(currentLightboxIndex + 1));
    }

    // =============================================
    // CARRUSEL — genérico, uno por tipo de fiesta
    // =============================================
    const carousels = {}; // { tipo: { pause, resume } }

    function initCarrusel(trackId, dotsId) {
        const track = document.getElementById(trackId);
        const dotsContainer = document.getElementById(dotsId);
        if (!track || !dotsContainer) return null;

        const slides = track.querySelectorAll('.fye-carousel__slide');
        const imgs = Array.from(track.querySelectorAll('.fye-carousel__slide img'));

        // Carga todas las imágenes del carrusel al abrir su acordeón
        const loadImages = () => {
            imgs.forEach(img => { img.loading = 'eager'; });
        };

        // Lightbox — con navegación prev/next
        if (hasLightbox) {
            imgs.forEach((img, i) => {
                img.addEventListener('click', () => {
                    lightboxImages = imgs;
                    currentLightboxIndex = i;
                    openLightbox(img.src, img.alt);
                });
            });
        }

        // Una sola imagen: sin dots ni autoplay
        if (slides.length <= 1) {
            return { pause: () => {}, resume: loadImages };
        }

        let current = 0;

        // Dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
            if (i === 0) dot.classList.add('is-active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const goTo = (index) => {
            current = (index + slides.length) % slides.length;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
        };

        const carouselWrap = track.closest('.fye-accordion__carousel');

        // Autoplay controlado desde fuera (acordeón) + pausa al hacer hover
        let autoplay = null;
        const startAutoplay = () => {
            if (autoplay) return;
            autoplay = setInterval(() => goTo(current + 1), 4000);
        };
        const stopAutoplay = () => {
            clearInterval(autoplay);
            autoplay = null;
        };

        carouselWrap?.addEventListener('mouseenter', stopAutoplay);
        carouselWrap?.addEventListener('mouseleave', startAutoplay);

        // Swipe táctil
        let startX = 0;
        track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
        });

        return {
            pause: stopAutoplay,
            resume: () => {
                loadImages();
                startAutoplay();
            }
        };
    }

    ['tematica', 'nocturna', 'pijama', 'monitor'].forEach(tipo => {
        const instance = initCarrusel(`${tipo}Track`, `${tipo}Dots`);
        if (instance) carousels[tipo] = instance;
    });

    // =============================================
    // ACORDEÓN — abrir / cerrar tarjetas
    // =============================================
    const fyeTriggers = document.querySelectorAll('.fye-accordion__trigger');

    fyeTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';

            fyeTriggers.forEach(t => {
                t.setAttribute('aria-expanded', 'false');
                t.nextElementSibling.classList.remove('is-open');
                const tipo = t.closest('.fye-accordion__item').dataset.tipo;
                carousels[tipo]?.pause();
            });

            if (!isOpen) {
                trigger.setAttribute('aria-expanded', 'true');
                trigger.nextElementSibling.classList.add('is-open');
                const tipo = trigger.closest('.fye-accordion__item').dataset.tipo;
                carousels[tipo]?.resume();
            }
        });
    });

    // Temáticas abierto por defecto
    const tematica = document.querySelector('.fye-accordion__item[data-tipo="tematica"]');
    if (tematica) {
        tematica.querySelector('.fye-accordion__trigger').setAttribute('aria-expanded', 'true');
        tematica.querySelector('.fye-accordion__body').classList.add('is-open');
        carousels['tematica']?.resume();
    }
}