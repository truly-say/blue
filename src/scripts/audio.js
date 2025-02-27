// src/scripts/audio.js
// 파도 소리 오디오 플레이어 관리 시스템

// 세션 스토리지 키 정의
const AUDIO_STATE_KEY = 'waveAudioState';
const AUDIO_VOLUME_KEY = 'waveAudioVolume';
const AUDIO_TIME_KEY = 'waveAudioTime';

// 오디오 객체 생성
const waveAudio = new Audio('/assets/audio/파도소리.mp3');
waveAudio.loop = true;

// DOM 요소 선택
let playBtn;
let volumeSlider;

// 이전 상태 복원 함수
function restoreAudioState() {
    // 이전 재생 상태 확인
    const wasPlaying = sessionStorage.getItem(AUDIO_STATE_KEY) === 'playing';
    // 이전 볼륨 확인
    const savedVolume = parseFloat(sessionStorage.getItem(AUDIO_VOLUME_KEY) || '0.5');
    // 이전 재생 시간 확인
    const savedTime = parseFloat(sessionStorage.getItem(AUDIO_TIME_KEY) || '0');
    
    // 볼륨 설정
    waveAudio.volume = savedVolume;
    if (volumeSlider) {
        volumeSlider.value = savedVolume * 100;
    }
    
    // 재생 시간 설정
    waveAudio.currentTime = savedTime;
    
    // 재생 상태 설정
    if (wasPlaying) {
        // 자동 재생 정책 때문에 사용자 상호작용이 필요할 수 있음
        waveAudio.play().catch(error => {
            console.log("자동 재생 실패:", error);
            // 버튼 상태는 업데이트하지 않음 (자동 재생 실패 시)
        });
        
        if (playBtn) {
            playBtn.textContent = '❚❚'; // 일시정지 기호
            playBtn.classList.add('playing');
        }
    }
}

// 재생/일시정지 토글 함수
function togglePlay() {
    if (waveAudio.paused) {
        waveAudio.play().then(() => {
            sessionStorage.setItem(AUDIO_STATE_KEY, 'playing');
            playBtn.textContent = '❚❚'; // 일시정지 기호
            playBtn.classList.add('playing');
        }).catch(error => {
            console.log("재생 실패:", error);
        });
    } else {
        waveAudio.pause();
        sessionStorage.setItem(AUDIO_STATE_KEY, 'paused');
        playBtn.textContent = '▶'; // 재생 기호
        playBtn.classList.remove('playing');
    }
}

// 볼륨 조절 함수
function adjustVolume() {
    const newVolume = volumeSlider.value / 100;
    waveAudio.volume = newVolume;
    sessionStorage.setItem(AUDIO_VOLUME_KEY, newVolume.toString());
}

// 주기적으로 현재 재생 시간 저장
function saveCurrentTime() {
    if (!waveAudio.paused) {
        sessionStorage.setItem(AUDIO_TIME_KEY, waveAudio.currentTime.toString());
    }
}

// 이벤트 리스너 추가
function initializeAudioControls() {
    playBtn = document.getElementById('wave-sound-play');
    volumeSlider = document.getElementById('volume-slider');
    
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', adjustVolume);
    }
    
    // 페이지 전환 시 현재 재생 시간 저장
    window.addEventListener('beforeunload', () => {
        saveCurrentTime();
    });
    
    // 주기적으로 재생 시간 저장 (5초마다)
    setInterval(saveCurrentTime, 5000);
    
    // 이전 상태 복원
    restoreAudioState();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializeAudioControls);

// 외부에서 사용 가능한 함수 노출
window.togglePlay = togglePlay;
window.adjustVolume = adjustVolume;
window.playWaveSound = function() {
    if (sessionStorage.getItem(AUDIO_STATE_KEY) === 'playing' || sessionStorage.getItem(AUDIO_STATE_KEY) === null) {
        waveAudio.play().then(() => {
            sessionStorage.setItem(AUDIO_STATE_KEY, 'playing');
            if (playBtn) {
                playBtn.textContent = '❚❚';
                playBtn.classList.add('playing');
            }
        }).catch(err => console.log("재생 시도 실패:", err));
    }
};