document.addEventListener('DOMContentLoaded', () => {
    const textEl = document.querySelector('.status-text');
    const gaugeEl = document.querySelector('.status-progress');
    const timeDisplay = document.querySelector('#current-datetime');
    const countdownDisplay = document.querySelector('#countdown');
    const glitchTarget = document.querySelector('.intermittent-glitch');
    
    // 메시지와 이미지 매핑
    const messageConfig = {
        "현진우가 슬기로운 감빵 생활 중입니다": "선청고등학교.png",
        // 여기에 다른 메시지와 이미지 매핑 추가
    };

    const characters = [
        "y_pred = model.predict(X_test)",
        "현진우가 침대에서 뒤척거리고 있습니다"
    ];

    // CSS 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .status-image-overlay {
            position: absolute;
            top: -150px; /* 프로그래스 바 위쪽에 위치하도록 조정 */
            left: 50%;
            transform: translateX(-50%);
            max-width: 200px;
            transition: opacity 0.5s ease;
            z-index: 10;
        }
        
        .bounce-active {
            animation: bounce 0.5s ease;
        }
        
        @keyframes bounce {
            0% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-20px); }
            100% { transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // 이미지 요소들을 보관할 객체
    const imageElements = {};
    
    function initializeImages() {
        const container = document.querySelector('.container');
        
        Object.entries(messageConfig).forEach(([message, imagePath]) => {
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = "Status Image";
            img.className = 'status-image-overlay';
            img.style.opacity = '0';
            img.style.visibility = 'hidden';
            container.appendChild(img);
            imageElements[message] = img;
        });
    }

    let usedMessages = [];
    let currentlyVisibleImage = null;
    let cycleInProgress = false;
    let currentProgressInterval = null;
    
    function getRandomUniqueMessage() {
        if (usedMessages.length === characters.length) {
            usedMessages = [];
        }

        let randomMessage;
        do {
            randomMessage = characters[Math.floor(Math.random() * characters.length)];
        } while (usedMessages.includes(randomMessage));

        usedMessages.push(randomMessage);
        return randomMessage;
    }

    function showImage(message) {
        if (currentlyVisibleImage && currentlyVisibleImage !== imageElements[message]) {
            currentlyVisibleImage.style.opacity = '0';
            currentlyVisibleImage.classList.remove('bounce-active');
            setTimeout(() => {
                currentlyVisibleImage.style.visibility = 'hidden';
            }, 500);
        }

        const newImage = imageElements[message];
        if (newImage) {
            newImage.style.visibility = 'visible';
            setTimeout(() => {
                newImage.style.opacity = '1';
                newImage.classList.add('bounce-active');
            }, 50);
            currentlyVisibleImage = newImage;
        }
    }

    function updateProgress(startValue, endValue, duration) {
        const startTime = Date.now();
        
        if (currentProgressInterval) {
            clearInterval(currentProgressInterval);
        }
        
        currentProgressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentWidth = startValue + (endValue - startValue) * progress;
            
            gaugeEl.style.width = `${currentWidth}%`;
            
            if (progress >= 1) {
                clearInterval(currentProgressInterval);
                currentProgressInterval = null;
            }
        }, 16);
    }

    async function runMessageCycle(message) {
        cycleInProgress = true;
        const isRestrictedAccess = message === "y_pred = model.predict(X_test)";
        
        // 프로그래스 바 리셋
        gaugeEl.style.transition = 'none';
        gaugeEl.style.width = '0%';
        
        // 기본 메시지 표시
        textEl.textContent = message;
        if (messageConfig[message]) {
            showImage(message);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (isRestrictedAccess) {
            // 특수 메시지의 경우 프로그래스 40%까지만 진행
            updateProgress(0, 40, 2000);
            textEl.textContent = "[접근 권한 없음]";
            textEl.classList.add('restricted-access');
            await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
            // 일반 메시지는 정상적으로 진행
            let dots = '';
            for (let i = 0; i < 3; i++) {
                updateProgress(i * 33, (i + 1) * 33, 1000);
                dots += '.';
                textEl.textContent = `${message}${dots}`;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        cycleInProgress = false;
    }

    async function startMessageLoop() {
        while (true) {
            if (!cycleInProgress) {
                const message = getRandomUniqueMessage();
                await runMessageCycle(message);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    // 초기화 및 시작
    initializeImages();
    startMessageLoop();
    
    // 나머지 기존 코드 (시간 업데이트, 글리치 효과 등) 유지
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
        if (Math.random() < 0.2) {
            glitchTarget.classList.add('glitch-active');
            if (Math.random() < 0.3) {
                glitchTarget.classList.add('text-morph');
            }
            setTimeout(() => {
                glitchTarget.classList.remove('glitch-active', 'text-morph');
            }, 500);
        }
    }

    setInterval(updateDateTime, 1000);
    setInterval(triggerRandomGlitch, 5000);
    
    // 페이지 네비게이션
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach((card) => {
        card.addEventListener('click', (e) => {
            const page = card.getAttribute('data-page');
            if (page) {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = `${page}.html`;
                }, 500);
            }
        });
    });

    // 페이지 복원
    window.addEventListener('pageshow', (event) => {
        document.body.style.opacity = '1';
    });
});
