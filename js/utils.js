/**
 * Módulo de Utilidades
 * Gestiona: lazy loading de imágenes, scroll to top, cursor personalizado, animaciones on-scroll
 * 
 * @module Utils
 * @exports {Object} Utils
 */

const Utils = (() => {
    /**
     * Implementa lazy loading nativo de imágenes para navegadores modernos
     * @function lazyLoadImages
     * @returns {void}
     */
    const lazyLoadImages = () => {
        if ('loading' in HTMLImageElement.prototype) {
            return;
        }

        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    };

    /**
     * Inicializa el botón de scroll to top
     * @function initScrollToTop
     * @returns {void}
     */
    const initScrollToTop = () => {
        let scrollToTopBtn = document.querySelector('.scroll-to-top');
        
        if (!scrollToTopBtn) {
            scrollToTopBtn = document.createElement('button');
            scrollToTopBtn.className = 'scroll-to-top';
            scrollToTopBtn.setAttribute('aria-label', 'Ir al inicio');
            scrollToTopBtn.textContent = '↑';
            document.body.appendChild(scrollToTopBtn);
        }

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    /**
     * Cursor personalizado: Orb con Aura Reactiva
     * Esfera central + aura dinámica responsiva a velocidad del mouse
     * Satélites orbitan en hover, pulso expansivo en click
     * Optimizado con RequestAnimationFrame
     * @class CustomCursor
     */
    class CustomCursor {
        constructor() {
            this.cursor = null;
            this.orbCore = null;
            this.auraOuter = null;
            this.satelliteContainer = null;
            
            this.mouseX = 0;
            this.mouseY = 0;
            this.cursorX = 0;
            this.cursorY = 0;
            this.prevMouseX = 0;
            this.prevMouseY = 0;
            
            this.animationFrameId = null;
            this.velocity = 0;
            this.auraSize = 32;
            this.isHovering = false;
            this.satellites = [];
            this.satelliteAngle = 0;

            this.init();
        }

        /**
         * Inicializa el cursor personalizado
         * @function init
         * @returns {void}
         */
        init() {
            this.createCursor();
            this.attachEventListeners();
            this.startSatelliteAnimation();
        }

        /**
         * Crea el elemento visual del cursor (Orb + Aura)
         * @function createCursor
         * @returns {void}
         */
        createCursor() {
            // Contenedor principal
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            
            // Aura exterior (dinámica)
            this.auraOuter = document.createElement('div');
            this.auraOuter.className = 'cursor-aura';
            this.cursor.appendChild(this.auraOuter);
            
            // Núcleo central (esfera)
            this.orbCore = document.createElement('div');
            this.orbCore.className = 'cursor-orb-core';
            this.cursor.appendChild(this.orbCore);
            
            // Contenedor de satélites
            this.satelliteContainer = document.createElement('div');
            this.satelliteContainer.className = 'cursor-satellites';
            this.cursor.appendChild(this.satelliteContainer);
            
            // Crear 3 satélites
            for (let i = 0; i < 3; i++) {
                const satellite = document.createElement('div');
                satellite.className = 'cursor-satellite';
                this.satelliteContainer.appendChild(satellite);
                this.satellites.push(satellite);
            }
            
            document.body.appendChild(this.cursor);
        }

        /**
         * Inicia la animación de los satélites
         * @function startSatelliteAnimation
         * @returns {void}
         */
        startSatelliteAnimation() {
            setInterval(() => {
                this.satelliteAngle = (this.satelliteAngle + 3) % 360;
                
                this.satellites.forEach((satellite, index) => {
                    const angle = this.satelliteAngle + (index * 120);
                    const radius = this.isHovering ? 50 : 28;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;
                    
                    satellite.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
                });
            }, 30);
        }

        /**
         * Adjunta listeners de mouse
         * @function attachEventListeners
         * @returns {void}
         */
        attachEventListeners() {
            document.addEventListener('mousemove', (e) => {
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;

                // Calcular velocidad
                const dx = this.mouseX - this.prevMouseX;
                const dy = this.mouseY - this.prevMouseY;
                this.velocity = Math.sqrt(dx * dx + dy * dy);

                if (!this.animationFrameId) {
                    this.animationFrameId = requestAnimationFrame(() => {
                        this.updateCursorPosition();
                        this.updateAura();
                        this.animationFrameId = null;
                    });
                }
            });

            document.addEventListener('mousedown', () => {
                this.cursor?.classList.add('cursor-pulse');
                this.createPulseExplosion();
                setTimeout(() => {
                    this.cursor?.classList.remove('cursor-pulse');
                }, 300);
            });
            
            document.querySelectorAll('a, button, .btn, .project-card, input, textarea')
                .forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        this.isHovering = true;
                        this.cursor?.classList.add('cursor-hover');
                        this.auraOuter.style.setProperty('--aura-glow', '0 0 50px rgba(0, 224, 255, 0.9)');
                    });
                    el.addEventListener('mouseleave', () => {
                        this.isHovering = false;
                        this.cursor?.classList.remove('cursor-hover');
                        this.auraOuter.style.setProperty('--aura-glow', '0 0 25px rgba(0, 224, 255, 0.7)');
                    });
                });
        }

        /**
         * Actualiza la posición del cursor con suavizado
         * @function updateCursorPosition
         * @returns {void}
         */
        updateCursorPosition() {
            if (!this.cursor) return;
            
            // Interpolación suave (easing)
            this.cursorX += (this.mouseX - this.cursorX) * 0.2;
            this.cursorY += (this.mouseY - this.cursorY) * 0.2;
            
            this.cursor.style.left = (this.cursorX - 12) + 'px';
            this.cursor.style.top = (this.cursorY - 12) + 'px';
        }

        /**
         * Actualiza el aura basado en la velocidad del mouse
         * @function updateAura
         * @returns {void}
         */
        updateAura() {
            if (!this.auraOuter) return;
            
            // Aura se expande con velocidad (máx 52px) - AUMENTADO
            const targetSize = Math.min(32 + this.velocity * 3, 52);
            this.auraSize += (targetSize - this.auraSize) * 0.1;
            
            this.auraOuter.style.width = this.auraSize + 'px';
            this.auraOuter.style.height = this.auraSize + 'px';
            
            // Opacidad del aura basada en velocidad
            const opacity = Math.min(0.3 + this.velocity * 0.02, 0.7);
            this.auraOuter.style.opacity = opacity;
        }

        /**
         * Crea efecto de pulso explosivo en click
         * @function createPulseExplosion
         * @returns {void}
         */
        createPulseExplosion() {
            const pulse = document.createElement('div');
            pulse.className = 'cursor-pulse-ring';
            pulse.style.left = this.cursorX + 'px';
            pulse.style.top = this.cursorY + 'px';
            
            document.body.appendChild(pulse);
            
            setTimeout(() => {
                pulse.remove();
            }, 400);
        }
    }

    /**
     * Inicializa animaciones on-scroll (fade-in)
     * @function initOnScrollAnimations
     * @returns {void}
     */
    const initOnScrollAnimations = () => {
        const elements = document.querySelectorAll('[data-aos]');
        if (elements.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    };

    /**
     * Gestiona errores globales no capturados
     * @function setupErrorHandler
     * @returns {void}
     */
    const setupErrorHandler = () => {
        window.addEventListener('error', (e) => {
            console.error('Error global capturado:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rechazada no manejada:', e.reason);
        });
    };

    /**
     * Gestiona el resize de ventana con debounce
     * @function setupResizeHandler
     * @returns {void}
     */
    const setupResizeHandler = () => {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth >= 768) {
                    const navMenu = document.querySelector('.nav_menu');
                    const navToggle = document.querySelector('.nav_toggle');
                    
                    navMenu?.classList.remove('nav_menu--active');
                    navToggle?.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }, 250);
        });
    };

    /**
     * Inicializa todos los módulos de utilidades
     * @function init
     * @returns {void}
     */
    const init = () => {
        try {
            lazyLoadImages();
            initScrollToTop();
            new CustomCursor();
            initOnScrollAnimations();
            setupErrorHandler();
            setupResizeHandler();
        } catch (error) {
            console.error('Error al inicializar utilidades:', error);
        }
    };

    return { init };
})();
