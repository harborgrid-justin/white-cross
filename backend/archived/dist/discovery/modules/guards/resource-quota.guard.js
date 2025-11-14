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
var ResourceQuotaGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceQuotaGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const dynamic_resource_pool_service_1 = require("../services/dynamic-resource-pool.service");
let ResourceQuotaGuard = ResourceQuotaGuard_1 = class ResourceQuotaGuard {
    reflector;
    resourcePoolService;
    logger = new common_1.Logger(ResourceQuotaGuard_1.name);
    quotaUsage = new Map();
    globalQuota = {
        requests: 0,
        memoryUsed: 0,
        cpuUsed: 0,
        lastReset: Date.now(),
        violations: 0,
    };
    constructor(reflector, resourcePoolService) {
        this.reflector = reflector;
        this.resourcePoolService = resourcePoolService;
        setInterval(() => {
            this.resetExpiredQuotas();
        }, 60000);
    }
    async canActivate(context) {
        const handler = context.getHandler();
        const controllerClass = context.getClass();
        const methodQuotaConfig = this.reflector.get('resource-quota', handler);
        const classQuotaConfig = this.reflector.get('resource-quota', controllerClass);
        const quotaConfig = methodQuotaConfig || classQuotaConfig;
        if (!quotaConfig) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const quotaKey = this.generateQuotaKey(request, quotaConfig);
        try {
            const canProceed = await this.checkResourceQuota(quotaKey, quotaConfig, request);
            if (canProceed) {
                this.trackResourceUsage(quotaKey, quotaConfig);
                this.logger.debug(`Resource quota check passed for ${quotaKey}`);
                return true;
            }
            else {
                this.recordQuotaViolation(quotaKey, quotaConfig);
                this.logger.warn(`Resource quota exceeded for ${quotaKey}`, {
                    resourceType: quotaConfig.resourceType,
                    maxRequests: quotaConfig.maxConcurrentRequests,
                    maxMemory: quotaConfig.maxMemoryUsage,
                    maxCpu: quotaConfig.maxCpuUsage,
                });
                return false;
            }
        }
        catch (error) {
            this.logger.error(`Error checking resource quota for ${quotaKey}:`, error);
            return true;
        }
    }
    generateQuotaKey(request, config) {
        const parts = [];
        if (config.globalLimit) {
            parts.push('global');
        }
        if (config.userBased && request.user?.id) {
            parts.push(`user:${request.user.id}`);
        }
        if (config.ipBased && request.ip) {
            parts.push(`ip:${request.ip}`);
        }
        if (config.resourceType) {
            parts.push(`resource:${config.resourceType}`);
        }
        return parts.length > 0 ? parts.join('_') : 'default';
    }
    async checkResourceQuota(quotaKey, config, request) {
        const currentUsage = this.getOrCreateQuotaUsage(quotaKey, config);
        const currentTime = Date.now();
        if (currentTime - currentUsage.lastReset > config.timeWindow) {
            this.resetQuotaUsage(quotaKey);
            currentUsage.lastReset = currentTime;
        }
        if (currentUsage.requests >= config.maxConcurrentRequests) {
            this.logger.debug(`Concurrent requests limit exceeded: ${currentUsage.requests}/${config.maxConcurrentRequests}`);
            return false;
        }
        const currentMemoryMB = process.memoryUsage().heapUsed / (1024 * 1024);
        if (config.maxMemoryUsage > 0 && currentMemoryMB > config.maxMemoryUsage) {
            this.logger.debug(`Memory usage limit exceeded: ${currentMemoryMB.toFixed(2)}MB/${config.maxMemoryUsage}MB`);
            return false;
        }
        const cpuUsage = await this.getCurrentCpuUsage();
        if (config.maxCpuUsage > 0 && cpuUsage > config.maxCpuUsage) {
            this.logger.debug(`CPU usage limit exceeded: ${cpuUsage.toFixed(2)}%/${config.maxCpuUsage}%`);
            return false;
        }
        if (config.resourceType) {
            const poolStats = this.resourcePoolService.getPoolStatsByName(config.resourceType);
            if (poolStats && poolStats.poolUtilization > 0.9) {
                this.logger.debug(`Resource pool utilization too high: ${(poolStats.poolUtilization * 100).toFixed(1)}%`);
                return false;
            }
        }
        if (config.globalLimit) {
            const globalUsage = this.globalQuota;
            if (currentTime - globalUsage.lastReset > config.timeWindow) {
                this.resetGlobalQuota();
                globalUsage.lastReset = currentTime;
            }
            if (globalUsage.requests >= config.maxConcurrentRequests) {
                this.logger.debug(`Global concurrent requests limit exceeded: ${globalUsage.requests}/${config.maxConcurrentRequests}`);
                return false;
            }
        }
        return true;
    }
    trackResourceUsage(quotaKey, config) {
        const usage = this.getOrCreateQuotaUsage(quotaKey, config);
        usage.requests++;
        usage.memoryUsed = process.memoryUsage().heapUsed / (1024 * 1024);
        if (config.globalLimit) {
            this.globalQuota.requests++;
            this.globalQuota.memoryUsed = usage.memoryUsed;
        }
        this.logger.debug(`Tracking resource usage for ${quotaKey}: ${usage.requests} requests, ${usage.memoryUsed.toFixed(2)}MB memory`);
    }
    recordQuotaViolation(quotaKey, config) {
        const usage = this.getOrCreateQuotaUsage(quotaKey, config);
        usage.violations++;
        if (config.globalLimit) {
            this.globalQuota.violations++;
        }
        this.logger.warn(`Quota violation recorded for ${quotaKey}`, {
            totalViolations: usage.violations,
            currentRequests: usage.requests,
            maxRequests: config.maxConcurrentRequests,
            memoryUsed: usage.memoryUsed,
            maxMemory: config.maxMemoryUsage,
        });
    }
    getOrCreateQuotaUsage(quotaKey, config) {
        if (!this.quotaUsage.has(quotaKey)) {
            this.quotaUsage.set(quotaKey, {
                requests: 0,
                memoryUsed: 0,
                cpuUsed: 0,
                lastReset: Date.now(),
                violations: 0,
            });
        }
        return this.quotaUsage.get(quotaKey);
    }
    resetQuotaUsage(quotaKey) {
        const usage = this.quotaUsage.get(quotaKey);
        if (usage) {
            usage.requests = 0;
            usage.memoryUsed = 0;
            usage.cpuUsed = 0;
            usage.lastReset = Date.now();
        }
    }
    resetGlobalQuota() {
        this.globalQuota.requests = 0;
        this.globalQuota.memoryUsed = 0;
        this.globalQuota.cpuUsed = 0;
        this.globalQuota.lastReset = Date.now();
    }
    resetExpiredQuotas() {
        const currentTime = Date.now();
        const defaultTimeWindow = 300000;
        for (const [key, usage] of this.quotaUsage.entries()) {
            if (currentTime - usage.lastReset > defaultTimeWindow) {
                this.resetQuotaUsage(key);
                this.logger.debug(`Reset expired quota for ${key}`);
            }
        }
        if (currentTime - this.globalQuota.lastReset > defaultTimeWindow) {
            this.resetGlobalQuota();
            this.logger.debug('Reset expired global quota');
        }
    }
    async getCurrentCpuUsage() {
        const usage = process.cpuUsage();
        const totalUsage = usage.user + usage.system;
        return Math.min(100, totalUsage / 1000000);
    }
    releaseQuota(quotaKey) {
        const usage = this.quotaUsage.get(quotaKey);
        if (usage && usage.requests > 0) {
            usage.requests--;
            this.logger.debug(`Released quota for ${quotaKey}: ${usage.requests} requests remaining`);
        }
        if (this.globalQuota.requests > 0) {
            this.globalQuota.requests--;
        }
    }
    getQuotaStats() {
        const topViolators = Array.from(this.quotaUsage.entries())
            .map(([key, usage]) => ({
            key,
            violations: usage.violations,
            requests: usage.requests,
        }))
            .sort((a, b) => b.violations - a.violations)
            .slice(0, 10);
        const memoryUsageMB = process.memoryUsage().heapUsed / (1024 * 1024);
        const memoryPressure = Math.min(100, memoryUsageMB / 10);
        return {
            totalQuotaKeys: this.quotaUsage.size,
            globalUsage: { ...this.globalQuota },
            topViolators,
            memoryPressure,
            cpuPressure: 0,
        };
    }
    getQuotaUsage(quotaKey) {
        return this.quotaUsage.get(quotaKey) || null;
    }
    clearAllQuotas() {
        this.quotaUsage.clear();
        this.resetGlobalQuota();
        this.logger.log('All quota data cleared');
    }
    setQuotaLimits(quotaKey, limits) {
        this.logger.log(`Custom quota limits would be set for ${quotaKey}`, limits);
    }
    isOverLimit(quotaKey, config) {
        const usage = this.quotaUsage.get(quotaKey);
        if (!usage)
            return false;
        return (usage.requests >= config.maxConcurrentRequests ||
            usage.memoryUsed > config.maxMemoryUsage ||
            usage.cpuUsed > config.maxCpuUsage);
    }
    getQuotaHealthReport() {
        const totalViolations = Array.from(this.quotaUsage.values()).reduce((sum, usage) => sum + usage.violations, 0) + this.globalQuota.violations;
        const activeQuotas = Array.from(this.quotaUsage.values()).filter((usage) => usage.requests > 0).length;
        let status = 'healthy';
        const recommendations = [];
        if (totalViolations > 100) {
            status = 'critical';
            recommendations.push('High number of quota violations detected - review quota limits');
        }
        else if (totalViolations > 20) {
            status = 'warning';
            recommendations.push('Moderate quota violations - consider adjusting limits');
        }
        if (activeQuotas > 1000) {
            status = status === 'healthy' ? 'warning' : status;
            recommendations.push('High number of active quotas - consider quota key optimization');
        }
        const memoryUsageMB = process.memoryUsage().heapUsed / (1024 * 1024);
        if (memoryUsageMB > 500) {
            status = status === 'healthy' ? 'warning' : status;
            recommendations.push('High memory usage detected - review memory quotas');
        }
        return {
            status,
            totalViolations,
            activeQuotas,
            recommendations,
        };
    }
};
exports.ResourceQuotaGuard = ResourceQuotaGuard;
exports.ResourceQuotaGuard = ResourceQuotaGuard = ResourceQuotaGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        dynamic_resource_pool_service_1.DynamicResourcePoolService])
], ResourceQuotaGuard);
//# sourceMappingURL=resource-quota.guard.js.map