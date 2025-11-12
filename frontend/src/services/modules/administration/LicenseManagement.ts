/**
 * @fileoverview License Management Service Module
 * @module services/modules/administration/LicenseManagement
 * @category Services - Administration - License Management
 *
 * Provides software license management functionality including:
 * - License CRUD operations with validation
 * - License type enforcement (TRIAL, BASIC, PROFESSIONAL, ENTERPRISE)
 * - Feature and usage limit management
 * - License activation and deactivation
 * - Type-safe pagination and filtering
 *
 * @example
 * ```typescript
 * import { LicenseManagementService } from '@/services/modules/administration/LicenseManagement';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const licenseService = new LicenseManagementService(apiClient);
 * const license = await licenseService.createLicense({
 *   licenseKey: 'ABC-123-XYZ',
 *   type: 'ENTERPRISE',
 *   features: ['FULL_ACCESS']
 * });
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { ApiResponse, PaginatedResponse } from '../../utils/apiUtils';
import { z } from 'zod';
import { createApiError, createValidationError } from '../../core/errors';
import {
  License,
  CreateLicenseData,
  UpdateLicenseData,
} from '../../../types/domain/administration';

// ==================== LICENSE VALIDATION SCHEMAS ====================

/**
 * Validation schema for creating a new license
 */
export const createLicenseSchema = z.object({
  licenseKey: z.string()
    .min(10, 'License key must be at least 10 characters')
    .max(100, 'License key cannot exceed 100 characters')
    .regex(/^[A-Z0-9-]+$/, 'License key can only contain uppercase letters, numbers, and hyphens')
    .transform(val => val.toUpperCase()),
  type: z.enum(['TRIAL', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE']),
  maxUsers: z.number()
    .min(1, 'Maximum users must be at least 1')
    .max(100000, 'Maximum users cannot exceed 100,000')
    .optional(),
  maxSchools: z.number()
    .min(1, 'Maximum schools must be at least 1')
    .max(10000, 'Maximum schools cannot exceed 10,000')
    .optional(),
  features: z.array(z.string())
    .min(1, 'At least one feature must be specified'),
  issuedTo: z.string()
    .max(200, 'Issued to field cannot exceed 200 characters')
    .optional(),
  expiresAt: z.string().or(z.date()).optional(),
  districtId: z.string().uuid('Invalid district ID format').optional(),
  notes: z.string()
    .max(2000, 'Notes cannot exceed 2000 characters')
    .optional(),
}).refine(data => {
  if (data.type === 'TRIAL') {
    if (!data.maxUsers || data.maxUsers > 10) {
      return false;
    }
    if (!data.maxSchools || data.maxSchools > 2) {
      return false;
    }
    if (!data.expiresAt) {
      return false;
    }
  }
  return true;
}, {
  message: 'Trial license must have maxUsers (<=10), maxSchools (<=2), and expiration date',
  path: ['type']
}).refine(data => {
  if (data.type === 'BASIC') {
    if (data.maxUsers && data.maxUsers > 50) return false;
    if (data.maxSchools && data.maxSchools > 5) return false;
  }
  return true;
}, {
  message: 'Basic license cannot have more than 50 users or 5 schools',
  path: ['type']
}).refine(data => {
  if (data.type === 'PROFESSIONAL') {
    if (data.maxUsers && data.maxUsers > 500) return false;
    if (data.maxSchools && data.maxSchools > 50) return false;
  }
  return true;
}, {
  message: 'Professional license cannot have more than 500 users or 50 schools',
  path: ['type']
});

/**
 * Validation schema for updating an existing license
 */
export const updateLicenseSchema = createLicenseSchema.partial();

// ==================== LICENSE MANAGEMENT SERVICE ====================

/**
 * Service class for license management operations
 */
export class LicenseManagementService {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get all licenses with pagination
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @returns Paginated list of licenses
   * @throws {ApiError} When the API request fails
   */
  async getLicenses(page: number = 1, limit: number = 20): Promise<PaginatedResponse<License>> {
    try {
      const response = await this.client.get<ApiResponse<PaginatedResponse<License>>>(
        `${API_ENDPOINTS.ADMIN.LICENSES}?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch licenses');
    }
  }

  /**
   * Get license by ID
   * @param id - License ID
   * @returns License object
   * @throws {ApiError} When the API request fails or license not found
   */
  async getLicenseById(id: string): Promise<License> {
    try {
      if (!id) throw new Error('License ID is required');

      const response = await this.client.get<ApiResponse<{ license: License }>>(
        API_ENDPOINTS.ADMIN.LICENSE_BY_ID(id)
      );

      return response.data.data.license;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch license');
    }
  }

  /**
   * Create new license with validation
   * @param licenseData - License data to create
   * @returns Created license object
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When the API request fails
   */
  async createLicense(licenseData: CreateLicenseData): Promise<License> {
    try {
      createLicenseSchema.parse(licenseData);

      const response = await this.client.post<ApiResponse<{ license: License }>>(
        API_ENDPOINTS.ADMIN.LICENSES,
        licenseData
      );

      return response.data.data.license;
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
      throw createApiError(error, 'Failed to create license');
    }
  }

  /**
   * Update existing license
   * @param id - License ID to update
   * @param data - Partial license data to update
   * @returns Updated license object
   * @throws {ApiError} When the API request fails or license not found
   */
  async updateLicense(id: string, data: UpdateLicenseData): Promise<License> {
    try {
      if (!id) throw new Error('License ID is required');

      const response = await this.client.put<ApiResponse<{ license: License }>>(
        API_ENDPOINTS.ADMIN.LICENSE_BY_ID(id),
        data
      );

      return response.data.data.license;
    } catch (error) {
      throw createApiError(error, 'Failed to update license');
    }
  }

  /**
   * Deactivate license
   * @param id - License ID to deactivate
   * @returns Deactivated license object
   * @throws {ApiError} When the API request fails or license not found
   */
  async deactivateLicense(id: string): Promise<License> {
    try {
      if (!id) throw new Error('License ID is required');

      const response = await this.client.post<ApiResponse<{ license: License }>>(
        API_ENDPOINTS.ADMIN.LICENSE_DEACTIVATE(id)
      );

      return response.data.data.license;
    } catch (error) {
      throw createApiError(error, 'Failed to deactivate license');
    }
  }
}

/**
 * Factory function to create a LicenseManagementService instance
 * @param client - ApiClient instance
 * @returns LicenseManagementService instance
 */
export function createLicenseManagementService(client: ApiClient): LicenseManagementService {
  return new LicenseManagementService(client);
}
