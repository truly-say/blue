// main.js
import { GameState } from './services/GameState.js';
import { UIManager } from './services/UIManager.js';
import { MessageSystem } from './services/MessageSystem.js';

class Game {
  constructor() {
    // DOM이 완전히 로드된 후 초기화
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  }

  initialize() {
    this.gameState = new GameState();
    this.uiManager = new UIManager(this.gameState);

    // ESC 키로 메뉴 열기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.toggleMenu();
      }
    });

    // 브라우저 종료 시 저장
    window.addEventListener('beforeunload', () => {
      this.gameState.saveGame();
    });
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
  new Game();
});