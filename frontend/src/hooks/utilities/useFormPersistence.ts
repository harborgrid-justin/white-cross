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
 *
 * NOTE: This file has been refactored into separate modules for better maintainability.
 * All exports are re-exported from the formPersistence module.
 */

// Re-export all types
export type {
  StorageType,
  FormPersistenceOptions,
  StoredFormData,
} from './formPersistence/types';

// Re-export storage utilities
export {
  getStorage,
  FormStorageManager,
  filterFields,
} from './formPersistence/storage';

// Re-export main hook
export { useFormPersistence } from './formPersistence/hook';

// Default export
export { default } from './formPersistence';
