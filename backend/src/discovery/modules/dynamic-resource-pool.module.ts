import { DynamicModule, Injectable, Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, Reflector } from '@nestjs/core';
import { DynamicResourcePoolService } from '@/services/dynamic-resource-pool.service';
import { ResourceMonitorService } from '@/services/resource-monitor.service';
import { PoolOptimizationService } from '@/services/pool-optimization.service';
import { ResourceThrottleInterceptor } from './interceptors/resource-throttle.interceptor';
import { ResourceQuotaGuard } from './guards/resource-quota.guard';

export interface DynamicResourcePoolOptions {
  maxConnections?: number;
  connectionTimeout?: number; // ms
  idleTimeout?: number; // ms
  maxMemoryPerPool?: number; // MB
  autoScaling?: boolean;
  metricsEnabled?: boolean;
  discoveryEnabled?: boolean;
}

@Injectable()
class DynamicResourcePoolModuleService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private monitoringInterval?: NodeJS.Timeout;
  private optimizationInterval?: NodeJS.Timeout;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly poolService: DynamicResourcePoolService,
    private readonly monitorService: ResourceMonitorService,
    private readonly optimizationService: PoolOptimizationService,
  ) {}

  async onApplicationBootstrap() {
    await this.discoverResourceProviders();
    this.monitorService.startMonitoring();

    // Monitor resource usage every 10 seconds
    this.monitoringInterval = setInterval(async () => {
      await this.monitorResourceUsage();
    }, 10000);

    // Optimize pools every 60 seconds
    this.optimizationInterval = setInterval(async () => {
      await this.optimizationService.optimizePools();
    }, 60000);
  }

  async onApplicationShutdown() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
    }

    this.monitorService.stopMonitoring();
    await this.poolService.shutdown();
  }

  private async discoverResourceProviders() {
    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      if (!wrapper.metatype) continue;

      // Check for resource-pool metadata
      const poolMetadata = this.reflector.get(
        'resource-pool',
        wrapper.metatype,
      );
      if (poolMetadata?.enabled) {
        await this.poolService.createPool(
          wrapper.name || wrapper.token?.toString() || 'unknown',
          {
            minSize: poolMetadata.minSize || 1,
            maxSize: poolMetadata.maxSize || 10,
            resourceType: poolMetadata.type || 'connection',
            factory: poolMetadata.factory,
            validation: poolMetadata.validation,
          },
        );
      }

      // Check for database providers
      const dbMetadata = this.reflector.get('database', wrapper.metatype);
      if (dbMetadata) {
        await this.poolService.registerDatabaseProvider(
          wrapper.name || 'unknown',
          dbMetadata,
        );
      }
    }
  }

  private async monitorResourceUsage() {
    const stats = this.monitorService.getResourceStats();
    const memoryUsage = process.memoryUsage();

    // Check if memory usage is approaching limits
    if (memoryUsage.heapUsed / 1024 / 1024 > 400) {
      // 400MB
      await this.poolService.scaleDownPools('memory-pressure');
    }

    // Check for idle resources that can be freed
    await this.poolService.cleanupIdleResources();
  }
}

/**
 * Dynamic Resource Pool Module
 *
 * Uses Discovery Service to:
 * 1. Automatically discover resource-intensive providers
 * 2. Create and manage connection/resource pools
 * 3. Implement auto-scaling based on usage patterns
 * 4. Monitor and optimize resource allocation
 */
@Module({
  imports: [DiscoveryModule],
  providers: [
    DynamicResourcePoolService,
    ResourceMonitorService,
    PoolOptimizationService,
    ResourceThrottleInterceptor,
    ResourceQuotaGuard,
    DynamicResourcePoolModuleService,
  ],
  exports: [
    DynamicResourcePoolService,
    ResourceMonitorService,
    PoolOptimizationService,
    ResourceThrottleInterceptor,
    ResourceQuotaGuard,
  ],
})
export class DynamicResourcePoolModule {
  static forRoot(options: DynamicResourcePoolOptions = {}): DynamicModule {
    return {
      module: DynamicResourcePoolModule,
      imports: [DiscoveryModule],
      providers: [
        DynamicResourcePoolService,
        ResourceMonitorService,
        PoolOptimizationService,
        ResourceThrottleInterceptor,
        ResourceQuotaGuard,
        DynamicResourcePoolModuleService,
        {
          provide: 'RESOURCE_POOL_OPTIONS',
          useValue: {
            maxConnections: 50,
            connectionTimeout: 30000,
            idleTimeout: 300000, // 5 minutes
            maxMemoryPerPool: 64, // 64MB
            autoScaling: true,
            metricsEnabled: true,
            discoveryEnabled: true,
            ...options,
          },
        },
      ],
      exports: [
        DynamicResourcePoolService,
        ResourceMonitorService,
        PoolOptimizationService,
        ResourceThrottleInterceptor,
        ResourceQuotaGuard,
      ],
    };
  }
}
