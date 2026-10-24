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
3. In `public/index.html`, update the picture's description (the `alt="..."` text).

The script makes small, fast copies in `public/images/`. Your originals in `images/` are never changed.

## Placeholders to fill in

- **Web address:** replace `https://edack-books.up.railway.app` with your real address in
  `public/index.html`, `public/robots.txt` and `public/sitemap.xml`.
- **Pinterest and TikTok:** in `public/index.html`, near the bottom, replace
  `YOUR-PINTEREST-NAME` and `YOUR-TIKTOK-NAME`.

## What's where

| Folder or file | What it is |
| --- | --- |
| `server.js` | The server that sends the website to visitors. |
| `public/` | Everything visitors see: the page, styles, script, pictures, fonts, PDFs. |
| `public/downloads/` | The free certificate PDFs. |
| `images/` | Your original, full-size pictures (not on the website). |
| `scripts/optimise-images.js` | Makes the small, fast pictures and icons. |

## On Railway

- Start command: `npm start`
- Health check path: `/health`
- Railway sets the port by itself.

## Fonts

Fredoka and Nunito are stored in `public/fonts/` under the SIL Open Font License
(see `public/fonts/OFL-LICENSE.txt`).
