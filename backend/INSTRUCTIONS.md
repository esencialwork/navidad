# Instrucciones para obtener las credenciales de la API de Google Calendar

Sigue estos pasos para obtener las credenciales necesarias para conectar tu calendario de Google con el sitio web.

## 1. Crea un nuevo proyecto en Google Cloud Console

1.  Ve a la [Google Cloud Console](https://console.cloud.google.com/).
2.  Haz clic en el selector de proyectos (al lado del logo de Google Cloud) y selecciona o crea un nuevo proyecto.
3.  Dale un nombre al proyecto (por ejemplo, "Reservas Navidad") y haz clic en "Crear".

## 2. Habilita la API de Google Calendar

1.  En el menú de navegación de la izquierda, ve a "APIs y servicios" > "Biblioteca".
2.  Busca "Google Calendar API" y selecciónala.
3.  Haz clic en "Habilitar".

## 3. Crea una service account

1.  En el menú de navegación, ve a "IAM y administración" > "Cuentas de servicio".
2.  Haz clic en "Crear cuenta de servicio".
3.  Asigna un nombre (por ejemplo, `calendar-reservas`) y termina el asistente (no necesita roles adicionales en este paso).
4.  Una vez creada, haz clic sobre la cuenta y ve a la pestaña "Claves".
5.  Pulsa "Agregar clave" > "Crear nueva clave" > "JSON" y descárgala. **No la compartas.**
6.  Renombra el archivo a `service-account.json` si planeas guardarlo en `backend/`.

## 4. Comparte tu calendario con la service account

1.  Abre Google Calendar con la cuenta propietaria del calendario de reservas.
2.  Ve a "Ajustes" > "Configuración de mis calendarios" > selecciona el calendario.
3.  En "Compartir con personas específicas", agrega el correo de la service account (`...@...gserviceaccount.com`) y dale permiso "Hacer cambios y administrar uso compartido".

Con esto la cuenta de servicio podrá leer y crear eventos en tu calendario sin un flujo OAuth interactivo.

## 5. Configura las variables de entorno

1.  En la carpeta `backend`, duplica el archivo `.env.example` (incluido en este repo) y renómbralo a `.env`.
2.  Ajusta los valores según tu setup:
    - `CALENDAR_ID`: el calendario donde quieres crear las citas (`primary` funciona para tu cuenta principal).
    - `TIMEZONE`: zona horaria de tus sesiones (ej. `America/Mexico_City`).
    - Horario y duración (`START_HOUR`, `END_HOUR`, `SLOT_DURATION_MINUTES`, `BUFFER_MINUTES`) si necesitas cambiarlos.
    - `PORT`: cambia este valor si `3000` está ocupado (ej. `4000`). Recuerda actualizar `VITE_API_URL` en el frontend si usas otro puerto.
    - `ALLOWED_ORIGINS`: incluye las URLs desde donde llamarás a la API (por defecto `http://localhost:5173` para Vite).
    - `GOOGLE_SERVICE_ACCOUNT_JSON`: pega aquí el contenido completo del JSON que descargaste, o deja el campo vacío y coloca el archivo `service-account.json` en la carpeta `backend/`.
    - Si necesitas actuar como un usuario específico (delegación en cuentas corporativas), define `GOOGLE_IMPERSONATED_USER` con su correo.

## 6. Instala dependencias e inicia el backend

1.  Dentro de `backend/`, instala dependencias: `npm install`.
2.  Arranca el servidor: `npm start`. El backend quedará disponible en `http://localhost:PUERTO` (usa el puerto definido en `.env`).
3.  Verifica el estado en `http://localhost:PUERTO/api/status`. Debe mostrar `authorized: true` y `usingServiceAccount: true`. Si aparece `false`, revisa que el JSON y los permisos del calendario sean correctos.

## 7. Conecta el frontend

1.  En la raíz del proyecto (no en `backend/`), crea un archivo `.env` si aún no existe.
2.  Define la variable `VITE_API_URL=http://localhost:PUERTO/api` (usa el mismo puerto configurado en el backend; cámbialo cuando despliegues).
3.  Ejecuta `npm install` y `npm run dev` en la raíz para levantar la landing. El formulario de reservas ya consultará disponibilidad y creará eventos en tu Google Calendar.

> Recuerda: el JSON de la service account contiene una clave privada. No lo subas al repositorio público, guárdalo solo como secreto en tus despliegues.

## 8. Despliegue en Google Cloud Run

Si quieres que el backend esté disponible 24/7 sin depender de tu máquina local:

1. **Prepara las variables**
   - Asegúrate de tener el JSON de la service account disponible (puedes usar `GOOGLE_SERVICE_ACCOUNT_JSON`).
   - Define `ALLOWED_ORIGINS` con tu dominio público (p. ej. `https://navidad-drab.vercel.app`).

2. **Construye la imagen y súbela a Artifact Registry / Container Registry**

   Desde la raíz del proyecto (donde está la carpeta `backend/`):

   ```bash
   gcloud config set project TU_PROJECT_ID
   gcloud builds submit --tag gcr.io/TU_PROJECT_ID/navidad-backend ./backend
   ```

3. **Despliega en Cloud Run**

   ```bash
   gcloud run deploy navidad-backend \
     --image gcr.io/TU_PROJECT_ID/navidad-backend \
     --region=us-central1 \
     --allow-unauthenticated \
     --set-env-vars CALENDAR_ID=primary,TIMEZONE=America/Mexico_City,START_HOUR=9,END_HOUR=18,SLOT_DURATION_MINUTES=30,BUFFER_MINUTES=5,ALLOWED_ORIGINS=https://navidad-drab.vercel.app,GOOGLE_SERVICE_ACCOUNT_JSON="$(cat backend/service-account.json)"
   ```

   Ajusta los valores según tus necesidades. Cloud Run asignará automáticamente el puerto en `PORT`, que Express ya respeta.

4. **Apunta la landing al backend en la nube**

   En Vercel (o donde hospedes el frontend), define la variable `VITE_API_URL=https://TU-SERVICIO.run.app/api`. Redeploya la landing para que use la nueva URL.

> **Importante:** El JSON de la service account contiene la clave privada. Usa Secrets Manager o variables de entorno seguras en tu plataforma de hosting y rota la clave si sospechas que se filtró.
