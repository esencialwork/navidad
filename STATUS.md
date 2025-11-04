# Estado del Proyecto: Integración con Google Calendar

## Objetivo del Proyecto

El objetivo es implementar un sistema de reservas para un sitio web de sesiones de fotos navideñas. El sistema debe integrarse con el calendario de Google del propietario del sitio para mostrar la disponibilidad en tiempo real y permitir a los clientes reservar citas.

## Estado Actual

Se ha creado un servidor backend utilizando Node.js y Express (directorio `backend/`) que se integra con Google Calendar. El backend ahora:

- Gestiona el flujo OAuth y persiste el token en `token.json`.
- Expone endpoints REST en `/api`:
  - `GET /api/status` para comprobar la autorización.
  - `GET /api/availability?date=YYYY-MM-DD` para obtener horarios disponibles.
  - `POST /api/reservations` para crear una cita en Google Calendar.
- Calcula los horarios usando los parámetros configurables (`START_HOUR`, `END_HOUR`, `SLOT_DURATION_MINUTES`, `BUFFER_MINUTES`) y respeta la zona horaria.

El usuario debe contar con `credentials.json` válido y completar `/authorize` al menos una vez para generar `token.json`.

En el frontend (`src/components/ReservationForm.jsx`) se habilitó la consulta dinámica de disponibilidad y la creación de reservas mediante llamadas al backend (`src/lib/api.js`). El formulario actualiza la lista de horarios al seleccionar fecha o tras confirmar una cita.

## Último Error Encontrado

Se verificó que la aplicación frontend ahora se monta correctamente con React y Tailwind después de reorganizar el código dentro de `src/`. La sección de reservas ya consume los nuevos endpoints para presentar disponibilidad en tiempo real y crear eventos.

## Próximos Pasos

1.  **Completar autorización OAuth en entornos nuevos:** Verificar que `credentials.json` existe, iniciar el backend y visitar `/authorize` para generar `token.json`.

2.  **Configurar variables de entorno:** Ajustar `.env` en `backend/` (ID de calendario, zona horaria, orígenes permitidos) y `VITE_API_URL` en el frontend según el entorno de despliegue.

3.  **Agregar validaciones adicionales (opcional):** Considerar captcha, doble confirmación por correo o pagos en línea si se requieren.

4.  **Monitorear errores y cierres de sesión:** Añadir alertas/logs para detectar expiración de tokens o conflictos frecuentes.
