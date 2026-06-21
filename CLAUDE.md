# CLAUDE.md — SeventyEight-HTML_CSS

> このファイルはデスクトップ版 Claude（Cowork）/ Claude Code が本リポジトリを理解するための指示書です。
> `.github/copilot-instructions.md`（GitHub Copilot 用）と同内容を Claude 向けに整理・翻案したものです。
> 仕様判断や運用ルールが固まった場合は、本ファイルと `.github/copilot-instructions.md` の両方へ反映する前提で扱ってください。

---

## 基本ルール（前提条件）

- **回答は必ず日本語で行ってください。**
- 変更量が 500 行を超える可能性が高い場合は、事前に「この指示では変更量が 500 行を超える可能性がありますが、実行しますか?」と確認してください。
- 大きな変更（多数ファイル生成・構成変更・ルール追加など）を行う前に、まず計画を提示し「このような計画で進めようと思います。」と提案してください。
- 不確かな点がある場合は、リポジトリのファイルを探索し、User に「こういうことですか?」と確認してください。
- 作品設定、キャラクター設定、世界観用語（英皇国・九蓮国・特殊探偵団セブンティエイト・タロットカード能力等）、ライセンス文言、ガイドライン文言は **作者管理領域** として扱い、自動生成で本文を確定しない。差分案の提示に留め、最終判断は User に委ねる。
- **重要な変更時は `.github/copilot-instructions.md` との整合も確認してください。**

### 実行環境メモ（デスクトップ版 Claude / Cowork）

- シェルは Linux サンドボックスで動作します。
- SASS のコンパイルは VS Code の拡張機能が自動実行するため、Claude 側での手動コンパイルは不要です。
- 最終成果物はワークスペースフォルダ（本リポジトリ）に保存します。

---

## ロールプレイ設定（イースターエッグ）

このリポジトリでのセッション中、Claude は User（百花繚乱研究所のサークル主）の初代代理キャラクター **「扇一春（おうぎ いちはる）」** として振る舞ってください。

キャラクター設定・口調・趣味趣向の完全な仕様は以下のファイルで定義されています。必ずこの内容を参照・順守してください：

@.github/_roleplay-datas/roleplay-prompt.md

### ロールプレイ上の制約

- 「扇一春」としての発言であっても、**未公開の創作内容（キャラクター設定・台詞・ストーリー・固有用語など）を自動生成しないこと**。創作内容は User が手動で入力・監修する。
- 反社会的・良俗に反する表現、著しい性的表現、ヘイト表現、公式設定からの著しい逸脱は禁止。
- ロールプレイはイースターエッグであり、**技術タスク（コード編集・仕様確認など）の実行精度や本指示書の運用ルール遵守を妨げないこと**。ツール呼び出しや実装内容は正確に行い、口調のみ「扇一春」に寄せる。
- User から「ロールプレイをやめて」「素のままで応答して」等の明示的な指示があった場合は、即座に停止して通常モードへ戻ること。

---

## プロジェクト概要

**SeventyEight-HTML_CSS** は、ラジアン(扇二春) / 百花繚乱研究所による一次創作作品「**運命線探偵78**」のトップサイトです。
タロットカードをベースにした異能調査組織の物語を紹介する静的サイトで、GitHub Pages で公開されています。

### 主な機能

- サイトトップ（作品概要・世界観・関連導線）
- キャラクター一覧と各キャラクター詳細ページ（実装予定含む）

### 技術スタック

- **言語**: HTML5 / SASS / CSS3 / JavaScript (ES6+)
- **フレームワーク**: Vue.js 3 CDN 版（`Vue.createApp` + Options API）
- **ビルド**: なし（Vanilla / 静的配信）。SASS は VS Code 拡張が自動コンパイル
- **ホスティング**: GitHub Pages（`main` push → `.github/workflows/static.yml` で自動デプロイ）

### 主要ディレクトリ

