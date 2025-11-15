/**
 * Incident CRUD Operations
 * Basic create, read, update, delete operations for incidents
 */

'use server';

import { revalidatePath } from 'next/cache';
import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import type { IncidentReport, IncidentsResponse } from './incidents.types';

// ==========================================
// INCIDENT CRUD OPERATIONS
// ==========================================

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

    const response = await serverGet<IncidentsResponse>(
      API_ENDPOINTS.INCIDENTS.BASE,
      Object.fromEntries(queryParams.entries()) as Record<string, string | number | boolean>,
      {
        cache: 'no-store'
      }
    );

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
    const response = await serverGet<IncidentReport>(
      API_ENDPOINTS.INCIDENTS.BY_ID(id),
      undefined,
      {
        cache: 'no-store'
      }
    );

    return response;
  } catch (error) {
    console.error(`Error fetching incident ${id}:`, error);
    return null;
  }
}

export async function createIncident(data: Partial<IncidentReport>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await serverPost<IncidentReport>(
      API_ENDPOINTS.INCIDENTS.BASE,
      data,
      {
        cache: 'no-store'
      }
    );

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
    await serverPut(
      API_ENDPOINTS.INCIDENTS.BY_ID(id),
      data,
      {
        cache: 'no-store'
      }
    );

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
    await serverDelete(
      API_ENDPOINTS.INCIDENTS.BY_ID(id),
      {
        cache: 'no-store'
      }
    );

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

// ==========================================
// INCIDENT RETRIEVAL HELPERS
// ==========================================

export async function getIncidentsRequiringFollowUp(): Promise<IncidentReport[]> {
  try {
    const response = await serverGet<IncidentReport[]>(
      `${API_ENDPOINTS.INCIDENTS.BASE}/follow-up/required`,
      undefined,
      {
        cache: 'no-store'
      }
    );
    return response;
  } catch (error) {
    console.error('Error fetching incidents requiring follow-up:', error);
    return [];
  }
}

export async function getStudentRecentIncidents(studentId: string, limit: number = 5): Promise<IncidentReport[]> {
  try {
    const response = await serverGet<IncidentReport[]>(
      API_ENDPOINTS.INCIDENTS.BY_STUDENT(studentId) + `/recent?limit=${limit}`,
      undefined,
      {
        cache: 'no-store'
      }
    );
    return response;
  } catch (error) {
    console.error(`Error fetching recent incidents for student ${studentId}:`, error);
    return [];
  }
}

// ==========================================
// CONVENIENCE ALIASES
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
