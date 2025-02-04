// services/GameState.js
import { ItemModal } from '../components/ItemModal.js';
import { ChoiceManager } from './ChoiceManager.js';
import { UnlockManager } from './UnlockManager.js';
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
    this.unlockedSpecial = new Set();
    this.interactionHistory = new Map();
  }

  initializeManagers() {
    this.itemModal = new ItemModal(this);
    this.choiceManager = new ChoiceManager(this);
    this.unlockManager = new UnlockManager(this);
  }

  setMessageSystem(messageSystem) {
    this.messageSystem = messageSystem;
  }

  setUIManager(uiManager) {
    this.uiManager = uiManager;
  }

  hasItem(itemName) {
    return this.inventory.includes(itemName);
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
        this.unlockedSpecial = new Set(state.unlockedSpecial || []);
        if (state.interactionHistory) {
          this.interactionHistory = new Map(state.interactionHistory);
        }
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
        completedInteractions: Array.from(this.completedInteractions),
        unlockedSpecial: Array.from(this.unlockedSpecial),
        interactionHistory: Array.from(this.interactionHistory)
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

  selectFloor(floorNumber) {
    const floor = floorData[floorNumber];
    if (!floor) {
      return { success: false, message: '잘못된 층입니다.' };
    }

    if (!this.unlockedFloors.includes(floorNumber)) {
      if (this.unlockManager) {
        if (!this.unlockManager.canUnlock('floor', floorNumber)) {
          return {
            success: false,
            message: this.unlockManager.getUnlockRequirements('floor', floorNumber)
          };
        }
        this.unlockedFloors.push(floorNumber);
      }
    }

    this.selectedFloor = floorNumber;
    this.selectedLocation = null;

    return { success: true, message: `${floorNumber}층으로 이동했습니다.` };
  }


  selectLocation(locationId) {
    if (!this.selectedFloor) {
      return { success: false, message: '층을 먼저 선택해주세요.' };
    }

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
  
  async handleInteraction(interaction) {
    if (!interaction) {
      return { success: false, message: '잘못된 상호작용입니다.' };
    }

    const interactionId = `${this.selectedFloor}-${this.selectedLocation}-${interaction.name}`;
    const currentCount = this.interactionHistory.get(interactionId) || 0;
    
    if (this.completedInteractions.has(interactionId)) {
      return { success: false, message: '더 이상 조사할 만한 게 없습니다.' };
    }

    if (interaction.requiresItem && !this.inventory.includes(interaction.requiresItem)) {
      return {
        success: false,
        message: `${interaction.requiresItem}이(가) 필요합니다.`
      };
    }

    // scripts 배열이 있는지 확인
    if (interaction.scripts) {
      // 현재 카운트에 해당하는 스크립트가 있는지 확인
      if (currentCount < interaction.scripts.length) {
        // 스크립트 메시지 반환
        const message = interaction.scripts[currentCount];
        this.interactionHistory.set(interactionId, currentCount + 1);

        // 마지막 스크립트인 경우 선택지 또는 아이템 획득 처리
        if (currentCount === interaction.scripts.length - 1) {
          if (interaction.choices && interaction.choices[currentCount]) {
            return await this.choiceManager.handleChoice(interaction.choices[currentCount]);
          }
          if (interaction.givesItem) {
            const confirmed = await this.choiceManager.confirmItemAcquisition(interaction.givesItem);
            if (confirmed) {
              this.addItem(interaction.givesItem);
            }
          }
          // 모든 스크립트를 봤으므로 완료 처리
          this.completedInteractions.add(interactionId);
        }

        return { success: true, message };
      }
    }

    this.completedInteractions.add(interactionId);
    return { success: false, message: '더 이상 조사할 만한 게 없습니다.' };
  }

  getCurrentLocation() {
    if (!this.selectedFloor || !this.selectedLocation) return null;
    return floorData[this.selectedFloor]?.locations[this.selectedLocation];
  }

  async addItem(item) {
    if (this.inventory.length >= this.maxInventorySize) {
      this.messageSystem.showMessage('인벤토리가 가득 찼습니다.', 'warning');
      return false;
    }

    const confirmed = await this.choiceManager.confirmItemAcquisition(item);
    if (!confirmed) {
      return false;
    }

    this.inventory.push(item);
    this.messageSystem.showMessage(`${item}을(를) 획득했습니다.`, 'success');
    if (this.uiManager) {
      this.uiManager.updateUI();
    }
    return true;
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
}