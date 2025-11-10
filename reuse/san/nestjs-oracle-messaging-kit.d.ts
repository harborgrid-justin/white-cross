/**
 * LOC: NOMK8J9M2S
 * File: /reuse/san/nestjs-oracle-messaging-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/microservices (v11.1.8)
 *   - @nestjs/common (v11.1.8)
 *   - rxjs (v7.8.1)
 *   - uuid (v9.0.1)
 *
 * DOWNSTREAM (imported by):
 *   - Microservices message producers and consumers
 *   - Message queue controllers and services
 *   - Event-driven healthcare workflows
 */
/**
 * JMS-style message structure
 */
export interface JmsMessage<T = any> {
    messageId: string;
    correlationId?: string;
    timestamp: number;
    expiresAt?: number;
    priority: MessagePriority;
    deliveryMode: DeliveryMode;
    redelivered: boolean;
    deliveryCount: number;
    headers: MessageHeaders;
    properties: MessageProperties;
    body: T;
}
/**
 * Message priority levels (JMS standard)
 */
export declare enum MessagePriority {
    LOWEST = 0,
    LOW = 1,
    NORMAL = 4,
    HIGH = 7,
    HIGHEST = 9,
    CRITICAL = 10
}
/**
 * Message delivery modes
 */
export declare enum DeliveryMode {
    NON_PERSISTENT = 1,
    PERSISTENT = 2
}
/**
 * Message acknowledgment modes
 */
export declare enum AcknowledgmentMode {
    AUTO_ACKNOWLEDGE = 1,
    CLIENT_ACKNOWLEDGE = 2,
    DUPS_OK_ACKNOWLEDGE = 3,
    SESSION_TRANSACTED = 0
}
/**
 * Message headers (JMS standard)
 */
export interface MessageHeaders {
    JMSDestination: string;
    JMSDeliveryMode: DeliveryMode;
    JMSExpiration: number;
    JMSPriority: MessagePriority;
    JMSMessageID: string;
    JMSTimestamp: number;
    JMSCorrelationID?: string;
    JMSReplyTo?: string;
    JMSType?: string;
    JMSRedelivered: boolean;
    [key: string]: any;
}
/**
 * Custom message properties
 */
export interface MessageProperties {
    tenantId?: string;
    organizationId?: string;
    userId?: string;
    patientId?: string;
    encounterId?: string;
    hipaaAuditRequired?: boolean;
    phiIncluded?: boolean;
    encrypted?: boolean;
    [key: string]: any;
}
/**
 * Queue configuration
 */
export interface QueueConfig {
    name: string;
    durable: boolean;
    exclusive: boolean;
    autoDelete: boolean;
    maxLength?: number;
    maxLengthBytes?: number;
    messageTtl?: number;
    deadLetterExchange?: string;
    deadLetterRoutingKey?: string;
    maxPriority?: number;
    arguments?: Record<string, any>;
}
/**
 * Topic configuration
 */
export interface TopicConfig {
    name: string;
    durable: boolean;
    autoDelete: boolean;
    arguments?: Record<string, any>;
}
/**
 * Durable subscription configuration
 */
export interface DurableSubscriptionConfig {
    subscriptionName: string;
    topicName: string;
    selector?: string;
    noLocal?: boolean;
    durable: boolean;
}
/**
 * Message selector filter
 */
export interface MessageSelector {
    expression: string;
    compiled?: (msg: JmsMessage) => boolean;
}
/**
 * Dead letter queue configuration
 */
export interface DeadLetterQueueConfig {
    queueName: string;
    exchange?: string;
    routingKey?: string;
    maxRetries: number;
    retryDelay: number;
    retryBackoffMultiplier: number;
}
/**
 * Message acknowledgment result
 */
export interface AckResult {
    success: boolean;
    messageId: string;
    acknowledgedAt: number;
    error?: string;
}
/**
 * Request-reply configuration
 */
export interface RequestReplyConfig {
    destination: string;
    replyTo: string;
    timeout: number;
    correlationId?: string;
}
/**
 * Scheduled message configuration
 */
export interface ScheduledMessageConfig {
    scheduleType: 'delay' | 'timestamp' | 'cron';
    delay?: number;
    timestamp?: number;
    cronExpression?: string;
}
/**
 * Message filter predicate
 */
export type MessageFilterPredicate<T = any> = (message: JmsMessage<T>) => boolean;
/**
 * Batch acknowledgment result
 */
export interface BatchAckResult {
    total: number;
    successful: number;
    failed: number;
    results: AckResult[];
}
/**
 * Message consumer options
 */
export interface ConsumerOptions {
    queueName: string;
    acknowledgmentMode: AcknowledgmentMode;
    prefetchCount?: number;
    noAck?: boolean;
    consumerTag?: string;
    exclusive?: boolean;
}
/**
 * Creates a JMS-style message with standard headers and properties.
 *
 * @template T - Message body type
 * @param {T} body - Message payload
 * @param {Partial<MessageHeaders>} headers - Optional message headers
 * @param {MessageProperties} properties - Optional custom properties
 * @returns {JmsMessage<T>} Complete JMS message
 *
 * @example
 * ```typescript
 * const message = createJmsMessage(
 *   { patientId: 'P123', event: 'ADMISSION' },
 *   { JMSPriority: MessagePriority.HIGH },
 *   { hipaaAuditRequired: true, phiIncluded: true }
 * );
 * await messageProducer.send('patient.events', message);
 * ```
 */
