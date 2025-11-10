"use strict";
/**
 * LOC: MSVC1234567
 * File: /reuse/nestjs-microservices-patterns-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Microservices controllers and services
 *   - Event handlers and message processors
 *   - Service mesh implementations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.compensateSaga = exports.executeNextSagaStep = exports.createSagaExecution = exports.buildReadModelProjection = exports.createEventStoreEntry = exports.validateCommand = exports.createQuery = exports.createCommand = exports.createReplyPattern = exports.extractCorrelationId = exports.validateMessagePattern = exports.createDomainEvent = exports.createMessagePattern = void 0;
// ============================================================================
// MESSAGE PATTERN UTILITIES
// ============================================================================
/**
 * Creates a standardized message pattern with metadata and correlation ID.
 *
 * @template TData - Type of message data
 * @param {string} pattern - Message pattern identifier
 * @param {TData} data - Message payload
 * @param {Record<string, unknown>} [metadata] - Optional metadata
 * @returns {MessagePattern<TData>} Formatted message pattern
 * @throws {Error} If pattern is empty or data is undefined
 *
 * @example
 * ```typescript
 * const message = createMessagePattern('user.created', { id: '123', name: 'John' }, { source: 'api' });
 * // Result: { pattern: 'user.created', data: {...}, correlationId: 'uuid', timestamp: Date }
 * ```
 */
const createMessagePattern = (pattern, data, metadata) => {
    if (!pattern || pattern.trim().length === 0) {
        throw new Error('Message pattern cannot be empty');
    }
    if (data === undefined) {
        throw new Error('Message data cannot be undefined');
    }
    return {
        pattern: pattern.trim(),
        data,
        metadata: metadata || {},
        correlationId: generateCorrelationId(),
        timestamp: new Date(),
    };
};
exports.createMessagePattern = createMessagePattern;
/**
 * Creates a domain event with versioning and aggregate tracking.
 *
 * @param {string} eventType - Type of domain event
 * @param {string} aggregateId - Aggregate root identifier
 * @param {any} payload - Event payload
 * @param {number} [version=1] - Event version
 * @returns {EventPattern} Domain event object
 *
 * @example
 * ```typescript
 * const event = createDomainEvent('PatientAdmitted', 'patient-123', { room: '401' }, 1);
 * // Result: { eventType: 'PatientAdmitted', aggregateId: 'patient-123', payload: {...}, version: 1 }
 * ```
 */
const createDomainEvent = (eventType, aggregateId, payload, version = 1) => {
    return {
        eventType,
        aggregateId,
        payload,
        version,
        timestamp: new Date(),
        metadata: {
            eventId: generateEventId(),
            causationId: generateCorrelationId(),
        },
    };
};
exports.createDomainEvent = createDomainEvent;
/**
 * Validates message pattern structure and required fields.
 *
 * @param {MessagePattern} message - Message to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateMessagePattern({ pattern: 'test', data: {} });
 * // Result: true
 * ```
 */
const validateMessagePattern = (message) => {
    return !!(message &&
        message.pattern &&
        typeof message.pattern === 'string' &&
        message.data !== undefined);
};
exports.validateMessagePattern = validateMessagePattern;
/**
 * Extracts correlation ID from message or generates new one.
 *
 * @param {MessagePattern | any} message - Message object
 * @returns {string} Correlation ID
 *
 * @example
 * ```typescript
 * const corrId = extractCorrelationId(message);
 * // Result: 'corr-uuid-1234'
 * ```
 */
const extractCorrelationId = (message) => {
    return message?.correlationId || message?.metadata?.correlationId || generateCorrelationId();
};
exports.extractCorrelationId = extractCorrelationId;
/**
 * Creates a reply pattern for request-response communication.
 *
 * @param {string} originalPattern - Original request pattern
 * @param {any} responseData - Response payload
 * @param {string} correlationId - Correlation ID from request
 * @returns {MessagePattern} Reply message pattern
 *
 * @example
 * ```typescript
 * const reply = createReplyPattern('user.get', { id: '123', name: 'John' }, 'corr-123');
 * // Result: { pattern: 'user.get.reply', data: {...}, correlationId: 'corr-123' }
 * ```
 */
const createReplyPattern = (originalPattern, responseData, correlationId) => {
    return {
        pattern: `${originalPattern}.reply`,
        data: responseData,
        correlationId,
        timestamp: new Date(),
    };
};
exports.createReplyPattern = createReplyPattern;
// ============================================================================
// CQRS UTILITIES
// ============================================================================
/**
 * Creates a CQRS command message with validation and metadata.
 *
 * @param {string} commandType - Type of command
 * @param {string} aggregateId - Target aggregate ID
 * @param {any} payload - Command payload
 * @param {string} [userId] - User initiating command
 * @returns {CommandMessage} Command message
 *
 * @example
 * ```typescript
 * const cmd = createCommand('UpdatePatientRecord', 'patient-123', { name: 'John' }, 'user-456');
 * // Result: { commandId: 'cmd-uuid', commandType: 'UpdatePatientRecord', ... }
 * ```
 */
