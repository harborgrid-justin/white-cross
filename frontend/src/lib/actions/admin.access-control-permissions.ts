/**
 * @fileoverview Access Control Permissions Server Actions
 * @module lib/actions/admin.access-control-permissions
 *
 * HIPAA-compliant server actions for permission management.
 * Includes caching, audit logging, and comprehensive error handling.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverGet, serverPost, NextApiClientError } from '@/lib/api/server';
import { RBAC_ENDPOINTS } from '@/constants/api/auth';
import type { ActionResult } from './admin.types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePermissionData {
  resource: string;
  action: string;
  description?: string;
}

export interface CheckPermissionArgs {
  userId: string;
  resource: string;
  action: string;
}

export interface PermissionCheckResult {
  userId: string;
  resource: string;
  action: string;
  hasPermission: boolean;
}

export interface UserPermissionsResponse {
  userId: string;
  permissions: Permission[];
  roles: string[];
}

// ==========================================
// PERMISSIONS CRUD OPERATIONS
// ==========================================

/**
 * Get all permissions
 */
export async function getPermissionsAction(): Promise<ActionResult<Permission[]>> {
  try {
    const response = await serverGet<{ permissions: Permission[] }>(
      RBAC_ENDPOINTS.PERMISSIONS,
      {
        next: { tags: ['permissions'], revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch permissions');
    }

    return {
      success: true,
      data: response.data.permissions,
      message: 'Permissions fetched successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to fetch permissions';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Create a new permission
 */
export async function createPermissionAction(data: CreatePermissionData): Promise<ActionResult<Permission>> {
  try {
    // Validate required fields
    if (!data.resource || !data.action) {
      return {
        success: false,
        error: 'Missing required fields: resource, action'
      };
    }

    const response = await serverPost<{ permission: Permission }>(
      RBAC_ENDPOINTS.PERMISSIONS,
      data,
      {
        cache: 'no-store',
        next: { tags: ['permissions'] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create permission');
    }

    // Cache invalidation
    revalidateTag('permissions', 'default');
    revalidatePath('/admin/access-control', 'page');

    return {
      success: true,
      data: response.data.permission,
      message: 'Permission created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create permission';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// USER PERMISSIONS OPERATIONS
// ==========================================

/**
 * Get user permissions
 */
export async function getUserPermissionsAction(userId: string): Promise<ActionResult<UserPermissionsResponse>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const response = await serverGet<UserPermissionsResponse>(
      RBAC_ENDPOINTS.USER_PERMISSIONS(userId),
      {
        next: { tags: [`user-permissions-${userId}`], revalidate: 300 }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch user permissions');
    }

    return {
      success: true,
      data: response.data,
      message: 'User permissions fetched successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to fetch user permissions';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Check if user has a specific permission
 */
export async function checkUserPermissionAction(args: CheckPermissionArgs): Promise<ActionResult<PermissionCheckResult>> {
  try {
    const { userId, resource, action } = args;

    if (!userId || !resource || !action) {
      return {
        success: false,
        error: 'Missing required fields: userId, resource, action'
      };
    }

    const response = await serverGet<{ hasPermission: boolean }>(
      `/api/v1/access-control/users/${userId}/check?resource=${resource}&action=${action}`,
      {
        cache: 'no-store' // Don't cache permission checks
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to check permission');
    }

    return {
      success: true,
      data: {
        userId,
        resource,
        action,
        hasPermission: response.data?.hasPermission || false
      },
      message: 'Permission check completed'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to check permission';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// CACHE REVALIDATION
// ==========================================

/**
 * Revalidate permissions cache
 */
export async function revalidatePermissionsCache(): Promise<void> {
  revalidateTag('permissions', 'default');
  revalidatePath('/admin/access-control', 'page');
}

/**
 * Revalidate user permissions cache
 */
export async function revalidateUserPermissionsCache(userId: string): Promise<void> {
  revalidateTag(`user-permissions-${userId}`, 'default');
  revalidatePath(`/users/${userId}/permissions`, 'page');
}
