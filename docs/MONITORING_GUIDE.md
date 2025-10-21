# White Cross Healthcare Platform - Monitoring & Observability Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Monitoring Services](#monitoring-services)
5. [Dashboards](#dashboards)
6. [Alerts](#alerts)
7. [Troubleshooting](#troubleshooting)
8. [HIPAA Compliance](#hipaa-compliance)
9. [Best Practices](#best-practices)

## Overview

The White Cross monitoring infrastructure provides enterprise-grade observability for our healthcare platform with a focus on:

- **Security Monitoring**: Track authentication, authorization, and suspicious activity
- **Audit Compliance**: Ensure 100% HIPAA-compliant audit logging
- **Performance Monitoring**: Real User Monitoring (RUM) and Web Vitals
- **Resilience Tracking**: Circuit breakers, retries, and error budgets
- **Cache Optimization**: Hit rates, memory usage, and efficiency

### Key Features

✅ **HIPAA Compliant** - Zero PHI exposure in logs or metrics
✅ **Real-time Alerting** - PagerDuty, Slack, and email integration
✅ **Production Ready** - Battle-tested patterns and configurations
✅ **Zero Performance Impact** - Async processing and sampling
✅ **Multi-Backend Support** - DataDog, New Relic, Prometheus, CloudWatch

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  React   │ │   API    │ │  Auth    │ │  Cache   │       │
│  │Components│ │ Services │ │ Service  │ │ Service  │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
└───────┼───────────┼───────────┼───────────┼─────────────────┘
        │           │           │           │
        ▼           ▼           ▼           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Monitoring Services Layer                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │             MetricsService (Singleton)               │    │
│  │  • Security metrics  • Audit metrics                 │    │
│  │  • Resilience metrics • Cache metrics                │    │
│  │  • Performance metrics                               │    │
│  └──────────────────┬──────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           HealthCheckService (Singleton)             │    │
│  │  • Component health • Service status                 │    │
│  │  • /health endpoint • Load balancer support          │    │
│  └──────────────────┬──────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            ErrorTracker (Sentry Integration)         │    │
│  │  • Error categorization • Breadcrumbs                │    │
│  │  • PHI sanitization • Context tracking               │    │
│  └──────────────────┬──────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Logger (Structured Logging)             │    │
│  │  • Multiple transports • PHI sanitization            │    │
│  │  • Remote shipping • Context preservation            │    │
│  └──────────────────┬──────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │        PerformanceMonitor (Web Vitals & RUM)         │    │
│  │  • LCP, FID, CLS • Resource timing                   │    │
│  │  • Long tasks • Memory tracking                      │    │
│  └──────────────────┬──────────────────────────────────┘    │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Export Layer                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ DataDog  │ │New Relic │ │Prometheus│ │CloudWatch│       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
└───────┼───────────┼───────────┼───────────┼─────────────────┘
        │           │           │           │
        ▼           ▼           ▼           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Visualization & Alerting                    │
│  • Dashboards  • Alerts  • Reports  • Analytics              │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Installation

The monitoring infrastructure is already integrated into the White Cross platform. No additional installation required.

### 2. Configuration

Create a `.env` file with monitoring configuration:

```bash
# Metrics Backend
VITE_METRICS_ENABLED=true
VITE_METRICS_BACKEND=datadog
VITE_DATADOG_API_KEY=your_api_key
VITE_DATADOG_ENDPOINT=https://api.datadoghq.com

# Error Tracking (Sentry)
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_SAMPLE_RATE=1.0

# Logging
VITE_LOG_LEVEL=INFO
VITE_LOG_REMOTE_ENDPOINT=https://logs.whitecross.com/ingest
VITE_LOG_REMOTE_API_KEY=your_log_api_key

# Health Checks
VITE_HEALTH_CHECK_ENABLED=true
VITE_HEALTH_CHECK_INTERVAL=30000
```

### 3. Initialization

The monitoring infrastructure is automatically initialized on application bootstrap:

```typescript
// Already configured in main.tsx
import { initializeMonitoring } from '@/services/monitoring';

await initializeMonitoring({
  metrics: {
    enabled: true,
    backends: [
      {
        type: 'datadog',
        endpoint: import.meta.env.VITE_DATADOG_ENDPOINT,
        apiKey: import.meta.env.VITE_DATADOG_API_KEY,
        enabled: true,
      },
    ],
  },
  errors: {
    enabled: true,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
  },
});
```

### 4. Basic Usage

```typescript
import { metricsService, logger, errorTracker } from '@/services/monitoring';

// Track a metric
metricsService.trackLoginAttempt(true, 'password');

// Log an event
logger.info('User logged in successfully', { userId: 'user123' });

// Track an error
try {
  await riskyOperation();
} catch (error) {
  errorTracker.captureError(error, {
    category: 'business',
    context: { operation: 'riskyOperation' },
  });
}
```

## Monitoring Services

### MetricsService

Comprehensive metrics collection for security, audit, resilience, cache, and performance.

#### Security Metrics

```typescript
import { metricsService } from '@/services/monitoring';

// Login attempts
metricsService.trackLoginAttempt(success: boolean, method: string);

// Token management
metricsService.trackTokenExpiration(reason: 'timeout' | 'manual' | 'invalid');

// Security events
metricsService.trackCSRFFailure(endpoint: string);
metricsService.trackAuthorizationDenial(resource: string, action: string);
metricsService.trackSuspiciousActivity(type: string);
```

#### Audit Metrics

```typescript
// Audit events
metricsService.trackAuditEvent(success: boolean, eventType: string);
metricsService.trackAuditBatch(size: number, latency: number);
metricsService.trackAuditQueueDepth(depth: number);
metricsService.trackAuditRetry(success: boolean);
```

#### Resilience Metrics

```typescript
// Circuit breaker
metricsService.trackCircuitBreakerState(
  state: 'open' | 'half-open' | 'closed',
  serviceName: string
);

// Request patterns
metricsService.trackRequestDeduplication(wasDuplicate: boolean);
metricsService.trackRequestRetry(attempt: number, success: boolean);
metricsService.trackTimeout(operation: string);
metricsService.trackFallbackExecution(operation: string, success: boolean);
```

#### Cache Metrics

```typescript
// Cache operations
metricsService.trackCacheHit(cacheType: string);
metricsService.trackCacheMiss(cacheType: string);
metricsService.trackCacheInvalidation(cacheType: string, reason: string);
metricsService.trackCacheEviction(cacheType: string);
metricsService.trackCacheMemoryUsage(bytes: number);
```

#### Performance Metrics

```typescript
// API tracking
metricsService.trackAPILatency(endpoint: string, latency: number, statusCode: number);

// Web Vitals
metricsService.trackWebVitals({
  name: 'LCP',
  value: 2500,
});

// Custom performance
metricsService.trackRenderTime(component: string, duration: number);
metricsService.trackMemoryUsage(usedBytes: number);
```

### HealthCheckService

System health monitoring and status checks.

```typescript
import { healthCheckService } from '@/services/monitoring';

// Get current health
const health = await healthCheckService.checkNow();

// Register custom health check
healthCheckService.registerProvider({
  name: 'customService',
  critical: true,
  check: async () => {
    const isHealthy = await checkService();
    return {
      status: isHealthy ? 'pass' : 'fail',
      message: isHealthy ? 'Service operational' : 'Service down',
    };
  },
});

// Load balancer endpoint
// GET /health returns 200 if healthy, 503 if unhealthy
```

### ErrorTracker

Error tracking with Sentry integration and PHI sanitization.

```typescript
import { errorTracker } from '@/services/monitoring';

// Set user context (anonymized)
errorTracker.setUser({ id: 'user123', role: 'nurse' });

// Add breadcrumbs
errorTracker.addBreadcrumb({
  message: 'User clicked save button',
  category: 'user-action',
  level: 'info',
});

// Capture errors
errorTracker.captureError(error, {
  level: 'error',
  category: 'security',
  context: { operation: 'login' },
});

// Capture messages
errorTracker.captureMessage('Important event occurred', 'info');
```

### Logger

Structured logging with PHI sanitization and remote shipping.

```typescript
import { logger, log } from '@/services/monitoring';

// Basic logging
log.debug('Debug message', { key: 'value' });
log.info('Info message', { key: 'value' });
log.warn('Warning message', { key: 'value' });
log.error('Error message', error, { key: 'value' });
log.fatal('Fatal error', error, { key: 'value' });

// Structured events
log.event('user_registered', { registrationType: 'email' });

// Performance logging
log.performance('api_call', 125, { endpoint: '/api/students' });

// Security logging
log.security('failed_login', 'high', { attempts: 5 });

// Audit logging
log.audit('PHI_ACCESS', 'student_health_record', 'success', {
  action: 'read',
});

// Child logger with context
const childLogger = logger.createChild({
  operation: 'data_import',
  correlationId: 'abc123',
});
childLogger.info('Import started');
```

### PerformanceMonitor

Web Vitals and Real User Monitoring (RUM).

```typescript
import { performanceMonitor } from '@/services/monitoring';

// Mark performance points
performanceMonitor.mark('operation-start');
performanceMonitor.mark('operation-end');
performanceMonitor.measure('operation-duration', 'operation-start', 'operation-end');

// Time async operations
const result = await performanceMonitor.timeAsync('fetchData', async () => {
  return await fetchData();
});

// Time sync operations
const processed = performanceMonitor.time('processData', () => {
  return processData();
});

// Get performance summary
const summary = performanceMonitor.getSummary();
console.log('Web Vitals:', summary.webVitals);
console.log('Memory:', summary.memory);
```

## Dashboards

### Security Dashboard

**URL**: `https://monitoring.whitecross.com/dashboards/security`

**Key Panels**:
- Login attempts (success/failure)
- Failed login rate
- CSRF failures
- Authorization denials
- Suspicious activity heatmap

**When to Review**:
- Daily: Morning security check
- Real-time: During security incidents
- Weekly: Security trend analysis

### Audit & Compliance Dashboard

**URL**: `https://monitoring.whitecross.com/dashboards/audit`

**Key Panels**:
- Audit events logged
- Audit success rate (target: >99.9%)
- PHI access events
- Audit queue depth
- Compliance status

**When to Review**:
- Daily: Compliance check
- Real-time: During audit failures
- Monthly: Compliance reporting

### Resilience Dashboard

**URL**: `https://monitoring.whitecross.com/dashboards/resilience`

**Key Panels**:
- Circuit breaker states
- Request deduplication
- Retry success rate
- Timeout events
- Error budget

**When to Review**:
- Real-time: During outages
- Daily: System health check
- Weekly: Reliability trends

### Cache Dashboard

**URL**: `https://monitoring.whitecross.com/dashboards/cache`

**Key Panels**:
- Cache hit rate
- Memory usage
- Cache operations rate
- Invalidations
- Cache efficiency score

**When to Review**:
- Daily: Performance optimization
- Real-time: Performance issues
- Weekly: Optimization opportunities

## Alerts

### Alert Severity Levels

- **CRITICAL**: Immediate action required, PagerDuty notification
- **WARNING**: Action required within hours, Slack + email
- **INFO**: Informational only, Slack notification

### Critical Alerts

#### Security

1. **HighFailedLoginRate**
   - Condition: >5 failed logins/minute for 5 minutes
   - Action: Check for brute force attack
   - Escalation: Security team

2. **CSRFFailureDetected**
   - Condition: Any CSRF failure
   - Action: Immediate investigation
   - Escalation: Security team + CISO

3. **SuspiciousActivityDetected**
   - Condition: >5 suspicious events in 5 minutes
   - Action: Security review
   - Escalation: Security team

#### Audit & Compliance

1. **AuditLoggingFailure**
   - Condition: Any audit logging failure
   - Action: **IMMEDIATE** - HIPAA compliance at risk
   - Escalation: Security + Compliance + On-call

2. **MissingPHIAccessLogs**
   - Condition: PHI accessed but no audit log
   - Action: **STOP ALL PHI OPERATIONS**
   - Escalation: CRITICAL INCIDENT

3. **LowAuditSuccessRate**
   - Condition: Success rate <99%
   - Action: Fix audit service immediately
   - Escalation: On-call engineer

#### Resilience

1. **CircuitBreakerOpenProlonged**
   - Condition: Circuit open >15 minutes
   - Action: Critical service failure
   - Escalation: On-call + Engineering lead

2. **CriticalErrorBudget**
   - Condition: <10% error budget remaining
   - Action: FREEZE ALL deployments
   - Escalation: Engineering + Product

### Alert Response

#### 1. Acknowledge Alert
- Respond in PagerDuty within 5 minutes
- Post in #incidents Slack channel
- Assign incident commander if needed

#### 2. Assess Impact
- Check affected users/services
- Determine if HIPAA violation occurred
- Document initial findings

#### 3. Mitigate
- Follow runbook procedures
- Implement temporary fixes if needed
- Communicate status updates

#### 4. Resolve
- Verify metrics return to normal
- Close PagerDuty incident
- Schedule post-mortem if needed

#### 5. Document
- Update incident report
- Record lessons learned
- Update runbooks if needed

## Troubleshooting

### Common Issues

#### 1. Metrics Not Appearing in Dashboard

**Symptoms**: Dashboard shows no data

**Diagnosis**:
```typescript
// Check if metrics are being recorded
const metrics = metricsService.getSecurityMetrics();
console.log('Security metrics:', metrics);

// Check metrics buffer
console.log('Metrics buffer size:', metricsService['metricsBuffer'].length);
```

**Solutions**:
- Verify backend configuration in `.env`
- Check network connectivity to metrics backend
- Verify API keys are correct
- Check browser console for errors

#### 2. Audit Logs Not Being Written

**Symptoms**: `audit_events_failed` > 0

**Diagnosis**:
```typescript
// Check audit service health
const health = await healthCheckService.checkNow();
console.log('Audit service:', health.checks.auditService);

// Check audit metrics
const auditMetrics = metricsService.getAuditMetrics();
console.log('Audit metrics:', auditMetrics);
```

**Solutions**:
- Check database connectivity
- Verify audit table exists
- Check disk space
- Review audit service logs
- Restart audit service if needed

#### 3. High Memory Usage

**Symptoms**: Memory usage >90%

**Diagnosis**:
```typescript
// Check memory metrics
const summary = performanceMonitor.getSummary();
console.log('Memory:', summary.memory);

// Check cache size
const cacheMetrics = metricsService.getCacheMetrics();
console.log('Cache memory:', cacheMetrics.memoryUsage);
```

**Solutions**:
- Clear cache
- Reduce cache size limits
- Check for memory leaks
- Restart application if needed

#### 4. Circuit Breaker Stuck Open

**Symptoms**: Circuit breaker open >15 minutes

**Diagnosis**:
```typescript
// Check circuit breaker state
const resilienceMetrics = metricsService.getResilienceMetrics();
console.log('Circuit breakers:', resilienceMetrics);
```

**Solutions**:
- Check upstream service health
- Review error logs for root cause
- Manual circuit reset if appropriate
- Scale upstream service if needed

## HIPAA Compliance

### PHI Protection in Monitoring

**Zero PHI Exposure**: The monitoring infrastructure is designed to NEVER log or track PHI.

#### Automatic Sanitization

All services automatically sanitize:
- Email addresses → `[EMAIL]`
- Phone numbers → `[PHONE]`
- SSN → `[SSN]`
- Dates (potential DOB) → `[DATE]`
- Student/patient IDs → `[ANONYMIZED_HASH]`

#### Safe Logging Examples

✅ **Safe**:
```typescript
logger.info('Student record accessed', {
  userId: 'user123', // OK - staff user ID
  resourceType: 'health_record', // OK - type only
  action: 'READ', // OK - action type
});
```

❌ **Unsafe** (automatically sanitized):
```typescript
logger.info('Student record accessed', {
  studentName: 'John Doe', // REDACTED
  studentEmail: 'john@example.com', // REDACTED
  diagnosis: 'Diabetes', // REDACTED
});
```

### Audit Requirements

**100% Coverage**: All PHI access MUST be audited.

```typescript
// Automatic audit logging for PHI operations
// Already implemented in API layer
```

**Retention**: 7 years minimum (HIPAA requires 6 years).

**Integrity**: Audit logs are cryptographically hashed to prevent tampering.

## Best Practices

### 1. Metric Naming

Use hierarchical naming:
```
security.login.attempts
security.login.failures
audit.events.logged
cache.hit_rate
```

### 2. Contextual Logging

Always include context:
```typescript
logger.info('Operation completed', {
  operation: 'data_export',
  duration: 1250,
  recordCount: 100,
  correlationId: 'abc123',
});
```

### 3. Error Handling

Always capture errors with context:
```typescript
try {
  await operation();
} catch (error) {
  errorTracker.captureError(error, {
    category: 'business',
    context: {
      operation: 'operation_name',
      metadata: { key: 'value' },
    },
  });
  throw error; // Re-throw if needed
}
```

### 4. Performance Tracking

Track critical operations:
```typescript
const duration = await performanceMonitor.timeAsync('criticalOperation', async () => {
  return await criticalOperation();
});

if (duration > 1000) {
  logger.warn('Slow operation detected', { operation: 'criticalOperation', duration });
}
```

### 5. Health Checks

Register health checks for custom services:
```typescript
healthCheckService.registerProvider({
  name: 'myService',
  critical: true,
  check: async () => {
    // Check service health
    return { status: 'pass', message: 'Service healthy' };
  },
});
```

## Resources

### Documentation

- [Audit Monitoring Guide](./monitoring/audit-monitoring.md)
- [Alert Rules](./monitoring/alerts/alert-rules.yml)
- [Dashboard Specifications](./monitoring/dashboards/)

### Support

- **On-Call Engineer**: PagerDuty
- **Security Team**: security@whitecross.com
- **Compliance Team**: compliance@whitecross.com
- **Operations Team**: ops@whitecross.com

### External Links

- [DataDog Documentation](https://docs.datadoghq.com)
- [Sentry Documentation](https://docs.sentry.io)
- [Web Vitals](https://web.dev/vitals/)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/)

---

**Last Updated**: 2025-10-21
**Version**: 1.0.0
**Maintained By**: Platform Engineering Team
