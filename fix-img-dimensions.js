/* fix-img-dimensions.js — ajoute width/height explicites aux <img> sans dimensions
   (logos SVG locaux) pour l'audit Lighthouse "images with explicit dimensions".
   Usage : node fix-img-dimensions.js   (idempotent) */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Tailles connues par classe CSS (en px) — fallback si le fichier n'a pas de viewBox lisible.
const BY_CLASS = {
  'header-social-logo': [26, 26],
  'wa-img': [19, 19],
  'mn-btn-logo': [18, 18],
  'mn-logo': [160, 94],
  'brand-logo': [24, 24],
};

function svgSize(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const vw = raw.match(/width="([\d.]+)"/);
    const vh = raw.match(/height="([\d.]+)"/);
    const vb = raw.match(/viewBox="[\d.\s-]*\s([\d.]+)\s([\d.]+)"/);
    if (vw && vh) return [Math.round(+vw[1]), Math.round(+vh[1])];
    if (vb) return [Math.round(+vb[1]), Math.round(+vb[2])];
  } catch (e) { /* fichier absent */ }
  return null;
}

function processFile(htmlPath) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  const dir = path.dirname(htmlPath);
  const re = /<img\b[^>]*>/g;
  let changed = 0;
  html = html.replace(re, (tag) => {
    if (/\bwidth\s*=/i.test(tag) && /\bheight\s*=/i.test(tag)) return tag; // déjà complet
    const clsMatch = tag.match(/class="([^"]*)"/);
    const cls = clsMatch ? clsMatch[1] : '';
    const srcMatch = tag.match(/src="([^"]*)"/);
    const src = srcMatch ? srcMatch[1] : '';
    let dims = null;
    // 1) taille réelle du fichier SVG local
    if (src && /\.svg$/i.test(src)) {
      const abs = path.resolve(dir, src);
      if (fs.existsSync(abs)) dims = svgSize(abs);
    }
    // 2) fallback classe
    if (!dims) {
      for (const c of cls.split(/\s+/)) {
        if (BY_CLASS[c]) { dims = BY_CLASS[c]; break; }
      }
    }
    // 3) fallback final : ratio 1:1 (défaut SVG)
    if (!dims) dims = [24, 24];
    // On n'ajoute que l'attribut manquant
    let out = tag;
    if (!/\bwidth\s*=/i.test(out)) out = out.replace(/\/?>$/, ` width="${dims[0]}"$&`);
    if (!/\bheight\s*=/i.test(out)) out = out.replace(/\/?>$/, ` height="${dims[1]}"$&`);
    changed++;
    return out;
  });
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('OK →', path.relative(ROOT, htmlPath), '(' + changed + ' img corrigées)');
}

processFile(path.join(ROOT, 'index.html'));
processFile(path.join(ROOT, 'produits', '_template.html'));
processFile(path.join(ROOT, '404.html'));
console.log('Terminé.');