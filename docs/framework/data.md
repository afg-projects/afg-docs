# 数据访问模块

数据访问模块提供轻量级 ORM、SQL 构建器、JDBC 增强等能力，支持多租户和数据权限。

## 模块结构

```
afg-framework/
├── data-core/                    # 核心接口定义
│   └── src/main/java/io/github/afgprojects/framework/data/core/
│       ├── DataManager.java          # 数据操作门面
│       ├── EntityProxy.java          # 实体操作代理
│       ├── EntityReader.java         # 实体读取接口
│       ├── EntityWriter.java         # 实体写入接口
│       ├── EntityQuery.java          # 条件查询接口
│       ├── condition/                # 条件构建器
│       ├── query/                    # 查询相关类
│       ├── page/                     # 分页相关类
│       ├── scope/                    # 数据权限
│       ├── tenant/                   # 多租户
│       ├── transaction/              # 事务管理
│       ├── entity/                   # 实体基类
│       ├── sql/                      # SQL 构建器接口
│       ├── dialect/                  # 数据库方言
│       ├── metadata/                 # 实体元数据
│       ├── id/                       # ID 生成器
│       └── exception/                # 异常类
└── data-impl/
    ├── data-jdbc/                # JDBC 实现
    └── data-sql/                 # SQL 构建器实现
```

## Maven 依赖

```xml
<dependency>
    <groupId>io.github.afg-projects</groupId>
    <artifactId>afg-framework-data-jdbc</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

## 快速开始

### 配置数据源

```yaml
# application.yml
spring:
  datasource:
    driver-class-name: org.h2.Driver
    url: jdbc:h2:mem:testdb
    username: sa
    password:

# MySQL 配置
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/mydb?useUnicode=true&characterEncoding=utf8
    username: root
    password: password
```

### 定义实体

```java
import io.github.afgprojects.framework.data.core.entity.BaseEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User extends BaseEntity<Long> {

    private String username;
    private String realName;
    private String email;
    private Integer status = 1;

    public enum UserStatus {
        ACTIVE, DISABLED, LOCKED
    }
}
```

### 使用 DataManager

```java
import io.github.afgprojects.framework.data.core.DataManager;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final DataManager dataManager;

    // 保存
    public User save(User user) {
        return dataManager.save(User.class, user);
    }

    // 根据 ID 查询
    public Optional<User> findById(Long id) {
        return dataManager.findById(User.class, id);
    }

    // 查询所有
    public List<User> findAll() {
        return dataManager.findAll(User.class);
    }

    // 删除
    public void deleteById(Long id) {
        dataManager.deleteById(User.class, id);
    }
}
```

---

## 核心接口

### DataManager

数据操作的全局入口，提供实体操作和 SQL 构建能力。

**包路径**: `io.github.afgprojects.framework.data.core.DataManager`

```java
public interface DataManager {

    // ==================== 实体操作 ====================

    /**
     * 获取实体操作代理
     */
    <T> EntityProxy<T> entity(Class<T> entityClass);

    /**
     * 获取实体元数据
     */
    <T> EntityMetadata<T> getEntityMetadata(Class<T> entityClass);

    // ==================== 快捷方法 ====================

    /**
     * 根据 ID 查询实体
     */
    <T> Optional<T> findById(Class<T> entityClass, Object id);

    /**
     * 根据单个字段值查找唯一实体
     */
    <T, R> Optional<T> findOneByField(Class<T> entityClass, SFunction<T, R> getter, Object value);

    /**
     * 根据单个字段值查找所有匹配实体
     */
    <T, R> List<T> findAllByField(Class<T> entityClass, SFunction<T, R> getter, Object value);

    /**
     * 查找所有实体
     */
    <T> List<T> findAll(Class<T> entityClass);

    /**
     * 根据条件查找唯一实体
     */
    <T> Optional<T> findOne(Class<T> entityClass, Condition condition);

    /**
     * 根据条件查找所有匹配实体
     */
    <T> List<T> findList(Class<T> entityClass, Condition condition);

    /**
     * 统计实体总数
     */
    <T> long count(Class<T> entityClass);

    /**
     * 根据条件统计实体数量
     */
    <T> long countByCondition(Class<T> entityClass, Condition condition);

    /**
     * 保存实体（新增或更新）
     */
    <T> T save(Class<T> entityClass, T entity);

    /**
     * 批量保存实体
     */
    <T> List<T> saveAll(Class<T> entityClass, Iterable<T> entities);

    /**
     * 批量插入实体
     */
    <T> List<T> insertAll(Class<T> entityClass, Iterable<T> entities);

    /**
     * 根据 ID 删除实体
     */
    <T> void deleteById(Class<T> entityClass, Object id);

    /**
     * 根据多个 ID 批量删除
     */
    <T> void deleteAllById(Class<T> entityClass, Iterable<?> ids);

    /**
     * 判断实体是否存在
     */
    <T> boolean existsById(Class<T> entityClass, Object id);

    /**
     * 根据条件判断是否存在
     */
    <T> boolean existsByCondition(Class<T> entityClass, Condition condition);

    // ==================== SQL 构建 ====================

    /**
     * 创建 SQL 查询构建器
     */
    SqlQueryBuilder query();

    /**
     * 创建 SQL 更新构建器
     */
    SqlUpdateBuilder update();

    /**
     * 创建 SQL 插入构建器
     */
    SqlInsertBuilder insert();

    /**
     * 创建 SQL 删除构建器
     */
    SqlDeleteBuilder delete();

    // ==================== 事务管理 ====================

    /**
     * 在事务中执行操作
     */
    void executeInTransaction(Runnable action);

    /**
     * 在事务中执行操作并返回结果
     */
    <T> T executeInTransaction(Supplier<T> action);

    /**
     * 在只读事务中执行操作
     */
    <T> T executeInReadOnly(Supplier<T> action);

    // ==================== 租户管理 ====================

    /**
     * 创建租户作用域
     */
    TenantScope tenantScope(String tenantId);

    /**
     * 获取租户上下文持有者
     */
    TenantContextHolder getTenantContextHolder();

    // ==================== 数据库信息 ====================

    /**
     * 获取当前数据库类型
     */
    DatabaseType getDatabaseType();

    /**
     * 获取事务管理器
     */
    Object getTransactionManager();

    /**
     * 获取事务适配器
     */
    TransactionAdapter getTransactionAdapter();

    /**
     * 设置事务适配器
     */
    void setTransactionAdapter(TransactionAdapter adapter);
}
```

### EntityProxy

类型安全的实体操作入口，整合读取、写入、查询能力。

**包路径**: `io.github.afgprojects.framework.data.core.EntityProxy`

```java
public interface EntityProxy<T> extends EntityReader<T>, EntityWriter<T> {

    // ==================== 关联加载 ====================

    /**
     * 加载实体的关联数据
     */
    <R> R fetch(T entity, String name);

    /**
     * 批量加载关联数据
     */
    void fetchAll(Iterable<T> entities, String name);

    // ==================== 企业级特性 ====================

    /**
     * 设置数据权限
     */
    EntityQuery<T> withDataScope(DataScope scope);

    /**
     * 设置多个数据权限
     */
    EntityQuery<T> withDataScopes(DataScope... scopes);

    /**
     * 设置租户 ID
     */
    EntityQuery<T> withTenant(String tenantId);

    /**
     * 设置数据源
     */
    EntityQuery<T> withDataSource(String name);

    /**
     * 设置只读模式
     */
    EntityQuery<T> withReadOnly();

