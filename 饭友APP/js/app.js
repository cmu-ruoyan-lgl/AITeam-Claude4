// ===== 主应用逻辑 =====

class FanYouApp {
  constructor() {
    this.currentPage = 1;
    this.restaurants = [];
    this.hasMoreRestaurants = true;
    this.loading = false;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.loadInitialData();
  }
  
  bindEvents() {
    // 发起拼饭按钮
    const startPinFanBtn = document.getElementById('startPinFanBtn');
    if (startPinFanBtn) {
      startPinFanBtn.addEventListener('click', this.handleStartPinFan.bind(this));
    }
    
    // 搜索框点击
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('click', this.handleSearchClick.bind(this));
    }
    
    // 底部导航
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const page = item.dataset.page;
        handleBottomNavClick(page);
      });
    });
    
    // 加载更多
    const loadMore = document.getElementById('loadMore');
    if (loadMore) {
      loadMore.addEventListener('click', this.loadMoreRestaurants.bind(this));
    }
    
    // 无限滚动
    this.setupInfiniteScroll();
    
    // 下拉刷新
    this.setupPullToRefresh();
  }
  
  async loadInitialData() {
    try {
      showLoading('加载附近餐厅...');
      const result = await API.getNearbyRestaurants(1, 10);
      
      this.restaurants = result.data;
      this.hasMoreRestaurants = result.hasMore;
      this.currentPage = 1;
      
      this.renderRestaurants();
    } catch (error) {
      console.error('加载餐厅失败:', error);
      showToast('加载失败，请重试', 'error');
    } finally {
      hideLoading();
    }
  }
  
  renderRestaurants() {
    const restaurantsList = document.getElementById('restaurantsList');
    if (!restaurantsList) return;
    
    // 清空现有内容
    restaurantsList.innerHTML = '';
    
    // 添加餐厅卡片
    this.restaurants.forEach(restaurant => {
      const card = createRestaurantCard(restaurant);
      restaurantsList.appendChild(card);
      
      // 添加动画
      Animation.slideIn(card, 'up', 200);
    });
    
    // 更新加载更多按钮状态
    const loadMore = document.getElementById('loadMore');
    if (loadMore) {
      loadMore.style.display = this.hasMoreRestaurants ? 'block' : 'none';
    }
  }
  
  async loadMoreRestaurants() {
    if (this.loading || !this.hasMoreRestaurants) return;
    
    this.loading = true;
    const loadMore = document.getElementById('loadMore');
    
    try {
      if (loadMore) {
        loadMore.textContent = '加载中...';
      }
      
      const result = await API.getNearbyRestaurants(this.currentPage + 1, 5);
      
      this.restaurants.push(...result.data);
      this.hasMoreRestaurants = result.hasMore;
      this.currentPage++;
      
      // 只渲染新增的餐厅
      const restaurantsList = document.getElementById('restaurantsList');
      result.data.forEach(restaurant => {
        const card = createRestaurantCard(restaurant);
        restaurantsList.appendChild(card);
        Animation.slideIn(card, 'up', 200);
      });
      
    } catch (error) {
      console.error('加载更多餐厅失败:', error);
      showToast('加载失败，请重试', 'error');
    } finally {
      this.loading = false;
      
      if (loadMore) {
        loadMore.textContent = this.hasMoreRestaurants ? '加载更多餐厅...' : '没有更多了';
      }
    }
  }
  
  handleStartPinFan() {
    // 添加按钮动画
    const btn = document.getElementById('startPinFanBtn');
    Animation.bounce(btn);
    
    // 跳转到匹配页面
    setTimeout(() => {
      window.location.href = './pages/matching.html';
    }, 300);
  }
  
  handleSearchClick() {
    showToast('搜索功能开发中...');
  }
  
  setupInfiniteScroll() {
    let isScrolling = false;
    
    window.addEventListener('scroll', throttle(() => {
      if (isScrolling || this.loading || !this.hasMoreRestaurants) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // 距离底部100px时触发加载
      if (scrollTop + windowHeight >= documentHeight - 100) {
        isScrolling = true;
        this.loadMoreRestaurants().finally(() => {
          isScrolling = false;
        });
      }
    }, 200));
  }
  
  setupPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    
    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!isPulling) return;
      
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      
      if (diff > 0 && window.scrollY === 0) {
        e.preventDefault();
        
        // 这里可以添加下拉刷新的视觉反馈
        if (diff > 100) {
          // 显示释放刷新提示
        }
      }
    });
    
    document.addEventListener('touchend', (e) => {
      if (!isPulling) return;
      
      const diff = currentY - startY;
      
      if (diff > 100 && window.scrollY === 0) {
        // 触发刷新
        this.refreshData();
      }
      
      isPulling = false;
      startY = 0;
      currentY = 0;
    });
  }
  
  async refreshData() {
    try {
      showLoading('刷新中...');
      const result = await API.getNearbyRestaurants(1, 10);
      
      this.restaurants = result.data;
      this.hasMoreRestaurants = result.hasMore;
      this.currentPage = 1;
      
      this.renderRestaurants();
      showToast('刷新成功', 'success');
    } catch (error) {
      console.error('刷新失败:', error);
      showToast('刷新失败，请重试', 'error');
    } finally {
      hideLoading();
    }
  }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  // 检查是否在首页
  if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
    window.fanYouApp = new FanYouApp();
  }
  
  // 通用初始化
  initCommonFeatures();
});

