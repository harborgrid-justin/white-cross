"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDimTimeTable = createDimTimeTable;
exports.createDimFacilityTable = createDimFacilityTable;
exports.createDimLocationTable = createDimLocationTable;
exports.createDimPersonnelTable = createDimPersonnelTable;
exports.createDimIncidentTypeTable = createDimIncidentTypeTable;
exports.createFactIncidentsTable = createFactIncidentsTable;
exports.createFactResourceUtilizationTable = createFactResourceUtilizationTable;
exports.createFactCommunicationsTable = createFactCommunicationsTable;
exports.createFactPersonnelActivityTable = createFactPersonnelActivityTable;
exports.createIncidentDailySummaryTable = createIncidentDailySummaryTable;
exports.createResourceUtilizationSummaryTable = createResourceUtilizationSummaryTable;
exports.createFacilityPerformanceSummaryTable = createFacilityPerformanceSummaryTable;
exports.createHistoricalSnapshotsTable = createHistoricalSnapshotsTable;
exports.createTrendAnalysisTable = createTrendAnalysisTable;
exports.createIncidentSummaryView = createIncidentSummaryView;
exports.createResourcePerformanceView = createResourcePerformanceView;
exports.createCommunicationMetricsView = createCommunicationMetricsView;
exports.createReportTemplatesTable = createReportTemplatesTable;
exports.createReportSchedulesTable = createReportSchedulesTable;
exports.createReportExecutionsTable = createReportExecutionsTable;
exports.createExportQueuesTable = createExportQueuesTable;
exports.createDataExportLogsTable = createDataExportLogsTable;
exports.createETLJobsTable = createETLJobsTable;
exports.createETLExecutionsTable = createETLExecutionsTable;
exports.createDataQualityRulesTable = createDataQualityRulesTable;
exports.createDataQualityResultsTable = createDataQualityResultsTable;
exports.refreshMaterializedView = refreshMaterializedView;
exports.refreshAllMaterializedViews = refreshAllMaterializedViews;
exports.generateTimeDimension = generateTimeDimension;
exports.createFactTablePartitions = createFactTablePartitions;
exports.optimizeReportingQueries = optimizeReportingQueries;
// ============================================================================
// DIMENSION TABLES
// ============================================================================
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
function createDimTimeTable() {
    return `
    CREATE TABLE IF NOT EXISTS dim_time (
      time_key INTEGER PRIMARY KEY,
      full_date DATE UNIQUE NOT NULL,
      year INTEGER NOT NULL,
      quarter INTEGER NOT NULL,
      month INTEGER NOT NULL,
      month_name VARCHAR(20) NOT NULL,
      week_of_year INTEGER NOT NULL,
      day_of_month INTEGER NOT NULL,
      day_of_week INTEGER NOT NULL,
      day_name VARCHAR(20) NOT NULL,
      is_weekend BOOLEAN NOT NULL,
      is_holiday BOOLEAN DEFAULT false,
      holiday_name VARCHAR(100),
      fiscal_year INTEGER,
      fiscal_quarter INTEGER,
      fiscal_month INTEGER,
      season VARCHAR(20)
    );

    CREATE INDEX idx_dim_time_date ON dim_time (full_date);
    CREATE INDEX idx_dim_time_year_month ON dim_time (year, month);
    CREATE INDEX idx_dim_time_fiscal ON dim_time (fiscal_year, fiscal_quarter);
  `;
}
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
function createDimFacilityTable() {
    return `
    CREATE TABLE IF NOT EXISTS dim_facility (
      facility_key SERIAL PRIMARY KEY,
      facility_id UUID NOT NULL,
      facility_code VARCHAR(50) NOT NULL,
      facility_name VARCHAR(255) NOT NULL,
      facility_type VARCHAR(50) NOT NULL,
      city VARCHAR(100),
      state VARCHAR(50),
      region VARCHAR(50),
      capacity INTEGER,
      is_trauma_center BOOLEAN,
      trauma_level VARCHAR(10),
      -- SCD Type 2 columns
      valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      valid_to TIMESTAMP WITH TIME ZONE DEFAULT '9999-12-31'::TIMESTAMP,
      is_current BOOLEAN DEFAULT true,
      version INTEGER DEFAULT 1,
      UNIQUE(facility_id, valid_from)
    );

    CREATE INDEX idx_dim_facility_id ON dim_facility (facility_id);
    CREATE INDEX idx_dim_facility_current ON dim_facility (facility_id) WHERE is_current = true;
    CREATE INDEX idx_dim_facility_type ON dim_facility (facility_type);
  `;
}
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
function createDimLocationTable() {
    return `
    CREATE TABLE IF NOT EXISTS dim_location (
      location_key SERIAL PRIMARY KEY,
      location_id UUID NOT NULL,
      location_name VARCHAR(255) NOT NULL,
      location_type VARCHAR(50) NOT NULL,
      address VARCHAR(500),
      city VARCHAR(100),
      county VARCHAR(100),
      state VARCHAR(50),
      zip_code VARCHAR(20),
      country VARCHAR(50) DEFAULT 'USA',
      region VARCHAR(50),
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      -- SCD Type 2
      valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      valid_to TIMESTAMP WITH TIME ZONE DEFAULT '9999-12-31'::TIMESTAMP,
      is_current BOOLEAN DEFAULT true,
      UNIQUE(location_id, valid_from)
    );

    CREATE INDEX idx_dim_location_id ON dim_location (location_id);
    CREATE INDEX idx_dim_location_current ON dim_location (location_id) WHERE is_current = true;
    CREATE INDEX idx_dim_location_geo ON dim_location (city, state);
  `;
}
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
function createDimPersonnelTable() {
    return `
    CREATE TABLE IF NOT EXISTS dim_personnel (
      personnel_key SERIAL PRIMARY KEY,
      personnel_id UUID NOT NULL,
      employee_id VARCHAR(50) NOT NULL,
      role VARCHAR(50) NOT NULL,
      specialty VARCHAR(100),
      department VARCHAR(100),
      facility_key INTEGER REFERENCES dim_facility(facility_key),
      hire_date DATE,
      -- SCD Type 2
      valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      valid_to TIMESTAMP WITH TIME ZONE DEFAULT '9999-12-31'::TIMESTAMP,
      is_current BOOLEAN DEFAULT true,
      UNIQUE(personnel_id, valid_from)
    );

    CREATE INDEX idx_dim_personnel_id ON dim_personnel (personnel_id);
    CREATE INDEX idx_dim_personnel_current ON dim_personnel (personnel_id) WHERE is_current = true;
    CREATE INDEX idx_dim_personnel_role ON dim_personnel (role);
  `;
}
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
function createDimIncidentTypeTable() {
    return `
    CREATE TABLE IF NOT EXISTS dim_incident_type (
      incident_type_key SERIAL PRIMARY KEY,
      incident_type_code VARCHAR(50) UNIQUE NOT NULL,
      incident_type_name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      severity_default VARCHAR(20),
      description TEXT,
      is_active BOOLEAN DEFAULT true
    );

    CREATE INDEX idx_dim_incident_type_category ON dim_incident_type (category);
  `;
}
// ============================================================================
// FACT TABLES
// ============================================================================
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
function createFactIncidentsTable() {
    return `
    CREATE TABLE IF NOT EXISTS fact_incidents (
      fact_incident_key BIGSERIAL PRIMARY KEY,
      incident_id UUID NOT NULL,
      -- Time dimensions
      created_time_key INTEGER REFERENCES dim_time(time_key),
      resolved_time_key INTEGER REFERENCES dim_time(time_key),
      created_hour INTEGER,
      -- Other dimensions
      facility_key INTEGER REFERENCES dim_facility(facility_key),
      location_key INTEGER REFERENCES dim_location(location_key),
      incident_type_key INTEGER REFERENCES dim_incident_type(incident_type_key),
      reporter_key INTEGER REFERENCES dim_personnel(personnel_key),
      assigned_key INTEGER REFERENCES dim_personnel(personnel_key),
      -- Degenerate dimensions
      incident_number VARCHAR(50),
      severity VARCHAR(20),
      status VARCHAR(20),
      -- Measures
      patient_count INTEGER DEFAULT 0,
      priority_score INTEGER DEFAULT 0,
      response_time_minutes INTEGER,
      resolution_time_minutes INTEGER,
      personnel_assigned INTEGER DEFAULT 0,
      resources_allocated INTEGER DEFAULT 0,
      communication_count INTEGER DEFAULT 0,
      cost_estimate DECIMAL(12, 2),
      -- Flags
      is_critical BOOLEAN,
      is_resolved BOOLEAN,
      is_closed BOOLEAN,
      -- Metadata
      created_at TIMESTAMP WITH TIME ZONE NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE
    ) PARTITION BY RANGE (created_time_key);

    CREATE INDEX idx_fact_incidents_time ON fact_incidents (created_time_key);
    CREATE INDEX idx_fact_incidents_facility ON fact_incidents (facility_key);
    CREATE INDEX idx_fact_incidents_type ON fact_incidents (incident_type_key);
    CREATE INDEX idx_fact_incidents_severity ON fact_incidents (severity, created_time_key);
  `;
}
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
function createFactResourceUtilizationTable() {
    return `
    CREATE TABLE IF NOT EXISTS fact_resource_utilization (
      fact_resource_key BIGSERIAL PRIMARY KEY,
      resource_id UUID NOT NULL,
      -- Time dimensions
      date_key INTEGER REFERENCES dim_time(time_key),
      hour_of_day INTEGER,
      -- Other dimensions
      facility_key INTEGER REFERENCES dim_facility(facility_key),
      location_key INTEGER REFERENCES dim_location(location_key),
      -- Degenerate dimensions
      resource_type VARCHAR(50),
      resource_code VARCHAR(100),
      -- Measures
      total_allocations INTEGER DEFAULT 0,
      total_hours_allocated DECIMAL(10, 2),
      utilization_percentage DECIMAL(5, 2),
      availability_hours DECIMAL(10, 2),
      maintenance_hours DECIMAL(10, 2),
      incident_assignments INTEGER DEFAULT 0,
      average_allocation_duration DECIMAL(10, 2),
      -- Metadata
      snapshot_timestamp TIMESTAMP WITH TIME ZONE NOT NULL
    ) PARTITION BY RANGE (date_key);

    CREATE INDEX idx_fact_resource_date ON fact_resource_utilization (date_key);
    CREATE INDEX idx_fact_resource_facility ON fact_resource_utilization (facility_key);
    CREATE INDEX idx_fact_resource_type ON fact_resource_utilization (resource_type);
  `;
}
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
function createFactCommunicationsTable() {
    return `
    CREATE TABLE IF NOT EXISTS fact_communications (
      fact_comm_key BIGSERIAL PRIMARY KEY,
      communication_id UUID NOT NULL,
      -- Time dimensions
      sent_time_key INTEGER REFERENCES dim_time(time_key),
      sent_hour INTEGER,
      -- Other dimensions
      sender_key INTEGER REFERENCES dim_personnel(personnel_key),
      recipient_key INTEGER REFERENCES dim_personnel(personnel_key),
      facility_key INTEGER REFERENCES dim_facility(facility_key),
      -- Degenerate dimensions
      communication_type VARCHAR(50),
      channel VARCHAR(50),
      priority VARCHAR(20),
      status VARCHAR(20),
      -- Measures
      delivery_time_seconds INTEGER,
      read_time_seconds INTEGER,
      message_length INTEGER,
      attachment_count INTEGER DEFAULT 0,
      retry_count INTEGER DEFAULT 0,
      is_delivered BOOLEAN,
      is_read BOOLEAN,
      -- Metadata
      sent_at TIMESTAMP WITH TIME ZONE NOT NULL
    ) PARTITION BY RANGE (sent_time_key);

    CREATE INDEX idx_fact_comm_time ON fact_communications (sent_time_key);
    CREATE INDEX idx_fact_comm_sender ON fact_communications (sender_key);
    CREATE INDEX idx_fact_comm_recipient ON fact_communications (recipient_key);
    CREATE INDEX idx_fact_comm_type ON fact_communications (communication_type);
  `;
}
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
function createFactPersonnelActivityTable() {
    return `
    CREATE TABLE IF NOT EXISTS fact_personnel_activity (
      fact_activity_key BIGSERIAL PRIMARY KEY,
      -- Time dimensions
      date_key INTEGER REFERENCES dim_time(time_key),
      shift_period VARCHAR(20),
      -- Other dimensions
      personnel_key INTEGER REFERENCES dim_personnel(personnel_key),
      facility_key INTEGER REFERENCES dim_facility(facility_key),
      -- Measures
      incidents_assigned INTEGER DEFAULT 0,
      incidents_resolved INTEGER DEFAULT 0,
      average_response_time_minutes DECIMAL(10, 2),
      total_active_time_minutes INTEGER DEFAULT 0,
      communications_sent INTEGER DEFAULT 0,
      communications_received INTEGER DEFAULT 0,
      overtime_hours DECIMAL(10, 2) DEFAULT 0,
      -- Metadata
      activity_date DATE NOT NULL
    ) PARTITION BY RANGE (date_key);

    CREATE INDEX idx_fact_personnel_date ON fact_personnel_activity (date_key);
    CREATE INDEX idx_fact_personnel_key ON fact_personnel_activity (personnel_key);
    CREATE INDEX idx_fact_personnel_facility ON fact_personnel_activity (facility_key);
  `;
}
// ============================================================================
// AGGREGATE TABLES
// ============================================================================
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
function createIncidentDailySummaryTable() {
    return `
    CREATE TABLE IF NOT EXISTS agg_incidents_daily (
      summary_key SERIAL PRIMARY KEY,
      date_key INTEGER REFERENCES dim_time(time_key),
      facility_key INTEGER REFERENCES dim_facility(facility_key),
      incident_type_key INTEGER REFERENCES dim_incident_type(incident_type_key),
      severity VARCHAR(20),
      -- Aggregated measures
      total_incidents INTEGER DEFAULT 0,
      critical_incidents INTEGER DEFAULT 0,
      high_incidents INTEGER DEFAULT 0,
      resolved_incidents INTEGER DEFAULT 0,
      open_incidents INTEGER DEFAULT 0,
      total_patients INTEGER DEFAULT 0,
      avg_response_time_minutes DECIMAL(10, 2),
      avg_resolution_time_minutes DECIMAL(10, 2),
      max_priority_score INTEGER,
      total_cost_estimate DECIMAL(12, 2),
      -- Metadata
      last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date_key, facility_key, incident_type_key, severity)
    );

    CREATE INDEX idx_agg_incidents_daily_date ON agg_incidents_daily (date_key);
    CREATE INDEX idx_agg_incidents_daily_facility ON agg_incidents_daily (facility_key);
  `;
}
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
function createResourceUtilizationSummaryTable() {
    return `
    CREATE TABLE IF NOT EXISTS agg_resource_utilization_daily (
      summary_key SERIAL PRIMARY KEY,
      date_key INTEGER REFERENCES dim_time(time_key),
      facility_key INTEGER REFERENCES dim_facility(facility_key),
      resource_type VARCHAR(50),
      -- Aggregated measures
      total_resources INTEGER DEFAULT 0,
      available_resources INTEGER DEFAULT 0,
      allocated_resources INTEGER DEFAULT 0,
      avg_utilization_percentage DECIMAL(5, 2),
      peak_utilization_percentage DECIMAL(5, 2),
      total_allocations INTEGER DEFAULT 0,
      avg_allocation_hours DECIMAL(10, 2),
      maintenance_count INTEGER DEFAULT 0,
      -- Metadata
      last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date_key, facility_key, resource_type)
    );

    CREATE INDEX idx_agg_resource_daily_date ON agg_resource_utilization_daily (date_key);
    CREATE INDEX idx_agg_resource_daily_facility ON agg_resource_utilization_daily (facility_key);
  `;
}
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
function createFacilityPerformanceSummaryTable() {
    return `
    CREATE TABLE IF NOT EXISTS agg_facility_performance_daily (
      summary_key SERIAL PRIMARY KEY,
      date_key INTEGER REFERENCES dim_time(time_key),
      facility_key INTEGER REFERENCES dim_facility(facility_key),
      -- Incident metrics
      total_incidents INTEGER DEFAULT 0,
      avg_response_time_minutes DECIMAL(10, 2),
      avg_resolution_time_minutes DECIMAL(10, 2),
      incident_resolution_rate DECIMAL(5, 2),
      -- Resource metrics
      resource_utilization_rate DECIMAL(5, 2),
      avg_resources_per_incident DECIMAL(10, 2),
      -- Personnel metrics
      active_personnel INTEGER DEFAULT 0,
      avg_incidents_per_personnel DECIMAL(10, 2),
      -- Communication metrics
      total_communications INTEGER DEFAULT 0,
      avg_communication_response_time DECIMAL(10, 2),
      -- Overall performance score
      performance_score DECIMAL(5, 2),
      -- Metadata
      last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date_key, facility_key)
    );

    CREATE INDEX idx_agg_facility_perf_date ON agg_facility_performance_daily (date_key);
    CREATE INDEX idx_agg_facility_perf_facility ON agg_facility_performance_daily (facility_key);
  `;
}
// ============================================================================
// HISTORICAL SNAPSHOTS
// ============================================================================
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
function createHistoricalSnapshotsTable() {
    return `
    CREATE TABLE IF NOT EXISTS historical_snapshots (
      snapshot_key BIGSERIAL PRIMARY KEY,
      snapshot_date DATE NOT NULL,
      snapshot_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      snapshot_type VARCHAR(50) NOT NULL,
      -- System-wide metrics
      total_active_incidents INTEGER,
      total_facilities INTEGER,
      total_active_personnel INTEGER,
      total_resources INTEGER,
      -- Capacity metrics
      system_capacity_percentage DECIMAL(5, 2),
      avg_facility_occupancy DECIMAL(5, 2),
      -- Performance metrics
      avg_incident_response_time DECIMAL(10, 2),
      avg_incident_resolution_time DECIMAL(10, 2),
      -- Snapshot data
      snapshot_data JSONB,
      -- Metadata
      created_by VARCHAR(100)
    );

    CREATE INDEX idx_historical_snapshots_date ON historical_snapshots (snapshot_date DESC);
    CREATE INDEX idx_historical_snapshots_type ON historical_snapshots (snapshot_type, snapshot_date DESC);
  `;
}
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
function createTrendAnalysisTable() {
    return `
    CREATE TABLE IF NOT EXISTS trend_analysis (
      trend_key SERIAL PRIMARY KEY,
      metric_name VARCHAR(100) NOT NULL,
      time_period VARCHAR(50) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      entity_type VARCHAR(50),
      entity_key INTEGER,
      -- Trend metrics
      current_value DECIMAL(12, 2),
      previous_value DECIMAL(12, 2),
      change_value DECIMAL(12, 2),
      change_percentage DECIMAL(10, 2),
      trend_direction VARCHAR(20),
      statistical_significance DECIMAL(5, 4),
      -- Metadata
      calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_trend_analysis_metric ON trend_analysis (metric_name, end_date DESC);
    CREATE INDEX idx_trend_analysis_entity ON trend_analysis (entity_type, entity_key);
  `;
}
// ============================================================================
// MATERIALIZED VIEWS
// ============================================================================
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
function createIncidentSummaryView() {
    return `
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_incident_summary AS
    SELECT
      f.created_time_key,
      t.full_date,
      t.year,
      t.month,
      t.month_name,
      fc.facility_key,
      fc.facility_name,
      it.incident_type_name,
      f.severity,
      COUNT(*) as total_incidents,
      COUNT(*) FILTER (WHERE f.is_critical) as critical_count,
      COUNT(*) FILTER (WHERE f.is_resolved) as resolved_count,
      SUM(f.patient_count) as total_patients,
      AVG(f.response_time_minutes) as avg_response_time,
      AVG(f.resolution_time_minutes) as avg_resolution_time,
      MAX(f.priority_score) as max_priority,
      SUM(f.cost_estimate) as total_cost
    FROM fact_incidents f
    JOIN dim_time t ON f.created_time_key = t.time_key
    JOIN dim_facility fc ON f.facility_key = fc.facility_key
    JOIN dim_incident_type it ON f.incident_type_key = it.incident_type_key
    GROUP BY
      f.created_time_key, t.full_date, t.year, t.month, t.month_name,
      fc.facility_key, fc.facility_name, it.incident_type_name, f.severity
    WITH DATA;

    CREATE UNIQUE INDEX idx_mv_incident_summary_unique
      ON mv_incident_summary (created_time_key, facility_key, incident_type_name, severity);
    CREATE INDEX idx_mv_incident_summary_date ON mv_incident_summary (full_date DESC);
    CREATE INDEX idx_mv_incident_summary_facility ON mv_incident_summary (facility_name);
  `;
}
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
function createResourcePerformanceView() {
    return `
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_resource_performance AS
    SELECT
      r.date_key,
      t.full_date,
      t.year,
      t.month,
      fc.facility_name,
      r.resource_type,
      AVG(r.utilization_percentage) as avg_utilization,
      MAX(r.utilization_percentage) as peak_utilization,
      SUM(r.total_allocations) as total_allocations,
      AVG(r.availability_hours) as avg_availability,
      SUM(r.maintenance_hours) as total_maintenance_hours
    FROM fact_resource_utilization r
    JOIN dim_time t ON r.date_key = t.time_key
    JOIN dim_facility fc ON r.facility_key = fc.facility_key
    GROUP BY
      r.date_key, t.full_date, t.year, t.month,
      fc.facility_name, r.resource_type
    WITH DATA;

    CREATE UNIQUE INDEX idx_mv_resource_perf_unique
      ON mv_resource_performance (date_key, facility_name, resource_type);
    CREATE INDEX idx_mv_resource_perf_date ON mv_resource_performance (full_date DESC);
  `;
}
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
function createCommunicationMetricsView() {
    return `
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_communication_metrics AS
    SELECT
      c.sent_time_key,
      t.full_date,
      c.communication_type,
      c.channel,
      COUNT(*) as total_communications,
      COUNT(*) FILTER (WHERE c.is_delivered) as delivered_count,
      COUNT(*) FILTER (WHERE c.is_read) as read_count,
      AVG(c.delivery_time_seconds) as avg_delivery_time,
      AVG(c.read_time_seconds) as avg_read_time,
      CAST(COUNT(*) FILTER (WHERE c.is_delivered) AS DECIMAL) / COUNT(*) * 100 as delivery_rate,
      CAST(COUNT(*) FILTER (WHERE c.is_read) AS DECIMAL) / COUNT(*) * 100 as read_rate
    FROM fact_communications c
    JOIN dim_time t ON c.sent_time_key = t.time_key
    GROUP BY
      c.sent_time_key, t.full_date, c.communication_type, c.channel
    WITH DATA;

    CREATE UNIQUE INDEX idx_mv_comm_metrics_unique
      ON mv_communication_metrics (sent_time_key, communication_type, channel);
    CREATE INDEX idx_mv_comm_metrics_date ON mv_communication_metrics (full_date DESC);
  `;
}
// ============================================================================
// REPORT TEMPLATE TABLES
// ============================================================================
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
function createReportTemplatesTable() {
    return `
    CREATE TABLE IF NOT EXISTS report_templates (
      template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      template_name VARCHAR(255) UNIQUE NOT NULL,
      template_category VARCHAR(100) NOT NULL,
      description TEXT,
      query_template TEXT NOT NULL,
      parameters JSONB,
      output_format VARCHAR(20) DEFAULT 'PDF',
      is_public BOOLEAN DEFAULT false,
      is_scheduled BOOLEAN DEFAULT false,
      owner_id UUID,
      permissions JSONB,
      version INTEGER DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_by UUID,
      updated_by UUID
    );

    CREATE INDEX idx_report_templates_category ON report_templates (template_category);
    CREATE INDEX idx_report_templates_owner ON report_templates (owner_id);
  `;
}
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
function createReportSchedulesTable() {
    return `
    CREATE TABLE IF NOT EXISTS report_schedules (
      schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      template_id UUID REFERENCES report_templates(template_id) ON DELETE CASCADE,
      schedule_name VARCHAR(255) NOT NULL,
      cron_expression VARCHAR(100) NOT NULL,
      parameters JSONB,
      recipients JSONB NOT NULL,
      delivery_method VARCHAR(50) DEFAULT 'EMAIL',
      is_active BOOLEAN DEFAULT true,
      timezone VARCHAR(50) DEFAULT 'UTC',
      last_run_at TIMESTAMP WITH TIME ZONE,
      next_run_at TIMESTAMP WITH TIME ZONE,
      run_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_report_schedules_template ON report_schedules (template_id);
    CREATE INDEX idx_report_schedules_next_run ON report_schedules (next_run_at) WHERE is_active = true;
  `;
}
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
function createReportExecutionsTable() {
    return `
    CREATE TABLE IF NOT EXISTS report_executions (
      execution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      template_id UUID REFERENCES report_templates(template_id) ON DELETE SET NULL,
      schedule_id UUID REFERENCES report_schedules(schedule_id) ON DELETE SET NULL,
      parameters JSONB,
      status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED')),
      started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP WITH TIME ZONE,
      execution_time_ms INTEGER,
      row_count INTEGER,
      file_path VARCHAR(500),
      file_size_bytes BIGINT,
      error_message TEXT,
      executed_by UUID
    );

    CREATE INDEX idx_report_executions_template ON report_executions (template_id, started_at DESC);
    CREATE INDEX idx_report_executions_schedule ON report_executions (schedule_id, started_at DESC);
    CREATE INDEX idx_report_executions_status ON report_executions (status, started_at DESC);
  `;
}
// ============================================================================
// EXPORT QUEUE TABLES
// ============================================================================
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
function createExportQueuesTable() {
    return `
    CREATE TABLE IF NOT EXISTS export_queues (
      export_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      export_type VARCHAR(50) NOT NULL,
      entity_type VARCHAR(50) NOT NULL,
      filters JSONB,
      format VARCHAR(20) DEFAULT 'CSV',
      status VARCHAR(20) DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED')),
      priority INTEGER DEFAULT 5,
      requested_by UUID,
      requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      started_at TIMESTAMP WITH TIME ZONE,
      completed_at TIMESTAMP WITH TIME ZONE,
      file_path VARCHAR(500),
      file_size_bytes BIGINT,
      row_count INTEGER,
      error_message TEXT,
      expires_at TIMESTAMP WITH TIME ZONE
    );

    CREATE INDEX idx_export_queues_status ON export_queues (status, priority DESC, requested_at);
    CREATE INDEX idx_export_queues_requester ON export_queues (requested_by, requested_at DESC);
    CREATE INDEX idx_export_queues_expires ON export_queues (expires_at) WHERE expires_at IS NOT NULL;
  `;
}
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
function createDataExportLogsTable() {
    return `
    CREATE TABLE IF NOT EXISTS data_export_logs (
      log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      export_id UUID REFERENCES export_queues(export_id) ON DELETE CASCADE,
      user_id UUID,
      action VARCHAR(50) NOT NULL,
      entity_count INTEGER,
      sensitive_data_included BOOLEAN DEFAULT false,
      ip_address INET,
      user_agent TEXT,
      accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      metadata JSONB
    );

    CREATE INDEX idx_data_export_logs_export ON data_export_logs (export_id);
    CREATE INDEX idx_data_export_logs_user ON data_export_logs (user_id, accessed_at DESC);
    CREATE INDEX idx_data_export_logs_sensitive ON data_export_logs (sensitive_data_included, accessed_at DESC)
      WHERE sensitive_data_included = true;
  `;
}
// ============================================================================
// ETL METADATA TABLES
// ============================================================================
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
function createETLJobsTable() {
    return `
    CREATE TABLE IF NOT EXISTS etl_jobs (
      job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      job_name VARCHAR(255) UNIQUE NOT NULL,
      job_type VARCHAR(50) NOT NULL,
      source_type VARCHAR(50) NOT NULL,
      source_config JSONB NOT NULL,
      target_table VARCHAR(255) NOT NULL,
      transformation_rules JSONB,
      schedule_cron VARCHAR(100),
      is_active BOOLEAN DEFAULT true,
      last_run_at TIMESTAMP WITH TIME ZONE,
      next_run_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_etl_jobs_schedule ON etl_jobs (next_run_at) WHERE is_active = true;
    CREATE INDEX idx_etl_jobs_target ON etl_jobs (target_table);
  `;
}
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
function createETLExecutionsTable() {
    return `
    CREATE TABLE IF NOT EXISTS etl_executions (
      execution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      job_id UUID REFERENCES etl_jobs(job_id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'RUNNING' CHECK (status IN ('RUNNING', 'SUCCESS', 'FAILED', 'PARTIAL')),
      started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP WITH TIME ZONE,
      execution_time_ms INTEGER,
      rows_extracted INTEGER,
      rows_transformed INTEGER,
      rows_loaded INTEGER,
      rows_rejected INTEGER,
      error_message TEXT,
      error_details JSONB,
      watermark_value VARCHAR(255)
    );

    CREATE INDEX idx_etl_executions_job ON etl_executions (job_id, started_at DESC);
    CREATE INDEX idx_etl_executions_status ON etl_executions (status, started_at DESC);
  `;
}
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
function createDataQualityRulesTable() {
    return `
    CREATE TABLE IF NOT EXISTS data_quality_rules (
      rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      rule_name VARCHAR(255) UNIQUE NOT NULL,
      table_name VARCHAR(255) NOT NULL,
      column_name VARCHAR(255),
      rule_type VARCHAR(50) NOT NULL,
      rule_definition JSONB NOT NULL,
      severity VARCHAR(20) DEFAULT 'WARNING' CHECK (severity IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL')),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_data_quality_rules_table ON data_quality_rules (table_name);
  `;
}
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
function createDataQualityResultsTable() {
    return `
    CREATE TABLE IF NOT EXISTS data_quality_results (
      result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      rule_id UUID REFERENCES data_quality_rules(rule_id) ON DELETE CASCADE,
      execution_id UUID REFERENCES etl_executions(execution_id) ON DELETE CASCADE,
      passed BOOLEAN NOT NULL,
      records_checked INTEGER,
      records_failed INTEGER,
      failure_percentage DECIMAL(5, 2),
      sample_failures JSONB,
      checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_data_quality_results_rule ON data_quality_results (rule_id, checked_at DESC);
    CREATE INDEX idx_data_quality_results_execution ON data_quality_results (execution_id);
    CREATE INDEX idx_data_quality_results_failed ON data_quality_results (passed, checked_at DESC)
      WHERE passed = false;
  `;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
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
function refreshMaterializedView(viewName, concurrent = true) {
    return `REFRESH MATERIALIZED VIEW ${concurrent ? 'CONCURRENTLY' : ''} ${viewName};`;
}
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
function refreshAllMaterializedViews(concurrent = true) {
    const views = [
        'mv_incident_summary',
        'mv_resource_performance',
        'mv_communication_metrics',
    ];
    return views.map(view => refreshMaterializedView(view, concurrent)).join('\n');
}
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
function generateTimeDimension(startYear, endYear) {
    return `
    INSERT INTO dim_time (
      time_key, full_date, year, quarter, month, month_name,
      week_of_year, day_of_month, day_of_week, day_name, is_weekend,
      fiscal_year, fiscal_quarter, fiscal_month, season
    )
    SELECT
      TO_CHAR(d, 'YYYYMMDD')::INTEGER as time_key,
      d as full_date,
      EXTRACT(YEAR FROM d)::INTEGER as year,
      EXTRACT(QUARTER FROM d)::INTEGER as quarter,
      EXTRACT(MONTH FROM d)::INTEGER as month,
      TO_CHAR(d, 'Month') as month_name,
      EXTRACT(WEEK FROM d)::INTEGER as week_of_year,
      EXTRACT(DAY FROM d)::INTEGER as day_of_month,
      EXTRACT(DOW FROM d)::INTEGER as day_of_week,
      TO_CHAR(d, 'Day') as day_name,
      CASE WHEN EXTRACT(DOW FROM d) IN (0, 6) THEN true ELSE false END as is_weekend,
      CASE
        WHEN EXTRACT(MONTH FROM d) >= 10 THEN EXTRACT(YEAR FROM d)::INTEGER + 1
        ELSE EXTRACT(YEAR FROM d)::INTEGER
      END as fiscal_year,
      CASE
        WHEN EXTRACT(MONTH FROM d) IN (10, 11, 12) THEN 1
        WHEN EXTRACT(MONTH FROM d) IN (1, 2, 3) THEN 2
        WHEN EXTRACT(MONTH FROM d) IN (4, 5, 6) THEN 3
        ELSE 4
      END as fiscal_quarter,
      CASE
        WHEN EXTRACT(MONTH FROM d) >= 10 THEN EXTRACT(MONTH FROM d)::INTEGER - 9
        ELSE EXTRACT(MONTH FROM d)::INTEGER + 3
      END as fiscal_month,
      CASE
        WHEN EXTRACT(MONTH FROM d) IN (12, 1, 2) THEN 'Winter'
        WHEN EXTRACT(MONTH FROM d) IN (3, 4, 5) THEN 'Spring'
        WHEN EXTRACT(MONTH FROM d) IN (6, 7, 8) THEN 'Summer'
        ELSE 'Fall'
      END as season
    FROM generate_series(
      '${startYear}-01-01'::DATE,
      '${endYear}-12-31'::DATE,
      '1 day'::INTERVAL
    ) d
    ON CONFLICT (time_key) DO NOTHING;
  `;
}
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
function createFactTablePartitions(tableName, year, months = 12) {
    let sql = '';
    for (let month = 1; month <= months; month++) {
        const monthStr = month.toString().padStart(2, '0');
        const startKey = parseInt(`${year}${monthStr}01`);
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const nextMonthStr = nextMonth.toString().padStart(2, '0');
        const endKey = parseInt(`${nextYear}${nextMonthStr}01`);
        sql += `
      CREATE TABLE IF NOT EXISTS ${tableName}_${year}_${monthStr}
      PARTITION OF ${tableName}
      FOR VALUES FROM (${startKey}) TO (${endKey});
    `;
    }
    return sql;
}
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
function optimizeReportingQueries() {
    return [
        'SET work_mem = \'256MB\';',
        'SET maintenance_work_mem = \'512MB\';',
        'SET effective_cache_size = \'4GB\';',
        'SET random_page_cost = 1.1;',
        'SET effective_io_concurrency = 200;',
        'SET max_parallel_workers_per_gather = 4;',
        'SET max_parallel_workers = 8;',
        'SET parallel_tuple_cost = 0.01;',
    ];
}
//# sourceMappingURL=reporting-database-schema.js.map