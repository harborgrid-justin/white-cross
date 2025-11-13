/**
 * @fileoverview Cache Strategy Interfaces and Types
 * @module health-record/services/cache
 * @description Consolidated type definitions and interfaces for the cache strategy system
 *
 * HIPAA CRITICAL - Type definitions for PHI caching compliance
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

export interface InMemoryCacheEntry<T = any> {
  data: T;
  timestamp: Date;
  accessCount: number;
  lastAccessed: Date;
  compliance: ComplianceLevel;
  encrypted: boolean;
  tags: string[];
  size: number;
  tier: CacheTier;
}

export enum CacheTier {
  L1 = 'L1', // In-memory application cache
  L2 = 'L2', // Redis distributed cache
  L3 = 'L3', // Database query result cache
}

export enum ComplianceLevel {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  SENSITIVE = 'SENSITIVE',
  PHI = 'PHI',
  SENSITIVE_PHI = 'SENSITIVE_PHI',
}

export interface CacheMetrics {
  l1Stats: {
    hits: number;
    misses: number;
    evictions: number;
    size: number;
    memoryUsage: number;
  };
  l2Stats: {
    hits: number;
    misses: number;
    networkLatency: number;
    size: number;
  };
  l3Stats: {
    hits: number;
    misses: number;
    queryTime: number;
    size: number;
  };
  overall: {
    hitRate: number;
    averageResponseTime: number;
    totalMemoryUsage: number;
  };
}

export interface AccessPattern {
  key: string;
  frequency: number;
  lastAccess: Date;
  predictedNextAccess: Date;
  importance: number;
  studentId?: string;
  dataType: string;
}

export interface CacheOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  responseTime: number;
  tier?: CacheTier;
}

export interface CacheInvalidationResult {
  pattern: string;
  invalidatedCount: number;
  tiersAffected: CacheTier[];
  reason?: string;
}

export interface CacheWarmingResult {
  warmedCount: number;
  failedCount: number;
  duration: number;
}

export interface PrefetchResult {
  prefetchedCount: number;
  failedCount: number;
  duration: number;
}
