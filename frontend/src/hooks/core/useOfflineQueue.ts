/**
 * @fileoverview React Hook for Offline Queue Manager
 * @module hooks/useOfflineQueue
 *
 * Provides React integration for the offline queue manager.
 * Manages request queuing, syncing, and state updates in React components.
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const {
 *     enqueue,
 *     syncQueue,
 *     queueStats,
 *     isSyncing,
 *     pendingRequests
 *   } = useOfflineQueue();
 *
 *   const handleSubmit = async () => {
 *     await enqueue({
 *       method: 'POST',
 *       url: '/api/students',
 *       data: studentData,
 *       priority: 'high',
 *       timestamp: Date.now(),
 *       maxRetries: 3
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <p>Pending: {queueStats.total - queueStats.completed}</p>
 *       {isSyncing && <LoadingSpinner />}
 *     </div>
 *   );
 * }
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  offlineQueue,
  QueuedRequest,
  SyncProgress,
  SyncResult,
  RequestPriority,
  HttpMethod
} from '@/services/offline/OfflineQueueManager';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

/**
 * Options for enqueuing a request in the offline queue.
 *
 * @interface EnqueueOptions
 *
 * @property {HttpMethod} method - HTTP method for the request (GET, POST, PUT, PATCH, DELETE)
 * @property {string} url - API endpoint URL
 * @property {unknown} [data] - Optional request payload data
 * @property {Record<string, string>} [headers] - Optional custom headers
 * @property {RequestPriority} [priority] - Request priority level (defaults to 'normal')
 * @property {number} [maxRetries=3] - Maximum number of retry attempts
 * @property {object} [metadata] - Optional metadata for tracking and categorization
 * @property {string} [metadata.userId] - ID of user who initiated the request
 * @property {string} [metadata.studentId] - Related student ID if applicable
 * @property {string} [metadata.resourceType] - Type of resource being modified
 * @property {string} [metadata.action] - Action being performed
 */
export interface EnqueueOptions {
  method: HttpMethod;
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
  priority?: RequestPriority;
  maxRetries?: number;
  metadata?: {
    userId?: string;
    studentId?: string;
    resourceType?: string;
    action?: string;
  };
}

/**
 * Return type for useOfflineQueue hook.
 *
 * Provides offline queue management operations and state for handling API requests
 * that occur while offline or during poor connectivity.
 *
 * @interface UseOfflineQueueReturn
 *
 * @property {(options: EnqueueOptions) => Promise<string>} enqueue - Add request to offline queue, returns queue item ID
 * @property {() => Promise<SyncResult>} syncQueue - Process all pending requests in queue
 * @property {(id: string) => Promise<void>} retryRequest - Retry a specific failed request
 * @property {(id: string) => Promise<void>} cancelRequest - Cancel and remove a queued request
 * @property {() => Promise<number>} clearCompleted - Remove completed requests from queue, returns count cleared
 * @property {() => void} abortSync - Abort current sync operation
 * @property {QueuedRequest[]} pendingRequests - Array of all pending requests in queue
 * @property {SyncProgress} queueStats - Current queue statistics and progress
 * @property {boolean} isSyncing - Whether queue is currently syncing
 * @property {SyncResult | null} lastSyncResult - Result of most recent sync operation
 * @property {() => Promise<void>} refreshQueue - Manually refresh queue state from storage
 */
export interface UseOfflineQueueReturn {
  // Queue operations
  enqueue: (options: EnqueueOptions) => Promise<string>;
  syncQueue: () => Promise<SyncResult>;
  retryRequest: (id: string) => Promise<void>;
  cancelRequest: (id: string) => Promise<void>;
  clearCompleted: () => Promise<number>;
  abortSync: () => void;

  // State
  pendingRequests: QueuedRequest[];
  queueStats: SyncProgress;
  isSyncing: boolean;
  lastSyncResult: SyncResult | null;

  // Refresh
  refreshQueue: () => Promise<void>;
}

// ==========================================
// HOOK IMPLEMENTATION
// ==========================================

/**
 * Hook for managing offline request queue.
 *
 * Provides a React interface to the offline queue manager for handling API requests
 * during offline periods or poor connectivity. Automatically queues failed requests
 * and syncs them when connection is restored. Monitors queue state and provides
 * operations for manual queue management.
 *
 * @returns {UseOfflineQueueReturn} Offline queue operations and state
 *
 * @example
 * ```typescript
 * function StudentForm() {
 *   const {
 *     enqueue,
 *     syncQueue,
 *     pendingRequests,
 *     isSyncing,
 *     queueStats
 *   } = useOfflineQueue();
 *
 *   const handleSubmit = async (data: StudentData) => {
 *     try {
 *       // Try normal API request
 *       await api.createStudent(data);
 *     } catch (error) {
 *       // If offline, enqueue for later
 *       await enqueue({
 *         method: 'POST',
 *         url: '/api/students',
 *         data,
 *         priority: 'high',
 *         metadata: { resourceType: 'student', action: 'create' }
 *       });
 *       toast.info('Request queued for when you are back online');
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       {pendingRequests.length > 0 && (
 *         <Banner>
 *           {pendingRequests.length} requests pending
 *           <button onClick={syncQueue} disabled={isSyncing}>
 *             {isSyncing ? 'Syncing...' : 'Sync Now'}
 *           </button>
 *         </Banner>
 *       )}
 *       <Form onSubmit={handleSubmit} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Queue management interface
 * function QueueManager() {
 *   const {
 *     pendingRequests,
 *     retryRequest,
 *     cancelRequest,
 *     clearCompleted,
 *     queueStats
 *   } = useOfflineQueue();
 *
 *   return (
 *     <div>
 *       <h3>Offline Queue ({queueStats.total - queueStats.completed} pending)</h3>
 *       {pendingRequests.map(req => (
 *         <div key={req.id}>
 *           <span>{req.method} {req.url}</span>
 *           <button onClick={() => retryRequest(req.id)}>Retry</button>
 *           <button onClick={() => cancelRequest(req.id)}>Cancel</button>
 *         </div>
 *       ))}
 *       <button onClick={clearCompleted}>Clear Completed</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Automatically subscribes to queue events (enqueue, sync progress, completion)
 * - State updates trigger React re-renders
 * - Cleans up event listeners on unmount
 * - Queue persists in IndexedDB across sessions
 * - Requests are processed in priority order during sync
 * - Failed requests are automatically retried up to maxRetries limit
 * - Use with useConnectionMonitor for automatic sync when online
 *
 * @see {@link OfflineQueueManager} for underlying queue implementation
 * @see {@link useConnectionMonitor} for monitoring connectivity
 * @see {@link EnqueueOptions} for request configuration options
 */
