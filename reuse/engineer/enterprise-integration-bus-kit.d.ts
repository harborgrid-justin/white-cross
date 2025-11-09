/**
 * Enterprise Integration Bus Kit
 *
 * Production-ready enterprise service bus with comprehensive features:
 * - Message queue integration (RabbitMQ, Kafka)
 * - Event-driven architecture patterns
 * - Message transformation and routing
 * - Saga pattern for distributed transactions
 * - Message encryption and security
 * - Event sourcing and CQRS
 * - Dead letter queues and retry mechanisms
 * - Integration monitoring and observability
 *
 * @module EnterpriseIntegrationBusKit
 * @security End-to-end message encryption, HIPAA-compliant
 */
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare enum MessagePriority {
    LOW = 0,
    NORMAL = 1,
    HIGH = 2,
    CRITICAL = 3
}
export declare enum MessageStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    DEAD_LETTER = "DEAD_LETTER",
    RETRY = "RETRY"
}
export declare enum SagaStatus {
    STARTED = "STARTED",
    COMPENSATING = "COMPENSATING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    COMPENSATED = "COMPENSATED"
}
export interface Message<T = any> {
    id: string;
    correlationId?: string;
    causationId?: string;
    type: string;
    payload: T;
    metadata: MessageMetadata;
    headers: Record<string, string>;
    timestamp: Date;
    expiration?: Date;
    priority: MessagePriority;
    encrypted?: boolean;
}
export interface MessageMetadata {
    source: string;
    destination?: string;
    userId?: string;
    organizationId?: string;
    traceId?: string;
    spanId?: string;
    retryCount: number;
    maxRetries: number;
    contentType?: string;
}
export interface EventEnvelope<T = any> {
    eventId: string;
    eventType: string;
    aggregateId: string;
    aggregateType: string;
    version: number;
    data: T;
    metadata: EventMetadata;
    timestamp: Date;
}
export interface EventMetadata {
    userId: string;
    correlationId: string;
    causationId?: string;
    ip?: string;
    userAgent?: string;
}
export interface SagaDefinition {
    id: string;
    name: string;
    steps: SagaStep[];
    compensations: Map<string, CompensationHandler>;
    timeout?: number;
}
export interface SagaStep {
    id: string;
    name: string;
    handler: string;
    compensation?: string;
    timeout?: number;
}
export type CompensationHandler = (context: SagaContext) => Promise<void>;
export interface SagaContext {
    sagaId: string;
    data: Record<string, any>;
    completedSteps: string[];
    currentStep?: string;
    status: SagaStatus;
    error?: Error;
    startedAt: Date;
    completedAt?: Date;
}
export interface MessageRoute {
    pattern: string | RegExp;
    destination: string;
    transform?: (message: Message) => Message;
    filter?: (message: Message) => boolean;
}
export interface QueueConfig {
    name: string;
    durable: boolean;
    exclusive: boolean;
    autoDelete: boolean;
    deadLetterExchange?: string;
    deadLetterQueue?: string;
    messageTtl?: number;
    maxLength?: number;
    maxPriority?: number;
}
export interface ExchangeConfig {
    name: string;
    type: 'direct' | 'topic' | 'fanout' | 'headers';
    durable: boolean;
    autoDelete: boolean;
}
export interface RetryPolicy {
    maxAttempts: number;
    backoffMultiplier: number;
    initialDelayMs: number;
    maxDelayMs: number;
    retryableErrors?: string[];
}
export interface CircuitBreakerConfig {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
    resetTimeout: number;
}
export interface CircuitBreakerState {
    status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    successCount: number;
    lastFailureTime?: Date;
    nextRetryTime?: Date;
}
export interface CommandMessage<T = any> {
    commandId: string;
    commandType: string;
    payload: T;
    metadata: MessageMetadata;
    timestamp: Date;
}
export interface QueryMessage<T = any> {
    queryId: string;
    queryType: string;
    parameters: T;
    metadata: MessageMetadata;
    timestamp: Date;
}
export interface IntegrationMetrics {
    totalMessages: number;
    successfulMessages: number;
    failedMessages: number;
    averageProcessingTime: number;
    messagesPerSecond: number;
    deadLetterCount: number;
}
/**
 * Create message with encryption support
 */
export declare function createMessage<T>(type: string, payload: T, metadata: Partial<MessageMetadata>, encryptionKey?: string): Message<T>;
/**
 * Publish message to queue
 */
export declare function publishMessage<T>(message: Message<T>, queueName: string, options?: {
    persistent?: boolean;
    mandatory?: boolean;
    immediate?: boolean;
}): Promise<void>;
/**
 * Subscribe to queue messages
 */
export declare function subscribeToQueue<T>(queueName: string, handler: (message: Message<T>) => Promise<void>, options?: {
    prefetchCount?: number;
    noAck?: boolean;
}): void;
/**
 * Create durable queue with dead letter configuration
 */
export declare function createQueue(config: QueueConfig): void;
/**
 * Create exchange for message routing
 */
export declare function createExchange(config: ExchangeConfig): void;
/**
 * Bind queue to exchange with routing key
 */
