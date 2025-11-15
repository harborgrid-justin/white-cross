/**
 * @fileoverview Form Builder CRUD Operations
 * @module lib/actions/forms.crud
 *
 * Core CRUD operations for forms with HIPAA compliance.
 * Includes PHI detection, audit logging, and cache management.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TTL } from '@/lib/cache/constants';
import type {
  ActionResult,
  FormDefinition,
  CreateFormData,
  UpdateFormData
} from './forms.types';
import { FORMS_CACHE_TAGS, getForm } from './forms.cache';

// ==========================================
// FORM CRUD OPERATIONS
// ==========================================

/**
 * Create form action
 * Includes HIPAA audit logging and cache invalidation
 */
export async function createFormAction(data: CreateFormData): Promise<ActionResult<FormDefinition>> {
  try {
    // Validate required fields
    if (!data.name || !data.category || !data.fields || data.fields.length === 0) {
      return {
        success: false,
        error: 'Missing required fields: name, category, and at least one field'
      };
    }

    // Validate each field
    for (const field of data.fields) {
      if (!field.name || !field.type || !field.label) {
        return {
          success: false,
          error: 'Invalid field configuration: name, type, and label are required'
        };
      }
    }

    // Detect PHI fields
    const phiFields = data.fields.filter(field =>
      field.isPHI ||
      field.type === 'ssn' ||
      field.type === 'medical' ||
      field.name.toLowerCase().includes('ssn') ||
      field.name.toLowerCase().includes('medical') ||
      field.name.toLowerCase().includes('health')
    );

    const isPHI = phiFields.length > 0;

    const formData = {
      ...data,
      status: 'DRAFT',
      metadata: {
        isPHI,
        version: 1,
        totalSubmissions: 0
      }
    };

    const response = await serverPost<{ success: boolean; data: FormDefinition; message?: string }>(
      API_ENDPOINTS.FORMS.BASE,
      formData,
      {
        cache: 'no-store',
        next: { tags: [FORMS_CACHE_TAGS.FORMS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create form');
    }

    // HIPAA AUDIT LOG - Form creation
    await auditLog({
      action: isPHI ? AUDIT_ACTIONS.CREATE_PHI_RECORD : AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Form',
      resourceId: response.data.id,
      details: `Created form "${data.name}" with ${data.fields.length} fields${isPHI ? ' (contains PHI)' : ''}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(FORMS_CACHE_TAGS.FORMS, 'default');
    revalidateTag('forms-list', 'default');
    revalidatePath('/forms', 'page');
    revalidatePath('/forms/builder', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Form created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create form';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Form',
      details: `Failed to create form "${data.name}": ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update form action
 * Includes HIPAA audit logging and cache invalidation
 */
export async function updateFormAction(
  formId: string,
  data: UpdateFormData
): Promise<ActionResult<FormDefinition>> {
  try {
    if (!formId) {
      return {
        success: false,
        error: 'Form ID is required'
      };
    }

    // Get existing form to check for PHI changes
    const existingForm = await getForm(formId);
    if (!existingForm) {
      return {
        success: false,
        error: 'Form not found'
      };
    }

    let updateData = { ...data };

    // If fields are being updated, re-evaluate PHI status
    if (data.fields) {
      const phiFields = data.fields.filter(field =>
        field.isPHI ||
        field.type === 'ssn' ||
        field.type === 'medical' ||
        field.name.toLowerCase().includes('ssn') ||
        field.name.toLowerCase().includes('medical') ||
        field.name.toLowerCase().includes('health')
      );

      const isPHI = phiFields.length > 0;

      updateData = {
        ...updateData,
        metadata: {
          ...existingForm.metadata,
          isPHI,
          version: existingForm.metadata.version + 1
        }
      };
    }

    const response = await serverPut<{ success: boolean; data: FormDefinition; message?: string }>(
      API_ENDPOINTS.FORMS.BY_ID(formId),
      updateData,
      {
        cache: 'no-store',
        next: { tags: [FORMS_CACHE_TAGS.FORMS, `form-${formId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update form');
    }

    // HIPAA AUDIT LOG - Form modification
    await auditLog({
      action: response.data.metadata.isPHI ? AUDIT_ACTIONS.UPDATE_DOCUMENT : AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Form',
      resourceId: formId,
      details: `Updated form "${existingForm.name}"${response.data.metadata.isPHI ? ' (contains PHI)' : ''}`,
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(FORMS_CACHE_TAGS.FORMS, 'default');
    revalidateTag(`form-${formId}`, 'default');
    revalidateTag('forms-list', 'default');
    revalidatePath('/forms', 'page');
    revalidatePath(`/forms/${formId}`, 'page');
    revalidatePath(`/forms/${formId}/edit`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Form updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update form';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Form',
      resourceId: formId,
      details: `Failed to update form: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Delete form action (soft delete)
 * Includes HIPAA audit logging and cache invalidation
 */
export async function deleteFormAction(formId: string, force: boolean = false): Promise<ActionResult<void>> {
  try {
    if (!formId) {
      return {
        success: false,
        error: 'Form ID is required'
      };
    }

    // Get form details for audit logging
    const form = await getForm(formId);
    if (!form) {
      return {
        success: false,
        error: 'Form not found'
      };
    }

    // Check if form has responses and force flag
    if (!force && form.metadata.totalSubmissions > 0) {
      return {
        success: false,
        error: `Cannot delete form with ${form.metadata.totalSubmissions} submission(s). Use force delete or archive instead.`,
        validationErrors: { submissions: [form.metadata.totalSubmissions.toString()] }
      };
    }

    const endpoint = API_ENDPOINTS.FORMS.BY_ID(formId);
    const queryParam = force ? '?force=true' : '';

    await serverDelete<{ success: boolean; message?: string }>(
      `${endpoint}${queryParam}`,
      {
        cache: 'no-store',
        next: { tags: [FORMS_CACHE_TAGS.FORMS, `form-${formId}`] }
      }
    );

    // HIPAA AUDIT LOG - Form deletion
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Form',
      resourceId: formId,
      details: `${force ? 'Force deleted' : 'Deleted'} form "${form.name}"${form.metadata.isPHI ? ' (contained PHI)' : ''}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(FORMS_CACHE_TAGS.FORMS, 'default');
    revalidateTag(`form-${formId}`, 'default');
    revalidateTag('forms-list', 'default');
    revalidatePath('/forms', 'page');

    return {
      success: true,
      message: `Form ${force ? 'permanently deleted' : 'deleted'} successfully`
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete form';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Form',
      resourceId: formId,
      details: `Failed to delete form: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Get form action with caching
 */
export async function getFormAction(formId: string): Promise<ActionResult<FormDefinition>> {
  try {
    if (!formId) {
      return {
        success: false,
        error: 'Form ID is required'
      };
    }

    const response = await serverGet<{ success: boolean; data: FormDefinition; message?: string }>(
      API_ENDPOINTS.FORMS.BY_ID(formId),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [`form-${formId}`, FORMS_CACHE_TAGS.FORMS]
        }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get form');
    }

    // HIPAA AUDIT LOG - Log form access (only if contains PHI)
    if (response.data.metadata.isPHI) {
      await auditLog({
        action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
        resource: 'Form',
        resourceId: formId,
        details: `Accessed PHI form "${response.data.name}"`,
        success: true
      });
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to get form';

    return {
      success: false,
      error: errorMessage
    };
  }
}
