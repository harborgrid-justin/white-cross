/**
 * @fileoverview Vital Signs Server Actions
 * @module lib/actions/health-records.vital-signs
 *
 * Server actions for managing vital signs records.
 * HIPAA CRITICAL: ALL operations include mandatory audit logging for PHI access.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z, type ZodIssue } from 'zod';
import { serverGet, serverPost, serverPut, serverDelete, getAuthToken } from '@/lib/api/server';
import type { ApiResponse } from '@/types';

// Import audit logging functions
import { auditLog, createAuditContextFromServer, AUDIT_ACTIONS } from '@/lib/audit';

// Import shared types
import type { ActionResult } from './health-records.types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface VitalSigns {
  id: string;
  studentId: string;
  recordDate: string;
  recordedBy: string;
  temperature?: number;
  temperatureMethod?: 'oral' | 'axillary' | 'tympanic' | 'temporal';
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  pain?: number;
  glucose?: number;
  weight?: number;
  height?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VitalSignsCreate {
  studentId: string;
  recordDate: string;
  recordedBy: string;
  temperature?: number;
  temperatureMethod?: 'oral' | 'axillary' | 'tympanic' | 'temporal';
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  pain?: number;
  glucose?: number;
  weight?: number;
  height?: number;
  notes?: string;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const vitalSignsCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  recordDate: z.string().min(1, 'Record date is required'),
  recordedBy: z.string().min(1, 'Recorded by is required'),
  temperature: z.number().min(35).max(42).optional(),
  temperatureMethod: z.enum(['oral', 'axillary', 'tympanic', 'temporal']).optional(),
  bloodPressureSystolic: z.number().min(50).max(250).optional(),
  bloodPressureDiastolic: z.number().min(30).max(150).optional(),
  heartRate: z.number().min(30).max(250).optional(),
  respiratoryRate: z.number().min(8).max(60).optional(),
  oxygenSaturation: z.number().min(0).max(100).optional(),
  pain: z.number().min(0).max(10).optional(),
  glucose: z.number().min(0).max(600).optional(),
  weight: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  notes: z.string().optional(),
});

const vitalSignsUpdateSchema = vitalSignsCreateSchema.partial().omit({ studentId: true });

// ==========================================
// SERVER ACTIONS
// ==========================================

/**
 * Create vital signs record with HIPAA audit logging
 *
 * @param prevState - Previous action state (for useActionState hook)
 * @param formData - Form data containing vital signs fields
 * @returns ActionResult with created record data or validation errors
 *
 * @example
 * ```typescript
 * 'use client';
 * import { useActionState } from 'react';
 * import { createVitalSignsAction } from '@/lib/actions/health-records.vital-signs';
 *
 * function VitalSignsForm() {
 *   const [state, formAction, isPending] = useActionState(createVitalSignsAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */
export async function createVitalSignsAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContextFromServer();

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
      studentId: formData.get('studentId') as string,
      recordDate: formData.get('recordDate') as string,
      recordedBy: formData.get('recordedBy') as string,
    };

    // Optional fields
    const temperature = formData.get('temperature') as string;
    if (temperature) {
      Object.assign(rawData, {
        temperature: parseFloat(temperature),
        temperatureMethod: formData.get('temperatureMethod') as 'oral' | 'axillary' | 'tympanic' | 'temporal',
      });
    }

    const systolic = formData.get('bloodPressureSystolic') as string;
    if (systolic) Object.assign(rawData, { bloodPressureSystolic: parseInt(systolic) });

    const diastolic = formData.get('bloodPressureDiastolic') as string;
    if (diastolic) Object.assign(rawData, { bloodPressureDiastolic: parseInt(diastolic) });

    const heartRate = formData.get('heartRate') as string;
    if (heartRate) Object.assign(rawData, { heartRate: parseInt(heartRate) });

    const respiratoryRate = formData.get('respiratoryRate') as string;
    if (respiratoryRate) Object.assign(rawData, { respiratoryRate: parseInt(respiratoryRate) });

    const oxygenSaturation = formData.get('oxygenSaturation') as string;
    if (oxygenSaturation) Object.assign(rawData, { oxygenSaturation: parseInt(oxygenSaturation) });

    const pain = formData.get('pain') as string;
    if (pain) Object.assign(rawData, { pain: parseInt(pain) });

    const glucose = formData.get('glucose') as string;
    if (glucose) Object.assign(rawData, { glucose: parseFloat(glucose) });

    const weight = formData.get('weight') as string;
    if (weight) Object.assign(rawData, { weight: parseFloat(weight) });

    const height = formData.get('height') as string;
    if (height) Object.assign(rawData, { height: parseFloat(height) });

    const notes = formData.get('notes') as string;
    if (notes) Object.assign(rawData, { notes });

    const validatedData = vitalSignsCreateSchema.parse(rawData);

    // Create vital signs via backend API
    const response = await serverPost<ApiResponse<VitalSigns>>(
      `/api/v1/health-records/vital-signs`,
      validatedData,
      {
        cache: 'no-store',
        next: { tags: ['vital-signs', 'phi-data'] }
      }
    );

    // HIPAA AUDIT LOG - Mandatory for PHI creation
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'VitalSigns',
      resourceId: response.data?.id,
      details: `Created vital signs record for student ${validatedData.studentId}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('vital-signs', 'default');
    revalidateTag(`student-${validatedData.studentId}-vital-signs`, 'default');
    revalidateTag('phi-data', 'default');
    revalidatePath(`/students/${validatedData.studentId}/health-records`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: response.data,
      message: 'Vital signs recorded successfully'
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
      resource: 'VitalSigns',
      details: 'Failed to create vital signs record',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to record vital signs']
      }
    };
  }
}

/**
 * Update vital signs record with HIPAA audit logging
 *
 * @param id - Vital signs record ID to update
 * @param prevState - Previous action state (for useActionState hook)
 * @param formData - Form data containing updated fields
 * @returns ActionResult with updated record data or validation errors
 */
export async function updateVitalSignsAction(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContextFromServer();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    const rawData: Record<string, unknown> = {};

    // Only include provided fields
    const recordDate = formData.get('recordDate') as string;
    if (recordDate) rawData.recordDate = recordDate;

    const recordedBy = formData.get('recordedBy') as string;
    if (recordedBy) rawData.recordedBy = recordedBy;

    const temperature = formData.get('temperature') as string;
    if (temperature) {
      rawData.temperature = parseFloat(temperature);
      rawData.temperatureMethod = formData.get('temperatureMethod');
    }

    const systolic = formData.get('bloodPressureSystolic') as string;
    if (systolic) rawData.bloodPressureSystolic = parseInt(systolic);

    const diastolic = formData.get('bloodPressureDiastolic') as string;
    if (diastolic) rawData.bloodPressureDiastolic = parseInt(diastolic);

    const heartRate = formData.get('heartRate') as string;
    if (heartRate) rawData.heartRate = parseInt(heartRate);

    const respiratoryRate = formData.get('respiratoryRate') as string;
    if (respiratoryRate) rawData.respiratoryRate = parseInt(respiratoryRate);

    const oxygenSaturation = formData.get('oxygenSaturation') as string;
    if (oxygenSaturation) rawData.oxygenSaturation = parseInt(oxygenSaturation);

    const pain = formData.get('pain') as string;
    if (pain) rawData.pain = parseInt(pain);

    const glucose = formData.get('glucose') as string;
    if (glucose) rawData.glucose = parseFloat(glucose);

    const weight = formData.get('weight') as string;
    if (weight) rawData.weight = parseFloat(weight);

    const height = formData.get('height') as string;
    if (height) rawData.height = parseFloat(height);

    const notes = formData.get('notes') as string;
    if (notes) rawData.notes = notes;

    const validatedData = vitalSignsUpdateSchema.parse(rawData);

    const response = await serverPut<ApiResponse<VitalSigns>>(
      `/api/v1/health-records/vital-signs/${id}`,
      validatedData,
      {
        cache: 'no-store',
        next: { tags: ['vital-signs', `vital-signs-${id}`, 'phi-data'] }
      }
    );

    // HIPAA AUDIT LOG - Mandatory for PHI modification
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'VitalSigns',
      resourceId: id,
      details: `Updated vital signs record ${id}`,
      changes: validatedData,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('vital-signs', 'default');
    revalidateTag(`vital-signs-${id}`, 'default');
    revalidateTag('phi-data', 'default');
    revalidatePath('/health-records');

    return {
      success: true,
      data: response.data,
      message: 'Vital signs updated successfully'
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
      resource: 'VitalSigns',
      resourceId: id,
      details: `Failed to update vital signs record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to update vital signs']
      }
    };
  }
}

/**
 * Delete vital signs record with HIPAA audit logging
 *
 * @param id - Vital signs record ID to delete
 * @returns ActionResult with success status or error
 */
export async function deleteVitalSignsAction(id: string): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContextFromServer();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    await serverDelete(
      `/api/v1/health-records/vital-signs/${id}`,
      {
        cache: 'no-store',
        next: { tags: ['vital-signs', `vital-signs-${id}`, 'phi-data'] }
      }
    );

    // HIPAA AUDIT LOG - Mandatory for PHI deletion
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.DELETE_HEALTH_RECORD,
      resource: 'VitalSigns',
      resourceId: id,
      details: `Deleted vital signs record ${id}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('vital-signs', 'default');
    revalidateTag(`vital-signs-${id}`, 'default');
    revalidateTag('phi-data', 'default');
    revalidatePath('/health-records');

    return {
      success: true,
      message: 'Vital signs deleted successfully'
    };
  } catch (error) {
    // HIPAA AUDIT LOG - Log failed delete attempt
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.DELETE_HEALTH_RECORD,
      resource: 'VitalSigns',
      resourceId: id,
      details: `Failed to delete vital signs record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to delete vital signs']
      }
    };
  }
}
