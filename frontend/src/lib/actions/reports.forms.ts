/**
 * @fileoverview Report Form Handling
 * @module lib/actions/reports/forms
 *
 * Form data handling operations for report creation and updates.
 * Converts FormData to typed report data structures.
 */

'use server';

import { revalidatePath } from 'next/cache';

// Import CRUD operations
import { createReportAction } from './reports.crud';

// Types
import type { ActionResult, Report, CreateReportData } from './reports.types';

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create report from form data
 * Form-friendly wrapper for createReportAction
 */
export async function createReportFromForm(formData: FormData): Promise<ActionResult<Report>> {
  // Parse parameters from form data
  const parametersJson = formData.get('parameters') as string;
  let parameters: Record<string, unknown> = {};

  try {
    parameters = JSON.parse(parametersJson || '{}');
  } catch {
    // Ignore parameter parsing errors
  }

  // Parse filters from form data
  const filtersJson = formData.get('filters') as string;
  let filters: Record<string, unknown> = {};

  try {
    filters = JSON.parse(filtersJson || '{}');
  } catch {
    // Ignore filter parsing errors
  }

  // Parse recipients from form data
  const recipientsJson = formData.get('recipients') as string;
  let recipients: string[] = [];

  try {
    recipients = JSON.parse(recipientsJson || '[]');
  } catch {
    // Ignore recipient parsing errors
  }

  // Parse tags from form data
  const tagsJson = formData.get('tags') as string;
  let tags: string[] = [];

  try {
    tags = JSON.parse(tagsJson || '[]');
  } catch {
    // Ignore tag parsing errors
  }

  // Parse schedule from form data
  const scheduleJson = formData.get('schedule') as string;
  let schedule: Report['schedule'] | undefined;

  try {
    schedule = JSON.parse(scheduleJson || 'null');
  } catch {
    // Ignore schedule parsing errors
  }

  const reportData: CreateReportData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || undefined,
    templateId: formData.get('templateId') as string || undefined,
    type: formData.get('type') as Report['type'],
    category: (formData.get('category') as Report['category']) || 'operational',
    format: (formData.get('format') as Report['format']) || 'pdf',
    parameters: Object.keys(parameters).length > 0 ? parameters : undefined,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    recipients: recipients.length > 0 ? recipients : undefined,
    tags: tags.length > 0 ? tags : undefined,
    isScheduled: formData.get('isScheduled') === 'true',
    schedule,
    expiresAt: formData.get('expiresAt') as string || undefined,
  };

  const result = await createReportAction(reportData);

  if (result.success && result.data) {
    revalidatePath('/reports', 'page');
  }

  return result;
}
