// Makes two "stop scrolling" Pinterest pins (1000 x 1500, 2:3) for an A/B test:
//   A: docs/images/pins/pin-taff-factories.png            (the real photo of Taff)
//   B: docs/images/pins/pin-fix-problems-not-people.png   (the cartoon woodland friends)
// Run it with: node scripts/make-attention-pins.js
// Uses only EDACK's own photo and artwork. It only makes these two new files; it never changes any originals.

const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const PINS = path.join(ROOT, 'docs', 'images', 'pins');

const WIDTH = 1000;
const HEIGHT = 1500;
const BAND = 400; // the solid headline band at the top
const STRIP = 1340; // where the bottom strip starts

const BROWN = '#3A2210';
const CREAM = '#FDF3DF';
const GOLD = '#FFC850';
const LEMON = '#FFE36E';
const FONT = "'Trebuchet MS', 'Segoe UI', Arial, sans-serif";

// Headline band, tag and bottom strip, drawn as one SVG layer on top of the picture
function overlay({ headline, tag }) {
  const lines = headline.map((line, i) =>
    `<text x="500" y="${118 + i * 92}" text-anchor="middle" font-family="${FONT}" font-size="78" font-weight="700" fill="${CREAM}">${line}</text>`).join('');
  const tagWidth = tag.length * 21 + 70;
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${BAND}" fill="${BROWN}"/>
  ${lines}
  <rect x="${500 - tagWidth / 2}" y="${BAND - 52}" width="${tagWidth}" height="72" rx="36" fill="${GOLD}" stroke="${BROWN}" stroke-width="5"/>
  <text x="500" y="${BAND - 4}" text-anchor="middle" font-family="${FONT}" font-size="36" font-weight="700" fill="${BROWN}">${tag}</text>

  <rect y="${STRIP}" width="${WIDTH}" height="${HEIGHT - STRIP}" fill="${BROWN}"/>
  <text x="500" y="${STRIP + 62}" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="700" fill="${LEMON}">Free game + printable certificate · ages 8<tspan font-family="Georgia">–</tspan>11</text>
  <text x="500" y="${STRIP + 128}" text-anchor="middle" font-family="${FONT}" font-size="46" font-weight="700" fill="${CREAM}">edackdavid.com</text>
</svg>`);
}

// The sample Dinner Disaster Solved! certificate, small, with a white edge and a slight tilt
async function certificateCorner(turn) {
  const card = await sharp(path.join(PINS, 'dinner-disaster-certificate-thumb.webp'))
    .resize(330)
    .extend({ top: 10, bottom: 10, left: 10, right: 10, background: '#ffffff' })
    .toBuffer();
  return sharp(card).rotate(turn, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

async function makePin({ file, background, headline, tag, cornerLeft, turn }) {
  const corner = await certificateCorner(turn);
  const cornerInfo = await sharp(corner).metadata();
  const out = path.join(PINS, file);
  const info = await sharp(background)
    .composite([
      { input: overlay({ headline, tag }), top: 0, left: 0 },
      { input: corner, top: STRIP - cornerInfo.height + 30, left: cornerLeft ? 24 : WIDTH - cornerInfo.width - 24 }
    ])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`  ${path.relative(ROOT, out)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}

async function main() {
  // A: Taff's real photo, cropped close on his face and body (same shape as the pin, so nothing is stretched)
  const taff = await sharp(path.join(ROOT, 'docs', 'images', 'taff', 'taff-03-about-to-pounce.jpg'))
    .extract({ left: 0, top: 0, width: 720, height: 1080 })
    .resize(WIDTH, HEIGHT)
    .toBuffer();
  await makePin({
    file: 'pin-taff-factories.png',
    background: taff,
    headline: ['This bearded dragon', 'teaches kids how factories', 'fix problems.'],
    tag: 'Meet Master Taff',
    cornerLeft: false,
    turn: 6
  });

  // B: the cartoon woodland friends, cropped to the pin's shape
  const art = await sharp(path.join(ROOT, 'images', 'lean-heroes-artwork-no-text.png'))
    .resize({ width: WIDTH * 1.24 | 0 })
    .toBuffer();
  const artInfo = await sharp(art).metadata();
  const friends = await sharp(art)
    .extract({ left: Math.round((artInfo.width - WIDTH) / 2), top: Math.max(0, artInfo.height - HEIGHT - 40), width: WIDTH, height: HEIGHT })
    .toBuffer();
  await makePin({
    file: 'pin-fix-problems-not-people.png',
    background: friends,
    headline: ['Teach your kids to', 'fix problems,', 'not blame people.'],
    tag: '5 steps · 1 free game · 15 minutes',
    cornerLeft: true,
    turn: -6
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
