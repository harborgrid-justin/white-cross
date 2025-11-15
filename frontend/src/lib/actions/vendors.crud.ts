/**
 * @fileoverview Vendor CRUD Operations
 * @module lib/actions/vendors/crud
 *
 * Create, Read, Update, Delete operations for vendors with HIPAA audit logging
 * and comprehensive error handling.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ApiResponse } from '@/types';
import type {
  ActionResult,
  Vendor,
  CreateVendorData,
  UpdateVendorData
} from './vendors.types';

// Cache tags
import { VENDOR_CACHE_TAGS } from './vendors.types';

// Utils
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';

// ==========================================
// CREATE OPERATIONS
// ==========================================

/**
 * Create a new vendor
 * Includes audit logging and cache invalidation
 */
export async function createVendorAction(data: CreateVendorData): Promise<ActionResult<Vendor>> {
  try {
    // Validate required fields
    if (!data.name || !data.type || !data.contactInfo?.email || !data.contactInfo?.phone) {
      return {
        success: false,
        error: 'Missing required fields: name, type, contact email, contact phone'
      };
    }

    // Validate email
    if (!validateEmail(data.contactInfo.email)) {
      return {
        success: false,
        error: 'Invalid email address'
      };
    }

    // Validate phone
    if (!validatePhone(data.contactInfo.phone)) {
      return {
        success: false,
        error: 'Invalid phone number'
      };
    }

    // Generate vendor code if not provided
    const vendorData = {
      ...data,
      code: data.code || generateId('VND')
    };

    const response = await serverPost<ApiResponse<Vendor>>(
      API_ENDPOINTS.VENDORS.BASE,
      vendorData,
      {
        cache: 'no-store',
        next: { tags: [VENDOR_CACHE_TAGS.VENDORS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create vendor');
    }

    // AUDIT LOG - Vendor creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Vendor',
      resourceId: response.data.id,
      details: `Created vendor: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(VENDOR_CACHE_TAGS.VENDORS, 'default');
    revalidateTag('vendor-list', 'default');
    revalidatePath('/vendors', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Vendor created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create vendor';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Vendor',
      details: `Failed to create vendor: ${errorMessage}`,
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
// UPDATE OPERATIONS
// ==========================================

/**
 * Update vendor
 * Includes audit logging and cache invalidation
 */
export async function updateVendorAction(
  vendorId: string,
  data: UpdateVendorData
): Promise<ActionResult<Vendor>> {
  try {
    if (!vendorId) {
      return {
        success: false,
        error: 'Vendor ID is required'
      };
    }

    // Validate email if provided
    if (data.contactInfo?.email && !validateEmail(data.contactInfo.email)) {
      return {
        success: false,
        error: 'Invalid email address'
      };
    }

    // Validate phone if provided
    if (data.contactInfo?.phone && !validatePhone(data.contactInfo.phone)) {
      return {
        success: false,
        error: 'Invalid phone number'
      };
    }

    const response = await serverPut<ApiResponse<Vendor>>(
      API_ENDPOINTS.VENDORS.BY_ID(vendorId),
      data,
      {
        cache: 'no-store',
        next: { tags: [VENDOR_CACHE_TAGS.VENDORS, `vendor-${vendorId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update vendor');
    }

    // AUDIT LOG - Vendor update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Vendor',
      resourceId: vendorId,
      details: 'Updated vendor information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(VENDOR_CACHE_TAGS.VENDORS, 'default');
    revalidateTag(`vendor-${vendorId}`, 'default');
    revalidateTag('vendor-list', 'default');
    revalidatePath('/vendors', 'page');
    revalidatePath(`/vendors/${vendorId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Vendor updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update vendor';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Vendor',
      resourceId: vendorId,
      details: `Failed to update vendor: ${errorMessage}`,
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
// DELETE OPERATIONS
// ==========================================

/**
 * Delete vendor (soft delete)
 * Includes audit logging and cache invalidation
 */
export async function deleteVendorAction(vendorId: string): Promise<ActionResult<void>> {
  try {
    if (!vendorId) {
      return {
        success: false,
        error: 'Vendor ID is required'
      };
    }

    await serverDelete<ApiResponse<void>>(
      API_ENDPOINTS.VENDORS.BY_ID(vendorId),
      {
        cache: 'no-store',
        next: { tags: [VENDOR_CACHE_TAGS.VENDORS, `vendor-${vendorId}`] }
      }
    );

    // AUDIT LOG - Vendor deletion
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Vendor',
      resourceId: vendorId,
      details: 'Deleted vendor (soft delete)',
      success: true
    });

    // Cache invalidation
    revalidateTag(VENDOR_CACHE_TAGS.VENDORS, 'default');
    revalidateTag(`vendor-${vendorId}`, 'default');
    revalidateTag('vendor-list', 'default');
    revalidatePath('/vendors', 'page');

    return {
      success: true,
      message: 'Vendor deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete vendor';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Vendor',
      resourceId: vendorId,
      details: `Failed to delete vendor: ${errorMessage}`,
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
// STATUS OPERATIONS
// ==========================================

/**
 * Activate/Deactivate vendor
 * Includes audit logging and cache invalidation
 */
export async function toggleVendorStatusAction(
  vendorId: string,
  isActive: boolean
): Promise<ActionResult<Vendor>> {
  try {
    if (!vendorId) {
      return {
        success: false,
        error: 'Vendor ID is required'
      };
    }

    const response = await serverPost<ApiResponse<Vendor>>(
      isActive ? API_ENDPOINTS.VENDORS.REACTIVATE(vendorId) : `${API_ENDPOINTS.VENDORS.BY_ID(vendorId)}/deactivate`,
      {},
      {
        cache: 'no-store',
        next: { tags: [VENDOR_CACHE_TAGS.VENDORS, `vendor-${vendorId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || `Failed to ${isActive ? 'activate' : 'deactivate'} vendor`);
    }

    // AUDIT LOG - Status change
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Vendor',
      resourceId: vendorId,
      details: `${isActive ? 'Activated' : 'Deactivated'} vendor`,
      changes: { isActive },
      success: true
    });

    // Cache invalidation
    revalidateTag(VENDOR_CACHE_TAGS.VENDORS, 'default');
    revalidateTag(`vendor-${vendorId}`, 'default');
    revalidateTag('vendor-list', 'default');
    revalidatePath('/vendors', 'page');
    revalidatePath(`/vendors/${vendorId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: `Vendor ${isActive ? 'activated' : 'deactivated'} successfully`
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : `Failed to ${isActive ? 'activate' : 'deactivate'} vendor`;

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Vendor',
      resourceId: vendorId,
      details: `Failed to ${isActive ? 'activate' : 'deactivate'} vendor: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
