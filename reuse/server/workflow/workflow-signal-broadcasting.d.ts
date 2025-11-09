/**
 * LOC: WSB-001
 * File: /reuse/server/workflow/workflow-signal-broadcasting.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common
 *   - @nestjs/event-emitter
 *   - zod (v3.x)
 *   - rxjs (v7.x)
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Workflow signal services
 *   - Event broadcasting systems
 *   - Real-time notification handlers
 *   - Process synchronization modules
 *   - Cross-workflow communication
 */
import { Model, Sequelize, Transaction, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, BelongsToGetAssociationMixin } from 'sequelize';
import { Subject, Observable } from 'rxjs';
/**
 * Zod schema for signal definition.
 */
export declare const SignalDefinitionSchema: any;
/**
 * Zod schema for signal subscription.
 */
export declare const SignalSubscriptionSchema: any;
/**
 * Zod schema for signal history entry.
 */
export declare const SignalHistorySchema: any;
/**
 * Zod schema for signal filter.
 */
export declare const SignalFilterSchema: any;
/**
 * Signal definition interface
 */
export interface SignalDefinition {
    id: string;
    name: string;
    namespace: string;
    scope: 'global' | 'workflow' | 'process' | 'tenant' | 'user';
    scopeId?: string;
    payload: Record<string, any>;
    version: string;
    priority: number;
    persistent: boolean;
    ttl?: number;
    expiresAt?: Date;
    metadata?: Record<string, any>;
    emittedAt: Date;
    emittedBy: string;
}
/**
 * Signal subscription interface
 */
export interface SignalSubscription {
    id: string;
    subscriberId: string;
    signalName: string;
    namespace: string;
    scope?: 'global' | 'workflow' | 'process' | 'tenant' | 'user';
    scopeId?: string;
    filter?: Record<string, any>;
    priority: number;
    active: boolean;
    throttleMs?: number;
    debounceMs?: number;
    distinct: boolean;
    createdAt: Date;
    lastTriggeredAt?: Date;
}
/**
 * Signal filter interface
 */
export interface SignalFilter {
    id: string;
    name: string;
    signalName?: string;
    namespace?: string;
    conditions: Array<{
        field: string;
        operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notIn' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
        value: any;
    }>;
    enabled: boolean;
    priority: number;
}
/**
 * Signal broadcast options
 */
export interface SignalBroadcastOptions {
    namespace?: string;
    scope?: 'global' | 'workflow' | 'process' | 'tenant' | 'user';
    scopeId?: string;
    priority?: number;
    persistent?: boolean;
    ttl?: number;
    version?: string;
    metadata?: Record<string, any>;
}
/**
 * Signal delivery result
 */
export interface SignalDeliveryResult {
    signalId: string;
    subscriberCount: number;
    deliveredTo: string[];
    failedDeliveries: string[];
    processingTimeMs: number;
}
/**
 * Signal namespace configuration
 */
export interface SignalNamespaceConfig {
    name: string;
    isolation: boolean;
    maxSignalsPerMinute?: number;
    retentionDays?: number;
    allowedScopes?: Array<'global' | 'workflow' | 'process' | 'tenant' | 'user'>;
}
/**
 * Workflow signal model attributes
 */
