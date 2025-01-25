document.addEventListener('DOMContentLoaded', () => {
    const textEl = document.querySelector('.status-text');
    const gaugeEl = document.querySelector('.status-progress');
    const countdownDisplay = document.getElementById('countdown-display');
    const currentTimeDisplay = document.getElementById('current-time');

    const characters = [
        "고라니가 코딩을 준비하고 있습니다",
        "고라니가 절망을 하고 있습니다",
        "고라니가 정신머리를 챙기고 있습니다",
        "개능이 고라니를 보고 있습니다",
        "개능이 감자를 키우고 있습니다",
        "개능이 테트리스를 하고 있습니다"    
    ];

    function animateMessage() {
        let currentMessageIndex = 0;
        let stage = 0;
        function updateMessage() {
            const currentMessage = characters[currentMessageIndex];
            switch(stage) {
                case 0: // 1초: 초기 상태, 0%
                    textEl.textContent = currentMessage;
                    gaugeEl.style.transition = 'width 1s linear';
                    gaugeEl.style.width = '0%';
                    break;
                case 1: // 2초: 25%, .
                    textEl.textContent = `${currentMessage}.`;
                    gaugeEl.style.width = '25%';
                    break;
                case 2: // 3초: 50%, ..
                    textEl.textContent = `${currentMessage}..`;
                    gaugeEl.style.width = '50%';
                    break;
                case 3: // 4초: 75%, ...
                    textEl.textContent = `${currentMessage}...`;
                    gaugeEl.style.width = '75%';
                    break;
                case 4: // 5초: 100%, ... 유지
                    textEl.textContent = `${currentMessage}...`;
                    gaugeEl.style.width = '100%';
                    break;
                case 5: // 6초: 다음 메시지로 초기화
                    currentMessageIndex = (currentMessageIndex + 1) % characters.length;
                    textEl.textContent = characters[currentMessageIndex];
                    gaugeEl.style.transition = 'none';
                    gaugeEl.style.width = '0%';
                    stage = -1;
                    break;
            }
            stage++;
        }
        updateMessage();
        setInterval(updateMessage, 1000);
    }

    function updateDateTime() {
        const now = new Date();
        const departureDate = new Date('2025-02-28T00:00:00');
        const diff = departureDate - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Update current time
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).format(now);
        }

        // Update countdown
        if (countdownDisplay) {
            countdownDisplay.textContent = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
    }

    // Page transition effect
    const infoCards = document.querySelectorAll('.info-card');
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

    // Initial calls
    animateMessage();
    updateDateTime();

    // Intervals
    setInterval(updateDateTime, 1000);

    // Page restoration
    window.addEventListener('pageshow', (event) => {
        document.body.style.opacity = '1';
    });
});
