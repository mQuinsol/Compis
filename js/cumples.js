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
    const pdfBtn = document.getElementById('cumplesPdfBtn');
    const pdfModal = document.getElementById('cumplesPdfModal');
    const pdfFrame = document.getElementById('cumplesPdfFrame');
    const pdfClose = document.getElementById('cumplesPdfClose');

    if (pdfBtn && pdfModal) {
        const openPdfModal = () => {
            const pdfSrc = pdfBtn.dataset.pdf;
            if (!pdfSrc) return;
            pdfFrame.src = pdfSrc;
            pdfModal.classList.add('is-open');
            pdfModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closePdfModal = () => {
            pdfModal.classList.remove('is-open');
            pdfModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            pdfFrame.src = '';
        };

        pdfBtn.addEventListener('click', openPdfModal);
        pdfClose.addEventListener('click', closePdfModal);
        pdfModal.addEventListener('click', e => { if (e.target === pdfModal) closePdfModal(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && pdfModal.classList.contains('is-open')) closePdfModal();
        });
    }   
}