# ErrorBoundary Component - Usage Guide

Production-grade error boundary for the incidents module with HIPAA-compliant error handling.

## Features

- **React Error Boundary**: Catches errors in incident components using `componentDidCatch` lifecycle
- **Error State Management**: Tracks error count, timing, and recovery status
- **User-Friendly UI**: Clear error messages with actionable recovery options
- **Development Support**: Stack traces and component stack in development mode
- **HIPAA Compliance**: Automatic PHI sanitization in all error logs and reports
- **Monitoring Integration**: Integrates with ErrorTracker and Logger services
- **Backend Reporting**: Reports errors to backend endpoint in production
- **Recovery Mechanisms**: Retry, reload, and automatic reset for persistent errors
- **Custom Fallback**: Support for custom error UI

## Basic Usage

### Wrap Components

```tsx
import { ErrorBoundary } from '@/pages/incidents/components';

// Wrap any incident component
function IncidentDetailsPage() {
  return (
    <ErrorBoundary>
      <IncidentReportDetails incidentId={123} />
    </ErrorBoundary>
  );
}
```

### Specify Module Context

```tsx
// Help categorize errors by incident sub-module
<ErrorBoundary module="incident-details">
  <IncidentReportDetails incidentId={123} />
</ErrorBoundary>

<ErrorBoundary module="witness-statements">
  <WitnessStatementsList incidentId={123} />
</ErrorBoundary>

<ErrorBoundary module="follow-up-actions">
  <FollowUpActionsList incidentId={123} />
</ErrorBoundary>
```

## Advanced Usage

### Custom Fallback UI

```tsx
import { ErrorBoundary } from '@/pages/incidents/components';

const CustomErrorFallback = () => (
  <div className="p-6 text-center">
    <h2>Incident Data Temporarily Unavailable</h2>
    <p>Please contact IT support if this persists.</p>
  </div>
);

function IncidentsList() {
  return (
    <ErrorBoundary fallback={<CustomErrorFallback />}>
      <IncidentReportsList />
    </ErrorBoundary>
  );
}
```

### Custom Error Handler

```tsx
import { errorTracker } from '@/services/monitoring/ErrorTracker';

function IncidentDashboard() {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Custom error handling logic
    console.log('Dashboard error:', error);

    // Send to custom analytics
    analytics.track('incident_dashboard_error', {
      errorName: error.name,
      timestamp: Date.now(),
    });
  };

  return (
    <ErrorBoundary onError={handleError}>
      <IncidentsDashboard />
    </ErrorBoundary>
  );
}
```

### Reset on Props Change

```tsx
// Automatically reset error state when key props change
function IncidentDetails({ incidentId }: { incidentId: number }) {
  return (
    <ErrorBoundary
      resetKeys={[incidentId]}
      resetOnPropsChange={true}
    >
      <IncidentReportDetails incidentId={incidentId} />
    </ErrorBoundary>
  );
}
```

## Higher-Order Component Pattern

```tsx
import { withErrorBoundary } from '@/pages/incidents/components/ErrorBoundary';

// Wrap component with error boundary
const SafeIncidentDetails = withErrorBoundary(IncidentReportDetails, {
  module: 'incident-details',
});

// Use the wrapped component
function IncidentPage() {
  return <SafeIncidentDetails incidentId={123} />;
}
```

## Hook Pattern for Functional Components

```tsx
import { useErrorHandler } from '@/pages/incidents/components/ErrorBoundary';

function IncidentForm() {
  const throwError = useErrorHandler();

  const handleSubmit = async (data: IncidentData) => {
    try {
      await submitIncident(data);
    } catch (error) {
      // Throw to nearest error boundary
      throwError(error as Error);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Component Props

```typescript
interface ErrorBoundaryProps {
  // Component children to protect
  children: ReactNode;

  // Optional custom fallback UI
  fallback?: ReactNode;

  // Custom error handler callback
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  // Keys that trigger reset when changed
  resetKeys?: Array<string | number>;

  // Auto-reset when children prop changes
  resetOnPropsChange?: boolean;

  // Module identifier for error categorization
  module?: string;
}
```

## Error Handling Features

### Automatic PHI Sanitization

The error boundary automatically sanitizes all error data to prevent PHI leakage:

- Removes prop values from component stacks
- Sanitizes error messages and stack traces
- Redacts student names, IDs, and medical information
- Only shows safe error IDs in production

### Error Categorization

Errors are automatically categorized for monitoring:

- **Business errors**: UI rendering and data display errors
- **Operation**: `incident_ui_render`
- **Resource**: Module name (e.g., "incidents", "witness-statements")
- **Fingerprint**: Unique identifier for error grouping

### Backend Error Reporting

In production, errors are automatically reported to:
```
POST /api/v1/errors/frontend
```

Payload includes:
- Sanitized error details
- Component stack (sanitized)
- User context (anonymized)
- Environment metadata

### Error Recovery

The error boundary provides multiple recovery options:

1. **Try Again**: Reset error state and re-render (for recoverable errors)
2. **Reload Page**: Full page reload (for persistent errors)
3. **Return to Incidents**: Navigate back to incidents list
4. **Auto-reset**: Automatic reset after max error count reached

### Error Count Tracking

- Tracks consecutive errors in the same component
- Shows warning after multiple errors
- Auto-resets after 5 errors to prevent infinite loops
- Provides 60-second reset window

## Development vs Production

### Development Mode

- Full error details displayed in collapsible section
- Error name, message, and stack trace shown
- Component stack included
- Console logging with grouped output
- Verbose error context

### Production Mode

- User-friendly error messages only
- No stack traces or technical details
- Error ID for support reference
- Automatic backend reporting
- PHI-sanitized error logs

## Best Practices

### 1. Granular Error Boundaries

Wrap individual features, not entire pages:

```tsx
// Good - granular boundaries
<div>
  <ErrorBoundary module="incident-list">
    <IncidentReportsList />
  </ErrorBoundary>

  <ErrorBoundary module="incident-stats">
    <IncidentStatistics />
  </ErrorBoundary>
