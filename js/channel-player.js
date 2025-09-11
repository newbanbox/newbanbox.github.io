/************************
*
*    电视TV 在线播放
*
**************************/

// 电视直播频道数据
const tvChannels = [
    {
        id: 1,
        name: "CCTV-1 综合",
        category: "综合",
        url: "http://vjs.zencdn.net/v/oceans.mp4",
        type: "rtmp/mp4",
        thumb: "https://via.placeholder.com/200x120?text=CCTV1"
    },
    {
        id: 2,
        name: "CCTV-5 体育",
        category: "体育",
        type: "rtmp/mp4",
        url: "https://cctvcnch5c.v.wscdns.com/live/cctv5_2/index.m3u8",
        thumb: "https://via.placeholder.com/200x120?text=CCTV5"
    },
    {
        id: 3,
        name: "湖南卫视",
        category: "娱乐",
        type: "rtmp/mp4",
        url: "https://hw-m-l.cztv.com/channels/lantian/channel001/720p.m3u8",
        thumb: "https://via.placeholder.com/200x120?text=湖南卫视"
    },
    {
        id: 4,
        name: "浙江卫视",
        category: "综合",
        type: "rtmp/mp4",
        url: "https://hw-m-l.cztv.com/channels/lantian/channel002/720p.m3u8",
        thumb: "https://via.placeholder.com/200x120?text=浙江卫视"
    },
    {
        id: 5,
        name: "东方卫视",
        category: "综合",
        type: "rtmp/mp4",
        url: "https://hw-m-l.cztv.com/channels/lantian/channel003/720p.m3u8",
        thumb: "https://via.placeholder.com/200x120?text=东方卫视"
    },
    {
        id: 6,
        name: "江苏卫视",
        category: "综合",
        type: "rtmp/mp4",
        url: "https://hw-m-l.cztv.com/channels/lantian/channel004/720p.m3u8",
        thumb: "https://via.placeholder.com/200x120?text=江苏卫视"
    },
    {
        id: 7,
        name: "北京卫视",
        category: "综合",
        type: "rtmp/mp4",
        url: "https://hw-m-l.cztv.com/channels/lantian/channel005/720p.m3u8",
        thumb: "https://via.placeholder.com/200x120?text=北京卫视"
    },
    {
        id: 8,
        name: "凤凰卫视",
        category: "新闻",
        type: "rtmp/mp4",
        url: "https://liveali.ifeng.com/live/FHZX.m3u8",
        thumb: "https://via.placeholder.com/200x120?text=凤凰卫视"
    },
    {
        id: 9,
        name: "探索频道",
        category: "纪录片",
        type: "rtmp/mp4",
        url: "https://playout4s.mediastreaming.it/diskoverit/playlist.m3u8",
        thumb: "https://via.placeholder.com/200x120?text=探索频道"
    },
    {
        id: 10,
        name: "国家地理",
        category: "纪录片",
        type: "video/x-flv",
        url: "https://playout4s.mediastreaming.it/natgeowild/playlist.m3u8",
        thumb: "https://via.placeholder.com/200x120?text=国家地理"
    },
    {
        id: 11,
        name: "M3U8测试",
        category: "测试",
        type: "application/x-mpegURL",
        url: "https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8",
        thumb: "https://via.placeholder.com/200x120?text=国家地理"
    },
    {
        id: 12,
        name: "MP4测试",
        category: "测试",
        url: "http://vjs.zencdn.net/v/oceans.mp4",
        type: "video/mp4",
        thumb: "https://via.placeholder.com/200x120?text=国家地理"
    }
];
function initTVPlayer() {
    tvPlayer = videojs('tvPlayer', {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2]
    });
}

function renderChannelList(channels) {
    const channelList = document.getElementById('channelList');
    channelList.innerHTML = '';

    channels.forEach(channel => {
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-item';
        channelItem.innerHTML = `
            <img src="${channel.thumb}" alt="${channel.name}" class="channel-thumb">
            <div class="channel-info">
                <div class="channel-name">${channel.name}</div>
                <div class="channel-category">${channel.category}</div>
            </div>
        `;
        channelItem.addEventListener('click', () => playChannel(channel));
        channelList.appendChild(channelItem);
    });
}

function playChannel(channel) {
    if (!tvPlayer) return;
    // 移除现有的警告信息
    const existingWarnings = document.querySelectorAll('.warning-message');
    existingWarnings.forEach(warning => warning.remove());

    document.getElementById('currentChannel').textContent = channel.name;

    let srcObj = {
        src: channel.url,
        type: channel.type
    };

    if (channel.type === 'rtmp/mp4') {
        const warning = document.createElement('div');
        warning.className = 'warning-message';
        warning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> RTMP格式依赖Flash播放器，现代浏览器已不再支持Flash。建议使用HLS或MP4格式。';
        const playerContainer = document.querySelector('.tv-player-container');
        if (!playerContainer.querySelector('.warning-message')) {
            playerContainer.appendChild(warning);
        }
    }

    tvPlayer.src(srcObj);
    tvPlayer.play();
}

function setupCategoryFilters() {
    const categories = document.querySelectorAll('.tv-category');
    categories.forEach(cat => {
        cat.addEventListener('click', function () {
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            let filteredChannels = tvChannels;

            if (category !== 'all') {
                filteredChannels = tvChannels.filter(ch => ch.category === category);
            }

            renderChannelList(filteredChannels);
        });
    });
}

function searchChannels() {
    const searchTerm = document.getElementById('tvSearch').value.toLowerCase();
    if (!searchTerm) {
        renderChannelList(tvChannels);
        return;
    }

    const filteredChannels = tvChannels.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm) ||
        channel.category.toLowerCase().includes(searchTerm)
    );

    renderChannelList(filteredChannels);
}

function toggleFullscreen() {
    if (!tvPlayer) return;

    if (tvPlayer.isFullscreen()) {
        tvPlayer.exitFullscreen();
    } else {
        tvPlayer.requestFullscreen();
    }
}

function toggleMute() {
    if (!tvPlayer) return;

    tvPlayer.muted(!tvPlayer.muted());
    const muteBtn = document.querySelector('.tv-controls button:last-child');
    muteBtn.innerHTML = tvPlayer.muted() ?
        '<i class="fas fa-volume-mute"></i>' :
        '<i class="fas fa-volume-up"></i>';
}