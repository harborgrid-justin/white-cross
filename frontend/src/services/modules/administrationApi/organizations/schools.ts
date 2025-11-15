/**
 * Schools Management Service
 *
 * @deprecated This service is deprecated and will be removed in a future version.
 * Use '@/lib/actions/admin.schools' server actions instead for better performance.
 *
 * Migration Path:
 * 1. Replace ApiClient-based service with server actions
 * 2. Update imports from '@/lib/actions/admin.schools'
 * 3. Remove service instantiation code
 *
 * @example Migration example
 * ```typescript
 * // DEPRECATED: Legacy approach
 * import { createSchoolsService } from '@/services/modules/administrationApi/organizations';
 * const service = createSchoolsService(apiClient);
 * const schools = await service.getSchools({ districtId });
 * const school = await service.getSchoolById(id);
 *
 * // RECOMMENDED: Server actions approach
 * import { getSchools, getSchoolById } from '@/lib/actions/admin.schools';
 * const schools = await getSchools({ districtId });
 * const school = await getSchoolById(id);
 * ```
 *
 * Provides comprehensive school management functionality including:
 * - CRUD operations for schools
 * - School statistics and reporting
 * - Settings management
 * - Bulk operations
 * - School transfer between districts
 * - Data export capabilities
 *
 * @module services/modules/administrationApi/organizations/schools
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../../constants/api';
import { z } from 'zod';
import {
  ApiResponse,
  PaginatedResponse,
} from '../../../types';
import { createApiError, createValidationError } from '../../../core/errors';
import type {
  School,
  CreateSchoolData,
  UpdateSchoolData
} from '../types';
import {
  createSchoolSchema,
  updateSchoolSchema
} from '../validation';
import { handleZodValidationError } from './validation-utils';

/**
 * Schools Management Service
 */
export class SchoolsService {
  private readonly baseEndpoint = API_ENDPOINTS.ADMIN.SCHOOLS;

  constructor(private readonly client: ApiClient) {}

  /**
   * Sanitize error messages to prevent sensitive information exposure
   */
  private sanitizeError(error: unknown): Error {
    return createApiError(error, 'School operation failed');
  }

