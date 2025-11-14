/**
 * @fileoverview Students API Core Operations
 * 
 * Provides core CRUD operations for student management including create, read,
 * update, and delete functionality with comprehensive validation and audit logging.
 * 
 * @module studentsApi/core-operations
 * @version 1.0.0
 * @since 2025-11-11
 */

import type { ApiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../../audit';
import {
  createStudentSchema,
  updateStudentSchema,
  studentFiltersSchema,
} from './validation';
import type {
  BackendApiResponse,
  Student,
  CreateStudentData,
  UpdateStudentData,
  StudentFilters,
  PaginatedStudentsResponse,
} from './types';

/**
 * Core student operations class
 * 
 * Handles basic CRUD operations with validation, error handling,
 * and HIPAA-compliant audit logging for all student data operations.
 */
export class StudentCoreOperations {
  constructor(private client: ApiClient) {}

  /**
   * Helper method to handle errors consistently across all operations
   * 
   * @param error - The error object to handle
   * @param defaultMessage - Default error message if none can be extracted
   * @throws {Error} Always throws with a formatted error message
   */
  private handleError(error: unknown, defaultMessage: string): never {
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const zodError = error as unknown as { errors: Array<{ message: string }> };
      throw new Error(`Validation error: ${zodError.errors[0]?.message || 'Invalid data'}`);
    }

    // Handle API errors
    const apiError = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
    throw new Error(apiError.response?.data?.error?.message || apiError.message || defaultMessage);
  }

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
   * const students = await coreOps.getAll({
   *   grade: '5',
   *   isActive: true,
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  async getAll(filters: StudentFilters = {}): Promise<PaginatedStudentsResponse> {
    try {
      // Validate filters before making API call
      studentFiltersSchema.parse(filters);

      // Build query parameters
      const queryString = new URLSearchParams();

      // Pagination parameters
      if (filters.page) queryString.append('page', String(filters.page));
      if (filters.limit) queryString.append('limit', String(filters.limit));

      // Filter parameters
      if (filters.search) queryString.append('search', filters.search);
      if (filters.grade) queryString.append('grade', filters.grade);
      if (filters.isActive !== undefined) queryString.append('isActive', String(filters.isActive));
      if (filters.nurseId) queryString.append('nurseId', filters.nurseId);
      if (filters.hasAllergies !== undefined) queryString.append('hasAllergies', String(filters.hasAllergies));
      if (filters.hasMedications !== undefined) queryString.append('hasMedications', String(filters.hasMedications));
      if (filters.gender) queryString.append('gender', filters.gender);

      // Make API request
      const response = await this.client.get<PaginatedStudentsResponse>(
        `${API_ENDPOINTS.STUDENTS.BASE}?${queryString.toString()}`
      );

      return response.data;
    } catch (error: unknown) {
      this.handleError(error, 'Failed to fetch students');
    }
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
   * const student = await coreOps.getById('123e4567-e89b-12d3-a456-426614174000');
   * console.log(`${student.firstName} ${student.lastName}`);
   * ```
   */
  async getById(id: string): Promise<Student> {
    try {
      if (!id) throw new Error('Student ID is required');

      const response = await this.client.get<BackendApiResponse<{ student: Student }>>(
        API_ENDPOINTS.STUDENTS.BY_ID(id)
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Student not found');
      }

      const student = response.data.data.student;

      // Audit log for viewing student PHI
      await auditService.logPHIAccess(
        AuditAction.VIEW_STUDENT,
        id,
        AuditResourceType.STUDENT,
        id
      );

      return student;
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      
      // Log failed access attempt
      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        status: AuditStatus.FAILURE,
        context: { error: apiError.message || 'Unknown error' },
      });

      this.handleError(error, 'Failed to fetch student');
    }
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
   * const newStudent = await coreOps.create({
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
    try {
      // Validate student data before API call
      createStudentSchema.parse(studentData);

      const response = await this.client.post<BackendApiResponse<{ student: Student }>>(
        API_ENDPOINTS.STUDENTS.BASE,
        studentData
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to create student');
      }

      const student = response.data.data.student;

      // Audit log for creating student
      await auditService.log({
        action: AuditAction.CREATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: student.id,
        studentId: student.id,
        resourceIdentifier: `${student.firstName} ${student.lastName}`,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          studentNumber: student.studentNumber,
          grade: student.grade,
        },
      });

      return student;
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      
      // Log failed creation attempt
      await auditService.log({
        action: AuditAction.CREATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        status: AuditStatus.FAILURE,
        context: { error: apiError.message || 'Unknown error' },
      });

      this.handleError(error, 'Failed to create student');
    }
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
   * const updated = await coreOps.update('student-id', {
   *   grade: '6',
   *   nurseId: 'new-nurse-id'
   * });
   * ```
   */
  async update(id: string, studentData: UpdateStudentData): Promise<Student> {
    try {
      if (!id) throw new Error('Student ID is required');

      // Validate update data
      updateStudentSchema.parse(studentData);

      const response = await this.client.put<BackendApiResponse<{ student: Student }>>(
        API_ENDPOINTS.STUDENTS.BY_ID(id),
        studentData
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to update student');
      }

      const student = response.data.data.student;

      // Audit log for updating student with change tracking
      await auditService.log({
        action: AuditAction.UPDATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        resourceIdentifier: `${student.firstName} ${student.lastName}`,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        afterState: studentData as Record<string, unknown>,
        metadata: {
          fieldsUpdated: Object.keys(studentData),
        },
      });

      return student;
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      
      // Log failed update attempt
      await auditService.log({
        action: AuditAction.UPDATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        status: AuditStatus.FAILURE,
        context: { error: apiError.message || 'Unknown error' },
      });

      this.handleError(error, 'Failed to update student');
    }
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
   * const result = await coreOps.deactivate('student-id');
   * console.log(result.message); // "Student deactivated successfully"
   * ```
   */
  async deactivate(id: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!id) throw new Error('Student ID is required');

      const response = await this.client.delete<BackendApiResponse<{ message: string }>>(
        API_ENDPOINTS.STUDENTS.BY_ID(id)
      );

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to deactivate student');
      }

      // Audit log for deactivating student
      await auditService.log({
        action: AuditAction.UPDATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          action: 'deactivate',
          reason: 'soft_delete',
        },
      });

      return {
        success: true,
        message: response.data.message || 'Student deactivated successfully'
      };
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      
      // Log failed deactivation attempt
      await auditService.log({
        action: AuditAction.UPDATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        status: AuditStatus.FAILURE,
        context: { 
          error: apiError.message || 'Unknown error',
          action: 'deactivate'
        },
      });

      this.handleError(error, 'Failed to deactivate student');
    }
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
   * const student = await coreOps.reactivate('student-id');
   * console.log(`${student.firstName} is now active`);
   * ```
   */
  async reactivate(id: string): Promise<Student> {
    try {
      if (!id) throw new Error('Student ID is required');

      const response = await this.client.put<BackendApiResponse<{ student: Student }>>(
        API_ENDPOINTS.STUDENTS.REACTIVATE(id)
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to reactivate student');
      }

      const student = response.data.data.student;

      // Audit log for reactivating student
      await auditService.log({
        action: AuditAction.UPDATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        resourceIdentifier: `${student.firstName} ${student.lastName}`,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          action: 'reactivate',
          previousStatus: 'inactive',
        },
      });

      return student;
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      
      // Log failed reactivation attempt
      await auditService.log({
        action: AuditAction.UPDATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        status: AuditStatus.FAILURE,
        context: { 
          error: apiError.message || 'Unknown error',
          action: 'reactivate'
        },
      });

      this.handleError(error, 'Failed to reactivate student');
    }
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
   * const result = await coreOps.permanentDelete('student-id');
   * console.log(result.message); // "Student permanently deleted"
   * ```
   */
  async permanentDelete(id: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!id) throw new Error('Student ID is required');

      const response = await this.client.delete<BackendApiResponse<{ success: boolean; message: string }>>(
        API_ENDPOINTS.STUDENTS.PERMANENT_DELETE(id)
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to delete student');
      }

      // Critical audit log for permanent deletion
      await auditService.log({
        action: AuditAction.DELETE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        status: AuditStatus.SUCCESS,
        isPHI: true,
        metadata: {
          action: 'permanent_delete',
          warning: 'irreversible_operation',
        },
      });

      return response.data.data;
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      
      // Log failed deletion attempt
      await auditService.log({
        action: AuditAction.DELETE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        status: AuditStatus.FAILURE,
        context: { 
          error: apiError.message || 'Unknown error',
          action: 'permanent_delete'
        },
      });

      this.handleError(error, 'Failed to delete student');
    }
  }
}
