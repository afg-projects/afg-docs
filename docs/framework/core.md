# 核心模块

核心模块提供缓存、事件、异常、安全、调度等基础能力。

## 模块结构

```
core/
├── cache/       # 缓存抽象
├── event/       # 事件发布
├── exception/   # 异常处理
├── security/    # 安全工具
└── schedule/    # 任务调度
```

## 缓存模块

### 接口定义

```java
public interface Cache<K, V> {

    V get(K key);

    void put(K key, V value);

    void put(K key, V value, Duration ttl);

    void remove(K key);

    void clear();
}
```

### 使用示例

```java
@Service
public class UserService {

    @Autowired
    private Cache<String, User> userCache;

    public User getUser(String id) {
        return userCache.get(id, () -> {
            return userRepository.findById(id);
        });
    }
}
```

## 事件模块

### 定义事件

```java
public class UserCreatedEvent extends ApplicationEvent {
    private final User user;

    public UserCreatedEvent(User user) {
        super(user);
        this.user = user;
    }
}
```

### 发布事件

```java
@Service
public class UserService {

    @Autowired
    private ApplicationEventPublisher eventPublisher;

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

## 异常模块

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

## 调度模块

### 定义任务

```java
@Component
public class CleanupJob implements Job {

    @Override
    public void execute(JobExecutionContext context) {
        // 执行清理任务
    }
}
```

### 配置调度

```java
@Configuration
public class ScheduleConfig {

    @Bean
    public JobDetail cleanupJobDetail() {
        return JobBuilder.newJob(CleanupJob.class)
            .withIdentity("cleanupJob")
            .storeDurably()
            .build();
    }

    @Bean
    public Trigger cleanupTrigger() {
        return TriggerBuilder.newTrigger()
            .forJob(cleanupJobDetail())
            .withSchedule(CronScheduleBuilder.cronSchedule("0 0 2 * * ?"))
            .build();
    }
}
```

## 相关文档

- [数据访问](/framework/data)
- [Redis 集成](/framework/redis)
