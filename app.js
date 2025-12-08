// ========================================
// サンプルデータ
// ========================================
const SAMPLE_DATA_ARRAY = [
    {
        companyName: '株式会社セールスフォース',
        contactName: '山田太郎',
        serviceName: '営業支援ツール「SalesForce Pro」',
        receivedEmail: 'お世話になっております。\n先日はお時間をいただき、誠にありがとうございました。\n弊社の営業支援ツール「SalesForce Pro」について、ご検討状況はいかがでしょうか。',
        declineReason: 'budget',
        additionalMessage: '今後、予算が確保できた際には改めてご相談させていただきたいです。',
        tone: 'formal'
    },
    {
        companyName: 'マーケティング株式会社',
        contactName: '佐藤花子',
        serviceName: 'MAツール「AutoMarketing」',
        receivedEmail: '',
        declineReason: 'other-service',
        additionalMessage: '',
        tone: 'business'
    },
    {
        companyName: 'テクノロジー合同会社',
        contactName: '鈴木一郎',
        serviceName: 'クラウドストレージサービス',
        receivedEmail: '',
        declineReason: 'timing',
        additionalMessage: '半年後くらいに再度ご提案いただけると幸いです。',
        tone: 'friendly'
    }
];

// ========================================
// グローバル変数
// ========================================
let currentFormData = null;
let currentDeclineReason = 'budget';
let progressInterval = null;

// ========================================
// DOM要素
// ========================================
const emailForm = document.getElementById('emailForm');
const generateBtn = document.getElementById('generateBtn');
const sampleBtn = document.getElementById('sampleBtn');
const copyBtn = document.getElementById('copyBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const progressContainer = document.getElementById('progressContainer');
const previewSection = document.getElementById('previewSection');
const emailPreview = document.getElementById('emailPreview');
const reasonTabs = document.querySelectorAll('.reason-tab');
const customReasonTextarea = document.getElementById('customReason');

// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // フォーム送信
    emailForm.addEventListener('submit', handleFormSubmit);
    
    // サンプルデータボタン
    sampleBtn.addEventListener('click', fillSampleData);
    
    // コピーボタン
    copyBtn.addEventListener('click', copyToClipboard);
    
    // 再生成ボタン
    regenerateBtn.addEventListener('click', regenerateEmail);
    
    // お断り理由タブ
    reasonTabs.forEach(tab => {
        tab.addEventListener('click', () => handleReasonTabClick(tab));
    });
}

// ========================================
// お断り理由タブの処理
// ========================================
function handleReasonTabClick(clickedTab) {
    // すべてのタブから active クラスを削除
    reasonTabs.forEach(tab => tab.classList.remove('active'));
    
    // クリックされたタブに active クラスを追加
    clickedTab.classList.add('active');
    
    // 選択された理由を保存
    currentDeclineReason = clickedTab.dataset.reason;
    
    // カスタム理由の場合はテキストエリアを表示
    if (currentDeclineReason === 'custom') {
        customReasonTextarea.style.display = 'block';
    } else {
        customReasonTextarea.style.display = 'none';
    }
}

// ========================================
// サンプルデータ入力
// ========================================
function fillSampleData() {
    const randomIndex = Math.floor(Math.random() * SAMPLE_DATA_ARRAY.length);
    const sample = SAMPLE_DATA_ARRAY[randomIndex];
    
    document.getElementById('companyName').value = sample.companyName;
    document.getElementById('contactName').value = sample.contactName;
    document.getElementById('serviceName').value = sample.serviceName;
    document.getElementById('receivedEmail').value = sample.receivedEmail;
    document.getElementById('additionalMessage').value = sample.additionalMessage;
    document.getElementById('tone').value = sample.tone;
    
    // お断り理由タブを選択
    reasonTabs.forEach(tab => {
        if (tab.dataset.reason === sample.declineReason) {
            tab.click();
        }
    });
}

// ========================================
// フォーム送信処理
// ========================================
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // フォームデータを取得
    currentFormData = getFormData();
    
    // バリデーション
    if (!validateFormData(currentFormData)) {
        return;
    }
    
    // UI更新
    generateBtn.disabled = true;
    generateBtn.textContent = '✨ 生成中...';
    previewSection.style.display = 'none';
    
    // プログレスバー表示
    startProgressAnimation();
    
    try {
        // AI生成を試行
        const email = await generateEmailWithAI(currentFormData);
        
        // 完了時に100%にして非表示
        updateProgress(100);
        setTimeout(() => {
            progressContainer.style.display = 'none';
        }, 500);
        
        // プレビュー表示
        displayEmail(email);
        
    } catch (error) {
        console.error('メール生成エラー:', error);
        
        // プログレスバー非表示
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        progressContainer.style.display = 'none';
        
        alert('メールの生成に失敗しました。もう一度お試しください。\n\nエラー: ' + error.message);
    } finally {
        // ボタンを元に戻す
        generateBtn.disabled = false;
        generateBtn.textContent = '✨ メールを生成する';
    }
}