    /**
     * 包含已删除记录（软删除）
     */
    EntityQuery<T> includeDeleted();

    /**
     * 急加载指定关联
     */
    EntityQuery<T> withAssociation(String name);

    /**
     * 急加载多个关联
     */
    EntityQuery<T> withAssociations(String... names);

    /**
     * 清除关联加载配置
     */
    EntityQuery<T> clearAssociations();

    // ==================== 条件查询 ====================

    /**
     * 根据条件查询实体列表
     */
    List<T> findAll(Condition condition);

    /**
     * 根据条件分页查询
     */
    Page<T> findAll(Condition condition, PageRequest pageRequest);

    /**
     * 根据条件统计数量
     */
    long count(Condition condition);

    /**
     * 根据条件判断是否存在
     */
    boolean exists(Condition condition);

    /**
     * 根据条件查询唯一实体
     */
    Optional<T> findOne(Condition condition);

    /**
     * 根据条件查询第一个实体
     */
    Optional<T> findFirst(Condition condition);
}
```

### EntityReader

实体读取接口。

**包路径**: `io.github.afgprojects.framework.data.core.EntityReader`

```java
public interface EntityReader<T> {

    /**
     * 根据 ID 查询实体
     */
    Optional<T> findById(Object id);

    /**
     * 根据多个 ID 查询实体列表
     */
    List<T> findAllById(Iterable<?> ids);

    /**
     * 查询所有实体
     */
    List<T> findAll();

    /**
     * 统计实体总数
     */
    long count();

    /**
     * 判断实体是否存在
     */
    boolean existsById(Object id);

    /**
     * 获取条件查询接口
     */
    EntityQuery<T> query();
}
```

### EntityWriter

实体写入接口。

**包路径**: `io.github.afgprojects.framework.data.core.EntityWriter`

```java
public interface EntityWriter<T> {

    /**
     * 保存实体（新增或更新）
     */
    T save(T entity);

    /**
     * 批量保存实体
     */
    List<T> saveAll(Iterable<T> entities);

    /**
     * 插入实体
     */
    T insert(T entity);

    /**
     * 批量插入实体
     */
    List<T> insertAll(Iterable<T> entities);

    /**
     * 更新实体
     */
    T update(T entity);

    /**
     * 批量更新实体
     */
    List<T> updateAll(Iterable<T> entities);

    /**
     * 根据 ID 删除实体
     */
    void deleteById(Object id);

    /**
     * 删除实体
     */
    void delete(T entity);

    /**
     * 根据多个 ID 批量删除
     */
    void deleteAllById(Iterable<?> ids);

    /**
     * 批量删除实体
     */
    void deleteAll(Iterable<? extends T> entities);

    /**
     * 根据条件批量更新
     */
    long updateAll(Condition condition, Map<String, Object> updates);

    /**
     * 根据条件批量删除
     */
    long deleteAll(Condition condition);

    /**
     * 根据 ID 恢复删除（软删除）
     */
    void restoreById(Object id);

    /**
     * 根据多个 ID 恢复删除
     */
    void restoreAllById(Iterable<?> ids);
}
```

### EntityQuery

实体条件查询接口，提供流式 API。

**包路径**: `io.github.afgprojects.framework.data.core.EntityQuery`

```java
public interface EntityQuery<T> {

    // ==================== 查询条件 ====================

    /**
     * 设置查询条件
     */
    EntityQuery<T> where(Condition condition);

    /**
     * 设置排序
     */
    EntityQuery<T> orderBy(Sort sort);

    // ==================== 字段选择 ====================

    /**
     * 选择部分字段查询
     */
    EntityQuery<T> select(String... fields);

    /**
     * 类型安全的字段选择
     */
    EntityQuery<T> select(SFunction<T, ?>... getters);

    /**
     * 排除部分字段查询
     */
    EntityQuery<T> exclude(String... fields);

    // ==================== 企业级特性 ====================

    EntityQuery<T> withDataScope(DataScope scope);
    EntityQuery<T> withDataScopes(DataScope... scopes);
    EntityQuery<T> withTenant(String tenantId);
    EntityQuery<T> withDataSource(String name);
    EntityQuery<T> withReadOnly();
    EntityQuery<T> includeDeleted();
    EntityQuery<T> withAssociation(String name);
    EntityQuery<T> withAssociations(String... names);
    EntityQuery<T> clearAssociations();

    // ==================== 分页限制 ====================

    /**
     * 设置查询限制
     */
    EntityQuery<T> limit(int limit);

    /**
     * 设置查询偏移量
     */
    EntityQuery<T> offset(int offset);

    // ==================== 执行查询 ====================

    /**
     * 执行查询，返回列表
     */
    List<T> list();

    /**
     * 执行分页查询
     */
    Page<T> page(PageRequest pageRequest);

    /**
     * 执行查询，返回唯一结果
     */
    Optional<T> one();

    /**
     * 执行查询，返回第一个结果
     */
    Optional<T> first();

    /**
     * 执行查询，统计数量
     */
    long count();

    /**
     * 执行查询，判断是否存在
     */
    boolean exists();
}
```

---

## 条件构建器

### Conditions 工厂类

条件构建的入口类，提供静态工厂方法。

**包路径**: `io.github.afgprojects.framework.data.core.condition.Conditions`

```java
public class Conditions {

    // ==================== 构建器创建 ====================

    /**
     * 创建条件构建器
     */
    public static ConditionBuilder builder();

    /**
     * 创建类型化条件构建器（推荐）
     */
    public static <T> TypedConditionBuilder<T> builder(Class<T> entityClass);

    // ==================== 特殊条件 ====================

    /**
     * 创建空条件
     */
    public static Condition empty();

    /**
     * 创建匹配所有条件 (WHERE 1=1)
     */
    public static Condition all();

    /**
     * 创建不匹配任何条件 (WHERE 1=0)
     */
    public static Condition none();

    // ==================== 组合条件 ====================

    /**
     * 创建 OR 组合条件
     */
    public static Condition anyOf(Condition... conditions);

    /**
     * 创建 AND 组合条件
     */
    public static Condition allOf(Condition... conditions);

    // ==================== 快捷条件方法（字符串字段名）====================

    public static Condition eq(String field, Object value);
    public static Condition ne(String field, Object value);
    public static Condition like(String field, String value);
    public static Condition in(String field, Iterable<?> values);
    public static Condition notIn(String field, Iterable<?> values);
    public static Condition isNull(String field);
    public static Condition isNotNull(String field);

    // ==================== 类型化条件方法（Lambda 字段引用）====================

    public static <T, R> Condition eq(Class<T> entityClass, SFunction<T, R> getter, Object value);
    public static <T, R> Condition ne(Class<T> entityClass, SFunction<T, R> getter, Object value);
    public static <T> Condition like(Class<T> entityClass, SFunction<T, String> getter, String value);
    public static <T, R> Condition in(Class<T> entityClass, SFunction<T, R> getter, Iterable<?> values);
    public static <T, R> Condition notIn(Class<T> entityClass, SFunction<T, R> getter, Iterable<?> values);
    public static <T, R> Condition isNull(Class<T> entityClass, SFunction<T, R> getter);
    public static <T, R> Condition isNotNull(Class<T> entityClass, SFunction<T, R> getter);
}
```

### TypedConditionBuilder

类型化条件构建器，使用 Lambda 字段引用，类型安全且重构友好。

**包路径**: `io.github.afgprojects.framework.data.core.condition.TypedConditionBuilder`

```java
public interface TypedConditionBuilder<T> {

