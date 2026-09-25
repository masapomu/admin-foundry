# Sprint completion report

1. **Directory structure** — `demo/`、`assets/css`、`assets/js`、`assets/vendor`、`docs/`、`tests/`。主8画面＋index/詳細/2ページ目/送信契約を含む20 HTML。
2. **README** — 目的、開き方、技術、offline、SSR、theme/i18n、今後の抽出方針。
3. **AGENTS.md** — 汎用Design Lab、SSR/no SPA、offline/i18n、tokens、視覚整合、文書更新の最小規約。
4. **DESIGN-SYSTEM.md** — 指定36分野の原則・実装値・用途。
5. **SERVER-RENDERED-PATTERNS.md** — GET/POST/PRG、validation、flash、確認、query、progressive enhancement、polling。
6. **I18N.md** — runtime非依存、semantic keys、翻訳済みdata属性、UTF-8/lang、書式、伸長、日本語、hostの責務。
7. **COMPONENTS.md** — 各部品のWhen to use / When not to useとmarkup契約。
8. **Design tokens** — 56px header / 232px sidebar / 24px content / body14px / title26px / row48px / control36px / radius4–6px。spacingは4/8/12/16/20/24/32/48px。
9. **Gray Theme** — theme #343b45、active #e0e3e7、sidebar #f0f1f3。blue/navy/green/purpleのtoken overrideも定義。
10. **Semantic colors** — primary #315fbd、success #23704c、warning #885613、danger #b3363d、info #31688d。テーマから独立。
11. **Bootstrap** — 5.3.8、CSS/JS bundle/maps/LICENSE、Popper LICENSEを同梱。
12. **Bootstrap Icons** — 1.13.1、CSS/woff/woff2/LICENSEを同梱。
13. **Dashboard** — 4 KPI、service table、recent activity、summary、empty、partial error。
14. **Users** — GET search/filter、status、row dropdown、Add link、3 modal、offcanvas、bulk、pagination。
15. **System** — service/resource、warning、stop confirm、requested/processing/completed/failed、manual refresh/freshness。
16. **Logs** — 20行、level/source filter、advanced datetime、長文、日本語、no results/error。
17. **Forms** — GET/POST-style、label/helper、validation、readonly/disabled、全標準入力、native日時、flash、未保存警告。
18. **Components** — ボタン、アイコン、alert/toast、tooltip/popover、modal/offcanvas/dropdown/collapse、pagination/progress/spinner/copy。
19. **Patterns** — loading/refreshing/processing/success/empty/no results/partial/full failure/disconnected/stale/read-only/permission/conflict/unsaved/unavailable/destructive。
20. **i18n** — English、日本語、長いドイツ語訳を同一部品で比較。日本語table/search/dialogと日時/数値例。
21. **Modal** — 1つの共通Bootstrap Modalをdata属性で再利用。確認後は元submitterによる通常のrequestSubmit。
22. **Toast / Alert / Popover** — 一時通知 / 保持情報 / 対象に付随する補足を分離。Tooltipには重要情報を閉じ込めない。
23. **Toolbar** — label付きGET form、search/select/reset、通常リンクのrefresh、native detailsのadvanced。
24. **Native Date/Time** — date/time/datetime-local + form-control。外部pickerなし。
25. **Offline validation** — 全参照ローカル、外部通信不可CSP下で動作。20ページ473参照の静的チェックPASS。詳細条件/未実施範囲はVALIDATION.md。
26. **Accessibility** — landmarks/skip/focus/labels/ARIA/table semantics/reduced motion。modalのfocus trap/復帰を操作確認。主要8色組は4.5:1以上。
27. **Japanese** — 氏名、比較部品、table、GET検索、日本語modalを実画面で確認。
28. **Visual fixes** — 表の縦scroll/density、menu clipping、focus復帰、bulk対象、日時境界、390px header、modal lang、details対象を修正。
29. **Future refinement** — 人間による密度/文言評価、追加ブラウザー・支援技術・zoom/RTL/全日本語文書検証。今回の終了後は自動で進めない。
30. **Git** — 1つの初期commitへまとめる。message: `feat: initialize server-rendered admin ui design lab`。確定hashは完了メッセージまたは `git log -1` を参照。

静的デモは実際の保存・削除・停止を行わず、操作結果をプレビューと明示する。Skill/Pluginパッケージ、backend、公開は対象外。
