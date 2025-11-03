# Performance Services Usage Guide

## Overview
This guide explains how to use the new performance monitoring and optimization services in the White Cross healthcare platform.

---

## Connection Monitor Service

### Purpose
Monitors database connection pool health and provides real-time metrics.

### Injection
```typescript
import { ConnectionMonitorService } from '@/database/services/connection-monitor.service';

@Injectable()
export class YourService {
  constructor(
    private readonly connectionMonitor: ConnectionMonitorService
  ) {}
}
```

### Usage Examples

#### Get Current Metrics
```typescript
async getConnectionPoolStatus() {
  const metrics = await this.connectionMonitor.collectMetrics();

  return {
    active: metrics.active,
    idle: metrics.idle,
    waiting: metrics.waiting,
    utilization: `${metrics.utilizationPercent.toFixed(1)}%`
  };
}
```

#### Check Database Health
```typescript
async checkDatabaseHealth() {
  const health = await this.connectionMonitor.performHealthCheck();

  if (!health.isHealthy) {
    // Alert administrators
    this.alertService.sendAlert({
      level: 'critical',
      message: 'Database unhealthy',
      issues: health.issues
    });
  }

  return health;
}
```

#### Prometheus Metrics Endpoint
```typescript
@Get('/metrics/database')
async getDatabaseMetrics() {
  return this.connectionMonitor.getPrometheusMetrics();
}
```

---

## Query Logger Service

### Purpose
Tracks query performance, detects slow queries, and identifies N+1 patterns.

### Injection
```typescript
import { QueryLoggerService } from '@/database/services/query-logger.service';

@Injectable()
export class YourService {
  constructor(
    private readonly queryLogger: QueryLoggerService
  ) {}
}
```

### Usage Examples

#### Get Performance Report
```typescript
async getQueryPerformance() {
  const report = this.queryLogger.getPerformanceReport();

  console.log(`Total queries: ${report.totalQueries}`);
  console.log(`Slow queries: ${report.slowQueries.length}`);
  console.log(`Active queries: ${report.activeQueries}`);

  return report;
}
```

#### Monitor Slow Queries
```typescript
async getSlowQueries() {
  const slowQueries = this.queryLogger.getSlowQueries();

  // Send to monitoring system
  for (const query of slowQueries) {
    if (query.duration > 1000) { // > 1 second
      this.logger.warn(`Very slow query detected: ${query.duration}ms`, {
        sql: query.sql,
        model: query.model
      });
    }
  }

  return slowQueries;
}
```

#### Get Formatted Report
```typescript
async printPerformanceReport() {
  const report = this.queryLogger.getFormattedReport();
  console.log(report);

  // Output example:
  // === Query Performance Report ===
  // Total Queries Executed: 15432
  // Slow Queries (>500ms): 23
  // Active Queries: 3
  // ...
}
```

---

## Query Cache Service

### Purpose
Provides multi-tier caching for frequently accessed database queries.

### Injection
```typescript
import { QueryCacheService } from '@/database/services/query-cache.service';

@Injectable()
export class StudentService {
  constructor(
    private readonly queryCache: QueryCacheService,
    @InjectModel(Student) private readonly studentModel: typeof Student
  ) {}
}
```

### Usage Examples

#### Cache Student Queries
```typescript
async getStudentHealthRecords(studentId: string) {
  return await this.queryCache.findWithCache(
    HealthRecord,
    {
      where: { studentId },
      order: [['recordDate', 'DESC']],
      limit: 50
    },
    {
      ttl: 300, // Cache for 5 minutes
      keyPrefix: 'student_health',
      invalidateOn: ['create', 'update', 'destroy']
    }
  );
}
```

#### Cache Single Record
```typescript
async getStudent(id: string) {
  return await this.queryCache.findOneWithCache(
    Student,
    {
      where: { id },
      include: [
        { model: School, as: 'school' },
        { model: District, as: 'district' }
      ]
    },
    {
      ttl: 600, // Cache for 10 minutes
      keyPrefix: 'student_detail',
      invalidateOn: ['update']
    }
  );
}
```

#### Manually Invalidate Cache
```typescript
async updateStudentInformation(id: string, data: any) {
  // Update student
  await this.studentModel.update(data, { where: { id } });

  // Manually invalidate related caches
  await this.queryCache.invalidatePattern('student_detail');
  await this.queryCache.invalidatePattern('student_health');
}
```

#### Get Cache Statistics
```typescript
async getCacheStats() {
  const stats = this.queryCache.getStats();

  return {
    hitRate: `${(stats.hitRate * 100).toFixed(2)}%`,
    hits: stats.hits,
    misses: stats.misses,
    cacheSize: stats.localCacheSize
  };
}
```

---

## Health Check Endpoint Example

Create a comprehensive health check endpoint for monitoring:

