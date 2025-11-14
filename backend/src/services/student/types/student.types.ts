/**
 * @fileoverview Student Module Types
 * @module student/types
 * @description Type definitions and interfaces for student module
 */

import { Student } from '@/database/models';

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
  [key: string]: string | number | boolean | undefined;
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
  [key: string]: string | number | boolean | undefined;
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
  entity?: Student | Record<string, unknown>;

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

/**
 * Health Records Response
 *
 * Response structure for student health records query.
 */
export interface HealthRecordsResponse {
  /** Array of health records */
  records: Record<string, unknown>[];

  /** Pagination metadata */
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Mental Health Records Response
 *
 * Response structure for student mental health records query.
 */
export interface MentalHealthRecordsResponse {
  /** Array of mental health records */
  records: Record<string, unknown>[];

  /** Pagination metadata */
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Photo Upload Response
 *
 * Response from photo upload operation.
 */
export interface PhotoUploadResponse {
  /** Whether upload was successful */
  success: boolean;

  /** URL to uploaded photo */
  photoUrl: string;

  /** Photo ID in system */
  photoId: string;

  /** Facial recognition match confidence (0-100) */
  matchConfidence?: number;

  /** Upload timestamp */
  uploadedAt: Date;
}

/**
 * Photo Search Response
 *
 * Response from facial recognition photo search.
 */
export interface PhotoSearchResponse {
  /** Whether search completed successfully */
  success: boolean;

  /** Array of matched students */
  matches: Array<{
    student: Student;
    confidence: number;
    photoUrl: string;
  }>;

  /** Total matches found */
  totalMatches: number;
}

/**
 * Academic Transcript Import Response
 *
 * Response from academic transcript import operation.
 */
export interface AcademicTranscriptImportResponse {
  /** Whether import was successful */
  success: boolean;

  /** Number of records imported */
  recordsImported: number;

  /** Array of imported course IDs */
  courseIds: string[];

  /** Import timestamp */
  importedAt: Date;

  /** Any warnings or issues encountered */
  warnings?: string[];
}

/**
 * Academic History Response
 *
 * Response structure for academic history query.
 */
export interface AcademicHistoryResponse {
  /** Student ID */
  studentId: string;

  /** Array of academic periods */
  periods: Array<{
    period: string;
    year: string;
    gpa: number;
    courses: Array<{
      courseId: string;
      courseName: string;
      grade: string;
      credits: number;
    }>;
  }>;

  /** Overall GPA */
  overallGpa: number;

  /** Total credits earned */
  totalCredits: number;
}

/**
 * Performance Trends Response
 *
 * Response structure for performance trend analysis.
 */
export interface PerformanceTrendsResponse {
  /** Student ID */
  studentId: string;

  /** Analysis period */
  period: string;

  /** Trend analysis data */
  trends: PerformanceTrendAnalysis;

  /** Generated timestamp */
  generatedAt: Date;
}

/**
 * Bulk Grade Transition Response
 *
 * Response from bulk grade transition operation.
 */
export interface BulkGradeTransitionResponse {
  /** Detailed results */
  results: GradeTransitionResult;

  /** Operation timestamp */
  completedAt: Date;
}

/**
 * Graduating Students Response
 *
 * Response structure for graduating students query.
 */
export interface GraduatingStudentsResponse {
  /** Array of graduating students */
  students: Student[];

  /** Total count */
  total: number;

  /** Graduation date */
  graduationDate: Date;

  /** Class year */
  classYear: string;
}

/**
 * Grade Transition Response
 *
 * Response from individual grade transition operation.
 */
export interface GradeTransitionResponse {
  /** Updated student */
  student: Student;

  /** Previous grade */
  previousGrade: string;

  /** New grade */
  newGrade: string;

  /** Transition type */
  action: 'promoted' | 'retained' | 'graduated';

  /** Transition timestamp */
  transitionedAt: Date;
}

/**
 * Graduation Response
 *
 * Response from student graduation operation.
 */
export interface GraduationResponse {
  /** Graduated student */
  student: Student;

  /** Graduation date */
  graduationDate: Date;

  /** Final GPA */
  finalGpa: number;

  /** Total credits */
  totalCredits: number;

  /** Honors/distinctions */
  honors?: string[];
}

/**
 * Grade Transition History Response
 *
 * Response structure for grade transition history query.
 */
export interface GradeTransitionHistoryResponse {
  /** Student ID */
  studentId: string;

  /** Array of historical transitions */
  transitions: Array<{
    date: Date;
    fromGrade: string;
    toGrade: string;
    action: 'promoted' | 'retained' | 'graduated';
    reason?: string;
  }>;

  /** Total transitions */
  total: number;
}

/**
 * Waitlist Add Response
 *
 * Response from adding student to waitlist.
 */
export interface WaitlistAddResponse {
  /** Waitlist entry details */
  entry: WaitlistEntry;

  /** Success message */
  message: string;
}

/**
 * Waitlist Status Response
 *
 * Response structure for waitlist status query.
 */
export interface WaitlistStatusResponse {
  /** Student ID */
  studentId: string;

  /** Array of active waitlist entries */
  entries: WaitlistEntry[];

  /** Total active entries */
  totalActive: number;

  /** Estimated total wait time */
  totalEstimatedWait?: number;
}

/**
 * Barcode Generation Response
 *
 * Response from barcode generation operation.
 */
export interface BarcodeGenerationResponse {
  /** Generated barcode string */
  barcodeString: string;

  /** Barcode format */
  format: 'CODE128' | 'QR' | 'PDF417';

  /** Base64 encoded barcode image */
  barcodeImage?: string;

  /** Generation timestamp */
  generatedAt: Date;
}

/**
 * Barcode Verification Response
 *
 * Response from barcode verification operation.
 */
export interface BarcodeVerificationResponse {
  /** Whether barcode is valid */
  valid: boolean;

  /** Associated student if found */
  student?: Student;

  /** Barcode string */
  barcodeString: string;

  /** Verification timestamp */
  verifiedAt: Date;

  /** Error message if invalid */
  error?: string;
}

/**
 * Waitlist Priority Update Response
 *
 * Response from waitlist priority update operation.
 */
export interface WaitlistPriorityUpdateResponse {
  /** Updated waitlist entry */
  entry: WaitlistEntry;

  /** Previous priority */
  previousPriority: string;

  /** New priority */
  newPriority: string;

  /** Update timestamp */
  updatedAt: Date;

  /** Success message */
  message: string;
}
