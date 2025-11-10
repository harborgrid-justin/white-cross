/**
 * @fileoverview Command Center Database Schema Management
 * @module reuse/command/command-database-schema
 * @description Comprehensive database schema design and management utilities for healthcare command center systems.
 * Provides production-ready table definitions, indexing strategies, partitioning, migration helpers, and performance
 * optimization functions for incident management, resource tracking, communication logs, and operational data.
 *
 * Key Features:
 * - Incident management schema (incidents, alerts, escalations)
 * - Resource tracking tables (personnel, equipment, facilities)
 * - Communication logs and audit trails
 * - Command hierarchy and organizational structure
 * - Geographic data and location tracking
 * - User authentication and role-based access control
 * - System configuration and settings management
 * - Integration tables for external systems
 * - Time-series data partitioning strategies
 * - Comprehensive indexing for query optimization
 * - Migration helpers with rollback support
 * - Performance monitoring and optimization
 * - HIPAA-compliant audit logging
 * - Data retention and archival policies
 *
 * @architecture PostgreSQL-focused design with:
 * - Third normal form (3NF) for transactional integrity
 * - Strategic denormalization for read performance
 * - Table partitioning for time-series data
 * - Composite indexes for common query patterns
 * - Foreign key constraints for referential integrity
 * - Row-level security for multi-tenancy
 * - Materialized views for complex aggregations
 *
 * @performance
 * - Optimized for mixed read/write workloads
 * - Partitioning strategy for large tables (incidents, logs)
 * - Index design for common access patterns
 * - Connection pooling configuration
 * - Query plan optimization
 * - Vacuum and analyze strategies
 *
 * @security
 * - Encrypted columns for PHI/PII data
 * - Row-level security policies
 * - Audit triggers on sensitive tables
 * - Secure password hashing (bcrypt/Argon2)
 * - Token and session management
 * - IP-based access controls
 *
 * @example Basic usage
 * ```typescript
 * import { createIncidentsTable, addIncidentIndexes, createIncidentPartitions } from './command-database-schema';
 *
 * // Create incidents table
 * const createTableSQL = createIncidentsTable();
 * await db.query(createTableSQL);
 *
 * // Add optimized indexes
 * const indexSQL = addIncidentIndexes();
 * await db.query(indexSQL);
 *
 * // Setup partitioning
 * const partitionSQL = createIncidentPartitions(2025, 12);
 * await db.query(partitionSQL);
 * ```
 *
 * @example Migration workflow
 * ```typescript
 * import { generateMigration, runMigration, rollbackMigration } from './command-database-schema';
 *
 * // Generate migration
 * const migration = generateMigration('add_incident_tags', {
 *   up: 'ALTER TABLE incidents ADD COLUMN tags TEXT[];',
 *   down: 'ALTER TABLE incidents DROP COLUMN tags;'
 * });
 *
 * // Run migration
 * await runMigration(db, migration);
 *
 * // Rollback if needed
 * await rollbackMigration(db, migration);
 * ```
 *
 * LOC: DB4E8F
 * UPSTREAM: pg, sequelize, typeorm
 * DOWNSTREAM: incident.service.ts, resource.service.ts, command.module.ts
 *
 * @version 1.0.0
 * @since 2025-11-09
 */
/**
 * @interface TableDefinition
 * @description Schema definition for database table
 */
export interface TableDefinition {
    /** Table name */
    tableName: string;
    /** Column definitions */
    columns: ColumnDefinition[];
    /** Primary key column(s) */
    primaryKey: string | string[];
    /** Foreign key constraints */
    foreignKeys?: ForeignKeyDefinition[];
    /** Unique constraints */
    uniqueConstraints?: string[][];
    /** Check constraints */
    checkConstraints?: string[];
    /** Indexes to create */
    indexes?: IndexDefinition[];
    /** Partitioning strategy */
    partitionBy?: PartitionStrategy;
}
/**
 * @interface ColumnDefinition
 * @description Definition for table column
 */
export interface ColumnDefinition {
    /** Column name */
    name: string;
    /** Data type */
    type: string;
    /** Not null constraint */
    notNull?: boolean;
    /** Default value */
    defaultValue?: string;
    /** Unique constraint */
    unique?: boolean;
    /** Column comment */
    comment?: string;
}
/**
 * @interface ForeignKeyDefinition
 * @description Foreign key constraint definition
 */
