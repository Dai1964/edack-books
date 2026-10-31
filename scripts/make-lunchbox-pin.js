// Makes the Lunchbox Lean certificate pin (1000 x 1500, 2:3) and a small certificate picture for the game and home page.
// Run it with: node scripts/make-lunchbox-pin.js <certificate picture>
// The certificate picture is a screenshot of the real certificate from games/lunchbox-lean.html,
// with sample foods and a blank name line ("Your name here"), never a child's name.
// It only makes TWO new files in docs/images/pins/:
//   lunchbox-lean-certificate-pin.png and lunchbox-lean-certificate-thumb.webp

const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const PINS = path.join(ROOT, 'docs', 'images', 'pins');
const CERT = process.argv[2];
if (!CERT) {
  console.error('Please give the certificate picture, for example: node scripts/make-lunchbox-pin.js cert.png');
  process.exit(1);
}

const WIDTH = 1000;
const HEIGHT = 1500;
const BROWN = '#3A2210';
const CREAM = '#FDF3DF';
const CORAL = '#FF6E5A';
const LEMON = '#FFE36E';
const FONT = "'Trebuchet MS', 'Segoe UI', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

// A red-and-white lunch-cloth (gingham) background, then the banner and the bottom strip
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <pattern id="gingham" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect width="60" height="60" fill="#FFFFFF"/>
      <rect width="30" height="60" fill="#E9604A" opacity="0.35"/>
      <rect width="60" height="30" fill="#E9604A" opacity="0.35"/>
    </pattern>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#gingham)"/>

  <g transform="rotate(-2 500 120)">
    <rect x="70" y="36" width="860" height="176" rx="30" fill="${CORAL}" stroke="${BROWN}" stroke-width="5"/>
    <text x="500" y="98" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="700" letter-spacing="3" fill="#FFFFFF">FREE TO PRINT!</text>
    <text x="500" y="180" text-anchor="middle" font-family="${SERIF}" font-size="72" font-weight="700" fill="#FFFFFF">Lunchbox Lean Hero</text>
  </g>

  <rect x="0" y="1254" width="${WIDTH}" height="62" fill="${BROWN}"/>
  <text x="500" y="1297" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="700" fill="${LEMON}">Free game + printable certificate · ages 8<tspan font-family="Georgia">–</tspan>11</text>
  <rect x="0" y="1316" width="${WIDTH}" height="${HEIGHT - 1316}" fill="${CREAM}"/>
  <text x="60" y="1432" font-family="${FONT}" font-size="54" font-weight="700" fill="${BROWN}">edackdavid.com</text>
</svg>`;

async function main() {
  // The certificate, tilted a little, with a soft shadow, between the banner and the strip
  const certHeight = 990;
  const cert = await sharp(CERT).resize({ height: certHeight }).png().toBuffer();
  const certInfo = await sharp(cert).metadata();
  const shadow = await sharp({ create: { width: certInfo.width + 60, height: certInfo.height + 60, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: Buffer.from(`<svg width="${certInfo.width + 60}" height="${certInfo.height + 60}"><rect x="30" y="40" width="${certInfo.width}" height="${certInfo.height}" rx="30" fill="#000" opacity="0.35"/></svg>`) }])
    .blur(14).png().toBuffer();
  const card = await sharp(shadow).composite([{ input: cert, top: 30, left: 30 }]).png().toBuffer();
  const tilted = await sharp(card).rotate(-3, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const tiltedInfo = await sharp(tilted).metadata();
  const logo = await sharp(path.join(ROOT, 'images', 'edack-logo-512.png')).resize(184, 184).toBuffer();

  const pin = path.join(PINS, 'lunchbox-lean-certificate-pin.png');
  const info = await sharp(Buffer.from(svg))
    .composite([
      { input: tilted, top: Math.round(1250 - tiltedInfo.height + 26), left: Math.round((WIDTH - tiltedInfo.width) / 2) },
      { input: logo, top: HEIGHT - 184, left: WIDTH - 214 }
    ])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(pin);
  console.log(`  ${path.relative(ROOT, pin)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);

  const thumb = path.join(PINS, 'lunchbox-lean-certificate-thumb.webp');
  const t = await sharp(CERT).resize({ width: 360 }).webp({ quality: 74 }).toFile(thumb);
  console.log(`  ${path.relative(ROOT, thumb)}  ${t.width}x${t.height}  ${Math.round(t.size / 1024)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
