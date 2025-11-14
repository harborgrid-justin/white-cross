/**
 * Migration Utilities - Combined exports from all migration utility modules
 */

// Table and schema operations
export * from './migration-builders';

// Column management
export * from './column-management';

// Index management
export * from './index-management';

// Table operations (if exists)
export * from './table-operations';

// Legacy exports from the original large file (for backward compatibility)
// These will be gradually moved to appropriate modules

// Re-export from original file for now
export {
  // Index management functions
  createOptimizedIndex,
  dropIndexSafely,
  createCompositeIndex,
  createUniqueIndex,
  recreateIndex,

  // Constraint management
  addForeignKeyConstraint,
  addCheckConstraint,
  removeConstraintSafely,
  addUniqueConstraint,
  replaceConstraint,

  // Data migration
  batchDataTransform,
  migrateDataBetweenTables,
  copyTableData,
  validateDataIntegrity,
  backfillMissingData,

  // Schema versioning
  recordMigrationExecution,
  getCurrentSchemaVersion,
  compareSchemaVersions,
  createSchemaSnapshot,

  // Zero-downtime migrations
  addColumnZeroDowntime,
  removeColumnZeroDowntime,
  renameColumnExpandContract,
  modifyColumnTypeZeroDowntime,

  // Rollback strategies
  createRollbackPoint,
  restoreRollbackPoint,
  generateRollbackMigration,
  testRollback,

  // Seed data management
  seedDataWithUpsert,
  generateSeedFromExisting,
  clearSeedData,

  // Fixture generation
  createTestFixtures,

  // Utility functions
  checkIndexExists,
  checkConstraintExists,
  getTableRowCount,
  ensureMigrationHistoryTable,

  // Migration locking
  acquireMigrationLock,
  releaseMigrationLock,
  executeMigrationWithLock,

  // Batch execution
  executeBatchMigrations,

  // Performance optimization
  analyzeMigrationPerformance,
} from './migration-utilities.service';
