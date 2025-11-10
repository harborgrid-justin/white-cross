/**
 * LOC: MSMSGKIT001
 * File: /reuse/microservices-messaging-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/microservices
 *   - @nestjs/common
 *   - rxjs
 *   - crypto (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - Microservices modules
 *   - Message handlers and controllers
 *   - Event-driven services
 *   - Backend microservices infrastructure
 */

/**
 * File: /reuse/microservices-messaging-kit.ts
 * Locator: WC-UTL-MSMSGKIT-001
 * Purpose: Comprehensive NestJS Microservices Messaging Utilities Kit - Production-ready microservices and message queue utilities
 *
 * Upstream: Independent utility module for NestJS microservices messaging operations
 * Downstream: ../backend/*, Microservices modules, Message handlers, Event services, Queue processors
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/microservices, RabbitMQ, Kafka, NATS, Redis, RxJS
 * Exports: 45+ utility functions for microservices messaging, queue management, resilience patterns, saga orchestration
 *
 * LLM Context: Enterprise-grade microservices messaging utilities for White Cross healthcare platform.
 * Provides comprehensive RabbitMQ message handlers with DLQ support, Kafka producer/consumer utilities with
 * partition management, NATS client helpers with JetStream, Redis pub/sub with pattern matching, message
 * pattern builders for request-response and event-driven architectures, serialization/deserialization with
 * schema validation, dead letter queue handlers with retry logic, exponential backoff retry mechanisms,
 * circuit breaker patterns for resilience, service discovery helpers, message routing with priority queues,
 * consumer group coordination, saga pattern orchestrators for distributed transactions, message idempotency
 * guards for exactly-once processing, and comprehensive health checks for HIPAA-compliant microservices.
 */

import { Observable, Subject, throwError, of, timer, firstValueFrom } from 'rxjs';
import { retry, catchError, timeout, map, switchMap, tap, delay } from 'rxjs/operators';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Message pattern for request-response communication
 */
export interface MessagePattern {
  cmd: string;
  version?: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

/**
 * Event pattern for event-driven communication
 */
export interface EventPattern {
  event: string;
  aggregateId?: string;
  aggregateType?: string;
  version?: number;
  timestamp: Date;
  causationId?: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

/**
 * RabbitMQ configuration
 */
export interface RabbitMQConfig {
  urls: string[];
  queue: string;
  exchange?: string;
  routingKey?: string;
  queueOptions?: {
    durable?: boolean;
    exclusive?: boolean;
    autoDelete?: boolean;
    arguments?: Record<string, any>;
  };
  exchangeOptions?: {
    type?: 'direct' | 'topic' | 'fanout' | 'headers';
    durable?: boolean;
    autoDelete?: boolean;
  };
  prefetchCount?: number;
  noAck?: boolean;
  persistent?: boolean;
  heartbeat?: number;
  connectionTimeout?: number;
}

/**
 * Kafka configuration
 */
export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  groupId: string;
  ssl?: boolean;
  sasl?: {
    mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
    username: string;
    password: string;
  };
  retry?: {
    initialRetryTime: number;
    retries: number;
    maxRetryTime?: number;
    multiplier?: number;
  };
  connectionTimeout?: number;
  requestTimeout?: number;
}

/**
 * Kafka topic configuration
 */
export interface KafkaTopicConfig {
  topic: string;
  numPartitions?: number;
  replicationFactor?: number;
  retentionMs?: number;
  compressionType?: 'none' | 'gzip' | 'snappy' | 'lz4' | 'zstd';
  cleanupPolicy?: 'delete' | 'compact' | 'compact,delete';
  minInsyncReplicas?: number;
}

/**
 * NATS configuration
 */
export interface NatsConfig {
  servers: string[];
  user?: string;
  pass?: string;
  token?: string;
  maxReconnectAttempts?: number;
  reconnectTimeWait?: number;
  queue?: string;
  noRandomize?: boolean;
  timeout?: number;
  pingInterval?: number;
  maxPingOut?: number;
}

/**
 * Redis pub/sub configuration
 */
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  retryStrategy?: (times: number) => number;
  enableReadyCheck?: boolean;
  maxRetriesPerRequest?: number;
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
  ttl?: number;
  errorHandler?: (error: any, message: any) => void;
}

/**
 * Retry policy configuration
 */
export interface RetryPolicy {
  maxAttempts: number;
  backoffType: 'fixed' | 'exponential' | 'linear' | 'jitter';
  initialDelay: number;
  maxDelay?: number;
  multiplier?: number;
  jitterFactor?: number;
  shouldRetry?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeout: number;
  monitoringPeriod?: number;
  halfOpenRequests?: number;
}

/**
 * Circuit breaker state
 */
export interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  successCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
  consecutiveSuccesses?: number;
  consecutiveFailures?: number;
}

/**
 * Message validation rule
 */
export interface MessageValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'uuid' | 'email' | 'phone';
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  enum?: any[];
  custom?: (value: any) => boolean | Promise<boolean>;
  customMessage?: string;
}

/**
 * Service registration for discovery
 */
export interface ServiceRegistration {
  serviceId: string;
  serviceName: string;
  version: string;
  host: string;
  port: number;
  protocol: 'tcp' | 'http' | 'https' | 'grpc' | 'nats' | 'rabbitmq' | 'kafka' | 'redis';
  healthCheckUrl?: string;
  healthCheckInterval?: number;
  metadata?: Record<string, any>;
  tags?: string[];
  weight?: number;
}

/**
 * Health check status
 */
export interface HealthCheckStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  checks: Record<string, ComponentHealth>;
  version?: string;
  serviceId?: string;
}

/**
 * Component health details
 */
export interface ComponentHealth {
  status: 'pass' | 'fail' | 'warn';
  componentType: string;
  componentId?: string;
  observedValue?: any;
  observedUnit?: string;
  time?: string;
  output?: string;
  affectedEndpoints?: string[];
}

/**
 * Saga step definition
 */
