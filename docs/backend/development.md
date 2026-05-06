# 开发指南

本指南介绍后端项目的开发流程和最佳实践。

## 环境准备

### 安装 JDK 25

推荐使用 SDKMAN：

```bash
# 安装 SDKMAN
curl -s "https://get.sdkman.io" | bash

# 安装 JDK 25
sdk install java 25-tem
```

### 配置 Gradle

项目自带 Gradle Wrapper，无需单独安装：

```bash
./gradlew --version
```

## 项目启动

```bash
cd afg-backend

# 构建项目
./gradlew build

# 运行测试
./gradlew test

# 启动应用（聚合模式）
./gradlew :afg-platform:bootRun
```

## 开发命令

| 命令 | 说明 |
|------|------|
| `./gradlew build` | 构建所有模块 |
| `./gradlew test` | 运行所有测试 |
| `./gradlew :modules:system:test` | 运行单个模块测试 |
| `./gradlew bootRun` | 启动应用 |
| `./gradlew clean` | 清理构建 |

## 模块开发

### 创建新模块

1. 在 `modules/` 下创建目录：

```bash
mkdir -p modules/new-module/src/main/java
```

2. 创建 `build.gradle.kts`：

```kotlin
plugins {
    java
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}

dependencies {
    implementation(project(":common"))
    implementation("org.springframework.boot:spring-boot-starter-web")
}
```

3. 在 `settings.gradle.kts` 中注册：

```kotlin
include(":modules:new-module")
```

### 模块结构

```
modules/new-module/
├── src/main/java/
│   └── com/afg/newmodule/
│       ├── controller/     # REST 控制器
│       ├── service/        # 业务服务
│       ├── repository/     # 数据访问
│       ├── entity/         # 实体类
│       ├── dto/            # 数据传输对象
│       └── config/         # 模块配置
├── src/main/resources/
│   └── mapper/             # MyBatis 映射文件
└── build.gradle.kts
```

## REST API 开发

### 创建控制器

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public PageResult<UserVO> list(UserQuery query) {
        return userService.list(query);
    }

    @PostMapping
    public UserVO create(@RequestBody @Valid UserDTO dto) {
        return userService.create(dto);
    }
}
```

### 统一响应格式

```java
public record Result<T>(
    int code,
    String message,
    T data
) {
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }

    public static <T> Result<T> error(int code, String message) {
        return new Result<>(code, message, null);
    }
}
```

## 数据访问

### MyBatis Mapper

```java
@Mapper
public interface UserMapper {

    @Select("SELECT * FROM sys_user WHERE id = #{id}")
    User findById(Long id);

    List<User> selectByCondition(UserQuery query);
}
```

### Mapper XML

```xml
<!-- resources/mapper/UserMapper.xml -->
<mapper namespace="com.afg.system.mapper.UserMapper">
    <select id="selectByCondition" resultType="User">
        SELECT * FROM sys_user
        <where>
            <if test="username != null">
                AND username LIKE CONCAT('%', #{username}, '%')
            </if>
        </where>
    </select>
</mapper>
```

## 相关文档

- [技术栈](/backend/tech-stack)
- [项目结构](/backend/structure)
- [认证授权](/backend/auth)
