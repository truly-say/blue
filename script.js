document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('current-time');
    const countdownDisplay = document.getElementById('countdown-display');
    const textEl = document.querySelector('.status-text');
    const gaugeEl = document.querySelector('.status-progress');

     function animateMessage() {
        let currentMessageIndex = 0;
        let dotCount = 0;
        let stage = 0;
        
        function updateMessage() {
            const currentMessage = characters[currentMessageIndex];
            
            if (stage < 4) {
                textEl.textContent = `${currentMessage}${'.'.repeat(Math.min(dotCount, 3))}`;
                dotCount++;
                
                if (gaugeEl) {
                    gaugeEl.style.width = `${(stage + 1) * 25}%`;
                }
            } else if (stage === 4) {
                textEl.textContent = `${currentMessage}...`;
                if (gaugeEl) {
                    gaugeEl.style.width = '100%';
                }
            } else {
                currentMessageIndex = (currentMessageIndex + 1) % characters.length;
                dotCount = 0;
                
                if (gaugeEl) {
                    gaugeEl.style.width = '0%';
                }
            }
            
            stage++;
            if (stage > 4) stage = 0;
        }
        
        updateMessage();
        textEl.intervalId = setInterval(updateMessage, 1000);
    }

    animateMessage();
});

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

    window.requestAnimationFrame(animateMessage);
    
    // Page restoration
    window.addEventListener('pageshow', (event) => {
        document.body.style.opacity = '1';
    });
});