export interface SagaStep<T = any> {
  stepId: string;
  stepName: string;
  action: (context: SagaContext) => Promise<T>;
  compensation: (context: SagaContext, result?: T) => Promise<void>;
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

/**
 * Saga context for orchestration
 */
export interface SagaContext {
  sagaId: string;
  currentStep: number;
  completedSteps: string[];
  stepResults: Record<string, any>;
  data: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'compensating' | 'compensated' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  error?: any;
}

/**
 * Message metadata for tracing
 */
export interface MessageMetadata {
  messageId: string;
  correlationId: string;
  causationId?: string;
  timestamp: Date;
  traceId?: string;
  spanId?: string;
  userId?: string;
  tenantId?: string;
  source?: string;
  destination?: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  ttl?: number;
  retryCount?: number;
  maxRetries?: number;
}

/**
 * Idempotency record
 */
export interface IdempotencyRecord {
  messageId: string;
  processedAt: Date;
  expiresAt: Date;
  result?: any;
  status: 'processing' | 'completed' | 'failed';
}

/**
 * Message envelope wrapper
 */
export interface MessageEnvelope<T = any> {
  metadata: MessageMetadata;
  payload: T;
  headers?: Record<string, string>;
}

/**
 * Consumer group configuration
 */
export interface ConsumerGroupConfig {
  groupId: string;
  topics: string[];
  autoCommit?: boolean;
  commitInterval?: number;
  sessionTimeout?: number;
  heartbeatInterval?: number;
  maxPollRecords?: number;
  maxPollInterval?: number;
}

/**
 * Message routing rule
 */
export interface MessageRoutingRule {
  pattern: string | RegExp;
  destination: string;
  priority?: number;
  condition?: (message: any) => boolean;
  transform?: (message: any) => any;
}

/**
 * Priority queue message
 */
export interface PriorityQueueMessage<T = any> {
  priority: number;
  payload: T;
  timestamp: Date;
  messageId: string;
}

/**
 * Distributed transaction context
 */
export interface DistributedTransactionContext {
  transactionId: string;
  participants: string[];
  status: 'prepared' | 'committed' | 'aborted';
  timeout: number;
  startedAt: Date;
  preparedParticipants: string[];
  committedParticipants: string[];
}

// ============================================================================
// SECTION 1: MESSAGE PATTERN BUILDERS (Functions 1-5)
// ============================================================================

/**
 * 1. Creates a typed message pattern for request-response communication.
 *
 * @param {string} cmd - Command name
 * @param {string} [version] - API version
 * @param {'low' | 'normal' | 'high' | 'critical'} [priority] - Message priority
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {MessagePattern} Message pattern object
 *
 * @example
 * ```typescript
 * const pattern = createMessagePattern('get_patient', 'v1', 'high', {
 *   source: 'api-gateway',
 *   requiresAuth: true
 * });
 * // Result: { cmd: 'get_patient', version: 'v1', priority: 'high', metadata: {...} }
 * ```
 */
export function createMessagePattern(
  cmd: string,
  version?: string,
  priority?: 'low' | 'normal' | 'high' | 'critical',
  metadata?: Record<string, any>,
): MessagePattern {
  return {
    cmd,
    ...(version && { version }),
    priority: priority || 'normal',
    ...(metadata && { metadata }),
  };
}

/**
 * 2. Creates a typed event pattern for event-driven communication.
 *
 * @param {string} event - Event name
 * @param {string} [aggregateId] - Aggregate identifier
 * @param {string} [aggregateType] - Aggregate type
 * @param {number} [version] - Event version
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {EventPattern} Event pattern object
 *
 * @example
 * ```typescript
 * const pattern = createEventPattern(
 *   'patient.created',
 *   'patient-123',
 *   'Patient',
 *   1,
 *   { facility: 'White Cross General' }
 * );
 * ```
 */
export function createEventPattern(
  event: string,
  aggregateId?: string,
  aggregateType?: string,
  version?: number,
  metadata?: Record<string, any>,
): EventPattern {
  return {
    event,
    ...(aggregateId && { aggregateId }),
    ...(aggregateType && { aggregateType }),
    ...(version && { version }),
    timestamp: new Date(),
    correlationId: generateCorrelationId(),
    ...(metadata && { metadata }),
  };
}

/**
 * 3. Wraps message payload with comprehensive metadata envelope.
 *
 * @param {T} payload - Message payload
 * @param {Partial<MessageMetadata>} [metadata] - Optional metadata overrides
 * @returns {MessageEnvelope<T>} Wrapped message with metadata
 *
 * @example
 * ```typescript
 * const envelope = wrapMessageWithMetadata(
 *   { patientId: '123', diagnosis: 'Hypertension' },
 *   { priority: 'high', userId: 'doctor-456' }
 * );
 * // Includes messageId, correlationId, timestamp, etc.
 * ```
 */
export function wrapMessageWithMetadata<T = any>(
  payload: T,
  metadata?: Partial<MessageMetadata>,
): MessageEnvelope<T> {
  const messageId = metadata?.messageId || generateMessageId();
  const correlationId = metadata?.correlationId || generateCorrelationId();

  return {
    metadata: {
      messageId,
      correlationId,
      causationId: metadata?.causationId,
      timestamp: new Date(),
      traceId: metadata?.traceId || generateTraceId(),
      spanId: metadata?.spanId || generateSpanId(),
      userId: metadata?.userId,
      tenantId: metadata?.tenantId,
      source: metadata?.source,
      destination: metadata?.destination,
      priority: metadata?.priority || 'normal',
      ttl: metadata?.ttl,
      retryCount: metadata?.retryCount || 0,
      maxRetries: metadata?.maxRetries || 3,
    },
    payload,
    headers: {},
  };
}

/**
 * 4. Extracts payload and metadata from message envelope.
 *
 * @param {MessageEnvelope<T>} envelope - Message envelope
 * @returns {{ payload: T; metadata: MessageMetadata }} Extracted data
 *
 * @example
 * ```typescript
 * const { payload, metadata } = unwrapMessageEnvelope(envelope);
 * console.log(`Processing message ${metadata.messageId}`);
 * console.log(`Patient ID: ${payload.patientId}`);
 * ```
 */
export function unwrapMessageEnvelope<T = any>(
  envelope: MessageEnvelope<T>,
): { payload: T; metadata: MessageMetadata } {
  return {
    payload: envelope.payload,
    metadata: envelope.metadata,
  };
}

/**
 * 5. Generates unique correlation ID for distributed tracing.
 *
 * @param {string} [prefix='corr'] - Prefix for correlation ID
 * @returns {string} Correlation ID
 *
 * @example
 * ```typescript
 * const correlationId = generateCorrelationId('patient');
 * // Result: 'patient_20231108_a1b2c3d4e5f6'
 * ```
 */
export function generateCorrelationId(prefix: string = 'corr'): string {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
  const random = crypto.randomBytes(8).toString('hex');
  return `${prefix}_${timestamp}_${random}`;
}

// ============================================================================
// SECTION 2: RABBITMQ MESSAGE HANDLERS (Functions 6-10)
// ============================================================================

/**
 * 6. Creates comprehensive RabbitMQ configuration with best practices.
 *
 * @param {string} queue - Queue name
 * @param {string[]} urls - RabbitMQ server URLs
 * @param {Partial<RabbitMQConfig>} [options] - Additional configuration options
 * @returns {RabbitMQConfig} Complete RabbitMQ configuration
 *
 * @example
 * ```typescript
 * const config = createRabbitMQConfig('patient-queue', ['amqp://localhost:5672'], {
 *   exchange: 'healthcare-events',
 *   routingKey: 'patient.*',
 *   prefetchCount: 10,
 *   queueOptions: { durable: true, arguments: { 'x-max-priority': 10 } }
 * });
 * ```
 */
export function createRabbitMQConfig(
  queue: string,
  urls: string[],
  options?: Partial<RabbitMQConfig>,
): RabbitMQConfig {
  return {
    urls,
    queue,
    exchange: options?.exchange,
    routingKey: options?.routingKey,
    queueOptions: {
      durable: true,
      exclusive: false,
      autoDelete: false,
      arguments: {
        'x-message-ttl': 86400000, // 24 hours
        'x-max-length': 100000,
        ...options?.queueOptions?.arguments,
      },
      ...options?.queueOptions,
    },
    exchangeOptions: {
      type: 'topic',
      durable: true,
      autoDelete: false,
      ...options?.exchangeOptions,
    },
    prefetchCount: options?.prefetchCount || 10,
    noAck: options?.noAck || false,
    persistent: options?.persistent !== false,
    heartbeat: options?.heartbeat || 60,
    connectionTimeout: options?.connectionTimeout || 30000,
  };
}

/**
 * 7. Creates dead letter queue configuration for failed message handling.
 *
 * @param {string} originalQueue - Original queue name
 * @param {number} [maxRetries=3] - Maximum retry attempts
 * @param {number} [retryDelay=5000] - Retry delay in milliseconds
 * @param {(error: any, message: any) => void} [errorHandler] - Custom error handler
 * @returns {DeadLetterQueueConfig} Dead letter queue configuration
 *
 * @example
 * ```typescript
 * const dlqConfig = createDeadLetterQueue('patient-queue', 3, 5000, (error, msg) => {
 *   console.error('Message failed after retries:', error);
 *   // Send alert to monitoring system
 * });
 * ```
 */
export function createDeadLetterQueue(
  originalQueue: string,
  maxRetries: number = 3,
  retryDelay: number = 5000,
  errorHandler?: (error: any, message: any) => void,
): DeadLetterQueueConfig {
  return {
    queueName: `${originalQueue}.dlq`,
    exchange: `${originalQueue}.dlx`,
    routingKey: `${originalQueue}.dlx.key`,
    maxRetries,
    retryDelay,
    ttl: retryDelay * maxRetries * 2,
    errorHandler,
  };
}

/**
 * 8. Acknowledges RabbitMQ message with error handling and logging.
 *
 * @param {any} channel - RabbitMQ channel
 * @param {any} message - RabbitMQ message
 * @param {boolean} [multiple=false] - Acknowledge multiple messages
 * @returns {boolean} True if acknowledgment succeeded
 *
 * @example
 * ```typescript
 * @MessagePattern('process_patient')
 * async handleMessage(@Payload() data: any, @Ctx() context: RmqContext) {
 *   const channel = context.getChannelRef();
 *   const originalMsg = context.getMessage();
 *
 *   try {
 *     await this.processPatient(data);
 *     acknowledgeRabbitMQMessage(channel, originalMsg);
 *   } catch (error) {
 *     rejectRabbitMQMessage(channel, originalMsg, false);
 *   }
 * }
 * ```
 */
export function acknowledgeRabbitMQMessage(
  channel: any,
  message: any,
  multiple: boolean = false,
): boolean {
  try {
    if (!channel || !message) {
      console.error('Invalid channel or message for acknowledgment');
      return false;
    }
    channel.ack(message, multiple);
    return true;
  } catch (error) {
    console.error('Failed to acknowledge RabbitMQ message:', error);
    return false;
  }
}

/**
 * 9. Rejects RabbitMQ message with optional requeue and DLQ routing.
 *
 * @param {any} channel - RabbitMQ channel
 * @param {any} message - RabbitMQ message
 * @param {boolean} [requeue=false] - Whether to requeue message
 * @param {string} [reason] - Rejection reason for logging
 * @returns {boolean} True if rejection succeeded
 *
 * @example
 * ```typescript
 * if (!isValidPatientData(data)) {
 *   rejectRabbitMQMessage(channel, originalMsg, false, 'Invalid patient data format');
 *   return;
 * }
 * ```
 */
export function rejectRabbitMQMessage(
  channel: any,
  message: any,
  requeue: boolean = false,
  reason?: string,
): boolean {
  try {
    if (!channel || !message) {
      console.error('Invalid channel or message for rejection');
      return false;
    }

    if (reason) {
      console.warn(`Rejecting RabbitMQ message: ${reason}`, {
        messageId: message.properties?.messageId,
        correlationId: message.properties?.correlationId,
        requeue,
      });
    }

    channel.nack(message, false, requeue);
    return true;
  } catch (error) {
    console.error('Failed to reject RabbitMQ message:', error);
    return false;
  }
}

/**
 * 10. Publishes message to RabbitMQ exchange with routing.
 *
 * @param {any} channel - RabbitMQ channel
 * @param {string} exchange - Exchange name
 * @param {string} routingKey - Routing key
 * @param {any} message - Message payload
 * @param {Record<string, any>} [options] - Publish options
 * @returns {boolean} True if publish succeeded
 *
 * @example
 * ```typescript
 * publishToRabbitMQ(
 *   channel,
 *   'healthcare-events',
 *   'patient.created',
 *   { patientId: '123', name: 'John Doe' },
 *   { persistent: true, priority: 5 }
 * );
 * ```
 */
export function publishToRabbitMQ(
  channel: any,
  exchange: string,
  routingKey: string,
  message: any,
  options?: Record<string, any>,
): boolean {
  try {
    const messageBuffer = Buffer.from(JSON.stringify(message));
    const publishOptions = {
      persistent: true,
      messageId: generateMessageId(),
      timestamp: Date.now(),
      ...options,
    };

    return channel.publish(exchange, routingKey, messageBuffer, publishOptions);
  } catch (error) {
    console.error('Failed to publish to RabbitMQ:', error);
    return false;
  }
}

// ============================================================================
// SECTION 3: KAFKA PRODUCER/CONSUMER UTILITIES (Functions 11-15)
// ============================================================================

/**
 * 11. Creates comprehensive Kafka configuration with security and retry settings.
 *
 * @param {string} clientId - Kafka client ID
 * @param {string[]} brokers - Kafka broker URLs
 * @param {string} groupId - Consumer group ID
 * @param {Partial<KafkaConfig>} [options] - Additional options
 * @returns {KafkaConfig} Complete Kafka configuration
 *
 * @example
 * ```typescript
 * const config = createKafkaConfig(
 *   'healthcare-service',
 *   ['localhost:9092', 'localhost:9093'],
 *   'patient-consumers',
 *   {
 *     ssl: true,
 *     sasl: { mechanism: 'scram-sha-256', username: 'user', password: 'pass' },
 *     retry: { initialRetryTime: 100, retries: 8 }
 *   }
 * );
 * ```
 */
export function createKafkaConfig(
  clientId: string,
  brokers: string[],
  groupId: string,
  options?: Partial<KafkaConfig>,
): KafkaConfig {
  return {
    clientId,
    brokers,
    groupId,
    ssl: options?.ssl || false,
    sasl: options?.sasl,
    retry: {
      initialRetryTime: 100,
      retries: 8,
      maxRetryTime: 30000,
      multiplier: 2,
      ...options?.retry,
    },
    connectionTimeout: options?.connectionTimeout || 30000,
    requestTimeout: options?.requestTimeout || 30000,
  };
}

/**
 * 12. Creates Kafka topic configuration with partitioning and retention.
 *
 * @param {string} topic - Topic name
 * @param {number} [numPartitions=3] - Number of partitions
 * @param {number} [replicationFactor=2] - Replication factor
 * @param {Partial<KafkaTopicConfig>} [options] - Additional topic options
 * @returns {KafkaTopicConfig} Topic configuration
 *
 * @example
 * ```typescript
 * const topicConfig = createKafkaTopic('patient-events', 5, 3, {
 *   retentionMs: 604800000, // 7 days
 *   compressionType: 'snappy',
 *   cleanupPolicy: 'delete',
 *   minInsyncReplicas: 2
 * });
 * ```
 */
export function createKafkaTopic(
  topic: string,
  numPartitions: number = 3,
  replicationFactor: number = 2,
  options?: Partial<KafkaTopicConfig>,
): KafkaTopicConfig {
  return {
    topic,
    numPartitions,
    replicationFactor,
    retentionMs: options?.retentionMs || 604800000, // 7 days default
    compressionType: options?.compressionType || 'snappy',
    cleanupPolicy: options?.cleanupPolicy || 'delete',
    minInsyncReplicas: options?.minInsyncReplicas || Math.max(1, replicationFactor - 1),
  };
}

/**
 * 13. Serializes message for Kafka with headers and key.
 *
 * @param {any} data - Message data
 * @param {string} [key] - Partition key
 * @param {Record<string, string>} [headers] - Message headers
 * @returns {{ key?: string; value: string; headers?: Record<string, string> }} Serialized message
 *
 * @example
 * ```typescript
 * const kafkaMessage = serializeKafkaMessage(
 *   { patientId: '123', event: 'created' },
 *   '123', // Partition by patient ID
 *   { 'content-type': 'application/json', 'schema-version': 'v1' }
 * );
 * ```
 */
export function serializeKafkaMessage(
  data: any,
  key?: string,
  headers?: Record<string, string>,
): { key?: string; value: string; headers?: Record<string, string> } {
  return {
    ...(key && { key }),
    value: JSON.stringify(data),
    ...(headers && { headers }),
  };
}

/**
 * 14. Deserializes Kafka message with error handling and validation.
 *
 * @param {any} message - Kafka message
 * @returns {{ data: any; key: string | null; headers: Record<string, any> | null; error?: string }} Deserialized data
 *
 * @example
 * ```typescript
 * const { data, key, headers, error } = deserializeKafkaMessage(kafkaMessage);
 * if (error) {
 *   console.error('Deserialization failed:', error);
 *   return;
 * }
 * console.log(`Processing patient ${key}:`, data);
 * ```
 */
export function deserializeKafkaMessage(
  message: any,
): { data: any; key: string | null; headers: Record<string, any> | null; error?: string } {
  try {
    const data = JSON.parse(message.value.toString());
    const key = message.key ? message.key.toString() : null;
    const headers = message.headers || null;

    return { data, key, headers };
  } catch (error) {
    return {
      data: null,
      key: null,
      headers: null,
      error: `Failed to deserialize Kafka message: ${(error as Error).message}`,
    };
  }
}

/**
 * 15. Creates Kafka consumer group configuration with offset management.
 *
 * @param {string} groupId - Consumer group ID
 * @param {string[]} topics - Topics to subscribe to
 * @param {Partial<ConsumerGroupConfig>} [options] - Additional options
 * @returns {ConsumerGroupConfig} Consumer group configuration
 *
 * @example
 * ```typescript
 * const consumerConfig = createKafkaConsumerGroup(
 *   'patient-processors',
 *   ['patient-events', 'appointment-events'],
 *   { autoCommit: false, maxPollRecords: 100, sessionTimeout: 30000 }
 * );
 * ```
 */
export function createKafkaConsumerGroup(
  groupId: string,
  topics: string[],
  options?: Partial<ConsumerGroupConfig>,
): ConsumerGroupConfig {
  return {
    groupId,
    topics,
    autoCommit: options?.autoCommit !== false,
    commitInterval: options?.commitInterval || 5000,
    sessionTimeout: options?.sessionTimeout || 30000,
    heartbeatInterval: options?.heartbeatInterval || 3000,
    maxPollRecords: options?.maxPollRecords || 500,
    maxPollInterval: options?.maxPollInterval || 300000,
  };
}

// ============================================================================
// SECTION 4: NATS CLIENT HELPERS (Functions 16-20)
// ============================================================================

/**
 * 16. Creates NATS configuration with authentication and reconnection strategy.
 *
 * @param {string[]} servers - NATS server URLs
 * @param {Partial<NatsConfig>} [options] - Additional options
 * @returns {NatsConfig} NATS configuration
 *
 * @example
 * ```typescript
 * const config = createNatsConfig(['nats://localhost:4222', 'nats://localhost:4223'], {
 *   user: 'healthcare-service',
 *   pass: 'secret',
 *   maxReconnectAttempts: 10,
 *   reconnectTimeWait: 2000
 * });
 * ```
 */
export function createNatsConfig(
  servers: string[],
  options?: Partial<NatsConfig>,
): NatsConfig {
  return {
    servers,
    user: options?.user,
    pass: options?.pass,
    token: options?.token,
    maxReconnectAttempts: options?.maxReconnectAttempts || 10,
    reconnectTimeWait: options?.reconnectTimeWait || 2000,
    queue: options?.queue,
    noRandomize: options?.noRandomize || false,
    timeout: options?.timeout || 30000,
    pingInterval: options?.pingInterval || 120000,
    maxPingOut: options?.maxPingOut || 2,
  };
}

/**
 * 17. Creates NATS subject with hierarchical naming convention.
 *
 * @param {string} domain - Domain name (e.g., 'healthcare')
 * @param {string} entity - Entity name (e.g., 'patient')
 * @param {string} action - Action name (e.g., 'created')
 * @param {string} [environment='prod'] - Environment
 * @returns {string} NATS subject
 *
 * @example
 * ```typescript
 * const subject = createNatsSubject('healthcare', 'patient', 'created', 'prod');
 * // Result: 'healthcare.prod.patient.created'
 *
 * // With wildcard for subscribing to all patient events:
 * const wildcardSubject = createNatsSubject('healthcare', 'patient', '*', 'prod');
 * ```
 */
export function createNatsSubject(
  domain: string,
  entity: string,
  action: string,
  environment: string = 'prod',
): string {
  return `${domain}.${environment}.${entity}.${action}`;
}

/**
 * 18. Creates NATS queue group for load-balanced processing.
 *
 * @param {string} serviceName - Service name
 * @param {string} [version='v1'] - Service version
 * @param {string} [environment='prod'] - Environment
 * @returns {string} Queue group name
 *
 * @example
 * ```typescript
 * const queueGroup = createNatsQueueGroup('patient-service', 'v1', 'prod');
 * // Result: 'patient-service-v1-prod'
 * // Multiple instances will share messages in this queue group
 * ```
 */
export function createNatsQueueGroup(
  serviceName: string,
  version: string = 'v1',
  environment: string = 'prod',
): string {
  return `${serviceName}-${version}-${environment}`;
}

/**
 * 19. Implements NATS request-reply pattern with timeout.
 *
 * @param {any} client - NATS client
 * @param {string} subject - NATS subject
 * @param {any} data - Request data
 * @param {number} [timeoutMs=5000] - Timeout in milliseconds
 * @returns {Promise<any>} Response data
 *
 * @example
 * ```typescript
 * try {
 *   const response = await natsRequestReply(
 *     natsClient,
 *     'healthcare.prod.patient.get',
 *     { patientId: '123' },
 *     5000
 *   );
 *   console.log('Patient data:', response);
 * } catch (error) {
 *   console.error('Request failed:', error);
 * }
 * ```
 */
export async function natsRequestReply(
  client: any,
  subject: string,
  data: any,
  timeoutMs: number = 5000,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`NATS request timeout after ${timeoutMs}ms for subject: ${subject}`));
    }, timeoutMs);

    try {
      client.request(subject, JSON.stringify(data), (response: any) => {
        clearTimeout(timer);
        try {
          const parsedResponse = JSON.parse(response);
          resolve(parsedResponse);
        } catch (parseError) {
          reject(new Error(`Failed to parse NATS response: ${(parseError as Error).message}`));
        }
      });
    } catch (error) {
      clearTimeout(timer);
      reject(error);
    }
  });
}

