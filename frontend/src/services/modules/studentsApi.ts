/**
 * WF-COMP-292 | studentsApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../config/apiConfig, ../utils/apiUtils, ../../types/student.types | Dependencies: ../config/apiConfig, ../utils/apiUtils, zod
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, classes | Key Features: arrow component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse, buildPaginationParams, buildUrlParams } from '../utils/apiUtils';
import { z } from 'zod';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../audit';
import {
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
} from '../../types/student.types';

/**
 * API response wrapper matching backend response structure
 */
interface BackendApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
  message?: string;
}

/**
 * Validation schemas matching backend Sequelize model constraints
 * Ensures data integrity before sending to API
 */

// Valid grade values for K-12 education system
const VALID_GRADES = [
  'K', 'K-1', 'K-2', 'K-3', 'K-4', 'K-5', // Kindergarten variations
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
  'Pre-K', 'PK', 'TK', // Pre-kindergarten variations
] as const;

// Phone number regex (US format: (123) 456-7890, 123-456-7890, 1234567890)
const PHONE_REGEX = /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Medical record number format (alphanumeric, 5-20 chars)
const MEDICAL_RECORD_REGEX = /^[A-Z0-9-]{5,20}$/;

// Student number format (alphanumeric, 4-20 chars)
const STUDENT_NUMBER_REGEX = /^[A-Z0-9-]{4,20}$/;

/**
 * Create student schema with comprehensive validation
 * Matches backend Student model field constraints
 */
const createStudentSchema = z.object({
  studentNumber: z
    .string()
    .min(4, 'Student number must be at least 4 characters')
    .max(20, 'Student number cannot exceed 20 characters')
    .regex(STUDENT_NUMBER_REGEX, 'Student number must be alphanumeric with optional hyphens')
    .transform(val => val.toUpperCase()),

  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),

  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const dob = new Date(date);
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());

      return dob >= minDate && dob <= maxDate;
    }, {
      message: 'Date of birth must be between 3 and 100 years ago'
    })
    .refine((date) => {
      const dob = new Date(date);
      return dob < new Date();
    }, {
      message: 'Date of birth must be in the past'
    }),

  grade: z
    .string()
    .min(1, 'Grade is required')
    .max(10, 'Grade cannot exceed 10 characters')
    .refine((grade) => {
      // Allow custom grade formats or standard K-12
      const normalized = grade.toUpperCase().trim();
      return VALID_GRADES.some(g => g.toUpperCase() === normalized) || /^\d{1,2}$/.test(grade);
    }, {
      message: 'Grade must be K-12, Pre-K, TK, or a valid custom grade format'
    }),

  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], {
    errorMap: () => ({ message: 'Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY' })
  }),

  photo: z
    .string()
    .url('Photo must be a valid URL')
    .max(500, 'Photo URL cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),

  medicalRecordNum: z
    .string()
    .min(5, 'Medical record number must be at least 5 characters')
    .max(20, 'Medical record number cannot exceed 20 characters')
    .regex(MEDICAL_RECORD_REGEX, 'Medical record number must be alphanumeric with optional hyphens')
    .transform(val => val.toUpperCase())
    .optional()
    .or(z.literal('')),

  nurseId: z
    .string()
    .uuid('Nurse ID must be a valid UUID')
    .optional()
    .or(z.literal('')),

  enrollmentDate: z
    .string()
    .refine((date) => {
      if (!date) return true;
      const enrollDate = new Date(date);
      const minDate = new Date(2000, 0, 1); // Min: Year 2000
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1); // Allow up to 1 year in future

      return enrollDate >= minDate && enrollDate <= maxDate;
    }, {
      message: 'Enrollment date must be between 2000 and one year from today'
    })
    .optional()
    .or(z.literal('')),

  createdBy: z
    .string()
    .uuid('Created by must be a valid user UUID')
    .optional(),
});

/**
 * Update student schema - all fields optional except validations still apply
 */
const updateStudentSchema = createStudentSchema.partial().extend({
  isActive: z.boolean({
    error: 'Active status must be a boolean'
  }).optional(),

  updatedBy: z
    .string()
    .uuid('Updated by must be a valid user UUID')
    .optional(),
});

/**
 * Student filters schema for search/filtering queries
 */