// 通用功能初始化
function initCommonFeatures() {
  // 处理返回按钮
  document.querySelectorAll('.nav-back').forEach(btn => {
    btn.addEventListener('click', () => {
      if (history.length > 1) {
        history.back();
      } else {
        window.location.href = '/index.html';
      }
    });
  });
  
  // PWA安装提示
  setupPWAInstallPrompt();
  
  // 错误处理
  window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
    // 这里可以上报错误到监控系统
  });
  
  // 网络状态监听
  setupNetworkStatusListener();
}

// PWA安装提示
function setupPWAInstallPrompt() {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // 显示安装提示
    showInstallPrompt(deferredPrompt);
  });
  
  window.addEventListener('appinstalled', (e) => {
    console.log('PWA安装成功');
    showToast('饭友已添加到主屏幕', 'success');
  });
}

function showInstallPrompt(deferredPrompt) {
  // 创建安装提示条
  const installBar = document.createElement('div');
  installBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: var(--primary-color);
    color: var(--text-primary);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    z-index: 1000;
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  `;
  
  installBar.innerHTML = `
    <span>将饭友添加到主屏幕，获得更好体验</span>
    <div>
      <button style="background: none; border: none; color: inherit; margin-right: 16px; cursor: pointer;">安装</button>
      <button style="background: none; border: none; color: inherit; cursor: pointer;">×</button>
    </div>
  `;
  
  document.body.appendChild(installBar);
  
  // 显示动画
  setTimeout(() => {
    installBar.style.transform = 'translateY(0)';
  }, 100);
  
  // 事件处理
  const installBtn = installBar.querySelector('button:first-child');
  const closeBtn = installBar.querySelector('button:last-child');
  
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('用户同意安装PWA');
      }
      
      deferredPrompt = null;
    }
    
    document.body.removeChild(installBar);
  });
  
  closeBtn.addEventListener('click', () => {
    installBar.style.transform = 'translateY(-100%)';
    setTimeout(() => {
      document.body.removeChild(installBar);
    }, 300);
  });
  
  // 5秒后自动隐藏
  setTimeout(() => {
    if (document.body.contains(installBar)) {
      installBar.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        document.body.removeChild(installBar);
      }, 300);
    }
  }, 5000);
}

// 网络状态监听
function setupNetworkStatusListener() {
  function updateNetworkStatus() {
    if (!navigator.onLine) {
      showToast('网络连接已断开', 'error', 5000);
    }
  }
  
  window.addEventListener('online', () => {
    showToast('网络连接已恢复', 'success');
  });
  
  window.addEventListener('offline', updateNetworkStatus);
  
  // 初始检查
  if (!navigator.onLine) {
    updateNetworkStatus();
  }
}