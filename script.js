document.addEventListener('DOMContentLoaded', () => {
    const textEl = document.querySelector('.status-text');
    const gaugeEl = document.querySelector('.status-progress');
    const timeDisplay = document.querySelector('#current-datetime');
    const countdownDisplay = document.querySelector('#countdown');
    const glitchTarget = document.querySelector('.intermittent-glitch');
   
    const characters = [
        "고라니가 홈페이지를 준비하고 있습니다",
        "고라니가 절망을 하고 있습니다",
        "고라니가 정신머리를 챙기고 있습니다",
        "개능이 고라니를 보고 있습니다",
        "개능이 감자를 키우고 있습니다",
        "개능이 테트리스를 하고 있습니다",
        "[11기 졸업생]이 잠에서 깼습니다",
        "[11기 졸업생]이 토끼 인형을 챙기고 있습니다",
        "[11기 졸업생]이 업무 준비를 하고 있습니다",
        "[11기 졸업생]이 경영 지식을 배우고 있습니다",
        "[신원 미상]이 소파에 늘어져 있습니다",
        "[신원 미상]이 전화를 받고 있습니다",
        "최예슬이 자리에 앉아 휴대폰을 보고 있습니다",
        "최예슬이 정보를 수집하고 있습니다",
        "은유벽이 문자를 무시하고 있습니다",
        "[선지현의 생명 신호 감지되지 않음]",
        "[청검수의 생명 신호 감지되지 않음]",
        "[신혜련의 생명 신호 감지되지 않음]",
        "성주안이 노트에 무언가를 적고 있습니다"
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
    
  function updateMessage() {
    const currentMessage = stage === 0 ? getRandomUniqueMessage() : currentMessage;
    
    switch(stage) {
        case 0: // 1초: 프로그레스 바 0% 초기화와 메시지 업데이트 동시에 진행
            textEl.textContent = currentMessage; // 메시지 초기화
            gaugeEl.style.transition = 'none'; // 트랜지션 제거 (초기화)
            gaugeEl.style.width = '0%'; // 프로그레스 초기화
            // 트랜지션 복구 (짧은 딜레이)
            setTimeout(() => {
                gaugeEl.style.transition = 'width 1s linear';
                gaugeEl.style.width = '25%';
            }, 50); // 50ms 딜레이 후 트랜지션 복구
                break;
            case 1: // 2초: 25% 프로그레스 진행
               textEl.textContent = `${currentMessage}.`;
                gaugeEl.style.width = '50%';
                break;

            case 2: // 3초: 메시지에 "." 추가
                textEl.textContent = `${currentMessage}..`;
                gaugeEl.style.width = '75%';
                break;

            case 3: // 4초: 메시지에 ".." 추가
                textEl.textContent = `${currentMessage}...`;
                gaugeEl.style.width = '100%';
                break;

            case 4: // 5초: 메시지에 "..." 추가
                break;

            case 5: // 6초: 메시지와 프로그레스 바 초기화
                currentMessageIndex = (currentMessageIndex + 1) % characters.length; // 다음 메시지로 이동
                stage = -1; // 스테이지 리셋
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

    // Page transition effect
    const infoCards = document.querySelectorAll('.info-card');
    if (infoCards) {
        infoCards.forEach((card) => {
            card.addEventListener('click', (e) => {
                const page = card.getAttribute('data-page');
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = `${page}.html`;
                }, 500);
            });
        });
    }

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
