// Makes the Pinterest pin picture for the Summer Fayre game (1000 x 1500, 2:3).
// Run it with: node scripts/make-fayre-pin.js
// It only makes ONE new file: docs/images/pin-summer-fayre.jpg. It never changes the originals in /images.

const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const ARTWORK = path.join(ROOT, 'images', 'lean-heroes-artwork-no-text.png');
const LOGO = path.join(ROOT, 'images', 'edack-logo-512.png');
const OUT = path.join(ROOT, 'docs', 'images', 'pin-summer-fayre.jpg');

const WIDTH = 1000;
const HEIGHT = 1500;
const ART_HEIGHT = 760;

const BROWN = '#3A2210';
const CREAM = '#FDF3DF';
const LEMON = '#FFE36E';
const GREEN = '#2F6B3A';
const FONT = "'Trebuchet MS', 'Segoe UI', Arial, sans-serif";

// A simple drawn lemon (no emoji, so it looks the same everywhere)
const lemon = (x, y, size, turn) => `
  <g transform="translate(${x} ${y}) rotate(${turn}) scale(${size / 100})">
    <ellipse cx="0" cy="0" rx="50" ry="36" fill="${LEMON}" stroke="${BROWN}" stroke-width="5"/>
    <path d="M-50 0 l-10 -4 l2 8 z M50 0 l10 -4 l-2 8 z" fill="${LEMON}" stroke="${BROWN}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-6 -36 q6 -18 22 -20" fill="none" stroke="${GREEN}" stroke-width="5" stroke-linecap="round"/>
  </g>`;

const textPanel = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect y="${ART_HEIGHT - 40}" width="${WIDTH}" height="${HEIGHT - ART_HEIGHT + 40}" rx="40" fill="${CREAM}"/>
  <rect x="60" y="${ART_HEIGHT + 30}" width="300" height="56" rx="28" fill="${LEMON}" stroke="${BROWN}" stroke-width="3"/>
  <text x="210" y="${ART_HEIGHT + 68}" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="700" fill="${BROWN}">FREE GAME</text>
  <text x="60" y="${ART_HEIGHT + 180}" font-family="${FONT}" font-size="84" font-weight="700" fill="${BROWN}">The Lean Heroes</text>
  <text x="60" y="${ART_HEIGHT + 275}" font-family="${FONT}" font-size="84" font-weight="700" fill="${BROWN}">at the Summer Fayre</text>
  <text x="60" y="${ART_HEIGHT + 370}" font-family="${FONT}" font-size="44" fill="${BROWN}">Plan a lemonade stall. Run it on</text>
  <text x="60" y="${ART_HEIGHT + 425}" font-family="${FONT}" font-size="44" fill="${BROWN}">fayre day. Learn SIPOC.</text>
  <text x="60" y="${ART_HEIGHT + 520}" font-family="${FONT}" font-size="38" font-weight="700" fill="${GREEN}">Ages 8 to 11 · Works on phones</text>
  <text x="60" y="${HEIGHT - 60}" font-family="${FONT}" font-size="40" font-weight="700" fill="${BROWN}">edackdavid.com</text>
  ${lemon(850, ART_HEIGHT + 60, 120, -18)}
  ${lemon(900, ART_HEIGHT + 400, 90, 20)}
</svg>`;

async function main() {
  const art = await sharp(ARTWORK).resize(WIDTH, ART_HEIGHT, { fit: 'cover', position: 'centre' }).toBuffer();
  const logo = await sharp(LOGO).resize(150, 150).toBuffer();

  const info = await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: CREAM } })
    .composite([
      { input: art, top: 0, left: 0 },
      { input: Buffer.from(textPanel), top: 0, left: 0 },
      { input: logo, top: HEIGHT - 190, left: WIDTH - 200 }
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(OUT);

  console.log(`  ${path.basename(OUT)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
