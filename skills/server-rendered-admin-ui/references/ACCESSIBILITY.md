# Accessibility baseline

この初版は基本的な操作可能性を備えたreferenceであり、全支援技術での適合認証ではない。

- `header` / `nav` / `main` / `aside` / `footer`、1つのh1、段階的な見出し。
- Skip to contentからmainへ移動。focus outlineは3px、背景から判別できる青。
- inputはlabel、helper/errorはaria-describedby。required/readonly/disabledをnative属性で表現。
- ログインは公開画面のままキーボードで入力・送信できる構成にし、パスワード表示切替は任意機能。認証失敗を消えるtoastだけで知らせず、サーバーが持続するalertと必要なfield errorを出す。
- field errorはaria-invalid、summaryから該当fieldへリンク。
- 表はcaption、scope=col。横scroll領域に名前とtabindexを付け、キーボードで利用可能にする。
- icon-onlyはaria-label。装飾Bootstrap Iconsはaria-hidden。
- statusは色＋文言。navigationはaria-current＋線/背景/太さ。
- アカウントメニューは名前付きsummaryで開閉。個人設定とログアウトは文字ラベルを持ち、Escapeで閉じるとsummaryにfocusを戻す。
- 成功/軽い通知はrole=status、重要な失敗はrole=alert。toast containerは事前に存在するpolite live region。通常は5秒で閉じるが、マウス・フォーカス中は維持する。閉じるボタンにラベルを付け、残り時間バーは装飾扱いとし、動きを減らす設定では非表示にする。
- modalはlabelledby/describedby、Bootstrap focus trap/Escape、Cancel初期focus、起点復帰。
- offcanvasはheadingとclose label。JSなしの詳細リンクあり。
- dropdownはBootstrapのキーボード操作を利用。無効actionの理由は周囲の文章で説明。
- tooltip/popoverに必須情報を隠さない。popoverはfocus trigger。
- native inputはブラウザー標準の操作を保つ。
- reduced motionではtransition/animationを停止し、処理状態の文字を残す。
- 小画面ではnavを開閉でき、toolbar/長い翻訳をwrap。表は自身の横scrollで機能を維持。

## Review checklist

1. Tab / Shift+Tabで主要リンク・フォーム・dialogへ到達できる。
2. modalでTabが外へ漏れず、Escape/Cancel/OK後に起点へ戻る。
3. checkboxの一括選択とindeterminateが一致する。
4. 390px、768px、992px、1200px以上で主要操作が隠れない。
5. JavaScriptを無効にしてもcontent/nav/form fieldsが読める。
6. 200% zoom、高コントラスト、スクリーンリーダー、タッチ操作は導入先でも追加検証する。

通常文字は4.5:1、大きな文字と操作境界/状態表示は適用対象に応じて3:1を目安に確認する。色tokenを変更したら文字・背景の組合せを再測定する。初版で実施した範囲はVALIDATION.mdに記載する。
