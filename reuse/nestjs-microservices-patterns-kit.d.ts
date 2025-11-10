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
/**
 * File: /reuse/nestjs-microservices-patterns-kit.ts
 * Locator: WC-UTL-MSVC-001
 * Purpose: Comprehensive NestJS Microservices Patterns - CQRS, Saga, Circuit Breakers, Service Discovery, Message Patterns
 *
 * Upstream: Independent utility module for microservices and distributed systems
 * Downstream: ../backend/*, microservices controllers, event handlers, service orchestrators
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/microservices, RabbitMQ, Kafka, Redis, gRPC
 * Exports: 45 utility functions for microservices patterns, distributed systems, resilience patterns, message handling
 *
 * LLM Context: Comprehensive microservices utilities for implementing production-ready distributed systems in White Cross.
 * Provides message patterns, event bus, CQRS helpers, saga orchestration, circuit breakers, bulkhead patterns, service
 * discovery, load balancing, health checks, distributed tracing, RabbitMQ/Kafka/Redis/gRPC helpers, and service mesh patterns.
 * Essential for building scalable, resilient healthcare microservices with HIPAA compliance.
 */
interface MessagePattern<TData = unknown> {
    pattern: string;
    data: TData;
    metadata?: Record<string, unknown>;
    correlationId?: string;
    timestamp?: Date;
}
interface EventPattern<TPayload = unknown> {
    eventType: string;
    aggregateId: string;
    payload: TPayload;
    version: number;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}
interface CommandMessage<TPayload = unknown> {
    commandId: string;
    commandType: string;
    aggregateId: string;
    payload: TPayload;
    timestamp: Date;
    userId?: string;
    metadata?: Record<string, unknown>;
}
interface QueryMessage {
    queryId: string;
    queryType: string;
    parameters: Record<string, unknown>;
    timestamp: Date;
    userId?: string;
}
interface SagaStep<TData = unknown, TResult = unknown> {
    stepId: string;
    stepName: string;
    execute: (data: TData) => Promise<TResult>;
    compensate: (data: TData) => Promise<void>;
    timeout?: number;
}
interface SagaExecution<TData = unknown> {
    sagaId: string;
    steps: SagaStep<TData, unknown>[];
    currentStep: number;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'compensating';
    data: TData;
    completedSteps: string[];
    error?: Error;
}
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
export declare const createMessagePattern: <TData = unknown>(pattern: string, data: TData, metadata?: Record<string, unknown>) => MessagePattern<TData>;
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
export declare const createDomainEvent: (eventType: string, aggregateId: string, payload: any, version?: number) => EventPattern;
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
export declare const validateMessagePattern: (message: MessagePattern) => boolean;
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
export declare const extractCorrelationId: (message: MessagePattern | any) => string;
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
export declare const createReplyPattern: (originalPattern: string, responseData: any, correlationId: string) => MessagePattern;
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
export declare const createCommand: (commandType: string, aggregateId: string, payload: any, userId?: string) => CommandMessage;
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
export declare const createQuery: (queryType: string, parameters: Record<string, any>, userId?: string) => QueryMessage;
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
export declare const validateCommand: (command: CommandMessage, allowedCommands?: string[]) => boolean;
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
export declare const createEventStoreEntry: (event: EventPattern, streamName: string) => any;
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
export declare const buildReadModelProjection: (events: EventPattern[], initialState: any, handlers: Record<string, Function>) => any;
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
export declare const createSagaExecution: (sagaId: string, steps: SagaStep[], initialData: any) => SagaExecution;
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
export declare const executeNextSagaStep: (saga: SagaExecution) => Promise<SagaExecution>;
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
export declare const compensateSaga: <TData = unknown>(saga: SagaExecution<TData>, errorLogger?: (error: Error, stepId: string) => void) => Promise<SagaExecution<TData>>;
export {};
//# sourceMappingURL=nestjs-microservices-patterns-kit.d.ts.map