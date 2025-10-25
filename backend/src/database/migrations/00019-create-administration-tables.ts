/**
 * @fileoverview Administration Tables Migration
 * @module database/migrations/00019
 * @description Creates all administration-related tables for organizational hierarchy and system management
 *
 * Tables Created:
 * - districts: Top-level organizational units
 * - schools: Educational institutions within districts
 * - system_configuration: System-wide configuration settings
 * - configuration_history: Configuration change audit trail
 * - backup_logs: System backup logging
 * - performance_metrics: Performance monitoring data
 * - licenses: License management for districts/schools
 * - training_modules: Training content management
 * - training_completions: Training completion tracking
 *
 * LOC: ADMIN-MIG-001
 * WC-MIG-019 | Create administration tables migration
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // ============ DISTRICTS TABLE ============
  await queryInterface.createTable('districts', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Districts indexes
  await queryInterface.addIndex('districts', ['code'], {
    name: 'districts_code_unique_idx',
    unique: true,
  });
  await queryInterface.addIndex('districts', ['isActive'], {
    name: 'districts_is_active_idx',
  });
  await queryInterface.addIndex('districts', ['name'], {
    name: 'districts_name_idx',
  });

  // ============ SCHOOLS TABLE ============
  await queryInterface.createTable('schools', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    districtId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'districts',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('elementary', 'middle', 'high', 'charter', 'alternative', 'special', 'other'),
      allowNull: false,
      defaultValue: 'other',
    },
    studentCapacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Schools indexes
  await queryInterface.addIndex('schools', ['districtId'], {
    name: 'schools_district_id_idx',
  });
  await queryInterface.addIndex('schools', ['code'], {
    name: 'schools_code_unique_idx',
    unique: true,
  });
  await queryInterface.addIndex('schools', ['isActive'], {
    name: 'schools_is_active_idx',
  });
  await queryInterface.addIndex('schools', ['name'], {
    name: 'schools_name_idx',
  });
  await queryInterface.addIndex('schools', ['type'], {
    name: 'schools_type_idx',
  });

  // ============ SYSTEM_CONFIGURATION TABLE ============
  await queryInterface.createTable('system_configuration', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    dataType: {
      type: DataTypes.ENUM('string', 'number', 'boolean', 'object', 'array'),
      allowNull: false,
      defaultValue: 'string',
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isEditable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    scope: {
      type: DataTypes.ENUM('system', 'district', 'school'),
      allowNull: false,
      defaultValue: 'system',
    },
    scopeId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'District or School ID for scoped configurations',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // System configuration indexes
  await queryInterface.addIndex('system_configuration', ['key'], {
    name: 'system_configuration_key_unique_idx',
    unique: true,
  });
  await queryInterface.addIndex('system_configuration', ['category'], {
    name: 'system_configuration_category_idx',
  });
  await queryInterface.addIndex('system_configuration', ['scope'], {
    name: 'system_configuration_scope_idx',
  });
  await queryInterface.addIndex('system_configuration', ['scopeId'], {
    name: 'system_configuration_scope_id_idx',
  });

  // ============ CONFIGURATION_HISTORY TABLE ============
  await queryInterface.createTable('configuration_history', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    configurationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'system_configuration',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    previousValue: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    newValue: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    changedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User ID who made the change',
    },
    changeReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IPv4 or IPv6 address',
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Configuration history indexes
  await queryInterface.addIndex('configuration_history', ['configurationId'], {
    name: 'configuration_history_configuration_id_idx',
  });
  await queryInterface.addIndex('configuration_history', ['changedBy'], {
    name: 'configuration_history_changed_by_idx',
  });
  await queryInterface.addIndex('configuration_history', ['createdAt'], {
    name: 'configuration_history_created_at_idx',
  });

  // ============ BACKUP_LOGS TABLE ============
  await queryInterface.createTable('backup_logs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    backupType: {
      type: DataTypes.ENUM('full', 'incremental', 'differential'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'Size in bytes',
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    initiatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User ID or system for automated backups',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Backup logs indexes
  await queryInterface.addIndex('backup_logs', ['status'], {
    name: 'backup_logs_status_idx',
  });
  await queryInterface.addIndex('backup_logs', ['backupType'], {
    name: 'backup_logs_backup_type_idx',
  });
  await queryInterface.addIndex('backup_logs', ['startedAt'], {
    name: 'backup_logs_started_at_idx',
  });
  await queryInterface.addIndex('backup_logs', ['completedAt'], {
    name: 'backup_logs_completed_at_idx',
  });

  // ============ PERFORMANCE_METRICS TABLE ============
  await queryInterface.createTable('performance_metrics', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    metricType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Type of metric (e.g., response_time, query_duration, memory_usage)',
    },
    metricValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Unit of measurement (ms, MB, count, etc.)',
    },
    endpoint: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'API endpoint if applicable',
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'HTTP method (GET, POST, etc.)',
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'HTTP status code',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Performance metrics indexes
  await queryInterface.addIndex('performance_metrics', ['metricType'], {
    name: 'performance_metrics_metric_type_idx',
  });
  await queryInterface.addIndex('performance_metrics', ['endpoint'], {
    name: 'performance_metrics_endpoint_idx',
  });
  await queryInterface.addIndex('performance_metrics', ['timestamp'], {
    name: 'performance_metrics_timestamp_idx',
  });
  await queryInterface.addIndex('performance_metrics', ['userId'], {
    name: 'performance_metrics_user_id_idx',
  });

  // ============ LICENSES TABLE ============
  await queryInterface.createTable('licenses', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    districtId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'districts',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    schoolId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'schools',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    licenseKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    licenseType: {
      type: DataTypes.ENUM('trial', 'basic', 'professional', 'enterprise'),
      allowNull: false,
    },
    maxUsers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Maximum number of users allowed',
    },
    maxStudents: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Maximum number of students allowed',
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Enabled features for this license',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    activatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Licenses indexes
  await queryInterface.addIndex('licenses', ['districtId'], {
    name: 'licenses_district_id_idx',
  });
  await queryInterface.addIndex('licenses', ['schoolId'], {
    name: 'licenses_school_id_idx',
  });
  await queryInterface.addIndex('licenses', ['licenseKey'], {
    name: 'licenses_license_key_unique_idx',
    unique: true,
  });
  await queryInterface.addIndex('licenses', ['isActive'], {
    name: 'licenses_is_active_idx',
  });
  await queryInterface.addIndex('licenses', ['expiresAt'], {
    name: 'licenses_expires_at_idx',
  });

  // ============ TRAINING_MODULES TABLE ============
  await queryInterface.createTable('training_modules', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'e.g., HIPAA, Safety, Software Training',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Training module content',
    },
    contentType: {
      type: DataTypes.ENUM('text', 'video', 'interactive', 'document'),
      allowNull: false,
      defaultValue: 'text',
    },
    contentUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL to external content or uploaded file',
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Estimated completion time in minutes',
    },
    passingScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Minimum score required to pass (0-100)',
    },
    requiredForRoles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'Array of role names that must complete this training',
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Training modules indexes
  await queryInterface.addIndex('training_modules', ['category'], {
    name: 'training_modules_category_idx',
  });
  await queryInterface.addIndex('training_modules', ['isRequired'], {
    name: 'training_modules_is_required_idx',
  });
  await queryInterface.addIndex('training_modules', ['isActive'], {
    name: 'training_modules_is_active_idx',
  });

  // ============ TRAINING_COMPLETIONS TABLE ============
  await queryInterface.createTable('training_completions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    moduleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'training_modules',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who completed the training',
    },
    status: {
      type: DataTypes.ENUM('not_started', 'in_progress', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'not_started',
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Score achieved (0-100)',
    },
    passed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Whether the user passed the training',
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When this completion expires (for recurring training)',
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of attempts',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional completion data',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Training completions indexes
  await queryInterface.addIndex('training_completions', ['moduleId'], {
    name: 'training_completions_module_id_idx',
  });
  await queryInterface.addIndex('training_completions', ['userId'], {
    name: 'training_completions_user_id_idx',
  });
  await queryInterface.addIndex('training_completions', ['status'], {
    name: 'training_completions_status_idx',
  });
  await queryInterface.addIndex('training_completions', ['completedAt'], {
    name: 'training_completions_completed_at_idx',
  });
  await queryInterface.addIndex('training_completions', ['expiresAt'], {
    name: 'training_completions_expires_at_idx',
  });
  // Composite index for finding user's training status
  await queryInterface.addIndex('training_completions', ['userId', 'moduleId'], {
    name: 'training_completions_user_module_idx',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Drop tables in reverse order of creation (respecting foreign key constraints)

  // Training completions (has FK to training_modules)
  await queryInterface.dropTable('training_completions');

  // Training modules (no dependencies)
  await queryInterface.dropTable('training_modules');

  // Licenses (has FK to districts and schools)
  await queryInterface.dropTable('licenses');

  // Performance metrics (no dependencies)
  await queryInterface.dropTable('performance_metrics');

  // Backup logs (no dependencies)
  await queryInterface.dropTable('backup_logs');

  // Configuration history (has FK to system_configuration)
  await queryInterface.dropTable('configuration_history');

  // System configuration (no dependencies)
  await queryInterface.dropTable('system_configuration');

  // Schools (has FK to districts)
  await queryInterface.dropTable('schools');

  // Districts (no dependencies)
  await queryInterface.dropTable('districts');
}
