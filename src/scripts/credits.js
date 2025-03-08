// src/scripts/credits.js - 크레딧 페이지 스크립트
document.addEventListener("DOMContentLoaded", () => {
    // DOM 요소
    const creditsContainer = document.getElementById('creditsContainer');
    const messagesWrapper = document.getElementById('messagesWrapper');
    const mainMessagesContainer = document.getElementById('mainMessagesContainer');
    const mainMessagesWrapper = document.getElementById('mainMessagesWrapper');
    const finalMessageContainer = document.getElementById('finalMessageContainer');
    const restartMessageContainer = document.getElementById('restartMessageContainer');
    const popupContainer = document.getElementById('popupContainer');
    const content = document.querySelector('.credits-content');
    const darkOverlay = document.getElementById('dark-overlay');

    // 효과음 생성
    const messageSound = new Audio('../../assets/audio/MP_Pling.mp3'); // 메세지 효과음
    const tickingSound = document.getElementById('tickingSound'); // 시계 똑딱 소리
    const panicSound = new Audio('../../assets/audio/MP_Panic.mp3'); // 패닉 효과음

    // 배경음악
    let bgMusic = null;

    // 첫 번째 메시지 세트 (중앙 순차 메시지)
    const centerMessages = [
        "어이, 11기생.",
        "마녀다.",
        "거의 6년만인데... 잘 지냈는지 모르겠네.",
        "농담이고, 모르겠냐.",
        "꼴에 선청인이랍시고 하나 같이 잘 나가는 모양이더만.",
        "추스리는데 조금 시간이 걸린 녀석도 있고, 아닌 녀석도 있겠지만... 뭐, 알다시피.",
        "프로젝트라는 게 제정신으로 할 짓은 아니잖아?",
        "그걸 견디고 살아남은 너희라면 성공할 수 밖에 없으리라 본다.",
        "형식적인 겉치레는 이쯤 하고 본론으로 들어갈까.",
        "알아낸 바로는 너희, 아-주 위험한 상황에 처해있어.",
        "어떻게 알아냈는지는 비밀, 위험한 일이 뭔지도 비밀.",
        "...이지만, 마음의 준비 정도는 해두라고.",
        "최악의 상황을 피하고 싶다면 당장 내일,",
        "학교로 돌아와라.",
        "이 메세지를 믿을지 말지는 자유지만...",
        "안 믿으면 어쩔 수 없고? 너희 손해지.",
        "그냥, 그래.",
        "항상 선배로써 응원하고, 전력을 다해 도울 것을 맹세하마.",
        "행운을 빈다.",
        "안녕하세요, 14기 졸업생 여러분.",
        "날이 추워지고 어느덧 새해를 바라보고 있는 가운데 몸 건강하실지 걱정입니다.",
        "여섯번째 프로젝트가 있고 곧 3년. 길다면 길고 짧다면 짧을 시간이지만, 여러분 마음에 남은 상처는 아직 지워지지 않았을 듯 하여 어떤 말을 드려야 할지...",
        "...많은 고민이 되네요.",
        "그럼에도 감히, 긴히 연락드릴 일이 있어 이리 찾아뵙게 되었습니다.",
        "새로이 는의 로 예정입니다.",
        "홀로 있는 것은 위험하니 당분간은 반드시 타인과 함께 움직이되 또한 것을 권장 드립니다.",
        "몇년 만의 연락이 이런 것이라 그리 미덥지 못할 것은 알고 있습니다만...",
        "여러분의 삶 그 자체를 응원하는 사람이 있다는 사실을 늘 기억해주셨으면 합니다.",
        "꼭 완벽하지 않더라도 그 자체로 빛나는 사람들이니까요!",
        "아",
        "그럼 부디 몸조심하시고,",
        "그 일의 대비를 위해 한번 더 연락드리도록 하겠습니다.",
        "제 연락이 있고 바로 다음날, 학교로 돌아와주세요.",
        "그 앞날 언제나 행운이 따르기를.",
        "기다리고 있겠습니다."
    ];

    // 두 번째 메시지 세트 (중앙 강조 메시지)
    const mainMessages = [
        "하여튼, 메인이죠. 여러분은 경험하셨듯, 혹은 안내받았듯... 완벽이 되어야 합니다.",
        "뭐, 다같이 나가자. 우리 모두 완벽이 되자. ...이번에도 그런 희망적인 계획을 세우지 않으리라고 믿지는 않습니다. 그러니 조건을 걸까요.",
        "완벽에게는, 그게 무엇이든... <strong>귀하가 가장 바라는 한가지</strong>를 이루어드리겠습니다."
    ];

    // 세 번째 메시지 세트 (랜덤 팝업 메시지)
    const popupMessages = [
        "<strong>사적 대화</strong>도 괜찮으신가요.",
        "어지간히 멍청한 게 아니고서야 후자를 감행할 이유가 있겠냐고.",
        "있지, <strong>인과응보</strong>라는 거. 어떻게 생각해?",
        "분명 그때가 마지막이었는데.",
        "그래, 나랑 게임 하나 하지 않을래?",
        "역시 이 정도의 거리가 좋다고 생각해요.",
        "……어쩌면 좋을까.",
        "이렇게 노력해봐도 안 되면, 그건 진짜로 <strong>글러먹은</strong> 거 아닌가…",
        "참 완벽해지셨네.",
        "뭐, 양심 버려라... 기억하지 말아라.",
        "바람을 두려워하지 않길.",
        "앞으로도 쭉, 살아있길 바라. 그럼 언젠가는 세상이 따뜻해지겠지.",
        "미안해요......",
        "네 얼굴 다시 볼 날은 아직이네. 그래. 그럼 됐어.",
        "...또 살았구나. (...) 하지만 더이상 방황하지 않겠어."
    ];

    // 마지막 메시지
    const finalMessage = "자, 짧다면 짧고 길다면 길었던 '선청'의 이야기는 이것으로 끝입니다.";

    // 크레딧 애니메이션 관련 변수
    let normalScrollSpeed = 0.3; // 일반 스크롤 속도
    let fastScrollSpeed = 3; // 빠른 스크롤 속도 
    let currentScrollSpeed = normalScrollSpeed;
    let scrollPosition = 0;
    let animationId = null;
    let isCreditsComplete = false; // 크레딧이 끝났는지 추적하는 변수
    let isLastPartDisplayed = false; // 마지막 메시지가 표시되었는지 여부
    let lastScrollPosition = 0; // 마지막으로 기록된 스크롤 위치
    let isMobile = false; // 모바일 디바이스 감지 변수

    // 음원 출처 정보를 기존 섹션에 통합하는 함수
    function addSoundCredits() {
        // 이미 존재하는 크레딧 컨텐츠 찾기
        const creditsContent = document.querySelector('.credits-content');
        if (!creditsContent) return;

        // 기존 "음원 소스 참조" 섹션 찾기
        const existingSoundSection = Array.from(creditsContent.querySelectorAll('.credits-section-title')).find(
            el => el.textContent.includes('음원 소스 참조')
        );

        if (existingSoundSection) {
            // 해당 섹션의 부모 요소 찾기 (credits-section)
            const parentSection = existingSoundSection.closest('.credits-section');

            if (parentSection) {
                // 기존에 있는 credit-item 유지하고 추가 정보 삽입
                const additionalCredits = `
                    <div class="credit-item">
                        <div class="credit-line">
                            <span class="character-name">Mike Koenig</span>
                            <span class="credit-separator">|</span>
                            <span class="character-owner">http://soundbible.com/1841-Panic.html</span>
                        </div>
                    </div>
                    <div class="credit-item">
                        <div class="credit-line">
                            <span class="character-name">KevanGC</span>
                            <span class="credit-separator">|</span>
                            <span class="character-owner">http://soundbible.com/1645-Pling.html</span>
                        </div>
                    </div>
                    <div class="credit-item">
                        <div class="credit-line">
                            <span class="character-name">abyeditsound</span>
                            <span class="credit-separator">|</span>
                            <span class="character-owner">freesound.org/450509 (CC0)</span>
                        </div>
                    </div>
                `;

                // 기존 내용 뒤에 새 내용 추가
                parentSection.innerHTML += additionalCredits;
            }
        }
    }

    // 디바이스 감지 함수
    function detectDevice() {
        // 화면 가로 길이가 768px 이하이거나 모바일 장치의 User Agent를 가진 경우
        isMobile = window.innerWidth <= 768 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return isMobile;
    }

    // 초기 디바이스 감지
    detectDevice();

    // 창 크기 변경 시 디바이스 감지 업데이트
    window.addEventListener('resize', detectDevice);

    // 신원 선택 기능 추가
    // 사용자에게 신원(11기, 14기, 외부인)을 선택하게 하는 UI를 제공하는 함수
    function createIdentitySelector() {
        const container = document.createElement('div');
        container.className = 'identity-selector-container';

        const question = document.createElement('div');
        question.className = 'identity-question';
        question.textContent = '당신의 신원은?';
        container.appendChild(question);

        const options = [
            { id: '11gi', text: '11기 졸업생' },
            { id: '14gi', text: '14기 졸업생' },
            { id: 'outsider', text: '외부인' }
        ];

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'identity-buttons';

        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'identity-button';
            button.textContent = option.text;
            button.setAttribute('data-identity', option.id);

            // 선택 효과
            button.addEventListener('click', function () {
                // 효과음 재생
                messageSound.currentTime = 0;
                messageSound.play().catch(err => console.log("효과음 재생 불가:", err));

                // 페이드 아웃 애니메이션
                container.style.opacity = '0';

                setTimeout(() => {
                    container.remove();

                    // 선택된 신원에 따라 다른 메시지 시퀀스 실행
                    startSequenceBasedOnIdentity(option.id);
                }, 500);
            });

            buttonContainer.appendChild(button);
        });

        container.appendChild(buttonContainer);
        document.body.appendChild(container);

        // 페이드 인 애니메이션
        setTimeout(() => {
            container.style.opacity = '1';
        }, 100);
    }

    // 선택된 신원에 따라 시퀀스 시작
    function startSequenceBasedOnIdentity(identity) {
        if (identity === '11gi') {
            // 11기 졸업생: 11기 메시지만 표시 (0~18 인덱스)
            playPartialCenterMessages(0, 18)
                .then(() => playMainMessages())
                .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
                .then(() => playPopupMessages()) // 원래 모든 팝업 메시지 표시
                .then(() => showFinalMessage())
                .then(() => {
                    // 항해.mp3 재생
                    playBackgroundMusic();
                    // 약간의 딜레이 후 크레딧 표시
                    setTimeout(() => {
                        prepareCredits();
                        setTimeout(() => {
                            animationId = requestAnimationFrame(scrollCredits);
                        }, 100);
                    }, 2000);
                });
        } else if (identity === '14gi') {
            // 14기 졸업생: 14기 메시지만 표시 (19~끝까지)
            // 메시지 최대 갯수를 4개로 제한
            playPartialCenterMessages(19, centerMessages.length - 1, 4)
                .then(() => playMainMessages())
                .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
                .then(() => playPopupMessages()) // 원래 모든 팝업 메시지 표시
                .then(() => showFinalMessage())
                .then(() => {
                    // 항해.mp3 재생
                    playBackgroundMusic();
                    // 약간의 딜레이 후 크레딧 표시
                    setTimeout(() => {
                        prepareCredits();
                        setTimeout(() => {
                            animationId = requestAnimationFrame(scrollCredits);
                        }, 100);
                    }, 2000);
                });
        } else if (identity === 'outsider') {
            // 외부인: 불규칙적인 효과음 후 바로 중앙 메시지로
            playOutsiderEffects();
        }
    }

    // 외부인을 위한 불규칙 효과음
    // 외부인을 선택한 경우 불규칙적인 효과음을 재생한 후 메인 메시지로 바로 이동
    function playOutsiderEffects() {
        let count = 0;

        function playRandomEffect() {
            if (count < 3) {
                // 불규칙적인 간격으로 효과음 재생
                const delay = 400 + Math.random() * 800;

                setTimeout(() => {
                    messageSound.currentTime = 0;
                    messageSound.play().catch(err => console.log("효과음 재생 불가:", err));
                    count++;
                    playRandomEffect();
                }, delay);
            } else {
                // 3번 효과음 후 바로 중앙 메시지로
                setTimeout(() => {
                    playMainMessages()
                        .then(() => playPopupMessages()) // 항상 모든 팝업 메시지 표시
                        .then(() => showFinalMessage())
                        .then(() => {
                            // 항해.mp3 재생
                            playBackgroundMusic();
                            // 약간의 딜레이 후 크레딧 표시
                            setTimeout(() => {
                                prepareCredits();
                                setTimeout(() => {
                                    animationId = requestAnimationFrame(scrollCredits);
                                }, 100);
                            }, 2000);
                        });
                }, 1000);
            }
        }

        // 첫 번째 효과음 재생 시작
        playRandomEffect();
    }

    // 특정 범위의 중앙 메시지만 표시
    // 시작 인덱스와 끝 인덱스를 지정하여 해당 범위의 중앙 메시지만 표시하는 함수
    const playPartialCenterMessages = (startIndex, endIndex, maxMessages = 0) => {
        return new Promise(resolve => {
            let index = startIndex;
            const interval = 3500; // 메시지 간 간격
            let isCancelled = false; // 건너뛰기 상태 추적

            // 건너뛰기 버튼 생성 및 처리
            function setupSkipButton() {
                // 이전 버튼 제거
                messageManager.removeSkipButton();

                // 건너뛰기 버튼 추가
                const skipAllMessages = () => {
                    messageManager.removeAllMessages();
                    messageManager.removeSkipButton();
                    isCancelled = true;
                    resolve(); // 모든 메시지 건너뛰고 다음 단계로
                };

                const messageType = startIndex === 0 ? "11기" : "14기";
                messageManager.addSkipButton(messageType, skipAllMessages);
            }

            // 메시지 표시 함수
            function showNextMessage() {
                if (isCancelled) return; // 건너뛰기 발생 시 종료

                // 메시지 최대 개수 제한 확인
                if (maxMessages > 0 && messageManager.activeMessages.length >= maxMessages) {
                    // 가장 오래된 메시지 제거
                    const oldestMessage = messageManager.activeMessages.shift();
                    if (oldestMessage) {
                        messageManager.removeMessage(oldestMessage);
                    }
                }

                if (index <= endIndex) {
                    messageManager.addMessage(centerMessages[index]);
                    index++;
                    setTimeout(showNextMessage, interval);
                } else {
                    // 모든 메시지 표시 후 중앙 메시지 클리어
                    setTimeout(() => {
                        if (isCancelled) return;
                        messageManager.removeAllMessages();
                        messageManager.removeSkipButton(); // 모든 메시지 완료 시 버튼 제거
                        resolve(); // 다음 단계로
                    }, interval);
                }
            }

            // 초기화면 표시
            messagesWrapper.innerHTML = ''; // 메시지 컨테이너 초기화
            mainMessagesContainer.style.display = 'none';
            finalMessageContainer.style.display = 'none';

            // 메시지 관리자 초기화
            messageManager.isFirstMessage = true;

            // 초기 건너뛰기 버튼 설정
            setupSkipButton();

            // 첫 번째 메시지 표시
            showNextMessage();
        });
    };

    // 배경 음악 재생 (항해.mp3 - 볼륨 점진적 증가)
    function playBackgroundMusic() {
        bgMusic = new Audio('../../assets/audio/항해.mp3');
        bgMusic.volume = 0; // 초기 볼륨 0
        bgMusic.loop = true; // 반복 재생
        
        // 재생 시작
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => console.log("배경음악 재생 불가:", err));
        }
        
        // 볼륨 점진적 증가
        let currentVolume = 0;
        const targetVolume = 0.8; // 원래 볼륨으로 복원
        const duration = 5000; // 5초 동안 증가
        const interval = 100; // 100ms마다 볼륨 업데이트
        const steps = duration / interval;
        const volumeStep = targetVolume / steps;
        
        const volumeInterval = setInterval(() => {
            currentVolume += volumeStep;
            if (currentVolume >= targetVolume) {
                currentVolume = targetVolume;
                clearInterval(volumeInterval);
            }
            if (bgMusic) bgMusic.volume = currentVolume;
        }, interval);
    }

    // 배경 음악 페이드 아웃
    function fadeOutBackgroundMusic() {
        if (!bgMusic || bgMusic.paused) return Promise.resolve();
    
        return new Promise(resolve => {
            const fadeOutDuration = 5000; // 5초간 페이드 아웃
            const interval = 100; // 100ms마다 볼륨 업데이트
            const steps = fadeOutDuration / interval;
            const volumeStep = bgMusic.volume / steps;
            let currentVolume = bgMusic.volume;
    
            const fadeOutInterval = setInterval(() => {
                currentVolume -= volumeStep;
                if (currentVolume <= 0.01) {
                    bgMusic.volume = 0;
                    bgMusic.pause();
                    clearInterval(fadeOutInterval);
                    resolve();
                } else {
                    bgMusic.volume = currentVolume;
                }
            }, interval);
            
            // 안전 장치
            setTimeout(() => {
                if (!bgMusic.paused) {
                    bgMusic.pause();
                    bgMusic.volume = 0;
                    bgMusic.currentTime = 0;
                    clearInterval(fadeOutInterval);
                    resolve();
                }
            }, 7000);
        });
    }


    // 눈 내리는 효과
    // 화면에 눈이 내리는 효과를 생성하는 함수
    function createSnow() {
        const container = document.body; // 전체 body에 눈 내리게 함
        const snow = document.createElement('div');
        snow.className = 'snow-particle';

        // 화면 크기에 맞게 크기 조정
        const size = Math.random() * (isMobile ? 2 : 3) + 1;
        // 전체 화면 너비에 맞춰 위치 설정
        const startPositionX = Math.random() * window.innerWidth;

        snow.style.width = `${size}px`;
        snow.style.height = `${size}px`;
        snow.style.left = `${startPositionX}px`;
        // 눈이 화면 위에서 시작하도록 top 위치 수정
        snow.style.top = '-20px'; // 더 위에서 시작하도록 조정

        container.appendChild(snow);

        let positionY = -20; // 시작 위치 조정
        let positionX = startPositionX;
        // 모바일에서는 더 빠르게 움직이도록
        const speed = Math.random() * (isMobile ? 1.5 : 1) + 0.5;
        const wind = Math.random() * 2 - 1;

        function fall() {
            positionY += speed;
            positionX += wind;
            snow.style.transform = `translate(${positionX - startPositionX}px, ${positionY}px)`;

            // 화면 높이보다 약간 더 내려가면 제거 (여유있게)
            if (positionY < window.innerHeight + 50) {
                requestAnimationFrame(fall);
            } else {
                snow.remove();
            }
        }

        fall();
    }

    // 건너뛰기 버튼 생성
    // 메시지를 건너뛸 수 있는 버튼을 생성하는 함수
    function createSkipButton(messageType, onSkip) {
        const button = document.createElement('button');
        // 좀 더 서정적인 텍스트로 변경
        button.textContent = `${messageType}의 메시지를 넘어가기`;
        button.className = 'skip-message-btn';

        // 부드러운 페이드인 효과 추가
        button.style.opacity = '0';
        button.style.transform = 'translateY(10px)';
        button.onclick = (e) => {
            // 클릭 시 잔물결 효과 추가
            const ripple = document.createElement('span');
            ripple.className = 'button-ripple';
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            button.appendChild(ripple);

            // 잔물결 효과 제거
            setTimeout(() => {
                ripple.remove();
                // 클릭 효과 후 버튼 페이드아웃
                button.style.opacity = '0';
                button.style.transform = 'translateY(10px)';

                // 페이드아웃 후 콜백 실행
                setTimeout(() => {
                    onSkip();
                }, 300);
            }, 300);
        };

        // DOM에 추가 후 페이드인
        document.body.appendChild(button);
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 10);

        return button;
    }

    // 스크롤 속도 조절 함수
    // 크레딧 스크롤 속도를 조절하는 함수
    function setScrollSpeed(isFast) {
        currentScrollSpeed = isFast ? fastScrollSpeed : normalScrollSpeed;
    }

    // 이벤트 리스너 재설정 함수
    // 스크롤 속도 조절을 위한 이벤트 리스너를 설정하는 함수
    function setupScrollSpeedListeners() {
        // 키보드 이벤트
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                setScrollSpeed(true);
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                setScrollSpeed(false);
            }
        });

        // 마우스 이벤트
        document.addEventListener('mousedown', () => {
            setScrollSpeed(true);
        });

        document.addEventListener('mouseup', () => {
            setScrollSpeed(false);
        });

        // 터치 이벤트
        document.addEventListener('touchstart', () => {
            setScrollSpeed(true);
        });

        document.addEventListener('touchend', () => {
            setScrollSpeed(false);
        });
    }

    // 중앙 메시지 관리 함수들
    const messageManager = {
        activeMessages: [],
        maxMessages: 5,
        skipButton: null,
        isFirstMessage: true, // 첫 메시지 플래그 추가

        // 메시지 추가
        // 메시지 컨테이너에 새 메시지를 추가하는 함수
        addMessage: function (text, wrapper = messagesWrapper) {
            // 새 메시지 생성
            const message = document.createElement('div');
            message.classList.add('center-message');

            // 마크다운 스타일 직접 변환
            message.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            wrapper.appendChild(message);

            // 메시지 활성화
            setTimeout(() => {
                message.classList.add('visible');
            }, 50);

            // 활성 메시지 배열에 추가
            this.activeMessages.push(message);

            // 최대 메시지 개수 초과시 오래된 메시지 제거
            if (this.activeMessages.length > this.maxMessages) {
                const oldestMessage = this.activeMessages.shift();
                this.removeMessage(oldestMessage);
            }

            return message;
        },

        // 메시지 제거
        // 특정 메시지를 애니메이션과 함께 제거하는 함수
        removeMessage: function (message) {
            if (!message) return;

            message.classList.add('moving-up');
            message.classList.remove('visible');

            // 애니메이션 완료 후 DOM에서 제거
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 500);
        },

        // 모든 메시지 제거
        // 현재 표시된 모든 메시지를 제거하는 함수
        removeAllMessages: function (wrapper = messagesWrapper) {
            // 모든 메시지에 사라지는 애니메이션 적용
            const messages = wrapper.querySelectorAll('.center-message, .main-center-message');
            messages.forEach(msg => {
                this.removeMessage(msg);
            });

            // 활성 메시지 배열 비우기
            this.activeMessages = [];

            // 첫 메시지 플래그 리셋
            this.isFirstMessage = true;
        },

        // 건너뛰기 버튼 관리
        // 메시지 건너뛰기 버튼을 추가하는 함수
        addSkipButton: function (messageType, onSkip) {
            // 기존 버튼 제거
            if (this.skipButton && this.skipButton.parentNode) {
                this.skipButton.parentNode.removeChild(this.skipButton);
            }

            this.skipButton = createSkipButton(messageType, onSkip);
        },

        // 건너뛰기 버튼 제거
        // 메시지 건너뛰기 버튼을 제거하는 함수
        removeSkipButton: function () {
            if (this.skipButton && this.skipButton.parentNode) {
                this.skipButton.parentNode.removeChild(this.skipButton);
                this.skipButton = null;
            }
        }
    };

    // 메인 메시지 추가 함수
    // 메인 메시지를 추가하는 함수
    const addMainMessage = (text, isFirstMessage = false) => {
        // 효과음 재생 (첫 메시지가 아닐 때만)
        if (!isFirstMessage) {
            messageSound.currentTime = 0;
            messageSound.play().catch(err => console.log("효과음 재생 불가:", err));
        }

        const message = document.createElement('div');
        message.classList.add('main-center-message');

        // 마크다운 스타일 직접 변환
        message.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 배경색 변경 (어두운 파란색)
        message.style.backgroundColor = 'rgba(0, 31, 63, 0.95)';

        mainMessagesWrapper.appendChild(message);

        // 메시지 표시 애니메이션
        setTimeout(() => {
            message.classList.add('visible');
        }, 50);

        return message;
    };

    // 메인 메시지 시퀀스 함수
    // 메인 메시지 시퀀스를 순차적으로 표시하는 함수
    const playMainMessages = () => {
        return new Promise(resolve => {
            mainMessagesContainer.style.display = 'flex';
            let index = 0;
            const interval = 3000; // 3초마다 메시지 표시

            // 첫 메시지 플래그 초기화
            let isFirstMainMessage = true;

            const showNextMessage = () => {
                if (index < mainMessages.length) {
                    // 이전 메시지 제거 (두 번째 메시지부터)
                    if (index > 0) {
                        const prevMessages = mainMessagesWrapper.querySelectorAll('.main-center-message');
                        prevMessages.forEach(msg => {
                            messageManager.removeMessage(msg);
                        });
                    }

                    // 새 메시지 추가
                    addMainMessage(mainMessages[index], isFirstMainMessage);
                    isFirstMainMessage = false;
                    index++;
                    setTimeout(showNextMessage, interval);
                } else {
                    // 모든 메시지 표시 후 완료
                    setTimeout(() => {
                        const messages = mainMessagesWrapper.querySelectorAll('.main-center-message');
                        messages.forEach(msg => {
                            messageManager.removeMessage(msg);
                        });

                        mainMessagesContainer.style.display = 'none';
                        resolve();
                    }, interval);
                }
            };

            // 첫 번째 메시지 표시
            showNextMessage();
        });
    };

    // 팝업 메시지 생성 함수 (화면 내에 항상 표시되도록 엄격히 제한)
    const createPopupMessage = (message, isFirstMessage = false) => {
        // 효과음 재생 (첫 메시지가 아닐 때만)
        if (!isFirstMessage || message.includes("사적 대화")) {
            messageSound.currentTime = 0;
            messageSound.play().catch(err => console.log("효과음 재생 불가:", err));
        }

        // 팝업 요소 생성
        const popup = document.createElement('div');
        popup.classList.add('popup-message');

        // 마크다운 스타일 직접 변환
        popup.innerHTML = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 화면 크기 및 안전 여백
        const safeMargin = 30; // 더 큰 안전 여백 설정
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 임시로 DOM에 추가하여 크기 측정 (실제 크기 기반 계산을 위함)
        popup.style.opacity = '0';
        popup.style.visibility = 'hidden';
        popup.style.position = 'fixed';
        popup.style.maxWidth = `${Math.min(350, viewportWidth - safeMargin * 2)}px`;
        document.body.appendChild(popup);
        
        // 실제 요소 크기 측정
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;
        
        // 측정 후 임시 요소 제거
        document.body.removeChild(popup);
        
        // 안전하게 표시 가능한 영역 계산
        const minX = safeMargin;
        const maxX = viewportWidth - popupWidth - safeMargin;
        const minY = safeMargin;
        const maxY = viewportHeight - popupHeight - safeMargin;
        
        // 영역이 너무 좁아지면 조정 (화면이 매우 좁은 경우)
        const adjustedMaxX = Math.max(minX + 50, maxX);
        const adjustedMaxY = Math.max(minY + 50, maxY);
        
        // 화면 전체에 랜덤하게 위치 (안전 영역 내에서만)
        let x = Math.floor(Math.random() * (adjustedMaxX - minX) + minX);
        let y = Math.floor(Math.random() * (adjustedMaxY - minY) + minY);
        
        // 기존 팝업과 겹치는지 확인 및 회피
        const existingPopups = popupContainer.querySelectorAll('.popup-message.visible');
        const minDistance = 100; // 최소 거리
        let attempts = 0;
        const maxAttempts = 15;
        
        while (attempts < maxAttempts) {
            let overlapping = false;
            
            existingPopups.forEach(existingPopup => {
                const rect = existingPopup.getBoundingClientRect();
                const distance = Math.sqrt(
                    Math.pow(x - rect.left, 2) + 
                    Math.pow(y - rect.top, 2)
                );
                
                if (distance < minDistance) {
                    overlapping = true;
                }
            });
            
            if (!overlapping) break;
            
            // 새 위치 시도 - 영역 내에서만
            x = Math.floor(Math.random() * (adjustedMaxX - minX) + minX);
            y = Math.floor(Math.random() * (adjustedMaxY - minY) + minY);
            attempts++;
        }
        
        // 최종 위치 적용
        popup.style.opacity = '';
        popup.style.visibility = '';
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        popup.style.transform = 'scale(0.9)'; // 초기 크기
        
        // 컨테이너에 추가
        popupContainer.appendChild(popup);

        // 표시 애니메이션
        setTimeout(() => {
            popup.classList.add('visible');
        }, 10);

        // 2~3초 후 사라짐 (랜덤)
        const displayTime = 2000 + Math.random() * 1000;
        setTimeout(() => {
            popup.classList.remove('visible');
            
            setTimeout(() => {
                if (popup.parentNode === popupContainer) {
                    popupContainer.removeChild(popup);
                }
            }, 500);
        }, displayTime);
    };

    // 팝업 메시지 시퀀스 함수 (모든 환경에서 동일하게 동작)
    const playPopupMessages = () => {
        return new Promise(resolve => {
            let index = 0;
            let delay = 1000; // 초기 딜레이 (ms)
            let minDelay = 150; // 최소 딜레이 (ms)

            let isFirstPopup = true;

            const showNextPopup = () => {
                if (index < popupMessages.length) {
                    createPopupMessage(popupMessages[index], isFirstPopup);
                    isFirstPopup = false;
                    index++;

                    // 점점 빠르게 (딜레이 감소)
                    delay = Math.max(minDelay, delay * 0.8);

                    // 다음 메시지 스케줄링
                    setTimeout(showNextPopup, delay);
                } else {
                    // 모든 메시지 표시 후 완료
                    setTimeout(resolve, 2000);
                }
            };

            // 첫 번째 메시지 표시
            setTimeout(showNextPopup, 500);
        });
    };

    // 마지막 메시지 추가 함수
    // 최종 메시지를 추가하는 함수
    const addFinalMessage = () => {
        // 효과음 재생 (첫 메시지도 소리 재생)
        messageSound.currentTime = 0;
        messageSound.play().catch(err => console.log("효과음 재생 불가:", err));

        finalMessageContainer.style.display = 'flex';
        finalMessageContainer.innerHTML = ''; // 기존 내용 초기화

        // 메시지 요소 생성
        const message = document.createElement('div');
        message.classList.add('final-message');
        message.textContent = finalMessage;

        // 컨테이너에 메시지 추가
        finalMessageContainer.appendChild(message);

        // 메시지 표시 애니메이션
        setTimeout(() => {
            message.classList.add('visible');
        }, 50);

        return message;
    };

    // 마지막 메시지 표시 함수
    // 최종 메시지를 표시하고 일정 시간 후 사라지게 하는 함수
    const showFinalMessage = () => {
        return new Promise(resolve => {
            addFinalMessage();

            // 3초 후 사라짐
            setTimeout(() => {
                const message = finalMessageContainer.querySelector('.final-message');

                if (message) {
                    message.classList.remove('visible');
                }

                // 트랜지션 완료 후 컨테이너 숨김
                setTimeout(() => {
                    finalMessageContainer.style.display = 'none';
                    resolve();
                }, 700);
            }, 3000);
        });
    };

    // 재시작 메시지 표시 함수 - 시계 소리와 메시지 표시 순서 수정
    const showRestartMessage = () => {
        // 메시지 요소들
        const messageElement = restartMessageContainer.querySelector('.restart-message');
        const updateMessage = document.getElementById('updateMessage');
        
        // 모든 메시지 초기 숨김 처리
        messageElement.style.display = 'none';
        messageElement.classList.remove('visible');
        updateMessage.style.display = 'none';
        updateMessage.classList.remove('visible');
        
        // 시계 소리 재생 (시작점)
        tickingSound.currentTime = 0;
        tickingSound.loop = true;
        tickingSound.play().catch(err => console.log("시계 소리 재생 불가:", err));
        
        // 시계 소리 5초 지속 후 중단
        setTimeout(() => {
            // 시계 소리 중지
            tickingSound.pause();
            tickingSound.currentTime = 0;
            
            // 패닉 효과음 재생
            panicSound.currentTime = 0;
            panicSound.play().catch(err => console.log("패닉 효과음 재생 불가:", err));
            
            // 패닉 소리와 함께 첫 번째 메시지 표시
            messageElement.style.display = 'block';
            setTimeout(() => {
                messageElement.classList.add('visible');
                
                // 3초 후 두 번째 메시지 표시
                setTimeout(() => {
                    updateMessage.style.display = 'block';
                    setTimeout(() => {
                        updateMessage.classList.add('visible');
                    }, 50);
                }, 3000);
            }, 50);
        }, 5000); // 시계 소리 5초 지속
    };

    // 크레딧 완료 시 마지막 메시지 표시 함수
    function showLastMessage() {
        if (isLastPartDisplayed) return;
        isLastPartDisplayed = true;
    
        // 크레딧 컨테이너 숨김
        if (creditsContainer) {
            creditsContainer.style.display = 'none';
        }
    
        // 배경 색상 어둡게 유지
        if (darkOverlay) {
            darkOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        }
    
        // 마지막 메시지 컨테이너 초기화
        if (restartMessageContainer) {
            // 컨테이너 클래스 추가로 스타일 적용
            restartMessageContainer.classList.add('visible');
            restartMessageContainer.style.display = 'flex';
    
            // 모든 자식 요소 위치 및 스타일 설정
            const restartMsg = restartMessageContainer.querySelector('.restart-message');
            const updateMsg = document.getElementById('updateMessage');
    
            // 메시지 스타일 조정
            if (restartMsg) {
                restartMsg.style.position = 'absolute';
                restartMsg.style.top = '50%';
                restartMsg.style.left = '50%';
                restartMsg.style.transform = 'translate(-50%, -50%)';
                restartMsg.style.width = '90%';
                restartMsg.style.maxWidth = '600px';
                restartMsg.style.margin = '0 auto';
                restartMsg.style.textAlign = 'center';
                restartMsg.style.right = 'auto';
                restartMsg.textContent = "완성된 삶으로부터, 재시작하시겠습니까?";
            }
    
            if (updateMsg) {
                updateMsg.style.position = 'absolute';
                updateMsg.style.top = 'calc(50% + 80px)';
                updateMsg.style.left = '50%';
                updateMsg.style.transform = 'translateX(-50%)';
                updateMsg.style.width = 'auto';
                updateMsg.style.maxWidth = '350px';
                updateMsg.style.minWidth = '250px';
                updateMsg.style.margin = '0 auto';
                updateMsg.style.textAlign = 'center';
                updateMsg.style.background = 'transparent';
                updateMsg.style.right = 'auto';
                updateMsg.style.display = 'none';
                updateMsg.style.whiteSpace = 'nowrap';
                updateMsg.textContent = "실크송 출시하면 업데이트 함";
            }
        }
    
        // 배경음 페이드 아웃 후 5초 지연 시간을 두고 마지막 시퀀스 시작
        fadeOutBackgroundMusic().then(() => {
            setTimeout(() => {
                showRestartMessage();
            }, 5000); // 5초 후 시계 소리 재생 및 메시지 시퀀스 시작
        });
    }
    

    // 크레딧 준비 및 시작 함수
    const prepareCredits = () => {
        // 스크롤 위치 초기화
        scrollPosition = 0;

        // 음원 크레딧 추가
        addSoundCredits();

        // 눈 내리는 효과 시작
        const snowInterval = setInterval(createSnow, 200);

        // 페이지 전체 스크롤 방지
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        // 크레딧 컨테이너 표시 및 스타일 설정
        creditsContainer.style.display = 'flex';
        creditsContainer.style.position = 'fixed';
        creditsContainer.style.top = '0';
        creditsContainer.style.left = '0';
        creditsContainer.style.width = '100%';
        creditsContainer.style.height = '100%';
        creditsContainer.style.maxWidth = '100vw';
        creditsContainer.style.overflowX = 'hidden';
        creditsContainer.style.overflowY = 'hidden';
        creditsContainer.style.display = 'flex';
        creditsContainer.style.justifyContent = 'center';
        creditsContainer.style.alignItems = 'flex-start';
        creditsContainer.classList.add('visible');

        // 크레딧 콘텐츠 요소 준비
        const creditsContent = document.querySelector('.credits-content');
        if (creditsContent) {
            // 초기 위치 설정 - 화면 아래에서 시작
            creditsContent.style.position = 'absolute';

            // 화면 크기에 맞게 너비 최적화
            let fixedWidth;
            if (window.innerWidth <= 480) {
                fixedWidth = Math.min(320, window.innerWidth - 40);
            } else if (window.innerWidth <= 768) {
                fixedWidth = Math.min(600, window.innerWidth - 60);
            } else {
                fixedWidth = Math.min(800, window.innerWidth - 80);
            }

            // 스타일 적용
            creditsContent.style.width = `${fixedWidth}px`;
            creditsContent.style.maxWidth = `${fixedWidth}px`;
            creditsContent.style.left = "50%";
            creditsContent.style.right = "auto";
            creditsContent.style.marginLeft = "0";
            creditsContent.style.marginRight = "0";

            // 초기 위치 설정
            creditsContent.style.transform = `translateX(-50%) translateY(${window.innerHeight * 2}px)`;

            // 모든 섹션이 보이게 설정
            const allSections = creditsContent.querySelectorAll('.credits-section');
            allSections.forEach(section => {
                section.style.opacity = '1';
                section.style.visibility = 'visible';
            });

            // 스타일을 적용한 후 약간 시간을 두고 애니메이션 시작
            setTimeout(() => {
                animationId = requestAnimationFrame(scrollCredits);
            }, 500);
        }
    };

    // 스크롤 애니메이션 함수
    // 크레딧을 스크롤하는 애니메이션 함수
    const scrollCredits = () => {
        scrollPosition += currentScrollSpeed;

        // 페이지 스크롤 방지 
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        // 컨텐츠 위치 업데이트
        if (content) {
            // 크레딧 컨테이너 스타일 설정
            creditsContainer.style.position = 'fixed';
            creditsContainer.style.top = '0';
            creditsContainer.style.left = '0';
            creditsContainer.style.width = '100%';
            creditsContainer.style.height = '100%';
            creditsContainer.style.maxWidth = '100vw';
            creditsContainer.style.overflowX = 'hidden';
            creditsContainer.style.overflowY = 'hidden';
            creditsContainer.style.display = 'flex';
            creditsContainer.style.justifyContent = 'center';
            creditsContainer.style.alignItems = 'flex-start';

            // 고정된 너비 설정
            let fixedWidth;
            if (window.innerWidth <= 480) { // 모바일
                fixedWidth = Math.min(320, window.innerWidth - 40);
            } else if (window.innerWidth <= 768) { // 태블릿
                fixedWidth = Math.min(600, window.innerWidth - 60);
            } else { // 데스크톱
                fixedWidth = Math.min(800, window.innerWidth - 80);
            }

            // 컨텐츠 스타일 설정
            content.style.position = 'absolute';
            content.style.width = `${fixedWidth}px`;
            content.style.maxWidth = `${fixedWidth}px`;
            content.style.left = "50%";
            content.style.right = "auto";
            content.style.marginLeft = "0";
            content.style.marginRight = "0";

            // Y축 애니메이션 적용
            content.style.transform = `translateX(-50%) translateY(${window.innerHeight * 1.2 - scrollPosition}px)`;

            // 스크롤 중임을 표시하는 클래스 추가
            creditsContainer.classList.add('scrolling-active');
        }

        // 총 스크롤할 거리 계산 - 더 길게 설정하여 끝까지 보이도록
        const totalScrollDistance = content.offsetHeight + window.innerHeight * 3;

        // 현재 스크롤 위치 비율 계산
        const scrollRatio = Math.min(scrollPosition / totalScrollDistance, 1);

        // 배경 어둡게 변경
        darkOverlay.style.backgroundColor = `rgba(0, 0, 0, ${scrollRatio})`;

        // 모든 섹션이 보이게 하기 위한 로직
        const allSections = content.querySelectorAll('.credits-section');
        if (allSections.length > 0) {
            // 각 섹션 강제 표시
            allSections.forEach(section => {
                section.style.opacity = '1';
                section.style.visibility = 'visible';
            });
        }

        // 끝까지 스크롤되었는지 확인
        const completionThreshold = 1.5;
        const contentBottom = content.offsetHeight;
        const currentPosition = scrollPosition - window.innerHeight * 1.2;
        const isBottomReached = currentPosition >= contentBottom;

        // 크레딧 완료 조건 확인
        if (scrollPosition < totalScrollDistance * completionThreshold &&
            !isBottomReached &&
            !isCreditsComplete) {
            animationId = requestAnimationFrame(scrollCredits);
        } else {
            // 마지막 섹션까지 보였는지 확인
            const lastSection = content.querySelector('.credits-section:last-child');
            if (lastSection) {
                const lastSectionRect = lastSection.getBoundingClientRect();
                if (lastSectionRect.bottom > 0) {
                    animationId = requestAnimationFrame(scrollCredits);
                    return;
                }
            }

            // 스크롤 완료
            isCreditsComplete = true;

            // 페이드 아웃 배경 음악 후 마지막 메시지 표시
            fadeOutBackgroundMusic().then(() => {
                setTimeout(() => {
                    // 페이지 스크롤 복원
                    document.documentElement.style.overflow = 'auto';
                    document.body.style.overflow = 'auto';

                    showLastMessage();
                }, 1000);
            });
        }
    };

    // 전체 시퀀스 실행 함수 (메인)
    const runSequence = async () => {
        // 신원 선택 화면 표시
        createIdentitySelector();
    };

    // 시퀀스 시작
    runSequence();

    // 스크롤 속도 조절 이벤트 리스너 설정
    setupScrollSpeedListeners();
});