/**
 * @fileoverview Server Actions for Incident Management
 * @module actions/incidents
 *
 * Next.js Server Actions for incident CRUD operations, witness management, and follow-up tracking.
 * Legal-grade audit logging with tamper-proof trails for compliance.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { ActionResult } from './students.actions';
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

// ==========================================
// INCIDENT OPERATIONS
// ==========================================

/**
 * Create new incident report
 * Legal-grade audit logging for all incident creations
 */
export async function createIncident(
  data: CreateIncidentInput
): Promise<ActionResult<Incident>> {
  try {
    // Validate input
    const validatedData = CreateIncidentSchema.parse(data);

    // Create incident via API
    const response = await apiClient.post<Incident>(
      API_ENDPOINTS.INCIDENTS.BASE,
      {
        ...validatedData,
        // Auto-generate incident number on backend
        reportedDate: new Date().toISOString(),
      }
    );

    // Revalidate caches
    revalidateTag('incidents');
    revalidateTag(`student-incidents-${data.studentId}`);
    revalidatePath('/incidents');
    revalidatePath(`/students/${data.studentId}/incidents`);

    // Log audit trail (PHI access)
    await logIncidentAudit({
      action: 'INCIDENT_CREATE',
      incidentId: response.data.id!,
      severity: 'INFO',
      details: {
        type: data.type,
        severity: data.severity,
        studentId: data.studentId,
      },
    });

    return {
      success: true,
      data: response.data,
      message: 'Incident report created successfully',
    };
  } catch (error) {
    console.error('Create incident error:', error);

    // Log failed attempt
    await logIncidentAudit({
      action: 'INCIDENT_CREATE_FAILED',
      severity: 'ERROR',
      details: { error: String(error) },
    }).catch(() => {}); // Don't fail on audit log failure

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create incident report',
    };
  }
}

/**
 * Update existing incident
 * Enforces status workflow transitions
 */
export async function updateIncident(
  data: UpdateIncidentInput
): Promise<ActionResult<Incident>> {
  try {
    // Validate input
    const validatedData = UpdateIncidentSchema.parse(data);

    // If status is changing, validate transition
    if (data.status) {
      // Fetch current incident to check current status
      const currentIncident = await getIncident(data.id);
      if (currentIncident.success && currentIncident.data) {
        const isValid = isValidStatusTransition(
          currentIncident.data.status,
          data.status
        );
        if (!isValid) {
          return {
            success: false,
            error: `Invalid status transition from ${currentIncident.data.status} to ${data.status}`,
          };
        }
      }
    }

    // Update via API
    const response = await apiClient.patch<Incident>(
      `${API_ENDPOINTS.INCIDENTS.BASE}/${data.id}`,
      validatedData
    );

    // Revalidate caches
    revalidateTag('incidents');
    revalidateTag(`incident-${data.id}`);
    if (response.data.studentId) {
      revalidateTag(`student-incidents-${response.data.studentId}`);
    }
    revalidatePath('/incidents');
    revalidatePath(`/incidents/${data.id}`);

    // Log audit trail
    await logIncidentAudit({
      action: 'INCIDENT_UPDATE',
      incidentId: data.id,
      severity: 'INFO',
      details: {
        updatedFields: Object.keys(validatedData),
        statusChange: data.status ? { newStatus: data.status } : undefined,
      },
    });

    return {
      success: true,
      data: response.data,
      message: 'Incident report updated successfully',
    };
  } catch (error) {
    console.error('Update incident error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update incident report',
    };
  }
}

/**
 * Get incident by ID
 */
