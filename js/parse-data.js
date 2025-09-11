/************************
*
*    数据解析
*
**************************/
let currentCategory = 'all';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 初始化工具卡片
    renderTools(currentCategory);

    // 设置分类按钮事件
    setupCategoryButtons();


});

// 渲染工具卡片
function renderTools(category) {
    const toolsGrid = document.querySelector('.tools-grid');
    toolsGrid.innerHTML = '';

    // 筛选工具
    const filteredTools = category === 'all' ? tools : tools.filter(tool => tool.category === category);

    // 添加工具卡片
    filteredTools.forEach(tool => {
        const toolCard = createToolCard(tool);
        toolsGrid.appendChild(toolCard);

        // 添加进入动画
        setTimeout(() => {
            toolCard.classList.add('entering');
        }, 10);
    });

    // 添加"更多工具"卡片
    if (category === 'all') {
        const moreToolCard = createMoreToolCard();
        toolsGrid.appendChild(moreToolCard);

        setTimeout(() => {
            moreToolCard.classList.add('entering');
        }, 10);
    }
}

// 创建工具卡片
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.dataset.tool = tool.id;
    card.dataset.category = tool.category;

    card.innerHTML = `
        <div class="tool-card-header">
            <i class="fas fa-${tool.icon}"></i>
            <h3>${tool.title}</h3>
        </div>
        <div class="tool-card-body">
            <p>${tool.description}</p>
            <button class="tool-btn" onclick="openTool('${tool.id}')">${tool.button_text}</button>
        </div>
    `;

    return card;
}

// 创建"更多工具"卡片
function createMoreToolCard() {
    const card = document.createElement('div');
    card.className = 'tool-card';

    card.innerHTML = `
        <div class="tool-card-header">
            <i class="fas fa-plus-circle"></i>
            <h3>更多工具</h3>
        </div>
        <div class="tool-card-body">
            <p>我们持续开发更多实用工具，敬请期待！</p>
            <button class="tool-btn" disabled>即将上线</button>
        </div>
    `;

    return card;
}

// 设置分类按钮事件
function setupCategoryButtons() {
    const categoryBtns = document.querySelectorAll('.category-btn');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // 移除所有按钮的active类
            categoryBtns.forEach(b => b.classList.remove('active'));

            // 为当前按钮添加active类
            this.classList.add('active');

            // 获取分类
            const category = this.dataset.category;

            // 更新当前分类
            currentCategory = category;

            // 添加卡片离开动画
            const toolCards = document.querySelectorAll('.tool-card');
            toolCards.forEach(card => {
                card.classList.remove('entering');
                card.classList.add('leaving');
            });

            // 延迟渲染新分类的工具
            setTimeout(() => {
                renderTools(category);
            }, 400);
        });
    });
}
