document.addEventListener('DOMContentLoaded', () => {
    // 心理測驗資料
    const quizData = [
        {
            question: "Q1｜當你接到一個新的任務或挑戰，你第一個反應是？",
            options: [
                { text: "先看現實條件，能做到多少就做到多少", type: "A" },
                { text: "覺得好期待！一定會學到很多、變得更好", type: "B" },
                { text: "馬上想怎麼做到「最好」，不允許失誤", type: "C" },
                { text: "先列出流程、時間表和可能風險", type: "D" }
            ]
        },
        {
            question: "Q2｜如果事情沒有照你想的方向發展，你會怎麼調整？",
            options: [
                { text: "接受現況，找一個「還不錯」的解法", type: "A" },
                { text: "有點失落，但會說服自己「一定有意義」", type: "B" },
                { text: "很難接受，會想重來或修正到完美", type: "C" },
                { text: "冷靜檢討問題，重新安排下一步", type: "D" }
            ]
        },
        {
            question: "Q3｜你最害怕的是哪一種狀況？",
            options: [
                { text: "被要求做超出自己能力範圍的事", type: "A" },
                { text: "發現自己其實不夠特別、不夠亮眼", type: "B" },
                { text: "失控、失敗，或被看見不完美的一面", type: "C" },
                { text: "計畫被打亂，一切變得不可預期", type: "D" }
            ]
        },
        {
            question: "Q4｜在團隊裡，你通常扮演什麼角色？",
            options: [
                { text: "默默把該做的事做好，不多不少", type: "A" },
                { text: "氣氛製造者，替大家加油、鼓勵", type: "B" },
                { text: "推動標準的人，希望大家一起變更好", type: "C" },
                { text: "在旁邊確認進度、提醒細節的人", type: "D" }
            ]
        },
        {
            question: "Q5｜你最認同哪一句話？",
            options: [
                { text: "「能做到的事，踏實做好就夠了。」", type: "A" },
                { text: "「我相信，有一天我也會發光。」", type: "B" },
                { text: "「如果要做，就要做到最好。」", type: "C" },
                { text: "「事情之所以順利，是因為有人事先安排好。」", type: "D" }
            ]
        }
    ];

    // 測驗結果對應表
    const resultData = {
        "A": {
            name: "浩型",
            icon: "🌿",
            desc: "你務實、放鬆，不勉強自己成為不適合的樣子。<br>你相信「力所能及」也是一種溫柔的選擇。<br>在這個舞台上，你是穩住一切的存在。"
        },
        "B": {
            name: "玫瑰型",
            icon: "🌹",
            desc: "你曾仰望別人的光，卻慢慢發現——<br>原來你自己，也可以照亮舞台。<br>天真、浪漫、勇敢去相信，是你最美的地方。"
        },
        "C": {
            name: "陶型",
            icon: "🔥",
            desc: "你對自己要求很高，也希望世界跟上你的標準。<br>完美背後，是你對舞台、對人生的極度認真。<br>學會放手，也許是你下一道課題。"
        },
        "D": {
            name: "舞監型",
            icon: "🎧",
            desc: "你冷靜、計畫周全，習慣站在舞台邊緣守住全局。<br>也許不張揚，但沒有你，表演不會成立。<br>你是讓一切得以發生的人。"
        }
    };

    // 狀態變數
    let currentQuestionIndex = 0;
    let scores = { A: 0, B: 0, C: 0, D: 0 };
    let lastQuestionChoice = ""; // 用於平手時的判斷

    // DOM 元素
    const introSection = document.getElementById('quiz-intro');
    const questionSection = document.getElementById('quiz-question-container');
    const resultSection = document.getElementById('quiz-result-container');
    
    const startBtn = document.getElementById('start-quiz-btn');
    const restartBtn = document.getElementById('restart-quiz-btn');
    
    const questionText = document.getElementById('quiz-question-text');
    const optionsContainer = document.getElementById('quiz-options');
    const currentQSpan = document.getElementById('quiz-current-q');
    const progressBar = document.getElementById('quiz-progress-bar');
    
    const resultIcon = document.getElementById('quiz-result-icon');
    const resultName = document.getElementById('quiz-result-name');
    const resultDesc = document.getElementById('quiz-result-desc');

    // 初始化測驗
    startBtn.addEventListener('click', () => {
        introSection.classList.add('hidden');
        questionSection.classList.remove('hidden');
        currentQuestionIndex = 0;
        scores = { A: 0, B: 0, C: 0, D: 0 };
        loadQuestion();
    });

    restartBtn.addEventListener('click', () => {
        resultSection.classList.add('hidden');
        introSection.classList.remove('hidden');
    });

    // 載入問題
    function loadQuestion() {
        const qData = quizData[currentQuestionIndex];
        questionText.textContent = qData.question;
        currentQSpan.textContent = currentQuestionIndex + 1;
        
        // 更新進度條
        const progressPercent = ((currentQuestionIndex) / quizData.length) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // 清空並生成選項
        optionsContainer.innerHTML = '';
        qData.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = option.text;
            btn.addEventListener('click', () => selectOption(option.type));
            optionsContainer.appendChild(btn);
        });
    }

    // 選擇選項
    function selectOption(type) {
        scores[type]++;
        if (currentQuestionIndex === quizData.length - 1) {
            lastQuestionChoice = type; // 記錄最後一題的選擇作為平手決定要素
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }

    // 計算並顯示結果
    function showResult() {
        questionSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

        // 找出最高分的類型
        let maxScore = 0;
        let finalType = "A";
        let isTie = false;
        let tieTypes = [];

        for (const type in scores) {
            if (scores[type] > maxScore) {
                maxScore = scores[type];
                finalType = type;
                isTie = false;
                tieTypes = [type];
            } else if (scores[type] === maxScore) {
                isTie = true;
                tieTypes.push(type);
            }
        }

        // 如果平手，則以第五題(最後一題)的答案為主
        if (isTie && tieTypes.includes(lastQuestionChoice)) {
            finalType = lastQuestionChoice;
        } else if (isTie) {
            // 例外情況: 取平手陣列第一個
            finalType = tieTypes[0];
        }

        const result = resultData[finalType];
        
        resultIcon.textContent = result.icon;
        resultName.textContent = `你是【${result.name}】`;
        resultDesc.innerHTML = result.desc;
        
        // 滿進度條
        progressBar.style.width = '100%';
    }
});