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
exports.HealthCalculationsService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const worker_pool_service_1 = require("./worker-pool.service");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let HealthCalculationsService = class HealthCalculationsService extends base_1.BaseService {
    workerPool = null;
    constructor(logger) {
        super({
            serviceName: 'HealthCalculationsService',
            logger,
            enableAuditLogging: false,
        });
    }
    async onModuleInit() {
        let workerScript;
        if (__dirname.includes('src')) {
            workerScript = (0, path_1.join)(__dirname.replace('src', 'dist'), 'healthCalculations.worker.js');
        }
        else {
            workerScript = (0, path_1.join)(__dirname, 'healthCalculations.worker.js');
        }
        this.logInfo(`Initializing health calculations worker pool with script: ${workerScript}`);
        this.workerPool = new worker_pool_service_1.WorkerPoolService(workerScript, {
            poolSize: undefined,
            taskTimeout: 30000,
        });
        await this.workerPool.onModuleInit();
        this.logInfo('Health calculations worker pool initialized');
    }
    async onModuleDestroy() {
        if (this.workerPool) {
            this.logInfo('Shutting down health calculations worker pool');
            await this.workerPool.shutdown();
            this.workerPool = null;
        }
    }
    getPool() {
        if (!this.workerPool) {
            throw new Error('Health calculations worker pool not initialized');
        }
        return this.workerPool;
    }
    async calculateBMI(height, weight) {
        const pool = this.getPool();
        return pool.executeTask('bmi', { height, weight });
    }
    async batchCalculateBMI(records) {
        const pool = this.getPool();
        return pool.executeTask('bmi_batch', records);
    }
    async analyzeVitalTrends(vitals) {
        const pool = this.getPool();
        return pool.executeTask('vital_trends', vitals);
    }
    async calculateAggregations(values) {
        const pool = this.getPool();
        return pool.executeTask('aggregations', values);
    }
    getPoolStats() {
        return this.getPool().getStats();
    }
};
exports.HealthCalculationsService = HealthCalculationsService;
exports.HealthCalculationsService = HealthCalculationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], HealthCalculationsService);
//# sourceMappingURL=health-calculations.service.js.map