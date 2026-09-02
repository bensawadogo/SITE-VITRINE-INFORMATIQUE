/* fix-srcset-pictures.js — ajoute des srcset responsives aux <picture> produits
   et à la photo boutique (variantes -400 générées). Idempotent. */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Tailles d'affichage réelles (CSS .product-photo height 180/140, grilles 1-4 colonnes)
const PRODUCT_SIZES = '(max-width:480px) 140px, (max-width:768px) 300px, (max-width:992px) 210px, 260px';

function processProductsCarts(htmlPath, prefix) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  let n = 0;
  // Patterns : <picture><source type="image/webp" srcset="images/products/pX.webp">...
  html = html.replace(
    /<picture><source type="image\/webp" srcset="(images|\.\.\/images)\/products\/(p\d)\.webp"><img class="product-photo" src="([^"]+)"\s*([^>]*)><\/picture>/g,
    (m, dir, pnum, srcAttr, rest) => {
      n++;
      const base = dir + '/products/' + pnum;
      const sizes = PRODUCT_SIZES;
      return `<picture><source type="image/webp" srcset="${base}-400.webp 400w, ${base}.webp 800w" sizes="${sizes}"><img class="product-photo" src="${base}-400.webp" ${rest}></picture>`;
    }
  );
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(prefix, n, 'cartes produits trailées →', path.relative(ROOT, htmlPath));
}

function processBoutique(htmlPath) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  if (!html.includes('images/boutique-440.webp')) {
    html = html.replace(
      /<img src="images\/boutique\.jpg"([^>]*)>/,
      '<img src="images/boutique-440.webp" srcset="images/boutique-440.webp 440w, images/boutique.jpg 800w" sizes="(max-width:768px) 88vw, 420px"$1>'
    );
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('boutique → srcset ajouté');
  } else {
    console.log('boutique déjà traité');
  }
}

// 1) index.html : les 8 cartes produits + boutique
processProductsCarts(path.join(ROOT, 'index.html'), 'index');
processBoutique(path.join(ROOT, 'index.html'));

console.log('Terminé.');