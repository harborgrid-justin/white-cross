/**
 * @fileoverview Advanced State Management for Command & Control Systems
 *
 * This module provides a comprehensive state management solution for incident command systems,
 * implementing Redux-style patterns, Zustand-inspired simplicity, and real-time synchronization
 * capabilities. The architecture supports distributed state, optimistic updates, conflict resolution,
 * event sourcing, and time-travel debugging for mission-critical emergency response operations.
 *
 * **State Management Architecture:**
 * - Immutable state trees with structural sharing for performance
 * - Redux-style reducers with type-safe action creators
 * - Selector patterns with memoization for derived state
 * - Middleware support for async operations and side effects
 * - Event sourcing for complete audit trails and replay capability
 * - Optimistic updates with automatic rollback on conflict
 * - Multi-tab synchronization via BroadcastChannel API
 * - Snapshot isolation for time-travel debugging
 *
 * **Performance Optimizations:**
 * - Memoized selectors prevent unnecessary recomputations
 * - Structural sharing minimizes object allocation
 * - Batched state updates reduce render thrashing
 * - Lazy computation for expensive derived state
 * - Indexed lookups for O(1) entity access
 * - Delta compression for network synchronization
 * - LRU cache eviction for memory management
 *
 * **Consistency Guarantees:**
 * - ACID semantics for state transactions
 * - Optimistic concurrency control with vector clocks
 * - Last-write-wins with timestamp-based conflict resolution
 * - Causal consistency for distributed updates
 * - Idempotent operations for network resilience
 * - Snapshot isolation for consistent reads
 *
 * **Real-Time Synchronization:**
 * - WebSocket-based state replication
 * - Operational transformation for concurrent edits
 * - CRDT support for conflict-free merges
 * - Delta synchronization for bandwidth efficiency
 * - Presence awareness for collaborative editing
 * - Automatic reconnection with exponential backoff
 *
 * **Developer Experience:**
 * - Time-travel debugging with state snapshots
 * - Action replay for bug reproduction
 * - State diffing for change visualization
 * - DevTools integration for inspection
 * - TypeScript-first design with full type inference
 * - Hot module replacement support
 *
 * @module command-state-management
 * @category State Management
 * @since 1.0.0
 * @author State Management Architect
 */
import type { Incident, IncidentId, IncidentStatus, IncidentType, ResourceId, ResourceAllocation, ResourceStatus, ResourceType } from './incident-management-types';
/**
 * Root state structure for the entire application.
 * Uses normalized state pattern for efficient updates and queries.
 */
export interface RootState {
    readonly incidents: IncidentState;
    readonly resources: ResourceState;
    readonly ui: UIState;
    readonly sync: SyncState;
    readonly cache: CacheState;
    readonly history: HistoryState;
}
/**
 * Normalized incident state with indexed access.
 */
export interface IncidentState {
    readonly byId: Readonly<Record<string, Incident>>;
    readonly allIds: ReadonlyArray<string>;
    readonly byStatus: Readonly<Record<IncidentStatus, ReadonlyArray<string>>>;
    readonly byType: Readonly<Record<IncidentType, ReadonlyArray<string>>>;
    readonly activeIncidentId: string | null;
    readonly lastUpdated: number;
}
/**
 * Resource state with allocation tracking.
 */
export interface ResourceState {
    readonly byId: Readonly<Record<string, ResourceAllocation>>;
    readonly allIds: ReadonlyArray<string>;
    readonly byStatus: Readonly<Record<ResourceStatus, ReadonlyArray<string>>>;
    readonly byIncident: Readonly<Record<string, ReadonlyArray<string>>>;
    readonly availableCount: Record<ResourceType, number>;
    readonly lastUpdated: number;
}
/**
 * UI state for view-specific data.
 */
export interface UIState {
    readonly selectedIncidentId: string | null;
    readonly selectedResourceIds: ReadonlyArray<string>;
    readonly filters: StateFilters;
    readonly viewMode: 'list' | 'map' | 'timeline';
    readonly sidebarOpen: boolean;
    readonly modalStack: ReadonlyArray<ModalState>;
    readonly notifications: ReadonlyArray<Notification>;
    readonly loading: LoadingState;
}
/**
 * Synchronization state for real-time updates.
 */