export declare function createJmsMessage<T>(body: T, headers?: Partial<MessageHeaders>, properties?: MessageProperties): JmsMessage<T>;
/**
 * Sets message priority for critical healthcare events.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @param {MessagePriority} priority - Priority level
 * @returns {JmsMessage<T>} Message with updated priority
 *
 * @example
 * ```typescript
 * const criticalAlert = createJmsMessage({ type: 'CODE_BLUE', location: 'ER-3' });
 * const prioritized = setMessagePriority(criticalAlert, MessagePriority.CRITICAL);
 * await emergencyQueue.send(prioritized);
 * ```
 */
export declare function setMessagePriority<T>(message: JmsMessage<T>, priority: MessagePriority): JmsMessage<T>;
/**
 * Sets message TTL (time-to-live) for automatic expiration.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @param {number} ttlMs - Time to live in milliseconds
 * @returns {JmsMessage<T>} Message with expiration set
 *
 * @example
 * ```typescript
 * const appointment = createJmsMessage({ appointmentId: 'A123', time: '2024-03-15T10:00:00Z' });
 * const expiring = setMessageTTL(appointment, 3600000); // 1 hour
 * await appointmentQueue.send(expiring);
 * ```
 */
export declare function setMessageTTL<T>(message: JmsMessage<T>, ttlMs: number): JmsMessage<T>;
/**
 * Sets correlation ID for message tracking and request-reply patterns.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @param {string} correlationId - Correlation identifier
 * @returns {JmsMessage<T>} Message with correlation ID
 *
 * @example
 * ```typescript
 * const request = createJmsMessage({ query: 'getPatientRecord', patientId: 'P123' });
 * const correlated = setCorrelationId(request, 'req-12345');
 * await requestQueue.send(correlated);
 * ```
 */
export declare function setCorrelationId<T>(message: JmsMessage<T>, correlationId: string): JmsMessage<T>;
/**
 * Sets reply-to destination for request-reply messaging.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @param {string} replyTo - Reply destination queue/topic
 * @returns {JmsMessage<T>} Message with reply destination
 *
 * @example
 * ```typescript
 * const request = createJmsMessage({ operation: 'fetchVitals', patientId: 'P123' });
 * const withReply = setReplyTo(request, 'vitals.response.queue');
 * await vitalsRequestQueue.send(withReply);
 * ```
 */
export declare function setReplyTo<T>(message: JmsMessage<T>, replyTo: string): JmsMessage<T>;
/**
 * Marks message as containing PHI (Protected Health Information) for HIPAA compliance.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @param {boolean} encrypted - Whether PHI is encrypted
 * @returns {JmsMessage<T>} Message with PHI flags
 *
 * @example
 * ```typescript
 * const patientData = createJmsMessage({ ssn: '***-**-1234', medicalHistory: [...] });
 * const hipaaCompliant = markMessageWithPHI(patientData, true);
 * await secureQueue.send(hipaaCompliant);
 * ```
 */
export declare function markMessageWithPHI<T>(message: JmsMessage<T>, encrypted: boolean): JmsMessage<T>;
/**
 * Sets healthcare-specific context properties on message.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @param {object} context - Healthcare context
 * @param {string} context.tenantId - Tenant identifier
 * @param {string} context.organizationId - Organization identifier
 * @param {string} context.patientId - Patient identifier
 * @param {string} context.encounterId - Encounter identifier
 * @returns {JmsMessage<T>} Message with context properties
 *
 * @example
 * ```typescript
 * const labResult = createJmsMessage({ testType: 'CBC', results: {...} });
 * const withContext = setHealthcareContext(labResult, {
 *   tenantId: 'hospital-1',
 *   organizationId: 'org-123',
 *   patientId: 'P123',
 *   encounterId: 'E456'
 * });
 * await labQueue.send(withContext);
 * ```
 */
export declare function setHealthcareContext<T>(message: JmsMessage<T>, context: {
    tenantId?: string;
    organizationId?: string;
    patientId?: string;
    encounterId?: string;
}): JmsMessage<T>;
/**
 * Clones message for redelivery with updated metadata.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - Original JMS message
 * @returns {JmsMessage<T>} Cloned message with incremented delivery count
 *
 * @example
 * ```typescript
 * @MessagePattern('process.order')
 * async handleOrder(message: JmsMessage<Order>) {
 *   try {
 *     await this.processOrder(message.body);
 *   } catch (error) {
 *     const redelivery = cloneMessageForRedelivery(message);
 *     await this.retryQueue.send(redelivery);
 *   }
 * }
 * ```
 */
export declare function cloneMessageForRedelivery<T>(message: JmsMessage<T>): JmsMessage<T>;
/**
 * Creates queue configuration with dead letter queue support.
 *
 * @param {string} name - Queue name
 * @param {Partial<QueueConfig>} options - Queue configuration options
 * @returns {QueueConfig} Complete queue configuration
 *
 * @example
 * ```typescript
 * const queueConfig = createQueueConfig('patient.admissions', {
 *   durable: true,
 *   maxLength: 10000,
 *   messageTtl: 86400000, // 24 hours
 *   deadLetterExchange: 'dlx.patient',
 *   deadLetterRoutingKey: 'patient.admissions.failed',
 *   maxPriority: 10
 * });
 * await channel.assertQueue(queueConfig.name, queueConfig);
 * ```
 */
