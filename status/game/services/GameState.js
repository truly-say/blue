// services/GameState.js
import { floorData } from '../constants/cruiseData.js';

export class GameState {
  constructor() {
    this.initializeState();
    this.messageSystem = null;
    this.uiManager = null;
    this.loadSavedState();
  }

  initializeState() {
    this.selectedFloor = '7';
    this.selectedLocation = null;
    this.inventory = [];
    this.maxInventorySize = 10;
    this.unlockedFloors = ['7'];
    this.unlockedLocations = new Set(['restaurant', 'observatory']);
    this.completedInteractions = new Set();
  }

  setMessageSystem(messageSystem) {
    this.messageSystem = messageSystem;
  }

  setUIManager(uiManager) {
    this.uiManager = uiManager;
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
        this.unlockedLocations = new Set(state.unlockedLocations || ['restaurant', 'observatory']);
        this.completedInteractions = new Set(state.completedInteractions || []);
      }
    } catch (error) {
      console.error('Failed to load saved state:', error);
    }
  }

  saveGame() {
    try {
      const state = {
        selectedFloor: this.selectedFloor,
        selectedLocation: this.selectedLocation,
        inventory: this.inventory,
        unlockedFloors: this.unlockedFloors,
        unlockedLocations: Array.from(this.unlockedLocations),
        completedInteractions: Array.from(this.completedInteractions)
      };
      localStorage.setItem('gameState', JSON.stringify(state));
      return { success: true, message: '게임이 저장되었습니다.' };
    } catch (error) {
      console.error('Failed to save game:', error);
      return { success: false, message: '게임 저장에 실패했습니다.' };
    }
  }

  resetGame() {
    localStorage.removeItem('gameState');
    this.initializeState();
    if (this.uiManager) {
      this.uiManager.updateUI();
    }
    return { success: true, message: '게임이 초기화되었습니다.' };
  }

  addItem(item) {
    if (this.inventory.length >= this.maxInventorySize) {
      if (this.messageSystem) {
        this.messageSystem.showMessage('인벤토리가 가득 찼습니다.', 'warning');
      }
      return false;
    }

    this.inventory.push(item);
    if (this.messageSystem) {
      this.messageSystem.showMessage(`${item}을(를) 획득했습니다.`, 'success');
    }
    if (this.uiManager) {
      this.uiManager.updateUI();
    }
    return true;
  }

  hasItem(itemName) {
    return this.inventory.includes(itemName);
  }

  removeItem(index) {
    if (index >= 0 && index < this.inventory.length) {
      const removedItem = this.inventory.splice(index, 1)[0];
      if (this.uiManager) {
        this.uiManager.updateUI();
      }
      return removedItem;
    }
    return null;
  }

  selectFloor(floorNumber) {
    const floor = floorData[floorNumber];
    if (!floor) {
      return { success: false, message: '잘못된 층입니다.' };
    }

    if (!this.unlockedFloors.includes(floorNumber)) {
      const requiredItems = {
        '6': ['모스 부호 해독'],
        '5': ['작은 열쇠'],
        '4': ['비상 열쇠'],
        '3': ['미로 열쇠']
      };

      const required = requiredItems[floorNumber];
      if (required && !required.every(item => this.inventory.includes(item))) {
        return {
          success: false,
          message: `이 층은 아직 접근할 수 없습니다. ${required.join(', ')}이(가) 필요합니다.`
        };
      }

      this.unlockedFloors.push(floorNumber);
    }

    this.selectedFloor = floorNumber;
    this.selectedLocation = null;

    return { success: true, message: `${floorNumber}층으로 이동했습니다.` };
  }

  selectLocation(locationId) {
    const floor = floorData[this.selectedFloor];
    if (!floor) {
      return { success: false, message: '잘못된 층입니다.' };
    }

    const location = floor.locations[locationId];
    if (!location) {
      return { success: false, message: '잘못된 위치입니다.' };
    }

    if (location.isLocked && !this.unlockedLocations.has(locationId)) {
      if (location.unlockRequirement && !this.inventory.includes(location.unlockRequirement)) {
        return {
          success: false,
          message: `${location.unlockRequirement}이(가) 필요합니다.`
        };
      }
      this.unlockedLocations.add(locationId);
    }

    this.selectedLocation = locationId;
    return { success: true, message: `${location.name}에 도착했습니다.` };
  }

  // GameState.js의 handleInteraction 메서드 수정
handleInteraction(interaction) {
  if (!interaction) {
    return { success: false, message: '잘못된 상호작용입니다.' };
  }

  const interactionId = `${this.selectedFloor}-${this.selectedLocation}-${interaction.name}`;
  
  if (this.completedInteractions.has(interactionId)) {
    return { success: false, message: '더 이상 둘러볼 게 없는 모양이다.' };
  }

  if (interaction.requiresItem && !this.inventory.includes(interaction.requiresItem)) {
    return {
      success: false,
      message: `${interaction.requiresItem}이(가) 필요합니다.`
    };
  }

  // 층간 이동 처리
  if (interaction.moveToFloor) {
    this.selectedFloor = interaction.moveToFloor;
    this.selectedLocation = null;
    return {
      success: true,
      message: interaction.result,
      moveToFloor: interaction.moveToFloor
    };
  }

  if (interaction.givesItem && this.inventory.length >= this.maxInventorySize) {
    return { success: false, message: '인벤토리가 가득 찼습니다.' };
  }

  if (interaction.givesItem) {
    this.addItem(interaction.givesItem);
  }

  this.completedInteractions.add(interactionId);

  return {
    success: true,
    message: interaction.result,
    givesItem: interaction.givesItem
  };
}

  useItem(itemName) {
    const location = floorData[this.selectedFloor]?.locations[this.selectedLocation];
    if (!location) {
      return { success: false, message: '아이템을 사용할 수 없는 위치입니다.' };
    }

    if (location.unlockRequirement === itemName) {
      this.unlockedLocations.add(this.selectedLocation);
      const itemIndex = this.inventory.indexOf(itemName);
      if (itemIndex !== -1) {
        this.inventory.splice(itemIndex, 1);
      }
      if (this.uiManager) {
        this.uiManager.updateUI();
      }
      return { success: true, message: `${itemName}을(를) 사용하여 잠금을 해제했습니다.` };
    }

    return { success: false, message: '여기서는 이 아이템을 사용할 수 없습니다.' };
  }
}