/**
 * Analytics Query Schemas
 *
 * Core query configuration schemas for building analytics queries with filters,
 * aggregations, grouping, and pagination.
 *
 * @module analytics.query.schemas
 */

import { z } from 'zod';
import {
  dateRangeSchema,
  filterConfigSchema,
  aggregationSchema,
  sortOrderSchema,
  dataSourceSchema,
} from './analytics.base.schemas';

/**
 * Metric Query Schema
 * Comprehensive analytics query configuration
 */
export const metricQuerySchema = z.object({
  // Data source
  dataSource: dataSourceSchema,

  // Date range (required)
  dateRange: dateRangeSchema,

  // Filters (optional)
  filters: z.array(filterConfigSchema).optional(),

  // Aggregations (optional)
  aggregations: z.array(aggregationSchema).optional(),

  // Group by fields
  groupBy: z.array(z.string()).optional(),

  // Sort order
  orderBy: z.array(sortOrderSchema).optional(),

  // Pagination
  limit: z.number().int().min(1).max(10000).optional().default(100),
  offset: z.number().int().min(0).optional().default(0),

  // Include metadata
  includeMetadata: z.boolean().optional().default(false),
});

export type MetricQuery = z.infer<typeof metricQuerySchema>;

/**
 * Custom Query Schema
 * For advanced custom query builder
 */
export const customQuerySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Query name is required').max(100),
  description: z.string().max(500).optional(),
  dataSource: dataSourceSchema,
  fields: z.array(z.object({
    name: z.string(),
    alias: z.string().optional(),
    aggregation: z.enum([
      'count',
      'sum',
      'avg',
      'min',
      'max',
      'median',
      'mode',
      'stddev',
      'variance',
    ]).optional(),
  })).min(1, 'At least one field is required'),
  filters: z.array(filterConfigSchema).optional(),
  groupBy: z.array(z.string()).optional(),
  orderBy: z.array(sortOrderSchema).optional(),
  limit: z.number().int().min(1).max(10000).optional().default(1000),
  savedBy: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export type CustomQuery = z.infer<typeof customQuerySchema>;
