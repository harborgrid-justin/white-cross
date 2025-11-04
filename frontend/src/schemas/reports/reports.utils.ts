/**
 * Reports Utility Functions
 *
 * Helper functions for validating, transforming, and processing report data.
 * Provides utilities for scheduling, date ranges, and data sanitization.
 *
 * @module reports.utils
 */

import { z } from 'zod';
import { cronExpressionSchema } from './reports.schedule.schemas';
import type { ReportSchedule } from './reports.schedule.schemas';

/**
 * Validate cron expression format
 */
export function validateCronExpression(expression: string): boolean {
  try {
    cronExpressionSchema.parse(expression);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate next run time from schedule
 */
export function calculateNextRun(schedule: ReportSchedule): Date {
  const now = new Date();
  const [hours, minutes] = schedule.time.split(':').map(Number);

  let nextRun = new Date(now);
  nextRun.setHours(hours, minutes, 0, 0);

  // If time has passed today, move to next occurrence
  if (nextRun <= now) {
    switch (schedule.frequency) {
      case 'DAILY':
        nextRun.setDate(nextRun.getDate() + 1);
        break;
      case 'WEEKLY':
        nextRun.setDate(nextRun.getDate() + 7);
        break;
      case 'MONTHLY':
        nextRun.setMonth(nextRun.getMonth() + 1);
        if (schedule.dayOfMonth) {
          nextRun.setDate(schedule.dayOfMonth);
        }
        break;
      case 'QUARTERLY':
        nextRun.setMonth(nextRun.getMonth() + 3);
        break;
      case 'YEARLY':
        nextRun.setFullYear(nextRun.getFullYear() + 1);
        break;
      // Add more complex logic for CUSTOM cron expressions
    }
  }

  return nextRun;
}

/**
 * Validate schedule timing consistency
 */
export function validateScheduleTiming(schedule: Partial<ReportSchedule>): boolean {
  if (!schedule.frequency) return false;

  switch (schedule.frequency) {
    case 'WEEKLY':
      return schedule.dayOfWeek !== undefined && schedule.dayOfWeek >= 0 && schedule.dayOfWeek <= 6;
    case 'MONTHLY':
      return schedule.dayOfMonth !== undefined && schedule.dayOfMonth >= 1 && schedule.dayOfMonth <= 31;
    case 'CUSTOM':
      return !!schedule.cronExpression && validateCronExpression(schedule.cronExpression);
    default:
      return true;
  }
}

/**
 * Generate date range from dynamic type
 */
export function generateDateRange(type: string): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  let startDate = '';

  switch (type) {
    case 'LAST_7_DAYS':
      startDate = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
      break;
    case 'LAST_30_DAYS':
      startDate = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
      break;
    case 'LAST_MONTH':
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      startDate = lastMonth.toISOString().split('T')[0];
      break;
    case 'CURRENT_MONTH':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      break;
    // Add more cases as needed
    default:
      startDate = endDate; // Fallback to today
  }

  return { startDate, endDate };
}

/**
 * Sanitize filename for safe file system operations
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9-_\.]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

/**
 * Validate email recipients list
 */
export function validateEmailRecipients(recipients: string[]): boolean {
  if (recipients.length === 0) return false;
  return recipients.every(email => z.string().email().safeParse(email).success);
}
