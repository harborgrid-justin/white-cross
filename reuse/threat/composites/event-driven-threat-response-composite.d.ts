/**
 * LOC: EVNT-THREAT-RESP-COMP-001
 * File: /reuse/threat/composites/event-driven-threat-response-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../response-automation-kit.ts
 *   - ../automated-threat-response-kit.ts
 *   - ../incident-response-kit.ts
 *   - ../incident-containment-kit.ts
 *   - ../threat-detection-engine-kit.ts
 *   - @nestjs/microservices
 *   - @nestjs/common
 *   - @nestjs/cqrs
 *
 * DOWNSTREAM (imported by):
 *   - Event-driven threat response controllers
 *   - Message queue consumers
 *   - Event sourcing repositories
 *   - CQRS command/query handlers
 *   - Saga orchestration services
 */
/**
 * Event sourcing event structure
 */
export interface ThreatResponseEvent {
    eventId: string;
    eventType: string;
    aggregateId: string;
    aggregateType: 'incident' | 'threat' | 'response' | 'remediation';
    version: number;
    timestamp: Date;
    userId?: string;
    data: any;
    metadata: {
        correlationId: string;
        causationId: string;
        serviceName: string;
        traceId?: string;
    };
}
/**
 * Event stream subscription
 */
export interface EventStreamSubscription {
    subscriptionId: string;
    streamName: string;
    consumerGroup?: string;
    startPosition: 'beginning' | 'end' | 'timestamp' | number;
    filters?: EventFilter[];
    handler: (event: ThreatResponseEvent) => Promise<void>;
    errorHandler?: (error: Error, event: ThreatResponseEvent) => Promise<void>;
}
/**
 * Event filter criteria
 */
export interface EventFilter {
    field: string;
    operator: 'equals' | 'contains' | 'in' | 'greater_than' | 'less_than';
    value: any;
}
/**
 * CQRS Command structure
 */
export interface ThreatResponseCommand {
    commandId: string;
    commandType: string;
    aggregateId: string;
    payload: any;
    metadata: {
        userId: string;
        timestamp: Date;
        correlationId: string;
    };
}
/**
 * CQRS Query structure
 */
export interface ThreatResponseQuery {
    queryId: string;
    queryType: string;
    parameters: Record<string, any>;
    metadata: {
        userId: string;
        timestamp: Date;
    };
}
/**
 * Saga orchestration state
 */
export interface SagaState {
    sagaId: string;
    sagaType: string;
    status: 'started' | 'in_progress' | 'completed' | 'compensating' | 'failed';
    currentStep: number;
    steps: SagaStep[];
    compensationSteps: SagaStep[];
    startTime: Date;
    endTime?: Date;
    data: any;
    error?: string;
}
/**
 * Saga step definition
 */
export interface SagaStep {
    stepId: string;
    stepType: string;
    action: () => Promise<any>;
    compensation?: () => Promise<any>;
    status: 'pending' | 'executing' | 'completed' | 'failed' | 'compensated';
    retryPolicy?: {
        maxRetries: number;
        retryDelay: number;
        backoffMultiplier: number;
    };
    result?: any;
    error?: string;
}
/**
 * Message queue configuration
 */
export interface MessageQueueConfig {
    queueName: string;
    exchange?: string;
    routingKey?: string;
    durable: boolean;
    deadLetterExchange?: string;
    messageTTL?: number;
    maxPriority?: number;
    prefetchCount?: number;
}
/**
 * Event replay configuration
 */
export interface EventReplayConfig {
    streamName: string;
    fromPosition: number | Date;
    toPosition?: number | Date;
    batchSize: number;
    aggregateId?: string;
    eventTypes?: string[];
}
/**
 * Compensating transaction
 */
export interface CompensatingTransaction {
    transactionId: string;
    originalEventId: string;
    compensationAction: string;
    status: 'pending' | 'executing' | 'completed' | 'failed';
    executedAt?: Date;
    result?: any;
    error?: string;
}
/**
 * Appends threat response event to event store.
 * Implements event sourcing pattern with versioning and optimistic concurrency.
 *
 * @param {ThreatResponseEvent} event - Event to append
 * @returns {Promise<{appended: boolean; eventId: string; version: number}>}
 *
 * @example
 * ```typescript
 * const result = await appendThreatResponseEvent({
 *   eventType: 'IncidentDetected',
 *   aggregateId: 'incident-123',
 *   aggregateType: 'incident',
 *   version: 1,
 *   data: { severity: 'critical', description: 'Ransomware detected' }
 * });
 * ```
 */
