// status-config2.js
const STATUS_CONFIG = {
    getImagePath: function(imageName) {
        return `../../assets/images/${imageName}`;
    },


    get messages() {
        return {
            // 도이성 상태
            "도이성이 지나가는 사람들의 표정을 보고 있습니다": this.getImagePath('3도이성.png'),
            "도이성이 고장난 자판기를 치고 있습니다": this.getImagePath('3도이성.png'),
            "도이성이 버스에서 졸고 있습니다": this.getImagePath('3도이성.png'),
            
            // 은유벽 상태
            "은유벽이 문을 열고 밖으로 나가고 있습니다": this.getImagePath('3은유벽.png'),
            "은유벽이 지인의 일을 도와주고 있습니다": this.getImagePath('3은유벽.png'),
            "은유벽이 휴대폰을 집에 놓은 채 외출하고 있습니다": this.getImagePath('3은유벽.png'),
            
            // 최예슬 상태
            "최예슬이 가로수 나무 아래에 서있습니다": this.getImagePath('3최예슬.png'),
            "최예슬이 바람의 방향을 느끼고 있습니다": this.getImagePath('3최예슬.png'),
            "최예슬이 휘날린 머리카락을 정리하고 있습니다": this.getImagePath('3최예슬.png'),
            
            // 이도윤 상태
            "이도윤이 휴대폰 문자를 보고 있습니다": this.getImagePath('3이도윤.png'),
            "이도윤이 깊은 생각에 잠깁니다": this.getImagePath('3이도윤.png'),
            "이도윤이 사라진 물건을 찾고 있습니다": this.getImagePath('3이도윤.png'),
            
            // 구해늘 상태
            "구해늘이 서랍을 뒤져보다가 한숨을 쉬고 있습니다": this.getImagePath('3구해늘.png'),
            "구해늘이 문을 닫고 조용히 앉아 있습니다": this.getImagePath('3구해늘.png'),
            "구해늘이 커피를 마시며 업무를 생각하고 있습니다": this.getImagePath('3구해늘.png'),
            
            // 천여울 상태
            "천여울이 손목 시계로 시간을 확인 중입니다": this.getImagePath('3천여울.png'),
            "천여울이 토끼 인형을 챙기고 있습니다": this.getImagePath('3천여울.png'),
            "천여울이 짐을 싸고 있습니다": this.getImagePath('3천여울.png'),
            
            // 남현우 상태
            "남현우가 서류를 준비하고 있습니다": this.getImagePath('3남현우.png'),
            "남현우가 의자를 뒤로 젖힌 채 천장을 보고 있습니다": this.getImagePath('3남현우.png'),
            "남현우가 농담을 던지고 반응을 보고 있습니다": this.getImagePath('3남현우.png'),
            
            // 이겨울 상태
            "이겨울이 출근하고 있습니다": this.getImagePath('3이겨울.png'),
            "이겨울이 일정을 확인하고 있습니다": this.getImagePath('3이겨울.png'),
            "이겨울이 참새를 잡았습니다 ": this.getImagePath('3이겨울.png'),
            
            // 연해령 상태
            "연해령이 시스템을 점검하고 있습니다": this.getImagePath('3연해령.png'),
            "연해령이 누군가에게 인사를 하고 있습니다": this.getImagePath('3연해령.png'),
            "연해령이 차를 타고 이동 중입니다": this.getImagePath('3연해령.png'),
            
            // 이지훈 상태
            "[신원 미상]이 무언가를 찾고 있습니다": this.getImagePath('선청고등학교.png'),
            "[신원 미상]이 허공을 바라보고 있습니다": this.getImagePath('선청고등학교.png'),
            "[신원 미상]이 앉아서 생각하고 있습니다": this.getImagePath('선청고등학교.png'),
            
            // 단하율 상태
            "[신원 미상]이 취재 준비를 마쳤습니다": this.getImagePath('선청고등학교.png'),
            "[신원 미상]이 동료 기자와 대화하고 있습니다": this.getImagePath('선청고등학교.png'),
            "[신원 미상]이 카메라 메모리를 확인하고 있습니다": this.getImagePath('선청고등학교.png'),
            
            // 현진우 상태
            "현진우가 눈을 마주치지 않고 고개를 돌립니다": this.getImagePath('3현진우.png'),
            "현진우가 누군가와 대화를 나누고 있습니다": this.getImagePath('3현진우.png'),
            "현진우가 눈을 감고 가만히 앉아 있습니다": this.getImagePath('3현진우.png'),
            
            // 관리자 상태
            "관리자가 참여자의 데이터를 확인하고 있습니다": this.getImagePath('3은이연.png'),
            "관리자: 이미 사용된 암호가 여기서도 쓰이는 건 진부할까요?": this.getImagePath('3은이연.png'),
            "관리자: 이전에 제 코드 일부가 유출됐던 것 같네요.": this.getImagePath('3은이연.png')
        };
    },

    get defaultImage() {
        return this.getImagePath('선청고등학교.png');
    },

    cycleInterval: 3000,
    animationDuration: 300
};
