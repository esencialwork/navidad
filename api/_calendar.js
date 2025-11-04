const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const CALENDAR_ID = process.env.CALENDAR_ID || 'primary';
const TIMEZONE = process.env.TIMEZONE || 'America/Mexico_City';
const SLOT_DURATION_MINUTES = Number(process.env.SLOT_DURATION_MINUTES || 30);
const START_HOUR = Number(process.env.START_HOUR || 9);
const END_HOUR = Number(process.env.END_HOUR || 18);
const BUFFER_MINUTES = Number(process.env.BUFFER_MINUTES || 5);

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

let oauthClient;
let authorized = false;

function getOAuthClient() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error('Define GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET y GOOGLE_REFRESH_TOKEN en las variables de entorno.');
  }
  if (!oauthClient) {
    oauthClient = new google.auth.OAuth2({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    });
    oauthClient.setCredentials({ refresh_token: REFRESH_TOKEN });
  }
  return oauthClient;
}

async function ensureAuthorized() {
  const client = getOAuthClient();
  try {
    await client.getAccessToken();
    authorized = true;
  } catch (error) {
    authorized = false;
    throw error;
  }
  return client;
}

function resetAuth() {
  authorized = false;
  if (oauthClient) {
    oauthClient.setCredentials({ refresh_token: REFRESH_TOKEN });
  }
}

function getCalendarClient() {
  const auth = getOAuthClient();
  return google.calendar({ version: 'v3', auth });
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
      end: slotEnd
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
  if (event.date) {
    return makeZonedDate(event.date, 0, 0, TIMEZONE);
  }
  return null;
}

module.exports = {
  CALENDAR_ID,
  TIMEZONE,
  SLOT_DURATION_MINUTES,
  START_HOUR,
  END_HOUR,
  BUFFER_MINUTES,
  ensureAuthorized,
  getCalendarClient,
  resetAuth,
  generateSlotsForDate,
  hasOverlap,
  normalizeEventTime
};
