# 灵蛙企业级应用平台文档

基于 VitePress 构建的文档站点。

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 文档结构

```
docs/
├── .vitepress/     # VitePress 配置
├── guide/          # 指南文档
├── frontend/       # 前端文档
├── backend/        # 后端文档
├── framework/      # 框架文档
└── public/         # 静态资源
```

## GitHub Pages 部署

本项目配置了 GitHub Actions 自动部署到 GitHub Pages。

推送代码后，访问：`https://afg-projects.github.io/afg-docs/`
