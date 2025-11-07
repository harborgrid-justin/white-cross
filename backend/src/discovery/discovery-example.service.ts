import {
  Injectable,
  Logger,
  OnModuleInit,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';
import {
  FeatureFlag,
  ExperimentalFeature,
  Analytics,
  Domain,
  Cacheable,
  Monitored,
} from './decorators/metadata.decorator';
import { RateLimit } from './decorators/rate-limit.decorator';
import { DiscoveryMetricsService } from './services/discovery-metrics.service';
import { DiscoveryCacheService } from './services/discovery-cache.service';

export interface ProviderInfo {
  name: string;
  instance: any;
  token: any;
  metadata: Record<string, any>;
}

export interface ControllerInfo {
  name: string;
  instance: any;
  metadata: Record<string, any>;
}

@Injectable()
export class DiscoveryExampleService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnApplicationShutdown,
    OnModuleDestroy
{
  private readonly logger = new Logger(DiscoveryExampleService.name);
  private scanInterval: NodeJS.Timeout | null = null;
  private metricsInterval: NodeJS.Timeout | null = null;
  private isShuttingDown = false;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly metricsService: DiscoveryMetricsService,
    private readonly cacheService: DiscoveryCacheService,
  ) {}

  async onModuleInit() {
    // Automatically scan and log providers/controllers on module initialization
    this.logger.log(
      'Discovery module initialized - preparing for application bootstrap...',
    );
    await this.initializeDiscoveryState();
  }

  async onApplicationBootstrap() {
    // Set up periodic scanning and metrics collection after application is fully bootstrapped
    this.logger.log(
      'Application bootstrapped - starting discovery services...',
    );

    try {
      // Initial comprehensive scan
      await this.scanApplication();

      // Start periodic scanning (every 5 minutes)
      this.scanInterval = setInterval(
        async () => {
          if (!this.isShuttingDown) {
            await this.performPeriodicScan();
          }
        },
        5 * 60 * 1000,
      );

      // Start metrics collection (every 30 seconds)
      this.metricsInterval = setInterval(async () => {
        if (!this.isShuttingDown) {
          await this.collectSystemMetrics();
        }
      }, 30 * 1000);

      this.logger.log('Discovery services started successfully');
      this.metricsService.incrementCounter('discovery_service_starts');
    } catch (error) {
      this.logger.error('Failed to start discovery services', error);
      this.metricsService.incrementCounter('discovery_service_start_errors');
      throw error;
    }
  }

  async onApplicationShutdown(signal?: string) {
    // Graceful shutdown
    this.logger.log(
      `Application shutting down with signal: ${signal || 'unknown'}`,
    );
    this.isShuttingDown = true;

    try {
      // Stop periodic tasks
      if (this.scanInterval) {
        clearInterval(this.scanInterval);
        this.scanInterval = null;
        this.logger.log('Stopped periodic scanning');
      }

      if (this.metricsInterval) {
        clearInterval(this.metricsInterval);
        this.metricsInterval = null;
        this.logger.log('Stopped metrics collection');
      }

      // Flush final metrics
      await this.flushFinalMetrics();

      this.logger.log('Discovery service shutdown completed');
      this.metricsService.incrementCounter('discovery_service_shutdowns');
    } catch (error) {
      this.logger.error('Error during discovery service shutdown', error);
      this.metricsService.incrementCounter('discovery_service_shutdown_errors');
    }
  }

  async onModuleDestroy() {
    // Final cleanup - ensure all resources are released
    this.logger.log(
      'Discovery module being destroyed - performing final cleanup...',
    );

    try {
      // Clear any remaining intervals (safety check)
      if (this.scanInterval) {
        clearInterval(this.scanInterval);
        this.scanInterval = null;
      }

      if (this.metricsInterval) {
        clearInterval(this.metricsInterval);
        this.metricsInterval = null;
      }

      // Clear caches to free memory
      await this.cacheService.clear();

      // Log final state
      const finalMetrics = this.metricsService.getMetrics();
      this.logger.log('Final discovery metrics:', {
        totalRequests: finalMetrics.counters?.discovery_requests?.value || 0,
        totalErrors: finalMetrics.counters?.discovery_errors?.value || 0,
        cacheHits: finalMetrics.counters?.cache_hits?.value || 0,
        cacheMisses: finalMetrics.counters?.cache_misses?.value || 0,
      });

      this.logger.log('Discovery module cleanup completed');
    } catch (error) {
      this.logger.error('Error during discovery module destruction', error);
    }
  }

  /**
   * Discover all providers in the application
   */
  getAllProviders(): InstanceWrapper[] {
    const providers = this.discoveryService.getProviders();
    this.logger.log(`Found ${providers.length} providers`);
    return providers;
  }

  /**
   * Discover all controllers in the application
   */
  getAllControllers(): InstanceWrapper[] {
    const controllers = this.discoveryService.getControllers();
    this.logger.log(`Found ${controllers.length} controllers`);
    return controllers;
  }

  /**
   * Get providers with specific feature flags
   */
  getProvidersWithFeatureFlag(flag: string): ProviderInfo[] {
    const providers = this.discoveryService.getProviders();

    return providers
      .filter((wrapper) => {
        if (!wrapper.metatype) return false;
        const metadata = this.reflector.get('feature-flag', wrapper.metatype);
        return metadata === flag;
      })
      .map((wrapper) => this.mapProviderToInfo(wrapper));
  }

  /**
   * Get providers with experimental features using DiscoveryService.createDecorator
   */
  getExperimentalProviders(feature: string): ProviderInfo[] {
    const providers = this.discoveryService.getProviders();

    return providers
      .filter((wrapper) => {
        const metadata = this.discoveryService.getMetadataByDecorator(
          ExperimentalFeature,
          wrapper,
        );
        return metadata === feature;
      })
      .map((wrapper) => this.mapProviderToInfo(wrapper));
  }

  /**
   * Get analytics-enabled providers
   */
  getAnalyticsProviders(): ProviderInfo[] {
    const providers = this.discoveryService.getProviders();

    return providers
      .filter((wrapper) => {
        if (!wrapper.metatype) return false;
        const metadata = this.reflector.get(
          'analytics-enabled',
          wrapper.metatype,
        );
        return metadata === true;
      })
      .map((wrapper) => this.mapProviderToInfo(wrapper));
  }

  /**
   * Get providers by domain
   */
  getProvidersByDomain(domain: string): ProviderInfo[] {
    const providers = this.discoveryService.getProviders();

    return providers
      .filter((wrapper) => {
        if (!wrapper.metatype) return false;
        const metadata = this.reflector.get('domain', wrapper.metatype);
        return metadata === domain;
      })
      .map((wrapper) => this.mapProviderToInfo(wrapper));
  }

  /**
   * Get cacheable providers
   */
  getCacheableProviders(): ProviderInfo[] {
    const providers = this.discoveryService.getProviders();

    return providers
      .filter((wrapper) => {
        if (!wrapper.metatype) return false;
        const metadata = this.reflector.get('cacheable', wrapper.metatype);
        return metadata && metadata.enabled;
      })
      .map((wrapper) => this.mapProviderToInfo(wrapper));
  }

  /**
   * Get rate-limited providers
   */
  getRateLimitedProviders(): ProviderInfo[] {
    const providers = this.discoveryService.getProviders();

    return providers
      .filter((wrapper) => {
        if (!wrapper.metatype) return false;
        const metadata = this.reflector.get('rate-limit', wrapper.metatype);
        return metadata;
      })
      .map((wrapper) => this.mapProviderToInfo(wrapper));
  }

  /**
   * Get monitored providers
   */
  getMonitoredProviders(level?: 'basic' | 'detailed'): ProviderInfo[] {
    const providers = this.discoveryService.getProviders();

    return providers
      .filter((wrapper) => {
        if (!wrapper.metatype) return false;
        const metadata = this.reflector.get(
          'monitoring-level',
          wrapper.metatype,
        );
        return level ? metadata === level : metadata;
      })
      .map((wrapper) => this.mapProviderToInfo(wrapper));
  }

  /**
   * Get detailed provider information including all metadata
   */
  getProviderDetails(providerToken: any): ProviderInfo | null {
    const providers = this.discoveryService.getProviders();
    const provider = providers.find(
      (wrapper) => wrapper.token === providerToken,
    );

    if (!provider) {
      return null;
    }

    return this.mapProviderToInfo(provider);
  }

  /**
   * Get controllers with specific metadata
   */
  getControllersWithMetadata(
    metadataKey: string,
    metadataValue?: any,
  ): ControllerInfo[] {
    const controllers = this.discoveryService.getControllers();

    return controllers
      .filter((wrapper) => {
        if (!wrapper.metatype) return false;
        const metadata = this.reflector.get(metadataKey, wrapper.metatype);
        return metadataValue !== undefined
          ? metadata === metadataValue
          : metadata !== undefined;
      })
      .map((wrapper) => this.mapControllerToInfo(wrapper));
  }

  /**
   * Initialize discovery state during module initialization
   */
  private async initializeDiscoveryState(): Promise<void> {
    try {
      // Initialize metrics with basic counters
      this.metricsService.incrementCounter('discovery_service_initializations');

      // Pre-warm cache with basic discovery data
      const providers = this.getAllProviders();
      const controllers = this.getAllControllers();

      // Cache basic counts for quick access
      await this.cacheService.set('provider_count', providers.length, 300); // 5 min TTL
      await this.cacheService.set('controller_count', controllers.length, 300);

      this.logger.log('Discovery state initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize discovery state', error);
      this.metricsService.incrementCounter('discovery_initialization_errors');
      throw error;
    }
  }

  /**
   * Perform comprehensive application scan with metrics collection
   */
  private async scanApplication(): Promise<void> {
    const startTime = Date.now();

    try {
      const providers = this.getAllProviders();
      const controllers = this.getAllControllers();

      // Collect detailed metrics
      this.metricsService.recordGauge('total_providers', providers.length);
      this.metricsService.recordGauge('total_controllers', controllers.length);

      // Scan by categories and record metrics
      const experimentalProviders =
        this.getProvidersWithFeatureFlag('experimental');
      const analyticsProviders = this.getAnalyticsProviders();
      const cacheableProviders = this.getCacheableProviders();
      const rateLimitedProviders = this.getRateLimitedProviders();
      const monitoredProviders = this.getMonitoredProviders();

      // Record category metrics
      this.metricsService.recordGauge(
        'experimental_providers',
        experimentalProviders.length,
      );
      this.metricsService.recordGauge(
        'analytics_providers',
        analyticsProviders.length,
      );
      this.metricsService.recordGauge(
        'cacheable_providers',
        cacheableProviders.length,
      );
      this.metricsService.recordGauge(
        'rate_limited_providers',
        rateLimitedProviders.length,
      );
      this.metricsService.recordGauge(
        'monitored_providers',
        monitoredProviders.length,
      );

      // Log findings
      if (experimentalProviders.length > 0) {
        this.logger.log(
          `Found ${experimentalProviders.length} experimental providers:`,
          experimentalProviders.map((p) => p.name),
        );
      }

      if (analyticsProviders.length > 0) {
        this.logger.log(
          `Found ${analyticsProviders.length} analytics-enabled providers:`,
          analyticsProviders.map((p) => p.name),
        );
      }

      if (cacheableProviders.length > 0) {
        this.logger.log(
          `Found ${cacheableProviders.length} cacheable providers:`,
          cacheableProviders.map((p) => p.name),
        );
      }

      if (monitoredProviders.length > 0) {
        this.logger.log(
          `Found ${monitoredProviders.length} monitored providers:`,
          monitoredProviders.map((p) => p.name),
        );
      }

      // Update cache with fresh data
      await this.cacheService.set('provider_count', providers.length, 300);
      await this.cacheService.set('controller_count', controllers.length, 300);
      await this.cacheService.set('last_scan_time', Date.now(), 300);

      const scanDuration = Date.now() - startTime;
      this.metricsService.recordHistogram('scan_duration_ms', scanDuration);
      this.metricsService.incrementCounter('successful_scans');

      this.logger.log(
        `Application scan complete: ${providers.length} providers, ${controllers.length} controllers (${scanDuration}ms)`,
      );
    } catch (error) {
      this.metricsService.incrementCounter('failed_scans');
      this.logger.error('Application scan failed', error);
      throw error;
    }
  }

  /**
   * Perform periodic lightweight scan
   */
  private async performPeriodicScan(): Promise<void> {
    const startTime = Date.now();

    try {
      this.logger.debug('Performing periodic discovery scan...');

      // Quick count check to detect changes
      const providers = this.getAllProviders();
      const controllers = this.getAllControllers();

      const cachedProviderCount =
        await this.cacheService.get<number>('provider_count');
      const cachedControllerCount =
        await this.cacheService.get<number>('controller_count');

      // Detect changes
      const providersChanged = cachedProviderCount !== providers.length;
      const controllersChanged = cachedControllerCount !== controllers.length;

      if (providersChanged || controllersChanged) {
        this.logger.log('Changes detected - performing full scan...');
        await this.scanApplication();
        this.metricsService.incrementCounter('change_detected_scans');
      } else {
        // Just update last scan time
        await this.cacheService.set('last_scan_time', Date.now(), 300);
        this.metricsService.recordGauge('total_providers', providers.length);
        this.metricsService.recordGauge(
          'total_controllers',
          controllers.length,
        );
      }

      const scanDuration = Date.now() - startTime;
      this.metricsService.recordHistogram(
        'periodic_scan_duration_ms',
        scanDuration,
      );
      this.metricsService.incrementCounter('periodic_scans');

      this.logger.debug(`Periodic scan completed (${scanDuration}ms)`);
    } catch (error) {
      this.metricsService.incrementCounter('periodic_scan_errors');
      this.logger.error('Periodic scan failed', error);
    }
  }

  /**
   * Collect system-level metrics
   */
  private async collectSystemMetrics(): Promise<void> {
    try {
      // Memory usage
      const memUsage = process.memoryUsage();
      this.metricsService.recordGauge(
        'memory_heap_used_mb',
        Math.round(memUsage.heapUsed / 1024 / 1024),
      );
      this.metricsService.recordGauge(
        'memory_heap_total_mb',
        Math.round(memUsage.heapTotal / 1024 / 1024),
      );
      this.metricsService.recordGauge(
        'memory_external_mb',
        Math.round(memUsage.external / 1024 / 1024),
      );

      // Process uptime
      this.metricsService.recordGauge(
        'uptime_seconds',
        Math.round(process.uptime()),
      );

      // Cache statistics
      const cacheStats = this.cacheService.getStats();
      this.metricsService.recordGauge('cache_size', cacheStats.keys);
      this.metricsService.recordGauge('cache_hit_rate', cacheStats.hitRate);

      this.metricsService.incrementCounter('system_metrics_collections');
    } catch (error) {
      this.metricsService.incrementCounter('system_metrics_errors');
      this.logger.error('Failed to collect system metrics', error);
    }
  }

  /**
   * Flush final metrics before shutdown
   */
  private async flushFinalMetrics(): Promise<void> {
    try {
      // Record final system state
      const memUsage = process.memoryUsage();
      this.metricsService.recordGauge(
        'final_memory_heap_used_mb',
        Math.round(memUsage.heapUsed / 1024 / 1024),
      );
      this.metricsService.recordGauge(
        'final_uptime_seconds',
        Math.round(process.uptime()),
      );

      // Cache final statistics
      const cacheStats = this.cacheService.getStats();
      this.metricsService.recordGauge('final_cache_size', cacheStats.keys);
      this.metricsService.recordGauge(
        'final_cache_hit_rate',
        cacheStats.hitRate,
      );

      // Store final scan timestamp
      await this.cacheService.set('final_scan_time', Date.now(), 3600); // Keep for 1 hour

      this.logger.log('Final metrics flushed successfully');
    } catch (error) {
      this.logger.error('Failed to flush final metrics', error);
    }
  }

  /**
   * Get health status for monitoring
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    uptime: number;
    lastScan: number | null;
    metrics: any;
    cache: any;
  }> {
    try {
      const lastScanTime =
        await this.cacheService.get<number>('last_scan_time');
      const now = Date.now();
      const uptime = Math.round(process.uptime());

      // Determine health status
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

      if (!lastScanTime || now - lastScanTime > 10 * 60 * 1000) {
        // No scan in 10 minutes
        status = 'unhealthy';
      } else if (now - lastScanTime > 6 * 60 * 1000) {
        // No scan in 6 minutes
        status = 'degraded';
      }

      return {
        status,
        uptime,
        lastScan: lastScanTime,
        metrics: this.metricsService.getMetrics(),
        cache: this.cacheService.getStats(),
      };
    } catch (error) {
      this.logger.error('Failed to get health status', error);
      return {
        status: 'unhealthy',
        uptime: Math.round(process.uptime()),
        lastScan: null,
        metrics: null,
        cache: null,
      };
    }
  }

  /**
   * Helper method to map provider wrapper to info object
   */
  private mapProviderToInfo(wrapper: InstanceWrapper): ProviderInfo {
    const metadata: Record<string, any> = {};

    // Extract all custom metadata
    if (wrapper.metatype) {
      metadata.featureFlag = this.reflector.get(
        'feature-flag',
        wrapper.metatype,
      );
      metadata.analyticsEnabled = this.reflector.get(
        'analytics-enabled',
        wrapper.metatype,
      );
      metadata.domain = this.reflector.get('domain', wrapper.metatype);
      metadata.cacheable = this.reflector.get('cacheable', wrapper.metatype);
      metadata.rateLimit = this.reflector.get('rate-limit', wrapper.metatype);
      metadata.monitoringLevel = this.reflector.get(
        'monitoring-level',
        wrapper.metatype,
      );

      // Also check for ExperimentalFeature decorator
      metadata.experimentalFeature =
        this.discoveryService.getMetadataByDecorator(
          ExperimentalFeature,
          wrapper,
        );
    }

    return {
      name: wrapper.name || wrapper.token?.toString() || 'Unknown',
      instance: wrapper.instance,
      token: wrapper.token,
      metadata: Object.fromEntries(
        Object.entries(metadata).filter(([_, value]) => value !== undefined),
      ),
    };
  }

  /**
   * Helper method to map controller wrapper to info object
   */
  private mapControllerToInfo(wrapper: InstanceWrapper): ControllerInfo {
    const metadata: Record<string, any> = {};

    if (wrapper.metatype) {
      metadata.featureFlag = this.reflector.get(
        'feature-flag',
        wrapper.metatype,
      );
      metadata.analyticsEnabled = this.reflector.get(
        'analytics-enabled',
        wrapper.metatype,
      );
      metadata.domain = this.reflector.get('domain', wrapper.metatype);
      metadata.monitoringLevel = this.reflector.get(
        'monitoring-level',
        wrapper.metatype,
      );
    }

    return {
      name: wrapper.name || wrapper.token?.toString() || 'Unknown',
      instance: wrapper.instance,
      metadata: Object.fromEntries(
        Object.entries(metadata).filter(([_, value]) => value !== undefined),
      ),
    };
  }
}
