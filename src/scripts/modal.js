// src/scripts/modal.js
// 비밀번호 모달 처리 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소
    const passwordModal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('passwordInput');
    const submitPasswordBtn = document.getElementById('submitPassword');
    const errorMessage = document.getElementById('errorMessage');
    const memoryCard = document.getElementById('memory-card');
    
    // 상수
    const CORRECT_PASSWORD = 'YOUTH';
    
    // 메모리 카드 클릭 시 날짜 확인 후 모달 표시 또는 메시지 출력
    memoryCard.addEventListener('click', function(e) {
        e.preventDefault(); // 기본 이벤트 방지
        
        // 날짜 체크 없이 바로 비밀번호 모달 표시
        openPasswordModal();
    });
    
    
    // 비밀번호 모달 열기
    function openPasswordModal() {
        // 모달 표시
        passwordModal.classList.add('visible');
        
        // 입력 필드 초기화 및 포커스
        passwordInput.value = '';
        passwordInput.focus();
        
        // 에러 메시지 초기화
        errorMessage.textContent = '';
        errorMessage.classList.remove('visible');
    }
    
    // 비밀번호 모달 닫기
    function closePasswordModal() {
        passwordModal.classList.remove('visible');
    }
    
    // 비밀번호 검증 함수
    function validatePassword() {
        const enteredPassword = passwordInput.value.trim().toUpperCase();
        
        if (enteredPassword === CORRECT_PASSWORD) {
            // 비밀번호 맞음 - memory.html로 이동
            closePasswordModal();
            window.location.href = 'src/pages/memory.html';
        } else {
            // 비밀번호 틀림 - 에러 메시지 표시
            errorMessage.textContent = '비밀번호가 올바르지 않습니다. 다시 시도하세요.';
            errorMessage.classList.add('visible');
            
            // 입력 필드 비우기
            passwordInput.value = '';
            passwordInput.focus();
            
            // 에러 메시지 3초 후 사라짐
            setTimeout(function() {
                errorMessage.classList.remove('visible');
            }, 3000);
        }
    }
    
    // 모달 외부 클릭 시 닫기
    passwordModal.addEventListener('click', function(e) {
        // 이벤트가 모달 배경(modal-container가 아닌 modal 자체)에서 발생했는지 확인
        if (e.target === passwordModal) {
            closePasswordModal();
        }
    });
    
    // 비밀번호 입력 필드에서 엔터 키 입력 시 검증
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validatePassword();
        }
    });
    
    // 확인 버튼 클릭 시 비밀번호 검증
    submitPasswordBtn.addEventListener('click', validatePassword);
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && passwordModal.classList.contains('visible')) {
            closePasswordModal();
        }
    });
});