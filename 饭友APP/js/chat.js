// ===== 聊天页面逻辑 =====

class ChatPage {
  constructor() {
    this.currentGroup = null;
    this.messages = [];
    this.messageId = 0;
    
    this.init();
  }
  
  init() {
    this.loadGroupInfo();
    this.bindEvents();
    this.initializeChat();
    this.simulateGroupActivity();
  }
  
  loadGroupInfo() {
    // 从本地存储加载群组信息
    this.currentGroup = Storage.get('currentGroup');
    
    if (!this.currentGroup) {
      // 模拟群组数据
      this.currentGroup = {
        id: 'group_' + Date.now(),
        users: [
          { id: '1', name: '小王', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
          { id: '2', name: '小李', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2dc5b03?w=100' },
          { id: '3', name: '小张', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100' }
        ],
        createdAt: new Date().toISOString()
      };
    }
    
    this.updateGroupUI();
  }
  
  updateGroupUI() {
    // 更新成员头像
    const memberAvatars = document.getElementById('memberAvatars');
    if (memberAvatars && this.currentGroup) {
      memberAvatars.innerHTML = '';
      this.currentGroup.users.forEach(user => {
        const avatar = createUserCard(user, 'small');
        memberAvatars.appendChild(avatar);
      });
    }
    
    // 更新成员数量
    const memberCount = document.getElementById('memberCount');
    if (memberCount && this.currentGroup) {
      memberCount.textContent = `${this.currentGroup.users.length + 1}人`; // +1 是当前用户
    }
  }
  
  bindEvents() {
    // 发送按钮
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
      sendBtn.addEventListener('click', this.handleSendMessage.bind(this));
    }
    
    // 输入框回车发送
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
      
      // 输入状态处理
      messageInput.addEventListener('input', this.updateSendButtonState.bind(this));
    }
    
    // 选择餐厅按钮
    const selectRestaurantBtn = document.getElementById('selectRestaurantBtn');
    if (selectRestaurantBtn) {
      selectRestaurantBtn.addEventListener('click', this.handleSelectRestaurant.bind(this));
    }
    
    // 语音按钮
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', this.handleVoiceMessage.bind(this));
    }
    
    // 分享按钮
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', this.handleShareContent.bind(this));
    }
    
    // 群组信息按钮
    const groupInfoBtn = document.getElementById('groupInfoBtn');
    if (groupInfoBtn) {
      groupInfoBtn.addEventListener('click', this.handleGroupInfo.bind(this));
    }
    
