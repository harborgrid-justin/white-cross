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

import { CACHE_TIMES, type DataSensitivity } from '@/hooks/shared/useCacheManager';

/**
 * Student Data Sensitivity Classification
 *
 * Maps student data types to their appropriate sensitivity levels for FERPA
 * compliance, access control, and audit logging. Each data type is classified
 * based on privacy regulations and healthcare compliance requirements.
 *
 * @constant
 * @type {Record<string, DataSensitivity>}
 *
 * @property {DataSensitivity} directory - Public directory information (names, grades, dates)
 * @property {DataSensitivity} search_results - Public search results (non-sensitive matches)
 * @property {DataSensitivity} enrollment - Internal enrollment records (registration, transfers)
 * @property {DataSensitivity} academic_records - Internal academic data (grades, attendance)
 * @property {DataSensitivity} attendance - Internal attendance tracking
 * @property {DataSensitivity} contact_information - Confidential contact details (addresses, phones)
 * @property {DataSensitivity} emergency_contacts - Confidential emergency contact information
 * @property {DataSensitivity} disciplinary_records - Confidential behavioral records
 * @property {DataSensitivity} health_records - PHI health records (HIPAA + FERPA)
 * @property {DataSensitivity} medical_conditions - PHI medical diagnoses and conditions
 * @property {DataSensitivity} medications - PHI medication lists and administration logs
 * @property {DataSensitivity} allergies - PHI allergy information
 * @property {DataSensitivity} emergency_medical - Critical emergency medical information
 * @property {DataSensitivity} safety_alerts - Critical safety and risk alerts
 * @property {DataSensitivity} critical_medications - Critical life-saving medication information
 *
 * @remarks
 * **FERPA Classification**:
 * - Public: Directory information per 34 CFR §99.37
 * - Internal: Education records per 34 CFR §99.3
 * - Confidential: Sensitive education records requiring explicit consent
 *
 * **HIPAA Classification** (Health Records):
 * All health-related data is classified as PHI (Protected Health Information)
 * and requires HIPAA compliance in addition to FERPA protections.
 *
 * **Access Control**:
 * - Public: Authenticated users
 * - Internal: Authorized school staff
 * - Confidential: Role-based access (nurses, administrators, assigned staff)
 * - PHI: Healthcare providers with need-to-know
 * - Critical: Emergency responders and designated staff
 *
 * **Audit Requirements**:
 * - Public/Internal: Standard access logging
 * - Confidential: Enhanced audit logging with justification
 * - PHI: Full HIPAA audit trail with access reason
 * - Critical: Real-time audit logging with immediate alerts
 *
 * @example
 * ```typescript
 * // Check if data requires PHI handling
 * const dataType = 'health_records';
 * const sensitivity = STUDENT_DATA_SENSITIVITY[dataType];
 * const isPHI = sensitivity === 'phi';
 * const requiresHIPAA = isPHI;
 * ```
 *
 * @example
 * ```typescript
 * // Determine cache strategy based on sensitivity
 * const getCache Strategy = (dataType: string) => {
 *   const sensitivity = STUDENT_DATA_SENSITIVITY[dataType];
 *   switch (sensitivity) {
 *     case 'public':
 *       return { staleTime: 30 * 60 * 1000, gcTime: 60 * 60 * 1000 };
 *     case 'internal':
 *       return { staleTime: 10 * 60 * 1000, gcTime: 30 * 60 * 1000 };
 *     case 'confidential':
 *       return { staleTime: 5 * 60 * 1000, gcTime: 15 * 60 * 1000 };
 *     case 'phi':
 *     case 'critical':
 *       return { staleTime: 0, gcTime: 0 }; // No caching
 *   }
 * };
 * ```
 *
 * @see {@link https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html | FERPA Regulations}
 * @see {@link https://www.hhs.gov/hipaa/index.html | HIPAA Compliance}
 */
export const STUDENT_DATA_SENSITIVITY: Record<string, DataSensitivity> = {
  // Public directory information
  directory: 'public',
  search_results: 'public',
  
  // Internal business data
  enrollment: 'internal',
  academic_records: 'internal',
  attendance: 'internal',
  
  // Confidential data requiring access control
  contact_information: 'confidential',
  emergency_contacts: 'confidential',
  disciplinary_records: 'confidential',
  
  // PHI - Protected Health Information
  health_records: 'phi',
  medical_conditions: 'phi',
  medications: 'phi',
  allergies: 'phi',
  
  // Critical safety data
  emergency_medical: 'critical',
  safety_alerts: 'critical',
  critical_medications: 'critical',
} as const;

