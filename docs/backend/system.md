# 系统管理模块

系统管理模块提供用户、角色、菜单、字典等基础管理功能。

## 功能列表

| 功能 | 说明 |
|------|------|
| 用户管理 | 用户的增删改查、分配角色 |
| 角色管理 | 角色的增删改查、分配权限 |
| 菜单管理 | 菜单的增删改查、权限配置 |
| 字典管理 | 数据字典的维护 |

## 用户管理

### API 接口

```http
# 获取用户列表
GET /api/system/users?page=1&size=10

# 创建用户
POST /api/system/users
{
  "username": "test",
  "password": "123456",
  "realName": "测试用户",
  "deptId": 1,
  "roleIds": [1, 2]
}

# 更新用户
PUT /api/system/users/{id}

# 删除用户
DELETE /api/system/users/{id}
```

### 数据结构

```sql
CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    real_name VARCHAR(50),
    dept_id BIGINT,
    status TINYINT DEFAULT 1,
    created_at DATETIME,
    updated_at DATETIME
);
```

## 角色管理

### API 接口

```http
# 获取角色列表
GET /api/system/roles

# 创建角色
POST /api/system/roles
{
  "name": "管理员",
  "code": "admin",
  "menuIds": [1, 2, 3]
}

# 分配权限
PUT /api/system/roles/{id}/permissions
{
  "menuIds": [1, 2, 3, 4]
}
```

## 菜单管理

### 数据结构

```sql
CREATE TABLE sys_menu (
    id BIGINT PRIMARY KEY,
    parent_id BIGINT,
    name VARCHAR(50) NOT NULL,
    path VARCHAR(200),
    component VARCHAR(200),
    permission VARCHAR(100),
    sort INT DEFAULT 0,
    type TINYINT, -- 0:目录 1:菜单 2:按钮
    icon VARCHAR(50)
);
```

## 字典管理

### API 接口

```http
# 获取字典类型列表
GET /api/system/dict/types

# 获取字典数据
GET /api/system/dict/types/{type}/data

# 创建字典数据
POST /api/system/dict/data
{
  "typeId": 1,
  "label": "正常",
  "value": "1",
  "sort": 1
}
```

## 相关文档

- [认证授权](/backend/auth)
- [组织架构](/backend/organization)
