# EDACK Books website

A small, fast, one-page author website for EDACK Books.
No database, no login, no cookies, no tracking.

## Run it on your computer

1. Install the tools (only needed once): `npm install`
2. Start the site: `npm run dev`
3. Open http://localhost:3000 in your browser.

The site restarts by itself when you save a file. Press Ctrl+C to stop it.

## Change a picture (for example the Watcher's Guide cover)

1. Put the new picture in the `images/` folder with the **same file name**
   (for example `images/watchers-guide-cover.jpg`).
2. Run: `npm run images`
3. In `docs/index.html`, update the picture's description (the `alt="..."` text).

The script makes small, fast copies in `docs/images/`. Your originals in `images/` are never changed.

## Placeholders to fill in

- **Pinterest and TikTok:** in `docs/index.html`, near the bottom, replace
  `YOUR-PINTEREST-NAME` and `YOUR-TIKTOK-NAME`.

## What's where

| Folder or file | What it is |
| --- | --- |
| `server.js` | Shows the site on your computer (`npm run dev`). GitHub Pages doesn't use it. |
| `docs/` | Everything visitors see: the page, styles, script, pictures, fonts, PDFs. |
| `docs/downloads/` | The free certificate PDFs. |
| `images/` | Your original, full-size pictures (not on the website). |
| `scripts/optimise-images.js` | Makes the small, fast pictures and icons. |

## Where the site lives

The live site is on GitHub Pages: https://dai1964.github.io/edack-books/

Every upload to the `main` branch puts the `docs` folder online by itself, in about a minute
(GitHub repo Settings → Pages → "Deploy from a branch", `main`, `/docs`).

**Moving to your own domain later:** replace `https://dai1964.github.io/edack-books` in
`docs/index.html`, `docs/robots.txt` and `docs/sitemap.xml`, and change `/edack-books/`
to `/` in `docs/404.html`.

**Railway instead (optional):** `server.js` also works on Railway. Start command `npm start`,
health check path `/health`.

## Fonts

Fredoka and Nunito are stored in `docs/fonts/` under the SIL Open Font License
(see `docs/fonts/OFL-LICENSE.txt`).
