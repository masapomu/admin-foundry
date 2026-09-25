# Vendored dependencies

実行時にネットワークから取得しない。下記は取得元を記録した文書リンクであり、demoからのremote requestではない。

| Dependency | Version | Source | License |
|---|---|---|---|
| Bootstrap | 5.3.8 | https://github.com/twbs/bootstrap/tree/v5.3.8 | MIT (`assets/vendor/bootstrap/LICENSE`) |
| Bootstrap Icons | 1.13.1 | https://github.com/twbs/icons/tree/v1.13.1 | MIT (`assets/vendor/bootstrap-icons/LICENSE`) |
| Chart.js (optional) | 4.5.1 | https://registry.npmjs.org/chart.js/-/chart.js-4.5.1.tgz | MIT (`assets/vendor/chartjs/LICENSE.md`) |
| @kurkle/color (inside Chart.js UMD) | 0.3.2 | https://github.com/kurkle/color/tree/v0.3.2 | MIT (`assets/vendor/chartjs/COLOR-LICENSE.md`) |

Bootstrap CSSとJS bundleは公式GitHub tagのdistから取得。bundleにはPopperが含まれる。Bootstrap Iconsはfont CSSとwoff/woff2を取得。外部フォントサービスは使わない。

Popper 2.11.8のMITライセンスを `assets/vendor/bootstrap/POPPER-LICENSE.md` に併記。BootstrapのCSS/JS source mapもローカルに置き、DevToolsでの参照を外部に依存させない。

更新時は固定tagを選び、LICENSE、同梱bundleのライセンス表示、フォント参照、source map参照を確認する。更新後は全ページとmodal/dropdown/offcanvasを再確認する。

Chart.jsは2026-09-26に[公式releases](https://github.com/chartjs/Chart.js/releases)で現行stable 4.5.1を確認。公式npm tarballの`dist/chart.umd.min.js`とそのsource mapを変更せず同梱した。mapはsourcesContentを内包し、DevToolsにも外部取得を要求しない。UMD内のChart.js / @kurkle/color copyright noticeも保持。CDN・remote plugin・remote fontは利用しない。

`assets/vendor/chartjs/chart.umd.min.js` SHA-256:
`48444a82d4edcb5bec0f1965faacdde18d9c17db3063d042abada2f705c9f54a`

Chart.jsは`charts.html`と`dashboard.html`だけが読み込む。更新時は`tests/charts-check.mjs`、全chart type、tooltip、HTML legend、Gray/Dark、日本語、resize、no-JS fallbackを再確認する。
