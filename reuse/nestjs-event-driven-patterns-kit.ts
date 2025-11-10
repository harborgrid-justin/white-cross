/**
 * LOC: NEST-EVT-001
 * File: /reuse/nestjs-event-driven-patterns-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/cqrs
 *   - @nestjs/event-emitter
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Event-driven service modules
 *   - CQRS command/query handlers
 *   - Event sourcing implementations
 *   - Saga and process manager modules
 */

/**
 * File: /reuse/nestjs-event-driven-patterns-kit.ts
 * Locator: WC-UTL-NESTEVT-001
 * Purpose: NestJS Event-Driven Architecture Patterns - Comprehensive utilities for CQRS, Event Sourcing, and Event-Driven Systems
 *
 * Upstream: @nestjs/common, @nestjs/cqrs, @nestjs/event-emitter, rxjs
 * Downstream: ../backend/*, event-driven modules, CQRS implementations, saga patterns
 * Dependencies: NestJS 10.x, @nestjs/cqrs 10.x, @nestjs/event-emitter 2.x, TypeScript 5.x
 * Exports: 45 utility functions for event-driven patterns, CQRS, event sourcing, sagas, event handling
 *
 * LLM Context: Comprehensive NestJS event-driven architecture utilities for White Cross healthcare system.
 * Provides event emitters, event handlers, domain events, integration events, CQRS command/query handlers,
 * event sourcing, event store, event replay, snapshots, sagas, process managers, event serialization,
 * event metadata, filtering, routing, dead letter queues, retry strategies, idempotent handling,
 * event correlation, and causation tracking. Essential for scalable, distributed healthcare applications.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface DomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  version: number;
  timestamp: Date;
  data: Record<string, any>;
  metadata?: EventMetadata;
}

interface IntegrationEvent {
  eventId: string;
  eventType: string;
  source: string;
  timestamp: Date;
  data: Record<string, any>;
  metadata?: EventMetadata;
}

interface EventMetadata {
  correlationId?: string;
  causationId?: string;
  userId?: string;
  tenantId?: string;
  traceId?: string;
  [key: string]: any;
}

interface EventHandler<T = any> {
  handle(event: T): Promise<void>;
}

interface CommandHandler<TCommand = any, TResult = any> {
  execute(command: TCommand): Promise<TResult>;
}

interface QueryHandler<TQuery = any, TResult = any> {
  execute(query: TQuery): Promise<TResult>;
}

interface EventStore {
  append(event: DomainEvent): Promise<void>;
  getEvents(aggregateId: string): Promise<DomainEvent[]>;
  getEventsByType(eventType: string): Promise<DomainEvent[]>;
  getEventsFromVersion(aggregateId: string, fromVersion: number): Promise<DomainEvent[]>;
}

interface Snapshot {
  aggregateId: string;
  aggregateType: string;
  version: number;
  state: Record<string, any>;
  timestamp: Date;
}

interface SagaStep {
  name: string;
  execute: (context: any) => Promise<any>;
  compensate?: (context: any) => Promise<void>;
}

interface EventFilter {
  eventType?: string | string[];
  aggregateType?: string;
  predicate?: (event: DomainEvent) => boolean;
}

interface RetryStrategy {
  maxRetries: number;
  delay: number;
  backoffMultiplier?: number;
  maxDelay?: number;
}

interface DeadLetterMessage {
  event: DomainEvent | IntegrationEvent;
  error: Error;
  retryCount: number;
  timestamp: Date;
}

interface ProcessManager {
  processId: string;
  state: Record<string, any>;
  completedSteps: string[];
  isCompleted: boolean;
}

// ============================================================================
// EVENT EMITTERS & LISTENERS
// ============================================================================

/**
 * 1. Creates a typed event emitter for domain events.
 *
 * @param {any} eventEmitter - NestJS EventEmitter2 instance
 * @returns {Object} Typed event emitter methods
 *
 * @example
 * ```typescript
 * const domainEvents = createDomainEventEmitter(eventEmitter);
 * await domainEvents.emit('patient.created', patientCreatedEvent);
 * domainEvents.on('patient.created', async (event) => {
 *   console.log('Patient created:', event.aggregateId);
 * });
 * ```
 */
export const createDomainEventEmitter = (eventEmitter: any) => {
  return {
    async emit(eventType: string, event: DomainEvent): Promise<void> {
      await eventEmitter.emitAsync(eventType, event);
    },

    on(eventType: string, handler: (event: DomainEvent) => Promise<void>): void {
      eventEmitter.on(eventType, handler);
    },

    once(eventType: string, handler: (event: DomainEvent) => Promise<void>): void {
      eventEmitter.once(eventType, handler);
    },

    off(eventType: string, handler: (event: DomainEvent) => Promise<void>): void {
      eventEmitter.off(eventType, handler);
    },

    removeAllListeners(eventType?: string): void {
      eventEmitter.removeAllListeners(eventType);
    },
  };
};

/**
 * 2. Creates an integration event emitter for cross-service communication.
 *
 * @param {any} eventEmitter - NestJS EventEmitter2 instance
 * @param {string} serviceName - Name of the emitting service
 * @returns {Object} Integration event emitter
 *
 * @example
 * ```typescript
 * const integrationEvents = createIntegrationEventEmitter(
 *   eventEmitter,
 *   'patient-service'
 * );
 * await integrationEvents.publish('PatientRegistered', eventData);
 * ```
 */
export const createIntegrationEventEmitter = (
  eventEmitter: any,
  serviceName: string,
) => {
  return {
    async publish(eventType: string, data: Record<string, any>, metadata?: EventMetadata): Promise<void> {
      const event: IntegrationEvent = {
        eventId: generateEventId(),
        eventType,
        source: serviceName,
        timestamp: new Date(),
        data,
        metadata,
      };

      await eventEmitter.emitAsync(`integration.${eventType}`, event);
    },

    subscribe(eventType: string, handler: (event: IntegrationEvent) => Promise<void>): void {
      eventEmitter.on(`integration.${eventType}`, handler);
    },

    unsubscribe(eventType: string, handler: (event: IntegrationEvent) => Promise<void>): void {
      eventEmitter.off(`integration.${eventType}`, handler);
    },
  };
};

/**
 * 3. Creates a wildcard event listener for pattern matching.
 *
 * @param {any} eventEmitter - NestJS EventEmitter2 instance
 * @param {string} pattern - Event pattern (e.g., 'patient.*')
 * @param {Function} handler - Event handler function
 * @returns {Function} Unsubscribe function
 *
 * @example
 * ```typescript
 * const unsubscribe = createWildcardListener(
 *   eventEmitter,
 *   'patient.*',
 *   async (event) => console.log('Patient event:', event)
 * );
 * unsubscribe(); // Remove listener
 * ```
 */
export const createWildcardListener = (
  eventEmitter: any,
  pattern: string,
  handler: (event: any) => Promise<void>,
): (() => void) => {
  eventEmitter.on(pattern, handler);

  return () => {
    eventEmitter.off(pattern, handler);
  };
};

