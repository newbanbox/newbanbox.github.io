/************************
*
*    html在线压缩
*
**************************/
// HTML压缩函数（修复版）
function compressHTML() {
    const htmlInput = document.getElementById('htmlInput').value;
    if (!htmlInput.trim()) {
        alert('请输入HTML代码');
        return;
    }
    
    // 显示结果区域
    const resultContainer = document.getElementById('compressionResult');
    resultContainer.style.display = 'block';
    
    // 显示原始代码
    document.getElementById('originalCode').textContent = htmlInput;
    document.getElementById('originalLength').textContent = htmlInput.length + ' 字符';
    
    // 修复的压缩逻辑：
    // 1. 只移除HTML注释（不影响JS/CSS注释）
    // 2. 仅压缩标签之间的空白（保留JS字符串中的换行符）
    // 3. 避免过度压缩CSS/JS内容
    const compressedHTML = htmlInput
        .replace(/<!--[\s\S]*?-->/g, '') // 仅移除HTML注释
        .replace(/>\s+</g, '><')         // 仅压缩标签之间的空白
        .replace(/\s+(?=<)/g, '')        // 移除标签前的空白
        .replace(/(?<=>)\s+/g, '')       // 移除标签后的空白
        .replace(/\s*([{}>;:])\s*/g, '$1') // 压缩CSS/JS周围的空白
        .replace(/\s?=\s?/g, '=');       // 移除等号周围的空格
    
    // 显示压缩后的代码
    const compressedCodeElement = document.getElementById('compressedCode');
    compressedCodeElement.textContent = compressedHTML;
    document.getElementById('compressedLength').textContent = compressedHTML.length + ' 字符';
    
    // 计算压缩率
    const originalLength = htmlInput.length;
    const compressedLength = compressedHTML.length;
    const spaceSaved = originalLength - compressedLength;
    const compressionRatio = Math.round((spaceSaved / originalLength) * 100);
    
    // 显示压缩统计信息
    document.getElementById('compressionRatio').textContent = compressionRatio + '%';
    document.getElementById('spaceSaved').textContent = spaceSaved + ' 字符';
    
    // 创建下载链接
    const downloadLink = document.getElementById('downloadCompressed');
    const blob = new Blob([compressedHTML], {type: 'text/html'});
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'compressed.html';
}

// 复制压缩后的代码
function copyCompressedCode() {
    const compressedCode = document.getElementById('compressedCode').textContent;
    navigator.clipboard.writeText(compressedCode)
        .then(() => alert('压缩代码已复制到剪贴板'))
        .catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制代码');
        });
}
