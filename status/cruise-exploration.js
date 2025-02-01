const LocationType = {
  ROOM: 'room',
  FACILITY: 'facility',
  STORAGE: 'storage',
  OBSERVATION: 'observation'
};

const ClueType = {
  TEXT: 'text',
  NUMBER: 'number',
  PASSWORD: 'password',
  PATTERN: 'pattern',
  COMBINATION: 'combination'
};

const cruiseData = {
  floors: {
    '7': {
      name: '최상층',
      description: '크루즈의 최상층. 전망과 식사를 즐길 수 있는 공간.',
      locations: {
        restaurant: {
          name: '레스토랑',
          type: LocationType.FACILITY,
          description: '고급 레스토랑. 바다를 바라보며 식사할 수 있다.',
          clues: ['레스토랑에서 수상한 메모를 발견했다'],
          isLocked: false,
          interactions: [
            {
              name: '테이블 조사하기',
              result: '테이블 위에 수상한 메모가 있다.',
              requiresClue: null,
              givesItem: '수상한 메모'
            },
            {
              name: '주방 살펴보기',
              result: '주방에서 이상한 영수증을 발견했다.',
              requiresClue: null,
              givesItem: '수상한 영수증'
            },
            {
              name: '와인 셀러 확인',
              result: '와인 셀러에서 숨겨진 쪽지를 발견했다.',
              requiresClue: '수상한 메모',
              givesItem: '비밀 쪽지'
            }
          ]
        },
        observatory: {
          name: '전망대',
          type: LocationType.OBSERVATION,
          description: '360도 파노라마 뷰를 감상할 수 있는 공간',
          clues: ['망원경에서 이상한 신호가 보인다...'],
          isLocked: false,
          interactions: [
            {
              name: '망원경으로 바다 보기',
              result: '멀리서 깜빡이는 불빛이 보인다. 모스 부호 같다...',
              requiresClue: null,
              givesItem: '모스 부호 기록'
            },
            {
              name: '바닥 살펴보기',
              result: '바닥에 긁힌 자국이 있다. 뭔가 있었던 것 같다.',
              requiresClue: null,
              givesItem: '바닥 사진'
            },
            {
              name: '벽면 조사하기',
              result: '벽면에 숨겨진 장치를 발견했다.',
              requiresClue: '바닥 사진',
              givesItem: '이상한 장치'
            }
          ]
        },
        deck7: {
          name: '7층 갑판',
          type: LocationType.DECK,
          description: '최상층 갑판. 멋진 전망을 즐길 수 있다.',
          clues: ['갑판에서 수상한 흔적을 발견했다'],
          isLocked: false,
          interactions: [
            {
              name: '난간 확인하기',
              result: '난간에 이상한 흠집이 있다.',
              requiresClue: null,
              givesItem: '흠집 사진'
            },
            {
              name: '갑판 바닥 조사하기',
              result: '바닥에서 작은 열쇠를 발견했다.',
              requiresClue: '흠집 사진',
              givesItem: '작은 열쇠'
            }
          ]
        },
        bar: {
          name: '스카이 바',
          type: LocationType.FACILITY,
          description: '최상층에 위치한 고급 바. 칵테일을 즐길 수 있다.',
          clues: ['바에서 수상한 대화를 들었다'],
          isLocked: false,
          interactions: [
            {
              name: '바텐더와 대화하기',
              result: '바텐더가 수상한 손님에 대해 이야기한다.',
              requiresClue: null,
              givesItem: '대화 내용'
            },
            {
              name: '카운터 살펴보기',
              result: '카운터 아래에서 떨어진 카드를 발견했다.',
              requiresClue: null,
              givesItem: '수상한 카드'
            }
          ]
        }
      }
    },
    '6': {
      name: '객실층',
      description: '승객들의 객실이 있는 층. 일부 객실은 잠겨있다.',
      locations: {
        corridor: {
          name: '복도',
          type: LocationType.ROOM,
          description: '길고 어두운 복도. 양쪽으로 객실이 늘어서 있다',
          clues: ['복도 끝에서 이상한 소리가 들린다'],
          isLocked: true,
          unlockCondition: (clues) => clues.includes('망원경에서 이상한 신호가 보인다...'),
          interactions: [
            {
              name: '복도 끝 확인하기',
              result: '복도 끝에서 작은 비명 소리가 들린다...',
              requiresClue: null,
              givesItem: '비명 소리 녹음',
            },
            {
              name: '비상구 살펴보기',
              result: '비상구가 잠겨있다. 열쇠가 필요할 것 같다.',
              requiresClue: '작은 열쇠',
              givesItem: '비상구 접근 권한'
            }
          ]
        },
        room601: {
          name: '601호 객실',
          type: LocationType.ROOM,
          description: '평범해 보이는 객실',
          clues: ['침대 밑에서 열쇠를 발견했다'],
          isLocked: true,
          unlockCondition: (clues) => clues.includes('비명 소리 녹음'),
          interactions: [
            {
              name: '침대 밑 확인',
              result: '침대 밑에서 금고를 발견했다.',
              requiresClue: null,
              givesItem: '금고 발견'
            },
            {
              name: '금고 열기',
              result: '금고 안에 비상 열쇠와 문서가 있다.',
              requiresClue: '바텐더의 휴대폰',
              givesItem: '비상 열쇠'
            }
          ]
        }
      }
    },
    '5': {
      name: '편의시설층',
      description: '상점 등 대충 편의시설이 있는 층',
      locations: {
        restaurant: {
          name: '레스토랑',
          type: LocationType.FACILITY,
          description: '고급 레스토랑. 테이블이 어지럽게 놓여있다',
          clues: ['레스토랑에서 깨진 와인잔을 발견했다'],
          isLocked: true,
          unlockCondition: (clues) => clues.length >= 2,
          interactions: [
            {
              name: '깨진 와인잔 조사',
              result: '와인잔에서 독특한 지문이 발견됐다.',
              requiresClue: null,
              givesItem: '수상한 지문'
            },
            {
              name: '주방 살펴보기',
              result: '주방 칼이 하나 없어졌다.',
              requiresClue: null,
              givesItem: '주방 기록'
            }
          ]
        }
      }
    },
    '4': {
      name: '주차층',
      description: '차량 및 화물 보관소',
      locations: {
        parking: {
          name: '주차장',
          type: LocationType.STORAGE,
          description: '어두운 주차장. 몇 대의 차가 주차되어 있다',
          clues: ['주차된 차 안에서 수상한 물건을 발견했다'],
          isLocked: true,
          unlockCondition: (clues) => clues.length >= 3,
          interactions: [
            {
              name: '차량 조사하기',
              result: '차 안에서 묘한 냄새가 난다...',
              requiresClue: null,
              givesItem: '차량 조사 기록'
            },
            {
              name: '트렁크 열기',
              result: '트렁크에서 의문의 가방을 발견했다.',
              requiresClue: '비상 열쇠',
              givesItem: '의문의 가방'
            }
          ]
        }
      }
    },
    '3': {
      name: '미로',
      description: '구불구불한 미로. 길을 잃지 않게 조심해야 한다',
      locations: {
        observatory: {
          name: '미로',
          type: LocationType.MAZE,
          description: '여러 갈래로 길이 나뉘어져 있는 미로',
          clues: ['알 수 없는 단서를 발견했다...'],
          isLocked: false,
          interactions: [
            {
              name: '앞으로 가기',
              result: '멀리서 깜빡이는 불빛이 보인다. 모스 부호 같다...',
              requiresClue: null,
              givesItem: '모스 부호 기록'
            },
            {
              name: '오른쪽으로 가기',
              result: '난간에 이상한 흠집이 나있다. 누군가 의도적으로 그은 것 같다.',
              requiresClue: null,
              givesItem: '수상한 흠집 사진'
            },
            {
              name: '뒤로 가기',
              result: '바닥에 뭔가 반짝이는 것이 있다... 작은 열쇠다!',
              requiresClue: null,
              givesItem: '작은 열쇠'
            },
            {
              name: '왼쪽으로 가기',
              result: '바닥에 뭔가 반짝이는 것이 있다... 작은 열쇠다!',
              requiresClue: null,
              givesItem: '작은 열쇠'
            }
          ]
        }
      }
    }
  }
};

