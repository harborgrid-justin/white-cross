/**
 * Report Scheduler Types
 *
 * Type definitions for report scheduling functionality.
 *
 * @module hooks/domains/reports/scheduler/types
 */

'use client';

import type {
  ReportSchedule,
  ScheduleFrequency,
  DeliveryConfig,
  ReportParameters
} from '@/types/schemas/reports.schema';

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface CreateScheduleRequest {
  definitionId: string;
  name: string;
  description?: string;
  frequency: ScheduleFrequency;
  parameters: ReportParameters;
  delivery: DeliveryConfig;
  startDate?: string;
  endDate?: string;
}

export interface UpdateScheduleRequest extends Partial<CreateScheduleRequest> {
  id: string;
}

// ============================================================================
// HOOK OPTIONS & RESULTS
// ============================================================================

export interface UseSchedulesOptions {
  definitionId?: string;
  enabled?: boolean;
}

export interface UseSchedulesResult {
  schedules: ReportSchedule[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  createSchedule: (request: CreateScheduleRequest) => Promise<ReportSchedule>;
  updateSchedule: (request: UpdateScheduleRequest) => Promise<ReportSchedule>;
  deleteSchedule: (id: string) => Promise<void>;
  toggleSchedule: (id: string, enabled: boolean) => Promise<ReportSchedule>;
  runScheduleNow: (id: string) => Promise<void>;
  refetch: () => void;
}

// ============================================================================
// HISTORY TYPES
// ============================================================================

export interface ScheduleExecutionHistory {
  id: string;
  scheduleId: string;
  executedAt: string;
  status: 'success' | 'failed';
  error?: string;
  reportId?: string;
}
