# 项目结构

后端项目采用模块化设计，支持微服务独立部署或聚合部署。

## 顶层结构

```
afg-backend/
├── common/              # 公共模块
├── afg-gateway/         # API 网关
├── afg-platform/        # 聚合部署主应用
├── modules/             # 业务模块
│   ├── auth/
│   ├── system/
│   ├── organization/
│   ├── logging/
│   └── file/
├── build.gradle.kts
└── settings.gradle.kts
```

## 模块说明

### common

公共模块，包含：

```
common/
├── src/main/java/
│   ├── constant/        # 常量定义
│   ├── enums/           # 枚举类
│   ├── exception/       # 异常定义
│   └── util/            # 工具类
└── build.gradle.kts
```

### afg-gateway

API 网关（微服务独立部署时使用）：

```
afg-gateway/
├── src/main/java/
│   ├── config/          # 网关配置
│   ├── filter/          # 过滤器
│   └── handler/         # 处理器
└── build.gradle.kts
```

### afg-platform

聚合部署主应用：

```
afg-platform/
├── src/main/java/
│   └── AfgPlatformApplication.java
├── src/main/resources/
│   ├── application.yml
│   └── application-dev.yml
└── build.gradle.kts
```

### modules

业务模块目录：

```
modules/
├── auth/                # 认证授权
│   ├── src/main/java/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   └── entity/
│   └── build.gradle.kts
│
├── system/              # 系统管理
│   ├── user/            # 用户管理
│   ├── role/            # 角色管理
│   ├── menu/            # 菜单管理
│   └── dict/            # 字典管理
│
├── organization/        # 组织架构
│   ├── department/      # 部门管理
│   └── employee/        # 员工管理
│
├── logging/             # 日志审计
│   └── audit/           # 操作日志
│
└── file/                # 文件管理
    ├── storage/         # 存储服务
    └── preview/         # 文件预览
```

## 模块依赖

```
┌─────────────┐
│   gateway   │ (可选，独立部署时使用)
└──────┬──────┘
       │
┌──────▼──────┐
│  platform   │ (聚合部署)
└──────┬──────┘
       │
┌──────▼──────┐
│   modules   │
├─────────────┤
│ auth        │
│ system      │
│ organization│
│ logging     │
│ file        │
└──────┬──────┘
       │
┌──────▼──────┐
│   common    │
└─────────────┘
```

## 相关文档

- [技术栈](/backend/tech-stack)
- [开发指南](/backend/development)
