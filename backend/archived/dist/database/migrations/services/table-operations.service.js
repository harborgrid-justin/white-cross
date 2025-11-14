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
exports.TableOperationsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const table_attributes_builder_1 = require("../utilities/table-attributes-builder");
let TableOperationsService = class TableOperationsService extends base_1.BaseService {
    constructor() {
        super("TableOperationsService");
    }
    async createTableWithDefaults(queryInterface, tableName, attributes, options = {}, transaction) {
        const { indexes = [], paranoid = false, timestamps = true, underscored = false, comment, } = options;
        const completeAttributes = (0, table_attributes_builder_1.buildTableAttributes)(attributes, { timestamps, paranoid });
        await queryInterface.createTable(tableName, completeAttributes, {
            transaction,
            comment,
        });
        for (const index of indexes) {
            await queryInterface.addIndex(tableName, index.fields, {
                ...index,
                transaction,
            });
        }
        this.logInfo(`Created table ${tableName} with ${indexes.length} indexes`);
    }
    async safeAlterTable(queryInterface, tableName, alterations, transaction) {
        const sequelize = queryInterface.sequelize;
        const t = transaction || (await sequelize.transaction());
        try {
            await alterations(queryInterface, t);
            if (!transaction) {
                await t.commit();
            }
            this.logInfo(`Successfully altered table ${tableName}`);
        }
        catch (error) {
            if (!transaction) {
                await t.rollback();
            }
            this.logError(`Failed to alter table ${tableName}`, error);
            throw error;
        }
    }
    async migrateDataBetweenTables(queryInterface, config) {
        const { sourceTable, targetTable, batchSize = 1000, where = {}, transform, validate, onError, } = config;
        const sequelize = queryInterface.sequelize;
        let offset = 0;
        let totalProcessed = 0;
        let totalModified = 0;
        let errors = 0;
        this.logInfo(`Starting data migration from ${sourceTable} to ${targetTable}...`);
        while (true) {
            const transaction = await sequelize.transaction();
            try {
                const whereClause = Object.keys(where).length
                    ? `WHERE ${Object.entries(where)
                        .map(([key, val]) => `"${key}" = '${val}'`)
                        .join(' AND ')}`
                    : '';
                const [results] = await sequelize.query(`SELECT * FROM "${sourceTable}" ${whereClause} ORDER BY id LIMIT ${batchSize} OFFSET ${offset}`, { transaction });
                if (results.length === 0) {
                    await transaction.commit();
                    break;
                }
                for (const row of results) {
                    try {
                        if (validate && !(await validate(row))) {
                            continue;
                        }
                        const transformedRow = await transform(row);
                        const setClause = Object.entries(transformedRow)
                            .filter(([key]) => key !== 'id')
                            .map(([key, val]) => `"${key}" = :${key}`)
                            .join(', ');
                        if (setClause) {
                            await sequelize.query(`UPDATE "${targetTable}" SET ${setClause} WHERE id = :id`, {
                                replacements: { ...transformedRow, id: row.id },
                                transaction,
                            });
                            totalModified++;
                        }
                        totalProcessed++;
                    }
                    catch (error) {
                        errors++;
                        if (onError) {
                            onError(error, row);
                        }
                        else {
                            this.logError(`Error transforming row:`, error);
                        }
                    }
                }
                await transaction.commit();
                offset += batchSize;
                this.logDebug(`Processed ${totalProcessed} records...`);
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            catch (error) {
                await transaction.rollback();
                this.logError(`Error processing batch at offset ${offset}:`, error);
                throw error;
            }
        }
        this.logInfo(`Data migration complete. Processed: ${totalProcessed}, Modified: ${totalModified}, Errors: ${errors}`);
    }
    async validateDataIntegrity(queryInterface, tableName, validations) {
        const sequelize = queryInterface.sequelize;
        const results = [];
        for (const validation of validations) {
            const { column, rule, errorMessage } = validation;
            const [queryResults] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}" WHERE NOT (${rule})`);
            const failedCount = queryResults[0].count;
            const passed = failedCount === 0;
            results.push({
                column,
                passed,
                failedCount,
                message: errorMessage || `Column ${column} validation: ${rule}`,
            });
            if (!passed) {
                this.logWarning(`Validation failed for ${column}: ${failedCount} rows do not satisfy ${rule}`);
            }
        }
        return results;
    }
    async backfillMissingData(queryInterface, config) {
        const { tableName, columnName, strategy, strategyConfig } = config;
        const sequelize = queryInterface.sequelize;
        let query;
        let rowsUpdated = 0;
        switch (strategy) {
            case 'default':
                query = `UPDATE "${tableName}" SET "${columnName}" = :defaultValue WHERE "${columnName}" IS NULL`;
                await sequelize.query(query, {
                    replacements: { defaultValue: strategyConfig.defaultValue },
                });
                break;
            case 'derived':
                query = `UPDATE "${tableName}" SET "${columnName}" = ${strategyConfig.expression} WHERE "${columnName}" IS NULL`;
                await sequelize.query(query);
                break;
            case 'lookup':
                query = `
          UPDATE "${tableName}" t
          SET "${columnName}" = l."${strategyConfig.lookupValue}"
          FROM "${strategyConfig.lookupTable}" l
          WHERE t."${strategyConfig.lookupKey}" = l."${strategyConfig.lookupKey}"
          AND t."${columnName}" IS NULL
        `;
                await sequelize.query(query);
                break;
            case 'function':
                if (!strategyConfig.customFunction) {
                    throw new Error('Custom function required for function strategy');
                }
                const [rows] = await sequelize.query(`SELECT * FROM "${tableName}" WHERE "${columnName}" IS NULL`);
                for (const row of rows) {
                    const newValue = await strategyConfig.customFunction(row);
                    await sequelize.query(`UPDATE "${tableName}" SET "${columnName}" = :newValue WHERE id = :id`, {
                        replacements: { newValue, id: row.id },
                    });
                    rowsUpdated++;
                }
                break;
        }
        if (strategy !== 'function') {
            const [countResult] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}" WHERE "${columnName}" IS NOT NULL`);
            rowsUpdated = countResult[0].count;
        }
        this.logInfo(`Backfilled ${rowsUpdated} rows in ${tableName}.${columnName}`);
    }
};
exports.TableOperationsService = TableOperationsService;
exports.TableOperationsService = TableOperationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TableOperationsService);
//# sourceMappingURL=table-operations.service.js.map