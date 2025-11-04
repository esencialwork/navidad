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

El directorio `backend/` expone un servidor Express que se integra con Google Calendar para consultar disponibilidad y crear eventos.

1. Instala dependencias y crea un archivo `.env`:

   ```bash
   cd backend
   npm install
   cp .env.example .env   # ajusta los valores según tu calendario
   ```

2. Variables principales:

   - `CALENDAR_ID` – ID del calendario donde se crearán las sesiones (usa `primary` para el calendario principal).
   - `TIMEZONE` – Zona horaria de las sesiones, por defecto `America/Mexico_City`.
   - `ALLOWED_ORIGINS` – Lista separada por comas de orígenes permitidos para CORS (por ejemplo `http://localhost:5173`).
   - `SLOT_DURATION_MINUTES`, `START_HOUR`, `END_HOUR`, `BUFFER_MINUTES` – Ajustan la lógica de horarios disponibles.

3. Coloca las credenciales OAuth descargadas de Google Cloud en `backend/credentials.json` (el archivo ya está en `.gitignore`).

4. Inicia el backend y completa el flujo de autorización:

   ```bash
   npm start
   # luego abre http://localhost:3000/authorize y sigue las instrucciones
   ```

5. El frontend consume la API vía `VITE_API_URL` (añade `VITE_API_URL=http://localhost:3000/api` a tu `.env` en la raíz si cambias el puerto o despliegas el backend en otra URL).

## Personalización

- Puedes modificar los textos, precios y cantidad de fotos en `src/App.jsx` donde se definen los objetos de contenido.
- Las variables de Tailwind y fuentes se encuentran en `tailwind.config.js` y en las utilidades de Tailwind en `src/index.css`.
- Para cambiar la imagen del hero, edita la propiedad `src` del `img` en `src/components/Hero.jsx`.
- La lógica de reservas se encuentra en `src/components/ReservationForm.jsx` y `src/lib/api.js`. Ajusta mensajes, validaciones o la integración con backends alternos según tus necesidades.

## Licencia

Este proyecto se entrega “tal cual” para uso educativo y comercial. Si lo utilizas, te agradeceríamos una mención o enlace al repositorio original.
