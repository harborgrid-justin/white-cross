/**
 * LOC: 9F1E847C3D
 * File: /reuse/nest-microservices-utils.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/microservices
 *   - @nestjs/common
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Microservice implementations
 *   - Service orchestrators
 *   - Message handlers
 */

/**
 * File: /reuse/nest-microservices-utils.ts
 * Locator: WC-UTL-MICRO-001
 * Purpose: NestJS Microservices Architecture Utilities - Transport, messaging, and distributed patterns
 *
 * Upstream: @nestjs/microservices, rxjs, @nestjs/common
 * Downstream: Healthcare microservices, event-driven architecture, service orchestration
 * Dependencies: NestJS v11.x, TypeScript 5.x, Node 18+
 * Exports: 45+ microservices utilities for transport layers, message patterns, circuit breakers, sagas
 *
 * LLM Context: Comprehensive NestJS microservices utilities for White Cross healthcare platform.
 * Provides transport layer helpers (TCP, Redis, NATS, RabbitMQ, Kafka, gRPC), message patterns,
 * circuit breakers, service discovery, load balancing, health checks, distributed tracing,
 * retry/timeout strategies, dead letter queues, and saga pattern implementations.
 * Critical for building scalable, resilient HIPAA-compliant microservices architecture.
 */

import {
  Transport,
  ClientProxy,
  ClientProxyFactory,
  MicroserviceOptions,
  RpcException,
} from '@nestjs/microservices';
import { Logger, Type } from '@nestjs/common';
import {
  Observable,
  throwError,
  retry,
  timeout,
  catchError,
  of,
  firstValueFrom,
  lastValueFrom,
  defer,
  timer,
  Subject,
} from 'rxjs';
import { join } from 'path';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Transport configuration types for different message brokers
 */
export interface TcpTransportConfig {
  host: string;
  port: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface RedisTransportConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  retryAttempts?: number;
  retryDelay?: number;
  wildcards?: boolean;
}

export interface NatsTransportConfig {
  servers: string[];
  user?: string;
  pass?: string;
  token?: string;
  maxReconnectAttempts?: number;
  reconnectTimeWait?: number;
  queue?: string;
}

export interface RabbitMQTransportConfig {
  urls: string[];
  queue: string;
  queueOptions?: {
    durable?: boolean;
    arguments?: Record<string, any>;
  };
  prefetchCount?: number;
  noAck?: boolean;
  persistent?: boolean;
}

export interface KafkaTransportConfig {
  clientId: string;
  brokers: string[];
  groupId: string;
  ssl?: boolean;
  sasl?: {
    mechanism: string;
    username: string;
    password: string;
  };
  allowAutoTopicCreation?: boolean;
}

export interface GrpcTransportConfig {
  package: string;
  protoPath: string;
  url: string;
  maxReceiveMessageLength?: number;
  maxSendMessageLength?: number;
  keepalive?: {
    keepaliveTimeMs?: number;
    keepaliveTimeoutMs?: number;
    keepalivePermitWithoutCalls?: number;
  };
  loader?: {
    keepCase?: boolean;
    longs?: any;
    enums?: any;
    defaults?: boolean;
    oneofs?: boolean;
  };
}

export interface MqttTransportConfig {
  url: string;
  username?: string;
  password?: string;
  clientId?: string;
  clean?: boolean;
  keepalive?: number;
  reconnectPeriod?: number;
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold?: number;
  successThreshold?: number;
  timeout?: number;
  resetTimeout?: number;
}

/**
 * Circuit breaker states
 */
export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

/**
 * Retry configuration for message patterns
 */
export interface RetryConfig {
  maxAttempts?: number;
  delay?: number;
  backoff?: 'linear' | 'exponential';
  maxDelay?: number;
}

/**
 * Timeout configuration
 */
export interface TimeoutConfig {
  duration: number;
  fallbackValue?: any;
}

/**
 * Service discovery entry
 */
export interface ServiceInstance {
  id: string;
  name: string;
  host: string;
  port: number;
  transport: Transport;
  metadata?: Record<string, any>;
  healthCheckUrl?: string;
  lastHeartbeat?: Date;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'up' | 'down' | 'degraded';
  timestamp: Date;
  service: string;
  details?: Record<string, any>;
}

/**
 * Saga step definition
 */
export interface SagaStep {
  name: string;
  execute: () => Promise<any>;
  compensate: (error?: any) => Promise<void>;
}

/**
 * Dead letter queue message
 */
export interface DLQMessage {
  originalMessage: any;
  error: string;
  timestamp: Date;
  retryCount: number;
  pattern?: string;
}

/**
 * Message metadata for distributed tracing
 */
export interface MessageMetadata {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  timestamp: Date;
  service: string;
  pattern?: string;
  correlationId?: string;
}

// ============================================================================
// TRANSPORT LAYER HELPERS
// ============================================================================

/**
 * Creates a TCP transport configuration for NestJS microservices.
 *
 * @param {TcpTransportConfig} config - TCP transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for TCP transport
 *
 * @example
 * ```typescript
 * const tcpConfig = createTcpTransport({
 *   host: '0.0.0.0',
 *   port: 3001,
 *   retryAttempts: 5,
 *   retryDelay: 3000,
 * });
 * const app = await NestFactory.createMicroservice(AppModule, tcpConfig);
 * ```
 */
export function createTcpTransport(
  config: TcpTransportConfig,
): MicroserviceOptions {
  return {
    transport: Transport.TCP,
    options: {
      host: config.host,
      port: config.port,
      retryAttempts: config.retryAttempts ?? 5,
      retryDelay: config.retryDelay ?? 3000,
    },
  };
}

