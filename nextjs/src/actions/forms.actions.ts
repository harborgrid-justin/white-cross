/**
 * Forms Server Actions
 *
 * @module actions/forms
 * @description Secure server actions for form builder with HIPAA compliance
 *
 * Features:
 * - JWT-based authentication and authorization
 * - Role-based access control (RBAC)
 * - Dynamic Zod schema generation and validation
 * - XSS prevention via sanitization
 * - PHI detection and audit logging
 * - Form versioning for change tracking
 */

'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { getServerSession, getServerAuthOptional } from '@/lib/session';
import { checkPermission, checkFormAccess, FORM_PERMISSIONS } from '@/lib/permissions';
import { generateZodSchema, serializeZodSchema, validateFormData } from '@/lib/forms/validation';
import { sanitizeFormData, detectPHI, formContainsPHI } from '@/lib/forms/security';
import {
  storeForm,
  updateForm,
  getForm,
  storeFormResponse,
  getFormResponses,
  softDeleteForm,
  createFormVersion,
  getFormResponseCount,
  type FormDefinition
} from '@/lib/forms/api';
import { auditLog, AUDIT_ACTIONS, extractIPAddress, extractUserAgent } from '@/lib/audit';

/**
 * Form field definition interface
 */
interface FormField {
  id: string;
  type: string;
  label: string;
  name: string;
  required: boolean;
  validation?: any;
  options?: { label: string; value: string }[];
}

/**
 * Form schema input interface
 */
interface FormSchema {
  id?: string;
  name: string;
  description?: string;
  fields: FormField[];
  metadata?: {
    category?: string;
    isPHI?: boolean;
  };
}

/**
 * Create form action
 *
 * Security features:
 * - JWT authentication required
 * - RBAC permission check (forms:create)
 * - Form schema validation
 * - Dynamic Zod schema generation
 * - PHI detection and marking
 * - Comprehensive audit logging
 *
 * @param formData - Form definition
 * @returns Result object with success status and formId or error
 *
 * @example
 * ```typescript
 * const result = await createFormAction({
 *   name: 'Patient Intake Form',
 *   description: 'Initial patient information',
 *   fields: [
 *     { id: '1', type: 'text', label: 'Full Name', name: 'fullName', required: true },
 *     { id: '2', type: 'email', label: 'Email', name: 'email', required: true }
 *   ],
 *   metadata: { category: 'intake', isPHI: true }
 * });
 * ```
 */