// ============================================================================
// DOMAIN EVENTS
// ============================================================================

/**
 * 4. Creates a domain event with automatic metadata.
 *
 * @param {string} eventType - Type of the event
 * @param {string} aggregateId - Aggregate identifier
 * @param {string} aggregateType - Type of aggregate
 * @param {number} version - Event version
 * @param {Record<string, any>} data - Event data
 * @param {EventMetadata} [metadata] - Additional metadata
 * @returns {DomainEvent} Domain event object
 *
 * @example
 * ```typescript
 * const event = createDomainEvent(
 *   'PatientRegistered',
 *   '123',
 *   'Patient',
 *   1,
 *   { firstName: 'John', lastName: 'Doe' },
 *   { userId: 'doctor-456' }
 * );
 * ```
 */
export const createDomainEvent = (
  eventType: string,
  aggregateId: string,
  aggregateType: string,
  version: number,
  data: Record<string, any>,
  metadata?: EventMetadata,
): DomainEvent => {
  return {
    eventId: generateEventId(),
    eventType,
    aggregateId,
    aggregateType,
    version,
    timestamp: new Date(),
    data,
    metadata: {
      ...metadata,
      correlationId: metadata?.correlationId || generateEventId(),
    },
  };
};

/**
 * 5. Creates a domain event factory for specific aggregate types.
 *
 * @param {string} aggregateType - Type of aggregate
 * @returns {Function} Event factory function
 *
 * @example
 * ```typescript
 * const createPatientEvent = createDomainEventFactory('Patient');
 * const event = createPatientEvent('PatientRegistered', '123', 1, patientData);
 * ```
 */
export const createDomainEventFactory = (aggregateType: string) => {
  return (
    eventType: string,
    aggregateId: string,
    version: number,
    data: Record<string, any>,
    metadata?: EventMetadata,
  ): DomainEvent => {
    return createDomainEvent(eventType, aggregateId, aggregateType, version, data, metadata);
  };
};

/**
 * 6. Enriches domain events with additional metadata.
 *
 * @param {DomainEvent} event - Original domain event
 * @param {EventMetadata} metadata - Additional metadata to add
 * @returns {DomainEvent} Enriched event
 *
 * @example
 * ```typescript
 * const enrichedEvent = enrichDomainEvent(event, {
 *   userId: 'doctor-123',
 *   tenantId: 'hospital-456',
 *   traceId: 'trace-789'
 * });
 * ```
 */
export const enrichDomainEvent = (
  event: DomainEvent,
  metadata: EventMetadata,
): DomainEvent => {
  return {
    ...event,
    metadata: {
      ...event.metadata,
      ...metadata,
    },
  };
};

// ============================================================================
// INTEGRATION EVENTS
// ============================================================================

/**
 * 7. Creates an integration event for cross-service communication.
 *
 * @param {string} eventType - Type of integration event
 * @param {string} source - Source service name
 * @param {Record<string, any>} data - Event data
 * @param {EventMetadata} [metadata] - Event metadata
 * @returns {IntegrationEvent} Integration event
 *
 * @example
 * ```typescript
 * const event = createIntegrationEvent(
 *   'PatientRegistered',
 *   'patient-service',
 *   { patientId: '123', name: 'John Doe' }
 * );
 * ```
 */
export const createIntegrationEvent = (
  eventType: string,
  source: string,
  data: Record<string, any>,
  metadata?: EventMetadata,
): IntegrationEvent => {
  return {
    eventId: generateEventId(),
    eventType,
    source,
    timestamp: new Date(),
    data,
    metadata,
  };
};

/**
 * 8. Converts a domain event to an integration event.
 *
 * @param {DomainEvent} domainEvent - Domain event to convert
 * @param {string} source - Source service name
 * @returns {IntegrationEvent} Integration event
 *
 * @example
 * ```typescript
 * const integrationEvent = convertToIntegrationEvent(
 *   patientCreatedEvent,
 *   'patient-service'
 * );
 * ```
 */
export const convertToIntegrationEvent = (
  domainEvent: DomainEvent,
  source: string,
): IntegrationEvent => {
  return {
    eventId: domainEvent.eventId,
    eventType: domainEvent.eventType,
    source,
    timestamp: domainEvent.timestamp,
    data: {
      aggregateId: domainEvent.aggregateId,
      aggregateType: domainEvent.aggregateType,
      version: domainEvent.version,
      ...domainEvent.data,
    },
    metadata: domainEvent.metadata,
  };
};

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * 9. Creates a typed event handler with error handling.
 *
 * @param {Function} handleFn - Event handling function
 * @param {Function} [onError] - Error handler function
 * @returns {EventHandler} Event handler instance
 *
 * @example
 * ```typescript
 * const patientEventHandler = createEventHandler(
 *   async (event) => {
 *     await notificationService.sendEmail(event.data.email);
 *   },
 *   async (error, event) => {
 *     console.error('Failed to handle event:', error);
 *   }
 * );
 * ```
 */
export const createEventHandler = <T = any>(
  handleFn: (event: T) => Promise<void>,
  onError?: (error: Error, event: T) => Promise<void>,
): EventHandler<T> => {
  return {
    async handle(event: T): Promise<void> {
      try {
        await handleFn(event);
      } catch (error) {
        if (onError) {
          await onError(error as Error, event);
        } else {
          throw error;
        }
      }
    },
  };
};

/**
 * 10. Creates an idempotent event handler that prevents duplicate processing.
 *
 * @param {EventHandler} handler - Event handler to wrap
 * @param {any} processedEventsStore - Store for tracking processed events
 * @returns {EventHandler} Idempotent event handler
 *
 * @example
 * ```typescript
 * const idempotentHandler = createIdempotentEventHandler(
 *   eventHandler,
 *   processedEventsCache
 * );
 * await idempotentHandler.handle(event); // Only processes once
 * ```
 */
export const createIdempotentEventHandler = <T extends { eventId: string }>(
  handler: EventHandler<T>,
  processedEventsStore: any,
): EventHandler<T> => {
  return {
    async handle(event: T): Promise<void> {
      const isProcessed = await processedEventsStore.has(event.eventId);

      if (isProcessed) {
        console.log(`Event ${event.eventId} already processed, skipping`);
        return;
      }

      await handler.handle(event);
      await processedEventsStore.set(event.eventId, true);
    },
  };
};

/**
 * 11. Creates a batched event handler for processing events in batches.
 *
 * @param {Function} batchHandlerFn - Batch processing function
 * @param {number} [batchSize=10] - Number of events per batch
 * @param {number} [flushInterval=5000] - Auto-flush interval in ms
 * @returns {Object} Batched event handler
 *
 * @example
 * ```typescript
 * const batchHandler = createBatchedEventHandler(
 *   async (events) => {
 *     await database.bulkInsert(events);
 *   },
 *   50,
 *   10000
 * );
 * ```
 */
