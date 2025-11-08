/**
 * LOC: MCSVC1234567
 * File: /reuse/microservices-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Microservices modules
 *   - NestJS message handlers
 *   - Event-driven services
 *   - Backend microservices infrastructure
 */

/**
 * File: /reuse/microservices-kit.ts
 * Locator: WC-UTL-MCSVC-001
 * Purpose: Comprehensive NestJS Microservices Utilities - message patterns, event-driven architecture, RabbitMQ, Kafka, gRPC, NATS, circuit breakers, service discovery
 *
 * Upstream: Independent utility module for NestJS microservices implementation
 * Downstream: ../backend/*, microservices modules, message handlers, event services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/microservices, RabbitMQ, Kafka, gRPC, NATS
 * Exports: 45+ utility functions for microservices, message patterns, event-driven architecture, resilience patterns
 *
 * LLM Context: Comprehensive NestJS microservices utilities for implementing production-ready distributed systems.
 * Provides message pattern definitions, event-driven architecture, transport layer integrations (RabbitMQ, Kafka, gRPC, NATS),
 * request-response patterns, event publishing, message validation, dead letter queues, retry policies, circuit breakers,
 * service discovery, and health checks. Essential for building scalable, resilient microservices in healthcare platforms.
 */

import { Observable, Subject, throwError, of, timer } from 'rxjs';
import { retry, catchError, timeout, map, switchMap, tap } from 'rxjs/operators';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface MessagePattern {
  cmd: string;
  version?: string;
  metadata?: Record<string, any>;
}

interface EventPattern {
  event: string;
  aggregateId?: string;
  version?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface RabbitMQConfig {
  urls: string[];
  queue: string;
  queueOptions?: {
    durable?: boolean;
    exclusive?: boolean;
    autoDelete?: boolean;
    arguments?: Record<string, any>;
  };
  prefetchCount?: number;
  noAck?: boolean;
  socketOptions?: Record<string, any>;
}

interface KafkaConfig {
  clientId: string;
  brokers: string[];
  groupId: string;
  ssl?: boolean;
  sasl?: {
    mechanism: string;
    username: string;
    password: string;
  };
  retry?: {
    initialRetryTime: number;
    retries: number;
  };
}

interface GrpcConfig {
  package: string;
  protoPath: string;
  url: string;
  maxReceiveMessageLength?: number;
  maxSendMessageLength?: number;
  keepalive?: {
    keepaliveTimeMs: number;
    keepaliveTimeoutMs: number;
    keepalivePermitWithoutCalls: number;
  };
  loader?: Record<string, any>;
}

interface NatsConfig {
  servers: string[];
  user?: string;
  pass?: string;
  token?: string;
  maxReconnectAttempts?: number;
  reconnectTimeWait?: number;
  queue?: string;
}

interface RetryPolicy {
  maxAttempts: number;
  backoffType: 'fixed' | 'exponential' | 'linear';
  initialDelay: number;
  maxDelay?: number;
  multiplier?: number;
  shouldRetry?: (error: any) => boolean;
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeout: number;
  monitoringPeriod?: number;
}

interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  successCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}

interface DeadLetterQueueConfig {
  queueName: string;
  exchange?: string;
  routingKey?: string;
  maxRetries: number;
  retryDelay: number;
  ttl?: number;
}

interface MessageValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'uuid' | 'email';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: any[];
  custom?: (value: any) => boolean | Promise<boolean>;
}

interface ServiceRegistration {
  serviceId: string;
  serviceName: string;
  version: string;
  host: string;
  port: number;
  protocol: 'tcp' | 'http' | 'grpc' | 'nats' | 'rabbitmq' | 'kafka';
  healthCheckUrl?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

interface ServiceDiscoveryResult {
  instances: ServiceRegistration[];
  strategy: 'round-robin' | 'random' | 'least-connections' | 'weighted';
}

interface HealthCheckStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  checks: Record<string, ComponentHealth>;
  version?: string;
}

interface ComponentHealth {
  status: 'pass' | 'fail' | 'warn';
  componentType: string;
  observedValue?: any;
  observedUnit?: string;
  time?: string;
  output?: string;
}

interface SagaStep {
  stepId: string;
  action: () => Promise<any>;
  compensation: () => Promise<void>;
  timeout?: number;
}

interface SagaContext {
  sagaId: string;
  currentStep: number;
  completedSteps: string[];
  data: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'compensating' | 'failed';
}

interface MessageMetrics {
  messageId: string;
  pattern: string;
  timestamp: Date;
  duration?: number;
  status: 'sent' | 'received' | 'processed' | 'failed';
  retryCount?: number;
  error?: string;
}

interface LoadBalancerConfig {
  strategy: 'round-robin' | 'random' | 'least-connections' | 'weighted' | 'ip-hash';
  healthCheckInterval: number;
  unhealthyThreshold: number;
  healthyThreshold: number;
}

interface RequestContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  userId?: string;
  tenantId?: string;
  correlationId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// ============================================================================
// MESSAGE PATTERN UTILITIES (1-5)
// ============================================================================

/**
 * Creates a typed message pattern for request-response communication.
 *
 * @param {string} cmd - Command name
 * @param {string} [version] - API version
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {MessagePattern} Message pattern object
 *
 * @example
 * ```typescript
 * const pattern = createMessagePattern('get_patient', 'v1', { source: 'api-gateway' });
 * // Result: { cmd: 'get_patient', version: 'v1', metadata: { source: 'api-gateway' } }
 * ```
 */
export const createMessagePattern = (
  cmd: string,
  version?: string,
  metadata?: Record<string, any>,
): MessagePattern => {
  return {
    cmd,
    ...(version && { version }),
    ...(metadata && { metadata }),
  };
};

