import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SmartGarbageCollectionService } from '@/services/smart-garbage-collection.service';
import { GCOptimizationService } from '@/services/gc-optimization.service';
import { BaseInterceptor } from '../../../common/interceptors/base.interceptor';

interface MemoryPressureConfig {
  maxHeapSize: number; // MB
  gcThreshold: number; // MB
  priority: 'low' | 'normal' | 'high' | 'critical';
  enableAutoGC: boolean;
  memoryMonitoring: boolean;
  failOnPressure: boolean;
}

interface MemoryMetrics {
  heapUsed: number;
  heapTotal: number;
  external: number;
  heapUtilization: number;
  memoryPressureLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Memory Pressure Interceptor
 *
 * Monitors memory usage and applies pressure management
 * using Discovery Service patterns
 */
@Injectable()
export class MemoryPressureInterceptor extends BaseInterceptor implements NestInterceptor {
  private readonly memoryHistory: MemoryMetrics[] = [];
  private readonly maxHistorySize = 100;
  private lastGCTime = 0;
  private readonly gcCooldownMs = 5000; // 5 seconds between GC calls

  constructor(
    private readonly reflector: Reflector,
    private readonly smartGCService: SmartGarbageCollectionService,
    private readonly gcOptimizationService: GCOptimizationService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const handler = context.getHandler();
    const controllerClass = context.getClass();

    // Get memory pressure configuration from metadata
    const methodConfig = this.reflector.get<MemoryPressureConfig>(
      'memory-pressure',
      handler,
    );
    const classConfig = this.reflector.get<MemoryPressureConfig>(
      'memory-pressure',
      controllerClass,
    );

    const config = methodConfig || classConfig;

    if (!config) {
      // No memory pressure monitoring configured, proceed normally
      return next.handle();
    }

    const requestId = this.getOrGenerateRequestId(context.switchToHttp().getRequest());

    try {
      // Check memory pressure before request execution
      const memoryBefore = this.getCurrentMemoryMetrics();
      const pressureLevel = this.calculateMemoryPressure(memoryBefore, config);

      this.logRequest('debug', `Memory pressure check for ${requestId}: ${pressureLevel} (${memoryBefore.heapUtilization.toFixed(1)}%)`, {
        operation: 'MEMORY_PRESSURE_CHECK',
        requestId,
        pressureLevel,
        heapUtilization: memoryBefore.heapUtilization,
      });

      // Handle memory pressure based on configuration
      if (pressureLevel === 'critical' && config.failOnPressure) {
        this.logRequest('error', `Critical memory pressure detected, rejecting request ${requestId}`, {
          operation: 'MEMORY_PRESSURE_REJECTION',
          requestId,
        });
        return throwError(
          () => new Error('Request rejected due to critical memory pressure'),
        );
      }

      // Trigger GC if needed
      if (
        config.enableAutoGC &&
        (pressureLevel === 'high' || pressureLevel === 'critical')
      ) {
        await this.triggerMemoryOptimization(pressureLevel, config);
      }

      // Execute the request with memory monitoring
      return next.handle().pipe(
        tap(() => {
          if (config.memoryMonitoring) {
            this.recordMemoryMetrics(requestId, true);
          }
        }),
        catchError((error) => {
          if (config.memoryMonitoring) {
            this.recordMemoryMetrics(requestId, false);
          }
          return throwError(() => error);
        }),
        tap(() => {
          // Post-request memory check
          const memoryAfter = this.getCurrentMemoryMetrics();
          const pressureAfter = this.calculateMemoryPressure(
            memoryAfter,
            config,
          );

          if (pressureAfter !== pressureLevel) {
            this.logRequest('debug', `Memory pressure changed after request ${requestId}: ${pressureLevel} -> ${pressureAfter}`, {
              operation: 'MEMORY_PRESSURE_CHANGE',
              requestId,
              pressureBefore: pressureLevel,
              pressureAfter,
            });
          }

          // Trigger cleanup if memory increased significantly
          const memoryIncrease = memoryAfter.heapUsed - memoryBefore.heapUsed;
          if (memoryIncrease > 10 * 1024 * 1024 && config.enableAutoGC) {
            // 10MB increase
            this.scheduleCleanup(config);
          }
        }),
      );
    } catch (error) {
      this.logError(`Error in memory pressure interceptor for request ${requestId}`, error, {
        operation: 'MEMORY_PRESSURE_INTERCEPTOR_ERROR',
        requestId,
      });
      return throwError(() => error);
    }
  }

