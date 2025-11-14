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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnOperationsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const column_operations_service_1 = require("../utilities/column-operations.service");
let ColumnOperationsService = class ColumnOperationsService extends base_1.BaseService {
    constructor() {
        super("ColumnOperationsService");
    }
    async addColumnWithDefaults(queryInterface, tableName, columnName, definition, options = {}, transaction) {
        const { populateDefault = true, validate = true } = options;
        const tempDefinition = { ...definition, allowNull: true };
        await queryInterface.addColumn(tableName, columnName, tempDefinition, {
            transaction,
        });
        if (populateDefault && definition.defaultValue !== undefined) {
            const dialect = queryInterface.sequelize.getDialect();
            const tableRef = dialect === 'postgres' ? `"${tableName}"` : `\`${tableName}\``;
            const columnRef = dialect === 'postgres' ? `"${columnName}"` : `\`${columnName}\``;
            await queryInterface.sequelize.query(`UPDATE ${tableRef} SET ${columnRef} = :defaultValue WHERE ${columnRef} IS NULL`, {
                replacements: { defaultValue: definition.defaultValue },
                transaction,
            });
        }
        if (!definition.allowNull) {
            await queryInterface.changeColumn(tableName, columnName, definition, {
                transaction,
            });
        }
        if (validate) {
            const [results] = await queryInterface.sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}" WHERE "${columnName}" IS NULL`, { transaction });
            const count = results[0].count;
            if (count > 0 && !definition.allowNull) {
                throw new Error(`Column ${columnName} has ${count} NULL values but is NOT NULL`);
            }
        }
        this.logInfo(`Added column ${columnName} to table ${tableName}`);
    }
    async removeColumnSafely(queryInterface, tableName, columnName, options = {}, transaction) {
        const { backup = false, backupTable, ifExists = true } = options;
        if (ifExists) {
            const columnExists = await this.checkColumnExists(queryInterface, tableName, columnName);
            if (!columnExists) {
                return;
            }
        }
        if (backup) {
            const backupTableName = backupTable || `${tableName}_${columnName}_backup`;
            await queryInterface.sequelize.query(`CREATE TABLE "${backupTableName}" AS SELECT id, "${columnName}" FROM "${tableName}"`, { transaction });
        }
        await queryInterface.removeColumn(tableName, columnName, { transaction });
        this.logInfo(`Removed column ${columnName} from table ${tableName}`);
    }
    async modifyColumnType(queryInterface, tableName, columnName, newDefinition, options = {}, transaction) {
        return await (0, column_operations_service_1.modifyColumnType)(queryInterface, tableName, columnName, newDefinition, options, transaction);
        this.logInfo(`Modified column type for ${columnName} in table ${tableName}`);
    }
    async renameColumnUniversal(queryInterface, tableName, oldColumnName, newColumnName, transaction) {
        await queryInterface.renameColumn(tableName, oldColumnName, newColumnName, { transaction });
        this.logInfo(`Renamed column ${oldColumnName} to ${newColumnName} in table ${tableName}`);
    }
    async checkColumnExists(queryInterface, tableName, columnName) {
        const sequelize = queryInterface.sequelize;
        const dialect = sequelize.getDialect();
        const [results] = await sequelize.query(dialect === 'postgres'
            ? `SELECT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = :tableName
            AND column_name = :columnName
          )`
            : `SELECT COUNT(*) as count FROM information_schema.columns
           WHERE table_schema = DATABASE()
           AND table_name = :tableName
           AND column_name = :columnName`, {
            replacements: { tableName, columnName },
        });
        if (dialect === 'postgres') {
            return results[0].exists;
        }
        else {
            return results[0].count > 0;
        }
    }
};
exports.ColumnOperationsService = ColumnOperationsService;
exports.ColumnOperationsService = ColumnOperationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ColumnOperationsService);
//# sourceMappingURL=column-operations.service.js.map