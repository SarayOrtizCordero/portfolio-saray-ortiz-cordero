/**
 * Módulo de Efecto de Escritura Dinámica (Typing Effect)
 * Gestiona: animación de texto que se escribe y borra automáticamente en el hero
 * 
 * @module TypingEffect
 * @exports {Object} TypingEffect
 */

const TypingEffect = (() => {
    const CONFIG = {
        roles: [
            'Programadora Full-Stack Junior',
        ],
        typingSpeed: 80,      // Velocidad base de escritura (ms)
        singleRoleMode: true  // Modo un solo rol: escribe una vez y se detiene
    };

    let currentCharIndex = 0;
    let subtitleElement = null;

    /**
     * Inicializa el efecto de typing en el subtítulo del hero
     * @function init
     * @returns {void}
     */
    const init = () => {
        subtitleElement = document.querySelector('.hero_subtitle');
        if (!subtitleElement) {
            console.warn('TypingEffect: No se encontró .hero_subtitle');
            return;
        }

        // Guardar texto original como primer rol si no está en el array
        const originalText = subtitleElement.textContent.trim();
        if (originalText && !CONFIG.roles.includes(originalText)) {
            CONFIG.roles[0] = originalText;
        }

        // Iniciar animación
        type();
    };

    /**
     * Función recursiva que maneja la escritura del texto
     * @function type
     * @returns {void}
     */
    const type = () => {
        const currentRole = CONFIG.roles[0];

        // Modo escritura: agregar letra por letra
        currentCharIndex++;
        subtitleElement.textContent = currentRole.substring(0, currentCharIndex);

        // Si terminó de escribir, detener la animación
        if (currentCharIndex === currentRole.length) {
            subtitleElement.textContent = currentRole;
            return;
        }

        // Calcular velocidad con variación aleatoria para efecto más natural
        const randomVariation = Math.random() * 30; // 0-30ms de variación
        const speed = CONFIG.typingSpeed + randomVariation;

        setTimeout(type, speed);
    };

    /**
     * Detiene el efecto de typing (útil para cleanup)
     * @function stop
     * @returns {void}
     */
    const stop = () => {
        // Resetear variables
        currentCharIndex = 0;
    };

    return {
        init,
        stop
    };
})();