// 단서 데이터
const clueData = {
  '수상한 메모': {
    type: ClueType.TEXT,
    content: '선실 번호 601... 그리고 시간은 3시...',
    hint: '시간이 중요해 보입니다.',
    relatedPassword: 'storage601'
  },
  '모스 부호 기록': {
    type: ClueType.PATTERN,
    content: '... --- ... / -.... -.... --...', // SOS 667
    hint: '모스 부호를 해독하면 비상 코드를 얻을 수 있습니다.',
    solution: '667',
    relatedPassword: 'emergency'
  },
  '수상한 영수증': {
    type: ClueType.COMBINATION,
    content: '주문 번호: #4872\n품목: 와인 2병, 위스키 1병\n합계: ₩235,000',
    hint: '주문 번호가 어딘가에 쓰일 것 같습니다.',
    combination: '4872'
  },
  '비밀 쪽지': {
    type: ClueType.PASSWORD,
    content: '보안실 비밀번호: ****\n힌트: 수상한 영수증의 주문 번호',
    hint: '영수증을 먼저 찾아야 할 것 같습니다.',
    password: '4872'
  }
};

// 퍼즐 데이터
const puzzleData = {
  'storage601': {
    type: 'keypad',
    description: '보관실 601호의 키패드입니다. 4자리 비밀번호가 필요합니다.',
    solution: '0300', // 3시를 의미
    reward: '비상 열쇠',
    requiredClues: ['수상한 메모']
  },
  'emergency': {
    type: 'pattern',
    description: '비상 잠금 장치입니다. 3자리 비상 코드를 입력하세요.',
    solution: '667',
    reward: '비상 통신 장치',
    requiredClues: ['모스 부호 기록']
  }
};

