# Server-rendered patterns

PHP、ASP.NET/Razor、Perl CGI/PSGI、Python templatesなどへ共通に適用する契約。特定のフレームワーク、JSON API、ルーターは要求しない。

## Sign-in

[`login.html`](../assets/reference-ui/login.html) と [`login-ja.html`](../assets/reference-ui/login-ja.html) は、Glasswalkで使われた二領域レイアウトを汎用化した認証入口の静的Reference。`admin-ui.css` のtheme tokenに追加の [`login.css`](../assets/css/login.css) を重ねる。ブランド文言、ロゴ、認証方法、言語選択の保存方法はhostが差し替える。静的版の送信はfixtureであり、認証やセッション作成をしない。

実アプリでは `GET /login` が翻訳済みHTML、実際のCSRF token、適切なフォームactionを描画し、`POST /login` がCSRF、レート制限、認証をサーバー側で検証する。成功時はセッションIDを更新して安全な遷移先へ303、失敗時は一般的なエラーをformと共に再描画する。パスワードをHTMLへ再出力せず、詳細な失敗理由でアカウントの存在を明かさない。セキュアなcookie設定とセッション期限はhostの責務。静的版のsubmitは送信を防ぐため `ui-enhanced-only` だが、実アプリではこのclassと `data-demo-post` を外してJSなしでもPOSTできるようにする。表示/非表示の切替は任意の補助機能。言語切替をPOSTにするならCSRFと戻り先の検証をhostが担当し、公開ログイン画面の選択肢が認証済みAPIを前提にしないようにする。

## GET page / search / filter

```text
GET /users?q=tanaka&status=enabled&type=operator&page=1
→ authorize → validate query → query data → render full HTML
```

```html
<form method="get" action="/users">
  <label for="q">Search users</label>
  <input class="form-control" type="search" id="q" name="q" value="">
  <button class="btn btn-primary" type="submit">Search</button>
  <a href="/users">Reset</a>
</form>
```

ラベルとvalueはエスケープ済みの翻訳/入力値。status/type/pageは許可値へ検証する。ページ変更時はfilter/sortを維持し、新規検索時はpageをリセット。refreshは現在のcanonical URLへ普通のGET。Reload / Back / Bookmark / Deep linkはブラウザーに任せる。

fixtureの `reference-demo.js` は、GET後にURLのqueryから既存HTML行を隠すだけ。新しいHTMLを生成しない。ページングは別の静的ページで例示し、filter付き検索は1ページ目のfixtureが対象。実装先ではクエリー結果と件数をサーバーが出力する。

## POST and PRG

```text
GET /users/edit?id=usr_001
POST /users/update
  → authorize + CSRF + validate + compare revision
  → commit operation
  → 303 See Other: /users
GET /users
  → render translated flash + authoritative table
```

```html
<form method="post" action="/users/update">
  <!-- Host emits a real CSRF token, resource ID and revision here. -->
  <label for="name">Display name</label>
  <input class="form-control" id="name" name="name" required>
  <button type="submit" name="operation" value="save">Save</button>
</form>
```

CSRF token、認証/認可、処理の冪等性、監査はhost責務。GETで変更しない。POST成功前に一覧を先行更新しない。static demoに実際のtoken/endpointは含まれない。

ログアウトもGETリンクでセッションを変更せず、ホスト側のCSRF保護付きPOSTでセッションを無効化してからサインイン画面へ遷移する。静的Reference Siteのメニューは動作プレビューのみで、セッションを変更しない。

## Validation errors

POSTに問題があれば、ホストの規約に従い400/422等でformを再描画する。安全な入力値を維持し、エラーsummaryから該当inputへリンクする。fieldは `is-invalid`、`aria-invalid="true"`、`aria-describedby`。秘密値は再出力しない。native/client validationは補助で、サーバー側検証を省かない。

競合なら409等と共に最新revisionとの差分確認へ誘導する。保存しなかったこと、再取得手順を表示する。

## Flash messages

成功後のGETでsession等から一回限りの翻訳済みflashを取り出し、HTML alertとして描画する。重要な失敗は自動で消さない。軽い成功通知をtoastにもできるが、JSなしでも確認できるHTMLを残す。

```html
<div class="alert alert-success" role="status">Configuration was saved.</div>
<div class="alert alert-danger" role="alert">Configuration could not be saved.</div>
```

表示文はサーバー翻訳済み。文字列をJSの文言辞書に複製しない。

## Confirm before POST / destructive action

共通dialog markupは `assets/reference-ui/users.html` の `#ui-dialog` をhost layoutへ一度組み込む。

```html
<form method="post" action="/users/delete">
  <!-- CSRF / ID / revision are host-generated. -->
  <button type="submit" name="operation" value="delete"
    class="btn btn-danger"
    data-ui-confirm data-confirm-kind="danger"
    data-confirm-title="Delete user?"
    data-confirm-message="The user will lose access. This cannot be undone."
    data-confirm-cancel="Cancel" data-confirm-button="Delete">Delete</button>
</form>
```

submitイベントを一時停止し、確認後に元のsubmitterで `requestSubmit`。name/value、formaction/formmethod等のブラウザー契約を保持する。再確認を避ける一時ガードは送信中だけ。キャンセル時は送信しない。入力はtextContentで入れ、任意HTMLを解釈しない。

確認は安全境界ではない。JSなしでもPOSTは成立するので、必須確認がある場合はホストが確認GETページ→最終POSTを提供する。アプリに応じてtoken/権限/revisionを再検証する。

## Progressive enhancement

組み込み順: Bootstrap CSS → admin-ui.css、Bootstrap bundle → admin-ui.js。HTML自身にmain/table/form/linkが存在する。モーダル・dropdown・offcanvas等のJS専用起点は `ui-enhanced-only` とし、通常リンクを `ui-nojs` に用意する。

`ui-js` はBootstrapがロードされた場合だけ付く。Bootstrap JSが失敗してもnavigation/contentは残る。編集内容はdocument内のformに置き、global storeを導入しない。

### Static demo integration boundary

`data-demo-post` / `reference-demo.js` はプレビュー専用。実アプリへコピーする際は、両方とデモ説明を外して正しいform actionを設定する。デモの `ui-enhanced-only` submit表示は、backendを持たないための保護。本番ではsubmitをJSなしでも表示し、必要ならサーバー確認画面へ接続する。

static demoのno-JS経路はPOST contractの説明へ進む。データ保存を静的ファイルだけで再現しようとしない。

## Optional polling

標準はmanual refresh。5–30秒程度のstatus用途に限定し、hostの認証・認可済みendpointと局所的なDOM更新で追加可能。実装する場合は同時リクエスト抑制、可視状態、失敗時backoff、停止/再開、最終更新時刻、stale/disconnectedを扱う。pollをuser activityに数えてsessionを延長しない。既存データをloadingで覆わない。標準にはfetch、SSE、WebSocketを含めない。

## Long-running / bulk

長時間処理はPOSTでrequestedを確定し、その後のGETで状態を表示。unknown progressに割合を作らない。bulk対象はフォームの繰り返しname=idsとして送信。ページ全体/検索結果全体の選択範囲は明示し、各IDを再認可する。部分失敗は成功対象と失敗対象を区別する。
