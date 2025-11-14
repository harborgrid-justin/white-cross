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
exports.HealthRecordCacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const base_interceptor_1 = require("../../common/interceptors/base.interceptor");
const enterprise_cache_service_1 = require("../../common/enterprise/services/enterprise-cache.service");
const health_record_metrics_service_1 = require("../services/health-record-metrics.service");
const enterprise_decorators_1 = require("../../common/enterprise/decorators/enterprise-decorators");
let HealthRecordCacheInterceptor = class HealthRecordCacheInterceptor extends base_interceptor_1.BaseInterceptor {
    reflector;
    metricsService;
    enterpriseCache;
    constructor(reflector, metricsService) {
        super();
        this.reflector = reflector;
        this.metricsService = metricsService;
        this.enterpriseCache = new enterprise_cache_service_1.EnterpriseCacheService('health-record');
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const handler = context.getHandler();
        const controller = context.getClass();
        const cacheConfig = this.reflector.getAllAndOverride(enterprise_decorators_1.ENTERPRISE_CACHE_KEY, [
            handler,
            controller,
        ]);
        if (!cacheConfig || request.method !== 'GET') {
            return next.handle();
        }
        const cacheKey = this.generateCacheKey(request, cacheConfig);
        const complianceLevel = this.determineComplianceLevel(request);
        const startTime = Date.now();
        try {
            const cachedData = await this.enterpriseCache.get(cacheKey);
            if (cachedData !== null) {
                const responseTime = Date.now() - startTime;
                this.metricsService.recordCacheMetrics('HIT', this.getCacheType(complianceLevel), responseTime);
                this.logCacheHit(cacheKey, complianceLevel, responseTime);
                return (0, rxjs_1.of)(cachedData);
            }
            return next.handle().pipe((0, operators_1.tap)(async (data) => {
                const responseTime = Date.now() - startTime;
                this.metricsService.recordCacheMetrics('MISS', this.getCacheType(complianceLevel), responseTime);
                await this.cacheResponse(cacheKey, data, cacheConfig, complianceLevel, responseTime);
            }));
        }
        catch (error) {
            this.logError(`Cache operation failed for key ${cacheKey}`, error, {
                complianceLevel,
                cacheKey: cacheKey.substring(0, 50),
            });
            this.metricsService.recordCacheMetrics('MISS', this.getCacheType(complianceLevel), 0);
            return next.handle();
        }
    }
    generateCacheKey(request, config) {
        const baseKey = request.originalUrl || request.url;
        let cacheKey = `hr:${baseKey}`;
        if (config.includeQuery && Object.keys(request.query || {}).length > 0) {
            const sortedQuery = Object.keys(request.query || {})
                .sort()
                .map((key) => `${key}=${request.query[key]}`)
                .join('&');
            cacheKey += `?${sortedQuery}`;
        }
        if (config.includeUser && request.user?.id) {
            cacheKey += `:user:${request.user.id}`;
        }
        if (config.includeParams && request.params) {
            const sortedParams = Object.keys(request.params)
                .sort()
                .map((key) => `${key}=${request.params[key]}`)
                .join(':');
            cacheKey += `:params:${sortedParams}`;
        }
        return cacheKey;
    }
    determineComplianceLevel(request) {
        const path = request.originalUrl || request.url;
        if (path.includes('/public'))
            return 'PUBLIC';
        if (path.includes('/export') ||
            path.includes('/summary') ||
            path.includes('/search')) {
            return 'SENSITIVE_PHI';
        }
        if (path.includes('/health-record') ||
            path.includes('/allergies') ||
            path.includes('/vaccinations') ||
            path.includes('/conditions') ||
            path.includes('/vitals')) {
            return 'PHI';
        }
        return 'INTERNAL';
    }
    async cacheResponse(cacheKey, data, config, complianceLevel, responseTime) {
        const ttl = this.calculateTTL(config, complianceLevel, data);
        const complianceOptions = this.getComplianceOptions(complianceLevel, data);
        try {
            await this.enterpriseCache.set(cacheKey, data, ttl, {
                compliance: complianceOptions,
                encrypt: complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI',
            });
            this.metricsService.recordCacheMetrics('SET', this.getCacheType(complianceLevel), responseTime);
            this.logCacheSet(cacheKey, complianceLevel, ttl, this.getDataSize(data));
        }
        catch (error) {
            this.logError(`Failed to cache response for key ${cacheKey}`, error, {
                complianceLevel,
                cacheKey: cacheKey.substring(0, 50),
                ttl,
            });
        }
    }
    calculateTTL(config, complianceLevel, data) {
        const baseTTL = config.ttl || 300;
        switch (complianceLevel) {
            case 'SENSITIVE_PHI':
                const sensitiveBase = Math.min(baseTTL, 60);
                return this.isLargeDataset(data)
                    ? Math.min(sensitiveBase, 30)
                    : sensitiveBase;
            case 'PHI':
                return Math.min(baseTTL, 60);
            case 'INTERNAL':
                return Math.min(baseTTL, 600);
            case 'PUBLIC':
                return Math.min(baseTTL, 1800);
            default:
                return Math.min(baseTTL, 300);
        }
    }
    getComplianceOptions(complianceLevel, data) {
        const isPHI = complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI';
        return {
            encrypted: isPHI,
            phiData: isPHI,
            accessLevel: complianceLevel.toLowerCase(),
            recordCount: this.getRecordCount(data),
            dataTypes: this.identifyDataTypes(data),
        };
    }
    getCacheType(complianceLevel) {
        switch (complianceLevel) {
            case 'SENSITIVE_PHI':
            case 'PHI':
                return 'PHI';
            case 'INTERNAL':
                return 'AGGREGATE';
            default:
                return 'SEARCH';
        }
    }
    isLargeDataset(data) {
        if (!data)
            return false;
        if (Array.isArray(data)) {
            return data.length > 100;
        }
        if (data.pagination && data.pagination.total > 100) {
            return true;
        }
        if (data.allergies && data.vaccinations && data.chronicConditions) {
            const totalItems = (data.allergies?.length || 0) +
                (data.vaccinations?.length || 0) +
                (data.chronicConditions?.length || 0);
            return totalItems > 50;
        }
        return false;
    }
    getRecordCount(data) {
        if (!data)
            return 0;
        if (Array.isArray(data)) {
            return data.length;
        }
        if (data.pagination && data.pagination.total) {
            return data.pagination.total;
        }
        if (data.records && Array.isArray(data.records)) {
            return data.records.length;
        }
        let count = 0;
        if (data.allergies)
            count += Array.isArray(data.allergies) ? data.allergies.length : 1;
        if (data.vaccinations)
            count += Array.isArray(data.vaccinations) ? data.vaccinations.length : 1;
        if (data.chronicConditions)
            count += Array.isArray(data.chronicConditions)
                ? data.chronicConditions.length
                : 1;
        if (data.recentVitals)
            count += Array.isArray(data.recentVitals) ? data.recentVitals.length : 1;
        return count > 0 ? count : 1;
    }
    identifyDataTypes(data) {
        const dataTypes = [];
        if (!data)
            return dataTypes;
        if (data.allergies ||
            (Array.isArray(data) && data.some((item) => item.allergen))) {
            dataTypes.push('ALLERGIES');
        }
        if (data.vaccinations ||
            data.recentVaccinations ||
            (Array.isArray(data) && data.some((item) => item.vaccineName))) {
            dataTypes.push('VACCINATIONS');
        }
        if (data.chronicConditions ||
            data.conditions ||
            (Array.isArray(data) && data.some((item) => item.condition))) {
            dataTypes.push('CHRONIC_CONDITIONS');
        }
        if (data.recentVitals ||
            data.vitals ||
            (Array.isArray(data) &&
                data.some((item) => item.temperature || item.bloodPressure))) {
            dataTypes.push('VITAL_SIGNS');
        }
        if (data.recordType ||
            data.diagnosis ||
            data.treatment ||
            (Array.isArray(data) && data.some((item) => item.recordType))) {
            dataTypes.push('HEALTH_RECORDS');
        }
        if (Object.keys(data).length > 3 &&
            (data.student || data.summary || data.recordCounts)) {
            dataTypes.push('COMPREHENSIVE_SUMMARY');
        }
        return dataTypes.length > 0 ? dataTypes : ['GENERAL_PHI'];
    }
    getDataSize(data) {
        if (!data)
            return 0;
        try {
            return JSON.stringify(data).length;
        }
        catch {
            return 0;
        }
    }
    logCacheHit(cacheKey, complianceLevel, responseTime) {
        const isPHI = complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI';
        const logLevel = isPHI ? 'info' : 'debug';
        this.logRequest(logLevel, `Cache HIT: ${cacheKey}`, {
            complianceLevel,
            responseTime,
            cacheKey: cacheKey.substring(0, 50),
            operation: 'CACHE_HIT',
        });
    }
    logCacheSet(cacheKey, complianceLevel, ttl, dataSize) {
        const isPHI = complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI';
        const logLevel = isPHI ? 'info' : 'debug';
        this.logResponse(logLevel, `Cache SET: ${cacheKey}`, {
            complianceLevel,
            ttl,
            dataSize,
            cacheKey: cacheKey.substring(0, 50),
            operation: 'CACHE_SET',
        });
        if (isPHI) {
            this.logRequest('info', `PHI_CACHE: Data cached with ${ttl}s TTL`, {
                cacheKey: cacheKey.substring(0, 50),
                complianceLevel,
                ttl,
                operation: 'PHI_CACHE_SET',
            });
        }
    }
    onModuleDestroy() {
        this.enterpriseCache.stopCleanupInterval();
        this.logRequest('info', 'Health Record Cache Interceptor destroyed', {
            operation: 'MODULE_DESTROY',
        });
    }
};
exports.HealthRecordCacheInterceptor = HealthRecordCacheInterceptor;
exports.HealthRecordCacheInterceptor = HealthRecordCacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        health_record_metrics_service_1.HealthRecordMetricsService])
], HealthRecordCacheInterceptor);
//# sourceMappingURL=health-record-cache.interceptor.js.map