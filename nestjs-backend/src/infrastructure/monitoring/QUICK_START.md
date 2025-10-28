# Monitoring Service - Quick Start Guide

## Quick Setup (2 minutes)

### 1. Register Optional Services (Optional but Recommended)

```typescript
// In app.module.ts or main module
import { Module, OnModuleInit } from '@nestjs/common';
import { MonitoringService } from './infrastructure/monitoring/monitoring.service';

@Module({
  imports: [MonitoringModule, ...],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly monitoringService: MonitoringService,
    // Optional services
    private readonly cacheService?: CacheService,
    private readonly websocketService?: WebSocketService,
    private readonly queueManagerService?: QueueManagerService,
    private readonly circuitBreakerService?: CircuitBreakerService,
  ) {}

  onModuleInit() {
    // Register available services
    if (this.cacheService) {
      this.monitoringService.setCacheService(this.cacheService);
    }
    if (this.websocketService) {
      this.monitoringService.setWebSocketService(this.websocketService);
    }
    if (this.queueManagerService) {
      this.monitoringService.setQueueManagerService(this.queueManagerService);
    }
    if (this.circuitBreakerService) {
      this.monitoringService.setCircuitBreakerService(this.circuitBreakerService);
    }
  }
}
```

### 2. Configure Environment (Optional)

```env
# .env file
ALERTS_ENABLED=true
ALERT_CPU_THRESHOLD=80
ALERT_MEMORY_THRESHOLD=85
ALERT_RESPONSE_TIME_THRESHOLD=5000
ALERT_ERROR_RATE_THRESHOLD=5
```

### 3. Done!

The monitoring service is now active. Access endpoints:
- Health: `http://localhost:3000/health`
- Dashboard: `http://localhost:3000/monitoring/dashboard`

## Most Common Use Cases

### Check System Health

```bash
curl http://localhost:3000/health
```

### View Dashboard

```bash
curl http://localhost:3000/monitoring/dashboard
```

### Track Request Performance

```typescript
import { MonitoringService } from './infrastructure/monitoring/monitoring.service';

@Injectable()
export class MyService {
  constructor(private readonly monitoring: MonitoringService) {}

  async myOperation() {
    const start = Date.now();
    try {
      const result = await this.doWork();
      this.monitoring.trackRequest(Date.now() - start, true);
      return result;
    } catch (error) {
      this.monitoring.trackRequest(Date.now() - start, false);
      throw error;
    }
  }
}
```

### Query Error Logs

```bash
curl "http://localhost:3000/monitoring/logs?level=error&limit=50"
```

### View Current Metrics

```bash
curl http://localhost:3000/monitoring/metrics
```

### Get Active Alerts

```bash
curl http://localhost:3000/monitoring/alerts
```

## Kubernetes Configuration

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  template:
    spec:
      containers:
      - name: app
        image: your-image:latest
        ports:
        - containerPort: 3000

        # Liveness Probe
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10

        # Readiness Probe
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Global Request Tracking

```typescript
// Create interceptor (interceptors/monitoring.interceptor.ts)
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonitoringService } from '../infrastructure/monitoring/monitoring.service';

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  constructor(private readonly monitoring: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    return next.handle().pipe(
      tap({
        next: () => this.monitoring.trackRequest(Date.now() - start, true),
        error: () => this.monitoring.trackRequest(Date.now() - start, false),
      }),
    );
  }
}

// Register in main.ts
import { NestFactory } from '@nestjs/core';
import { MonitoringInterceptor } from './interceptors/monitoring.interceptor';
import { MonitoringService } from './infrastructure/monitoring/monitoring.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register global monitoring
  const monitoring = app.get(MonitoringService);
  app.useGlobalInterceptors(new MonitoringInterceptor(monitoring));

  await app.listen(3000);
}
```

