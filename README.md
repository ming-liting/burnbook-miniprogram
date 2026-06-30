# 🔥 燃本 BURNBOOK — 健身训练微信小程序

> 记录每一滴汗水 · Record Every Sweat

---

## 📱 功能

| 模块 | 说明 |
|------|------|
| 🚀 启动页 | 品牌 Logo 展示 |
| 🔐 微信授权登录 | 原生 wx.getUserProfile / chooseAvatar 授权 |
| 🏠 首页 | 今日消耗 + 最近训练 |
| ⏱️ 自由训练 | 计时器 + 动作添加 + 组数/重量/次数记录 + 组间休息 + 训练归档 |
| 📚 动作库 | 左侧分类 + 右侧动作卡片 + 搜索 + 多选 + 收藏 |
| 📋 训练记录 | 历史列表 + 展开详情 + 复用 + 删除 |
| 📊 数据概览 | 本周统计 + 简约周日历 |
| 📈 训练进度 | 卡路里周曲线 + 训练部位分布 |
| 👤 个人中心 | 头像/昵称 + 菜单 + 退出登录 |

---

## 🛠 技术栈

- **框架**：原生微信小程序
- **后端**：微信云开发 CloudBase
- **存储**：本地 Storage + 云端数据库双向同步
- **设计**：深色主题 · 荧光绿 #E2F163 · 紫色 #896CFE

---

## 🚀 本地运行

1. 克隆仓库
2. 微信开发者工具 → 导入项目 → 选择根目录
3. 开通云开发 → 替换 `miniprogram/app.js` 中的环境 ID
4. 部署云函数：右键 `cloudfunctions/` → 上传并部署
5. 创建数据库集合：`user_info` / `train_records`
6. 编译运行

---

## 📁 项目结构

```
├── cloudfunctions/        # 云函数
│   ├── login/            # 用户登录 + openid
│   └── trainRecords/     # 训练记录 CRUD
├── miniprogram/           # 小程序源码
│   ├── pages/            # 10 个页面
│   │   ├── launch/       # 启动页
│   │   ├── login/        # 登录页
│   │   ├── home/         # 首页
│   │   ├── training/     # 训练入口
│   │   ├── timer/        # 计时训练
│   │   ├── exercises/    # 动作库
│   │   ├── workout/      # 训练记录
│   │   ├── record/       # 数据概览
│   │   ├── progress/     # 训练进度
│   │   └── profile/      # 个人中心
│   ├── app.js/json/wxss  # 全局配置
│   └── sitemap.json
└── project.config.json
```

---

## 📄 License

MIT
