/************************
*
*    每日新闻
*
**************************/
  // 加载新闻数据
  function loadNews() {
    const loadingElement = document.getElementById('newsLoading');
    const contentElement = document.getElementById('newsContent');
    const errorElement = document.getElementById('newsError');
    
    // 显示加载状态
    if (loadingElement) loadingElement.style.display = 'block';
    if (contentElement) contentElement.style.display = 'none';
    if (errorElement) errorElement.style.display = 'none';
    
    // 构造请求URL
    const url = new URL('https://v3.alapi.cn/api/zaobao');
    url.searchParams.append('token', '99ky22otr7uxw4wcvl949wsioe1wz5');
    url.searchParams.append('format', 'json');
    
    // 发送请求
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data) {
                renderNews(data.data);
                if (loadingElement) loadingElement.style.display = 'none';
                if (contentElement) contentElement.style.display = 'block';
            } else {
                throw new Error(data.message || '加载新闻失败');
            }
        })
        .catch(error => {
            console.error('加载新闻失败:', error);
            if (loadingElement) loadingElement.style.display = 'none';
            if (errorElement) errorElement.style.display = 'block';
        });
}

// 渲染新闻数据
function renderNews(newsData) {
    // 设置日期
    const dateElement = document.getElementById('newsDate');
    if (dateElement) {
        dateElement.textContent = newsData.date || '今日新闻';
    }
    
    // 设置新闻图片
    const imageElement = document.getElementById('newsImage');
    if (imageElement && newsData.image) {
        imageElement.src = newsData.image;
        imageElement.alt = newsData.date + '新闻图片';
    }
    
    // 设置新闻列表
    const listElement = document.getElementById('newsList');
    if (listElement && newsData.news) {
        listElement.innerHTML = '';
        newsData.news.forEach((item, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'news-item';
            listItem.innerHTML = `
                <span class="news-item-number">${index + 1}</span>
                ${item}
            `;
            listElement.appendChild(listItem);
        });
    }
    
    // 设置微语
    const weiyuElement = document.getElementById('newsWeiyu');
    if (weiyuElement && newsData.weiyu) {
        weiyuElement.textContent = newsData.weiyu;
    }
}