class CluePuzzleSystem {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.solvedPuzzles = new Set();
    this.analyzedClues = new Set();
    this.initializePuzzleSystem();
  }

  // 단서 분석
  analyzeClue(clueId) {
    const clue = clueData[clueId];
    if (!clue || this.analyzedClues.has(clueId)) return null;

    this.analyzedClues.add(clueId);
    
    let message = `단서 분석 결과:\n${clue.content}\n`;
    if (clue.hint) {
      message += `\n힌트: ${clue.hint}`;
    }

    // 특별한 단서 타입별 처리
    switch (clue.type) {
      case ClueType.PATTERN:
        message += '\n이 패턴은 어딘가에 입력해야 할 것 같습니다.';
        break;
      case ClueType.PASSWORD:
        message += '\n비밀번호를 찾아야 합니다.';
        break;
      case ClueType.COMBINATION:
        message += '\n이 조합을 기억해두면 좋을 것 같습니다.';
        break;
    }

    return message;
  }

  // 퍼즐 시도
  attemptPuzzle(puzzleId, answer) {
    const puzzle = puzzleData[puzzleId];
    if (!puzzle || this.solvedPuzzles.has(puzzleId)) return false;

    // 필요한 단서 확인
    const hasRequiredClues = puzzle.requiredClues.every(clueId => 
      this.game.collectedClues.includes(clueId)
    );

    if (!hasRequiredClues) {
      return {
        success: false,
        message: '이 퍼즐을 풀기 위한 단서가 부족합니다.'
      };
    }

    // 정답 확인
    if (answer === puzzle.solution) {
      this.solvedPuzzles.add(puzzleId);
      
      // 보상 지급
      if (puzzle.reward && !this.game.inventory.includes(puzzle.reward)) {
        this.game.inventory.push(puzzle.reward);
      }

      return {
        success: true,
        message: `퍼즐을 해결했습니다! ${puzzle.reward ? `보상으로 [${puzzle.reward}]를 획득했습니다.` : ''}`,
        reward: puzzle.reward
      };
    }

    return {
      success: false,
      message: '틀린 답입니다. 다시 시도해보세요.'
    };
  }

  // 단서 조합 시도
  combineClues(clueId1, clueId2) {
    const clue1 = clueData[clueId1];
    const clue2 = clueData[clueId2];
    
    if (!clue1 || !clue2) return null;

    // 특정 단서 조합에 대한 처리
    if (clue1.type === ClueType.PASSWORD && clue2.type === ClueType.COMBINATION) {
      if (clue1.password === clue2.combination) {
        return {
          success: true,
          message: '단서들을 조합하여 새로운 정보를 얻었습니다!',
          result: '비밀번호를 찾았습니다: ' + clue2.combination
        };
      }
    }

    return {
      success: false,
      message: '이 단서들은 서로 관련이 없어 보입니다.'
    };
  }
}


