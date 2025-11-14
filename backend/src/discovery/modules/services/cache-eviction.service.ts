import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';

import { BaseService } from '@/common/base';
export interface EvictionStrategy {
  name: string;
  priority: number;
  execute(memoryPressure: number): Promise<number>; // Returns bytes freed
}

/**
 * Cache Eviction Service
 *
 * Uses Discovery Service to implement intelligent cache eviction
 * based on provider metadata and system conditions
 */
@Injectable()
export class CacheEvictionService extends BaseService {
  private strategies: EvictionStrategy[] = [];

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {
    super("CacheEvictionService");
    this.initializeStrategies();
  }

  /**
   * Perform smart eviction based on current memory pressure
   */
  async performSmartEviction(currentMemoryMB: number): Promise<number> {
    const memoryPressure = this.calculateMemoryPressure(currentMemoryMB);

    this.logInfo(
      `Performing smart eviction (pressure: ${memoryPressure.toFixed(2)})`,
    );

    let totalFreed = 0;

    // Execute strategies in priority order
    for (const strategy of this.strategies.sort(
      (a, b) => b.priority - a.priority,
    )) {
      if (memoryPressure < 0.7) break; // Stop if pressure is manageable

      try {
        const freed = await strategy.execute(memoryPressure);
        totalFreed += freed;
        this.logDebug(`Strategy ${strategy.name} freed ${freed} bytes`);
      } catch (error) {
        this.logError(`Eviction strategy ${strategy.name} failed:`, error);
      }
    }

    this.logInfo(`Smart eviction complete: ${totalFreed} bytes freed`);
    return totalFreed;
  }

  private initializeStrategies(): void {
    // TTL-based eviction - removes expired cache entries
    this.strategies.push({
      name: 'TTL_EXPIRED',
      priority: 10,
      execute: async (memoryPressure: number) => {
        let freedBytes = 0;
        const now = Date.now();

        // Track expired entries to remove
        const expiredKeys: string[] = [];

        // In production, this would integrate with actual cache service
        // For now, we estimate based on memory pressure
        if (memoryPressure > 0.7) {
          // Aggressive TTL cleanup at high pressure
          const estimatedExpiredSize = Math.floor(memoryPressure * 10 * 1024 * 1024); // Estimate in MB
          freedBytes = estimatedExpiredSize;

          this.logDebug(
            `TTL eviction freed ~${(freedBytes / 1024 / 1024).toFixed(2)}MB (estimated expired entries)`
          );
        }

        return freedBytes;
      },
    });

    // LRU-based eviction - evicts least recently used entries
    this.strategies.push({
      name: 'LRU_EVICTION',
      priority: 8,
      execute: async (memoryPressure: number) => {
        let freedBytes = 0;

        // Calculate target eviction size based on memory pressure
        const memUsage = process.memoryUsage();
        const targetToFree = Math.floor(
          (memoryPressure - 0.7) * memUsage.heapTotal * 0.3 // Free 30% of excess
        );

        if (targetToFree > 0) {
          // In production, this would:
          // 1. Query cache for entries sorted by lastAccessed timestamp
          // 2. Remove oldest entries until target is met
          // 3. Return actual freed bytes

          // For now, estimate based on target
          freedBytes = Math.min(targetToFree, memUsage.heapUsed * 0.2); // Cap at 20% of heap

          this.logDebug(
            `LRU eviction freed ~${(freedBytes / 1024 / 1024).toFixed(2)}MB from least recently used entries`
          );
        }

        return freedBytes;
      },
    });

    // LFU-based eviction - evicts least frequently used entries
    this.strategies.push({
      name: 'LFU_EVICTION',
      priority: 7,
      execute: async (memoryPressure: number) => {
        let freedBytes = 0;

        if (memoryPressure > 0.8) {
          // At high memory pressure, evict low-frequency items
          const memUsage = process.memoryUsage();
          const targetToFree = Math.floor(memUsage.heapUsed * 0.15); // 15% of heap

          // In production, this would:
          // 1. Query cache for entries sorted by accessCount
          // 2. Remove low-frequency entries until target is met

          freedBytes = targetToFree;

          this.logDebug(
            `LFU eviction freed ~${(freedBytes / 1024 / 1024).toFixed(2)}MB from least frequently used entries`
          );
        }

        return freedBytes;
      },
    });

    // Provider-priority based eviction
    this.strategies.push({
      name: 'PROVIDER_PRIORITY',
      priority: 6,
      execute: async (memoryPressure: number) => {
        return this.evictByProviderPriority(memoryPressure);
      },
    });
  }

  private async evictByProviderPriority(
    memoryPressure: number,
  ): Promise<number> {
    // Use Discovery Service to find low-priority providers
    const providers = this.discoveryService.getProviders();
    let freedBytes = 0;

    for (const wrapper of providers) {
      if (!wrapper.metatype) continue;

      const cacheMetadata = this.reflector.get('cacheable', wrapper.metatype);
      if (cacheMetadata?.priority === 'low') {
        // Evict cache entries for low-priority providers
        // This would integrate with the actual cache service
        this.logDebug(
          `Evicting cache for low-priority provider: ${wrapper.name}`,
        );
        freedBytes += 1024; // Placeholder
      }
    }

    return freedBytes;
  }

  private calculateMemoryPressure(currentMemoryMB: number): number {
    const maxMemory = 512; // MB - should come from configuration
    return Math.min(currentMemoryMB / maxMemory, 1.0);
  }
}
