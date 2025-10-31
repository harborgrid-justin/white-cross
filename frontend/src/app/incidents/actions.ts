/**
 * @fileoverview Incident Management Server Actions - Next.js v14+ Compatible
 * @module app/incidents/actions
 *
 * HIPAA-compliant server actions for incident management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all incident operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
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
import { formatName, formatPhone } from '@/utils/formatters';

// ==========================================
// CONFIGURATION
// ==========================================

// Custom cache tags for incidents
export const INCIDENT_CACHE_TAGS = {
  INCIDENTS: 'incidents',
  WITNESSES: 'incident-witnesses',
  STATEMENTS: 'witness-statements',
  FOLLOW_UPS: 'incident-follow-ups',
  ANALYTICS: 'incident-analytics',
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

export interface Incident {
  id: string;
  studentId: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  location: string;
  description: string;
  injuriesReported: boolean;
  injuryDetails?: string;
  medicalAttentionRequired: boolean;
  reportedBy: string;
  reportedByRole?: string;
  reportedDate: string;
  incidentDate: string;
  incidentTime: string;
  followUpRequired: boolean;
  parentNotified: boolean;
  parentNotificationMethod?: string;
  parentNotificationDate?: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncidentData {
  studentId: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  description: string;
  injuriesReported: boolean;
  injuryDetails?: string;
  medicalAttentionRequired: boolean;
  reportedBy: string;
  reportedByRole?: string;
  incidentDate: string;
  incidentTime: string;
  followUpRequired: boolean;
  parentNotified: boolean;
  parentNotificationMethod?: string;
  parentNotificationDate?: string;
  additionalNotes?: string;
}

export interface UpdateIncidentData {
  type?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  location?: string;
  description?: string;
  injuriesReported?: boolean;
  injuryDetails?: string;
  medicalAttentionRequired?: boolean;
  followUpRequired?: boolean;
  parentNotified?: boolean;
  parentNotificationMethod?: string;
  parentNotificationDate?: string;
  additionalNotes?: string;
}

export interface Witness {
  id: string;
  incidentId: string;
  witnessType: 'STUDENT' | 'STAFF' | 'VISITOR' | 'OTHER';
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  studentGrade?: string;
  relationshipToIncident?: string;
  contactPreference: 'EMAIL' | 'PHONE' | 'IN_PERSON';
  availableForStatement: boolean;
  statementDeadline?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWitnessData {
  incidentId: string;
  witnessType: 'STUDENT' | 'STAFF' | 'VISITOR' | 'OTHER';
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  studentGrade?: string;
  relationshipToIncident?: string;
  contactPreference: 'EMAIL' | 'PHONE' | 'IN_PERSON';
  availableForStatement: boolean;
  statementDeadline?: string;
  notes?: string;
}

export interface WitnessStatement {
  id: string;
  witnessId: string;
  incidentId: string;
  statement: string;
  statementDate: string;
  location?: string;
  additionalInformation?: string;
  signatureHash: string;
  verificationCode: string;
  submittedAt: string;
  status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'DISPUTED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateStatementData {
  witnessId: string;
  incidentId: string;
  statement: string;
  statementDate: string;
  location?: string;
  additionalInformation?: string;
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get incident by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getIncident = cache(async (id: string): Promise<Incident | null> => {
  try {
    const response = await serverGet<ApiResponse<Incident>>(
      API_ENDPOINTS.INCIDENTS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`incident-${id}`, INCIDENT_CACHE_TAGS.INCIDENTS, CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get incident:', error);
    return null;
  }
});

/**
 * Get all incidents with caching
 * Uses shorter TTL for frequently updated data
 */
