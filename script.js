
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
        "이지훈이 상황 파악을 하고 있습니다",
        "단하율이 취재를 준비하고 있습니다",
        "단하율이 14기에게 연락을 시도하고 있습니다",
        "단하율이 자료를 정리하고 있습니다",
        "y_pred = model.predict(X_test)",
        "현진우가 슬기로운 감빵 생활 중입니다",
        "현진우가 교도관 옆에서 밥을 먹고 있습니다",
        "현진우가 침대에서 뒤척거리고 있습니다"
    ];

    // 이미지 요소들을 보관할 객체
    const imageElements = {};
    
    // 이미지 요소들을 미리 생성하고 설정
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
        // 이전 이미지 숨기기
        if (currentlyVisibleImage && currentlyVisibleImage !== imageElements[message]) {
            currentlyVisibleImage.style.opacity = '0';
            currentlyVisibleImage.classList.remove('bounce-active');
            setTimeout(() => {
                currentlyVisibleImage.style.visibility = 'hidden';
            }, 500);
        }

        // 새 이미지 표시
        const newImage = imageElements[message];
        if (newImage) {
            newImage.style.visibility = 'visible';
            newImage.style.opacity = '1';
            newImage.classList.add('bounce-active');
            currentlyVisibleImage = newImage;
        }
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
        
        // 첫 번째 점
        if (!isRestrictedAccess) {
            gaugeEl.style.transition = 'width 1s linear';
            gaugeEl.style.width = '33%';
            textEl.textContent = `${message}.`;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // 두 번째 점
        if (!isRestrictedAccess) {
            gaugeEl.style.width = '66%';
            textEl.textContent = `${message}..`;
            await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
            textEl.textContent = "[접근 권한 없음]";
            textEl.classList.add('restricted-access');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // 세 번째 점
        if (!isRestrictedAccess) {
            gaugeEl.style.width = '100%';
            textEl.textContent = `${message}...`;
            await new Promise(resolve => setTimeout(resolve, 1000));
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

    function triggerRandomGlitch() {
        if (Math.random() < 0.2) {  // 20% chance every 5 seconds
            glitchTarget.classList.add('glitch-active');
            
            // Rare chance of text morphing
            if (Math.random() < 0.3) {
                glitchTarget.classList.add('text-morph');
            }
            
            setTimeout(() => {
                glitchTarget.classList.remove('glitch-active', 'text-morph');
            }, 500);
        }
    }
    
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

    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach((card) => {
        card.addEventListener('click', (e) => {
            const page = card.getAttribute('data-page');
            
            // Ensure page attribute exists
            if (page) {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '0';

                setTimeout(() => {
                    window.location.href = `${page}.html`;
                }, 500);
            }
        });
    });

    // Initial calls
    animateMessage();
    updateDateTime();

    // Intervals
    setInterval(updateDateTime, 1000);
    setInterval(triggerRandomGlitch, 5000);

    // Page restoration
    window.addEventListener('pageshow', (event) => {
        document.body.style.opacity = '1';
    });
});