/**
 * 20. Publishes message to NATS subject with fire-and-forget.
 *
 * @param {any} client - NATS client
 * @param {string} subject - NATS subject
 * @param {any} data - Message data
 * @param {string} [replyTo] - Reply-to subject for responses
 * @returns {boolean} True if publish succeeded
 *
 * @example
 * ```typescript
 * publishToNats(
 *   natsClient,
 *   'healthcare.prod.patient.created',
 *   { patientId: '123', name: 'John Doe', createdAt: new Date() }
 * );
 * ```
 */
export function publishToNats(
  client: any,
  subject: string,
  data: any,
  replyTo?: string,
): boolean {
  try {
    const message = JSON.stringify(data);
    if (replyTo) {
      client.publish(subject, message, replyTo);
    } else {
      client.publish(subject, message);
    }
    return true;
  } catch (error) {
    console.error('Failed to publish to NATS:', error);
    return false;
  }
}

// ============================================================================
// SECTION 5: REDIS PUB/SUB UTILITIES (Functions 21-25)
// ============================================================================

/**
 * 21. Creates Redis pub/sub configuration with connection pooling.
 *
 * @param {string} host - Redis host
 * @param {number} port - Redis port
 * @param {Partial<RedisConfig>} [options] - Additional options
 * @returns {RedisConfig} Redis configuration
 *
 * @example
 * ```typescript
 * const config = createRedisConfig('localhost', 6379, {
 *   password: 'secret',
 *   db: 0,
 *   keyPrefix: 'healthcare:',
 *   retryStrategy: (times) => Math.min(times * 50, 2000)
 * });
 * ```
 */