export declare const appendThreatResponseEvent: (event: ThreatResponseEvent) => Promise<{
    appended: boolean;
    eventId: string;
    version: number;
}>;
/**
 * Reads event stream for an aggregate.
 * Reconstructs aggregate state from event history.
 *
 * @param {string} aggregateId - Aggregate identifier
 * @param {string} aggregateType - Type of aggregate
 * @returns {Promise<{events: ThreatResponseEvent[]; currentVersion: number}>}
 *
 * @example
 * ```typescript
 * const stream = await readEventStream('incident-123', 'incident');
 * const currentState = stream.events.reduce(applyEvent, initialState);
 * ```
 */
export declare const readEventStream: (aggregateId: string, aggregateType: string) => Promise<{
    events: ThreatResponseEvent[];
    currentVersion: number;
}>;
/**
 * Replays events to rebuild aggregate state.
 * Implements event replay for recovery and debugging.
 *
 * @param {EventReplayConfig} config - Replay configuration
 * @returns {Promise<{replayed: number; finalState: any; errors: any[]}>}
 *
 * @example
 * ```typescript
 * const replay = await replayThreatResponseEvents({
 *   streamName: 'incident-stream',
 *   fromPosition: new Date('2024-01-01'),
 *   batchSize: 100,
 *   eventTypes: ['IncidentDetected', 'ResponseExecuted']
 * });
 * ```
 */
export declare const replayThreatResponseEvents: (config: EventReplayConfig) => Promise<{
    replayed: number;
    finalState: any;
    errors: any[];
}>;
/**
 * Creates event snapshot for performance optimization.
 * Implements snapshot pattern to avoid replaying all events.
 *
 * @param {string} aggregateId - Aggregate identifier
 * @param {any} state - Current aggregate state
 * @param {number} version - Current version
 * @returns {Promise<{snapshotId: string; version: number; timestamp: Date}>}
 *
 * @example
 * ```typescript
 * const snapshot = await createEventSnapshot(
 *   'incident-123',
 *   currentIncidentState,
 *   150
 * );
 * // Next reads start from snapshot instead of event 1
 * ```
 */
export declare const createEventSnapshot: (aggregateId: string, state: any, version: number) => Promise<{
    snapshotId: string;
    version: number;
    timestamp: Date;
}>;
/**
 * Publishes domain event to event bus.
 * Implements publish-subscribe pattern for event distribution.
 *
 * @param {ThreatResponseEvent} event - Domain event
 * @param {string[]} subscribers - Subscriber service names
 * @returns {Promise<{published: boolean; subscriberCount: number}>}
 *
 * @example
 * ```typescript
 * await publishDomainEvent(
 *   { eventType: 'ThreatContained', ... },
 *   ['notification-service', 'audit-service', 'reporting-service']
 * );
 * ```
 */
export declare const publishDomainEvent: (event: ThreatResponseEvent, subscribers: string[]) => Promise<{
    published: boolean;
    subscriberCount: number;
}>;
/**
 * Executes CQRS command for threat response.
 * Implements command handler with validation and event sourcing.
 *
 * @param {ThreatResponseCommand} command - Command to execute
 * @returns {Promise<{executed: boolean; events: ThreatResponseEvent[]; result: any}>}
 *
 * @example
 * ```typescript
 * const result = await executeThreatResponseCommand({
 *   commandType: 'IsolateEndpoint',
 *   aggregateId: 'endpoint-456',
 *   payload: { endpointId: '456', reason: 'malware detected' },
 *   metadata: { userId: 'admin', correlationId: 'corr-123' }
 * });
 * ```
 */
export declare const executeThreatResponseCommand: (command: ThreatResponseCommand) => Promise<{
    executed: boolean;
    events: ThreatResponseEvent[];
    result: any;
}>;
/**
 * Processes CQRS query for threat response data.
 * Implements query handler with read model optimization.
 *
 * @param {ThreatResponseQuery} query - Query to process
 * @returns {Promise<{data: any; metadata: any}>}
 *
 * @example
 * ```typescript
 * const result = await processThreatResponseQuery({
 *   queryType: 'GetIncidentHistory',
 *   parameters: { incidentId: 'incident-123', includeEvents: true },
 *   metadata: { userId: 'analyst' }
 * });
 * ```
 */