export interface WorkflowSignalAttributes {
    id: string;
    name: string;
    namespace: string;
    scope: string;
    scopeId?: string;
    payload: object;
    version: string;
    priority: number;
    persistent: boolean;
    status: string;
    subscriberCount: number;
    deliveredCount: number;
    expiresAt?: Date;
    emittedBy: string;
    metadata?: object;
    tenantId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
/**
 * Signal subscription model attributes
 */
export interface SignalSubscriptionAttributes {
    id: string;
    subscriberId: string;
    signalName: string;
    namespace: string;
    scope?: string;
    scopeId?: string;
    filterCriteria?: object;
    priority: number;
    active: boolean;
    throttleMs?: number;
    debounceMs?: number;
    distinct: boolean;
    triggerCount: number;
    lastTriggeredAt?: Date;
    metadata?: object;
    tenantId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
/**
 * Signal delivery log model attributes
 */
export interface SignalDeliveryLogAttributes {
    id: string;
    signalId: string;
    subscriptionId: string;
    subscriberId: string;
    status: string;
    deliveredAt?: Date;
    processingTimeMs?: number;
    errorMessage?: string;
    metadata?: object;
    tenantId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Signal filter model attributes
 */
export interface SignalFilterAttributes {
    id: string;
    name: string;
    signalName?: string;
    namespace?: string;
    conditions: object;
    enabled: boolean;
    priority: number;
    matchCount: number;
    lastMatchedAt?: Date;
    metadata?: object;
    tenantId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
/**
 * WorkflowSignal model for storing emitted signals
 */
export declare class WorkflowSignal extends Model<WorkflowSignalAttributes> implements WorkflowSignalAttributes {
    id: string;
    name: string;
    namespace: string;
    scope: string;
    scopeId?: string;
    payload: object;
    version: string;
    priority: number;
    persistent: boolean;
    status: string;
    subscriberCount: number;
    deliveredCount: number;
    expiresAt?: Date;
    emittedBy: string;
    metadata?: object;
    tenantId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;
    getDeliveryLogs: HasManyGetAssociationsMixin<SignalDeliveryLog>;
    addDeliveryLog: HasManyAddAssociationMixin<SignalDeliveryLog, string>;
    static associations: {
        deliveryLogs: Association<WorkflowSignal, SignalDeliveryLog>;
    };
}
/**
 * SignalSubscription model for managing subscriptions
 */
export declare class SignalSubscriptionModel extends Model<SignalSubscriptionAttributes> implements SignalSubscriptionAttributes {
    id: string;
    subscriberId: string;
    signalName: string;
    namespace: string;
    scope?: string;
    scopeId?: string;
    filterCriteria?: object;
    priority: number;
    active: boolean;
    throttleMs?: number;
    debounceMs?: number;
    distinct: boolean;
    triggerCount: number;
    lastTriggeredAt?: Date;
    metadata?: object;
    tenantId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;
    getDeliveryLogs: HasManyGetAssociationsMixin<SignalDeliveryLog>;
    static associations: {
        deliveryLogs: Association<SignalSubscriptionModel, SignalDeliveryLog>;
    };
}
/**
 * SignalDeliveryLog model for tracking signal deliveries
 */
export declare class SignalDeliveryLog extends Model<SignalDeliveryLogAttributes> implements SignalDeliveryLogAttributes {
    id: string;
    signalId: string;
    subscriptionId: string;
    subscriberId: string;
    status: string;
    deliveredAt?: Date;
    processingTimeMs?: number;
    errorMessage?: string;
    metadata?: object;
    tenantId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    getSignal: BelongsToGetAssociationMixin<WorkflowSignal>;
    getSubscription: BelongsToGetAssociationMixin<SignalSubscriptionModel>;
    static associations: {
        signal: Association<SignalDeliveryLog, WorkflowSignal>;
        subscription: Association<SignalDeliveryLog, SignalSubscriptionModel>;
    };
}
/**
 * SignalFilter model for defining signal filters
 */
export declare class SignalFilterModel extends Model<SignalFilterAttributes> implements SignalFilterAttributes {
    id: string;
    name: string;
    signalName?: string;
    namespace?: string;
    conditions: object;
    enabled: boolean;
    priority: number;
    matchCount: number;
    lastMatchedAt?: Date;
    metadata?: object;
    tenantId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;
}
/**
 * Initializes the WorkflowSignal model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for signal management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof WorkflowSignal} Initialized model
 *
 * @example
 * ```typescript
 * const Signal = initWorkflowSignalModel(sequelize);
 * const signal = await Signal.create({
 *   name: 'ORDER_COMPLETED',
 *   namespace: 'orders',
 *   payload: { orderId: '123' }
 * });
 * ```
 */
export declare function initWorkflowSignalModel(sequelize: Sequelize): typeof WorkflowSignal;
/**
 * Initializes the SignalSubscription model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for subscription management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof SignalSubscriptionModel} Initialized model
 *
 * @example
 * ```typescript
 * const Subscription = initSignalSubscriptionModel(sequelize);
 * const sub = await Subscription.create({
 *   subscriberId: 'user-123',
 *   signalName: 'ORDER_COMPLETED',
 *   namespace: 'orders'
 * });
 * ```
 */
export declare function initSignalSubscriptionModel(sequelize: Sequelize): typeof SignalSubscriptionModel;
/**
 * Initializes the SignalDeliveryLog model with comprehensive configuration.
 * Tracks signal delivery attempts and results.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof SignalDeliveryLog} Initialized model
 *
 * @example
 * ```typescript
 * const DeliveryLog = initSignalDeliveryLogModel(sequelize);
 * ```
 */
export declare function initSignalDeliveryLogModel(sequelize: Sequelize): typeof SignalDeliveryLog;
/**
 * Initializes the SignalFilter model with comprehensive configuration.
 * Defines signal filtering rules for advanced routing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof SignalFilterModel} Initialized model
 *
 * @example
 * ```typescript
 * const Filter = initSignalFilterModel(sequelize);
 * const filter = await Filter.create({
 *   name: 'High Value Orders',
 *   signalName: 'ORDER_COMPLETED',
 *   conditions: [{ field: 'amount', operator: 'gt', value: 1000 }]
 * });
 * ```
 */
export declare function initSignalFilterModel(sequelize: Sequelize): typeof SignalFilterModel;
/**
 * Sets up associations between signal models.
 * Defines relationships for signal delivery tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 *
 * @example
 * ```typescript
 * setupSignalAssociations(sequelize);
 * ```
 */
export declare function setupSignalAssociations(sequelize: Sequelize): void;
/**
 * Emits a signal with specified name and payload.
 * Creates and broadcasts a signal to all matching subscriptions.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} name - Signal name
 * @param {Record<string, any>} payload - Signal payload
 * @param {SignalBroadcastOptions} options - Broadcast options
 * @returns {Promise<WorkflowSignal>} Emitted signal
 *
 * @example
 * ```typescript
 * const signal = await emitSignal(
 *   WorkflowSignal,
 *   'ORDER_COMPLETED',
 *   { orderId: '123', amount: 500 },
 *   { namespace: 'orders', priority: 8 }
 * );
 * ```
 */
export declare function emitSignal(model: typeof WorkflowSignal, name: string, payload: Record<string, any>, options?: SignalBroadcastOptions): Promise<WorkflowSignal>;
/**
 * Emits multiple signals in batch.
 * Efficiently creates multiple signals in a single transaction.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {Array<{ name: string; payload: Record<string, any>; options?: SignalBroadcastOptions }>} signals - Signals to emit
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowSignal[]>} Emitted signals
 *
 * @example
 * ```typescript
 * const signals = await emitSignalBatch(WorkflowSignal, [
 *   { name: 'ORDER_CREATED', payload: { orderId: '123' } },
 *   { name: 'INVENTORY_UPDATED', payload: { productId: '456' } }
 * ]);
 * ```
 */
export declare function emitSignalBatch(model: typeof WorkflowSignal, signals: Array<{
    name: string;
    payload: Record<string, any>;
    options?: SignalBroadcastOptions;
}>, transaction?: Transaction): Promise<WorkflowSignal[]>;
/**
 * Cancels a pending signal before delivery.
 * Prevents signal from being broadcast to subscribers.
 *
 * @param {WorkflowSignal} signal - Signal to cancel
 * @returns {Promise<WorkflowSignal>} Cancelled signal
 *
 * @example
 * ```typescript
 * await cancelSignal(signal);
 * ```
 */
export declare function cancelSignal(signal: WorkflowSignal): Promise<WorkflowSignal>;
/**
 * Creates a signal subscription for a specific signal.
 * Registers a subscriber to receive matching signals.
 *
 * @param {typeof SignalSubscriptionModel} model - SignalSubscription model
 * @param {string} subscriberId - Subscriber identifier
 * @param {string} signalName - Signal name to subscribe to
 * @param {Partial<SignalSubscriptionAttributes>} options - Additional subscription options
 * @returns {Promise<SignalSubscriptionModel>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await subscribeToSignal(
 *   SignalSubscription,
 *   'user-123',
 *   'ORDER_COMPLETED',
 *   { namespace: 'orders', priority: 8, throttleMs: 5000 }
 * );
 * ```
 */
export declare function subscribeToSignal(model: typeof SignalSubscriptionModel, subscriberId: string, signalName: string, options?: Partial<SignalSubscriptionAttributes>): Promise<SignalSubscriptionModel>;
/**
 * Unsubscribes from a signal.
 * Deactivates or removes a subscription.
 *
 * @param {SignalSubscriptionModel} subscription - Subscription to remove
 * @param {boolean} soft - Whether to soft delete (deactivate) or hard delete
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await unsubscribeFromSignal(subscription, true);
 * ```
 */
export declare function unsubscribeFromSignal(subscription: SignalSubscriptionModel, soft?: boolean): Promise<void>;
/**
 * Finds active subscriptions matching a signal.
 * Returns all active subscriptions for signal routing.
 *
 * @param {typeof SignalSubscriptionModel} model - SignalSubscription model
 * @param {WorkflowSignal} signal - Signal to match
 * @returns {Promise<SignalSubscriptionModel[]>} Matching subscriptions
 *
 * @example
 * ```typescript
 * const subscriptions = await findSignalSubscriptions(SignalSubscription, signal);
 * ```
 */
export declare function findSignalSubscriptions(model: typeof SignalSubscriptionModel, signal: WorkflowSignal): Promise<SignalSubscriptionModel[]>;
/**
 * Updates subscription trigger statistics.
 * Increments trigger count and updates last triggered timestamp.
 *
 * @param {SignalSubscriptionModel} subscription - Subscription instance
 * @returns {Promise<SignalSubscriptionModel>} Updated subscription
 *
 * @example
 * ```typescript
 * await updateSubscriptionTriggerStats(subscription);
 * ```
 */
export declare function updateSubscriptionTriggerStats(subscription: SignalSubscriptionModel): Promise<SignalSubscriptionModel>;
/**
 * Broadcasts a signal to all matching subscribers.
 * Delivers signal to subscribers and tracks delivery.
 *
 * @param {WorkflowSignal} signal - Signal to broadcast
 * @param {typeof SignalSubscriptionModel} subscriptionModel - Subscription model
 * @param {typeof SignalDeliveryLog} logModel - Delivery log model
 * @param {(subscription: SignalSubscriptionModel, signal: WorkflowSignal) => Promise<boolean>} deliveryFn - Delivery function
 * @returns {Promise<SignalDeliveryResult>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await broadcastSignal(
 *   signal,
 *   SignalSubscription,
 *   DeliveryLog,
 *   async (sub, sig) => await notifySubscriber(sub, sig)
 * );
 * ```
 */
export declare function broadcastSignal(signal: WorkflowSignal, subscriptionModel: typeof SignalSubscriptionModel, logModel: typeof SignalDeliveryLog, deliveryFn: (subscription: SignalSubscriptionModel, signal: WorkflowSignal) => Promise<boolean>): Promise<SignalDeliveryResult>;
/**
 * Broadcasts a signal globally to all namespaces.
 * Delivers signal across all namespace boundaries.
 *
 * @param {typeof WorkflowSignal} signalModel - WorkflowSignal model
 * @param {string} name - Signal name
 * @param {Record<string, any>} payload - Signal payload
 * @param {SignalBroadcastOptions} options - Broadcast options
 * @returns {Promise<WorkflowSignal>} Broadcast signal
 *
 * @example
 * ```typescript
 * const signal = await broadcastGlobalSignal(
 *   WorkflowSignal,
 *   'SYSTEM_MAINTENANCE',
 *   { message: 'Scheduled maintenance at 2am' }
 * );
 * ```
 */
export declare function broadcastGlobalSignal(signalModel: typeof WorkflowSignal, name: string, payload: Record<string, any>, options?: SignalBroadcastOptions): Promise<WorkflowSignal>;
/**
 * Broadcasts a signal to a specific scope.
 * Delivers signal only to subscribers within the scope.
 *
 * @param {typeof WorkflowSignal} signalModel - WorkflowSignal model
 * @param {string} name - Signal name
 * @param {'workflow' | 'process' | 'tenant' | 'user'} scope - Target scope
 * @param {string} scopeId - Scope identifier
 * @param {Record<string, any>} payload - Signal payload
 * @param {SignalBroadcastOptions} options - Additional options
 * @returns {Promise<WorkflowSignal>} Scoped signal
 *
 * @example
 * ```typescript
 * const signal = await broadcastScopedSignal(
 *   WorkflowSignal,
 *   'WORKFLOW_UPDATED',
 *   'workflow',
 *   'wf-123',
 *   { status: 'completed' }
 * );
 * ```
 */
export declare function broadcastScopedSignal(signalModel: typeof WorkflowSignal, name: string, scope: 'workflow' | 'process' | 'tenant' | 'user', scopeId: string, payload: Record<string, any>, options?: SignalBroadcastOptions): Promise<WorkflowSignal>;
/**
 * Evaluates a signal against filter conditions.
 * Determines if a signal matches filter criteria.
 *
 * @param {WorkflowSignal} signal - Signal to evaluate
 * @param {SignalFilter['conditions']} conditions - Filter conditions
 * @returns {boolean} Whether signal matches conditions
 *
 * @example
 * ```typescript
 * const matches = evaluateSignalFilter(
 *   signal,
 *   [{ field: 'amount', operator: 'gt', value: 1000 }]
 * );
 * ```
 */
export declare function evaluateSignalFilter(signal: WorkflowSignal, conditions: SignalFilter['conditions']): boolean;
/**
 * Applies filters to a signal before delivery.
 * Filters subscriptions based on signal content.
 *
 * @param {SignalSubscriptionModel[]} subscriptions - Available subscriptions
 * @param {WorkflowSignal} signal - Signal to filter
 * @returns {SignalSubscriptionModel[]} Filtered subscriptions
 *
 * @example
 * ```typescript
 * const filtered = applySignalFilters(subscriptions, signal);
 * ```
 */
export declare function applySignalFilters(subscriptions: SignalSubscriptionModel[], signal: WorkflowSignal): SignalSubscriptionModel[];
/**
 * Creates a reusable signal filter.
 * Defines filter rules for signal routing.
 *
 * @param {typeof SignalFilterModel} model - SignalFilter model
 * @param {Partial<SignalFilterAttributes>} filterData - Filter configuration
 * @returns {Promise<SignalFilterModel>} Created filter
 *
 * @example
 * ```typescript
 * const filter = await createSignalFilter(SignalFilter, {
 *   name: 'High Priority Orders',
 *   signalName: 'ORDER_CREATED',
 *   conditions: [{ field: 'priority', operator: 'gte', value: 8 }]
 * });
 * ```
 */
export declare function createSignalFilter(model: typeof SignalFilterModel, filterData: Partial<SignalFilterAttributes>): Promise<SignalFilterModel>;
/**
 * Retrieves signal delivery history.
 * Gets all delivery logs for a signal.
 *
 * @param {typeof SignalDeliveryLog} model - DeliveryLog model
 * @param {string} signalId - Signal identifier
 * @returns {Promise<SignalDeliveryLog[]>} Delivery history
 *
 * @example
 * ```typescript
 * const history = await getSignalHistory(DeliveryLog, signal.id);
 * ```
 */
export declare function getSignalHistory(model: typeof SignalDeliveryLog, signalId: string): Promise<SignalDeliveryLog[]>;
/**
 * Gets subscription delivery history.
 * Retrieves all signals delivered to a subscription.
 *
 * @param {typeof SignalDeliveryLog} model - DeliveryLog model
 * @param {string} subscriptionId - Subscription identifier
 * @param {number} limit - Maximum number of records
 * @returns {Promise<SignalDeliveryLog[]>} Subscription history
 *
 * @example
 * ```typescript
 * const history = await getSubscriptionHistory(DeliveryLog, subscription.id, 50);
 * ```
 */
export declare function getSubscriptionHistory(model: typeof SignalDeliveryLog, subscriptionId: string, limit?: number): Promise<SignalDeliveryLog[]>;
/**
 * Archives old signal delivery logs.
 * Removes or archives logs older than retention period.
 *
 * @param {typeof SignalDeliveryLog} model - DeliveryLog model
 * @param {number} retentionDays - Days to retain logs
 * @returns {Promise<number>} Number of archived logs
 *
 * @example
 * ```typescript
 * const archived = await archiveSignalHistory(DeliveryLog, 90);
 * ```
 */
export declare function archiveSignalHistory(model: typeof SignalDeliveryLog, retentionDays?: number): Promise<number>;
/**
 * Creates a synchronization barrier using signals.
 * Waits for multiple signals before proceeding.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string[]} signalNames - Signal names to wait for
 * @param {string} namespace - Signal namespace
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<WorkflowSignal[]>} Synchronized signals
 *
 * @example
 * ```typescript
 * const signals = await createSignalBarrier(
 *   WorkflowSignal,
 *   ['PAYMENT_COMPLETED', 'SHIPPING_CONFIRMED'],
 *   'orders',
 *   30000
 * );
 * ```
 */
export declare function createSignalBarrier(model: typeof WorkflowSignal, signalNames: string[], namespace?: string, timeoutMs?: number): Promise<WorkflowSignal[]>;
/**
 * Implements signal-based rendezvous synchronization.
 * Coordinates multiple processes using signals.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} rendezvousName - Rendezvous point name
 * @param {number} participantCount - Expected number of participants
 * @param {string} participantId - This participant's identifier
 * @returns {Promise<boolean>} Whether rendezvous succeeded
 *
 * @example
 * ```typescript
 * const success = await signalRendezvous(
 *   WorkflowSignal,
 *   'batch-processing',
 *   3,
 *   'worker-1'
 * );
 * ```
 */
export declare function signalRendezvous(model: typeof WorkflowSignal, rendezvousName: string, participantCount: number, participantId: string): Promise<boolean>;
/**
 * Creates an isolated signal namespace.
 * Configures namespace-specific settings and isolation.
 *
 * @param {string} namespace - Namespace name
 * @param {SignalNamespaceConfig} config - Namespace configuration
 * @returns {SignalNamespaceConfig} Created namespace config
 *
 * @example
 * ```typescript
 * const namespace = createSignalNamespace('orders', {
 *   name: 'orders',
 *   isolation: true,
 *   maxSignalsPerMinute: 1000,
 *   retentionDays: 30
 * });
 * ```
 */
export declare function createSignalNamespace(namespace: string, config?: Partial<SignalNamespaceConfig>): SignalNamespaceConfig;
/**
 * Lists all signals in a namespace.
 * Retrieves signals filtered by namespace.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to query
 * @param {number} limit - Maximum number of signals
 * @returns {Promise<WorkflowSignal[]>} Namespace signals
 *
 * @example
 * ```typescript
 * const signals = await listNamespaceSignals(WorkflowSignal, 'orders', 100);
 * ```
 */
export declare function listNamespaceSignals(model: typeof WorkflowSignal, namespace: string, limit?: number): Promise<WorkflowSignal[]>;
/**
 * Purges expired signals from a namespace.
 * Cleans up old signals based on namespace retention.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to purge
 * @param {number} retentionDays - Retention period in days
 * @returns {Promise<number>} Number of purged signals
 *
 * @example
 * ```typescript
 * const purged = await purgeNamespaceSignals(WorkflowSignal, 'orders', 30);
 * ```
 */
export declare function purgeNamespaceSignals(model: typeof WorkflowSignal, namespace: string, retentionDays: number): Promise<number>;
/**
 * Creates a throttled signal observable.
 * Limits signal emission rate using RxJS throttle.
 *
 * @param {Subject<WorkflowSignal>} signalSubject - Signal subject
 * @param {number} throttleMs - Throttle interval in milliseconds
 * @returns {Observable<WorkflowSignal>} Throttled observable
 *
 * @example
 * ```typescript
 * const throttled = createThrottledSignalObservable(signalSubject, 1000);
 * throttled.subscribe(signal => console.log('Throttled signal:', signal));
 * ```
 */
export declare function createThrottledSignalObservable(signalSubject: Subject<WorkflowSignal>, throttleMs: number): Observable<WorkflowSignal>;
/**
 * Creates a debounced signal observable.
 * Delays signal emission until quiet period using RxJS debounce.
 *
 * @param {Subject<WorkflowSignal>} signalSubject - Signal subject
 * @param {number} debounceMs - Debounce interval in milliseconds
 * @returns {Observable<WorkflowSignal>} Debounced observable
 *
 * @example
 * ```typescript
 * const debounced = createDebouncedSignalObservable(signalSubject, 500);
 * debounced.subscribe(signal => console.log('Debounced signal:', signal));
 * ```
 */
export declare function createDebouncedSignalObservable(signalSubject: Subject<WorkflowSignal>, debounceMs: number): Observable<WorkflowSignal>;
/**
 * Creates a distinct signal observable.
 * Filters duplicate signals based on content.
 *
 * @param {Subject<WorkflowSignal>} signalSubject - Signal subject
 * @param {(signal: WorkflowSignal) => string} keySelector - Key selection function
 * @returns {Observable<WorkflowSignal>} Distinct observable
 *
 * @example
 * ```typescript
 * const distinct = createDistinctSignalObservable(
 *   signalSubject,
 *   signal => `${signal.name}:${JSON.stringify(signal.payload)}`
 * );
 * ```
 */
export declare function createDistinctSignalObservable(signalSubject: Subject<WorkflowSignal>, keySelector: (signal: WorkflowSignal) => string): Observable<WorkflowSignal>;
/**
 * Batches signals for efficient processing.
 * Collects signals into batches for bulk operations.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to batch
 * @param {number} batchSize - Batch size
 * @returns {Promise<WorkflowSignal[][]>} Batched signals
 *
 * @example
 * ```typescript
 * const batches = await batchSignalsForProcessing(WorkflowSignal, 'orders', 50);
 * ```
 */
export declare function batchSignalsForProcessing(model: typeof WorkflowSignal, namespace: string, batchSize?: number): Promise<WorkflowSignal[][]>;
/**
 * Optimizes signal delivery with parallel processing.
 * Delivers signals to multiple subscribers in parallel.
 *
 * @param {WorkflowSignal} signal - Signal to deliver
 * @param {SignalSubscriptionModel[]} subscriptions - Target subscriptions
 * @param {(subscription: SignalSubscriptionModel, signal: WorkflowSignal) => Promise<boolean>} deliveryFn - Delivery function
 * @param {number} concurrency - Maximum concurrent deliveries
 * @returns {Promise<{ success: number; failed: number }>} Delivery statistics
 *
 * @example
 * ```typescript
 * const stats = await optimizedParallelDelivery(
 *   signal,
 *   subscriptions,
 *   async (sub, sig) => await deliverToSubscriber(sub, sig),
 *   10
 * );
 * ```
 */
export declare function optimizedParallelDelivery(signal: WorkflowSignal, subscriptions: SignalSubscriptionModel[], deliveryFn: (subscription: SignalSubscriptionModel, signal: WorkflowSignal) => Promise<boolean>, concurrency?: number): Promise<{
    success: number;
    failed: number;
}>;
/**
 * Implements signal caching for performance.
 * Caches frequently accessed signals in memory.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} signalId - Signal identifier
 * @param {Map<string, WorkflowSignal>} cache - Cache storage
 * @param {number} ttlMs - Cache TTL in milliseconds
 * @returns {Promise<WorkflowSignal | null>} Cached or fetched signal
 *
 * @example
 * ```typescript
 * const cache = new Map();
 * const signal = await getCachedSignal(WorkflowSignal, signalId, cache, 60000);
 * ```
 */
export declare function getCachedSignal(model: typeof WorkflowSignal, signalId: string, cache: Map<string, {
    signal: WorkflowSignal;
    expiry: number;
}>, ttlMs?: number): Promise<WorkflowSignal | null>;
/**
 * Gets signal delivery performance metrics.
 * Calculates delivery statistics and performance indicators.
 *
 * @param {typeof SignalDeliveryLog} model - DeliveryLog model
 * @param {string} namespace - Namespace to analyze
 * @param {Date} since - Start date for metrics
 * @returns {Promise<{ totalDeliveries: number; successRate: number; avgProcessingTimeMs: number }>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await getSignalPerformanceMetrics(
 *   DeliveryLog,
 *   'orders',
 *   new Date(Date.now() - 24 * 60 * 60 * 1000)
 * );
 * ```
 */
export declare function getSignalPerformanceMetrics(model: typeof SignalDeliveryLog, namespace: string, since: Date): Promise<{
    totalDeliveries: number;
    successRate: number;
    avgProcessingTimeMs: number;
}>;
/**
 * Replays signals from a specific point in time.
 * Re-broadcasts historical signals for debugging or recovery.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {Date} fromTime - Start time for replay
 * @param {Date} toTime - End time for replay
 * @param {string} [namespace] - Optional namespace filter
 * @returns {Promise<WorkflowSignal[]>} Replayed signals
 *
 * @example
 * ```typescript
 * const replayed = await replaySignals(
 *   WorkflowSignal,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-02'),
 *   'orders'
 * );
 * ```
 */
export declare function replaySignals(model: typeof WorkflowSignal, fromTime: Date, toTime: Date, namespace?: string): Promise<WorkflowSignal[]>;
/**
 * Creates a signal snapshot for time-travel debugging.
 * Captures the state of all signals at a point in time.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to snapshot
 * @param {Date} [timestamp] - Snapshot timestamp (defaults to now)
 * @returns {Promise<{ timestamp: Date; signals: WorkflowSignal[]; count: number }>} Signal snapshot
 *
 * @example
 * ```typescript
 * const snapshot = await createSignalSnapshot(WorkflowSignal, 'orders');
 * ```
 */
export declare function createSignalSnapshot(model: typeof WorkflowSignal, namespace: string, timestamp?: Date): Promise<{
    timestamp: Date;
    signals: WorkflowSignal[];
    count: number;
}>;
/**
 * Restores signals from a snapshot.
 * Resets signal state to a previous snapshot.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {{ timestamp: Date; signals: WorkflowSignal[] }} snapshot - Snapshot to restore
 * @returns {Promise<number>} Number of signals restored
 *
 * @example
 * ```typescript
 * const restored = await restoreSignalSnapshot(WorkflowSignal, snapshot);
 * ```
 */
export declare function restoreSignalSnapshot(model: typeof WorkflowSignal, snapshot: {
    timestamp: Date;
    signals: WorkflowSignal[];
}): Promise<number>;
/**
 * Upgrades signal payload to a new version.
 * Transforms signal payload for version compatibility.
 *
 * @param {WorkflowSignal} signal - Signal to upgrade
 * @param {string} targetVersion - Target version
 * @param {(payload: any, fromVersion: string, toVersion: string) => any} transformFn - Transform function
 * @returns {Promise<WorkflowSignal>} Upgraded signal
 *
 * @example
 * ```typescript
 * const upgraded = await upgradeSignalVersion(
 *   signal,
 *   '2.0.0',
 *   (payload, from, to) => ({ ...payload, newField: 'default' })
 * );
 * ```
 */
export declare function upgradeSignalVersion(signal: WorkflowSignal, targetVersion: string, transformFn: (payload: any, fromVersion: string, toVersion: string) => any): Promise<WorkflowSignal>;
/**
 * Checks signal version compatibility.
 * Validates if signal version is compatible with expected version.
 *
 * @param {string} signalVersion - Signal version
 * @param {string} expectedVersion - Expected version
 * @returns {boolean} Whether versions are compatible
 *
 * @example
 * ```typescript
 * const compatible = isSignalVersionCompatible('1.2.3', '1.0.0');
 * ```
 */
export declare function isSignalVersionCompatible(signalVersion: string, expectedVersion: string): boolean;
/**
 * Migrates signals to a new version schema.
 * Batch upgrades all signals in a namespace.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to migrate
 * @param {string} targetVersion - Target version
 * @param {(payload: any) => any} transformFn - Transform function
 * @returns {Promise<number>} Number of migrated signals
 *
 * @example
 * ```typescript
 * const migrated = await migrateSignalsToVersion(
 *   WorkflowSignal,
 *   'orders',
 *   '2.0.0',
 *   (payload) => ({ ...payload, v2Field: true })
 * );
 * ```
 */
export declare function migrateSignalsToVersion(model: typeof WorkflowSignal, namespace: string, targetVersion: string, transformFn: (payload: any) => any): Promise<number>;
/**
 * Aggregates signals by type.
 * Groups and counts signals by their type.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to aggregate
 * @param {Date} [since] - Start date for aggregation
 * @returns {Promise<Array<{ name: string; count: number }>>} Aggregated signal counts
 *
 * @example
 * ```typescript
 * const aggregated = await aggregateSignalsByType(
 *   WorkflowSignal,
 *   'orders',
 *   new Date(Date.now() - 24 * 60 * 60 * 1000)
 * );
 * ```
 */
export declare function aggregateSignalsByType(model: typeof WorkflowSignal, namespace: string, since?: Date): Promise<Array<{
    name: string;
    count: number;
}>>;
/**
 * Aggregates signals by time window.
 * Groups signals into time buckets for analysis.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to aggregate
 * @param {Date} fromTime - Start time
 * @param {Date} toTime - End time
 * @param {number} bucketMinutes - Bucket size in minutes
 * @returns {Promise<Array<{ bucket: Date; count: number }>>} Time-bucketed counts
 *
 * @example
 * ```typescript
 * const timeSeries = await aggregateSignalsByTimeWindow(
 *   WorkflowSignal,
 *   'orders',
 *   new Date(Date.now() - 24 * 60 * 60 * 1000),
 *   new Date(),
 *   60
 * );
 * ```
 */
export declare function aggregateSignalsByTimeWindow(model: typeof WorkflowSignal, namespace: string, fromTime: Date, toTime: Date, bucketMinutes?: number): Promise<Array<{
    bucket: Date;
    count: number;
}>>;
/**
 * Computes signal delivery success rate by subscriber.
 * Analyzes delivery success per subscriber.
 *
 * @param {typeof SignalDeliveryLog} model - DeliveryLog model
 * @param {Date} since - Start date for analysis
 * @returns {Promise<Array<{ subscriberId: string; totalDeliveries: number; successRate: number }>>} Subscriber success rates
 *
 * @example
 * ```typescript
 * const rates = await computeSubscriberSuccessRates(
 *   DeliveryLog,
 *   new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
 * );
 * ```
 */
export declare function computeSubscriberSuccessRates(model: typeof SignalDeliveryLog, since: Date): Promise<Array<{
    subscriberId: string;
    totalDeliveries: number;
    successRate: number;
}>>;
/**
 * Implements signal priority boosting.
 * Increases priority of signals that have been waiting too long.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {number} ageThresholdMs - Age threshold for boosting
 * @param {number} boostAmount - Amount to increase priority
 * @returns {Promise<number>} Number of signals boosted
 *
 * @example
 * ```typescript
 * const boosted = await boostStaleSignalPriority(
 *   WorkflowSignal,
 *   60000, // 1 minute
 *   2
 * );
 * ```
 */
export declare function boostStaleSignalPriority(model: typeof WorkflowSignal, ageThresholdMs: number, boostAmount?: number): Promise<number>;
/**
 * Implements signal rate limiting per namespace.
 * Enforces maximum signal emission rate.
 *
 * @param {typeof WorkflowSignal} model - WorkflowSignal model
 * @param {string} namespace - Namespace to check
 * @param {number} maxSignalsPerMinute - Rate limit
 * @returns {Promise<boolean>} Whether rate limit is exceeded
 *
 * @example
 * ```typescript
 * const exceeded = await checkSignalRateLimit(WorkflowSignal, 'orders', 1000);
 * if (exceeded) {
 *   throw new Error('Rate limit exceeded');
 * }
 * ```
 */
export declare function checkSignalRateLimit(model: typeof WorkflowSignal, namespace: string, maxSignalsPerMinute: number): Promise<boolean>;
/**
 * Clones a signal with modifications.
 * Creates a copy of a signal with updated fields.
 *
 * @param {WorkflowSignal} signal - Signal to clone
 * @param {Partial<WorkflowSignalAttributes>} modifications - Fields to modify
 * @returns {Promise<WorkflowSignal>} Cloned signal
 *
 * @example
 * ```typescript
 * const cloned = await cloneSignal(signal, {
 *   priority: 10,
 *   metadata: { clonedFrom: signal.id }
 * });
 * ```
 */
export declare function cloneSignal(signal: WorkflowSignal, modifications?: Partial<WorkflowSignalAttributes>): Promise<WorkflowSignal>;
//# sourceMappingURL=workflow-signal-broadcasting.d.ts.map