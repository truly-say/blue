document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('current-time');
    const countdownDisplay = document.getElementById('countdown-display');
    const textEl = document.querySelector('.status-text');
    const gaugeEl = document.querySelector('.status-progress');

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
        let dotCount = 0;
        let stage = 0;
        
        function updateMessage() {
            const currentMessage = characters[currentMessageIndex];
            
            if (stage < 4) {
                // 0-3초: 메시지와 점 추가
                textEl.textContent = `${currentMessage}${'.'.repeat(dotCount)}`;
                dotCount++;
            } else if (stage === 4) {
                // 4초: 마지막 점 상태 유지
                textEl.textContent = `${currentMessage}...`;
            } else if (stage === 5) {
                // 5초: 다음 메시지로 변경
                currentMessageIndex = (currentMessageIndex + 1) % characters.length;
                textEl.textContent = characters[currentMessageIndex];
                
                // Reset gauge
                if (gaugeEl) {
                    gaugeEl.style.transition = 'none';
                    gaugeEl.style.width = '0%';
                    void gaugeEl.offsetWidth;
                    gaugeEl.style.transition = 'width 6s linear';
                    gaugeEl.style.width = '100%';
                }
                
                // Reset dot count
                dotCount = 0;
            } else {
                // 6-8초: 새 메시지에 점 추가
                textEl.textContent = `${characters[currentMessageIndex]}${'.'.repeat(dotCount)}`;
                dotCount++;
            }
            
            stage++;
            if (stage > 8) stage = 0;
        }
        
        // Clear any existing intervals
        if (textEl.intervalId) {
            clearInterval(textEl.intervalId);
        }
        
        // Start new interval
        textEl.intervalId = setInterval(updateMessage, 1000);
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

    // Initial calls
    updateDateTime();
    animateMessage();
    
    // Intervals
    setInterval(updateDateTime, 1000);
    
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
