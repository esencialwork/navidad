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

### Variables de entorno del frontend

1. Copia `.env.example` a `.env`.
2. Ajusta `VITE_API_URL` para apuntar al backend (por defecto `http://localhost:3000/api`).
3. Ajusta cualquier otra variable que necesites (por ejemplo, la URL base del backend si lo despliegas).

### Backend (Google Calendar)

El proyecto ya no necesita un backend separado: las funciones de reserva viven en `api/` y se ejecutan como Serverless Functions en Vercel.

1. **Crea una service account** (Google Cloud → IAM → Service Accounts) y descarga su JSON.
2. **Comparte tu calendario** con el correo de la service account con permisos de “Hacer cambios y administrar uso compartido”.
3. **Variables de entorno necesarias** (en Vercel → Settings → Environment Variables):
   - `GOOGLE_SERVICE_ACCOUNT_JSON` – pega el JSON completo de la service account (respeta comillas y saltos con `\n`).
   - `CALENDAR_ID` – ID del calendario destino (`primary` o el ID específico).
   - `TIMEZONE`, `START_HOUR`, `END_HOUR`, `SLOT_DURATION_MINUTES`, `BUFFER_MINUTES` (opcional, tienen valores por defecto).
   - `VITE_API_URL=/api` (o deja el valor por defecto del `.env.example`).
   - Opcional: `GOOGLE_IMPERSONATED_USER` si quieres que la service account actúe como un usuario de Google Workspace.
4. **Redeploy** en Vercel. Las rutas `/api/availability`, `/api/reservations` y `/api/status` se ejecutan con esas variables y crean eventos directamente en Google Calendar.

> Para probar en local usa `vercel dev` (requiere `npm i -g vercel`). Exporta las mismas variables de entorno antes de ejecutar.

## Personalización

- Puedes modificar los textos, precios y cantidad de fotos en `src/App.jsx` donde se definen los objetos de contenido.
- Las variables de Tailwind y fuentes se encuentran en `tailwind.config.js` y en las utilidades de Tailwind en `src/index.css`.
- Para cambiar la imagen del hero, edita la propiedad `src` del `img` en `src/components/Hero.jsx`.
- La lógica de reservas se encuentra en `src/components/ReservationForm.jsx` y `src/lib/api.js`. Ajusta mensajes, validaciones o la integración con backends alternos según tus necesidades.

## Licencia

Este proyecto se entrega “tal cual” para uso educativo y comercial. Si lo utilizas, te agradeceríamos una mención o enlace al repositorio original.
