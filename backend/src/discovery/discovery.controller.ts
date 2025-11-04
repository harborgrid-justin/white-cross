import { 
  Controller, 
  Get, 
  Query, 
  Param, 
  UseGuards, 
  UsePipes, 
  ValidationPipe,
  UseFilters,
  UseInterceptors,
  ParseEnumPipe,
  DefaultValuePipe,
  ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { DiscoveryExampleService, ProviderInfo, ControllerInfo } from './discovery-example.service';
import { AdminDiscoveryGuard } from './guards/admin-discovery.guard';
import { DiscoveryRateLimitGuard } from './guards/discovery-rate-limit.guard';
import { DiscoveryExceptionFilter } from './filters/discovery-exception.filter';
import { DiscoveryLoggingInterceptor } from './interceptors/discovery-logging.interceptor';
import { DiscoveryCacheInterceptor } from './interceptors/discovery-cache.interceptor';
import { DiscoveryMetricsInterceptor } from './interceptors/discovery-metrics.interceptor';
import { AdminOnly } from './decorators/admin-only.decorator';
import { RateLimit, RateLimitModerate, RateLimitLenient } from './decorators/rate-limit.decorator';
import { CacheShort, CacheMedium, CacheLong } from './decorators/cache-config.decorator';
import { 
  ProviderQueryDto, 
  FeatureFlagQueryDto, 
  MonitoringQueryDto, 
  MetadataQueryDto 
} from './dto/provider-query.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ProviderType, MonitoringLevel } from './enums/provider-type.enum';

@ApiTags('Discovery')
@ApiBearerAuth()
@Controller('discovery')
@UseFilters(DiscoveryExceptionFilter)
@UseGuards(AdminDiscoveryGuard, DiscoveryRateLimitGuard)
@UseInterceptors(DiscoveryLoggingInterceptor, DiscoveryCacheInterceptor, DiscoveryMetricsInterceptor)
@UsePipes(new ValidationPipe({ 
  transform: true, 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
}))
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryExampleService) {}

  @Get('providers')
  @ApiOperation({ summary: 'Get all providers in the application' })
  @ApiResponse({ status: 200, description: 'List of all providers' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @RateLimitLenient()
  @CacheShort()
  getAllProviders(@Query() pagination: PaginationDto) {
    const providers = this.discoveryService.getAllProviders();
    
    // Apply pagination with defaults
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
      providers: paginatedProviders.map(p => ({
        name: p.name || p.token?.toString(),
        token: p.token?.toString(),
        hasInstance: !!p.instance,
      })),
    };
  }

  @Get('controllers')
  @ApiOperation({ summary: 'Get all controllers in the application' })
  @ApiResponse({ status: 200, description: 'List of all controllers' })
  @CacheShort()
  getAllControllers() {
    const controllers = this.discoveryService.getAllControllers();
    return {
      total: controllers.length,
      controllers: controllers.map(c => ({
        name: c.name || c.token?.toString(),
        token: c.token?.toString(),
        hasInstance: !!c.instance,
      })),
    };
  }

  @Get('providers/feature-flag/:flag')
  @ApiOperation({ summary: 'Get providers with specific feature flag' })
  @ApiParam({ name: 'flag', description: 'Feature flag to filter by' })
  @ApiResponse({ status: 200, description: 'List of providers with the specified feature flag' })
  @CacheMedium()
  getProvidersWithFeatureFlag(@Param('flag') flag: string): ProviderInfo[] {
    return this.discoveryService.getProvidersWithFeatureFlag(flag);
  }

  @Get('providers/experimental/:feature')
  @ApiOperation({ summary: 'Get providers with experimental features' })
  @ApiParam({ name: 'feature', description: 'Experimental feature to filter by' })
  @ApiResponse({ status: 200, description: 'List of experimental providers' })
  @CacheMedium()
  getExperimentalProviders(@Param('feature') feature: string): ProviderInfo[] {
    return this.discoveryService.getExperimentalProviders(feature);
  }

  @Get('providers/analytics')
  @ApiOperation({ summary: 'Get analytics-enabled providers' })
  @ApiResponse({ status: 200, description: 'List of analytics-enabled providers' })
  @CacheMedium()
  getAnalyticsProviders(): ProviderInfo[] {
    return this.discoveryService.getAnalyticsProviders();
  }

  @Get('providers/domain/:domain')
  @ApiOperation({ summary: 'Get providers by domain' })
  @ApiParam({ name: 'domain', description: 'Domain to filter by' })
  @ApiResponse({ status: 200, description: 'List of providers in the specified domain' })
  @CacheMedium()
  getProvidersByDomain(@Param('domain') domain: string): ProviderInfo[] {
    return this.discoveryService.getProvidersByDomain(domain);
  }

  @Get('providers/cacheable')
  @ApiOperation({ summary: 'Get cacheable providers' })
  @ApiResponse({ status: 200, description: 'List of cacheable providers' })
  @CacheMedium()
  getCacheableProviders(): ProviderInfo[] {
    return this.discoveryService.getCacheableProviders();
  }

  @Get('providers/rate-limited')
  @ApiOperation({ summary: 'Get rate-limited providers' })
  @ApiResponse({ status: 200, description: 'List of rate-limited providers' })
  @CacheMedium()
  getRateLimitedProviders(): ProviderInfo[] {
    return this.discoveryService.getRateLimitedProviders();
  }

  @Get('providers/monitored')
  @ApiOperation({ summary: 'Get monitored providers' })
  @ApiQuery({ name: 'level', required: false, enum: ['basic', 'detailed'] })
  @ApiResponse({ status: 200, description: 'List of monitored providers' })
  @CacheMedium()
  getMonitoredProviders(@Query('level') level?: 'basic' | 'detailed'): ProviderInfo[] {
    return this.discoveryService.getMonitoredProviders(level);
  }

  @Get('controllers/metadata')
  @ApiOperation({ summary: 'Get controllers with specific metadata' })
  @ApiQuery({ name: 'key', description: 'Metadata key to filter by' })
  @ApiQuery({ name: 'value', required: false, description: 'Metadata value to filter by' })
  @ApiResponse({ status: 200, description: 'List of controllers with the specified metadata' })
  @CacheShort()
  getControllersWithMetadata(
    @Query('key') metadataKey: string,
    @Query('value') metadataValue?: string,
  ): ControllerInfo[] {
    return this.discoveryService.getControllersWithMetadata(metadataKey, metadataValue);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get discovery summary (Admin only)' })
  @ApiResponse({ status: 200, description: 'Summary of discovery findings' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @AdminOnly('admin')
  @RateLimitModerate()
  @CacheShort()
  getDiscoverySummary() {
    const allProviders = this.discoveryService.getAllProviders();
    const allControllers = this.discoveryService.getAllControllers();
    
    const experimentalProviders = this.discoveryService.getProvidersWithFeatureFlag('experimental');
    const analyticsProviders = this.discoveryService.getAnalyticsProviders();
    const cacheableProviders = this.discoveryService.getCacheableProviders();
    const rateLimitedProviders = this.discoveryService.getRateLimitedProviders();
    const monitoredProviders = this.discoveryService.getMonitoredProviders();
    
    // Get unique domains
    const domains = new Set<string>();
    allProviders.forEach(provider => {
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
        experimentalProviders: experimentalProviders.map(p => p.name),
        analyticsProviders: analyticsProviders.map(p => p.name),
        cacheableProviders: cacheableProviders.map(p => p.name),
        rateLimitedProviders: rateLimitedProviders.map(p => p.name),
        monitoredProviders: monitoredProviders.map(p => p.name),
      },
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Get discovery service health status' })
  @ApiResponse({ status: 200, description: 'Health status of discovery service' })
  @ApiResponse({ status: 503, description: 'Service unhealthy' })
  async getHealthStatus() {
    const health = await this.discoveryService.getHealthStatus();
    
    // Return appropriate HTTP status
    if (health.status === 'unhealthy') {
      // Note: In a real app, you might throw an HttpException here
      // but for demo purposes, we'll return the status in the response
    }
    
    return {
      status: health.status,
      timestamp: new Date().toISOString(),
      uptime: health.uptime,
      lastScan: health.lastScan ? new Date(health.lastScan).toISOString() : null,
      service: 'discovery',
      version: '2.0.0',
      details: {
        metrics: health.metrics ? 'available' : 'unavailable',
        cache: health.cache ? 'available' : 'unavailable',
      },
    };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get discovery service metrics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Performance metrics for discovery service' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @AdminOnly('admin')
  @RateLimitModerate()
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

  @Get('metrics/prometheus')
  @ApiOperation({ summary: 'Get Prometheus-formatted metrics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Prometheus metrics format', schema: { type: 'string' } })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @AdminOnly('admin')
  @RateLimitModerate()
  async getPrometheusMetrics() {
    const health = await this.discoveryService.getHealthStatus();
    
    if (!health.metrics) {
      return '# No metrics available\n';
    }

    // Convert metrics to Prometheus format
    const lines: string[] = [];
    const timestamp = Date.now();
    
    // Add help and type information
    lines.push('# HELP discovery_uptime_seconds Process uptime in seconds');
    lines.push('# TYPE discovery_uptime_seconds gauge');
    lines.push(`discovery_uptime_seconds ${health.uptime} ${timestamp}`);
    
    // Add counters
    if (health.metrics.counters) {
      for (const [name, counter] of Object.entries(health.metrics.counters)) {
        const metricName = `discovery_${name}_total`;
        lines.push(`# HELP ${metricName} Total count of ${name}`);
        lines.push(`# TYPE ${metricName} counter`);
        lines.push(`${metricName} ${(counter as any)?.value || 0} ${timestamp}`);
      }
    }
    
    // Add gauges
    if (health.metrics.gauges) {
      for (const [name, gauge] of Object.entries(health.metrics.gauges)) {
        const metricName = `discovery_${name}`;
        lines.push(`# HELP ${metricName} Current value of ${name}`);
        lines.push(`# TYPE ${metricName} gauge`);
        lines.push(`${metricName} ${(gauge as any)?.value || 0} ${timestamp}`);
      }
    }
    
    // Add histograms (simplified as summary for Prometheus compatibility)
    if (health.metrics.histograms) {
      for (const [name, histogram] of Object.entries(health.metrics.histograms)) {
        const metricName = `discovery_${name}`;
        const histData = histogram as any;
        lines.push(`# HELP ${metricName} Histogram of ${name}`);
        lines.push(`# TYPE ${metricName} histogram`);
        lines.push(`${metricName}_count ${histData?.count || 0} ${timestamp}`);
        lines.push(`${metricName}_sum ${histData?.sum || 0} ${timestamp}`);
        if (histData?.avg) {
          lines.push(`${metricName}_avg ${histData.avg} ${timestamp}`);
        }
      }
    }
    
    // Add cache metrics
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

  @Get('debug/cache')
  @ApiOperation({ summary: 'Get cache debug information (Admin only)' })
  @ApiResponse({ status: 200, description: 'Cache debug information' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @AdminOnly('admin')
  @RateLimit({ limit: 5, windowMs: 60000 }) // Very restrictive for debug endpoint
  async getCacheDebug() {
    const health = await this.discoveryService.getHealthStatus();
    
    return {
      timestamp: new Date().toISOString(),
      cache: health.cache || {},
      // Note: In production, you might want to limit the amount of debug info exposed
      warning: 'This endpoint provides internal cache state for debugging purposes',
    };
  }

  @Get('debug/system')
  @ApiOperation({ summary: 'Get system debug information (Admin only)' })
  @ApiResponse({ status: 200, description: 'System debug information' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @AdminOnly('admin')
  @RateLimit({ limit: 5, windowMs: 60000 }) // Very restrictive for debug endpoint
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
}
