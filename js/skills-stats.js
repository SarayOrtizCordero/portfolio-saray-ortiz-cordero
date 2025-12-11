/**
 * Módulo de Habilidades (Skills)
 * Gestiona: animación de barras de progreso, contadores numéricos, estadísticas
 * 
 * @module SkillsAnimation
 * @exports {Object} SkillsAnimation
 */

const SkillsAnimation = (() => {
    let isAnimated = false;

    /**
     * Anima una barra de habilidad individual con wave effect
     * @function animateSkill
     * @param {HTMLElement} skillItem - Elemento de la habilidad
     * @returns {void}
     */
    const animateSkill = (skillItem) => {
        const level = parseInt(skillItem.getAttribute('data-level')) || 0;
        const progressBar = skillItem.querySelector('.skill-item_progress');
        const percentageSpan = skillItem.querySelector('.skill-item_percentage');
        
        if (!progressBar || !percentageSpan) return;
        
        setTimeout(() => {
            progressBar.style.width = level + '%';
            
            setTimeout(() => {
                progressBar.classList.add('wave-complete');
                
                setTimeout(() => {
                    progressBar.classList.remove('wave-complete');
                }, 1500);
            }, 1500);
        }, 100);
        
        let currentPercentage = 0;
        const duration = 1500;
        const increment = level / (duration / 16);
        
        const counter = setInterval(() => {
            currentPercentage += increment;
            if (currentPercentage >= level) {
                currentPercentage = level;
                clearInterval(counter);
            }
            percentageSpan.textContent = Math.round(currentPercentage) + '%';
        }, 16);
    };

    /**
     * Anima un contador numérico con easing
     * @function animateCounter
     * @param {HTMLElement} element - Elemento del estadístico
     * @param {number} target - Número final
     * @param {number} duration - Duración en milisegundos
     * @returns {void}
     */
    const animateCounter = (element, target, duration = 2000) => {
        const numberSpan = element.querySelector('.stat-item_number');
        if (!numberSpan) return;

        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            numberSpan.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                numberSpan.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    };

    /**
     * Inicializa animaciones de habilidades cuando se hacen visibles
     * @function initSkillsAnimation
     * @returns {void}
     */
    const initSkillsAnimation = () => {
        const skillsSection = document.querySelector('#sobre-mi');
        if (!skillsSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isAnimated) {
                    isAnimated = true;
                    const skillItems = document.querySelectorAll('.skill-item[data-level]');
                    
                    skillItems.forEach((skill, index) => {
                        setTimeout(() => {
                            animateSkill(skill);
                        }, index * 50);
                    });
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(skillsSection);
    };

    /**
     * Inicializa animaciones de estadísticas cuando se hacen visibles
     * @function initStatsAnimation
     * @returns {void}
     */
    const initStatsAnimation = () => {
        const statsContainer = document.querySelector('.about_stats');
        if (!statsContainer) return;
        
        let isStatsAnimated = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isStatsAnimated) {
                    isStatsAnimated = true;
                    const statItems = document.querySelectorAll('.stat-item[data-target]');
                    
                    statItems.forEach((stat, index) => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        setTimeout(() => {
                            animateCounter(stat, target);
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsContainer);
    };

    /**
     * Inicializa todos los módulos de animación de skills
     * @function init
     * @returns {void}
     */
    const init = () => {
        initSkillsAnimation();
        initStatsAnimation();
    };

    return { init };
})();



/**
 * Módulo de Contador de Estadísticas Animadas
 * Gestiona: animación de contadores numéricos en la sección "Sobre Mí"
 * 
 * @module StatsCounter
 * @exports {Object} StatsCounter
 */

const StatsCounter = (() => {
    const CONFIG = {
        defaultDuration: 2000,  // Duración de la animación (ms)
        threshold: 0.3,         // Porcentaje de visibilidad para activar
        staggerDelay: 100       // Delay entre cada contador (ms)
    };

    let isAnimated = false;

    /**
     * Anima un contador individual desde 0 hasta el valor objetivo
     * @function animateCounter
     * @param {HTMLElement} element - Elemento .stat-item
     * @param {number} target - Número objetivo a alcanzar
     * @param {number} duration - Duración de la animación en ms
     * @returns {void}
     */
    const animateCounter = (element, target, duration = CONFIG.defaultDuration) => {
        const numberSpan = element.querySelector('.stat-item_number');
        const suffixSpan = element.querySelector('.stat-item_suffix');
        
        if (!numberSpan) {
            console.warn('StatsCounter: No se encontró .stat-item_number en', element);
            return;
        }

        const startTime = performance.now();

        /**
         * Función de actualización del contador usando requestAnimationFrame
         * @param {number} currentTime - Timestamp actual
         */
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic) para una animación más natural
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);

            numberSpan.textContent = current;

            // Continuar animación si no ha terminado
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Asegurar que muestra el valor final exacto
                numberSpan.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    };

    /**
     * Inicializa el observador de intersección para los contadores
     * @function init
     * @returns {void}
     */
    const init = () => {
        const statsContainer = document.querySelector('.about_stats');
        
        if (!statsContainer) {
            console.warn('StatsCounter: No se encontró .about_stats');
            return;
        }

        // Crear IntersectionObserver para detectar cuando la sección es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Animar solo una vez cuando la sección entra en viewport
                if (entry.isIntersecting && !isAnimated) {
                    isAnimated = true;
                    const statItems = document.querySelectorAll('.stat-item[data-target]');

                    if (statItems.length === 0) {
                        console.warn('StatsCounter: No se encontraron elementos .stat-item[data-target]');
                        return;
                    }

                    // Animar cada contador con un delay escalonado
                    statItems.forEach((stat, index) => {
                        const target = parseInt(stat.getAttribute('data-target'), 10);
                        
                        if (isNaN(target)) {
                            console.warn('StatsCounter: data-target inválido en', stat);
                            return;
                        }

                        setTimeout(() => {
                            animateCounter(stat, target);
                        }, index * CONFIG.staggerDelay);
                    });
                }
            });
        }, {
            threshold: CONFIG.threshold,
            rootMargin: '0px 0px -50px 0px' // Activar un poco antes de que sea totalmente visible
        });

        observer.observe(statsContainer);
    };

    /**
     * Reinicia el estado de animación (útil para debugging o re-trigger)
     * @function reset
     * @returns {void}
     */
    const reset = () => {
        isAnimated = false;
    };

    return {
        init,
        reset
    };
})();
