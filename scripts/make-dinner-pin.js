// Makes the Pinterest pin picture for the Dinner Disaster game (1000 x 1500, 2:3).
// Run it with: node scripts/make-dinner-pin.js
// It shows a SAMPLE certificate with a blank name line, never a child's name.
// It only makes ONE new file: docs/images/pins/dinner-disaster-certificate-pin.png. It never changes the originals in /images.

const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TAFF = path.join(ROOT, 'images', 'master-taff.jpg');
const LOGO = path.join(ROOT, 'images', 'edack-logo-512.png');
const OUT = path.join(ROOT, 'docs', 'images', 'pins', 'dinner-disaster-certificate-pin.png');

const WIDTH = 1000;
const HEIGHT = 1500;

const BROWN = '#3A2210';
const CREAM = '#FDF3DF';
const GOLD = '#FFC850';
const CORAL = '#FF6E5A';
const GREEN = '#2F6B3A';
const PAPER = '#FFFBEA';
const FONT = "'Trebuchet MS', 'Segoe UI', Arial, sans-serif";

// The certificate card
const CARD = { x: 60, y: 210, w: 880, h: 960 };
const TAFF_SIZE = 170;
const TAFF_TOP = CARD.y + 740;
const TAFF_LEFT = CARD.x + 70;

// Five DMAIC ticks, drawn (no emoji or tick characters, so it looks the same everywhere)
const STEPS = ['Define', 'Measure', 'Analyse', 'Improve', 'Control'];
const tickRow = (y) => {
  const pillW = 150;
  const gap = 14;
  const startX = (WIDTH - (STEPS.length * pillW + (STEPS.length - 1) * gap)) / 2;
  return STEPS.map((step, i) => {
    const x = startX + i * (pillW + gap);
    return `
    <rect x="${x}" y="${y}" width="${pillW}" height="96" rx="18" fill="#EAFBF0" stroke="${GREEN}" stroke-width="3"/>
    <path d="M${x + 58} ${y + 30} l12 12 l22 -22" fill="none" stroke="${GREEN}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${x + pillW / 2}" y="${y + 80}" text-anchor="middle" font-family="${FONT}" font-size="25" font-weight="700" fill="${BROWN}">${step}</text>`;
  }).join('');
};

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${CREAM}"/>

  <rect x="60" y="50" width="280" height="56" rx="28" fill="${GOLD}" stroke="${BROWN}" stroke-width="3"/>
  <text x="200" y="88" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="700" fill="${BROWN}">FREE PRINTABLE</text>
  <text x="60" y="175" font-family="${FONT}" font-size="54" font-weight="700" fill="${BROWN}">Lean Heroes: Dinner Disaster!</text>

  <rect x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="28" fill="${PAPER}" stroke="${GOLD}" stroke-width="10"/>
  <rect x="${CARD.x + 18}" y="${CARD.y + 18}" width="${CARD.w - 36}" height="${CARD.h - 36}" rx="18" fill="none" stroke="${GOLD}" stroke-width="4"/>

  <text x="500" y="${CARD.y + 100}" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="700" letter-spacing="4" fill="${GREEN}">LEAN HEROES CERTIFICATE</text>
  <text x="500" y="${CARD.y + 185}" text-anchor="middle" font-family="${FONT}" font-size="72" font-weight="700" fill="${CORAL}">Lean Hero:</text>
  <text x="500" y="${CARD.y + 265}" text-anchor="middle" font-family="${FONT}" font-size="62" font-weight="700" fill="${CORAL}">Dinner Disaster Solved</text>

  <text x="500" y="${CARD.y + 345}" text-anchor="middle" font-family="${FONT}" font-size="34" fill="${BROWN}">This certifies that</text>
  <line x1="190" y1="${CARD.y + 450}" x2="810" y2="${CARD.y + 450}" stroke="${BROWN}" stroke-width="4"/>
  <text x="500" y="${CARD.y + 515}" text-anchor="middle" font-family="${FONT}" font-size="32" fill="${BROWN}">has completed the DMAIC cycle</text>
  <text x="500" y="${CARD.y + 557}" text-anchor="middle" font-family="${FONT}" font-size="32" fill="${BROWN}">and saved dinner from disaster!</text>

  ${tickRow(CARD.y + 600)}

  <text x="${TAFF_LEFT + TAFF_SIZE + 36}" y="${TAFF_TOP + 80}" font-family="${FONT}" font-size="44" font-style="italic" fill="${BROWN}">Master Taff</text>
  <line x1="${TAFF_LEFT + TAFF_SIZE + 36}" y1="${TAFF_TOP + 98}" x2="${CARD.x + CARD.w - 70}" y2="${TAFF_TOP + 98}" stroke="${BROWN}" stroke-width="2"/>
  <text x="${TAFF_LEFT + TAFF_SIZE + 36}" y="${TAFF_TOP + 136}" font-family="${FONT}" font-size="28" fill="${BROWN}">Sensei, Treehouse Dojo</text>

  <rect x="0" y="1210" width="${WIDTH}" height="110" fill="${CORAL}"/>
  <text x="500" y="1278" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="700" fill="#fff">Free game + printable certificate · ages 8–11</text>

  <text x="60" y="1440" font-family="${FONT}" font-size="44" font-weight="700" fill="${BROWN}">edackdavid.com</text>
</svg>`;

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  // Master Taff's portrait, cut into a circle
  const circle = Buffer.from(`<svg width="${TAFF_SIZE}" height="${TAFF_SIZE}"><circle cx="${TAFF_SIZE / 2}" cy="${TAFF_SIZE / 2}" r="${TAFF_SIZE / 2}" fill="#fff"/></svg>`);
  const taff = await sharp(TAFF)
    .extract({ left: 120, top: 120, width: 840, height: 840 })
    .resize(TAFF_SIZE, TAFF_SIZE)
    .composite([{ input: circle, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const logo = await sharp(LOGO).resize(150, 150).toBuffer();

  const info = await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: CREAM } })
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: taff, top: TAFF_TOP, left: TAFF_LEFT },
      { input: logo, top: HEIGHT - 175, left: WIDTH - 200 }
    ])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(OUT);

  console.log(`  ${path.relative(ROOT, OUT)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
