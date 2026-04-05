function getPref(key, fallback) {
    try {
        var v = localStorage.getItem(key);
        if (v !== null && v !== undefined && v !== '') return v;
    } catch (e) {}
    var c = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
    if (c) return decodeURIComponent(c[2]);
    return fallback;
}

function setPref(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
    var date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + encodeURIComponent(val) + ';expires=' + date.toUTCString() + ';path=/;SameSite=Lax';
}

function initApp() {
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');

    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    var animating = false;

    function openMenu() {
        if (animating) return;
        animating = true;
        hamburger.classList.add('active');
        navLinks.classList.add('open');
        backdrop.classList.add('active');
        document.body.classList.add('menu-open');
        setTimeout(function () { animating = false; }, 400);
    }

    function closeMenu() {
        if (animating) return;
        animating = true;
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        backdrop.classList.remove('active');
        document.body.classList.remove('menu-open');
        setTimeout(function () { animating = false; }, 400);
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            if (navLinks.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        backdrop.addEventListener('click', function (e) {
            e.stopPropagation();
            closeMenu();
        });

        var links = document.querySelectorAll('.nav-link');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', closeMenu);
        }

        var wasMobile = window.innerWidth <= 960;

        window.addEventListener('resize', function () {
            var isMobile = window.innerWidth <= 960;

            if (wasMobile && !isMobile) {
                closeMenu();
            } else if (!wasMobile && isMobile) {
                navLinks.style.transition = 'none';
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        navLinks.style.transition = '';
                    });
                });
            }

            wasMobile = isMobile;
        });
    }

    var lastScrollTop = 0;
    var navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 50) {
            navbar.classList.add('shrink');
        } else {
            navbar.classList.remove('shrink');
        }
        lastScrollTop = scrollTop;
    });

    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var current = document.documentElement.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            setPref('theme', next);
        });
    }

    function updateThemeImages() {
        var theme = document.documentElement.getAttribute('data-theme');
        var imgs = document.querySelectorAll('[data-theme-img]');
        for (var i = 0; i < imgs.length; i++) {
            var lightSrc = imgs[i].getAttribute('data-light');
            var darkSrc = imgs[i].getAttribute('data-dark');
            if (lightSrc && darkSrc) {
                imgs[i].src = theme === 'dark' ? darkSrc : lightSrc;
            }
        }
    }

    updateThemeImages();

    var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].attributeName === 'data-theme') {
                updateThemeImages();
            }
        }
    });
    observer.observe(document.documentElement, { attributes: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
