/**
 * Form Persistence Hook Implementation
 *
 * Main hook implementation for automatic form state persistence.
 *
 * @module hooks/utilities/formPersistence/hook
 * @category State Management - Form State
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { UseFormWatch, FieldValues, UseFormSetValue } from 'react-hook-form';
import type { FormPersistenceOptions } from './types';
import { FormStorageManager, filterFields } from './storage';

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
  const storageManager = useRef(new FormStorageManager<T>(storageKey, storage));

  // Update storage manager if key or storage type changes
  useEffect(() => {
    storageManager.current = new FormStorageManager<T>(storageKey, storage);
  }, [storageKey, storage]);

  /**
   * Save form data to storage
   */
  const saveToStorage = useCallback(
    (data: Partial<T>) => {
      if (!enabled) return;

      try {
        let dataToSave = filterFields(data, { includeFields, excludeFields });

        // Apply transform
        if (transformBeforeSave) {
          dataToSave = transformBeforeSave(dataToSave);
        }

        // Validate
        if (validate && !validate(dataToSave)) {
          return;
        }

        storageManager.current.save(dataToSave);
      } catch (error) {
        console.error('[FormPersistence] Error in saveToStorage:', error);
      }
    },
    [enabled, includeFields, excludeFields, transformBeforeSave, validate]
  );

  /**
   * Load form data from storage
   */
  const loadFromStorage = useCallback((): Partial<T> | null => {
    if (!enabled) return null;

    try {
      let data = storageManager.current.load();
      if (!data) return null;

      // Apply transform
      if (transformAfterLoad) {
        data = transformAfterLoad(data);
      }

      return data;
    } catch (error) {
      console.error('[FormPersistence] Error in loadFromStorage:', error);
      return null;
    }
  }, [enabled, transformAfterLoad]);

  /**
   * Clear storage
   */
  const clearStorage = useCallback(() => {
    try {
      onClear?.();
      storageManager.current.clear();
    } catch (error) {
      console.error('[FormPersistence] Error in clearStorage:', error);
    }
  }, [onClear]);

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
    hasPersistedData: () => storageManager.current.hasData(),
  };
}
