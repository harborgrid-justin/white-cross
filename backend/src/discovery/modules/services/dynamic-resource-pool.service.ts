import { Injectable, Logger, Inject } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import {
  PoolableResource,
  ResourceFactory,
  ResourceValidator,
  DatabaseProviderMetadata,
  ResourcePoolGlobalOptions,
  QueueItem,
} from '../types/resource.types';

export interface PoolConfig {
  minSize: number;
  maxSize: number;
  resourceType: 'connection' | 'worker' | 'cache' | 'generic';
  factory?: ResourceFactory;
  validation?: ResourceValidator;
  idleTimeout?: number; // ms
  maxLifetime?: number; // ms
}

export interface PoolResource {
  id: string;
  resource: PoolableResource;
  createdAt: number;
  lastUsed: number;
  inUse: boolean;
  validated: boolean;
}

export interface PoolStats {
  totalResources: number;
  activeResources: number;
  idleResources: number;
  waitingRequests: number;
  totalCreated: number;
  totalDestroyed: number;
  averageWaitTime: number;
  poolUtilization: number;
}

/**
 * Dynamic Resource Pool Service
 *
 * Manages resource pools with auto-scaling capabilities
 * Uses Discovery Service to automatically configure pools
 */
@Injectable()
export class DynamicResourcePoolService {
  private readonly logger = new Logger(DynamicResourcePoolService.name);
  private pools = new Map<string, ResourcePool>();
  private databaseProviders = new Map<string, DatabaseProviderMetadata>();

  constructor(
    @Inject('RESOURCE_POOL_OPTIONS')
    private readonly options: ResourcePoolGlobalOptions,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Create a new resource pool
   */
  async createPool(name: string, config: PoolConfig): Promise<void> {
    if (this.pools.has(name)) {
      this.logger.warn(`Pool ${name} already exists`);
      return;
    }

    const pool = new ResourcePool(name, config, this.options);
    this.pools.set(name, pool);

    await pool.initialize();
    this.logger.log(`Created resource pool: ${name}`, {
      minSize: config.minSize,
      maxSize: config.maxSize,
      type: config.resourceType,
    });
  }

  /**
   * Get a resource from the pool
   */
  async getResource(
    poolName: string,
    timeout: number = 30000,
  ): Promise<PoolableResource> {
    const pool = this.pools.get(poolName);
    if (!pool) {
      throw new Error(`Pool ${poolName} not found`);
    }

    return pool.acquire(timeout);
  }

  /**
   * Return a resource to the pool
   */
  async releaseResource(
    poolName: string,
    resource: PoolableResource,
  ): Promise<void> {
    const pool = this.pools.get(poolName);
    if (!pool) {
      throw new Error(`Pool ${poolName} not found`);
    }

    await pool.release(resource);
  }

  /**
   * Register a database provider for automatic pool management
   */
  async registerDatabaseProvider(
    name: string,
    metadata: DatabaseProviderMetadata,
  ): Promise<void> {
    this.databaseProviders.set(name, metadata);

    // Create a pool for the database provider
    await this.createPool(`db_${name}`, {
      minSize: metadata.minConnections || 2,
      maxSize: metadata.maxConnections || 20,
      resourceType: 'connection',
      factory: metadata.connectionFactory,
      validation: metadata.validateConnection,
      idleTimeout: metadata.idleTimeout || 300000, // 5 minutes
      maxLifetime: metadata.maxLifetime || 3600000, // 1 hour
    });

    this.logger.log(`Registered database provider: ${name}`);
  }

  /**
   * Scale down pools during memory pressure
   */
  async scaleDownPools(reason: string): Promise<void> {
    this.logger.log(`Scaling down pools due to: ${reason}`);

    for (const [name, pool] of this.pools.entries()) {
      await pool.scaleDown();
      this.logger.debug(`Scaled down pool: ${name}`);
    }
  }

  /**
   * Clean up idle resources across all pools
   */
  async cleanupIdleResources(): Promise<void> {
    let totalCleaned = 0;

    for (const [name, pool] of this.pools.entries()) {
      const cleaned = await pool.cleanupIdle();
      totalCleaned += cleaned;

      if (cleaned > 0) {
        this.logger.debug(
          `Cleaned ${cleaned} idle resources from pool: ${name}`,
        );
      }
    }

    if (totalCleaned > 0) {
      this.logger.log(`Cleaned up ${totalCleaned} idle resources total`);
    }
  }

  /**
   * Get statistics for all pools
   */
  getPoolStats(): Record<string, PoolStats> {
    const stats: Record<string, PoolStats> = {};

    for (const [name, pool] of this.pools.entries()) {
      stats[name] = pool.getStats();
    }

    return stats;
  }

  /**
   * Get pool statistics for a specific pool
   */
  getPoolStatsByName(poolName: string): PoolStats | null {
    const pool = this.pools.get(poolName);
    return pool ? pool.getStats() : null;
  }

  /**
   * Shutdown all pools
   */
  async shutdown(): Promise<void> {
    this.logger.log('Shutting down all resource pools...');

    const shutdownPromises = Array.from(this.pools.values()).map((pool) =>
      pool.shutdown(),
    );
    await Promise.all(shutdownPromises);

    this.pools.clear();
    this.databaseProviders.clear();

    this.logger.log('All resource pools shut down successfully');
  }
}

/**
 * Individual Resource Pool Implementation
 */
class ResourcePool {
  private resources: PoolResource[] = [];
  private waitingQueue: QueueItem<PoolableResource>[] = [];
  private stats = {
    totalCreated: 0,
    totalDestroyed: 0,
    totalWaitTime: 0,
    waitCount: 0,
  };

