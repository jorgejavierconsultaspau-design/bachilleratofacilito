(function () {
    const storageKey = 'bachilleratoFacilitoCookieConsent';
    const savedConsent = window.localStorage.getItem(storageKey);

    const createElement = (tagName, className, text) => {
        const element = document.createElement(tagName);
        if (className) {
            element.className = className;
        }
        if (text) {
            element.textContent = text;
        }
        return element;
    };

    const saveConsent = (value) => {
        window.localStorage.setItem(storageKey, value);
        window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: value }));
    };

    const createManageButton = () => {
        const button = createElement('button', 'cookie-settings-button', 'Cookies');
        button.type = 'button';
        button.setAttribute('aria-label', 'Abrir configuración de cookies');
        button.addEventListener('click', () => {
            const banner = document.querySelector('.cookie-banner');
            if (banner) {
                banner.classList.remove('cookie-banner--hidden');
                banner.removeAttribute('aria-hidden');
            }
            button.remove();
        });
        document.body.appendChild(button);
    };

    const createBanner = () => {
        const banner = createElement('aside', 'cookie-banner');
        banner.setAttribute('aria-label', 'Consentimiento de cookies');
        banner.setAttribute('role', 'dialog');

        const content = createElement('div', 'cookie-banner__content');
        const eyebrow = createElement('p', 'cookie-banner__eyebrow', 'Tu privacidad importa');
        const title = createElement('h2', null, 'Valoramos tu privacidad');
        const description = createElement('p', 'cookie-banner__description', 'Usamos cookies propias y de terceros para analizar el uso de la web y mostrar anuncios personalizados. Puedes aceptar todas o rechazar las que no sean necesarias.');
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

        const closeBanner = (consent) => {
            saveConsent(consent);
            banner.classList.add('cookie-banner--hidden');
            banner.setAttribute('aria-hidden', 'true');
            window.setTimeout(createManageButton, 350);
        };

        acceptButton.addEventListener('click', () => closeBanner('all'));
        rejectButton.addEventListener('click', () => closeBanner('essential'));
        document.body.appendChild(banner);
        return banner;
    };

    const banner = createBanner();
    if (savedConsent) {
        banner.classList.add('cookie-banner--hidden');
        banner.setAttribute('aria-hidden', 'true');
        createManageButton();
    }
}());
