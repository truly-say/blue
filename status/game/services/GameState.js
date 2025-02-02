// services/GameState.js
import { floorData } from '../constants/cruiseData.js';
import { MessageType } from '../constants/gameTypes.js';
import { GameMessages } from '../constants/messages.js';
import { helpers } from '../utils/helpers.js';

export class GameState {
  constructor() {
    this.listeners = new Map();
    this.initializeState();
  }

  // 상태 초기화 메서드
  initializeState() {
    // 기본 상태 설정
    this.selectedFloor = null;
    this.selectedLocation = null;
    this.inventory = [];
    this.maxInventorySize = 10;
    this.unlockedFloors = ['7'];
    this.unlockedLocations = new Set(['restaurant', 'observatory', 'deck7', 'bar']);
    this.completedInteractions = new Set();
    this.acquiredItems = new Set();

    // localStorage 초기화
    this.clearStorage();
    
    // 이벤트 발생
    this.notify('inventoryChanged', this.inventory);
  }

  // localStorage 완전 초기화
  clearStorage() {
    try {
      localStorage.removeItem('gameState');
      localStorage.removeItem('cruiseGameSave');
      localStorage.removeItem('inventory');
      localStorage.removeItem('acquiredItems');
      localStorage.removeItem('unlockedFloors');
      localStorage.removeItem('unlockedLocations');
      localStorage.removeItem('completedInteractions');
    } catch (e) {
      console.error('로컬 스토리지 초기화 실패:', e);
    }
  }

  // 게임 리셋 메서드
  resetGame() {
    this.initializeState();
    this.notify('gameReset', null);
    return {
      success: true,
      message: '게임이 초기화되었습니다.'
    };
  }

