/**
 * @fileoverview Screenings Server Actions
 * @module lib/actions/health-records.screenings
 *
 * Server actions for managing health screening records.
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

export enum ScreeningType {
  VISION = 'VISION',
  HEARING = 'HEARING',
  DENTAL = 'DENTAL',
  SCOLIOSIS = 'SCOLIOSIS',
  BMI = 'BMI',
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  DEVELOPMENTAL = 'DEVELOPMENTAL',
  OTHER = 'OTHER',
}

export enum ScreeningOutcome {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  REFER = 'REFER',
  INCONCLUSIVE = 'INCONCLUSIVE',
  DECLINED = 'DECLINED',
}

export interface Screening {
  id: string;
  studentId: string;
  screeningType: ScreeningType;
  screeningDate: string;
  performedBy: string;
  outcome: ScreeningOutcome;
  results?: string;
  referralRequired?: boolean;
  referralTo?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScreeningCreate {
  studentId: string;
  screeningType: ScreeningType;
  screeningDate: string;
  performedBy: string;
  outcome: ScreeningOutcome;
  results?: string;
  referralRequired?: boolean;
  referralTo?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  notes?: string;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const screeningCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  screeningType: z.nativeEnum(ScreeningType).refine((val) => Object.values(ScreeningType).includes(val), {
    message: 'Invalid screening type'
  }),
  screeningDate: z.string().min(1, 'Screening date is required'),
  performedBy: z.string().min(1, 'Performed by is required'),
  outcome: z.nativeEnum(ScreeningOutcome).refine((val) => Object.values(ScreeningOutcome).includes(val), {
    message: 'Invalid outcome'
  }),
  results: z.string().optional(),
  referralRequired: z.boolean().optional(),
  referralTo: z.string().optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

const screeningUpdateSchema = screeningCreateSchema.partial().omit({ studentId: true });

// ==========================================
// SERVER ACTIONS
// ==========================================

/**
 * Create screening record with HIPAA audit logging
 *
 * @param prevState - Previous action state (for useActionState hook)
 * @param formData - Form data containing screening fields
 * @returns ActionResult with created record data or validation errors
 *
 * @example
 * ```typescript
 * 'use client';
 * import { useActionState } from 'react';
 * import { createScreeningAction } from '@/lib/actions/health-records.screenings';
 *
 * function ScreeningForm() {
 *   const [state, formAction, isPending] = useActionState(createScreeningAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */
export async function createScreeningAction(
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
      screeningType: formData.get('screeningType') as ScreeningType,
      screeningDate: formData.get('screeningDate') as string,
      performedBy: formData.get('performedBy') as string,
      outcome: formData.get('outcome') as ScreeningOutcome,
      results: formData.get('results') as string || undefined,
      referralRequired: formData.get('referralRequired') === 'true',
      referralTo: formData.get('referralTo') as string || undefined,
      followUpRequired: formData.get('followUpRequired') === 'true',
      followUpDate: formData.get('followUpDate') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    };

    const validatedData = screeningCreateSchema.parse(rawData);

    // Create screening via backend API
    const response = await serverPost<ApiResponse<Screening>>(
      `/api/v1/health-records/screenings`,
      validatedData,
      {
        cache: 'no-store',
        next: { tags: ['screenings', 'phi-data'] }
      }
    );

    // HIPAA AUDIT LOG - Mandatory for PHI creation
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'Screening',
      resourceId: response.data?.id,
      details: `Created ${validatedData.screeningType} screening for student ${validatedData.studentId}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('screenings', 'default');
    revalidateTag(`student-${validatedData.studentId}-screenings`, 'default');
    revalidateTag('phi-data', 'default');
    revalidatePath(`/students/${validatedData.studentId}/health-records`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: response.data,
      message: 'Screening recorded successfully'
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
      resource: 'Screening',
      details: 'Failed to create screening record',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to record screening']
      }
    };
  }
}

/**
 * Update screening record with HIPAA audit logging
 *
 * @param id - Screening record ID to update
 * @param prevState - Previous action state (for useActionState hook)
 * @param formData - Form data containing updated fields
 * @returns ActionResult with updated record data or validation errors
 */
export async function updateScreeningAction(
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
    const screeningType = formData.get('screeningType') as string;
    if (screeningType) rawData.screeningType = screeningType;

    const screeningDate = formData.get('screeningDate') as string;
    if (screeningDate) rawData.screeningDate = screeningDate;

    const performedBy = formData.get('performedBy') as string;
    if (performedBy) rawData.performedBy = performedBy;

    const outcome = formData.get('outcome') as string;
    if (outcome) rawData.outcome = outcome;

    const results = formData.get('results') as string;
    if (results) rawData.results = results;

    const referralRequired = formData.get('referralRequired') as string;
    if (referralRequired) rawData.referralRequired = referralRequired === 'true';

    const referralTo = formData.get('referralTo') as string;
    if (referralTo) rawData.referralTo = referralTo;

    const followUpRequired = formData.get('followUpRequired') as string;
    if (followUpRequired) rawData.followUpRequired = followUpRequired === 'true';

    const followUpDate = formData.get('followUpDate') as string;
    if (followUpDate) rawData.followUpDate = followUpDate;

    const notes = formData.get('notes') as string;
    if (notes) rawData.notes = notes;

    const validatedData = screeningUpdateSchema.parse(rawData);

    const response = await serverPut<ApiResponse<Screening>>(
      `/api/v1/health-records/screenings/${id}`,
      validatedData,
      {
        cache: 'no-store',
        next: { tags: ['screenings', `screening-${id}`, 'phi-data'] }
      }
    );

    // HIPAA AUDIT LOG - Mandatory for PHI modification
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'Screening',
      resourceId: id,
      details: `Updated screening record ${id}`,
      changes: validatedData,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('screenings', 'default');
    revalidateTag(`screening-${id}`, 'default');
    revalidateTag('phi-data', 'default');
    revalidatePath('/health-records');

    return {
      success: true,
      data: response.data,
      message: 'Screening updated successfully'
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
      resource: 'Screening',
      resourceId: id,
      details: `Failed to update screening record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to update screening']
      }
    };
  }
}

/**
 * Delete screening record with HIPAA audit logging
 *
 * @param id - Screening record ID to delete
 * @returns ActionResult with success status or error
 */
export async function deleteScreeningAction(id: string): Promise<ActionResult> {
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
      `/api/v1/health-records/screenings/${id}`,
      {
        cache: 'no-store',
        next: { tags: ['screenings', `screening-${id}`, 'phi-data'] }
      }
    );

    // HIPAA AUDIT LOG - Mandatory for PHI deletion
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.DELETE_HEALTH_RECORD,
      resource: 'Screening',
      resourceId: id,
      details: `Deleted screening record ${id}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('screenings', 'default');
    revalidateTag(`screening-${id}`, 'default');
    revalidateTag('phi-data', 'default');
    revalidatePath('/health-records');

    return {
      success: true,
      message: 'Screening deleted successfully'
    };
  } catch (error) {
    // HIPAA AUDIT LOG - Log failed delete attempt
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.DELETE_HEALTH_RECORD,
      resource: 'Screening',
      resourceId: id,
      details: `Failed to delete screening record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to delete screening']
      }
    };
  }
}
