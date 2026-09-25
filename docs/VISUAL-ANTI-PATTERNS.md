# Visual anti-patterns

## Avoid

- stock Bootstrap dashboardの見た目をそのまま採用
- 薄いGrayだけでshell、app、panelの区別がつかないwashed-out UI
- surfaceの差が弱く、境界線だけにvisual hierarchyを頼る
- primary actionやactive navigationのaccentが弱く見つけにくい
- すべてのicon、見出し、数値、cardにaccentを塗る
- semantic stateをneutral一色にする、またはchartを装飾的なrainbowにする
- gradient/glass、多すぎるshadow/animation
- 巨大KPI、巨大見出し、marketing向けの大余白
- pill形状だらけ、ランダムな色付きアイコン背景
- 意味のないchart、暗いnavyとneonの装飾
- page header / table / form / sectionを機械的にカード化
- 色だけでstateを表現
- 英語幅に固定した操作button
- placeholderだけの入力label
- 重要情報をtooltipだけで伝える
- JSでHTML全体を生成し、SPAを再実装

## Prefer

16pxの本文、26pxのページ見出し、52px基準の表、6–10pxの用途別radius、有限spacing scale。Graphite BlueではGraphite shellと明るいcontentを分け、primary actionとselected stateへblueを用いる。Semantic/Chart paletteはaccentから独立させ、薄い罫線だけに構造を任せない。Soft blue、Muted red、Darkの比較でも同じ情報密度を維持する。カードは意味のあるまとまりだけに使う。

変更時はDashboardだけで判断せず、Users/Logsの情報密度、日本語/長文、Formsの検証エラー、狭幅、modal/offcanvasを一緒に確認する。
