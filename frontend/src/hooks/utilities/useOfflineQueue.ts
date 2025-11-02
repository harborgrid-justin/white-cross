/**
 * WF-COMP-288 | useOfflineQueue.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../api | Dependencies: react, @tanstack/react-query, ../api
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, interfaces | Key Features: useState, useEffect, useCallback
 * Last Updated: 2025-10-17 | File Type: .ts
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
import { administrationApi } from '@/services/api';
import type { AdministrationRecord, AdministrationLog } from '@/types/api';

// IndexedDB Configuration
const DB_NAME = 'medication-offline-queue';
const DB_VERSION = 1;
const STORE_NAME = 'administration-queue';

export interface QueuedAdministration extends AdministrationRecord {
  queueId?: string;
  timestamp: string;
  synced: boolean;
  syncAttempts: number;
  lastSyncError?: string;
}

// IndexedDB Wrapper
class OfflineQueueDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'queueId',
            autoIncrement: true,
          });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('synced', 'synced');
          store.createIndex('studentId', 'studentId');
          store.createIndex('medicationId', 'medicationId');
        }
      };
    });
  }

  async add(record: AdministrationRecord): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const queueItem: QueuedAdministration = {
        ...record,
        timestamp: new Date().toISOString(),
        synced: false,
        syncAttempts: 0,
      };

      const request = store.add(queueItem);

      request.onsuccess = () => {
        resolve(String(request.result));
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getPending(): Promise<QueuedAdministration[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('synced');
      const request = index.getAll(false);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markSynced(queueId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(queueId);

      request.onsuccess = () => {
        const record = request.result;
        if (record) {
          record.synced = true;
          const updateRequest = store.put(record);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async updateSyncAttempt(queueId: string, error: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(queueId);

      request.onsuccess = () => {
        const record = request.result;
        if (record) {
          record.syncAttempts += 1;
          record.lastSyncError = error;
          const updateRequest = store.put(record);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async remove(queueId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(queueId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Hook Return Type
export interface UseOfflineQueueReturn {
  pending: QueuedAdministration[];
  isOnline: boolean;
  addToQueue: (record: AdministrationRecord) => Promise<void>;
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

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      console.log('Connection restored. Syncing queued administrations...');

      // Auto-sync when connection restored
      try {
        await syncAll();
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
  }, []);

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

  // Add to queue
  const addToQueue = useCallback(
    async (record: AdministrationRecord): Promise<void> => {
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
    },
    [db]
  );

  // Sync all pending items
  const syncAll = useCallback(async (): Promise<void> => {
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
  }, [db]);

  // Sync single item
  const syncItem = useCallback(
    async (queueId: string): Promise<void> => {
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
    },
    [db, queryClient]
  );

  // Remove item from queue
  const removeItem = useCallback(
    async (queueId: string): Promise<void> => {
      await db.remove(queueId);

      // Refresh pending list
      const items = await db.getPending();
      setPending(items);
    },
    [db]
  );

  // Clear entire queue
  const clearQueue = useCallback(async (): Promise<void> => {
    await db.clear();
    setPending([]);
  }, [db]);

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
