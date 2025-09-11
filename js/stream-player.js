/************************
*
*    直播视频流播放
*
**************************/

// 在线直播功能
function playStream() {
    const streamUrl = document.getElementById('streamUrl').value;
    if (!streamUrl) {
        alert('请输入直播URL');
        return;
    }

    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = `
                 <div class="streamContainer" >
                <video id="liveVideo" class="video-player" controls autoplay>
                    <source src="${streamUrl}" type="application/x-mpegURL">
                    您的浏览器不支持视频播放
                </video>
                </div>
            `;
}