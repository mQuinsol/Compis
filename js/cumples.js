export function initCumples() {
    const page = document.querySelector('.cumples-hero');
    if (!page) return;

    // --- Acordeón menús ---
    document.querySelectorAll('.menu-item__header').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.menu-item');
            const isOpen = item.classList.contains('is-open');

            document.querySelectorAll('.menu-item').forEach(m => {
                m.classList.remove('is-open');
                m.querySelector('.menu-item__header').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- Modal PDF ---
        const btn = document.getElementById('cumplesPdfBtn');
        const modal = document.getElementById('cumplesPdfModal');
        const closeBtn = document.getElementById('cumplesPdfClose');
        if (!btn || !modal || !closeBtn) return;

        document.body.appendChild(modal);

        btn.addEventListener('click', () => {
            modal.hidden = false;
            document.body.style.overflow = 'hidden';
        });

        closeBtn.addEventListener('click', () => {
            modal.hidden = true;
            document.body.style.overflow = '';
        });
    }   
