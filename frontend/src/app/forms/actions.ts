/**
 * @fileoverview Form Builder Server Actions - Next.js v14+ Compatible
 * @module app/forms/actions
 *
 * HIPAA-compliant server actions for form builder with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all form operations  
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 * - Dynamic form building with schema validation
 * - PHI detection and compliance logging
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName } from '@/utils/formatters';

// ==========================================
// CONFIGURATION
// ==========================================

// Custom cache tags for forms
export const FORMS_CACHE_TAGS = {
  FORMS: 'forms',
  FORM_RESPONSES: 'form-responses',
  FORM_TEMPLATES: 'form-templates',
  FORM_BUILDER: 'form-builder',
  FORM_ANALYTICS: 'form-analytics',
} as const;

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'signature' | 'ssn' | 'medical';
  label: string;
  name: string;
  required: boolean;
  placeholder?: string;
  description?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: { label: string; value: string }[];
  isPHI?: boolean;
  order: number;
}

export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  fields: FormField[];
  settings: {
    allowAnonymous: boolean;
    requireSignature: boolean;
    enableSaveProgress: boolean;
    maxSubmissions?: number;
    expiresAt?: string;
    notificationEmail?: string;
    redirectUrl?: string;
  };
  metadata: {
    isPHI: boolean;
    version: number;
    totalSubmissions: number;
    lastSubmissionAt?: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormData {
  name: string;
  description?: string;
  category: string;
  fields: FormField[];
  settings: {
    allowAnonymous: boolean;
    requireSignature: boolean;
    enableSaveProgress: boolean;
    maxSubmissions?: number;
    expiresAt?: string;
    notificationEmail?: string;
    redirectUrl?: string;
  };
}

export interface UpdateFormData {
  name?: string;
  description?: string;
  category?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  fields?: FormField[];
  settings?: {
    allowAnonymous?: boolean;
    requireSignature?: boolean;
    enableSaveProgress?: boolean;
    maxSubmissions?: number;
    expiresAt?: string;
    notificationEmail?: string;
    redirectUrl?: string;
  };
  metadata?: {
    isPHI?: boolean;
    version?: number;
    totalSubmissions?: number;
    lastSubmissionAt?: string;
  };
}

export interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  submittedBy?: string;
  submissionId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED' | 'REJECTED';
  phiFields: string[];
  ipAddress: string;
  userAgent: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface CreateFormResponseData {
  formId: string;
  data: Record<string, unknown>;
  status?: 'DRAFT' | 'SUBMITTED';
  notes?: string;
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get form by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getForm = cache(async (id: string): Promise<FormDefinition | null> => {
  try {
    const response = await serverGet<ApiResponse<FormDefinition>>(
      API_ENDPOINTS.FORMS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [`form-${id}`, FORMS_CACHE_TAGS.FORMS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get form:', error);
    return null;
  }
});

/**
 * Get all forms with caching
 * Uses shorter TTL for frequently updated data
 */
