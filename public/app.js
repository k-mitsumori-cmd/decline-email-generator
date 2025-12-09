// ========================================
// サンプルデータ
// ========================================
const SAMPLE_DATA_ARRAY = [
    {
        companyName: '株式会社テックソリューションズ',
        contactName: '山田太郎',
        serviceName: 'クラウド営業支援システム',
        reason: 'budget',
        additionalMessage: '今後も情報交換させていただければ幸いです',
        myName: '鈴木一郎',
        myCompany: '株式会社サンプル商事'
    },
    {
        companyName: 'マーケティングラボ株式会社',
        contactName: '佐藤花子',
        serviceName: 'MAツール',
        reason: 'alternative',
        additionalMessage: '貴社の今後のご発展を心よりお祈り申し上げます',
        myName: '田中次郎',
        myCompany: '株式会社デジタルマーケティング'
    },
    {
        companyName: '株式会社ビジネスイノベーション',
        contactName: '高橋健一',
        serviceName: 'SFA/CRMシステム',
        reason: 'timing',
        additionalMessage: '将来的に検討の機会がございましたら、改めてご連絡させていただきます',
        myName: '伊藤美咲',
        myCompany: '株式会社グローバルエンタープライズ'
    }
];

// 理由のラベルマッピング
const REASON_LABELS = {
    'budget': '予算の都合',
    'timing': '導入時期が合わない',
    'alternative': '他社サービスを選定',
    'feature': '機能が要件に合わない',
    'internal': '社内事情',
    'other': 'その他'
};

// ========================================
// グローバル変数
// ========================================
let currentFormData = null;
let currentVariation = 0;
let progressInterval = null;

// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});

function initializeEventListeners() {
    // 理由タブの切り替え
    const reasonTabs = document.querySelectorAll('.reason-tab');
    reasonTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            reasonTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('reason').value = tab.dataset.reason;
        });
    });

    // サンプルデータボタン
    document.getElementById('sampleBtn').addEventListener('click', fillSampleData);

    // フォーム送信
    document.getElementById('emailForm').addEventListener('submit', handleFormSubmit);

    // プレビューアクション
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    document.getElementById('regenerateBtn').addEventListener('click', regenerateEmail);
    document.getElementById('resetBtn').addEventListener('click', resetForm);
}

// ========================================
// サンプルデータ入力
// ========================================
function fillSampleData() {
    const randomIndex = Math.floor(Math.random() * SAMPLE_DATA_ARRAY.length);
    const sampleData = SAMPLE_DATA_ARRAY[randomIndex];

    document.getElementById('companyName').value = sampleData.companyName;
    document.getElementById('contactName').value = sampleData.contactName;
    document.getElementById('serviceName').value = sampleData.serviceName;
    document.getElementById('additionalMessage').value = sampleData.additionalMessage;
    document.getElementById('myName').value = sampleData.myName;
    document.getElementById('myCompany').value = sampleData.myCompany;

    // 理由タブを選択
    document.querySelectorAll('.reason-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.reason === sampleData.reason) {
            tab.classList.add('active');
        }
    });
    document.getElementById('reason').value = sampleData.reason;
}

// ========================================
// フォーム送信処理
// ========================================
async function handleFormSubmit(e) {
    e.preventDefault();

    // フォームデータ取得
    const formData = {
        companyName: document.getElementById('companyName').value.trim(),
        contactName: document.getElementById('contactName').value.trim(),
        serviceName: document.getElementById('serviceName').value.trim(),
        reason: document.getElementById('reason').value,
        additionalMessage: document.getElementById('additionalMessage').value.trim(),
        myName: document.getElementById('myName').value.trim(),
        myCompany: document.getElementById('myCompany').value.trim()
    };

    currentFormData = formData;
    currentVariation = 0;

    await generateEmail(formData, 0);
}

// ========================================
// メール生成
// ========================================
async function generateEmail(formData, variation = 0) {
    const generateBtn = document.getElementById('generateBtn');
    const progressContainer = document.getElementById('progressContainer');
    const previewSection = document.getElementById('previewSection');

    try {
        // UI更新
        generateBtn.disabled = true;
        generateBtn.textContent = '✨ 生成中...';
        previewSection.style.display = 'none';
        progressContainer.style.display = 'block';

        // プログレスバー開始
        progressInterval = startProgressAnimation();

        // AI生成を試みる
        let emailContent;
        try {
            emailContent = await generateEmailWithAI(formData, variation);
        } catch (apiError) {
            console.warn('AI生成エラー、テンプレートベースにフォールバック:', apiError);
            // フォールバック: テンプレートベース生成
            emailContent = generateEmailTemplate(formData);
        }

        // プログレスバー完了
        updateProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500));

        // プレビュー表示
        displayEmailPreview(emailContent);

        // UI更新
        progressContainer.style.display = 'none';
        previewSection.style.display = 'block';
        generateBtn.disabled = false;
        generateBtn.textContent = '✨ メールを生成する';

        // プレビューセクションまでスクロール
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        console.error('メール生成エラー:', error);
        alert('メールの生成に失敗しました。もう一度お試しください。');

        // UI復元
        progressContainer.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.textContent = '✨ メールを生成する';
    } finally {
        if (progressInterval) {
            clearInterval(progressInterval);
        }
    }
}