export interface SyncState {
    readonly connected: boolean;
    readonly lastSyncTimestamp: number;
    readonly pendingOperations: ReadonlyArray<StateOperation>;
    readonly conflictQueue: ReadonlyArray<StateConflict>;
    readonly vectorClock: VectorClock;
    readonly clientId: string;
}
/**
 * Cache state for performance optimization.
 */
export interface CacheState {
    readonly entities: Readonly<Record<string, CacheEntry>>;
    readonly queryCache: Readonly<Record<string, QueryCacheEntry>>;
    readonly lruOrder: ReadonlyArray<string>;
    readonly maxSize: number;
    readonly currentSize: number;
}
/**
 * History state for undo/redo and time-travel.
 */
export interface HistoryState {
    readonly snapshots: ReadonlyArray<StateSnapshot>;
    readonly currentIndex: number;
    readonly maxSnapshots: number;
    readonly events: ReadonlyArray<StateEvent>;
}
/**
 * State filters for querying and display.
 */
export interface StateFilters {
    readonly statusFilter: ReadonlyArray<IncidentStatus>;
    readonly typeFilter: ReadonlyArray<IncidentType>;
    readonly priorityMin: number;
    readonly priorityMax: number;
    readonly timeRange: TimeRange | null;
    readonly searchQuery: string;
}
/**
 * Modal state for UI overlays.
 */
export interface ModalState {
    readonly id: string;
    readonly type: string;
    readonly props: Record<string, unknown>;
    readonly closable: boolean;
}
/**
 * Notification state for user alerts.
 */
export interface Notification {
    readonly id: string;
    readonly type: 'info' | 'warning' | 'error' | 'success';
    readonly message: string;
    readonly timestamp: number;
    readonly autoClose: boolean;
    readonly duration?: number;
}
/**
 * Loading state for async operations.
 */
export interface LoadingState {
    readonly global: boolean;
    readonly byOperation: Readonly<Record<string, boolean>>;
    readonly errors: Readonly<Record<string, Error>>;
}
/**
 * Time range for filtering.
 */
export interface TimeRange {
    readonly start: number;
    readonly end: number;
}
/**
 * Cache entry with expiration.
 */
export interface CacheEntry {
    readonly key: string;
    readonly value: unknown;
    readonly timestamp: number;
    readonly ttl: number;
    readonly accessCount: number;
}
/**
 * Query cache entry for memoization.
 */
export interface QueryCacheEntry {
    readonly query: string;
    readonly result: unknown;
    readonly timestamp: number;
    readonly dependencies: ReadonlyArray<string>;
}
/**
 * State snapshot for time-travel debugging.
 */
export interface StateSnapshot {
    readonly id: string;
    readonly state: Readonly<Partial<RootState>>;
    readonly timestamp: number;
    readonly description: string;
    readonly tags: ReadonlyArray<string>;
}
/**
 * State event for event sourcing.
 */
export interface StateEvent {
    readonly id: string;
    readonly type: string;
    readonly payload: unknown;
    readonly timestamp: number;
    readonly causationId?: string;
    readonly correlationId?: string;
    readonly metadata: EventMetadata;
}
/**
 * Event metadata for tracking.
 */
export interface EventMetadata {
    readonly userId?: string;
    readonly sessionId?: string;
    readonly source: 'user' | 'system' | 'sync';
    readonly version: number;
}
/**
 * State operation for optimistic updates.
 */
export interface StateOperation {
    readonly id: string;
    readonly type: string;
    readonly payload: unknown;
    readonly timestamp: number;
    readonly clientId: string;
    readonly status: 'pending' | 'committed' | 'rolled_back';
    readonly rollbackState?: Readonly<Partial<RootState>>;
}
/**
 * State conflict for resolution.
 */
export interface StateConflict {
    readonly id: string;
    readonly localOperation: StateOperation;
    readonly remoteOperation: StateOperation;
    readonly conflictType: 'concurrent_modification' | 'version_mismatch' | 'causality_violation';
    readonly detectedAt: number;
}
/**
 * Vector clock for distributed consistency.
 */
export interface VectorClock {
    readonly [clientId: string]: number;
}
/**
 * Action type for Redux-style state updates.
 */
export interface Action<TType extends string = string, TPayload = unknown> {
    readonly type: TType;
    readonly payload: TPayload;
    readonly meta?: ActionMeta;
}
/**
 * Action metadata for tracking.
 */