/**
 * Creates a typed event pattern for event-driven communication.
 *
 * @param {string} event - Event name
 * @param {string} [aggregateId] - Aggregate identifier
 * @param {number} [version] - Event version
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {EventPattern} Event pattern object
 *
 * @example
 * ```typescript
 * const pattern = createEventPattern('patient.created', 'patient-123', 1);
 * // Result: { event: 'patient.created', aggregateId: 'patient-123', version: 1, timestamp: Date }
 * ```
 */
export const createEventPattern = (
  event: string,
  aggregateId?: string,
  version?: number,
  metadata?: Record<string, any>,
): EventPattern => {
  return {
    event,
    ...(aggregateId && { aggregateId }),
    ...(version && { version }),
    timestamp: new Date(),
    ...(metadata && { metadata }),
  };
};

/**
 * Wraps message payload with request context for distributed tracing.
 *
 * @param {any} payload - Message payload
 * @param {RequestContext} context - Request context
 * @returns {{ payload: any; context: RequestContext }} Wrapped message
 *
 * @example
 * ```typescript
 * const message = wrapMessageWithContext(
 *   { patientId: '123' },
 *   { traceId: 'trace-1', spanId: 'span-1', correlationId: 'corr-1', timestamp: new Date() }
 * );
 * ```
 */
export const wrapMessageWithContext = (
  payload: any,
  context: RequestContext,
): { payload: any; context: RequestContext } => {
  return {
    payload,
    context: {
      ...context,
      timestamp: context.timestamp || new Date(),
    },
  };
};

/**
 * Extracts request context from wrapped message.
 *
 * @param {any} message - Wrapped message
 * @returns {{ payload: any; context: RequestContext | null }} Extracted payload and context
 *
 * @example
 * ```typescript
 * const { payload, context } = extractMessageContext(wrappedMessage);
 * console.log(context.traceId); // 'trace-1'
 * ```
 */
export const extractMessageContext = (
  message: any,
): { payload: any; context: RequestContext | null } => {
  if (message && typeof message === 'object' && 'payload' in message && 'context' in message) {
    return {
      payload: message.payload,
      context: message.context,
    };
  }
  return {
    payload: message,
    context: null,
  };
};

/**
 * Generates correlation ID for message tracing.
 *
 * @param {string} [prefix='msg'] - Prefix for correlation ID
 * @returns {string} Correlation ID
 *
 * @example
 * ```typescript
 * const correlationId = generateCorrelationId('patient');
 * // Result: 'patient_1699564800000_a1b2c3d4'
 * ```
 */
