// components/ItemModal.js
export class ItemModal {
    constructor(gameState) {
      this.gameState = gameState;
      this.modalElement = this.createModalElement();
      document.body.appendChild(this.modalElement);
      this.setupEventListeners();
    }
  
    createModalElement() {
      const modal = document.createElement('div');
      modal.className = 'item-details-modal hidden';
      modal.innerHTML = `
        <div class="modal-content">
          <h3 class="modal-title"></h3>
          <p class="item-description"></p>
          <div class="modal-actions">
            <button class="action-button use-button">사용</button>
            <button class="action-button delete-button">버리기</button>
            <button class="action-button close-button">닫기</button>
          </div>
        </div>
      `;
      return modal;
    }
  
    showModal(item, index) {
      const itemDetails = this.getItemDetails(item);
      
      this.modalElement.querySelector('.modal-title').textContent = item;
      this.modalElement.querySelector('.item-description').textContent = itemDetails.description;
      
      // 사용 버튼 상태 설정
      const useButton = this.modalElement.querySelector('.use-button');
      if (itemDetails.canUse) {
        useButton.style.display = 'block';
        useButton.dataset.index = index;
      } else {
        useButton.style.display = 'none';
      }
  
      this.modalElement.dataset.itemIndex = index;
      this.modalElement.classList.remove('hidden');
    }
  
    getItemDetails(itemName) {
      // 아이템 세부 정보 데이터베이스
      const itemDatabase = {
        '작은 열쇠': {
          description: '낡고 오래된 작은 열쇠입니다. 어딘가에 사용할 수 있을 것 같습니다.',
          canUse: true,
          type: 'key'
        },
        '수상한 메모': {
          description: '구겨진 메모지입니다. 알 수 없는 글씨가 적혀있습니다.',
          canUse: false,
          type: 'document'
        },
        '비상 열쇠': {
          description: '비상용 마스터키입니다. 대부분의 문을 열 수 있을 것 같습니다.',
          canUse: true,
          type: 'key'
        },
        // 추가 아이템...
      };
  
      return itemDatabase[itemName] || {
        description: '정보가 없는 아이템입니다.',
        canUse: false,
        type: 'unknown'
      };
    }
  
    setupEventListeners() {
      this.modalElement.addEventListener('click', (e) => {
        const target = e.target;
        const index = parseInt(this.modalElement.dataset.itemIndex);
  
        if (target.classList.contains('close-button') || target === this.modalElement) {
          this.modalElement.classList.add('hidden');
        } else if (target.classList.contains('delete-button')) {
          if (confirm('정말로 이 아이템을 버리시겠습니까?')) {
            this.gameState.removeItem(index);
            this.modalElement.classList.add('hidden');
          }
        } else if (target.classList.contains('use-button')) {
          const item = this.gameState.inventory[index];
          const result = this.gameState.useItem(item);
          if (result.success) {
            this.gameState.messageSystem.showMessage(result.message, 'success');
            this.modalElement.classList.add('hidden');
          } else {
            this.gameState.messageSystem.showMessage(result.message, 'warning');
          }
        }
      });
    }
  }