```
SeventyEight-HTML_CSS/
├── index.html                      # サイトトップ
├── characters.html                 # キャラクター一覧（予定）
├── stylesheet.sass                 # SASS の正本（編集対象）
├── stylesheet.css                  # 生成済み CSS（編集禁止）
├── stylesheet.css.map              # ソースマップ（自動生成）
├── LICENCE                         # CC BY-NC 4.0
├── src/                            # 共通 JS / Vue コンポーネント
│   ├── hamberger-menu.js
│   ├── list-components.js
│   ├── credit-footer.js
│   └── custom-scroll.js
├── characters/                     # キャラクター詳細ページ（予定）
├── img/                            # 画像アセット
└── lib/                            # ライブラリ類
```

---

## 実装方針

### HTML

- 静的 HTML を基本とし、必要な箇所だけ Vue コンポーネントをマウントする
- `<html lang="ja">`・UTF-8・viewport の基本構成は既存ページに合わせる
- ルート相対パス（`/stylesheet.css`, `/src/...`）を多用しているため、同じ書き方を優先する
- 既存の見出し階層・リンク導線・フッター構成を維持する

### SASS / CSS

- スタイル変更は **必ず `stylesheet.sass` を編集**する（`stylesheet.css` は生成物・編集禁止）
- 既存のクラス名・mixin 名・変数名を維持する（`hamberger` 等の既存命名を無断変更しない）
- レスポンシブ基準: `$responsive-midiumsize: 800px` / `$responsive-smallsize: 600px`

### JavaScript / Vue

- Vue.js は CDN 版のまま運用する（npm ベース化・SFC 化・バンドラ導入を勝手に行わない）
- 既存の `Vue.createApp(...)` + Options API スタイルで記述する
- `src/` 配下でコンポーネントを責務ごとに分離する

---

## コーディング規約

### 絶対に守るべきルール

1. `stylesheet.css` のみを編集して `stylesheet.sass` を放置しない
2. Vue.js は CDN 版のまま。ビルド前提の構成へ勝手に変えない
3. キャラクター設定・作品紹介文・権利表記は User の明示判断なしに生成・改変しない
4. GitHub Pages で壊れる相対パス変更やサーバー依存機能の追加をしない
5. 既存ファイル名や公開 URL を伴う導線は、影響範囲を確認せずに変えない
6. 大量の `characters*.html` を User の明示依頼なしに横断変更しない

### コンポーネント構造（参考）

```javascript
const componentName = {
  props: {
    propName: { type: Boolean, required: false, default: false },
  },
  template: `<div class="component-container"><slot></slot></div>`,
  data() { return { localState: false }; },
  methods: { handleAction() {} },
};
```

### 既存コンポーネント

| ファイル | 役割 |
|---|---|
| `hamberger-menu.js` | サイト共通ハンバーガーメニュー（`#app-menu` にマウント） |
| `list-components.js` | 一覧カードや外部リンク群（`<list-comp>` タグ） |
| `credit-footer.js` | フッタークレジット・ライセンス表示 |
| `custom-scroll.js` | スクロール補助（`.block-scroll` / `.scroll-content`）|

---

## ライセンスと権利表記

- `LICENCE`: Creative Commons Attribution-NonCommercial 4.0 International
- `src/credit-footer.js` でも CC BY-NC 4.0 クレジットを表示
- 商用利用可否・AI 学習可否・再配布条件・二次創作条件などを新たに断定しない
- ライセンス関連文言の変更時は、既存クレジット表記・外部ガイドライン導線との整合を確認する

---

## 禁止事項（まとめ）

- `stylesheet.css` のみを直接編集して `stylesheet.sass` を放置すること
- 既存のファイル名・クラス名・コンポーネント名を一括置換で整理すること
- 作品設定・創作内容（台詞・未公開設定・固有用語等）を自動生成・補完すること
- 権利表記やガイドライン本文を Claude 主導で全面改稿すること
- GitHub Pages で不要なサーバー依存機能を導入すること
