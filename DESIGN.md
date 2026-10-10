# BachilleratoFacilito Design Notes

## Purpose

BachilleratoFacilito is a free study library for 2º de Bachillerato and the PAU. It brings together apuntes, teoría, ejercicios, resúmenes, exámenes and other resources in a subject-first navigation. The homepage leads with the library search because the main job is finding a useful topic quickly.

The visible product language comes from the site itself: “Todo Bachillerato. En un solo lugar.”, “Recursos claros”, “Acceso gratuito” and “Hecho para estudiar”. PAU preparation is a primary workflow, especially through models and previous Mathematics II exams.

## Critical Files

- `index.html`: homepage structure, navigation, search entry point, subject routes, editorial resources, PAU section and suggestions.
- `recursos.html`: complete subject catalogue and the terminology used to describe each subject.
- `estilos.css`: shared base styles plus the editorial `bf-*` homepage system, responsive rules and subject accent tokens.
- `style.css`: stylesheet entry point. It imports the shared stylesheet and should only contain deliberate homepage overrides.
- `home-search.js`: client-side catalogue and search behavior. Its records are the source of truth for searchable titles, subjects, topics, resource types and URLs.
- `subject-template.js`: subject data model and block descriptions for Mathematics II, Physics, Philosophy, Language, Technical Drawing II, History of Spain, English, Biology and Chemistry.
- `home-nav.js`: responsive navigation behavior for the shared homepage header.
- `pdf/` and `docs/`: study documents linked from the catalogue and resource lists.

## Product Goals

1. Make a subject, topic or PAU resource easy to find with clear labels and predictable routes.
2. Keep study content free, legible and organized around the real curriculum vocabulary: Análisis, Álgebra, Geometría, Campos, Ondas, Autores, Literatura, Genética, Reacciones and similar blocks.
3. Make PAU preparation visible without displacing the broader Bachillerato library.
4. Preserve lightweight static HTML, accessible navigation, keyboard-friendly search and responsive layouts.
5. Use only content that exists in the pages, JavaScript catalogues or linked documents; do not add invented metrics, testimonials or subject claims.

## Visual System

The homepage uses an editorial study-library direction rather than a generic dashboard:

- Ink: `#17211b`
- Muted text: `#657069`
- Paper background: `#f6f7f2`
- Green accent: `#1e624a`
- Lime highlight: `#d7e8b0`
- Borders: `rgba(23, 33, 27, 0.14)`
- Display type: Georgia for editorial headings and subject/resource names.
- Supporting type: Trebuchet MS / Segoe UI for navigation, metadata and controls.
- Cards and controls use restrained borders, small radii and subtle lift on interaction.
- Subject cards use distinct existing accents for Mathematics II, Physics, Philosophy, Language, Technical Drawing II, History, English, Biology and Chemistry.

The shared stylesheet still contains older blue/yellow components for non-home pages. Those tokens are legacy context; homepage work should follow the `--bf-*` tokens and existing `bf-*` component patterns unless a page explicitly requires the shared legacy system.