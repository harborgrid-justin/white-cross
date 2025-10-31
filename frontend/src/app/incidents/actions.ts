/**
 * @fileoverview Server Actions for Incident Management
 * @module app/incidents/actions
 *
 * Next.js v16 App Router Server Actions for incident CRUD operations, witness management, and follow-up tracking.
 * Legal-grade audit logging with tamper-proof trails for compliance.
 * Enhanced with Next.js v16 caching capabilities and revalidation patterns.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useActionState } from 'react';
 * import { createIncidentAction } from '@/app/incidents/actions';
 *
 * function IncidentForm() {
 *   const [state, formAction, isPending] = useActionState(createIncidentAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

'use server';
'use cache';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z, type ZodIssue } from 'zod';
import { cacheLife, cacheTag } from 'next/cache';

// Import schemas
import {
  CreateIncidentSchema,
  UpdateIncidentSchema,
  type Incident,
  type CreateIncidentInput,
  type UpdateIncidentInput,
  type IncidentFilter,
  isValidStatusTransition,
  type IncidentStatusEnum,
} from '@/schemas/incidents/incident.schemas';
import {
  CreateWitnessSchema,
  CreateStatementSchema,
  type Witness,
  type WitnessStatement,
  type CreateWitnessInput,
  type CreateStatementInput,
  createStatementHash,
  generateVerificationCode,
} from '@/schemas/incidents/witness.schemas';
import {
  CreateFollowUpActionSchema,
  UpdateProgressSchema,
  type FollowUpAction,
  type CreateFollowUpActionInput,
  type UpdateProgressInput,
  isValidFollowUpTransition,
  type FollowUpStatusEnum,
  isOverdue,
} from '@/schemas/incidents/follow-up.schemas';

// Import audit logging utilities
import {
  auditLog,
  AUDIT_ACTIONS,
  extractIPAddress,
  extractUserAgent
} from '@/lib/audit';

// Use server-side or fallback to public env variable or default
const BACKEND_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success?: boolean;
  data?: T;
  errors?: Record<string, string[]> & {
    _form?: string[];
  };
  message?: string;
}

/**
 * Get auth token from cookies
 */
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

/**
 * Get current user ID from cookies
 */
async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('user_id')?.value || null;
}

/**
 * Create audit context from headers
 */
async function createAuditContext() {
  const headersList = await headers();
  const request = {
    headers: headersList
  } as Request;

  const userId = await getCurrentUserId();
  return {
    userId,
    ipAddress: extractIPAddress(request),
    userAgent: extractUserAgent(request)
  };
}

/**
 * Enhanced fetch with Next.js v16 capabilities
 */
async function enhancedFetch(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
    next: {
      revalidate: 300, // 5 minute cache
      tags: ['incidents', 'legal-data']
    }
  });
}

// ==========================================
// INCIDENT OPERATIONS
// ==========================================

/**
 * Create new incident report
 * Legal-grade audit logging for all incident creations
 */
