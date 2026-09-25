# Administration UI Design System · 0.1

## 1. Design principles
Modern / Calm / Professional / Compact / Information-dense。Graphite shell、light content、明確なaction accentとsurface contrastで階層を作る。カード、色、装飾を増やして解決しない。Desktop-firstの運用管理画面。

## 2. Architecture principles
Server-rendered HTML first。通常のリンク、GET検索、POST更新、PRG。サーバー応答が真実。JSは補助であり、画面構成や状態の主体にしない。

## 3. Technology constraints
HTML5、CSS、Bootstrap 5.3.8、Bootstrap Icons 1.13.1、Vanilla JS、UTF-8、system font。SPA、store、router、hydration、必須API、frontend buildを導入しない。

## 4. Offline requirements
CSS / JS / fontsを `assets/vendor` へ同梱。CDN、外部画像、analytics、telemetryは禁止。依存を更新する際はLICENSEとアセット参照も確認する。

## 5. Design tokens
実装の唯一の定義は `assets/css/admin-ui.css`。Chart系列のみ `assets/css/charts.css` に置く。下記はGraphite Blueの基準値。

| 分類 | Token / 値 |
|---|---|
| Layout | header 56px / sidebar 232px / content 24px |
| Spacing | `--ui-space-1/2/3/4/5/6/8/12`: 4/8/12/16/20/24/32/48px |
| Typography | body 16px / small 14px / table 15px / controls 15px / title 26px |
| Density | row 52px / control 38px / panel 20px / section gap 24px |
| Radius | small 6px / panel 8px / modal 10px |
| Neutral surfaces | app #edf1f5 / panel・elevated #fff / subtle #f5f7f9 / hover #eaf0f6 / selected #e9f2ff |
| Graphite shell | sidebar #272b30 / header #22262b / hover #343b43 / selected #3a4654 |
| Text | primary #202b36 / secondary #4a5969 / muted #5d6c7c / disabled #798797 / interactive #225da8 |
| Border | default #d7dfe7 / strong #aebbc9 / shell divider #414951 |
| Accent | primary #2866b3 / hover #205696 / subtle #e9f2ff |
| Semantic | success #23704c / warning #885613 / danger #b3363d / info #31688d |
| Focus | #2866b3、3px outline、3px offset |
| Shadow | panel none / popover `0 10px 28px #17253524` / modal `0 20px 56px #101a2c40` / toast `0 14px 38px #17253538` |

部品にはtokenを参照させる。進捗バーのwidthはデータ値なので固定tokenの対象外。行は最小52px、長文や翻訳による拡張は許容する。

## 6. Theme system
Themeは **Neutral Palette / Shell / Accent / Semantic Colors / Chart Palette** に分ける。標準の`html[data-ui-theme="graphite-blue"]`はGraphite shell + light content + blue accent。GrayはNeutral Paletteであり、theme名ではない。Shellは`--ui-surface-shell`等、actionは`--ui-primary`、状態は`--ui-success|warning|danger|info`、chartは`--ui-chart-series-*`で独立させる。`--ui-surface-app/panel/subtle/elevated/shell/hover/selected`は配置と役割を表し、presetは必要なrole tokenだけ上書きする。

比較用のSapphire Blue (`sapphire-blue`) は深い青のshell #213750、冷色app面 #eaf1f8、action #176aa9を組み合わせる。Garnet Red (`garnet-red`) は深い赤系shell #352a31、温かいapp面 #f5eef1、action #8f3b60を組み合わせる。どちらもpanel/elevatedは白のまま、hover/selected面、文字、境界線、フォーカス、chart grid/tooltipをそれぞれのtoneで揃える。Success/Warning/Danger/Infoとchart系列色は共通で、赤系actionは破壊的操作のdangerと役割を分ける。従来のSoft blue/Muted red presetは廃止。Darkは既存の比較用presetとして`data-bs-theme="dark"`も併用する。Reference SiteのURLパラメーターはdemo専用で、実アプリではhostが初期HTMLに属性を描画する。

Aqua Ivory (`aqua-ivory`) はlight shellの比較用preset。参考画像の淡い水色 #eaf6f8、温かいアイボリー #f8f3e5、下部の冷たいneutral #f1f3f8をsidebarの一つの控えめなgradientへまとめ、headerはほぼ白、appは#fbfcfd、panelは白にする。文字は暗いneutral、選択sidebarは淡いmintと細い青のindicator、action/focusは#176d9e。Gradientはsidebarのsurface遷移だけに限定し、装飾やanimationへ拡張しない。Semantic statusとchart系列は独立させる。

Graphite Blue、Sapphire Blue、Garnet Red、Darkもsidebarの背景だけにごく薄い縦gradientを使う。上部をそれぞれ冷たいgraphite・青・plum・青みのcharcoalとし、下部へ向けてわずかに暖色寄りへ移す。中央は従来のshell基準色を保ち、headerは単色のままにする。

