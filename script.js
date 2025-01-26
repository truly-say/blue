document.addEventListener('DOMContentLoaded', () => {
    const textEl = document.querySelector('.status-text');
    const gaugeEl = document.querySelector('.status-progress');
    const timeDisplay = document.querySelector('#current-datetime');
    const countdownDisplay = document.querySelector('#countdown');
    const glitchTarget = document.querySelector('.intermittent-glitch');
   
    const characters = [
       "도이성이 동네 편의점에서 과자를 고르고 있습니다",
        "도이성이 집으로 돌아가고 있습니다",
        "도이성이 짜증을 내며 면허증을 찾고 있습니다",
        "은유벽이 방에 박혀있습니다",
        "은유벽이 문자를 씹고 있습니다",
        "은유벽이 알림을 끄고 있습니다",
        "최예슬이 자리에 앉아 휴대폰을 보고 있습니다",
        "최예슬이 정보를 수집하고 있습니다",
        "최예슬이 책상 위 물건들을 정리하고 있습니다",
        "[선지현의 생명 신호 감지되지 않음]",
        "[청검수의 생명 신호 감지되지 않음]",
        "[신혜련의 생명 신호 감지되지 않음]",
        "성주안이 노트에 무언가를 적고 있습니다",
        "성주안이 부탁 받은 일은 도와주고 있습니다",
        "성주안이 주변 사람들의 행동을 보고 있습니다",
        "이도윤이 문을 열고 집을 나설 준비를 합니다",
        "이도윤이 공원 벤치에 앉아 하늘을 보고 있습니다",
        "이도윤이 일어나서 기지개를 피고 있습니다",
        "구해늘이 방에서 시계 초침 소리를 듣고 있습니다",
        "구해늘이 병원에 방문하고 있습니다",
        "구해늘이 집중하는 듯 침묵을 지키고 있습니다",
        "유민이 다른 사람의 말을 경청하고 있습니다",
        "유민이 상대의 행동을 지적하고 있습니다",
        "유민이 가볍게 아침을 때우고 있습니다",
        "[11기 졸업생]이 잠에서 깼습니다",
        "[11기 졸업생]이 토끼 인형을 보고 있습니다",
        "[11기 졸업생]이 튜터링을 준비하고 있습니다",
        "[11기 졸업생]이 업무 준비를 하고 있습니다",
        "[11기 졸업생]이 경영 지식을 배우고 있습니다",
        "[11기 졸업생]이 회의를 주도하고 있습니다",
        "[신원 미상]이 소파에 늘어져 있습니다",
        "[신원 미상]이 전화를 받고 있습니다",
        "[신원 미상]이 업무 이메일을 읽고 있습니다",
        "연해령이 모델 설계 및 개발하고 있습니다",
        "연해령이 책상에 엎드려 자고 있습니다",
        "연해령이 산책 중 만난 강아지를 쓰다듬고 있습니다",
        "이지훈이 누군가의 생사를 확인하고 있습니다",
        "이지훈이 거울을 보고 있습니다",
        "이지훈이 상황 파악을 하고 있습니다",
        "단하율이 취재를 준비하고 있습니다",
        "단하율이 14기에게 연락을 시도하고 있습니다",
        "단하율이 자료를 정리하고 있습니다",
        "y_pred = model.predict(X_test)",
        "현진우가 슬기로운 감빵 생활 중입니다",
        "현진우가 교도관 옆에서 밥을 먹고 있습니다",
        "현진우가 침대에서 뒤척거리고 있습니다"
    ];

    function getRandomUniqueMessage() {
    // If all messages have been used, reset the used messages array
    if (usedMessages.length === characters.length) {
        usedMessages = [];
    }

    // Find a message that hasn't been used yet
    let randomMessage;
    do {
        randomMessage = characters[Math.floor(Math.random() * characters.length)];
    } while (usedMessages.includes(randomMessage));

    // Add the selected message to used messages
    usedMessages.push(randomMessage);

    return randomMessage;
}

  function animateMessage() {
    let currentMessageIndex = 0;
    let stage = 0;
    let usedMessages = [];
    let currentMessage = ''; // Declare currentMessage outside the function
    
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
    
    function updateMessage() {
        // Update currentMessage at the start of each cycle
        if (stage === 0) {
            currentMessage = getRandomUniqueMessage();
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
                currentMessageIndex = (currentMessageIndex + 1) % characters.length;
                stage = -1;
                break;
       }
       stage++;
   }
   
   function immediateNextMessage() {
       updateMessage();
       setInterval(updateMessage, 1000);
   }

   immediateNextMessage();
}
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

    infoCards.forEach((card) => {
    card.addEventListener('click', (e) => {
        const page = card.getAttribute('data-page');
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0';

        setTimeout(() => {
            window.location.href = `${page}.html`;
        }, 500); // fade-out 후 0.5초에 페이지 변경
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
