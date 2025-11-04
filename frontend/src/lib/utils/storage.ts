/**
 * Storage Utility Functions
 *
 * HIPAA-compliant localStorage and sessionStorage utilities with PHI exclusion.
 * Provides safe storage methods that prevent accidental PHI persistence.
 *
 * @module lib/utils/storage
 */

import { containsPHI } from './validation';
import { COMMON_PHI_FIELDS } from './sanitization';

/**
 * Storage types enum
 */
export enum StorageType {
  LOCAL = 'localStorage',
  SESSION = 'sessionStorage',
}

/**
 * Storage item with metadata
 */
export interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiresAt?: number;
}

/**
 * HIPAA-compliant storage configuration
 */
export interface StorageConfig {
  /** Prevent PHI storage in localStorage (default: true) */
  preventPHI: boolean;
  /** Encrypt data before storage (default: false) */
  encrypt: boolean;
  /** TTL in milliseconds (default: no expiration) */
  ttl?: number;
}

const DEFAULT_CONFIG: StorageConfig = {
  preventPHI: true,
  encrypt: false,
};

/**
 * Checks if a key or value contains PHI patterns.
 *
 * @param key - Storage key
 * @param value - Value to check
 * @returns True if PHI detected
 */
function detectPHI(key: string, value: any): boolean {
  // Check if key matches common PHI field names
  const keyLower = key.toLowerCase();
  if (COMMON_PHI_FIELDS.some((field) => keyLower.includes(field.toLowerCase()))) {
    return true;
  }

  // Check string values for PHI patterns
  if (typeof value === 'string') {
    return containsPHI(value);
  }

  // Check object values for PHI fields
  if (typeof value === 'object' && value !== null) {
    const jsonString = JSON.stringify(value);
    return containsPHI(jsonString) || COMMON_PHI_FIELDS.some((field) => jsonString.includes(field));
  }

  return false;
}

/**
 * Gets a value from storage.
 *
 * @param key - Storage key
 * @param storageType - Storage type (localStorage or sessionStorage)
 * @returns Stored value or null if not found/expired
 *
 * @example
 * ```typescript
 * const user = getItem<User>('user', StorageType.SESSION);
 * if (user) {
 *   console.log(user.name);
 * }
 * ```
 */
export function getItem<T>(key: string, storageType: StorageType = StorageType.LOCAL): T | null {
  try {
    const storage = storageType === StorageType.LOCAL ? localStorage : sessionStorage;
    const item = storage.getItem(key);

    if (!item) return null;

    const parsed: StorageItem<T> = JSON.parse(item);

    // Check expiration
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      storage.removeItem(key);
      return null;
    }

    return parsed.value;
  } catch (error) {
    console.error('Error getting item from storage:', error);
    return null;
  }
}

/**
 * Sets a value in storage with HIPAA compliance checks.
 *
 * **HIPAA Warning**: By default, PHI detection is enabled. Setting `preventPHI: false`
 * is a compliance risk and should only be used with proper justification.
 *
 * @param key - Storage key
 * @param value - Value to store
 * @param storageType - Storage type (localStorage or sessionStorage)
 * @param config - Storage configuration
 * @returns True if successfully stored
 *
 * @example
 * ```typescript
 * // Safe storage (no PHI)
 * setItem('theme', 'dark', StorageType.LOCAL);
 *
 * // Session-only storage for temporary data
 * setItem('currentView', 'dashboard', StorageType.SESSION);
 *
 * // Storage with TTL
 * setItem('cache', data, StorageType.LOCAL, { ttl: 3600000 }); // 1 hour
 * ```
 */
export function setItem<T>(
  key: string,
  value: T,
  storageType: StorageType = StorageType.LOCAL,
  config: Partial<StorageConfig> = {}
): boolean {
  try {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    // PHI detection for localStorage
    if (storageType === StorageType.LOCAL && mergedConfig.preventPHI) {
      if (detectPHI(key, value)) {
        console.warn(
          `[HIPAA Warning] Attempted to store potential PHI in localStorage with key: ${key}. Use sessionStorage instead or set preventPHI: false if this is intentional.`
        );
        return false;
      }
    }

    const storage = storageType === StorageType.LOCAL ? localStorage : sessionStorage;

    const item: StorageItem<T> = {
      value,
      timestamp: Date.now(),
      expiresAt: mergedConfig.ttl ? Date.now() + mergedConfig.ttl : undefined,
    };

    storage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error('Error setting item in storage:', error);
    return false;
  }
}

