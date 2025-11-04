/**
 * @fileoverview Export Form Handling
 * @module app/export/forms
 *
 * Form data handling operations for export job and template creation.
 * Provides form-friendly wrappers around core action functions.
 */

'use server';

import { revalidatePath } from 'next/cache';
import type {
  ExportJob,
  ExportTemplate,
  CreateExportJobData,
  CreateExportTemplateData,
  ActionResult
} from './export.types';
import { createExportJobAction } from './export.jobs';
import { createExportTemplateAction } from './export.templates';

// ==========================================
// EXPORT JOB FORM HANDLING
// ==========================================

/**
 * Create export job from form data
 * Form-friendly wrapper for createExportJobAction
 */
export async function createExportJobFromForm(formData: FormData): Promise<ActionResult<ExportJob>> {
  const columnsRaw = formData.get('columns') as string;
  const columns = columnsRaw
    ? columnsRaw.split(',').map(col => col.trim()).filter(Boolean)
    : undefined;

  const filtersRaw = formData.get('filters') as string;
  const filters = filtersRaw
    ? JSON.parse(filtersRaw)
    : undefined;

  const jobData: CreateExportJobData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || undefined,
    type: formData.get('type') as ExportJob['type'],
    format: formData.get('format') as ExportJob['format'],
    filters,
    columns,
    scheduledAt: formData.get('scheduledAt') as string || undefined,
    templateId: formData.get('templateId') as string || undefined,
  };

  const result = await createExportJobAction(jobData);

  if (result.success && result.data) {
    revalidatePath('/export', 'page');
  }

  return result;
}

// ==========================================
// EXPORT TEMPLATE FORM HANDLING
// ==========================================

/**
 * Create export template from form data
 * Form-friendly wrapper for createExportTemplateAction
 */
export async function createExportTemplateFromForm(formData: FormData): Promise<ActionResult<ExportTemplate>> {
  const defaultColumnsRaw = formData.get('defaultColumns') as string;
  const defaultColumns = defaultColumnsRaw
    ? defaultColumnsRaw.split(',').map(col => col.trim()).filter(Boolean)
    : undefined;

  const defaultFiltersRaw = formData.get('defaultFilters') as string;
  const defaultFilters = defaultFiltersRaw
    ? JSON.parse(defaultFiltersRaw)
    : undefined;

  const templateData: CreateExportTemplateData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as ExportJob['type'],
    format: formData.get('format') as ExportJob['format'],
    defaultFilters,
    defaultColumns,
    isActive: formData.get('isActive') === 'true',
  };

  const result = await createExportTemplateAction(templateData);

  if (result.success && result.data) {
    revalidatePath('/export/templates', 'page');
  }

  return result;
}
