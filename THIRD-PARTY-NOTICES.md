# Third-party notices

AdminFoundry's canonical reference UI bundles the following dependencies locally so the demo works without a CDN. These distributions are separate from AdminFoundry's MIT-licensed authored work and retain their own license notices.

| Project | Version | Role | License | Upstream |
|---|---:|---|---|---|
| Bootstrap | 5.3.8 | CSS and interactive component bundle | MIT | https://github.com/twbs/bootstrap/tree/v5.3.8 |
| Bootstrap Icons | 1.13.1 | Icon font and CSS | MIT | https://github.com/twbs/icons/tree/v1.13.1 |
| Chart.js | 4.5.1 | Optional visualization on Dashboard and Charts | MIT | https://github.com/chartjs/Chart.js/tree/v4.5.1 |
| Popper | 2.11.8 | Included in Bootstrap bundle | MIT | https://github.com/floating-ui/floating-ui |
| @kurkle/color | 0.3.2 | Included in Chart.js UMD bundle | MIT | https://github.com/kurkle/color/tree/v0.3.2 |

The full licenses are bundled in `skills/server-rendered-admin-ui/assets/vendor/`: Bootstrap `LICENSE` and `POPPER-LICENSE.md`, Bootstrap Icons `LICENSE`, and Chart.js `LICENSE.md` and `COLOR-LICENSE.md`. The minified distributions and their source maps stay local. Runtime pages do not fetch fonts, scripts, styles, images, telemetry, or APIs from a remote service.

For an application integration, supply the same dependencies from locally licensed files, retain their notices, and load Chart.js only on pages that need charts. Versions are pinned; review upstream licenses and test modal, dropdown, offcanvas, charts, icons, and source-map paths when updating them.
