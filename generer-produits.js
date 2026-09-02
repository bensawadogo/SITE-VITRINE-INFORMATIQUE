/* Générateur produits — AGO Tech Company
   Source de vérité : data/produits/*.json (édité depuis /admin — Sveltia CMS).
   Usage : node generer-produits.js   (exécuté automatiquement par Vercel au build)
   1) Génère produits/<slug>.html depuis produits/_template.html
   2) Réinjecte les cartes dans index.html entre les marqueurs PRODUCTS:START/END */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data', 'produits');
const TPL = fs.readFileSync(path.join(ROOT, 'produits', '_template.html'), 'utf8');
const INDEX_PATH = path.join(ROOT, 'index.html');

/* ⚙️ URL du site (canonical, Open Graph) — à mettre à jour après l'achat du
   domaine client et le passage sur Vercel, ex. 'https://www.agotechcompany.bf' */
const SITE_URL = 'https://bensawadogo.github.io/SITE-VITRINE-INFORMATIQUE';
const WHATSAPP = '22607000000';

const CAT_SLUG = {
  'Laptops': 'laptops',
  'Desktops': 'desktops',
  'Écrans': 'ecrans',
  'Accessoires': 'accessoires',
  'Imprimantes': 'accessoires'
};

const products = fs.readdirSync(DATA_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => {
    const p = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
    p.catSlug = CAT_SLUG[p.cat] || 'accessoires';
    return p;
  });

// ===== HELPERS =====
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function waLink(p) {
  const txt = 'Bonjour AGO Tech Company, je suis intéressé par le ' + p.name +
    ' à ' + fmt(p.price) + ' FCFA';
  return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(txt);
}

function priceHtml(p) {
  if (p.oldPrice && p.oldPrice > p.price) {
    return '<s>' + fmt(p.oldPrice) + ' FCFA</s> <strong class="text-orange">' +
      fmt(p.price) + ' FCFA</strong>';
  }
  return '<strong>' + fmt(p.price) + ' FCFA</strong>';
}

// ===== BADGES & IMAGES =====
function stockBadge(p) {
  if (p.stock <= 0) return { cls: 'badge-out', label: 'Rupture' };
  if (p.badge === 'promo') return { cls: 'badge-promo', label: 'Promo' };
  if (p.badge === 'new') return { cls: 'badge-new', label: 'Nouveau' };
  return null;
}

function imgVariants(p) {
  /* dérive les variantes webp si elles existent sur disque (les 8 produits
     d'origine ; les nouveaux produits du client n'ont pas besoin de variantes) */
  const ext = path.extname(p.img);
  const base = p.img.slice(0, -ext.length);
  const file = path.basename(p.img);
  const name = path.basename(base);
  const has400 = fs.existsSync(path.join(ROOT, base + '-400.webp'));
  const has800 = fs.existsSync(path.join(ROOT, base + '.webp'));
  const has400jpg = fs.existsSync(path.join(ROOT, base + '-400.jpg'));
  return { base, file, name, has400, has800, has400jpg };
}

/* Chemin d'affichage JPEG de la photo (variante -400 si elle existe) */
function jpgPath(v, prefix) {
  return prefix + (v.has400jpg ? v.name + '-400.jpg' : v.file);
}

