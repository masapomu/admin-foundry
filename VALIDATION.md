# AdminFoundry 0.1.0 preparation checks

This record covers repository reorganization before human review. No commit, push, tag, release, or plugin-directory publication was made during this sprint.

## Package and static checks

- Portable root `plugin.json` uses the Agent Plugins 1.0.0 schema, names `admin-foundry`, and declares version `0.1.0`, MIT, and the intended repository URL.
- Skill Creator `quick_validate.py skills/server-rendered-admin-ui`: pass.
- Plugin Creator `validate_plugin.py .`: pass, including the Codex compatibility manifest.
- `node tests/static-check.mjs`: pass — 22 pages, 735 local references, IDs, ARIA, input labels, offline assets, vendor notices, and 43 contrast pairs.
- `node tests/charts-check.mjs`: pass — Chart.js 4.5.1, four chart types, failure and empty states, locale formatting, optional loading, local licenses, and source map.
- No MCP, external app, authentication integration, or runtime Node dependency is declared.

## Workflow simulations

These are instruction-level dry runs against the packaged skill and canonical examples, not live automatic activation tests in a newly installed plugin.

| Mode | Simulated request | Expected routing and behavior | Result |
|---|---|---|---|
| Design | Design generic Dashboard and Users navigation. | Read the skill, `dashboard.html`, `users.html`, and only needed design rules. Use the established shell, restrained KPIs, dense table, and GET filters. | Routing and examples present; no new visual direction instructed. |
| Implement | Implement a PHP server-rendered Users CRUD page. | Start from `users.html` and `admin-ui.css`; keep GET search, POST forms, PRG, and host translations; add no SPA/router. | Canonical assets and architecture constraints present. |
| Review | Review a page with CDN assets, giant cards, hard-coded JS text, weak contrast, and deletion without confirmation. | Flag offline violation, card/density misuse, i18n violation, contrast hierarchy, and missing destructive confirmation with concrete fixes. | All five findings are covered by the review workflow and supporting references. |

The activation description includes administration/operations consoles, Bootstrap, server-rendered PHP/ASP.NET/Perl/Python, and design/implementation/review. It excludes marketing, storefront, React, and SPA-first requests. Installed-plugin natural activation remains for a new Codex task after human approval of the package.

## Browser reference check

The relocated pages were served locally from `skills/server-rendered-admin-ui/assets/reference-ui/`. Dashboard and Charts rendered with authored CSS, Bootstrap Icons, and local Chart.js. Charts reported ready/empty/error fixture states as designed, with no browser warnings or errors. On Components, the Message modal opened and closed, and Show toast displayed the local notification. At 390px width, the i18n page kept controls visible, wrapped Japanese text, and allowed the dense table to scroll horizontally. Navigation targets and all relative assets were checked by the static test. The bundled third-party files make the reference self-contained and offline-ready; no CDN is used.

The source UI's layout, component styles, theme tokens, and behavior were not redesigned. Visible `WebUI Design Lab` attribution was changed to `AdminFoundry`, and relative paths were updated for the new directory. The `reference-demo.js` adapter remains explicitly demo-only.
