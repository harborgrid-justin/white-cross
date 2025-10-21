# Monitoring & Observability Services

Enterprise-grade monitoring infrastructure for the White Cross healthcare platform with HIPAA-compliant tracking and zero PHI exposure.

## Overview

This directory contains all monitoring and observability services:

- **MetricsService**: Comprehensive metrics collection (security, audit, resilience, cache, performance)
- **HealthCheckService**: System health monitoring and status checks
- **ErrorTracker**: Error tracking with Sentry integration and PHI sanitization
- **Logger**: Structured logging with remote shipping and PHI protection
- **PerformanceMonitor**: Web Vitals and Real User Monitoring (RUM)

## Quick Start

### Installation

The monitoring services are already integrated. No additional installation required.

### Configuration

Add monitoring configuration to `.env.local`:

```bash
# Copy example configuration
cp .env.monitoring.example .env.local

# Edit with your credentials
vim .env.local
```

### Usage

```typescript
import {
  metricsService,
  healthCheckService,
  errorTracker,
  logger,
  log,
  performanceMonitor,
} from '@/services/monitoring';

// Track metrics
metricsService.trackLoginAttempt(true, 'password');
metricsService.trackCacheHit('api-cache');

// Log events
log.info('User action completed', { action: 'submit_form' });
log.security('Failed login attempt', 'high', { attempts: 3 });

// Track errors
errorTracker.captureError(error, {
  category: 'business',
  context: { operation: 'data_export' },
});

// Monitor performance
const result = await performanceMonitor.timeAsync('api_call', async () => {
  return await apiCall();
});

// Check health
const health = await healthCheckService.checkNow();
console.log('System health:', health.status);
```

## Services

### MetricsService

Comprehensive metrics collection for all aspects of the platform.

**Features:**
- Security metrics (login attempts, CSRF failures, etc.)
- Audit metrics (events logged, queue depth, etc.)
- Resilience metrics (circuit breakers, retries, timeouts)
- Cache metrics (hit rate, memory usage, evictions)
- Performance metrics (API latency, Web Vitals)

**Backends:**
- DataDog
- New Relic
- Prometheus
- CloudWatch
- Custom HTTP endpoint

**Example:**

```typescript
import { metricsService } from '@/services/monitoring';

// Security
metricsService.trackLoginAttempt(true, 'password');
metricsService.trackCSRFFailure('/api/endpoint');

// Audit
metricsService.trackAuditEvent(true, 'PHI_ACCESS');
metricsService.trackAuditQueueDepth(150);

// Resilience
metricsService.trackCircuitBreakerState('open', 'api-service');
metricsService.trackTimeout('database-query');

// Cache
metricsService.trackCacheHit('query-cache');
metricsService.trackCacheMiss('session-cache');

// Performance
metricsService.trackAPILatency('/api/students', 125, 200);
metricsService.trackWebVitals({ name: 'LCP', value: 2500 });
```

### HealthCheckService

System health monitoring and load balancer integration.

**Features:**
- Automatic health checks for critical services
- Custom health check providers
- `/health` endpoint for load balancers
- Prometheus metrics export

**Example:**

```typescript
import { healthCheckService } from '@/services/monitoring';

// Register custom health check
healthCheckService.registerProvider({
  name: 'database',
  critical: true,
  check: async () => {
    const isConnected = await checkDatabaseConnection();
    return {
      status: isConnected ? 'pass' : 'fail',
      message: isConnected ? 'DB connected' : 'DB connection failed',
    };
  },
});

// Get current health
const health = await healthCheckService.checkNow();
if (!health.isHealthy()) {
  console.error('System unhealthy:', health.checks);
}

// Get Prometheus metrics
const prometheusMetrics = healthCheckService.getPrometheusHealth();
```

### ErrorTracker

Error tracking with Sentry integration and automatic PHI sanitization.