export declare function bindQueueToExchange(queueName: string, exchangeName: string, routingKey: string): void;
/**
 * Acknowledge message processing
 */
export declare function acknowledgeMessage(messageId: string): void;
/**
 * Reject message and send to dead letter queue
 */
export declare function rejectMessage(messageId: string, requeue?: boolean): void;
/**
 * Create domain event envelope
 */
export declare function createDomainEvent<T>(eventType: string, aggregateId: string, aggregateType: string, data: T, metadata: EventMetadata, version?: number): EventEnvelope<T>;
/**
 * Publish domain event
 */
export declare function publishDomainEvent<T>(event: EventEnvelope<T>, exchangeName?: string): Promise<void>;
/**
 * Subscribe to domain events by type
 */
export declare function subscribeToEventType<T>(eventType: string, handler: (event: EventEnvelope<T>) => Promise<void>): void;
/**
 * Create event bus for pub/sub pattern
 */
export declare class EventBus {
    private handlers;
    /**
     * Register event handler
     */
    on<T>(eventType: string, handler: (event: EventEnvelope<T>) => Promise<void>): void;
    /**
     * Emit event to all handlers
     */
    emit<T>(event: EventEnvelope<T>): Promise<void>;
    /**
     * Remove event handler
     */
    off(eventType: string, handler: (event: any) => Promise<void>): void;
}
/**
 * Create integration event for cross-boundary communication
 */
export declare function createIntegrationEvent<T>(eventType: string, data: T, metadata: EventMetadata): EventEnvelope<T>;
/**
 * Transform message payload
 */
export declare function transformMessage<TIn, TOut>(message: Message<TIn>, transformer: (payload: TIn) => TOut): Message<TOut>;
/**
 * Route message based on content
 */
export declare function routeMessage(message: Message, routes: MessageRoute[]): string | null;
/**
 * Create message router
 */
export declare class MessageRouter {
    private routes;
    /**
     * Add routing rule
     */
    addRoute(route: MessageRoute): void;
    /**
     * Route and transform message
     */
    route(message: Message): Promise<{
        destination: string;
        message: Message;
    } | null>;
    /**
     * Get all routes
     */
    getRoutes(): MessageRoute[];
}
/**
 * Create content-based router
 */
export declare function createContentBasedRouter(routes: Array<{
    condition: (message: Message) => boolean;
    destination: string;
}>): (message: Message) => string | null;
/**
 * Create message splitter for batch processing
 */
export declare function splitMessage<T>(message: Message<T[]>, chunkSize: number): Message<T>[];
/**
 * Aggregate split messages
 */
export declare class MessageAggregator<T> {
    private messages;
    private completionHandlers;
    /**
     * Add message to aggregation
     */
    add(message: Message<T>, onComplete?: (messages: Message<T>[]) => void): void;
}
/**
 * Create saga definition
 */
export declare function createSagaDefinition(name: string, steps: SagaStep[], compensations: Map<string, CompensationHandler>): SagaDefinition;
/**
 * Execute saga with compensation
 */
export declare function executeSaga(saga: SagaDefinition, initialData: Record<string, any>, stepHandlers: Map<string, (data: Record<string, any>) => Promise<any>>): Promise<SagaContext>;
/**
 * Compensate saga on failure
 */
export declare function compensateSaga(saga: SagaDefinition, context: SagaContext): Promise<void>;
/**
 * Create saga step
 */
export declare function createSagaStep(name: string, handler: string, compensation?: string, timeout?: number): SagaStep;
/**
 * Two-Phase Commit (2PC) coordinator
 */
export declare class TwoPhaseCommitCoordinator {
    private participants;
    private transactionId;
    constructor();
    /**
     * Register participant
     */
    registerParticipant(id: string, participant: TransactionParticipant): void;
    /**
     * Execute distributed transaction
     */
    execute(): Promise<boolean>;
    private preparePhase;
    private commitPhase;
    private abortPhase;
}
export interface TransactionParticipant {
    prepare(transactionId: string): Promise<boolean>;
    commit(transactionId: string): Promise<void>;
    abort(transactionId: string): Promise<void>;
}
/**
 * Outbox pattern for reliable messaging
 */
export interface OutboxMessage {
    id: string;
    aggregateId: string;
    eventType: string;
    payload: any;
    createdAt: Date;
    processedAt?: Date;
    status: 'PENDING' | 'SENT' | 'FAILED';
}
export declare function createOutboxMessage(aggregateId: string, eventType: string, payload: any): OutboxMessage;
/**
 * Process outbox messages
 */
export declare function processOutboxMessages(messages: OutboxMessage[], publisher: (message: OutboxMessage) => Promise<void>): Promise<void>;
/**
 * Retry message with exponential backoff
 */
export declare function retryMessage<T>(message: Message<T>, handler: (message: Message<T>) => Promise<void>, policy: RetryPolicy): Promise<void>;
/**
 * Send message to dead letter queue
 */
export declare function sendToDeadLetterQueue<T>(message: Message<T>, error: Error, deadLetterQueueName?: string): Promise<void>;
/**
 * Retry messages from dead letter queue
 */
