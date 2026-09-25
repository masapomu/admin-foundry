# Server-Rendered Admin UI Plugin

Version **0.1.0**. One Codex skill packages the WebUI Design Lab's canonical administration UI examples for Design, Implement, and Review work in PHP, ASP.NET/Razor, Perl, Python, and other traditional server-rendered applications.

The reference is a modern B2B operations console: graphite navigation shell, light work surfaces, restrained blue action accent, dense but readable tables and forms, semantic status colors, and optional charts. Screenshots are not bundled; inspect the canonical HTML pages in `skills/server-rendered-admin-ui/assets/reference-ui/` or the source Design Lab demo. Use its established patterns rather than inventing a new visual direction unless requested.

## Architecture

HTML comes from the server. Links and GET query strings handle navigation and filtering; POST forms use Post/Redirect/Get. Bootstrap 5.3.x and Bootstrap Icons provide local foundations, authored CSS sets the design, and vanilla JavaScript progressively enhances behavior. There is no SPA, router, mandatory AJAX, or runtime Node requirement. The host application owns authentication, CSRF, persistence, validation, and translations.

## Included skill

`skills/server-rendered-admin-ui/SKILL.md` routes among Design, Implement, and Review. It links only the relevant reference pages and documents for each task. Graphite Blue with blue accent and comfortable density is the default; another theme, accent, or density can be supplied by the user and adapted through CSS tokens.

## Example prompts

### Design

```text
Use the server-rendered-admin-ui skill.
Product: Acme Operations
Theme: Graphite
Accent: Blue

Design an administration console with Dashboard, Users, Devices, and Logs.
Generate the UI design documents and static reference pages first.
```

### Implement

```text
Use the server-rendered-admin-ui skill.
Implement this PHP user administration page using the bundled canonical Users reference.
Keep the existing server-rendered GET/POST architecture.
```

### Review

```text
Review this administration UI against the server-rendered-admin-ui design system and canonical reference implementation.
Do not redesign functionality; report concrete inconsistencies and suggested fixes.
```

## Install and test

The root `plugin.json` uses the portable Agent Plugins 1.0.0 schema. `.codex-plugin/plugin.json` is a Codex compatibility fallback. Put this folder in a local plugin marketplace, or copy the skill folder into a Codex skills location for direct skill testing. For a repository marketplace, place the plugin at `plugins/server-rendered-admin-ui` and add a `.agents/plugins/marketplace.json` entry pointing to `./plugins/server-rendered-admin-ui`; restart the desktop app, install it from that source, and start a new task to test explicit and natural activation. The package contains no MCP server, service connection, authentication, hooks, or app manifest.

Run the bundled Skill Creator `quick_validate.py` on `skills/server-rendered-admin-ui` and Plugin Creator `validate_plugin.py` on this folder when available. Also verify that reference-page links, CSS, and JS resolve. The reference HTML pages omit the third-party vendor files by design and are **not standalone runnable copies**; to preview one, copy the licensed vendor files into the `assets/vendor/` paths listed in the HTML or inspect the original Design Lab demo. Application integration must bundle dependencies locally.

## Dependencies and licenses

Authored HTML, CSS, JS, and documents are copied from WebUI Design Lab and distributed under this package's [MIT license](LICENSE). The package excludes vendor distributions to avoid duplicating large files and their update burden. Application developers supply Bootstrap **5.3.8** (MIT), Bootstrap Icons **1.13.1** (MIT), and Chart.js **4.5.1** (MIT, optional) with their own licenses. Bootstrap's bundle includes Popper **2.11.8** (MIT); Chart.js UMD includes `@kurkle/color` **0.3.2** (MIT). See `skills/server-rendered-admin-ui/references/THIRD-PARTY.md` for provenance.

## Development

Update the source Design Lab first, then refresh the copied authored assets and relevant references without redesigning them. Preserve linked flow pages, keep `reference-demo.js` labeled demo-only, validate the manifest and skill, and rerun Design/Implement/Review sample tasks. Check for secrets, personal paths, generated scratch files, and third-party attribution before publishing. Public directory submission and GitHub push are outside this package's scope.