**Features:**
- Sentry integration
- Automatic PHI sanitization
- Error categorization
- Breadcrumb tracking
- User context (anonymized)

**Example:**

```typescript
import { errorTracker } from '@/services/monitoring';

// Set user context (automatically anonymized)
errorTracker.setUser({ id: 'user123', role: 'nurse' });

// Add breadcrumbs for context
errorTracker.addBreadcrumb({
  message: 'User navigated to health records',
  category: 'navigation',
  level: 'info',
});

// Capture errors
try {
  await riskyOperation();
} catch (error) {
  errorTracker.captureError(error, {
    level: 'error',
    category: 'business',
    context: {
      operation: 'data_export',
      metadata: { recordCount: 100 },
    },
  });
}

// Capture messages
errorTracker.captureMessage('Important event', 'info', {
  operation: 'scheduled_task',
});
```

### Logger

Structured logging with PHI sanitization and remote shipping.

**Features:**
- Multiple log levels (DEBUG, INFO, WARN, ERROR, FATAL)
- Structured output
- Automatic PHI sanitization
- Remote log shipping
- Console output in development
- Context preservation

**Example:**

```typescript
import { logger, log } from '@/services/monitoring';

// Simple logging
log.debug('Debug information', { key: 'value' });
log.info('Operation completed', { duration: 125 });
log.warn('Slow query detected', { duration: 2000 });
log.error('Operation failed', error, { operation: 'export' });

// Structured events
log.event('user_registered', { method: 'email' });

// Performance logging
log.performance('api_call', 125, { endpoint: '/api/students' });

// Security logging
log.security('failed_login', 'high', { attempts: 5 });

// Audit logging
log.audit('PHI_ACCESS', 'student_health_record', 'success', {
  action: 'read',
  userId: 'user123',
});

// Child logger with context
const childLogger = logger.createChild({
  operation: 'bulk_import',
  correlationId: 'abc123',
});
childLogger.info('Import started');
childLogger.info('Processing records', { count: 1000 });
childLogger.info('Import completed');
```

### PerformanceMonitor

Web Vitals tracking and Real User Monitoring (RUM).

**Features:**
- Core Web Vitals (LCP, FID, CLS, TTFB, FCP, INP)
- Resource timing
- Long task tracking
- Memory monitoring
- Custom performance marks

**Example:**

```typescript
import { performanceMonitor } from '@/services/monitoring';

// Web Vitals are tracked automatically

// Custom performance tracking
performanceMonitor.mark('operation-start');
// ... do work ...
performanceMonitor.mark('operation-end');
const duration = performanceMonitor.measure(
  'operation',
  'operation-start',
  'operation-end'
);

// Time async operations
const data = await performanceMonitor.timeAsync('fetchData', async () => {
  return await fetch('/api/data');
});

// Time sync operations
const result = performanceMonitor.time('processData', () => {
  return processData();
});

// Get performance summary
const summary = performanceMonitor.getSummary();
console.log('Web Vitals:', summary.webVitals);
console.log('Memory:', summary.memory);
```

## HIPAA Compliance

### Zero PHI Exposure

All monitoring services automatically sanitize PHI:

- Email addresses → `[EMAIL]`
- Phone numbers → `[PHONE]`
- SSN → `[SSN]`
- Dates (potential DOB) → `[DATE]`
- Names, addresses, etc. → `[REDACTED]`
- User/Student IDs → Anonymized hash

### Safe Logging

✅ **Safe:**
```typescript
log.info('Student record accessed', {
  userId: 'user123', // Staff user - OK
  resourceType: 'health_record', // Type only - OK
  action: 'READ', // Action - OK
});
```

❌ **Unsafe (automatically sanitized):**
```typescript
log.info('Record accessed', {
  studentName: 'John Doe', // → [REDACTED]
  email: 'john@example.com', // → [EMAIL]
  diagnosis: 'Diabetes', // → [REDACTED]
});
```

### Audit Requirements

