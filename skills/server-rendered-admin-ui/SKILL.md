---
name: server-rendered-admin-ui
description: Design, implement, or review Bootstrap administration and operations consoles for server-rendered PHP, ASP.NET/Razor, Perl, Python, and similar postback-style apps. Use the AdminFoundry reference UI; not for marketing sites, storefronts, React, or SPA-first frontend design.
---

# AdminFoundry: server-rendered admin UI

Use the bundled AdminFoundry design system and canonical reference implementation to design, implement, or review modern administration interfaces. An established reference pattern should be adapted rather than redesigned. Create a new visual pattern only if the requested UI is genuinely absent or the user explicitly requests another direction.

## When to use

Use for sign-in, dashboards, users and CRUD, forms, settings, logs, system status, Bootstrap components, and their design reviews in traditional server-rendered apps. Do not invoke for marketing, ecommerce, consumer entertainment, or SPA-first/React design work.

## Core principles

Server-rendered HTML first; Bootstrap 5.3.x, Bootstrap Icons, vanilla JavaScript, progressive enhancement, and fully offline-capable local assets. No CDN, SPA, client-side router, mandatory AJAX, or runtime Node dependency. Keep GET navigation and query-string search/filter, POST HTML forms, and Post/Redirect/Get. Do not introduce frontend architecture merely to apply AdminFoundry.

i18n is a mandatory design constraint. The host owns locale resolution, persistence, translations, and date/time/number formatting; use explicit user choice, then persisted preference, then `Accept-Language`, then English fallback. Set UTF-8 and `<html lang>`, allow text expansion and Japanese, and keep user-facing strings out of shared JavaScript. Read [I18N.md](references/I18N.md) only for localization work.

## Reference priority

1. Explicit user requirements.
2. Existing target-project conventions that must be preserved.
3. AdminFoundry canonical reference implementation.
4. AdminFoundry design documentation.
5. Bootstrap conventions.
6. New model-created design decisions.

## Workflows

- **Design:** Identify pages and navigation, then adapt the closest reference pages. Produce design MD, page inventory, component choices, and static HTML as requested. The default is Graphite Blue, blue accent, comfortable density; customize tokens only when the user calls for it. Read [DESIGN-SYSTEM.md](references/DESIGN-SYSTEM.md) when defining visual rules and [SERVER-RENDERED-PATTERNS.md](references/SERVER-RENDERED-PATTERNS.md) for request/response flows.
- **Implement:** Inspect the host's routes, templates, form conventions, translations, and asset pipeline. Start from the relevant canonical HTML and [admin-ui.css](assets/css/admin-ui.css); sign-in also uses [login.css](assets/css/login.css). Adapt the bundled authored CSS instead of generating a new design from prose. Adopt only needed behaviors from [admin-ui.js](assets/js/admin-ui.js). Preserve the host's GET/POST architecture and PRG. [reference-demo.js](assets/js/reference-demo.js) is a fixture adapter, never production logic. Read [COMPONENTS.md](references/COMPONENTS.md) only when the component contract needs clarification.
- **Review:** Compare actual pages with the matching reference and report concrete locations, impact, and suggested fixes. Check stock Bootstrap appearance, spacing and contrast, card overuse, table density, search/filter consistency, action placement, modal/toast/alert/popover roles, destructive confirmation, Bootstrap Icons, i18n and hard-coded JS strings, accessibility, offline assets, chart misuse, and unnecessary SPA/router code. Consult [VISUAL-ANTI-PATTERNS.md](references/VISUAL-ANTI-PATTERNS.md) and [ACCESSIBILITY.md](references/ACCESSIBILITY.md) as needed.

## Read only what the task needs

| Task | Canonical example |
|---|---|
| Sign-in and authentication entry | [login.html](assets/reference-ui/login.html), [login-ja.html](assets/reference-ui/login-ja.html), and [SERVER-RENDERED-PATTERNS.md](references/SERVER-RENDERED-PATTERNS.md) |
| Dashboard, KPI, overview | [dashboard.html](assets/reference-ui/dashboard.html) |
| CRUD, tables, users, row actions | [users.html](assets/reference-ui/users.html) |
| System and operational status | [system.html](assets/reference-ui/system.html) |
| Dense filters and logs | [logs.html](assets/reference-ui/logs.html) |
| Forms, validation, postback | [forms.html](assets/reference-ui/forms.html) |
| Modal, toast, popover, Bootstrap components | [components.html](assets/reference-ui/components.html) |
| Loading, empty, error, conflict | [patterns.html](assets/reference-ui/patterns.html) |
| Internationalization | [i18n.html](assets/reference-ui/i18n.html) and [I18N.md](references/I18N.md) |
| Charts, when data benefits | [charts.html](assets/reference-ui/charts.html) and [CHARTS.md](references/CHARTS.md) |

Linked detail, pagination, result, and account examples are adjacent to these pages. Charts are optional; a dashboard alone is not a reason to add one. Read only the relevant page and supporting rule, not the whole asset tree. The bundled offline dependencies and their licenses are recorded in [THIRD-PARTY-NOTICES.md](../../THIRD-PARTY-NOTICES.md). Before finishing, verify the affected page, keyboard access, narrow width, Japanese text, and offline dependencies as applicable.