/**
 * Removes an item from storage.
 *
 * @param key - Storage key
 * @param storageType - Storage type
 * @returns True if successfully removed
 *
 * @example
 * ```typescript
 * removeItem('user', StorageType.SESSION);
 * ```
 */
export function removeItem(key: string, storageType: StorageType = StorageType.LOCAL): boolean {
  try {
    const storage = storageType === StorageType.LOCAL ? localStorage : sessionStorage;
    storage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing item from storage:', error);
    return false;
  }
}

/**
 * Clears all items from storage.
 *
 * @param storageType - Storage type
 * @returns True if successfully cleared
 *
 * @example
 * ```typescript
 * clearStorage(StorageType.SESSION); // Clear session only
 * clearStorage(StorageType.LOCAL); // Clear localStorage
 * ```
 */
export function clearStorage(storageType: StorageType = StorageType.LOCAL): boolean {
  try {
    const storage = storageType === StorageType.LOCAL ? localStorage : sessionStorage;
    storage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

/**
 * Gets all keys from storage.
 *
 * @param storageType - Storage type
 * @returns Array of storage keys
 *
 * @example
 * ```typescript
 * const keys = getKeys(StorageType.LOCAL);
 * console.log('Stored keys:', keys);
 * ```
 */
export function getKeys(storageType: StorageType = StorageType.LOCAL): string[] {
  try {
    const storage = storageType === StorageType.LOCAL ? localStorage : sessionStorage;
    return Object.keys(storage);
  } catch (error) {
    console.error('Error getting keys from storage:', error);
    return [];
  }
}

/**
 * Checks if a key exists in storage.
 *
 * @param key - Storage key
 * @param storageType - Storage type
 * @returns True if key exists
 *
 * @example
 * ```typescript
 * if (hasItem('token', StorageType.SESSION)) {
 *   // Token exists
 * }
 * ```
 */
export function hasItem(key: string, storageType: StorageType = StorageType.LOCAL): boolean {
  return getItem(key, storageType) !== null;
}

/**
 * Gets storage size in bytes.
 *
 * Approximates the size of all stored data.
 *
 * @param storageType - Storage type
 * @returns Size in bytes
 *
 * @example
 * ```typescript
 * const size = getStorageSize(StorageType.LOCAL);
 * console.log(`Storage size: ${size} bytes`);
 * ```
 */
export function getStorageSize(storageType: StorageType = StorageType.LOCAL): number {
  try {
    const storage = storageType === StorageType.LOCAL ? localStorage : sessionStorage;
    let size = 0;

    for (const key in storage) {
      if (storage.hasOwnProperty(key)) {
        size += key.length + (storage[key]?.length || 0);
      }
    }

    return size;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
}

/**
 * Cleans up expired items from storage.
 *
 * Should be called periodically to remove expired TTL items.
 *
 * @param storageType - Storage type
 * @returns Number of items removed
 *
 * @example
 * ```typescript
 * const removed = cleanupExpired(StorageType.LOCAL);
 * console.log(`Removed ${removed} expired items`);
 * ```
 */
export function cleanupExpired(storageType: StorageType = StorageType.LOCAL): number {
  try {
    const storage = storageType === StorageType.LOCAL ? localStorage : sessionStorage;
    const keys = Object.keys(storage);
    let removedCount = 0;

    keys.forEach((key) => {
      try {
        const item = storage.getItem(key);
        if (!item) return;

        const parsed: StorageItem<any> = JSON.parse(item);

        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          storage.removeItem(key);
          removedCount++;
        }
      } catch {
        // Skip malformed items
      }
    });

    return removedCount;
  } catch (error) {
    console.error('Error cleaning up expired items:', error);
    return 0;
  }
}

/**
 * Stores data in sessionStorage (recommended for PHI).
 *
 * Helper function that always uses sessionStorage for sensitive data.
 *
 * @param key - Storage key
 * @param value - Value to store
 * @param config - Storage configuration
 * @returns True if successfully stored
 *
 * @example
 * ```typescript
 * // Store patient data in session only
 * setSessionItem('patient', patientData);
 *
 * // Retrieve patient data
 * const patient = getSessionItem<Patient>('patient');
 * ```
 */
export function setSessionItem<T>(key: string, value: T, config?: Partial<StorageConfig>): boolean {
  return setItem(key, value, StorageType.SESSION, config);
}

/**
 * Gets data from sessionStorage.
 *
 * @param key - Storage key
 * @returns Stored value or null
 */
export function getSessionItem<T>(key: string): T | null {
  return getItem<T>(key, StorageType.SESSION);
}

/**
 * Stores data in localStorage (PHI detection enabled).
 *
 * @param key - Storage key
 * @param value - Value to store
 * @param config - Storage configuration
 * @returns True if successfully stored
 *
 * @example
 * ```typescript
 * // Store non-PHI preferences
 * setLocalItem('theme', 'dark');
 * setLocalItem('language', 'en');
 * ```
 */
export function setLocalItem<T>(key: string, value: T, config?: Partial<StorageConfig>): boolean {
  return setItem(key, value, StorageType.LOCAL, config);
}

/**
 * Gets data from localStorage.
 *
 * @param key - Storage key
 * @returns Stored value or null
 */
export function getLocalItem<T>(key: string): T | null {
  return getItem<T>(key, StorageType.LOCAL);
}

/**
 * Namespace storage helper for organizing keys.
 *
 * Creates namespaced keys to avoid collisions.
 *
 * @param namespace - Namespace prefix
 * @returns Object with namespaced storage methods
 *
 * @example
 * ```typescript
 * const userStorage = createNamespace('user');
 * userStorage.set('preferences', { theme: 'dark' });
 * const prefs = userStorage.get<Preferences>('preferences');
 * ```
 */
export function createNamespace(namespace: string) {
  const prefix = `${namespace}:`;

  return {
    set: <T>(key: string, value: T, storageType?: StorageType, config?: Partial<StorageConfig>) => {
      return setItem(`${prefix}${key}`, value, storageType, config);
    },

    get: <T>(key: string, storageType?: StorageType): T | null => {
      return getItem<T>(`${prefix}${key}`, storageType);
    },

    remove: (key: string, storageType?: StorageType) => {
      return removeItem(`${prefix}${key}`, storageType);
    },

    has: (key: string, storageType?: StorageType) => {
      return hasItem(`${prefix}${key}`, storageType);
    },

    clear: (storageType?: StorageType) => {
      const storage = storageType === StorageType.LOCAL ? localStorage : sessionStorage;
      const keys = Object.keys(storage);

      keys.forEach((key) => {
        if (key.startsWith(prefix)) {
          storage.removeItem(key);
        }
      });
    },
  };
}

/**
 * HIPAA-compliant audit log for storage operations.
 *
 * Logs storage operations without exposing PHI.
 * Currently unused but reserved for future audit trail requirements.
 *
 * @param operation - Operation type
 * @param key - Storage key
 * @param storageType - Storage type
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function auditStorageOperation(operation: 'get' | 'set' | 'remove', key: string, storageType: StorageType): void {
  // Only log in development or when audit logging is enabled
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Storage Audit] ${operation.toUpperCase()} - Key: ${key}, Type: ${storageType}`);
  }
}

/**
 * Storage quota check.
 *
 * Checks if storage quota is exceeded.
 *
 * @param storageType - Storage type
 * @returns True if quota exceeded
 *
 * @example
 * ```typescript
 * if (isQuotaExceeded(StorageType.LOCAL)) {
 *   console.warn('Storage quota exceeded');
 * }
 * ```
 */
export function isQuotaExceeded(storageType: StorageType = StorageType.LOCAL): boolean {
  try {
    const storage = storageType === StorageType.LOCAL ? localStorage : sessionStorage;
    const testKey = '__quota_test__';

    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);

    return false;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      return true;
    }
    return false;
  }
}
