/**
 * @fileoverview Students API Module Exports
 * 
 * Centralized export point for all student API functionality including
 * the main service class, types, validation schemas, and utility functions.
 * 
 * @module studentsApi
 * @version 1.0.0
 * @since 2025-11-11
 */

// Main service class
export { StudentsApi } from './studentsApi';

// Core and specialized operation classes (for advanced usage)
export { StudentCoreOperations } from './core-operations';
export { StudentSpecializedOperations } from './specialized-operations';

// Type definitions
export type {
  // Core domain types
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
  
  // API-specific types
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
} from './types';

// Validation schemas and constants
export {
  VALID_GRADES,
  PHONE_REGEX,
  EMAIL_REGEX,
  MEDICAL_RECORD_REGEX,
  STUDENT_NUMBER_REGEX,
  createStudentSchema,
  updateStudentSchema,
  studentFiltersSchema,
} from './validation';

// Factory function for creating service instances
import type { ApiClient } from '@/services/core/ApiClient';
import { StudentsApi } from './studentsApi';

/**
 * Factory function for creating StudentsApi instances
 * 
 * @param client - API client instance
 * @returns Configured StudentsApi instance
 * 
 * @example
 * ```typescript
 * import { createStudentsApi } from '@/services/modules/studentsApi';
 * import { apiClient } from '@/services/core/ApiClient';
 * 
 * const studentsApi = createStudentsApi(apiClient);
 * const students = await studentsApi.getAll({ page: 1, limit: 20 });
 * ```
 */
export function createStudentsApi(client: ApiClient): StudentsApi {
  return new StudentsApi(client);
}

// Default singleton instance (created with default API client)
import { apiClient } from '@/services/core/ApiClient';

/**
 * Default StudentsApi singleton instance
 * 
 * Pre-configured instance using the default API client for immediate use
 * throughout the application. Most consumers should use this instance.
 * 
 * @example
 * ```typescript
 * import { studentsApi } from '@/services/modules/studentsApi';
 * 
 * // Create a new student
 * const newStudent = await studentsApi.create({
 *   studentNumber: 'STU-2025-001',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: '2010-05-15',
 *   grade: '5',
 *   gender: 'MALE'
 * });
 * 
 * // Get all students with filtering
 * const students = await studentsApi.getAll({
 *   grade: '5',
 *   isActive: true,
 *   page: 1,
 *   limit: 20
 * });
 * ```
 */
export const studentsApi = createStudentsApi(apiClient);

/**
 * @fileoverview Module Summary
 * 
 * This module provides comprehensive student management functionality through
 * a clean, modular API structure:
 * 
 * **Core Features:**
 * - Complete CRUD operations with validation
 * - Advanced search and filtering capabilities  
 * - Bulk operations for efficiency
 * - PHI-compliant data export and audit logging
 * - Health record access with proper permissions
 * - Nurse assignment and transfer management
 * 
 * **Architecture:**
 * - `validation.ts` - Zod schemas and validation constants
 * - `types.ts` - TypeScript type definitions
 * - `core-operations.ts` - Basic CRUD operations
 * - `specialized-operations.ts` - Advanced operations
 * - `studentsApi.ts` - Main service class combining all operations
 * - `index.ts` - Clean export interface
 * 
 * **Usage Patterns:**
 * 
 * ```typescript
 * // Most common - use the singleton instance
 * import { studentsApi } from '@/services/modules/studentsApi';
 * const students = await studentsApi.getAll();
 * 
 * // Advanced - create custom instance
 * import { createStudentsApi } from '@/services/modules/studentsApi';
 * const customApi = createStudentsApi(customClient);
 * 
 * // Types only
 * import type { Student, CreateStudentData } from '@/services/modules/studentsApi';
 * 
 * // Validation
 * import { createStudentSchema } from '@/services/modules/studentsApi';
 * const validatedData = createStudentSchema.parse(rawData);
 * ```
 * 
 * **HIPAA Compliance:**
 * All operations automatically include audit logging for compliance.
 * PHI access is tracked and logged with appropriate context information.
 * 
 * **Backward Compatibility:**
 * The main service class includes legacy method aliases to ensure
 * existing code continues to work during the migration period.
 */
