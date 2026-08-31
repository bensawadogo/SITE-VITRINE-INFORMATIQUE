/* Générateur des pages produits — AGO Tech Company
   Usage : node generer-produits.js
   Re-génère les 8 pages dans /produits à partir de _template.html.
   Après coup, modifiez les données ci-dessous puis relancez. */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TPL = fs.readFileSync(path.join(ROOT, 'produits', '_template.html'), 'utf8');

const products = [
  {
    slug: 'hp-250-g9',
    name: 'HP 250 G9 Notebook',
    cat: 'Laptops',
    img: 'p1.jpg', imgw: 'p1.webp',
    brand: 'HP',
    rating: '★★★★☆', reviews: '24',
    priceHtml: '<s>420 000 FCFA</s> <strong class="text-orange">350 000 FCFA</strong>',
    priceNum: '350000',
    badgeHtml: '<span class="pd-badge badge-promo">Promo</span>',
    desc: 'Laptop HP 250 G9 robuste et performant pour le travail et les études. Bureau, navigation et multimédia fluides.',
    specs: [
      ['Processeur', 'Intel Core i5 11ème génération'],
      ['Mémoire', '8 Go DDR4'],
      ['Stockage', 'SSD 256 Go (démarrage rapide)'],
      ['Écran', '15.6" antireflet'],
      ['Système', 'Windows 11 Home'],
      ['Garantie', '12 mois']
    ],
    wa: 'https://wa.me/22607000000?text=Bonjour%20AGO%20Tech%20Company%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20HP%20250%20G9%20Notebook%20%C3%A0%20350%20000%20FCFA'
  },
  {
    slug: 'lenovo-thinkpad-e14',
    name: 'Lenovo ThinkPad E14 Gen 4',
    cat: 'Laptops',
    img: 'p2.jpg', imgw: 'p2.webp',
    brand: 'Lenovo',
    rating: '★★★★★', reviews: '18',
    priceHtml: '<strong>580 000 FCFA</strong>',
    priceNum: '580000',
    badgeHtml: '<span class="pd-badge badge-new">Nouveau</span>',
    desc: 'Lenovo ThinkPad E14 Gen 4 : puissance de calcul sérieuse, clavier professionnel réputé et finitions durables.',
    specs: [
      ['Processeur', 'Intel Core i7 12ème génération'],
      ['Mémoire', '16 Go DDR4'],
      ['Stockage', 'SSD NVMe 512 Go'],
      ['Écran', '14" FHD'],
      ['Système', 'Windows 11 Pro'],
      ['Garantie', '12 mois']
    ],
    wa: 'https://wa.me/22607000000?text=Bonjour%20AGO%20Tech%20Company%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20Lenovo%20ThinkPad%20E14%20Gen%204%20%C3%A0%20580%20000%20FCFA'
  },
  {
    slug: 'dell-optiplex-3080',
    name: 'Dell OptiPlex 3080 MT',
    cat: 'Desktops',
    img: 'p3.jpg', imgw: 'p3.webp',
    brand: 'Dell',
    rating: '★★★½☆', reviews: '31',
    priceHtml: '<strong>265 000 FCFA</strong>',
    priceNum: '265000',
    badgeHtml: '',
    desc: 'Dell OptiPlex 3080 : tour professionnelle fiable, idéale pour bureaux, comptabilités et postes de travail.',
    specs: [
      ['Processeur', 'Intel Core i5'],
      ['Mémoire', '8 Go RAM'],
      ['Stockage', 'Disque dur 1 To'],
      ['Format', 'Mini tour (MT)'],
      ['Système', 'Windows 10 Pro'],
      ['Garantie', '12 mois']
    ],
    wa: 'https://wa.me/22607000000?text=Bonjour%20AGO%20Tech%20Company%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20Dell%20OptiPlex%203080%20MT%20%C3%A0%20265%20000%20FCFA'
  },
  {
    slug: 'asus-expertcenter-d500',
    name: 'Asus ExpertCenter D500',
    cat: 'Desktops',
    img: 'p4.jpg', imgw: 'p4.webp',
    brand: 'Asus',
    rating: '★★★★☆', reviews: '12',
    priceHtml: '<s>185 000 FCFA</s> <strong class="text-orange">150 000 FCFA</strong>',
    priceNum: '150000',
    badgeHtml: '<span class="pd-badge badge-promo">Promo</span>',
    desc: 'Asus ExpertCenter D500 compact et silencieux : un excellent rapport qualité-prix pour l’usage quotidien.',
    specs: [
      ['Processeur', 'Intel Core i3'],
      ['Mémoire', '4 Go RAM'],
      ['Stockage', 'Disque dur 500 Go'],
      ['Format', 'Mini tour compacte'],
      ['Système', 'Windows 10'],
      ['Garantie', '12 mois']
    ],
    wa: 'https://wa.me/22607000000?text=Bonjour%20AGO%20Tech%20Company%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20Asus%20ExpertCenter%20D500%20%C3%A0%20150%20000%20FCFA'
  }
];
// ===== PRODUITS 5 à 8 =====
const products2 = [
  {
    slug: 'samsung-24-s4-fhd',
    name: 'Samsung 24" S4 FHD',
    cat: 'Écrans',
    img: 'p5.jpg', imgw: 'p5.webp',
    brand: 'Samsung',
    rating: '★★★★☆', reviews: '27',
    priceHtml: '<s>110 000 FCFA</s> <strong class="text-orange">95 000 FCFA</strong>',
    priceNum: '95000',
    badgeHtml: '<span class="pd-badge badge-promo">Promo</span>',
    desc: 'Écran Samsung 24 pouces Full HD à dalle IPS : couleurs précises, angle de vision large et usage prolongé confortable.',
    specs: [
      ['Définition', '1920 × 1080 (Full HD)'],
      ['Dalle', 'IPS antireflet'],
      ['Entrées', 'HDMI + VGA'],
      ['Fréquence', '75 Hz'],
      ['Garantie', '12 mois']
    ],
    wa: 'https://wa.me/22607000000?text=Bonjour%20AGO%20Tech%20Company%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20Samsung%2024%22%20S4%20FHD%20%C3%A0%2095%20000%20FCFA'
  },
  {
    slug: 'lg-27-fhd-ips',
    name: 'LG 27" FHD IPS Monitor',
    cat: 'Écrans',
    img: 'p6.jpg', imgw: 'p6.webp',
    brand: 'LG',
    rating: '★★★★★', reviews: '15',
    priceHtml: '<strong>145 000 FCFA</strong>',
    priceNum: '145000',
    badgeHtml: '<span class="pd-badge badge-new">Nouveau</span>',
    desc: 'Grand écran LG 27 pouces Full HD IPS avec FreeSync : image nette et fluide pour la bureautique comme pour le divertissement.',
    specs: [
      ['Définition', '1920 × 1080 (Full HD)'],
      ['Dalle', 'IPS'],
      ['Entrées', 'HDMI × 2'],
      ['Fréquence', '75 Hz avec FreeSync'],
      ['Garantie', '12 mois']
    ],
    wa: 'https://wa.me/22607000000?text=Bonjour%20AGO%20Tech%20Company%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20LG%2027%22%20FHD%20IPS%20Monitor%20%C3%A0%20145%20000%20FCFA'
  },
  {
    slug: 'hp-laserjet-m428',
    name: 'HP LaserJet Pro MFP M428',
    cat: 'Imprimantes',
    img: 'p7.jpg', imgw: 'p7.webp',
    brand: 'HP',
    rating: '★★★★☆', reviews: '22',
    priceHtml: '<strong>175 000 FCFA</strong>',
    priceNum: '175000',
    badgeHtml: '',
    desc: 'Imprimante multifonction HP LaserJet Pro : impression, copie et numérisation laser, rapide et économique en encre.',
    specs: [
      ['Technologie', 'Laser monochrome'],
      ['Fonctions', 'Impression · Copie · Scan'],
      ['Connectivité', 'Wi-Fi + USB'],
      ['Format', 'A4'],
      ['Garantie', '12 mois']
    ],
    wa: 'https://wa.me/22607000000?text=Bonjour%20AGO%20Tech%20Company%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20HP%20LaserJet%20Pro%20MFP%20M428%20%C3%A0%20175%20000%20FCFA'
  },
  {
    slug: 'logitech-mk295',
    name: 'Kit Clavier + Souris Logitech MK295',
    cat: 'Accessoires',
    img: 'p8.jpg', imgw: 'p8.webp',
    brand: 'Logitech',
    rating: '★★★★½☆', reviews: '19',
    priceHtml: '<strong>28 000 FCFA</strong>',
    priceNum: '28000',
    badgeHtml: '',
    desc: 'Kit sans fil Logitech MK295 : touches silencieuses, connexion USB Nano fiable et jusqu’à 2 ans d’autonomie.',
    specs: [
      ['Connexion', 'Sans fil 2,4 GHz'],
      ['Récepteur', 'USB Nano'],
      ['Touches', 'Silencieuses'],
      ['Autonomie', 'Jusqu’à 2 ans'],
      ['Garantie', '6 mois']
    ],
    wa: 'https://wa.me/22607000000?text=Bonjour%20AGO%20Tech%20Company%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20Kit%20Clavier%20%2B%20Souris%20Logitech%20MK295%20%C3%A0%2028%20000%20FCFA'
  }
];