export function createRedisConfig(
  host: string,
  port: number,
  options?: Partial<RedisConfig>,
): RedisConfig {
  return {
    host,
    port,
    password: options?.password,
    db: options?.db || 0,
    keyPrefix: options?.keyPrefix,
    retryStrategy: options?.retryStrategy || ((times: number) => Math.min(times * 100, 3000)),
    enableReadyCheck: options?.enableReadyCheck !== false,
    maxRetriesPerRequest: options?.maxRetriesPerRequest || 3,
  };
}

/**
 * 22. Creates Redis pub/sub channel name with namespacing.
 *
 * @param {string} domain - Domain name
 * @param {string} event - Event name
 * @param {string} [namespace='default'] - Namespace
 * @returns {string} Channel name
 *
 * @example
 * ```typescript
 * const channel = createRedisChannel('healthcare', 'patient.created', 'prod');
 * // Result: 'prod:healthcare:patient.created'
 * ```
 */
export function createRedisChannel(
  domain: string,
  event: string,
  namespace: string = 'default',
): string {
  return `${namespace}:${domain}:${event}`;
}

/**
 * 23. Publishes message to Redis pub/sub channel.
 *
 * @param {any} client - Redis client
 * @param {string} channel - Channel name
 * @param {any} message - Message data
 * @returns {Promise<number>} Number of subscribers that received the message
 *
 * @example
 * ```typescript
 * const subscriberCount = await publishToRedis(
 *   redisClient,
 *   'prod:healthcare:patient.created',
 *   { patientId: '123', name: 'John Doe' }
 * );
 * console.log(`Message delivered to ${subscriberCount} subscribers`);
 * ```
 */
export async function publishToRedis(
  client: any,
  channel: string,
  message: any,
): Promise<number> {
  try {
    const messageString = JSON.stringify(message);
    const result = await client.publish(channel, messageString);
    return result;
  } catch (error) {
    console.error('Failed to publish to Redis:', error);
    return 0;
  }
}

/**
 * 24. Subscribes to Redis pub/sub channel with pattern matching.
 *
 * @param {any} client - Redis client
 * @param {string} pattern - Channel pattern (supports wildcards: * and ?)
 * @param {(channel: string, message: any) => void} handler - Message handler
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await subscribeToRedisPattern(
 *   redisClient,
 *   'prod:healthcare:patient.*',
 *   (channel, message) => {
 *     console.log(`Received on ${channel}:`, message);
 *     // Handle patient.created, patient.updated, etc.
 *   }
 * );
 * ```
 */
export async function subscribeToRedisPattern(
  client: any,
  pattern: string,
  handler: (channel: string, message: any) => void,
): Promise<void> {
  try {
    await client.psubscribe(pattern);

    client.on('pmessage', (subscribedPattern: string, channel: string, message: string) => {
      if (subscribedPattern === pattern) {
        try {
          const parsedMessage = JSON.parse(message);
          handler(channel, parsedMessage);
        } catch (error) {
          console.error('Failed to parse Redis message:', error);
        }
      }
    });
  } catch (error) {
    console.error('Failed to subscribe to Redis pattern:', error);
    throw error;
  }
}

/**
 * 25. Implements Redis pub/sub with message expiration (TTL).
 *
 * @param {any} client - Redis client
 * @param {string} key - Message key
 * @param {any} message - Message data
 * @param {number} ttlSeconds - Time to live in seconds
 * @returns {Promise<boolean>} True if message was stored
 *
 * @example
 * ```typescript
 * await publishWithTTL(
 *   redisClient,
 *   'session:user-123',
 *   { sessionId: 'abc', userId: '123' },
 *   3600 // 1 hour
 * );
 * ```
 */
export async function publishWithTTL(
  client: any,
  key: string,
  message: any,
  ttlSeconds: number,
): Promise<boolean> {
  try {
    const messageString = JSON.stringify(message);
    await client.setex(key, ttlSeconds, messageString);
    return true;
  } catch (error) {
    console.error('Failed to publish with TTL:', error);
    return false;
  }
}

// ============================================================================
// SECTION 6: MESSAGE VALIDATION (Functions 26-30)
// ============================================================================

/**
 * 26. Validates message payload against schema rules.
 *
 * @param {any} payload - Message payload
 * @param {MessageValidationRule[]} rules - Validation rules
 * @returns {Promise<{ valid: boolean; errors?: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const rules: MessageValidationRule[] = [
 *   { field: 'patientId', type: 'uuid', required: true },
 *   { field: 'age', type: 'number', min: 0, max: 150 },
 *   { field: 'email', type: 'email', required: true }
 * ];
 *
 * const { valid, errors } = await validateMessagePayload(payload, rules);
 * if (!valid) {
 *   throw new ValidationException(errors);
 * }
 * ```
 */
export async function validateMessagePayload(
  payload: any,
  rules: MessageValidationRule[],
): Promise<{ valid: boolean; errors?: string[] }> {
  const errors: string[] = [];

  for (const rule of rules) {
    const value = payload[rule.field];

    // Required check
    if (rule.required && (value === undefined || value === null)) {
      errors.push(rule.customMessage || `Field '${rule.field}' is required`);
      continue;
    }

    if (value === undefined || value === null) {
      continue;
    }

    // Type validation
    if (!validateFieldType(value, rule.type)) {
      errors.push(rule.customMessage || `Field '${rule.field}' must be of type ${rule.type}`);
      continue;
    }

    // Numeric constraints
    if (rule.type === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push(`Field '${rule.field}' must be >= ${rule.min}`);
      }
      if (rule.max !== undefined && value > rule.max) {
        errors.push(`Field '${rule.field}' must be <= ${rule.max}`);
      }
    }

    // String constraints
    if (rule.type === 'string') {
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.push(`Field '${rule.field}' must have at least ${rule.minLength} characters`);
      }
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        errors.push(`Field '${rule.field}' must have at most ${rule.maxLength} characters`);
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push(rule.customMessage || `Field '${rule.field}' does not match required pattern`);
    }

    // Enum validation
    if (rule.enum && !rule.enum.includes(value)) {
      errors.push(`Field '${rule.field}' must be one of: ${rule.enum.join(', ')}`);
    }

    // Custom validation
    if (rule.custom) {
      const customValid = await rule.custom(value);
      if (!customValid) {
        errors.push(rule.customMessage || `Field '${rule.field}' failed custom validation`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    ...(errors.length > 0 && { errors }),
  };
}

/**
 * 27. Validates field type for message validation.
 *
 * @param {any} value - Field value
 * @param {string} type - Expected type
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * validateFieldType('test@example.com', 'email'); // true
 * validateFieldType(123, 'string'); // false
 * validateFieldType('550e8400-e29b-41d4-a716-446655440000', 'uuid'); // true
 * ```
 */
export function validateFieldType(value: any, type: string): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    case 'array':
      return Array.isArray(value);
    case 'date':
      return value instanceof Date || !isNaN(Date.parse(value));
    case 'uuid':
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'phone':
      return /^\+?[\d\s\-()]+$/.test(value);
    default:
      return true;
  }
}

/**
 * 28. Sanitizes message payload by removing sensitive fields.
 *
 * @param {any} payload - Message payload
 * @param {string[]} sensitiveFields - Fields to remove or mask
 * @param {boolean} [mask=false] - Mask instead of remove
 * @returns {any} Sanitized payload
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeMessagePayload(
 *   { patientId: '123', ssn: '123-45-6789', name: 'John', password: 'secret' },
 *   ['ssn', 'password'],
 *   true // Mask instead of remove
 * );
 * // Result: { patientId: '123', ssn: '***-**-****', name: 'John', password: '******' }
 * ```
 */
export function sanitizeMessagePayload(
  payload: any,
  sensitiveFields: string[],
  mask: boolean = false,
): any {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  const sanitized = { ...payload };

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      if (mask) {
        const value = sanitized[field];
        if (typeof value === 'string') {
          if (field.toLowerCase().includes('ssn')) {
            sanitized[field] = '***-**-****';
          } else {
            sanitized[field] = '*'.repeat(Math.min(value.length, 10));
          }
        } else {
          sanitized[field] = '***';
        }
      } else {
        delete sanitized[field];
      }
    }
  }

  return sanitized;
}

