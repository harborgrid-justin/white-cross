# White Cross Platform - Integration Guide

## Overview

This guide documents the complete integration layer for the White Cross healthcare platform. All services are wired together to provide a seamless, enterprise-grade experience with HIPAA compliance built in.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Bootstrap Process](#bootstrap-process)
- [Service Integration](#service-integration)
- [Authentication Flow](#authentication-flow)
- [Query Client Configuration](#query-client-configuration)
- [Error Handling](#error-handling)
- [Environment Configuration](#environment-configuration)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

### Service Dependency Graph

```
Page Load
  ↓
bootstrap.ts (Initialization)
  ├── Security Layer
  │   ├── SecureTokenManager (sessionStorage)
  │   └── CsrfProtection
  ├── Audit Service
  │   ├── Batching & Retry
  │   └── localStorage backup
  ├── Cache Layer
  │   ├── CacheManager (LRU)
  │   └── QueryKey Factory
  ├── Persistence Layer
  │   └── IndexedDB (non-PHI only)
  ├── Service Registry
  │   └── Health monitoring
  └── Health Monitor
      ├── Degradation detection
      └── Performance metrics
  ↓
App.tsx
  ├── GlobalErrorBoundary
  ├── QueryClientProvider
  ├── Redux Provider
  └── AuthProvider
      ├── Login/Logout
      ├── Token management
      └── Audit logging
```

### Key Components

1. **bootstrap.ts** - Initializes all services in correct order
2. **queryClient.ts** - Configures TanStack Query with advanced features
3. **GlobalErrorBoundary.tsx** - Catches and handles React errors
4. **AuthContext.enhanced.tsx** - Authentication with full service integration
5. **.env.example** - Comprehensive environment configuration

## Bootstrap Process

### Initialization Order

The bootstrap process initializes services in this specific order to handle dependencies correctly:

1. **Security Layer** (Critical)
   - SecureTokenManager
   - CSRF Protection

2. **Audit Service** (Pre-PHI)
   - Must be ready before any PHI operations
   - Batching and retry configured

3. **Cache Layer**
   - In-memory cache with LRU eviction
   - Tag-based invalidation

4. **Persistence Layer**
   - IndexedDB for offline support
   - Excludes PHI data

5. **Service Registry**
   - Registers all API services
   - Health check configuration

6. **Health Monitor** (Post-setup)
   - Monitors all services
   - Degradation detection

### Usage

```typescript
import { initializeApp } from './bootstrap';

// Before rendering React
const result = await initializeApp({
  enableAuditLogging: true,
  enableCaching: true,
  enableMonitoring: true,
  enablePersistence: true,
  debug: import.meta.env.DEV,
});

if (!result.success) {
  console.error('Bootstrap failed:', result.errors);
}
```

### Bootstrap Result

```typescript
interface BootstrapResult {
  success: boolean;
  services: {
    tokenManager: boolean;
    csrf: boolean;
    audit: boolean;
    cache: boolean;
    serviceRegistry: boolean;
    healthMonitor: boolean;
    persistence: boolean;
  };
  errors: string[];
  timestamp: number;
  duration: number;
}
```

## Service Integration

### SecureTokenManager

Manages JWT tokens securely using sessionStorage.

**Features:**
- Automatic expiration validation
- Inactivity timeout (8 hours)
- Thread-safe singleton
- Migration from localStorage

**Usage:**
```typescript
import { secureTokenManager } from '@/services/security/SecureTokenManager';

// Store token
secureTokenManager.setToken(token, refreshToken, expiresIn);

// Get token (validates expiration)
const token = secureTokenManager.getToken();

// Check validity
if (secureTokenManager.isTokenValid()) {
  // Token is valid
}

// Clear on logout
secureTokenManager.clearTokens();
```

### CSRF Protection

Automatic CSRF token injection for state-changing requests.

**Features:**
- Auto-injection for POST, PUT, PATCH, DELETE
- Meta tag or cookie extraction
- Token caching and refresh

**Usage:**
```typescript
import { csrfProtection, setupCsrfProtection } from '@/services/security/CsrfProtection';
import { apiInstance } from '@/services/config/apiConfig';

// Setup (done automatically in bootstrap)
setupCsrfProtection(apiInstance);

// Manual refresh
csrfProtection.refreshToken();

// Clear on logout
csrfProtection.clearToken();
```

### Audit Service

HIPAA-compliant audit logging with batching and retry.

**Features:**
- Automatic batching (10 events or 30 seconds)
- Exponential backoff retry
- localStorage backup when offline
- Tamper-evident checksums

**Usage:**
```typescript
import { auditService } from '@/services/audit/AuditService';

// Set user context after login
auditService.setUserContext({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
});

// Log PHI access
await auditService.logPHIAccess(
  'VIEW',
  studentId,
  'HEALTH_RECORD',
  recordId
);

// Log PHI modification
await auditService.logPHIModification(
  'UPDATE',
  studentId,
  'HEALTH_RECORD',
  recordId,
  changes
);

// Flush manually (auto-flushed on critical events)
await auditService.flush();

// Clear on logout
auditService.clearUserContext();
```

### Cache Manager

Enterprise cache with LRU eviction and tag-based invalidation.

**Features:**
- LRU eviction (max 100 items)
- TTL-based expiration
- Tag-based invalidation
- PHI-aware caching
- Size tracking

**Usage:**
```typescript
import { getCacheManager } from '@/services/cache/CacheManager';

const cache = getCacheManager();

// Store data
cache.set('students:123', studentData, {
  ttl: 5 * 60 * 1000, // 5 minutes
  tags: ['students', 'student:123'],
  containsPHI: true,
});

// Retrieve data
const data = cache.get('students:123');

// Invalidate by tags
cache.invalidate({ tags: ['students'] });

// Get statistics
const stats = cache.getStats();
```

### Health Monitor

Tracks endpoint health and detects degradation.

**Features:**
- Success/failure rate tracking
- Response time percentiles (p95, p99)
- Timeout detection
- Degradation alerts

**Usage:**
```typescript
import { getGlobalHealthMonitor } from '@/services/resilience/HealthMonitor';

const monitor = getGlobalHealthMonitor();

// Record success (done automatically)
monitor.recordSuccess('/api/students', 150);

// Record failure
monitor.recordFailure('/api/students', 3000);

// Get health report
const report = monitor.getHealthReport();

// Listen to degradation events
monitor.onEvent((event) => {
  if (event.type === 'healthDegradation') {
    console.warn('Service degraded:', event.endpoint, event.details);
  }
});
```

## Authentication Flow

### Login Process

1. User submits credentials
2. AuthContext calls `authApi.login()`
3. Token stored in SecureTokenManager
4. CSRF token refreshed
5. Audit service initialized with user context
6. Audit log: LOGIN event
7. User state updated

### Logout Process

1. User clicks logout
2. Audit log: LOGOUT event
3. Audit events flushed
4. Backend logout API called
5. Tokens cleared from SecureTokenManager
6. CSRF token cleared
7. PHI cache cleared
8. Audit service user context cleared

### Session Expiration

1. Background check every 60 seconds
2. If token expired or inactive > 8 hours:
   - Clear all tokens
   - Clear PHI cache
   - Show session expired modal
   - Audit log: SESSION_EXPIRED

## Query Client Configuration

### Advanced Features

- **Granular Invalidation**: Tag-based cache invalidation
- **PHI Exclusion**: PHI data excluded from persistence
- **Audit Integration**: Automatic audit logging for queries/mutations
- **Error Handling**: User-friendly error messages
- **Retry Logic**: Exponential backoff with configurable retries

### Query Meta Options

```typescript
interface QueryMeta {
  containsPHI?: boolean;           // Exclude from persistence
  cacheTags?: string[];            // For invalidation
  auditLog?: boolean;              // Enable audit logging
  errorMessage?: string;           // Custom error message
  staleTimeOverride?: number;      // Custom stale time
  cacheTimeOverride?: number;      // Custom cache time
}
```

### Usage Examples

```typescript
import { useQuery } from '@tanstack/react-query';
import { STUDENT_QUERY_META } from '@/config/queryClient';

// Student query with PHI meta
const { data } = useQuery({
  queryKey: ['students', studentId],
  queryFn: () => fetchStudent(studentId),
  meta: STUDENT_QUERY_META, // Contains PHI, audit log, cache tags
});

// Mutation with success handling
const mutation = useMutation({
  mutationFn: updateStudent,
  meta: {
    affectsPHI: true,
    auditAction: 'UPDATE',
    resourceType: 'STUDENT',
    successMessage: 'Student updated successfully',
    invalidateKeys: [['students'], ['students', studentId]],
  },
});
```

### Cache Invalidation

```typescript
import { invalidateByTags, clearPHICache } from '@/config/queryClient';

// Invalidate by tags
await invalidateByTags(['students']);

// Clear all PHI data (on logout)
clearPHICache();

// Clear specific queries
queryClient.invalidateQueries({ queryKey: ['students'] });
```

## Error Handling

### Global Error Boundary

Catches all React errors with HIPAA-compliant error handling.

**Features:**
- Sanitizes error messages (removes PHI)
- Audit logging integration
- User-friendly fallback UI
- Recovery options
- Critical error detection

**Customization:**

```typescript
<GlobalErrorBoundary
  enableAuditLogging={true}
  fallback={(error, errorInfo, reset) => (
    <CustomErrorUI error={error} onReset={reset} />
  )}
  onError={(error, errorInfo) => {
    // Custom error handling
  }}
>
  <App />
</GlobalErrorBoundary>
```

### Error Handling Hook

```typescript
import { useErrorHandler } from '@/components/errors/GlobalErrorBoundary';

function MyComponent() {
  const throwError = useErrorHandler();

  const handleAction = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      throwError(error); // Caught by error boundary
    }
  };
}
```

## Environment Configuration

See `.env.example` for complete configuration options.

### Key Variables

```bash
# API
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_TIMEOUT=30000

# Security
VITE_AUTH_SESSION_TIMEOUT=28800000  # 8 hours
VITE_CSRF_ENABLED=true
VITE_SECURE_STORAGE_ENABLED=true

# Caching
VITE_CACHE_MAX_SIZE=100
VITE_CACHE_MAX_MEMORY=52428800  # 50MB
VITE_ENABLE_QUERY_PERSISTENCE=true

# Audit Logging
VITE_ENABLE_AUDIT_LOGGING=true
VITE_AUDIT_BATCH_SIZE=10
VITE_AUDIT_BATCH_INTERVAL=30000  # 30 seconds

# Health Monitoring
VITE_ENABLE_HEALTH_MONITORING=true
VITE_CIRCUIT_BREAKER_THRESHOLD=5
```

## Usage Examples

### Complete Auth Flow

```typescript
import { useAuthContext } from '@/contexts/AuthContext.enhanced';

function LoginPage() {
  const { login, loading } = useAuthContext();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Automatic: token storage, CSRF refresh, audit logging
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function LogoutButton() {
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    // Automatic: audit flush, token clearing, PHI cache clear
  };
}
```

### API Service with Full Integration

```typescript
import { BaseApiService } from '@/services/core/BaseApiService';
import { auditService } from '@/services/audit/AuditService';

class StudentsService extends BaseApiService {
  async getStudent(id: string) {
    try {
      // Audit log PHI access
      await auditService.logPHIAccess('VIEW', id, 'STUDENT');

      // API call with automatic token, CSRF, health monitoring
      const response = await this.get(`/students/${id}`);

      return response.data;
    } catch (error) {
      // Audit log failure
      await auditService.logFailure(
        { action: 'VIEW', resourceType: 'STUDENT' },
        error
      );
      throw error;
    }
  }
}
```

### Cache-First Data Loading

```typescript
import { useQuery } from '@tanstack/react-query';
import { getCacheManager } from '@/services/cache/CacheManager';

function useStudent(id: string) {
  const cache = getCacheManager();

  return useQuery({
    queryKey: ['students', id],
    queryFn: async () => {
      // Check cache first
      const cached = cache.get(`student:${id}`);
      if (cached) return cached;

      // Fetch from API
      const data = await fetchStudent(id);

      // Store in cache
      cache.set(`student:${id}`, data, {
        tags: ['students', `student:${id}`],
        ttl: 5 * 60 * 1000,
        containsPHI: true,
      });

      return data;
    },
    meta: {
      containsPHI: true,
      cacheTags: ['students'],
      auditLog: true,
    },
  });
}
```

## Troubleshooting

### Bootstrap Failures

**Issue**: Bootstrap fails with errors

**Solutions**:
1. Check browser console for specific errors
2. Verify environment variables are set
3. Check network connectivity
4. Clear browser cache and sessionStorage
5. Check bootstrap result object for details

### Token Expiration

**Issue**: User logged out unexpectedly

**Solutions**:
1. Check `VITE_AUTH_SESSION_TIMEOUT` setting
2. Verify backend token expiration matches frontend
3. Check for inactivity timeout (8 hours default)
4. Review audit logs for SESSION_EXPIRED events

### Cache Issues

**Issue**: Stale or missing data

**Solutions**:
1. Check cache stats: `getCacheManager().getStats()`
2. Verify TTL settings
3. Check if PHI data is being cached (shouldn't persist)
4. Invalidate by tags: `invalidateByTags(['tag'])`
5. Clear cache: `getCacheManager().clear()`

### Audit Logging Issues

**Issue**: Audit events not being logged

**Solutions**:
1. Verify `VITE_ENABLE_AUDIT_LOGGING=true`
2. Check audit service status: `auditService.getStatus()`
3. Flush manually: `await auditService.flush()`
4. Check localStorage for failed events
5. Verify backend endpoint is accessible

### Health Monitoring

**Issue**: False degradation alerts

**Solutions**:
1. Get health report: `monitor.getHealthReport()`
2. Check degraded endpoints: `monitor.getDegradedEndpoints()`
3. Adjust thresholds: `monitor.updateThresholds({ ... })`
4. Reset endpoint: `monitor.resetEndpoint(endpoint)`

## Performance Optimization

### Best Practices

1. **Use Query Tags**: Enable granular invalidation
2. **Set Appropriate TTLs**: Balance freshness vs performance
3. **Prefetch Data**: Use `safePrefetch` for predictable navigation
4. **Batch Audit Logs**: Use automatic batching (default 10 events)
5. **Monitor Health**: Review health reports regularly
6. **Limit Cache Size**: Adjust `VITE_CACHE_MAX_SIZE` as needed

### Monitoring

```typescript
import { getCacheStats } from '@/config/queryClient';
import { getCacheManager } from '@/services/cache/CacheManager';
import { getGlobalHealthMonitor } from '@/services/resilience/HealthMonitor';

// Query cache stats
console.log('Query Cache:', getCacheStats());

// Memory cache stats
console.log('Memory Cache:', getCacheManager().getStats());

// Health metrics
console.log('Health Report:', getGlobalHealthMonitor().getHealthReport());

// Audit status
console.log('Audit Status:', auditService.getStatus());
```

## Security Considerations

### PHI Data Handling

1. **Never persist PHI**: Always set `containsPHI: true`
2. **Clear on logout**: PHI cache cleared automatically
3. **Audit all access**: Log PHI operations
4. **Sanitize errors**: No PHI in error messages

### Token Security

1. **SessionStorage**: Tokens cleared on browser close
2. **Expiration**: Automatic validation
3. **Inactivity**: 8-hour timeout
4. **Refresh**: Automatic before expiry

### CSRF Protection

1. **Enabled by default**: For all state-changing requests
2. **Meta tag**: Server must provide CSRF token
3. **Auto-refresh**: On authentication changes

## Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [HIPAA Compliance Guide](../docs/HIPAA_COMPLIANCE.md)
- [API Documentation](../backend/README.md)
- [Testing Guide](../frontend/TESTING.md)

## Support

For issues or questions:
- Create a GitHub issue
- Contact: support@whitecross.com
- Internal docs: Confluence Wiki

---

**Last Updated**: 2025-10-21
**Version**: 1.0.0
