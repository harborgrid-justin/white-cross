"use strict";
/**
 * LOC: TDANALYTICS001
 * File: /reuse/threat/composites/threat-data-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-data-lake-kit
 *   - ../security-event-correlation-kit
 *   - ../threat-correlation-kit
 *   - ../threat-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - Threat analytics services
 *   - Big data analytics modules
 *   - Data lake management services
 *   - Time-series analytics platforms
 *   - Performance monitoring dashboards
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWeightedCorrelation = exports.correlateThreatsByAttributes = exports.EventSeverity = exports.CorrelationWindow = exports.CorrelationType = exports.calculateCorrelationScore = exports.mergeCorrelationResults = exports.purgeOldCorrelations = exports.getCorrelationStats = exports.detectEventVelocitySpikes = exports.findTemporalSequences = exports.detectBehavioralAnomalies = exports.findEventClusters = exports.calculateWindowDuration = exports.calculateCorrelationConfidence = exports.generateIncidentsFromCorrelations = exports.correlateEventsByStatisticalAnomaly = exports.detectComplexEventPatterns = exports.aggregateEventsByDimensions = exports.detectMultiStageAttacks = exports.correlateEventsInTimeWindow = exports.StorageTier = exports.formatDuration = exports.formatBytes = exports.generateOptimizationReport = exports.monitorDataLakeHealth = exports.calculateDataLakeStatistics = exports.identifyDuplicatePartitions = exports.deduplicateData = exports.decompressPartition = exports.compressPartition = exports.createMaterializedView = exports.analyzeQueryPerformance = exports.generateOptimizedQueryPlan = exports.estimateStorageCosts = exports.restoreArchivedData = exports.archivePartitions = exports.applyRetentionPolicy = exports.rebalanceShards = exports.splitPartition = exports.mergePartitions = exports.createPartition = exports.aggregateTimeSeriesData = exports.queryTimeSeriesData = exports.determinePartition = exports.ingestTimeSeriesData = exports.calculateOptimalShardCount = exports.generatePartitionKey = exports.validateDataLakeConfig = exports.createDataLakeConfig = void 0;
exports.scoreTemporalRelevance = exports.aggregateTimeWindows = exports.findTemporalAnomalies = exports.buildTimelineCorrelation = exports.calculateTemporalProximity = exports.detectTimeBasedClusters = exports.correlateEventSequences = exports.analyzeTemporalPatterns = exports.aggregateCorrelationResults = exports.normalizeCorrelationData = exports.scoreCorrelationStrength = exports.findCorrelationClusters = exports.buildCorrelationMatrix = void 0;
/**
 * File: /reuse/threat/composites/threat-data-analytics-composite.ts
 * Locator: WC-THREAT-DATA-ANALYTICS-COMPOSITE-001
 * Purpose: Comprehensive Threat Data Analytics Composite - Big data analytics, data lake operations, time-series processing
 *
 * Upstream: Composes functions from threat-data-lake-kit, security-event-correlation-kit, threat-correlation-kit
 * Downstream: ../backend/*, Analytics services, Data lake management, Time-series processing, Query optimization
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript
 * Exports: 45 composed functions for data lake architecture, analytics pipelines, time-series processing, query optimization
 *
 * LLM Context: Production-ready threat data analytics composite for White Cross healthcare platform.
 * Provides comprehensive big data analytics capabilities including data lake operations (partitioning, sharding,
 * retention policies), time-series data ingestion and querying, advanced analytics aggregations, statistical
 * analysis, event correlation with time windows, multi-dimensional analytics, query optimization for massive
 * datasets, storage tier management (hot/warm/cold/frozen), data compression and archival strategies,
 * deduplication algorithms, and HIPAA-compliant healthcare threat data analytics. Includes Sequelize models
 * for optimized database queries, advanced indexing strategies, and performance monitoring capabilities.
 */
