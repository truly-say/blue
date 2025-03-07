// status-config.js
const STATUS_CONFIG = {
    // 현재 페이지가 index.html인지 확인하는 함수
    getImagePath: function(imageName) {
        const isIndex = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/');
        const prefix = isIndex ? 'assets/' : '../../assets/';
        return `${prefix}images/${imageName}`;
    },

    get messages() {
        return {
            // 도이성 상태
            "도이성이 동네 편의점에서 과자를 고르고 있습니다": this.getImagePath('공주.png'),
            "도이성이 집으로 돌아가고 있습니다": this.getImagePath('공주.png'),
            "도이성이 짜증을 내며 면허증을 찾고 있습니다": this.getImagePath('공주.png'),
            
            // 은유벽 상태
            "은유벽이 방에 박혀있습니다": this.getImagePath('긍벽.png'),
            "은유벽이 문자를 씹고 있습니다": this.getImagePath('긍벽.png'),
            "은유벽이 알림을 끄고 있습니다": this.getImagePath('긍벽.png'),
            
            // 최예슬 상태
            "최예슬이 자리에 앉아 휴대폰을 보고 있습니다": this.getImagePath('커컥커.png'),
            "최예슬이 정보를 수집하고 있습니다": this.getImagePath('커컥커.png'),
            "최예슬이 책상 위 물건들을 정리하고 있습니다": this.getImagePath('커컥커.png'),
            
            // 사망자 상태
            "[신혜련의 생명 신호 감지되지 않음]": this.getImagePath('뭐야.png'),
            "[선지현의 생명 신호 감지되지 않음]": this.getImagePath('청소.png'),
            "[청검수의 생명 신호 감지되지 않음]": this.getImagePath('낙준.png'),
            
            // 성주안 상태
            "성주안이 노트에 무언가를 적고 있습니다": this.getImagePath('주안.png'),
            "성주안이 부탁 받은 일은 도와주고 있습니다": this.getImagePath('주안.png'),
            "성주안이 주변 사람들의 행동을 보고 있습니다": this.getImagePath('주안.png'),
            
            // 이도윤 상태
            "이도윤이 문을 열고 집을 나설 준비를 합니다": this.getImagePath('끼끼.png'),
            "이도윤이 일어나서 기지개를 피고 있습니다": this.getImagePath('끼끼.png'),
            "이도윤이 공원 벤치에 앉아 하늘을 보고 있습니다": this.getImagePath('끼끼.png'),
            
            // 구해늘 상태
            "구해늘이 방에서 시계 초침 소리를 듣고 있습니다": this.getImagePath('해팔.png'),
            "구해늘이 병원에 방문하고 있습니다": this.getImagePath('해팔.png'),
            "구해늘이 집중하는 듯 침묵을 지키고 있습니다": this.getImagePath('해팔.png'),
            
            // 유민 상태
            "유민이 다른 사람의 말을 경청하고 있습니다": this.getImagePath('유민.png'),
            "유민이 상대의 행동을 지적하고 있습니다": this.getImagePath('유민.png'),
            "유민이 가볍게 아침을 때우고 있습니다": this.getImagePath('유민.png'),
            
            // 천여울 상태
            "[11기 졸업생]이 잠에서 깼습니다": this.getImagePath('토끼.png'),
            "[11기 졸업생]이 토끼 인형을 안고 있습니다": this.getImagePath('토끼.png'),
            "[11기 졸업생]이 튜터링을 준비하고 있습니다": this.getImagePath('토끼.png'),
            
            // 남현우 상태
            "[11기 졸업생]이 업무 준비를 하고 있습니다": this.getImagePath('포도.png'),
            "[11기 졸업생]이 경영 지식을 배우고 있습니다": this.getImagePath('포도.png'),
            "[11기 졸업생]이 회의를 주도하고 있습니다": this.getImagePath('포도.png'),
            
            // 이겨울 상태
            "[신원 미상]이 소파에 늘어져 있습니다": this.getImagePath('겨ㅇ비.png'),
            "[신원 미상]이 전화를 받고 있습니다": this.getImagePath('겨ㅇ비.png'),
            "[신원 미상]이 업무 이메일을 읽고 있습니다": this.getImagePath('겨ㅇ비.png'),
            
            // 연해령 상태
            "연해령이 모델 설계 및 개발을 하고 있습니다": this.getImagePath('이불.png'),
            "연해령이 책상에 엎드려 자고 있습니다": this.getImagePath('이불.png'),
            "연해령이 산책 중 만난 강아지를 쓰다듬고 있습니다": this.getImagePath('이불.png'),
            
            // 이지훈 상태
            "이지훈이 누군가의 생사를 확인하고 있습니다": this.getImagePath('와인.png'),
            "이지훈이 거울을 보고 있습니다": this.getImagePath('와인.png'),
            "이지훈이 상황 파악을 하고 있습니다": this.getImagePath('와인.png'),
            
            // 단하율 상태
            "단하율이 취재를 준비하고 있습니다": this.getImagePath('기자.png'),
            "단하율이 14기에게 연락을 시도하고 있습니다": this.getImagePath('기자.png'),
            "단하율이 자료를 정리하고 있습니다": this.getImagePath('기자.png'),
            
            // 현진우 상태
            "현진우가 슬기로운 감빵 생활 중입니다": this.getImagePath('마녀.png'),
            "현진우가 교도관 옆에서 밥을 먹고 있습니다": this.getImagePath('마녀.png'),
            "현진우가 침대에서 뒤척거리고 있습니다": this.getImagePath('마녀.png'),
            
            // 관리자 상태
            "y_pred = model.predict(X_test)": this.getImagePath('살구.png')
        };
    },

    get defaultImage() {
        return this.getImagePath('선청고등학교.png');
    },

    cycleInterval: 3000,
    animationDuration: 300
};
