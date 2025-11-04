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

## 3. Crea las credenciales de OAuth 2.0

1.  En el menú de navegación de la izquierda, ve a "APIs y servicios" > "Pantalla de consentimiento de OAuth".
2.  Selecciona el tipo de usuario "Externo" y haz clic en "Crear".
3.  Ingresa un nombre para la aplicación (por ejemplo, "Reservas Navidad"), tu correo electrónico de soporte y la información de contacto del desarrollador. Luego, haz clic en "Guardar y continuar".
4.  En la pantalla de "Alcances", no agregues ningún alcance por ahora. Haz clic en "Guardar y continuar".
5.  En la pantalla de "Usuarios de prueba", agrega tu dirección de correo electrónico de Gmail. Haz clic en "Guardar y continuar".
6.  Revisa el resumen y haz clic en "Volver al panel".

7.  Ahora, ve a "APIs y servicios" > "Credenciales".
8.  Haz clic en "+ Crear credenciales" y selecciona "ID de cliente de OAuth".
9.  Selecciona "Aplicación web" como tipo de aplicación.
10. Dale un nombre (por ejemplo, "Cliente web de Reservas Navidad").
11. En "Orígenes de JavaScript autorizados", agrega `http://localhost:3000` y `http://localhost:5173` (o el puerto que uses para el frontend).
12. En "URIs de redireccionamiento autorizados", agrega `http://localhost:3000/oauth2callback`.
13. Haz clic en "Crear".

## 4. Descarga y guarda tus credenciales

1.  Después de crear el ID de cliente de OAuth, aparecerá una ventana con tu ID de cliente y tu secreto de cliente. **No los compartas con nadie.**
2.  Haz clic en "Descargar JSON". Se descargará un archivo llamado `client_secret_...json`.
3.  Renombra este archivo a `credentials.json`.
4.  Mueve el archivo `credentials.json` a la carpeta `backend` de este proyecto.

**¡Importante!** El archivo `credentials.json` contiene información sensible. No debe ser subido a ningún repositorio público. Me aseguraré de agregarlo al archivo `.gitignore` para que no se incluya en los commits de git.

## 5. Configura las variables de entorno

1.  En la carpeta `backend`, duplica el archivo `.env.example` (incluido en este repo) y renómbralo a `.env`.
2.  Ajusta los valores según tu setup:
    - `CALENDAR_ID`: el calendario donde quieres crear las citas (`primary` funciona para tu cuenta principal).
    - `TIMEZONE`: zona horaria de tus sesiones (ej. `America/Mexico_City`).
    - Horario y duración (`START_HOUR`, `END_HOUR`, `SLOT_DURATION_MINUTES`, `BUFFER_MINUTES`) si necesitas cambiarlos.
    - `PORT`: cambia este valor si `3000` está ocupado (ej. `4000`). Recuerda actualizar `VITE_API_URL` en el frontend si usas otro puerto.
    - `ALLOWED_ORIGINS`: incluye las URLs desde donde llamarás a la API (por defecto `http://localhost:5173` para Vite).

## 6. Instala dependencias e inicia el backend

1.  Dentro de `backend/`, instala dependencias: `npm install`.
2.  Arranca el servidor: `npm start`. El backend quedará disponible en `http://localhost:PUERTO` (usa el puerto definido en `.env`).
3.  Abre `http://localhost:PUERTO/authorize` en tu navegador y acepta los permisos para la app. Esto generará el archivo `token.json` (también confidencial, ya agregado al `.gitignore`).
4.  Verifica el estado en `http://localhost:PUERTO/api/status`. Debe mostrar `authorized: true`.

## 7. Conecta el frontend

1.  En la raíz del proyecto (no en `backend/`), crea un archivo `.env` si aún no existe.
2.  Define la variable `VITE_API_URL=http://localhost:PUERTO/api` (usa el mismo puerto configurado en el backend; cámbialo cuando despliegues).
3.  Ejecuta `npm install` y `npm run dev` en la raíz para levantar la landing. El formulario de reservas ya consultará disponibilidad y creará eventos en tu Google Calendar.

> Recuerda: `credentials.json` y `token.json` contienen datos sensibles. Mantén ambos fuera de tu repositorio público y gestiona las claves como secretos cuando despliegues el backend en producción.