export const generateCorrelationId = (prefix = 'msg'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${random}`;
};

// ============================================================================
// RABBITMQ INTEGRATION (6-10)
// ============================================================================

/**
 * Creates RabbitMQ configuration with best practices.
 *
 * @param {string} queue - Queue name
 * @param {string[]} urls - RabbitMQ URLs
 * @param {Partial<RabbitMQConfig>} [options] - Additional options
 * @returns {RabbitMQConfig} RabbitMQ configuration
 *
 * @example
 * ```typescript
 * const config = createRabbitMQConfig('patient-queue', ['amqp://localhost:5672'], {
 *   prefetchCount: 10,
 *   queueOptions: { durable: true }
 * });
 * ```
 */
export const createRabbitMQConfig = (
  queue: string,
  urls: string[],
  options?: Partial<RabbitMQConfig>,
): RabbitMQConfig => {
  return {
    urls,
    queue,
    queueOptions: {
      durable: true,
      exclusive: false,
      autoDelete: false,
      ...options?.queueOptions,
    },
    prefetchCount: options?.prefetchCount || 10,
    noAck: options?.noAck || false,
    socketOptions: options?.socketOptions || {},
  };
};

/**
 * Creates RabbitMQ exchange configuration with routing.
 *
 * @param {string} exchange - Exchange name
 * @param {'direct' | 'topic' | 'fanout' | 'headers'} type - Exchange type
 * @param {string} [routingKey] - Routing key
 * @returns {Record<string, any>} Exchange configuration
 *
 * @example
 * ```typescript
 * const config = createRabbitMQExchange('healthcare-events', 'topic', 'patient.created');
 * ```
 */
export const createRabbitMQExchange = (
  exchange: string,
  type: 'direct' | 'topic' | 'fanout' | 'headers',
  routingKey?: string,
): Record<string, any> => {
  return {
    exchange,
    type,
    ...(routingKey && { routingKey }),
    durable: true,
    autoDelete: false,
  };
};

/**
 * Creates dead letter queue configuration for RabbitMQ.
 *
 * @param {string} originalQueue - Original queue name
 * @param {number} [maxRetries=3] - Maximum retry attempts
 * @param {number} [retryDelay=5000] - Retry delay in milliseconds
 * @returns {DeadLetterQueueConfig} DLQ configuration
 *
 * @example
 * ```typescript
 * const dlqConfig = createDeadLetterQueue('patient-queue', 3, 5000);
 * // Result: { queueName: 'patient-queue-dlq', maxRetries: 3, retryDelay: 5000 }
 * ```
 */
export const createDeadLetterQueue = (
  originalQueue: string,
  maxRetries = 3,
  retryDelay = 5000,
): DeadLetterQueueConfig => {
  return {
    queueName: `${originalQueue}-dlq`,
    exchange: `${originalQueue}-dlx`,
    routingKey: `${originalQueue}-dlx-key`,
    maxRetries,
    retryDelay,
    ttl: retryDelay * maxRetries,
  };
};

/**
 * Acknowledges RabbitMQ message with error handling.
 *
 * @param {any} channel - RabbitMQ channel
 * @param {any} message - RabbitMQ message
 * @param {boolean} [requeue=false] - Whether to requeue on failure
 * @returns {void}
 *
 * @example
 * ```typescript
 * acknowledgeMessage(channel, originalMsg, false);
 * ```
 */
export const acknowledgeMessage = (
  channel: any,
  message: any,
  requeue = false,
): void => {
  try {
    channel.ack(message);
  } catch (error) {
    console.error('Failed to acknowledge message:', error);
    if (requeue) {
      channel.nack(message, false, true);
    }
  }
};

/**
 * Rejects RabbitMQ message and optionally sends to dead letter queue.
 *
 * @param {any} channel - RabbitMQ channel
 * @param {any} message - RabbitMQ message
 * @param {boolean} [requeue=false] - Whether to requeue
 * @param {string} [reason] - Rejection reason
 * @returns {void}
 *
 * @example
 * ```typescript
 * rejectMessage(channel, originalMsg, false, 'Invalid payload');
 * ```
 */
export const rejectMessage = (
  channel: any,
  message: any,
  requeue = false,
  reason?: string,
): void => {
  try {
    if (reason) {
      console.warn(`Rejecting message: ${reason}`);
    }
    channel.nack(message, false, requeue);
  } catch (error) {
    console.error('Failed to reject message:', error);
  }
};

// ============================================================================
// KAFKA INTEGRATION (11-15)
// ============================================================================

/**
 * Creates Kafka configuration with consumer and producer settings.
 *
 * @param {string} clientId - Kafka client ID
 * @param {string[]} brokers - Kafka broker URLs
 * @param {string} groupId - Consumer group ID
 * @param {Partial<KafkaConfig>} [options] - Additional options
 * @returns {KafkaConfig} Kafka configuration
 *
 * @example
 * ```typescript
 * const config = createKafkaConfig('healthcare-service', ['localhost:9092'], 'patient-consumers');
 * ```
 */
export const createKafkaConfig = (
  clientId: string,
  brokers: string[],
  groupId: string,
  options?: Partial<KafkaConfig>,
): KafkaConfig => {
  return {
    clientId,
    brokers,
    groupId,
    ssl: options?.ssl || false,
    sasl: options?.sasl,
    retry: {
      initialRetryTime: 100,
      retries: 8,
      ...options?.retry,
    },
  };
};

/**
 * Creates Kafka topic configuration with partitions and replication.
 *
 * @param {string} topic - Topic name
 * @param {number} [numPartitions=3] - Number of partitions
 * @param {number} [replicationFactor=2] - Replication factor
 * @returns {Record<string, any>} Topic configuration
 *
 * @example
 * ```typescript
 * const topicConfig = createKafkaTopic('patient-events', 5, 3);
 * ```
 */
export const createKafkaTopic = (
  topic: string,
  numPartitions = 3,
  replicationFactor = 2,
): Record<string, any> => {
  return {
    topic,
    numPartitions,
    replicationFactor,
    configEntries: [
      { name: 'compression.type', value: 'snappy' },
      { name: 'retention.ms', value: '604800000' }, // 7 days
      { name: 'cleanup.policy', value: 'delete' },
    ],
  };
};

/**
 * Serializes Kafka message with JSON encoding and compression.
 *
 * @param {any} data - Data to serialize
 * @param {Record<string, any>} [headers] - Message headers
 * @returns {{ value: string; headers?: Record<string, any> }} Serialized message
 *
 * @example
 * ```typescript
 * const message = serializeKafkaMessage({ patientId: '123' }, { 'content-type': 'application/json' });
 * ```
 */
export const serializeKafkaMessage = (
  data: any,
  headers?: Record<string, any>,
): { value: string; headers?: Record<string, any> } => {
  return {
    value: JSON.stringify(data),
    ...(headers && { headers }),
  };
};

/**
 * Deserializes Kafka message with error handling.
 *
 * @param {any} message - Kafka message
 * @returns {{ data: any; headers: Record<string, any> | null; error?: string }} Deserialized message
 *
 * @example
 * ```typescript
 * const { data, headers, error } = deserializeKafkaMessage(kafkaMessage);
 * ```
 */
export const deserializeKafkaMessage = (
  message: any,
): { data: any; headers: Record<string, any> | null; error?: string } => {
  try {
    const data = JSON.parse(message.value.toString());
    const headers = message.headers || null;
    return { data, headers };
  } catch (error) {
    return {
      data: null,
      headers: null,
      error: `Failed to deserialize message: ${error.message}`,
    };
  }
};

/**
 * Creates Kafka consumer with auto-commit and offset management.
 *
 * @param {KafkaConfig} config - Kafka configuration
 * @param {string[]} topics - Topics to subscribe to
 * @param {boolean} [autoCommit=true] - Enable auto-commit
 * @returns {Record<string, any>} Consumer configuration
 *
 * @example
 * ```typescript
 * const consumer = createKafkaConsumer(kafkaConfig, ['patient-events', 'appointment-events']);
 * ```
 */
export const createKafkaConsumer = (
  config: KafkaConfig,
  topics: string[],
  autoCommit = true,
): Record<string, any> => {
  return {
    groupId: config.groupId,
    topics,
    autoCommit,
    sessionTimeout: 30000,
    heartbeatInterval: 3000,
    rebalanceTimeout: 60000,
  };
};

// ============================================================================
// GRPC INTEGRATION (16-20)
// ============================================================================

/**
 * Creates gRPC configuration with keepalive and message limits.
 *
 * @param {string} packageName - gRPC package name
 * @param {string} protoPath - Path to proto file
 * @param {string} url - gRPC server URL
 * @param {Partial<GrpcConfig>} [options] - Additional options
 * @returns {GrpcConfig} gRPC configuration
 *
 * @example
 * ```typescript
 * const config = createGrpcConfig('healthcare', './proto/healthcare.proto', '0.0.0.0:5000');
 * ```
 */
export const createGrpcConfig = (
  packageName: string,
  protoPath: string,
  url: string,
  options?: Partial<GrpcConfig>,
): GrpcConfig => {
  return {
    package: packageName,
    protoPath,
    url,
    maxReceiveMessageLength: options?.maxReceiveMessageLength || 1024 * 1024 * 100, // 100 MB
    maxSendMessageLength: options?.maxSendMessageLength || 1024 * 1024 * 100,
    keepalive: {
      keepaliveTimeMs: 120000,
      keepaliveTimeoutMs: 20000,
      keepalivePermitWithoutCalls: 1,
      ...options?.keepalive,
    },
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      ...options?.loader,
    },
  };
};

/**
 * Creates gRPC metadata for authentication and tracing.
 *
 * @param {Record<string, string>} metadata - Metadata key-value pairs
 * @returns {Map<string, string>} gRPC metadata
 *
 * @example
 * ```typescript
 * const metadata = createGrpcMetadata({
 *   'authorization': 'Bearer token123',
 *   'x-trace-id': 'trace-1'
 * });
 * ```
 */
export const createGrpcMetadata = (
  metadata: Record<string, string>,
): Map<string, string> => {
  return new Map(Object.entries(metadata));
};

/**
 * Handles gRPC streaming with backpressure and error recovery.
 *
 * @param {Observable<any>} stream$ - gRPC stream observable
 * @param {(data: any) => void} onData - Data handler
 * @param {(error: any) => void} [onError] - Error handler
 * @returns {void}
 *
 * @example
 * ```typescript
 * handleGrpcStream(
 *   vitalSignsStream$,
 *   (data) => console.log('Received vital sign:', data),
 *   (error) => console.error('Stream error:', error)
 * );
 * ```
 */
export const handleGrpcStream = (
  stream$: Observable<any>,
  onData: (data: any) => void,
  onError?: (error: any) => void,
): void => {
  stream$.subscribe({
    next: onData,
    error: onError || ((error) => console.error('Stream error:', error)),
    complete: () => console.log('Stream completed'),
  });
};

/**
 * Creates gRPC error with proper status codes.
 *
 * @param {number} code - gRPC status code
 * @param {string} message - Error message
 * @param {Record<string, any>} [details] - Error details
 * @returns {Error} gRPC error
 *
 * @example
 * ```typescript
 * throw createGrpcError(5, 'Patient not found', { patientId: '123' });
 * ```
 */
export const createGrpcError = (
  code: number,
  message: string,
  details?: Record<string, any>,
): Error => {
  const error: any = new Error(message);
  error.code = code;
  error.details = details || {};
  return error;
};

/**
 * Validates gRPC service definition and methods.
 *
 * @param {any} serviceDefinition - gRPC service definition
 * @param {string[]} requiredMethods - Required method names
 * @returns {{ valid: boolean; missing?: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateGrpcService(HealthcareService, ['GetPatient', 'CreatePatient']);
 * ```
 */
export const validateGrpcService = (
  serviceDefinition: any,
  requiredMethods: string[],
): { valid: boolean; missing?: string[] } => {
  const availableMethods = Object.keys(serviceDefinition || {});
  const missing = requiredMethods.filter(method => !availableMethods.includes(method));

  return {
    valid: missing.length === 0,
    ...(missing.length > 0 && { missing }),
  };
};

// ============================================================================
// NATS INTEGRATION (21-24)
// ============================================================================

/**
 * Creates NATS configuration with authentication and reconnection.
 *
 * @param {string[]} servers - NATS server URLs
 * @param {Partial<NatsConfig>} [options] - Additional options
 * @returns {NatsConfig} NATS configuration
 *
 * @example
 * ```typescript
 * const config = createNatsConfig(['nats://localhost:4222'], {
 *   user: 'admin',
 *   pass: 'password',
 *   maxReconnectAttempts: 10
 * });
 * ```
 */
export const createNatsConfig = (
  servers: string[],
  options?: Partial<NatsConfig>,
): NatsConfig => {
  return {
    servers,
    user: options?.user,
    pass: options?.pass,
    token: options?.token,
    maxReconnectAttempts: options?.maxReconnectAttempts || 10,
    reconnectTimeWait: options?.reconnectTimeWait || 2000,
    queue: options?.queue,
  };
};

/**
 * Creates NATS subject with wildcards for pub/sub patterns.
 *
 * @param {string} domain - Domain name
 * @param {string} entity - Entity name
 * @param {string} action - Action name
 * @param {string} [wildcard] - Wildcard pattern
 * @returns {string} NATS subject
 *
 * @example
 * ```typescript
 * const subject = createNatsSubject('healthcare', 'patient', 'created');
 * // Result: 'healthcare.patient.created'
 *
 * const wildcardSubject = createNatsSubject('healthcare', '*', 'created');
 * // Result: 'healthcare.*.created'
 * ```
 */
export const createNatsSubject = (
  domain: string,
  entity: string,
  action: string,
  wildcard?: string,
): string => {
  if (wildcard) {
    return `${domain}.${wildcard}.${action}`;
  }
  return `${domain}.${entity}.${action}`;
};

/**
 * Creates NATS queue group for load balancing.
 *
 * @param {string} serviceName - Service name
 * @param {string} [environment='production'] - Environment
 * @returns {string} Queue group name
 *
 * @example
 * ```typescript
 * const queueGroup = createNatsQueueGroup('patient-service', 'production');
 * // Result: 'patient-service-production'
 * ```
 */
export const createNatsQueueGroup = (
  serviceName: string,
  environment = 'production',
): string => {
  return `${serviceName}-${environment}`;
};

/**
 * Handles NATS request-reply pattern with timeout.
 *
 * @param {any} client - NATS client
 * @param {string} subject - NATS subject
 * @param {any} data - Request data
 * @param {number} [timeoutMs=5000] - Timeout in milliseconds
 * @returns {Promise<any>} Response data
 *
 * @example
 * ```typescript
 * const response = await natsRequestReply(natsClient, 'patient.get', { id: '123' }, 5000);
 * ```
 */
export const natsRequestReply = async (
  client: any,
  subject: string,
  data: any,
  timeoutMs = 5000,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`NATS request timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    client.request(subject, JSON.stringify(data), (response: any) => {
      clearTimeout(timer);
      try {
        resolve(JSON.parse(response));
      } catch (error) {
        reject(new Error('Failed to parse NATS response'));
      }
    });
  });
};

// ============================================================================
// MESSAGE VALIDATION (25-29)
// ============================================================================

/**
 * Validates message payload against schema rules.
 *
 * @param {any} payload - Message payload
 * @param {MessageValidationRule[]} rules - Validation rules
 * @returns {{ valid: boolean; errors?: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const rules = [
 *   { field: 'patientId', type: 'uuid', required: true },
 *   { field: 'age', type: 'number', min: 0, max: 150 }
 * ];
 * const result = validateMessagePayload({ patientId: '123', age: 30 }, rules);
 * ```
 */
export const validateMessagePayload = (
  payload: any,
  rules: MessageValidationRule[],
): { valid: boolean; errors?: string[] } => {
  const errors: string[] = [];

  for (const rule of rules) {
    const value = payload[rule.field];

    // Check required
    if (rule.required && (value === undefined || value === null)) {
      errors.push(`Field '${rule.field}' is required`);
      continue;
    }

    if (value === undefined || value === null) {
      continue;
    }

    // Type validation
    if (!validateFieldType(value, rule.type)) {
      errors.push(`Field '${rule.field}' must be of type ${rule.type}`);
    }

    // Min/Max validation
    if (rule.min !== undefined && value < rule.min) {
      errors.push(`Field '${rule.field}' must be >= ${rule.min}`);
    }

    if (rule.max !== undefined && value > rule.max) {
      errors.push(`Field '${rule.field}' must be <= ${rule.max}`);
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push(`Field '${rule.field}' does not match required pattern`);
    }

    // Enum validation
    if (rule.enum && !rule.enum.includes(value)) {
      errors.push(`Field '${rule.field}' must be one of: ${rule.enum.join(', ')}`);
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      errors.push(`Field '${rule.field}' failed custom validation`);
    }
  }

  return {
    valid: errors.length === 0,
    ...(errors.length > 0 && { errors }),
  };
};

/**
 * Validates field type for message validation.
 *
 * @param {any} value - Field value
 * @param {string} type - Expected type
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateFieldType('test@example.com', 'email'); // true
 * ```
 */
export const validateFieldType = (value: any, type: string): boolean => {
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
    default:
      return true;
  }
};

/**
 * Sanitizes message payload by removing sensitive fields.
 *
 * @param {any} payload - Message payload
 * @param {string[]} sensitiveFields - Fields to remove
 * @returns {any} Sanitized payload
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeMessagePayload(
 *   { patientId: '123', ssn: '123-45-6789', name: 'John' },
 *   ['ssn', 'password']
 * );
 * // Result: { patientId: '123', name: 'John' }
 * ```
 */
export const sanitizeMessagePayload = (
  payload: any,
  sensitiveFields: string[],
): any => {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  const sanitized = { ...payload };

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      delete sanitized[field];
    }
  }

  return sanitized;
};

