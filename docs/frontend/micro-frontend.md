# qiankun 微前端集成

本项目采用 qiankun 作为微前端解决方案，实现主应用与微应用的解耦和独立部署。

## 架构概述

```
┌─────────────────────────────────────┐
│           主应用 (admin)             │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │ 导航    │ │ 布局    │ │ 菜单   │ │
│  └─────────┘ └─────────┘ └────────┘ │
│  ┌─────────────────────────────────┐│
│  │        微应用容器区域            ││
│  │  ┌─────────────────────────────┐││
│  │  │  微应用 (system/xxx/...)    │││
│  │  └─────────────────────────────┘││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## 主应用配置

### 安装 qiankun

```bash
pnpm add qiankun --filter @afg/admin
```

### 注册微应用

```tsx
// apps/admin/src/micro/index.ts
import { registerMicroApps, start } from 'qiankun'

const microApps = [
  {
    name: 'system',
    entry: '//localhost:3001',
    container: '#micro-container',
    activeRule: '/system'
  }
]

registerMicroApps(microApps, {
  beforeLoad: (app) => console.log('加载微应用', app.name),
  afterMount: (app) => console.log('挂载完成', app.name)
})

start()
```

### 微应用容器

```tsx
// apps/admin/src/layouts/MainLayout.tsx
<div className="main-content">
  <div id="micro-container"></div>
</div>
```

## 微应用配置

### Vite 配置

```ts
// apps/micro-apps/system/vite.config.ts
export default defineConfig({
  base: window.__POWERED_BY_QIANKUN__ ? '/system/' : '/',
  server: {
    port: 3001,
    cors: true,
    origin: 'http://localhost:3001'
  }
})
```

### 入口文件

```tsx
// apps/micro-apps/system/src/main.tsx
import './public-path'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

let root: Root
let routerBase: string

function render(props: any = {}) {
  const { container, base = '/system' } = props
  routerBase = base

  const appContainer = container
    ? container.querySelector('#root')
    : document.getElementById('root')

  root = createRoot(appContainer!)
  root.render(
    <BrowserRouter basename={routerBase}>
      <App />
    </BrowserRouter>
  )
}

// 独立运行
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render()
}

// qiankun 生命周期
export async function bootstrap() {
  console.log('微应用启动')
}

export async function mount(props: any) {
  render(props)
}

export async function unmount() {
  root?.unmount()
}
```

### 公共路径

```ts
// apps/micro-apps/system/src/public-path.ts
if ((window as any).__POWERED_BY_QIANKUN__) {
  // @ts-ignore
  __webpack_public_path__ = (window as any).__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
```

## 开发调试

### 启动所有应用

```bash
# 同时启动主应用和所有微应用
pnpm dev:all
```

### 单独启动

```bash
# 启动主应用
pnpm dev

# 在另一个终端启动微应用
pnpm --filter @afg/micro-system dev
```

## 生产部署

### 构建微应用

```bash
pnpm build:micro
```

### 部署配置

微应用需要配置 CORS 头：

```nginx
# Nginx 配置
location /micro/system {
  add_header Access-Control-Allow-Origin *;
  add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
}
```

## 相关文档

- [开发指南](/frontend/development)
- [微应用开发](/frontend/micro-apps)