export interface ForeignKeyDefinition {
    /** Column name(s) */
    columns: string | string[];
    /** Referenced table */
    referencesTable: string;
    /** Referenced column(s) */
    referencesColumns: string | string[];
    /** On delete action */
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    /** On update action */
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}
/**
 * @interface IndexDefinition
 * @description Index definition
 */
export interface IndexDefinition {
    /** Index name */
    name: string;
    /** Column(s) to index */
    columns: string | string[];
    /** Index type */
    type?: 'btree' | 'hash' | 'gist' | 'gin' | 'brin';
    /** Unique index */
    unique?: boolean;
    /** Partial index where clause */
    where?: string;
    /** Covering/included columns */
    include?: string[];
}
/**
 * @interface PartitionStrategy
 * @description Table partitioning configuration
 */
export interface PartitionStrategy {
    /** Partition method */
    method: 'RANGE' | 'LIST' | 'HASH';
    /** Partition key column(s) */
    key: string | string[];
    /** Partition interval (for range) */
    interval?: 'MONTH' | 'WEEK' | 'DAY';
}
/**
 * @interface MigrationDefinition
 * @description Database migration definition
 */
export interface MigrationDefinition {
    /** Migration ID */
    id: string;
    /** Migration name */
    name: string;
    /** Up migration SQL */
    up: string;
    /** Down migration SQL */
    down: string;
    /** Timestamp */
    timestamp: Date;
}
/**
 * @interface QueryOptimization
 * @description Query optimization suggestion
 */
export interface QueryOptimization {
    /** Table name */
    table: string;
    /** Suggested action */
    action: 'ADD_INDEX' | 'PARTITION' | 'VACUUM' | 'ANALYZE' | 'REINDEX';
    /** SQL to execute */
    sql: string;
    /** Reason for suggestion */
    reason: string;
    /** Priority (1-5) */
    priority: number;
}
/**
 * @function createIncidentsTable
 * @description Creates the main incidents table for tracking healthcare emergencies and events
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createIncidentsTable();
 * await db.query(sql);
 * ```
 */
export declare function createIncidentsTable(): string;
/**
 * @function createIncidentPartitions
 * @description Creates monthly partitions for incidents table
 *
 * @param {number} year - Year to create partitions for
 * @param {number} months - Number of months to create (default 12)
 * @returns {string} SQL to create partitions
 *
 * @example
 * ```typescript
 * const sql = createIncidentPartitions(2025, 12);
 * await db.query(sql);
 * ```
 */
export declare function createIncidentPartitions(year: number, months?: number): string;
/**
 * @function createIncidentHistoryTable
 * @description Creates audit trail table for incident changes
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createIncidentHistoryTable();
 * await db.query(sql);
 * ```
 */
export declare function createIncidentHistoryTable(): string;
/**
 * @function createIncidentNotesTable
 * @description Creates table for incident notes and comments
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createIncidentNotesTable();
 * await db.query(sql);
 * ```
 */
export declare function createIncidentNotesTable(): string;
/**
 * @function createIncidentAssignmentsTable
 * @description Creates table for tracking incident team assignments
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createIncidentAssignmentsTable();
 * await db.query(sql);
 * ```
 */
export declare function createIncidentAssignmentsTable(): string;
/**
 * @function createResourcesTable
 * @description Creates table for tracking medical and operational resources
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createResourcesTable();
 * await db.query(sql);
 * ```
 */
export declare function createResourcesTable(): string;
/**
 * @function createResourceAllocationsTable
 * @description Creates table for tracking resource allocations to incidents
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createResourceAllocationsTable();
 * await db.query(sql);
 * ```
 */
export declare function createResourceAllocationsTable(): string;
/**
 * @function createPersonnelTable
 * @description Creates table for healthcare personnel and staff tracking
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createPersonnelTable();
 * await db.query(sql);
 * ```
 */
export declare function createPersonnelTable(): string;
/**
 * @function createCommunicationLogsTable
 * @description Creates table for tracking all system communications
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createCommunicationLogsTable();
 * await db.query(sql);
 * ```
 */
export declare function createCommunicationLogsTable(): string;
/**
 * @function createCommunicationPartitions
 * @description Creates monthly partitions for communication logs
 *
 * @param {number} year - Year to create partitions for
 * @param {number} months - Number of months
 * @returns {string} SQL to create partitions
 *
 * @example
 * ```typescript
 * const sql = createCommunicationPartitions(2025, 12);
 * await db.query(sql);
 * ```
 */
