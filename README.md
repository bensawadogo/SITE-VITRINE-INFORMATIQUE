# AGO Tech Company SARL — Site Vitrine

Site vitrine mono-page pour **AGO Tech Company SARL**, spécialiste informatique à Ouagadougou (Burkina Faso). Vente de laptops, desktops, écrans, accessoires et imprimantes. Les commandes se font via **WhatsApp / Facebook / Instagram** (pas de panier ni de paiement en ligne).

## Caractéristiques

- **Stack** : HTML5 + CSS3 (variables custom), JavaScript vanilla (ES6), Bootstrap 5.3 (CDN, layout uniquement), AOS.js (CDN, animations au scroll).
- **Charte** : orange `#E8520A` + slate `#3A5A72` + slate-dark `#1E3545` + offwhite `#F7F9FA`.
- **Polices** : Poppins (titres) + Inter (texte) via Google Fonts.
- **Responsive** : mobile-first, menu hamburger coulissant, grille produits adaptative.
- **Accessibilité** : `prefers-reduced-motion` respecté, `aria-label` sur les boutons, version imprimable.

## Structure des fichiers

```
ago-tech-site/
├── index.html          # Page unique, 11 sections
├── css/
│   └── style.css       # Toutes les règles + variables de charte
├── js/
│   └── main.js         # 10 fonctionnalités (slider, countdown, filtres, recherche…)
├── images/
│   └── logo-ago-hq.png # Logo officiel AGO Tech Company
└── README.md
```

## Les 11 sections

1. **Top bar** — téléphone, email, localisation, badge « Ouvert ».
2. **Header sticky** — logo, recherche, icônes sociales, hamburger.
3. **Mega menu / navbar** — navigation slate avec dropdowns.
4. **Hero slider** — 3 slides autoplay + flèches + points.
5. **Avantages** — 4 cartes (livraison, garantie, SAV, support).
6. **Offres de la semaine** — countdown 7 jours + 2 cartes promo avec barre de stock.
7. **Catégories** — 6 chips filtrables.
8. **Produits** — 8 cartes, filtres (Tous / Nouveau / Promo), recherche, wishlist.
9. **Marques** — marquee HP, Dell, Lenovo, Asus, Acer, Samsung, Apple, LG.
10. **Newsletter** — validation email.
11. **Footer** — contact, liens, horaires, réseaux + WhatsApp flottant.

## Personnalisation

### Changer le numéro WhatsApp
Dans `js/main.js` :
```js
const WHATSAPP_NUMBER = '22607000000';
```
Et dans `index.html`, remplacer toutes les occurrences de `wa.me/22607000000` par votre numéro (format international sans `+`).

### Changer les prix / produits
Dans `index.html`, section `#produits` (lignes ~433–639). Copier un bloc `.product-card`, modifier `data-category`, `data-brand`, `data-badge` (`promo` / `nouveau`), les textes et le lien WhatsApp.

Catégories valides pour `data-category` : `laptops`, `desktops`, `ecrans`, `accessoires`, `telephones`.
Sous-catégorie `data-sub` (accessoires) : `claviers`, `imprimantes`.

### Changer le logo
Remplacer `images/logo-ago-hq.png` (conservez le nom ou mettez à jour `src` dans `index.html`).

### Changer les couleurs
Dans `css/style.css`, bloc `:root` (variables `--ago-orange`, `--ago-slate`, etc.).

## Localisation

Ouvrez `index.html` dans un navigateur (double-clic). Aucune étape de build requise.

## Déploiement (GitHub Pages)

1. `git init` dans `ago-tech-site/`
2. `git add . && git commit -m "Site AGO Tech Company"`
3. Poussez vers `https://github.com/bensawadogo/SITE-VITRINE-INFORMATIQUE.git`
4. Dans le repo GitHub : *Settings → Pages → Source : main / root*.

---
© 2025 AGO Tech Company SARL — « VOTRE satisfaction, Notre responsabilité »
