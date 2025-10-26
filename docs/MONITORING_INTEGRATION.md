# Monitoring Integration Guide

Quick start guide for integrating the monitoring system into your Next.js application.

## 5-Minute Quick Start

### 1. Configure Environment Variables

```bash
# Copy the example file
cp .env.monitoring.example .env.local

# Edit .env.local and add your actual credentials
# At minimum, you need:
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_ENV
```

### 2. Add to Root Layout

```typescript
// src/app/layout.tsx
import { ErrorBoundary } from '@/monitoring/components';
import '@/monitoring/init'; // Auto-initializes monitoring

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### 3. Add Development Tools (Optional)

```typescript
// src/app/layout.tsx
import { PerformanceMonitor, HealthIndicator } from '@/monitoring/components';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>

        {/* Development only */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <PerformanceMonitor showBadge position="bottom-right" />
            <HealthIndicator position="top-right" />
          </>
        )}
      </body>
    </html>
  );
}
```

### 4. Set User Context on Login

```typescript
// src/app/auth/login/actions.ts
import { setUserContext } from '@/monitoring/init';

export async function login(credentials) {
  const user = await authenticateUser(credentials);

  // Set monitoring context
  setUserContext({
    id: user.id,
    role: user.role,
    districtId: user.districtId,
    schoolId: user.schoolId,
  });

  return user;
}

export async function logout() {
  // Clear monitoring context
  setUserContext(null);
}
```

### 5. Start Using Hooks

```typescript
// Any component
import { useAnalytics, useErrorTracking } from '@/monitoring/hooks';

