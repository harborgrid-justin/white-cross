/**
 * LOC: WMC-001
 * File: /reuse/server/workflow/workflow-message-correlation.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common
 *   - @nestjs/event-emitter
 *   - zod (v3.x)
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Workflow message services
 *   - Message queue handlers
 *   - Event correlation systems
 *   - Process communication modules
 *   - Saga coordinators
 */
import { Model, Sequelize, Transaction, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, BelongsToGetAssociationMixin } from 'sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
/**
 * Zod schema for correlation key validation.
 */
export declare const CorrelationKeySchema: any;
/**
 * Zod schema for message definition.
 */
export declare const MessageDefinitionSchema: any;
/**
 * Zod schema for message subscription.
 */
export declare const MessageSubscriptionSchema: any;
/**
 * Zod schema for correlation set.
 */
export declare const CorrelationSetSchema: any;
/**
 * Zod schema for message matching rules.
 */
export declare const MessageMatchingRuleSchema: any;
/**
 * Correlation key interface
 */
export interface CorrelationKey {
    workflowId: string;
    processId: string;
    correlationId: string;
    businessKey?: string;
    tenantId?: string;
    namespace?: string;
    metadata?: Record<string, any>;
}
/**
 * Message definition interface
 */
export interface MessageDefinition {
    id: string;
    correlationKey: CorrelationKey;
    messageType: string;
    payload: Record<string, any>;
    priority: number;
    ttl?: number;
    expiresAt?: Date;
    deliveryMode: 'at-least-once' | 'at-most-once' | 'exactly-once';
    sequence?: number;
    retryCount: number;
    maxRetries: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    deliveredAt?: Date;
}
/**
 * Message subscription interface
 */
export interface MessageSubscription {
    id: string;
    subscriberId: string;
    messageType: string;
    correlationPattern?: string;
    filter?: Record<string, any>;
    callback?: string;
    active: boolean;
    priority: number;
    createdAt: Date;
    lastMatchedAt?: Date;
}
/**
 * Correlation set interface
 */
