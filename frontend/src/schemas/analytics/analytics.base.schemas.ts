/**
 * Analytics Base Schemas
 *
 * Core Zod validation schemas for analytics operations including date ranges,
 * filters, aggregations, and sort configurations.
 *
 * @module analytics.base.schemas
 */

import { z } from 'zod';

/**
 * Date Range Schema
 * Validates start and end dates with business rules
 */
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
}).refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  {
    message: 'Start date must be before or equal to end date',
    path: ['startDate'],
  }
).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 365; // Maximum 1 year range
  },
  {
    message: 'Date range cannot exceed 365 days',
    path: ['endDate'],
  }
);

export type DateRange = z.infer<typeof dateRangeSchema>;

/**
 * Filter Operator Enum
 */
export const filterOperatorSchema = z.enum([
  'equals',
  'notEquals',
  'contains',
  'notContains',
  'startsWith',
  'endsWith',
  'greaterThan',
  'lessThan',
  'greaterThanOrEqual',
  'lessThanOrEqual',
  'between',
  'in',
  'notIn',
  'isNull',
  'isNotNull',
]);

export type FilterOperator = z.infer<typeof filterOperatorSchema>;

/**
 * Filter Configuration Schema
 * Dynamic filter for analytics queries
 */
export const filterConfigSchema = z.object({
  field: z.string().min(1, 'Field name is required'),
  operator: filterOperatorSchema,
  value: z.any().optional(),
  values: z.array(z.any()).optional(),
  condition: z.enum(['AND', 'OR']).default('AND'),
}).refine(
  (data) => {
    // Validate value/values based on operator
    if (['between', 'in', 'notIn'].includes(data.operator)) {
      return Array.isArray(data.values) && data.values.length > 0;
    }
    if (['isNull', 'isNotNull'].includes(data.operator)) {
      return true; // No value needed
    }
    return data.value !== undefined && data.value !== null;
  },
  {
    message: 'Value or values required based on operator',
    path: ['value'],
  }
);

export type FilterConfig = z.infer<typeof filterConfigSchema>;

/**
 * Aggregation Function Enum
 */
export const aggregationFunctionSchema = z.enum([
  'count',
  'sum',
  'avg',
  'min',
  'max',
  'median',
  'mode',
  'stddev',
  'variance',
]);

export type AggregationFunction = z.infer<typeof aggregationFunctionSchema>;

/**
 * Aggregation Schema
 * Defines aggregation operations for analytics
 */
export const aggregationSchema = z.object({
  field: z.string().min(1, 'Field name is required'),
  function: aggregationFunctionSchema,
  alias: z.string().optional(),
  groupBy: z.array(z.string()).optional(),
});

export type Aggregation = z.infer<typeof aggregationSchema>;

/**
 * Sort Order Schema
 */
export const sortOrderSchema = z.object({
  field: z.string().min(1, 'Field name is required'),
  direction: z.enum(['ASC', 'DESC']).default('ASC'),
});

export type SortOrder = z.infer<typeof sortOrderSchema>;

/**
 * Data Source Enum
 * Available data sources for analytics queries
 */
export const dataSourceSchema = z.enum([
  'students',
  'health-records',
  'medications',
  'appointments',
  'incidents',
  'inventory',
]);

export type DataSource = z.infer<typeof dataSourceSchema>;

/**
 * Aggregation Period Enum
 * Time-based aggregation periods
 */
export const aggregationPeriodSchema = z.enum([
  'daily',
  'weekly',
  'monthly',
  'yearly',
]);

export type AggregationPeriod = z.infer<typeof aggregationPeriodSchema>;