  constructor(
    private readonly name: string,
    private readonly config: PoolConfig,
    private readonly globalOptions: ResourcePoolGlobalOptions,
  ) {}

  async initialize(): Promise<void> {
    // Create minimum number of resources
    for (let i = 0; i < this.config.minSize; i++) {
      await this.createResource();
    }
  }

  async acquire(timeout: number): Promise<PoolableResource> {
    const startTime = Date.now();

    // Try to find an available resource
    let resource = this.findAvailableResource();

    if (resource) {
      resource.inUse = true;
      resource.lastUsed = Date.now();
      return resource.resource;
    }

    // Try to create a new resource if under max limit
    if (this.resources.length < this.config.maxSize) {
      resource = await this.createResource();
      if (resource) {
        resource.inUse = true;
        resource.lastUsed = Date.now();
        return resource.resource;
      }
    }

    // Wait for a resource to become available
    return new Promise<PoolableResource>((resolve, reject) => {
      const timeoutHandle = setTimeout(() => {
        const index = this.waitingQueue.findIndex(
          (item) => item.resolve === resolve,
        );
        if (index >= 0) {
          this.waitingQueue.splice(index, 1);
        }
        reject(
          new Error(`Resource acquisition timeout for pool: ${this.name}`),
        );
      }, timeout);

      this.waitingQueue.push({
        resolve: (resource: PoolableResource) => {
          clearTimeout(timeoutHandle);
          const waitTime = Date.now() - startTime;
          this.stats.totalWaitTime += waitTime;
          this.stats.waitCount++;
          resolve(resource);
        },
        reject: (error: Error) => {
          clearTimeout(timeoutHandle);
          reject(error);
        },
        timeout: timeoutHandle,
      });
    });
  }

  async release(resourceToRelease: PoolableResource): Promise<void> {
    const poolResource = this.resources.find(
      (r) => r.resource === resourceToRelease,
    );

    if (!poolResource) {
      throw new Error(`Resource not found in pool: ${this.name}`);
    }

    poolResource.inUse = false;
    poolResource.lastUsed = Date.now();

    // Validate resource before making it available
    if (this.config.validation) {
      try {
        poolResource.validated = await this.config.validation(
          poolResource.resource,
        );
      } catch (error) {
        poolResource.validated = false;
      }
    } else {
      poolResource.validated = true;
    }

    // If resource is invalid, destroy it and create a new one
    if (!poolResource.validated) {
      await this.destroyResource(poolResource);
      if (this.resources.length < this.config.minSize) {
        await this.createResource();
      }
    }

    // Serve waiting requests
    if (this.waitingQueue.length > 0) {
      const availableResource = this.findAvailableResource();
      if (availableResource) {
        const waiter = this.waitingQueue.shift();
        if (waiter) {
          availableResource.inUse = true;
          availableResource.lastUsed = Date.now();
          waiter.resolve(availableResource.resource);
        }
      }
    }
  }

