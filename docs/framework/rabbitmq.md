# RabbitMQ 集成

afg-rabbitmq 模块提供 RabbitMQ 消息队列功能。

## 功能特性

- 消息发送封装
- 消息消费监听
- 死信队列
- 延迟消息

## 依赖配置

```kotlin
dependencies {
    implementation("io.github.afg-projects:afg-framework-afg-rabbitmq:1.0.0-SNAPSHOT")
}
```

## 配置

```yaml
spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
    virtual-host: /
    listener:
      simple:
        acknowledge-mode: manual
        prefetch: 10
```

## 队列配置

### 定义队列

```java
@Configuration
public class RabbitConfig {

    @Bean
    public Queue orderQueue() {
        return QueueBuilder.durable("order.queue")
            .withArgument("x-dead-letter-exchange", "order.dlx")
            .withArgument("x-dead-letter-routing-key", "order.dead")
            .build();
    }

    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange("order.exchange");
    }

    @Bean
    public Binding orderBinding() {
        return BindingBuilder.bind(orderQueue())
            .to(orderExchange())
            .with("order.created");
    }
}
```

## 消息发送

### 使用示例

```java
@Service
public class OrderService {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void createOrder(OrderDTO dto) {
        Order order = // ... 创建订单

        rabbitTemplate.convertAndSend(
            "order.exchange",
            "order.created",
            order
        );
    }
}
```

## 消息消费

### 监听消息

```java
@Component
public class OrderConsumer {

    @RabbitListener(queues = "order.queue")
    public void onOrderCreated(Order order, Channel channel, Message message) throws IOException {
        try {
            // 处理订单
            processOrder(order);
            // 确认消息
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        } catch (Exception e) {
            // 拒绝消息，重新入队
            channel.basicNack(message.getMessageProperties().getDeliveryTag(), false, true);
        }
    }
}
```

## 延迟消息

### 配置延迟队列

```java
@Bean
public Queue delayQueue() {
    return QueueBuilder.durable("delay.queue")
        .withArgument("x-message-ttl", 60000) // 60秒
        .withArgument("x-dead-letter-exchange", "order.exchange")
        .withArgument("x-dead-letter-routing-key", "order.created")
        .build();
}
```

## 相关文档

- [Redis 集成](/framework/redis)
- [Kafka 集成](/framework/kafka)