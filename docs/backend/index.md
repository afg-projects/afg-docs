# 后端概述

灵蛙后端项目是一个基于 Java 25 和 Spring Boot 4 的企业级业务后端服务，支持微服务独立部署或聚合部署。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Java | 25 | LTS 版本 |
| Spring Boot | 4.0.5 | 应用框架 |
| Spring Cloud Alibaba | 2023.0.1.0 | 微服务解决方案 |
| Gradle | 8.x | 构建工具 |
| MyBatis | 3.x | ORM 框架 |

## 项目特点

### 模块化设计

业务模块独立开发，支持：

- **聚合部署**：所有模块打包为一个应用
- **独立部署**：每个模块作为独立的微服务

### 依赖框架

依赖 afg-framework 提供的基础能力：

```kotlin
implementation("io.github.afg-projects:afg-framework-spring-boot-starter:1.0.0-SNAPSHOT")
```

### 业务模块

- **auth**：认证授权
- **system**：系统管理（用户、角色、字典）
- **organization**：组织架构（部门、员工）
- **logging**：日志审计
- **file**：文件管理

## 快速开始

```bash
cd afg-backend

# 构建
./gradlew build

# 运行测试
./gradlew test

# 启动应用
./gradlew bootRun
```

## 相关文档

- [技术栈详解](/backend/tech-stack)
- [项目结构](/backend/structure)
- [开发指南](/backend/development)
- [认证授权](/backend/auth)