export interface CorrelationSet {
    id: string;
    correlationKey: CorrelationKey;
    messageCount: number;
    expectedMessages?: string[];
    receivedMessages: string[];
    status: 'pending' | 'partial' | 'complete' | 'expired';
    completedAt?: Date;
    expiresAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Message matching rule interface
 */
export interface MessageMatchingRule {
    id: string;
    name: string;
    messageType: string;
    conditions: Array<{
        field: string;
        operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notIn' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
        value: any;
    }>;
    priority: number;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Message queue options
 */
export interface MessageQueueOptions {
    maxSize?: number;
    ttl?: number;
    fifo?: boolean;
    deduplicate?: boolean;
    persistToDisk?: boolean;
}
/**
 * Message delivery options
 */
export interface MessageDeliveryOptions {
    mode: 'at-least-once' | 'at-most-once' | 'exactly-once';
    timeout?: number;
    retries?: number;
    backoff?: 'linear' | 'exponential';
    acknowledgmentRequired?: boolean;
}
/**
 * Message buffer configuration
 */
export interface MessageBufferConfig {
    size: number;
    flushInterval?: number;
    flushOnSize?: boolean;
    flushOnTimer?: boolean;
    persistOnFlush?: boolean;
}
/**
 * Correlation message model attributes
 */
export interface CorrelationMessageAttributes {
    id: string;
    correlationId: string;
    messageType: string;
    payload: object;
    priority: number;
    deliveryMode: string;
    status: string;
    sequence: number;
    retryCount: number;
    maxRetries: number;
    expiresAt?: Date;
    deliveredAt?: Date;
    acknowledgedAt?: Date;
    errorMessage?: string;
    metadata?: object;
    tenantId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
/**
 * Message subscription model attributes
 */
export interface MessageSubscriptionAttributes {
    id: string;
    subscriberId: string;
    messageType: string;
    correlationPattern?: string;
    filterCriteria?: object;
    callbackUrl?: string;
    active: boolean;
    priority: number;
    matchCount: number;
    lastMatchedAt?: Date;
    metadata?: object;
    tenantId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
/**
 * Correlation set model attributes
 */
export interface CorrelationSetAttributes {
    id: string;
    correlationKey: string;
    workflowId: string;
    processId: string;
    messageCount: number;
    expectedMessages?: string[];
    receivedMessages: string[];
    status: string;
    completedAt?: Date;
    expiresAt?: Date;
    metadata?: object;
    tenantId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
/**
 * Message matching rule model attributes
 */
export interface MessageMatchingRuleAttributes {
    id: string;
    name: string;
    messageType: string;
    conditions: object;
    priority: number;
    enabled: boolean;
    matchCount: number;
    lastMatchedAt?: Date;
    metadata?: object;
    tenantId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
/**
 * CorrelationMessage model for storing correlated messages
 */
export declare class CorrelationMessage extends Model<CorrelationMessageAttributes> implements CorrelationMessageAttributes {
    id: string;
    correlationId: string;
    messageType: string;
    payload: object;
    priority: number;
    deliveryMode: string;
    status: string;
    sequence: number;
    retryCount: number;
    maxRetries: number;
    expiresAt?: Date;
    deliveredAt?: Date;
    acknowledgedAt?: Date;
    errorMessage?: string;
    metadata?: object;
    tenantId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;
    getCorrelationSet: BelongsToGetAssociationMixin<CorrelationSet>;
    static associations: {
        correlationSet: Association<CorrelationMessage, CorrelationSet>;
    };
}
/**
 * MessageSubscription model for managing subscriptions
 */
export declare class MessageSubscriptionModel extends Model<MessageSubscriptionAttributes> implements MessageSubscriptionAttributes {
    id: string;
    subscriberId: string;
    messageType: string;
    correlationPattern?: string;
    filterCriteria?: object;
    callbackUrl?: string;
    active: boolean;
    priority: number;
    matchCount: number;
    lastMatchedAt?: Date;
    metadata?: object;
    tenantId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;
}
/**
 * CorrelationSet model for managing correlation sets
 */
export declare class CorrelationSetModel extends Model<CorrelationSetAttributes> implements CorrelationSetAttributes {
    id: string;
    correlationKey: string;
    workflowId: string;
    processId: string;
    messageCount: number;
    expectedMessages?: string[];
    receivedMessages: string[];
    status: string;
    completedAt?: Date;
    expiresAt?: Date;
    metadata?: object;
    tenantId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;
    getMessages: HasManyGetAssociationsMixin<CorrelationMessage>;
    addMessage: HasManyAddAssociationMixin<CorrelationMessage, string>;
    countMessages: HasManyCountAssociationsMixin;
    static associations: {
        messages: Association<CorrelationSetModel, CorrelationMessage>;
    };
}
/**
 * MessageMatchingRule model for defining matching rules
 */
export declare class MessageMatchingRuleModel extends Model<MessageMatchingRuleAttributes> implements MessageMatchingRuleAttributes {
    id: string;
    name: string;
    messageType: string;
    conditions: object;
    priority: number;
    enabled: boolean;
    matchCount: number;
    lastMatchedAt?: Date;
    metadata?: object;
    tenantId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;
}
/**
 * Initializes the CorrelationMessage model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for message correlation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof CorrelationMessage} Initialized model
 *
 * @example
 * ```typescript
 * const CorrelationMessageModel = initCorrelationMessageModel(sequelize);
 * const message = await CorrelationMessageModel.create({
 *   correlationId: 'abc-123',
 *   messageType: 'PAYMENT_PROCESSED',
 *   payload: { amount: 100 }
 * });
 * ```
 */
export declare function initCorrelationMessageModel(sequelize: Sequelize): typeof CorrelationMessage;
/**
 * Initializes the MessageSubscription model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for subscription management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof MessageSubscriptionModel} Initialized model
 *
 * @example
 * ```typescript
 * const MessageSubscription = initMessageSubscriptionModel(sequelize);
 * const subscription = await MessageSubscription.create({
 *   subscriberId: 'user-123',
 *   messageType: 'PAYMENT_PROCESSED'
 * });
 * ```
 */
export declare function initMessageSubscriptionModel(sequelize: Sequelize): typeof MessageSubscriptionModel;
/**
 * Initializes the CorrelationSet model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for correlation set management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof CorrelationSetModel} Initialized model
 *
 * @example
 * ```typescript
 * const CorrelationSet = initCorrelationSetModel(sequelize);
 * const set = await CorrelationSet.create({
 *   correlationKey: 'order-123',
 *   workflowId: 'wf-456'
 * });
 * ```
 */
export declare function initCorrelationSetModel(sequelize: Sequelize): typeof CorrelationSetModel;
/**
 * Initializes the MessageMatchingRule model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for rule management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof MessageMatchingRuleModel} Initialized model
 *
 * @example
 * ```typescript
 * const MatchingRule = initMessageMatchingRuleModel(sequelize);
 * const rule = await MatchingRule.create({
 *   name: 'High Priority Payments',
 *   messageType: 'PAYMENT',
 *   conditions: [{ field: 'amount', operator: 'gt', value: 1000 }]
 * });
 * ```
 */
export declare function initMessageMatchingRuleModel(sequelize: Sequelize): typeof MessageMatchingRuleModel;
/**
 * Sets up associations between correlation models.
 * Defines relationships for message correlation and set management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 *
 * @example
 * ```typescript
 * setupCorrelationAssociations(sequelize);
 * ```
 */
export declare function setupCorrelationAssociations(sequelize: Sequelize): void;
/**
 * Generates a unique correlation key from workflow and process identifiers.
 * Creates a deterministic or random correlation key based on parameters.
 *
 * @param {CorrelationKey} params - Correlation key parameters
 * @returns {string} Generated correlation key
 *
 * @example
 * ```typescript
 * const key = generateCorrelationKey({
 *   workflowId: 'wf-123',
 *   processId: 'proc-456',
 *   correlationId: randomUUID()
 * });
 * ```
 */
export declare function generateCorrelationKey(params: CorrelationKey): string;
/**
 * Parses a correlation key string into its component parts.
 * Extracts workflow, process, and correlation identifiers.
 *
 * @param {string} correlationKey - Correlation key string
 * @returns {Partial<CorrelationKey>} Parsed correlation key components
 *
 * @example
 * ```typescript
 * const parsed = parseCorrelationKey('default:wf-123:proc-456:corr-789');
 * // Returns: { namespace: 'default', workflowId: 'wf-123', processId: 'proc-456', correlationId: 'corr-789' }
 * ```
 */
export declare function parseCorrelationKey(correlationKey: string): Partial<CorrelationKey>;
/**
 * Validates a correlation key structure and format.
 * Ensures all required components are present and valid.
 *
 * @param {CorrelationKey} correlationKey - Correlation key to validate
 * @returns {boolean} Whether the correlation key is valid
 *
 * @example
 * ```typescript
 * const isValid = validateCorrelationKey({
 *   workflowId: 'wf-123',
 *   processId: 'proc-456',
 *   correlationId: 'corr-789'
 * });
 * ```
 */
export declare function validateCorrelationKey(correlationKey: CorrelationKey): boolean;
/**
 * Creates a hash-based correlation key for deterministic correlation.
 * Generates consistent key from business data for idempotency.
 *
 * @param {Record<string, any>} businessData - Business data to hash
 * @param {string} namespace - Optional namespace
 * @returns {string} Hash-based correlation key
 *
 * @example
 * ```typescript
 * const key = createHashedCorrelationKey(
 *   { orderId: '123', customerId: '456' },
 *   'orders'
 * );
 * ```
 */
export declare function createHashedCorrelationKey(businessData: Record<string, any>, namespace?: string): string;
/**
 * Extracts correlation metadata from a correlation key.
 * Returns associated metadata for correlation tracking.
 *
 * @param {string} correlationKey - Correlation key
 * @param {typeof CorrelationSetModel} model - CorrelationSet model
 * @returns {Promise<Record<string, any> | null>} Correlation metadata
 *
 * @example
 * ```typescript
 * const metadata = await getCorrelationMetadata('default:wf-123:proc-456', CorrelationSet);
 * ```
 */
export declare function getCorrelationMetadata(correlationKey: string, model: typeof CorrelationSetModel): Promise<Record<string, any> | null>;
/**
 * Creates a message subscription for a specific message type.
 * Registers a subscriber to receive matching messages.
 *
 * @param {typeof MessageSubscriptionModel} model - MessageSubscription model
 * @param {string} subscriberId - Subscriber identifier
 * @param {string} messageType - Message type to subscribe to
 * @param {Partial<MessageSubscriptionAttributes>} options - Additional subscription options
 * @returns {Promise<MessageSubscriptionModel>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await createMessageSubscription(
 *   MessageSubscription,
 *   'user-123',
 *   'PAYMENT_PROCESSED',
 *   { priority: 8, callbackUrl: 'https://api.example.com/webhook' }
 * );
 * ```
 */
export declare function createMessageSubscription(model: typeof MessageSubscriptionModel, subscriberId: string, messageType: string, options?: Partial<MessageSubscriptionAttributes>): Promise<MessageSubscriptionModel>;
/**
 * Finds active subscriptions matching a message type.
 * Returns all active subscriptions for message routing.
 *
 * @param {typeof MessageSubscriptionModel} model - MessageSubscription model
 * @param {string} messageType - Message type to match
 * @param {string} [tenantId] - Optional tenant filter
 * @returns {Promise<MessageSubscriptionModel[]>} Matching subscriptions
 *
 * @example
 * ```typescript
 * const subscriptions = await findMessageSubscriptions(
 *   MessageSubscription,
 *   'PAYMENT_PROCESSED'
 * );
 * ```
 */
export declare function findMessageSubscriptions(model: typeof MessageSubscriptionModel, messageType: string, tenantId?: string): Promise<MessageSubscriptionModel[]>;
/**
 * Updates subscription match statistics.
 * Increments match count and updates last matched timestamp.
 *
 * @param {MessageSubscriptionModel} subscription - Subscription instance
 * @returns {Promise<MessageSubscriptionModel>} Updated subscription
 *
 * @example
 * ```typescript
 * await updateSubscriptionMatchStats(subscription);
 * ```
 */
export declare function updateSubscriptionMatchStats(subscription: MessageSubscriptionModel): Promise<MessageSubscriptionModel>;
/**
 * Activates or deactivates a message subscription.
 * Toggles subscription active status.
 *
 * @param {MessageSubscriptionModel} subscription - Subscription instance
 * @param {boolean} active - Active status
 * @returns {Promise<MessageSubscriptionModel>} Updated subscription
 *
 * @example
 * ```typescript
 * await toggleSubscriptionStatus(subscription, false);
 * ```
 */
export declare function toggleSubscriptionStatus(subscription: MessageSubscriptionModel, active: boolean): Promise<MessageSubscriptionModel>;
/**
 * Removes expired or inactive subscriptions.
 * Cleans up old subscriptions based on criteria.
 *
 * @param {typeof MessageSubscriptionModel} model - MessageSubscription model
 * @param {number} inactiveDays - Days of inactivity before removal
 * @returns {Promise<number>} Number of removed subscriptions
 *
 * @example
 * ```typescript
 * const removed = await cleanupSubscriptions(MessageSubscription, 90);
 * ```
 */
export declare function cleanupSubscriptions(model: typeof MessageSubscriptionModel, inactiveDays?: number): Promise<number>;
/**
 * Evaluates a message against matching conditions.
 * Determines if a message satisfies all conditions.
 *
 * @param {Record<string, any>} message - Message to evaluate
 * @param {MessageMatchingRule['conditions']} conditions - Conditions to check
 * @returns {boolean} Whether message matches conditions
 *
 * @example
 * ```typescript
 * const matches = evaluateMessageConditions(
 *   { amount: 1500, currency: 'USD' },
 *   [{ field: 'amount', operator: 'gt', value: 1000 }]
 * );
 * ```
 */
export declare function evaluateMessageConditions(message: Record<string, any>, conditions: MessageMatchingRule['conditions']): boolean;
/**
 * Finds matching rules for a message.
 * Returns all enabled rules that match the message.
 *
 * @param {typeof MessageMatchingRuleModel} model - MessageMatchingRule model
 * @param {string} messageType - Message type
 * @param {Record<string, any>} payload - Message payload
 * @returns {Promise<MessageMatchingRuleModel[]>} Matching rules
 *
 * @example
 * ```typescript
 * const rules = await findMatchingRules(
 *   MatchingRule,
 *   'PAYMENT',
 *   { amount: 1500 }
 * );
 * ```
 */
export declare function findMatchingRules(model: typeof MessageMatchingRuleModel, messageType: string, payload: Record<string, any>): Promise<MessageMatchingRuleModel[]>;
/**
 * Matches a message to subscriptions based on filters.
 * Returns subscriptions that match message criteria.
 *
 * @param {typeof MessageSubscriptionModel} model - MessageSubscription model
 * @param {CorrelationMessage} message - Message to match
 * @returns {Promise<MessageSubscriptionModel[]>} Matching subscriptions
 *
 * @example
 * ```typescript
 * const subscriptions = await matchMessageToSubscriptions(MessageSubscription, message);
 * ```
 */
export declare function matchMessageToSubscriptions(model: typeof MessageSubscriptionModel, message: CorrelationMessage): Promise<MessageSubscriptionModel[]>;
/**
 * Performs priority-based message routing.
 * Routes message to highest priority matching subscription.
 *
 * @param {MessageSubscriptionModel[]} subscriptions - Available subscriptions
 * @param {CorrelationMessage} message - Message to route
 * @returns {MessageSubscriptionModel | null} Selected subscription
 *
 * @example
 * ```typescript
 * const target = priorityBasedRouting(subscriptions, message);
 * ```
 */
export declare function priorityBasedRouting(subscriptions: MessageSubscriptionModel[], message: CorrelationMessage): MessageSubscriptionModel | null;
/**
 * Implements round-robin message routing.
 * Distributes messages evenly across subscriptions.
 *
 * @param {MessageSubscriptionModel[]} subscriptions - Available subscriptions
 * @param {number} currentIndex - Current round-robin index
 * @returns {{ subscription: MessageSubscriptionModel | null; nextIndex: number }} Selected subscription and next index
 *
 * @example
 * ```typescript
 * const { subscription, nextIndex } = roundRobinRouting(subscriptions, 0);
 * ```
 */
export declare function roundRobinRouting(subscriptions: MessageSubscriptionModel[], currentIndex: number): {
    subscription: MessageSubscriptionModel | null;
    nextIndex: number;
};
/**
 * Enqueues a message for delivery.
 * Adds message to delivery queue with proper ordering.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {Partial<CorrelationMessageAttributes>} messageData - Message data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CorrelationMessage>} Enqueued message
 *
 * @example
 * ```typescript
 * const message = await enqueueMessage(CorrelationMessage, {
 *   correlationId: 'abc-123',
 *   messageType: 'PAYMENT',
 *   payload: { amount: 100 }
 * });
 * ```
 */
export declare function enqueueMessage(model: typeof CorrelationMessage, messageData: Partial<CorrelationMessageAttributes>, transaction?: Transaction): Promise<CorrelationMessage>;
/**
 * Dequeues messages for processing.
 * Retrieves pending messages for delivery.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {number} limit - Maximum number of messages to dequeue
 * @param {string} [tenantId] - Optional tenant filter
 * @returns {Promise<CorrelationMessage[]>} Dequeued messages
 *
 * @example
 * ```typescript
 * const messages = await dequeueMessages(CorrelationMessage, 10);
 * ```
 */
export declare function dequeueMessages(model: typeof CorrelationMessage, limit?: number, tenantId?: string): Promise<CorrelationMessage[]>;
/**
 * Peeks at queued messages without removing them.
 * Views pending messages without changing status.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {number} limit - Maximum number of messages to peek
 * @returns {Promise<CorrelationMessage[]>} Peeked messages
 *
 * @example
 * ```typescript
 * const messages = await peekMessages(CorrelationMessage, 5);
 * ```
 */
export declare function peekMessages(model: typeof CorrelationMessage, limit?: number): Promise<CorrelationMessage[]>;
/**
 * Gets the current queue depth.
 * Returns number of pending messages.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {string} [correlationId] - Optional correlation filter
 * @returns {Promise<number>} Queue depth
 *
 * @example
 * ```typescript
 * const depth = await getQueueDepth(CorrelationMessage);
 * ```
 */
export declare function getQueueDepth(model: typeof CorrelationMessage, correlationId?: string): Promise<number>;
/**
 * Purges expired messages from the queue.
 * Removes messages past their expiration time.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @returns {Promise<number>} Number of purged messages
 *
 * @example
 * ```typescript
 * const purged = await purgeExpiredMessages(CorrelationMessage);
 * ```
 */
export declare function purgeExpiredMessages(model: typeof CorrelationMessage): Promise<number>;
/**
 * Buffers messages for batch processing.
 * Collects messages until buffer size or time threshold met.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {string} correlationId - Correlation identifier
 * @param {number} bufferSize - Buffer size threshold
 * @returns {Promise<CorrelationMessage[]>} Buffered messages
 *
 * @example
 * ```typescript
 * const buffered = await bufferMessages(CorrelationMessage, 'abc-123', 50);
 * ```
 */
export declare function bufferMessages(model: typeof CorrelationMessage, correlationId: string, bufferSize: number): Promise<CorrelationMessage[]>;
/**
 * Flushes buffered messages for processing.
 * Marks buffered messages as processing.
 *
 * @param {CorrelationMessage[]} messages - Buffered messages
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await flushMessageBuffer(bufferedMessages);
 * ```
 */
export declare function flushMessageBuffer(messages: CorrelationMessage[]): Promise<void>;
/**
 * Gets buffer statistics for a correlation.
 * Returns buffer size and age information.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {string} correlationId - Correlation identifier
 * @returns {Promise<{ size: number; oldestMessage: Date | null; newestMessage: Date | null }>} Buffer stats
 *
 * @example
 * ```typescript
 * const stats = await getBufferStats(CorrelationMessage, 'abc-123');
 * ```
 */
export declare function getBufferStats(model: typeof CorrelationMessage, correlationId: string): Promise<{
    size: number;
    oldestMessage: Date | null;
    newestMessage: Date | null;
}>;
/**
 * Implements at-least-once delivery semantics.
 * Ensures message is delivered at least once with retries.
 *
 * @param {CorrelationMessage} message - Message to deliver
 * @param {() => Promise<boolean>} deliveryFn - Delivery function
 * @returns {Promise<boolean>} Whether delivery succeeded
 *
 * @example
 * ```typescript
 * const delivered = await deliverAtLeastOnce(message, async () => {
 *   return await sendToWebhook(message.payload);
 * });
 * ```
 */
export declare function deliverAtLeastOnce(message: CorrelationMessage, deliveryFn: () => Promise<boolean>): Promise<boolean>;
/**
 * Implements at-most-once delivery semantics.
 * Attempts delivery once without retries.
 *
 * @param {CorrelationMessage} message - Message to deliver
 * @param {() => Promise<boolean>} deliveryFn - Delivery function
 * @returns {Promise<boolean>} Whether delivery succeeded
 *
 * @example
 * ```typescript
 * const delivered = await deliverAtMostOnce(message, async () => {
 *   return await sendToQueue(message.payload);
 * });
 * ```
 */
export declare function deliverAtMostOnce(message: CorrelationMessage, deliveryFn: () => Promise<boolean>): Promise<boolean>;
/**
 * Implements exactly-once delivery semantics.
 * Ensures message is delivered exactly once using idempotency.
 *
 * @param {CorrelationMessage} message - Message to deliver
 * @param {() => Promise<boolean>} deliveryFn - Delivery function
 * @param {(messageId: string) => Promise<boolean>} checkDeliveredFn - Check if already delivered
 * @returns {Promise<boolean>} Whether delivery succeeded
 *
 * @example
 * ```typescript
 * const delivered = await deliverExactlyOnce(
 *   message,
 *   async () => sendToQueue(message.payload),
 *   async (id) => checkDeliveryLog(id)
 * );
 * ```
 */
export declare function deliverExactlyOnce(message: CorrelationMessage, deliveryFn: () => Promise<boolean>, checkDeliveredFn: (messageId: string) => Promise<boolean>): Promise<boolean>;
/**
 * Acknowledges message delivery.
 * Marks message as acknowledged after successful processing.
 *
 * @param {CorrelationMessage} message - Message to acknowledge
 * @returns {Promise<CorrelationMessage>} Acknowledged message
 *
 * @example
 * ```typescript
 * await acknowledgeMessage(message);
 * ```
 */
export declare function acknowledgeMessage(message: CorrelationMessage): Promise<CorrelationMessage>;
/**
 * Negatively acknowledges message delivery (NACK).
 * Requeues message for retry after failure.
 *
 * @param {CorrelationMessage} message - Message to NACK
 * @param {string} [reason] - Reason for NACK
 * @returns {Promise<CorrelationMessage>} Updated message
 *
 * @example
 * ```typescript
 * await negativeAcknowledgeMessage(message, 'Temporary service unavailable');
 * ```
 */
export declare function negativeAcknowledgeMessage(message: CorrelationMessage, reason?: string): Promise<CorrelationMessage>;
/**
 * Detects duplicate messages based on content hash.
 * Identifies messages with identical payloads.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {Record<string, any>} payload - Message payload
 * @param {string} correlationId - Correlation identifier
 * @returns {Promise<CorrelationMessage | null>} Duplicate message if found
 *
 * @example
 * ```typescript
 * const duplicate = await detectDuplicateMessage(
 *   CorrelationMessage,
 *   { orderId: '123' },
 *   'abc-123'
 * );
 * ```
 */
export declare function detectDuplicateMessage(model: typeof CorrelationMessage, payload: Record<string, any>, correlationId: string): Promise<CorrelationMessage | null>;
/**
 * Deduplicates messages in a correlation set.
 * Removes duplicate messages based on content.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {string} correlationId - Correlation identifier
 * @returns {Promise<number>} Number of duplicates removed
 *
 * @example
 * ```typescript
 * const removed = await deduplicateMessages(CorrelationMessage, 'abc-123');
 * ```
 */
export declare function deduplicateMessages(model: typeof CorrelationMessage, correlationId: string): Promise<number>;
/**
 * Creates a new correlation set.
 * Initializes a correlation set for message grouping.
 *
 * @param {typeof CorrelationSetModel} model - CorrelationSet model
 * @param {Partial<CorrelationSetAttributes>} setData - Correlation set data
 * @returns {Promise<CorrelationSetModel>} Created correlation set
 *
 * @example
 * ```typescript
 * const set = await createCorrelationSet(CorrelationSet, {
 *   correlationKey: 'order-123',
 *   workflowId: 'wf-456',
 *   processId: 'proc-789',
 *   expectedMessages: ['PAYMENT', 'SHIPPING', 'NOTIFICATION']
 * });
 * ```
 */
export declare function createCorrelationSet(model: typeof CorrelationSetModel, setData: Partial<CorrelationSetAttributes>): Promise<CorrelationSetModel>;
/**
 * Adds a message to a correlation set.
 * Tracks message reception in the set.
 *
 * @param {CorrelationSetModel} set - Correlation set
 * @param {string} messageType - Message type
 * @returns {Promise<CorrelationSetModel>} Updated set
 *
 * @example
 * ```typescript
 * await addMessageToSet(set, 'PAYMENT');
 * ```
 */
export declare function addMessageToSet(set: CorrelationSetModel, messageType: string): Promise<CorrelationSetModel>;
/**
 * Checks if a correlation set is complete.
 * Verifies all expected messages have been received.
 *
 * @param {CorrelationSetModel} set - Correlation set
 * @returns {boolean} Whether set is complete
 *
 * @example
 * ```typescript
 * if (isCorrelationSetComplete(set)) {
 *   // Process complete set
 * }
 * ```
 */
export declare function isCorrelationSetComplete(set: CorrelationSetModel): boolean;
/**
 * Expires a correlation set.
 * Marks set as expired if timeout reached.
 *
 * @param {CorrelationSetModel} set - Correlation set
 * @returns {Promise<CorrelationSetModel>} Updated set
 *
 * @example
 * ```typescript
 * await expireCorrelationSet(set);
 * ```
 */
export declare function expireCorrelationSet(set: CorrelationSetModel): Promise<CorrelationSetModel>;
/**
 * Cleans up completed or expired correlation sets.
 * Removes old correlation sets based on age.
 *
 * @param {typeof CorrelationSetModel} model - CorrelationSet model
 * @param {number} retentionDays - Days to retain completed sets
 * @returns {Promise<number>} Number of cleaned up sets
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupCorrelationSets(CorrelationSet, 30);
 * ```
 */
export declare function cleanupCorrelationSets(model: typeof CorrelationSetModel, retentionDays?: number): Promise<number>;
/**
 * Triggers an event when a message is received.
 * Emits event for message reception.
 *
 * @param {EventEmitter2} eventEmitter - Event emitter instance
 * @param {CorrelationMessage} message - Received message
 *
 * @example
 * ```typescript
 * triggerMessageReceivedEvent(eventEmitter, message);
 * ```
 */
export declare function triggerMessageReceivedEvent(eventEmitter: EventEmitter2, message: CorrelationMessage): void;
/**
 * Triggers an event when correlation set completes.
 * Emits event for correlation completion.
 *
 * @param {EventEmitter2} eventEmitter - Event emitter instance
 * @param {CorrelationSetModel} set - Completed correlation set
 *
 * @example
 * ```typescript
 * triggerCorrelationCompleteEvent(eventEmitter, set);
 * ```
 */
export declare function triggerCorrelationCompleteEvent(eventEmitter: EventEmitter2, set: CorrelationSetModel): void;
/**
 * Triggers an event when message delivery fails.
 * Emits event for delivery failure.
 *
 * @param {EventEmitter2} eventEmitter - Event emitter instance
 * @param {CorrelationMessage} message - Failed message
 * @param {Error} error - Failure error
 *
 * @example
 * ```typescript
 * triggerMessageFailedEvent(eventEmitter, message, error);
 * ```
 */
export declare function triggerMessageFailedEvent(eventEmitter: EventEmitter2, message: CorrelationMessage, error: Error): void;
/**
 * Sets up event listeners for message correlation events.
 * Registers handlers for correlation lifecycle events.
 *
 * @param {EventEmitter2} eventEmitter - Event emitter instance
 * @param {Record<string, (...args: any[]) => void>} handlers - Event handlers
 *
 * @example
 * ```typescript
 * setupMessageEventListeners(eventEmitter, {
 *   'message.received': (data) => console.log('Message received:', data),
 *   'correlation.complete': (data) => console.log('Correlation complete:', data)
 * });
 * ```
 */
export declare function setupMessageEventListeners(eventEmitter: EventEmitter2, handlers: Record<string, (...args: any[]) => void>): void;
//# sourceMappingURL=workflow-message-correlation.d.ts.map