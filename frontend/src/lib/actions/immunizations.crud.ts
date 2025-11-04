/**
 * @fileoverview Immunization CRUD Operations
 * @module lib/actions/immunizations/crud
 *
 * Create, Read, Update, Delete operations for immunization records.
 * Includes HIPAA audit logging and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, serverPut, NextApiClientError } from '@/lib/api/nextjs-client';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS } from '@/lib/cache/constants';
import type { ApiResponse } from '@/types/api';
import type {
  ActionResult,
  ImmunizationRecord,
  CreateImmunizationRecordData,
  UpdateImmunizationRecordData,
} from './immunizations.types';
import { IMMUNIZATION_CACHE_TAGS } from './immunizations.cache';

// ==========================================
// CREATE OPERATIONS
// ==========================================

/**
 * Create a new immunization record
 * Includes HIPAA audit logging and cache invalidation
 */
export async function createImmunizationRecordAction(
  data: CreateImmunizationRecordData
): Promise<ActionResult<ImmunizationRecord>> {
  try {
    // Validate required fields
    if (!data.studentId || !data.vaccineId || !data.administeredDate || !data.administeredBy) {
      return {
        success: false,
        error: 'Missing required fields: studentId, vaccineId, administeredDate, administeredBy'
      };
    }

    const response = await serverPost<ApiResponse<ImmunizationRecord>>(
      `/api/immunizations/records`,
      data,
      {
        cache: 'no-store',
        next: { tags: [IMMUNIZATION_CACHE_TAGS.RECORDS, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create immunization record');
    }

    // HIPAA AUDIT LOG - Mandatory for PHI creation
    await auditLog({
      action: AUDIT_ACTIONS.ADMINISTER_MEDICATION,
      resource: 'ImmunizationRecord',
      resourceId: response.data.id,
      details: `Administered vaccine ${response.data.vaccineName} to student ${response.data.studentName}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(IMMUNIZATION_CACHE_TAGS.RECORDS, 'default');
    revalidateTag('immunization-record-list', 'default');
    revalidateTag(`student-${data.studentId}-immunizations`, 'default');
    revalidatePath('/immunizations', 'page');
    revalidatePath(`/students/${data.studentId}/immunizations`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Immunization record created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create immunization record';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.ADMINISTER_MEDICATION,
      resource: 'ImmunizationRecord',
      details: `Failed to create immunization record: ${errorMessage}`,
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
 * Update immunization record
 * Includes HIPAA audit logging and cache invalidation
 */
export async function updateImmunizationRecordAction(
  recordId: string,
  data: UpdateImmunizationRecordData
): Promise<ActionResult<ImmunizationRecord>> {
  try {
    if (!recordId) {
      return {
        success: false,
        error: 'Immunization record ID is required'
      };
    }

    const response = await serverPut<ApiResponse<ImmunizationRecord>>(
      `/api/immunizations/records/${recordId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [IMMUNIZATION_CACHE_TAGS.RECORDS, `immunization-record-${recordId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update immunization record');
    }

    // HIPAA AUDIT LOG - Mandatory for PHI modification
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'ImmunizationRecord',
      resourceId: recordId,
      details: 'Updated immunization record information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(IMMUNIZATION_CACHE_TAGS.RECORDS, 'default');
    revalidateTag(`immunization-record-${recordId}`, 'default');
    revalidateTag('immunization-record-list', 'default');
    revalidateTag(`student-${response.data.studentId}-immunizations`, 'default');
    revalidatePath('/immunizations', 'page');
    revalidatePath(`/immunizations/records/${recordId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Immunization record updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update immunization record';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'ImmunizationRecord',
      resourceId: recordId,
      details: `Failed to update immunization record: ${errorMessage}`,
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
// VERIFICATION OPERATIONS
// ==========================================

/**
 * Verify immunization record
 * Includes HIPAA audit logging and cache invalidation
 */
export async function verifyImmunizationRecordAction(
  recordId: string
): Promise<ActionResult<ImmunizationRecord>> {
  try {
    if (!recordId) {
      return {
        success: false,
        error: 'Immunization record ID is required'
      };
    }

    const response = await serverPost<ApiResponse<ImmunizationRecord>>(
      `/api/immunizations/records/${recordId}/verify`,
      {},
      {
        cache: 'no-store',
        next: { tags: [IMMUNIZATION_CACHE_TAGS.RECORDS, `immunization-record-${recordId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to verify immunization record');
    }

    // HIPAA AUDIT LOG
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'ImmunizationRecord',
      resourceId: recordId,
      details: 'Verified immunization record',
      success: true
    });

    // Cache invalidation
    revalidateTag(IMMUNIZATION_CACHE_TAGS.RECORDS, 'default');
    revalidateTag(`immunization-record-${recordId}`, 'default');
    revalidateTag('immunization-record-list', 'default');
    revalidateTag(`student-${response.data.studentId}-immunizations`, 'default');
    revalidatePath('/immunizations', 'page');
    revalidatePath(`/immunizations/records/${recordId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Immunization record verified successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to verify immunization record';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'ImmunizationRecord',
      resourceId: recordId,
      details: `Failed to verify immunization record: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
