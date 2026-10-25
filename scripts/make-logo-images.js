// Makes the EDACK logo pictures and icons for the website.
// Run it with: node scripts/make-logo-images.js
// It only makes NEW files (all starting with "edack-"). It never changes the originals in /images
// or any of the older pictures and icons.

const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'images');
const OUT_IMAGES = path.join(ROOT, 'docs', 'images');
const OUT_ICONS = path.join(ROOT, 'docs'); // icons live at the top of the site

const CREAM = '#FDF3DF';

// Logo widths: header (44 to 56px tall, so 112px for sharp phone screens),
// footer, and the bigger About picture (220px, so 440px for sharp screens).
const LOGO_WIDTHS = [112, 224, 440];

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

async function makeLogoWebp() {
  const input = path.join(SRC, 'edack-logo.png');
  for (const width of LOGO_WIDTHS) {
    const outFile = path.join(OUT_IMAGES, `edack-logo-${width}.webp`);
    const info = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 85, alphaQuality: 90, effort: 6 })
      .toFile(outFile);
    console.log(`  ${path.basename(outFile)}  ${info.width}x${info.height}  ${kb(info.size)}`);
  }
}

async function makeIcons() {
  const square512 = path.join(SRC, 'edack-logo-512.png');
  const square180 = path.join(SRC, 'edack-logo-180.png');

  // Browser tab and Android home screen (see-through background is fine here).
  const icons = {
    'edack-favicon-32.png': 32,
    'edack-icon-192.png': 192,
    'edack-icon-512.png': 512,
  };
  for (const [fileName, size] of Object.entries(icons)) {
    await sharp(square512).resize(size, size).png().toFile(path.join(OUT_ICONS, fileName));
    console.log(`  ${fileName}  ${size}x${size}`);
  }

  // iPhone home screen: iPhones turn a see-through background black,
  // so this one sits on cream.
  await sharp(square180)
    .resize(180, 180)
    .flatten({ background: CREAM })
    .png()
    .toFile(path.join(OUT_ICONS, 'edack-apple-touch-icon.png'));
  console.log('  edack-apple-touch-icon.png  180x180 (on cream)');

  // edack-favicon.ico is for older browsers: a 32px PNG with a small label in front.
  const png = await sharp(square512).resize(32, 32).png().toBuffer();
  await fs.writeFile(path.join(OUT_ICONS, 'edack-favicon.ico'), pngToIco(png, 32));
  console.log('  edack-favicon.ico  32x32');
}

function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one picture inside

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); // width
  entry.writeUInt8(size, 1); // height
  entry.writeUInt8(0, 2); // no colour palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // size of the picture
  entry.writeUInt32LE(header.length + entry.length, 12); // where the picture starts

  return Buffer.concat([header, entry, png]);
}

async function main() {
  await fs.mkdir(OUT_IMAGES, { recursive: true });

  console.log('Making logo pictures...');
  await makeLogoWebp();

  console.log('Making logo icons...');
  await makeIcons();

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
