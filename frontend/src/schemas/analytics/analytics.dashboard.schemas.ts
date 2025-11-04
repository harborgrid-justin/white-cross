/**
 * Analytics Dashboard Schemas
 *
 * Dashboard configuration schemas including widget layouts, chart types,
 * and dashboard metadata.
 *
 * @module analytics.dashboard.schemas
 */

import { z } from 'zod';
import { metricQuerySchema } from './analytics.query.schemas';

/**
 * Widget Type Enum
 */
export const widgetTypeSchema = z.enum([
  'metric',
  'chart',
  'table',
  'gauge',
  'progress',
  'list',
]);

export type WidgetType = z.infer<typeof widgetTypeSchema>;

/**
 * Chart Type Enum
 */
export const chartTypeSchema = z.enum([
  'line',
  'bar',
  'pie',
  'doughnut',
  'area',
  'scatter',
]);

export type ChartType = z.infer<typeof chartTypeSchema>;

/**
 * Widget Position Schema
 */
export const widgetPositionSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  width: z.number().int().min(1).max(12),
  height: z.number().int().min(1).max(12),
});

export type WidgetPosition = z.infer<typeof widgetPositionSchema>;

/**
 * Dashboard Widget Schema
 */
export const dashboardWidgetSchema = z.object({
  id: z.string(),
  type: widgetTypeSchema,
  title: z.string(),
  query: metricQuerySchema,
  chartType: chartTypeSchema.optional(),
  position: widgetPositionSchema,
  refreshInterval: z.number().int().min(0).optional(), // seconds, 0 = no auto-refresh
});

export type DashboardWidget = z.infer<typeof dashboardWidgetSchema>;

/**
 * Dashboard Layout Enum
 */
export const dashboardLayoutSchema = z.enum(['grid', 'flex']);

export type DashboardLayout = z.infer<typeof dashboardLayoutSchema>;

/**
 * Analytics Dashboard Configuration Schema
 */
export const dashboardConfigSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Dashboard name is required').max(100),
  description: z.string().max(500).optional(),
  widgets: z.array(dashboardWidgetSchema),
  layout: dashboardLayoutSchema.default('grid'),
  isPublic: z.boolean().default(false),
  createdBy: z.string().optional(),
});

export type DashboardConfig = z.infer<typeof dashboardConfigSchema>;