// ===== HELPERS =====
function specsHtml(p) {
  return p.specs
    .map((s) => '<li><i class="ti ti-check"></i><strong>' + s[0] + '</strong>' + s[1] + '</li>')
    .join('\n                        ');
}

function moreHtml(p) {
  const others = products.concat(products2).filter((o) => o.slug !== p.slug).slice(0, 3);
  return others
    .map((o) =>
      '<a class="pd-more-card" href="' + o.slug + '.html">' +
      '  <div class="pd-more-img"><picture><source type="image/webp" srcset="../images/products/' + o.imgw + '">' +
      '  <img src="../images/products/' + o.img + '" alt="' + o.name + '" loading="lazy" width="800" height="800"></picture></div>' +
      '  <div class="pd-more-body"><h3>' + o.name + '</h3>' +
      '  <div class="pd-more-price">' + o.priceHtml + '</div>' +
      '  <span class="btn btn-slate btn-block">Voir le produit</span></div>' +
      '</a>'
    )
    .join('\n                ');
}

// ===== GÉNÉRATION =====
const all = products.concat(products2);
for (const p of all) {
  let html = TPL
    .split('@@DESC@@').join(p.desc)
    .split('@@CANONICAL@@').join(p.slug + '.html')
    .split('@@NAME@@').join(p.name)
    .split('@@IMG_JPG@@').join(p.img)
    .split('@@IMG_WEBP@@').join(p.imgw)
    .split('@@ALT@@').join(p.name)
    .split('@@BRAND_NAME@@').join(p.brand)
    .split('@@PRICE_NUM@@').join(p.priceNum)
    .split('@@BADGE_HTML@@').join(p.badgeHtml)
    .split('@@CAT@@').join(p.cat)
    .split('@@RATING@@').join(p.rating)
    .split('@@REVIEWS@@').join(p.reviews)
    .split('@@PRICE_HTML@@').join(p.priceHtml)
    .split('@@DESCRIPTION@@').join(p.desc)
    .split('@@SPECS_HTML@@').join(specsHtml(p))
    .split('@@WA_LINK@@').join(p.wa)
    .split('@@MORE_HTML@@').join(moreHtml(p));
  fs.writeFileSync(path.join(ROOT, 'produits', p.slug + '.html'), html, 'utf8');
  console.log('OK →', p.slug + '.html');
}
console.log('Génération terminée :', all.length, 'pages produits.');