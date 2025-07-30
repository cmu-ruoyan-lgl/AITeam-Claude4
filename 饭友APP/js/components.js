// ===== 组件函数 =====

// 创建餐厅卡片
function createRestaurantCard(restaurant) {
  const card = document.createElement('div');
  card.className = 'restaurant-card';
  card.dataset.restaurantId = restaurant.id;
  
  // 生成星级评分
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(restaurant.rating);
    return `<svg class="star" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>`;
  }).join('');
  
  card.innerHTML = `
    <img class="restaurant-image" src="${restaurant.image}" alt="${restaurant.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNCAzMkg1NlY0OEgyNFYzMloiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+'">
    <div class="restaurant-info">
      <h3 class="restaurant-name">${restaurant.name}</h3>
      <div class="restaurant-rating">
        <div class="star-rating">${stars}</div>
        <span class="rating-score">${restaurant.rating}</span>
      </div>
      <div class="restaurant-meta">
        <span>${restaurant.distance}</span>
        <span>${restaurant.deliveryTime}</span>
      </div>
    </div>
  `;
  
  // 添加点击事件
  card.addEventListener('click', () => {
    handleRestaurantClick(restaurant);
  });
  
  return card;
}

// 创建用户卡片
function createUserCard(user, size = 'normal') {
  const card = document.createElement('div');
  card.className = size === 'small' ? 'user-avatar-small' : 'user-card';
  card.dataset.userId = user.id;
  
  if (size === 'small') {
    card.innerHTML = `<img src="${user.avatar}" alt="${user.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGNUY1RjUiLz4KPGNpcmNsZSBjeD0iMjQiIGN5PSIxOCIgcj0iOCIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNOCAzOUMxMC41IDMyIDEyIDI4IDI0IDI4UzM3LjUgMzIgNDAgMzkiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+'">`;
  } else {
    const creditClass = user.credit === 'excellent' ? 'excellent' : 
                      user.credit === 'good' ? 'good' : 'normal';
    const creditText = user.credit === 'excellent' ? '优秀' :
                      user.credit === 'good' ? '良好' : '一般';
    
    card.innerHTML = `
      <img class="user-avatar" src="${user.avatar}" alt="${user.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGNUY1RjUiLz4KPGNpcmNsZSBjeD0iMjQiIGN5PSIxOCIgcj0iOCIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNOCAzOUMxMC41IDMyIDEyIDI4IDI0IDI4UzM3LjUgMzIgNDAgMzkiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+'">
      <div class="user-name">${user.name}</div>
      <div class="user-credit ${creditClass}">${creditText}</div>
    `;
  }
  
  return card;
}

// 创建消息气泡
function createMessageBubble(message, isOwn = false) {
  const messageItem = document.createElement('div');
  messageItem.className = `message-item ${isOwn ? 'own' : 'other'}`;
  
  let avatarHtml = '';
  if (!isOwn) {
    avatarHtml = `<img class="message-avatar" src="${message.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiIGZpbGw9IiNGNUY1RjUiLz4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxMyIgcj0iNiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNNiAyOUM4IDIzIDEwIDIwIDE4IDIwUzI4IDIzIDMwIDI5IiBmaWxsPSIjQ0NDQ0NDIi8+Cjwvc3ZnPg=='}" alt="${message.userName || '用户'}">`;
  }
  
  messageItem.innerHTML = `
    ${avatarHtml}
    <div class="message-content">${message.content}</div>
    <div class="message-time">${formatTime(new Date(message.timestamp))}</div>
  `;
  
  return messageItem;
}

// 创建支付项
function createPaymentItem(user, amount, items = []) {
  const paymentItem = document.createElement('div');
  paymentItem.className = 'payment-item';
  paymentItem.dataset.userId = user.id;
  
  const itemsText = items.length > 0 ? items.join('、') : '参与拼饭';
  
  paymentItem.innerHTML = `
    <div class="payment-user">
      <img class="user-avatar" src="${user.avatar}" alt="${user.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGNUY1RjUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNSIgcj0iNyIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNNiAzMkM4LjUgMjUgMTAgMjEgMjAgMjFTMzEuNSAyNSAzNCAzMiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4='">
      <div class="payment-user-info">
        <div class="payment-user-name">${user.name}</div>
        <div class="payment-user-items">${itemsText}</div>
      </div>
    </div>
    <div class="payment-amount">${formatMoney(amount)}</div>
  `;
  
  return paymentItem;
}