    // ==================== 比较条件 ====================

    /**
     * 等于条件
     */
    <R> TypedConditionBuilder<T> eq(SFunction<T, R> getter, Object value);

    /**
     * 不等于条件
     */
    <R> TypedConditionBuilder<T> ne(SFunction<T, R> getter, Object value);

    /**
     * 大于条件
     */
    <R extends Comparable<?>> TypedConditionBuilder<T> gt(SFunction<T, R> getter, R value);

    /**
     * 大于等于条件
     */
    <R extends Comparable<?>> TypedConditionBuilder<T> ge(SFunction<T, R> getter, R value);

    /**
     * 小于条件
     */
    <R extends Comparable<?>> TypedConditionBuilder<T> lt(SFunction<T, R> getter, R value);

    /**
     * 小于等于条件
     */
    <R extends Comparable<?>> TypedConditionBuilder<T> le(SFunction<T, R> getter, R value);

    // ==================== 模糊查询 ====================

    /**
     * LIKE 条件（自动添加前后 %）
     */
    TypedConditionBuilder<T> like(SFunction<T, String> getter, String value);

    /**
     * 左模糊匹配（以...开头）
     */
    TypedConditionBuilder<T> likeLeft(SFunction<T, String> getter, String value);

    /**
     * 右模糊匹配（以...结尾）
     */
    TypedConditionBuilder<T> likeRight(SFunction<T, String> getter, String value);

    /**
     * NOT LIKE 条件
     */
    TypedConditionBuilder<T> notLike(SFunction<T, String> getter, String value);

    // ==================== 集合条件 ====================

    /**
     * IN 条件
     */
    <R> TypedConditionBuilder<T> in(SFunction<T, R> getter, Iterable<?> values);

    /**
     * NOT IN 条件
     */
    <R> TypedConditionBuilder<T> notIn(SFunction<T, R> getter, Iterable<?> values);

    // ==================== NULL 条件 ====================

    /**
     * IS NULL 条件
     */
    <R> TypedConditionBuilder<T> isNull(SFunction<T, R> getter);

    /**
     * IS NOT NULL 条件
     */
    <R> TypedConditionBuilder<T> isNotNull(SFunction<T, R> getter);

    // ==================== 范围条件 ====================

    /**
     * BETWEEN 条件
     */
    <R extends Comparable<?>> TypedConditionBuilder<T> between(SFunction<T, R> getter, R from, R to);

    /**
     * NOT BETWEEN 条件
     */
    <R extends Comparable<?>> TypedConditionBuilder<T> notBetween(SFunction<T, R> getter, R from, R to);

    // ==================== 逻辑连接 ====================

    /**
     * AND 连接条件
     */
    TypedConditionBuilder<T> and(Condition condition);

    /**
     * OR 连接条件
     */
    TypedConditionBuilder<T> or(Condition condition);

    // ==================== 构建 ====================

    /**
     * 构建条件对象
     */
    Condition build();
}
```

### 使用示例

```java
import static io.github.afgprojects.framework.data.core.condition.Conditions.*;

// ==================== 单条件 ====================

// 等于
Condition condition = builder(User.class)
    .eq(User::getStatus, 1)
    .build();

// 模糊查询
Condition condition = builder(User.class)
    .like(User::getUsername, "admin")  // 自动添加 %admin%
    .build();

// 范围查询
Condition condition = builder(User.class)
    .between(User::getCreatedAt, startDate, endDate)
    .build();

// IN 查询
Condition condition = builder(User.class)
    .in(User::getDeptId, deptIds)
    .build();

// IS NULL
Condition condition = builder(User.class)
    .isNull(User::getEmail)
    .build();

// ==================== 多条件组合 ====================

// AND 组合
Condition condition = builder(User.class)
    .eq(User::getStatus, 1)
    .like(User::getUsername, "张")
    .ge(User::getAge, 18)
    .build();

// OR 组合
Condition condition = builder(User.class)
    .eq(User::getStatus, 1)
    .or(builder(User.class)
        .eq(User::getRole, "admin")
        .eq(User::getRole, "manager")
        .build())
    .build();

// 复杂组合
Condition condition = builder(User.class)
    .eq(User::getStatus, 1)
    .in(User::getDeptId, deptIds)
    .between(User::getCreatedAt, startDate, endDate)
    .isNotNull(User::getEmail)
    .build();

// ==================== 使用快捷方法 ====================

// 单条件快捷方法
Condition condition = eq(User.class, User::getStatus, 1);

// 组合条件
Condition condition = allOf(
    eq(User.class, User::getStatus, 1),
    like(User.class, User::getUsername, "admin")
);
```

---

## 分页查询

### Page

分页结果封装类。

**包路径**: `io.github.afgprojects.framework.data.core.query.Page`

```java
public class Page<T> {

    // ==================== 字段 ====================

    private final List<T> content;    // 数据列表
    private final long total;         // 总记录数
    private final long page;          // 当前页码（从1开始）
    private final long size;          // 每页大小

    // ==================== 方法 ====================

    public List<T> getContent();          // 获取数据列表
    public long getTotal();               // 获取总记录数
    public long getPage();                // 获取当前页码
    public long getSize();                // 获取每页大小
    public long getTotalPages();          // 获取总页数
    public long getNumberOfElements();    // 获取当前页数据数量
    public long getOffset();              // 获取偏移量

    public boolean hasContent();          // 是否有内容
    public boolean isFirst();             // 是否是第一页
    public boolean isLast();              // 是否是最后一页
    public boolean hasNext();             // 是否有下一页
    public boolean hasPrevious();         // 是否有上一页

    /**
     * 转换数据类型
     */
    public <U> Page<U> map(Function<? super T, ? extends U> mapper);

    // ==================== 静态工厂方法 ====================

    public static <T> Page<T> empty();
    public static <T> Page<T> empty(long page, long size);
    public static <T> Page<T> of(List<T> content, long total, long page, long size);
    public static <T> Page<T> singlePage(List<T> content);
}
```

### PageRequest

分页请求参数。

**包路径**: `io.github.afgprojects.framework.data.core.page.PageRequest`

```java
public record PageRequest(
    int page,      // 当前页码（从1开始）
    int size,      // 每页大小
    Sort sort      // 排序（可为 null）
) {

    // ==================== 常量 ====================

    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 1000;

    // ==================== 静态工厂方法 ====================

    /**
     * 创建分页请求
     */
    public static PageRequest of(int page, int size);

    /**
     * 创建分页请求（带排序）
     */
    public static PageRequest of(int page, int size, Sort sort);

    /**
     * 创建首页请求
     */
    public static PageRequest firstPage(int size);

    /**
     * 创建默认分页请求（第1页，每页10条）
     */
    public static PageRequest defaultPage();

    // ==================== 方法 ====================

    public int offset();                  // 获取偏移量
    public boolean hasSort();             // 是否有排序
    public PageRequest nextPage();        // 获取下一页请求
    public PageRequest previousPage();    // 获取上一页请求
    public PageRequest withPage(int newPage);
    public PageRequest withSize(int newSize);
    public PageRequest withSort(Sort newSort);
    public long totalPages(long total);   // 计算总页数
    public boolean isFirst();
    public boolean hasPrevious();
}
```

### Sort

排序定义。

**包路径**: `io.github.afgprojects.framework.data.core.query.Sort`

```java
public class Sort {

    // ==================== 字段 ====================

