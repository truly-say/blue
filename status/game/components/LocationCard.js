// components/LocationCard.js
export class LocationCard {
    constructor(locationId, locationData, gameState) {
      this.locationId = locationId;
      this.locationData = locationData;
      this.gameState = gameState;
      this.element = this.createElement();
    }
  
    createElement() {
      const card = document.createElement('div');
      card.className = 'location-card';
      card.dataset.action = 'select-location';
      card.dataset.id = this.locationId;
  
      const isUnlocked = this.gameState.unlockedLocations.has(this.locationId);
      const isSelected = this.gameState.selectedLocation === this.locationId;
  
      card.innerHTML = `
        <div class="location-header ${isSelected ? 'selected' : ''} ${isUnlocked ? '' : 'locked'}">
          <h4>${this.locationData.name}</h4>
          <span class="location-type">${this.locationData.type}</span>
        </div>
        <p class="location-description">${this.locationData.description}</p>
        ${isUnlocked ? this.createInteractionsList() : '<p class="locked-message">🔒 잠김</p>'}
      `;
  
      return card;
    }
  
    createInteractionsList() {
      if (!this.locationData.interactions) return '';
      
      return `
        <div class="interactions-list">
          ${this.locationData.interactions.map(interaction => `
            <button class="interaction-button" 
                    data-action="perform-interaction"
                    data-id="${interaction.name}"
                    ${helpers.canPerformInteraction(interaction, this.gameState.inventory) ? '' : 'disabled'}>
              ${interaction.name}
            </button>
          `).join('')}
        </div>
      `;
    }
  
    update() {
      const newElement = this.createElement();
      this.element.replaceWith(newElement);
      this.element = newElement;
    }
}