const createCommand = (commandType, aggregateId, payload, userId) => {
    return {
        commandId: generateCommandId(),
        commandType,
        aggregateId,
        payload,
        timestamp: new Date(),
        userId,
        metadata: {
            source: 'api',
            version: 1,
        },
    };
};
exports.createCommand = createCommand;
/**
 * Creates a CQRS query message with parameters and filtering.
 *
 * @param {string} queryType - Type of query
 * @param {Record<string, any>} parameters - Query parameters
 * @param {string} [userId] - User executing query
 * @returns {QueryMessage} Query message
 *
 * @example
 * ```typescript
 * const query = createQuery('GetPatientHistory', { patientId: '123', startDate: '2024-01-01' });
 * // Result: { queryId: 'qry-uuid', queryType: 'GetPatientHistory', ... }
 * ```
 */
const createQuery = (queryType, parameters, userId) => {
    return {
        queryId: generateQueryId(),
        queryType,
        parameters,
        timestamp: new Date(),
        userId,
    };
};
exports.createQuery = createQuery;
/**
 * Validates command message structure and authorization.
 *
 * @param {CommandMessage} command - Command to validate
 * @param {string[]} [allowedCommands] - List of allowed command types
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateCommand(cmd, ['UpdatePatientRecord', 'CreateAppointment']);
 * // Result: true
 * ```
 */
const validateCommand = (command, allowedCommands) => {
    if (!command || !command.commandType || !command.aggregateId) {
        return false;
    }
    if (allowedCommands && !allowedCommands.includes(command.commandType)) {
        return false;
    }
    return true;
};
exports.validateCommand = validateCommand;
/**
 * Creates an event store entry from domain event.
 *
 * @param {EventPattern} event - Domain event
 * @param {string} streamName - Event stream name
 * @returns {any} Event store entry
 *
 * @example
 * ```typescript
 * const entry = createEventStoreEntry(event, 'patient-stream');
 * // Result: { streamName: 'patient-stream', event: {...}, position: 0 }
 * ```
 */
const createEventStoreEntry = (event, streamName) => {
    return {
        streamName,
        event,
        position: 0, // Will be set by event store
        timestamp: new Date(),
        metadata: {
            eventId: event.metadata?.eventId,
            aggregateId: event.aggregateId,
            version: event.version,
        },
    };
};
exports.createEventStoreEntry = createEventStoreEntry;
/**
 * Builds a read model projection from event stream.
 *
 * @param {EventPattern[]} events - Array of domain events
 * @param {any} initialState - Initial state of projection
 * @param {Record<string, Function>} handlers - Event handlers by type
 * @returns {any} Projected read model
 *
 * @example
 * ```typescript
 * const projection = buildReadModelProjection(
 *   events,
 *   { id: '123', visits: 0 },
 *   { 'PatientVisited': (state, event) => ({ ...state, visits: state.visits + 1 }) }
 * );
 * ```
 */
const buildReadModelProjection = (events, initialState, handlers) => {
    return events.reduce((state, event) => {
        const handler = handlers[event.eventType];
        return handler ? handler(state, event) : state;
    }, initialState);
};
exports.buildReadModelProjection = buildReadModelProjection;
// ============================================================================
// SAGA ORCHESTRATION UTILITIES
// ============================================================================
/**
 * Creates a saga execution context with compensation tracking.
 *
 * @param {string} sagaId - Unique saga identifier
 * @param {SagaStep[]} steps - Array of saga steps
 * @param {any} initialData - Initial saga data
 * @returns {SagaExecution} Saga execution context
 *
 * @example
 * ```typescript
 * const saga = createSagaExecution('saga-123', [step1, step2], { orderId: '456' });
 * // Result: { sagaId: 'saga-123', steps: [...], status: 'pending', ... }
 * ```
 */
const createSagaExecution = (sagaId, steps, initialData) => {
    return {
        sagaId,
        steps,
        currentStep: 0,
        status: 'pending',
        data: initialData,
        completedSteps: [],
    };
};
exports.createSagaExecution = createSagaExecution;
/**
 * Executes next saga step with timeout and error handling.
 *
 * @param {SagaExecution} saga - Saga execution context
 * @returns {Promise<SagaExecution>} Updated saga context
 *
 * @example
 * ```typescript
 * const updatedSaga = await executeNextSagaStep(saga);
 * // Result: Saga with currentStep incremented and status updated
 * ```
 */
