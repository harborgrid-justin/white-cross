/**
 * @fileoverview Admin User Management Operations
 * @module lib/actions/admin.users
 *
 * HIPAA-compliant server actions for admin user management.
 * Includes caching, audit logging, and comprehensive error handling.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS } from '@/lib/cache/constants';
import { validateEmail } from '@/utils/validation/userValidation';
import { formatName } from '@/utils/formatters';
import type {
  ActionResult,
  AdminUser,
  CreateAdminUserData,
  UpdateAdminUserData,
  ApiResponse,
} from './admin.types';

// ==========================================
// CRUD OPERATIONS
// ==========================================

/** Create admin user with audit logging and cache invalidation */
export async function createAdminUserAction(data: CreateAdminUserData): Promise<ActionResult<AdminUser>> {
  try {
    // Validate required fields
    if (!data.email || !data.firstName || !data.lastName || !data.role || !data.password) {
      return {
        success: false,
        error: 'Missing required fields: email, firstName, lastName, role, password'
      };
    }

    // Validate email format
    if (!validateEmail(data.email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    const response = await serverPost<ApiResponse<AdminUser>>(
      API_ENDPOINTS.ADMIN.USERS,
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.ADMIN_USERS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create admin user');
    }

    // AUDIT LOG - Admin user creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_USER,
      resource: 'AdminUser',
      resourceId: response.data.id,
      details: `Created admin user: ${formatName(data.firstName, data.lastName)} (${data.email})`,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.ADMIN_USERS, 'default');
    revalidateTag('admin-user-list', 'default');
    revalidatePath('/admin/users', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Admin user created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create admin user';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_USER,
      resource: 'AdminUser',
      details: `Failed to create admin user: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/** Update admin user with audit logging and cache invalidation */
export async function updateAdminUserAction(
  userId: string,
  data: UpdateAdminUserData
): Promise<ActionResult<AdminUser>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    // Validate email if provided
    if (data.email && !validateEmail(data.email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    const response = await serverPut<ApiResponse<AdminUser>>(
      API_ENDPOINTS.ADMIN.USER_BY_ID(userId),
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.ADMIN_USERS, `admin-user-${userId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update admin user');
    }

    // AUDIT LOG - Admin user update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_USER,
      resource: 'AdminUser',
      resourceId: userId,
      details: 'Updated admin user information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.ADMIN_USERS, 'default');
    revalidateTag(`admin-user-${userId}`, 'default');
    revalidateTag('admin-user-list', 'default');
    revalidatePath('/admin/users', 'page');
    revalidatePath(`/admin/users/${userId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Admin user updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update admin user';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_USER,
      resource: 'AdminUser',
      resourceId: userId,
      details: `Failed to update admin user: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/** Delete admin user (soft delete) with audit logging */
export async function deleteAdminUserAction(userId: string): Promise<ActionResult<void>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    await serverDelete<ApiResponse<void>>(
      API_ENDPOINTS.ADMIN.USER_BY_ID(userId),
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.ADMIN_USERS, `admin-user-${userId}`] }
      }
    );

    // AUDIT LOG - Admin user deletion
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_USER,
      resource: 'AdminUser',
      resourceId: userId,
      details: 'Deleted admin user (soft delete)',
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.ADMIN_USERS, 'default');
    revalidateTag(`admin-user-${userId}`, 'default');
    revalidateTag('admin-user-list', 'default');
    revalidatePath('/admin/users', 'page');

    return {
      success: true,
      message: 'Admin user deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete admin user';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_USER,
      resource: 'AdminUser',
      resourceId: userId,
      details: `Failed to delete admin user: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// FORM HANDLERS
// ==========================================

/** Create admin user from form data */
export async function createAdminUserFromForm(formData: FormData): Promise<ActionResult<AdminUser>> {
  const userData: CreateAdminUserData = {
    email: formData.get('email') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    role: formData.get('role') as string,
    password: formData.get('password') as string,
    isActive: formData.get('isActive') === 'true',
  };

  const result = await createAdminUserAction(userData);

  if (result.success && result.data) {
    redirect(`/admin/users/${result.data.id}`);
  }

  return result;
}

/** Update admin user from form data */
export async function updateAdminUserFromForm(
  userId: string,
  formData: FormData
): Promise<ActionResult<AdminUser>> {
  const updateData: UpdateAdminUserData = {
    email: formData.get('email') as string || undefined,
    firstName: formData.get('firstName') as string || undefined,
    lastName: formData.get('lastName') as string || undefined,
    role: formData.get('role') as string || undefined,
    isActive: formData.has('isActive') ? formData.get('isActive') === 'true' : undefined,
  };

  // Filter out undefined values
  const filteredData = Object.entries(updateData).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof UpdateAdminUserData] = value;
    }
    return acc;
  }, {} as UpdateAdminUserData);

  const result = await updateAdminUserAction(userId, filteredData);

  if (result.success && result.data) {
    redirect(`/admin/users/${result.data.id}`);
  }

  return result;
}
