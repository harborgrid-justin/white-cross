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
export declare const createDomainEventEmitter: (eventEmitter: any) => {
    emit(eventType: string, event: DomainEvent): Promise<void>;
    on(eventType: string, handler: (event: DomainEvent) => Promise<void>): void;
    once(eventType: string, handler: (event: DomainEvent) => Promise<void>): void;
    off(eventType: string, handler: (event: DomainEvent) => Promise<void>): void;
    removeAllListeners(eventType?: string): void;
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
export declare const createIntegrationEventEmitter: (eventEmitter: any, serviceName: string) => {
    publish(eventType: string, data: Record<string, any>, metadata?: EventMetadata): Promise<void>;
    subscribe(eventType: string, handler: (event: IntegrationEvent) => Promise<void>): void;
    unsubscribe(eventType: string, handler: (event: IntegrationEvent) => Promise<void>): void;
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
export declare const createWildcardListener: (eventEmitter: any, pattern: string, handler: (event: any) => Promise<void>) => (() => void);
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
export declare const createDomainEvent: (eventType: string, aggregateId: string, aggregateType: string, version: number, data: Record<string, any>, metadata?: EventMetadata) => DomainEvent;
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
export declare const createDomainEventFactory: (aggregateType: string) => (eventType: string, aggregateId: string, version: number, data: Record<string, any>, metadata?: EventMetadata) => DomainEvent;
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
export declare const enrichDomainEvent: (event: DomainEvent, metadata: EventMetadata) => DomainEvent;
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
export declare const createIntegrationEvent: (eventType: string, source: string, data: Record<string, any>, metadata?: EventMetadata) => IntegrationEvent;
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
export declare const convertToIntegrationEvent: (domainEvent: DomainEvent, source: string) => IntegrationEvent;
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
export declare const createEventHandler: <T = any>(handleFn: (event: T) => Promise<void>, onError?: (error: Error, event: T) => Promise<void>) => EventHandler<T>;
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
export declare const createIdempotentEventHandler: <T extends {
    eventId: string;
}>(handler: EventHandler<T>, processedEventsStore: any) => EventHandler<T>;
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
export declare const createBatchedEventHandler: <T>(batchHandlerFn: (events: T[]) => Promise<void>, batchSize?: number, flushInterval?: number) => {
    handle(event: T): Promise<void>;
    flush(): Promise<void>;
};
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
export declare const createCommandHandler: <TCommand = any, TResult = any>(executeFn: (command: TCommand) => Promise<TResult>, validateFn?: (command: TCommand) => void | Promise<void>) => CommandHandler<TCommand, TResult>;
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
export declare const createCommandBus: () => {
    register<TCommand, TResult>(commandType: string, handler: CommandHandler<TCommand, TResult>): void;
    execute<TCommand, TResult>(commandType: string, command: TCommand): Promise<TResult>;
    has(commandType: string): boolean;
    unregister(commandType: string): void;
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
export declare const createTransactionalCommandHandler: <TCommand, TResult>(handler: CommandHandler<TCommand, TResult>, transactionManager: any) => CommandHandler<TCommand, TResult>;
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
export declare const createQueryHandler: <TQuery = any, TResult = any>(executeFn: (query: TQuery) => Promise<TResult>, cacheManager?: any, cacheTTL?: number) => QueryHandler<TQuery, TResult>;
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
export declare const createQueryBus: () => {
    register<TQuery, TResult>(queryType: string, handler: QueryHandler<TQuery, TResult>): void;
    execute<TQuery, TResult>(queryType: string, query: TQuery): Promise<TResult>;
    has(queryType: string): boolean;
    unregister(queryType: string): void;
};
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
export declare const createEventSourcedAggregate: <T extends Record<string, any>>(aggregateId: string, events: DomainEvent[], applyFn: (state: T, event: DomainEvent) => T, initialState?: T) => T;
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
export declare const createAggregateRoot: (aggregateId: string, aggregateType: string) => {
    aggregateId: string;
    aggregateType: string;
    version: number;
    applyEvent(event: DomainEvent): void;
    getUncommittedEvents(): DomainEvent[];
    markEventsAsCommitted(): void;
    loadFromHistory(events: DomainEvent[]): void;
    getVersion(): number;
};
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
export declare const createInMemoryEventStore: () => EventStore;
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
export declare const createPersistentEventStore: (repository: any) => EventStore;
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
export declare const createOptimisticConcurrencyEventStore: (eventStore: EventStore) => EventStore;
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
export declare const createEventUpcaster: (upcasters: Record<string, (event: DomainEvent) => DomainEvent>) => (event: DomainEvent) => DomainEvent;
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
export declare const createVersionedEvent: (event: DomainEvent, schemaVersion: number) => {
    schemaVersion: number;
    metadata: {
        schemaVersion: number;
        correlationId?: string;
        causationId?: string;
        userId?: string;
        tenantId?: string;
        traceId?: string;
    };
    eventId: string;
    eventType: string;
    aggregateId: string;
    aggregateType: string;
    version: number;
    timestamp: Date;
    data: Record<string, any>;
};
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
export declare const createEventReplay: (eventStore: EventStore, projectionFn: (event: DomainEvent) => Promise<void>) => (eventTypePattern?: string) => Promise<void>;
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
export declare const createSnapshotStore: (repository: any) => {
    save(aggregateId: string, aggregateType: string, version: number, state: Record<string, any>): Promise<void>;
    get(aggregateId: string): Promise<Snapshot | null>;
    delete(aggregateId: string): Promise<void>;
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
export declare const createSnapshotAggregateLoader: <T extends Record<string, any>>(eventStore: EventStore, snapshotStore: any, applyFn: (state: T, event: DomainEvent) => T) => (aggregateId: string) => Promise<T | null>;
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
export declare const createSagaCoordinator: (steps: SagaStep[]) => {
    execute(initialContext: any): Promise<any>;
    getSteps(): SagaStep[];
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
export declare const createProcessManager: (processId: string, initialState?: Record<string, any>) => {
    processId: string;
    getState(): Record<string, any>;
    handleEvent(event: DomainEvent, transitionFn: (state: ProcessManager, event: DomainEvent) => ProcessManager): void;
    markStepCompleted(stepName: string): void;
    isStepCompleted(stepName: string): boolean;
    complete(): void;
    isCompleted(): boolean;
    getCompletedSteps(): string[];
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
export declare const createSagaStepBuilder: (name: string) => {
    execute(fn: (context: any) => Promise<any>): /*elided*/ any;
    compensate(fn: (context: any) => Promise<void>): /*elided*/ any;
    build(): SagaStep;
};
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
export declare const createEventSerializer: () => {
    serialize(event: DomainEvent | IntegrationEvent): string;
    deserialize(json: string): DomainEvent | IntegrationEvent;
    serializeBatch(events: (DomainEvent | IntegrationEvent)[]): string;
    deserializeBatch(json: string): (DomainEvent | IntegrationEvent)[];
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
export declare const createEventMetadataEnricher: (enrichFn: (event: DomainEvent | IntegrationEvent, context: any) => EventMetadata) => <T extends DomainEvent | IntegrationEvent>(event: T, context: any) => T;
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
export declare const createCorrelationIdTracker: () => {
    generate(): string;
    attachToEvent<T extends DomainEvent | IntegrationEvent>(event: T, correlationId: string): T;
    extractFromEvent(event: DomainEvent | IntegrationEvent): string | undefined;
    attachCausationId<T extends DomainEvent | IntegrationEvent>(event: T, causationId: string): T;
};
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
export declare const createEventFilter: (filter: EventFilter) => (event: DomainEvent) => boolean;
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
export declare const createEventRouter: () => {
    route(eventType: string, handler: EventHandler): void;
    dispatch(event: DomainEvent): Promise<void>;
    unroute(eventType: string, handler?: EventHandler): void;
    getRoutes(): Map<string, EventHandler[]>;
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
export declare const createPriorityEventRouter: () => {
    route(eventType: string, handler: EventHandler, priority?: number): void;
    dispatch(event: DomainEvent): Promise<void>;
    unroute(eventType: string): void;
};
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
export declare const createDeadLetterQueue: (storage: any) => {
    add(event: DomainEvent | IntegrationEvent, error: Error, retryCount: number): Promise<void>;
    getAll(): Promise<DeadLetterMessage[]>;
    remove(eventId: string): Promise<void>;
    retry(eventId: string, handler: EventHandler): Promise<void>;
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
export declare const createRetryStrategy: (config: RetryStrategy) => <T>(fn: () => Promise<T>) => Promise<T>;
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
export declare const createResilientEventHandler: <T extends DomainEvent | IntegrationEvent>(handler: EventHandler<T>, retryStrategy: RetryStrategy, deadLetterQueue: any) => EventHandler<T>;
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
export declare const createEventBus: () => {
    subscribe(eventType: string, handler: EventHandler): () => void;
    publish(event: DomainEvent | IntegrationEvent): Promise<void>;
    publishBatch(events: (DomainEvent | IntegrationEvent)[]): Promise<void>;
    getSubscribers(eventType: string): EventHandler[];
    unsubscribeAll(eventType?: string): void;
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
export declare const createOrderedEventBus: () => {
    subscribe(eventType: string, handler: EventHandler): () => void;
    publish(event: DomainEvent | IntegrationEvent): Promise<void>;
    getQueueLength(): number;
    isProcessing(): boolean;
};
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
export declare const createProjectionHandler: (readModelRepository: any, projectionFn: (event: DomainEvent) => Promise<Record<string, any> | null>) => EventHandler<DomainEvent>;
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
export declare const createMultiProjectionHandler: (projections: Map<string, EventHandler>) => EventHandler<DomainEvent>;
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
export declare const createEventStream: (eventEmitter: any, eventType: string) => {
    subscribe(observer: (event: any) => void): {
        unsubscribe: () => void;
    };
    pipe(transformFn: (event: any) => any): any;
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
export declare const createMergedEventStream: (eventEmitter: any, eventTypes: string[]) => {
    subscribe(observer: (event: any) => void): {
        unsubscribe: () => void;
    };
};
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
export declare const createEventRecorder: () => {
    record(event: DomainEvent | IntegrationEvent): void;
    getRecordedEvents(): Array<DomainEvent | IntegrationEvent>;
    getEventsByType(eventType: string): Array<DomainEvent | IntegrationEvent>;
    getEventCount(): number;
    clear(): void;
    hasEvent(eventType: string): boolean;
    getLastEvent(): DomainEvent | IntegrationEvent | undefined;
    assertEventPublished(eventType: string): void;
    assertEventCount(expectedCount: number): void;
};
export {};
//# sourceMappingURL=nestjs-event-driven-patterns-kit.d.ts.map