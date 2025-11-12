/**
 * @fileoverview Organization Management Service Module
 * @module services/modules/administration/OrganizationManagement
 * @category Services - Administration - Organization Management
 *
 * Provides district and school hierarchy management with CRUD operations,
 * validation, type-safe filtering and comprehensive error handling.
 *
 * @example
 * ```typescript
 * const orgService = new OrganizationManagementService(apiClient);
 * const districts = await orgService.getDistricts(1, 20);
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { ApiResponse, PaginatedResponse } from '../../utils/apiUtils';
import { z } from 'zod';
import { createApiError, createValidationError } from '../../core/errors';
import {
  District,
  School,
  CreateDistrictData,
  UpdateDistrictData,
  CreateSchoolData,
  UpdateSchoolData,
} from '../../../types/domain/administration';

// ==================== DISTRICT VALIDATION SCHEMAS ====================

/**
 * Validation schema for creating a new district
 */
export const createDistrictSchema = z.object({
  name: z.string()
    .min(2, 'District name must be at least 2 characters')
    .max(200, 'District name cannot exceed 200 characters'),
  code: z.string()
    .min(2, 'District code must be at least 2 characters')
    .max(50, 'District code cannot exceed 50 characters')
    .regex(/^[A-Z0-9_-]+$/, 'District code can only contain uppercase letters, numbers, hyphens, and underscores')
    .transform(val => val.toUpperCase()),
  address: z.string()
    .max(500, 'Address cannot exceed 500 characters')
    .optional(),
  city: z.string()
    .max(100, 'City cannot exceed 100 characters')
    .optional(),
  state: z.string()
    .length(2, 'State must be a 2-letter abbreviation')
    .regex(/^[A-Z]{2}$/, 'State must be uppercase')
    .optional(),
  zipCode: z.string()
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, 'ZIP code must be in format 12345 or 12345-6789')
    .optional(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[\d\s\-\(\)\+\.]+$/, 'Phone number contains invalid characters')
    .optional(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .optional()
    .or(z.literal('')),
  website: z.string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
}).refine(data => data.phone || data.email || data.address, {
  message: 'District must have at least one form of contact information (phone, email, or address)',
  path: ['phone']
});

/**
 * Validation schema for updating an existing district
 */
export const updateDistrictSchema = createDistrictSchema.partial();

// ==================== SCHOOL VALIDATION SCHEMAS ====================

/**
 * Validation schema for creating a new school
 */
export const createSchoolSchema = z.object({
  name: z.string()
    .min(2, 'School name must be at least 2 characters')
    .max(200, 'School name cannot exceed 200 characters'),
  code: z.string()
    .min(2, 'School code must be at least 2 characters')
    .max(50, 'School code cannot exceed 50 characters')
    .regex(/^[A-Z0-9_-]+$/, 'School code can only contain uppercase letters, numbers, hyphens, and underscores')
    .transform(val => val.toUpperCase()),
  districtId: z.string()
    .uuid('Invalid district ID format')
    .min(1, 'District ID is required'),
  address: z.string()
    .max(500, 'Address cannot exceed 500 characters')
    .optional(),
  city: z.string()
    .max(100, 'City cannot exceed 100 characters')
    .optional(),
  state: z.string()
    .length(2, 'State must be a 2-letter abbreviation')
    .regex(/^[A-Z]{2}$/, 'State must be uppercase')
    .optional(),
  zipCode: z.string()
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, 'ZIP code must be in format 12345 or 12345-6789')
    .optional(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[\d\s\-\(\)\+\.]+$/, 'Phone number contains invalid characters')
    .optional(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .optional()
    .or(z.literal('')),
  principal: z.string()
    .max(200, 'Principal name cannot exceed 200 characters')
    .optional(),
  totalEnrollment: z.number()
    .min(0, 'Total enrollment cannot be negative')
    .max(50000, 'Total enrollment cannot exceed 50,000')
    .optional(),
}).refine(data => data.phone || data.email || data.address, {
  message: 'School must have at least one form of contact information (phone, email, or address)',
  path: ['phone']
});

/**
 * Validation schema for updating an existing school
 */
export const updateSchoolSchema = createSchoolSchema.partial().omit({ districtId: true });

// ==================== ORGANIZATION MANAGEMENT SERVICE ====================

/**
 * Service class for organization (district and school) management operations
 */
export class OrganizationManagementService {
  constructor(private readonly client: ApiClient) {}

  // ==================== DISTRICT METHODS ====================

