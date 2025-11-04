/**
 * WF-COMP-288 | useOfflineQueue.storage.ts - IndexedDB storage module
 * Purpose: IndexedDB wrapper for offline queue storage
 * Upstream: None | Dependencies: @/types/api
 * Downstream: useOfflineQueue.ts | Called by: offline queue hook
 * Related: useOfflineQueue.sync.ts
 * Exports: OfflineQueueDB, QueuedAdministration | Key Features: IndexedDB operations
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Database init → CRUD operations → Queue management
 * LLM Context: Storage layer for offline queue, handles IndexedDB operations
 */

import type { AdministrationRecord } from '@/types/api';

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

/**
 * IndexedDB Wrapper for Offline Queue
 */
export class OfflineQueueDB {
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
