# 项目结构

本文档介绍灵蛙企业级应用平台的整体目录结构。

## 顶层结构

```
afg-projects/
├── afg-frontend/     # 前端项目
├── afg-backend/      # 后端项目
├── afg-framework/    # 基础框架
└── afg-docs/         # 文档项目
```

## 前端项目结构

```
afg-frontend/
├── packages/
│   ├── types/               # @afg/types - 共享类型定义
│   ├── shared/              # @afg/shared - 共享工具函数
│   ├── api-client/          # @afg/api-client - API 请求客户端
│   └── ui/                  # @afg/ui - React UI 组件库
└── apps/
    ├── admin/               # @afg/admin - 管理后台主应用（qiankun 基座）
    └── micro-apps/
        └── system/          # @afg/micro-system - 系统管理微应用
```

## 后端项目结构

```
afg-backend/
├── common/                  # 公共模块：工具类、常量
├── afg-gateway/             # API 网关（独立部署时使用）
├── afg-platform/            # 聚合部署主应用
└── modules/                 # 业务模块
    ├── auth/                # 认证授权模块
    ├── system/              # 系统管理模块：用户、角色、字典
    ├── organization/        # 组织架构模块：部门、员工
    ├── logging/             # 日志审计模块
    └── file/                # 文件管理模块
```

## 框架项目结构

```
afg-framework/
├── core/                    # 核心：缓存、事件、异常、安全、调度
├── data-core/               # 数据访问抽象层
├── data-impl/
│   ├── data-sql/            # SQL 解析与构建器
│   ├── data-jdbc/           # JDBC 增强实现
│   └── data-liquibase/      # Liquibase 数据库迁移
├── spring-boot-starter/     # Spring Boot 自动配置
├── integration/             # 中间件集成
│   ├── afg-redis/           # Redis：缓存、分布式锁、延迟队列
│   ├── afg-kafka/           # Kafka 事件发布
│   ├── afg-rabbitmq/        # RabbitMQ 消息队列
│   ├── afg-websocket/       # WebSocket 实时通信
│   ├── afg-storage/         # 文件存储：本地、OSS、S3
│   ├── afg-nacos/           # Nacos 配置中心
│   ├── afg-apollo/          # Apollo 配置中心
│   ├── afg-consul/          # Consul 服务发现
│   └── afg-jdbc/            # JDBC 审计日志存储
└── gradle-plugin/           # 自定义 Gradle 插件
```

## 相关链接

- [前端文档](/frontend/structure) - 前端项目详细结构
- [后端文档](/backend/structure) - 后端项目详细结构
- [框架文档](/framework/) - 框架模块详细说明
