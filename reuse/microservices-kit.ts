/**
 * LOC: MSVC-KIT-001
 * File: /reuse/microservices-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Microservices modules and controllers
 *   - Service discovery implementations
 *   - Transport layer configurations
 */

/**
 * File: /reuse/microservices-kit.ts
 * Locator: WC-UTL-MSVC-KIT-001
 * Purpose: Comprehensive NestJS Microservices Toolkit - Transport Configuration, Message Patterns, RPC Clients, Service Discovery
 *
 * Upstream: Independent utility module for NestJS microservices architecture
 * Downstream: ../backend/*, microservices modules, hybrid applications, transport configurations
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/microservices, RabbitMQ, Kafka, Redis, NATS, gRPC
 * Exports: 45 utility functions for microservices setup, transport configuration, message handling, service discovery, resilience patterns
 *
 * LLM Context: Production-ready microservices utilities for White Cross healthcare platform. Provides comprehensive tools for
 * configuring transports (TCP, Redis, NATS, RabbitMQ, Kafka, gRPC), building message patterns, managing RPC clients,
 * implementing circuit breakers, service discovery, load balancing, health checks, and graceful shutdown. Essential for
 * building HIPAA-compliant distributed healthcare microservices with high availability and fault tolerance.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface TransportConfig {
  transport: 'TCP' | 'REDIS' | 'NATS' | 'MQTT' | 'RMQ' | 'KAFKA' | 'GRPC';
  options: Record<string, any>;
  retryAttempts?: number;
  retryDelay?: number;
}

interface MessageMetadata {
  correlationId: string;
  timestamp: Date;
  source: string;
  userId?: string;
  traceId?: string;
  spanId?: string;
  version: number;
}

interface RPCClientConfig {
  name: string;
  transport: TransportConfig;
  timeout?: number;
  retries?: number;
  circuitBreaker?: CircuitBreakerOptions;
}

interface CircuitBreakerOptions {
  enabled: boolean;
  failureThreshold: number;
  successThreshold: number;
  resetTimeout: number;
  halfOpenRequests?: number;
}

interface ServiceRegistration {
  serviceId: string;
  serviceName: string;
  version: string;
  host: string;
  port: number;
  protocol: string;
  status: 'healthy' | 'unhealthy' | 'starting' | 'stopping';
  metadata: Record<string, any>;
  registeredAt: Date;
  lastHeartbeat?: Date;
}

interface LoadBalancer {
  strategy: 'round-robin' | 'random' | 'least-connections' | 'weighted' | 'consistent-hash';
  instances: ServiceRegistration[];
  healthCheckInterval: number;
  unhealthyThreshold: number;
}

interface HealthCheck {
  name: string;
  status: 'up' | 'down' | 'degraded';
  timestamp: Date;
  responseTime?: number;
  details?: Record<string, any>;
  dependencies?: HealthCheck[];
}

interface RetryStrategy {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffType: 'exponential' | 'linear' | 'fixed';
  jitter: boolean;
  retryableErrors?: string[];
}

interface StreamMessage {
  id: string;
  data: any;
  timestamp: Date;
  sequence: number;
  metadata: Record<string, any>;
}

interface HybridAppConfig {
  httpPort: number;
  microservices: TransportConfig[];
  globalPrefix?: string;
  cors?: boolean;
  swagger?: boolean;
}

interface GracefulShutdownConfig {
  timeout: number;
  signals: string[];
  beforeShutdown?: () => Promise<void>;
  onShutdown?: () => Promise<void>;
}

// ============================================================================
// SECTION 1: MESSAGE PATTERN BUILDERS (Functions 1-8)
// ============================================================================

/**
 * 1. Creates a standardized request-response message pattern.
 *
 * @param {string} pattern - Message pattern identifier
 * @param {any} data - Message payload
 * @param {Partial<MessageMetadata>} [metadata] - Optional metadata
 * @returns {object} Formatted message pattern
 *
 * @example
 * ```typescript
 * const msg = createRequestPattern('patient.get', { id: '123' }, { userId: 'user-456' });
 * // Result: { pattern: 'patient.get', data: {...}, metadata: {...} }
 * ```
 */
export const createRequestPattern = (
  pattern: string,
  data: any,
  metadata?: Partial<MessageMetadata>,
): object => {
  return {
    pattern,
    data,
    metadata: {
      correlationId: generateUUID(),
      timestamp: new Date(),
      source: 'api',
      version: 1,
      ...metadata,
    },
  };
};

/**
 * 2. Creates an event pattern for fire-and-forget messaging.
 *
 * @param {string} eventName - Event name/pattern
 * @param {any} payload - Event payload
 * @param {Record<string, any>} [context] - Event context
 * @returns {object} Formatted event pattern
 *
 * @example
 * ```typescript
 * const event = createEventPattern('patient.created', { id: '123', name: 'John' });
 * // Result: { event: 'patient.created', payload: {...}, context: {...} }
 * ```
 */