export interface ActionMeta {
    readonly timestamp: number;
    readonly source: 'user' | 'system' | 'sync';
    readonly correlationId?: string;
    readonly optimistic?: boolean;
}
/**
 * Reducer function type.
 */
export type Reducer<TState> = (state: TState, action: Action) => TState;
/**
 * Selector function type with memoization.
 */
export type Selector<TState, TResult> = (state: TState) => TResult;
/**
 * Middleware function type.
 */
export type Middleware = (action: Action, state: RootState, next: (action: Action) => void) => void;
/**
 * Result type for functional error handling without exceptions.
 */
export type Result<T, E = Error> = {
    readonly success: true;
    readonly value: T;
} | {
    readonly success: false;
    readonly error: E;
};
/**
 * Creates a successful Result.
 */
export declare const Ok: <T>(value: T) => Result<T, never>;
/**
 * Creates a failed Result.
 */
export declare const Err: <E>(error: E) => Result<never, E>;
/**
 * Adds an incident to the state immutably.
 *
 * **Complexity**: O(1) for incident addition, O(n) for index updates
 * **Pattern**: Immutable update with structural sharing
 *
 * @param state - Current incident state
 * @param incident - Incident to add
 * @returns New incident state with added incident
 *
 * @example
 * ```ts
 * const newState = addIncident(state, {
 *   id: 'INC-001' as IncidentId,
 *   type: 'FIRE',
 *   status: IncidentStatus.REPORTED,
 *   // ... other properties
 * });
 * ```
 */
export declare function addIncident(state: IncidentState, incident: Incident): IncidentState;
/**
 * Updates an incident in the state immutably.
 *
 * **Complexity**: O(1) for direct update, O(n) for index rebalancing if status/type changes
 * **Pattern**: Immutable update with optimized index maintenance
 *
 * @param state - Current incident state
 * @param incidentId - ID of incident to update
 * @param updates - Partial incident updates to apply
 * @returns New incident state with updated incident
 *
 * @example
 * ```ts
 * const updated = updateIncident(state, 'INC-001' as IncidentId, {
 *   status: IncidentStatus.DISPATCHED
 * });
 * ```
 */
export declare function updateIncident(state: IncidentState, incidentId: IncidentId, updates: Partial<Incident>): IncidentState;
/**
 * Removes an incident from the state immutably.
 *
 * **Complexity**: O(n) for index updates
 * **Pattern**: Immutable deletion with index maintenance
 *
 * @param state - Current incident state
 * @param incidentId - ID of incident to remove
 * @returns New incident state with removed incident
 */
export declare function removeIncident(state: IncidentState, incidentId: IncidentId): IncidentState;
/**
 * Batch updates multiple incidents efficiently.
 *
 * **Complexity**: O(n) where n is number of incidents to update
 * **Pattern**: Single-pass batch update with index rebalancing
 *
 * @param state - Current incident state
 * @param updates - Map of incident IDs to partial updates
 * @returns New incident state with all updates applied
 */
export declare function batchUpdateIncidents(state: IncidentState, updates: ReadonlyMap<IncidentId, Partial<Incident>>): IncidentState;
/**
 * Reindexes incident state for performance optimization.
 *
 * **Complexity**: O(n) where n is total number of incidents
 * **Pattern**: Complete index rebuild
 *
 * @param state - Current incident state
 * @returns New incident state with rebuilt indexes
 */
export declare function reindexIncidents(state: IncidentState): IncidentState;
/**
 * Adds a resource allocation to the state.
 *
 * **Complexity**: O(1)
 * **Pattern**: Immutable update with indexed allocation tracking
 *
 * @param state - Current resource state
 * @param allocation - Resource allocation to add
 * @returns New resource state with added allocation
 */
export declare function addResourceAllocation(state: ResourceState, allocation: ResourceAllocation): ResourceState;
/**
 * Updates resource allocation status.
 *
 * **Complexity**: O(1) for direct update, O(n) for index updates
 * **Pattern**: Immutable status transition with index maintenance
 *
 * @param state - Current resource state
 * @param resourceId - ID of resource to update
 * @param status - New resource status
 * @returns New resource state with updated status
 */
export declare function updateResourceStatus(state: ResourceState, resourceId: ResourceId, status: ResourceStatus): ResourceState;
/**
 * Gets available resources by type.
 *
 * **Complexity**: O(n) where n is number of resources
 * **Pattern**: Filtered selection with memoization opportunity
 *
 * @param state - Current resource state
 * @returns Map of resource types to available count
 */
