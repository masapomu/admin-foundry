# Vendored dependencies

実行時にネットワークから取得しない。下記は取得元を記録した文書リンクであり、demoからのremote requestではない。

| Dependency | Version | Source | License |
|---|---|---|---|
| Bootstrap | 5.3.8 | https://github.com/twbs/bootstrap/tree/v5.3.8 | MIT (`assets/vendor/bootstrap/LICENSE`) |
| Bootstrap Icons | 1.13.1 | https://github.com/twbs/icons/tree/v1.13.1 | MIT (`assets/vendor/bootstrap-icons/LICENSE`) |

Bootstrap CSSとJS bundleは公式GitHub tagのdistから取得。bundleにはPopperが含まれる。Bootstrap Iconsはfont CSSとwoff/woff2を取得。外部フォントサービスは使わない。

Popper 2.11.8のMITライセンスを `assets/vendor/bootstrap/POPPER-LICENSE.md` に併記。BootstrapのCSS/JS source mapもローカルに置き、DevToolsでの参照を外部に依存させない。

更新時は固定tagを選び、LICENSE、同梱bundleのライセンス表示、フォント参照、source map参照を確認する。更新後は全ページとmodal/dropdown/offcanvasを再確認する。
