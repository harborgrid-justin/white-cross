/**
 * LOC: SANSTATE001
 * File: /reuse/san/network-state-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - SAN network controllers
 *   - Network orchestration services
 *   - Virtual network management systems
 */
/**
 * File: /reuse/san/network-state-management-kit.ts
 * Locator: WC-UTL-SAN-STATE-001
 * Purpose: Comprehensive Network State Management Utilities for Software-Defined Virtual Networks
 *
 * Upstream: Independent utility module for network state management
 * Downstream: ../backend/*, SAN controllers, network orchestration, state synchronization services
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, Redis 7.x
 * Exports: 40 utility functions for network state management, synchronization, observers, events, transitions, validation, persistence, recovery
 *
 * LLM Context: Production-grade network state management utilities for software-defined enterprise virtual networks.
 * Provides state store patterns, synchronization mechanisms, observer patterns, event emitters, state transitions,
 * validation, persistence, and recovery capabilities. Essential for maintaining consistent network state across
 * distributed SAN infrastructure with high availability and reliability requirements.
 */
import { Sequelize } from 'sequelize';
import { EventEmitter } from 'events';
interface NetworkState {
    networkId: string;
    state: string;
    version: number;
    timestamp: Date;
    data: Record<string, any>;
    metadata: Record<string, any>;
}
interface StateTransition {
    id: string;
    networkId: string;
    fromState: string;
    toState: string;
    triggeredBy: string;
    timestamp: Date;
    metadata: Record<string, any>;
}
interface StateObserver {
    id: string;
    networkId: string;
    callback: (state: NetworkState) => void;
    filter?: (state: NetworkState) => boolean;
    priority: number;
}
interface StateStore {
    states: Map<string, NetworkState>;
    observers: Map<string, StateObserver[]>;
    history: StateTransition[];
}
interface StateSyncConfig {
    interval: number;
    retryAttempts: number;
    conflictResolution: 'last-write-wins' | 'merge' | 'manual';
    syncNodes: string[];
}
interface StateValidationRule {
    field: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required?: boolean;
    validator?: (value: any) => boolean;
    message?: string;
}
interface StateValidationResult {
    valid: boolean;
    errors: Array<{
        field: string;
        message: string;
        value?: any;
    }>;
}
interface StateCheckpoint {
    id: string;
    networkId: string;
    state: NetworkState;
    timestamp: Date;
    label?: string;
}
interface NetworkEvent {
    type: string;
    networkId: string;
    timestamp: Date;
    data: any;
    source: string;
}
interface TransitionValidation {
    valid: boolean;
    message?: string;
    allowedTransitions?: string[];
}
/**
 * Sequelize model for Network State with versioning and metadata.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkState model
 *
 * @example
 * ```typescript
 * const NetworkState = createNetworkStateModel(sequelize);
 * const state = await NetworkState.create({
 *   networkId: 'net-12345',
 *   state: 'active',
 *   version: 1,
 *   data: { vlanId: 100, subnet: '10.0.1.0/24' },
 *   metadata: { region: 'us-east-1' }
 * });
 * ```
 */
export declare const createNetworkStateModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        networkId: string;
        state: string;
        version: number;
        data: Record<string, any>;
        metadata: Record<string, any>;
        previousState: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Network State Transitions with audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkStateTransition model
 *
 * @example
 * ```typescript
 * const StateTransition = createNetworkStateTransitionModel(sequelize);
 * const transition = await StateTransition.create({
 *   networkId: 'net-12345',
 *   fromState: 'provisioning',
 *   toState: 'active',
 *   triggeredBy: 'admin@example.com',
 *   success: true,
 *   metadata: { reason: 'Deployment complete' }
 * });
 * ```
 */
export declare const createNetworkStateTransitionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        networkId: string;
        fromState: string;
        toState: string;
        triggeredBy: string;
        success: boolean;
        errorMessage: string | null;
        duration: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Network State Snapshots for backup and recovery.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkStateSnapshot model
 *
 * @example
 * ```typescript
 * const StateSnapshot = createNetworkStateSnapshotModel(sequelize);
 * const snapshot = await StateSnapshot.create({
 *   networkId: 'net-12345',
 *   snapshotLabel: 'pre-migration-backup',
 *   state: 'active',
 *   stateData: { ...currentState },
 *   retentionDays: 30
 * });
 * ```
 */
export declare const createNetworkStateSnapshotModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        networkId: string;
        snapshotLabel: string;
        state: string;
        stateData: Record<string, any>;
        metadata: Record<string, any>;
        retentionDays: number;
        expiresAt: Date;
        readonly createdAt: Date;
    };
};
/**
 * Creates an in-memory state store for managing network states.
 *
 * @returns {StateStore} State store instance
 *
 * @example
 * ```typescript
 * const store = createStateStore();
 * // Store is ready to manage network states
 * ```
 */
export declare const createStateStore: () => StateStore;
/**
 * Retrieves current state for a specific network.
 *
 * @param {StateStore} store - State store instance
 * @param {string} networkId - Network identifier
 * @returns {NetworkState | null} Current network state or null if not found
 *
 * @example
 * ```typescript
 * const state = getState(store, 'net-12345');
 * if (state) {
 *   console.log('Current state:', state.state);
 *   console.log('Version:', state.version);
 * }
 * ```
 */
export declare const getState: (store: StateStore, networkId: string) => NetworkState | null;
/**
 * Sets or updates network state in the store.
 *
 * @param {StateStore} store - State store instance
 * @param {string} networkId - Network identifier
 * @param {Partial<NetworkState>} stateUpdate - State update data
 * @returns {NetworkState} Updated network state
 *
 * @example
 * ```typescript
 * const newState = setState(store, 'net-12345', {
 *   state: 'active',
 *   data: { vlanId: 100, bandwidth: '10Gbps' },
 *   metadata: { region: 'us-west-2' }
 * });
 * ```
 */
export declare const setState: (store: StateStore, networkId: string, stateUpdate: Partial<NetworkState>) => NetworkState;
/**
 * Subscribes an observer to network state changes.
 *
 * @param {StateStore} store - State store instance
 * @param {string} networkId - Network identifier
 * @param {StateObserver} observer - Observer configuration
 *
 * @example
 * ```typescript
 * subscribeToState(store, 'net-12345', {
 *   id: 'observer-1',
 *   networkId: 'net-12345',
 *   callback: (state) => console.log('State changed:', state),
 *   filter: (state) => state.state === 'active',
 *   priority: 10
 * });
 * ```
 */
export declare const subscribeToState: (store: StateStore, networkId: string, observer: StateObserver) => void;
/**
 * Unsubscribes an observer from network state changes.
 *
 * @param {StateStore} store - State store instance
 * @param {string} networkId - Network identifier
 * @param {string} observerId - Observer identifier
 *
 * @example
 * ```typescript
 * unsubscribeFromState(store, 'net-12345', 'observer-1');
 * ```
 */
export declare const unsubscribeFromState: (store: StateStore, networkId: string, observerId: string) => void;
/**
 * Synchronizes network state across multiple nodes.
 *
 * @param {string} networkId - Network identifier
 * @param {NetworkState} localState - Local state
 * @param {StateSyncConfig} config - Sync configuration
 * @returns {Promise<NetworkState>} Synchronized state
 *
 * @example
 * ```typescript
 * const syncedState = await syncNetworkState('net-12345', localState, {
 *   interval: 5000,
 *   retryAttempts: 3,
 *   conflictResolution: 'last-write-wins',
 *   syncNodes: ['node1', 'node2', 'node3']
 * });
 * ```
 */
export declare const syncNetworkState: (networkId: string, localState: NetworkState, config: StateSyncConfig) => Promise<NetworkState>;
/**
 * Detects state drift between local and remote network states.
 *
 * @param {NetworkState} localState - Local state
 * @param {NetworkState} remoteState - Remote state
 * @returns {{ hasDrift: boolean; differences: string[]; severity: string }} Drift analysis
 *
 * @example
 * ```typescript
 * const drift = detectStateDrift(localState, remoteState);
 * if (drift.hasDrift) {
 *   console.log('Drift detected:', drift.differences);
 *   console.log('Severity:', drift.severity);
 * }
 * ```
 */
