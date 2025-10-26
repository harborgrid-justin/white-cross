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
} from '../services/offline/OfflineQueueManager';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

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
