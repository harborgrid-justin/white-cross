/**
 * LOC: DFFBDE2227
 * WC-GEN-318 | performance.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-318 | performance.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, functions | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Performance monitoring utilities
 * 
 * Provides utilities for measuring execution time, tracking memory usage,
 * and logging performance metrics.
 */

export interface PerformanceMetrics {
  operationName: string;
  duration: number; // in milliseconds
  memoryUsage: MemoryUsage;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
  additionalData?: Record<string, any>;
}

export interface MemoryUsage {
  heapUsed: number; // in bytes
  heapTotal: number; // in bytes
  external: number; // in bytes
  rss: number; // in bytes (Resident Set Size)
  arrayBuffers: number; // in bytes
}

export interface ExecutionResult<T> {
  result: T;
  duration: number;
  memoryUsage: MemoryUsage;
  success: boolean;
  error?: Error;
}

/**
 * Measure execution time of an operation
 * 
 * @param operation - Async operation to measure
 * @param operationName - Name of the operation for logging
 * @returns Promise with result and performance data
 */
export async function measureExecutionTime<T>(
  operation: () => Promise<T>,
  operationName?: string
): Promise<ExecutionResult<T>> {
  const startTime = process.hrtime.bigint();
  const startMemory = process.memoryUsage();
  
  let result: T;
  let success = true;
  let error: Error | undefined;

  try {
    result = await operation();
  } catch (err) {
    success = false;
    error = err instanceof Error ? err : new Error(String(err));
    throw error;
  } finally {
    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage();
    
    const duration = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
    
    const executionResult: ExecutionResult<T> = {
      result: result!,
      duration,
      memoryUsage: {
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        heapTotal: endMemory.heapTotal,
        external: endMemory.external,
        rss: endMemory.rss,
        arrayBuffers: endMemory.arrayBuffers || 0
      },
      success,
      error
    };

    // Log performance metrics if operation name is provided
    if (operationName) {
      logPerformanceMetrics({
        operationName,
        duration,
        memoryUsage: executionResult.memoryUsage,
        timestamp: new Date(),
        success,
        errorMessage: error?.message
      });
    }

    return executionResult;
  }
}

/**
 * Get current memory usage
 * 
 * @returns MemoryUsage object with current memory statistics
 */
export function trackMemoryUsage(): MemoryUsage {
  const usage = process.memoryUsage();
  
  return {
    heapUsed: usage.heapUsed,
    heapTotal: usage.heapTotal,
    external: usage.external,
    rss: usage.rss,
    arrayBuffers: usage.arrayBuffers || 0
  };
}

/**
 * Log performance metrics in structured format
 * 
 * @param metrics - Performance metrics to log
 */
export function logPerformanceMetrics(metrics: PerformanceMetrics): void {
  const logData = {
    type: 'PERFORMANCE_METRIC',
    operation: metrics.operationName,
    duration_ms: Math.round(metrics.duration * 100) / 100, // Round to 2 decimal places
    memory: {
      heap_used_mb: Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024 * 100) / 100,
      heap_total_mb: Math.round(metrics.memoryUsage.heapTotal / 1024 / 1024 * 100) / 100,
      rss_mb: Math.round(metrics.memoryUsage.rss / 1024 / 1024 * 100) / 100
    },
    timestamp: metrics.timestamp.toISOString(),
    success: metrics.success,
    error: metrics.errorMessage,
    additional: metrics.additionalData
  };

  if (metrics.success) {
    console.info('Performance:', JSON.stringify(logData));
  } else {
    console.warn('Performance (Failed):', JSON.stringify(logData));
  }
}

/**
 * Create a performance monitoring decorator for methods
 * 
 * @param operationName - Name of the operation
 * @returns Method decorator
 */
export function performanceMonitor(operationName?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = operationName || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      return measureExecutionTime(
        () => originalMethod.apply(this, args),
        methodName
      ).then(result => result.result);
    };

    return descriptor;
  };
}

/**
 * Monitor database query performance
 * 
 * @param query - Database query function
 * @param queryName - Name of the query for logging
 * @returns Promise with query result and performance data
 */
export async function monitorDatabaseQuery<T>(
  query: () => Promise<T>,
  queryName: string
): Promise<T> {
  const result = await measureExecutionTime(query, `DB_QUERY_${queryName}`);
  
  // Log slow queries (> 1 second)
  if (result.duration > 1000) {
    console.warn(`Slow database query detected: ${queryName} took ${result.duration}ms`);
  }
  
  return result.result;
}

/**
 * Monitor API endpoint performance
 * 
 * @param handler - API handler function
 * @param endpoint - Endpoint name
 * @returns Promise with handler result and performance data
 */
export async function monitorAPIEndpoint<T>(
  handler: () => Promise<T>,
  endpoint: string
): Promise<T> {
  const result = await measureExecutionTime(handler, `API_${endpoint}`);
  
  // Log slow API calls (> 2 seconds)
  if (result.duration > 2000) {
    console.warn(`Slow API endpoint detected: ${endpoint} took ${result.duration}ms`);
  }
  
  return result.result;
}

/**
 * Get system performance statistics
 * 
 * @returns Object with current system performance data
 */
export function getSystemPerformanceStats(): {
  memory: MemoryUsage;
  uptime: number;
  cpuUsage: NodeJS.CpuUsage;
  loadAverage: number[];
} {
  const memory = trackMemoryUsage();
  const uptime = process.uptime();
  const cpuUsage = process.cpuUsage();
  const loadAverage = require('os').loadavg();

  return {
    memory,
    uptime,
    cpuUsage,
    loadAverage
  };
}

/**
 * Monitor memory usage and alert on high usage
 * 
 * @param threshold - Memory threshold in MB (default: 500MB)
 * @returns boolean indicating if memory usage is high
 */
export function checkMemoryThreshold(threshold: number = 500): boolean {
  const usage = trackMemoryUsage();
  const heapUsedMB = usage.heapUsed / 1024 / 1024;
  
  if (heapUsedMB > threshold) {
    console.warn(`High memory usage detected: ${Math.round(heapUsedMB)}MB (threshold: ${threshold}MB)`);
    return true;
  }
  
  return false;
}

/**
 * Create a performance monitoring middleware for Express/Hapi
 * 
 * @param options - Monitoring options
 * @returns Middleware function
 */
export function createPerformanceMiddleware(options: {
  logSlowRequests?: boolean;
  slowRequestThreshold?: number; // in milliseconds
  trackMemory?: boolean;
} = {}) {
  const {
    logSlowRequests = true,
    slowRequestThreshold = 1000,
    trackMemory = true
  } = options;

  return async (request: any, h: any) => {
    const startTime = process.hrtime.bigint();
    const startMemory = trackMemory ? process.memoryUsage() : null;
    
    // Store start time in request context
    request.app.startTime = startTime;
    request.app.startMemory = startMemory;

    // Log completion in response handler
    const originalResponse = h.response;
    h.response = function (result: any) {
      const response = originalResponse.call(this, result);
      
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1_000_000;
      
      if (logSlowRequests && duration > slowRequestThreshold) {
        const method = request.method?.toUpperCase() || 'UNKNOWN';
        const path = request.path || request.url || 'unknown';
        
        console.warn(`Slow request: ${method} ${path} took ${Math.round(duration)}ms`);
        
        if (trackMemory && startMemory) {
          const endMemory = process.memoryUsage();
          const memoryDiff = endMemory.heapUsed - startMemory.heapUsed;
          console.warn(`Memory usage: ${Math.round(memoryDiff / 1024 / 1024 * 100) / 100}MB`);
        }
      }
      
      return response;
    };

    return h.continue;
  };
}