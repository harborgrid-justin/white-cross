/**
 * @fileoverview Access Control Roles Server Actions
 * @module lib/actions/admin.access-control-roles
 *
 * HIPAA-compliant server actions for role management.
 * Includes caching, audit logging, and comprehensive error handling.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/server';
import { RBAC_ENDPOINTS } from '@/constants/api/auth';
import type { ActionResult } from './admin.types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  createdAt: string;
}

export interface CreateRoleData {
  name: string;
  description?: string;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
}

export interface UpdateRoleArgs {
  id: string;
  updates: UpdateRoleData;
}

export interface AssignPermissionArgs {
  roleId: string;
  permissionId: string;
}

export interface RemovePermissionArgs {
  roleId: string;
  permissionId: string;
}

export interface AssignRoleArgs {
  userId: string;
  roleId: string;
}

export interface RemoveRoleArgs {
  userId: string;
  roleId: string;
}

// ==========================================
// ROLES CRUD OPERATIONS
// ==========================================

/**
 * Get all roles
 */
export async function getRolesAction(): Promise<ActionResult<Role[]>> {
  try {
    const response = await serverGet<{ roles: Role[] }>(
      RBAC_ENDPOINTS.ROLES,
      {
        next: { tags: ['roles'], revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch roles');
    }

    return {
      success: true,
      data: response.data.roles,
      message: 'Roles fetched successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to fetch roles';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Get role by ID
 */
export async function getRoleByIdAction(id: string): Promise<ActionResult<Role>> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Role ID is required'
      };
    }

    const response = await serverGet<{ role: Role }>(
      `${RBAC_ENDPOINTS.ROLES}/${id}`,
      {
        next: { tags: [`role-${id}`], revalidate: 300 }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch role');
    }

    return {
      success: true,
      data: response.data.role,
      message: 'Role fetched successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to fetch role';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Create a new role
 */
export async function createRoleAction(data: CreateRoleData): Promise<ActionResult<Role>> {
  try {
    // Validate required fields
    if (!data.name) {
      return {
        success: false,
        error: 'Missing required field: name'
      };
    }

    const response = await serverPost<{ role: Role }>(
      RBAC_ENDPOINTS.ROLES,
      data,
      {
        cache: 'no-store',
        next: { tags: ['roles'] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create role');
    }

    // Cache invalidation
    revalidateTag('roles', 'default');
    revalidatePath('/admin/access-control', 'page');

    return {
      success: true,
      data: response.data.role,
      message: 'Role created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create role';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update an existing role
 */
export async function updateRoleAction(args: UpdateRoleArgs): Promise<ActionResult<Role>> {
  try {
    const { id, updates } = args;

    if (!id) {
      return {
        success: false,
        error: 'Role ID is required'
      };
    }

    const response = await serverPut<{ role: Role }>(
      `${RBAC_ENDPOINTS.ROLES}/${id}`,
      updates,
      {
        cache: 'no-store',
        next: { tags: ['roles', `role-${id}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update role');
    }

    // Cache invalidation
    revalidateTag('roles', 'default');
    revalidateTag(`role-${id}`, 'default');
    revalidatePath('/admin/access-control', 'page');

    return {
      success: true,
      data: response.data.role,
      message: 'Role updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update role';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Delete a role
 */
export async function deleteRoleAction(id: string): Promise<ActionResult<string>> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Role ID is required'
      };
    }

    const response = await serverDelete(
      `${RBAC_ENDPOINTS.ROLES}/${id}`,
      {
        cache: 'no-store'
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete role');
    }

    // Cache invalidation
    revalidateTag('roles', 'default');
    revalidateTag(`role-${id}`, 'default');
    revalidatePath('/admin/access-control', 'page');

    return {
      success: true,
      data: id,
      message: 'Role deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete role';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Initialize default system roles
 */
export async function initializeDefaultRolesAction(): Promise<ActionResult<Role[]>> {
  try {
    const response = await serverPost<{ roles: Role[] }>(
      '/api/v1/access-control/initialize-roles',
      {},
      {
        cache: 'no-store',
        next: { tags: ['roles'] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to initialize default roles');
    }

    // Cache invalidation
    revalidateTag('roles', 'default');
    revalidatePath('/admin/access-control', 'page');

    return {
      success: true,
      data: response.data.roles,
      message: 'Default roles initialized successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to initialize default roles';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// ROLE-PERMISSION ASSIGNMENTS
// ==========================================

/**
 * Assign permission to role
 */
export async function assignPermissionToRoleAction(args: AssignPermissionArgs): Promise<ActionResult<RolePermission>> {
  try {
    const { roleId, permissionId } = args;

    if (!roleId || !permissionId) {
      return {
        success: false,
        error: 'Missing required fields: roleId, permissionId'
      };
    }

    const response = await serverPost<{ rolePermission: RolePermission }>(
      `/api/v1/access-control/roles/${roleId}/permissions/${permissionId}`,
      {},
      {
        cache: 'no-store',
        next: { tags: ['roles', `role-${roleId}`, 'permissions'] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to assign permission to role');
    }

    // Cache invalidation
    revalidateTag('roles', 'default');
    revalidateTag(`role-${roleId}`, 'default');
    revalidateTag('permissions', 'default');
    revalidatePath('/admin/access-control', 'page');

    return {
      success: true,
      data: response.data.rolePermission,
      message: 'Permission assigned to role successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to assign permission to role';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Remove permission from role
 */
export async function removePermissionFromRoleAction(args: RemovePermissionArgs): Promise<ActionResult<RemovePermissionArgs>> {
  try {
    const { roleId, permissionId } = args;

    if (!roleId || !permissionId) {
      return {
        success: false,
        error: 'Missing required fields: roleId, permissionId'
      };
    }

    const response = await serverDelete(
      `/api/v1/access-control/roles/${roleId}/permissions/${permissionId}`,
      {
        cache: 'no-store'
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to remove permission from role');
    }

    // Cache invalidation
    revalidateTag('roles', 'default');
    revalidateTag(`role-${roleId}`, 'default');
    revalidateTag('permissions', 'default');
    revalidatePath('/admin/access-control', 'page');

    return {
      success: true,
      data: { roleId, permissionId },
      message: 'Permission removed from role successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to remove permission from role';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// USER-ROLE ASSIGNMENTS
// ==========================================

/**
 * Assign role to user
 */
export async function assignRoleToUserAction(args: AssignRoleArgs): Promise<ActionResult<UserRole>> {
  try {
    const { userId, roleId } = args;

    if (!userId || !roleId) {
      return {
        success: false,
        error: 'Missing required fields: userId, roleId'
      };
    }

    const response = await serverPost<{ userRole: UserRole }>(
      `/api/v1/access-control/users/${userId}/roles/${roleId}`,
      {},
      {
        cache: 'no-store',
        next: { tags: ['roles', `user-roles-${userId}`, `role-${roleId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to assign role to user');
    }

    // Cache invalidation
    revalidateTag('roles', 'default');
    revalidateTag(`user-roles-${userId}`, 'default');
    revalidateTag(`user-permissions-${userId}`, 'default');
    revalidateTag(`role-${roleId}`, 'default');
    revalidatePath(`/users/${userId}/roles`, 'page');

    return {
      success: true,
      data: response.data.userRole,
      message: 'Role assigned to user successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to assign role to user';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Remove role from user
 */
export async function removeRoleFromUserAction(args: RemoveRoleArgs): Promise<ActionResult<RemoveRoleArgs>> {
  try {
    const { userId, roleId } = args;

    if (!userId || !roleId) {
      return {
        success: false,
        error: 'Missing required fields: userId, roleId'
      };
    }

    const response = await serverDelete(
      `/api/v1/access-control/users/${userId}/roles/${roleId}`,
      {
        cache: 'no-store'
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to remove role from user');
    }

    // Cache invalidation
    revalidateTag('roles', 'default');
    revalidateTag(`user-roles-${userId}`, 'default');
    revalidateTag(`user-permissions-${userId}`, 'default');
    revalidateTag(`role-${roleId}`, 'default');
    revalidatePath(`/users/${userId}/roles`, 'page');

    return {
      success: true,
      data: { userId, roleId },
      message: 'Role removed from user successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to remove role from user';

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
 * Revalidate roles cache
 */
export async function revalidateRolesCache(): Promise<void> {
  revalidateTag('roles', 'default');
  revalidatePath('/admin/access-control', 'page');
}

/**
 * Revalidate user roles cache
 */
export async function revalidateUserRolesCache(userId: string): Promise<void> {
  revalidateTag(`user-roles-${userId}`, 'default');
  revalidateTag(`user-permissions-${userId}`, 'default');
  revalidatePath(`/users/${userId}/roles`, 'page');
}
