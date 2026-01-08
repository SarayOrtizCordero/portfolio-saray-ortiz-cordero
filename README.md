# Portfolio Web - Saray Ortiz Cordero

Portfolio web profesional desarrollado para mostrar proyectos, habilidades técnicas y experiencia como Programadora Full-Stack Junior. Incluye diseño moderno, animaciones fluidas, y optimizaciones de rendimiento y accesibilidad.

![Portfolio Preview](https://img.shields.io/badge/Status-Activo-success) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Índice

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Características Principales](#-características-principales)
- [Proyectos Destacados](#-proyectos-destacados)
- [Accesibilidad](#-accesibilidad)
- [Optimizaciones](#-optimizaciones)
- [Contacto](#-contacto)
- [Licencia](#-licencia)

## Características

- **Diseño Moderno y Responsivo**: Adaptado para todos los dispositivos (móvil, tablet, desktop)
- **Animaciones Fluidas**: Efectos visuales interactivos con CSS y JavaScript vanilla
- **Sistema de Partículas Interactivo**: Partículas animadas con conexiones dinámicas en el hero
- **Formulario de Contacto Funcional**: Integración con EmailJS para envío de mensajes
- **Navegación Suave**: Scroll suave y navegación activa con indicadores visuales
- **Cursor Personalizado**: Cursor interactivo con efectos visuales avanzados
- **Animaciones On-Scroll**: Elementos que se animan al entrar en el viewport
- **Lazy Loading**: Carga diferida de imágenes para optimizar el rendimiento
- **SEO Optimizado**: Meta tags y estructura semántica para mejor indexación
- **Accesibilidad WCAG 2.1**: Cumplimiento con estándares de accesibilidad web

## Tecnologías Utilizadas

### Core Technologies
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con variables CSS, Flexbox, Grid, y animaciones
- **JavaScript (ES6+)**: Funcionalidad interactiva modular con IIFE pattern

### Librerías y Herramientas Externas
- **[AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)**: Animaciones al hacer scroll
- **[EmailJS](https://www.emailjs.com/)**: Servicio de envío de formularios sin backend
- **[Google Fonts](https://fonts.google.com/)**: Tipografía Inter
- **Font Awesome**: Iconos vectoriales (usado en proyectos mostrados)

### Metodologías y Estándares
- **WCAG 2.1**: Estándares de accesibilidad web
- **Mobile First**: Diseño responsivo mobile-first
- **Clean Code**: Código modular y bien documentado
- **SEO**: Optimización para motores de búsqueda

## Estructura del Proyecto

```
portfolio-saray-ortiz-cordero-main/
│
├── assets/
│   ├── images/          # Imágenes de proyectos
│   │   ├── olympus-cars.png
│   │   ├── video-game-universe.png
│   │   ├── reading-world.png
│   │   └── next-project.png
│   └── pdf/             # Documentos
│       └── CV-Saray-Ortiz-Cordero.pdf
│
├── css/
│   └── styles.css       # Estilos principales (1810+ líneas)
│
├── js/
│   ├── app.js           # Punto de entrada y orquestación de módulos
│   ├── navigation.js    # Navegación, menú móvil, scroll progress
│   ├── particles.js     # Sistema de partículas interactivo
│   ├── contact.js       # Formulario de contacto con EmailJS
│   ├── skills-stats.js  # Animaciones de habilidades y estadísticas
│   ├── typing-effect.js # Efecto de escritura animada
│   ├── parallax.js      # Efectos parallax
│   └── utils.js         # Utilidades: cursor, lazy loading, scroll-to-top
│
├── index.html           # Página principal
└── README.md            # Este archivo
```

## Instalación

Este proyecto es una aplicación web estática, no requiere instalación de dependencias ni compilación.

### Opción 1: Visualización Local Simple
1. Clona o descarga el repositorio
2. Abre `index.html` directamente en tu navegador

### Opción 2: Con Servidor Local (Recomendado)
Para probar funcionalidades como el formulario de contacto, es recomendable usar un servidor local:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego visita `http://localhost:8000` en tu navegador.

## Uso

### Configuración del Formulario de Contacto

El formulario utiliza EmailJS. Para configurarlo:

1. Crea una cuenta en [EmailJS](https://www.emailjs.com/)
2. Configura un servicio de email
3. Crea una plantilla de email
4. Actualiza las credenciales en `js/contact.js`:

```javascript
// Línea 83 en contact.js
await emailjs.sendForm('TU_SERVICE_ID', 'TU_TEMPLATE_ID', form);
```

Y en `index.html`:

```html
<!-- Línea 631 en index.html -->
emailjs.init("TU_PUBLIC_KEY");
```

### Personalización

#### Cambiar Colores
Los colores están definidos como variables CSS en `css/styles.css`:

```css
:root {
    --color-cyan: #00D4FF;
    --color-black: #000000;
    /* ... más variables */
}
```

#### Modificar Contenido
- **Información Personal**: Edita la sección "Sobre mí" en `index.html` (líneas 250-516)
- **Proyectos**: Actualiza las tarjetas de proyectos en `index.html` (líneas 89-247)
- **Habilidades**: Modifica las barras de progreso en `index.html` (líneas 341-513)
- **Contacto**: Actualiza información de contacto en `index.html` (líneas 536-571)

#### Ajustar Animaciones
- **Partículas**: Configura en `js/particles.js` (objeto `CONFIG`)
- **Velocidad de Typing**: Modifica `typingSpeed` en `js/typing-effect.js`
- **Duración de Animaciones**: Ajusta en `css/styles.css` (variables de transición)

## Características Principales

### 1. Sistema de Navegación
- Menú hamburguesa responsive
- Indicador de scroll activo
- Barra de progreso de lectura
- Navegación suave entre secciones
- Header con efecto glassmorphism al hacer scroll

### 2. Hero Section
- Efecto de escritura animada (typing effect)
- Sistema de partículas interactivo con conexiones dinámicas
- Fondo con efectos de gradiente y parallax
- CTA buttons con efectos hover

### 3. Sección de Proyectos
- Grid responsivo de tarjetas de proyectos
- Efectos hover 3D y tilt
- Imágenes con lazy loading
- Enlaces a demos y código fuente
- Badges de estado (En proceso)

### 4. Sección Sobre Mí
- Animaciones de barras de progreso al hacer scroll
- Contadores animados para estadísticas
- Certificaciones y formaciones
- Soft skills en formato tags
- Habilidades técnicas organizadas por categorías

### 5. Formulario de Contacto
- Validación en tiempo real
- Integración con EmailJS
- Mensajes de éxito/error
- Diseño accesible con ARIA labels

### 6. Efectos Visuales
- Cursor personalizado con efectos interactivos
- Animaciones on-scroll con AOS
- Efectos de brillo y neón
- Transiciones suaves en todos los elementos

## Proyectos Destacados

### Olympus Cars
Sitio web para concesionario de vehículos de lujo con diseño premium, filtrado avanzado, formulario con validación y mapa interactivo.

**Tecnologías**: HTML5, CSS3, JavaScript, jQuery, Leaflet, Font Awesome

**Enlaces**:
- [Demo en vivo](https://sarayortizcordero.github.io/Olympus-Cars/)
- [Repositorio GitHub](https://github.com/SarayOrtizCordero/Olympus-Cars)

### Video Game Universe
Sitio web estático enfocado en la visualización de videojuegos con diseño responsivo, accesibilidad WCAG 2.1 y arquitectura CSS modular.

**Tecnologías**: HTML5, CSS3, Font Awesome, Responsive Design, WCAG 2.1

**Enlaces**:
- [Demo en vivo](https://sarayortizcordero.github.io/Video-Game-Universe/)
- [Repositorio GitHub](https://github.com/SarayOrtizCordero/Video-Game-Universe)

### Reading World (En desarrollo)
Plataforma web enfocada en la lectura interactiva y gamificada con integración de IA generativa.

**Tecnologías**: HTML5, CSS3, JavaScript, Generative AI

### Próximo Proyecto (En desarrollo)
Videojuego de toma de decisiones con integración de IA generativa.

**Tecnologías**: HTML5, CSS3, Python, Generative AI

## Accesibilidad

El portfolio está diseñado siguiendo las pautas WCAG 2.1:

- **Navegación por teclado**: Todos los elementos interactivos son accesibles
- **ARIA labels**: Etiquetas descriptivas para lectores de pantalla
- **Contraste de colores**: Cumple con ratios mínimos WCAG
- **Semántica HTML**: Uso correcto de elementos semánticos
- **Preferencias de movimiento**: Respeta `prefers-reduced-motion`
- **Alt text**: Imágenes con texto alternativo descriptivo
- **Focus visible**: Indicadores de foco claros

## Optimizaciones

### Rendimiento
- Lazy loading de imágenes
- Uso de `will-change` para animaciones
- RequestAnimationFrame para animaciones fluidas
- Debounce en eventos de resize
- CSS optimizado con variables para reutilización

### SEO
- Meta tags descriptivos
- Open Graph tags para redes sociales
- Estructura semántica HTML5
- Schema markup (puede agregarse)

### Compatibilidad
- Compatible con navegadores modernos
- Fallbacks para características no soportadas
- CSS Grid y Flexbox con fallbacks

## Contacto

**Saray Ortiz Cordero**  
Programadora Full-Stack Junior

- Email: [sarayortizcordero4@gmail.com](mailto:sarayortizcordero4@gmail.com)
- Teléfono: +34 675 84 36 55
- LinkedIn: [linkedin.com/in/saray-ortiz-cordero](https://www.linkedin.com/in/saray-ortiz-cordero)
- GitHub: [github.com/SarayOrtizCordero](https://github.com/SarayOrtizCordero)
- Ubicación: Las Cabezas de San Juan, Sevilla

## Formación y Certificaciones

- **Curso Superior en Programación de Páginas Web** - MasterD (2024-2025)
- **Curso de Iniciación al Desarrollo con IA** - Big School (2025)

## 🛡️ Licencia

Este proyecto es un portfolio personal. Aunque puedes usarlo como referencia o base para tu propio portfolio.

---

**Diseñado y desarrollado por Saray Ortiz Cordero**

*Última actualización: 2025*

