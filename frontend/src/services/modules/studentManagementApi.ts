/**
 * Student Management API Module
 * Provides frontend access to student management endpoints
 */

import { apiInstance } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../utils/apiUtils';

/**
 * Student Management API interfaces
 */
export interface StudentPhoto {
  id: string;
  studentId: string;
  photoUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  isActive: boolean;
}

export interface AcademicTranscript {
  id: string;
  studentId: string;
  academicYear: string;
  grade: string;
  courses: Array<{
    name: string;
    grade: string;
    credits: number;
  }>;
  gpa: number;
  attendanceRate: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GradeTransition {
  id: string;
  studentId: string;
  fromGrade: string;
  toGrade: string;
  transitionDate: string;
  academicYear: string;
  notes?: string;
  processedBy: string;
  createdAt: string;
}

export interface BarcodeData {
  studentId: string;
  studentName: string;
  grade: string;
  medicalRecordNum?: string;
  allergies?: string[];
  medications?: string[];
}

export interface WaitlistEntry {
  id: string;
  studentId: string;
  studentName: string;
  serviceType: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  requestedDate: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWaitlistRequest {
  studentId: string;
  serviceType: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  requestedDate?: string;
  notes?: string;
}

export interface UpdateWaitlistRequest {
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

/**
 * Student Management API Service
 * Handles all student management related API calls
 */
export class StudentManagementApi {
  /**
   * Upload student photo
   */
  async uploadPhoto(studentId: string, photoFile: File): Promise<StudentPhoto> {
    const formData = new FormData();
    formData.append('photo', photoFile);
    
    const response = await apiInstance.post<ApiResponse<StudentPhoto>>(
      `/api/v1/operations/student-management/${studentId}/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data.data!;
  }

  /**
   * Get student photo
   */
  async getPhoto(studentId: string): Promise<StudentPhoto> {
    const response = await apiInstance.get<ApiResponse<StudentPhoto>>(
      `/api/v1/operations/student-management/${studentId}/photo`
    );
    return response.data.data!;
  }

  /**
   * Get student transcripts
   */
  async getTranscripts(studentId: string, params?: {
    academicYear?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AcademicTranscript>> {
    const paginationParams = buildPaginationParams(params?.page, params?.limit);
    const allParams = params ? Object.assign({}, paginationParams, params) : paginationParams;
    const response = await apiInstance.get<PaginatedResponse<AcademicTranscript>>(
      `/api/v1/operations/student-management/${studentId}/transcripts`,
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Create academic transcript
   */
  async createTranscript(
    studentId: string,
    transcriptData: Omit<AcademicTranscript, 'id' | 'studentId' | 'createdAt' | 'updatedAt'>
  ): Promise<AcademicTranscript> {
    const response = await apiInstance.post<ApiResponse<AcademicTranscript>>(
      `/api/v1/operations/student-management/${studentId}/transcripts`,
      transcriptData
    );
    return response.data.data!;
  }

  /**
   * Update academic transcript
   */
  async updateTranscript(
    studentId: string,
    transcriptId: string,
    transcriptData: Partial<AcademicTranscript>
  ): Promise<AcademicTranscript> {
    const response = await apiInstance.put<ApiResponse<AcademicTranscript>>(
      `/api/v1/operations/student-management/${studentId}/transcripts/${transcriptId}`,
      transcriptData
    );
    return response.data.data!;
  }

  /**
   * Get grade transitions for a student
   */
  async getGradeTransitions(studentId: string): Promise<GradeTransition[]> {
    const response = await apiInstance.get<ApiResponse<GradeTransition[]>>(
      `/api/v1/operations/student-management/${studentId}/grade-transitions`
    );
    return response.data.data || [];
  }

  /**
   * Create grade transition
   */
  async createGradeTransition(
    studentId: string,
    transitionData: {
      toGrade: string;
      transitionDate: string;
      academicYear: string;
      notes?: string;
    }
  ): Promise<GradeTransition> {
    const response = await apiInstance.post<ApiResponse<GradeTransition>>(
      `/api/v1/operations/student-management/${studentId}/grade-transitions`,
      transitionData
    );
    return response.data.data!;
  }

  /**
   * Scan student barcode
   */
  async scanBarcode(barcode: string): Promise<BarcodeData> {
    const response = await apiInstance.get<ApiResponse<BarcodeData>>(
      `/api/v1/operations/student-management/barcode/${barcode}`
    );
    return response.data.data!;
  }

  /**
   * Generate student barcode
   */
  async generateBarcode(studentId: string): Promise<{ barcodeUrl: string; barcodeValue: string }> {
    const response = await apiInstance.post<ApiResponse<{ barcodeUrl: string; barcodeValue: string }>>(
      `/api/v1/operations/student-management/${studentId}/barcode`
    );
    return response.data.data!;
  }

  /**
   * Get waitlist entries
   */
  async getWaitlist(params?: {
    serviceType?: string;
    priority?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<WaitlistEntry>> {
    const paginationParams = buildPaginationParams(params?.page, params?.limit);
    const allParams = params ? Object.assign({}, paginationParams, params) : paginationParams;
    const response = await apiInstance.get<PaginatedResponse<WaitlistEntry>>(
      '/api/v1/operations/student-management/waitlist',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Add student to waitlist
   */
  async addToWaitlist(waitlistData: CreateWaitlistRequest): Promise<WaitlistEntry> {
    const response = await apiInstance.post<ApiResponse<WaitlistEntry>>(
      '/api/v1/operations/student-management/waitlist',
      waitlistData
    );
    return response.data.data!;
  }

  /**
   * Update waitlist entry
   */
  async updateWaitlistEntry(
    entryId: string,
    updateData: UpdateWaitlistRequest
  ): Promise<WaitlistEntry> {
    const response = await apiInstance.put<ApiResponse<WaitlistEntry>>(
      `/api/v1/operations/student-management/waitlist/${entryId}`,
      updateData
    );
    return response.data.data!;
  }

  /**
   * Remove from waitlist
   */
  async removeFromWaitlist(entryId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiInstance.delete<ApiResponse<{ success: boolean; message: string }>>(
      `/api/v1/operations/student-management/waitlist/${entryId}`
    );
    return response.data.data!;
  }

  /**
   * Get student waitlist entries
   */
  async getStudentWaitlistEntries(studentId: string): Promise<WaitlistEntry[]> {
    const response = await apiInstance.get<ApiResponse<WaitlistEntry[]>>(
      `/api/v1/operations/student-management/${studentId}/waitlist`
    );
    return response.data.data || [];
  }
}

// Export singleton instance
export const studentManagementApi = new StudentManagementApi();
