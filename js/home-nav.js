(() => {
    const themeToggle = document.querySelector('.bf-theme-toggle');
    const themeIcon = themeToggle?.querySelector('[data-theme-icon]');
    const themeLabel = themeToggle?.querySelector('[data-theme-label]');
    let theme = 'light';

    try {
        if (localStorage.getItem('bf-theme') === 'dark') theme = 'dark';
    } catch (error) {
        console.error('No se pudo recuperar la preferencia del tema.', error);
    }

    const applyTheme = (nextTheme, persist = false) => {
        theme = nextTheme;
        document.body.dataset.theme = theme;
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

    applyTheme(theme);
    themeToggle?.addEventListener('click', () => {
        applyTheme(theme === 'dark' ? 'light' : 'dark', true);
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
})();