export declare const processThreatResponseQuery: (query: ThreatResponseQuery) => Promise<{
    data: any;
    metadata: any;
}>;
/**
 * Builds read model from event stream.
 * Implements projection for optimized query performance.
 *
 * @param {string} readModelName - Name of read model
 * @param {ThreatResponseEvent[]} events - Events to project
 * @returns {Promise<{readModel: any; eventCount: number; lastUpdate: Date}>}
 *
 * @example
 * ```typescript
 * const readModel = await buildReadModelFromEvents(
 *   'incident-summary',
 *   incidentEvents
 * );
 * // Optimized for dashboard queries
 * ```
 */
export declare const buildReadModelFromEvents: (readModelName: string, events: ThreatResponseEvent[]) => Promise<{
    readModel: any;
    eventCount: number;
    lastUpdate: Date;
}>;
/**
 * Synchronizes read model with event store.
 * Implements eventual consistency for CQRS read models.
 *
 * @param {string} readModelName - Read model to sync
 * @param {number} lastProcessedVersion - Last processed event version
 * @returns {Promise<{synced: boolean; newVersion: number; eventsProcessed: number}>}
 *
 * @example
 * ```typescript
 * const sync = await syncReadModel('threat-dashboard', 1500);
 * // Processes events 1501+ to update dashboard
 * ```
 */
export declare const syncReadModel: (readModelName: string, lastProcessedVersion: number) => Promise<{
    synced: boolean;
    newVersion: number;
    eventsProcessed: number;
}>;
/**
 * Initiates saga for complex threat response workflow.
 * Implements saga pattern with compensation for distributed transactions.
 *
 * @param {string} sagaType - Type of saga
 * @param {any} initialData - Initial saga data
 * @returns {Promise<SagaState>}
 *
 * @example
 * ```typescript
 * const saga = await initiateThreatResponseSaga(
 *   'ransomware-containment',
 *   { incidentId: 'inc-789', affectedHosts: [...] }
 * );
 * ```
 */
export declare const initiateThreatResponseSaga: (sagaType: string, initialData: any) => Promise<SagaState>;
/**
 * Executes saga step with retry and compensation.
 * Handles step execution, retries, and error compensation.
 *
 * @param {SagaState} saga - Saga state
 * @param {SagaStep} step - Step to execute
 * @returns {Promise<{success: boolean; result?: any; error?: string}>}
 *
 * @example
 * ```typescript
 * const result = await executeSagaStep(saga, saga.steps[0]);
 * if (!result.success) {
 *   await compensateSaga(saga);
 * }
 * ```
 */
export declare const executeSagaStep: (saga: SagaState, step: SagaStep) => Promise<{
    success: boolean;
    result?: any;
    error?: string;
}>;
/**
 * Compensates failed saga by executing compensation steps.
 * Implements compensating transactions for saga rollback.
 *
 * @param {SagaState} saga - Saga to compensate
 * @returns {Promise<{compensated: boolean; compensationResults: any[]}>}
 *
 * @example
 * ```typescript
 * const compensation = await compensateSaga(failedSaga);
 * // Rolls back all completed steps in reverse order
 * ```
 */
export declare const compensateSaga: (saga: SagaState) => Promise<{
    compensated: boolean;
    compensationResults: any[];
}>;
/**
 * Orchestrates complete saga execution.
 * Manages saga lifecycle from start to completion or compensation.
 *
 * @param {SagaState} saga - Saga to orchestrate
 * @returns {Promise<{completed: boolean; results: any[]; compensated: boolean}>}
 *
 * @example
 * ```typescript
 * const saga = await initiateThreatResponseSaga('incident-response', data);
 * const outcome = await orchestrateSaga(saga);
 * ```
 */
export declare const orchestrateSaga: (saga: SagaState) => Promise<{
    completed: boolean;
    results: any[];
    compensated: boolean;
}>;
/**
 * Configures message queue for threat response events.
 * Sets up durable queues with dead letter exchange.
 *
 * @param {MessageQueueConfig} config - Queue configuration
 * @returns {Promise<{configured: boolean; queueName: string; durable: boolean}>}
 *
 * @example
 * ```typescript
 * const queue = await configureThreatResponseQueue({
 *   queueName: 'critical-threats',
 *   exchange: 'threat-exchange',
 *   routingKey: 'threat.critical',
 *   durable: true,
 *   deadLetterExchange: 'dlx-threats',
 *   messageTTL: 3600000
 * });
 * ```
 */
