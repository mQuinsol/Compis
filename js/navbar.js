export function initNavbar() {
    const toggle = document.querySelector(".navbar__toggle");
    const drawer = document.querySelector(".navbar__drawer");
    const overlay = document.querySelector(".navbar__overlay");
    const navbar = document.querySelector(".navbar"); 
    const links = document.querySelectorAll(".drawer__card");

    if (!toggle || !drawer) return;

    const openMenu = () => {
        drawer.classList.add("active");
        overlay.classList.add("active");
        toggle.classList.add("active");
        document.body.classList.add("menu-open");
        navbar.style.backdropFilter = 'none';
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Cerrar menú");
    };

    const closeMenu = () => {
        drawer.classList.remove("active");
        overlay.classList.remove("active");
        toggle.classList.remove("active");
        document.body.classList.remove("menu-open");
        navbar.style.backdropFilter = '';
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
    };

    const toggleMenu = () => {
        const isOpen = drawer.classList.contains("active");
        isOpen ? closeMenu() : openMenu();
    };

    toggle.addEventListener("click", toggleMenu);

    overlay.addEventListener("click", closeMenu);

    document.addEventListener("click", (event) => {
        const clickInsideDrawer = drawer.contains(event.target);
        const clickOnToggle = toggle.contains(event.target);

        if (!clickInsideDrawer && !clickOnToggle && drawer.classList.contains("active")) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && drawer.classList.contains("active")) {
            closeMenu();
        }
    });

    links.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900 && drawer.classList.contains("active")) {
            closeMenu();
        }
    });

}