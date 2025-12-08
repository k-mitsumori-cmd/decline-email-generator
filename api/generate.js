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
            receivedEmail, 
            declineReason, 
            additionalMessage, 
            tone,
            variation = 0
        } = req.body;

        // バリデーション
        if (!companyName || !contactName || !serviceName || !declineReason) {
            return res.status(400).json({ 
                error: '会社名、担当者名、サービス名、お断り理由は必須です' 
            });
        }

        // OpenAI APIキーの確認
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ 
                error: 'OpenAI APIキーが設定されていません' 
            });
        }

        // お断り理由のラベル取得
        const reasonLabel = getReasonLabel(declineReason);

        // トーンの説明取得
        const toneDescription = getToneDescription(tone);

        // プロンプト作成
        const prompt = createPrompt({
            companyName,
            contactName,
            serviceName,
            receivedEmail,
            reasonLabel,
            additionalMessage,
            toneDescription
        });

        // OpenAI API呼び出し
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'あなたはビジネスメールの専門家です。丁寧で誠実なお断りメールを作成することが得意です。相手の気持ちを尊重しながら、明確にお断りの意思を伝えることができます。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7 + (variation * 0.2),
            max_tokens: 1500
        });

        const generatedEmail = completion.choices[0].message.content;

        // レスポンス返却
        res.json({
            email: generatedEmail
        });

    } catch (error) {
        console.error('メール生成エラー:', error);
        res.status(500).json({ 
            error: 'メールの生成に失敗しました',
            message: error.message 
        });
    }
}

// ========================================
// お断り理由のラベル取得
// ========================================
function getReasonLabel(reason) {
    const reasonMap = {
        'budget': '予算が合わない',
        'timing': 'タイミングが合わない',
        'other-service': '他のサービスを採用することになった',
        'no-need': '現時点でニーズがない',
        'internal': '社内事情により見送ることになった'
    };
    
    return reasonMap[reason] || reason;
}

// ========================================
// トーンの説明取得
// ========================================
function getToneDescription(tone) {
    const toneMap = {
        'formal': '非常に丁寧でフォーマルな敬語を使用し、格式高い表現で',
        'friendly': '親しみやすく柔らかい表現を使用しながらも、ビジネスマナーを守って',
        'business': 'ビジネスライクで簡潔、かつ礼儀正しい表現で'
    };
    
    return toneMap[tone] || toneMap['formal'];
}

// ========================================
// プロンプト作成
// ========================================
function createPrompt({ companyName, contactName, serviceName, receivedEmail, reasonLabel, additionalMessage, toneDescription }) {
    let prompt = `以下の情報を元に、商談やサービス説明後のお断りメールを作成してください。

【相手の会社名】
${companyName}

【担当者名】
${contactName}様

【サービス・商品名】
${serviceName}

【お断り理由】
${reasonLabel}
`;

    if (receivedEmail) {
        prompt += `
【受け取ったメールの内容】
${receivedEmail}
`;
    }

    if (additionalMessage) {
        prompt += `
【追加で伝えたいメッセージ】
${additionalMessage}
`;
    }

    prompt += `
【メールのトーン】
${toneDescription}

【要件】
1. 件名を含めて完全なメール形式で作成してください
2. 相手への感謝の気持ちを必ず表現してください
3. お断りの理由を明確かつ丁寧に伝えてください
4. 相手の時間や労力への配慮を示してください
5. 今後の関係性を損なわないような表現を心がけてください
6. 適切な結びの言葉で締めくくってください
7. 署名欄は「[あなたの名前]」としてください

【メールの構成例】
- 件名: 【お断り】〇〇のご提案について
- 冒頭の挨拶
- 感謝の表現
- お断りの意思表示
- お断りの理由
- 追加メッセージ（あれば）
- お詫びと感謝
- 結びの言葉
- 署名

※自然で読みやすいビジネスメールとして作成してください。
※過度に長くならないよう、簡潔にまとめてください（300-500文字程度）。
`;

    return prompt;
}

