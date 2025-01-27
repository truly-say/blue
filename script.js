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
        "현진우가 침대에서 뒤척거리고 있습니다"
    ];

    // 상태 변수
    const imageElements = {};
    let usedMessages = [];
    let currentlyVisibleImage = null;
    let cycleInProgress = false;
    let progressAnimation = null;
    
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
        
        // 디버깅을 위한 로그 추가
        img.onload = () => {
            console.log(`Image loaded successfully: ${imagePath}`);
            console.log('Image dimensions:', img.width, 'x', img.height);
            console.log('Image position:', img.offsetTop, img.offsetLeft);
        };
        img.onerror = () => console.error(`Failed to load image: ${imagePath}`);
        
        // system-status 요소에 이미지 추가
        const systemStatus = document.querySelector('.system-status');
        if (systemStatus) {
            systemStatus.appendChild(img);
        } else {
            console.error('system-status element not found');
            container.appendChild(img);
        }
        
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
    async function showImage(message) {
    console.log(`Showing image for: ${message}`);
    
    // 이전 이미지 처리
    if (currentlyVisibleImage) {
        currentlyVisibleImage.style.opacity = '0';
        currentlyVisibleImage.classList.remove('bounce-active');
        await new Promise(resolve => setTimeout(resolve, 300));
        currentlyVisibleImage.style.visibility = 'hidden';
    }

    const newImage = imageElements[message];
    if (newImage) {
        // 디버깅용 로그
        console.log('New image found:', newImage);
        console.log('Initial visibility:', newImage.style.visibility);
        console.log('Initial opacity:', newImage.style.opacity);
        
        // 먼저 visibility를 visible로 설정
        newImage.style.visibility = 'visible';
        
        // 강제 리플로우
        void newImage.offsetWidth;
        
        // 약간의 지연 후 opacity 변경
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // opacity를 1로 설정하고 바운스 애니메이션 추가
        newImage.style.opacity = '1';
        newImage.classList.add('bounce-active');
        
        // 상태 확인용 로그
        console.log('After changes:');
        console.log('Visibility:', newImage.style.visibility);
        console.log('Opacity:', newImage.style.opacity);
        console.log('Has bounce class:', newImage.classList.contains('bounce-active'));
        
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
    
    // Reset progress bar and animation
    gaugeEl.style.width = '0%';
    cancelAnimationFrame(progressAnimation);
    
    // Show message and image
    textEl.textContent = message;
    if (messageConfig[message]) {
        showImage(message);
    }

    // Start new progress animation
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
    
    // Wait for progress bar completion
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Clean up
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

    let userInput = ""; // 사용자가 입력한 키를 저장하는 변수

document.addEventListener("keydown", (event) => {
  userInput += event.key.toLowerCase(); // 입력된 키를 소문자로 추가

  // "lam" 입력 확인
  if (userInput.endsWith("lam")) {
    // youth.html로 이동
    window.location.href = "youth.html";
  }

  // 입력 값이 너무 길어지지 않도록 최대 10자만 저장
  if (userInput.length > 10) {
    userInput = userInput.slice(-10);
  }
});

    // 초기화 및 인터벌 설정
    initializeImages();
    startMessageLoop();
    setInterval(updateDateTime, 1000);
    setInterval(triggerRandomGlitch, 5000);
});
