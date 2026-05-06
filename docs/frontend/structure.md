# 项目结构

前端项目采用 pnpm monorepo 工作空间，包含共享包和应用两部分。

## 顶层结构

```
afg-frontend/
├── packages/           # 共享包
│   ├── types/         # 类型定义
│   ├── shared/        # 工具函数
│   ├── api-client/    # API 客户端
│   └── ui/            # UI 组件库
├── apps/              # 应用
│   ├── admin/         # 管理后台主应用
│   └── micro-apps/    # 微应用
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.json
```

## 共享包

### @afg/types

共享 TypeScript 类型定义：

```
packages/types/
├── src/
│   ├── user.ts        # 用户相关类型
│   ├── system.ts      # 系统相关类型
│   └── index.ts       # 导出入口
└── package.json
```

### @afg/shared

共享工具函数：

```
packages/shared/
├── src/
│   ├── utils/         # 工具函数
│   ├── hooks/         # 共享 Hooks
│   ├── constants/     # 常量定义
│   └── index.ts
└── package.json
```

### @afg/api-client

API 请求客户端：

```
packages/api-client/
├── src/
│   ├── request.ts     # 请求封装
│   ├── api/           # API 定义
│   └── index.ts
└── package.json
```

### @afg/ui

UI 组件库：

```
packages/ui/
├── src/
│   ├── components/    # 组件
│   ├── styles/        # 样式
│   └── index.ts
├── package.json
└── vite.config.ts     # Vite 构建配置
```

## 应用

### @afg/admin

管理后台主应用（qiankun 基座）：

```
apps/admin/
├── src/
│   ├── main.tsx       # 入口文件
│   ├── App.tsx        # 根组件
│   ├── layouts/       # 布局组件
│   ├── pages/         # 页面
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   └── micro/         # 微前端配置
├── public/
├── index.html
├── vite.config.ts
└── package.json
```

### @afg/micro-system

系统管理微应用：

```
apps/micro-apps/system/
├── src/
│   ├── main.tsx       # 入口（支持独立运行）
│   ├── public-path.ts # qiankun 公共路径
│   ├── pages/         # 页面
│   │   ├── user/      # 用户管理
│   │   ├── role/      # 角色管理
│   │   └── dict/      # 字典管理
│   └── router/
├── vite.config.ts
└── package.json
```

## 相关文档

- [技术栈](/frontend/tech-stack)
- [开发指南](/frontend/development)