/**
 * Creates a Redis pub/sub transport configuration for NestJS microservices.
 *
 * @param {RedisTransportConfig} config - Redis transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for Redis transport
 *
 * @example
 * ```typescript
 * const redisConfig = createRedisTransport({
 *   host: 'localhost',
 *   port: 6379,
 *   password: 'secret',
 *   wildcards: true,
 * });
 * const app = await NestFactory.createMicroservice(AppModule, redisConfig);
 * ```
 */
export function createRedisTransport(
  config: RedisTransportConfig,
): MicroserviceOptions {
  return {
    transport: Transport.REDIS,
    options: {
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db ?? 0,
      retryAttempts: config.retryAttempts ?? 5,
      retryDelay: config.retryDelay ?? 3000,
      wildcards: config.wildcards ?? false,
    },
  };
}

/**
 * Creates a NATS transport configuration for NestJS microservices.
 *
 * @param {NatsTransportConfig} config - NATS transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for NATS transport
 *
 * @example
 * ```typescript
 * const natsConfig = createNatsTransport({
 *   servers: ['nats://localhost:4222'],
 *   queue: 'healthcare-queue',
 *   maxReconnectAttempts: 10,
 * });
 * const app = await NestFactory.createMicroservice(AppModule, natsConfig);
 * ```
 */
export function createNatsTransport(
  config: NatsTransportConfig,
): MicroserviceOptions {
  return {
    transport: Transport.NATS,
    options: {
      servers: config.servers,
      user: config.user,
      pass: config.pass,
      token: config.token,
      maxReconnectAttempts: config.maxReconnectAttempts ?? 10,
      reconnectTimeWait: config.reconnectTimeWait ?? 2000,
      queue: config.queue,
    },
  };
}

/**
 * Creates a RabbitMQ transport configuration for NestJS microservices.
 *
 * @param {RabbitMQTransportConfig} config - RabbitMQ transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for RabbitMQ transport
 *
 * @example
 * ```typescript
 * const rabbitConfig = createRabbitMQTransport({
 *   urls: ['amqp://localhost:5672'],
 *   queue: 'orders_queue',
 *   queueOptions: { durable: true },
 *   prefetchCount: 10,
 * });
 * const app = await NestFactory.createMicroservice(AppModule, rabbitConfig);
 * ```
 */
export function createRabbitMQTransport(
  config: RabbitMQTransportConfig,
): MicroserviceOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: config.urls,
      queue: config.queue,
      queueOptions: config.queueOptions ?? { durable: true },
      prefetchCount: config.prefetchCount ?? 1,
      noAck: config.noAck ?? false,
      persistent: config.persistent ?? true,
    },
  };
}

/**
 * Creates a Kafka transport configuration for NestJS microservices.
 *
 * @param {KafkaTransportConfig} config - Kafka transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for Kafka transport
 *
 * @example
 * ```typescript
 * const kafkaConfig = createKafkaTransport({
 *   clientId: 'healthcare-service',
 *   brokers: ['localhost:9092'],
 *   groupId: 'healthcare-consumer-group',
 *   allowAutoTopicCreation: true,
 * });
 * const app = await NestFactory.createMicroservice(AppModule, kafkaConfig);
 * ```
 */
export function createKafkaTransport(
  config: KafkaTransportConfig,
): MicroserviceOptions {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.clientId,
        brokers: config.brokers,
        ssl: config.ssl,
        sasl: config.sasl,
      },
      consumer: {
        groupId: config.groupId,
        allowAutoTopicCreation: config.allowAutoTopicCreation ?? true,
        retry: {
          initialRetryTime: 100,
          retries: 8,
        },
      },
      producer: {
        allowAutoTopicCreation: config.allowAutoTopicCreation ?? true,
        retry: {
          initialRetryTime: 100,
          retries: 8,
        },
      },
    },
  };
}

/**
 * Creates a gRPC transport configuration for NestJS microservices.
 *
 * @param {GrpcTransportConfig} config - gRPC transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for gRPC transport
 *
 * @example
 * ```typescript
 * const grpcConfig = createGrpcTransport({
 *   package: 'healthcare',
 *   protoPath: join(__dirname, '../proto/healthcare.proto'),
 *   url: '0.0.0.0:5000',
 * });
 * const app = await NestFactory.createMicroservice(AppModule, grpcConfig);
 * ```
 */
export function createGrpcTransport(
  config: GrpcTransportConfig,
): MicroserviceOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: config.package,
      protoPath: config.protoPath,
      url: config.url,
      maxReceiveMessageLength: config.maxReceiveMessageLength ?? 1024 * 1024 * 100,
      maxSendMessageLength: config.maxSendMessageLength ?? 1024 * 1024 * 100,
      keepalive: config.keepalive ?? {
        keepaliveTimeMs: 120000,
        keepaliveTimeoutMs: 20000,
        keepalivePermitWithoutCalls: 1,
      },
      loader: config.loader ?? {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    },
  };
}

/**
 * Creates an MQTT transport configuration for NestJS microservices.
 *
 * @param {MqttTransportConfig} config - MQTT transport configuration options
 * @returns {MicroserviceOptions} NestJS microservice options for MQTT transport
 *
 * @example
 * ```typescript
 * const mqttConfig = createMqttTransport({
 *   url: 'mqtt://localhost:1883',
 *   clientId: 'healthcare-iot',
 *   clean: true,
 * });
 * const app = await NestFactory.createMicroservice(AppModule, mqttConfig);
 * ```
 */
export function createMqttTransport(
  config: MqttTransportConfig,
): MicroserviceOptions {
  return {
    transport: Transport.MQTT,
    options: {
      url: config.url,
      username: config.username,
      password: config.password,
      clientId: config.clientId,
      clean: config.clean ?? true,
      keepalive: config.keepalive ?? 60,
      reconnectPeriod: config.reconnectPeriod ?? 1000,
    },
  };
}

