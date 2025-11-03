# Monitoring Middleware Module

Comprehensive monitoring middleware for NestJS healthcare applications with HIPAA compliance, distributed tracing, metrics collection, and performance monitoring.

## Components

### 1. Audit Middleware & Interceptor
**Purpose**: HIPAA-compliant audit logging for PHI access tracking and compliance monitoring.

**Features**:
- Comprehensive PHI access logging (view, edit, create, delete, export)
- Authentication and authorization event tracking
- Emergency access logging with mandatory reasoning
- Healthcare-specific event types (medication admin, allergy updates, etc.)
- 6-year retention period (HIPAA requirement)
- Real-time security alerts for sensitive actions
- Failed access attempt tracking for brute force detection

**Usage**:
```typescript
import { AuditMiddleware, createHealthcareAudit } from '@middleware/monitoring';

// Use in module
@Module({
  providers: [AuditMiddleware]
})

// Or create with custom config
const audit = createHealthcareAudit();
await audit.logPHIAccess('VIEW', studentId, userId, email, role, ip, resource);
```

**Key Methods**:
- `logEvent(eventType, action, result, context)` - Log general audit event
- `logAuthentication(success, ipAddress, userId, email)` - Log auth events
- `logPHIAccess(action, studentId, userId, ...)` - Log PHI access
- `logEmergencyAccess(userId, studentId, reasoning)` - Log emergency access
- `logAccessDenied(userId, resource, reason)` - Log access denial
- `getAuditSummary(timeWindow?)` - Get audit statistics
- `searchEvents(criteria, limit)` - Search audit events
- `exportAuditLog()` - Export complete audit log

### 2. Tracing Middleware
**Purpose**: Enterprise-grade distributed tracing with healthcare compliance.

**Features**:
- W3C trace context propagation
- Healthcare-specific context extraction (PHI access, emergency access)
- Span management with parent-child relationships
- HIPAA-compliant data sanitization
- Batch export with configurable intervals
- Integration with external tracing services (Jaeger, Zipkin)
- 10% default sampling rate for production

**Usage**:
```typescript
import { TracingMiddleware, createTracingMiddleware } from '@middleware/monitoring';

// Use in module with default config
@Module({
  providers: [TracingMiddleware]
})

// Or create with custom config
const tracing = createTracingMiddleware({
  sampleRate: 0.2,
  enableHealthcareTracing: true,
  hipaaCompliant: true
});
```

**Configuration**:
- `enabled` - Enable/disable tracing
- `sampleRate` - Sampling rate (0.0 to 1.0)
- `enableHealthcareTracing` - Track healthcare-specific context
- `hipaaCompliant` - Enable HIPAA data sanitization
- `excludeFields` - Sensitive fields to exclude from traces

### 3. Metrics Middleware
**Purpose**: Healthcare-specific metrics collection and monitoring.

**Features**:
- HTTP request/response metrics
- Healthcare-specific metrics (PHI access, emergency access, medication admin)
- User activity tracking
- System resource monitoring (CPU, memory, event loop)
- Error rate tracking
- Real-time alerts for threshold violations
- Batch export with configurable intervals

**Usage**:
```typescript
import { MetricsMiddleware, createMetricsMiddleware } from '@middleware/monitoring';

// Use in module
@Module({
  providers: [MetricsMiddleware]
})

// Get metrics summary
const summary = metricsMiddleware.getMetricsSummary();
```

**Metric Categories**:
- `PATIENT_ACCESS` - Patient data access events
- `PHI_ACCESS` - Protected health information access
- `MEDICATION_ADMIN` - Medication administration events
- `EMERGENCY_ACCESS` - Emergency access events
- `COMPLIANCE` - Compliance-related metrics
- `SECURITY` - Security events and errors
- `PERFORMANCE` - Performance and system metrics
- `USAGE` - General usage statistics

### 4. Performance Middleware & Interceptor
**Purpose**: Request performance tracking and bottleneck detection.

**Features**:
- Request duration tracking
- Memory usage monitoring
- Slow request detection (configurable thresholds)
- Critical request alerting
- Path-specific performance metrics
- User-specific performance analysis
- System health assessment
- Performance summary and export

**Usage**:
```typescript
import {
  PerformanceMiddleware,
  PerformanceInterceptor,
  createHealthcarePerformance
} from '@middleware/monitoring';

// Use in module
@Module({
  providers: [
    PerformanceMiddleware,
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor
    }
  ]
})

// Get performance summary
const summary = performanceMiddleware.getPerformanceSummary(5 * 60 * 1000); // Last 5 minutes
const health = performanceMiddleware.getSystemHealth();
```