</div>

// Avoid - single boundary for entire page
<ErrorBoundary>
  <div>
    <IncidentReportsList />
    <IncidentStatistics />
    <IncidentTimeline />
  </div>
</ErrorBoundary>
```

### 2. Meaningful Module Names

Use descriptive module identifiers:

```tsx
// Good
<ErrorBoundary module="witness-statements">
<ErrorBoundary module="follow-up-actions">
<ErrorBoundary module="incident-timeline">

// Avoid
<ErrorBoundary module="component1">
<ErrorBoundary module="widget">
```

### 3. Reset Keys for Dynamic Data

Use resetKeys for components that depend on dynamic data:

```tsx
// Reset error boundary when incident changes
<ErrorBoundary resetKeys={[incidentId, studentId]}>
  <IncidentDetails incidentId={incidentId} studentId={studentId} />
</ErrorBoundary>
```

### 4. Custom Fallbacks for Critical UIs

Provide custom fallback UI for critical components:

```tsx
<ErrorBoundary
  fallback={
    <CriticalErrorFallback
      message="Unable to load incident report"
      action="contact-support"
    />
  }
>
  <CriticalIncidentReport />
</ErrorBoundary>
```

## Integration with Monitoring

### ErrorTracker Integration

```typescript
// Automatically tracked:
errorTracker.captureError(error, {
  level: 'error' | 'fatal',
  category: 'business',
  context: {
    operation: 'incident_ui_render',
    resource: module,
    metadata: {
      component: 'ComponentName',
      errorCount: number,
    }
  },
  fingerprint: ['incident-error-boundary', module, errorName, component]
});

// Breadcrumbs added automatically:
errorTracker.addBreadcrumb({
  message: 'Error boundary caught error in {module}',
  category: 'error',
  level: 'error',
  data: { errorName, errorMessage, component }
});
```

### Logger Integration

```typescript
// Structured logging:
logger.error(
  'Incident module error in {component}',
  error,
  {
    module: string,
    component: string,
    errorCount: number,
    timestamp: number,
  }
);
```

## HIPAA Compliance Notes

### PHI Sanitization

The error boundary sanitizes all potentially sensitive data:

1. **Component Stack**: Removes all prop values
2. **Error Messages**: Redacts student names, IDs, medical terms
3. **Stack Traces**: Sanitizes before logging
4. **Backend Reports**: Only sends sanitized data

### Audit Logging

All errors are logged with:
- Anonymized user IDs (hashed)
- Anonymized session IDs
- No PHI in error messages or metadata
- Timestamps for audit trail

### Security

- No PHI in browser console (production)
- No PHI in error monitoring services
- No PHI in backend error reports
- Compliant with HIPAA security rules

## Testing

### Test Error Boundary

```tsx
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/pages/incidents/components/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

test('catches and displays error', () => {
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
});

test('calls onError callback', () => {
  const onError = jest.fn();

  render(
    <ErrorBoundary onError={onError}>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(onError).toHaveBeenCalledWith(
    expect.any(Error),
    expect.objectContaining({ componentStack: expect.any(String) })
  );
});
```

## Troubleshooting

### Error Boundary Not Catching Errors

Error boundaries only catch errors in:
- Component rendering
- Lifecycle methods
- Constructors

They do NOT catch:
- Event handlers (use try-catch)
- Async code (use try-catch or `.catch()`)
- Server-side rendering errors
- Errors in error boundary itself

### Multiple Errors Loop

If you see multiple consecutive errors:
1. Check for data validation issues
2. Review component props and state
3. Look for async race conditions
4. The error boundary will auto-reset after 5 errors

### Error Details Not Showing

In production mode, error details are intentionally hidden:
- Check monitoring service for full details
- Use development mode for debugging
- Reference error ID when contacting support

## Support

For questions or issues with the error boundary:
1. Check error logs in monitoring service
2. Review error ID from production error screen
3. Contact IT support with error reference
4. Check HIPAA compliance documentation

---

**File**: `/frontend/src/pages/incidents/components/ErrorBoundary.tsx`
**Last Updated**: 2025-10-25
**Compliance**: HIPAA-compliant error handling with PHI sanitization