// ============================================================================
// IMPORTS FROM SOURCE KITS
// ============================================================================
// Data Lake Operations
var threat_data_lake_kit_1 = require("../threat-data-lake-kit");
Object.defineProperty(exports, "createDataLakeConfig", { enumerable: true, get: function () { return threat_data_lake_kit_1.createDataLakeConfig; } });
Object.defineProperty(exports, "validateDataLakeConfig", { enumerable: true, get: function () { return threat_data_lake_kit_1.validateDataLakeConfig; } });
Object.defineProperty(exports, "generatePartitionKey", { enumerable: true, get: function () { return threat_data_lake_kit_1.generatePartitionKey; } });
Object.defineProperty(exports, "calculateOptimalShardCount", { enumerable: true, get: function () { return threat_data_lake_kit_1.calculateOptimalShardCount; } });
Object.defineProperty(exports, "ingestTimeSeriesData", { enumerable: true, get: function () { return threat_data_lake_kit_1.ingestTimeSeriesData; } });
Object.defineProperty(exports, "determinePartition", { enumerable: true, get: function () { return threat_data_lake_kit_1.determinePartition; } });
Object.defineProperty(exports, "queryTimeSeriesData", { enumerable: true, get: function () { return threat_data_lake_kit_1.queryTimeSeriesData; } });
Object.defineProperty(exports, "aggregateTimeSeriesData", { enumerable: true, get: function () { return threat_data_lake_kit_1.aggregateTimeSeriesData; } });
Object.defineProperty(exports, "createPartition", { enumerable: true, get: function () { return threat_data_lake_kit_1.createPartition; } });
Object.defineProperty(exports, "mergePartitions", { enumerable: true, get: function () { return threat_data_lake_kit_1.mergePartitions; } });
Object.defineProperty(exports, "splitPartition", { enumerable: true, get: function () { return threat_data_lake_kit_1.splitPartition; } });
Object.defineProperty(exports, "rebalanceShards", { enumerable: true, get: function () { return threat_data_lake_kit_1.rebalanceShards; } });
Object.defineProperty(exports, "applyRetentionPolicy", { enumerable: true, get: function () { return threat_data_lake_kit_1.applyRetentionPolicy; } });
Object.defineProperty(exports, "archivePartitions", { enumerable: true, get: function () { return threat_data_lake_kit_1.archivePartitions; } });
Object.defineProperty(exports, "restoreArchivedData", { enumerable: true, get: function () { return threat_data_lake_kit_1.restoreArchivedData; } });
Object.defineProperty(exports, "estimateStorageCosts", { enumerable: true, get: function () { return threat_data_lake_kit_1.estimateStorageCosts; } });
Object.defineProperty(exports, "generateOptimizedQueryPlan", { enumerable: true, get: function () { return threat_data_lake_kit_1.generateOptimizedQueryPlan; } });
Object.defineProperty(exports, "analyzeQueryPerformance", { enumerable: true, get: function () { return threat_data_lake_kit_1.analyzeQueryPerformance; } });
Object.defineProperty(exports, "createMaterializedView", { enumerable: true, get: function () { return threat_data_lake_kit_1.createMaterializedView; } });
Object.defineProperty(exports, "compressPartition", { enumerable: true, get: function () { return threat_data_lake_kit_1.compressPartition; } });
Object.defineProperty(exports, "decompressPartition", { enumerable: true, get: function () { return threat_data_lake_kit_1.decompressPartition; } });
Object.defineProperty(exports, "deduplicateData", { enumerable: true, get: function () { return threat_data_lake_kit_1.deduplicateData; } });
Object.defineProperty(exports, "identifyDuplicatePartitions", { enumerable: true, get: function () { return threat_data_lake_kit_1.identifyDuplicatePartitions; } });
Object.defineProperty(exports, "calculateDataLakeStatistics", { enumerable: true, get: function () { return threat_data_lake_kit_1.calculateDataLakeStatistics; } });
Object.defineProperty(exports, "monitorDataLakeHealth", { enumerable: true, get: function () { return threat_data_lake_kit_1.monitorDataLakeHealth; } });
Object.defineProperty(exports, "generateOptimizationReport", { enumerable: true, get: function () { return threat_data_lake_kit_1.generateOptimizationReport; } });
Object.defineProperty(exports, "formatBytes", { enumerable: true, get: function () { return threat_data_lake_kit_1.formatBytes; } });
Object.defineProperty(exports, "formatDuration", { enumerable: true, get: function () { return threat_data_lake_kit_1.formatDuration; } });
Object.defineProperty(exports, "StorageTier", { enumerable: true, get: function () { return threat_data_lake_kit_1.StorageTier; } });
// Security Event Correlation & Analytics
var security_event_correlation_kit_1 = require("../security-event-correlation-kit");
Object.defineProperty(exports, "correlateEventsInTimeWindow", { enumerable: true, get: function () { return security_event_correlation_kit_1.correlateEventsInTimeWindow; } });
Object.defineProperty(exports, "detectMultiStageAttacks", { enumerable: true, get: function () { return security_event_correlation_kit_1.detectMultiStageAttacks; } });
Object.defineProperty(exports, "aggregateEventsByDimensions", { enumerable: true, get: function () { return security_event_correlation_kit_1.aggregateEventsByDimensions; } });
Object.defineProperty(exports, "detectComplexEventPatterns", { enumerable: true, get: function () { return security_event_correlation_kit_1.detectComplexEventPatterns; } });
Object.defineProperty(exports, "correlateEventsByStatisticalAnomaly", { enumerable: true, get: function () { return security_event_correlation_kit_1.correlateEventsByStatisticalAnomaly; } });
Object.defineProperty(exports, "generateIncidentsFromCorrelations", { enumerable: true, get: function () { return security_event_correlation_kit_1.generateIncidentsFromCorrelations; } });
Object.defineProperty(exports, "calculateCorrelationConfidence", { enumerable: true, get: function () { return security_event_correlation_kit_1.calculateCorrelationConfidence; } });
Object.defineProperty(exports, "calculateWindowDuration", { enumerable: true, get: function () { return security_event_correlation_kit_1.calculateWindowDuration; } });
Object.defineProperty(exports, "findEventClusters", { enumerable: true, get: function () { return security_event_correlation_kit_1.findEventClusters; } });
Object.defineProperty(exports, "detectBehavioralAnomalies", { enumerable: true, get: function () { return security_event_correlation_kit_1.detectBehavioralAnomalies; } });
Object.defineProperty(exports, "findTemporalSequences", { enumerable: true, get: function () { return security_event_correlation_kit_1.findTemporalSequences; } });
Object.defineProperty(exports, "detectEventVelocitySpikes", { enumerable: true, get: function () { return security_event_correlation_kit_1.detectEventVelocitySpikes; } });
Object.defineProperty(exports, "getCorrelationStats", { enumerable: true, get: function () { return security_event_correlation_kit_1.getCorrelationStats; } });
Object.defineProperty(exports, "purgeOldCorrelations", { enumerable: true, get: function () { return security_event_correlation_kit_1.purgeOldCorrelations; } });
Object.defineProperty(exports, "mergeCorrelationResults", { enumerable: true, get: function () { return security_event_correlation_kit_1.mergeCorrelationResults; } });
Object.defineProperty(exports, "calculateCorrelationScore", { enumerable: true, get: function () { return security_event_correlation_kit_1.calculateCorrelationScore; } });
Object.defineProperty(exports, "CorrelationType", { enumerable: true, get: function () { return security_event_correlation_kit_1.CorrelationType; } });
Object.defineProperty(exports, "CorrelationWindow", { enumerable: true, get: function () { return security_event_correlation_kit_1.CorrelationWindow; } });
Object.defineProperty(exports, "EventSeverity", { enumerable: true, get: function () { return security_event_correlation_kit_1.EventSeverity; } });
// Threat Correlation & Analysis
var threat_correlation_kit_1 = require("../threat-correlation-kit");
Object.defineProperty(exports, "correlateThreatsByAttributes", { enumerable: true, get: function () { return threat_correlation_kit_1.correlateThreatsByAttributes; } });
Object.defineProperty(exports, "calculateWeightedCorrelation", { enumerable: true, get: function () { return threat_correlation_kit_1.calculateWeightedCorrelation; } });
Object.defineProperty(exports, "buildCorrelationMatrix", { enumerable: true, get: function () { return threat_correlation_kit_1.buildCorrelationMatrix; } });
Object.defineProperty(exports, "findCorrelationClusters", { enumerable: true, get: function () { return threat_correlation_kit_1.findCorrelationClusters; } });
Object.defineProperty(exports, "scoreCorrelationStrength", { enumerable: true, get: function () { return threat_correlation_kit_1.scoreCorrelationStrength; } });
Object.defineProperty(exports, "normalizeCorrelationData", { enumerable: true, get: function () { return threat_correlation_kit_1.normalizeCorrelationData; } });
Object.defineProperty(exports, "aggregateCorrelationResults", { enumerable: true, get: function () { return threat_correlation_kit_1.aggregateCorrelationResults; } });
Object.defineProperty(exports, "analyzeTemporalPatterns", { enumerable: true, get: function () { return threat_correlation_kit_1.analyzeTemporalPatterns; } });
Object.defineProperty(exports, "correlateEventSequences", { enumerable: true, get: function () { return threat_correlation_kit_1.correlateEventSequences; } });
Object.defineProperty(exports, "detectTimeBasedClusters", { enumerable: true, get: function () { return threat_correlation_kit_1.detectTimeBasedClusters; } });
Object.defineProperty(exports, "calculateTemporalProximity", { enumerable: true, get: function () { return threat_correlation_kit_1.calculateTemporalProximity; } });
Object.defineProperty(exports, "buildTimelineCorrelation", { enumerable: true, get: function () { return threat_correlation_kit_1.buildTimelineCorrelation; } });
Object.defineProperty(exports, "findTemporalAnomalies", { enumerable: true, get: function () { return threat_correlation_kit_1.findTemporalAnomalies; } });
Object.defineProperty(exports, "aggregateTimeWindows", { enumerable: true, get: function () { return threat_correlation_kit_1.aggregateTimeWindows; } });
Object.defineProperty(exports, "scoreTemporalRelevance", { enumerable: true, get: function () { return threat_correlation_kit_1.scoreTemporalRelevance; } });
// ============================================================================
// USAGE EXAMPLES & DOCUMENTATION
// ============================================================================
/**
 * EXAMPLE 1: Complete Big Data Analytics Pipeline
 *
 * This example demonstrates a production-ready threat analytics pipeline that:
 * 1. Configures a data lake with partitioning and sharding
 * 2. Ingests time-series threat data
 * 3. Performs real-time event correlation
 * 4. Aggregates analytics across time windows
 * 5. Detects anomalies and trends
 * 6. Optimizes queries for performance
 *
 * ```typescript
 * import {
 *   createDataLakeConfig,
 *   ingestTimeSeriesData,
 *   correlateEventsInTimeWindow,
 *   aggregateTimeSeriesData,
 *   detectTimeBasedClusters,
 *   generateOptimizedQueryPlan,
 *   monitorDataLakeHealth
 * } from '@/reuse/threat/composites/threat-data-analytics-composite';
 *
 * async function setupThreatAnalyticsPipeline() {
 *   // 1. Configure data lake
 *   const dataLakeConfig = createDataLakeConfig({
 *     name: 'threat-intelligence-lake',
 *     storagePath: '/data/threat-lake',
 *     partitionStrategy: PartitionStrategy.TIME_BASED,
 *     shardStrategy: ShardStrategy.SEVERITY_BASED,
 *     compressionAlgorithm: CompressionAlgorithm.ZSTD,
 *     retentionPolicy: {
 *       id: 'default-retention',
 *       name: 'HIPAA Compliant Retention',
 *       hotTierDays: 30,
 *       warmTierDays: 90,
 *       coldTierDays: 365,
 *       archiveAfterDays: 2555, // 7 years for HIPAA
 *       compressAfterDays: 30
 *     },
 *     indexingStrategy: {
 *       primaryKeys: ['id', 'timestamp'],
 *       secondaryIndexes: [
 *         { fields: ['severity', 'timestamp'], type: 'btree' },
 *         { fields: ['source_ip'], type: 'hash' },
 *         { fields: ['threat_type', 'timestamp'], type: 'btree' }
 *       ]
 *     },
 *     replicationFactor: 3,
 *     encryptionEnabled: true,
 *     deduplicationEnabled: true
 *   });
 *
 *   // 2. Ingest real-time threat data
 *   const threatEvents = await fetchThreatEvents();
 *   const ingestionResult = await ingestTimeSeriesData(
 *     dataLakeConfig.id,
 *     threatEvents,
 *     { batchSize: 1000, compression: true }
 *   );
 *
 *   // 3. Correlate events in time windows
 *   const correlations = await correlateEventsInTimeWindow(
 *     threatEvents,
 *     {
 *       windowType: CorrelationWindow.SLIDING,
 *       duration: 300000, // 5 minutes
 *       unit: 'seconds',
 *       slideInterval: 60000 // 1 minute
 *     },
 *     sequelize
 *   );
 *
 *   // 4. Aggregate time-series analytics
 *   const analytics = await aggregateTimeSeriesData(
 *     dataLakeConfig.id,
 *     {
 *       startTime: new Date(Date.now() - 86400000), // Last 24 hours
 *       endTime: new Date(),
 *       granularity: 'hour',
 *       aggregations: ['count', 'avg', 'max'],
 *       groupBy: ['threat_type', 'severity']
 *     }
 *   );
 *
 *   // 5. Detect temporal clusters
 *   const clusters = await detectTimeBasedClusters(
 *     correlations.events,
 *     {
 *       start: new Date(Date.now() - 86400000),
 *       end: new Date(),
 *       duration: 3600000,
 *       unit: 'seconds'
 *     }
 *   );
 *
 *   // 6. Optimize query performance
 *   const queryPlan = await generateOptimizedQueryPlan(
 *     dataLakeConfig.id,
 *     `
 *       SELECT threat_type, COUNT(*) as count, AVG(severity_score) as avg_severity
 *       FROM threat_events
 *       WHERE timestamp >= NOW() - INTERVAL '24 hours'
 *       AND severity IN ('HIGH', 'CRITICAL')
 *       GROUP BY threat_type
 *       ORDER BY count DESC
 *     `
 *   );
 *
 *   // 7. Monitor data lake health
 *   const healthMetrics = await monitorDataLakeHealth(dataLakeConfig.id);
 *
 *   console.log('Analytics Pipeline Results:', {
 *     ingested: ingestionResult.recordCount,
 *     correlations: correlations.length,
 *     clusters: clusters.length,
 *     queryOptimization: queryPlan.estimatedSpeedupFactor,
 *     healthStatus: healthMetrics.status
 *   });
 * }
 * ```
 */
