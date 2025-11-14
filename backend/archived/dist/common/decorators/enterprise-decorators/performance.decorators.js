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
exports.EnterprisePerformanceService = exports.PERFORMANCE_METADATA = void 0;
exports.MonitorPerformance = MonitorPerformance;
exports.CircuitBreaker = CircuitBreaker;
exports.RateLimit = RateLimit;
exports.MonitorMemory = MonitorMemory;
const common_1 = require("@nestjs/common");
exports.PERFORMANCE_METADATA = 'enterprise:performance';
let EnterprisePerformanceService = class EnterprisePerformanceService {
    apmClient;
    metrics = [];
    maxMetricsHistory = 1000;
    constructor(apmClient) {
        this.apmClient = apmClient;
    }
    recordMetrics(metrics) {
        this.metrics.push(metrics);
        if (this.metrics.length > this.maxMetricsHistory) {
            this.metrics = this.metrics.slice(-this.maxMetricsHistory);
        }
        if (this.apmClient) {
            this.sendToAPM(metrics);
        }
        if (metrics.executionTime > 1000) {
            console.warn(`Slow operation detected: ${metrics.methodName} took ${metrics.executionTime}ms`);
        }
    }
    getStatistics(timeRange) {
        let filteredMetrics = this.metrics;
        if (timeRange) {
            filteredMetrics = this.metrics.filter(m => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end);
        }
        const totalExecutions = filteredMetrics.length;
        const successfulExecutions = filteredMetrics.filter(m => m.success).length;
        const failedExecutions = totalExecutions - successfulExecutions;
        const executionTimes = filteredMetrics.map(m => m.executionTime);
        const averageExecutionTime = executionTimes.length > 0
            ? executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length
            : 0;
        const sortedTimes = [...executionTimes].sort((a, b) => a - b);
        const p95ExecutionTime = sortedTimes[Math.floor(sortedTimes.length * 0.95)] || 0;
        const p99ExecutionTime = sortedTimes[Math.floor(sortedTimes.length * 0.99)] || 0;
        return {
            totalExecutions,
            successfulExecutions,
            failedExecutions,
            successRate: totalExecutions > 0 ? successfulExecutions / totalExecutions : 0,
            averageExecutionTime,
            p95ExecutionTime,
            p99ExecutionTime,
            timeRange: timeRange || { start: new Date(0), end: new Date() }
        };
    }
    sendToAPM(metrics) {
        try {
            if (this.apmClient && typeof this.apmClient.recordMetric === 'function') {
                this.apmClient.recordMetric('method_execution_time', metrics.executionTime, {
                    method: metrics.methodName,
                    success: metrics.success.toString(),
                    ...metrics.tags
                });
            }
        }
        catch (error) {
            console.warn('Failed to send metrics to APM:', error);
        }
    }
    getSlowOperations(threshold = 1000) {
        return this.metrics.filter(m => m.executionTime > threshold);
    }
};
exports.EnterprisePerformanceService = EnterprisePerformanceService;
exports.EnterprisePerformanceService = EnterprisePerformanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('APM_CLIENT')),
    __metadata("design:paramtypes", [Object])
], EnterprisePerformanceService);
function MonitorPerformance(options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const performanceService = this.performanceService;
            const startTime = Date.now();
            const startMemory = process.memoryUsage();
            let success = false;
            let executionTime = 0;
            try {
                const result = await originalMethod.apply(this, args);
                executionTime = Date.now() - startTime;
                success = true;
                if (options.logSlowOperations && options.slowThreshold && executionTime > options.slowThreshold) {
                    console.warn(`Slow operation: ${methodName} took ${executionTime}ms`);
                }
                return result;
            }
            catch (error) {
                executionTime = Date.now() - startTime;
                throw error;
            }
            finally {
                if (performanceService) {
                    const endMemory = process.memoryUsage();
                    const metrics = {
                        methodName,
                        executionTime,
                        timestamp: new Date(),
                        success,
                        memoryUsage: {
                            rss: endMemory.rss - startMemory.rss,
                            heapUsed: endMemory.heapUsed - startMemory.heapUsed,
                            heapTotal: endMemory.heapTotal - startMemory.heapTotal,
                            external: endMemory.external - startMemory.external,
                            arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers
                        },
                        tags: options.tags
                    };
                    performanceService.recordMetrics(metrics);
                }
            }
        };
        (0, common_1.SetMetadata)(exports.PERFORMANCE_METADATA, options)(target, propertyKey, descriptor);
    };
}
function CircuitBreaker(options) {
    const { failureThreshold = 5, recoveryTimeout = 60000, monitoringPeriod = 60000 } = options;
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        let state = 'CLOSED';
        let failureCount = 0;
        let lastFailureTime = 0;
        let successCount = 0;
        descriptor.value = async function (...args) {
            const now = Date.now();
            if (state === 'OPEN' && now - lastFailureTime > recoveryTimeout) {
                state = 'HALF_OPEN';
                successCount = 0;
            }
            if (state === 'OPEN') {
                throw new Error(`Circuit breaker is OPEN for ${methodName}`);
            }
            try {
                const result = await originalMethod.apply(this, args);
                if (state === 'HALF_OPEN') {
                    successCount++;
                    if (successCount >= 1) {
                        state = 'CLOSED';
                        failureCount = 0;
                    }
                }
                else if (state === 'CLOSED') {
                    failureCount = 0;
                }
                return result;
            }
            catch (error) {
                failureCount++;
                lastFailureTime = now;
                if (failureCount >= failureThreshold) {
                    state = 'OPEN';
                }
                throw error;
            }
        };
        (0, common_1.SetMetadata)('enterprise:circuit-breaker', options)(target, propertyKey, descriptor);
    };
}
function RateLimit(options) {
    const { windowMs = 60000, maxRequests = 100, keyGenerator = () => 'default' } = options;
    const requestCounts = new Map();
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const key = keyGenerator(this);
            const now = Date.now();
            let record = requestCounts.get(key);
            if (!record || now > record.resetTime) {
                record = { count: 0, resetTime: now + windowMs };
                requestCounts.set(key, record);
            }
            if (record.count >= maxRequests) {
                throw new Error(`Rate limit exceeded for ${methodName}. Try again in ${Math.ceil((record.resetTime - now) / 1000)} seconds.`);
            }
            record.count++;
            return await originalMethod.apply(this, args);
        };
        (0, common_1.SetMetadata)('enterprise:rate-limit', options)(target, propertyKey, descriptor);
    };
}
function MonitorMemory(options) {
    const { logThreshold = 100, alertThreshold = 500 } = options;
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const startMemory = process.memoryUsage();
            try {
                const result = await originalMethod.apply(this, args);
                return result;
            }
            finally {
                const endMemory = process.memoryUsage();
                const memoryIncrease = (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024;
                if (memoryIncrease > alertThreshold) {
                    console.error(`High memory usage in ${methodName}: ${memoryIncrease.toFixed(2)}MB increase`);
                }
                else if (memoryIncrease > logThreshold) {
                    console.warn(`Memory usage in ${methodName}: ${memoryIncrease.toFixed(2)}MB increase`);
                }
            }
        };
        (0, common_1.SetMetadata)('enterprise:memory-monitor', options)(target, propertyKey, descriptor);
    };
}
//# sourceMappingURL=performance.decorators.js.map