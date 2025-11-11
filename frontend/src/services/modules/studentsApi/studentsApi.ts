/**
 * @fileoverview Students API Main Service Class
 * 
 * Main service class that combines core and specialized student operations
 * providing a unified interface for all student management functionality.
 * 
 * @module studentsApi/studentsApi
 * @version 1.0.0
 * @since 2025-11-11
 */

import type { ApiClient } from '@/services/core/ApiClient';
import { StudentCoreOperations } from './core-operations';
import { StudentSpecializedOperations } from './specialized-operations';
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
  BulkOperationResponse,
  StudentSearchParams,
  StudentHealthSummary,
  StudentExportOptions,
} from './types';

/**
 * Main Students API service class
 * 
 * Provides comprehensive frontend access to student management endpoints including
 * student CRUD operations, enrollment, transfers, nurse assignments, and PHI-protected
 * data access. All operations include HIPAA-compliant audit logging and comprehensive
 * validation aligned with backend Sequelize model constraints.
 * 
 * **Key Features:**
 * - Student CRUD operations with comprehensive validation
 * - Student search and filtering with pagination
 * - Nurse assignment and transfer management
 * - Student enrollment and reactivation workflows
 * - Grade-level and assigned student queries
 * - Bulk update operations for efficiency
 * - PHI-compliant data export with audit logging
 * - Health and mental health record access
 * - Soft delete with reactivation support
 * 
 * **HIPAA Compliance:**
 * - All student operations trigger PHI access audit logs via auditService
 * - Student demographic data treated as Protected Health Information (PHI)
 * - Success and failure logging for all PHI access operations
 * - Audit context includes user identity, timestamp, and operation details
 * - Export operations require explicit audit trail for compliance
 * - Mental health records have additional access restrictions
 * 
 * **Validation and Data Integrity:**
 * - Frontend validation mirrors backend Sequelize model constraints
 * - Zod schemas enforce data integrity before API calls
 * - Student number format: Alphanumeric 4-20 chars (e.g., "STU-2025-001")
 * - Medical record number format: Alphanumeric 5-20 chars (e.g., "MRN-12345")
 * - Phone number validation: US formats supported
 * - Date of birth validation: 3-100 years ago
 * - Grade validation: K-12, Pre-K, TK, or custom formats
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
 * // Search for students
 * const students = await studentsApi.getAll({
 *   search: 'john',
 *   grade: '5',
 *   isActive: true,
 *   page: 1,
 *   limit: 20
 * });
 * 
 * // Transfer student to new nurse
 * const transferredStudent = await studentsApi.transfer('student-id', {
 *   nurseId: 'nurse-id',
 *   reason: 'Workload redistribution'
 * });
 * ```
 */
export class StudentsApi {
  private coreOps: StudentCoreOperations;
  private specializedOps: StudentSpecializedOperations;

  constructor(private client: ApiClient) {
    this.coreOps = new StudentCoreOperations(client);
    this.specializedOps = new StudentSpecializedOperations(client);
  }

  // ===================
  // CORE OPERATIONS
  // ===================

  /**
   * Get all students with optional filtering and pagination
   * 
   * Retrieves student list with support for search, filtering, and pagination.
   * Results are returned in a standardized paginated format with metadata.
   * 
   * @param filters - Optional filtering and pagination parameters
   * @returns Promise resolving to paginated student list
   * @throws {Error} When validation fails or API request fails
   * 
   * @example
   * ```typescript
   * const students = await studentsApi.getAll({
   *   grade: '5',
   *   isActive: true,
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  async getAll(filters: StudentFilters = {}): Promise<PaginatedStudentsResponse> {
    return this.coreOps.getAll(filters);
  }

  /**
   * Get student by ID with complete profile information
   * 
   * Retrieves a single student's complete profile including all associated
   * data. This operation logs PHI access for HIPAA compliance.
   * 
   * @param id - Unique student identifier
   * @returns Promise resolving to complete student profile
   * @throws {Error} When student ID is missing, not found, or API request fails
   * 
   * @example
   * ```typescript
   * const student = await studentsApi.getById('123e4567-e89b-12d3-a456-426614174000');
   * console.log(`${student.firstName} ${student.lastName}`);
   * ```
   */
  async getById(id: string): Promise<Student> {
    return this.coreOps.getById(id);
  }