export declare function createQueueConfig(name: string, options?: Partial<QueueConfig>): QueueConfig;
/**
 * Creates priority queue configuration for critical healthcare messages.
 *
 * @param {string} name - Queue name
 * @param {number} maxPriority - Maximum priority level (default: 10)
 * @returns {QueueConfig} Priority queue configuration
 *
 * @example
 * ```typescript
 * const emergencyQueue = createPriorityQueue('emergency.alerts', 10);
 * await channel.assertQueue(emergencyQueue.name, emergencyQueue);
 *
 * // Send critical message
 * const alert = createJmsMessage({ type: 'CODE_BLUE' });
 * const prioritized = setMessagePriority(alert, MessagePriority.CRITICAL);
 * await channel.sendToQueue(emergencyQueue.name, Buffer.from(JSON.stringify(prioritized)));
 * ```
 */
export declare function createPriorityQueue(name: string, maxPriority?: number): QueueConfig;
/**
 * Creates delayed message queue with TTL-based routing.
 *
 * @param {string} name - Queue name
 * @param {number} delayMs - Delay in milliseconds
 * @param {string} targetQueue - Target queue after delay
 * @returns {QueueConfig} Delayed queue configuration
 *
 * @example
 * ```typescript
 * const delayedQueue = createDelayedQueue(
 *   'appointments.reminder.delayed',
 *   3600000, // 1 hour delay
 *   'appointments.reminder.delivery'
 * );
 * await channel.assertQueue(delayedQueue.name, delayedQueue);
 * ```
 */
export declare function createDelayedQueue(name: string, delayMs: number, targetQueue: string): QueueConfig;
/**
 * Validates queue exists and returns metadata.
 *
 * @param {string} queueName - Queue name
 * @param {any} channel - RabbitMQ channel
 * @returns {Promise<{ queue: string; messageCount: number; consumerCount: number }>} Queue metadata
 *
 * @example
 * ```typescript
 * const queueInfo = await validateQueueExists('patient.events', channel);
 * console.log(`Queue has ${queueInfo.messageCount} messages, ${queueInfo.consumerCount} consumers`);
 * ```
 */
export declare function validateQueueExists(queueName: string, channel: any): Promise<{
    queue: string;
    messageCount: number;
    consumerCount: number;
}>;
/**
 * Purges all messages from a queue.
 *
 * @param {string} queueName - Queue name
 * @param {any} channel - RabbitMQ channel
 * @returns {Promise<{ messageCount: number }>} Number of purged messages
 *
 * @example
 * ```typescript
 * const result = await purgeQueue('test.queue', channel);
 * console.log(`Purged ${result.messageCount} messages from queue`);
 * ```
 */
export declare function purgeQueue(queueName: string, channel: any): Promise<{
    messageCount: number;
}>;
/**
 * Binds queue to exchange with routing key.
 *
 * @param {string} queueName - Queue name
 * @param {string} exchangeName - Exchange name
 * @param {string} routingKey - Routing key pattern
 * @param {any} channel - RabbitMQ channel
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await bindQueueToExchange(
 *   'patient.admissions.queue',
 *   'patient.events',
 *   'patient.admission.*',
 *   channel
 * );
 * ```
 */
export declare function bindQueueToExchange(queueName: string, exchangeName: string, routingKey: string, channel: any): Promise<void>;
/**
 * Creates topic configuration for pub/sub messaging.
 *
 * @param {string} name - Topic name
 * @param {Partial<TopicConfig>} options - Topic configuration options
 * @returns {TopicConfig} Complete topic configuration
 *
 * @example
 * ```typescript
 * const patientEventsTopic = createTopicConfig('patient.events', {
 *   durable: true,
 *   autoDelete: false
 * });
 * await channel.assertExchange(patientEventsTopic.name, 'topic', patientEventsTopic);
 * ```
 */
export declare function createTopicConfig(name: string, options?: Partial<TopicConfig>): TopicConfig;
/**
 * Creates durable subscription configuration for guaranteed topic message delivery.
 *
 * @param {string} subscriptionName - Unique subscription name
 * @param {string} topicName - Topic name
 * @param {string} selector - Optional message selector
 * @returns {DurableSubscriptionConfig} Durable subscription configuration
 *
 * @example
 * ```typescript
 * const subscription = createDurableSubscription(
 *   'radiology-department-sub',
 *   'patient.imaging.events',
 *   "department = 'radiology' AND priority >= 7"
 * );
 * await subscriptionService.create(subscription);
 * ```
 */
export declare function createDurableSubscription(subscriptionName: string, topicName: string, selector?: string): DurableSubscriptionConfig;
/**
 * Creates non-durable (temporary) subscription for topic.
 *
 * @param {string} subscriptionName - Subscription name
 * @param {string} topicName - Topic name
 * @param {string} selector - Optional message selector
 * @returns {DurableSubscriptionConfig} Non-durable subscription configuration
 *
 * @example
 * ```typescript
 * const tempSub = createNonDurableSubscription(
 *   'monitoring-dashboard-sub',
 *   'system.metrics',
 *   "metricType = 'performance'"
 * );
 * await subscriptionService.create(tempSub);
 * ```
 */
