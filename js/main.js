/**
 * AGO Tech Company SARL - Main JavaScript
 * Vanilla ES6 - Aucune dépendance framework
 */

(function () {
    'use strict';

    // ===== CONFIGURATION =====
    const WHATSAPP_NUMBER = '22607000000';
    const WHATSAPP_MESSAGE = 'Bonjour AGO Tech Company ! Je voudrais des informations sur vos produits';

    // ===== INIT AOS =====
    function initAOS() {
        // Garde-fou anti-page-blanche : si AOS est indisponible OU si on détecte
        // (connexion lente / petit écran / reduced-motion), on force l'affichage
        // de tout le contenu au lieu de laisser [data-aos]{opacity:0} cacher le site.
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const slowConn = navigator.connection &&
            (navigator.connection.saveData ||
             navigator.connection.effectiveType === 'slow-2g' ||
             navigator.connection.effectiveType === '2g');
        const tinyScreen = window.innerWidth < 380;

        if (typeof AOS === 'undefined' || reduceMotion || slowConn || tinyScreen) {
            document.documentElement.classList.add('no-aos');
            return;
        }
        try {
            AOS.init({
                duration: 550,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 0
            });
        } catch (e) {
            document.documentElement.classList.add('no-aos');
        }
    }

    // ===== 1. HERO SLIDER =====
    let currentSlide = 0;
    let slideInterval;
    let slides, dots;

    function initHeroSlider() {
        slides = document.querySelectorAll('.hero-slide');
        dots = document.querySelectorAll('.hero-dot');
        if (!slides.length) return;

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goToSlide(parseInt(dot.dataset.slide));
            });
        });

        startAutoPlay();

        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', stopAutoPlay);
            hero.addEventListener('mouseleave', startAutoPlay);
        }

        // Touch support
        let touchStartX = 0;
        if (hero) {
            hero.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
            hero.addEventListener('touchend', e => {
                const diff = touchStartX - e.changedTouches[0].screenX;
                if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
            }, { passive: true });
        }
    }

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoPlay() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        stopAutoPlay();
        slideInterval = setInterval(nextSlide, 4000);
    }
    function stopAutoPlay() { clearInterval(slideInterval); }

    // ===== 2. COUNTDOWN (7 jours) =====
    function initCountdown() {
        const daysEl = document.getElementById('cd-days');
        const hoursEl = document.getElementById('cd-hours');
        const minsEl = document.getElementById('cd-mins');
        const secsEl = document.getElementById('cd-secs');
        if (!daysEl) return;

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);
        endDate.setHours(23, 59, 59, 0);

        function update() {
            const diff = endDate.getTime() - new Date().getTime();
            if (diff <= 0) {
                daysEl.textContent = '00'; hoursEl.textContent = '00';
                minsEl.textContent = '00'; secsEl.textContent = '00';
                return;
            }
            const days = Math.floor(diff / 86400000);
            const hours = Math.floor((diff % 86400000) / 3600000);
            const mins = Math.floor((diff % 3600000) / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            daysEl.textContent = days < 10 ? '0' + days : days;
            hoursEl.textContent = hours < 10 ? '0' + hours : hours;
            minsEl.textContent = mins < 10 ? '0' + mins : mins;
            secsEl.textContent = secs < 10 ? '0' + secs : secs;
        }
        update();
        setInterval(update, 1000);
    }

    // ===== 3. FILTRE CATÉGORIES =====
    function initCategoryFilter() {
        const chips = document.querySelectorAll('.category-chip');
        const cards = document.querySelectorAll('.product-card');
        const noResults = document.getElementById('noResults');
        let activeCat = 'all';

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const filter = chip.dataset.filter;
                activeCat = filter;
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                applyFilter(cards, noResults);
            });
        });

        const navLinks = document.querySelectorAll('[data-cat]');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const cat = link.dataset.cat;
                if (!cat) return;
                const matching = document.querySelector(`.category-chip[data-filter="${cat}"]`);
                if (matching) matching.click();
            });
        });
    }

    function applyFilter(cards, noResults) {
        const activeChip = document.querySelector('.category-chip.active');
        let visible = 0;
        cards.forEach(card => {
            const cat = card.dataset.category;
            const sub = card.dataset.sub || '';
            if (!activeChip || activeChip.dataset.filter === 'all') {
                card.style.display = '';
                visible++;
            } else {
                const f = activeChip.dataset.filter;
                const s = activeChip.dataset.sub || '';
                if (cat === f && (!s || sub === s)) { card.style.display = ''; visible++; }
                else card.style.display = 'none';
            }
        });
        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
        if (typeof AOS !== 'undefined') setTimeout(() => AOS.refresh(), 100);
    }

    // ===== 4. RECHERCHE TEMPS RÉEL =====
    function initSearch() {
        const input = document.getElementById('searchInput');
        const cards = document.querySelectorAll('.product-card');
        const noResults = document.getElementById('noResults');
        if (!input) return;

        input.addEventListener('input', () => {
            const q = input.value.toLowerCase().trim();
            let visible = 0;
            cards.forEach(card => {
                const name = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
                const specs = card.querySelector('.product-specs') ? card.querySelector('.product-specs').textContent.toLowerCase() : '';
                const cat = card.dataset.category || '';
                if (!q || name.includes(q) || specs.includes(q) || cat.includes(q)) {
                    card.style.display = ''; visible++;
                } else card.style.display = 'none';
            });
            if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
            if (q) document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
        });
    }

    // Filtre produits (Tous / Nouveau / Promo)
    function initProductFilters() {
        const btns = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.product-card');
        if (!btns.length) return;
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const f = btn.dataset.filter;
                cards.forEach(card => {
                    if (f === 'all' || card.dataset.badge === f) card.style.display = '';
                    else card.style.display = 'none';
                });
            });
        });
    }

    // ===== 5. WISHLIST =====
    function initWishlist() {
        const wishlist = JSON.parse(localStorage.getItem('ago_wishlist') || '[]');
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const id = btn.dataset.id;
            if (wishlist.includes(id)) btn.classList.add('active');
            btn.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                const idx = wishlist.indexOf(id);
                if (idx === -1) { wishlist.push(id); btn.classList.add('active'); }
                else { wishlist.splice(idx, 1); btn.classList.remove('active'); }
                localStorage.setItem('ago_wishlist', JSON.stringify(wishlist));
            });
        });
    }

    // ===== 6. NEWSLETTER =====
    function initNewsletter() {
        const form = document.getElementById('newsletterForm');
        const email = document.getElementById('newsletterEmail');
        const msg = document.getElementById('newsletterMsg');
        if (!form) return;
        form.addEventListener('submit', e => {
            e.preventDefault();
            const val = email.value.trim();
            if (!val) { msg.textContent = 'Veuillez entrer votre email.'; msg.className = 'newsletter-msg error'; return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                msg.textContent = 'Email invalide.'; msg.className = 'newsletter-msg error'; return;
            }
            msg.textContent = 'Inscription confirmée !'; msg.className = 'newsletter-msg success';
            email.value = '';
            setTimeout(() => { msg.textContent = ''; msg.className = 'newsletter-msg'; }, 4000);
        });
    }

    // ===== 7. NAVBAR MOBILE =====
    function initMobileNav() {
        const hamburger = document.getElementById('hamburgerBtn');
        const mobileNav = document.getElementById('mobileNav');
        const close = document.getElementById('mobileClose');
        const overlay = document.getElementById('mobileOverlay');
        if (!hamburger || !mobileNav) return;

        function open() {
            mobileNav.classList.add('active');
            overlay.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function shut() {
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
        hamburger.addEventListener('click', () => {
            mobileNav.classList.contains('active') ? shut() : open();
        });
        if (close) close.addEventListener('click', shut);
        if (overlay) overlay.addEventListener('click', shut);
        mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
    }

    // ===== 8. WHATSAPP FLOAT =====
    function initWhatsAppFloat() {
        const btn = document.getElementById('whatsappFloat');
        if (!btn) return;
        let shown = false;
        function check() {
            if (shown) return;
            if (window.scrollY > 100) {
                btn.classList.add('visible'); shown = true;
                window.removeEventListener('scroll', check);
            }
        }
        window.addEventListener('scroll', check, { passive: true });
        setTimeout(() => { if (!shown) { btn.classList.add('visible'); shown = true; } }, 2000);
    }

    // ===== 9. SMOOTH SCROLL =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                const id = link.getAttribute('href');
                if (id === '#' || id.length < 2) return;
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    const offset = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
                    const pos = target.getBoundingClientRect().top + window.scrollY - offset - 10;
                    window.scrollTo({ top: pos, behavior: 'smooth' });
                }
            });
        });
    }

    // ===== 10. HEADER SCROLL EFFECT =====
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(30,53,69,.1)' : 'none';
        }, { passive: true });
    }

    // ===== 11. STATUT OUVERTURE (selon horaires Lun–Sam 8h–18h) =====
    function initOpeningStatus() {
        const badge = document.querySelector('.badge-status');
        if (!badge) return;
        const now = new Date();
        const day = now.getDay();
        const h = now.getHours();
        const open = day >= 1 && day <= 6 && h >= 8 && h < 18;
        if (open) { badge.textContent = 'Ouvert'; badge.classList.add('badge-status--open'); }
        else { badge.textContent = 'Fermé'; badge.classList.add('badge-status--closed'); }
    }

    // ===== 12. HEADER SCROLL BLUR =====
    function initHeaderScrollBlur() {
        const header = document.querySelector('.header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 80);
        }, { passive: true });
    }

    // ===== 13. HERO TEXT REVEAL (mot par mot) =====
    function initHeroTextReveal() {
        const words = document.querySelectorAll('.hero-title .word');
        if (!words.length) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    words.forEach(w => w.classList.add('visible'));
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) observer.observe(heroTitle);
    }

    // ===== 14. COUNTDOWN FLIP ANIMATION =====
    function initCountdownFlip() {
        const digits = document.querySelectorAll('.countdown-digit');
        if (!digits.length) return;
        const prevValues = {};
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                const el = m.target;
                const id = el.dataset.unit || el.textContent;
                const newVal = el.textContent;
                if (prevValues[id] !== undefined && prevValues[id] !== newVal) {
                    el.classList.remove('flipping');
                    void el.offsetWidth;
                    el.classList.add('flipping');
                }
                prevValues[id] = newVal;
            });
        });
        digits.forEach(d => {
            prevValues[d.dataset.unit || d.textContent] = d.textContent;
            observer.observe(d, { childList: true, characterData: true, subtree: true });
        });
    }

    // ===== 15. MARQUEE MARQUES — défilement continu GARANTI (desktop + mobile) =====
    // Certains OS/config (Windows "Afficher les animations" désactivé, mode
    // économie d'énergie, certains lanceurs Android) envoient
    // prefers-reduced-motion: reduce → les animations CSS sont coupées et la
    // marquee reste figée. On anime donc en JavaScript (requestAnimationFrame),
    // ce qui fonctionne dans 100 % des cas, sans dépendre du CSS.
    function initMarquee() {
        const track = document.querySelector('.brands-track');
        if (!track) return;

        // Désactive l'animation CSS (elle écraserait la transform du JS)
        track.style.animation = 'none';

        const children = track.children;
        if (!children.length) return;

        // Vitesse en px par frame (plus rapide sur mobile pour un effet visible)
        let speed = window.innerWidth < 480 ? 0.9 : 0.55;

        // Point de boucle : position exacte de la 1re marque dupliquée
        const splitIndex = Math.floor(children.length / 2);
        let loopAt = children[splitIndex] ? children[splitIndex].offsetLeft : track.scrollWidth / 2;

        let offset = 0;
        let rafId = null;

        function step() {
            offset -= speed;
            if (Math.abs(offset) >= loopAt) offset += loopAt;
            track.style.transform = 'translate3d(' + offset + 'px,0,0)';
            rafId = requestAnimationFrame(step);
        }
        function start() {
            if (rafId === null) rafId = requestAnimationFrame(step);
        }
        function stop() {
            if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
        }

        // N'anime que quand la section est visible (économie batterie/GPS mobile)
        const section = track.closest('.brands-marquee');
        if ('IntersectionObserver' in window && section) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) start();
                    else stop();
                });
            }, { threshold: 0.05 });
            io.observe(section);
        } else {
            start();
        }

        // Recalcule vitesse/point de boucle si la fenêtre change ou images chargées
        window.addEventListener('resize', () => {
            speed = window.innerWidth < 480 ? 0.9 : 0.55;
            if (children[splitIndex]) loopAt = children[splitIndex].offsetLeft;
        }, { passive: true });
        window.addEventListener('load', () => {
            if (children[splitIndex]) loopAt = children[splitIndex].offsetLeft;
        });
    }

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', () => {
        initAOS();
        initHeroSlider();
        initCountdown();
        initCategoryFilter();
        initSearch();
        initProductFilters();
        initWishlist();
        initNewsletter();
        initMobileNav();
        initWhatsAppFloat();
        initSmoothScroll();
        initHeaderScroll();
        initOpeningStatus();
        initHeaderScrollBlur();
        initHeroTextReveal();
        initCountdownFlip();
        initMarquee();
    });

})();
