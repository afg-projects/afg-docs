# 开发指南

本指南介绍前端项目的开发流程和最佳实践。

## 环境准备

### 安装 Node.js

推荐使用 nvm 管理 Node.js 版本：

```bash
# 安装 Node.js 20
nvm install 20
nvm use 20
```

### 安装 pnpm

```bash
npm install -g pnpm
```

## 项目启动

```bash
cd afg-frontend

# 安装依赖
pnpm install

# 启动开发服务器（admin 应用）
pnpm dev

# 启动所有应用
pnpm dev:all
```

## 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动 admin 应用开发服务器 |
| `pnpm dev:all` | 启动所有应用 |
| `pnpm build` | 构建所有包和应用 |
| `pnpm build:admin` | 构建 admin 应用 |
| `pnpm build:micro` | 构建微应用 |
| `pnpm lint` | 代码检查 |
| `pnpm test` | 运行测试 |

## 包开发

### 创建新包

```bash
# 在 packages 目录下创建新包
mkdir packages/new-package
cd packages/new-package

# 初始化 package.json
pnpm init
```

### 包引用

在包的 `package.json` 中声明依赖：

```json
{
  "dependencies": {
    "@afg/types": "workspace:*",
    "@afg/shared": "workspace:*"
  }
}
```

## 组件开发

### 创建组件

```tsx
// packages/ui/src/components/Button/Button.tsx
import { FC, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export const Button: FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  )
}
```

### 导出组件

```tsx
// packages/ui/src/index.ts
export * from './components/Button'
export * from './components/Input'
```

## 微应用开发

### 创建微应用

1. 在 `apps/micro-apps/` 下创建目录
2. 配置 `vite.config.ts` 支持微前端
3. 在主应用中注册微应用

### 微应用入口

```tsx
// apps/micro-apps/xxx/src/main.tsx
import './public-path'
import { createRoot } from 'react-dom/client'
import App from './App'

let root: Root

function render(props: { container?: Element }) {
  const container = props.container || document.getElementById('root')
  root = createRoot(container!)
  root.render(<App />)
}

// 独立运行
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({})
}

// qiankun 生命周期
export async function mount(props: any) {
  render(props)
}

export async function unmount() {
  root?.unmount()
}
```

## 代码规范

### ESLint

项目使用 ESLint 进行代码检查：

```bash
pnpm lint
```

### Prettier

代码格式化：

```bash
pnpm format
```

## 相关文档

- [技术栈](/frontend/tech-stack)
- [项目结构](/frontend/structure)
- [微前端集成](/frontend/micro-frontend)
