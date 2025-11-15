/**
 * @fileoverview Student Management API Module
 * @module services/modules/studentManagementApi
 * @category Services - Student Management
 *
 * @deprecated DUPLICATE FUNCTIONALITY - Use students.actions.ts instead
 * This service duplicates functionality already available in students.actions.ts.
 * Server actions are the recommended approach for student operations.
 *
 * MIGRATION STATUS:
 * - Photo management -> Available in students.actions.ts
 * - Transcripts -> Available in students.actions.ts
 * - Grade transitions -> Available in students.actions.ts
 * - Barcode operations -> Available in students.actions.ts
 * - Waitlist management -> Available in students.actions.ts
 * - RECOMMENDATION: Migrate all code to use students.actions.ts
 * - Target deprecation date: April 2026
 *
 * Provides frontend access to student management endpoints.
 * For new implementations, prefer @/lib/actions/students.actions
 */

import type { ApiClient } from '@/services/core/ApiClient';
import { apiClient } from '@/services/core'; // Updated: Import from new centralized core
import { ApiResponse, PaginatedResponse } from '../utils/apiUtils';

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
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Upload student photo
   */
  async uploadPhoto(studentId: string, photoFile: File): Promise<StudentPhoto> {
    const formData = new FormData();
    formData.append('photo', photoFile);
    
    const response = await this.client.post<ApiResponse<StudentPhoto>>(
      `/student-management/${studentId}/photo`,
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
    const response = await this.client.get<ApiResponse<StudentPhoto>>(
      `/student-management/${studentId}/photo`
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
    const queryParams: Record<string, unknown> = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    };
    if (params?.academicYear) {
      queryParams.academicYear = params.academicYear;
    }
    const response = await this.client.get<PaginatedResponse<AcademicTranscript>>(
      `/student-management/${studentId}/transcripts`,
      { params: queryParams }
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
    const response = await this.client.post<ApiResponse<AcademicTranscript>>(
      `/student-management/${studentId}/transcripts`,
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
    const response = await this.client.put<ApiResponse<AcademicTranscript>>(
      `/student-management/${studentId}/transcripts/${transcriptId}`,
      transcriptData
    );
    return response.data.data!;
  }

  /**
   * Get grade transitions for a student
   */
  async getGradeTransitions(studentId: string): Promise<GradeTransition[]> {
    const response = await this.client.get<ApiResponse<GradeTransition[]>>(
      `/student-management/${studentId}/grade-transitions`
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
    const response = await this.client.post<ApiResponse<GradeTransition>>(
      `/student-management/${studentId}/grade-transitions`,
      transitionData
    );
    return response.data.data!;
  }

  /**
   * Scan student barcode
   */
  async scanBarcode(barcode: string): Promise<BarcodeData> {
    const response = await this.client.get<ApiResponse<BarcodeData>>(
      `/student-management/barcode/${barcode}`
    );
    return response.data.data!;
  }

  /**
   * Generate student barcode
   */
  async generateBarcode(studentId: string): Promise<{ barcodeUrl: string; barcodeValue: string }> {
    const response = await this.client.post<ApiResponse<{ barcodeUrl: string; barcodeValue: string }>>(
      `/student-management/${studentId}/barcode`
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
    const queryParams: Record<string, unknown> = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    };
    if (params?.serviceType) queryParams.serviceType = params.serviceType;
    if (params?.priority) queryParams.priority = params.priority;
    if (params?.status) queryParams.status = params.status;

    const response = await this.client.get<PaginatedResponse<WaitlistEntry>>(
      '/student-management/waitlist',
      { params: queryParams }
    );
    return response.data;
  }

  /**
   * Add student to waitlist
   */
  async addToWaitlist(waitlistData: CreateWaitlistRequest): Promise<WaitlistEntry> {
    const response = await this.client.post<ApiResponse<WaitlistEntry>>(
      '/student-management/waitlist',
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
    const response = await this.client.put<ApiResponse<WaitlistEntry>>(
      `/student-management/waitlist/${entryId}`,
      updateData
    );
    return response.data.data!;
  }

  /**
   * Remove from waitlist
   */
  async removeFromWaitlist(entryId: string): Promise<{ success: boolean; message: string }> {
    const response = await this.client.delete<ApiResponse<{ success: boolean; message: string }>>(
      `/student-management/waitlist/${entryId}`
    );
    return response.data.data!;
  }

  /**
   * Get student waitlist entries
   */
  async getStudentWaitlistEntries(studentId: string): Promise<WaitlistEntry[]> {
    const response = await this.client.get<ApiResponse<WaitlistEntry[]>>(
      `/student-management/${studentId}/waitlist`
    );
    return response.data.data || [];
  }
}

/**
 * Factory function for creating StudentManagementApi instances
 * @deprecated Use students.actions.ts instead
 */
export function createStudentManagementApi(client: ApiClient): StudentManagementApi {
  return new StudentManagementApi(client);
}

/**
 * Singleton instance for StudentManagementApi
 * Pre-configured with the default apiClient from core services
 *
 * @deprecated DUPLICATE FUNCTIONALITY - Use students.actions.ts instead
 *
 * This service duplicates student management operations already available
 * in the Next.js server actions at @/lib/actions/students.actions
 *
 * Migration guide:
 * - Instead of: studentManagementApi.uploadPhoto(studentId, file)
 * - Use: uploadPhotoAction from students.actions.ts
 *
 * - Instead of: studentManagementApi.getTranscripts(studentId)
 * - Use: getStudentTranscripts from students.actions.ts
 *
 * All functionality in this service is available in students.actions.ts
 * with better caching, type safety, and Next.js integration.
 *
 * Target deprecation: April 2026
 */
export const studentManagementApi = createStudentManagementApi(apiClient);