export declare function createNonDurableSubscription(subscriptionName: string, topicName: string, selector?: string): DurableSubscriptionConfig;
/**
 * Publishes message to topic for all subscribers.
 *
 * @template T - Message body type
 * @param {string} topicName - Topic name
 * @param {JmsMessage<T>} message - JMS message
 * @param {any} channel - RabbitMQ channel
 * @returns {Promise<boolean>} True if published successfully
 *
 * @example
 * ```typescript
 * const event = createJmsMessage({ eventType: 'PATIENT_DISCHARGED', patientId: 'P123' });
 * await publishToTopic('patient.lifecycle.events', event, channel);
 * ```
 */
export declare function publishToTopic<T>(topicName: string, message: JmsMessage<T>, channel: any): Promise<boolean>;
/**
 * Subscribes to topic with optional message selector.
 *
 * @param {DurableSubscriptionConfig} subscription - Subscription configuration
 * @param {(message: JmsMessage) => Promise<void>} handler - Message handler
 * @param {any} channel - RabbitMQ channel
 * @returns {Promise<string>} Consumer tag
 *
 * @example
 * ```typescript
 * const subscription = createDurableSubscription(
 *   'emergency-alerts-sub',
 *   'hospital.alerts',
 *   "priority >= 9"
 * );
 *
 * const consumerTag = await subscribeToTopic(subscription, async (message) => {
 *   console.log('Emergency alert:', message.body);
 *   await handleEmergency(message.body);
 * }, channel);
 * ```
 */
export declare function subscribeToTopic(subscription: DurableSubscriptionConfig, handler: (message: JmsMessage) => Promise<void>, channel: any): Promise<string>;
/**
 * Unsubscribes from topic by consumer tag.
 *
 * @param {string} consumerTag - Consumer tag from subscription
 * @param {any} channel - RabbitMQ channel
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const consumerTag = await subscribeToTopic(subscription, handler, channel);
 * // Later...
 * await unsubscribeFromTopic(consumerTag, channel);
 * ```
 */
export declare function unsubscribeFromTopic(consumerTag: string, channel: any): Promise<void>;
/**
 * Compiles message selector expression into executable filter function.
 *
 * @param {string} expression - JMS-style selector expression
 * @returns {MessageSelector} Compiled message selector
 *
 * @example
 * ```typescript
 * const selector = compileMessageSelector(
 *   "priority >= 7 AND department = 'emergency' AND phiIncluded = true"
 * );
 *
 * const message = createJmsMessage({ ... });
 * if (selector.compiled!(message)) {
 *   await processHighPriorityMessage(message);
 * }
 * ```
 */
export declare function compileMessageSelector(expression: string): MessageSelector;
/**
 * Filters messages by property value.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>[]} messages - Array of messages
 * @param {string} propertyName - Property name to filter by
 * @param {any} propertyValue - Expected property value
 * @returns {JmsMessage<T>[]} Filtered messages
 *
 * @example
 * ```typescript
 * const messages = await getAllMessages();
 * const emergencyMessages = filterMessagesByProperty(
 *   messages,
 *   'department',
 *   'emergency'
 * );
 * ```
 */
export declare function filterMessagesByProperty<T>(messages: JmsMessage<T>[], propertyName: string, propertyValue: any): JmsMessage<T>[];
/**
 * Filters messages by priority threshold.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>[]} messages - Array of messages
 * @param {MessagePriority} minPriority - Minimum priority level
 * @returns {JmsMessage<T>[]} Messages with priority >= minPriority
 *
 * @example
 * ```typescript
 * const allMessages = await queue.getMessages();
 * const highPriority = filterMessagesByPriority(allMessages, MessagePriority.HIGH);
 * await processHighPriorityMessages(highPriority);
 * ```
 */
export declare function filterMessagesByPriority<T>(messages: JmsMessage<T>[], minPriority: MessagePriority): JmsMessage<T>[];
/**
 * Filters messages using custom predicate function.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>[]} messages - Array of messages
 * @param {MessageFilterPredicate<T>} predicate - Filter predicate
 * @returns {JmsMessage<T>[]} Filtered messages
 *
 * @example
 * ```typescript
 * const messages = await queue.getMessages();
 * const phiMessages = filterMessages(messages, (msg) =>
 *   msg.properties.phiIncluded === true && msg.properties.encrypted === true
 * );
 * await auditService.logPhiAccess(phiMessages);
 * ```
 */
export declare function filterMessages<T>(messages: JmsMessage<T>[], predicate: MessageFilterPredicate<T>): JmsMessage<T>[];
/**
 * Filters expired messages from collection.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>[]} messages - Array of messages
 * @returns {{ expired: JmsMessage<T>[]; valid: JmsMessage<T>[] }} Separated expired and valid messages
 *
 * @example
 * ```typescript
 * const messages = await queue.getMessages();
 * const { expired, valid } = filterExpiredMessages(messages);
 *
 * await deadLetterQueue.sendBatch(expired);
 * await processValidMessages(valid);
 * ```
 */
export declare function filterExpiredMessages<T>(messages: JmsMessage<T>[]): {
    expired: JmsMessage<T>[];
    valid: JmsMessage<T>[];
};
/**
 * Acknowledges message receipt (client acknowledgment mode).
 *
 * @param {string} messageId - Message identifier
 * @param {any} channel - RabbitMQ channel
 * @param {any} deliveryTag - Delivery tag from message
 * @returns {Promise<AckResult>} Acknowledgment result
 *
 * @example
 * ```typescript
 * @MessagePattern('patient.admission')
 * async handleAdmission(message: JmsMessage, context: RmqContext) {
 *   const channel = context.getChannelRef();
 *   const originalMsg = context.getMessage();
 *
 *   try {
 *     await this.processAdmission(message.body);
 *     const ackResult = await acknowledgeMessage(
 *       message.messageId,
 *       channel,
 *       originalMsg.fields.deliveryTag
 *     );
 *     console.log('Message acknowledged:', ackResult);
 *   } catch (error) {
 *     await negativeAcknowledge(message.messageId, channel, originalMsg.fields.deliveryTag, true);
 *   }
 * }
 * ```
 */
