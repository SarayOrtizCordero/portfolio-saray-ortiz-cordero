# Video Game Universe — Portafolio Web

Resumen ejecutivo
-----------------

Este repositorio contiene un portafolio web estático llamado "Video Game Universe" construido con HTML5, CSS3 y JavaScript (Vanilla). La estructura actual incluye una página principal (`index.html`), hojas de estilo en `css/styles.css` y varios scripts en `js/` que proporcionan navegación, efectos y lógica de formularios. El sitio está pensado para presentar proyectos/juegos, captar leads a través de los formularios de `contacto` y `presupuesto`, y mostrar habilidades y proyectos.

Análisis UI/UX (Principios de Diseño)
-------------------------------------

- **Legibilidad:** Utilizar tipografías sans-serif modernas y escalas tipográficas claras (H1, H2, H3, cuerpo) para mejorar lectura en pantallas pequeñas. Asegurar contraste suficiente entre texto y fondo (WCAG AA mínimo).
- **Jerarquía de información:** Priorizar hero visual en `index.html` con CTA principal (ej. "Ver proyectos") y un resumen breve encima del pliegue. Filtrar y resaltar tarjetas de proyectos en la sección `Productos`.
- **Branding y paleta:** Proponer una paleta limitada (1 color primario vibrante para CTAs, 1 secundario neutro, 2 tonos de fondo) y consistencia en iconografía y espaciado.

Propuestas técnicas de layout (CSS Grid / Flexbox)
-------------------------------------------------

- **Navegación:** Implementar `display: flex` para la barra de navegación y usar `justify-content: space-between` para separar logo y acciones; en móvil, collapse a menú hamburguesa.
- **Index (Hero y contenido principal):** Usar CSS Grid para una estructura de dos filas: hero (imagen/fondo + texto) y contenido principal. Grid permite fácilmente reordenar columnas en pantallas grandes (ej. hero con imagen a la derecha, texto a la izquierda) y apilar en móvil.
  - Ejemplo conceptual:
    - `.hero { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; }`
    - `@media (max-width: 768px) { .hero { grid-template-columns: 1fr; } }`
- **Productos (catálogo de tarjetas):** Usar CSS Grid con auto-fill/auto-fit para tarjetas responsivas:
  - `.grid-catalog { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }`
  - Cada tarjeta debe tener una imagen, título, etiquetas (género/plataforma) y una acción (ver detalles/CTA).
- **Footer y formularios:** Formularios alineados con Flexbox para etiquetas y campos; en mobile, apilar elementos con `flex-direction: column`.

Mejoras de interacción (JavaScript / jQuery / Animate.css)
---------------------------------------------------------

- **Validación de formularios (`contacto` y `presupuesto`):** Usar jQuery para validar campos requeridos antes de enviar.
  - Reglas básicas: email con regex simple, campos obligatorios no vacíos, teléfono opcional con validación si se ingresa.
  - Mostrar errores inline y evitar recarga hasta que la validación pase.
- **Feedback tras envío:** Al enviar correctamente, mostrar un modal o banner con confirmación y una animación clara de Animate.css (ej. `animated fadeInDown`) y luego cerrar automáticamente tras 3s.
- **Animaciones funcionales en `index`:** Aplicar Animate.css para enfatizar carga de módulos importantes: por ejemplo, animar la tarjeta destacada o la CTA con `pulse` cuando el usuario hace scroll hasta esa sección (uso funcional: dirige la atención hacia la acción clave).
- **Navegación móvil (menú hamburguesa):** Implementar con jQuery una transición suave: toggle clase `is-open` en el contenedor del nav, bloquear scroll de fondo cuando el menú esté abierto y animar los ítems con staggered delays para mejor sensación.
- **Filtros dinámicos en Productos:** Agregar controles (checkboxes / select) y con jQuery filtrar las tarjetas por `data-genre` o `data-platform`, mostrando resultados sin recargar la página.

Contenido y estructura por página
--------------------------------

- **Index** — Objetivo: presentación y CTA.
  - Propuesta: hero visual con CTA clara, sección de proyectos destacados (carousel o grid), resumen de servicios y testimonios.
- **Productos** — Objetivo: catálogo.
  - Propuesta: grid de tarjetas con filtros por género y plataforma, búsqueda y posibilidad de ordenar por fecha o popularidad.
- **Contacto** — Objetivo: captación de leads.
  - Propuesta: formulario simple con campos esenciales, validación client-side, mensaje de confirmación animado y datos de contacto visibles.
- **Presupuesto** — Objetivo: solicitud detallada.
  - Propuesta: formulario multi-paso (jQuery) para no abrumar al usuario — pasos: Datos de contacto → Detalles del proyecto → Presupuesto estimado → Revisión y envío.

Riesgos y siguientes pasos recomendados
--------------------------------------

- **Riesgos de mantenibilidad:** mezclar demasiada lógica en `app.js` puede volver el proyecto difícil de mantener. Recomiendo modularizar los scripts por responsabilidad (ej. `forms.js`, `catalog.js`, `nav.js`).
- **Riesgo de accesibilidad:** animaciones y efectos que no respeten reduces-motion o foco accesible pueden frustrar usuarios; añadir consideraciones ARIA y preferencias reducidas.
- **Siguientes pasos técnicos:**
  - Implementar validación y feedback visual en `js/contact.js` y `js/presupuesto.js`.
  - Modularizar scripts y documentar funciones públicas.
  - Añadir tests manuales y revisar en múltiples tamaños de pantalla.

Guía rápida de estructura del proyecto
-------------------------------------

- `index.html` — Página principal.
- `css/styles.css` — Estilos globales.
- `js/` — Scripts: `app.js`, `contact.js`, `navigation.js`, `parallax.js`, `particles.js`, `skills-stats.js`, `typing-effect.js`, `utils.js`.
- `assets/` — Imágenes y PDFs.

Cómo ejecutar localmente
------------------------

Recomendado: servir el contenido con un servidor estático. Desde PowerShell en la raíz del proyecto:

```powershell
# Usando Python (si está instalado)
python -m http.server 8000
# o usando `npx serve` (si tienes Node.js):
npx serve -l 5000
```

Abrir en el navegador `http://localhost:8000` (o el puerto que selecciones).

Checklist de mejoras prioritarias (sprint corto)
------------------------------------------------

- [x] Añadir README con análisis (este archivo).
- [ ] Modularizar scripts en `js/` según responsabilidad.
- [ ] Implementar validación y feedback para `contact` y `presupuesto`.
- [ ] Crear layout responsive con CSS Grid para `index` y `productos`.
- [ ] Añadir filtros dinámicos en `productos`.
- [ ] Verificación de accesibilidad (WCAG básico).

Contribuciones y notas para desarrolladores
-------------------------------------------

- Mantener estilos y scripts lo más desacoplados posible.
- Documentar en comentarios las funciones públicas en `js/`.
- Antes de mergear cambios mayores, probar en mobile y desktop y revisar el rendimiento (lazy-load de imágenes, optimización de assets).

Contacto del mantenedor
-----------------------

Este README fue generado para ayudarte con un plan de mejoras y la documentación inicial. Si quieres, puedo:

- Implementar la validación jQuery para `contact.js` y `presupuesto.js`.
- Añadir markup y CSS de ejemplo para la grid de `productos`.
- Crear un menú hamburguesa funcional en `navigation.js`.

---

Fecha de generación: 11 de diciembre de 2025
