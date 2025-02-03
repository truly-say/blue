// services/MessageSystem.js
export class MessageSystem {
  constructor() {
    this.messageHistory = [];
    this.maxMessages = 100;
    this.initializeContainer();
  }

  initializeContainer() {
    // 기존 메시지 리스트 확인
    this.messageContainer = document.getElementById('message-list');
    if (!this.messageContainer) {
      this.createMessageContainer();
    }
  }

  createMessageContainer() {
    const messageLog = document.createElement('div');
    messageLog.id = 'message-log';
    messageLog.className = 'message-log';
    
    const container = document.createElement('div');
    container.id = 'message-list';
    container.className = 'message-list';
    
    messageLog.appendChild(container);
    
    // game-container가 있는지 확인하고 추가
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
      gameContainer.appendChild(messageLog);
      this.messageContainer = container;
    } else {
      console.error('Game container not found');
    }
  }

  showMessage(message, type = 'info') {
    // 컨테이너가 없으면 다시 초기화 시도
    if (!this.messageContainer) {
      this.initializeContainer();
    }

    if (!this.messageContainer) {
      console.error('Message container initialization failed');
      return;
    }

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;

    this.messageContainer.appendChild(messageElement);
    this.messageHistory.push({ message, type });

    // 최대 메시지 수 제한
    if (this.messageHistory.length > this.maxMessages) {
      this.messageHistory.shift();
      if (this.messageContainer.firstChild) {
        this.messageContainer.firstChild.remove();
      }
    }

    // 부드러운 스크롤
    const messageLog = document.getElementById('message-log');
    if (messageLog) {
      requestAnimationFrame(() => {
        messageLog.scrollTo({
          top: messageLog.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  }

  clearMessages() {
    if (this.messageContainer) {
      this.messageContainer.innerHTML = '';
      this.messageHistory = [];
    }
  }

  static addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .message-log {
        max-height: 200px;
        overflow-y: auto;
        padding: 10px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        margin-top: 10px;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
      }

      .message-log::-webkit-scrollbar {
        width: 6px;
      }

      .message-log::-webkit-scrollbar-track {
        background: transparent;
      }

      .message-log::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }

      .message {
        margin: 5px 0;
        padding: 5px 10px;
        border-radius: 4px;
        animation: fadeIn 0.3s ease;
        color: #ffffff;
      }

      .message.info {
        background: rgba(59, 130, 246, 0.2);
        border-left: 3px solid #3b82f6;
      }

      .message.success {
        background: rgba(34, 197, 94, 0.2);
        border-left: 3px solid #22c55e;
      }

      .message.warning {
        background: rgba(234, 179, 8, 0.2);
        border-left: 3px solid #eab308;
      }

      .message.error {
        background: rgba(239, 68, 68, 0.2);
        border-left: 3px solid #ef4444;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Add styles when the module is imported
MessageSystem.addStyles();