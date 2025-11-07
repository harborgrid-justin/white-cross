import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DynamicResourcePoolService } from '../services/dynamic-resource-pool.service';
import { AuthenticatedRequest } from '../types/resource.types';

interface ResourceQuotaConfig {
  maxConcurrentRequests: number;
  maxMemoryUsage: number; // MB
  maxCpuUsage: number; // percentage
  timeWindow: number; // milliseconds
  resourceType: string;
  userBased: boolean;
  ipBased: boolean;
  globalLimit: boolean;
}

interface QuotaUsage {
  requests: number;
  memoryUsed: number;
  cpuUsed: number;
  lastReset: number;
  violations: number;
}

/**
 * Resource Quota Guard
 *
 * Enforces resource quotas and limits using Discovery Service patterns
 */
@Injectable()
export class ResourceQuotaGuard implements CanActivate {
  private readonly logger = new Logger(ResourceQuotaGuard.name);
  private readonly quotaUsage = new Map<string, QuotaUsage>();
  private readonly globalQuota: QuotaUsage = {
    requests: 0,
    memoryUsed: 0,
    cpuUsed: 0,
    lastReset: Date.now(),
    violations: 0,
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly resourcePoolService: DynamicResourcePoolService,
  ) {
    // Reset quotas periodically
    setInterval(() => {
      this.resetExpiredQuotas();
    }, 60000); // Every minute
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const controllerClass = context.getClass();

    // Get quota configuration from metadata
    const methodQuotaConfig = this.reflector.get<ResourceQuotaConfig>(
      'resource-quota',
      handler,
    );
    const classQuotaConfig = this.reflector.get<ResourceQuotaConfig>(
      'resource-quota',
      controllerClass,
    );

    const quotaConfig = methodQuotaConfig || classQuotaConfig;

    if (!quotaConfig) {
      // No quota configured, allow request
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const quotaKey = this.generateQuotaKey(request, quotaConfig);

    try {
      // Check if request can proceed based on quotas
      const canProceed = await this.checkResourceQuota(
        quotaKey,
        quotaConfig,
        request,
      );

      if (canProceed) {
        // Track resource usage
        this.trackResourceUsage(quotaKey, quotaConfig);

        this.logger.debug(`Resource quota check passed for ${quotaKey}`);
        return true;
      } else {
        // Log quota violation
        this.recordQuotaViolation(quotaKey, quotaConfig);

        this.logger.warn(`Resource quota exceeded for ${quotaKey}`, {
          resourceType: quotaConfig.resourceType,
          maxRequests: quotaConfig.maxConcurrentRequests,
          maxMemory: quotaConfig.maxMemoryUsage,
          maxCpu: quotaConfig.maxCpuUsage,
        });

        return false;
      }
    } catch (error) {
      this.logger.error(
        `Error checking resource quota for ${quotaKey}:`,
        error,
      );
      // On error, allow request but log the issue
      return true;
    }
  }

  /**
   * Generate quota key based on configuration
   */
  private generateQuotaKey(
    request: Partial<AuthenticatedRequest>,
    config: ResourceQuotaConfig,
  ): string {
    const parts: string[] = [];

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

  /**
   * Check if request can proceed based on resource quotas
   */
  private async checkResourceQuota(
    quotaKey: string,
    config: ResourceQuotaConfig,
    request: Partial<AuthenticatedRequest>,
  ): Promise<boolean> {
    const currentUsage = this.getOrCreateQuotaUsage(quotaKey, config);
    const currentTime = Date.now();

    // Reset quota if time window has passed
    if (currentTime - currentUsage.lastReset > config.timeWindow) {
      this.resetQuotaUsage(quotaKey);
      currentUsage.lastReset = currentTime;
    }

    // Check concurrent requests limit
    if (currentUsage.requests >= config.maxConcurrentRequests) {
      this.logger.debug(
        `Concurrent requests limit exceeded: ${currentUsage.requests}/${config.maxConcurrentRequests}`,
      );
      return false;
    }

    // Check memory usage limit
    const currentMemoryMB = process.memoryUsage().heapUsed / (1024 * 1024);
    if (config.maxMemoryUsage > 0 && currentMemoryMB > config.maxMemoryUsage) {
      this.logger.debug(
        `Memory usage limit exceeded: ${currentMemoryMB.toFixed(2)}MB/${config.maxMemoryUsage}MB`,
      );
      return false;
    }

    // Check CPU usage limit (simplified check)
    const cpuUsage = await this.getCurrentCpuUsage();
    if (config.maxCpuUsage > 0 && cpuUsage > config.maxCpuUsage) {
      this.logger.debug(
        `CPU usage limit exceeded: ${cpuUsage.toFixed(2)}%/${config.maxCpuUsage}%`,
      );
      return false;
    }

    // Check resource pool availability
    if (config.resourceType) {
      const poolStats = this.resourcePoolService.getPoolStatsByName(
        config.resourceType,
      );
      if (poolStats && poolStats.poolUtilization > 0.9) {
        // 90% utilization
        this.logger.debug(
          `Resource pool utilization too high: ${(poolStats.poolUtilization * 100).toFixed(1)}%`,
        );
        return false;
      }
    }

    // Check global limits if configured
    if (config.globalLimit) {
      const globalUsage = this.globalQuota;
      if (currentTime - globalUsage.lastReset > config.timeWindow) {
        this.resetGlobalQuota();
        globalUsage.lastReset = currentTime;
      }

      if (globalUsage.requests >= config.maxConcurrentRequests) {
        this.logger.debug(
          `Global concurrent requests limit exceeded: ${globalUsage.requests}/${config.maxConcurrentRequests}`,
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Track resource usage after successful quota check
   */
  private trackResourceUsage(
    quotaKey: string,
    config: ResourceQuotaConfig,
  ): void {
    const usage = this.getOrCreateQuotaUsage(quotaKey, config);

    // Increment request count
    usage.requests++;

    // Track memory usage
    usage.memoryUsed = process.memoryUsage().heapUsed / (1024 * 1024);

    // Track global usage if configured
    if (config.globalLimit) {
      this.globalQuota.requests++;
      this.globalQuota.memoryUsed = usage.memoryUsed;
    }

    this.logger.debug(
      `Tracking resource usage for ${quotaKey}: ${usage.requests} requests, ${usage.memoryUsed.toFixed(2)}MB memory`,
    );
  }

  /**
   * Record quota violation
   */
  private recordQuotaViolation(
    quotaKey: string,
    config: ResourceQuotaConfig,
  ): void {
    const usage = this.getOrCreateQuotaUsage(quotaKey, config);
    usage.violations++;

    // Track global violations if configured
    if (config.globalLimit) {
      this.globalQuota.violations++;
    }

    // Log violation details
    this.logger.warn(`Quota violation recorded for ${quotaKey}`, {
      totalViolations: usage.violations,
      currentRequests: usage.requests,
      maxRequests: config.maxConcurrentRequests,
      memoryUsed: usage.memoryUsed,
      maxMemory: config.maxMemoryUsage,
    });
  }

  /**
   * Get or create quota usage tracking
   */
  private getOrCreateQuotaUsage(
    quotaKey: string,
    config: ResourceQuotaConfig,
  ): QuotaUsage {
    if (!this.quotaUsage.has(quotaKey)) {
      this.quotaUsage.set(quotaKey, {
        requests: 0,
        memoryUsed: 0,
        cpuUsed: 0,
        lastReset: Date.now(),
        violations: 0,
      });
    }

    return this.quotaUsage.get(quotaKey)!;
  }

  /**
   * Reset quota usage for a specific key
   */
  private resetQuotaUsage(quotaKey: string): void {
    const usage = this.quotaUsage.get(quotaKey);
    if (usage) {
      usage.requests = 0;
      usage.memoryUsed = 0;
      usage.cpuUsed = 0;
      usage.lastReset = Date.now();
      // Don't reset violations - they accumulate
    }
  }

  /**
   * Reset global quota
   */
  private resetGlobalQuota(): void {
    this.globalQuota.requests = 0;
    this.globalQuota.memoryUsed = 0;
    this.globalQuota.cpuUsed = 0;
    this.globalQuota.lastReset = Date.now();
    // Don't reset violations - they accumulate
  }

  /**
   * Reset expired quotas
   */
  private resetExpiredQuotas(): void {
    const currentTime = Date.now();
    const defaultTimeWindow = 300000; // 5 minutes

    for (const [key, usage] of this.quotaUsage.entries()) {
      // Use default time window if we don't have config context
      if (currentTime - usage.lastReset > defaultTimeWindow) {
        this.resetQuotaUsage(key);
        this.logger.debug(`Reset expired quota for ${key}`);
      }
    }

    // Reset global quota if expired
    if (currentTime - this.globalQuota.lastReset > defaultTimeWindow) {
      this.resetGlobalQuota();
      this.logger.debug('Reset expired global quota');
    }
  }

  /**
   * Get current CPU usage (simplified implementation)
   */
  private async getCurrentCpuUsage(): Promise<number> {
    // This is a simplified CPU usage calculation
    // In a real implementation, you might use more sophisticated monitoring
    const usage = process.cpuUsage();
    const totalUsage = usage.user + usage.system;

    // Convert to percentage (this is a rough approximation)
    // You would typically compare against a baseline or use external monitoring
    return Math.min(100, totalUsage / 1000000); // Convert microseconds to rough percentage
  }

  /**
   * Release resource quota (call this when request completes)
   */
  releaseQuota(quotaKey: string): void {
    const usage = this.quotaUsage.get(quotaKey);
    if (usage && usage.requests > 0) {
      usage.requests--;
      this.logger.debug(
        `Released quota for ${quotaKey}: ${usage.requests} requests remaining`,
      );
    }

    // Release global quota
    if (this.globalQuota.requests > 0) {
      this.globalQuota.requests--;
    }
  }

  /**
   * Get quota statistics
   */
  getQuotaStats(): {
    totalQuotaKeys: number;
    globalUsage: QuotaUsage;
    topViolators: Array<{ key: string; violations: number; requests: number }>;
    memoryPressure: number;
    cpuPressure: number;
  } {
    const topViolators = Array.from(this.quotaUsage.entries())
      .map(([key, usage]) => ({
        key,
        violations: usage.violations,
        requests: usage.requests,
      }))
      .sort((a, b) => b.violations - a.violations)
      .slice(0, 10);

    const memoryUsageMB = process.memoryUsage().heapUsed / (1024 * 1024);
    const memoryPressure = Math.min(100, memoryUsageMB / 10); // Rough calculation

    return {
      totalQuotaKeys: this.quotaUsage.size,
      globalUsage: { ...this.globalQuota },
      topViolators,
      memoryPressure,
      cpuPressure: 0, // Would need proper CPU monitoring
    };
  }

  /**
   * Get quota usage for a specific key
   */
  getQuotaUsage(quotaKey: string): QuotaUsage | null {
    return this.quotaUsage.get(quotaKey) || null;
  }

  /**
   * Clear all quota data (for testing/reset)
   */
  clearAllQuotas(): void {
    this.quotaUsage.clear();
    this.resetGlobalQuota();
    this.logger.log('All quota data cleared');
  }

  /**
   * Set custom quota limits (for dynamic adjustment)
   */
  setQuotaLimits(quotaKey: string, limits: Partial<ResourceQuotaConfig>): void {
    // This would require storing config per key, which could be added as enhancement
    this.logger.log(`Custom quota limits would be set for ${quotaKey}`, limits);
  }

  /**
   * Check if quota key is currently over limit
   */
  isOverLimit(quotaKey: string, config: ResourceQuotaConfig): boolean {
    const usage = this.quotaUsage.get(quotaKey);
    if (!usage) return false;

    return (
      usage.requests >= config.maxConcurrentRequests ||
      usage.memoryUsed > config.maxMemoryUsage ||
      usage.cpuUsed > config.maxCpuUsage
    );
  }

  /**
   * Get quota health report
   */
  getQuotaHealthReport(): {
    status: 'healthy' | 'warning' | 'critical';
    totalViolations: number;
    activeQuotas: number;
    recommendations: string[];
  } {
    const totalViolations =
      Array.from(this.quotaUsage.values()).reduce(
        (sum, usage) => sum + usage.violations,
        0,
      ) + this.globalQuota.violations;

    const activeQuotas = Array.from(this.quotaUsage.values()).filter(
      (usage) => usage.requests > 0,
    ).length;

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    const recommendations: string[] = [];

    if (totalViolations > 100) {
      status = 'critical';
      recommendations.push(
        'High number of quota violations detected - review quota limits',
      );
    } else if (totalViolations > 20) {
      status = 'warning';
      recommendations.push(
        'Moderate quota violations - consider adjusting limits',
      );
    }

    if (activeQuotas > 1000) {
      status = status === 'healthy' ? 'warning' : status;
      recommendations.push(
        'High number of active quotas - consider quota key optimization',
      );
    }

    const memoryUsageMB = process.memoryUsage().heapUsed / (1024 * 1024);
    if (memoryUsageMB > 500) {
      // 500MB
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
}
