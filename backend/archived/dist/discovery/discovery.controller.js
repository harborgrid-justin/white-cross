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
exports.DiscoveryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const discovery_example_service_1 = require("./discovery-example.service");
const admin_discovery_guard_1 = require("./guards/admin-discovery.guard");
const discovery_rate_limit_guard_1 = require("./guards/discovery-rate-limit.guard");
const discovery_exception_filter_1 = require("./filters/discovery-exception.filter");
const discovery_logging_interceptor_1 = require("./interceptors/discovery-logging.interceptor");
const discovery_cache_interceptor_1 = require("./interceptors/discovery-cache.interceptor");
const discovery_metrics_interceptor_1 = require("./interceptors/discovery-metrics.interceptor");
const admin_only_decorator_1 = require("./decorators/admin-only.decorator");
const rate_limit_decorator_1 = require("./decorators/rate-limit.decorator");
const cache_config_decorator_1 = require("./decorators/cache-config.decorator");
const pagination_dto_1 = require("./dto/pagination.dto");
const base_1 = require("../common/base");
let DiscoveryController = class DiscoveryController extends base_1.BaseController {
    discoveryService;
    constructor(discoveryService) {
        super();
        this.discoveryService = discoveryService;
    }
    getAllProviders(pagination) {
        const providers = this.discoveryService.getAllProviders();
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProviders = providers.slice(startIndex, endIndex);
        return {
            total: providers.length,
            page,
            limit,
            totalPages: Math.ceil(providers.length / limit),
            providers: paginatedProviders.map((p) => ({
                name: p.name || p.token?.toString(),
                token: p.token?.toString(),
                hasInstance: !!p.instance,
            })),
        };
    }
    getAllControllers() {
        const controllers = this.discoveryService.getAllControllers();
        return {
            total: controllers.length,
            controllers: controllers.map((c) => ({
                name: c.name || c.token?.toString(),
                token: c.token?.toString(),
                hasInstance: !!c.instance,
            })),
        };
    }
    getProvidersWithFeatureFlag(flag) {
        return this.discoveryService.getProvidersWithFeatureFlag(flag);
    }
    getExperimentalProviders(feature) {
        return this.discoveryService.getExperimentalProviders(feature);
    }
    getAnalyticsProviders() {
        return this.discoveryService.getAnalyticsProviders();
    }
    getProvidersByDomain(domain) {
        return this.discoveryService.getProvidersByDomain(domain);
    }
    getCacheableProviders() {
        return this.discoveryService.getCacheableProviders();
    }
    getRateLimitedProviders() {
        return this.discoveryService.getRateLimitedProviders();
    }
    getMonitoredProviders(level) {
        return this.discoveryService.getMonitoredProviders(level);
    }
    getControllersWithMetadata(metadataKey, metadataValue) {
        return this.discoveryService.getControllersWithMetadata(metadataKey, metadataValue);
    }
    getDiscoverySummary() {
        const allProviders = this.discoveryService.getAllProviders();
        const allControllers = this.discoveryService.getAllControllers();
        const experimentalProviders = this.discoveryService.getProvidersWithFeatureFlag('experimental');
        const analyticsProviders = this.discoveryService.getAnalyticsProviders();
        const cacheableProviders = this.discoveryService.getCacheableProviders();
        const rateLimitedProviders = this.discoveryService.getRateLimitedProviders();
        const monitoredProviders = this.discoveryService.getMonitoredProviders();
        const domains = new Set();
        allProviders.forEach((provider) => {
            const providerInfo = this.discoveryService.getProviderDetails(provider.token);
            if (providerInfo?.metadata.domain) {
                domains.add(providerInfo.metadata.domain);
            }
        });
        return {
            totals: {
                providers: allProviders.length,
                controllers: allControllers.length,
                domains: domains.size,
            },
            categories: {
                experimental: experimentalProviders.length,
                analytics: analyticsProviders.length,
                cacheable: cacheableProviders.length,
                rateLimited: rateLimitedProviders.length,
                monitored: monitoredProviders.length,
            },
            domains: Array.from(domains),
            examples: {
                experimentalProviders: experimentalProviders.map((p) => p.name),
                analyticsProviders: analyticsProviders.map((p) => p.name),
                cacheableProviders: cacheableProviders.map((p) => p.name),
                rateLimitedProviders: rateLimitedProviders.map((p) => p.name),
                monitoredProviders: monitoredProviders.map((p) => p.name),
            },
        };
    }
    async getHealthStatus() {
        const health = await this.discoveryService.getHealthStatus();
        if (health.status === 'unhealthy') {
        }
        return {
            status: health.status,
            timestamp: new Date().toISOString(),
            uptime: health.uptime,
            lastScan: health.lastScan
                ? new Date(health.lastScan).toISOString()
                : null,
            service: 'discovery',
            version: '2.0.0',
            details: {
                metrics: health.metrics ? 'available' : 'unavailable',
                cache: health.cache ? 'available' : 'unavailable',
            },
        };
    }
    async getMetrics() {
        const health = await this.discoveryService.getHealthStatus();
        const currentTime = Date.now();
        return {
            timestamp: new Date().toISOString(),
            service: 'discovery',
            version: '2.0.0',
            uptime: health.uptime,
            status: health.status,
            metrics: health.metrics || {},
            cache: health.cache || {},
            system: {
                memory: {
                    heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                    heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                    external: Math.round(process.memoryUsage().external / 1024 / 1024),
                    rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
                },
                process: {
                    pid: process.pid,
                    uptime: Math.round(process.uptime()),
                    nodeVersion: process.version,
                },
            },
        };
    }
    async getPrometheusMetrics() {
        const health = await this.discoveryService.getHealthStatus();
        if (!health.metrics) {
            return '# No metrics available\n';
        }
        const lines = [];
        const timestamp = Date.now();
        lines.push('# HELP discovery_uptime_seconds Process uptime in seconds');
        lines.push('# TYPE discovery_uptime_seconds gauge');
        lines.push(`discovery_uptime_seconds ${health.uptime} ${timestamp}`);
        if (health.metrics.counters) {
            for (const [name, counter] of Object.entries(health.metrics.counters)) {
                const metricName = `discovery_${name}_total`;
                lines.push(`# HELP ${metricName} Total count of ${name}`);
                lines.push(`# TYPE ${metricName} counter`);
                lines.push(`${metricName} ${counter?.value || 0} ${timestamp}`);
            }
        }
        if (health.metrics.gauges) {
            for (const [name, gauge] of Object.entries(health.metrics.gauges)) {
                const metricName = `discovery_${name}`;
                lines.push(`# HELP ${metricName} Current value of ${name}`);
                lines.push(`# TYPE ${metricName} gauge`);
                lines.push(`${metricName} ${gauge?.value || 0} ${timestamp}`);
            }
        }
        if (health.metrics.histograms) {
            for (const [name, histogram] of Object.entries(health.metrics.histograms)) {
                const metricName = `discovery_${name}`;
                const histData = histogram;
                lines.push(`# HELP ${metricName} Histogram of ${name}`);
                lines.push(`# TYPE ${metricName} histogram`);
                lines.push(`${metricName}_count ${histData?.count || 0} ${timestamp}`);
                lines.push(`${metricName}_sum ${histData?.sum || 0} ${timestamp}`);
                if (histData?.avg) {
                    lines.push(`${metricName}_avg ${histData.avg} ${timestamp}`);
                }
            }
        }
        if (health.cache) {
            lines.push('# HELP discovery_cache_hits_total Total cache hits');
            lines.push('# TYPE discovery_cache_hits_total counter');
            lines.push(`discovery_cache_hits_total ${health.cache.hits || 0} ${timestamp}`);
            lines.push('# HELP discovery_cache_misses_total Total cache misses');
            lines.push('# TYPE discovery_cache_misses_total counter');
            lines.push(`discovery_cache_misses_total ${health.cache.misses || 0} ${timestamp}`);
            lines.push('# HELP discovery_cache_keys Current number of cache keys');
            lines.push('# TYPE discovery_cache_keys gauge');
            lines.push(`discovery_cache_keys ${health.cache.keys || 0} ${timestamp}`);
            lines.push('# HELP discovery_cache_hit_rate Current cache hit rate');
            lines.push('# TYPE discovery_cache_hit_rate gauge');
            lines.push(`discovery_cache_hit_rate ${health.cache.hitRate || 0} ${timestamp}`);
        }
        return lines.join('\n') + '\n';
    }
    async getCacheDebug() {
        const health = await this.discoveryService.getHealthStatus();
        return {
            timestamp: new Date().toISOString(),
            cache: health.cache || {},
            warning: 'This endpoint provides internal cache state for debugging purposes',
        };
    }
    getSystemDebug() {
        const memUsage = process.memoryUsage();
        return {
            timestamp: new Date().toISOString(),
            process: {
                pid: process.pid,
                ppid: process.ppid,
                platform: process.platform,
                arch: process.arch,
                nodeVersion: process.version,
                uptime: Math.round(process.uptime()),
                cwd: process.cwd(),
                execPath: process.execPath,
            },
            memory: {
                rss: Math.round(memUsage.rss / 1024 / 1024),
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
                external: Math.round(memUsage.external / 1024 / 1024),
                arrayBuffers: Math.round(memUsage.arrayBuffers / 1024 / 1024),
            },
            environment: {
                nodeEnv: process.env.NODE_ENV || 'development',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            warning: 'This endpoint provides internal system state for debugging purposes',
        };
    }
};
exports.DiscoveryController = DiscoveryController;
__decorate([
    (0, common_1.Get)('providers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all providers in the application' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all providers' }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page',
    }),
    (0, rate_limit_decorator_1.RateLimitLenient)(),
    (0, cache_config_decorator_1.CacheShort)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], DiscoveryController.prototype, "getAllProviders", null);
