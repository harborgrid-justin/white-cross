/**
 * Composite Student Hooks - Re-exports
 *
 * High-level hooks that combine multiple concerns for common use cases,
 * providing convenient interfaces for complex student management workflows.
 *
 * This index file provides backward compatibility by re-exporting all
 * composite hooks from their individual modules.
 *
 * @module hooks/students/composites
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

// Re-export individual composite hooks
export { useStudentManager } from './useStudentManager';
export type { UseStudentManagerOptions } from './useStudentManager';

export { useStudentDashboard } from './useStudentDashboard';
export type { DashboardTimeRange } from './useStudentDashboard';

export { useStudentProfile } from './useStudentProfile';
export type { UseStudentProfileOptions } from './useStudentProfile';

export { useBulkStudentOperations } from './useBulkStudentOperations';
export type {
  UseBulkStudentOperationsOptions,
  BulkOperation
} from './useBulkStudentOperations';

// Default export for backward compatibility
export default {
  useStudentManager,
  useStudentDashboard,
  useStudentProfile,
  useBulkStudentOperations,
};
