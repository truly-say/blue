// components/Inventory.js
export class Inventory {
  constructor(gameState) {
    this.gameState = gameState;
    this.element = this.createElement();
    
    // 이벤트 리스너 설정
    this.gameState.on('inventoryChanged', () => this.update());
  }

  createElement() {
    const container = document.createElement('div');
    container.className = 'inventory-container';
    
    container.innerHTML = `
      <h3 class="inventory-title">인벤토리 (${this.gameState.inventory.length}/${this.gameState.maxInventorySize})</h3>
      <div class="inventory-grid">
        ${this.createItemSlots()}
      </div>
    `;

    return container;
  }

  createItemSlots() {
    const slots = [];
    
    // 아이템 슬롯 생성
    for (let i = 0; i < this.gameState.maxInventorySize; i++) {
      const item = this.gameState.inventory[i];
      slots.push(`
        <div class="inventory-slot ${item ? 'filled' : 'empty'}" data-slot="${i}">
          ${item ? `
            <div class="item">
              <span class="item-name">${item}</span>
              <button class="drop-button" data-action="drop-item" data-id="${i}" aria-label="아이템 삭제">×</button>
            </div>
          ` : ''}
        </div>
      `);
    }

    return slots.join('');
  }

  setupDropButtons() {
    const dropButtons = this.element.querySelectorAll('.drop-button');
    dropButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const slotIndex = parseInt(button.dataset.id);
        this.gameState.dropItem(slotIndex);
      });
    });
  }

  update() {
    const newElement = this.createElement();
    this.element.replaceWith(newElement);
    this.element = newElement;
    this.setupDropButtons();
  }
}