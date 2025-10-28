# Monitoring Service

Comprehensive health monitoring and metrics collection service for the White Cross NestJS backend.

## Overview

The Monitoring Service provides production-ready monitoring capabilities including:

- **Health Checks**: Database, Redis, WebSocket, job queues, and external APIs
- **Metrics Collection**: CPU, memory, requests/sec, response times, and more
- **Alerting**: Configurable thresholds with severity levels
- **Performance Tracking**: Operation timings with P95/P99 percentiles
- **Log Aggregation**: In-memory log buffer with search and filtering
- **Dashboard**: Comprehensive monitoring dashboard with real-time data
- **Kubernetes Support**: Readiness and liveness probes for container orchestration

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Service                        │
├─────────────────────────────────────────────────────────────┤
│  Health Checks:                                              │
│  ├─ Database (connection pool monitoring)                    │
│  ├─ Redis/Cache (hit rate, size, evictions)                  │
│  ├─ WebSocket (connected clients, server status)             │
│  ├─ Job Queue (waiting, active, failed jobs)                 │
│  └─ External APIs (circuit breaker status)                   │
│                                                               │
│  Metrics Collection (30s interval):                          │
│  ├─ System: CPU, memory, process info                        │
│  └─ Performance: requests/sec, response times, component stats│
│                                                               │
│  Alerting System:                                            │
│  ├─ Configurable thresholds                                  │
│  ├─ Severity levels (INFO, WARNING, ERROR, CRITICAL)         │
│  └─ Alert acknowledgment and resolution                      │
│                                                               │
│  Performance Tracking:                                       │
│  ├─ Operation timings                                        │
│  ├─ Success/failure tracking                                 │
│  └─ P95/P99 percentile calculations                          │
│                                                               │
│  Log Aggregation:                                            │
│  ├─ In-memory buffer (10,000 entries)                        │
│  ├─ Level filtering                                          │
│  └─ Search and time-range queries                            │
└─────────────────────────────────────────────────────────────┘
```

## Installation

The monitoring module is already included in the application. No additional installation is required.

```typescript
// In app.module.ts
import { MonitoringModule } from './infrastructure/monitoring/monitoring.module';

@Module({
  imports: [
    MonitoringModule,
    // ... other modules
  ],
})
export class AppModule {}
```

## Configuration

### Environment Variables

Configure alert thresholds via environment variables:

```env
# Alert Configuration
ALERTS_ENABLED=true
ALERT_CPU_THRESHOLD=80              # CPU usage % (default: 80)
ALERT_MEMORY_THRESHOLD=85           # Memory usage % (default: 85)
ALERT_RESPONSE_TIME_THRESHOLD=5000  # Response time in ms (default: 5000)
ALERT_ERROR_RATE_THRESHOLD=5        # Error rate % (default: 5)
ALERT_DB_CONNECTION_THRESHOLD=90    # DB pool usage % (default: 90)
ALERT_FAILED_JOBS_THRESHOLD=100     # Failed jobs count (default: 100)

# Redis Configuration (for cache monitoring)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379
```

### Service Registration

Register optional services for comprehensive monitoring:

```typescript
// In app.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { MonitoringService } from './infrastructure/monitoring/monitoring.service';
import { CacheService } from './shared/cache/cache.service';
import { WebSocketService } from './infrastructure/websocket/websocket.service';
import { QueueManagerService } from './infrastructure/jobs/services/queue-manager.service';
import { CircuitBreakerService } from './integration/services/circuit-breaker.service';