const studentFiltersSchema = z.object({
  search: z
    .string()
    .max(200, 'Search query cannot exceed 200 characters')
    .optional(),

  grade: z
    .string()
    .max(10, 'Grade filter cannot exceed 10 characters')
    .optional(),

  isActive: z
    .boolean({
      error: 'Active filter must be a boolean'
    })
    .optional(),

  nurseId: z
    .string()
    .uuid('Nurse ID must be a valid UUID')
    .optional(),

  hasAllergies: z
    .boolean({
      error: 'Has allergies filter must be a boolean'
    })
    .optional(),

  hasMedications: z
    .boolean({
      error: 'Has medications filter must be a boolean'
    })
    .optional(),

  gender: z
    .enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], {
      errorMap: () => ({ message: 'Gender filter must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY' })
    })
    .optional(),

  page: z
    .number({
      error: 'Page must be a number'
    })
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .optional(),

  limit: z
    .number({
      error: 'Limit must be a number'
    })
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional(),
});

// Students API class matching backend StudentService
export class StudentsApi {
  /**
   * Get all students with optional filtering and pagination
   * Matches backend: StudentService.getStudents()
   */
  async getAll(filters: StudentFilters = {}): Promise<PaginatedStudentsResponse> {
    try {
      studentFiltersSchema.parse(filters);

      const queryString = new URLSearchParams();

      // Pagination
      if (filters.page) queryString.append('page', String(filters.page));
      if (filters.limit) queryString.append('limit', String(filters.limit));

      // Filters
      if (filters.search) queryString.append('search', filters.search);
      if (filters.grade) queryString.append('grade', filters.grade);
      if (filters.isActive !== undefined) queryString.append('isActive', String(filters.isActive));
      if (filters.nurseId) queryString.append('nurseId', filters.nurseId);
      if (filters.hasAllergies !== undefined) queryString.append('hasAllergies', String(filters.hasAllergies));
      if (filters.hasMedications !== undefined) queryString.append('hasMedications', String(filters.hasMedications));
      if (filters.gender) queryString.append('gender', filters.gender);

      const response = await apiInstance.get<BackendApiResponse<PaginatedStudentsResponse>>(
        `/api/students?${queryString.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch students');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch students');
    }
  }

  /**
   * Get student by ID with complete profile
   * Matches backend: StudentService.getStudentById()
   */
  async getById(id: string): Promise<Student> {
    try {
      if (!id) throw new Error('Student ID is required');

      const response = await apiInstance.get<BackendApiResponse<{ student: Student }>>(
        `/api/students/${id}`
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
    } catch (error: any) {
      await auditService.log({
        action: AuditAction.VIEW_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        status: AuditStatus.FAILURE,
        context: { error: error.message },
      });
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch student');
    }
  }

  /**
   * Create new student
   * Matches backend: StudentService.createStudent()
   */
  async create(studentData: CreateStudentData): Promise<Student> {
    try {
      createStudentSchema.parse(studentData);

      const response = await apiInstance.post<BackendApiResponse<{ student: Student }>>(
        '/api/students',
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
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      await auditService.log({
        action: AuditAction.CREATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        status: AuditStatus.FAILURE,
        context: { error: error.message },
      });
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to create student');
    }
  }

  /**
   * Update student information
   * Matches backend: StudentService.updateStudent()
   */
  async update(id: string, studentData: UpdateStudentData): Promise<Student> {
    try {
      if (!id) throw new Error('Student ID is required');

      updateStudentSchema.parse(studentData);

      const response = await apiInstance.put<BackendApiResponse<{ student: Student }>>(
        `/api/students/${id}`,
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
        afterState: studentData,
        metadata: {
          fieldsUpdated: Object.keys(studentData),
        },
      });

      return student;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      await auditService.log({
        action: AuditAction.UPDATE_STUDENT,
        resourceType: AuditResourceType.STUDENT,
        resourceId: id,
        studentId: id,
        status: AuditStatus.FAILURE,
        context: { error: error.message },
      });
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to update student');
    }
  }

  /**
   * Deactivate student (soft delete)
   * Matches backend: StudentService.deactivateStudent()
   */
  async deactivate(id: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!id) throw new Error('Student ID is required');

      const response = await apiInstance.delete<BackendApiResponse<{ message: string }>>(
        `/api/students/${id}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to deactivate student');
      }

      return {
        success: true,
        message: response.data.message || 'Student deactivated successfully'
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to deactivate student');
    }
  }

  /**
   * Reactivate a previously deactivated student
   * Matches backend: StudentService.reactivateStudent()
   */
  async reactivate(id: string): Promise<Student> {
    try {
      if (!id) throw new Error('Student ID is required');

      const response = await apiInstance.put<BackendApiResponse<{ student: Student }>>(
        `/api/students/${id}/reactivate`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to reactivate student');
      }

      return response.data.data.student;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to reactivate student');
    }
  }

  /**
   * Transfer student to a different nurse
   * Matches backend: StudentService.transferStudent()
   */
  async transfer(id: string, transferData: TransferStudentRequest): Promise<Student> {
    try {
      if (!id) throw new Error('Student ID is required');
      if (!transferData.nurseId) throw new Error('Nurse ID is required');

      const response = await apiInstance.put<BackendApiResponse<{ student: Student }>>(
        `/api/students/${id}/transfer`,
        transferData
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to transfer student');
      }

      return response.data.data.student;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to transfer student');
    }
  }

  /**
   * Get students by grade level
   * Matches backend: StudentService.getStudentsByGrade()
   */
  async getByGrade(grade: string): Promise<Student[]> {
    try {
      if (!grade) throw new Error('Grade is required');

      const response = await apiInstance.get<BackendApiResponse<{ students: Student[] }>>(
        `/api/students/grade/${encodeURIComponent(grade)}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch students by grade');
      }

      return response.data.data.students;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch students by grade');
    }
  }

  /**
   * Search students by query string
   * Matches backend: StudentService.searchStudents()
   */
  async search(query: string, limit?: number): Promise<Student[]> {
    try {
      if (!query.trim()) return [];

      const response = await apiInstance.get<BackendApiResponse<{ students: Student[] }>>(
        `/api/students/search/${encodeURIComponent(query)}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to search students');
      }

      return response.data.data.students;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to search students');
    }
  }

  /**
   * Get students assigned to current user (for nurses)
   * Matches backend: StudentService.getAssignedStudents()
   */
  async getAssignedStudents(): Promise<Student[]> {
    try {
      const response = await apiInstance.get<BackendApiResponse<{ students: Student[] }>>(
        '/api/students/assigned'
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch assigned students');
      }

      return response.data.data.students;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch assigned students');
    }
  }

  /**
   * Get student statistics and counts
   * Matches backend: StudentService.getStudentStatistics()
   */
  async getStatistics(studentId: string): Promise<StudentStatistics> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await apiInstance.get<BackendApiResponse<StudentStatistics>>(
        `/api/students/${studentId}/statistics`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch student statistics');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch student statistics');
    }
  }

  /**
   * Bulk update students
   * Matches backend: StudentService.bulkUpdateStudents()
   */
  async bulkUpdate(bulkData: BulkUpdateStudentsRequest): Promise<{ updatedCount: number }> {
    try {
      if (!bulkData.studentIds || bulkData.studentIds.length === 0) {
        throw new Error('Student IDs are required');
      }

      const response = await apiInstance.put<BackendApiResponse<{ updatedCount: number }>>(
        '/api/students/bulk-update',
        bulkData
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to bulk update students');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to bulk update students');
    }
  }

  /**
   * Permanently delete student (use with caution - HIPAA compliance)
   * Matches backend: StudentService.deleteStudent()
   */
  async permanentDelete(id: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!id) throw new Error('Student ID is required');

      const response = await apiInstance.delete<BackendApiResponse<{ success: boolean; message: string }>>(
        `/api/students/${id}/permanent`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to delete student');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to delete student');
    }
  }

  /**
   * Get all unique grades in the system
   * Matches backend: StudentService.getAllGrades()
   */
  async getAllGrades(): Promise<string[]> {
    try {
      const response = await apiInstance.get<BackendApiResponse<string[]>>(
        '/api/students/grades'
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch grades');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch grades');
    }
  }

  /**
   * Export student data for reporting or compliance
   * Matches backend: StudentService.exportStudentData()
   * CRITICAL: Exports contain PHI and must be audited immediately
   */
  async exportStudentData(studentId: string): Promise<ExportStudentDataResponse> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await apiInstance.get<BackendApiResponse<ExportStudentDataResponse>>(
        `/api/students/${studentId}/export`
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
      });

      return response.data.data;
    } catch (error: any) {
      await auditService.log({
        action: AuditAction.EXPORT_STUDENT_DATA,
        resourceType: AuditResourceType.STUDENT,
        resourceId: studentId,
        studentId,
        status: AuditStatus.FAILURE,
        context: { error: error.message },
      });
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to export student data');
    }
  }

  /**
   * Get student health records (including sensitive records if authorized)
   */
  async getHealthRecords(studentId: string, sensitive: boolean = false): Promise<any> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await apiInstance.get<BackendApiResponse<any>>(
        `/api/students/${studentId}/health-records?sensitive=${sensitive}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch health records');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch health records');
    }
  }

  /**
   * Get student mental health records (requires special permissions)
   */
  async getMentalHealthRecords(studentId: string): Promise<any> {
    try {
      if (!studentId) throw new Error('Student ID is required');

      const response = await apiInstance.get<BackendApiResponse<any>>(
        `/api/students/${studentId}/mental-health-records`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to fetch mental health records');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch mental health records');
    }
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use deactivate() instead
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return this.deactivate(id);
  }
}

// Export singleton instance
export const studentsApi = new StudentsApi();