export declare const detectStateDrift: (localState: NetworkState, remoteState: NetworkState) => {
    hasDrift: boolean;
    differences: string[];
    severity: string;
};
/**
 * Reconciles conflicting network states using defined strategy.
 *
 * @param {NetworkState[]} states - Array of conflicting states
 * @param {string} strategy - Reconciliation strategy
 * @returns {NetworkState} Reconciled state
 *
 * @example
 * ```typescript
 * const reconciledState = reconcileState(
 *   [localState, remoteState1, remoteState2],
 *   'highest-version'
 * );
 * ```
 */
export declare const reconcileState: (states: NetworkState[], strategy: string) => NetworkState;
/**
 * Broadcasts state change to all registered nodes.
 *
 * @param {string} networkId - Network identifier
 * @param {NetworkState} state - State to broadcast
 * @param {string[]} targetNodes - Target node addresses
 * @returns {Promise<{ success: number; failed: number }>} Broadcast results
 *
 * @example
 * ```typescript
 * const result = await broadcastStateChange('net-12345', newState, [
 *   'node1.example.com',
 *   'node2.example.com'
 * ]);
 * console.log(`Broadcast: ${result.success} succeeded, ${result.failed} failed`);
 * ```
 */
export declare const broadcastStateChange: (networkId: string, state: NetworkState, targetNodes: string[]) => Promise<{
    success: number;
    failed: number;
}>;
/**
 * Merges multiple network states into a single consistent state.
 *
 * @param {NetworkState[]} states - States to merge
 * @returns {NetworkState} Merged state
 *
 * @example
 * ```typescript
 * const mergedState = mergeStates([state1, state2, state3]);
 * ```
 */
export declare const mergeStates: (states: NetworkState[]) => NetworkState;
/**
 * Creates a state observer with filtering and priority.
 *
 * @param {string} id - Observer identifier
 * @param {string} networkId - Network identifier
 * @param {Function} callback - Callback function
 * @param {Function} [filter] - Optional filter function
 * @param {number} [priority=0] - Observer priority
 * @returns {StateObserver} Observer configuration
 *
 * @example
 * ```typescript
 * const observer = createStateObserver(
 *   'critical-monitor',
 *   'net-12345',
 *   (state) => handleCriticalStateChange(state),
 *   (state) => state.state === 'error',
 *   100
 * );
 * ```
 */
export declare const createStateObserver: (id: string, networkId: string, callback: (state: NetworkState) => void, filter?: (state: NetworkState) => boolean, priority?: number) => StateObserver;
/**
 * Attaches observer to state store.
 *
 * @param {StateStore} store - State store instance
 * @param {StateObserver} observer - Observer to attach
 *
 * @example
 * ```typescript
 * const observer = createStateObserver('obs-1', 'net-12345', handleStateChange);
 * attachObserver(store, observer);
 * ```
 */
export declare const attachObserver: (store: StateStore, observer: StateObserver) => void;
/**
 * Detaches observer from state store.
 *
 * @param {StateStore} store - State store instance
 * @param {string} networkId - Network identifier
 * @param {string} observerId - Observer identifier
 *
 * @example
 * ```typescript
 * detachObserver(store, 'net-12345', 'obs-1');
 * ```
 */
export declare const detachObserver: (store: StateStore, networkId: string, observerId: string) => void;
/**
 * Notifies all observers for a network of state change.
 *
 * @param {StateStore} store - State store instance
 * @param {string} networkId - Network identifier
 * @param {NetworkState} state - New state
 *
 * @example
 * ```typescript
 * notifyObservers(store, 'net-12345', newState);
 * ```
 */
export declare const notifyObservers: (store: StateStore, networkId: string, state: NetworkState) => void;
/**
 * Filters observers based on criteria.
 *
 * @param {StateStore} store - State store instance
 * @param {string} networkId - Network identifier
 * @param {Function} predicate - Filter predicate
 * @returns {StateObserver[]} Filtered observers
 *
 * @example
 * ```typescript
 * const highPriorityObservers = filterObservers(
 *   store,
 *   'net-12345',
 *   (obs) => obs.priority > 50
 * );
 * ```
 */