function cardHtml(p, i) {
  const out = p.stock <= 0;
  const b = stockBadge(p);
  const v = imgVariants(p);
  const src = jpgPath(v, 'images/products/');
  let img;
  if (v.has400 || v.has800) {
    const srcset = [];
    if (v.has400) srcset.push('images/products/' + v.name + '-400.webp 400w');
    if (v.has800) srcset.push('images/products/' + v.name + '.webp 800w');
    img = '<picture><source type="image/webp" srcset="' + srcset.join(', ') +
      '" sizes="(max-width:480px) 140px, (max-width:768px) 300px, (max-width:992px) 210px, 260px">' +
      '<img class="product-photo" src="' + src + '" alt="' + esc(p.name) +
      '" loading="lazy" width="800" height="800"></picture>';
  } else {
    img = '<img class="product-photo" src="' + src + '" alt="' + esc(p.name) +
      '" loading="lazy" width="800" height="800">';
  }
  const attrs = ['data-category="' + p.catSlug + '"'];
  if (p.brand) attrs.push('data-brand="' + esc(String(p.brand).toLowerCase()) + '"');
  if (p.sub) attrs.push('data-sub="' + esc(p.sub) + '"');
  if (b && !out) attrs.push('data-badge="' + (p.badge === 'new' ? 'nouveau' : 'promo') + '"');
  attrs.push('data-aos="fade-up"', 'data-aos-delay="' + (i % 4) * 100 + '"');

  const addBtn = out
    ? '<button type="button" class="btn btn-orange btn-cart" disabled aria-label="Rupture de stock"><i data-lucide="shopping-cart"></i>&nbsp; Rupture</button>'
    : '<button type="button" class="btn btn-orange btn-cart" data-cart-add data-id="' + p.slug + '" data-name="' + esc(p.name) + '" data-price="' + p.price + '" aria-label="Ajouter ' + esc(p.name) + ' au panier"><i data-lucide="shopping-cart"></i>&nbsp; Ajouter</button>';

  return [
    '<div class="product-card" ' + attrs.join(' ') + '><a href="produits/' + p.slug + '.html" class="card-link" aria-label="Voir les détails du produit" tabindex="-1"></a>',
    '                    <div class="border-beam"><div class="border-beam-inner"></div></div>',
    '                    <div class="product-image">',
    '                        ' + (b ? '<span class="product-badge ' + b.cls + '">' + b.label + '</span>' : ''),
    '                        <button class="wishlist-btn" data-id="' + p.slug + '" aria-label="Ajouter aux favoris">',
    '                            <i data-lucide="heart"></i>',
    '                        </button>',
    '                        ' + img,
    '                    </div>',
    '                    <div class="product-info">',
    '                        <h3>' + esc(p.name) + '</h3>',
    '                        <p class="product-specs">' + esc(p.shortSpecs || '') + '</p>',
    '                        <div class="product-rating">',
    '                            <span class="stars">' + esc(p.rating || '') + '</span>',
    '                            <span class="rating-count">(' + (p.reviews || 0) + ' avis)</span>',
    '                        </div>',
    '                        <div class="product-price">' + priceHtml(p) + '</div>',
    '                        <div class="product-actions">',
    '                            ' + addBtn,
    '                            <a href="' + waLink(p) + '" class="btn btn-slate btn-wa" target="_blank" rel="noopener" aria-label="Commander sur WhatsApp"><img src="images/brands/whatsapp-white.svg" alt="WhatsApp" class="wa-img" width="24" height="24"></a>',
    '                        </div>',
    '                        <a href="produits/' + p.slug + '.html" class="btn btn-outline-orange btn-block btn-details">Voir les détails</a>',
    '                    </div>',
    '                </div>'
  ].join('\n');
}

// ===== GALERIE & SPECS (pages détail) =====
function galleryHtml(p) {
  const v = imgVariants(p);
  const fallback = jpgPath(v, '../images/products/');
  if (!v.has400 && !v.has800) {
    return '<img src="' + fallback + '" alt="' + esc(p.name) + '" width="800" height="800">';
  }
  const srcset = [];
  if (v.has400) srcset.push('../images/products/' + v.name + '-400.webp 400w');
  if (v.has800) srcset.push('../images/products/' + v.name + '.webp 800w');
  return '<picture><source type="image/webp" srcset="' + srcset.join(', ') +
    '" sizes="(max-width:768px) 88vw, 400px"><img src="' + fallback + '" alt="' +
    esc(p.name) + '" width="800" height="800"></picture>';
}

function thumbHtml(p) {
  const v = imgVariants(p);
  const src = jpgPath(v, '../images/products/');
  return '<img src="' + src + '" alt="Photo ' + esc(p.name) + '" width="24" height="24">';
}

function specsHtml(p) {
  return (p.specs || [])
    .map((s) => '<li><i data-lucide="check"></i><strong>' + esc(s.k) + '</strong>' + esc(s.v) + '</li>')
    .join('\n                        ');
}

function detailBadge(p) {
  const b = stockBadge(p);
  if (!b) return '';
  const label = b.cls === 'badge-out' ? 'Rupture de stock' : b.label;
  return '<span class="pd-badge ' + b.cls + '">' + label + '</span>';
}

