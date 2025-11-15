/**
 * @fileoverview Allergy Record Operations
 * @module lib/actions/health-records.allergies
 *
 * Server actions for creating and managing allergy records.
 * CRITICAL: Allergies are emergency-critical PHI requiring immediate access capabilities.
 * HIPAA CRITICAL: All operations include mandatory audit logging.
 * Enhanced with shorter cache TTL (60s) for emergency data access.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z, type ZodIssue } from 'zod';

// Import schemas
import {
  allergyCreateSchema
} from '@/schemas/allergy.schemas';

// Import audit logging utilities
import {
  auditLog,
  AUDIT_ACTIONS
} from '@/lib/audit';

// Import shared utilities and types
import { API_ENDPOINTS } from '@/constants/api';
import { serverGet, serverPost } from '@/lib/api/server';
import type { ActionResult } from './health-records.types';

/**
 * Create allergy record with HIPAA audit logging
 * CRITICAL: Allergies are emergency-critical PHI
 *
 * @param prevState - Previous action state (for useActionState hook)
 * @param formData - Form data containing allergy record fields
 * @returns ActionResult with created allergy record or validation errors
 *
 * @example
 * ```typescript
 * 'use client';
 * import { useActionState } from 'react';
 * import { createAllergyAction } from '@/lib/actions/health-records.actions';
 *
 * function AllergyForm() {
 *   const [state, formAction, isPending] = useActionState(createAllergyAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */
export async function createAllergyAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      studentId: formData.get('studentId'),
      allergen: formData.get('allergen'),
      allergyType: formData.get('allergyType'),
      severity: formData.get('severity'),
      symptoms: formData.get('symptoms') || undefined,
      treatment: formData.get('treatment') || undefined,
      emergencyProtocol: formData.get('emergencyProtocol') || undefined,
      onsetDate: formData.get('onsetDate') || undefined,
      diagnosedDate: formData.get('diagnosedDate') || undefined,
      diagnosedBy: formData.get('diagnosedBy') || undefined,
      verified: formData.get('verified') === 'true',
      verifiedBy: formData.get('verifiedBy') || undefined,
      verificationDate: formData.get('verificationDate') || undefined,
      active: formData.get('active') === 'true',
      epiPenRequired: formData.get('epiPenRequired') === 'true',
      epiPenLocation: formData.get('epiPenLocation') || undefined,
      epiPenExpiration: formData.get('epiPenExpiration') || undefined,
      notes: formData.get('notes') || undefined
    };

    const validatedData = allergyCreateSchema.parse(rawData);

    const result = await serverPost(API_ENDPOINTS.ALLERGIES.BASE, validatedData, {
      tags: ['health-records', 'allergies', `student-${validatedData.studentId}-allergies`, `student-${validatedData.studentId}-health-records`, 'emergency-phi-data', 'phi-data']
    });

    // HIPAA AUDIT LOG - CRITICAL: Emergency information
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'Allergy',
      resourceId: result.data.id,
      details: `Created ${validatedData.severity} ${validatedData.allergyType} allergy (${validatedData.allergen}) for student ${validatedData.studentId}`,
      success: true
    });

    // Enhanced cache invalidation with immediate revalidation for emergency data
    revalidateTag('health-records', 'default');
    revalidateTag('allergies', 'default');
    revalidateTag(`student-${validatedData.studentId}-allergies`, 'default');
    revalidateTag(`student-${validatedData.studentId}-health-records`, 'default');
    revalidateTag('emergency-phi-data', 'default');
    revalidateTag('phi-data', 'default');
    revalidatePath(`/students/${validatedData.studentId}/health-records/allergies`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Allergy record created successfully'
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

    await auditLog({
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'Allergy',
      details: 'Failed to create allergy record',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to create allergy record']
      }
    };
  }
}

/**
 * Get student allergies with enhanced caching for emergency access
 * Uses shorter cache TTL (60 seconds) for emergency-critical data
 *
 * @param studentId - Student ID to fetch allergies for
 * @returns ActionResult with array of allergy records or error
 *
 * @example
 * ```typescript
 * const result = await getStudentAllergiesAction('student-123');
 * if (result.success) {
 *   console.log('Student allergies:', result.data);
 * }
 * ```
 */
export async function getStudentAllergiesAction(studentId: string) {
  try {
    const url = `${API_ENDPOINTS.ALLERGIES.BASE}?studentId=${studentId}`;

    const result = await serverGet(url, {
      tags: ['allergies', `student-${studentId}-allergies`, 'emergency-phi-data']
    });

    // HIPAA AUDIT LOG - Emergency PHI access
    await auditLog({
      action: AUDIT_ACTIONS.VIEW_HEALTH_RECORD,
      resource: 'Allergy',
      details: `Accessed emergency allergy information for student ${studentId}`,
      success: true
    });

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch student allergies'
    };
  }
}
