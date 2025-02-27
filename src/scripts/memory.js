// src/scripts/memory.js
// 메모리 아카이브 페이지 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소
    const archiveContent = document.getElementById('archiveContent');
    const sections = document.querySelectorAll('.section');
    const menuItems = document.querySelectorAll('.menu-item');
    const finalMessage = document.getElementById('finalMessage');
    const secretText = document.querySelector('.secret-text');
    
    // 상태 변수
    let currentSection = 0;
    let isScrolling = false;
    let scrollTimeout = null; // 스크롤 타임아웃 변수 추가
    let allTerminalsTyped = false; // 모든 터미널 텍스트가 출력되었는지 추적
    let typedTerminals = [false, false, false, false, false, false]; // 각 섹션별 출력 완료 상태
    
    // 눈 내리는 효과
    function createSnow() {
        const container = document.querySelector('.archive-container');
        if (!container) return;
        
        const snow = document.createElement('div');
        snow.className = 'snow-particle';
        
        const size = Math.random() * 3 + 1;
        const startPositionX = Math.random() * window.innerWidth;
        
        snow.style.width = `${size}px`;
        snow.style.height = `${size}px`;
        snow.style.left = `${startPositionX}px`;
        snow.style.top = '-10px';
        
        container.appendChild(snow);
        
        let positionY = -10;
        let positionX = startPositionX;
        const speed = Math.random() * 1 + 0.5;
        const wind = Math.random() * 2 - 1;
        
        function fall() {
            positionY += speed;
            positionX += wind;
            snow.style.transform = `translate(${positionX - startPositionX}px, ${positionY}px)`;
            
            if (positionY < window.innerHeight) {
                requestAnimationFrame(fall);
            } else {
                snow.remove();
            }
        }
        
        fall();
    }
    
    // 터미널 텍스트 타이핑 효과
    function typeText(elementId, delay = 30) {
        return new Promise(resolve => {
            const element = document.getElementById(elementId);
            if (!element) {
                resolve();
                return;
            }
            
            const text = element.textContent;
            element.textContent = '';
            element.style.opacity = '1';
            
            let i = 0;
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, delay);
                } else {
                    resolve(); // 타이핑 완료 시 Promise 해결
                }
            }
            type();
        });
    }
    
    // 섹션 업데이트 함수
    function updateSection(index) {
        if (isScrolling) return;
        isScrolling = true;
        
        // 현재 섹션 비활성화
        sections[currentSection].classList.remove('active');
        menuItems[currentSection].classList.remove('active');
        
        // 새 섹션 활성화
        currentSection = index;
        sections[currentSection].classList.add('active');
        menuItems[currentSection].classList.add('active');
        
        // 현재 섹션의 터미널 텍스트 타이핑 시작 (아직 타이핑되지 않은 경우만)
        if (!typedTerminals[currentSection]) {
            typeText(`terminalText${currentSection}`).then(() => {
                typedTerminals[currentSection] = true;
                
                // 모든 터미널이 타이핑되었는지 확인
                checkAllTerminalsTyped();
                
                // 마지막 섹션이면서 모든 터미널이 타이핑되었다면 최종 메시지 표시
                if (currentSection === 5 && allTerminalsTyped) {
                    showFinalElements();
                }
            });
        }
        
        // 스크롤 상태 1초 후 해제
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
    
    // 모든 터미널이 타이핑되었는지 확인하는 함수
    function checkAllTerminalsTyped() {
        allTerminalsTyped = typedTerminals.every(typed => typed);
        
        // 마지막 섹션이 활성화되어 있고 모든 터미널이 타이핑되었다면 최종 메시지 표시
        if (currentSection === 5 && allTerminalsTyped) {
            showFinalElements();
        }
    }
    
    // 최종 메시지와 비밀 텍스트 표시
    function showFinalElements() {
        // 약간의 딜레이 후 최종 메시지 표시
        setTimeout(() => {
            finalMessage.classList.add('visible');
            
            // 비밀 텍스트도 표시
            setTimeout(() => {
                secretText.classList.add('visible');
            }, 1500);
        }, 3000);
    }
    
    // 시간 업데이트 함수
    function updateDateTime() {
        const now = new Date();
        const timeDisplay = document.getElementById('current-datetime');
        if (timeDisplay) {
            timeDisplay.textContent = now.toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        }
    }
    
    // 비밀 메시지 표시 함수
    function revealSecret() {
        const binaryCode = "01001100 01000001 01001101"; // LAM in binary
        const text = document.querySelector('.secret-text');
        
        if (text.textContent === binaryCode) {
            text.textContent = "See you in the next winter, LAM.";
            setTimeout(() => {
                text.textContent = binaryCode;
            }, 3000);
        }
    }
    
    // 개선된 마우스 휠 이벤트 처리
    function handleWheelEvent(e) {
        // 스크롤 중이거나 페이지 로딩 중이면 무시
        if (isScrolling) return;
        
        // 이전 타임아웃 클리어
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // 디바운스 처리 - 짧은 시간 내 여러 번의 스크롤 이벤트 무시
        scrollTimeout = setTimeout(() => {
            // 스크롤 방향에 따라 섹션 전환
            if (e.deltaY > 50 && currentSection < sections.length - 1) {
                // 아래로 스크롤
                updateSection(currentSection + 1);
            } else if (e.deltaY < -50 && currentSection > 0) {
                // 위로 스크롤
                updateSection(currentSection - 1);
            }
        }, 100);
    }
    
    // 터치 이벤트를 위한 변수
    let touchStartY = 0;
    let touchEndY = 0;
    
    // 터치 시작 이벤트 핸들러
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }
    
    // 터치 종료 이벤트 핸들러
    function handleTouchEnd(e) {
        // 스크롤 중이면 무시
        if (isScrolling) return;
        
        touchEndY = e.changedTouches[0].clientY;
        const touchDiff = touchStartY - touchEndY;
        
        // 터치 방향에 따라 섹션 전환 (50px 이상 스와이프 해야 작동)
        if (touchDiff > 50 && currentSection < sections.length - 1) {
            // 위로 스와이프 (아래로 스크롤)
            updateSection(currentSection + 1);
        } else if (touchDiff < -50 && currentSection > 0) {
            // 아래로 스와이프 (위로 스크롤)
            updateSection(currentSection - 1);
        }
    }
    
    // 방향키 이벤트 핸들러
    function handleKeyDown(e) {
        // 스크롤 중이면 무시
        if (isScrolling) return;
        
        if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
            updateSection(currentSection + 1);
        } else if (e.key === 'ArrowUp' && currentSection > 0) {
            updateSection(currentSection - 1);
        }
    }
    
    // 이벤트 리스너 설정
    
    // 마우스 휠 이벤트 리스너 추가
    window.addEventListener('wheel', handleWheelEvent, { passive: true });
    
    // 터치 이벤트 리스너 추가
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // 키보드 이벤트 리스너 추가
    window.addEventListener('keydown', handleKeyDown);
    
    // 메뉴 아이템 클릭으로 섹션 전환
    menuItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateSection(index);
        });
    });
    
    // 기본 스크롤 방지 (필요 시)
    document.body.style.overflow = 'hidden';
    
    // 비밀 메시지 함수 전역으로 노출
    window.revealSecret = revealSecret;
    
    // 초기화 작업
    updateDateTime();
    setInterval(updateDateTime, 1000);
    setInterval(createSnow, 200); // 눈 내리는 효과 시작
    
    // 첫 번째 섹션 활성화 및 터미널 텍스트 타이핑 시작
    updateSection(0);
    
    // 오디오 자동 재생 시도
    if (window.playWaveSound) {
        window.playWaveSound();
    }
});