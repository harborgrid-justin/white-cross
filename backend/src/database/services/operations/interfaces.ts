/**
 * @fileoverview Shared Interfaces and Types for Database Operations
 * @module database/services/operations/interfaces
 * @description Common interfaces, types, and enums used across database operation services
 *
 * @version 1.0.0
 */

import { Transaction, WhereOptions } from 'sequelize';

/**
 * Batch execution result with comprehensive metrics
 */
export interface BatchExecutionResult<T = unknown> {
  success: boolean;
  totalBatches: number;
  successfulBatches: number;
  failedBatches: number;
  results: T[];
  errors: Array<{ batchIndex: number; error: string }>;
  executionTimeMs: number;
  averageBatchTimeMs: number;
  throughput: number; // Records per second
}

/**
 * Batch configuration for optimized execution
 */
export interface BatchConfig {
  batchSize: number;
  maxConcurrency: number;
  delayBetweenBatchesMs?: number;
  failFast?: boolean;
  retryFailedBatches?: number;
  transaction?: Transaction;
}

/**
 * Streaming metrics for monitoring
 */
export interface StreamingMetrics {
  totalRecords: number;
  totalBatches: number;
  averageBatchSize: number;
  executionTimeMs: number;
  throughput: number;
  memoryPeakMb: number;
  backpressureEvents: number;
}

/**
 * Audit trail metadata for tracking changes
 */
export interface AuditMetadata {
  userId?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'ARCHIVE';
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Soft delete options
 */
export interface SoftDeleteOptions {
  deletedBy?: string;
  deleteReason?: string;
  cascade?: boolean;
  transaction?: Transaction;
}

/**
 * Version control metadata
 */
export interface VersionMetadata {
  version: number;
  previousVersion?: number;
  changeDescription?: string;
  changedFields?: string[];
}

/**
 * Join type discriminator
 */
export type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS' | 'LATERAL';

/**
 * Complex join configuration
 */
export interface ComplexJoinConfig {
  type: JoinType;
  table: string;
  alias?: string;
  on: string | { left: string; right: string; operator?: string };
  lateral?: boolean;
  using?: string[];
  where?: string;
}

/**
 * CTE (Common Table Expression) configuration
 */
export interface CTEConfig {
  name: string;
  query: string;
  columns?: string[];
  recursive?: boolean;
  materialize?: boolean;
}

/**
 * Time series configuration
 */
export interface TimeSeriesConfig {
  dateField: string;
  interval: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
  aggregateField: string;
  aggregateFunction: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
  startDate: Date;
  endDate: Date;
  fillGaps?: boolean;
}

/**
 * Aggregate result with statistical metadata
 */
export interface AggregateResult {
  value: number | null;
  count: number;
  min?: number;
  max?: number;
  avg?: number;
  sum?: number;
  stddev?: number;
  variance?: number;
}

/**
 * Percentile calculation configuration
 */
export interface PercentileConfig {
  field: string;
  percentiles: number[]; // e.g., [25, 50, 75, 95, 99]
  where?: WhereOptions<unknown>;
}

/**
 * Cohort analysis configuration
 */
export interface CohortConfig {
  userIdField: string;
  eventDateField: string;
  cohortDateField: string;
  metricField?: string;
  periods: number;
  periodType: 'day' | 'week' | 'month';
}

/**
 * Rolling window configuration
 */
export interface RollingWindowConfig {
  field: string;
  windowSize: number;
  function: 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT';
  orderBy: string;
}

/**
 * Real-time query subscription configuration
 */
export interface RealtimeSubscriptionConfig {
  pollIntervalMs: number;
  where: WhereOptions<unknown>;
  onChange: (records: unknown[]) => void | Promise<void>;
  onError?: (error: Error) => void;
}

/**
 * Stream configuration for query operations
 */
export interface StreamConfig {
  batchSize: number;
  highWaterMark?: number;
  objectMode?: boolean;
  backpressureThreshold?: number;
  transaction?: Transaction;
}

/**
 * Cursor pagination configuration
 */
export interface CursorPaginationConfig {
  cursorField: string;
  limit: number;
  direction: 'forward' | 'backward';
  cursor?: unknown;
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Standard response for cursor pagination
 */
export interface CursorPaginationResult<T> {
  data: T[];
  hasMore: boolean;
  nextCursor: string | number | null;
  prevCursor: string | number | null;
}
