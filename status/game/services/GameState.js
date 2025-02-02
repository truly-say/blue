// services/GameState.js
import { floorData } from '../constants/cruiseData.js';
import { MessageType } from '../constants/gameTypes.js';
import { GameMessages } from '../constants/messages.js';
import { helpers } from '../utils/helpers.js';

export class GameState {
  constructor() {
    this.selectedFloor = null;
    this.selectedLocation = null;
    this.inventory = [];
    this.maxInventorySize = 10;
    this.unlockedFloors = ['7'];
    this.unlockedLocations = new Set(['restaurant', 'observatory', 'deck7', 'bar']);
    this.completedInteractions = new Set();
    this.acquiredItems = new Set(); // 새로 추가: 획득한 아이템 추적
    this.listeners = new Map();
  }

  // 이벤트 관리 메서드들
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

  selectFloor(floorNumber) {
    if (!this.unlockedFloors.includes(floorNumber) && !helpers.canAccessFloor(floorNumber, this.inventory)) {
      let message = "지금은 이 층에 갈 수 없을 것 같다. ";
      switch(floorNumber) {
        case '6':
          message += "망원경으로 본 신호의 의미를 파악하고, 수상한 메모를 찾아야 할 것 같다.";
          break;
        case '5':
          message += "작은 열쇠가 필요해 보인다.";
          break;
        case '4':
          message += "비상 열쇠가 있어야 접근할 수 있을 것 같다.";
          break;
        case '3':
          message += "미로 열쇠를 찾아야 들어갈 수 있을 것 같다.";
          break;
      }
      return {
        success: false,
        message: message
      };
    }

    // 접근 가능하면 해당 층 해금
    if (!this.unlockedFloors.includes(floorNumber)) {
      this.unlockedFloors.push(floorNumber);
    }

    this.selectedFloor = floorNumber;
    this.selectedLocation = null;
    this.notify('floorChanged', floorNumber);
    
    return {
      success: true,
      message: `${floorNumber}층으로 이동했습니다.`
    };
  }

  selectLocation(locationId) {
    if (!this.selectedFloor) return {
      success: false,
      message: '층을 먼저 선택해주세요.'
    };

    const currentFloor = floorData[this.selectedFloor];
    const location = currentFloor.locations[locationId];
    
    if (!location) return {
      success: false,
      message: '존재하지 않는 장소입니다.'
    };


    // 위치가 잠겨있고 해금 조건이 있는 경우
    if (location.isLocked && location.unlockCondition) {
      if (!location.unlockCondition(this.inventory)) {
        return {
          success: false,
          message: '이 장소는 아직 특정 조건을 만족해야 접근할 수 있습니다.'
        };
      }
      // 조건 만족 시 자동으로 해금
      this.unlockedLocations.add(locationId);
    }

    this.selectedLocation = locationId;
    this.notify('locationChanged', locationId);
    
    return {
      success: true,
      message: `${location.name}에 도착했습니다.`
    };
  }

  handleInteraction(interaction) {
    const interactionId = `${this.selectedFloor}-${this.selectedLocation}-${interaction.name}`;
    
    // 이미 완료된 상호작용인지 확인
    if (this.completedInteractions.has(interactionId)) {
      return {
        success: false,
        message: '이미 조사한 곳입니다.'
      };
    }

    // 필요 아이템 확인
    if (interaction.requiresItem && !this.hasItem(interaction.requiresItem)) {
      return {
        success: false,
        message: `${interaction.requiresItem}이(가) 필요합니다.`
      };
    }

    // 인벤토리 공간 확인
    if (interaction.givesItem && !this.acquiredItems.has(interaction.givesItem)) {
      if (this.inventory.length >= this.maxInventorySize) {
        return {
          success: false,
          message: '인벤토리가 가득 찼습니다.'
        };
      }
    }

    // 상호작용 수행 및 아이템 획득
    if (interaction.givesItem && !this.acquiredItems.has(interaction.givesItem)) {
      this.inventory.push(interaction.givesItem);
      this.acquiredItems.add(interaction.givesItem); // 획득한 아이템 기록
      this.notify('inventoryChanged', this.inventory);
    }

    // 상호작용 완료 표시
    this.completedInteractions.add(interactionId);

    // 단서도 획득할 수 있는 경우
    if (interaction.givesClue) {
      this.notify('clueFound', interaction.givesClue);
    }

    return {
      success: true,
      message: interaction.result,
      givesItem: !this.acquiredItems.has(interaction.givesItem) ? interaction.givesItem : null,
      givesClue: interaction.givesClue
    };
  }

  canAccessLocation(locationId) {
    const location = floorData[this.selectedFloor]?.locations[locationId];
    if (!location) return false;
    
    if (location.isLocked && location.unlockCondition) {
      return location.unlockCondition(this.inventory);
    }
    
    return true;
  }

  hasItem(itemName) {
    return this.inventory.includes(itemName);
  }
}