export declare function createCommunicationPartitions(year: number, months?: number): string;
/**
 * @function createNotificationQueuesTable
 * @description Creates table for managing notification delivery queues
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createNotificationQueuesTable();
 * await db.query(sql);
 * ```
 */
export declare function createNotificationQueuesTable(): string;
/**
 * @function createCommandStructuresTable
 * @description Creates table for organizational command hierarchy
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createCommandStructuresTable();
 * await db.query(sql);
 * ```
 */
export declare function createCommandStructuresTable(): string;
/**
 * @function createTeamsTable
 * @description Creates table for operational teams
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createTeamsTable();
 * await db.query(sql);
 * ```
 */
export declare function createTeamsTable(): string;
/**
 * @function createTeamMembersTable
 * @description Creates table for team membership tracking
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createTeamMembersTable();
 * await db.query(sql);
 * ```
 */
export declare function createTeamMembersTable(): string;
/**
 * @function createLocationsTable
 * @description Creates table for geographic locations with PostGIS support
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createLocationsTable();
 * await db.query(sql);
 * ```
 */
export declare function createLocationsTable(): string;
/**
 * @function createFacilitiesTable
 * @description Creates table for healthcare facilities
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createFacilitiesTable();
 * await db.query(sql);
 * ```
 */
export declare function createFacilitiesTable(): string;
/**
 * @function createUsersTable
 * @description Creates table for user authentication and profiles
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createUsersTable();
 * await db.query(sql);
 * ```
 */
export declare function createUsersTable(): string;
/**
 * @function createRolesTable
 * @description Creates table for role-based access control
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createRolesTable();
 * await db.query(sql);
 * ```
 */
export declare function createRolesTable(): string;
/**
 * @function createUserRolesTable
 * @description Creates junction table for user-role assignments
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createUserRolesTable();
 * await db.query(sql);
 * ```
 */
export declare function createUserRolesTable(): string;
/**
 * @function createSessionsTable
 * @description Creates table for user session management
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createSessionsTable();
 * await db.query(sql);
 * ```
 */
export declare function createSessionsTable(): string;
/**
 * @function createSystemConfigTable
 * @description Creates table for system configuration settings
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createSystemConfigTable();
 * await db.query(sql);
 * ```
 */
export declare function createSystemConfigTable(): string;
/**
 * @function createAuditLogsTable
 * @description Creates table for comprehensive audit logging (HIPAA compliant)
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createAuditLogsTable();
 * await db.query(sql);
 * ```
 */
export declare function createAuditLogsTable(): string;
/**
 * @function createAuditLogPartitions
 * @description Creates monthly partitions for audit logs
 *
 * @param {number} year - Year to create partitions for
 * @param {number} months - Number of months
 * @returns {string} SQL to create partitions
 *
 * @example
 * ```typescript
 * const sql = createAuditLogPartitions(2025, 12);
 * await db.query(sql);
 * ```
 */
export declare function createAuditLogPartitions(year: number, months?: number): string;
/**
 * @function createIntegrationConnectionsTable
 * @description Creates table for external system integration configurations
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createIntegrationConnectionsTable();
 * await db.query(sql);
 * ```
 */
export declare function createIntegrationConnectionsTable(): string;
/**
 * @function createIntegrationLogsTable
 * @description Creates table for tracking integration synchronization logs
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createIntegrationLogsTable();
 * await db.query(sql);
 * ```
 */
export declare function createIntegrationLogsTable(): string;
/**
 * @function addCompositIndexes
 * @description Creates composite indexes for common query patterns
 *
 * @returns {string} SQL to create composite indexes
 *
 * @example
 * ```typescript
 * const sql = addCompositeIndexes();
 * await db.query(sql);
 * ```
 */
export declare function addCompositeIndexes(): string;
/**
 * @function addCoveringIndexes
 * @description Creates covering indexes for index-only scans
 *
 * @returns {string} SQL to create covering indexes
 *
 * @example
 * ```typescript
 * const sql = addCoveringIndexes();
 * await db.query(sql);
 * ```
 */