```typescript
import { Controller, Get } from '@nestjs/common';
import { ConnectionMonitorService } from '@/database/services/connection-monitor.service';
import { QueryLoggerService } from '@/database/services/query-logger.service';
import { QueryCacheService } from '@/database/services/query-cache.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly connectionMonitor: ConnectionMonitorService,
    private readonly queryLogger: QueryLoggerService,
    private readonly queryCache: QueryCacheService
  ) {}

  @Get('/database')
  async getDatabaseHealth() {
    const poolMetrics = this.connectionMonitor.getMetrics();
    const healthStatus = this.connectionMonitor.getHealthStatus();
    const queryPerf = this.queryLogger.getPerformanceReport();
    const cacheStats = this.queryCache.getStats();

    return {
      status: healthStatus.isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),

      connectionPool: {
        active: poolMetrics?.active,
        idle: poolMetrics?.idle,
        waiting: poolMetrics?.waiting,
        utilization: poolMetrics?.utilizationPercent,
        max: poolMetrics?.max
      },

      health: {
        isHealthy: healthStatus.isHealthy,
        consecutiveFailures: healthStatus.consecutiveFailures,
        lastCheck: healthStatus.lastCheckTime,
        issues: healthStatus.issues
      },

      queryPerformance: {
        totalQueries: queryPerf.totalQueries,
        slowQueries: queryPerf.slowQueries.length,
        activeQueries: queryPerf.activeQueries
      },

      cache: {
        hitRate: `${(cacheStats.hitRate * 100).toFixed(2)}%`,
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        size: cacheStats.localCacheSize
      }
    };
  }

  @Get('/database/metrics')
  async getPrometheusMetrics() {
    const poolMetrics = this.connectionMonitor.getPrometheusMetrics();
    const queryMetrics = this.queryLogger.getPrometheusMetrics();

    return `${poolMetrics}\n\n${queryMetrics}`;
  }
}
```

---

## Monitoring Dashboard Setup

### Prometheus Configuration

Add to your `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'white-cross-database'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/health/database/metrics'
    scrape_interval: 30s
```

### Grafana Dashboard

Create panels for:

1. **Connection Pool Utilization**
   - Query: `db_pool_utilization_percent`
   - Type: Gauge
   - Alert: > 80%

2. **Active Connections**
   - Query: `db_pool_active_connections`
   - Type: Graph
   - Alert: > 18 (90% of max)

3. **Slow Query Count**
   - Query: `db_slow_queries_total`
   - Type: Counter
   - Alert: > 50/hour

4. **Cache Hit Rate**
   - Query: `(db_cache_hits / (db_cache_hits + db_cache_misses)) * 100`
   - Type: Gauge
   - Alert: < 70%

---

## Best Practices

### Caching
1. **Use appropriate TTL values:**
   - Static data (schools, districts): 1 hour (3600s)
   - Student data: 10 minutes (600s)
   - Health records: 5 minutes (300s)
   - Real-time data: Don't cache or use 30s

2. **Set up proper invalidation:**
   - Always include `invalidateOn` for mutable data
   - Manually invalidate on related updates
   - Test cache invalidation in development

3. **Monitor cache performance:**
   - Aim for >80% hit rate
   - Adjust TTL based on usage patterns
   - Clear cache if memory usage is high

### Query Optimization
1. **Review slow queries weekly:**
   - Check for missing indexes
   - Optimize complex queries
   - Add eager loading for N+1 patterns

2. **Use the query logger in development:**
   - Helps catch performance issues early
   - Identifies N+1 queries before production
   - Provides query statistics for optimization

### Connection Pool
1. **Monitor utilization daily:**
   - High utilization (>80%) indicates need for scaling
   - Many waiting requests indicates pool too small
   - Low utilization indicates pool too large

2. **Adjust pool size based on load:**
   - Development: 5-10 connections
   - Production (low traffic): 10-15 connections
   - Production (high traffic): 15-25 connections
   - Never exceed database max connections

---

## Troubleshooting

### High Connection Pool Utilization
```typescript
// Check current utilization
const metrics = await connectionMonitor.getMetrics();

if (metrics.utilizationPercent > 90) {
  // Options:
  // 1. Increase pool max in database.module.ts
  // 2. Optimize slow queries
  // 3. Implement query result caching
  // 4. Add read replicas
}
```

### Low Cache Hit Rate
```typescript
// Check cache stats
const stats = await queryCache.getStats();

if (stats.hitRate < 0.7) { // Less than 70%
  // Possible issues:
  // 1. TTL too short
  // 2. Cache size too small
  // 3. Too many cache invalidations
  // 4. Not enough cacheable queries
}
```

### Many Slow Queries
```typescript
// Get slow queries
const slowQueries = await queryLogger.getSlowQueries();

// Analyze patterns
const models = [...new Set(slowQueries.map(q => q.model))];
console.log('Models with slow queries:', models);

// Add indexes for frequently slow queries
// Optimize query structure
// Consider denormalization for complex joins
```

---

## Migration Checklist

- [ ] Run database migrations for new indexes
- [ ] Deploy new services to staging
- [ ] Configure monitoring endpoints
- [ ] Set up Prometheus scraping
- [ ] Create Grafana dashboards
- [ ] Configure alerting rules
- [ ] Test cache invalidation
- [ ] Verify connection pool configuration
- [ ] Monitor for 7 days
- [ ] Adjust thresholds based on metrics
- [ ] Deploy to production
- [ ] Update runbooks with new metrics

---

## Support

For issues or questions:
- Check logs: Connection pool, query performance, cache statistics
- Review metrics: Prometheus endpoints at `/health/database/metrics`
- Consult performance report: `/health/database`
- Check documentation: This file and PERFORMANCE_IMPROVEMENTS_SUMMARY.md
