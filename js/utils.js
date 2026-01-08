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
     * Los navegadores modernos soportan loading="lazy" nativamente
     * Esta función es solo para navegadores que no lo soportan (polyfill)
     * @function lazyLoadImages
     * @returns {void}
     */
    const lazyLoadImages = () => {
        // Si el navegador soporta lazy loading nativo, no hacer nada
        if ('loading' in HTMLImageElement.prototype) {
            return;
        }

        // Polyfill para navegadores antiguos que no soportan loading="lazy"
        const images = document.querySelectorAll('img[loading="lazy"]');
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Solo cargar si tiene data-src (fallback para navegadores antiguos)
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Cargar imágenes 50px antes de que sean visibles
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
            scrollToTopBtn.setAttribute('title', 'Volver arriba');
            document.body.appendChild(scrollToTopBtn);
        }

        // Usar requestAnimationFrame para mejor rendimiento en scroll
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.pageYOffset > 300) {
                        scrollToTopBtn.classList.add('visible');
                    } else {
                        scrollToTopBtn.classList.remove('visible');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

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
            
            // Posiciones del mouse (objetivo)
            this.mouseX = 0;
            this.mouseY = 0;
            
            // Posiciones actuales del cursor (interpoladas)
            this.cursorX = 0;
            this.cursorY = 0;
            
            // Posiciones anteriores para calcular velocidad
            this.prevMouseX = 0;
            this.prevMouseY = 0;
            this.prevCursorX = 0;
            this.prevCursorY = 0;
            
            // Control de animación
            this.animationFrameId = null;
            this.isAnimating = false;
            
            // Efectos visuales
            this.velocity = 0;
            this.auraSize = 32;
            this.isHovering = false;
            this.satellites = [];
            this.satelliteAngle = 0;
            
            // Factor de interpolación (más alto = más rápido/responsivo)
            this.lerpSpeed = 0.15;

            this.init();
        }

        /**
         * Inicializa el cursor personalizado
         * @function init
         * @returns {void}
         */
        init() {
            // Solo inicializar en dispositivos con mouse (no táctiles)
            if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                this.createCursor();
                this.initializePosition();
                this.attachEventListeners();
                this.startAnimationLoop();
                this.startSatelliteAnimation();
            }
        }

        /**
         * Inicializa la posición del cursor en la posición actual del mouse
         * @function initializePosition
         * @returns {void}
         */
        initializePosition() {
            // Posición por defecto en el centro de la pantalla
            this.mouseX = window.innerWidth / 2;
            this.mouseY = window.innerHeight / 2;
            
            // Inicializar posiciones del cursor igual al mouse
            this.cursorX = this.mouseX;
            this.cursorY = this.mouseY;
            this.prevCursorX = this.cursorX;
            this.prevCursorY = this.cursorY;
            
            // Aplicar posición inicial inmediatamente
            if (this.cursor) {
                this.cursor.style.left = this.cursorX + 'px';
                this.cursor.style.top = this.cursorY + 'px';
                this.cursor.style.opacity = '1';
            }
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
            const animateSatellites = () => {
                if (!this.isAnimating) return;
                
                this.satelliteAngle = (this.satelliteAngle + 2) % 360;
                
                this.satellites.forEach((satellite, index) => {
                    const angle = this.satelliteAngle + (index * 120);
                    const radius = this.isHovering ? 50 : 28;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;
                    
                    satellite.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
                });
                
                requestAnimationFrame(animateSatellites);
            };
            
            requestAnimationFrame(animateSatellites);
        }

        /**
         * Inicia el loop de animación continuo
         * @function startAnimationLoop
         * @returns {void}
         */
        startAnimationLoop() {
            if (this.isAnimating) return;
            
            this.isAnimating = true;
            
            const animate = () => {
                if (!this.isAnimating) return;
                
                // Actualizar posición del cursor
                this.updateCursorPosition();
                
                // Actualizar aura
                this.updateAura();
                
                // Continuar el loop
                this.animationFrameId = requestAnimationFrame(animate);
            };
            
            this.animationFrameId = requestAnimationFrame(animate);
        }

        /**
         * Detiene el loop de animación
         * @function stopAnimationLoop
         * @returns {void}
         */
        stopAnimationLoop() {
            this.isAnimating = false;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }

        /**
         * Adjunta listeners de mouse
         * @function attachEventListeners
         * @returns {void}
         */
        attachEventListeners() {
            document.addEventListener('mousemove', (e) => {
                // Guardar posición anterior del mouse
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
                
                // Actualizar posición objetivo
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;

                // Calcular velocidad basada en movimiento del mouse
                const dx = this.mouseX - this.prevMouseX;
                const dy = this.mouseY - this.prevMouseY;
                this.velocity = Math.sqrt(dx * dx + dy * dy);
                
                // Suavizar el cálculo de velocidad para evitar cambios bruscos
                this.velocity = this.velocity * 0.8 + (Math.sqrt(dx * dx + dy * dy) * 0.2);
            }, { passive: true });

            document.addEventListener('mousedown', () => {
                this.cursor?.classList.add('cursor-pulse');
                this.createPulseExplosion();
                setTimeout(() => {
                    this.cursor?.classList.remove('cursor-pulse');
                }, 300);
            });
        }

        /**
         * Actualiza la posición del cursor con suavizado mejorado
         * @function updateCursorPosition
         * @returns {void}
         */
        updateCursorPosition() {
            if (!this.cursor) return;
            
            // Guardar posición anterior para cálculo de velocidad suavizado
            this.prevCursorX = this.cursorX;
            this.prevCursorY = this.cursorY;
            
            // Interpolación lineal (LERP)
            // Factor dinámico: más rápido cuando hay más distancia
            const dx = this.mouseX - this.cursorX;
            const dy = this.mouseY - this.cursorY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Ajustar velocidad de interpolación según la distancia
            // Más rápido para movimientos grandes, más suave para pequeños
            let lerpFactor = this.lerpSpeed;
            if (distance > 50) {
                lerpFactor = 0.25; // Más rápido para movimientos grandes
            } else if (distance < 5) {
                lerpFactor = 0.1; // Más suave para movimientos pequeños
            }

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
            
            // Calcular velocidad basada en movimiento del cursor también
            const cursorDx = this.cursorX - this.prevCursorX;
            const cursorDy = this.cursorY - this.prevCursorY;
            const cursorVelocity = Math.sqrt(cursorDx * cursorDx + cursorDy * cursorDy);
            
            // Combinar ambas velocidades para un efecto más suave
            const combinedVelocity = (this.velocity * 0.7 + cursorVelocity * 0.3);
            
            // Aura se expande con velocidad (máx 52px)
            const targetSize = Math.min(32 + combinedVelocity * 0.15, 52);
            this.auraSize += (targetSize - this.auraSize) * 0.15; // Interpolación más rápida
            
            this.auraOuter.style.width = this.auraSize + 'px';
            this.auraOuter.style.height = this.auraSize + 'px';
            
            // Opacidad del aura basada en velocidad
            const opacity = Math.min(0.3 + combinedVelocity * 0.01, 0.7);
            this.auraOuter.style.opacity = opacity;
            
            // Reducir velocidad gradualmente cuando no hay movimiento
            this.velocity *= 0.95;
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
     * Inicializa animaciones on-scroll para elementos sin AOS
     * NOTA: Esta función solo maneja elementos que no usan AOS
     * AOS se encarga de los elementos con atributo data-aos
     * @function initOnScrollAnimations
     * @returns {void}
     */
    const initOnScrollAnimations = () => {
        // Solo procesar elementos que tienen animaciones custom pero NO tienen data-aos
        // Ya que AOS maneja los elementos con data-aos
        const elements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale');
        if (elements.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.forEach(element => {
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