// ============================================================================
// CLIENT PROXY FACTORIES
// ============================================================================

/**
 * Creates a TCP client proxy for communicating with microservices.
 *
 * @param {TcpTransportConfig} config - TCP client configuration
 * @returns {ClientProxy} NestJS client proxy for TCP communication
 *
 * @example
 * ```typescript
 * const client = createTcpClient({ host: 'localhost', port: 3001 });
 * await client.connect();
 * const result = await firstValueFrom(client.send('get_user', { id: '123' }));
 * ```
 */
export function createTcpClient(config: TcpTransportConfig): ClientProxy {
  return ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: config.host,
      port: config.port,
      retryAttempts: config.retryAttempts ?? 5,
      retryDelay: config.retryDelay ?? 3000,
    },
  });
}

/**
 * Creates a Redis client proxy for pub/sub communication.
 *
 * @param {RedisTransportConfig} config - Redis client configuration
 * @returns {ClientProxy} NestJS client proxy for Redis communication
 *
 * @example
 * ```typescript
 * const client = createRedisClient({ host: 'localhost', port: 6379 });
 * await client.connect();
 * client.emit('user_created', { id: '123', name: 'John' });
 * ```
 */
export function createRedisClient(config: RedisTransportConfig): ClientProxy {
  return ClientProxyFactory.create({
    transport: Transport.REDIS,
    options: {
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db ?? 0,
      retryAttempts: config.retryAttempts ?? 5,
      retryDelay: config.retryDelay ?? 3000,
    },
  });
}

/**
 * Creates a NATS client proxy for messaging.
 *
 * @param {NatsTransportConfig} config - NATS client configuration
 * @returns {ClientProxy} NestJS client proxy for NATS communication
 *
 * @example
 * ```typescript
 * const client = createNatsClient({ servers: ['nats://localhost:4222'] });
 * await client.connect();
 * const result = await firstValueFrom(client.send('process_order', orderData));
 * ```
 */
export function createNatsClient(config: NatsTransportConfig): ClientProxy {
  return ClientProxyFactory.create({
    transport: Transport.NATS,
    options: {
      servers: config.servers,
      user: config.user,
      pass: config.pass,
      maxReconnectAttempts: config.maxReconnectAttempts ?? 10,
      reconnectTimeWait: config.reconnectTimeWait ?? 2000,
    },
  });
}

/**
 * Creates a RabbitMQ client proxy for AMQP messaging.
 *
 * @param {RabbitMQTransportConfig} config - RabbitMQ client configuration
 * @returns {ClientProxy} NestJS client proxy for RabbitMQ communication
 *
 * @example
 * ```typescript
 * const client = createRabbitMQClient({
 *   urls: ['amqp://localhost:5672'],
 *   queue: 'tasks_queue',
 * });
 * await client.connect();
 * ```
 */
export function createRabbitMQClient(
  config: RabbitMQTransportConfig,
): ClientProxy {
  return ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: config.urls,
      queue: config.queue,
      queueOptions: config.queueOptions ?? { durable: true },
    },
  });
}

/**
 * Creates a Kafka client proxy for event streaming.
 *
 * @param {KafkaTransportConfig} config - Kafka client configuration
 * @returns {ClientProxy} NestJS client proxy for Kafka communication
 *
 * @example
 * ```typescript
 * const client = createKafkaClient({
 *   clientId: 'notification-service',
 *   brokers: ['localhost:9092'],
 *   groupId: 'notification-group',
 * });
 * await client.connect();
 * ```
 */
export function createKafkaClient(config: KafkaTransportConfig): ClientProxy {
  return ClientProxyFactory.create({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.clientId,
        brokers: config.brokers,
        ssl: config.ssl,
        sasl: config.sasl,
      },
      consumer: {
        groupId: config.groupId,
      },
    },
  });
}

// ============================================================================
// MESSAGE PATTERN UTILITIES
// ============================================================================

/**
 * Sends a request-response message with timeout and error handling.
 *
 * @template T - Expected response type
 * @param {ClientProxy} client - NestJS client proxy
 * @param {string} pattern - Message pattern identifier
 * @param {any} data - Request payload
 * @param {TimeoutConfig} [timeoutConfig] - Optional timeout configuration
 * @returns {Promise<T>} Response from microservice
 *
 * @example
 * ```typescript
 * const user = await sendWithTimeout<User>(
 *   client,
 *   'get_user',
 *   { id: '123' },
 *   { duration: 5000 }
 * );
 * ```
 */
