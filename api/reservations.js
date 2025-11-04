const {
  CALENDAR_ID,
  TIMEZONE,
  SLOT_DURATION_MINUTES,
  BUFFER_MINUTES,
  ensureAuthorized,
  getCalendarClient,
  hasOverlap,
  normalizeEventTime
} = require('./_calendar');
const { readJsonBody } = require('./_json');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await ensureAuthorized();
  } catch (error) {
    console.error('Authorization error', error);
    return res.status(503).json({ error: 'No se pudo autorizar la service account. Revisa GOOGLE_SERVICE_ACCOUNT_JSON.' });
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const { name, email, phone, notes, slotStart, slotEnd, marketingConsent } = payload || {};

  if (!name || !email || !phone || !slotStart) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: name, email, phone, slotStart.' });
  }

  const startDate = new Date(slotStart);
  if (Number.isNaN(startDate.getTime())) {
    return res.status(400).json({ error: 'slotStart inválido. Debe ser un ISO string.' });
  }

  const computedEnd = slotEnd ? new Date(slotEnd) : new Date(startDate.getTime() + SLOT_DURATION_MINUTES * 60000);
  if (Number.isNaN(computedEnd.getTime()) || computedEnd <= startDate) {
    return res.status(400).json({ error: 'slotEnd inválido.' });
  }

  const calendar = getCalendarClient();

  try {
    const conflicts = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date(startDate.getTime() - BUFFER_MINUTES * 60000).toISOString(),
      timeMax: new Date(computedEnd.getTime() + BUFFER_MINUTES * 60000).toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    const conflictingEvent = (conflicts.data.items || []).find((event) => {
      const eventStart = normalizeEventTime(event.start);
      const eventEnd = normalizeEventTime(event.end);
      return hasOverlap({ start: startDate, end: computedEnd }, eventStart, eventEnd);
    });

    if (conflictingEvent) {
      return res.status(409).json({ error: 'El horario seleccionado ya no está disponible.' });
    }

    const descriptionLines = [
      `Nombre: ${name}`,
      `Correo: ${email}`,
      `WhatsApp: ${phone}`,
      `Notas: ${notes || 'N/A'}`,
      `Uso promocional aprobado: ${marketingConsent ? 'Sí' : 'No'}`
    ].join('\n');

    const eventConfig = {
      summary: `Sesión Navideña - ${name}`,
      description: `Reservación creada desde la landing.\n\n${descriptionLines}`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: TIMEZONE
      },
      end: {
        dateTime: computedEnd.toISOString(),
        timeZone: TIMEZONE
      },
      attendees: [
        { email, displayName: name }
      ],
      extendedProperties: {
        private: {
          phone,
          notes: notes || '',
          marketingConsent: marketingConsent ? 'true' : 'false'
        }
      }
    };

    const createdEvent = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: eventConfig,
      sendUpdates: 'all'
    });

    res.status(201).json({
      success: true,
      eventId: createdEvent.data.id,
      htmlLink: createdEvent.data.htmlLink
    });
  } catch (error) {
    console.error('Error creating reservation', error);
    if (error?.response?.status === 403) {
      return res.status(403).json({ error: 'La service account no tiene permisos para escribir en este calendario.' });
    }
    res.status(500).json({ error: 'No se pudo crear la reservación. Intenta nuevamente.' });
  }
};