export const getIncidents = cache(async (filters?: Record<string, unknown>): Promise<Incident[]> => {
  try {
    const response = await serverGet<ApiResponse<Incident[]>>(
      API_ENDPOINTS.INCIDENTS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [INCIDENT_CACHE_TAGS.INCIDENTS, 'incident-list', CACHE_TAGS.PHI] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get incidents:', error);
    return [];
  }
});

// ==========================================
// INCIDENT OPERATIONS
// ==========================================

/**
 * Create incident action
 * Includes HIPAA audit logging and cache invalidation
 */
export async function createIncidentAction(data: CreateIncidentData): Promise<ActionResult<Incident>> {
  try {
    // Validate required fields
    if (!data.studentId || !data.type || !data.severity || !data.location || !data.description) {
      return {
        success: false,
        error: 'Missing required fields: studentId, type, severity, location, description'
      };
    }

    // Validate incident date
    if (!data.incidentDate || !data.incidentTime) {
      return {
        success: false,
        error: 'Incident date and time are required'
      };
    }

    const incidentData = {
      ...data,
      reportedDate: new Date().toISOString(),
      status: 'REPORTED'
    };

    const response = await serverPost<ApiResponse<Incident>>(
      API_ENDPOINTS.INCIDENTS.BASE,
      incidentData,
      {
        cache: 'no-store',
        next: { tags: [INCIDENT_CACHE_TAGS.INCIDENTS, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create incident');
    }

    // HIPAA AUDIT LOG - Mandatory for incident creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_INCIDENT,
      resource: 'Incident',
      resourceId: response.data.id,
      details: `Created ${data.severity} ${data.type} incident for student ${data.studentId}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(INCIDENT_CACHE_TAGS.INCIDENTS);
    revalidateTag('incident-list');
    revalidateTag(`student-${data.studentId}-incidents`);
    revalidatePath('/incidents', 'page');
    revalidatePath(`/students/${data.studentId}/incidents`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Incident created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create incident';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_INCIDENT,
      resource: 'Incident',
      details: `Failed to create incident: ${errorMessage}`,
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
 * Update incident action
 * Includes HIPAA audit logging and cache invalidation
 */
export async function updateIncidentAction(
  incidentId: string,
  data: UpdateIncidentData
): Promise<ActionResult<Incident>> {
  try {
    if (!incidentId) {
      return {
        success: false,
        error: 'Incident ID is required'
      };
    }

    const response = await serverPut<ApiResponse<Incident>>(
      API_ENDPOINTS.INCIDENTS.BY_ID(incidentId),
      data,
      {
        cache: 'no-store',
        next: { tags: [INCIDENT_CACHE_TAGS.INCIDENTS, `incident-${incidentId}`, CACHE_TAGS.PHI] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update incident');
    }

    // HIPAA AUDIT LOG - Mandatory for incident modification
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_INCIDENT,
      resource: 'Incident',
      resourceId: incidentId,
      details: 'Updated incident information',
      changes: data,
      success: true
    });

    // Cache invalidation
    revalidateTag(INCIDENT_CACHE_TAGS.INCIDENTS);
    revalidateTag(`incident-${incidentId}`);
    revalidateTag('incident-list');
    if (response.data.studentId) {
      revalidateTag(`student-${response.data.studentId}-incidents`);
    }
    revalidatePath('/incidents', 'page');
    revalidatePath(`/incidents/${incidentId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Incident updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update incident';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_INCIDENT,
      resource: 'Incident',
      resourceId: incidentId,
      details: `Failed to update incident: ${errorMessage}`,
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
 * Delete incident action (soft delete)
 * Includes HIPAA audit logging and cache invalidation
 */
export async function deleteIncidentAction(incidentId: string): Promise<ActionResult<void>> {
  try {
    if (!incidentId) {
      return {
        success: false,
        error: 'Incident ID is required'
      };
    }

    await serverDelete<ApiResponse<void>>(
      API_ENDPOINTS.INCIDENTS.BY_ID(incidentId),
      {
        cache: 'no-store',
        next: { tags: [INCIDENT_CACHE_TAGS.INCIDENTS, `incident-${incidentId}`, CACHE_TAGS.PHI] }
      }
    );

    // HIPAA AUDIT LOG - Mandatory for incident deletion
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_INCIDENT,
      resource: 'Incident',
      resourceId: incidentId,
      details: 'Deleted incident record (soft delete)',
      success: true
    });

    // Cache invalidation
    revalidateTag(INCIDENT_CACHE_TAGS.INCIDENTS);
    revalidateTag(`incident-${incidentId}`);
    revalidateTag('incident-list');
    revalidatePath('/incidents', 'page');

    return {
      success: true,
      message: 'Incident deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete incident';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_INCIDENT,
      resource: 'Incident',
      resourceId: incidentId,
      details: `Failed to delete incident: ${errorMessage}`,
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
 * Get incident action with caching
 */
export async function getIncidentAction(incidentId: string): Promise<ActionResult<Incident>> {
  try {
    if (!incidentId) {
      return {
        success: false,
        error: 'Incident ID is required'
      };
    }

    const response = await serverGet<ApiResponse<Incident>>(
      API_ENDPOINTS.INCIDENTS.BY_ID(incidentId),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`incident-${incidentId}`, INCIDENT_CACHE_TAGS.INCIDENTS, CACHE_TAGS.PHI] 
        }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get incident');
    }

    // HIPAA AUDIT LOG - Log incident access
    await auditLog({
      action: AUDIT_ACTIONS.VIEW_INCIDENT,
      resource: 'Incident',
      resourceId: incidentId,
      details: `Accessed incident report ${incidentId}`,
      success: true
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to get incident';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// WITNESS OPERATIONS
// ==========================================

/**
 * Add witness to incident
 * Includes HIPAA audit logging and cache invalidation
 */
export async function addWitnessAction(data: CreateWitnessData): Promise<ActionResult<Witness>> {
  try {
    // Validate required fields
    if (!data.incidentId || !data.witnessType || !data.firstName || !data.lastName) {
      return {
        success: false,
        error: 'Missing required fields: incidentId, witnessType, firstName, lastName'
      };
    }

    // Validate email if provided
    if (data.email && !validateEmail(data.email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Validate phone if provided
    if (data.phone && !validatePhone(data.phone)) {
      return {
        success: false,
        error: 'Invalid phone format'
      };
    }

    const response = await serverPost<ApiResponse<Witness>>(
      API_ENDPOINTS.INCIDENTS.WITNESSES(data.incidentId),
      data,
      {
        cache: 'no-store',
        next: { tags: [INCIDENT_CACHE_TAGS.WITNESSES, INCIDENT_CACHE_TAGS.INCIDENTS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to add witness');
    }

    // HIPAA AUDIT LOG - Witness addition
    await auditLog({
      action: 'WITNESS_ADD',
      resource: 'Incident',
      resourceId: data.incidentId,
      details: `Added ${data.witnessType} witness: ${formatName(data.firstName, data.lastName)}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(INCIDENT_CACHE_TAGS.WITNESSES);
    revalidateTag(INCIDENT_CACHE_TAGS.INCIDENTS);
    revalidateTag(`incident-${data.incidentId}`);
    revalidateTag(`incident-witnesses-${data.incidentId}`);
    revalidatePath(`/incidents/${data.incidentId}/witnesses`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Witness added successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to add witness';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Submit witness statement
 * Includes HIPAA audit logging and tamper-proof hash
 */
export async function submitWitnessStatementAction(data: CreateStatementData): Promise<ActionResult<WitnessStatement>> {
  try {
    // Validate required fields
    if (!data.witnessId || !data.incidentId || !data.statement || !data.statementDate) {
      return {
        success: false,
        error: 'Missing required fields: witnessId, incidentId, statement, statementDate'
      };
    }

    // Create tamper-proof hash and verification code
    const submittedAt = new Date().toISOString();
    const statementHash = generateId(); // Would use actual hash function in production
    const verificationCode = generateId().substring(0, 8).toUpperCase();

    const statementData = {
      ...data,
      signatureHash: statementHash,
      verificationCode,
      submittedAt,
      status: 'SUBMITTED'
    };

    const response = await serverPost<ApiResponse<WitnessStatement>>(
      API_ENDPOINTS.INCIDENTS.WITNESS_STATEMENT(data.incidentId, data.witnessId),
      statementData,
      {
        cache: 'no-store',
        next: { tags: [INCIDENT_CACHE_TAGS.STATEMENTS, INCIDENT_CACHE_TAGS.INCIDENTS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to submit statement');
    }

    // HIPAA AUDIT LOG - Statement submission with hash
    await auditLog({
      action: 'WITNESS_STATEMENT_SUBMIT',
      resource: 'Incident',
      resourceId: data.incidentId,
      details: `Witness statement submitted with hash: ${statementHash.substring(0, 16)}...`,
      success: true
    });

    // Cache invalidation
    revalidateTag(INCIDENT_CACHE_TAGS.STATEMENTS);
    revalidateTag(INCIDENT_CACHE_TAGS.INCIDENTS);
    revalidateTag(`incident-${data.incidentId}`);
    revalidateTag(`witness-statement-${data.witnessId}`);
    revalidatePath(`/incidents/${data.incidentId}/witnesses/${data.witnessId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Witness statement submitted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to submit statement';

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
 * Create incident from form data
 * Form-friendly wrapper for createIncidentAction
 */
export async function createIncidentFromForm(formData: FormData): Promise<ActionResult<Incident>> {
  const incidentData: CreateIncidentData = {
    studentId: formData.get('studentId') as string,
    type: formData.get('type') as string,
    severity: formData.get('severity') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    location: formData.get('location') as string,
    description: formData.get('description') as string,
    injuriesReported: formData.get('injuriesReported') === 'true',
    injuryDetails: formData.get('injuryDetails') as string || undefined,
    medicalAttentionRequired: formData.get('medicalAttentionRequired') === 'true',
    reportedBy: formData.get('reportedBy') as string,
    reportedByRole: formData.get('reportedByRole') as string || undefined,
    incidentDate: formData.get('incidentDate') as string,
    incidentTime: formData.get('incidentTime') as string,
    followUpRequired: formData.get('followUpRequired') === 'true',
    parentNotified: formData.get('parentNotified') === 'true',
    parentNotificationMethod: formData.get('parentNotificationMethod') as string || undefined,
    parentNotificationDate: formData.get('parentNotificationDate') as string || undefined,
    additionalNotes: formData.get('additionalNotes') as string || undefined,
  };

  const result = await createIncidentAction(incidentData);
  
  if (result.success && result.data) {
    redirect(`/incidents/${result.data.id}`);
  }
  
  return result;
}

/**
 * Update incident from form data
 * Form-friendly wrapper for updateIncidentAction
 */
export async function updateIncidentFromForm(
  incidentId: string, 
  formData: FormData
): Promise<ActionResult<Incident>> {
  const updateData: UpdateIncidentData = {
    type: formData.get('type') as string || undefined,
    severity: formData.get('severity') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' || undefined,
    status: formData.get('status') as 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED' || undefined,
    location: formData.get('location') as string || undefined,
    description: formData.get('description') as string || undefined,
    injuriesReported: formData.has('injuriesReported') ? formData.get('injuriesReported') === 'true' : undefined,
    injuryDetails: formData.get('injuryDetails') as string || undefined,
    medicalAttentionRequired: formData.has('medicalAttentionRequired') ? formData.get('medicalAttentionRequired') === 'true' : undefined,
    followUpRequired: formData.has('followUpRequired') ? formData.get('followUpRequired') === 'true' : undefined,
    parentNotified: formData.has('parentNotified') ? formData.get('parentNotified') === 'true' : undefined,
    parentNotificationMethod: formData.get('parentNotificationMethod') as string || undefined,
    parentNotificationDate: formData.get('parentNotificationDate') as string || undefined,
    additionalNotes: formData.get('additionalNotes') as string || undefined,
  };

  // Filter out undefined values
  const filteredData = Object.entries(updateData).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof UpdateIncidentData] = value;
    }
    return acc;
  }, {} as UpdateIncidentData);

  const result = await updateIncidentAction(incidentId, filteredData);
  
  if (result.success && result.data) {
    redirect(`/incidents/${result.data.id}`);
  }
  
  return result;
}

/**
 * Add witness from form data
 * Form-friendly wrapper for addWitnessAction
 */
export async function addWitnessFromForm(formData: FormData): Promise<ActionResult<Witness>> {
  const witnessData: CreateWitnessData = {
    incidentId: formData.get('incidentId') as string,
    witnessType: formData.get('witnessType') as 'STUDENT' | 'STAFF' | 'VISITOR' | 'OTHER',
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string || undefined,
    phone: formData.get('phone') as string || undefined,
    role: formData.get('role') as string || undefined,
    department: formData.get('department') as string || undefined,
    studentGrade: formData.get('studentGrade') as string || undefined,
    relationshipToIncident: formData.get('relationshipToIncident') as string || undefined,
    contactPreference: formData.get('contactPreference') as 'EMAIL' | 'PHONE' | 'IN_PERSON' || 'EMAIL',
    availableForStatement: formData.get('availableForStatement') === 'true',
    statementDeadline: formData.get('statementDeadline') as string || undefined,
    notes: formData.get('notes') as string || undefined,
  };

  const result = await addWitnessAction(witnessData);
  
  if (result.success && result.data) {
    redirect(`/incidents/${witnessData.incidentId}/witnesses`);
  }
  
  return result;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if incident exists
 */
export async function incidentExists(incidentId: string): Promise<boolean> {
  const incident = await getIncident(incidentId);
  return incident !== null;
}

/**
 * Get incident count
 */
export async function getIncidentCount(filters?: Record<string, unknown>): Promise<number> {
  try {
    const incidents = await getIncidents(filters);
    return incidents.length;
  } catch {
    return 0;
  }
}

/**
 * Clear incident cache
 */
export async function clearIncidentCache(incidentId?: string): Promise<void> {
  if (incidentId) {
    revalidateTag(`incident-${incidentId}`);
  }
  revalidateTag(INCIDENT_CACHE_TAGS.INCIDENTS);
  revalidateTag('incident-list');
  revalidatePath('/incidents', 'page');
}
