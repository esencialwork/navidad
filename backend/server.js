console.log('Starting server...');

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const port = Number(process.env.PORT) || 3000;

console.log('Express app created');

// Paths to local credential storage (fallback)
const SERVICE_ACCOUNT_PATH = path.join(__dirname, 'service-account.json');

// Scopes required for the application
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const CALENDAR_ID = process.env.CALENDAR_ID || 'primary';
const TIMEZONE = process.env.TIMEZONE || 'America/Mexico_City';
const SLOT_DURATION_MINUTES = Number(process.env.SLOT_DURATION_MINUTES || 30);
const START_HOUR = Number(process.env.START_HOUR || 9);
const END_HOUR = Number(process.env.END_HOUR || 18);
const BUFFER_MINUTES = Number(process.env.BUFFER_MINUTES || 5);

let authClient;
let authReady = false;

function normalizeOrigin(origin) {
  if (!origin) {
    return '';
  }
  try {
    const url = new URL(origin);
    return url.origin;
  } catch {
    return origin.replace(/\/$/, '');
  }
}

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean)
  : [];

console.log('Allowed origins:', allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'ALL');

app.use(cors({
  origin(origin, callback) {
    const normalizedOrigin = normalizeOrigin(origin);
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    console.warn(`Blocked by CORS: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());

console.log(`Service account fallback path: ${SERVICE_ACCOUNT_PATH}`);

function loadServiceAccount() {
  let config;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.log('Loading service account from GOOGLE_SERVICE_ACCOUNT_JSON');
    config = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } else {
    console.log('Reading service-account.json from disk...');
    const content = fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8');
    config = JSON.parse(content);
  }

  const { client_email: clientEmail, private_key: privateKey } = config;
  if (!clientEmail || !privateKey) {
    throw new Error('El JSON de la service account debe incluir client_email y private_key.');
  }

  const formattedKey = privateKey.includes('\\n') ? privateKey.replace(/\\n/g, '\n') : privateKey;

  authClient = new google.auth.JWT({
    email: clientEmail,
    key: formattedKey,
    scopes: SCOPES,
    subject: process.env.GOOGLE_IMPERSONATED_USER || undefined
  });
  console.log(`Service account loaded for ${clientEmail}`);
}

async function ensureAuthorized() {
  if (!authClient) {
    throw new Error('Service account client not initialized.');
  }
  if (authReady) {
    return;
  }
  await authClient.authorize();
  authReady = true;
  console.log('Service account authorized successfully');
}

function isAuthorized() {
  return Boolean(authReady);
}

function getCalendarClient() {
  return google.calendar({
    version: 'v3',
    auth: authClient
  });
}

function toLocaleLabel(date) {
  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TIMEZONE
  }).format(date);
}

function getOffsetMinutes(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const tzPart = parts.find((part) => part.type === 'timeZoneName');
  if (!tzPart) {
    return 0;
  }

  const match = tzPart.value.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);
  if (!match) {
    return 0;
  }
  const hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  const totalMinutes = Math.abs(hours) * 60 + minutes;
  return hours < 0 ? -totalMinutes : totalMinutes;
}

function makeZonedDate(dateStr, hour, minute, timeZone) {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) {
    throw new Error('Fecha inválida. Usa formato YYYY-MM-DD.');
  }
  const utcBase = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offsetMinutes = getOffsetMinutes(utcBase, timeZone);
  return new Date(utcBase.getTime() - offsetMinutes * 60000);
}

function generateSlotsForDate(dateStr) {
  const slots = [];

  const startMinutes = START_HOUR * 60;
  const endMinutes = END_HOUR * 60;

  for (let minutes = startMinutes; minutes + SLOT_DURATION_MINUTES <= endMinutes; minutes += SLOT_DURATION_MINUTES) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const slotStart = makeZonedDate(dateStr, hours, mins, TIMEZONE);
    const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MINUTES * 60000);

    slots.push({
      start: slotStart,
      end: slotEnd,
      label: toLocaleLabel(slotStart)
    });
  }
  return slots;
}

function hasOverlap(slot, eventStart, eventEnd) {
  return slot.start < eventEnd && slot.end > eventStart;
}

function normalizeEventTime(event) {
  if (!event) {
    return null;
  }
  if (event.dateTime) {
    return new Date(event.dateTime);
  }
  // Full-day event
  if (event.date) {
    return makeZonedDate(event.date, 0, 0, TIMEZONE);
  }
  return null;
}

(async () => {
  try {
    loadServiceAccount();
    await ensureAuthorized();
  } catch (err) {
    console.log('Error setting up Google service account client:', err);
  }
})();

app.get('/api/status', (req, res) => {
  res.json({
    authorized: isAuthorized(),
    calendarId: CALENDAR_ID,
    timezone: TIMEZONE,
    slotDurationMinutes: SLOT_DURATION_MINUTES,
    startHour: START_HOUR,
    endHour: END_HOUR,
    usingServiceAccount: true
  });
});

app.get('/api/availability', async (req, res) => {
  if (!isAuthorized()) {
    return res.status(503).json({ error: 'Google Calendar no está autorizado. Verifica la service account.' });
  }

  try {
    await ensureAuthorized();
  } catch (error) {
    console.error('Error ensuring authorization', error);
    authReady = false;
    return res.status(503).json({ error: 'No se pudo autorizar la service account.' });
  }

  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'El parámetro "date" es obligatorio (formato YYYY-MM-DD).' });
  }

  const calendar = getCalendarClient();

  try {
    const slots = generateSlotsForDate(date);
    if (slots.length === 0) {
      return res.json({
        date,
        timezone: TIMEZONE,
        slotDurationMinutes: SLOT_DURATION_MINUTES,
        slots: []
      });
    }

    const dayStart = makeZonedDate(date, 0, 0, TIMEZONE);
    const dayEnd = makeZonedDate(date, 23, 59, TIMEZONE);
    dayEnd.setSeconds(59, 999);

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
      const slotWithBufferStart = new Date(slot.start.getTime() - BUFFER_MINUTES * 60000);
      const slotWithBufferEnd = new Date(slot.end.getTime() + BUFFER_MINUTES * 60000);
      return !existingEvents.some((event) => hasOverlap(
        { start: slotWithBufferStart, end: slotWithBufferEnd },
        event.start,
        event.end
      ));
    });

    res.json({
      date,
      timezone: TIMEZONE,
      slotDurationMinutes: SLOT_DURATION_MINUTES,
      slots: availableSlots.map((slot) => ({
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        label: slot.label
      }))
    });
  } catch (error) {
    console.error('Error fetching availability', error);
    res.status(500).json({ error: 'No se pudo obtener la disponibilidad. Revisa los logs del servidor.' });
  }
});

app.post('/api/reservations', async (req, res) => {
  if (!isAuthorized()) {
    return res.status(503).json({ error: 'Google Calendar no está autorizado. Verifica la service account.' });
  }

  try {
    await ensureAuthorized();
  } catch (error) {
    console.error('Error ensuring authorization', error);
    authReady = false;
    return res.status(503).json({ error: 'No se pudo autorizar la service account.' });
  }

  const { name, email, phone, notes, slotStart, slotEnd, marketingConsent } = req.body || {};

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
    // Check for conflicts before creating the event
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
      sendUpdates: 'all' // ensure attendees receive an email confirmation
    });

    res.status(201).json({
      success: true,
      eventId: createdEvent.data.id,
      htmlLink: createdEvent.data.htmlLink
    });
  } catch (error) {
    console.error('Error creating reservation', error);
    res.status(500).json({ error: 'No se pudo crear la reservación. Intenta nuevamente.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
