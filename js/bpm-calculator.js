/************************
*
*    BPM计算器
*
**************************/
// BPM计算器逻辑

let tapTimes = [];
let lastTapTime = 0;

let bpmDisplay ;
let tapCount ;
let tapButton ;
let resetBtn ;
let infoBtn ;
let beatBar ;
let beatIndicator;
// 初始化
function initBpmCalculator() {
     bpmDisplay = document.getElementById('bpmDisplay');
     tapCount = document.getElementById('tapCount');
     tapButton = document.getElementById('tapButton');
     resetBtn = document.getElementById('resetBtn');
     infoBtn = document.getElementById('infoBtn');
     beatBar = document.getElementById('beatBar');
     beatIndicator = document.getElementById('beatIndicator');
    

    tapTimes = [];
    updateDisplay();
    // 添加事件监听
    tapButton.addEventListener('click', tap);
    resetBtn.addEventListener('click', resetBpm);
    infoBtn.addEventListener('click', showInstructions);
    document.addEventListener('keydown', handleKeyPress);
}

// 处理键盘事件
function handleKeyPress(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        tap();
    }
}

// 敲击事件
function tap() {
    const now = Date.now();
    
    // 防止连续点击过快
    if (now - lastTapTime < 100) return;
    lastTapTime = now;
    
    // 添加敲击时间
    tapTimes.push(now);
    
    // 保留最近10次敲击
    if (tapTimes.length > 10) {
        tapTimes.shift();
    }
    
    // 更新显示
    updateDisplay();
    
    // 添加视觉反馈
    animateBeat();
    
    // 计算BPM
    calculateBpm();
}

// 更新显示
function updateDisplay() {
    tapCount.textContent = tapTimes.length.toString();
    // 添加脉冲动画
    if (tapTimes.length > 0) {
        bpmDisplay.classList.add('active');
        setTimeout(() => {
            bpmDisplay.classList.remove('active');
        }, 300);
    }
}

// 计算BPM
function calculateBpm() {
    if (tapTimes.length < 2) {
        bpmDisplay.textContent = '0';
        return;
    }
    
    // 计算平均间隔
    const intervals = [];
    for (let i = 1; i < tapTimes.length; i++) {
        intervals.push(tapTimes[i] - tapTimes[i - 1]);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const bpm = Math.round(60000 / avgInterval);
    
    bpmDisplay.textContent = bpm;
}

// 重置
function resetBpm() {
    tapTimes = [];
    updateDisplay();
    bpmDisplay.textContent = '0';
}

// 显示使用说明
function showInstructions() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let instructions = '使用说明：\n\n';
    
    instructions += '1. 随着歌曲节奏点击蓝色区域\n';
    
    if (!isMobile) {
        instructions += '2. 或者按空格键记录节拍\n';
    }
    
    instructions += '3. 至少敲击4次才能获得准确结果\n';
    instructions += '4. 点击重置按钮可以重新开始\n\n';
    
    if (isMobile) {
        instructions += '移动端提示：\n';
        instructions += '- 请确保在安静环境下使用\n';
        instructions += '- 点击区域时尽量保持节奏稳定\n';
        instructions += '- 结果会随着敲击次数增加变得更准确';
    } else {
        instructions += '桌面端提示：\n';
        instructions += '- 可以使用空格键代替点击\n';
        instructions += '- 结果会随着敲击次数增加变得更准确';
    }
    
    alert(instructions);
}

// 添加节拍动画
function animateBeat() {
    // 节拍指示器动画
    beatIndicator.classList.remove('active');
    setTimeout(() => {
        beatIndicator.classList.add('active');
    }, 10);
    
    // 节拍条动画
    beatBar.style.transform = 'scaleX(1)';
    setTimeout(() => {
        beatBar.style.transform = 'scaleX(0)';
    }, 100);
}
