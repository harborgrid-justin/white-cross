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
exports.CacheWarmingService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_service_1 = require("./cache.service");
const cache_interfaces_1 = require("./cache.interfaces");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let CacheWarmingService = class CacheWarmingService extends base_1.BaseService {
    cacheService;
    eventEmitter;
    schedulerRegistry;
    strategies = new Map();
    warmingInProgress = false;
    lastWarmingTime;
    warmingStats = {
        totalWarmed: 0,
        lastCount: 0,
        failures: 0,
    };
    constructor(logger, cacheService, eventEmitter, schedulerRegistry) {
        super({
            serviceName: 'CacheWarmingService',
            logger,
            enableAuditLogging: true,
        });
        this.cacheService = cacheService;
        this.eventEmitter = eventEmitter;
        this.schedulerRegistry = schedulerRegistry;
    }
    async onModuleInit() {
        this.logInfo('Cache warming service initialized');
    }
    registerStrategy(strategy) {
        this.strategies.set(strategy.name, strategy);
        this.logInfo(`Registered cache warming strategy: ${strategy.name} (${strategy.type})`);
        if (strategy.type === 'scheduled' && strategy.schedule) {
            this.scheduleStrategy(strategy);
        }
    }
    unregisterStrategy(name) {
        const strategy = this.strategies.get(name);
        if (strategy && strategy.type === 'scheduled' && strategy.schedule) {
            try {
                this.schedulerRegistry.deleteCronJob(`cache-warm-${name}`);
            }
            catch (error) {
            }
        }
        this.strategies.delete(name);
        this.logInfo(`Unregistered cache warming strategy: ${name}`);
    }
    async warmByStrategy(strategyName) {
        const strategy = this.strategies.get(strategyName);
        if (!strategy) {
            this.logWarning(`Cache warming strategy not found: ${strategyName}`);
            return 0;
        }
        return this.executeStrategy(strategy);
    }
    async warmAll(filterType) {
        if (this.warmingInProgress) {
            this.logWarning('Cache warming already in progress, skipping');
            return 0;
        }
        this.warmingInProgress = true;
        let totalWarmed = 0;
        try {
            const sortedStrategies = Array.from(this.strategies.values()).sort((a, b) => b.priority - a.priority);
            for (const strategy of sortedStrategies) {
                if (filterType && strategy.type !== filterType) {
                    continue;
                }
                try {
                    const count = await this.executeStrategy(strategy);
                    totalWarmed += count;
                }
                catch (error) {
                    this.logError(`Failed to execute warming strategy ${strategy.name}:`, error);
                    this.warmingStats.failures++;
                }
            }
            this.warmingStats.totalWarmed += totalWarmed;
            this.warmingStats.lastCount = totalWarmed;
            this.lastWarmingTime = new Date();
            this.logInfo(`Cache warming completed: ${totalWarmed} entries warmed using ${sortedStrategies.length} strategies`);
            return totalWarmed;
        }
        finally {
            this.warmingInProgress = false;
        }
    }
    async executeStrategy(strategy) {
        this.logInfo(`Executing cache warming strategy: ${strategy.name}`);
        const startTime = Date.now();
        try {
            const entries = await strategy.loader();
            const ttl = strategy.ttl || 3600;
            let warmed = 0;
            for (const entry of entries) {
                try {
                    await this.cacheService.set(entry.key, entry.value, {
                        ttl,
                        ...entry.options,
                    });
                    warmed++;
                }
                catch (error) {
                    this.logError(`Failed to warm cache key ${entry.key}:`, error);
                }
            }
            const duration = Date.now() - startTime;
            this.logInfo(`Cache warming strategy ${strategy.name} completed: ${warmed}/${entries.length} entries in ${duration}ms`);
            this.eventEmitter.emit(cache_interfaces_1.CacheEvent.WARM, {
                strategy: strategy.name,
                count: warmed,
                duration,
            });
            return warmed;
        }
        catch (error) {
            this.logError(`Cache warming strategy ${strategy.name} failed:`, error);
            throw error;
        }
    }
    scheduleStrategy(strategy) {
        if (!strategy.schedule) {
            return;
        }
        try {
            const jobName = `cache-warm-${strategy.name}`;
            const CronJob = require('cron').CronJob;
            const job = new CronJob(strategy.schedule, async () => {
                this.logInfo(`Running scheduled cache warming: ${strategy.name}`);
                await this.warmByStrategy(strategy.name);
            }, null, true);
            this.schedulerRegistry.addCronJob(jobName, job);
            this.logInfo(`Scheduled cache warming strategy ${strategy.name} with schedule: ${strategy.schedule}`);
        }
        catch (error) {
            this.logError(`Failed to schedule warming strategy ${strategy.name}:`, error);
        }
    }
    async handleCacheMiss(payload) {
        for (const strategy of this.strategies.values()) {
            if (strategy.type === 'lazy') {
                setImmediate(async () => {
                    try {
                        await this.executeStrategy(strategy);
                    }
                    catch (error) {
                        this.logError(`Lazy warming failed for strategy ${strategy.name}:`, error);
                    }
                });
            }
        }
    }
    getStats() {
        return {
            totalWarmed: this.warmingStats.totalWarmed,
            lastCount: this.warmingStats.lastCount,
            failures: this.warmingStats.failures,
            lastWarmingTime: this.lastWarmingTime,
            strategies: this.strategies.size,
            inProgress: this.warmingInProgress,
        };
    }
    async scheduledWarmingJob() {
        if (process.env.CACHE_WARMING_ENABLED !== 'true') {
            return;
        }
        this.logInfo('Running scheduled cache warming job');
        await this.warmAll('scheduled');
    }
    resetStats() {
        this.warmingStats = {
            totalWarmed: 0,
            lastCount: 0,
            failures: 0,
        };
        this.lastWarmingTime = undefined;
    }
};
exports.CacheWarmingService = CacheWarmingService;
__decorate([
    (0, event_emitter_1.OnEvent)(cache_interfaces_1.CacheEvent.MISS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CacheWarmingService.prototype, "handleCacheMiss", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR, {
        name: 'cache-warming-hourly',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheWarmingService.prototype, "scheduledWarmingJob", null);
exports.CacheWarmingService = CacheWarmingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        cache_service_1.CacheService,
        event_emitter_1.EventEmitter2,
        schedule_1.SchedulerRegistry])
], CacheWarmingService);
//# sourceMappingURL=cache-warming.service.js.map