# 认证授权

认证授权模块提供用户登录、权限控制等功能。

## 功能特性

- 用户名密码登录
- JWT Token 认证
- OAuth 2.0 支持
- RBAC 权限模型
- 数据权限控制

## 登录流程

```
┌────────┐     ┌────────┐     ┌────────┐
│  用户  │────▶│  登录  │────▶│  验证  │
└────────┘     └────────┘     └────────┘
                                   │
                                   ▼
                              ┌────────┐
                              │  JWT   │
                              └────────┘
                                   │
                                   ▼
                              ┌────────┐
                              │  返回  │
                              └────────┘
```

## API 接口

### 登录

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

响应：

```json
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 7200
  }
}
```

### 刷新 Token

```http
POST /api/auth/refresh
Authorization: Bearer {token}
```

### 登出

```http
POST /api/auth/logout
Authorization: Bearer {token}
```

## 权限控制

### 注解方式

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    @PreAuthorize("hasAuthority('user:list')")
    public PageResult<UserVO> list() {
        // ...
    }

    @PostMapping
    @PreAuthorize("hasAuthority('user:create')")
    public UserVO create(@RequestBody UserDTO dto) {
        // ...
    }
}
```

### 数据权限

```java
@DataScope(
    tableAlias = "u",
    deptAlias = "dept_id"
)
public List<User> selectUserList(UserQuery query) {
    return userMapper.selectByCondition(query);
}
```

## 配置说明

```yaml
# application.yml
afg:
  security:
    jwt:
      secret: your-secret-key
      expiration: 7200
    ignore-urls:
      - /api/auth/login
      - /api/auth/captcha
```

## 相关文档

- [系统管理](/backend/system)
- [开发指南](/backend/development)
