/**
 * @fileoverview Immunization Form Handling
 * @module lib/actions/immunizations/forms
 *
 * Form data parsing and handling for immunization records.
 * Provides form-friendly wrappers for CRUD operations.
 */

'use server';

import { revalidatePath } from 'next/cache';
import type { ActionResult, ImmunizationRecord, CreateImmunizationRecordData } from './immunizations.types';
import { createImmunizationRecordAction } from './immunizations.crud';

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create immunization record from form data
 * Form-friendly wrapper for createImmunizationRecordAction
 */
export async function createImmunizationRecordFromForm(
  formData: FormData
): Promise<ActionResult<ImmunizationRecord>> {
  const recordData: CreateImmunizationRecordData = {
    studentId: formData.get('studentId') as string,
    vaccineId: formData.get('vaccineId') as string,
    administeredDate: formData.get('administeredDate') as string,
    administeredBy: formData.get('administeredBy') as string,
    administrationSite: formData.get('administrationSite') as ImmunizationRecord['administrationSite'],
    dosage: formData.get('dosage') as string,
    doseNumber: parseInt(formData.get('doseNumber') as string),
    seriesComplete: formData.get('seriesComplete') === 'true',
    nextDueDate: formData.get('nextDueDate') as string || undefined,
    notes: formData.get('notes') as string || undefined,
    reactionObserved: formData.get('reactionObserved') === 'true',
    reactionDetails: formData.get('reactionDetails') as string || undefined,
    lotNumber: formData.get('lotNumber') as string,
    ndc: formData.get('ndc') as string || undefined,
  };

  const result = await createImmunizationRecordAction(recordData);

  if (result.success && result.data) {
    revalidatePath('/immunizations', 'page');
  }

  return result;
}
