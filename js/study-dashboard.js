(() => {
    const api = window.bfApi;
    if (!api) {
        console.error('No se ha cargado el cliente de la API del espacio de estudio.');
        return;
    }

    const get = (id) => document.getElementById(id);
    const setStatus = (id, message, state = '') => {
        const element = get(id);
        if (!element) {
            console.error(`Falta el elemento de estado #${id}.`);
            return;
        }
        element.textContent = message;
        element.dataset.state = state;
    };

    const runRequest = async (statusId, operation, callback) => {
        setStatus(statusId, `${operation}…`, 'pending');
        try {
            const result = await callback();
            setStatus(statusId, `${operation} completado.`, 'success');
            return { ok: true, value: result };
        } catch (error) {
            const message = error instanceof TypeError
                ? 'No se pudo conectar con /api. Despliega el backend y vuelve a intentarlo.'
                : error instanceof Error ? error.message : 'Error inesperado al conectar con la API.';
            console.error(`${operation}:`, error);
            setStatus(statusId, `${operation}: ${message}`, 'error');
            return { ok: false, value: null };
        }
    };

    const requireItems = (response, operation) => {
        if (!response || !Array.isArray(response.items)) {
            throw new Error(`${operation} debe responder con un objeto que contenga items[].`);
        }
        return response.items;
    };

    const setAuthMode = (mode) => {
        const isRegister = mode === 'register';
        const name = get('account-name');
        const nameLabel = get('account-name-field');
        const terms = get('account-terms');
        const termsLabel = get('account-terms-field');
        const password = get('account-password');
        const submit = get('account-form').querySelector('button[type="submit"]');
        name.hidden = !isRegister;
        name.required = isRegister;
        nameLabel.hidden = !isRegister;
        terms.required = isRegister;
        terms.checked = false;
        termsLabel.hidden = !isRegister;
        password.autocomplete = isRegister ? 'new-password' : 'current-password';
        submit.innerHTML = isRegister ? 'Crear cuenta <span>→</span>' : 'Iniciar sesión <span>→</span>';
        document.querySelectorAll('[data-auth-mode]').forEach((button) => {
            button.setAttribute('aria-pressed', String(button.dataset.authMode === mode));
        });
        get('account-form').dataset.mode = mode;
        setStatus('account-status', '');
    };

    document.querySelectorAll('[data-auth-mode]').forEach((button) => {
        button.addEventListener('click', () => setAuthMode(button.dataset.authMode));
    });

    get('account-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const mode = form.dataset.mode || 'login';
        const payload = {
            email: form.elements.email.value.trim(),
            password: form.elements.password.value
        };
        if (mode === 'register') {
            payload.name = form.elements.name.value.trim();
            payload.termsAccepted = form.elements.termsAccepted.checked;
        }

        const { ok, value: result } = await runRequest('account-status', mode === 'register' ? 'Registro' : 'Inicio de sesión', () => (
            api.request(`/auth/${mode === 'register' ? 'register' : 'login'}`, {
                method: 'POST',
                body: payload
            })
        ));
        if (ok) {
            const email = result?.user?.email || payload.email;
            setStatus('account-status', `Sesión iniciada para ${email}.`, 'success');
            get('account-logout').hidden = false;
        }
    });

    get('account-logout').addEventListener('click', async () => {
        const { ok } = await runRequest('account-status', 'Cierre de sesión', () => (
            api.request('/auth/logout', { method: 'POST' })
        ));
        if (ok) get('account-logout').hidden = true;
    });

    const readLocalProgress = () => {
        const stored = localStorage.getItem('bf-study-progress-v1');
        const progress = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(progress) || progress.some((id) => typeof id !== 'string')) {
            throw new Error('El progreso local tiene un formato no válido.');
        }
        return progress;
    };

    get('progress-sync-upload').addEventListener('click', async () => {
        const result = await runRequest('progress-sync-status', 'Sincronización del progreso', async () => {
            const completedTopicIds = readLocalProgress();
            await api.request('/me/progress', {
                method: 'PUT',
                body: { completedTopicIds }
            });
            return completedTopicIds.length;
        });
        if (result.ok) {
            setStatus('progress-sync-status', `${result.value} temas enviados a tu cuenta.`, 'success');
        }
    });

    get('progress-sync-download').addEventListener('click', async () => {
        const result = await runRequest('progress-sync-status', 'Recuperación del progreso', async () => {
            const response = await api.request('/me/progress');
            if (!response || !Array.isArray(response.completedTopicIds)
                || response.completedTopicIds.some((id) => typeof id !== 'string')) {
                throw new Error('GET /api/me/progress debe responder con completedTopicIds[].');
            }
            localStorage.setItem('bf-study-progress-v1', JSON.stringify(response.completedTopicIds));
            return response.completedTopicIds.length;
        });
        if (result.ok) {
            setStatus('progress-sync-status', `${result.value} temas guardados en este navegador. Recarga la portada para actualizar la barra.`, 'success');
        }
    });

    const renderFavorites = (items) => {
        const list = get('favorite-list');
        list.replaceChildren();
        items.forEach((favorite) => {
            const item = document.createElement('li');
            const title = document.createElement('span');
            title.textContent = favorite.title || favorite.id;
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.textContent = 'Quitar';
            remove.setAttribute('aria-label', `Quitar ${title.textContent} de favoritos`);
            remove.addEventListener('click', async () => {
                const { ok } = await runRequest('favorite-status', 'Eliminar favorito', () => (
                    api.request(`/me/favorites/${encodeURIComponent(favorite.id)}`, { method: 'DELETE' })
                ));
                if (ok) loadFavorites();
            });
            item.append(title, remove);
            list.append(item);
        });
    };

    const loadFavorites = async () => {
        const { ok, value: items } = await runRequest('favorite-status', 'Carga de favoritos', async () => {
            const favorites = requireItems(await api.request('/me/favorites'), 'GET /api/me/favorites');
            if (favorites.some((favorite) => typeof favorite.id !== 'string' || !favorite.id)) {
                throw new Error('Cada favorito de la API debe incluir id.');
            }
            return favorites;
        });
        if (ok) renderFavorites(items);
    };

    get('favorite-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const resourceId = get('favorite-resource-id').value.trim();
        const { ok } = await runRequest('favorite-status', 'Guardar favorito', () => (
            api.request('/me/favorites', { method: 'POST', body: { resourceId } })
        ));
        if (ok) {
            get('favorite-resource-id').value = '';
            await loadFavorites();
        }
    });
    get('favorites-load').addEventListener('click', loadFavorites);

    const renderStudyLists = (items) => {
        const select = get('study-list-select');
        select.replaceChildren(new Option('Selecciona una lista', ''));
        items.forEach((list) => {
            const id = list.id;
            const title = list.name || list.title;
            select.append(new Option(title, id));
        });
    };

    const loadStudyLists = async () => {
        const { ok, value: lists } = await runRequest('study-list-status', 'Carga de listas', async () => {
            const items = requireItems(await api.request('/me/study-lists'), 'GET /api/me/study-lists');
            if (items.some((list) => !list.id || !(list.name || list.title))) {
                throw new Error('Cada lista de la API debe incluir id y name.');
            }
            return items;
        });
        if (ok) renderStudyLists(lists);
    };

    get('study-list-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = get('study-list-name').value.trim();
        const { ok } = await runRequest('study-list-status', 'Crear lista', () => (
            api.request('/me/study-lists', { method: 'POST', body: { name } })
        ));
        if (ok) {
            get('study-list-name').value = '';
            await loadStudyLists();
        }
    });
    get('study-lists-load').addEventListener('click', loadStudyLists);

    get('study-list-item-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const listId = get('study-list-select').value;
        const resourceId = get('study-list-resource').value.trim();
        const { ok } = await runRequest('study-list-status', 'Añadir recurso a la lista', () => (
            api.request(`/me/study-lists/${encodeURIComponent(listId)}/items`, {
                method: 'POST',
                body: { resourceId }
            })
        ));
        if (ok) get('study-list-resource').value = '';
    });

    const renderComments = (items) => {
        const list = get('comment-list');
        list.replaceChildren();
        items.forEach((comment) => {
            const item = document.createElement('li');
            const author = document.createElement('strong');
            author.textContent = comment.author || 'Estudiante';
            const content = document.createElement('p');
            content.textContent = comment.content || '';
            item.append(author, content);
            list.append(item);
        });
    };

    get('comments-load-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const resourceId = get('comments-resource').value.trim();
        const { ok, value: comments } = await runRequest('community-status', 'Carga de conversación', async () => (
            requireItems(
                await api.request(`/resources/${encodeURIComponent(resourceId)}/comments`),
                'GET /api/resources/{resourceId}/comments'
            )
        ));
        if (ok) renderComments(comments);
    });

    get('comment-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const resourceId = get('comment-resource').value.trim();
        const content = get('comment-content').value.trim();
        const { ok } = await runRequest('community-status', 'Publicación de la duda', () => (
            api.request(`/resources/${encodeURIComponent(resourceId)}/comments`, {
                method: 'POST',
                body: { content }
            })
        ));
        if (ok) {
            get('comment-content').value = '';
            setStatus('community-status', 'Duda publicada.', 'success');
        }
    });

    get('newsletter-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = get('newsletter-email').value.trim();
        const { ok } = await runRequest('newsletter-status', 'Suscripción', () => (
            api.request('/newsletter/subscriptions', {
                method: 'POST',
                body: { email, consent: get('newsletter-consent').checked }
            })
        ));
        if (ok) get('newsletter-form').reset();
    });

    get('analytics-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const resourceId = get('analytics-resource').value.trim();
        const { ok, value: result } = await runRequest('analytics-status', 'Consulta de analíticas', async () => {
            const response = await api.request(`/resources/${encodeURIComponent(resourceId)}/analytics?period=7d`);
            const views = Number(response.views);
            const students = Number(response.uniqueStudents);
            if (!Number.isFinite(views) || !Number.isFinite(students)) {
                throw new Error('Las analíticas deben responder con views y uniqueStudents numéricos.');
            }
            return { views, students };
        });
        if (ok) {
            const { views, students } = result;
            get('analytics-result').textContent = `${views.toLocaleString('es-ES')} visitas de ${students.toLocaleString('es-ES')} estudiantes en los últimos 7 días.`;
        }
    });

    const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.append(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const staticPdfs = {
        'matematicas-analisis': 'docs/analisis.pdf',
        'fisica-campo-gravitatorio': 'docs/campo-gravitatorio-teoria.pdf'
    };

    get('export-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const resourceId = get('export-resource').value;
        const format = get('export-format').value;
        if (format === 'pdf') {
            const link = document.createElement('a');
            link.href = staticPdfs[resourceId];
            link.download = '';
            document.body.append(link);
            link.click();
            link.remove();
            setStatus('export-status', 'Descarga del PDF iniciada.', 'success');
            return;
        }
        await runRequest('export-status', `Exportación ${format.toUpperCase()}`, async () => {
            const blob = await api.request(`/resources/${encodeURIComponent(resourceId)}/exports`, {
                method: 'POST',
                body: { format },
                responseType: 'blob'
            });
            const validType = format === 'png' ? blob.type === 'image/png' : /^text\/(markdown|plain)$/.test(blob.type);
            if (!blob.size || !validType) {
                throw new Error(`La exportación ${format.toUpperCase()} debe devolver un archivo válido.`);
            }
            downloadBlob(blob, `${resourceId}.${format}`);
            return true;
        });
    });

    get('print-page').addEventListener('click', () => window.print());

    get('exam-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const topicIds = [...get('exam-topics').selectedOptions].map((option) => option.value);
        await runRequest('exam-status', 'Generación del examen', async () => {
            const blob = await api.request('/exams', {
                method: 'POST',
                body: { topicIds },
                responseType: 'blob'
            });
            if (!blob.size || blob.type !== 'application/pdf') {
                throw new Error('La API del generador debe devolver un PDF válido.');
            }
            downloadBlob(blob, 'examen-pau.pdf');
            return true;
        });
    });

    const updateShareLinks = () => {
        const select = get('share-resource');
        const url = new URL(select.value, window.location.href).href;
        const title = `BachilleratoFacilito · ${select.selectedOptions[0].textContent}`;
        get('share-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
        get('share-telegram').href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    };
    get('share-resource').addEventListener('change', updateShareLinks);
    updateShareLinks();

    const calendarDate = get('calendar-date');
    const today = new Date();
    calendarDate.value = new Date(today.getTime() - today.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
    const updateCalendarLink = () => {
        if (!calendarDate.value) return;
        const [year, month, day] = calendarDate.value.split('-').map(Number);
        const start = new Date(year, month - 1, day, 18, 0);
        const end = new Date(year, month - 1, day, 19, 0);
        const formatDate = (date) => [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0')
        ].join('') + `T${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}00`;
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: 'Sesión de repaso PAU · BachilleratoFacilito',
            dates: `${formatDate(start)}/${formatDate(end)}`,
            ctz: 'Europe/Madrid'
        });
        get('calendar-link').href = `https://calendar.google.com/calendar/render?${params}`;
    };
    calendarDate.addEventListener('change', updateCalendarLink);
    updateCalendarLink();
})();