export declare function acknowledgeMessage(messageId: string, channel: any, deliveryTag: any): Promise<AckResult>;
/**
 * Negatively acknowledges message (NACK) with optional requeue.
 *
 * @param {string} messageId - Message identifier
 * @param {any} channel - RabbitMQ channel
 * @param {any} deliveryTag - Delivery tag from message
 * @param {boolean} requeue - Whether to requeue message
 * @returns {Promise<AckResult>} Acknowledgment result
 *
 * @example
 * ```typescript
 * @MessagePattern('process.order')
 * async handleOrder(message: JmsMessage, context: RmqContext) {
 *   const channel = context.getChannelRef();
 *   const originalMsg = context.getMessage();
 *
 *   if (message.deliveryCount > 3) {
 *     // Don't requeue, send to DLQ
 *     await negativeAcknowledge(message.messageId, channel, originalMsg.fields.deliveryTag, false);
 *     return;
 *   }
 *
 *   // Requeue for retry
 *   await negativeAcknowledge(message.messageId, channel, originalMsg.fields.deliveryTag, true);
 * }
 * ```
 */
export declare function negativeAcknowledge(messageId: string, channel: any, deliveryTag: any, requeue: boolean): Promise<AckResult>;
/**
 * Acknowledges multiple messages in batch.
 *
 * @param {string[]} messageIds - Array of message identifiers
 * @param {any} channel - RabbitMQ channel
 * @param {any} deliveryTag - Last delivery tag (acknowledges all up to this)
 * @returns {Promise<BatchAckResult>} Batch acknowledgment result
 *
 * @example
 * ```typescript
 * const messageIds = messages.map(m => m.messageId);
 * const lastDeliveryTag = messages[messages.length - 1].deliveryTag;
 *
 * const result = await batchAcknowledge(messageIds, channel, lastDeliveryTag);
 * console.log(`Acknowledged ${result.successful}/${result.total} messages`);
 * ```
 */
export declare function batchAcknowledge(messageIds: string[], channel: any, deliveryTag: any): Promise<BatchAckResult>;
/**
 * Rejects message and sends to dead letter queue.
 *
 * @param {string} messageId - Message identifier
 * @param {any} channel - RabbitMQ channel
 * @param {any} deliveryTag - Delivery tag from message
 * @param {string} reason - Rejection reason
 * @returns {Promise<AckResult>} Rejection result
 *
 * @example
 * ```typescript
 * @MessagePattern('validate.patient')
 * async validatePatient(message: JmsMessage, context: RmqContext) {
 *   const channel = context.getChannelRef();
 *   const originalMsg = context.getMessage();
 *
 *   const errors = await this.validator.validate(message.body);
 *   if (errors.length > 0) {
 *     await rejectMessage(
 *       message.messageId,
 *       channel,
 *       originalMsg.fields.deliveryTag,
 *       `Validation failed: ${errors.join(', ')}`
 *     );
 *     return;
 *   }
 *
 *   await this.processValidPatient(message.body);
 * }
 * ```
 */
export declare function rejectMessage(messageId: string, channel: any, deliveryTag: any, reason: string): Promise<AckResult>;
/**
 * Implements auto-acknowledgment after successful processing.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @param {(msg: JmsMessage<T>) => Promise<void>} processor - Message processor
 * @param {any} channel - RabbitMQ channel
 * @param {any} deliveryTag - Delivery tag from message
 * @returns {Promise<AckResult>} Acknowledgment result
 *
 * @example
 * ```typescript
 * await autoAcknowledge(message, async (msg) => {
 *   await this.patientService.updateRecord(msg.body);
 *   await this.auditService.log('PATIENT_UPDATED', msg.messageId);
 * }, channel, deliveryTag);
 * ```
 */
export declare function autoAcknowledge<T>(message: JmsMessage<T>, processor: (msg: JmsMessage<T>) => Promise<void>, channel: any, deliveryTag: any): Promise<AckResult>;
/**
 * Creates dead letter queue configuration.
 *
 * @param {string} originalQueueName - Original queue name
 * @param {Partial<DeadLetterQueueConfig>} options - DLQ configuration options
 * @returns {DeadLetterQueueConfig} Complete DLQ configuration
 *
 * @example
 * ```typescript
 * const dlqConfig = createDeadLetterQueueConfig('patient.admissions', {
 *   maxRetries: 3,
 *   retryDelay: 5000,
 *   retryBackoffMultiplier: 2
 * });
 *
 * const dlQueue = createQueueConfig(dlqConfig.queueName, {
 *   durable: true,
 *   arguments: {
 *     'x-message-ttl': dlqConfig.retryDelay
 *   }
 * });
 * ```
 */
