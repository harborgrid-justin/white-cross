"use strict";
/**
 * LOC: EVT-KIT-001
 * File: /reuse/event-driven-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Event handlers and processors
 *   - Event sourcing implementations
 *   - CQRS pattern implementations
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuditTrail = exports.filterAuditLogs = exports.createEventAudit = exports.purgeDeadLetterQueue = exports.retryDeadLetterMessages = exports.addToDeadLetterQueue = exports.createDeadLetterQueue = exports.createMigrationPath = exports.filterEvents = exports.upgradeEvent = exports.createEventVersion = exports.replayEvents = exports.createReplayConfig = exports.createSagaEvent = exports.getSagaProgress = exports.compensateSaga = exports.executeNextSagaStep = exports.createSagaStep = exports.createSaga = exports.createMaterializedView = exports.validateCommand = exports.updateProjection = exports.createProjection = exports.createQuery = exports.createCommand = exports.validateEventStream = exports.loadFromSnapshot = exports.shouldCreateSnapshot = exports.createSnapshot = exports.createEventStream = exports.rebuildAggregateFromEvents = exports.appendEventToStream = exports.createEventStoreEntry = exports.createConsumerGroup = exports.createEventTopic = exports.routeEventToSubscribers = exports.createEventSubscription = exports.publishToEventBus = exports.createEventBusMessage = exports.createMiddlewareEmitter = exports.wrapEventListener = exports.createPriorityEmitter = exports.createBatchedEmitter = exports.emitEventSafely = exports.createDomainEvent = void 0;
/**
 * File: /reuse/event-driven-kit.ts
 * Locator: WC-UTL-EVT-KIT-001
 * Purpose: Comprehensive Event-Driven Architecture Toolkit - Event Sourcing, CQRS, Saga, Event Bus, DLQ
 *
 * Upstream: Independent utility module for event-driven patterns
 * Downstream: ../backend/*, event handlers, saga orchestrators, event store implementations
 * Dependencies: TypeScript 5.x, Node 18+, Hapi.js 21.x, amqplib (RabbitMQ), kafkajs (Kafka), ioredis (Redis)
 * Exports: 45 utility functions for event sourcing, CQRS, saga orchestration, event bus, event replay, versioning, auditing
 *
 * LLM Context: Production-ready event-driven utilities for White Cross healthcare platform. Provides comprehensive tools for
 * event sourcing, CQRS pattern implementation, saga orchestration, event versioning, event replay, event store management,
 * domain event factories, event subscribers, filtering, dead letter queue handling, and event auditing. Essential for
 * building HIPAA-compliant event-driven healthcare microservices with full audit trails and event traceability.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// SECTION 1: EVENT EMITTER WRAPPERS (Functions 1-6)
// ============================================================================
/**
 * 1. Creates a domain event with full metadata and tracing.
 *
 * @param {string} eventType - Type of domain event
 * @param {string} aggregateId - Aggregate root ID
 * @param {string} aggregateType - Aggregate type
 * @param {any} payload - Event payload
 * @param {number} [version=1] - Event version
 * @param {string} [userId] - User who triggered event
 * @returns {DomainEvent} Domain event object
 *
 * @example
 * ```typescript
 * const event = createDomainEvent('PatientAdmitted', 'patient-123', 'Patient', { room: '401' }, 1, 'user-456');
 * // Result: { eventId: 'evt-...', eventType: 'PatientAdmitted', aggregateId: 'patient-123', ... }
 * ```
 */
const createDomainEvent = (eventType, aggregateId, aggregateType, payload, version = 1, userId) => {
    return {
        eventId: generateEventId(),
        eventType,
        aggregateId,
        aggregateType,
        payload,
        version,
        timestamp: new Date(),
        userId,
        metadata: {
            source: 'domain',
            environment: process.env.NODE_ENV || 'development',
        },
        correlationId: generateCorrelationId(),
    };
};
exports.createDomainEvent = createDomainEvent;
/**
 * 2. Wraps event emitter with async error handling.
 *
 * @param {any} emitter - Event emitter instance
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {Promise<boolean>} True if emitted successfully
 *
 * @example
 * ```typescript
 * await emitEventSafely(eventEmitter, 'patient.created', { id: '123' });
 * // Result: Emits event with error handling
 * ```
 */
const emitEventSafely = async (emitter, event, data) => {
    try {
        emitter.emit(event, data);
        return true;
    }
    catch (error) {
        console.error(`Failed to emit event ${event}:`, error);
        return false;
    }
};
exports.emitEventSafely = emitEventSafely;
/**
 * 3. Creates batched event emitter for high-throughput scenarios.
 *
 * @param {any} emitter - Event emitter instance
 * @param {number} batchSize - Maximum batch size
 * @param {number} flushInterval - Flush interval in ms
 * @returns {object} Batched emitter
 *
 * @example
 * ```typescript
 * const batcher = createBatchedEmitter(emitter, 100, 1000);
 * // Result: Emitter that batches up to 100 events or flushes every 1000ms
 * ```
 */
