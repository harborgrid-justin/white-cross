/**
 * Form Persistence Storage Operations
 *
 * Low-level storage operations for form state persistence.
 *
 * @module hooks/utilities/formPersistence/storage
 * @category State Management - Form State
 */

'use client';

import { FieldValues } from 'react-hook-form';
import type { StorageType, StoredFormData } from './types';

/**
 * Get storage object based on type
 */
export function getStorage(type: StorageType): Storage | null {
  if (typeof window === 'undefined') return null;
  if (type === 'none') return null;
  return type === 'localStorage' ? window.localStorage : window.sessionStorage;
}

/**
 * Storage manager class for form persistence
 */
export class FormStorageManager<T extends FieldValues> {
  constructor(
    private storageKey: string,
    private storage: StorageType = 'localStorage'
  ) {}

  /**
   * Save data to storage
   */
  save(data: Partial<T>): boolean {
    const storageObj = getStorage(this.storage);
    if (!storageObj) return false;

    try {
      const payload: StoredFormData<T> = {
        data,
        timestamp: Date.now(),
        version: 1, // For future migration support
      };

      const serialized = JSON.stringify(payload);
      storageObj.setItem(this.storageKey, serialized);
      return true;
    } catch (error) {
      console.error('[FormPersistence] Error saving to storage:', error);
      return false;
    }
  }

  /**
   * Load data from storage
   */
  load(): Partial<T> | null {
    const storageObj = getStorage(this.storage);
    if (!storageObj) return null;

    try {
      const stored = storageObj.getItem(this.storageKey);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as StoredFormData<T>;
      return parsed.data;
    } catch (error) {
      console.error('[FormPersistence] Error loading from storage:', error);
      // Clear corrupted data
      this.clear();
      return null;
    }
  }

  /**
   * Clear storage
   */
  clear(): void {
    const storageObj = getStorage(this.storage);
    if (!storageObj) return;

    try {
      storageObj.removeItem(this.storageKey);
    } catch (error) {
      console.error('[FormPersistence] Error clearing storage:', error);
    }
  }

  /**
   * Check if data exists in storage
   */
  hasData(): boolean {
    const storageObj = getStorage(this.storage);
    return storageObj ? storageObj.getItem(this.storageKey) !== null : false;
  }
}

/**
 * Filter fields based on include/exclude lists
 */
export function filterFields<T extends FieldValues>(
  data: Partial<T>,
  options: {
    includeFields?: (keyof T)[];
    excludeFields?: (keyof T)[];
  }
): Partial<T> {
  const { includeFields, excludeFields = [] } = options;
  const filtered: Partial<T> = {};

  Object.keys(data).forEach((key) => {
    const field = key as keyof T;

    // If includeFields is specified, only include those fields
    if (includeFields && includeFields.length > 0) {
      if (includeFields.includes(field)) {
        filtered[field] = data[field];
      }
    }
    // Otherwise, exclude specified fields
    else if (!excludeFields.includes(field)) {
      filtered[field] = data[field];
    }
  });

  return filtered;
}
