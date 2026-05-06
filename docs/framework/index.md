# 框架概述

灵蛙框架是一个企业级 Java 开发框架，提供缓存、事件、安全、数据访问等核心能力，以及 Redis、Kafka、RabbitMQ 等中间件集成。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Java | 25 | LTS 版本 |
| Spring Boot | 4.0.5 | 自动配置 |
| Gradle | 8.x | 构建工具 |

## 核心模块

### core

核心模块提供基础能力：

- **缓存**：本地缓存、分布式缓存抽象
- **事件**：事件发布订阅机制
- **异常**：统一的异常处理
- **安全**：安全相关的工具类
- **调度**：任务调度抽象

### data-core & data-impl

数据访问层：

- **data-core**：数据访问抽象接口
- **data-sql**：SQL 解析与构建器
- **data-jdbc**：JDBC 增强实现
- **data-liquibase**：数据库迁移

## 中间件集成

| 模块 | 说明 |
|------|------|
| afg-redis | 缓存、分布式锁、延迟队列 |
| afg-kafka | 事件发布 |
| afg-rabbitmq | 消息队列 |
| afg-websocket | 实时通信 |
| afg-storage | 文件存储（本地、OSS、S3） |
| afg-nacos | 配置中心 |
| afg-apollo | 配置中心 |
| afg-consul | 服务发现 |

## 快速开始

```bash
cd afg-framework

# 构建
./gradlew build

# 运行测试
./gradlew test

# 发布到本地
./gradlew publishToMavenLocal
```

## Maven 依赖

```xml
<dependency>
    <groupId>io.github.afg-projects</groupId>
    <artifactId>afg-framework-spring-boot-starter</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

## 相关文档

- [核心模块](/framework/core)
- [数据访问](/framework/data)
- [Redis 集成](/framework/redis)