export declare function createDeadLetterQueueConfig(originalQueueName: string, options?: Partial<DeadLetterQueueConfig>): DeadLetterQueueConfig;
/**
 * Sends message to dead letter queue with failure metadata.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - Failed message
 * @param {string} dlqName - Dead letter queue name
 * @param {string} failureReason - Reason for failure
 * @param {any} channel - RabbitMQ channel
 * @returns {Promise<boolean>} True if sent successfully
 *
 * @example
 * ```typescript
 * @MessagePattern('process.claim')
 * async processClaim(message: JmsMessage<Claim>, context: RmqContext) {
 *   try {
 *     await this.claimsService.process(message.body);
 *   } catch (error) {
 *     if (message.deliveryCount >= 3) {
 *       await sendToDeadLetterQueue(
 *         message,
 *         'claims.processing.dlq',
 *         `Processing failed after 3 attempts: ${error.message}`,
 *         context.getChannelRef()
 *       );
 *     }
 *   }
 * }
 * ```
 */
export declare function sendToDeadLetterQueue<T>(message: JmsMessage<T>, dlqName: string, failureReason: string, channel: any): Promise<boolean>;
/**
 * Retries message from dead letter queue with exponential backoff.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} dlqMessage - Message from DLQ
 * @param {DeadLetterQueueConfig} dlqConfig - DLQ configuration
 * @param {string} originalQueue - Original queue name
 * @param {any} channel - RabbitMQ channel
 * @returns {Promise<boolean>} True if retry scheduled successfully
 *
 * @example
 * ```typescript
 * const dlqConfig = createDeadLetterQueueConfig('orders.processing');
 *
 * @MessagePattern('orders.processing.dlq')
 * async handleDlqMessage(message: JmsMessage) {
 *   if (message.deliveryCount < dlqConfig.maxRetries) {
 *     await retryFromDeadLetterQueue(
 *       message,
 *       dlqConfig,
 *       'orders.processing',
 *       channel
 *     );
 *   } else {
 *     await this.alertService.notify('Max retries exceeded', message);
 *   }
 * }
 * ```
 */
export declare function retryFromDeadLetterQueue<T>(dlqMessage: JmsMessage<T>, dlqConfig: DeadLetterQueueConfig, originalQueue: string, channel: any): Promise<boolean>;
/**
 * Monitors dead letter queue and alerts on threshold.
 *
 * @param {string} dlqName - Dead letter queue name
 * @param {number} threshold - Alert threshold for message count
 * @param {any} channel - RabbitMQ channel
 * @returns {Promise<{ messageCount: number; alertTriggered: boolean }>} Monitoring result
 *
 * @example
 * ```typescript
 * setInterval(async () => {
 *   const result = await monitorDeadLetterQueue('critical.operations.dlq', 10, channel);
 *
 *   if (result.alertTriggered) {
 *     await alertService.send({
 *       severity: 'HIGH',
 *       message: `DLQ has ${result.messageCount} messages (threshold: 10)`,
 *       queue: 'critical.operations.dlq'
 *     });
 *   }
 * }, 60000); // Check every minute
 * ```
 */
export declare function monitorDeadLetterQueue(dlqName: string, threshold: number, channel: any): Promise<{
    messageCount: number;
    alertTriggered: boolean;
}>;
/**
 * Checks if message has expired based on TTL.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @returns {boolean} True if message has expired
 *
 * @example
 * ```typescript
 * @MessagePattern('process.appointment')
 * async handleAppointment(message: JmsMessage<Appointment>) {
 *   if (isMessageExpired(message)) {
 *     console.log('Appointment reminder expired, not sending');
 *     return;
 *   }
 *
 *   await this.notificationService.sendReminder(message.body);
 * }
 * ```
 */
export declare function isMessageExpired<T>(message: JmsMessage<T>): boolean;
/**
 * Gets remaining TTL for message in milliseconds.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @returns {number} Remaining TTL in milliseconds (0 if expired or no TTL)
 *
 * @example
 * ```typescript
 * const message = createJmsMessage({ type: 'session-token' });
 * const withTtl = setMessageTTL(message, 3600000); // 1 hour
 *
 * // Later...
 * const remaining = getRemainingTTL(withTtl);
 * console.log(`Token expires in ${remaining / 1000} seconds`);
 * ```
 */
export declare function getRemainingTTL<T>(message: JmsMessage<T>): number;
/**
 * Extends message TTL by additional time.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @param {number} extensionMs - Additional time in milliseconds
 * @returns {JmsMessage<T>} Message with extended TTL
 *
 * @example
 * ```typescript
 * @MessagePattern('renew.session')
 * async renewSession(message: JmsMessage<SessionData>) {
 *   const extended = extendMessageTTL(message, 1800000); // Add 30 minutes
 *   await this.sessionQueue.send(extended);
 *   return { renewed: true, expiresAt: extended.expiresAt };
 * }
 * ```
 */
export declare function extendMessageTTL<T>(message: JmsMessage<T>, extensionMs: number): JmsMessage<T>;
/**
 * Removes TTL from message (makes it non-expiring).
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @returns {JmsMessage<T>} Message without TTL
 *
 * @example
 * ```typescript
 * const tempMessage = createJmsMessage({ type: 'temporary-data' });
 * const withTtl = setMessageTTL(tempMessage, 60000);
 *
 * // Decide to keep permanently
 * const permanent = removeMessageTTL(withTtl);
 * await permanentQueue.send(permanent);
 * ```
 */
