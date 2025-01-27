// script.js
document.addEventListener('DOMContentLoaded', () => {
    // 기본 요소 선택
    const textEl = document.querySelector('.status-text');
    const gaugeEl = document.querySelector('.status-progress');
    const timeDisplay = document.querySelector('#current-datetime');
    const countdownDisplay = document.querySelector('#countdown');
    const glitchTarget = document.querySelector('.intermittent-glitch');
    const container = document.querySelector('.container'); // 컨테이너 선택자 추가
    
    // 메시지와 이미지 설정
    const messageConfig = {
        "현진우가 슬기로운 감빵 생활 중입니다": "선청고등학교.png",
    };

    // 표시할 메시지 목록
    const characters = [
        "y_pred = model.predict(X_test)",
        "현진우가 침대에서 뒤척거리고 있습니다",
        "현진우가 슬기로운 감빵 생활 중입니다"
    ];

    // 상태 변수
    const imageElements = {};
    let usedMessages = [];
    let currentlyVisibleImage = null;
    let cycleInProgress = false;
    let progressAnimation = null;
    
    // 이미지 초기화 함수
    function initializeImages() {
        if (!container) {
            console.error('Container element not found');
            return;
        }
        
        Object.entries(messageConfig).forEach(([message, imagePath]) => {
            console.log(`Creating image for: ${message}`);
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = "Status Image";
            img.className = 'status-image-overlay';
            img.style.opacity = '0';
            img.style.visibility = 'hidden';
            
            img.onload = () => console.log(`Image loaded: ${imagePath}`);
            img.onerror = () => console.error(`Image load failed: ${imagePath}`);
            
            container.appendChild(img);
            imageElements[message] = img;
        });
    }

    // 랜덤 메시지 선택 함수
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

    // 이미지 표시 함수
    function showImage(message) {
    console.log(`Showing image for: ${message}`);
    
    if (currentlyVisibleImage) {
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

    // 프로그레스 바 애니메이션 함수
    function animateProgress(duration, targetProgress) {
        const startTime = Date.now();
        const startProgress = parseFloat(gaugeEl.style.width) || 0;
        
        if (progressAnimation) {
            cancelAnimationFrame(progressAnimation);
        }

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentProgress = startProgress + (targetProgress - startProgress) * progress;
            
            gaugeEl.style.width = `${currentProgress}%`;
            
            if (progress < 1) {
                progressAnimation = requestAnimationFrame(update);
            }
        }
        
        progressAnimation = requestAnimationFrame(update);
    }
async function runMessageCycle(message) {
    if (!textEl || !gaugeEl) return;
    
    cycleInProgress = true;
    const isRestrictedAccess = message === "y_pred = model.predict(X_test)";
    
    // 프로그레스 바 리셋
    gaugeEl.style.width = '0%';
    
    // 메시지 표시
    textEl.textContent = message;
    if (messageConfig[message]) {
        showImage(message);
    }

    // 프로그레스 바 애니메이션
    animateProgress(3000, 100);
    
    // 메시지 진행
    let dots = '';
    for (let i = 0; i < 3; i++) {
        if (isRestrictedAccess && i === 1) {
            cancelAnimationFrame(progressAnimation);
            textEl.textContent = "[접근 권한 없음]";
            textEl.classList.add('restricted-access');
            await new Promise(resolve => setTimeout(resolve, 2000));
            break;
        }
        
        dots += '.';
        textEl.textContent = `${message}${dots}`;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 프로그레스 바가 끝날 때까지 대기
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 이미지 숨기기
    if (currentlyVisibleImage) {
        currentlyVisibleImage.style.opacity = '0';
        currentlyVisibleImage.classList.remove('bounce-active');
        setTimeout(() => {
            currentlyVisibleImage.style.visibility = 'hidden';
        }, 500);
    }
    
    cycleInProgress = false;
}

    // 메시지 루프 시작 함수
    async function startMessageLoop() {
        while (true) {
            if (!cycleInProgress) {
                const message = getRandomUniqueMessage();
                await runMessageCycle(message);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    // 시간 업데이트 함수
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

    // 글리치 효과 함수
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

    // 페이지 전환 효과
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

    // 페이지 로드 시 투명도 리셋
    window.addEventListener('pageshow', (event) => {
        document.body.style.opacity = '1';
    });

    // 초기화 및 인터벌 설정
    initializeImages();
    startMessageLoop();
    setInterval(updateDateTime, 1000);
    setInterval(triggerRandomGlitch, 5000);
});
