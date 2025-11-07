import {
  Module,
  DynamicModule,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  Injectable,
} from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, Reflector } from '@nestjs/core';
import { MemoryOptimizedCacheService } from './services/memory-optimized-cache.service';
import { CacheEvictionService } from './services/cache-eviction.service';
import { MemoryMonitorService } from './services/memory-monitor.service';
import { SmartCacheInterceptor } from './interceptors/smart-cache.interceptor';
import { MemoryThresholdGuard } from './guards/memory-threshold.guard';

export interface MemoryOptimizedCacheOptions {
  maxMemoryThreshold?: number; // MB
  evictionStrategy?: 'lru' | 'lfu' | 'ttl' | 'smart';
  compressionEnabled?: boolean;
  autoScalingEnabled?: boolean;
  metricsEnabled?: boolean;
  discoveryEnabled?: boolean;
}

@Injectable()
class MemoryOptimizedCacheModuleService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private cleanupInterval?: NodeJS.Timeout;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly cacheService: MemoryOptimizedCacheService,
    private readonly evictionService: CacheEvictionService,
    private readonly memoryMonitor: MemoryMonitorService,
  ) {}

  async onApplicationBootstrap() {
    await this.discoverCacheableProviders();
    this.memoryMonitor.startMonitoring();

    this.cleanupInterval = setInterval(async () => {
      await this.performSmartCleanup();
    }, 30000);
  }

  async onApplicationShutdown() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.memoryMonitor.stopMonitoring();
    await this.cacheService.shutdown();
  }

  private async discoverCacheableProviders() {
    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      if (!wrapper.metatype) continue;

      const cacheMetadata = this.reflector.get('cacheable', wrapper.metatype);
      if (cacheMetadata?.enabled) {
        await this.cacheService.registerCacheableProvider(
          wrapper.name || wrapper.token?.toString() || 'unknown',
          {
            ttl: cacheMetadata.ttl || 300,
            maxSize: cacheMetadata.maxSize || 100,
            priority: cacheMetadata.priority || 'normal',
            compressionEnabled: cacheMetadata.compress !== false,
          },
        );
      }

      const memoryMetadata = this.reflector.get(
        'memory-sensitive',
        wrapper.metatype,
      );
      if (memoryMetadata) {
        this.memoryMonitor.addMonitoredProvider(
          wrapper.name || 'unknown',
          memoryMetadata,
        );
      }
    }
  }

  private async performSmartCleanup() {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;

    if (heapUsedMB > 400) {
      await this.evictionService.performSmartEviction(heapUsedMB);
    }
  }
}

/**
 * Memory-Optimized Cache Module
 *
 * Uses Discovery Service to:
 * 1. Automatically discover cacheable providers
 * 2. Monitor memory usage of cached data
 * 3. Implement smart eviction strategies based on provider metadata
 * 4. Auto-scale cache sizes based on system resources
 */
@Module({
  imports: [DiscoveryModule],
  providers: [
    MemoryOptimizedCacheService,
    CacheEvictionService,
    MemoryMonitorService,
    SmartCacheInterceptor,
    MemoryThresholdGuard,
    MemoryOptimizedCacheModuleService,
  ],
  exports: [
    MemoryOptimizedCacheService,
    CacheEvictionService,
    MemoryMonitorService,
    SmartCacheInterceptor,
    MemoryThresholdGuard,
  ],
})
export class MemoryOptimizedCacheModule {
  static forRoot(options: MemoryOptimizedCacheOptions = {}): DynamicModule {
    return {
      module: MemoryOptimizedCacheModule,
      imports: [DiscoveryModule],
      providers: [
        MemoryOptimizedCacheService,
        CacheEvictionService,
        MemoryMonitorService,
        SmartCacheInterceptor,
        MemoryThresholdGuard,
        MemoryOptimizedCacheModuleService,
        {
          provide: 'MEMORY_CACHE_OPTIONS',
          useValue: {
            maxMemoryThreshold: 512,
            evictionStrategy: 'smart',
            compressionEnabled: true,
            autoScalingEnabled: true,
            metricsEnabled: true,
            discoveryEnabled: true,
            ...options,
          },
        },
      ],
      exports: [
        MemoryOptimizedCacheService,
        CacheEvictionService,
        MemoryMonitorService,
        SmartCacheInterceptor,
        MemoryThresholdGuard,
      ],
    };
  }
}