export declare function removeMessageTTL<T>(message: JmsMessage<T>): JmsMessage<T>;
/**
 * Sorts messages by priority (highest first).
 *
 * @template T - Message body type
 * @param {JmsMessage<T>[]} messages - Array of messages
 * @returns {JmsMessage<T>[]} Sorted messages
 *
 * @example
 * ```typescript
 * const messages = await queue.getMessages();
 * const sorted = sortMessagesByPriority(messages);
 *
 * for (const message of sorted) {
 *   await processMessage(message);
 * }
 * ```
 */
export declare function sortMessagesByPriority<T>(messages: JmsMessage<T>[]): JmsMessage<T>[];
/**
 * Schedules message delivery at specific timestamp.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @param {number} timestamp - Unix timestamp for delivery
 * @returns {JmsMessage<T>} Message with scheduled delivery metadata
 *
 * @example
 * ```typescript
 * const reminder = createJmsMessage({
 *   type: 'appointment-reminder',
 *   appointmentId: 'A123',
 *   patientId: 'P456'
 * });
 *
 * const appointmentTime = new Date('2024-03-15T10:00:00Z').getTime();
 * const reminderTime = appointmentTime - (24 * 60 * 60 * 1000); // 24 hours before
 *
 * const scheduled = scheduleMessageDelivery(reminder, reminderTime);
 * await scheduledQueue.send(scheduled);
 * ```
 */
export declare function scheduleMessageDelivery<T>(message: JmsMessage<T>, timestamp: number): JmsMessage<T>;
/**
 * Schedules message delivery after delay.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @param {number} delayMs - Delay in milliseconds
 * @returns {JmsMessage<T>} Message with delay metadata
 *
 * @example
 * ```typescript
 * const notification = createJmsMessage({ type: 'follow-up', patientId: 'P123' });
 * const delayed = scheduleMessageDelay(notification, 7 * 24 * 60 * 60 * 1000); // 7 days
 * await delayedQueue.send(delayed);
 * ```
 */
export declare function scheduleMessageDelay<T>(message: JmsMessage<T>, delayMs: number): JmsMessage<T>;
/**
 * Creates cron-based scheduled message.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - JMS message
 * @param {string} cronExpression - Cron expression for scheduling
 * @returns {JmsMessage<T>} Message with cron schedule metadata
 *
 * @example
 * ```typescript
 * const dailyReport = createJmsMessage({ type: 'daily-census-report' });
 * const cronScheduled = createCronScheduledMessage(
 *   dailyReport,
 *   '0 0 * * *' // Every day at midnight
 * );
 * await cronQueue.send(cronScheduled);
 * ```
 */
export declare function createCronScheduledMessage<T>(message: JmsMessage<T>, cronExpression: string): JmsMessage<T>;
/**
 * Checks if scheduled message is ready for delivery.
 *
 * @template T - Message body type
 * @param {JmsMessage<T>} message - Scheduled message
 * @returns {boolean} True if message should be delivered now
 *
 * @example
 * ```typescript
 * @MessagePattern('scheduled.messages')
 * async handleScheduled(message: JmsMessage) {
 *   if (!isScheduledMessageReady(message)) {
 *     // Requeue for later
 *     const delay = message.properties.scheduledDeliveryTime - Date.now();
 *     await this.requeueWithDelay(message, delay);
 *     return;
 *   }
 *
 *   await this.deliverScheduledMessage(message);
 * }
 * ```
 */
export declare function isScheduledMessageReady<T>(message: JmsMessage<T>): boolean;
/**
 * Creates request message with reply-to queue.
 *
 * @template T - Request body type
 * @param {T} request - Request payload
 * @param {string} replyToQueue - Reply queue name
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {JmsMessage<T>} Request message with reply-to configuration
 *
 * @example
 * ```typescript
 * const request = createRequestMessage(
 *   { operation: 'getPatientVitals', patientId: 'P123' },
 *   'vitals.response.queue',
 *   5000
 * );
 *
 * await requestQueue.send(request);
 * const response = await waitForReply(request.correlationId, 5000);
 * ```
 */
export declare function createRequestMessage<T>(request: T, replyToQueue: string, timeout?: number): JmsMessage<T>;
/**
 * Creates reply message for request-reply pattern.
 *
 * @template T - Reply body type
 * @param {T} reply - Reply payload
 * @param {string} correlationId - Correlation ID from original request
 * @param {boolean} success - Whether request was successful
 * @returns {JmsMessage<T>} Reply message
 *
 * @example
 * ```typescript
 * @MessagePattern('patient.vitals.request')
 * async handleVitalsRequest(request: JmsMessage<VitalsRequest>) {
 *   const vitals = await this.vitalsService.getLatest(request.body.patientId);
 *
 *   const reply = createReplyMessage(
 *     vitals,
 *     request.correlationId!,
 *     true
 *   );
 *
 *   await this.replyQueue.send(request.headers.JMSReplyTo!, reply);
 * }
 * ```
 */
export declare function createReplyMessage<T>(reply: T, correlationId: string, success: boolean): JmsMessage<T>;
/**
 * Validates reply message matches request correlation ID.
 *
 * @template T - Reply body type
 * @param {JmsMessage<T>} reply - Reply message
 * @param {string} expectedCorrelationId - Expected correlation ID
 * @returns {boolean} True if correlation IDs match
 *
 * @example
 * ```typescript
 * const request = createRequestMessage({ query: 'getData' }, 'reply.queue', 5000);
 * await sendRequest(request);
 *
 * const reply = await receiveReply('reply.queue');
 * if (!validateReplyMessage(reply, request.correlationId!)) {
 *   throw new Error('Reply correlation ID mismatch');
 * }
 *
 * return reply.body;
 * ```
 */