    private final List<Order> orders;
    public static final Sort UNSORTED = new Sort(Collections.emptyList());

    // ==================== 静态工厂方法 ====================

    public static Sort unsorted();
    public static Sort asc(String... properties);
    public static Sort desc(String... properties);
    public static Sort by(Direction direction, String... properties);
    public static Sort by(Order... orders);

    // ==================== 方法 ====================

    public List<Order> getOrders();
    public boolean isUnsorted();
    public boolean isSorted();
    public Sort and(Sort sort);

    // ==================== 内部类 Order ====================

    public static class Order {
        private final String property;        // 属性名
        private final Direction direction;    // 排序方向
        private final boolean ignoreCase;     // 是否忽略大小写

        public String getProperty();
        public Direction getDirection();
        public boolean isAscending();
        public boolean isDescending();
        public boolean isIgnoreCase();

        public static Order asc(String property);
        public static Order desc(String property);
        public Order ignoreCase();
    }

    // ==================== 枚举 Direction ====================

    public enum Direction {
        ASC,   // 升序
        DESC   // 降序
    }
}
```

### 使用示例

```java
// ==================== 基础分页 ====================

// 创建分页请求
PageRequest pageRequest = PageRequest.of(1, 10);

// 执行分页查询
Page<User> page = dataManager.entity(User.class)
    .query()
    .where(builder(User.class).eq(User::getStatus, 1).build())
    .page(pageRequest);

// 获取结果
List<User> users = page.getContent();
long total = page.getTotal();
long totalPages = page.getTotalPages();
boolean hasNext = page.hasNext();

// ==================== 带排序的分页 ====================

// 方式一：使用 Sort 工厂方法
PageRequest pageRequest = PageRequest.of(1, 10, Sort.desc("createdAt"));

// 方式二：使用 Order
PageRequest pageRequest = PageRequest.of(1, 10,
    Sort.by(
        Order.desc("createdAt"),
        Order.asc("username")
    )
);

// 方式三：链式调用
PageRequest pageRequest = PageRequest.of(1, 10)
    .withSort(Sort.desc("createdAt"));

// ==================== 分页导航 ====================

Page<User> page = dataManager.entity(User.class)
    .query()
    .page(PageRequest.of(1, 10));

// 获取下一页请求
if (page.hasNext()) {
    PageRequest nextPage = pageRequest.nextPage();
}

// ==================== 类型转换 ====================

Page<UserDTO> dtoPage = page.map(user -> {
    UserDTO dto = new UserDTO();
    dto.setId(user.getId());
    dto.setUsername(user.getUsername());
    return dto;
});
```

---

## SQL 构建器

### SqlQueryBuilder

SQL 查询构建器，支持复杂查询、窗口函数、CTE 等。

**包路径**: `io.github.afgprojects.framework.data.core.sql.SqlQueryBuilder`

```java
public interface SqlQueryBuilder {

    // ==================== SELECT ====================

    SqlQueryBuilder select(String... columns);
    SqlQueryBuilder select(SFunction<?, ?>... getters);
    SqlQueryBuilder distinct();
    SqlQueryBuilder selectAll();

    // ==================== 聚合函数 ====================

    SqlQueryBuilder count(String column);
    SqlQueryBuilder count();
    SqlQueryBuilder countDistinct(String column);
    SqlQueryBuilder sum(String column);
    SqlQueryBuilder avg(String column);
    SqlQueryBuilder max(String column);
    SqlQueryBuilder min(String column);

    // ==================== 窗口函数 ====================

    SqlQueryBuilder rowNumber();
    SqlQueryBuilder rank();
    SqlQueryBuilder denseRank();
    SqlQueryBuilder lead(String column);
    SqlQueryBuilder lead(String column, int offset);
    SqlQueryBuilder lead(String column, int offset, Object defaultValue);
    SqlQueryBuilder lag(String column);
    SqlQueryBuilder lag(String column, int offset);
    SqlQueryBuilder lag(String column, int offset, Object defaultValue);
    SqlQueryBuilder rowNumberOver(String partitionBy, String orderBy);
    SqlQueryBuilder rankOver(String partitionBy, String orderBy);
    SqlQueryBuilder denseRankOver(String partitionBy, String orderBy);
    WindowFunctionBuilder over();

    // ==================== FROM / JOIN ====================

    SqlQueryBuilder from(String table);
    SqlQueryBuilder from(String table, String alias);
    SqlQueryBuilder join(String table, Condition on);
    SqlQueryBuilder leftJoin(String table, Condition on);
    SqlQueryBuilder rightJoin(String table, Condition on);
    SqlQueryBuilder innerJoin(String table, Condition on);
    SqlQueryBuilder join(String table, String alias, Condition on);
    SqlQueryBuilder leftJoin(String table, String alias, Condition on);

    // ==================== WHERE ====================

    SqlQueryBuilder where(Condition condition);
    SqlQueryBuilder and(Condition condition);
    SqlQueryBuilder or(Condition condition);

    // ==================== GROUP BY / HAVING ====================

    SqlQueryBuilder groupBy(String... columns);
    SqlQueryBuilder having(Condition condition);

    // ==================== ORDER BY / LIMIT / OFFSET ====================

    SqlQueryBuilder orderBy(Sort sort);
    SqlQueryBuilder orderBy(String column, Direction direction);
    SqlQueryBuilder limit(long limit);
    SqlQueryBuilder offset(long offset);
    SqlQueryBuilder page(long page, long size);
    SqlQueryBuilder page(PageRequest pageable);

    // ==================== CTE (Common Table Expression) ====================

    SqlQueryBuilder with(String name, SqlQueryBuilder cte);
    SqlQueryBuilder withRecursive(String name, SqlQueryBuilder cte);
    SqlQueryBuilder withColumnNames(String name, String[] columns, SqlQueryBuilder cte);
    SqlQueryBuilder withRecursiveColumnNames(String name, String[] columns, SqlQueryBuilder cte);

    // ==================== 子查询 ====================

    SqlQueryBuilder fromSubquery(SqlQueryBuilder subquery, String alias);
    SqlQueryBuilder exists(SqlQueryBuilder subquery);
    SqlQueryBuilder notExists(SqlQueryBuilder subquery);

    // ==================== 构建 / 执行 ====================

    String toSql();
    List<Object> getParameters();
    <T> List<T> fetch(Class<T> resultType);
    <T> Optional<T> fetchOne(Class<T> resultType);
    <T> Optional<T> fetchFirst(Class<T> resultType);
    <T> Page<T> fetchPage(Class<T> resultType, PageRequest pageable);
    long fetchCount();
}
```

### SqlUpdateBuilder

SQL 更新构建器。

**包路径**: `io.github.afgprojects.framework.data.core.sql.SqlUpdateBuilder`

```java
public interface SqlUpdateBuilder {

    SqlUpdateBuilder table(String table);
    SqlUpdateBuilder set(String column, Object value);
    SqlUpdateBuilder set(Map<String, Object> values);
    SqlUpdateBuilder set(SFunction<?, ?> getter, Object value);
    SqlUpdateBuilder where(Condition condition);

    String toSql();
    List<Object> getParameters();
    int execute();
}
```

### SqlInsertBuilder

SQL 插入构建器。

**包路径**: `io.github.afgprojects.framework.data.core.sql.SqlInsertBuilder`

```java
public interface SqlInsertBuilder {

    SqlInsertBuilder into(String table);
    SqlInsertBuilder columns(String... columns);
    SqlInsertBuilder values(Object... values);
    SqlInsertBuilder row(Object... values);  // 批量插入