  /**
   * Create new student with comprehensive validation
   * 
   * Creates a new student record with full validation and audit logging.
   * All required fields are validated against business rules before submission.
   * 
   * @param studentData - Complete student creation data
   * @returns Promise resolving to newly created student
   * @throws {Error} When validation fails or creation fails
   * 
   * @example
   * ```typescript
   * const newStudent = await studentsApi.create({
   *   studentNumber: 'STU-2025-001',
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   dateOfBirth: '2010-05-15',
   *   grade: '5',
   *   gender: 'MALE'
   * });
   * ```
   */
  async create(studentData: CreateStudentData): Promise<Student> {
    return this.coreOps.create(studentData);
  }

  /**
   * Update existing student information
   * 
   * Updates student data with validation and change tracking. Only provided
   * fields are updated, maintaining data integrity for unchanged fields.
   * 
   * @param id - Student identifier to update
   * @param studentData - Partial student data with changes
   * @returns Promise resolving to updated student
   * @throws {Error} When student ID is missing, validation fails, or update fails
   * 
   * @example
   * ```typescript
   * const updated = await studentsApi.update('student-id', {
   *   grade: '6',
   *   nurseId: 'new-nurse-id'
   * });
   * ```
   */
  async update(id: string, studentData: UpdateStudentData): Promise<Student> {
    return this.coreOps.update(id, studentData);
  }

  /**
   * Deactivate student (soft delete)
   * 
   * Performs a soft delete by marking the student as inactive rather than
   * permanently removing the record. This preserves data integrity and
   * maintains audit trail for HIPAA compliance.
   * 
   * @param id - Student identifier to deactivate
   * @returns Promise resolving to operation result
   * @throws {Error} When student ID is missing or deactivation fails
   * 
   * @example
   * ```typescript
   * const result = await studentsApi.deactivate('student-id');
   * console.log(result.message); // "Student deactivated successfully"
   * ```
   */
  async deactivate(id: string): Promise<{ success: boolean; message: string }> {
    return this.coreOps.deactivate(id);
  }

  /**
   * Reactivate a previously deactivated student
   * 
   * Restores a deactivated student to active status, allowing them to
   * participate in normal school operations again.
   * 
   * @param id - Student identifier to reactivate
   * @returns Promise resolving to reactivated student
   * @throws {Error} When student ID is missing or reactivation fails
   * 
   * @example
   * ```typescript
   * const student = await studentsApi.reactivate('student-id');
   * console.log(`${student.firstName} is now active`);
   * ```
   */
  async reactivate(id: string): Promise<Student> {
    return this.coreOps.reactivate(id);
  }

  /**
   * Permanently delete student (use with extreme caution)
   * 
   * WARNING: This permanently removes all student data from the system.
   * Use only when required for legal compliance (e.g., GDPR right to be forgotten).
   * This operation cannot be undone and requires special permissions.
   * 
   * @param id - Student identifier to permanently delete
   * @returns Promise resolving to deletion confirmation
   * @throws {Error} When student ID is missing or deletion fails
   * 
   * @example
   * ```typescript
   * // Only use in exceptional circumstances
   * const result = await studentsApi.permanentDelete('student-id');
   * console.log(result.message); // "Student permanently deleted"
   * ```
   */
  async permanentDelete(id: string): Promise<{ success: boolean; message: string }> {
    return this.coreOps.permanentDelete(id);
  }

  // ===================
  // SPECIALIZED OPERATIONS
  // ===================

