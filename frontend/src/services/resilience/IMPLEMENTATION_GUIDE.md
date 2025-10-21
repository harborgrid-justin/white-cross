# Resilience Infrastructure Implementation Guide

## Quick Start

### 1. Basic Usage with Resilient API Client

```typescript
import { apiClient } from '@/services/core/ApiClient';
import { createResilientApiClient } from '@/services/core/ResilientApiClient';
import { HealthcareOperationType } from '@/services/resilience';

// Create resilient wrapper
const resilientClient = createResilientApiClient(apiClient);

// Use with automatic resilience patterns
const medications = await resilientClient.get(
  '/api/medications',
  HealthcareOperationType.MEDICATION_ADMINISTRATION
);
```

### 2. Medication Administration (Critical Operation)

```typescript
// Ensure no duplicate medication records
const administered = await resilientClient.post(
  '/api/medications/administer',
  { studentId, medicationId, dosage },
  HealthcareOperationType.MEDICATION_ADMINISTRATION  // 5s timeout, 1 retry, CRITICAL
);
```

### 3. Allergy Check Before Medication

```typescript
// Quick allergy check before dispensing
const allergies = await resilientClient.get(
  `/api/students/${studentId}/allergies`,
  HealthcareOperationType.ALLERGY_CHECK  // 5s timeout, 2 retries, CRITICAL
);

if (allergies.data.some(a => isConcern(a, medication))) {
  throw new Error('Allergy conflict detected');
}
```

### 4. Emergency Alert

```typescript
// Fastest possible notification
await resilientClient.post(
  '/api/emergency/alert',
  { studentId, incidentType, severity },
  HealthcareOperationType.EMERGENCY_ALERT  // 3s timeout, 2 retries, CRITICAL
);
```

### 5. Health Records Read

```typescript
// Retrieve patient health data
const records = await resilientClient.get(
  `/api/students/${studentId}/health-records`,
  HealthcareOperationType.HEALTH_RECORD_READ  // 15s timeout, 3 retries, HIGH
);
```

## Advanced Configuration

### Custom Resilience Configuration

```typescript
import { createResilientApiClient } from '@/services/core/ResilientApiClient';
import { apiClient } from '@/services/core/ApiClient';
import { CircuitBreakerState, OperationPriority } from '@/services/resilience';

// Create with custom configuration
const resilientClient = createResilientApiClient(apiClient, {
  enableCircuitBreaker: true,
  enableBulkhead: true,
  enableDeduplication: true,
  enableHealthMonitoring: true,
  defaultTimeout: 10000,
  circuitBreaker: {
    failureThreshold: 5,
    successThreshold: 3,
    timeout: 60000,
    monitoringWindow: 10000,
    excludedErrors: [400, 401, 403, 404],
    isErrorRetryable: (error) => {
      // Custom retry logic
      return !(error instanceof ValidationError);
    }
  },
  bulkhead: {
    criticalMaxConcurrent: 10,
    highMaxConcurrent: 20,
    normalMaxConcurrent: 30,
    lowMaxConcurrent: 10,
    maxQueuedPerPriority: 50,
    operationTimeout: 30000,
    rejectWhenFull: true
  },
  onError: (error) => {
    // Send to error tracking service
    Sentry.captureException(error);
  },
  onEvent: (event) => {
    // Send to monitoring dashboard
    analyticsService.track('resilience_event', event);
  }
});
```

### Custom Resilience Hook

```typescript
import { apiClient } from '@/services/core/ApiClient';
import { ResilienceHook } from '@/services/core/ApiClient';

const hook: ResilienceHook = {
  beforeRequest: async (config) => {
    // Pre-request validation
    console.log(`Executing ${config.method} ${config.url}`);
  },
  afterSuccess: (result) => {
    // Record metrics
    metrics.recordSuccess(result.url, result.duration);
  },
  afterFailure: (error) => {
    // Handle failures
    console.error(`Failed after ${error.duration}ms:`, error.error);
  }
};

apiClient.setResilienceHook(hook);
```

## Monitoring and Alerting

### Health Dashboard