export function useOfflineQueue(): UseOfflineQueueReturn {
  const [pendingRequests, setPendingRequests] = useState<QueuedRequest[]>([]);
  const [queueStats, setQueueStats] = useState<SyncProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    inProgress: false
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ==========================================
  // LOAD QUEUE DATA
  // ==========================================

  const loadQueueData = useCallback(async () => {
    try {
      const [pending, stats] = await Promise.all([
        offlineQueue.getPendingRequests(),
        offlineQueue.getQueueStats()
      ]);

      setPendingRequests(pending);
      setQueueStats(stats);
      setIsSyncing(stats.inProgress);
    } catch (error) {
      console.error('useOfflineQueue: Failed to load queue data', error);
    }
  }, []);

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  useEffect(() => {
    // Load initial data
    loadQueueData();

    // Subscribe to queue events
    const handleEnqueue = () => {
      loadQueueData();
    };

    const handleSyncStart = () => {
      setIsSyncing(true);
      loadQueueData();
    };

    const handleSyncProgress = (data: unknown) => {
      const progress = data as SyncProgress;
      setQueueStats(prev => ({
        ...prev,
        completed: progress.completed,
        failed: progress.failed
      }));
    };

    const handleSyncComplete = (data: unknown) => {
      const result = data as SyncResult;
      setIsSyncing(false);
      setLastSyncResult(result);
      loadQueueData();
    };

    const handleSyncError = () => {
      setIsSyncing(false);
      loadQueueData();
    };

    const handleRequestCompleted = () => {
      loadQueueData();
    };

    const handleRequestFailed = () => {
      loadQueueData();
    };

    offlineQueue.on('enqueue', handleEnqueue);
    offlineQueue.on('sync-start', handleSyncStart);
    offlineQueue.on('sync-progress', handleSyncProgress);
    offlineQueue.on('sync-complete', handleSyncComplete);
    offlineQueue.on('sync-error', handleSyncError);
    offlineQueue.on('request-completed', handleRequestCompleted);
    offlineQueue.on('request-failed', handleRequestFailed);

    // Cleanup
    return () => {
      offlineQueue.off('enqueue', handleEnqueue);
      offlineQueue.off('sync-start', handleSyncStart);
      offlineQueue.off('sync-progress', handleSyncProgress);
      offlineQueue.off('sync-complete', handleSyncComplete);
      offlineQueue.off('sync-error', handleSyncError);
      offlineQueue.off('request-completed', handleRequestCompleted);
      offlineQueue.off('request-failed', handleRequestFailed);

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [loadQueueData]);

  // ==========================================
  // OPERATIONS
  // ==========================================

  const enqueue = useCallback(async (options: EnqueueOptions): Promise<string> => {
    return await offlineQueue.enqueue({
      method: options.method,
      url: options.url,
      data: options.data,
      headers: options.headers,
      priority: options.priority || 'normal',
      timestamp: Date.now(),
      maxRetries: options.maxRetries || 3,
      metadata: options.metadata
    });
  }, []);

  const syncQueue = useCallback(async (): Promise<SyncResult> => {
    return await offlineQueue.syncQueue();
  }, []);

  const retryRequest = useCallback(async (id: string): Promise<void> => {
    await offlineQueue.retryRequest(id);
  }, []);

  const cancelRequest = useCallback(async (id: string): Promise<void> => {
    await offlineQueue.cancelRequest(id);
  }, []);

  const clearCompleted = useCallback(async (): Promise<number> => {
    return await offlineQueue.clearCompleted();
  }, []);

  const abortSync = useCallback((): void => {
    offlineQueue.abortSync();
  }, []);

  const refreshQueue = useCallback(async (): Promise<void> => {
    await loadQueueData();
  }, [loadQueueData]);

  // ==========================================
  // RETURN
  // ==========================================

  return {
    enqueue,
    syncQueue,
    retryRequest,
    cancelRequest,
    clearCompleted,
    abortSync,
    pendingRequests,
    queueStats,
    isSyncing,
    lastSyncResult,
    refreshQueue
  };
}

export default useOfflineQueue;