/**
 * Student query cache configuration
 */
export const STUDENT_CACHE_CONFIG = {
  // Public directory data - longer cache
  directory: {
    ...CACHE_TIMES.STABLE,
    sensitivity: 'public' as const,
  },
  
  // Student list and search - moderate cache
  list: {
    ...CACHE_TIMES.MODERATE,
    sensitivity: 'internal' as const,
  },
  
  // Individual student details - dynamic cache
  details: {
    ...CACHE_TIMES.DYNAMIC,
    sensitivity: 'confidential' as const,
  },
  
  // Health data - minimal cache
  health: {
    ...CACHE_TIMES.REALTIME,
    sensitivity: 'phi' as const,
  },
  
  // Critical data - no cache
  critical: {
    ...CACHE_TIMES.CRITICAL,
    sensitivity: 'critical' as const,
  },
} as const;

/**
 * Student domain query keys factory
 */
export const studentQueryKeys = {
  // Root domain key
  domain: ['students'] as const,
  
  // Base query types
  base: {
    lists: () => [...studentQueryKeys.domain, 'list'] as const,
    details: () => [...studentQueryKeys.domain, 'detail'] as const,
    search: () => [...studentQueryKeys.domain, 'search'] as const,
    directory: () => [...studentQueryKeys.domain, 'directory'] as const,
    health: () => [...studentQueryKeys.domain, 'health'] as const,
    academics: () => [...studentQueryKeys.domain, 'academics'] as const,
    statistics: () => [...studentQueryKeys.domain, 'statistics'] as const,
  },
  
  // List queries
  lists: {
    all: () => studentQueryKeys.base.lists(),
    filtered: (filters: StudentListFilters) => 
      [...studentQueryKeys.base.lists(), 'filtered', filters] as const,
    paginated: (pagination: PaginationParams) => 
      [...studentQueryKeys.base.lists(), 'paginated', pagination] as const,
    byGrade: (grade: string) => 
      [...studentQueryKeys.base.lists(), 'grade', grade] as const,
    bySchool: (schoolId: string) => 
      [...studentQueryKeys.base.lists(), 'school', schoolId] as const,
    active: () => [...studentQueryKeys.base.lists(), 'active'] as const,
    inactive: () => [...studentQueryKeys.base.lists(), 'inactive'] as const,
  },
  
  // Detail queries
  details: {
    byId: (id: string) => 
      [...studentQueryKeys.base.details(), id] as const,
    withHealth: (id: string) => 
      [...studentQueryKeys.base.details(), id, 'health'] as const,
    withAcademics: (id: string) => 
      [...studentQueryKeys.base.details(), id, 'academics'] as const,
    full: (id: string) => 
      [...studentQueryKeys.base.details(), id, 'full'] as const,
  },
  
  // Search queries
  search: {
    global: (query: string) => 
      [...studentQueryKeys.base.search(), 'global', query] as const,
    byName: (name: string) => 
      [...studentQueryKeys.base.search(), 'name', name] as const,
    byGrade: (grade: string, query: string) => 
      [...studentQueryKeys.base.search(), 'grade', grade, query] as const,
  },
  
  // Health-related queries (high sensitivity)
  health: {
    records: (studentId: string) => 
      [...studentQueryKeys.base.health(), studentId, 'records'] as const,
    allergies: (studentId: string) => 
      [...studentQueryKeys.base.health(), studentId, 'allergies'] as const,
    medications: (studentId: string) => 
      [...studentQueryKeys.base.health(), studentId, 'medications'] as const,
    emergencyInfo: (studentId: string) => 
      [...studentQueryKeys.base.health(), studentId, 'emergency'] as const,
  },
  
  // Statistics and reporting
  statistics: {
    enrollment: () => [...studentQueryKeys.base.statistics(), 'enrollment'] as const,
    byGrade: () => [...studentQueryKeys.base.statistics(), 'grade'] as const,
    attendance: () => [...studentQueryKeys.base.statistics(), 'attendance'] as const,
    health: () => [...studentQueryKeys.base.statistics(), 'health'] as const,
  },
} as const;

/**
 * Student list filters interface
 */
