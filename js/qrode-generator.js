/************************
*
*    二维码生成器
*
**************************/

  // 二维码生成功能
  function generateQRCode() {
    const content = document.getElementById('qrContent').value;
    const size = parseInt(document.getElementById('qrSize').value);

    if (!content) {
        alert('请输入二维码内容');
        return;
    }

    const qrContainer = document.getElementById('qrResult');
    const qrElement = document.getElementById('qrcode');

    // 清空之前的二维码
    qrElement.innerHTML = '';

    // 生成二维码
    new QRCode(qrElement, {
        text: content,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    qrContainer.style.display = 'block';
}

// 下载二维码
function downloadQRCode() {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        alert('请先生成二维码');
        return;
    }

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}