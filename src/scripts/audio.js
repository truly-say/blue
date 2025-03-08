// src/scripts/audio.js
// 파도 소리 오디오 플레이어 관리 시스템

// 세션 스토리지 키 정의
const AUDIO_STATE_KEY = 'waveAudioState';
const AUDIO_VOLUME_KEY = 'waveAudioVolume';
const AUDIO_TIME_KEY = 'waveAudioTime';

// 오디오 객체를 전역으로 선언 (window 객체에 저장하여 다른 스크립트에서도 접근 가능)
window.waveAudio = null;

// DOM 요소 선택
let playBtn;
let volumeSlider;

// 오디오 초기화 함수
function initAudio() {
    // 현재 페이지 경로 확인
    const isIndex = window.location.pathname.endsWith('index.html') || 
                    window.location.pathname.endsWith('/');
    const prefix = isIndex ? 'assets/' : '../../assets/';
    
    // 수정된 경로로 오디오 객체 생성
    window.waveAudio = new Audio(`${prefix}audio/파도소리.mp3`);
    window.waveAudio.loop = true;

    // 디버깅을 위한 이벤트 리스너 추가
    window.waveAudio.addEventListener('error', function(e) {
        console.error('오디오 로딩 에러:', e);
        console.error('오디오 src:', this.src);
        console.error('오디오 네트워크 상태:', this.networkState);
        console.error('오디오 준비 상태:', this.readyState);
    });
    
    // 로딩 완료 이벤트
    window.waveAudio.addEventListener('canplaythrough', function() {
        console.log('오디오 로딩 완료, 재생 가능.');
    });

    return window.waveAudio;
}

// 이전 상태 복원 함수
function restoreAudioState() {
    if (!window.waveAudio) {
        initAudio();
    }
    
    // 이전 재생 상태 확인
    const wasPlaying = sessionStorage.getItem(AUDIO_STATE_KEY) === 'playing';
    // 이전 볼륨 확인
    const savedVolume = parseFloat(sessionStorage.getItem(AUDIO_VOLUME_KEY) || '0.5');
    // 이전 재생 시간 확인
    const savedTime = parseFloat(sessionStorage.getItem(AUDIO_TIME_KEY) || '0');
    
    // 볼륨 설정
    window.waveAudio.volume = savedVolume;
    if (volumeSlider) {
        volumeSlider.value = savedVolume * 100;
    }
    
    // 재생 시간 설정
    window.waveAudio.currentTime = savedTime;
    
    // 재생 상태 설정
    if (wasPlaying) {
        playWaveSound();
    }
}

// 재생/일시정지 토글 함수
function togglePlay() {
    if (!window.waveAudio) {
        initAudio();
    }
    
    if (window.waveAudio.paused) {
        // 모바일 사용자 인터랙션 대응 개선 - 직접 play 호출
        window.waveAudio.play().then(() => {
            console.log('오디오 재생 시작');
            sessionStorage.setItem(AUDIO_STATE_KEY, 'playing');
            if (playBtn) {
                playBtn.textContent = '❚❚'; // 일시정지 기호
                playBtn.classList.add('playing');
            }
        }).catch(error => {
            console.error("재생 실패:", error);
            // 재생 실패 시 상태 업데이트
            sessionStorage.setItem(AUDIO_STATE_KEY, 'paused');
        });
    } else {
        window.waveAudio.pause();
        console.log('오디오 일시정지');
        sessionStorage.setItem(AUDIO_STATE_KEY, 'paused');
        if (playBtn) {
            playBtn.textContent = '▶'; // 재생 기호
            playBtn.classList.remove('playing');
        }
    }
}

// 볼륨 조절 함수
function adjustVolume() {
    if (!volumeSlider || !window.waveAudio) return;
    
    const newVolume = volumeSlider.value / 100;
    window.waveAudio.volume = newVolume;
    sessionStorage.setItem(AUDIO_VOLUME_KEY, newVolume.toString());
}

// 주기적으로 현재 재생 시간 저장
function saveCurrentTime() {
    if (window.waveAudio && !window.waveAudio.paused) {
        sessionStorage.setItem(AUDIO_TIME_KEY, window.waveAudio.currentTime.toString());
    }
}

// 오디오 상태 초기화 및 이벤트 리스너 추가
function initializeAudioControls() {
    // 오디오 객체 초기화
    if (!window.waveAudio) {
        initAudio();
    }
    
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
        
        // 초기 버튼 상태 설정
        const isPlaying = sessionStorage.getItem(AUDIO_STATE_KEY) === 'playing';
        playBtn.textContent = isPlaying ? '❚❚' : '▶';
        if (isPlaying) {
            playBtn.classList.add('playing');
        } else {
            playBtn.classList.remove('playing');
        }
    } else {
        console.warn('재생 버튼 요소를 찾을 수 없음:', 'wave-sound-play');
    }
    
    if (volumeSlider) {
        // 볼륨 슬라이더 이벤트 리스너
        volumeSlider.removeEventListener('input', adjustVolume);
        volumeSlider.addEventListener('input', adjustVolume);
        
        // 초기 볼륨 설정
        const savedVolume = parseFloat(sessionStorage.getItem(AUDIO_VOLUME_KEY) || '0.5');
        volumeSlider.value = savedVolume * 100;
        if (window.waveAudio) {
            window.waveAudio.volume = savedVolume;
        }
    } else {
        console.warn('볼륨 슬라이더 요소를 찾을 수 없음:', 'volume-slider');
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
    // 오디오 객체가 없으면 초기화
    if (!window.waveAudio) {
        initAudio();
    }
    
    // 오디오 요소가 준비되었는지 확인
    if (window.waveAudio.readyState < 2) { // HAVE_CURRENT_DATA 보다 작으면
        // 로드 완료 후 재생 시도
        window.waveAudio.addEventListener('canplay', playAfterLoad);
        return;
    }
    
    // 상태에 따라 재생 시도
    const shouldPlay = sessionStorage.getItem(AUDIO_STATE_KEY) === 'playing' || 
                       sessionStorage.getItem(AUDIO_STATE_KEY) === null;
    
    if (shouldPlay) {
        // 모바일 환경에서도 작동하도록 사용자 인터랙션 확인
        const playPromise = window.waveAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('오디오 재생 성공');
                sessionStorage.setItem(AUDIO_STATE_KEY, 'playing');
                if (playBtn) {
                    playBtn.textContent = '❚❚';
                    playBtn.classList.add('playing');
                }
            }).catch(err => {
                console.error("자동 재생 실패:", err);
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
    window.waveAudio.removeEventListener('canplay', playAfterLoad);
    playWaveSound();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로드 완료: 오디오 컨트롤 초기화');
    
    // 오디오 객체 초기화
    initAudio();
    
    // 첫 로드 시 오디오 요소 초기화
    initializeAudioControls();
    
    // 모바일 사용자 인터랙션 감지
    document.body.addEventListener('touchstart', function handleFirstTouch() {
        // 첫 터치 이벤트 발생 시 오디오 컨트롤 준비
        console.log('첫 터치 감지: 오디오 상호작용 준비');
        document.body.removeEventListener('touchstart', handleFirstTouch);
        
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
            console.log('페이지 가시성 변경: 재생 재개');
            playWaveSound();
        }
    });
    
    // 디버깅용 로그
    console.log('오디오 컨트롤 초기화 완료');
});

// 외부에서 사용 가능한 함수 노출
window.togglePlay = togglePlay;
window.adjustVolume = adjustVolume;
window.playWaveSound = playWaveSound;
window.initAudio = initAudio;