## Common Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Full health check |
| `/health/ready` | GET | Readiness probe |
| `/health/live` | GET | Liveness probe |
| `/monitoring/dashboard` | GET | Complete dashboard |
| `/monitoring/metrics` | GET | Real-time metrics |
| `/monitoring/alerts` | GET | Active alerts |
| `/monitoring/performance` | GET | Performance history |
| `/monitoring/logs` | GET | Query logs |

## Alert Severity Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| INFO | Informational | Configuration change |
| WARNING | Should investigate | High CPU (80-90%) |
| ERROR | Requires attention | Database pool near capacity |
| CRITICAL | Immediate action | Circuit breaker open |

## Metrics Overview

### System Metrics
- CPU usage %
- Memory usage %
- Process uptime
- Load average

### Performance Metrics
- Requests per second
- Average response time
- P95/P99 response times
- Success rate %
- Database connections
- Cache hit rate
- WebSocket clients
- Job queue statistics

## Default Thresholds

| Metric | Threshold | Severity |
|--------|-----------|----------|
| CPU | 80% | WARNING |
| Memory | 85% | WARNING |
| Response Time | 5000ms | ERROR |
| Error Rate | 5% | CRITICAL |
| DB Pool | 90% | WARNING |
| Failed Jobs | 100 | ERROR |

## Troubleshooting

### Issue: "Component shows degraded status"

**Solution**: Register the optional service in your module's `onModuleInit()`.

### Issue: "No metrics showing"

**Solution**: Wait 30 seconds for first automatic collection, or call `/monitoring/metrics` to trigger immediate collection.

### Issue: "Alerts not firing"

**Solution**: Check `ALERTS_ENABLED=true` in environment and verify thresholds are crossed.

### Issue: "Memory usage high"

**Solution**: Normal - buffers hold up to 10,000 logs and 1,000 performance entries (~12MB max).

## Best Practices

1. Always register CacheService, WebSocketService, and QueueManagerService for comprehensive monitoring
2. Use global interceptor for automatic request tracking
3. Track critical business operations with `trackPerformance()`
4. Review dashboard regularly to identify trends
5. Set alert thresholds based on your infrastructure capacity
6. Secure `/monitoring/*` endpoints in production
7. Forward logs to external system for long-term storage

## Performance Impact

- Memory: ~12MB maximum
- CPU: <0.1% overhead
- Response time: <1ms per tracked request
- Collection interval: Every 30 seconds

## Need Help?

See full documentation:
- [README.md](./README.md) - Complete guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details

## Example: Complete Integration

```typescript
// app.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { MonitoringModule } from './infrastructure/monitoring/monitoring.module';
import { MonitoringService } from './infrastructure/monitoring/monitoring.service';
import { CacheService } from './shared/cache/cache.service';
import { WebSocketService } from './infrastructure/websocket/websocket.service';
import { QueueManagerService } from './infrastructure/jobs/services/queue-manager.service';
import { CircuitBreakerService } from './integration/services/circuit-breaker.service';

@Module({
  imports: [
    MonitoringModule,
    // ... other modules
  ],
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
    // Register all services for comprehensive monitoring
    this.monitoringService.setCacheService(this.cacheService);
    this.monitoringService.setWebSocketService(this.websocketService);
    this.monitoringService.setQueueManagerService(this.queueManagerService);
    this.monitoringService.setCircuitBreakerService(this.circuitBreakerService);

    console.log('Monitoring service fully configured');
    console.log('Dashboard: http://localhost:3000/monitoring/dashboard');
  }
}

// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MonitoringInterceptor } from './interceptors/monitoring.interceptor';
import { MonitoringService } from './infrastructure/monitoring/monitoring.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global monitoring
  const monitoring = app.get(MonitoringService);
  app.useGlobalInterceptors(new MonitoringInterceptor(monitoring));

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Monitoring dashboard: http://localhost:3000/monitoring/dashboard');
}
bootstrap();
```

That's it! You're ready to monitor your application. 🚀