export declare const configureThreatResponseQueue: (config: MessageQueueConfig) => Promise<{
    configured: boolean;
    queueName: string;
    durable: boolean;
}>;
/**
 * Publishes threat response message to queue.
 * Implements reliable message publishing with confirmation.
 *
 * @param {string} queueName - Queue name
 * @param {any} message - Message payload
 * @param {object} options - Publishing options
 * @returns {Promise<{published: boolean; messageId: string; timestamp: Date}>}
 *
 * @example
 * ```typescript
 * await publishToThreatResponseQueue(
 *   'incident-responses',
 *   { incidentId: 'inc-123', action: 'isolate' },
 *   { priority: 10, persistent: true }
 * );
 * ```
 */
export declare const publishToThreatResponseQueue: (queueName: string, message: any, options?: {
    priority?: number;
    persistent?: boolean;
    expiration?: number;
}) => Promise<{
    published: boolean;
    messageId: string;
    timestamp: Date;
}>;
/**
 * Consumes messages from threat response queue.
 * Implements consumer with acknowledgment and error handling.
 *
 * @param {string} queueName - Queue name
 * @param {(message: any) => Promise<void>} handler - Message handler
 * @param {object} options - Consumer options
 * @returns {Promise<{consuming: boolean; consumerId: string}>}
 *
 * @example
 * ```typescript
 * await consumeThreatResponseQueue(
 *   'incident-responses',
 *   async (message) => {
 *     await executeResponseWorkflow(message.workflowId, message.context);
 *   },
 *   { prefetchCount: 10, autoAck: false }
 * );
 * ```
 */
export declare const consumeThreatResponseQueue: (queueName: string, handler: (message: any) => Promise<void>, options?: {
    prefetchCount?: number;
    autoAck?: boolean;
}) => Promise<{
    consuming: boolean;
    consumerId: string;
}>;
/**
 * Handles dead letter queue for failed messages.
 * Implements DLQ pattern for message retry and analysis.
 *
 * @param {string} dlqName - Dead letter queue name
 * @returns {Promise<{messages: any[]; retryable: number; failed: number}>}
 *
 * @example
 * ```typescript
 * const dlq = await handleDeadLetterQueue('dlx-threats');
 * // Analyze failed messages and retry if appropriate
 * ```
 */
export declare const handleDeadLetterQueue: (dlqName: string) => Promise<{
    messages: any[];
    retryable: number;
    failed: number;
}>;
/**
 * Implements priority queue for threat responses.
 * Routes high-priority threats to fast-track processing.
 *
 * @param {any} message - Message to route
 * @returns {Promise<{queue: string; priority: number; routingKey: string}>}
 *
 * @example
 * ```typescript
 * const routing = await routeToPriorityQueue({
 *   severity: 'critical',
 *   threatType: 'ransomware',
 *   data: {...}
 * });
 * // Routes to critical-threats queue with priority 10
 * ```
 */
export declare const routeToPriorityQueue: (message: any) => Promise<{
    queue: string;
    priority: number;
    routingKey: string;
}>;
/**
 * Subscribes to event stream for real-time threat response.
 * Implements stream consumer with backpressure handling.
 *
 * @param {EventStreamSubscription} subscription - Subscription configuration
 * @returns {Promise<{subscribed: boolean; subscriptionId: string; position: number}>}
 *
 * @example
 * ```typescript
 * await subscribeToThreatEventStream({
 *   streamName: 'threat-detections',
 *   consumerGroup: 'response-team',
 *   startPosition: 'end',
 *   handler: async (event) => {
 *     if (event.data.severity === 'critical') {
 *       await triggerAutomatedResponse(event);
 *     }
 *   }
 * });
 * ```
 */
export declare const subscribeToThreatEventStream: (subscription: EventStreamSubscription) => Promise<{
    subscribed: boolean;
    subscriptionId: string;
    position: number;
}>;
/**
 * Processes event stream in batches for efficiency.
 * Implements batch processing with windowing.
 *
 * @param {string} streamName - Stream name
 * @param {number} batchSize - Batch size
 * @param {(events: ThreatResponseEvent[]) => Promise<void>} processor - Batch processor
 * @returns {Promise<{processing: boolean; batchesProcessed: number}>}
 *
 * @example
 * ```typescript
 * await processThreatEventBatch(
 *   'threat-stream',
 *   100,
 *   async (events) => {
 *     const aggregated = await aggregateMicroserviceThreatScores(events);
 *     await publishDomainEvent(aggregated);
 *   }
 * );
 * ```
 */
