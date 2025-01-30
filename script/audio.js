let waveAudio = null;
let isPlaying = false;

// 오디오 초기화 함수
function initializeAudio() {
    if (!waveAudio) {
        waveAudio = new Audio('../파도소리.mp3');
        waveAudio.loop = true;
    }
}

// 오디오 재생/정지 토글 함수
function togglePlay() {
    if (!waveAudio) {
        initializeAudio();
    }
    
    const playBtn = document.getElementById('wave-sound-play');
    
    if (isPlaying) {
        waveAudio.pause();
        isPlaying = false;
        playBtn.textContent = '⏵';
        playBtn.classList.remove('playing');
    } else {
        waveAudio.play()
            .then(() => {
                isPlaying = true;
                playBtn.textContent = '⏸';
                playBtn.classList.add('playing');
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });
    }
}

// 앞으로 건너뛰기 (10초)
function skipForward() {
    if (waveAudio) {
        waveAudio.currentTime = Math.min(waveAudio.currentTime + 10, waveAudio.duration);
    }
}

// 뒤로 건너뛰기 (10초)
function skipBackward() {
    if (waveAudio) {
        waveAudio.currentTime = Math.max(waveAudio.currentTime - 10, 0);
    }
}

// 페이지 전환 시 오디오 상태 저장
function storeAudioState() {
    if (waveAudio) {
        localStorage.setItem('waveAudioPlaying', isPlaying);
        localStorage.setItem('waveAudioTime', waveAudio.currentTime);
    }
}

// 페이지 로드 시 오디오 상태 복원
function restoreAudioState() {
    const wasPlaying = localStorage.getItem('waveAudioPlaying') === 'true';
    const audioTime = parseFloat(localStorage.getItem('waveAudioTime') || 0);
    const playBtn = document.getElementById('wave-sound-play');
    
    if (wasPlaying && playBtn) {
        initializeAudio();
        waveAudio.currentTime = audioTime;
        // 상태만 복원하고 자동 재생은 하지 않음
        playBtn.textContent = '⏵';
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    const playBtn = document.getElementById('wave-sound-play');
    const forwardBtn = document.getElementById('wave-sound-forward');
    const rewindBtn = document.getElementById('wave-sound-rewind');
    
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    if (forwardBtn) {
        forwardBtn.addEventListener('click', skipForward);
    }
    if (rewindBtn) {
        rewindBtn.addEventListener('click', skipBackward);
    }
    
    restoreAudioState();
});

window.addEventListener('beforeunload', storeAudioState);