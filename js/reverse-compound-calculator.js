/************************
*
*    复利逆推计算器
*
**************************/
// 复利逆推计算函数
function calculateReverseCompoundInterest() {
    const principal = parseFloat(document.getElementById('reversePrincipal').value);
    const finalAmount = parseFloat(document.getElementById('reverseFinalAmount').value);
    const time = parseFloat(document.getElementById('reverseTime').value);
    const frequency = parseFloat(document.getElementById('reverseCompoundFrequency').value);
    
    if (!principal || !finalAmount || !time) {
        alert('请填写所有字段');
        return;
    }
    
    if (principal <= 0 || finalAmount <= 0 || time <= 0) {
        alert('输入值必须大于0');
        return;
    }
    
    if (finalAmount < principal) {
        alert('最终资产不能小于本金');
        return;
    }
    
    // 计算公式：年化收益率 = [(最终资产/本金)^(1/年数) - 1] × 100%
    const ratio = finalAmount / principal;
    const exponent = 1 / time;
    const base = Math.pow(ratio, exponent);
    const rate = (base - 1) * 100;
    
    // 将结果保留两位小数
    const ratePercent = rate.toFixed(2);
    
    // 更新结果展示
    document.getElementById('reverseResultValue').textContent = ratePercent + '%';
    document.getElementById('reverseResultPrincipal').textContent = principal.toFixed(2);
    document.getElementById('reverseResultFinalAmount').textContent = finalAmount.toFixed(2);
    document.getElementById('reverseResultTime').textContent = time;
    
    // 获取复利频率文本
    const frequencyText = getFrequencyText(frequency);
    document.getElementById('reverseResultFrequency').textContent = frequencyText;
    
    // 显示结果区域
    document.getElementById('reverseResult').style.display = 'block';
    
    // 创建可视化图表
    createVisualization(principal, finalAmount, time);
    
    // 创建下载链接
    const downloadLink = document.getElementById('downloadReverseResult');
    const resultText = `复利逆推计算结果：
本金: ${principal.toFixed(2)} 元
最终资产: ${finalAmount.toFixed(2)} 元
投资时间: ${time} 年
复利频率: ${frequencyText}
年化收益率: ${ratePercent}%
    `;
    const blob = new Blob([resultText], {type: 'text/plain'});
    downloadLink.href = URL.createObjectURL(blob);
}

// 根据频率值获取文本描述
function getFrequencyText(freq) {
    switch(freq) {
        case 1: return '每年';
        case 2: return '每半年';
        case 4: return '每季度';
        case 12: return '每月';
        default: return freq + '次/年';
    }
}
// 创建可视化图表
function createVisualization(principal, finalAmount, years) {
    const container = document.getElementById('reverseVisualization');
    container.innerHTML = '';
    
    // 创建两个柱状图：本金和最终资产
    const visualization = document.createElement('div');
    visualization.className = 'visualization';
    
    // 本金柱状图
    const principalBar = document.createElement('div');
    principalBar.className = 'bar';
    principalBar.style.height = '40px';
    principalBar.style.backgroundColor = '#4361ee';
    
    const principalLabel = document.createElement('div');
    principalLabel.className = 'bar-label';
    principalLabel.textContent = '本金';
    
    const principalValue = document.createElement('div');
    principalValue.className = 'bar-value';
    principalValue.textContent = principal.toFixed(2);
    
    principalBar.appendChild(principalValue);
    principalBar.appendChild(principalLabel);
    visualization.appendChild(principalBar);
    
    // 最终资产柱状图
    const finalBar = document.createElement('div');
    finalBar.className = 'bar';
    finalBar.style.height = '80px';
    finalBar.style.backgroundColor = '#4cc9f0';
    
    const finalLabel = document.createElement('div');
    finalLabel.className = 'bar-label';
    finalLabel.textContent = '最终资产';
    
    const finalValue = document.createElement('div');
    finalValue.className = 'bar-value';
    finalValue.textContent = finalAmount.toFixed(2);
    
    finalBar.appendChild(finalValue);
    finalBar.appendChild(finalLabel);
    visualization.appendChild(finalBar);
    
    // 添加增长箭头
    const arrow = document.createElement('div');
    arrow.style.display = 'flex';
    arrow.style.flexDirection = 'column';
    arrow.style.alignItems = 'center';
    arrow.style.justifyContent = 'center';
    arrow.style.width = '50px';
    
    const arrowIcon = document.createElement('i');
    arrowIcon.className = 'fas fa-arrow-right';
    arrowIcon.style.fontSize = '24px';
    arrowIcon.style.color = '#3a0ca3';
    
    const arrowText = document.createElement('div');
    arrowText.textContent = years + '年';
    arrowText.style.fontSize = '0.9rem';
    arrowText.style.marginTop = '5px';
    
    arrow.appendChild(arrowIcon);
    arrow.appendChild(arrowText);
    visualization.appendChild(arrow);
    
    container.appendChild(visualization);
}