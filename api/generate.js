import OpenAI from 'openai';

export default async function handler(req, res) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONSリクエストへの対応
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // POSTメソッドのみ許可
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { 
            companyName, 
            contactName, 
            serviceName, 
            reason,
            reasonLabel,
            additionalMessage, 
            myName, 
            myCompany,
            variation = 0 
        } = req.body;

        // バリデーション
        if (!companyName || !contactName || !reason || !myName || !myCompany) {
            return res.status(400).json({ 
                error: '必須項目が入力されていません' 
            });
        }

        // OpenAI APIキーの確認
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ 
                error: 'OpenAI APIキーが設定されていません' 
            });
        }

        // サービス名の表記
        const servicePart = serviceName ? `「${serviceName}」` : '貴サービス';

        // プロンプト作成
        const prompt = `あなたはビジネスメールの専門家です。以下の情報を元に、丁寧で誠実なお断りメールを作成してください。

【相手の情報】
- 会社名: ${companyName}
- 担当者名: ${contactName}
- サービス名: ${serviceName || '(サービス名の記載なし)'}

【お断りの理由】
${reasonLabel}

【追加メッセージ】
${additionalMessage || '(特になし)'}

【送信者情報】
- 会社名: ${myCompany}
- 名前: ${myName}

【要件】
1. 件名は「${servicePart}に関するご提案について」とする
2. 冒頭で感謝の気持ちを伝える
3. お断りの理由を丁寧に説明する（具体的すぎず、相手を傷つけない表現で）
4. 相手の労力に対する感謝とお詫びを含める
5. 追加メッセージがある場合は自然に組み込む
6. 今後の関係性を大切にする姿勢を示す
7. 最後に相手の発展を祈る言葉で締める
8. 署名は「────────────────────────」で囲む
9. 全体的にビジネスメールとして適切な丁寧語を使用
10. 800-1000文字程度

【出力形式】
件名から署名まで、そのままコピーして使える完成形のメールとして出力してください。`;

        // OpenAI API呼び出し
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'あなたはビジネスメールの専門家です。丁寧で誠実、かつ相手を傷つけないお断りメールを作成することが得意です。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7 + (variation * 0.1), // バリエーション調整
            max_tokens: 1500
        });

        const emailContent = completion.choices[0].message.content;

        // 成功レスポンス
        res.status(200).json({
            emailContent: emailContent,
            success: true
        });

    } catch (error) {
        console.error('メール生成エラー:', error);
        
        // エラーレスポンス
        res.status(500).json({ 
            error: 'メールの生成に失敗しました',
            message: error.message 
        });
    }
}
