import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse, buildPaginationParams, buildUrlParams } from '../utils/apiUtils';
import { z } from 'zod';
import moment from 'moment';
import debug from 'debug';

const log = debug('whitecross:students-api');

// Types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  schoolId: string;
  emergencyContactId?: string;
  medicalRecordNumber?: string;
  isActive: boolean;
  enrollmentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFilters {
  search?: string;
  grade?: string;
  isActive?: boolean;
  schoolId?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  schoolId: string;
  emergencyContactId?: string;
  medicalRecordNumber?: string;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  isActive?: boolean;
}

// Validation schemas
const createStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  grade: z.string().min(1, 'Grade is required'),
  schoolId: z.string().min(1, 'School ID is required'),
  emergencyContactId: z.string().optional(),
  medicalRecordNumber: z.string().optional(),
});

const updateStudentSchema = createStudentSchema.partial();

const studentFiltersSchema = z.object({
  search: z.string().optional(),
  grade: z.string().optional(),
  isActive: z.boolean().optional(),
  schoolId: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

// Students API class
export class StudentsApi {
  /**
   * Get all students with optional filtering and pagination
   */
  async getAll(filters: StudentFilters = {}): Promise<PaginatedResponse<Student>> {
    try {
      studentFiltersSchema.parse(filters);

      const params = buildPaginationParams(
        filters.page,
        filters.limit,
        filters.sort,
        filters.order
      );

      const queryString = new URLSearchParams();
      if (filters.search) queryString.append('search', filters.search);
      if (filters.grade) queryString.append('grade', filters.grade);
      if (filters.isActive !== undefined) queryString.append('isActive', String(filters.isActive));
      if (filters.schoolId) queryString.append('schoolId', filters.schoolId);

      const finalParams = queryString.toString()
        ? `${params}&${queryString.toString()}`
        : params;

      const response = await apiInstance.get<ApiResponse<PaginatedResponse<Student>>>(
        `${API_ENDPOINTS.STUDENTS.BASE}?${finalParams}`
      );

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch students');
    }
  }

  /**
   * Get student by ID
   */
  async getById(id: string): Promise<Student> {
    try {
      if (!id) throw new Error('Student ID is required');

      const response = await apiInstance.get<ApiResponse<Student>>(
        API_ENDPOINTS.STUDENTS.BY_ID(id)
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch student');
    }
  }

  /**
   * Create new student
   */
  async create(studentData: CreateStudentRequest): Promise<Student> {
    try {
      createStudentSchema.parse(studentData);

      const response = await apiInstance.post<ApiResponse<Student>>(
        API_ENDPOINTS.STUDENTS.BASE,
        studentData
      );

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.message || 'Failed to create student');
    }
  }

  /**
   * Update student
   */
  async update(id: string, studentData: UpdateStudentRequest): Promise<Student> {
    try {
      if (!id) throw new Error('Student ID is required');

      updateStudentSchema.parse(studentData);

      const response = await apiInstance.put<ApiResponse<Student>>(
        API_ENDPOINTS.STUDENTS.BY_ID(id),
        studentData
      );

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.message || 'Failed to update student');
    }
  }

  /**
   * Delete student
   */
  async delete(id: string): Promise<{ id: string }> {
    try {
      if (!id) throw new Error('Student ID is required');

      const response = await apiInstance.delete<ApiResponse<{ id: string }>>(
        API_ENDPOINTS.STUDENTS.BY_ID(id)
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete student');
    }
  }

  /**
   * Get students assigned to current user (for nurses)
   */
  async getAssignedStudents(): Promise<Student[]> {
    try {
      const response = await apiInstance.get<ApiResponse<Student[]>>(
        API_ENDPOINTS.STUDENTS.ASSIGNED
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assigned students');
    }
  }

  /**
   * Search students
   */
  async search(query: string): Promise<Student[]> {
    try {
      if (!query.trim()) return [];

      const response = await apiInstance.get<ApiResponse<Student[]>>(
        `${API_ENDPOINTS.STUDENTS.SEARCH}?q=${encodeURIComponent(query)}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search students');
    }
  }

  /**
   * Bulk import students
   */
  async bulkImport(students: CreateStudentRequest[]): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const response = await apiInstance.post<ApiResponse<{ success: number; failed: number; errors: string[] }>>(
        `${API_ENDPOINTS.STUDENTS.BASE}/bulk-import`,
        { students }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to import students');
    }
  }

  /**
   * Export students data
   */
  async exportStudents(filters: StudentFilters = {}): Promise<Blob> {
    try {
      const params = buildUrlParams(filters as Record<string, any>);

      const response = await apiInstance.get(
        `${API_ENDPOINTS.STUDENTS.BASE}/export?${params}`,
        {
          responseType: 'blob',
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to export students');
    }
  }
}

// Export singleton instance
export const studentsApi = new StudentsApi();
