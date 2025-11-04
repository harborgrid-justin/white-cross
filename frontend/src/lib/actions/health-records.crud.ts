/**
 * @fileoverview CRUD Operations for Health Records
 * @module lib/actions/health-records.crud
 *
 * Core create, read, update, and delete operations for health records.
 * HIPAA CRITICAL: ALL operations include mandatory audit logging for PHI access.
 * Enhanced with Next.js v16 caching capabilities and revalidation patterns.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z, type ZodIssue } from 'zod';
import { serverGet } from '@/lib/api/nextjs-client';
import type { ApiResponse } from '@/types';

// Import schemas
import {
  healthRecordCreateSchema,
  healthRecordUpdateSchema
} from '@/schemas/health-record.schemas';

// Import audit logging utilities
import {
  auditLog,
  AUDIT_ACTIONS
} from '@/lib/audit';

// Import shared utilities and types
import {
  getAuthToken,
  createAuditContext,
  enhancedFetch,
  BACKEND_URL
} from './health-records.utils';
import type { ActionResult } from './health-records.types';

/**
 * Create a new health record with HIPAA audit logging
 * Enhanced with Next.js v16 caching and validation
 *
 * @param prevState - Previous action state (for useActionState hook)
 * @param formData - Form data containing health record fields
 * @returns ActionResult with created record data or validation errors
 *
 * @example
 * ```typescript
 * 'use client';
 * import { useActionState } from 'react';
 * import { createHealthRecordAction } from '@/lib/actions/health-records.actions';
 *
 * function HealthRecordForm() {
 *   const [state, formAction, isPending] = useActionState(createHealthRecordAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */
export async function createHealthRecordAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    // Parse and validate form data
    const rawData = {
      studentId: formData.get('studentId'),
      recordType: formData.get('recordType'),
      title: formData.get('title'),
      description: formData.get('description'),
      recordDate: formData.get('recordDate'),
      provider: formData.get('provider') || undefined,
      providerNpi: formData.get('providerNpi') || '',
      facility: formData.get('facility') || undefined,
      facilityNpi: formData.get('facilityNpi') || '',
      diagnosis: formData.get('diagnosis') || undefined,
      diagnosisCode: formData.get('diagnosisCode') || '',
      treatment: formData.get('treatment') || undefined,
      followUpRequired: formData.get('followUpRequired') === 'true',
      followUpDate: formData.get('followUpDate') || undefined,
      followUpCompleted: formData.get('followUpCompleted') === 'true',
      isConfidential: formData.get('isConfidential') === 'true',
      notes: formData.get('notes') || undefined,
      attachments: []
    };

    const validatedData = healthRecordCreateSchema.parse(rawData);

    // Create health record via backend API with enhanced fetch (backend uses /health-record singular)
    const response = await enhancedFetch(`${BACKEND_URL}/health-record`, {
      method: 'POST',
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create health record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG - Mandatory for PHI creation
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'HealthRecord',
      resourceId: result.data.id,
      details: `Created ${validatedData.recordType} health record for student ${validatedData.studentId}`,
      success: true
    });

    // Enhanced cache invalidation with Next.js v16
    revalidateTag('health-records', 'default');
    revalidateTag(`student-${validatedData.studentId}-health-records`, 'default');
    revalidateTag('phi-data', 'default');
    revalidatePath(`/students/${validatedData.studentId}/health-records`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Health record created successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'HealthRecord',
      details: 'Failed to create health record',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to create health record']
      }
    };
  }
}

/**
 * Get health records with enhanced caching
 *
 * @param studentId - Optional student ID to filter records
 * @param recordType - Optional record type to filter
 * @returns ActionResult with array of health records or error
 *
 * @example
 * ```typescript
 * // Get all records for a student
 * const result = await getHealthRecordsAction('student-123');
 *
 * // Get specific record type for a student
 * const immunizations = await getHealthRecordsAction('student-123', 'IMMUNIZATION');
 *
 * // Get all records across all students
 * const allRecords = await getHealthRecordsAction();
 * ```
 */