export declare function retryFromDeadLetterQueue<T>(dlqMessage: Message<T>, originalQueue: string): Promise<void>;
/**
 * Create circuit breaker for message processing
 */
export declare class MessageCircuitBreaker {
    private state;
    private config;
    constructor(config: CircuitBreakerConfig);
    /**
     * Execute with circuit breaker
     */
    execute<T>(fn: () => Promise<T>): Promise<T>;
    private onSuccess;
    private onFailure;
    private shouldAttemptReset;
    getState(): CircuitBreakerState;
}
/**
 * Event store interface
 */
export interface EventStore {
    append(event: EventEnvelope): Promise<void>;
    getEvents(aggregateId: string): Promise<EventEnvelope[]>;
    getEventsSince(aggregateId: string, version: number): Promise<EventEnvelope[]>;
}
/**
 * In-memory event store implementation
 */
export declare class InMemoryEventStore implements EventStore {
    private events;
    append(event: EventEnvelope): Promise<void>;
    getEvents(aggregateId: string): Promise<EventEnvelope[]>;
    getEventsSince(aggregateId: string, version: number): Promise<EventEnvelope[]>;
}
/**
 * Event sourced aggregate base
 */
export declare abstract class EventSourcedAggregate {
    protected aggregateId: string;
    protected version: number;
    protected uncommittedEvents: EventEnvelope[];
    constructor(aggregateId: string);
    /**
     * Apply event to aggregate
     */
    protected abstract applyEvent(event: EventEnvelope): void;
    /**
     * Raise new event
     */
    protected raiseEvent<T>(eventType: string, data: T, metadata: EventMetadata): void;
    /**
     * Load from event history
     */
    loadFromHistory(events: EventEnvelope[]): void;
    /**
     * Get uncommitted events
     */
    getUncommittedEvents(): EventEnvelope[];
    /**
     * Clear uncommitted events
     */
    clearUncommittedEvents(): void;
}
/**
 * Event sourcing repository
 */
export declare class EventSourcingRepository<T extends EventSourcedAggregate> {
    private eventStore;
    private aggregateFactory;
    constructor(eventStore: EventStore, aggregateFactory: (id: string) => T);
    /**
     * Load aggregate from event store
     */
    load(aggregateId: string): Promise<T>;
    /**
     * Save aggregate to event store
     */
    save(aggregate: T): Promise<void>;
}
/**
 * Command bus for CQRS
 */
export declare class CommandBus {
    private handlers;
    /**
     * Register command handler
     */
    registerHandler(commandType: string, handler: (command: CommandMessage) => Promise<any>): void;
    /**
     * Execute command
     */
    execute<T>(command: CommandMessage<T>): Promise<any>;
}
/**
 * Query bus for CQRS
 */
export declare class QueryBus {
    private handlers;
    /**
     * Register query handler
     */
    registerHandler(queryType: string, handler: (query: QueryMessage) => Promise<any>): void;
    /**
     * Execute query
     */
    execute<T, R>(query: QueryMessage<T>): Promise<R>;
}
/**
 * Create command message
 */
export declare function createCommand<T>(commandType: string, payload: T, metadata: Partial<MessageMetadata>): CommandMessage<T>;
/**
 * Create query message
 */
export declare function createQuery<T>(queryType: string, parameters: T, metadata: Partial<MessageMetadata>): QueryMessage<T>;
/**
 * Encrypt message payload
 */
export declare function encryptPayload<T>(payload: T, key: string): any;
/**
 * Decrypt message payload
 */
export declare function decryptPayload<T>(encryptedPayload: any, key: string): T;
/**
 * Sign message for integrity verification
 */
export declare function signMessage(message: Message, secret: string): string;
/**
 * Verify message signature
 */
export declare function verifyMessageSignature(message: Message, signature: string, secret: string): boolean;
/**
 * Message authentication guard
 */
export declare class MessageAuthGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
/**
 * Calculate integration metrics
 */
export declare function calculateIntegrationMetrics(messages: Array<{
    status: MessageStatus;
    processingTime: number;
}>): IntegrationMetrics;
/**
 * Message processing monitor
 */
export declare class MessageProcessingMonitor {
    private metrics;
    private errors;
    /**
     * Record processing time
     */
    recordProcessingTime(messageType: string, timeMs: number): void;
    /**
     * Record error
     */
    recordError(messageType: string, error: Error): void;
    /**
     * Get metrics for message type
     */
    getMetrics(messageType: string): {
        count: number;
        averageTime: number;
        minTime: number;
        maxTime: number;
        errorCount: number;
    };
    /**
     * Reset metrics
     */
    reset(): void;
}
/**
 * Health check for message queues
 */
export declare function checkQueueHealth(queueName: string): Promise<{
    healthy: boolean;
    messageCount: number;
    consumerCount: number;
}>;
/**
 * Decorator for message encryption
 */
export declare const EncryptMessage: () => any;
/**
 * Decorator for message signing
 */
export declare const SignMessage: () => any;
/**
 * Decorator for message routing
 */
export declare const MessageRoute: (pattern: string | RegExp) => any;
//# sourceMappingURL=enterprise-integration-bus-kit.d.ts.map