All PHI access must be audited. The audit logging is automatic in the API layer, but you can manually log:

```typescript
log.audit('PHI_ACCESS', 'student_health_record', 'success', {
  action: 'read',
  fieldsAccessed: ['allergies', 'medications'],
});
```

## Architecture

```
Application Layer
       ↓
Monitoring Services
       ↓
Export Layer (DataDog, Sentry, etc.)
       ↓
Dashboards & Alerts
```

## Configuration

### Environment Variables

See `.env.monitoring.example` for all available configuration options.

### Metrics Backends

Configure in `main.tsx`:

```typescript
await initializeMonitoring({
  metrics: {
    backends: [
      {
        type: 'datadog',
        endpoint: process.env.VITE_DATADOG_ENDPOINT,
        apiKey: process.env.VITE_DATADOG_API_KEY,
        enabled: true,
      },
    ],
  },
});
```

### Sampling

Reduce overhead in high-traffic scenarios:

```typescript
await initializeMonitoring({
  metrics: {
    samplingRate: 0.1, // Sample 10% of metrics
  },
  errors: {
    sampleRate: 0.5, // Sample 50% of errors
  },
});
```

## Performance Impact

The monitoring infrastructure is designed for zero performance impact:

- **Async Processing**: All metrics and logs are processed asynchronously
- **Batching**: Metrics and logs are batched before shipping
- **Sampling**: Configurable sampling rates
- **Lazy Loading**: Error tracker loads Sentry on-demand
- **Debouncing**: Health checks are rate-limited

**Typical overhead:**
- Metrics: <0.1ms per track call
- Logging: <0.5ms per log call
- Error tracking: <1ms per capture
- Performance monitoring: <0.1ms per track

## Dashboards

Pre-built dashboards are available:

- **Security Dashboard**: Login attempts, CSRF failures, suspicious activity
- **Audit Dashboard**: Audit events, compliance status, PHI access
- **Resilience Dashboard**: Circuit breakers, retries, error budget
- **Cache Dashboard**: Hit rates, memory usage, efficiency

Dashboard specifications: `monitoring/dashboards/`

## Alerts

Alert rules are configured in `monitoring/alerts/alert-rules.yml`.

**Critical Alerts:**
- Audit logging failures (HIPAA compliance risk)
- Missing PHI access logs
- Circuit breakers open >15 minutes
- High failed login rate

**Alert Channels:**
- PagerDuty (critical)
- Slack (all)
- Email (all)

## Troubleshooting

### Metrics not appearing

```typescript
// Check if metrics are being recorded
const metrics = metricsService.getSecurityMetrics();
console.log('Security metrics:', metrics);
```

### Logs not shipping

```typescript
// Force flush logs
await logger.flush();

// Check log buffer
console.log('Buffer size:', logger.getBufferSize());
```

### Errors not in Sentry

```typescript
// Check if error tracker is initialized
console.log('Error tracker:', errorTracker);

// Manually test
errorTracker.captureMessage('Test message', 'info');
```

## API Reference

See individual service files for complete API documentation:

- [MetricsService.ts](./MetricsService.ts)
- [HealthCheckService.ts](./HealthCheckService.ts)
- [ErrorTracker.ts](./ErrorTracker.ts)
- [Logger.ts](./Logger.ts)
- [PerformanceMonitor.ts](./PerformanceMonitor.ts)

## Resources

- [Monitoring Guide](../../../../../MONITORING_GUIDE.md)
- [Audit Monitoring](../../../../../monitoring/audit-monitoring.md)
- [Alert Rules](../../../../../monitoring/alerts/alert-rules.yml)
- [Dashboard Specifications](../../../../../monitoring/dashboards/)

## Support

- Security Team: security@whitecross.com
- Compliance Team: compliance@whitecross.com
- Operations Team: ops@whitecross.com
- On-Call: PagerDuty

---

**Last Updated**: 2025-10-21
**Maintained By**: Platform Engineering Team
