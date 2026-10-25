# EDACK Books website

A small, fast, one-page author website for EDACK Books.
No database, no login, no cookies, no tracking.

## Run it on your computer

1. Install the tools (only needed once): `npm install`
2. Start the site: `npm run dev`
3. Open http://localhost:3000 in your browser.

The site restarts by itself when you save a file. Press Ctrl+C to stop it.

Note: on your computer the free game looks unstyled, because `server.js` blocks its built-in styles.
The live site is fine. GitHub Pages doesn't use `server.js`.

## Change a picture (for example the Watcher's Guide cover)

1. Put the new picture in the `images/` folder with the **same file name**
   (for example `images/watchers-guide-cover.jpg`).
2. Run: `npm run images`
3. In `docs/index.html`, update the picture's description (the `alt="..."` text).

The script makes small, fast copies in `docs/images/`. Your originals in `images/` are never changed.

**The EDACK logo** has its own script: `node scripts/make-logo-images.js`
(it reads `images/edack-logo.png`, `edack-logo-512.png` and `edack-logo-180.png`).

## Add a free printable

See `HOW-TO-ADD-A-FREEBIE.md`. The list lives in `docs/freebies.json`.

## Social links

Pinterest and TikTok are hidden for now. Their code is kept inside a `<template>` near the bottom of
`docs/index.html`, with a note saying how to bring them back once you have real addresses.

## What's where

| Folder or file | What it is |
| --- | --- |
| `server.js` | Shows the site on your computer (`npm run dev`). GitHub Pages doesn't use it. |
| `docs/` | Everything visitors see: the page, styles, script, pictures, fonts, PDFs. |
| `docs/CNAME` | Tells GitHub the site's domain: `www.edackdavid.com`. |
| `docs/freebies.json` | The list of free printables. |
| `docs/downloads/` | The free printable PDFs. |
| `docs/audio/` | The free Chapter One recordings. |
| `docs/games/` | The free Lean Heroes game. |
| `images/` | Your original, full-size pictures (not on the website). |
| `scripts/optimise-images.js` | Makes the small, fast pictures and icons. |
| `scripts/make-logo-images.js` | Makes the EDACK logo pictures and icons. |
| `HOW-TO-ADD-A-FREEBIE.md` | Five steps to add a new free printable. |

## Where the site lives

The live site is on GitHub Pages, at **https://www.edackdavid.com/**
(the old address https://dai1964.github.io/edack-books/ sends visitors there by itself).

Every upload to the `main` branch puts the `docs` folder online by itself, in about a minute
(GitHub repo Settings → Pages → "Deploy from a branch", `main`, `/docs`).

**If the domain ever changes:** update `docs/CNAME`, and replace `https://www.edackdavid.com` in
`docs/index.html`, `docs/robots.txt` and `docs/sitemap.xml`.

**Railway instead (optional):** `server.js` also works on Railway. Start command `npm start`,
health check path `/health`.

## Fonts

Fredoka and Nunito are stored in `docs/fonts/` under the SIL Open Font License
(see `docs/fonts/OFL-LICENSE.txt`).
