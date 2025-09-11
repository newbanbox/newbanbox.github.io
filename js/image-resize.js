/************************
*
*    图片调整尺寸
*
**************************/

// 处理图片尺寸调整上传
function handleResizeImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function () {
            // 显示预览区域
            document.getElementById('resizePreview').style.display = 'block';

            // 显示原始图片
            document.getElementById('originalPreview').src = e.target.result;

            // 设置默认尺寸
            document.getElementById('width').value = img.width;
            document.getElementById('height').value = img.height;

            // 更新预览
            updateResizePreview(img);
        };
    };
    reader.readAsDataURL(file);
}

// 更新尺寸调整预览
function updateResizePreview(img) {
    const fileInput = document.getElementById('resizeImageUpload');
    if (!fileInput.files || fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function () {
            const canvas = document.getElementById('resizedCanvas');
            const ctx = canvas.getContext('2d');

            // 获取尺寸参数
            const widthInput = document.getElementById('width');
            const heightInput = document.getElementById('height');
            const maintainAspect = document.getElementById('maintainAspect').checked;

            let newWidth = parseInt(widthInput.value) || img.width;
            let newHeight = parseInt(heightInput.value) || img.height;

            // 保持宽高比
            if (maintainAspect) {
                if (widthInput.value && !heightInput.value) {
                    newHeight = (img.height * newWidth) / img.width;
                    heightInput.value = Math.round(newHeight);
                } else if (!widthInput.value && heightInput.value) {
                    newWidth = (img.width * newHeight) / img.height;
                    widthInput.value = Math.round(newWidth);
                } else if (widthInput.value && heightInput.value) {
                    const ratio = img.width / img.height;
                    const newRatio = newWidth / newHeight;

                    if (newRatio > ratio) {
                        newHeight = newWidth / ratio;
                        heightInput.value = Math.round(newHeight);
                    } else {
                        newWidth = newHeight * ratio;
                        widthInput.value = Math.round(newWidth);
                    }
                }
            }

            // 设置画布尺寸
            canvas.width = newWidth;
            canvas.height = newHeight;

            // 绘制调整后的图片
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
        };
    };
    reader.readAsDataURL(file);
}

// 下载调整尺寸后的图片
function downloadResizedImage() {
    const canvas = document.getElementById('resizedCanvas');
    if (!canvas || canvas.width === 0) {
        alert('请先上传图片并调整尺寸');
        return;
    }

    const downloadLink = document.getElementById('downloadResized');
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = `resized_${canvas.width}x${canvas.height}.png`;
    downloadLink.style.display = 'inline-block';
    downloadLink.click();
}