// src/scripts/timeline.js

// 시크릿 패널 토글 함수 
function revealSecret(id) {
  const panel = document.getElementById(`secret-${id}`);
  
  // 현재 숨겨진 상태인지 확인하고 토글
  if (panel.style.display === 'none' || panel.style.display === '') {
      panel.style.display = 'block';
  } else {
      panel.style.display = 'none';
  }
}

// 사이드 네비게이션 하이라이트 및 스크롤 이벤트
const sideNavItems = document.querySelectorAll('.side-nav-item');
const sections = document.querySelectorAll('.timeline-item');

// 사이드 네비게이션 클릭 시 부드러운 스크롤 
document.querySelectorAll('.side-nav-item').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
          targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
          });
      }
  });
});

// 현재 보이는 섹션에 따라 사이드 네비게이션 하이라이트
function highlightNavItem() {
  const scrollPosition = window.scrollY;
  
  document.querySelectorAll('.timeline-item').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');
      
      if (sectionId) {
          const navItem = document.querySelector(`.side-nav-item[href="#${sectionId}"]`);
          
          if (scrollPosition >= sectionTop - 200 && 
              scrollPosition < sectionTop + sectionHeight - 200) {
              navItem?.classList.add('active');
          } else {
              navItem?.classList.remove('active');
          }
      }
  });
}

// 페이지 로드 시 초기 설정
document.addEventListener('DOMContentLoaded', function() {
  // 모든 시크릿 패널 초기에 숨기기
  const panels = document.querySelectorAll('.secret-panel');
  panels.forEach(panel => {
      panel.style.display = 'none';
  });

  // 페이지 로드 시 오디오 재생
  if (window.playWaveSound) {
      window.playWaveSound();
  }
});
// 스크롤 이벤트 리스너 추가
window.addEventListener('scroll', highlightNavItem);
highlightNavItem();