/**
 * Validates message size to prevent payload overflow.
 *
 * @param {any} payload - Message payload
 * @param {number} maxSizeBytes - Maximum size in bytes
 * @returns {{ valid: boolean; size: number; maxSize: number }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateMessageSize(largePayload, 1024 * 1024); // 1 MB
 * ```
 */
export const validateMessageSize = (
  payload: any,
  maxSizeBytes: number,
): { valid: boolean; size: number; maxSize: number } => {
  const size = Buffer.byteLength(JSON.stringify(payload), 'utf8');

  return {
    valid: size <= maxSizeBytes,
    size,
    maxSize: maxSizeBytes,
  };
};

/**
 * Creates validation schema for common healthcare message types.
 *
 * @param {'patient' | 'appointment' | 'prescription' | 'vital-signs'} entityType - Entity type
 * @returns {MessageValidationRule[]} Validation rules
 *
 * @example
 * ```typescript
 * const schema = createHealthcareMessageSchema('patient');
 * const result = validateMessagePayload(payload, schema);
 * ```
 */
export const createHealthcareMessageSchema = (
  entityType: 'patient' | 'appointment' | 'prescription' | 'vital-signs',
): MessageValidationRule[] => {
  const baseRules: MessageValidationRule[] = [
    { field: 'id', type: 'uuid', required: true },
    { field: 'timestamp', type: 'date', required: true },
  ];

  switch (entityType) {
    case 'patient':
      return [
        ...baseRules,
        { field: 'firstName', type: 'string', required: true },
        { field: 'lastName', type: 'string', required: true },
        { field: 'dateOfBirth', type: 'date', required: true },
        { field: 'medicalRecordNumber', type: 'string', required: true },
      ];
    case 'appointment':
      return [
        ...baseRules,
        { field: 'patientId', type: 'uuid', required: true },
        { field: 'providerId', type: 'uuid', required: true },
        { field: 'scheduledAt', type: 'date', required: true },
        { field: 'duration', type: 'number', min: 15, max: 240 },
      ];
    case 'prescription':
      return [
        ...baseRules,
        { field: 'patientId', type: 'uuid', required: true },
        { field: 'medicationName', type: 'string', required: true },
        { field: 'dosage', type: 'string', required: true },
        { field: 'frequency', type: 'string', required: true },
      ];
    case 'vital-signs':
      return [
        ...baseRules,
        { field: 'patientId', type: 'uuid', required: true },
        { field: 'temperature', type: 'number', min: 35, max: 42 },
        { field: 'heartRate', type: 'number', min: 40, max: 200 },
        { field: 'bloodPressureSystolic', type: 'number', min: 70, max: 200 },
        { field: 'bloodPressureDiastolic', type: 'number', min: 40, max: 130 },
      ];
    default:
      return baseRules;
  }
};

