// components/Inventory.js
export class Inventory {
  constructor(gameState) {
    this.gameState = gameState;
    this.element = this.createElement();
    this.gameState.on('inventoryChanged', () => this.update());
  }

  createElement() {
    const container = document.createElement('div');
    container.className = 'inventory-panel';
    
    container.innerHTML = `
      <h3 class="inventory-title">인벤토리 (${this.gameState.inventory.length}/${this.gameState.maxInventorySize})</h3>
      <div class="inventory-items">
        ${this.createItemsList()}
      </div>
      <div id="itemDetailsModal" class="item-details-modal hidden">
        <div class="modal-content">
          <h4 class="modal-title"></h4>
          <p class="item-description"></p>
          <div class="modal-actions">
            <button class="action-button use-button">사용</button>
            <button class="action-button delete-button">삭제</button>
            <button class="action-button close-button">닫기</button>
          </div>
        </div>
      </div>
    `;

    this.addEventListeners(container);
    return container;
  }

  createItemsList() {
    if (this.gameState.inventory.length === 0) {
      return '<p class="empty-inventory">인벤토리가 비어있습니다.</p>';
    }

    return this.gameState.inventory.map((item, index) => `
      <div class="inventory-item" data-index="${index}">
        <span class="item-name">${item}</span>
        <button class="item-details-btn" data-index="${index}">
          <span class="details-icon">ℹ️</span>
        </button>
      </div>
    `).join('');
  }

  showItemDetails(index) {
    const item = this.gameState.inventory[index];
    const itemDetails = this.getItemDetails(item);
    const modal = this.element.querySelector('#itemDetailsModal');
    const title = modal.querySelector('.modal-title');
    const description = modal.querySelector('.item-description');
    
    title.textContent = item;
    description.textContent = itemDetails.description;

    // 사용 버튼 상태 설정
    const useButton = modal.querySelector('.use-button');
    if (itemDetails.canUse) {
      useButton.style.display = 'block';
      useButton.dataset.index = index;
    } else {
      useButton.style.display = 'none';
    }

    modal.classList.remove('hidden');
    modal.dataset.itemIndex = index;
  }

  getItemDetails(itemName) {
    // 아이템 세부 정보 데이터
    const itemDetails = {
      '작은 열쇠': {
        description: '작은 문을 열 수 있는 열쇠입니다.',
        canUse: true
      },
      '비상 열쇠': {
        description: '비상시에 사용할 수 있는 열쇠입니다.',
        canUse: true
      },
      '수상한 메모': {
        description: '누군가가 남긴 수상한 메모입니다.',
        canUse: false
      },
      // 다른 아이템들...
    };

    return itemDetails[itemName] || {
      description: '상세 정보가 없는 아이템입니다.',
      canUse: false
    };
  }

  addEventListeners(container) {
    // 아이템 세부정보 버튼 클릭
    container.addEventListener('click', (e) => {
      if (e.target.closest('.item-details-btn')) {
        const index = parseInt(e.target.closest('.item-details-btn').dataset.index);
        this.showItemDetails(index);
      }
    });

    // 모달 동작
    const modal = container.querySelector('#itemDetailsModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        const target = e.target;
        const index = parseInt(modal.dataset.itemIndex);

        if (target.classList.contains('close-button')) {
          modal.classList.add('hidden');
        } else if (target.classList.contains('delete-button')) {
          if (confirm('정말로 이 아이템을 삭제하시겠습니까?')) {
            this.gameState.removeItem(index);
            modal.classList.add('hidden');
          }
        } else if (target.classList.contains('use-button')) {
          const item = this.gameState.inventory[index];
          const result = this.gameState.useItem(item);
          if (result.success) {
            this.gameState.messageSystem.showMessage(result.message, 'success');
            modal.classList.add('hidden');
          } else {
            this.gameState.messageSystem.showMessage(result.message, 'warning');
          }
        }
      });

      // 모달 외부 클릭 시 닫기
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }
  }

  update() {
    const newElement = this.createElement();
    this.element.replaceWith(newElement);
    this.element = newElement;
  }
}

/* CSS 추가 필요 */
const style = document.createElement('style');
style.textContent = `
  .item-details-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .item-details-modal.hidden {
    display: none;
  }

  .modal-content {
    background: rgba(30, 41, 59, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    padding: 1.5rem;
    width: 90%;
    max-width: 24rem;
  }

  .modal-title {
    color: white;
    font-size: 1.25rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .item-description {
    color: #e5e7eb;
    margin-bottom: 1.5rem;
  }

  .modal-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-button {
    flex: 1;
    padding: 0.5rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .use-button {
    background-color: #2563eb;
    color: white;
  }

  .delete-button {
    background-color: #dc2626;
    color: white;
  }

  .close-button {
    background-color: #4b5563;
    color: white;
  }

  .action-button:hover {
    filter: brightness(1.1);
  }

  .inventory-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
  }

  .item-details-btn {
    background: none;
    border: none;
    color: #93c5fd;
    cursor: pointer;
    padding: 0.25rem;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .item-details-btn:hover {
    opacity: 1;
  }
`;
document.head.appendChild(style);