const createBatchedEmitter = (emitter, batchSize, flushInterval) => {
    const batch = [];
    let timer = null;
    const flush = () => {
        if (batch.length > 0) {
            emitter.emit('batch', batch.splice(0, batch.length));
        }
    };
    const add = (event) => {
        batch.push(event);
        if (batch.length >= batchSize) {
            flush();
        }
        else if (!timer) {
            timer = setTimeout(() => {
                flush();
                timer = null;
            }, flushInterval);
        }
    };
    return { add, flush };
};
exports.createBatchedEmitter = createBatchedEmitter;
/**
 * 4. Creates prioritized event emitter with priority queues.
 *
 * @param {any} emitter - Event emitter instance
 * @returns {object} Prioritized emitter
 *
 * @example
 * ```typescript
 * const priorityEmitter = createPriorityEmitter(emitter);
 * priorityEmitter.emit('critical-event', data, 10); // High priority
 * ```
 */
const createPriorityEmitter = (emitter) => {
    const queues = new Map();
    const emit = (event, data, priority = 5) => {
        if (!queues.has(priority)) {
            queues.set(priority, []);
        }
        queues.get(priority).push({ event, data });
        processQueue();
    };
    const processQueue = () => {
        const priorities = Array.from(queues.keys()).sort((a, b) => b - a);
        for (const priority of priorities) {
            const queue = queues.get(priority);
            while (queue.length > 0) {
                const { event, data } = queue.shift();
                emitter.emit(event, data);
            }
        }
    };
    return { emit, processQueue };
};
exports.createPriorityEmitter = createPriorityEmitter;
/**
 * 5. Wraps event listener with error boundary.
 *
 * @param {Function} handler - Event handler function
 * @param {Function} [onError] - Error handler
 * @returns {Function} Wrapped handler
 *
 * @example
 * ```typescript
 * const safeHandler = wrapEventListener(
 *   async (event) => { await processEvent(event); },
 *   (error) => { logError(error); }
 * );
 * ```
 */
const wrapEventListener = (handler, onError) => {
    return async (event) => {
        try {
            await handler(event);
        }
        catch (error) {
            if (onError) {
                onError(error);
            }
            else {
                console.error('Event handler error:', error);
            }
        }
    };
};
exports.wrapEventListener = wrapEventListener;
/**
 * 6. Creates event emitter with middleware pipeline.
 *
 * @param {any} emitter - Base event emitter
 * @param {Function[]} middleware - Middleware functions
 * @returns {object} Emitter with middleware
 *
 * @example
 * ```typescript
 * const enhanced = createMiddlewareEmitter(emitter, [
 *   (event) => { console.log('Logging:', event); return event; },
 *   (event) => { event.timestamp = new Date(); return event; }
 * ]);
 * ```
 */
const createMiddlewareEmitter = (emitter, middleware) => {
    const emit = async (eventName, data) => {
        let processedData = data;
        for (const fn of middleware) {
            processedData = await fn(processedData);
        }
        emitter.emit(eventName, processedData);
    };
    return { emit };
};
exports.createMiddlewareEmitter = createMiddlewareEmitter;
// ============================================================================
// SECTION 2: EVENT BUS HELPERS (Functions 7-12)
// ============================================================================
/**
 * 7. Creates event bus message with retry configuration.
 *
 * @param {string} topic - Event topic
 * @param {DomainEvent} event - Domain event
 * @param {number} [maxRetries=3] - Maximum retry attempts
 * @returns {EventBusMessage} Event bus message
 *
 * @example
 * ```typescript
 * const msg = createEventBusMessage('patient-events', domainEvent, 3);
 * // Result: { messageId: 'msg-...', topic: 'patient-events', event: {...}, maxRetries: 3 }
 * ```
 */
const createEventBusMessage = (topic, event, maxRetries = 3) => {
    return {
        messageId: generateMessageId(),
        topic,
        event,
        timestamp: new Date(),
        retryCount: 0,
        maxRetries,
    };
};
exports.createEventBusMessage = createEventBusMessage;
/**
 * 8. Publishes event to event bus with partitioning.
 *
 * @param {any} eventBus - Event bus instance
 * @param {string} topic - Topic name
 * @param {DomainEvent} event - Event to publish
 * @param {string} [partitionKey] - Partition key for ordering
 * @returns {Promise<void>} Publication promise
 *
 * @example
 * ```typescript
 * await publishToEventBus(bus, 'patient-events', event, 'patient-123');
 * // Result: Event published to specific partition
 * ```
 */
const publishToEventBus = async (eventBus, topic, event, partitionKey) => {
    const message = (0, exports.createEventBusMessage)(topic, event);
    await eventBus.publish(topic, message, { partitionKey: partitionKey || event.aggregateId });
};
exports.publishToEventBus = publishToEventBus;
/**
 * 9. Creates event subscription with filtering.
 *
 * @param {string} subscriberName - Subscriber name
 * @param {string[]} eventTypes - Event types to subscribe to
 * @param {Function} handler - Event handler
 * @param {Function} [filter] - Optional filter function
 * @returns {EventSubscription} Subscription configuration
 *
 * @example
 * ```typescript
 * const sub = createEventSubscription('patient-processor', ['PatientAdmitted'], handler,
 *   (event) => event.aggregateId.startsWith('patient-')
 * );
 * ```
 */
