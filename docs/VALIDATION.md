# Initial sprint validation

## Environment and scope

Codex in-app Chromium browserでlocalhost静的配信を使用。製品backend、API、DBは使っていない。実装はHTMLファイルとして完結し、検証用server/authoring scriptは `.work/` の未追跡scratchのみ。

ブラウザー操作ツールがfile URLを許可しないため、自動目視確認では `file://` を使用していない。利用者は通常のブラウザーで `demo/index.html` を開くか、任意の静的HTTP配信を利用できる。

## Visual coverage

| Page / state | Result |
|---|---|
| Dashboard | 4 KPI、table、summary、empty、partial errorを実画面で確認 |
| Users | dense table、日本語氏名、長いemail、selected、dropdown、pagination |
| System | warning、resource、operation states、manual refresh / timestamp |
| Logs | 20行、複数level、長文、advanced日時入力、空/部分失敗 |
| Forms | flash、label/helper、readonly/disabled、各native input、validation error |
| Components | Button/Icon/Alert、3 modal、offcanvas、toast、popover、tooltip、collapse、copy |
| Patterns | 状態一覧と未保存変更のfixture |
| i18n | English / 日本語 / ドイツ語の長いラベル、日時/数値、日本語モーダル |

全8画面 × viewport幅390 / 768 / 992 / 1280px = **32条件**でDOM寸法を確認。全条件で `documentElement.scrollWidth - clientWidth = 0`。狭幅の表は専用region内の横scrollを維持。主要ページと各dialogはスクリーンショットを取得して目視した。32条件すべてを個別スクリーンショットで監査したという意味ではない。

390pxではヘッダー、開いたsidebar、wrapされたtoolbar、日本語dialogを目視。768pxでスクリプト読み込みを禁止し、navigationと8行のHTMLデータが残ることを確認。992pxではdesktop sidebarと縦積みコンテンツを目視。

## Interaction checks

- select all: 8件。日本語 `田中` をGET検索後は1件で、select allも1件。隠れた7行を選択しない。
- 検索 `no-matching-user`: 0件、No matching results表示。
- logsのUntil=2026-09-25T09:42: 09:42:00の行を含む20件。終了分の境界を確認。
- Message / Confirm / Destructive: 共通dialogを再利用し、対象のtitle/message/actionを表示。
- Confirm実行: 元submitイベントへ戻り、demo adapterが「送信・変更していない」toastを表示。
- Destructive cancel/Escape: dialogを閉じ、元の行menuボタンへfocus復帰。
- Cancelが初期focus。Shift+TabでDeleteへ循環し、focusがdialog内に留まる。
- 最終行のdropdownがtable領域で切れずに表示される。
- Offcanvas: Alex Morganのread-only詳細、close、full-page linkを確認。
- Password show/hide: input typeがtextへ切り替わることを確認。
- Preview save: データを保存しないtoast。field値は画面に残る。
- Toast / Popover / Tooltip / Collapse / Copy: 操作と表示を確認。copy成功通知を確認。
- Unsaved changes: 編集後のリンク遷移が停止し、reset後は遷移できた。ネイティブ警告文面そのものは自動化APIに表示されなかったため目視確認対象外。
- native date/time/datetime-local: ブラウザー/OSの入力UIと値を確認。日本語環境では表示が日本語形式になる。

## Offline verification

全HTMLのsrc/href/action、CSSのurl()を検査し、外部参照なし・ローカル対象の存在を確認。Bootstrap/Icon fonts/CSS/JS/favicon/source maps/licensesを同梱。共通/fixture JSにfetch/XMLHttpRequest/WebSocket/EventSourceなし。

検証用静的serverは `default-src 'self' data:`、`connect-src 'none'` で外部読込と通信を許可しないCSPを付けた。8画面と操作はこの制約下で動作し、通常のComponents確認でconsole errorは0件。インターネット接続アダプターを物理的に切断したテストやDevTools HAR採取は行っていない。

JavaScript読み込み禁止試験は追加で `script-src 'none'` を指定したもの。ブラウザー設定でJavaScriptそのものを無効にした試験ではないため、noscriptのパーサー動作はソースレビューで補った。

## Static checks

```text
node --check assets/js/admin-ui.js
node --check assets/js/reference-demo.js
node tests/static-check.mjs
```

20ページ、473件のローカル参照、duplicate ID、ARIA参照、input label、vendor素材、CSS asset、主要8組の文字コントラスト: PASS。

| Pair | Contrast |
|---|---:|
| Primary text / white | 14.79:1 |
| Muted text / app | 5.08:1 |
| White / primary action | 6.00:1 |
| White / danger action | 5.98:1 |
| Success / subtle | 5.49:1 |
| Warning / subtle | 5.82:1 |
| Danger / subtle | 5.38:1 |
| Info / subtle | 5.50:1 |

## Fixes made during validation

1. 表の不要な縦scrollを除去し、行paddingを減らして約48–50pxの密度へ調整。
2. dropdownをfixed positioningにして最終行menuのclippingを解消。
3. 閉じたmenu内のbuttonではなく、行menuの起点へfocusを戻すよう修正。
4. 非表示/無効行をbulk selectionから除外。
5. native日時filterの終了分をinclusiveに統一。
6. 390px headerの言語ラベルの不自然な縦折返しを修正。
7. 共通modalに起点のlangを引き継ぎ、日本語文言の読み上げ言語を維持。
8. 各user/serviceのdetails linkを対応する静的fixtureへ接続。
9. JSを読み込めない場合に動作しないselect-all/件数barを表示しないよう調整。

## Remaining human review / future work

実運用に合わせた文言、密度、role/menuの頻度は利用者評価で調整する。Safari/Firefox、スクリーンリーダー、高コントラスト、200% zoom、RTL、full Japanese documentは追加検証候補。実backendのCSRF/認可/POST/PRG/競合は今回の対象外。Dark ModeやSkill/Plugin化は行っていない。
