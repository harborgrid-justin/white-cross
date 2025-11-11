/**
 * @fileoverview Report Scheduler Types
 * 
 * Type definitions for the report scheduling system including schedules,
 * configurations, recipients, and execution history.
 */

/**
 * Schedule frequency options
 */
export type ScheduleFrequency = 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

/**
 * Schedule status types
 */
export type ScheduleStatus = 'active' | 'paused' | 'stopped' | 'completed' | 'failed' | 'pending';

/**
 * Day of week options
 */
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/**
 * Month options
 */
export type Month = 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';

/**
 * Schedule configuration interface
 */
export interface ScheduleConfig {
  frequency: ScheduleFrequency;
  time: string; // HH:MM format
  timezone: string;
  daysOfWeek?: DayOfWeek[];
  dayOfMonth?: number;
  month?: Month;
  endDate?: string;
  maxExecutions?: number;
}

/**
 * Recipient interface
 */
export interface Recipient {
  id: string;
  name: string;
  email: string;
  type: 'user' | 'group' | 'external';
  department?: string;
  role?: string;
}

/**
 * Report schedule interface
 */
export interface ReportSchedule {
  id: string;
  reportId: string;
  reportName: string;
  reportCategory: string;
  name: string;
  description: string;
  status: ScheduleStatus;
  config: ScheduleConfig;
  recipients: Recipient[];
  format: 'pdf' | 'excel' | 'csv' | 'json';
  includeCharts: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  nextRun?: string;
  executionCount: number;
  successCount: number;
  failureCount: number;
  tags: string[];
}

/**
 * Execution history interface
 */
export interface ExecutionHistory {
  id: string;
  scheduleId: string;
  executedAt: string;
  status: 'success' | 'failed' | 'partial';
  duration: number;
  recordCount?: number;
  fileSize?: number;
  errorMessage?: string;
  recipients: string[];
}

/**
 * Props for the ReportScheduler component
 */
export interface ReportSchedulerProps {
  /** List of report schedules */
  schedules?: ReportSchedule[];
  /** Available recipients */
  availableRecipients?: Recipient[];
  /** Execution history */
  executionHistory?: ExecutionHistory[];
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Create schedule handler */
  onCreateSchedule?: (schedule: Omit<ReportSchedule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'successCount' | 'failureCount'>) => void;
  /** Update schedule handler */
  onUpdateSchedule?: (id: string, updates: Partial<ReportSchedule>) => void;
  /** Delete schedule handler */
  onDeleteSchedule?: (id: string) => void;
  /** Start schedule handler */
  onStartSchedule?: (id: string) => void;
  /** Pause schedule handler */
  onPauseSchedule?: (id: string) => void;
  /** Stop schedule handler */
  onStopSchedule?: (id: string) => void;
  /** Run schedule now handler */
  onRunNow?: (id: string) => void;
  /** View execution history handler */
  onViewHistory?: (scheduleId: string) => void;
}
