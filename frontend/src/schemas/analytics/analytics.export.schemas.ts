/**
 * Analytics Export and Analysis Schemas
 *
 * Schemas for data export configurations, trend analysis, and prediction settings.
 *
 * @module analytics.export.schemas
 */

import { z } from 'zod';

/**
 * Export Format Enum
 */
export const exportFormatSchema = z.enum(['CSV', 'EXCEL', 'PDF']);

export type ExportFormat = z.infer<typeof exportFormatSchema>;

/**
 * Page Size Enum
 */
export const pageSizeSchema = z.enum(['A4', 'LETTER', 'LEGAL']);

export type PageSize = z.infer<typeof pageSizeSchema>;

/**
 * Page Orientation Enum
 */
export const pageOrientationSchema = z.enum(['portrait', 'landscape']);

export type PageOrientation = z.infer<typeof pageOrientationSchema>;

/**
 * Export Configuration Schema
 */
export const exportConfigSchema = z.object({
  format: exportFormatSchema,
  filename: z.string().optional(),
  includeCharts: z.boolean().optional().default(false),
  includeMetadata: z.boolean().optional().default(true),
  pageSize: pageSizeSchema.optional().default('A4'),
  orientation: pageOrientationSchema.optional().default('portrait'),
});

export type ExportConfig = z.infer<typeof exportConfigSchema>;

/**
 * Trend Type Enum
 */
export const trendTypeSchema = z.enum([
  'linear',
  'exponential',
  'polynomial',
  'movingAverage',
]);

export type TrendType = z.infer<typeof trendTypeSchema>;

/**
 * Trend Data Point Schema
 */
export const trendDataPointSchema = z.object({
  date: z.string(),
  value: z.number(),
});

export type TrendDataPoint = z.infer<typeof trendDataPointSchema>;

/**
 * Trend Analysis Configuration Schema
 */
export const trendAnalysisSchema = z.object({
  // Data for trend analysis
  data: z.array(trendDataPointSchema),

  // Trend type
  trendType: trendTypeSchema.default('linear'),

  // Prediction settings
  predictFuture: z.boolean().optional().default(false),
  predictionPeriods: z.number().int().min(1).max(90).optional().default(7),

  // Moving average settings (if applicable)
  movingAveragePeriod: z.number().int().min(2).max(30).optional().default(7),

  // Anomaly detection
  detectAnomalies: z.boolean().optional().default(false),
  anomalyThreshold: z.number().min(1).max(5).optional().default(2), // Standard deviations
});

export type TrendAnalysis = z.infer<typeof trendAnalysisSchema>;