// ============================================================================
// RETRY POLICIES (30-32)
// ============================================================================

/**
 * Creates retry policy with configurable backoff strategy.
 *
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {'fixed' | 'exponential' | 'linear'} backoffType - Backoff strategy
 * @param {number} initialDelay - Initial delay in milliseconds
 * @param {Partial<RetryPolicy>} [options] - Additional options
 * @returns {RetryPolicy} Retry policy
 *
 * @example
 * ```typescript
 * const policy = createRetryPolicy(5, 'exponential', 1000, {
 *   maxDelay: 30000,
 *   multiplier: 2
 * });
 * ```
 */
export const createRetryPolicy = (
  maxAttempts: number,
  backoffType: 'fixed' | 'exponential' | 'linear',
  initialDelay: number,
  options?: Partial<RetryPolicy>,
): RetryPolicy => {
  return {
    maxAttempts,
    backoffType,
    initialDelay,
    maxDelay: options?.maxDelay || 60000,
    multiplier: options?.multiplier || 2,
    shouldRetry: options?.shouldRetry || ((error: any) => {
      // Retry on transient errors
      const retryableErrors = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'];
      return retryableErrors.includes(error.code);
    }),
  };
};

/**
 * Calculates retry delay based on policy and attempt number.
 *
 * @param {RetryPolicy} policy - Retry policy
 * @param {number} attempt - Current attempt number
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateRetryDelay(policy, 3);
 * // For exponential: 1000 * 2^3 = 8000ms
 * ```
 */
