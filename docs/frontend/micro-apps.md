# 微应用开发

本指南介绍如何开发和管理微前端架构中的微应用。

## 创建新微应用

### 1. 创建目录结构

```bash
mkdir -p apps/micro-apps/new-app/src
```

### 2. 配置 package.json

```json
{
  "name": "@afg/micro-new-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

### 3. 配置 Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: window.__POWERED_BY_QIANKUN__ ? '/new-app/' : '/',
  server: {
    port: 3002,
    cors: true,
    origin: 'http://localhost:3002'
  }
})
```

### 4. 创建入口文件

```tsx
// src/main.tsx
import './public-path'
import { createRoot } from 'react-dom/client'
import App from './App'

let root: Root

function render(props: any = {}) {
  const container = props.container?.querySelector('#root') || document.getElementById('root')
  root = createRoot(container!)
  root.render(<App />)
}

if (!(window as any).__POWERED_BY_QIANKUN__) {
  render()
}

export async function mount(props: any) {
  render(props)
}

export async function unmount() {
  root?.unmount()
}
```

## 现有微应用

### @afg/micro-system

系统管理微应用，包含：

- 用户管理
- 角色管理
- 菜单管理
- 字典管理

## 最佳实践

### 样式隔离

使用 CSS Modules 或 CSS-in-JS 避免样式冲突：

```tsx
// 推荐：CSS Modules
import styles from './index.module.css'

// 推荐：styled-components
const Container = styled.div`
  padding: 16px;
`
```

### 状态隔离

每个微应用维护独立的状态：

```tsx
// 使用 Zustand
const useStore = create((set) => ({
  data: [],
  setData: (data) => set({ data })
}))
```

### 通信机制

通过 props 和事件进行通信：

```tsx
// 主应用传递 props
<micro-app user={currentUser} onLogout={handleLogout} />

// 微应用接收
export function mount(props) {
  const { user, onLogout } = props
}
```

## 相关文档

- [qiankun 集成](/frontend/micro-frontend)
- [开发指南](/frontend/development)
