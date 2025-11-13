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

};