const executeNextSagaStep = async (saga) => {
    if (saga.currentStep >= saga.steps.length) {
        return { ...saga, status: 'completed' };
    }
    const step = saga.steps[saga.currentStep];
    saga.status = 'running';
    try {
        const timeout = step.timeout || 30000;
        const result = await executeWithTimeout(() => step.execute(saga.data), timeout);
        return {
            ...saga,
            currentStep: saga.currentStep + 1,
            data: { ...saga.data, ...result },
            completedSteps: [...saga.completedSteps, step.stepId],
        };
    }
    catch (error) {
        return {
            ...saga,
            status: 'failed',
            error: error,
        };
    }
};
exports.executeNextSagaStep = executeNextSagaStep;
/**
 * Compensates saga by executing rollback steps in reverse order.
 *
 * @template TData - Type of saga data
 * @param {SagaExecution<TData>} saga - Failed saga execution
 * @param {(error: Error, stepId: string) => void} [errorLogger] - Optional error logger
 * @returns {Promise<SagaExecution<TData>>} Compensated saga
 * @throws {Error} If compensation fails critically
 *
 * @example
 * ```typescript
 * const compensated = await compensateSaga(failedSaga);
 * // Result: Saga with compensating status and rolled back steps
 * ```
 */
const compensateSaga = async (saga, errorLogger) => {
    saga.status = 'compensating';
    const compensationErrors = [];
    for (let i = saga.completedSteps.length - 1; i >= 0; i--) {
        const stepId = saga.completedSteps[i];
        const step = saga.steps.find(s => s.stepId === stepId);
        if (step && step.compensate) {
            try {
                await step.compensate(saga.data);
            }
            catch (error) {
                const err = error instanceof Error ? error : new Error(String(error));
                compensationErrors.push({ stepId, error: err });
                if (errorLogger) {
                    errorLogger(err, stepId);
                }
            }
        }
    }
    if (compensationErrors.length > 0) {
        const errorMessage = `Compensation failed for steps: ${compensationErrors.map(e => e.stepId).join(', ')}`;
        throw new Error(errorMessage);
    }
    return { ...saga, status: 'failed', completedSteps: [] };
};
exports.compensateSaga = compensateSaga;
    * ;
;
    * `` `
 */
export const createSagaStep = <TData = unknown, TResult = unknown>(
  stepName: string,
  execute: (data: TData) => Promise<TResult>,
  compensate: (data: TData) => Promise<void>,
  timeout?: number,
): SagaStep<TData, TResult> => {
  if (!stepName || stepName.trim().length === 0) {
    throw new Error('Step name cannot be empty');
  }

  return {
    stepId: `;
step - $;
{
    Date.now();
}
-$;
{
    Math.random().toString(36).substring(2, 11);
}
`,
    stepName: stepName.trim(),
    execute,
    compensate,
    timeout,
  };
};

/**
 * Monitors saga execution progress and timeout.
 *
 * @param {SagaExecution} saga - Saga to monitor
 * @param {number} maxDuration - Maximum saga duration in ms
 * @returns {boolean} True if saga is still valid
 *
 * @example
 * ` ``;
typescript
    * ;
const isValid = monitorSagaProgress(saga, 300000); // 5 minutes
    *
// Result: true if saga hasn't timed out
    * `` `
 */
export const monitorSagaProgress = (saga: SagaExecution, maxDuration: number): boolean => {
  // In real implementation, would track start time
  return saga.status !== 'failed' && saga.status !== 'completed';
};

// ============================================================================
// CIRCUIT BREAKER UTILITIES
// ============================================================================

/**
 * Creates a circuit breaker with configurable thresholds.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {CircuitBreakerState} Initial circuit breaker state
 *
 * @example
 * ` ``;
typescript
    * ;
const breaker = createCircuitBreaker({});
    * `` `
 */
export const createCircuitBreaker = (config: CircuitBreakerConfig): CircuitBreakerState => {
  return {
    state: 'CLOSED',
    failures: 0,
    successes: 0,
    lastFailureTime: 0,
    nextAttempt: 0,
  };
};

/**
 * Executes function with circuit breaker protection.
 *
 * @template TResult - Type of function result
 * @param {() => Promise<TResult>} fn - Function to execute
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @param {CircuitBreakerConfig} config - Configuration
 * @returns {Promise<TResult>} Function result
 * @throws {Error} If circuit breaker is OPEN or function fails
 *
 * @example
 * ` ``;
typescript
    * ;
const result = await executeWithCircuitBreaker(
    * ());
externalService.call(),
        * breakerState,
        * breakerConfig
        * ;
;
    * `` `
 */
export const executeWithCircuitBreaker = async <TResult = unknown>(
  fn: () => Promise<TResult>,
  state: CircuitBreakerState,
  config: CircuitBreakerConfig,
): Promise<TResult> => {
  if (state.state === 'OPEN') {
    if (Date.now() < state.nextAttempt) {
      const waitTime = Math.ceil((state.nextAttempt - Date.now()) / 1000);
      throw new Error(`;
