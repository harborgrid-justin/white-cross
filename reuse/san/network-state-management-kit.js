"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreFromCheckpoint = exports.createStateCheckpoint = exports.recoverNetworkState = exports.purgeOldStates = exports.archiveState = exports.loadNetworkState = exports.persistNetworkState = exports.getStateErrors = exports.validateStateRules = exports.checkStateConsistency = exports.validateStateSchema = exports.validateNetworkState = exports.scheduleTransition = exports.rollbackTransition = exports.getTransitionHistory = exports.validateTransition = exports.transitionState = exports.onceNetworkEvent = exports.offNetworkEvent = exports.onNetworkEvent = exports.emitNetworkEvent = exports.createEventEmitter = exports.filterObservers = exports.notifyObservers = exports.detachObserver = exports.attachObserver = exports.createStateObserver = exports.mergeStates = exports.broadcastStateChange = exports.reconcileState = exports.detectStateDrift = exports.syncNetworkState = exports.unsubscribeFromState = exports.subscribeToState = exports.setState = exports.getState = exports.createStateStore = exports.createNetworkStateSnapshotModel = exports.createNetworkStateTransitionModel = exports.createNetworkStateModel = void 0;
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
const sequelize_1 = require("sequelize");
const events_1 = require("events");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
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
const createNetworkStateModel = (sequelize) => {
    class NetworkStateModel extends sequelize_1.Model {
    }
    NetworkStateModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        networkId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Unique network identifier',
        },
        state: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Current network state (active, inactive, provisioning, error, etc.)',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'State version for optimistic locking',
        },
        data: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Network state data including configuration and runtime info',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata for state management',
        },
        previousState: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Previous state for transition tracking',
        },
    }, {
        sequelize,
        tableName: 'network_states',
        timestamps: true,
        indexes: [
            { fields: ['networkId'], unique: true },
            { fields: ['state'] },
            { fields: ['version'] },
        ],
    });
    return NetworkStateModel;
};
exports.createNetworkStateModel = createNetworkStateModel;
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
const createNetworkStateTransitionModel = (sequelize) => {
    class NetworkStateTransitionModel extends sequelize_1.Model {
    }
    NetworkStateTransitionModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        networkId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Network identifier',
        },
        fromState: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Source state',
        },
        toState: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Target state',
        },
        triggeredBy: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'User or service that triggered the transition',
        },
        success: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether transition succeeded',
        },
        errorMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Error message if transition failed',
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Transition duration in milliseconds',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional transition metadata',
        },
    }, {
        sequelize,
        tableName: 'network_state_transitions',
        timestamps: true,
        indexes: [
            { fields: ['networkId'] },
            { fields: ['fromState', 'toState'] },
            { fields: ['createdAt'] },
        ],
    });
    return NetworkStateTransitionModel;
};
exports.createNetworkStateTransitionModel = createNetworkStateTransitionModel;
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
const createNetworkStateSnapshotModel = (sequelize) => {
    class NetworkStateSnapshotModel extends sequelize_1.Model {
    }
    NetworkStateSnapshotModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        networkId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Network identifier',
        },
        snapshotLabel: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Human-readable snapshot label',
        },
        state: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Network state at snapshot time',
        },
        stateData: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Complete state data snapshot',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Snapshot metadata',
        },
        retentionDays: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30,
            comment: 'Snapshot retention period in days',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Snapshot expiration timestamp',
        },
    }, {
        sequelize,
        tableName: 'network_state_snapshots',
        timestamps: true,
        indexes: [
            { fields: ['networkId'] },
            { fields: ['snapshotLabel'] },
            { fields: ['expiresAt'] },
        ],
    });
    return NetworkStateSnapshotModel;
};
exports.createNetworkStateSnapshotModel = createNetworkStateSnapshotModel;
// ============================================================================
// STATE STORE PATTERNS (4-8)
// ============================================================================
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
const createStateStore = () => {
    return {
        states: new Map(),
        observers: new Map(),
        history: [],
    };
};
exports.createStateStore = createStateStore;
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
const getState = (store, networkId) => {
    return store.states.get(networkId) || null;
};
exports.getState = getState;
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
const setState = (store, networkId, stateUpdate) => {
    const currentState = store.states.get(networkId);
    const newVersion = currentState ? currentState.version + 1 : 1;
    const updatedState = {
        networkId,
        state: stateUpdate.state || currentState?.state || 'unknown',
        version: newVersion,
        timestamp: new Date(),
        data: { ...currentState?.data, ...stateUpdate.data },
        metadata: { ...currentState?.metadata, ...stateUpdate.metadata },
    };
    store.states.set(networkId, updatedState);
    // Notify observers
    const observers = store.observers.get(networkId) || [];
    observers
        .filter(obs => !obs.filter || obs.filter(updatedState))
        .sort((a, b) => b.priority - a.priority)
        .forEach(obs => {
        try {
            obs.callback(updatedState);
        }
        catch (error) {
            console.error(`Observer ${obs.id} error:`, error);
        }
    });
    return updatedState;
};
exports.setState = setState;
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
const subscribeToState = (store, networkId, observer) => {
    const observers = store.observers.get(networkId) || [];
    observers.push(observer);
    store.observers.set(networkId, observers);
};
exports.subscribeToState = subscribeToState;
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
const unsubscribeFromState = (store, networkId, observerId) => {
    const observers = store.observers.get(networkId) || [];
    const filtered = observers.filter(obs => obs.id !== observerId);
    store.observers.set(networkId, filtered);
};
exports.unsubscribeFromState = unsubscribeFromState;
// ============================================================================
// STATE SYNCHRONIZATION (9-13)
// ============================================================================
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
const syncNetworkState = async (networkId, localState, config) => {
    const remoteStates = [];
    // Fetch state from all sync nodes
    for (const node of config.syncNodes) {
        try {
            // In production, this would make actual HTTP/gRPC calls
            const response = await fetch(`http://${node}/api/network-state/${networkId}`);
            if (response.ok) {
                const remoteState = await response.json();
                remoteStates.push(remoteState);
            }
        }
        catch (error) {
            console.error(`Failed to sync with node ${node}:`, error);
        }
    }
    // Resolve conflicts based on strategy
    let syncedState = localState;
    if (remoteStates.length > 0) {
        switch (config.conflictResolution) {
            case 'last-write-wins':
                syncedState = [localState, ...remoteStates].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
                break;
            case 'merge':
                syncedState = remoteStates.reduce((merged, remote) => ({
                    ...merged,
                    data: { ...merged.data, ...remote.data },
                    version: Math.max(merged.version, remote.version),
                }), localState);
                break;
            case 'manual':
                // Return local state and flag for manual resolution
                syncedState = {
                    ...localState,
                    metadata: {
                        ...localState.metadata,
                        conflictDetected: true,
                        conflictingStates: remoteStates.length,
                    },
                };
                break;
        }
    }
    return syncedState;
};
exports.syncNetworkState = syncNetworkState;
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
const detectStateDrift = (localState, remoteState) => {
    const differences = [];
    if (localState.state !== remoteState.state) {
        differences.push(`State mismatch: local=${localState.state}, remote=${remoteState.state}`);
    }
    if (localState.version !== remoteState.version) {
        differences.push(`Version mismatch: local=${localState.version}, remote=${remoteState.version}`);
    }
    // Deep compare data objects
    const localKeys = Object.keys(localState.data);
    const remoteKeys = Object.keys(remoteState.data);
    const allKeys = new Set([...localKeys, ...remoteKeys]);
    allKeys.forEach(key => {
        const localValue = JSON.stringify(localState.data[key]);
        const remoteValue = JSON.stringify(remoteState.data[key]);
        if (localValue !== remoteValue) {
            differences.push(`Data.${key}: local=${localValue}, remote=${remoteValue}`);
        }
    });
    const severity = differences.length === 0 ? 'none' : differences.length < 3 ? 'low' : differences.length < 6 ? 'medium' : 'high';
    return {
        hasDrift: differences.length > 0,
        differences,
        severity,
    };
};
exports.detectStateDrift = detectStateDrift;
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
const reconcileState = (states, strategy) => {
    if (states.length === 0) {
        throw new Error('Cannot reconcile empty state array');
    }
    if (states.length === 1) {
        return states[0];
    }
    switch (strategy) {
        case 'highest-version':
            return states.reduce((highest, current) => current.version > highest.version ? current : highest);
        case 'latest-timestamp':
            return states.reduce((latest, current) => current.timestamp.getTime() > latest.timestamp.getTime() ? current : latest);
        case 'merge-all':
            return states.reduce((merged, current) => ({
                ...current,
                data: { ...merged.data, ...current.data },
                version: Math.max(merged.version, current.version),
                timestamp: new Date(),
            }));
        default:
            return states[0];
    }
};
exports.reconcileState = reconcileState;
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
const broadcastStateChange = async (networkId, state, targetNodes) => {
    let success = 0;
    let failed = 0;
    const broadcasts = targetNodes.map(async (node) => {
        try {
            const response = await fetch(`http://${node}/api/network-state/${networkId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state),
            });
            if (response.ok) {
                success++;
            }
            else {
                failed++;
            }
        }
        catch (error) {
            failed++;
            console.error(`Failed to broadcast to ${node}:`, error);
        }
    });
    await Promise.allSettled(broadcasts);
    return { success, failed };
};
exports.broadcastStateChange = broadcastStateChange;
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
const mergeStates = (states) => {
    if (states.length === 0) {
        throw new Error('Cannot merge empty state array');
    }
    const baseState = states[0];
    const mergedData = states.reduce((acc, state) => ({ ...acc, ...state.data }), {});
    const mergedMetadata = states.reduce((acc, state) => ({ ...acc, ...state.metadata }), {});
    const maxVersion = Math.max(...states.map(s => s.version));
    return {
        networkId: baseState.networkId,
        state: states[states.length - 1].state, // Use latest state
        version: maxVersion + 1,
        timestamp: new Date(),
        data: mergedData,
        metadata: mergedMetadata,
    };
};
exports.mergeStates = mergeStates;
// ============================================================================
// STATE OBSERVERS (14-18)
// ============================================================================
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
const createStateObserver = (id, networkId, callback, filter, priority = 0) => {
    return {
        id,
        networkId,
        callback,
        filter,
        priority,
    };
};
exports.createStateObserver = createStateObserver;
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
const attachObserver = (store, observer) => {
    (0, exports.subscribeToState)(store, observer.networkId, observer);
};
exports.attachObserver = attachObserver;
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
const detachObserver = (store, networkId, observerId) => {
    (0, exports.unsubscribeFromState)(store, networkId, observerId);
};
exports.detachObserver = detachObserver;
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
const notifyObservers = (store, networkId, state) => {
    const observers = store.observers.get(networkId) || [];
    observers
        .filter(obs => !obs.filter || obs.filter(state))
        .sort((a, b) => b.priority - a.priority)
        .forEach(obs => {
        try {
            obs.callback(state);
        }
        catch (error) {
            console.error(`Observer ${obs.id} failed:`, error);
        }
    });
};
exports.notifyObservers = notifyObservers;
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
const filterObservers = (store, networkId, predicate) => {
    const observers = store.observers.get(networkId) || [];
    return observers.filter(predicate);
};
exports.filterObservers = filterObservers;
// ============================================================================
// EVENT EMITTERS (19-23)
// ============================================================================
const networkEventEmitter = new events_1.EventEmitter();
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
const createEventEmitter = () => {
    return new events_1.EventEmitter();
};
exports.createEventEmitter = createEventEmitter;
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
const emitNetworkEvent = (eventType, event) => {
    networkEventEmitter.emit(eventType, event);
    networkEventEmitter.emit('*', event); // Wildcard for all events
};
exports.emitNetworkEvent = emitNetworkEvent;
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
const onNetworkEvent = (eventType, handler) => {
    networkEventEmitter.on(eventType, handler);
};
exports.onNetworkEvent = onNetworkEvent;
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
const offNetworkEvent = (eventType, handler) => {
    networkEventEmitter.off(eventType, handler);
};
exports.offNetworkEvent = offNetworkEvent;
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
const onceNetworkEvent = (eventType, handler) => {
    networkEventEmitter.once(eventType, handler);
};
exports.onceNetworkEvent = onceNetworkEvent;
// ============================================================================
// STATE TRANSITIONS (24-28)
// ============================================================================
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
const transitionState = async (store, networkId, toState, triggeredBy) => {
    const currentState = (0, exports.getState)(store, networkId);
    const fromState = currentState?.state || 'unknown';
    const startTime = Date.now();
    try {
        // Validate transition
        const validation = (0, exports.validateTransition)(fromState, toState);
        if (!validation.valid) {
            throw new Error(validation.message || 'Invalid state transition');
        }
        // Perform transition
        const newState = (0, exports.setState)(store, networkId, { state: toState });
        // Record transition
        const transition = {
            id: `trans-${Date.now()}`,
            networkId,
            fromState,
            toState,
            triggeredBy,
            timestamp: new Date(),
            metadata: {
                duration: Date.now() - startTime,
                success: true,
            },
        };
        store.history.push(transition);
        // Emit event
        (0, exports.emitNetworkEvent)('state-transition', {
            type: 'state-transition',
            networkId,
            timestamp: new Date(),
            data: transition,
            source: triggeredBy,
        });
        return newState;
    }
    catch (error) {
        // Record failed transition
        const transition = {
            id: `trans-${Date.now()}`,
            networkId,
            fromState,
            toState,
            triggeredBy,
            timestamp: new Date(),
            metadata: {
                duration: Date.now() - startTime,
                success: false,
                error: error.message,
            },
        };
        store.history.push(transition);
        throw error;
    }
};
exports.transitionState = transitionState;
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
const validateTransition = (fromState, toState) => {
    const allowedTransitions = {
        provisioning: ['active', 'error', 'deleted'],
        active: ['inactive', 'maintenance', 'error', 'deleted'],
        inactive: ['active', 'deleted'],
        maintenance: ['active', 'error'],
        error: ['provisioning', 'deleted'],
        deleted: [],
    };
    const allowed = allowedTransitions[fromState];
    if (!allowed) {
        return {
            valid: false,
            message: `Unknown state: ${fromState}`,
        };
    }
    if (!allowed.includes(toState)) {
        return {
            valid: false,
            message: `Transition from ${fromState} to ${toState} is not allowed`,
            allowedTransitions: allowed,
        };
    }
    return { valid: true };
};
exports.validateTransition = validateTransition;
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
const getTransitionHistory = (store, networkId, limit = 10) => {
    return store.history
        .filter(t => t.networkId === networkId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);
};
exports.getTransitionHistory = getTransitionHistory;
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
const rollbackTransition = async (store, networkId, triggeredBy) => {
    const history = (0, exports.getTransitionHistory)(store, networkId, 2);
    if (history.length < 2) {
        throw new Error('Not enough history to rollback');
    }
    const previousTransition = history[1];
    return (0, exports.transitionState)(store, networkId, previousTransition.fromState, triggeredBy);
};
exports.rollbackTransition = rollbackTransition;
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
const scheduleTransition = (store, networkId, toState, scheduledTime, triggeredBy) => {
    const delay = scheduledTime.getTime() - Date.now();
    if (delay < 0) {
        throw new Error('Scheduled time must be in the future');
    }
    return setTimeout(async () => {
        try {
            await (0, exports.transitionState)(store, networkId, toState, triggeredBy);
        }
        catch (error) {
            console.error('Scheduled transition failed:', error);
        }
    }, delay);
};
exports.scheduleTransition = scheduleTransition;
// ============================================================================
// STATE VALIDATION (29-33)
// ============================================================================
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
const validateNetworkState = (state, rules) => {
    const errors = [];
    rules.forEach(rule => {
        const value = state[rule.field];
        // Required check
        if (rule.required && (value === undefined || value === null)) {
            errors.push({
                field: rule.field,
                message: rule.message || `${rule.field} is required`,
            });
            return;
        }
        if (value === undefined || value === null) {
            return;
        }
        // Type check
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== rule.type) {
            errors.push({
                field: rule.field,
                message: `${rule.field} must be of type ${rule.type}, got ${actualType}`,
                value,
            });
        }
        // Custom validator
        if (rule.validator && !rule.validator(value)) {
            errors.push({
                field: rule.field,
                message: rule.message || `${rule.field} failed validation`,
                value,
            });
        }
    });
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateNetworkState = validateNetworkState;
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
const validateStateSchema = (data, schema) => {
    const errors = [];
    Object.keys(schema).forEach(field => {
        const value = data[field];
        const fieldSchema = schema[field];
        if (fieldSchema.required && value === undefined) {
            errors.push({ field, message: `${field} is required` });
            return;
        }
        if (value !== undefined) {
            if (fieldSchema.type === 'number') {
                if (typeof value !== 'number') {
                    errors.push({ field, message: `${field} must be a number`, value });
                }
                else {
                    if (fieldSchema.min !== undefined && value < fieldSchema.min) {
                        errors.push({ field, message: `${field} must be >= ${fieldSchema.min}`, value });
                    }
                    if (fieldSchema.max !== undefined && value > fieldSchema.max) {
                        errors.push({ field, message: `${field} must be <= ${fieldSchema.max}`, value });
                    }
                }
            }
            if (fieldSchema.pattern && typeof value === 'string') {
                if (!fieldSchema.pattern.test(value)) {
                    errors.push({ field, message: `${field} has invalid format`, value });
                }
            }
        }
    });
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateStateSchema = validateStateSchema;
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
const checkStateConsistency = (state) => {
    const issues = [];
    // Check version is positive
    if (state.version < 1) {
        issues.push('Version must be positive');
    }
    // Check timestamp is not in future
    if (state.timestamp.getTime() > Date.now()) {
        issues.push('Timestamp cannot be in the future');
    }
    // Check networkId format
    if (!state.networkId || state.networkId.length === 0) {
        issues.push('Network ID cannot be empty');
    }
    // Check state is valid
    const validStates = ['provisioning', 'active', 'inactive', 'maintenance', 'error', 'deleted'];
    if (!validStates.includes(state.state)) {
        issues.push(`Invalid state: ${state.state}`);
    }
    // Check data and metadata are objects
    if (typeof state.data !== 'object' || state.data === null) {
        issues.push('State data must be an object');
    }
    if (typeof state.metadata !== 'object' || state.metadata === null) {
        issues.push('State metadata must be an object');
    }
    return {
        consistent: issues.length === 0,
        issues,
    };
};
exports.checkStateConsistency = checkStateConsistency;
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
const validateStateRules = (state, rules) => {
    const errors = [];
    rules.forEach((rule, index) => {
        const result = rule(state);
        if (!result.valid) {
            errors.push({
                field: `rule-${index}`,
                message: result.message || `Business rule ${index} failed`,
            });
        }
    });
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateStateRules = validateStateRules;
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
const getStateErrors = (state, rules) => {
    const validation = (0, exports.validateNetworkState)(state, rules);
    return validation.errors.map(err => `${err.field}: ${err.message}`);
};
exports.getStateErrors = getStateErrors;
// ============================================================================
// STATE PERSISTENCE (34-37)
// ============================================================================
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
const persistNetworkState = async (state, NetworkStateModel) => {
    const existing = await NetworkStateModel.findOne({
        where: { networkId: state.networkId },
    });
    if (existing) {
        return existing.update({
            state: state.state,
            version: state.version,
            data: state.data,
            metadata: state.metadata,
            previousState: existing.state,
        });
    }
    else {
        return NetworkStateModel.create({
            networkId: state.networkId,
            state: state.state,
            version: state.version,
            data: state.data,
            metadata: state.metadata,
        });
    }
};
exports.persistNetworkState = persistNetworkState;
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
const loadNetworkState = async (networkId, NetworkStateModel) => {
    const record = await NetworkStateModel.findOne({
        where: { networkId },
    });
    if (!record) {
        return null;
    }
    return {
        networkId: record.networkId,
        state: record.state,
        version: record.version,
        timestamp: record.updatedAt,
        data: record.data,
        metadata: record.metadata,
    };
};
exports.loadNetworkState = loadNetworkState;
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
const archiveState = async (networkId, label, NetworkStateModel, SnapshotModel, retentionDays = 30) => {
    const currentState = await NetworkStateModel.findOne({
        where: { networkId },
    });
    if (!currentState) {
        throw new Error(`Network state not found: ${networkId}`);
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + retentionDays);
    return SnapshotModel.create({
        networkId: currentState.networkId,
        snapshotLabel: label,
        state: currentState.state,
        stateData: {
            version: currentState.version,
            data: currentState.data,
            metadata: currentState.metadata,
        },
        retentionDays,
        expiresAt,
    });
};
exports.archiveState = archiveState;
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
const purgeOldStates = async (SnapshotModel) => {
    const result = await SnapshotModel.destroy({
        where: {
            expiresAt: {
                [sequelize_1.Op.lt]: new Date(),
            },
        },
    });
    return result;
};
exports.purgeOldStates = purgeOldStates;
// ============================================================================
// STATE RECOVERY (38-40)
// ============================================================================
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
const recoverNetworkState = async (networkId, SnapshotModel, NetworkStateModel) => {
    const snapshot = await SnapshotModel.findOne({
        where: { networkId },
        order: [['createdAt', 'DESC']],
    });
    if (!snapshot) {
        throw new Error(`No snapshot found for network: ${networkId}`);
    }
    const recoveredState = {
        networkId,
        state: snapshot.state,
        version: snapshot.stateData.version + 1,
        timestamp: new Date(),
        data: snapshot.stateData.data,
        metadata: {
            ...snapshot.stateData.metadata,
            recovered: true,
            recoveredFrom: snapshot.id,
            recoveredAt: new Date().toISOString(),
        },
    };
    await (0, exports.persistNetworkState)(recoveredState, NetworkStateModel);
    return recoveredState;
};
exports.recoverNetworkState = recoverNetworkState;
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
const createStateCheckpoint = async (networkId, label, NetworkStateModel, SnapshotModel) => {
    const currentState = await (0, exports.loadNetworkState)(networkId, NetworkStateModel);
    if (!currentState) {
        throw new Error(`Network state not found: ${networkId}`);
    }
    const snapshot = await (0, exports.archiveState)(networkId, label, NetworkStateModel, SnapshotModel, 90);
    return {
        id: snapshot.id.toString(),
        networkId,
        state: currentState,
        timestamp: new Date(),
        label,
    };
};
exports.createStateCheckpoint = createStateCheckpoint;
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
const restoreFromCheckpoint = async (checkpointId, SnapshotModel, NetworkStateModel) => {
    const snapshot = await SnapshotModel.findByPk(checkpointId);
    if (!snapshot) {
        throw new Error(`Checkpoint not found: ${checkpointId}`);
    }
    const restoredState = {
        networkId: snapshot.networkId,
        state: snapshot.state,
        version: snapshot.stateData.version + 1,
        timestamp: new Date(),
        data: snapshot.stateData.data,
        metadata: {
            ...snapshot.stateData.metadata,
            restored: true,
            restoredFrom: checkpointId,
            restoredAt: new Date().toISOString(),
        },
    };
    await (0, exports.persistNetworkState)(restoredState, NetworkStateModel);
    return restoredState;
};
exports.restoreFromCheckpoint = restoreFromCheckpoint;
exports.default = {
    // Sequelize Models
    createNetworkStateModel: exports.createNetworkStateModel,
    createNetworkStateTransitionModel: exports.createNetworkStateTransitionModel,
    createNetworkStateSnapshotModel: exports.createNetworkStateSnapshotModel,
    // State Store Patterns
    createStateStore: exports.createStateStore,
    getState: exports.getState,
    setState: exports.setState,
    subscribeToState: exports.subscribeToState,
    unsubscribeFromState: exports.unsubscribeFromState,
    // State Synchronization
    syncNetworkState: exports.syncNetworkState,
    detectStateDrift: exports.detectStateDrift,
    reconcileState: exports.reconcileState,
    broadcastStateChange: exports.broadcastStateChange,
    mergeStates: exports.mergeStates,
    // State Observers
    createStateObserver: exports.createStateObserver,
    attachObserver: exports.attachObserver,
    detachObserver: exports.detachObserver,
    notifyObservers: exports.notifyObservers,
    filterObservers: exports.filterObservers,
    // Event Emitters
    createEventEmitter: exports.createEventEmitter,
    emitNetworkEvent: exports.emitNetworkEvent,
    onNetworkEvent: exports.onNetworkEvent,
    offNetworkEvent: exports.offNetworkEvent,
    onceNetworkEvent: exports.onceNetworkEvent,
    // State Transitions
    transitionState: exports.transitionState,
    validateTransition: exports.validateTransition,
    getTransitionHistory: exports.getTransitionHistory,
    rollbackTransition: exports.rollbackTransition,
    scheduleTransition: exports.scheduleTransition,
    // State Validation
    validateNetworkState: exports.validateNetworkState,
    validateStateSchema: exports.validateStateSchema,
    checkStateConsistency: exports.checkStateConsistency,
    validateStateRules: exports.validateStateRules,
    getStateErrors: exports.getStateErrors,
    // State Persistence
    persistNetworkState: exports.persistNetworkState,
    loadNetworkState: exports.loadNetworkState,
    archiveState: exports.archiveState,
    purgeOldStates: exports.purgeOldStates,
    // State Recovery
    recoverNetworkState: exports.recoverNetworkState,
    createStateCheckpoint: exports.createStateCheckpoint,
    restoreFromCheckpoint: exports.restoreFromCheckpoint,
};
//# sourceMappingURL=network-state-management-kit.js.map