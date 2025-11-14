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
exports.DiscoveryExampleService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const metadata_decorator_1 = require("./decorators/metadata.decorator");
const discovery_metrics_service_1 = require("./services/discovery-metrics.service");
const discovery_cache_service_1 = require("./services/discovery-cache.service");
const base_1 = require("../common/base");
const logger_service_1 = require("../common/logging/logger.service");
let DiscoveryExampleService = class DiscoveryExampleService extends base_1.BaseService {
    discoveryService;
    metadataScanner;
    reflector;
    metricsService;
    cacheService;
    scanInterval = null;
    metricsInterval = null;
    isShuttingDown = false;
    constructor(logger, discoveryService, metadataScanner, reflector, metricsService, cacheService) {
        super({
            serviceName: 'DiscoveryExampleService',
            logger,
            enableAuditLogging: true,
        });
        this.discoveryService = discoveryService;
        this.metadataScanner = metadataScanner;
        this.reflector = reflector;
        this.metricsService = metricsService;
        this.cacheService = cacheService;
    }
    async onModuleInit() {
        this.logInfo('Discovery module initialized - preparing for application bootstrap...');
        await this.initializeDiscoveryState();
    }
    async onApplicationBootstrap() {
        this.logInfo('Application bootstrapped - starting discovery services...');
        try {
            await this.scanApplication();
            this.scanInterval = setInterval(async () => {
                if (!this.isShuttingDown) {
                    await this.performPeriodicScan();
                }
            }, 5 * 60 * 1000);
            this.metricsInterval = setInterval(async () => {
                if (!this.isShuttingDown) {
                    await this.collectSystemMetrics();
                }
            }, 30 * 1000);
            this.logInfo('Discovery services started successfully');
            this.metricsService.incrementCounter('discovery_service_starts');
        }
        catch (error) {
            this.logError('Failed to start discovery services', error);
            this.metricsService.incrementCounter('discovery_service_start_errors');
            throw error;
        }
    }
    async onApplicationShutdown(signal) {
        this.logInfo(`Application shutting down with signal: ${signal || 'unknown'}`);
        this.isShuttingDown = true;
        try {
            if (this.scanInterval) {
                clearInterval(this.scanInterval);
                this.scanInterval = null;
                this.logInfo('Stopped periodic scanning');
            }
            if (this.metricsInterval) {
                clearInterval(this.metricsInterval);
                this.metricsInterval = null;
                this.logInfo('Stopped metrics collection');
            }
            await this.flushFinalMetrics();
            this.logInfo('Discovery service shutdown completed');
            this.metricsService.incrementCounter('discovery_service_shutdowns');
        }
        catch (error) {
            this.logError('Error during discovery service shutdown', error);
            this.metricsService.incrementCounter('discovery_service_shutdown_errors');
        }
    }
    async onModuleDestroy() {
        this.logInfo('Discovery module being destroyed - performing final cleanup...');
        try {
            if (this.scanInterval) {
                clearInterval(this.scanInterval);
                this.scanInterval = null;
            }
            if (this.metricsInterval) {
                clearInterval(this.metricsInterval);
                this.metricsInterval = null;
            }
            await this.cacheService.clear();
            const finalMetrics = this.metricsService.getMetrics();
            this.logInfo('Final discovery metrics:', {
                totalRequests: finalMetrics.counters?.discovery_requests?.value || 0,
                totalErrors: finalMetrics.counters?.discovery_errors?.value || 0,
                cacheHits: finalMetrics.counters?.cache_hits?.value || 0,
                cacheMisses: finalMetrics.counters?.cache_misses?.value || 0,
            });
            this.logInfo('Discovery module cleanup completed');
        }
        catch (error) {
            this.logError('Error during discovery module destruction', error);
        }
    }
    getAllProviders() {
        const providers = this.discoveryService.getProviders();
        this.logInfo(`Found ${providers.length} providers`);
        return providers;
    }
    getAllControllers() {
        const controllers = this.discoveryService.getControllers();
        this.logInfo(`Found ${controllers.length} controllers`);
        return controllers;
    }
    getProvidersWithFeatureFlag(flag) {
        const providers = this.discoveryService.getProviders();
        return providers
            .filter((wrapper) => {
            if (!wrapper.metatype)
                return false;
            const metadata = this.reflector.get('feature-flag', wrapper.metatype);
            return metadata === flag;
        })
            .map((wrapper) => this.mapProviderToInfo(wrapper));
    }
    getExperimentalProviders(feature) {
        const providers = this.discoveryService.getProviders();
        return providers
            .filter((wrapper) => {
            const metadata = this.discoveryService.getMetadataByDecorator(metadata_decorator_1.ExperimentalFeature, wrapper);
            return metadata === feature;
        })
            .map((wrapper) => this.mapProviderToInfo(wrapper));
    }
    getAnalyticsProviders() {
        const providers = this.discoveryService.getProviders();
        return providers
            .filter((wrapper) => {
            if (!wrapper.metatype)
                return false;
            const metadata = this.reflector.get('analytics-enabled', wrapper.metatype);
            return metadata === true;
        })
            .map((wrapper) => this.mapProviderToInfo(wrapper));
    }
    getProvidersByDomain(domain) {
        const providers = this.discoveryService.getProviders();
        return providers
            .filter((wrapper) => {
            if (!wrapper.metatype)
                return false;
            const metadata = this.reflector.get('domain', wrapper.metatype);
            return metadata === domain;
        })
            .map((wrapper) => this.mapProviderToInfo(wrapper));
    }
    getCacheableProviders() {
        const providers = this.discoveryService.getProviders();
        return providers
            .filter((wrapper) => {
            if (!wrapper.metatype)
                return false;
            const metadata = this.reflector.get('cacheable', wrapper.metatype);
            return metadata && metadata.enabled;
        })
            .map((wrapper) => this.mapProviderToInfo(wrapper));
    }
    getRateLimitedProviders() {
        const providers = this.discoveryService.getProviders();
        return providers
            .filter((wrapper) => {
            if (!wrapper.metatype)
                return false;
            const metadata = this.reflector.get('rate-limit', wrapper.metatype);
            return metadata;
        })
            .map((wrapper) => this.mapProviderToInfo(wrapper));
    }
    getMonitoredProviders(level) {
        const providers = this.discoveryService.getProviders();
        return providers
            .filter((wrapper) => {
            if (!wrapper.metatype)
                return false;
            const metadata = this.reflector.get('monitoring-level', wrapper.metatype);
            return level ? metadata === level : metadata;
        })
            .map((wrapper) => this.mapProviderToInfo(wrapper));
    }
    getProviderDetails(providerToken) {
        const providers = this.discoveryService.getProviders();
        const provider = providers.find((wrapper) => wrapper.token === providerToken);
        if (!provider) {
            return null;
        }
        return this.mapProviderToInfo(provider);
    }
    getControllersWithMetadata(metadataKey, metadataValue) {
        const controllers = this.discoveryService.getControllers();
        return controllers
            .filter((wrapper) => {
            if (!wrapper.metatype)
                return false;
            const metadata = this.reflector.get(metadataKey, wrapper.metatype);
            return metadataValue !== undefined
                ? metadata === metadataValue
                : metadata !== undefined;
        })
            .map((wrapper) => this.mapControllerToInfo(wrapper));
    }
    async initializeDiscoveryState() {
        try {
            this.metricsService.incrementCounter('discovery_service_initializations');
            const providers = this.getAllProviders();
            const controllers = this.getAllControllers();
            await this.cacheService.set('provider_count', providers.length, 300);
            await this.cacheService.set('controller_count', controllers.length, 300);
            this.logInfo('Discovery state initialized successfully');
        }
        catch (error) {
            this.logError('Failed to initialize discovery state', error);
            this.metricsService.incrementCounter('discovery_initialization_errors');
            throw error;
        }
    }
    async scanApplication() {
        const startTime = Date.now();
        try {
            const providers = this.getAllProviders();
            const controllers = this.getAllControllers();
            this.metricsService.recordGauge('total_providers', providers.length);
            this.metricsService.recordGauge('total_controllers', controllers.length);
            const experimentalProviders = this.getProvidersWithFeatureFlag('experimental');
            const analyticsProviders = this.getAnalyticsProviders();
            const cacheableProviders = this.getCacheableProviders();
            const rateLimitedProviders = this.getRateLimitedProviders();
            const monitoredProviders = this.getMonitoredProviders();
            this.metricsService.recordGauge('experimental_providers', experimentalProviders.length);
            this.metricsService.recordGauge('analytics_providers', analyticsProviders.length);
            this.metricsService.recordGauge('cacheable_providers', cacheableProviders.length);
            this.metricsService.recordGauge('rate_limited_providers', rateLimitedProviders.length);
            this.metricsService.recordGauge('monitored_providers', monitoredProviders.length);
            if (experimentalProviders.length > 0) {
                this.logInfo(`Found ${experimentalProviders.length} experimental providers:`, experimentalProviders.map((p) => p.name));
            }
            if (analyticsProviders.length > 0) {
                this.logInfo(`Found ${analyticsProviders.length} analytics-enabled providers:`, analyticsProviders.map((p) => p.name));
            }
            if (cacheableProviders.length > 0) {
                this.logInfo(`Found ${cacheableProviders.length} cacheable providers:`, cacheableProviders.map((p) => p.name));
            }
            if (monitoredProviders.length > 0) {
                this.logInfo(`Found ${monitoredProviders.length} monitored providers:`, monitoredProviders.map((p) => p.name));
            }
            await this.cacheService.set('provider_count', providers.length, 300);
            await this.cacheService.set('controller_count', controllers.length, 300);
            await this.cacheService.set('last_scan_time', Date.now(), 300);
            const scanDuration = Date.now() - startTime;
            this.metricsService.recordHistogram('scan_duration_ms', scanDuration);
            this.metricsService.incrementCounter('successful_scans');
            this.logInfo(`Application scan complete: ${providers.length} providers, ${controllers.length} controllers (${scanDuration}ms)`);
        }
        catch (error) {
            this.metricsService.incrementCounter('failed_scans');
            this.logError('Application scan failed', error);
            throw error;
        }
    }
    async performPeriodicScan() {
        const startTime = Date.now();
        try {
            this.logDebug('Performing periodic discovery scan...');
            const providers = this.getAllProviders();
            const controllers = this.getAllControllers();
            const cachedProviderCount = await this.cacheService.get('provider_count');
            const cachedControllerCount = await this.cacheService.get('controller_count');
            const providersChanged = cachedProviderCount !== providers.length;
            const controllersChanged = cachedControllerCount !== controllers.length;
            if (providersChanged || controllersChanged) {
                this.logInfo('Changes detected - performing full scan...');
                await this.scanApplication();
                this.metricsService.incrementCounter('change_detected_scans');
            }
            else {
                await this.cacheService.set('last_scan_time', Date.now(), 300);
                this.metricsService.recordGauge('total_providers', providers.length);
                this.metricsService.recordGauge('total_controllers', controllers.length);
            }
            const scanDuration = Date.now() - startTime;
            this.metricsService.recordHistogram('periodic_scan_duration_ms', scanDuration);
            this.metricsService.incrementCounter('periodic_scans');
            this.logDebug(`Periodic scan completed (${scanDuration}ms)`);
        }
        catch (error) {
            this.metricsService.incrementCounter('periodic_scan_errors');
            this.logError('Periodic scan failed', error);
        }
    }
    async collectSystemMetrics() {
        try {
            const memUsage = process.memoryUsage();
            this.metricsService.recordGauge('memory_heap_used_mb', Math.round(memUsage.heapUsed / 1024 / 1024));
            this.metricsService.recordGauge('memory_heap_total_mb', Math.round(memUsage.heapTotal / 1024 / 1024));
            this.metricsService.recordGauge('memory_external_mb', Math.round(memUsage.external / 1024 / 1024));
            this.metricsService.recordGauge('uptime_seconds', Math.round(process.uptime()));
            const cacheStats = this.cacheService.getStats();
            this.metricsService.recordGauge('cache_size', cacheStats.keys);
            this.metricsService.recordGauge('cache_hit_rate', cacheStats.hitRate);
            this.metricsService.incrementCounter('system_metrics_collections');
        }
        catch (error) {
            this.metricsService.incrementCounter('system_metrics_errors');
            this.logError('Failed to collect system metrics', error);
        }
    }
    async flushFinalMetrics() {
        try {
            const memUsage = process.memoryUsage();
            this.metricsService.recordGauge('final_memory_heap_used_mb', Math.round(memUsage.heapUsed / 1024 / 1024));
            this.metricsService.recordGauge('final_uptime_seconds', Math.round(process.uptime()));
            const cacheStats = this.cacheService.getStats();
            this.metricsService.recordGauge('final_cache_size', cacheStats.keys);
            this.metricsService.recordGauge('final_cache_hit_rate', cacheStats.hitRate);
            await this.cacheService.set('final_scan_time', Date.now(), 3600);
            this.logInfo('Final metrics flushed successfully');
        }
        catch (error) {
            this.logError('Failed to flush final metrics', error);
        }
    }
    async getHealthStatus() {
        try {
            const lastScanTime = await this.cacheService.get('last_scan_time');
            const now = Date.now();
            const uptime = Math.round(process.uptime());
            let status = 'healthy';
            if (!lastScanTime || now - lastScanTime > 10 * 60 * 1000) {
                status = 'unhealthy';
            }
            else if (now - lastScanTime > 6 * 60 * 1000) {
                status = 'degraded';
            }
            return {
                status,
                uptime,
                lastScan: lastScanTime,
                metrics: this.metricsService.getMetrics(),
                cache: this.cacheService.getStats(),
            };
        }
        catch (error) {
            this.logError('Failed to get health status', error);
            return {
                status: 'unhealthy',
                uptime: Math.round(process.uptime()),
                lastScan: null,
                metrics: null,
                cache: null,
            };
        }
    }
    mapProviderToInfo(wrapper) {
        const metadata = {};
        if (wrapper.metatype) {
            metadata.featureFlag = this.reflector.get('feature-flag', wrapper.metatype);
            metadata.analyticsEnabled = this.reflector.get('analytics-enabled', wrapper.metatype);
            metadata.domain = this.reflector.get('domain', wrapper.metatype);
            metadata.cacheable = this.reflector.get('cacheable', wrapper.metatype);
            metadata.rateLimit = this.reflector.get('rate-limit', wrapper.metatype);
            metadata.monitoringLevel = this.reflector.get('monitoring-level', wrapper.metatype);
            metadata.experimentalFeature =
                this.discoveryService.getMetadataByDecorator(metadata_decorator_1.ExperimentalFeature, wrapper);
        }
        return {
            name: wrapper.name || wrapper.token?.toString() || 'Unknown',
            instance: wrapper.instance,
            token: wrapper.token,
            metadata: Object.fromEntries(Object.entries(metadata).filter(([_, value]) => value !== undefined)),
        };
    }
    mapControllerToInfo(wrapper) {
        const metadata = {};
        if (wrapper.metatype) {
            metadata.featureFlag = this.reflector.get('feature-flag', wrapper.metatype);
            metadata.analyticsEnabled = this.reflector.get('analytics-enabled', wrapper.metatype);
            metadata.domain = this.reflector.get('domain', wrapper.metatype);
            metadata.monitoringLevel = this.reflector.get('monitoring-level', wrapper.metatype);
        }
        return {
            name: wrapper.name || wrapper.token?.toString() || 'Unknown',
            instance: wrapper.instance,
            metadata: Object.fromEntries(Object.entries(metadata).filter(([_, value]) => value !== undefined)),
        };
    }
};
exports.DiscoveryExampleService = DiscoveryExampleService;
exports.DiscoveryExampleService = DiscoveryExampleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        core_1.DiscoveryService,
        core_1.MetadataScanner,
        core_1.Reflector,
        discovery_metrics_service_1.DiscoveryMetricsService,
        discovery_cache_service_1.DiscoveryCacheService])
], DiscoveryExampleService);
//# sourceMappingURL=discovery-example.service.js.map