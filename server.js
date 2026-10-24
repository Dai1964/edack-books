// The EDACK Books web server.
// It sends the website in /docs to visitors and answers Railway's health check.

const path = require('node:path');
const express = require('express');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'docs');

// Don't tell the world which server software we use.
app.disable('x-powered-by');

// Squash text files (the page, styles, script) so they arrive faster.
app.use(compression());

// Safety settings that every modern browser understands.
// The page may only load things from this site, so nothing can sneak in a tracker.
app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': [
      "default-src 'self'",
      "img-src 'self' data:",
      "script-src 'self'",
      "style-src 'self'",
      "font-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'none'",
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  });
  next();
});

// Railway calls this to check the site is awake.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Pictures, fonts and PDFs: browsers may keep a copy for a day.
// The page, styles and script: browsers check for a newer version every time,
// so your changes show up straight away.
const ALWAYS_CHECK = ['.html', '.css', '.js', '.xml', '.txt', '.webmanifest'];

app.use(express.static(PUBLIC, {
  extensions: ['html'],
  setHeaders(res, filePath) {
    if (ALWAYS_CHECK.includes(path.extname(filePath))) {
      res.set('Cache-Control', 'no-cache');
    } else {
      res.set('Cache-Control', 'public, max-age=86400');
    }
  },
}));

// Any address that doesn't exist gets a friendly "not found" message.
app.use((req, res) => {
  res
    .status(404)
    .type('html')
    .send('<!doctype html><html lang="en-GB"><meta charset="utf-8"><title>Page not found</title>'
      + '<h1>Oops, that page has wandered off.</h1><p><a href="/">Back to EDACK Books</a></p></html>');
});

app.listen(PORT, () => {
  console.log(`EDACK Books is running on port ${PORT}`);
});
