/**
 * WF-COMP-288 | useOfflineQueue.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../api | Dependencies: react, @tanstack/react-query, ../api
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, interfaces | Key Features: useState, useEffect, useCallback
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Offline Queue Hook
 *
 * Purpose: Manages offline medication administration queue using IndexedDB
 *
 * Features:
 * - Queue administrations when offline
 * - Auto-sync when connection restored
 * - Visual indicators for pending sync
 * - Conflict resolution
 */

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { OfflineQueueDB, QueuedAdministration } from './useOfflineQueue.storage';
import { createSyncHandlers } from './useOfflineQueue.sync';

// Re-export types from storage module
export type { QueuedAdministration } from './useOfflineQueue.storage';

// Hook Return Type
export interface UseOfflineQueueReturn {
  pending: QueuedAdministration[];
  isOnline: boolean;
  addToQueue: (record: any) => Promise<void>;
  syncAll: () => Promise<void>;
  syncItem: (queueId: string) => Promise<void>;
  removeItem: (queueId: string) => Promise<void>;
  clearQueue: () => Promise<void>;
  pendingCount: number;
}

/**
 * Offline Queue Hook
 */
export function useOfflineQueue(): UseOfflineQueueReturn {
  const queryClient = useQueryClient();
  const [db] = useState(() => new OfflineQueueDB());
  const [pending, setPending] = useState<QueuedAdministration[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Initialize database
  useEffect(() => {
    db.init().catch((error) => {
      console.error('Failed to initialize offline queue:', error);
    });
  }, [db]);

  // Create sync handlers
  const handlers = createSyncHandlers(db, queryClient, setPending);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      console.log('Connection restored. Syncing queued administrations...');

      // Auto-sync when connection restored
      try {
        await handlers.syncAll();
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.warn('You are offline. Administrations will be queued for sync.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handlers]);

  // Load pending items periodically
  useEffect(() => {
    const loadPending = async () => {
      try {
        const items = await db.getPending();
        setPending(items);
      } catch (error) {
        console.error('Failed to load pending items:', error);
      }
    };

    loadPending();

    // Refresh every 30 seconds
    const interval = setInterval(loadPending, 30000);

    return () => clearInterval(interval);
  }, [db]);

  // Wrap handlers with useCallback
  const addToQueue = useCallback(handlers.addToQueue, [handlers]);
  const syncAll = useCallback(handlers.syncAll, [handlers]);
  const syncItem = useCallback(handlers.syncItem, [handlers]);
  const removeItem = useCallback(handlers.removeItem, [handlers]);
  const clearQueue = useCallback(handlers.clearQueue, [handlers]);

  return {
    pending,
    isOnline,
    addToQueue,
    syncAll,
    syncItem,
    removeItem,
    clearQueue,
    pendingCount: pending.length,
  };
}