// ========================================
// AI生成 (Vercel Serverless Function)
// ========================================
async function generateEmailWithAI(formData, variation = 0) {
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    const API_URL = isLocalhost 
        ? 'http://localhost:3000/api/generate'
        : '/api/generate';

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            companyName: formData.companyName,
            contactName: formData.contactName,
            serviceName: formData.serviceName,
            reason: formData.reason,
            reasonLabel: REASON_LABELS[formData.reason],
            additionalMessage: formData.additionalMessage,
            myName: formData.myName,
            myCompany: formData.myCompany,
            variation: variation
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'API呼び出しに失敗しました');
    }

    const result = await response.json();
    return result.emailContent;
}

// ========================================
// テンプレートベース生成 (フォールバック)
// ========================================
function generateEmailTemplate(formData) {
    const reasonLabel = REASON_LABELS[formData.reason];
    const servicePart = formData.serviceName ? `「${formData.serviceName}」` : '貴サービス';
    
    let reasonDetail = '';
    switch (formData.reason) {
        case 'budget':
            reasonDetail = '社内で検討を重ねました結果、現在の予算状況を鑑み、今回は見送らせていただくことになりました。';
            break;
        case 'timing':
            reasonDetail = '社内で検討を重ねました結果、現時点での導入時期が合わないため、今回は見送らせていただくことになりました。';
            break;
        case 'alternative':
            reasonDetail = '社内で慎重に検討を重ねました結果、他社のサービスを採用することとなりました。';
            break;
        case 'feature':
            reasonDetail = '社内で検討を重ねました結果、現在の要件とのマッチングを考慮し、今回は見送らせていただくことになりました。';
            break;
        case 'internal':
            reasonDetail = '社内事情により、今回は導入を見送らせていただくことになりました。';
            break;
        default:
            reasonDetail = '社内で検討を重ねました結果、今回は見送らせていただくことになりました。';
    }

    const additionalPart = formData.additionalMessage 
        ? `\n\n${formData.additionalMessage}` 
        : '\n\n今後も情報交換などの機会がございましたら、ぜひよろしくお願いいたします。';

    return `件名: ${servicePart}に関するご提案について

${formData.companyName}
${formData.contactName} 様

お世話になっております。
${formData.myCompany}の${formData.myName}です。

先日は${servicePart}についてご丁寧にご説明いただき、誠にありがとうございました。
貴重なお時間を割いていただきましたこと、心より感謝申し上げます。

${reasonDetail}

${formData.contactName}様には大変お手数をおかけいたしましたこと、深くお詫び申し上げます。
${additionalPart}

末筆ながら、貴社の益々のご発展をお祈り申し上げます。
今後ともどうぞよろしくお願いいたします。

────────────────────────
${formData.myCompany}
${formData.myName}
────────────────────────`;
}

// ========================================
// プログレスバー
// ========================================
function startProgressAnimation() {
    updateProgress(0);
    
    let progress = 0;
    const targetProgress = 95;
    const duration = 20000; // 20秒で95%まで
    const interval = 50;
    const increment = (targetProgress / duration) * interval;
    
    const progressInterval = setInterval(() => {
        progress += increment;
        if (progress < targetProgress) {
            updateProgress(progress);
        } else {
            updateProgress(targetProgress);
            clearInterval(progressInterval);
        }
    }, interval);
    
    return progressInterval;
}

function updateProgress(percent) {
    const circle = document.getElementById('progressCircle');
    const percentText = document.getElementById('progressPercent');
    
    const circumference = 2 * Math.PI * 54; // r=54
    const offset = circumference - (percent / 100) * circumference;
    
    circle.style.strokeDashoffset = offset;
    percentText.textContent = Math.round(percent);
}

// ========================================
// プレビュー表示
// ========================================
function displayEmailPreview(emailContent) {
    const emailPreview = document.getElementById('emailPreview');
    emailPreview.textContent = emailContent;
}

// ========================================
// コピー機能
// ========================================
async function copyToClipboard() {
    const emailPreview = document.getElementById('emailPreview');
    const emailContent = emailPreview.textContent;
    
    try {
        await navigator.clipboard.writeText(emailContent);
        
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ コピーしました!';
        copyBtn.style.background = '#38a169';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#48bb78';
        }, 2000);
    } catch (error) {
        console.error('コピーエラー:', error);
        alert('コピーに失敗しました');
    }
}

// ========================================
// 再生成
// ========================================
async function regenerateEmail() {
    if (!currentFormData) return;
    
    currentVariation++;
    await generateEmail(currentFormData, currentVariation);
}

// ========================================
// リセット
// ========================================
function resetForm() {
    // フォームをリセット
    document.getElementById('emailForm').reset();
    
    // 理由タブを初期状態に
    document.querySelectorAll('.reason-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector('.reason-tab[data-reason="budget"]').classList.add('active');
    document.getElementById('reason').value = 'budget';
    
    // プレビューを非表示
    document.getElementById('previewSection').style.display = 'none';
    
    // 変数をリセット
    currentFormData = null;
    currentVariation = 0;
    
    // フォームの先頭までスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
