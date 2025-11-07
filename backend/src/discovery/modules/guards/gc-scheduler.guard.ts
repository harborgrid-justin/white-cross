import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SmartGarbageCollectionService } from '../services/smart-garbage-collection.service';
import { GCOptimizationService } from '../services/gc-optimization.service';
import { MemoryLeakDetectionService } from '../services/memory-leak-detection.service';

interface GCScheduleConfig {
  gcTriggerThreshold: number; // MB
  aggressiveGcThreshold: number; // MB
  maxRequestsBeforeGC: number;
  timeBasedGC: boolean;
  gcInterval: number; // milliseconds
  priority: 'low' | 'normal' | 'high' | 'critical';
  leakDetectionEnabled: boolean;
  preventiveGC: boolean;
}

interface GCScheduleState {
  requestCount: number;
  lastGCTime: number;
  lastMemoryCheck: number;
  gcInProgress: boolean;
  scheduledGCCount: number;
  preventedRequests: number;
}

/**
 * GC Scheduler Guard
 *
 * Manages garbage collection scheduling and memory-aware request handling
 * using Discovery Service patterns
 */
@Injectable()
export class GCSchedulerGuard implements CanActivate {
  private readonly logger = new Logger(GCSchedulerGuard.name);
  private readonly gcState: GCScheduleState = {
    requestCount: 0,
    lastGCTime: Date.now(),
    lastMemoryCheck: Date.now(),
    gcInProgress: false,
    scheduledGCCount: 0,
    preventedRequests: 0,
  };
  private gcTimer?: NodeJS.Timeout;
  private memoryCheckTimer?: NodeJS.Timeout;

  constructor(
    private readonly reflector: Reflector,
    private readonly smartGCService: SmartGarbageCollectionService,
    private readonly gcOptimizationService: GCOptimizationService,
    private readonly leakDetectionService: MemoryLeakDetectionService,
  ) {
    // Start periodic memory monitoring
    this.startMemoryMonitoring();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const controllerClass = context.getClass();

    // Get GC schedule configuration from metadata
    const methodGCConfig = this.reflector.get<GCScheduleConfig>(
      'gc-scheduler',
      handler,
    );
    const classGCConfig = this.reflector.get<GCScheduleConfig>(
      'gc-scheduler',
      controllerClass,
    );

    const gcConfig = methodGCConfig || classGCConfig;

    if (!gcConfig) {
      // No GC scheduling configured, allow request
      return true;
    }

    try {
      // Increment request counter
      this.gcState.requestCount++;

      // Check if we should perform GC before allowing the request
      const shouldPerformGC = await this.shouldTriggerGC(gcConfig);

      if (shouldPerformGC) {
        const canProceedDuringGC = await this.handleGCExecution(
          gcConfig,
          context,
        );

        if (!canProceedDuringGC) {
          this.gcState.preventedRequests++;
          this.logger.warn(
            'Request prevented due to active garbage collection',
          );
          return false;
        }
      }

      // Check memory pressure and leak detection
      if (gcConfig.leakDetectionEnabled) {
        const memoryPressureAllowsRequest =
          await this.checkMemoryPressure(gcConfig);
        if (!memoryPressureAllowsRequest) {
          this.gcState.preventedRequests++;
          this.logger.warn('Request prevented due to high memory pressure');
          return false;
        }
      }

      // Schedule preventive GC if needed
      if (gcConfig.preventiveGC) {
        this.schedulePreventiveGC(gcConfig);
      }

      this.logger.debug(
        `GC scheduler check passed, request count: ${this.gcState.requestCount}`,
      );
      return true;
    } catch (error) {
      this.logger.error('Error in GC scheduler guard:', error);
      // On error, allow request but log the issue
      return true;
    }
  }

  /**
   * Check if GC should be triggered
   */
  private async shouldTriggerGC(config: GCScheduleConfig): Promise<boolean> {
    const currentTime = Date.now();
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);

    // Check memory-based triggers
    if (heapUsedMB > config.aggressiveGcThreshold) {
      this.logger.warn(
        `Aggressive GC threshold exceeded: ${heapUsedMB.toFixed(2)}MB > ${config.aggressiveGcThreshold}MB`,
      );
      return true;
    }

    if (heapUsedMB > config.gcTriggerThreshold) {
      this.logger.debug(
        `GC threshold exceeded: ${heapUsedMB.toFixed(2)}MB > ${config.gcTriggerThreshold}MB`,
      );
      return true;
    }

    // Check request count trigger
    if (this.gcState.requestCount >= config.maxRequestsBeforeGC) {
      this.logger.debug(
        `Max requests threshold reached: ${this.gcState.requestCount} >= ${config.maxRequestsBeforeGC}`,
      );
      return true;
    }

    // Check time-based trigger
    if (
      config.timeBasedGC &&
      currentTime - this.gcState.lastGCTime > config.gcInterval
    ) {
      this.logger.debug(
        `Time-based GC interval reached: ${currentTime - this.gcState.lastGCTime}ms >= ${config.gcInterval}ms`,
      );
      return true;
    }