const createEventSubscription = (subscriberName, eventTypes, handler, filter) => {
    return {
        subscriptionId: generateSubscriptionId(),
        subscriberName,
        eventTypes,
        handler,
        filter,
        priority: 5,
        active: true,
    };
};
exports.createEventSubscription = createEventSubscription;
/**
 * 10. Routes event to appropriate subscribers based on type.
 *
 * @param {DomainEvent} event - Event to route
 * @param {EventSubscription[]} subscriptions - Active subscriptions
 * @returns {Promise<void>} Routing completion
 *
 * @example
 * ```typescript
 * await routeEventToSubscribers(event, subscriptions);
 * // Result: Event delivered to matching subscribers
 * ```
 */
const routeEventToSubscribers = async (event, subscriptions) => {
    const matching = subscriptions.filter(sub => sub.active &&
        sub.eventTypes.includes(event.eventType) &&
        (!sub.filter || sub.filter(event)));
    // Sort by priority (higher first)
    matching.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    for (const subscription of matching) {
        try {
            await subscription.handler(event);
        }
        catch (error) {
            console.error(`Subscriber ${subscription.subscriberName} failed:`, error);
        }
    }
};
exports.routeEventToSubscribers = routeEventToSubscribers;
/**
 * 11. Creates event bus topic with configuration.
 *
 * @param {string} topicName - Topic name
 * @param {number} partitions - Number of partitions
 * @param {number} replicationFactor - Replication factor
 * @returns {object} Topic configuration
 *
 * @example
 * ```typescript
 * const topic = createEventTopic('patient-events', 10, 3);
 * // Result: { name: 'patient-events', partitions: 10, replicationFactor: 3 }
 * ```
 */
const createEventTopic = (topicName, partitions, replicationFactor) => {
    return {
        name: topicName,
        partitions,
        replicationFactor,
        retentionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
        cleanupPolicy: 'delete',
    };
};
exports.createEventTopic = createEventTopic;
/**
 * 12. Manages event bus consumer group.
 *
 * @param {string} groupId - Consumer group ID
 * @param {string[]} topics - Topics to consume
 * @param {number} [maxConcurrency=10] - Max concurrent consumers
 * @returns {object} Consumer group configuration
 *
 * @example
 * ```typescript
 * const group = createConsumerGroup('patient-processors', ['patient-events'], 10);
 * // Result: Consumer group configuration
 * ```
 */
const createConsumerGroup = (groupId, topics, maxConcurrency = 10) => {
    return {
        groupId,
        topics,
        maxConcurrency,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        autoCommit: true,
        autoCommitInterval: 5000,
    };
};
exports.createConsumerGroup = createConsumerGroup;
// ============================================================================
// SECTION 3: EVENT SOURCING UTILITIES (Functions 13-20)
// ============================================================================
/**
 * 13. Creates event store entry for persistence.
 *
 * @param {string} streamName - Event stream name
 * @param {DomainEvent} event - Domain event
 * @param {number} eventNumber - Event sequence number
 * @returns {EventStoreEntry} Event store entry
 *
 * @example
 * ```typescript
 * const entry = createEventStoreEntry('patient-stream-123', event, 5);
 * // Result: { streamId: '...', streamName: 'patient-stream-123', eventNumber: 5, event: {...} }
 * ```
 */
const createEventStoreEntry = (streamName, event, eventNumber) => {
    return {
        streamId: generateStreamId(),
        streamName,
        eventNumber,
        event,
        timestamp: new Date(),
        metadata: {
            eventType: event.eventType,
            aggregateId: event.aggregateId,
            version: event.version,
        },
    };
};
exports.createEventStoreEntry = createEventStoreEntry;
/**
 * 14. Appends event to event stream.
 *
 * @param {EventStream} stream - Event stream
 * @param {DomainEvent} event - Event to append
 * @returns {EventStream} Updated stream
 *
 * @example
 * ```typescript
 * const updated = appendEventToStream(stream, newEvent);
 * // Result: Stream with new event appended
 * ```
 */
const appendEventToStream = (stream, event) => {
    return {
        ...stream,
        events: [...stream.events, event],
        version: stream.version + 1,
        updatedAt: new Date(),
    };
};
exports.appendEventToStream = appendEventToStream;
/**
 * 15. Rebuilds aggregate state from event stream.
 *
 * @param {DomainEvent[]} events - Event stream
 * @param {any} initialState - Initial aggregate state
 * @param {Record<string, Function>} eventHandlers - Event handlers by type
 * @returns {any} Rebuilt aggregate state
 *
 * @example
 * ```typescript
 * const state = rebuildAggregateFromEvents(events, { id: '123', status: 'new' }, {
 *   'PatientAdmitted': (state, event) => ({ ...state, status: 'admitted' })
 * });
 * ```
 */
