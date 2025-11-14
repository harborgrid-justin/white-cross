/**
 * @fileoverview Students API Legacy Compatibility Layer
 * 
 * NOTICE: This file serves as a backward compatibility layer for the refactored
 * Students API. The implementation has been moved to a modular structure under
 * the ./studentsApi/ directory for better maintainability and organization.
 * 
 * **Migration Notice:**
 * This file will be maintained for backward compatibility during the transition
 * period. New code should import from the modular structure:
 * 
 * ```typescript
 * // New (recommended)
 * import { studentsApi } from '@/services/modules/studentsApi';
 * 
 * // Legacy (deprecated but supported)
 * import { studentsApi } from '@/services/modules/studentsApi.ts';
 * ```
 * 
 * **What Changed:**
 * - Implementation moved to modular structure for maintainability
 * - All functionality remains identical
 * - Performance and features are unchanged
 * - Type definitions are shared between old and new interfaces
 * 
 * **Deprecation Timeline:**
 * - Phase 1: Dual support (current) - both imports work
 * - Phase 2: Deprecation warnings added to this file
 * - Phase 3: This file removed, only modular imports supported
 * 
 * @module services/modules/studentsApi
 * @deprecated Use modular imports from '@/services/modules/studentsApi' instead
 */

// Re-export everything from the new modular structure
export {
  StudentsApi,
  studentsApi,
  createStudentsApi,
} from './studentsApi/index';

// Re-export types for compatibility
export type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  StudentFilters,
  PaginatedStudentsResponse,
  StudentStatistics,
  TransferStudentRequest,
  BulkUpdateStudentsRequest,
  ExportStudentDataResponse,
  Gender,
  BackendApiResponse,
  StudentApiResult,
  StudentSearchParams,
  BulkOperationResponse,
  StudentValidationError,
  StudentAssignmentRequest,
  StudentEnrollmentData,
  StudentHealthSummary,
  StudentAcademicSummary,
  StudentExportOptions,
  StudentQueryBuilder,
} from './studentsApi/types';

// Re-export validation schemas and constants
export {
  VALID_GRADES,
  PHONE_REGEX,
  EMAIL_REGEX,
  MEDICAL_RECORD_REGEX,
  STUDENT_NUMBER_REGEX,
  createStudentSchema,
  updateStudentSchema,
  studentFiltersSchema,
} from './studentsApi/validation';

/**
 * Legacy default export for maximum compatibility
 * @deprecated Use named export `studentsApi` instead
 */
export { studentsApi as default } from './studentsApi/index';

/* 
 * Migration guide for common patterns:
 * 
 * // Before (still works):
 * import { studentsApi } from '@/services/modules/studentsApi.ts';
 * import type { Student } from '../../types/domain/student.types';
 * 
 * // After (recommended):
 * import { studentsApi } from '@/services/modules/studentsApi';
 * import type { Student } from '@/services/modules/studentsApi';
 * 
 * // Advanced usage with modular operations:
 * import { StudentsApi, StudentCoreOperations } from '@/services/modules/studentsApi';
 * 
 * // Validation schemas:
 * import { createStudentSchema } from '@/services/modules/studentsApi';
 * const validated = createStudentSchema.parse(data);
 */