```typescript
import { createResilientApiClient } from '@/services/core/ResilientApiClient';

export function getDashboardMetrics(resilientClient: ResilientApiClient) {
  const health = resilientClient.getHealthReport();
  const cbMetrics = resilientClient.getCircuitBreakerMetrics();
  const bhMetrics = resilientClient.getBulkheadMetrics();
  const dedupMetrics = resilientClient.getDeduplicationMetrics();

  return {
    // Overall Platform Health
    platform: {
      healthScore: health.overallHealthScore,
      degradedEndpoints: health.degradedCount,
      totalEndpoints: health.totalEndpoints
    },

    // Circuit Breaker Status
    circuitBreakers: {
      open: Array.from(cbMetrics.entries())
        .filter(([_, m]) => m.state === 'OPEN')
        .map(([ep, _]) => ep),
      halfOpen: Array.from(cbMetrics.entries())
        .filter(([_, m]) => m.state === 'HALF_OPEN')
        .map(([ep, _]) => ep)
    },

    // Bulkhead Status
    bulkhead: {
      activeCritical: bhMetrics.activeByCriticality.CRITICAL,
      activeHigh: bhMetrics.activeByCriticality.HIGH,
      queuedCritical: bhMetrics.queuedByCriticality.CRITICAL,
      rejections: bhMetrics.totalRejected
    },

    // Deduplication Stats
    deduplication: {
      duplicatePercentage: dedupMetrics.duplicatedPercentage,
      savedRequests: dedupMetrics.savedRequests,
      totalRequests: dedupMetrics.totalRequests
    }
  };
}
```

### Alert Configuration

```typescript
import { getGlobalHealthMonitor } from '@/services/resilience';

const monitor = getGlobalHealthMonitor();

// Listen for degradation
monitor.onEvent((event) => {
  if (event.type === 'healthDegradation') {
    const alert = event.details as DegradationAlert;

    // Critical alerts
    if (alert.severity === 'critical') {
      notificationService.sendAlert({
        level: 'critical',
        title: `Critical endpoint degradation: ${event.endpoint}`,
        message: alert.message,
        endpoint: event.endpoint,
        details: alert
      });
    }

    // Log for analysis
    analyticsService.logDegradation(alert);
  }
});
```

## Integration with Service Layer

### Example: Medications Service

```typescript
import { createResilientApiClient } from '@/services/core/ResilientApiClient';
import { apiClient } from '@/services/core/ApiClient';
import { HealthcareOperationType } from '@/services/resilience';

class MedicationsService {
  private resilientClient: ResilientApiClient;

  constructor() {
    this.resilientClient = createResilientApiClient(apiClient);
  }

  // Medication administration - CRITICAL
  async administerMedication(studentId: string, medicationId: string, dosage: string) {
    return this.resilientClient.post(
      '/api/medications/administer',
      { studentId, medicationId, dosage },
      HealthcareOperationType.MEDICATION_ADMINISTRATION
    );
  }

  // Check allergies - CRITICAL
  async checkAllergies(studentId: string, medicationId: string) {
    return this.resilientClient.get(
      `/api/students/${studentId}/allergies?medicationId=${medicationId}`,
      HealthcareOperationType.ALLERGY_CHECK
    );
  }

  // Get inventory - NORMAL
  async getInventory(page: number = 1, limit: number = 20) {
    return this.resilientClient.get(
      `/api/medications/inventory?page=${page}&limit=${limit}`,
      HealthcareOperationType.STUDENT_LOOKUP // Use NORMAL priority
    );
  }

  // Get metrics for UI
  getHealthMetrics() {
    return {
      health: this.resilientClient.getHealthReport(),
      bulkhead: this.resilientClient.getBulkheadMetrics(),
      dedup: this.resilientClient.getDeduplicationMetrics()
    };
  }
}

export const medicationsService = new MedicationsService();
```

### Example: Health Records Service

```typescript
class HealthRecordsService {
  private resilientClient: ResilientApiClient;

  constructor() {
    this.resilientClient = createResilientApiClient(apiClient);
  }

  // Read records - HIGH priority
  async getStudentRecords(studentId: string, filter?: string) {
    return this.resilientClient.get(
      `/api/students/${studentId}/health-records${filter ? `?filter=${filter}` : ''}`,
      HealthcareOperationType.HEALTH_RECORD_READ
    );
  }

  // Write records - HIGH priority with minimal retries
  async createRecord(studentId: string, data: HealthRecordData) {
    return this.resilientClient.post(
      `/api/students/${studentId}/health-records`,
      data,
      HealthcareOperationType.HEALTH_RECORD_WRITE
    );
  }

  // Vital signs - HIGH priority
  async recordVitalSigns(studentId: string, vitals: VitalSigns) {
    return this.resilientClient.post(
      `/api/students/${studentId}/vital-signs`,
      vitals,
      HealthcareOperationType.VITAL_SIGNS
    );
  }
}
```

## Testing Resilience Patterns

### Unit Test: Circuit Breaker

