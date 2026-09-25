# Chart patterns

## 1. Purpose
Chartは装飾ではなく、Trend / Comparison / Compositionを数値や表だけより明確に伝える場合に使う。単一の現在値はnumber、一覧はtable、状態はstatus、既知の完了率はprogressを優先する。

## 2. Library Choice
Chart.js **4.5.1**（MIT）。2026-09-26に[公式releases](https://github.com/chartjs/Chart.js/releases)と配布packageを確認した。公式npm packageのUMD/browser buildを固定版で同梱。実行時のNode/npm/buildは不要。[公式script-tag integration](https://www.chartjs.org/docs/latest/getting-started/integration.html)に従う。

配置は`assets/vendor/chartjs/chart.umd.min.js`、source map、`LICENSE.md`、同梱@kurkle/color 0.3.2の`COLOR-LICENSE.md`。更新元とハッシュはTHIRD-PARTY.md参照。

## 3. Optional Dependency Policy
CoreはBootstrap / Bootstrap Icons / Vanilla JS。Chart.js、`charts.css`、`admin-charts.js`は**Optional Visualization Dependency**。`charts.html`と`dashboard.html`だけが読み込む。Shellの共通JSからロードしない。ほかのページはcanvasもライブラリも必要としない。

## 4. Chart Selection Guide
| 判断 | Pattern | 上限 |
|---|---|---|
| 時間による変化 | Line | 5系列、500点/系列 |
| 項目の比較・Top-N | Horizontal bar | 原則4–8項目、0基準 |
| 全体に対する少数の内訳 | Doughnut | 1系列、2–5区分、非負値 |
| KPIの短い傾向 | Mini line | 原則1系列、要約併記 |

「Dashboardだから」「余白を埋めたい」は使用理由にしない。

## 5. Visual Rules
system font、ラベル13px、線2px、薄いgrid 1px。背景は既存panel、radius 6px、強いshadow・gradient・3Dなし。線は小さなpoint、穏やかな補間、fillなし。欠測`null`は線をつながない。

## 6. Chart Tokens
`assets/css/charts.css`に以下を定義。ページだけが読み込み、全体のfont/spacing/color tokensを参照する。

| Tokens | 役割 |
|---|---|
| `--ui-chart-surface` | panel背景 |
| `--ui-chart-grid`, `--ui-chart-axis`, `--ui-chart-label` | grid・軸名・ラベル |
| `--ui-chart-tooltip-bg`, `--ui-chart-tooltip-text` | tooltipの明暗 |
| `--ui-chart-series-1` ～ `--ui-chart-series-5` | 定量系列palette |
| `--ui-chart-height`, `--ui-chart-height-compact`, `--ui-chart-height-mini` | 高さ280 / 200 / 56px |

## 7. Colors
light系列色はblue #2866a5、teal #287a78、violet #74619b、orange #a4632c、rose #a04f68。Darkは対応する明るい色へ切り替える。danger redを無意味な系列に使わない。Graphite Blue/Soft blue/Muted redでもpaletteは共通で、application accentとsemantic colorsから独立する。navy/green/purpleにもこのpaletteを適用可能。テーマ属性は初期描画前にhostが出力する。動的変更時は`AdminCharts.refresh(canvas)`でtokenを読み直す。

## 8. Line Chart
CPUとMemoryの同一percentage scaleを例示。CPUはsolid/circle、Memoryはdashed/diamond。異なる単位を同一軸に混ぜない。初版は複雑なdual axisを提供しない。等間隔の観測ラベルをcategory scaleに置く。不等間隔を等間隔と誤認させないよう、hostが集約し欠測を`null`として表す。日時adapterは追加しない。

## 9. Bar Chart
Requests by workflowの比較。長いラベルはhost JSONの`\n`で意味のある位置に分ける。水平barにして、カテゴリ名を省略せず元データ表にも併記する。カテゴリ数が多い場合はhostでTop-Nに絞り、残りの扱いを説明する。

## 10. Doughnut Chart
Used / Freeの容量配分のみを例示。合計・各値・割合をHTMLで併記する。ゼロ合計、全欠測はEmpty。負数はError。細かい順位比較はbarへ変更する。色だけの判別を要求しない。

## 11. Mini Trend
KPIの1,248 requests/minに7時点のlineを添える。56px固定、軸/tooltip/legendは省略。現在値と期間・変化をHTMLで説明し、元データ表も提供する。意味のない上向きの線を飾りとして置かない。

## 12. Size / Layout
Standard 280px（575px以下で260px）、Compact 200px、Mini 56px。親`.ui-chart-frame`をrelativeにし、Chart.js `responsive:true` / `maintainAspectRatio:false`で幅に追従する。canvas属性でCSSの高さを競合させない。2列は既存`.ui-two`を利用し、狭幅では1列。表だけが必要に応じて横スクロールする。

## 13. Server-rendered Data Pattern
ServerがHTML、翻訳済みJSON、summary、legend、table、最終更新日時を一緒に描画する。PHP / ASP.NET / Perl等のhostが担当し、browser API取得は必須にしない。

```html
<figure class="ui-chart-panel" data-chart-panel>
  <figcaption><h2 id="cpu-title">CPU usage</h2><p id="cpu-summary">Current: 28%. Peak: 31%.</p></figcaption>
  <p data-chart-fallback>Read the summary and source data if the chart is unavailable.</p>
  <div class="ui-chart-frame" hidden>
    <canvas id="cpu" data-ui-chart="line" data-chart-source="#cpu-data"
      role="img" aria-labelledby="cpu-title" aria-describedby="cpu-summary"></canvas>
  </div>
  <p data-chart-empty hidden>No data available.</p>
  <p role="status" data-chart-error hidden>Chart unavailable. <a href="charts.html">Refresh</a></p>
  <!-- Host-rendered table and timestamp belong here. -->
  <script type="application/json" id="cpu-data">
  {"locale":"en-US","labels":["10:00","10:05","10:10"],
   "datasets":[{"label":"CPU","data":[0.22,0.31,0.28]}],
   "format":{"style":"percent","maximumFractionDigits":0},"maximum":1,
   "categoryAxis":"UTC","valueAxis":"Utilization"}
  </script>
</figure>
```

**host application must safely JSON-encode chart data.** scriptのtypeがJSONでもHTML parserは`</script>`で閉じる。安全なserializerを使い、JSON内の`<`を`\u003c`へ変換する（必要に応じ`>` / `&`もescape）。HTML entity encodingはJSON stringの代用にならない。文字列を連結してJSONを作らない。HTMLのtitle/summary/legend/tableも別途適切にHTML-escapeする。悪意あるラベルからDOM、HTML、callback、option objectを生成しない。

## 14. Declarative Integration
```html
<link rel="stylesheet" href="../assets/css/charts.css">
<script defer src="../assets/vendor/chartjs/chart.umd.min.js"></script>
<script defer src="../assets/js/admin-charts.js"></script>
```

`data-ui-chart="line|bar|doughnut|mini"`とID形式の`data-chart-source="#..."`を指定する。sourceは同じdocumentの`script[type=application/json]`に限る。ラッパーはlabel配列、series数、値の型・長さ・finiteを検証し、Chart.jsへ許可したプロパティだけを渡す。任意options、plugin、関数、HTMLをJSONから取り込まない。参照不能・不正JSON・不正データ・ライブラリ不在はそのpanelだけError。JSON sourceが空の配列ならEmpty。

## 15. i18n
title/summary/legend/state/retryはHTML、dataset/axis/tooltip用labelはJSONで翻訳する。共通JSに表示文言を置かない。`locale`は例でen-US / ja-JP、未指定なら最寄りの`lang`。実行時の翻訳エンジンはない。

## 16. Date / Time
canonical timestampとtimezone conversionはhost責務。英語例09:00–10:00 UTCと日本語例18:00–19:00 JSTは同じ観測時刻。locale-awareな表示文字列とtimezone説明をhostが準備する。category scaleは表示文字列を日時として解析しない。

## 17. Number Formatting
小さな`Intl.NumberFormat` metadataだけを受け取る。`style`はdecimal / percent / unit、`unit` / `unitDisplay` / `notation` / minimum・maximumFractionDigitsを許可。integerはmaximumFractionDigits:0、decimalは桁数指定、percentは0–1の値、large numberはnotation:compact。bytesはhostでGiB等へ換算して翻訳済みsuffixを付けられる。durationはunit:millisecond / second等。例: `{"style":"unit","unit":"millisecond","maximumFractionDigits":1}`。複雑なduration、桁区切り方針、単位換算、丸め、元データ表の数値整形はhost責務。source tableは十分な精度を保ち、compact tooltipだけに正確な値を閉じ込めない。

## 18. Tooltip
Canvas上にlabel/valueを文字として表示する。raw HTMLは使わない。13px、padding10px、radius4px、テーマ対応の高contrast。miniでは無効。hoverできない利用者もsummary/tableで同じ情報を読める。長すぎるdataset名はhostで簡潔にし、正式名をlegend/tableに残す。

## 19. Legend
1系列は省略可。多系列はHTML listをhostが描画し、折り返しを許可する。系列順をJSONと合わせ、lineは実線/破線とpoint shapeも併用。Doughnutは区分名・数値・比率をすべて記載する。canvas内legendは無効。初版legendは読み取り専用で、クリックによる非表示操作は提供しない。

## 20. Accessibility
Canvasは`role=img`とtitle/summaryへのARIA参照を持つ。HTML summaryと元データ表はJSなしでも読める。重要値をChart/tooltipだけで提供しない。表はnative detailsでキーボード開閉可能。系列を色だけに依存させず、line style/point/labelを併用する。状態には文字を伴わせる。

## 21. Loading / Empty / Error
初回Loadingはspinner+翻訳済みstatusをhostが描画。ReferenceのLoadingは静的な状態展示であり取得処理を偽装しない。Emptyは空軸ではなく説明を表示する。Errorはそのpanel内の翻訳済み文言と通常リンクで再読み込み可能。malformed JSONの実例をcharts.htmlで展示。失敗してもほかのchart、table、pageを維持する。背景更新失敗時は直前のchartを残し、`data-chart-state="stale"`とerrorを表示する。

## 22. Refresh / Polling
Defaultは初期SSR + 通常リンクのManual Refresh。自動polling、fetch、WebSocket、SSEは実装しない。hostが更新する場合は安全に取得・検証したJSON sourceとHTML summary/table/timestampを同期し、`AdminCharts.refresh(canvas)`を呼ぶ。既存instanceのdata/optionsを置換し`update('none')`する。declarationのtypeは同じcanvasの生存中に変えない。optional pollingの間隔・停止・鮮度はhost方針。background refreshではchartを隠してspinnerに戻さない。

DashboardはActive sessionsのCompact lineを1つ追加し、KPI/table/statusの比重を維持。Systemは既存のresource値・状態・鮮度で判断できるためchartを追加しなかった。

## 23. Motion
Chart animationは初回も更新も無効。reduced-motionでも同じ静かな描画。Loading spinnerは既存のreduced-motion CSSで止まり、状態文が残る。

## 24. Anti-patterns
3D、gradient、rainbow、巨大chart、意味のないdoughnut、legend過多、10+系列、fake realtime/progress、danger redの無意味な系列利用、Chartのみの重要情報は禁止。Sankey / Radar / Polar / maps / heatmaps / gauge中心のdashboard / candlestick / scientific plots / exportは標準化しない。ほかのchart library、API、analytics engine、Skill/Plugin化はこのSprintの対象外。
