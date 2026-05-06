# 组织架构模块

组织架构模块提供部门、员工、岗位等组织管理功能。

## 功能列表

| 功能 | 说明 |
|------|------|
| 部门管理 | 组织架构树形管理 |
| 员工管理 | 员工信息维护 |
| 岗位管理 | 岗位信息维护 |

## 部门管理

### API 接口

```http
# 获取部门树
GET /api/org/departments/tree

# 创建部门
POST /api/org/departments
{
  "name": "技术部",
  "parentId": 0,
  "leader": "张三",
  "sort": 1
}

# 更新部门
PUT /api/org/departments/{id}

# 删除部门
DELETE /api/org/departments/{id}
```

### 数据结构

```sql
CREATE TABLE sys_dept (
    id BIGINT PRIMARY KEY,
    parent_id BIGINT DEFAULT 0,
    name VARCHAR(50) NOT NULL,
    leader VARCHAR(50),
    phone VARCHAR(20),
    sort INT DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME
);
```

## 员工管理

### API 接口

```http
# 获取员工列表
GET /api/org/employees?page=1&size=10&deptId=1

# 创建员工
POST /api/org/employees
{
  "name": "张三",
  "deptId": 1,
  "postId": 1,
  "phone": "13800138000",
  "email": "zhangsan@example.com"
}
```

## 岗位管理

### API 接口

```http
# 获取岗位列表
GET /api/org/posts

# 创建岗位
POST /api/org/posts
{
  "name": "开发工程师",
  "code": "dev",
  "sort": 1
}
```

## 相关文档

- [系统管理](/backend/system)
- [开发指南](/backend/development)
