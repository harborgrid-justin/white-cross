/**
 * @fileoverview Reporting Database Schema Management
 * @module reuse/command/reporting-database-schema
 * @description Comprehensive database schema design for healthcare reporting and analytics systems.
 * Provides production-ready data warehouse schema, dimensional modeling, fact tables, aggregate tables,
 * materialized views, and ETL support for business intelligence and compliance reporting.
 *
 * Key Features:
 * - Star schema dimensional modeling
 * - Fact tables for incidents, resources, communications
 * - Dimension tables (time, location, facility, personnel)
 * - Pre-aggregated summary tables for performance
 * - Historical snapshot tables for trend analysis
 * - Audit trail tables for compliance reporting
 * - Materialized views for complex analytics
 * - Report template and scheduling management
 * - Export queue and delivery tracking
 * - SCD (Slowly Changing Dimensions) support
 * - ETL metadata and lineage tracking
 * - Data quality validation tables
 * - HIPAA-compliant de-identification views
 *
 * @architecture Data Warehouse Design:
 * - Star schema for dimensional modeling
 * - Fact tables with foreign keys to dimensions
 * - Type 2 SCDs for historical tracking
 * - Aggregate tables for query performance
 * - Columnar storage hints where supported
 * - Partitioning by time dimension
 * - Bitmap indexes for low-cardinality columns
 *
 * @performance
 * - Optimized for read-heavy analytical queries
 * - Pre-aggregated rollup tables
 * - Materialized views with refresh strategies
 * - Columnar indexes for analytics
 * - Parallel query support
 * - Query result caching strategies
 *
 * @security
 * - De-identified views for external reporting
 * - Row-level security for multi-tenant analytics
 * - Audit logging for data access
 * - Encrypted aggregate tables for PHI
 * - Role-based report access control
 *
 * @example Basic usage
 * ```typescript
 * import {
 *   createFactIncidentsTable,
 *   createDimensionTables,
 *   createIncidentSummaryView
 * } from './reporting-database-schema';
 *
 * // Create dimensional model
 * await db.query(createDimensionTables());
 * await db.query(createFactIncidentsTable());
 *
 * // Create summary views
 * await db.query(createIncidentSummaryView());
 * ```
 *
 * @example ETL workflow
 * ```typescript
 * import {
 *   extractIncidentData,
 *   transformToFactTable,
 *   loadFactTable,
 *   refreshMaterializedViews
 * } from './reporting-database-schema';
 *
 * // ETL process
 * const data = await extractIncidentData(db, startDate, endDate);
 * const transformed = transformToFactTable(data);
 * await loadFactTable(db, transformed);
 * await refreshMaterializedViews(db, ['incident_summary']);
 * ```
 *
 * LOC: DB4E8F
 * UPSTREAM: pg, sequelize, typeorm, reporting-tools
 * DOWNSTREAM: analytics.service.ts, reports.service.ts, dashboard.service.ts
 *
 * @version 1.0.0
 * @since 2025-11-09
 */
/**
 * @interface FactTableDefinition
 * @description Definition for a fact table in star schema
 */
export interface FactTableDefinition {
    /** Fact table name */
    tableName: string;
    /** Measures (numeric facts) */
    measures: MeasureDefinition[];
    /** Dimension foreign keys */
    dimensionKeys: string[];
    /** Grain/granularity description */
    grain: string;
    /** Partition strategy */
    partitionBy?: string;
}
/**
 * @interface MeasureDefinition
 * @description Definition for a measure in fact table
 */
export interface MeasureDefinition {
    /** Measure name */
    name: string;
    /** Data type */
    type: string;
    /** Aggregation function */
    aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
    /** Is this an additive measure */
    additive: boolean;
}
/**
 * @interface DimensionDefinition
 * @description Definition for dimension table
 */
export interface DimensionDefinition {
    /** Dimension table name */
    tableName: string;
    /** Natural key column(s) */
    naturalKey: string | string[];
    /** SCD type */
    scdType: 1 | 2 | 3;
    /** Attributes */
    attributes: string[];
    /** Hierarchies */
    hierarchies?: string[][];
}
/**
 * @interface AggregateTableDefinition
 * @description Definition for pre-aggregated summary table
 */
export interface AggregateTableDefinition {
    /** Aggregate table name */
    tableName: string;
    /** Source fact table */
    sourceTable: string;
    /** Grouping dimensions */
    groupBy: string[];
    /** Aggregated measures */
    measures: string[];
    /** Refresh frequency */
    refreshFrequency: 'REALTIME' | 'HOURLY' | 'DAILY' | 'WEEKLY';
}
/**
 * @interface ReportDefinition
 * @description Report template definition
 */
