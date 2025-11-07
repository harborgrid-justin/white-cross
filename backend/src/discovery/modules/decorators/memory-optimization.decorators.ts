import { SetMetadata } from '@nestjs/common';

/**
 * Custom Decorators for Memory Optimization Modules
 *
 * These decorators provide metadata for Discovery Service integration
 */

// ========================================
// Cache-related Decorators
// ========================================

export interface CacheableOptions {
  enabled: boolean;
  maxSize?: number;
  ttl?: number; // milliseconds
  strategy?: 'lru' | 'lfu' | 'fifo' | 'priority';
  compression?: boolean;
  priority?: number;
  autoEvict?: boolean;
}

/**
 * Mark a class or method as cacheable
 */
export const Cacheable = (options: CacheableOptions = { enabled: true }) =>
  SetMetadata('cacheable', options);

/**
 * Mark a method for cache invalidation
 */
export const CacheEvict = (keys: string[] = []) =>
  SetMetadata('cache-evict', { keys });

/**
 * Mark a method to update cache
 */
export const CachePut = (key: string) => SetMetadata('cache-put', { key });

// ========================================
// Resource Pool Decorators
// ========================================

export interface ResourcePoolOptions {
  enabled: boolean;
  resourceType: 'connection' | 'worker' | 'cache' | 'generic';
  minSize?: number;
  maxSize?: number;
  priority?: number;
  validationEnabled?: boolean;
  autoScale?: boolean;
}

/**
 * Mark a class as requiring resource pooling
 */
export const ResourcePool = (options: ResourcePoolOptions) =>
  SetMetadata('resource-pool', options);

/**
 * Mark a method as resource-intensive
 */
export const ResourceIntensive = (resourceType: string = 'generic') =>
  SetMetadata('resource-intensive', { resourceType });

// ========================================
// Memory Management Decorators
// ========================================

export interface MemoryIntensiveOptions {
  enabled: boolean;
  threshold?: number; // MB
  priority?: 'low' | 'normal' | 'high';
  cleanupStrategy?: 'standard' | 'aggressive' | 'custom';
  monitoring?: boolean;
}

/**
 * Mark a class as memory-intensive
 */
export const MemoryIntensive = (
  options: MemoryIntensiveOptions = { enabled: true },
) => SetMetadata('memory-intensive', options);

/**
 * Mark a class as prone to memory leaks
 */
export const LeakProne = (
  options: { monitoring: boolean; alertThreshold?: number } = {
    monitoring: true,
  },
) => SetMetadata('leak-prone', options);

// ========================================
// Garbage Collection Decorators
// ========================================

export interface GarbageCollectionOptions {
  enabled: boolean;
  priority?: 'low' | 'normal' | 'high';
  strategy?: 'standard' | 'aggressive' | 'custom';
  threshold?: number; // MB
  customCleanup?: boolean;
}

/**
 * Mark a class for garbage collection optimization
 */
export const GarbageCollection = (
  options: GarbageCollectionOptions = { enabled: true },
) => SetMetadata('gc-optimization', options);

/**
 * Mark a method as a cleanup method
 */
export const Cleanup = (priority: 'low' | 'normal' | 'high' = 'normal') =>
  SetMetadata('cleanup-method', { priority });

// ========================================
// Performance Monitoring Decorators
// ========================================

export interface MemoryMonitoringOptions {
  enabled: boolean;
  interval?: number; // milliseconds
  threshold?: number; // MB
  alerts?: boolean;
}

/**
 * Enable memory monitoring for a class
 */
export const MemoryMonitoring = (
  options: MemoryMonitoringOptions = { enabled: true },
) => SetMetadata('memory-monitoring', options);

/**
 * Mark a method for performance tracking
 */
export const PerformanceTrack = (
  metrics: string[] = ['memory', 'cpu', 'time'],
) => SetMetadata('performance-track', { metrics });

// ========================================
// Interceptor Configuration Decorators
// ========================================

export interface ResourceThrottleOptions {
  maxConcurrent: number;
  queueSize: number;
  timeoutMs: number;
  priority: number;
  resourceType: string;
}

/**
 * Configure resource throttling
 */
export const ResourceThrottle = (options: ResourceThrottleOptions) =>
  SetMetadata('resource-throttle', options);

export interface MemoryPressureOptions {
  maxHeapSize: number; // MB
  gcThreshold: number; // MB
  priority: 'low' | 'normal' | 'high' | 'critical';
  enableAutoGC: boolean;
  memoryMonitoring: boolean;
  failOnPressure: boolean;
}

/**
 * Configure memory pressure handling
 */