  /**
   * Get current memory metrics
   */
  private getCurrentMemoryMetrics(): MemoryMetrics {
    const memoryUsage = process.memoryUsage();
    const heapUtilization =
      (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    let memoryPressureLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    if (heapUtilization > 90) {
      memoryPressureLevel = 'critical';
    } else if (heapUtilization > 75) {
      memoryPressureLevel = 'high';
    } else if (heapUtilization > 60) {
      memoryPressureLevel = 'medium';
    }

    return {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      external: memoryUsage.external,
      heapUtilization,
      memoryPressureLevel,
    };
  }

  /**
   * Calculate memory pressure level based on configuration
   */
  private calculateMemoryPressure(
    metrics: MemoryMetrics,
    config: MemoryPressureConfig,
  ): 'low' | 'medium' | 'high' | 'critical' {
    const heapUsedMB = metrics.heapUsed / (1024 * 1024);

    // Override based on configuration thresholds
    if (heapUsedMB > config.maxHeapSize) {
      return 'critical';
    } else if (heapUsedMB > config.gcThreshold) {
      return 'high';
    } else if (metrics.heapUtilization > 75) {
      return 'high';
    } else if (metrics.heapUtilization > 60) {
      return 'medium';
    }

    return metrics.memoryPressureLevel;
  }

  /**
   * Trigger memory optimization based on pressure level
   */
  private async triggerMemoryOptimization(
    pressureLevel: 'low' | 'medium' | 'high' | 'critical',
    config: MemoryPressureConfig,
  ): Promise<void> {
    const now = Date.now();

    // Respect GC cooldown period
    if (now - this.lastGCTime < this.gcCooldownMs) {
      this.logRequest('debug', 'GC cooldown period active, skipping memory optimization', {
        operation: 'GC_COOLDOWN',
      });
      return;
    }

    this.lastGCTime = now;

    try {
      switch (pressureLevel) {
        case 'critical':
          this.logRequest('warn', 'Critical memory pressure detected, triggering aggressive cleanup', {
            operation: 'CRITICAL_MEMORY_PRESSURE',
            pressureLevel,
          });
          await this.performAggressiveCleanup(config);
          break;

        case 'high':
          this.logRequest('warn', 'High memory pressure detected, triggering memory optimization', {
            operation: 'HIGH_MEMORY_PRESSURE',
            pressureLevel,
          });
          await this.performStandardCleanup(config);
          break;

        case 'medium':
          this.logRequest('debug', 'Medium memory pressure detected, triggering light cleanup', {
            operation: 'MEDIUM_MEMORY_PRESSURE',
            pressureLevel,
          });
          await this.performLightCleanup(config);
          break;

        default:
          // No action needed for low pressure
          break;
      }
    } catch (error) {
      this.logError('Error during memory optimization', error, {
        operation: 'MEMORY_OPTIMIZATION_ERROR',
        pressureLevel,
      });
    }
  }

  /**
   * Perform aggressive memory cleanup
   */
  private async performAggressiveCleanup(
    config: MemoryPressureConfig,
  ): Promise<void> {
    // Force garbage collection
    if (global.gc) {
      global.gc();
    }

    // Trigger comprehensive GC optimization
    await this.gcOptimizationService.forceOptimization({
      memoryThreshold: config.maxHeapSize * 0.5, // More aggressive threshold
      gcInterval: 1000, // 1 second
      aggressiveThreshold: config.maxHeapSize * 0.7,
      enableHeapProfiling: true,
      customStrategies: new Map(),
    });

    // Clear caches aggressively
    await this.smartGCService.performAggressiveGarbageCollection();
  }

  /**
   * Perform standard memory cleanup
   */
  private async performStandardCleanup(
    config: MemoryPressureConfig,
  ): Promise<void> {
    // Trigger GC optimization
    await this.gcOptimizationService.performOptimization({
      memoryThreshold: config.gcThreshold,
      gcInterval: 5000, // 5 seconds
      aggressiveThreshold: config.maxHeapSize,
      enableHeapProfiling: false,
      customStrategies: new Map(),
    });

    // Clear caches normally
    await this.smartGCService.performSmartGarbageCollection();
  }

  /**
   * Perform light memory cleanup
   */
  private async performLightCleanup(
    config: MemoryPressureConfig,
  ): Promise<void> {
    // Light cleanup only
    await this.smartGCService.performSmartGarbageCollection();
  }

  /**
   * Schedule cleanup for later execution
   */
  private scheduleCleanup(config: MemoryPressureConfig): void {
    // Use setTimeout to avoid blocking the current request
    setTimeout(async () => {
      try {
        await this.performLightCleanup(config);
      } catch (error) {
        this.logError('Error during scheduled cleanup', error, {
          operation: 'SCHEDULED_CLEANUP_ERROR',
        });
      }
    }, 100); // 100ms delay
  }

  /**
   * Record memory metrics for monitoring
   */
  private recordMemoryMetrics(requestId: string, success: boolean): void {
    const metrics = this.getCurrentMemoryMetrics();

    // Add to history
    this.memoryHistory.push({
      ...metrics,
      // Add timestamp and success info (extend interface if needed)
    } as MemoryMetrics);

    // Keep history within limits
    if (this.memoryHistory.length > this.maxHistorySize) {
      this.memoryHistory.shift();
    }

    // Log significant memory changes
    if (this.memoryHistory.length > 1) {
      const previous = this.memoryHistory[this.memoryHistory.length - 2];
      const memoryChange = metrics.heapUsed - previous.heapUsed;
      const changeMB = memoryChange / (1024 * 1024);

      if (Math.abs(changeMB) > 5) {
        // Log changes > 5MB
        this.logRequest('debug', `Memory change for ${requestId}: ${changeMB > 0 ? '+' : ''}${changeMB.toFixed(1)}MB (${success ? 'success' : 'error'})`, {
          operation: 'MEMORY_CHANGE',
          requestId,
          memoryChangeMB: changeMB,
          success,
        });
      }
    }
  }

  /**
   * Get memory pressure statistics
   */
  getMemoryStats(): {
    current: MemoryMetrics;
    trend: 'increasing' | 'decreasing' | 'stable';
    averageUtilization: number;
    peakUtilization: number;
    gcTriggerCount: number;
  } {
    const current = this.getCurrentMemoryMetrics();

    if (this.memoryHistory.length < 2) {
      return {
        current,
        trend: 'stable',
        averageUtilization: current.heapUtilization,
        peakUtilization: current.heapUtilization,
        gcTriggerCount: 0,
      };
    }

    const recent = this.memoryHistory.slice(-10);
    const averageUtilization =
      recent.reduce((sum, m) => sum + m.heapUtilization, 0) / recent.length;
    const peakUtilization = Math.max(...recent.map((m) => m.heapUtilization));

    // Calculate trend
    const firstRecent = recent[0];
    const lastRecent = recent[recent.length - 1];
    const utilizationDiff =
      lastRecent.heapUtilization - firstRecent.heapUtilization;

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (utilizationDiff > 5) {
      trend = 'increasing';
    } else if (utilizationDiff < -5) {
      trend = 'decreasing';
    }

    return {
      current,
      trend,
      averageUtilization,
      peakUtilization,
      gcTriggerCount: 0, // Would need to track this separately
    };
  }

  /**
   * Check if system is under memory pressure
   */
  isUnderMemoryPressure(): boolean {
    const metrics = this.getCurrentMemoryMetrics();
    return (
      metrics.memoryPressureLevel === 'high' ||
      metrics.memoryPressureLevel === 'critical'
    );
  }

  /**
   * Get memory pressure level
   */
  getCurrentMemoryPressure(): 'low' | 'medium' | 'high' | 'critical' {
    const metrics = this.getCurrentMemoryMetrics();
    return metrics.memoryPressureLevel;
  }

  /**
   * Force immediate memory cleanup
   */
  async forceMemoryCleanup(): Promise<void> {
    this.logRequest('log', 'Forcing immediate memory cleanup', {
      operation: 'FORCE_MEMORY_CLEANUP',
    });

    const config: MemoryPressureConfig = {
      maxHeapSize: 1000, // 1GB default
      gcThreshold: 500, // 500MB default
      priority: 'high',
      enableAutoGC: true,
      memoryMonitoring: true,
      failOnPressure: false,
    };

    await this.performAggressiveCleanup(config);
  }

  /**
   * Reset memory monitoring (for testing)
   */
  reset(): void {
    this.memoryHistory.length = 0;
    this.lastGCTime = 0;
    this.logRequest('log', 'Memory pressure interceptor reset', {
      operation: 'MEMORY_INTERCEPTOR_RESET',
    });
  }
}
