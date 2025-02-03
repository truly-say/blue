// components/InteractionCard.js
export class InteractionCard {
    constructor(interaction, gameState) {
      this.interaction = interaction;
      this.gameState = gameState;
      this.element = this.createElement();
    }
  
    createElement() {
      const card = document.createElement('div');
      card.className = 'interaction-card';
      
      const canPerform = helpers.canPerformInteraction(this.interaction, this.gameState.inventory);
  
      card.innerHTML = `
        <div class="interaction-content ${canPerform ? '' : 'disabled'}">
          <h5 class="interaction-name">${this.interaction.name}</h5>
          <p class="interaction-description">${this.interaction.description}</p>
          ${this.interaction.requiresItem ? 
            `<p class="required-item">필요 아이템: ${this.interaction.requiresItem}</p>` : 
            ''}
          <button class="interaction-button"
                  data-action="perform-interaction"
                  data-id="${this.interaction.name}"
                  ${canPerform ? '' : 'disabled'}>
            실행하기
          </button>
        </div>
      `;
  
      return card;
    }
  
    update() {
      const newElement = this.createElement();
      this.element.replaceWith(newElement);
      this.element = newElement;
    }
  }