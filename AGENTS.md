# WebUI Design Lab

- This repository is a generic Administration UI design lab, not a product.
- Preserve server-rendered HTML, ordinary links, GET filters and POST forms. No SPA, router, store or hydration.
- Use Bootstrap 5.3.x, Bootstrap Icons and vanilla JavaScript. Keep dependencies local and licensed. No runtime/build prerequisite.
- HTML contains the content; JavaScript progressively enhances it. Never generate entire tables in shared JavaScript.
- i18n is mandatory: UTF-8, language tags, translated HTML/data attributes, no user-facing strings in shared JS.
- Reuse `assets/css/admin-ui.css` tokens. Separate brand/theme from action and semantic colors. Keep density and visual consistency across reference pages.
- Change the static HTML directly. `.work/` is disposable authoring/verification scratch space, not a source or build dependency.
- `reference-demo.js` is a fixture adapter, not reusable production behavior. Keep simulated operations visibly identified.
- Verify affected pages in a browser, including keyboard use, narrow widths and Japanese labels. Preserve all reference pages and no-JS readability.
- Update related docs when design or behavior changes. Add dependencies cautiously; preserve fully offline operation.
- Do not introduce product-specific states, backend services, Skill/Plugin packaging or publishing in this sprint.

Detailed contracts live in `docs/`.

- Charts are optional. Add them only when they improve comprehension; follow `docs/CHARTS.md`.