Contrast hierarchyは **Level 0 app背景 → Level 1 白いcontent panel → Level 2 graphite shell/selected navigation → Level 3 action/focus blue → Level 4 semantic state**。各levelを境界線だけで区別しない。Accentはprimary action、link、focus、選択行、進捗とchartの主系列に用い、すべての見出し・icon・cardには広げない。Shell textは#f3f6fa、mutedは#b9c3ce。active itemは少し明るいGraphite面、白い文字、細い青のindicatorで示す。

## 7. Semantic colors
success / warning / danger / infoの意味と用途はテーマから独立。primary=主要操作で、Garnet Redではガーネット色のactionを使う。success=正常/成功、warning=注意、danger=失敗/破壊的操作、info=補足。Darkでは各意味色と背景を暗色用に切り替える。状態ラベルを必ず併記し、製品固有の状態語はホストが定義する。

## 8. Typography
system-ui / -apple-system / Segoe UI / Noto Sans / sans-serif。Web fontなし。通常16px、表15px、補助14px、表見出し13px。見出しは26/18/16px。IDと時刻はローカルmonospace 14px。大見出しや過度な太字を避ける。

## 9. Spacing
有限scaleのみ。部品内8–16px、panel20px、section24px。英語の文字幅を想定した操作ボタンの固定幅は使わない。

## 10. Density
Comfortable Enterprise。ボタン/入力38px、表52px基準。複数行や長文では高くして内容を残す。compactのtokenはrow44px/control34px/content20px。切替UIは初版対象外。

## 11. Application shell
header + sidebar + main。CSS Gridのmainはminmax(0,1fr)。tableは自身で横スクロール。デスクトップのsidebarはsticky。

## 12. Header
高さ56px。HeaderもGraphite shellへ統合した。Light headerでは上端に明るい帯ができ、Sidebarと同じnavigation hierarchyとして読みにくかったため。製品識別、workspace、言語比較へのリンク、アカウントメニューを置く。右上の名前・アバター・メニューアイコンを押すと、白いelevated popoverに個人設定とログアウトが現れる。native `details` なのでJSなしでも開け、JSありでは外側クリックとEscapeで閉じる。デモのログアウトはセッションを変更しない説明プレビューとする。

## 13. Sidebar
16px Bootstrap Icon + label。workspaceとdesign referenceを分離。Shell上ではtext/iconを明るいneutralにし、aria-current、細いblue indicator、Graphiteのselected面、font weightで選択を示す。hover/focusを提供。狭幅ではボタンで開閉、JSなしなら常時表示。

## 14. Page header
h1 + description + primary / secondary actions。カードで囲まない。flex-wrapで翻訳と狭幅を許容する。

## 15. Panels and cards
KPI、概要、関連メタデータに使用。全sectionやform/tableをカード化しない。標準panelにshadowなし。通常面はapp < subtle < panelの明度差、overlayはelevated surface + 用途別shadowで区別。popover/dropdownは控えめ、modal/offcanvasは強め、toastは浮遊通知に必要な強さにする。

## 16. Tables
薄いheader、横罫線、zebraなし、右揃えのactions。captionとscopeを付ける。スクロール領域にラベルとtabindex。selectedはcheckbox + 背景、empty/no results/errorは明示。長文は折返し、IDのような不可分情報は横スクロール。

## 17. Search / filter toolbar
label付きGET form。search、select、submit、reset、page refresh。横並びからwrap。advancedはnative details。静的fixtureはURLのクエリーで既存行を絞る。ホストはクエリーを検証し、値を再描画する。

## 18. Forms
input/textarea/select/checkbox/radio/switchはnative HTML + Bootstrap。label必須、helperはaria-describedby、requiredは文字と属性。エラーはsummary + field。Save/Cancelは末尾右側。送信ボタンのname/valueを維持する。

## 19. Native date / time
date / time / datetime-local + form-control。pickerの表示はブラウザー/OSに従う。datetime-localにtimezoneは含まれない。UTC等の解釈をラベルとホスト契約で指定する。

## 20. Buttons
Primaryは標準で明確な青、secondaryは白いsurface、link/ghostは低い視覚重量、dangerは意味色の赤。Sapphire BlueとGarnet Redはshell・content surface・actionを一体で変える。Darkのdangerボタンは明るい状態文字色と分け、白文字が読める濃い赤を使う。標準38px、radius6px。アイコンだけの操作にはaria-label。disabled理由は近くの文章で説明する。

## 21. Bootstrap Icons
ローカルfont、16pxを基準。Refresh=arrow-clockwise / Search=search / Users=people / Settings=gearまたは設定ページのsliders2 / Delete=trash3 / Edit=pencil / Copy=copy / Information=info-circle / Warning=exclamation-triangle。装飾はaria-hidden。

## 22. Status / badges
`ui-status ui-status-success|warning|danger|info|neutral`。色＋文字で意味を伝える。小さな点は補助。状態名・大文字化はホストの文言規約による。

