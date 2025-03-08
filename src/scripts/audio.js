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
        playWaveSound();
    }
}

// 재생/일시정지 토글 함수
function togglePlay() {
    if (waveAudio.paused) {
        // 모바일 사용자 인터랙션 대응 개선 - 직접 play 호출
        waveAudio.play().then(() => {
            sessionStorage.setItem(AUDIO_STATE_KEY, 'playing');
            if (playBtn) {
                playBtn.textContent = '❚❚'; // 일시정지 기호
                playBtn.classList.add('playing');
            }
        }).catch(error => {
            console.log("재생 실패:", error);
            // 재생 실패 시 상태 업데이트
            sessionStorage.setItem(AUDIO_STATE_KEY, 'paused');
        });
    } else {
        waveAudio.pause();
        sessionStorage.setItem(AUDIO_STATE_KEY, 'paused');
        if (playBtn) {
            playBtn.textContent = '▶'; // 재생 기호
            playBtn.classList.remove('playing');
        }
    }
}

// 볼륨 조절 함수
function adjustVolume() {
    if (!volumeSlider) return;
    
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

// 오디오 상태 초기화 및 이벤트 리스너 추가
function initializeAudioControls() {
    // DOM 요소 참조 업데이트
    playBtn = document.getElementById('wave-sound-play');
    volumeSlider = document.getElementById('volume-slider');
    
    if (playBtn) {
        // 이벤트 리스너 추가 전에 기존 리스너 제거 (중복 방지)
        playBtn.removeEventListener('click', togglePlay);
        playBtn.addEventListener('click', togglePlay);
        
        // 모바일 터치 이벤트 추가 (반응성 개선)
        playBtn.removeEventListener('touchend', handleTouchEnd);
        playBtn.addEventListener('touchend', handleTouchEnd);
    }
    
    if (volumeSlider) {
        // 볼륨 슬라이더 이벤트 리스너
        volumeSlider.removeEventListener('input', adjustVolume);
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

// 모바일 터치 이벤트 처리 함수
function handleTouchEnd(e) {
    e.preventDefault(); // 기본 동작 방지
    togglePlay(); // 재생/일시정지 토글
}

// 안전한 오디오 재생 함수
function playWaveSound() {
    // 오디오 요소가 준비되었는지 확인
    if (waveAudio.readyState < 2) { // HAVE_CURRENT_DATA 보다 작으면
        // 로드 완료 후 재생 시도
        waveAudio.addEventListener('canplay', playAfterLoad);
        return;
    }
    
    // 상태에 따라 재생 시도
    const shouldPlay = sessionStorage.getItem(AUDIO_STATE_KEY) === 'playing' || 
                       sessionStorage.getItem(AUDIO_STATE_KEY) === null;
    
    if (shouldPlay) {
        // 모바일 환경에서도 작동하도록 사용자 인터랙션 확인
        const playPromise = waveAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                sessionStorage.setItem(AUDIO_STATE_KEY, 'playing');
                if (playBtn) {
                    playBtn.textContent = '❚❚';
                    playBtn.classList.add('playing');
                }
            }).catch(err => {
                console.log("자동 재생 실패:", err);
                // 자동 재생 실패 시 상태 유지
                if (playBtn) {
                    playBtn.textContent = '▶';
                    playBtn.classList.remove('playing');
                }
                
                // 모바일에서는 자동 재생이 차단될 수 있으므로 사용자 인터랙션 필요 상태로 표시
                sessionStorage.setItem(AUDIO_STATE_KEY, 'paused');
            });
        }
    }
}

// 오디오 로드 완료 후 재생 함수
function playAfterLoad() {
    waveAudio.removeEventListener('canplay', playAfterLoad);
    playWaveSound();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 첫 로드 시 오디오 요소 초기화
    initializeAudioControls();
    
    // 모바일 사용자 인터랙션 감지
    document.body.addEventListener('touchstart', function() {
        // 첫 터치 이벤트 발생 시 오디오 컨트롤 준비
        document.body.removeEventListener('touchstart', this);
        
        // 짧은 딜레이 후 상태 업데이트 (모바일 브라우저 제한 해결)
        setTimeout(() => {
            // 오디오 요소 초기화 재확인
            initializeAudioControls();
        }, 100);
    });
    
    // 페이지 가시성 변경 감지 (백그라운드에서 포그라운드로 전환될 때 상태 업데이트)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && 
            sessionStorage.getItem(AUDIO_STATE_KEY) === 'playing') {
            // 화면이 표시되고 이전 상태가 재생 중이었으면 재생 재개
            playWaveSound();
        }
    });
});

// 외부에서 사용 가능한 함수 노출
window.togglePlay = togglePlay;
window.adjustVolume = adjustVolume;
window.playWaveSound = playWaveSound;