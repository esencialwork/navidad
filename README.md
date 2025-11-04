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
2. `VITE_API_URL` apunta a `/api` por defecto; ajústalo solo si necesitas llamar a otro dominio.
3. Ajusta cualquier otra variable que necesites (por ejemplo horarios o zona horaria).

### Backend (Google Calendar)

Las funciones serverless en `api/` utilizan OAuth2 con tu propia cuenta de Google. Necesitas un refresh token para que puedan crear eventos e invitar asistentes.

1. **Crea un OAuth Client** en Google Cloud (APIs & Services → Credentials → *Create credentials* → *OAuth client ID* → *Web application*). Anota el `client_id` y `client_secret` y agrega `http://localhost:3000/oauth2callback` como redirect URI.
2. **Obtén el refresh token** ejecutando el helper incluido:

   ```bash
   GOOGLE_CLIENT_ID=tu_client_id GOOGLE_CLIENT_SECRET=tu_client_secret npm run get-refresh-token
   ```

   Se abrirá el navegador. Autoriza la app y el script imprimirá el `refresh_token`.

3. **Configura las variables en Vercel** (Settings → Environment Variables):
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
   - `CALENDAR_ID` (por ejemplo `primary`)
   - Opcionales: `TIMEZONE`, `START_HOUR`, `END_HOUR`, `SLOT_DURATION_MINUTES`, `BUFFER_MINUTES`
   - `VITE_API_URL=/api` (el valor por defecto en `.env.example` ya apunta ahí)

4. **Redeploy** la app. Las rutas `/api/availability`, `/api/reservations` y `/api/status` quedarán activas y las reservas enviarán invitaciones desde tu cuenta de Gmail.
   Si usas un calendario distinto al `primary`, asegúrate de que ese calendario pertenezca o esté compartido con la misma cuenta que autorizaste.

> Para desarrollo local puedes usar `vercel dev` (requiere `npm i -g vercel`) o replicar las variables de entorno y consumir las funciones desplegadas.

## Personalización

- Puedes modificar los textos, precios y cantidad de fotos en `src/App.jsx` donde se definen los objetos de contenido.
- Las variables de Tailwind y fuentes se encuentran en `tailwind.config.js` y en las utilidades de Tailwind en `src/index.css`.
- Para cambiar la imagen del hero, edita la propiedad `src` del `img` en `src/components/Hero.jsx`.
- La lógica de reservas se encuentra en `src/components/ReservationForm.jsx` y `src/lib/api.js`. Ajusta mensajes, validaciones o la integración con backends alternos según tus necesidades.

## Licencia

Este proyecto se entrega “tal cual” para uso educativo y comercial. Si lo utilizas, te agradeceríamos una mención o enlace al repositorio original.
