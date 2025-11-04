/**
 * @fileoverview Immunization Record Operations
 * @module lib/actions/health-records.immunizations
 *
 * Server actions for creating and managing immunization (vaccination) records.
 * HIPAA CRITICAL: All operations include mandatory audit logging for PHI access.
 * Tracks vaccine details, administration information, and compliance status.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z, type ZodIssue } from 'zod';

// Import schemas
import {
  immunizationCreateSchema
} from '@/schemas/immunization.schemas';

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
 * Create immunization record with HIPAA audit logging
 *
 * @param prevState - Previous action state (for useActionState hook)
 * @param formData - Form data containing immunization record fields
 * @returns ActionResult with created immunization record or validation errors
 *
 * @example
 * ```typescript
 * 'use client';
 * import { useActionState } from 'react';
 * import { createImmunizationAction } from '@/lib/actions/health-records.actions';
 *
 * function ImmunizationForm() {
 *   const [state, formAction, isPending] = useActionState(createImmunizationAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */
export async function createImmunizationAction(
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
      studentId: formData.get('studentId'),
      vaccineName: formData.get('vaccineName'),
      vaccineType: formData.get('vaccineType') || undefined,
      manufacturer: formData.get('manufacturer') || undefined,
      lotNumber: formData.get('lotNumber') || undefined,
      cvxCode: formData.get('cvxCode') || '',
      ndcCode: formData.get('ndcCode') || '',
      doseNumber: formData.get('doseNumber') ? Number(formData.get('doseNumber')) : undefined,
      totalDoses: formData.get('totalDoses') ? Number(formData.get('totalDoses')) : undefined,
      seriesComplete: formData.get('seriesComplete') === 'true',
      administrationDate: formData.get('administrationDate'),
      administeredBy: formData.get('administeredBy'),
      administeredByRole: formData.get('administeredByRole') || undefined,
      facility: formData.get('facility') || undefined,
      siteOfAdministration: formData.get('siteOfAdministration') || undefined,
      routeOfAdministration: formData.get('routeOfAdministration') || undefined,
      dosageAmount: formData.get('dosageAmount') || undefined,
      expirationDate: formData.get('expirationDate') || undefined,
      nextDueDate: formData.get('nextDueDate') || undefined,
      reactions: formData.get('reactions') || undefined,
      exemptionStatus: formData.get('exemptionStatus') === 'true',
      exemptionReason: formData.get('exemptionReason') || undefined,
      exemptionDocument: formData.get('exemptionDocument') || undefined,
      complianceStatus: formData.get('complianceStatus') || 'COMPLIANT',
      vfcEligibility: formData.get('vfcEligibility') === 'true',
      visProvided: formData.get('visProvided') === 'true',
      visDate: formData.get('visDate') || undefined,
      consentObtained: formData.get('consentObtained') === 'true',
      consentBy: formData.get('consentBy') || undefined,
      notes: formData.get('notes') || undefined
    };

    const validatedData = immunizationCreateSchema.parse(rawData);

    const response = await enhancedFetch(`${BACKEND_URL}/vaccinations`, {
      method: 'POST',
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create immunization record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG - Mandatory for immunization PHI
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'Vaccination',
      resourceId: result.data.id,
      details: `Created ${validatedData.vaccineName} immunization for student ${validatedData.studentId}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('health-records', 'default');
    revalidateTag('immunizations', 'default');
    revalidateTag(`student-${validatedData.studentId}-health-records`, 'default');
    revalidateTag('phi-data', 'default');
    revalidatePath(`/students/${validatedData.studentId}/health-records/immunizations`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Immunization record created successfully'
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
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'Vaccination',
      details: 'Failed to create immunization record',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to create immunization record']
      }
    };
  }
}
