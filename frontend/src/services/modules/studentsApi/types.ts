/**
 * @fileoverview Students API Type Definitions
 * 
 * Centralized type definitions for student data operations including request/response
 * interfaces, domain models, and API-specific types that complement the main domain types.
 * 
 * @module studentsApi/types
 * @version 1.0.0
 * @since 2025-11-11
 */

import type {
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
} from '@/types/domain/student.types';

/**
 * Re-export domain types for convenience
 */
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
};

/**
 * API response wrapper matching backend response structure
 *
 * Standardizes all student API responses for consistent error handling
 * and data extraction across the frontend.
 *
 * @template T - The type of data returned in the response
 */
export interface BackendApiResponse<T> {
  /** Indicates if the operation succeeded */
  success: boolean;
  /** Response data if successful */
  data?: T;
  /** Error object if operation failed */
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
  /** Optional success/info message */
  message?: string;
  /** Optional metadata about the response */
  meta?: {
    timestamp?: string;
    requestId?: string;
    version?: string;
  };
}

/**
 * Student API operation result wrapper
 * 
 * Provides consistent response format for all student operations
 * with standardized success/error handling.
 */
export interface StudentApiResult<T = unknown> {
  /** Operation success status */
  success: boolean;
  /** Result data if successful */
  data?: T;
  /** Error message if failed */
  error?: string;
  /** Additional context information */
  message?: string;
}

/**
 * Student search parameters for advanced queries
 * 
 * Extends basic StudentFilters with additional search capabilities
 * for complex student lookup operations.
 */
export interface StudentSearchParams extends StudentFilters {
  /** Search across multiple fields simultaneously */
  multiFieldSearch?: boolean;
  /** Include inactive students in results */
  includeInactive?: boolean;
  /** Sort field for results */
  sortBy?: 'firstName' | 'lastName' | 'studentNumber' | 'grade' | 'enrollmentDate';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Fields to include in response */
  fields?: string[];
  /** Include related data */
  include?: ('nurse' | 'emergencyContacts' | 'healthRecords' | 'appointments')[];
}

/**
 * Bulk operation response structure
 * 
 * Provides detailed feedback for batch operations including
 * success/failure counts and individual operation results.
 */
export interface BulkOperationResponse {
  /** Total number of items processed */
  totalProcessed: number;
  /** Number of successful operations */
  successCount: number;
  /** Number of failed operations */
  errorCount: number;
  /** Detailed results for each operation */
  results: Array<{
    id: string;
    success: boolean;
    error?: string;
  }>;
  /** Overall operation summary */
  summary: {
    duration: number;
    startTime: string;
    endTime: string;
  };
}

/**
 * Student validation error details
 * 
 * Structured validation error information for detailed
 * user feedback and debugging support.
 */
export interface StudentValidationError {
  /** Field that failed validation */
  field: string;
  /** Validation error message */
  message: string;
  /** Invalid value that was provided */
  value?: unknown;
  /** Validation rule that was violated */
  rule?: string;
  /** Additional context about the error */
  context?: Record<string, unknown>;
}

/**
 * Student assignment change request
 * 
 * Structure for requesting changes to student-nurse assignments
 * including transfer justification and effective dates.
 */
export interface StudentAssignmentRequest {
  /** Target nurse ID */
  nurseId: string;
  /** Effective date for the assignment change */
  effectiveDate?: string;
  /** Reason for the assignment change */
  reason?: string;
  /** Additional notes about the transfer */
  notes?: string;
  /** Previous nurse ID for audit trail */
  previousNurseId?: string;
}

/**
 * Student enrollment data structure
 * 
 * Complete enrollment information including academic
 * and administrative details for new student registration.
 */
export interface StudentEnrollmentData extends CreateStudentData {
  /** Academic year for enrollment */
  academicYear?: string;
  /** School or campus identifier */
  schoolId?: string;
  /** Enrollment type (new, transfer, returning) */
  enrollmentType?: 'new' | 'transfer' | 'returning';
  /** Previous school information for transfers */
  previousSchool?: {
    name: string;
    address?: string;
    lastAttendanceDate?: string;
    transcriptRequested?: boolean;
  };
  /** Parent/guardian information */
  guardianInfo?: {
    primaryGuardianId?: string;
    emergencyContactIds?: string[];
    custodyArrangements?: string;
  };
}

/**
 * Student health summary for quick access
 * 
 * Essential health information for immediate
 * reference during student interactions.
 */
export interface StudentHealthSummary {
  /** Student identifier */
  studentId: string;
  /** Critical allergies */
  criticalAllergies: string[];
  /** Current medications */
  currentMedications: string[];
  /** Active health conditions */
  activeConditions: string[];
  /** Emergency medical information */
  emergencyInfo?: string;
  /** Last health record update */
  lastUpdated: string;
  /** Health record access level */
  accessLevel: 'basic' | 'full' | 'restricted';
}

/**
 * Student academic summary
 * 
 * Academic performance and status information
 * for educational planning and support.
 */
export interface StudentAcademicSummary {
  /** Current grade level */
  currentGrade: string;
  /** Academic status */
  status: 'active' | 'inactive' | 'transferred' | 'graduated';
  /** Attendance summary */
  attendance: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendanceRate: number;
  };
  /** Special education services */
  specialServices?: string[];
  /** Academic accommodations */
  accommodations?: string[];
}

/**
 * Student export options
 * 
 * Configuration options for student data export
 * operations with compliance and format controls.
 */
export interface StudentExportOptions {
  /** Data format for export */
  format: 'json' | 'csv' | 'xlsx' | 'pdf';
  /** Fields to include in export */
  fields?: string[];
  /** Include PHI data (requires special permissions) */
  includePHI?: boolean;
  /** Date range for time-based data */
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  /** Export purpose for audit trail */
  purpose?: string;
  /** Compression options for large exports */
  compression?: 'none' | 'zip' | 'gzip';
}

/**
 * Student query builder parameters
 * 
 * Advanced query construction for complex
 * student data retrieval operations.
 */
export interface StudentQueryBuilder {
  /** Base filters */
  filters: StudentFilters;
  /** Logical operators for combining filters */
  operators?: Array<{
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'ilike';
    value: unknown;
  }>;
  /** Join operations */
  joins?: Array<{
    table: string;
    on: string;
    type: 'inner' | 'left' | 'right' | 'full';
  }>;
  /** Aggregation functions */
  aggregations?: Array<{
    function: 'count' | 'sum' | 'avg' | 'min' | 'max';
    field: string;
    alias?: string;
  }>;
  /** Group by fields */
  groupBy?: string[];
  /** Having clauses for grouped results */
  having?: Array<{
    field: string;
    operator: string;
    value: unknown;
  }>;
}
