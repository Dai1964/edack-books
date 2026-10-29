// Makes the third version of the two certificate pins for Pinterest (1000 x 1500, 2:3):
// same look as version 2, with the polished wording and a bigger logo.
// Run it with: node scripts/make-certificate-pins-v3.js
// Each pin shows a SAMPLE certificate with "Your name here" and a blank date, never a child's name.
// It only makes TWO new files in docs/images/pins/:
//   dinner-disaster-certificate-pin-v3.png and summer-fayre-certificate-pin-v3.png
// It never changes the earlier pins or the originals in /images.

const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMAGES = path.join(ROOT, 'images');
const OUT_DIR = path.join(ROOT, 'docs', 'images', 'pins');

const WIDTH = 1000;
const HEIGHT = 1500;

const BROWN = '#3A2210';
const CREAM = '#FDF3DF';
const GOLD = '#FFC850';
const DEEP_GOLD = '#E0A020';
const LEMON = '#FFE36E';
const CORAL = '#FF6E5A';
const GREEN = '#2F6B3A';
const PAPER = '#FFFBEA';
const SANS = "'Trebuchet MS', 'Segoe UI', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const SCRIPT = "'Segoe Script', 'Comic Sans MS', cursive";

// ---------- Small drawing helpers (no emoji, so it looks the same everywhere) ----------
function starPoints(cx, cy, r) {
  const points = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return points.join(' ');
}

