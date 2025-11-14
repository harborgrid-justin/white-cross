/**
 * @fileoverview Redux Slice Factory for Standardized Entity Management
 * @module stores/sliceFactory
 * @category Store - Factories
 * 
 * DEPRECATED: This file exports from the new modular structure.
 * Import directly from './sliceFactory' for the new modular components.
 * 
 * @deprecated Use import from './sliceFactory' instead
 */

// Re-export everything from the new modular structure for backward compatibility
export {
  createEntitySlice,
  createSimpleSlice,
  createHealthcareEntitySlice,
  createAuditRecord,
  validateDataClassification,
  containsPHI,
  generateComplianceReport,
  createInitialEnhancedState,
  extractErrorInfo,
  updateLoadingState,
  createStandardEntityAdapter,
  validateEntity,
  createErrorPayload,
  isCacheStale,
  normalizeEntity,
  calculatePagination,
  createActionTypes,
  deepMerge,
} from './sliceFactory/index';

export type {
  DataClassification,
  ApiError,
  EnhancedEntityState,
  EntityApiService,
  SliceFactoryOptions,
  SliceFactoryResult,
  AuditRecordPayload,
  DataClassificationPayload,
} from './sliceFactory/index';

// Default export for backward compatibility
export { default } from './sliceFactory/index';
