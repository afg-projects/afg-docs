# Redis 集成

afg-redis 模块基于 Redisson 提供 Redis 缓存、分布式锁、延迟队列等功能。

## 功能特性

- **缓存**：本地缓存、分布式缓存、多级缓存
- **分布式锁**：可重入锁、公平锁、读写锁
- **延迟队列**：分布式延迟任务调度
- **审计日志**：Redis 审计日志存储
- **健康检查**：Redis 健康指标

## 依赖配置

```kotlin
dependencies {
    implementation("io.github.afg-projects:afg-framework-afg-redis:1.0.0")
}
```

## 配置

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: ${REDIS_PASSWORD:}
      database: 0

afg:
  redis:
    lock:
      key-prefix: "afg:lock"
    cache:
      default-ttl: 3600000  # 默认缓存过期时间（毫秒）
```

## 缓存操作

### 使用注解

```java
@Service
public class UserService {

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
}
```

### 编程式缓存

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final CacheManager cacheManager;

    public User getUser(String id) {
        AfgCache<User> cache = cacheManager.getCache("users");

        User user = cache.get(id);
        if (user == null) {
            user = userRepository.findById(id);
            cache.put(id, user, Duration.ofHours(1).toMillis());
        }
        return user;
    }
}
```

## 分布式锁

### 使用示例

```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final DistributedLock distributedLock;

    public void processOrder(String orderId) {
        // 尝试获取锁
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

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| REENTRANT | 可重入锁（默认） | 常规场景 |
| FAIR | 公平锁 | 需要按顺序获取锁 |
| READ | 读锁（共享锁） | 读写分离场景 |
| WRITE | 写锁（排他锁） | 读写分离场景 |

### 读写锁

```java
// 读锁（共享）
boolean readAcquired = distributedLock.tryReadLock("resource", 5000, 30000);
if (readAcquired) {
    try {
        // 读取数据
    } finally {
        distributedLock.unlockReadLock("resource");
    }
}

// 写锁（排他）
boolean writeAcquired = distributedLock.tryWriteLock("resource", 5000, 30000);
if (writeAcquired) {
    try {
        // 写入数据
    } finally {
        distributedLock.unlockWriteLock("resource");
    }
}
```

### Watchdog 自动续期

当 `leaseTime = -1` 时，启用 Watchdog 自动续期：

```java
// 使用 watchdog 自动续期（默认 30 秒续期一次）
boolean acquired = distributedLock.tryLock("my-lock", 5000, -1);
```

## 延迟队列

### 定义任务载荷

```java
@Data
public class OrderDelayTask {
    private String orderId;
    private String action;
    private LocalDateTime createdAt;
}
```

### 创建延迟队列

```java
@Configuration
public class SchedulerConfig {

    @Bean
    public RedissonDelayQueue<OrderDelayTask> orderDelayQueue(RedissonClient redissonClient) {
        return new RedissonDelayQueue<>(
            redissonClient,
            "order-delay-queue",
            3  // 消费者线程数
        );
    }
}
```

### 使用延迟队列

```java
@Service
@RequiredArgsConstructor
public class OrderScheduler {

    private final RedissonDelayQueue<OrderDelayTask> delayQueue;

    @PostConstruct
    public void init() {
        // 注册任务处理器
        delayQueue.registerProcessor((taskId, payload) -> {
            log.info("处理延迟任务: {}", payload.getOrderId());
            // 执行业务逻辑
            return CompletableFuture.completedFuture(null);
        });

        // 启动队列
        delayQueue.start();
    }

    // 添加延迟任务
    public void scheduleCancel(String orderId, Duration delay) {
        OrderDelayTask task = new OrderDelayTask();
        task.setOrderId(orderId);
        task.setAction("CANCEL");

        delayQueue.offer(orderId, task, delay);
    }

    // 指定时间执行
    public void scheduleAt(String orderId, Instant executeTime) {
        OrderDelayTask task = new OrderDelayTask();
        task.setOrderId(orderId);
        task.setAction("REMIND");

        delayQueue.offerAt(orderId, task, executeTime);
    }

    // 取消任务
    public void cancel(String taskId) {
        delayQueue.cancel(taskId);
    }

    @PreDestroy
    public void destroy() {
        delayQueue.stop();
    }
}
```

## 审计日志存储

```java
@Service
@RequiredArgsConstructor
public class AuditService {

    private final RedisAuditLogStorage auditLogStorage;

    public void saveAuditLog(AuditLog log) {
        auditLogStorage.save(log);
    }

    public List<AuditLog> queryLogs(String userId, LocalDateTime start, LocalDateTime end) {
        return auditLogStorage.query(userId, start, end);
    }
}
```

## 相关文档

- [核心模块](/framework/core)
- [Kafka 集成](/framework/kafka)