@Module({
  imports: [MonitoringModule, ...],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly monitoringService: MonitoringService,
    private readonly cacheService: CacheService,
    private readonly websocketService: WebSocketService,
    private readonly queueManagerService: QueueManagerService,
    private readonly circuitBreakerService: CircuitBreakerService,
  ) {}

  onModuleInit() {
    // Register services for comprehensive monitoring
    this.monitoringService.setCacheService(this.cacheService);
    this.monitoringService.setWebSocketService(this.websocketService);
    this.monitoringService.setQueueManagerService(this.queueManagerService);
    this.monitoringService.setCircuitBreakerService(this.circuitBreakerService);
  }
}
```

## API Endpoints

### Health Endpoints

#### `GET /health`
Comprehensive health check with all component statuses.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0",
  "components": {
    "database": {
      "status": "healthy",
      "message": "Database connection is healthy",
      "details": {
        "connected": true,
        "responseTime": "5ms",
        "poolSize": 10,
        "activeConnections": 2,
        "idleConnections": 8,
        "poolUsage": "20.00%"
      }
    },
    "redis": {
      "status": "healthy",
      "message": "Redis cache is operational",
      "details": {
        "hitRate": "85.50%",
        "size": 250,
        "maxSize": 1000
      }
    },
    "websocket": {
      "status": "healthy",
      "message": "WebSocket server is operational",
      "details": {
        "connectedClients": 45
      }
    },
    "jobQueue": {
      "status": "healthy",
      "message": "Job queues are operational",
      "details": {
        "queueCount": 8,
        "waiting": 12,
        "active": 3,
        "completed": 1523,
        "failed": 5
      }
    },
    "externalAPIs": {
      "status": "healthy",
      "message": "External APIs are operational",
      "details": {
        "circuits": {
          "sis-integration": {
            "state": "CLOSED",
            "failures": 0
          }
        }
      }
    }
  }
}
```

#### `GET /health/ready`
Kubernetes readiness probe. Returns 200 if ready to serve traffic.

