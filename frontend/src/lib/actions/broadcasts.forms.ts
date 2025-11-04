/**
 * @fileoverview Broadcast Form Handling
 * @module lib/actions/broadcasts/forms
 *
 * Form data handling functions for broadcasts and templates.
 * Converts FormData to structured data objects and calls CRUD actions.
 */

'use server';

import { revalidatePath } from 'next/cache';

// Types
import type {
  Broadcast,
  BroadcastTemplate,
  CreateBroadcastData,
  CreateBroadcastTemplateData,
  ActionResult
} from './broadcasts.types';

// Import CRUD functions
import { createBroadcastAction } from './broadcasts.crud';
import { createBroadcastTemplateAction } from './broadcasts.templates';

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create broadcast from form data
 * Form-friendly wrapper for createBroadcastAction
 */
export async function createBroadcastFromForm(formData: FormData): Promise<ActionResult<Broadcast>> {
  const customRecipientsRaw = formData.get('customRecipients') as string;
  const customRecipients = customRecipientsRaw
    ? customRecipientsRaw.split(',').map(email => email.trim()).filter(Boolean)
    : undefined;

  const broadcastData: CreateBroadcastData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    type: formData.get('type') as Broadcast['type'],
    priority: (formData.get('priority') as Broadcast['priority']) || 'normal',
    targetAudience: formData.get('targetAudience') as Broadcast['targetAudience'],
    customRecipients,
    scheduledAt: formData.get('scheduledAt') as string || undefined,
    templateId: formData.get('templateId') as string || undefined,
  };

  const result = await createBroadcastAction(broadcastData);

  if (result.success && result.data) {
    revalidatePath('/broadcasts', 'page');
  }

  return result;
}

/**
 * Create broadcast template from form data
 * Form-friendly wrapper for createBroadcastTemplateAction
 */
export async function createBroadcastTemplateFromForm(formData: FormData): Promise<ActionResult<BroadcastTemplate>> {
  const variablesRaw = formData.get('variables') as string;
  const variables = variablesRaw
    ? variablesRaw.split(',').map(v => v.trim()).filter(Boolean)
    : undefined;

  const templateData: CreateBroadcastTemplateData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    subject: formData.get('subject') as string,
    content: formData.get('content') as string,
    type: formData.get('type') as Broadcast['type'],
    category: formData.get('category') as BroadcastTemplate['category'],
    variables,
    isActive: formData.get('isActive') === 'true',
  };

  const result = await createBroadcastTemplateAction(templateData);

  if (result.success && result.data) {
    revalidatePath('/broadcasts/templates', 'page');
  }

  return result;
}
