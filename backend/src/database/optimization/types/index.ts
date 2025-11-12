/**
 * Database Optimization Types
 *
 * Type definitions for database optimization utilities
 * in the White Cross healthcare platform.
 */

import { Sequelize, QueryInterface } from 'sequelize';

/**
 * Index definition with optimization metadata
 */
export interface IndexInfo {
  name: string;
  tableName: string;
  columnNames: string[];
  unique: boolean;
  type: 'btree' | 'hash' | 'gin' | 'gist' | 'brin';
  size: number;
  scans: number;
  tuples_read: number;
  tuples_fetched: number;
  indexDef: string;
  isValid: boolean;
}

/**
 * Query performance metrics
 */
export interface QueryPerformance {
  query: string;
  executionTime: number;
  planningTime: number;
  totalCost: number;
  rows: number;
  cached: boolean;
  indexesUsed: string[];
  fullScans: number;
  recommendations: string[];
}

/**
 * Table statistics information
 */
export interface TableStatistics {
  tableName: string;
  rowCount: number;
  totalSize: number;
  indexSize: number;
  toastSize: number;
  deadTuples: number;
  liveTuples: number;
  lastVacuum?: Date;
  lastAnalyze?: Date;
  bloatPercentage: number;
}

/**
 * Index usage statistics
 */
export interface IndexUsageStats {
  schemaName: string;
  tableName: string;
  indexName: string;
  indexScans: number;
  tuplesRead: number;
  tuplesFetched: number;
  sizeBytes: number;
  unusedReason?: string;
}

/**
 * Query plan node
 */
export interface QueryPlanNode {
  nodeType: string;
  relationName?: string;
  alias?: string;
  startupCost: number;
  totalCost: number;
  planRows: number;
  planWidth: number;
  actualTime?: [number, number];
  actualRows?: number;
  actualLoops?: number;
  indexName?: string;
  filter?: string;
  plans?: QueryPlanNode[];
}

/**
 * Vacuum operation options
 */
export interface VacuumOptions {
  full?: boolean;
  freeze?: boolean;
  analyze?: boolean;
  verbose?: boolean;
  skipLocked?: boolean;
  indexCleanup?: boolean;
  truncate?: boolean;
  parallel?: number;
}

/**
 * Table bloat information
 */
export interface TableBloat {
  tableName: string;
  realSize: number;
  expectedSize: number;
  bloatSize: number;
  bloatPercentage: number;
  deadTuples: number;
  wastedBytes: number;
}

/**
 * Cache performance metrics
 */
export interface CacheMetrics {
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  bufferCacheSize: number;
  sharedBuffers: number;
  effectiveCacheSize: number;
}

/**
 * Index recommendation
 */
export interface IndexRecommendation {
  tableName: string;
  columns: string[];
  reason: string;
  estimatedImprovement: number;
  priority: 'high' | 'medium' | 'low';
  indexType: 'btree' | 'hash' | 'gin' | 'gist';
  createStatement: string;
}

/**
 * Database optimization context
 */
export interface DatabaseOptimizationContext {
  sequelize: Sequelize;
  schema?: string;
  logger?: any;
}

/**
 * Query analysis result
 */
export interface QueryAnalysisResult {
  query: string;
  plan: QueryPlanNode;
  recommendations: string[];
  executionTime: number;
  cost: number;
}

/**
 * Index analysis result
 */
export interface IndexAnalysisResult {
  tableName: string;
  indexes: IndexInfo[];
  recommendations: IndexRecommendation[];
  unusedIndexes: string[];
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  queryCount: number;
  slowQueries: number;
  averageExecutionTime: number;
  cacheHitRate: number;
  indexUsageRate: number;
}