Circuit;
breaker;
is;
OPEN.Retry;
after;
$;
{
    waitTime;
}
seconds `);
    }
    state.state = 'HALF_OPEN';
    state.successes = 0;
  }

  try {
    const result = await fn();
    state.failures = 0;
    state.successes++;

    if (state.state === 'HALF_OPEN' && state.successes >= config.successThreshold) {
      state.state = 'CLOSED';
      state.successes = 0;
    }

    return result;
  } catch (error) {
    state.failures++;
    state.lastFailureTime = Date.now();

    if (state.failures >= config.failureThreshold) {
      state.state = 'OPEN';
      state.nextAttempt = Date.now() + config.resetTimeout;
    }

    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Checks if circuit breaker should allow request.
 *
 * @param {CircuitBreakerState} state - Circuit breaker state
 * @param {CircuitBreakerConfig} config - Configuration
 * @returns {boolean} True if request allowed
 *
 * @example
 * ` ``;
typescript
    * ;
if (shouldAllowRequest(state, config)) {
        * await makeRequest();
        * ;
}
    * `` `
 */
export const shouldAllowRequest = (
  state: CircuitBreakerState,
  config: CircuitBreakerConfig,
): boolean => {
  if (state.state === 'CLOSED') return true;
  if (state.state === 'HALF_OPEN') return true;
  if (state.state === 'OPEN' && Date.now() >= state.nextAttempt) return true;
  return false;
};

/**
 * Resets circuit breaker to initial state.
 *
 * @param {CircuitBreakerState} state - Circuit breaker state to reset
 * @returns {CircuitBreakerState} Reset state
 *
 * @example
 * ` ``;
typescript
    * ;
const resetState = resetCircuitBreaker(state);
    *
// Result: { state: 'CLOSED', failures: 0, successes: 0, ... }
    * `` `
 */
export const resetCircuitBreaker = (state: CircuitBreakerState): CircuitBreakerState => {
  return {
    state: 'CLOSED',
    failures: 0,
    successes: 0,
    lastFailureTime: 0,
    nextAttempt: 0,
  };
};

// ============================================================================
// SERVICE DISCOVERY & LOAD BALANCING
// ============================================================================

/**
 * Registers a service instance in service registry.
 *
 * @param {string} serviceName - Service name
 * @param {string} host - Service host
 * @param {number} port - Service port
 * @param {Record<string, any>} [metadata] - Service metadata
 * @returns {ServiceInstance} Registered service instance
 *
 * @example
 * ` ``;
typescript
    * ;
const instance = registerServiceInstance('patient-service', 'localhost', 3001, { version: '1.0' });
    * `` `
 */
export const registerServiceInstance = (
  serviceName: string,
  host: string,
  port: number,
  metadata?: Record<string, any>,
): ServiceInstance => {
  return {
    id: generateServiceId(),
    name: serviceName,
    host,
    port,
    protocol: 'tcp',
    status: 'healthy',
    metadata,
    lastHeartbeat: new Date(),
  };
};

/**
 * Selects service instance using load balancing strategy.
 *
 * @param {ServiceInstance[]} instances - Available instances
 * @param {LoadBalancerConfig} config - Load balancer configuration
 * @param {any} [context] - Request context for routing
 * @returns {ServiceInstance | null} Selected instance
 *
 * @example
 * ` ``;
typescript
    * ;
const instance = selectServiceInstance(instances, { strategy: 'round-robin' });
    * `` `
 */
export const selectServiceInstance = (
  instances: ServiceInstance[],
  config: LoadBalancerConfig,
  context?: any,
): ServiceInstance | null => {
  const healthy = instances.filter(i => i.status === 'healthy');
  if (healthy.length === 0) return null;

  switch (config.strategy) {
    case 'round-robin':
      // Simple implementation - in real scenario would track index
      return healthy[Math.floor(Date.now() / 1000) % healthy.length];

    case 'random':
      return healthy[Math.floor(Math.random() * healthy.length)];

    case 'least-connections':
      // Would track active connections in real implementation
      return healthy[0];

    default:
      return healthy[0];
  }
};

/**
 * Performs health check on service instance.
 *
 * @param {ServiceInstance} instance - Service instance
 * @param {Function} healthCheckFn - Health check function
 * @returns {Promise<HealthCheckResult>} Health check result
 *
 * @example
 * ` ``;
typescript
    * ;
const health = await performHealthCheck(instance, async () => {
        * ;
    const response = await fetch(`http://${instance.host}:${instance.port}/health`);
        * ;
    return response.ok;
        * ;
});
    * `` `
 */
export const performHealthCheck = async (
  instance: ServiceInstance,
  healthCheckFn: Function,
): Promise<HealthCheckResult> => {
  const startTime = Date.now();

  try {
    await healthCheckFn();
    const responseTime = Date.now() - startTime;

    return {
      service: instance.name,
      status: 'healthy',
      timestamp: new Date(),
      responseTime,
      details: { instanceId: instance.id },
    };
  } catch (error) {
    return {
      service: instance.name,
      status: 'unhealthy',
      timestamp: new Date(),
      details: { error: (error as Error).message },
    };
  }
};

/**
 * Updates service instance heartbeat and status.
 *
 * @param {ServiceInstance} instance - Service instance
 * @param {boolean} isHealthy - Health status
 * @returns {ServiceInstance} Updated instance
 *
 * @example
 * ` ``;