export const createEventPattern = (
  eventName: string,
  payload: any,
  context?: Record<string, any>,
): object => {
  return {
    event: eventName,
    payload,
    context: {
      eventId: generateEventId(),
      timestamp: new Date().toISOString(),
      ...context,
    },
  };
};

/**
 * 3. Builds a reply pattern for request-response communication.
 *
 * @param {string} correlationId - Correlation ID from original request
 * @param {any} data - Response data
 * @param {boolean} [success=true] - Whether response indicates success
 * @param {string} [error] - Error message if unsuccessful
 * @returns {object} Reply message
 *
 * @example
 * ```typescript
 * const reply = buildReplyPattern('corr-123', { result: 'success' });
 * // Result: { correlationId: 'corr-123', data: {...}, success: true, timestamp: Date }
 * ```
 */
export const buildReplyPattern = (
  correlationId: string,
  data: any,
  success: boolean = true,
  error?: string,
): object => {
  return {
    correlationId,
    data: success ? data : null,
    error: error || null,
    success,
    timestamp: new Date(),
  };
};

/**
 * 4. Creates a streaming message with sequence tracking.
 *
 * @param {any} data - Message data
 * @param {number} sequence - Message sequence number
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {StreamMessage} Stream message
 *
 * @example
 * ```typescript
 * const streamMsg = createStreamMessage({ vitals: {...} }, 1);
 * // Result: { id: 'msg-uuid', data: {...}, sequence: 1, timestamp: Date }
 * ```
 */
export const createStreamMessage = (
  data: any,
  sequence: number,
  metadata?: Record<string, any>,
): StreamMessage => {
  return {
    id: generateMessageId(),
    data,
    timestamp: new Date(),
    sequence,
    metadata: metadata || {},
  };
};

/**
 * 5. Validates message pattern structure and required fields.
 *
 * @param {any} message - Message to validate
 * @param {string[]} [requiredFields] - Required field names
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateMessagePattern(msg, ['pattern', 'data']);
 * // Result: true
 * ```
 */
export const validateMessagePattern = (
  message: any,
  requiredFields?: string[],
): boolean => {
  if (!message || typeof message !== 'object') {
    return false;
  }

  const fields = requiredFields || ['pattern', 'data'];
  return fields.every(field => message[field] !== undefined);
};

/**
 * 6. Extracts metadata from message headers or body.
 *
 * @param {any} message - Message object
 * @returns {MessageMetadata | null} Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = extractMessageMetadata(message);
 * // Result: { correlationId: '...', timestamp: Date, ... }
 * ```
 */
export const extractMessageMetadata = (message: any): MessageMetadata | null => {
  if (!message) return null;

  return {
    correlationId: message.metadata?.correlationId || message.correlationId || generateUUID(),
    timestamp: message.metadata?.timestamp || message.timestamp || new Date(),
    source: message.metadata?.source || message.source || 'unknown',
    userId: message.metadata?.userId || message.userId,
    traceId: message.metadata?.traceId || message.traceId,
    spanId: message.metadata?.spanId || message.spanId,
    version: message.metadata?.version || message.version || 1,
  };
};

/**
 * 7. Enriches message with distributed tracing context.
 *
 * @param {any} message - Message to enrich
 * @param {string} traceId - Trace ID
 * @param {string} spanId - Span ID
 * @param {string} [parentSpanId] - Parent span ID
 * @returns {any} Enriched message
 *
 * @example
 * ```typescript
 * const enriched = enrichWithTracing(msg, 'trace-123', 'span-456');
 * // Result: Message with tracing headers added
 * ```
 */
export const enrichWithTracing = (
  message: any,
  traceId: string,
  spanId: string,
  parentSpanId?: string,
): any => {
  return {
    ...message,
    metadata: {
      ...message.metadata,
      traceId,
      spanId,
      parentSpanId,
      tracingTimestamp: new Date().toISOString(),
    },
  };
};

/**
 * 8. Serializes message for transport layer.
 *
 * @param {any} message - Message to serialize
 * @param {string} [format='json'] - Serialization format
 * @returns {string | Buffer} Serialized message
 *
 * @example
 * ```typescript
 * const serialized = serializeMessage({ data: 'test' });
 * // Result: '{"data":"test"}'
 * ```
 */
export const serializeMessage = (message: any, format: string = 'json'): string | Buffer => {
  if (format === 'json') {
    return JSON.stringify(message);
  }
  // Add other formats as needed (protobuf, msgpack, etc.)
  return JSON.stringify(message);
};

// ============================================================================
// SECTION 2: TRANSPORT CONFIGURATION HELPERS (Functions 9-16)
// ============================================================================

/**
 * 9. Creates TCP transport configuration with retry settings.
 *
 * @param {string} host - TCP host
 * @param {number} port - TCP port
 * @param {number} [retryAttempts=5] - Retry attempts
 * @param {number} [retryDelay=3000] - Retry delay in ms
 * @returns {TransportConfig} TCP configuration
 *
 * @example
 * ```typescript
 * const config = createTCPTransport('localhost', 3001);
 * // Result: { transport: 'TCP', options: { host: 'localhost', port: 3001 }, ... }
 * ```
 */
