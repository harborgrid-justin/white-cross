import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { extractApiData } from '../utils/apiUtils';
import { buildUrlParams } from '../utils/apiUtils';
import { Student, ApiResponse, PaginationParams, PaginationResponse } from '../types';

export interface StudentFilters {
  grade?: string;
  isActive?: boolean;
  search?: string;
}

export interface StudentsListResponse {
  students: Student[];
  pagination: PaginationResponse;
}

export interface StudentsApi {
  getAll(pagination?: PaginationParams, filters?: StudentFilters): Promise<StudentsListResponse>;
  getById(id: string): Promise<{ student: Student }>;
  create(studentData: Partial<Student>): Promise<{ student: Student }>;
  update(id: string, studentData: Partial<Student>): Promise<{ student: Student }>;
  delete(id: string): Promise<void>;
  getAssignedStudents(): Promise<{ students: Student[] }>;
  search(query: string, limit?: number): Promise<{ students: Student[] }>;
  getByGrade(grade: string): Promise<{ students: Student[] }>;
  bulkUpdate(updates: Array<{ id: string; data: Partial<Student> }>): Promise<{ students: Student[] }>;
  exportStudents(filters?: StudentFilters): Promise<Blob>;
  importStudents(file: File): Promise<{ imported: number; errors: any[] }>;
}

class StudentsApiImpl implements StudentsApi {
  async getAll(
    pagination: PaginationParams = { page: 1, limit: 10 },
    filters: StudentFilters = {}
  ): Promise<StudentsListResponse> {
    const params = buildUrlParams({
      page: pagination.page,
      limit: pagination.limit,
      ...filters,
    });

    const response = await apiInstance.get<ApiResponse<StudentsListResponse>>(
      `${API_ENDPOINTS.STUDENTS}?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getById(id: string): Promise<{ student: Student }> {
    const response = await apiInstance.get<ApiResponse<{ student: Student }>>(
      `${API_ENDPOINTS.STUDENTS}/${id}`
    );
    return extractApiData(response);
  }

  async create(studentData: Partial<Student>): Promise<{ student: Student }> {
    const response = await apiInstance.post<ApiResponse<{ student: Student }>>(
      API_ENDPOINTS.STUDENTS,
      studentData
    );
    return extractApiData(response);
  }

  async update(id: string, studentData: Partial<Student>): Promise<{ student: Student }> {
    const response = await apiInstance.put<ApiResponse<{ student: Student }>>(
      `${API_ENDPOINTS.STUDENTS}/${id}`,
      studentData
    );
    return extractApiData(response);
  }

  async delete(id: string): Promise<void> {
    await apiInstance.delete(`${API_ENDPOINTS.STUDENTS}/${id}`);
  }

  async getAssignedStudents(): Promise<{ students: Student[] }> {
    const response = await apiInstance.get<ApiResponse<{ students: Student[] }>>(
      `${API_ENDPOINTS.STUDENTS}/assigned`
    );
    return extractApiData(response);
  }

  async search(query: string, limit: number = 20): Promise<{ students: Student[] }> {
    const params = buildUrlParams({ query, limit });
    const response = await apiInstance.get<ApiResponse<{ students: Student[] }>>(
      `${API_ENDPOINTS.STUDENTS}/search?${params.toString()}`
    );
    return extractApiData(response);
  }

  async getByGrade(grade: string): Promise<{ students: Student[] }> {
    const response = await apiInstance.get<ApiResponse<{ students: Student[] }>>(
      `${API_ENDPOINTS.STUDENTS}/grade/${grade}`
    );
    return extractApiData(response);
  }

  async bulkUpdate(updates: Array<{ id: string; data: Partial<Student> }>): Promise<{ students: Student[] }> {
    const response = await apiInstance.put<ApiResponse<{ students: Student[] }>>(
      `${API_ENDPOINTS.STUDENTS}/bulk-update`,
      { updates }
    );
    return extractApiData(response);
  }

  async exportStudents(filters: StudentFilters = {}): Promise<Blob> {
    const params = buildUrlParams(filters);
    const response = await apiInstance.get(
      `${API_ENDPOINTS.STUDENTS}/export?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  async importStudents(file: File): Promise<{ imported: number; errors: any[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiInstance.post<ApiResponse<{ imported: number; errors: any[] }>>(
      `${API_ENDPOINTS.STUDENTS}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return extractApiData(response);
  }
}

export const studentsApi = new StudentsApiImpl();
