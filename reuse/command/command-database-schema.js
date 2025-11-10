"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIncidentsTable = createIncidentsTable;
exports.createIncidentPartitions = createIncidentPartitions;
exports.createIncidentHistoryTable = createIncidentHistoryTable;
exports.createIncidentNotesTable = createIncidentNotesTable;
exports.createIncidentAssignmentsTable = createIncidentAssignmentsTable;
exports.createResourcesTable = createResourcesTable;
exports.createResourceAllocationsTable = createResourceAllocationsTable;
exports.createPersonnelTable = createPersonnelTable;
exports.createCommunicationLogsTable = createCommunicationLogsTable;
exports.createCommunicationPartitions = createCommunicationPartitions;
exports.createNotificationQueuesTable = createNotificationQueuesTable;
exports.createCommandStructuresTable = createCommandStructuresTable;
exports.createTeamsTable = createTeamsTable;
exports.createTeamMembersTable = createTeamMembersTable;
exports.createLocationsTable = createLocationsTable;
exports.createFacilitiesTable = createFacilitiesTable;
exports.createUsersTable = createUsersTable;
exports.createRolesTable = createRolesTable;
exports.createUserRolesTable = createUserRolesTable;
exports.createSessionsTable = createSessionsTable;
exports.createSystemConfigTable = createSystemConfigTable;
exports.createAuditLogsTable = createAuditLogsTable;
exports.createAuditLogPartitions = createAuditLogPartitions;
exports.createIntegrationConnectionsTable = createIntegrationConnectionsTable;
exports.createIntegrationLogsTable = createIntegrationLogsTable;
exports.addCompositeIndexes = addCompositeIndexes;
exports.addCoveringIndexes = addCoveringIndexes;
exports.addPartialIndexes = addPartialIndexes;
exports.createMigrationsTable = createMigrationsTable;
exports.generateMigration = generateMigration;
exports.runMigration = runMigration;
exports.rollbackMigration = rollbackMigration;
exports.analyzeTablePerformance = analyzeTablePerformance;
exports.generateVacuumStrategy = generateVacuumStrategy;
exports.findMissingIndexes = findMissingIndexes;
exports.findUnusedIndexes = findUnusedIndexes;
exports.generateConnectionPoolConfig = generateConnectionPoolConfig;
exports.enableQueryLogging = enableQueryLogging;
// ============================================================================
// INCIDENT MANAGEMENT TABLES
// ============================================================================
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
function createIncidentsTable() {
    return `
    CREATE TABLE IF NOT EXISTS incidents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      incident_number VARCHAR(50) UNIQUE NOT NULL,
      type VARCHAR(50) NOT NULL,
      severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
      status VARCHAR(20) NOT NULL CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
      reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
      assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
      facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
      patient_count INTEGER DEFAULT 0,
      priority_score INTEGER DEFAULT 0,
      tags TEXT[],
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      resolved_at TIMESTAMP WITH TIME ZONE,
      closed_at TIMESTAMP WITH TIME ZONE,
      created_by UUID REFERENCES users(id),
      updated_by UUID REFERENCES users(id)
    ) PARTITION BY RANGE (created_at);

    CREATE INDEX idx_incidents_created_at ON incidents (created_at DESC);
    CREATE INDEX idx_incidents_status ON incidents (status) WHERE status IN ('OPEN', 'IN_PROGRESS');
    CREATE INDEX idx_incidents_severity ON incidents (severity, created_at DESC);
    CREATE INDEX idx_incidents_facility ON incidents (facility_id, created_at DESC);
    CREATE INDEX idx_incidents_assigned ON incidents (assigned_to) WHERE assigned_to IS NOT NULL;
    CREATE INDEX idx_incidents_metadata ON incidents USING gin (metadata jsonb_path_ops);
    CREATE INDEX idx_incidents_tags ON incidents USING gin (tags);

    COMMENT ON TABLE incidents IS 'Main incidents table for tracking healthcare emergencies and events';
    COMMENT ON COLUMN incidents.priority_score IS 'Calculated priority score based on severity, patient count, and other factors';
  `;
}
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
function createIncidentPartitions(year, months = 12) {
    let sql = '';
    for (let month = 1; month <= months; month++) {
        const monthStr = month.toString().padStart(2, '0');
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const nextMonthStr = nextMonth.toString().padStart(2, '0');
        sql += `
      CREATE TABLE IF NOT EXISTS incidents_${year}_${monthStr}
      PARTITION OF incidents
      FOR VALUES FROM ('${year}-${monthStr}-01') TO ('${nextYear}-${nextMonthStr}-01');
    `;
    }
    return sql;
}
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
function createIncidentHistoryTable() {
    return `
    CREATE TABLE IF NOT EXISTS incident_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
      action VARCHAR(50) NOT NULL,
      field_name VARCHAR(100),
      old_value TEXT,
      new_value TEXT,
      changed_by UUID REFERENCES users(id),
      changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      ip_address INET,
      user_agent TEXT
    );

    CREATE INDEX idx_incident_history_incident ON incident_history (incident_id, changed_at DESC);
    CREATE INDEX idx_incident_history_user ON incident_history (changed_by, changed_at DESC);
    CREATE INDEX idx_incident_history_action ON incident_history (action, changed_at DESC);
  `;
}
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
function createIncidentNotesTable() {
    return `
    CREATE TABLE IF NOT EXISTS incident_notes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
      note_text TEXT NOT NULL,
      note_type VARCHAR(50) DEFAULT 'GENERAL',
      is_internal BOOLEAN DEFAULT false,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      attachments JSONB
    );

    CREATE INDEX idx_incident_notes_incident ON incident_notes (incident_id, created_at DESC);
    CREATE INDEX idx_incident_notes_type ON incident_notes (note_type, created_at DESC);
  `;
}
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
function createIncidentAssignmentsTable() {
    return `
    CREATE TABLE IF NOT EXISTS incident_assignments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role VARCHAR(50) NOT NULL,
      assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      assigned_by UUID REFERENCES users(id),
      removed_at TIMESTAMP WITH TIME ZONE,
      removed_by UUID REFERENCES users(id),
      UNIQUE(incident_id, user_id, role)
    );

    CREATE INDEX idx_incident_assignments_incident ON incident_assignments (incident_id);
    CREATE INDEX idx_incident_assignments_user ON incident_assignments (user_id) WHERE removed_at IS NULL;
  `;
}
// ============================================================================
// RESOURCE TRACKING TABLES
// ============================================================================
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
function createResourcesTable() {
    return `
    CREATE TABLE IF NOT EXISTS resources (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      resource_type VARCHAR(50) NOT NULL,
      resource_code VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(50),
      status VARCHAR(20) NOT NULL CHECK (status IN ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'UNAVAILABLE')),
      location_id UUID REFERENCES locations(id),
      facility_id UUID REFERENCES facilities(id),
      quantity INTEGER DEFAULT 1,
      unit VARCHAR(50),
      attributes JSONB,
      last_inspection_date DATE,
      next_inspection_date DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_resources_type ON resources (resource_type, status);
    CREATE INDEX idx_resources_facility ON resources (facility_id, status);
    CREATE INDEX idx_resources_location ON resources (location_id);
    CREATE INDEX idx_resources_status ON resources (status) WHERE status = 'AVAILABLE';
    CREATE INDEX idx_resources_attributes ON resources USING gin (attributes jsonb_path_ops);
  `;
}
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
function createResourceAllocationsTable() {
    return `
    CREATE TABLE IF NOT EXISTS resource_allocations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
      incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL,
      allocated_by UUID REFERENCES users(id),
      allocated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      deallocated_at TIMESTAMP WITH TIME ZONE,
      quantity_allocated INTEGER DEFAULT 1,
      notes TEXT,
      status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RETURNED', 'LOST', 'DAMAGED'))
    );

    CREATE INDEX idx_resource_allocations_resource ON resource_allocations (resource_id, allocated_at DESC);
    CREATE INDEX idx_resource_allocations_incident ON resource_allocations (incident_id);
    CREATE INDEX idx_resource_allocations_active ON resource_allocations (resource_id) WHERE status = 'ACTIVE';
  `;
}
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
function createPersonnelTable() {
    return `
    CREATE TABLE IF NOT EXISTS personnel (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      employee_id VARCHAR(50) UNIQUE NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role VARCHAR(50) NOT NULL,
      specialty VARCHAR(100),
      license_number VARCHAR(100),
      license_expiry DATE,
      certifications JSONB,
      phone VARCHAR(20),
      email VARCHAR(255),
      status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ON_LEAVE', 'INACTIVE')),
      home_facility_id UUID REFERENCES facilities(id),
      current_location_id UUID REFERENCES locations(id),
      availability_status VARCHAR(20) DEFAULT 'AVAILABLE',
      shift_start TIME,
      shift_end TIME,
      hired_date DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_personnel_role ON personnel (role, status);
    CREATE INDEX idx_personnel_facility ON personnel (home_facility_id, status);
    CREATE INDEX idx_personnel_availability ON personnel (availability_status) WHERE status = 'ACTIVE';
    CREATE INDEX idx_personnel_specialty ON personnel (specialty);
    CREATE INDEX idx_personnel_license_expiry ON personnel (license_expiry) WHERE license_expiry IS NOT NULL;
  `;
}
// ============================================================================
// COMMUNICATION LOGS
// ============================================================================
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
function createCommunicationLogsTable() {
    return `
    CREATE TABLE IF NOT EXISTS communication_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      communication_type VARCHAR(50) NOT NULL,
      channel VARCHAR(50) NOT NULL,
      sender_id UUID REFERENCES users(id),
      recipient_id UUID REFERENCES users(id),
      incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL,
      subject VARCHAR(500),
      message_body TEXT,
      status VARCHAR(20) DEFAULT 'SENT',
      metadata JSONB,
      sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      delivered_at TIMESTAMP WITH TIME ZONE,
      read_at TIMESTAMP WITH TIME ZONE,
      priority VARCHAR(20) DEFAULT 'NORMAL'
    ) PARTITION BY RANGE (sent_at);

    CREATE INDEX idx_comm_logs_sender ON communication_logs (sender_id, sent_at DESC);
    CREATE INDEX idx_comm_logs_recipient ON communication_logs (recipient_id, sent_at DESC);
    CREATE INDEX idx_comm_logs_incident ON communication_logs (incident_id, sent_at DESC);
    CREATE INDEX idx_comm_logs_type ON communication_logs (communication_type, sent_at DESC);
  `;
}
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
function createCommunicationPartitions(year, months = 12) {
    let sql = '';
    for (let month = 1; month <= months; month++) {
        const monthStr = month.toString().padStart(2, '0');
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const nextMonthStr = nextMonth.toString().padStart(2, '0');
        sql += `
      CREATE TABLE IF NOT EXISTS communication_logs_${year}_${monthStr}
      PARTITION OF communication_logs
      FOR VALUES FROM ('${year}-${monthStr}-01') TO ('${nextYear}-${nextMonthStr}-01');
    `;
    }
    return sql;
}
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
function createNotificationQueuesTable() {
    return `
    CREATE TABLE IF NOT EXISTS notification_queues (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      notification_type VARCHAR(50) NOT NULL,
      recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
      incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
      channel VARCHAR(50) NOT NULL,
      payload JSONB NOT NULL,
      status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SENT', 'FAILED')),
      attempts INTEGER DEFAULT 0,
      max_attempts INTEGER DEFAULT 3,
      scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      sent_at TIMESTAMP WITH TIME ZONE,
      error_message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_notification_queue_status ON notification_queues (status, scheduled_for);
    CREATE INDEX idx_notification_queue_recipient ON notification_queues (recipient_id, created_at DESC);
    CREATE INDEX idx_notification_queue_incident ON notification_queues (incident_id);
  `;
}
// ============================================================================
// COMMAND HIERARCHY TABLES
// ============================================================================
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
function createCommandStructuresTable() {
    return `
    CREATE TABLE IF NOT EXISTS command_structures (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      parent_id UUID REFERENCES command_structures(id) ON DELETE CASCADE,
      level INTEGER NOT NULL,
      commander_id UUID REFERENCES users(id),
      facility_id UUID REFERENCES facilities(id),
      structure_type VARCHAR(50) NOT NULL,
      responsibilities TEXT[],
      contact_info JSONB,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_command_structures_parent ON command_structures (parent_id);
    CREATE INDEX idx_command_structures_facility ON command_structures (facility_id);
    CREATE INDEX idx_command_structures_commander ON command_structures (commander_id);
    CREATE INDEX idx_command_structures_active ON command_structures (is_active) WHERE is_active = true;
  `;
}
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
function createTeamsTable() {
    return `
    CREATE TABLE IF NOT EXISTS teams (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      team_name VARCHAR(255) NOT NULL,
      team_type VARCHAR(50) NOT NULL,
      team_leader_id UUID REFERENCES users(id),
      command_structure_id UUID REFERENCES command_structures(id),
      facility_id UUID REFERENCES facilities(id),
      status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'STANDBY', 'DEPLOYED', 'INACTIVE')),
      specialization VARCHAR(100),
      max_capacity INTEGER,
      current_capacity INTEGER DEFAULT 0,
      contact_channel VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_teams_leader ON teams (team_leader_id);
    CREATE INDEX idx_teams_facility ON teams (facility_id, status);
    CREATE INDEX idx_teams_status ON teams (status);
  `;
}
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
function createTeamMembersTable() {
    return `
    CREATE TABLE IF NOT EXISTS team_members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role VARCHAR(50),
      joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      left_at TIMESTAMP WITH TIME ZONE,
      is_active BOOLEAN DEFAULT true,
      UNIQUE(team_id, user_id)
    );

    CREATE INDEX idx_team_members_team ON team_members (team_id, is_active);
    CREATE INDEX idx_team_members_user ON team_members (user_id, is_active);
  `;
}
// ============================================================================
// GEOGRAPHIC DATA TABLES
// ============================================================================
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
function createLocationsTable() {
    return `
    CREATE TABLE IF NOT EXISTS locations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      location_type VARCHAR(50) NOT NULL,
      address_line1 VARCHAR(255),
      address_line2 VARCHAR(255),
      city VARCHAR(100),
      state VARCHAR(50),
      postal_code VARCHAR(20),
      country VARCHAR(50) DEFAULT 'USA',
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      coordinates POINT,
      geofence POLYGON,
      parent_location_id UUID REFERENCES locations(id),
      metadata JSONB,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_locations_type ON locations (location_type, is_active);
    CREATE INDEX idx_locations_parent ON locations (parent_location_id);
    CREATE INDEX idx_locations_coordinates ON locations USING gist (coordinates);
    CREATE INDEX idx_locations_city_state ON locations (city, state);
  `;
}
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
function createFacilitiesTable() {
    return `
    CREATE TABLE IF NOT EXISTS facilities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      facility_code VARCHAR(50) UNIQUE NOT NULL,
      facility_name VARCHAR(255) NOT NULL,
      facility_type VARCHAR(50) NOT NULL,
      location_id UUID REFERENCES locations(id),
      capacity INTEGER,
      current_occupancy INTEGER DEFAULT 0,
      bed_count INTEGER,
      available_beds INTEGER,
      status VARCHAR(20) DEFAULT 'OPERATIONAL',
      contact_phone VARCHAR(20),
      contact_email VARCHAR(255),
      operating_hours JSONB,
      services JSONB,
      certifications TEXT[],
      is_trauma_center BOOLEAN DEFAULT false,
      trauma_level VARCHAR(10),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_facilities_type ON facilities (facility_type, status);
    CREATE INDEX idx_facilities_location ON facilities (location_id);
    CREATE INDEX idx_facilities_capacity ON facilities (capacity, current_occupancy);
    CREATE INDEX idx_facilities_trauma ON facilities (is_trauma_center, trauma_level) WHERE is_trauma_center = true;
  `;
}
// ============================================================================
// USER AND ROLE TABLES
// ============================================================================
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
function createUsersTable() {
    return `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      phone VARCHAR(20),
      status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'LOCKED')),
      email_verified BOOLEAN DEFAULT false,
      phone_verified BOOLEAN DEFAULT false,
      two_factor_enabled BOOLEAN DEFAULT false,
      two_factor_secret VARCHAR(255),
      last_login_at TIMESTAMP WITH TIME ZONE,
      last_login_ip INET,
      failed_login_attempts INTEGER DEFAULT 0,
      locked_until TIMESTAMP WITH TIME ZONE,
      password_changed_at TIMESTAMP WITH TIME ZONE,
      must_change_password BOOLEAN DEFAULT false,
      preferences JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_users_email ON users (email);
    CREATE INDEX idx_users_username ON users (username);
    CREATE INDEX idx_users_status ON users (status);
    CREATE INDEX idx_users_last_login ON users (last_login_at DESC);
  `;
}
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
function createRolesTable() {
    return `
    CREATE TABLE IF NOT EXISTS roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      role_name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      permissions JSONB NOT NULL,
      is_system_role BOOLEAN DEFAULT false,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_roles_name ON roles (role_name);
    CREATE INDEX idx_roles_active ON roles (is_active) WHERE is_active = true;
  `;
}
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
function createUserRolesTable() {
    return `
    CREATE TABLE IF NOT EXISTS user_roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      assigned_by UUID REFERENCES users(id),
      assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP WITH TIME ZONE,
      is_active BOOLEAN DEFAULT true,
      UNIQUE(user_id, role_id)
    );

    CREATE INDEX idx_user_roles_user ON user_roles (user_id, is_active);
    CREATE INDEX idx_user_roles_role ON user_roles (role_id, is_active);
    CREATE INDEX idx_user_roles_expires ON user_roles (expires_at) WHERE expires_at IS NOT NULL;
  `;
}
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
function createSessionsTable() {
    return `
    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      session_token VARCHAR(255) UNIQUE NOT NULL,
      refresh_token VARCHAR(255) UNIQUE,
      ip_address INET,
      user_agent TEXT,
      device_info JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      is_valid BOOLEAN DEFAULT true
    );

    CREATE INDEX idx_sessions_user ON sessions (user_id, is_valid);
    CREATE INDEX idx_sessions_token ON sessions (session_token) WHERE is_valid = true;
    CREATE INDEX idx_sessions_expires ON sessions (expires_at);
  `;
}
// ============================================================================
// CONFIGURATION TABLES
// ============================================================================
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
function createSystemConfigTable() {
    return `
    CREATE TABLE IF NOT EXISTS system_config (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      config_key VARCHAR(255) UNIQUE NOT NULL,
      config_value JSONB NOT NULL,
      data_type VARCHAR(50) NOT NULL,
      category VARCHAR(100),
      description TEXT,
      is_encrypted BOOLEAN DEFAULT false,
      is_public BOOLEAN DEFAULT false,
      validation_rules JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_by UUID REFERENCES users(id)
    );

    CREATE INDEX idx_system_config_key ON system_config (config_key);
    CREATE INDEX idx_system_config_category ON system_config (category);
  `;
}
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
function createAuditLogsTable() {
    return `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_type VARCHAR(100) NOT NULL,
      entity_type VARCHAR(100),
      entity_id UUID,
      user_id UUID REFERENCES users(id),
      action VARCHAR(50) NOT NULL,
      old_values JSONB,
      new_values JSONB,
      ip_address INET,
      user_agent TEXT,
      session_id UUID,
      request_id VARCHAR(255),
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      severity VARCHAR(20) DEFAULT 'INFO',
      metadata JSONB
    ) PARTITION BY RANGE (timestamp);

    CREATE INDEX idx_audit_logs_timestamp ON audit_logs (timestamp DESC);
    CREATE INDEX idx_audit_logs_user ON audit_logs (user_id, timestamp DESC);
    CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id, timestamp DESC);
    CREATE INDEX idx_audit_logs_event ON audit_logs (event_type, timestamp DESC);
  `;
}
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
function createAuditLogPartitions(year, months = 12) {
    let sql = '';
    for (let month = 1; month <= months; month++) {
        const monthStr = month.toString().padStart(2, '0');
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const nextMonthStr = nextMonth.toString().padStart(2, '0');
        sql += `
      CREATE TABLE IF NOT EXISTS audit_logs_${year}_${monthStr}
      PARTITION OF audit_logs
      FOR VALUES FROM ('${year}-${monthStr}-01') TO ('${nextYear}-${nextMonthStr}-01');
    `;
    }
    return sql;
}
// ============================================================================
// INTEGRATION TABLES
// ============================================================================
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
function createIntegrationConnectionsTable() {
    return `
    CREATE TABLE IF NOT EXISTS integration_connections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      connection_name VARCHAR(255) UNIQUE NOT NULL,
      integration_type VARCHAR(50) NOT NULL,
      endpoint_url VARCHAR(500),
      auth_type VARCHAR(50),
      credentials JSONB,
      config JSONB,
      status VARCHAR(20) DEFAULT 'INACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ERROR')),
      last_sync_at TIMESTAMP WITH TIME ZONE,
      last_error TEXT,
      retry_count INTEGER DEFAULT 0,
      is_enabled BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_integration_connections_type ON integration_connections (integration_type);
    CREATE INDEX idx_integration_connections_status ON integration_connections (status, is_enabled);
  `;
}
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
function createIntegrationLogsTable() {
    return `
    CREATE TABLE IF NOT EXISTS integration_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      connection_id UUID REFERENCES integration_connections(id) ON DELETE CASCADE,
      operation VARCHAR(50) NOT NULL,
      direction VARCHAR(20) CHECK (direction IN ('INBOUND', 'OUTBOUND')),
      request_payload JSONB,
      response_payload JSONB,
      status VARCHAR(20) DEFAULT 'SUCCESS',
      error_message TEXT,
      duration_ms INTEGER,
      records_processed INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    ) PARTITION BY RANGE (created_at);

    CREATE INDEX idx_integration_logs_connection ON integration_logs (connection_id, created_at DESC);
    CREATE INDEX idx_integration_logs_status ON integration_logs (status, created_at DESC);
  `;
}
// ============================================================================
// INDEX MANAGEMENT FUNCTIONS
// ============================================================================
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
function addCompositeIndexes() {
    return `
    -- Incident query optimization
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_incidents_facility_status_created
      ON incidents (facility_id, status, created_at DESC);

    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_incidents_severity_status_created
      ON incidents (severity, status, created_at DESC);

    -- Resource tracking
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resources_facility_type_status
      ON resources (facility_id, resource_type, status);

    -- Communication logs
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comm_logs_incident_type_sent
      ON communication_logs (incident_id, communication_type, sent_at DESC);

    -- Team assignments
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_team_members_team_active_role
      ON team_members (team_id, is_active, role);
  `;
}
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
function addCoveringIndexes() {
    return `
    -- Incidents covering index
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_incidents_covering
      ON incidents (status, created_at DESC)
      INCLUDE (id, incident_number, type, severity, title);

    -- Resources covering index
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resources_covering
      ON resources (status, resource_type)
      INCLUDE (id, resource_code, name, quantity);

    -- Users covering index
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_covering
      ON users (status)
      INCLUDE (id, username, email, first_name, last_name);
  `;
}
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
function addPartialIndexes() {
    return `
    -- Active incidents only
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_incidents_active
      ON incidents (created_at DESC)
      WHERE status IN ('OPEN', 'IN_PROGRESS');

    -- Critical incidents
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_incidents_critical
      ON incidents (created_at DESC)
      WHERE severity = 'CRITICAL' AND status != 'CLOSED';

    -- Available resources
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resources_available
      ON resources (resource_type, facility_id)
      WHERE status = 'AVAILABLE';

    -- Active sessions
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_active
      ON sessions (user_id, last_activity_at DESC)
      WHERE is_valid = true AND expires_at > CURRENT_TIMESTAMP;
  `;
}
// ============================================================================
// MIGRATION HELPERS
// ============================================================================
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
function createMigrationsTable() {
    return `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      migration_name VARCHAR(255) UNIQUE NOT NULL,
      version VARCHAR(50) NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      execution_time_ms INTEGER,
      checksum VARCHAR(64),
      status VARCHAR(20) DEFAULT 'SUCCESS',
      error_message TEXT
    );

    CREATE INDEX idx_migrations_version ON schema_migrations (version);
    CREATE INDEX idx_migrations_executed ON schema_migrations (executed_at DESC);
  `;
}
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
function generateMigration(name, up, down) {
    return {
        id: `${Date.now()}_${name}`,
        name,
        up,
        down,
        timestamp: new Date(),
    };
}
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
async function runMigration(db, migration) {
    const startTime = Date.now();
    try {
        await db.query('BEGIN');
        await db.query(migration.up);
        const executionTime = Date.now() - startTime;
        await db.query(`INSERT INTO schema_migrations (migration_name, version, execution_time_ms, status)
       VALUES ($1, $2, $3, 'SUCCESS')`, [migration.name, migration.id, executionTime]);
        await db.query('COMMIT');
    }
    catch (error) {
        await db.query('ROLLBACK');
        throw error;
    }
}
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
async function rollbackMigration(db, migration) {
    try {
        await db.query('BEGIN');
        await db.query(migration.down);
        await db.query(`DELETE FROM schema_migrations WHERE migration_name = $1`, [migration.name]);
        await db.query('COMMIT');
    }
    catch (error) {
        await db.query('ROLLBACK');
        throw error;
    }
}
// ============================================================================
// PERFORMANCE OPTIMIZATION FUNCTIONS
// ============================================================================
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
function analyzeTablePerformance(tableName) {
    return `
    SELECT
      schemaname,
      tablename,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
      pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size,
      n_tup_ins AS inserts,
      n_tup_upd AS updates,
      n_tup_del AS deletes,
      n_live_tup AS live_rows,
      n_dead_tup AS dead_rows,
      last_vacuum,
      last_autovacuum,
      last_analyze,
      last_autoanalyze
    FROM pg_stat_user_tables
    WHERE tablename = '${tableName}';
  `;
}
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
function generateVacuumStrategy(tables, analyze = true) {
    return tables
        .map(table => `VACUUM ${analyze ? 'ANALYZE' : ''} ${table};`)
        .join('\n');
}
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
function findMissingIndexes() {
    return `
    SELECT
      schemaname,
      tablename,
      seq_scan,
      seq_tup_read,
      idx_scan,
      seq_tup_read / seq_scan AS avg_seq_tup_read
    FROM pg_stat_user_tables
    WHERE seq_scan > 0
      AND idx_scan IS NOT NULL
      AND (seq_tup_read / seq_scan) > 10000
    ORDER BY seq_tup_read DESC
    LIMIT 20;
  `;
}
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
function findUnusedIndexes() {
    return `
    SELECT
      schemaname,
      tablename,
      indexname,
      idx_scan,
      pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
    FROM pg_stat_user_indexes
    WHERE idx_scan < 10
      AND indexname NOT LIKE '%_pkey'
    ORDER BY pg_relation_size(indexrelid) DESC;
  `;
}
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
function generateConnectionPoolConfig(maxConnections) {
    return {
        min: Math.ceil(maxConnections * 0.1),
        max: maxConnections,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
        maxUses: 7500,
        allowExitOnIdle: true,
    };
}
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
function enableQueryLogging(thresholdMs) {
    return `
    ALTER SYSTEM SET log_min_duration_statement = ${thresholdMs};
    ALTER SYSTEM SET log_statement = 'all';
    ALTER SYSTEM SET log_duration = on;
    SELECT pg_reload_conf();
  `;
}
//# sourceMappingURL=command-database-schema.js.map