export declare const filterObservers: (store: StateStore, networkId: string, predicate: (observer: StateObserver) => boolean) => StateObserver[];
/**
 * Creates a network event emitter instance.
 *
 * @returns {EventEmitter} Event emitter instance
 *
 * @example
 * ```typescript
 * const emitter = createEventEmitter();
 * ```
 */
export declare const createEventEmitter: () => EventEmitter;
/**
 * Emits a network event to all listeners.
 *
 * @param {string} eventType - Event type
 * @param {NetworkEvent} event - Event data
 *
 * @example
 * ```typescript
 * emitNetworkEvent('state-change', {
 *   type: 'state-change',
 *   networkId: 'net-12345',
 *   timestamp: new Date(),
 *   data: { from: 'provisioning', to: 'active' },
 *   source: 'orchestrator'
 * });
 * ```
 */
export declare const emitNetworkEvent: (eventType: string, event: NetworkEvent) => void;
/**
 * Registers event listener for network events.
 *
 * @param {string} eventType - Event type to listen for
 * @param {Function} handler - Event handler function
 *
 * @example
 * ```typescript
 * onNetworkEvent('state-change', (event) => {
 *   console.log('State changed:', event.data);
 * });
 * ```
 */
export declare const onNetworkEvent: (eventType: string, handler: (event: NetworkEvent) => void) => void;
/**
 * Removes event listener for network events.
 *
 * @param {string} eventType - Event type
 * @param {Function} handler - Event handler function
 *
 * @example
 * ```typescript
 * offNetworkEvent('state-change', myHandler);
 * ```
 */
export declare const offNetworkEvent: (eventType: string, handler: (event: NetworkEvent) => void) => void;
/**
 * Registers one-time event listener for network events.
 *
 * @param {string} eventType - Event type
 * @param {Function} handler - Event handler function
 *
 * @example
 * ```typescript
 * onceNetworkEvent('network-ready', (event) => {
 *   console.log('Network is ready:', event.networkId);
 * });
 * ```
 */
export declare const onceNetworkEvent: (eventType: string, handler: (event: NetworkEvent) => void) => void;
/**
 * Executes network state transition with validation.
 *
 * @param {StateStore} store - State store instance
 * @param {string} networkId - Network identifier
 * @param {string} toState - Target state
 * @param {string} triggeredBy - User/service triggering transition
 * @returns {Promise<NetworkState>} New state after transition
 *
 * @example
 * ```typescript
 * const newState = await transitionState(
 *   store,
 *   'net-12345',
 *   'active',
 *   'admin@example.com'
 * );
 * ```
 */
export declare const transitionState: (store: StateStore, networkId: string, toState: string, triggeredBy: string) => Promise<NetworkState>;
/**
 * Validates if state transition is allowed.
 *
 * @param {string} fromState - Current state
 * @param {string} toState - Target state
 * @returns {TransitionValidation} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTransition('provisioning', 'active');
 * if (!validation.valid) {
 *   console.error('Invalid transition:', validation.message);
 * }
 * ```
 */
export declare const validateTransition: (fromState: string, toState: string) => TransitionValidation;
/**
 * Retrieves state transition history for a network.
 *
 * @param {StateStore} store - State store instance
 * @param {string} networkId - Network identifier
 * @param {number} [limit=10] - Maximum number of transitions to return
 * @returns {StateTransition[]} Transition history
 *
 * @example
 * ```typescript
 * const history = getTransitionHistory(store, 'net-12345', 20);
 * history.forEach(trans => {
 *   console.log(`${trans.fromState} -> ${trans.toState} by ${trans.triggeredBy}`);
 * });
 * ```
 */
export declare const getTransitionHistory: (store: StateStore, networkId: string, limit?: number) => StateTransition[];
/**
 * Rolls back network state to previous state.
 *
 * @param {StateStore} store - State store instance
 * @param {string} networkId - Network identifier
 * @param {string} triggeredBy - User/service triggering rollback
 * @returns {Promise<NetworkState>} Rolled back state
 *
 * @example
 * ```typescript
 * const previousState = await rollbackTransition(
 *   store,
 *   'net-12345',
 *   'admin@example.com'
 * );
 * ```
 */