export declare function getAvailableResourcesByType(state: ResourceState): ReadonlyMap<ResourceType, number>;
/**
 * Deallocates resources from an incident.
 *
 * **Complexity**: O(n) where n is number of resources for incident
 * **Pattern**: Bulk deallocation with index updates
 *
 * @param state - Current resource state
 * @param incidentId - Incident ID to deallocate from
 * @returns New resource state with deallocated resources
 */
export declare function deallocateResourcesFromIncident(state: ResourceState, incidentId: IncidentId): ResourceState;
/**
 * Sets the selected incident in UI state.
 *
 * **Complexity**: O(1)
 * **Pattern**: Simple immutable update
 *
 * @param state - Current UI state
 * @param incidentId - Incident ID to select (null to clear)
 * @returns New UI state with selection updated
 */
export declare function setSelectedIncident(state: UIState, incidentId: string | null): UIState;
/**
 * Toggles resource selection in UI state.
 *
 * **Complexity**: O(n) where n is number of selected resources
 * **Pattern**: Toggle pattern with immutable array update
 *
 * @param state - Current UI state
 * @param resourceId - Resource ID to toggle
 * @returns New UI state with toggled selection
 */
export declare function toggleResourceSelection(state: UIState, resourceId: string): UIState;
/**
 * Updates state filters immutably.
 *
 * **Complexity**: O(1)
 * **Pattern**: Partial filter update with defaults
 *
 * @param state - Current UI state
 * @param filters - Partial filter updates
 * @returns New UI state with updated filters
 */
export declare function updateFilters(state: UIState, filters: Partial<StateFilters>): UIState;
/**
 * Pushes a modal onto the modal stack.
 *
 * **Complexity**: O(1)
 * **Pattern**: Stack push with immutable array
 *
 * @param state - Current UI state
 * @param modal - Modal state to push
 * @returns New UI state with modal added
 */
export declare function pushModal(state: UIState, modal: ModalState): UIState;
/**
 * Pops the top modal from the modal stack.
 *
 * **Complexity**: O(n) where n is modal stack size
 * **Pattern**: Stack pop with immutable array
 *
 * @param state - Current UI state
 * @returns New UI state with top modal removed
 */
export declare function popModal(state: UIState): UIState;
/**
 * Adds a notification to UI state.
 *
 * **Complexity**: O(1)
 * **Pattern**: Notification queue with auto-expiry
 *
 * @param state - Current UI state
 * @param notification - Notification to add
 * @returns New UI state with notification added
 */
export declare function addNotification(state: UIState, notification: Notification): UIState;
/**
 * Removes a notification by ID.
 *
 * **Complexity**: O(n) where n is number of notifications
 * **Pattern**: Filter-based removal
 *
 * @param state - Current UI state
 * @param notificationId - ID of notification to remove
 * @returns New UI state with notification removed
 */
export declare function removeNotification(state: UIState, notificationId: string): UIState;
/**
 * Sets loading state for an operation.
 *
 * **Complexity**: O(1)
 * **Pattern**: Operation-specific loading tracking
 *
 * @param state - Current UI state
 * @param operation - Operation name
 * @param loading - Loading status
 * @returns New UI state with loading status updated
 */
export declare function setLoadingState(state: UIState, operation: string, loading: boolean): UIState;
/**
 * Applies an optimistic update to the state.
 *
 * **Complexity**: O(1) for operation recording + update complexity
 * **Pattern**: Optimistic concurrency control with rollback capability
 *
 * @param state - Current sync state
 * @param operation - State operation to apply optimistically
 * @returns New sync state with pending operation recorded
 *
 * @example
 * ```ts
 * const operation: StateOperation = {
 *   id: 'op-123',
 *   type: 'UPDATE_INCIDENT_STATUS',
 *   payload: { incidentId: 'INC-001', status: 'DISPATCHED' },
 *   timestamp: Date.now(),
 *   clientId: 'client-abc',
 *   status: 'pending',
 *   rollbackState: currentState
 * };
 * const newState = applyOptimisticUpdate(syncState, operation);
 * ```
 */
