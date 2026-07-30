export function initServices() {
    const service = document.querySelector('.services');
    if (!service) return;

    document.querySelectorAll('.service-card__header').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.service-card');
            const isOpen = card.classList.contains('is-open');

            document.querySelectorAll('.service-card').forEach(c => {
                c.classList.remove('is-open');
                c.querySelector('.service-card__header').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                card.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// --- Carrusel ---
const track = document.querySelector('.services__track');
const slides = document.querySelectorAll('.services__slide');
const dotsContainer = document.querySelector('.services__dots');

slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('services__dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        slides[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.services__dot');

track.addEventListener('scroll', () => {
    const slideWidth = slides[0].offsetWidth + 12;
    const index = Math.round(track.scrollLeft / slideWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
});

// --- Autoplay carrusel ---
const CAROUSEL_DELAY = 3000;
let carouselTimer;

const startCarouselAutoplay = () => {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => {
        const slideWidth = slides[0].offsetWidth + 12;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const nextScroll = track.scrollLeft + slideWidth;
        track.scrollTo({
            left: nextScroll >= maxScroll ? 0 : nextScroll,
            behavior: 'smooth'
        });
    }, CAROUSEL_DELAY);
};

const stopCarouselAutoplay = () => clearInterval(carouselTimer);

track.addEventListener('pointerdown', stopCarouselAutoplay);
track.addEventListener('pointerup', () => setTimeout(startCarouselAutoplay, 1000));

startCarouselAutoplay();

// --- Lightbox ---
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('.lightbox__img');
const lbClose = lightbox.querySelector('.lightbox__close');
const lbPrev = lightbox.querySelector('.lightbox__prev');
const lbNext = lightbox.querySelector('.lightbox__next');
let lbIndex = 0;

const images = [...slides].map(s => s.querySelector('img').src);

// --- Autoplay lightbox ---
const LIGHTBOX_DELAY = 4000;
let lightboxTimer;

const startLightboxAutoplay = () => {
    clearInterval(lightboxTimer);
    lightboxTimer = setInterval(() => {
        lbIndex = (lbIndex + 1) % images.length;
        lbImg.src = images[lbIndex];
    }, LIGHTBOX_DELAY);
};

const stopLightboxAutoplay = () => clearInterval(lightboxTimer);

const openLightbox = (i) => {
    lbIndex = i;
    lbImg.src = images[lbIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    startLightboxAutoplay();
};

const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    stopLightboxAutoplay();
};

slides.forEach((slide, i) => {
    slide.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

lbNext.addEventListener('click', () => {
    lbIndex = (lbIndex + 1) % images.length;
    lbImg.src = images[lbIndex];
    startLightboxAutoplay();
});

lbPrev.addEventListener('click', () => {
    lbIndex = (lbIndex - 1 + images.length) % images.length;
    lbImg.src = images[lbIndex];
    startLightboxAutoplay();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % images.length; lbImg.src = images[lbIndex]; startLightboxAutoplay(); }
    if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + images.length) % images.length; lbImg.src = images[lbIndex]; startLightboxAutoplay(); }
});
