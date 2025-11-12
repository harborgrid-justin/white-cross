/**
 * Migration Utilities Index
 *
 * Main entry point for all migration utility functions.
 * Exports all functions from individual service modules.
 *
 * @module database/migrations/utilities
 */

// Export all types
export * from './types';

// Export table operations
export {
  createTableWithDefaults,
  safeAlterTable,
  dropTableSafely,
  renameTableWithDependencies,
  checkTableExists,
  getTableRowCount,
  createTableBackup,
  restoreTableFromBackup,
  compareTableStructures,
} from './table-operations.service';

// Export column operations
export {
  addColumnWithDefaults,
  removeColumnSafely,
  modifyColumnType,
  renameColumnUniversal,
  checkColumnExists,
  addColumnZeroDowntime,
  removeColumnZeroDowntime,
  renameColumnExpandContract,
  modifyColumnTypeZeroDowntime,
  backfillMissingData,
} from './column-operations.service';

// Export constraint operations
export {
  addForeignKeyConstraint,
  addCheckConstraint,
  removeConstraintSafely,
  addUniqueConstraint,
  replaceConstraint,
  checkConstraintExists,
  createOptimizedIndex,
  dropIndexSafely,
  createCompositeIndex,
  createUniqueIndex,
  recreateIndex,
  checkIndexExists,
  analyzeIndexUsage,
} from './constraint-operations.service';

// Export data migration operations
export {
  batchDataTransform,
  migrateDataBetweenTables,
  copyTableData,
  validateDataIntegrity,
} from './data-migration.service';

// Export schema versioning operations
export {
  recordMigrationExecution,
  getCurrentSchemaVersion,
  compareSchemaVersions,
  createSchemaSnapshot,
} from './schema-versioning.service';

// Export rollback operations
export {
  createRollbackPoint,
  restoreRollbackPoint,
  generateRollbackMigration,
  testRollback,
} from './rollback-operations.service';

// Export seed and fixture operations
export {
  seedDataWithUpsert,
  generateSeedFromExisting,
  clearSeedData,
  createTestFixtures,
} from './seed-fixture.service';

// Export migration management
export {
  ensureMigrationHistoryTable,
  acquireMigrationLock,
  releaseMigrationLock,
  executeMigrationWithLock,
  executeBatchMigrations,
  analyzeMigrationPerformance,
} from './migration-management.service';

/**
 * Default export with all utilities grouped by category
 */
export default {
  // Table operations
  table: {
    createTableWithDefaults,
    safeAlterTable,
    dropTableSafely,
    renameTableWithDependencies,
    checkTableExists,
    getTableRowCount,
    createTableBackup,
    restoreTableFromBackup,
    compareTableStructures,
  },

  // Column operations
  column: {
    addColumnWithDefaults,
    removeColumnSafely,
    modifyColumnType,
    renameColumnUniversal,
    checkColumnExists,
    addColumnZeroDowntime,
    removeColumnZeroDowntime,
    renameColumnExpandContract,
    modifyColumnTypeZeroDowntime,
    backfillMissingData,
  },

  // Constraint operations
  constraint: {
    addForeignKeyConstraint,
    addCheckConstraint,
    removeConstraintSafely,
    addUniqueConstraint,
    replaceConstraint,
    checkConstraintExists,
  },

  // Index operations
  index: {
    createOptimizedIndex,
    dropIndexSafely,
    createCompositeIndex,
    createUniqueIndex,
    recreateIndex,
    checkIndexExists,
    analyzeIndexUsage,
  },

  // Data migration operations
  data: {
    batchDataTransform,
    migrateDataBetweenTables,
    copyTableData,
    validateDataIntegrity,
  },

  // Schema versioning
  schema: {
    recordMigrationExecution,
    getCurrentSchemaVersion,
    compareSchemaVersions,
    createSchemaSnapshot,
  },

  // Rollback operations
  rollback: {
    createRollbackPoint,
    restoreRollbackPoint,
    generateRollbackMigration,
    testRollback,
  },

  // Seed and fixture operations
  seed: {
    seedDataWithUpsert,
    generateSeedFromExisting,
    clearSeedData,
    createTestFixtures,
  },

  // Migration management
  management: {
    ensureMigrationHistoryTable,
    acquireMigrationLock,
    releaseMigrationLock,
    executeMigrationWithLock,
    executeBatchMigrations,
    analyzeMigrationPerformance,
  },
};
