"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventRecorder = exports.createMergedEventStream = exports.createEventStream = exports.createMultiProjectionHandler = exports.createProjectionHandler = exports.createOrderedEventBus = exports.createEventBus = exports.createResilientEventHandler = exports.createRetryStrategy = exports.createDeadLetterQueue = exports.createPriorityEventRouter = exports.createEventRouter = exports.createEventFilter = exports.createCorrelationIdTracker = exports.createEventMetadataEnricher = exports.createEventSerializer = exports.createSagaStepBuilder = exports.createProcessManager = exports.createSagaCoordinator = exports.createSnapshotAggregateLoader = exports.createSnapshotStore = exports.createEventReplay = exports.createVersionedEvent = exports.createEventUpcaster = exports.createOptimisticConcurrencyEventStore = exports.createPersistentEventStore = exports.createInMemoryEventStore = exports.createAggregateRoot = exports.createEventSourcedAggregate = exports.createQueryBus = exports.createQueryHandler = exports.createTransactionalCommandHandler = exports.createCommandBus = exports.createCommandHandler = exports.createBatchedEventHandler = exports.createIdempotentEventHandler = exports.createEventHandler = exports.convertToIntegrationEvent = exports.createIntegrationEvent = exports.enrichDomainEvent = exports.createDomainEventFactory = exports.createDomainEvent = exports.createWildcardListener = exports.createIntegrationEventEmitter = exports.createDomainEventEmitter = void 0;
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
const createDomainEventEmitter = (eventEmitter) => {
    return {
        async emit(eventType, event) {
            await eventEmitter.emitAsync(eventType, event);
        },
        on(eventType, handler) {
            eventEmitter.on(eventType, handler);
        },
        once(eventType, handler) {
            eventEmitter.once(eventType, handler);
        },
        off(eventType, handler) {
            eventEmitter.off(eventType, handler);
        },
        removeAllListeners(eventType) {
            eventEmitter.removeAllListeners(eventType);
        },
    };
};
exports.createDomainEventEmitter = createDomainEventEmitter;
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
const createIntegrationEventEmitter = (eventEmitter, serviceName) => {
    return {
        async publish(eventType, data, metadata) {
            const event = {
                eventId: generateEventId(),
                eventType,
                source: serviceName,
                timestamp: new Date(),
                data,
                metadata,
            };
            await eventEmitter.emitAsync(`integration.${eventType}`, event);
        },
        subscribe(eventType, handler) {
            eventEmitter.on(`integration.${eventType}`, handler);
        },
        unsubscribe(eventType, handler) {
            eventEmitter.off(`integration.${eventType}`, handler);
        },
    };
};
exports.createIntegrationEventEmitter = createIntegrationEventEmitter;
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
const createWildcardListener = (eventEmitter, pattern, handler) => {
    eventEmitter.on(pattern, handler);
    return () => {
        eventEmitter.off(pattern, handler);
    };
};
exports.createWildcardListener = createWildcardListener;
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
const createDomainEvent = (eventType, aggregateId, aggregateType, version, data, metadata) => {
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
exports.createDomainEvent = createDomainEvent;
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
const createDomainEventFactory = (aggregateType) => {
    return (eventType, aggregateId, version, data, metadata) => {
        return (0, exports.createDomainEvent)(eventType, aggregateId, aggregateType, version, data, metadata);
    };
};
exports.createDomainEventFactory = createDomainEventFactory;
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
const enrichDomainEvent = (event, metadata) => {
    return {
        ...event,
        metadata: {
            ...event.metadata,
            ...metadata,
        },
    };
};
exports.enrichDomainEvent = enrichDomainEvent;
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
const createIntegrationEvent = (eventType, source, data, metadata) => {
    return {
        eventId: generateEventId(),
        eventType,
        source,
        timestamp: new Date(),
        data,
        metadata,
    };
};
exports.createIntegrationEvent = createIntegrationEvent;
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
const convertToIntegrationEvent = (domainEvent, source) => {
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
exports.convertToIntegrationEvent = convertToIntegrationEvent;
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
const createEventHandler = (handleFn, onError) => {
    return {
        async handle(event) {
            try {
                await handleFn(event);
            }
            catch (error) {
                if (onError) {
                    await onError(error, event);
                }
                else {
                    throw error;
                }
            }
        },
    };
};
exports.createEventHandler = createEventHandler;
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
const createIdempotentEventHandler = (handler, processedEventsStore) => {
    return {
        async handle(event) {
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
exports.createIdempotentEventHandler = createIdempotentEventHandler;
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
const createBatchedEventHandler = (batchHandlerFn, batchSize = 10, flushInterval = 5000) => {
    let batch = [];
    let timer = null;
    const flush = async () => {
        if (batch.length === 0)
            return;
        const eventsToProcess = [...batch];
        batch = [];
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        await batchHandlerFn(eventsToProcess);
    };
    const scheduleFlush = () => {
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(flush, flushInterval);
    };
    return {
        async handle(event) {
            batch.push(event);
            if (batch.length >= batchSize) {
                await flush();
            }
            else {
                scheduleFlush();
            }
        },
        async flush() {
            await flush();
        },
    };
};
exports.createBatchedEventHandler = createBatchedEventHandler;
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
const createCommandHandler = (executeFn, validateFn) => {
    return {
        async execute(command) {
            if (validateFn) {
                await validateFn(command);
            }
            return executeFn(command);
        },
    };
};
exports.createCommandHandler = createCommandHandler;
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
const createCommandBus = () => {
    const handlers = new Map();
    return {
        register(commandType, handler) {
            handlers.set(commandType, handler);
        },
        async execute(commandType, command) {
            const handler = handlers.get(commandType);
            if (!handler) {
                throw new Error(`No handler registered for command type: ${commandType}`);
            }
            return handler.execute(command);
        },
        has(commandType) {
            return handlers.has(commandType);
        },
        unregister(commandType) {
            handlers.delete(commandType);
        },
    };
};
exports.createCommandBus = createCommandBus;
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
const createTransactionalCommandHandler = (handler, transactionManager) => {
    return {
        async execute(command) {
            const queryRunner = transactionManager.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const result = await handler.execute(command);
                await queryRunner.commitTransaction();
                return result;
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                await queryRunner.release();
            }
        },
    };
};
exports.createTransactionalCommandHandler = createTransactionalCommandHandler;
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
const createQueryHandler = (executeFn, cacheManager, cacheTTL = 300) => {
    return {
        async execute(query) {
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
exports.createQueryHandler = createQueryHandler;
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
const createQueryBus = () => {
    const handlers = new Map();
    return {
        register(queryType, handler) {
            handlers.set(queryType, handler);
        },
        async execute(queryType, query) {
            const handler = handlers.get(queryType);
            if (!handler) {
                throw new Error(`No handler registered for query type: ${queryType}`);
            }
            return handler.execute(query);
        },
        has(queryType) {
            return handlers.has(queryType);
        },
        unregister(queryType) {
            handlers.delete(queryType);
        },
    };
};
exports.createQueryBus = createQueryBus;
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
const createEventSourcedAggregate = (aggregateId, events, applyFn, initialState = {}) => {
    let state = { ...initialState, id: aggregateId };
    for (const event of events) {
        state = applyFn(state, event);
    }
    return state;
};
exports.createEventSourcedAggregate = createEventSourcedAggregate;
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
const createAggregateRoot = (aggregateId, aggregateType) => {
    let version = 0;
    const uncommittedEvents = [];
    return {
        aggregateId,
        aggregateType,
        version,
        applyEvent(event) {
            uncommittedEvents.push(event);
            version = event.version;
        },
        getUncommittedEvents() {
            return [...uncommittedEvents];
        },
        markEventsAsCommitted() {
            uncommittedEvents.length = 0;
        },
        loadFromHistory(events) {
            for (const event of events) {
                version = event.version;
            }
        },
        getVersion() {
            return version;
        },
    };
};
exports.createAggregateRoot = createAggregateRoot;
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
const createInMemoryEventStore = () => {
    const events = [];
    return {
        async append(event) {
            events.push({ ...event });
        },
        async getEvents(aggregateId) {
            return events.filter((e) => e.aggregateId === aggregateId);
        },
        async getEventsByType(eventType) {
            return events.filter((e) => e.eventType === eventType);
        },
        async getEventsFromVersion(aggregateId, fromVersion) {
            return events.filter((e) => e.aggregateId === aggregateId && e.version >= fromVersion);
        },
    };
};
exports.createInMemoryEventStore = createInMemoryEventStore;
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
const createPersistentEventStore = (repository) => {
    return {
        async append(event) {
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
        async getEvents(aggregateId) {
            const storedEvents = await repository.find({
                where: { aggregateId },
                order: { version: 'ASC' },
            });
            return storedEvents.map((e) => ({
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
        async getEventsByType(eventType) {
            const storedEvents = await repository.find({
                where: { eventType },
                order: { timestamp: 'ASC' },
            });
            return storedEvents.map((e) => ({
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
        async getEventsFromVersion(aggregateId, fromVersion) {
            const storedEvents = await repository
                .createQueryBuilder('event')
                .where('event.aggregateId = :aggregateId', { aggregateId })
                .andWhere('event.version >= :fromVersion', { fromVersion })
                .orderBy('event.version', 'ASC')
                .getMany();
            return storedEvents.map((e) => ({
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
exports.createPersistentEventStore = createPersistentEventStore;
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
const createOptimisticConcurrencyEventStore = (eventStore) => {
    return {
        async append(event) {
            const existingEvents = await eventStore.getEvents(event.aggregateId);
            const latestVersion = existingEvents.reduce((max, e) => Math.max(max, e.version), 0);
            if (event.version !== latestVersion + 1) {
                throw new Error(`Concurrency conflict: Expected version ${latestVersion + 1}, got ${event.version}`);
            }
            await eventStore.append(event);
        },
        getEvents: eventStore.getEvents.bind(eventStore),
        getEventsByType: eventStore.getEventsByType.bind(eventStore),
        getEventsFromVersion: eventStore.getEventsFromVersion.bind(eventStore),
    };
};
exports.createOptimisticConcurrencyEventStore = createOptimisticConcurrencyEventStore;
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
const createEventUpcaster = (upcasters) => {
    return (event) => {
        const upcaster = upcasters[event.eventType];
        if (upcaster) {
            return upcaster(event);
        }
        return event;
    };
};
exports.createEventUpcaster = createEventUpcaster;
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
const createVersionedEvent = (event, schemaVersion) => {
    return {
        ...event,
        schemaVersion,
        metadata: {
            ...event.metadata,
            schemaVersion,
        },
    };
};
exports.createVersionedEvent = createVersionedEvent;
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
const createEventReplay = (eventStore, projectionFn) => {
    return async (eventTypePattern) => {
        let events = [];
        if (eventTypePattern) {
            // Simple pattern matching
            const allEventTypes = await eventStore.getEventsByType(eventTypePattern);
            events = allEventTypes;
        }
        else {
            // This would need to get all events - implementation depends on store
            throw new Error('Full replay requires event store support');
        }
        for (const event of events) {
            await projectionFn(event);
        }
    };
};
exports.createEventReplay = createEventReplay;
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
const createSnapshotStore = (repository) => {
    return {
        async save(aggregateId, aggregateType, version, state) {
            await repository.save({
                aggregateId,
                aggregateType,
                version,
                state: JSON.stringify(state),
                timestamp: new Date(),
            });
        },
        async get(aggregateId) {
            const snapshot = await repository.findOne({
                where: { aggregateId },
                order: { version: 'DESC' },
            });
            if (!snapshot)
                return null;
            return {
                aggregateId: snapshot.aggregateId,
                aggregateType: snapshot.aggregateType,
                version: snapshot.version,
                state: JSON.parse(snapshot.state),
                timestamp: snapshot.timestamp,
            };
        },
        async delete(aggregateId) {
            await repository.delete({ aggregateId });
        },
    };
};
exports.createSnapshotStore = createSnapshotStore;
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
const createSnapshotAggregateLoader = (eventStore, snapshotStore, applyFn) => {
    return async (aggregateId) => {
        const snapshot = await snapshotStore.get(aggregateId);
        let state;
        let fromVersion;
        if (snapshot) {
            state = snapshot.state;
            fromVersion = snapshot.version + 1;
        }
        else {
            state = { id: aggregateId };
            fromVersion = 1;
        }
        const events = await eventStore.getEventsFromVersion(aggregateId, fromVersion);
        for (const event of events) {
            state = applyFn(state, event);
        }
        return state;
    };
};
exports.createSnapshotAggregateLoader = createSnapshotAggregateLoader;
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
const createSagaCoordinator = (steps) => {
    return {
        async execute(initialContext) {
            const context = { ...initialContext };
            const completedSteps = [];
            try {
                for (const step of steps) {
                    const result = await step.execute(context);
                    Object.assign(context, result);
                    completedSteps.push(step);
                }
                return context;
            }
            catch (error) {
                // Compensate in reverse order
                for (let i = completedSteps.length - 1; i >= 0; i--) {
                    const step = completedSteps[i];
                    if (step.compensate) {
                        try {
                            await step.compensate(context);
                        }
                        catch (compensationError) {
                            console.error(`Compensation failed for step ${step.name}:`, compensationError);
                        }
                    }
                }
                throw error;
            }
        },
        getSteps() {
            return [...steps];
        },
    };
};
exports.createSagaCoordinator = createSagaCoordinator;
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
const createProcessManager = (processId, initialState = {}) => {
    const state = {
        processId,
        state: { ...initialState },
        completedSteps: [],
        isCompleted: false,
    };
    return {
        processId,
        getState() {
            return { ...state.state };
        },
        handleEvent(event, transitionFn) {
            const newState = transitionFn(state, event);
            Object.assign(state, newState);
        },
        markStepCompleted(stepName) {
            if (!state.completedSteps.includes(stepName)) {
                state.completedSteps.push(stepName);
            }
        },
        isStepCompleted(stepName) {
            return state.completedSteps.includes(stepName);
        },
        complete() {
            state.isCompleted = true;
        },
        isCompleted() {
            return state.isCompleted;
        },
        getCompletedSteps() {
            return [...state.completedSteps];
        },
    };
};
exports.createProcessManager = createProcessManager;
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
const createSagaStepBuilder = (name) => {
    let executeFn;
    let compensateFn;
    return {
        execute(fn) {
            executeFn = fn;
            return this;
        },
        compensate(fn) {
            compensateFn = fn;
            return this;
        },
        build() {
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
exports.createSagaStepBuilder = createSagaStepBuilder;
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
const createEventSerializer = () => {
    return {
        serialize(event) {
            return JSON.stringify({
                ...event,
                timestamp: event.timestamp.toISOString(),
            });
        },
        deserialize(json) {
            const parsed = JSON.parse(json);
            return {
                ...parsed,
                timestamp: new Date(parsed.timestamp),
            };
        },
        serializeBatch(events) {
            return JSON.stringify(events.map((event) => ({
                ...event,
                timestamp: event.timestamp.toISOString(),
            })));
        },
        deserializeBatch(json) {
            const parsed = JSON.parse(json);
            return parsed.map((event) => ({
                ...event,
                timestamp: new Date(event.timestamp),
            }));
        },
    };
};
exports.createEventSerializer = createEventSerializer;
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
const createEventMetadataEnricher = (enrichFn) => {
    return (event, context) => {
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
exports.createEventMetadataEnricher = createEventMetadataEnricher;
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
const createCorrelationIdTracker = () => {
    return {
        generate() {
            return generateEventId();
        },
        attachToEvent(event, correlationId) {
            return {
                ...event,
                metadata: {
                    ...event.metadata,
                    correlationId,
                },
            };
        },
        extractFromEvent(event) {
            return event.metadata?.correlationId;
        },
        attachCausationId(event, causationId) {
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
exports.createCorrelationIdTracker = createCorrelationIdTracker;
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
const createEventFilter = (filter) => {
    return (event) => {
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
exports.createEventFilter = createEventFilter;
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
const createEventRouter = () => {
    const routes = new Map();
    return {
        route(eventType, handler) {
            const handlers = routes.get(eventType) || [];
            handlers.push(handler);
            routes.set(eventType, handlers);
        },
        async dispatch(event) {
            const handlers = routes.get(event.eventType) || [];
            await Promise.all(handlers.map((handler) => handler.handle(event)));
        },
        unroute(eventType, handler) {
            if (!handler) {
                routes.delete(eventType);
            }
            else {
                const handlers = routes.get(eventType) || [];
                const filtered = handlers.filter((h) => h !== handler);
                routes.set(eventType, filtered);
            }
        },
        getRoutes() {
            return new Map(routes);
        },
    };
};
exports.createEventRouter = createEventRouter;
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
const createPriorityEventRouter = () => {
    const routes = new Map();
    return {
        route(eventType, handler, priority = 5) {
            const handlers = routes.get(eventType) || [];
            handlers.push({ handler, priority });
            handlers.sort((a, b) => b.priority - a.priority);
            routes.set(eventType, handlers);
        },
        async dispatch(event) {
            const handlers = routes.get(event.eventType) || [];
            for (const { handler } of handlers) {
                await handler.handle(event);
            }
        },
        unroute(eventType) {
            routes.delete(eventType);
        },
    };
};
exports.createPriorityEventRouter = createPriorityEventRouter;
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
const createDeadLetterQueue = (storage) => {
    return {
        async add(event, error, retryCount) {
            const deadLetter = {
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
        async getAll() {
            const stored = await storage.find();
            return stored.map((item) => ({
                event: JSON.parse(item.event),
                error: new Error(item.error),
                retryCount: item.retryCount,
                timestamp: item.timestamp,
            }));
        },
        async remove(eventId) {
            await storage.delete({ eventId });
        },
        async retry(eventId, handler) {
            const item = await storage.findOne({ where: { eventId } });
            if (!item) {
                throw new Error(`Dead letter message ${eventId} not found`);
            }
            const event = JSON.parse(item.event);
            try {
                await handler.handle(event);
                await this.remove(eventId);
            }
            catch (error) {
                await storage.update({ eventId }, {
                    retryCount: item.retryCount + 1,
                    error: error.message,
                    timestamp: new Date(),
                });
                throw error;
            }
        },
    };
};
exports.createDeadLetterQueue = createDeadLetterQueue;
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
const createRetryStrategy = (config) => {
    return async (fn) => {
        let lastError;
        let currentDelay = config.delay;
        for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
            try {
                return await fn();
            }
            catch (error) {
                lastError = error;
                if (attempt < config.maxRetries) {
                    await new Promise((resolve) => setTimeout(resolve, currentDelay));
                    if (config.backoffMultiplier) {
                        currentDelay = Math.min(currentDelay * config.backoffMultiplier, config.maxDelay || Infinity);
                    }
                }
            }
        }
        throw lastError;
    };
};
exports.createRetryStrategy = createRetryStrategy;
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
const createResilientEventHandler = (handler, retryStrategy, deadLetterQueue) => {
    const retry = (0, exports.createRetryStrategy)(retryStrategy);
    return {
        async handle(event) {
            try {
                await retry(() => handler.handle(event));
            }
            catch (error) {
                await deadLetterQueue.add(event, error, retryStrategy.maxRetries);
                throw error;
            }
        },
    };
};
exports.createResilientEventHandler = createResilientEventHandler;
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
const createEventBus = () => {
    const subscribers = new Map();
    return {
        subscribe(eventType, handler) {
            const handlers = subscribers.get(eventType) || [];
            handlers.push(handler);
            subscribers.set(eventType, handlers);
            return () => {
                const currentHandlers = subscribers.get(eventType) || [];
                const filtered = currentHandlers.filter((h) => h !== handler);
                subscribers.set(eventType, filtered);
            };
        },
        async publish(event) {
            const eventType = event.eventType;
            const handlers = subscribers.get(eventType) || [];
            await Promise.all(handlers.map((handler) => handler.handle(event)));
        },
        async publishBatch(events) {
            await Promise.all(events.map((event) => this.publish(event)));
        },
        getSubscribers(eventType) {
            return subscribers.get(eventType) || [];
        },
        unsubscribeAll(eventType) {
            if (eventType) {
                subscribers.delete(eventType);
            }
            else {
                subscribers.clear();
            }
        },
    };
};
exports.createEventBus = createEventBus;
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
const createOrderedEventBus = () => {
    const subscribers = new Map();
    const queue = [];
    let processing = false;
    const processQueue = async () => {
        if (processing || queue.length === 0)
            return;
        processing = true;
        while (queue.length > 0) {
            const item = queue.shift();
            if (!item)
                break;
            try {
                const handlers = subscribers.get(item.event.eventType) || [];
                await Promise.all(handlers.map((handler) => handler.handle(item.event)));
                item.resolve();
            }
            catch (error) {
                item.reject(error);
            }
        }
        processing = false;
    };
    return {
        subscribe(eventType, handler) {
            const handlers = subscribers.get(eventType) || [];
            handlers.push(handler);
            subscribers.set(eventType, handlers);
            return () => {
                const currentHandlers = subscribers.get(eventType) || [];
                const filtered = currentHandlers.filter((h) => h !== handler);
                subscribers.set(eventType, filtered);
            };
        },
        async publish(event) {
            return new Promise((resolve, reject) => {
                queue.push({ event, resolve, reject });
                processQueue();
            });
        },
        getQueueLength() {
            return queue.length;
        },
        isProcessing() {
            return processing;
        },
    };
};
exports.createOrderedEventBus = createOrderedEventBus;
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
const createProjectionHandler = (readModelRepository, projectionFn) => {
    return {
        async handle(event) {
            const projection = await projectionFn(event);
            if (projection) {
                await readModelRepository.save(projection);
            }
        },
    };
};
exports.createProjectionHandler = createProjectionHandler;
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
const createMultiProjectionHandler = (projections) => {
    return {
        async handle(event) {
            await Promise.all(Array.from(projections.values()).map((projection) => projection.handle(event)));
        },
    };
};
exports.createMultiProjectionHandler = createMultiProjectionHandler;
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
const createEventStream = (eventEmitter, eventType) => {
    const listeners = [];
    eventEmitter.on(eventType, (event) => {
        listeners.forEach((listener) => listener(event));
    });
    return {
        subscribe(observer) {
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
        pipe(transformFn) {
            const transformedListeners = [];
            eventEmitter.on(eventType, (event) => {
                const transformed = transformFn(event);
                transformedListeners.forEach((listener) => listener(transformed));
            });
            return {
                subscribe(observer) {
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
exports.createEventStream = createEventStream;
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
const createMergedEventStream = (eventEmitter, eventTypes) => {
    const listeners = [];
    eventTypes.forEach((eventType) => {
        eventEmitter.on(eventType, (event) => {
            listeners.forEach((listener) => listener(event));
        });
    });
    return {
        subscribe(observer) {
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
exports.createMergedEventStream = createMergedEventStream;
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
const createEventRecorder = () => {
    const recordedEvents = [];
    return {
        record(event) {
            recordedEvents.push({ ...event });
        },
        getRecordedEvents() {
            return [...recordedEvents];
        },
        getEventsByType(eventType) {
            return recordedEvents.filter((e) => e.eventType === eventType);
        },
        getEventCount() {
            return recordedEvents.length;
        },
        clear() {
            recordedEvents.length = 0;
        },
        hasEvent(eventType) {
            return recordedEvents.some((e) => e.eventType === eventType);
        },
        getLastEvent() {
            return recordedEvents[recordedEvents.length - 1];
        },
        assertEventPublished(eventType) {
            if (!this.hasEvent(eventType)) {
                throw new Error(`Expected event ${eventType} to be published`);
            }
        },
        assertEventCount(expectedCount) {
            if (recordedEvents.length !== expectedCount) {
                throw new Error(`Expected ${expectedCount} events, got ${recordedEvents.length}`);
            }
        },
    };
};
exports.createEventRecorder = createEventRecorder;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
/**
 * Generates a unique event ID.
 */
function generateEventId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
//# sourceMappingURL=nestjs-event-driven-patterns-kit.js.map