**Response:**
```json
{
  "ready": true,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "checks": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

#### `GET /health/live`
Kubernetes liveness probe. Returns 200 if process is alive.

**Response:**
```json
{
  "alive": true,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

### Monitoring Endpoints

#### `GET /monitoring/metrics`
Get comprehensive system and application metrics.

**Response:**
```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "system": {
    "cpu": {
      "usage": 45.23,
      "cores": 8,
      "loadAverage": [2.5, 2.3, 2.1]
    },
    "memory": {
      "total": 16777216000,
      "used": 8388608000,
      "free": 8388608000,
      "usagePercent": 50.0,
      "heapUsed": 128000000,
      "heapTotal": 256000000,
      "rss": 300000000
    },
    "process": {
      "uptime": 3600,
      "pid": 12345,
      "nodeVersion": "v18.17.0",
      "platform": "linux"
    }
  },
  "performance": {
    "requests": {
      "requestsPerSecond": 125.5,
      "averageResponseTime": 85.3,
      "p95ResponseTime": 250.0,
      "p99ResponseTime": 500.0,
      "totalRequests": 451500,
      "failedRequests": 1205,
      "successRate": 99.73
    },
    "database": {
      "activeConnections": 2,
      "idleConnections": 8,
      "averageQueryTime": 12.5,
      "slowQueries": 3
    },
    "cache": {
      "hitRate": 85.5,
      "hits": 12500,
      "misses": 2200,
      "size": 250,
      "memoryUsage": 52428800
    },
    "websocket": {
      "connectedClients": 45,
      "messagesPerSecond": 15.2,
      "totalMessages": 54780
    },
    "queue": {
      "waitingJobs": 12,
      "activeJobs": 3,
      "completedJobs": 1523,
      "failedJobs": 5,
      "averageProcessingTime": 2500
    }
  }
}
```

#### `GET /monitoring/dashboard`
Get complete monitoring dashboard data.

**Response:**
```json
{
  "status": {
    "health": "healthy",
    "uptime": 3600,
    "environment": "production",
    "version": "1.0.0"
  },
  "metrics": { /* same as /monitoring/metrics */ },
  "alerts": [
    {
      "id": "cpu-high-1736936400000",
      "severity": "warning",
      "title": "High CPU Usage",
      "message": "CPU usage is 85.23% (threshold: 80%)",
      "component": "system",
      "timestamp": "2025-01-15T10:30:00.000Z",
      "acknowledged": false
    }
  ],
  "recentPerformance": [
    {
      "operation": "user.create",
      "duration": 123,
      "timestamp": "2025-01-15T10:29:55.000Z",
      "success": true
    }
  ],
  "components": {
    "database": "healthy",
    "cache": "healthy",
    "websocket": "healthy",
    "queue": "healthy",
    "externalApis": "healthy"
  }
}
```

#### `GET /monitoring/alerts`
Get all active alerts.

**Response:**
```json
[
  {
    "id": "cpu-high-1736936400000",
    "severity": "warning",
    "title": "High CPU Usage",
    "message": "CPU usage is 85.23% (threshold: 80%)",
    "component": "system",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "acknowledged": false,
    "metadata": {
      "cpuUsage": 85.23
    }
  }
]
```

#### `POST /monitoring/alerts/:alertId/acknowledge`
Acknowledge an alert.

**Response:**
```json
{
  "message": "Alert cpu-high-1736936400000 acknowledged successfully",
  "statusCode": 200
}
```

#### `POST /monitoring/alerts/:alertId/resolve`
Resolve an alert.

**Response:**
```json
{
  "message": "Alert cpu-high-1736936400000 resolved successfully",
  "statusCode": 200
}
```

#### `GET /monitoring/performance?limit=100`
Get recent performance tracking entries.

**Query Parameters:**
- `limit` (optional): Maximum number of entries to return (default: 100)

**Response:**
```json
[
  {
    "operation": "user.create",
    "duration": 123,
    "timestamp": "2025-01-15T10:29:55.000Z",
    "success": true,
    "metadata": {
      "userId": "user-123"
    }
  }
]
```

#### `POST /monitoring/performance`
Track a performance entry.

**Request Body:**
```json
{
  "operation": "user.create",
  "duration": 123,
  "timestamp": "2025-01-15T10:29:55.000Z",
  "success": true,
  "metadata": {
    "userId": "user-123"
  }
}
```

#### `GET /monitoring/logs`
Query aggregated log entries.

**Query Parameters:**
- `level` (optional): Filter by log level (debug, info, warn, error, fatal)
- `context` (optional): Filter by context/module name
- `startTime` (optional): Filter logs after this timestamp
- `endTime` (optional): Filter logs before this timestamp
- `limit` (optional): Maximum number of entries to return
- `search` (optional): Search query for message content

**Example:**
```bash
GET /monitoring/logs?level=error&limit=100&search=database
```

**Response:**
```json
[
  {
    "level": "error",
    "message": "Database connection timeout",
    "timestamp": "2025-01-15T10:29:55.000Z",
    "context": "DatabaseModule",
    "stack": "Error: Connection timeout...",
    "metadata": {
      "connectionId": "conn-123"
    }
  }
]
```

#### `GET /monitoring/metrics/system`
Get system-level metrics only (CPU, memory, process).

#### `GET /monitoring/metrics/performance`
Get application performance metrics only.

## Usage Examples

### Track Request Performance

```typescript
import { MonitoringService } from './infrastructure/monitoring/monitoring.service';

@Injectable()
export class UserService {
  constructor(private readonly monitoringService: MonitoringService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const startTime = Date.now();

    try {
      const user = await this.userRepository.create(data);

      // Track successful request
      const duration = Date.now() - startTime;
      this.monitoringService.trackRequest(duration, true);

      // Track performance entry with metadata
      this.monitoringService.trackPerformance({
        operation: 'user.create',
        duration,
        timestamp: new Date().toISOString(),
        success: true,
        metadata: { userId: user.id },
      });

      return user;
    } catch (error) {
      // Track failed request
      const duration = Date.now() - startTime;
      this.monitoringService.trackRequest(duration, false);

      this.monitoringService.trackPerformance({
        operation: 'user.create',
        duration,
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message,
      });

      throw error;
    }
  }
}
```

### Access Metrics Programmatically

```typescript
import { MonitoringService } from './infrastructure/monitoring/monitoring.service';

@Injectable()
export class AdminService {
  constructor(private readonly monitoringService: MonitoringService) {}

  async getSystemHealth() {
    // Get comprehensive health check
    const health = await this.monitoringService.performHealthCheck();

    // Get current metrics
    const metrics = await this.monitoringService.collectMetrics();

    // Get active alerts
    const alerts = this.monitoringService.getActiveAlerts();

    return { health, metrics, alerts };
  }
}
```

### Create Global Request Interceptor

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonitoringService } from './infrastructure/monitoring/monitoring.service';

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  constructor(private readonly monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap({
        next: () => {
          // Success
          const duration = Date.now() - startTime;
          this.monitoringService.trackRequest(duration, true);
        },
        error: () => {
          // Error
          const duration = Date.now() - startTime;
          this.monitoringService.trackRequest(duration, false);
        },
      }),
    );
  }
}

