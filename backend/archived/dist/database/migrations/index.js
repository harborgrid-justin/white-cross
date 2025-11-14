"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMigrationPerformance = exports.executeBatchMigrations = exports.executeMigrationWithLock = exports.releaseMigrationLock = exports.acquireMigrationLock = exports.ensureMigrationHistoryTable = exports.getTableRowCount = exports.checkConstraintExists = exports.checkIndexExists = exports.createTestFixtures = exports.clearSeedData = exports.generateSeedFromExisting = exports.seedDataWithUpsert = exports.testRollback = exports.generateRollbackMigration = exports.restoreRollbackPoint = exports.createRollbackPoint = exports.modifyColumnTypeZeroDowntime = exports.renameColumnExpandContract = exports.removeColumnZeroDowntime = exports.addColumnZeroDowntime = exports.createSchemaSnapshot = exports.compareSchemaVersions = exports.getCurrentSchemaVersion = exports.recordMigrationExecution = exports.backfillMissingData = exports.validateDataIntegrity = exports.copyTableData = exports.migrateDataBetweenTables = exports.batchDataTransform = exports.replaceConstraint = exports.addUniqueConstraint = exports.removeConstraintSafely = exports.addCheckConstraint = exports.addForeignKeyConstraint = exports.recreateIndex = exports.createUniqueIndex = exports.createCompositeIndex = exports.dropIndexSafely = exports.createOptimizedIndex = void 0;
__exportStar(require("./migration-builders"), exports);
__exportStar(require("./column-management"), exports);
__exportStar(require("./index-management"), exports);
__exportStar(require("./table-operations"), exports);
var migration_utilities_service_1 = require("./migration-utilities.service");
Object.defineProperty(exports, "createOptimizedIndex", { enumerable: true, get: function () { return migration_utilities_service_1.createOptimizedIndex; } });
Object.defineProperty(exports, "dropIndexSafely", { enumerable: true, get: function () { return migration_utilities_service_1.dropIndexSafely; } });
Object.defineProperty(exports, "createCompositeIndex", { enumerable: true, get: function () { return migration_utilities_service_1.createCompositeIndex; } });
Object.defineProperty(exports, "createUniqueIndex", { enumerable: true, get: function () { return migration_utilities_service_1.createUniqueIndex; } });
Object.defineProperty(exports, "recreateIndex", { enumerable: true, get: function () { return migration_utilities_service_1.recreateIndex; } });
Object.defineProperty(exports, "addForeignKeyConstraint", { enumerable: true, get: function () { return migration_utilities_service_1.addForeignKeyConstraint; } });
Object.defineProperty(exports, "addCheckConstraint", { enumerable: true, get: function () { return migration_utilities_service_1.addCheckConstraint; } });
Object.defineProperty(exports, "removeConstraintSafely", { enumerable: true, get: function () { return migration_utilities_service_1.removeConstraintSafely; } });
Object.defineProperty(exports, "addUniqueConstraint", { enumerable: true, get: function () { return migration_utilities_service_1.addUniqueConstraint; } });
Object.defineProperty(exports, "replaceConstraint", { enumerable: true, get: function () { return migration_utilities_service_1.replaceConstraint; } });
Object.defineProperty(exports, "batchDataTransform", { enumerable: true, get: function () { return migration_utilities_service_1.batchDataTransform; } });
Object.defineProperty(exports, "migrateDataBetweenTables", { enumerable: true, get: function () { return migration_utilities_service_1.migrateDataBetweenTables; } });
Object.defineProperty(exports, "copyTableData", { enumerable: true, get: function () { return migration_utilities_service_1.copyTableData; } });
Object.defineProperty(exports, "validateDataIntegrity", { enumerable: true, get: function () { return migration_utilities_service_1.validateDataIntegrity; } });
Object.defineProperty(exports, "backfillMissingData", { enumerable: true, get: function () { return migration_utilities_service_1.backfillMissingData; } });
Object.defineProperty(exports, "recordMigrationExecution", { enumerable: true, get: function () { return migration_utilities_service_1.recordMigrationExecution; } });
Object.defineProperty(exports, "getCurrentSchemaVersion", { enumerable: true, get: function () { return migration_utilities_service_1.getCurrentSchemaVersion; } });
Object.defineProperty(exports, "compareSchemaVersions", { enumerable: true, get: function () { return migration_utilities_service_1.compareSchemaVersions; } });
Object.defineProperty(exports, "createSchemaSnapshot", { enumerable: true, get: function () { return migration_utilities_service_1.createSchemaSnapshot; } });
Object.defineProperty(exports, "addColumnZeroDowntime", { enumerable: true, get: function () { return migration_utilities_service_1.addColumnZeroDowntime; } });
Object.defineProperty(exports, "removeColumnZeroDowntime", { enumerable: true, get: function () { return migration_utilities_service_1.removeColumnZeroDowntime; } });
Object.defineProperty(exports, "renameColumnExpandContract", { enumerable: true, get: function () { return migration_utilities_service_1.renameColumnExpandContract; } });
Object.defineProperty(exports, "modifyColumnTypeZeroDowntime", { enumerable: true, get: function () { return migration_utilities_service_1.modifyColumnTypeZeroDowntime; } });
Object.defineProperty(exports, "createRollbackPoint", { enumerable: true, get: function () { return migration_utilities_service_1.createRollbackPoint; } });
Object.defineProperty(exports, "restoreRollbackPoint", { enumerable: true, get: function () { return migration_utilities_service_1.restoreRollbackPoint; } });
Object.defineProperty(exports, "generateRollbackMigration", { enumerable: true, get: function () { return migration_utilities_service_1.generateRollbackMigration; } });
Object.defineProperty(exports, "testRollback", { enumerable: true, get: function () { return migration_utilities_service_1.testRollback; } });
Object.defineProperty(exports, "seedDataWithUpsert", { enumerable: true, get: function () { return migration_utilities_service_1.seedDataWithUpsert; } });
Object.defineProperty(exports, "generateSeedFromExisting", { enumerable: true, get: function () { return migration_utilities_service_1.generateSeedFromExisting; } });
Object.defineProperty(exports, "clearSeedData", { enumerable: true, get: function () { return migration_utilities_service_1.clearSeedData; } });
Object.defineProperty(exports, "createTestFixtures", { enumerable: true, get: function () { return migration_utilities_service_1.createTestFixtures; } });
Object.defineProperty(exports, "checkIndexExists", { enumerable: true, get: function () { return migration_utilities_service_1.checkIndexExists; } });
Object.defineProperty(exports, "checkConstraintExists", { enumerable: true, get: function () { return migration_utilities_service_1.checkConstraintExists; } });
Object.defineProperty(exports, "getTableRowCount", { enumerable: true, get: function () { return migration_utilities_service_1.getTableRowCount; } });
Object.defineProperty(exports, "ensureMigrationHistoryTable", { enumerable: true, get: function () { return migration_utilities_service_1.ensureMigrationHistoryTable; } });
Object.defineProperty(exports, "acquireMigrationLock", { enumerable: true, get: function () { return migration_utilities_service_1.acquireMigrationLock; } });
Object.defineProperty(exports, "releaseMigrationLock", { enumerable: true, get: function () { return migration_utilities_service_1.releaseMigrationLock; } });
Object.defineProperty(exports, "executeMigrationWithLock", { enumerable: true, get: function () { return migration_utilities_service_1.executeMigrationWithLock; } });
Object.defineProperty(exports, "executeBatchMigrations", { enumerable: true, get: function () { return migration_utilities_service_1.executeBatchMigrations; } });
Object.defineProperty(exports, "analyzeMigrationPerformance", { enumerable: true, get: function () { return migration_utilities_service_1.analyzeMigrationPerformance; } });
//# sourceMappingURL=index.js.map