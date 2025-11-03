# Monitoring & Observability System

Comprehensive monitoring, error tracking, and observability infrastructure for the White Cross healthcare platform with HIPAA-compliant PHI sanitization.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Services](#services)
- [Components](#components)
- [Hooks](#hooks)
- [Configuration](#configuration)
- [PHI Compliance](#phi-compliance)
- [Alert System](#alert-system)
- [Best Practices](#best-practices)

## Overview

The monitoring system provides:

- **Error Tracking**: Sentry integration with automatic error capture
- **Performance Monitoring**: Core Web Vitals, component timing, API latency
- **Analytics**: Custom healthcare-specific event tracking
- **Logging**: Structured client-side logging with remote shipping
- **Health Monitoring**: Real-time system health checks
- **Alerts**: Threshold-based alerting with multi-channel notifications
- **PHI Sanitization**: Automatic removal of Protected Health Information from all logs

## Features

### Error Tracking
- Automatic error capture with React Error Boundaries
- Source map support for production debugging
- User context attachment (sanitized)
- Custom error tags and fingerprinting
- Healthcare-specific error tracking (medication errors, compliance violations)

### Performance Monitoring
- Core Web Vitals (LCP, FID, CLS, FCP, TTFB, INP)
- Component render time tracking
- API response time monitoring
- Memory usage tracking
- Long task detection
- Network performance metrics

### Analytics
- Page view tracking
- User action tracking
- Healthcare event tracking (medications, PHI access, emergencies)
- Custom event tracking
- Session tracking
- User flow analytics

### Logging
- Structured logging with levels (debug, info, warn, error, fatal)
- Client-side log aggregation
- Automatic log shipping to backend
- PHI sanitization
- Log search and filtering
- Child loggers with context

### Health Monitoring
- API health checks
- Database connectivity monitoring
- Cache availability checks
- WebSocket status
- Network connectivity detection
- Automatic alerts on degradation

## Architecture

```
monitoring/
├── types.ts                  # TypeScript type definitions
├── index.ts                  # Main entry point
├── init.ts                   # Initialization logic
│
├── utils/
│   └── phi-sanitizer.ts     # PHI sanitization utilities
│
├── services/
│   ├── sentry.ts            # Sentry error tracking
│   ├── datadog.ts           # DataDog RUM integration
│   ├── performance.ts       # Performance monitoring
│   ├── analytics.ts         # Custom analytics
│   ├── logger.ts            # Structured logging
│   ├── health-check.ts      # Health monitoring
│   └── alerts.ts            # Alert management
│
├── hooks/
│   ├── useErrorTracking.ts # Error tracking hook
│   ├── usePerformanceMonitoring.ts
│   ├── useAnalytics.ts      # Analytics hook
│   └── useHealthCheck.ts    # Health check hook
│
└── components/
    ├── ErrorBoundary.tsx    # Error boundary component
    ├── PerformanceMonitor.tsx
    └── HealthIndicator.tsx
```

## Quick Start

### 1. Installation

Dependencies are already installed:
- `@sentry/nextjs`
- `@datadog/browser-rum`
- `@datadog/browser-logs`
- `web-vitals`

### 2. Environment Variables

Add to `.env.local`:

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.01
NEXT_PUBLIC_SENTRY_REPLAYS_ERROR_SAMPLE_RATE=1.0

# DataDog
NEXT_PUBLIC_DATADOG_APP_ID=your_app_id
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=your_client_token
NEXT_PUBLIC_DATADOG_SITE=datadoghq.com
NEXT_PUBLIC_DATADOG_SESSION_SAMPLE_RATE=100
NEXT_PUBLIC_DATADOG_REPLAY_SAMPLE_RATE=20
NEXT_PUBLIC_DATADOG_ENABLE_LOGS=true

# General
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_VERSION=1.0.0
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_API_URL=your_api_url

# Alerts
SLACK_WEBHOOK_URL=your_slack_webhook
ALERT_EMAIL=alerts@example.com
PAGERDUTY_INTEGRATION_KEY=your_pagerduty_key
```

### 3. Initialize Monitoring

The monitoring system auto-initializes. To manually control:

```typescript
import { initializeMonitoring, setUserContext } from '@/monitoring/init';

// Initialize (usually done automatically)
initializeMonitoring();

// Set user context when user logs in
setUserContext({
  id: user.id,
  role: user.role,
  districtId: user.districtId,
  schoolId: user.schoolId,
});

// Clear context on logout
setUserContext(null);
```

### 4. Add Error Boundary

Wrap your app with ErrorBoundary:

```typescript
import { ErrorBoundary } from '@/monitoring/components';

export default function App({ children }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
```

### 5. Use Monitoring Hooks

```typescript
import { useErrorTracking, useAnalytics, usePerformanceMonitoring } from '@/monitoring/hooks';

function MyComponent() {
  const { reportError } = useErrorTracking();
  const { track, healthcare } = useAnalytics();
  const { measureAsync } = usePerformanceMonitoring({ componentName: 'MyComponent' });

  const handleAction = async () => {
    try {
      const result = await measureAsync('fetchData', () => fetchData());
      track('data_fetched', 'user_action', 'fetch', { resultCount: result.length });
    } catch (error) {
      reportError(error, { context: 'handleAction' });
    }
  };

  return <button onClick={handleAction}>Fetch Data</button>;
}
```

## Services

### Sentry

```typescript
import * as Sentry from '@/monitoring/sentry';

// Capture exception
Sentry.captureException(error, { context: 'custom_context' });

// Capture message
Sentry.captureMessage('Important event', 'info', { userId: '123' });

// Add breadcrumb
Sentry.addBreadcrumb('User clicked button', 'user_action', 'info', { buttonId: 'submit' });

// Healthcare-specific tracking
Sentry.healthcare.medicationError(error, medicationId, studentId);
Sentry.healthcare.phiAccess('read', 'health_record', recordId);
```

### Performance

```typescript
import * as Performance from '@/monitoring/performance';

// Track metric
Performance.trackMetric('api_response_time', 250, 'ms');

// Track component render
Performance.trackComponentRender('MyComponent', 15);

// Track API call
Performance.trackAPICall('/api/students', 180, 200);

// Measure async operation
await Performance.measureAsync('fetchStudents', async () => {
  return await fetch('/api/students');
});

// Get Web Vitals
const vitals = Performance.getWebVitals();
```

### Analytics

```typescript
import * as Analytics from '@/monitoring/analytics';

// Track page view
Analytics.trackPageView('/students');

// Track user action
Analytics.trackAction('click', 'submit_button', { formId: 'student_form' });

// Track search
Analytics.trackSearch('john doe', 5, { filter: 'active' });

// Healthcare-specific tracking
Analytics.healthcare.medicationAdministered(medicationId, true);
Analytics.healthcare.healthRecordAccessed(recordId, 'immunization');
Analytics.healthcare.phiAccessed('health_record', 'view');
```

### Logger

```typescript
import * as Logger from '@/monitoring/logger';

// Log messages
Logger.debug('Debug message', { context: 'value' });
Logger.info('Info message', { userId: '123' });
Logger.warn('Warning message', { warning: 'details' });
Logger.error('Error occurred', errorObject, { context: 'value' });
Logger.fatal('Fatal error', errorObject, { context: 'value' });

// Create child logger with context
const childLogger = Logger.createChildLogger({ module: 'authentication' });
childLogger.info('User logged in', { userId: '123' });

// Healthcare-specific logging
Logger.healthcare.medicationAdministered(medicationId, true);
Logger.healthcare.phiAccessed('health_record', recordId, 'view');
```

### Health Check

```typescript
import * as HealthCheck from '@/monitoring/health-check';

// Start monitoring
HealthCheck.startHealthMonitoring(apiUrl);

// Get current status
const status = HealthCheck.getHealthStatus();

// Force health check
await HealthCheck.forceHealthCheck();

// Subscribe to changes
const unsubscribe = HealthCheck.onHealthChange((status) => {
  console.log('Health status changed:', status);
});

// Check connectivity
const isOnline = await HealthCheck.checkConnectivity();
```

## Components

### ErrorBoundary

```typescript
import { ErrorBoundary } from '@/monitoring/components';

<ErrorBoundary
  fallback={(error, errorInfo) => <CustomErrorUI error={error} />}
  onError={(error, errorInfo) => console.error('Error caught:', error)}
  context={{ page: 'students' }}
  showDetails={process.env.NODE_ENV === 'development'}
>
  <YourApp />
</ErrorBoundary>
```

### PerformanceMonitor

```typescript
import { PerformanceMonitor } from '@/monitoring/components';

<PerformanceMonitor
  showBadge={process.env.NODE_ENV === 'development'}
  position="bottom-right"
  onMetric={(metric) => console.log('Metric:', metric)}
/>
```

### HealthIndicator

```typescript
import { HealthIndicator } from '@/monitoring/components';

<HealthIndicator
  showDetails={true}
  position="top-right"
/>
```

## Hooks

### useErrorTracking

```typescript
const { reportError, wrapAsync, wrapSync } = useErrorTracking({
  context: { page: 'students' },
  tags: { feature: 'student_management' },
  onError: (error) => console.error('Error:', error),
});

// Report error manually
reportError(new Error('Something went wrong'), { action: 'submit' });

// Wrap async function
const safeAsyncFn = wrapAsync(async () => {
  // Your async code
});

// Wrap sync function
const safeSyncFn = wrapSync(() => {
  // Your sync code
});
```

### usePerformanceMonitoring

```typescript
const { measureAsync, measure } = usePerformanceMonitoring({
  componentName: 'StudentList',
  trackRenders: true,
  trackMounts: true,
  warnThreshold: 16, // ms
});

// Measure async operation
await measureAsync('loadStudents', async () => {
  return await fetchStudents();
});

// Measure sync operation
const result = measure('processData', () => {
  return processData(data);
});
```

### useAnalytics

```typescript
const { track, trackButtonClick, trackForm, healthcare } = useAnalytics();

// Track generic event
track('student_created', 'user_action', 'create', { studentId: '123' });

// Track button click
trackButtonClick('submit_button', { formId: 'student_form' });

// Track form submission
trackForm('student_form', { success: true });

// Healthcare tracking
healthcare.medicationAdministered(medicationId, true);
```

### useHealthCheck

```typescript
const { status, isHealthy, check } = useHealthCheck({ autoCheck: true });

// Force health check
await check();

// Check specific status
if (!status.checks.api) {
  console.log('API is down');
}
```

## Configuration

### Monitoring Config

```typescript
import { initMonitoring } from '@/monitoring';

initMonitoring({
  sentry: {
    dsn: 'your_sentry_dsn',
    environment: 'production',
    tracesSampleRate: 0.1,
  },
  datadog: {
    applicationId: 'your_app_id',
    clientToken: 'your_token',
    service: 'white-cross-frontend',
    env: 'production',
  },
  analytics: {
    autoTrack: true,
  },
  logging: {
    level: 'info',
    enableConsole: false,
    enableRemote: true,
  },
  performance: {
    enabled: true,
  },
  healthCheck: {
    enabled: true,
    apiUrl: 'https://api.whitecross.com',
  },
});
```

### Alert Config

```typescript
import { registerAlert } from '@/monitoring/alerts';

registerAlert({
  id: 'high-error-rate',
  name: 'High Error Rate',
  type: 'error_rate',
  threshold: 10,
  window: 300, // 5 minutes
  channels: ['slack', 'email', 'pagerduty'],
  enabled: true,
});
```

## PHI Compliance

All monitoring data is automatically sanitized to remove Protected Health Information (PHI) before being sent to external services.

### PHI Sanitization

The PHI sanitizer automatically detects and removes:
- Social Security Numbers
- Email addresses
- Phone numbers
- Medical Record Numbers
- Date of Birth
- Names
- Addresses
- Insurance numbers
- Diagnosis codes
- Prescription numbers

### Usage

```typescript
import { sanitizeObject, sanitizeString, sanitizeError } from '@/monitoring/utils/phi-sanitizer';

// Sanitize object
const sanitized = sanitizeObject(userData, { strictMode: true });

// Sanitize string
const cleanString = sanitizeString('Patient John Doe, SSN: 123-45-6789');

// Sanitize error
const cleanError = sanitizeError(error);

// Validate sanitization
const { isClean, violations } = validateSanitization(data);
```

## Alert System

### Default Alerts

- **High Error Rate**: Triggers when error rate exceeds 10 errors in 5 minutes
- **Poor LCP Performance**: Triggers when LCP exceeds 4 seconds
- **High API Latency**: Triggers when API response time exceeds 2 seconds
- **Medication Errors**: Triggers on any medication administration error
- **Compliance Violations**: Triggers immediately on compliance violations

### Notification Channels

- **Slack**: Real-time notifications via webhook
- **Email**: Email alerts to configured addresses
- **PagerDuty**: Critical alerts for on-call engineers

### Custom Alerts

```typescript
import { registerAlert, checkMetric } from '@/monitoring/alerts';

// Register custom alert
registerAlert({
  id: 'custom-alert',
  name: 'Custom Metric Alert',
  type: 'custom',
  threshold: 100,
  window: 600,
  channels: ['slack'],
  enabled: true,
});

// Check metric manually
checkMetric({
  name: 'custom_metric',
  value: 150,
  unit: 'count',
  timestamp: new Date(),
});
```

## Best Practices

### Error Handling

1. **Always use Error Boundaries** for React components
2. **Report errors with context** for better debugging
3. **Don't log PHI** - use sanitization utilities
4. **Use appropriate severity levels**

### Performance Monitoring

1. **Track critical user paths** (login, medication admin, record access)
2. **Set performance budgets** and monitor against them
3. **Measure before optimizing**
4. **Track both client and server performance**

### Analytics

1. **Track meaningful events** - focus on user value
2. **Use consistent naming** for events
3. **Include relevant context** without PHI
4. **Monitor healthcare-specific metrics**

### Logging

1. **Use appropriate log levels**
2. **Include context** for debugging
3. **Flush logs regularly** to prevent memory issues
4. **Sanitize all log data**

### Health Monitoring

1. **Monitor all critical services**
2. **Set up alerts for degradation**
3. **Test health check endpoints regularly**
4. **Have fallback strategies**

## Admin Dashboard

Access the monitoring dashboard at `/admin/monitoring`:

- **/admin/monitoring/health** - System health overview
- **/admin/monitoring/errors** - Error logs and analysis
- **/admin/monitoring/performance** - Performance metrics
- **/admin/monitoring/users** - User analytics
- **/admin/monitoring/api** - API metrics and errors

## Troubleshooting

### Monitoring not working

1. Check environment variables are set
2. Verify Sentry/DataDog credentials
3. Check browser console for errors
4. Ensure monitoring is initialized

### PHI detected in logs

1. Review sanitization configuration
2. Check custom logging code
3. Validate sanitization with `validateSanitization()`
4. Report issues to security team

### Alerts not firing

1. Check alert configuration
2. Verify notification channel credentials
3. Check alert thresholds
4. Review alert history

## Support

For issues or questions:
- Review this documentation
- Check browser console for errors
- Contact the development team
- Review Sentry/DataDog dashboards

## License

Internal use only - White Cross Healthcare Platform
