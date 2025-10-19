/**
 * LOC: C41E6D37EC-T01
 * WC-SVC-STU-TYPES | Student Service Type Definitions
 *
 * UPSTREAM (imports from):
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - All student service modules
 */

/**
 * WC-SVC-STU-TYPES | Student Service Type Definitions
 * Purpose: Centralized type definitions and interfaces for student service modules
 * Upstream: database/types/enums.ts | Dependencies: None
 * Downstream: All student service modules | Called by: Student service operations
 * Related: studentService.ts, database models
 * Exports: CreateStudentData, UpdateStudentData, StudentFilters, PaginationMetadata
 * Last Updated: 2025-10-19 | Dependencies: None
 * Critical Path: Type validation → Service operations → Database queries
 * LLM Context: HIPAA-compliant type definitions for student data operations
 */

import { Gender } from '../../database/types/enums';

/**
 * Interface for creating a new student
 * HIPAA Compliance: All fields are protected health information (PHI)
 */
export interface CreateStudentData {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: Gender;
  photo?: string;
  medicalRecordNum?: string;
  nurseId?: string;
  enrollmentDate?: Date;
  createdBy?: string;
}

/**
 * Interface for updating student information
 * HIPAA Compliance: Partial updates allowed, all PHI changes logged
 */
export interface UpdateStudentData {
  studentNumber?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  grade?: string;
  gender?: Gender;
  photo?: string;
  medicalRecordNum?: string;
  nurseId?: string;
  isActive?: boolean;
  enrollmentDate?: Date;
  updatedBy?: string;
}

/**
 * Interface for filtering student queries
 * Used for search, filtering, and reporting operations
 */
export interface StudentFilters {
  search?: string;
  grade?: string;
  isActive?: boolean;
  nurseId?: string;
  hasAllergies?: boolean;
  hasMedications?: boolean;
  gender?: Gender;
}

/**
 * Pagination metadata for list responses
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Paginated student list response
 */
export interface PaginatedStudentResponse {
  students: any[];
  pagination: PaginationMetadata;
}

/**
 * Student statistics aggregation
 */
export interface StudentStatistics {
  healthRecords: number;
  allergies: number;
  medications: number;
  appointments: number;
  incidents: number;
}

/**
 * Student data export structure for compliance
 */
export interface StudentDataExport {
  exportDate: string;
  student: any;
  statistics: StudentStatistics;
}

/**
 * Validation result structure
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Normalization result for student data
 */
export interface NormalizationResult {
  studentNumber?: string;
  medicalRecordNum?: string;
  firstName?: string;
  lastName?: string;
}