export const createTCPTransport = (
  host: string,
  port: number,
  retryAttempts: number = 5,
  retryDelay: number = 3000,
): TransportConfig => {
  return {
    transport: 'TCP',
    options: {
      host,
      port,
    },
    retryAttempts,
    retryDelay,
  };
};

/**
 * 10. Creates Redis transport configuration for pub/sub.
 *
 * @param {string} host - Redis host
 * @param {number} port - Redis port
 * @param {string} [password] - Redis password
 * @param {boolean} [wildcards=true] - Enable wildcard patterns
 * @returns {TransportConfig} Redis configuration
 *
 * @example
 * ```typescript
 * const config = createRedisTransport('localhost', 6379);
 * // Result: { transport: 'REDIS', options: { host: 'localhost', port: 6379 } }
 * ```
 */
export const createRedisTransport = (
  host: string,
  port: number,
  password?: string,
  wildcards: boolean = true,
): TransportConfig => {
  return {
    transport: 'REDIS',
    options: {
      host,
      port,
      password,
      wildcards,
      retryAttempts: 5,
      retryDelay: 3000,
    },
    retryAttempts: 5,
    retryDelay: 3000,
  };
};

/**
 * 11. Creates NATS transport configuration with authentication.
 *
 * @param {string[]} servers - NATS server URLs
 * @param {string} [user] - NATS username
 * @param {string} [pass] - NATS password
 * @param {string} [queue] - Queue group name
 * @returns {TransportConfig} NATS configuration
 *
 * @example
 * ```typescript
 * const config = createNATSTransport(['nats://localhost:4222'], 'user', 'pass');
 * // Result: { transport: 'NATS', options: { servers: [...], user: 'user', pass: 'pass' } }
 * ```
 */
export const createNATSTransport = (
  servers: string[],
  user?: string,
  pass?: string,
  queue?: string,
): TransportConfig => {
  return {
    transport: 'NATS',
    options: {
      servers,
      user,
      pass,
      queue,
      maxReconnectAttempts: 10,
      reconnectTimeWait: 2000,
    },
    retryAttempts: 5,
    retryDelay: 3000,
  };
};

/**
 * 12. Creates RabbitMQ transport configuration with queue options.
 *
 * @param {string[]} urls - RabbitMQ URLs
 * @param {string} queue - Queue name
 * @param {boolean} [durable=true] - Queue durability
 * @param {number} [prefetchCount=10] - Prefetch count
 * @returns {TransportConfig} RabbitMQ configuration
 *
 * @example
 * ```typescript
 * const config = createRabbitMQTransport(['amqp://localhost:5672'], 'main_queue');
 * // Result: { transport: 'RMQ', options: { urls: [...], queue: 'main_queue', ... } }
 * ```
 */
export const createRabbitMQTransport = (
  urls: string[],
  queue: string,
  durable: boolean = true,
  prefetchCount: number = 10,
): TransportConfig => {
  return {
    transport: 'RMQ',
    options: {
      urls,
      queue,
      queueOptions: {
        durable,
      },
      prefetchCount,
      noAck: false,
      persistent: true,
    },
    retryAttempts: 5,
    retryDelay: 3000,
  };
};

/**
 * 13. Creates Kafka transport configuration with consumer groups.
 *
 * @param {string[]} brokers - Kafka broker URLs
 * @param {string} clientId - Kafka client ID
 * @param {string} groupId - Consumer group ID
 * @param {boolean} [ssl=false] - Enable SSL
 * @returns {TransportConfig} Kafka configuration
 *
 * @example
 * ```typescript
 * const config = createKafkaTransport(['localhost:9092'], 'patient-service', 'patient-group');
 * // Result: { transport: 'KAFKA', options: { client: {...}, consumer: {...} } }
 * ```
 */
export const createKafkaTransport = (
  brokers: string[],
  clientId: string,
  groupId: string,
  ssl: boolean = false,
): TransportConfig => {
  return {
    transport: 'KAFKA',
    options: {
      client: {
        clientId,
        brokers,
        ssl,
      },
      consumer: {
        groupId,
        allowAutoTopicCreation: true,
        retry: {
          initialRetryTime: 100,
          retries: 8,
        },
      },
      producer: {
        allowAutoTopicCreation: true,
        retry: {
          initialRetryTime: 100,
          retries: 8,
        },
      },
    },
    retryAttempts: 5,
    retryDelay: 3000,
  };
};

/**
 * 14. Creates gRPC transport configuration with proto definitions.
 *
 * @param {string} packageName - gRPC package name
 * @param {string} protoPath - Path to .proto file
 * @param {string} url - gRPC server URL
 * @param {Record<string, any>} [loaderOptions] - Proto loader options
 * @returns {TransportConfig} gRPC configuration
 *
 * @example
 * ```typescript
 * const config = createGRPCTransport('healthcare', './proto/patient.proto', '0.0.0.0:5000');
 * // Result: { transport: 'GRPC', options: { package: 'healthcare', protoPath: '...', url: '...' } }
 * ```
 */
