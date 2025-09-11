/************************
*
*   m3u8视频下载
*
**************************/

let hlsPlayer = null;

// m3u8视频加载函数
function loadM3u8Video() {
    const m3u8Url = document.getElementById('m3u8Url').value;
    if (!m3u8Url) {
        alert('请输入m3u8视频URL');
        return;
    }

    document.getElementById('m3u8Loading').style.display = 'block';
    document.getElementById('videoContainer').style.display = 'none';
    document.getElementById('downloadBtn').style.display = 'none';

    const video = document.getElementById('m3u8Video');

    // 使用HLS.js播放m3u8视频
    if (Hls.isSupported()) {
        const hls = new Hls({
            maxBufferLength: 30,
            enableWorker: true,
            lowLatencyMode: true
        });

        hls.loadSource(m3u8Url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            document.getElementById('m3u8Loading').style.display = 'none';
            document.getElementById('videoContainer').style.display = 'block';
            document.getElementById('downloadBtn').style.display = 'inline-block';

            // 显示视频信息
            const levels = hls.levels;
            let infoHtml = `<p>视频信息:</p><ul>`;
            infoHtml += `<li>持续时间: ${Math.round(hls.media.duration)}秒</li>`;
            if (levels && levels.length > 0) {
                infoHtml += `<li>可用质量: ${levels.length}种</li>`;
                levels.forEach((level, index) => {
                    infoHtml += `<li>质量 ${index}: ${level.height}p, ${Math.round(level.bitrate / 1000)}kbps</li>`;
                });
            }
            infoHtml += `</ul>`;
            document.getElementById('videoInfo').innerHTML = infoHtml;

            video.play().catch(e => {
                console.log('自动播放被阻止，需要用户交互', e);
            });
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
            console.error('HLS错误:', data);
            document.getElementById('m3u8Loading').style.display = 'none';
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        alert('网络错误，请检查URL是否正确');
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        alert('媒体错误，视频可能无法播放');
                        break;
                    default:
                        alert('无法加载视频，请检查URL');
                        break;
                }
            }
        });

        hlsPlayer = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari原生支持
        video.src = m3u8Url;
        document.getElementById('m3u8Loading').style.display = 'none';
        document.getElementById('videoContainer').style.display = 'block';
        document.getElementById('downloadBtn').style.display = 'inline-block';

        video.addEventListener('loadedmetadata', function () {
            const infoHtml = `<p>视频信息:</p><ul>
                <li>持续时间: ${Math.round(video.duration)}秒</li>
                <li>分辨率: ${video.videoWidth}x${video.videoHeight}</li>
            </ul>`;
            document.getElementById('videoInfo').innerHTML = infoHtml;
        });
    } else {
        document.getElementById('m3u8Loading').style.display = 'none';
        alert('您的浏览器不支持HLS视频播放');
    }
}

// 下载m3u8视频
async function downloadM3u8Video() {
    const m3u8Url = document.getElementById('m3u8Url').value;
    if (!m3u8Url) {
        alert('请先加载视频');
        return;
    }

    // 显示下载进度
    document.getElementById('downloadProgress').style.display = 'block';
    const progressBar = document.getElementById('progressBar');
    const downloadLog = document.getElementById('downloadLog');
    progressBar.style.width = '0%';
    downloadLog.style.display = 'block';
    downloadLog.innerHTML = '开始解析m3u8文件...';

    try {
        // 获取m3u8文件内容
        const response = await fetch(m3u8Url);
        if (!response.ok) {
            throw new Error('获取m3u8文件失败');
        }
        const m3u8Content = await response.text();

        // 解析m3u8文件，获取分片URL
        const segments = parseM3U8(m3u8Content, m3u8Url);
        if (segments.length === 0) {
            throw new Error('未找到视频分片');
        }

        downloadLog.innerHTML = `找到 ${segments.length} 个视频分片，开始下载...`;
        segmentDownloadProgress = 0;
        segmentDownloadTotal = segments.length;

        // 下载所有分片
        const segmentData = [];
        for (let i = 0; i < segments.length; i++) {
            try {
                const segmentUrl = segments[i];
                downloadLog.innerHTML += `<br>下载分片 ${i + 1}/${segments.length}: ${segmentUrl}`;

                const segmentResponse = await fetch(segmentUrl);
                if (!segmentResponse.ok) {
                    throw new Error(`下载分片失败: ${segmentUrl}`);
                }

                const arrayBuffer = await segmentResponse.arrayBuffer();
                segmentData.push(arrayBuffer);

                // 更新进度
                segmentDownloadProgress = i + 1;
                const progress = Math.round((segmentDownloadProgress / segmentDownloadTotal) * 100);
                progressBar.style.width = `${progress}%`;

                // 滚动日志到底部
                downloadLog.scrollTop = downloadLog.scrollHeight;
            } catch (error) {
                console.error(`下载分片失败:`, error);
                downloadLog.innerHTML += `<br>分片下载失败: ${error.message}`;
            }
        }

        // 合并所有分片
        downloadLog.innerHTML += '<br>所有分片下载完成，正在合并...';

        // 计算总大小
        let totalSize = 0;
        segmentData.forEach(buffer => {
            totalSize += buffer.byteLength;
        });

        // 创建合并后的ArrayBuffer
        const mergedBuffer = new Uint8Array(totalSize);
        let offset = 0;
        segmentData.forEach(buffer => {
            mergedBuffer.set(new Uint8Array(buffer), offset);
            offset += buffer.byteLength;
        });

        // 创建Blob
        const blob = new Blob([mergedBuffer], { type: 'video/mp2t' });

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        downloadLog.innerHTML += '<br>视频合并完成，已开始下载！';
    } catch (error) {
        console.error('下载失败:', error);
        downloadLog.innerHTML += `<br>下载失败: ${error.message}`;
    }
}

// 解析m3u8文件
function parseM3U8(content, baseUrl) {
    const lines = content.split('\n');
    const segments = [];
    let isSegment = false;

    for (let line of lines) {
        line = line.trim();

        if (line.startsWith('#EXTINF:')) {
            isSegment = true;
            continue;
        }

        if (isSegment && line && !line.startsWith('#')) {
            // 处理相对路径
            let segmentUrl = line;
            if (!line.startsWith('http')) {
                const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
                segmentUrl = basePath + line;
            }
            segments.push(segmentUrl);
            isSegment = false;
        }
    }

    return segments;
}