  /**
   * Transfer student to a different nurse
   * 
   * Handles the complete transfer process including validation, audit logging,
   * and notification to relevant parties. Maintains complete transfer history.
   * 
   * @param id - Student identifier to transfer
   * @param transferData - Transfer request details including target nurse
   * @returns Promise resolving to updated student with new assignment
   * @throws {Error} When validation fails or transfer fails
   * 
   * @example
   * ```typescript
   * const transferredStudent = await studentsApi.transfer('student-id', {
   *   nurseId: 'new-nurse-id',
   *   reason: 'Workload redistribution',
   *   effectiveDate: '2025-01-15'
   * });
   * ```
   */
  async transfer(id: string, transferData: TransferStudentRequest): Promise<Student> {
    return this.specializedOps.transfer(id, transferData);
  }

  /**
   * Get students by grade level
   * 
   * Retrieves all students in a specific grade with optional filtering
   * and sorting capabilities. Useful for grade-level operations.
   * 
   * @param grade - Grade level to query
   * @param includeInactive - Whether to include inactive students
   * @returns Promise resolving to array of students in the grade
   * @throws {Error} When grade is missing or query fails
   * 
   * @example
   * ```typescript
   * const fifthGraders = await studentsApi.getByGrade('5', false);
   * console.log(`Found ${fifthGraders.length} active 5th graders`);
   * ```
   */
  async getByGrade(grade: string, includeInactive: boolean = false): Promise<Student[]> {
    return this.specializedOps.getByGrade(grade, includeInactive);
  }

  /**
   * Advanced student search with multiple criteria
   * 
   * Performs complex search queries across student records with support
   * for multiple search criteria and advanced filtering options.
   * 
   * @param searchParams - Advanced search parameters
   * @returns Promise resolving to matching students
   * @throws {Error} When search fails
   * 
   * @example
   * ```typescript
   * const results = await studentsApi.advancedSearch({
   *   search: 'john',
   *   grade: '5',
   *   hasAllergies: true,
   *   sortBy: 'lastName',
   *   sortOrder: 'asc'
   * });
   * ```
   */
  async advancedSearch(searchParams: StudentSearchParams): Promise<Student[]> {
    return this.specializedOps.advancedSearch(searchParams);
  }

  /**
   * Simple text search across student records
   * 
   * Performs a text-based search across student names, numbers, and other
   * searchable fields. Optimized for quick lookups and autocomplete.
   * 
   * @param query - Search query string
   * @param limit - Maximum number of results to return
   * @returns Promise resolving to matching students
   * @throws {Error} When search fails
   * 
   * @example
   * ```typescript
   * const matches = await studentsApi.search('john doe', 10);
   * ```
   */
  async search(query: string, limit?: number): Promise<Student[]> {
    return this.specializedOps.search(query, limit);
  }

  /**
   * Get students assigned to current user (for nurses)
   * 
   * Retrieves all students currently assigned to the authenticated user.
   * Typically used by nurses to see their assigned students.
   * 
   * @param includeInactive - Whether to include inactive students
   * @returns Promise resolving to assigned students
   * @throws {Error} When query fails
   * 
   * @example
   * ```typescript
   * const myStudents = await studentsApi.getAssignedStudents();
   * console.log(`I have ${myStudents.length} assigned students`);
   * ```
   */
  async getAssignedStudents(includeInactive: boolean = false): Promise<Student[]> {
    return this.specializedOps.getAssignedStudents(includeInactive);
  }

  /**
   * Get comprehensive student statistics
   * 
   * Retrieves detailed statistics for a student including health records,
   * appointment history, and other relevant metrics.
   * 
   * @param studentId - Student identifier
   * @returns Promise resolving to student statistics
   * @throws {Error} When student ID is missing or query fails
   * 
   * @example
   * ```typescript
   * const stats = await studentsApi.getStatistics('student-id');
   * console.log(`Student has ${stats.totalAppointments} total appointments`);
   * ```
   */
  async getStatistics(studentId: string): Promise<StudentStatistics> {
    return this.specializedOps.getStatistics(studentId);
  }

