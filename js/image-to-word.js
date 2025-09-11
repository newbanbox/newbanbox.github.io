/************************
*
*   图片转word
*
**************************/

 

function processImage() {
  const fileInput = document.getElementById('imageUpload');

  if (!fileInput.files || fileInput.files.length === 0) {
      alert('请上传图片');
      return;
  }

  const file = fileInput.files[0];
  const outputFormat = document.getElementById('outputFormat').value;

  // 显示加载动画
  document.getElementById('ocrLoading').style.display = 'block';
  document.getElementById('imageToWordResult').style.display = 'none';

  // 使用Tesseract.js进行OCR识别
  Tesseract.recognize(
      file,
      'chi_sim+eng', // 中文简体+英文
      {
          logger: progress => {
              if (progress.status === 'recognizing text') {
                  const progressBar = document.getElementById('ocrProgress');
                  progressBar.style.width = `${Math.round(progress.progress * 100)}%`;
              }
          }
      }
  ).then(({ data: { text } }) => {
      // 隐藏加载动画
      document.getElementById('ocrLoading').style.display = 'none';

      // 显示提取的文本
      document.getElementById('textPreview').textContent = text;
      document.getElementById('imageToWordResult').style.display = 'block';

      // 创建下载链接
      const downloadLink = document.getElementById('downloadText');
      const blob = new Blob([text], { type: 'text/plain' });
      downloadLink.href = URL.createObjectURL(blob);

      // 根据输出格式设置下载文件名
      let extension = 'txt';
      if (outputFormat === 'docx') extension = 'docx';
      else if (outputFormat === 'pdf') extension = 'pdf';

      downloadLink.download = `extracted_text.${extension}`;
      downloadLink.style.display = 'inline-block';
  }).catch(err => {
      console.error(err);
      alert('文字识别失败，请重试');
      document.getElementById('ocrLoading').style.display = 'none';
  });
}