export async function sendWithTimeout<T>(
  client: ClientProxy,
  pattern: string,
  data: any,
  timeoutConfig?: TimeoutConfig,
): Promise<T> {
  const timeoutDuration = timeoutConfig?.duration ?? 5000;

  try {
    return await firstValueFrom(
      client.send<T>(pattern, data).pipe(
        timeout(timeoutDuration),
        catchError((error) => {
          if (error.name === 'TimeoutError') {
            return timeoutConfig?.fallbackValue !== undefined
              ? of(timeoutConfig.fallbackValue)
              : throwError(
                  () =>
                    new RpcException(
                      `Request timeout after ${timeoutDuration}ms`,
                    ),
                );
          }
          return throwError(() => error);
        }),
      ),
    );
  } catch (error) {
    throw new RpcException(
      `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Sends a request with automatic retry logic on failure.
 *
 * @template T - Expected response type
 * @param {ClientProxy} client - NestJS client proxy
 * @param {string} pattern - Message pattern identifier
 * @param {any} data - Request payload
 * @param {RetryConfig} [retryConfig] - Retry configuration
 * @returns {Promise<T>} Response from microservice
 *
 * @example
 * ```typescript
 * const order = await sendWithRetry<Order>(
 *   client,
 *   'process_order',
 *   orderData,
 *   { maxAttempts: 3, delay: 1000, backoff: 'exponential' }
 * );
 * ```
 */
export async function sendWithRetry<T>(
  client: ClientProxy,
  pattern: string,
  data: any,
  retryConfig?: RetryConfig,
): Promise<T> {
  const maxAttempts = retryConfig?.maxAttempts ?? 3;
  const delay = retryConfig?.delay ?? 1000;
  const backoff = retryConfig?.backoff ?? 'linear';

  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      return await firstValueFrom(client.send<T>(pattern, data));
    } catch (error) {
      attempt++;

      if (attempt >= maxAttempts) {
        throw new RpcException(
          `Failed after ${maxAttempts} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }

      const waitTime =
        backoff === 'exponential' ? delay * Math.pow(2, attempt - 1) : delay;

      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw new RpcException('Retry logic failed unexpectedly');
}

/**
 * Emits an event to all subscribed microservices (fire and forget).
 *
 * @param {ClientProxy} client - NestJS client proxy
 * @param {string} pattern - Event pattern identifier
 * @param {any} data - Event payload
 * @param {MessageMetadata} [metadata] - Optional tracing metadata
 *
 * @example
 * ```typescript
 * emitEvent(client, 'patient_admitted', {
 *   patientId: '123',
 *   admissionDate: new Date(),
 * });
 * ```
 */
export function emitEvent(
  client: ClientProxy,
  pattern: string,
  data: any,
  metadata?: MessageMetadata,
): void {
  const payload = metadata
    ? { ...data, _metadata: metadata }
    : { ...data, _metadata: { timestamp: new Date() } };

  client.emit(pattern, payload);
}

/**
 * Sends a batch of messages in parallel.
 *
 * @template T - Expected response type
 * @param {ClientProxy} client - NestJS client proxy
 * @param {Array<{ pattern: string; data: any }>} messages - Array of messages to send
 * @returns {Promise<T[]>} Array of responses
 *
 * @example
 * ```typescript
 * const results = await sendBatch<User>(client, [
 *   { pattern: 'get_user', data: { id: '1' } },
 *   { pattern: 'get_user', data: { id: '2' } },
 *   { pattern: 'get_user', data: { id: '3' } },
 * ]);
 * ```
 */
export async function sendBatch<T>(
  client: ClientProxy,
  messages: Array<{ pattern: string; data: any }>,
): Promise<T[]> {
  const promises = messages.map((msg) =>
    firstValueFrom(client.send<T>(msg.pattern, msg.data)),
  );

  return Promise.all(promises);
}

/**
 * Creates an observable stream for real-time data from microservice.
 *
 * @template T - Expected stream item type
 * @param {ClientProxy} client - NestJS client proxy
 * @param {string} pattern - Stream pattern identifier
 * @param {any} data - Stream request parameters
 * @returns {Observable<T>} Observable stream of data
 *
 * @example
 * ```typescript
 * const vitals$ = streamData<VitalSign>(client, 'stream_vitals', { patientId: '123' });
 * vitals$.subscribe(vital => console.log('Vital sign:', vital));
 * ```
 */
export function streamData<T>(
  client: ClientProxy,
  pattern: string,
  data: any,
): Observable<T> {
  return client.send<T>(pattern, data);
}

// ============================================================================
// CIRCUIT BREAKER PATTERN
// ============================================================================

/**
 * Circuit breaker class for preventing cascading failures in microservices.
 * Implements the circuit breaker pattern with CLOSED, OPEN, and HALF_OPEN states.
 *
 * @example
 * ```typescript
 * const breaker = new CircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 60000,
 * });
 *
 * const result = await breaker.execute(async () => {
 *   return await someRiskyOperation();
 * });
 * ```
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime: number = 0;
  private readonly logger = new Logger(CircuitBreaker.name);

  private readonly failureThreshold: number;
  private readonly successThreshold: number;
  private readonly timeout: number;
  private readonly resetTimeout: number;

  constructor(config: CircuitBreakerConfig = {}) {
    this.failureThreshold = config.failureThreshold ?? 5;
    this.successThreshold = config.successThreshold ?? 2;
    this.timeout = config.timeout ?? 5000;
    this.resetTimeout = config.resetTimeout ?? 60000;
  }

  /**
   * Executes an operation with circuit breaker protection.
   *
   * @template T - Return type of the operation
   * @param {() => Promise<T>} operation - Async operation to execute
   * @returns {Promise<T>} Result of the operation
   * @throws {Error} If circuit is OPEN or operation fails
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
        this.logger.log('Circuit breaker: OPEN -> HALF_OPEN');
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Operation timeout')), this.timeout),
        ),
      ]);

      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;

      if (this.successCount >= this.successThreshold) {
        this.state = CircuitState.CLOSED;
        this.successCount = 0;
        this.logger.log('Circuit breaker: HALF_OPEN -> CLOSED');
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    this.successCount = 0;

    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.logger.warn('Circuit breaker: CLOSED -> OPEN');
    }
  }

  /**
   * Gets the current circuit breaker state.
   *
   * @returns {CircuitState} Current state (CLOSED, OPEN, or HALF_OPEN)
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Manually resets the circuit breaker to CLOSED state.
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
    this.logger.log('Circuit breaker manually reset to CLOSED');
  }
}

/**
 * Creates a circuit breaker wrapper for a client proxy.
 *
 * @param {ClientProxy} client - NestJS client proxy to wrap
 * @param {CircuitBreakerConfig} [config] - Circuit breaker configuration
 * @returns {Object} Wrapped client with circuit breaker protection
 *
 * @example
 * ```typescript
 * const protectedClient = wrapWithCircuitBreaker(client, {
 *   failureThreshold: 3,
 *   timeout: 5000,
 * });
 *
 * const result = await protectedClient.send('get_data', { id: '123' });
 * ```
 */
export function wrapWithCircuitBreaker(
  client: ClientProxy,
  config?: CircuitBreakerConfig,
): {
  send: <T>(pattern: string, data: any) => Promise<T>;
  emit: (pattern: string, data: any) => void;
  getState: () => CircuitState;
} {
  const breaker = new CircuitBreaker(config);

  return {
    send: async <T>(pattern: string, data: any): Promise<T> => {
      return breaker.execute(async () => {
        return await firstValueFrom(client.send<T>(pattern, data));
      });
    },
    emit: (pattern: string, data: any): void => {
      client.emit(pattern, data);
    },
    getState: () => breaker.getState(),
  };
}

// ============================================================================
// SERVICE DISCOVERY & LOAD BALANCING
// ============================================================================

/**
 * Simple service registry for microservice discovery.
 */
export class ServiceRegistry {
  private services: Map<string, ServiceInstance[]> = new Map();
  private readonly logger = new Logger(ServiceRegistry.name);

  /**
   * Registers a service instance in the registry.
   *
   * @param {ServiceInstance} instance - Service instance to register
   */
  register(instance: ServiceInstance): void {
    const instances = this.services.get(instance.name) || [];
    instances.push({ ...instance, lastHeartbeat: new Date() });
    this.services.set(instance.name, instances);
    this.logger.log(`Registered service: ${instance.name} (${instance.id})`);
  }

  /**
   * Deregisters a service instance from the registry.
   *
   * @param {string} serviceName - Name of the service
   * @param {string} instanceId - Instance ID to deregister
   */
  deregister(serviceName: string, instanceId: string): void {
    const instances = this.services.get(serviceName) || [];
    const filtered = instances.filter((inst) => inst.id !== instanceId);
    this.services.set(serviceName, filtered);
    this.logger.log(`Deregistered service: ${serviceName} (${instanceId})`);
  }

  /**
   * Gets all instances of a service.
   *
   * @param {string} serviceName - Name of the service
   * @returns {ServiceInstance[]} Array of service instances
   */
  getInstances(serviceName: string): ServiceInstance[] {
    return this.services.get(serviceName) || [];
  }

  /**
   * Updates heartbeat for a service instance.
   *
   * @param {string} serviceName - Name of the service
   * @param {string} instanceId - Instance ID
   */
  heartbeat(serviceName: string, instanceId: string): void {
    const instances = this.services.get(serviceName) || [];
    const instance = instances.find((inst) => inst.id === instanceId);
    if (instance) {
      instance.lastHeartbeat = new Date();
    }
  }

  /**
   * Removes stale instances that haven't sent heartbeat.
   *
   * @param {number} [maxAge=30000] - Maximum age in milliseconds (default 30s)
   */
  cleanupStaleInstances(maxAge = 30000): void {
    const now = Date.now();
    this.services.forEach((instances, serviceName) => {
      const active = instances.filter((inst) => {
        const age = now - (inst.lastHeartbeat?.getTime() || 0);
        return age < maxAge;
      });

      if (active.length !== instances.length) {
        this.services.set(serviceName, active);
        this.logger.log(
          `Cleaned up ${instances.length - active.length} stale instances of ${serviceName}`,
        );
      }
    });
  }
}

/**
 * Round-robin load balancer for microservice instances.
 *
 * @example
 * ```typescript
 * const loadBalancer = new RoundRobinLoadBalancer();
 * const instance = loadBalancer.selectInstance('user-service', instances);
 * ```
 */
export class RoundRobinLoadBalancer {
  private currentIndex: Map<string, number> = new Map();

  /**
   * Selects next instance using round-robin strategy.
   *
   * @param {string} serviceName - Name of the service
   * @param {ServiceInstance[]} instances - Available service instances
   * @returns {ServiceInstance | null} Selected instance or null if none available
   */
  selectInstance(
    serviceName: string,
    instances: ServiceInstance[],
  ): ServiceInstance | null {
    if (instances.length === 0) return null;

    const currentIdx = this.currentIndex.get(serviceName) || 0;
    const selectedInstance = instances[currentIdx % instances.length];

    this.currentIndex.set(serviceName, currentIdx + 1);

    return selectedInstance;
  }

  /**
   * Resets the load balancer index for a service.
   *
   * @param {string} serviceName - Name of the service to reset
   */
  reset(serviceName: string): void {
    this.currentIndex.delete(serviceName);
  }
}

/**
 * Random load balancer for microservice instances.
 *
 * @example
 * ```typescript
 * const loadBalancer = new RandomLoadBalancer();
 * const instance = loadBalancer.selectInstance(instances);
 * ```
 */
export class RandomLoadBalancer {
  /**
   * Selects a random instance.
   *
   * @param {ServiceInstance[]} instances - Available service instances
   * @returns {ServiceInstance | null} Randomly selected instance or null if none available
   */
  selectInstance(instances: ServiceInstance[]): ServiceInstance | null {
    if (instances.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * instances.length);
    return instances[randomIndex];
  }
}

// ============================================================================
// HEALTH CHECK UTILITIES
// ============================================================================

/**
 * Creates a standardized health check response.
 *
 * @param {string} serviceName - Name of the service
 * @param {'up' | 'down' | 'degraded'} status - Health status
 * @param {Record<string, any>} [details] - Additional health details
 * @returns {HealthCheckResponse} Health check response object
 *
 * @example
 * ```typescript
 * const health = createHealthCheckResponse('user-service', 'up', {
 *   database: 'connected',
 *   redis: 'connected',
 *   uptime: process.uptime(),
 * });
 * ```
 */
export function createHealthCheckResponse(
  serviceName: string,
  status: 'up' | 'down' | 'degraded',
  details?: Record<string, any>,
): HealthCheckResponse {
  return {
    status,
    timestamp: new Date(),
    service: serviceName,
    details: details ?? {},
  };
}

/**
 * Performs health check on a microservice instance.
 *
 * @param {ServiceInstance} instance - Service instance to check
 * @param {number} [timeout=5000] - Health check timeout in milliseconds
 * @returns {Promise<HealthCheckResponse>} Health check response
 *
 * @example
 * ```typescript
 * const health = await performHealthCheck(serviceInstance, 3000);
 * if (health.status === 'up') {
 *   // Service is healthy
 * }
 * ```
 */
export async function performHealthCheck(
  instance: ServiceInstance,
  timeout = 5000,
): Promise<HealthCheckResponse> {
  if (!instance.healthCheckUrl) {
    return createHealthCheckResponse(instance.name, 'up', {
      message: 'No health check URL configured',
      lastHeartbeat: instance.lastHeartbeat,
    });
  }

  try {
    // This is a placeholder - in real implementation, use HTTP client
    const response = await Promise.race([
      fetch(instance.healthCheckUrl),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('Health check timeout')), timeout),
      ),
    ]);

    if (response.ok) {
      return createHealthCheckResponse(instance.name, 'up', {
        statusCode: response.status,
        timestamp: new Date(),
      });
    }

    return createHealthCheckResponse(instance.name, 'degraded', {
      statusCode: response.status,
      message: 'Health check returned non-OK status',
    });
  } catch (error) {
    return createHealthCheckResponse(instance.name, 'down', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date(),
    });
  }
}

