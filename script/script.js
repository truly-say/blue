// script.js
document.addEventListener('DOMContentLoaded', () => {
    // 기본 요소 선택
    const textEl = document.querySelector('.status-text');
    const gaugeEl = document.querySelector('.status-progress');
    const timeDisplay = document.querySelector('#current-datetime');
    const countdownDisplay = document.querySelector('#countdown');
    const glitchTarget = document.querySelector('.intermittent-glitch');
    const container = document.querySelector('.container');

    const infoCards = document.querySelectorAll(".info-card");

    infoCards.forEach((card) => {
        card.addEventListener("click", () => {
            let page = card.getAttribute("data-page");

            if (page) {
                let targetUrl = `${page}/${page}.html`;
                window.location.href = targetUrl;
            }
        });
    });
    
    // 상태 메시지 설정
    const STATUS_CONFIG = {
        messages: {
            "도이성이 동네 편의점에서 과자를 고르고 있습니다":"/images/공주.png",
            "도이성이 집으로 돌아가고 있습니다":"/images/공주.png",
            "도이성이 짜증을 내며 면허증을 찾고 있습니다":"/images/공주.png",
            "은유벽이 방에 박혀있습니다":"/images/긍벽.png",
            "은유벽이 문자를 씹고 있습니다":"/images/긍벽.png",
            "은유벽이 알림을 끄고 있습니다":"/images/긍벽.png",
            "최예슬이 자리에 앉아 휴대폰을 보고 있습니다":"/images/커컥커.png",
            "최예슬이 정보를 수집하고 있습니다":"/images/커컥커.png",
            "최예슬이 책상 위 물건들을 정리하고 있습니다":"/images/커컥커.png",
            "최예슬이 자리에 앉아 휴대폰을 보고 있습니다":"/images/커컥커.png",
            "[신혜련의 생명 신호 감지되지 않음]":"/images/선청고등학교.png",
            "성주안이 노트에 무언가를 적고 있습니다":"/images/선청고등학교.png",
            "성주안이 부탁 받은 일은 도와주고 있습니다":"/images/선청고등학교.png",
            "성주안이 주변 사람들의 행동을 보고 있습니다":"/images/선청고등학교.png",
            "이도윤이 문을 열고 집을 나설 준비를 합니다":"/images/끼끼.png",
            "이도윤이 일어나서 기지개를 피고 있습니다":"/images/끼끼.png",
            "이도윤이 공원 벤치에 앉아 하늘을 보고 있습니다":"/images/끼끼.png",
            "구해늘이 방에서 시계 초침 소리를 듣고 있습니다":"/images/해팔.png",
            "구해늘이 병원에 방문하고 있습니다":"/images/해팔.png",
            "구해늘이 집중하는 듯 침묵을 지키고 있습니다":"/images/해팔.png",
            "유민이 다른 사람의 말을 경청하고 있습니다":"/images/선청고등학교.png",
            "유민이 상대의 행동을 지적하고 있습니다":"/images/선청고등학교.png",
            "유민이 가볍게 아침을 때우고 있습니다":"/images/선청고등학교.png",
            "[11기 졸업생]이 잠에서 깼습니다":"/images/토끼.png",
            "[11기 졸업생]이 토끼 인형을 안고 있습니다":"/images/토끼.png",
            "[11기 졸업생]이 튜터링을 준비하고 있습니다":"/images/토끼.png",
            "[11기 졸업생]이 업무 준비를 하고 있습니다":"/images/포도.png",
            "[11기 졸업생]이 경영 지식을 배우고 있습니다":"/images/포도.png",
            "[11기 졸업생]이 회의를 주도하고 있습니다":"/images/포도.png",
            "[신원 미상]이 소파에 늘어져 있습니다":"/images/겨ㅇ비.png",
             "[신원 미상]이 전화를 받고 있습니다":"/images/겨ㅇ비.png",
             "[신원 미상]이 업무 이메일을 읽고 있습니다":"/images/겨ㅇ비.png",
            "[선지현의 생명 신호 감지되지 않음]":"/images/선청고등학교.png",
            "[청검수의 생명 신호 감지되지 않음]":"/images/선청고등학교.png",
            "연해령이 모델 설계 및 개발하고 있습니다":"/images/선청고등학교.png",
            "연해령이 책상에 엎드려 자고 있습니다":"/images/선청고등학교.png",
            "연해령이 산책 중 만난 강아지를 쓰다듬고 있습니다":"/images/선청고등학교.png",
            "이지훈이 누군가의 생사를 확인하고 있습니다":"/images/선청고등학교.png",
            "이지훈이 거울을 보고 있습니다":"/images/선청고등학교.png",
            "이지훈이 상황 파악을 하고 있습니다":"/images/선청고등학교.png",
            "단하율이 취재를 준비하고 있습니다":"/images/선청고등학교.png",
            "단하율이 14기에게 연락을 시도하고 있습니다":"/images/선청고등학교.png",
            "단하율이 자료를 정리하고 있습니다":"/images/선청고등학교.png",
            "현진우가 슬기로운 감빵 생활 중입니다":"/images/선청고등학교.png",
            "현진우가 교도관 옆에서 밥을 먹고 있습니다":"/images/선청고등학교.png",
            "현진우가 침대에서 뒤척거리고 있습니다":"/images/선청고등학교.png",
            "y_pred = model.predict(X_test)": "/images/살구.png"
        },
        defaultImage: "/images/선청고등학교.png",
        cycleInterval: 3000, // 메시지 순환 간격 (ms)
        animationDuration: 300, // 이미지 전환 애니메이션 시간 (ms)
    };

    // 상태 관리 클래스
    class StatusManager {
        constructor(config) {
            this.config = config;
            this.imageElements = {};
            this.usedMessages = [];
            this.currentlyVisibleImage = null;
            this.cycleInProgress = false;
            this.progressAnimation = null;
            
            this.initializeImages();
        }

       initializeImages() {
    if (!container) {
        console.error('Container element not found');
        return;
    }

    const systemStatus = document.querySelector('.system-status') || container;

    Object.entries(this.config.messages).forEach(([message, imagePath]) => {
        console.log('Message:', message, ' Image Path:', imagePath);  // 이미지 경로 확인

        const img = this.createImageElement(imagePath);

        img.onload = () => {
            console.log(`Image successfully loaded: ${imagePath}`);
            systemStatus.appendChild(img);  // 정상적으로 이미지가 로드되면 append
        };

        img.onerror = () => {
            console.error(`Failed to load image: ${imagePath}`);
            img.src = this.config.defaultImage;  // 이미지 로드 실패 시 기본 이미지 로드
            systemStatus.appendChild(img);  // 실패한 경우에도 이미지 추가
        };
    });
}

       createImageElement(imagePath) {
    const img = document.createElement('img');

    console.log("Trying to load image with path:", imagePath);  // 경로 확인용

    img.src = imagePath || this.config.defaultImage;
    img.alt = "Status Image";
    img.className = 'status-image-overlay';
    img.style.opacity = '0';
    img.style.visibility = 'hidden';

    img.onload = () => {
        console.log(`Image loaded successfully: ${imagePath}`);
        img.dataset.loaded = 'true';
    };

    img.onerror = () => {
        console.error(`Failed to load image: ${imagePath}`);
        img.src = this.config.defaultImage; // 기본 이미지로 대체
    };

    return img;
}

        getRandomMessage() {
            const messages = Object.keys(this.config.messages);
            if (this.usedMessages.length === messages.length) {
                this.usedMessages = [];
            }

            let availableMessages = messages.filter(msg => !this.usedMessages.includes(msg));
            const randomMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)];
            this.usedMessages.push(randomMessage);
            return randomMessage;
        }

        async showImage(message) {
            const newImage = this.imageElements[message];
            if (!newImage) return;

            // 이전 이미지 페이드 아웃
            if (this.currentlyVisibleImage) {
                await this.fadeOutImage(this.currentlyVisibleImage);
            }

            // 새 이미지 페이드 인
            await this.fadeInImage(newImage);
            this.currentlyVisibleImage = newImage;
        }

        async fadeOutImage(image) {
            image.style.opacity = '0';
            image.classList.remove('bounce-active');
            await new Promise(resolve => setTimeout(resolve, this.config.animationDuration));
            image.style.visibility = 'hidden';
        }

        async fadeInImage(image) {
            image.style.visibility = 'visible';
            await new Promise(resolve => setTimeout(resolve, 50));
            image.style.opacity = '1';
            image.classList.add('bounce-active');
        }

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

        async runMessageCycle(message) {
            if (!textEl || !gaugeEl) return;
            
            this.cycleInProgress = true;
            const isRestrictedAccess = message === "y_pred = model.predict(X_test)";
            
            // 프로그레스 바 리셋
            gaugeEl.style.width = '0%';
            this.animateProgress(3000, 100);
            
            // 메시지와 이미지 표시
            textEl.textContent = message;
            await this.showImage(message);

            // 메시지 진행
            let dots = '';
            for (let i = 0; i < 3; i++) {
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
            
            if (this.currentlyVisibleImage) {
                await this.fadeOutImage(this.currentlyVisibleImage);
            }
            
            this.cycleInProgress = false;
        }

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

    // 기존의 시간 업데이트 및 글리치 효과 함수들...
    function updateDateTime() {
        const now = new Date();
        const departureDate = new Date('2025-02-28T00:00:00');
        const diff = departureDate - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

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

        if (countdownDisplay) {
            countdownDisplay.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }

    function triggerRandomGlitch() {
        if (glitchTarget && Math.random() < 0.2) {
            glitchTarget.classList.add('glitch-active');
            if (Math.random() < 0.3) {
                glitchTarget.classList.add('text-morph');
            }
            setTimeout(() => {
                glitchTarget.classList.remove('glitch-active', 'text-morph');
            }, 500);
        }
    }

    // 페이지 전환 효과 및 키보드 입력 처리
    let userInput = "";
    
    document.addEventListener("keydown", (event) => {
        userInput += event.key.toLowerCase();
        
        if (userInput.endsWith("lam")) {
            window.location.href = "youth/youth.html";
        }
        
        if (userInput.length > 10) {
            userInput = userInput.slice(-10);
        }
    });

    // 인터벌 설정
    setInterval(updateDateTime, 1000);
    setInterval(triggerRandomGlitch, 5000);
});
