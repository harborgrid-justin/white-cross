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
exports.StreamingQueryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const stream_1 = require("stream");
const base_1 = require("../../common/base");
let StreamingQueryService = class StreamingQueryService extends base_1.BaseService {
    sequelize;
    constructor(sequelize) {
        super();
        this.sequelize = sequelize;
    }
    createQueryStream(model, where = {}, config = { batchSize: 1000 }) {
        const { batchSize = 1000, highWaterMark = 1000, objectMode = true, transaction } = config;
        let offset = 0;
        let hasMore = true;
        const metrics = {
            totalRecords: 0,
            totalBatches: 0,
            averageBatchSize: 0,
            executionTimeMs: 0,
            throughput: 0,
            memoryPeakMb: 0,
            backpressureEvents: 0,
        };
        const startTime = Date.now();
        const stream = new stream_1.Readable({
            highWaterMark,
            objectMode,
            read: async function () {
                if (!hasMore) {
                    this.push(null);
                    return;
                }
                try {
                    const options = {
                        where,
                        limit: batchSize,
                        offset,
                        transaction,
                    };
                    const records = await model.findAll(options);
                    if (records.length === 0) {
                        hasMore = false;
                        this.push(null);
                        return;
                    }
                    offset += records.length;
                    metrics.totalRecords += records.length;
                    metrics.totalBatches++;
                    this.push(records);
                }
                catch (error) {
                    this.emit('error', error);
                    this.push(null);
                }
            }
        });
        stream.on('end', () => {
            metrics.executionTimeMs = Date.now() - startTime;
            metrics.averageBatchSize = metrics.totalRecords / metrics.totalBatches;
            metrics.throughput = metrics.totalRecords / (metrics.executionTimeMs / 1000);
            this.logInfo(`Streaming completed: ${JSON.stringify(metrics)}`);
        });
        return stream;
    }
    async executeCursorPagination(model, config, baseWhere = {}) {
        const { cursorField, limit, direction, cursor, orderDirection = 'ASC' } = config;
        const where = { ...baseWhere };
        const order = [[cursorField, orderDirection]];
        if (cursor) {
            const operator = direction === 'forward' ? (orderDirection === 'ASC' ? sequelize_2.Op.gt : sequelize_2.Op.lt) : (orderDirection === 'ASC' ? sequelize_2.Op.lt : sequelize_2.Op.gt);
            where[cursorField] = { [operator]: cursor };
        }
        const records = await model.findAll({
            where,
            order,
            limit: limit + 1,
        });
        const hasNext = records.length > limit;
        const resultRecords = hasNext ? records.slice(0, limit) : records;
        const nextCursor = hasNext && resultRecords.length > 0 ? resultRecords[resultRecords.length - 1][cursorField] : undefined;
        return {
            records: resultRecords,
            hasNext,
            nextCursor,
        };
    }
    createRealtimeSubscription(model, config) {
        const { pollIntervalMs, where, onChange, onError } = config;
        const interval = setInterval(async () => {
            try {
                const records = await model.findAll({ where });
                await onChange(records);
            }
            catch (error) {
                if (onError) {
                    onError(error);
                }
                else {
                    this.logError('Realtime subscription error:', error);
                }
            }
        }, pollIntervalMs);
        const unsubscribe = () => {
            clearInterval(interval);
            this.logInfo('Realtime subscription unsubscribed');
        };
        return { unsubscribe };
    }
    async processWithTransform(model, where, transformFn, config = { batchSize: 1000 }) {
        const stream = this.createQueryStream(model, where, config);
        const results = [];
        return new Promise((resolve, reject) => {
            const transformStream = new stream_1.Transform({
                objectMode: true,
                transform: async (chunk, encoding, callback) => {
                    try {
                        const transformed = await Promise.all(chunk.map(transformFn));
                        results.push(...transformed);
                        callback();
                    }
                    catch (error) {
                        callback(error);
                    }
                }
            });
            stream
                .pipe(transformStream)
                .on('finish', () => resolve(results))
                .on('error', reject);
        });
    }
    async executeStreamingAggregation(model, groupBy, aggregations, where = {}, config = { batchSize: 5000 }) {
        const attributes = [
            ...groupBy,
            ...Object.entries(aggregations).map(([alias, [fnType, field]]) => [
                (0, sequelize_2.fn)(fnType, (0, sequelize_2.col)(field)),
                alias
            ])
        ];
        const stream = this.createQueryStream(model, where, { ...config, batchSize: 1 });
        const results = [];
        return new Promise((resolve, reject) => {
            stream
                .on('data', (batch) => {
                results.push(...batch);
            })
                .on('end', () => resolve(results))
                .on('error', reject);
        });
    }
    getStreamingMetrics() {
        return {
            totalRecords: 0,
            totalBatches: 0,
            averageBatchSize: 0,
            executionTimeMs: 0,
            throughput: 0,
            memoryPeakMb: 0,
            backpressureEvents: 0,
        };
    }
};
exports.StreamingQueryService = StreamingQueryService;
exports.StreamingQueryService = StreamingQueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_2.Sequelize])
], StreamingQueryService);
//# sourceMappingURL=streaming-query.service.js.map