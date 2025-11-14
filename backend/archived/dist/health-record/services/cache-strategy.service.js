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
exports.CacheStrategyService = void 0;
const common_1 = require("@nestjs/common");
const cache_strategy_orchestrator_service_1 = require("./cache/cache-strategy-orchestrator.service");
const cache_optimization_service_1 = require("./cache/cache-optimization.service");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let CacheStrategyService = class CacheStrategyService extends base_1.BaseService {
    orchestrator;
    optimization;
    constructor(logger, orchestrator, optimization) {
        super({
            serviceName: 'CacheStrategyService',
            logger,
            enableAuditLogging: true,
        });
        this.orchestrator = orchestrator;
        this.optimization = optimization;
        this.logInfo('Cache Strategy Service (Facade) initialized - delegating to modular services');
    }
    async get(key, compliance) {
        const result = await this.orchestrator.get(key, compliance);
        return result.success ? result.data || null : null;
    }
    async set(key, data, ttl, compliance, tags = []) {
        await this.orchestrator.set(key, data, ttl, compliance, tags);
    }
    async invalidate(pattern, reason = 'manual') {
        await this.orchestrator.invalidate(pattern, reason);
    }
    getCacheMetrics() {
        return this.orchestrator.getCacheMetrics();
    }
    getAccessPatterns() {
        return this.orchestrator.getAccessPatterns();
    }
    async performCacheWarming() {
        await this.optimization.performCacheWarming();
    }
    async performIntelligentPrefetch() {
        await this.optimization.performIntelligentPrefetch();
    }
    async performCacheOptimization() {
        await this.optimization.performCacheOptimization();
    }
    onModuleDestroy() {
        this.logInfo('Cache Strategy Service (Facade) destroyed');
    }
};
exports.CacheStrategyService = CacheStrategyService;
exports.CacheStrategyService = CacheStrategyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        cache_strategy_orchestrator_service_1.CacheStrategyOrchestratorService,
        cache_optimization_service_1.CacheOptimizationService])
], CacheStrategyService);
//# sourceMappingURL=cache-strategy.service.js.map