__decorate([
    (0, common_1.Get)('controllers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all controllers in the application' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all controllers' }),
    (0, cache_config_decorator_1.CacheShort)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiscoveryController.prototype, "getAllControllers", null);
__decorate([
    (0, common_1.Get)('providers/feature-flag/:flag'),
    (0, swagger_1.ApiOperation)({ summary: 'Get providers with specific feature flag' }),
    (0, swagger_1.ApiParam)({ name: 'flag', description: 'Feature flag to filter by' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of providers with the specified feature flag',
    }),
    (0, cache_config_decorator_1.CacheMedium)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('flag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], DiscoveryController.prototype, "getProvidersWithFeatureFlag", null);
__decorate([
    (0, common_1.Get)('providers/experimental/:feature'),
    (0, swagger_1.ApiOperation)({ summary: 'Get providers with experimental features' }),
    (0, swagger_1.ApiParam)({
        name: 'feature',
        description: 'Experimental feature to filter by',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of experimental providers' }),
    (0, cache_config_decorator_1.CacheMedium)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('feature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], DiscoveryController.prototype, "getExperimentalProviders", null);
__decorate([
    (0, common_1.Get)('providers/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics-enabled providers' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of analytics-enabled providers',
    }),
    (0, cache_config_decorator_1.CacheMedium)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], DiscoveryController.prototype, "getAnalyticsProviders", null);
__decorate([
    (0, common_1.Get)('providers/domain/:domain'),
    (0, swagger_1.ApiOperation)({ summary: 'Get providers by domain' }),
    (0, swagger_1.ApiParam)({ name: 'domain', description: 'Domain to filter by' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of providers in the specified domain',
    }),
    (0, cache_config_decorator_1.CacheMedium)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('domain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], DiscoveryController.prototype, "getProvidersByDomain", null);
__decorate([
    (0, common_1.Get)('providers/cacheable'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cacheable providers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of cacheable providers' }),
    (0, cache_config_decorator_1.CacheMedium)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], DiscoveryController.prototype, "getCacheableProviders", null);
__decorate([
    (0, common_1.Get)('providers/rate-limited'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rate-limited providers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of rate-limited providers' }),
    (0, cache_config_decorator_1.CacheMedium)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], DiscoveryController.prototype, "getRateLimitedProviders", null);
__decorate([
    (0, common_1.Get)('providers/monitored'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monitored providers' }),
    (0, swagger_1.ApiQuery)({ name: 'level', required: false, enum: ['basic', 'detailed'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of monitored providers' }),
    (0, cache_config_decorator_1.CacheMedium)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], DiscoveryController.prototype, "getMonitoredProviders", null);
__decorate([
    (0, common_1.Get)('controllers/metadata'),
    (0, swagger_1.ApiOperation)({ summary: 'Get controllers with specific metadata' }),
    (0, swagger_1.ApiQuery)({ name: 'key', description: 'Metadata key to filter by' }),
    (0, swagger_1.ApiQuery)({
        name: 'value',
        required: false,
        description: 'Metadata value to filter by',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of controllers with the specified metadata',
    }),
    (0, cache_config_decorator_1.CacheShort)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('key')),
    __param(1, (0, common_1.Query)('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Array)
], DiscoveryController.prototype, "getControllersWithMetadata", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get discovery summary (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Summary of discovery findings' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    (0, admin_only_decorator_1.AdminOnly)('admin'),
    (0, rate_limit_decorator_1.RateLimitModerate)(),
    (0, cache_config_decorator_1.CacheShort)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiscoveryController.prototype, "getDiscoverySummary", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Get discovery service health status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health status of discovery service',
    }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Service unhealthy' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "getHealthStatus", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get discovery service metrics (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Performance metrics for discovery service',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    (0, admin_only_decorator_1.AdminOnly)('admin'),
    (0, rate_limit_decorator_1.RateLimitModerate)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('metrics/prometheus'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Prometheus-formatted metrics (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prometheus metrics format',
        schema: { type: 'string' },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    (0, admin_only_decorator_1.AdminOnly)('admin'),
    (0, rate_limit_decorator_1.RateLimitModerate)(),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "getPrometheusMetrics", null);
__decorate([
    (0, common_1.Get)('debug/cache'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cache debug information (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cache debug information' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    (0, admin_only_decorator_1.AdminOnly)('admin'),
    (0, rate_limit_decorator_1.RateLimit)({ limit: 5, windowMs: 60000 }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "getCacheDebug", null);
__decorate([
    (0, common_1.Get)('debug/system'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system debug information (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System debug information' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    (0, admin_only_decorator_1.AdminOnly)('admin'),
    (0, rate_limit_decorator_1.RateLimit)({ limit: 5, windowMs: 60000 }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiscoveryController.prototype, "getSystemDebug", null);
exports.DiscoveryController = DiscoveryController = __decorate([
    (0, swagger_1.ApiTags)('Discovery'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('discovery'),
    (0, common_1.UseFilters)(discovery_exception_filter_1.DiscoveryExceptionFilter),
    (0, common_1.UseGuards)(admin_discovery_guard_1.AdminDiscoveryGuard, discovery_rate_limit_guard_1.DiscoveryRateLimitGuard),
    (0, common_1.UseInterceptors)(discovery_logging_interceptor_1.DiscoveryLoggingInterceptor, discovery_cache_interceptor_1.DiscoveryCacheInterceptor, discovery_metrics_interceptor_1.DiscoveryMetricsInterceptor),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    })),
    __metadata("design:paramtypes", [discovery_example_service_1.DiscoveryExampleService])
], DiscoveryController);
//# sourceMappingURL=discovery.controller.js.map