/************************
*
*    图片压缩器
*
**************************/


        // 图片压缩功能
        function compressImage() {
            const fileInput = document.getElementById('compressImage');
            const quality = parseFloat(document.getElementById('qualityLevel').value);

            if (!fileInput.files || fileInput.files.length === 0) {
                alert('请上传图片');
                return;
            }

            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;

                img.onload = function () {
                    // 显示原始图片
                    document.getElementById('originalPreview').src = img.src;
                    document.getElementById('originalSize').textContent = `尺寸: ${img.width}x${img.height} | 大小: ${formatFileSize(file.size)}`;

                    // 创建Canvas进行压缩
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // 获取压缩后的数据URL
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

                    // 显示压缩后的图片
                    document.getElementById('compressedPreview').src = compressedDataUrl;

                    // 计算压缩后的大小
                    const compressedSize = Math.round((compressedDataUrl.length - 'data:image/jpeg;base64,'.length) * 3 / 4);
                    document.getElementById('compressedSize').textContent = `尺寸: ${img.width}x${img.height} | 大小: ${formatFileSize(compressedSize)}`;

                    // 保存压缩后的数据URL供下载使用
                    document.getElementById('compressedPreview').dataset.url = compressedDataUrl;

                    // 显示结果
                    document.getElementById('compressionResult').style.display = 'flex';
                };
            };

            reader.readAsDataURL(file);
        }

        // 下载压缩后的图片
        function downloadCompressedImage() {
            const dataUrl = document.getElementById('compressedPreview').dataset.url;
            if (!dataUrl) {
                alert('请先生成压缩图片');
                return;
            }

            const link = document.createElement('a');
            link.download = 'compressed_image.jpg';
            link.href = dataUrl;
            link.click();
        }

        // 格式化文件大小
        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' bytes';
            else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
            else return (bytes / 1048576).toFixed(2) + ' MB';
        }