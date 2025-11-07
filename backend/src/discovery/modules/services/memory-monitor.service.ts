import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';

export interface MemoryMonitorOptions {
  checkInterval: number; // seconds
  warningThreshold: number; // MB
  criticalThreshold: number; // MB
  alertCallback?: (level: 'warning' | 'critical', usage: number) => void;
}

export interface MonitoredProvider {
  name: string;
  maxMemory?: number;
  alertThreshold?: number;
  trackAllocations?: boolean;
}

/**
 * Memory Monitor Service
 *
 * Uses Discovery Service to monitor memory usage of discovered providers
 * and trigger alerts when thresholds are exceeded
 */
@Injectable()
export class MemoryMonitorService {
  private readonly logger = new Logger(MemoryMonitorService.name);
  private monitoringInterval?: NodeJS.Timeout;
  private monitoredProviders = new Map<string, MonitoredProvider>();
  private memoryHistory: number[] = [];
  private readonly maxHistorySize = 100;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Start monitoring memory usage
   */
  startMonitoring(
    options: MemoryMonitorOptions = {
      checkInterval: 30,
      warningThreshold: 400,
      criticalThreshold: 500,
    },
  ): void {
    if (this.monitoringInterval) {
      this.logger.warn('Memory monitoring already started');
      return;
    }

    this.logger.log('Starting memory monitoring', {
      interval: options.checkInterval,
      warningThreshold: options.warningThreshold,
      criticalThreshold: options.criticalThreshold,
    });

    this.monitoringInterval = setInterval(async () => {
      await this.checkMemoryUsage(options);
    }, options.checkInterval * 1000);
  }

  /**
   * Stop monitoring memory usage
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
      this.logger.log('Memory monitoring stopped');
    }
  }

  /**
   * Add a provider to monitor based on Discovery Service metadata
   */
  addMonitoredProvider(providerName: string, options: MonitoredProvider): void {
    this.monitoredProviders.set(providerName, options);
    this.logger.log(`Added monitored provider: ${providerName}`, options);
  }

  /**
   * Get current memory statistics
   */
  getMemoryStats(): {
    current: NodeJS.MemoryUsage;
    trend: 'increasing' | 'decreasing' | 'stable';
    averageUsage: number;
    peakUsage: number;
    providerAlerts: string[];
  } {
    const current = process.memoryUsage();
    const currentMB = current.heapUsed / 1024 / 1024;

    // Calculate trend
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (this.memoryHistory.length >= 5) {
      const recent = this.memoryHistory.slice(-5);
      const average = recent.reduce((a, b) => a + b, 0) / recent.length;
      if (currentMB > average * 1.1) trend = 'increasing';
      else if (currentMB < average * 0.9) trend = 'decreasing';
    }

    // Calculate statistics
    const averageUsage =
      this.memoryHistory.length > 0
        ? this.memoryHistory.reduce((a, b) => a + b, 0) /
          this.memoryHistory.length
        : currentMB;
    const peakUsage = Math.max(...this.memoryHistory, currentMB);

    // Check for provider alerts
    const providerAlerts = this.checkProviderAlerts();

    return {
      current,
      trend,
      averageUsage,
      peakUsage,
      providerAlerts,
    };
  }

  /**
   * Check memory usage and trigger alerts if needed
   */
  private async checkMemoryUsage(options: MemoryMonitorOptions): Promise<void> {
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;

    // Update history
    this.memoryHistory.push(heapUsedMB);
    if (this.memoryHistory.length > this.maxHistorySize) {
      this.memoryHistory.shift();
    }

    // Check thresholds
    if (heapUsedMB >= options.criticalThreshold) {
      this.logger.error(`Critical memory usage: ${heapUsedMB.toFixed(2)}MB`);
      if (options.alertCallback) {
        options.alertCallback('critical', heapUsedMB);
      }
      await this.handleCriticalMemory();
    } else if (heapUsedMB >= options.warningThreshold) {
      this.logger.warn(`High memory usage: ${heapUsedMB.toFixed(2)}MB`);
      if (options.alertCallback) {
        options.alertCallback('warning', heapUsedMB);
      }
      await this.handleWarningMemory();
    }

    // Log periodic status
    this.logger.debug(
      `Memory usage: ${heapUsedMB.toFixed(2)}MB (heap), ${(memUsage.external / 1024 / 1024).toFixed(2)}MB (external)`,
    );
  }

  /**
   * Handle critical memory situations
   */
  private async handleCriticalMemory(): Promise<void> {
    this.logger.error('Handling critical memory situation');

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      this.logger.log('Forced garbage collection');
    }

