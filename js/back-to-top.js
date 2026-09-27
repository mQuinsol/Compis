export function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const SHOW_AFTER = 400;
    let ticking = false;

    const toggleVisibility = () => {
        btn.classList.toggle('is-visible', window.scrollY > SHOW_AFTER);
        ticking = false;
    };

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(toggleVisibility);
            ticking = true;
        }
    }, { passive: true });

    toggleVisibility();
}