export const createBatchedEventHandler = <T>(
  batchHandlerFn: (events: T[]) => Promise<void>,
  batchSize: number = 10,
  flushInterval: number = 5000,
) => {
  let batch: T[] = [];
  let timer: NodeJS.Timeout | null = null;

  const flush = async () => {
    if (batch.length === 0) return;

    const eventsToProcess = [...batch];
    batch = [];

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    await batchHandlerFn(eventsToProcess);
  };

  const scheduleFlush = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, flushInterval);
  };

  return {
    async handle(event: T): Promise<void> {
      batch.push(event);

      if (batch.length >= batchSize) {
        await flush();
      } else {
        scheduleFlush();
      }
    },

    async flush(): Promise<void> {
      await flush();
    },
  };
};

// ============================================================================
// COMMAND HANDLERS & BUS
// ============================================================================

/**
 * 12. Creates a command handler with validation.
 *
 * @param {Function} executeFn - Command execution function
 * @param {Function} [validateFn] - Command validation function
 * @returns {CommandHandler} Command handler instance
 *
 * @example
 * ```typescript
 * const createPatientHandler = createCommandHandler(
 *   async (cmd) => await patientService.create(cmd),
 *   (cmd) => {
 *     if (!cmd.firstName) throw new Error('First name required');
 *   }
 * );
 * ```
 */
export const createCommandHandler = <TCommand = any, TResult = any>(
  executeFn: (command: TCommand) => Promise<TResult>,
  validateFn?: (command: TCommand) => void | Promise<void>,
): CommandHandler<TCommand, TResult> => {
  return {
    async execute(command: TCommand): Promise<TResult> {
      if (validateFn) {
        await validateFn(command);
      }
      return executeFn(command);
    },
  };
};

/**
 * 13. Creates a command bus for dispatching commands to handlers.
 *
 * @returns {Object} Command bus instance
 *
 * @example
 * ```typescript
 * const commandBus = createCommandBus();
 * commandBus.register('CreatePatient', createPatientHandler);
 * const result = await commandBus.execute('CreatePatient', createPatientCmd);
 * ```
 */
export const createCommandBus = () => {
  const handlers = new Map<string, CommandHandler>();

  return {
    register<TCommand, TResult>(
      commandType: string,
      handler: CommandHandler<TCommand, TResult>,
    ): void {
      handlers.set(commandType, handler);
    },

    async execute<TCommand, TResult>(
      commandType: string,
      command: TCommand,
    ): Promise<TResult> {
      const handler = handlers.get(commandType);

      if (!handler) {
        throw new Error(`No handler registered for command type: ${commandType}`);
      }

      return handler.execute(command);
    },

    has(commandType: string): boolean {
      return handlers.has(commandType);
    },

    unregister(commandType: string): void {
      handlers.delete(commandType);
    },
  };
};

/**
 * 14. Creates a transactional command handler.
 *
 * @param {CommandHandler} handler - Command handler to wrap
 * @param {any} transactionManager - Transaction manager instance
 * @returns {CommandHandler} Transactional command handler
 *
 * @example
 * ```typescript
 * const transactionalHandler = createTransactionalCommandHandler(
 *   createPatientHandler,
 *   entityManager
 * );
 * ```
 */
export const createTransactionalCommandHandler = <TCommand, TResult>(
  handler: CommandHandler<TCommand, TResult>,
  transactionManager: any,
): CommandHandler<TCommand, TResult> => {
  return {
    async execute(command: TCommand): Promise<TResult> {
      const queryRunner = transactionManager.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const result = await handler.execute(command);
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    },
  };
};

// ============================================================================
// QUERY HANDLERS & BUS
// ============================================================================

/**
 * 15. Creates a query handler with caching support.
 *
 * @param {Function} executeFn - Query execution function
 * @param {any} [cacheManager] - Cache manager instance
 * @param {number} [cacheTTL] - Cache TTL in seconds
 * @returns {QueryHandler} Query handler instance
 *
 * @example
 * ```typescript
 * const getPatientHandler = createQueryHandler(
 *   async (query) => await patientRepo.findById(query.id),
 *   cacheManager,
 *   300
 * );
 * ```
 */
export const createQueryHandler = <TQuery = any, TResult = any>(
  executeFn: (query: TQuery) => Promise<TResult>,
  cacheManager?: any,
  cacheTTL: number = 300,
): QueryHandler<TQuery, TResult> => {
  return {
    async execute(query: TQuery): Promise<TResult> {
      if (cacheManager) {
        const cacheKey = `query:${JSON.stringify(query)}`;
        const cached = await cacheManager.get(cacheKey);

        if (cached) {
          return cached;
        }

        const result = await executeFn(query);
        await cacheManager.set(cacheKey, result, cacheTTL);
        return result;
      }

      return executeFn(query);
    },
  };
};

/**
 * 16. Creates a query bus for dispatching queries to handlers.
 *
 * @returns {Object} Query bus instance
 *
 * @example
 * ```typescript
 * const queryBus = createQueryBus();
 * queryBus.register('GetPatient', getPatientHandler);
 * const patient = await queryBus.execute('GetPatient', { id: '123' });
 * ```
 */
export const createQueryBus = () => {
  const handlers = new Map<string, QueryHandler>();

  return {
    register<TQuery, TResult>(
      queryType: string,
      handler: QueryHandler<TQuery, TResult>,
    ): void {
      handlers.set(queryType, handler);
    },

    async execute<TQuery, TResult>(
      queryType: string,
      query: TQuery,
    ): Promise<TResult> {
      const handler = handlers.get(queryType);

      if (!handler) {
        throw new Error(`No handler registered for query type: ${queryType}`);
      }

      return handler.execute(query);
    },

    has(queryType: string): boolean {
      return handlers.has(queryType);
    },

    unregister(queryType: string): void {
      handlers.delete(queryType);
    },
  };
};

// ============================================================================
// EVENT SOURCING
// ============================================================================

/**
 * 17. Creates an event-sourced aggregate that rebuilds from events.
 *
 * @param {string} aggregateId - Aggregate identifier
 * @param {DomainEvent[]} events - Historical events
 * @param {Function} applyFn - Event application function
 * @param {Record<string, any>} [initialState] - Initial state
 * @returns {Object} Rebuilt aggregate state
 *
 * @example
 * ```typescript
 * const patient = createEventSourcedAggregate(
 *   '123',
 *   patientEvents,
 *   (state, event) => {
 *     if (event.eventType === 'PatientRegistered') {
 *       return { ...state, ...event.data };
 *     }
 *     return state;
 *   },
 *   { id: '123' }
 * );
 * ```
 */
export const createEventSourcedAggregate = <T extends Record<string, any>>(
  aggregateId: string,
  events: DomainEvent[],
  applyFn: (state: T, event: DomainEvent) => T,
  initialState: T = {} as T,
): T => {
  let state = { ...initialState, id: aggregateId };

  for (const event of events) {
    state = applyFn(state, event);
  }

  return state;
};

