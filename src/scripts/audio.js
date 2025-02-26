// src/scripts/audio.js
// 파도 소리 오디오 플레이어 관리 시스템

// 오디오 객체 생성
const waveAudio = new Audio('/assets/audio/파도소리.mp3');
waveAudio.loop = true;

// DOM 요소 선택
const playBtn = document.getElementById('wave-sound-play');
const volumeSlider = document.getElementById('volume-slider');

// 재생/일시정지 토글 함수
function togglePlay() {
    if (waveAudio.paused) {
        waveAudio.play().catch(error => {
            console.log("재생 실패:", error);
        });
        playBtn.textContent = '❚❚'; // 일시정지 기호
        playBtn.classList.add('playing');
    } else {
        waveAudio.pause();
        playBtn.textContent = '▶'; // 재생 기호
        playBtn.classList.remove('playing');
    }
}

// 볼륨 조절 함수
function adjustVolume() {
    waveAudio.volume = volumeSlider.value / 100;
}

// 이벤트 리스너 추가
function initializeAudioControls() {
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', adjustVolume);
        // 초기 볼륨 설정
        volumeSlider.value = 50;
        waveAudio.volume = 0.5;
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializeAudioControls);

// 외부에서 사용 가능한 함수 노출
window.togglePlay = togglePlay;
window.adjustVolume = adjustVolume;