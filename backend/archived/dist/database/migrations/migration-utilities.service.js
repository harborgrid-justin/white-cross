"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationUtilitiesService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const table_operations_service_1 = require("./services/table-operations.service");
const column_operations_service_1 = require("./services/column-operations.service");
const data_migration_service_1 = require("./services/data-migration.service");
let MigrationUtilitiesService = class MigrationUtilitiesService extends base_1.BaseService {
    tableOperations;
    columnOperations;
    dataMigration;
    constructor(logger, tableOperations, columnOperations, dataMigration) {
        super({
            serviceName: 'MigrationUtilitiesService',
            logger,
            enableAuditLogging: true,
        });
        this.tableOperations = tableOperations;
        this.columnOperations = columnOperations;
        this.dataMigration = dataMigration;
    }
    async createTableWithDefaults(queryInterface, tableName, attributes, options = {}, transaction) {
        return this.tableOperations.createTableWithDefaults(queryInterface, tableName, attributes, options, transaction);
    }
    async safeAlterTable(queryInterface, tableName, alterations, transaction) {
        return this.tableOperations.safeAlterTable(queryInterface, tableName, alterations, transaction);
    }
    async addColumnWithDefaults(queryInterface, tableName, columnName, definition, options = {}, transaction) {
        return this.columnOperations.addColumnWithDefaults(queryInterface, tableName, columnName, definition, options, transaction);
    }
    async removeColumnSafely(queryInterface, tableName, columnName, options = {}, transaction) {
        return this.columnOperations.removeColumnSafely(queryInterface, tableName, columnName, options, transaction);
    }
    async modifyColumnType(queryInterface, tableName, columnName, newDefinition, options = {}, transaction) {
        return this.columnOperations.modifyColumnType(queryInterface, tableName, columnName, newDefinition, options, transaction);
    }
    async renameColumnUniversal(queryInterface, tableName, oldColumnName, newColumnName, transaction) {
        return this.columnOperations.renameColumnUniversal(queryInterface, tableName, oldColumnName, newColumnName, transaction);
    }
    async batchDataTransform(queryInterface, config) {
        return this.dataMigration.batchDataTransform(queryInterface, config);
    }
    async migrateDataBetweenTables(queryInterface, sourceTable, targetTable, columnMapping, options = {}) {
        return this.dataMigration.migrateDataBetweenTables(queryInterface, sourceTable, targetTable, columnMapping, options);
    }
    async copyTableData(queryInterface, sourceTable, targetTable, options = {}, transaction) {
        return this.dataMigration.copyTableData(queryInterface, sourceTable, targetTable, options, transaction);
    }
    async seedDataWithUpsert(queryInterface, config) {
        return this.dataMigration.seedDataWithUpsert(queryInterface, config);
    }
    async generateSeedFromExisting(queryInterface, tableName, options = {}) {
        return this.dataMigration.generateSeedFromExisting(queryInterface, tableName, options);
    }
    async clearSeedData(queryInterface, tables, options = {}) {
        return this.dataMigration.clearSeedData(queryInterface, tables, options);
    }
    async createTestFixtures(queryInterface, fixtures) {
        return this.dataMigration.createTestFixtures(queryInterface, fixtures);
    }
    async validateDataIntegrity(queryInterface, tableName, validations) {
        return this.tableOperations.validateDataIntegrity(queryInterface, tableName, validations);
    }
    async backfillMissingData(queryInterface, tableName, columnName, strategy, config) {
        return this.tableOperations.backfillMissingData(queryInterface, { tableName, columnName, strategy, strategyConfig: config });
    }
};
exports.MigrationUtilitiesService = MigrationUtilitiesService;
exports.MigrationUtilitiesService = MigrationUtilitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        table_operations_service_1.TableOperationsService,
        column_operations_service_1.ColumnOperationsService,
        data_migration_service_1.DataMigrationService])
], MigrationUtilitiesService);
//# sourceMappingURL=migration-utilities.service.js.map