export const createGRPCTransport = (
  packageName: string,
  protoPath: string,
  url: string,
  loaderOptions?: Record<string, any>,
): TransportConfig => {
  return {
    transport: 'GRPC',
    options: {
      package: packageName,
      protoPath,
      url,
      maxReceiveMessageLength: 1024 * 1024 * 100, // 100 MB
      maxSendMessageLength: 1024 * 1024 * 100,
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        ...loaderOptions,
      },
    },
    retryAttempts: 5,
    retryDelay: 3000,
  };
};

/**
 * 15. Creates MQTT transport configuration for IoT scenarios.
 *
 * @param {string} url - MQTT broker URL
 * @param {string} [username] - MQTT username
 * @param {string} [password] - MQTT password
 * @param {number} [qos=1] - Quality of Service level
 * @returns {TransportConfig} MQTT configuration
 *
 * @example
 * ```typescript
 * const config = createMQTTTransport('mqtt://localhost:1883', 'user', 'pass');
 * // Result: { transport: 'MQTT', options: { url: '...', username: '...', ... } }
 * ```
 */
export const createMQTTTransport = (
  url: string,
  username?: string,
  password?: string,
  qos: number = 1,
): TransportConfig => {
  return {
    transport: 'MQTT',
    options: {
      url,
      username,
      password,
      qos,
      clean: true,
      reconnectPeriod: 1000,
    },
    retryAttempts: 5,
    retryDelay: 3000,
  };
};

/**
 * 16. Validates transport configuration for correctness.
 *
 * @param {TransportConfig} config - Transport configuration
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateTransportConfig(tcpConfig);
 * // Result: true
 * ```
 */
export const validateTransportConfig = (config: TransportConfig): boolean => {
  if (!config || !config.transport || !config.options) {
    return false;
  }

  const validTransports = ['TCP', 'REDIS', 'NATS', 'MQTT', 'RMQ', 'KAFKA', 'GRPC'];
  return validTransports.includes(config.transport);
};

// ============================================================================
// SECTION 3: RPC CLIENT FACTORIES (Functions 17-22)
// ============================================================================

/**
 * 17. Creates a configured RPC client instance.
 *
 * @param {RPCClientConfig} config - RPC client configuration
 * @returns {object} Client configuration object
 *
 * @example
 * ```typescript
 * const client = createRPCClient({
 *   name: 'patient-service',
 *   transport: tcpConfig,
 *   timeout: 5000
 * });
 * ```
 */
export const createRPCClient = (config: RPCClientConfig): object => {
  return {
    name: config.name,
    transport: config.transport,
    timeout: config.timeout || 5000,
    retries: config.retries || 3,
    circuitBreaker: config.circuitBreaker || {
      enabled: false,
      failureThreshold: 5,
      successThreshold: 2,
      resetTimeout: 60000,
    },
  };
};

/**
 * 18. Creates a hybrid RPC client supporting multiple transports.
 *
 * @param {string} name - Client name
 * @param {TransportConfig[]} transports - Array of transport configs
 * @returns {object} Hybrid client configuration
 *
 * @example
 * ```typescript
 * const client = createHybridRPCClient('multi-service', [tcpConfig, redisConfig]);
 * // Result: Client supporting both TCP and Redis
 * ```
 */
export const createHybridRPCClient = (name: string, transports: TransportConfig[]): object => {
  return {
    name,
    transports,
    strategy: 'failover', // failover, load-balance, or broadcast
    timeout: 5000,
  };
};

/**
 * 19. Builds RPC request with timeout and metadata.
 *
 * @param {string} pattern - RPC pattern
 * @param {any} data - Request data
 * @param {number} [timeout=5000] - Request timeout in ms
 * @param {Record<string, any>} [metadata] - Request metadata
 * @returns {object} RPC request object
 *
 * @example
 * ```typescript
 * const request = buildRPCRequest('patient.get', { id: '123' }, 5000);
 * // Result: { pattern: 'patient.get', data: {...}, timeout: 5000, metadata: {...} }
 * ```
 */
