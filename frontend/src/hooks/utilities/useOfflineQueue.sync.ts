/**
 * WF-COMP-288 | useOfflineQueue.sync.ts - Sync logic module
 * Purpose: Handles synchronization of offline queue items
 * Upstream: @/services/api | Dependencies: @tanstack/react-query, @/services/api
 * Downstream: useOfflineQueue.ts | Called by: offline queue hook
 * Related: useOfflineQueue.storage.ts
 * Exports: createSyncHandlers | Key Features: API sync, notifications, retry logic
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Item sync → API call → Success/error handling → Notification
 * LLM Context: Sync layer for offline queue, manages API sync and notifications
 */

import { QueryClient } from '@tanstack/react-query';
import { administrationApi } from '@/services/api';
import type { AdministrationRecord } from '@/types/api';
import { OfflineQueueDB, QueuedAdministration } from './useOfflineQueue.storage';

/**
 * Sync Handlers Configuration
 */
export interface SyncHandlers {
  syncAll: () => Promise<void>;
  syncItem: (queueId: string) => Promise<void>;
  addToQueue: (record: AdministrationRecord) => Promise<void>;
  removeItem: (queueId: string) => Promise<void>;
  clearQueue: () => Promise<void>;
}

/**
 * Create sync handlers for offline queue
 */
export function createSyncHandlers(
  db: OfflineQueueDB,
  queryClient: QueryClient,
  setPending: (items: QueuedAdministration[]) => void
): SyncHandlers {
  // Sync single item
  const syncItem = async (queueId: string): Promise<void> => {
    const items = await db.getPending();
    const item = items.find((i) => i.queueId === queueId);

    if (!item) {
      throw new Error('Item not found in queue');
    }

    try {
      // Send to server
      await administrationApi.recordAdministration(item);

      // Mark as synced
      await db.markSynced(queueId);

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['medication-administration'] });

      // Show success notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Medication Synced', {
          body: `${item.medicationId} for student ${item.studentId}`,
          icon: '/medication-icon.png',
        });
      }

      // Refresh pending list
      const remainingItems = await db.getPending();
      setPending(remainingItems);
    } catch (error: any) {
      // Update sync attempt
      await db.updateSyncAttempt(queueId, error.message);

      // If too many attempts, notify user
      if (item.syncAttempts >= 5) {
        console.error('Max sync attempts reached for item:', queueId);

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Sync Failed', {
            body: `Unable to sync medication administration after 5 attempts`,
            icon: '/error-icon.png',
          });
        }
      }

      throw error;
    }
  };

  // Sync all pending items
  const syncAll = async (): Promise<void> => {
    const items = await db.getPending();

    for (const item of items) {
      try {
        await syncItem(item.queueId!);
      } catch (error) {
        console.error(`Failed to sync item ${item.queueId}:`, error);
        // Continue with next item
      }
    }

    // Refresh pending list
    const remainingItems = await db.getPending();
    setPending(remainingItems);
  };

  // Add to queue
  const addToQueue = async (record: AdministrationRecord): Promise<void> => {
    try {
      const queueId = await db.add(record);
      console.log(`Administration queued for sync: ${queueId}`);

      // Refresh pending list
      const items = await db.getPending();
      setPending(items);

      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Medication Queued', {
          body: `Administration will be synced when connection is restored`,
          icon: '/medication-icon.png',
        });
      }
    } catch (error) {
      console.error('Failed to add to queue:', error);
      throw error;
    }
  };

  // Remove item from queue
  const removeItem = async (queueId: string): Promise<void> => {
    await db.remove(queueId);

    // Refresh pending list
    const items = await db.getPending();
    setPending(items);
  };

  // Clear entire queue
  const clearQueue = async (): Promise<void> => {
    await db.clear();
    setPending([]);
  };

  return {
    syncAll,
    syncItem,
    addToQueue,
    removeItem,
    clearQueue,
  };
}
