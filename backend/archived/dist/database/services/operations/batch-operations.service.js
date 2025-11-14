"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeBatchQueries = executeBatchQueries;
exports.batchFindByPk = batchFindByPk;
exports.batchCreate = batchCreate;
exports.batchUpdate = batchUpdate;
exports.batchDelete = batchDelete;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
async function limitConcurrency(promises, limit) {
    const results = [];
    const executing = [];
    for (const promise of promises) {
        const p = promise.then(result => {
            results.push(result);
        });
        executing.push(p);
        if (executing.length >= limit) {
            await Promise.race(executing);
            executing.splice(executing.findIndex(e => e === p), 1);
        }
    }
    await Promise.all(executing);
    return results;
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function executeBatchQueries(model, queries, config) {
    const logger = new common_1.Logger('BatchOperations::executeBatchQueries');
    const startTime = Date.now();
    const result = {
        success: false,
        totalBatches: Math.ceil(queries.length / config.batchSize),
        successfulBatches: 0,
        failedBatches: 0,
        results: [],
        errors: [],
        executionTimeMs: 0,
        averageBatchTimeMs: 0,
        throughput: 0,
    };
    try {
        const batches = [];
        for (let i = 0; i < queries.length; i += config.batchSize) {
            batches.push(queries.slice(i, i + config.batchSize));
        }
        const batchTimes = [];
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
            const batch = batches[batchIndex];
            const batchStart = Date.now();
            try {
                const batchPromises = batch.map(where => model.findAll({
                    where,
                    transaction: config.transaction,
                }));
                const batchResults = await Promise.allSettled(batchPromises);
                batchResults.forEach((outcome, idx) => {
                    if (outcome.status === 'fulfilled') {
                        result.results.push(...outcome.value);
                    }
                    else {
                        result.errors.push({
                            batchIndex: batchIndex * config.batchSize + idx,
                            error: outcome.reason?.message || 'Unknown error',
                        });
                    }
                });
                result.successfulBatches++;
                const batchTime = Date.now() - batchStart;
                batchTimes.push(batchTime);
                if (config.delayBetweenBatchesMs && batchIndex < batches.length - 1) {
                    await delay(config.delayBetweenBatchesMs);
                }
            }
            catch (error) {
                result.failedBatches++;
                result.errors.push({
                    batchIndex,
                    error: error.message,
                });
                if (config.failFast) {
                    throw error;
                }
            }
        }
        result.success = result.successfulBatches > 0;
        result.executionTimeMs = Date.now() - startTime;
        result.averageBatchTimeMs = batchTimes.reduce((a, b) => a + b, 0) / batchTimes.length;
        result.throughput = (result.results.length / result.executionTimeMs) * 1000;
        logger.log(`Batch execution complete: ${result.successfulBatches}/${result.totalBatches} batches, ` +
            `${result.results.length} records, ${result.throughput.toFixed(2)} records/sec`);
        return result;
    }
    catch (error) {
        logger.error('Batch query execution failed', error);
        throw new common_1.InternalServerErrorException('Batch query execution failed');
    }
}
async function batchFindByPk(model, ids, batchSize = 100, options) {
    const logger = new common_1.Logger('BatchOperations::batchFindByPk');
    try {
        const results = [];
        const batches = [];
        for (let i = 0; i < ids.length; i += batchSize) {
            batches.push(ids.slice(i, i + batchSize));
        }
        for (const batch of batches) {
            const batchResults = await model.findAll({
                where: { id: { [sequelize_1.Op.in]: batch } },
                ...options,
            });
            results.push(...batchResults);
        }
        logger.log(`Batch found ${results.length}/${ids.length} records in ${batches.length} batches`);
        return results;
    }
    catch (error) {
        logger.error('Batch find by PK failed', error);
        throw new common_1.InternalServerErrorException('Batch find by PK failed');
    }
}
async function batchCreate(model, records, config) {
    const logger = new common_1.Logger('BatchOperations::batchCreate');
    const startTime = Date.now();
    const result = {
        success: false,
        totalBatches: Math.ceil(records.length / config.batchSize),
        successfulBatches: 0,
        failedBatches: 0,
        results: [],
        errors: [],
        executionTimeMs: 0,
        averageBatchTimeMs: 0,
        throughput: 0,
    };
    try {
        const batches = [];
        for (let i = 0; i < records.length; i += config.batchSize) {
            batches.push(records.slice(i, i + config.batchSize));
        }
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
            const batch = batches[batchIndex];
            const batchStart = Date.now();
            try {
                const created = await model.bulkCreate(batch, {
                    validate: true,
                    transaction: config.transaction,
                    returning: true,
                });
                result.results.push(...created);
                result.successfulBatches++;
            }
            catch (error) {
                result.failedBatches++;
                result.errors.push({
                    batchIndex,
                    error: error.message,
                });
                if (config.failFast) {
                    throw error;
                }
            }
        }
        result.success = result.successfulBatches > 0;
        result.executionTimeMs = Date.now() - startTime;
        result.throughput = (result.results.length / result.executionTimeMs) * 1000;
        logger.log(`Batch create: ${result.results.length}/${records.length} records created`);
        return result;
    }
    catch (error) {
        logger.error('Batch create failed', error);
        throw new common_1.InternalServerErrorException('Batch create failed');
    }
}
async function batchUpdate(model, updates, config) {
    const logger = new common_1.Logger('BatchOperations::batchUpdate');
    const startTime = Date.now();
    const result = {
        success: false,
        totalBatches: Math.ceil(updates.length / config.batchSize),
        successfulBatches: 0,
        failedBatches: 0,
        results: [],
        errors: [],
        executionTimeMs: 0,
        averageBatchTimeMs: 0,
        throughput: 0,
    };
    try {
        const batches = [];
        for (let i = 0; i < updates.length; i += config.batchSize) {
            batches.push(updates.slice(i, i + config.batchSize));
        }
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
            const batch = batches[batchIndex];
            try {
                const updatePromises = batch.map(async (update) => {
                    const [affectedCount] = await model.update(update.data, {
                        where: update.where,
                        transaction: config.transaction,
                    });
                    return affectedCount;
                });
                const affectedCounts = await Promise.all(updatePromises);
                result.results.push(...affectedCounts);
                result.successfulBatches++;
            }
            catch (error) {
                result.failedBatches++;
                result.errors.push({
                    batchIndex,
                    error: error.message,
                });
                if (config.failFast) {
                    throw error;
                }
            }
        }
        const totalAffected = result.results.reduce((sum, count) => sum + count, 0);
        result.success = result.successfulBatches > 0;
        result.executionTimeMs = Date.now() - startTime;
        result.throughput = (totalAffected / result.executionTimeMs) * 1000;
        logger.log(`Batch update: ${totalAffected} records updated`);
        return result;
    }
    catch (error) {
        logger.error('Batch update failed', error);
        throw new common_1.InternalServerErrorException('Batch update failed');
    }
}
async function batchDelete(model, whereConditions, config) {
    const logger = new common_1.Logger('BatchOperations::batchDelete');
    const startTime = Date.now();
    const result = {
        success: false,
        totalBatches: Math.ceil(whereConditions.length / config.batchSize),
        successfulBatches: 0,
        failedBatches: 0,
        results: [],
        errors: [],
        executionTimeMs: 0,
        averageBatchTimeMs: 0,
        throughput: 0,
    };
    try {
        const batches = [];
        for (let i = 0; i < whereConditions.length; i += config.batchSize) {
            batches.push(whereConditions.slice(i, i + config.batchSize));
        }
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
            const batch = batches[batchIndex];
            try {
                const deletePromises = batch.map(async (where) => {
                    const deletedCount = await model.destroy({
                        where,
                        transaction: config.transaction,
                    });
                    return deletedCount;
                });
                const deleteCounts = await Promise.all(deletePromises);
                result.results.push(...deleteCounts);
                result.successfulBatches++;
            }
            catch (error) {
                result.failedBatches++;
                result.errors.push({
                    batchIndex,
                    error: error.message,
                });
                if (config.failFast) {
                    throw error;
                }
            }
        }
        const totalDeleted = result.results.reduce((sum, count) => sum + count, 0);
        result.success = result.successfulBatches > 0;
        result.executionTimeMs = Date.now() - startTime;
        result.throughput = (totalDeleted / result.executionTimeMs) * 1000;
        logger.log(`Batch delete: ${totalDeleted} records deleted`);
        return result;
    }
    catch (error) {
        logger.error('Batch delete failed', error);
        throw new common_1.InternalServerErrorException('Batch delete failed');
    }
}
//# sourceMappingURL=batch-operations.service.js.map