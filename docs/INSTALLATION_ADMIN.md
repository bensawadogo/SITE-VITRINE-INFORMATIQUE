# 🛠️ Mise en ligne complète : Vercel + domaine + espace gérant (Sveltia CMS)

Ce guide vous permet de mettre le site en ligne chez **Vercel (gratuit)**, d'acheter un
**nom de domaine** pour le client, et d'activer l'**espace gérant** : le client modifie
ses produits (nom, prix, stock, photos) **depuis son téléphone**, sans vous recontacter.
Chaque publication regénère le site automatiquement en ~30 secondes.

---

## 1. Vérifier le fonctionnement local (5 min)

```bash
cd C:\SITE-VITRINE-INFORMATIQUE
node generer-produits.js        # régénère les 8 pages produits + les cartes de l'accueil
```
Ouvrir `index.html` en local : le catalogue s'affiche normalement.

---

## 2. Créer l'application OAuth GitHub (5 min, gratuit)

1. GitHub → _Settings → Developer settings → **OAuth Apps → New OAuth App**.
2. Remplir :
   - **Application name** : `AGO Tech Admin`
   - **Homepage URL** : l'URL provisoire Vercel (étape 3) ou le futur domaine `https://www.agotechcompany.bf`
   - **Authorization callback URL** : `https://<VOTRE-DOMAINE>/api/auth/callback`
3. _Generate a new client secret_. Copier le **Client ID** et le **Client Secret**.

> ⚠️ La callback URL doit être exacte. Si vous changez de domaine, mettez-la à jour.

---

## 3. Déployer sur Vercel (10 min, gratuit)

1. Aller sur [vercel.com](https://vercel.com) → _Import Repository_ → choisir
   `bensawadogo/SITE-VITRINE-INFORMATIQUE`.
2. Vercel détecte le projet. **Frameworks Preset** : `Other`.
3. Dans **Settings → Build & Development Settings** :
   - Build command : `node generer-produits.js`
   - Output directory : `.`   (le dossier `vercel.json` est déjà configuré)
4. Dans **Settings → Environment Variables**, ajouter :
   - `GITHUB_CLIENT_ID` = le Client ID de l'étape 2
   - `GITHUB_CLIENT_SECRET` = le Client Secret
5. _Deploy_. Le site est en ligne sur `https://<projet>.vercel.app`.
6. Mettre à jour **l'URL du site** dans `generer-produits.js` :
   ```js
   const SITE_URL = 'https://www.agotechcompany.bf';
   ```
   (ou l'URL Vercel provisoire tant que le domaine n'est pas acheté) puis `git push` → Vercel
   redéploie automatiquement.

---

## 4. Acheter et brancher le nom de domaine (20 min)

(Si le client veut **0 coût d'hébergement et 0 coût de domaine**, on peut garder l'URL
`vercel.app` — mais un nom de domaine professionnel coûte ~4-12 €/an chez un registrar.)

1. Acheter le domaine (ex. `agotechcompany.bf` chez un registrar local, ou `.com`).
2. Sur Vercel : projet → **Settings → Domains** → ajouter le domaine.
3. Suivre les instructions : chez le registrar, créer un enregistrement DNS de type
   `CNAME` (ou `A`) pointant vers `cname.vercel-dns.com`.
4. Mettre à jour l'application OAuth GitHub (étape 2) : la *callback URL* doit pointer
   vers le domaine `https://www.agotechcompany.bf/api/auth/callback`.
5. Mettre `SITE_URL` dans `generer-produits.js` au domaine définitif, pousser, attendre le
   déploiement.
6. (Optionnel) Dans `admin/config.yml`, la ligne `base_url:` est déjà sur le domaine final.

---

## 5. Tester l'espace gérant (10 min)

1. Ouvrir `https://www.agotechcompany.bf/admin/` (le domaine du client).
2. Le bouton **Connexion GitHub** s'affiche → le client se connecte avec le compte GitHub
   utilisé pour déployer (vous l'aurez créé/aidé à créer).
3. Collection **Produits** : le client voit les 8 produits actuels.
   - Modifier un prix, mettre un stock à `0`, changer une photo…
   - Cliquer **Publier** : GitHub reçoit les modifications → Vercel regénère → le site
     public est à jour quelques secondes plus tard.

---

## 6. Former le client (téléphone d'abord, PC ensuite)

Le client n'a **aucune ligne de commande** à connaître. Deux-3 rendez-vous de 20 min :

**Séance 1 — depuis son téléphone (le plus important)**
1. Ouvrir le site du gérant (`/admin`) et l'enregistrer sur l'écran d'accueil
   (Android : Menu ⋮ → « Ajouter à l'écran d'accueil »).
2. Se connecter (GitHub). Une fois seulement (la session reste ouverte).
3. Parcourir la liste des produits, appuyer sur un produit.
4. **Changer le prix** → vérifier le chiffre → **Publier**.
5. Télécharger une **photo** depuis sa galerie → Publier.
6. Mettre un **stock = 0** → Publier → voir la page « Rupture de stock » sur le site.

**Séance 2 — depuis le PC**
1. Mêmes manipulations sur écran large (plus rapide pour les descriptions longues).
2. Créer un **nouveau produit** (bouton « Nouveau produit ») et le publier —
   sa carte apparaît sur l'accueil, sa page sur `/produits/`.

**Consignes simples à rappeler au client**
- Toujours appuyer sur **Publier** (sinon rien ne change).
- Pour cacher un produit : le supprimer (ou stock à 0).
- Ne jamais changer l'identifiant (slug) d'un produit existant.
- L'image doit être **carrée** si possible (le site s'adapte de toute façon).

---

## 7. Rappels sécurité / coût (anciens problèmes évités)

| Point | État |
|---|---|
| Hébergement | Vercel Hobby = **gratuit** (bande passante offerte, domaines `.vercel.app`) |
| GitHub OAuth | fonctions `/api/auth` fournies (anti-CSRF + portée `repo` minimale) |
| Photos | uploadées dans `images/products/` et commitées par Sveltia (limite GitHub 100 Mo/dépôt) |
| Domaines | `.bf` ou `.com` = coût uniquement du registrar (~4-12 €/an) |

---

## 8. Fichiers livrés pour l'admin

```
api/auth.js           → redirection GitHub OAuth (étape 1)
api/auth/callback.js  → échange code→jeton, postMessage (étape 2)
admin/index.html      → interface Sveltia CMS (chargée depuis le CDN)
admin/config.yml      → collections Produits (adapté mobile, français)
data/produits/*.   JSON   → les 8 produits (source de vérité ; édités depuis /admin)
data/infos.yml       → coordonnées (réservé)
vercel.json          → build (regénère les pages) + en-têtes sécurité
generer-produits.js  → génère pages produits + cartes accueil depuis les JSON
```