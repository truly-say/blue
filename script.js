// script.js
document.addEventListener('DOMContentLoaded', () => {
    // 기본 요소 선택
    const textEl = document.querySelector('.status-text');
    const gaugeEl = document.querySelector('.status-progress');
    const timeDisplay = document.querySelector('#current-datetime');
    const countdownDisplay = document.querySelector('#countdown');
    const glitchTarget = document.querySelector('.intermittent-glitch');
    const container = document.querySelector('.container');

    // 기본 이미지 설정
    const DEFAULT_IMAGE = 'hongryeon.png';

    // 통합된 상태 메시지 설정
    const statusMessages = [
        {
            text: "y_pred = model.predict(X_test)",
            image: "홍련.png",
            isRestricted: true  // 접근 제한 메시지 여부
        },
        {
            text: "현진우가 침대에서 뒤척거리고 있습니다",
            image: "홍련.png",
            isRestricted: false
        },
        {
            text: "현진우가 슬기로운 감빵 생활 중입니다",
            image: "선청.png",
            isRestricted: false
        }
        // 추가 메시지는 같은 형식으로 여기에 추가
    ];

    // 상태 변수
    const imageElements = new Map();
    let usedMessages = [];
    let currentlyVisibleImage = null;
    let cycleInProgress = false;
    let progressAnimation = null;

    // 이미지 프리로딩 함수
    function preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    // 이미지 초기화 함수
    async function initializeImages() {
        if (!container) {
            console.error('Container element not found');
            return;
        }

        const systemStatus = document.querySelector('.system-status') || container;

        // 모든 상태 메시지에 대한 이미지 초기화
        for (const message of statusMessages) {
            try {
                const img = document.createElement('img');
                img.src = message.image;
                img.alt = "Status Image";
                img.className = 'status-image-overlay';
                img.style.opacity = '0';
                img.style.visibility = 'hidden';

                systemStatus.appendChild(img);
                imageElements.set(message.text, img);
                
                await preloadImage(message.image);
                console.log(`Image loaded successfully: ${message.image}`);
            } catch (error) {
                console.error(`Failed to initialize image for message: ${message.text}`);
                // 실패 시 기본 이미지로 대체
                const defaultImg = document.createElement('img');
                defaultImg.src = DEFAULT_IMAGE;
                defaultImg.alt = "Default Status Image";
                defaultImg.className = 'status-image-overlay';
                defaultImg.style.opacity = '0';
                defaultImg.style.visibility = 'hidden';
                
                systemStatus.appendChild(defaultImg);
                imageElements.set(message.text, defaultImg);
            }
        }
    }

    // 이미지 표시 함수
    async function showImage(messageText) {
        console.log(`Showing image for: ${messageText}`);

        if (currentlyVisibleImage) {
            currentlyVisibleImage.style.opacity = '0';
            currentlyVisibleImage.classList.remove('bounce-active');
            await new Promise(resolve => setTimeout(resolve, 300));
            currentlyVisibleImage.style.visibility = 'hidden';
        }

        const newImage = imageElements.get(messageText);
        if (newImage) {
            newImage.style.visibility = 'visible';
            void newImage.offsetWidth;
            await new Promise(resolve => setTimeout(resolve, 50));
            newImage.style.opacity = '1';
            newImage.classList.add('bounce-active');
            currentlyVisibleImage = newImage;
        }
    }

    // 랜덤 메시지 선택 함수
    function getRandomUniqueMessage() {
        if (usedMessages.length === statusMessages.length) {
            usedMessages = [];
        }

        let randomMessage;
        do {
            randomMessage = statusMessages[Math.floor(Math.random() * statusMessages.length)];
        } while (usedMessages.includes(randomMessage));

        usedMessages.push(randomMessage);
        return randomMessage;
    }

    // 메시지 사이클 실행 함수
    async function runMessageCycle(messageObj) {
        if (!textEl || !gaugeEl) return;
        
        cycleInProgress = true;
        
        // Reset progress bar and animation
        gaugeEl.style.width = '0%';
        cancelAnimationFrame(progressAnimation);
        
        // Show message and image
        textEl.textContent = messageObj.text;
        showImage(messageObj.text);

        // Start new progress animation
        animateProgress(3000, 100);
        
        // 메시지 진행
        let dots = '';
        for (let i = 0; i < 3; i++) {
            if (messageObj.isRestricted && i === 1) {
                cancelAnimationFrame(progressAnimation);
                textEl.textContent = "[접근 권한 없음]";
                textEl.classList.add('restricted-access');
                await new Promise(resolve => setTimeout(resolve, 2000));
                break;
            }
            
            dots += '.';
            textEl.textContent = `${messageObj.text}${dots}`;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
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
                const messageObj = getRandomUniqueMessage();
                await runMessageCycle(messageObj);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    // 나머지 함수들은 그대로 유지...
    
    // 초기화 및 인터벌 설정
    initializeImages();
    startMessageLoop();
    setInterval(updateDateTime, 1000);
    setInterval(triggerRandomGlitch, 5000);
});
