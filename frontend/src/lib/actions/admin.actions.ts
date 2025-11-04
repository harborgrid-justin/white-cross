/**
 * @fileoverview Admin Management Server Actions - Next.js v14+ Compatible
 * @module app/admin/actions
 *
 * HIPAA-compliant server actions for administrative management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all admin operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type {
  SystemHealth,
} from '@/types/domain/admin';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

// ==========================================
// CONFIGURATION
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
  isActive?: boolean;
}

export interface UpdateAdminUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
}

export interface District {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDistrictData {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  isActive?: boolean;
}

export interface School {
  id: string;
  districtId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  principalName: string;
  principalEmail: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchoolData {
  districtId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  principalName: string;
  principalEmail: string;
  isActive?: boolean;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string;
  isSystem: boolean;
  updatedAt: string;
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get admin user by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getAdminUser = cache(async (id: string): Promise<AdminUser | null> => {
  try {
    const response = await serverGet<ApiResponse<AdminUser>>(
      API_ENDPOINTS.ADMIN.USER_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`admin-user-${id}`, CACHE_TAGS.ADMIN_USERS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get admin user:', error);
    return null;
  }
});

/**
 * Get all admin users with caching
 */
export const getAdminUsers = cache(async (filters?: Record<string, unknown>): Promise<AdminUser[]> => {
  try {
    const response = await serverGet<ApiResponse<AdminUser[]>>(
      API_ENDPOINTS.ADMIN.USERS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [CACHE_TAGS.ADMIN_USERS, 'admin-user-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get admin users:', error);
    return [];
  }
});

/**
 * Get district by ID with caching
 */
export const getDistrict = cache(async (id: string): Promise<District | null> => {
  try {
    const response = await serverGet<ApiResponse<District>>(
      API_ENDPOINTS.ADMIN.DISTRICT_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [`district-${id}`, CACHE_TAGS.ADMIN_DISTRICTS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get district:', error);
    return null;
  }
});

/**
 * Get all districts with caching
 */
export const getDistricts = cache(async (filters?: Record<string, unknown>): Promise<District[]> => {
  try {
    const response = await serverGet<ApiResponse<District[]>>(
      API_ENDPOINTS.ADMIN.DISTRICTS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [CACHE_TAGS.ADMIN_DISTRICTS, 'district-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get districts:', error);
    return [];
  }
});

/**
 * Get school by ID with caching
 */
export const getSchool = cache(async (id: string): Promise<School | null> => {
  try {
    const response = await serverGet<ApiResponse<School>>(
      API_ENDPOINTS.ADMIN.SCHOOL_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [`school-${id}`, CACHE_TAGS.ADMIN_SCHOOLS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get school:', error);
    return null;
  }
});

/**
 * Get all schools with caching
 */
export const getSchools = cache(async (filters?: Record<string, unknown>): Promise<School[]> => {
  try {
    const response = await serverGet<ApiResponse<School[]>>(
      API_ENDPOINTS.ADMIN.SCHOOLS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [CACHE_TAGS.ADMIN_SCHOOLS, 'school-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get schools:', error);
    return [];
  }
});

// ==========================================
// ADMIN USER OPERATIONS
// ==========================================

/**
 * Create admin user
 * Includes audit logging and cache invalidation
 */
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

/**
 * Update admin user
 * Includes audit logging and cache invalidation
 */
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
      changes: data,
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

/**
 * Delete admin user (soft delete)
 * Includes audit logging and cache invalidation
 */
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
// DISTRICT OPERATIONS
// ==========================================

/**
 * Create district
 * Includes audit logging and cache invalidation
 */
export async function createDistrictAction(data: CreateDistrictData): Promise<ActionResult<District>> {
  try {
    // Validate required fields
    if (!data.name || !data.code || !data.email) {
      return {
        success: false,
        error: 'Missing required fields: name, code, email'
      };
    }

    // Validate email format
    if (!validateEmail(data.email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Validate phone if provided
    if (data.phone && !validatePhone(data.phone)) {
      return {
        success: false,
        error: 'Invalid phone format'
      };
    }

    const response = await serverPost<ApiResponse<District>>(
      API_ENDPOINTS.ADMIN.DISTRICTS,
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.ADMIN_DISTRICTS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create district');
    }

    // AUDIT LOG - District creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_ORGANIZATION,
      resource: 'District',
      resourceId: response.data.id,
      details: `Created district: ${data.name} (${data.code})`,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.ADMIN_DISTRICTS, 'default');
    revalidateTag('district-list', 'default');
    revalidatePath('/admin/districts', 'page');

    return {
      success: true,
      data: response.data,
      message: 'District created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create district';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_ORGANIZATION,
      resource: 'District',
      details: `Failed to create district: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update district
 * Includes audit logging and cache invalidation
 */
export async function updateDistrictAction(
  districtId: string,
  data: Partial<CreateDistrictData>
): Promise<ActionResult<District>> {
  try {
    if (!districtId) {
      return {
        success: false,
        error: 'District ID is required'
      };
    }

    // Validate email if provided
    if (data.email && !validateEmail(data.email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Validate phone if provided
    if (data.phone && !validatePhone(data.phone)) {
      return {
        success: false,
        error: 'Invalid phone format'
      };
    }

    const response = await serverPut<ApiResponse<District>>(
      API_ENDPOINTS.ADMIN.DISTRICT_BY_ID(districtId),
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.ADMIN_DISTRICTS, `district-${districtId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update district');
    }

    // AUDIT LOG - District update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_ORGANIZATION,
      resource: 'District',
      resourceId: districtId,
      details: 'Updated district information',
      changes: data,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.ADMIN_DISTRICTS, 'default');
    revalidateTag(`district-${districtId}`, 'default');
    revalidateTag('district-list', 'default');
    revalidatePath('/admin/districts', 'page');
    revalidatePath(`/admin/districts/${districtId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'District updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update district';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_ORGANIZATION,
      resource: 'District',
      resourceId: districtId,
      details: `Failed to update district: ${errorMessage}`,
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
// SCHOOL OPERATIONS
// ==========================================

/**
 * Create school
 * Includes audit logging and cache invalidation
 */
export async function createSchoolAction(data: CreateSchoolData): Promise<ActionResult<School>> {
  try {
    // Validate required fields
    if (!data.districtId || !data.name || !data.code || !data.email || !data.principalName || !data.principalEmail) {
      return {
        success: false,
        error: 'Missing required fields: districtId, name, code, email, principalName, principalEmail'
      };
    }

    // Validate email formats
    if (!validateEmail(data.email)) {
      return {
        success: false,
        error: 'Invalid school email format'
      };
    }

    if (!validateEmail(data.principalEmail)) {
      return {
        success: false,
        error: 'Invalid principal email format'
      };
    }

    // Validate phone if provided
    if (data.phone && !validatePhone(data.phone)) {
      return {
        success: false,
        error: 'Invalid phone format'
      };
    }

    const response = await serverPost<ApiResponse<School>>(
      API_ENDPOINTS.ADMIN.SCHOOLS,
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.ADMIN_SCHOOLS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create school');
    }

    // AUDIT LOG - School creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_ORGANIZATION,
      resource: 'School',
      resourceId: response.data.id,
      details: `Created school: ${data.name} (${data.code})`,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.ADMIN_SCHOOLS, 'default');
    revalidateTag('school-list', 'default');
    revalidatePath('/admin/schools', 'page');

    return {
      success: true,
      data: response.data,
      message: 'School created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create school';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_ORGANIZATION,
      resource: 'School',
      details: `Failed to create school: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update school
 * Includes audit logging and cache invalidation
 */
export async function updateSchoolAction(
  schoolId: string,
  data: Partial<CreateSchoolData>
): Promise<ActionResult<School>> {
  try {
    if (!schoolId) {
      return {
        success: false,
        error: 'School ID is required'
      };
    }

    // Validate emails if provided
    if (data.email && !validateEmail(data.email)) {
      return {
        success: false,
        error: 'Invalid school email format'
      };
    }

    if (data.principalEmail && !validateEmail(data.principalEmail)) {
      return {
        success: false,
        error: 'Invalid principal email format'
      };
    }

    // Validate phone if provided
    if (data.phone && !validatePhone(data.phone)) {
      return {
        success: false,
        error: 'Invalid phone format'
      };
    }

    const response = await serverPut<ApiResponse<School>>(
      API_ENDPOINTS.ADMIN.SCHOOL_BY_ID(schoolId),
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.ADMIN_SCHOOLS, `school-${schoolId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update school');
    }

    // AUDIT LOG - School update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_ORGANIZATION,
      resource: 'School',
      resourceId: schoolId,
      details: 'Updated school information',
      changes: data,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.ADMIN_SCHOOLS, 'default');
    revalidateTag(`school-${schoolId}`, 'default');
    revalidateTag('school-list', 'default');
    revalidatePath('/admin/schools', 'page');
    revalidatePath(`/admin/schools/${schoolId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'School updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update school';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_ORGANIZATION,
      resource: 'School',
      resourceId: schoolId,
      details: `Failed to update school: ${errorMessage}`,
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
// SYSTEM SETTINGS OPERATIONS
// ==========================================

/**
 * Update system setting
 * Includes audit logging and cache invalidation
 */
export async function updateSystemSettingAction(
  key: string,
  value: string
): Promise<ActionResult<SystemSettings>> {
  try {
    if (!key) {
      return {
        success: false,
        error: 'Setting key is required'
      };
    }

    const response = await serverPut<ApiResponse<SystemSettings>>(
      API_ENDPOINTS.ADMIN.CONFIGURATION_BY_KEY(key),
      { value },
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.ADMIN_SETTINGS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update system setting');
    }

    // AUDIT LOG - System setting update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_CONFIGURATION,
      resource: 'SystemSettings',
      resourceId: key,
      details: `Updated system setting: ${key}`,
      changes: { value },
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.ADMIN_SETTINGS, 'default');
    revalidatePath('/admin/settings', 'page');

    return {
      success: true,
      data: response.data,
      message: 'System setting updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update system setting';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_CONFIGURATION,
      resource: 'SystemSettings',
      resourceId: key,
      details: `Failed to update system setting: ${errorMessage}`,
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
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create admin user from form data
 * Form-friendly wrapper for createAdminUserAction
 */
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

/**
 * Update admin user from form data
 * Form-friendly wrapper for updateAdminUserAction
 */
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

/**
 * Create district from form data
 * Form-friendly wrapper for createDistrictAction
 */
export async function createDistrictFromForm(formData: FormData): Promise<ActionResult<District>> {
  const districtData: CreateDistrictData = {
    name: formData.get('name') as string,
    code: formData.get('code') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zipCode: formData.get('zipCode') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    isActive: formData.get('isActive') === 'true',
  };

  const result = await createDistrictAction(districtData);
  
  if (result.success && result.data) {
    redirect(`/admin/districts/${result.data.id}`);
  }
  
  return result;
}

/**
 * Create school from form data
 * Form-friendly wrapper for createSchoolAction
 */
export async function createSchoolFromForm(formData: FormData): Promise<ActionResult<School>> {
  const schoolData: CreateSchoolData = {
    districtId: formData.get('districtId') as string,
    name: formData.get('name') as string,
    code: formData.get('code') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zipCode: formData.get('zipCode') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    principalName: formData.get('principalName') as string,
    principalEmail: formData.get('principalEmail') as string,
    isActive: formData.get('isActive') === 'true',
  };

  const result = await createSchoolAction(schoolData);
  
  if (result.success && result.data) {
    redirect(`/admin/schools/${result.data.id}`);
  }
  
  return result;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if admin user exists
 */
export async function adminUserExists(userId: string): Promise<boolean> {
  const user = await getAdminUser(userId);
  return user !== null;
}

/**
 * Check if district exists
 */
export async function districtExists(districtId: string): Promise<boolean> {
  const district = await getDistrict(districtId);
  return district !== null;
}

/**
 * Check if school exists
 */
export async function schoolExists(schoolId: string): Promise<boolean> {
  const school = await getSchool(schoolId);
  return school !== null;
}

/**
 * Get admin user count
 */
export async function getAdminUserCount(filters?: Record<string, unknown>): Promise<number> {
  try {
    const users = await getAdminUsers(filters);
    return users.length;
  } catch {
    return 0;
  }
}

/**
 * Get district count
 */
export async function getDistrictCount(filters?: Record<string, unknown>): Promise<number> {
  try {
    const districts = await getDistricts(filters);
    return districts.length;
  } catch {
    return 0;
  }
}

/**
 * Get school count
 */
export async function getSchoolCount(filters?: Record<string, unknown>): Promise<number> {
  try {
    const schools = await getSchools(filters);
    return schools.length;
  } catch {
    return 0;
  }
}

/**
 * Clear admin cache
 */
export async function clearAdminCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`, 'default');
  }
  
  // Clear all admin caches
  [CACHE_TAGS.ADMIN_USERS, CACHE_TAGS.ADMIN_DISTRICTS, CACHE_TAGS.ADMIN_SCHOOLS, CACHE_TAGS.ADMIN_SETTINGS, CACHE_TAGS.ADMIN_LICENSES, CACHE_TAGS.ADMIN_BACKUPS, CACHE_TAGS.ADMIN_METRICS, CACHE_TAGS.ADMIN_TRAINING, CACHE_TAGS.ADMIN_AUDIT_LOGS].forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('admin-user-list', 'default');
  revalidateTag('district-list', 'default');
  revalidateTag('school-list', 'default');

  // Clear paths
  revalidatePath('/admin', 'page');
  revalidatePath('/admin/users', 'page');
  revalidatePath('/admin/districts', 'page');
  revalidatePath('/admin/schools', 'page');
  revalidatePath('/admin/settings', 'page');
}

// ==========================================
// SYSTEM MONITORING ACTIONS
// ==========================================

/**
 * Get system health information
 * Cached for 30 seconds to prevent excessive monitoring calls
 */
export const getSystemHealth = cache(async (): Promise<SystemHealth> => {
  try {
    // In production, fetch from actual monitoring service
    // For now, returning mock data
    const mockHealth: SystemHealth = {
      status: 'healthy',
      overall: {
        uptime: 2592000, // 30 days in seconds
        lastRestart: new Date('2025-09-26T00:00:00'),
        version: '1.0.0',
      },
      services: [
        {
          name: 'Database',
          status: 'operational',
          responseTime: 15,
          uptime: 99.9,
          lastCheck: new Date(),
        },
        {
          name: 'API Server',
          status: 'operational',
          responseTime: 45,
          uptime: 99.8,
          lastCheck: new Date(),
        },
        {
          name: 'Redis Cache',
          status: 'operational',
          responseTime: 5,
          uptime: 99.95,
          lastCheck: new Date(),
        },
        {
          name: 'Email Service',
          status: 'degraded',
          responseTime: 250,
          uptime: 98.5,
          lastCheck: new Date(),
          errorRate: 0.5,
        },
      ],
      metrics: {
        cpu: {
          usage: 45.2,
          cores: 8,
          temperature: 65,
        },
        memory: {
          used: 12884901888, // 12 GB
          total: 17179869184, // 16 GB
          percentage: 75,
        },
        disk: {
          used: 214748364800, // 200 GB
          total: 536870912000, // 500 GB
          percentage: 40,
        },
        network: {
          incoming: 1048576, // 1 MB/s
          outgoing: 524288, // 512 KB/s
        },
      },
      alerts: [
        {
          id: '1',
          severity: 'warning',
          service: 'Email Service',
          message: 'Response time above threshold (250ms > 200ms)',
          timestamp: new Date(),
          acknowledged: false,
        },
      ],
    };

    return mockHealth;
  } catch (error) {
    console.error('Failed to get system health:', error);
    throw new Error('Failed to retrieve system health information');
  }
});

/**
 * Get system metrics for dashboard
 */
export const getSystemMetrics = cache(async () => {
  // Mock metrics data - replace with actual implementation
  return {
    cpu: {
      usage: 35,
      cores: 8
    },
    memory: {
      used: 2048,
      total: 8192,
      percentage: 25
    },
    disk: {
      used: 120,
      total: 500,
      percentage: 24
    },
    network: {
      incoming: 1024,
      outgoing: 512
    }
  };
});
