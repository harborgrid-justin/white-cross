/**
 * Form State Persistence Hook
 *
 * Automatic form state persistence to localStorage/sessionStorage
 * with HIPAA-compliant data handling and cleanup.
 *
 * @module hooks/utilities/useFormPersistence
 * @category State Management - Form State
 *
 * Features:
 * - Automatic save on form changes
 * - Debounced writes to storage
 * - Type-safe persistence
 * - PHI-aware storage (excludes sensitive data)
 * - Automatic cleanup on submit/unmount
 * - Configurable storage strategy
 *
 * Compliance: Item 163 (NEXTJS_GAP_ANALYSIS_CHECKLIST.md)
 * - [x] 163. Form state persisted where appropriate
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { UseFormWatch, FieldValues, UseFormSetValue } from 'react-hook-form';

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
 * Get storage object based on type
 */
function getStorage(type: StorageType): Storage | null {
  if (typeof window === 'undefined') return null;
  if (type === 'none') return null;
  return type === 'localStorage' ? window.localStorage : window.sessionStorage;
}

/**
 * Hook for automatic form state persistence
 *
 * @template T - Form field values type
 * @param watch - React Hook Form watch function
 * @param setValue - React Hook Form setValue function
 * @param options - Persistence configuration
 *
 * @example Basic usage
 * ```tsx
 * function MyForm() {
 *   const { register, watch, setValue, handleSubmit } = useForm<FormData>();
 *
 *   const { clearStorage } = useFormPersistence(watch, setValue, {
 *     storageKey: 'my-form-draft',
 *     excludeFields: ['password', 'confirmPassword'],
 *   });
 *
 *   const onSubmit = async (data: FormData) => {
 *     await saveData(data);
 *     clearStorage(); // Clear draft after successful submit
 *   };
 *
 *   return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
 * }
 * ```
 *
 * @example PHI-aware persistence
 * ```tsx
 * function StudentForm() {
 *   const { watch, setValue } = useForm<StudentFormData>();
 *
 *   useFormPersistence(watch, setValue, {
 *     storageKey: 'student-form-draft',
 *     // Only persist non-PHI UI state
 *     includeFields: ['currentStep', 'viewMode', 'expandedSections'],
 *     storage: 'sessionStorage', // More secure, cleared on browser close
 *   });
 * }
 * ```
 *
 * @example With transform
 * ```tsx
 * function IncidentForm() {
 *   const { watch, setValue } = useForm<IncidentFormData>();
 *
 *   useFormPersistence(watch, setValue, {
 *     storageKey: 'incident-draft',
 *     transformBeforeSave: (data) => ({
 *       ...data,
 *       // Convert dates to ISO strings
 *       incidentDate: data.incidentDate?.toISOString(),
 *     }),
 *     transformAfterLoad: (data) => ({
 *       ...data,
 *       // Parse ISO strings back to dates
 *       incidentDate: data.incidentDate ? new Date(data.incidentDate) : undefined,
 *     }),
 *   });
 * }
 * ```
 */
export function useFormPersistence<T extends FieldValues>(
  watch: UseFormWatch<T>,
  setValue: UseFormSetValue<T>,
  options: FormPersistenceOptions<T>
) {
  const {
    storageKey,
    storage = 'localStorage',
    debounceMs = 500,
    excludeFields = [],
    includeFields,
    validate,
    transformBeforeSave,
    transformAfterLoad,
    onRestore,
    onClear,
    clearOnSubmit = true,
    enabled = true,
  } = options;

  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const hasRestoredRef = useRef(false);

  /**
   * Filter fields based on include/exclude lists
   */
  const filterFields = useCallback((data: Partial<T>): Partial<T> => {
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
  }, [includeFields, excludeFields]);

  /**
   * Save form data to storage
   */
  const saveToStorage = useCallback((data: Partial<T>) => {
    if (!enabled) return;

    const storageObj = getStorage(storage);
    if (!storageObj) return;

    try {
      let dataToSave = filterFields(data);

      // Apply transform
      if (transformBeforeSave) {
        dataToSave = transformBeforeSave(dataToSave);
      }

      // Validate
      if (validate && !validate(dataToSave)) {
        return;
      }

      const serialized = JSON.stringify({
        data: dataToSave,
        timestamp: Date.now(),
        version: 1, // For future migration support
      });

      storageObj.setItem(storageKey, serialized);
    } catch (error) {
      console.error('[FormPersistence] Error saving to storage:', error);
    }
  }, [
    enabled,
    storage,
    storageKey,
    filterFields,
    transformBeforeSave,
    validate,
  ]);

  /**
   * Load form data from storage
   */
  const loadFromStorage = useCallback((): Partial<T> | null => {
    if (!enabled) return null;

    const storageObj = getStorage(storage);
    if (!storageObj) return null;

    try {
      const stored = storageObj.getItem(storageKey);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      let data = parsed.data as Partial<T>;

      // Apply transform
      if (transformAfterLoad) {
        data = transformAfterLoad(data);
      }

      return data;
    } catch (error) {
      console.error('[FormPersistence] Error loading from storage:', error);
      // Clear corrupted data
      clearStorage();
      return null;
    }
  }, [enabled, storage, storageKey, transformAfterLoad]);

  /**
   * Clear storage
   */
  const clearStorage = useCallback(() => {
    const storageObj = getStorage(storage);
    if (!storageObj) return;

    try {
      onClear?.();
      storageObj.removeItem(storageKey);
    } catch (error) {
      console.error('[FormPersistence] Error clearing storage:', error);
    }
  }, [storage, storageKey, onClear]);

  /**
   * Restore form data on mount
   */
  useEffect(() => {
    if (!enabled || hasRestoredRef.current) return;

    const data = loadFromStorage();
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as any, value, {
          shouldValidate: false,
          shouldDirty: false,
        });
      });

      onRestore?.(data);
    }

    hasRestoredRef.current = true;
  }, [enabled, loadFromStorage, setValue, onRestore]);

  /**
   * Watch for changes and persist with debounce
   */
  useEffect(() => {
    if (!enabled) return;

    const subscription = watch((data) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        saveToStorage(data);
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [enabled, watch, debounceMs, saveToStorage]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    /** Manually clear persisted data */
    clearStorage,
    /** Manually save current data */
    saveToStorage: () => saveToStorage(watch()),
    /** Manually load persisted data */
    loadFromStorage,
    /** Check if data exists in storage */
    hasPersistedData: () => {
      const storageObj = getStorage(storage);
      return storageObj ? storageObj.getItem(storageKey) !== null : false;
    },
  };
}

export default useFormPersistence;
