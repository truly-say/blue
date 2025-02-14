// audio.js - 파도 소리 오디오 플레이어 관리 시스템

// DOM 요소 안전하게 가져오기 위한 유틸리티 함수
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
    }
    return element;
}

// 전역 오디오 객체가 없을 경우 초기화
if (!window.waveAudio) {
    window.waveAudio = new Audio('../assets/audio/파도소리.mp3');
    window.waveAudio.loop = true; // 무한 반복 설정
}

// 세션 스토리지에서 재생 상태 복원 
let isPlaying = sessionStorage.getItem("audioPlaying") === "true";

// 프로그레스바 클릭 이벤트 처리
function initializeProgressBar() {
    const progressBar = getElement("progress-bar");
    if (progressBar) {
        progressBar.addEventListener("click", function(e) {
            const rect = progressBar.getBoundingClientRect();
            // 클릭 위치의 상대적 비율 계산 (0~1)
            const percent = ((e.clientX - rect.left) / rect.width);
            // 계산된 비율로 오디오 재생 위치 이동
            window.waveAudio.currentTime = percent * window.waveAudio.duration;
            // UI 업데이트
            updateProgressBar();
        });
    }
}

// 오디오 관리자 객체 정의
const AudioManager = {
    // 초기화 메서드
    init() {
        // 오디오 객체 없으면 생성
        if (!window.waveAudio) {
            window.waveAudio = new Audio('../파도소리.mp3');
            window.waveAudio.loop = true;
            
            // 메타데이터 로드 완료 시 이전 상태 복원
            window.waveAudio.addEventListener('loadedmetadata', () => {
                this.restoreAudioState();
            });
        }
        
        // 페이지 종료 시 현재 상태 저장
        window.addEventListener('beforeunload', () => {
            if (window.waveAudio) {
                sessionStorage.setItem("audioTime", window.waveAudio.currentTime);
                sessionStorage.setItem("audioPlaying", !window.waveAudio.paused);
                sessionStorage.setItem("audioVolume", window.waveAudio.volume * 100);
            }
        });

        return window.waveAudio;
    },

    // 이전 상태 복원 메서드
    restoreAudioState() {
        // 세션 스토리지에서 저장된 값 로드
        const savedTime = parseFloat(sessionStorage.getItem("audioTime") || 0);
        const wasPlaying = sessionStorage.getItem("audioPlaying") === "true";
        const savedVolume = sessionStorage.getItem("audioVolume") || 100;
        const volumeSlider = getElement("volume-slider");
        const playBtn = getElement("wave-sound-play");

        if (window.waveAudio) {
            // 볼륨 설정 복원
            window.waveAudio.volume = savedVolume / 100;
            if (volumeSlider) volumeSlider.value = savedVolume;

            // 재생 시간 복원
            if (window.waveAudio.duration) {
                window.waveAudio.currentTime = Math.min(savedTime, window.waveAudio.duration);
            }

            // 재생 상태 복원
            if (wasPlaying) {
                const playPromise = window.waveAudio.play();
                if (playPromise) {
                    playPromise.catch(error => {
                        console.log("Auto-play prevented:", error);
                    });
                }
                if (playBtn) {
                    playBtn.textContent = "⏸";
                    playBtn.classList.add("playing");
                }
            }
        }
    }
};

// 이벤트 리스너 초기화 함수
function initializeAudioControls() {
    const playBtn = getElement('wave-sound-play');
    const volumeSlider = getElement('volume-slider');
    const progressBar = getElement('progress-bar');

    // 재생/일시정지 버튼 이벤트
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }

    // 볼륨 슬라이더 이벤트
    if (volumeSlider) {
        volumeSlider.addEventListener('input', adjustVolume);
    }

    // 오디오 시간 업데이트 이벤트
    if (window.waveAudio) {
        window.waveAudio.addEventListener('timeupdate', updateProgressBar);
    }

    // 프로그레스바 이벤트
    if (progressBar) {
        initializeProgressBar();
    }
}

// 오디오 상태 복원 함수
function restoreAudioState() {
    const savedTime = parseFloat(sessionStorage.getItem("audioTime") || 0);
    const savedVolume = sessionStorage.getItem("audioVolume") || 100;
    const volumeSlider = getElement("volume-slider");

    if (window.waveAudio) {
        window.waveAudio.currentTime = savedTime;
        window.waveAudio.volume = savedVolume / 100;
        if (volumeSlider) volumeSlider.value = savedVolume;

        if (isPlaying) {
            window.waveAudio.play();
            const playBtn = getElement("wave-sound-play");
            if (playBtn) {
                playBtn.textContent = "⏸";
                playBtn.classList.add("playing");
            }
        }
    }
}

// 재생/일시정지 토글 함수
function togglePlay() {
    const playBtn = getElement("wave-sound-play");
    
    if (!window.waveAudio || !playBtn) return;

    if (window.waveAudio.paused) {
        // 재생 시작
        window.waveAudio.play();
        isPlaying = true;
        playBtn.textContent = "⏸";
        playBtn.classList.add("playing");
    } else {
        // 일시정지
        window.waveAudio.pause();
        isPlaying = false;
        playBtn.textContent = "⏵";
        playBtn.classList.remove("playing");
    }

    // 상태 저장
    sessionStorage.setItem("audioPlaying", isPlaying);
}

// 볼륨 조절 함수
function adjustVolume(event) {
    if (!window.waveAudio) return;
    window.waveAudio.volume = event.target.value / 100; // 0-100 값을 0-1로 변환
    sessionStorage.setItem("audioVolume", event.target.value);
}

// 파도 소리 재생 함수
function playWaveSound() {
    // 오디오 객체 없으면 초기화
    if (!window.waveAudio) {
        window.waveAudio = new Audio('../파도소리.mp3');
        window.waveAudio.loop = true;
    }

    // 재생 시도 및 에러 처리
    const playPromise = window.waveAudio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Auto-play prevented:", error);
        });
    }

    // UI 업데이트
    const playBtn = getElement("wave-sound-play");
    if (playBtn) {
        playBtn.textContent = "⏸";
        playBtn.classList.add("playing");
    }
}

// 프로그레스바 업데이트 함수
function updateProgressBar() {
    if (!window.waveAudio || !window.waveAudio.duration) return;

    // 현재 재생 진행률 계산 (0-100%)
    const progress = (window.waveAudio.currentTime / window.waveAudio.duration) * 100;
    const progressBarInner = getElement("progress-bar-inner");
    const progressBarThumb = getElement("progress-bar-thumb");
    
    // UI 업데이트
    if (progressBarInner) progressBarInner.style.width = `${progress}%`;
    if (progressBarThumb) progressBarThumb.style.left = `${progress}%`;
    
    // 현재 시간 저장
    sessionStorage.setItem("audioTime", window.waveAudio.currentTime);
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
    AudioManager.init();
    initializeAudioControls();
});

// 추가 이벤트 리스너 등록
window.waveAudio.addEventListener("loadedmetadata", () => {
    window.waveAudio.addEventListener("timeupdate", updateProgressBar);
});