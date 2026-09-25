# Administration UI Design System · 0.1

## 1. Design principles
Modern / Calm / Professional / Compact / Information-dense。タイポグラフィ、余白、整列、控えめなsurfaceで階層を作る。カード、色、装飾を増やして解決しない。Desktop-firstの運用管理画面。

## 2. Architecture principles
Server-rendered HTML first。通常のリンク、GET検索、POST更新、PRG。サーバー応答が真実。JSは補助であり、画面構成や状態の主体にしない。

## 3. Technology constraints
HTML5、CSS、Bootstrap 5.3.8、Bootstrap Icons 1.13.1、Vanilla JS、UTF-8、system font。SPA、store、router、hydration、必須API、frontend buildを導入しない。

## 4. Offline requirements
CSS / JS / fontsを `assets/vendor` へ同梱。CDN、外部画像、analytics、telemetryは禁止。依存を更新する際はLICENSEとアセット参照も確認する。

## 5. Design tokens
実装の唯一の定義は `assets/css/admin-ui.css`。下記は初版の値。

| 分類 | Token / 値 |
|---|---|
| Layout | header 56px / sidebar 232px / content 24px |
| Spacing | `--ui-space-1/2/3/4/5/6/8/12`: 4/8/12/16/20/24/32/48px |
| Typography | body 16px / small 14px / table 15px / controls 15px / title 26px |
| Density | row 52px / control 38px / panel 20px / section gap 24px |
| Radius | small 4px / medium 6px |
| Surface | app #f7f8f9 / panel #fff / sidebar #f0f1f3 |
| Text | primary #24282f / secondary #555d68 / muted #626b77 |
| Border | default #dce0e5 / strong #c4cad2 |
| Theme | #343b45 / hover #252b33 / active #e0e3e7 / subtle #e9ecef |
| Action | primary #315fbd / hover #264c99 / subtle #edf3ff |
| Semantic | success #23704c / warning #885613 / danger #b3363d / info #31688d |
| Focus | #315fbd、3px outline、3px offset |

部品にはtokenを参照させる。進捗バーのwidthはデータ値なので固定tokenの対象外。行は最小52px、長文や翻訳による拡張は許容する。

## 6. Theme system
`html[data-ui-theme="gray"]` が標準。Soft blueはbrand #365c82と淡い青灰色のsurface、Muted redはbrand #86515aと淡い赤灰色のsurfaceを使う。Muted redではprimary action・リンク・focusも同じ鈍い赤に揃える。Darkはapp #15191f、panel #20262e、sidebar #1b222b、文字 #edf2f7、accent #91b8e8を基調とし、`data-bs-theme="dark"`も設定する。Darkでは状態色を暗い背景向けに明るくし、危険操作のボタンには白文字とのコントラストを確保した別の濃い赤を使う。navy/green/purpleもbrand tokensを差し替える。Reference SiteのURLパラメーター比較はdemo専用で、実アプリではhostが属性を描画する。

## 7. Semantic colors
success / warning / danger / infoの意味と用途はテーマから独立。primary=主要操作で、Muted redではbrand色を使う。success=正常/成功、warning=注意、danger=失敗/破壊的操作、info=補足。Darkでは各意味色と背景を暗色用に切り替える。状態ラベルを必ず併記し、製品固有の状態語はホストが定義する。

## 8. Typography
system-ui / -apple-system / Segoe UI / Noto Sans / sans-serif。Web fontなし。通常16px、表15px、補助14px、表見出し13px。見出しは26/18/16px。IDと時刻はローカルmonospace 14px。大見出しや過度な太字を避ける。

## 9. Spacing
有限scaleのみ。部品内8–16px、panel20px、section24px。英語の文字幅を想定した操作ボタンの固定幅は使わない。

## 10. Density
Comfortable Enterprise。ボタン/入力38px、表52px基準。複数行や長文では高くして内容を残す。compactのtokenはrow44px/control34px/content20px。切替UIは初版対象外。

## 11. Application shell
header + sidebar + main。CSS Gridのmainはminmax(0,1fr)。tableは自身で横スクロール。デスクトップのsidebarはsticky。

## 12. Header
高さ56px。製品識別、workspace、言語比較へのリンク、アカウントメニュー。右上の名前・アバター・メニューアイコンを押すと、個人設定とログアウトが現れる。native `details` なのでJSなしでも開け、JSありでは外側クリックとEscapeで閉じる。デモのログアウトはセッションを変更しない説明プレビューとする。

## 13. Sidebar
16px Bootstrap Icon + label。workspaceとdesign referenceを分離。aria-current、左の線、背景、font weightで選択を示す。hover/focusを提供。狭幅ではボタンで開閉、JSなしなら常時表示。

## 14. Page header
h1 + description + primary / secondary actions。カードで囲まない。flex-wrapで翻訳と狭幅を許容する。

## 15. Panels and cards
KPI、概要、関連メタデータに使用。全sectionやform/tableをカード化しない。標準panelにshadowなし。dialog/dropdownには弱いshadowのみ。

## 16. Tables
薄いheader、横罫線、zebraなし、右揃えのactions。captionとscopeを付ける。スクロール領域にラベルとtabindex。selectedはcheckbox + 背景、empty/no results/errorは明示。長文は折返し、IDのような不可分情報は横スクロール。

## 17. Search / filter toolbar
label付きGET form。search、select、submit、reset、page refresh。横並びからwrap。advancedはnative details。静的fixtureはURLのクエリーで既存行を絞る。ホストはクエリーを検証し、値を再描画する。

## 18. Forms
input/textarea/select/checkbox/radio/switchはnative HTML + Bootstrap。label必須、helperはaria-describedby、requiredは文字と属性。エラーはsummary + field。Save/Cancelは末尾右側。送信ボタンのname/valueを維持する。

## 19. Native date / time
date / time / datetime-local + form-control。pickerの表示はブラウザー/OSに従う。datetime-localにtimezoneは含まれない。UTC等の解釈をラベルとホスト契約で指定する。

## 20. Buttons
PrimaryはGray/Soft blue/Darkで青、Muted redで鈍い赤。secondaryはsurface色、dangerは状態を示す赤。Darkのdangerボタンは明るい状態文字色と分け、白文字が読める濃い赤を使う。標準38px、radius4px。アイコンだけの操作にはaria-label。disabled理由は近くの文章で説明する。

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
比較用のDarkは`data-ui-theme="dark"`と`data-bs-theme="dark"`を組み合わせる。surface/text/border/brand/action/semanticを暗色用tokenへ切り替え、フォーム・ダイアログなどBootstrap部品も暗色で描画する。静的デモはページ描画前にURLの`theme=dark`を適用する。標準はGrayのままで、OS設定による自動切り替えは行わない。

## 36. Visual anti-patterns
標準Bootstrap dashboardの流用、巨大KPI、強いshadow、glass、gradient、pill多用、色付きアイコン円、装飾chart、全sectionカード化、SPA化を避ける。VISUAL-ANTI-PATTERNS.mdを参照。
