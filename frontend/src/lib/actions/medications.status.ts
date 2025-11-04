/**
 * @fileoverview Medication Status Operations
 * @module app/medications/status
 *
 * Functions for managing medication status changes including
 * discontinuation, refill requests, and specialized operations.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS } from '@/lib/cache/constants';
import type { ApiResponse } from '@/types/core/api';
import type { Medication } from '@/types/domain/medications';
import type { ActionResult } from './medications.types';

// ==========================================
// STATUS CHANGE OPERATIONS
// ==========================================

/**
 * Discontinue medication (soft delete with reason)
 */
export async function discontinueMedication(
  medicationId: string,
  reason?: string
): Promise<ActionResult<Medication>> {
  try {
    const response = await serverPost<ApiResponse<Medication>>(
      API_ENDPOINTS.MEDICATIONS.DISCONTINUE(medicationId),
      { reason },
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.MEDICATIONS, `medication-${medicationId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to discontinue medication');
    }

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_MEDICATION,
      resource: 'Medication',
      resourceId: medicationId,
      details: `Discontinued medication${reason ? ` - Reason: ${reason}` : ''}`,
      changes: { isActive: false, discontinuedReason: reason },
      success: true
    });

    revalidateTag(CACHE_TAGS.MEDICATIONS, 'default');
    revalidateTag(`medication-${medicationId}`, 'default');
    revalidatePath('/dashboard/medications', 'page');
    revalidatePath(`/dashboard/medications/${medicationId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Medication discontinued successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to discontinue medication';

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_MEDICATION,
      resource: 'Medication',
      resourceId: medicationId,
      details: `Failed to discontinue medication: ${errorMessage}`,
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
 * Request medication refill
 */
export async function requestMedicationRefill(
  medicationId: string,
  requestedBy: string,
  notes?: string
): Promise<ActionResult<{ refillRequestId: string }>> {
  try {
    const response = await serverPost<ApiResponse<{ refillRequestId: string }>>(
      API_ENDPOINTS.MEDICATIONS.REFILL(medicationId),
      { requestedBy, notes },
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.MEDICATIONS, `medication-${medicationId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to request medication refill');
    }

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_MEDICATION,
      resource: 'Medication',
      resourceId: medicationId,
      details: `Requested medication refill by ${requestedBy}`,
      success: true
    });

    revalidateTag(CACHE_TAGS.MEDICATIONS, 'default');
    revalidateTag(`medication-${medicationId}`, 'default');
    revalidatePath('/dashboard/medications', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Medication refill requested successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to request medication refill';

    return {
      success: false,
      error: errorMessage
    };
  }
}
