// utils/helpers.js
import { floorData } from '../constants/cruiseData.js';
import { MessageType } from '../constants/gameTypes.js';

export const helpers = {
  // 층 접근 가능 여부 확인
  canAccessFloor(floorNumber, inventory = []) {
    const floor = floorData[floorNumber];
    if (!floor) return false;
    if (!floor.unlockCondition) return true;
    return floor.unlockCondition(inventory);
  },

  // 위치 접근 가능 여부 확인
  canAccessLocation(location, inventory = []) {
    if (!location.isLocked) return true;
    if (!location.unlockRequirement) return false;
    return inventory.includes(location.unlockRequirement);
  },

  // 상호작용 수행 가능 여부 확인
  canPerformInteraction(interaction, inventory = []) {
    if (!interaction.requiresItem) return true;
    return inventory.includes(interaction.requiresItem);
  },

  // 메시지 요소 생성
  createMessage(message, type = MessageType.INFO) {
    const element = document.createElement('div');
    element.className = `message-item ${type}`;
    element.textContent = message;
    return element;
  },

  // 로컬 스토리지에 게임 상태 저장
  saveGameState(gameState) {
    const saveData = {
      inventory: gameState.inventory,
      unlockedFloors: gameState.unlockedFloors,
      unlockedLocations: Array.from(gameState.unlockedLocations)
    };
    localStorage.setItem('cruiseGameSave', JSON.stringify(saveData));
    return true;
  },

  // 로컬 스토리지에서 게임 상태 불러오기
  loadGameState() {
    const savedData = localStorage.getItem('cruiseGameSave');
    if (!savedData) return null;
    
    try {
      const data = JSON.parse(savedData);
      data.unlockedLocations = new Set(data.unlockedLocations);
      return data;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }
};