// ============================================================================
// DISTRIBUTED TRACING HELPERS
// ============================================================================

/**
 * Generates a unique trace ID for distributed tracing.
 *
 * @returns {string} Unique trace ID
 *
 * @example
 * ```typescript
 * const traceId = generateTraceId();
 * // Returns: '1a2b3c4d5e6f7g8h'
 * ```
 */
export function generateTraceId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Generates a unique span ID for distributed tracing.
 *
 * @returns {string} Unique span ID
 *
 * @example
 * ```typescript
 * const spanId = generateSpanId();
 * // Returns: 'abc123def456'
 * ```
 */
export function generateSpanId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Creates message metadata for distributed tracing.
 *
 * @param {string} serviceName - Name of the current service
 * @param {string} [pattern] - Message pattern
 * @param {string} [parentTraceId] - Parent trace ID for nested calls
 * @param {string} [parentSpanId] - Parent span ID for nested calls
 * @returns {MessageMetadata} Message metadata with tracing information
 *
 * @example
 * ```typescript
 * const metadata = createMessageMetadata('user-service', 'get_user');
 * client.emit('user_fetched', { userId: '123', _metadata: metadata });
 * ```
 */
export function createMessageMetadata(
  serviceName: string,
  pattern?: string,
  parentTraceId?: string,
  parentSpanId?: string,
): MessageMetadata {
  return {
    traceId: parentTraceId || generateTraceId(),
    spanId: generateSpanId(),
    parentSpanId: parentSpanId,
    timestamp: new Date(),
    service: serviceName,
    pattern,
    correlationId: generateTraceId(),
  };
}

