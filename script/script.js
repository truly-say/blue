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
            const container = document.querySelector('.container');
            if (!container) {
                console.error('Container element not found');
                return;
            }

            const systemStatus = document.querySelector('.system-status') || container;
            Object.entries(this.config.messages).forEach(([message, imagePath]) => {
                const img = this.createImageElement(imagePath);
                systemStatus.appendChild(img);
                this.imageElements[message] = img;
            });
        }

        createImageElement(imagePath) {
            const img = document.createElement('img');
            img.src = imagePath || this.config.defaultImage;
            img.alt = "Status Image";
            img.className = 'status-image-overlay';
            img.style.opacity = '0';
            img.style.visibility = 'hidden';

            // 이미지 로드 이벤트 처리
            img.onload = () => {
                console.log(`Image loaded: ${imagePath}`);
                img.dataset.loaded = 'true';
            };

            // 로드 실패 시 디폴트 이미지 설정
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

    // 선청완 홈페이지로 이동
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