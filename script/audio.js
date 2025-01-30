if (!window.waveAudio) {
    window.waveAudio = new Audio('../파도소리.mp3');
    window.waveAudio.loop = true;
}

// 재생 상태 변수
let isPlaying = sessionStorage.getItem("audioPlaying") === "true";

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

// 진행 바 업데이트
function updateProgressBar() {
    const progress = (window.waveAudio.currentTime / window.waveAudio.duration) * 100;
    document.getElementById("progress-bar-inner").style.width = progress + "%";
    document.getElementById("progress-bar-thumb").style.left = progress + "%";
    sessionStorage.setItem("audioTime", window.waveAudio.currentTime);
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