function updateActiveSection() {
  const sections = document.querySelectorAll('.status-section');
  const navItems = document.querySelectorAll('.side-nav-item');
  
  // Check if both sections and navItems exist before processing
  if (sections.length > 0 && navItems.length > 0) {
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
        navItems.forEach(item => item.classList.remove('active'));
        if (navItems[index]) {
          navItems[index].classList.add('active');
        }
      }
    });
  }
}

// Ensure DOM is fully loaded before attaching events
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection();
  
});

const floorUnlockConditions = {
  '7': null,
  '6': (clues, inventory) => 
    inventory.includes('모스 부호 기록') && 
    clues.includes('망원경에서 이상한 신호가 보인다...'),
  '5': (clues, inventory) => 
    inventory.includes('비상구 접근 권한') && 
    inventory.includes('작은 열쇠') && 
    clues.length >= 3,
  '4': (clues, inventory) => 
    inventory.includes('비상 열쇠') && 
    inventory.includes('수상한 지문') && 
    clues.length >= 5
};

class CruiseExploration {
  constructor() {
    this.selectedFloor = null;
    this.selectedLocation = null;
    this.collectedClues = [];
    this.inventory = [];
    this.maxInventorySize = 5;
    this.unlockedLocations = ['observatory', 'skyLounge', 'deck7', 'bar'];
    this.messageHistory = [];

    this.initializeDOM();
    this.setupEventListeners();
  }

  initializePuzzleSystem() {
    this.puzzleSystem = new CluePuzzleSystem(this);
  }

  createClueAnalysisUI(clueId) {
    const result = this.puzzleSystem.analyzeClue(clueId);
    if (!result) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
    
    const content = document.createElement('div');
    content.className = 'bg-gray-800 p-6 rounded-lg max-w-md w-full';
    content.innerHTML = `
      <h3 class="text-xl font-bold mb-4">단서 분석</h3>
      <div class="whitespace-pre-wrap mb-4">${result}</div>
      <button class="w-full bg-blue-500 text-white rounded px-4 py-2">닫기</button>
    `;

    content.querySelector('button').onclick = () => modal.remove();
    modal.appendChild(content);
    document.body.appendChild(modal);
  }

