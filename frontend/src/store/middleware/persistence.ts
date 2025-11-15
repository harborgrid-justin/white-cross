/**
 * Persistence middleware configuration for different storage strategies
 *
 * This file configures the Zustand persist middleware with multi-storage support:
 * - IndexedDB for large data (canvas, history)
 * - LocalStorage for small, frequently accessed data (preferences, workflow)
 * - SessionStorage for temporary data (clipboard)
 */

import type { StateStorage } from 'zustand/middleware';
import type { PageBuilderState } from '../types';

// ============================================================================
// Storage Adapters
// ============================================================================

/**
 * IndexedDB storage adapter for large data
 */
export const createIndexedDBStorage = (dbName: string, storeName: string): StateStorage => {
  let db: IDBDatabase | null = null;

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db);
        return;
      }

      const request = indexedDB.open(dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
    });
  };

  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          const transaction = db.transaction([storeName], 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.get(key);

          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve(request.result || null);
        });
      } catch (error) {
        console.error('IndexedDB getItem error:', error);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          const transaction = db.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.put(value, key);

          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        });
      } catch (error) {
        console.error('IndexedDB setItem error:', error);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          const transaction = db.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.delete(key);

          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        });
      } catch (error) {
        console.error('IndexedDB removeItem error:', error);
      }
    },
  };
};

/**
 * LocalStorage adapter with error handling
 */
export const createLocalStorageAdapter = (): StateStorage => {
  return {
    getItem: (key: string): string | null => {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('LocalStorage getItem error:', error);
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('LocalStorage setItem error:', error);
      }
    },
    removeItem: (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('LocalStorage removeItem error:', error);
      }
    },
  };
};

/**
 * SessionStorage adapter with error handling
 */
export const createSessionStorageAdapter = (): StateStorage => {
  return {
    getItem: (key: string): string | null => {
      try {
        return sessionStorage.getItem(key);
      } catch (error) {
        console.error('SessionStorage getItem error:', error);
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        sessionStorage.setItem(key, value);
      } catch (error) {
        console.error('SessionStorage setItem error:', error);
      }
    },
    removeItem: (key: string): void => {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error('SessionStorage removeItem error:', error);
      }
    },
  };
};

// ============================================================================
// Persistence Partializers
// ============================================================================

/**
 * Partialize function to select which state to persist in IndexedDB
 * (Canvas and History)
 */
export const partializeCanvasAndHistory = (state: PageBuilderState) => ({
  canvas: state.canvas,
  properties: state.properties,
  history: {
    ...state.history,
    // Limit history snapshots in persistence
    past: state.history.past.slice(-20), // Keep last 20 snapshots
    future: state.history.future.slice(0, 20),
  },
});

/**
 * Partialize function for preferences and workflow (LocalStorage)
 */
export const partializePreferencesAndWorkflow = (state: PageBuilderState) => ({
  preferences: state.preferences,
  workflow: state.workflow,
});

/**
 * Partialize function for clipboard (SessionStorage)
 */
export const partializeClipboard = (state: PageBuilderState) => ({
  clipboard: state.clipboard,
});

// ============================================================================
// Migration Functions
// ============================================================================

/**
 * Migrate persisted state to new schema version
 */
export function migratePersistedState(
  persistedState: any,
  version: number
): Partial<PageBuilderState> | undefined {
  // Add migration logic here as your schema evolves
  // Example:
  // if (version === 0) {
  //   return {
  //     ...persistedState,
  //     newField: defaultValue,
  //   };
  // }
  return persistedState;
}

// ============================================================================
// Storage Instances
// ============================================================================

export const indexedDBStorage = createIndexedDBStorage('page-builder-db', 'state');
export const localStorageAdapter = createLocalStorageAdapter();
export const sessionStorageAdapter = createSessionStorageAdapter();

// ============================================================================
// Persist Options
// ============================================================================

/**
 * Options for IndexedDB persistence (canvas, properties, history)
 */
export const canvasPersistOptions = {
  name: 'page-builder-canvas',
  storage: indexedDBStorage,
  partialize: partializeCanvasAndHistory,
  version: 1,
  migrate: migratePersistedState,
};

/**
 * Options for LocalStorage persistence (preferences, workflow)
 */
export const preferencesPersistOptions = {
  name: 'page-builder-preferences',
  storage: localStorageAdapter,
  partialize: partializePreferencesAndWorkflow,
  version: 1,
  migrate: migratePersistedState,
};

/**
 * Options for SessionStorage persistence (clipboard)
 */
export const clipboardPersistOptions = {
  name: 'page-builder-clipboard',
  storage: sessionStorageAdapter,
  partialize: partializeClipboard,
  version: 1,
};

/**
 * Note: Zustand's persist middleware doesn't support multiple storage backends
 * out of the box. For production use, you may need to:
 *
 * 1. Use separate stores for different storage backends
 * 2. Implement a custom persistence middleware that handles multiple storages
 * 3. Use a library like `zustand-persist` with custom adapters
 *
 * For now, we'll use a single storage (IndexedDB) for the main store
 * and handle preferences separately.
 */
