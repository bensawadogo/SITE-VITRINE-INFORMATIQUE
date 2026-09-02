/* fix-site-url.js — remplace les URLs github.io en dur par @@SITE_URL@@ dans le
   template produits (rend l'URL paramétrable par generer-produits.js). */
const fs = require('fs');
const path = require('path');
const TPL_PATH = path.join(__dirname, 'produits', '_template.html');
let tpl = fs.readFileSync(TPL_PATH, 'utf8');
const before = (tpl.match(/https:\/\/bensawadogo\.github\.io\/SITE-VITRINE-INFORMATIQUE/g) || []).length;
tpl = tpl.replace(/https:\/\/bensawadogo\.github\.io\/SITE-VITRINE-INFORMATIQUE/g, '@@SITE_URL@@');
fs.writeFileSync(TPL_PATH, tpl, 'utf8');
console.log(before + ' URL(s) remplacée(s) par @@SITE_URL@@');