  createPuzzleAttemptUI(puzzleId) {
    const puzzle = puzzleData[puzzleId];
    if (!puzzle) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
    
    const content = document.createElement('div');
    content.className = 'bg-gray-800 p-6 rounded-lg max-w-md w-full';
    content.innerHTML = `
      <h3 class="text-xl font-bold mb-4">${puzzle.description}</h3>
      <input type="text" class="w-full bg-gray-700 p-2 rounded mb-4" placeholder="답을 입력하세요">
      <button class="w-full bg-blue-500 text-white rounded px-4 py-2 mb-2">확인</button>
      <button class="w-full bg-gray-600 text-white rounded px-4 py-2">닫기</button>
    `;

    const input = content.querySelector('input');
    const submitBtn = content.querySelector('button');
    const closeBtn = content.querySelectorAll('button')[1];

    submitBtn.onclick = () => {
      const result = this.puzzleSystem.attemptPuzzle(puzzleId, input.value);
      if (result.success) {
        this.showMessage(result.message, 'success');
        modal.remove();
        this.updateCluesAndInventory();
      } else {
        this.showMessage(result.message, 'error');
      }
    };

    closeBtn.onclick = () => modal.remove();
    modal.appendChild(content);
    document.body.appendChild(modal);
  }
  
  initializeDOM() {
    this.createGameContainer();
    this.createMessageLog();
    this.createInventoryPanel();
    this.createCluesPanel();
    
    this.renderFloorSelection();
    this.updateCluesAndInventory();
  }

  initializeGame() {
    this.renderFloorSelection();
    this.setupEventListeners();
    this.createMessageLog(); // Add this line
}

createCluesPanel() {
  const container = document.createElement('div');
  container.id = 'clues-panel';
  container.className = 'fixed top-4 left-4 w-64 bg-gray-900/95 rounded-lg p-4';
  
  const title = document.createElement('h3');
  
  const list = document.createElement('div');
  list.id = 'clues-list';
  list.className = 'space-y-2';
  
  container.appendChild(title);
  container.appendChild(list);
  
  document.getElementById('game-container').appendChild(container);
}


createGameContainer() {
  const container = document.createElement('div');
  container.id = 'game-container';
  
  // 게임 패널들을 감싸는 div
  const gamePanels = document.createElement('div');
  gamePanels.className = 'game-panels grid grid-cols-2 gap-6 mb-4'; // mb-4 추가
  
  // 메시지 로그를 game-container 안에 배치하되, 패널들 아래에 위치하도록 함
  const messageLog = document.createElement('div');
  messageLog.id = 'message-log';
  messageLog.className = 'bg-dark-panel rounded-lg p-4 mt-4'; // 상단 마진 추가

  if (messageLog) {
    messageLog.style.position = 'absolute';
    messageLog.style.bottom = '20px';
    messageLog.style.right = '20px';
}
  
  const messagesList = document.createElement('div');
  messagesList.id = 'message-list';
  messagesList.className = 'space-y-2 max-h-32 overflow-y-auto'; // 높이 제한 및 스크롤 추가
  
  messageLog.appendChild(messagesList);
  container.appendChild(gamePanels);
  container.appendChild(messageLog);
  
  document.body.appendChild(container);
}

  setupEventListeners() {
    // Add any additional event listeners if needed
  }

  createMessageLog() {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;

    const logContainer = document.createElement('div');
    logContainer.id = 'message-log';
    logContainer.className = 'message-log fixed bottom-4 left-4 w-1/3 bg-gray-900/95 rounded-lg p-4 max-h-48 overflow-y-auto';
    
    const messagesList = document.createElement('div');
    messagesList.id = 'message-list';
    messagesList.className = 'space-y-2';
    
    logContainer.appendChild(messagesList);
    gameContainer.appendChild(logContainer);
  }

  createInventoryPanel() {
    const container = document.createElement('div');
    container.id = 'inventory-panel';
    container.className = 'fixed top-4 right-4 w-64 bg-gray-900/95 rounded-lg p-4';
    
    const title = document.createElement('h3');
    title.className = 'text-lg font-bold mb-2';
    
    const list = document.createElement('div');
    list.id = 'inventory-list';
    list.className = 'space-y-2';
    
    container.appendChild(title);
    container.appendChild(list);
    
    document.getElementById('game-container').appendChild(container);
  }