export interface StudentListFilters {
  page?: number;
  limit?: number;
  grade?: string;
  schoolId?: string;
  nurseId?: string;
  isActive?: boolean;
  search?: string;
  enrollmentDateFrom?: string;
  enrollmentDateTo?: string;
  hasHealthAlerts?: boolean;
  hasMedications?: boolean;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Student domain error codes
 */
export const STUDENT_ERROR_CODES = {
  NOT_FOUND: 'STUDENT_NOT_FOUND',
  ACCESS_DENIED: 'STUDENT_ACCESS_DENIED',
  INACTIVE: 'STUDENT_INACTIVE',
  GRADE_MISMATCH: 'STUDENT_GRADE_MISMATCH',
  SCHOOL_MISMATCH: 'STUDENT_SCHOOL_MISMATCH',
  HEALTH_RECORD_MISSING: 'HEALTH_RECORD_MISSING',
  EMERGENCY_CONTACT_REQUIRED: 'EMERGENCY_CONTACT_REQUIRED',
} as const;

/**
 * Student Domain Operation Types for Audit Logging
 *
 * Defines standardized operation identifiers for FERPA-compliant audit logging
 * of all student data access and modifications. Each operation is logged with
 * user context, timestamp, and data sensitivity level.
 *
 * @constant
 * @type {Record<string, string>}
 *
 * @property {string} VIEW_LIST - View student list/directory (bulk access logging)
 * @property {string} VIEW_DETAILS - View individual student details (record-level logging)
 * @property {string} VIEW_HEALTH - Access student health records (PHI access logging)
 * @property {string} SEARCH - Search student records (query pattern logging)
 * @property {string} CREATE - Create new student record (enrollment logging)
 * @property {string} UPDATE - Modify student record (change logging with diff)
 * @property {string} DELETE - Delete/deactivate student record (retention logging)
 * @property {string} TRANSFER - Transfer student to different nurse/school (transfer logging)
 * @property {string} EXPORT - Export student data (data export logging)
 *
 * @remarks
 * **Audit Log Requirements**:
 * All operations must log:
 * - Operation type (from this constant)
 * - User ID and role
 * - Timestamp (ISO 8601 format)
 * - Student ID or filter criteria
 * - Data sensitivity level
 * - Success/failure status
 * - IP address and session ID
 *
 * **FERPA Compliance** (34 CFR §99.32):
 * Educational agencies must maintain a record of each request for access
 * and each disclosure of personally identifiable information from education
 * records. Audit logs fulfill this requirement.
 *
 * **Retention Requirements**:
 * - View operations: 1 year minimum
 * - Modification operations: 7 years minimum
 * - PHI access: Permanent retention per HIPAA
 * - Export operations: Permanent retention for compliance
 *
 * @example
 * ```typescript
 * // Log student list access
 * import { STUDENT_OPERATIONS } from '@/hooks/domains/students/config';
 * import { auditLogger } from '@/services/audit';
 *
 * auditLogger.log({
 *   operation: STUDENT_OPERATIONS.VIEW_LIST,
 *   userId: currentUser.id,
 *   resourceType: 'student',
 *   filters: { grade: '5', isActive: true },
 *   sensitivity: 'internal',
 *   timestamp: new Date().toISOString()
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Log PHI access with justification
 * auditLogger.log({
 *   operation: STUDENT_OPERATIONS.VIEW_HEALTH,
 *   userId: currentUser.id,
 *   resourceType: 'student',
 *   resourceId: 'student-123',
 *   sensitivity: 'phi',
 *   accessReason: 'Medication administration review',
 *   timestamp: new Date().toISOString()
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Log student record modification
 * auditLogger.log({
 *   operation: STUDENT_OPERATIONS.UPDATE,
 *   userId: currentUser.id,
 *   resourceType: 'student',
 *   resourceId: 'student-123',
 *   changes: { grade: '6', nurseId: 'nurse-456' },
 *   previousValues: { grade: '5', nurseId: 'nurse-123' },
 *   sensitivity: 'internal',
 *   timestamp: new Date().toISOString()
 * });
 * ```
 *
 * @see {@link https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html | FERPA §99.32}
 * @see {@link useHealthcareCompliance} for audit logging implementation
 */
export const STUDENT_OPERATIONS = {
  VIEW_LIST: 'view_student_list',
  VIEW_DETAILS: 'view_student_details',
  VIEW_HEALTH: 'view_student_health',
  SEARCH: 'search_students',
  CREATE: 'create_student',
  UPDATE: 'update_student',
  DELETE: 'delete_student',
  TRANSFER: 'transfer_student',
  EXPORT: 'export_student_data',
} as const;