export declare function validateReplyMessage<T>(reply: JmsMessage<T>, expectedCorrelationId: string): boolean;
/**
 * Implements request-reply with timeout handling.
 *
 * @template TReq - Request body type
 * @template TRes - Response body type
 * @param {JmsMessage<TReq>} request - Request message
 * @param {(msg: JmsMessage<TReq>) => Promise<void>} sendFn - Function to send request
 * @param {(correlationId: string) => Promise<JmsMessage<TRes>>} receiveFn - Function to receive reply
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<TRes>} Reply payload
 *
 * @example
 * ```typescript
 * const request = createRequestMessage(
 *   { patientId: 'P123', dataType: 'labs' },
 *   'labs.response',
 *   10000
 * );
 *
 * const labResults = await requestReplyWithTimeout(
 *   request,
 *   async (msg) => await labRequestQueue.send(msg),
 *   async (corrId) => await labResponseQueue.receive(corrId),
 *   10000
 * );
 *
 * console.log('Received lab results:', labResults);
 * ```
 */
export declare function requestReplyWithTimeout<TReq, TRes>(request: JmsMessage<TReq>, sendFn: (msg: JmsMessage<TReq>) => Promise<void>, receiveFn: (correlationId: string) => Promise<JmsMessage<TRes>>, timeout: number): Promise<TRes>;
/**
 * Creates temporary reply queue for request-reply pattern.
 *
 * @param {string} prefix - Queue name prefix
 * @param {any} channel - RabbitMQ channel
 * @returns {Promise<string>} Temporary queue name
 *
 * @example
 * ```typescript
 * const replyQueue = await createTemporaryReplyQueue('patient.query.reply', channel);
 *
 * const request = createRequestMessage(
 *   { query: 'getPatient', id: 'P123' },
 *   replyQueue,
 *   5000
 * );
 *
 * await sendRequest(request);
 * const reply = await consumeFromQueue(replyQueue, channel);
 *
 * // Queue auto-deletes when consumer disconnects
 * ```
 */
export declare function createTemporaryReplyQueue(prefix: string, channel: any): Promise<string>;
declare const _default: {
    createJmsMessage: typeof createJmsMessage;
    setMessagePriority: typeof setMessagePriority;
    setMessageTTL: typeof setMessageTTL;
    setCorrelationId: typeof setCorrelationId;
    setReplyTo: typeof setReplyTo;
    markMessageWithPHI: typeof markMessageWithPHI;
    setHealthcareContext: typeof setHealthcareContext;
    cloneMessageForRedelivery: typeof cloneMessageForRedelivery;
    createQueueConfig: typeof createQueueConfig;
    createPriorityQueue: typeof createPriorityQueue;
    createDelayedQueue: typeof createDelayedQueue;
    validateQueueExists: typeof validateQueueExists;
    purgeQueue: typeof purgeQueue;
    bindQueueToExchange: typeof bindQueueToExchange;
    createTopicConfig: typeof createTopicConfig;
    createDurableSubscription: typeof createDurableSubscription;
    createNonDurableSubscription: typeof createNonDurableSubscription;
    publishToTopic: typeof publishToTopic;
    subscribeToTopic: typeof subscribeToTopic;
    unsubscribeFromTopic: typeof unsubscribeFromTopic;
    compileMessageSelector: typeof compileMessageSelector;
    filterMessagesByProperty: typeof filterMessagesByProperty;
    filterMessagesByPriority: typeof filterMessagesByPriority;
    filterMessages: typeof filterMessages;
    filterExpiredMessages: typeof filterExpiredMessages;
    acknowledgeMessage: typeof acknowledgeMessage;
    negativeAcknowledge: typeof negativeAcknowledge;
    batchAcknowledge: typeof batchAcknowledge;
    rejectMessage: typeof rejectMessage;
    autoAcknowledge: typeof autoAcknowledge;
    createDeadLetterQueueConfig: typeof createDeadLetterQueueConfig;
    sendToDeadLetterQueue: typeof sendToDeadLetterQueue;
    retryFromDeadLetterQueue: typeof retryFromDeadLetterQueue;
    monitorDeadLetterQueue: typeof monitorDeadLetterQueue;
    isMessageExpired: typeof isMessageExpired;
    getRemainingTTL: typeof getRemainingTTL;
    extendMessageTTL: typeof extendMessageTTL;
    removeMessageTTL: typeof removeMessageTTL;
    sortMessagesByPriority: typeof sortMessagesByPriority;
    scheduleMessageDelivery: typeof scheduleMessageDelivery;
    scheduleMessageDelay: typeof scheduleMessageDelay;
    createCronScheduledMessage: typeof createCronScheduledMessage;
    isScheduledMessageReady: typeof isScheduledMessageReady;
    createRequestMessage: typeof createRequestMessage;
    createReplyMessage: typeof createReplyMessage;
    validateReplyMessage: typeof validateReplyMessage;
    requestReplyWithTimeout: typeof requestReplyWithTimeout;
    createTemporaryReplyQueue: typeof createTemporaryReplyQueue;
};
export default _default;
//# sourceMappingURL=nestjs-oracle-messaging-kit.d.ts.map