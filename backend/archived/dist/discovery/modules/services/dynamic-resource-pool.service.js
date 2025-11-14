"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicResourcePoolService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const base_1 = require("../../../common/base");
let DynamicResourcePoolService = class DynamicResourcePoolService extends base_1.BaseService {
    options;
    discoveryService;
    reflector;
    pools = new Map();
    databaseProviders = new Map();
    constructor(options, discoveryService, reflector) {
        super("DynamicResourcePoolService");
        this.options = options;
        this.discoveryService = discoveryService;
        this.reflector = reflector;
    }
    async createPool(name, config) {
        if (this.pools.has(name)) {
            this.logWarning(`Pool ${name} already exists`);
            return;
        }
        const pool = new ResourcePool(name, config, this.options);
        this.pools.set(name, pool);
        await pool.initialize();
        this.logInfo(`Created resource pool: ${name}`, {
            minSize: config.minSize,
            maxSize: config.maxSize,
            type: config.resourceType,
        });
    }
    async getResource(poolName, timeout = 30000) {
        const pool = this.pools.get(poolName);
        if (!pool) {
            throw new Error(`Pool ${poolName} not found`);
        }
        return pool.acquire(timeout);
    }
    async releaseResource(poolName, resource) {
        const pool = this.pools.get(poolName);
        if (!pool) {
            throw new Error(`Pool ${poolName} not found`);
        }
        await pool.release(resource);
    }
    async registerDatabaseProvider(name, metadata) {
        this.databaseProviders.set(name, metadata);
        await this.createPool(`db_${name}`, {
            minSize: metadata.minConnections || 2,
            maxSize: metadata.maxConnections || 20,
            resourceType: 'connection',
            factory: metadata.connectionFactory,
            validation: metadata.validateConnection,
            idleTimeout: metadata.idleTimeout || 300000,
            maxLifetime: metadata.maxLifetime || 3600000,
        });
        this.logInfo(`Registered database provider: ${name}`);
    }
    async scaleDownPools(reason) {
        this.logInfo(`Scaling down pools due to: ${reason}`);
        for (const [name, pool] of this.pools.entries()) {
            await pool.scaleDown();
            this.logDebug(`Scaled down pool: ${name}`);
        }
    }
    async cleanupIdleResources() {
        let totalCleaned = 0;
        for (const [name, pool] of this.pools.entries()) {
            const cleaned = await pool.cleanupIdle();
            totalCleaned += cleaned;
            if (cleaned > 0) {
                this.logDebug(`Cleaned ${cleaned} idle resources from pool: ${name}`);
            }
        }
        if (totalCleaned > 0) {
            this.logInfo(`Cleaned up ${totalCleaned} idle resources total`);
        }
    }
    getPoolStats() {
        const stats = {};
        for (const [name, pool] of this.pools.entries()) {
            stats[name] = pool.getStats();
        }
        return stats;
    }
    getPoolStatsByName(poolName) {
        const pool = this.pools.get(poolName);
        return pool ? pool.getStats() : null;
    }
    async shutdown() {
        this.logInfo('Shutting down all resource pools...');
        const shutdownPromises = Array.from(this.pools.values()).map((pool) => pool.shutdown());
        await Promise.all(shutdownPromises);
        this.pools.clear();
        this.databaseProviders.clear();
        this.logInfo('All resource pools shut down successfully');
    }
};
exports.DynamicResourcePoolService = DynamicResourcePoolService;
exports.DynamicResourcePoolService = DynamicResourcePoolService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RESOURCE_POOL_OPTIONS')),
    __metadata("design:paramtypes", [Object, core_1.DiscoveryService,
        core_1.Reflector])
], DynamicResourcePoolService);
class ResourcePool {
    name;
    config;
    globalOptions;
    resources = [];
    waitingQueue = [];
    stats = {
        totalCreated: 0,
        totalDestroyed: 0,
        totalWaitTime: 0,
        waitCount: 0,
    };
    constructor(name, config, globalOptions) {
        this.name = name;
        this.config = config;
        this.globalOptions = globalOptions;
    }
    async initialize() {
        for (let i = 0; i < this.config.minSize; i++) {
            await this.createResource();
        }
    }
    async acquire(timeout) {
        const startTime = Date.now();
        let resource = this.findAvailableResource();
        if (resource) {
            resource.inUse = true;
            resource.lastUsed = Date.now();
            return resource.resource;
        }
        if (this.resources.length < this.config.maxSize) {
            resource = await this.createResource();
            if (resource) {
                resource.inUse = true;
                resource.lastUsed = Date.now();
                return resource.resource;
            }
        }
        return new Promise((resolve, reject) => {
            const timeoutHandle = setTimeout(() => {
                const index = this.waitingQueue.findIndex((item) => item.resolve === resolve);
                if (index >= 0) {
                    this.waitingQueue.splice(index, 1);
                }
                reject(new Error(`Resource acquisition timeout for pool: ${this.name}`));
            }, timeout);
            this.waitingQueue.push({
                resolve: (resource) => {
                    clearTimeout(timeoutHandle);
                    const waitTime = Date.now() - startTime;
                    this.stats.totalWaitTime += waitTime;
                    this.stats.waitCount++;
                    resolve(resource);
                },
                reject: (error) => {
                    clearTimeout(timeoutHandle);
                    reject(error);
                },
                timeout: timeoutHandle,
            });
        });
    }
    async release(resourceToRelease) {
        const poolResource = this.resources.find((r) => r.resource === resourceToRelease);
        if (!poolResource) {
            throw new Error(`Resource not found in pool: ${this.name}`);
        }
        poolResource.inUse = false;
        poolResource.lastUsed = Date.now();
        if (this.config.validation) {
            try {
                poolResource.validated = await this.config.validation(poolResource.resource);
            }
            catch (error) {
                poolResource.validated = false;
            }
        }
        else {
            poolResource.validated = true;
        }
        if (!poolResource.validated) {
            await this.destroyResource(poolResource);
            if (this.resources.length < this.config.minSize) {
                await this.createResource();
            }
        }
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
    async scaleDown() {
        const idleResources = this.resources.filter((r) => !r.inUse);
        const targetSize = Math.max(this.config.minSize, Math.floor(this.resources.length * 0.7));
        while (this.resources.length > targetSize && idleResources.length > 0) {
            const resource = idleResources.pop();
            if (resource) {
                await this.destroyResource(resource);
            }
        }
    }
    async cleanupIdle() {
        const now = Date.now();
        const idleTimeout = this.config.idleTimeout || this.globalOptions.idleTimeout || 300000;
        const maxLifetime = this.config.maxLifetime || 3600000;
        let cleaned = 0;
        const resourcesToDestroy = [];
        for (const resource of this.resources) {
            if (resource.inUse)
                continue;
            const idleTime = now - resource.lastUsed;
            const lifetime = now - resource.createdAt;
            if (idleTime > idleTimeout || lifetime > maxLifetime) {
                resourcesToDestroy.push(resource);
            }
        }
        const canDestroy = Math.min(resourcesToDestroy.length, this.resources.length - this.config.minSize);
        for (let i = 0; i < canDestroy; i++) {
            await this.destroyResource(resourcesToDestroy[i]);
            cleaned++;
        }
        return cleaned;
    }
    getStats() {
        const activeResources = this.resources.filter((r) => r.inUse).length;
        const idleResources = this.resources.filter((r) => !r.inUse).length;
        return {
            totalResources: this.resources.length,
            activeResources,
            idleResources,
            waitingRequests: this.waitingQueue.length,
            totalCreated: this.stats.totalCreated,
            totalDestroyed: this.stats.totalDestroyed,
            averageWaitTime: this.stats.waitCount > 0
                ? this.stats.totalWaitTime / this.stats.waitCount
                : 0,
            poolUtilization: this.resources.length > 0 ? activeResources / this.resources.length : 0,
        };
    }
    async shutdown() {
        for (const waiter of this.waitingQueue) {
            clearTimeout(waiter.timeout);
            waiter.reject(new Error(`Pool ${this.name} is shutting down`));
        }
        this.waitingQueue.length = 0;
        const destroyPromises = this.resources.map((resource) => this.destroyResource(resource));
        await Promise.all(destroyPromises);
        this.resources.length = 0;
    }
    findAvailableResource() {
        return this.resources.find((r) => !r.inUse && r.validated) || null;
    }
    async createResource() {
        try {
            let resource;
            if (this.config.factory) {
                resource = await this.config.factory();
            }
            else {
                resource = this.createDefaultResource();
            }
            const poolResource = {
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
        }
        catch (error) {
            console.error(`Failed to create resource for pool ${this.name}:`, error);
            return null;
        }
    }
    createDefaultResource() {
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
    async destroyResource(poolResource) {
        const index = this.resources.indexOf(poolResource);
        if (index >= 0) {
            this.resources.splice(index, 1);
            this.stats.totalDestroyed++;
            const resource = poolResource.resource;
            if (resource &&
                typeof resource === 'object' &&
                'destroy' in resource &&
                typeof resource.destroy === 'function') {
                try {
                    await resource.destroy();
                }
                catch (error) {
                    console.error(`Error destroying resource ${poolResource.id}:`, error);
                }
            }
        }
    }
}
//# sourceMappingURL=dynamic-resource-pool.service.js.map