/**
 * 18. Creates an aggregate root with event sourcing capabilities.
 *
 * @param {string} aggregateId - Aggregate identifier
 * @param {string} aggregateType - Type of aggregate
 * @returns {Object} Aggregate root instance
 *
 * @example
 * ```typescript
 * const patientRoot = createAggregateRoot('123', 'Patient');
 * patientRoot.applyEvent(patientRegisteredEvent);
 * const uncommittedEvents = patientRoot.getUncommittedEvents();
 * ```
 */
export const createAggregateRoot = (aggregateId: string, aggregateType: string) => {
  let version = 0;
  const uncommittedEvents: DomainEvent[] = [];

  return {
    aggregateId,
    aggregateType,
    version,

    applyEvent(event: DomainEvent): void {
      uncommittedEvents.push(event);
      version = event.version;
    },

    getUncommittedEvents(): DomainEvent[] {
      return [...uncommittedEvents];
    },

    markEventsAsCommitted(): void {
      uncommittedEvents.length = 0;
    },

    loadFromHistory(events: DomainEvent[]): void {
      for (const event of events) {
        version = event.version;
      }
    },

    getVersion(): number {
      return version;
    },
  };
};

// ============================================================================
// EVENT STORE
// ============================================================================

/**
 * 19. Creates an in-memory event store for development/testing.
 *
 * @returns {EventStore} Event store instance
 *
 * @example
 * ```typescript
 * const eventStore = createInMemoryEventStore();
 * await eventStore.append(domainEvent);
 * const events = await eventStore.getEvents('aggregate-123');
 * ```
 */
export const createInMemoryEventStore = (): EventStore => {
  const events: DomainEvent[] = [];

  return {
    async append(event: DomainEvent): Promise<void> {
      events.push({ ...event });
    },

    async getEvents(aggregateId: string): Promise<DomainEvent[]> {
      return events.filter((e) => e.aggregateId === aggregateId);
    },

    async getEventsByType(eventType: string): Promise<DomainEvent[]> {
      return events.filter((e) => e.eventType === eventType);
    },

    async getEventsFromVersion(aggregateId: string, fromVersion: number): Promise<DomainEvent[]> {
      return events.filter(
        (e) => e.aggregateId === aggregateId && e.version >= fromVersion,
      );
    },
  };
};

/**
 * 20. Creates a persistent event store using a database repository.
 *
 * @param {any} repository - Database repository for events
 * @returns {EventStore} Event store instance
 *
 * @example
 * ```typescript
 * const eventStore = createPersistentEventStore(eventRepository);
 * await eventStore.append(domainEvent);
 * ```
 */
export const createPersistentEventStore = (repository: any): EventStore => {
  return {
    async append(event: DomainEvent): Promise<void> {
      await repository.save({
        eventId: event.eventId,
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        version: event.version,
        timestamp: event.timestamp,
        data: JSON.stringify(event.data),
        metadata: JSON.stringify(event.metadata || {}),
      });
    },

    async getEvents(aggregateId: string): Promise<DomainEvent[]> {
      const storedEvents = await repository.find({
        where: { aggregateId },
        order: { version: 'ASC' },
      });

      return storedEvents.map((e: any) => ({
        eventId: e.eventId,
        eventType: e.eventType,
        aggregateId: e.aggregateId,
        aggregateType: e.aggregateType,
        version: e.version,
        timestamp: e.timestamp,
        data: JSON.parse(e.data),
        metadata: JSON.parse(e.metadata),
      }));
    },

    async getEventsByType(eventType: string): Promise<DomainEvent[]> {
      const storedEvents = await repository.find({
        where: { eventType },
        order: { timestamp: 'ASC' },
      });

      return storedEvents.map((e: any) => ({
        eventId: e.eventId,
        eventType: e.eventType,
        aggregateId: e.aggregateId,
        aggregateType: e.aggregateType,
        version: e.version,
        timestamp: e.timestamp,
        data: JSON.parse(e.data),
        metadata: JSON.parse(e.metadata),
      }));
    },

    async getEventsFromVersion(aggregateId: string, fromVersion: number): Promise<DomainEvent[]> {
      const storedEvents = await repository
        .createQueryBuilder('event')
        .where('event.aggregateId = :aggregateId', { aggregateId })
        .andWhere('event.version >= :fromVersion', { fromVersion })
        .orderBy('event.version', 'ASC')
        .getMany();

      return storedEvents.map((e: any) => ({
        eventId: e.eventId,
        eventType: e.eventType,
        aggregateId: e.aggregateId,
        aggregateType: e.aggregateType,
        version: e.version,
        timestamp: e.timestamp,
        data: JSON.parse(e.data),
        metadata: JSON.parse(e.metadata),
      }));
    },
  };
};

/**
 * 21. Creates an event store with optimistic concurrency control.
 *
 * @param {EventStore} eventStore - Base event store
 * @returns {EventStore} Event store with concurrency control
 *
 * @example
 * ```typescript
 * const concurrencyStore = createOptimisticConcurrencyEventStore(eventStore);
 * await concurrencyStore.append(event); // Throws on version conflict
 * ```
 */
export const createOptimisticConcurrencyEventStore = (
  eventStore: EventStore,
): EventStore => {
  return {
    async append(event: DomainEvent): Promise<void> {
      const existingEvents = await eventStore.getEvents(event.aggregateId);
      const latestVersion = existingEvents.reduce(
        (max, e) => Math.max(max, e.version),
        0,
      );

      if (event.version !== latestVersion + 1) {
        throw new Error(
          `Concurrency conflict: Expected version ${latestVersion + 1}, got ${event.version}`,
        );
      }

      await eventStore.append(event);
    },

    getEvents: eventStore.getEvents.bind(eventStore),
    getEventsByType: eventStore.getEventsByType.bind(eventStore),
    getEventsFromVersion: eventStore.getEventsFromVersion.bind(eventStore),
  };
};

// ============================================================================
// EVENT VERSIONING
// ============================================================================

/**
 * 22. Creates an event upcaster for migrating old event versions.
 *
 * @param {Record<string, Function>} upcasters - Map of event type to upcaster function
 * @returns {Function} Event upcasting function
 *
 * @example
 * ```typescript
 * const upcastEvent = createEventUpcaster({
 *   'PatientRegisteredV1': (event) => ({
 *     ...event,
 *     eventType: 'PatientRegisteredV2',
 *     data: { ...event.data, status: 'ACTIVE' }
 *   })
 * });
 * const modernEvent = upcastEvent(oldEvent);
 * ```
 */
export const createEventUpcaster = (
  upcasters: Record<string, (event: DomainEvent) => DomainEvent>,
) => {
  return (event: DomainEvent): DomainEvent => {
    const upcaster = upcasters[event.eventType];

    if (upcaster) {
      return upcaster(event);
    }

    return event;
  };
};

/**
 * 23. Creates a versioned event wrapper.
 *
 * @param {DomainEvent} event - Domain event
 * @param {number} schemaVersion - Schema version
 * @returns {Object} Versioned event
 *
 * @example
 * ```typescript
 * const versionedEvent = createVersionedEvent(domainEvent, 2);
 * console.log(versionedEvent.schemaVersion); // 2
 * ```
 */
