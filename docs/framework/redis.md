# Redis 集成

afg-redis 模块提供 Redis 缓存、分布式锁、延迟队列等功能。

## 功能特性

- 缓存操作封装
- 分布式锁
- 延迟队列
- 发布订阅
- 限流器

## 依赖配置

```kotlin
dependencies {
    implementation("io.github.afg-projects:afg-framework-afg-redis:1.0.0-SNAPSHOT")
}
```

## 缓存操作

### 配置

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: ${REDIS_PASSWORD:}
      database: 0
```

### 使用示例

```java
@Service
public class UserService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public User getUser(String id) {
        String key = "user:" + id;
        User user = (User) redisTemplate.opsForValue().get(key);
        if (user == null) {
            user = userRepository.findById(id);
            redisTemplate.opsForValue().set(key, user, Duration.ofHours(1));
        }
        return user;
    }
}
```

## 分布式锁

### 使用示例

```java
@Service
public class OrderService {

    @Autowired
    private DistributedLock lock;

    public void processOrder(String orderId) {
        String lockKey = "order:lock:" + orderId;
        if (lock.tryLock(lockKey, Duration.ofSeconds(30))) {
            try {
                // 处理订单
            } finally {
                lock.unlock(lockKey);
            }
        } else {
            throw new BusinessException("订单正在处理中");
        }
    }
}
```

### 注解方式

```java
@Service
public class StockService {

    @Lock(key = "'stock:' + #productId", waitTime = 5, leaseTime = 30)
    public void deductStock(String productId, int quantity) {
        // 扣减库存
    }
}
```

## 延迟队列

### 定义任务

```java
@Data
public class DelayTask implements Delayed {
    private String id;
    private long executeTime;

    @Override
    public long getDelay(TimeUnit unit) {
        return unit.convert(executeTime - System.currentTimeMillis(), TimeUnit.MILLISECONDS);
    }

    @Override
    public int compareTo(Delayed other) {
        return Long.compare(this.executeTime, ((DelayTask) other).executeTime);
    }
}
```

### 使用示例

```java
@Service
public class TaskScheduler {

    @Autowired
    private DelayQueue<DelayTask> delayQueue;

    public void scheduleTask(String taskId, Duration delay) {
        DelayTask task = new DelayTask();
        task.setId(taskId);
        task.setExecuteTime(System.currentTimeMillis() + delay.toMillis());
        delayQueue.offer(task);
    }
}
```

## 限流器

### 使用示例

```java
@Service
public class ApiLimiter {

    @Autowired
    private RateLimiter rateLimiter;

    public boolean allowRequest(String apiKey) {
        return rateLimiter.tryAcquire(apiKey, 100, Duration.ofSeconds(1));
    }
}
```

## 相关文档

- [核心模块](/framework/core)
- [Kafka 集成](/framework/kafka)
