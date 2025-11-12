/**
 * @fileoverview User Management Service Module
 * @module services/modules/administration/UserManagement
 * @category Services - Administration - User Management
 *
 * Provides user management functionality including:
 * - User CRUD operations with RBAC
 * - Input validation using Zod schemas
 * - Type-safe user filtering and pagination
 * - Comprehensive error handling
 *
 * @example
 * ```typescript
 * import { UserManagementService } from '@/services/modules/administration/UserManagement';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const userService = new UserManagementService(apiClient);
 * const users = await userService.getUsers({ role: 'ADMIN', page: 1 });
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { ApiResponse, PaginatedResponse } from '../../utils/apiUtils';
import { z } from 'zod';
import { createApiError, createValidationError } from '../../core/errors';
import {
  User,
  CreateUserData,
  UpdateUserData,
  UserFilters,
} from '../../../types/domain/administration';

// ==================== USER VALIDATION SCHEMAS ====================

/**
 * Validation schema for creating a new user
 */
export const createUserSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name cannot exceed 100 characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name cannot exceed 100 characters'),
  role: z.enum(['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER']),
  schoolId: z.string().uuid('Invalid school ID format').optional(),
  districtId: z.string().uuid('Invalid district ID format').optional(),
});

/**
 * Validation schema for updating an existing user
 */
export const updateUserSchema = createUserSchema.partial().omit({ password: true });

// ==================== USER MANAGEMENT SERVICE ====================

/**
 * User filters for querying users
 */
export interface GetUsersFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

/**
 * Service class for user management operations
 */
export class UserManagementService {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get users with filtering and pagination
   * @param filters - Optional filters for querying users
   * @returns Paginated list of users
   * @throws {ApiError} When the API request fails
   */
  async getUsers(filters: GetUsersFilters = {}): Promise<PaginatedResponse<User>> {
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
   * Create new user with validation
   * @param userData - User data to create
   * @returns Created user object
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When the API request fails
   */
  async createUser(userData: z.infer<typeof createUserSchema>): Promise<User> {
    try {
      createUserSchema.parse(userData);

      const response = await this.client.post<ApiResponse<{ user: User }>>(
        API_ENDPOINTS.ADMIN.USERS,
        userData
      );

      return response.data.data.user;
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
      throw createApiError(error, 'Failed to create user');
    }
  }

  /**
   * Update existing user with validation
   * @param id - User ID to update
   * @param userData - Partial user data to update
   * @returns Updated user object
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When the API request fails or user not found
   */
  async updateUser(id: string, userData: z.infer<typeof updateUserSchema>): Promise<User> {
    try {
      if (!id) throw new Error('User ID is required');

      updateUserSchema.parse(userData);

      const response = await this.client.put<ApiResponse<{ user: User }>>(
        API_ENDPOINTS.ADMIN.USER_BY_ID(id),
        userData
      );

      return response.data.data.user;
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
      throw createApiError(error, 'Failed to update user');
    }
  }

  /**
   * Delete (deactivate) user
   * @param id - User ID to delete
   * @returns Success message
   * @throws {ApiError} When the API request fails or user not found
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
}

/**
 * Factory function to create a UserManagementService instance
 * @param client - ApiClient instance
 * @returns UserManagementService instance
 */
export function createUserManagementService(client: ApiClient): UserManagementService {
  return new UserManagementService(client);
}
