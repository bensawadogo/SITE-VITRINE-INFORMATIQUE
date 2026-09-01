/* make-lucide-min.js — génère js/vendor/lucide-icons.js (bundle réduit)
   Seules les icônes réellement utilisées sont embarquées (runtime maison).
   Usage : node make-lucide-min.js  */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const FULL_BUNDLE = path.join(ROOT, 'js', 'vendor', 'lucide.min.js');
const OUT = path.join(ROOT, 'js', 'vendor', 'lucide-icons.js');
const SRC_FILES = ['index.html', 'produits/_template.html', 'js/main.js', 'js/cart.js'];

// 1) Charger le bundle complet dans un sandbox (lecture des tuples SVG uniquement)
const code = fs.readFileSync(FULL_BUNDLE, 'utf8');
const sandbox = { window: {}, console };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const lucide = sandbox.window.lucide || sandbox.lucide;
if (!lucide || !lucide.icons) {
  console.error('Structure lucide inattendue');
  process.exit(1);
}

// 2) Icônes réellement utilisées
const used = new Set();
for (const f of SRC_FILES) {
  const content = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const re = /data-lucide="([a-z0-9-]+)"/g;
  let m;
  while ((m = re.exec(content))) used.add(m[1]);
}

function toPascal(name) {
  return name.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}

// 3) Convertir un tuple Lucide ["svg", attrs, [enfants]] en string SVG
function escapeAttr(v) {
  return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function tupleToSvg(t) {
  const tag = t[0];
  const attrs = t[1] || {};
  const children = t[2] || [];
  let out = '<' + tag;
  for (const k of Object.keys(attrs)) {
    const v = attrs[k];
    if (v === undefined || v === null || v === false) continue;
    out += ' ' + k + '="' + escapeAttr(v) + '"';
  }
  if (!children.length) return out + '/>';
  out += '>';
  for (const c of children) out += tupleToSvg(c);
  return out + '</' + tag + '>';
}

const missing = [];
const iconDefs = [];
for (const name of used) {
  const key = toPascal(name);
  const tuple = lucide.icons[key];
  if (!tuple) { missing.push(name); continue; }
  const svg = tupleToSvg(tuple).replace('stroke="currentColor"', 'stroke="currentColor"');
  iconDefs.push('  ' + JSON.stringify(name) + ': ' + JSON.stringify(svg));
}

// 4) Runtime minimal (remplace les <i data-lucide> par leur SVG inline)
const runtime = `/* Généré par make-lucide-min.js — ne pas modifier à la main.
   Runtime Lucide réduit : ${iconDefs.length} icônes embarquées (0 dépendance). */
(function () {
  'use strict';
  var ICONS = {
${iconDefs.join(',\n')}
  };
  function createIcons() {
    var els = document.querySelectorAll('[data-lucide]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var n = el.getAttribute('data-lucide');
      if (!n || !ICONS[n]) continue;
      var div = document.createElement('div');
      div.innerHTML = ICONS[n];
      var svg = div.firstChild;
      if (el.getAttribute('class')) svg.setAttribute('class', el.getAttribute('class'));
      el.parentNode.replaceChild(svg, el);
    }
  }
  if (!window.lucide) window.lucide = {};
  window.lucide.createIcons = createIcons;
  window.lucide.createElement = createIcons;
})();
`;

fs.writeFileSync(OUT, runtime, 'utf8');
console.log('Icônes utilisées :', [...used].sort().join(', '));
console.log('Icônes manquantes :', missing.length ? missing.join(', ') : 'aucune');
console.log('Bundle réduit :', Math.round(runtime.length / 1024) + ' Ko (au lieu de ~358 Ko)');