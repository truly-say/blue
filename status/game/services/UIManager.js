// services/UIManager.js
import { FloorCard } from '../components/FloorCard.js';
import { LocationCard } from '../components/LocationCard.js';
import { Inventory } from '../components/Inventory.js';
import { MessageSystem } from './MessageSystem.js';
import { floorData } from '../constants/cruiseData.js';
import { GameMessages } from '../constants/messages.js';

export class UIManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.messageSystem = new MessageSystem();
    this.createGameContainer();
    this.initializeUI();
    this.setupEventListeners();
  }

  createGameContainer() {
    const existingContainer = document.getElementById('game-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    const container = document.createElement('div');
    container.id = 'game-container';
    container.className = 'game-container';

    container.innerHTML = `
      <div class="game-content">
        <div id="floor-selection" class="floor-selection"></div>
        <div id="locations-container" class="locations-container"></div>
      </div>
      <div class="game-sidebar">
        <div id="message-container" class="message-container"></div>
        <div class="inventory-panel">
          <h3>인벤토리</h3>
          <div id="inventory-list" class="inventory-list"></div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
  }

  initializeUI() {
    this.renderFloors();
    this.renderInventory();
    this.messageSystem.showMessage('게임을 시작합니다.', 'info');
  }

  renderFloors() {
    const floorSelection = document.getElementById('floor-selection');
    if (!floorSelection) return;

    floorSelection.innerHTML = '';
    
    Object.entries(floorData).forEach(([floorNumber, floor]) => {
      const card = document.createElement('div');
      card.className = 'floor-card';
      card.dataset.action = 'select-floor';
      card.dataset.id = floorNumber;
      
      card.innerHTML = `
        <h3>${floorNumber}층 - ${floor.name}</h3>
        <p>${floor.description}</p>
      `;
      
      floorSelection.appendChild(card);
    });
  }

  renderLocations() {
    const locationsContainer = document.getElementById('locations-container');
    if (!locationsContainer || !this.gameState.selectedFloor) return;

    locationsContainer.innerHTML = '';
    const currentFloor = floorData[this.gameState.selectedFloor];
    
    Object.entries(currentFloor.locations).forEach(([locationId, location]) => {
      const card = document.createElement('div');
      card.className = 'location-card';
      card.dataset.action = 'select-location';
      card.dataset.id = locationId;
      
      card.innerHTML = `
        <h4>${location.name}</h4>
        <p>${location.description}</p>
      `;
      
      locationsContainer.appendChild(card);
    });
  }

  renderInteractions(location) {
    if (!location || !location.interactions) return;
    
    const container = document.createElement('div');
    container.className = 'interactions-container';
    
    location.interactions.forEach(interaction => {
      const button = document.createElement('button');
      button.className = 'interaction-button';
      button.dataset.action = 'perform-interaction';
      button.dataset.id = interaction.name;
      button.textContent = interaction.name;
      
      container.appendChild(button);
    });
    
    // 현재 선택된 위치 카드에 상호작용 추가
    const locationCard = document.querySelector(`.location-card[data-id="${this.gameState.selectedLocation}"]`);
    if (locationCard) {
      // 기존 상호작용 컨테이너 제거
      const existingContainer = locationCard.querySelector('.interactions-container');
      if (existingContainer) {
        existingContainer.remove();
      }
      locationCard.appendChild(container);
    }
  }

  handleInteraction(interactionId, event) {
    // 이벤트 전파 중지
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const currentLocation = this.getCurrentLocation();
    if (!currentLocation) return;

    const interaction = currentLocation.interactions.find(i => i.name === interactionId);
    if (!interaction) return;

    // 이미 수행된 상호작용인지 확인
    if (interaction.performed) {
      this.messageSystem.showMessage('이미 수행한 상호작용입니다.', 'warning');
      return;
    }

    const result = this.gameState.handleInteraction(interaction);
    if (result.success) {
      // 상호작용을 수행했다고 표시
      interaction.performed = true;
      this.messageSystem.showMessage(result.message, 'success');
      if (result.givesItem) {
        this.messageSystem.showMessage(`${result.givesItem}을(를) 획득했습니다.`, 'success');
      }
      this.updateUI();
    } else {
      this.messageSystem.showMessage(result.message, 'warning');
    }
  }

  getCurrentLocation() {
    if (!this.gameState.selectedFloor || !this.gameState.selectedLocation) return null;
    
    const floor = floorData[this.gameState.selectedFloor];
    if (!floor) return null;

    return floor.locations[this.gameState.selectedLocation];
  }

  updateUI() {
    this.renderFloors();
    this.renderLocations();
    this.renderInventory();
  }

  renderInventory() {
    const inventoryList = document.getElementById('inventory-list');
    if (!inventoryList) return;

    inventoryList.innerHTML = '';
    
    if (this.gameState.inventory.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = '인벤토리가 비어있습니다.';
      inventoryList.appendChild(emptyMessage);
    } else {
      this.gameState.inventory.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.textContent = item;
        inventoryList.appendChild(itemElement);
      });
    }
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.dataset.action;
      const id = target.dataset.id;

      // 이벤트 전파 중지
      e.stopPropagation();

      switch (action) {
        case 'select-floor':
          if (this.gameState.selectFloor(id)) {
            this.messageSystem.showMessage(`${id}층으로 이동했습니다.`, 'info');
            this.renderLocations();
          }
          break;

        case 'select-location':
          if (this.gameState.selectLocation(id)) {
            const location = this.getCurrentLocation();
            if (location) {
              this.messageSystem.showMessage(`${location.name}에 도착했습니다.`, 'info');
              this.renderInteractions(location);
            }
          }
          break;

        case 'perform-interaction':
          this.handleInteraction(id);
          break;
      }
    });
  }
}