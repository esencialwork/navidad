# Integración con Google Calendar (OAuth con refresh token)

Sigue estos pasos para que la landing cree reservas en tu calendario y envíe invitaciones desde tu cuenta de Gmail.

1. **Habilita la API**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/), selecciona tu proyecto o crea uno nuevo.
   - Habilita la Google Calendar API en “APIs & Services → Library”.

2. **Crea un OAuth Client (tipo Web)**
   - “APIs & Services → Credentials → Create credentials → OAuth client ID”.
   - Tipo “Web application”.
   - Añade `http://localhost:3000/oauth2callback` como redirect URI (sirve para el script local).
   - Guarda `client_id` y `client_secret`.

3. **Obtén el refresh token**
   - En tu terminal:
     ```bash
     GOOGLE_CLIENT_ID=tu_client_id GOOGLE_CLIENT_SECRET=tu_client_secret npm run get-refresh-token
     ```
   - Autoriza la app en el navegador. El script mostrará el `refresh_token` (cópialo).

4. **Configura las variables en Vercel**
   - En tu proyecto, ve a “Settings → Environment Variables”.
   - Agrega:
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `GOOGLE_REFRESH_TOKEN`
     - `CALENDAR_ID` (`primary` o el ID del calendario al que quieras escribir)
     - Opcionales: `TIMEZONE`, `START_HOUR`, `END_HOUR`, `SLOT_DURATION_MINUTES`, `BUFFER_MINUTES`
     - `VITE_API_URL=/api` (si deseas forzarlo; el repo ya lo usa por defecto).

5. **Redeploy**
   - Lanza un nuevo deploy en Vercel para que las funciones lean las variables. Si usas un calendario distinto al `primary`, comprueba que la cuenta que autorizaste tenga permiso de edición sobre él.

6. **Pruebas**
   - Abre `https://TU-DOMINIO/api/status` y confirma que `authorized` sea `true`.
   - Realiza una reserva desde la landing. Debes ver el evento y la invitación en tu calendario.

> En desarrollo local puedes usar `vercel dev` (tras instalar la CLI) y exportar las mismas variables antes de ejecutar.
