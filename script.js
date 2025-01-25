document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('current-time');
    const countdownDisplay = document.getElementById('countdown-display');
    const progressText = document.getElementById('progress-text');
    const gaugeEl = document.querySelector('.status-progress');
    const textEl = document.querySelector('.status-text');

    const characters = [
        "▶ 고라니가 코딩을 준비하고 있습니다...",
        "▶ 고라니가 절망을 하고 있습니다...",
        "▶ 고라니가 정신머리를 챙기고 있습니다...",
        "▶ 개능이 고라니를 보고 있습니다...",
        "▶ 개능이 감자를 키우고 있습니다...",
        "▶ 개능이 테트리스를 하고 있습니다..."    
    ];

    const maxProgress = 5;
    let currentProgress = 0;

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

    function updateProgress() {
        if (progressText && currentProgress < maxProgress) {
            currentProgress++;
            const filled = '■'.repeat(currentProgress);
            const empty = '□'.repeat(maxProgress - currentProgress);
            progressText.textContent = filled + empty;
        }
    }

    function resetProgress() {
        currentProgress = 0;
        progressText.textContent = '□□□□□'; // reset to initial empty state
    }

    // 6초동안 프로그레스가 차오르도록 반복
    function animateProgress() {
        resetProgress();
        const progressInterval = setInterval(() => {
            updateProgress();
            if (currentProgress === maxProgress) {
                clearInterval(progressInterval);
                setTimeout(animateProgress, 1000); // 1초 후에 다시 반복 시작
            }
        }, 1000); // 1초마다 갱신
    }

    animateProgress(); // 처음 애니메이션 시작

    function updateStatus() {
        if (!gaugeEl || !textEl) return;

        // 상태 메시지 갱신
        const randomMessage = getRandomMessage();
        textEl.textContent = randomMessage;

        // 5초 동안 프로그레스 애니메이션 반복
        gaugeEl.style.transition = 'none';
        gaugeEl.style.width = '0%';
        
        // Trigger reflow to restart animation
        void gaugeEl.offsetWidth;
        
        // Start animation
        gaugeEl.style.transition = 'width 5s linear';
        gaugeEl.style.width = '100%';
    }

    // 카운트다운과 시간 업데이트 함수
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

    // 타이머 1초마다 갱신
    setInterval(updateDateTime, 1000); // 1초마다 호출

    // 상태 업데이트
    updateStatus();
    setInterval(updateStatus, 6000); 

    // 페이지 전환 효과 (infoCard 클릭 시)
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

    // 페이지 복원 시 opacity 변경
    window.addEventListener('pageshow', (event) => {
        document.body.style.opacity = '1';
    });
});
