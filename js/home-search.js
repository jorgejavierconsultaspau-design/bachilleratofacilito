(() => {
    const input = document.getElementById('search-input');
    const form = document.getElementById('search-form');
    const searchWidget = form?.closest('.bf-hero__search, .bf-library-search');
    const results = document.getElementById('search-results');
    const status = document.getElementById('search-status');
    const subjectFilter = document.getElementById('search-subject');
    const typeFilter = document.getElementById('search-type');
    const clearButton = document.getElementById('search-clear');
    const quickButtons = document.querySelectorAll('[data-search]');
    let activeIndex = -1;

    if (!input || !form || !searchWidget || !results || !status || !subjectFilter || !typeFilter || !clearButton) {
        return;
    }

    const catalogBySubject = [
        {
            subject: 'Matemáticas II',
            resources: [
                { title: 'Análisis', topic: 'Análisis', type: 'Teoría', url: 'docs/analisis.pdf', terms: 'límites derivadas continuidad derivabilidad recta tangente monotonía máximos mínimos curvatura integrales' },
                { title: 'Álgebra', topic: 'Álgebra', type: 'Teoría', url: 'docs/algebra.pdf', terms: 'matrices determinantes sistemas de ecuaciones rango inversa' },
                { title: 'Geometría', topic: 'Geometría', type: 'Teoría', url: 'docs/geometria.pdf', terms: 'vectores rectas planos distancias ángulos áreas volúmenes' },
                { title: 'Probabilidad y Estadística', topic: 'Probabilidad', type: 'Teoría', url: 'docs/probabilidad.pdf', terms: 'estadística sucesos binomial normal diagramas árbol' },
                { title: 'Exámenes PAU de Matemáticas II', topic: 'PAU', type: 'Exámenes', url: 'pau-matematicas.html', terms: 'evau modelos ordinaria extraordinaria convocatorias años' }
            ]
        },
        {
            subject: 'Física',
            resources: [
                { title: 'Campo gravitatorio', topic: 'Campos', type: 'Teoría', url: 'docs/campo-gravitatorio-teoria.pdf', terms: 'gravitación kepler newton fuerzas centrales potencial gauss' },
                { title: 'Campo gravitatorio: ejercicios', topic: 'Campos', type: 'Práctica', url: 'docs/bloquegravpractica.pdf', terms: 'gravitación problemas práctica' },
                { title: 'Campo electromagnético', topic: 'Campos', type: 'Teoría', url: 'docs/campo-electromagnetico-teoria.pdf', terms: 'coulomb eléctrico magnético lorentz inducción electromagnética' },
                { title: 'Campo electromagnético: ejercicios', topic: 'Campos', type: 'Práctica', url: 'docs/bloqueelectromagnpractica.pdf', terms: 'coulomb electricidad magnetismo problemas' },
                { title: 'Vibraciones y ondas', topic: 'Ondas', type: 'Teoría', url: 'docs/vibraciones-y-ondas-teoria.pdf', terms: 'movimiento armónico ondas sonido óptica' },
                { title: 'Vibraciones y ondas: ejercicios', topic: 'Ondas', type: 'Práctica', url: 'docs/bloqueondaspractica.pdf', terms: 'movimiento armónico problemas sonido óptica' },
                { title: 'Física moderna', topic: 'Física moderna', type: 'Teoría', url: 'docs/fisica-moderna-teoria.pdf', terms: 'relatividad cuántica nuclear fotoeléctrico' },
                { title: 'Física moderna: ejercicios', topic: 'Física moderna', type: 'Práctica', url: 'docs/bloquefisicamodernapractica.pdf', terms: 'relatividad problemas cuántica nuclear' }
            ]
        },
        {
            subject: 'Filosofía',
            resources: [
                { title: 'Biblioteca de autores', topic: 'Autores', type: 'Apuntes', url: 'filosofia-autores.html', terms: 'platón aristóteles san agustín santo tomás descartes hume kant rousseau marx nietzsche ortega arendt' },
                { title: 'Comparaciones filosóficas', topic: 'Comparaciones', type: 'Comparaciones', url: 'filosofia-comparaciones.html', terms: 'realidad conocimiento ser humano dios ética política' },
                { title: 'Platón: teoría', topic: 'Autores', type: 'Apuntes', url: 'docs/platon-teoria.pdf', terms: 'ideas realidad conocimiento política' },
                { title: 'Platón: textos', topic: 'Autores', type: 'Textos', url: 'docs/platon-textos.pdf', terms: 'ideas realidad conocimiento' },
                { title: 'Aristóteles: teoría', topic: 'Autores', type: 'Apuntes', url: 'docs/aristoteles-teoria.pdf', terms: 'metafísica ética política' },
                { title: 'Aristóteles: textos', topic: 'Autores', type: 'Textos', url: 'docs/aristoteles-textos.pdf', terms: 'metafísica ética política' },
                { title: 'San Agustín: teoría', topic: 'Autores', type: 'Apuntes', url: 'docs/san-agustin-teoria.pdf', terms: 'dios verdad conocimiento' },
                { title: 'San Agustín: textos', topic: 'Autores', type: 'Textos', url: 'docs/san-agustin-textos.pdf', terms: 'dios verdad conocimiento' },
                { title: 'Santo Tomás: teoría', topic: 'Autores', type: 'Apuntes', url: 'docs/santo-tomas-teoria.pdf', terms: 'dios razón ley natural' },
                { title: 'Santo Tomás: textos', topic: 'Autores', type: 'Textos', url: 'docs/anto-tomas-textos.pdf', terms: 'dios razón ley natural' },
                { title: 'Descartes: teoría', topic: 'Autores', type: 'Apuntes', url: 'docs/descartes-teoria.pdf', terms: 'racionalismo duda cogito' },
                { title: 'Descartes: textos', topic: 'Autores', type: 'Textos', url: 'docs/descartes-textos.pdf', terms: 'racionalismo duda cogito' },
                { title: 'Hume: teoría', topic: 'Autores', type: 'Apuntes', url: 'docs/hume-teoria.pdf', terms: 'empirismo causalidad impresiones' },
                { title: 'Hume: textos', topic: 'Autores', type: 'Textos', url: 'docs/hume-textos.pdf', terms: 'empirismo causalidad impresiones' },
                { title: 'Kant: teoría', topic: 'Autores', type: 'Apuntes', url: 'docs/kant-teoria.pdf', terms: 'criticismo conocimiento ética' },
                { title: 'Kant: textos', topic: 'Autores', type: 'Textos', url: 'docs/kant-textos.pdf', terms: 'criticismo conocimiento ética' },
                { title: 'Rousseau: teoría', topic: 'Autores', type: 'Apuntes', url: 'docs/rousseau-teoria.pdf', terms: 'contrato social política voluntad general' },
                { title: 'Rousseau: textos', topic: 'Autores', type: 'Textos', url: 'docs/rousseau-textos.pdf', terms: 'contrato social política voluntad general' },
                { title: 'Marx: teoría', topic: 'Autores', type: 'Apuntes', url: 'docs/marx-teoria.pdf', terms: 'materialismo histórico alienación trabajo' },
                { title: 'Marx: textos', topic: 'Autores', type: 'Textos', url: 'docs/marx-textos.pdf', terms: 'materialismo histórico alienación trabajo' },
                { title: 'Nietzsche: teoría', topic: 'Autores', type: 'Apuntes', url: 'docs/nietzsche-teoria.pdf', terms: 'nihilismo moral superhombre' },
                { title: 'Nietzsche: textos', topic: 'Autores', type: 'Textos', url: 'docs/nietzsche-textos.pdf', terms: 'nihilismo moral superhombre' },
                { title: 'Ortega y Gasset: teoría', topic: 'Autores', type: 'Apuntes', url: 'docs/ortega-y-gasset-teoria.pdf', terms: 'raciovitalismo perspectiva razón vital' },
                { title: 'Ortega y Gasset: textos', topic: 'Autores', type: 'Textos', url: 'docs/ortega-y-gasset-textos.pdf', terms: 'raciovitalismo perspectiva razón vital' },
                { title: 'Hannah Arendt: teoría', topic: 'Autores', type: 'Apuntes', url: 'docs/arendt-teoria.pdf', terms: 'acción política libertad totalitarismo' },
                { title: 'Hannah Arendt: textos', topic: 'Autores', type: 'Textos', url: 'docs/arendt-textos.pdf', terms: 'acción política libertad totalitarismo' },
                { title: 'Platón y Aristóteles', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/platon-vs-aristoteles.pdf', terms: 'realidad conocimiento' },
                { title: 'Platón y Descartes', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/platon-vs-descartes.pdf', terms: 'realidad conocimiento' },
                { title: 'Platón y Nietzsche', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/platon-vs-nietzsche.pdf', terms: 'realidad conocimiento' },
                { title: 'Platón y San Agustín', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/platon-vs-san-agustin.pdf', terms: 'realidad dios' },
                { title: 'Aristóteles y Kant', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/aristoteles-vs-kant.pdf', terms: 'ética conocimiento' },
                { title: 'Aristóteles y San Agustín: ética', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/aristoteles-vs-san-agustin-etica.pdf', terms: 'ética felicidad' },
                { title: 'Descartes, Hume y Kant', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/descartes-vs-hume-vs-kant.pdf', terms: 'conocimiento razón experiencia' },
                { title: 'Descartes, Hume y Kant: Dios', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/descartes-vs-hume-vs-kant-dios.pdf', terms: 'dios razón existencia' },
                { title: 'Marx y Hannah Arendt', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/marx-vs-hannah-arendt.pdf', terms: 'política sociedad trabajo' },
                { title: 'Marx y Hannah Arendt: antropología', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/marx-vs-hannah-arendt-antropologia.pdf', terms: 'ser humano trabajo acción' },
                { title: 'Ortega y Nietzsche', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/ortega-vs-nietzsche.pdf', terms: 'vida perspectiva nihilismo' },
                { title: 'Rousseau y Hume', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/rousseau-vs-hume.pdf', terms: 'naturaleza sociedad política' },
                { title: 'Santo Tomás y Descartes', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/santo-tomas-vs-descartes.pdf', terms: 'dios razón' },
                { title: 'Santo Tomás y San Agustín', topic: 'Comparaciones', type: 'Comparaciones', url: 'docs/santo-tomas-vs-san-agustin.pdf', terms: 'dios razón fe' }
            ]
        },
        {
            subject: 'Historia de España',
            resources: [
                { title: 'Temas 1, 2 y 3: epígrafes', topic: 'Temario', type: 'Teoría', url: 'docs/historia-temas-1-2-3-epigrafe.pdf', terms: 'cronología conceptos' },
                { title: 'Tema 5: construcción del Estado liberal', topic: 'Tema 5', type: 'Teoría', url: 'docs/historia-tema-5-estado-liberal.pdf', terms: 'constituciones reformas' },
                { title: 'Tema 6: régimen de la Restauración', topic: 'Tema 6', type: 'Teoría', url: 'docs/tema6.pdf', terms: 'restauración turno de partidos' },
                { title: 'Historia de España: temario', topic: 'Temario', type: 'Apuntes', url: 'historia-de-espana.html', terms: 'historia españa siglo xix xx democracia' }
            ]
        },
        {
            subject: 'Lengua',
            resources: [
                { title: 'Lengua, literatura y textos', topic: 'Asignatura', type: 'Apuntes', url: 'lengua.html', terms: 'comentario adecuación coherencia cohesión sintaxis semántica' },
                { title: 'Temas de literatura', topic: 'Literatura', type: 'Apuntes', url: 'temasliteratura.html', terms: 'realismo naturalismo modernismo generación del 98 novecentismo vanguardias' },
                { title: 'Realismo y naturalismo', topic: 'Literatura', type: 'Lectura', url: 'docs/pdftema1-realismo-naturalismo.pdf.pdf', terms: 'novela poesía teatro siglo xix' },
                { title: 'Modernismo y Generación del 98', topic: 'Literatura', type: 'Lectura', url: 'docs/2-modernismo-y-generacion-del-98.pdf', terms: 'novela teatro poesía' },
                { title: 'Novecentismo y Generación del 14', topic: 'Literatura', type: 'Lectura', url: 'docs/3-el-novecentismo-y-la-gen-del-14.pdf', terms: 'ensayo novela juan ramón jiménez' },
                { title: 'Vanguardias', topic: 'Literatura', type: 'Lectura', url: 'docs/4-las-vanguardias-en-europa-espana-e-hispanoamerica.pdf', terms: 'europa españa hispanoamérica' },
                { title: 'Generación del 27', topic: 'Literatura', type: 'Lectura', url: 'docs/5-la-generacion-del-27-caracteristicas-y-trayectoria-de-los-autores-el-teatro-lorquiano.pdf', terms: 'poesía teatro lorca' },
                { title: 'Lírica y teatro posteriores a 1936', topic: 'Literatura', type: 'Lectura', url: 'docs/6-la-lirica-y-el-teatro-posteriores-a-1936.pdf', terms: 'poesía teatro' },
                { title: 'Novela española de 1939 a 1975', topic: 'Literatura', type: 'Lectura', url: 'docs/7-la-novela-espanola-de-1939-a-1975.pdf', terms: 'novela posguerra' },
                { title: 'Novela española a partir de 1975', topic: 'Literatura', type: 'Lectura', url: 'docs/8-la-novela-espanola-a-partir-de-1975-la-renovacion-en-la-novela.pdf', terms: 'novela renovación' },
                { title: 'Literatura hispanoamericana', topic: 'Literatura', type: 'Lectura', url: 'docs/9-la-literatura-hispanoamericana.pdf', terms: 'narrativa poesía' },
                { title: 'La casa de Bernarda Alba', topic: 'Lecturas', type: 'Lectura', url: 'docs/la-casa-de-bernarda-alba.pdf', terms: 'lorca teatro obra lectura' },
                { title: 'Nada', topic: 'Lecturas', type: 'Lectura', url: 'docs/nada-carmen-laforet.pdf', terms: 'carmen laforet novela lectura' },
                { title: 'Los girasoles ciegos', topic: 'Lecturas', type: 'Lectura', url: 'docs/los-girasoles-ciegos.pdf', terms: 'alberto méndez novela lectura' }
            ]
        },
        {
            subject: 'Inglés',
            resources: [{ title: 'Gramática, vocabulario y writing', topic: 'Temario', type: 'Apuntes', url: 'ingles.html', terms: 'tiempos verbales preposiciones phrasal verbs writing' }]
        },
        {
            subject: 'Dibujo Técnico II',
            resources: [{ title: 'Geometría y sistemas de representación', topic: 'Temario', type: 'Apuntes', url: 'dibujo-tecnico.html', terms: 'construcciones diédrico normalización escalas acotación' }]
        },
        {
            subject: 'Biología',
            resources: [{ title: 'Temario de Biología', topic: 'Temario', type: 'Apuntes', url: 'biologia.html', terms: 'célula genética evolución fisiología seres vivos' }]
        },
        {
            subject: 'Química',
            resources: [{ title: 'Temario de Química', topic: 'Temario', type: 'Apuntes', url: 'quimica.html', terms: 'estequiometría enlaces reacciones orgánica' }]
        }
    ];

    const catalog = catalogBySubject.flatMap(({ subject, resources }) => resources.map((resource) => ({ ...resource, subject })));
    const subjectCards = [...document.querySelectorAll('.bf-subject[data-subject]')];

    const normalize = (value) => String(value).toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const searchable = (item) => normalize([item.title, item.subject, item.topic, item.type, item.terms].join(' '));

    const topicsBySubject = new Map();
    catalog.forEach((item) => {
        if (!topicsBySubject.has(item.subject)) topicsBySubject.set(item.subject, new Set());
        topicsBySubject.get(item.subject).add(item.topic);
    });

    const stats = {
        resources: catalog.length,
        topics: [...topicsBySubject.values()].reduce((total, topics) => total + topics.size, 0),
        subjects: topicsBySubject.size
    };
    document.querySelectorAll('[data-bf-stat]').forEach((stat) => {
        const value = stats[stat.dataset.bfStat];
        if (value !== undefined) stat.textContent = new Intl.NumberFormat('es-ES').format(value);
    });

    const progressRoot = document.getElementById('study-progress-topics');
    if (progressRoot) {
        const meter = document.getElementById('study-progress-meter');
        const progressLabel = document.getElementById('study-progress-label');
        const badges = document.getElementById('study-badges');
        const emptyBadges = document.getElementById('study-badges-empty');
        const progressGroups = new Map();

        catalog.forEach((item) => {
            if (!progressGroups.has(item.subject)) progressGroups.set(item.subject, new Set());
            progressGroups.get(item.subject).add(item.topic);
        });

        const topicKeys = new Set();
        const badgeBySubject = new Map();
        let completedTopics = new Set();

        try {
            const savedProgress = localStorage.getItem('bf-study-progress-v1');
            const parsedProgress = savedProgress ? JSON.parse(savedProgress) : [];
            if (Array.isArray(parsedProgress)) {
                completedTopics = new Set(parsedProgress.filter((key) => typeof key === 'string'));
            }
        } catch (error) {
            console.error('No se pudo recuperar el progreso guardado.', error);
        }

        progressGroups.forEach((topics, subject) => {
            const group = document.createElement('details');
            group.className = 'bf-progress__group';

            const summary = document.createElement('summary');
            summary.className = 'bf-progress__summary';
            const title = document.createElement('strong');
            title.textContent = subject;
            const badge = document.createElement('span');
            badge.className = 'bf-progress__group-badge';
            badge.textContent = 'Insignia conseguida';
            badge.hidden = true;
            summary.append(title, badge);
            group.append(summary);

            const topicList = document.createElement('div');
            topicList.className = 'bf-progress__topic-list';
            [...topics].sort((left, right) => left.localeCompare(right, 'es')).forEach((topic) => {
                const key = `${subject}::${topic}`;
                topicKeys.add(key);
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'bf-progress__topic';
                button.dataset.progressKey = key;
                button.setAttribute('aria-label', `${topic}, ${subject}`);
                button.textContent = topic;
                button.addEventListener('click', () => {
                    if (completedTopics.has(key)) completedTopics.delete(key);
                    else completedTopics.add(key);
                    updateProgress();
                    try {
                        localStorage.setItem('bf-study-progress-v1', JSON.stringify([...completedTopics]));
                    } catch (error) {
                        console.error('No se pudo guardar el progreso.', error);
                    }
                });
                topicList.append(button);
            });

            group.append(topicList);
            progressRoot.append(group);
            badgeBySubject.set(subject, { badge, topics });
        });

        completedTopics = new Set([...completedTopics].filter((key) => topicKeys.has(key)));

        const updateProgress = () => {
            const total = topicKeys.size;
            const completed = completedTopics.size;
            const percentage = total ? Math.round((completed / total) * 100) : 0;
            meter.max = total || 1;
            meter.value = completed;
            progressLabel.textContent = `${completed} de ${total} temas completados · ${percentage}%`;
            progressRoot.querySelectorAll('[data-progress-key]').forEach((button) => {
                const isComplete = completedTopics.has(button.dataset.progressKey);
                button.setAttribute('aria-pressed', String(isComplete));
                button.classList.toggle('is-complete', isComplete);
            });

            badges.replaceChildren();
            let earned = 0;
            badgeBySubject.forEach(({ badge, topics }, subject) => {
                const isComplete = [...topics].every((topic) => completedTopics.has(`${subject}::${topic}`));
                badge.hidden = !isComplete;
                if (isComplete) {
                    earned += 1;
                    const item = document.createElement('span');
                    item.className = 'bf-progress__badge';
                    item.textContent = `${subject} · Insignia conseguida`;
                    badges.append(item);
                }
            });
            emptyBadges.hidden = earned > 0;
        };

        updateProgress();
    }

    const countdown = document.getElementById('pau-countdown');
    const timeline = countdown?.closest('[data-pau-deadline]');
    if (countdown && timeline) {
        const deadline = Date.parse(timeline.dataset.pauDeadline);
        if (Number.isNaN(deadline)) {
            console.error('La fecha de la convocatoria PAU no es válida.');
            countdown.textContent = 'No se pudo calcular la cuenta atrás. Consulta el calendario oficial.';
        } else {
            const updateCountdown = () => {
                const remaining = deadline - Date.now();
                if (remaining <= 0) {
                    countdown.textContent = 'La convocatoria ordinaria de la PAU 2026 ya se ha celebrado.';
                    return false;
                }
                const days = Math.floor(remaining / 86_400_000);
                const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
                countdown.textContent = `Quedan ${days} días y ${hours} horas para la PAU 2026.`;
                return true;
            };

            if (updateCountdown()) window.setInterval(updateCountdown, 60_000);
        }
    }

    const addFilterOptions = (select, values) => {
        [...new Set(values)].sort((left, right) => left.localeCompare(right, 'es')).forEach((value) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.append(option);
        });
    };

    addFilterOptions(subjectFilter, catalog.map((item) => item.subject));
    addFilterOptions(typeFilter, catalog.map((item) => item.type));

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
        const words = text.split(/\s+/);
        const terms = query.split(/\s+/).filter(Boolean);
        const termScores = terms.map((term) => {
            if (text.includes(term)) return 100;
            if (term.length < 3) return 0;
            return Math.max(...words.map((word) => {
                if (word.startsWith(term)) return 86;
                const similarity = 1 - (distance(term, word) / Math.max(term.length, word.length));
                return similarity * (word.length >= term.length ? 76 : 62);
            }));
        });
        return Math.min(...termScores);
    };

    const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
    const highlight = (value, query) => {
        const safe = escapeHtml(value);
        if (!query) return safe;
        const pattern = query.split(/\s+/).filter(Boolean).map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        return pattern ? safe.replace(new RegExp(`(${pattern})`, 'ig'), '<mark>$1</mark>') : safe;
    };

    const getMatches = (query, subject, type) => catalog
        .map((item) => ({ ...item, relevance: score(query, item) }))
        .filter((item) => (!subject || item.subject === subject)
            && (!type || item.type === type)
            && (!query || item.relevance >= 48))
        .sort((left, right) => right.relevance - left.relevance)
        .slice(0, 7);

    const filterSubjectCards = (subject, type) => {
        subjectCards.forEach((card) => {
            const cardSubject = card.dataset.subject;
            const cardType = card.dataset.type;
            const typeMatches = !type || (cardType
                ? cardType === type
                : catalog.some((item) => item.subject === cardSubject && item.type === type));
            card.hidden = Boolean((subject && cardSubject !== subject) || !typeMatches);
        });
    };

    const openResource = (url) => {
        if (/\.pdf(?:[?#]|$)/i.test(url)) {
            window.open(url, '_blank', 'noopener,noreferrer');
            return;
        }
        window.location.href = url;
    };

    const closeResults = () => {
        activeIndex = -1;
        results.hidden = true;
        results.classList.remove('is-open');
        input.setAttribute('aria-expanded', 'false');
        input.removeAttribute('aria-activedescendant');
    };

    const render = () => {
        const query = normalize(input.value);
        const selectedSubject = subjectFilter.value;
        const selectedType = typeFilter.value;
        const hasFilter = Boolean(selectedSubject || selectedType);
        const matches = getMatches(query, selectedSubject, selectedType);
        filterSubjectCards(selectedSubject, selectedType);
        closeResults();
        results.replaceChildren();
        clearButton.hidden = !query;
        if (!query && !hasFilter) {
            status.textContent = 'Escribe una búsqueda o selecciona filtros para explorar los recursos.';
            return;
        }
        if (!matches.length) {
            status.textContent = 'No hay resultados. Prueba otra búsqueda o cambia los filtros.';
            return;
        }

        matches.forEach((item, index) => {
            const option = document.createElement('li');
            option.id = `search-option-${index}`;
            option.className = 'bf-search-result';
            option.setAttribute('role', 'option');
            option.setAttribute('aria-selected', 'false');
            option.dataset.url = item.url;

            const metadata = document.createElement('span');
            metadata.className = 'bf-search-result__type';
            metadata.textContent = `${item.subject} · ${item.topic} · ${item.type}`;

            const title = document.createElement('strong');
            title.innerHTML = highlight(item.title, query);

            const action = document.createElement('span');
            action.className = 'bf-search-result__action';
            action.textContent = /\.pdf(?:[?#]|$)/i.test(item.url) ? 'Abrir PDF ↗' : 'Explorar página ↗';

            option.append(metadata, title, action);
            results.append(option);
        });

        status.textContent = matches.length === 7
            ? 'Se muestran los 7 primeros resultados; afina con los filtros.'
            : `${matches.length} ${matches.length === 1 ? 'resultado' : 'resultados'}.`;
        results.hidden = false;
        results.classList.add('is-open');
        input.setAttribute('aria-expanded', 'true');
    };

    const setActive = (index) => {
        const items = [...results.querySelectorAll('[role="option"]')];
        if (!items.length) return;
        activeIndex = (index + items.length) % items.length;
        items.forEach((item, itemIndex) => {
            const isActive = itemIndex === activeIndex;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-selected', String(isActive));
        });
        input.setAttribute('aria-activedescendant', items[activeIndex].id);
        items[activeIndex].scrollIntoView({ block: 'nearest' });
    };

    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    input.addEventListener('keydown', (event) => {
        const items = results.querySelectorAll('[role="option"]');
        if (event.key === 'ArrowDown' && items.length) { event.preventDefault(); setActive(activeIndex + 1); }
        if (event.key === 'ArrowUp' && items.length) { event.preventDefault(); setActive(activeIndex - 1); }
        if (event.key === 'Enter' && activeIndex >= 0 && items[activeIndex]) {
            event.preventDefault();
            openResource(items[activeIndex].dataset.url);
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            closeResults();
        }
    });
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const first = results.querySelector('[role="option"]');
        if (first) openResource(first.dataset.url);
    });
    clearButton.addEventListener('click', () => {
        input.value = '';
        render();
        input.focus();
    });
    [subjectFilter, typeFilter].forEach((filter) => filter.addEventListener('change', render));
    results.addEventListener('click', (event) => {
        const option = event.target.closest('[role="option"]');
        if (option) openResource(option.dataset.url);
    });
    results.addEventListener('pointerover', (event) => {
        const option = event.target.closest('[role="option"]');
        if (option) setActive([...results.children].indexOf(option));
    });
    document.addEventListener('click', (event) => {
        if (!searchWidget.contains(event.target)) closeResults();
    });
    quickButtons.forEach((button) => button.addEventListener('click', () => {
        input.value = button.dataset.search;
        input.focus();
        render();
    }));
    render();
})();
