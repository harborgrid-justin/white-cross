'use server';
'use cache';

/**
 * Forms Server Actions - Next.js v16 App Router
 *
 * @module app/forms/actions
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

import { revalidatePath, revalidateTag } from 'next/cache';
import { headers, cookies } from 'next/headers';

// ============================================================================
// Configuration
// ============================================================================

const BACKEND_URL = process.env.BACKEND_URL || process.env.API_BASE_URL || 'http://localhost:3001';

// ============================================================================
// Types
// ============================================================================

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

interface FormField {
  id: string;
  type: string;
  label: string;
  name: string;
  required: boolean;
  validation?: Record<string, unknown>;
  options?: { label: string; value: string }[];
}

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

interface FormDefinition {
  id?: string;
  name: string;
  description?: string;
  fields: FormField[];
  zodSchema?: string;
  createdBy: string;
  metadata?: {
    category?: string;
    isPHI?: boolean;
    version?: number;
  };
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

// ============================================================================
// Form Management Actions
// ============================================================================

/**
 * Create form action
 * Cache: 10 minutes for created forms
 */
export async function createFormAction(formData: FormSchema): Promise<ActionResult<{ formId: string }>> {
  'use cache';
  // cacheLife({ revalidate: 600 }); // 10 minutes cache - Available in Next.js v16

  try {
    // Log HIPAA compliance audit entry
    await logHIPAAAuditEntry({
      action: 'FORM_CREATE_ATTEMPT',
      resourceType: 'FORM',
      details: {
        name: formData.name,
        fieldCount: formData.fields.length,
        isPHI: formData.metadata?.isPHI || false,
        category: formData.metadata?.category
      }
    });

    // 1. Verify authentication
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Authentication required' };
    }

    // 2. Verify permission
    const hasPermission = await checkPermission(
      session.user.id,
      session.user.role,
      'forms:create'
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

    // 7. Enhanced fetch to backend with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID(),
        'X-Source': 'form-actions'
      },
      body: JSON.stringify({
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
      }),
      next: {
        revalidate: 600,
        tags: ['forms', 'forms-list']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const createdForm = await response.json() as { id: string };
    const formId = createdForm.id;

    // Revalidate form caches
    revalidateTag('forms', 'forms');
    revalidateTag('forms-list', 'forms');
    revalidatePath('/forms');

    // Log successful creation
    await logHIPAAAuditEntry({
      action: 'FORM_CREATE',
      resourceType: 'FORM',
      resourceId: formId,
      details: {
        formName: formData.name,
        fieldCount: formData.fields.length,
        isPHI,
        category: formData.metadata?.category
      }
    });

    return {
      success: true,
      data: { formId },
      message: 'Form created successfully'
    };
  } catch (error) {
    console.error('[Forms] Creation error:', error);

    // Log failed attempt
    await logHIPAAAuditEntry({
      action: 'FORM_CREATE',
      resourceType: 'FORM',
      details: {
        formName: formData.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Form creation failed'
    };
  }
}

/**
 * Update form action
 * Cache: 10 minutes for updated forms
 */
export async function updateFormAction(
  formId: string, 
  formData: Partial<FormSchema>
): Promise<ActionResult<void>> {
  'use cache';
  // cacheLife({ revalidate: 600 }); // 10 minutes cache - Available in Next.js v16

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

    // 5. Enhanced fetch to backend with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/forms/${formId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      body: JSON.stringify(updatedData),
      next: {
        revalidate: 600,
        tags: ['forms', `form-${formId}`, 'forms-list']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Revalidate form caches
    revalidateTag('forms', 'forms');
    revalidateTag(`form-${formId}`, 'forms');
    revalidateTag('forms-list', 'forms');
    revalidatePath(`/forms/${formId}/edit`);
    revalidatePath('/forms');

    // Log successful update
    await logHIPAAAuditEntry({
      action: 'FORM_UPDATE',
      resourceType: 'FORM',
      resourceId: formId,
      details: {
        updatedFields: Object.keys(formData)
      }
    });

    return {
      success: true,
      message: 'Form updated successfully'
    };
  } catch (error) {
    console.error('[Forms] Update error:', error);

    // Log failed attempt
    await logHIPAAAuditEntry({
      action: 'FORM_UPDATE',
      resourceType: 'FORM',
      resourceId: formId,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Form update failed'
    };
  }
}

/**
 * Submit form response action
 * Cache: 5 minutes for form responses
 */
export async function submitFormResponseAction(
  formId: string,
  responseData: Record<string, unknown>
): Promise<ActionResult<{ responseId: string }>> {
  'use cache';
  // cacheLife({ revalidate: 300 }); // 5 minutes cache - Available in Next.js v16

  try {
    // 1. Verify authentication (optional for public forms)
    const user = await getServerAuthOptional();

    // 2. Fetch form definition
    const form = await getForm(formId);

    // 3. Validate response data with Zod schema
    const zodSchema = generateZodSchema(form.fields);

    let validatedData: Record<string, unknown>;
    try {
      validatedData = validateFormData(zodSchema, responseData);
    } catch (validationError: unknown) {
      return {
        success: false,
        error: 'Validation failed',
        validationErrors: validationError instanceof Error ? validationError.message : 'Validation error'
      };
    }

    // 4. Sanitize input to prevent XSS
    const sanitizedData = sanitizeFormData(validatedData);

    // 5. Detect PHI fields
    const phiFields = detectPHI(sanitizedData, form.fields);

    // 6. Extract client information for audit
    const requestContext = await getRequestContext();

    // 7. Enhanced fetch to backend with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/forms/${formId}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user ? `Bearer ${await getAuthToken()}` : '',
        'X-Request-ID': crypto.randomUUID(),
        'X-Client-IP': requestContext.ipAddress,
        'X-User-Agent': requestContext.userAgent
      },
      body: JSON.stringify({
        formId,
        data: sanitizedData,
        submittedBy: user?.id,
        ipAddress: requestContext.ipAddress,
        userAgent: requestContext.userAgent,
        phiFields
      }),
      next: {
        revalidate: 300,
        tags: ['forms', `form-${formId}`, 'form-responses']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const storedResponse = await response.json() as { id: string };
    const responseId = storedResponse.id;

    // Revalidate form response caches
    revalidateTag('form-responses', 'forms');
    revalidateTag(`form-${formId}`, 'forms');

    // Log form submission
    await logHIPAAAuditEntry({
      action: phiFields.length > 0 ? 'FORM_SUBMIT_PHI' : 'FORM_SUBMIT',
      resourceType: 'FORM_RESPONSE',
      resourceId: responseId,
      details: {
        formId,
        containsPHI: phiFields.length > 0,
        phiFieldCount: phiFields.length,
        submittedBy: user?.id || 'anonymous'
      }
    });

    return {
      success: true,
      data: { responseId },
      message: 'Form submitted successfully'
    };
  } catch (error) {
    console.error('[Forms] Submission error:', error);

    // Log failed attempt
    await logHIPAAAuditEntry({
      action: 'FORM_SUBMIT',
      resourceType: 'FORM_RESPONSE',
      resourceId: formId,
      details: {
        formId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Form submission failed'
    };
  }
}

/**
 * Get form responses action
 * Cache: 15 minutes for form responses
 */
export async function getFormResponsesAction(
  formId: string,
  options?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<ActionResult<{ responses: Record<string, unknown>[]; count: number }>> {
  'use cache';
  // cacheLife({ revalidate: 900 }); // 15 minutes cache - Available in Next.js v16

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

    // 3. Build query parameters
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', String(options.limit));
    if (options?.offset) params.append('offset', String(options.offset));
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);

    // 4. Enhanced fetch to backend with Next.js v16 capabilities
    const response = await fetch(`${BACKEND_URL}/forms/${formId}/responses?${params}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID()
      },
      next: {
        revalidate: 900,
        tags: ['forms', `form-${formId}`, 'form-responses']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responsesData = await response.json() as { responses: Record<string, unknown>[]; count: number };

    // 5. Check if form contains PHI and log access
    const form = await getForm(formId);
    if (form.metadata?.isPHI) {
      await logHIPAAAuditEntry({
        action: 'FORM_VIEW_RESPONSES_PHI',
        resourceType: 'FORM',
        resourceId: formId,
        details: {
          isPHI: true,
          responseCount: responsesData.responses.length
        }
      });
    } else {
      await logHIPAAAuditEntry({
        action: 'FORM_VIEW_RESPONSES',
        resourceType: 'FORM',
        resourceId: formId,
        details: {
          responseCount: responsesData.responses.length
        }
      });
    }

    return {
      success: true,
      data: responsesData
    };
  } catch (error) {
    console.error('[Forms] Responses fetch error:', error);

    // Log failed attempt
    await logHIPAAAuditEntry({
      action: 'FORM_VIEW_RESPONSES',
      resourceType: 'FORM',
      resourceId: formId,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch responses'
    };
  }
}

/**
 * Delete form action
 * No cache for deletion (always fresh)
 */
export async function deleteFormAction(formId: string, force: boolean = false): Promise<ActionResult<void>> {
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
          validationErrors: { responseCount: responseCount.toString() }
        };
      }
    }

    // 4. Enhanced fetch to backend for soft delete
    const response = await fetch(`${BACKEND_URL}/forms/${formId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'X-Request-ID': crypto.randomUUID(),
        'X-Force-Delete': force.toString()
      },
      next: {
        tags: ['forms', `form-${formId}`, 'forms-list']
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Soft delete local record
    await softDeleteForm(formId);

    // Revalidate form caches
    revalidateTag('forms', 'forms');
    revalidateTag(`form-${formId}`, 'forms');
    revalidateTag('forms-list', 'forms');
    revalidatePath('/forms');

    // Log form deletion
    await logHIPAAAuditEntry({
      action: 'FORM_DELETE',
      resourceType: 'FORM',
      resourceId: formId,
      details: {
        force,
        deletedBy: session.user.id
      }
    });

    return {
      success: true,
      message: 'Form deleted successfully'
    };
  } catch (error) {
    console.error('[Forms] Deletion error:', error);

    // Log failed attempt
    await logHIPAAAuditEntry({
      action: 'FORM_DELETE',
      resourceType: 'FORM',
      resourceId: formId,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Form deletion failed'
    };
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get authentication token from cookies
 */
async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
}

/**
 * Get server session (required)
 */
async function getServerSession(): Promise<{ user: { id: string; email: string; role: string } } | null> {
  try {
    const token = await getAuthToken();
    const payload = await verifyAccessToken(token);
    return {
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role
      }
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get optional server session (for public forms)
 */
async function getServerAuthOptional(): Promise<{ id: string; email: string; role: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    
    const payload = await verifyAccessToken(token);
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get request context for audit logging
 */
async function getRequestContext(): Promise<{ ipAddress: string; userAgent: string }> {
  const headersList = await headers();
  const mockRequest = createMockRequest(headersList);
  
  return {
    ipAddress: extractIPAddress(mockRequest) || '0.0.0.0',
    userAgent: extractUserAgent(mockRequest) || 'Unknown'
  };
}

/**
 * Create mock request from Next.js headers
 */
function createMockRequest(headersList: Headers): Request {
  return {
    headers: {
      get: (name: string) => headersList.get(name)
    }
  } as Request;
}

/**
 * Extract IP address from request
 */
function extractIPAddress(request: Request): string | null {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         request.headers.get('cf-connecting-ip') || 
         '0.0.0.0';
}

/**
 * Extract user agent from request
 */
function extractUserAgent(request: Request): string | null {
  return request.headers.get('user-agent') || 'Unknown';
}

/**
 * HIPAA-compliant audit logging
 */
async function logHIPAAAuditEntry(entry: {
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  try {
    const session = await getServerSession();
    const requestContext = await getRequestContext();
    
    console.log('[HIPAA Audit]', {
      timestamp: new Date().toISOString(),
      userId: session?.user.id || 'anonymous',
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      ipAddress: requestContext.ipAddress,
      userAgent: requestContext.userAgent,
      details: entry.details
    });
  } catch (error) {
    // Never throw - audit logging is fire-and-forget
    console.warn('HIPAA audit logging failed:', error);
  }
}

/**
 * Mock implementations for form operations
 * These would be replaced with actual implementations in production
 */

async function checkPermission(
  userId: string,
  userRole: string,
  permission: string
): Promise<boolean> {
  // Mock implementation - replace with actual RBAC logic
  return true;
}

async function checkFormAccess(
  userId: string,
  userRole: string,
  formId: string,
  action: string
): Promise<boolean> {
  // Mock implementation - replace with actual access control logic
  return true;
}

function generateZodSchema(fields: FormField[]): Record<string, unknown> {
  // Mock Zod schema generation - replace with actual Zod schema builder
  const schema: Record<string, unknown> = {};
  fields.forEach(field => {
    schema[field.name] = {
      type: field.type,
      required: field.required,
      validation: field.validation || {}
    };
  });
  return schema;
}

function serializeZodSchema(schema: Record<string, unknown>): string {
  // Mock schema serialization - replace with actual Zod schema serialization
  return JSON.stringify(schema);
}

function formContainsPHI(fields: FormField[]): boolean {
  // Mock PHI detection - replace with actual PHI field detection logic
  return fields.some(field => 
    field.name.toLowerCase().includes('ssn') ||
    field.name.toLowerCase().includes('medical') ||
    field.name.toLowerCase().includes('health') ||
    field.type === 'ssn' ||
    field.type === 'medical'
  );
}

async function createFormVersion(formId: string): Promise<void> {
  // Mock versioning - replace with actual form versioning logic
  console.log(`[Forms] Created version for form ${formId}`);
}

async function getForm(formId: string): Promise<FormDefinition> {
  // Mock form retrieval - replace with actual database query
  return {
    id: formId,
    name: 'Mock Form',
    description: 'Mock form description',
    fields: [
      {
        id: '1',
        type: 'text',
        label: 'Name',
        name: 'name',
        required: true
      }
    ],
    createdBy: 'user-123',
    metadata: {
      isPHI: false,
      version: 1
    }
  };
}

function validateFormData(schema: Record<string, unknown>, data: Record<string, unknown>): Record<string, unknown> {
  // Mock validation - replace with actual Zod validation
  return data;
}

function sanitizeFormData(data: Record<string, unknown>): Record<string, unknown> {
  // Mock sanitization - replace with actual XSS prevention logic
  const sanitized: Record<string, unknown> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Basic HTML escape - replace with comprehensive sanitization
      sanitized[key] = value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    } else {
      sanitized[key] = value;
    }
  });
  return sanitized;
}

function detectPHI(data: Record<string, unknown>, fields: FormField[]): string[] {
  // Mock PHI detection - replace with actual PHI detection logic
  const phiFields: string[] = [];
  fields.forEach(field => {
    if (data[field.name] && (
      field.name.toLowerCase().includes('ssn') ||
      field.name.toLowerCase().includes('medical') ||
      field.name.toLowerCase().includes('health')
    )) {
      phiFields.push(field.name);
    }
  });
  return phiFields;
}

async function getFormResponseCount(formId: string): Promise<number> {
  // Mock response count - replace with actual database query
  return 0;
}

async function softDeleteForm(formId: string): Promise<void> {
  // Mock soft delete - replace with actual database operation
  console.log(`[Forms] Soft deleted form ${formId}`);
}

async function verifyAccessToken(token: string): Promise<{ id: string; email: string; role: string }> {
  // Mock token verification - replace with actual JWT verification
  return {
    id: 'user-123',
    email: 'user@example.com',
    role: 'USER'
  };
}
