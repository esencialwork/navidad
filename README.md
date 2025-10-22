# Sesiones Navideñas Landing Page

Este repositorio contiene una landing page responsiva para promocionar sesiones fotográficas navideñas. El proyecto está construido con React, Vite y Tailwind CSS e incluye varios componentes reutilizables para facilitar el mantenimiento.

## Características

- **Sección hero** con título, subtítulo, llamada a la acción y un contador regresivo accesible.
- **Componentes modulares** para contenido como tarjetas de beneficios, proceso, precios, testimonios, políticas y un formulario de reserva.
- **Modo oscuro** habilitado mediante clases de Tailwind (`dark:`).
- **Diseño responsivo** con barra de navegación móvil y CTA pegajoso en dispositivos pequeños.
- **Accesibilidad**: botones con estados de foco, temporizador con `aria-live`, y semántica adecuada para formularios y elementos expandibles.

## Instalación y uso

1. Clona el repositorio e instala las dependencias:

   ```bash
   npm install
   ```

2. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

3. Abre tu navegador en `http://localhost:5173` para ver la página.

4. Para construir la versión de producción:

   ```bash
   npm run build
   ```

## Personalización

- Puedes modificar los textos, precios y cantidad de fotos en `src/App.jsx` donde se definen los objetos de contenido.
- Las variables de Tailwind y fuentes se encuentran en `tailwind.config.js` y en las utilidades de Tailwind en `src/index.css`.
- Para cambiar la imagen del hero, edita la propiedad `src` del `img` en `src/components/Hero.jsx`.

## Licencia

Este proyecto se entrega “tal cual” para uso educativo y comercial. Si lo utilizas, te agradeceríamos una mención o enlace al repositorio original.