export declare function applyOptimisticUpdate(state: SyncState, operation: StateOperation): SyncState;
/**
 * Commits a pending optimistic update.
 *
 * **Complexity**: O(n) where n is number of pending operations
 * **Pattern**: Operation state transition with cleanup
 *
 * @param state - Current sync state
 * @param operationId - ID of operation to commit
 * @returns New sync state with operation committed
 */
export declare function commitOptimisticUpdate(state: SyncState, operationId: string): SyncState;
/**
 * Rolls back an optimistic update due to conflict or error.
 *
 * **Complexity**: O(n) for operation removal
 * **Pattern**: Rollback with state restoration from snapshot
 *
 * @param state - Current sync state
 * @param operationId - ID of operation to rollback
 * @returns New sync state with operation rolled back
 */
export declare function rollbackOptimisticUpdate(state: SyncState, operationId: string): SyncState;
/**
 * Clears all committed operations from pending queue.
 *
 * **Complexity**: O(n) where n is number of pending operations
 * **Pattern**: Garbage collection for confirmed operations
 *
 * @param state - Current sync state
 * @returns New sync state with committed operations removed
 */
export declare function clearCommittedOperations(state: SyncState): SyncState;
/**
 * Detects conflicts between local and remote operations.
 *
 * **Complexity**: O(n*m) where n is local ops and m is remote ops
 * **Pattern**: Causality-based conflict detection
 *
 * @param localOps - Local pending operations
 * @param remoteOps - Remote operations received
 * @returns Array of detected conflicts
 */
export declare function detectConflicts(localOps: ReadonlyArray<StateOperation>, remoteOps: ReadonlyArray<StateOperation>): ReadonlyArray<StateConflict>;
/**
 * Resolves a conflict using last-write-wins strategy.
 *
 * **Complexity**: O(1)
 * **Pattern**: Timestamp-based conflict resolution
 *
 * @param conflict - Conflict to resolve
 * @returns Winning operation
 */
export declare function resolveConflictLastWriteWins(conflict: StateConflict): StateOperation;
/**
 * Resolves a conflict using custom resolution strategy.
 *
 * **Complexity**: O(1) + resolution function complexity
 * **Pattern**: Pluggable conflict resolution
 *
 * @param conflict - Conflict to resolve
 * @param resolver - Custom resolution function
 * @returns Resolved operation
 */
export declare function resolveConflictCustom(conflict: StateConflict, resolver: (local: StateOperation, remote: StateOperation) => StateOperation): StateOperation;
/**
 * Merges non-conflicting operations using CRDT semantics.
 *
 * **Complexity**: O(n) where n is number of operations
 * **Pattern**: Conflict-free replicated data type merge
 *
 * @param operations - Operations to merge
 * @returns Merged operation or null if not mergeable
 */
export declare function mergeCRDT(operations: ReadonlyArray<StateOperation>): StateOperation | null;
/**
 * Adds an entry to the cache with LRU eviction.
 *
 * **Complexity**: O(1) amortized
 * **Pattern**: LRU cache with automatic eviction
 *
 * @param state - Current cache state
 * @param entry - Cache entry to add
 * @returns New cache state with entry added
 */
export declare function addCacheEntry(state: CacheState, entry: CacheEntry): CacheState;
/**
 * Evicts a cache entry by key.
 *
 * **Complexity**: O(n) where n is cache size
 * **Pattern**: Explicit eviction with index cleanup
 *
 * @param state - Current cache state
 * @param key - Cache key to evict
 * @returns New cache state with entry evicted
 */
export declare function evictCacheEntry(state: CacheState, key: string): CacheState;
/**
 * Gets a cache entry and updates LRU order.
 *
 * **Complexity**: O(n) where n is cache size
 * **Pattern**: LRU access tracking
 *
 * @param state - Current cache state
 * @param key - Cache key to retrieve
 * @returns Tuple of cache entry (if found) and updated state
 */
export declare function getCacheEntry(state: CacheState, key: string): readonly [CacheEntry | null, CacheState];
/**
 * Invalidates cache entries by dependency.
 *
 * **Complexity**: O(n) where n is number of cache entries
 * **Pattern**: Dependency-based cache invalidation
 *
 * @param state - Current cache state
 * @param dependency - Dependency key to invalidate
 * @returns New cache state with dependent entries removed
 */
export declare function invalidateCacheByDependency(state: CacheState, dependency: string): CacheState;
/**
 * Clears expired cache entries based on TTL.
 *
 * **Complexity**: O(n) where n is cache size
 * **Pattern**: TTL-based cache expiration
 *
 * @param state - Current cache state
 * @param currentTime - Current timestamp for expiration check
 * @returns New cache state with expired entries removed
 */
