export function initCampamentos() {
    const campamento = document.querySelector('.camp-hero');
    if (!campamento) return;

    const lightbox  = document.getElementById('pdfLightbox');
    const pdfImg    = document.getElementById('pdfImg');
    const pdfClose  = document.getElementById('pdfClose');
    const pdfPrev   = document.getElementById('pdfPrev');
    const pdfNext   = document.getElementById('pdfNext');
    let currentLightboxIndex = 0;
    let lightboxImages = [];

    // fullSrc: usa la versión grande (data-full) si existe; si no, el src normal
    const fullSrc = img => img.dataset.full || img.src;

    const openLightbox = (src, alt) => {
        pdfImg.src = src;
        pdfImg.alt = alt;

        const hasNav = lightboxImages.length > 1;
        if (pdfPrev) pdfPrev.style.display = hasNav ? '' : 'none';
        if (pdfNext) pdfNext.style.display = hasNav ? '' : 'none';

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
        pdfImg.src = fullSrc(lightboxImages[currentLightboxIndex]); // fullSrc
    });

    pdfNext?.addEventListener('click', () => {
        if (!lightboxImages.length) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
        pdfImg.src = fullSrc(lightboxImages[currentLightboxIndex]); // fullSrc
    });

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

    const verano = document.querySelector('.camp-accordion__item[data-camp="verano"]');
    if (verano) {
        verano.querySelector('.camp-accordion__trigger').setAttribute('aria-expanded', 'true');
        verano.querySelector('.camp-accordion__body').classList.add('is-open');
    }

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

    document.querySelectorAll('.camp-accordion__img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImages = [];
            openLightbox(fullSrc(img), img.alt); // fullSrc
        });
    });

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

        enableMouseDrag(heroTrack);
        const stopHeroAutoplay = () => clearInterval(heroCarouselTimer);

        heroTrack.addEventListener('pointerdown', stopHeroAutoplay);
        heroTrack.addEventListener('pointerup', () => setTimeout(startHeroAutoplay, 1000));

        startHeroAutoplay();

        const heroImgs = Array.from(heroTrack.querySelectorAll('.camp-hero__slide img'));
        heroImgs.forEach((img, i) => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                lightboxImages = heroImgs;
                currentLightboxIndex = i;
                openLightbox(fullSrc(img), img.alt); // fullSrc
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

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
        if (i === 0) dot.classList.add('is-active');
        dot.addEventListener('click', () => {
            slides[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    track.addEventListener('scroll', () => {
        const slideWidth = slides[0].offsetWidth + 12;
        const index = Math.round(track.scrollLeft / slideWidth);
        dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    });

    const DSC_CAROUSEL_DELAY = 4000;
    let dscCarouselTimer;

    const startDscAutoplay = () => {
        clearInterval(dscCarouselTimer);
        dscCarouselTimer = setInterval(() => {
            const slideWidth = slides[0].offsetWidth + 12;
            const maxScroll = track.scrollWidth - track.clientWidth;
            const nextScroll = track.scrollLeft + slideWidth;
            track.scrollTo({
                left: nextScroll >= maxScroll ? 0 : nextScroll,
                behavior: 'smooth'
            });
        }, DSC_CAROUSEL_DELAY);
    };

    enableMouseDrag(track);
    const stopDscAutoplay = () => clearInterval(dscCarouselTimer);

    track.addEventListener('pointerdown', stopDscAutoplay);
    track.addEventListener('pointerup', () => setTimeout(startDscAutoplay, 1000));

    startDscAutoplay();

    const dscImgs = Array.from(track.querySelectorAll('.dsc__carousel-slide img'));
    dscImgs.forEach((img, i) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImages = dscImgs;
            currentLightboxIndex = i;
            openLightbox(fullSrc(img), img.alt); // fullSrc
        });
    });
}

function enableMouseDrag(el) {
    let isDown = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    el.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'mouse') return;
        isDown = true;
        moved = false;
        startX = e.clientX;
        startScroll = el.scrollLeft;
        el.style.scrollSnapType = 'none';
        el.style.scrollBehavior = 'auto';
        el.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', e => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) moved = true;
        el.scrollLeft = startScroll - dx;
    });

    window.addEventListener('pointerup', () => {
        if (!isDown) return;
        isDown = false;
        el.style.scrollSnapType = '';
        el.style.scrollBehavior = '';
        el.style.cursor = '';
    });

    el.addEventListener('click', e => {
        if (moved) {
            e.stopPropagation();
            e.preventDefault();
            moved = false;
        }
    }, true);

    el.addEventListener('dragstart', e => e.preventDefault());
}