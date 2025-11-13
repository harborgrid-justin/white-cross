/**
 * @fileoverview Student Module Types
 * @module student/types
 * @description Type definitions and interfaces for student module
 */

import { Student } from '../entities/student.entity';

/**
 * Paginated Response Interface
 *
 * Generic pagination wrapper for student queries.
 * Uses simplified meta structure compatible with existing endpoints.
 *
 * @typeParam T - The type of data being paginated
 *
 * @example
 * ```typescript
 * const response: PaginatedResponse<Student> = {
 *   data: students,
 *   meta: {
 *     page: 1,
 *     limit: 20,
 *     total: 100,
 *     pages: 5
 *   }
 * };
 * ```
 */
export interface PaginatedResponse<T> {
  /** Array of data items for current page */
  data: T[];

  /** Pagination metadata */
  meta: {
    /** Current page number (1-indexed) */
    page: number;

    /** Number of items per page */
    limit: number;

    /** Total number of items across all pages */
    total: number;

    /** Total number of pages */
    pages: number;
  };
}

/**
 * Student Statistics Interface
 *
 * Aggregated statistics for a student's health and academic records.
 * Used for dashboard displays and quick overview of student status.
 *
 * @example
 * ```typescript
 * const stats: StudentStatistics = {
 *   healthRecords: 15,
 *   allergies: 2,
 *   medications: 1,
 *   appointments: 8,
 *   incidents: 0
 * };
 * ```
 */
export interface StudentStatistics {
  /** Total number of health records */
  healthRecords: number;

  /** Number of documented allergies */
  allergies: number;

  /** Number of active medications */
  medications: number;

  /** Total appointment count */
  appointments: number;

  /** Total incident count */
  incidents: number;
}

/**
 * Student Data Export Interface
 *
 * Comprehensive data export structure for compliance and reporting.
 * Includes full student profile plus aggregated statistics.
 *
 * HIPAA Compliance:
 * - All exports must be logged for audit trail
 * - Access requires appropriate permissions
 * - Data must be encrypted during transit
 *
 * @example
 * ```typescript
 * const exportData: StudentDataExport = {
 *   exportDate: '2025-10-29T14:30:00Z',
 *   student: studentEntity,
 *   statistics: studentStats
 * };
 * ```
 */
export interface StudentDataExport {
  /** ISO 8601 timestamp of export generation */
  exportDate: string;

  /** Complete student entity with all fields */
  student: Student;

  /** Aggregated statistics */
  statistics: StudentStatistics;
}

/**
 * Photo Search Metadata
 *
 * Optional metadata filters for photo search operations.
 * Used to narrow facial recognition search results.
 */
export interface PhotoSearchMetadata {
  /** Grade level filter */
  grade?: string;

  /** Gender filter */
  gender?: string;

  /** Age range filter (min) */
  ageMin?: number;

  /** Age range filter (max) */
  ageMax?: number;

  /** Additional custom filters */
  [key: string]: any;
}

/**
 * Photo Upload Metadata
 *
 * Metadata associated with photo uploads.
 * Tracks capture information for audit and quality purposes.
 */
export interface PhotoUploadMetadata {
  /** ISO 8601 timestamp of photo capture */
  captureDate?: string;

  /** Device used for capture (e.g., "iPad Pro", "iPhone 13") */
  device?: string;

  /** Location where photo was taken */
  location?: string;

  /** Name of person who took the photo */
  photographer?: string;

  /** Image resolution (e.g., "1920x1080") */
  resolution?: string;

  /** Additional custom metadata */
  [key: string]: any;
}

/**
 * Bulk Operation Result
 *
 * Result summary for bulk update operations.
 */
export interface BulkOperationResult {
  /** Number of records successfully updated */
  updated: number;

  /** Optional array of updated record IDs */
  updatedIds?: string[];

  /** Optional array of error messages for failed updates */
  errors?: string[];
}

/**
 * Grade Transition Result
 *
 * Detailed results from bulk grade transition operation.
 */
export interface GradeTransitionResult {
  /** Total number of students processed */
  total: number;

  /** Number of students promoted */
  promoted: number;

  /** Number of students retained */
  retained: number;

  /** Number of students graduated */
  graduated: number;

  /** Detailed results per student */
  details: GradeTransitionDetail[];
}

/**
 * Grade Transition Detail
 *
 * Per-student detail for grade transition results.
 */
export interface GradeTransitionDetail {
  /** Student UUID */
  studentId: string;

  /** Student number */
  studentNumber: string;

  /** Full student name */
  studentName: string;

  /** Current grade before transition */
  currentGrade: string;

  /** New grade after transition */
  newGrade: string;

  /** Transition action taken */
  action: 'promoted' | 'retained' | 'graduated';

  /** Criteria evaluation results */
  meetsCriteria: {
    /** Whether student meets GPA criteria */
    gpa: boolean;

    /** Whether student meets attendance criteria */
    attendance: boolean;

    /** Whether student has passing grades */
    passingGrades: boolean;
  };
}

/**
 * Academic Performance Trend Analysis
 *
 * Trend analysis results for student academic performance.
 */
export interface PerformanceTrendAnalysis {
  /** GPA trend analysis */
  gpa?: {
    /** Trend direction: 'improving' | 'declining' | 'stable' */
    trend: string;

    /** Average GPA across analyzed period */
    average: number;

    /** GPA values by period */
    values: number[];
  };

  /** Attendance trend analysis */
  attendance?: {
    /** Trend direction */
    trend: string;

    /** Average attendance rate */
    average: number;

    /** Attendance rates by period */
    values: number[];
  };

  /** Subject-specific performance */
  subjects?: {
    [subjectName: string]: {
      trend: string;
      average: number;
      values: number[];
    };
  };
}

/**
 * Waitlist Entry
 *
 * Represents a student's position on an appointment waitlist.
 */
export interface WaitlistEntry {
  /** Unique waitlist entry ID */
  id: string;

  /** Student UUID */
  studentId: string;

  /** Appointment type */
  appointmentType: string;

  /** Priority level */
  priority: 'low' | 'medium' | 'high' | 'urgent';

  /** Current position in queue */
  position: number;

  /** Estimated wait time in minutes */
  estimatedWaitTime?: number;

  /** Entry creation timestamp */
  createdAt: Date;

  /** Additional notes */
  notes?: string;
}

/**
 * Barcode Scan Result
 *
 * Result from barcode scanning operation.
 */
export interface BarcodeScanResult {
  /** Whether scan was successful */
  success: boolean;

  /** Decoded barcode string */
  barcodeString: string;

  /** Type of entity found */
  entityType: 'student' | 'medication' | 'equipment' | 'unknown';

  /** Entity data (Student, Medication, etc.) */
  entity?: any;

  /** Error message if scan failed */
  error?: string;
}

/**
 * Medication Verification Result
 *
 * Result from three-point medication verification.
 */
export interface MedicationVerificationResult {
  /** Whether verification passed */
  verified: boolean;

  /** Student information */
  student?: {
    id: string;
    name: string;
  };

  /** Medication information */
  medication?: {
    id: string;
    name: string;
    dosage: string;
  };

  /** Nurse information */
  nurse?: {
    id: string;
    name: string;
  };

  /** Five Rights verification checks */
  fiveRightsChecks: {
    rightPatient: boolean;
    rightMedication: boolean;
    rightDose: boolean;
    rightTime: boolean;
    rightRoute: boolean;
  };

  /** Verification timestamp */
  timestamp: Date;

  /** Error messages for failed checks */
  errors?: string[];
}
