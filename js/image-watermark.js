/************************
*
*    图片添加水印
*
**************************/
let watermarkPreviewImage = null;
let watermarkPreviewCanvas = null;
let watermarkPreviewCtx = null;

// 处理水印图片上传
function handleWatermarkImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        watermarkPreviewImage = new Image();
        watermarkPreviewImage.src = e.target.result;

        watermarkPreviewImage.onload = function () {
            // 创建Canvas用于预览
            watermarkPreviewCanvas = document.getElementById('watermarkCanvas');
            watermarkPreviewCanvas.width = watermarkPreviewImage.width;
            watermarkPreviewCanvas.height = watermarkPreviewImage.height;
            watermarkPreviewCtx = watermarkPreviewCanvas.getContext('2d');

            // 显示预览区域
            document.getElementById('watermarkPreview').style.display = 'block';

            // 显示原始图片
            document.getElementById('originalWatermarkPreview').src = e.target.result;

            // 更新水印预览
            updateWatermarkPreview();
        };
    };
    reader.readAsDataURL(file);
}

// 更新水印预览
function updateWatermarkPreview() {
    if (!watermarkPreviewImage || !watermarkPreviewCanvas || !watermarkPreviewCtx) return;

    // 更新滑块值显示
    document.getElementById('opacityValue').textContent = document.getElementById('watermarkOpacity').value;
    document.getElementById('fontSizeValue').textContent = document.getElementById('watermarkFontSize').value;
    document.getElementById('rotationValue').textContent = document.getElementById('watermarkRotation').value + '°';

    // 清除画布
    watermarkPreviewCtx.clearRect(0, 0, watermarkPreviewCanvas.width, watermarkPreviewCanvas.height);

    // 绘制原始图片
    watermarkPreviewCtx.drawImage(watermarkPreviewImage, 0, 0);

    // 获取水印参数
    const watermarkText = document.getElementById('watermarkText').value;
    const color = document.getElementById('watermarkColor').value;
    const opacity = document.getElementById('watermarkOpacity').value / 10;
    const fontSize = parseInt(document.getElementById('watermarkFontSize').value);
    const rotation = parseInt(document.getElementById('watermarkRotation').value);
    const position = document.getElementById('watermarkPosition').value;

    // 设置水印样式
    watermarkPreviewCtx.font = `bold ${fontSize}px Arial`;
    watermarkPreviewCtx.fillStyle = `rgba(${hexToRgb(color)}, ${opacity})`;
    watermarkPreviewCtx.textAlign = 'center';
    watermarkPreviewCtx.textBaseline = 'middle';

    // 添加水印
    if (watermarkText) {
        if (position === 'tiled') {
            // 平铺水印
            addTiledWatermark(watermarkText, rotation, opacity);
        } else if (position === 'diagonal') {
            // 对角线水印
            addDiagonalWatermark(watermarkText, rotation, opacity);
        } else {
            // 单水印
            addSingleWatermark(watermarkText, position, rotation, opacity);
        }
    }
}

// 添加单个水印
function addSingleWatermark(text, position, rotation, opacity) {
    const canvas = watermarkPreviewCanvas;
    const ctx = watermarkPreviewCtx;

    let x, y;
    switch (position) {
        case 'top-left':
            x = canvas.width * 0.2;
            y = canvas.height * 0.2;
            break;
        case 'top-right':
            x = canvas.width * 0.8;
            y = canvas.height * 0.2;
            break;
        case 'bottom-left':
            x = canvas.width * 0.2;
            y = canvas.height * 0.8;
            break;
        case 'bottom-right':
            x = canvas.width * 0.8;
            y = canvas.height * 0.8;
            break;
        default: // center
            x = canvas.width / 2;
            y = canvas.height / 2;
    }

    // 添加旋转水印
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

// 添加平铺水印
function addTiledWatermark(text, rotation, opacity) {
    const canvas = watermarkPreviewCanvas;
    const ctx = watermarkPreviewCtx;
    const fontSize = parseInt(document.getElementById('watermarkFontSize').value);

    const textWidth = ctx.measureText(text).width;
    const spacingX = textWidth * 1.5;
    const spacingY = fontSize * 2;

    for (let y = 0; y < canvas.height; y += spacingY) {
        for (let x = 0; x < canvas.width; x += spacingX) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }
    }
}

// 添加对角线水印
function addDiagonalWatermark(text, rotation, opacity) {
    const canvas = watermarkPreviewCanvas;
    const ctx = watermarkPreviewCtx;
    const fontSize = parseInt(document.getElementById('watermarkFontSize').value);

    const textWidth = ctx.measureText(text).width;
    const spacing = textWidth * 1.5;

    // 左上到右下
    for (let i = -canvas.width; i < canvas.width * 2; i += spacing) {
        ctx.save();
        ctx.translate(i, i);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.fillText(text, 0, 0);
        ctx.restore();
    }
}

// 下载水印图片
function downloadWatermarkedImage() {
    if (!watermarkPreviewCanvas) {
        alert('请先上传图片并添加水印');
        return;
    }

    const watermarkText = document.getElementById('watermarkText').value;
    if (!watermarkText) {
        alert('请输入水印文字');
        return;
    }

    // 显示下载链接
    const downloadLink = document.getElementById('downloadWatermarked');
    downloadLink.href = watermarkPreviewCanvas.toDataURL('image/png');
    downloadLink.download = `watermarked_${watermarkText}.png`;
    downloadLink.style.display = 'inline-block';
    downloadLink.click();
}

 // 辅助函数：十六进制颜色转RGB
 function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}