export interface ReportDefinition {
    /** Report ID */
    id: string;
    /** Report name */
    name: string;
    /** Report category */
    category: string;
    /** SQL query template */
    queryTemplate: string;
    /** Parameters */
    parameters: ReportParameter[];
    /** Output format */
    format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON';
}
/**
 * @interface ReportParameter
 * @description Report parameter definition
 */
export interface ReportParameter {
    /** Parameter name */
    name: string;
    /** Data type */
    type: string;
    /** Is required */
    required: boolean;
    /** Default value */
    defaultValue?: any;
}
/**
 * @interface ETLJobDefinition
 * @description ETL job configuration
 */
export interface ETLJobDefinition {
    /** Job ID */
    id: string;
    /** Job name */
    name: string;
    /** Source query */
    sourceQuery: string;
    /** Target table */
    targetTable: string;
    /** Schedule (cron expression) */
    schedule: string;
    /** Transformation logic */
    transformations?: string[];
}
/**
 * @function createDimTimeTable
 * @description Creates time dimension table for temporal analytics
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createDimTimeTable();
 * await db.query(sql);
 * ```
 */
export declare function createDimTimeTable(): string;
/**
 * @function createDimFacilityTable
 * @description Creates facility dimension table with SCD Type 2
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createDimFacilityTable();
 * await db.query(sql);
 * ```
 */
export declare function createDimFacilityTable(): string;
/**
 * @function createDimLocationTable
 * @description Creates location dimension table with geographic hierarchy
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createDimLocationTable();
 * await db.query(sql);
 * ```
 */
export declare function createDimLocationTable(): string;
/**
 * @function createDimPersonnelTable
 * @description Creates personnel dimension table for staff analytics
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createDimPersonnelTable();
 * await db.query(sql);
 * ```
 */
export declare function createDimPersonnelTable(): string;
/**
 * @function createDimIncidentTypeTable
 * @description Creates incident type dimension table
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createDimIncidentTypeTable();
 * await db.query(sql);
 * ```
 */
export declare function createDimIncidentTypeTable(): string;
/**
 * @function createFactIncidentsTable
 * @description Creates fact table for incident analytics
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createFactIncidentsTable();
 * await db.query(sql);
 * ```
 */
export declare function createFactIncidentsTable(): string;
/**
 * @function createFactResourceUtilizationTable
 * @description Creates fact table for resource utilization analytics
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createFactResourceUtilizationTable();
 * await db.query(sql);
 * ```
 */
export declare function createFactResourceUtilizationTable(): string;
/**
 * @function createFactCommunicationsTable
 * @description Creates fact table for communication analytics
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createFactCommunicationsTable();
 * await db.query(sql);
 * ```
 */
export declare function createFactCommunicationsTable(): string;
/**
 * @function createFactPersonnelActivityTable
 * @description Creates fact table for personnel activity tracking
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createFactPersonnelActivityTable();
 * await db.query(sql);
 * ```
 */
export declare function createFactPersonnelActivityTable(): string;
/**
 * @function createIncidentDailySummaryTable
 * @description Creates daily rollup table for incident analytics
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createIncidentDailySummaryTable();
 * await db.query(sql);
 * ```
 */
export declare function createIncidentDailySummaryTable(): string;
/**
 * @function createResourceUtilizationSummaryTable
 * @description Creates resource utilization summary table
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createResourceUtilizationSummaryTable();
 * await db.query(sql);
 * ```
 */
export declare function createResourceUtilizationSummaryTable(): string;
/**
 * @function createFacilityPerformanceSummaryTable
 * @description Creates facility performance metrics table
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createFacilityPerformanceSummaryTable();
 * await db.query(sql);
 * ```
 */
export declare function createFacilityPerformanceSummaryTable(): string;
/**
 * @function createHistoricalSnapshotsTable
 * @description Creates table for periodic system state snapshots
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createHistoricalSnapshotsTable();
 * await db.query(sql);
 * ```
 */
export declare function createHistoricalSnapshotsTable(): string;
/**
 * @function createTrendAnalysisTable
 * @description Creates table for storing trend calculations
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createTrendAnalysisTable();
 * await db.query(sql);
 * ```
 */
export declare function createTrendAnalysisTable(): string;
/**
 * @function createIncidentSummaryView
 * @description Creates materialized view for incident summary analytics
 *
 * @returns {string} SQL CREATE MATERIALIZED VIEW statement
 *
 * @example
 * ```typescript
 * const sql = createIncidentSummaryView();
 * await db.query(sql);
 * ```
 */
export declare function createIncidentSummaryView(): string;
/**
 * @function createResourcePerformanceView
 * @description Creates materialized view for resource performance metrics
 *
 * @returns {string} SQL CREATE MATERIALIZED VIEW statement
 *
 * @example
 * ```typescript
 * const sql = createResourcePerformanceView();
 * await db.query(sql);
 * ```
 */
