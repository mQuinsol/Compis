export function initCampamentos() {
    const campamento = document.querySelector('.camp-hero');
    if (!campamento) return;

    // =============================================
    // VARIABLES COMPARTIDAS
    // =============================================
    const lightbox  = document.getElementById('pdfLightbox');
    const pdfImg    = document.getElementById('pdfImg');
    const pdfClose  = document.getElementById('pdfClose');
    const pdfPrev   = document.getElementById('pdfPrev');
    const pdfNext   = document.getElementById('pdfNext');
    let currentLightboxIndex = 0;
    let lightboxImages = [];

    // =============================================
    // LIGHTBOX — abrir / cerrar
    // =============================================
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

    // Navegación prev / next (solo activa cuando hay lightboxImages)
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

    // =============================================
    // ACORDEÓN — abrir / cerrar tarjetas
    // =============================================
    const triggers = document.querySelectorAll('.camp-accordion__trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';
            triggers.forEach(t => {
                t.setAttribute('aria-expanded', 'false');
                t.nextElementSibling.classList.remove('is-open');
            });
            if (!isOpen) {
                trigger.setAttribute('aria-expanded', 'true');
                trigger.nextElementSibling.classList.add('is-open');
            }
        });
    });

    // Verano abierto por defecto
    const verano = document.querySelector('.camp-accordion__item[data-camp="verano"]');
    if (verano) {
        verano.querySelector('.camp-accordion__trigger').setAttribute('aria-expanded', 'true');
        verano.querySelector('.camp-accordion__body').classList.add('is-open');
    }

    // Botones "Descuentos" — abren bono en lightbox (sin navegación prev/next)
    document.querySelectorAll('.camp-accordion__cta').forEach(btn => {
        btn.addEventListener('click', () => {
            const imgSrc = btn.dataset.img;
            if (imgSrc) {
                lightboxImages = [];
                openLightbox(imgSrc, btn.closest('.camp-accordion__item')
                    .querySelector('.camp-accordion__name').textContent);
            }
        });
    });

    // Imágenes del acordeón — abren en lightbox (sin navegación prev/next)
    document.querySelectorAll('.camp-accordion__img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImages = [];
            openLightbox(img.src, img.alt);
        });
    });
    // =============================================
    // GALERÍA HERO — carrusel scroll-snap
    // =============================================
    const heroTrack = document.querySelector('.camp-hero__track');
    const heroDotsContainer = document.querySelector('.camp-hero__dots');

    if (heroTrack && heroDotsContainer) {
        const heroSlides = heroTrack.querySelectorAll('.camp-hero__slide');

        heroSlides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('camp-hero__dot');
            if (i === 0) dot.classList.add('is-active');
            dot.addEventListener('click', () => {
                heroSlides[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            });
            heroDotsContainer.appendChild(dot);
        });

        const heroDots = heroDotsContainer.querySelectorAll('.camp-hero__dot');

        heroTrack.addEventListener('scroll', () => {
            const slideWidth = heroSlides[0].offsetWidth + 12;
            const index = Math.round(heroTrack.scrollLeft / slideWidth);
            heroDots.forEach((d, i) => d.classList.toggle('is-active', i === index));
        });

        // Autoplay
        const HERO_CAROUSEL_DELAY = 3000;
        let heroCarouselTimer;

        const startHeroAutoplay = () => {
            clearInterval(heroCarouselTimer);
            heroCarouselTimer = setInterval(() => {
                const slideWidth = heroSlides[0].offsetWidth + 12;
                const maxScroll = heroTrack.scrollWidth - heroTrack.clientWidth;
                const nextScroll = heroTrack.scrollLeft + slideWidth;
                heroTrack.scrollTo({
                    left: nextScroll >= maxScroll ? 0 : nextScroll,
                    behavior: 'smooth'
                });
            }, HERO_CAROUSEL_DELAY);
        };

        const stopHeroAutoplay = () => clearInterval(heroCarouselTimer);

        heroTrack.addEventListener('pointerdown', stopHeroAutoplay);
        heroTrack.addEventListener('pointerup', () => setTimeout(startHeroAutoplay, 1000));

        startHeroAutoplay();

        // Lightbox — con navegación prev/next (reutiliza pdfLightbox)
        const heroImgs = Array.from(heroTrack.querySelectorAll('.camp-hero__slide img'));
        heroImgs.forEach((img, i) => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                lightboxImages = heroImgs;
                currentLightboxIndex = i;
                openLightbox(img.src, img.alt);
            });
        });
    }

    // =============================================
    // CARRUSEL DSC — fotos días sin cole
    // =============================================
    const track         = document.getElementById('dscTrack');
    const dotsContainer = document.getElementById('dscDots');

    if (!track) return;

    const slides = track.querySelectorAll('.dsc__carousel-slide');
    if (slides.length <= 1) return;

    let current = 0;

    // Dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
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

    document.querySelector('.dsc__carousel-btn--prev')?.addEventListener('click', () => goTo(current - 1));
    document.querySelector('.dsc__carousel-btn--next')?.addEventListener('click', () => goTo(current + 1));

    // Autoplay
    let autoplay = setInterval(() => goTo(current + 1), 4000);
    track.closest('.dsc__carousel').addEventListener('mouseenter', () => clearInterval(autoplay));
    track.closest('.dsc__carousel').addEventListener('mouseleave', () => {
        autoplay = setInterval(() => goTo(current + 1), 4000);
    });

    // Swipe táctil
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    });

    // Lightbox carrusel DSC — con navegación prev/next
    const dscImgs = Array.from(track.querySelectorAll('.dsc__carousel-slide img'));
    dscImgs.forEach((img, i) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImages = dscImgs;
            currentLightboxIndex = i;
            openLightbox(img.src, img.alt);
        });
    });
}
