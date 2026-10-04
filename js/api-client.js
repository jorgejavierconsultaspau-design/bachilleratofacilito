(() => {
    const apiBase = document.querySelector('meta[name="bf-api-base"]')?.content || '/api';

    const request = async (path, options = {}) => {
        const {
            body,
            responseType = 'json',
            headers: suppliedHeaders = {},
            ...fetchOptions
        } = options;
        const headers = new Headers(suppliedHeaders);
        headers.set('Accept', responseType === 'blob' ? 'application/pdf, application/octet-stream' : 'application/json');

        if (body !== undefined) headers.set('Content-Type', 'application/json');

        const response = await fetch(`${apiBase}${path}`, {
            ...fetchOptions,
            credentials: 'include',
            headers,
            body: body === undefined ? undefined : JSON.stringify(body)
        });

        if (!response.ok) {
            const message = response.status === 404
                ? `La API ${apiBase}${path} todavía no está desplegada (404).`
                : `La API respondió con el error HTTP ${response.status}.`;
            throw new Error(message);
        }

        if (response.status === 204) return null;
        return responseType === 'blob' ? response.blob() : response.json();
    };

    window.bfApi = Object.freeze({ request });
})();