// Register globally in main.ts
app.useGlobalInterceptors(new MonitoringInterceptor(app.get(MonitoringService)));
```

## Kubernetes Integration

### Deployment Configuration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: white-cross-backend
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: backend
        image: white-cross-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: ALERTS_ENABLED
          value: "true"
        - name: ALERT_CPU_THRESHOLD
          value: "80"
        - name: ALERT_MEMORY_THRESHOLD
          value: "85"

        # Liveness probe
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3

        # Readiness probe
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3

        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### Service Monitor (Prometheus)

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: white-cross-backend-monitor
spec:
  selector:
    matchLabels:
      app: white-cross-backend
  endpoints:
  - port: http
    path: /monitoring/metrics
    interval: 30s
```

## Alert Severity Levels

- **INFO**: Informational alerts, no action required
- **WARNING**: Warning conditions, should be investigated
- **ERROR**: Error conditions requiring attention
- **CRITICAL**: Critical conditions requiring immediate action

## Performance Metrics

### Response Time Percentiles

- **Average**: Mean response time across all requests
- **P95**: 95% of requests completed within this time
- **P99**: 99% of requests completed within this time

### Request Rate

- **Requests/Second**: Calculated over a 60-second sliding window
- **Success Rate**: Percentage of successful requests

## Best Practices

1. **Register all services**: Ensure cache, WebSocket, queue manager, and circuit breaker services are registered for comprehensive monitoring

2. **Set appropriate thresholds**: Configure alert thresholds based on your infrastructure capacity and SLAs

3. **Monitor trends**: Use the dashboard to identify performance trends and potential issues before they become critical

4. **Track custom operations**: Use `trackPerformance()` to monitor critical business operations

5. **Review alerts regularly**: Acknowledge and resolve alerts to maintain a clean alert state

6. **Secure endpoints**: In production, protect monitoring endpoints with authentication/authorization

7. **Use with observability tools**: Integrate with Prometheus, Grafana, or other monitoring platforms for long-term storage and visualization

## Troubleshooting

### High Memory Usage

If memory usage consistently exceeds thresholds:
1. Check for memory leaks in application code
2. Review cache size and eviction policies
3. Monitor database connection pool size
4. Check for large log buffers or metrics arrays

### High CPU Usage

If CPU usage is consistently high:
1. Review slow database queries
2. Check for inefficient algorithms or loops
3. Monitor WebSocket connection count
4. Review job queue processing efficiency

### Degraded Component Status

If components show degraded status:
- **Database**: Check connection pool capacity, consider increasing pool size
- **Redis**: Verify Redis server is running and accessible
- **WebSocket**: Check for excessive connection churn
- **Queue**: Review failed jobs and error patterns
- **External APIs**: Check circuit breaker status and API availability

## License

This module is part of the White Cross School Health Management System and is proprietary software.
