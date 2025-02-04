// services/MessageSystem.js
import { floorData } from '../constants/cruiseData.js';

export class MessageSystem {
  constructor() {
    this.messageHistory = [];
    this.maxMessages = 100;
    this.messageContainer = null;
  }

  initializeContainer() {
    // 기존 메시지 로그 컨테이너 제거
    const existingLogs = document.querySelectorAll('.message-log-container');
    existingLogs.forEach(log => log.remove());

    const container = document.createElement('div');
    container.className = 'message-log-container';
    
    container.innerHTML = `
      <div class="message-log-header">
        <h3>메시지 로그</h3>
        <button class="clear-log-button">지우기</button>
      </div>
      <div class="messages-container"></div>
    `;

    // 버튼에 이벤트 리스너 추가
    const clearButton = container.querySelector('.clear-log-button');
    clearButton.addEventListener('click', () => this.clearMessages());

    this.messageContainer = container.querySelector('.messages-container');

    // game-sidebar에 추가
    const sidebar = document.querySelector('.game-sidebar');
    if (sidebar) {
      sidebar.insertBefore(container, sidebar.firstChild);
    }
  }

  createMessageLog() {
    const container = document.createElement('div');
    container.className = 'message-log-container';
    
    container.innerHTML = `
      <div class="message-log-header">
        <h3>메시지 로그</h3>
        <button class="clear-log-button" data-action="clear-messages">지우기</button>
      </div>
      <div class="messages-container" id="messages-container">
        ${this.createMessagesHTML()}
      </div>
    `;

    // 이벤트 리스너 설정
    const clearButton = container.querySelector('.clear-log-button');
    clearButton.addEventListener('click', () => this.clearMessages());

    const messagesContainer = container.querySelector('.messages-container');
    messagesContainer.addEventListener('scroll', () => {
      this.handleScroll(messagesContainer);
    });

    // game-container 찾기 및 삽입
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
      const sidebar = gameContainer.querySelector('.game-sidebar');
      if (sidebar) {
        sidebar.insertBefore(container, sidebar.firstChild);
        this.messageContainer = container.querySelector('.messages-container');
      }
    } else {
      setTimeout(() => this.createMessageLog(), 1000); // 1초 후 재시도
    }
  }

  createMessagesHTML() {
    return this.messageHistory
      .map(msg => `
        <div class="message-item ${msg.type}">
          ${msg.message}
        </div>
      `)
      .join('');
  }

  handleScroll(container) {
    const isAtBottom = 
      container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
    
    if (isAtBottom) {
      container.dataset.autoScroll = 'true';
    } else {
      container.dataset.autoScroll = 'false';
    }
  }

  setContainer(container) {
    this.messageContainer = container;
    // 기존 메시지 히스토리 표시
    this.messageHistory.forEach(msg => {
      this.appendMessageElement(msg.message, msg.type);
    });
  }

  showMessage(message, type = 'info') {
    if (!message) return;

    // 메시지 히스토리에 추가
    this.messageHistory.push({ message, type });
    if (this.messageHistory.length > this.maxMessages) {
      this.messageHistory.shift();
    }

    // UI에 메시지 추가
    this.appendMessageElement(message, type);
  }

  appendMessageElement(message, type) {
    if (!this.messageContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message-item ${type}`;
    messageElement.textContent = message;
    
    this.messageContainer.appendChild(messageElement);
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  clearMessages() {
    this.messageHistory = [];
    if (this.messageContainer) {
      this.messageContainer.innerHTML = '';
    }
  }

  static addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .message-log-container {
        background: rgba(30, 41, 59, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.5rem;
        margin-bottom: 1rem;
      }

      .message-log-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .message-log-header h3 {
        margin: 0;
        color: #e5e7eb;
        font-size: 1rem;
      }

      .clear-log-button {
        background: none;
        border: none;
        color: #93c5fd;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .clear-log-button:hover {
        opacity: 1;
      }

      .messages-container {
        height: 200px;
        overflow-y: auto;
        padding: 0.75rem;
      }

      .message-item {
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 0.25rem;
        border-left: 3px solid;
        font-size: 0.875rem;
        line-height: 1.4;
      }

      .message-item:last-child {
        margin-bottom: 0;
      }

      .message-item.info {
        background: rgba(59, 130, 246, 0.1);
        border-left-color: #3b82f6;
      }

      .message-item.success {
        background: rgba(34, 197, 94, 0.1);
        border-left-color: #22c55e;
      }

      .message-item.warning {
        background: rgba(234, 179, 8, 0.1);
        border-left-color: #eab308;
      }

      .message-item.error {
        background: rgba(239, 68, 68, 0.1);
        border-left-color: #ef4444;
      }

      .messages-container::-webkit-scrollbar {
        width: 6px;
      }

      .messages-container::-webkit-scrollbar-track {
        background: transparent;
      }

      .messages-container::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }
    `;
    document.head.appendChild(style);
  }
}

// 스타일 추가
MessageSystem.addStyles();