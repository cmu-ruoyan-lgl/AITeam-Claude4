■ 产品需求文档（PRD V1.0）■

# 1. 文档修订记录
| 版本 | 日期       | 作者     | 变更说明         |
|------|------------|----------|------------------|
| 1.0  | 2025-07-30 | 产品经理 | 初稿             |

# 2. 产品概述

## 2.1 产品背景
随着城市生活节奏加快，上班族面临点餐成本高、选择困难、缺乏社交等痛点。美团拼好饭等产品虽然提供了拼单功能，但在用户匹配精准度、社交体验、分账便利性方面仍有提升空间。饭友APP专注为上班族提供更智能、便捷的拼饭解决方案。

## 2.2 目标用户
- **核心用户**：22-35岁上班族，主要分布在一二线城市CBD、科技园区
- **使用场景**：工作日午餐（11:30-13:30）、加班晚餐（18:00-20:00）
- **用户特征**：注重性价比、有一定社交需求、使用移动支付习惯良好

## 2.3 核心价值
- **经济价值**：通过拼单降低起送费，减少食物浪费
- **效率价值**：智能匹配减少等待时间，简化决策流程  
- **社交价值**：促进同事/邻近用户互动，缓解独食孤独感

## 2.4 产品范围
- **平台**：Android移动应用
- **服务范围**：一二线城市商务区，500米范围内用户匹配
- **餐饮类型**：外卖平台所有餐厅，重点优化中式快餐、轻食等适合拼单的品类

# 3. 功能需求详情

## 3.1 智能拼饭匹配模块

### 用户场景
用户在午餐时间想要点餐，希望通过拼饭降低成本并找到用餐伙伴。

### 流程图解
```
用户发起拼饭 → 设置偏好(时间/地点/餐厅类型) → 系统智能匹配 → 推荐候选用户 → 确认参与者 → 创建拼饭群
```

### 交互规则
- 匹配范围：500米内，时间差不超过30分钟
- 匹配算法：地理位置权重60%，时间匹配30%，口味偏好10%
- 参与人数：2-4人为最佳，最多支持6人
- 响应时间：发起后5分钟内必须有回应，否则自动匹配

### 异常处理
- 无匹配用户：推荐附近热门拼饭群或转为个人订餐
- 匹配失败：提供重新匹配或调整偏好选项
- 用户取消：通知其他参与者，重新分配订单

## 3.2 社交化订餐模块

### 用户场景
拼饭群组建立后，用户需要协调菜品选择、统一下单、分账支付。

### 流程图解
```
进入拼饭群 → 讨论餐厅/菜品 → 统计订单 → 确认支付分摊 → 统一下单 → 分账扣款 → 配送跟踪
```

### 交互规则
- 群聊功能：支持文字、语音、餐厅链接分享
- 菜品统计：自动汇总每人选择，计算总价和人均分摊
- 支付规则：发起人代付，其他人确认后自动分账扣款
- 配送协调：统一配送地址，支持分批自取

### 异常处理
- 支付失败：暂停订单，通知用户重新支付
- 餐厅缺货：群内通知，重新选择或更换餐厅
- 配送延误：实时更新状态，提供客服联系方式

## 3.3 用户画像与偏好模块

### 用户场景
新用户注册后需要建立口味偏好档案，老用户可以管理个人偏好设置。

### 流程图解
```
用户注册 → 基础信息录入 → 口味偏好测试 → 常用地址设置 → 画像建立完成
```

### 交互规则
- 口味标签：川菜、粤菜、日料、轻食等12个主要分类
- 偏好设置：价格区间、辣度、是否素食等个性化选项
- 学习机制：根据历史订单自动优化用户画像
- 隐私控制：用户可选择公开或隐藏特定偏好信息

## 3.4 评价与信用体系

### 用户场景
拼饭结束后，用户需要对本次体验进行评价，系统维护用户信用档案。

### 流程图解
```
订单完成 → 评价提醒 → 填写评价(餐厅/拼友) → 信用分更新 → 影响后续匹配权重
```

### 交互规则
- 评价维度：准时性、沟通友好度、餐厅推荐质量
- 信用等级：优秀(90+)、良好(80-89)、一般(70-79)、较差(<70)
- 激励机制：高信用用户享受优先匹配、专属优惠等特权
- 惩罚机制：恶意评价、频繁爽约用户限制使用功能

# 4. 全局规则定义

## 4.1 数据规范
- 用户位置：精确到100米范围，保护隐私不显示具体地址
- 订单金额：保留两位小数，分账误差控制在0.01元内
- 时间格式：统一使用24小时制，显示格式"HH:mm" 
- 图片规格：头像120x120px，餐厅图片750x300px

## 4.2 权限规则
- 位置权限：必需权限，拒绝则无法使用核心功能
- 通知权限：可选权限，影响拼饭匹配通知接收
- 相机权限：可选权限，用于拍照分享餐厅/菜品
- 存储权限：可选权限，用于缓存头像和餐厅图片

## 4.3 状态机设计
### 拼饭订单状态流转
```
发起拼饭 → 等待匹配 → 匹配成功 → 讨论中 → 已下单 → 配送中 → 已完成 → 已评价
```
### 用户状态定义  
```
在线 → 匹配中 → 拼饭中 → 用餐中 → 离线
```

# 5. 非功能性需求

## 5.1 性能指标
- **启动性能**：冷启动<2秒，热启动<1秒
- **响应性能**：匹配推荐<5秒，支付响应<3秒
- **并发处理**：支持10万+用户同时在线
- **成功率指标**：匹配成功率≥80%，支付成功率≥99%

## 5.2 安全性要求
- **数据加密**：用户敏感信息AES-256加密存储
- **支付安全**：接入银联/支付宝安全认证体系
- **隐私保护**：位置信息脱敏处理，不存储精确坐标  
- **防作弊**：设备指纹识别，防止恶意注册

## 5.3 兼容性矩阵
- **Android版本**：支持Android 7.0+ (API Level 24+)
- **屏幕适配**：支持5.0-7.0寸屏幕，分辨率1080p+
- **硬件要求**：RAM≥3GB，存储空间≥100MB
- **网络环境**：支持4G/5G/WiFi，弱网环境优雅降级

# 6. 附录

## 6.1 术语表
- **拼饭**：多个用户组团订餐，分摊费用的行为
- **拼友**：参与同一次拼饭的其他用户
- **发起人**：创建拼饭需求的用户，负责统一下单
- **智能匹配**：基于地理位置、时间、偏好的用户推荐算法

## 6.2 参考文档
- 《移动支付安全规范》
- 《个人信息保护法》合规指引
- Android开发规范文档
- 美团拼好饭产品体验报告

---

**【设计输入说明】**
请UI/UX设计师重点关注以下设计要素：
- **核心用户流程**：发起拼饭→匹配确认→群聊讨论→统一下单→分账支付的完整链路体验
- **关键交互节点**：匹配结果页、拼饭群聊界面、分账确认页面的用户操作体验
- **品牌透传要求**：温暖、社交、高效的产品调性，橙色为主色调，体现美食社交属性
- **特殊状态设计**：无匹配结果、网络异常、支付失败等异常状态的友好提示设计

**下一步操作指引：**
PRD文档已完成，现在可以输入 **/设计** 召唤UI/UX设计师，开始产品的视觉设计和交互规范制定。