const rebuildAggregateFromEvents = (events, initialState, eventHandlers) => {
    return events.reduce((state, event) => {
        const handler = eventHandlers[event.eventType];
        return handler ? handler(state, event) : state;
    }, initialState);
};
exports.rebuildAggregateFromEvents = rebuildAggregateFromEvents;
/**
 * 16. Creates event stream for aggregate.
 *
 * @param {string} aggregateId - Aggregate ID
 * @param {string} aggregateType - Aggregate type
 * @param {DomainEvent[]} [events=[]] - Initial events
 * @returns {EventStream} Event stream
 *
 * @example
 * ```typescript
 * const stream = createEventStream('patient-123', 'Patient', []);
 * // Result: { streamId: '...', aggregateId: 'patient-123', aggregateType: 'Patient', ... }
 * ```
 */
const createEventStream = (aggregateId, aggregateType, events = []) => {
    return {
        streamId: generateStreamId(),
        streamName: `${aggregateType}-${aggregateId}`,
        aggregateId,
        aggregateType,
        version: events.length,
        events,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createEventStream = createEventStream;
/**
 * 17. Creates snapshot of aggregate state.
 *
 * @param {string} aggregateId - Aggregate ID
 * @param {string} aggregateType - Aggregate type
 * @param {number} version - Aggregate version
 * @param {any} state - Current state
 * @returns {EventSnapshot} Snapshot
 *
 * @example
 * ```typescript
 * const snapshot = createSnapshot('patient-123', 'Patient', 100, patientState);
 * // Result: { snapshotId: '...', aggregateId: 'patient-123', version: 100, state: {...} }
 * ```
 */
const createSnapshot = (aggregateId, aggregateType, version, state) => {
    return {
        snapshotId: generateSnapshotId(),
        aggregateId,
        aggregateType,
        version,
        state: JSON.parse(JSON.stringify(state)), // Deep copy
        timestamp: new Date(),
        metadata: {
            reason: 'periodic-snapshot',
        },
    };
};
exports.createSnapshot = createSnapshot;
/**
 * 18. Determines if snapshot should be created.
 *
 * @param {EventStream} stream - Event stream
 * @param {number} snapshotInterval - Events between snapshots
 * @param {number} lastSnapshotVersion - Last snapshot version
 * @returns {boolean} True if snapshot needed
 *
 * @example
 * ```typescript
 * const shouldSnapshot = shouldCreateSnapshot(stream, 100, 50);
 * // Result: true if stream.version >= 150
 * ```
 */
const shouldCreateSnapshot = (stream, snapshotInterval, lastSnapshotVersion) => {
    return stream.version - lastSnapshotVersion >= snapshotInterval;
};
exports.shouldCreateSnapshot = shouldCreateSnapshot;
/**
 * 19. Loads events from snapshot forward.
 *
 * @param {EventSnapshot} snapshot - Starting snapshot
 * @param {DomainEvent[]} recentEvents - Events since snapshot
 * @param {Record<string, Function>} handlers - Event handlers
 * @returns {any} Current state
 *
 * @example
 * ```typescript
 * const state = loadFromSnapshot(snapshot, recentEvents, eventHandlers);
 * // Result: Aggregate state rebuilt from snapshot + recent events
 * ```
 */
const loadFromSnapshot = (snapshot, recentEvents, handlers) => {
    return (0, exports.rebuildAggregateFromEvents)(recentEvents, snapshot.state, handlers);
};
exports.loadFromSnapshot = loadFromSnapshot;
/**
 * 20. Validates event stream consistency.
 *
 * @param {EventStream} stream - Event stream to validate
 * @returns {boolean} True if consistent
 *
 * @example
 * ```typescript
 * const isValid = validateEventStream(stream);
 * // Result: true if events are properly ordered and versioned
 * ```
 */
const validateEventStream = (stream) => {
    if (stream.events.length !== stream.version) {
        return false;
    }
    for (let i = 0; i < stream.events.length; i++) {
        const event = stream.events[i];
        if (event.aggregateId !== stream.aggregateId) {
            return false;
        }
        if (event.version !== i + 1) {
            return false;
        }
    }
    return true;
};
exports.validateEventStream = validateEventStream;
// ============================================================================
// SECTION 4: CQRS PATTERN HELPERS (Functions 21-26)
// ============================================================================
/**
 * 21. Creates CQRS command with validation.
 *
 * @param {string} commandType - Command type
 * @param {string} aggregateId - Target aggregate
 * @param {any} payload - Command payload
 * @param {string} [userId] - User executing command
 * @returns {object} Command object
 *
 * @example
 * ```typescript
 * const cmd = createCommand('AdmitPatient', 'patient-123', { room: '401' }, 'user-456');
 * // Result: { commandId: '...', commandType: 'AdmitPatient', aggregateId: 'patient-123', ... }
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
            source: 'command-handler',
        },
    };
};
exports.createCommand = createCommand;
/**
 * 22. Creates CQRS query with parameters.
 *
 * @param {string} queryType - Query type
 * @param {Record<string, any>} parameters - Query parameters
 * @param {string} [userId] - User executing query
 * @returns {object} Query object
 *
 * @example
 * ```typescript
 * const query = createQuery('GetPatientHistory', { patientId: '123', startDate: '2024-01-01' });
 * // Result: { queryId: '...', queryType: 'GetPatientHistory', parameters: {...} }
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
 * 23. Creates read model projection configuration.
 *
 * @param {string} projectionName - Projection name
 * @param {string[]} eventTypes - Event types to project
 * @param {any} initialState - Initial projection state
 * @returns {EventProjection} Projection configuration
 *
 * @example
 * ```typescript
 * const projection = createProjection('PatientSummary', ['PatientAdmitted', 'PatientDischarged'], {});
 * // Result: Projection configuration for PatientSummary
 * ```
 */
const createProjection = (projectionName, eventTypes, initialState) => {
    return {
        projectionId: generateProjectionId(),
        projectionName,
        lastEventNumber: 0,
        state: initialState,
        timestamp: new Date(),
        version: 1,
    };
};
exports.createProjection = createProjection;
/**
 * 24. Updates projection with new event.
 *
 * @param {EventProjection} projection - Current projection
 * @param {DomainEvent} event - New event
 * @param {Function} updateFn - State update function
 * @returns {EventProjection} Updated projection
 *
 * @example
 * ```typescript
 * const updated = updateProjection(projection, event, (state, evt) => ({
 *   ...state,
 *   patientCount: state.patientCount + 1
 * }));
 * ```
 */
const updateProjection = (projection, event, updateFn) => {
    return {
        ...projection,
        state: updateFn(projection.state, event),
        lastEventNumber: projection.lastEventNumber + 1,
        timestamp: new Date(),
        version: projection.version + 1,
    };
};
exports.updateProjection = updateProjection;
/**
 * 25. Validates command against business rules.
 *
 * @param {any} command - Command to validate
 * @param {Function[]} validators - Validation functions
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCommand(command, [
 *   (cmd) => cmd.payload.room ? null : 'Room is required',
 *   (cmd) => cmd.aggregateId ? null : 'Patient ID is required'
 * ]);
 * ```
 */
const validateCommand = (command, validators) => {
    const errors = [];
    for (const validator of validators) {
        const error = validator(command);
        if (error) {
            errors.push(error);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateCommand = validateCommand;
/**
 * 26. Creates materialized view from projection.
 *
 * @param {EventProjection} projection - Source projection
 * @param {Function} transform - Transformation function
 * @returns {any} Materialized view
 *
 * @example
 * ```typescript
 * const view = createMaterializedView(projection, (state) => ({
 *   summary: state.patientCount,
 *   lastUpdated: new Date()
 * }));
 * ```
 */
const createMaterializedView = (projection, transform) => {
    return transform(projection.state);
};
exports.createMaterializedView = createMaterializedView;
// ============================================================================
// SECTION 5: SAGA ORCHESTRATION (Functions 27-32)
// ============================================================================
/**
 * 27. Creates saga definition with compensation logic.
 *
 * @param {string} sagaType - Saga type
 * @param {SagaStep[]} steps - Saga steps
 * @param {any} initialData - Initial saga data
 * @returns {SagaDefinition} Saga definition
 *
 * @example
 * ```typescript
 * const saga = createSaga('PatientAdmission', [reserveRoom, assignNurse, updateRecords], {
 *   patientId: '123'
 * });
 * ```
 */
const createSaga = (sagaType, steps, initialData) => {
    return {
        sagaId: generateSagaId(),
        sagaType,
        steps,
        status: 'pending',
        currentStep: 0,
        data: initialData,
        compensationRequired: false,
    };
};
exports.createSaga = createSaga;
/**
 * 28. Creates saga step with compensation.
 *
 * @param {string} stepName - Step name
 * @param {any} command - Command to execute
 * @param {Function} [compensate] - Compensation function
 * @returns {SagaStep} Saga step
 *
 * @example
 * ```typescript
 * const step = createSagaStep('ReserveRoom', { type: 'ReserveRoom', roomId: '401' },
 *   async () => { await releaseRoom('401'); }
 * );
 * ```
 */
const createSagaStep = (stepName, command, compensate) => {
    return {
        stepId: generateStepId(),
        stepName,
        command,
        compensate,
        timeout: 30000,
    };
};
exports.createSagaStep = createSagaStep;
/**
 * 29. Executes next saga step with timeout.
 *
 * @param {SagaDefinition} saga - Saga definition
 * @param {Function} executor - Step executor function
 * @returns {Promise<SagaDefinition>} Updated saga
 *
 * @example
 * ```typescript
 * const updated = await executeNextSagaStep(saga, async (step) => {
 *   return await commandBus.send(step.command);
 * });
 * ```
 */
const executeNextSagaStep = async (saga, executor) => {
    if (saga.currentStep >= saga.steps.length) {
        return { ...saga, status: 'completed' };
    }
    const step = saga.steps[saga.currentStep];
    saga.status = 'running';
    try {
        const result = await Promise.race([
            executor(step),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Step timeout')), step.timeout || 30000)),
        ]);
        if (step.onSuccess) {
            await step.onSuccess(result);
        }
        return {
            ...saga,
            currentStep: saga.currentStep + 1,
            data: { ...saga.data, [`step${saga.currentStep}Result`]: result },
        };
    }
    catch (error) {
        if (step.onFailure) {
            await step.onFailure(error);
        }
        return {
            ...saga,
            status: 'failed',
            compensationRequired: true,
        };
    }
};
exports.executeNextSagaStep = executeNextSagaStep;
/**
 * 30. Compensates failed saga by rolling back steps.
 *
 * @param {SagaDefinition} saga - Failed saga
 * @returns {Promise<SagaDefinition>} Compensated saga
 *
 * @example
 * ```typescript
 * const compensated = await compensateSaga(failedSaga);
 * // Result: Saga with compensation executed
 * ```
 */
const compensateSaga = async (saga) => {
    saga.status = 'compensating';
    for (let i = saga.currentStep - 1; i >= 0; i--) {
        const step = saga.steps[i];
        if (step.compensate) {
            try {
                await step.compensate();
            }
            catch (error) {
                console.error(`Compensation failed for step ${step.stepName}:`, error);
            }
        }
    }
    return { ...saga, status: 'failed', currentStep: 0 };
};
exports.compensateSaga = compensateSaga;
/**
 * 31. Monitors saga execution progress.
 *
 * @param {SagaDefinition} saga - Saga to monitor
 * @returns {object} Progress information
 *
 * @example
 * ```typescript
 * const progress = getSagaProgress(saga);
 * // Result: { completed: 3, total: 5, percentage: 60, status: 'running' }
 * ```
 */
const getSagaProgress = (saga) => {
    return {
        sagaId: saga.sagaId,
        sagaType: saga.sagaType,
        completed: saga.currentStep,
        total: saga.steps.length,
        percentage: Math.floor((saga.currentStep / saga.steps.length) * 100),
        status: saga.status,
    };
};
exports.getSagaProgress = getSagaProgress;
/**
 * 32. Creates saga event for state persistence.
 *
 * @param {SagaDefinition} saga - Saga definition
 * @param {string} eventType - Event type
 * @param {any} [payload] - Event payload
 * @returns {DomainEvent} Saga event
 *
 * @example
 * ```typescript
 * const event = createSagaEvent(saga, 'SagaStarted');
 * // Result: Domain event for saga state change
 * ```
 */
const createSagaEvent = (saga, eventType, payload) => {
    return (0, exports.createDomainEvent)(eventType, saga.sagaId, 'Saga', {
        sagaType: saga.sagaType,
        currentStep: saga.currentStep,
        status: saga.status,
        ...payload,
    }, 1);
};
exports.createSagaEvent = createSagaEvent;
// ============================================================================
// SECTION 6: EVENT REPLAY & VERSIONING (Functions 33-38)
// ============================================================================
/**
 * 33. Creates event replay configuration.
 *
 * @param {number} startEventNumber - Starting event number
 * @param {number} [endEventNumber] - Ending event number
 * @param {number} [batchSize=100] - Batch size
 * @returns {EventReplayConfig} Replay configuration
 *
 * @example
 * ```typescript
 * const config = createReplayConfig(0, 1000, 100);
 * // Result: Replay configuration for events 0-1000 in batches of 100
 * ```
 */
const createReplayConfig = (startEventNumber, endEventNumber, batchSize = 100) => {
    return {
        startEventNumber,
        endEventNumber,
        batchSize,
        delayBetweenBatches: 100,
    };
};
exports.createReplayConfig = createReplayConfig;
/**
 * 34. Replays events to rebuild projection.
 *
 * @param {DomainEvent[]} events - Events to replay
 * @param {EventProjection} projection - Target projection
 * @param {Function} updateFn - Update function
 * @returns {Promise<EventProjection>} Updated projection
 *
 * @example
 * ```typescript
 * const rebuilt = await replayEvents(events, projection, updateProjectionFn);
 * // Result: Projection rebuilt from event replay
 * ```
 */
const replayEvents = async (events, projection, updateFn) => {
    let currentProjection = projection;
    for (const event of events) {
        currentProjection = (0, exports.updateProjection)(currentProjection, event, updateFn);
    }
    return currentProjection;
};
exports.replayEvents = replayEvents;
/**
 * 35. Creates event version schema.
 *
 * @param {number} version - Version number
 * @param {any} schema - Event schema
 * @param {Function} [upConverter] - Upconversion function
 * @returns {EventVersion} Event version
 *
 * @example
 * ```typescript
 * const v2 = createEventVersion(2, patientSchemaV2, (v1Event) => ({
 *   ...v1Event,
 *   newField: 'default'
 * }));
 * ```
 */
const createEventVersion = (version, schema, upConverter) => {
    return {
        version,
        schema,
        upConverter,
    };
};
exports.createEventVersion = createEventVersion;
/**
 * 36. Upgrades event to latest version.
 *
 * @param {DomainEvent} event - Event to upgrade
 * @param {EventVersion[]} versions - Version chain
 * @returns {DomainEvent} Upgraded event
 *
 * @example
 * ```typescript
 * const upgraded = upgradeEvent(v1Event, [v1Schema, v2Schema, v3Schema]);
 * // Result: Event upgraded from v1 to v3
 * ```
 */
const upgradeEvent = (event, versions) => {
    let currentEvent = event;
    const targetVersion = versions[versions.length - 1].version;
    while (currentEvent.version < targetVersion) {
        const nextVersion = versions.find(v => v.version === currentEvent.version + 1);
        if (nextVersion && nextVersion.upConverter) {
            currentEvent = {
                ...currentEvent,
                payload: nextVersion.upConverter(currentEvent.payload),
                version: nextVersion.version,
            };
        }
        else {
            break;
        }
    }
    return currentEvent;
};
exports.upgradeEvent = upgradeEvent;
/**
 * 37. Filters events by criteria.
 *
 * @param {DomainEvent[]} events - Events to filter
 * @param {EventFilter} filter - Filter criteria
 * @returns {DomainEvent[]} Filtered events
 *
 * @example
 * ```typescript
 * const filtered = filterEvents(events, {
 *   eventTypes: ['PatientAdmitted'],
 *   startTime: new Date('2024-01-01'),
 *   aggregateIds: ['patient-123']
 * });
 * ```
 */
const filterEvents = (events, filter) => {
    return events.filter(event => {
        if (filter.eventTypes && !filter.eventTypes.includes(event.eventType)) {
            return false;
        }
        if (filter.aggregateTypes && !filter.aggregateTypes.includes(event.aggregateType)) {
            return false;
        }
        if (filter.aggregateIds && !filter.aggregateIds.includes(event.aggregateId)) {
            return false;
        }
        if (filter.startTime && event.timestamp < filter.startTime) {
            return false;
        }
        if (filter.endTime && event.timestamp > filter.endTime) {
            return false;
        }
        if (filter.userId && event.userId !== filter.userId) {
            return false;
        }
        return true;
    });
};
exports.filterEvents = filterEvents;
/**
 * 38. Creates event version migration plan.
 *
 * @param {number} fromVersion - Source version
 * @param {number} toVersion - Target version
 * @param {EventVersion[]} versions - Available versions
 * @returns {EventVersion[]} Migration path
 *
 * @example
 * ```typescript
 * const path = createMigrationPath(1, 3, allVersions);
 * // Result: [v1, v2, v3] - versions needed for migration
 * ```
 */
const createMigrationPath = (fromVersion, toVersion, versions) => {
    return versions
        .filter(v => v.version > fromVersion && v.version <= toVersion)
        .sort((a, b) => a.version - b.version);
};
exports.createMigrationPath = createMigrationPath;
// ============================================================================
// SECTION 7: DEAD LETTER QUEUE & AUDITING (Functions 39-45)
// ============================================================================
/**
 * 39. Creates dead letter queue configuration.
 *
 * @param {string} queueName - DLQ name
 * @param {number} [maxSize=1000] - Maximum queue size
 * @param {number} [retentionPeriod=604800000] - Retention in ms (7 days)
 * @returns {DeadLetterQueue} DLQ configuration
 *
 * @example
 * ```typescript
 * const dlq = createDeadLetterQueue('failed-events', 1000, 604800000);
 * // Result: DLQ with 1000 message capacity and 7-day retention
 * ```
 */
const createDeadLetterQueue = (queueName, maxSize = 1000, retentionPeriod = 7 * 24 * 60 * 60 * 1000) => {
    return {
        queueName,
        messages: [],
        maxSize,
        retentionPeriod,
    };
};
exports.createDeadLetterQueue = createDeadLetterQueue;
/**
 * 40. Adds failed message to dead letter queue.
 *
 * @param {DeadLetterQueue} dlq - Dead letter queue
 * @param {DomainEvent} event - Failed event
 * @param {Error} error - Error that caused failure
 * @param {number} retryCount - Number of retries attempted
 * @returns {DeadLetterQueue} Updated DLQ
 *
 * @example
 * ```typescript
 * const updated = addToDeadLetterQueue(dlq, failedEvent, error, 3);
 * // Result: DLQ with failed message added
 * ```
 */
const addToDeadLetterQueue = (dlq, event, error, retryCount) => {
    const message = {
        messageId: generateMessageId(),
        originalEvent: event,
        error: error.message,
        failedAt: new Date(),
        retryCount,
        metadata: {
            eventType: event.eventType,
            aggregateId: event.aggregateId,
        },
    };
    const messages = [...dlq.messages, message];
    // Trim to max size if exceeded
    if (messages.length > dlq.maxSize) {
        messages.shift();
    }
    return {
        ...dlq,
        messages,
    };
};
exports.addToDeadLetterQueue = addToDeadLetterQueue;
/**
 * 41. Retries messages from dead letter queue.
 *
 * @param {DeadLetterQueue} dlq - Dead letter queue
 * @param {Function} retryFn - Retry function
 * @param {number} [maxMessages=10] - Max messages to retry
 * @returns {Promise<DeadLetterQueue>} Updated DLQ
 *
 * @example
 * ```typescript
 * const updated = await retryDeadLetterMessages(dlq, async (event) => {
 *   await processEvent(event);
 * }, 10);
 * ```
 */
const retryDeadLetterMessages = async (dlq, retryFn, maxMessages = 10) => {
    const toRetry = dlq.messages.slice(0, maxMessages);
    const remaining = dlq.messages.slice(maxMessages);
    const failed = [];
    for (const message of toRetry) {
        try {
            await retryFn(message.originalEvent);
        }
        catch (error) {
            failed.push({
                ...message,
                retryCount: message.retryCount + 1,
                failedAt: new Date(),
            });
        }
    }
    return {
        ...dlq,
        messages: [...remaining, ...failed],
    };
};
exports.retryDeadLetterMessages = retryDeadLetterMessages;
/**
 * 42. Purges old messages from dead letter queue.
 *
 * @param {DeadLetterQueue} dlq - Dead letter queue
 * @returns {DeadLetterQueue} Purged DLQ
 *
 * @example
 * ```typescript
 * const purged = purgeDeadLetterQueue(dlq);
 * // Result: DLQ with expired messages removed
 * ```
 */
const purgeDeadLetterQueue = (dlq) => {
    const cutoffTime = new Date(Date.now() - dlq.retentionPeriod);
    const messages = dlq.messages.filter(msg => msg.failedAt > cutoffTime);
    return {
        ...dlq,
        messages,
    };
};
exports.purgeDeadLetterQueue = purgeDeadLetterQueue;
/**
 * 43. Creates event audit entry.
 *
 * @param {DomainEvent} event - Event being audited
 * @param {string} action - Audit action
 * @param {string} actor - Actor performing action
 * @param {Record<string, any>} [details] - Additional details
 * @returns {EventAudit} Audit entry
 *
 * @example
 * ```typescript
 * const audit = createEventAudit(event, 'processed', 'system', { processingTime: 123 });
 * // Result: { auditId: '...', eventId: '...', action: 'processed', actor: 'system', ... }
 * ```
 */
const createEventAudit = (event, action, actor, details) => {
    return {
        auditId: generateAuditId(),
        eventId: event.eventId,
        action,
        actor,
        timestamp: new Date(),
        details: {
            eventType: event.eventType,
            aggregateId: event.aggregateId,
            ...details,
        },
    };
};
exports.createEventAudit = createEventAudit;
/**
 * 44. Filters audit logs by criteria.
 *
 * @param {EventAudit[]} audits - Audit entries
 * @param {Record<string, any>} criteria - Filter criteria
 * @returns {EventAudit[]} Filtered audits
 *
 * @example
 * ```typescript
 * const filtered = filterAuditLogs(audits, { action: 'failed', actor: 'system' });
 * // Result: Failed events processed by system
 * ```
 */
const filterAuditLogs = (audits, criteria) => {
    return audits.filter(audit => Object.entries(criteria).every(([key, value]) => audit[key] === value));
};
exports.filterAuditLogs = filterAuditLogs;
/**
 * 45. Generates audit trail for event lifecycle.
 *
 * @param {DomainEvent} event - Event to audit
 * @param {EventAudit[]} audits - Existing audit entries
 * @returns {object} Complete audit trail
 *
 * @example
 * ```typescript
 * const trail = generateAuditTrail(event, allAudits);
 * // Result: { created: Date, processed: Date, failed: null, replayed: null }
 * ```
 */
const generateAuditTrail = (event, audits) => {
    const eventAudits = audits.filter(a => a.eventId === event.eventId);
    return {
        eventId: event.eventId,
        eventType: event.eventType,
        created: eventAudits.find(a => a.action === 'created')?.timestamp || null,
        processed: eventAudits.find(a => a.action === 'processed')?.timestamp || null,
        failed: eventAudits.find(a => a.action === 'failed')?.timestamp || null,
        replayed: eventAudits.find(a => a.action === 'replayed')?.timestamp || null,
        totalActions: eventAudits.length,
    };
};
exports.generateAuditTrail = generateAuditTrail;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generates unique event ID using crypto for guaranteed uniqueness.
 */
const generateEventId = () => {
    return `evt-${Date.now()}-${crypto.randomUUID()}`;
};
/**
 * Generates correlation ID using crypto for guaranteed uniqueness.
 */
const generateCorrelationId = () => {
    return `corr-${Date.now()}-${crypto.randomUUID()}`;
};
/**
 * Generates message ID.
 */
const generateMessageId = () => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Generates subscription ID.
 */
const generateSubscriptionId = () => {
    return `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Generates stream ID.
 */
const generateStreamId = () => {
    return `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Generates snapshot ID.
 */
const generateSnapshotId = () => {
    return `snap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Generates command ID.
 */
const generateCommandId = () => {
    return `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Generates query ID.
 */
const generateQueryId = () => {
    return `qry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Generates projection ID.
 */
const generateProjectionId = () => {
    return `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Generates saga ID.
 */
const generateSagaId = () => {
    return `saga-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Generates step ID.
 */
const generateStepId = () => {
    return `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
/**
 * Generates audit ID.
 */
const generateAuditId = () => {
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
//# sourceMappingURL=event-driven-kit.js.map