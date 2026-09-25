# Packaging validation (0.1.0)

The bundled Skill Creator `quick_validate.py` and Plugin Creator `validate_plugin.py` both pass. All 20 local links in `SKILL.md` resolve. All 22 copied reference HTML pages resolve their bundled authored CSS, JS, favicon, and linked pages. Vendor links are intentionally external to this package and must be filled from local licensed copies before running the HTML independently.

## Manual workflow simulations

These are instruction-level dry runs against `SKILL.md`, not installed-plugin model activation tests.

| Case | Prompt | Expected reference route and result | Check |
|---|---|---|---|
| A — Design | Design a generic admin console with navigation, Dashboard, and Users. | Design mode; `DESIGN-SYSTEM.md`, `SERVER-RENDERED-PATTERNS.md`, `dashboard.html`, `users.html`. Navigation follows the canonical workspace/reference shell; Dashboard uses restrained KPIs and status; Users keeps a dense table, GET filters, and ordinary links. | Route and all assets exist; no new visual direction prescribed. |
| B — Implement | Style a simple server-rendered CRUD users page. | Implement mode; `users.html` and `admin-ui.css`, then `COMPONENTS.md` only if needed. Keep a GET search form, POST mutation forms, and PRG; do not add a router, SPA state, or mandatory AJAX. | Reference and CSS exist; constraints are explicit. |
| C — Review | Review an admin page using a CDN, giant cards, an untranslated JS toast, unconfirmed destructive action, low-contrast all-gray controls, and arbitrary hard-coded CSS colors. | Review mode; identify offline dependency, card/density, i18n, confirmation, contrast hierarchy, and token bypass findings, with concrete locations and fixes. | All six issues are covered by the review checklist and bundled rules. |

Activation description was checked against positive phrases such as “admin console,” “operations console,” “PHP/Razor/Perl management page,” “Bootstrap admin UI,” and “modernize an existing admin screen,” and excludes marketing, storefront, consumer entertainment, SPA-heavy, and React design. Actual automatic activation and installed-plugin execution require a new Codex task after local marketplace installation.

## Fidelity boundary

The source Design Lab's HTML, authored CSS, JS, and design documents were copied without visual redesign. In the copied HTML, `../assets/` links became `../` because the pages live under `assets/reference-ui/` here. The source project's third-party distributions are not copied. The reference pages remain canonical implementation examples, with `reference-demo.js` identified as a non-production fixture adapter.