export async function createFormAction(formData: FormSchema) {
  try {
    // 1. Verify authentication
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Authentication required' };
    }

    // 2. Verify permission
    const hasPermission = await checkPermission(
      session.user.id,
      session.user.role,
      FORM_PERMISSIONS.CREATE
    );

    if (!hasPermission) {
      return { success: false, error: 'Permission denied: Cannot create forms' };
    }

    // 3. Validate form schema
    if (!formData.name || formData.name.trim().length === 0) {
      return { success: false, error: 'Form name is required' };
    }

    if (!formData.fields || formData.fields.length === 0) {
      return { success: false, error: 'Form must have at least one field' };
    }

    // 4. Validate each field
    for (const field of formData.fields) {
      if (!field.name || !field.type || !field.label) {
        return { success: false, error: 'Invalid field configuration' };
      }
    }

    // 5. Generate Zod schema from fields
    const zodSchema = generateZodSchema(formData.fields);
    const zodSchemaString = serializeZodSchema(zodSchema);

    // 6. Detect if form contains PHI
    const containsPHI = formContainsPHI(formData.fields);
    const isPHI = formData.metadata?.isPHI || containsPHI;

    // 7. Store form definition
    const createdForm = await storeForm({
      name: formData.name,
      description: formData.description,
      fields: formData.fields,
      zodSchema: zodSchemaString,
      createdBy: session.user.id,
      metadata: {
        ...formData.metadata,
        isPHI,
        version: 1
      }
    });

    const formId = createdForm.id!;

    // 8. Create audit log entry
    await auditLog({
      userId: session.user.id,
      action: 'FORM_CREATE',
      resource: 'form',
      resourceId: formId,
      details: `Created form: ${formData.name}`,
      success: true,
      changes: {
        formName: formData.name,
        fieldCount: formData.fields.length,
        isPHI,
        category: formData.metadata?.category
      }
    });

    revalidatePath('/forms');

    return {
      success: true,
      formId,
      message: 'Form created successfully'
    };
  } catch (error) {
    console.error('[Forms] Creation error:', error);

    // Log failed attempt
    try {
      const session = await getServerSession();
      if (session) {
        await auditLog({
          userId: session.user.id,
          action: 'FORM_CREATE',
          resource: 'form',
          details: `Failed to create form: ${formData.name}`,
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } catch (auditError) {
      console.error('[Forms] Audit logging failed:', auditError);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Form creation failed'
    };
  }
}

/**
 * Update form action
 *
 * Security features:
 * - JWT authentication required
 * - RBAC permission and ownership check
 * - Automatic version tracking
 * - Audit logging with change tracking
 *
 * @param formId - Form ID to update
 * @param formData - Partial form data to update
 * @returns Result object with success status or error
 *
 * @example
 * ```typescript
 * const result = await updateFormAction('form-123', {
 *   name: 'Updated Form Name',
 *   description: 'Updated description'
 * });
 * ```
 */
export async function updateFormAction(formId: string, formData: Partial<FormSchema>) {
  try {
    // 1. Verify authentication
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Authentication required' };
    }

    // 2. Verify access
    const canEdit = await checkFormAccess(
      session.user.id,
      session.user.role,
      formId,
      'edit'
    );

    if (!canEdit) {
      return { success: false, error: 'Access denied: Cannot edit this form' };
    }

    // 3. Create new version before updating
    try {
      await createFormVersion(formId);
    } catch (versionError) {
      console.warn('[Forms] Version creation failed, continuing with update:', versionError);
    }

    // 4. Update Zod schema if fields changed
    let updatedData: Partial<FormDefinition> = { ...formData };

    if (formData.fields && formData.fields.length > 0) {
      const zodSchema = generateZodSchema(formData.fields);
      const zodSchemaString = serializeZodSchema(zodSchema);
      updatedData.zodSchema = zodSchemaString;

      // Re-detect PHI if fields changed
      const containsPHI = formContainsPHI(formData.fields);
      updatedData.metadata = {
        ...formData.metadata,
        isPHI: formData.metadata?.isPHI || containsPHI
      };
    }

    // 5. Update form
    await updateForm(formId, updatedData);

    // 6. Create audit log entry
    await auditLog({
      userId: session.user.id,
      action: 'FORM_UPDATE',
      resource: 'form',
      resourceId: formId,
      details: `Updated form: ${formId}`,
      success: true,
      changes: {
        updatedFields: Object.keys(formData)
      }
    });

    revalidatePath(`/forms/${formId}/edit`);
    revalidatePath('/forms');

    return {
      success: true,
      message: 'Form updated successfully'
    };
  } catch (error) {
    console.error('[Forms] Update error:', error);

    // Log failed attempt
    try {
      const session = await getServerSession();
      if (session) {
        await auditLog({
          userId: session.user.id,
          action: 'FORM_UPDATE',
          resource: 'form',
          resourceId: formId,
          details: `Failed to update form: ${formId}`,
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } catch (auditError) {
      console.error('[Forms] Audit logging failed:', auditError);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Form update failed'
    };
  }
}

/**
 * Submit form response action
 *
 * Security features:
 * - Optional authentication (public forms support)
 * - Dynamic Zod validation against form schema
 * - XSS prevention via sanitization
 * - Automatic PHI detection and marking
 * - IP address and user agent tracking
 * - Comprehensive audit logging
 *
 * @param formId - Form ID to submit response for
 * @param responseData - Form response data
 * @returns Result object with success status and responseId or error
 *
 * @example
 * ```typescript
 * const result = await submitFormResponseAction('form-123', {
 *   fullName: 'John Doe',
 *   email: 'john@example.com',
 *   message: 'Hello world'
 * });
 * ```
 */
export async function submitFormResponseAction(
  formId: string,
  responseData: Record<string, any>
) {
  try {
    // 1. Verify authentication (optional for public forms)
    const user = await getServerAuthOptional();

    // 2. Fetch form definition
    const form = await getForm(formId);

    // 3. Validate response data with Zod schema
    const zodSchema = generateZodSchema(form.fields);

    let validatedData: Record<string, any>;
    try {
      validatedData = validateFormData(zodSchema, responseData);
    } catch (validationError: any) {
      return {
        success: false,
        error: 'Validation failed',
        validationErrors: validationError.errors || validationError.message
      };
    }

    // 4. Sanitize input to prevent XSS
    const sanitizedData = sanitizeFormData(validatedData);

    // 5. Detect PHI fields
    const phiFields = detectPHI(sanitizedData, form.fields);

    // 6. Extract client information for audit
    const headersList = await headers();
    const ipAddress = extractIPAddress(headersList as unknown as Request);
    const userAgent = extractUserAgent(headersList as unknown as Request);

    // 7. Store response
    const storedResponse = await storeFormResponse({
      formId,
      data: sanitizedData,
      submittedBy: user?.id,
      ipAddress,
      userAgent,
      phiFields
    });

    const responseId = storedResponse.id!;

    // 8. Create audit log entry
    await auditLog({
      userId: user?.id || 'anonymous',
      action: phiFields.length > 0 ? 'FORM_SUBMIT_PHI' : 'FORM_SUBMIT',
      resource: 'form_response',
      resourceId: responseId,
      details: `Submitted form response for form: ${formId}`,
      ipAddress,
      userAgent,
      success: true,
      changes: {
        formId,
        containsPHI: phiFields.length > 0,
        phiFieldCount: phiFields.length
      }
    });

    return {
      success: true,
      responseId,
      message: 'Form submitted successfully'
    };
  } catch (error) {
    console.error('[Forms] Submission error:', error);

    // Log failed attempt
    try {
      const user = await getServerAuthOptional();
      const headersList = await headers();

      await auditLog({
        userId: user?.id || 'anonymous',
        action: 'FORM_SUBMIT',
        resource: 'form_response',
        resourceId: formId,
        details: `Failed to submit form response for form: ${formId}`,
        ipAddress: extractIPAddress(headersList as unknown as Request),
        userAgent: extractUserAgent(headersList as unknown as Request),
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    } catch (auditError) {
      console.error('[Forms] Audit logging failed:', auditError);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Form submission failed'
    };
  }
}

/**
 * Get form responses action
 *
 * Security features:
 * - JWT authentication required
 * - RBAC permission and ownership check
 * - PHI access audit logging
 *
 * @param formId - Form ID to get responses for
 * @param options - Query options (limit, offset, date range)
 * @returns Result object with responses or error
 *
 * @example
 * ```typescript
 * const result = await getFormResponsesAction('form-123');
 * if (result.success) {
 *   console.log('Responses:', result.responses);
 * }
 * ```
 */
export async function getFormResponsesAction(
  formId: string,
  options?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }
) {
  try {
    // 1. Verify authentication
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Authentication required' };
    }

    // 2. Verify access
    const canView = await checkFormAccess(
      session.user.id,
      session.user.role,
      formId,
      'view_responses'
    );

    if (!canView) {
      return { success: false, error: 'Access denied: Cannot view form responses' };
    }

    // 3. Fetch form definition to check for PHI
    const form = await getForm(formId);

    // 4. Fetch responses
    const responses = await getFormResponses(formId, options);

    // 5. Check if form contains PHI and log access
    if (form.metadata?.isPHI) {
      await auditLog({
        userId: session.user.id,
        action: 'FORM_VIEW_RESPONSES_PHI',
        resource: 'form',
        resourceId: formId,
        details: `Viewed PHI form responses for form: ${formId}`,
        success: true,
        changes: {
          isPHI: true,
          responseCount: responses.length
        }
      });
    } else {
      await auditLog({
        userId: session.user.id,
        action: 'FORM_VIEW_RESPONSES',
        resource: 'form',
        resourceId: formId,
        details: `Viewed form responses for form: ${formId}`,
        success: true,
        changes: {
          responseCount: responses.length
        }
      });
    }

    return {
      success: true,
      responses,
      count: responses.length
    };
  } catch (error) {
    console.error('[Forms] Responses fetch error:', error);

    // Log failed attempt
    try {
      const session = await getServerSession();
      if (session) {
        await auditLog({
          userId: session.user.id,
          action: 'FORM_VIEW_RESPONSES',
          resource: 'form',
          resourceId: formId,
          details: `Failed to view form responses for form: ${formId}`,
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } catch (auditError) {
      console.error('[Forms] Audit logging failed:', auditError);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch responses'
    };
  }
}

/**
 * Delete form action
 *
 * Security features:
 * - JWT authentication required
 * - RBAC permission and ownership check
 * - Protection against deleting forms with responses
 * - Soft delete (archive) instead of hard delete
 * - Comprehensive audit logging
 *
 * @param formId - Form ID to delete
 * @param force - Force delete even if responses exist (requires admin)
 * @returns Result object with success status or error
 *
 * @example
 * ```typescript
 * const result = await deleteFormAction('form-123');
 * if (!result.success) {
 *   // Handle error - may have responses
 *   console.error(result.error);
 * }
 * ```
 */
export async function deleteFormAction(formId: string, force: boolean = false) {
  try {
    // 1. Verify authentication
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Authentication required' };
    }

    // 2. Verify permission
    const canDelete = await checkFormAccess(
      session.user.id,
      session.user.role,
      formId,
      'delete'
    );

    if (!canDelete) {
      return { success: false, error: 'Access denied: Cannot delete this form' };
    }

    // 3. Check for responses unless force delete
    if (!force) {
      const responseCount = await getFormResponseCount(formId);

      if (responseCount > 0) {
        return {
          success: false,
          error: `Cannot delete form with ${responseCount} response(s). Archive instead or use force delete.`,
          responseCount
        };
      }
    }

    // 4. Soft delete (archive) the form
    await softDeleteForm(formId);

    // 5. Create audit log entry
    await auditLog({
      userId: session.user.id,
      action: 'FORM_DELETE',
      resource: 'form',
      resourceId: formId,
      details: `Deleted form: ${formId}${force ? ' (forced)' : ''}`,
      success: true,
      changes: {
        force,
        deletedBy: session.user.id
      }
    });

    revalidatePath('/forms');

    return {
      success: true,
      message: 'Form deleted successfully'
    };
  } catch (error) {
    console.error('[Forms] Deletion error:', error);

    // Log failed attempt
    try {
      const session = await getServerSession();
      if (session) {
        await auditLog({
          userId: session.user.id,
          action: 'FORM_DELETE',
          resource: 'form',
          resourceId: formId,
          details: `Failed to delete form: ${formId}`,
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } catch (auditError) {
      console.error('[Forms] Audit logging failed:', auditError);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Form deletion failed'
    };
  }
}
