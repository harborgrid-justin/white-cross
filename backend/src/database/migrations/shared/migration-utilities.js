'use strict';

/**
 * Migration Utilities
 * 
 * Shared utilities for database migrations to reduce code duplication and ensure consistency.
 * Provides common patterns for transaction handling, table creation, enum management, and error handling.
 */

/**
 * Common column definitions used across multiple tables
 */
const COMMON_COLUMNS = {
  // Primary key column (UUID string)
  id: {
    type: 'STRING',
    primaryKey: true,
    allowNull: false
  },

  // Audit columns
  createdBy: {
    type: 'TEXT',
    allowNull: true
  },
  updatedBy: {
    type: 'TEXT',
    allowNull: true
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
    defaultValue: 'CURRENT_TIMESTAMP'
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
    defaultValue: 'CURRENT_TIMESTAMP'
  },

  // Common health record metadata
  notes: {
    type: 'TEXT',
    allowNull: true
  },

  // Common person/role tracking
  measuredBy: {
    type: 'TEXT',
    allowNull: false
  },
  measuredByRole: {
    type: 'TEXT',
    allowNull: true
  },
  administeredBy: {
    type: 'TEXT',
    allowNull: false
  },
  administeredByRole: {
    type: 'TEXT',
    allowNull: true
  },
  screenedBy: {
    type: 'TEXT',
    allowNull: false
  },
  screenedByRole: {
    type: 'TEXT',
    allowNull: true
  },

  // Common date fields
  measurementDate: {
    type: 'DATE',
    allowNull: false
  },
  administrationDate: {
    type: 'DATE',
    allowNull: false
  },
  screeningDate: {
    type: 'DATE',
    allowNull: false
  }
};

/**
 * Common foreign key references
 */