/**
 * 29. Validates message size to prevent payload overflow.
 *
 * @param {any} payload - Message payload
 * @param {number} maxSizeBytes - Maximum size in bytes
 * @returns {{ valid: boolean; size: number; maxSize: number; exceeded?: number }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateMessageSize(largePayload, 1024 * 1024); // 1 MB limit
 * if (!result.valid) {
 *   console.error(`Message too large: ${result.size} bytes (max: ${result.maxSize})`);
 * }
 * ```
 */
export function validateMessageSize(
  payload: any,
  maxSizeBytes: number,
): { valid: boolean; size: number; maxSize: number; exceeded?: number } {
  const size = Buffer.byteLength(JSON.stringify(payload), 'utf8');
  const valid = size <= maxSizeBytes;

  return {
    valid,
    size,
    maxSize: maxSizeBytes,
    ...(!valid && { exceeded: size - maxSizeBytes }),
  };
}

/**
 * 30. Creates healthcare-specific message validation schema.
 *
 * @param {'patient' | 'appointment' | 'prescription' | 'vital-signs' | 'lab-result'} entityType - Entity type
 * @returns {MessageValidationRule[]} Validation rules
 *
 * @example
 * ```typescript
 * const patientSchema = createHealthcareMessageSchema('patient');
 * const { valid, errors } = await validateMessagePayload(patientData, patientSchema);
 * ```
 */
export function createHealthcareMessageSchema(
  entityType: 'patient' | 'appointment' | 'prescription' | 'vital-signs' | 'lab-result',
): MessageValidationRule[] {
  const baseRules: MessageValidationRule[] = [
    { field: 'id', type: 'uuid', required: true },
    { field: 'timestamp', type: 'date', required: true },
  ];

  switch (entityType) {
    case 'patient':
      return [
        ...baseRules,
        { field: 'firstName', type: 'string', required: true, minLength: 1, maxLength: 100 },
        { field: 'lastName', type: 'string', required: true, minLength: 1, maxLength: 100 },
        { field: 'dateOfBirth', type: 'date', required: true },
        { field: 'medicalRecordNumber', type: 'string', required: true, pattern: /^MRN\d{6,}$/ },
        { field: 'email', type: 'email', required: false },
        { field: 'phone', type: 'phone', required: false },
      ];

    case 'appointment':
      return [
        ...baseRules,
        { field: 'patientId', type: 'uuid', required: true },
        { field: 'providerId', type: 'uuid', required: true },
        { field: 'scheduledAt', type: 'date', required: true },
        { field: 'duration', type: 'number', min: 15, max: 240, required: true },
        { field: 'type', type: 'string', enum: ['consultation', 'follow-up', 'emergency', 'routine'] },
        { field: 'status', type: 'string', enum: ['scheduled', 'confirmed', 'cancelled', 'completed'] },
      ];

    case 'prescription':
      return [
        ...baseRules,
        { field: 'patientId', type: 'uuid', required: true },
        { field: 'providerId', type: 'uuid', required: true },
        { field: 'medicationName', type: 'string', required: true, minLength: 1 },
        { field: 'dosage', type: 'string', required: true },
        { field: 'frequency', type: 'string', required: true },
        { field: 'duration', type: 'number', min: 1, max: 365 },
        { field: 'refills', type: 'number', min: 0, max: 12 },
      ];

    case 'vital-signs':
      return [
        ...baseRules,
        { field: 'patientId', type: 'uuid', required: true },
        { field: 'temperature', type: 'number', min: 35, max: 42 },
        { field: 'heartRate', type: 'number', min: 40, max: 200 },
        { field: 'bloodPressureSystolic', type: 'number', min: 70, max: 200 },
        { field: 'bloodPressureDiastolic', type: 'number', min: 40, max: 130 },
        { field: 'respiratoryRate', type: 'number', min: 8, max: 40 },
        { field: 'oxygenSaturation', type: 'number', min: 70, max: 100 },
      ];

    case 'lab-result':
      return [
        ...baseRules,
        { field: 'patientId', type: 'uuid', required: true },
        { field: 'testName', type: 'string', required: true },
        { field: 'testCode', type: 'string', required: true },
        { field: 'result', type: 'string', required: true },
        { field: 'unit', type: 'string', required: false },
        { field: 'referenceRange', type: 'string', required: false },
        { field: 'status', type: 'string', enum: ['pending', 'completed', 'cancelled', 'error'] },
      ];

    default:
      return baseRules;
  }
}

// ============================================================================
// SECTION 7: RETRY MECHANISMS WITH EXPONENTIAL BACKOFF (Functions 31-35)
// ============================================================================

/**
 * 31. Creates retry policy with configurable backoff strategy.
 *
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {'fixed' | 'exponential' | 'linear' | 'jitter'} backoffType - Backoff strategy
 * @param {number} initialDelay - Initial delay in milliseconds
 * @param {Partial<RetryPolicy>} [options] - Additional options
 * @returns {RetryPolicy} Retry policy
 *
 * @example
 * ```typescript
 * const policy = createRetryPolicy(5, 'exponential', 1000, {
 *   maxDelay: 30000,
 *   multiplier: 2,
 *   jitterFactor: 0.1,
 *   shouldRetry: (error) => error.code !== 'VALIDATION_ERROR'
 * });
 * ```
 */
export function createRetryPolicy(
  maxAttempts: number,
  backoffType: 'fixed' | 'exponential' | 'linear' | 'jitter',
  initialDelay: number,
  options?: Partial<RetryPolicy>,
): RetryPolicy {
  return {
    maxAttempts,
    backoffType,
    initialDelay,
    maxDelay: options?.maxDelay || 60000,
    multiplier: options?.multiplier || 2,
    jitterFactor: options?.jitterFactor || 0.1,
    shouldRetry: options?.shouldRetry || ((error: any) => {
      const retryableErrors = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET'];
      return retryableErrors.includes(error.code) || error.statusCode >= 500;
    }),
    onRetry: options?.onRetry,
  };
}

/**
 * 32. Calculates retry delay based on policy and attempt number.
 *
 * @param {RetryPolicy} policy - Retry policy
 * @param {number} attempt - Current attempt number (0-indexed)
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateRetryDelay(policy, 3);
 * // For exponential with multiplier 2: 1000 * 2^3 = 8000ms
 * // With jitter: 8000 ± (8000 * 0.1) = 7200-8800ms
 * ```
 */
export function calculateRetryDelay(
  policy: RetryPolicy,
  attempt: number,
): number {
  let delay: number;

  switch (policy.backoffType) {
    case 'fixed':
      delay = policy.initialDelay;
      break;

    case 'exponential':
      delay = policy.initialDelay * Math.pow(policy.multiplier || 2, attempt);
      break;

    case 'linear':
      delay = policy.initialDelay * (attempt + 1);
      break;

    case 'jitter':
      delay = policy.initialDelay * Math.pow(policy.multiplier || 2, attempt);
      const jitter = delay * (policy.jitterFactor || 0.1);
      delay = delay + (Math.random() * 2 - 1) * jitter;
      break;

    default:
      delay = policy.initialDelay;
  }

  return Math.min(Math.max(delay, 0), policy.maxDelay || 60000);
}

/**
 * 33. Executes operation with retry policy using async/await.
 *
 * @param {() => Promise<T>} operation - Operation to execute
 * @param {RetryPolicy} policy - Retry policy
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithRetry(
 *   async () => {
 *     const response = await fetch('https://api.example.com/patients/123');
 *     return response.json();
 *   },
 *   retryPolicy
 * );
 * ```
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  policy: RetryPolicy,
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < policy.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!policy.shouldRetry || !policy.shouldRetry(error)) {
        throw error;
      }

      if (attempt === policy.maxAttempts - 1) {
        break;
      }

      const delay = calculateRetryDelay(policy, attempt);

      if (policy.onRetry) {
        policy.onRetry(attempt + 1, error);
      }

      console.warn(`Retry attempt ${attempt + 1}/${policy.maxAttempts} after ${delay}ms`, {
        error: (error as Error).message,
      });

      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * 34. Executes operation with retry policy using RxJS Observable.
 *
 * @param {() => Observable<T>} operation - Operation to execute
 * @param {RetryPolicy} policy - Retry policy
 * @returns {Observable<T>} Observable with retry logic
 *
 * @example
 * ```typescript
 * executeWithRetryObservable(
 *   () => this.httpClient.get('/api/patients/123'),
 *   retryPolicy
 * ).subscribe(
 *   result => console.log('Success:', result),
 *   error => console.error('Failed after retries:', error)
 * );
 * ```
 */
export function executeWithRetryObservable<T>(
  operation: () => Observable<T>,
  policy: RetryPolicy,
): Observable<T> {
  return operation().pipe(
    retry({
      count: policy.maxAttempts,
      delay: (error, retryCount) => {
        if (!policy.shouldRetry || !policy.shouldRetry(error)) {
          throw error;
        }

        const delayMs = calculateRetryDelay(policy, retryCount - 1);

        if (policy.onRetry) {
          policy.onRetry(retryCount, error);
        }

        console.warn(`Retry attempt ${retryCount}/${policy.maxAttempts} after ${delayMs}ms`);
        return timer(delayMs);
      },
    }),
    catchError((error) => {
      console.error(`Operation failed after ${policy.maxAttempts} attempts:`, error);
      return throwError(() => error);
    }),
  );
}

/**
 * 35. Creates retry policy for specific error types.
 *
 * @param {string[]} retryableErrorCodes - Error codes to retry
 * @param {number} [maxAttempts=3] - Maximum attempts
 * @param {number} [initialDelay=1000] - Initial delay
 * @returns {RetryPolicy} Retry policy
 *
 * @example
 * ```typescript
 * const networkRetryPolicy = createRetryPolicyForErrors(
 *   ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'],
 *   5,
 *   1000
 * );
 * ```
 */
