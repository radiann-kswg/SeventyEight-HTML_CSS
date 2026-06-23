# GitHub Pages デプロイ失敗 調査・修正方針（提案ログ）

- 対象リポジトリ: **SeventyEight-HTML_CSS**（運命線探偵78 トップサイト）
- 調査日: 2026-06-23
- 種別: 調査・提案のみ（コード修正・コミットは未実施）
- 検出元: GitHub 通知メール（「Deploy to Pages」失敗 / 6-10・6-01）

---

## 1. 結論（最有力原因）

**同一リポジトリに「Pages へデプロイするワークフロー」が 2 本同居しており、push のたびに同じ Pages デプロイ枠を奪い合って失敗している。**

`.github/workflows/` 配下:

| ファイル | name | トリガ | concurrency group | environment |
|---|---|---|---|---|
| `static.yml` | Deploy static content to Pages | push:main / 手動 | `pages` | `github-pages` |
| `jekyll-gh-pages.yml` | Deploy Jekyll with GitHub Pages... | push:main / 手動 | `pages` | `github-pages` |

両方が `main` への push で起動し、同じ `concurrency: group: "pages"` と `github-pages` environment を取り合う。GitHub Pages は 1 リポジトリにつき有効なデプロイ元が 1 つのため、片方が成功しても **もう片方は必ず失敗** する。失敗開始日（6-10）は `jekyll-gh-pages.yml` 追加日（ファイル更新 6/10 09:54、`Create CNAME` 前後）と一致する。

---

## 2. 補足的なリスク要因

### 2-1. Jekyll ビルドは本サイトに不要かつ有害になり得る
本サイトは Vanilla の静的 HTML / SASS（VS Code 拡張で CSS 自動生成）であり、Jekyll ビルドは不要。`jekyll-build-pages` は次の場合にビルド自体が失敗する:
- HTML/テキスト中に Liquid 構文（`{{ }}` / `{% %}`）と解釈される記述がある
- アンダースコア始まりのディレクトリ等、Jekyll の規約と衝突する構成がある

`static.yml` 方式（リポジトリをそのまま artifact 化）なら Jekyll 処理を経由しないため、この種の失敗を回避できる。

### 2-2. action バージョンの不一致
- `static.yml`: `upload-pages-artifact@v3` +（同一 job 内）`deploy-pages@v4`
- `jekyll-gh-pages.yml`: `upload-pages-artifact@v3` +（別 job）`deploy-pages@v5`

`deploy-pages@v5` は 2026 年時点で存在する系列だが、2 本のワークフローで世代が割れているのは管理上の混乱要因。残す 1 本に統一する。

### 2-3. カスタムドメイン（CNAME）
`CNAME = fateline-investigator78.com`。`static.yml` は `path: '.'` でリポジトリ全体をアップロードするため CNAME は artifact に含まれ問題なし。残す側を `static.yml` にすれば従来通りカスタムドメインが維持される。Settings → Pages 側の Custom domain 設定と DNS（A/CNAME レコード）も併せて要確認。

---

## 3. 修正方針（推奨・安全な順）

> いずれもサイト本文・権利表記には触れない、CI 構成のみの変更。最終判断は User に委ねます。

**A 案（推奨）: 静的配信に一本化**
1. `jekyll-gh-pages.yml` を削除（または `on:` を空にして無効化）。
2. `static.yml` のみを Pages デプロイ経路として残す。
3. Settings → Pages → Build and deployment → **Source = GitHub Actions** を確認。

**B 案: Jekyll に寄せる場合**
- 逆に `static.yml` を削除し `jekyll-gh-pages.yml` を残す。ただし本サイトは Jekyll 前提でないため、ルートに `.nojekyll` 相当の配慮や Liquid 衝突の確認が必要で、A 案より手間が大きい。**非推奨**。

---

## 4. 確認手順（修正後）

1. Settings → Pages → Source = **GitHub Actions** になっているか。
2. 残した 1 本のワークフローだけが起動するよう、`.github/workflows/` に Pages デプロイ系が 1 本のみであることを確認。
3. 軽微な空コミット or `workflow_dispatch` 手動実行で `main` push をトリガし、Actions が **1 本だけ green** になることを確認。
4. `https://fateline-investigator78.com/` が 200 で表示され、CSS / 画像 / リンクが崩れないことを確認。
5. Actions のログで `Get Pages site failed` 等が出ないことを確認（出る場合は手順 1 の Source 設定が原因）。

---

## 5. 影響範囲

- 変更対象: `.github/workflows/` のみ（A 案なら 1 ファイル削除）。
- サイト本文・SASS/CSS・JS・キャラクター設定・権利表記には一切触れない。
- GitHub Pages の公開 URL / カスタムドメインは A 案で従来通り維持。

---

## 6. 未実施 / User 判断事項

- A 案 / B 案のどちらを採るか。
- Settings → Pages の Source 設定の現状確認（リポジトリ管理画面が必要なため本調査では未確認）。
- 実際のファイル削除・コミットは User 承認後に実施。
