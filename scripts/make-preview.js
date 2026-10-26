// Makes a PREVIEW copy of the website, for checking changes before they go live.
// Run it with: node scripts/make-preview.js <folder>
// It copies docs/ into <folder> and changes ONLY the copy:
//   - leaves out CNAME (it would clash with the live www.edackdavid.com)
//   - adds <meta name="robots" content="noindex"> to every page
//   - replaces robots.txt with one that blocks everything
//   - points the 404 page's links at /edack-books-preview/
// Nothing in docs/ is changed.

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'docs');
const PREVIEW_PATH = '/edack-books-preview/';
const NOINDEX = '<meta name="robots" content="noindex">';

const target = process.argv[2];
if (!target) {
  console.error('Please say where to put the preview, for example: node scripts/make-preview.js ../preview');
  process.exit(1);
}
const OUT = path.resolve(target);

// Never write into the website itself
if (OUT === SOURCE || OUT.startsWith(SOURCE + path.sep) || OUT === ROOT) {
  console.error('The preview folder must be outside the website folder.');
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(SOURCE, OUT, { recursive: true, filter: (src) => path.basename(src) !== 'CNAME' });

let pages = 0;
for (const file of fs.readdirSync(OUT, { recursive: true })) {
  if (!file.endsWith('.html')) continue;
  const full = path.join(OUT, file);
  let html = fs.readFileSync(full, 'utf8');
  if (!/<meta name="robots"/i.test(html)) {
    html = html.replace(/(<meta charset="utf-8">)/i, `$1\n${NOINDEX}`);
  }
  if (path.basename(file) === '404.html' && path.dirname(file) === '.') {
    html = html.replace(/(href)="\/(?!\/)/g, `$1="${PREVIEW_PATH}`);
  }
  fs.writeFileSync(full, html);
  pages += 1;
}

fs.writeFileSync(path.join(OUT, 'robots.txt'), '# This is a preview copy. Search engines, please stay away.\nUser-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

console.log(`Preview made in ${OUT}: ${pages} pages marked noindex, no CNAME.`);
