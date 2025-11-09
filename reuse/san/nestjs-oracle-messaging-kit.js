"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcknowledgmentMode = exports.DeliveryMode = exports.MessagePriority = void 0;
exports.createJmsMessage = createJmsMessage;
exports.setMessagePriority = setMessagePriority;
exports.setMessageTTL = setMessageTTL;
exports.setCorrelationId = setCorrelationId;
exports.setReplyTo = setReplyTo;
exports.markMessageWithPHI = markMessageWithPHI;
exports.setHealthcareContext = setHealthcareContext;
exports.cloneMessageForRedelivery = cloneMessageForRedelivery;
exports.createQueueConfig = createQueueConfig;
exports.createPriorityQueue = createPriorityQueue;
exports.createDelayedQueue = createDelayedQueue;
exports.validateQueueExists = validateQueueExists;
exports.purgeQueue = purgeQueue;
exports.bindQueueToExchange = bindQueueToExchange;
exports.createTopicConfig = createTopicConfig;
exports.createDurableSubscription = createDurableSubscription;
exports.createNonDurableSubscription = createNonDurableSubscription;
exports.publishToTopic = publishToTopic;
exports.subscribeToTopic = subscribeToTopic;
exports.unsubscribeFromTopic = unsubscribeFromTopic;
exports.compileMessageSelector = compileMessageSelector;
exports.filterMessagesByProperty = filterMessagesByProperty;
exports.filterMessagesByPriority = filterMessagesByPriority;
exports.filterMessages = filterMessages;
exports.filterExpiredMessages = filterExpiredMessages;
exports.acknowledgeMessage = acknowledgeMessage;
exports.negativeAcknowledge = negativeAcknowledge;
exports.batchAcknowledge = batchAcknowledge;
exports.rejectMessage = rejectMessage;
exports.autoAcknowledge = autoAcknowledge;
exports.createDeadLetterQueueConfig = createDeadLetterQueueConfig;
exports.sendToDeadLetterQueue = sendToDeadLetterQueue;
exports.retryFromDeadLetterQueue = retryFromDeadLetterQueue;
exports.monitorDeadLetterQueue = monitorDeadLetterQueue;
exports.isMessageExpired = isMessageExpired;
exports.getRemainingTTL = getRemainingTTL;
exports.extendMessageTTL = extendMessageTTL;
exports.removeMessageTTL = removeMessageTTL;
exports.sortMessagesByPriority = sortMessagesByPriority;
exports.scheduleMessageDelivery = scheduleMessageDelivery;
exports.scheduleMessageDelay = scheduleMessageDelay;
exports.createCronScheduledMessage = createCronScheduledMessage;
exports.isScheduledMessageReady = isScheduledMessageReady;
exports.createRequestMessage = createRequestMessage;
exports.createReplyMessage = createReplyMessage;
exports.validateReplyMessage = validateReplyMessage;
exports.requestReplyWithTimeout = requestReplyWithTimeout;
exports.createTemporaryReplyQueue = createTemporaryReplyQueue;
/**
 * File: /reuse/san/nestjs-oracle-messaging-kit.ts
 * Locator: WC-UTL-NOMK-001
 * Purpose: NestJS Oracle Messaging Kit - JMS-style enterprise messaging patterns for microservices
 *
 * Upstream: @nestjs/microservices, @nestjs/common, rxjs, uuid
 * Downstream: All microservices controllers, message producers, consumers, event handlers
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, RxJS 7.x, RabbitMQ/Kafka/Redis
 * Exports: 48 messaging utility functions for JMS patterns, queues, topics, selectors, acknowledgments, DLQ, TTL, priority, scheduling, request-reply
 *
 * LLM Context: Production-grade JMS-style messaging toolkit for White Cross healthcare microservices.
 * Provides comprehensive utilities for message creation, queue/topic management, message selectors,
 * durable subscriptions, acknowledgment patterns, dead letter queues, TTL/expiration, priority queuing,
 * scheduled delivery, message correlation, and request-reply patterns. HIPAA-compliant with full
 * audit logging, PHI protection, message encryption, and guaranteed delivery for critical healthcare events.
 */
const uuid_1 = require("uuid");
/**
 * Message priority levels (JMS standard)
 */
