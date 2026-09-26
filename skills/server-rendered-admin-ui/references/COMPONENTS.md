# Component usage

## Optional charts

Chart.jsはCoreではなく、グラフが必要なページだけがロードするOptional Visualization Dependency。[CHARTS.md](CHARTS.md)が詳細契約。

- Trend / Comparison / Compositionの理解が改善する場合だけ使用。装飾や空間埋めには使わず、number / table / status / progressを優先する。
- Line: CPU/Memoryなどの時系列。同じ単位を使い、系列は線種・点形状・ラベルでも区別する。
- Bar: category比較やTop-N。0基準の水平barと折り返す長いラベル。
- Doughnut: Used / Free等の少数構成比。合計・値・割合をHTMLにも表示し、多用しない。
- Mini trend: KPIの傾向を56pxのlineで補足。数値と期間・変化の説明を併記する。
- Loading: 初回のみspinner+翻訳文。背景更新中は既存chartと最終更新日時を残す。
- Empty: 空軸を出さず翻訳済み説明を表示。Error: 不正/欠損JSONやライブラリ不在をpanel内に閉じ込め、通常リンクで再読み込みできる。
- `.ui-chart-panel` / `.ui-chart-frame`と`data-ui-chart` / `data-chart-source`を使い、hostが安全にJSON・summary・legend・tableを描画する。Tooltipはcanvas text、legendは折り返すHTML list。JSなしでも重要情報を読むことができる。

Bootstrapのclass/APIを維持し、`admin-ui.css` で視覚を統一する。デモのcomponent menuから各例へ移動できる。

## Core components

| Component | When to use | When not to use / 注意 |
|---|---|---|
| Table | 複数の同種レコードを列で比較 | 単一オブジェクトの説明にはdl。装飾目的のtableを使わない |
| Search/filter toolbar | GETによる検索条件の指定 | 保存操作をGETにしない。placeholderをlabelにしない |
| Modal | 短い確認・追加・編集など現在文脈内の作業 | 長い文書、大規模フォーム、複数modalの積み重ね |
| Message modal | 明示的な確認が必要な短い情報 | 軽い完了通知にはtoast、残すエラーにはalert |
| Confirm modal | ユーザーに意思確認してからPOST | 認可やサーバー検証の代わりにしない |
| Destructive modal | Delete/Stop等の影響説明と最終確認 | 普通のSaveにdanger色を使わない。影響を曖昧にしない |
| Offcanvas | read-only詳細・metadata、一覧との比較 | 主たる編集画面や必須エラー表示。full-page fallbackを用意 |
| Toast | コピー等の一時的で軽い通知 | 修正必須のエラー、操作の唯一の結果表示 |
| Alert | 保持すべき失敗/警告/重要情報/flash | 全情報をalertで強調しない。重要エラーを自動消去しない |
| Popover | 特定要素に紐づく小さな補足 | 必須説明、複雑な操作、フォーム。focusで表示/blurで閉じる |
| Tooltip | 短い補助説明 | 唯一の操作名や入力条件。hoverのみへ依存しない |
| Dropdown | 行単位の低頻度actionをまとめる | 主操作をすべて隠さない。アイコン起点にaria-label |
| Pagination | データ量がページ分割を要する | 少量データに強制しない。URLにfilterを保持 |
| Native date/time | 日付・時刻・ローカル日時の入力 | timezone付きinstantと同一視しない。外部pickerを必須化しない |
| Progress | 正式な分母/処理済み量がある処理 | 不明な進捗に偽の割合を表示しない |
| Spinner | Loading/Processingの不確定進捗 | 長時間無言で回し続けない。状態説明と失敗/中止経路が必要 |
| Copy | ID/URL/config等の文字列コピー | 重要データの唯一の読み取り方法にしない。失敗時手動案内 |
| Bulk actions | 明示選択した複数行の同種操作 | 非表示行を黙って含めない。0件時disable、対象を再認可 |

## Markup contracts

- `.ui-auth-shell`: ログイン専用のブランド領域とフォーム領域。`assets/css/login.css` を `admin-ui.css` の後に読み、認証処理はhostのPOSTに委ねる。静的例は `login.html` / `login-ja.html`。
- Reference UI の各管理画面では、サイドバーの Workspace に `Sign in` へのリンクを置き、ログイン画面の例へ直接移動できるようにする。実アプリの認証済みナビゲーションに同じリンクが必要かは host が判断する。
- `.ui-page-header`: h1 / description / `.ui-actions`。card wrapper不要。
- `.ui-account-menu`: ヘッダー右上のnative `details`。個人設定への通常リンクとログアウトのプレビューを含む。実アプリのログアウトはホストがPOSTで処理する。
- `.ui-toolbar`: `form method=get`、label付きinput/select、submitとreset link。
- `.ui-table-wrap`: named region + tabindex、table/caption/th[scope=col]。
- `.ui-status-*`: 意味色とlabel。製品のstate vocabularyはホスト定義。
- `#ui-dialog`: ページlayoutに一つ。`data-ui-message` / submitterの`data-ui-confirm`、`data-confirm-*`が入力。
- `.offcanvas`: Bootstrap APIのまま。read-only内容と通常の詳細ページへのリンク。
- `#ui-toast`: 事前に存在するpolite live region内。表示文は`data-ui-toast`から取得。画面右下（狭幅では左右に余白を設けた下部）に幅広く表示し、下端の細いバーで残り時間を示して5秒後に自動で閉じる。マウスやフォーカスがある間は維持し、離れたら5秒から数え直す。閉じるボタンも用意する。
- `data-ui-copy="#id"`: 対象のtextContentをコピー。success/error属性必須。成功時はtoastと同時にボタン内のcopy iconを緑のcheckへ約2秒切り替え、連続コピーでは表示時間を更新する。icon-onlyボタンのaria-labelも成功文に一時変更して戻す。失敗時はcheckを残さずerror通知のみを表示する。
- `data-ui-password="#id"`: 表示/非表示の翻訳ラベル、aria-pressed。アイコンのみの場合は `data-ui-password-icon`、装飾用の `bi-eye`、翻訳済みの `aria-label` を付ける。切替時に `bi-eye-slash` と読み上げ名を更新する。
- `data-ui-bulk`: 同一form内のcheckbox、select all、件数、操作。
- `data-ui-unsaved`: 入力変更後の離脱警告。ブラウザーが文面を決める。resetで解除。

## Modal / keyboard

Bootstrap focus trapとEscapeを使用する。messageはOK、confirmはCancelへ初期focus。閉じた後は起点へ戻す。confirm continuationは元formの `requestSubmit(submitter)` で実行。UI側で権限を確定しない。

## Demo versus reusable assets

再利用の中心は `admin-ui.css` / `admin-ui.js` / semantic HTML。`reference-demo.js` はfixture用でコピーしない。例示データとflashは実データではない。メニューのフォームactionをホストendpointへ変え、サーバーが返す状態を表示する。
