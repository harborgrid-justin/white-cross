/**
 * @fileoverview Cache Persistence Layer for IndexedDB-based non-PHI data storage
 * @module services/cache/persistence
 * @category Services
 * 
 * Provides IndexedDB-based persistence for non-PHI data with selective
 * persistence, automatic cleanup, and HIPAA-compliant data handling.
 * 
 * Key Features:
 * - Selective persistence (only non-PHI reference data)
 * - Automatic cleanup of stale data (24-hour max age)
 * - Version management for schema migrations
 * - Error handling with fallback to memory-only caching
 * - HIPAA compliance - never persists PHI data
 * 
 * @example
 * ```typescript
 * const manager = getPersistenceManager();
 * await manager.save('students', 'list', data, 3600000);
 * const cached = await manager.get('students', 'list');
 * ```
 */

import type { PersistedCacheEntry } from './types';
import {
  INDEXED_DB_CONFIG,
  canPersistEntity,
  getPersistedTTL
} from './cacheConfig';
import { QueryKeyFactory } from './QueryKeyFactory';

/**
 * IndexedDB Persistence Manager
 */
export class PersistenceManager {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;
  private isSupported = true;

  constructor() {
    this.initPromise = this.initialize();
  }

  /**
   * Initialize IndexedDB
   */
  private async initialize(): Promise<void> {
    // Check if IndexedDB is supported
    if (!window.indexedDB) {
      console.warn('[PersistenceManager] IndexedDB not supported');
      this.isSupported = false;
      return;
    }

    try {
      this.db = await this.openDatabase();
      console.log('[PersistenceManager] IndexedDB initialized successfully');

      // Clean up stale data on initialization
      await this.cleanupStaleData();
    } catch (error) {
      console.error('[PersistenceManager] Failed to initialize IndexedDB', error);
      this.isSupported = false;
    }
  }

