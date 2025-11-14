"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TableOperationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableOperationsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
let TableOperationsService = TableOperationsService_1 = class TableOperationsService {
    logger = new common_1.Logger(TableOperationsService_1.name);
    async createTableWithDefaults(queryInterface, tableName, attributes, options = {}, transaction) {
        const { indexes = [], paranoid = false, timestamps = true, comment } = options;
        const completeAttributes = {
            id: {
                type: sequelize_2.DataTypes.UUID,
                defaultValue: sequelize_2.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            ...attributes,
        };
        if (timestamps) {
            completeAttributes.createdAt = {
                type: sequelize_2.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
            };
            completeAttributes.updatedAt = {
                type: sequelize_2.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
            };
        }
        if (paranoid) {
            completeAttributes.deletedAt = {
                type: sequelize_2.DataTypes.DATE,
                allowNull: true,
            };
        }
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
        this.logger.log(`Created table ${tableName} with ${indexes.length} indexes`);
    }
    async safeAlterTable(queryInterface, tableName, alterations, transaction) {
        const sequelize = queryInterface.sequelize;
        const t = transaction || (await sequelize.transaction());
        try {
            await alterations(queryInterface, t);
            if (!transaction) {
                await t.commit();
            }
            this.logger.log(`Successfully altered table ${tableName}`);
        }
        catch (error) {
            if (!transaction) {
                await t.rollback();
            }
            this.logger.error(`Failed to alter table ${tableName}:`, error);
            throw error;
        }
    }
    async dropTableSafely(queryInterface, tableName, options = {}, transaction) {
        const { cascade = false, ifExists = true } = options;
        if (ifExists) {
            const tableExists = await this.checkTableExists(queryInterface, tableName);
            if (!tableExists) {
                this.logger.warn(`Table ${tableName} does not exist, skipping drop`);
                return;
            }
        }
        await queryInterface.dropTable(tableName, {
            cascade,
            transaction,
        });
        this.logger.log(`Dropped table ${tableName}`);
    }
    async renameTableWithDependencies(queryInterface, oldTableName, newTableName, transaction) {
        const sequelize = queryInterface.sequelize;
        const dialect = sequelize.getDialect();
        await queryInterface.renameTable(oldTableName, newTableName, { transaction });
        if (dialect === 'postgres') {
            const [sequences] = await sequelize.query(`
        SELECT sequence_name
        FROM information_schema.sequences
        WHERE sequence_name LIKE :pattern
      `, {
                replacements: { pattern: `${oldTableName}%` },
                transaction,
            });
            for (const seq of sequences) {
                const newSeqName = seq.sequence_name.replace(oldTableName, newTableName);
                await sequelize.query(`ALTER SEQUENCE "${seq.sequence_name}" RENAME TO "${newSeqName}"`, { transaction });
            }
        }
        this.logger.log(`Renamed table ${oldTableName} to ${newTableName}`);
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
        this.logger.log(`Added column ${columnName} to table ${tableName}`);
    }
    async removeColumnSafely(queryInterface, tableName, columnName, options = {}, transaction) {
        const { backup = false, backupTable, ifExists = true } = options;
        if (ifExists) {
            const columnExists = await this.checkColumnExists(queryInterface, tableName, columnName);
            if (!columnExists) {
                this.logger.warn(`Column ${columnName} does not exist in ${tableName}, skipping removal`);
                return;
            }
        }
        if (backup) {
            const backupTableName = backupTable || `${tableName}_${columnName}_backup`;
            await queryInterface.sequelize.query(`CREATE TABLE "${backupTableName}" AS SELECT id, "${columnName}" FROM "${tableName}"`, { transaction });
        }
        await queryInterface.removeColumn(tableName, columnName, { transaction });
        this.logger.log(`Removed column ${columnName} from table ${tableName}`);
    }
    async modifyColumnType(queryInterface, tableName, columnName, newDefinition, options = {}, transaction) {
        const { castUsing, validate = true, tempColumn = false } = options;
        const sequelize = queryInterface.sequelize;
        const dialect = sequelize.getDialect();
        if (tempColumn || dialect === 'postgres') {
            const tempColumnName = `${columnName}_temp`;
            await queryInterface.addColumn(tableName, tempColumnName, newDefinition, {
                transaction,
            });
            const castExpression = castUsing || `"${columnName}"`;
            await sequelize.query(`UPDATE "${tableName}" SET "${tempColumnName}" = ${castExpression}`, {
                transaction,
            });
            await queryInterface.removeColumn(tableName, columnName, { transaction });
            await queryInterface.renameColumn(tableName, tempColumnName, columnName, { transaction });
        }
        else {
            await queryInterface.changeColumn(tableName, columnName, newDefinition, {
                transaction,
            });
        }
        if (validate) {
            const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}" WHERE "${columnName}" IS NULL`, { transaction });
            this.logger.log(`Column ${columnName} conversion completed. NULL count: ${results[0].count}`);
        }
        this.logger.log(`Modified column ${columnName} type in table ${tableName}`);
    }
    async renameColumnUniversal(queryInterface, tableName, oldColumnName, newColumnName, transaction) {
        await queryInterface.renameColumn(tableName, oldColumnName, newColumnName, { transaction });
        this.logger.log(`Renamed column ${oldColumnName} to ${newColumnName} in table ${tableName}`);
    }
    async addForeignKeyConstraint(queryInterface, tableName, constraint, transaction) {
        await queryInterface.addConstraint(tableName, {
            fields: constraint.fields,
            type: 'foreign key',
            name: constraint.name,
            references: {
                table: constraint.references.table,
                field: constraint.references.field,
            },
            onDelete: constraint.onDelete || 'NO ACTION',
            onUpdate: constraint.onUpdate || 'NO ACTION',
            transaction,
        });
        this.logger.log(`Added foreign key constraint ${constraint.name} to table ${tableName}`);
    }
    async addCheckConstraint(queryInterface, tableName, constraintName, checkExpression, transaction) {
        const sequelize = queryInterface.sequelize;
        await sequelize.query(`ALTER TABLE "${tableName}" ADD CONSTRAINT "${constraintName}" CHECK (${checkExpression})`, { transaction });
        this.logger.log(`Added check constraint ${constraintName} to table ${tableName}`);
    }
    async removeConstraintSafely(queryInterface, tableName, constraintName, options = {}, transaction) {
        const { ifExists = true, cascade = false } = options;
        const sequelize = queryInterface.sequelize;
        if (ifExists) {
            const constraintExists = await this.checkConstraintExists(queryInterface, tableName, constraintName);
            if (!constraintExists) {
                this.logger.warn(`Constraint ${constraintName} does not exist in ${tableName}, skipping removal`);
                return;
            }
        }
        const cascadeClause = cascade ? 'CASCADE' : '';
        await sequelize.query(`ALTER TABLE "${tableName}" DROP CONSTRAINT "${constraintName}" ${cascadeClause}`, { transaction });
        this.logger.log(`Removed constraint ${constraintName} from table ${tableName}`);
    }
    async addUniqueConstraint(queryInterface, tableName, columns, constraintName, transaction) {
        await queryInterface.addConstraint(tableName, {
            fields: columns,
            type: 'unique',
            name: constraintName,
            transaction,
        });
        this.logger.log(`Added unique constraint ${constraintName} to table ${tableName}`);
    }
    async replaceConstraint(queryInterface, tableName, oldConstraintName, newConstraint, transaction) {
        const sequelize = queryInterface.sequelize;
        const t = transaction || (await sequelize.transaction());
        try {
            await this.removeConstraintSafely(queryInterface, tableName, oldConstraintName, {}, t);
            if (newConstraint.type === 'foreign key') {
                await this.addForeignKeyConstraint(queryInterface, tableName, newConstraint, t);
            }
            else if (newConstraint.type === 'check') {
                await this.addCheckConstraint(queryInterface, tableName, newConstraint.name, newConstraint.checkExpression || '', t);
            }
            else {
                await queryInterface.addConstraint(tableName, {
                    ...newConstraint,
                    transaction: t,
                });
            }
            if (!transaction) {
                await t.commit();
            }
            this.logger.log(`Replaced constraint ${oldConstraintName} with ${newConstraint.name} in table ${tableName}`);
        }
        catch (error) {
            if (!transaction) {
                await t.rollback();
            }
            this.logger.error(`Failed to replace constraint ${oldConstraintName}:`, error);
            throw error;
        }
    }
    async batchDataTransform(queryInterface, config) {
        const { sourceTable, targetTable = sourceTable, batchSize = 1000, where = {}, transform, validate, onError, } = config;
        const sequelize = queryInterface.sequelize;
        let offset = 0;
        let totalProcessed = 0;
        let totalModified = 0;
        let errors = 0;
        this.logger.log(`Starting batch data transformation for ${sourceTable}...`);
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
                            .map(([key]) => `"${key}" = :${key}`)
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
                            this.logger.error(`Error transforming row:`, error);
                        }
                    }
                }
                await transaction.commit();
                offset += batchSize;
                this.logger.log(`Processed ${totalProcessed} records...`);
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            catch (error) {
                await transaction.rollback();
                this.logger.error(`Error processing batch at offset ${offset}:`, error);
                throw error;
            }
        }
        this.logger.log(`Batch transformation complete. Processed: ${totalProcessed}, Modified: ${totalModified}, Errors: ${errors}`);
        return { totalProcessed, totalModified, errors };
    }
    async migrateDataBetweenTables(queryInterface, sourceTable, targetTable, columnMapping, options = {}) {
        const { batchSize = 1000, where = {}, deleteSource = false } = options;
        const sequelize = queryInterface.sequelize;
        const sourceColumns = Object.keys(columnMapping).map((col) => `"${col}"`);
        const targetColumns = Object.values(columnMapping).map((col) => `"${col}"`);
        const whereClause = Object.keys(where).length
            ? `WHERE ${Object.entries(where)
                .map(([key, val]) => `"${key}" = '${String(val)}'`)
                .join(' AND ')}`
            : '';
        let offset = 0;
        while (true) {
            const transaction = await sequelize.transaction();
            try {
                const [results] = await sequelize.query(`SELECT ${sourceColumns.join(', ')} FROM "${sourceTable}" ${whereClause} LIMIT ${batchSize} OFFSET ${offset}`, { transaction });
                if (results.length === 0) {
                    await transaction.commit();
                    break;
                }
                for (const row of results) {
                    const values = Object.keys(columnMapping).map((key) => row[key]);
                    const placeholders = targetColumns.map((_, i) => `:val${i}`);
                    await sequelize.query(`INSERT INTO "${targetTable}" (${targetColumns.join(', ')}) VALUES (${placeholders.join(', ')})`, {
                        replacements: values.reduce((acc, val, i) => ({ ...acc, [`val${i}`]: val }), {}),
                        transaction,
                    });
                }
                await transaction.commit();
                offset += batchSize;
                this.logger.log(`Migrated ${offset} records...`);
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        if (deleteSource) {
            await sequelize.query(`DELETE FROM "${sourceTable}" ${whereClause}`);
        }
        this.logger.log(`Data migration from ${sourceTable} to ${targetTable} completed`);
    }
    async copyTableData(queryInterface, sourceTable, targetTable, options = {}, transaction) {
        const { where, columns, limit } = options;
        const sequelize = queryInterface.sequelize;
        const columnList = columns ? columns.map((c) => `"${c}"`).join(', ') : '*';
        const whereClause = where ? `WHERE ${where}` : '';
        const limitClause = limit ? `LIMIT ${limit}` : '';
        await sequelize.query(`INSERT INTO "${targetTable}" SELECT ${columnList} FROM "${sourceTable}" ${whereClause} ${limitClause}`, { transaction });
        this.logger.log(`Copied data from ${sourceTable} to ${targetTable}`);
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
                this.logger.warn(`Validation failed for ${column}: ${failedCount} rows do not satisfy ${rule}`);
            }
        }
        return results;
    }
    async backfillMissingData(queryInterface, tableName, columnName, strategy, config) {
        const sequelize = queryInterface.sequelize;
        let query;
        let rowsUpdated = 0;
        switch (strategy) {
            case 'default': {
                query = `UPDATE "${tableName}" SET "${columnName}" = :defaultValue WHERE "${columnName}" IS NULL`;
                const [defaultResult] = await sequelize.query(query, {
                    replacements: { defaultValue: config.defaultValue },
                });
                rowsUpdated = defaultResult[0].rowCount || 0;
                break;
            }
            case 'derived': {
                query = `UPDATE "${tableName}" SET "${columnName}" = ${config.expression} WHERE "${columnName}" IS NULL`;
                const [derivedResult] = await sequelize.query(query);
                rowsUpdated = derivedResult[0].rowCount || 0;
                break;
            }
            case 'lookup': {
                query = `
          UPDATE "${tableName}" t
          SET "${columnName}" = l."${config.lookupValue}"
          FROM "${config.lookupTable}" l
          WHERE t."${config.lookupKey}" = l."${config.lookupKey}"
          AND t."${columnName}" IS NULL
        `;
                const [lookupResult] = await sequelize.query(query);
                rowsUpdated = lookupResult[0].rowCount || 0;
                break;
            }
            case 'function': {
                if (!config.customFunction) {
                    throw new Error('Custom function required for function strategy');
                }
                const [rows] = await sequelize.query(`SELECT * FROM "${tableName}" WHERE "${columnName}" IS NULL`);
                for (const row of rows) {
                    const newValue = await config.customFunction(row);
                    await sequelize.query(`UPDATE "${tableName}" SET "${columnName}" = :newValue WHERE id = :id`, {
                        replacements: { newValue, id: row.id },
                    });
                    rowsUpdated++;
                }
                break;
            }
        }
        if (strategy !== 'function') {
            const [countResult] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}" WHERE "${columnName}" IS NOT NULL`);
            rowsUpdated = countResult[0].count;
        }
        this.logger.log(`Backfilled ${rowsUpdated} rows in ${tableName}.${columnName}`);
        return { rowsUpdated };
    }
    async checkTableExists(queryInterface, tableName) {
        try {
            await queryInterface.describeTable(tableName);
            return true;
        }
        catch {
            return false;
        }
    }
    async checkColumnExists(queryInterface, tableName, columnName) {
        try {
            const tableDescription = await queryInterface.describeTable(tableName);
            return columnName in tableDescription;
        }
        catch {
            return false;
        }
    }
    async checkIndexExists(queryInterface, tableName, indexName) {
        try {
            const indexes = await queryInterface.showIndex(tableName);
            return indexes.some((index) => index.name === indexName);
        }
        catch {
            return false;
        }
    }
    async checkConstraintExists(queryInterface, tableName, constraintName) {
        const sequelize = queryInterface.sequelize;
        try {
            const [results] = await sequelize.query(`
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_name = :tableName
        AND constraint_name = :constraintName
        AND table_schema = current_schema()
        `, {
                replacements: { tableName, constraintName },
            });
            return results.length > 0;
        }
        catch {
            return false;
        }
    }
    async getTableRowCount(queryInterface, tableName) {
        const sequelize = queryInterface.sequelize;
        const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
        return results[0].count;
    }
    async ensureMigrationHistoryTable(queryInterface) {
        const tableExists = await this.checkTableExists(queryInterface, 'MigrationHistory');
        if (!tableExists) {
            await this.createTableWithDefaults(queryInterface, 'MigrationHistory', {
                name: { type: sequelize_2.DataTypes.STRING(255), allowNull: false, unique: true },
                executedAt: { type: sequelize_2.DataTypes.DATE, allowNull: false, defaultValue: sequelize_2.DataTypes.NOW },
                executionTime: { type: sequelize_2.DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                rowsAffected: { type: sequelize_2.DataTypes.INTEGER, allowNull: true },
                description: { type: sequelize_2.DataTypes.TEXT, allowNull: true },
                checksum: { type: sequelize_2.DataTypes.STRING(64), allowNull: true },
            }, {
                indexes: [
                    { fields: ['name'], unique: true },
                    { fields: ['executedAt'] },
                ],
            });
        }
    }
};
exports.TableOperationsService = TableOperationsService;
exports.TableOperationsService = TableOperationsService = TableOperationsService_1 = __decorate([
    (0, common_1.Injectable)()
], TableOperationsService);
//# sourceMappingURL=index.js.map