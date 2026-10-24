// Turns the original pictures in /images into small, fast WebP files in /docs/images.
// It also makes the browser-tab icons and the 1200x630 share picture.
// Run it with: npm run images
// The originals in /images are never changed.

const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'images');
const OUT = path.join(ROOT, 'docs', 'images');
const ICONS = path.join(ROOT, 'docs'); // icons live at the top of the site

// Each picture, and the widths (in pixels) to make it at.
// To swap a cover: replace the file in /images (same name), then run npm run images.
const IMAGES = [
  { file: 'lean-heroes-artwork-no-text.png', name: 'hero-artwork', widths: [640, 1080, 1600], quality: 70 },
  { file: 'lean-heroes-cover.jpg', name: 'lean-heroes-cover', widths: [480, 960] },
  { file: 'yellow-belt-certificate.jpg', name: 'yellow-belt-certificate', widths: [640, 1280] },
  { file: 'cookie-cover.jpg', name: 'cookie-cover', widths: [400, 800] },
  { file: 'watchers-guide-cover.jpg', name: 'watchers-guide-cover', widths: [400, 800] },
  { file: 'master-taff.jpg', name: 'master-taff', widths: [320, 640] },
  { file: 'lean-heroes-badge.jpg', name: 'badge', widths: [96, 192] },
];

// Browser-tab and phone home-screen icons, made from the Lean Hero badge.
const ICON_SIZES = {
  'favicon-32.png': 32,
  'apple-touch-icon.png': 180,
  'icon-192.png': 192,
  'icon-512.png': 512,
};

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

async function makeWebp({ file, name, widths, quality = 78 }) {
  const input = path.join(SRC, file);
  for (const width of widths) {
    const outFile = path.join(OUT, `${name}-${width}.webp`);
    const info = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(outFile);
    console.log(`  ${path.basename(outFile)}  ${info.width}x${info.height}  ${kb(info.size)}`);
  }
}

async function makeIcons() {
  const input = path.join(SRC, 'lean-heroes-badge.jpg');
  for (const [fileName, size] of Object.entries(ICON_SIZES)) {
    await sharp(input).resize(size, size).png().toFile(path.join(ICONS, fileName));
    console.log(`  ${fileName}  ${size}x${size}`);
  }

  // favicon.ico is for older browsers. It is just a 32px PNG with a small label in front.
  const png = await sharp(input).resize(32, 32).png().toBuffer();
  await fs.writeFile(path.join(ICONS, 'favicon.ico'), pngToIco(png, 32));
  console.log('  favicon.ico  32x32');
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

// The picture Pinterest, Facebook and others show when someone shares the site.
// A soft, blurred crop of the artwork, with the Lean Heroes cover in the middle.
async function makeShareImage() {
  const W = 1200;
  const H = 630;

  const background = await sharp(path.join(SRC, 'lean-heroes-artwork-no-text.png'))
    .resize(W, H, { fit: 'cover' })
    .blur(18)
    .modulate({ brightness: 0.75 })
    .toBuffer();

  const cover = await sharp(path.join(SRC, 'lean-heroes-cover.jpg'))
    .resize({ height: 570 })
    .toBuffer();
  const { width: coverWidth } = await sharp(cover).metadata();

  const outFile = path.join(OUT, 'share-lean-heroes.jpg');
  const info = await sharp(background)
    .composite([{ input: cover, left: Math.round((W - coverWidth) / 2), top: 30 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outFile);
  console.log(`  share-lean-heroes.jpg  ${info.width}x${info.height}  ${kb(info.size)}`);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });

  console.log('Making WebP pictures...');
  for (const image of IMAGES) {
    await makeWebp(image);
  }

  console.log('Making browser-tab icons...');
  await makeIcons();

  console.log('Making the 1200x630 share picture...');
  await makeShareImage();

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