// 创建支付状态项
function createPaymentStatusItem(user, isPaid = false) {
  const statusItem = document.createElement('div');
  statusItem.className = 'status-item';
  statusItem.dataset.userId = user.id;
  
  const indicatorClass = isPaid ? 'paid' : 'pending';
  const indicatorIcon = isPaid ? `
    <svg viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ` : '';
  
  statusItem.innerHTML = `
    <div class="status-user">
      <img class="user-avatar" src="${user.avatar}" alt="${user.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiIGZpbGw9IiNGNUY1RjUiLz4KPGNpcmNsZSBjeD0iMTgiIGN5PSIxMyIgcj0iNiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNNiAyOUM4IDIzIDEwIDIwIDE4IDIwUzI4IDIzIDMwIDI5IiBmaWxsPSIjQ0NDQ0NDIi8+Cjwvc3ZnPg=='">
      <span>${user.name}</span>
    </div>
    <div class="status-indicator ${indicatorClass}">
      ${indicatorIcon}
    </div>
  `;
  
  return statusItem;
}

// 显示模态框
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
  }
}

// 隐藏模态框
function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 200);
  }
}

// 创建确认对话框
function showConfirm(title, message, onConfirm, onCancel) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.style.display = 'flex';
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
      </div>
      <div class="modal-body">
        <p style="margin-bottom: 24px; color: var(--text-secondary);">${message}</p>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button class="text-btn" id="cancelBtn">取消</button>
          <button class="primary-btn" id="confirmBtn">确认</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // 事件处理
  modal.querySelector('#confirmBtn').addEventListener('click', () => {
    document.body.removeChild(modal);
    document.body.style.overflow = '';
    if (onConfirm) onConfirm();
  });
  
  modal.querySelector('#cancelBtn').addEventListener('click', () => {
    document.body.removeChild(modal);
    document.body.style.overflow = '';
    if (onCancel) onCancel();
  });
  
  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
      if (onCancel) onCancel();
    }
  });
}

// 处理餐厅点击
function handleRestaurantClick(restaurant) {
  console.log('点击餐厅:', restaurant);
  showToast(`选择了 ${restaurant.name}`);
  
  // 这里可以跳转到餐厅详情页或者其他操作
  // window.location.href = `/restaurant/${restaurant.id}`;
}

// 处理底部导航点击
function handleBottomNavClick(page) {
  // 移除所有活跃状态
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // 添加当前活跃状态
  const currentItem = document.querySelector(`[data-page="${page}"]`);
  if (currentItem) {
    currentItem.classList.add('active');
  }
  
  console.log('导航到:', page);
  
  // 根据页面进行路由处理
  switch (page) {
    case 'home':
      if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
        window.location.href = '/index.html';
      }
      break;
    case 'pinfan':
      window.location.href = '/pages/matching.html';
      break;
    case 'message':
      showToast('消息功能开发中...');
      break;
    case 'profile':
      showToast('个人中心开发中...');
      break;
  }
}

// 动画工具
const Animation = {
  // 淡入动画
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    
    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  },
  
  // 滑入动画
  slideIn(element, direction = 'up', duration = 300) {
    const translateMap = {
      up: 'translateY(20px)',
      down: 'translateY(-20px)',
      left: 'translateX(20px)',
      right: 'translateX(-20px)'
    };
    
    element.style.transform = translateMap[direction];
    element.style.opacity = '0';
    element.style.transition = `all ${duration}ms ease`;
    
    setTimeout(() => {
      element.style.transform = 'translate(0)';
      element.style.opacity = '1';
    }, 10);
  },
  
  // 弹跳动画
  bounce(element) {
    element.style.animation = 'bounce 0.6s ease';
    
    setTimeout(() => {
      element.style.animation = '';
    }, 600);
  }
};

// 添加CSS动画关键帧（如果不存在）
if (!document.querySelector('#bounce-keyframes')) {
  const style = document.createElement('style');
  style.id = 'bounce-keyframes';
  style.textContent = `
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0,0,0);
      }
      40%, 43% {
        transform: translate3d(0,-30px,0);
      }
      70% {
        transform: translate3d(0,-15px,0);
      }
      90% {
        transform: translate3d(0,-4px,0);
      }
    }
  `;
  document.head.appendChild(style);
}