export function createRetryPolicyForErrors(
  retryableErrorCodes: string[],
  maxAttempts: number = 3,
  initialDelay: number = 1000,
): RetryPolicy {
  return createRetryPolicy(maxAttempts, 'exponential', initialDelay, {
    shouldRetry: (error: any) => {
      return retryableErrorCodes.includes(error.code) ||
             retryableErrorCodes.includes(error.name) ||
             (error.statusCode && error.statusCode >= 500);
    },
  });
}

// ============================================================================
// SECTION 8: CIRCUIT BREAKER PATTERNS (Functions 36-40)
// ============================================================================

/**
 * 36. Creates circuit breaker state tracker.
 *
 * @returns {CircuitBreakerState} Initial circuit breaker state
 *
 * @example
 * ```typescript
 * const circuitState = createCircuitBreakerState();
 * // State starts as CLOSED (allowing requests)
 * ```
 */
export function createCircuitBreakerState(): CircuitBreakerState {
  return {
    state: 'CLOSED',
    failureCount: 0,
    successCount: 0,
    lastFailureTime: 0,
    nextAttemptTime: 0,
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
  };
}

/**
 * 37. Updates circuit breaker state based on operation result.
 *
 * @param {CircuitBreakerState} state - Current state
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @param {boolean} success - Whether operation succeeded
 * @returns {CircuitBreakerState} Updated state
 *
 * @example
 * ```typescript
 * let state = createCircuitBreakerState();
 * // After failure:
 * state = updateCircuitBreakerState(state, config, false);
 * // After success:
 * state = updateCircuitBreakerState(state, config, true);
 * ```
 */
export function updateCircuitBreakerState(
  state: CircuitBreakerState,
  config: CircuitBreakerConfig,
  success: boolean,
): CircuitBreakerState {
  const now = Date.now();

  if (success) {
    const newSuccessCount = state.successCount + 1;
    const newConsecutiveSuccesses = (state.consecutiveSuccesses || 0) + 1;

    if (state.state === 'HALF_OPEN' && newSuccessCount >= config.successThreshold) {
      return {
        state: 'CLOSED',
        failureCount: 0,
        successCount: 0,
        lastFailureTime: 0,
        nextAttemptTime: 0,
        consecutiveSuccesses: 0,
        consecutiveFailures: 0,
      };
    }

    return {
      ...state,
      successCount: newSuccessCount,
      failureCount: 0,
      consecutiveSuccesses: newConsecutiveSuccesses,
      consecutiveFailures: 0,
    };
  } else {
    const newFailureCount = state.failureCount + 1;
    const newConsecutiveFailures = (state.consecutiveFailures || 0) + 1;

    if (newFailureCount >= config.failureThreshold) {
      return {
        state: 'OPEN',
        failureCount: newFailureCount,
        successCount: 0,
        lastFailureTime: now,
        nextAttemptTime: now + config.resetTimeout,
        consecutiveSuccesses: 0,
        consecutiveFailures: newConsecutiveFailures,
      };
    }

    return {
      ...state,
      failureCount: newFailureCount,
      successCount: 0,
      lastFailureTime: now,
      consecutiveSuccesses: 0,
      consecutiveFailures: newConsecutiveFailures,
    };
  }
}

/**
 * 38. Checks if circuit breaker allows operation execution.
 *
 * @param {CircuitBreakerState} state - Current state
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {{ allowed: boolean; reason?: string; nextState?: CircuitBreakerState }} Execution permission
 *
 * @example
 * ```typescript
 * const { allowed, reason, nextState } = canExecuteOperation(state, config);
 * if (!allowed) {
 *   console.error('Operation blocked:', reason);
 *   return;
 * }
 * if (nextState) state = nextState; // Transition to HALF_OPEN
 * ```
 */
export function canExecuteOperation(
  state: CircuitBreakerState,
  config: CircuitBreakerConfig,
): { allowed: boolean; reason?: string; nextState?: CircuitBreakerState } {
  const now = Date.now();

  if (state.state === 'CLOSED') {
    return { allowed: true };
  }

  if (state.state === 'OPEN') {
    if (now >= state.nextAttemptTime) {
      const nextState: CircuitBreakerState = {
        ...state,
        state: 'HALF_OPEN',
        successCount: 0,
        failureCount: 0,
      };
      return { allowed: true, nextState };
    }

    const waitTime = Math.ceil((state.nextAttemptTime - now) / 1000);
    return {
      allowed: false,
      reason: `Circuit breaker is OPEN. Retry in ${waitTime} seconds.`,
    };
  }

  // HALF_OPEN state - allow limited requests
  const requestsInHalfOpen = state.successCount + state.failureCount;
  if (requestsInHalfOpen < (config.halfOpenRequests || 3)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'Circuit breaker HALF_OPEN limit reached',
  };
}

/**
 * 39. Executes operation with circuit breaker protection.
 *
 * @param {() => Promise<T>} operation - Operation to execute
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @param {(state: CircuitBreakerState) => void} onStateChange - State change callback
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * let circuitState = createCircuitBreakerState();
 *
 * const result = await executeWithCircuitBreaker(
 *   () => externalApiCall(),
 *   circuitState,
 *   circuitConfig,
 *   (newState) => { circuitState = newState; }
 * );
 * ```
 */
export async function executeWithCircuitBreaker<T>(
  operation: () => Promise<T>,
  state: CircuitBreakerState,
  config: CircuitBreakerConfig,
  onStateChange: (state: CircuitBreakerState) => void,
): Promise<T> {
  const { allowed, reason, nextState } = canExecuteOperation(state, config);

  if (!allowed) {
    throw new Error(reason || 'Circuit breaker is OPEN');
  }

  if (nextState) {
    onStateChange(nextState);
    state = nextState;
  }

  try {
    const result = await Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timeout')), config.timeout),
      ),
    ]);

    const newState = updateCircuitBreakerState(state, config, true);
    onStateChange(newState);

    return result;
  } catch (error) {
    const newState = updateCircuitBreakerState(state, config, false);
    onStateChange(newState);

    throw error;
  }
}

/**
 * 40. Creates circuit breaker configuration for microservices.
 *
 * @param {number} [failureThreshold=5] - Failures before opening
 * @param {number} [successThreshold=2] - Successes before closing
 * @param {number} [timeout=10000] - Operation timeout (ms)
 * @param {number} [resetTimeout=60000] - Reset timeout (ms)
 * @returns {CircuitBreakerConfig} Circuit breaker configuration
 *
 * @example
 * ```typescript
 * const config = createCircuitBreakerConfig(5, 2, 10000, 60000);
 * // Opens after 5 failures, closes after 2 successes in HALF_OPEN
 * ```
 */
export function createCircuitBreakerConfig(
  failureThreshold: number = 5,
  successThreshold: number = 2,
  timeout: number = 10000,
  resetTimeout: number = 60000,
): CircuitBreakerConfig {
  return {
    failureThreshold,
    successThreshold,
    timeout,
    resetTimeout,
    monitoringPeriod: 60000,
    halfOpenRequests: 3,
  };
}

// ============================================================================
// SECTION 9: SERVICE DISCOVERY & HEALTH CHECKS (Functions 41-45)
// ============================================================================

/**
 * 41. Registers service instance for service discovery.
 *
 * @param {ServiceRegistration} registration - Service registration details
 * @returns {Promise<string>} Registration ID
 *
 * @example
 * ```typescript
 * const registrationId = await registerServiceInstance({
 *   serviceId: 'patient-service-1',
 *   serviceName: 'patient-service',
 *   version: '1.0.0',
 *   host: 'localhost',
 *   port: 3001,
 *   protocol: 'tcp',
 *   healthCheckUrl: '/health',
 *   tags: ['healthcare', 'primary']
 * });
 * ```
 */
export async function registerServiceInstance(
  registration: ServiceRegistration,
): Promise<string> {
  const registrationId = `${registration.serviceName}-${registration.serviceId}-${Date.now()}`;

  console.log(`Registered service instance: ${registration.serviceName}`, {
    id: registrationId,
    endpoint: `${registration.protocol}://${registration.host}:${registration.port}`,
    version: registration.version,
    tags: registration.tags,
    weight: registration.weight || 1,
  });

  // In production: Register with Consul, etcd, or service mesh
  return registrationId;
}

/**
 * 42. Creates comprehensive health check status for microservice.
 *
 * @param {string} serviceId - Service identifier
 * @param {string} [version] - Service version
 * @param {number} [startTime=Date.now()] - Service start time
 * @returns {HealthCheckStatus} Health check status
 *
 * @example
 * ```typescript
 * const healthStatus = createHealthCheckStatus('patient-service', '1.0.0', startTime);
 * // Add component checks:
 * healthStatus = addComponentHealthCheck(healthStatus, 'database', dbHealth);
 * healthStatus = addComponentHealthCheck(healthStatus, 'message-broker', mqHealth);
 * ```
 */
export function createHealthCheckStatus(
  serviceId: string,
  version?: string,
  startTime: number = Date.now(),
): HealthCheckStatus {
  return {
    status: 'healthy',
    timestamp: new Date(),
    uptime: Date.now() - startTime,
    checks: {},
    serviceId,
    ...(version && { version }),
  };
}

/**
 * 43. Adds component health check to overall health status.
 *
 * @param {HealthCheckStatus} status - Overall health status
 * @param {string} componentName - Component name
 * @param {ComponentHealth} componentHealth - Component health details
 * @returns {HealthCheckStatus} Updated health status
 *
 * @example
 * ```typescript
 * const dbHealth: ComponentHealth = {
 *   status: 'pass',
 *   componentType: 'datastore',
 *   observedValue: 15,
 *   observedUnit: 'ms',
 *   time: new Date().toISOString()
 * };
 * const updatedStatus = addComponentHealthCheck(status, 'postgresql', dbHealth);
 * ```
 */
