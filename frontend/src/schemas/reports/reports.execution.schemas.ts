/**
 * Reports Execution Validation Schemas
 *
 * Schemas for tracking report generation execution, status, and results.
 * Handles execution history, progress tracking, and error reporting.
 *
 * @module reports.execution.schemas
 */

import { z } from 'zod';
import { reportConfigSchema } from './reports.config.schemas';
import { reportExecutionStatusSchema } from './reports.base.schemas';

/**
 * Report Execution Schema
 * Tracks report generation execution
 */
export const reportExecutionSchema = z.object({
  id: z.string().optional(),
  scheduleId: z.string().optional(),
  reportConfig: reportConfigSchema,
  status: reportExecutionStatusSchema,
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  duration: z.number().optional(), // milliseconds
  fileSize: z.number().optional(), // bytes
  filePath: z.string().optional(),
  downloadUrl: z.string().optional(),
  expiresAt: z.string().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }).optional(),
  metadata: z.object({
    rowCount: z.number().optional(),
    pageCount: z.number().optional(),
    chartCount: z.number().optional(),
  }).optional(),
  executedBy: z.string().optional(),
});

export type ReportExecution = z.infer<typeof reportExecutionSchema>;