## 23. Modal
Bootstrap Modalを使う共通1個。message=OK、confirm=Cancel/Confirm、destructive=Cancel/Danger action。data属性で翻訳文を渡し、textContentで挿入。確認ではCancelに初期focus、閉じると起点に戻す。フォームはrequestSubmitで継続。

## 24. Offcanvas
read-only details/metadata。編集は通常formまたはmodalへ。閉じるラベルを付ける。JSなし用のフルページリンクを用意する。

## 25. Toast / alert / popover / tooltip
Toast=短命で軽い通知。見落としを避けるため幅440pxを上限に、本文16px・強調線・影を付け、画面右下（狭幅では左右に余白を設けた下部）に表示する。下端の3pxバーが5秒で短くなり、自動で閉じる。マウス・フォーカス中はカウントを止め、離れたら5秒から再開する。Alert=残す必要がある情報。Popover=対象に結びつく追加説明。Tooltip=短い補足。必須情報をpopover/tooltipだけに置かない。

## 26. Loading / empty / error
初期loading、背景refresh、処理中を分ける。初期emptyと検索no resultsを分ける。partial/full failure、unavailable、permission denied、conflictを `patterns.html` で示す。refresh中も既存データは残す。

## 27. Long-running operations
Requested → Processing → Completed / Failed。進捗不明ならspinnerと説明。測定できた場合だけaria-valuenow付きprogressを表示。fixtureのspinnerは状態の展示であり、完了を捏造しない。

## 28. Refresh / polling
標準はGET + manual refresh。更新時刻と鮮度ラベルを提供。pollingは必要な場合のみ5–30秒、バックオフ、非表示時の休止、認証期限対応をホストが実装する。pollingをユーザー活動に数えない。SSE/WebSocketは対象外。

## 29. Bulk actions
対象checkbox、現在ページのselect all、件数、一括bar。検索で隠れた行やdisabled行は対象外。0件では操作を無効化。破壊的操作は確認。ホスト側でIDごとの認可と結果集計を行う。

## 30. Pagination
普通のリンク、aria-current、disabled表現。全一覧に強制しない。実ホストではfilter/sortをクエリーに保持する。fixtureは8件＋2件の2ページ例。

## 31. Responsive
1200px以上で主内容＋補助panel、992px以上でsidebar固定。992px未満でsidebar開閉、toolbar wrap、縦積み。575px以下でform/comparisonを1列、KPIは2列。機能を消さずスクロールで到達可能にする。

## 32. Accessibility
Semantic landmarks、skip link、keyboard focus、label、caption、aria-describedby、role=status/alert、色以外の状態表現、Bootstrapのfocus trap。詳しくはACCESSIBILITY.md。WCAG適合の認証を意味しない。

## 33. Internationalization
必須。UTF-8 / html lang / semantic keys / host側整形。JSに表示文字列を埋め込まない。文字列連結で翻訳文を作らない。日本語と長い翻訳の比較を維持する。I18N.md参照。

## 34. Motion
Bootstrapの控えめなtransitionのみ。prefers-reduced-motionではanimation/transitionを止める。動きのないspinnerにも処理中という文字が残る。

## 35. Dark theme
比較用のDarkは`data-ui-theme="dark"`と`data-bs-theme="dark"`を組み合わせる。surface/text/border/brand/action/semanticを暗色用tokenへ切り替え、フォーム・ダイアログなどBootstrap部品も暗色で描画する。静的デモはページ描画前にURLの`theme=dark`を適用する。標準はGraphite Blueで、OS設定による自動切り替えは行わない。Darkの完成は今回の対象外。

## 36. Visual anti-patterns

Chartの規約は次節と[CHARTS.md](CHARTS.md)も参照。
標準Bootstrap dashboardの流用、巨大KPI、強いshadow、glass、gradient、pill多用、色付きアイコン円、装飾chart、全sectionカード化、SPA化を避ける。VISUAL-ANTI-PATTERNS.mdを参照。

## 37. Visualization
Chart.js 4.5.1はCore dependencyではなく**Optional Visualization Dependency**。Trend / Comparison / Compositionが数値や表より理解しやすくなる場合だけ使用。Line / Bar / Doughnut / Mini trendを標準とし、その他の種類は標準化しない。

`charts.css`の`--ui-chart-grid/axis/label`、`--ui-chart-tooltip-bg/text`、`--ui-chart-series-1`〜`5`、surface、高さtokensを使用。Standard280px、Compact200px、Mini56px。系列はBlue #2866a5、Teal #287a78、Violet #74619b、Orange #a4632c、Rose #a04f68。brand/semantic色から分離し、Dark用にも切り替える。危険操作の赤を無意味な系列色として使わない。

Serverが安全にJSONと翻訳文をHTMLへ埋め込み、Vanilla JSが描画する。初回SSRとManual Refreshが標準。Chart objectの更新は`update('none')`で行い、失敗はpanel内に限定する。HTML title/summary/legend/tableを提供し、重要情報をcanvasやtooltipだけに閉じ込めない。サイズ、i18n、timezone、format、状態、motionの詳細は[CHARTS.md](CHARTS.md)。