typescript
    * ;
const updated = updateServiceHeartbeat(instance, true);
    * `` `
 */
export const updateServiceHeartbeat = (
  instance: ServiceInstance,
  isHealthy: boolean,
): ServiceInstance => {
  return {
    ...instance,
    status: isHealthy ? 'healthy' : 'unhealthy',
    lastHeartbeat: new Date(),
  };
};

// ============================================================================
// BULKHEAD PATTERN UTILITIES
// ============================================================================

/**
 * Creates a bulkhead isolation boundary for service calls.
 *
 * @param {BulkheadConfig} config - Bulkhead configuration
 * @returns {BulkheadState} Initial bulkhead state
 *
 * @example
 * ` ``;
typescript
    * ;
const bulkhead = createBulkhead({ maxConcurrent: 10, maxQueue: 20, timeout: 5000 });
    * `` `
 */
export const createBulkhead = (config: BulkheadConfig): BulkheadState => {
  return {
    current: 0,
    queued: 0,
    rejected: 0,
    completed: 0,
  };
};

/**
 * Executes function within bulkhead constraints.
 *
 * @param {Function} fn - Function to execute
 * @param {BulkheadState} state - Bulkhead state
 * @param {BulkheadConfig} config - Bulkhead configuration
 * @returns {Promise<any>} Function result
 *
 * @example
 * ` ``;
typescript
    * ;
const result = await executeWithBulkhead(
    * ());
externalService.call(),
        * bulkheadState,
        * bulkheadConfig
        * ;
;
    * `` `
 */
export const executeWithBulkhead = async (
  fn: Function,
  state: BulkheadState,
  config: BulkheadConfig,
): Promise<any> => {
  if (state.current >= config.maxConcurrent) {
    if (state.queued >= config.maxQueue) {
      state.rejected++;
      throw new Error('Bulkhead capacity exceeded');
    }
    state.queued++;
  }

  state.current++;

  try {
    const result = await executeWithTimeout(fn, config.timeout);
    state.completed++;
    return result;
  } finally {
    state.current--;
    if (state.queued > 0) state.queued--;
  }
};

/**
 * Checks if bulkhead has available capacity.
 *
 * @param {BulkheadState} state - Bulkhead state
 * @param {BulkheadConfig} config - Configuration
 * @returns {boolean} True if capacity available
 *
 * @example
 * ` ``;
typescript
    * ;
if (hasBulkheadCapacity(state, config)) {
        * await executeRequest();
        * ;
}
    * `` `
 */
export const hasBulkheadCapacity = (
  state: BulkheadState,
  config: BulkheadConfig,
): boolean => {
  return state.current < config.maxConcurrent || state.queued < config.maxQueue;
};

// ============================================================================
// DISTRIBUTED TRACING UTILITIES
// ============================================================================

/**
 * Creates a distributed trace context for request tracking.
 *
 * @param {string} serviceName - Name of current service
 * @param {string} operation - Operation being performed
 * @param {string} [parentSpanId] - Parent span ID for nested calls
 * @returns {DistributedTraceContext} Trace context
 *
 * @example
 * ` ``;
typescript
    * ;
const trace = createTraceContext('patient-service', 'getPatient', parentSpan);
    * `` `
 */
export const createTraceContext = (
  serviceName: string,
  operation: string,
  parentSpanId?: string,
): DistributedTraceContext => {
  return {
    traceId: parentSpanId ? extractTraceId(parentSpanId) : generateTraceId(),
    spanId: generateSpanId(),
    parentSpanId,
    serviceName,
    operation,
    startTime: new Date(),
    tags: {},
  };
};

/**
 * Adds tags to trace context for enriched logging.
 *
 * @param {DistributedTraceContext} context - Trace context
 * @param {Record<string, any>} tags - Tags to add
 * @returns {DistributedTraceContext} Updated context
 *
 * @example
 * ` ``;
typescript
    * ;
const updated = addTraceTag(context, { userId: '123', patientId: '456' });
    * `` `
 */
export const addTraceTag = (
  context: DistributedTraceContext,
  tags: Record<string, any>,
): DistributedTraceContext => {
  return {
    ...context,
    tags: { ...context.tags, ...tags },
  };
};

/**
 * Extracts trace context from message headers.
 *
 * @param {Record<string, any>} headers - Message headers
 * @returns {DistributedTraceContext | null} Extracted trace context
 *
 * @example
 * ` ``;
typescript
    * ;
