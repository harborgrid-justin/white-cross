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
exports.analyzeIndexUsage = exports.checkIndexExists = exports.recreateIndex = exports.createUniqueIndex = exports.createCompositeIndex = exports.dropIndexSafely = exports.createOptimizedIndex = exports.checkConstraintExists = exports.replaceConstraint = exports.addUniqueConstraint = exports.removeConstraintSafely = exports.addCheckConstraint = exports.addForeignKeyConstraint = exports.backfillMissingData = exports.modifyColumnTypeZeroDowntime = exports.renameColumnExpandContract = exports.removeColumnZeroDowntime = exports.addColumnZeroDowntime = exports.checkColumnExists = exports.renameColumnUniversal = exports.modifyColumnType = exports.removeColumnSafely = exports.addColumnWithDefaults = exports.compareTableStructures = exports.restoreTableFromBackup = exports.createTableBackup = exports.getTableRowCount = exports.checkTableExists = exports.renameTableWithDependencies = exports.dropTableSafely = exports.safeAlterTable = exports.createTableWithDefaults = void 0;
__exportStar(require("./types"), exports);
var table_operations_service_1 = require("./table-operations.service");
Object.defineProperty(exports, "createTableWithDefaults", { enumerable: true, get: function () { return table_operations_service_1.createTableWithDefaults; } });
Object.defineProperty(exports, "safeAlterTable", { enumerable: true, get: function () { return table_operations_service_1.safeAlterTable; } });
Object.defineProperty(exports, "dropTableSafely", { enumerable: true, get: function () { return table_operations_service_1.dropTableSafely; } });
Object.defineProperty(exports, "renameTableWithDependencies", { enumerable: true, get: function () { return table_operations_service_1.renameTableWithDependencies; } });
Object.defineProperty(exports, "checkTableExists", { enumerable: true, get: function () { return table_operations_service_1.checkTableExists; } });
Object.defineProperty(exports, "getTableRowCount", { enumerable: true, get: function () { return table_operations_service_1.getTableRowCount; } });
Object.defineProperty(exports, "createTableBackup", { enumerable: true, get: function () { return table_operations_service_1.createTableBackup; } });
Object.defineProperty(exports, "restoreTableFromBackup", { enumerable: true, get: function () { return table_operations_service_1.restoreTableFromBackup; } });
Object.defineProperty(exports, "compareTableStructures", { enumerable: true, get: function () { return table_operations_service_1.compareTableStructures; } });
var column_operations_service_1 = require("./column-operations.service");
Object.defineProperty(exports, "addColumnWithDefaults", { enumerable: true, get: function () { return column_operations_service_1.addColumnWithDefaults; } });
Object.defineProperty(exports, "removeColumnSafely", { enumerable: true, get: function () { return column_operations_service_1.removeColumnSafely; } });
Object.defineProperty(exports, "modifyColumnType", { enumerable: true, get: function () { return column_operations_service_1.modifyColumnType; } });
Object.defineProperty(exports, "renameColumnUniversal", { enumerable: true, get: function () { return column_operations_service_1.renameColumnUniversal; } });
Object.defineProperty(exports, "checkColumnExists", { enumerable: true, get: function () { return column_operations_service_1.checkColumnExists; } });
Object.defineProperty(exports, "addColumnZeroDowntime", { enumerable: true, get: function () { return column_operations_service_1.addColumnZeroDowntime; } });
Object.defineProperty(exports, "removeColumnZeroDowntime", { enumerable: true, get: function () { return column_operations_service_1.removeColumnZeroDowntime; } });
Object.defineProperty(exports, "renameColumnExpandContract", { enumerable: true, get: function () { return column_operations_service_1.renameColumnExpandContract; } });
Object.defineProperty(exports, "modifyColumnTypeZeroDowntime", { enumerable: true, get: function () { return column_operations_service_1.modifyColumnTypeZeroDowntime; } });
Object.defineProperty(exports, "backfillMissingData", { enumerable: true, get: function () { return column_operations_service_1.backfillMissingData; } });
var constraint_operations_service_1 = require("./constraint-operations.service");
Object.defineProperty(exports, "addForeignKeyConstraint", { enumerable: true, get: function () { return constraint_operations_service_1.addForeignKeyConstraint; } });
Object.defineProperty(exports, "addCheckConstraint", { enumerable: true, get: function () { return constraint_operations_service_1.addCheckConstraint; } });
Object.defineProperty(exports, "removeConstraintSafely", { enumerable: true, get: function () { return constraint_operations_service_1.removeConstraintSafely; } });
Object.defineProperty(exports, "addUniqueConstraint", { enumerable: true, get: function () { return constraint_operations_service_1.addUniqueConstraint; } });
Object.defineProperty(exports, "replaceConstraint", { enumerable: true, get: function () { return constraint_operations_service_1.replaceConstraint; } });
Object.defineProperty(exports, "checkConstraintExists", { enumerable: true, get: function () { return constraint_operations_service_1.checkConstraintExists; } });
Object.defineProperty(exports, "createOptimizedIndex", { enumerable: true, get: function () { return constraint_operations_service_1.createOptimizedIndex; } });
Object.defineProperty(exports, "dropIndexSafely", { enumerable: true, get: function () { return constraint_operations_service_1.dropIndexSafely; } });
Object.defineProperty(exports, "createCompositeIndex", { enumerable: true, get: function () { return constraint_operations_service_1.createCompositeIndex; } });
Object.defineProperty(exports, "createUniqueIndex", { enumerable: true, get: function () { return constraint_operations_service_1.createUniqueIndex; } });
Object.defineProperty(exports, "recreateIndex", { enumerable: true, get: function () { return constraint_operations_service_1.recreateIndex; } });
Object.defineProperty(exports, "checkIndexExists", { enumerable: true, get: function () { return constraint_operations_service_1.checkIndexExists; } });
Object.defineProperty(exports, "analyzeIndexUsage", { enumerable: true, get: function () { return constraint_operations_service_1.analyzeIndexUsage; } });
exports.default = {
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
    constraint: {
        addForeignKeyConstraint,
        addCheckConstraint,
        removeConstraintSafely,
        addUniqueConstraint,
        replaceConstraint,
        checkConstraintExists,
    },
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
//# sourceMappingURL=index.js.map