export const MemoryPressure = (options: MemoryPressureOptions) =>
  SetMetadata('memory-pressure', options);

// ========================================
// Guard Configuration Decorators
// ========================================

export interface ResourceQuotaOptions {
  maxConcurrentRequests: number;
  maxMemoryUsage: number; // MB
  maxCpuUsage: number; // percentage
  timeWindow: number; // milliseconds
  resourceType: string;
  userBased: boolean;
  ipBased: boolean;
  globalLimit: boolean;
}

/**
 * Configure resource quotas
 */
export const ResourceQuota = (options: ResourceQuotaOptions) =>
  SetMetadata('resource-quota', options);

export interface GCScheduleOptions {
  gcTriggerThreshold: number; // MB
  aggressiveGcThreshold: number; // MB
  maxRequestsBeforeGC: number;
  timeBasedGC: boolean;
  gcInterval: number; // milliseconds
  priority: 'low' | 'normal' | 'high' | 'critical';
  leakDetectionEnabled: boolean;
  preventiveGC: boolean;
}

/**
 * Configure GC scheduling
 */
export const GCSchedule = (options: GCScheduleOptions) =>
  SetMetadata('gc-scheduler', options);

// ========================================
// Combined Configuration Decorators
// ========================================

/**
 * High-performance configuration for critical services
 */
export const HighPerformance = () => (target: object) => {
  SetMetadata('cacheable', {
    enabled: true,
    maxSize: 1000,
    ttl: 300000, // 5 minutes
    strategy: 'lru',
    compression: true,
    priority: 10,
    autoEvict: true,
  })(target);

  SetMetadata('resource-pool', {
    enabled: true,
    resourceType: 'generic',
    minSize: 5,
    maxSize: 50,
    priority: 10,
    validationEnabled: true,
    autoScale: true,
  })(target);

  SetMetadata('memory-intensive', {
    enabled: true,
    threshold: 100, // 100MB
    priority: 'high',
    cleanupStrategy: 'aggressive',
    monitoring: true,
  })(target);

  SetMetadata('gc-optimization', {
    enabled: true,
    priority: 'high',
    strategy: 'aggressive',
    threshold: 200, // 200MB
    customCleanup: true,
  })(target);
};

/**
 * Memory-efficient configuration for lightweight services
 */
export const MemoryEfficient = () => (target: object) => {
  SetMetadata('cacheable', {
    enabled: true,
    maxSize: 100,
    ttl: 60000, // 1 minute
    strategy: 'lfu',
    compression: true,
    priority: 5,
    autoEvict: true,
  })(target);

  SetMetadata('memory-intensive', {
    enabled: true,
    threshold: 20, // 20MB
    priority: 'normal',
    cleanupStrategy: 'standard',
    monitoring: true,
  })(target);

  SetMetadata('gc-optimization', {
    enabled: true,
    priority: 'normal',
    strategy: 'standard',
    threshold: 50, // 50MB
    customCleanup: false,
  })(target);
};

/**
 * Database service configuration
 */
export const DatabaseOptimized = () => (target: object) => {
  SetMetadata('resource-pool', {
    enabled: true,
    resourceType: 'connection',
    minSize: 2,
    maxSize: 20,
    priority: 8,
    validationEnabled: true,
    autoScale: true,
  })(target);

  SetMetadata('leak-prone', {
    monitoring: true,
    alertThreshold: 50, // 50MB
  })(target);

  SetMetadata('memory-monitoring', {
    enabled: true,
    interval: 30000, // 30 seconds
    threshold: 100, // 100MB
    alerts: true,
  })(target);
};

/**
 * CPU-intensive service configuration
 */
export const CPUIntensive = () => (target: object) => {
  SetMetadata('resource-pool', {
    enabled: true,
    resourceType: 'worker',
    minSize: 1,
    maxSize: 10,
    priority: 9,
    validationEnabled: true,
    autoScale: true,
  })(target);

  SetMetadata('memory-intensive', {
    enabled: true,
    threshold: 500, // 500MB
    priority: 'high',
    cleanupStrategy: 'aggressive',
    monitoring: true,
  })(target);

  SetMetadata('performance-track', {
    metrics: ['memory', 'cpu', 'time', 'io'],
  })(target);
};

// ========================================
// Method-level Decorators
// ========================================

/**
 * Mark a method as memory-sensitive (requires cleanup after execution)
 */
export const MemorySensitive = (
  threshold: number = 50, // 50MB
) => SetMetadata('memory-sensitive', { threshold });

/**
 * Mark a method as requiring immediate cleanup
 */
export const ImmediateCleanup = () =>
  SetMetadata('immediate-cleanup', { required: true });