    String toSql();
    List<Object> getParameters();
    int execute();
    long executeAndReturnKey();  // 返回生成的主键
}
```

### SqlDeleteBuilder

SQL 删除构建器。

**包路径**: `io.github.afgprojects.framework.data.core.sql.SqlDeleteBuilder`

```java
public interface SqlDeleteBuilder {

    SqlDeleteBuilder from(String table);
    SqlDeleteBuilder where(Condition condition);

    String toSql();
    List<Object> getParameters();
    int execute();
}
```

### 使用示例

```java
// ==================== 查询构建 ====================

// 基础查询
List<Map<String, Object>> results = dataManager.query()
    .select("id", "username", "real_name")
    .from("sys_user")
    .where(builder().eq("status", 1).build())
    .orderBy(Sort.desc("created_at"))
    .limit(10)
    .fetch(Map.class);

// 聚合查询
List<UserStats> stats = dataManager.query()
    .select("dept_id")
    .count("id", "total")
    .avg("age", "avg_age")
    .from("sys_user")
    .groupBy("dept_id")
    .having(builder().gt("count(id)", 5).build())
    .fetch(UserStats.class);

// JOIN 查询
List<UserOrder> results = dataManager.query()
    .select("u.id", "u.username", "o.order_no", "o.amount")
    .from("sys_user", "u")
    .leftJoin("sys_order", "o", builder().eq("u.id", "o.user_id").build())
    .where(builder().eq("u.status", 1).build())
    .fetch(UserOrder.class);

// 子查询
List<User> users = dataManager.query()
    .select("*")
    .from("sys_user")
    .where(builder().in("dept_id",
        dataManager.query()
            .select("id")
            .from("sys_dept")
            .where(builder().eq("parent_id", 1).build())
    ).build())
    .fetch(User.class);

// EXISTS 子查询
List<User> users = dataManager.query()
    .select("*")
    .from("sys_user", "u")
    .exists(dataManager.query()
        .select("1")
        .from("sys_order", "o")
        .where(builder().eq("o.user_id", "u.id").build()))
    .fetch(User.class);

// CTE (Common Table Expression)
List<User> users = dataManager.query()
    .with("active_users", dataManager.query()
        .select("*")
        .from("sys_user")
        .where(builder().eq("status", 1).build()))
    .select("*")
    .from("active_users")
    .fetch(User.class);

// 递归 CTE（树形结构查询）
List<Dept> depts = dataManager.query()
    .withRecursive("dept_tree", dataManager.query()
        .select("id", "parent_id", "name")
        .from("sys_dept")
        .where(builder().isNull("parent_id").build())
        .unionAll(dataManager.query()
            .select("d.id", "d.parent_id", "d.name")
            .from("sys_dept", "d")
            .join("dept_tree", "dt", builder().eq("d.parent_id", "dt.id").build())))
    .select("*")
    .from("dept_tree")
    .fetch(Dept.class);

// 窗口函数
List<UserRank> ranks = dataManager.query()
    .select("id", "username", "score")
    .rowNumberOver("dept_id", "score DESC", "rank")
    .from("sys_user")
    .fetch(UserRank.class);

// ==================== 更新构建 ====================

int updated = dataManager.update()
    .table("sys_user")
    .set("status", 0)
    .set("updated_at", LocalDateTime.now())
    .where(builder().eq("id", userId).build())
    .execute();

// 批量更新
int updated = dataManager.update()
    .table("sys_user")
    .set(Map.of("status", 0, "updated_at", LocalDateTime.now()))
    .where(builder().in("id", userIds).build())
    .execute();

// ==================== 插入构建 ====================

int inserted = dataManager.insert()
    .into("sys_user")
    .columns("username", "real_name", "status")
    .values("test", "测试用户", 1)
    .execute();

// 插入并返回主键
long id = dataManager.insert()
    .into("sys_user")
    .columns("username", "real_name")
    .values("test", "测试用户")
    .executeAndReturnKey();

// 批量插入
int inserted = dataManager.insert()
    .into("sys_user")
    .columns("username", "real_name")
    .row("user1", "用户1")
    .row("user2", "用户2")
    .row("user3", "用户3")
    .execute();

// ==================== 删除构建 ====================

int deleted = dataManager.delete()
    .from("sys_user")
    .where(builder().eq("id", userId).build())
    .execute();
```

---

## 多租户

### TenantContext

租户上下文接口。

**包路径**: `io.github.afgprojects.framework.data.core.tenant.TenantContext`

```java
public interface TenantContext {

    /**
     * 获取当前租户 ID
     */
    String getTenantId();

    /**
     * 设置当前租户 ID
     */
    void setTenantId(String tenantId);

    /**
     * 清除当前租户 ID
     */
    void clear();

    /**
     * 是否忽略租户隔离
     */
    boolean isIgnoreTenant();

    /**
     * 设置忽略租户隔离
     */
    void setIgnoreTenant(boolean ignore);

    /**
     * 在忽略租户隔离的上下文中执行
     */
    void runWithoutTenant(Runnable runnable);
}
```

### TenantScope

租户作用域，支持 try-with-resources 自动恢复。

**包路径**: `io.github.afgprojects.framework.data.core.scope.TenantScope`

```java
public interface TenantScope extends AutoCloseable {

    /**
     * 获取租户 ID
     */
    String getTenantId();

    /**
     * 关闭作用域（恢复之前的租户上下文）
     */
    void close();
}
```

### 使用示例

```java
// ==================== 方式一：使用 TenantScope（推荐）====================

// 自动恢复租户上下文
try (TenantScope scope = dataManager.tenantScope("tenant-001")) {
    List<User> users = dataManager.findAll(User.class);
    // 所有操作都在 tenant-001 上下文中执行
}
// 离开作用域后自动恢复之前的租户上下文

// ==================== 方式二：使用 EntityProxy ====================

List<User> users = dataManager.entity(User.class)
    .withTenant("tenant-001")
    .findAll(condition);

// ==================== 方式三：使用 EntityQuery ====================

List<User> users = dataManager.entity(User.class)
    .query()
    .withTenant("tenant-001")
    .where(condition)
    .list();

// ==================== 方式四：手动管理 ====================

TenantContextHolder holder = dataManager.getTenantContextHolder();

// 设置租户
holder.setTenantId("tenant-001");

// 执行操作
List<User> users = dataManager.findAll(User.class);

// 清除租户
holder.clear();

// ==================== 忽略租户隔离 ====================

// 方式一：使用 TenantContext
TenantContext context = ...;
context.runWithoutTenant(() -> {
    // 查询所有租户的数据
    List<User> users = dataManager.findAll(User.class);
});

// 方式二：使用 EntityQuery
List<User> users = dataManager.entity(User.class)
    .query()
    .includeDeleted()  // 包含已删除
    .list();           // 如果配置了忽略租户，则查询所有租户

// ==================== 租户上下文快照 ====================

TenantContextHolder holder = dataManager.getTenantContextHolder();

// 创建快照
TenantContextSnapshot snapshot = holder.snapshot();

