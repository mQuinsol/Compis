export function initAssistant() {
    const chat = document.getElementById("waChat");
    const boton = document.getElementById("waToggle");
    const sendBtn = document.getElementById("waSend");

    if (!chat || !boton || !sendBtn) return;

    boton.addEventListener("click", () => {
        chat.style.display = chat.style.display === "block" ? "none" : "block";
    });

    sendBtn.addEventListener("click", () => {
        const mensaje = document.querySelector('#waMessage').value.trim();
        if (!mensaje) {
            alert("Por favor escribe un mensaje.");
            return;
        }
        window.open(`https://wa.me/34613293273?text=${encodeURIComponent(mensaje)}`, '_blank');
    });

    document.addEventListener("click", (event) => {
        if (
            chat.style.display === "block" &&
            !chat.contains(event.target) &&
            !boton.contains(event.target)
        ) {
            chat.style.display = "none";
        }
    });

    const sectionMessages = {
        servicios: '¿Te ayudamos a elegir? 👇',
        opiniones: '¡Ven a conocernos! 🌈',
        contacto: '¿Hablamos? 💬'
    };

    const tooltip = document.createElement('div');
    tooltip.className = 'wa-tooltip';
    boton.parentNode.insertBefore(tooltip, boton);
    boton.parentNode.appendChild(boton);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const msg = sectionMessages[id];
                if (msg) {
                    tooltip.textContent = msg;
                    tooltip.classList.add('visible');
                    setTimeout(() => tooltip.classList.remove('visible'), 3000);
                }
            }
        });
    }, { threshold: 0.4 });

    const heroBtnPrimary = document.querySelector('.hero-btn--primary');
    if (heroBtnPrimary) {
        heroBtnPrimary.addEventListener('click', (e) => {
            e.preventDefault();
            const mensaje = "Hola, me gustaría reservar un evento en Compis 🎉";
            window.open(`https://wa.me/34613293273?text=${encodeURIComponent(mensaje)}`, '_blank');
        });
    }

    Object.keys(sectionMessages).forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}