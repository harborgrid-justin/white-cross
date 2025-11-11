/**
 * @fileoverview Redux Slice Factory - Main Entry Point
 * @module stores/sliceFactory
 * @category Store - Factory
 * 
 * Comprehensive factory functions for creating Redux Toolkit slices with standardized
 * CRUD operations, normalized state management using EntityAdapter, and built-in
 * async thunk generation. Dramatically reduces boilerplate while ensuring consistency
 * across all entity slices in the application.
 */

// Core factory functions
export { createEntitySlice, createSimpleSlice } from './core';

// Healthcare-specific factory with HIPAA compliance
export {
  createHealthcareEntitySlice,
  createAuditRecord,
  validateDataClassification,
  containsPHI,
  generateComplianceReport,
} from './healthcare';

// Helper utilities
export {
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
} from './helpers';

// Type definitions
export type {
  DataClassification,
  ApiError,
  EnhancedEntityState,
  EntityApiService,
  SliceFactoryOptions,
  SliceFactoryResult,
  AuditRecordPayload,
  DataClassificationPayload,
} from './types';

// Default export for backward compatibility
export { createEntitySlice as default } from './core';