/**
 * Extracts metadata from a message payload.
 *
 * @param {any} payload - Message payload
 * @returns {MessageMetadata | null} Extracted metadata or null if not found
 *
 * @example
 * ```typescript
 * @EventPattern('user_created')
 * async handleUserCreated(data: any) {
 *   const metadata = extractMessageMetadata(data);
 *   if (metadata) {
 *     console.log('Trace ID:', metadata.traceId);
 *   }
 * }
 * ```
 */
export function extractMessageMetadata(payload: any): MessageMetadata | null {
  if (payload && typeof payload === 'object' && payload._metadata) {
    return payload._metadata;
  }
  return null;
}

/**
 * Logs a distributed trace event.
 *
 * @param {MessageMetadata} metadata - Message metadata
 * @param {string} event - Event name
 * @param {any} [data] - Additional event data
 *
 * @example
 * ```typescript
 * const metadata = createMessageMetadata('order-service', 'create_order');
 * logTraceEvent(metadata, 'order_created', { orderId: '123' });
 * ```
 */
export function logTraceEvent(
  metadata: MessageMetadata,
  event: string,
  data?: any,
): void {
  const logger = new Logger('DistributedTracing');
  logger.log(
    JSON.stringify({
      traceId: metadata.traceId,
      spanId: metadata.spanId,
      parentSpanId: metadata.parentSpanId,
      service: metadata.service,
      pattern: metadata.pattern,
      event,
      timestamp: new Date(),
      data,
    }),
  );
}

// ============================================================================
// DEAD LETTER QUEUE HANDLERS
// ============================================================================

/**
 * Dead Letter Queue (DLQ) handler for failed messages.
 */
export class DeadLetterQueue {
  private messages: DLQMessage[] = [];
  private readonly logger = new Logger(DeadLetterQueue.name);
  private readonly maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  /**
   * Adds a failed message to the DLQ.
   *
   * @param {any} message - Original message that failed
   * @param {Error} error - Error that caused the failure
   * @param {string} [pattern] - Message pattern
   * @param {number} [retryCount=0] - Number of retry attempts
   */
  add(
    message: any,
    error: Error,
    pattern?: string,
    retryCount = 0,
  ): void {
    if (this.messages.length >= this.maxSize) {
      this.messages.shift(); // Remove oldest message
    }

    const dlqMessage: DLQMessage = {
      originalMessage: message,
      error: error.message,
      timestamp: new Date(),
      retryCount,
      pattern,
    };

    this.messages.push(dlqMessage);
    this.logger.error(
      `Message added to DLQ: ${pattern || 'unknown'} - ${error.message}`,
    );
  }