export async function getIncident(id: string): Promise<ActionResult<Incident>> {
  try {
    const response = await apiClient.get<Incident>(
      `${API_ENDPOINTS.INCIDENTS.BASE}/${id}`
    );

    // Log PHI access
    await logIncidentAudit({
      action: 'INCIDENT_VIEW',
      incidentId: id,
      severity: 'INFO',
      details: { accessType: 'view' },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get incident error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch incident',
    };
  }
}

/**
 * List incidents with filtering
 */
export async function listIncidents(
  filter?: IncidentFilter
): Promise<ActionResult<{ incidents: Incident[]; total: number; pages: number }>> {
  try {
    const response = await apiClient.get<{
      data: Incident[];
      total: number;
      pages: number;
    }>(API_ENDPOINTS.INCIDENTS.BASE, { params: filter });

    return {
      success: true,
      data: {
        incidents: response.data.data,
        total: response.data.total,
        pages: response.data.pages,
      },
    };
  } catch (error) {
    console.error('List incidents error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch incidents',
    };
  }
}

/**
 * Delete incident (soft delete)
 */
export async function deleteIncident(id: string): Promise<ActionResult<void>> {
  try {
    await apiClient.delete(`${API_ENDPOINTS.INCIDENTS.BASE}/${id}`);

    // Revalidate caches
    revalidateTag('incidents');
    revalidateTag(`incident-${id}`);
    revalidatePath('/incidents');

    // Log audit trail
    await logIncidentAudit({
      action: 'INCIDENT_DELETE',
      incidentId: id,
      severity: 'WARNING',
      details: { action: 'soft_delete' },
    });

    return {
      success: true,
      message: 'Incident report deleted successfully',
    };
  } catch (error) {
    console.error('Delete incident error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete incident',
    };
  }
}

// ==========================================
// WITNESS OPERATIONS
// ==========================================

/**
 * Add witness to incident
 */
export async function addWitness(
  data: CreateWitnessInput
): Promise<ActionResult<Witness>> {
  try {
    const validatedData = CreateWitnessSchema.parse(data);

    const response = await apiClient.post<Witness>(
      `${API_ENDPOINTS.INCIDENTS.BASE}/${data.incidentId}/witnesses`,
      validatedData
    );

    // Revalidate caches
    revalidateTag(`incident-witnesses-${data.incidentId}`);
    revalidatePath(`/incidents/${data.incidentId}/witnesses`);

    // Log audit
    await logIncidentAudit({
      action: 'WITNESS_ADD',
      incidentId: data.incidentId,
      severity: 'INFO',
      details: {
        witnessType: data.witnessType,
        witnessName: `${data.firstName} ${data.lastName}`,
      },
    });

    return {
      success: true,
      data: response.data,
      message: 'Witness added successfully',
    };
  } catch (error) {
    console.error('Add witness error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add witness',
    };
  }
}

/**
 * Submit witness statement
 * Creates tamper-proof hash for legal compliance
 */
export async function submitWitnessStatement(
  data: CreateStatementInput
): Promise<ActionResult<WitnessStatement>> {
  try {
    const validatedData = CreateStatementSchema.parse(data);

    // Create tamper-proof hash
    const statementHash = await createStatementHash({
      ...validatedData,
      submittedAt: new Date().toISOString(),
    });

    // Generate verification code
    const verificationCode = generateVerificationCode();

    const response = await apiClient.post<WitnessStatement>(
      `${API_ENDPOINTS.INCIDENTS.BASE}/${data.incidentId}/witnesses/${data.witnessId}/statement`,
      {
        ...validatedData,
        signatureHash: statementHash,
        verificationCode,
        submittedAt: new Date().toISOString(),
        status: 'SUBMITTED',
      }
    );

    // Revalidate caches
    revalidateTag(`witness-statement-${data.witnessId}`);
    revalidatePath(`/incidents/${data.incidentId}/witnesses/${data.witnessId}`);

    // Log audit with hash
    await logIncidentAudit({
      action: 'WITNESS_STATEMENT_SUBMIT',
      incidentId: data.incidentId,
      severity: 'INFO',
      details: {
        witnessId: data.witnessId,
        statementHash,
        verificationCode,
      },
    });

    return {
      success: true,
      data: response.data,
      message: 'Witness statement submitted successfully',
    };
  } catch (error) {
    console.error('Submit witness statement error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit statement',
    };
  }
}

/**
 * Verify witness statement
 */
export async function verifyWitnessStatement(
  statementId: string,
  verificationData: {
    method: string;
    notes?: string;
  }
): Promise<ActionResult<WitnessStatement>> {
  try {
    const response = await apiClient.patch<WitnessStatement>(
      `${API_ENDPOINTS.INCIDENTS.BASE}/statements/${statementId}/verify`,
      {
        ...verificationData,
        verifiedAt: new Date().toISOString(),
        status: 'VERIFIED',
      }
    );

    // Revalidate caches
    revalidateTag(`statement-${statementId}`);

    // Log audit
    await logIncidentAudit({
      action: 'WITNESS_STATEMENT_VERIFY',
      incidentId: response.data.incidentId,
      severity: 'INFO',
      details: {
        statementId,
        method: verificationData.method,
      },
    });

    return {
      success: true,
      data: response.data,
      message: 'Statement verified successfully',
    };
  } catch (error) {
    console.error('Verify statement error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify statement',
    };
  }
}

// ==========================================
// FOLLOW-UP ACTION OPERATIONS
// ==========================================

/**
 * Create follow-up action
 */
export async function createFollowUpAction(
  data: CreateFollowUpActionInput
): Promise<ActionResult<FollowUpAction>> {
  try {
    const validatedData = CreateFollowUpActionSchema.parse(data);

    const response = await apiClient.post<FollowUpAction>(
      `${API_ENDPOINTS.INCIDENTS.BASE}/${data.incidentId}/follow-up`,
      {
        ...validatedData,
        status: 'PENDING',
        percentComplete: 0,
        createdAt: new Date().toISOString(),
      }
    );

    // Revalidate caches
    revalidateTag(`incident-follow-ups-${data.incidentId}`);
    revalidatePath(`/incidents/${data.incidentId}/follow-up`);

    // Log audit
    await logIncidentAudit({
      action: 'FOLLOW_UP_CREATE',
      incidentId: data.incidentId,
      severity: 'INFO',
      details: {
        actionType: data.actionType,
        priority: data.priority,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate,
      },
    });

    return {
      success: true,
      data: response.data,
      message: 'Follow-up action created successfully',
    };
  } catch (error) {
    console.error('Create follow-up action error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create follow-up action',
    };
  }
}

/**
 * Update follow-up action progress
 */
export async function updateFollowUpProgress(
  data: UpdateProgressInput
): Promise<ActionResult<FollowUpAction>> {
  try {
    const validatedData = UpdateProgressSchema.parse(data);

    const response = await apiClient.patch<FollowUpAction>(
      `${API_ENDPOINTS.INCIDENTS.BASE}/follow-up/${data.followUpActionId}/progress`,
      {
        percentComplete: data.percentComplete,
        progressNote: {
          note: data.progressNote,
          createdAt: new Date().toISOString(),
          createdBy: data.updatedBy,
          percentComplete: data.percentComplete,
        },
        status: data.percentComplete === 100 ? 'COMPLETED' : 'IN_PROGRESS',
      }
    );

    // Revalidate caches
    revalidateTag(`follow-up-${data.followUpActionId}`);

    // Log audit
    await logIncidentAudit({
      action: 'FOLLOW_UP_PROGRESS_UPDATE',
      incidentId: response.data.incidentId,
      severity: 'INFO',
      details: {
        followUpActionId: data.followUpActionId,
        percentComplete: data.percentComplete,
      },
    });

    return {
      success: true,
      data: response.data,
      message: 'Progress updated successfully',
    };
  } catch (error) {
    console.error('Update follow-up progress error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update progress',
    };
  }
}

/**
 * Complete follow-up action
 */
export async function completeFollowUpAction(
  actionId: string,
  completionData: {
    completionNotes: string;
    completedBy: string;
    evidence?: Array<{
      type: string;
      filename: string;
      url: string;
      description?: string;
    }>;
  }
): Promise<ActionResult<FollowUpAction>> {
  try {
    const response = await apiClient.patch<FollowUpAction>(
      `${API_ENDPOINTS.INCIDENTS.BASE}/follow-up/${actionId}/complete`,
      {
        ...completionData,
        status: 'COMPLETED',
        percentComplete: 100,
        completionDate: new Date().toISOString(),
      }
    );

    // Revalidate caches
    revalidateTag(`follow-up-${actionId}`);

    // Log audit
    await logIncidentAudit({
      action: 'FOLLOW_UP_COMPLETE',
      incidentId: response.data.incidentId,
      severity: 'INFO',
      details: {
        followUpActionId: actionId,
        completedBy: completionData.completedBy,
        evidenceCount: completionData.evidence?.length ?? 0,
      },
    });

    return {
      success: true,
      data: response.data,
      message: 'Follow-up action completed successfully',
    };
  } catch (error) {
    console.error('Complete follow-up action error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete action',
    };
  }
}

/**
 * List follow-up actions for incident
 */
export async function listFollowUpActions(
  incidentId: string
): Promise<ActionResult<FollowUpAction[]>> {
  try {
    const response = await apiClient.get<FollowUpAction[]>(
      `${API_ENDPOINTS.INCIDENTS.BASE}/${incidentId}/follow-up`
    );

    // Check for overdue actions and auto-update status
    const actionsWithStatus = response.data.map(action => ({
      ...action,
      status: isOverdue(action) && action.status !== 'COMPLETED'
        ? 'OVERDUE' as FollowUpStatusEnum
        : action.status,
    }));

    return {
      success: true,
      data: actionsWithStatus,
    };
  } catch (error) {
    console.error('List follow-up actions error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch follow-up actions',
    };
  }
}

// ==========================================
// ANALYTICS OPERATIONS
// ==========================================

/**
 * Get incident analytics
 */
export async function getIncidentAnalytics(filters?: {
  startDate?: string;
  endDate?: string;
  type?: string;
}): Promise<ActionResult<{
  totalIncidents: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  byStatus: Record<string, number>;
  byLocation: Record<string, number>;
  trendData: Array<{ date: string; count: number }>;
  responseMetrics: {
    avgResponseTime: number;
    avgResolutionTime: number;
  };
}>> {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.INCIDENTS.BASE}/analytics`,
      { params: filters }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get incident analytics error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch analytics',
    };
  }
}

/**
 * Get trending incidents
 */
export async function getTrendingIncidents(
  period: 'week' | 'month' | 'quarter' = 'month'
): Promise<ActionResult<{
  increasingTypes: Array<{ type: string; change: number; count: number }>;
  hotspots: Array<{ location: string; count: number }>;
  patterns: Array<{ pattern: string; occurrences: number }>;
}>> {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.INCIDENTS.BASE}/trending`,
      { params: { period } }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get trending incidents error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch trending data',
    };
  }
}

// ==========================================
// AUDIT LOGGING
// ==========================================

/**
 * Legal-grade audit logging for incident operations
 * Tamper-proof logging with cryptographic hashing
 */
async function logIncidentAudit(event: {
  action: string;
  incidentId?: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  details: Record<string, any>;
}): Promise<void> {
  try {
    // Create audit log with timestamp and hash
    const timestamp = new Date().toISOString();
    const auditData = {
      ...event,
      timestamp,
      resourceType: 'INCIDENT',
      // Hash will be created on backend
    };

    await apiClient.post('/audit-logs', auditData);
  } catch (error) {
    // Log to console but don't fail the operation
    console.error('Audit log failed:', error);
  }
}
