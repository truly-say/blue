// src/scripts/credits.js
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
    const messageSound = new Audio('../../assets/audio/MP_Pling.mp3');
    const tickingSound = new Audio('../../assets/audio/MP_시계 똑딱 소리.mp3');
    const panicSound = new Audio('../../assets/audio/MP_Panic.mp3');
    
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
    let normalScrollSpeed = 0.5; // 일반 스크롤 속도
    let fastScrollSpeed = 5; // 빠른 스크롤 속도
    let currentScrollSpeed = normalScrollSpeed;
    let scrollPosition = 0;
    let animationId = null;
    let isCreditsComplete = false; // 크레딧이 끝났는지 추적하는 변수
    
    // 신원 선택 기능 추가
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
            button.addEventListener('click', function() {
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
                .then(() => playPopupMessages())
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
            playPartialCenterMessages(19, centerMessages.length - 1)
                .then(() => playMainMessages())
                .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
                .then(() => playPopupMessages())
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
    const playPartialCenterMessages = (startIndex, endIndex) => {
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
        const targetVolume = 0.8; // 최종 볼륨
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
            const fadeOutDuration = 5000; // 5초 동안 페이드 아웃
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
        });
    }
    
    // 특정 인덱스부터 시작하는 전체 시퀀스
    function runFullSequence(startIndex) {
        playCenterMessagesFromIndex(startIndex)
            .then(() => playMainMessages())
            .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
            .then(() => playPopupMessages())
            .then(() => showFinalMessage())
            .then(() => {
                prepareCredits();
                setTimeout(() => {
                    animationId = requestAnimationFrame(scrollCredits);
                }, 100);
            });
    }
    
    // 바로 크레딧으로 건너뛰기
    function skipToCredit() {
        prepareCredits();
        setTimeout(() => {
            animationId = requestAnimationFrame(scrollCredits);
        }, 100);
    }
    
    // 눈 내리는 효과
    function createSnow() {
        const container = document.body; // 전체 body에 눈 내리게 함
        const snow = document.createElement('div');
        snow.className = 'snow-particle';
        
        const size = Math.random() * 3 + 1;
        const startPositionX = Math.random() * window.innerWidth;
        
        snow.style.width = `${size}px`;
        snow.style.height = `${size}px`;
        snow.style.left = `${startPositionX}px`;
        snow.style.top = '-10px';
        
        container.appendChild(snow);
        
        let positionY = -10;
        let positionX = startPositionX;
        const speed = Math.random() * 1 + 0.5;
        const wind = Math.random() * 2 - 1;
        
        function fall() {
            positionY += speed;
            positionX += wind;
            snow.style.transform = `translate(${positionX - startPositionX}px, ${positionY}px)`;
            
            if (positionY < window.innerHeight) {
                requestAnimationFrame(fall);
            } else {
                snow.remove();
            }
        }
        
        fall();
    }
    
    // 건너뛰기 버튼 생성
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
    function setScrollSpeed(isFast) {
        currentScrollSpeed = isFast ? fastScrollSpeed : normalScrollSpeed;
    }
    
    // 이벤트 리스너 재설정 함수
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
        addMessage: function(text, wrapper = messagesWrapper) {
            // 효과음 재생 (첫 메시지가 아닐 때만)
            if (!this.isFirstMessage) {
                messageSound.currentTime = 0;
                messageSound.play().catch(err => console.log("효과음 재생 불가:", err));
            } else {
                this.isFirstMessage = false; // 첫 메시지 플래그 해제
            }
            
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
        removeMessage: function(message) {
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
        removeAllMessages: function(wrapper = messagesWrapper) {
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
        addSkipButton: function(messageType, onSkip) {
            // 기존 버튼 제거
            if (this.skipButton && this.skipButton.parentNode) {
                this.skipButton.parentNode.removeChild(this.skipButton);
            }
            
            this.skipButton = createSkipButton(messageType, onSkip);
            document.body.appendChild(this.skipButton);
        },
        
        // 건너뛰기 버튼 제거
        removeSkipButton: function() {
            if (this.skipButton && this.skipButton.parentNode) {
                this.skipButton.parentNode.removeChild(this.skipButton);
                this.skipButton = null;
            }
        }
    };
    
    // 수정된 중앙 메시지 시퀀스 함수 (특정 인덱스부터 시작 가능)
    const playCenterMessagesFromIndex = (startIndex) => {
        return new Promise(resolve => {
            let index = startIndex;
            const interval = 3500; // 메시지 간 간격
            const index14thGenStart = 19; // 14기 메시지 시작 인덱스
            let isCancelled = false; // 건너뛰기 상태 추적
            
            // 건너뛰기 버튼 생성 및 처리
            function setupSkipButtons() {
                // 이전 버튼 제거
                messageManager.removeSkipButton();
                
                // 현재 상태에 맞는 건너뛰기 버튼 추가
                if (index < index14thGenStart && startIndex < index14thGenStart) {
                    // 11기 메시지 건너뛰기
                    const skipTo14 = () => {
                        messageManager.removeAllMessages();
                        isCancelled = true;
                        index = index14thGenStart;
                        
                        // 메시지 초기화 후 0.5초 뒤 14기 첫 메시지 표시
                        setTimeout(() => {
                            isCancelled = false;
                            messageManager.addMessage(centerMessages[index]);
                            index++;
                            setupSkipButtons(); // 버튼 상태 업데이트
                            showNextMessage(); // 다음 메시지 표시 계속
                        }, 500);
                    };
                    
                    messageManager.addSkipButton("11기", skipTo14);
                    
                } else if (index >= index14thGenStart) {
                    // 14기 메시지 건너뛰기
                    const skipAllMessages = () => {
                        messageManager.removeAllMessages();
                        messageManager.removeSkipButton();
                        isCancelled = true;
                        resolve(); // 모든 메시지 건너뛰고 다음 단계로
                    };
                    
                    messageManager.addSkipButton("14기", skipAllMessages);
                }
            }
            
            // 메시지 표시 함수
function showNextMessage() {
    if (isCancelled) return; // 건너뛰기 발생 시 종료
    
    if (index < centerMessages.length) {
        // 14기 메시지 시작 시 이전 메시지 모두 제거 (11기에서 시작한 경우만)
        if (index === index14thGenStart && startIndex < index14thGenStart) {
            messageManager.removeAllMessages();
            
            // 약간 딜레이를 주어 기존 메시지가 완전히 사라진 후 새 메시지 표시
            setTimeout(() => {
                if (isCancelled) return;
                messageManager.addMessage(centerMessages[index]);
                index++;
                setupSkipButtons(); // 버튼 상태 업데이트
                setTimeout(showNextMessage, interval);
            }, 500);
            return; // 여기서 함수 종료하여 아래 코드 실행 방지
        }
        
        messageManager.addMessage(centerMessages[index]);
        index++;
        setupSkipButtons(); // 메시지 추가 후 버튼 상태 업데이트
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
if (startIndex === 0 || startIndex === index14thGenStart) {
    // 처음 또는 14기 시작 부분인 경우 메시지 컨테이너 초기화
    messagesWrapper.innerHTML = '';
    mainMessagesContainer.style.display = 'none';
    finalMessageContainer.style.display = 'none';
}

// 초기 건너뛰기 버튼 설정
setupSkipButtons();

// 첫 번째 메시지 표시
showNextMessage();
});
};

// 메인 메시지 추가 함수
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

// 팝업 메시지 생성 함수
const createPopupMessage = (message, isFirstMessage = false) => {
// 효과음 재생 (첫 메시지가 아닐 때만)
if (!isFirstMessage) {
    messageSound.currentTime = 0;
    messageSound.play().catch(err => console.log("효과음 재생 불가:", err));
}

// 팝업 요소 생성
const popup = document.createElement('div');
popup.classList.add('popup-message');

// 마크다운 스타일 직접 변환
popup.innerHTML = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

// 랜덤 위치 계산 (화면 크기 기준)
const padding = 20;
const maxWidth = window.innerWidth - 350; // 메시지 최대 너비와 패딩 고려
const maxHeight = window.innerHeight - 100;

// 기존 팝업들이 위치한 곳을 피해서 배치 (완전 랜덤 위치에서 시작)
let x, y;
let attempts = 0;
const maxAttempts = 10; // 최대 시도 횟수

// 기존 팝업 요소들 가져오기
const existingPopups = popupContainer.querySelectorAll('.popup-message.visible');

do {
    // 랜덤 위치 생성
    x = padding + Math.random() * Math.max(100, maxWidth - 100);
    y = padding + Math.random() * Math.max(100, maxHeight - 100);
    
    // 기존 팝업과 겹치는지 확인
    let overlapping = false;
    existingPopups.forEach(existingPopup => {
        const rect = existingPopup.getBoundingClientRect();
        // 간단한 겹침 검사 (네 귀퉁이 모두 100px 이상 거리 유지)
        const minDistance = 100;
        if (Math.abs(x - rect.left) < minDistance && Math.abs(y - rect.top) < minDistance) {
            overlapping = true;
        }
    });
    
    attempts++;
    if (!overlapping || attempts >= maxAttempts) break;
} while (true);

// 위치 적용
popup.style.left = `${Math.min(x, maxWidth)}px`;
popup.style.top = `${y}px`;

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
    
    // 트랜지션 완료 후 요소 제거
    setTimeout(() => {
        if (popup.parentNode === popupContainer) {
            popupContainer.removeChild(popup);
        }
    }, 500);
}, displayTime);
};

// 팝업 메시지 시퀀스 함수
const playPopupMessages = () => {
return new Promise(resolve => {
    let index = 0;
    let delay = 1000; // 초기 딜레이 (ms) - 더 느리게 시작
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

// 재시작 메시지 표시 함수
const showRestartMessage = () => {
    return new Promise(resolve => {
        // 시계 소리 재생 (먼저 5초간)
        tickingSound.currentTime = 0;
        tickingSound.loop = true;
        tickingSound.play().catch(err => console.log("시계 소리 재생 불가:", err));
        
        restartMessageContainer.style.display = 'flex';
        
        // 5초 후에 패닉 효과음과 함께 메시지 표시
        setTimeout(() => {
            // 패닉 효과음 재생
            panicSound.currentTime = 0;
            panicSound.play().catch(err => console.log("패닉 효과음 재생 불가:", err));
            
            // 메인 메시지 표시
            const messageElement = restartMessageContainer.querySelector('.restart-message');
            messageElement.classList.add('visible');
            
            // 3초 후 업데이트 메시지 표시
            setTimeout(() => {
                const updateMessage = document.getElementById('updateMessage');
                updateMessage.style.display = 'block';
                setTimeout(() => {
                    updateMessage.classList.add('visible');
                    
                    // 2초 후 기다림 메시지 표시
                    setTimeout(() => {
                        const waitMessage = document.getElementById('waitMessage');
                        waitMessage.style.display = 'block';
                        setTimeout(() => {
                            waitMessage.classList.add('visible');
                        }, 50);
                    }, 2000);
                }, 50);
            }, 3000);
            
            resolve();
        }, 5000);
    });
}

// 크레딧 준비 및 시작
const prepareCredits = () => {
// 눈 내리는 효과 시작
const snowInterval = setInterval(createSnow, 200);

// 크레딧 완료 후 재시작 메시지 표시 함수
function onCreditsComplete() {
    isCreditsComplete = true;
    
    // 페이드 아웃 배경 음악
    fadeOutBackgroundMusic().then(() => {
        // 시간차를 두고 재시작 메시지 표시
        setTimeout(() => {
            clearInterval(snowInterval); // 눈 내리는 효과 중지
            showRestartMessage();
        }, 5000);
    });
}

// 크레딧 컨테이너 표시
creditsContainer.classList.add('visible');

// 크레딧 총 길이를 기준으로 완료 시점 감지
const creditsContent = document.querySelector('.credits-content');
if (creditsContent) {
    // 크레딧의 총 높이 (스크롤해야 할 거리)
    const totalHeight = creditsContent.offsetHeight + window.innerHeight;
    // 크레딧 스크롤 상태 모니터링 시작
    const checkScrollInterval = setInterval(() => {
        if (scrollPosition > totalHeight && !isCreditsComplete) {
            clearInterval(checkScrollInterval);
            onCreditsComplete();
        }
    }, 500);
}
};

// 스크롤 애니메이션 함수 - 최적화
const scrollCredits = () => {
scrollPosition += currentScrollSpeed;

// 컨텐츠 위치 업데이트 - requestAnimationFrame 내부에서만 DOM 업데이트
content.style.transform = `translate(-50%, -${scrollPosition}px)`;

// 총 스크롤할 거리 계산
const totalScrollDistance = content.offsetHeight + window.innerHeight;

// 현재 스크롤 위치 비율 계산 (0~1)
const scrollRatio = Math.min(scrollPosition / totalScrollDistance, 1);

// 배경 어둡게 변경 - 오버레이 사용
darkOverlay.style.backgroundColor = `rgba(0, 0, 0, ${scrollRatio * 0.7})`;

// 끝까지 스크롤되었는지 확인
if (scrollPosition < totalScrollDistance * 1.2) {
    animationId = requestAnimationFrame(scrollCredits);
} else {
    // 스크롤 완료됨
    cancelAnimationFrame(animationId);
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