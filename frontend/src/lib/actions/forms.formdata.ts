/**
 * @fileoverview Form FormData Handlers
 * @module lib/actions/forms.formdata
 *
 * FormData wrapper functions for form operations.
 * Provides form-friendly interfaces for form actions.
 */

'use server';

import { redirect } from 'next/navigation';
import type {
  ActionResult,
  FormDefinition,
  FormResponse,
  CreateFormData,
  UpdateFormData,
  CreateFormResponseData,
  FormField
} from './forms.types';
import { createFormAction, updateFormAction } from './forms.crud';
import { submitFormResponseAction } from './forms.responses';
import { getForm } from './forms.cache';

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create form from form data
 * Form-friendly wrapper for createFormAction
 */
export async function createFormFromForm(formData: FormData): Promise<ActionResult<FormDefinition>> {
  const fieldsJson = formData.get('fields') as string;
  const settingsJson = formData.get('settings') as string;

  let fields: FormField[];
  let settings: CreateFormData['settings'];

  try {
    fields = JSON.parse(fieldsJson);
    settings = JSON.parse(settingsJson);
  } catch (error) {
    return {
      success: false,
      error: 'Invalid fields or settings JSON'
    };
  }

  const createData: CreateFormData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || undefined,
    category: formData.get('category') as string,
    fields,
    settings
  };

  const result = await createFormAction(createData);

  if (result.success && result.data) {
    redirect(`/forms/${result.data.id}`);
  }

  return result;
}

/**
 * Update form from form data
 * Form-friendly wrapper for updateFormAction
 */
export async function updateFormFromForm(
  formId: string,
  formData: FormData
): Promise<ActionResult<FormDefinition>> {
  const fieldsJson = formData.get('fields') as string;
  const settingsJson = formData.get('settings') as string;

  let fields: FormField[] | undefined;
  let settings: UpdateFormData['settings'] | undefined;

  try {
    if (fieldsJson) fields = JSON.parse(fieldsJson);
    if (settingsJson) settings = JSON.parse(settingsJson);
  } catch (error) {
    return {
      success: false,
      error: 'Invalid fields or settings JSON'
    };
  }

  const updateData: UpdateFormData = {
    name: formData.get('name') as string || undefined,
    description: formData.get('description') as string || undefined,
    category: formData.get('category') as string || undefined,
    status: formData.get('status') as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' || undefined,
    fields,
    settings
  };

  // Filter out undefined values
  const filteredData = Object.entries(updateData).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof UpdateFormData] = value;
    }
    return acc;
  }, {} as UpdateFormData);

  const result = await updateFormAction(formId, filteredData);

  if (result.success && result.data) {
    redirect(`/forms/${result.data.id}`);
  }

  return result;
}

/**
 * Submit form response from form data
 * Form-friendly wrapper for submitFormResponseAction
 */
export async function submitFormResponseFromForm(formData: FormData): Promise<ActionResult<FormResponse>> {
  const formId = formData.get('formId') as string;
  const dataJson = formData.get('data') as string;

  let responseData: Record<string, unknown>;

  try {
    responseData = JSON.parse(dataJson);
  } catch (error) {
    // Fallback: extract form data manually
    responseData = {};
    Array.from(formData.entries()).forEach(([key, value]) => {
      if (key !== 'formId' && key !== 'data') {
        responseData[key] = value;
      }
    });
  }

  const submitData: CreateFormResponseData = {
    formId,
    data: responseData,
    status: 'SUBMITTED',
    notes: formData.get('notes') as string || undefined
  };

  const result = await submitFormResponseAction(submitData);

  if (result.success && result.data) {
    // Get form to check for redirect URL
    const form = await getForm(formId);
    const redirectUrl = form?.settings.redirectUrl || `/forms/${formId}/success`;
    redirect(redirectUrl);
  }

  return result;
}
