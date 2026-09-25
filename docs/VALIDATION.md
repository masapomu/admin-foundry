# Initial sprint validation

## Chart visualization follow-up — 2026-09-26

- Chart.js 4.5.1 UMDを公式npm packageから取得。MIT本体と内包@kurkle/color 0.3.2のMIT notice、ローカルsource mapを保持。ハッシュはTHIRD-PARTY.md。
- `node --check assets/js/admin-charts.js`、`node tests/charts-check.mjs`、`node tests/static-check.mjs`を実施。22ページ・713ローカル参照・既存24色組がPASS。Chart paletteもlight/darkの5色すべてsurfaceに対して3:1以上、tooltip文字4.5:1以上。
- adapter testsで4種類、Empty/zero/null、欠損source、malformed JSON、型/長さ不正、ライブラリ不在、部分失敗、instance再利用、update('none')、更新失敗時の前データ維持、locale/percent/decimal/compact/GiB/duration整形、任意options非転送、Optionalロード範囲を確認。
- ブラウザーでGray/Dark、Line/Bar/Doughnut/Mini、長いカテゴリラベル、HTML legend、英日tooltip、Loading/Empty/Error、日本語/JST表示を目視。1280pxと390pxでresizeと横はみ出しなしを確認。元データ表は表示精度を落とさず、compact表記は軸/tooltipに限定した。
- DashboardはCompact lineを1つ追加し、KPIと表・状態とのバランスを確認。Systemはchartを増やさず、ナビゲーションのChartsリンクのみ追加。
- 通常のCharts/Dashboardでconsole error/warningなし。animationは常時false、更新もnoneで、reduced-motionの有無によらず動かない。Loading spinnerは既存のreduced-motion CSS対象。
- localhostのCSP `default-src 'self' data:; script-src 'self'; connect-src 'none'`で外部取得を禁止した状態で全chartが描画。静的参照検査でも外部assetなし。file URLの実ブラウザー確認はブラウザー操作ポリシーにより不可だったため、外部通信禁止のlocalhostで検証した。OSのネットワーク切断は実施していない。
- `qa_nojs=1`でscript-src 'none'にし、canvasを表示せず要約と元データ表が残ること、Enterで表を展開できることを確認。この条件でのCSP script-blockメッセージは意図したもの。

視覚調整: 折り返すHTML legend、長いbar labelの意味単位での改行、Dark用series/tooltip palette、標準280px・compact200px・mini56pxの親コンテナを採用。Safari/Firefox・実スクリーンリーダー・200% zoomは未検証。別library/実API/polling/export/Skill化は実装していない。

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

## Typography + Soft blue follow-up

利用者の希望に合わせ、本文14→16px、表13→15px、表見出し11→13px、補助12→14px、ボタン/入力13→15pxへ拡大。ページ見出し26pxは維持。余裕を確保するため行の最小高48→52px、ボタン/入力の最小高36→38pxへ調整した。

Grayを標準のまま、Soft blueを比較用に追加。後者はbrand #365c82、sidebar #f0f3f7、app #f7f9fb、border #dbe2ea。primary actionとsuccess/warning/danger/infoは変えない。各ページの「Theme preview」リンクでURLの`theme=gray|blue`を切替える。静的デモの補助JSが属性を適用し、通常リンク/GETフォームにも引き継ぐ。翻訳済み表示文はHTMLから取得する。

ブラウザーでは、2テーマ × 8主要画面 × 390/768/992/1280px の**64条件**でテーマ適用とページ幅を確認し、いずれもページ全体の横はみ出しなし。Gray/Soft blueのFormsとDashboard、390pxのUsers・日本語表示を目視。ユーザーが入力中の既存Formsタブは再読み込みせず、別タブで検証した。

## Muted red follow-up

