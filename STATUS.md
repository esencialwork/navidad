# Estado del Proyecto: Integración con Google Calendar

## Objetivo del Proyecto

El objetivo es implementar un sistema de reservas para un sitio web de sesiones de fotos navideñas. El sistema debe integrarse con el calendario de Google del propietario del sitio para mostrar la disponibilidad en tiempo real y permitir a los clientes reservar citas.

## Estado Actual

La lógica de reservas vive en funciones serverless dentro del directorio `api/`, ejecutadas en Vercel. Estas funciones usan **OAuth2 con refresh token** para actuar como la cuenta de Gmail del cliente y crear eventos con invitaciones.

- `api/status.js` valida que las credenciales OAuth sean válidas y expone la configuración del calendario.
- `api/availability.js` genera los slots disponibles y respeta buffers configurable.
- `api/reservations.js` valida el formulario, detecta conflictos y crea el evento en Google Calendar (enviando la invitación al asistente).

El frontend (`src/components/ReservationForm.jsx`) consume estos endpoints mediante `src/lib/api.js`, que apunta a `/api`.

## Último Error Encontrado

Se verificó que la aplicación frontend ahora se monta correctamente con React y Tailwind después de reorganizar el código dentro de `src/`. La sección de reservas ya consume los nuevos endpoints para presentar disponibilidad en tiempo real y crear eventos.

## Próximos Pasos

1.  **Cargar las credenciales OAuth en Vercel:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` y el `GOOGLE_REFRESH_TOKEN` obtenido con el script auxiliar.

2.  **Configurar variables opcionales:** `CALENDAR_ID`, horarios y buffers según la agenda real (si usas un calendario distinto al `primary`, asegúrate de que la cuenta autorizada tenga permisos para editarlo).

3.  **Validaciones extra (opcional):** Captcha, pagos o recordatorios adicionales.

4.  **Monitorear errores:** Revisar los logs de Vercel ante conflictos o respuestas 403/503 para rotar el refresh token si se revoca el acceso.
