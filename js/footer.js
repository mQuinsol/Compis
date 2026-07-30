export function initFooterHours() {
    const toggles = document.querySelectorAll('[data-hours-toggle]');
    if (!toggles.length) return;

    const closeAll = () => {
        toggles.forEach(toggle => {
            const panel = document.getElementById(toggle.getAttribute('aria-controls'));
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            if (panel) panel.classList.remove('is-open');
        });
    };    

    toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation(); // evita que el click del botón dispare el cierre global
            const panel = document.getElementById(toggle.getAttribute('aria-controls'));
            if (!panel) return;

            const willOpen = !toggle.classList.contains('is-open');
            closeAll(); // cierra cualquier otro acordeón abierto
            if (willOpen) {
                toggle.classList.add('is-open');
                panel.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Cerrar al pulsar fuera de cualquier acordeón
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.footer-compis__hours-item')) {
            closeAll();
        }
    });
}   