本文16px・表15px・補助14px・ボタン/入力15pxの設定を標準として維持した。Muted redはbrand/primary #86515a、sidebar #f6f0f1、app #fbf8f8、border #e8dcdf。主要ボタン・リンク・focusも同系色に揃えた。Danger #b3363dは変更せず、Neutral badgeとread-only inputの背景をテーマから独立したneutral tokenへ移した。各画面の比較リンク、通常リンク、GET検索で`theme=red`を引き継ぐ。

ブラウザーでRedのDashboard・Components・日本語比較を目視し、主要操作とDanger操作の区別を確認した。390pxで主要8画面を巡回し、いずれも本文16px・テーマ適用・ページ全体の横はみ出しなし。DesktopでもDashboard・Componentsに横はみ出しなし。UsersのGET検索で`theme=red`と検索語の維持を確認した。既存のユーザータブは再読み込みしていない。

## Toast visibility follow-up

トーストを350×47px程度・本文14pxの右下表示から、最大幅440px・最小高72px・本文16pxの右上表示へ変更した。狭幅では左右12pxを確保して下部に表示し、表示時間を5～7秒から8秒へ統一。ComponentsのShow toastをDesktopと390px幅で表示して視認性と横はみ出しなしを確認。Enterキーで表示し、閉じるボタンもキーボードで操作できることを確認した。

## Account menu follow-up

全21ページの右上にアカウントメニューを追加。Personal settingsは通常リンクで開き、サンプルフォームは保存せずプレビュー通知を表示する。Sign outはセッションを終了しない説明ダイアログ。デスクトップ・390/320px幅でメニューを表示し、個人設定への遷移、赤/青テーマの維持、横はみ出しなし、Enter/Escapeでの開閉を確認した。日本語サンプルでも個人設定・ログアウトのラベル、長い説明文、ダイアログの`lang=ja`を確認した。静的チェックは21ページ・600件のローカル参照でPASS。

## Toast countdown follow-up

自動終了を5秒に変更し、トースト下端に3pxの残り時間バーを追加。Bootstrapの停止・再開と合わせ、マウスまたはフォーカス中はバーも止め、離れたら5秒から数え直す。Componentsで約2秒後のバー縮小、約5.8秒後の非表示、再表示によるバーのリセット、閉じるボタンにフォーカスしたまま5秒以上維持する動作を確認した。日本語通知も390px幅で表示し、横はみ出しなし。動きを減らす設定ではバーを非表示にする。

## Account trigger alignment fix

開いた`details`の見出しに付ける共通の下余白が、ヘッダー内のアカウントボタンも押し上げていた。余白の適用からアカウントメニューを除外。i18n画面のデスクトップと390px幅で、開閉前後のボタン位置・高さとヘッダー高さが変わらず、横はみ出しもないことを確認した。

## Toast placement follow-up

5秒で閉じるトーストの表示位置を画面右下へ戻した。幅・本文サイズ・残り時間バーは維持。青テーマのComponentsで1280×720pxでは右・下に16px、390×844pxでは左右・下に12pxの余白を確認した。日本語通知も390px幅で表示し、横はみ出しなし。静的チェックは21ページ・600件のローカル参照でPASS。

## Dark theme follow-up

Grayを標準のままDarkを比較テーマとして全21ページに追加。URLの`theme=dark`を描画前に適用し、Bootstrapの暗色部品と独自のsurface・文字・brand・action・semantic色を切り替える。主要操作は青、危険操作は白文字が読める濃い赤とし、状態表示には暗い背景向けの明るい色を使う。ページ遷移とGET検索でもテーマを維持する。

ブラウザーでDarkのDashboard、Users、Forms、Componentsをデスクトップで目視し、フォーム、表、ダイアログ、トースト、ページネーションを確認。390pxではDashboardと日本語比較画面を確認し、横はみ出しなし。アカウントメニューの開閉とEscapeでの閉鎖、日本語トーストの表示も確認。UsersのGET検索で`theme=dark`と検索語の維持を確認。静的チェックは21ページ・642件のローカル参照、主要24色組のコントラスト4.5:1以上でPASS。
