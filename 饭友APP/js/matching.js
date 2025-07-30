// ===== 匹配页面逻辑 =====

class MatchingPage {
  constructor() {
    this.matchingTimer = null;
    this.progressTimer = null;
    this.currentProgress = 0;
    this.matchingSteps = [
      '分析位置信息...',
      '查找附近用户...',
      '匹配用餐偏好...',
      '智能推荐拼友...',
      '确认匹配结果...'
    ];
    this.currentStep = 0;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.setupMatchingConditions();
    this.startMatching();
  }
  
  bindEvents() {
    // 取消按钮
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', this.handleCancel.bind(this));
    }
    
    // 调整条件按钮
    const adjustBtn = document.getElementById('adjustBtn');
    if (adjustBtn) {
      adjustBtn.addEventListener('click', this.handleAdjustConditions.bind(this));
    }
  }
  
  setupMatchingConditions() {
    // 设置默认匹配条件
    const now = new Date();
    const startTime = new Date(now.getTime() + 10 * 60000); // 10分钟后
    const endTime = new Date(startTime.getTime() + 60 * 60000); // 1小时用餐时间
    
    const mealTimeElement = document.getElementById('mealTime');
    if (mealTimeElement) {
      mealTimeElement.textContent = `${formatTime(startTime)}-${formatTime(endTime)}`;
    }
    
    // 生成附近用户
    this.generateNearbyUsers();
  }
  
  generateNearbyUsers() {
    const usersGrid = document.getElementById('usersGrid');
    const usersCount = document.getElementById('usersCount');
    
    if (!usersGrid) return;
    
    // 模拟用户数据
    const users = [
      { id: '1', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
      { id: '2', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2dc5b03?w=100' },
      { id: '3', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100' },
      { id: '4', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { id: '5', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
      { id: '6', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100' },
      { id: '7', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100' },
      { id: '8', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
    ];
    
    // 清空现有用户
    usersGrid.innerHTML = '';
    
    // 添加用户头像
    users.forEach((user, index) => {
      const avatar = document.createElement('img');
      avatar.className = 'user-avatar-small';
      avatar.src = user.avatar;
      avatar.alt = `用户${index + 1}`;
      avatar.onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGNUY1RjUiLz4KPGNpcmNsZSBjeD0iMjQiIGN5PSIxOCIgcj0iOCIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNOCAzOUMxMC41IDMyIDEyIDI4IDI0IDI4UzM3LjUgMzIgNDAgMzkiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+';
      };
      
      usersGrid.appendChild(avatar);
      
      // 添加动画延迟
      setTimeout(() => {
        Animation.fadeIn(avatar, 200);
      }, index * 100);
    });
    
    // 更新用户数量
    if (usersCount) {
      usersCount.textContent = `已有${users.length + Math.floor(Math.random() * 20)}人在附近拼饭`;
    }
  }
  
  startMatching() {
    this.updateProgress();
    this.updateStatus();
    
    // 开始匹配流程，3-5秒后完成
    const matchingDuration = 3000 + Math.random() * 2000;
    
    setTimeout(() => {
      this.completeMatching();
    }, matchingDuration);
  }
  
  updateProgress() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    const circumference = 2 * Math.PI * 50; // 半径50的圆周长
    
    this.progressTimer = setInterval(() => {
      this.currentProgress += Math.random() * 3 + 1; // 随机增长1-4%
      
      if (this.currentProgress > 100) {
        this.currentProgress = 100;
      }
      
      const offset = circumference - (this.currentProgress / 100) * circumference;
      progressBar.style.strokeDashoffset = offset;
      
      if (this.currentProgress >= 100) {
        clearInterval(this.progressTimer);
      }
    }, 100);
  }
  
  updateStatus() {
    const statusElement = document.getElementById('matchingStatus');
    if (!statusElement) return;
    
    this.matchingTimer = setInterval(() => {
      if (this.currentStep < this.matchingSteps.length) {
        statusElement.textContent = this.matchingSteps[this.currentStep];
        this.currentStep++;
      } else {
        this.currentStep = 0;
      }
    }, 800);
  }
  
  async completeMatching() {
    // 清除定时器
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
    }
    if (this.matchingTimer) {
      clearInterval(this.matchingTimer);
    }
    
    try {
      const result = await API.matchUsers({
        location: '500米内',
        time: '12:00-13:00',
        preference: ['川菜', '粤菜']
      });
      
      if (result.success) {
        this.showMatchingSuccess(result.users, result.groupId);
      } else {
        this.showMatchingFailed();
      }
    } catch (error) {
      console.error('匹配失败:', error);
      this.showMatchingFailed();
    }
  }
  
  showMatchingSuccess(users, groupId) {
    const statusElement = document.getElementById('matchingStatus');
    if (statusElement) {
      statusElement.textContent = '匹配成功！';
    }
    
    // 显示成功弹窗
    const successModal = document.getElementById('successModal');
    if (successModal) {
      // 填充匹配成功的用户
      const matchedUsers = successModal.querySelector('.matched-users');
      if (matchedUsers) {
        matchedUsers.innerHTML = '';
        users.forEach(user => {
          const avatar = createUserCard(user, 'small');
          matchedUsers.appendChild(avatar);
        });
      }
      
      showModal('successModal');
      
      // 进入聊天室按钮
      const enterChatBtn = document.getElementById('enterChatBtn');
      if (enterChatBtn) {
        enterChatBtn.addEventListener('click', () => {
          // 保存群组信息
          Storage.set('currentGroup', {
            id: groupId,
            users: users,
            createdAt: new Date().toISOString()
          });
          
          window.location.href = './chat.html';
        });
      }
    }
  }
  
  showMatchingFailed() {
    const statusElement = document.getElementById('matchingStatus');
    if (statusElement) {
      statusElement.textContent = '暂无匹配用户';
    }
    
    showToast('没有找到合适的拼友，试试调整条件吧', 'info', 4000);
    
    // 显示重新匹配按钮
    setTimeout(() => {
      this.showRetryOptions();
    }, 2000);
  }
  
  showRetryOptions() {
    const matchingActions = document.querySelector('.matching-actions');
    if (matchingActions) {
      matchingActions.innerHTML = `
        <button class="primary-btn" id="retryMatchBtn">
          <svg class="btn-icon" viewBox="0 0 24 24">
            <polyline points="23,4 23,10 17,10"/>
            <polyline points="1,20 1,14 7,14"/>
            <path d="M20.49,9A9,9 0,0,0 5.64,5.64L1,10"/>
            <path d="M3.51,15a9,9 0,0,0 14.85,3.36L23,14"/>
          </svg>
          重新匹配
        </button>
        <button class="secondary-btn" id="browseGroupsBtn">
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          浏览拼饭群
        </button>
      `;
      
      // 绑定重试事件
      const retryBtn = document.getElementById('retryMatchBtn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          location.reload();
        });
      }
      
      const browseBtn = document.getElementById('browseGroupsBtn');
      if (browseBtn) {
        browseBtn.addEventListener('click', () => {
          showToast('浏览拼饭群功能开发中...');
        });
      }
    }
  }
  
  handleCancel() {
    showConfirm(
      '确认取消',
      '确定要取消匹配吗？',
      () => {
        history.back();
      }
    );
  }
  
  handleAdjustConditions() {
    showToast('调整匹配条件功能开发中...');
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('matching.html')) {
    window.matchingPage = new MatchingPage();
  }
});