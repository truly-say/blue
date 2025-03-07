// src/scripts/script.js
document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 초기 선택 및 참조
    const textEl = document.querySelector('.status-text');          // 상태 텍스트를 표시할 요소
    const gaugeEl = document.querySelector('.status-progress');     // 진행 상태바 요소
    const timeDisplay = document.querySelector('#current-datetime'); // 현재 시간 표시 요소
    const countdownDisplay = document.querySelector('#countdown');   // 카운트다운 표시 요소
    const glitchTarget = document.querySelector('.intermittent-glitch'); // 글리치 효과 적용 대상
    const container = document.querySelector('.container');         // 메인 컨테이너
    const youthButton = document.getElementById('youth-button');    // 미완성 청춘으로 버튼

    // 제목 클릭 이벤트 처리
    const mainTitle = document.getElementById('main-title');
    if (mainTitle) {
        let clickCount = 0;
        let timeout = null;

        // 클릭 및 터치 이벤트 리스너 추가
        mainTitle.addEventListener('click', handleTitleInteraction);
        mainTitle.addEventListener('touchend', function (e) {
            e.preventDefault(); // 더블 클릭 방지
            handleTitleInteraction();
        });

        // 제목 상호작용 처리 함수
        function handleTitleInteraction() {
            // 클릭 카운트 증가
            clickCount++;

            // 시간 초과 설정 (여러 번 클릭을 하나의 시퀀스로 간주)
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                // 확률 계산 (3번 이상 클릭하면 30% 확률로 글리치 효과 적용)
                if (clickCount >= 3 && Math.random() < 0.3) {
                    applyTitleGlitchEffect();
                }
                // 클릭 카운트 초기화
                clickCount = 0;
            }, 500);
        }

        // 글리치 효과 및 텍스트 변경 함수 - BLUE LAM 스타일
        function applyTitleGlitchEffect() {
            // 간소화된 글리치 효과 클래스 추가
            mainTitle.classList.add('simple-title-glitch');

            // 텍스트 변경 ("청춘의 최종본"으로)
            setTimeout(() => {
                mainTitle.textContent = mainTitle.getAttribute('data-alternate');
            }, 150);

            // 잠시 후 원래 상태로 복원
            setTimeout(() => {
                mainTitle.classList.remove('simple-title-glitch');

                setTimeout(() => {
                    mainTitle.classList.add('simple-title-glitch');
                    setTimeout(() => {
                        mainTitle.textContent = mainTitle.getAttribute('data-original');

                        // 글리치 효과 클래스 제거
                        setTimeout(() => {
                            mainTitle.classList.remove('simple-title-glitch');
                        }, 150);
                    }, 100);
                }, 1500); // 1.5초 동안 "청춘의 최종본" 표시
            }, 300);
        }
    }

    // youth-button 클릭 이벤트 추가
    if (youthButton) {
        youthButton.addEventListener('click', () => {
            window.location.href = './src/pages/youth.html';
        });
    }

    // info-card 클릭 이벤트 처리
    const infoCards = document.querySelectorAll(".info-card");
    infoCards.forEach((card) => {
        card.addEventListener("click", () => {
            // data-page 속성에서 페이지 정보를 가져와 해당 페이지로 이동
            let page = card.getAttribute("data-page");
            if (page) {
                let targetUrl = `./src/pages/${page}.html`;
                window.location.href = targetUrl;
            }
        });
    });

    // 상태 관리 클래스 정의
    class StatusManager {
        constructor(config) {
            this.config = config;                    // 설정 객체
            this.imageElements = {};                 // 이미지 요소 저장 객체
            this.usedMessages = [];                  // 사용된 메시지 추적 배열
            this.currentlyVisibleImage = null;       // 현재 표시 중인 이미지
            this.cycleInProgress = false;           // 메시지 순환 진행 상태
            this.progressAnimation = null;           // 프로그레스 바 애니메이션 참조

            this.initializeImages();                // 이미지 초기화 호출
        }

        // 이미지 초기화 메소드
        initializeImages() {
            const container = document.querySelector('.container');
            if (!container) {
                console.error('Container element not found');
                return;
            }

            // 시스템 상태 섹션에 이미지 요소들 추가
            const systemStatus = document.querySelector('.system-status') || container;
            Object.entries(this.config.messages).forEach(([message, imagePath]) => {
                const img = this.createImageElement(imagePath);
                systemStatus.appendChild(img);
                this.imageElements[message] = img;
            });
        }

        // 이미지 요소 생성 메소드
        createImageElement(imagePath) {
            const img = document.createElement('img');
            img.src = imagePath || this.config.defaultImage;
            img.alt = "Status Image";
            img.className = 'status-image-overlay';
            // 초기 상태: 숨김
            img.style.opacity = '0';
            img.style.visibility = 'hidden';

            // 이미지 로드 실패 시 기본 이미지로 대체
            img.onerror = () => {
                console.error(`Failed to load image: ${imagePath}`);
                img.src = this.config.defaultImage;
            };

            return img;
        }

        // 랜덤 메시지 선택 메소드
        getRandomMessage() {
            const messages = Object.keys(this.config.messages);
            // 모든 메시지가 사용되었다면 초기화
            if (this.usedMessages.length === messages.length) {
                this.usedMessages = [];
            }

            // 아직 사용되지 않은 메시지 중에서 랜덤 선택
            let availableMessages = messages.filter(msg => !this.usedMessages.includes(msg));
            const randomMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)];
            this.usedMessages.push(randomMessage);
            return randomMessage;
        }

        // 이미지 표시 메소드
        async showImage(message) {
            const newImage = this.imageElements[message];
            if (!newImage) return;

            // 제한된 접근 메시지 확인
            const isRestrictedAccess = message === "y_pred = model.predict(X_test)";

            // 이전 이미지가 있다면 페이드 아웃
            if (this.currentlyVisibleImage) {
                await this.fadeOutImage(this.currentlyVisibleImage);
            }

            // 새 이미지 페이드 인 (제한 접근 플래그 전달)
            await this.fadeInImage(newImage, isRestrictedAccess);
            this.currentlyVisibleImage = newImage;
        }

        // 이미지 페이드 아웃 효과
        async fadeOutImage(image) {
            image.style.opacity = '0';
            image.classList.remove('bounce-active');
            // 애니메이션 클래스 제거 후 기본 위치로 복원
            image.style.transform = 'translateX(-50%)';
            await new Promise(resolve => setTimeout(resolve, this.config.animationDuration));
            image.style.visibility = 'hidden';
        }

        // 이미지 페이드 인 효과
        async fadeInImage(image, isRestrictedAccess = false) {
            image.style.visibility = 'visible';
            await new Promise(resolve => setTimeout(resolve, 50));
            image.style.opacity = '1';

            // 제한된 접근 메시지일 때는 바운스 효과 적용하지 않음
            if (!isRestrictedAccess) {
                // translateX(-50%)은 유지하면서 바운스 효과 적용
                image.style.transform = 'translateX(-50%)'; // 기본 X축 중앙 정렬 유지
                image.classList.add('bounce-active');
            } else {
                // 제한된 접근의 경우 바운스 효과 없이 기본 위치 유지
                image.style.transform = 'translateX(-50%)'; // X축 중앙 정렬만 유지
                image.classList.remove('bounce-active');
            }
        }

        // 프로그레스 바 애니메이션
        animateProgress(duration, targetProgress) {
            if (this.progressAnimation) {
                cancelAnimationFrame(this.progressAnimation);
            }

            const startTime = Date.now();
            const startProgress = parseFloat(gaugeEl.style.width) || 0;

            const update = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentProgress = startProgress + (targetProgress - startProgress) * progress;

                gaugeEl.style.width = `${currentProgress}%`;

                if (progress < 1) {
                    this.progressAnimation = requestAnimationFrame(update);
                }
            };

            this.progressAnimation = requestAnimationFrame(update);
        }

        // 메시지 순환 실행
        async runMessageCycle(message) {
            if (!textEl || !gaugeEl) return;

            this.cycleInProgress = true;
            // 특정 메시지에 대한 접근 제한 체크
            const isRestrictedAccess = message === "y_pred = model.predict(X_test)";

            // 프로그레스 바 초기화 및 애니메이션 시작
            gaugeEl.style.width = '0%';
            this.animateProgress(3000, 100);

            // 메시지와 이미지 표시
            textEl.textContent = message;
            await this.showImage(message);

            // 로딩 점(...)을 추가하는 애니메이션
            let dots = '';
            for (let i = 0; i < 3; i++) {
                // 제한된 접근일 경우 처리
                if (isRestrictedAccess && i === 1) {
                    cancelAnimationFrame(this.progressAnimation);
                    textEl.textContent = "[접근 권한 없음]";
                    textEl.classList.add('restricted-access');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    break;
                }

                dots += '.';
                textEl.textContent = `${message}${dots}`;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            await new Promise(resolve => setTimeout(resolve, 3000));

            // 현재 표시 중인 이미지 페이드 아웃
            if (this.currentlyVisibleImage) {
                await this.fadeOutImage(this.currentlyVisibleImage);
            }

            this.cycleInProgress = false;
        }

        // 메시지 루프 시작
        async startMessageLoop() {
            while (true) {
                if (!this.cycleInProgress) {
                    const message = this.getRandomMessage();
                    await this.runMessageCycle(message);
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }

    // StatusManager 인스턴스 생성 및 시작
    const statusManager = new StatusManager(STATUS_CONFIG);
    statusManager.startMessageLoop();

    // 날짜/시간 업데이트 함수
    function updateDateTime() {
        const now = new Date();
        const departureDate = new Date('2025-03-09T00:00:00');
        const diff = departureDate - now;

        // 날짜 차이 계산
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // 현재 시간 표시 업데이트
        if (timeDisplay) {
            timeDisplay.textContent = new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).format(now);
        }

        // 카운트다운 표시 업데이트
        if (countdownDisplay) {
            if (diff <= 0) {
                // 카운트다운 종료 시 버튼 표시
                const youthButton = document.getElementById('youth-button');
                if (youthButton && youthButton.classList.contains('hidden')) {
                    youthButton.classList.remove('hidden');
                }
                countdownDisplay.textContent = `0d 00h 00m 00s`;
            } else {
                // 시간 형식 맞추기 (2자리 숫자)
                const formatNumber = (num) => String(num).padStart(2, '0');
                countdownDisplay.textContent = `${days}d ${formatNumber(hours)}h ${formatNumber(minutes)}m ${formatNumber(seconds)}s`;
            }
        }
    }

    // 랜덤 글리치 효과 트리거
    function triggerRandomGlitch() {
        if (glitchTarget && Math.random() < 0.2) {  // 20% 확률로 글리치 발생
            glitchTarget.classList.add('glitch-active');
            if (Math.random() < 0.3) {  // 30% 확률로 추가 텍스트 변형 효과
                glitchTarget.classList.add('text-morph');
            }
            setTimeout(() => {
                glitchTarget.classList.remove('glitch-active', 'text-morph');
            }, 500);
        }
    }

    // 키보드 입력 감지 및 페이지 이동
    let userInput = "";
    document.addEventListener("keydown", (event) => {
        userInput += event.key.toLowerCase();

        // "lam" 입력 시 youth.html로 이동
        if (userInput.endsWith("lam")) {
            window.location.href = "./src/pages/youth.html";
        }

        // 입력 버퍼 크기 제한
        if (userInput.length > 10) {
            userInput = userInput.slice(-10);
        }
    });

    // 주기적 업데이트 설정
    setInterval(updateDateTime, 1000);      // 매 초마다 시간 업데이트
    setInterval(triggerRandomGlitch, 5000); // 5초마다 글리치 효과 시도
});