# Integración con Google Calendar (Service Account)

Sigue estos pasos para que la landing cree reservas directamente en tu calendario:

1. **Proyecto en Google Cloud**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/), crea/selecciona un proyecto y habilita la API de Google Calendar.

2. **Service account**
   - Navega a *IAM y administración → Cuentas de servicio*.
   - Crea una cuenta (ej. `calendar-reservas`).
   - En la pestaña *Claves*, genera una nueva clave JSON y descárgala.

3. **Comparte tu calendario**
   - Abre Google Calendar con la cuenta propietaria del calendario.
   - Ajustes → Configuración de mis calendarios → selecciona el calendario.
   - En *Compartir con personas específicas* agrega el correo de la service account con permiso "Hacer cambios y administrar uso compartido".

4. **Variables de entorno (Vercel)**
   - En el proyecto de Vercel ve a *Settings → Environment Variables*.
   - Crea:
     - `GOOGLE_SERVICE_ACCOUNT_JSON` (pega el JSON completo; respeta `\n` en la clave privada).
     - `CALENDAR_ID` (`primary` o el ID del calendario compartido).
     - `TIMEZONE`, `START_HOUR`, `END_HOUR`, `SLOT_DURATION_MINUTES`, `BUFFER_MINUTES` si quieres personalizar defaults.
     - `VITE_API_URL=/api` (el valor por defecto del repositorio ya apunta ahí).
     - Opcional: `GOOGLE_IMPERSONATED_USER` si usas Google Workspace y quieres delegar en un usuario en lugar de la cuenta de servicio.

5. **Redeploy**
   - Realiza un nuevo deploy en Vercel. Las funciones en `api/` leerán esas variables y crearán eventos en Google Calendar.

6. **Pruebas**
   - Visita `/api/status` en tu dominio para confirmar `authorized: true`.
   - Haz una reserva en la landing y verifica que aparezca en el calendario y se envíe la invitación al cliente.

> Para desarrollo local instala la CLI de Vercel (`npm i -g vercel`), exporta las mismas variables y ejecuta `vercel dev` (sirve la landing y las funciones serverless simultáneamente).
