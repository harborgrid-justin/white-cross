/**
 * Reports Filter and Request Validation Schemas
 *
 * Schemas for filtering reports, downloading, sharing, and managing report access.
 * Provides validation for report history queries and user interactions.
 *
 * @module reports.filters.schemas
 */

import { z } from 'zod';
import { dateRangeSchema } from '../analytics/analytics.schemas';
import {
  reportTypeSchema,
  reportFormatSchema,
  reportExecutionStatusSchema,
} from './reports.base.schemas';

/**
 * Report History Filter Schema
 */
export const reportHistoryFilterSchema = z.object({
  reportTypes: z.array(reportTypeSchema).optional(),
  formats: z.array(reportFormatSchema).optional(),
  status: z.array(reportExecutionStatusSchema).optional(),
  dateRange: dateRangeSchema.optional(),
  createdBy: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
  offset: z.number().int().min(0).optional().default(0),
});

export type ReportHistoryFilter = z.infer<typeof reportHistoryFilterSchema>;

/**
 * Report Download Request Schema
 */
export const reportDownloadRequestSchema = z.object({
  reportId: z.string().uuid('Invalid report ID'),
  format: reportFormatSchema.optional(), // For format conversion
  expiryMinutes: z.number().int().min(1).max(60).optional().default(15),
});

export type ReportDownloadRequest = z.infer<typeof reportDownloadRequestSchema>;

/**
 * Report Share Schema
 */
export const reportShareSchema = z.object({
  reportId: z.string().uuid(),
  recipients: z.array(z.string().email()).min(1),
  message: z.string().max(500).optional(),
  expiryDays: z.number().int().min(1).max(30).optional().default(7),
  requireAuthentication: z.boolean().default(true),
  sharedBy: z.string().optional(),
});

export type ReportShare = z.infer<typeof reportShareSchema>;