/**
 * EXAMPLE 2: Advanced Time-Series Threat Analytics
 *
 * ```typescript
 * async function performAdvancedThreatAnalytics() {
 *   // Configure correlation settings
 *   const correlationConfig: CorrelationConfig = {
 *     dimensions: ['source_ip', 'destination_ip', 'threat_type', 'user_agent'],
 *     weights: {
 *       source_ip: 0.4,
 *       destination_ip: 0.3,
 *       threat_type: 0.2,
 *       user_agent: 0.1
 *     },
 *     threshold: 0.75,
 *     algorithm: 'cosine'
 *   };
 *
 *   // Build correlation matrix
 *   const matrix = await buildCorrelationMatrix(
 *     threatDataPoints,
 *     correlationConfig
 *   );
 *
 *   // Find correlation clusters
 *   const clusters = await findCorrelationClusters(
 *     matrix,
 *     { minClusterSize: 5, maxDistance: 0.3 }
 *   );
 *
 *   // Analyze temporal patterns
 *   const temporalPatterns = await analyzeTemporalPatterns(
 *     threatEvents,
 *     {
 *       start: new Date('2025-01-01'),
 *       end: new Date('2025-12-31'),
 *       duration: 86400000, // 1 day
 *       unit: 'days'
 *     }
 *   );
 *
 *   // Detect anomalies with statistical methods
 *   const anomalies = await correlateEventsByStatisticalAnomaly(
 *     threatEvents,
 *     {
 *       method: 'zscore',
 *       threshold: 3.0,
 *       windowSize: 100
 *     },
 *     sequelize
 *   );
 *
 *   return {
 *     clusters,
 *     temporalPatterns,
 *     anomalies
 *   };
 * }
 * ```
 */
