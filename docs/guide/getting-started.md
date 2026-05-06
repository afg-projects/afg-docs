# 快速开始

本指南将帮助你快速搭建灵蛙企业级应用平台的开发环境。

## 环境要求

### 前端

- Node.js >= 20
- pnpm 10+

### 后端

- JDK 25
- Gradle 8.x（项目自带 wrapper）

## 克隆项目

```bash
# 克隆前端项目
git clone https://github.com/afg-projects/afg-frontend.git

# 克隆后端项目
git clone https://github.com/afg-projects/afg-backend.git

# 克隆框架项目
git clone https://github.com/afg-projects/afg-framework.git
```

## 前端开发

```bash
cd afg-frontend

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 后端开发

```bash
cd afg-backend

# 构建项目
./gradlew build

# 运行测试
./gradlew test

# 启动应用
./gradlew bootRun
```

## 框架开发

```bash
cd afg-framework

# 构建所有模块
./gradlew build

# 运行测试
./gradlew test

# 发布到本地 Maven 仓库
./gradlew publishToMavenLocal
```

## 下一步

- [项目结构](/guide/structure) - 了解项目的目录结构
- [前端文档](/frontend/) - 深入了解前端开发
- [后端文档](/backend/) - 深入了解后端开发