  // 이벤트 리스너 관련 메서드
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  notify(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // 아이템 관리 메서드
  addItem(item) {
    if (this.inventory.length >= this.maxInventorySize) {
      return false;
    }
    if (!this.acquiredItems.has(item)) {
      this.inventory.push(item);
      this.acquiredItems.add(item);
      this.notify('inventoryChanged', this.inventory);
      this.saveState();
      return true;
    }
    return false;
  }

  dropItem(index) {
    if (index >= 0 && index < this.inventory.length) {
      const item = this.inventory.splice(index, 1)[0];
      this.notify('inventoryChanged', this.inventory);
      return item;
    }
    return null;
  }

  hasItem(itemName) {
    return this.inventory.includes(itemName);
  }

  // 상태 저장 메서드
  saveState() {
    try {
      const state = {
        inventory: this.inventory,
        acquiredItems: Array.from(this.acquiredItems),
        unlockedFloors: this.unlockedFloors,
        unlockedLocations: Array.from(this.unlockedLocations),
        completedInteractions: Array.from(this.completedInteractions)
      };
      localStorage.setItem('gameState', JSON.stringify(state));
    } catch (e) {
      console.error('게임 상태 저장 실패:', e);
    }
  }

  resetState() {
    this.inventory = [];
    this.acquiredItems = new Set();
    this.unlockedFloors = ['7'];
    this.unlockedLocations = new Set(['restaurant', 'observatory', 'deck7', 'bar']);
    this.completedInteractions = new Set();
    this.saveState();
    this.notify('stateReset', null);
  }

  resetGame() {
    // localStorage에서 게임 데이터 완전히 삭제
    localStorage.removeItem('gameState');
    localStorage.removeItem('cruiseGameSave');
    
    // 상태 초기화
    this.initializeState();
    
    // UI 업데이트를 위한 이벤트 발생
    this.notify('gameReset', null);
    this.notify('inventoryChanged', this.inventory);
    
    return {
      success: true,
      message: '게임이 초기화되었습니다.'
    };
  }

  saveGame() {
    try {
      const state = {
        inventory: this.inventory,
        acquiredItems: Array.from(this.acquiredItems),
        unlockedFloors: this.unlockedFloors,
        unlockedLocations: Array.from(this.unlockedLocations),
        completedInteractions: Array.from(this.completedInteractions),
        selectedFloor: this.selectedFloor,
        selectedLocation: this.selectedLocation
      };
      localStorage.setItem('gameState', JSON.stringify(state));
      return {
        success: true,
        message: '게임이 저장되었습니다.'
      };
    } catch (e) {
      console.error('게임 저장 실패:', e);
      return {
        success: false,
        message: '게임 저장에 실패했습니다.'
      };
    }
  }

   // 자동 저장 제거를 위해 기존 메서드들에서 자동 saveState() 호출 부분 제거
   addItem(item) {
    if (this.inventory.length >= this.maxInventorySize) {
      return false;
    }
    if (!this.acquiredItems.has(item)) {
      this.inventory.push(item);
      this.acquiredItems.add(item);
      this.notify('inventoryChanged', this.inventory);
      return true;
    }
    return false;
  }


  hasItem(itemName) {
    return this.inventory.includes(itemName);
  }

  // 층 선택 및 관리
  selectFloor(floorNumber) {
    if (!this.unlockedFloors.includes(floorNumber) && !helpers.canAccessFloor(floorNumber, this.inventory)) {
      const messages = {
        '6': "망원경으로 본 신호의 의미를 파악하고, 수상한 메모를 찾아야 할 것 같다.",
        '5': "작은 열쇠가 필요해 보인다.",
        '4': "비상 열쇠가 있어야 접근할 수 있을 것 같다.",
        '3': "미로 열쇠를 찾아야 들어갈 수 있을 것 같다."
      };

      return {
        success: false,
        message: `지금은 이 층에 갈 수 없을 것 같다. ${messages[floorNumber] || ''}`
      };
    }

    if (!this.unlockedFloors.includes(floorNumber)) {
      this.unlockedFloors.push(floorNumber);
      this.saveState();
    }

    this.selectedFloor = floorNumber;
    this.selectedLocation = null;
    this.notify('floorChanged', floorNumber);
    
    return {
      success: true,
      message: `${floorNumber}층으로 이동했습니다.`
    };
  }

  // 위치 선택 및 관리
  selectLocation(locationId) {
    if (!this.selectedFloor) {
      return {
        success: false,
        message: '층을 먼저 선택해주세요.'
      };
    }

    const currentFloor = floorData[this.selectedFloor];
    const location = currentFloor?.locations[locationId];
    
    if (!location) {
      return {
        success: false,
        message: '존재하지 않는 장소입니다.'
      };
    }

    if (location.isLocked) {
      if (location.unlockRequirement && !this.hasItem(location.unlockRequirement)) {
        return {
          success: false,
          message: `이 장소에 들어가려면 ${location.unlockRequirement}이(가) 필요합니다.`
        };
      }
      this.unlockedLocations.add(locationId);
      this.saveState();
    }

    this.selectedLocation = locationId;
    this.notify('locationChanged', locationId);
    
    return {
      success: true,
      message: `${location.name}에 도착했습니다.`
    };
  }

  // 상호작용 처리
  handleInteraction(interaction) {
    const interactionId = `${this.selectedFloor}-${this.selectedLocation}-${interaction.name}`;
    
    if (this.completedInteractions.has(interactionId)) {
      return {
        success: false,
        message: '이미 조사한 곳입니다.'
      };
    }

    if (interaction.requiresItem && !this.hasItem(interaction.requiresItem)) {
      return {
        success: false,
        message: `${interaction.requiresItem}이(가) 필요합니다.`
      };
    }

    if (interaction.givesItem && !this.acquiredItems.has(interaction.givesItem)) {
      if (this.inventory.length >= this.maxInventorySize) {
        return {
          success: false,
          message: '인벤토리가 가득 찼습니다.'
        };
      }
      
      const addedSuccessfully = this.addItem(interaction.givesItem);
      if (!addedSuccessfully) {
        return {
          success: false,
          message: '아이템을 획득할 수 없습니다.'
        };
      }
    }

    this.completedInteractions.add(interactionId);
    this.saveState();

    return {
      success: true,
      message: interaction.result,
      givesItem: interaction.givesItem && !this.acquiredItems.has(interaction.givesItem) ? interaction.givesItem : null,
      givesClue: interaction.givesClue
    };
  }

  // 접근 가능 여부 확인
  canAccessLocation(locationId) {
    const location = floorData[this.selectedFloor]?.locations[locationId];
    if (!location) return false;
    
    if (location.isLocked && location.unlockRequirement) {
      return this.hasItem(location.unlockRequirement);
    }
    
    return true;
  }
}