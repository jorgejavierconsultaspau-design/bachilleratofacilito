# BachilleratoFacilito — rediseño 2026

## Qué se ha cambiado

### UI/UX
- Nuevo sistema visual con fondo dinámico, superficies tipo glass, profundidad y degradados.
- Nueva jerarquía tipográfica y espaciado responsive.
- Portada más dinámica y orientada a descubrir asignaturas y buscar recursos.
- Identidad cromática independiente para cada asignatura.
- Hover/microinteracciones en tarjetas, botones, navegación y buscador.
- Barra de progreso de lectura.
- Transiciones entre páginas.
- Animación específica de entrada para cada asignatura.
- Lengua incluye una animación de libro que se abre al entrar.
- Soporte para `prefers-reduced-motion`.
- Mejoras de foco visible y enlace «Saltar al contenido».
- Modo claro/oscuro mantenido y rediseñado.

### SEO técnico
- Títulos y descripción de portada mejorados.
- Metadatos `robots`, `author`, `theme-color`, Open Graph y Twitter Cards.
- Breadcrumbs mediante JSON-LD en las páginas internas.
- Sitemap actualizado al 7 de octubre de 2026.
- `404.html` configurado como `noindex,follow`.
- `asignatura.html` configurado como `noindex,follow` al ser una plantilla genérica/dinámica.
- Estructura de encabezados revisada: una H1 por página indexable.
- Atributos `alt` de imágenes existentes revisados.
- Enlace de salto accesible al contenido principal.
- Canonical conservado en las páginas existentes.
- Datos estructurados de organización conservados en la portada.

## Archivos nuevos
- `page-transitions.js`: transiciones y animaciones de entrada por asignatura.
- `motion-ui.js`: barra de progreso y microparallax de la portada.

## Nota sobre los PDF

El ZIP recibido no contiene los PDF enlazados desde algunas páginas (la carpeta `docs/` solo incluye el archivo de verificación de Google y `pdf/` está vacía). No he eliminado ni cambiado esos enlaces para no alterar el contenido existente. Si esos PDF están en tu copia real, conserva sus carpetas al publicar el proyecto.

## Capa futurista 2026 (futuro.css y motion-futuro.js)

Se añade una capa visual sobre el sistema existente sin modificar el contenido ni la estructura del DOM.

### Archivos
- `futuro.css`: tokens de tema (oscuro por defecto y claro en `html.theme-light`), tipografía Space Grotesk y JetBrains Mono, fondo aurora con rejilla, cabecera de cristal, botones con destello y onda, tarjetas con inclinación 3D y foco de luz, titular con gradiente animado, iconos de asignatura en neón, transiciones de página y `prefers-reduced-motion`.
- `motion-futuro.js`: cascada de entrada (asigna `--bf-i` a los hijos de cada rejilla), tilt 3D y foco de luz en tarjetas, botones magnéticos y halo de cursor. Solo actúa con puntero fino y sin movimiento reducido.
- `page-transitions.js`: salida en expansión circular desde el punto del clic con barrido de escáner; entrada con contracción del círculo. Se activa entre páginas internas mediante `sessionStorage`.
- `home-nav.js`: el modo oscuro es el predeterminado; el tema claro se guarda como `light` y añade `theme-light` a `<html>`.

### Notas de mantenimiento
- Las páginas cargan `futuro.css` justo después de `estilos.css`, y `motion-futuro.js` antes de cerrar `</body>`.
- `fisica.html` y `legal.html` no cargaban `home-nav.js` en la versión anterior; ahora sí, así el botón de tema y el menú móvil funcionan en esas páginas.
- El banner de cookies es modal: mientras está abierto, el resto de la página queda `inert`. Es intencionado.
- Las reglas de la capa usan `html body` o `!important` para vencer a estilos legacy con mayor especificidad. Si se elimina código legacy en el futuro, estas reglas pueden simplificarse.
- Verificado en Chromium: 40 páginas sin errores de JavaScript ni recursos 404; modo oscuro y claro; móvil sin desbordamiento horizontal; transición real entre páginas.