    // 餐厅弹窗关闭
    const closeRestaurantModal = document.getElementById('closeRestaurantModal');
    if (closeRestaurantModal) {
      closeRestaurantModal.addEventListener('click', () => {
        hideModal('restaurantModal');
      });
    }
  }
  
  initializeChat() {
    // 初始化聊天记录
    this.messages = [
      {
        id: this.messageId++,
        content: '欢迎来到拼饭群！快来讨论今天吃什么吧 🍽️',
        type: 'system',
        timestamp: new Date()
      }
    ];
    
    this.renderMessages();
    
    // 滚动到底部
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }
  
  renderMessages() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    chatMessages.innerHTML = '';
    
    this.messages.forEach(message => {
      let messageElement;
      
      if (message.type === 'system') {
        messageElement = this.createSystemMessage(message);
      } else {
        const isOwn = message.userId === 'current_user';
        messageElement = createMessageBubble(message, isOwn);
      }
      
      chatMessages.appendChild(messageElement);
    });
  }
  
  createSystemMessage(message) {
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item system-message';
    
    messageItem.innerHTML = `
      <div class="message-content">
        <span>${message.content}</span>
      </div>
      <div class="message-time">${formatTime(new Date(message.timestamp))}</div>
    `;
    
    return messageItem;
  }
  
  async handleSendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;
    
    const content = messageInput.value.trim();
    if (!content) return;
    
    // 清空输入框
    messageInput.value = '';
    this.updateSendButtonState();
    
    try {
      // 添加自己的消息
      const message = {
        id: this.messageId++,
        content: content,
        userId: 'current_user',
        userName: '我',
        timestamp: new Date(),
        type: 'text'
      };
      
      this.messages.push(message);
      this.renderMessages();
      this.scrollToBottom();
      
      // 模拟发送到服务器
      await API.sendMessage(this.currentGroup.id, content);
      
      // 模拟其他用户回复
      setTimeout(() => {
        this.simulateReply(content);
      }, 1000 + Math.random() * 2000);
      
    } catch (error) {
      console.error('发送消息失败:', error);
      showToast('发送失败，请重试', 'error');
    }
  }
  
  simulateReply(originalMessage) {
    const responses = [
      '同意！',
      '好的，我也想吃这个',
      '这个不错，我投一票',
      '有其他选择吗？',
      '我觉得可以',
      '价格怎么样？',
      '多久能送到？'
    ];
    
    if (this.currentGroup && this.currentGroup.users.length > 0) {
      const randomUser = this.currentGroup.users[Math.floor(Math.random() * this.currentGroup.users.length)];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const message = {
        id: this.messageId++,
        content: randomResponse,
        userId: randomUser.id,
        userName: randomUser.name,
        avatar: randomUser.avatar,
        timestamp: new Date(),
        type: 'text'
      };
      
      this.messages.push(message);
      this.renderMessages();
      this.scrollToBottom();
    }
  }
  
  updateSendButtonState() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (messageInput && sendBtn) {
      const hasContent = messageInput.value.trim().length > 0;
      sendBtn.disabled = !hasContent;
      sendBtn.style.opacity = hasContent ? '1' : '0.5';
    }
  }
  
  async handleSelectRestaurant() {
    try {
      showLoading('加载餐厅列表...');
      
      // 获取餐厅列表
      const result = await API.getNearbyRestaurants(1, 10);
      
      // 填充餐厅弹窗
      const modalRestaurantList = document.getElementById('modalRestaurantList');
      if (modalRestaurantList) {
        modalRestaurantList.innerHTML = '';
        
        result.data.forEach(restaurant => {
          const card = createRestaurantCard(restaurant);
          card.addEventListener('click', () => {
            this.shareRestaurant(restaurant);
            hideModal('restaurantModal');
          });
          modalRestaurantList.appendChild(card);
        });
      }
      
      showModal('restaurantModal');
      
    } catch (error) {
      console.error('加载餐厅失败:', error);
      showToast('加载餐厅失败', 'error');
    } finally {\n      hideLoading();\n    }\n  }\n  \n  shareRestaurant(restaurant) {\n    const message = {\n      id: this.messageId++,\n      content: `推荐餐厅：${restaurant.name}`,\n      userId: 'current_user',\n      userName: '我',\n      timestamp: new Date(),\n      type: 'restaurant',\n      restaurant: restaurant\n    };\n    \n    this.messages.push(message);\n    this.renderMessages();\n    this.scrollToBottom();\n    \n    // 模拟分享成功\n    showToast('餐厅分享成功');\n    \n    // 3秒后显示确认分账按钮\n    setTimeout(() => {\n      this.showOrderConfirmation(restaurant);\n    }, 3000);\n  }\n  \n  showOrderConfirmation(restaurant) {\n    const message = {\n      id: this.messageId++,\n      content: '大家都同意这家餐厅，现在开始点餐吧！',\n      type: 'system',\n      timestamp: new Date()\n    };\n    \n    this.messages.push(message);\n    this.renderMessages();\n    this.scrollToBottom();\n    \n    // 显示订单确认按钮\n    setTimeout(() => {\n      const confirmButton = document.createElement('div');\n      confirmButton.className = 'order-confirmation';\n      confirmButton.style.cssText = `\n        position: fixed;\n        bottom: calc(68px + env(safe-area-inset-bottom, 0));\n        left: 16px;\n        right: 16px;\n        background: var(--success-color);\n        color: white;\n        padding: 16px;\n        border-radius: 12px;\n        text-align: center;\n        font-weight: 500;\n        cursor: pointer;\n        z-index: 100;\n        animation: slideUp 0.3s ease;\n      `;\n      \n      confirmButton.innerHTML = `\n        <div>已选择：${restaurant.name}</div>\n        <div style=\"font-size: 14px; margin-top: 4px; opacity: 0.9;\">点击确认分账</div>\n      `;\n      \n      confirmButton.addEventListener('click', () => {\n        // 保存餐厅信息\n        Storage.set('selectedRestaurant', restaurant);\n        window.location.href = './payment.html';\n      });\n      \n      document.body.appendChild(confirmButton);\n      \n      // 5秒后自动隐藏\n      setTimeout(() => {\n        if (document.body.contains(confirmButton)) {\n          confirmButton.style.animation = 'slideDown 0.3s ease';\n          setTimeout(() => {\n            document.body.removeChild(confirmButton);\n          }, 300);\n        }\n      }, 5000);\n    }, 1000);\n  }\n  \n  handleVoiceMessage() {\n    showToast('语音消息功能开发中...');\n  }\n  \n  handleShareContent() {\n    showToast('分享功能开发中...');\n  }\n  \n  handleGroupInfo() {\n    showToast('群组信息功能开发中...');\n  }\n  \n  simulateGroupActivity() {\n    // 模拟群组活动，随机发送消息\n    const activities = [\n      '小王 加入了拼饭群',\n      '小李 加入了拼饭群',\n      '小张 加入了拼饭群'\n    ];\n    \n    activities.forEach((activity, index) => {\n      setTimeout(() => {\n        const message = {\n          id: this.messageId++,\n          content: activity,\n          type: 'system',\n          timestamp: new Date()\n        };\n        \n        this.messages.push(message);\n        this.renderMessages();\n        this.scrollToBottom();\n      }, (index + 1) * 2000);\n    });\n  }\n  \n  scrollToBottom() {\n    const chatMessages = document.getElementById('chatMessages');\n    if (chatMessages) {\n      chatMessages.scrollTop = chatMessages.scrollHeight;\n    }\n  }\n}\n\n// 添加动画样式\nif (!document.querySelector('#chat-animations')) {\n  const style = document.createElement('style');\n  style.id = 'chat-animations';\n  style.textContent = `\n    @keyframes slideUp {\n      from {\n        transform: translateY(100%);\n        opacity: 0;\n      }\n      to {\n        transform: translateY(0);\n        opacity: 1;\n      }\n    }\n    \n    @keyframes slideDown {\n      from {\n        transform: translateY(0);\n        opacity: 1;\n      }\n      to {\n        transform: translateY(100%);\n        opacity: 0;\n      }\n    }\n  `;\n  document.head.appendChild(style);\n}\n\n// 页面加载完成后初始化\ndocument.addEventListener('DOMContentLoaded', () => {\n  if (window.location.pathname.includes('chat.html')) {\n    window.chatPage = new ChatPage();\n  }\n});