**Thresholds**:
- Healthcare: 1s slow, 3s critical
- Development: 2s slow, 5s critical
- Production: 500ms slow, 2s critical

## Module Integration

### Basic Setup
```typescript
import { Module } from '@nestjs/common';
import { MonitoringModule } from './middleware/monitoring';

@Module({
  imports: [MonitoringModule],
})
export class AppModule {}
```

### Custom Configuration
```typescript
import { Module } from '@nestjs/common';
import {
  AuditMiddleware,
  TracingMiddleware,
  MetricsMiddleware,
  PerformanceMiddleware,
  AUDIT_CONFIGS,
  DEFAULT_TRACING_CONFIG
} from './middleware/monitoring';

@Module({
  providers: [
    {
      provide: AuditMiddleware,
      useFactory: () => {
        const middleware = new AuditMiddleware();
        (middleware as any).config = AUDIT_CONFIGS.production;
        return middleware;
      }
    },
    TracingMiddleware,
    MetricsMiddleware,
    PerformanceMiddleware
  ]
})
export class AppModule {}
```

## HIPAA Compliance

All monitoring components are designed with HIPAA compliance in mind:

1. **Audit Logging**:
   - 6-year retention period
   - Complete audit trail (who, what, when, where, why)
   - PHI access tracking
   - Emergency access logging with reasoning

2. **Data Sanitization**:
   - Automatic redaction of sensitive fields
   - Configurable exclude lists
   - HIPAA-compliant tracing

3. **Security Monitoring**:
   - Real-time alerts for sensitive actions
   - Failed access attempt tracking
   - Access denial logging

## Performance Considerations

- **Sampling**: Configurable sampling rates to reduce overhead (default 10% for tracing, 100% for others)
- **Batching**: Metrics and traces are batched before export
- **Async Processing**: Non-blocking operations with asynchronous exports
- **Memory Management**: Automatic cleanup of old metrics with configurable limits
- **Efficient Storage**: In-memory storage with bounded capacity

## Monitoring Best Practices

1. **Production Settings**:
   - Use healthcare or production configs
   - Enable all tracking features
   - Set appropriate sampling rates
   - Configure real-time alerts

2. **Development Settings**:
   - Use development config
   - Reduce sampling rates
   - Disable detailed logging
   - Lower retention periods

3. **Health Checks**:
   - Regularly check performance summaries
   - Monitor system health status
   - Review audit summaries
   - Track error rates

4. **Export and Analysis**:
   - Configure external exporters (Jaeger, Prometheus, etc.)
   - Regular audit log exports
   - Performance metric analysis
   - Compliance reporting

## API Endpoints

Consider exposing monitoring endpoints for operational visibility:

```typescript
@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly audit: AuditMiddleware,
    private readonly performance: PerformanceMiddleware,
    private readonly metrics: MetricsMiddleware
  ) {}

  @Get('audit/summary')
  getAuditSummary() {
    return this.audit.getAuditSummary();
  }

  @Get('performance/summary')
  getPerformanceSummary() {
    return this.performance.getPerformanceSummary();
  }

  @Get('metrics/summary')
  getMetricsSummary() {
    return this.metrics.getMetricsSummary();
  }

  @Get('health')
  getSystemHealth() {
    return this.performance.getSystemHealth();
  }
}
```

## Testing

```typescript
import { Test } from '@nestjs/testing';
import { MonitoringModule, AuditMiddleware } from '@middleware/monitoring';

describe('MonitoringModule', () => {
  let auditMiddleware: AuditMiddleware;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MonitoringModule],
    }).compile();

    auditMiddleware = module.get(AuditMiddleware);
  });

  it('should log PHI access', async () => {
    await auditMiddleware.logPHIAccess(
      'VIEW',
      'student123',
      'user456',
      'user@example.com',
      'nurse',
      '192.168.1.1',
      '/api/students/123',
      'Regular checkup'
    );

    const events = auditMiddleware.getPHIAccessEvents('student123');
    expect(events.length).toBeGreaterThan(0);
  });
});
```

## Migration Notes

This module has been migrated from the framework-agnostic backend implementation to NestJS with the following enhancements:

1. **NestJS Integration**: Proper use of decorators, dependency injection, and lifecycle hooks
2. **Interceptors**: Added interceptors for method-level monitoring
3. **Module System**: Organized as a proper NestJS module with exports
4. **TypeScript**: Enhanced type safety with strict mode compatibility
5. **Logging**: Integration with NestJS Logger service
6. **Lifecycle**: Proper cleanup with `onModuleDestroy` hooks

## Dependencies

- `@nestjs/common` - NestJS core functionality
- `rxjs` - Reactive extensions for interceptors
- `express` - HTTP types (Request, Response)

## License

Proprietary - White Cross Healthcare Platform