export declare const processThreatEventBatch: (streamName: string, batchSize: number, processor: (events: ThreatResponseEvent[]) => Promise<void>) => Promise<{
    processing: boolean;
    batchesProcessed: number;
}>;
/**
 * Implements event filtering and transformation in stream.
 * Processes events through filter and transform pipeline.
 *
 * @param {ThreatResponseEvent[]} events - Input events
 * @param {EventFilter[]} filters - Filter criteria
 * @param {(event: ThreatResponseEvent) => ThreatResponseEvent} transformer - Transform function
 * @returns {Promise<{filtered: ThreatResponseEvent[]; originalCount: number}>}
 *
 * @example
 * ```typescript
 * const processed = await filterAndTransformEvents(
 *   streamEvents,
 *   [{ field: 'severity', operator: 'equals', value: 'critical' }],
 *   (event) => ({ ...event, enriched: true })
 * );
 * ```
 */
export declare const filterAndTransformEvents: (events: ThreatResponseEvent[], filters: EventFilter[], transformer: (event: ThreatResponseEvent) => ThreatResponseEvent) => Promise<{
    filtered: ThreatResponseEvent[];
    originalCount: number;
}>;
/**
 * Implements event windowing for temporal aggregation.
 * Groups events by time windows for analysis.
 *
 * @param {ThreatResponseEvent[]} events - Events to window
 * @param {number} windowSizeMs - Window size in milliseconds
 * @returns {Promise<{windows: Array<{start: Date; end: Date; events: ThreatResponseEvent[]}>}>}
 *
 * @example
 * ```typescript
 * const windows = await windowThreatEvents(events, 300000); // 5-minute windows
 * windows.forEach(window => {
 *   console.log(`Window: ${window.events.length} events`);
 * });
 * ```
 */
export declare const windowThreatEvents: (events: ThreatResponseEvent[], windowSizeMs: number) => Promise<{
    windows: Array<{
        start: Date;
        end: Date;
        events: ThreatResponseEvent[];
    }>;
}>;
/**
 * Orchestrates async threat response workflow.
 * Implements long-running async workflows with checkpoints.
 *
 * @param {string} workflowId - Workflow identifier
 * @param {any} workflowData - Workflow data
 * @returns {Promise<{started: boolean; workflowId: string; estimatedDuration: number}>}
 *
 * @example
 * ```typescript
 * const workflow = await orchestrateAsyncThreatResponse(
 *   'workflow-456',
 *   { incidentId: 'inc-789', steps: [...] }
 * );
 * ```
 */
export declare const orchestrateAsyncThreatResponse: (workflowId: string, workflowData: any) => Promise<{
    started: boolean;
    workflowId: string;
    estimatedDuration: number;
}>;
/**
 * Implements workflow checkpointing for fault tolerance.
 * Saves workflow state for resume after failure.
 *
 * @param {string} workflowId - Workflow identifier
 * @param {any} state - Current workflow state
 * @returns {Promise<{checkpointed: boolean; checkpointId: string; timestamp: Date}>}
 *
 * @example
 * ```typescript
 * const checkpoint = await checkpointWorkflow('workflow-456', {
 *   currentStep: 3,
 *   completedSteps: [1, 2],
 *   data: {...}
 * });
 * ```
 */
export declare const checkpointWorkflow: (workflowId: string, state: any) => Promise<{
    checkpointed: boolean;
    checkpointId: string;
    timestamp: Date;
}>;
/**
 * Resumes workflow from checkpoint after failure.
 * Implements workflow recovery and continuation.
 *
 * @param {string} checkpointId - Checkpoint identifier
 * @returns {Promise<{resumed: boolean; workflowId: string; resumedFromStep: number}>}
 *
 * @example
 * ```typescript
 * const resumed = await resumeWorkflowFromCheckpoint('checkpoint-123');
 * // Workflow continues from saved state
 * ```
 */