export const createVersionedEvent = (event: DomainEvent, schemaVersion: number) => {
  return {
    ...event,
    schemaVersion,
    metadata: {
      ...event.metadata,
      schemaVersion,
    },
  };
};

// ============================================================================
// EVENT REPLAY & SNAPSHOTS
// ============================================================================

/**
 * 24. Creates an event replay mechanism for rebuilding read models.
 *
 * @param {EventStore} eventStore - Event store instance
 * @param {Function} projectionFn - Projection function
 * @returns {Function} Replay function
 *
 * @example
 * ```typescript
 * const replayEvents = createEventReplay(
 *   eventStore,
 *   async (event) => {
 *     await readModelRepo.apply(event);
 *   }
 * );
 * await replayEvents('patient.*');
 * ```
 */
export const createEventReplay = (
  eventStore: EventStore,
  projectionFn: (event: DomainEvent) => Promise<void>,
) => {
  return async (eventTypePattern?: string): Promise<void> => {
    let events: DomainEvent[] = [];

    if (eventTypePattern) {
      // Simple pattern matching
      const allEventTypes = await eventStore.getEventsByType(eventTypePattern);
      events = allEventTypes;
    } else {
      // This would need to get all events - implementation depends on store
      throw new Error('Full replay requires event store support');
    }

    for (const event of events) {
      await projectionFn(event);
    }
  };
};

/**
 * 25. Creates a snapshot store for aggregate state optimization.
 *
 * @param {any} repository - Snapshot repository
 * @returns {Object} Snapshot store instance
 *
 * @example
 * ```typescript
 * const snapshotStore = createSnapshotStore(snapshotRepository);
 * await snapshotStore.save('aggregate-123', 'Patient', 10, state);
 * const snapshot = await snapshotStore.get('aggregate-123');
 * ```
 */
export const createSnapshotStore = (repository: any) => {
  return {
    async save(
      aggregateId: string,
      aggregateType: string,
      version: number,
      state: Record<string, any>,
    ): Promise<void> {
      await repository.save({
        aggregateId,
        aggregateType,
        version,
        state: JSON.stringify(state),
        timestamp: new Date(),
      });
    },

    async get(aggregateId: string): Promise<Snapshot | null> {
      const snapshot = await repository.findOne({
        where: { aggregateId },
        order: { version: 'DESC' },
      });

      if (!snapshot) return null;

      return {
        aggregateId: snapshot.aggregateId,
        aggregateType: snapshot.aggregateType,
        version: snapshot.version,
        state: JSON.parse(snapshot.state),
        timestamp: snapshot.timestamp,
      };
    },

    async delete(aggregateId: string): Promise<void> {
      await repository.delete({ aggregateId });
    },
  };
};

/**
 * 26. Creates a snapshot-based aggregate loader with event replay.
 *
 * @param {EventStore} eventStore - Event store instance
 * @param {any} snapshotStore - Snapshot store instance
 * @param {Function} applyFn - Event application function
 * @returns {Function} Aggregate loader
 *
 * @example
 * ```typescript
 * const loadAggregate = createSnapshotAggregateLoader(
 *   eventStore,
 *   snapshotStore,
 *   (state, event) => ({ ...state, ...event.data })
 * );
 * const patient = await loadAggregate('patient-123');
 * ```
 */
export const createSnapshotAggregateLoader = <T extends Record<string, any>>(
  eventStore: EventStore,
  snapshotStore: any,
  applyFn: (state: T, event: DomainEvent) => T,
) => {
  return async (aggregateId: string): Promise<T | null> => {
    const snapshot = await snapshotStore.get(aggregateId);

    let state: T;
    let fromVersion: number;

    if (snapshot) {
      state = snapshot.state as T;
      fromVersion = snapshot.version + 1;
    } else {
      state = { id: aggregateId } as T;
      fromVersion = 1;
    }

    const events = await eventStore.getEventsFromVersion(aggregateId, fromVersion);

    for (const event of events) {
      state = applyFn(state, event);
    }

    return state;
  };
};

// ============================================================================
// SAGAS & PROCESS MANAGERS
// ============================================================================

/**
 * 27. Creates a saga coordinator for long-running business processes.
 *
 * @param {SagaStep[]} steps - Saga steps
 * @returns {Object} Saga coordinator
 *
 * @example
 * ```typescript
 * const registrationSaga = createSagaCoordinator([
 *   {
 *     name: 'createPatient',
 *     execute: async (ctx) => await patientService.create(ctx.data),
 *     compensate: async (ctx) => await patientService.delete(ctx.patientId)
 *   }
 * ]);
 * await registrationSaga.execute({ data: patientData });
 * ```
 */
export const createSagaCoordinator = (steps: SagaStep[]) => {
  return {
    async execute(initialContext: any): Promise<any> {
      const context = { ...initialContext };
      const completedSteps: SagaStep[] = [];

      try {
        for (const step of steps) {
          const result = await step.execute(context);
          Object.assign(context, result);
          completedSteps.push(step);
        }

        return context;
      } catch (error) {
        // Compensate in reverse order
        for (let i = completedSteps.length - 1; i >= 0; i--) {
          const step = completedSteps[i];
          if (step.compensate) {
            try {
              await step.compensate(context);
            } catch (compensationError) {
              console.error(
                `Compensation failed for step ${step.name}:`,
                compensationError,
              );
            }
          }
        }

        throw error;
      }
    },

    getSteps(): SagaStep[] {
      return [...steps];
    },
  };
};

/**
 * 28. Creates a process manager for complex event-driven workflows.
 *
 * @param {string} processId - Process identifier
 * @param {Record<string, any>} initialState - Initial state
 * @returns {Object} Process manager instance
 *
 * @example
 * ```typescript
 * const appointmentProcess = createProcessManager('appt-123', {
 *   patientId: '123',
 *   status: 'INITIATED'
 * });
 * appointmentProcess.handleEvent(patientConfirmedEvent);
 * ```
 */
export const createProcessManager = (
  processId: string,
  initialState: Record<string, any> = {},
) => {
  const state: ProcessManager = {
    processId,
    state: { ...initialState },
    completedSteps: [],
    isCompleted: false,
  };

  return {
    processId,

    getState(): Record<string, any> {
      return { ...state.state };
    },

    handleEvent(event: DomainEvent, transitionFn: (state: ProcessManager, event: DomainEvent) => ProcessManager): void {
      const newState = transitionFn(state, event);
      Object.assign(state, newState);
    },

    markStepCompleted(stepName: string): void {
      if (!state.completedSteps.includes(stepName)) {
        state.completedSteps.push(stepName);
      }
    },

    isStepCompleted(stepName: string): boolean {
      return state.completedSteps.includes(stepName);
    },

    complete(): void {
      state.isCompleted = true;
    },

    isCompleted(): boolean {
      return state.isCompleted;
    },

    getCompletedSteps(): string[] {
      return [...state.completedSteps];
    },
  };
};

