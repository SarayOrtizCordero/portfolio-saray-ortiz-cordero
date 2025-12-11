/**
 * Módulo de Navegación
 * Gestiona: navegación suave, menú hamburguesa, indicador de scroll activo, barra de progreso
 * 
 * @module Navigation
 * @exports {Object} Navigation
 */

const Navigation = (() => {
    const CONFIG = {
        scrollOffset: 80,
        navActiveClass: 'nav_link--active',
        headerScrolledClass: 'header--scrolled',
        menuActiveClass: 'nav_menu--active',
    };

    const elements = {
        header: document.querySelector('.header'),
        navToggle: document.querySelector('.nav_toggle'),
        navMenu: document.querySelector('.nav_menu'),
        navLinks: document.querySelectorAll('.nav_link'),
        scrollProgress: document.querySelector('.scroll-progress')
    };

    /**
     * Actualiza la barra de progreso de scroll
     * @function updateScrollProgress
     * @returns {void}
     */
    const updateScrollProgress = () => {
        if (!elements.scrollProgress) return;

        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;

        elements.scrollProgress.style.width = progress + "%";
    };


    /**
     * Gestiona el efecto visual del header al hacer scroll
     * @function handleScroll
     * @returns {void}
     */
    const handleScroll = () => {
        if (window.scrollY > 50) {
            elements.header.classList.add(CONFIG.headerScrolledClass);
        } else {
            elements.header.classList.remove(CONFIG.headerScrolledClass);
        }
        
        updateActiveNavLink();
        updateScrollProgress();
    };


    /**
     * Actualiza el enlace activo en la navegación basado en la sección visible
     * @function updateActiveNavLink
     * @returns {void}
     */
    const updateActiveNavLink = () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - CONFIG.scrollOffset;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav_link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add(CONFIG.navActiveClass);
            } else {
                navLink?.classList.remove(CONFIG.navActiveClass);
            }
        });
    };

    /**
     * Alterna la visibilidad del menú móvil
     * @function toggleMobileMenu
     * @returns {void}
     */
    const toggleMobileMenu = () => {
        const isExpanded = elements.navToggle.getAttribute('aria-expanded') === 'true';
        elements.navToggle.setAttribute('aria-expanded', !isExpanded);
        elements.navMenu.classList.toggle(CONFIG.menuActiveClass);
        
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    };

    /**
     * Cierra el menú móvil y restaura el scroll del body
     * @function closeMobileMenu
     * @returns {void}
     */
    const closeMobileMenu = () => {
        elements.navToggle.setAttribute('aria-expanded', 'false');
        elements.navMenu.classList.remove(CONFIG.menuActiveClass);
        document.body.style.overflow = '';
    };

    /**
     * Ejecuta scroll suave a una sección con compensación de header
     * @function handleSmoothScroll
     * @param {Event} e - Evento de click del enlace
     * @returns {void}
     */
    const handleSmoothScroll = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const targetPosition = targetSection.offsetTop - CONFIG.scrollOffset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            if (window.innerWidth < 768) {
                closeMobileMenu();
            }
        }
    };

    /**
     * Inicializa todos los event listeners del módulo de navegación
     * @function init
     * @returns {void}
     */
    const init = () => {
        window.addEventListener('scroll', handleScroll);
        elements.navToggle?.addEventListener('click', toggleMobileMenu);
        
        elements.navLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav') && elements.navMenu.classList.contains(CONFIG.menuActiveClass)) {
                closeMobileMenu();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.navMenu.classList.contains(CONFIG.menuActiveClass)) {
                closeMobileMenu();
            }
        });
    };

    return { init };
})();