export declare const rollbackTransition: (store: StateStore, networkId: string, triggeredBy: string) => Promise<NetworkState>;
/**
 * Schedules future state transition.
 *
 * @param {StateStore} store - State store instance
 * @param {string} networkId - Network identifier
 * @param {string} toState - Target state
 * @param {Date} scheduledTime - When to execute transition
 * @param {string} triggeredBy - User/service scheduling transition
 * @returns {NodeJS.Timeout} Timeout handle
 *
 * @example
 * ```typescript
 * const scheduledTime = new Date(Date.now() + 3600000); // 1 hour from now
 * const timeout = scheduleTransition(
 *   store,
 *   'net-12345',
 *   'maintenance',
 *   scheduledTime,
 *   'scheduler-service'
 * );
 * ```
 */
export declare const scheduleTransition: (store: StateStore, networkId: string, toState: string, scheduledTime: Date, triggeredBy: string) => NodeJS.Timeout;
/**
 * Validates complete network state against schema.
 *
 * @param {NetworkState} state - State to validate
 * @param {StateValidationRule[]} rules - Validation rules
 * @returns {StateValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateNetworkState(state, [
 *   { field: 'networkId', type: 'string', required: true },
 *   { field: 'state', type: 'string', required: true },
 *   { field: 'version', type: 'number', required: true }
 * ]);
 * ```
 */
export declare const validateNetworkState: (state: NetworkState, rules: StateValidationRule[]) => StateValidationResult;
/**
 * Validates state data against JSON schema.
 *
 * @param {Record<string, any>} data - State data to validate
 * @param {any} schema - JSON schema
 * @returns {StateValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const schema = {
 *   vlanId: { type: 'number', min: 1, max: 4094 },
 *   subnet: { type: 'string', pattern: /^\d+\.\d+\.\d+\.\d+\/\d+$/ }
 * };
 * const result = validateStateSchema(state.data, schema);
 * ```
 */
export declare const validateStateSchema: (data: Record<string, any>, schema: any) => StateValidationResult;
/**
 * Checks network state consistency across multiple attributes.
 *
 * @param {NetworkState} state - State to check
 * @returns {{ consistent: boolean; issues: string[] }} Consistency check result
 *
 * @example
 * ```typescript
 * const check = checkStateConsistency(state);
 * if (!check.consistent) {
 *   console.error('Consistency issues:', check.issues);
 * }
 * ```
 */
export declare const checkStateConsistency: (state: NetworkState) => {
    consistent: boolean;
    issues: string[];
};
/**
 * Validates state against business rules.
 *
 * @param {NetworkState} state - State to validate
 * @param {Array<(state: NetworkState) => { valid: boolean; message?: string }>} rules - Business rules
 * @returns {StateValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const rules = [
 *   (state) => ({
 *     valid: state.data.bandwidth !== undefined,
 *     message: 'Bandwidth must be specified'
 *   }),
 *   (state) => ({
 *     valid: state.version > 0,
 *     message: 'Version must be positive'
 *   })
 * ];
 * const result = validateStateRules(state, rules);
 * ```
 */
export declare const validateStateRules: (state: NetworkState, rules: Array<(state: NetworkState) => {
    valid: boolean;
    message?: string;
}>) => StateValidationResult;
/**
 * Retrieves all validation errors for a network state.
 *
 * @param {NetworkState} state - State to validate
 * @param {StateValidationRule[]} rules - Validation rules
 * @returns {string[]} Array of error messages
 *
 * @example
 * ```typescript
 * const errors = getStateErrors(state, validationRules);
 * if (errors.length > 0) {
 *   console.error('Validation errors:', errors);
 * }
 * ```
 */
export declare const getStateErrors: (state: NetworkState, rules: StateValidationRule[]) => string[];
/**
 * Persists network state to database.
 *
 * @param {NetworkState} state - State to persist
 * @param {any} NetworkStateModel - Sequelize model
 * @returns {Promise<any>} Persisted state record
 *
 * @example
 * ```typescript
 * const record = await persistNetworkState(state, NetworkStateModel);
 * console.log('State persisted with ID:', record.id);
 * ```
 */
