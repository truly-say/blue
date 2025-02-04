// services/UnlockManager.js
export class UnlockManager {
    constructor(gameState) {
      this.gameState = gameState;
      this.unlockConditions = new Map();
      this.initializeUnlockConditions();
    }
  
    initializeUnlockConditions() {
      // 층별 해금 조건
      this.unlockConditions.set('floor', {
        '6': () => this.gameState.hasItem('모스 부호 해독'),
        '5': () => this.gameState.hasItem('작은 열쇠'),
        '4': () => this.gameState.hasItem('비상 열쇠'),
        '3': () => this.gameState.hasCompletedInteraction('미로_입구_조사')
      });
  
      // 위치별 해금 조건
      this.unlockConditions.set('location', {
        'locked_room': () => this.gameState.hasItem('작은 열쇠'),
        'secret_passage': () => this.gameState.hasItem('비상 열쇠'),
        'maze_entrance': () => this.gameState.completedInteractions.size >= 5
      });
  
      // 특수 해금 조건
      this.unlockConditions.set('special', {
        'hidden_choice': () => 
          this.gameState.hasItem('수상한 메모') && 
          this.gameState.hasCompletedInteraction('창문_관찰'),
        'true_ending': () => 
          this.gameState.inventory.length >= 5 &&
          this.gameState.completedInteractions.size >= 10
      });
    }
  
    canUnlock(type, id) {
      const condition = this.unlockConditions.get(type)?.[id];
      return condition ? condition() : true;
    }
  
    getUnlockRequirements(type, id) {
      // 해금 조건 설명 반환
      const requirements = {
        'floor': {
          '6': '모스 부호 해독이 필요합니다.',
          '5': '작은 열쇠가 필요합니다.',
          '4': '비상 열쇠가 필요합니다.',
          '3': '미로 입구를 먼저 조사해야 합니다.'
        },
        'location': {
          'locked_room': '작은 열쇠가 필요합니다.',
          'secret_passage': '비상 열쇠가 필요합니다.',
          'maze_entrance': '더 많은 장소를 조사해야 합니다.'
        },
        'special': {
          'hidden_choice': '특정 아이템과 조사가 필요합니다.',
          'true_ending': '더 많은 탐색이 필요합니다.'
        }
      };
  
      return requirements[type]?.[id] || '알 수 없는 조건';
    }
  
    unlockLocation(locationId) {
      if (this.canUnlock('location', locationId)) {
        this.gameState.unlockedLocations.add(locationId);
        return true;
      }
      return false;
    }
  
    unlockFloor(floorNumber) {
      if (this.canUnlock('floor', floorNumber)) {
        this.gameState.unlockedFloors.push(floorNumber);
        return true;
      }
      return false;
    }
  
    checkSpecialUnlocks() {
      // 특수 해금 조건 체크 및 처리
      for (const [id, condition] of Object.entries(this.unlockConditions.get('special') || {})) {
        if (condition() && !this.gameState.unlockedSpecial.has(id)) {
          this.gameState.unlockedSpecial.add(id);
          this.handleSpecialUnlock(id);
        }
      }
    }
  
    handleSpecialUnlock(id) {
      switch (id) {
        case 'hidden_choice':
          this.gameState.messageSystem.showMessage('새로운 선택지가 해금되었습니다!', 'success');
          break;
        case 'true_ending':
          this.gameState.messageSystem.showMessage('진엔딩 조건이 충족되었습니다.', 'success');
          break;
      }
    }
  }