// 在新线程中恢复上下文
executor.execute(() -> {
    holder.runWithSnapshot(snapshot, () -> {
        // 在原租户上下文中执行
        List<User> users = dataManager.findAll(User.class);
    });
});
```

---

## 数据权限

### DataScope

数据权限配置。

**包路径**: `io.github.afgprojects.framework.data.core.scope.DataScope`

```java
public record DataScope(
    String table,              // 表名
    String column,             // 权限过滤列名
    DataScopeType scopeType,   // 数据范围类型
    String customCondition,    // 自定义 SQL 条件（可为 null）
    String aliasPrefix         // 别名前缀（可为 null）
) {

    /**
     * 创建数据权限
     */
    public static DataScope of(String table, String column, DataScopeType scopeType);

    /**
     * 获取 Builder
     */
    public static Builder builder();
}
```

### DataScopeType

数据权限类型枚举。

**包路径**: `io.github.afgprojects.framework.data.core.scope.DataScopeType`

```java
public enum DataScopeType {

    ALL,              // 全部数据
    SELF,             // 仅本人数据
    DEPT,             // 本部门数据
    DEPT_AND_CHILD,   // 本部门及子部门数据
    CUSTOM            // 自定义条件
}
```

### 使用示例

```java
// ==================== 基础使用 ====================

// 本部门数据权限
List<User> users = dataManager.entity(User.class)
    .withDataScope(DataScope.of("sys_user", "dept_id", DataScopeType.DEPT))
    .findAll(condition);

// 本部门及子部门数据权限
List<User> users = dataManager.entity(User.class)
    .withDataScope(DataScope.of("sys_user", "dept_id", DataScopeType.DEPT_AND_CHILD))
    .findAll(condition);

// 仅本人数据
List<Order> orders = dataManager.entity(Order.class)
    .withDataScope(DataScope.of("sys_order", "user_id", DataScopeType.SELF))
    .findAll(condition);

// ==================== 多数据权限 ====================

List<User> users = dataManager.entity(User.class)
    .withDataScopes(
        DataScope.of("sys_user", "dept_id", DataScopeType.DEPT),
        DataScope.of("sys_user", "company_id", DataScopeType.CUSTOM)
    )
    .findAll(condition);

// ==================== 自定义条件 ====================

DataScope customScope = DataScope.builder()
    .table("sys_user")
    .column("dept_id")
    .scopeType(DataScopeType.CUSTOM)
    .customCondition("dept_id IN (SELECT dept_id FROM user_dept WHERE user_id = ?)")
    .build();

List<User> users = dataManager.entity(User.class)
    .withDataScope(customScope)
    .findAll(condition);

// ==================== 与查询结合 ====================

Page<User> page = dataManager.entity(User.class)
    .query()
    .withDataScope(DataScope.of("sys_user", "dept_id", DataScopeType.DEPT))
    .withTenant("tenant-001")
    .where(builder(User.class)
        .eq(User::getStatus, 1)
        .build())
    .page(PageRequest.of(1, 10, Sort.desc("createdAt")));
```

---

## 事务管理

### TransactionAdapter

事务适配器接口。

**包路径**: `io.github.afgprojects.framework.data.core.transaction.TransactionAdapter`

```java
public interface TransactionAdapter {

    /**
     * 在事务中执行操作
     */
    void executeInTransaction(Runnable action);

    /**
     * 在事务中执行操作并返回结果
     */
    <T> T executeInTransaction(Supplier<T> action);

    /**
     * 在只读事务中执行操作
     */
    <T> T executeInReadOnly(Supplier<T> action);
}
```

### 使用示例

```java
// ==================== 编程式事务 ====================

// 无返回值
dataManager.executeInTransaction(() -> {
    dataManager.save(User.class, user);
    dataManager.save(Order.class, order);
});

// 有返回值
User result = dataManager.executeInTransaction(() -> {
    User saved = dataManager.save(User.class, user);
    order.setUserId(saved.getId());
    dataManager.save(Order.class, order);
    return saved;
});

// 只读事务
List<User> users = dataManager.executeInReadOnly(() -> {
    return dataManager.findAll(User.class);
});

// ==================== 嵌套事务 ====================

dataManager.executeInTransaction(() -> {
    dataManager.save(User.class, user);

    // 嵌套事务（独立事务）
    dataManager.executeInTransaction(() -> {
        dataManager.save(Log.class, log);
    });

    // 如果这里抛出异常，user 会被回滚，但 log 不会
    dataManager.save(Order.class, order);
});

// ==================== 声明式事务 ====================

@Service
public class UserService {

    private final DataManager dataManager;

    @Transactional
    public User createUser(User user) {
        return dataManager.save(User.class, user);
    }

    @Transactional(readOnly = true)
    public List<User> listUsers() {
        return dataManager.findAll(User.class);
    }
}
```

---

## 实体基类

### BaseEntity

基础实体类，提供 ID 和时间戳字段。

**包路径**: `io.github.afgprojects.framework.data.core.entity.BaseEntity`

```java
public abstract class BaseEntity<ID> {

    private ID id;                        // 主键 ID
    private LocalDateTime createdAt;      // 创建时间
    private LocalDateTime updatedAt;      // 更新时间

    public ID getId();
    public void setId(ID id);
    public LocalDateTime getCreatedAt();
    public void setCreatedAt(LocalDateTime createdAt);
    public LocalDateTime getUpdatedAt();
    public void setUpdatedAt(LocalDateTime updatedAt);

    /**
     * 判断是否为新建实体
     */
    public boolean isNew();
}
```

### TenantEntity

租户实体类，继承 BaseEntity 并实现 TenantAware。

**包路径**: `io.github.afgprojects.framework.data.core.entity.TenantEntity`

```java
public abstract class TenantEntity<ID> extends BaseEntity<ID> implements TenantAware {

    private String tenantId;    // 租户 ID

    public String getTenantId();
    public void setTenantId(String tenantId);
}
```

### SoftDeleteEntity

软删除实体类，继承 BaseEntity 并实现 SoftDeletable。

**包路径**: `io.github.afgprojects.framework.data.core.entity.SoftDeleteEntity`

```java
public abstract class SoftDeleteEntity<ID> extends BaseEntity<ID> implements SoftDeletable {

    private boolean deleted = false;    // 删除标记

    public boolean isDeleted();
    public void setDeleted(boolean deleted);

    /**
     * 标记为已删除
     */
    public void markDeleted();

    /**
     * 恢复删除
     */
    public void restore();
}
```

### TimestampSoftDeleteEntity

时间戳软删除实体类，使用 deletedAt 字段。

**包路径**: `io.github.afgprojects.framework.data.core.entity.TimestampSoftDeleteEntity`

```java
public abstract class TimestampSoftDeleteEntity<ID> extends BaseEntity<ID> implements TimestampSoftDeletable {

    private LocalDateTime deletedAt;    // 删除时间（null 表示未删除）

    public LocalDateTime getDeletedAt();
    public void setDeletedAt(LocalDateTime deletedAt);

    /**
     * 标记为已删除（使用当前时间）
     */
    public void markDeleted();

    /**
     * 标记为已删除（使用指定时间）
     */
    public void markDeleted(LocalDateTime deletedAt);

    /**
     * 恢复删除
     */
    public void restore();
}
```

### VersionedEntity

乐观锁实体类，继承 BaseEntity 并实现 Versioned。

**包路径**: `io.github.afgprojects.framework.data.core.entity.VersionedEntity`

```java
public abstract class VersionedEntity<ID> extends BaseEntity<ID> implements Versioned {

    private long version = 0L;    // 版本号

