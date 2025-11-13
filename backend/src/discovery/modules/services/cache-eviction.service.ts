import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';

import { BaseService } from '../../../common/base';
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
    // TTL-based eviction
    this.strategies.push({
      name: 'TTL_EXPIRED',
      priority: 10,
      execute: async (memoryPressure: number) => {
        // Would integrate with cache service to remove expired entries
        return 0; // Placeholder
      },
    });

    // LRU-based eviction
    this.strategies.push({
      name: 'LRU_EVICTION',
      priority: 8,
      execute: async (memoryPressure: number) => {
        // Would evict least recently used entries
        return 0; // Placeholder
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
