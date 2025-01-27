
document.addEventListener('DOMContentLoaded', () => {
    const textEl = document.querySelector('.status-text');
    const gaugeEl = document.querySelector('.status-progress');
    const timeDisplay = document.querySelector('#current-datetime');
    const countdownDisplay = document.querySelector('#countdown');
    const glitchTarget = document.querySelector('.intermittent-glitch');
    
    // 메시지와 이미지 매핑을 객체로 관리
    const messageConfig = {
        "현진우가 슬기로운 감빵 생활 중입니다": "선청고등학교.png",
        "이지훈이 상황 파악을 하고 있습니다": "선청고등학교.png",
        "y_pred = model.predict(X_test)": "선청고등학교.png",
        // "메시지": "이미지경로.png" 형식으로 추가
    };

    const characters = Object.keys(messageConfig);
    
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
        if (currentlyVisibleImage) {
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

    function animateMessage() {
        let stage = 0;
        let currentMessage = '';
        let isRestrictedAccess = false;
        
        function updateMessage() {
            if (stage === 0) {
                currentMessage = getRandomUniqueMessage();
                isRestrictedAccess = currentMessage === "y_pred = model.predict(X_test)";
                
                textEl.classList.remove('restricted-access');
                textEl.style.color = '';

                if (messageConfig[currentMessage]) {
                    showImage(currentMessage);
                }
            }
            
            if (isRestrictedAccess && stage === 2) {
                textEl.textContent = "[접근 권한 없음]";
                textEl.classList.add('restricted-access');
                stage = 4;
                return;
            }
            
            switch(stage) {
                case 0:
                    textEl.textContent = currentMessage;
                    gaugeEl.style.transition = 'none';
                    gaugeEl.style.width = '0%';
                    setTimeout(() => {
                        gaugeEl.style.transition = 'width 1s linear';
                        gaugeEl.style.width = '25%';
                    }, 50);
                    break;
                case 1:
                    textEl.textContent = `${currentMessage}.`;
                    gaugeEl.style.width = '50%';
                    break;
                case 2:
                    textEl.textContent = `${currentMessage}..`;
                    gaugeEl.style.width = '75%';
                    break;
                case 3:
                    textEl.textContent = `${currentMessage}...`;
                    gaugeEl.style.width = '100%';
                    break;
                case 4:
                    break;
                case 5:
                    stage = -1;
                    break;
            }
            stage++;
        }

        setInterval(updateMessage, 1000);
        updateMessage();
    }

    // 초기화 및 시작
    initializeImages();
    animateMessage();

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
