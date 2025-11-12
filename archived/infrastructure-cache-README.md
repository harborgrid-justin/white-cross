# Redis Cache Service

Comprehensive enterprise-grade caching solution for NestJS backend with Redis, multi-tier support, cache warming, rate limiting, and advanced monitoring.

## Features

- **Redis Integration**: Distributed caching with automatic reconnection and connection pooling
- **Multi-Tier Caching**: L1 (memory) + L2 (Redis) for optimal performance
- **Cache Invalidation**: Tag-based, prefix-based, pattern-based, and cascade invalidation
- **Cache Warming**: Scheduled, on-demand, lazy, and priority-based warming strategies
- **Rate Limiting**: Token bucket algorithm with per-user and per-endpoint limits
- **Compression**: Automatic compression for large values
- **Monitoring**: Comprehensive statistics, health checks, and Prometheus metrics
- **Type Safety**: Full TypeScript support with generics
- **Error Handling**: Graceful degradation and fallback strategies

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Basic Usage](#basic-usage)
- [Advanced Features](#advanced-features)
- [Service Integration Examples](#service-integration-examples)
- [Cache Warming](#cache-warming)
- [Rate Limiting](#rate-limiting)
- [Monitoring](#monitoring)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)

## Installation

1. **Install Dependencies**:
```bash
npm install ioredis @nestjs/redis @nestjs/event-emitter @nestjs/schedule
```

2. **Import Module**:
```typescript
// app.module.ts
import { CacheModule } from './infrastructure/cache';

@Module({
  imports: [
    CacheModule,
    // ... other modules
  ],
})
export class AppModule {}
```

## Configuration

### Environment Variables

```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL_DEFAULT=300
REDIS_CONNECTION_TIMEOUT=5000
REDIS_MAX_RETRIES=3
REDIS_RETRY_DELAY=1000

# Cache Configuration
CACHE_KEY_PREFIX=cache
CACHE_ENABLE_COMPRESSION=true
CACHE_COMPRESSION_THRESHOLD=1024
CACHE_ENABLE_L1=true
CACHE_L1_MAX_SIZE=1000
CACHE_L1_TTL=60
CACHE_ENABLE_LOGGING=false

# Cache Warming
CACHE_WARMING_ENABLED=true

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

## Basic Usage

### Simple Get/Set Operations

```typescript
import { Injectable } from '@nestjs/common';
import { CacheService } from './infrastructure/cache';

@Injectable()
export class UserService {
  constructor(private readonly cacheService: CacheService) {}

  async getUser(id: string) {
    // Try to get from cache
    const cached = await this.cacheService.get<User>(`user:${id}`);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const user = await this.userRepository.findOne(id);

    // Cache the result (5 minutes TTL)
    await this.cacheService.set(`user:${id}`, user, {
      ttl: 300,
      tags: ['user', `user:${id}`],
    });

    return user;
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const user = await this.userRepository.update(id, data);

    // Invalidate cache
    await this.cacheService.invalidate({
      type: 'tag',
      value: `user:${id}`,
    });

    return user;
  }
}
```

### Namespace and Tags

```typescript
// Organize cache keys with namespaces
await this.cacheService.set('profile', userData, {
  namespace: 'user:123',
  ttl: 600,
  tags: ['user', 'profile'],
});

// Retrieve with namespace
const profile = await this.cacheService.get('profile', {
  namespace: 'user:123',
});

// Invalidate all user-related caches
await this.cacheService.invalidate({
  type: 'tag',
  value: 'user',
});
```

### Batch Operations

```typescript
// Get multiple keys at once
const users = await this.cacheService.mget<User>([
  'user:1',
  'user:2',
  'user:3',
]);

// Set multiple keys at once
await this.cacheService.mset([
  { key: 'user:1', value: user1 },
  { key: 'user:2', value: user2 },
  { key: 'user:3', value: user3 },
], { ttl: 300 });

// Delete multiple keys
await this.cacheService.mdel(['user:1', 'user:2', 'user:3']);
```

### Atomic Operations

```typescript
// Increment counter
const views = await this.cacheService.increment('page:views', 1, { ttl: 3600 });

// Decrement counter
const remaining = await this.cacheService.decrement('quota:remaining', 1);
```

## Advanced Features

### Cache Invalidation Patterns

```typescript
// By specific key
await this.cacheService.invalidate({
  type: 'key',
  value: 'user:123',
});

// By prefix
await this.cacheService.invalidate({
  type: 'prefix',
  value: 'user:',
});

// By tag
await this.cacheService.invalidate({
  type: 'tag',
  value: 'user',
});

// By pattern (supports wildcards)
await this.cacheService.invalidate({
  type: 'pattern',
  value: 'user:*:profile',
});

// Cascade (invalidate key and all related keys)
await this.cacheService.invalidate({
  type: 'cascade',
  value: 'organization:123',
});
```

### Compression

```typescript
// Automatic compression for large values
await this.cacheService.set('large-dataset', bigData, {
  compress: true,  // Force compression
  ttl: 3600,
});

// Compression is automatic if value exceeds threshold (default: 1024 bytes)
```

### L1 Cache Control

```typescript
// Skip L1 cache for volatile data
await this.cacheService.set('real-time-data', data, {
  skipL1: true,  // Only cache in Redis (L2)
  ttl: 60,
});
```

## Service Integration Examples

### 1. Medication Reminder Processor

```typescript
import { Injectable } from '@nestjs/common';
import { CacheService } from '../../infrastructure/cache';

@Injectable()
export class MedicationReminderProcessor {
  constructor(private readonly cacheService: CacheService) {}

  async getMedicationReminders(date: Date, organizationId?: string) {
    const cacheKey = `reminders:${date.toISOString().split('T')[0]}:${organizationId || 'all'}`;

    // Check cache first
    const cached = await this.cacheService.get<MedicationReminder[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate reminders
    const reminders = await this.generateReminders(date, organizationId);

    // Cache for 1 hour with tags
    await this.cacheService.set(cacheKey, reminders, {
      ttl: 3600,
      tags: ['reminders', 'medication', organizationId ? `org:${organizationId}` : 'all'],
    });

    return reminders;
  }

  async invalidateReminders(studentId: string) {
    // Invalidate all reminders for this student
    await this.cacheService.invalidate({
      type: 'tag',
      value: `student:${studentId}`,
    });
  }
}
```

### 2. Analytics Service

```typescript
import { Injectable } from '@nestjs/common';
import { CacheService, CacheWarmingService } from '../../infrastructure/cache';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly warmingService: CacheWarmingService,
  ) {
    // Register warming strategy for dashboard
    this.warmingService.registerStrategy({
      name: 'dashboard-metrics',
      type: 'scheduled',
      priority: 10,
      schedule: '0 */5 * * * *', // Every 5 minutes
      ttl: 300,
      loader: async () => {
        const schools = await this.getActiveSchools();
        return schools.map(school => ({
          key: `dashboard:${school.id}`,
          value: this.generateDashboardMetrics(school.id),
          options: { tags: ['dashboard', `school:${school.id}`] },
        }));
      },
    });
  }

  async getDashboardMetrics(schoolId: string) {
    const cacheKey = `dashboard:${schoolId}`;

    // Try cache first
    let metrics = await this.cacheService.get(cacheKey);
    if (!metrics) {
      // Generate and cache
      metrics = await this.generateDashboardMetrics(schoolId);
      await this.cacheService.set(cacheKey, metrics, {
        ttl: 300,
        tags: ['dashboard', `school:${schoolId}`],
      });
    }

    return metrics;
  }

  async getHealthTrends(query: GetHealthTrendsQueryDto) {
    const cacheKey = `trends:${query.schoolId}:${query.timePeriod}:${query.startDate}:${query.endDate}`;

    // Check cache
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate trends (expensive operation)
    const trends = await this.healthTrendService.getConditionTrends(
      query.schoolId,
      query.metrics,
      query.timePeriod,
    );

    // Cache for 15 minutes with compression (large dataset)
    await this.cacheService.set(cacheKey, trends, {
      ttl: 900,
      compress: true,
      tags: ['trends', `school:${query.schoolId}`],
    });

    return trends;
  }
}
```

### 3. Health Record Service

```typescript
import { Injectable } from '@nestjs/common';
import { CacheService } from '../../infrastructure/cache';

@Injectable()
export class HealthRecordService {
  constructor(private readonly cacheService: CacheService) {}

  async getStudentHealthRecords(studentId: string, page = 1, limit = 20) {
    const cacheKey = `health-records:${studentId}:${page}:${limit}`;

    // Try cache
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const records = await this.healthRecordRepository.find({
      where: { studentId },
      skip: (page - 1) * limit,
      take: limit,
      order: { recordDate: 'DESC' },
    });

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, records, {
      ttl: 300,
      tags: ['health-records', `student:${studentId}`],
    });

    return records;
  }

  async createHealthRecord(studentId: string, data: CreateHealthRecordDto) {
    const record = await this.healthRecordRepository.save({
      ...data,
      studentId,
    });

    // Invalidate all cached health records for this student
    await this.cacheService.invalidate({
      type: 'prefix',
      value: `health-records:${studentId}`,
    });

    return record;
  }

  async getHealthSummary(studentId: string) {
    const cacheKey = `health-summary:${studentId}`;

    // Check cache
    const cached = await this.cacheService.get<HealthSummary>(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate summary (aggregates multiple tables)
    const summary = await this.generateHealthSummary(studentId);

    // Cache for 10 minutes
    await this.cacheService.set(cacheKey, summary, {
      ttl: 600,
      tags: ['health-summary', `student:${studentId}`],
    });

    return summary;
  }
}
```

### 4. Appointment Service

```typescript
import { Injectable } from '@nestjs/common';
import { CacheService } from '../../infrastructure/cache';

@Injectable()
export class AppointmentService {
  constructor(private readonly cacheService: CacheService) {}

  async getUpcomingAppointments(nurseId: string) {
    const cacheKey = `appointments:upcoming:${nurseId}`;

    // Check cache
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch appointments
    const appointments = await this.appointmentRepository.find({
      where: {
        nurseId,
        status: 'SCHEDULED',
        appointmentDate: MoreThan(new Date()),
      },
      order: { appointmentDate: 'ASC' },
      take: 50,
    });

    // Cache for 2 minutes (frequently changing data)
    await this.cacheService.set(cacheKey, appointments, {
      ttl: 120,
      tags: ['appointments', `nurse:${nurseId}`],
    });

    return appointments;
  }

  async updateAppointmentStatus(id: string, status: string) {
    const appointment = await this.appointmentRepository.update(id, { status });

    // Invalidate related caches
    await this.cacheService.invalidate({
      type: 'tag',
      value: `nurse:${appointment.nurseId}`,
    });

    return appointment;
  }
}
```

### 5. Inventory Maintenance Processor

```typescript
import { Injectable } from '@nestjs/common';
import { CacheService } from '../../infrastructure/cache';

@Injectable()
export class InventoryMaintenanceProcessor {
  constructor(private readonly cacheService: CacheService) {}

  async getInventoryStatus(organizationId: string) {
    const cacheKey = `inventory:status:${organizationId}`;

    // Check cache
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Query inventory (expensive)
    const status = await this.calculateInventoryStatus(organizationId);

    // Cache for 15 minutes
    await this.cacheService.set(cacheKey, status, {
      ttl: 900,
      tags: ['inventory', `org:${organizationId}`],
    });

    return status;
  }

  async processInventoryMaintenance(organizationId: string) {
    // ... process inventory ...

    // Invalidate inventory cache
    await this.cacheService.invalidate({
      type: 'prefix',
      value: `inventory:`,
    });
  }
}
```

## Cache Warming

### Registering Warming Strategies

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CacheWarmingService } from './infrastructure/cache';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly warmingService: CacheWarmingService) {}

  onModuleInit() {
    // Scheduled warming (runs on cron schedule)
    this.warmingService.registerStrategy({
      name: 'daily-reports',
      type: 'scheduled',
      priority: 8,
      schedule: '0 0 6 * * *', // 6 AM daily
      ttl: 86400,
      loader: async () => {
        const reports = await this.generateDailyReports();
        return reports.map(report => ({
          key: `report:${report.id}`,
          value: report,
          options: { tags: ['reports'] },
        }));
      },
    });

    // Priority-based warming (runs on startup)
    this.warmingService.registerStrategy({
      name: 'critical-data',
      type: 'priority',
      priority: 10,
      ttl: 3600,
      loader: async () => {
        // Load critical data that should always be cached
        return [
          { key: 'config:app', value: await this.getAppConfig() },
          { key: 'config:features', value: await this.getFeatureFlags() },
        ];
      },
    });
  }
}
```

### Manual Warming

```typescript
// Warm specific strategy
await this.warmingService.warmByStrategy('daily-reports');

// Warm all strategies
await this.warmingService.warmAll();

// Warm only scheduled strategies
await this.warmingService.warmAll('scheduled');
```

## Rate Limiting

### Basic Rate Limiting

```typescript
import { Injectable } from '@nestjs/common';
import { RateLimiterService } from './infrastructure/cache';

@Injectable()
export class ApiService {
  constructor(private readonly rateLimiter: RateLimiterService) {
    // Register rate limit configuration
    this.rateLimiter.registerConfig('api-general', {
      max: 100,
      windowMs: 60000, // 1 minute
      keyGenerator: (req) => req.user?.id || req.ip,
    });

    // Stricter limit for expensive operations
    this.rateLimiter.registerConfig('api-analytics', {
      max: 10,
      windowMs: 60000,
      keyGenerator: (req) => req.user?.id,
      handler: async (req) => {
        this.logger.warn(`Rate limit exceeded for user ${req.user?.id}`);
      },
    });
  }

  async handleRequest(req: any) {
    const status = await this.rateLimiter.checkLimit('api-general', req);

    if (status.limited) {
      throw new TooManyRequestsException({
        message: 'Rate limit exceeded',
        retryAfter: status.retryAfter,
      });
    }

    // Process request
    return this.processRequest(req);
  }
}
```

### Rate Limiting Decorator

```typescript
import { SetMetadata } from '@nestjs/common';

export const RateLimit = (config: string) => SetMetadata('rateLimit', config);

// Use in controller
@Controller('analytics')
export class AnalyticsController {
  @Get('dashboard')
  @RateLimit('api-analytics')
  getDashboard() {
    // This endpoint is rate limited
  }
}

// Guard implementation
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly rateLimiter: RateLimiterService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const configName = this.reflector.get<string>('rateLimit', context.getHandler());
    if (!configName) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const status = await this.rateLimiter.checkLimit(configName, request);

    if (status.limited) {
      throw new TooManyRequestsException({
        message: 'Rate limit exceeded',
        retryAfter: status.retryAfter,
      });
    }

    // Add rate limit headers
    const response = context.switchToHttp().getResponse();
    response.header('X-RateLimit-Limit', status.limit);
    response.header('X-RateLimit-Remaining', status.remaining);
    response.header('X-RateLimit-Reset', status.resetAt);

    return true;
  }
}
```

## Monitoring

### Health Checks

```typescript
import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { CacheStatisticsService } from './infrastructure/cache';

@Injectable()
export class HealthController {
  constructor(private readonly cacheStats: CacheStatisticsService) {}

  @Get('health/cache')
  async checkCache(): Promise<HealthIndicatorResult> {
    return this.cacheStats.isHealthy('cache');
  }
}
```

### Prometheus Metrics

```typescript
@Controller('metrics')
export class MetricsController {
  constructor(private readonly cacheStats: CacheStatisticsService) {}

  @Get()
  async getMetrics(): Promise<string> {
    return this.cacheStats.getPrometheusMetrics();
  }
}
```

### Statistics Report

```typescript
@Controller('admin/cache')
export class CacheAdminController {
  constructor(private readonly cacheStats: CacheStatisticsService) {}

  @Get('stats')
  async getStats() {
    return this.cacheStats.getMetrics();
  }

  @Get('report')
  async getReport(): Promise<string> {
    return this.cacheStats.getReport();
  }

  @Post('reset-stats')
  async resetStats() {
    await this.cacheStats.resetStats();
    return { message: 'Statistics reset' };
  }
}
```

## Best Practices

### 1. Cache Key Patterns

```typescript
// Use hierarchical keys
cache:namespace:entity:id:attribute

// Examples:
cache:student:123:profile
cache:medication:456:reminders:2025-01-15
cache:analytics:school:789:dashboard
```

### 2. TTL Strategy

```typescript
// Hot data (frequently accessed, rarely changes)
await this.cacheService.set(key, data, { ttl: 3600 }); // 1 hour

// Warm data (moderately accessed)
await this.cacheService.set(key, data, { ttl: 900 }); // 15 minutes

// Cold data (infrequently accessed)
await this.cacheService.set(key, data, { ttl: 300 }); // 5 minutes

// Real-time data
await this.cacheService.set(key, data, { ttl: 60 }); // 1 minute
```

### 3. Tag Strategy

```typescript
// Use tags for granular invalidation
await this.cacheService.set(key, data, {
  ttl: 600,
  tags: [
    'entity-type',           // e.g., 'student', 'medication'
    `entity:${id}`,          // e.g., 'student:123'
    `organization:${orgId}`, // e.g., 'organization:456'
    'data-category',         // e.g., 'health-records'
  ],
});

// Invalidate all caches for a specific entity
await this.cacheService.invalidate({ type: 'tag', value: 'student:123' });
```

### 4. Error Handling

```typescript
async getCachedData<T>(key: string, loader: () => Promise<T>): Promise<T> {
  try {
    // Try cache first
    const cached = await this.cacheService.get<T>(key);
    if (cached) {
      return cached;
    }
  } catch (error) {
    this.logger.error('Cache get error', error);
    // Continue to loader on cache error
  }

  // Load data
  const data = await loader();

  try {
    // Try to cache
    await this.cacheService.set(key, data, { ttl: 300 });
  } catch (error) {
    this.logger.error('Cache set error', error);
    // Don't fail the request if caching fails
  }

  return data;
}
```

### 5. Compression Guidelines

```typescript
// Enable compression for large datasets
if (dataSize > 1024) {
  await this.cacheService.set(key, data, { compress: true, ttl: 600 });
}

// Or let automatic compression handle it
await this.cacheService.set(key, data, { ttl: 600 });
// Automatically compresses if > CACHE_COMPRESSION_THRESHOLD
```

## Migration Guide

### From Old Cache Service

The old in-memory cache service at `src/shared/cache/cache.service.ts` can coexist with the new Redis cache. To migrate:

1. **Install new cache module**:
```typescript
// app.module.ts
import { CacheModule } from './infrastructure/cache';

@Module({
  imports: [
    CacheModule, // Add this
    // Keep old modules for now
  ],
})
```

2. **Update service imports**:
```typescript
// Old
import { CacheService } from '../../../shared/cache/cache.service';

// New
import { CacheService } from '../../../infrastructure/cache';
```

3. **Update method calls**:
```typescript
// Old API
const data = this.cacheService.get<T>('key');
this.cacheService.set('key', data, 300, ['tag1']);
this.cacheService.invalidateByTag('tag1');

// New API (async)
const data = await this.cacheService.get<T>('key');
await this.cacheService.set('key', data, { ttl: 300, tags: ['tag1'] });
await this.cacheService.invalidate({ type: 'tag', value: 'tag1' });
```

4. **Test thoroughly** before removing old cache service.

## Performance Tuning

### L1 Cache Size

```bash
# Increase L1 cache for hot data
CACHE_L1_MAX_SIZE=5000  # Default: 1000
```

### Compression Threshold

```bash
# Adjust compression threshold based on your data
CACHE_COMPRESSION_THRESHOLD=2048  # Default: 1024 bytes
```

### Redis Connection Pool

```bash
# Adjust retry settings for unstable networks
REDIS_MAX_RETRIES=5
REDIS_RETRY_DELAY=2000
REDIS_CONNECTION_TIMEOUT=10000
```

## Troubleshooting

### Cache Misses

```typescript
// Check cache statistics
const stats = await this.cacheStats.getMetrics();
console.log(`Hit rate: ${stats.stats.hitRate}%`);

// Review cache warming strategies
const warmingStats = stats.warming;
console.log(`Strategies: ${warmingStats.strategies}`);
```

### Memory Issues

```typescript
// Check L1 cache usage
const stats = await this.cacheStats.getMetrics();
console.log(`L1 size: ${stats.stats.l1Size}/${config.l1MaxSize}`);
console.log(`Memory usage: ${stats.stats.memoryUsage} bytes`);

// Reduce L1 cache size if needed
CACHE_L1_MAX_SIZE=500
```

### Redis Connection Issues

```typescript
// Check health
const health = await this.cacheService.getHealth();
console.log(`Redis connected: ${health.redisConnected}`);
console.log(`Redis latency: ${health.redisLatency}ms`);

// Check logs for connection errors
```

## API Reference

See individual service files for complete API documentation:
- `cache.service.ts` - Core cache operations
- `cache-warming.service.ts` - Cache warming strategies
- `rate-limiter.service.ts` - Rate limiting
- `cache-statistics.service.ts` - Monitoring and health checks
- `cache.interfaces.ts` - TypeScript interfaces

## License

Internal use only - White Cross Healthcare Platform
