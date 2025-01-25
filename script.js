document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('current-time');
    const countdownDisplay = document.getElementById('countdown-display');
    const textEl = document.querySelector('.status-text');

    const characters = [
        "고라니가 코딩을 준비하고 있습니다",
        "고라니가 절망을 하고 있습니다",
        "고라니가 정신머리를 챙기고 있습니다",
        "개능이 고라니를 보고 있습니다",
        "개능이 감자를 키우고 있습니다",
        "개능이 테트리스를 하고 있습니다"    
    ];

    // 랜덤 메시지 추출 (이전에 동일한 메시지를 출력하지 않도록 개선)
    let lastMessageIndex = -1;

    function getRandomMessage() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * characters.length);
        } while (newIndex === lastMessageIndex);
        lastMessageIndex = newIndex;
        return characters[newIndex];
    }

    function animateMessage(message) {
        let dotCount = 0;
        const messageEl = textEl;
        
        function updateMessage() {
            messageEl.textContent = `${message}${'.'.repeat(dotCount)}`;
            
            dotCount = (dotCount + 1) % 4;
        }

        // Clear any existing intervals
        if (messageEl.intervalId) {
            clearInterval(messageEl.intervalId);
        }

        // Start new interval
        messageEl.intervalId = setInterval(updateMessage, 1000);
        
        // Stop animation after 6 seconds
        setTimeout(() => {
            clearInterval(messageEl.intervalId);
            messageEl.textContent = message;
        }, 6000);
    }

    function updateStatus() {
        const randomMessage = getRandomMessage();
        animateMessage(randomMessage);

        const gaugeEl = document.querySelector('.status-progress');
        if (!gaugeEl) return;

        gaugeEl.style.transition = 'none';
        gaugeEl.style.width = '0%';
        
        void gaugeEl.offsetWidth;
        
        gaugeEl.style.transition = 'width 5s linear';
        gaugeEl.style.width = '100%';
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
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', hour12: false
            }).format(now);
        }
        
        if (countdownDisplay) {
            countdownDisplay.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }

    // Initial calls and intervals
    updateDateTime();
    updateStatus();
    setInterval(updateDateTime, 1000);
    setInterval(updateStatus, 6000);

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

    // Page restoration
    window.addEventListener('pageshow', (event) => {
        document.body.style.opacity = '1';
    });
});
