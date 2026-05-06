# Kafka 集成

afg-kafka 模块提供 Kafka 事件发布和消费功能。

## 功能特性

- 事件发布封装
- 消费者配置
- 消息序列化
- 异步发送

## 依赖配置

```kotlin
dependencies {
    implementation("io.github.afg-projects:afg-framework-afg-kafka:1.0.0-SNAPSHOT")
}
```

## 配置

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.JsonSerializer
    consumer:
      group-id: afg-group
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.JsonDeserializer
      auto-offset-reset: earliest
```

## 事件发布

### 定义事件

```java
@Data
public class OrderCreatedEvent {
    private String orderId;
    private String userId;
    private BigDecimal amount;
    private LocalDateTime createdAt;
}
```

### 发布事件

```java
@Service
public class OrderService {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void createOrder(OrderDTO dto) {
        Order order = // ... 创建订单

        OrderCreatedEvent event = new OrderCreatedEvent();
        event.setOrderId(order.getId());
        event.setUserId(order.getUserId());
        event.setAmount(order.getAmount());
        event.setCreatedAt(LocalDateTime.now());

        kafkaTemplate.send("order-created", order.getId(), event);
    }
}
```

## 事件消费

### 消费者示例

```java
@Component
public class OrderEventListener {

    @KafkaListener(topics = "order-created", groupId = "order-group")
    public void onOrderCreated(OrderCreatedEvent event) {
        // 处理订单创建事件
        log.info("收到订单创建事件: {}", event.getOrderId());
    }
}
```

### 批量消费

```java
@KafkaListener(topics = "order-created", batch = "true")
public void onOrdersCreated(List<OrderCreatedEvent> events) {
    // 批量处理
    events.forEach(event -> {
        // 处理单个事件
    });
}
```

## 消息确认

```java
@KafkaListener(topics = "order-created")
public void onOrderCreated(OrderCreatedEvent event, Acknowledgment ack) {
    try {
        // 处理事件
        processEvent(event);
        // 手动确认
        ack.acknowledge();
    } catch (Exception e) {
        // 处理失败，不确认
        log.error("处理事件失败", e);
    }
}
```

## 相关文档

- [Redis 集成](/framework/redis)
- [RabbitMQ 集成](/framework/rabbitmq)