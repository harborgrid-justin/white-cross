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
exports.DataMigrationService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
let DataMigrationService = class DataMigrationService extends base_1.BaseService {
    constructor() {
        super("DataMigrationService");
    }
    async batchDataTransform(queryInterface, config) {
        const { sourceTable, batchSize = 1000, where = {}, transform, validate, onError, } = config;
        const sequelize = queryInterface.sequelize;
        let offset = 0;
        let totalProcessed = 0;
        let totalModified = 0;
        let errors = 0;
        this.logInfo(`Starting batch data transformation for ${sourceTable}...`);
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
                            await sequelize.query(`UPDATE "${sourceTable}" SET ${setClause} WHERE id = :id`, {
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
        this.logInfo(`Batch transformation complete. Processed: ${totalProcessed}, Modified: ${totalModified}, Errors: ${errors}`);
        return { totalProcessed, totalModified, errors };
    }
    async migrateDataBetweenTables(queryInterface, sourceTable, targetTable, columnMapping, options = {}) {
        const { batchSize = 1000, where = {}, deleteSource = false } = options;
        const sequelize = queryInterface.sequelize;
        const sourceColumns = Object.keys(columnMapping).map((col) => `"${col}"`);
        const targetColumns = Object.values(columnMapping).map((col) => `"${col}"`);
        const whereClause = Object.keys(where).length
            ? `WHERE ${Object.entries(where)
                .map(([key, val]) => `"${key}" = '${val}'`)
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
                this.logInfo(`Migrated ${offset} records...`);
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        if (deleteSource) {
            await sequelize.query(`DELETE FROM "${sourceTable}" ${whereClause}`);
        }
        this.logInfo(`Data migration from ${sourceTable} to ${targetTable} completed`);
    }
    async copyTableData(queryInterface, sourceTable, targetTable, options = {}, transaction) {
        const { where, columns, limit } = options;
        const sequelize = queryInterface.sequelize;
        const columnList = columns ? columns.map((c) => `"${c}"`).join(', ') : '*';
        const whereClause = where ? `WHERE ${where}` : '';
        const limitClause = limit ? `LIMIT ${limit}` : '';
        await sequelize.query(`INSERT INTO "${targetTable}" SELECT ${columnList} FROM "${sourceTable}" ${whereClause} ${limitClause}`, { transaction });
        this.logInfo(`Copied data from ${sourceTable} to ${targetTable}`);
    }
    async seedDataWithUpsert(queryInterface, config) {
        const { table, data, updateOnDuplicate = [], transaction } = config;
        const sequelize = queryInterface.sequelize;
        for (const row of data) {
            const columns = Object.keys(row);
            const values = Object.values(row);
            const placeholders = columns.map((_, i) => `:val${i}`);
            const updateClause = updateOnDuplicate.length
                ? `ON CONFLICT (id) DO UPDATE SET ${updateOnDuplicate.map((col) => `"${col}" = EXCLUDED."${col}"`).join(', ')}`
                : 'ON CONFLICT (id) DO NOTHING';
            await sequelize.query(`
        INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(', ')})
        VALUES (${placeholders.join(', ')})
        ${updateClause}
      `, {
                replacements: values.reduce((acc, val, i) => ({ ...acc, [`val${i}`]: val }), {}),
                transaction,
            });
        }
        this.logInfo(`Seeded ${data.length} rows into ${table}`);
    }
    async generateSeedFromExisting(queryInterface, tableName, options = {}) {
        const { where, limit, exclude = [] } = options;
        const sequelize = queryInterface.sequelize;
        const whereClause = where ? `WHERE ${where}` : '';
        const limitClause = limit ? `LIMIT ${limit}` : '';
        const [results] = await sequelize.query(`SELECT * FROM "${tableName}" ${whereClause} ${limitClause}`);
        const seeds = results.map((row) => {
            const seed = { ...row };
            for (const col of exclude) {
                delete seed[col];
            }
            return seed;
        });
        this.logInfo(`Generated ${seeds.length} seed records from ${tableName}`);
        return seeds;
    }
    async clearSeedData(queryInterface, tables, options = {}) {
        const { cascade = false, where } = options;
        const sequelize = queryInterface.sequelize;
        for (const table of tables) {
            const cascadeClause = cascade ? 'CASCADE' : '';
            if (where && Object.keys(where).length > 0) {
                const whereClause = Object.entries(where)
                    .map(([key, val]) => `"${key}" = '${val}'`)
                    .join(' AND ');
                await sequelize.query(`DELETE FROM "${table}" WHERE ${whereClause}`);
            }
            else {
                await sequelize.query(`TRUNCATE TABLE "${table}" ${cascadeClause}`);
            }
            this.logInfo(`Cleared seed data from ${table}`);
        }
    }
    async createTestFixtures(queryInterface, fixtures) {
        for (const fixture of fixtures) {
            const { model, count, factory } = fixture;
            const data = [];
            for (let i = 0; i < count; i++) {
                data.push(factory(i));
            }
            await this.seedDataWithUpsert(queryInterface, {
                table: model,
                data,
            });
            this.logInfo(`Created ${count} fixtures for ${model}`);
        }
    }
};
exports.DataMigrationService = DataMigrationService;
exports.DataMigrationService = DataMigrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DataMigrationService);
//# sourceMappingURL=data-migration.service.js.map