export declare const persistNetworkState: (state: NetworkState, NetworkStateModel: any) => Promise<any>;
/**
 * Loads network state from database.
 *
 * @param {string} networkId - Network identifier
 * @param {any} NetworkStateModel - Sequelize model
 * @returns {Promise<NetworkState | null>} Loaded state or null
 *
 * @example
 * ```typescript
 * const state = await loadNetworkState('net-12345', NetworkStateModel);
 * if (state) {
 *   console.log('Loaded state:', state);
 * }
 * ```
 */
export declare const loadNetworkState: (networkId: string, NetworkStateModel: any) => Promise<NetworkState | null>;
/**
 * Archives old network state to snapshot storage.
 *
 * @param {string} networkId - Network identifier
 * @param {string} label - Archive label
 * @param {any} NetworkStateModel - State model
 * @param {any} SnapshotModel - Snapshot model
 * @param {number} [retentionDays=30] - Retention period
 * @returns {Promise<any>} Snapshot record
 *
 * @example
 * ```typescript
 * const snapshot = await archiveState(
 *   'net-12345',
 *   'pre-upgrade-backup',
 *   NetworkStateModel,
 *   SnapshotModel,
 *   90
 * );
 * ```
 */
export declare const archiveState: (networkId: string, label: string, NetworkStateModel: any, SnapshotModel: any, retentionDays?: number) => Promise<any>;
/**
 * Purges expired state snapshots from database.
 *
 * @param {any} SnapshotModel - Snapshot model
 * @returns {Promise<number>} Number of deleted snapshots
 *
 * @example
 * ```typescript
 * const deleted = await purgeOldStates(SnapshotModel);
 * console.log(`Purged ${deleted} expired snapshots`);
 * ```
 */
export declare const purgeOldStates: (SnapshotModel: any) => Promise<number>;
/**
 * Recovers network state from latest snapshot.
 *
 * @param {string} networkId - Network identifier
 * @param {any} SnapshotModel - Snapshot model
 * @param {any} NetworkStateModel - State model
 * @returns {Promise<NetworkState>} Recovered state
 *
 * @example
 * ```typescript
 * const recoveredState = await recoverNetworkState(
 *   'net-12345',
 *   SnapshotModel,
 *   NetworkStateModel
 * );
 * ```
 */
export declare const recoverNetworkState: (networkId: string, SnapshotModel: any, NetworkStateModel: any) => Promise<NetworkState>;
/**
 * Creates checkpoint of current network state.
 *
 * @param {string} networkId - Network identifier
 * @param {string} label - Checkpoint label
 * @param {any} NetworkStateModel - State model
 * @param {any} SnapshotModel - Snapshot model
 * @returns {Promise<StateCheckpoint>} Created checkpoint
 *
 * @example
 * ```typescript
 * const checkpoint = await createStateCheckpoint(
 *   'net-12345',
 *   'before-maintenance',
 *   NetworkStateModel,
 *   SnapshotModel
 * );
 * ```
 */
export declare const createStateCheckpoint: (networkId: string, label: string, NetworkStateModel: any, SnapshotModel: any) => Promise<StateCheckpoint>;
/**
 * Restores network state from specific checkpoint.
 *
 * @param {string} checkpointId - Checkpoint identifier
 * @param {any} SnapshotModel - Snapshot model
 * @param {any} NetworkStateModel - State model
 * @returns {Promise<NetworkState>} Restored state
 *
 * @example
 * ```typescript
 * const restoredState = await restoreFromCheckpoint(
 *   'checkpoint-123',
 *   SnapshotModel,
 *   NetworkStateModel
 * );
 * ```
 */