const star = (cx, cy, r, fill, stroke = BROWN, width = 3) =>
  `<polygon points="${starPoints(cx, cy, r)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;

// A ring of little stars, for around Master Taff's picture
function starRing(cx, cy, radius, count, size) {
  let out = '';
  for (let i = 0; i < count; i += 1) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    out += star(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), size, i % 2 ? GOLD : LEMON, DEEP_GOLD, 2);
  }
  return out;
}

const lemon = (x, y, size, turn) => `
  <g transform="translate(${x} ${y}) rotate(${turn}) scale(${size / 100})">
    <ellipse cx="0" cy="0" rx="50" ry="36" fill="${LEMON}" stroke="${BROWN}" stroke-width="5"/>
    <path d="M-50 0 l-10 -4 l2 8 z M50 0 l10 -4 l-2 8 z" fill="${LEMON}" stroke="${BROWN}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-6 -36 q6 -18 22 -20" fill="none" stroke="${GREEN}" stroke-width="5" stroke-linecap="round"/>
  </g>`;

// Fayre bunting: a string with coloured flags
function bunting(y, sag) {
  const colours = [CORAL, GOLD, GREEN, '#FFFFFF', CORAL, GOLD, GREEN, '#FFFFFF', CORAL, GOLD];
  let flags = '';
  const step = WIDTH / colours.length;
  colours.forEach((colour, i) => {
    const x = i * step + 10;
    const t = (i + 0.5) / colours.length;
    const top = y + sag * 4 * t * (1 - t);
    flags += `<path d="M${x} ${top} L${x + step - 20} ${top} L${x + (step - 20) / 2} ${top + 70} Z" fill="${colour}" stroke="${BROWN}" stroke-width="3" stroke-linejoin="round"/>`;
  });
  return `<path d="M0 ${y} Q${WIDTH / 2} ${y + 2 * sag} ${WIDTH} ${y}" fill="none" stroke="${BROWN}" stroke-width="4"/>${flags}`;
}

const dataUri = (buffer, type) => `data:${type};base64,${buffer.toString('base64')}`;

// ---------- The certificate itself (drawn at 0,0, then tilted onto the pin) ----------
const CW = 860;
const CH = 830;

function certificate({ title, lines, steps, collect, taff, badge }) {
  const stepGap = 150;
  const firstStep = CW / 2 - stepGap * 2;
  const stepStars = steps.map(([letter, word], i) => {
    const x = firstStep + i * stepGap;
    return `
      ${star(x, 470, 44, GOLD, DEEP_GOLD, 4)}
      <text x="${x}" y="484" text-anchor="middle" font-family="${SERIF}" font-size="35" font-weight="700" fill="${BROWN}">${letter}</text>
      <text x="${x}" y="538" text-anchor="middle" font-family="${SANS}" font-size="24" font-weight="700" fill="${BROWN}">${word}</text>`;
  }).join('');

  const corner = (x, y) => star(x, y, 16, GOLD, DEEP_GOLD, 2);

  return `
    <rect x="12" y="20" width="${CW}" height="${CH}" rx="26" fill="#000" opacity="0.28" filter="url(#soft)"/>
    <rect x="0" y="0" width="${CW}" height="${CH}" rx="26" fill="${PAPER}" stroke="${GOLD}" stroke-width="14"/>
    <rect x="26" y="26" width="${CW - 52}" height="${CH - 52}" rx="16" fill="none" stroke="${DEEP_GOLD}" stroke-width="3"/>
    <rect x="36" y="36" width="${CW - 72}" height="${CH - 72}" rx="12" fill="none" stroke="${GOLD}" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/>
    ${corner(58, 58)}${corner(CW - 58, 58)}${corner(58, CH - 58)}${corner(CW - 58, CH - 58)}

    <!-- Sticky tape at the top corners, as if it's stuck on the fridge -->
    <rect x="-30" y="-14" width="170" height="46" fill="${CORAL}" opacity="0.55" transform="rotate(-28 55 9)"/>
    <rect x="${CW - 140}" y="-14" width="170" height="46" fill="${CORAL}" opacity="0.55" transform="rotate(28 ${CW - 55} 9)"/>

    <text x="${CW / 2}" y="118" text-anchor="middle" font-family="${SERIF}" font-size="76" font-weight="700" fill="${BROWN}">${title[0]}</text>
    <text x="${CW / 2}" y="194" text-anchor="middle" font-family="${SERIF}" font-size="76" font-weight="700" fill="${BROWN}">${title[1]}</text>

    <text x="${CW / 2}" y="248" text-anchor="middle" font-family="${SANS}" font-size="29" fill="${BROWN}">This award goes to</text>
    <text x="${CW / 2}" y="308" text-anchor="middle" font-family="${SCRIPT}" font-size="46" fill="#B39A7C">Your name here</text>
    <line x1="150" y1="326" x2="${CW - 150}" y2="326" stroke="${BROWN}" stroke-width="3"/>
    <text x="${CW / 2}" y="370" text-anchor="middle" font-family="${SANS}" font-size="27" fill="${BROWN}">${lines[0]}</text>
    <text x="${CW / 2}" y="402" text-anchor="middle" font-family="${SANS}" font-size="27" fill="${BROWN}">${lines[1]}</text>

    ${stepStars}

    <!-- Master Taff, with a ring of little stars, his signature and a blank date -->
    ${starRing(150, 640, 82, 16, 9)}
    <clipPath id="taff-circle"><circle cx="150" cy="640" r="62"/></clipPath>
    <image href="${taff}" x="88" y="578" width="124" height="124" clip-path="url(#taff-circle)"/>
    <circle cx="150" cy="640" r="62" fill="none" stroke="${DEEP_GOLD}" stroke-width="4"/>
    <text x="262" y="618" font-family="${SCRIPT}" font-size="42" fill="${BROWN}">Master Taff</text>
    <line x1="262" y1="632" x2="590" y2="632" stroke="${BROWN}" stroke-width="2"/>
    <text x="262" y="664" font-family="${SANS}" font-size="24" font-style="italic" fill="${BROWN}">Sensei, Treehouse Dojo</text>
    <text x="262" y="702" font-family="${SANS}" font-size="24" font-weight="700" fill="${BROWN}">Date:</text>
    <line x1="332" y1="704" x2="560" y2="704" stroke="${BROWN}" stroke-width="2"/>

    <!-- The "I'm a Lean Hero!" badge as the seal, with ribbon tails -->
    <path d="M688 668 l-22 66 l28 -14 l16 24 l16 -72 z" fill="${CORAL}" stroke="${BROWN}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M752 668 l22 66 l-28 -14 l-16 24 l-16 -72 z" fill="${GREEN}" stroke="${BROWN}" stroke-width="3" stroke-linejoin="round"/>
    <image href="${badge}" x="652" y="572" width="136" height="136"/>

    <text x="${CW / 2}" y="770" text-anchor="middle" font-family="${SANS}" font-size="22" font-weight="700" fill="${GREEN}">${collect}</text>`;
}

function pin({ background, hook, cert, strip }) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <filter id="soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>
  ${background}

  <!-- The hook -->
  <g transform="rotate(-2 500 120)">
    <rect x="70" y="36" width="860" height="176" rx="30" fill="${CORAL}" stroke="${BROWN}" stroke-width="5"/>
    <text x="500" y="98" text-anchor="middle" font-family="${SANS}" font-size="40" font-weight="700" letter-spacing="3" fill="#FFFFFF">${hook[0]}</text>
    <text x="500" y="180" text-anchor="middle" font-family="${SERIF}" font-size="72" font-weight="700" fill="#FFFFFF">${hook[1]}</text>
  </g>

  <g transform="translate(70 400) rotate(-3 ${CW / 2} ${CH / 2})">
    ${cert}
  </g>

  <rect x="0" y="1254" width="${WIDTH}" height="62" fill="${BROWN}"/>
  <text x="500" y="1297" text-anchor="middle" font-family="${SANS}" font-size="34" font-weight="700" fill="${LEMON}">${strip.replace('–', '<tspan font-family="Georgia">–</tspan>')}</text>
  <text x="60" y="1432" font-family="${SANS}" font-size="54" font-weight="700" fill="${BROWN}">edackdavid.com</text>
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const taff = dataUri(await sharp(path.join(IMAGES, 'master-taff.jpg'))
    .extract({ left: 120, top: 120, width: 840, height: 840 }).resize(300, 300).jpeg({ quality: 88 }).toBuffer(), 'image/jpeg');
  const badge = dataUri(await sharp(path.join(IMAGES, 'lean-heroes-badge.jpg'))
    .resize(336, 336)
    .composite([{ input: Buffer.from('<svg width="336" height="336"><circle cx="168" cy="168" r="166" fill="#fff"/></svg>'), blend: 'dest-in' }])
    .png().toBuffer(), 'image/png');
  const logo = await sharp(path.join(IMAGES, 'edack-logo-512.png')).resize(184, 184).toBuffer();
  const strip = 'Free game + printable certificate · ages 8–11';
  const hook = ['FREE TO PRINT!', 'Lean Hero Certificate'];

  // The colourful Lean Heroes artwork across the top of the Dinner Disaster pin
  const art = await sharp(path.join(IMAGES, 'lean-heroes-artwork-no-text.png'))
    .resize(WIDTH, 1242).extract({ left: 0, top: 400, width: WIDTH, height: 760 }).toBuffer();

  const pins = [
    {
      file: 'dinner-disaster-certificate-pin-v3.png',
      base: art,
      background: `<rect y="560" width="${WIDTH}" height="${HEIGHT - 560}" fill="${CREAM}"/>
        <rect y="520" width="${WIDTH}" height="80" fill="${CREAM}" opacity="0.6"/>`,
      cert: certificate({
        title: ['Dinner Disaster', 'Solved!'],
        lines: ['who used all five Lean Hero steps to find', 'what went wrong and save Friday dinner!'],
        collect: 'Certificate 1 of 2 · Collect the Summer Fayre one too!',
        steps: [['D', 'Define'], ['M', 'Measure'], ['A', 'Analyse'], ['I', 'Improve'], ['C', 'Control']],
        taff, badge
      })
    },
    {
      file: 'summer-fayre-certificate-pin-v3.png',
      base: null,
      background: `<rect width="${WIDTH}" height="${HEIGHT}" fill="#E3F2E1"/>
        <rect y="900" width="${WIDTH}" height="${HEIGHT - 900}" fill="${CREAM}"/>
        ${bunting(226, 28)}
        ${lemon(130, 352, 84, -20)}${lemon(330, 340, 64, 15)}${lemon(670, 342, 70, -10)}${lemon(870, 354, 84, 22)}`,
      cert: certificate({
        title: ['Fayre', 'Champion!'],
        lines: ['who mapped the whole lemonade stall with SIPOC,', 'from suppliers to happy customers!'],
        collect: 'Certificate 2 of 2 · Collect the Dinner Disaster one too!',
        steps: [['S', 'Suppliers'], ['I', 'Inputs'], ['P', 'Process'], ['O', 'Outputs'], ['C', 'Customers']],
        taff, badge
      })
    }
  ];

  for (const p of pins) {
    const svg = pin({ background: p.background, hook, cert: p.cert, strip });
    const layers = [];
    if (p.base) layers.push({ input: p.base, top: 0, left: 0 });
    layers.push({ input: Buffer.from(svg), top: 0, left: 0 });
    layers.push({ input: logo, top: HEIGHT - 184, left: WIDTH - 214 });
    const out = path.join(OUT_DIR, p.file);
    const info = await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: CREAM } })
      .composite(layers)
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toFile(out);
    console.log(`  ${path.relative(ROOT, out)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
