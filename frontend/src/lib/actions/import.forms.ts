/**
 * @fileoverview Import Form Handling
 * @module lib/actions/import.forms
 *
 * Form data handling for import operations.
 * Provides form-friendly wrappers for CRUD actions.
 */

'use server';

import { revalidatePath } from 'next/cache';

// Types
import type {
  ActionResult,
  ImportJob,
  CreateImportJobData,
  ImportTemplate,
  CreateImportTemplateData,
} from './import.types';

// CRUD operations
import { createImportJobAction, createImportTemplateAction } from './import.crud';

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create import job from form data
 * Form-friendly wrapper for createImportJobAction
 */
export async function createImportJobFromForm(formData: FormData): Promise<ActionResult<ImportJob>> {
  const mappingRaw = formData.get('mapping') as string;
  const mapping = mappingRaw
    ? JSON.parse(mappingRaw)
    : undefined;

  const validationRulesRaw = formData.get('validationRules') as string;
  const validationRules = validationRulesRaw
    ? JSON.parse(validationRulesRaw)
    : undefined;

  const jobData: CreateImportJobData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || undefined,
    type: formData.get('type') as ImportJob['type'],
    format: formData.get('format') as ImportJob['format'],
    fileName: formData.get('fileName') as string,
    fileSize: parseInt(formData.get('fileSize') as string),
    fileUrl: formData.get('fileUrl') as string,
    mapping,
    validationRules,
    templateId: formData.get('templateId') as string || undefined,
    isDryRun: formData.get('isDryRun') === 'true',
  };

  const result = await createImportJobAction(jobData);

  if (result.success && result.data) {
    revalidatePath('/import', 'page');
  }

  return result;
}

/**
 * Create import template from form data
 * Form-friendly wrapper for createImportTemplateAction
 */
export async function createImportTemplateFromForm(formData: FormData): Promise<ActionResult<ImportTemplate>> {
  const defaultMappingRaw = formData.get('defaultMapping') as string;
  const defaultMapping = defaultMappingRaw
    ? JSON.parse(defaultMappingRaw)
    : undefined;

  const defaultValidationRulesRaw = formData.get('defaultValidationRules') as string;
  const defaultValidationRules = defaultValidationRulesRaw
    ? JSON.parse(defaultValidationRulesRaw)
    : undefined;

  const templateData: CreateImportTemplateData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as ImportJob['type'],
    format: formData.get('format') as ImportJob['format'],
    defaultMapping,
    defaultValidationRules,
    isActive: formData.get('isActive') === 'true',
  };

  const result = await createImportTemplateAction(templateData);

  if (result.success && result.data) {
    revalidatePath('/import/templates', 'page');
  }

  return result;
}
