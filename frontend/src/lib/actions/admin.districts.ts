/**
 * @fileoverview District Management Operations
 * @module lib/actions/admin.districts
 *
 * HIPAA-compliant server actions for district management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all district operations
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
  District,
  CreateDistrictData,
  ApiResponse,
} from './admin.types';

// ==========================================
// DISTRICT CRUD OPERATIONS
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
// FORM HANDLING OPERATIONS
// ==========================================

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