  /**
   * Gets all messages in the DLQ.
   *
   * @returns {DLQMessage[]} Array of failed messages
   */
  getMessages(): DLQMessage[] {
    return [...this.messages];
  }

  /**
   * Gets messages by pattern.
   *
   * @param {string} pattern - Message pattern to filter by
   * @returns {DLQMessage[]} Filtered messages
   */
  getMessagesByPattern(pattern: string): DLQMessage[] {
    return this.messages.filter((msg) => msg.pattern === pattern);
  }

  /**
   * Removes a message from the DLQ.
   *
   * @param {number} index - Index of the message to remove
   */
  remove(index: number): void {
    if (index >= 0 && index < this.messages.length) {
      this.messages.splice(index, 1);
      this.logger.log(`Message removed from DLQ at index ${index}`);
    }
  }

  /**
   * Clears all messages from the DLQ.
   */
  clear(): void {
    const count = this.messages.length;
    this.messages = [];
    this.logger.log(`Cleared ${count} messages from DLQ`);
  }

  /**
   * Gets the current size of the DLQ.
   *
   * @returns {number} Number of messages in DLQ
   */
  size(): number {
    return this.messages.length;
  }
}

/**
 * Processes a message with automatic DLQ handling on failure.
 *
 * @template T - Expected return type
 * @param {() => Promise<T>} operation - Operation to execute
 * @param {DeadLetterQueue} dlq - Dead letter queue instance
 * @param {any} message - Original message
 * @param {string} [pattern] - Message pattern
 * @param {number} [maxRetries=3] - Maximum retry attempts
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const dlq = new DeadLetterQueue();
 * const result = await processWithDLQ(
 *   async () => await processOrder(orderData),
 *   dlq,
 *   orderData,
 *   'process_order',
 *   3
 * );
 * ```
 */
export async function processWithDLQ<T>(
  operation: () => Promise<T>,
  dlq: DeadLetterQueue,
  message: any,
  pattern?: string,
  maxRetries = 3,
): Promise<T> {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      retryCount++;

      if (retryCount >= maxRetries) {
        dlq.add(
          message,
          error instanceof Error ? error : new Error('Unknown error'),
          pattern,
          retryCount,
        );
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
    }
  }

  throw new Error('Max retries exceeded');
}

// ============================================================================
// SAGA PATTERN UTILITIES
// ============================================================================

/**
 * Saga orchestrator for managing distributed transactions.
 *
 * @example
 * ```typescript
 * const saga = new SagaOrchestrator('create-appointment');
 *
 * saga.addStep({
 *   name: 'reserve-slot',
 *   execute: async () => await slotService.reserve(slotId),
 *   compensate: async () => await slotService.release(slotId),
 * });
 *
 * await saga.execute();
 * ```
 */
export class SagaOrchestrator {
  private steps: SagaStep[] = [];
  private executedSteps: SagaStep[] = [];
  private readonly logger = new Logger(SagaOrchestrator.name);

  constructor(private readonly sagaId: string) {}

  /**
   * Adds a step to the saga.
   *
   * @param {SagaStep} step - Saga step definition
   */
  addStep(step: SagaStep): void {
    this.steps.push(step);
  }

