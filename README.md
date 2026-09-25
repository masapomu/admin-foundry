# WebUI Design Lab

複数の管理ツールで再利用する Administration UI Design System / Reference Implementation の初版です。実際の製品ではなく、架空の **Acme Operations** を使った評価用リファレンスです。

**Server-rendered HTML を Bootstrap で現代化する**ことを目的にしています。Modern B2B SaaS Operations Console を方向性とし、落ち着いた Gray、情報密度、整列、控えめな境界線を優先します。

## 開き方

`demo/index.html` または `demo/dashboard.html` を通常のブラウザーで開いてください。HTML・CSS・JavaScript・アイコンフォントはすべて相対パスで同梱しています。インターネット接続、Node/npm、ビルド、バックエンドは不要です。

ブラウザーのポリシーにより `file://` や Clipboard API が制限される場合は、任意の静的HTTPサーバーでこのフォルダーをlocalhostへ配信できます。コピー失敗時は手動コピーを案内します。自動検証はlocalhost配信で実施しました。詳細は [検証記録](docs/VALIDATION.md) を参照してください。

## Reference pages

| ページ | 内容 |
|---|---|
| [Overview](demo/dashboard.html) | 4 KPI、サービス、最近の操作、概要、空状態、部分エラー |
| [Users](demo/users.html) | GET検索、ステータス、行メニュー、一括選択、モーダル、詳細、ページング |
| [System](demo/system.html) | リソース、警告、停止確認、長時間処理、鮮度 |
| [Logs](demo/logs.html) | 20行のログ、長文、日本語、レベル、日時フィルター |
| [Forms](demo/forms.html) | POST形式、ラベル、検証エラー、標準入力、flash、未保存警告 |
| [Components](demo/components.html) | Bootstrap部品と共通の用途・見た目 |
| [Patterns](demo/patterns.html) | 読み込み、失敗、競合、権限、読み取り専用など16状態 |
| [i18n](demo/i18n.html) | English / 日本語 / 長いドイツ語訳の比較 |
| [Personal settings](demo/account.html) | 右上のアカウントメニューから開くプロフィール・表示設定のプレビュー |

## 構成

```text
README.md / AGENTS.md / .gitignore / .gitattributes
docs/
  DESIGN-SYSTEM.md       COMPONENTS.md
  SERVER-RENDERED-PATTERNS.md  I18N.md
  ACCESSIBILITY.md       VISUAL-ANTI-PATTERNS.md
  VALIDATION.md          THIRD-PARTY.md
demo/
  index.html / dashboard.html / users.html / system.html
  logs.html / forms.html / components.html / patterns.html / i18n.html
  account.html
  users-page-2.html / user-detail*.html / result.html
assets/
  css/admin-ui.css
  js/admin-ui.js / reference-demo.js
  favicon.svg
  vendor/bootstrap/       # 5.3.8, CSS + JS bundle + licenses/maps
  vendor/bootstrap-icons/ # 1.13.1, CSS + fonts + license
tests/static-check.mjs    # Optional maintainer verification only
```

## 技術とアーキテクチャ

HTML5 / UTF-8 / CSS Variables / Bootstrap 5.3.8 / Bootstrap Icons 1.13.1 / Vanilla JavaScript / system fonts。

画面とテーブルは静的HTMLにすべて含まれます。SPA、ルーター、hydration、JSON API、fetch、ストアはありません。Bootstrapはレイアウト・部品・動作の土台で、独自CSSレイヤーが見た目を定義します。

- GETは検索・フィルター。検索後は普通のページ遷移を行い、クエリーを保持します。
- POSTは更新。ホスト実装ではPRG（POST → 303 → GET）を推奨します。
- `admin-ui.js` はモーダル、詳細、コピーなどの補助です。翻訳済み文字列をHTMLから受け取ります。
- `reference-demo.js` は静的デモ専用です。既存HTML行の絞り込みとPOSTプレビューだけを担当します。
- デモは保存・削除・停止・ログアウト・通信を行いません。右上のアカウントメニューでは個人設定へ移動でき、ログアウトは説明ダイアログで示します。JavaScriptなしでもメニューと個人設定を読めます。検索・POST・認証処理はホスト実装の責務です。
- 本番ではfixture adapterを外し、action、CSRF、認可、検証、競合検知、翻訳をホストに接続してください。

## Theme と i18n

Gray が標準です。`data-ui-theme="blue|red|dark|navy|green|purple"` で色を拡張できます。Muted redでは主要操作・リンク・フォーカス色もブランド色に合わせます。DarkではBootstrapの`data-bs-theme="dark"`と暗色用のsurface・文字・状態色を併用します。密度は comfortable が標準で、`data-ui-density="compact"` のトークンも用意しています。

本文16px、表15px、補助14px、ボタン・入力15pxを標準とします。ページ見出しは26pxです。各ページの「Theme preview」でGray、Soft blue、Muted red、Darkを比較できます。赤系はブランドの鈍い赤と淡いsurfaceを使い、危険操作の明るい赤とは分けています。色の選択は静的デモ専用のURLパラメーターで、画面遷移とGETフォームに引き継がれます。実アプリではhostが`data-ui-theme`と`data-bs-theme`を描画してください。

i18nは必須です。翻訳ランタイムには依存しません。文言・複数形・日時・数値の整形はホストが担当し、UTF-8、`html lang`、semantic keys、文字列伸長を設計契約とします。

## Offline と今後

必要なアセットはすべてリポジトリに含まれ、CDN、外部フォント、画像、分析、テレメトリー、外部APIへの実行時依存はありません。依存元・ライセンスは [THIRD-PARTY.md](docs/THIRD-PARTY.md) に記録しています。

今後は人間の評価後に視覚・操作を調整し、設計資産をSkill、skills-only Plugin、再利用可能なGitHub資産へ抽出できます。このSprintではパッケージ化・公開・次のiterationは行いません。

任意の保守チェックは `node tests/static-check.mjs`。依存インストール不要で、ローカル参照・ARIA/inputラベル・コントラストを確認します。これは開発時の補助であり、Reference Siteの実行にNodeは必要ありません。