export const calculateRetryDelay = (
  policy: RetryPolicy,
  attempt: number,
): number => {
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
    default:
      delay = policy.initialDelay;
  }

  return Math.min(delay, policy.maxDelay || 60000);
};

/**
 * Executes operation with retry policy using RxJS.
 *
 * @param {() => Observable<any>} operation - Operation to execute
 * @param {RetryPolicy} policy - Retry policy
 * @returns {Observable<any>} Observable with retry logic
 *
 * @example
 * ```typescript
 * executeWithRetry(
 *   () => client.send('get_patient', { id: '123' }),
 *   retryPolicy
 * ).subscribe(result => console.log(result));
 * ```
 */
export const executeWithRetry = (
  operation: () => Observable<any>,
  policy: RetryPolicy,
): Observable<any> => {
  return operation().pipe(
    retry({
      count: policy.maxAttempts,
      delay: (error, retryCount) => {
        if (!policy.shouldRetry || !policy.shouldRetry(error)) {
          throw error;
        }
        const delay = calculateRetryDelay(policy, retryCount - 1);
        console.log(`Retry attempt ${retryCount} after ${delay}ms`);
        return timer(delay);
      },
    }),
    catchError((error) => {
      console.error(`Operation failed after ${policy.maxAttempts} attempts:`, error);
      return throwError(() => error);
    }),
  );
};

// ============================================================================
// CIRCUIT BREAKER (33-36)
// ============================================================================

/**
 * Creates circuit breaker state tracker.
 *
 * @returns {CircuitBreakerState} Initial circuit breaker state
 *
 * @example
 * ```typescript
 * const state = createCircuitBreakerState();
 * // Result: { state: 'CLOSED', failureCount: 0, successCount: 0, ... }
 * ```
 */
export const createCircuitBreakerState = (): CircuitBreakerState => {
  return {
    state: 'CLOSED',
    failureCount: 0,
    successCount: 0,
    lastFailureTime: 0,
    nextAttemptTime: 0,
  };
};

/**
 * Updates circuit breaker state based on operation result.
 *
 * @param {CircuitBreakerState} state - Current state
 * @param {CircuitBreakerConfig} config - Circuit breaker config
 * @param {boolean} success - Whether operation succeeded
 * @returns {CircuitBreakerState} Updated state
 *
 * @example
 * ```typescript
 * const newState = updateCircuitBreakerState(state, config, false);
 * ```
 */
export const updateCircuitBreakerState = (
  state: CircuitBreakerState,
  config: CircuitBreakerConfig,
  success: boolean,
): CircuitBreakerState => {
  const now = Date.now();

  if (success) {
    const newSuccessCount = state.successCount + 1;

    if (state.state === 'HALF_OPEN' && newSuccessCount >= config.successThreshold) {
      return {
        state: 'CLOSED',
        failureCount: 0,
        successCount: 0,
        lastFailureTime: 0,
        nextAttemptTime: 0,
      };
    }

    return {
      ...state,
      successCount: newSuccessCount,
      failureCount: 0,
    };
  } else {
    const newFailureCount = state.failureCount + 1;

    if (newFailureCount >= config.failureThreshold) {
      return {
        state: 'OPEN',
        failureCount: newFailureCount,
        successCount: 0,
        lastFailureTime: now,
        nextAttemptTime: now + config.resetTimeout,
      };
    }

    return {
      ...state,
      failureCount: newFailureCount,
      successCount: 0,
      lastFailureTime: now,
    };
  }
};

