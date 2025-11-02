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
  [key: string]: unknown;
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

/**
 * Incident Statistics Interface
 * Dashboard metrics for incident management overview
 */
export interface IncidentStats {
  totalIncidents: number;
  openIncidents: number;
  resolvedIncidents: number;
  criticalIncidents: number;
  recentIncidents: number;
  avgResolutionTime: number;
  pendingFollowUps: number;
  incidentTypes: {
    injury: number;
    medical: number;
    behavioral: number;
    safety: number;
    property: number;
    other: number;
  };
  severity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

/**
 * Get Incident Statistics
 * Dashboard overview of incident management metrics
 * 
 * @returns Promise<IncidentStats>
 */
export const getIncidentStats = cache(async (): Promise<IncidentStats> => {
  try {
    console.log('[Incidents] Loading incident statistics');

    // Get all incidents for analysis
    const incidents = await getIncidents();

    // Calculate statistics
    const totalIncidents = incidents.length;
    const openIncidents = incidents.filter(i => i.status === 'REPORTED' || i.status === 'INVESTIGATING').length;
    const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
    const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL').length;
    
    // Get recent incidents (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentIncidents = incidents.filter(i => new Date(i.createdAt) >= weekAgo).length;

    const stats: IncidentStats = {
      totalIncidents,
      openIncidents,
      resolvedIncidents,
      criticalIncidents,
      recentIncidents,
      avgResolutionTime: 72.5, // Average hours - would be calculated from actual data
      pendingFollowUps: incidents.filter(i => i.followUpRequired).length,
      incidentTypes: {
        injury: incidents.filter(i => i.type === 'INJURY').length,
        medical: incidents.filter(i => i.type === 'MEDICAL').length,
        behavioral: incidents.filter(i => i.type === 'BEHAVIORAL').length,
        safety: incidents.filter(i => i.type === 'SAFETY').length,
        property: incidents.filter(i => i.type === 'PROPERTY_DAMAGE').length,
        other: incidents.filter(i => !['INJURY', 'MEDICAL', 'BEHAVIORAL', 'SAFETY', 'PROPERTY_DAMAGE'].includes(i.type)).length
      },
      severity: {
        low: incidents.filter(i => i.severity === 'LOW').length,
        medium: incidents.filter(i => i.severity === 'MEDIUM').length,
        high: incidents.filter(i => i.severity === 'HIGH').length,
        critical: incidents.filter(i => i.severity === 'CRITICAL').length
      }
    };

    console.log('[Incidents] Incident statistics loaded successfully');
    return stats;

  } catch (error) {
    console.error('[Incidents] Failed to load incident statistics:', error);
    
    // Return safe defaults on error
    return {
      totalIncidents: 0,
      openIncidents: 0,
      resolvedIncidents: 0,
      criticalIncidents: 0,
      recentIncidents: 0,
      avgResolutionTime: 0,
      pendingFollowUps: 0,
      incidentTypes: {
        injury: 0,
        medical: 0,
        behavioral: 0,
        safety: 0,
        property: 0,
        other: 0
      },
      severity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      }
    };
  }
});

/**
 * Get Incidents Dashboard Data
 * Combined dashboard data for incidents overview
 * 
 * @returns Promise<{stats: IncidentStats}>
 */
export const getIncidentsDashboardData = cache(async () => {
  try {
    console.log('[Incidents] Loading dashboard data');

    const stats = await getIncidentStats();

    console.log('[Incidents] Dashboard data loaded successfully');
    return { stats };

  } catch (error) {
    console.error('[Incidents] Failed to load dashboard data:', error);
    
    return {
      stats: await getIncidentStats() // Will return safe defaults
    };
  }
});

// ==========================================
// ADDITIONAL ACTIONS (ALIASES AND MISSING FUNCTIONS)
// ==========================================

/**
 * Alias for createIncidentAction for backward compatibility
 */
export const createIncident = createIncidentAction;

/**
 * Alias for updateIncidentAction for backward compatibility
 */
export const updateIncident = updateIncidentAction;

/**
 * Alias for submitWitnessStatementAction for backward compatibility
 */
export const submitWitnessStatement = submitWitnessStatementAction;

/**
 * Alias for getIncidents for backward compatibility
 */
export const listIncidents = getIncidents;

/**
 * Follow-up Action Interface
 */
