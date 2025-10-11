/************************
*
*    FC在线游戏
*
**************************/
// 初始化游戏
function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布背景
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制游戏标题
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FC在线游戏', canvas.width/2, canvas.height/2 - 20);
    ctx.font = '14px Arial';
    ctx.fillText('请选择游戏并点击"开始游戏"', canvas.width/2, canvas.height/2 + 10);
    
    // 添加游戏控制事件监听
    document.addEventListener('keydown', handleGameKeyDown);
}

// 选择游戏
function selectGame(gameName) {
    currentGame = gameName;
    
    // 更新游戏选择状态
    const gameItems = document.querySelectorAll('.game-item');
    gameItems.forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // 更新游戏标题
    document.querySelector('.game-title').textContent = getGameTitle(gameName);
    
    // 重置游戏状态
    resetGame();
}

// 获取游戏标题
function getGameTitle(gameName) {
    const titles = {
        'super-mario': '超级马里奥',
        'contra': '魂斗罗',
        'tetris': '俄罗斯方块',
        'pacman': '吃豆人'
    };
    return titles[gameName] || 'FC游戏';
}

// 切换游戏状态（开始/暂停）
function toggleGameState() {
    const stateElement = document.querySelector('.game-state');
    
    if (gameState === 'paused') {
        gameState = 'playing';
        stateElement.textContent = '游戏中';
        stateElement.className = 'game-state playing';
        startGame();
    } else {
        gameState = 'paused';
        stateElement.textContent = '已暂停';
        stateElement.className = 'game-state paused';
        pauseGame();
    }
}

// 开始游戏
function startGame() {
    if (!currentGame) {
        alert('请先选择一个游戏');
        return;
    }
    
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制游戏内容（模拟）
    drawGameScreen(currentGame);
}

// 暂停游戏
function pauseGame() {
    // 在实际实现中，这里会暂停游戏循环
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 绘制暂停状态
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏暂停', canvas.width/2, canvas.height/2);
}

// 重置游戏
function resetGame() {
    gameState = 'paused';
    document.querySelector('.game-state').textContent = '已暂停';
    document.querySelector('.game-state').className = 'game-state paused';
    
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制游戏标题
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FC在线游戏', canvas.width/2, canvas.height/2 - 20);
    ctx.font = '14px Arial';
    ctx.fillText('请选择游戏并点击"开始游戏"', canvas.width/2, canvas.height/2 + 10);
}

// 绘制游戏画面（模拟）
function drawGameScreen(gameName) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 根据游戏绘制不同内容
    switch(gameName) {
        case 'super-mario':
            drawMarioScreen(ctx);
            break;
        case 'contra':
            drawContraScreen(ctx);
            break;
        case 'tetris':
            drawTetrisScreen(ctx);
            break;
        case 'pacman':
            drawPacmanScreen(ctx);
            break;
        default:
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('游戏加载中...', canvas.width/2, canvas.height/2);
    }
}

// 绘制马里奥游戏画面
function drawMarioScreen(ctx) {
    // 绘制背景
    ctx.fillStyle = '#6b8cff';
    ctx.fillRect(0, 0, 256, 240);
    
    // 绘制地面
    ctx.fillStyle = '#8c6b3d';
    ctx.fillRect(0, 200, 256, 40);
    
    // 绘制砖块
    ctx.fillStyle = '#c84c0c';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(50 + i*32, 150, 16, 16);
    }
    
    // 绘制问号砖块
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(100, 120, 16, 16);
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText('?', 104, 132);
    
    // 绘制马里奥
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(80, 184, 16, 16); // 身体
    ctx.fillStyle = '#ffcc66';
    ctx.fillRect(80, 180, 16, 4); // 脸
    ctx.fillStyle = '#000';
    ctx.fillRect(84, 180, 2, 2); // 眼睛
}

// 绘制魂斗罗游戏画面
function drawContraScreen(ctx) {
    // 绘制背景
    ctx.fillStyle = '#306850';
    ctx.fillRect(0, 0, 256, 240);
    
    // 绘制地面
    ctx.fillStyle = '#8c6b3d';
    ctx.fillRect(0, 220, 256, 20);
    
    // 绘制玩家
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(120, 190, 12, 30); // 身体
    ctx.fillStyle = '#ffcc66';
    ctx.fillRect(120, 185, 12, 5); // 脸
    
    // 绘制敌人
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(180, 190, 12, 30);
    ctx.fillStyle = '#000';
    ctx.fillRect(184, 190, 4, 4);
}