const trace = extractTraceContext(message.headers);
    * `` `
 */
export const extractTraceContext = (
  headers: Record<string, any>,
): DistributedTraceContext | null => {
  if (!headers || !headers['x-trace-id']) return null;

  return {
    traceId: headers['x-trace-id'],
    spanId: headers['x-span-id'] || generateSpanId(),
    parentSpanId: headers['x-parent-span-id'],
    serviceName: headers['x-service-name'] || 'unknown',
    operation: headers['x-operation'] || 'unknown',
    startTime: new Date(),
    tags: {},
  };
};

/**
 * Injects trace context into message headers.
 *
 * @param {DistributedTraceContext} context - Trace context
 * @param {Record<string, any>} headers - Message headers
 * @returns {Record<string, any>} Headers with trace context
 *
 * @example
 * ` ``;
typescript
    * ;
const headers = injectTraceContext(trace, {});
    * `` `
 */
export const injectTraceContext = (
  context: DistributedTraceContext,
  headers: Record<string, any>,
): Record<string, any> => {
  return {
    ...headers,
    'x-trace-id': context.traceId,
    'x-span-id': context.spanId,
    'x-parent-span-id': context.parentSpanId,
    'x-service-name': context.serviceName,
    'x-operation': context.operation,
  };
};

// ============================================================================
// RABBITMQ UTILITIES
// ============================================================================

/**
 * Creates a RabbitMQ message with routing and priority.
 *
 * @param {string} pattern - Message pattern/routing key
 * @param {any} data - Message payload
 * @param {number} [priority] - Message priority (0-10)
 * @param {number} [expiration] - TTL in milliseconds
 * @returns {RabbitMQMessage} Formatted RabbitMQ message
 *
 * @example
 * ` ``;
typescript
    * ;
const msg = createRabbitMQMessage('patient.created', { id: '123' }, 5, 60000);
    * `` `
 */
export const createRabbitMQMessage = (
  pattern: string,
  data: any,
  priority?: number,
  expiration?: number,
): RabbitMQMessage => {
  return {
    pattern,
    data,
    correlationId: generateCorrelationId(),
    priority: priority || 0,
    expiration,
    headers: {
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * Creates RabbitMQ dead letter exchange configuration.
 *
 * @param {string} exchangeName - Dead letter exchange name
 * @param {string} routingKey - Dead letter routing key
 * @returns {Record<string, any>} DLX configuration
 *
 * @example
 * ` ``;
typescript
    * ;
const dlxConfig = createDeadLetterExchange('dlx-exchange', 'dlx-key');
    * `` `
 */
export const createDeadLetterExchange = (
  exchangeName: string,
  routingKey: string,
): Record<string, any> => {
  return {
    'x-dead-letter-exchange': exchangeName,
    'x-dead-letter-routing-key': routingKey,
  };
};

/**
 * Acknowledges RabbitMQ message with retry tracking.
 *
 * @param {any} channel - RabbitMQ channel
 * @param {any} message - Message to acknowledge
 * @param {boolean} [requeue=false] - Whether to requeue on nack
 * @returns {void}
 *
 * @example
 * ` ``;
typescript
    * ackRabbitMQMessage(channel, message);
    * `` `
 */
export const ackRabbitMQMessage = (
  channel: any,
  message: any,
  requeue: boolean = false,
): void => {
  if (message) {
    channel.ack(message);
  }
};

/**
 * Rejects RabbitMQ message with requeue option.
 *
 * @param {any} channel - RabbitMQ channel
 * @param {any} message - Message to reject
 * @param {boolean} [requeue=true] - Whether to requeue
 * @returns {void}
 *
 * @example
 * ` ``;
typescript
    * nackRabbitMQMessage(channel, message, false); // Send to DLX
    * `` `
 */
export const nackRabbitMQMessage = (
  channel: any,
  message: any,
  requeue: boolean = true,
): void => {
  if (message) {
    channel.nack(message, false, requeue);
  }
};

// ============================================================================
// KAFKA UTILITIES
// ============================================================================

/**
 * Creates a Kafka message with partitioning and headers.
 *
 * @param {string} topic - Kafka topic
 * @param {any} value - Message value
 * @param {string} [key] - Partition key
 * @param {Record<string, string>} [headers] - Message headers
 * @returns {KafkaMessage} Formatted Kafka message
 *
 * @example
 * ` ``;
typescript
    * ;
const msg = createKafkaMessage('patient-events', { id: '123' }, 'patient-123');
    * `` `
 */
export const createKafkaMessage = (
  topic: string,
  value: any,
  key?: string,
  headers?: Record<string, string>,
): KafkaMessage => {
  return {
    topic,
    value: JSON.stringify(value),
    key,
    headers: {
      ...headers,
      timestamp: new Date().toISOString(),
      'message-id': generateMessageId(),
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * Determines Kafka partition from message key.
 *
 * @param {string} key - Partition key
 * @param {number} partitionCount - Total partitions
 * @returns {number} Partition number
 *
 * @example
 * ` ``;
typescript
    * ;
