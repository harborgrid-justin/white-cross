/**
 * Districts Management Service
 *
 * @deprecated This service is deprecated and will be removed in a future version.
 * Use '@/lib/actions/admin.districts' server actions instead for better performance.
 *
 * Migration Path:
 * 1. Replace ApiClient-based service with server actions
 * 2. Update imports from '@/lib/actions/admin.districts'
 * 3. Remove service instantiation code
 *
 * @example Migration example
 * ```typescript
 * // DEPRECATED: Legacy approach
 * import { createDistrictsService } from '@/services/modules/administrationApi/organizations';
 * const service = createDistrictsService(apiClient);
 * const district = await service.getDistrictById(id);
 * const stats = await service.getDistrictStatistics(id);
 *
 * // RECOMMENDED: Server actions approach
 * import { getDistrictById, getDistrictStatistics } from '@/lib/actions/admin.districts';
 * const district = await getDistrictById(id);
 * const stats = await getDistrictStatistics(id);
 * ```
 *
 * Provides comprehensive district management functionality including:
 * - CRUD operations for districts
 * - District statistics and reporting
 * - Settings management
 * - Data export capabilities
 *
 * @module services/modules/administrationApi/organizations/districts
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
  District,
  CreateDistrictData,
  UpdateDistrictData
} from '../types';
import {
  createDistrictSchema,
  updateDistrictSchema
} from '../validation';
import { handleZodValidationError } from './validation-utils';

/**
 * Districts Management Service
 */
export class DistrictsService {
  private readonly baseEndpoint = API_ENDPOINTS.ADMIN.DISTRICTS;

  constructor(private readonly client: ApiClient) {}

  /**
   * Sanitize error messages to prevent sensitive information exposure
   */
  private sanitizeError(error: unknown): Error {
    return createApiError(error, 'District operation failed');
  }

  /**
   * Get all districts with pagination
   */
  async getDistricts(filters: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  } = {}): Promise<PaginatedResponse<District>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.search) params.append('search', filters.search);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const response = await this.client.get<ApiResponse<PaginatedResponse<District>>>(
        `${this.baseEndpoint}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get district by ID
   */
  async getDistrictById(id: string): Promise<District> {
    try {
      if (!id) throw new Error('District ID is required');

      const response = await this.client.get<ApiResponse<{ district: District }>>(
        `${this.baseEndpoint}/${id}`
      );

      return response.data.data.district;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get district by code
   */
  async getDistrictByCode(code: string): Promise<District> {
    try {
      if (!code) throw new Error('District code is required');

      const response = await this.client.get<ApiResponse<{ district: District }>>(
        `${this.baseEndpoint}/code/${encodeURIComponent(code)}`
      );

      return response.data.data.district;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create district
   */
  async createDistrict(districtData: CreateDistrictData): Promise<District> {
    try {
      createDistrictSchema.parse(districtData);

      const response = await this.client.post<ApiResponse<{ district: District }>>(
        this.baseEndpoint,
        districtData
      );

      return response.data.data.district;
    } catch (error) {
      if (error instanceof z.ZodError) {
        handleZodValidationError(error);
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update district
   */
  async updateDistrict(id: string, districtData: UpdateDistrictData): Promise<District> {
    try {
      if (!id) throw new Error('District ID is required');

      updateDistrictSchema.parse(districtData);

      const response = await this.client.put<ApiResponse<{ district: District }>>(
        `${this.baseEndpoint}/${id}`,
        districtData
      );

      return response.data.data.district;
    } catch (error) {
      if (error instanceof z.ZodError) {
        handleZodValidationError(error);
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete district
   */
  async deleteDistrict(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('District ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        `${this.baseEndpoint}/${id}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get district statistics
   */
  async getDistrictStatistics(id: string): Promise<{
    totalSchools: number;
    activeSchools: number;
    totalUsers: number;
    activeUsers: number;
    totalEnrollment: number;
    usersByRole: Record<string, number>;
    schoolsByType: Record<string, number>;
    recentActivity: Array<{
      date: string;
      logins: number;
      registrations: number;
    }>;
  }> {
    try {
      if (!id) throw new Error('District ID is required');

      const response = await this.client.get<ApiResponse<{
        totalSchools: number;
        activeSchools: number;
        totalUsers: number;
        activeUsers: number;
        totalEnrollment: number;
        usersByRole: Record<string, number>;
        schoolsByType: Record<string, number>;
        recentActivity: Array<{
          date: string;
          logins: number;
          registrations: number;
        }>;
      }>>(
        `${this.baseEndpoint}/${id}/statistics`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get district settings
   */
  async getDistrictSettings(id: string): Promise<Record<string, unknown>> {
    try {
      if (!id) throw new Error('District ID is required');

      const response = await this.client.get<ApiResponse<{ settings: Record<string, unknown> }>>(
        `${this.baseEndpoint}/${id}/settings`
      );

      return response.data.data.settings;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update district settings
   */
  async updateDistrictSettings(id: string, settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      if (!id) throw new Error('District ID is required');

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
   * Export district data
   */
  async exportDistrictData(id: string, format: 'csv' | 'json' | 'pdf' = 'csv'): Promise<Blob> {
    try {
      if (!id) throw new Error('District ID is required');

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
   * Get the API client (for internal use by OrganizationsService)
   * @internal
   */
  getClient(): ApiClient {
    return this.client;
  }
}

/**
 * Factory function to create DistrictsService instance
 */
export function createDistrictsService(client: ApiClient): DistrictsService {
  return new DistrictsService(client);
}
