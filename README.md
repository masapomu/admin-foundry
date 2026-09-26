[English](README.md) | [日本語](README.ja.md)

# AdminFoundry

Modern admin UI patterns for server-rendered web applications.

Offline-ready admin UI design system and Codex skill for server-rendered PHP, ASP.NET, and other postback-style web apps. No CDN required.

**[Explore the live demo](https://masapomu.github.io/admin-foundry/)** · [Browse the reference UI](https://masapomu.github.io/admin-foundry/demo/dashboard.html)

AdminFoundry combines a design system, canonical HTML/CSS/JavaScript reference implementation, and the `server-rendered-admin-ui` skill. It uses Bootstrap 5.3.x and Bootstrap Icons to modernize administration and operations consoles while preserving ordinary server-rendered pages, GET filters, POST forms, and Post/Redirect/Get.

Modern UI does not require React, a SPA, client-side routing, a Node runtime, or a CDN. This project is for PHP, ASP.NET/Razor, Perl, Python, and similar applications that render HTML on the server. JavaScript progressively enhances the page; the host remains responsible for routing, data, authentication, CSRF, validation, and translation.

## How to install in Codex

Add this repository's plugin marketplace, then install AdminFoundry:

```text
codex plugin marketplace add masapomu/admin-foundry --ref main
codex plugin add admin-foundry@admin-foundry-local
```

Start a new Codex task and ask it to use the `admin-foundry:server-rendered-admin-ui` skill to design, implement, or review a server-rendered admin UI. The skill and reference implementation are included with the plugin; no separate skill installation is needed. This repository's marketplace is for direct GitHub installation, not a listing in the official public Plugins Directory.

## Preview

The showcase opens the canonical reference UI as a static demo. Actions are simulated; nothing is saved or sent to a backend.

### Dashboard

![AdminFoundry Dashboard](docs/images/dashboard.png)

### User administration

![AdminFoundry Users](docs/images/users.png)

### Dense log view

![AdminFoundry Logs](docs/images/logs.png)

[Explore the live demo →](https://masapomu.github.io/admin-foundry/)

## Core principles

- Server-rendered HTML first, with Bootstrap 5.3.x, Bootstrap Icons, and vanilla JavaScript.
- Progressive enhancement; no SPA or client-side router required.
- Fully offline-capable with locally bundled assets and no CDN requirement.
- i18n is mandatory, with English fallback and translated text in HTML rather than hard-coded shared JavaScript.
- Accessible, desktop-first pages that remain usable at narrow widths and without JavaScript.

## Reference UI

The [reference pages](skills/server-rendered-admin-ui/assets/reference-ui/index.html) cover Sign-in, Dashboard/KPIs, Users/CRUD tables, System status, dense Logs and filters, Forms and validation, Bootstrap Components, loading/empty/error Patterns, i18n, and optional Charts. Linked detail, pagination, result, and account pages show complete flows. The canonical authored styles and behaviors live beside the HTML under `skills/server-rendered-admin-ui/assets/`.

Open `skills/server-rendered-admin-ui/assets/reference-ui/index.html` in a browser or serve the repository with any static localhost server. The included vendor assets keep this reference runnable offline; no Node/npm build or backend is needed. Demo actions are simulated and do not save or delete data. When integrating with a real host, use the reference HTML/CSS as a starting point and replace demo fixtures with server behavior.

## Skill and plugin

**Plugin:** AdminFoundry (`admin-foundry`)

**Skill:** [server-rendered-admin-ui](skills/server-rendered-admin-ui/SKILL.md)

The skill supports **Design**, **Implement**, and **Review** workflows. It routes each task to the relevant canonical page and only the needed design rule, so a Users task need not load every page or document. The root [plugin.json](plugin.json) is the portable Agent Plugins manifest; `.codex-plugin/plugin.json` is a Codex compatibility fallback. This is a skills-only plugin with no MCP server, account connection, or external API.

This English README is the canonical source for project facts. Keep [README.ja.md](README.ja.md) semantically aligned when those facts change.

### Example prompts

**Design**

```text
Use AdminFoundry to design a server-rendered administration console.

Product: Example Operations
Theme: Graphite
Accent: Blue

Pages:
- Dashboard
- Users
- Nodes
- Logs
```

**Implement**

```text
Use the AdminFoundry server-rendered-admin-ui skill to implement this PHP users page.
Preserve the existing GET/POST architecture and use the bundled Users reference as the visual baseline.
```

**Review**

```text
Review this admin UI against the AdminFoundry design system and canonical reference implementation.
Focus on visual consistency, i18n, accessibility, offline dependencies, and server-rendered architecture.
```

## Architecture and localization

```text
Server application -> rendered HTML -> Bootstrap + AdminFoundry styles
                                         |-> Bootstrap Icons
                                         `-> vanilla JS enhancements
```

The host application owns the translation runtime and locale-aware date, time, and number formatting. Resolve the language from explicit user choice, persisted preference, HTTP `Accept-Language`, then English fallback. Set UTF-8 and `<html lang>`. Shared AdminFoundry JavaScript reads translated labels from HTML and does not hard-code user-facing English messages.

All runtime dependencies can be bundled locally for intranet and server-management tools. The reference includes local Bootstrap and Bootstrap Icons; Chart.js is optional and loaded only where a chart helps explain data. A dashboard does not require charts.

## Repository structure

```text
plugin.json                         portable plugin manifest
.codex-plugin/plugin.json           Codex compatibility fallback
skills/server-rendered-admin-ui/
  SKILL.md                          workflow and reference routing
  references/                       design and implementation contracts
  assets/
    reference-ui/                   canonical HTML pages
    css/                            authored design tokens and chart styles
    js/                             authored enhancement and demo scripts
    vendor/                         offline third-party distributions/licenses
LICENSE                             MIT for AdminFoundry-authored work
THIRD-PARTY-NOTICES.md              dependency versions and licenses
tests/                              maintainer-only checks; no runtime dependency
site/                               showcase landing and artifact assembly script
docs/images/                        README and showcase screenshots
.github/workflows/pages.yml         GitHub Pages artifact and deployment workflow
```

This is a **0.1.5 prerelease** and has not been published to a plugin directory. See [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) for Bootstrap, Bootstrap Icons, Chart.js, and transitive license information. AdminFoundry-authored code and documentation are [MIT licensed](LICENSE); third-party distributions retain their own licenses.

To preview the Pages artifact locally, run `pwsh -File site/build-pages.ps1` from a fresh checkout and serve `.work/pages/` with any static server. The script copies the canonical reference UI and its local CSS, JavaScript, icons, and vendor assets into a disposable publish directory; the source pages remain in one place. The showcase is published at [masapomu.github.io/admin-foundry](https://masapomu.github.io/admin-foundry/) using GitHub Actions.
