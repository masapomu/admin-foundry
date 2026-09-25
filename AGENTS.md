# AdminFoundry

- This repository is the AdminFoundry skills-only plugin and canonical administration UI reference.
- Preserve server-rendered HTML, ordinary links, GET filters and POST forms. No SPA, router, store or hydration.
- Use Bootstrap 5.3.x, Bootstrap Icons and vanilla JavaScript. Keep dependencies local and licensed. No runtime/build prerequisite.
- HTML contains the content; JavaScript progressively enhances it. Never generate entire tables in shared JavaScript.
- i18n is mandatory: UTF-8, language tags, translated HTML/data attributes, no user-facing strings in shared JS.
- Use the Graphite Blue reference preset by default. Follow the surface and contrast hierarchy in `skills/server-rendered-admin-ui/references/DESIGN-SYSTEM.md`; keep neutral, shell, accent, semantic and chart tokens separate.
- Change the canonical static HTML in `skills/server-rendered-admin-ui/assets/reference-ui/` directly. `.work/` is disposable authoring/verification scratch space, not a source or build dependency.
- `reference-demo.js` is a fixture adapter, not reusable production behavior. Keep simulated operations visibly identified.
- Verify affected pages in a browser, including keyboard use, narrow widths and Japanese labels. Preserve all reference pages and no-JS readability.
- Update related docs when design or behavior changes. Add dependencies cautiously; preserve fully offline operation.
- Preserve the portable plugin manifest and skills-only package. Do not add backend services or publish without an explicit request.

Detailed contracts live in `skills/server-rendered-admin-ui/references/`.

- Charts are optional. Add them only when they improve comprehension; follow `skills/server-rendered-admin-ui/references/CHARTS.md`.
