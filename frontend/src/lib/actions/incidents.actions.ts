/**
 * Incident Actions
 * Server actions for comprehensive incident management including witnesses, follow-ups, and analytics
 */

'use server';

import { revalidatePath } from 'next/cache';
import { serverGet, serverPost, serverPut, serverPatch, serverDelete } from '@/lib/api/nextjs-client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface IncidentReport {
  id: string;
  studentId: string;
  reportedById: string;
  type: 'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'MEDICATION_ERROR' | 'ALLERGIC_REACTION' | 'EMERGENCY' | 'SAFETY' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'DRAFT' | 'PENDING_REVIEW' | 'UNDER_INVESTIGATION' | 'REQUIRES_ACTION' | 'RESOLVED' | 'CLOSED';
  description: string;
  location: string;
  witnesses: string[];
  actionsTaken: string;
  parentNotified: boolean;
  parentNotificationMethod?: string;
  parentNotifiedAt?: string;
  followUpRequired: boolean;
  followUpNotes?: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentsResponse {
  incidents: IncidentReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  summary?: {
    totalIncidents: number;
    criticalCount: number;
    pendingFollowUp: number;
  };
}

export async function getIncidents(filters?: {
  page?: number;
  limit?: number;
  type?: string;
  severity?: string;
  status?: string;
  studentId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<IncidentsResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.severity) queryParams.append('severity', filters.severity);
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.studentId) queryParams.append('studentId', filters.studentId);
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

    const url = `${API_BASE}/api/incident-report?${queryParams.toString()}`;
    
    const response = await serverGet<IncidentsResponse>(url, {
      cache: 'no-store'
    });

    return response;
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return {
      incidents: [],
      pagination: {
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        total: 0,
        pages: 0
      }
    };
  }
}

export async function getIncident(id: string): Promise<IncidentReport | null> {
  try {
    const url = `${API_BASE}/api/incident-report/${id}`;
    
    const response = await serverGet<IncidentReport>(url, {
      cache: 'no-store'
    });

    return response;
  } catch (error) {
    console.error(`Error fetching incident ${id}:`, error);
    return null;
  }
}

export async function createIncident(data: Partial<IncidentReport>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report`;
    
    const response = await serverPost<IncidentReport>(url, data, {
      cache: 'no-store'
    });

    revalidatePath('/incidents');
    
    return { success: true, id: response.id };
  } catch (error) {
    const err = error as Error;
    console.error('Error creating incident:', err);
    return { 
      success: false, 
      error: err.message || 'Failed to create incident report' 
    };
  }
}

export async function updateIncident(id: string, data: Partial<IncidentReport>): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${id}`;
    
    await serverPut(url, data, {
      cache: 'no-store'
    });

    revalidatePath('/incidents');
    revalidatePath(`/incidents/${id}`);
    
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error(`Error updating incident ${id}:`, err);
    return { 
      success: false, 
      error: err.message || 'Failed to update incident report' 
    };
  }
}

export async function deleteIncident(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${id}`;
    
    await serverDelete(url, {
      cache: 'no-store'
    });

    revalidatePath('/incidents');
    
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error(`Error deleting incident ${id}:`, err);
    return { 
      success: false, 
      error: err.message || 'Failed to delete incident report' 
    };
  }
}

export interface IncidentAnalytics {
  totalIncidents: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  bySeverity: Record<string, number>;
}

export async function getIncidentAnalytics(filters?: {
  dateFrom?: string;
  dateTo?: string;
  studentId?: string;
}): Promise<IncidentAnalytics> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);
    if (filters?.studentId) queryParams.append('studentId', filters.studentId);

    const url = `${API_BASE}/api/incident-report/statistics?${queryParams.toString()}`;
    
    const response = await serverGet<IncidentAnalytics>(url, {
      cache: 'no-store'
    });

    return response;
  } catch (error) {
    console.error('Error fetching incident analytics:', error);
    return { 
      totalIncidents: 0, 
      byType: {}, 
      byStatus: {},
      bySeverity: {} 
    };
  }
}

// ==========================================
// INCIDENT-SPECIFIC OPERATIONS
// ==========================================

export async function getIncidentsRequiringFollowUp(): Promise<IncidentReport[]> {
  try {
    const url = `${API_BASE}/api/incident-report/follow-up/required`;
    const response = await serverGet<IncidentReport[]>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error('Error fetching incidents requiring follow-up:', error);
    return [];
  }
}

export async function getStudentRecentIncidents(studentId: string, limit: number = 5): Promise<IncidentReport[]> {
  try {
    const url = `${API_BASE}/api/incident-report/student/${studentId}/recent?limit=${limit}`;
    const response = await serverGet<IncidentReport[]>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error(`Error fetching recent incidents for student ${studentId}:`, error);
    return [];
  }
}

export async function addFollowUpNotes(
  incidentId: string,
  notes: string,
  completedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/follow-up-notes`;
    await serverPost(url, { notes, completedBy }, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error adding follow-up notes:', err);
    return { success: false, error: err.message };
  }
}

