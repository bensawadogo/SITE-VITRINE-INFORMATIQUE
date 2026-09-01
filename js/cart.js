/* Panier AGO Tech Company — sélection produits, total, commande WhatsApp.
   Chargé sur toutes les pages (defer). Autonome, sans dépendance. */
(function () {
    'use strict';

    const CART_KEY = 'ago_cart_v1';
    const WA_NUMBER = '22607000000';
    // Racine relative : les pages produits vivent dans /produits/
    const ROOT_PREFIX = location.pathname.indexOf('/produits/') !== -1 ? '..' : '.';

    function cartLoad() {
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
        catch (e) { return []; }
    }
    function cartSave(items) {
        try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* stockage indisponible */ }
    }
    function fmtFcfa(n) {
        return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
    }

    /** Re-rend les icônes Lucide après une injection dynamique de HTML. */
    function refreshLucide() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            try { window.lucide.createIcons(); } catch (e) { /* bundle indisponible */ }
        }
    }

    function initCart() {
        // Le drawer existe sur l'accueil ; injecté sinon (pages produits générées)
        if (!document.getElementById('cartDrawer')) {
            document.body.insertAdjacentHTML('beforeend',
                '<aside class="cart-drawer" id="cartDrawer" aria-hidden="true" aria-label="Panier">' +
                '<div class="cart-header"><span class="cart-title"><i data-lucide="shopping-cart"></i> Mon panier <span class="cart-header-count" id="cartHeaderCount">0</span></span>' +
                '<button class="mobile-close" id="cartClose" aria-label="Fermer le panier">&times;</button></div>' +
                '<div class="cart-items" id="cartItems"></div>' +
                '<div class="cart-empty" id="cartEmpty"><i data-lucide="shopping-cart"></i><p>Votre panier est vide</p>' +
                '<span>Ajoutez des produits depuis le catalogue, puis commandez le tout en un clic sur WhatsApp.</span></div>' +
                '<div class="cart-footer" id="cartFooter" hidden>' +
                '<div class="cart-total-row"><span>Total</span><strong id="cartTotal">0 FCFA</strong></div>' +
                '<div class="wa-preview" id="cartWaPreview"></div>' +
                '<button type="button" class="btn btn-orange btn-block" id="cartCheckout"><img src="' + ROOT_PREFIX + '/images/brands/whatsapp-white.svg" alt="WhatsApp" class="wa-img">&nbsp; Commander sur WhatsApp</button>' +
                '<button type="button" class="btn btn-outline-orange btn-block mt-2" id="cartClear">Vider le panier</button>' +
                '</div></aside><div class="cart-overlay" id="cartOverlay"></div>');
        }
        // Bouton flottant sur les pages sans bouton panier dans l'en-tête
        if (!document.getElementById('cartBtn')) {
            document.body.insertAdjacentHTML('beforeend',
                '<button type="button" class="cart-fab" id="cartFab" aria-label="Ouvrir le panier">' +
                '<i data-lucide="shopping-cart"></i><span class="cart-count" id="cartFabCount" hidden>0</span></button>');
        }

        const drawer = document.getElementById('cartDrawer');
        const overlay = document.getElementById('cartOverlay');
        const itemsEl = document.getElementById('cartItems');
        const emptyEl = document.getElementById('cartEmpty');
        const footerEl = document.getElementById('cartFooter');
        const totalEl = document.getElementById('cartTotal');
        const headerCountEl = document.getElementById('cartHeaderCount');
        const badge = document.getElementById('cartCount');
        const fabBadge = document.getElementById('cartFabCount');
        const cartBtn = document.getElementById('cartBtn');
        const fab = document.getElementById('cartFab');
        let items = cartLoad();

        function open() {
            drawer.classList.add('active');
            overlay.classList.add('active');
            drawer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
        function shut() {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            drawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
        if (cartBtn) cartBtn.addEventListener('click', open);
        if (fab) fab.addEventListener('click', open);
        document.getElementById('cartClose').addEventListener('click', shut);
        overlay.addEventListener('click', shut);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });

        const previewEl = document.getElementById('cartWaPreview');
        const checkoutEl = document.getElementById('cartCheckout');
        const clearEl = document.getElementById('cartClear');

        // --- Échappement HTML (les noms viennent d'attributs data) ---
        function esc(s) {
            return String(s).replace(/[&<>"']/g, c =>
                ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        }

        // --- Ligne d'article du panier ---
        function itemHtml(it) {
            return '<div class="cart-item" data-id="' + esc(it.id) + '">' +
                '<div class="cart-item-img"><i data-lucide="laptop"></i></div>' +
                '<div class="cart-item-body">' +
                '<p class="cart-item-name">' + esc(it.name) + '</p>' +
                '<p class="cart-item-price"><strong>' + fmtFcfa(it.price * it.qty) + '</strong>' +
                (it.qty > 1 ? ' · ' + fmtFcfa(it.price) + ' /u' : '') + '</p>' +
                '<button type="button" class="cart-item-remove" data-remove aria-label="Retirer du panier"><i data-lucide="trash-2"></i></button>' +
                '</div>' +
                '<div class="cart-item-qty">' +
                '<button type="button" class="qty-btn" data-qty="1" aria-label="Augmenter la quantité"><i data-lucide="plus"></i></button>' +
                '<span class="qty-val">' + it.qty + '</span>' +
                '<button type="button" class="qty-btn" data-qty="-1" aria-label="Réduire la quantité"><i data-lucide="minus"></i></button>' +
                '</div></div>';
        }

        // --- Rendu complet + persistance ---
        function updateBadges() {
            const count = items.reduce((s, it) => s + it.qty, 0);
            const total = items.reduce((s, it) => s + it.qty * it.price, 0);
            [badge, fabBadge].forEach(b => {
                if (!b) return;
                b.textContent = count;
                b.hidden = count === 0;
            });
            if (headerCountEl) headerCountEl.textContent = count;
            if (totalEl) totalEl.textContent = fmtFcfa(total);
            const has = items.length > 0;
            if (itemsEl) {
                itemsEl.innerHTML = has ? items.map(itemHtml).join('') : '';
                itemsEl.style.display = has ? '' : 'none';
            }
            if (emptyEl) emptyEl.style.display = has ? 'none' : 'flex';
            if (footerEl) footerEl.hidden = !has;
            updateWaPreview();
            refreshLucide();
            cartSave(items);
        }

        function updateWaPreview() {
            if (!previewEl) return;
            previewEl.textContent = items.map(it => it.qty + '× ' + it.name).join(' · ');
        }

        // --- Feedback visuel (badge qui "pop" + panier qui "flash") ---
        function popBadge() {
            [badge, fabBadge].forEach(b => {
                if (!b) return;
                b.classList.remove('pop');
                void b.offsetWidth;
                b.classList.add('pop');
            });
            if (cartBtn) {
                cartBtn.classList.remove('cart-flash');
                void cartBtn.offsetWidth;
                cartBtn.classList.add('cart-flash');
            }
        }

        function addItem(id, name, price) {
            const found = items.find(it => it.id === id);
            if (found) found.qty += 1;
            else items.push({ id: id, name: name, price: price, qty: 1 });
            updateBadges();
            popBadge();
        }

        // Boutons "Ajouter au panier" — délégation : fonctionne sur l'accueil
        // ET sur les pages produits générées, sans code supplémentaire.
        document.addEventListener('click', e => {
            const btn = e.target.closest('[data-cart-add]');
            if (!btn) return;
            addItem(btn.dataset.id, btn.dataset.name || 'Produit', Number(btn.dataset.price) || 0);
            const prev = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="check"></i>&nbsp; Ajouté !';
            refreshLucide();
            btn.disabled = true;
            setTimeout(() => { btn.innerHTML = prev; btn.disabled = false; refreshLucide(); }, 1100);
        });

        // Interactions dans le drawer : quantité +/- et suppression (délégation)
        if (itemsEl) itemsEl.addEventListener('click', e => {
            const row = e.target.closest('.cart-item');
            if (!row) return;
            const id = row.dataset.id;
            const it = items.find(x => x.id === id);
            if (!it) return;
            const q = e.target.closest('[data-qty]');
            if (q) {
                it.qty += Number(q.dataset.qty);
                if (it.qty <= 0) items = items.filter(x => x.id !== id);
                updateBadges();
                return;
            }
            if (e.target.closest('[data-remove]')) {
                items = items.filter(x => x.id !== id);
                updateBadges();
            }
        });

        // Commander sur WhatsApp : récapitulatif complet du panier
        if (checkoutEl) checkoutEl.addEventListener('click', () => {
            if (!items.length) return;
            const lines = items.map(it => '- ' + it.qty + ' × ' + it.name + ' (' + fmtFcfa(it.price * it.qty) + ')');
            const total = items.reduce((s, it) => s + it.qty * it.price, 0);
            const msg = 'Bonjour AGO Tech Company ! Je voudrais commander :\n' +
                lines.join('\n') + '\nTotal : ' + fmtFcfa(total);
            window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
        });

        // Vider le panier
        if (clearEl) clearEl.addEventListener('click', () => { items = []; updateBadges(); });

        // Rendu initial (restaure le panier sauvegardé)
        updateBadges();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCart);
    } else {
        initCart();
    }
})();