export declare function addCoveringIndexes(): string;
/**
 * @function addPartialIndexes
 * @description Creates partial indexes for filtered queries
 *
 * @returns {string} SQL to create partial indexes
 *
 * @example
 * ```typescript
 * const sql = addPartialIndexes();
 * await db.query(sql);
 * ```
 */
export declare function addPartialIndexes(): string;
/**
 * @function createMigrationsTable
 * @description Creates table to track database migrations
 *
 * @returns {string} SQL CREATE TABLE statement
 *
 * @example
 * ```typescript
 * const sql = createMigrationsTable();
 * await db.query(sql);
 * ```
 */
export declare function createMigrationsTable(): string;
/**
 * @function generateMigration
 * @description Generates a migration definition object
 *
 * @param {string} name - Migration name
 * @param {string} up - Up migration SQL
 * @param {string} down - Down migration SQL
 * @returns {MigrationDefinition} Migration definition
 *
 * @example
 * ```typescript
 * const migration = generateMigration(
 *   'add_incident_priority',
 *   'ALTER TABLE incidents ADD COLUMN priority INTEGER;',
 *   'ALTER TABLE incidents DROP COLUMN priority;'
 * );
 * ```
 */
export declare function generateMigration(name: string, up: string, down: string): MigrationDefinition;
/**
 * @function runMigration
 * @description Executes a migration and records it
 *
 * @param {any} db - Database connection
 * @param {MigrationDefinition} migration - Migration to run
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await runMigration(db, migration);
 * ```
 */
export declare function runMigration(db: any, migration: MigrationDefinition): Promise<void>;
/**
 * @function rollbackMigration
 * @description Rolls back a migration
 *
 * @param {any} db - Database connection
 * @param {MigrationDefinition} migration - Migration to rollback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackMigration(db, migration);
 * ```
 */
export declare function rollbackMigration(db: any, migration: MigrationDefinition): Promise<void>;
/**
 * @function analyzeTablePerformance
 * @description Generates performance analysis for a table
 *
 * @param {string} tableName - Table to analyze
 * @returns {string} SQL for performance analysis
 *
 * @example
 * ```typescript
 * const sql = analyzeTablePerformance('incidents');
 * const result = await db.query(sql);
 * ```
 */
export declare function analyzeTablePerformance(tableName: string): string;
/**
 * @function generateVacuumStrategy
 * @description Generates vacuum commands for maintenance
 *
 * @param {string[]} tables - Tables to vacuum
 * @param {boolean} analyze - Whether to analyze after vacuum
 * @returns {string} SQL vacuum commands
 *
 * @example
 * ```typescript
 * const sql = generateVacuumStrategy(['incidents', 'resources'], true);
 * await db.query(sql);
 * ```
 */
export declare function generateVacuumStrategy(tables: string[], analyze?: boolean): string;
/**
 * @function findMissingIndexes
 * @description Identifies tables that might benefit from indexes
 *
 * @returns {string} SQL to find missing indexes
 *
 * @example
 * ```typescript
 * const sql = findMissingIndexes();
 * const result = await db.query(sql);
 * ```
 */
export declare function findMissingIndexes(): string;
/**
 * @function findUnusedIndexes
 * @description Identifies indexes that are rarely or never used
 *
 * @returns {string} SQL to find unused indexes
 *
 * @example
 * ```typescript
 * const sql = findUnusedIndexes();
 * const result = await db.query(sql);
 * ```
 */
export declare function findUnusedIndexes(): string;
/**
 * @function generateConnectionPoolConfig
 * @description Generates optimized connection pool configuration
 *
 * @param {number} maxConnections - Maximum database connections
 * @returns {object} Connection pool configuration
 *
 * @example
 * ```typescript
 * const config = generateConnectionPoolConfig(100);
 * // Returns: { min: 10, max: 100, idleTimeoutMillis: 30000, ... }
 * ```
 */
export declare function generateConnectionPoolConfig(maxConnections: number): object;
/**
 * @function enableQueryLogging
 * @description Generates SQL to enable slow query logging
 *
 * @param {number} thresholdMs - Threshold in milliseconds
 * @returns {string} SQL to enable logging
 *
 * @example
 * ```typescript
 * const sql = enableQueryLogging(1000); // Log queries > 1 second
 * await db.query(sql);
 * ```
 */
export declare function enableQueryLogging(thresholdMs: number): string;
//# sourceMappingURL=command-database-schema.d.ts.map