export async function markParentNotified(
  incidentId: string,
  method: string,
  notifiedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/parent-notified`;
    await serverPost(url, { method, notifiedBy }, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error marking parent notified:', err);
    return { success: false, error: err.message };
  }
}

export async function addEvidence(
  incidentId: string,
  evidenceType: 'photo' | 'video' | 'attachment',
  evidenceUrls: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/evidence`;
    await serverPost(url, { evidenceType, evidenceUrls }, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error adding evidence:', err);
    return { success: false, error: err.message };
  }
}

export async function updateInsuranceClaim(
  incidentId: string,
  claimNumber: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/insurance`;
    await serverPatch(url, { claimNumber, status }, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error updating insurance claim:', err);
    return { success: false, error: err.message };
  }
}

export async function updateComplianceStatus(
  incidentId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/compliance`;
    await serverPatch(url, { status }, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error updating compliance status:', err);
    return { success: false, error: err.message };
  }
}

export async function notifyEmergencyContacts(incidentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/notify-emergency`;
    await serverPost(url, {}, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error notifying emergency contacts:', err);
    return { success: false, error: err.message };
  }
}

export async function notifyParent(
  incidentId: string,
  method: string,
  notifiedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/notify-parent`;
    await serverPost(url, { method, notifiedBy }, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error notifying parent:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// FOLLOW-UP ACTIONS
// ==========================================

export interface FollowUpAction {
  id: string;
  incidentId: string;
  actionType: string;
  description: string;
  assignedTo?: string;
  dueDate?: string;
  status: string;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getFollowUpActions(incidentId: string): Promise<FollowUpAction[]> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/follow-up-actions`;
    const response = await serverGet<FollowUpAction[]>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error(`Error fetching follow-up actions for incident ${incidentId}:`, error);
    return [];
  }
}

export async function addFollowUpAction(
  incidentId: string,
  data: Partial<FollowUpAction>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/follow-up-action`;
    const response = await serverPost<FollowUpAction>(url, data, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    revalidatePath(`/incidents/${incidentId}/follow-up`);
    return { success: true, id: response.id };
  } catch (error) {
    const err = error as Error;
    console.error('Error adding follow-up action:', err);
    return { success: false, error: err.message };
  }
}

export async function updateFollowUpAction(
  actionId: string,
  data: Partial<FollowUpAction>
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/follow-up-action/${actionId}`;
    await serverPatch(url, data, { cache: 'no-store' });
    revalidatePath('/incidents');
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error(`Error updating follow-up action ${actionId}:`, err);
    return { success: false, error: err.message };
  }
}

export async function deleteFollowUpAction(actionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/follow-up-action/${actionId}`;
    await serverDelete(url, { cache: 'no-store' });
    revalidatePath('/incidents');
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error(`Error deleting follow-up action ${actionId}:`, err);
    return { success: false, error: err.message };
  }
}

export async function getOverdueActions(): Promise<FollowUpAction[]> {
  try {
    const url = `${API_BASE}/api/incident-report/follow-up-actions/overdue`;
    const response = await serverGet<FollowUpAction[]>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error('Error fetching overdue actions:', error);
    return [];
  }
}

export async function getUrgentActions(): Promise<FollowUpAction[]> {
  try {
    const url = `${API_BASE}/api/incident-report/follow-up-actions/urgent`;
    const response = await serverGet<FollowUpAction[]>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error('Error fetching urgent actions:', error);
    return [];
  }
}

export async function getUserPendingActions(userId: string): Promise<FollowUpAction[]> {
  try {
    const url = `${API_BASE}/api/incident-report/follow-up-actions/user/${userId}`;
    const response = await serverGet<FollowUpAction[]>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error(`Error fetching pending actions for user ${userId}:`, error);
    return [];
  }
}

export interface FollowUpStatistics {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export async function getFollowUpStatistics(filters?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<FollowUpStatistics> {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

    const url = `${API_BASE}/api/incident-report/follow-up-actions/statistics?${queryParams.toString()}`;
    const response = await serverGet<FollowUpStatistics>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error('Error fetching follow-up statistics:', error);
    return { total: 0, completed: 0, pending: 0, overdue: 0 };
  }
}

// ==========================================
// WITNESS STATEMENTS
// ==========================================

export interface WitnessStatement {
  id: string;
  incidentId: string;
  witnessName: string;
  witnessType: string;
  contactInfo?: string;
  statement: string;
  statementDate: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getWitnessStatements(incidentId: string): Promise<WitnessStatement[]> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/witness-statements`;
    const response = await serverGet<WitnessStatement[]>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error(`Error fetching witness statements for incident ${incidentId}:`, error);
    return [];
  }
}

export async function addWitnessStatement(
  incidentId: string,
  data: Partial<WitnessStatement>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/witness-statement`;
    const response = await serverPost<WitnessStatement>(url, data, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    revalidatePath(`/incidents/${incidentId}/witnesses`);
    return { success: true, id: response.id };
  } catch (error) {
    const err = error as Error;
    console.error('Error adding witness statement:', err);
    return { success: false, error: err.message };
  }
}

export async function updateWitnessStatement(
  statementId: string,
  data: Partial<WitnessStatement>
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/witness-statement/${statementId}`;
    await serverPatch(url, data, { cache: 'no-store' });
    revalidatePath('/incidents');
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error(`Error updating witness statement ${statementId}:`, err);
    return { success: false, error: err.message };
  }
}

export async function verifyWitnessStatement(
  statementId: string,
  verifiedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/witness-statement/${statementId}/verify`;
    await serverPost(url, { verifiedBy }, { cache: 'no-store' });
    revalidatePath('/incidents');
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error(`Error verifying witness statement ${statementId}:`, err);
    return { success: false, error: err.message };
  }
}

export async function deleteWitnessStatement(statementId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/witness-statement/${statementId}`;
    await serverDelete(url, { cache: 'no-store' });
    revalidatePath('/incidents');
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error(`Error deleting witness statement ${statementId}:`, err);
    return { success: false, error: err.message };
  }
}

export async function getUnverifiedStatements(): Promise<WitnessStatement[]> {
  try {
    const url = `${API_BASE}/api/incident-report/witness-statements/unverified`;
    const response = await serverGet<WitnessStatement[]>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error('Error fetching unverified statements:', error);
    return [];
  }
}

// ==========================================
// STATISTICS & ANALYTICS
// ==========================================

export async function getIncidentsByType(filters?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<Record<string, number>> {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

    const url = `${API_BASE}/api/incident-report/statistics/by-type?${queryParams.toString()}`;
    const response = await serverGet<Record<string, number>>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error('Error fetching incidents by type:', error);
    return {};
  }
}

export async function getIncidentsBySeverity(filters?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<Record<string, number>> {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

    const url = `${API_BASE}/api/incident-report/statistics/by-severity?${queryParams.toString()}`;
    const response = await serverGet<Record<string, number>>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error('Error fetching incidents by severity:', error);
    return {};
  }
}

export interface SeverityTrend {
  date: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export async function getSeverityTrends(dateFrom: string, dateTo: string): Promise<SeverityTrend[]> {
  try {
    const queryParams = new URLSearchParams({
      dateFrom,
      dateTo
    });

    const url = `${API_BASE}/api/incident-report/statistics/severity-trends?${queryParams.toString()}`;
    const response = await serverGet<SeverityTrend[]>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error('Error fetching severity trends:', error);
    return [];
  }
}

// ==========================================
// CONVENIENCE ALIASES FOR PAGE COMPONENTS
// ==========================================

/**
 * Alias for getIncidents - used by many page components
 */
export async function listIncidents(filters?: {
  page?: number;
  limit?: number;
  type?: string;
  severity?: string;
  status?: string;
  studentId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<IncidentReport[]> {
  const response = await getIncidents(filters);
  return response.incidents;
}

/**
 * Alias for getFollowUpActions - used by follow-up page components
 */
export async function listFollowUpActions(incidentId: string): Promise<FollowUpAction[]> {
  return getFollowUpActions(incidentId);
}

/**
 * Get trending incidents analysis
 */
export async function getTrendingIncidents(period: 'week' | 'month' | 'quarter' = 'month'): Promise<{
  success: boolean;
  data?: {
    increasingTypes: Array<{ type: string; count: number; change: number }>;
    decreasingTypes: Array<{ type: string; count: number; change: number }>;
    hotspots: Array<{ location: string; count: number }>;
    patterns: Array<{ pattern: string; occurrences: number }>;
  };
  error?: string;
}> {
  try {
    // Calculate date range based on period
    const now = new Date();
    const dateFrom = new Date();
    
    switch (period) {
      case 'week':
        dateFrom.setDate(now.getDate() - 7);
        break;
      case 'month':
        dateFrom.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        dateFrom.setMonth(now.getMonth() - 3);
        break;
    }

    // Get analytics for current and previous period
    const currentAnalytics = await getIncidentAnalytics({
      dateFrom: dateFrom.toISOString(),
      dateTo: now.toISOString()
    });

    const previousFrom = new Date(dateFrom);
    previousFrom.setTime(previousFrom.getTime() - (now.getTime() - dateFrom.getTime()));
    
    const previousAnalytics = await getIncidentAnalytics({
      dateFrom: previousFrom.toISOString(),
      dateTo: dateFrom.toISOString()
    });

    if (!currentAnalytics || !previousAnalytics) {
      return { success: false, error: 'Failed to fetch analytics data' };
    }

    // Calculate trending types
    const increasingTypes: Array<{ type: string; count: number; change: number }> = [];
    const decreasingTypes: Array<{ type: string; count: number; change: number }> = [];

    Object.entries(currentAnalytics.byType).forEach(([type, currentCount]) => {
      const previousCount = previousAnalytics.byType[type] || 0;
      const change = previousCount > 0 ? ((currentCount - previousCount) / previousCount) * 100 : 0;
      
      if (change > 10) {
        increasingTypes.push({ type, count: currentCount, change });
      } else if (change < -10) {
        decreasingTypes.push({ type, count: currentCount, change });
      }
    });

    // Get location hotspots from current period
    const incidents = await getIncidents({
      dateFrom: dateFrom.toISOString(),
      dateTo: now.toISOString()
    });

    const locationCounts: Record<string, number> = {};
    incidents.incidents.forEach(incident => {
      locationCounts[incident.location] = (locationCounts[incident.location] || 0) + 1;
    });

    const hotspots = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Identify patterns (simplified)
    const patterns: Array<{ pattern: string; occurrences: number }> = [];
    const highSeverityCount = Object.values(currentAnalytics.bySeverity).reduce((sum, val) => sum + val, 0);
    
    if (highSeverityCount > 10) {
      patterns.push({
        pattern: 'High incident frequency detected',
        occurrences: highSeverityCount
      });
    }

    return {
      success: true,
      data: {
        increasingTypes: increasingTypes.sort((a, b) => b.change - a.change),
        decreasingTypes: decreasingTypes.sort((a, b) => a.change - b.change),
        hotspots,
        patterns
      }
    };
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching trending incidents:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// MISSING ACTION FUNCTIONS
// ==========================================

/**
 * Create a new follow-up action
 * Wrapper function for addFollowUpAction to match component expectations
 */
export async function createFollowUpAction(
  data: { incidentId: string } & Partial<FollowUpAction>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { incidentId, ...actionData } = data;
    return await addFollowUpAction(incidentId, actionData);
  } catch (error) {
    const err = error as Error;
    console.error('Error creating follow-up action:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Submit a witness statement
 * Wrapper function for addWitnessStatement to match component expectations
 */
export async function submitWitnessStatement(
  data: { incidentId: string } & Partial<WitnessStatement>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { incidentId, ...statementData } = data;
    return await addWitnessStatement(incidentId, statementData);
  } catch (error) {
    const err = error as Error;
    console.error('Error submitting witness statement:', err);
    return { success: false, error: err.message };
  }
}
