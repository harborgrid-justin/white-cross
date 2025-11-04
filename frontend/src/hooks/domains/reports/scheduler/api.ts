/**
 * Report Scheduler API Functions
 *
 * API layer for report scheduling operations.
 *
 * @module hooks/domains/reports/scheduler/api
 */

'use client';

import type { ReportSchedule } from '@/types/schemas/reports.schema';
import type {
  CreateScheduleRequest,
  UpdateScheduleRequest,
  ScheduleExecutionHistory
} from './types';

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetches report schedules
 */
export async function fetchSchedules(definitionId?: string): Promise<ReportSchedule[]> {
  const url = definitionId
    ? `/api/reports/schedules?definitionId=${definitionId}`
    : '/api/reports/schedules';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch schedules' }));
    throw new Error(error.message || 'Failed to fetch report schedules');
  }

  return response.json();
}

/**
 * Creates a new report schedule
 */
export async function createScheduleAPI(request: CreateScheduleRequest): Promise<ReportSchedule> {
  const response = await fetch('/api/reports/schedules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create schedule' }));
    throw new Error(error.message || 'Failed to create report schedule');
  }

  return response.json();
}

/**
 * Updates an existing report schedule
 */
export async function updateScheduleAPI(request: UpdateScheduleRequest): Promise<ReportSchedule> {
  const { id, ...data } = request;

  const response = await fetch(`/api/reports/schedules/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update schedule' }));
    throw new Error(error.message || 'Failed to update report schedule');
  }

  return response.json();
}

/**
 * Deletes a report schedule
 */
export async function deleteScheduleAPI(id: string): Promise<void> {
  const response = await fetch(`/api/reports/schedules/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete schedule' }));
    throw new Error(error.message || 'Failed to delete report schedule');
  }
}

/**
 * Runs a schedule immediately (manual trigger)
 */
export async function runScheduleNowAPI(id: string): Promise<void> {
  const response = await fetch(`/api/reports/schedules/${id}/run`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to run schedule' }));
    throw new Error(error.message || 'Failed to run report schedule');
  }
}

/**
 * Fetches schedule execution history
 */
export async function fetchExecutionHistory(scheduleId: string): Promise<ScheduleExecutionHistory[]> {
  const response = await fetch(`/api/reports/schedules/${scheduleId}/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch history' }));
    throw new Error(error.message || 'Failed to fetch execution history');
  }

  return response.json();
}