/**
 * EXAMPLE 3: Data Lake Lifecycle Management
 *
 * ```typescript
 * async function manageDataLakeLifecycle(dataLakeId: string) {
 *   // 1. Apply retention policy
 *   const retentionResult = await applyRetentionPolicy(
 *     dataLakeId,
 *     {
 *       id: 'retention-001',
 *       name: 'Healthcare Compliance',
 *       hotTierDays: 30,
 *       warmTierDays: 90,
 *       coldTierDays: 365,
 *       archiveAfterDays: 2555,
 *       deleteAfterDays: 3650,
 *       compressAfterDays: 30,
 *       severityOverrides: [
 *         { severity: 'CRITICAL', retentionDays: 3650 },
 *         { severity: 'HIGH', retentionDays: 2555 }
 *       ]
 *     }
 *   );
 *
 *   // 2. Archive old partitions
 *   const archiveResult = await archivePartitions(
 *     dataLakeId,
 *     {
 *       olderThanDays: 365,
 *       compressionAlgorithm: CompressionAlgorithm.ZSTD,
 *       archivePath: '/archives/threat-data'
 *     }
 *   );
 *
 *   // 3. Compress active partitions
 *   const compressionResult = await compressPartition(
 *     dataLakeId,
 *     partitionId,
 *     CompressionAlgorithm.ZSTD
 *   );
 *
 *   // 4. Deduplicate data
 *   const dedupeResult = await deduplicateData(
 *     dataLakeId,
 *     {
 *       algorithm: 'content_hash',
 *       fields: ['source_ip', 'threat_type', 'timestamp'],
 *       timeWindow: 3600000 // 1 hour
 *     }
 *   );
 *
 *   // 5. Rebalance shards for optimal performance
 *   const rebalanceResult = await rebalanceShards(
 *     dataLakeId,
 *     {
 *       targetShardSize: 1073741824, // 1 GB
 *       maxShardSize: 5368709120, // 5 GB
 *       rebalanceStrategy: 'load_balanced'
 *     }
 *   );
 *
 *   // 6. Calculate statistics
 *   const stats = await calculateDataLakeStatistics(dataLakeId);
 *
 *   // 7. Estimate costs
 *   const costs = await estimateStorageCosts(
 *     dataLakeId,
 *     {
 *       storageUsdPerGbMonth: 0.023,
 *       requestsUsdPerMillion: 0.005,
 *       dataTransferUsdPerGb: 0.09
 *     }
 *   );
 *
 *   return {
 *     retention: retentionResult,
 *     archived: archiveResult,
 *     compressed: compressionResult,
 *     deduplicated: dedupeResult,
 *     rebalanced: rebalanceResult,
 *     statistics: stats,
 *     estimatedCosts: costs
 *   };
 * }
 * ```
 */
