(() => {
    const input = document.getElementById('search-input');
    const form = document.getElementById('search-form');
    const results = document.getElementById('search-results');
    const clearButton = document.getElementById('search-clear');
    const quickButtons = document.querySelectorAll('[data-search]');
    let activeIndex = -1;

    if (!input || !form || !results) {
        return;
    }

    // Añadir una entrada aquí mantiene el índice legible y no exige tocar el HTML de la portada.
    const catalog = [
        { title: 'Análisis', subject: 'Matemáticas II', topic: 'Análisis', type: 'Teoría', url: 'docs/analisis.pdf', terms: 'límites derivadas continuidad derivabilidad recta tangente monotonía máximos mínimos curvatura integrales' },
        { title: 'Álgebra', subject: 'Matemáticas II', topic: 'Álgebra', type: 'Teoría', url: 'docs/algebra.pdf', terms: 'matrices determinantes sistemas de ecuaciones rango inversa' },
        { title: 'Geometría', subject: 'Matemáticas II', topic: 'Geometría', type: 'Teoría', url: 'docs/geometria.pdf', terms: 'vectores rectas planos distancias ángulos áreas volúmenes' },
        { title: 'Probabilidad', subject: 'Matemáticas II', topic: 'Probabilidad y Estadística', type: 'Teoría', url: 'docs/probabilidad.pdf', terms: 'estadística sucesos binomial normal diagramas árbol' },
        { title: 'Exámenes PAU de Matemáticas II', subject: 'Matemáticas II', topic: 'PAU', type: 'Exámenes', url: 'pau-matematicas.html', terms: 'pau evau exámenes modelo ordinaria extraordinaria convocatorias años' },
        { title: 'Campo gravitatorio', subject: 'Física', topic: 'Campos', type: 'Teoría', url: 'docs/campo_gravitatorio_teoria.pdf', terms: 'gravitación kepler newton fuerzas centrales potencial gauss' },
        { title: 'Campo electromagnético', subject: 'Física', topic: 'Campos', type: 'Teoría', url: 'docs/campo_electromagnetico_teoria.pdf', terms: 'coulomb eléctrico magnético lorentz inducción electromagnética' },
        { title: 'Vibraciones y ondas', subject: 'Física', topic: 'Ondas', type: 'Teoría', url: 'docs/vibraciones_y_ondas_teoria.pdf', terms: 'movimiento armónico ondas sonido óptica' },
        { title: 'Física moderna', subject: 'Física', topic: 'Física moderna', type: 'Teoría', url: 'docs/fisica_moderna_teoria.pdf', terms: 'relatividad cuántica nuclear fotoeléctrico' },
        { title: 'Autores de Filosofía', subject: 'Filosofía', topic: 'Autores', type: 'Apuntes', url: 'filosofía-autores.html', terms: 'platón aristóteles san agustín santo tomás descartes hume kant rousseau marx nietzsche ortega arendt filósofos' },
        { title: 'Comparaciones filosóficas', subject: 'Filosofía', topic: 'Comparaciones', type: 'Apuntes', url: 'filosofía-comparaciones.html', terms: 'platón aristóteles descartes hume kant marx arendt rousseau nietzsche comparación' },
        { title: 'Historia: temas 1, 2 y 3', subject: 'Historia de España', topic: 'Temario', type: 'Teoría', url: 'docs/historia-temas-1-2-3-epigrafe.pdf', terms: 'historia españa cronología conceptos' },
        { title: 'Historia: crisis del Antiguo Régimen', subject: 'Historia de España', topic: 'Tema 4', type: 'Teoría', url: 'docs/historia-tema-4-crisis-antiguo-regimen.pdf', terms: 'historia antiguo régimen crisis economía sociedad liberalismo' },
        { title: 'Historia: construcción del Estado liberal', subject: 'Historia de España', topic: 'Tema 5', type: 'Teoría', url: 'docs/historia-tema-5-estado-liberal.pdf', terms: 'historia estado liberal constituciones reformas' },
        { title: 'Historia: régimen de la Restauración', subject: 'Historia de España', topic: 'Tema 6', type: 'Teoría', url: 'docs/historia-tema-6-restauracion.pdf', terms: 'historia restauración turno partidos' },
        { title: 'Gramática y vocabulario', subject: 'Inglés', topic: 'Grammar', type: 'Apuntes', url: 'Inglés.html', terms: 'inglés tiempos verbales preposiciones vocabulario phrasal verbs writing' },
        { title: 'Dibujo Técnico II', subject: 'Dibujo Técnico II', topic: 'Geometría', type: 'Apuntes', url: 'Dibujo.html', terms: 'dibujo técnico geometría sistemas representación normalización' },
        { title: 'Biología', subject: 'Biología', topic: 'Temario', type: 'Apuntes', url: 'biología.html', terms: 'biología célula genética evolución fisiología seres vivos' },
        { title: 'Química', subject: 'Química', topic: 'Temario', type: 'Apuntes', url: 'química.html', terms: 'química estequiometría enlaces reacciones orgánica' },
        { title: 'Lengua y comentario de texto', subject: 'Lengua', topic: 'Lengua y Literatura', type: 'Apuntes', url: 'lengua.html', terms: 'lengua literatura comentario texto adecuación coherencia cohesión sintaxis semántica' }
    ];

    const normalize = (value) => String(value).toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const searchable = (item) => normalize([item.title, item.subject, item.topic, item.type, item.terms].join(' '));
    const distance = (left, right) => {
        const row = Array.from({ length: right.length + 1 }, (_, index) => index);
        for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
            let diagonal = row[0];
            row[0] = leftIndex;
            for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
                const above = row[rightIndex];
                row[rightIndex] = Math.min(row[rightIndex] + 1, row[rightIndex - 1] + 1, diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1));
                diagonal = above;
            }
        }
        return row[right.length];
    };

    const score = (query, item) => {
        if (!query) return 0;
        const text = searchable(item);
        if (text.includes(query)) return 100;
        const words = text.split(/\s+/);
        return Math.max(...words.map((word) => {
            const similarity = 1 - (distance(query, word) / Math.max(query.length, word.length));
            return similarity * (word.length >= query.length ? 76 : 62);
        }));
    };

    const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
    const highlight = (value, query) => {
        const safe = escapeHtml(value);
        if (!query) return safe;
        const pattern = query.split(/\s+/).filter(Boolean).map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        return pattern ? safe.replace(new RegExp(`(${pattern})`, 'ig'), '<mark>$1</mark>') : safe;
    };

    const getMatches = (query) => catalog
        .map((item) => ({ ...item, relevance: score(query, item) }))
        .filter((item) => !query || item.relevance >= 48)
        .sort((left, right) => right.relevance - left.relevance)
        .slice(0, 7);

    const render = () => {
        const query = normalize(input.value);
        const matches = getMatches(query);
        activeIndex = -1;
        clearButton.hidden = !query;
        if (!query) {
            results.innerHTML = '<div class="bf-search-empty"><strong>Busca en toda la biblioteca.</strong><span>Prueba con una asignatura, un tema, un concepto o PAU.</span></div>';
            results.classList.remove('is-open');
            return;
        }
        if (!matches.length) {
            results.innerHTML = '<div class="bf-search-empty"><strong>No hemos encontrado exactamente eso.</strong><span>Prueba buscando una asignatura, tema o recurso diferente.</span></div>';
        } else {
            results.innerHTML = matches.map((item, index) => `<a class="bf-search-result" href="${item.url}" data-result-index="${index}"><span class="bf-search-result__type">${escapeHtml(item.subject)} · ${escapeHtml(item.topic)} · ${escapeHtml(item.type)}</span><strong>${highlight(item.title, query)}</strong><span class="bf-search-result__action">Ver recurso <span>↗</span></span></a>`).join('');
        }
        results.classList.add('is-open');
    };

    const setActive = (index) => {
        const items = [...results.querySelectorAll('.bf-search-result')];
        if (!items.length) return;
        activeIndex = (index + items.length) % items.length;
        items.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === activeIndex));
        items[activeIndex].scrollIntoView({ block: 'nearest' });
    };

    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    input.addEventListener('keydown', (event) => {
        const items = results.querySelectorAll('.bf-search-result');
        if (event.key === 'ArrowDown' && items.length) { event.preventDefault(); setActive(activeIndex + 1); }
        if (event.key === 'ArrowUp' && items.length) { event.preventDefault(); setActive(activeIndex - 1); }
        if (event.key === 'Enter' && activeIndex >= 0 && items[activeIndex]) { event.preventDefault(); window.location.href = items[activeIndex].href; }
        if (event.key === 'Escape') { input.value = ''; results.classList.remove('is-open'); clearButton.hidden = true; input.blur(); }
    });
    form.addEventListener('submit', (event) => { event.preventDefault(); const first = results.querySelector('.bf-search-result'); if (first) window.location.href = first.href; });
    clearButton.addEventListener('click', () => { input.value = ''; render(); input.focus(); });
    document.addEventListener('click', (event) => { if (!form.contains(event.target) && !results.contains(event.target)) results.classList.remove('is-open'); });
    quickButtons.forEach((button) => button.addEventListener('click', () => { input.value = button.dataset.search; input.focus(); render(); }));
    render();
})();