export async function createIncidentAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    // Parse and validate form data
    const rawData = {
      studentId: formData.get('studentId'),
      type: formData.get('type'),
      severity: formData.get('severity'),
      location: formData.get('location'),
      description: formData.get('description'),
      injuriesReported: formData.get('injuriesReported') === 'true',
      injuryDetails: formData.get('injuryDetails') || undefined,
      medicalAttentionRequired: formData.get('medicalAttentionRequired') === 'true',
      reportedBy: formData.get('reportedBy'),
      reportedByRole: formData.get('reportedByRole') || undefined,
      witnesses: [],
      followUpRequired: formData.get('followUpRequired') === 'true',
      parentNotified: formData.get('parentNotified') === 'true',
      parentNotificationMethod: formData.get('parentNotificationMethod') || undefined,
      parentNotificationDate: formData.get('parentNotificationDate') || undefined,
      incidentDate: formData.get('incidentDate'),
      incidentTime: formData.get('incidentTime'),
      additionalNotes: formData.get('additionalNotes') || undefined
    };

    const validatedData = CreateIncidentSchema.parse(rawData);

    // Create incident via API with enhanced fetch
    const response = await enhancedFetch(`${BACKEND_URL}/incidents`, {
      method: 'POST',
      body: JSON.stringify({
        ...validatedData,
        reportedDate: new Date().toISOString(),
        status: 'REPORTED'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create incident report');
    }

    const result = await response.json();

    // Legal-grade audit logging
    await auditLog({
      ...auditContext,
      action: 'INCIDENT_CREATE',
      resource: 'Incident',
      resourceId: result.data.id,
      details: `Created ${validatedData.severity} ${validatedData.type} incident for student ${validatedData.studentId}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('incidents');
    revalidateTag(`student-${validatedData.studentId}-incidents`);
    revalidateTag('legal-data');
    revalidatePath('/incidents');
    revalidatePath(`/students/${validatedData.studentId}/incidents`);

    return {
      success: true,
      data: result.data,
      message: 'Incident report created successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    // Log failed attempt
    await auditLog({
      ...auditContext,
      action: 'INCIDENT_CREATE_FAILED',
      resource: 'Incident',
      details: 'Failed to create incident report',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to create incident report']
      }
    };
  }
}

/**
 * Get incidents with enhanced caching
 */
export async function getIncidentsAction(filter?: IncidentFilter) {
  cacheLife('max');
  cacheTag('incidents', 'legal-data');

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const response = await enhancedFetch(`${BACKEND_URL}/incidents?${params.toString()}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch incidents');
    }

    const result = await response.json();

    return {
      success: true,
      data: {
        incidents: result.data || result.incidents || [],
        total: result.total || 0,
        pages: result.pages || 1
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch incidents'
    };
  }
}

/**
 * Get incident by ID with enhanced caching
 */
export async function getIncidentAction(id: string) {
  cacheLife('max');
  cacheTag('incidents', `incident-${id}`, 'legal-data');

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await enhancedFetch(`${BACKEND_URL}/incidents/${id}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch incident');
    }

    const result = await response.json();

    // Log legal data access
    const auditContext = await createAuditContext();
    await auditLog({
      ...auditContext,
      action: 'INCIDENT_VIEW',
      resource: 'Incident',
      resourceId: id,
      details: `Accessed incident report ${id}`,
      success: true
    });

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch incident'
    };
  }
}

/**
 * Update existing incident
 * Enforces status workflow transitions
 */
export async function updateIncidentAction(
  id: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    // Parse and validate form data
    const rawData = {
      type: formData.get('type') || undefined,
      severity: formData.get('severity') || undefined,
      location: formData.get('location') || undefined,
      description: formData.get('description') || undefined,
      injuriesReported: formData.get('injuriesReported') ? formData.get('injuriesReported') === 'true' : undefined,
      injuryDetails: formData.get('injuryDetails') || undefined,
      medicalAttentionRequired: formData.get('medicalAttentionRequired') ? formData.get('medicalAttentionRequired') === 'true' : undefined,
      followUpRequired: formData.get('followUpRequired') ? formData.get('followUpRequired') === 'true' : undefined,
      parentNotified: formData.get('parentNotified') ? formData.get('parentNotified') === 'true' : undefined,
      parentNotificationMethod: formData.get('parentNotificationMethod') || undefined,
      parentNotificationDate: formData.get('parentNotificationDate') || undefined,
      additionalNotes: formData.get('additionalNotes') || undefined,
      status: formData.get('status') || undefined
    };

    const validatedData = UpdateIncidentSchema.parse(rawData);

    // If status is changing, validate transition
    if (validatedData.status) {
      const currentIncident = await getIncidentAction(id);
      if (currentIncident.success && currentIncident.data) {
        const isValid = isValidStatusTransition(
          currentIncident.data.status,
          validatedData.status
        );
        if (!isValid) {
          return {
            errors: {
              _form: [`Invalid status transition from ${currentIncident.data.status} to ${validatedData.status}`]
            }
          };
        }
      }
    }

    // Update via API
    const response = await enhancedFetch(`${BACKEND_URL}/incidents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update incident report');
    }

    const result = await response.json();

    // Legal audit trail
    await auditLog({
      ...auditContext,
      action: 'INCIDENT_UPDATE',
      resource: 'Incident',
      resourceId: id,
      details: `Updated incident report ${id}`,
      changes: validatedData,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('incidents');
    revalidateTag(`incident-${id}`);
    revalidateTag('legal-data');
    if (result.data.studentId) {
      revalidateTag(`student-${result.data.studentId}-incidents`);
    }
    revalidatePath('/incidents');
    revalidatePath(`/incidents/${id}`);

    return {
      success: true,
      data: result.data,
      message: 'Incident report updated successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to update incident report']
      }
    };
  }
}

/**
 * Delete incident (soft delete)
 */
export async function deleteIncidentAction(id: string): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    const response = await enhancedFetch(`${BACKEND_URL}/incidents/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete incident');
    }

    // Legal audit trail
    await auditLog({
      ...auditContext,
      action: 'INCIDENT_DELETE',
      resource: 'Incident',
      resourceId: id,
      details: `Deleted incident report ${id}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('incidents');
    revalidateTag(`incident-${id}`);
    revalidateTag('legal-data');
    revalidatePath('/incidents');

    return {
      success: true,
      message: 'Incident report deleted successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to delete incident']
      }
    };
  }
}

// ==========================================
// WITNESS OPERATIONS
// ==========================================

/**
 * Add witness to incident
 */