    public long getVersion();
    public void setVersion(long version);
}
```

### FullEntity

完整实体类，包含所有特性。

**包路径**: `io.github.afgprojects.framework.data.core.entity.FullEntity`

```java
public abstract class FullEntity<ID> extends BaseEntity<ID>
        implements TenantAware, SoftDeletable, Versioned {

    private String tenantId;       // 租户 ID
    private boolean deleted;       // 删除标记
    private long version;          // 版本号
    private String createBy;       // 创建人 ID
    private String updateBy;       // 更新人 ID

    // getters and setters...
}
```

### 使用示例

```java
// ==================== 基础实体 ====================

@Getter
@Setter
public class User extends BaseEntity<Long> {

    private String username;
    private String realName;
    private Integer status = 1;
}

// ==================== 多租户实体 ====================

@Getter
@Setter
public class TenantUser extends TenantEntity<Long> {

    private String username;
    private String realName;
}

// ==================== 软删除实体 ====================

@Getter
@Setter
public class Article extends SoftDeleteEntity<Long> {

    private String title;
    private String content;
}

// 删除操作（软删除）
dataManager.deleteById(Article.class, 1L);  // 设置 deleted = true

// 恢复删除
dataManager.entity(Article.class).restoreById(1L);

// 查询包含已删除
List<Article> articles = dataManager.entity(Article.class)
    .query()
    .includeDeleted()
    .list();

// ==================== 乐观锁实体 ====================

@Getter
@Setter
public class Product extends VersionedEntity<Long> {

    private String name;
    private Integer stock;
}

// 更新时自动检查版本号
Product product = dataManager.findById(Product.class, 1L).orElseThrow();
product.setStock(product.getStock() - 1);
dataManager.save(Product.class, product);  // 如果版本号不匹配，抛出 OptimisticLockException

// ==================== 完整实体 ====================

@Getter
@Setter
public class Order extends FullEntity<Long> {

    private String orderNo;
    private BigDecimal amount;
}
```

---

## 数据库方言

### Dialect

数据库方言接口，处理不同数据库的 SQL 差异。

**包路径**: `io.github.afgprojects.framework.data.core.dialect.Dialect`

```java
public interface Dialect {

    /**
     * 获取数据库类型
     */
    DatabaseType getDatabaseType();

    /**
     * 生成分页 SQL
     */
    String getPaginationSql(String sql, long offset, long limit);
    String getPaginationSql(String sql, PageRequest pageable);

    /**
     * 是否支持 LIMIT OFFSET 语法
     */
    boolean supportsLimitOffset();

    /**
     * 是否支持 FETCH FIRST 语法
     */
    boolean supportsFetchFirst();

    /**
     * 获取标识符引用字符
     */
    String getIdentifierQuote();

    /**
     * 引用标识符
     */
    String quoteIdentifier(String identifier);

    /**
     * 获取当前时间函数
     */
    String getCurrentTimeFunction();
    String getCurrentDateFunction();
    String getCurrentTimestampFunction();

    /**
     * 是否支持自增主键
     */
    boolean supportsAutoIncrement();

    /**
     * 是否支持序列
     */
    boolean supportsSequence();

    /**
     * 获取自增主键语法
     */
    String getAutoIncrementSyntax();

    /**
     * 获取序列查询 SQL
     */
    String getSequenceNextValueSql(String sequenceName);

    /**
     * 获取 Java 类型对应的数据库类型
     */
    String getSqlType(Class<?> javaType);

    /**
     * 获取 LIKE 表达式的通配符
     */
    String getLikeWildcard();

    /**
     * 是否支持 FOR UPDATE
     */
    boolean supportsForUpdate();

    /**
     * 获取 FOR UPDATE 语法
     */
    String getForUpdateSyntax();
}
```

### DatabaseType

数据库类型枚举。

**包路径**: `io.github.afgprojects.framework.data.core.dialect.DatabaseType`

```java
public enum DatabaseType {

    MYSQL("mysql", "MySQL"),
    POSTGRESQL("postgresql", "PostgreSQL"),
    ORACLE("oracle", "Oracle"),
    SQLSERVER("sqlserver", "Microsoft SQL Server"),
    SQLITE("sqlite", "SQLite"),
    H2("h2", "H2"),
    OCEANBASE("oceanbase", "OceanBase"),
    OPENGAUSS("opengauss", "openGauss"),
    DM("dm", "达梦"),
    KINGBASE("kingbase", "金仓"),
    GAUSSDB("gaussdb", "GaussDB"),
    UNKNOWN("unknown", "Unknown");

    public String getCode();
    public String getName();

    /**
     * 根据代码获取数据库类型
     */
    public static DatabaseType fromCode(String code);

    /**
     * 是否是 MySQL 系列
     */
    public boolean isMySQLFamily();

    /**
     * 是否是 PostgreSQL 系列
     */
    public boolean isPostgreSQLFamily();

    /**
     * 是否是国产数据库
     */
    public boolean isChineseDatabase();
}
```

### 支持的数据库

| 数据库 | 方言类 | 说明 |
|--------|--------|------|
| MySQL | `MySQLDialect` | MySQL 5.7+ |
| PostgreSQL | `PostgreSQLDialect` | PostgreSQL 12+ |
| Oracle | `OracleDialect` | Oracle 12c+ |
| SQL Server | `SQLServerDialect` | SQL Server 2016+ |
| H2 | `H2Dialect` | H2 数据库 |
| OceanBase | `OceanBaseDialect` | OceanBase |
| openGauss | `OpenGaussDialect` | openGauss |
| GaussDB | `GaussDBDialect` | GaussDB |
| 达梦 | `DmDialect` | 达梦数据库 |
| 金仓 | `KingbaseDialect` | 金仓数据库 |

### 使用示例

```java
// ==================== 获取数据库类型 ====================

DatabaseType dbType = dataManager.getDatabaseType();

if (dbType.isMySQLFamily()) {
    // MySQL 特定逻辑
}

if (dbType.isChineseDatabase()) {
    // 国产数据库特定逻辑
}

// ==================== 配置方言 ====================

// application.yml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/mydb

# 框架会自动检测数据库类型并选择合适的方言
```

---

## ID 生成器

### IdentifierGenerator

ID 生成器接口。

**包路径**: `io.github.afgprojects.framework.data.core.id.IdentifierGenerator`

```java
public interface IdentifierGenerator {

    /**
     * 生成 ID
     */
    Object generate();

    /**
     * 生成字符串 ID
     */
    String generateString();

    /**
     * 生成 long ID
     */
    long generateLong();

    /**
     * 获取 ID 类型
     */
    IdType getIdType();

    /**
     * 从 ID 解析时间戳
     */
    long parseTimestamp(Object id);

    /**
     * 是否支持时间戳解析
     */
    boolean supportsTimestampParsing();
}
```

### SnowflakeIdGenerator

雪花算法 ID 生成器。

**包路径**: `io.github.afgprojects.framework.data.core.id.SnowflakeIdGenerator`

```java
public class SnowflakeIdGenerator implements IdentifierGenerator {

    /**
     * 使用默认配置
     */
    public SnowflakeIdGenerator();

    /**
     * 使用指定工作节点 ID
     */
    public SnowflakeIdGenerator(long workerId);

    /**
     * 使用指定配置
     */
    public SnowflakeIdGenerator(long workerId, long datacenterId);