  /**
   * Get all districts with pagination
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @returns Paginated list of districts
   * @throws {ApiError} When the API request fails
   */
  async getDistricts(page: number = 1, limit: number = 20): Promise<PaginatedResponse<District>> {
    try {
      const response = await this.client.get<ApiResponse<PaginatedResponse<District>>>(
        `${API_ENDPOINTS.ADMIN.DISTRICTS}?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch districts');
    }
  }

  /**
   * Get district by ID
   * @param id - District ID
   * @returns District object
   * @throws {ApiError} When the API request fails or district not found
   */
  async getDistrictById(id: string): Promise<District> {
    try {
      if (!id) throw new Error('District ID is required');

      const response = await this.client.get<ApiResponse<{ district: District }>>(
        API_ENDPOINTS.ADMIN.DISTRICT_BY_ID(id)
      );

      return response.data.data.district;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch district');
    }
  }

  /**
   * Create new district with validation
   * @param districtData - District data to create
   * @returns Created district object
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When the API request fails
   */
  async createDistrict(districtData: z.infer<typeof createDistrictSchema>): Promise<District> {
    try {
      createDistrictSchema.parse(districtData);

      const response = await this.client.post<ApiResponse<{ district: District }>>(
        API_ENDPOINTS.ADMIN.DISTRICTS,
        districtData
      );

      return response.data.data.district;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to create district');
    }
  }

  /**
   * Update existing district
   * @param id - District ID to update
   * @param districtData - Partial district data to update
   * @returns Updated district object
   * @throws {ApiError} When the API request fails or district not found
   */
  async updateDistrict(id: string, districtData: Partial<District>): Promise<District> {
    try {
      if (!id) throw new Error('District ID is required');

      const response = await this.client.put<ApiResponse<{ district: District }>>(
        API_ENDPOINTS.ADMIN.DISTRICT_BY_ID(id),
        districtData
      );

      return response.data.data.district;
    } catch (error) {
      throw createApiError(error, 'Failed to update district');
    }
  }

  /**
   * Delete district
   * @param id - District ID to delete
   * @returns Success message
   * @throws {ApiError} When the API request fails or district not found
   */
  async deleteDistrict(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('District ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ADMIN.DISTRICT_BY_ID(id)
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to delete district');
    }
  }

  // ==================== SCHOOL METHODS ====================

  /**
   * Get all schools with pagination and optional district filtering
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @param districtId - Optional district ID to filter schools
   * @returns Paginated list of schools
   * @throws {ApiError} When the API request fails
   */
  async getSchools(page: number = 1, limit: number = 20, districtId?: string): Promise<PaginatedResponse<School>> {
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      if (districtId) params.append('districtId', districtId);

      const response = await this.client.get<ApiResponse<PaginatedResponse<School>>>(
        `${API_ENDPOINTS.ADMIN.SCHOOLS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch schools');
    }
  }

  /**
   * Get school by ID
   * @param id - School ID
   * @returns School object
   * @throws {ApiError} When the API request fails or school not found
   */
  async getSchoolById(id: string): Promise<School> {
    try {
      if (!id) throw new Error('School ID is required');

      const response = await this.client.get<ApiResponse<{ school: School }>>(
        API_ENDPOINTS.ADMIN.SCHOOL_BY_ID(id)
      );

      return response.data.data.school;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch school');
    }
  }

  /**
   * Create new school with validation
   * @param schoolData - School data to create
   * @returns Created school object
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When the API request fails
   */
  async createSchool(schoolData: z.infer<typeof createSchoolSchema>): Promise<School> {
    try {
      createSchoolSchema.parse(schoolData);

      const response = await this.client.post<ApiResponse<{ school: School }>>(
        API_ENDPOINTS.ADMIN.SCHOOLS,
        schoolData
      );

      return response.data.data.school;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to create school');
    }
  }

  /**
   * Update existing school
   * @param id - School ID to update
   * @param schoolData - Partial school data to update
   * @returns Updated school object
   * @throws {ApiError} When the API request fails or school not found
   */
  async updateSchool(id: string, schoolData: Partial<School>): Promise<School> {
    try {
      if (!id) throw new Error('School ID is required');

      const response = await this.client.put<ApiResponse<{ school: School }>>(
        API_ENDPOINTS.ADMIN.SCHOOL_BY_ID(id),
        schoolData
      );

      return response.data.data.school;
    } catch (error) {
      throw createApiError(error, 'Failed to update school');
    }
  }

  /**
   * Delete school
   * @param id - School ID to delete
   * @returns Success message
   * @throws {ApiError} When the API request fails or school not found
   */
  async deleteSchool(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('School ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ADMIN.SCHOOL_BY_ID(id)
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to delete school');
    }
  }
}

/**
 * Factory function to create an OrganizationManagementService instance
 * @param client - ApiClient instance
 * @returns OrganizationManagementService instance
 */
export function createOrganizationManagementService(client: ApiClient): OrganizationManagementService {
  return new OrganizationManagementService(client);
}