export async function getHealthRecordsAction(studentId?: string, recordType?: string) {
  try {
    // Build endpoint and params based on whether studentId is provided
    let endpoint: string;
    const params: Record<string, string> = {};

    if (studentId) {
      // Get records for a specific student
      endpoint = `/health-record/student/${studentId}`;
      if (recordType) {
        params.recordType = recordType;
      }
    } else {
      // Get all health records across all students
      endpoint = '/health-record';
      if (recordType) {
        params.type = recordType;
      }
    }

    console.log('[Health Records] Fetching from:', endpoint, params);

    const wrappedResponse = await serverGet<ApiResponse<{ data: unknown[] }>>(
      endpoint,
      params,
      {
        cache: 'no-store', // Fresh data for health records
      }
    );

    console.log('[Health Records] Response structure:', {
      hasData: !!wrappedResponse.data,
      dataType: typeof wrappedResponse.data,
      isArray: Array.isArray(wrappedResponse.data)
    });

    // HIPAA AUDIT LOG - PHI access
    const auditContext = await createAuditContext();
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.VIEW_HEALTH_RECORD,
      resource: 'HealthRecord',
      details: `Accessed health records for student ${studentId}`,
      success: true
    });

    // Backend wraps response in ApiResponse format: { success, statusCode, data: {...} }
    // The actual health records might be in wrappedResponse.data.data or wrappedResponse.data
    let healthRecords: unknown[] = [];

    if (wrappedResponse.data) {
      // If wrappedResponse.data is an array, use it directly
      if (Array.isArray(wrappedResponse.data)) {
        healthRecords = wrappedResponse.data;
      }
      // If wrappedResponse.data has a data property (double-wrapped), extract it
      else if (typeof wrappedResponse.data === 'object' && 'data' in wrappedResponse.data) {
        const nested = wrappedResponse.data as { data?: unknown[] };
        if (nested.data && Array.isArray(nested.data)) {
          healthRecords = nested.data;
        }
      }
      // If wrappedResponse.data is an object with records property
      else if (typeof wrappedResponse.data === 'object' && 'records' in wrappedResponse.data) {
        const nested = wrappedResponse.data as { records?: unknown[] };
        if (nested.records && Array.isArray(nested.records)) {
          healthRecords = nested.records;
        }
      }
    }

    console.log('[Health Records] Successfully fetched records:', healthRecords.length);

    return {
      success: true,
      data: healthRecords
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch health records';
    console.error('[Health Records] Error in getHealthRecordsAction:', errorMessage);

    // Check if it's a network/connection error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: `Cannot connect to backend server at ${BACKEND_URL}. Please ensure the backend is running.`
      };
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update health record with HIPAA audit logging
 *
 * @param id - Health record ID to update
 * @param prevState - Previous action state (for useActionState hook)
 * @param formData - Form data containing updated fields
 * @returns ActionResult with updated record data or validation errors
 *
 * @example
 * ```typescript
 * const [state, formAction] = useActionState(
 *   (prev, data) => updateHealthRecordAction('record-123', prev, data),
 *   { errors: {} }
 * );
 * ```
 */
export async function updateHealthRecordAction(
  id: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    const rawData = {
      recordType: formData.get('recordType') || undefined,
      title: formData.get('title') || undefined,
      description: formData.get('description') || undefined,
      recordDate: formData.get('recordDate') || undefined,
      provider: formData.get('provider') || undefined,
      providerNpi: formData.get('providerNpi') || '',
      facility: formData.get('facility') || undefined,
      facilityNpi: formData.get('facilityNpi') || '',
      diagnosis: formData.get('diagnosis') || undefined,
      diagnosisCode: formData.get('diagnosisCode') || '',
      treatment: formData.get('treatment') || undefined,
      followUpRequired: formData.get('followUpRequired') ? formData.get('followUpRequired') === 'true' : undefined,
      followUpDate: formData.get('followUpDate') || undefined,
      followUpCompleted: formData.get('followUpCompleted') ? formData.get('followUpCompleted') === 'true' : undefined,
      isConfidential: formData.get('isConfidential') ? formData.get('isConfidential') === 'true' : undefined,
      notes: formData.get('notes') || undefined
    };

    const validatedData = healthRecordUpdateSchema.parse(rawData);

    const response = await enhancedFetch(`${BACKEND_URL}/health-record/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update health record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG - Mandatory for PHI modification
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'HealthRecord',
      resourceId: id,
      details: `Updated health record ${id}`,
      changes: validatedData,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('health-records', 'default');
    revalidateTag(`health-record-${id}`, 'default');
    revalidateTag('phi-data', 'default');
    revalidatePath(`/health-records/${id}`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Health record updated successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    // HIPAA AUDIT LOG - Log failed update attempt
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'HealthRecord',
      resourceId: id,
      details: `Failed to update health record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to update health record']
      }
    };
  }
}

/**
 * Delete health record with HIPAA audit logging
 *
 * @param id - Health record ID to delete
 * @returns ActionResult with success status or error
 *
 * @example
 * ```typescript
 * const result = await deleteHealthRecordAction('record-123');
 * if (result.success) {
 *   console.log('Record deleted successfully');
 * }
 * ```
 */
export async function deleteHealthRecordAction(id: string): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    const response = await enhancedFetch(`${BACKEND_URL}/health-record/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete health record');
    }

    // HIPAA AUDIT LOG - Mandatory for PHI deletion
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.DELETE_HEALTH_RECORD,
      resource: 'HealthRecord',
      resourceId: id,
      details: `Deleted health record ${id}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('health-records', 'default');
    revalidateTag(`health-record-${id}`, 'default');
    revalidateTag('phi-data', 'default');
    revalidatePath('/health-records');

    return {
      success: true,
      message: 'Health record deleted successfully'
    };
  } catch (error) {
    // HIPAA AUDIT LOG - Log failed delete attempt
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.DELETE_HEALTH_RECORD,
      resource: 'HealthRecord',
      resourceId: id,
      details: `Failed to delete health record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to delete health record']
      }
    };
  }
}
