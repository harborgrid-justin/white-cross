/**
 * LOC: B438E091B6
 * WC-GEN-354 | MedicationQueue.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-354 | MedicationQueue.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../logger | Dependencies: events, ../logger, crypto
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Medication Administration Offline Queue
 *
 * Provides zero-loss persistence for medication administration when database is unavailable.
 * Implements local storage queue with automatic sync and idempotency.
 *
 * @see MEDICATION_RESILIENCE_ARCHITECTURE.md Section 5
 */

import { EventEmitter } from 'events';
import { logger } from '../logger';
import crypto from 'crypto';

// Browser API type declarations for environments where they exist
declare const indexedDB: any;
declare const window: any;
interface Navigator {
  onLine: boolean;
}
declare const navigator: Navigator;

export interface QueueRecord {
  id: string;
  idempotencyKey: string;
  operation: 'ADMINISTER' | 'ADVERSE_REACTION' | 'CONTROLLED_SUBSTANCE';
  payload: any;
  timestamp: number;
  attempts: number;
  lastAttemptTime: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'DLQ';
  errorLog: ErrorRecord[];
  nurseId: string;
  deviceId: string;
  offlineMode: boolean;
}

export interface ErrorRecord {
  timestamp: number;
  attempt: number;
  error: string;
  errorType: string;
  retryable: boolean;
}

export interface SyncResult {
  status: 'OFFLINE' | 'COMPLETED' | 'PARTIAL';
  synced: number;
  failed: number;
  errors?: any[];
}

/**
 * Abstract storage interface for different platforms
 */
export interface QueueStorage {
  initialize(): Promise<void>;
  add(record: QueueRecord): Promise<void>;
  update(id: string, updates: Partial<QueueRecord>): Promise<void>;
  get(id: string): Promise<QueueRecord | null>;
  getByStatus(status: QueueRecord['status'], limit?: number): Promise<QueueRecord[]>;
  getAll(): Promise<QueueRecord[]>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * IndexedDB storage implementation (for web/Electron)
 */
export class IndexedDBStorage implements QueueStorage {
  private db?: any; // IDBDatabase
  private readonly DB_NAME = 'medication_queue';
  private readonly STORE_NAME = 'pending_administrations';
  private readonly DB_VERSION = 1;