const partition = determineKafkaPartition('patient-123', 10);
    *
// Result: 3 (deterministic hash)
    * `` `
 */
export const determineKafkaPartition = (key: string, partitionCount: number): number => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % partitionCount;
};

/**
 * Creates Kafka consumer group configuration.
 *
 * @param {string} groupId - Consumer group ID
 * @param {string[]} topics - Topics to subscribe to
 * @param {Record<string, any>} [options] - Additional options
 * @returns {Record<string, any>} Consumer configuration
 *
 * @example
 * ` ``;
typescript
    * ;
const config = createKafkaConsumerGroup('patient-processor', ['patient-events']);
    * `` `
 */
export const createKafkaConsumerGroup = (
  groupId: string,
  topics: string[],
  options?: Record<string, any>,
): Record<string, any> => {
  return {
    groupId,
    topics,
    fromBeginning: options?.fromBeginning || false,
    autoCommit: options?.autoCommit !== false,
    sessionTimeout: options?.sessionTimeout || 30000,
  };
};

// ============================================================================
// REDIS PUB/SUB UTILITIES
// ============================================================================

/**
 * Creates a Redis pub/sub channel subscription.
 *
 * @param {string} channel - Channel name
 * @param {Function} handler - Message handler
 * @param {boolean} [pattern=false] - Whether to use pattern matching
 * @returns {RedisChannel} Channel subscription
 *
 * @example
 * ` ``;
typescript
    * ;
const subscription = createRedisChannel('patient:*', (msg) => console.log(msg), true);
    * `` `
 */
export const createRedisChannel = (
  channel: string,
  handler: (message: any) => void | Promise<void>,
  pattern: boolean = false,
): RedisChannel => {
  return {
    channel,
    pattern,
    handler,
  };
};

/**
 * Publishes message to Redis channel with serialization.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} channel - Channel name
 * @param {any} message - Message to publish
 * @returns {Promise<number>} Number of subscribers that received message
 *
 * @example
 * ` ``;
typescript
    * await publishToRedisChannel(redis, 'patient:created', { id: '123' });
    * `` `
 */
export const publishToRedisChannel = async (
  redisClient: any,
  channel: string,
  message: any,
): Promise<number> => {
  const serialized = typeof message === 'string' ? message : JSON.stringify(message);
  return await redisClient.publish(channel, serialized);
};

/**
 * Creates Redis stream entry for event sourcing.
 *
 * @param {any} redisClient - Redis client instance
 * @param {string} streamKey - Stream key
 * @param {Record<string, any>} data - Stream entry data
 * @returns {Promise<string>} Entry ID
 *
 * @example
 * ` ``;
typescript
    * ;
const entryId = await createRedisStreamEntry(redis, 'patient-stream', { event: 'created' });
    * `` `
 */
export const createRedisStreamEntry = async (
  redisClient: any,
  streamKey: string,
  data: Record<string, any>,
): Promise<string> => {
  const args = Object.entries(data).flat();
  return await redisClient.xadd(streamKey, '*', ...args);
};

// ============================================================================
// GRPC UTILITIES
// ============================================================================

/**
 * Creates gRPC service definition from proto file.
 *
 * @param {string} packageName - gRPC package name
 * @param {string} serviceName - Service name
 * @param {string} protoPath - Path to .proto file
 * @returns {GrpcServiceDefinition} Service definition
 *
 * @example
 * ` ``;
typescript
    * ;
const def = createGrpcServiceDefinition('healthcare', 'PatientService', './patient.proto');
    * `` `
 */
export const createGrpcServiceDefinition = (
  packageName: string,
  serviceName: string,
  protoPath: string,
): GrpcServiceDefinition => {
  return {
    package: packageName,
    service: serviceName,
    protoPath,
    methods: [],
  };
};

/**
 * Creates gRPC metadata for request context.
 *
 * @param {Record<string, string>} metadata - Metadata key-value pairs
 * @returns {any} gRPC metadata object
 *
 * @example
 * ` ``;
typescript
    * ;
const meta = createGrpcMetadata({ 'user-id': '123', 'trace-id': 'abc' });
    * `` `
 */
export const createGrpcMetadata = (metadata: Record<string, string>): any => {
  // In real implementation, would use @grpc/grpc-js Metadata
  return metadata;
};

/**
 * Handles gRPC streaming with backpressure.
 *
 * @param {any} stream - gRPC stream
 * @param {Function} handler - Message handler
 * @returns {Promise<void>} Completion promise
 *
 * @example
 * ` ``;
