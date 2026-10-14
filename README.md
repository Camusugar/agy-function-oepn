<div align="center">

![agy-function-oepn](assets/banner.jpg)

# agy-function-oepn

*Antigravity 隐匿功能激活与探索工具箱*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey.svg)](https://github.com/Camusugar/agy-function-oepn)
[![Antigravity](https://img.shields.io/badge/Antigravity-v2.15%2B-purple.svg)](https://github.com/Camusugar/agy-function-oepn)

</div>

---

`agy-function-oepn` 专为 Google Antigravity / Gemini Desktop 客户端打造，提供底层无损热补丁与自动化调试接口，用于解锁官方隐藏的开发特性、分叉会话功能、F12 轨迹调试面板以及探索 70+ 项未公开的实验性功能。

## 核心特性

- **F12 轨迹调试面板一键激活**：采用 ASAR 原位等长字节替换算法（0 Header Drift、0 字节位移），在不破坏 Electron 归档索引的前提下秒级注入 F12 快捷键，即使官方升级覆盖也能一键复原。
- **Fork Conversation（会话分叉）解锁**：开启历史步阶分叉与独立 Git Worktree 分支能力，让单条长对话随时派生多条探索分支。
- **70+ 项实验性特性自由探索**：动态提取并管理 Antigravity 前端未公开的 Feature Flags（包括 Multi-Agent Team、Battle Mode、Thought Editing、Split View 等）。
- **原生开发者设置面板呼出**：无刷新唤起 Antigravity 内部隐藏的 `Settings -> Developer` 配置界面。

---

## 快速上手

### 环境要求

- Node.js 18+（支持 Windows 与 WSL / Linux 环境）
- 运行中的 Google Antigravity 客户端

### 1. 恢复 / 开启 F12 调试面板

运行零漂移补丁脚本：

```bash
node scripts/patch_f12.js
```

在 Antigravity 窗口中按下 `Ctrl + R` 或重启应用，随后按下 `F12` 即可一键开关 Trajectory Debug 调试面板。

### 2. 开启 Fork 会话分叉功能

执行分叉特性激活命令：

```bash
node scripts/enable_fork.js
```

脚本将通过 CDP 自动注入分叉配置并刷新页面。刷新后，消息卡片右上角将立即展示 `Fork Conversation` 图标。

### 3. 探索未发布的实验功能

#### 列出当前客户端支持的所有实验特性
```bash
node scripts/explore_flags.js list
```

#### 查看当前已激活的特性覆盖
```bash
node scripts/explore_flags.js status
```

#### 开启指定的实验功能
```bash
node scripts/explore_flags.js enable enable-thought-editing enable-split-view
```

#### 打开隐藏的 Developer 设置界面
```bash
node scripts/explore_flags.js devscreen
```

#### 恢复官方默认配置
```bash
node scripts/explore_flags.js reset
```

---

## 目录结构

```text
agy-function-oepn/
├── SKILL.md                  # 符合标准规范的 Skill 入口与工作流定义
├── README.md                 # 项目使用说明
├── assets/
│   └── banner.jpg            # 项目横幅图片
├── scripts/
│   ├── patch_f12.js          # ASAR 等长无损补丁脚本
│   ├── enable_fork.js        # 会话分叉一键激活脚本
│   ├── explore_flags.js      # 特性探测与配置管理工具
│   └── cdp_helper.js         # 自动化调试协议客户端
└── references/
    ├── feature-flags.md      # 实验性 Feature Flags 完整字典
    └── developer-settings.md # 底层架构与 CDP 调试协议参考
```

---

## 开源协议

本项目采用 [MIT License](LICENSE)。