```typescript
import { CircuitBreaker } from '@/services/resilience';
import { describe, it, expect, vi } from 'vitest';

describe('CircuitBreaker', () => {
  it('should open after failures threshold', async () => {
    const breaker = new CircuitBreaker('/api/test', {
      failureThreshold: 2,
      successThreshold: 1,
      timeout: 100,
      monitoringWindow: 1000
    });

    // Cause failures
    const operation = vi.fn().mockRejectedValue(new Error('Failed'));

    for (let i = 0; i < 2; i++) {
      try {
        await breaker.execute(operation);
      } catch (e) {
        // Expected
      }
    }

    expect(breaker.isOpen()).toBe(true);

    // Next request should fail immediately
    await expect(breaker.execute(operation)).rejects.toThrow('Circuit breaker is OPEN');
    expect(operation).toHaveBeenCalledTimes(2); // Not called again
  });

  it('should transition to HALF_OPEN after timeout', async () => {
    const breaker = new CircuitBreaker('/api/test', {
      failureThreshold: 1,
      successThreshold: 1,
      timeout: 100,
      monitoringWindow: 1000
    });

    const operation = vi.fn().mockRejectedValue(new Error('Failed'));
    await breaker.execute(operation).catch(() => {});

    expect(breaker.isOpen()).toBe(true);

    // Wait for timeout
    await new Promise(r => setTimeout(r, 150));

    expect(breaker.isHalfOpen()).toBe(true);
  });
});
```

### Integration Test: Full Resilience Stack

```typescript
describe('ResilientApiClient - Full Stack', () => {
  it('should prevent duplicate requests', async () => {
    const client = createResilientApiClient(apiClient);
    const mockFetch = vi.fn().mockResolvedValue({ success: true, data: 'result' });

    const promise1 = client.get(
      '/api/test',
      undefined,
      undefined
    );
    const promise2 = client.get(
      '/api/test',
      undefined,
      undefined
    );

    const [result1, result2] = await Promise.all([promise1, promise2]);

    expect(result1).toEqual(result2);
    // Should only fetch once
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should isolate critical operations', async () => {
    const client = createResilientApiClient(apiClient);

    // Fill bulkhead with normal priority
    const blocker = client.post(
      '/api/test/normal',
      {},
      HealthcareOperationType.STUDENT_LOOKUP
    );

    // Critical should still execute
    const critical = client.post(
      '/api/test/critical',
      {},
      HealthcareOperationType.MEDICATION_ADMINISTRATION
    );

    const [result] = await Promise.all([critical, blocker.catch(() => {})]);
    expect(result).toBeDefined();
  });
});
```

## Performance Tuning

### High-Throughput Scenario

For high request volumes:

```typescript
const config: ResilienceConfig = {
  enableCircuitBreaker: true,
  enableBulkhead: true,
  enableDeduplication: true,
  enableHealthMonitoring: true,
  defaultTimeout: 10000,
  circuitBreaker: {
    failureThreshold: 10,      // Higher threshold
    successThreshold: 5,        // More successes needed
    timeout: 120000,            // Longer recovery time
    monitoringWindow: 30000     // Longer monitoring window
  },
  bulkhead: {
    criticalMaxConcurrent: 20,  // More concurrent slots
    highMaxConcurrent: 40,
    normalMaxConcurrent: 60,
    lowMaxConcurrent: 20,
    maxQueuedPerPriority: 100,  // Larger queue
    operationTimeout: 60000     // Longer timeout
  }
};
```

### Resource-Constrained Scenario

For limited resources:

```typescript
const config: ResilienceConfig = {
  enableCircuitBreaker: true,
  enableBulkhead: true,
  enableDeduplication: true,  // Essential for deduplication
  enableHealthMonitoring: false,  // Disable for lower overhead
  defaultTimeout: 5000,
  circuitBreaker: {
    failureThreshold: 3,      // Lower threshold
    successThreshold: 2,
    timeout: 30000,           // Shorter recovery
    monitoringWindow: 5000    // Shorter window
  },
  bulkhead: {
    criticalMaxConcurrent: 5,
    highMaxConcurrent: 10,
    normalMaxConcurrent: 15,
    lowMaxConcurrent: 5,
    maxQueuedPerPriority: 20,
    operationTimeout: 20000
  }
};
```

## Troubleshooting Guide

### Issue: Too Many Circuit Breaker Opens

**Problem**: Endpoints keep transitioning to OPEN state

**Diagnostic Steps**:
```typescript
const cbMetrics = resilientClient.getCircuitBreakerMetrics();

cbMetrics.forEach((metrics, endpoint) => {
  if (metrics.state === CircuitBreakerState.OPEN) {
    console.log(`${endpoint}:`, {
      failureCount: metrics.failureCount,
      failureRate: (metrics.failureRate * 100).toFixed(2) + '%',
      avgResponseTime: metrics.averageResponseTime.toFixed(0) + 'ms',
      lastFailure: new Date(metrics.lastFailureTime || 0)
    });
  }
});
```