  /**
   * Get all schools with pagination
   */
  async getSchools(filters: {
    page?: number;
    limit?: number;
    search?: string;
    districtId?: string;
    schoolType?: string;
    isActive?: boolean;
  } = {}): Promise<PaginatedResponse<School>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.search) params.append('search', filters.search);
      if (filters.districtId) params.append('districtId', filters.districtId);
      if (filters.schoolType) params.append('schoolType', filters.schoolType);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const response = await this.client.get<ApiResponse<PaginatedResponse<School>>>(
        `${this.baseEndpoint}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get school by ID
   */
  async getSchoolById(id: string): Promise<School> {
    try {
      if (!id) throw new Error('School ID is required');

      const response = await this.client.get<ApiResponse<{ school: School }>>(
        `${this.baseEndpoint}/${id}`
      );

      return response.data.data.school;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get school by code
   */
  async getSchoolByCode(code: string): Promise<School> {
    try {
      if (!code) throw new Error('School code is required');

      const response = await this.client.get<ApiResponse<{ school: School }>>(
        `${this.baseEndpoint}/code/${encodeURIComponent(code)}`
      );

      return response.data.data.school;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get schools by district
   */
  async getSchoolsByDistrict(districtId: string, filters: Omit<Parameters<SchoolsService['getSchools']>[0], 'districtId'> = {}): Promise<PaginatedResponse<School>> {
    try {
      if (!districtId) throw new Error('District ID is required');

      const filtersWithDistrict = { ...filters, districtId };
      return await this.getSchools(filtersWithDistrict);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create school
   */
  async createSchool(schoolData: CreateSchoolData): Promise<School> {
    try {
      createSchoolSchema.parse(schoolData);

      const response = await this.client.post<ApiResponse<{ school: School }>>(
        this.baseEndpoint,
        schoolData
      );

      return response.data.data.school;
    } catch (error) {
      if (error instanceof z.ZodError) {
        handleZodValidationError(error);
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update school
   */
  async updateSchool(id: string, schoolData: UpdateSchoolData): Promise<School> {
    try {
      if (!id) throw new Error('School ID is required');

      updateSchoolSchema.parse(schoolData);

      const response = await this.client.put<ApiResponse<{ school: School }>>(
        `${this.baseEndpoint}/${id}`,
        schoolData
      );

      return response.data.data.school;
    } catch (error) {
      if (error instanceof z.ZodError) {
        handleZodValidationError(error);
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete school
   */
  async deleteSchool(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('School ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        `${this.baseEndpoint}/${id}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get school statistics
   */
  async getSchoolStatistics(id: string): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalEnrollment: number;
    usersByRole: Record<string, number>;
    recentActivity: Array<{
      date: string;
      logins: number;
      healthRecords: number;
      appointments: number;
    }>;
    healthMetrics: {
      totalRecords: number;
      recentRecords: number;
      criticalAlerts: number;
      completedScreenings: number;
    };
  }> {
    try {
      if (!id) throw new Error('School ID is required');

      const response = await this.client.get<ApiResponse<{
        totalUsers: number;
        activeUsers: number;
        totalEnrollment: number;
        usersByRole: Record<string, number>;
        recentActivity: Array<{
          date: string;
          logins: number;
          healthRecords: number;
          appointments: number;
        }>;
        healthMetrics: {
          totalRecords: number;
          recentRecords: number;
          criticalAlerts: number;
          completedScreenings: number;
        };
      }>>(
        `${this.baseEndpoint}/${id}/statistics`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get school settings
   */
  async getSchoolSettings(id: string): Promise<Record<string, unknown>> {
    try {
      if (!id) throw new Error('School ID is required');

      const response = await this.client.get<ApiResponse<{ settings: Record<string, unknown> }>>(
        `${this.baseEndpoint}/${id}/settings`
      );

      return response.data.data.settings;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update school settings
   */
  async updateSchoolSettings(id: string, settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      if (!id) throw new Error('School ID is required');

      const settingsSchema = z.record(z.string(), z.unknown());
      settingsSchema.parse(settings);

      const response = await this.client.put<ApiResponse<{ settings: Record<string, unknown> }>>(
        `${this.baseEndpoint}/${id}/settings`,
        { settings }
      );

      return response.data.data.settings;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Invalid settings format',
          'settings',
          { settings: ['Settings must be a valid object'] },
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Transfer school to different district
   */
  async transferSchool(schoolId: string, newDistrictId: string): Promise<School> {
    try {
      if (!schoolId) throw new Error('School ID is required');
      if (!newDistrictId) throw new Error('New district ID is required');

      const uuidSchema = z.string().uuid('Invalid district ID format');
      uuidSchema.parse(newDistrictId);

      const response = await this.client.post<ApiResponse<{ school: School }>>(
        `${this.baseEndpoint}/${schoolId}/transfer`,
        { newDistrictId }
      );

      return response.data.data.school;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Invalid district ID',
          'newDistrictId',
          { newDistrictId: ['Invalid district ID format'] },
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Export school data
   */
  async exportSchoolData(id: string, format: 'csv' | 'json' | 'pdf' = 'csv'): Promise<Blob> {
    try {
      if (!id) throw new Error('School ID is required');

      const response = await this.client.get<Blob>(
        `${this.baseEndpoint}/${id}/export?format=${format}`,
        { responseType: 'blob' }
      );

      return response.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Bulk operations for schools
   */
  async bulkUpdateSchools(operations: Array<{
    schoolId: string;
    operation: 'activate' | 'deactivate' | 'delete' | 'update' | 'transfer';
    data?: Partial<UpdateSchoolData> | { newDistrictId: string };
  }>): Promise<{
    successful: number;
    failed: number;
    errors: Array<{
      schoolId: string;
      operation: string;
      error: string;
    }>;
  }> {
    try {
      const bulkSchema = z.array(z.object({
        schoolId: z.string().uuid('Invalid school ID'),
        operation: z.enum(['activate', 'deactivate', 'delete', 'update', 'transfer']),
        data: z.union([
          updateSchoolSchema.partial(),
          z.object({ newDistrictId: z.string().uuid() })
        ]).optional(),
      })).min(1, 'At least one operation is required').max(50, 'Maximum 50 operations per request');

      bulkSchema.parse(operations);

      const response = await this.client.post<ApiResponse<{
        successful: number;
        failed: number;
        errors: Array<{
          schoolId: string;
          operation: string;
          error: string;
        }>;
      }>>(
        `${this.baseEndpoint}/bulk`,
        { operations }
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        handleZodValidationError(error);
      }
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Factory function to create SchoolsService instance
 */
export function createSchoolsService(client: ApiClient): SchoolsService {
  return new SchoolsService(client);
}