function moreHtml(p) {
  const others = products.filter((o) => o.slug !== p.slug).slice(0, 3);
  return others.map((o) => {
    const v = imgVariants(o);
    const fallback = jpgPath(v, '../images/products/');
    let img;
    if (v.has400 || v.has800) {
      const srcset = [];
      if (v.has400) srcset.push('../images/products/' + v.name + '-400.webp 400w');
      if (v.has800) srcset.push('../images/products/' + v.name + '.webp 800w');
      img = '<picture><source type="image/webp" srcset="' + srcset.join(', ') +
        '" sizes="(max-width:480px) 45vw, 280px"><img src="' + fallback +
        '" alt="' + esc(o.name) + '" loading="lazy" width="800" height="800"></picture>';
    } else {
      img = '<img src="' + fallback + '" alt="' + esc(o.name) + '" loading="lazy" width="800" height="800">';
    }
    return '<a class="pd-more-card" href="' + o.slug + '.html">' +
      '<div class="pd-more-img">' + img + '</div>' +
      '<div class="pd-more-body"><h3>' + esc(o.name) + '</h3>' +
      '<div class="pd-more-price">' + priceHtml(o) + '</div>' +
      '<span class="btn btn-slate btn-block">Voir le produit</span></div></a>';
  }).join('\n                ');
}

// ===== GÉNÉRATION DES PAGES =====
const PROD_DIR = path.join(ROOT, 'produits');
fs.mkdirSync(PROD_DIR, { recursive: true });
/* supprime les anciennes pages générées (sauf _template.html) pour rester en
   phase avec les données : produit supprimé dans /admin ⇒ page disparue */
for (const f of fs.readdirSync(PROD_DIR)) {
  if (f.endsWith('.html') && f !== '_template.html') fs.unlinkSync(path.join(PROD_DIR, f));
}

for (const p of products) {
  const html = TPL
    .split('@@SITE_URL@@').join(SITE_URL)
    .split('@@DESC@@').join(esc(p.desc || ''))
    .split('@@CANONICAL@@').join(p.slug + '.html')
    .split('@@SLUG@@').join(p.slug)
    .split('@@NAME@@').join(esc(p.name))
    .split('@@IMG_JPG@@').join(path.basename(p.img))
    .split('@@GALLERY_HTML@@').join(galleryHtml(p))
    .split('@@THUMB_HTML@@').join(thumbHtml(p))
    .split('@@ALT@@').join(esc(p.name))
    .split('@@BRAND_NAME@@').join(esc(p.brand || ''))
    .split('@@PRICE_NUM@@').join(String(p.price))
    .split('@@BADGE_HTML@@').join(detailBadge(p))
    .split('@@CAT@@').join(esc(p.cat || ''))
    .split('@@RATING@@').join(esc(p.rating || ''))
    .split('@@REVIEWS@@').join(String(p.reviews || 0))
    .split('@@PRICE_HTML@@').join(priceHtml(p))
    .split('@@DESCRIPTION@@').join(esc(p.desc || ''))
    .split('@@SPECS_HTML@@').join(specsHtml(p))
    .split('@@WA_LINK@@').join(waLink(p))
    .split('@@MORE_HTML@@').join(moreHtml(p));
  fs.writeFileSync(path.join(PROD_DIR, p.slug + '.html'), html, 'utf8');
  console.log('OK → produits/' + p.slug + '.html');
}

// ===== RÉINJECTION DES CARTES DANS index.html =====
const START = '<!-- PRODUCTS:START';
const END = '<!-- PRODUCTS:END -->';
let index = fs.readFileSync(INDEX_PATH, 'utf8');
const cards = products.map(cardHtml).join('\n                ');
const iStart = index.indexOf(START);
const iEnd = index.indexOf(END);
if (iStart !== -1 && iEnd !== -1) {
  index = index.slice(0, iStart + START.length) +
    ' (généré par generer-produits.js — ne pas éditer à la main) -->\n                ' +
    cards + '\n                ' + index.slice(iEnd);
  fs.writeFileSync(INDEX_PATH, index, 'utf8');
  console.log('OK → index.html : ' + products.length + ' cartes réinjectées');
} else {
  console.warn('⚠ Marqueurs PRODUCTS:START/END introuvables dans index.html');
}
console.log('Terminé : ' + products.length + ' produits.');
