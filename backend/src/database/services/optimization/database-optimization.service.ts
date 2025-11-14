/**
 * Main Database Optimization Service
 * 
 * Combines all optimization functionality from refactored modules
 * Injectable service class for NestJS integration
 */

import { Injectable, Logger } from '@nestjs/common';

// Import all functions from refactored services
import * as IndexManagement from './index-management.service';
import * as QueryOptimization from './query-optimization.service';
import * as StatisticsAnalysis from './statistics-analysis.service';
import * as VacuumMaintenance from './vacuum-maintenance.service';
import * as BloatDetection from './bloat-detection.service';
import * as CacheOptimization from './cache-optimization.service';

import { BaseService } from '@/common/base';
/**
 * Injectable service class wrapping all optimization utilities
 */
@Injectable()
export class DatabaseOptimizationService extends BaseService {
  constructor() {
    super("DatabaseOptimizationService");
  }

  // Index Management Methods (Functions 1-10)
  listAllIndexes = IndexManagement.listAllIndexes;
  analyzeIndexUsage = IndexManagement.analyzeIndexUsage;
  createOptimizedIndex = IndexManagement.createOptimizedIndex;
  rebuildIndex = IndexManagement.rebuildIndex;
  analyzeTable = IndexManagement.analyzeTable;
  findDuplicateIndexes = IndexManagement.findDuplicateIndexes;
  calculateIndexColumnOrder = IndexManagement.calculateIndexColumnOrder;
  estimateIndexSize = IndexManagement.estimateIndexSize;
  validateIndexIntegrity = IndexManagement.validateIndexIntegrity;
  generateIndexRecommendations = IndexManagement.generateIndexRecommendations;

  // Query Optimization Methods (Functions 11-20)
  analyzeQueryPlan = QueryOptimization.analyzeQueryPlan;
  rewriteQueryForPerformance = QueryOptimization.rewriteQueryForPerformance;
  detectSlowQueries = QueryOptimization.detectSlowQueries;
  optimizeJoinOrder = QueryOptimization.optimizeJoinOrder;
  identifyNPlusOneQueries = QueryOptimization.identifyNPlusOneQueries;
  suggestCompositeIndexes = QueryOptimization.suggestCompositeIndexes;
  analyzeQueryCache = QueryOptimization.analyzeQueryCache;
  optimizePagination = QueryOptimization.optimizePagination;
  detectCartesianProduct = QueryOptimization.detectCartesianProduct;
  suggestCoveringIndex = QueryOptimization.suggestCoveringIndex;

  // Statistics and Analysis Methods (Functions 21-28)
  getTableStatistics = StatisticsAnalysis.getTableStatistics;
  collectDatabaseStatistics = StatisticsAnalysis.collectDatabaseStatistics;
  updateTableStatistics = StatisticsAnalysis.updateTableStatistics;
  monitorStatisticsStaleness = StatisticsAnalysis.monitorStatisticsStaleness;
  estimateQuerySelectivity = StatisticsAnalysis.estimateQuerySelectivity;
  analyzeColumnCardinality = StatisticsAnalysis.analyzeColumnCardinality;
  getDatabaseSizeStatistics = StatisticsAnalysis.getDatabaseSizeStatistics;
  analyzeDataDistribution = StatisticsAnalysis.analyzeDataDistribution;

  // Vacuum and Maintenance Methods (Functions 29-35)
  performVacuum = VacuumMaintenance.performVacuum;
  scheduleAutovacuum = VacuumMaintenance.scheduleAutovacuum;
  detectVacuumNeeded = VacuumMaintenance.detectVacuumNeeded;
  vacuumFreeze = VacuumMaintenance.vacuumFreeze;
  monitorVacuumProgress = VacuumMaintenance.monitorVacuumProgress;
  reclaimWastedSpace = VacuumMaintenance.reclaimWastedSpace;
  optimizeTableStructure = VacuumMaintenance.optimizeTableStructure;

  // Bloat Detection Methods (Functions 36-40)
  detectTableBloat = BloatDetection.detectTableBloat;
  detectIndexBloat = BloatDetection.detectIndexBloat;
  findBloatedTables = BloatDetection.findBloatedTables;
  estimateBloatReduction = BloatDetection.estimateBloatReduction;
  createBloatReport = BloatDetection.createBloatReport;

  // Cache Optimization Methods (Functions 41-45)
  analyzeBufferCacheHitRatio = CacheOptimization.analyzeBufferCacheHitRatio;
  optimizeCacheSettings = CacheOptimization.optimizeCacheSettings;
  warmDatabaseCache = CacheOptimization.warmDatabaseCache;
  analyzeCachedObjects = CacheOptimization.analyzeCachedObjects;
  recommendCacheConfiguration = CacheOptimization.recommendCacheConfiguration;
}