/**
 * 29. Creates a saga step builder for fluent step definition.
 *
 * @param {string} name - Step name
 * @returns {Object} Saga step builder
 *
 * @example
 * ```typescript
 * const step = createSagaStepBuilder('createPatient')
 *   .execute(async (ctx) => await patientService.create(ctx))
 *   .compensate(async (ctx) => await patientService.delete(ctx.id))
 *   .build();
 * ```
 */
export const createSagaStepBuilder = (name: string) => {
  let executeFn: ((context: any) => Promise<any>) | undefined;
  let compensateFn: ((context: any) => Promise<void>) | undefined;

  return {
    execute(fn: (context: any) => Promise<any>) {
      executeFn = fn;
      return this;
    },

    compensate(fn: (context: any) => Promise<void>) {
      compensateFn = fn;
      return this;
    },

    build(): SagaStep {
      if (!executeFn) {
        throw new Error(`Execute function is required for step ${name}`);
      }

      return {
        name,
        execute: executeFn,
        compensate: compensateFn,
      };
    },
  };
};

// ============================================================================
// EVENT SERIALIZATION & METADATA
// ============================================================================

/**
 * 30. Creates an event serializer for JSON serialization.
 *
 * @returns {Object} Event serializer
 *
 * @example
 * ```typescript
 * const serializer = createEventSerializer();
 * const json = serializer.serialize(domainEvent);
 * const event = serializer.deserialize(json);
 * ```
 */
export const createEventSerializer = () => {
  return {
    serialize(event: DomainEvent | IntegrationEvent): string {
      return JSON.stringify({
        ...event,
        timestamp: event.timestamp.toISOString(),
      });
    },

    deserialize(json: string): DomainEvent | IntegrationEvent {
      const parsed = JSON.parse(json);
      return {
        ...parsed,
        timestamp: new Date(parsed.timestamp),
      };
    },

    serializeBatch(events: (DomainEvent | IntegrationEvent)[]): string {
      return JSON.stringify(
        events.map((event) => ({
          ...event,
          timestamp: event.timestamp.toISOString(),
        })),
      );
    },

    deserializeBatch(json: string): (DomainEvent | IntegrationEvent)[] {
      const parsed = JSON.parse(json);
      return parsed.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp),
      }));
    },
  };
};

/**
 * 31. Creates an event metadata enricher.
 *
 * @param {Function} enrichFn - Metadata enrichment function
 * @returns {Function} Metadata enricher
 *
 * @example
 * ```typescript
 * const enrichMetadata = createEventMetadataEnricher((event, context) => ({
 *   userId: context.userId,
 *   ipAddress: context.ipAddress,
 *   userAgent: context.userAgent
 * }));
 * const enrichedEvent = enrichMetadata(event, requestContext);
 * ```
 */
export const createEventMetadataEnricher = (
  enrichFn: (event: DomainEvent | IntegrationEvent, context: any) => EventMetadata,
) => {
  return <T extends DomainEvent | IntegrationEvent>(event: T, context: any): T => {
    const additionalMetadata = enrichFn(event, context);

    return {
      ...event,
      metadata: {
        ...event.metadata,
        ...additionalMetadata,
      },
    };
  };
};

/**
 * 32. Creates a correlation ID generator and tracker.
 *
 * @returns {Object} Correlation ID utilities
 *
 * @example
 * ```typescript
 * const correlation = createCorrelationIdTracker();
 * const correlationId = correlation.generate();
 * const enrichedEvent = correlation.attachToEvent(event, correlationId);
 * ```
 */
export const createCorrelationIdTracker = () => {
  return {
    generate(): string {
      return generateEventId();
    },

    attachToEvent<T extends DomainEvent | IntegrationEvent>(
      event: T,
      correlationId: string,
    ): T {
      return {
        ...event,
        metadata: {
          ...event.metadata,
          correlationId,
        },
      };
    },

    extractFromEvent(event: DomainEvent | IntegrationEvent): string | undefined {
      return event.metadata?.correlationId;
    },

    attachCausationId<T extends DomainEvent | IntegrationEvent>(
      event: T,
      causationId: string,
    ): T {
      return {
        ...event,
        metadata: {
          ...event.metadata,
          causationId,
        },
      };
    },
  };
};

// ============================================================================
// EVENT FILTERING & ROUTING
// ============================================================================

/**
 * 33. Creates an event filter for selective event processing.
 *
 * @param {EventFilter} filter - Filter configuration
 * @returns {Function} Filter predicate function
 *
 * @example
 * ```typescript
 * const filter = createEventFilter({
 *   eventType: ['PatientRegistered', 'PatientUpdated'],
 *   aggregateType: 'Patient'
 * });
 * const shouldProcess = filter(event);
 * ```
 */
export const createEventFilter = (filter: EventFilter) => {
  return (event: DomainEvent): boolean => {
    if (filter.eventType) {
      const types = Array.isArray(filter.eventType)
        ? filter.eventType
        : [filter.eventType];

      if (!types.includes(event.eventType)) {
        return false;
      }
    }

    if (filter.aggregateType && event.aggregateType !== filter.aggregateType) {
      return false;
    }

    if (filter.predicate && !filter.predicate(event)) {
      return false;
    }

    return true;
  };
};

/**
 * 34. Creates an event router for directing events to specific handlers.
 *
 * @returns {Object} Event router instance
 *
 * @example
 * ```typescript
 * const router = createEventRouter();
 * router.route('PatientRegistered', patientRegisteredHandler);
 * router.route('PatientUpdated', patientUpdatedHandler);
 * await router.dispatch(event);
 * ```
 */
export const createEventRouter = () => {
  const routes = new Map<string, EventHandler[]>();

  return {
    route(eventType: string, handler: EventHandler): void {
      const handlers = routes.get(eventType) || [];
      handlers.push(handler);
      routes.set(eventType, handlers);
    },

    async dispatch(event: DomainEvent): Promise<void> {
      const handlers = routes.get(event.eventType) || [];

      await Promise.all(handlers.map((handler) => handler.handle(event)));
    },

    unroute(eventType: string, handler?: EventHandler): void {
      if (!handler) {
        routes.delete(eventType);
      } else {
        const handlers = routes.get(eventType) || [];
        const filtered = handlers.filter((h) => h !== handler);
        routes.set(eventType, filtered);
      }
    },

    getRoutes(): Map<string, EventHandler[]> {
      return new Map(routes);
    },
  };
};

/**
 * 35. Creates a priority-based event router.
 *
 * @returns {Object} Priority event router
 *
 * @example
 * ```typescript
 * const priorityRouter = createPriorityEventRouter();
 * priorityRouter.route('PatientRegistered', highPriorityHandler, 10);
 * priorityRouter.route('PatientRegistered', lowPriorityHandler, 1);
 * await priorityRouter.dispatch(event); // High priority first
 * ```
 */