  /**
   * Executes the saga with all its steps.
   * Automatically compensates on failure.
   *
   * @returns {Promise<void>}
   * @throws {Error} If saga execution fails
   */
  async execute(): Promise<void> {
    this.logger.log(`Starting saga: ${this.sagaId}`);

    try {
      for (const step of this.steps) {
        this.logger.log(`Executing step: ${step.name}`);
        await step.execute();
        this.executedSteps.push(step);
      }

      this.logger.log(`Saga completed successfully: ${this.sagaId}`);
    } catch (error) {
      this.logger.error(
        `Saga failed: ${this.sagaId} - ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      await this.compensate(error);
      throw error;
    }
  }

  /**
   * Compensates executed steps in reverse order.
   *
   * @param {any} [error] - Error that triggered compensation
   */
  private async compensate(error?: any): Promise<void> {
    this.logger.log(`Compensating saga: ${this.sagaId}`);

    // Execute compensation in reverse order
    for (let i = this.executedSteps.length - 1; i >= 0; i--) {
      const step = this.executedSteps[i];

      try {
        this.logger.log(`Compensating step: ${step.name}`);
        await step.compensate(error);
      } catch (compensationError) {
        this.logger.error(
          `Compensation failed for step ${step.name}: ${compensationError instanceof Error ? compensationError.message : 'Unknown error'}`,
        );
        // Continue with other compensations even if one fails
      }
    }

    this.logger.log(`Saga compensation completed: ${this.sagaId}`);
  }

  /**
   * Gets the saga ID.
   *
   * @returns {string} Saga identifier
   */
  getSagaId(): string {
    return this.sagaId;
  }

  /**
   * Gets the number of executed steps.
   *
   * @returns {number} Count of executed steps
   */
  getExecutedStepsCount(): number {
    return this.executedSteps.length;
  }

  /**
   * Resets the saga to initial state.
   */
  reset(): void {
    this.executedSteps = [];
    this.logger.log(`Saga reset: ${this.sagaId}`);
  }
}

/**
 * Generates a unique saga ID.
 *
 * @param {string} [prefix='saga'] - Optional prefix for the saga ID
 * @returns {string} Unique saga identifier
 *
 * @example
 * ```typescript
 * const sagaId = generateSagaId('order');
 * // Returns: 'order_1699564800000_abc123'
 * ```
 */
export function generateSagaId(prefix = 'saga'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Creates a saga step with execute and compensate functions.
 *
 * @param {string} name - Step name
 * @param {() => Promise<any>} execute - Execute function
 * @param {(error?: any) => Promise<void>} compensate - Compensation function
 * @returns {SagaStep} Saga step definition
 *
 * @example
 * ```typescript
 * const step = createSagaStep(
 *   'charge-payment',
 *   async () => await paymentService.charge(amount),
 *   async () => await paymentService.refund(amount)
 * );
 * ```
 */
export function createSagaStep(
  name: string,
  execute: () => Promise<any>,
  compensate: (error?: any) => Promise<void>,
): SagaStep {
  return { name, execute, compensate };
}

// ============================================================================
// MESSAGE SERIALIZATION/DESERIALIZATION
// ============================================================================

/**
 * Serializes a message to JSON string.
 *
 * @param {any} message - Message to serialize
 * @returns {string} Serialized JSON string
 *
 * @example
 * ```typescript
 * const serialized = serializeMessage({ id: '123', name: 'John' });
 * // Returns: '{"id":"123","name":"John"}'
 * ```
 */
export function serializeMessage(message: any): string {
  try {
    return JSON.stringify(message);
  } catch (error) {
    throw new Error(
      `Failed to serialize message: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Deserializes a JSON string to object.
 *
 * @template T - Expected return type
 * @param {string} message - JSON string to deserialize
 * @returns {T} Deserialized object
 *
 * @example
 * ```typescript
 * const user = deserializeMessage<User>('{"id":"123","name":"John"}');
 * ```
 */
export function deserializeMessage<T>(message: string): T {
  try {
    return JSON.parse(message) as T;
  } catch (error) {
    throw new Error(
      `Failed to deserialize message: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Validates message structure against a schema.
 *
 * @template T - Expected message type
 * @param {any} message - Message to validate
 * @param {(msg: any) => msg is T} validator - Type guard function
 * @returns {T} Validated message
 * @throws {RpcException} If validation fails
 *
 * @example
 * ```typescript
 * function isUser(msg: any): msg is User {
 *   return msg && typeof msg.id === 'string' && typeof msg.name === 'string';
 * }
 *
 * const user = validateMessage(data, isUser);
 * ```
 */
export function validateMessage<T>(
  message: any,
  validator: (msg: any) => msg is T,
): T {
  if (!validator(message)) {
    throw new RpcException('Message validation failed');
  }
  return message;
}

/**
 * Compresses a message payload using basic compression (placeholder).
 *
 * @param {any} message - Message to compress
 * @returns {string} Compressed message
 *
 * @example
 * ```typescript
 * const compressed = compressMessage(largePayload);
 * ```
 */
export function compressMessage(message: any): string {
  // In real implementation, use zlib or similar
  return Buffer.from(JSON.stringify(message)).toString('base64');
}

/**
 * Decompresses a message payload (placeholder).
 *
 * @template T - Expected return type
 * @param {string} compressed - Compressed message
 * @returns {T} Decompressed message
 *
 * @example
 * ```typescript
 * const original = decompressMessage<PayloadType>(compressed);
 * ```
 */
export function decompressMessage<T>(compressed: string): T {
  // In real implementation, use zlib or similar
  const json = Buffer.from(compressed, 'base64').toString('utf-8');
  return JSON.parse(json) as T;
}

// ============================================================================
// RETRY AND TIMEOUT CONFIGURATIONS
// ============================================================================

/**
 * Creates a retry strategy with exponential backoff.
 *
 * @param {number} [maxAttempts=3] - Maximum retry attempts
 * @param {number} [initialDelay=1000] - Initial delay in milliseconds
 * @param {number} [maxDelay=30000] - Maximum delay in milliseconds
 * @returns {RetryConfig} Retry configuration
 *
 * @example
 * ```typescript
 * const retryConfig = createExponentialRetry(5, 1000, 60000);
 * await sendWithRetry(client, 'process', data, retryConfig);
 * ```
 */
export function createExponentialRetry(
  maxAttempts = 3,
  initialDelay = 1000,
  maxDelay = 30000,
): RetryConfig {
  return {
    maxAttempts,
    delay: initialDelay,
    backoff: 'exponential',
    maxDelay,
  };
}

/**
 * Creates a retry strategy with linear backoff.
 *
 * @param {number} [maxAttempts=3] - Maximum retry attempts
 * @param {number} [delay=1000] - Delay between retries in milliseconds
 * @returns {RetryConfig} Retry configuration
 *
 * @example
 * ```typescript
 * const retryConfig = createLinearRetry(3, 2000);
 * await sendWithRetry(client, 'process', data, retryConfig);
 * ```
 */
export function createLinearRetry(
  maxAttempts = 3,
  delay = 1000,
): RetryConfig {
  return {
    maxAttempts,
    delay,
    backoff: 'linear',
  };
}

/**
 * Creates a timeout configuration with optional fallback value.
 *
 * @template T - Fallback value type
 * @param {number} duration - Timeout duration in milliseconds
 * @param {T} [fallbackValue] - Optional fallback value to return on timeout
 * @returns {TimeoutConfig} Timeout configuration
 *
 * @example
 * ```typescript
 * const timeoutConfig = createTimeoutConfig(5000, { id: 'default', name: 'Unknown' });
 * const user = await sendWithTimeout(client, 'get_user', { id: '123' }, timeoutConfig);
 * ```
 */
export function createTimeoutConfig<T>(
  duration: number,
  fallbackValue?: T,
): TimeoutConfig {
  return {
    duration,
    fallbackValue,
  };
}

/**
 * Executes an async operation with timeout.
 *
 * @template T - Expected return type
 * @param {Promise<T>} promise - Promise to execute
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} [errorMessage] - Custom error message
 * @returns {Promise<T>} Promise result or timeout error
 *
 * @example
 * ```typescript
 * const result = await withTimeout(
 *   fetchUserData('123'),
 *   5000,
 *   'User fetch timeout'
 * );
 * ```
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timeout',
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs),
    ),
  ]);
}