    /**
     * 使用配置对象
     */
    public SnowflakeIdGenerator(SnowflakeConfig config);
}
```

**ID 结构（64位）**：
- 1位：符号位（始终为0）
- 41位：时间戳（可使用约69年）
- 10位：工作机器ID（5位数据中心ID + 5位工作节点ID）
- 12位：序列号

### 其他 ID 生成器

| 类 | 说明 |
|----|------|
| `UuidGenerator` | UUID 生成器 |
| `TimestampIdGenerator` | 时间戳 ID 生成器 |

### IdType

ID 类型枚举。

**包路径**: `io.github.afgprojects.framework.data.core.id.IdType`

```java
public enum IdType {
    AUTO,        // 自增
    UUID,        // UUID
    SNOWFLAKE,   // 雪花算法
    TIMESTAMP    // 时间戳
}
```

### 使用示例

```java
// ==================== 雪花算法 ====================

SnowflakeIdGenerator generator = new SnowflakeIdGenerator(1, 1);

long id = generator.generateLong();
String idStr = generator.generateString();

// 解析时间戳
if (generator.supportsTimestampParsing()) {
    long timestamp = generator.parseTimestamp(id);
    LocalDateTime dateTime = LocalDateTime.ofInstant(
        Instant.ofEpochMilli(timestamp), ZoneId.systemDefault());
}

// ==================== UUID ====================

UuidGenerator uuidGenerator = new UuidGenerator();
String uuid = uuidGenerator.generateString();

// ==================== 配置 ====================

// application.yml
afg:
  data:
    id:
      type: snowflake
      snowflake:
        worker-id: 1
        datacenter-id: 1
```

---

## 异常处理

### 异常类层次

```
DataAccessException (基类)
├── EntityNotFoundException      # 实体未找到
├── OptimisticLockException     # 乐观锁冲突
├── MultiTenantException        # 多租户异常
├── DataPermissionException     # 数据权限异常
├── DuplicateEntityException    # 实体重复
├── EntityMappingException      # 实体映射异常
├── DataValidationException     # 数据验证异常
├── BatchOperationException     # 批量操作异常
└── TransactionException        # 事务异常
```

### 使用示例

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final DataManager dataManager;

    public User getUserById(Long id) {
        return dataManager.findById(User.class, id)
            .orElseThrow(() -> new EntityNotFoundException(User.class, id));
    }

    public void updateWithOptimisticLock(User user) {
        try {
            dataManager.save(User.class, user);
        } catch (OptimisticLockException e) {
            throw new BusinessException("数据已被其他用户修改，请刷新后重试");
        }
    }
}
```

---

## 关联关系

### 关联注解

| 注解 | 说明 |
|------|------|
| `@OneToOne` | 一对一关联 |
| `@OneToMany` | 一对多关联 |
| `@ManyToOne` | 多对一关联 |
| `@ManyToMany` | 多对多关联 |

### 使用示例

```java
@Getter
@Setter
public class User extends BaseEntity<Long> {

    private String username;

    // 一对多
    @OneToMany(mappedBy = "user")
    private List<Order> orders;

    // 多对一
    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Dept dept;
}

@Getter
@Setter
public class Order extends BaseEntity<Long> {

    private String orderNo;

    // 多对一
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

// ==================== 关联加载 ====================

// 急加载
List<User> users = dataManager.entity(User.class)
    .query()
    .withAssociation("orders")
    .list();

// 按需加载
User user = dataManager.findById(User.class, 1L).orElseThrow();
List<Order> orders = dataManager.entity(User.class).fetch(user, "orders");

// 批量加载
List<User> users = dataManager.findAll(User.class);
dataManager.entity(User.class).fetchAll(users, "orders");
```

---

## 完整示例

### 实体定义

```java
@Getter
@Setter
@Entity
@Table(name = "sys_user", indexes = {
    @Index(name = "idx_user_username", columnList = "username"),
    @Index(name = "idx_user_tenant", columnList = "tenant_id")
})
public class User extends TenantEntity<Long> {

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "real_name", length = 50)
    private String realName;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "status")
    private Integer status = 1;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Dept dept;
}
```

### 服务层

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final DataManager dataManager;

    /**
     * 创建用户
     */
    @Transactional
    public User create(User user) {
        // 检查用户名是否存在
        if (dataManager.existsByCondition(User.class,
            builder(User.class).eq(User::getUsername, user.getUsername()).build())) {
            throw new BusinessException("用户名已存在");
        }

        return dataManager.save(User.class, user);
    }

    /**
     * 更新用户
     */
    @Transactional
    public User update(User user) {
        User existing = dataManager.findById(User.class, user.getId())
            .orElseThrow(() -> new EntityNotFoundException(User.class, user.getId()));

        existing.setRealName(user.getRealName());
        existing.setEmail(user.getEmail());

        return dataManager.save(User.class, existing);
    }

    /**
     * 分页查询
     */
    public Page<User> listUsers(String keyword, Integer status, Long deptId, PageRequest pageRequest) {
        TypedConditionBuilder<User> builder = builder(User.class);

        if (StringUtils.hasText(keyword)) {
            builder.like(User::getUsername, keyword)
                   .or(builder(User.class).like(User::getRealName, keyword).build());
        }

        if (status != null) {
            builder.eq(User::getStatus, status);
        }

        if (deptId != null) {
            builder.eq(User::getDept, Dept.builder().id(deptId).build());
        }

        return dataManager.entity(User.class)
            .query()
            .withDataScope(DataScope.of("sys_user", "dept_id", DataScopeType.DEPT))
            .where(builder.build())
            .page(pageRequest);
    }

    /**
     * 批量更新状态
     */
    @Transactional
    public long updateStatus(List<Long> ids, Integer status) {
        return dataManager.entity(User.class)
            .updateAll(
                builder(User.class).in(User::getId, ids).build(),
                Map.of("status", status, "updated_at", LocalDateTime.now())
            );
    }

    /**
     * 软删除
     */
    @Transactional
    public void delete(Long id) {
        dataManager.deleteById(User.class, id);
    }

    /**
     * 统计各部门用户数
     */
    public List<DeptUserStats> countByDept() {
        return dataManager.query()
            .select("dept_id", "COUNT(*) as user_count")
            .from("sys_user")
            .where(builder().eq("status", 1).build())
            .groupBy("dept_id")
            .fetch(DeptUserStats.class);
    }
}
```

### 控制器层

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public User create(@RequestBody @Valid UserCreateRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setRealName(request.getRealName());
        user.setEmail(request.getEmail());
        return userService.create(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody @Valid UserUpdateRequest request) {
        User user = new User();
        user.setId(id);
        user.setRealName(request.getRealName());
        user.setEmail(request.getEmail());
        return userService.update(user);
    }

    @GetMapping
    public Page<User> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Long deptId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.desc("createdAt"));
        return userService.listUsers(keyword, status, deptId, pageRequest);
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return dataManager.findById(User.class, id)
            .orElseThrow(() -> new EntityNotFoundException(User.class, id));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }

    @PutMapping("/{id}/status")
    public void updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        userService.updateStatus(List.of(id), status);
    }
}
```

---

## 配置项

```yaml
# application.yml
afg:
  data:
    # 多租户配置
    tenant:
      enabled: true
      column: tenant_id
      ignore-tables:
        - sys_dict
        - sys_config

    # 软删除配置
    soft-delete:
      enabled: true
      column: deleted

    # 数据权限配置
    data-scope:
      enabled: true

    # ID 生成配置
    id:
      type: snowflake
      snowflake:
        worker-id: 1
        datacenter-id: 1
        epoch: 2024-01-01

    # 审计配置
    audit:
      enabled: true
      create-by-column: create_by
      update-by-column: update_by
      create-time-column: created_at
      update-time-column: updated_at
```

---

## 相关文档

- [核心模块](/framework/core)
- [Redis 集成](/framework/redis)