export declare const resumeWorkflowFromCheckpoint: (checkpointId: string) => Promise<{
    resumed: boolean;
    workflowId: string;
    resumedFromStep: number;
}>;
/**
 * Implements parallel async response execution.
 * Executes multiple responses concurrently with aggregation.
 *
 * @param {Array<{action: string; params: any}>} responses - Responses to execute
 * @returns {Promise<{results: any[]; successCount: number; failureCount: number}>}
 *
 * @example
 * ```typescript
 * const parallel = await executeParallelAsyncResponses([
 *   { action: 'block-ip', params: { ip: '1.2.3.4' } },
 *   { action: 'isolate-endpoint', params: { endpointId: 'ep-123' } },
 *   { action: 'disable-account', params: { userId: 'user-456' } }
 * ]);
 * ```
 */
export declare const executeParallelAsyncResponses: (responses: Array<{
    action: string;
    params: any;
}>) => Promise<{
    results: any[];
    successCount: number;
    failureCount: number;
}>;
/**
 * Migrates events to new schema version.
 * Implements event upcasting for schema evolution.
 *
 * @param {ThreatResponseEvent} event - Event to migrate
 * @param {number} targetVersion - Target schema version
 * @returns {Promise<{migrated: ThreatResponseEvent; originalVersion: number}>}
 *
 * @example
 * ```typescript
 * const migrated = await migrateEventSchema(oldEvent, 3);
 * // Event schema updated from v1 to v3
 * ```
 */
export declare const migrateEventSchema: (event: ThreatResponseEvent, targetVersion: number) => Promise<{
    migrated: ThreatResponseEvent;
    originalVersion: number;
}>;
/**
 * Validates event schema version compatibility.
 * Ensures events match expected schema version.
 *
 * @param {ThreatResponseEvent} event - Event to validate
 * @param {number} expectedVersion - Expected schema version
 * @returns {Promise<{valid: boolean; actualVersion: number; issues: string[]}>}
 *
 * @example
 * ```typescript
 * const validation = await validateEventVersion(event, 2);
 * if (!validation.valid) {
 *   await migrateEventSchema(event, expectedVersion);
 * }
 * ```
 */
export declare const validateEventVersion: (event: ThreatResponseEvent, expectedVersion: number) => Promise<{
    valid: boolean;
    actualVersion: number;
    issues: string[];
}>;
/**
 * Creates compensating transaction for failed response.
 * Implements compensation pattern for eventual consistency.
 *
 * @param {string} originalEventId - Original event identifier
 * @param {string} compensationAction - Compensation action to execute
 * @returns {Promise<CompensatingTransaction>}
 *
 * @example
 * ```typescript
 * const compensation = await createCompensatingTransaction(
 *   'event-123',
 *   'restore-endpoint-access'
 * );
 * ```
 */
export declare const createCompensatingTransaction: (originalEventId: string, compensationAction: string) => Promise<CompensatingTransaction>;
/**
 * Executes compensating transaction.
 * Rolls back effects of failed distributed transaction.
 *
 * @param {CompensatingTransaction} transaction - Transaction to execute
 * @returns {Promise<{executed: boolean; result: any; error?: string}>}
 *
 * @example
 * ```typescript
 * const result = await executeCompensatingTransaction(compensation);
 * // Reverses original action (e.g., unblocks IP)
 * ```
 */
