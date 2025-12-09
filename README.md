# 📧 お断りメール自動生成ツール

商談後のお断りメールを、AIで丁寧に自動生成するツールです。

## 🎯 特徴

- **AIによる自動生成**: OpenAI GPT-4を使用して、丁寧で誠実なお断りメールを自動生成
- **タブで理由選択**: 6種類の断り理由をタブで簡単に選択
- **レスポンシブデザイン**: スマホ・タブレット・PCすべてに対応
- **ワンクリックコピー**: 生成されたメールを簡単にコピー
- **再生成機能**: 気に入らなければ別のバリエーションを生成
- **サンプルデータ**: すぐに試せるサンプルデータ機能付き

## 🚀 デモ

[デモサイトURL](https://your-vercel-app.vercel.app)

## 📋 使い方

1. **相手の情報を入力**
   - 会社名
   - 担当者名
   - サービス名（任意）

2. **断り理由を選択**
   - 予算の都合
   - 導入時期が合わない
   - 他社サービスを選定
   - 機能が要件に合わない
   - 社内事情
   - その他

3. **自分の情報を入力**
   - あなたの名前
   - あなたの会社名
   - 追加メッセージ（任意）

4. **「メールを生成する」ボタンをクリック**

5. **生成されたメールをコピーして使用**

## 🛠️ 技術スタック

- **フロントエンド**: HTML, CSS, JavaScript (Vanilla)
- **バックエンド**: Vercel Serverless Functions
- **AI**: OpenAI GPT-4o-mini
- **ホスティング**: Vercel

## 📦 セットアップ

### 必要なもの

- Node.js (v18以上推奨)
- OpenAI APIキー
- Vercelアカウント

### ローカル開発

1. **リポジトリをクローン**

```bash
git clone https://github.com/k-mitsumori-cmd/decline-email-generator.git
cd decline-email-generator
```

2. **依存関係をインストール**

```bash
npm install
```

3. **環境変数を設定**

`.env.local`ファイルを作成:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. **開発サーバーを起動**

```bash
npm run dev
```

5. **ブラウザでアクセス**

```
http://localhost:3000
```

## 🌐 Vercelへのデプロイ

### 1. GitHubにプッシュ

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/k-mitsumori-cmd/decline-email-generator.git
git push -u origin main
```

### 2. Vercelでインポート

1. [Vercel](https://vercel.com)にログイン
2. 「New Project」をクリック
3. GitHubリポジトリ `decline-email-generator` を選択
4. 「Import」をクリック

### 3. 環境変数を設定

1. Vercelダッシュボード → プロジェクト → Settings → Environment Variables
2. 以下の環境変数を追加:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | あなたのOpenAI APIキー |

### 4. デプロイ

- 自動的にデプロイが開始されます
- 完了後、URLが発行されます

## 📁 ファイル構造

```
decline-email-generator/
├── index.html              # メインHTMLファイル
├── styles.css              # スタイルシート
├── app.js                  # フロントエンドJavaScript
├── api/
│   └── generate.js         # Vercel Serverless Function (AI生成)
├── package.json            # 依存関係
├── vercel.json             # Vercel設定
├── .gitignore              # Git除外設定
└── README.md               # このファイル
```

## 🔒 セキュリティ

- **APIキーの管理**: OpenAI APIキーはバックエンド（Serverless Function）でのみ使用
- **環境変数**: 本番環境では環境変数で管理
- **CORS対応**: 適切なCORS設定を実装

## 🎨 カスタマイズ

### 断り理由を追加

`app.js`の`REASON_LABELS`オブジェクトに追加:

```javascript
const REASON_LABELS = {
    'budget': '予算の都合',
    'timing': '導入時期が合わない',
    // ... 新しい理由を追加
    'custom': 'カスタム理由'
};
```

### プロンプトを調整

`api/generate.js`の`prompt`変数を編集して、生成されるメールの内容を調整できます。

## 🐛 トラブルシューティング

### AI生成が動作しない

- Vercelダッシュボードで環境変数`OPENAI_API_KEY`が設定されているか確認
- `package.json`に`openai`パッケージが含まれているか確認
- 再デプロイを実行

### 404エラーが出る

- `api/generate.js`が正しい場所にあるか確認
- `vercel.json`の設定を確認
- Vercelのログを確認

### スマホで表示が崩れる

- `viewport`メタタグが設定されているか確認
- フォントサイズが16px以上になっているか確認（iOSズーム防止）

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！

## 📧 お問い合わせ

問題や質問がある場合は、GitHubのIssuesでお知らせください。

---

**Made with ❤️ by k-mitsumori-cmd**
