if (!window.waveAudio) {
    window.waveAudio = new Audio('../파도소리.mp3');
    window.waveAudio.loop = true;
}

// 재생 상태 변수
let isPlaying = sessionStorage.getItem("audioPlaying") === "true";

// 진행 바 클릭 시 특정 시점으로 이동
document.getElementById("progress-bar").addEventListener("click", function(e) {
    const progressBar = document.getElementById("progress-bar");
    const rect = progressBar.getBoundingClientRect();
    
    // 클릭 위치의 비율 계산
    const percent = ((e.clientX - rect.left) / rect.width);
    
    // 오디오의 전체 재생 시간에서 해당 비율의 시점으로 이동
    window.waveAudio.currentTime = percent * window.waveAudio.duration;
    
    // 진행 바 업데이트
    updateProgressBar();
});

// 전역 오디오 객체 생성 및 관리
const AudioManager = {
    init() {
        if (!window.waveAudio) {
            window.waveAudio = new Audio('../파도소리.mp3');
            window.waveAudio.loop = true;
            
            // 오디오 로드 완료 시 저장된 상태 복원
            window.waveAudio.addEventListener('loadedmetadata', () => {
                this.restoreAudioState();
            });
        }
        
        // 페이지 언로드 직전에 현재 상태 저장
        window.addEventListener('beforeunload', () => {
            if (window.waveAudio) {
                sessionStorage.setItem("audioTime", window.waveAudio.currentTime);
                sessionStorage.setItem("audioPlaying", !window.waveAudio.paused);
                sessionStorage.setItem("audioVolume", window.waveAudio.volume * 100);
            }
        });

        return window.waveAudio;
    },

    restoreAudioState() {
        const savedTime = parseFloat(sessionStorage.getItem("audioTime") || 0);
        const wasPlaying = sessionStorage.getItem("audioPlaying") === "true";
        const savedVolume = sessionStorage.getItem("audioVolume") || 100;

        // 볼륨 먼저 설정
        window.waveAudio.volume = savedVolume / 100;
        document.getElementById("volume-slider").value = savedVolume;

        // 시간 설정
        if (window.waveAudio.duration) {
            window.waveAudio.currentTime = Math.min(savedTime, window.waveAudio.duration);
        }

        // 재생 상태 복원
        if (wasPlaying) {
            // 자동 재생 정책을 고려한 재생 시도
            const playPromise = window.waveAudio.play();
            if (playPromise) {
                playPromise.catch(error => {
                    console.log("Auto-play prevented:", error);
                });
            }
            document.getElementById("wave-sound-play").textContent = "⏸";
            document.getElementById("wave-sound-play").classList.add("playing");
        }
    }
};

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
    const audio = AudioManager.init();
});

// 오디오 상태 복원
function restoreAudioState() {
    const savedTime = parseFloat(sessionStorage.getItem("audioTime") || 0);
    const savedVolume = sessionStorage.getItem("audioVolume") || 100;

    window.waveAudio.currentTime = savedTime;
    window.waveAudio.volume = savedVolume / 100;

    document.getElementById("volume-slider").value = savedVolume;

    if (isPlaying) {
        window.waveAudio.play();
        document.getElementById("wave-sound-play").textContent = "⏸";
        document.getElementById("wave-sound-play").classList.add("playing");
    }
}

// 오디오 재생/정지
function togglePlay() {
    const playBtn = document.getElementById("wave-sound-play");

    if (window.waveAudio.paused) {
        window.waveAudio.play();
        isPlaying = true;
        playBtn.textContent = "⏸";
        playBtn.classList.add("playing");
    } else {
        window.waveAudio.pause();
        isPlaying = false;
        playBtn.textContent = "⏵";
        playBtn.classList.remove("playing");
    }

    sessionStorage.setItem("audioPlaying", isPlaying);
}

// 볼륨 조절
function adjustVolume(event) {
    window.waveAudio.volume = event.target.value / 100;
    sessionStorage.setItem("audioVolume", event.target.value);
}

function playWaveSound() {
    if (!window.waveAudio) {
        // 오디오 객체 초기화
        window.waveAudio = new Audio('../파도소리.mp3');
        window.waveAudio.loop = true;
    }

    // 재생 시도
    const playPromise = window.waveAudio.play();

    // 자동 재생 정책을 고려한 재생
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Auto-play prevented:", error);
            // 필요하다면 사용자 상호작용을 요구하는 로직 추가
        });
    }

    // 재생 버튼 상태 업데이트
    const playBtn = document.getElementById("wave-sound-play");
    if (playBtn) {
        playBtn.textContent = "⏸";
        playBtn.classList.add("playing");
    }
}

// 진행 바 업데이트
function updateProgressBar() {
    // 오디오의 duration이 있는지 확인
    if (window.waveAudio.duration) {
        const progress = (window.waveAudio.currentTime / window.waveAudio.duration) * 100;
        const progressBarInner = document.getElementById("progress-bar-inner");
        const progressBarThumb = document.getElementById("progress-bar-thumb");
        
        if (progressBarInner && progressBarThumb) {
            progressBarInner.style.width = `${progress}%`;
            progressBarThumb.style.left = `${progress}%`;
        }
        
        sessionStorage.setItem("audioTime", window.waveAudio.currentTime);
    }
}

// 진행 바 클릭 이동
document.getElementById("progress-bar").addEventListener("click", function(e) {
    const progressBar = document.getElementById("progress-bar");
    const rect = progressBar.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    window.waveAudio.currentTime = (percent / 100) * window.waveAudio.duration;
    updateProgressBar();
});

// 이벤트 리스너 등록
document.getElementById("wave-sound-play").addEventListener("click", togglePlay);
document.getElementById("volume-slider").addEventListener("input", adjustVolume);
window.waveAudio.addEventListener("timeupdate", updateProgressBar);

// 페이지 로드 시 오디오 상태 복원
document.addEventListener("DOMContentLoaded", restoreAudioState);

window.waveAudio.addEventListener("loadedmetadata", () => {
    window.waveAudio.addEventListener("timeupdate", updateProgressBar);
});

document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.getElementById('progress-bar');
    const progressBarInner = document.getElementById('progress-bar-inner');
    const progressBarThumb = document.getElementById('progress-bar-thumb');
    const controlsGroup = document.querySelector('.controls-group');

    if (progressBar) {
        progressBar.style.display = 'block';
        progressBar.style.width = '100%';
        progressBar.style.visibility = 'visible';
    }

    if (progressBarInner) {
        progressBarInner.style.display = 'block';
        progressBarInner.style.visibility = 'visible';
    }

    if (progressBarThumb) {
        progressBarThumb.style.display = 'block';
        progressBarThumb.style.visibility = 'visible';
    }

    if (controlsGroup) {
        controlsGroup.style.display = 'flex';
        controlsGroup.style.width = '100%';
    }

    playWaveSound();
});