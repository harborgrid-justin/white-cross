/**
 * @fileoverview Form Response Operations
 * @module lib/actions/forms.responses
 *
 * Form response submission and retrieval operations.
 * Includes validation, PHI detection, and audit logging.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverGet, serverPost, NextApiClientError } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';
import { generateId } from '@/utils/generators';
import type {
  ActionResult,
  FormResponse,
  CreateFormResponseData
} from './forms.types';
import { FORMS_CACHE_TAGS, getForm } from './forms.cache';

// ==========================================
// FORM RESPONSE OPERATIONS
// ==========================================

/**
 * Submit form response action
 * Includes HIPAA audit logging and PHI detection
 */
export async function submitFormResponseAction(data: CreateFormResponseData): Promise<ActionResult<FormResponse>> {
  try {
    // Validate required fields
    if (!data.formId || !data.data) {
      return {
        success: false,
        error: 'Missing required fields: formId and data'
      };
    }

    // Get form definition to validate response
    const form = await getForm(data.formId);
    if (!form) {
      return {
        success: false,
        error: 'Form not found'
      };
    }

    // Check if form is published and accepting responses
    if (form.status !== 'PUBLISHED') {
      return {
        success: false,
        error: 'Form is not published and accepting responses'
      };
    }

    // Check form expiration
    if (form.settings.expiresAt && new Date(form.settings.expiresAt) < new Date()) {
      return {
        success: false,
        error: 'Form has expired'
      };
    }

    // Check max submissions
    if (form.settings.maxSubmissions && form.metadata.totalSubmissions >= form.settings.maxSubmissions) {
      return {
        success: false,
        error: 'Form has reached maximum submissions'
      };
    }

    // Validate required fields
    const missingFields = form.fields
      .filter(field => field.required && !data.data[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      return {
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        validationErrors: missingFields.reduce((acc, field) => {
          acc[field] = ['This field is required'];
          return acc;
        }, {} as Record<string, string[]>)
      };
    }

    // Detect PHI fields in response
    const phiFields = form.fields
      .filter(field =>
        (field.isPHI || field.type === 'ssn' || field.type === 'medical') &&
        data.data[field.name]
      )
      .map(field => field.name);

    const responseData = {
      ...data,
      status: data.status || 'SUBMITTED',
      submissionId: generateId(),
      phiFields
    };

    const response = await serverPost<{ success: boolean; data: FormResponse; message?: string }>(
      API_ENDPOINTS.FORMS.RESPONSES(data.formId),
      responseData,
      {
        cache: 'no-store',
        next: { tags: [FORMS_CACHE_TAGS.FORM_RESPONSES, FORMS_CACHE_TAGS.FORMS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to submit form response');
    }

    // HIPAA AUDIT LOG - Response submission
    await auditLog({
      action: phiFields.length > 0 ? AUDIT_ACTIONS.CREATE_PHI_RECORD : AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'FormResponse',
      resourceId: response.data.id,
      details: `Submitted response to form "${form.name}"${phiFields.length > 0 ? ` (contains ${phiFields.length} PHI fields)` : ''}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(FORMS_CACHE_TAGS.FORM_RESPONSES, 'default');
    revalidateTag(FORMS_CACHE_TAGS.FORMS, 'default');
    revalidateTag(`form-${data.formId}`, 'default');
    revalidateTag(`form-responses-${data.formId}`, 'default');
    revalidatePath(`/forms/${data.formId}/responses`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Form response submitted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to submit form response';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'FormResponse',
      details: `Failed to submit form response: ${errorMessage}`,
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
 * Get form responses action
 * Includes HIPAA audit logging for PHI access
 */
export async function getFormResponsesAction(
  formId: string,
  filters?: Record<string, unknown>
): Promise<ActionResult<FormResponse[]>> {
  try {
    if (!formId) {
      return {
        success: false,
        error: 'Form ID is required'
      };
    }

    const response = await serverGet<{ success: boolean; data: FormResponse[]; message?: string }>(
      API_ENDPOINTS.FORMS.RESPONSES(formId),
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`form-responses-${formId}`, FORMS_CACHE_TAGS.FORM_RESPONSES, CACHE_TAGS.PHI]
        }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get form responses');
    }

    // Check if any responses contain PHI
    const phiResponsesCount = response.data.filter((r: FormResponse) => r.phiFields.length > 0).length;

    // HIPAA AUDIT LOG - PHI access logging
    if (phiResponsesCount > 0) {
      await auditLog({
        action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
        resource: 'FormResponse',
        resourceId: formId,
        details: `Accessed ${response.data.length} form responses (${phiResponsesCount} contain PHI)`,
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
      : 'Failed to get form responses';

    return {
      success: false,
      error: errorMessage
    };
  }
}
