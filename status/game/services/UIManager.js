// services/UIManager.js
import { MessageSystem } from './MessageSystem.js';
import { floorData } from '../constants/cruiseData.js';
import { LocationType } from '../constants/gameTypes.js'; 


export class UIManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.messageSystem = new MessageSystem();
    this.gameState.setMessageSystem(this.messageSystem);
    
    // DOM이 로드된 후 UI 초기화
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupUI());
    } else {
      this.setupUI();
    }
  }

  setupUI() {
    this.createGameContainer();
    this.setupEventListeners();
    this.renderInitialState();
  }
  
  renderInitialState() {
    this.renderFloors();
    this.renderLocations();
    this.renderInventory();
    this.messageSystem.showMessage('게임을 시작합니다.', 'info');
  }

  createGameContainer() {
    const existingContainer = document.querySelector('.game-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    const container = document.createElement('div');
    container.className = 'game-container';
    
    container.innerHTML = `
      <div class="game-content">
        <div class="current-floor">
          <h2 class="floor-title"></h2>
          <p class="floor-description"></p>
        </div>
        <div id="locations-container" class="locations-container"></div>
      </div>
      <div class="game-sidebar">
        <div class="message-log-container">
          <div class="message-log-header">
            <h3>메시지 로그</h3>
            <button class="clear-log-button" data-action="clear-messages">지우기</button>
          </div>
          <div class="messages-container"></div>
        </div>
        <div id="inventory-panel" class="inventory-panel">
          <h3>인벤토리</h3>
          <div id="inventory-list" class="inventory-list"></div>
        </div>
        <div class="game-controls">
          <button id="saveGame" class="save-button">저장하기</button>
          <button id="resetGame" class="reset-button">초기화</button>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    
    // 메시지 로그 컨테이너 참조 설정
    const messagesContainer = container.querySelector('.messages-container');
    if (this.messageSystem) {
      this.messageSystem.setContainer(messagesContainer);
    }
  }

  updateCurrentFloor() {
    const floorTitle = document.querySelector('.floor-title');
    const floorDescription = document.querySelector('.floor-description');
    const currentFloor = floorData[this.gameState.selectedFloor];

    if (floorTitle && floorDescription && currentFloor) {
      floorTitle.textContent = `${this.gameState.selectedFloor}층 - ${currentFloor.name}`;
      floorDescription.textContent = currentFloor.description;
    }
  }

  initializeUI() {
    // 초기 층 선택
    this.gameState.selectFloor(this.gameState.selectedFloor);
    
    // UI 업데이트
    this.updateUI();
    
    // 시작 메시지 표시
    this.gameState.messageSystem.showMessage('크루즈 조사를 시작합니다.', 'info');
  }

  renderFloors() {
    const container = document.getElementById('floor-selection');
    if (!container) return;

    container.innerHTML = Object.entries(floorData)
      .map(([number, floor]) => {
        const isUnlocked = this.gameState.unlockedFloors.includes(number);
        const isSelected = this.gameState.selectedFloor === number;
        return `
          <div class="floor-card ${isSelected ? 'selected' : ''} ${isUnlocked ? '' : 'locked'}"
               data-action="select-floor"
               data-id="${number}">
            <h3>${number}층 - ${floor.name}</h3>
            <p>${floor.description}</p>
          </div>
        `;
      })
      .join('');
  }


  renderLocations() {
    const container = document.getElementById('locations-container');
    if (!container || !this.gameState.selectedFloor) return;

    const floor = window.gameData[this.gameState.selectedFloor];
    if (!floor) return;

    // 현재 층 정보 업데이트
    const floorTitle = document.querySelector('.floor-title');
    const floorDescription = document.querySelector('.floor-description');
    
    if (floorTitle && floorDescription) {
      floorTitle.textContent = `${this.gameState.selectedFloor}층 - ${floor.name}`;
      floorDescription.textContent = floor.description;
    }

    // 층 이동 선택지 추가
    const stairsHtml = this.renderStairsOptions();

    // 장소 목록 렌더링
    container.innerHTML = stairsHtml + Object.entries(floor.locations)
      .map(([id, location]) => {
        const isUnlocked = !location.isLocked || this.gameState.unlockedLocations.has(id);
        const isSelected = this.gameState.selectedLocation === id;
        const isStairs = location.type === window.gameTypes.LocationType.STAIRS;
        
        return `
          <div class="location-card ${isSelected ? 'selected' : ''} ${isStairs ? 'stairs' : ''} ${isUnlocked ? '' : 'locked'}"
               data-action="select-location"
               data-id="${id}">
            <h4>${location.name}</h4>
            <p>${location.description}</p>
            ${isUnlocked && isSelected ? this.renderInteractionsList(location) : ''}
          </div>
        `;
      })
      .join('');
  }

  renderStairsOptions() {
    const currentFloor = parseInt(this.gameState.selectedFloor);
    const possibleFloors = Object.keys(window.gameData).map(Number);
    const accessibleFloors = possibleFloors.filter(floor => 
      this.gameState.unlockedFloors.includes(floor.toString()));

    const stairsHtml = [];
    
    if (accessibleFloors.includes(currentFloor + 1)) {
      stairsHtml.push(`
        <div class="location-card stairs" data-action="select-floor" data-id="${currentFloor + 1}">
          <h4>위층으로</h4>
          <p>${currentFloor + 1}층으로 이동할 수 있습니다.</p>
        </div>
      `);
    }

    if (accessibleFloors.includes(currentFloor - 1)) {
      stairsHtml.push(`
        <div class="location-card stairs" data-action="select-floor" data-id="${currentFloor - 1}">
          <h4>아래층으로</h4>
          <p>${currentFloor - 1}층으로 이동할 수 있습니다.</p>
        </div>
      `);
    }

    return stairsHtml.join('');
  }

  renderInteractionsList(location) {
    if (!location.interactions) return '';
    
    return `
      <div class="interactions-list">
        ${location.interactions.map(interaction => {
          const interactionId = `${this.gameState.selectedFloor}-${this.gameState.selectedLocation}-${interaction.name}`;
          const isCompleted = this.gameState.completedInteractions.has(interactionId);
          const canInteract = !isCompleted && (!interaction.requiresItem || 
            this.gameState.hasItem(interaction.requiresItem));
          
          return `
            <button class="interaction-button ${isCompleted ? 'completed' : ''}"
                    data-action="perform-interaction"
                    data-id="${interaction.name}"
                    ${canInteract ? '' : 'disabled'}>
              ${interaction.name}
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  handleInteraction(interactionId) {
    const location = this.getCurrentLocation();
    if (!location) return;

    const interaction = location.interactions.find(i => i.name === interactionId);
    if (!interaction) return;

    // 계단 이동 처리
    if (interaction.moveToFloor) {
      const result = this.gameState.selectFloor(interaction.moveToFloor);
      this.messageSystem.showMessage(result.message, result.success ? 'success' : 'warning');
      if (result.success) {
        this.updateCurrentFloor();
        this.updateUI();
      }
      return;
    }

    // 일반 상호작용 처리
    const result = this.gameState.handleInteraction(interaction);
    this.messageSystem.showMessage(result.message, result.success ? 'success' : 'warning');
    if (result.success) {
      this.updateUI();
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
      const floorData = window.gameData?.[this.gameState.selectedFloor];
      return floorData?.locations?.[this.gameState.selectedLocation];
    }


  renderInventory() {
    const container = document.getElementById('inventory-list');
    if (!container) return;

    if (this.gameState.inventory.length === 0) {
      container.innerHTML = '<p class="empty-inventory">인벤토리가 비어있습니다.</p>';
      return;
    }

    container.innerHTML = this.gameState.inventory
      .map((item, index) => `
        <div class="inventory-item">
          <span class="item-name">${item}</span>
          <div class="item-buttons">
            <button class="item-action-btn"
                    data-action="use-item"
                    data-index="${index}">
              사용
            </button>
          </div>
        </div>
      `)
      .join('');
  }

  // services/UIManager.js에 추가
  setupEventListeners() {
    // 클릭 이벤트 위임
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (target) {
        const action = target.dataset.action;
        const id = target.dataset.id;
  
        switch (action) {
          case 'select-floor':
            this.handleFloorSelection(id);
            break;
          case 'select-location':
            this.handleLocationSelection(id);
            break;
          case 'perform-interaction':
            this.handleInteraction(id);
            break;
          case 'use-item':
            const itemIndex = parseInt(target.dataset.index);
            this.handleItemUse(itemIndex);
            break;
        }
      }
  
      // 인벤토리 아이템 클릭 처리
      const inventoryItem = e.target.closest('.inventory-item');
      if (inventoryItem && this.gameState.itemModal) {
        const index = parseInt(inventoryItem.dataset.index);
        const item = this.gameState.inventory[index];
        if (item) {
          this.gameState.itemModal.showModal(item, index);
        }
      }
    });
  
    // 저장 버튼 이벤트
    const saveButton = document.getElementById('saveGame');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        const result = this.gameState.saveGame();
        this.gameState.messageSystem.showMessage(result.message, result.success ? 'success' : 'error');
      });
    }
  
    // 초기화 버튼 이벤트
    const resetButton = document.getElementById('resetGame');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (confirm('게임을 초기화하시겠습니까? 모든 진행상황이 삭제됩니다.')) {
          const result = this.gameState.resetGame();
          this.gameState.messageSystem.showMessage(result.message, 'info');
          this.updateUI();
        }
      });
    }
  }

renderInventory() {
  const container = document.getElementById('inventory-list');
  if (!container) return;

  if (this.gameState.inventory.length === 0) {
    container.innerHTML = '<p class="empty-inventory">인벤토리가 비어있습니다.</p>';
    return;
  }

  container.innerHTML = this.gameState.inventory
    .map((item, index) => `
      <div class="inventory-item" data-index="${index}">
        <span class="item-name">${item}</span>
        <div class="item-icons">
          <span class="info-icon">ℹ️</span>
        </div>
      </div>
    `)
    .join('');
}

  handleClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const id = target.dataset.id;

    switch (action) {
      case 'select-floor':
        this.handleFloorSelection(id);
        break;
      case 'select-location':
        this.handleLocationSelection(id);
        break;
      case 'perform-interaction':
        this.handleInteraction(id);
        break;
      case 'use-item':
        const itemIndex = parseInt(target.dataset.index);
        this.handleItemUse(itemIndex);
        break;
    }
  }

  handleFloorSelection(floorId) {
    const result = this.gameState.selectFloor(floorId);
    this.messageSystem.showMessage(result.message, result.success ? 'success' : 'warning');
    if (result.success) {
      this.updateUI();
    }
  }

  handleLocationSelection(locationId) {
    const result = this.gameState.selectLocation(locationId);
    this.messageSystem.showMessage(result.message, result.success ? 'success' : 'warning');
    if (result.success) {
      this.updateUI();
    }
  }

  async handleInteraction(interactionId) {
    const location = this.getCurrentLocation();
    if (!location) return;
  
    const interaction = location.interactions.find(i => i.name === interactionId);
    if (!interaction) return;
  
    const result = await this.gameState.handleInteraction(interaction);
    if (result.message) {
      this.gameState.messageSystem.showMessage(result.message, result.success ? 'success' : 'warning');
    }
    
    if (result.success) {
      this.updateUI();
    }
  }
  handleItemUse(itemIndex) {
    const item = this.gameState.inventory[itemIndex];
    if (!item) return;

    const result = this.gameState.useItem(item);
    this.messageSystem.showMessage(result.message, result.success ? 'success' : 'warning');
    if (result.success) {
      this.updateUI();
    }
  }

  updateUI() {
    this.updateCurrentFloor();
    this.renderLocations();
    this.renderInventory();
  }
}