const COMMON_REFERENCES = {
  studentId: {
    type: 'STRING',
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  healthRecordId: {
    type: 'STRING',
    allowNull: true,
    references: {
      model: 'health_records',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  appointmentId: {
    type: 'STRING',
    allowNull: true,
    references: {
      model: 'appointments',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
};

/**
 * Execute migration with standardized transaction handling and error logging
 * @param {Object} queryInterface - Sequelize query interface
 * @param {Function} migrationFn - Migration function to execute
 * @param {string} operationName - Name of the operation for logging
 * @returns {Promise<void>}
 */
async function executeWithTransaction(queryInterface, migrationFn, operationName) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await migrationFn(queryInterface, transaction);
    await transaction.commit();
    console.log(`✓ ${operationName} completed successfully`);
  } catch (error) {
    await transaction.rollback();
    console.error(`✗ ${operationName} failed:`, error);
    throw error;
  }
}

/**
 * Create ENUM type with standardized error handling
 * @param {Object} queryInterface - Sequelize query interface  
 * @param {Object} transaction - Database transaction
 * @param {string} enumName - Name of the enum type
 * @param {Array<string>} values - Enum values
 * @returns {Promise<void>}
 */
async function createEnum(queryInterface, transaction, enumName, values) {
  const enumValues = values.map(value => `'${value}'`).join(', ');
  await queryInterface.sequelize.query(`
    CREATE TYPE "${enumName}" AS ENUM (${enumValues});
  `, { transaction });
}

/**
 * Add values to existing ENUM type
 * @param {Object} queryInterface - Sequelize query interface
 * @param {Object} transaction - Database transaction
 * @param {string} enumName - Name of the enum type
 * @param {Array<string>} values - Values to add
 * @returns {Promise<void>}
 */
async function addEnumValues(queryInterface, transaction, enumName, values) {
  for (const value of values) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "${enumName}" ADD VALUE IF NOT EXISTS '${value}';
    `, { transaction });
  }
}

/**
 * Drop ENUM type with CASCADE
 * @param {Object} queryInterface - Sequelize query interface
 * @param {Object} transaction - Database transaction
 * @param {string} enumName - Name of the enum type
 * @returns {Promise<void>}
 */
async function dropEnum(queryInterface, transaction, enumName) {
  await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${enumName}" CASCADE;`, { transaction });
}

/**
 * Create table with common columns automatically included
 * @param {Object} queryInterface - Sequelize query interface
 * @param {Object} transaction - Database transaction
 * @param {string} tableName - Name of the table
 * @param {Object} columns - Table column definitions
 * @param {Object} Sequelize - Sequelize instance for data types
 * @param {Object} options - Additional options
 * @returns {Promise<void>}
 */
async function createTableWithCommonColumns(queryInterface, transaction, tableName, columns, Sequelize, options = {}) {
  const {
    includeAuditColumns = true,
    includeStudentRef = false,
    includeHealthRecordRef = false,
    includeAppointmentRef = false
  } = options;

  const finalColumns = { ...columns };

  // Add common audit columns
  if (includeAuditColumns) {
    finalColumns.createdBy = {
      type: Sequelize.TEXT,
      allowNull: true
    };
    finalColumns.updatedBy = {
      type: Sequelize.TEXT,
      allowNull: true
    };
    finalColumns.createdAt = {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    };
    finalColumns.updatedAt = {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    };
  }

  // Add common foreign key references
  if (includeStudentRef) {
    finalColumns.studentId = {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    };
  }

  if (includeHealthRecordRef) {
    finalColumns.healthRecordId = {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'health_records',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    };
  }

  if (includeAppointmentRef) {
    finalColumns.appointmentId = {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'appointments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    };
  }

  await queryInterface.createTable(tableName, finalColumns, { transaction });
}

/**
 * Drop table with standardized error handling
 * @param {Object} queryInterface - Sequelize query interface
 * @param {Object} transaction - Database transaction
 * @param {string} tableName - Name of the table
 * @returns {Promise<void>}
 */
async function dropTable(queryInterface, transaction, tableName) {
  await queryInterface.dropTable(tableName, { transaction });
}

/**
 * Create multiple ENUMs in batch
 * @param {Object} queryInterface - Sequelize query interface
 * @param {Object} transaction - Database transaction
 * @param {Object} enumsConfig - Object with enum names as keys and values arrays
 * @returns {Promise<void>}
 */
async function createEnums(queryInterface, transaction, enumsConfig) {
  for (const [enumName, values] of Object.entries(enumsConfig)) {
    await createEnum(queryInterface, transaction, enumName, values);
  }
}

/**
 * Drop multiple ENUMs in batch
 * @param {Object} queryInterface - Sequelize query interface
 * @param {Object} transaction - Database transaction
 * @param {Array<string>} enumNames - Array of enum names to drop
 * @returns {Promise<void>}
 */
async function dropEnums(queryInterface, transaction, enumNames) {
  for (const enumName of enumNames) {
    await dropEnum(queryInterface, transaction, enumName);
  }
}

/**
 * Standard up migration pattern
 * @param {Object} queryInterface - Sequelize query interface
 * @param {Function} migrationLogic - Function containing migration logic
 * @param {string} migrationName - Name for logging
 * @returns {Promise<void>}
 */
async function standardUpMigration(queryInterface, migrationLogic, migrationName) {
  return executeWithTransaction(queryInterface, migrationLogic, `${migrationName} migration`);
}

/**
 * Standard down migration pattern
 * @param {Object} queryInterface - Sequelize query interface
 * @param {Function} rollbackLogic - Function containing rollback logic
 * @param {string} migrationName - Name for logging
 * @returns {Promise<void>}
 */
async function standardDownMigration(queryInterface, rollbackLogic, migrationName) {
  return executeWithTransaction(queryInterface, rollbackLogic, `${migrationName} rollback`);
}

/**
 * Get standard ID column definition
 * @param {Object} Sequelize - Sequelize instance
 * @returns {Object} ID column definition
 */
function getIdColumn(Sequelize) {
  return {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  };
}

/**
 * Get standard enum column definition
 * @param {Object} Sequelize - Sequelize instance
 * @param {Array<string>} values - Enum values
 * @param {Object} options - Additional options
 * @returns {Object} Enum column definition
 */
function getEnumColumn(Sequelize, values, options = {}) {
  const { allowNull = true, defaultValue } = options;
  
  const column = {
    type: Sequelize.ENUM(...values),
    allowNull
  };

  if (defaultValue !== undefined) {
    column.defaultValue = defaultValue;
  }

  return column;
}

module.exports = {
  COMMON_COLUMNS,
  COMMON_REFERENCES,
  executeWithTransaction,
  createEnum,
  addEnumValues,
  dropEnum,
  createEnums,
  dropEnums,
  createTableWithCommonColumns,
  dropTable,
  standardUpMigration,
  standardDownMigration,
  getIdColumn,
  getEnumColumn
};
