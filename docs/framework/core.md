# 核心模块

核心模块提供缓存管理、分布式锁、事件发布、异常处理、安全防护等基础能力。

## 模块结构

```
core/
├── cache/       # 缓存管理
├── lock/        # 分布式锁
├── event/       # 事件发布
├── exception/   # 异常处理
├── security/    # 安全防护
├── scheduler/   # 任务调度
├── web/         # Web 增强
├── module/      # 模块系统
├── audit/       # 审计日志
├── batch/       # 批处理
├── client/      # 客户端
├── cloud/       # 云服务
├── codegen/     # 代码生成
├── datasource/  # 数据源
├── feature/     # 功能开关
├── metrics/     # 指标监控
└── trace/       # 链路追踪
```

## 缓存管理

### 接口定义

```java
public interface AfgCache<V> {

    String getName();

    V get(String key);

    void put(String key, V value);

    void put(String key, V value, long ttlMillis);

    void evict(String key);

    void clear();

    V putIfAbsent(String key, V value, long ttlMillis);

    boolean containsKey(String key);

    long size();
}
```

### 声明式缓存注解

```java
// 缓存方法返回值
@Cached(cacheName = "users", key = "#id", ttl = 60, timeUnit = TimeUnit.MINUTES)
public User getUser(String id) {
    return userRepository.findById(id);
}

// 更新缓存
@CachePut(cacheName = "users", key = "#user.id")
public User updateUser(User user) {
    return userRepository.save(user);
}

// 清除缓存
@CacheEvict(cacheName = "users", key = "#id")
public void deleteUser(String id) {
    userRepository.deleteById(id);
}
```

### 缓存类型

- **LocalCache** - 本地缓存（Caffeine）
- **DistributedCache** - 分布式缓存（Redis）
- **MultiLevelCache** - 多级缓存（本地 + 分布式）

## 分布式锁

### 接口定义

```java
public interface DistributedLock {

    // 尝试获取锁
    boolean tryLock(String key, long waitTime, long leaseTime);

    // 尝试获取指定类型的锁
    boolean tryLock(String key, long waitTime, long leaseTime, LockType lockType);

    // 阻塞获取锁
    void lock(String key);

    // 释放锁
    void unlock(String key);

    // 检查锁状态
    boolean isLocked(String key);
    boolean isHeldByCurrentThread(String key);

    // 读写锁
    boolean tryReadLock(String key, long waitTime, long leaseTime);
    boolean tryWriteLock(String key, long waitTime, long leaseTime);
}
```

### 使用示例

```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final DistributedLock distributedLock;

    public void processOrder(String orderId) {
        boolean acquired = distributedLock.tryLock(
            "order:" + orderId,  // 锁键
            5000,                // 等待时间（毫秒）
            30000                // 持有时间（毫秒）
        );

        if (acquired) {
            try {
                // 执行业务逻辑
                doProcess(orderId);
            } finally {
                distributedLock.unlock("order:" + orderId);
            }
        } else {
            throw new BusinessException("订单正在处理中");
        }
    }
}
```

### 锁类型

| 类型 | 说明 |
|------|------|
| REENTRANT | 可重入锁（默认） |
| FAIR | 公平锁 |
| READ | 读锁（共享锁） |
| WRITE | 写锁（排他锁） |

### Watchdog 自动续期

当 `leaseTime = -1` 时，启用 Watchdog 自动续期机制，防止业务执行时间超过锁持有时间。

## 事件发布

### 定义事件

```java
public class UserCreatedEvent extends ApplicationEvent {
    private final User user;

    public UserCreatedEvent(User user) {
        super(user);
        this.user = user;
    }

    public User getUser() {
        return user;
    }
}
```

### 发布事件

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final ApplicationEventPublisher eventPublisher;

    public void createUser(UserDTO dto) {
        User user = // ... 创建用户
        eventPublisher.publishEvent(new UserCreatedEvent(user));
    }
}
```

### 监听事件

```java
@Component
public class UserEventListener {

    @EventListener
    public void onUserCreated(UserCreatedEvent event) {
        // 处理用户创建事件
    }
}
```

## 异常处理

### 业务异常

```java
public class BusinessException extends RuntimeException {
    private final int code;

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }
}
```

### 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        return Result.error(e.getCode(), e.getMessage());
    }
}
```

## 相关文档

- [数据访问](/framework/data)
- [Redis 集成](/framework/redis)
