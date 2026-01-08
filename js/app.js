/**
 * Punto de entrada centralizado de la aplicación
 * Inicializa todos los módulos en orden correcto con error handling
 * 
 * @module App
 * @exports {Object} App
 */

const App = (() => {
    /**
     * Inicializa todos los módulos de la aplicación
     * Se ejecuta cuando el DOM está completamente cargado
     * @function init
     * @returns {void}
     */
    const init = () => {
        try {
            console.log('🚀 Inicializando aplicación...');

            // 1. Navegación y Header
            Navigation.init();
            console.log('✓ Módulo de Navegación inicializado');

            // 2. Efectos Visuales Hero
            EnhancedParticles.init();
            console.log('✓ Módulo de Partículas inicializado');

            TypingEffect.init();
            console.log('✓ Módulo de Efecto Typing inicializado');

            Parallax.init();
            console.log('✓ Módulo de Parallax inicializado');

            // 3. Animaciones de Contenido
            // Inicializar AOS (Animate On Scroll)
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 1000,
                    easing: 'ease-in-out',
                    once: true,
                    offset: 100
                });
                console.log('✓ Librería AOS inicializada');
            }

            SkillsAnimation.init();
            console.log('✓ Módulo de Skills inicializado');

            StatsCounter.init();
            console.log('✓ Módulo de Contador de Estadísticas inicializado');

            // 4. Formulario y Utilidades
            ContactForm.init();
            console.log('✓ Módulo de Formulario de Contacto inicializado');

            Utils.init();
            console.log('✓ Módulo de Utilidades inicializado');

            console.log('✨ Aplicación completamente inicializada');
        } catch (error) {
            console.error('❌ Error al inicializar aplicación:', error);
        }
    };

    return { init };
})();

// Ejecutar cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
} else {
    App.init();
}
