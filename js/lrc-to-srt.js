/************************
*
*    LRC转SRT
*
**************************/

 
// LRC转SRT功能
function convertLrcToSrt() {
    const fileInput = document.getElementById('lrcFile');
    const offset = parseInt(document.getElementById('offset').value) || 0;

    if (!fileInput.files || fileInput.files.length === 0) {
        alert('请上传LRC文件');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    document.getElementById('lrcLoading').style.display = 'block';
    document.getElementById('lrcResult').style.display = 'none';

    reader.onload = function (e) {
        const lrcContent = e.target.result;
        const srtContent = convertLrcToSrtFormat(lrcContent, offset);

        document.getElementById('lrcLoading').style.display = 'none';
        document.getElementById('lrcResult').style.display = 'block';

        document.getElementById('srtPreview').value = srtContent;

        const downloadLink = document.getElementById('downloadSrt');
        const blob = new Blob([srtContent], { type: 'text/plain' });
        downloadLink.href = URL.createObjectURL(blob);
    };

    reader.readAsText(file);
}

// LRC转SRT格式转换函数
function convertLrcToSrtFormat(lrcContent, offset = 0) {
    const lines = lrcContent.split('\n');
    let srtContent = '';
    let counter = 1;
    const lyrics = [];

    // 解析LRC文件
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // 匹配时间标签 [mm:ss.xx]
        const timeRegex = /\[(\d+):(\d+)\.(\d+)\]/g;
        let match;
        const times = [];

        while ((match = timeRegex.exec(line)) !== null) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const milliseconds = parseInt(match[3]) * 10; // 转换为毫秒
            const timeMs = (minutes * 60 + seconds) * 1000 + milliseconds + offset;
            times.push(timeMs);
        }

        // 获取歌词文本
        const text = line.replace(timeRegex, '').trim();

        // 为每个时间标签创建歌词条目
        for (const timeMs of times) {
            lyrics.push({
                time: timeMs,
                text: text
            });
        }
    }

    // 按时间排序
    lyrics.sort((a, b) => a.time - b.time);

    // 生成SRT内容
    for (let i = 0; i < lyrics.length; i++) {
        const startTime = lyrics[i].time;
        let endTime = startTime + 3000; // 默认3秒显示时间

        // 如果有下一个歌词，使用下一个歌词的时间作为结束时间
        if (i < lyrics.length - 1) {
            endTime = lyrics[i + 1].time;
        }

        // 格式化为SRT时间格式
        const startFormatted = formatSrtTime(startTime);
        const endFormatted = formatSrtTime(endTime);

        // 添加到SRT内容
        srtContent += `${counter++}\n`;
        srtContent += `${startFormatted} --> ${endFormatted}\n`;
        srtContent += `${lyrics[i].text}\n\n`;
    }

    return srtContent;
}

// 格式化SRT时间
function formatSrtTime(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    milliseconds %= 3600000;
    const minutes = Math.floor(milliseconds / 60000);
    milliseconds %= 60000;
    const seconds = Math.floor(milliseconds / 1000);
    const millis = milliseconds % 1000;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${millis.toString().padStart(3, '0')}`;
}
