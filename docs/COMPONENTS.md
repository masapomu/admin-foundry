# Component usage

Bootstrapのclass/APIを維持し、`admin-ui.css` で視覚を統一する。デモのcomponent menuから各例へ移動できる。

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

- `.ui-page-header`: h1 / description / `.ui-actions`。card wrapper不要。
- `.ui-toolbar`: `form method=get`、label付きinput/select、submitとreset link。
- `.ui-table-wrap`: named region + tabindex、table/caption/th[scope=col]。
- `.ui-status-*`: 意味色とlabel。製品のstate vocabularyはホスト定義。
- `#ui-dialog`: ページlayoutに一つ。`data-ui-message` / submitterの`data-ui-confirm`、`data-confirm-*`が入力。
- `.offcanvas`: Bootstrap APIのまま。read-only内容と通常の詳細ページへのリンク。
- `#ui-toast`: 事前に存在するlive region内。表示文は`data-ui-toast`から取得。
- `data-ui-copy="#id"`: 対象のtextContentをコピー。success/error属性必須。
- `data-ui-password="#id"`: 表示/非表示の翻訳ラベル、aria-pressed。
- `data-ui-bulk`: 同一form内のcheckbox、select all、件数、操作。
- `data-ui-unsaved`: 入力変更後の離脱警告。ブラウザーが文面を決める。resetで解除。

## Modal / keyboard

Bootstrap focus trapとEscapeを使用する。messageはOK、confirmはCancelへ初期focus。閉じた後は起点へ戻す。confirm continuationは元formの `requestSubmit(submitter)` で実行。UI側で権限を確定しない。

## Demo versus reusable assets

再利用の中心は `admin-ui.css` / `admin-ui.js` / semantic HTML。`reference-demo.js` はfixture用でコピーしない。例示データとflashは実データではない。メニューのフォームactionをホストendpointへ変え、サーバーが返す状態を表示する。
