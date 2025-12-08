# 📧 お断りメール生成ツール

商談やサービス説明を受けた後の丁寧なお断りメールをAIが自動生成するツールです。

## 🌟 特徴

- **簡単入力**: 会社名、担当者名、サービス名を入力するだけ
- **タブ選択**: よくあるお断り理由をタブで簡単に選択
- **AI生成**: OpenAI GPT-4を使用した自然で丁寧なメール文章
- **トーン調整**: フォーマル、親しみやすい、ビジネスライクの3種類から選択
- **レスポンシブ対応**: スマホ・タブレット・PCすべてに対応
- **ワンクリックコピー**: 生成されたメールをワンクリックでコピー

## 📋 お断り理由の種類

- 予算が合わない
- タイミングが合わない
- 他サービスを採用
- ニーズがない
- 社内事情
- カスタム（自由入力）

## 🚀 デプロイ手順

### 1. GitHubリポジトリの準備

```bash
# リポジトリをクローン
git clone https://github.com/k-mitsumori-cmd/decline-email-generator.git
cd decline-email-generator

# または、新規作成の場合
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/k-mitsumori-cmd/decline-email-generator.git
git push -u origin main
```

### 2. Vercelでデプロイ

#### 方法1: Vercel CLI（推奨）

```bash
# Vercel CLIをインストール（初回のみ）
npm install -g vercel

# ログイン
vercel login

# デプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

#### 方法2: Vercel Webダッシュボード

1. [Vercel](https://vercel.com)にアクセスしてログイン
2. 「New Project」をクリック
3. GitHubリポジトリ「decline-email-generator」を選択
4. 「Import」をクリック
5. 環境変数を設定（下記参照）
6. 「Deploy」をクリック

### 3. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定してください：

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `OPENAI_API_KEY` | `sk-...` | OpenAI APIキー |

#### 環境変数の設定方法

1. Vercelダッシュボード → プロジェクトを選択
2. 「Settings」→「Environment Variables」
3. 「Add New」をクリック
4. Name: `OPENAI_API_KEY`
5. Value: OpenAI APIキーを入力
6. Environment: `Production`, `Preview`, `Development` すべてにチェック
7. 「Save」をクリック

### 4. OpenAI APIキーの取得

1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. アカウントを作成またはログイン
3. 「API Keys」→「Create new secret key」
4. 生成されたキーをコピー（一度しか表示されません）
5. Vercelの環境変数に設定

## 💻 ローカル開発

### 必要な環境

- Node.js 18.x 以上
- npm または yarn

### セットアップ

```bash
# 依存関係をインストール
npm install

# 環境変数を設定
# .env ファイルを作成
echo "OPENAI_API_KEY=your_api_key_here" > .env

# ローカルサーバーを起動
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

## 📁 ファイル構造

```
decline-email-generator/
├── index.html              # メインHTML
├── styles.css              # スタイルシート
├── app.js                  # フロントエンドJavaScript
├── api/
│   └── generate.js         # Vercel Serverless Function（AI生成API）
├── package.json            # 依存関係
├── vercel.json             # Vercel設定
├── .gitignore              # Git除外設定
└── README.md               # このファイル
```

## 🎨 使い方

### 基本的な使い方

1. **情報を入力**
   - 相手の会社名
   - 担当者名
   - サービス・商品名

2. **お断り理由を選択**
   - タブから該当する理由を選択
   - または「カスタム」で自由入力

3. **オプション設定**
   - 受け取ったメールの内容（任意）
   - 追加メッセージ（任意）
   - メールのトーン（フォーマル/親しみやすい/ビジネスライク）

4. **生成ボタンをクリック**
   - AIが自動的にメールを生成

5. **メールをコピー**
   - 「コピーする」ボタンでクリップボードにコピー
   - メールクライアントに貼り付けて使用

### サンプルデータ機能

「🎲 サンプルデータを入力」ボタンをクリックすると、サンプルデータが自動入力されます。初めて使う際の参考にしてください。

### 再生成機能

生成されたメールが気に入らない場合は、「🔄 再生成する」ボタンで別のバリエーションを生成できます。

## 🔒 セキュリティ

- **APIキーの管理**: OpenAI APIキーはサーバーサイド（Vercel Serverless Function）でのみ使用され、フロントエンドには露出しません
- **環境変数**: APIキーは環境変数として安全に管理されます
- **CORS設定**: 適切なCORS設定により、不正なアクセスを防止します

## 🛠 トラブルシューティング

### メール生成が失敗する

**原因**: 
- OpenAI APIキーが設定されていない
- APIキーが無効
- OpenAI APIの利用制限に達している

**解決方法**:
1. Vercelの環境変数を確認
2. OpenAI APIキーが正しいか確認
3. OpenAIアカウントの利用状況を確認

### 404エラーが発生する

**原因**: 
- Serverless Functionのパスが正しくない
- デプロイが完了していない

**解決方法**:
1. `api/generate.js` が正しい場所にあるか確認
2. `vercel.json` の設定を確認
3. Vercelで再デプロイを実行

### スマホで表示が崩れる

**解決方法**:
- ブラウザのキャッシュをクリア
- ページを再読み込み
- 最新のブラウザを使用

## 📝 カスタマイズ

### お断り理由を追加

`app.js` の `handleReasonTabClick` 関数と `index.html` のタブ部分を編集してください。

### メールのトーンを変更

`api/generate.js` の `getToneDescription` 関数を編集してください。

### デザインの変更

`styles.css` を編集してください。レスポンシブデザインに対応しているため、メディアクエリも確認してください。

## 🌐 デモ

デプロイ後、以下のようなURLでアクセスできます：

```
https://your-project-name.vercel.app
```

## 📚 技術スタック

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **バックエンド**: Vercel Serverless Functions (Node.js)
- **AI**: OpenAI GPT-4o-mini
- **ホスティング**: Vercel
- **バージョン管理**: Git / GitHub

## 🤝 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📄 ライセンス

MIT License

## 🙏 謝辞

このツールは、ビジネスコミュニケーションの効率化を目的として開発されました。丁寧なお断りメールを簡単に作成できることで、より良いビジネス関係の構築に貢献できれば幸いです。

---

## 📞 サポート

問題が発生した場合は、GitHubのIssuesセクションで報告してください。

---

**Powered by OpenAI GPT-4 | Hosted on Vercel**

