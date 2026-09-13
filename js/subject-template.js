(() => {
    const subjects = {
        matematicas: {
            name: 'Matemáticas II',
            description: 'Apuntes, teoría y práctica organizada para preparar la PAU de Matemáticas II.',
            legacyUrl: 'matematicas.html',
            blocks: [
                ['Análisis', 'Límites, continuidad, derivadas, representación gráfica e integrales.'],
                ['Álgebra', 'Matrices, determinantes, rango, inversa y sistemas de ecuaciones.'],
                ['Geometría', 'Vectores, rectas, planos, distancias, ángulos, áreas y volúmenes.'],
                ['Probabilidad y Estadística', 'Sucesos, distribuciones binomial y normal, y diagramas de árbol.']
            ]
        },
        fisica: {
            name: 'Física',
            description: 'Conceptos, fórmulas y bloques esenciales de Física para 2º de Bachillerato.',
            legacyUrl: 'física.html',
            blocks: [['Campo gravitatorio', 'Gravitación, Kepler, Newton y Gauss.'], ['Campo electromagnético', 'Coulomb, Lorentz, inducción y campos eléctrico y magnético.'], ['Vibraciones y ondas', 'Movimiento armónico simple, ondas, sonido y óptica.'], ['Física moderna', 'Relatividad, física cuántica y física nuclear.']]
        },
        filosofia: {
            name: 'Filosofía',
            description: 'Autores, teorías y comparaciones para comprender y preparar Filosofía.',
            legacyUrl: 'filosofía-apuntes.html',
            blocks: [['Autores', 'Platón, Aristóteles, San Agustín, Santo Tomás, Descartes, Hume, Kant, Rousseau, Marx, Nietzsche y Ortega.'], ['Comparaciones', 'Relaciones entre autores y conceptos clave del temario.'], ['Textos', 'Apuntes y recursos para trabajar textos filosóficos.']]
        },
        lengua: {
            name: 'Lengua Castellana y Literatura',
            description: 'Lengua, literatura y comentario de texto para preparar la PAU.',
            legacyUrl: 'lengua.html',
            blocks: [['Lengua', 'Morfología, sintaxis, semántica y lenguas y hablantes.'], ['Literatura', 'Temas, autores y obras de la literatura española.'], ['Comentario de texto', 'Adecuación, coherencia, cohesión y textos argumentativos.']]
        },
        dibujo: {
            name: 'Dibujo Técnico II',
            description: 'Geometría, sistemas de representación y fundamentos de Dibujo Técnico II.',
            legacyUrl: 'Dibujo.html',
            blocks: [['Geometría', 'Construcciones geométricas y resolución de problemas gráficos.'], ['Sistemas de representación', 'Proyecciones, diédrico y representación espacial.'], ['Normalización', 'Escalas, acotación y criterios de representación técnica.']]
        },
        historia: {
            name: 'Historia de España',
            description: 'Recorrido organizado por los procesos históricos de España.',
            legacyUrl: 'Historia de España.html',
            blocks: [['Antiguo Régimen y liberalismo', 'Crisis del Antiguo Régimen, Estado liberal y Restauración.'], ['Siglo XX', 'Alfonso XIII, Segunda República, Guerra Civil y franquismo.'], ['Democracia', 'Transición y consolidación de la democracia.']]
        },
        ingles: {
            name: 'Inglés',
            description: 'Gramática, vocabulario y comunicación escrita para 2º de Bachillerato.',
            legacyUrl: 'Inglés.html',
            blocks: [['Gramática', 'Tiempos verbales, estructura de oraciones, preposiciones y concordancia.'], ['Vocabulario', 'Palabras frecuentes, expresiones, campos semánticos y phrasal verbs.'], ['Writing', 'Estructuras y estrategias para mejorar la expresión escrita.']]
        },
        biologia: {
            name: 'Biología',
            description: 'Célula, genética, evolución y fisiología de los seres vivos.',
            legacyUrl: 'biología.html',
            blocks: [['Biología molecular', 'Biomoléculas, célula y procesos metabólicos.'], ['Genética y evolución', 'Herencia, genética molecular y evolución.'], ['Fisiología', 'Organización y funcionamiento de los seres vivos.']]
        },
        quimica: {
            name: 'Química',
            description: 'Estequiometría, enlaces, reacciones y química orgánica.',
            legacyUrl: 'química.html',
            blocks: [['Estructura y enlace', 'Modelo atómico, tabla periódica y enlace químico.'], ['Reacciones', 'Estequiometría, equilibrio, ácido-base y redox.'], ['Química orgánica', 'Formulación, nomenclatura y reactividad orgánica.']]
        }
    };

    const key = new URLSearchParams(window.location.search).get('materia') || 'matematicas';
    const subject = subjects[key] || subjects.matematicas;
    const title = document.getElementById('subject-title');
    const description = document.getElementById('subject-description');
    const grid = document.getElementById('subject-blocks');
    const legacyLink = document.getElementById('subject-legacy-link');

    document.title = `${subject.name} | BachilleratoFacilito`;
    title.textContent = subject.name;
    description.textContent = subject.description;
    legacyLink.href = subject.legacyUrl;
    grid.innerHTML = subject.blocks.map(([name, text], index) => `
        <article class="template-block">
            <span class="template-block__number">${String(index + 1).padStart(2, '0')}</span>
            <h2>${name}</h2>
            <p>${text}</p>
            <a class="btn-neon btn-outline" href="${subject.legacyUrl}">Abrir contenido</a>
        </article>
    `).join('');
})();