export function addComponentHealthCheck(
  status: HealthCheckStatus,
  componentName: string,
  componentHealth: ComponentHealth,
): HealthCheckStatus {
  const updatedChecks = {
    ...status.checks,
    [componentName]: componentHealth,
  };

  const checkValues = Object.values(updatedChecks);
  const hasFailure = checkValues.some(check => check.status === 'fail');
  const hasWarning = checkValues.some(check => check.status === 'warn');

  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (hasFailure) {
    overallStatus = 'unhealthy';
  } else if (hasWarning) {
    overallStatus = 'degraded';
  }

  return {
    ...status,
    status: overallStatus,
    checks: updatedChecks,
    timestamp: new Date(),
  };
}

/**
 * 44. Checks database connectivity for health monitoring.
 *
 * @param {any} connection - Database connection
 * @param {string} [componentId] - Component identifier
 * @returns {Promise<ComponentHealth>} Database health status
 *
 * @example
 * ```typescript
 * const dbHealth = await checkDatabaseHealth(sequelize, 'primary-db');
 * const status = addComponentHealthCheck(healthStatus, 'database', dbHealth);
 * ```
 */
export async function checkDatabaseHealth(
  connection: any,
  componentId?: string,
): Promise<ComponentHealth> {
  const startTime = Date.now();

  try {
    await connection.authenticate();
    const responseTime = Date.now() - startTime;

    return {
      status: responseTime < 100 ? 'pass' : 'warn',
      componentType: 'datastore',
      componentId,
      observedValue: responseTime,
      observedUnit: 'ms',
      time: new Date().toISOString(),
      output: responseTime < 100 ? 'Database connection healthy' : 'Database response slow',
    };
  } catch (error) {
    return {
      status: 'fail',
      componentType: 'datastore',
      componentId,
      time: new Date().toISOString(),
      output: `Database connection failed: ${(error as Error).message}`,
      affectedEndpoints: ['/api/patients', '/api/appointments'],
    };
  }
}

/**
 * 45. Checks message broker connectivity (RabbitMQ, Kafka, NATS, Redis).
 *
 * @param {any} client - Message broker client
 * @param {'rabbitmq' | 'kafka' | 'nats' | 'redis'} brokerType - Broker type
 * @param {string} [componentId] - Component identifier
 * @returns {Promise<ComponentHealth>} Broker health status
 *
 * @example
 * ```typescript
 * const kafkaHealth = await checkMessageBrokerHealth(kafkaClient, 'kafka', 'primary-kafka');
 * const status = addComponentHealthCheck(healthStatus, 'message-broker', kafkaHealth);
 * ```
 */
export async function checkMessageBrokerHealth(
  client: any,
  brokerType: 'rabbitmq' | 'kafka' | 'nats' | 'redis',
  componentId?: string,
): Promise<ComponentHealth> {
  const startTime = Date.now();

  try {
    const isConnected = client && (
      typeof client.isConnected === 'function' ? client.isConnected() :
      client.connected !== false
    );
    const responseTime = Date.now() - startTime;

    return {
      status: isConnected ? 'pass' : 'fail',
      componentType: 'message-broker',
      componentId,
      observedValue: responseTime,
      observedUnit: 'ms',
      time: new Date().toISOString(),
      output: `${brokerType} connection ${isConnected ? 'active' : 'inactive'}`,
    };
  } catch (error) {
    return {
      status: 'fail',
      componentType: 'message-broker',
      componentId,
      time: new Date().toISOString(),
      output: `${brokerType} connection failed: ${(error as Error).message}`,
    };
  }
}

// ============================================================================
// SECTION 10: MESSAGE IDEMPOTENCY GUARDS (Functions 46-48)
// ============================================================================

/**
 * 46. Creates idempotency record for exactly-once message processing.
 *
 * @param {string} messageId - Message identifier
 * @param {number} [ttlSeconds=3600] - Time to live in seconds
 * @param {any} [result] - Processing result
 * @returns {IdempotencyRecord} Idempotency record
 *
 * @example
 * ```typescript
 * const record = createIdempotencyRecord('msg_123', 3600);
 * await idempotencyStore.set(messageId, record);
 * ```
 */
export function createIdempotencyRecord(
  messageId: string,
  ttlSeconds: number = 3600,
  result?: any,
): IdempotencyRecord {
  const now = new Date();
  return {
    messageId,
    processedAt: now,
    expiresAt: new Date(now.getTime() + ttlSeconds * 1000),
    result,
    status: 'processing',
  };
}

/**
 * 47. Checks if message has already been processed (idempotency check).
 *
 * @param {string} messageId - Message identifier
 * @param {Map<string, IdempotencyRecord> | any} store - Idempotency store
 * @returns {Promise<{ processed: boolean; record?: IdempotencyRecord }>} Check result
 *
 * @example
 * ```typescript
 * const { processed, record } = await checkMessageIdempotency(messageId, store);
 * if (processed) {
 *   console.log('Message already processed, returning cached result');
 *   return record.result;
 * }
 * ```
 */
export async function checkMessageIdempotency(
  messageId: string,
  store: Map<string, IdempotencyRecord> | any,
): Promise<{ processed: boolean; record?: IdempotencyRecord }> {
  try {
    const record = store instanceof Map ? store.get(messageId) : await store.get(messageId);

    if (!record) {
      return { processed: false };
    }

    if (record.expiresAt < new Date()) {
      return { processed: false };
    }

    return { processed: true, record };
  } catch (error) {
    console.error('Idempotency check failed:', error);
    return { processed: false };
  }
}

/**
 * 48. Marks message as processed with result caching.
 *
 * @param {string} messageId - Message identifier
 * @param {Map<string, IdempotencyRecord> | any} store - Idempotency store
 * @param {any} result - Processing result
 * @param {number} [ttlSeconds=3600] - Time to live
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await markMessageAsProcessed(messageId, store, { patientId: '123', status: 'created' });
 * ```
 */
export async function markMessageAsProcessed(
  messageId: string,
  store: Map<string, IdempotencyRecord> | any,
  result: any,
  ttlSeconds: number = 3600,
): Promise<void> {
  const record = createIdempotencyRecord(messageId, ttlSeconds, result);
  record.status = 'completed';

  if (store instanceof Map) {
    store.set(messageId, record);
  } else {
    await store.set(messageId, record, ttlSeconds);
  }
}

// ============================================================================
// SECTION 11: SAGA PATTERN ORCHESTRATORS (Functions 49-51)
// ============================================================================

/**
 * 49. Creates saga context for distributed transaction orchestration.
 *
 * @param {string} [sagaId] - Saga identifier (auto-generated if not provided)
 * @param {Record<string, any>} [initialData] - Initial saga data
 * @returns {SagaContext} Saga context
 *
 * @example
 * ```typescript
 * const sagaContext = createSagaContext('create-patient-saga', {
 *   patientData: { name: 'John Doe', age: 35 }
 * });
 * ```
 */
export function createSagaContext(
  sagaId?: string,
  initialData?: Record<string, any>,
): SagaContext {
  return {
    sagaId: sagaId || `saga_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`,
    currentStep: 0,
    completedSteps: [],
    stepResults: {},
    data: initialData || {},
    status: 'pending',
    startedAt: new Date(),
  };
}

/**
 * 50. Executes saga with automatic compensation on failure.
 *
 * @param {SagaStep[]} steps - Saga steps to execute
 * @param {SagaContext} context - Saga context
 * @returns {Promise<SagaContext>} Final saga context
 *
 * @example
 * ```typescript
 * const steps: SagaStep[] = [
 *   {
 *     stepId: 'create-patient',
 *     stepName: 'Create Patient Record',
 *     action: async (ctx) => await createPatient(ctx.data.patientData),
 *     compensation: async (ctx) => await deletePatient(ctx.stepResults['create-patient'].id),
 *     timeout: 5000
 *   },
 *   {
 *     stepId: 'send-notification',
 *     stepName: 'Send Welcome Email',
 *     action: async (ctx) => await sendEmail(ctx.stepResults['create-patient'].email),
 *     compensation: async (ctx) => console.log('Email sent, no compensation needed'),
 *     timeout: 3000
 *   }
 * ];
 *
 * const result = await executeSaga(steps, sagaContext);
 * ```
 */