/**
 * Mark a method as long-running (may need special GC handling)
 */
export const LongRunning = (
  maxDuration: number = 300000, // 5 minutes
) => SetMetadata('long-running', { maxDuration });

/**
 * Mark a method for priority caching
 */
export const PriorityCache = (priority: number = 10) =>
  SetMetadata('priority-cache', { priority });

// ========================================
// Utility Functions
// ========================================

/**
 * Get memory optimization metadata from a class
 */
export function getMemoryOptimizationMetadata(target: object): {
  cacheable?: CacheableOptions;
  resourcePool?: ResourcePoolOptions;
  memoryIntensive?: MemoryIntensiveOptions;
  garbageCollection?: GarbageCollectionOptions;
  memoryMonitoring?: MemoryMonitoringOptions;
  leakProne?: { monitoring: boolean; alertThreshold?: number };
} {
  return {
    cacheable: Reflect.getMetadata('cacheable', target),
    resourcePool: Reflect.getMetadata('resource-pool', target),
    memoryIntensive: Reflect.getMetadata('memory-intensive', target),
    garbageCollection: Reflect.getMetadata('gc-optimization', target),
    memoryMonitoring: Reflect.getMetadata('memory-monitoring', target),
    leakProne: Reflect.getMetadata('leak-prone', target),
  };
}

/**
 * Check if class has any memory optimization decorators
 */
export function hasMemoryOptimization(target: object): boolean {
  const metadata = getMemoryOptimizationMetadata(target);
  return Object.values(metadata).some((value) => value !== undefined);
}

/**
 * Get all cleanup methods from a class
 */
export function getCleanupMethods(
  target: object,
): Array<{ methodName: string; priority: string }> {
  const prototype = target.prototype || target;
  const methods: Array<{ methodName: string; priority: string }> = [];

  const propertyNames = Object.getOwnPropertyNames(prototype);
  for (const propertyName of propertyNames) {
    const cleanupMetadata = Reflect.getMetadata(
      'cleanup-method',
      prototype[propertyName],
    );
    if (cleanupMetadata) {
      methods.push({
        methodName: propertyName,
        priority: cleanupMetadata.priority || 'normal',
      });
    }
  }

  return methods.sort((a, b) => {
    const priorityOrder: Record<string, number> = { high: 3, normal: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

// ========================================
// Decorator Validation
// ========================================

/**
 * Validate decorator configuration
 */
export function validateMemoryOptimizationConfig(config: {
  cacheable?: Partial<CacheableOptions>;
  resourcePool?: Partial<ResourcePoolOptions>;
  memoryIntensive?: Partial<MemoryIntensiveOptions>;
  [key: string]: unknown;
}): string[] {
  const errors: string[] = [];

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
    if (
      config.memoryIntensive.threshold &&
      config.memoryIntensive.threshold < 1
    ) {
      errors.push('Memory threshold must be at least 1MB');
    }
  }

  return errors;
}

// ========================================
// Configuration Presets
// ========================================

export const MemoryOptimizationPresets = {
  /**
   * Minimal memory footprint configuration
   */
  MINIMAL: {
    cacheable: {
      enabled: true,
      maxSize: 50,
      ttl: 30000,
      strategy: 'lfu' as const,
    },
    memoryIntensive: { enabled: true, threshold: 10, priority: 'low' as const },
    gc: {
      enabled: true,
      priority: 'low' as const,
      strategy: 'standard' as const,
    },
  },

  /**
   * Balanced performance and memory usage
   */
  BALANCED: {
    cacheable: {
      enabled: true,
      maxSize: 500,
      ttl: 300000,
      strategy: 'lru' as const,
    },
    resourcePool: {
      enabled: true,
      minSize: 2,
      maxSize: 10,
      resourceType: 'generic' as const,
    },
    memoryIntensive: {
      enabled: true,
      threshold: 100,
      priority: 'normal' as const,
    },
    gc: {
      enabled: true,
      priority: 'normal' as const,
      strategy: 'standard' as const,
    },
  },

  /**
   * High performance, higher memory usage
   */
  PERFORMANCE: {
    cacheable: {
      enabled: true,
      maxSize: 2000,
      ttl: 600000,
      strategy: 'lru' as const,
      compression: true,
    },
    resourcePool: {
      enabled: true,
      minSize: 5,
      maxSize: 50,
      resourceType: 'generic' as const,
      autoScale: true,
    },
    memoryIntensive: {
      enabled: true,
      threshold: 500,
      priority: 'high' as const,
      monitoring: true,
    },
    gc: {
      enabled: true,
      priority: 'high' as const,
      strategy: 'aggressive' as const,
    },
  },
};