/**
 * DATABASE SCHEMA NOTES
 * =====================
 *
 * The functions in this composite work with several Sequelize models:
 *
 * 1. ThreatDataLakePartition
 *    - Tracks data lake partitions with time-based or hash-based keys
 *    - Indexes: partition_key, created_at, storage_tier
 *    - Partitioning: By creation timestamp (monthly)
 *
 * 2. ThreatEventTimeSeries
 *    - Stores time-series threat events with millisecond precision
 *    - Indexes: timestamp, severity, threat_type, source_ip
 *    - Partitioning: By timestamp (daily)
 *    - Retention: 7 years (HIPAA compliance)
 *
 * 3. CorrelationResult
 *    - Stores event correlation results with confidence scores
 *    - Indexes: correlation_id, created_at, correlation_type
 *    - Relationships: Many-to-many with SecurityEvent
 *
 * 4. AnalyticsAggregation
 *    - Pre-computed analytics aggregations for performance
 *    - Indexes: dimension_keys, time_bucket, metric_name
 *    - Materialized views for common queries
 *
 * PERFORMANCE OPTIMIZATION
 * ========================
 *
 * 1. Partitioning Strategy
 *    - Time-based partitioning for event tables (daily/monthly)
 *    - Hash-based partitioning for lookup tables
 *    - Composite partitioning for multi-tenant scenarios
 *
 * 2. Indexing Strategy
 *    - B-tree indexes for range queries on timestamps
 *    - Hash indexes for equality lookups (IPs, hashes)
 *    - Composite indexes for multi-column filters
 *    - Partial indexes for frequently filtered subsets
 *
 * 3. Query Optimization
 *    - Materialized views for expensive aggregations
 *    - Query result caching with Redis
 *    - Connection pooling (min: 10, max: 50)
 *    - Prepared statements for repeated queries
 *
 * 4. Storage Optimization
 *    - ZSTD compression (60-70% size reduction)
 *    - Deduplication with content hashing
 *    - Tiered storage (hot/warm/cold/frozen)
 *    - Automatic archival after 365 days
 *
 * HIPAA COMPLIANCE
 * ================
 *
 * 1. Data Retention
 *    - Minimum 7-year retention for critical events
 *    - Automated archival and deletion policies
 *    - Audit trail for all data access
 *
 * 2. Encryption
 *    - Encryption at rest (AES-256)
 *    - Encryption in transit (TLS 1.3)
 *    - Key rotation every 90 days
 *
 * 3. Access Control
 *    - Role-based access control (RBAC)
 *    - Principle of least privilege
 *    - Multi-factor authentication required
 *
 * 4. Audit Logging
 *    - All queries logged with user context
 *    - Real-time anomaly detection on access patterns
 *    - Tamper-proof audit log storage
 */
//# sourceMappingURL=threat-data-analytics-composite.js.map