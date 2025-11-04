/**
 * Analytics Domain Metrics Schemas
 *
 * Domain-specific metric query schemas for health, medications, appointments,
 * incidents, and inventory analytics.
 *
 * @module analytics.metrics.schemas
 */

import { z } from 'zod';
import { dateRangeSchema, aggregationPeriodSchema } from './analytics.base.schemas';

/**
 * Health Metrics Query Schema
 * Specific schema for health metrics analytics
 */
export const healthMetricsQuerySchema = z.object({
  dateRange: dateRangeSchema,
  metricTypes: z.array(z.enum([
    'bmi',
    'bloodPressure',
    'temperature',
    'heartRate',
    'height',
    'weight',
    'vision',
    'hearing',
  ])).optional(),
  ageGroups: z.array(z.string()).optional(),
  gradelevels: z.array(z.string()).optional(),
  aggregation: aggregationPeriodSchema.default('monthly'),
});

export type HealthMetricsQuery = z.infer<typeof healthMetricsQuerySchema>;

/**
 * Medication Compliance Query Schema
 */
export const medicationComplianceQuerySchema = z.object({
  dateRange: dateRangeSchema,
  medicationIds: z.array(z.string()).optional(),
  studentIds: z.array(z.string()).optional(),
  complianceThreshold: z.number().min(0).max(100).optional().default(80),
  aggregation: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
  includeBreakdown: z.boolean().optional().default(true),
});

export type MedicationComplianceQuery = z.infer<typeof medicationComplianceQuerySchema>;

/**
 * Appointment Statistics Query Schema
 */
export const appointmentStatisticsQuerySchema = z.object({
  dateRange: dateRangeSchema,
  appointmentTypes: z.array(z.enum([
    'checkup',
    'medication',
    'injury',
    'illness',
    'counseling',
    'other',
  ])).optional(),
  includeNoShows: z.boolean().optional().default(true),
  includeCancellations: z.boolean().optional().default(true),
  aggregation: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
});

export type AppointmentStatisticsQuery = z.infer<typeof appointmentStatisticsQuerySchema>;

/**
 * Incident Trends Query Schema
 */
export const incidentTrendsQuerySchema = z.object({
  dateRange: dateRangeSchema,
  incidentTypes: z.array(z.enum([
    'injury',
    'illness',
    'behavioral',
    'safety',
    'emergency',
    'other',
  ])).optional(),
  severityLevels: z.array(z.enum(['low', 'medium', 'high', 'critical'])).optional(),
  locations: z.array(z.string()).optional(),
  aggregation: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
  includeTrendAnalysis: z.boolean().optional().default(true),
});

export type IncidentTrendsQuery = z.infer<typeof incidentTrendsQuerySchema>;

/**
 * Inventory Analytics Query Schema
 */
export const inventoryAnalyticsQuerySchema = z.object({
  dateRange: dateRangeSchema,
  categories: z.array(z.string()).optional(),
  includeExpiring: z.boolean().optional().default(true),
  expiryThresholdDays: z.number().int().min(1).max(365).optional().default(30),
  includeLowStock: z.boolean().optional().default(true),
  lowStockThreshold: z.number().int().min(0).optional().default(10),
  aggregation: z.enum(['daily', 'weekly', 'monthly']).default('monthly'),
});

export type InventoryAnalyticsQuery = z.infer<typeof inventoryAnalyticsQuerySchema>;
