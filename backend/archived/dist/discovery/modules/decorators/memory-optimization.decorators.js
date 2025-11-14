"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryOptimizationPresets = exports.PriorityCache = exports.LongRunning = exports.ImmediateCleanup = exports.MemorySensitive = exports.CPUIntensive = exports.DatabaseOptimized = exports.MemoryEfficient = exports.HighPerformance = exports.GCSchedule = exports.ResourceQuota = exports.MemoryPressure = exports.ResourceThrottle = exports.PerformanceTrack = exports.MemoryMonitoring = exports.Cleanup = exports.GarbageCollection = exports.LeakProne = exports.MemoryIntensive = exports.ResourceIntensive = exports.ResourcePool = exports.CachePut = exports.CacheEvict = exports.Cacheable = void 0;
exports.getMemoryOptimizationMetadata = getMemoryOptimizationMetadata;
exports.hasMemoryOptimization = hasMemoryOptimization;
exports.getCleanupMethods = getCleanupMethods;
exports.validateMemoryOptimizationConfig = validateMemoryOptimizationConfig;
const common_1 = require("@nestjs/common");
const Cacheable = (options = { enabled: true }) => (0, common_1.SetMetadata)('cacheable', options);
exports.Cacheable = Cacheable;
const CacheEvict = (keys = []) => (0, common_1.SetMetadata)('cache-evict', { keys });
exports.CacheEvict = CacheEvict;
const CachePut = (key) => (0, common_1.SetMetadata)('cache-put', { key });
exports.CachePut = CachePut;
const ResourcePool = (options) => (0, common_1.SetMetadata)('resource-pool', options);
exports.ResourcePool = ResourcePool;
const ResourceIntensive = (resourceType = 'generic') => (0, common_1.SetMetadata)('resource-intensive', { resourceType });
exports.ResourceIntensive = ResourceIntensive;
const MemoryIntensive = (options = { enabled: true }) => (0, common_1.SetMetadata)('memory-intensive', options);
exports.MemoryIntensive = MemoryIntensive;
const LeakProne = (options = {
    monitoring: true,
}) => (0, common_1.SetMetadata)('leak-prone', options);
exports.LeakProne = LeakProne;
const GarbageCollection = (options = { enabled: true }) => (0, common_1.SetMetadata)('gc-optimization', options);
exports.GarbageCollection = GarbageCollection;
const Cleanup = (priority = 'normal') => (0, common_1.SetMetadata)('cleanup-method', { priority });
exports.Cleanup = Cleanup;
const MemoryMonitoring = (options = { enabled: true }) => (0, common_1.SetMetadata)('memory-monitoring', options);
exports.MemoryMonitoring = MemoryMonitoring;
const PerformanceTrack = (metrics = ['memory', 'cpu', 'time']) => (0, common_1.SetMetadata)('performance-track', { metrics });
exports.PerformanceTrack = PerformanceTrack;
const ResourceThrottle = (options) => (0, common_1.SetMetadata)('resource-throttle', options);
exports.ResourceThrottle = ResourceThrottle;
const MemoryPressure = (options) => (0, common_1.SetMetadata)('memory-pressure', options);
exports.MemoryPressure = MemoryPressure;
const ResourceQuota = (options) => (0, common_1.SetMetadata)('resource-quota', options);
exports.ResourceQuota = ResourceQuota;
const GCSchedule = (options) => (0, common_1.SetMetadata)('gc-scheduler', options);
exports.GCSchedule = GCSchedule;
const HighPerformance = () => (target) => {
    (0, common_1.SetMetadata)('cacheable', {
        enabled: true,
        maxSize: 1000,
        ttl: 300000,
        strategy: 'lru',
        compression: true,
        priority: 10,
        autoEvict: true,
    })(target);
    (0, common_1.SetMetadata)('resource-pool', {
        enabled: true,
        resourceType: 'generic',
        minSize: 5,
        maxSize: 50,
        priority: 10,
        validationEnabled: true,
        autoScale: true,
    })(target);
    (0, common_1.SetMetadata)('memory-intensive', {
        enabled: true,
        threshold: 100,
        priority: 'high',
        cleanupStrategy: 'aggressive',
        monitoring: true,
    })(target);
    (0, common_1.SetMetadata)('gc-optimization', {
        enabled: true,
        priority: 'high',
        strategy: 'aggressive',
        threshold: 200,
        customCleanup: true,
    })(target);
};
exports.HighPerformance = HighPerformance;
const MemoryEfficient = () => (target) => {
    (0, common_1.SetMetadata)('cacheable', {
        enabled: true,
        maxSize: 100,
        ttl: 60000,
        strategy: 'lfu',
        compression: true,
        priority: 5,
        autoEvict: true,
    })(target);
    (0, common_1.SetMetadata)('memory-intensive', {
        enabled: true,
        threshold: 20,
        priority: 'normal',
        cleanupStrategy: 'standard',
        monitoring: true,
    })(target);
    (0, common_1.SetMetadata)('gc-optimization', {
        enabled: true,
        priority: 'normal',
        strategy: 'standard',
        threshold: 50,
        customCleanup: false,
    })(target);
};
exports.MemoryEfficient = MemoryEfficient;
const DatabaseOptimized = () => (target) => {
    (0, common_1.SetMetadata)('resource-pool', {
        enabled: true,
        resourceType: 'connection',
        minSize: 2,
        maxSize: 20,
        priority: 8,
        validationEnabled: true,
        autoScale: true,
    })(target);
    (0, common_1.SetMetadata)('leak-prone', {
        monitoring: true,
        alertThreshold: 50,
    })(target);
    (0, common_1.SetMetadata)('memory-monitoring', {
        enabled: true,
        interval: 30000,
        threshold: 100,
        alerts: true,
    })(target);
};
exports.DatabaseOptimized = DatabaseOptimized;
const CPUIntensive = () => (target) => {
    (0, common_1.SetMetadata)('resource-pool', {
        enabled: true,
        resourceType: 'worker',
        minSize: 1,
        maxSize: 10,
        priority: 9,
        validationEnabled: true,
        autoScale: true,
    })(target);
    (0, common_1.SetMetadata)('memory-intensive', {
        enabled: true,
        threshold: 500,
        priority: 'high',
        cleanupStrategy: 'aggressive',
        monitoring: true,
    })(target);
    (0, common_1.SetMetadata)('performance-track', {
        metrics: ['memory', 'cpu', 'time', 'io'],
    })(target);
};
exports.CPUIntensive = CPUIntensive;
const MemorySensitive = (threshold = 50) => (0, common_1.SetMetadata)('memory-sensitive', { threshold });
exports.MemorySensitive = MemorySensitive;
const ImmediateCleanup = () => (0, common_1.SetMetadata)('immediate-cleanup', { required: true });
exports.ImmediateCleanup = ImmediateCleanup;
const LongRunning = (maxDuration = 300000) => (0, common_1.SetMetadata)('long-running', { maxDuration });
exports.LongRunning = LongRunning;
const PriorityCache = (priority = 10) => (0, common_1.SetMetadata)('priority-cache', { priority });
exports.PriorityCache = PriorityCache;
function getMemoryOptimizationMetadata(target) {
    return {
        cacheable: Reflect.getMetadata('cacheable', target),
        resourcePool: Reflect.getMetadata('resource-pool', target),
        memoryIntensive: Reflect.getMetadata('memory-intensive', target),
        garbageCollection: Reflect.getMetadata('gc-optimization', target),
        memoryMonitoring: Reflect.getMetadata('memory-monitoring', target),
        leakProne: Reflect.getMetadata('leak-prone', target),
    };
}
function hasMemoryOptimization(target) {
    const metadata = getMemoryOptimizationMetadata(target);
    return Object.values(metadata).some((value) => value !== undefined);
}
function getCleanupMethods(target) {
    const prototype = target.prototype || target;
    const methods = [];
    const propertyNames = Object.getOwnPropertyNames(prototype);
    for (const propertyName of propertyNames) {
        const cleanupMetadata = Reflect.getMetadata('cleanup-method', prototype[propertyName]);
        if (cleanupMetadata) {
            methods.push({
                methodName: propertyName,
                priority: cleanupMetadata.priority || 'normal',
            });
        }
    }
    return methods.sort((a, b) => {
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}
function validateMemoryOptimizationConfig(config) {
    const errors = [];
    if (config.cacheable) {
        if (config.cacheable.maxSize && config.cacheable.maxSize < 1) {
            errors.push('Cache maxSize must be greater than 0');
        }
        if (config.cacheable.ttl && config.cacheable.ttl < 1000) {
            errors.push('Cache TTL should be at least 1000ms');
        }
    }
    if (config.resourcePool) {
        if (config.resourcePool.minSize && config.resourcePool.maxSize) {
            if (config.resourcePool.minSize > config.resourcePool.maxSize) {
                errors.push('Resource pool minSize cannot be greater than maxSize');
            }
        }
    }
    if (config.memoryIntensive) {
        if (config.memoryIntensive.threshold &&
            config.memoryIntensive.threshold < 1) {
            errors.push('Memory threshold must be at least 1MB');
        }
    }
    return errors;
}
exports.MemoryOptimizationPresets = {
    MINIMAL: {
        cacheable: {
            enabled: true,
            maxSize: 50,
            ttl: 30000,
            strategy: 'lfu',
        },
        memoryIntensive: { enabled: true, threshold: 10, priority: 'low' },
        gc: {
            enabled: true,
            priority: 'low',
            strategy: 'standard',
        },
    },
    BALANCED: {
        cacheable: {
            enabled: true,
            maxSize: 500,
            ttl: 300000,
            strategy: 'lru',
        },
        resourcePool: {
            enabled: true,
            minSize: 2,
            maxSize: 10,
            resourceType: 'generic',
        },
        memoryIntensive: {
            enabled: true,
            threshold: 100,
            priority: 'normal',
        },
        gc: {
            enabled: true,
            priority: 'normal',
            strategy: 'standard',
        },
    },
    PERFORMANCE: {
        cacheable: {
            enabled: true,
            maxSize: 2000,
            ttl: 600000,
            strategy: 'lru',
            compression: true,
        },
        resourcePool: {
            enabled: true,
            minSize: 5,
            maxSize: 50,
            resourceType: 'generic',
            autoScale: true,
        },
        memoryIntensive: {
            enabled: true,
            threshold: 500,
            priority: 'high',
            monitoring: true,
        },
        gc: {
            enabled: true,
            priority: 'high',
            strategy: 'aggressive',
        },
    },
};
//# sourceMappingURL=memory-optimization.decorators.js.map