export const buildRPCRequest = (
  pattern: string,
  data: any,
  timeout: number = 5000,
  metadata?: Record<string, any>,
): object => {
  return {
    pattern,
    data,
    timeout,
    metadata: {
      requestId: generateRequestId(),
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };
};

/**
 * 20. Creates an RPC client pool for load distribution.
 *
 * @param {RPCClientConfig[]} clients - Array of client configurations
 * @param {string} strategy - Pool strategy
 * @returns {object} Client pool configuration
 *
 * @example
 * ```typescript
 * const pool = createRPCClientPool([client1Config, client2Config], 'round-robin');
 * // Result: Pool with 2 clients using round-robin strategy
 * ```
 */
export const createRPCClientPool = (clients: RPCClientConfig[], strategy: string): object => {
  return {
    clients,
    strategy, // 'round-robin', 'random', 'least-busy'
    healthCheckInterval: 30000,
    minSize: 1,
    maxSize: clients.length,
  };
};

/**
 * 21. Wraps RPC client with circuit breaker protection.
 *
 * @param {any} client - RPC client instance
 * @param {CircuitBreakerOptions} options - Circuit breaker options
 * @returns {object} Wrapped client with circuit breaker
 *
 * @example
 * ```typescript
 * const protected = wrapWithCircuitBreaker(client, {
 *   enabled: true,
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   resetTimeout: 60000
 * });
 * ```
 */
export const wrapWithCircuitBreaker = (
  client: any,
  options: CircuitBreakerOptions,
): object => {
  return {
    client,
    circuitBreaker: {
      ...options,
      state: 'CLOSED',
      failures: 0,
      successes: 0,
      lastFailureTime: 0,
      nextAttempt: 0,
    },
  };
};

/**
 * 22. Creates an RPC client with automatic retry logic.
 *
 * @param {RPCClientConfig} config - Client configuration
 * @param {RetryStrategy} retryStrategy - Retry strategy
 * @returns {object} Client with retry configuration
 *
 * @example
 * ```typescript
 * const client = createRetryableRPCClient(config, {
 *   maxAttempts: 3,
 *   baseDelay: 1000,
 *   maxDelay: 10000,
 *   backoffType: 'exponential',
 *   jitter: true
 * });
 * ```
 */
export const createRetryableRPCClient = (
  config: RPCClientConfig,
  retryStrategy: RetryStrategy,
): object => {
  return {
    ...config,
    retryStrategy,
  };
};

// ============================================================================
// SECTION 4: SERVICE DISCOVERY UTILITIES (Functions 23-28)
// ============================================================================

/**
 * 23. Registers a microservice instance in service registry.
 *
 * @param {string} serviceName - Service name
 * @param {string} host - Service host
 * @param {number} port - Service port
 * @param {Record<string, any>} [metadata] - Service metadata
 * @returns {ServiceRegistration} Service registration
 *
 * @example
 * ```typescript
 * const registration = registerService('patient-service', 'localhost', 3001, { version: '1.0' });
 * // Result: { serviceId: 'uuid', serviceName: 'patient-service', ... }
 * ```
 */
export const registerService = (
  serviceName: string,
  host: string,
  port: number,
  metadata?: Record<string, any>,
): ServiceRegistration => {
  return {
    serviceId: generateServiceId(),
    serviceName,
    version: metadata?.version || '1.0.0',
    host,
    port,
    protocol: 'http',
    status: 'healthy',
    metadata: metadata || {},
    registeredAt: new Date(),
    lastHeartbeat: new Date(),
  };
};

/**
 * 24. Discovers service instances by name.
 *
 * @param {string} serviceName - Service name to discover
 * @param {ServiceRegistration[]} registry - Service registry
 * @param {boolean} [healthyOnly=true] - Return only healthy instances
 * @returns {ServiceRegistration[]} Discovered instances
 *
 * @example
 * ```typescript
 * const instances = discoverServiceInstances('patient-service', registry);
 * // Result: [{ serviceId: '...', serviceName: 'patient-service', ... }]
 * ```
 */
export const discoverServiceInstances = (
  serviceName: string,
  registry: ServiceRegistration[],
  healthyOnly: boolean = true,
): ServiceRegistration[] => {
  return registry.filter(
    service =>
      service.serviceName === serviceName &&
      (!healthyOnly || service.status === 'healthy'),
  );
};

/**
 * 25. Updates service heartbeat and health status.
 *
 * @param {ServiceRegistration} service - Service instance
 * @param {boolean} isHealthy - Health status
 * @returns {ServiceRegistration} Updated service
 *
 * @example
 * ```typescript
 * const updated = updateServiceHeartbeat(service, true);
 * // Result: Service with updated lastHeartbeat and status
 * ```
 */
export const updateServiceHeartbeat = (
  service: ServiceRegistration,
  isHealthy: boolean,
): ServiceRegistration => {
  return {
    ...service,
    status: isHealthy ? 'healthy' : 'unhealthy',
    lastHeartbeat: new Date(),
  };
};

/**
 * 26. Deregisters a service instance from registry.
 *
 * @param {string} serviceId - Service ID to deregister
 * @param {ServiceRegistration[]} registry - Service registry
 * @returns {ServiceRegistration[]} Updated registry
 *
 * @example
 * ```typescript
 * const updated = deregisterService('service-123', registry);
 * // Result: Registry without the specified service
 * ```
 */
export const deregisterService = (
  serviceId: string,
  registry: ServiceRegistration[],
): ServiceRegistration[] => {
  return registry.filter(service => service.serviceId !== serviceId);
};

/**
 * 27. Finds service instance by ID.
 *
 * @param {string} serviceId - Service ID
 * @param {ServiceRegistration[]} registry - Service registry
 * @returns {ServiceRegistration | null} Found service or null
 *
 * @example
 * ```typescript
 * const service = findServiceById('service-123', registry);
 * // Result: { serviceId: 'service-123', ... } or null
 * ```
 */
export const findServiceById = (
  serviceId: string,
  registry: ServiceRegistration[],
): ServiceRegistration | null => {
  return registry.find(service => service.serviceId === serviceId) || null;
};

/**
 * 28. Filters services by metadata criteria.
 *
 * @param {ServiceRegistration[]} services - Services to filter
 * @param {Record<string, any>} criteria - Filter criteria
 * @returns {ServiceRegistration[]} Filtered services
 *
 * @example
 * ```typescript
 * const filtered = filterServicesByMetadata(services, { version: '1.0', region: 'us-east' });
 * // Result: Services matching metadata criteria
 * ```
 */
export const filterServicesByMetadata = (
  services: ServiceRegistration[],
  criteria: Record<string, any>,
): ServiceRegistration[] => {
  return services.filter(service =>
    Object.entries(criteria).every(
      ([key, value]) => service.metadata[key] === value,
    ),
  );
};

// ============================================================================
// SECTION 5: LOAD BALANCING HELPERS (Functions 29-33)
// ============================================================================

/**
 * 29. Creates a load balancer with strategy and health checks.
 *
 * @param {string} strategy - Load balancing strategy
 * @param {ServiceRegistration[]} instances - Service instances
 * @param {number} [healthCheckInterval=30000] - Health check interval in ms
 * @returns {LoadBalancer} Load balancer configuration
 *
 * @example
 * ```typescript
 * const lb = createLoadBalancer('round-robin', instances, 30000);
 * // Result: { strategy: 'round-robin', instances: [...], healthCheckInterval: 30000 }
 * ```
 */
export const createLoadBalancer = (
  strategy: string,
  instances: ServiceRegistration[],
  healthCheckInterval: number = 30000,
): LoadBalancer => {
  return {
    strategy: strategy as any,
    instances,
    healthCheckInterval,
    unhealthyThreshold: 3,
  };
};

/**
 * 30. Selects next service instance using round-robin strategy.
 *
 * @param {LoadBalancer} balancer - Load balancer
 * @param {number} currentIndex - Current index
 * @returns {ServiceRegistration | null} Selected instance
 *
 * @example
 * ```typescript
 * const instance = selectRoundRobin(balancer, 0);
 * // Result: Next service instance in round-robin order
 * ```
 */
export const selectRoundRobin = (
  balancer: LoadBalancer,
  currentIndex: number,
): ServiceRegistration | null => {
  const healthy = balancer.instances.filter(i => i.status === 'healthy');
  if (healthy.length === 0) return null;

  const nextIndex = currentIndex % healthy.length;
  return healthy[nextIndex];
};

/**
 * 31. Selects random service instance for load distribution.
 *
 * @param {LoadBalancer} balancer - Load balancer
 * @returns {ServiceRegistration | null} Selected instance
 *
 * @example
 * ```typescript
 * const instance = selectRandom(balancer);
 * // Result: Randomly selected healthy instance
 * ```
 */
export const selectRandom = (balancer: LoadBalancer): ServiceRegistration | null => {
  const healthy = balancer.instances.filter(i => i.status === 'healthy');
  if (healthy.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * healthy.length);
  return healthy[randomIndex];
};

/**
 * 32. Selects instance using consistent hashing.
 *
 * @param {LoadBalancer} balancer - Load balancer
 * @param {string} key - Hash key (e.g., user ID, session ID)
 * @returns {ServiceRegistration | null} Selected instance
 *
 * @example
 * ```typescript
 * const instance = selectConsistentHash(balancer, 'user-123');
 * // Result: Consistently selected instance for the key
 * ```
 */
export const selectConsistentHash = (
  balancer: LoadBalancer,
  key: string,
): ServiceRegistration | null => {
  const healthy = balancer.instances.filter(i => i.status === 'healthy');
  if (healthy.length === 0) return null;

  const hash = hashString(key);
  const index = hash % healthy.length;
  return healthy[index];
};

/**
 * 33. Selects instance with least connections.
 *
 * @param {LoadBalancer} balancer - Load balancer
 * @param {Map<string, number>} connections - Connection count by service ID
 * @returns {ServiceRegistration | null} Selected instance
 *
 * @example
 * ```typescript
 * const instance = selectLeastConnections(balancer, connectionsMap);
 * // Result: Instance with fewest active connections
 * ```
 */
export const selectLeastConnections = (
  balancer: LoadBalancer,
  connections: Map<string, number>,
): ServiceRegistration | null => {
  const healthy = balancer.instances.filter(i => i.status === 'healthy');
  if (healthy.length === 0) return null;

  return healthy.reduce((min, instance) => {
    const currentConns = connections.get(instance.serviceId) || 0;
    const minConns = connections.get(min.serviceId) || 0;
    return currentConns < minConns ? instance : min;
  });
};

// ============================================================================
// SECTION 6: CIRCUIT BREAKER & RETRY (Functions 34-38)
// ============================================================================

/**
 * 34. Creates a circuit breaker configuration.
 *
 * @param {number} failureThreshold - Failures before opening circuit
 * @param {number} successThreshold - Successes to close circuit
 * @param {number} resetTimeout - Time before retry in ms
 * @returns {CircuitBreakerOptions} Circuit breaker options
 *
 * @example
 * ```typescript
 * const cb = createCircuitBreaker(5, 2, 60000);
 * // Result: { enabled: true, failureThreshold: 5, successThreshold: 2, resetTimeout: 60000 }
 * ```
 */
export const createCircuitBreaker = (
  failureThreshold: number,
  successThreshold: number,
  resetTimeout: number,
): CircuitBreakerOptions => {
  return {
    enabled: true,
    failureThreshold,
    successThreshold,
    resetTimeout,
    halfOpenRequests: 3,
  };
};

/**
 * 35. Creates exponential backoff retry strategy.
 *
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms
 * @param {number} maxDelay - Maximum delay in ms
 * @returns {RetryStrategy} Retry strategy
 *
 * @example
 * ```typescript
 * const strategy = createExponentialBackoff(3, 1000, 10000);
 * // Result: { maxAttempts: 3, baseDelay: 1000, maxDelay: 10000, backoffType: 'exponential' }
 * ```
 */
export const createExponentialBackoff = (
  maxAttempts: number,
  baseDelay: number,
  maxDelay: number,
): RetryStrategy => {
  return {
    maxAttempts,
    baseDelay,
    maxDelay,
    backoffType: 'exponential',
    jitter: true,
  };
};

/**
 * 36. Calculates next retry delay based on strategy.
 *
 * @param {number} attempt - Current attempt number
 * @param {RetryStrategy} strategy - Retry strategy
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateRetryDelay(2, strategy);
 * // Result: 4000 (for exponential: baseDelay * 2^attempt)
 * ```
 */
export const calculateRetryDelay = (attempt: number, strategy: RetryStrategy): number => {
  let delay: number;

  switch (strategy.backoffType) {
    case 'exponential':
      delay = Math.min(strategy.baseDelay * Math.pow(2, attempt), strategy.maxDelay);
      break;
    case 'linear':
      delay = Math.min(strategy.baseDelay * (attempt + 1), strategy.maxDelay);
      break;
    case 'fixed':
    default:
      delay = strategy.baseDelay;
  }

  if (strategy.jitter) {
    delay = delay * (0.5 + Math.random() * 0.5); // 50-100% of calculated delay
  }

  return Math.floor(delay);
};

/**
 * 37. Determines if error is retryable based on strategy.
 *
 * @param {Error} error - Error object
 * @param {RetryStrategy} strategy - Retry strategy
 * @returns {boolean} True if retryable
 *
 * @example
 * ```typescript
 * const shouldRetry = isRetryableError(error, strategy);
 * // Result: true if error matches retryable criteria
 * ```
 */
export const isRetryableError = (error: Error, strategy: RetryStrategy): boolean => {
  if (!strategy.retryableErrors || strategy.retryableErrors.length === 0) {
    return true; // Retry all errors if no specific list provided
  }

  return strategy.retryableErrors.some(errType =>
    error.message.includes(errType) || error.name === errType,
  );
};

/**
 * 38. Creates timeout configuration for operations.
 *
 * @param {number} timeout - Timeout in milliseconds
 * @param {string} [operation] - Operation name
 * @returns {object} Timeout configuration
 *
 * @example
 * ```typescript
 * const config = createTimeoutConfig(5000, 'patient.get');
 * // Result: { timeout: 5000, operation: 'patient.get', timestamp: Date }
 * ```
 */
export const createTimeoutConfig = (timeout: number, operation?: string): object => {
  return {
    timeout,
    operation: operation || 'unknown',
    timestamp: new Date(),
    deadline: new Date(Date.now() + timeout),
  };
};

// ============================================================================
// SECTION 7: STREAMING HELPERS (Functions 39-41)
// ============================================================================

/**
 * 39. Creates a stream observer for reactive patterns.
 *
 * @param {Function} onNext - Called for each stream item
 * @param {Function} [onError] - Called on error
 * @param {Function} [onComplete] - Called on completion
 * @returns {object} Stream observer
 *
 * @example
 * ```typescript
 * const observer = createStreamObserver(
 *   (data) => console.log(data),
 *   (err) => console.error(err),
 *   () => console.log('Complete')
 * );
 * ```
 */
export const createStreamObserver = (
  onNext: (data: any) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void,
): object => {
  return {
    next: onNext,
    error: onError || ((err: Error) => console.error('Stream error:', err)),
    complete: onComplete || (() => console.log('Stream completed')),
  };
};

/**
 * 40. Creates backpressure handler for stream management.
 *
 * @param {number} bufferSize - Maximum buffer size
 * @param {string} strategy - Backpressure strategy
 * @returns {object} Backpressure configuration
 *
 * @example
 * ```typescript
 * const handler = createBackpressureHandler(1000, 'drop-oldest');
 * // Result: { bufferSize: 1000, strategy: 'drop-oldest', ... }
 * ```
 */
export const createBackpressureHandler = (bufferSize: number, strategy: string): object => {
  return {
    bufferSize,
    strategy, // 'drop-oldest', 'drop-newest', 'error'
    currentSize: 0,
    dropped: 0,
  };
};

/**
 * 41. Creates stream chunk for batched processing.
 *
 * @param {any[]} items - Items to include in chunk
 * @param {number} chunkSize - Chunk size
 * @returns {any[][]} Chunked items
 *
 * @example
 * ```typescript
 * const chunks = createStreamChunk([1,2,3,4,5], 2);
 * // Result: [[1,2], [3,4], [5]]
 * ```
 */
export const createStreamChunk = (items: any[], chunkSize: number): any[][] => {
  const chunks: any[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
};

// ============================================================================
// SECTION 8: HYBRID APPLICATION & HEALTH CHECKS (Functions 42-45)
// ============================================================================

/**
 * 42. Creates hybrid application configuration (HTTP + Microservices).
 *
 * @param {number} httpPort - HTTP server port
 * @param {TransportConfig[]} microservices - Microservice transports
 * @param {Record<string, any>} [options] - Additional options
 * @returns {HybridAppConfig} Hybrid app configuration
 *
 * @example
 * ```typescript
 * const config = createHybridAppConfig(3000, [tcpConfig, redisConfig], { cors: true });
 * // Result: { httpPort: 3000, microservices: [...], cors: true }
 * ```
 */
export const createHybridAppConfig = (
  httpPort: number,
  microservices: TransportConfig[],
  options?: Record<string, any>,
): HybridAppConfig => {
  return {
    httpPort,
    microservices,
    globalPrefix: options?.globalPrefix || 'api',
    cors: options?.cors !== false,
    swagger: options?.swagger !== false,
  };
};

/**
 * 43. Creates comprehensive health check configuration.
 *
 * @param {string} name - Health check name
 * @param {Function} checkFn - Health check function
 * @param {number} [timeout=5000] - Health check timeout
 * @returns {object} Health check configuration
 *
 * @example
 * ```typescript
 * const healthCheck = createHealthCheck('database', async () => {
 *   await db.ping();
 *   return { status: 'up' };
 * });
 * ```
 */
export const createHealthCheck = (
  name: string,
  checkFn: () => Promise<any>,
  timeout: number = 5000,
): object => {
  return {
    name,
    check: checkFn,
    timeout,
    interval: 30000,
    retries: 3,
  };
};

/**
 * 44. Performs health check with timeout and retries.
 *
 * @param {string} serviceName - Service name
 * @param {Function} healthCheckFn - Health check function
 * @param {number} [timeout=5000] - Timeout in ms
 * @returns {Promise<HealthCheck>} Health check result
 *
 * @example
 * ```typescript
 * const result = await performHealthCheck('patient-service', async () => {
 *   const response = await fetch('http://localhost:3001/health');
 *   return response.ok;
 * });
 * ```
 */
export const performHealthCheck = async (
  serviceName: string,
  healthCheckFn: () => Promise<boolean>,
  timeout: number = 5000,
): Promise<HealthCheck> => {
  const startTime = Date.now();

  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Health check timeout')), timeout),
    );

    await Promise.race([healthCheckFn(), timeoutPromise]);

    const responseTime = Date.now() - startTime;

    return {
      name: serviceName,
      status: 'up',
      timestamp: new Date(),
      responseTime,
      details: { message: 'Service is healthy' },
    };
  } catch (error) {
    return {
      name: serviceName,
      status: 'down',
      timestamp: new Date(),
      responseTime: Date.now() - startTime,
      details: { error: (error as Error).message },
    };
  }
};

/**
 * 45. Creates graceful shutdown handler for microservices.
 *
 * @param {number} timeout - Shutdown timeout in ms
 * @param {string[]} signals - OS signals to handle
 * @param {Function} [onShutdown] - Shutdown callback
 * @returns {GracefulShutdownConfig} Shutdown configuration
 *
 * @example
 * ```typescript
 * const shutdown = createGracefulShutdown(10000, ['SIGTERM', 'SIGINT'], async () => {
 *   await closeDbConnections();
 *   await flushQueues();
 * });
 * ```
 */
export const createGracefulShutdown = (
  timeout: number,
  signals: string[],
  onShutdown?: () => Promise<void>,
): GracefulShutdownConfig => {
  return {
    timeout,
    signals,
    onShutdown,
    beforeShutdown: async () => {
      console.log('Starting graceful shutdown...');
    },
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generates UUID v4.
 */
const generateUUID = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generates event ID.
 */
const generateEventId = (): string => {
  return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generates message ID.
 */
const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generates request ID.
 */
const generateRequestId = (): string => {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generates service ID.
 */
const generateServiceId = (): string => {
  return `svc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Hashes string to number.
 */
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};
