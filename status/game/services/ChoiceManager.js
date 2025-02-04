// services/ChoiceManager.js
export class ChoiceManager {
  constructor(gameState) {
    this.gameState = gameState;
  }

  async handleChoice(choices) {
    return new Promise(resolve => {
      const modal = this.createChoiceModal(choices);
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        const choiceButton = e.target.closest('.choice-button');
        if (choiceButton) {
          const choice = choices[parseInt(choiceButton.dataset.index)];
          modal.remove();
          
          if (choice.givesItem && this.gameState.inventory.length < this.gameState.maxInventorySize) {
            this.gameState.addItem(choice.givesItem);
          }
          
          resolve({
            success: true,
            message: choice.result,
            givesItem: choice.givesItem
          });
        }
      });
    });
  }

  async handleInteraction(interaction) {
    const interactionId = `${this.gameState.selectedFloor}-${this.gameState.selectedLocation}-${interaction.name}`;
    const count = this.gameState.interactionHistory.get(interactionId) || 0;

    // 상호작용 횟수에 따른 다른 스크립트
    const scripts = this.getInteractionScripts(interaction.name, count);
    if (!scripts) {
      return {
        success: false,
        message: '더 이상 조사할 만한 게 없습니다.'
      };
    }

    // 특수 선택지 확인
    const specialChoice = this.checkSpecialChoice(interaction, count);
    if (specialChoice) {
      return await this.handleChoice(specialChoice);
    }

    // 아이템 획득 여부 확인
    if (interaction.givesItem) {
      const confirmed = await this.confirmItemAcquisition(interaction.givesItem);
      if (!confirmed) {
        return {
          success: false,
          message: '아이템을 획득하지 않았습니다.'
        };
      }
    }

    // 일반 상호작용 처리
    this.gameState.interactionHistory.set(interactionId, count + 1);
    return {
      success: true,
      message: scripts.message,
      givesItem: interaction.givesItem
    };
  }

  createChoiceModal(choices) {
    const modal = document.createElement('div');
    modal.className = 'choice-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-title">선택</div>
        ${choices.map((choice, index) => `
          <button class="choice-button" data-index="${index}">
            ${choice.text}
          </button>
        `).join('')}
      </div>
    `;
    return modal;
  }

  async confirmItemAcquisition(item) {
    return new Promise(resolve => {
      const confirmed = confirm(`${item}을(를) 획득하시겠습니까?`);
      resolve(confirmed);
    });
  }

  checkSpecialChoice(interaction, count) {
    const specialConditions = {
      '망원경으로 관찰하기': {
        condition: () => this.gameState.hasItem('수상한 메모') && count === 1,
        choices: [
          { 
            text: '자세히 관찰한다', 
            result: '모스 부호를 발견했습니다.',
            givesItem: '모스 부호 해독'
          },
          { 
            text: '무시한다', 
            result: '그냥 지나갔습니다.' 
          }
        ]
      }
    };

    const special = specialConditions[interaction.name];
    if (special?.condition()) {
      return special.choices;
    }
    return null;
  }

  getInteractionScripts(interactionName, count) {
    const scripts = {
      '망원경으로 관찰하기': [
        { message: '멀리 수평선을 바라봅니다.' },
        { message: '수평선 너머로 이상한 불빛이 보입니다.' },
        { message: '불빛이 모스 부호처럼 깜빡입니다.' },
        null
      ]
    };

    return scripts[interactionName]?.[count] || null;
  }
}