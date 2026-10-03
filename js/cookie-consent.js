(function () {
    // La preferencia es necesaria para respetar la elección; los servicios no esenciales deben esperar a "all".
    const storageKey = 'bachilleratoFacilitoCookieConsent';
    const validConsentValues = new Set(['all', 'essential']);
    let savedConsent = null;
    let banner;
    let manageButton = null;
    let isOpen = false;

    try {
        const storedConsent = window.localStorage.getItem(storageKey);
        savedConsent = validConsentValues.has(storedConsent) ? storedConsent : null;
    } catch (error) {
        savedConsent = null;
    }

    const createElement = (tagName, className, text) => {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    };

    const saveConsent = (value) => {
        try {
            window.localStorage.setItem(storageKey, value);
            savedConsent = value;
        } catch (error) {
            savedConsent = value;
        }
        window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: value }));
    };

    const setBackgroundInert = (inert) => {
        [...document.body.children].forEach((element) => {
            if (element !== banner && element !== manageButton && element.tagName !== 'SCRIPT') {
                element.inert = inert;
            }
        });
    };

    const createManageButton = () => {
        if (manageButton?.isConnected) return manageButton;

        manageButton = createElement('button', 'cookie-settings-button', 'Cookies');
        manageButton.type = 'button';
        manageButton.setAttribute('aria-label', 'Abrir configuración de cookies');
        manageButton.addEventListener('click', () => openBanner(manageButton));
        document.body.appendChild(manageButton);
        return manageButton;
    };

    const closeBanner = (consent) => {
        if (consent) saveConsent(consent);
        isOpen = false;
        banner.classList.add('cookie-banner--hidden');
        banner.setAttribute('aria-hidden', 'true');
        setBackgroundInert(false);
        createManageButton().focus({ preventScroll: true });
    };

    const openBanner = (trigger) => {
        if (trigger && trigger === manageButton) {
            trigger.remove();
            manageButton = null;
        }
        isOpen = true;
        banner.classList.remove('cookie-banner--hidden');
        banner.removeAttribute('aria-hidden');
        setBackgroundInert(true);
        banner.querySelector('.cookie-button--secondary').focus({ preventScroll: true });
    };

    const createBanner = () => {
        banner = createElement('aside', 'cookie-banner');
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-modal', 'true');
        banner.setAttribute('aria-labelledby', 'cookie-banner-title');
        banner.setAttribute('aria-describedby', 'cookie-banner-description');

        const content = createElement('div', 'cookie-banner__content');
        const eyebrow = createElement('p', 'cookie-banner__eyebrow', 'Tu privacidad importa');
        const title = createElement('h2', null, 'Valoramos tu privacidad');
        title.id = 'cookie-banner-title';
        const description = createElement('p', 'cookie-banner__description', 'Guardamos en el almacenamiento local de tu navegador la decisión que elijas. Actualmente no se cargan herramientas de analítica ni publicidad personalizada. Puedes cambiar tu decisión en cualquier momento con el botón «Cookies».');
        description.id = 'cookie-banner-description';
        const legalLink = createElement('a', 'cookie-banner__link', 'Más información');
        legalLink.href = 'legal.html#cookies';
        description.append(' ', legalLink);
        content.append(eyebrow, title, description);

        const actions = createElement('div', 'cookie-banner__actions');
        const acceptButton = createElement('button', 'cookie-button cookie-button--primary', 'Aceptar todas');
        const rejectButton = createElement('button', 'cookie-button cookie-button--secondary', 'Rechazar no esenciales');
        acceptButton.type = 'button';
        rejectButton.type = 'button';
        actions.append(acceptButton, rejectButton);
        banner.append(content, actions);

        acceptButton.addEventListener('click', () => closeBanner('all'));
        rejectButton.addEventListener('click', () => closeBanner('essential'));
        document.body.appendChild(banner);
    };

    document.addEventListener('keydown', (event) => {
        if (!isOpen) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            if (savedConsent) closeBanner(null);
            return;
        }

        if (event.key !== 'Tab') return;
        const focusableElements = [...banner.querySelectorAll('a[href], button:not([disabled])')];
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!banner.contains(document.activeElement) || (event.shiftKey && document.activeElement === firstElement)) {
            event.preventDefault();
            (event.shiftKey ? lastElement : firstElement).focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    });

    createBanner();
    if (savedConsent) {
        banner.classList.add('cookie-banner--hidden');
        banner.setAttribute('aria-hidden', 'true');
        createManageButton();
    } else {
        openBanner(null);
    }
}());