typescript
    * await handleGrpcStream(stream, async (data) => {
            * await processData(data);
            * ;
    });
    * `` `
 */
export const handleGrpcStream = async (
  stream: any,
  handler: (data: any) => Promise<void>,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    stream.on('data', async (data: any) => {
      try {
        await handler(data);
      } catch (error) {
        reject(error);
      }
    });

    stream.on('end', () => resolve());
    stream.on('error', (error: Error) => reject(error));
  });
};

// ============================================================================
// RETRY & RESILIENCE UTILITIES
// ============================================================================

/**
 * Creates exponential backoff retry policy.
 *
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms
 * @param {number} maxDelay - Maximum delay in ms
 * @param {boolean} [jitter=true] - Add random jitter
 * @returns {RetryPolicy} Retry policy configuration
 *
 * @example
 * ` ``;
typescript
    * ;
const policy = createRetryPolicy(5, 1000, 30000);
    * `` `
 */
export const createRetryPolicy = (
  maxAttempts: number,
  baseDelay: number,
  maxDelay: number,
  jitter: boolean = true,
): RetryPolicy => {
  return {
    maxAttempts,
    baseDelay,
    maxDelay,
    backoffMultiplier: 2,
    jitter,
  };
};

/**
 * Executes function with retry policy and exponential backoff.
 *
 * @param {Function} fn - Function to execute
 * @param {RetryPolicy} policy - Retry policy
 * @returns {Promise<any>} Function result
 *
 * @example
 * ` ``;
typescript
    * ;
const result = await executeWithRetry(
    * ());
externalService.call(),
        * retryPolicy
        * ;
;
    * `` `
 */
export const executeWithRetry = async (
  fn: Function,
  policy: RetryPolicy,
): Promise<any> => {
  let lastError: Error;

  for (let attempt = 0; attempt < policy.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < policy.maxAttempts - 1) {
        const delay = calculateBackoffDelay(
          attempt,
          policy.baseDelay,
          policy.maxDelay,
          policy.backoffMultiplier,
          policy.jitter,
        );
        await sleep(delay);
      }
    }
  }

  throw lastError!;
};

/**
 * Calculates exponential backoff delay with jitter.
 *
 * @param {number} attempt - Current attempt number
 * @param {number} baseDelay - Base delay in ms
 * @param {number} maxDelay - Maximum delay in ms
 * @param {number} multiplier - Backoff multiplier
 * @param {boolean} [jitter=true] - Add random jitter
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ` ``;
typescript
    * ;
const delay = calculateBackoffDelay(2, 1000, 30000, 2);
    *
// Result: ~4000ms (1000 * 2^2) with jitter
    * `` `
 */
export const calculateBackoffDelay = (
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  multiplier: number,
  jitter: boolean = true,
): number => {
  let delay = Math.min(baseDelay * Math.pow(multiplier, attempt), maxDelay);

  if (jitter) {
    delay = delay * (0.5 + Math.random() * 0.5); // 50-100% of calculated delay
  }

  return Math.floor(delay);
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generates unique correlation ID for distributed tracing.
 */
const generateCorrelationId = (): string => {
  return `;
corr - $;
{
    Date.now();
}
-$;
{
    Math.random().toString(36).substring(2, 11);
}
`;
};

/**
 * Generates unique event ID.
 */
const generateEventId = (): string => {
  return `;
evt - $;
{
    Date.now();
}
-$;
{
    Math.random().toString(36).substring(2, 11);
}
`;
};

/**
 * Generates unique command ID.
 */
const generateCommandId = (): string => {
  return `;
cmd - $;
{
    Date.now();
}
-$;
{
    Math.random().toString(36).substring(2, 11);
}
`;
};

/**
 * Generates unique query ID.
 */
const generateQueryId = (): string => {
  return `;
qry - $;
{
    Date.now();
}
-$;
{
    Math.random().toString(36).substring(2, 11);
}
`;
};

/**
 * Generates unique service ID.
 */
const generateServiceId = (): string => {
  return `;
svc - $;
{
    Date.now();
}
-$;
{
    Math.random().toString(36).substring(2, 11);
}
`;
};

/**
 * Generates unique trace ID.
 */
const generateTraceId = (): string => {
  return `;
trace - $;
{
    Date.now();
}
-$;
{
    Math.random().toString(36).substring(2, 11);
}
`;
};

/**
 * Generates unique span ID.
 */
const generateSpanId = (): string => {
  return `;
span - $;
{
    Date.now();
}
-$;
{
    Math.random().toString(36).substring(2, 11);
}
`;
};

/**
 * Generates unique message ID.
 */
const generateMessageId = (): string => {
  return `;
msg - $;
{
    Date.now();
}
-$;
{
    Math.random().toString(36).substring(2, 11);
}
`;
};

/**
 * Extracts trace ID from span ID or generates new one.
 */
const extractTraceId = (spanId: string): string => {
  return spanId.split('-')[1] || generateTraceId();
};

/**
 * Executes function with timeout.
 */
const executeWithTimeout = async (fn: Function, timeoutMs: number): Promise<any> => {
  return Promise.race([
    fn(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    ),
  ]);
};

/**
 * Sleep utility for delays.
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
;
//# sourceMappingURL=nestjs-microservices-patterns-kit.js.map