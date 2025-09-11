/************************
*
*    复利计算器
*
**************************/
// 复利计算函数
function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const time = parseFloat(document.getElementById('time').value);
    const frequency = parseFloat(document.getElementById('compoundFrequency').value);

    if (!principal || !rate || !time) {
        alert('请填写所有字段');
        return;
    }

    // 复利计算公式: A = P(1 + r/n)^(nt)
    const amount = principal * Math.pow(1 + rate / frequency, frequency * time);
    const interest = amount - principal;

    const resultText = `
        初始本金: <b>${principal.toFixed(2)}</b> 元<br>
        最终金额: <b>${amount.toFixed(2)}</b> 元<br>
        利息收益: <b>${interest.toFixed(2)}</b> 元
    `;

    document.getElementById('resultText').innerHTML = resultText;
    document.getElementById('result').style.display = 'block';

    // 创建下载链接
    const downloadLink = document.getElementById('downloadResult');
    const blob = new Blob([resultText.replace(/<br>/g, '\n').replace(/<b>/g, '').replace(/<\/b>/g, '')], { type: 'text/plain' });
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.style.display = 'inline-block';
}