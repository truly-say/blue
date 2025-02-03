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

  initializeState() {
    this.selectedFloor = '7';
    this.selectedLocation = 'restaurant';
    this.inventory = [];
    this.maxInventorySize = 10;
    this.unlockedFloors = ['7'];
    this.unlockedLocations = new Set(['restaurant', 'observatory', 'deck7', 'bar']);
    this.completedInteractions = new Set();
    this.acquiredItems = new Set();
    this.messageHistory = [];

    // localStorage 완전 초기화
    localStorage.removeItem('gameState');
    localStorage.removeItem('cruiseGameSave');
    localStorage.removeItem('completedInteractions');
    localStorage.removeItem('acquiredItems');

    // 이벤트 발생
    this.notify('stateInitialized', null);
  }

  loadSavedState() {
    try {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        const state = JSON.parse(savedState);
        this.selectedFloor = state.selectedFloor;
        this.selectedLocation = state.selectedLocation;
        this.inventory = state.inventory || [];
        this.unlockedFloors = state.unlockedFloors || ['7'];
        this.unlockedLocations = new Set(state.unlockedLocations || ['restaurant', 'observatory', 'deck7', 'bar']);
        this.completedInteractions = new Map(state.completedInteractions || []);
        this.acquiredItems = new Set(state.acquiredItems || []);
        this.messageHistory = state.messageHistory || [];
        
        this.notify('stateLoaded', null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load saved state:', error);
      return false;
    }
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
    // 모든 localStorage 데이터 삭제
    localStorage.clear();
    
    // 상태 초기화
    this.initializeState();
    
    // 메시지 시스템 초기화
    this.messageHistory = [];
    
    // UI 업데이트를 위한 이벤트 발송
    this.notify('gameReset', null);
    
    return {
      success: true,
      message: '게임이 처음 상태로 초기화되었습니다.'
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
    const state = {
      selectedFloor: this.selectedFloor,
      selectedLocation: this.selectedLocation,
      inventory: this.inventory,
      unlockedFloors: this.unlockedFloors,
      unlockedLocations: Array.from(this.unlockedLocations),
      completedInteractions: Array.from(this.completedInteractions),
      acquiredItems: Array.from(this.acquiredItems)
    };
    localStorage.setItem('gameState', JSON.stringify(state));
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

  removeItem(index) {
    if (index >= 0 && index < this.inventory.length) {
      const removedItem = this.inventory.splice(index, 1)[0];
      this.notify('inventoryChanged', this.inventory);
      return removedItem;
    }
    return null;
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
        selectedFloor: this.selectedFloor,
        selectedLocation: this.selectedLocation,
        inventory: this.inventory,
        unlockedFloors: this.unlockedFloors,
        unlockedLocations: Array.from(this.unlockedLocations),
        completedInteractions: Array.from(this.completedInteractions.entries()),
        acquiredItems: Array.from(this.acquiredItems),
        messageHistory: this.messageHistory
      };
      localStorage.setItem('gameState', JSON.stringify(state));
      return {
        success: true,
        message: '게임이 저장되었습니다.'
      };
    } catch (error) {
      console.error('Failed to save game:', error);
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
      console.log('Location not found:', locationId);
      return {
        success: false,
        message: '존재하지 않는 장소입니다.'
      };
    }

    // 601호 특별 처리
    if (locationId === 'room601') {
      if (!this.hasItem('작은 열쇠')) {
        return {
          success: false,
          message: '작은 열쇠가 필요합니다.'
        };
      }
    }

    if (location.isLocked) {
      if (location.unlockRequirement && !this.hasItem(location.unlockRequirement)) {
        return {
          success: false,
          message: `${location.unlockRequirement}이(가) 필요합니다.`
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

  handleInteraction(interaction) {
    if (!interaction || !this.selectedFloor || !this.selectedLocation) {
      console.log('Invalid interaction or location:', {
        floor: this.selectedFloor,
        location: this.selectedLocation,
        interaction: interaction
      });
      return {
        success: false,
        message: '유효하지 않은 상호작용입니다.'
      };
    }

    const interactionId = `${this.selectedFloor}-${this.selectedLocation}-${interaction.name}`;
    
    // 디버깅 로그
    console.log('Handling interaction:', {
      id: interactionId,
      completed: this.completedInteractions.has(interactionId),
      interaction: interaction
    });
    
    // 이미 완료된 상호작용 체크
    if (this.completedInteractions.has(interactionId)) {
      return {
        success: false,
        message: '이미 조사한 곳입니다.'
      };
    }

    // 필요 아이템 체크
    if (interaction.requiresItem && !this.hasItem(interaction.requiresItem)) {
      return {
        success: false,
        message: `${interaction.requiresItem}이(가) 필요합니다.`
      };
    }

    // 인벤토리 공간 체크
    if (interaction.givesItem && !this.acquiredItems.has(interaction.givesItem)) {
      if (this.inventory.length >= this.maxInventorySize) {
        return {
          success: false,
          message: '인벤토리가 가득 찼습니다.'
        };
      }
    }

    // 아이템 획득 처리 (중복 방지)
    if (interaction.givesItem && !this.acquiredItems.has(interaction.givesItem)) {
      this.inventory.push(interaction.givesItem);
      this.acquiredItems.add(interaction.givesItem);
      this.notify('inventoryChanged', this.inventory);
    }

    // 상호작용 완료 표시
    this.completedInteractions.add(interactionId);

    // 상태 저장
    this.saveState();

    return {
      success: true,
      message: interaction.result,
      givesItem: interaction.givesItem && !this.acquiredItems.has(interaction.givesItem) ? interaction.givesItem : null
    };
  }

  // 아이템 사용 메서드 추가
useItem(itemName) {
  const currentLocation = this.getCurrentLocation();
  if (!currentLocation) {
    return {
      success: false,
      message: '아이템을 사용할 수 있는 위치가 아닙니다.'
    };
  }

  // 특정 위치에서의 아이템 사용 로직
  if (currentLocation.unlockRequirement === itemName) {
    this.unlockedLocations.add(this.selectedLocation);
    return {
      success: true,
      message: `${itemName}을(를) 사용하여 ${currentLocation.name}을(를) 열었습니다.`
    };
  }

  return {
    success: false,
    message: '여기서는 이 아이템을 사용할 수 없습니다.'
  };
}

getCurrentLocation() {
  if (!this.selectedFloor || !this.selectedLocation) return null;
  
  const floor = floorData[this.selectedFloor];
  if (!floor) return null;

  return floor.locations[this.selectedLocation];
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