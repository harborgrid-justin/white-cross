/**
 * Shared Hooks Index
 * 
 * Central export point for all shared utility hooks used across
 * the White Cross Healthcare Platform frontend application.
 * 
 * @module hooks/shared
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

// Enterprise foundation hooks
export { useApiError, type EnterpriseApiError, type ApiErrorType } from './useApiError';
export { useAuditLog, type AuditEvent, type AuditEventType, type AuditSeverity } from './useAuditLog';
export { useCacheManager, type DataSensitivity, type CacheStrategy, CACHE_TIMES } from './useCacheManager';
export { useHealthcareCompliance } from './useHealthcareCompliance';

// Redux Integration
export * from './reduxHooks';

// Audit Integration  
export * from './useAudit';

// Legacy exports (to be migrated)
export { usePrefetch } from './usePrefetch';

/**
 * Re-export commonly used types
 */
export type {
  UseApiErrorOptions,
  ErrorHandlingResult,
} from './useApiError';

export type {
  UseAuditLogOptions,
} from './useAuditLog';

export type {
  CacheManagerOptions,
  InvalidationScope,
} from './useCacheManager';