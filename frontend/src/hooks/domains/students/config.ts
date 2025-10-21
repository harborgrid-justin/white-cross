/**
 * Students Domain Configuration
 * 
 * Centralized configuration for the students domain including
 * query keys, cache strategies, and type definitions.
 * 
 * @module hooks/domains/students/config
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { CACHE_TIMES, type DataSensitivity } from '@/hooks/shared/useCacheManager';

/**
 * Student data sensitivity mapping
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
 * Student domain operation types for audit logging
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