export declare const restoreFromCheckpoint: (checkpointId: string, SnapshotModel: any, NetworkStateModel: any) => Promise<NetworkState>;
declare const _default: {
    createNetworkStateModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            networkId: string;
            state: string;
            version: number;
            data: Record<string, any>;
            metadata: Record<string, any>;
            previousState: string | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createNetworkStateTransitionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            networkId: string;
            fromState: string;
            toState: string;
            triggeredBy: string;
            success: boolean;
            errorMessage: string | null;
            duration: number | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    createNetworkStateSnapshotModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            networkId: string;
            snapshotLabel: string;
            state: string;
            stateData: Record<string, any>;
            metadata: Record<string, any>;
            retentionDays: number;
            expiresAt: Date;
            readonly createdAt: Date;
        };
    };
    createStateStore: () => StateStore;
    getState: (store: StateStore, networkId: string) => NetworkState | null;
    setState: (store: StateStore, networkId: string, stateUpdate: Partial<NetworkState>) => NetworkState;
    subscribeToState: (store: StateStore, networkId: string, observer: StateObserver) => void;
    unsubscribeFromState: (store: StateStore, networkId: string, observerId: string) => void;
    syncNetworkState: (networkId: string, localState: NetworkState, config: StateSyncConfig) => Promise<NetworkState>;
    detectStateDrift: (localState: NetworkState, remoteState: NetworkState) => {
        hasDrift: boolean;
        differences: string[];
        severity: string;
    };
    reconcileState: (states: NetworkState[], strategy: string) => NetworkState;
    broadcastStateChange: (networkId: string, state: NetworkState, targetNodes: string[]) => Promise<{
        success: number;
        failed: number;
    }>;
    mergeStates: (states: NetworkState[]) => NetworkState;
    createStateObserver: (id: string, networkId: string, callback: (state: NetworkState) => void, filter?: (state: NetworkState) => boolean, priority?: number) => StateObserver;
    attachObserver: (store: StateStore, observer: StateObserver) => void;
    detachObserver: (store: StateStore, networkId: string, observerId: string) => void;
    notifyObservers: (store: StateStore, networkId: string, state: NetworkState) => void;
    filterObservers: (store: StateStore, networkId: string, predicate: (observer: StateObserver) => boolean) => StateObserver[];
    createEventEmitter: () => EventEmitter;
    emitNetworkEvent: (eventType: string, event: NetworkEvent) => void;
    onNetworkEvent: (eventType: string, handler: (event: NetworkEvent) => void) => void;
    offNetworkEvent: (eventType: string, handler: (event: NetworkEvent) => void) => void;
    onceNetworkEvent: (eventType: string, handler: (event: NetworkEvent) => void) => void;
    transitionState: (store: StateStore, networkId: string, toState: string, triggeredBy: string) => Promise<NetworkState>;
    validateTransition: (fromState: string, toState: string) => TransitionValidation;
    getTransitionHistory: (store: StateStore, networkId: string, limit?: number) => StateTransition[];
    rollbackTransition: (store: StateStore, networkId: string, triggeredBy: string) => Promise<NetworkState>;
    scheduleTransition: (store: StateStore, networkId: string, toState: string, scheduledTime: Date, triggeredBy: string) => NodeJS.Timeout;
    validateNetworkState: (state: NetworkState, rules: StateValidationRule[]) => StateValidationResult;
    validateStateSchema: (data: Record<string, any>, schema: any) => StateValidationResult;
    checkStateConsistency: (state: NetworkState) => {
        consistent: boolean;
        issues: string[];
    };
    validateStateRules: (state: NetworkState, rules: Array<(state: NetworkState) => {
        valid: boolean;
        message?: string;
    }>) => StateValidationResult;
    getStateErrors: (state: NetworkState, rules: StateValidationRule[]) => string[];
    persistNetworkState: (state: NetworkState, NetworkStateModel: any) => Promise<any>;
    loadNetworkState: (networkId: string, NetworkStateModel: any) => Promise<NetworkState | null>;
    archiveState: (networkId: string, label: string, NetworkStateModel: any, SnapshotModel: any, retentionDays?: number) => Promise<any>;
    purgeOldStates: (SnapshotModel: any) => Promise<number>;
    recoverNetworkState: (networkId: string, SnapshotModel: any, NetworkStateModel: any) => Promise<NetworkState>;
    createStateCheckpoint: (networkId: string, label: string, NetworkStateModel: any, SnapshotModel: any) => Promise<StateCheckpoint>;
    restoreFromCheckpoint: (checkpointId: string, SnapshotModel: any, NetworkStateModel: any) => Promise<NetworkState>;
};
export default _default;
//# sourceMappingURL=network-state-management-kit.d.ts.map