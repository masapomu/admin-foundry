---
name: server-rendered-admin-ui
description: Design, implement, or review modern B2B administration and operations consoles for traditional server-rendered PHP, ASP.NET/Razor, Perl, Python, or similar apps, including Bootstrap admin pages and modernization. Use for dashboards, users, settings, logs, forms, tables, and system status; not for marketing sites, storefronts, consumer entertainment, SPA-heavy or React application design.
---

# Server-rendered admin UI

Use the bundled WebUI Design Lab as a canonical implementation, not a mood board. Do not redesign an established reference pattern unless the user explicitly asks for a new visual direction.

## Architecture

Server-rendered HTML first; Bootstrap 5.3.x, Bootstrap Icons, vanilla JavaScript, and progressive enhancement. No SPA, client-side router, mandatory AJAX, runtime Node dependency, or external runtime asset request. Keep offline deployment possible and i18n mandatory. Treat GET links and query-string filters, POST HTML forms, and Post/Redirect/Get as first-class. The host handles routing, authentication, CSRF, validation, data, and translation.

## Priority

1. Existing target-project conventions and explicit user requirements.
2. Bundled canonical reference implementation.
3. Bundled Design System documentation.
4. Bootstrap conventions.
5. New design decisions created by the model.

## Choose a workflow

- **Design:** Establish navigation, page composition, design MD, and static reference pages before implementation. Default to the bundled Graphite Blue theme, blue accent, and comfortable density unless the user chooses another. Read [DESIGN-SYSTEM.md](references/DESIGN-SYSTEM.md) for visual rules and [SERVER-RENDERED-PATTERNS.md](references/SERVER-RENDERED-PATTERNS.md) for request/response patterns; inspect only relevant HTML examples below.
- **Implement:** Inspect the target app's existing templates, routes, translation method, and asset pipeline. Start from the matching reference HTML and [admin-ui.css](assets/css/admin-ui.css); adapt tokens and markup to the host rather than regenerating the visual system. Adopt only needed behavior from [admin-ui.js](assets/js/admin-ui.js). The demo-only [reference-demo.js](assets/js/reference-demo.js) is a fixture adapter, not production behavior. Read [COMPONENTS.md](references/COMPONENTS.md) only when a component contract needs clarification.
- **Review:** Compare the target pages with the matching reference HTML and relevant design rule. Report concrete findings with locations and impact; do not change the UI unless asked. Check stock Bootstrap appearance, needless pattern divergence, card overuse, table density, filters, modal/toast/alert roles, token bypass, contrast/semantic hierarchy, keyboard access, i18n, offline assets, and SPA/router creep. Use [VISUAL-ANTI-PATTERNS.md](references/VISUAL-ANTI-PATTERNS.md) and [ACCESSIBILITY.md](references/ACCESSIBILITY.md) as needed.

## Read only the relevant reference

| Need | Canonical page |
|---|---|
| Dashboard | [dashboard.html](assets/reference-ui/dashboard.html) |
| Tables, users, CRUD | [users.html](assets/reference-ui/users.html) |
| Operational status | [system.html](assets/reference-ui/system.html) |
| Dense logs, filters | [logs.html](assets/reference-ui/logs.html) |
| Forms, validation, postback | [forms.html](assets/reference-ui/forms.html) |
| Bootstrap components | [components.html](assets/reference-ui/components.html) |
| Loading, empty, error states | [patterns.html](assets/reference-ui/patterns.html) |
| Internationalization | [i18n.html](assets/reference-ui/i18n.html) |
| Charts, only when data warrants them | [charts.html](assets/reference-ui/charts.html) and [CHARTS.md](references/CHARTS.md) |

The `assets/reference-ui/` folder also contains linked detail, pagination, result, and account pages. Read these only if the task uses those flows. Charts are optional; do not add a chart merely because a page is a dashboard.

## Integration rules

The reference HTML links to vendor paths intentionally omitted from this package. Supply locally licensed Bootstrap, Bootstrap Icons, and optional Chart.js in a deployed app; see [THIRD-PARTY.md](references/THIRD-PARTY.md). Keep the authored CSS/JS and HTML as the canonical source. For i18n, read [I18N.md](references/I18N.md) when localizing: host-selected and persisted locale, Accept-Language fallback, English fallback, UTF-8, `<html lang>`, locale-aware formatting, translated text expansion, and Japanese support. Shared JavaScript must not contain user-facing untranslated strings.