  getMessageStyle(type) {
    const styles = {
      success: 'text-green-400',
      warning: 'text-yellow-400',
      error: 'text-red-400',
      info: 'text-blue-400'
    };
    return styles[type] || styles.info;
  }


  createUnlockRequirements(floor) {
    const container = document.createElement('div');
    const isUnlocked = this.canAccessFloor(floor);
    
    const title = document.createElement('div');
    title.innerHTML = `
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        ${isUnlocked ? 
          '<path d="M8 11V7a4 4 0 0 1 8 0v4"/><path d="M12 15v3"/><rect x="4" y="11" width="16" height="11" rx="2" ry="2"/>' : 
          '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'}
      </svg>
      <span class="font-semibold">${isUnlocked ? '접근 가능' : '접근 제한'}</span>
    `;

    const requirements = document.createElement('ul');
    requirements.className = 'list-disc list-inside space-y-1 mt-2';
    
    if (floor === '7') {
      requirements.innerHTML = '<li>시작 구역입니다. 제한 없이 접근할 수 있습니다.</li>';
    } else {
      const floorRequirements = {
        '6': ['필요 아이템: 모스 부호 기록', '필요 단서: 망원경 신호 발견'],
        '5': ['필요 아이템: 비상구 접근 권한, 작은 열쇠', '수집한 단서 3개 이상 필요'],
        '4': ['필요 아이템: 비상 열쇠, 수상한 지문', '수집한 단서 5개 이상 필요']
      };
      
      requirements.innerHTML = floorRequirements[floor]
        .map(req => `<li>${req}</li>`)
        .join('');
    }

    container.appendChild(title);
    container.appendChild(requirements);
    return container;
  }



  renderFloorSelection() {
    const floorSelectionContainer = document.getElementById('floor-selection');
    floorSelectionContainer.innerHTML = '';

    Object.entries(cruiseData.floors).forEach(([floorNumber, floor]) => {
      const floorCard = this.createFloorCard(floorNumber, floor);
      floorSelectionContainer.appendChild(floorCard);
    });
  }

  createFloorCard(floorNumber, floor) {
    const card = document.createElement('div');
    card.className = `floor-card cursor-pointer ${this.selectedFloor === floorNumber ? 'selected' : ''}`;
    card.dataset.floor = floorNumber;

    const title = document.createElement('h3');
    title.className = 'text-title';
    title.textContent = `${floorNumber}층 - ${floor.name}`;

    const description = document.createElement('p');
    description.className = 'text-description mt-2';
    description.textContent = floor.description;

    card.appendChild(title);
    card.appendChild(description);

    card.addEventListener('click', () => this.selectFloor(floorNumber));

    return card;
  }

  canAccessFloor(floorNumber) {
    const condition = floorUnlockConditions[floorNumber];
    return !condition || condition(this.collectedClues, this.inventory);
  }

