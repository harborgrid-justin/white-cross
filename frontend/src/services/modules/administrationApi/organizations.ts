/**
 * Administration API - Organizations Management (Districts & Schools)
 * 
 * Comprehensive management of organizational hierarchy including:
 * - District CRUD operations
 * - School CRUD operations
 * - Hierarchical relationships
 * - Settings management
 * - Statistics and reporting
 * 
 * @module services/modules/administrationApi/organizations
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { z, type ZodIssue } from 'zod';
import {
  ApiResponse,
  PaginatedResponse,
} from '../../types';
import { createApiError, createValidationError } from '../../core/errors';
import type {
  District,
  School,
  CreateDistrictData,
  UpdateDistrictData,
  CreateSchoolData,
  UpdateSchoolData
} from './types';
import {
  createDistrictSchema,
  updateDistrictSchema,
  createSchoolSchema,
  updateSchoolSchema
} from './validation';

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
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
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
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
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
}

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
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
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
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
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
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Combined Organizations Management Service
 */
export class OrganizationsService {
  public readonly districts: DistrictsService;
  public readonly schools: SchoolsService;

  constructor(client: ApiClient) {
    this.districts = new DistrictsService(client);
    this.schools = new SchoolsService(client);
  }

  /**
   * Get organizational hierarchy
   */
  async getHierarchy(): Promise<Array<District & {
    schools: School[];
  }>> {
    try {
      const response = await this.districts['client'].get<ApiResponse<{ hierarchy: Array<District & {
        schools: School[];
      }> }>>(
        `${API_ENDPOINTS.ADMIN.DISTRICTS}/hierarchy`
      );

      return response.data.data.hierarchy;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch organizational hierarchy');
    }
  }

  /**
   * Get organizational statistics
   */
  async getOrganizationStatistics(): Promise<{
    totalDistricts: number;
    activeDistricts: number;
    totalSchools: number;
    activeSchools: number;
    totalUsers: number;
    activeUsers: number;
    totalEnrollment: number;
    schoolsByType: Record<string, number>;
    usersByRole: Record<string, number>;
  }> {
    try {
      const response = await this.districts['client'].get<ApiResponse<{
        totalDistricts: number;
        activeDistricts: number;
        totalSchools: number;
        activeSchools: number;
        totalUsers: number;
        activeUsers: number;
        totalEnrollment: number;
        schoolsByType: Record<string, number>;
        usersByRole: Record<string, number>;
      }>>(
        `${API_ENDPOINTS.ADMIN.DISTRICTS}/statistics/organizations`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch organization statistics');
    }
  }

  /**
   * Search across all organizations
   */
  async searchOrganizations(query: string, filters: {
    type?: 'district' | 'school' | 'both';
    isActive?: boolean;
    limit?: number;
  } = {}): Promise<{
    districts: District[];
    schools: School[];
    totalResults: number;
  }> {
    try {
      if (!query.trim()) throw new Error('Search query is required');

      const searchSchema = z.object({
        query: z.string().min(1, 'Query is required').max(255, 'Query too long'),
        type: z.enum(['district', 'school', 'both']).optional().default('both'),
        isActive: z.boolean().optional(),
        limit: z.number().int().min(1).max(100).optional().default(20),
      });

      const validatedFilters = searchSchema.parse({ query, ...filters });

      const params = new URLSearchParams();
      params.append('query', validatedFilters.query);
      params.append('type', validatedFilters.type);
      if (validatedFilters.isActive !== undefined) params.append('isActive', String(validatedFilters.isActive));
      params.append('limit', String(validatedFilters.limit));

      const response = await this.districts['client'].get<ApiResponse<{
        districts: District[];
        schools: School[];
        totalResults: number;
      }>>(
        `${API_ENDPOINTS.ADMIN.DISTRICTS}/search?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Organization search failed');
    }
  }
}

/**
 * Factory functions
 */
export function createDistrictsService(client: ApiClient): DistrictsService {
  return new DistrictsService(client);
}

export function createSchoolsService(client: ApiClient): SchoolsService {
  return new SchoolsService(client);
}

export function createOrganizationsService(client: ApiClient): OrganizationsService {
  return new OrganizationsService(client);
}
