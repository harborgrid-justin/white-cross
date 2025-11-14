"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueryStream = createQueryStream;
exports.streamQuery = streamQuery;
exports.cursorPaginate = cursorPaginate;
exports.streamToTransform = streamToTransform;
exports.batchProcessStream = batchProcessStream;
exports.createQueryIterator = createQueryIterator;
exports.streamWithParallelProcessing = streamWithParallelProcessing;
const common_1 = require("@nestjs/common");
const stream_1 = require("stream");
const sequelize_1 = require("sequelize");
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function fetchBatch(model, where, config, offset) {
    const batch = await model.findAll({
        where,
        limit: config.batchSize,
        offset,
        transaction: config.transaction,
    });
    const hasMore = batch.length === config.batchSize;
    const newOffset = offset + config.batchSize;
    return { batch, hasMore, newOffset };
}
async function createQueryStream(model, where, config) {
    const logger = new common_1.Logger('StreamingOperations::createQueryStream');
    try {
        let offset = 0;
        let hasMore = true;
        const stream = new stream_1.Readable({
            objectMode: config.objectMode ?? true,
            highWaterMark: config.highWaterMark || 16,
            async read() {
                try {
                    if (!hasMore) {
                        this.push(null);
                        return;
                    }
                    const result = await fetchBatch(model, where, config, offset);
                    if (result.batch.length === 0) {
                        hasMore = false;
                        this.push(null);
                        return;
                    }
                    offset = result.newOffset;
                    hasMore = result.hasMore;
                    for (const record of result.batch) {
                        if (!this.push(record)) {
                            break;
                        }
                    }
                }
                catch (error) {
                    logger.error('Stream read error', error);
                    this.destroy(error);
                }
            },
        });
        logger.log(`Created query stream for ${model.name}`);
        return stream;
    }
    catch (error) {
        logger.error('Failed to create query stream', error);
        throw new common_1.InternalServerErrorException('Failed to create query stream');
    }
}
async function streamQuery(model, where, config, processor) {
    const logger = new common_1.Logger('StreamingOperations::streamQuery');
    const startTime = Date.now();
    const metrics = {
        totalRecords: 0,
        totalBatches: 0,
        averageBatchSize: 0,
        executionTimeMs: 0,
        throughput: 0,
        memoryPeakMb: 0,
        backpressureEvents: 0,
    };
    try {
        let offset = 0;
        let hasMore = true;
        const batchSizes = [];
        while (hasMore) {
            const memUsage = process.memoryUsage();
            const heapUsedMb = memUsage.heapUsed / 1024 / 1024;
            metrics.memoryPeakMb = Math.max(metrics.memoryPeakMb, heapUsedMb);
            if (config.backpressureThreshold && heapUsedMb > config.backpressureThreshold) {
                logger.warn(`Backpressure: memory usage ${heapUsedMb.toFixed(2)}MB, pausing`);
                metrics.backpressureEvents++;
                await delay(100);
                if (global.gc) {
                    global.gc();
                }
            }
            const batch = await model.findAll({
                where,
                limit: config.batchSize,
                offset,
                transaction: config.transaction,
            });
            if (batch.length === 0) {
                hasMore = false;
                break;
            }
            batchSizes.push(batch.length);
            metrics.totalBatches++;
            for (const record of batch) {
                await processor(record);
                metrics.totalRecords++;
            }
            offset += config.batchSize;
            hasMore = batch.length === config.batchSize;
        }
        metrics.averageBatchSize = batchSizes.reduce((a, b) => a + b, 0) / batchSizes.length;
        metrics.executionTimeMs = Date.now() - startTime;
        metrics.throughput = (metrics.totalRecords / metrics.executionTimeMs) * 1000;
        logger.log(`Stream query complete: ${metrics.totalRecords} records, ` +
            `${metrics.throughput.toFixed(2)} records/sec, ` +
            `peak ${metrics.memoryPeakMb.toFixed(2)}MB`);
        return metrics;
    }
    catch (error) {
        logger.error('Stream query failed', error);
        throw new common_1.InternalServerErrorException('Stream query failed');
    }
}
async function cursorPaginate(model, config, transaction) {
    const logger = new common_1.Logger('StreamingOperations::cursorPaginate');
    try {
        const where = {};
        if (config.cursor) {
            const op = config.direction === 'forward'
                ? config.orderDirection === 'DESC'
                    ? sequelize_1.Op.lt
                    : sequelize_1.Op.gt
                : config.orderDirection === 'DESC'
                    ? sequelize_1.Op.gt
                    : sequelize_1.Op.lt;
            where[config.cursorField] = { [op]: config.cursor };
        }
        const orderDirection = config.orderDirection || 'ASC';
        const order = [[config.cursorField, orderDirection]];
        const records = await model.findAll({
            where,
            order,
            limit: config.limit + 1,
            transaction,
        });
        const hasMore = records.length > config.limit;
        const data = hasMore ? records.slice(0, config.limit) : records;
        const nextCursor = hasMore
            ? data[data.length - 1][config.cursorField]
            : null;
        const prevCursor = data.length > 0
            ? data[0][config.cursorField]
            : null;
        logger.log(`Cursor paginate: ${data.length} records, hasMore: ${hasMore}, ` +
            `nextCursor: ${nextCursor}`);
        return {
            data,
            hasMore,
            nextCursor,
            prevCursor,
        };
    }
    catch (error) {
        logger.error('Cursor pagination failed', error);
        throw new common_1.InternalServerErrorException('Cursor pagination failed');
    }
}
async function streamToTransform(model, where, config, transform) {
    const logger = new common_1.Logger('StreamingOperations::streamToTransform');
    try {
        let offset = 0;
        let hasMore = true;
        const stream = new stream_1.Readable({
            objectMode: true,
            highWaterMark: config.highWaterMark || 16,
            async read() {
                try {
                    if (!hasMore) {
                        this.push(null);
                        return;
                    }
                    const batch = await model.findAll({
                        where,
                        limit: config.batchSize,
                        offset,
                        transaction: config.transaction,
                    });
                    if (batch.length === 0) {
                        hasMore = false;
                        this.push(null);
                        return;
                    }
                    offset += config.batchSize;
                    hasMore = batch.length === config.batchSize;
                    for (const record of batch) {
                        try {
                            const transformed = await transform(record);
                            if (!this.push(transformed)) {
                                break;
                            }
                        }
                        catch (transformError) {
                            logger.error('Transform error', transformError);
                            this.destroy(transformError);
                            return;
                        }
                    }
                }
                catch (error) {
                    logger.error('Stream read error', error);
                    this.destroy(error);
                }
            },
        });
        logger.log(`Created transform stream for ${model.name}`);
        return stream;
    }
    catch (error) {
        logger.error('Failed to create transform stream', error);
        throw new common_1.InternalServerErrorException('Failed to create transform stream');
    }
}
async function batchProcessStream(model, where, config) {
    const logger = new common_1.Logger('StreamingOperations::batchProcessStream');
    const startTime = Date.now();
    const metrics = {
        totalRecords: 0,
        totalBatches: 0,
        averageBatchSize: 0,
        executionTimeMs: 0,
        throughput: 0,
        memoryPeakMb: 0,
        backpressureEvents: 0,
    };
    try {
        let offset = 0;
        let hasMore = true;
        const batchSizes = [];
        const memoryCheckInterval = config.memoryCheckInterval || 10;
        while (hasMore) {
            if (metrics.totalBatches % memoryCheckInterval === 0) {
                const memUsage = process.memoryUsage();
                const heapUsedMb = memUsage.heapUsed / 1024 / 1024;
                metrics.memoryPeakMb = Math.max(metrics.memoryPeakMb, heapUsedMb);
                if (config.backpressureThreshold && heapUsedMb > config.backpressureThreshold) {
                    logger.warn(`Backpressure: memory usage ${heapUsedMb.toFixed(2)}MB, pausing`);
                    metrics.backpressureEvents++;
                    await delay(100);
                    if (global.gc) {
                        global.gc();
                    }
                }
            }
            const batch = await model.findAll({
                where,
                limit: config.batchSize,
                offset,
                transaction: config.transaction,
            });
            if (batch.length === 0) {
                hasMore = false;
                break;
            }
            batchSizes.push(batch.length);
            metrics.totalBatches++;
            metrics.totalRecords += batch.length;
            await config.processBatch(batch);
            offset += config.batchSize;
            hasMore = batch.length === config.batchSize;
        }
        metrics.averageBatchSize = batchSizes.reduce((a, b) => a + b, 0) / batchSizes.length;
        metrics.executionTimeMs = Date.now() - startTime;
        metrics.throughput = (metrics.totalRecords / metrics.executionTimeMs) * 1000;
        logger.log(`Batch process stream complete: ${metrics.totalRecords} records in ${metrics.totalBatches} batches, ` +
            `${metrics.throughput.toFixed(2)} records/sec, ` +
            `peak ${metrics.memoryPeakMb.toFixed(2)}MB`);
        return metrics;
    }
    catch (error) {
        logger.error('Batch process stream failed', error);
        throw new common_1.InternalServerErrorException('Batch process stream failed');
    }
}
async function* createQueryIterator(model, where, config) {
    const logger = new common_1.Logger('StreamingOperations::createQueryIterator');
    try {
        let offset = 0;
        let hasMore = true;
        while (hasMore) {
            const batch = await model.findAll({
                where,
                limit: config.batchSize,
                offset,
                transaction: config.transaction,
            });
            if (batch.length === 0) {
                hasMore = false;
                break;
            }
            for (const record of batch) {
                yield record;
            }
            offset += config.batchSize;
            hasMore = batch.length === config.batchSize;
            if (config.backpressureThreshold) {
                const memUsage = process.memoryUsage();
                const heapUsedMb = memUsage.heapUsed / 1024 / 1024;
                if (heapUsedMb > config.backpressureThreshold) {
                    logger.warn(`Backpressure: memory usage ${heapUsedMb.toFixed(2)}MB, pausing`);
                    await delay(100);
                    if (global.gc) {
                        global.gc();
                    }
                }
            }
        }
        logger.log(`Query iterator completed for ${model.name}`);
    }
    catch (error) {
        logger.error('Query iterator failed', error);
        throw new common_1.InternalServerErrorException('Query iterator failed');
    }
}
async function streamWithParallelProcessing(model, where, config) {
    const logger = new common_1.Logger('StreamingOperations::streamWithParallelProcessing');
    const startTime = Date.now();
    const metrics = {
        totalRecords: 0,
        totalBatches: 0,
        averageBatchSize: 0,
        executionTimeMs: 0,
        throughput: 0,
        memoryPeakMb: 0,
        backpressureEvents: 0,
    };
    try {
        let offset = 0;
        let hasMore = true;
        const batchSizes = [];
        while (hasMore) {
            const memUsage = process.memoryUsage();
            const heapUsedMb = memUsage.heapUsed / 1024 / 1024;
            metrics.memoryPeakMb = Math.max(metrics.memoryPeakMb, heapUsedMb);
            if (config.backpressureThreshold && heapUsedMb > config.backpressureThreshold) {
                logger.warn(`Backpressure: memory usage ${heapUsedMb.toFixed(2)}MB, pausing`);
                metrics.backpressureEvents++;
                await delay(100);
                if (global.gc) {
                    global.gc();
                }
            }
            const batch = await model.findAll({
                where,
                limit: config.batchSize,
                offset,
                transaction: config.transaction,
            });
            if (batch.length === 0) {
                hasMore = false;
                break;
            }
            batchSizes.push(batch.length);
            metrics.totalBatches++;
            const semaphore = new Array(config.concurrency).fill(null);
            let processedInBatch = 0;
            const processRecord = async (record) => {
                await config.processor(record);
                processedInBatch++;
            };
            const promises = [];
            for (const record of batch) {
                const promise = processRecord(record);
                promises.push(promise);
                if (promises.length >= config.concurrency) {
                    await Promise.race(promises);
                    const completedIndex = promises.findIndex((p) => p.then(() => true).catch(() => true));
                    if (completedIndex !== -1) {
                        promises.splice(completedIndex, 1);
                    }
                }
            }
            await Promise.all(promises);
            metrics.totalRecords += processedInBatch;
            offset += config.batchSize;
            hasMore = batch.length === config.batchSize;
        }
        metrics.averageBatchSize = batchSizes.reduce((a, b) => a + b, 0) / batchSizes.length;
        metrics.executionTimeMs = Date.now() - startTime;
        metrics.throughput = (metrics.totalRecords / metrics.executionTimeMs) * 1000;
        logger.log(`Parallel stream processing complete: ${metrics.totalRecords} records, ` +
            `${metrics.throughput.toFixed(2)} records/sec, ` +
            `peak ${metrics.memoryPeakMb.toFixed(2)}MB`);
        return metrics;
    }
    catch (error) {
        logger.error('Parallel stream processing failed', error);
        throw new common_1.InternalServerErrorException('Parallel stream processing failed');
    }
}
//# sourceMappingURL=streaming-operations.service.js.map