export const createPriorityEventRouter = () => {
  const routes = new Map<string, Array<{ handler: EventHandler; priority: number }>>();

  return {
    route(eventType: string, handler: EventHandler, priority: number = 5): void {
      const handlers = routes.get(eventType) || [];
      handlers.push({ handler, priority });
      handlers.sort((a, b) => b.priority - a.priority);
      routes.set(eventType, handlers);
    },

    async dispatch(event: DomainEvent): Promise<void> {
      const handlers = routes.get(event.eventType) || [];

      for (const { handler } of handlers) {
        await handler.handle(event);
      }
    },

    unroute(eventType: string): void {
      routes.delete(eventType);
    },
  };
};

// ============================================================================
// DEAD LETTER QUEUE & RETRY
// ============================================================================

/**
 * 36. Creates a dead letter queue for failed event processing.
 *
 * @param {any} storage - Storage for dead letter messages
 * @returns {Object} Dead letter queue instance
 *
 * @example
 * ```typescript
 * const dlq = createDeadLetterQueue(deadLetterStorage);
 * await dlq.add(failedEvent, error, 3);
 * const deadLetters = await dlq.getAll();
 * ```
 */
export const createDeadLetterQueue = (storage: any) => {
  return {
    async add(
      event: DomainEvent | IntegrationEvent,
      error: Error,
      retryCount: number,
    ): Promise<void> {
      const deadLetter: DeadLetterMessage = {
        event,
        error,
        retryCount,
        timestamp: new Date(),
      };

      await storage.save({
        eventId: event.eventId,
        eventType: event.eventType,
        event: JSON.stringify(event),
        error: error.message,
        errorStack: error.stack,
        retryCount,
        timestamp: new Date(),
      });
    },

    async getAll(): Promise<DeadLetterMessage[]> {
      const stored = await storage.find();

      return stored.map((item: any) => ({
        event: JSON.parse(item.event),
        error: new Error(item.error),
        retryCount: item.retryCount,
        timestamp: item.timestamp,
      }));
    },

    async remove(eventId: string): Promise<void> {
      await storage.delete({ eventId });
    },

    async retry(eventId: string, handler: EventHandler): Promise<void> {
      const item = await storage.findOne({ where: { eventId } });

      if (!item) {
        throw new Error(`Dead letter message ${eventId} not found`);
      }

      const event = JSON.parse(item.event);

      try {
        await handler.handle(event);
        await this.remove(eventId);
      } catch (error) {
        await storage.update(
          { eventId },
          {
            retryCount: item.retryCount + 1,
            error: (error as Error).message,
            timestamp: new Date(),
          },
        );
        throw error;
      }
    },
  };
};

/**
 * 37. Creates a retry strategy with exponential backoff.
 *
 * @param {RetryStrategy} config - Retry configuration
 * @returns {Function} Retry execution function
 *
 * @example
 * ```typescript
 * const retryWithBackoff = createRetryStrategy({
 *   maxRetries: 5,
 *   delay: 1000,
 *   backoffMultiplier: 2,
 *   maxDelay: 30000
 * });
 * await retryWithBackoff(async () => await processEvent(event));
 * ```
 */
export const createRetryStrategy = (config: RetryStrategy) => {
  return async <T>(fn: () => Promise<T>): Promise<T> => {
    let lastError: Error;
    let currentDelay = config.delay;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt < config.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, currentDelay));

          if (config.backoffMultiplier) {
            currentDelay = Math.min(
              currentDelay * config.backoffMultiplier,
              config.maxDelay || Infinity,
            );
          }
        }
      }
    }

    throw lastError!;
  };
};

/**
 * 38. Creates a resilient event handler with retry and DLQ support.
 *
 * @param {EventHandler} handler - Event handler to wrap
 * @param {RetryStrategy} retryStrategy - Retry configuration
 * @param {any} deadLetterQueue - Dead letter queue instance
 * @returns {EventHandler} Resilient event handler
 *
 * @example
 * ```typescript
 * const resilientHandler = createResilientEventHandler(
 *   eventHandler,
 *   { maxRetries: 3, delay: 1000 },
 *   dlq
 * );
 * ```
 */
export const createResilientEventHandler = <T extends DomainEvent | IntegrationEvent>(
  handler: EventHandler<T>,
  retryStrategy: RetryStrategy,
  deadLetterQueue: any,
): EventHandler<T> => {
  const retry = createRetryStrategy(retryStrategy);

  return {
    async handle(event: T): Promise<void> {
      try {
        await retry(() => handler.handle(event));
      } catch (error) {
        await deadLetterQueue.add(event, error, retryStrategy.maxRetries);
        throw error;
      }
    },
  };
};

// ============================================================================
// EVENT BUS & PUBLISHING
// ============================================================================

/**
 * 39. Creates an event bus for publishing and subscribing to events.
 *
 * @returns {Object} Event bus instance
 *
 * @example
 * ```typescript
 * const eventBus = createEventBus();
 * eventBus.subscribe('PatientRegistered', async (event) => {
 *   await sendWelcomeEmail(event.data.email);
 * });
 * await eventBus.publish(patientRegisteredEvent);
 * ```
 */
export const createEventBus = () => {
  const subscribers = new Map<string, EventHandler[]>();

  return {
    subscribe(eventType: string, handler: EventHandler): () => void {
      const handlers = subscribers.get(eventType) || [];
      handlers.push(handler);
      subscribers.set(eventType, handlers);

      return () => {
        const currentHandlers = subscribers.get(eventType) || [];
        const filtered = currentHandlers.filter((h) => h !== handler);
        subscribers.set(eventType, filtered);
      };
    },

    async publish(event: DomainEvent | IntegrationEvent): Promise<void> {
      const eventType = event.eventType;
      const handlers = subscribers.get(eventType) || [];

      await Promise.all(handlers.map((handler) => handler.handle(event)));
    },

    async publishBatch(events: (DomainEvent | IntegrationEvent)[]): Promise<void> {
      await Promise.all(events.map((event) => this.publish(event)));
    },

    getSubscribers(eventType: string): EventHandler[] {
      return subscribers.get(eventType) || [];
    },

    unsubscribeAll(eventType?: string): void {
      if (eventType) {
        subscribers.delete(eventType);
      } else {
        subscribers.clear();
      }
    },
  };
};

/**
 * 40. Creates an ordered event bus that processes events sequentially.
 *
 * @returns {Object} Ordered event bus instance
 *
 * @example
 * ```typescript
 * const orderedBus = createOrderedEventBus();
 * orderedBus.subscribe('PatientUpdated', updateHandler);
 * await orderedBus.publish(event1);
 * await orderedBus.publish(event2); // Waits for event1 to complete
 * ```
 */
