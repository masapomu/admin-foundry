# Visual anti-patterns

## Avoid

- stock Bootstrap dashboardの見た目をそのまま採用
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

14pxの本文、26pxのページ見出し、48px基準の表、4–6pxのradius、有限spacing scale、薄い罫線、白/grayのsurface。Primaryとsemantic colorを明確に分ける。カードは意味のあるまとまりだけに使う。

変更時はDashboardだけで判断せず、Users/Logsの情報密度、日本語/長文、Formsの検証エラー、狭幅、modal/offcanvasを一緒に確認する。