  async scaleDown(): Promise<void> {
    const idleResources = this.resources.filter((r) => !r.inUse);
    const targetSize = Math.max(
      this.config.minSize,
      Math.floor(this.resources.length * 0.7),
    );

    while (this.resources.length > targetSize && idleResources.length > 0) {
      const resource = idleResources.pop();
      if (resource) {
        await this.destroyResource(resource);
      }
    }
  }

  async cleanupIdle(): Promise<number> {
    const now = Date.now();
    const idleTimeout =
      this.config.idleTimeout || this.globalOptions.idleTimeout || 300000;
    const maxLifetime = this.config.maxLifetime || 3600000;

    let cleaned = 0;
    const resourcesToDestroy: PoolResource[] = [];

    for (const resource of this.resources) {
      if (resource.inUse) continue;

      const idleTime = now - resource.lastUsed;
      const lifetime = now - resource.createdAt;

      if (idleTime > idleTimeout || lifetime > maxLifetime) {
        resourcesToDestroy.push(resource);
      }
    }

    // Don't destroy resources if we'd go below minimum
    const canDestroy = Math.min(
      resourcesToDestroy.length,
      this.resources.length - this.config.minSize,
    );

    for (let i = 0; i < canDestroy; i++) {
      await this.destroyResource(resourcesToDestroy[i]);
      cleaned++;
    }

    return cleaned;
  }

  getStats(): PoolStats {
    const activeResources = this.resources.filter((r) => r.inUse).length;
    const idleResources = this.resources.filter((r) => !r.inUse).length;

    return {
      totalResources: this.resources.length,
      activeResources,
      idleResources,
      waitingRequests: this.waitingQueue.length,
      totalCreated: this.stats.totalCreated,
      totalDestroyed: this.stats.totalDestroyed,
      averageWaitTime:
        this.stats.waitCount > 0
          ? this.stats.totalWaitTime / this.stats.waitCount
          : 0,
      poolUtilization:
        this.resources.length > 0 ? activeResources / this.resources.length : 0,
    };
  }

  async shutdown(): Promise<void> {
    // Clear waiting queue
    for (const waiter of this.waitingQueue) {
      clearTimeout(waiter.timeout);
      waiter.reject(new Error(`Pool ${this.name} is shutting down`));
    }
    this.waitingQueue.length = 0;

    // Destroy all resources
    const destroyPromises = this.resources.map((resource) =>
      this.destroyResource(resource),
    );
    await Promise.all(destroyPromises);

    this.resources.length = 0;
  }

  private findAvailableResource(): PoolResource | null {
    return this.resources.find((r) => !r.inUse && r.validated) || null;
  }

  private async createResource(): Promise<PoolResource | null> {
    try {
      let resource: PoolableResource;

      if (this.config.factory) {
        resource = await this.config.factory();
      } else {
        // Default factory based on resource type
        resource = this.createDefaultResource();
      }

      const poolResource: PoolResource = {
        id: `${this.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        resource,
        createdAt: Date.now(),
        lastUsed: Date.now(),
        inUse: false,
        validated: true,
      };

      this.resources.push(poolResource);
      this.stats.totalCreated++;

      return poolResource;
    } catch (error) {
      console.error(`Failed to create resource for pool ${this.name}:`, error);
      return null;
    }
  }

  private createDefaultResource(): PoolableResource {
    switch (this.config.resourceType) {
      case 'connection':
        return {
          type: 'connection',
          id: Math.random().toString(36),
          connected: false,
        };
      case 'worker':
        return {
          type: 'worker',
          id: Math.random().toString(36),
          busy: false,
        };
      case 'cache':
        return {
          type: 'cache',
          id: Math.random().toString(36),
          size: 0,
        };
      default:
        return { type: 'generic', id: Math.random().toString(36) };
    }
  }

  private async destroyResource(poolResource: PoolResource): Promise<void> {
    const index = this.resources.indexOf(poolResource);
    if (index >= 0) {
      this.resources.splice(index, 1);
      this.stats.totalDestroyed++;

      // Custom cleanup if provided
      const resource = poolResource.resource;
      if (
        resource &&
        typeof resource === 'object' &&
        'destroy' in resource &&
        typeof resource.destroy === 'function'
      ) {
        try {
          await resource.destroy();
        } catch (error) {
          console.error(`Error destroying resource ${poolResource.id}:`, error);
        }
      }
    }
  }
}
