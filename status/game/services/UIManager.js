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
        <div class="game-controls">
          <button id="saveGame" class="save-button">게임 저장</button>
          <button id="resetGame" class="reset-button">게임 초기화</button>
        </div>
      </div>
    `;


    document.body.appendChild(container);

    // 컨트롤 버튼 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
      .game-controls {
        padding: 1rem;
        margin-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .game-controls button {
        width: 100%;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
        margin-bottom: 0.5rem;
      }
      
      .save-button {
        background-color:rgb(78, 122, 216);
        color: white;
      }
      
      .save-button:hover {
        background-color: #1d4ed8;
      }
      
      .reset-button {
        background-color:rgb(78, 78, 78);
        color: white;
      }
      
      .reset-button:hover {
        background-color:rgb(124, 124, 124);
      }
    `;
    document.head.appendChild(style);
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
    // 이벤트 중복 방지
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  
    const currentLocation = this.getCurrentLocation();
    if (!currentLocation) return;
  
    const interaction = currentLocation.interactions.find(i => i.name === interactionId);
    if (!interaction) return;
  
    const result = this.gameState.handleInteraction(interaction);
    
    if (result.success) {
      this.messageSystem.showMessage(result.message, 'success');
      if (result.givesItem) {
        this.messageSystem.showMessage(`${result.givesItem}을(를) 획득했습니다.`, 'success');
      }
      this.updateUI();
    } else {
      this.messageSystem.showMessage(result.message, 'warning');
    }
  }
  
    clearMessages() {
      this.messageHistory = [];
      const container = document.querySelector('.messages-container');
      if (container) {
        container.innerHTML = '';
      }
    }
  
    // 메시지 로그가 하나만 생성되도록 보장
    initializeContainer() {
      // 기존 메시지 로그 제거
      const existingLogs = document.querySelectorAll('.message-log-container');
      existingLogs.forEach(log => log.remove());
  
      this.createMessageContainer();
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
    
    document.addEventListener('click', (e) => {
      if (e.target.matches('.drop-button')) {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(e.target.dataset.id);
        this.gameState.dropItem(index);
        this.renderInventory();
      }
    });
     // 저장 버튼 이벤트 리스너
     const saveButton = document.getElementById('saveGame');
     if (saveButton) {
       saveButton.addEventListener('click', () => {
         const result = this.gameState.saveGame();
         this.messageSystem.showMessage(result.message, result.success ? 'success' : 'error');
       });
     }
 
     // 초기화 버튼 이벤트 리스너
     const resetButton = document.getElementById('resetGame');
     if (resetButton) {
       resetButton.addEventListener('click', () => {
         if (confirm('정말로 게임을 초기화하시겠습니까? 모든 진행 상황이 삭제됩니다.')) {
           const result = this.gameState.resetGame();
           this.messageSystem.showMessage(result.message, 'info');
           this.updateUI();
         }
       });
     }
 
     // 게임 초기화 이벤트 리스너
     this.gameState.on('gameReset', () => {
       this.updateUI();
     });

    // 게임 초기화 이벤트 리스너
    this.gameState.on('gameReset', () => {
      this.updateUI();
    });
  }

  updateUI() {
    this.renderFloors();
    this.renderLocations();
    this.renderInventory();
  
  }
}