  /**
   * Bulk update multiple students
   * 
   * Performs batch updates on multiple students simultaneously.
   * Useful for mass operations like grade transitions or nurse reassignments.
   * 
   * @param bulkData - Bulk update request with student IDs and changes
   * @returns Promise resolving to bulk operation results
   * @throws {Error} When validation fails or bulk update fails
   * 
   * @example
   * ```typescript
   * const result = await studentsApi.bulkUpdate({
   *   studentIds: ['id1', 'id2', 'id3'],
   *   updates: { grade: '6', nurseId: 'new-nurse-id' }
   * });
   * console.log(`Updated ${result.updatedCount} students`);
   * ```
   */
  async bulkUpdate(bulkData: BulkUpdateStudentsRequest): Promise<BulkOperationResponse> {
    return this.specializedOps.bulkUpdate(bulkData);
  }

  /**
   * Get all unique grades in the system
   * 
   * Retrieves a list of all grade levels currently in use,
   * useful for building grade filter dropdowns.
   * 
   * @returns Promise resolving to array of grade strings
   * @throws {Error} When query fails
   * 
   * @example
   * ```typescript
   * const grades = await studentsApi.getAllGrades();
   * // ['K', '1', '2', '3', '4', '5', 'Pre-K']
   * ```
   */
  async getAllGrades(): Promise<string[]> {
    return this.specializedOps.getAllGrades();
  }

  /**
   * Export student data for reporting or compliance
   * 
   * CRITICAL: Exports contain PHI and must be audited immediately.
   * This operation generates comprehensive student data exports with
   * customizable format and field selection.
   * 
   * @param studentId - Student identifier to export
   * @param options - Export configuration options
   * @returns Promise resolving to export data/download link
   * @throws {Error} When export fails
   * 
   * @example
   * ```typescript
   * const exportData = await studentsApi.exportStudentData('student-id', {
   *   format: 'pdf',
   *   includePHI: true,
   *   purpose: 'Legal compliance'
   * });
   * ```
   */
  async exportStudentData(
    studentId: string, 
    options: StudentExportOptions = { format: 'json' }
  ): Promise<ExportStudentDataResponse> {
    return this.specializedOps.exportStudentData(studentId, options);
  }

  /**
   * Get student health records summary
   * 
   * Retrieves essential health information for quick reference during
   * student interactions. Includes allergies, medications, and conditions.
   * 
   * @param studentId - Student identifier
   * @param sensitive - Whether to include sensitive health records
   * @returns Promise resolving to health summary
   * @throws {Error} When student ID is missing or query fails
   * 
   * @example
   * ```typescript
   * const healthSummary = await studentsApi.getHealthSummary('student-id');
   * console.log(`Critical allergies: ${healthSummary.criticalAllergies.join(', ')}`);
   * ```
   */
  async getHealthSummary(studentId: string, sensitive: boolean = false): Promise<StudentHealthSummary> {
    return this.specializedOps.getHealthSummary(studentId, sensitive);
  }

  /**
   * Get student mental health records (requires special permissions)
   * 
   * Accesses sensitive mental health information that requires elevated
   * permissions and additional audit logging for compliance.
   * 
   * @param studentId - Student identifier
   * @returns Promise resolving to mental health records
   * @throws {Error} When student ID is missing, access denied, or query fails
   * 
   * @example
   * ```typescript
   * try {
   *   const mentalHealthRecords = await studentsApi.getMentalHealthRecords('student-id');
   *   // Handle sensitive data appropriately
   * } catch (error) {
   *   console.log('Access denied or not found');
   * }
   * ```
   */
  async getMentalHealthRecords(studentId: string): Promise<Record<string, unknown>> {
    return this.specializedOps.getMentalHealthRecords(studentId);
  }

  // ===================
  // LEGACY COMPATIBILITY
  // ===================

  /**
   * Legacy method for backward compatibility
   * @deprecated Use deactivate() instead
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return this.deactivate(id);
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use getHealthSummary() instead
   */
  async getHealthRecords(studentId: string, sensitive: boolean = false): Promise<StudentHealthSummary> {
    return this.getHealthSummary(studentId, sensitive);
  }
}