export const getForms = cache(async (filters?: Record<string, unknown>): Promise<FormDefinition[]> => {
  try {
    const response = await serverGet<ApiResponse<FormDefinition[]>>(
      API_ENDPOINTS.FORMS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [FORMS_CACHE_TAGS.FORMS, 'forms-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get forms:', error);
    return [];
  }
});

// ==========================================
// FORM OPERATIONS
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

    const response = await serverPost<ApiResponse<FormDefinition>>(
      API_ENDPOINTS.FORMS.BASE,
      formData,
      {
        cache: 'no-store',
        next: { tags: [FORMS_CACHE_TAGS.FORMS, CACHE_TAGS.GENERAL] }
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
    revalidateTag(FORMS_CACHE_TAGS.FORMS);
    revalidateTag('forms-list');
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

    const response = await serverPut<ApiResponse<FormDefinition>>(
      API_ENDPOINTS.FORMS.BY_ID(formId),
      updateData,
      {
        cache: 'no-store',
        next: { tags: [FORMS_CACHE_TAGS.FORMS, `form-${formId}`, CACHE_TAGS.GENERAL] }
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
      changes: data,
      success: true
    });

    // Cache invalidation
    revalidateTag(FORMS_CACHE_TAGS.FORMS);
    revalidateTag(`form-${formId}`);
    revalidateTag('forms-list');
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
        validationErrors: { submissions: form.metadata.totalSubmissions.toString() }
      };
    }

    const endpoint = force 
      ? API_ENDPOINTS.FORMS.FORCE_DELETE(formId)
      : API_ENDPOINTS.FORMS.BY_ID(formId);

    await serverDelete<ApiResponse<void>>(
      endpoint,
      {
        cache: 'no-store',
        next: { tags: [FORMS_CACHE_TAGS.FORMS, `form-${formId}`, CACHE_TAGS.GENERAL] }
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
    revalidateTag(FORMS_CACHE_TAGS.FORMS);
    revalidateTag(`form-${formId}`);
    revalidateTag('forms-list');
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

    const response = await serverGet<ApiResponse<FormDefinition>>(
      API_ENDPOINTS.FORMS.BY_ID(formId),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STANDARD,
          tags: [`form-${formId}`, FORMS_CACHE_TAGS.FORMS, CACHE_TAGS.GENERAL] 
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

    const response = await serverPost<ApiResponse<FormResponse>>(
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
    revalidateTag(FORMS_CACHE_TAGS.FORM_RESPONSES);
    revalidateTag(FORMS_CACHE_TAGS.FORMS);
    revalidateTag(`form-${data.formId}`);
    revalidateTag(`form-responses-${data.formId}`);
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

    const response = await serverGet<ApiResponse<FormResponse[]>>(
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
    const phiResponsesCount = response.data.filter(r => r.phiFields.length > 0).length;

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
    for (const [key, value] of formData.entries()) {
      if (key !== 'formId' && key !== 'data') {
        responseData[key] = value;
      }
    }
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

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if form exists
 */
export async function formExists(formId: string): Promise<boolean> {
  const form = await getForm(formId);
  return form !== null;
}

/**
 * Get form count
 */
export async function getFormCount(filters?: Record<string, unknown>): Promise<number> {
  try {
    const forms = await getForms(filters);
    return forms.length;
  } catch {
    return 0;
  }
}

/**
 * Get form statistics for dashboard
 */
export const getFormStats = cache(async (): Promise<{
  totalForms: number;
  activeForms: number;
  publishedForms: number;
  draftForms: number;
  archivedForms: number;
  totalResponses: number;
  recentResponses: number;
  averageCompletionRate: number;
}> => {
  try {
    const forms = await getForms();
    
    const stats = {
      totalForms: forms.length,
      activeForms: forms.filter(f => f.status === 'PUBLISHED').length, // Published forms are active
      publishedForms: forms.filter(f => f.status === 'PUBLISHED').length,
      draftForms: forms.filter(f => f.status === 'DRAFT').length,
      archivedForms: forms.filter(f => f.status === 'ARCHIVED').length,
      totalResponses: 0,
      recentResponses: 0,
      averageCompletionRate: 0
    };

    // Calculate response statistics across all forms
    let totalSubmissions = 0;
    let totalCompletions = 0;
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    for (const form of forms) {
      try {
        // Get responses for this form
        const responsesResult = await getFormResponsesAction(form.id, {});
        if (responsesResult.success && responsesResult.data) {
          const responses = responsesResult.data;
          totalSubmissions += responses.length;
          
          // Count completed responses (submitted, reviewed, or approved)
          const completedResponses = responses.filter(r => 
            r.status === 'SUBMITTED' || r.status === 'REVIEWED' || r.status === 'APPROVED'
          );
          totalCompletions += completedResponses.length;
          
          // Count recent responses
          const recentResponses = responses.filter(r => 
            new Date(r.submittedAt) >= lastWeek
          );
          stats.recentResponses += recentResponses.length;
        }
      } catch (error) {
        console.warn(`Failed to get responses for form ${form.id}:`, error);
      }
    }

    stats.totalResponses = totalSubmissions;
    stats.averageCompletionRate = totalSubmissions > 0 
      ? Math.round((totalCompletions / totalSubmissions) * 100) 
      : 0;

    return stats;
  } catch (error) {
    console.error('Failed to get form stats:', error);
    return {
      totalForms: 0,
      activeForms: 0,
      publishedForms: 0,
      draftForms: 0,
      archivedForms: 0,
      totalResponses: 0,
      recentResponses: 0,
      averageCompletionRate: 0
    };
  }
});

/**
 * Get forms dashboard data with recent activity
 */
export const getFormsDashboardData = cache(async (): Promise<{
  recentForms: FormDefinition[];
  popularForms: FormDefinition[];
  formsByStatus: { status: string; count: number; forms: FormDefinition[] }[];
  formsByType: { type: string; count: number; forms: FormDefinition[] }[];
}> => {
  try {
    const forms = await getForms();
    
    // Sort by most recently created/updated
    const recentForms = [...forms]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
      .slice(0, 5);

    // Sort by number of fields (as proxy for complexity/popularity)
    const popularForms = [...forms]
      .sort((a, b) => (b.fields?.length || 0) - (a.fields?.length || 0))
      .slice(0, 5);

    // Group by status
    const statusGroups = new Map<string, FormDefinition[]>();
    forms.forEach(form => {
      const status = form.status || 'DRAFT';
      if (!statusGroups.has(status)) {
        statusGroups.set(status, []);
      }
      statusGroups.get(status)!.push(form);
    });

    const formsByStatus = Array.from(statusGroups.entries()).map(([status, forms]) => ({
      status,
      count: forms.length,
      forms: forms.slice(0, 3) // Limit to top 3 per status
    }));

    // Group by category/type (based on form name or tags)
    const typeGroups = new Map<string, FormDefinition[]>();
    forms.forEach(form => {
      // Determine type from name or description
      let type = 'General';
      const name = (form.name || '').toLowerCase();
      const description = (form.description || '').toLowerCase();
      
      if (name.includes('medical') || name.includes('health') || description.includes('medical')) {
        type = 'Medical';
      } else if (name.includes('emergency') || name.includes('contact') || description.includes('emergency')) {
        type = 'Emergency';
      } else if (name.includes('enrollment') || name.includes('registration') || description.includes('enrollment')) {
        type = 'Enrollment';
      } else if (name.includes('incident') || name.includes('report') || description.includes('incident')) {
        type = 'Incident';
      }
      
      if (!typeGroups.has(type)) {
        typeGroups.set(type, []);
      }
      typeGroups.get(type)!.push(form);
    });

    const formsByType = Array.from(typeGroups.entries()).map(([type, forms]) => ({
      type,
      count: forms.length,
      forms: forms.slice(0, 3) // Limit to top 3 per type
    }));

    return {
      recentForms,
      popularForms,
      formsByStatus,
      formsByType
    };
  } catch (error) {
    console.error('Failed to get forms dashboard data:', error);
    return {
      recentForms: [],
      popularForms: [],
      formsByStatus: [],
      formsByType: []
    };
  }
});

/**
 * Clear form cache
 */
export async function clearFormCache(formId?: string): Promise<void> {
  if (formId) {
    revalidateTag(`form-${formId}`);
    revalidateTag(`form-responses-${formId}`);
  }
  revalidateTag(FORMS_CACHE_TAGS.FORMS);
  revalidateTag(FORMS_CACHE_TAGS.FORM_RESPONSES);
  revalidateTag('forms-list');
  revalidatePath('/forms', 'page');
}

/**
 * Publish form action
 */
export async function publishFormAction(formId: string): Promise<ActionResult<FormDefinition>> {
  return updateFormAction(formId, { status: 'PUBLISHED' });
}

/**
 * Archive form action
 */
export async function archiveFormAction(formId: string): Promise<ActionResult<FormDefinition>> {
  return updateFormAction(formId, { status: 'ARCHIVED' });
}
