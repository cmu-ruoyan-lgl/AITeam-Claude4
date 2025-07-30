// ===== 工具函数 =====

// 格式化时间
function formatTime(date) {
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

// 格式化金额
function formatMoney(amount) {
  return `¥${amount.toFixed(2)}`;
}

// 生成UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流函数
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 显示加载状态
function showLoading(text = '加载中...') {
  const overlay = document.getElementById('loadingOverlay');
  const loadingText = overlay.querySelector('.loading-text');
  if (loadingText) {
    loadingText.textContent = text;
  }
  overlay.classList.add('active');
}

// 隐藏加载状态
function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.remove('active');
}

// 显示提示消息
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // 添加样式
  Object.assign(toast.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: type === 'error' ? '#FF5252' : type === 'success' ? '#00C853' : '#333333',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    zIndex: '2000',
    opacity: '0',
    transition: 'opacity 0.3s ease'
  });
  
  document.body.appendChild(toast);
  
  // 显示动画
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  // 自动隐藏
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// 本地存储封装
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error:', e);
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage remove error:', e);
    }
  },
  
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Storage clear error:', e);
    }
  }
};

// 模拟API请求
const API = {
  // 模拟延迟
  delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // 获取附近餐厅
  async getNearbyRestaurants(page = 1, limit = 10) {
    await this.delay(800);
    
    const restaurants = [
      {
        id: '1',
        name: '蜀香源川菜馆',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200',
        rating: 4.5,
        distance: '200m',
        deliveryTime: '30分钟',
        tags: ['川菜', '麻辣', '下饭']
      },
      {
        id: '2', 
        name: '日式拉面屋',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200',
        rating: 4.3,
        distance: '350m',
        deliveryTime: '25分钟',
        tags: ['日料', '拉面', '清淡']
      },
      {
        id: '3',
        name: '港式茶餐厅',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200',
        rating: 4.2,
        distance: '500m', 
        deliveryTime: '35分钟',
        tags: ['港式', '茶餐厅', '快餐']
      },
      {
        id: '4',
        name: '健康轻食站',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200',
        rating: 4.4,
        distance: '180m',
        deliveryTime: '20分钟',
        tags: ['轻食', '健康', '沙拉']
      },
      {
        id: '5',
        name: '老北京烤鸭店',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200',
        rating: 4.6,
        distance: '600m',
        deliveryTime: '40分钟',
        tags: ['京菜', '烤鸭', '正宗']
      }
    ];
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: restaurants.slice(start, end),
      hasMore: end < restaurants.length,
      total: restaurants.length
    };
  },
  
  // 匹配拼友
  async matchUsers(preferences = {}) {
    await this.delay(3000);
    
    const users = [
      { id: '1', name: '小王', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', credit: 'excellent' },
      { id: '2', name: '小李', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2dc5b03?w=100', credit: 'good' },
      { id: '3', name: '小张', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100', credit: 'excellent' }
    ];
    
    return {
      success: Math.random() > 0.2, // 80%成功率
      users: users,
      groupId: generateUUID()
    };
  },
  
  // 发送消息
  async sendMessage(groupId, message) {
    await this.delay(500);
    
    return {
      id: generateUUID(),
      content: message,
      userId: 'current_user',
      timestamp: new Date(),
      type: 'text'
    };
  },
  
  // 确认支付
  async confirmPayment(paymentData) {
    await this.delay(2000);
    
    return {
      success: Math.random() > 0.1, // 90%成功率
      orderId: `FY${Date.now()}`,
      timestamp: new Date()
    };
  }
};

// 事件发射器
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  
  off(event, listenerToRemove) {
    if (!this.events[event]) return;
    
    this.events[event] = this.events[event].filter(
      listener => listener !== listenerToRemove
    );
  }
  
  emit(event, ...args) {
    if (!this.events[event]) return;
    
    this.events[event].forEach(listener => {
      listener(...args);
    });
  }
}

// 全局事件总线
window.EventBus = new EventEmitter();

// 图片懒加载
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// 初始化懒加载
document.addEventListener('DOMContentLoaded', lazyLoadImages);