    // Discover and analyze memory-intensive providers
    await this.analyzeMemoryIntensiveProviders();
  }

  /**
   * Handle warning memory situations
   */
  private async handleWarningMemory(): Promise<void> {
    this.logger.warn('Handling warning memory situation');

    // Suggest garbage collection
    if (global.gc) {
      global.gc();
      this.logger.debug('Suggested garbage collection');
    }
  }

  /**
   * Use Discovery Service to analyze memory-intensive providers
   */
  private async analyzeMemoryIntensiveProviders(): Promise<void> {
    const providers = this.discoveryService.getProviders();
    const memoryIntensiveProviders: string[] = [];

    for (const wrapper of providers) {
      if (!wrapper.metatype) continue;

      // Check for memory-sensitive metadata
      const memoryMetadata = this.reflector.get(
        'memory-sensitive',
        wrapper.metatype,
      );
      if (memoryMetadata) {
        const providerName = wrapper.name || 'unknown';
        memoryIntensiveProviders.push(providerName);

        // Check if provider has specific memory limits
        const monitoredProvider = this.monitoredProviders.get(providerName);
        if (monitoredProvider?.maxMemory) {
          this.logger.warn(
            `Memory-intensive provider detected: ${providerName} (limit: ${monitoredProvider.maxMemory}MB)`,
          );
        }
      }

      // Check for cacheable providers that might be consuming too much memory
      const cacheMetadata = this.reflector.get('cacheable', wrapper.metatype);
      if (cacheMetadata?.enabled) {
        const providerName = wrapper.name || 'unknown';
        this.logger.debug(
          `Cacheable provider: ${providerName} - consider cache eviction`,
        );
      }
    }

    if (memoryIntensiveProviders.length > 0) {
      this.logger.error(
        `Found ${memoryIntensiveProviders.length} memory-intensive providers:`,
        memoryIntensiveProviders,
      );
    }
  }

  /**
   * Check for provider-specific memory alerts
   */
  private checkProviderAlerts(): string[] {
    const alerts: string[] = [];
    const currentMemoryMB = process.memoryUsage().heapUsed / 1024 / 1024;

    for (const [providerName, config] of this.monitoredProviders.entries()) {
      if (config.alertThreshold && currentMemoryMB > config.alertThreshold) {
        alerts.push(
          `${providerName}: Memory usage exceeded ${config.alertThreshold}MB`,
        );
      }
    }

    return alerts;
  }

  /**
   * Get memory trend analysis
   */
  getMemoryTrend(): {
    isIncreasing: boolean;
    rate: number; // MB per check
    prediction: number; // Predicted memory in next 10 checks
  } {
    if (this.memoryHistory.length < 10) {
      return { isIncreasing: false, rate: 0, prediction: 0 };
    }

    const recent = this.memoryHistory.slice(-10);
    const slope = this.calculateSlope(recent);
    const isIncreasing = slope > 0.1; // More than 0.1 MB increase per check
    const currentMemory = this.memoryHistory[this.memoryHistory.length - 1];
    const prediction = currentMemory + slope * 10;

    return {
      isIncreasing,
      rate: slope,
      prediction: Math.max(0, prediction),
    };
  }

  /**
   * Calculate slope of memory usage trend
   */
  private calculateSlope(data: number[]): number {
    const n = data.length;
    const xMean = (n - 1) / 2;
    const yMean = data.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = i - xMean;
      const yDiff = data[i] - yMean;
      numerator += xDiff * yDiff;
      denominator += xDiff * xDiff;
    }

    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Get comprehensive memory report
   */
  getMemoryReport(): {
    summary: string;
    recommendations: string[];
    stats: any;
    trend: any;
  } {
    const stats = this.getMemoryStats();
    const trend = this.getMemoryTrend();
    const currentMB = stats.current.heapUsed / 1024 / 1024;

    let summary = `Memory Usage: ${currentMB.toFixed(2)}MB (${stats.trend})`;
    const recommendations: string[] = [];

    if (trend.isIncreasing && trend.rate > 1) {
      summary += ` - WARNING: Rapidly increasing (${trend.rate.toFixed(2)}MB/check)`;
      recommendations.push('Consider implementing cache eviction strategies');
      recommendations.push('Review memory-intensive providers');
    }

    if (currentMB > 400) {
      recommendations.push(
        'Memory usage is high - consider scaling or optimization',
      );
    }

    if (stats.providerAlerts.length > 0) {
      recommendations.push(
        `Address provider alerts: ${stats.providerAlerts.join(', ')}`,
      );
    }

    return {
      summary,
      recommendations,
      stats,
      trend,
    };
  }
}
