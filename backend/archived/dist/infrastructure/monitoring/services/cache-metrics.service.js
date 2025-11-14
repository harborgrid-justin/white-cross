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
exports.CacheMetricsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
let CacheMetricsService = class CacheMetricsService extends base_1.BaseService {
    constructor() {
        super('CacheMetricsService');
    }
    cacheMetrics = {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        hitRate: 0,
        avgHitDuration: 0,
        avgMissDuration: 0,
        cacheSize: 0,
        evictions: 0,
    };
    recordCacheOperation(operation, duration) {
        switch (operation) {
            case 'hit':
                this.cacheMetrics.hits++;
                if (duration) {
                    this.cacheMetrics.avgHitDuration = (this.cacheMetrics.avgHitDuration + duration) / 2;
                }
                break;
            case 'miss':
                this.cacheMetrics.misses++;
                if (duration) {
                    this.cacheMetrics.avgMissDuration = (this.cacheMetrics.avgMissDuration + duration) / 2;
                }
                break;
            case 'set':
                this.cacheMetrics.sets++;
                break;
            case 'delete':
                this.cacheMetrics.deletes++;
                break;
            case 'eviction':
                this.cacheMetrics.evictions++;
                break;
        }
        this.updateHitRate();
    }
    updateCacheSize(size) {
        this.cacheMetrics.cacheSize = size;
    }
    getCacheMetrics() {
        return { ...this.cacheMetrics };
    }
    getHitRate() {
        return this.cacheMetrics.hitRate;
    }
    getCacheStats() {
        const totalOperations = this.cacheMetrics.hits + this.cacheMetrics.misses;
        return {
            totalOperations,
            hitRate: this.cacheMetrics.hitRate,
            missRate: totalOperations > 0 ? this.cacheMetrics.misses / totalOperations : 0,
            avgHitDuration: this.cacheMetrics.avgHitDuration,
            avgMissDuration: this.cacheMetrics.avgMissDuration,
            cacheSize: this.cacheMetrics.cacheSize,
            evictions: this.cacheMetrics.evictions,
        };
    }
    reset() {
        this.cacheMetrics = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
            hitRate: 0,
            avgHitDuration: 0,
            avgMissDuration: 0,
            cacheSize: 0,
            evictions: 0,
        };
        this.logInfo('Cache metrics reset');
    }
    updateHitRate() {
        const total = this.cacheMetrics.hits + this.cacheMetrics.misses;
        this.cacheMetrics.hitRate = total > 0 ? this.cacheMetrics.hits / total : 0;
    }
};
exports.CacheMetricsService = CacheMetricsService;
exports.CacheMetricsService = CacheMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CacheMetricsService);
//# sourceMappingURL=cache-metrics.service.js.map