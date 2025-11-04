/**
 * Incident Follow-up Actions
 * Management of follow-up actions for incidents
 */

'use server';

import { revalidatePath } from 'next/cache';
import { serverGet, serverPost, serverPatch, serverDelete } from '@/lib/api/nextjs-client';
import type { FollowUpAction, FollowUpStatistics } from './incidents.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ==========================================
// FOLLOW-UP ACTION CRUD
// ==========================================

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

// ==========================================
// FOLLOW-UP ACTION QUERIES
// ==========================================

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

// ==========================================
// FOLLOW-UP STATISTICS
// ==========================================

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
// FOLLOW-UP NOTES
// ==========================================

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

// ==========================================
// CONVENIENCE WRAPPERS
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
 * Alias for getFollowUpActions - used by follow-up page components
 */
export async function listFollowUpActions(incidentId: string): Promise<FollowUpAction[]> {
  return getFollowUpActions(incidentId);
}