    // Check leak detection triggers
    if (config.leakDetectionEnabled) {
      const leakSuspects = await this.leakDetectionService.getLeakSuspects();
      if (leakSuspects.length > 0) {
        const criticalLeaks = leakSuspects.filter((s) => s.confidence > 0.8);
        if (criticalLeaks.length > 0) {
          this.logger.warn(
            `Critical memory leaks detected: ${criticalLeaks.length} suspects`,
          );
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Handle GC execution and determine if request can proceed
   */
  private async handleGCExecution(
    config: GCScheduleConfig,
    context: ExecutionContext,
  ): Promise<boolean> {
    // If GC is already in progress, decide based on priority
    if (this.gcState.gcInProgress) {
      if (config.priority === 'critical') {
        this.logger.debug('Critical priority request allowed during GC');
        return true;
      } else {
        this.logger.debug(
          `${config.priority} priority request blocked during GC`,
        );
        return false;
      }
    }

    // Start GC execution
    this.gcState.gcInProgress = true;
    this.gcState.scheduledGCCount++;

    try {
      const memoryUsage = process.memoryUsage();
      const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);

      if (heapUsedMB > config.aggressiveGcThreshold) {
        this.logger.warn('Performing aggressive garbage collection');
        await this.performAggressiveGC(config);
      } else {
        this.logger.debug('Performing standard garbage collection');
        await this.performStandardGC(config);
      }

      // Reset counters after successful GC
      this.gcState.requestCount = 0;
      this.gcState.lastGCTime = Date.now();

      // Allow request to proceed after GC
      return true;
    } catch (error) {
      this.logger.error('GC execution failed:', error);
      // Allow request even if GC failed
      return true;
    } finally {
      this.gcState.gcInProgress = false;
    }
  }

  /**
   * Perform aggressive garbage collection
   */
  private async performAggressiveGC(config: GCScheduleConfig): Promise<void> {
    const startTime = Date.now();

    // Use both services for comprehensive cleanup
    await Promise.all([
      this.smartGCService.performAggressiveGarbageCollection(),
      this.gcOptimizationService.forceOptimization({
        memoryThreshold: config.gcTriggerThreshold * 0.5,
        gcInterval: 1000,
        aggressiveThreshold: config.aggressiveGcThreshold,
        enableHeapProfiling: true,
        customStrategies: new Map(),
      }),
    ]);

    const duration = Date.now() - startTime;
    this.logger.warn(`Aggressive GC completed in ${duration}ms`);
  }

  /**
   * Perform standard garbage collection
   */
  private async performStandardGC(config: GCScheduleConfig): Promise<void> {
    const startTime = Date.now();

    // Use both services for standard cleanup
    await Promise.all([
      this.smartGCService.performSmartGarbageCollection(),
      this.gcOptimizationService.performOptimization({
        memoryThreshold: config.gcTriggerThreshold,
        gcInterval: config.gcInterval,
        aggressiveThreshold: config.aggressiveGcThreshold,
        enableHeapProfiling: false,
        customStrategies: new Map(),
      }),
    ]);

    const duration = Date.now() - startTime;
    this.logger.debug(`Standard GC completed in ${duration}ms`);
  }

  /**
   * Check memory pressure and leak conditions
   */
  private async checkMemoryPressure(
    config: GCScheduleConfig,
  ): Promise<boolean> {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);
    const heapUtilization =
      (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    // Critical memory pressure check
    if (heapUsedMB > config.aggressiveGcThreshold * 1.2) {
      // 20% above aggressive threshold
      this.logger.error(`Critical memory pressure: ${heapUsedMB.toFixed(2)}MB`);
      return false;
    }

    // High heap utilization check
    if (heapUtilization > 95) {
      this.logger.warn(
        `Critical heap utilization: ${heapUtilization.toFixed(1)}%`,
      );
      return false;
    }

    // Check for memory leaks if enabled
    if (config.leakDetectionEnabled) {
      const leakSuspects = await this.leakDetectionService.getLeakSuspects();
      const criticalLeaks = leakSuspects.filter((s) => s.confidence > 0.9);

      if (criticalLeaks.length > 3) {
        // More than 3 critical leaks
        this.logger.error(
          `Multiple critical memory leaks detected: ${criticalLeaks.length}`,
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Schedule preventive garbage collection
   */
  private schedulePreventiveGC(config: GCScheduleConfig): void {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);

    // Schedule preventive GC if approaching threshold
    const preventiveThreshold = config.gcTriggerThreshold * 0.8; // 80% of trigger threshold

    if (heapUsedMB > preventiveThreshold && !this.gcTimer) {
      const delay = Math.max(1000, config.gcInterval * 0.1); // 10% of interval, min 1 second

      this.gcTimer = setTimeout(async () => {
        try {
          this.logger.debug('Executing preventive garbage collection');
          await this.performStandardGC(config);
        } catch (error) {
          this.logger.error('Preventive GC failed:', error);
        } finally {
          this.gcTimer = undefined;
        }
      }, delay);

      this.logger.debug(`Scheduled preventive GC in ${delay}ms`);
    }
  }

  /**
   * Start periodic memory monitoring
   */
  private startMemoryMonitoring(): void {
    this.memoryCheckTimer = setInterval(() => {
      this.gcState.lastMemoryCheck = Date.now();

      const memoryUsage = process.memoryUsage();
      const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);

      // Log memory stats periodically
      if (heapUsedMB > 100) {
        // Log if over 100MB
        this.logger.debug(
          `Memory usage: ${heapUsedMB.toFixed(2)}MB, Requests: ${this.gcState.requestCount}, GC runs: ${this.gcState.scheduledGCCount}`,
        );
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Stop monitoring and cleanup
   */
  onModuleDestroy(): void {
    if (this.gcTimer) {
      clearTimeout(this.gcTimer);
    }
    if (this.memoryCheckTimer) {
      clearInterval(this.memoryCheckTimer);
    }
    this.logger.log('GC Scheduler Guard destroyed');
  }

  /**
   * Get GC scheduling statistics
   */
  getGCStats(): {
    state: GCScheduleState;
    memoryUsage: NodeJS.MemoryUsage;
    gcMetrics: any;
    recommendations: string[];
  } {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);
    const recommendations: string[] = [];

    // Generate recommendations
    if (this.gcState.preventedRequests > 10) {
      recommendations.push(
        `High number of prevented requests (${this.gcState.preventedRequests}) - consider adjusting GC thresholds`,
      );
    }

    if (this.gcState.scheduledGCCount > 100) {
      recommendations.push(
        `High GC frequency (${this.gcState.scheduledGCCount} runs) - review memory usage patterns`,
      );
    }

    if (heapUsedMB > 500) {
      recommendations.push(
        `High memory usage (${heapUsedMB.toFixed(2)}MB) - consider more aggressive GC settings`,
      );
    }

    const timeSinceLastGC = Date.now() - this.gcState.lastGCTime;
    if (timeSinceLastGC > 600000) {
      // 10 minutes
      recommendations.push(
        'Long time since last GC - consider enabling time-based GC',
      );
    }

    return {
      state: { ...this.gcState },
      memoryUsage,
      gcMetrics: this.smartGCService.getGcMetrics(),
      recommendations,
    };
  }

  /**
   * Force immediate garbage collection
   */
  async forceGarbageCollection(): Promise<void> {
    if (this.gcState.gcInProgress) {
      this.logger.warn('GC already in progress, skipping forced GC');
      return;
    }

    this.logger.log('Forcing immediate garbage collection');

    const config: GCScheduleConfig = {
      gcTriggerThreshold: 100,
      aggressiveGcThreshold: 500,
      maxRequestsBeforeGC: 1000,
      timeBasedGC: false,
      gcInterval: 300000,
      priority: 'critical',
      leakDetectionEnabled: true,
      preventiveGC: false,
    };

    await this.handleGCExecution(config, null as any);
  }

  /**
   * Reset GC statistics
   */
  resetStats(): void {
    this.gcState.requestCount = 0;
    this.gcState.scheduledGCCount = 0;
    this.gcState.preventedRequests = 0;
    this.gcState.lastGCTime = Date.now();
    this.gcState.lastMemoryCheck = Date.now();
    this.logger.log('GC scheduler statistics reset');
  }

  /**
   * Check if GC is currently in progress
   */
  isGCInProgress(): boolean {
    return this.gcState.gcInProgress;
  }

  /**
   * Get current memory pressure level
   */
  getCurrentMemoryPressure(): 'low' | 'medium' | 'high' | 'critical' {
    const memoryUsage = process.memoryUsage();
    const heapUtilization =
      (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    if (heapUtilization > 95) {
      return 'critical';
    } else if (heapUtilization > 85) {
      return 'high';
    } else if (heapUtilization > 70) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Get GC health status
   */
  getGCHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    uptime: number;
    efficiency: number;
  } {
    const memoryPressure = this.getCurrentMemoryPressure();
    const uptime = Date.now() - this.gcState.lastGCTime;
    const issues: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    // Check for issues
    if (memoryPressure === 'critical') {
      status = 'critical';
      issues.push('Critical memory pressure detected');
    } else if (memoryPressure === 'high') {
      status = status === 'healthy' ? 'warning' : status;
      issues.push('High memory pressure detected');
    }

    if (this.gcState.preventedRequests > 20) {
      status = status === 'healthy' ? 'warning' : status;
      issues.push(
        `High number of prevented requests: ${this.gcState.preventedRequests}`,
      );
    }

    if (uptime > 900000) {
      // 15 minutes
      status = status === 'healthy' ? 'warning' : status;
      issues.push('Long time since last GC execution');
    }

    if (this.gcState.gcInProgress) {
      issues.push('GC currently in progress');
    }

    // Calculate efficiency (simplified)
    const totalRequests =
      this.gcState.requestCount + this.gcState.preventedRequests;
    const efficiency =
      totalRequests > 0
        ? (this.gcState.requestCount / totalRequests) * 100
        : 100;

    return {
      status,
      issues,
      uptime,
      efficiency,
    };
  }
}
