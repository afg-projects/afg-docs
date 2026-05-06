# 数据访问模块

数据访问模块提供轻量级 ORM、SQL 构建器、JDBC 增强等能力，支持多租户和数据权限。

## 核心概念

### DataManager

数据操作的全局入口，提供实体操作和 SQL 构建能力。

```java
public interface DataManager {

    // 实体操作
    <T> EntityProxy<T> entity(Class<T> entityClass);

    // SQL 构建
    SqlQueryBuilder query();
    SqlUpdateBuilder update();
    SqlInsertBuilder insert();
    SqlDeleteBuilder delete();

    // 事务管理
    void executeInTransaction(Runnable action);
    <T> T executeInTransaction(Supplier<T> action);
    <T> T executeInReadOnly(Supplier<T> action);

    // 租户管理
    TenantScope tenantScope(String tenantId);

    // 数据库信息
    DatabaseType getDatabaseType();
}
```

### EntityProxy

类型安全的实体操作入口，整合读取、写入、查询能力。

```java
public interface EntityProxy<T> extends EntityReader<T>, EntityWriter<T> {

    // 加载关联数据
    <R> R fetch(T entity, String name);
    void fetchAll(Iterable<T> entities, String name);

    // 便捷方法
    EntityQuery<T> withDataScope(DataScope scope);
    EntityQuery<T> withTenant(String tenantId);
    EntityQuery<T> withDataSource(String name);
    EntityQuery<T> withReadOnly();
    EntityQuery<T> includeDeleted();
    EntityQuery<T> withAssociation(String name);

    // 条件查询
    List<T> findAll(Condition condition);
    Page<T> findAll(Condition condition, PageRequest pageRequest);
    long count(Condition condition);
    boolean exists(Condition condition);
    Optional<T> findOne(Condition condition);
}
```

## 使用示例

### 保存实体

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final DataManager dataManager;

    public User save(User user) {
        return dataManager.entity(User.class).save(user);
    }

    public List<User> saveAll(List<User> users) {
        return dataManager.entity(User.class).saveAll(users);
    }
}
```

### 根据 ID 查询

```java
public Optional<User> findById(Long id) {
    return dataManager.entity(User.class).findById(id);
}

public List<User> findByIds(List<Long> ids) {
    return dataManager.entity(User.class).findByIds(ids);
}
```

### 条件查询（Lambda 风格）

```java
public List<User> findActiveUsers() {
    return dataManager.entity(User.class)
        .query()
        .where(Conditions.builder(User.class)
            .eq(User::getStatus, UserStatus.ACTIVE)
            .build())
        .list();
}
```

### 分页查询

```java
public Page<User> listUsers(int page, int size) {
    return dataManager.entity(User.class)
        .query()
        .where(Conditions.builder(User.class)
            .eq(User::getDeleted, false)
            .build())
        .page(PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt"))));
}
```

### 多租户查询

```java
public List<User> findByTenant(String tenantId) {
    return dataManager.entity(User.class)
        .withTenant(tenantId)
        .findAll(Conditions.builder(User.class)
            .eq(User::getStatus, UserStatus.ACTIVE)
            .build());
}
```

### 数据权限

```java
public List<User> findWithDeptScope() {
    return dataManager.entity(User.class)
        .withDataScope(DataScope.of("sys_user", "dept_id", DataScopeType.DEPT))
        .findAll(Conditions.empty());
}
```

### 关联加载

```java
// 急加载关联
List<User> users = dataManager.entity(User.class)
    .withAssociation("orders")
    .findAll(condition);

// 按需加载
User user = dataManager.entity(User.class).findById(1L);
List<Order> orders = dataManager.entity(User.class).fetch(user, "orders");
```

### 事务管理

```java
// 编程式事务
dataManager.executeInTransaction(() -> {
    dataManager.entity(User.class).save(user);
    dataManager.entity(Order.class).save(order);
});

// 带返回值的事务
User result = dataManager.executeInTransaction(() -> {
    return dataManager.entity(User.class).save(user);
});

// 只读事务
List<User> users = dataManager.executeInReadOnly(() -> {
    return dataManager.entity(User.class).findAll(condition);
});
```

## 实体定义

### 基础实体

```java
@Getter
@Setter
public class User extends BaseEntity {

    private Long id;
    private String username;
    private String password;
    private String realName;
    private UserStatus status = UserStatus.ACTIVE;

    public enum UserStatus {
        ACTIVE, DISABLED, LOCKED
    }
}
```

### 条件构建

```java
// 等于
Conditions.builder(User.class)
    .eq(User::getStatus, UserStatus.ACTIVE)
    .build();

// 模糊查询
Conditions.builder(User.class)
    .like(User::getUsername, "admin")
    .build();

// 范围查询
Conditions.builder(User.class)
    .between(User::getCreatedAt, startDate, endDate)
    .build();

// IN 查询
Conditions.builder(User.class)
    .in(User::getDeptId, deptIds)
    .build();

// 组合条件
Conditions.builder(User.class)
    .eq(User::getStatus, UserStatus.ACTIVE)
    .like(User::getUsername, keyword)
    .or(cond -> cond
        .eq(User::getRole, "admin")
        .eq(User::getRole, "manager"))
    .build();
```

## SQL 构建

### 查询构建器

```java
List<Map<String, Object>> results = dataManager.query()
    .select("id", "username", "real_name")
    .from("sys_user")
    .where("status = ? AND deleted = 0", UserStatus.ACTIVE)
    .orderBy("created_at DESC")
    .limit(10)
    .list();
```

### 更新构建器

```java
int updated = dataManager.update()
    .table("sys_user")
    .set("status", UserStatus.DISABLED)
    .set("updated_at", LocalDateTime.now())
    .where("id = ?", userId)
    .execute();
```

### 插入构建器

```java
int inserted = dataManager.insert()
    .into("sys_user")
    .values("id", userId)
    .values("username", "test")
    .values("created_at", LocalDateTime.now())
    .execute();
```

### 删除构建器

```java
int deleted = dataManager.delete()
    .from("sys_user")
    .where("id = ?", userId)
    .execute();
```

## 相关文档

- [核心模块](/framework/core)
- [Redis 集成](/framework/redis)
