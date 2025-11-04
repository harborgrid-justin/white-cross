/**
 * @fileoverview School Management Operations
 * @module lib/actions/admin.schools
 *
 * HIPAA-compliant server actions for school management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all school operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { serverPost, serverPut, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS } from '@/lib/cache/constants';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import type {
  ActionResult,
  School,
  CreateSchoolData,
  ApiResponse,
} from './admin.types';

// ==========================================
// SCHOOL CRUD OPERATIONS
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
// FORM HANDLING OPERATIONS
// ==========================================

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