// 绘制俄罗斯方块游戏画面
function drawTetrisScreen(ctx) {
    // 绘制背景
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 256, 240);
    
    // 绘制游戏区域
    ctx.fillStyle = '#333';
    ctx.fillRect(50, 20, 160, 200);
    
    // 绘制方块
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 5; j++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            ctx.fillStyle = color;
            ctx.fillRect(60 + i*16, 30 + j*16, 14, 14);
        }
    }
    
    // 绘制当前方块
    ctx.fillStyle = '#ff9900';
    ctx.fillRect(120, 120, 14, 14);
    ctx.fillRect(136, 120, 14, 14);
    ctx.fillRect(120, 136, 14, 14);
    ctx.fillRect(104, 136, 14, 14);
}

// 绘制吃豆人游戏画面
function drawPacmanScreen(ctx) {
    // 绘制背景
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 256, 240);
    
    // 绘制迷宫
    ctx.strokeStyle = '#0000ff';
    ctx.lineWidth = 2;
    
    // 水平线
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(20, 40 + i*20);
        ctx.lineTo(236, 40 + i*20);
        ctx.stroke();
    }
    
    // 垂直线
    for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.moveTo(20 + i*20, 40);
        ctx.lineTo(20 + i*20, 220);
        ctx.stroke();
    }
    
    // 绘制豆子
    ctx.fillStyle = '#ffff00';
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            ctx.beginPath();
            ctx.arc(30 + i*20, 50 + j*20, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 绘制吃豆人
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(100, 100, 10, 0.2, Math.PI * 1.8);
    ctx.lineTo(100, 100);
    ctx.fill();
    
    // 绘制幽灵
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(180, 100, 10, 0, Math.PI);
    ctx.lineTo(170, 120);
    ctx.lineTo(190, 120);
    ctx.closePath();
    ctx.fill();
}

// 处理游戏按键
function handleGameKeyDown(event) {
    if (!currentGame || gameState !== 'playing') return;
    
    const key = event.key.toLowerCase();
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 根据按键更新游戏状态
    switch(key) {
        case 'arrowleft':
        case 'a':
            // 左移逻辑
            break;
        case 'arrowright':
        case 'd':
            // 右移逻辑
            break;
        case 'arrowup':
        case 'w':
            // 上移/跳跃逻辑
            break;
        case 'arrowdown':
        case 's':
            // 下移/蹲下逻辑
            break;
        case 'z':
            // 攻击/动作A
            break;
        case 'x':
            // 跳跃/动作B
            break;
        case 'enter':
            toggleGameState();
            break;
        case 'escape':
            toggleGameState();
            break;
    }
    
    // 重新绘制游戏画面
    drawGameScreen(currentGame);
}

// 显示操作说明
function showControlsInfo() {
    const controlsInfo = document.querySelector('.controls-info');
    controlsInfo.style.display = controlsInfo.style.display === 'none' ? 'block' : 'none';
}

// 选择存档槽位
function selectSaveSlot(slotIndex) {
    const saveSlots = document.querySelectorAll('.save-slot');
    saveSlots.forEach(slot => slot.classList.remove('active'));
    saveSlots[slotIndex].classList.add('active');
}

// 保存游戏
function saveGame() {
    const saveSlots = document.querySelectorAll('.save-slot');
    let activeSlot = -1;
    
    // 查找选中的存档槽
    saveSlots.forEach((slot, index) => {
        if (slot.classList.contains('active')) {
            activeSlot = index;
        }
    });
    
    if (activeSlot === -1) {
        alert('请先选择一个存档槽位');
        return;
    }
    
    if (!currentGame) {
        alert('请先开始一个游戏');
        return;
    }
    
    // 模拟保存游戏数据
    const saveData = {
        game: currentGame,
        timestamp: new Date().toLocaleString(),
        slot: activeSlot
    };
    
    // 更新存档槽显示
    saveSlots[activeSlot].classList.remove('empty');
    saveSlots[activeSlot].querySelector('.save-info').textContent = 
        `${getGameTitle(currentGame)} - ${saveData.timestamp}`;
    
    // 存储到存档数组
    gameSaveSlots[activeSlot] = saveData;
    
    alert(`游戏已保存到存档槽 ${activeSlot + 1}`);
}

// 加载游戏
function loadGame() {
    const saveSlots = document.querySelectorAll('.save-slot');
    let activeSlot = -1;
    
    // 查找选中的存档槽
    saveSlots.forEach((slot, index) => {
        if (slot.classList.contains('active')) {
            activeSlot = index;
        }
    });
    
    if (activeSlot === -1) {
        alert('请先选择一个存档槽位');
        return;
    }
    
    const saveData = gameSaveSlots[activeSlot];
    
    if (!saveData) {
        alert('该存档槽位为空');
        return;
    }
    
    // 加载游戏
    currentGame = saveData.game;
    selectGame(currentGame);
    toggleGameState();
    
    alert(`已加载存档槽 ${activeSlot + 1} 的游戏进度`);
}