  selectFloor(floorNumber) {
    if (!this.canAccessFloor(floorNumber)) {
      this.showMessage(`${floorNumber}층에 접근하기 위한 조건을 충족하지 못했습니다.`, 'warning');
      return;
    }

    this.selectedFloor = floorNumber;
    this.selectedLocation = null;
    
    document.querySelectorAll('.floor-card').forEach(card => {
      card.classList.remove('selected');
    });

    const selectedCard = document.querySelector(`.floor-card[data-floor="${floorNumber}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }

    this.renderLocations();
    this.showMessage(`${floorNumber}층으로 이동했습니다.`, 'info');
  }

  renderLocations() {
    const locationsContainer = document.getElementById('locations-container');
    locationsContainer.innerHTML = '';

    // 선택된 층의 위치들 렌더링
    const floorLocations = cruiseData.floors[this.selectedFloor].locations;
    Object.entries(floorLocations).forEach(([locationId, location]) => {
      const locationCard = this.createLocationCard(locationId, location);
      locationsContainer.appendChild(locationCard);
    });
  }

  createLocationCard(locationId, location) {
    const card = document.createElement('div');
    card.className = `location-card cursor-pointer ${
      this.unlockedLocations.includes(locationId) 
        ? '' 
        : 'locked'
    }`;
    card.dataset.location = locationId;

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center';

    const title = document.createElement('h4');
    title.className = 'text-title';
    title.textContent = location.name;

    const lockIcon = document.createElement('span');
    lockIcon.textContent = this.unlockedLocations.includes(locationId) ? 'open' : 'lock';

    header.appendChild(title);
    header.appendChild(lockIcon);

    const description = document.createElement('p');
    description.className = 'text-description mt-2';
    description.textContent = location.description;

    card.appendChild(header);
    card.appendChild(description);

    card.addEventListener('click', () => this.selectLocation(locationId, location));

    return card;
  }

  selectLocation(locationId, location) {
    // 위치 접근 권한 확인
    if (!this.unlockedLocations.includes(locationId)) {
      // 잠긴 위치의 해금 조건 확인
      if (location.unlockCondition && location.unlockCondition(this.collectedClues)) {
        this.unlockedLocations.push(locationId);
        
        // 새로운 단서 추가
        if (location.clues) {
          this.collectedClues.push(...location.clues);
        }

        this.showMessage(`${location.name} 위치가 해금되었습니다!`, 'success');
      } else {
        this.showMessage('이 위치에 접근할 수 없습니다. 더 많은 단서가 필요합니다.', 'warning');
        return;
      }
    }

    this.selectedLocation = locationId;
    this.renderInteractions(location);
    this.updateCluesAndInventory();
  }

  renderInteractions(location) {
    const interactionsContainer = document.getElementById('interactions-container');
    interactionsContainer.innerHTML = '';

    location.interactions.forEach(interaction => {
      const interactionCard = this.createInteractionCard(interaction);
      interactionsContainer.appendChild(interactionCard);
    });
  }

  createInteractionCard(interaction) {
    const card = document.createElement('div');
    card.className = 'interaction-card cursor-pointer';

    const title = document.createElement('h5');
    title.className = 'text-title';
    title.textContent = interaction.name;

    const description = document.createElement('p');
    description.className = 'text-description mt-2';

    if (interaction.requiresClue) {
      description.textContent = `필요 아이템: ${interaction.requiresClue}`;
    }

    card.appendChild(title);
    card.appendChild(description);

    card.addEventListener('click', () => this.performInteraction(interaction));

    return card;
  }

  performInteraction(interaction) {
    // 필요 아이템 확인
    if (interaction.requiresClue && !this.inventory.includes(interaction.requiresClue)) {
        this.showMessage(`${interaction.requiresClue}가 필요합니다.`, 'warning');
        return;
    }

    // 새 아이템 획득 (인벤토리 제한 체크)
    if (interaction.givesItem) {
        if (this.inventory.length >= this.maxInventorySize) {
            this.showMessage(`인벤토리가 가득 찼습니다! 필요 없는 아이템을 버리세요.`, 'error');
            return;
        }
        if (!this.inventory.includes(interaction.givesItem)) {
            this.inventory.push(interaction.givesItem);
            this.showMessage(`새로운 아이템 획득: ${interaction.givesItem}`, 'success');
        }
    }

    // 단서 획득
    if (interaction.givesClue && !this.collectedClues.includes(interaction.givesClue)) {
        this.collectedClues.push(interaction.givesClue);
        this.showMessage(`새로운 단서를 발견했습니다: ${interaction.givesClue}`, 'info');
    }

    // 상호작용 결과 표시
    this.showMessage(interaction.result);

    // UI 업데이트
    this.updateCluesAndInventory();
}

updateCluesAndInventory() {
  // 단서 목록 업데이트
  const cluesList = document.getElementById('clues-list');
  cluesList.innerHTML = '';

  if (this.collectedClues.length === 0) {
      const noCluesItem = document.createElement('li');
      noCluesItem.className = 'text-description';
      noCluesItem.textContent = '아직 단서를 찾지 못했습니다.';
      cluesList.appendChild(noCluesItem);
  } else {
      this.collectedClues.forEach(clue => {
          const clueItem = document.createElement('li');
          clueItem.className = 'text-description cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors';
          clueItem.textContent = clue;

          // 단서 클릭 이벤트 추가
          clueItem.addEventListener('click', () => this.createClueAnalysisUI(clue));

          cluesList.appendChild(clueItem);
      });
  }

  // 인벤토리 목록 업데이트
  const inventoryList = document.getElementById('inventory-list');
  inventoryList.innerHTML = '';

  if (this.inventory.length === 0) {
      const noItemsItem = document.createElement('li');
      noItemsItem.className = 'text-description';
      noItemsItem.textContent = '아직 아이템을 찾지 못했습니다.';
      inventoryList.appendChild(noItemsItem);
  } else {
      this.inventory.forEach((item, index) => {
          const itemContainer = document.createElement('div');
          
          const itemElement = document.createElement('span');
          itemElement.className = 'text-description cursor-pointer';
          itemElement.textContent = item;
          
          // 아이템 정보 표시
          itemElement.addEventListener('click', () => this.showMessage(`아이템 정보: ${item}`, 'info'));

          const deleteButton = document.createElement('button');
          deleteButton.className = 'delete-button bg-red-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center ml-4 hover:bg-red-700 transition';
          deleteButton.textContent = '✕';
          deleteButton.addEventListener('click', () => this.dropItem(index));

          itemContainer.appendChild(itemElement);
          itemContainer.appendChild(deleteButton);
          inventoryList.appendChild(itemContainer);
      });
  }
}

// 아이템 삭제 함수
dropItem(index) {
  const removedItem = this.inventory.splice(index, 1);
  this.showMessage(`아이템을 버렸습니다: ${removedItem}`, 'warning');
  this.updateCluesAndInventory();
}

showMessage(message, type = 'info') {
  const gameContainer = document.querySelector('.game-container');

  // 메시지 로그 창이 없다면 생성
  let messageContainer = document.querySelector('.toast-message-container');
  if (!messageContainer) {
      messageContainer = document.createElement('div');
      messageContainer.className = 'toast-message-container';
      gameContainer.appendChild(messageContainer);
  }

  // 메시지 요소 만들기
  const messageItem = document.createElement('div');
  messageItem.className = `message-item ${type === 'success' ? 'bg-green-500' : 
      type === 'warning' ? 'bg-yellow-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-blue-500'}`;
  messageItem.textContent = message;

  // 메시지 추가
  messageContainer.appendChild(messageItem);

  // 메시지가 5개 이상이면 오래된 메시지 제거
  const messages = messageContainer.querySelectorAll('.message-item');
  if (messages.length > 5) {
      messages[0].remove();
  }

  // 스크롤을 맨 아래로 이동
  messageContainer.scrollTop = messageContainer.scrollHeight;
}



createInteractionCard(interaction) {
  const card = document.createElement('div');
  card.className = 'interaction-card cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors';

  const title = document.createElement('h5');
  title.textContent = interaction.name;

  const description = document.createElement('p');
  description.className = 'text-description text-sm';

  if (interaction.requiresClue) {
      description.textContent = `필요 아이템: ${interaction.requiresClue}`;
  }

  card.appendChild(title);
  card.appendChild(description);

  // 퍼즐 관련 상호작용 처리 추가
  card.addEventListener('click', () => {
      if (interaction.puzzle) {
          this.createPuzzleAttemptUI(interaction.puzzle);
      } else {
          this.performInteraction(interaction);
      }
  });

  return card;
}
}

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
  const game = new CruiseExploration();
});