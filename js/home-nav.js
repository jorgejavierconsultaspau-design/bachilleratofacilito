(() => {
    const themeToggle = document.querySelector('.bf-theme-toggle');
    const themeIcon = themeToggle?.querySelector('[data-theme-icon]');
    const themeLabel = themeToggle?.querySelector('[data-theme-label]');
    const toastContainer = document.getElementById('toast-container');
    const loader = document.getElementById('app-loader');
    let theme = 'light';

    const showToast = (message, type = 'success') => {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('is-visible');
        });

        window.setTimeout(() => {
            toast.classList.remove('is-visible');
            window.setTimeout(() => toast.remove(), 260);
        }, 2800);
    };

    try {
        if (localStorage.getItem('bf-theme') === 'dark') theme = 'dark';
    } catch (error) {
        console.error('No se pudo recuperar la preferencia del tema.', error);
    }

    const applyTheme = (nextTheme, persist = false) => {
        theme = nextTheme;
        document.body.dataset.theme = theme;
        document.body.classList.toggle('theme-dark', theme === 'dark');
        if (themeToggle) {
            const isDark = theme === 'dark';
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('aria-label', `Activar modo ${isDark ? 'claro' : 'oscuro'}`);
        }
        if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀' : '◐';
        if (themeLabel) themeLabel.textContent = `Modo ${theme === 'dark' ? 'claro' : 'oscuro'}`;

        if (persist) {
            try {
                localStorage.setItem('bf-theme', theme);
            } catch (error) {
                console.error('No se pudo guardar la preferencia del tema.', error);
            }
        }
    };

    const setupReveal = () => {
        const elements = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window) || elements.length === 0) {
            elements.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.16 });

        elements.forEach((element) => observer.observe(element));
    };

    const setupRipple = () => {
        const selectors = 'a, button, .bf-button, .bf-subject, .bf-suggestion-choice, .bf-theme-toggle';
        document.querySelectorAll(selectors).forEach((element) => {
            if (element.dataset.rippleBound === 'true') return;
            element.dataset.rippleBound = 'true';
            element.addEventListener('click', (event) => {
                if (element.closest('.bf-menu-toggle')) return;
                const ripple = document.createElement('span');
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.className = 'ripple';
                ripple.style.width = `${size}px`;
                ripple.style.height = `${size}px`;
                ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
                ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
                element.appendChild(ripple);
                window.setTimeout(() => ripple.remove(), 420);
            });
        });
    };

    const setupBackToTop = () => {
        const button = document.getElementById('back-to-top');
        if (!button) return;

        const toggleButton = () => {
            button.classList.toggle('is-visible', window.scrollY > 420);
        };

        toggleButton();
        window.addEventListener('scroll', toggleButton, { passive: true });
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    const setupLoader = () => {
        if (!loader) return;
        window.addEventListener('load', () => {
            window.setTimeout(() => loader.classList.add('is-hidden'), 180);
        }, { once: true });
    };

    const setupPageExit = () => {
        window.addEventListener('beforeunload', () => {
            document.body.classList.add('is-leaving');
        });
    };

    applyTheme(theme);
    setupReveal();
    setupRipple();
    setupBackToTop();
    setupLoader();
    setupPageExit();

    themeToggle?.addEventListener('click', () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme, true);
        showToast(`Modo ${nextTheme === 'dark' ? 'oscuro' : 'claro'} activado`, 'success');
    });

    const toggle = document.querySelector('.bf-menu-toggle');
    const navigation = document.getElementById('main-navigation');
    if (!toggle || !navigation) return;

    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        navigation.classList.toggle('is-open', !isOpen);
    });

    navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        navigation.classList.remove('is-open');
    }));

    window.showToast = showToast;
})();
