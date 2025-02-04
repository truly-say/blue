// game/main.js
import { GameState } from './services/GameState.js';
import { UIManager } from './services/UIManager.js';
import { MessageSystem } from './services/MessageSystem.js';
import { ChoiceManager } from './services/ChoiceManager.js';
import { UnlockManager } from './services/UnlockManager.js';
import { ItemModal } from './components/ItemModal.js';
import { floorData } from './constants/cruiseData.js';
import { LocationType, InteractionType, MessageType } from './constants/gameTypes.js';
import { GameMessages } from './constants/messages.js';

class Game {
    constructor() {
        // 전역 설정
        window.gameData = floorData;
        window.gameTypes = { LocationType, InteractionType, MessageType };
        window.gameMessages = GameMessages;

        // DOM이 완전히 로드된 후 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    async initialize() {
        try {
            await this.createGameContainer();
            
            // 기본 시스템 초기화
            this.gameState = new GameState();
            this.messageSystem = new MessageSystem();
            this.messageSystem.initializeContainer();

            // 시스템 연결
            this.gameState.setMessageSystem(this.messageSystem);
            
            // UI 관리자 초기화 및 연결
            this.uiManager = new UIManager(this.gameState);
            this.gameState.setUIManager(this.uiManager);

            // 게임 매니저 초기화
            this.gameState.initializeManagers();

            // UI 초기 렌더링
            this.uiManager.createGameContainer();
            this.uiManager.initializeUI();

            // 이벤트 리스너 설정
            this.setupEventListeners();

            console.log('Game initialized successfully');
            this.messageSystem.showMessage('게임을 시작합니다.', 'info');

        } catch (error) {
            console.error('Error initializing game:', error);
            this.handleError(error);
        }
    }

    async createGameContainer() {
        // 게임 컨테이너 생성
        const container = document.createElement('div');
        container.className = 'game-container';
        
        // 기본 구조 생성
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
    }

    setupEventListeners() {
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

        // 메뉴 버튼 이벤트
        document.getElementById('saveGame')?.addEventListener('click', () => {
            const result = this.gameState.saveGame();
            this.messageSystem.showMessage(result.message, result.success ? 'success' : 'error');
        });

        document.getElementById('resetGame')?.addEventListener('click', () => {
            if (confirm('정말로 게임을 초기화하시겠습니까? 모든 진행 상황이 삭제됩니다.')) {
                const result = this.gameState.resetGame();
                this.messageSystem.showMessage(result.message, 'info');
                this.uiManager.updateUI();
            }
        });

        // 에러 핸들링
        window.addEventListener('error', (e) => {
            this.handleError(e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(e.reason);
        });
    }

    toggleMenu() {
        const menuElement = document.querySelector('.game-menu');
        if (menuElement) {
            menuElement.classList.toggle('hidden');
        }
    }

    handleError(error) {
        console.error('Game Error:', error);
        
        // 사용자에게 에러 메시지 표시
        if (this.messageSystem) {
            this.messageSystem.showMessage('오류가 발생했습니다: ' + (error.message || '알 수 없는 오류'), 'error');
        }
        
        // 심각한 오류인 경우 게임 상태 저장 시도
        try {
            this.gameState?.saveGame();
        } catch (saveError) {
            console.error('Failed to save game state after error:', saveError);
        }
    }

    // 게임 상태 확인
    checkGameStatus() {
        return {
            currentFloor: this.gameState.selectedFloor,
            currentLocation: this.gameState.selectedLocation,
            inventory: this.gameState.inventory,
            completedInteractions: Array.from(this.gameState.completedInteractions),
            unlockedLocations: Array.from(this.gameState.unlockedLocations)
        };
    }

    // 디버그 모드 토글 (개발용)
    toggleDebugMode() {
        if (process.env.NODE_ENV === 'development') {
            window.gameDebug = !window.gameDebug;
            console.log(`Debug mode: ${window.gameDebug ? 'on' : 'off'}`);
            if (window.gameDebug) {
                console.log('Current game status:', this.checkGameStatus());
            }
        }
    }
}

// 게임 인스턴스 생성 및 전역 접근 설정
window.game = new Game();