export const createOrderedEventBus = () => {
  const subscribers = new Map<string, EventHandler[]>();
  const queue: Array<{ event: DomainEvent | IntegrationEvent; resolve: () => void; reject: (error: Error) => void }> = [];
  let processing = false;

  const processQueue = async () => {
    if (processing || queue.length === 0) return;

    processing = true;

    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;

      try {
        const handlers = subscribers.get(item.event.eventType) || [];
        await Promise.all(handlers.map((handler) => handler.handle(item.event)));
        item.resolve();
      } catch (error) {
        item.reject(error as Error);
      }
    }

    processing = false;
  };

  return {
    subscribe(eventType: string, handler: EventHandler): () => void {
      const handlers = subscribers.get(eventType) || [];
      handlers.push(handler);
      subscribers.set(eventType, handlers);

      return () => {
        const currentHandlers = subscribers.get(eventType) || [];
        const filtered = currentHandlers.filter((h) => h !== handler);
        subscribers.set(eventType, filtered);
      };
    },

    async publish(event: DomainEvent | IntegrationEvent): Promise<void> {
      return new Promise((resolve, reject) => {
        queue.push({ event, resolve, reject });
        processQueue();
      });
    },

    getQueueLength(): number {
      return queue.length;
    },

    isProcessing(): boolean {
      return processing;
    },
  };
};

// ============================================================================
// PROJECTION & READ MODEL UPDATES
// ============================================================================

/**
 * 41. Creates a projection handler for updating read models.
 *
 * @param {any} readModelRepository - Read model repository
 * @param {Function} projectionFn - Projection function
 * @returns {EventHandler} Projection event handler
 *
 * @example
 * ```typescript
 * const patientProjection = createProjectionHandler(
 *   patientReadModelRepo,
 *   async (event) => {
 *     if (event.eventType === 'PatientRegistered') {
 *       return { id: event.aggregateId, ...event.data };
 *     }
 *   }
 * );
 * ```
 */
export const createProjectionHandler = (
  readModelRepository: any,
  projectionFn: (event: DomainEvent) => Promise<Record<string, any> | null>,
): EventHandler<DomainEvent> => {
  return {
    async handle(event: DomainEvent): Promise<void> {
      const projection = await projectionFn(event);

      if (projection) {
        await readModelRepository.save(projection);
      }
    },
  };
};

/**
 * 42. Creates a multi-projection handler for updating multiple read models.
 *
 * @param {Map<string, any>} projections - Map of projection name to handler
 * @returns {EventHandler} Multi-projection handler
 *
 * @example
 * ```typescript
 * const multiProjection = createMultiProjectionHandler(new Map([
 *   ['patientSummary', patientSummaryProjection],
 *   ['patientStatistics', patientStatsProjection]
 * ]));
 * ```
 */
export const createMultiProjectionHandler = (
  projections: Map<string, EventHandler>,
): EventHandler<DomainEvent> => {
  return {
    async handle(event: DomainEvent): Promise<void> {
      await Promise.all(
        Array.from(projections.values()).map((projection) => projection.handle(event)),
      );
    },
  };
};

// ============================================================================
// EVENT STREAM & OBSERVABLES
// ============================================================================

/**
 * 43. Creates an observable event stream for reactive event processing.
 *
 * @param {any} eventEmitter - NestJS EventEmitter2 instance
 * @param {string} eventType - Event type to observe
 * @returns {Object} Observable stream (requires rxjs)
 *
 * @example
 * ```typescript
 * const patientStream = createEventStream(eventEmitter, 'patient.*');
 * patientStream.subscribe((event) => console.log('Event:', event));
 * ```
 */
export const createEventStream = (eventEmitter: any, eventType: string) => {
  const listeners: Array<(event: any) => void> = [];

  eventEmitter.on(eventType, (event: any) => {
    listeners.forEach((listener) => listener(event));
  });

  return {
    subscribe(observer: (event: any) => void): { unsubscribe: () => void } {
      listeners.push(observer);

      return {
        unsubscribe: () => {
          const index = listeners.indexOf(observer);
          if (index > -1) {
            listeners.splice(index, 1);
          }
        },
      };
    },

    pipe(transformFn: (event: any) => any): any {
      const transformedListeners: Array<(event: any) => void> = [];

      eventEmitter.on(eventType, (event: any) => {
        const transformed = transformFn(event);
        transformedListeners.forEach((listener) => listener(transformed));
      });

      return {
        subscribe(observer: (event: any) => void): { unsubscribe: () => void } {
          transformedListeners.push(observer);

          return {
            unsubscribe: () => {
              const index = transformedListeners.indexOf(observer);
              if (index > -1) {
                transformedListeners.splice(index, 1);
              }
            },
          };
        },
      };
    },
  };
};

/**
 * 44. Creates an event stream merger for combining multiple event types.
 *
 * @param {any} eventEmitter - NestJS EventEmitter2 instance
 * @param {string[]} eventTypes - Event types to merge
 * @returns {Object} Merged event stream
 *
 * @example
 * ```typescript
 * const mergedStream = createMergedEventStream(
 *   eventEmitter,
 *   ['PatientRegistered', 'PatientUpdated', 'PatientDeleted']
 * );
 * mergedStream.subscribe((event) => console.log(event));
 * ```
 */
export const createMergedEventStream = (eventEmitter: any, eventTypes: string[]) => {
  const listeners: Array<(event: any) => void> = [];

  eventTypes.forEach((eventType) => {
    eventEmitter.on(eventType, (event: any) => {
      listeners.forEach((listener) => listener(event));
    });
  });

  return {
    subscribe(observer: (event: any) => void): { unsubscribe: () => void } {
      listeners.push(observer);

      return {
        unsubscribe: () => {
          const index = listeners.indexOf(observer);
          if (index > -1) {
            listeners.splice(index, 1);
          }
        },
      };
    },
  };
};

// ============================================================================
// TESTING & DEBUGGING UTILITIES
// ============================================================================

/**
 * 45. Creates an event recorder for testing and debugging.
 *
 * @returns {Object} Event recorder instance
 *
 * @example
 * ```typescript
 * const recorder = createEventRecorder();
 * recorder.record(patientRegisteredEvent);
 * recorder.record(patientUpdatedEvent);
 * const events = recorder.getRecordedEvents();
 * console.log(events.length); // 2
 * ```
 */
export const createEventRecorder = () => {
  const recordedEvents: Array<DomainEvent | IntegrationEvent> = [];

  return {
    record(event: DomainEvent | IntegrationEvent): void {
      recordedEvents.push({ ...event });
    },

    getRecordedEvents(): Array<DomainEvent | IntegrationEvent> {
      return [...recordedEvents];
    },

    getEventsByType(eventType: string): Array<DomainEvent | IntegrationEvent> {
      return recordedEvents.filter((e) => e.eventType === eventType);
    },

    getEventCount(): number {
      return recordedEvents.length;
    },

    clear(): void {
      recordedEvents.length = 0;
    },

    hasEvent(eventType: string): boolean {
      return recordedEvents.some((e) => e.eventType === eventType);
    },

    getLastEvent(): DomainEvent | IntegrationEvent | undefined {
      return recordedEvents[recordedEvents.length - 1];
    },

    assertEventPublished(eventType: string): void {
      if (!this.hasEvent(eventType)) {
        throw new Error(`Expected event ${eventType} to be published`);
      }
    },

    assertEventCount(expectedCount: number): void {
      if (recordedEvents.length !== expectedCount) {
        throw new Error(
          `Expected ${expectedCount} events, got ${recordedEvents.length}`,
        );
      }
    },
  };
};

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Generates a unique event ID.
 */
function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
