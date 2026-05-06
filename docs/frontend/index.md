# 前端概述

灵蛙前端项目是一个基于 React 18 和 TypeScript 的现代化前端应用平台，采用 pnpm monorepo 工作空间和 qiankun 微前端架构。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 18.x | UI 框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 6.x | 构建工具 |
| Ant Design | 5.x | UI 组件库 |
| pnpm | 10.x | 包管理器 |
| qiankun | 2.10.x | 微前端框架 |
| Zustand | 4.x | 状态管理 |

## 项目特点

### Monorepo 工作空间

使用 pnpm workspace 管理多个包和应用：

- **共享包**：类型定义、工具函数、API 客户端、UI 组件库
- **应用**：管理后台主应用、各业务微应用

### 微前端架构

采用 qiankun 微前端方案：

- **主应用**：作为基座，负责加载和协调微应用
- **微应用**：独立开发、独立部署、按需加载

### 开发体验

- **Vite**：极速的开发服务器启动和热更新
- **TypeScript**：完整的类型检查和智能提示
- **ESLint + Prettier**：代码规范和格式化

## 快速开始

```bash
cd afg-frontend

# 安装依赖
pnpm install

# 启动开发服务器（admin 应用）
pnpm dev

# 启动所有应用
pnpm dev:all

# 构建
pnpm build
```

## 相关文档

- [技术栈详解](/frontend/tech-stack)
- [项目结构](/frontend/structure)
- [开发指南](/frontend/development)
- [微前端集成](/frontend/micro-frontend)