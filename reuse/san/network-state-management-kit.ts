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

import { Model, DataTypes, Sequelize, Op } from 'sequelize';
import { EventEmitter } from 'events';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export const createNetworkStateModel = (sequelize: Sequelize) => {
  class NetworkStateModel extends Model {
    public id!: number;
    public networkId!: string;
    public state!: string;
    public version!: number;
    public data!: Record<string, any>;
    public metadata!: Record<string, any>;
    public previousState!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  NetworkStateModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      networkId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Unique network identifier',
      },
      state: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Current network state (active, inactive, provisioning, error, etc.)',
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'State version for optimistic locking',
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Network state data including configuration and runtime info',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata for state management',
      },
      previousState: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Previous state for transition tracking',
      },
    },
    {
      sequelize,
      tableName: 'network_states',
      timestamps: true,
      indexes: [
        { fields: ['networkId'], unique: true },
        { fields: ['state'] },
        { fields: ['version'] },
      ],
    },
  );

  return NetworkStateModel;
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
export const createNetworkStateTransitionModel = (sequelize: Sequelize) => {
  class NetworkStateTransitionModel extends Model {
    public id!: number;
    public networkId!: string;
    public fromState!: string;
    public toState!: string;
    public triggeredBy!: string;
    public success!: boolean;
    public errorMessage!: string | null;
    public duration!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
  }

  NetworkStateTransitionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      networkId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Network identifier',
      },
      fromState: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Source state',
      },
      toState: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Target state',
      },
      triggeredBy: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'User or service that triggered the transition',
      },
      success: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether transition succeeded',
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Error message if transition failed',
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Transition duration in milliseconds',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional transition metadata',
      },
    },
    {
      sequelize,
      tableName: 'network_state_transitions',
      timestamps: true,
      indexes: [
        { fields: ['networkId'] },
        { fields: ['fromState', 'toState'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return NetworkStateTransitionModel;
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
export const createNetworkStateSnapshotModel = (sequelize: Sequelize) => {
  class NetworkStateSnapshotModel extends Model {
    public id!: number;
    public networkId!: string;
    public snapshotLabel!: string;
    public state!: string;
    public stateData!: Record<string, any>;
    public metadata!: Record<string, any>;
    public retentionDays!: number;
    public expiresAt!: Date;
    public readonly createdAt!: Date;
  }

  NetworkStateSnapshotModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      networkId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Network identifier',
      },
      snapshotLabel: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Human-readable snapshot label',
      },
      state: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Network state at snapshot time',
      },
      stateData: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Complete state data snapshot',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Snapshot metadata',
      },
      retentionDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
        comment: 'Snapshot retention period in days',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Snapshot expiration timestamp',
      },
    },
    {
      sequelize,
      tableName: 'network_state_snapshots',
      timestamps: true,
      indexes: [
        { fields: ['networkId'] },
        { fields: ['snapshotLabel'] },
        { fields: ['expiresAt'] },
      ],
    },
  );

  return NetworkStateSnapshotModel;
};

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
export const createStateStore = (): StateStore => {
  return {
    states: new Map<string, NetworkState>(),
    observers: new Map<string, StateObserver[]>(),
    history: [],
  };
};

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
export const getState = (store: StateStore, networkId: string): NetworkState | null => {
  return store.states.get(networkId) || null;
};

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
export const setState = (
  store: StateStore,
  networkId: string,
  stateUpdate: Partial<NetworkState>,
): NetworkState => {
  const currentState = store.states.get(networkId);
  const newVersion = currentState ? currentState.version + 1 : 1;

  const updatedState: NetworkState = {
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
      } catch (error) {
        console.error(`Observer ${obs.id} error:`, error);
      }
    });

  return updatedState;
};

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
export const subscribeToState = (
  store: StateStore,
  networkId: string,
  observer: StateObserver,
): void => {
  const observers = store.observers.get(networkId) || [];
  observers.push(observer);
  store.observers.set(networkId, observers);
};

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
export const unsubscribeFromState = (
  store: StateStore,
  networkId: string,
  observerId: string,
): void => {
  const observers = store.observers.get(networkId) || [];
  const filtered = observers.filter(obs => obs.id !== observerId);
  store.observers.set(networkId, filtered);
};

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
export const syncNetworkState = async (
  networkId: string,
  localState: NetworkState,
  config: StateSyncConfig,
): Promise<NetworkState> => {
  const remoteStates: NetworkState[] = [];

  // Fetch state from all sync nodes
  for (const node of config.syncNodes) {
    try {
      // In production, this would make actual HTTP/gRPC calls
      const response = await fetch(`http://${node}/api/network-state/${networkId}`);
      if (response.ok) {
        const remoteState = await response.json();
        remoteStates.push(remoteState);
      }
    } catch (error) {
      console.error(`Failed to sync with node ${node}:`, error);
    }
  }

  // Resolve conflicts based on strategy
  let syncedState = localState;

  if (remoteStates.length > 0) {
    switch (config.conflictResolution) {
      case 'last-write-wins':
        syncedState = [localState, ...remoteStates].sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
        )[0];
        break;

      case 'merge':
        syncedState = remoteStates.reduce(
          (merged, remote) => ({
            ...merged,
            data: { ...merged.data, ...remote.data },
            version: Math.max(merged.version, remote.version),
          }),
          localState,
        );
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
export const detectStateDrift = (
  localState: NetworkState,
  remoteState: NetworkState,
): { hasDrift: boolean; differences: string[]; severity: string } => {
  const differences: string[] = [];

  if (localState.state !== remoteState.state) {
    differences.push(`State mismatch: local=${localState.state}, remote=${remoteState.state}`);
  }

  if (localState.version !== remoteState.version) {
    differences.push(
      `Version mismatch: local=${localState.version}, remote=${remoteState.version}`,
    );
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

  const severity =
    differences.length === 0 ? 'none' : differences.length < 3 ? 'low' : differences.length < 6 ? 'medium' : 'high';

  return {
    hasDrift: differences.length > 0,
    differences,
    severity,
  };
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
export const reconcileState = (states: NetworkState[], strategy: string): NetworkState => {
  if (states.length === 0) {
    throw new Error('Cannot reconcile empty state array');
  }

  if (states.length === 1) {
    return states[0];
  }

  switch (strategy) {
    case 'highest-version':
      return states.reduce((highest, current) =>
        current.version > highest.version ? current : highest,
      );

    case 'latest-timestamp':
      return states.reduce((latest, current) =>
        current.timestamp.getTime() > latest.timestamp.getTime() ? current : latest,
      );

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
export const broadcastStateChange = async (
  networkId: string,
  state: NetworkState,
  targetNodes: string[],
): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;

  const broadcasts = targetNodes.map(async node => {
    try {
      const response = await fetch(`http://${node}/api/network-state/${networkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });

      if (response.ok) {
        success++;
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
      console.error(`Failed to broadcast to ${node}:`, error);
    }
  });

  await Promise.allSettled(broadcasts);

  return { success, failed };
};

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
export const mergeStates = (states: NetworkState[]): NetworkState => {
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
export const createStateObserver = (
  id: string,
  networkId: string,
  callback: (state: NetworkState) => void,
  filter?: (state: NetworkState) => boolean,
  priority: number = 0,
): StateObserver => {
  return {
    id,
    networkId,
    callback,
    filter,
    priority,
  };
};

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
export const attachObserver = (store: StateStore, observer: StateObserver): void => {
  subscribeToState(store, observer.networkId, observer);
};

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
export const detachObserver = (store: StateStore, networkId: string, observerId: string): void => {
  unsubscribeFromState(store, networkId, observerId);
};

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
export const notifyObservers = (
  store: StateStore,
  networkId: string,
  state: NetworkState,
): void => {
  const observers = store.observers.get(networkId) || [];

  observers
    .filter(obs => !obs.filter || obs.filter(state))
    .sort((a, b) => b.priority - a.priority)
    .forEach(obs => {
      try {
        obs.callback(state);
      } catch (error) {
        console.error(`Observer ${obs.id} failed:`, error);
      }
    });
};

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
export const filterObservers = (
  store: StateStore,
  networkId: string,
  predicate: (observer: StateObserver) => boolean,
): StateObserver[] => {
  const observers = store.observers.get(networkId) || [];
  return observers.filter(predicate);
};

// ============================================================================
// EVENT EMITTERS (19-23)
// ============================================================================

const networkEventEmitter = new EventEmitter();

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
export const createEventEmitter = (): EventEmitter => {
  return new EventEmitter();
};

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
export const emitNetworkEvent = (eventType: string, event: NetworkEvent): void => {
  networkEventEmitter.emit(eventType, event);
  networkEventEmitter.emit('*', event); // Wildcard for all events
};

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
export const onNetworkEvent = (eventType: string, handler: (event: NetworkEvent) => void): void => {
  networkEventEmitter.on(eventType, handler);
};

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
export const offNetworkEvent = (
  eventType: string,
  handler: (event: NetworkEvent) => void,
): void => {
  networkEventEmitter.off(eventType, handler);
};

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
export const onceNetworkEvent = (
  eventType: string,
  handler: (event: NetworkEvent) => void,
): void => {
  networkEventEmitter.once(eventType, handler);
};

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
export const transitionState = async (
  store: StateStore,
  networkId: string,
  toState: string,
  triggeredBy: string,
): Promise<NetworkState> => {
  const currentState = getState(store, networkId);
  const fromState = currentState?.state || 'unknown';

  const startTime = Date.now();

  try {
    // Validate transition
    const validation = validateTransition(fromState, toState);
    if (!validation.valid) {
      throw new Error(validation.message || 'Invalid state transition');
    }

    // Perform transition
    const newState = setState(store, networkId, { state: toState });

    // Record transition
    const transition: StateTransition = {
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
    emitNetworkEvent('state-transition', {
      type: 'state-transition',
      networkId,
      timestamp: new Date(),
      data: transition,
      source: triggeredBy,
    });

    return newState;
  } catch (error: any) {
    // Record failed transition
    const transition: StateTransition = {
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
export const validateTransition = (
  fromState: string,
  toState: string,
): TransitionValidation => {
  const allowedTransitions: Record<string, string[]> = {
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
export const getTransitionHistory = (
  store: StateStore,
  networkId: string,
  limit: number = 10,
): StateTransition[] => {
  return store.history
    .filter(t => t.networkId === networkId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};

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
export const rollbackTransition = async (
  store: StateStore,
  networkId: string,
  triggeredBy: string,
): Promise<NetworkState> => {
  const history = getTransitionHistory(store, networkId, 2);

  if (history.length < 2) {
    throw new Error('Not enough history to rollback');
  }

  const previousTransition = history[1];
  return transitionState(store, networkId, previousTransition.fromState, triggeredBy);
};

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
export const scheduleTransition = (
  store: StateStore,
  networkId: string,
  toState: string,
  scheduledTime: Date,
  triggeredBy: string,
): NodeJS.Timeout => {
  const delay = scheduledTime.getTime() - Date.now();

  if (delay < 0) {
    throw new Error('Scheduled time must be in the future');
  }

  return setTimeout(async () => {
    try {
      await transitionState(store, networkId, toState, triggeredBy);
    } catch (error) {
      console.error('Scheduled transition failed:', error);
    }
  }, delay);
};

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
export const validateNetworkState = (
  state: NetworkState,
  rules: StateValidationRule[],
): StateValidationResult => {
  const errors: StateValidationResult['errors'] = [];

  rules.forEach(rule => {
    const value = (state as any)[rule.field];

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
export const validateStateSchema = (
  data: Record<string, any>,
  schema: any,
): StateValidationResult => {
  const errors: StateValidationResult['errors'] = [];

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
        } else {
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
export const checkStateConsistency = (
  state: NetworkState,
): { consistent: boolean; issues: string[] } => {
  const issues: string[] = [];

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
export const validateStateRules = (
  state: NetworkState,
  rules: Array<(state: NetworkState) => { valid: boolean; message?: string }>,
): StateValidationResult => {
  const errors: StateValidationResult['errors'] = [];

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
export const getStateErrors = (state: NetworkState, rules: StateValidationRule[]): string[] => {
  const validation = validateNetworkState(state, rules);
  return validation.errors.map(err => `${err.field}: ${err.message}`);
};

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
export const persistNetworkState = async (state: NetworkState, NetworkStateModel: any): Promise<any> => {
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
  } else {
    return NetworkStateModel.create({
      networkId: state.networkId,
      state: state.state,
      version: state.version,
      data: state.data,
      metadata: state.metadata,
    });
  }
};

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
export const loadNetworkState = async (
  networkId: string,
  NetworkStateModel: any,
): Promise<NetworkState | null> => {
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
export const archiveState = async (
  networkId: string,
  label: string,
  NetworkStateModel: any,
  SnapshotModel: any,
  retentionDays: number = 30,
): Promise<any> => {
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
export const purgeOldStates = async (SnapshotModel: any): Promise<number> => {
  const result = await SnapshotModel.destroy({
    where: {
      expiresAt: {
        [Op.lt]: new Date(),
      },
    },
  });

  return result;
};

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
export const recoverNetworkState = async (
  networkId: string,
  SnapshotModel: any,
  NetworkStateModel: any,
): Promise<NetworkState> => {
  const snapshot = await SnapshotModel.findOne({
    where: { networkId },
    order: [['createdAt', 'DESC']],
  });

  if (!snapshot) {
    throw new Error(`No snapshot found for network: ${networkId}`);
  }

  const recoveredState: NetworkState = {
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

  await persistNetworkState(recoveredState, NetworkStateModel);

  return recoveredState;
};

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
export const createStateCheckpoint = async (
  networkId: string,
  label: string,
  NetworkStateModel: any,
  SnapshotModel: any,
): Promise<StateCheckpoint> => {
  const currentState = await loadNetworkState(networkId, NetworkStateModel);

  if (!currentState) {
    throw new Error(`Network state not found: ${networkId}`);
  }

  const snapshot = await archiveState(networkId, label, NetworkStateModel, SnapshotModel, 90);

  return {
    id: snapshot.id.toString(),
    networkId,
    state: currentState,
    timestamp: new Date(),
    label,
  };
};

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
export const restoreFromCheckpoint = async (
  checkpointId: string,
  SnapshotModel: any,
  NetworkStateModel: any,
): Promise<NetworkState> => {
  const snapshot = await SnapshotModel.findByPk(checkpointId);

  if (!snapshot) {
    throw new Error(`Checkpoint not found: ${checkpointId}`);
  }

  const restoredState: NetworkState = {
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

  await persistNetworkState(restoredState, NetworkStateModel);

  return restoredState;
};

export default {
  // Sequelize Models
  createNetworkStateModel,
  createNetworkStateTransitionModel,
  createNetworkStateSnapshotModel,

  // State Store Patterns
  createStateStore,
  getState,
  setState,
  subscribeToState,
  unsubscribeFromState,

  // State Synchronization
  syncNetworkState,
  detectStateDrift,
  reconcileState,
  broadcastStateChange,
  mergeStates,

  // State Observers
  createStateObserver,
  attachObserver,
  detachObserver,
  notifyObservers,
  filterObservers,

  // Event Emitters
  createEventEmitter,
  emitNetworkEvent,
  onNetworkEvent,
  offNetworkEvent,
  onceNetworkEvent,

  // State Transitions
  transitionState,
  validateTransition,
  getTransitionHistory,
  rollbackTransition,
  scheduleTransition,

  // State Validation
  validateNetworkState,
  validateStateSchema,
  checkStateConsistency,
  validateStateRules,
  getStateErrors,

  // State Persistence
  persistNetworkState,
  loadNetworkState,
  archiveState,
  purgeOldStates,

  // State Recovery
  recoverNetworkState,
  createStateCheckpoint,
  restoreFromCheckpoint,
};
