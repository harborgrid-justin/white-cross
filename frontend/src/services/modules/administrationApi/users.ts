/**
 * Administration API - User Management
 * 
 * Comprehensive user management operations including:
 * - User CRUD operations
 * - Role-based access control
 * - User authentication and authorization
 * - User activity tracking
 * - Password management
 * 
 * @module services/modules/administrationApi/users
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
  User,
  CreateUserData,
  UpdateUserData,
  UserFilters,
  UserRole
} from './types';
import {
  createUserSchema,
  updateUserSchema,
  userFiltersSchema
} from './validation';

/**
 * User Management Service
 */
export class UserManagementService {
  private readonly baseEndpoint = API_ENDPOINTS.ADMIN.USERS;

  constructor(private readonly client: ApiClient) {}

  /**
   * Sanitize error messages to prevent sensitive information exposure
   */
  private sanitizeError(error: unknown): Error {
    return createApiError(error, 'User operation failed');
  }

  /**
   * Get users with filtering and pagination
   */
  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    try {
      userFiltersSchema.parse(filters);

      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters.schoolId) params.append('schoolId', filters.schoolId);
      if (filters.districtId) params.append('districtId', filters.districtId);

      const response = await this.client.get<ApiResponse<PaginatedResponse<User>>>(
        `${this.baseEndpoint}?${params.toString()}`
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

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      if (!id) throw new Error('User ID is required');

      const response = await this.client.get<ApiResponse<{ user: User }>>(
        `${this.baseEndpoint}/${id}`
      );

      return response.data.data.user;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.client.get<ApiResponse<{ user: User }>>(
        `${this.baseEndpoint}/me`
      );

      return response.data.data.user;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      createUserSchema.parse(userData);

      const response = await this.client.post<ApiResponse<{ user: User }>>(
        this.baseEndpoint,
        userData
      );

      return response.data.data.user;
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
   * Update user
   */
  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      if (!id) throw new Error('User ID is required');

      updateUserSchema.parse(userData);

      const response = await this.client.put<ApiResponse<{ user: User }>>(
        `${this.baseEndpoint}/${id}`,
        userData
      );

      return response.data.data.user;
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
   * Update current user profile
   */
  async updateCurrentUser(userData: Omit<UpdateUserData, 'role' | 'isActive'>): Promise<User> {
    try {
      const updateData = { ...userData };
      delete (updateData as UpdateUserData).role;
      delete (updateData as UpdateUserData).isActive;

      updateUserSchema.partial().parse(updateData);

      const response = await this.client.put<ApiResponse<{ user: User }>>(
        `${this.baseEndpoint}/me`,
        updateData
      );

      return response.data.data.user;
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
   * Delete (deactivate) user
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('User ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        `${this.baseEndpoint}/${id}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Activate user account
   */
  async activateUser(id: string): Promise<User> {
    try {
      if (!id) throw new Error('User ID is required');

      const response = await this.client.post<ApiResponse<{ user: User }>>(
        `${this.baseEndpoint}/${id}/activate`
      );

      return response.data.data.user;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(id: string): Promise<User> {
    try {
      if (!id) throw new Error('User ID is required');

      const response = await this.client.post<ApiResponse<{ user: User }>>(
        `${this.baseEndpoint}/${id}/deactivate`
      );

      return response.data.data.user;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Change user password (admin only)
   */
  async changeUserPassword(id: string, newPassword: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('User ID is required');

      // Validate password
      const passwordSchema = z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password cannot exceed 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

      passwordSchema.parse(newPassword);

      const response = await this.client.post<ApiResponse<{ message: string }>>(
        `${this.baseEndpoint}/${id}/change-password`,
        { newPassword }
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          'newPassword',
          { newPassword: [error.issues[0]?.message || 'Invalid password'] },
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Change current user password
   */
  async changeCurrentUserPassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      // Validate passwords
      const passwordSchema = z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password cannot exceed 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

      const changePasswordSchema = z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: passwordSchema,
        confirmPassword: z.string()
      }).refine(data => data.newPassword === data.confirmPassword, {
        message: 'New password and confirmation must match',
        path: ['confirmPassword']
      });

      changePasswordSchema.parse({ currentPassword, newPassword, confirmPassword: newPassword });

      const response = await this.client.post<ApiResponse<{ message: string }>>(
        `${this.baseEndpoint}/me/change-password`,
        { currentPassword, newPassword }
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

  /**
   * Reset user password (send reset email)
   */
  async resetUserPassword(email: string): Promise<{ message: string }> {
    try {
      const emailSchema = z.string().email('Invalid email address');
      emailSchema.parse(email);

      const response = await this.client.post<ApiResponse<{ message: string }>>(
        `${this.baseEndpoint}/reset-password`,
        { email }
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Invalid email address',
          'email',
          { email: ['Invalid email address'] },
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole, filters: Omit<UserFilters, 'role'> = {}): Promise<PaginatedResponse<User>> {
    try {
      const filtersWithRole = { ...filters, role };
      return await this.getUsers(filtersWithRole);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get users by school
   */
  async getUsersBySchool(schoolId: string, filters: Omit<UserFilters, 'schoolId'> = {}): Promise<PaginatedResponse<User>> {
    try {
      if (!schoolId) throw new Error('School ID is required');

      const filtersWithSchool = { ...filters, schoolId };
      return await this.getUsers(filtersWithSchool);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get users by district
   */
  async getUsersByDistrict(districtId: string, filters: Omit<UserFilters, 'districtId'> = {}): Promise<PaginatedResponse<User>> {
    try {
      if (!districtId) throw new Error('District ID is required');

      const filtersWithDistrict = { ...filters, districtId };
      return await this.getUsers(filtersWithDistrict);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get user activity log
   */
  async getUserActivity(id: string, filters: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<PaginatedResponse<{
    id: string;
    action: string;
    resource: string;
    ipAddress: string;
    userAgent?: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }>> {
    try {
      if (!id) throw new Error('User ID is required');

      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await this.client.get<ApiResponse<PaginatedResponse<{
        id: string;
        action: string;
        resource: string;
        ipAddress: string;
        userAgent?: string;
        timestamp: string;
        metadata?: Record<string, unknown>;
      }>>>(
        `${this.baseEndpoint}/${id}/activity?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get user login sessions
   */
  async getUserSessions(id: string): Promise<Array<{
    id: string;
    ipAddress: string;
    userAgent: string;
    loginTime: string;
    lastActivity: string;
    isActive: boolean;
    location?: {
      country: string;
      region: string;
      city: string;
    };
  }>> {
    try {
      if (!id) throw new Error('User ID is required');

      const response = await this.client.get<ApiResponse<{ sessions: Array<{
        id: string;
        ipAddress: string;
        userAgent: string;
        loginTime: string;
        lastActivity: string;
        isActive: boolean;
        location?: {
          country: string;
          region: string;
          city: string;
        };
      }> }>>(
        `${this.baseEndpoint}/${id}/sessions`
      );

      return response.data.data.sessions;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Terminate user session
   */
  async terminateUserSession(userId: string, sessionId: string): Promise<{ message: string }> {
    try {
      if (!userId) throw new Error('User ID is required');
      if (!sessionId) throw new Error('Session ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        `${this.baseEndpoint}/${userId}/sessions/${sessionId}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Terminate all user sessions (force logout)
   */
  async terminateAllUserSessions(userId: string): Promise<{ message: string; terminatedSessions: number }> {
    try {
      if (!userId) throw new Error('User ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string; terminatedSessions: number }>>(
        `${this.baseEndpoint}/${userId}/sessions`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersByRole: Record<UserRole, number>;
    recentLogins: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        usersByRole: Record<UserRole, number>;
        recentLogins: number;
        newUsersThisWeek: number;
        newUsersThisMonth: number;
      }>>(
        `${this.baseEndpoint}/statistics`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Bulk user operations
   */
  async bulkUpdateUsers(operations: Array<{
    userId: string;
    operation: 'activate' | 'deactivate' | 'delete' | 'update';
    data?: Partial<UpdateUserData>;
  }>): Promise<{
    successful: number;
    failed: number;
    errors: Array<{
      userId: string;
      operation: string;
      error: string;
    }>;
  }> {
    try {
      const bulkSchema = z.array(z.object({
        userId: z.string().uuid('Invalid user ID'),
        operation: z.enum(['activate', 'deactivate', 'delete', 'update']),
        data: updateUserSchema.partial().optional(),
      })).min(1, 'At least one operation is required').max(100, 'Maximum 100 operations per request');

      bulkSchema.parse(operations);

      const response = await this.client.post<ApiResponse<{
        successful: number;
        failed: number;
        errors: Array<{
          userId: string;
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

  /**
   * Export users to CSV
   */
  async exportUsers(filters: UserFilters = {}): Promise<Blob> {
    try {
      userFiltersSchema.parse(filters);

      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters.schoolId) params.append('schoolId', filters.schoolId);
      if (filters.districtId) params.append('districtId', filters.districtId);

      const response = await this.client.get<Blob>(
        `${this.baseEndpoint}/export?${params.toString()}`,
        { responseType: 'blob' }
      );

      return response.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Factory function to create UserManagementService
 */
export function createUserManagementService(client: ApiClient): UserManagementService {
  return new UserManagementService(client);
}
