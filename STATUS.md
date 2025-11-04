# Estado del Proyecto: Integración con Google Calendar

## Objetivo del Proyecto

El objetivo es implementar un sistema de reservas para un sitio web de sesiones de fotos navideñas. El sistema debe integrarse con el calendario de Google del propietario del sitio para mostrar la disponibilidad en tiempo real y permitir a los clientes reservar citas.

## Estado Actual

La lógica de reservas ahora vive directamente en funciones serverless dentro del directorio `api/` (compatibles con Vercel). Cada función usa una **service account** de Google para interactuar con el calendario sin necesidad de flujos OAuth interactivos.

- `api/status.js` confirma que la cuenta de servicio puede autenticarse y expone parámetros básicos del calendario.
- `api/availability.js` genera los slots disponibles para la fecha solicitada y filtra los horarios ocupados con buffers configurables.
- `api/reservations.js` valida el formulario, comprueba conflictos y crea el evento en Google Calendar enviando invitaciones al cliente.

El frontend (`src/components/ReservationForm.jsx`) consume estos endpoints a través de `src/lib/api.js`, que ahora apunta por defecto a `/api`.

## Último Error Encontrado

Se verificó que la aplicación frontend ahora se monta correctamente con React y Tailwind después de reorganizar el código dentro de `src/`. La sección de reservas ya consume los nuevos endpoints para presentar disponibilidad en tiempo real y crear eventos.

## Próximos Pasos

1.  **Cargar la service account en Vercel:** Pegar `GOOGLE_SERVICE_ACCOUNT_JSON` y compartir el calendario con ese correo para habilitar la escritura de eventos.

2.  **Ajustar variables de entorno opcionales:** `CALENDAR_ID`, horarios y buffers según la agenda real.

3.  **Validaciones extra (opcional):** Captcha, pagos o recordatorios adicionales.

4.  **Monitorear errores:** Revisar los logs de Vercel ante conflictos o respuestas 503 para asegurarse de que la cuenta de servicio mantiene los permisos.
