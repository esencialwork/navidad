const {
  CALENDAR_ID,
  TIMEZONE,
  SLOT_DURATION_MINUTES,
  BUFFER_MINUTES,
  ensureAuthorized,
  getCalendarClient,
  generateSlotsForDate,
  hasOverlap,
  normalizeEventTime
} = require('./_calendar');

function formatRange(start, end) {
  const formatter = new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TIMEZONE
  });
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const date = req.query?.date;
  if (!date) {
    return res.status(400).json({ error: 'El parámetro "date" es obligatorio (formato YYYY-MM-DD).' });
  }

  try {
    await ensureAuthorized();
  } catch (error) {
    console.error('Authorization error', error);
    return res.status(503).json({ error: 'No se pudo autorizar la service account. Revisa GOOGLE_SERVICE_ACCOUNT_JSON.' });
  }

  const calendar = getCalendarClient();

  try {
    const slots = generateSlotsForDate(date);
    if (slots.length === 0) {
      return res.status(200).json({
        date,
        timezone: TIMEZONE,
        slotDurationMinutes: SLOT_DURATION_MINUTES,
        slots: []
      });
    }

    const dayStart = new Date(slots[0].start);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(slots[slots.length - 1].end);
    dayEnd.setHours(23, 59, 59, 999);

    const eventsResult = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    const existingEvents = (eventsResult.data.items || [])
      .map((event) => {
        const start = normalizeEventTime(event.start);
        const end = normalizeEventTime(event.end);
        if (!start || !end) {
          return null;
        }
        return { start, end };
      })
      .filter(Boolean);

    const availableSlots = slots.filter((slot) => {
      const startWithBuffer = new Date(slot.start.getTime() - BUFFER_MINUTES * 60000);
      const endWithBuffer = new Date(slot.end.getTime() + BUFFER_MINUTES * 60000);
      return !existingEvents.some((event) => hasOverlap(
        { start: startWithBuffer, end: endWithBuffer },
        event.start,
        event.end
      ));
    });

    res.status(200).json({
      date,
      timezone: TIMEZONE,
      slotDurationMinutes: SLOT_DURATION_MINUTES,
      slots: availableSlots.map((slot) => ({
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        label: formatRange(slot.start, slot.end)
      }))
    });
  } catch (error) {
    console.error('Error fetching availability', error);
    res.status(500).json({ error: 'No se pudo obtener la disponibilidad. Revisa los logs del servidor.' });
  }
};
