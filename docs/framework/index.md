# 框架概述

灵蛙框架是一个企业级 Java 开发框架，提供轻量级 ORM、缓存管理、分布式锁、延迟队列等核心能力。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Java | 25 | LTS 版本 |
| Spring Boot | 4.0.5 | 自动配置 |
| Gradle | 9.4 | Kotlin DSL |

## 模块结构

```
afg-framework/
├── core/                    # 核心功能
│   ├── cache/              # 缓存管理
│   ├── lock/               # 分布式锁
│   ├── event/              # 事件发布
│   ├── exception/          # 异常处理
│   ├── security/           # 安全防护
│   ├── scheduler/          # 任务调度
│   ├── web/                # Web 增强
│   └── module/             # 模块系统
├── data-core/               # 数据访问抽象层
│   ├── DataManager         # 数据操作入口
│   ├── EntityProxy         # 实体操作代理
│   ├── EntityQuery         # 条件查询
│   ├── page/               # 分页支持
│   ├── query/              # 查询条件
│   ├── tenant/             # 多租户
│   └── datascope/          # 数据权限
├── data-impl/
│   ├── data-jdbc/          # JDBC 增强实现
│   ├── data-sql/           # SQL 构建器
│   └── data-liquibase/     # 数据库迁移
├── spring-boot-starter/     # 自动配置
└── integration/             # 中间件集成
    ├── afg-redis/          # Redis：缓存、分布式锁、延迟队列
    ├── afg-kafka/          # Kafka 事件发布
    ├── afg-rabbitmq/       # RabbitMQ 消息队列
    ├── afg-websocket/      # WebSocket 实时通信
    ├── afg-storage/        # 文件存储
    ├── afg-nacos/          # Nacos 配置中心
    ├── afg-apollo/         # Apollo 配置中心
    ├── afg-consul/         # Consul 服务发现
    └── afg-jdbc/           # JDBC 审计日志存储
```

## Maven 依赖

```xml
<dependency>
    <groupId>io.github.afg-projects</groupId>
    <artifactId>afg-framework-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Gradle (Kotlin DSL)

```kotlin
implementation("io.github.afg-projects:afg-framework-spring-boot-starter:1.0.0")
```

## 支持的数据库

- MySQL / OceanBase
- PostgreSQL / GaussDB / OpenGauss / Kingbase
- Oracle
- SQL Server
- H2
- DM (达梦)

## 相关文档

- [核心模块](/framework/core)
- [数据访问](/framework/data)
- [Redis 集成](/framework/redis)