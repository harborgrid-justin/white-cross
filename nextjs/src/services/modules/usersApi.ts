/**
 * @fileoverview User Management API service for RBAC operations
 * @module services/modules/usersApi
 * @category Services - User Management & RBAC
 *
 * Provides comprehensive user management capabilities for the White Cross healthcare
 * platform with Role-Based Access Control (RBAC), user lifecycle management, and
 * administrative operations.
 *
 * Key Features:
 * - User CRUD operations (Create, Read, Update, Delete/Deactivate)
 * - User filtering and pagination with search
 * - Role-based access control (RBAC) management
 * - Password management (change password, admin reset)
 * - User activation and deactivation workflows
 * - User statistics and analytics
 * - Available nurse lookup for assignments
 * - School and district user filtering
 *
 * RBAC Roles Supported:
 * - ADMIN: Full system administration access
 * - NURSE: Healthcare provider with PHI access
 * - SCHOOL_ADMIN: School-level administrative access
 * - DISTRICT_ADMIN: District-level administrative access
 * - READ_ONLY: View-only access without modification rights
 * - COUNSELOR: Student counseling and health support access
 *
 * Security & Access Control:
 * - Admin-level authentication required for all operations
 * - Role-based permissions enforced on backend
 * - Audit logging for all user management actions
 * - Password complexity requirements enforced
 * - User deactivation instead of hard deletion (HIPAA compliance)
 * - No PHI exposure in user management endpoints
 *
 * User Lifecycle States:
 * - Active: User can authenticate and access system
 * - Inactive/Deactivated: User cannot authenticate, data retained for audit
 * - Pending: User created but not yet activated
 *
 * Search and Filtering:
 * - Full-text search across name and email fields
 * - Filter by role (ADMIN, NURSE, SCHOOL_ADMIN, etc.)
 * - Filter by school assignment
 * - Filter by active/inactive status
 * - Pagination support for large user bases
 *
 * @example Create new nurse user
 * ```typescript
 * import { usersApi } from '@/services/modules/usersApi';
 *
 * const newNurse = await usersApi.create({
 *   email: 'jane.nurse@school.edu',
 *   password: 'SecurePassword123!',
 *   firstName: 'Jane',
 *   lastName: 'Nurse',
 *   role: 'NURSE',
 *   schoolId: 'school-uuid-123',
 *   phone: '555-0100',
 *   department: 'Health Services'
 * });
 * console.log(`Created nurse: ${newNurse.id}`);
 * ```
 *
 * @example Search and filter users
 * ```typescript
 * const results = await usersApi.getAll({
 *   search: 'john',
 *   role: 'NURSE',
 *   schoolId: 'school-uuid-123',
 *   isActive: true,
 *   page: 1,
 *   limit: 20
 * });
 * console.log(`Found ${results.total} nurses matching criteria`);
 * ```
 *
 * @example Get available nurses for assignment
 * ```typescript
 * const availableNurses = await usersApi.getAvailableNurses('school-uuid-123');
 * availableNurses.forEach(nurse => {
 *   console.log(`${nurse.firstName} ${nurse.lastName}: ${nurse.availability}`);
 *   console.log(`Assigned students: ${nurse.assignedStudents}`);
 * });
 * ```
 *
 * @see {@link authApi} for user authentication operations
 * @see {@link accessControlApi} for role and permission management
 * @see {@link User} for user data type definition
 */

import type { ApiClient } from '@/services/core/ApiClient';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../utils/apiUtils';
import { User } from '../types';

/**
 * User API interfaces
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN' | 'READ_ONLY' | 'COUNSELOR';
  schoolId?: string;
  phone?: string;
  department?: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN' | 'READ_ONLY' | 'COUNSELOR';
  schoolId?: string;
  phone?: string;
  department?: string;
  isActive?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  resetToken?: string;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: Record<string, number>;
  recentLogins: Array<{
    userId: string;
    userName: string;
    lastLogin: string;
  }>;
}

export interface AvailableNurse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  schoolId?: string;
  assignedStudents: number;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
}

export interface UserFilters {
  search?: string;
  role?: string;
  schoolId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Users API Service
 * Handles all user management related API calls
 */
export class UsersApi {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Get all users with filters
   */
  async getAll(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const params = buildPaginationParams(filters?.page, filters?.limit);
    const allParams = filters ? Object.assign({}, params, filters) : params;
    const response = await this.client.get<PaginatedResponse<User>>(
      '/api/v1/users',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Get user by ID
   */
  async getById(userId: string): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>(
      `/api/v1/users/${userId}`
    );
    return response.data.data!;
  }

  /**
   * Create new user
   */
  async create(userData: CreateUserRequest): Promise<User> {
    const response = await this.client.post<ApiResponse<User>>(
      '/api/v1/users',
      userData
    );
    return response.data.data!;
  }

  /**
   * Update user
   */
  async update(userId: string, userData: UpdateUserRequest): Promise<User> {
    const response = await this.client.put<ApiResponse<User>>(
      `/api/v1/users/${userId}`,
      userData
    );
    return response.data.data!;
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    passwordData: ChangePasswordRequest
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.client.post<ApiResponse<{ success: boolean; message: string }>>(
      `/api/v1/users/${userId}/change-password`,
      passwordData
    );
    return response.data.data!;
  }

  /**
   * Reset user password (admin action)
   */
  async resetPassword(
    userId: string,
    passwordData: ResetPasswordRequest
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.client.post<ApiResponse<{ success: boolean; message: string }>>(
      `/api/v1/users/${userId}/reset-password`,
      passwordData
    );
    return response.data.data!;
  }

  /**
   * Deactivate user
   */
  async deactivate(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await this.client.post<ApiResponse<{ success: boolean; message: string }>>(
      `/api/v1/users/${userId}/deactivate`
    );
    return response.data.data!;
  }

  /**
   * Reactivate user
   */
  async reactivate(userId: string): Promise<User> {
    const response = await this.client.post<ApiResponse<User>>(
      `/api/v1/users/${userId}/reactivate`
    );
    return response.data.data!;
  }

  /**
   * Get user statistics
   */
  async getStatistics(): Promise<UserStatistics> {
    const response = await this.client.get<ApiResponse<UserStatistics>>(
      '/api/v1/users/statistics'
    );
    return response.data.data!;
  }

  /**
   * Get users by role
   */
  async getByRole(role: string): Promise<User[]> {
    const response = await this.client.get<ApiResponse<User[]>>(
      `/api/v1/users/role/${role}`
    );
    return response.data.data || [];
  }

  /**
   * Get available nurses
   */
  async getAvailableNurses(schoolId?: string): Promise<AvailableNurse[]> {
    const response = await this.client.get<ApiResponse<AvailableNurse[]>>(
      '/api/v1/users/nurses/available',
      { params: { schoolId } }
    );
    return response.data.data || [];
  }

  /**
   * Delete user (soft delete)
   */
  async delete(userId: string): Promise<{ success: boolean; message: string }> {
    return this.deactivate(userId);
  }
}

// Export singleton instance

// Factory function for creating UsersApi instances
export function createUsersApi(client: ApiClient): UsersApi {
  return new UsersApi(client);
}

// Export singleton instance for registry
import { apiClient } from '../core';
export const usersApi = createUsersApi(apiClient);
