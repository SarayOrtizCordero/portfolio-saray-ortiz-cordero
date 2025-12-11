/**
 * Módulo de Efecto Parallax
 * Gestiona: efecto de parallax en la sección hero para crear profundidad visual
 * 
 * @module Parallax
 * @exports {Object} Parallax
 */

const Parallax = (() => {
    const CONFIG = {
    contentSpeedFactor: 0.3,
    backgroundSpeedFactor: 0.5,
    fadeOutSpeed: 1200, // más lento, se desvanece en el doble de scroll
    maxScrollDistance: null
    };


    let ticking = false;
    let heroElement = null;
    let heroContent = null;

    /**
     * Aplica el efecto parallax basado en la posición del scroll
     * @function applyParallax
     * @returns {void}
     */
    const applyParallax = () => {
        const scrolled = window.pageYOffset;

        if (!heroElement) return;

        // Solo aplicar parallax mientras la sección hero es visible
        if (scrolled < CONFIG.maxScrollDistance) {
            // Parallax en el contenido del hero
            if (heroContent) {
                const offset = scrolled * CONFIG.contentSpeedFactor;
                heroContent.style.transform = `translateY(${offset}px)`;

                // Fade out gradual del contenido al hacer scroll
                const opacity = 1 - (scrolled / CONFIG.fadeOutSpeed);
                heroContent.style.opacity = Math.max(0, opacity);
            }

            // Parallax en el background del hero (usando CSS custom property)
            const backgroundOffset = scrolled * CONFIG.backgroundSpeedFactor;
            heroElement.style.setProperty('--parallax-offset', `${backgroundOffset}px`);
        }

        ticking = false;
    };

    /**
     * Maneja el evento scroll con requestAnimationFrame para mejor performance
     * @function handleScroll
     * @returns {void}
     */
    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(applyParallax);
            ticking = true;
        }
    };

    /**
     * Recalcula la distancia máxima de scroll para el parallax
     * @function updateMaxScrollDistance
     * @returns {void}
     */
    const updateMaxScrollDistance = () => {
        if (heroElement) {
            CONFIG.maxScrollDistance = heroElement.offsetHeight;
        }
    };

    /**
     * Limpia los estilos aplicados por el parallax
     * @function cleanup
     * @returns {void}
     */
    const cleanup = () => {
        if (heroContent) {
            heroContent.style.transform = '';
            heroContent.style.opacity = '';
        }
        if (heroElement) {
            heroElement.style.removeProperty('--parallax-offset');
        }
    };

    /**
     * Inicializa el efecto parallax
     * @function init
     * @returns {void}
     */
    const init = () => {
        // Respetar preferencia de movimiento reducido
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('Parallax: Deshabilitado debido a prefers-reduced-motion');
            return;
        }

        // Obtener elementos necesarios
        heroElement = document.querySelector('.hero');
        heroContent = document.querySelector('.hero_content');

        if (!heroElement) {
            console.warn('Parallax: No se encontró .hero');
            return;
        }

        // Calcular distancia máxima inicial
        updateMaxScrollDistance();

        // Agregar event listeners
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateMaxScrollDistance, { passive: true });

        console.log('✓ Parallax inicializado');
    };

    /**
     * Detiene y limpia el efecto parallax
     * @function stop
     * @returns {void}
     */
    const stop = () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateMaxScrollDistance);
        cleanup();
    };

    return {
        init,
        stop,
        cleanup
    };
})();