function MyComponent() {
  const { track } = useAnalytics();
  const { reportError } = useErrorTracking();

  const handleAction = async () => {
    try {
      await doSomething();
      track('action_completed', 'user_action', 'complete');
    } catch (error) {
      reportError(error);
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
}
```

That's it! You're now monitoring your application.

## Healthcare-Specific Integration

### Medication Administration

```typescript
import { useAnalytics } from '@/monitoring/hooks';

function MedicationAdmin() {
  const { healthcare } = useAnalytics();

  const administerMedication = async (medicationId: string) => {
    try {
      await api.administerMedication(medicationId);
      healthcare.medicationAdministered(medicationId, true);
    } catch (error) {
      healthcare.medicationError(medicationId, 'administration_failed');
      throw error;
    }
  };
}
```

### Health Record Access

```typescript
import { useAnalytics } from '@/monitoring/hooks';

function HealthRecordView() {
  const { healthcare } = useAnalytics();

  useEffect(() => {
    // Track PHI access for HIPAA compliance
    healthcare.healthRecordAccessed(recordId, 'immunization');
    healthcare.phiAccessed('health_record', 'view');
  }, [recordId]);
}
```

### Emergency Alerts

```typescript
import { useAnalytics } from '@/monitoring/hooks';

function EmergencyButton() {
  const { healthcare } = useAnalytics();

  const triggerEmergency = () => {
    healthcare.emergencyAlert('medical_emergency', 'critical');
    // ... handle emergency
  };
}
```

## Performance Monitoring Integration

### Track Page Performance

```typescript
import { usePageView } from '@/monitoring/hooks';

function StudentListPage() {
  usePageView('/students'); // Automatically tracks page view
  // ... component code
}
```

### Track Component Performance

```typescript
import { usePerformanceMonitoring } from '@/monitoring/hooks';

function HeavyComponent() {
  const { measureAsync } = usePerformanceMonitoring({
    componentName: 'HeavyComponent',
    trackRenders: true,
    warnThreshold: 50, // Warn if render takes > 50ms
  });

  const loadData = async () => {
    await measureAsync('loadData', async () => {
      const data = await fetchLargeDataset();
      setData(data);
    });
  };
}
```

## Error Handling Integration

### Wrap Components

```typescript
import { withErrorBoundary } from '@/monitoring/components';

const MyComponent = () => {
  // Component code
};

export default withErrorBoundary(MyComponent, {
  context: { page: 'students' },
  onError: (error) => console.error('Component error:', error),
});
```

### Manual Error Reporting

```typescript
import { useErrorTracking } from '@/monitoring/hooks';

function DataProcessor() {
  const { reportError, wrapAsync } = useErrorTracking();

  // Option 1: Wrap function
  const processData = wrapAsync(async (data) => {
    return await processHealthData(data);
  });

  // Option 2: Manual reporting
  const manualProcess = async () => {
    try {
      await processHealthData(data);
    } catch (error) {
      reportError(error, { context: 'manual_process' });
    }
  };
}
```

## Custom Alerts

### Register Custom Alert

```typescript
// src/config/monitoring.ts
import { registerAlert } from '@/monitoring/alerts';

export function setupCustomAlerts() {
  registerAlert({
    id: 'high-medication-errors',
    name: 'High Medication Error Rate',
    type: 'custom',
    threshold: 5,
    window: 3600, // 1 hour
    channels: ['slack', 'email', 'pagerduty'],
    enabled: true,
  });
}
```

### Check Custom Metrics

```typescript
import { checkMetric } from '@/monitoring/alerts';
import { trackMetric } from '@/monitoring/performance';

function trackCustomMetric(name: string, value: number) {
  // Track the metric
  const metric = {
    name,
    value,
    unit: 'count' as const,
    timestamp: new Date(),
  };

  trackMetric(name, value, 'count');

  // Check against alerts
  checkMetric(metric);
}
```

## Admin Dashboard Integration

The admin dashboard is already set up at `/admin/monitoring`. To add custom pages:

```typescript
// src/app/admin/monitoring/custom/page.tsx
'use client';

import { useHealthCheck } from '@/monitoring/hooks';
import { getWebVitals } from '@/monitoring/performance';

export default function CustomMonitoringPage() {
  const { status } = useHealthCheck();
  const vitals = getWebVitals();

  return (
    <div>
      <h1>Custom Monitoring</h1>
      {/* Your custom monitoring UI */}
    </div>
  );
}
```

## Testing Monitoring

### Test Error Tracking

```typescript
// Test component
function ErrorTest() {
  const throwError = () => {
    throw new Error('Test error for monitoring');
  };

  return <button onClick={throwError}>Trigger Error</button>;
}
```

### Test Performance Tracking

```typescript
import { trackMetric } from '@/monitoring/performance';

function performanceTest() {
  trackMetric('test_metric', 100, 'ms', { test: true });
  console.log('Metric tracked');
}
```

### Test Analytics

```typescript
import { trackEvent } from '@/monitoring/analytics';

function analyticsTest() {
  trackEvent('test_event', 'user_action', 'test', { test: true });
  console.log('Event tracked');
}
```

## Troubleshooting

### Monitoring not initializing

1. Check that `@/monitoring/init` is imported in your root layout
2. Verify environment variables are set
3. Check browser console for errors
4. Ensure you're running in browser (not SSR)

### Sentry not receiving errors

1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Check Sentry project settings
3. Ensure ErrorBoundary is wrapping your app
4. Check browser network tab for failed requests

### DataDog not showing data

1. Verify `NEXT_PUBLIC_DATADOG_APP_ID` and `NEXT_PUBLIC_DATADOG_CLIENT_TOKEN`
2. Check DataDog RUM application settings
3. Verify site URL matches your configuration
4. Check browser console for DataDog errors

### PHI appearing in logs

1. Review your custom logging code
2. Use `validateSanitization()` to check data
3. Report to security team immediately
4. Review PHI sanitization patterns in `phi-sanitizer.ts`

## Production Checklist

- [ ] Environment variables configured
- [ ] Sentry DSN set and tested
- [ ] DataDog credentials set and tested
- [ ] Alert channels configured (Slack, Email, PagerDuty)
- [ ] Error boundary added to root layout
- [ ] User context set on login/logout
- [ ] Healthcare events tracked
- [ ] PHI sanitization validated
- [ ] Performance budgets set
- [ ] Custom alerts configured
- [ ] Admin dashboard tested
- [ ] Development indicators removed (or conditional)

## Resources

- **Full Documentation**: `src/monitoring/README.md`
- **Setup Summary**: `MONITORING_SETUP.md`
- **Environment Example**: `.env.monitoring.example`
- **Type Definitions**: `src/monitoring/types.ts`

## Support

For issues or questions:
1. Review documentation in `src/monitoring/README.md`
2. Check troubleshooting section above
3. Review browser console for errors
4. Check Sentry/DataDog dashboards
5. Contact development team

## Next Steps

1. Configure external services (Sentry, DataDog)
2. Set up alert channels
3. Customize alerts for your use cases
4. Add healthcare-specific tracking
5. Monitor and iterate based on data
