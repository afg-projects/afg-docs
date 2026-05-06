# 技术栈详解

后端项目采用现代化的 Java 技术栈，构建企业级业务服务。

## 核心技术

### Java 25

- **LTS 版本**：长期支持版本
- **虚拟线程**：轻量级线程支持
- **模式匹配**：增强的模式匹配
- **记录类**：简化数据类定义

### Spring Boot 4.0.5

- **自动配置**：约定优于配置
- **嵌入式容器**：内置 Tomcat/Jetty
- **Actuator**：生产级监控端点
- **DevTools**：开发时热重载

### Spring Cloud Alibaba 2023.0.1.0

- **Nacos**：服务注册与配置中心
- **Sentinel**：流量控制与熔断
- **Seata**：分布式事务
- **RocketMQ**：消息队列

## 构建工具

### Gradle 8.x

使用 Kotlin DSL 配置：

```kotlin
// build.gradle.kts
plugins {
    java
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("io.github.afg-projects:afg-framework-spring-boot-starter")
}
```

## 数据访问

### MyBatis 3.x

- **SQL 映射**：灵活的 SQL 编写
- **动态 SQL**：条件化的 SQL 生成
- **插件扩展**：分页、审计等插件

### 数据库支持

- MySQL 8.x
- PostgreSQL 16.x
- Oracle 21c

## 安全框架

### Spring Security 6

- **OAuth 2.0**：授权服务器
- **JWT**：无状态认证
- **方法安全**：注解式权限控制

## 依赖框架

### afg-framework

```kotlin
implementation("io.github.afg-projects:afg-framework-spring-boot-starter:1.0.0-SNAPSHOT")
```

提供的能力：

- 缓存抽象
- 事件发布
- 异常处理
- 数据访问增强
- 中间件集成

## 相关文档

- [项目结构](/backend/structure)
- [开发指南](/backend/development)
