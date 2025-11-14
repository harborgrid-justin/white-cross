/**
 * @fileoverview Students API Specialized Operations
 * 
 * Advanced operations for student management including transfers, bulk operations,
 * exports, search, statistics, and health record access with HIPAA compliance.
 * 
 * @module studentsApi/specialized-operations
 * @version 1.0.0
 * @since 2025-11-11
 */

import type { ApiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../../audit';
import type {
  BackendApiResponse,
  Student,
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
 * Specialized student operations class
 * 
 * Handles advanced student operations including transfers, bulk operations,
 * exports, and specialized queries with comprehensive audit logging.
 */
export class StudentSpecializedOperations {
  constructor(private client: ApiClient) {}

  /**
   * Helper method to handle errors consistently across all operations
   */
  private handleError(error: unknown, defaultMessage: string): never {
    const apiError = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
    throw new Error(apiError.response?.data?.error?.message || apiError.message || defaultMessage);
  }

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
   * const transferredStudent = await specializedOps.transfer('student-id', {
   *   nurseId: 'new-nurse-id',
   *   reason: 'Workload redistribution',
   *   effectiveDate: '2025-01-15'
   * });
   * ```
   */
  async transfer(id: string, transferData: TransferStudentRequest): Promise<Student> {
    try {
      if (!id) throw new Error('Student ID is required');
      if (!transferData.nurseId) throw new Error('Nurse ID is required');

      const response = await this.client.put<BackendApiResponse<{ student: Student }>>(
        API_ENDPOINTS.STUDENTS.TRANSFER(id),
        transferData
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to transfer student');
      }

      const student = response.data.data.student;

      // Audit log for student transfer
      await auditService.log({
        action: AuditAction.TRANSFER_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        resourceIdentifier: `${student.firstName} ${student.lastName}`,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          newNurseId: transferData.nurseId,
        },
      });

      return student;
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      
      // Log failed transfer attempt
      await auditService.log({
        action: AuditAction.TRANSFER_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        status: AuditStatus.FAILURE,
        context: { 
          error: apiError.message || 'Unknown error',
          targetNurseId: transferData.nurseId
        },
      });

      this.handleError(error, 'Failed to transfer student');
    }
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
   * const fifthGraders = await specializedOps.getByGrade('5', false);
   * console.log(`Found ${fifthGraders.length} active 5th graders`);
   * ```
   */
  async getByGrade(grade: string, includeInactive: boolean = false): Promise<Student[]> {
    try {
      if (!grade) throw new Error('Grade is required');

      const queryParams = includeInactive ? '?includeInactive=true' : '';
      const response = await this.client.get<BackendApiResponse<{ students: Student[] }>>(
        `${API_ENDPOINTS.STUDENTS.BY_GRADE(grade)}${queryParams}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch students by grade');
      }

      return response.data.data.students;
    } catch (error: unknown) {
      this.handleError(error, 'Failed to fetch students by grade');
    }
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
   * const results = await specializedOps.advancedSearch({
   *   search: 'john',
   *   grade: '5',
   *   hasAllergies: true,
   *   sortBy: 'lastName',
   *   sortOrder: 'asc'
   * });
   * ```
   */
  async advancedSearch(searchParams: StudentSearchParams): Promise<Student[]> {
    try {
      const queryString = new URLSearchParams();
      
      // Basic search parameters
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            queryString.append(key, value.join(','));
          } else {
            queryString.append(key, String(value));
          }
        }
      });

      const response = await this.client.get<BackendApiResponse<{ students: Student[] }>>(
        `${API_ENDPOINTS.STUDENTS.BASE}/search?${queryString.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to perform advanced search');
      }

      return response.data.data.students;
    } catch (error: unknown) {
      this.handleError(error, 'Failed to perform advanced search');
    }
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
   * const matches = await specializedOps.search('john doe', 10);
   * ```
   */
  async search(query: string, limit?: number): Promise<Student[]> {
    try {
      if (!query.trim()) return [];

      const url = limit 
        ? `${API_ENDPOINTS.STUDENTS.SEARCH_BY_QUERY(query)}?limit=${limit}`
        : API_ENDPOINTS.STUDENTS.SEARCH_BY_QUERY(query);

      const response = await this.client.get<BackendApiResponse<{ students: Student[] }>>(url);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to search students');
      }

      return response.data.data.students;
    } catch (error: unknown) {
      this.handleError(error, 'Failed to search students');
    }
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
   * const myStudents = await specializedOps.getAssignedStudents();
   * console.log(`I have ${myStudents.length} assigned students`);
   * ```
   */
  async getAssignedStudents(includeInactive: boolean = false): Promise<Student[]> {
    try {
      const queryParams = includeInactive ? '?includeInactive=true' : '';
      const response = await this.client.get<BackendApiResponse<{ students: Student[] }>>(
        `${API_ENDPOINTS.STUDENTS.ASSIGNED}${queryParams}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch assigned students');
      }

      return response.data.data.students;
    } catch (error: unknown) {
      this.handleError(error, 'Failed to fetch assigned students');
    }
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
   * const stats = await specializedOps.getStatistics('student-id');
   * console.log(`Student has ${stats.totalAppointments} total appointments`);
   * ```
   */
  async getStatistics(studentId: string): Promise<StudentStatistics> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await this.client.get<BackendApiResponse<StudentStatistics>>(
        API_ENDPOINTS.STUDENTS.STATISTICS(studentId)
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch student statistics');
      }

      return response.data.data;
    } catch (error: unknown) {
      this.handleError(error, 'Failed to fetch student statistics');
    }
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
   * const result = await specializedOps.bulkUpdate({
   *   studentIds: ['id1', 'id2', 'id3'],
   *   updates: { grade: '6', nurseId: 'new-nurse-id' }
   * });
   * console.log(`Updated ${result.updatedCount} students`);
   * ```
   */
  async bulkUpdate(bulkData: BulkUpdateStudentsRequest): Promise<BulkOperationResponse> {
    try {
      if (!bulkData.studentIds || bulkData.studentIds.length === 0) {
        throw new Error('Student IDs are required');
      }

      const response = await this.client.put<BackendApiResponse<BulkOperationResponse>>(
        API_ENDPOINTS.STUDENTS.BULK_UPDATE,
        bulkData
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to bulk update students');
      }

      // Audit log for bulk update operation
      await auditService.log({
        action: AuditAction.BULK_UPDATE_STUDENTS,
        resourceType: AuditResourceType.STUDENT,
        status: AuditStatus.SUCCESS,
        metadata: {
          studentCount: bulkData.studentIds.length,
          successCount: response.data.data.successCount,
          errorCount: response.data.data.errorCount,
        },
      });

      return response.data.data;
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      
      // Log failed bulk update
      await auditService.log({
        action: AuditAction.BULK_UPDATE_STUDENTS,
        resourceType: AuditResourceType.STUDENT,
        status: AuditStatus.FAILURE,
        context: { 
          error: apiError.message || 'Unknown error',
          studentCount: bulkData.studentIds?.length || 0
        },
      });

      this.handleError(error, 'Failed to bulk update students');
    }
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
   * const grades = await specializedOps.getAllGrades();
   * // ['K', '1', '2', '3', '4', '5', 'Pre-K']
   * ```
   */
  async getAllGrades(): Promise<string[]> {
    try {
      const response = await this.client.get<BackendApiResponse<string[]>>(
        API_ENDPOINTS.STUDENTS.GRADES
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch grades');
      }

      return response.data.data;
    } catch (error: unknown) {
      this.handleError(error, 'Failed to fetch grades');
    }
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
   * const exportData = await specializedOps.exportStudentData('student-id', {
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
    try {
      if (!studentId) throw new Error('Student ID is required');

      const queryString = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            queryString.append(key, JSON.stringify(value));
          } else {
            queryString.append(key, String(value));
          }
        }
      });

      const response = await this.client.get<BackendApiResponse<ExportStudentDataResponse>>(
        `${API_ENDPOINTS.STUDENTS.EXPORT(studentId)}?${queryString.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to export student data');
      }

      // CRITICAL: Audit log for exporting student data
      await auditService.log({
        action: AuditAction.EXPORT_STUDENT_DATA,
        resourceType: AuditResourceType.STUDENT,
        resourceId: studentId,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          format: options.format,
          includePHI: options.includePHI || false,
          purpose: options.purpose,
          fieldsExported: options.fields || ['all'],
        },
      });

      return response.data.data;
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      
      // Log failed export attempt
      await auditService.log({
        action: AuditAction.EXPORT_STUDENT_DATA,
        resourceType: AuditResourceType.STUDENT,
        resourceId: studentId,
        studentId,
        status: AuditStatus.FAILURE,
        context: { error: apiError.message || 'Unknown error' },
      });

      this.handleError(error, 'Failed to export student data');
    }
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
   * const healthSummary = await specializedOps.getHealthSummary('student-id');
   * console.log(`Critical allergies: ${healthSummary.criticalAllergies.join(', ')}`);
   * ```
   */
  async getHealthSummary(studentId: string, sensitive: boolean = false): Promise<StudentHealthSummary> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const queryParams = sensitive ? '?sensitive=true' : '';
      const response = await this.client.get<BackendApiResponse<StudentHealthSummary>>(
        `${API_ENDPOINTS.STUDENTS.HEALTH_RECORDS(studentId)}${queryParams}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch health records');
      }

      // Audit log for accessing health records
      await auditService.logPHIAccess(
        AuditAction.VIEW_HEALTH_RECORD,
        studentId,
        AuditResourceType.HEALTH_RECORD,
        studentId
      );

      return response.data.data;
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      
      // Log failed health record access
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: studentId,
        studentId,
        status: AuditStatus.FAILURE,
        context: { error: apiError.message || 'Unknown error' },
      });

      this.handleError(error, 'Failed to fetch health records');
    }
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
   *   const mentalHealthRecords = await specializedOps.getMentalHealthRecords('student-id');
   *   // Handle sensitive data appropriately
   * } catch (error) {
   *   console.log('Access denied or not found');
   * }
   * ```
   */
  async getMentalHealthRecords(studentId: string): Promise<Record<string, unknown>> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await this.client.get<BackendApiResponse<any>>(
        API_ENDPOINTS.STUDENTS.MENTAL_HEALTH_RECORDS(studentId)
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch mental health records');
      }

      // Critical audit log for mental health record access
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: studentId,
        studentId,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          accessLevel: 'mental_health',
          requiresSpecialPermission: true,
        },
      });

      return response.data.data;
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      
      // Log failed mental health record access
      await auditService.log({
        action: AuditAction.VIEW_HEALTH_RECORD,
        resourceType: AuditResourceType.HEALTH_RECORD,
        resourceId: studentId,
        studentId,
        status: AuditStatus.FAILURE,
        context: { 
          error: apiError.message || 'Unknown error',
          accessLevel: 'mental_health'
        },
      });

      this.handleError(error, 'Failed to fetch mental health records');
    }
  }
}
