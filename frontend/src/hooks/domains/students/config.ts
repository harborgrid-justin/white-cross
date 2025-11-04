/**
 * Students Domain Configuration
 *
 * Centralized configuration for the students domain including query keys,
 * cache strategies, data sensitivity mappings, and FERPA compliance settings.
 * Provides structured access to student data with appropriate privacy protections
 * for educational records and protected health information.
 *
 * @module hooks/domains/students/config
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **FERPA Compliance**:
 * Student education records are protected under the Family Educational Rights
 * and Privacy Act (FERPA). This configuration enforces access controls and audit
 * logging for all student data access based on sensitivity levels.
 *
 * **Data Sensitivity Levels**:
 * - `public`: Directory information that can be shared without consent
 * - `internal`: Educational records requiring authentication
 * - `confidential`: Sensitive records requiring role-based authorization
 * - `phi`: Protected Health Information requiring HIPAA compliance
 * - `critical`: Emergency/safety data requiring immediate access
 *
 * **Cache Strategy**:
 * Cache durations are inversely proportional to data sensitivity:
 * - Public data: Long cache (30min+) for performance
 * - Internal data: Moderate cache (10-15min) for balance
 * - Confidential data: Short cache (5min) for freshness
 * - PHI data: Minimal/no cache for compliance
 * - Critical data: No cache, always fetch fresh
 *
 * **Audit Logging**:
 * All student data access is logged for FERPA compliance with:
 * - User ID and timestamp
 * - Operation type (view, create, update, delete)
 * - Data sensitivity level
 * - Student ID or query parameters
 *
 * @example
 * ```typescript
 * // Using sensitivity mappings
 * import { STUDENT_DATA_SENSITIVITY } from '@/hooks/domains/students/config';
 *
 * const sensitivity = STUDENT_DATA_SENSITIVITY.health_records; // 'phi'
 * const requiresAudit = ['phi', 'critical'].includes(sensitivity);
 * ```
 *
 * @example
 * ```typescript
 * // Using cache configuration
 * import { STUDENT_CACHE_CONFIG } from '@/hooks/domains/students/config';
 *
 * const healthCacheConfig = STUDENT_CACHE_CONFIG.health;
 * // { staleTime: 0, gcTime: 0, sensitivity: 'phi' }
 * ```
 *
 * @example
 * ```typescript
 * // Using query keys for cache invalidation
 * import { studentQueryKeys } from '@/hooks/domains/students/config';
 * import { useQueryClient } from '@tanstack/react-query';
 *
 * const queryClient = useQueryClient();
 *
 * // Invalidate all student lists after enrollment
 * queryClient.invalidateQueries({
 *   queryKey: studentQueryKeys.lists.all()
 * });
 *
 * // Invalidate specific student's health records
 * queryClient.invalidateQueries({
 *   queryKey: studentQueryKeys.health.records('student-123')
 * });
 * ```
 *
 * @see {@link https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html | FERPA Guidance}
 * @see {@link useStudents} for list query hooks
 * @see {@link useStudentDetails} for detail query hooks
 * @see {@link useStudentMutations} for mutation hooks
 */

// Re-export from modular files
export {
  STUDENT_DATA_SENSITIVITY,
  STUDENT_ERROR_CODES,
  STUDENT_OPERATIONS,
  type StudentListFilters,
  type PaginationParams,
} from './config.types';

export { STUDENT_CACHE_CONFIG } from './config.cache';

export { studentQueryKeys } from './config.keys';
