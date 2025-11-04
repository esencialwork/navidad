const {
  CALENDAR_ID,
  TIMEZONE,
  SLOT_DURATION_MINUTES,
  START_HOUR,
  END_HOUR,
  ensureAuthorized
} = require('./_calendar');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await ensureAuthorized();
    res.status(200).json({
      authorized: true,
      calendarId: CALENDAR_ID,
      timezone: TIMEZONE,
      slotDurationMinutes: SLOT_DURATION_MINUTES,
      startHour: START_HOUR,
      endHour: END_HOUR,
      usingServiceAccount: true
    });
  } catch (error) {
    console.error('Status check failed', error);
    res.status(503).json({
      authorized: false,
      error: 'No se pudo autorizar la service account. Verifica GOOGLE_SERVICE_ACCOUNT_JSON y los permisos del calendario.'
    });
  }
};
