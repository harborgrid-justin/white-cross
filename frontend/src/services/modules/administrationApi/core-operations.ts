/**
 * @fileoverview Core administration operations for system management
 * 
 * This module provides core administration operations including user management,
 * system settings, district/school management, and basic configuration operations.
 * 
 * @module services/modules/administrationApi/core-operations
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse, PaginatedResponse } from '../../utils/apiUtils';
import { createApiError, createValidationError } from '../../core/errors';
import { z } from 'zod';

// Import validation schemas
import {
  createUserSchema,
  updateUserSchema,
  createDistrictSchema,
  updateDistrictSchema,
  createSchoolSchema,
  updateSchoolSchema,
} from './validation';

// Import types
import type {
  User,
  District,
  School,
  SystemSettings,
  SystemSettingItem,
  SystemHealth,
  CreateUserData,
  UpdateUserData,
  CreateDistrictData,
  UpdateDistrictData,
  CreateSchoolData,
  UpdateSchoolData,
  UserQueryFilters,
} from './types';

/**
 * Core administration operations class containing basic system management functions
 * 
 * This class handles fundamental administration tasks including user management,
 * system settings, district/school operations, and health monitoring with proper
 * error handling, validation, and audit logging capabilities.
 */
export class AdministrationCoreOperations {
  constructor(private readonly client: ApiClient) {}

  // ==================== System Settings ====================

  /**
   * Get system settings grouped by category
   */
  async getSettings(): Promise<SystemSettings> {
    try {
      const response = await this.client.get<ApiResponse<SystemSettings>>(
        API_ENDPOINTS.ADMIN.SETTINGS
      );
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch system settings');
    }
  }

  /**
   * Update system settings
   */
  async updateSettings(settings: SystemSettingItem[]): Promise<SystemSettingItem[]> {
    try {
      const response = await this.client.put<ApiResponse<SystemSettingItem[]>>(
        API_ENDPOINTS.ADMIN.SETTINGS,
        { settings }
      );
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to update system settings');
    }
  }

  // ==================== User Management ====================

  /**
   * Get users with filtering and pagination
   */
  async getUsers(filters: UserQueryFilters = {}): Promise<PaginatedResponse<User>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const response = await this.client.get<ApiResponse<PaginatedResponse<User>>>(
        `${API_ENDPOINTS.ADMIN.USERS}?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch users');
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      // Validate input data
      createUserSchema.parse(userData);

      const response = await this.client.post<ApiResponse<{ user: User }>>(
        API_ENDPOINTS.ADMIN.USERS,
        userData
      );
      return response.data.data.user;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'User validation failed',
          error.issues[0]?.path.join('.') || 'user',
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to create user');
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      if (!id) throw new Error('User ID is required');

      // Validate input data
      updateUserSchema.parse(userData);

      const response = await this.client.put<ApiResponse<{ user: User }>>(
        API_ENDPOINTS.ADMIN.USER_BY_ID(id),
        userData
      );
      return response.data.data.user;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'User validation failed',
          error.issues[0]?.path.join('.') || 'user',
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to update user');
    }
  }

  /**
   * Delete (deactivate) user
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('User ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ADMIN.USER_BY_ID(id)
      );
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to delete user');
    }
  }

  // ==================== Districts ====================

  /**
   * Get all districts with pagination
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
   * Create district
   */
  async createDistrict(districtData: CreateDistrictData): Promise<District> {
    try {
      // Validate input data
      createDistrictSchema.parse(districtData);

      const response = await this.client.post<ApiResponse<{ district: District }>>(
        API_ENDPOINTS.ADMIN.DISTRICTS,
        districtData
      );
      return response.data.data.district;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'District validation failed',
          error.issues[0]?.path.join('.') || 'district',
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
   * Update district
   */
  async updateDistrict(id: string, districtData: Partial<District>): Promise<District> {
    try {
      if (!id) throw new Error('District ID is required');

      // Validate input data if provided
      if (Object.keys(districtData).length > 0) {
        updateDistrictSchema.parse(districtData);
      }

      const response = await this.client.put<ApiResponse<{ district: District }>>(
        API_ENDPOINTS.ADMIN.DISTRICT_BY_ID(id),
        districtData
      );
      return response.data.data.district;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'District validation failed',
          error.issues[0]?.path.join('.') || 'district',
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to update district');
    }
  }

  /**
   * Delete district
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

  // ==================== Schools ====================

  /**
   * Get all schools with pagination
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
   * Create school
   */
  async createSchool(schoolData: CreateSchoolData): Promise<School> {
    try {
      // Validate input data
      createSchoolSchema.parse(schoolData);

      const response = await this.client.post<ApiResponse<{ school: School }>>(
        API_ENDPOINTS.ADMIN.SCHOOLS,
        schoolData
      );
      return response.data.data.school;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'School validation failed',
          error.issues[0]?.path.join('.') || 'school',
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
   * Update school
   */
  async updateSchool(id: string, schoolData: Partial<School>): Promise<School> {
    try {
      if (!id) throw new Error('School ID is required');

      // Validate input data if provided
      if (Object.keys(schoolData).length > 0) {
        updateSchoolSchema.parse(schoolData);
      }

      const response = await this.client.put<ApiResponse<{ school: School }>>(
        API_ENDPOINTS.ADMIN.SCHOOL_BY_ID(id),
        schoolData
      );
      return response.data.data.school;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'School validation failed',
          error.issues[0]?.path.join('.') || 'school',
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to update school');
    }
  }

  /**
   * Delete school
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

  // ==================== System Health ====================

  /**
   * Get system health metrics
   */
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await this.client.get<ApiResponse<SystemHealth>>(
        API_ENDPOINTS.ADMIN.SYSTEM_HEALTH
      );
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch system health');
    }
  }
}