  async initialize(): Promise<void> {
    if (typeof indexedDB === 'undefined') {
      throw new Error('IndexedDB is not available in this environment');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: any) => {
        const db = (event.target as any).result;

        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('idempotencyKey', 'idempotencyKey', { unique: true });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('nurseId', 'nurseId', { unique: false });
        }
      };
    });
  }

  async add(record: QueueRecord): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.add(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async update(id: string, updates: Partial<QueueRecord>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise(async (resolve, reject) => {
      const existing = await this.get(id);
      if (!existing) {
        reject(new Error(`Record ${id} not found`));
        return;
      }

      const updated = { ...existing, ...updates };
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(updated);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get(id: string): Promise<QueueRecord | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getByStatus(status: QueueRecord['status'], limit: number = 100): Promise<QueueRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('status');
      const IDBKeyRange = (globalThis as any).IDBKeyRange;
      const request = index.openCursor(IDBKeyRange.only(status));
      const results: QueueRecord[] = [];

      request.onsuccess = (event: Event) => {
        const cursor = (event.target as any).result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getAll(): Promise<QueueRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * Medication Administration Queue Service
 */
export class MedicationQueue extends EventEmitter {
  private syncInterval?: NodeJS.Timeout;
  private isSyncing = false;

  constructor(
    private storage: QueueStorage,
    private syncService: MedicationSyncService,
    private config = {
      syncIntervalMs: 30000,
      batchSize: 10,
      concurrency: 3,
      maxQueueSize: 10000,
      dlqThreshold: 100,
    }
  ) {
    super();
  }

  /**
   * Initialize queue
   */
  async initialize(): Promise<void> {
    await this.storage.initialize();

    // Start periodic sync
    this.startPeriodicSync();

    // Listen for network status (only in browser environments)
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('online', () => this.onNetworkRestored());
      window.addEventListener('offline', () => this.onNetworkLost());
    }

    logger.info('Medication queue initialized');
  }

  /**
   * Enqueue medication administration
   */
  async enqueue(data: {
    operation: QueueRecord['operation'];
    payload: any;
    idempotencyKey: string;
    nurseId: string;
    deviceId: string;
  }): Promise<QueueRecord> {
    // Check queue size
    const allRecords = await this.storage.getAll();
    if (allRecords.length >= this.config.maxQueueSize) {
      throw new Error(`Queue full: ${allRecords.length} records`);
    }

    const record: QueueRecord = {
      id: this.generateId(),
      idempotencyKey: data.idempotencyKey,
      operation: data.operation,
      payload: data.payload,
      timestamp: Date.now(),
      attempts: 0,
      lastAttemptTime: 0,
      status: 'PENDING',
      errorLog: [],
      nurseId: data.nurseId,
      deviceId: data.deviceId,
      offlineMode: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    };

    await this.storage.add(record);

    logger.info('Medication administration queued', {
      id: record.id,
      idempotencyKey: record.idempotencyKey,
      operation: record.operation,
    });

    this.emit('enqueued', record);

    // Trigger immediate sync if online
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      setImmediate(() => this.syncQueue());
    }

    return record;
  }

  /**
   * Sync queue to server
   */
  async syncQueue(): Promise<SyncResult> {
    // Prevent concurrent syncs
    if (this.isSyncing) {
      return { status: 'COMPLETED', synced: 0, failed: 0 };
    }

    // Check network
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return { status: 'OFFLINE', synced: 0, failed: 0 };
    }

    this.isSyncing = true;
    logger.info('Starting queue sync');

    try {
      const pending = await this.storage.getByStatus('PENDING', this.config.batchSize);

      if (pending.length === 0) {
        return { status: 'COMPLETED', synced: 0, failed: 0 };
      }

      // Process in batches with concurrency limit
      const results = await this.processBatch(pending);

      const synced = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected');

      logger.info('Queue sync completed', {
        synced,
        failed: failed.length,
        total: pending.length,
      });

      this.emit('synced', { synced, failed: failed.length });

      return {
        status: failed.length > 0 ? 'PARTIAL' : 'COMPLETED',
        synced,
        failed: failed.length,
        errors: failed.map(r => (r as PromiseRejectedResult).reason),
      };

    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Process batch of records with concurrency control
   */
  private async processBatch(records: QueueRecord[]): Promise<PromiseSettledResult<void>[]> {
    const chunks: QueueRecord[][] = [];

    for (let i = 0; i < records.length; i += this.config.concurrency) {
      chunks.push(records.slice(i, i + this.config.concurrency));
    }

    const results: PromiseSettledResult<void>[] = [];

    for (const chunk of chunks) {
      const chunkResults = await Promise.allSettled(
        chunk.map(record => this.syncRecord(record))
      );
      results.push(...chunkResults);
    }

    return results;
  }

  /**
   * Sync individual record
   */
  private async syncRecord(record: QueueRecord): Promise<void> {
    try {
      // Mark as syncing
      await this.storage.update(record.id, {
        status: 'SYNCING',
        attempts: record.attempts + 1,
        lastAttemptTime: Date.now(),
      });

      // Check if already synced (idempotency)
      const exists = await this.syncService.checkIfSynced(record.idempotencyKey);
      if (exists) {
        logger.info('Record already synced', { id: record.id, idempotencyKey: record.idempotencyKey });
        await this.storage.delete(record.id);
        return;
      }

      // Sync to server
      await this.syncService.syncAdministration(record.payload, record.idempotencyKey);

      // Remove from queue
      await this.storage.delete(record.id);

      logger.info('Record synced successfully', {
        id: record.id,
        idempotencyKey: record.idempotencyKey,
        attempts: record.attempts + 1,
      });

      this.emit('recordSynced', record);

    } catch (error: any) {
      logger.error('Failed to sync record', {
        id: record.id,
        error: error.message,
        attempts: record.attempts + 1,
      });

      // Update error log
      const errorLog: ErrorRecord = {
        timestamp: Date.now(),
        attempt: record.attempts + 1,
        error: error.message,
        errorType: error.name,
        retryable: this.isRetryable(error),
      };

      // Check if should move to DLQ
      const shouldMoveToDLQ = record.attempts + 1 >= this.config.dlqThreshold;
      const updatedStatus: QueueRecord['status'] = shouldMoveToDLQ ? 'DLQ' : 'PENDING';

      const updatedRecord: Partial<QueueRecord> = {
        status: updatedStatus,
        attempts: record.attempts + 1,
        errorLog: [...record.errorLog, errorLog],
      };

      if (shouldMoveToDLQ) {
        await this.moveToDLQ(record);
      }

      await this.storage.update(record.id, updatedRecord);

      this.emit('syncError', { record, error });

      throw error;
    }
  }

  /**
   * Move record to Dead Letter Queue
   */
  private async moveToDLQ(record: QueueRecord): Promise<void> {
    logger.error('Moving record to DLQ', {
      id: record.id,
      idempotencyKey: record.idempotencyKey,
      attempts: record.attempts,
    });

    await this.storage.update(record.id, { status: 'DLQ' });

    // Alert immediately
    this.emit('dlq', {
      record,
      message: `Medication administration record moved to DLQ after ${record.attempts} attempts`,
    });
  }

  /**
   * Check if error is retryable
   */
  private isRetryable(error: any): boolean {
    const retryableErrors = [
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ECONNRESET',
      'PRISMA_CONNECTION_ERROR',
      'DATABASE_TIMEOUT',
      'NetworkError',
    ];

    return retryableErrors.some(type =>
      error.message?.includes(type) || error.name?.includes(type)
    );
  }

  /**
   * Start periodic sync
   */
  private startPeriodicSync(): void {
    this.syncInterval = setInterval(() => {
      this.syncQueue().catch(error => {
        logger.error('Periodic sync failed', error);
      });
    }, this.config.syncIntervalMs);
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
  }

  /**
   * Handle network restored
   */
  private onNetworkRestored(): void {
    logger.info('Network restored, triggering sync');
    this.emit('online');
    this.syncQueue();
  }

  /**
   * Handle network lost
   */
  private onNetworkLost(): void {
    logger.warn('Network lost, entering offline mode');
    this.emit('offline');
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<{
    total: number;
    pending: number;
    syncing: number;
    failed: number;
    dlq: number;
    oldestTimestamp?: number;
  }> {
    const all = await this.storage.getAll();
    const pending = all.filter(r => r.status === 'PENDING');
    const syncing = all.filter(r => r.status === 'SYNCING');
    const failed = all.filter(r => r.status === 'FAILED');
    const dlq = all.filter(r => r.status === 'DLQ');

    const oldestTimestamp = pending.length > 0
      ? Math.min(...pending.map(r => r.timestamp))
      : undefined;

    return {
      total: all.length,
      pending: pending.length,
      syncing: syncing.length,
      failed: failed.length,
      dlq: dlq.length,
      oldestTimestamp,
    };
  }

  /**
   * Get DLQ records for manual review
   */
  async getDLQRecords(): Promise<QueueRecord[]> {
    return this.storage.getByStatus('DLQ');
  }

  /**
   * Manually retry DLQ record
   */
  async retryDLQRecord(id: string): Promise<void> {
    const record = await this.storage.get(id);
    if (!record || record.status !== 'DLQ') {
      throw new Error(`Record ${id} not found in DLQ`);
    }

    await this.storage.update(id, {
      status: 'PENDING',
      attempts: 0,
      errorLog: [],
    });

    logger.info('DLQ record reset for retry', { id });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Shutdown queue
   */
  async shutdown(): Promise<void> {
    this.stopPeriodicSync();
    logger.info('Medication queue shutdown');
  }
}

/**
 * Sync service interface
 */
export interface MedicationSyncService {
  checkIfSynced(idempotencyKey: string): Promise<boolean>;
  syncAdministration(payload: any, idempotencyKey: string): Promise<any>;
}