  /**
   * Open IndexedDB Database
   *
   * @returns Promise resolving to IDBDatabase
   */
  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(
        INDEXED_DB_CONFIG.dbName,
        INDEXED_DB_CONFIG.version
      );

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        for (const storeConfig of INDEXED_DB_CONFIG.stores) {
          // Delete old store if exists
          if (db.objectStoreNames.contains(storeConfig.name)) {
            db.deleteObjectStore(storeConfig.name);
          }

          // Create new store
          const objectStore = db.createObjectStore(storeConfig.name, {
            keyPath: storeConfig.keyPath
          });

          // Create indexes
          for (const index of storeConfig.indexes) {
            objectStore.createIndex(index.name, index.keyPath, {
              unique: index.unique
            });
          }
        }
      };
    });
  }

  /**
   * Ensure Database is Ready
   */
  private async ensureReady(): Promise<boolean> {
    if (!this.isSupported) return false;

    if (this.initPromise) {
      await this.initPromise;
      this.initPromise = null;
    }

    return this.db !== null;
  }

  /**
   * Persist Cache Entry
   *
   * @param key - Cache key
   * @param data - Data to persist
   * @param options - Persistence options
   * @returns Whether persistence was successful
   */
  async persistEntry(
    key: string,
    data: unknown,
    options: {
      tags?: string[];
      version?: number;
    } = {}
  ): Promise<boolean> {
    const ready = await this.ensureReady();
    if (!ready) return false;

    try {
      // Extract entity from key
      const queryKey = QueryKeyFactory.fromString(key);
      const entity = QueryKeyFactory.getEntity(queryKey);

      // Check if entity can be persisted (HIPAA compliance)
      if (!canPersistEntity(entity)) {
        console.warn(
          `[PersistenceManager] Cannot persist PHI data: ${entity}`
        );
        return false;
      }

      const persistedTTL = getPersistedTTL(entity);
      if (!persistedTTL) {
        console.warn(
          `[PersistenceManager] No persisted TTL configured for: ${entity}`
        );
        return false;
      }

      const now = Date.now();
      const entry: PersistedCacheEntry = {
        key,
        data: JSON.stringify(data),
        timestamp: now,
        expiresAt: now + persistedTTL,
        tags: options.tags || [],
        version: options.version || 1
      };

      const transaction = this.db!.transaction(
        ['cache-entries'],
        'readwrite'
      );
      const store = transaction.objectStore('cache-entries');

      await new Promise<void>((resolve, reject) => {
        const request = store.put(entry);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log(`[PersistenceManager] Persisted entry: ${key}`);
      return true;
    } catch (error) {
      console.error(
        `[PersistenceManager] Failed to persist entry: ${key}`,
        error
      );
      return false;
    }
  }

  /**
   * Restore Cache Entry
   *
   * @param key - Cache key
   * @returns Restored data or undefined if not found/expired
   */
  async restoreEntry<T>(key: string): Promise<T | undefined> {
    const ready = await this.ensureReady();
    if (!ready) return undefined;

    try {
      const transaction = this.db!.transaction(['cache-entries'], 'readonly');
      const store = transaction.objectStore('cache-entries');

      const entry = await new Promise<PersistedCacheEntry | undefined>(
        (resolve, reject) => {
          const request = store.get(key);

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        }
      );

      if (!entry) {
        return undefined;
      }

      // Check if expired
      const now = Date.now();
      if (now > entry.expiresAt) {
        // Delete expired entry
        await this.deleteEntry(key);
        return undefined;
      }

      // Parse and return data
      const data = JSON.parse(entry.data) as T;
      console.log(`[PersistenceManager] Restored entry: ${key}`);
      return data;
    } catch (error) {
      console.error(
        `[PersistenceManager] Failed to restore entry: ${key}`,
        error
      );
      return undefined;
    }
  }

  /**
   * Delete Cache Entry
   *
   * @param key - Cache key
   * @returns Whether deletion was successful
   */
  async deleteEntry(key: string): Promise<boolean> {
    const ready = await this.ensureReady();
    if (!ready) return false;

    try {
      const transaction = this.db!.transaction(
        ['cache-entries'],
        'readwrite'
      );
      const store = transaction.objectStore('cache-entries');

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error(
        `[PersistenceManager] Failed to delete entry: ${key}`,
        error
      );
      return false;
    }
  }

  /**
   * Delete Entries by Tags
   *
   * @param tags - Tags to match
   * @returns Number of entries deleted
   */
  async deleteByTags(tags: string[]): Promise<number> {
    const ready = await this.ensureReady();
    if (!ready) return 0;

    try {
      const transaction = this.db!.transaction(
        ['cache-entries'],
        'readwrite'
      );
      const store = transaction.objectStore('cache-entries');

      const entries = await new Promise<PersistedCacheEntry[]>(
        (resolve, reject) => {
          const request = store.getAll();

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        }
      );

      let deletedCount = 0;

      for (const entry of entries) {
        if (tags.some((tag) => entry.tags.includes(tag))) {
          await this.deleteEntry(entry.key);
          deletedCount++;
        }
      }

      return deletedCount;
    } catch (error) {
      console.error(
        '[PersistenceManager] Failed to delete entries by tags',
        error
      );
      return 0;
    }
  }

  /**
   * Clean Up Stale Data
   *
   * Removes expired entries from IndexedDB
   *
   * @returns Number of entries cleaned up
   */
  async cleanupStaleData(): Promise<number> {
    const ready = await this.ensureReady();
    if (!ready) return 0;

    try {
      const transaction = this.db!.transaction(
        ['cache-entries'],
        'readwrite'
      );
      const store = transaction.objectStore('cache-entries');

      const now = Date.now();
      const entries = await new Promise<PersistedCacheEntry[]>(
        (resolve, reject) => {
          const request = store.getAll();

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        }
      );

      let cleanedCount = 0;

      for (const entry of entries) {
        if (now > entry.expiresAt) {
          await this.deleteEntry(entry.key);
          cleanedCount++;
        }
      }

      console.log(
        `[PersistenceManager] Cleaned up ${cleanedCount} stale entries`
      );
      return cleanedCount;
    } catch (error) {
      console.error('[PersistenceManager] Failed to cleanup stale data', error);
      return 0;
    }
  }

  /**
   * Clear All Persisted Data
   *
   * @returns Whether clear was successful
   */
  async clearAll(): Promise<boolean> {
    const ready = await this.ensureReady();
    if (!ready) return false;

    try {
      const transaction = this.db!.transaction(
        ['cache-entries'],
        'readwrite'
      );
      const store = transaction.objectStore('cache-entries');

      await new Promise<void>((resolve, reject) => {
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log('[PersistenceManager] Cleared all persisted data');
      return true;
    } catch (error) {
      console.error('[PersistenceManager] Failed to clear all data', error);
      return false;
    }
  }

  /**
   * Get Persistence Statistics
   *
   * @returns Statistics about persisted data
   */
  async getStats(): Promise<{
    totalEntries: number;
    totalSize: number;
    expiredEntries: number;
  }> {
    const ready = await this.ensureReady();
    if (!ready) {
      return { totalEntries: 0, totalSize: 0, expiredEntries: 0 };
    }

    try {
      const transaction = this.db!.transaction(['cache-entries'], 'readonly');
      const store = transaction.objectStore('cache-entries');

      const entries = await new Promise<PersistedCacheEntry[]>(
        (resolve, reject) => {
          const request = store.getAll();

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        }
      );

      const now = Date.now();
      let totalSize = 0;
      let expiredCount = 0;

      for (const entry of entries) {
        totalSize += entry.data.length * 2; // Rough estimate (UTF-16)
        if (now > entry.expiresAt) {
          expiredCount++;
        }
      }

      return {
        totalEntries: entries.length,
        totalSize,
        expiredEntries: expiredCount
      };
    } catch (error) {
      console.error('[PersistenceManager] Failed to get stats', error);
      return { totalEntries: 0, totalSize: 0, expiredEntries: 0 };
    }
  }

  /**
   * Persist Navigation Pattern
   *
   * For predictive prefetching
   *
   * @param from - Source route
   * @param to - Destination route
   * @returns Whether persistence was successful
   */
  async persistNavigationPattern(
    from: string,
    to: string
  ): Promise<boolean> {
    const ready = await this.ensureReady();
    if (!ready) return false;

    try {
      const transaction = this.db!.transaction(
        ['navigation-patterns'],
        'readwrite'
      );
      const store = transaction.objectStore('navigation-patterns');

      // Get existing pattern
      const index = store.index('from-to');
      const existingPattern = await new Promise<
        | {
            id: string;
            from: string;
            to: string;
            frequency: number;
            lastOccurrence: number;
            avgTimeToTransition: number;
          }
        | undefined
      >((resolve, reject) => {
        const request = index.get([from, to]);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const now = Date.now();

      if (existingPattern) {
        // Update existing pattern
        existingPattern.frequency++;
        existingPattern.lastOccurrence = now;

        await new Promise<void>((resolve, reject) => {
          const request = store.put(existingPattern);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } else {
        // Create new pattern
        const newPattern = {
          id: `${from}->${to}`,
          from,
          to,
          frequency: 1,
          lastOccurrence: now,
          avgTimeToTransition: 0
        };

        await new Promise<void>((resolve, reject) => {
          const request = store.add(newPattern);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      return true;
    } catch (error) {
      console.error(
        '[PersistenceManager] Failed to persist navigation pattern',
        error
      );
      return false;
    }
  }

  /**
   * Get Navigation Patterns
   *
   * @param from - Source route (optional)
   * @returns Array of navigation patterns
   */
  async getNavigationPatterns(from?: string): Promise<
    Array<{
      from: string;
      to: string;
      frequency: number;
      lastOccurrence: number;
    }>
  > {
    const ready = await this.ensureReady();
    if (!ready) return [];

    try {
      const transaction = this.db!.transaction(
        ['navigation-patterns'],
        'readonly'
      );
      const store = transaction.objectStore('navigation-patterns');

      if (from) {
        // Get patterns from specific route
        const index = store.index('from-to');
        const range = IDBKeyRange.bound([from], [from, []]);

        const patterns = await new Promise<
          Array<{
            from: string;
            to: string;
            frequency: number;
            lastOccurrence: number;
          }>
        >((resolve, reject) => {
          const request = index.getAll(range);

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        // Sort by frequency (descending)
        patterns.sort((a, b) => b.frequency - a.frequency);

        return patterns;
      } else {
        // Get all patterns
        const patterns = await new Promise<
          Array<{
            from: string;
            to: string;
            frequency: number;
            lastOccurrence: number;
          }>
        >((resolve, reject) => {
          const request = store.getAll();

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        return patterns;
      }
    } catch (error) {
      console.error(
        '[PersistenceManager] Failed to get navigation patterns',
        error
      );
      return [];
    }
  }
}

// Singleton instance
let persistenceManagerInstance: PersistenceManager | null = null;

/**
 * Get Persistence Manager Singleton
 *
 * @returns Persistence manager instance
 */
export function getPersistenceManager(): PersistenceManager {
  if (!persistenceManagerInstance) {
    persistenceManagerInstance = new PersistenceManager();
  }
  return persistenceManagerInstance;
}

/**
 * Reset Persistence Manager (for testing)
 */
export function resetPersistenceManager(): void {
  persistenceManagerInstance = null;
}
