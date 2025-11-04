/**
 * @fileoverview Vendor Evaluation Operations
 * @module lib/actions/vendors/evaluations
 *
 * Vendor evaluation management with HIPAA audit logging and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ApiResponse } from '@/types';
import type {
  ActionResult,
  VendorEvaluation
} from './vendors.types';

// Cache tags
import { VENDOR_CACHE_TAGS } from './vendors.types';

// ==========================================
// EVALUATION OPERATIONS
// ==========================================

/**
 * Create vendor evaluation
 * Includes audit logging and cache invalidation
 */
export async function createVendorEvaluationAction(
  vendorId: string,
  evaluationData: Omit<VendorEvaluation, 'id' | 'vendorId' | 'createdBy' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<VendorEvaluation>> {
  try {
    if (!vendorId) {
      return {
        success: false,
        error: 'Vendor ID is required'
      };
    }

    const response = await serverPost<ApiResponse<VendorEvaluation>>(
      `${API_ENDPOINTS.VENDORS.BY_ID(vendorId)}/evaluations`,
      evaluationData,
      {
        cache: 'no-store',
        next: { tags: [VENDOR_CACHE_TAGS.EVALUATIONS, `vendor-evaluations-${vendorId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create vendor evaluation');
    }

    // AUDIT LOG - Evaluation creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'VendorEvaluation',
      resourceId: response.data.id,
      details: `Created vendor evaluation (${evaluationData.evaluationType})`,
      success: true
    });

    // Cache invalidation
    revalidateTag(VENDOR_CACHE_TAGS.EVALUATIONS, 'default');
    revalidateTag(`vendor-evaluations-${vendorId}`, 'default');
    revalidateTag(`vendor-${vendorId}`, 'default');
    revalidatePath('/vendors', 'page');
    revalidatePath(`/vendors/${vendorId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Vendor evaluation created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create vendor evaluation';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'VendorEvaluation',
      details: `Failed to create vendor evaluation: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
