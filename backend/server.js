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

// Paths to local credential storage
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Scopes required for the application
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events'];

const CALENDAR_ID = process.env.CALENDAR_ID || 'primary';
const TIMEZONE = process.env.TIMEZONE || 'America/Mexico_City';
const SLOT_DURATION_MINUTES = Number(process.env.SLOT_DURATION_MINUTES || 30);
const START_HOUR = Number(process.env.START_HOUR || 9);
const END_HOUR = Number(process.env.END_HOUR || 18);
const BUFFER_MINUTES = Number(process.env.BUFFER_MINUTES || 5);

let oauth2Client;
let token;

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

console.log(`Credentials path: ${CREDENTIALS_PATH}`);
console.log(`Token path: ${TOKEN_PATH}`);

function loadCredentials() {
  console.log('Reading credentials file...');
  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
  console.log('Credentials file read successfully');
  const config = JSON.parse(content);
  const webCredentials = config.web;
  if (!webCredentials) {
    throw new Error('Archivo de credenciales inválido: falta la propiedad "web".');
  }

  const {
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uris: redirectUris = [],
    javascript_origins: javascriptOrigins = []
  } = webCredentials;

  const fallbackOrigin = javascriptOrigins[0];
  const redirectUri = process.env.REDIRECT_URI || redirectUris[0] || (fallbackOrigin ? `${fallbackOrigin.replace(/\/$/, '')}/oauth2callback` : null);

  if (!clientSecret || !clientId || !redirectUri) {
    throw new Error('Credenciales incompletas: verifica client_id, client_secret y redirect URIs.');
  }

  oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  console.log(`OAuth2 client created with redirect URI: ${redirectUri}`);
}

function loadTokenFromDisk() {
  if (fs.existsSync(TOKEN_PATH)) {
    try {
      const storedToken = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
      oauth2Client.setCredentials(storedToken);
      token = storedToken;
      console.log('Token loaded from disk and applied to OAuth2 client');
    } catch (error) {
      console.warn('Failed to parse token.json. Delete the file and re-authorize if the issue persists.', error);
    }
  } else {
    console.log('token.json not found. The /authorize flow must be completed.');
  }
}

function saveTokenToDisk(tokens) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2), 'utf8');
  console.log('Token saved to disk');
}

function isAuthorized() {
  return Boolean(oauth2Client && oauth2Client.credentials && (oauth2Client.credentials.access_token || oauth2Client.credentials.refresh_token));
}

function getCalendarClient() {
  return google.calendar({
    version: 'v3',
    auth: oauth2Client
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

try {
  loadCredentials();
  loadTokenFromDisk();
} catch (err) {
  console.log('Error setting up Google OAuth client:', err);
  process.exit(1);
}

app.get('/', (req, res) => {
  res.send('Backend operativo. Usa /authorize para vincular Google Calendar o /api/status para ver el estado.');
});

// Route to start the OAuth 2.0 flow
app.get('/authorize', (req, res) => {
  if (!oauth2Client) {
    console.log('OAuth2 client not initialized');
    return res.status(500).send('OAuth2 client not initialized');
  }
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  console.log(`Generated auth URL: ${authUrl}`);
  res.redirect(authUrl);
});

// Route to handle the OAuth 2.0 callback
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    console.log('Missing code in callback');
    return res.status(400).send('Missing code');
  }
  console.log('Authorization code received. Exchanging for tokens...');
  try {
    const { tokens } = await oauth2Client.getToken(code);
    token = tokens;
    oauth2Client.setCredentials(token);
    saveTokenToDisk(tokens);
    console.log('Token obtained and set successfully');
    res.send('¡Autorización exitosa! Puedes cerrar esta pestaña.');
  } catch (error) {
    console.error('Error getting token', error);
    res.status(500).send('Error getting token');
  }
});

app.get('/api/status', (req, res) => {
  res.json({
    authorized: isAuthorized(),
    calendarId: CALENDAR_ID,
    timezone: TIMEZONE,
    slotDurationMinutes: SLOT_DURATION_MINUTES,
    startHour: START_HOUR,
    endHour: END_HOUR
  });
});

app.get('/api/availability', async (req, res) => {
  if (!isAuthorized()) {
    return res.status(503).json({ error: 'Google Calendar no está autorizado. Visita /authorize.' });
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
    return res.status(503).json({ error: 'Google Calendar no está autorizado. Visita /authorize.' });
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
  console.log(`Go to http://localhost:${port}/authorize to authenticate with Google if you have not already.`);
});