export declare function createResourcePerformanceView(): string;
/**
 * @function createCommunicationMetricsView
 * @description Creates materialized view for communication effectiveness metrics
 *
 * @returns {string} SQL CREATE MATERIALIZED VIEW statement
 *
 * @example
 * ```typescript
 * const sql = createCommunicationMetricsView();
 * await db.query(sql);
 * ```
 */
export declare function createCommunicationMetricsView(): string;
/**
 * @function createReportTemplatesTable
 * @description Creates table for storing report definitions
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createReportTemplatesTable();
 * await db.query(sql);
 * ```
 */
export declare function createReportTemplatesTable(): string;
/**
 * @function createReportSchedulesTable
 * @description Creates table for scheduled report execution
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createReportSchedulesTable();
 * await db.query(sql);
 * ```
 */
export declare function createReportSchedulesTable(): string;
/**
 * @function createReportExecutionsTable
 * @description Creates table for tracking report execution history
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createReportExecutionsTable();
 * await db.query(sql);
 * ```
 */
export declare function createReportExecutionsTable(): string;
/**
 * @function createExportQueuesTable
 * @description Creates table for managing data export queues
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createExportQueuesTable();
 * await db.query(sql);
 * ```
 */
export declare function createExportQueuesTable(): string;
/**
 * @function createDataExportLogsTable
 * @description Creates table for audit logging of data exports
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createDataExportLogsTable();
 * await db.query(sql);
 * ```
 */
export declare function createDataExportLogsTable(): string;
/**
 * @function createETLJobsTable
 * @description Creates table for ETL job definitions and configuration
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createETLJobsTable();
 * await db.query(sql);
 * ```
 */
export declare function createETLJobsTable(): string;
/**
 * @function createETLExecutionsTable
 * @description Creates table for tracking ETL execution history
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createETLExecutionsTable();
 * await db.query(sql);
 * ```
 */
export declare function createETLExecutionsTable(): string;
/**
 * @function createDataQualityRulesTable
 * @description Creates table for data quality validation rules
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createDataQualityRulesTable();
 * await db.query(sql);
 * ```
 */
export declare function createDataQualityRulesTable(): string;
/**
 * @function createDataQualityResultsTable
 * @description Creates table for storing data quality check results
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createDataQualityResultsTable();
 * await db.query(sql);
 * ```
 */
export declare function createDataQualityResultsTable(): string;
/**
 * @function refreshMaterializedView
 * @description Generates SQL to refresh a materialized view
 *
 * @param {string} viewName - Name of materialized view
 * @param {boolean} concurrent - Whether to refresh concurrently
 * @returns {string} SQL REFRESH statement
 *
 * @example
 * ```typescript
 * const sql = refreshMaterializedView('mv_incident_summary', true);
 * await db.query(sql);
 * ```
 */
export declare function refreshMaterializedView(viewName: string, concurrent?: boolean): string;
/**
 * @function refreshAllMaterializedViews
 * @description Generates SQL to refresh all materialized views
 *
 * @param {boolean} concurrent - Whether to refresh concurrently
 * @returns {string} SQL REFRESH statements
 *
 * @example
 * ```typescript
 * const sql = refreshAllMaterializedViews(true);
 * await db.query(sql);
 * ```
 */
export declare function refreshAllMaterializedViews(concurrent?: boolean): string;
/**
 * @function generateTimeDimension
 * @description Generates SQL to populate time dimension table
 *
 * @param {number} startYear - Starting year
 * @param {number} endYear - Ending year
 * @returns {string} SQL INSERT statement
 *
 * @example
 * ```typescript
 * const sql = generateTimeDimension(2020, 2030);
 * await db.query(sql);
 * ```
 */
export declare function generateTimeDimension(startYear: number, endYear: number): string;
/**
 * @function createFactTablePartitions
 * @description Creates partitions for fact tables by time
 *
 * @param {string} tableName - Fact table name
 * @param {number} year - Year to partition
 * @param {number} months - Number of months
 * @returns {string} SQL CREATE TABLE statements
 *
 * @example
 * ```typescript
 * const sql = createFactTablePartitions('fact_incidents', 2025, 12);
 * await db.query(sql);
 * ```
 */
export declare function createFactTablePartitions(tableName: string, year: number, months?: number): string;
/**
 * @function optimizeReportingQueries
 * @description Generates optimization recommendations for reporting database
 *
 * @returns {string[]} Array of optimization SQL statements
 *
 * @example
 * ```typescript
 * const optimizations = optimizeReportingQueries();
 * for (const sql of optimizations) {
 *   await db.query(sql);
 * }
 * ```
 */
export declare function optimizeReportingQueries(): string[];
//# sourceMappingURL=reporting-database-schema.d.ts.map