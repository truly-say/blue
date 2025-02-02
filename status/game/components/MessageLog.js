// components/MessageLog.js
export class MessageLog {
    constructor(messageSystem) {
      this.messageSystem = messageSystem;
      this.element = this.createElement();
    }
  
    createElement() {
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
  
      // 스크롤 이벤트 처리
      const messagesContainer = container.querySelector('.messages-container');
      messagesContainer.addEventListener('scroll', () => {
        this.handleScroll(messagesContainer);
      });
  
      return container;
    }
  
    createMessagesHTML() {
      return this.messageSystem.messageHistory
        .map(msg => `
          <div class="message-item ${msg.type}">
            ${msg.message}
          </div>
        `)
        .join('');
    }
  
    handleScroll(container) {
      // 자동 스크롤 여부 설정을 위한 로직
      const isAtBottom = 
        container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      
      if (isAtBottom) {
        container.dataset.autoScroll = 'true';
      } else {
        container.dataset.autoScroll = 'false';
      }
    }
  
    update() {
      const newElement = this.createElement();
      this.element.replaceWith(newElement);
      this.element = newElement;
      
      // 자동 스크롤이 활성화되어 있다면 스크롤
      const container = newElement.querySelector('.messages-container');
      if (container.dataset.autoScroll !== 'false') {
        container.scrollTop = container.scrollHeight;
      }
    }
  
    addMessage(message, type = 'info') {
      const messagesContainer = this.element.querySelector('.messages-container');
      const messageElement = document.createElement('div');
      messageElement.className = `message-item ${type}`;
      messageElement.textContent = message;
      
      messagesContainer.appendChild(messageElement);
      this.handleScroll(messagesContainer);
    }
  }