export declare const executeCompensatingTransaction: (transaction: CompensatingTransaction) => Promise<{
    executed: boolean;
    result: any;
    error?: string;
}>;
declare const _default: {
    appendThreatResponseEvent: (event: ThreatResponseEvent) => Promise<{
        appended: boolean;
        eventId: string;
        version: number;
    }>;
    readEventStream: (aggregateId: string, aggregateType: string) => Promise<{
        events: ThreatResponseEvent[];
        currentVersion: number;
    }>;
    replayThreatResponseEvents: (config: EventReplayConfig) => Promise<{
        replayed: number;
        finalState: any;
        errors: any[];
    }>;
    createEventSnapshot: (aggregateId: string, state: any, version: number) => Promise<{
        snapshotId: string;
        version: number;
        timestamp: Date;
    }>;
    publishDomainEvent: (event: ThreatResponseEvent, subscribers: string[]) => Promise<{
        published: boolean;
        subscriberCount: number;
    }>;
    executeThreatResponseCommand: (command: ThreatResponseCommand) => Promise<{
        executed: boolean;
        events: ThreatResponseEvent[];
        result: any;
    }>;
    processThreatResponseQuery: (query: ThreatResponseQuery) => Promise<{
        data: any;
        metadata: any;
    }>;
    buildReadModelFromEvents: (readModelName: string, events: ThreatResponseEvent[]) => Promise<{
        readModel: any;
        eventCount: number;
        lastUpdate: Date;
    }>;
    syncReadModel: (readModelName: string, lastProcessedVersion: number) => Promise<{
        synced: boolean;
        newVersion: number;
        eventsProcessed: number;
    }>;
    initiateThreatResponseSaga: (sagaType: string, initialData: any) => Promise<SagaState>;
    executeSagaStep: (saga: SagaState, step: SagaStep) => Promise<{
        success: boolean;
        result?: any;
        error?: string;
    }>;
    compensateSaga: (saga: SagaState) => Promise<{
        compensated: boolean;
        compensationResults: any[];
    }>;
    orchestrateSaga: (saga: SagaState) => Promise<{
        completed: boolean;
        results: any[];
        compensated: boolean;
    }>;
    configureThreatResponseQueue: (config: MessageQueueConfig) => Promise<{
        configured: boolean;
        queueName: string;
        durable: boolean;
    }>;
    publishToThreatResponseQueue: (queueName: string, message: any, options?: {
        priority?: number;
        persistent?: boolean;
        expiration?: number;
    }) => Promise<{
        published: boolean;
        messageId: string;
        timestamp: Date;
    }>;
    consumeThreatResponseQueue: (queueName: string, handler: (message: any) => Promise<void>, options?: {
        prefetchCount?: number;
        autoAck?: boolean;
    }) => Promise<{
        consuming: boolean;
        consumerId: string;
    }>;
    handleDeadLetterQueue: (dlqName: string) => Promise<{
        messages: any[];
        retryable: number;
        failed: number;
    }>;
    routeToPriorityQueue: (message: any) => Promise<{
        queue: string;
        priority: number;
        routingKey: string;
    }>;
    subscribeToThreatEventStream: (subscription: EventStreamSubscription) => Promise<{
        subscribed: boolean;
        subscriptionId: string;
        position: number;
    }>;
    processThreatEventBatch: (streamName: string, batchSize: number, processor: (events: ThreatResponseEvent[]) => Promise<void>) => Promise<{
        processing: boolean;
        batchesProcessed: number;
    }>;
    filterAndTransformEvents: (events: ThreatResponseEvent[], filters: EventFilter[], transformer: (event: ThreatResponseEvent) => ThreatResponseEvent) => Promise<{
        filtered: ThreatResponseEvent[];
        originalCount: number;
    }>;
    windowThreatEvents: (events: ThreatResponseEvent[], windowSizeMs: number) => Promise<{
        windows: Array<{
            start: Date;
            end: Date;
            events: ThreatResponseEvent[];
        }>;
    }>;
    orchestrateAsyncThreatResponse: (workflowId: string, workflowData: any) => Promise<{
        started: boolean;
        workflowId: string;
        estimatedDuration: number;
    }>;
    checkpointWorkflow: (workflowId: string, state: any) => Promise<{
        checkpointed: boolean;
        checkpointId: string;
        timestamp: Date;
    }>;
    resumeWorkflowFromCheckpoint: (checkpointId: string) => Promise<{
        resumed: boolean;
        workflowId: string;
        resumedFromStep: number;
    }>;
    executeParallelAsyncResponses: (responses: Array<{
        action: string;
        params: any;
    }>) => Promise<{
        results: any[];
        successCount: number;
        failureCount: number;
    }>;
    migrateEventSchema: (event: ThreatResponseEvent, targetVersion: number) => Promise<{
        migrated: ThreatResponseEvent;
        originalVersion: number;
    }>;
    validateEventVersion: (event: ThreatResponseEvent, expectedVersion: number) => Promise<{
        valid: boolean;
        actualVersion: number;
        issues: string[];
    }>;
    createCompensatingTransaction: (originalEventId: string, compensationAction: string) => Promise<CompensatingTransaction>;
    executeCompensatingTransaction: (transaction: CompensatingTransaction) => Promise<{
        executed: boolean;
        result: any;
        error?: string;
    }>;
};
export default _default;
//# sourceMappingURL=event-driven-threat-response-composite.d.ts.map