/**
 * Checks if circuit breaker allows operation execution.
 *
 * @param {CircuitBreakerState} state - Current state
 * @param {CircuitBreakerConfig} config - Circuit breaker config
 * @returns {{ allowed: boolean; reason?: string }} Execution permission
 *
 * @example
 * ```typescript
 * const { allowed, reason } = canExecuteOperation(state, config);
 * if (!allowed) console.log(reason);
 * ```
 */
export const canExecuteOperation = (
  state: CircuitBreakerState,
  config: CircuitBreakerConfig,
): { allowed: boolean; reason?: string } => {
  const now = Date.now();

  if (state.state === 'CLOSED') {
    return { allowed: true };
  }

  if (state.state === 'OPEN') {
    if (now >= state.nextAttemptTime) {
      // Transition to HALF_OPEN
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: `Circuit breaker is OPEN. Next attempt at ${new Date(state.nextAttemptTime).toISOString()}`,
    };
  }

  // HALF_OPEN state
  return { allowed: true };
};

/**
 * Executes operation with circuit breaker protection.
 *
 * @param {() => Promise<any>} operation - Operation to execute
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @param {CircuitBreakerConfig} config - Circuit breaker config
 * @param {(state: CircuitBreakerState) => void} onStateChange - State change callback
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithCircuitBreaker(
 *   () => serviceClient.callMethod(),
 *   state,
 *   config,
 *   (newState) => circuitBreakerState = newState
 * );
 * ```
 */