export async function addWitnessAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    const rawData = {
      incidentId: formData.get('incidentId'),
      witnessType: formData.get('witnessType'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email') || undefined,
      phone: formData.get('phone') || undefined,
      role: formData.get('role') || undefined,
      department: formData.get('department') || undefined,
      studentGrade: formData.get('studentGrade') || undefined,
      relationshipToIncident: formData.get('relationshipToIncident') || undefined,
      contactPreference: formData.get('contactPreference') || 'EMAIL',
      availableForStatement: formData.get('availableForStatement') === 'true',
      statementDeadline: formData.get('statementDeadline') || undefined,
      notes: formData.get('notes') || undefined
    };

    const validatedData = CreateWitnessSchema.parse(rawData);

    const response = await enhancedFetch(`${BACKEND_URL}/incidents/${validatedData.incidentId}/witnesses`, {
      method: 'POST',
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add witness');
    }

    const result = await response.json();

    // Legal audit
    await auditLog({
      ...auditContext,
      action: 'WITNESS_ADD',
      resource: 'Incident',
      resourceId: validatedData.incidentId,
      details: `Added ${validatedData.witnessType} witness: ${validatedData.firstName} ${validatedData.lastName}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('incidents');
    revalidateTag(`incident-${validatedData.incidentId}`);
    revalidateTag(`incident-witnesses-${validatedData.incidentId}`);
    revalidateTag('legal-data');
    revalidatePath(`/incidents/${validatedData.incidentId}/witnesses`);

    return {
      success: true,
      data: result.data,
      message: 'Witness added successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to add witness']
      }
    };
  }
}

/**
 * Submit witness statement
 * Creates tamper-proof hash for legal compliance
 */
export async function submitWitnessStatementAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    const rawData = {
      incidentId: formData.get('incidentId'),
      witnessId: formData.get('witnessId'),
      statement: formData.get('statement'),
      statementDate: formData.get('statementDate'),
      location: formData.get('location') || undefined,
      additionalInformation: formData.get('additionalInformation') || undefined,
      mediaAttachments: []
    };

    const validatedData = CreateStatementSchema.parse(rawData);

    // Create tamper-proof hash
    const submittedAt = new Date().toISOString();
    const statementHash = await createStatementHash({
      ...validatedData,
      submittedAt
    });

    // Generate verification code
    const verificationCode = generateVerificationCode();

    const response = await enhancedFetch(`${BACKEND_URL}/incidents/${validatedData.incidentId}/witnesses/${validatedData.witnessId}/statement`, {
      method: 'POST',
      body: JSON.stringify({
        ...validatedData,
        signatureHash: statementHash,
        verificationCode,
        submittedAt,
        status: 'SUBMITTED'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit statement');
    }

    const result = await response.json();

    // Legal audit with hash
    await auditLog({
      ...auditContext,
      action: 'WITNESS_STATEMENT_SUBMIT',
      resource: 'Incident',
      resourceId: validatedData.incidentId,
      details: `Witness statement submitted with hash: ${statementHash.substring(0, 16)}...`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('incidents');
    revalidateTag(`incident-${validatedData.incidentId}`);
    revalidateTag(`witness-statement-${validatedData.witnessId}`);
    revalidateTag('legal-data');
    revalidatePath(`/incidents/${validatedData.incidentId}/witnesses/${validatedData.witnessId}`);

    return {
      success: true,
      data: result.data,
      message: 'Witness statement submitted successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to submit statement']
      }
    };
  }
}

// ==========================================
// ANALYTICS OPERATIONS
// ==========================================

/**
 * Get incident analytics with enhanced caching
 */
export async function getIncidentAnalyticsAction(filters?: {
  startDate?: string;
  endDate?: string;
  type?: string;
}) {
  cacheLife('max');
  cacheTag('incidents', 'incident-analytics', 'legal-data');

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value);
        }
      });
    }

    const response = await enhancedFetch(`${BACKEND_URL}/incidents/analytics?${params.toString()}`, {
      method: 'GET',
      next: {
        revalidate: 3600, // 1 hour cache for analytics
        tags: ['incident-analytics', 'legal-data']
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch incident analytics');
    }

    const result = await response.json();

    return {
      success: true,
      data: {
        totalIncidents: result.totalIncidents || 0,
        byType: result.byType || {},
        bySeverity: result.bySeverity || {},
        byStatus: result.byStatus || {},
        byLocation: result.byLocation || {},
        trendData: result.trendData || [],
        responseMetrics: result.responseMetrics || { avgResponseTime: 0, avgResolutionTime: 0 }
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch analytics'
    };
  }
}

/**
 * Get trending incidents with enhanced caching
 */
export async function getTrendingIncidentsAction(period: 'week' | 'month' | 'quarter' = 'month') {
  cacheLife('max');
  cacheTag('incidents', 'incident-trends', 'legal-data');

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await enhancedFetch(`${BACKEND_URL}/incidents/trending?period=${period}`, {
      method: 'GET',
      next: {
        revalidate: 3600, // 1 hour cache for trends
        tags: ['incident-trends', 'legal-data']
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trending data');
    }

    const result = await response.json();

    return {
      success: true,
      data: {
        increasingTypes: result.increasingTypes || [],
        hotspots: result.hotspots || [],
        patterns: result.patterns || []
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch trending data'
    };
  }
}
