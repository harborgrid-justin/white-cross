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
interface DomainEvent {
    eventId: string;
    eventType: string;
    aggregateId: string;
    aggregateType: string;
    payload: any;
    version: number;
    timestamp: Date;
    userId?: string;
    metadata: Record<string, any>;
    causationId?: string;
    correlationId?: string;
}
interface EventStoreEntry {
    streamId: string;
    streamName: string;
    eventNumber: number;
    event: DomainEvent;
    timestamp: Date;
    metadata: Record<string, any>;
}
interface EventStream {
    streamId: string;
    streamName: string;
    aggregateId: string;
    aggregateType: string;
    version: number;
    events: DomainEvent[];
    createdAt: Date;
    updatedAt: Date;
}
interface EventSnapshot {
    snapshotId: string;
    aggregateId: string;
    aggregateType: string;
    version: number;
    state: any;
    timestamp: Date;
    metadata: Record<string, any>;
}
interface EventProjection {
    projectionId: string;
    projectionName: string;
    lastEventNumber: number;
    state: any;
    timestamp: Date;
    version: number;
}
interface EventBusMessage {
    messageId: string;
    topic: string;
    event: DomainEvent;
    timestamp: Date;
    retryCount: number;
    maxRetries: number;
}
interface EventSubscription {
    subscriptionId: string;
    subscriberName: string;
    eventTypes: string[];
    handler: (event: DomainEvent) => Promise<void>;
    filter?: (event: DomainEvent) => boolean;
    priority?: number;
    active: boolean;
}
interface EventFilter {
    eventTypes?: string[];
    aggregateTypes?: string[];
    aggregateIds?: string[];
    startTime?: Date;
    endTime?: Date;
    userId?: string;
    metadata?: Record<string, any>;
}
interface DeadLetterQueue {
    queueName: string;
    messages: DeadLetterMessage[];
    maxSize: number;
    retentionPeriod: number;
}
interface DeadLetterMessage {
    messageId: string;
    originalEvent: DomainEvent;
    error: string;
    failedAt: Date;
    retryCount: number;
    metadata: Record<string, any>;
}
interface EventReplayConfig {
    startEventNumber: number;
    endEventNumber?: number;
    batchSize: number;
    delayBetweenBatches?: number;
    eventTypes?: string[];
}
interface EventVersion {
    version: number;
    schema: any;
    upConverter?: (event: any) => any;
    downConverter?: (event: any) => any;
}
interface SagaDefinition {
    sagaId: string;
    sagaType: string;
    steps: SagaStep[];
    status: 'pending' | 'running' | 'completed' | 'failed' | 'compensating';
    currentStep: number;
    data: any;
    compensationRequired: boolean;
}
interface SagaStep {
    stepId: string;
    stepName: string;
    command: any;
    onSuccess?: (result: any) => Promise<void>;
    onFailure?: (error: Error) => Promise<void>;
    compensate?: () => Promise<void>;
    timeout?: number;
}
interface EventAudit {
    auditId: string;
    eventId: string;
    action: 'created' | 'processed' | 'replayed' | 'failed';
    actor: string;
    timestamp: Date;
    details: Record<string, any>;
}
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
export declare const createDomainEvent: (eventType: string, aggregateId: string, aggregateType: string, payload: any, version?: number, userId?: string) => DomainEvent;
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
export declare const emitEventSafely: (emitter: any, event: string, data: any) => Promise<boolean>;
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
export declare const createBatchedEmitter: (emitter: any, batchSize: number, flushInterval: number) => object;
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
export declare const createPriorityEmitter: (emitter: any) => object;
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
export declare const wrapEventListener: (handler: (event: any) => Promise<void>, onError?: (error: Error) => void) => Function;
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
export declare const createMiddlewareEmitter: (emitter: any, middleware: Function[]) => object;
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
export declare const createEventBusMessage: (topic: string, event: DomainEvent, maxRetries?: number) => EventBusMessage;
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
export declare const publishToEventBus: (eventBus: any, topic: string, event: DomainEvent, partitionKey?: string) => Promise<void>;
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
export declare const createEventSubscription: (subscriberName: string, eventTypes: string[], handler: (event: DomainEvent) => Promise<void>, filter?: (event: DomainEvent) => boolean) => EventSubscription;
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
export declare const routeEventToSubscribers: (event: DomainEvent, subscriptions: EventSubscription[]) => Promise<void>;
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
export declare const createEventTopic: (topicName: string, partitions: number, replicationFactor: number) => object;
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
export declare const createConsumerGroup: (groupId: string, topics: string[], maxConcurrency?: number) => object;
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
export declare const createEventStoreEntry: (streamName: string, event: DomainEvent, eventNumber: number) => EventStoreEntry;
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
export declare const appendEventToStream: (stream: EventStream, event: DomainEvent) => EventStream;
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
export declare const rebuildAggregateFromEvents: (events: DomainEvent[], initialState: any, eventHandlers: Record<string, Function>) => any;
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
export declare const createEventStream: (aggregateId: string, aggregateType: string, events?: DomainEvent[]) => EventStream;
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
export declare const createSnapshot: (aggregateId: string, aggregateType: string, version: number, state: any) => EventSnapshot;
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
export declare const shouldCreateSnapshot: (stream: EventStream, snapshotInterval: number, lastSnapshotVersion: number) => boolean;
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
export declare const loadFromSnapshot: (snapshot: EventSnapshot, recentEvents: DomainEvent[], handlers: Record<string, Function>) => any;
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
export declare const validateEventStream: (stream: EventStream) => boolean;
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
export declare const createCommand: (commandType: string, aggregateId: string, payload: any, userId?: string) => object;
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
export declare const createQuery: (queryType: string, parameters: Record<string, any>, userId?: string) => object;
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
export declare const createProjection: (projectionName: string, eventTypes: string[], initialState: any) => EventProjection;
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
export declare const updateProjection: (projection: EventProjection, event: DomainEvent, updateFn: (state: any, event: DomainEvent) => any) => EventProjection;
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
export declare const validateCommand: (command: any, validators: Function[]) => object;
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
export declare const createMaterializedView: (projection: EventProjection, transform: (state: any) => any) => any;
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
export declare const createSaga: (sagaType: string, steps: SagaStep[], initialData: any) => SagaDefinition;
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
export declare const createSagaStep: (stepName: string, command: any, compensate?: () => Promise<void>) => SagaStep;
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
export declare const executeNextSagaStep: (saga: SagaDefinition, executor: (step: SagaStep) => Promise<any>) => Promise<SagaDefinition>;
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
export declare const compensateSaga: (saga: SagaDefinition) => Promise<SagaDefinition>;
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
export declare const getSagaProgress: (saga: SagaDefinition) => object;
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
export declare const createSagaEvent: (saga: SagaDefinition, eventType: string, payload?: any) => DomainEvent;
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
export declare const createReplayConfig: (startEventNumber: number, endEventNumber?: number, batchSize?: number) => EventReplayConfig;
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
export declare const replayEvents: (events: DomainEvent[], projection: EventProjection, updateFn: (state: any, event: DomainEvent) => any) => Promise<EventProjection>;
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
export declare const createEventVersion: (version: number, schema: any, upConverter?: (event: any) => any) => EventVersion;
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
export declare const upgradeEvent: (event: DomainEvent, versions: EventVersion[]) => DomainEvent;
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
export declare const filterEvents: (events: DomainEvent[], filter: EventFilter) => DomainEvent[];
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
export declare const createMigrationPath: (fromVersion: number, toVersion: number, versions: EventVersion[]) => EventVersion[];
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
export declare const createDeadLetterQueue: (queueName: string, maxSize?: number, retentionPeriod?: number) => DeadLetterQueue;
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
export declare const addToDeadLetterQueue: (dlq: DeadLetterQueue, event: DomainEvent, error: Error, retryCount: number) => DeadLetterQueue;
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
export declare const retryDeadLetterMessages: (dlq: DeadLetterQueue, retryFn: (event: DomainEvent) => Promise<void>, maxMessages?: number) => Promise<DeadLetterQueue>;
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
export declare const purgeDeadLetterQueue: (dlq: DeadLetterQueue) => DeadLetterQueue;
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
export declare const createEventAudit: (event: DomainEvent, action: "created" | "processed" | "replayed" | "failed", actor: string, details?: Record<string, any>) => EventAudit;
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
export declare const filterAuditLogs: (audits: EventAudit[], criteria: Record<string, any>) => EventAudit[];
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
export declare const generateAuditTrail: (event: DomainEvent, audits: EventAudit[]) => object;
export {};
//# sourceMappingURL=event-driven-kit.d.ts.map