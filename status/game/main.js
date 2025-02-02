// main.js
import { GameState } from './services/GameState.js';
import { MessageSystem } from './services/MessageSystem.js';
import { UIManager } from './services/UIManager.js';
import { helpers } from './utils/helpers.js';
import { GameMessages } from './constants/messages.js';
import { MessageType } from './constants/gameTypes.js';

class Game {
  constructor() {
    this.gameState = new GameState();
    this.uiManager = new UIManager(this.gameState);
    this.messageSystem = new MessageSystem();

    this.setupEventListeners();
    this.loadGame();
  }

  setupEventListeners() {
    // 자동 저장
    setInterval(() => {
      helpers.saveGameState(this.gameState);
    }, 30000);

    // ESC 키로 메뉴 열기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.toggleMenu();
      }
    });

    // 브라우저 종료 시 저장
    window.addEventListener('beforeunload', () => {
      helpers.saveGameState(this.gameState);
    });
  }

  loadGame() {
    const savedState = helpers.loadGameState();
    if (savedState) {
      this.gameState.inventory = savedState.inventory;
      this.gameState.unlockedFloors = savedState.unlockedFloors;
      this.gameState.unlockedLocations = savedState.unlockedLocations;
      
      this.messageSystem.showMessage(GameMessages.GAME_LOADED, MessageType.INFO);
    } else {
      this.messageSystem.showMessage(GameMessages.WELCOME, MessageType.INFO);
    }
  }

  toggleMenu() {
    const menuElement = document.querySelector('.game-menu');
    if (menuElement) {
      menuElement.classList.toggle('hidden');
    }
  }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
});