// ========================================
// フォームデータ取得
// ========================================
function getFormData() {
    const declineReason = currentDeclineReason === 'custom' 
        ? customReasonTextarea.value 
        : currentDeclineReason;
    
    return {
        companyName: document.getElementById('companyName').value.trim(),
        contactName: document.getElementById('contactName').value.trim(),
        serviceName: document.getElementById('serviceName').value.trim(),
        receivedEmail: document.getElementById('receivedEmail').value.trim(),
        declineReason: declineReason,
        additionalMessage: document.getElementById('additionalMessage').value.trim(),
        tone: document.getElementById('tone').value
    };
}

// ========================================
// バリデーション
// ========================================
function validateFormData(data) {
    if (!data.companyName) {
        alert('会社名を入力してください。');
        return false;
    }
    if (!data.contactName) {
        alert('担当者名を入力してください。');
        return false;
    }
    if (!data.serviceName) {
        alert('サービス・商品名を入力してください。');
        return false;
    }
    if (currentDeclineReason === 'custom' && !data.declineReason) {
        alert('カスタム理由を入力してください。');
        return false;
    }
    return true;
}

// ========================================
// AI生成API呼び出し
// ========================================
async function generateEmailWithAI(formData) {
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
        body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'メール生成に失敗しました');
    }
    
    const data = await response.json();
    return data.email;
}

// ========================================
// プログレスバー
// ========================================
function startProgressAnimation() {
    progressContainer.style.display = 'block';
    updateProgress(0);
    
    let progress = 0;
    const targetProgress = 95;
    const duration = 20000; // 20秒で95%まで
    const interval = 50;
    const increment = (targetProgress / duration) * interval;
    
    progressInterval = setInterval(() => {
        progress += increment;
        if (progress < targetProgress) {
            updateProgress(progress);
        } else {
            updateProgress(targetProgress);
            clearInterval(progressInterval);
        }
    }, interval);
}

function updateProgress(percent) {
    const progressRing = document.getElementById('progressRing');
    const progressText = document.getElementById('progressText');
    const circumference = 339.292;
    const offset = circumference - (percent / 100) * circumference;
    
    progressRing.style.strokeDashoffset = offset;
    progressText.textContent = Math.round(percent) + '%';
}

// ========================================
// メール表示
// ========================================
function displayEmail(email) {
    emailPreview.textContent = email;
    previewSection.style.display = 'block';
    
    // スムーズにスクロール
    setTimeout(() => {
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// ========================================
// コピー機能
// ========================================
async function copyToClipboard() {
    const text = emailPreview.textContent;
    
    try {
        await navigator.clipboard.writeText(text);
        
        // ボタンのテキストを一時的に変更
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ コピーしました!';
        copyBtn.style.background = '#27ae60';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
        
    } catch (error) {
        console.error('コピーエラー:', error);
        alert('コピーに失敗しました。手動でコピーしてください。');
    }
}

// ========================================
// 再生成機能
// ========================================
async function regenerateEmail() {
    if (!currentFormData) {
        return;
    }
    
    // ボタンを無効化
    regenerateBtn.disabled = true;
    regenerateBtn.textContent = '🔄 再生成中...';
    
    // プログレスバー表示
    startProgressAnimation();
    
    try {
        // 少し異なる結果を得るためにバリエーションパラメータを追加
        const formDataWithVariation = {
            ...currentFormData,
            variation: Math.random()
        };
        
        const email = await generateEmailWithAI(formDataWithVariation);
        
        // 完了時に100%にして非表示
        updateProgress(100);
        setTimeout(() => {
            progressContainer.style.display = 'none';
        }, 500);
        
        // プレビュー更新
        displayEmail(email);
        
    } catch (error) {
        console.error('再生成エラー:', error);
        
        // プログレスバー非表示
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        progressContainer.style.display = 'none';
        
        alert('メールの再生成に失敗しました。もう一度お試しください。\n\nエラー: ' + error.message);
    } finally {
        // ボタンを元に戻す
        regenerateBtn.disabled = false;
        regenerateBtn.textContent = '🔄 再生成する';
    }
}

