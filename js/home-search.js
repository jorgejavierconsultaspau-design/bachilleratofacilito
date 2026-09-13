(() => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    const subjectFilter = document.getElementById('search-subject');
    const typeFilter = document.getElementById('search-type');

    if (!form || !input || !results || !subjectFilter || !typeFilter) {
        return;
    }

    const resources = [
        ['Matemáticas II', 'Análisis', 'Teoría', 'Límites, derivadas, continuidad, integrales y representación de funciones.', 'asignatura.html?materia=matematicas'],
        ['Matemáticas II', 'Álgebra', 'Teoría', 'Matrices, determinantes, rango, inversa y sistemas de ecuaciones.', 'asignatura.html?materia=matematicas'],
        ['Matemáticas II', 'Geometría', 'Teoría', 'Vectores, rectas, planos, distancias, ángulos, áreas y volúmenes.', 'asignatura.html?materia=matematicas'],
        ['Matemáticas II', 'Probabilidad y Estadística', 'Teoría', 'Sucesos, binomial, normal, diagramas de árbol y estadística.', 'asignatura.html?materia=matematicas'],
        ['Matemáticas II', 'Práctica PAU', 'Exámenes', 'Ejercicios y preparación para el examen de Matemáticas II de la PAU.', 'pau-matematicas.html'],
        ['Física', 'Campo gravitatorio', 'Teoría', 'Gravitación, leyes de Kepler, Newton y ley de Gauss.', 'asignatura.html?materia=fisica'],
        ['Física', 'Campo electromagnético', 'Teoría', 'Coulomb, campo eléctrico, magnetismo, Lorentz e inducción.', 'asignatura.html?materia=fisica'],
        ['Física', 'Vibraciones y ondas', 'Teoría', 'Movimiento armónico simple, ondas, sonido y óptica.', 'asignatura.html?materia=fisica'],
        ['Filosofía', 'Autores y teorías', 'Apuntes', 'Platón, Aristóteles, Descartes, Kant, Nietzsche y Ortega y Gasset.', 'asignatura.html?materia=filosofia'],
        ['Lengua', 'Comentario de texto', 'Teoría', 'Adecuación, coherencia, cohesión y textos argumentativos.', 'asignatura.html?materia=lengua'],
        ['Dibujo Técnico II', 'Geometría y sistemas', 'Teoría', 'Fundamentos de dibujo técnico, geometría y representación.', 'asignatura.html?materia=dibujo'],
        ['Historia de España', 'Historia contemporánea', 'Apuntes', 'Del Antiguo Régimen a la democracia española.', 'asignatura.html?materia=historia'],
        ['Inglés', 'Grammar and vocabulary', 'Teoría', 'Tiempos verbales, estructura, expresiones y phrasal verbs.', 'asignatura.html?materia=ingles'],
        ['Biología', 'Genética y fisiología', 'Apuntes', 'Genética, evolución, célula y fisiología de los seres vivos.', 'asignatura.html?materia=biologia'],
        ['Química', 'Reacciones y orgánica', 'Teoría', 'Estequiometría, enlaces, reacciones y química orgánica.', 'asignatura.html?materia=quimica']
    ].map(([subject, title, type, description, url]) => ({ subject, title, type, description, url }));

    const normalize = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const render = () => {
        const query = normalize(input.value.trim());
        const subject = subjectFilter.value;
        const type = typeFilter.value;
        const matches = resources.filter((resource) => {
            const matchesQuery = !query || normalize(`${resource.subject} ${resource.title} ${resource.type} ${resource.description}`).includes(query);
            return matchesQuery && (!subject || resource.subject === subject) && (!type || resource.type === type);
        });

        if (!query && !subject && !type) {
            results.innerHTML = '<p class="search-empty">Empieza a escribir o filtra por asignatura y tipo de recurso.</p>';
        } else if (!matches.length) {
            results.innerHTML = '<p class="search-empty">No hay resultados para esta búsqueda. Prueba con otro tema o cambia los filtros.</p>';
        } else {
            results.innerHTML = matches.map((resource) => `
                <a class="search-result-item" href="${resource.url}">
                    <span class="search-result-meta">${resource.subject} · ${resource.type}</span>
                    <strong class="search-result-title">${resource.title}</strong>
                    <span class="search-result-description">${resource.description}</span>
                </a>
            `).join('');
        }
        results.classList.add('is-visible');
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        render();
        results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    input.addEventListener('input', render);
    subjectFilter.addEventListener('change', render);
    typeFilter.addEventListener('change', render);
    render();
})();