export declare function clearExpiredCache(state: CacheState, currentTime?: number): CacheState;
/**
 * Serializes state for persistence.
 *
 * **Complexity**: O(n) where n is state size
 * **Pattern**: JSON serialization with whitelist
 *
 * @param state - State to serialize
 * @param whitelist - Optional keys to include (all if not provided)
 * @returns Serialized state string
 */
export declare function serializeState(state: Partial<RootState>, whitelist?: ReadonlyArray<keyof RootState>): Result<string, Error>;
/**
 * Deserializes persisted state.
 *
 * **Complexity**: O(n) where n is serialized data size
 * **Pattern**: JSON deserialization with validation
 *
 * @param serialized - Serialized state string
 * @returns Deserialized state or error
 */
export declare function deserializeState(serialized: string): Result<Partial<RootState>, Error>;
/**
 * Saves state to localStorage.
 *
 * **Complexity**: O(n) where n is state size
 * **Pattern**: Browser storage persistence
 *
 * @param state - State to persist
 * @param key - Storage key
 * @returns Result indicating success or failure
 */
export declare function saveStateToLocalStorage(state: Partial<RootState>, key?: string): Result<void, Error>;
/**
 * Loads state from localStorage.
 *
 * **Complexity**: O(n) where n is stored state size
 * **Pattern**: Browser storage retrieval
 *
 * @param key - Storage key
 * @returns Loaded state or error
 */
export declare function loadStateFromLocalStorage(key?: string): Result<Partial<RootState>, Error>;
/**
 * Persists state to IndexedDB for larger datasets.
 *
 * **Complexity**: O(n) where n is state size
 * **Pattern**: Async storage for large state
 *
 * @param state - State to persist
 * @param dbName - Database name
 * @param storeName - Object store name
 * @returns Promise resolving to result
 */
export declare function persistStateToIndexedDB(state: Partial<RootState>, dbName?: string, storeName?: string): Promise<Result<void, Error>>;
/**
 * Loads state from IndexedDB.
 *
 * **Complexity**: O(n) where n is stored state size
 * **Pattern**: Async storage retrieval
 *
 * @param dbName - Database name
 * @param storeName - Object store name
 * @returns Promise resolving to loaded state
 */
export declare function loadStateFromIndexedDB(dbName?: string, storeName?: string): Promise<Result<Partial<RootState>, Error>>;
/**
 * Creates a state snapshot for undo/redo.
 *
 * **Complexity**: O(n) where n is state size (with structural sharing)
 * **Pattern**: Snapshot creation with metadata
 *
 * @param state - Current history state
 * @param snapshot - State snapshot to add
 * @returns New history state with snapshot added
 */
export declare function createSnapshot(state: HistoryState, snapshot: StateSnapshot): HistoryState;
/**
 * Performs undo operation.
 *
 * **Complexity**: O(1)
 * **Pattern**: Index-based time travel
 *
 * @param state - Current history state
 * @returns New history state with decremented index
 */
export declare function undo(state: HistoryState): HistoryState;
/**
 * Performs redo operation.
 *
 * **Complexity**: O(1)
 * **Pattern**: Index-based forward navigation
 *
 * @param state - Current history state
 * @returns New history state with incremented index
 */
export declare function redo(state: HistoryState): HistoryState;
/**
 * Gets the current snapshot from history.
 *
 * **Complexity**: O(1)
 * **Pattern**: Direct index access
 *
 * @param state - Current history state
 * @returns Current snapshot or null if none available
 */
export declare function getCurrentSnapshot(state: HistoryState): StateSnapshot | null;
/**
 * Clears all history snapshots.
 *
 * **Complexity**: O(1)
 * **Pattern**: History reset
 *
 * @param state - Current history state
 * @returns New history state with cleared snapshots
 */
export declare function clearHistory(state: HistoryState): HistoryState;
/**
 * Appends an event to the event log.
 *
 * **Complexity**: O(1)
 * **Pattern**: Append-only event log
 *
 * @param state - Current history state
 * @param event - State event to append
 * @returns New history state with event added
 */
