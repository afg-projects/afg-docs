# 数据访问模块

数据访问模块提供 JDBC 增强、SQL 构建器、数据库迁移等能力。

## 模块结构

```
data-core/       # 数据访问抽象
data-impl/
├── data-sql/       # SQL 构建器
├── data-jdbc/      # JDBC 增强
└── data-liquibase/ # 数据库迁移
```

## data-core

### 接口定义

```java
public interface Repository<T, ID> {

    T findById(ID id);

    List<T> findAll();

    T save(T entity);

    void deleteById(ID id);
}
```

## data-jdbc

### 查询增强

```java
@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<User> findByCondition(UserQuery query) {
        return jdbcTemplate.query(
            "SELECT * FROM sys_user WHERE status = ?",
            (rs, rowNum) -> mapRow(rs),
            query.getStatus()
        );
    }
}
```

### 分页查询

```java
public PageResult<User> findPage(PageQuery query) {
    String sql = "SELECT * FROM sys_user";
    return jdbcTemplate.queryForPage(sql, query, User.class);
}
```

## data-sql

### SQL 构建器

```java
String sql = SqlBuilder.select()
    .from("sys_user")
    .where("status = ?", 1)
    .where("dept_id IN (?)", deptIds)
    .orderBy("created_at DESC")
    .limit(10)
    .build();
```

### 动态条件

```java
SqlBuilder builder = SqlBuilder.select()
    .from("sys_user");

if (query.getUsername() != null) {
    builder.where("username LIKE ?", "%" + query.getUsername() + "%");
}

if (query.getStatus() != null) {
    builder.where("status = ?", query.getStatus());
}
```

## data-liquibase

### 配置迁移

```yaml
# db/changelog/db.changelog-master.yaml
databaseChangeLog:
  - include:
      file: db/changelog/changes/001-init-user.yaml
  - include:
      file: db/changelog/changes/002-add-dept.yaml
```

### 变更集示例

```yaml
# db/changelog/changes/001-init-user.yaml
databaseChangeLog:
  - changeSet:
      id: 001-init-user
      author: admin
      changes:
        - createTable:
            tableName: sys_user
            columns:
              - column:
                  name: id
                  type: BIGINT
                  constraints:
                    primaryKey: true
              - column:
                  name: username
                  type: VARCHAR(50)
                  constraints:
                    nullable: false
```

## 相关文档

- [核心模块](/framework/core)
- [Redis 集成](/framework/redis)
