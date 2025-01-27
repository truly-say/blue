// script.js
document.addEventListener('DOMContentLoaded', () => {
    const textEl = document.querySelector('.status-text');
    const gaugeEl = document.querySelector('.status-progress');
    const timeDisplay = document.querySelector('#current-datetime');
    const countdownDisplay = document.querySelector('#countdown');
    const glitchTarget = document.querySelector('.intermittent-glitch');
    
    const messageConfig = {
        "현진우가 슬기로운 감빵 생활 중입니다": "선청고등학교.png",
        // 여기에 다른 메시지와 이미지 매핑 추가
    };

    const characters = [
        "y_pred = model.predict(X_test)",
        "현진우가 침대에서 뒤척거리고 있습니다"
    ];

    const imageElements = {};
    let usedMessages = [];
    let currentlyVisibleImage = null;
    let cycleInProgress = false;
    let progressAnimation = null;
    
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
        cycleInProgress = true;
        const isRestrictedAccess = message === "y_pred = model.predict(X_test)";
        
        // 프로그래스 바 리셋
        gaugeEl.style.width = '0%';
        
        // 기본 메시지 표시
        textEl.textContent = message;
        if (messageConfig[message]) {
            showImage(message);
        }

        // 프로그래스 바 애니메이션 시작
        animateProgress(3000, 100);
        
        // 일반적인 메시지 진행
        let dots = '';
        for (let i = 0; i < 4; i++) {
            if (isRestrictedAccess && i === 1) {
                // 특수 메시지일 경우 두 번째 단계에서 중단
                cancelAnimationFrame(progressAnimation);
                textEl.textContent = "[접근 권한 없음]";
                textEl.classList.add('restricted-access');
                await new Promise(resolve => setTimeout(resolve, 1000));
                break;
            }
            
            dots += '.';
            textEl.textContent = `${message}${dots}`;
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
    window.addEventListener('pageshow', (event) => {
        document.body.style.opacity = '1';
    });



    // 임시 코드
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
});
