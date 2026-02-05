const video = document.getElementById('videoPlayer');
const playBtn = document.getElementById('playPauseBtn');
const progress = document.getElementById('progressFill');
const buffer = document.getElementById('progressBuffer');
const thumb = document.getElementById('progressThumb');
const timeDisplay = document.getElementById('timeDisplay');
const volume = document.getElementById('volumeSlider');
const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const progressContainer = document.getElementById('progressContainer');

let hls = null;

function loadVideo(url){
    if(hls){ hls.destroy(); hls=null; }

    video.pause();
    video.removeAttribute('src');
    video.load();

    if(url.includes('.m3u8') && Hls.isSupported()){
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
    }else{
        video.src=url;
    }
}

urlForm.addEventListener('submit',e=>{
    e.preventDefault();
    loadVideo(urlInput.value);
});

playBtn.onclick=()=>{
    if(video.paused) video.play(); else video.pause();
};

video.addEventListener('play',()=>playBtn.textContent='⏸️');
video.addEventListener('pause',()=>playBtn.textContent='▶️');

video.addEventListener('timeupdate',()=>{
    if(!video.duration) return;
    let p=(video.currentTime/video.duration)*100;
    progress.style.width=p+'%';
    thumb.style.left=p+'%';
    timeDisplay.textContent=format(video.currentTime)+' / '+format(video.duration);
});

video.addEventListener('progress',()=>{
    if(video.buffered.length===0||!video.duration) return;
    let b=(video.buffered.end(video.buffered.length-1)/video.duration)*100;
    buffer.style.width=b+'%';
});

progressContainer.onclick=e=>{
    if(!video.duration) return;
    let rect=progressContainer.getBoundingClientRect();
    let pos=(e.clientX-rect.left)/rect.width;
    video.currentTime=pos*video.duration;
};

volume.oninput=e=>video.volume=e.target.value;

document.getElementById('fullscreenBtn').onclick=()=>{
    document.getElementById('videoWrapper').requestFullscreen();
};

function format(s){
    if(isNaN(s)) return '0:00';
    let m=Math.floor(s/60);
    let sec=Math.floor(s%60).toString().padStart(2,'0');
    return `${m}:${sec}`;
}