export declare function appendEvent(state: HistoryState, event: StateEvent): HistoryState;
/**
 * Replays events to reconstruct state.
 *
 * **Complexity**: O(n*m) where n is events and m is reducer complexity
 * **Pattern**: Event sourcing with event replay
 *
 * @param events - Events to replay
 * @param initialState - Initial state to start from
 * @param reducer - Reducer function to apply events
 * @returns Reconstructed state
 */
export declare function replayEvents<TState>(events: ReadonlyArray<StateEvent>, initialState: TState, reducer: (state: TState, event: StateEvent) => TState): TState;
/**
 * Gets events by correlation ID for tracing.
 *
 * **Complexity**: O(n) where n is number of events
 * **Pattern**: Event filtering by correlation
 *
 * @param state - Current history state
 * @param correlationId - Correlation ID to filter by
 * @returns Filtered events
 */
export declare function getEventsByCorrelation(state: HistoryState, correlationId: string): ReadonlyArray<StateEvent>;
/**
 * Compacts event log by creating snapshot.
 *
 * **Complexity**: O(n) where n is number of events
 * **Pattern**: Event log compaction
 *
 * @param state - Current history state
 * @param beforeTimestamp - Compact events before this timestamp
 * @returns New history state with compacted events
 */
export declare function compactEventLog(state: HistoryState, beforeTimestamp: number): HistoryState;
/**
 * Updates vector clock for distributed consistency.
 *
 * **Complexity**: O(1)
 * **Pattern**: Vector clock increment
 *
 * @param clock - Current vector clock
 * @param clientId - Client ID to increment
 * @returns New vector clock
 */
export declare function incrementVectorClock(clock: VectorClock, clientId: string): VectorClock;
/**
 * Merges two vector clocks.
 *
 * **Complexity**: O(n) where n is number of clients
 * **Pattern**: Vector clock merge (max of all entries)
 *
 * @param clock1 - First vector clock
 * @param clock2 - Second vector clock
 * @returns Merged vector clock
 */
export declare function mergeVectorClocks(clock1: VectorClock, clock2: VectorClock): VectorClock;
/**
 * Compares vector clocks for causality.
 *
 * **Complexity**: O(n) where n is number of clients
 * **Pattern**: Vector clock comparison
 *
 * @param clock1 - First vector clock
 * @param clock2 - Second vector clock
 * @returns 'before' | 'after' | 'concurrent'
 */
export declare function compareVectorClocks(clock1: VectorClock, clock2: VectorClock): 'before' | 'after' | 'concurrent';
/**
 * Creates a state delta for efficient synchronization.
 *
 * **Complexity**: O(n) where n is state size
 * **Pattern**: Delta compression for sync
 *
 * @param oldState - Previous state
 * @param newState - Current state
 * @returns State delta representing changes
 */
export declare function createStateDelta(oldState: Partial<RootState>, newState: Partial<RootState>): Partial<RootState>;
/**
 * Applies a state delta to current state.
 *
 * **Complexity**: O(n) where n is delta size
 * **Pattern**: Delta application with merge
 *
 * @param state - Current state
 * @param delta - State delta to apply
 * @returns New state with delta applied
 */
export declare function applyStateDelta(state: Partial<RootState>, delta: Partial<RootState>): Partial<RootState>;
/**
 * Creates a memoized selector for performance.
 *
 * **Complexity**: O(1) for cache hit, O(n) for cache miss
 * **Pattern**: Memoization with equality check
 *
 * @param selector - Selector function to memoize
 * @param equalityFn - Optional custom equality function
 * @returns Memoized selector
 */
export declare function createMemoizedSelector<TState, TResult>(selector: Selector<TState, TResult>, equalityFn?: (a: TResult, b: TResult) => boolean): Selector<TState, TResult>;
/**
 * Selects active incidents from state.
 *
 * **Complexity**: O(n) where n is number of incidents
 * **Pattern**: Filtered selection
 *
 * @param state - Root state
 * @returns Array of active incidents
 */
export declare function selectActiveIncidents(state: RootState): ReadonlyArray<Incident>;
/**
 * Selects incidents by filter criteria.
 *
 * **Complexity**: O(n) where n is number of incidents
 * **Pattern**: Multi-criteria filtering
 *
 * @param state - Root state
 * @returns Filtered incidents
 */
export declare function selectFilteredIncidents(state: RootState): ReadonlyArray<Incident>;
//# sourceMappingURL=command-state-management.d.ts.map