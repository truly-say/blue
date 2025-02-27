// src/scripts/map.js - 모바일 최적화 버전
// 크루즈 선박 지도 인터랙션 관리 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 선택
    const cruiseMap = document.getElementById('cruise-map');
    const deckInfoPanel = document.getElementById('deck-info');
    const deckTitle = document.getElementById('deck-title');
    const deckDescription = document.getElementById('deck-description');
    const eventList = document.getElementById('event-list');
    const facilityList = document.getElementById('facility-list');
    const closeInfoBtn = document.getElementById('close-info');
    const deckEvents = document.getElementById('deck-events');
    const deckFacilities = document.getElementById('deck-facilities');
    const mobileDeckItems = document.querySelectorAll('.mobile-deck-item');
    
    // 각 층에 대한 데이터
    const deckData = {
      1: {
        title: 'Deck 1 - 기계실',
        description: '선박의 기계실이 위치한 층입니다. 엔진, 발전기, 보일러 등 선박 운영에 필요한 핵심 설비가 있습니다. 일반 승객의 출입이 제한되어 있습니다.',
        facilities: [
          '주기관실 (메인 엔진)',
          '발전기실',
          '보일러실',
          '냉방 시스템',
          '전기 제어실',
          '정비실'
        ],
        events: [
          '기계 설비 문제 없음'
        ]
      },
      2: {
        title: 'Deck 2 - 주차장',
        description: '차량 주차 공간이 마련된 층입니다. 대형 차량도 수용 가능하며, 승객들의 차량이 안전하게 보관됩니다. 보안 카메라가 설치되어 24시간 모니터링됩니다.',
        facilities: [
          '승용차 주차 구역',
          '대형 차량 주차 구역',
          '계단 및 엘리베이터'
        ],
        events: [
          '철문 파괴됨',
          '버스 파괴?됨'
        ]
      },
      3: {
        title: 'Deck 3 - 미로',
        description: '이 층은 미로 형태로 구성되어 있습니다. 복잡한 복도와 통로가 특징이며, 일부 구역은 차단되어 있습니다.',
        facilities: [
          '미로',
          '컨테이너',
          '봉고차',
          '비상구역'
        ],
        events: [
          '시체더미 주의'
        ]
      },
      4: {
        title: 'Deck 4 - 연회장 & 레저시설',
        description: '다양한 레저 시설과 연회장이 위치한 층입니다. 수영장, 극장, PC방 등 다양한 엔터테인먼트 시설을 즐길 수 있습니다.',
        facilities: [
          '연회장',
          '극장',
          'PC방',
          '실내 수영장',
          '찜질방',
          '드레스룸',
          '패밀리룸'
        ],
        events: [
          '복도에 불이 들어오지 않으므로 주의'
        ]
      },
      5: {
        title: 'Deck 5 - 편의시설 & 객실',
        description: '다양한 편의시설과 객실이 위치한 층입니다. 이코노미 객실부터 VIP 객실, 반려동물 동반 객실까지 다양한 객실이 있으며, 편의점, 영화관 등 편의시설도 갖추고 있습니다.',
        facilities: [
          '이코노미 객실',
          'VIP 객실',
          '펫코노미 객실',
          '패밀리 객실',
          '편의점',
          '안마실',
          '면세점',
          '휴게실',
          '영화관',
          '노래방',
          '게임룸',
          '기념품샵',
          '강당',
          '갑판'
        ],
        events: [
          '5층 휴게실 비밀통로 확인됨'
        ]
      },
      6: {
        title: 'Deck 6 - VIP 객실 & 갑판',
        description: '고급 VIP 객실과 넓은 갑판이 있는 층입니다. 스위트 객실과 이코노미 객실, 다양한 편의시설이 갖춰져 있으며, 외부 갑판에서 바다 전망을 감상할 수 있습니다.',
        facilities: [
          '이코노미 객실',
          '스위트 A',
          '스위트 B',
          '스탠다드 객실',
          'VIP 객실',
          '휴게실',
          '화장실',
          '야외 갑판'
        ],
        events: [
          '객실 복도에서 소란 발생',
          '6층 VIP룸에서 강아지 발견'
        ]
      },
      7: {
        title: 'Deck 7 - 전망대 & 레스토랑',
        description: '선박의 최상층으로, 전망대와 고급 레스토랑이 위치한 층입니다. 탁 트인 바다 전망을 감상할 수 있는 최고의 장소입니다.',
        facilities: [
          '전망대',
          '레스토랑',
          '야외 갑판',
          '루프탑 바'
        ],
        events: [
          '블루 링 크루즈 확인됨',
          '전파 on/off 장치 확인됨'
        ]
      }
    };
    
    // 층 선택 시 해당 층의 데이터를 표시하는 함수
    function selectDeck(deckId) {
      // 이전에 선택된 층 비활성화 - SVG와 모바일 리스트 모두에 적용
      document.querySelectorAll('.deck.active').forEach(deck => {
        deck.classList.remove('active');
      });
      
      document.querySelectorAll('.mobile-deck-item.active').forEach(item => {
        item.classList.remove('active');
      });
      
      // 현재 선택된 층 활성화 - SVG에서
      const currentDeck = document.getElementById('deck-' + deckId);
      if (currentDeck) {
        currentDeck.classList.add('active');
      }
      
      // 현재 선택된 층 활성화 - 모바일 리스트에서
      const currentMobileDeck = document.querySelector(`.mobile-deck-item[data-deck="${deckId}"]`);
      if (currentMobileDeck) {
        currentMobileDeck.classList.add('active');
      }
      
      // 선택된 층 정보 업데이트
      updateDeckInfo(deckId);
      
      // 모바일에서 정보 패널이 잘 보이도록 스크롤 조정
      setTimeout(() => {
        if (window.innerWidth <= 768) {
          deckInfoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300);
    }
    
    // 층 정보 업데이트 함수
    function updateDeckInfo(deckId) {
      const data = deckData[deckId];
      if (!data) return;
      
      // 제목과 설명 업데이트
      deckTitle.textContent = data.title;
      deckDescription.textContent = data.description;
      
      // 시설 목록 업데이트
      facilityList.innerHTML = '';
      if (data.facilities && data.facilities.length > 0) {
        data.facilities.forEach(facility => {
          const li = document.createElement('li');
          li.textContent = facility;
          facilityList.appendChild(li);
        });
        deckFacilities.classList.remove('hidden');
      } else {
        deckFacilities.classList.add('hidden');
      }
      
      // 이벤트 목록 업데이트
      eventList.innerHTML = '';
      if (data.events && data.events.length > 0) {
        data.events.forEach(event => {
          const li = document.createElement('li');
          li.textContent = event;
          eventList.appendChild(li);
        });
        deckEvents.classList.remove('hidden');
      } else {
        deckEvents.classList.add('hidden');
      }
      
      // 정보 패널 표시
      deckInfoPanel.classList.add('visible');
    }
    
    // 정보 패널 닫기
    function closeDeckInfo() {
      deckInfoPanel.classList.remove('visible');
      
      // 선택된 층 비활성화 - SVG와 모바일 리스트 모두에 적용
      document.querySelectorAll('.deck.active').forEach(deck => {
        deck.classList.remove('active');
      });
      
      document.querySelectorAll('.mobile-deck-item.active').forEach(item => {
        item.classList.remove('active');
      });
    }
    
    // SVG 층 클릭 이벤트 리스너 설정
    document.querySelectorAll('.deck').forEach(deck => {
      deck.addEventListener('click', function() {
        const deckId = this.dataset.deck;
        selectDeck(deckId);
      });
    });
    
    // 모바일 층 리스트 아이템 클릭 이벤트 리스너 설정
    mobileDeckItems.forEach(item => {
      item.addEventListener('click', function() {
        const deckId = this.dataset.deck;
        selectDeck(deckId);
      });
      
      // 터치 디바이스에서 클릭 이벤트 대신 touchend 사용
      item.addEventListener('touchend', function(e) {
        e.preventDefault(); // 이중 클릭 방지
        const deckId = this.dataset.deck;
        selectDeck(deckId);
      });
    });
    
    // 정보 패널 닫기 버튼 이벤트 리스너
    closeInfoBtn.addEventListener('click', closeDeckInfo);
    closeInfoBtn.addEventListener('touchend', function(e) {
      e.preventDefault();
      closeDeckInfo();
    });
    
    // 화면 크기 변경 시 조정
    window.addEventListener('resize', function() {
      adjustSvgSize();
      adjustContainerPadding();
      
      // 화면 크기에 따라 스크롤 조정 (필요시)
      adjustScrollForActiveDeck();
    });
    
    // SVG 크기 조정 함수
    function adjustSvgSize() {
      const desktopMap = document.querySelector('.desktop-map');
      if (desktopMap && cruiseMap) {
        const containerWidth = desktopMap.clientWidth;
        
        if (window.innerWidth > 768) {
          // 데스크톱에서는 충분히 크게 표시
          cruiseMap.style.width = `${Math.min(containerWidth * 0.98, 950)}px`;
          cruiseMap.style.minHeight = '700px';
        }
      }
    }
    
    // 컨테이너 패딩 조정 함수 - 푸터가 가리는 문제 해결
    function adjustContainerPadding() {
      const mapContainer = document.querySelector('.map-container');
      const footer = document.querySelector('.audio-footer');
      
      if (mapContainer && footer) {
        const footerHeight = footer.offsetHeight;
        // 모바일에서 더 많은 여백 확보
        if (window.innerWidth <= 768) {
          mapContainer.style.marginBottom = `${footerHeight + 40}px`;
        } else {
          mapContainer.style.marginBottom = `${footerHeight + 20}px`;
        }
      }
    }
    
    // 활성화된 층이 있을 때 해당 층이 잘 보이도록 스크롤 조정
    function adjustScrollForActiveDeck() {
      if (window.innerWidth <= 768) {
        const activeMobileDeck = document.querySelector('.mobile-deck-item.active');
        if (activeMobileDeck) {
          activeMobileDeck.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
    
    // 이미 정보 패널이 열린 상태에서 페이지 로드 시 스크롤 조정
    function checkForOpenPanel() {
      if (deckInfoPanel.classList.contains('visible') && window.innerWidth <= 768) {
        setTimeout(() => {
          deckInfoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 500);
      }
    }
    
    // 초기화: 크기 조정 및 기본 상태 설정
    function initialize() {
      // SVG 크기 초기 조정
      adjustSvgSize();
      
      // 푸터 여백 조정
      adjustContainerPadding();
      
      // 정보 패널 숨김 상태로 초기화
      deckInfoPanel.classList.remove('visible');
      
      // 오디오 자동 재생 시도
      if (window.playWaveSound) {
        window.playWaveSound();
      }
      
      // 열린 패널 체크
      checkForOpenPanel();
    }
    
    // 페이지 로드 시 초기화 실행
    initialize();
  });