**Solutions**:
1. Increase `failureThreshold` if transient failures are normal
2. Increase `timeout` if service is slow but working
3. Add error codes to `excludedErrors` if 4xx should not count
4. Check downstream service health

### Issue: Bulkhead Rejecting Operations

**Problem**: Getting "Bulkhead rejected operation" errors

**Diagnostic Steps**:
```typescript
const bhMetrics = resilientClient.getBulkheadMetrics();

console.log({
  activeCritical: bhMetrics.activeByCriticality.CRITICAL,
  maxCritical: bhConfig.criticalMaxConcurrent,
  queuedCritical: bhMetrics.queuedByCriticality.CRITICAL,
  maxQueued: bhConfig.maxQueuedPerPriority,
  totalRejected: bhMetrics.totalRejected,
  peakConcurrent: bhMetrics.peakConcurrentRequests
});
```

**Solutions**:
1. Increase concurrency limits if spike is expected
2. Reduce operation timeout if safe (operations complete faster)
3. Add backpressure handling in UI (retry with exponential backoff)
4. Split large operations into smaller tasks

### Issue: High Deduplication Rate

**Problem**: Many requests marked as duplicates

**Analysis**:
```typescript
const dedupMetrics = resilientClient.getDeduplicationMetrics();
console.log(`${(dedupMetrics.duplicatedPercentage).toFixed(1)}% requests deduplicated`);
```

**Likely Causes**:
- UI button double-click (implement debounce)
- Network layer retries (check axios config)
- React strict mode in dev (expected, disable in prod)
- Concurrent state updates (check component logic)

**Solution**:
```typescript
// Debounce user interactions
const debouncedFetch = useMemo(
  () => debounce(() => resilientClient.get(url), 300),
  [url]
);
```

## Monitoring Integration

### Prometheus Metrics Export

```typescript
export function getPrometheusMetrics(resilientClient: ResilientApiClient): string {
  const health = resilientClient.getHealthReport();
  const cbMetrics = resilientClient.getCircuitBreakerMetrics();
  const bhMetrics = resilientClient.getBulkheadMetrics();
  const dedupMetrics = resilientClient.getDeduplicationMetrics();

  let metrics = '';

  // Health score
  metrics += `platform_health_score ${health.overallHealthScore}\n`;
  metrics += `platform_degraded_endpoints ${health.degradedCount}\n`;

  // Circuit breakers
  cbMetrics.forEach((m, endpoint) => {
    metrics += `circuit_breaker_state{endpoint="${endpoint}",state="${m.state}"} 1\n`;
    metrics += `circuit_breaker_failure_rate{endpoint="${endpoint}"} ${m.failureRate}\n`;
  });

  // Bulkhead
  metrics += `bulkhead_active_critical ${bhMetrics.activeByCriticality.CRITICAL}\n`;
  metrics += `bulkhead_queued_normal ${bhMetrics.queuedByCriticality.NORMAL}\n`;
  metrics += `bulkhead_rejections_total ${bhMetrics.totalRejected}\n`;

  // Deduplication
  metrics += `deduplication_percentage ${dedupMetrics.duplicatedPercentage}\n`;
  metrics += `deduplication_saved_requests ${dedupMetrics.savedRequests}\n`;

  return metrics;
}
```

### Custom Analytics Integration

```typescript
class ResilienceAnalytics {
  trackCircuitBreakerEvent(endpoint: string, state: CircuitBreakerState) {
    analytics.track('circuit_breaker_state_change', {
      endpoint,
      state,
      timestamp: new Date()
    });
  }

  trackBulkheadRejection(priority: OperationPriority) {
    analytics.track('bulkhead_rejection', {
      priority,
      activeCount: bulkhead.getActiveCount(),
      timestamp: new Date()
    });
  }

  trackDeduplication(savedCount: number) {
    analytics.track('request_deduplicated', {
      savedCount,
      timestamp: new Date()
    });
  }
}
```

## Best Practices Summary

1. **Always specify operation types** for correct resilience configuration
2. **Use CRITICAL sparingly** - only for truly safety-critical operations
3. **Monitor degradation alerts** - set up notifications for state changes
4. **Test failure scenarios** - use chaos engineering to validate behavior
5. **Tune timeouts** - based on actual SLAs and observed latencies
6. **Keep retry counts low** for write operations
7. **Implement exponential backoff** - don't retry too aggressively
8. **Provide fallback UI** - show degraded-mode functionality
9. **Track metrics** - export to monitoring system for alerting
10. **Document operation types** - make resilience strategy explicit

---

**For more information**: See README.md in this directory