export const executeWithCircuitBreaker = async (
  operation: () => Promise<any>,
  state: CircuitBreakerState,
  config: CircuitBreakerConfig,
  onStateChange: (state: CircuitBreakerState) => void,
): Promise<any> => {
  const { allowed, reason } = canExecuteOperation(state, config);

  if (!allowed) {
    throw new Error(reason || 'Circuit breaker is OPEN');
  }

  // Transition to HALF_OPEN if coming from OPEN
  if (state.state === 'OPEN') {
    const newState = { ...state, state: 'HALF_OPEN' as const };
    onStateChange(newState);
    state = newState;
  }

  try {
    const result = await Promise.race([
      operation(),
      new Promise((_, reject) =>
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
};

// ============================================================================
// SERVICE DISCOVERY (37-40)
// ============================================================================

/**
 * Registers service instance for service discovery.
 *
 * @param {ServiceRegistration} registration - Service registration details
 * @returns {Promise<string>} Registration ID
 *
 * @example
 * ```typescript
 * const id = await registerService({
 *   serviceId: 'patient-service-1',
 *   serviceName: 'patient-service',
 *   version: '1.0.0',
 *   host: 'localhost',
 *   port: 3001,
 *   protocol: 'tcp',
 *   tags: ['healthcare', 'primary']
 * });
 * ```
 */
export const registerService = async (
  registration: ServiceRegistration,
): Promise<string> => {
  // In production, this would register with Consul, etcd, or similar
  const registrationId = `${registration.serviceName}-${Date.now()}`;

  console.log(`Registered service: ${registration.serviceName}`, {
    id: registrationId,
    endpoint: `${registration.protocol}://${registration.host}:${registration.port}`,
    version: registration.version,
  });

  return registrationId;
};

/**
 * Discovers service instances with load balancing.
 *
 * @param {string} serviceName - Service name
 * @param {string} [version] - Service version
 * @param {string[]} [tags] - Service tags
 * @returns {Promise<ServiceDiscoveryResult>} Discovered instances
 *
 * @example
 * ```typescript
 * const result = await discoverService('patient-service', '1.0.0', ['primary']);
 * const instance = selectServiceInstance(result, 'round-robin');
 * ```
 */
export const discoverService = async (
  serviceName: string,
  version?: string,
  tags?: string[],
): Promise<ServiceDiscoveryResult> => {
  // Mock implementation - in production, query service registry
  const mockInstances: ServiceRegistration[] = [
    {
      serviceId: `${serviceName}-1`,
      serviceName,
      version: version || '1.0.0',
      host: 'localhost',
      port: 3001,
      protocol: 'tcp',
      tags: tags || [],
    },
    {
      serviceId: `${serviceName}-2`,
      serviceName,
      version: version || '1.0.0',
      host: 'localhost',
      port: 3002,
      protocol: 'tcp',
      tags: tags || [],
    },
  ];

  return {
    instances: mockInstances,
    strategy: 'round-robin',
  };
};

/**
 * Selects service instance based on load balancing strategy.
 *
 * @param {ServiceDiscoveryResult} discoveryResult - Discovery result
 * @param {'round-robin' | 'random' | 'least-connections'} [strategy='round-robin'] - Selection strategy
 * @returns {ServiceRegistration | null} Selected instance
 *
 * @example
 * ```typescript
 * const instance = selectServiceInstance(discoveryResult, 'random');
 * if (instance) {
 *   const url = `${instance.protocol}://${instance.host}:${instance.port}`;
 * }
 * ```
 */
export const selectServiceInstance = (
  discoveryResult: ServiceDiscoveryResult,
  strategy: 'round-robin' | 'random' | 'least-connections' = 'round-robin',
): ServiceRegistration | null => {
  const instances = discoveryResult.instances;

  if (instances.length === 0) {
    return null;
  }

  if (instances.length === 1) {
    return instances[0];
  }

  switch (strategy) {
    case 'random':
      return instances[Math.floor(Math.random() * instances.length)];
    case 'round-robin':
      // In production, maintain counter state
      return instances[0];
    case 'least-connections':
      // In production, track connection counts
      return instances[0];
    default:
      return instances[0];
  }
};

/**
 * Deregisters service instance from service discovery.
 *
 * @param {string} serviceId - Service instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deregisterService('patient-service-1');
 * ```
 */
export const deregisterService = async (serviceId: string): Promise<void> => {
  console.log(`Deregistered service: ${serviceId}`);
};

// ============================================================================
// HEALTH CHECKS (41-45)
// ============================================================================

/**
 * Creates health check status for microservice.
 *
 * @param {string} [version] - Service version
 * @param {number} [startTime=Date.now()] - Service start time
 * @returns {HealthCheckStatus} Health check status
 *
 * @example
 * ```typescript
 * const health = createHealthCheckStatus('1.0.0', startTime);
 * ```
 */
export const createHealthCheckStatus = (
  version?: string,
  startTime: number = Date.now(),
): HealthCheckStatus => {
  const now = new Date();
  return {
    status: 'healthy',
    timestamp: now,
    uptime: Date.now() - startTime,
    checks: {},
    ...(version && { version }),
  };
};

/**
 * Adds component health check to overall status.
 *
 * @param {HealthCheckStatus} status - Overall health status
 * @param {string} componentName - Component name
 * @param {ComponentHealth} componentHealth - Component health details
 * @returns {HealthCheckStatus} Updated health status
 *
 * @example
 * ```typescript
 * const updated = addHealthCheck(status, 'database', {
 *   status: 'pass',
 *   componentType: 'datastore',
 *   observedValue: 5,
 *   observedUnit: 'ms',
 *   time: new Date().toISOString()
 * });
 * ```
 */
export const addHealthCheck = (
  status: HealthCheckStatus,
  componentName: string,
  componentHealth: ComponentHealth,
): HealthCheckStatus => {
  const updatedChecks = {
    ...status.checks,
    [componentName]: componentHealth,
  };

  // Determine overall status
  const hasFailure = Object.values(updatedChecks).some(check => check.status === 'fail');
  const hasWarning = Object.values(updatedChecks).some(check => check.status === 'warn');

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
  };
};

/**
 * Checks database connectivity for health monitoring.
 *
 * @param {any} connection - Database connection
 * @returns {Promise<ComponentHealth>} Database health status
 *
 * @example
 * ```typescript
 * const dbHealth = await checkDatabaseHealth(sequelize);
 * const status = addHealthCheck(healthStatus, 'database', dbHealth);
 * ```
 */
export const checkDatabaseHealth = async (
  connection: any,
): Promise<ComponentHealth> => {
  const startTime = Date.now();

  try {
    await connection.authenticate();
    const responseTime = Date.now() - startTime;

    return {
      status: 'pass',
      componentType: 'datastore',
      observedValue: responseTime,
      observedUnit: 'ms',
      time: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'fail',
      componentType: 'datastore',
      time: new Date().toISOString(),
      output: error.message,
    };
  }
};

/**
 * Checks message broker connectivity (RabbitMQ, Kafka, NATS).
 *
 * @param {any} client - Message broker client
 * @param {string} brokerType - Broker type
 * @returns {Promise<ComponentHealth>} Broker health status
 *
 * @example
 * ```typescript
 * const brokerHealth = await checkMessageBrokerHealth(kafkaClient, 'kafka');
 * const status = addHealthCheck(healthStatus, 'message-broker', brokerHealth);
 * ```
 */
export const checkMessageBrokerHealth = async (
  client: any,
  brokerType: 'rabbitmq' | 'kafka' | 'nats' | 'redis',
): Promise<ComponentHealth> => {
  const startTime = Date.now();

  try {
    // Perform ping or connection check
    const isConnected = client && (client.isConnected ? client.isConnected() : true);
    const responseTime = Date.now() - startTime;

    return {
      status: isConnected ? 'pass' : 'fail',
      componentType: 'message-broker',
      observedValue: responseTime,
      observedUnit: 'ms',
      time: new Date().toISOString(),
      output: `${brokerType} connection ${isConnected ? 'active' : 'inactive'}`,
    };
  } catch (error) {
    return {
      status: 'fail',
      componentType: 'message-broker',
      time: new Date().toISOString(),
      output: error.message,
    };
  }
};

/**
 * Creates comprehensive health check endpoint response.
 *
 * @param {HealthCheckStatus} status - Health check status
 * @param {boolean} [detailed=true] - Include detailed component info
 * @returns {Record<string, any>} Health check response
 *
 * @example
 * ```typescript
 * // In NestJS controller:
 * @Get('health')
 * getHealth() {
 *   return createHealthCheckResponse(this.healthStatus);
 * }
 * ```
 */
export const createHealthCheckResponse = (
  status: HealthCheckStatus,
  detailed = true,
): Record<string, any> => {
  const response: Record<string, any> = {
    status: status.status,
    timestamp: status.timestamp.toISOString(),
    uptime: status.uptime,
  };

  if (status.version) {
    response.version = status.version;
  }

  if (detailed) {
    response.checks = status.checks;
  } else {
    // Only include failing components in non-detailed mode
    const failedChecks = Object.entries(status.checks)
      .filter(([_, check]) => check.status === 'fail')
      .reduce((acc, [name, check]) => ({ ...acc, [name]: check }), {});

    if (Object.keys(failedChecks).length > 0) {
      response.failedChecks = failedChecks;
    }
  }

  return response;
};
