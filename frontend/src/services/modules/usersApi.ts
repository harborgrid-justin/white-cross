/**
 * Users API Module
 * Provides frontend access to user management endpoints
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