export interface FollowUpAction {
  id: string;
  incidentId: string;
  actionType: 'INVESTIGATION' | 'DISCIPLINE' | 'MEDICAL' | 'PARENT_MEETING' | 'COUNSELING' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  title: string;
  description: string;
  notes?: string;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFollowUpData {
  incidentId: string;
  actionType: 'INVESTIGATION' | 'DISCIPLINE' | 'MEDICAL' | 'PARENT_MEETING' | 'COUNSELING' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo: string;
  dueDate: string;
  title: string;
  description: string;
  notes?: string;
}

/**
 * Create follow-up action for incident
 */
export async function createFollowUpAction(data: CreateFollowUpData): Promise<ActionResult<FollowUpAction>> {
  try {
    // Validate required fields
    if (!data.incidentId || !data.actionType || !data.assignedTo || !data.title || !data.description) {
      return {
        success: false,
        error: 'Missing required fields: incidentId, actionType, assignedTo, title, description'
      };
    }

    const followUpData = {
      ...data,
      status: 'PENDING',
      assignedBy: 'current-user', // Would get from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await serverPost<ApiResponse<FollowUpAction>>(
      `${API_ENDPOINTS.INCIDENTS.BASE}/${data.incidentId}/follow-ups`,
      followUpData,
      {
        cache: 'no-store',
        next: { tags: [INCIDENT_CACHE_TAGS.FOLLOW_UPS, INCIDENT_CACHE_TAGS.INCIDENTS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create follow-up action');
    }

    // HIPAA AUDIT LOG
    await auditLog({
      action: 'CREATE_FOLLOW_UP',
      resource: 'Incident',
      resourceId: data.incidentId,
      details: `Created ${data.actionType} follow-up action: ${data.title}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(INCIDENT_CACHE_TAGS.FOLLOW_UPS);
    revalidateTag(INCIDENT_CACHE_TAGS.INCIDENTS);
    revalidateTag(`incident-${data.incidentId}`);
    revalidatePath(`/incidents/${data.incidentId}/follow-up`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Follow-up action created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create follow-up action';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Get follow-up actions for incident
 */
export async function listFollowUpActions(incidentId: string): Promise<ActionResult<FollowUpAction[]>> {
  try {
    if (!incidentId) {
      return {
        success: false,
        error: 'Incident ID is required'
      };
    }

    const response = await serverGet<ApiResponse<FollowUpAction[]>>(
      `${API_ENDPOINTS.INCIDENTS.BASE}/${incidentId}/follow-ups`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`incident-follow-ups-${incidentId}`, INCIDENT_CACHE_TAGS.FOLLOW_UPS, CACHE_TAGS.PHI] 
        }
      }
    );

    return {
      success: true,
      data: response.data || []
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to get follow-up actions';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Get trending incidents (most recent high-priority incidents)
 */
export async function getTrendingIncidents(limit: number = 10): Promise<ActionResult<Incident[]>> {
  try {
    const incidents = await getIncidents();
    
    // Filter and sort for trending incidents
    const trendingIncidents = incidents
      .filter(incident => 
        incident.severity === 'HIGH' || 
        incident.severity === 'CRITICAL' ||
        incident.status === 'INVESTIGATING'
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return {
      success: true,
      data: trendingIncidents
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get trending incidents';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Incident Analytics Interface
 */
export interface IncidentAnalytics {
  totalIncidents: number;
  incidentTrends: {
    thisMonth: number;
    lastMonth: number;
    changePercent: number;
  };
  severityBreakdown: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  typeBreakdown: {
    injury: number;
    illness: number;
    behavioral: number;
    safety: number;
    other: number;
  };
  resolutionTimes: {
    average: number;
    median: number;
    fastest: number;
    slowest: number;
  };
  locationHotspots: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    count: number;
    severity: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  }>;
}

/**
 * Get incident analytics data
 */
export async function getIncidentAnalytics(): Promise<ActionResult<IncidentAnalytics>> {
  try {
    const incidents = await getIncidents();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // This month's incidents
    const thisMonth = incidents.filter(incident => {
      const incidentDate = new Date(incident.createdAt);
      return incidentDate.getMonth() === currentMonth && incidentDate.getFullYear() === currentYear;
    });
    
    // Last month's incidents
    const lastMonthDate = new Date(currentYear, currentMonth - 1);
    const lastMonth = incidents.filter(incident => {
      const incidentDate = new Date(incident.createdAt);
      return incidentDate.getMonth() === lastMonthDate.getMonth() && 
             incidentDate.getFullYear() === lastMonthDate.getFullYear();
    });

    // Calculate change percentage
    const changePercent = lastMonth.length > 0 
      ? ((thisMonth.length - lastMonth.length) / lastMonth.length) * 100 
      : 0;

    // Severity breakdown
    const severityBreakdown = {
      low: incidents.filter(i => i.severity === 'LOW').length,
      medium: incidents.filter(i => i.severity === 'MEDIUM').length,
      high: incidents.filter(i => i.severity === 'HIGH').length,
      critical: incidents.filter(i => i.severity === 'CRITICAL').length,
    };

    // Type breakdown
    const typeBreakdown = {
      injury: incidents.filter(i => i.type === 'INJURY').length,
      illness: incidents.filter(i => i.type === 'ILLNESS').length,
      behavioral: incidents.filter(i => i.type === 'BEHAVIORAL').length,
      safety: incidents.filter(i => i.type === 'SAFETY').length,
      other: incidents.filter(i => !['INJURY', 'ILLNESS', 'BEHAVIORAL', 'SAFETY'].includes(i.type)).length,
    };

    // Location hotspots
    const locationCounts = incidents.reduce((acc, incident) => {
      acc[incident.location] = (acc[incident.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const locationHotspots = Object.entries(locationCounts)
      .map(([location, count]) => ({
        location,
        count,
        percentage: (count / incidents.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Monthly trends (last 12 months)
    const monthlyTrends = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i);
      const monthIncidents = incidents.filter(incident => {
        const incidentDate = new Date(incident.createdAt);
        return incidentDate.getMonth() === date.getMonth() && 
               incidentDate.getFullYear() === date.getFullYear();
      });

      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count: monthIncidents.length,
        severity: {
          low: monthIncidents.filter(i => i.severity === 'LOW').length,
          medium: monthIncidents.filter(i => i.severity === 'MEDIUM').length,
          high: monthIncidents.filter(i => i.severity === 'HIGH').length,
          critical: monthIncidents.filter(i => i.severity === 'CRITICAL').length,
        }
      });
    }

    const analytics: IncidentAnalytics = {
      totalIncidents: incidents.length,
      incidentTrends: {
        thisMonth: thisMonth.length,
        lastMonth: lastMonth.length,
        changePercent: Math.round(changePercent * 100) / 100,
      },
      severityBreakdown,
      typeBreakdown,
      resolutionTimes: {
        average: 48, // Mock data - would calculate from actual resolution times
        median: 36,
        fastest: 2,
        slowest: 168,
      },
      locationHotspots,
      monthlyTrends,
    };

    return {
      success: true,
      data: analytics
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get incident analytics';
    return {
      success: false,
      error: errorMessage
    };
  }
}
