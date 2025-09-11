/************************
*
*    短链生成器
*
**************************/

  // 生成短链
  function generateShortUrl() {
    const longUrl = document.getElementById('longUrl').value;
    const customAlias = document.getElementById('customAlias').value;

    if (!longUrl) {
        alert('请输入长URL');
        return;
    }

    // 生成短链（前端模拟）
    let shortUrl;
    if (customAlias) {
        shortUrl = window.location.origin + '/s/' + customAlias;
    } else {
        // 生成随机短码
        const shortCode = Math.random().toString(36).substring(2, 8);
        shortUrl = window.location.origin + '/s/' + shortCode;
    }

    // 存储映射关系到localStorage
    const urlMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
    urlMappings[shortUrl] = longUrl;
    localStorage.setItem('urlMappings', JSON.stringify(urlMappings));

    // 显示短链
    document.getElementById('shortUrl').textContent = shortUrl;
    document.getElementById('shortenerResult').style.display = 'block';
}

// 复制短链
function copyShortUrl() {
    const shortUrl = document.getElementById('shortUrl').textContent;
    if (!shortUrl) {
        alert('请先生成短链');
        return;
    }

    navigator.clipboard.writeText(shortUrl)
        .then(() => {
            alert('短链已复制到剪贴板');
        })
        .catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
}

// 短链重定向（在页面加载时检查）
function checkShortUrl() {
    const path = window.location.pathname;
    if (path.startsWith('/s/')) {
        const shortCode = path.substring(3);
        const shortUrl = window.location.origin + '/s/' + shortCode;

        const urlMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
        const longUrl = urlMappings[shortUrl];

        if (longUrl) {
            window.location.href = longUrl;
        } else {
            alert('短链接不存在或已过期');
        }
    }
}

// 页面加载时检查短链
window.onload = checkShortUrl;