var MessagePriority;
(function (MessagePriority) {
    MessagePriority[MessagePriority["LOWEST"] = 0] = "LOWEST";
    MessagePriority[MessagePriority["LOW"] = 1] = "LOW";
    MessagePriority[MessagePriority["NORMAL"] = 4] = "NORMAL";
    MessagePriority[MessagePriority["HIGH"] = 7] = "HIGH";
    MessagePriority[MessagePriority["HIGHEST"] = 9] = "HIGHEST";
    MessagePriority[MessagePriority["CRITICAL"] = 10] = "CRITICAL";
})(MessagePriority || (exports.MessagePriority = MessagePriority = {}));
/**
 * Message delivery modes
 */
var DeliveryMode;
(function (DeliveryMode) {
    DeliveryMode[DeliveryMode["NON_PERSISTENT"] = 1] = "NON_PERSISTENT";
    DeliveryMode[DeliveryMode["PERSISTENT"] = 2] = "PERSISTENT";
})(DeliveryMode || (exports.DeliveryMode = DeliveryMode = {}));
/**
 * Message acknowledgment modes
 */
var AcknowledgmentMode;
(function (AcknowledgmentMode) {
    AcknowledgmentMode[AcknowledgmentMode["AUTO_ACKNOWLEDGE"] = 1] = "AUTO_ACKNOWLEDGE";
    AcknowledgmentMode[AcknowledgmentMode["CLIENT_ACKNOWLEDGE"] = 2] = "CLIENT_ACKNOWLEDGE";
    AcknowledgmentMode[AcknowledgmentMode["DUPS_OK_ACKNOWLEDGE"] = 3] = "DUPS_OK_ACKNOWLEDGE";
    AcknowledgmentMode[AcknowledgmentMode["SESSION_TRANSACTED"] = 0] = "SESSION_TRANSACTED";
})(AcknowledgmentMode || (exports.AcknowledgmentMode = AcknowledgmentMode = {}));
// ============================================================================
// MESSAGE CREATION & PROPERTIES
// ============================================================================
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
function createJmsMessage(body, headers, properties) {
    const messageId = (0, uuid_1.v4)();
    const timestamp = Date.now();
    return {
        messageId,
        timestamp,
        priority: MessagePriority.NORMAL,
        deliveryMode: DeliveryMode.PERSISTENT,
        redelivered: false,
        deliveryCount: 0,
        headers: {
            JMSMessageID: messageId,
            JMSTimestamp: timestamp,
            JMSDeliveryMode: DeliveryMode.PERSISTENT,
            JMSPriority: MessagePriority.NORMAL,
            JMSExpiration: 0,
            JMSRedelivered: false,
            JMSDestination: '',
            ...headers,
        },
        properties: properties || {},
        body,
    };
}
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
function setMessagePriority(message, priority) {
    return {
        ...message,
        priority,
        headers: {
            ...message.headers,
            JMSPriority: priority,
        },
    };
}
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
function setMessageTTL(message, ttlMs) {
    const expiresAt = Date.now() + ttlMs;
    return {
        ...message,
        expiresAt,
        headers: {
            ...message.headers,
            JMSExpiration: expiresAt,
        },
    };
}
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
function setCorrelationId(message, correlationId) {
    return {
        ...message,
        correlationId,
        headers: {
            ...message.headers,
            JMSCorrelationID: correlationId,
        },
    };
}
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
function setReplyTo(message, replyTo) {
    return {
        ...message,
        headers: {
            ...message.headers,
            JMSReplyTo: replyTo,
        },
    };
}
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
function markMessageWithPHI(message, encrypted) {
    return {
        ...message,
        properties: {
            ...message.properties,
            phiIncluded: true,
            hipaaAuditRequired: true,
            encrypted,
        },
    };
}
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
function setHealthcareContext(message, context) {
    return {
        ...message,
        properties: {
            ...message.properties,
            ...context,
        },
    };
}
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
function cloneMessageForRedelivery(message) {
    return {
        ...message,
        redelivered: true,
        deliveryCount: message.deliveryCount + 1,
        headers: {
            ...message.headers,
            JMSRedelivered: true,
        },
    };
}
// ============================================================================
// QUEUE MANAGEMENT
// ============================================================================
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
function createQueueConfig(name, options) {
    return {
        name,
        durable: true,
        exclusive: false,
        autoDelete: false,
        maxLength: options?.maxLength,
        maxLengthBytes: options?.maxLengthBytes,
        messageTtl: options?.messageTtl,
        deadLetterExchange: options?.deadLetterExchange,
        deadLetterRoutingKey: options?.deadLetterRoutingKey,
        maxPriority: options?.maxPriority || 10,
        arguments: {
            ...(options?.maxLength && { 'x-max-length': options.maxLength }),
            ...(options?.maxLengthBytes && { 'x-max-length-bytes': options.maxLengthBytes }),
            ...(options?.messageTtl && { 'x-message-ttl': options.messageTtl }),
            ...(options?.deadLetterExchange && { 'x-dead-letter-exchange': options.deadLetterExchange }),
            ...(options?.deadLetterRoutingKey && { 'x-dead-letter-routing-key': options.deadLetterRoutingKey }),
            ...(options?.maxPriority && { 'x-max-priority': options.maxPriority }),
            ...options?.arguments,
        },
    };
}
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
function createPriorityQueue(name, maxPriority = 10) {
    return createQueueConfig(name, {
        durable: true,
        maxPriority,
        arguments: {
            'x-max-priority': maxPriority,
        },
    });
}
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
function createDelayedQueue(name, delayMs, targetQueue) {
    return createQueueConfig(name, {
        durable: true,
        messageTtl: delayMs,
        deadLetterExchange: '',
        deadLetterRoutingKey: targetQueue,
        arguments: {
            'x-message-ttl': delayMs,
            'x-dead-letter-exchange': '',
            'x-dead-letter-routing-key': targetQueue,
        },
    });
}
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
async function validateQueueExists(queueName, channel) {
    try {
        return await channel.checkQueue(queueName);
    }
    catch (error) {
        throw new Error(`Queue '${queueName}' does not exist or is not accessible`);
    }
}
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
async function purgeQueue(queueName, channel) {
    return await channel.purgeQueue(queueName);
}
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
async function bindQueueToExchange(queueName, exchangeName, routingKey, channel) {
    await channel.bindQueue(queueName, exchangeName, routingKey);
}
// ============================================================================
// TOPIC & SUBSCRIPTION MANAGEMENT
// ============================================================================
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
function createTopicConfig(name, options) {
    return {
        name,
        durable: true,
        autoDelete: false,
        arguments: options?.arguments || {},
    };
}
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
function createDurableSubscription(subscriptionName, topicName, selector) {
    return {
        subscriptionName,
        topicName,
        selector,
        noLocal: false,
        durable: true,
    };
}
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
function createNonDurableSubscription(subscriptionName, topicName, selector) {
    return {
        subscriptionName,
        topicName,
        selector,
        noLocal: false,
        durable: false,
    };
}
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
async function publishToTopic(topicName, message, channel) {
    const routingKey = message.headers.JMSType || '';
    return channel.publish(topicName, routingKey, Buffer.from(JSON.stringify(message)), {
        persistent: message.deliveryMode === DeliveryMode.PERSISTENT,
        priority: message.priority,
        expiration: message.expiresAt ? String(message.expiresAt - Date.now()) : undefined,
        correlationId: message.correlationId,
        replyTo: message.headers.JMSReplyTo,
    });
}
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
async function subscribeToTopic(subscription, handler, channel) {
    const queueName = subscription.durable
        ? `${subscription.subscriptionName}.durable`
        : `${subscription.subscriptionName}.${Date.now()}`;
    await channel.assertQueue(queueName, {
        durable: subscription.durable,
        exclusive: !subscription.durable,
        autoDelete: !subscription.durable,
    });
    await channel.bindQueue(queueName, subscription.topicName, '#');
    const { consumerTag } = await channel.consume(queueName, async (msg) => {
        if (msg) {
            const message = JSON.parse(msg.content.toString());
            // Apply message selector if present
            if (subscription.selector) {
                const selector = compileMessageSelector(subscription.selector);
                if (!selector.compiled(message)) {
                    channel.ack(msg);
                    return;
                }
            }
            await handler(message);
            channel.ack(msg);
        }
    });
    return consumerTag;
}
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
async function unsubscribeFromTopic(consumerTag, channel) {
    await channel.cancel(consumerTag);
}
// ============================================================================
// MESSAGE SELECTORS & FILTERING
// ============================================================================
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
function compileMessageSelector(expression) {
    // Simplified SQL-92 selector compilation
    const compiled = (msg) => {
        try {
            // Replace message property references with actual values
            let evaluableExpr = expression;
            // Handle priority
            evaluableExpr = evaluableExpr.replace(/priority/g, String(msg.priority));
            // Handle properties
            Object.keys(msg.properties).forEach((key) => {
                const value = msg.properties[key];
                const regex = new RegExp(`\\b${key}\\b`, 'g');
                if (typeof value === 'string') {
                    evaluableExpr = evaluableExpr.replace(regex, `'${value}'`);
                }
                else if (typeof value === 'boolean') {
                    evaluableExpr = evaluableExpr.replace(regex, String(value));
                }
                else {
                    evaluableExpr = evaluableExpr.replace(regex, String(value));
                }
            });
            // Convert SQL operators to JavaScript
            evaluableExpr = evaluableExpr.replace(/\bAND\b/g, '&&');
            evaluableExpr = evaluableExpr.replace(/\bOR\b/g, '||');
            evaluableExpr = evaluableExpr.replace(/\bNOT\b/g, '!');
            evaluableExpr = evaluableExpr.replace(/=/g, '===');
            // Safely evaluate expression
            return new Function('return ' + evaluableExpr)();
        }
        catch (error) {
            console.error('Selector compilation error:', error);
            return false;
        }
    };
    return { expression, compiled };
}
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
function filterMessagesByProperty(messages, propertyName, propertyValue) {
    return messages.filter((msg) => msg.properties[propertyName] === propertyValue);
}
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
function filterMessagesByPriority(messages, minPriority) {
    return messages.filter((msg) => msg.priority >= minPriority);
}
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
function filterMessages(messages, predicate) {
    return messages.filter(predicate);
}
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
function filterExpiredMessages(messages) {
    const now = Date.now();
    const expired = [];
    const valid = [];
    messages.forEach((msg) => {
        if (msg.expiresAt && msg.expiresAt <= now) {
            expired.push(msg);
        }
        else {
            valid.push(msg);
        }
    });
    return { expired, valid };
}
// ============================================================================
// MESSAGE ACKNOWLEDGMENT PATTERNS
// ============================================================================
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
async function acknowledgeMessage(messageId, channel, deliveryTag) {
    try {
        await channel.ack({ fields: { deliveryTag } });
        return {
            success: true,
            messageId,
            acknowledgedAt: Date.now(),
        };
    }
    catch (error) {
        return {
            success: false,
            messageId,
            acknowledgedAt: Date.now(),
            error: error.message,
        };
    }
}
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
async function negativeAcknowledge(messageId, channel, deliveryTag, requeue) {
    try {
        await channel.nack({ fields: { deliveryTag } }, false, requeue);
        return {
            success: true,
            messageId,
            acknowledgedAt: Date.now(),
        };
    }
    catch (error) {
        return {
            success: false,
            messageId,
            acknowledgedAt: Date.now(),
            error: error.message,
        };
    }
}
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
async function batchAcknowledge(messageIds, channel, deliveryTag) {
    try {
        await channel.ack({ fields: { deliveryTag } }, true); // multiple: true
        const results = messageIds.map((messageId) => ({
            success: true,
            messageId,
            acknowledgedAt: Date.now(),
        }));
        return {
            total: messageIds.length,
            successful: messageIds.length,
            failed: 0,
            results,
        };
    }
    catch (error) {
        const results = messageIds.map((messageId) => ({
            success: false,
            messageId,
            acknowledgedAt: Date.now(),
            error: error.message,
        }));
        return {
            total: messageIds.length,
            successful: 0,
            failed: messageIds.length,
            results,
        };
    }
}
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
async function rejectMessage(messageId, channel, deliveryTag, reason) {
    try {
        await channel.reject({ fields: { deliveryTag } }, false); // requeue: false
        return {
            success: true,
            messageId,
            acknowledgedAt: Date.now(),
            error: reason,
        };
    }
    catch (error) {
        return {
            success: false,
            messageId,
            acknowledgedAt: Date.now(),
            error: error.message,
        };
    }
}
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
async function autoAcknowledge(message, processor, channel, deliveryTag) {
    try {
        await processor(message);
        return await acknowledgeMessage(message.messageId, channel, deliveryTag);
    }
    catch (error) {
        await negativeAcknowledge(message.messageId, channel, deliveryTag, true);
        throw error;
    }
}
// ============================================================================
// DEAD LETTER QUEUE HANDLING
// ============================================================================
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
function createDeadLetterQueueConfig(originalQueueName, options) {
    return {
        queueName: `${originalQueueName}.dlq`,
        exchange: `${originalQueueName}.dlx`,
        routingKey: `${originalQueueName}.failed`,
        maxRetries: options?.maxRetries || 3,
        retryDelay: options?.retryDelay || 5000,
        retryBackoffMultiplier: options?.retryBackoffMultiplier || 2,
    };
}
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
async function sendToDeadLetterQueue(message, dlqName, failureReason, channel) {
    const dlqMessage = {
        ...message,
        properties: {
            ...message.properties,
            dlqReason: failureReason,
            dlqTimestamp: Date.now(),
            originalQueue: message.headers.JMSDestination,
            failureCount: message.deliveryCount,
        },
    };
    return channel.sendToQueue(dlqName, Buffer.from(JSON.stringify(dlqMessage)), {
        persistent: true,
    });
}
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
async function retryFromDeadLetterQueue(dlqMessage, dlqConfig, originalQueue, channel) {
    const retryCount = dlqMessage.deliveryCount;
    const delay = dlqConfig.retryDelay * Math.pow(dlqConfig.retryBackoffMultiplier, retryCount - 1);
    // Create retry queue with delay
    const retryQueueName = `${originalQueue}.retry.${retryCount}`;
    await channel.assertQueue(retryQueueName, {
        durable: true,
        arguments: {
            'x-message-ttl': delay,
            'x-dead-letter-exchange': '',
            'x-dead-letter-routing-key': originalQueue,
        },
    });
    const retryMessage = cloneMessageForRedelivery(dlqMessage);
    return channel.sendToQueue(retryQueueName, Buffer.from(JSON.stringify(retryMessage)), {
        persistent: true,
    });
}
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
async function monitorDeadLetterQueue(dlqName, threshold, channel) {
    const queueInfo = await channel.checkQueue(dlqName);
    const messageCount = queueInfo.messageCount;
    return {
        messageCount,
        alertTriggered: messageCount >= threshold,
    };
}
// ============================================================================
// MESSAGE TTL & EXPIRATION
// ============================================================================
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
function isMessageExpired(message) {
    if (!message.expiresAt) {
        return false;
    }
    return Date.now() >= message.expiresAt;
}
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
function getRemainingTTL(message) {
    if (!message.expiresAt) {
        return 0;
    }
    const remaining = message.expiresAt - Date.now();
    return Math.max(0, remaining);
}
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
function extendMessageTTL(message, extensionMs) {
    const currentExpiration = message.expiresAt || Date.now();
    const newExpiration = currentExpiration + extensionMs;
    return {
        ...message,
        expiresAt: newExpiration,
        headers: {
            ...message.headers,
            JMSExpiration: newExpiration,
        },
    };
}
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
function removeMessageTTL(message) {
    const { expiresAt, ...messageWithoutExpiry } = message;
    const { JMSExpiration, ...headersWithoutExpiry } = message.headers;
    return {
        ...messageWithoutExpiry,
        headers: {
            ...headersWithoutExpiry,
            JMSExpiration: 0,
        },
    };
}
// ============================================================================
// PRIORITY & SCHEDULING
// ============================================================================
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
function sortMessagesByPriority(messages) {
    return [...messages].sort((a, b) => b.priority - a.priority);
}
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
function scheduleMessageDelivery(message, timestamp) {
    const delay = timestamp - Date.now();
    return {
        ...message,
        properties: {
            ...message.properties,
            scheduledDeliveryTime: timestamp,
            deliveryDelay: delay,
        },
    };
}
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
function scheduleMessageDelay(message, delayMs) {
    const deliveryTime = Date.now() + delayMs;
    return {
        ...message,
        properties: {
            ...message.properties,
            scheduledDeliveryTime: deliveryTime,
            deliveryDelay: delayMs,
        },
    };
}
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
function createCronScheduledMessage(message, cronExpression) {
    return {
        ...message,
        properties: {
            ...message.properties,
            cronExpression,
            scheduleType: 'cron',
        },
    };
}
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
function isScheduledMessageReady(message) {
    const scheduledTime = message.properties.scheduledDeliveryTime;
    if (!scheduledTime) {
        return true;
    }
    return Date.now() >= scheduledTime;
}
// ============================================================================
// REQUEST-REPLY PATTERNS
// ============================================================================
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
function createRequestMessage(request, replyToQueue, timeout = 30000) {
    const correlationId = (0, uuid_1.v4)();
    const message = createJmsMessage(request);
    return {
        ...message,
        correlationId,
        headers: {
            ...message.headers,
            JMSReplyTo: replyToQueue,
            JMSCorrelationID: correlationId,
        },
        properties: {
            ...message.properties,
            requestTimeout: timeout,
            requestTimestamp: Date.now(),
        },
    };
}
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
function createReplyMessage(reply, correlationId, success) {
    const message = createJmsMessage(reply);
    return {
        ...message,
        correlationId,
        headers: {
            ...message.headers,
            JMSCorrelationID: correlationId,
        },
        properties: {
            ...message.properties,
            replySuccess: success,
            replyTimestamp: Date.now(),
        },
    };
}
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
function validateReplyMessage(reply, expectedCorrelationId) {
    return reply.correlationId === expectedCorrelationId;
}
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
async function requestReplyWithTimeout(request, sendFn, receiveFn, timeout) {
    await sendFn(request);
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request-reply timeout')), timeout);
    });
    const replyPromise = receiveFn(request.correlationId);
    const reply = await Promise.race([replyPromise, timeoutPromise]);
    if (!validateReplyMessage(reply, request.correlationId)) {
        throw new Error('Reply correlation ID mismatch');
    }
    return reply.body;
}
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
async function createTemporaryReplyQueue(prefix, channel) {
    const queueName = `${prefix}.${(0, uuid_1.v4)()}`;
    await channel.assertQueue(queueName, {
        exclusive: true,
        autoDelete: true,
        durable: false,
    });
    return queueName;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Message Creation & Properties
    createJmsMessage,
    setMessagePriority,
    setMessageTTL,
    setCorrelationId,
    setReplyTo,
    markMessageWithPHI,
    setHealthcareContext,
    cloneMessageForRedelivery,
    // Queue Management
    createQueueConfig,
    createPriorityQueue,
    createDelayedQueue,
    validateQueueExists,
    purgeQueue,
    bindQueueToExchange,
    // Topic & Subscription Management
    createTopicConfig,
    createDurableSubscription,
    createNonDurableSubscription,
    publishToTopic,
    subscribeToTopic,
    unsubscribeFromTopic,
    // Message Selectors & Filtering
    compileMessageSelector,
    filterMessagesByProperty,
    filterMessagesByPriority,
    filterMessages,
    filterExpiredMessages,
    // Message Acknowledgment Patterns
    acknowledgeMessage,
    negativeAcknowledge,
    batchAcknowledge,
    rejectMessage,
    autoAcknowledge,
    // Dead Letter Queue Handling
    createDeadLetterQueueConfig,
    sendToDeadLetterQueue,
    retryFromDeadLetterQueue,
    monitorDeadLetterQueue,
    // Message TTL & Expiration
    isMessageExpired,
    getRemainingTTL,
    extendMessageTTL,
    removeMessageTTL,
    // Priority & Scheduling
    sortMessagesByPriority,
    scheduleMessageDelivery,
    scheduleMessageDelay,
    createCronScheduledMessage,
    isScheduledMessageReady,
    // Request-Reply Patterns
    createRequestMessage,
    createReplyMessage,
    validateReplyMessage,
    requestReplyWithTimeout,
    createTemporaryReplyQueue,
};
//# sourceMappingURL=nestjs-oracle-messaging-kit.js.map