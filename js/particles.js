/**
 * Módulo de Partículas Mejoradas con Conexiones
 * Gestiona: sistema de partículas interactivo con conexiones dinámicas en el hero
 * 
 * @module EnhancedParticles
 * @exports {Object} EnhancedParticles
 */

const EnhancedParticles = (() => {
    const CONFIG = {
        particleCount: 40,
        connectionDistance: 120,
        mouseInteractionRadius: 100,      // Aumentado para más rango
        mouseForce: 1.2,                  // Aumentado significativamente
        friction: 0.95,                   // Reducido para más movimiento
        baseSpeed: 0.5,                   // Velocidad base de flotación
        particleSpeed: {
            min: 0.5,
            max: 1.5
        },
        particleSize: {
            min: 1.5,
            max: 3.5
        },
        opacity: {
            min: 0.4,
            max: 0.9
        }
    };

    let canvas = null;
    let ctx = null;
    let particles = [];
    let mousePosition = { x: 0, y: 0 };
    let animationFrameId = null;

    /**
     * Clase que representa una partícula individual
     * @class Particle
     */
    class Particle {
        constructor(canvasWidth, canvasHeight) {
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.reset();
            // Primera vez, inicializar en posición aleatoria en Y
            this.y = Math.random() * canvasHeight;
        }

        /**
         * Reinicia la partícula en posición aleatoria
         * @method reset
         */
        reset() {
            this.x = Math.random() * this.canvasWidth;
            this.y = Math.random() * this.canvasHeight;
            // Velocidades aleatorias en todas direcciones para flotación
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * (CONFIG.particleSpeed.max - CONFIG.particleSpeed.min) + CONFIG.particleSpeed.min;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.radius = Math.random() * (CONFIG.particleSize.max - CONFIG.particleSize.min) + CONFIG.particleSize.min;
            this.opacity = Math.random() * (CONFIG.opacity.max - CONFIG.opacity.min) + CONFIG.opacity.min;
        }

        /**
         * Actualiza la posición de la partícula
         * @method update
         * @param {number} mouseX - Posición X del mouse
         * @param {number} mouseY - Posición Y del mouse
         */
        update(mouseX, mouseY) {
            // Interacción con el mouse - REPELER partículas
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Si el mouse está cerca, empujar la partícula con fuerza
            if (distance < CONFIG.mouseInteractionRadius && distance > 0) {
                const force = (CONFIG.mouseInteractionRadius - distance) / CONFIG.mouseInteractionRadius;
                const pushX = (dx / distance) * force * CONFIG.mouseForce;
                const pushY = (dy / distance) * force * CONFIG.mouseForce;
                
                // Repeler (signo negativo para empujar hacia afuera)
                this.vx -= pushX;
                this.vy -= pushY;
            }

            // Aplicar fricción para desacelerar gradualmente
            this.vx *= CONFIG.friction;
            this.vy *= CONFIG.friction;

            // Mantener velocidad base mínima para flotación continua
            const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (currentSpeed < CONFIG.baseSpeed) {
                const angle = Math.atan2(this.vy, this.vx);
                this.vx = Math.cos(angle) * CONFIG.baseSpeed;
                this.vy = Math.sin(angle) * CONFIG.baseSpeed;
            }

            // Actualizar posición
            this.x += this.vx;
            this.y += this.vy;

            // Rebotar en los límites (wrap around)
            if (this.x < 0) this.x = this.canvasWidth;
            if (this.x > this.canvasWidth) this.x = 0;
            if (this.y < 0) this.y = this.canvasHeight;
            if (this.y > this.canvasHeight) this.y = 0;
        }

        /**
         * Dibuja la partícula en el canvas
         * @method draw
         * @param {CanvasRenderingContext2D} context - Contexto del canvas
         */
        draw(context) {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            context.fill();

            // Efecto de resplandor
            context.shadowBlur = 10;
            context.shadowColor = 'rgba(0, 212, 255, 0.5)';
        }
    }

    /**
     * Dibuja líneas de conexión entre partículas cercanas
     * @function drawConnections
     */
    const drawConnections = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Dibujar línea si las partículas están lo suficientemente cerca
                if (distance < CONFIG.connectionDistance) {
                    const opacity = (1 - distance / CONFIG.connectionDistance) * 0.3;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };

    /**
     * Ajusta el tamaño del canvas al tamaño de su contenedor
     * @function resizeCanvas
     */
    const resizeCanvas = () => {
        if (!canvas) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Recrear partículas con nuevas dimensiones
        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(new Particle(canvas.width, canvas.height));
        }
    };

    /**
     * Loop principal de animación
     * @function animate
     */
    const animate = () => {
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar conexiones primero (para que queden detrás)
        drawConnections();

        // Actualizar y dibujar todas las partículas
        particles.forEach(particle => {
            particle.update(mousePosition.x, mousePosition.y);
            particle.draw(ctx);
        });

        // Continuar animación
        animationFrameId = requestAnimationFrame(animate);
    };

    /**
     * Maneja el movimiento del mouse sobre el canvas
     * @function handleMouseMove
     * @param {MouseEvent} e - Evento de mouse
     */
    const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mousePosition.x = e.clientX - rect.left;
        mousePosition.y = e.clientY - rect.top;
    };

    /**
     * Inicializa el sistema de partículas
     * @function init
     */
    const init = () => {
        // Respetar preferencia de movimiento reducido
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('EnhancedParticles: Deshabilitado debido a prefers-reduced-motion');
            return;
        }

        canvas = document.querySelector('.hero_canvas');

        if (!canvas) {
            console.warn('EnhancedParticles: No se encontró .hero_canvas');
            return;
        }

        ctx = canvas.getContext('2d');

        // Configurar dimensiones iniciales
        resizeCanvas();

        // Inicializar posición del mouse al centro
        mousePosition.x = canvas.width / 2;
        mousePosition.y = canvas.height / 2;

        // Event listeners
        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', resizeCanvas);

        // Iniciar animación
        animate();

        console.log('✓ EnhancedParticles inicializado con', CONFIG.particleCount, 'partículas');
    };

    /**
     * Detiene y limpia el sistema de partículas
     * @function stop
     */
    const stop = () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        if (canvas) {
            canvas.removeEventListener('mousemove', handleMouseMove);
        }
        window.removeEventListener('resize', resizeCanvas);
        particles = [];
    };

    return {
        init,
        stop
    };
})();
