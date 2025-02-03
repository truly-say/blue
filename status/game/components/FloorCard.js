// components/FloorCard.js
import { helpers } from '../utils/helpers.js';

export class FloorCard {
  constructor(floorNumber, floorData, gameState) {
    this.floorNumber = floorNumber;
    this.floorData = floorData;
    this.gameState = gameState;
    this.element = this.createElement();
  }

  createElement() {
    const card = document.createElement('div');
    card.className = 'floor-card';
    card.dataset.action = 'select-floor';
    card.dataset.id = this.floorNumber;

    const isUnlocked = helpers.canAccessFloor(this.floorNumber, this.gameState.inventory);
    const isSelected = this.gameState.selectedFloor === this.floorNumber;

    card.innerHTML = `
      <div class="floor-header ${isSelected ? 'selected' : ''} ${isUnlocked ? '' : 'locked'}">
        <h3>${this.floorNumber}층 - ${this.floorData.name}</h3>
        <span class="floor-status">
          ${isUnlocked ? '🔓' : '🔒'}
        </span>
      </div>
      <p class="floor-description">${this.floorData.description}</p>
    `;

    return card;
  }

  update() {
    const newElement = this.createElement();
    this.element.replaceWith(newElement);
    this.element = newElement;
  }
}