export async function executeSaga(
  steps: SagaStep[],
  context: SagaContext,
): Promise<SagaContext> {
  context.status = 'running';

  try {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      context.currentStep = i;

      console.log(`Executing saga step ${i + 1}/${steps.length}: ${step.stepName}`);

      try {
        const stepTimeout = step.timeout || 30000;
        const result = await Promise.race([
          step.action(context),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Step timeout: ${step.stepName}`)), stepTimeout),
          ),
        ]);

        context.stepResults[step.stepId] = result;
        context.completedSteps.push(step.stepId);
        console.log(`Step ${step.stepName} completed successfully`);
      } catch (error) {
        console.error(`Step ${step.stepName} failed:`, error);
        context.error = error;
        context.status = 'compensating';

        await compensateSaga(steps, context, i);
        context.status = 'failed';
        throw error;
      }
    }

    context.status = 'completed';
    context.completedAt = new Date();
    return context;
  } catch (error) {
    throw error;
  }
}

/**
 * 51. Compensates saga by rolling back completed steps.
 *
 * @param {SagaStep[]} steps - Saga steps
 * @param {SagaContext} context - Saga context
 * @param {number} failedStepIndex - Index of failed step
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Called automatically by executeSaga on failure
 * await compensateSaga(steps, context, failedStepIndex);
 * ```
 */
export async function compensateSaga(
  steps: SagaStep[],
  context: SagaContext,
  failedStepIndex: number,
): Promise<void> {
  console.log(`Starting saga compensation from step ${failedStepIndex}`);

  for (let i = failedStepIndex - 1; i >= 0; i--) {
    const step = steps[i];

    if (!context.completedSteps.includes(step.stepId)) {
      continue;
    }

    try {
      console.log(`Compensating step: ${step.stepName}`);
      await step.compensation(context, context.stepResults[step.stepId]);
      console.log(`Step ${step.stepName} compensated successfully`);
    } catch (compensationError) {
      console.error(`Compensation failed for step ${step.stepName}:`, compensationError);
    }
  }

  context.status = 'compensated';
  console.log('Saga compensation completed');
}

// ============================================================================
// SECTION 12: MESSAGE ROUTING UTILITIES (Functions 52-54)
// ============================================================================

/**
 * 52. Creates message routing rule for dynamic routing.
 *
 * @param {string | RegExp} pattern - Message pattern to match
 * @param {string} destination - Destination queue/topic
 * @param {number} [priority=0] - Routing priority
 * @param {(message: any) => boolean} [condition] - Additional routing condition
 * @returns {MessageRoutingRule} Routing rule
 *
 * @example
 * ```typescript
 * const rule = createMessageRoutingRule(
 *   /^patient\./,
 *   'patient-queue',
 *   10,
 *   (msg) => msg.priority === 'high'
 * );
 * ```
 */
export function createMessageRoutingRule(
  pattern: string | RegExp,
  destination: string,
  priority: number = 0,
  condition?: (message: any) => boolean,
): MessageRoutingRule {
  return {
    pattern,
    destination,
    priority,
    condition,
  };
}

/**
 * 53. Routes message based on routing rules.
 *
 * @param {any} message - Message to route
 * @param {MessageRoutingRule[]} rules - Routing rules
 * @returns {string | null} Destination queue/topic or null
 *
 * @example
 * ```typescript
 * const rules = [
 *   createMessageRoutingRule(/^patient\./, 'patient-queue', 10),
 *   createMessageRoutingRule(/^appointment\./, 'appointment-queue', 5)
 * ];
 *
 * const destination = routeMessage({ event: 'patient.created' }, rules);
 * // Returns: 'patient-queue'
 * ```
 */
export function routeMessage(
  message: any,
  rules: MessageRoutingRule[],
): string | null {
  const sortedRules = [...rules].sort((a, b) => (b.priority || 0) - (a.priority || 0));

  const messageKey = message.event || message.cmd || message.type || '';

  for (const rule of sortedRules) {
    let matches = false;

    if (rule.pattern instanceof RegExp) {
      matches = rule.pattern.test(messageKey);
    } else {
      matches = messageKey === rule.pattern;
    }

    if (matches && (!rule.condition || rule.condition(message))) {
      return rule.destination;
    }
  }

  return null;
}

/**
 * 54. Creates priority queue message wrapper.
 *
 * @param {T} payload - Message payload
 * @param {number} priority - Message priority (higher = more important)
 * @returns {PriorityQueueMessage<T>} Priority queue message
 *
 * @example
 * ```typescript
 * const urgentMessage = createPriorityQueueMessage(
 *   { patientId: '123', alert: 'Critical vitals' },
 *   100 // High priority
 * );
 * ```
 */
export function createPriorityQueueMessage<T = any>(
  payload: T,
  priority: number,
): PriorityQueueMessage<T> {
  return {
    priority,
    payload,
    timestamp: new Date(),
    messageId: generateMessageId('pri'),
  };
}

// ============================================================================
// SECTION 13: DISTRIBUTED TRANSACTION HELPERS (Functions 55-57)
// ============================================================================

/**
 * 55. Creates distributed transaction context for 2PC protocol.
 *
 * @param {string[]} participants - Service participants
 * @param {number} [timeout=30000] - Transaction timeout
 * @returns {DistributedTransactionContext} Transaction context
 *
 * @example
 * ```typescript
 * const txContext = createDistributedTransaction(
 *   ['patient-service', 'billing-service', 'notification-service'],
 *   30000
 * );
 * ```
 */
export function createDistributedTransaction(
  participants: string[],
  timeout: number = 30000,
): DistributedTransactionContext {
  return {
    transactionId: `tx_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`,
    participants,
    status: 'prepared',
    timeout,
    startedAt: new Date(),
    preparedParticipants: [],
    committedParticipants: [],
  };
}

/**
 * 56. Prepares distributed transaction (Phase 1 of 2PC).
 *
 * @param {DistributedTransactionContext} context - Transaction context
 * @param {(participant: string) => Promise<boolean>} prepareFunc - Prepare function
 * @returns {Promise<boolean>} True if all participants prepared successfully
 *
 * @example
 * ```typescript
 * const allPrepared = await prepareDistributedTransaction(
 *   txContext,
 *   async (participant) => {
 *     const response = await sendPrepareRequest(participant);
 *     return response.canCommit;
 *   }
 * );
 * ```
 */
export async function prepareDistributedTransaction(
  context: DistributedTransactionContext,
  prepareFunc: (participant: string) => Promise<boolean>,
): Promise<boolean> {
  const preparePromises = context.participants.map(async (participant) => {
    try {
      const canPrepare = await Promise.race([
        prepareFunc(participant),
        new Promise<boolean>((_, reject) =>
          setTimeout(() => reject(new Error('Prepare timeout')), context.timeout),
        ),
      ]);

      if (canPrepare) {
        context.preparedParticipants.push(participant);
      }

      return canPrepare;
    } catch (error) {
      console.error(`Prepare failed for participant ${participant}:`, error);
      return false;
    }
  });

  const results = await Promise.all(preparePromises);
  return results.every(result => result === true);
}

/**
 * 57. Commits or aborts distributed transaction (Phase 2 of 2PC).
 *
 * @param {DistributedTransactionContext} context - Transaction context
 * @param {boolean} commit - True to commit, false to abort
 * @param {(participant: string, commit: boolean) => Promise<void>} commitFunc - Commit/abort function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await commitDistributedTransaction(
 *   txContext,
 *   allPrepared,
 *   async (participant, shouldCommit) => {
 *     if (shouldCommit) {
 *       await sendCommitRequest(participant);
 *     } else {
 *       await sendAbortRequest(participant);
 *     }
 *   }
 * );
 * ```
 */
export async function commitDistributedTransaction(
  context: DistributedTransactionContext,
  commit: boolean,
  commitFunc: (participant: string, commit: boolean) => Promise<void>,
): Promise<void> {
  context.status = commit ? 'committed' : 'aborted';

  const participantsToNotify = commit ? context.preparedParticipants : context.participants;

  const commitPromises = participantsToNotify.map(async (participant) => {
    try {
      await commitFunc(participant, commit);

      if (commit) {
        context.committedParticipants.push(participant);
      }
    } catch (error) {
      console.error(`${commit ? 'Commit' : 'Abort'} failed for participant ${participant}:`, error);
    }
  });

  await Promise.all(commitPromises);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generates unique message ID.
 */
function generateMessageId(prefix: string = 'msg'): string {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Generates unique trace ID for distributed tracing.
 */
function generateTraceId(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Generates unique span ID for distributed tracing.
 */
function generateSpanId(): string {
  return crypto.randomBytes(8).toString('hex');
}

/**
 * Sleep utility for retry delays.
 */
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Message Pattern Builders (1-5)
  createMessagePattern,
  createEventPattern,
  wrapMessageWithMetadata,
  unwrapMessageEnvelope,
  generateCorrelationId,

  // RabbitMQ Message Handlers (6-10)
  createRabbitMQConfig,
  createDeadLetterQueue,
  acknowledgeRabbitMQMessage,
  rejectRabbitMQMessage,
  publishToRabbitMQ,

  // Kafka Producer/Consumer Utilities (11-15)
  createKafkaConfig,
  createKafkaTopic,
  serializeKafkaMessage,
  deserializeKafkaMessage,
  createKafkaConsumerGroup,

  // NATS Client Helpers (16-20)
  createNatsConfig,
  createNatsSubject,
  createNatsQueueGroup,
  natsRequestReply,
  publishToNats,

  // Redis Pub/Sub Utilities (21-25)
  createRedisConfig,
  createRedisChannel,
  publishToRedis,
  subscribeToRedisPattern,
  publishWithTTL,

  // Message Validation (26-30)
  validateMessagePayload,
  validateFieldType,
  sanitizeMessagePayload,
  validateMessageSize,
  createHealthcareMessageSchema,

  // Retry Mechanisms with Exponential Backoff (31-35)
  createRetryPolicy,
  calculateRetryDelay,
  executeWithRetry,
  executeWithRetryObservable,
  createRetryPolicyForErrors,

  // Circuit Breaker Patterns (36-40)
  createCircuitBreakerState,
  updateCircuitBreakerState,
  canExecuteOperation,
  executeWithCircuitBreaker,
  createCircuitBreakerConfig,

  // Service Discovery & Health Checks (41-45)
  registerServiceInstance,
  createHealthCheckStatus,
  addComponentHealthCheck,
  checkDatabaseHealth,
  checkMessageBrokerHealth,

  // Message Idempotency Guards (46-48)
  createIdempotencyRecord,
  checkMessageIdempotency,
  markMessageAsProcessed,

  // Saga Pattern Orchestrators (49-51)
  createSagaContext,
  executeSaga,
  compensateSaga,

  // Message Routing Utilities (52-54)
  createMessageRoutingRule,
  routeMessage,
  createPriorityQueueMessage,

  // Distributed Transaction Helpers (55-57)
  createDistributedTransaction,
  prepareDistributedTransaction,
  commitDistributedTransaction,
};
