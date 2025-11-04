#!/usr/bin/env node
/**
 * Helper script to obtain a Google OAuth2 refresh token for Calendar access.
 *
 * Usage:
 *   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/get-refresh-token.js
 *
 * The script spins up a local HTTP server on port 3000, opens the browser for
 * consent, and prints the refresh token once authorization completes.
 */

const http = require('http');
const { google } = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const PORT = Number(process.env.PORT || 3000);

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Faltan GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET en el entorno.');
  process.exit(1);
}

const redirectUri = `http://localhost:${PORT}/oauth2callback`;
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: SCOPES
});

console.log('1) Abre la siguiente URL y otorga permisos:');
console.log(authUrl);
console.log('\nEsperando confirmación...');

async function maybeOpenBrowser(url) {
  try {
    const openModule = await import('open');
    await openModule.default(url, { wait: false });
  } catch (error) {
    console.warn('No se pudo abrir el navegador automáticamente. Copia la URL manualmente.');
  }
}

maybeOpenBrowser(authUrl);

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/oauth2callback')) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const code = url.searchParams.get('code');
  if (!code) {
    res.writeHead(400);
    res.end('Missing code.');
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const refreshToken = tokens.refresh_token;
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    if (refreshToken) {
      res.end(`✅ Copia el siguiente refresh token y pégalo en GOOGLE_REFRESH_TOKEN:\n\n${refreshToken}\n`);
      console.log('\nRefresh token obtenido:');
      console.log(refreshToken);
    } else {
      res.end('La respuesta no incluyó refresh_token. Asegúrate de usar prompt=consent y access_type=offline.');
      console.error('No se recibió refresh_token.');
    }
  } catch (error) {
    console.error('Error intercambiando el código por tokens:', error);
    res.writeHead(500);
    res.end('Error obtaining tokens. Revisa la consola.');
  } finally {
    setTimeout(() => {
      server.close(() => process.exit(0));
    }, 1000);
  }
});

server.listen(PORT, () => {
  console.log(`Servidor temporal escuchando en http://localhost:${PORT}`);
});
