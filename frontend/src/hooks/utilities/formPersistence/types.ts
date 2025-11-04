/**
 * Form Persistence Types
 *
 * Type definitions for form state persistence functionality.
 *
 * @module hooks/utilities/formPersistence/types
 * @category State Management - Form State
 */

import { FieldValues } from 'react-hook-form';

/**
 * Storage types
 */
export type StorageType = 'localStorage' | 'sessionStorage' | 'none';

/**
 * Persistence options
 */
export interface FormPersistenceOptions<T extends FieldValues> {
  /** Unique key for this form's storage */
  storageKey: string;

  /** Storage type (default: 'localStorage') */
  storage?: StorageType;

  /** Debounce delay in ms (default: 500) */
  debounceMs?: number;

  /** Fields to exclude from persistence (e.g., passwords, PHI) */
  excludeFields?: (keyof T)[];

  /** Only persist these fields (if specified, overrides excludeFields) */
  includeFields?: (keyof T)[];

  /** Custom validation before persisting */
  validate?: (data: Partial<T>) => boolean;

  /** Transform data before saving */
  transformBeforeSave?: (data: Partial<T>) => Partial<T>;

  /** Transform data after loading */
  transformAfterLoad?: (data: Partial<T>) => Partial<T>;

  /** Called after state is restored */
  onRestore?: (data: Partial<T>) => void;

  /** Called before clearing storage */
  onClear?: () => void;

  /** Auto-clear on successful submit (default: true) */
  clearOnSubmit?: boolean;

  /** Enable persistence (default: true) */
  enabled?: boolean;
}

/**
 * Stored data structure
 */
export interface StoredFormData<T> {
  data: Partial<T>;
  timestamp: number;
  version: number;
}
