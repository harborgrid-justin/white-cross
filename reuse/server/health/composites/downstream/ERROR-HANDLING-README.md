# Error Handling & Resilience Patterns - Healthcare Downstream Composites

## Overview

This document provides comprehensive guidelines for error handling and resilience patterns across all healthcare downstream composite services. These patterns are **CRITICAL** for patient safety, HIPAA compliance, and DEA regulations.

## Table of Contents

1. [Shared Utilities](#shared-utilities)
2. [Error Handling Patterns](#error-handling-patterns)
3. [Timeout Configuration](#timeout-configuration)
4. [Retry Logic](#retry-logic)
5. [Circuit Breaker Pattern](#circuit-breaker-pattern)
6. [Testing Strategies](#testing-strategies)
7. [Monitoring & Observability](#monitoring--observability)
8. [HIPAA Compliance](#hipaa-compliance)

## Shared Utilities

All resilience utilities are located in:
```
reuse/server/health/composites/shared/
├── utils/
│   ├── timeout.util.ts          # Timeout wrapper for async operations
│   ├── retry.util.ts             # Exponential backoff retry logic
│   └── circuit-breaker.util.ts   # Circuit breaker for external services
└── decorators/
    └── resilient.decorator.ts    # Combined resilience decorator
```

### Import Statements

```typescript
// Basic timeout
import { withTimeout, TIMEOUT_DURATIONS } from '../shared/utils/timeout.util';

// Retry logic
import { withRetry, RETRY_CONFIGS } from '../shared/utils/retry.util';

// Circuit breaker
import {
  CircuitBreaker,
  CircuitBreakerRegistry,
  CIRCUIT_BREAKER_CONFIGS
} from '../shared/utils/circuit-breaker.util';

// Decorators (easiest to use)
import {
  Resilient,
  ResilientAPI,
  ResilientEpic,
  ResilientCerner
} from '../shared/decorators/resilient.decorator';
```

## Error Handling Patterns

### Pattern 1: Basic Try-Catch (Required for ALL Files)

**When to use**: Every async operation in every file

```typescript
async operation(data: OperationDto): Promise<Result> {
  try {
    // 1. Validate input
    if (!data.patientId) {
      throw new BadRequestException('Patient ID is required');
    }

    this.logger.log('Starting operation', {
      patientId: data.patientId,
      operation: 'operation_name'
    });

    // 2. Execute operation
    const result = await this.performOperation(data);

    // 3. Audit log success (for critical operations)
    await this.auditLog({
      action: 'OPERATION_SUCCESS',
      patientId: data.patientId,
      userId: context.userId
    });

    return result;
  } catch (error) {
    // 4. Structured error logging
    this.logger.error('Operation failed', {
      operation: 'operation_name',
      patientId: data?.patientId,
      error: error.message,
      stack: error.stack
    });

    // 5. Audit log failure (for critical operations)
    await this.auditLogFailure({
      action: 'OPERATION_FAILED',
      patientId: data?.patientId,
      error: error.message
    });

    // 6. Rethrow known exceptions
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    // 7. Wrap unknown errors
    throw new InternalServerErrorException(
      `Operation failed for patient ${data?.patientId}: ${error.message}`
    );
  }
}
```

### Pattern 2: Timeout Protection (External APIs)

**When to use**: All external API calls (Epic, Cerner, athenahealth, HIE, Insurance, Labs)

```typescript
import { withTimeout, TIMEOUT_DURATIONS } from '../shared/utils/timeout.util';

async callExternalAPI(request: ApiRequest): Promise<ApiResponse> {
  try {
    const result = await withTimeout(
      () => this.httpService.post(endpoint, request),
      TIMEOUT_DURATIONS.STANDARD_API, // 30 seconds
      'External API call'
    );

    return result;
  } catch (error) {
    if (error.name === 'TimeoutError') {
      this.logger.error('API timeout', {
        endpoint,
        timeout: TIMEOUT_DURATIONS.STANDARD_API
      });
      throw new GatewayTimeoutException(
        'External API call timed out after 30 seconds'
      );
    }
    throw error;
  }
}
```

**Available Timeouts**:
```typescript
TIMEOUT_DURATIONS.DATABASE = 10000           // 10s for database queries
TIMEOUT_DURATIONS.FAST_API = 5000            // 5s for fast APIs (lookup, verification)
TIMEOUT_DURATIONS.STANDARD_API = 30000       // 30s for standard APIs (FHIR, HL7)
TIMEOUT_DURATIONS.HEAVY_PROCESSING = 60000   // 60s for analytics, reporting
TIMEOUT_DURATIONS.BATCH = 120000             // 120s for batch operations
TIMEOUT_DURATIONS.EPIC = 30000               // 30s for Epic EHR
TIMEOUT_DURATIONS.CERNER = 30000             // 30s for Cerner Millennium
TIMEOUT_DURATIONS.ATHENAHEALTH = 30000       // 30s for athenahealth
TIMEOUT_DURATIONS.HIE = 45000                // 45s for HIE networks (slower)
TIMEOUT_DURATIONS.INSURANCE = 20000          // 20s for insurance clearinghouses
TIMEOUT_DURATIONS.LABORATORY = 30000         // 30s for laboratory systems
TIMEOUT_DURATIONS.EPRESCRIBING = 15000       // 15s for e-prescribing (Surescripts)
```

### Pattern 3: Retry with Exponential Backoff (Network Operations)

**When to use**: All network operations that may have transient failures

```typescript
import { withRetry, RETRY_CONFIGS } from '../shared/utils/retry.util';

async sendHL7Message(message: HL7Message): Promise<void> {
  try {
    await withRetry(
      async () => {
        const response = await this.hl7Client.send(message);
        if (!response.success) {
          throw new Error(`HL7 send failed: ${response.error}`);
        }
      },
      {
        ...RETRY_CONFIGS.DEFAULT, // 3 retries: 1s, 2s, 4s
        operationName: 'HL7 message send',
        logger: this.logger
      }
    );

    this.logger.log('HL7 message sent successfully', {
      messageId: message.id
    });
  } catch (error) {
    this.logger.error('HL7 message failed after retries', {
      messageId: message.id,
      error: error.message
    });
    throw new ServiceUnavailableException(
      'Failed to send HL7 message after 3 retries'
    );
  }
}
```

**Available Retry Configs**:
```typescript
RETRY_CONFIGS.DEFAULT = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 4000,
  factor: 2
} // Backoff: 1s → 2s → 4s

RETRY_CONFIGS.FAST = {
  maxRetries: 2,
  baseDelay: 500,
  maxDelay: 2000,
  factor: 2
} // Backoff: 500ms → 1s

RETRY_CONFIGS.AGGRESSIVE = {
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 10000,
  factor: 2
} // Backoff: 1s → 2s → 4s → 8s → 10s

RETRY_CONFIGS.CONSERVATIVE = {
  maxRetries: 2,
  baseDelay: 2000,
  maxDelay: 8000,
  factor: 2
} // Backoff: 2s → 4s
```

### Pattern 4: Circuit Breaker (External Services)

**When to use**: Critical external services (Epic, Cerner, Surescripts, HIE networks, Insurance)

```typescript
import {
  CircuitBreaker,
  CircuitBreakerRegistry,
  CIRCUIT_BREAKER_CONFIGS
} from '../shared/utils/circuit-breaker.util';

export class EpicIntegrationService {
  private readonly epicCircuitBreaker: CircuitBreaker;

  constructor() {
    const circuitBreakerRegistry = CircuitBreakerRegistry.getInstance();
    this.epicCircuitBreaker = circuitBreakerRegistry.getOrCreate(
      'epic-api',
      {
        ...CIRCUIT_BREAKER_CONFIGS.EPIC,
        logger: this.logger
      }
    );
  }

  async callEpicAPI(request: EpicRequest): Promise<EpicResponse> {
    try {
      const result = await this.epicCircuitBreaker.execute(
        async () => {
          const response = await this.httpService.post(epicEndpoint, request);
          if (response.status !== 200) {
            throw new Error(`Epic API returned ${response.status}`);
          }
          return response.data;
        }
      );

      return result;
    } catch (error) {
      if (error.name === 'CircuitBreakerOpenError') {
        this.logger.warn('Epic API circuit breaker open', {
          failures: this.epicCircuitBreaker.getFailureCount()
        });
        throw new ServiceUnavailableException(
          'Epic API is currently unavailable, please try again later'
        );
      }
      throw error;
    }
  }
}
```

**Available Circuit Breaker Configs**:
```typescript
CIRCUIT_BREAKER_CONFIGS.EPIC = {
  failureThreshold: 5,       // Open after 5 consecutive failures
  timeout: 60000,            // Stay open for 60 seconds
  successThreshold: 2,       // Close after 2 consecutive successes
  halfOpenMaxAttempts: 3     // Max 3 attempts in half-open state
}

CIRCUIT_BREAKER_CONFIGS.CERNER = {
  failureThreshold: 5,
  timeout: 60000,
  successThreshold: 2,
  halfOpenMaxAttempts: 3
}

CIRCUIT_BREAKER_CONFIGS.SURESCRIPTS = {
  failureThreshold: 5,
  timeout: 90000,            // Longer timeout due to DEA compliance
  successThreshold: 2,
  halfOpenMaxAttempts: 3
}

CIRCUIT_BREAKER_CONFIGS.HIE = {
  failureThreshold: 3,       // More sensitive threshold
  timeout: 120000,           // Longer timeout (2 minutes)
  successThreshold: 2,
  halfOpenMaxAttempts: 2
}

CIRCUIT_BREAKER_CONFIGS.INSURANCE = {
  failureThreshold: 5,
  timeout: 60000,
  successThreshold: 2,
  halfOpenMaxAttempts: 3
}
```

### Pattern 5: Combined Resilience (Easiest Option)

**When to use**: Most external API calls - combines timeout + retry + circuit breaker

#### Option A: Using Decorators (Recommended)

```typescript
import { ResilientAPI, ResilientEpic, ResilientCerner } from '../shared/decorators/resilient.decorator';

export class MyService {
  // Standard API with timeout + retry
  @ResilientAPI('operation_name')
  async callAPI(data: any): Promise<any> {
    return this.httpService.post(endpoint, data);
  }

  // Epic with timeout + retry + circuit breaker
  @ResilientEpic('epic-patient-search')
  async searchEpicPatients(criteria: any): Promise<any> {
    return this.epicClient.searchPatients(criteria);
  }

  // Cerner with timeout + retry + circuit breaker
  @ResilientCerner('cerner-patient-lookup')
  async getCernerPatient(patientId: string): Promise<any> {
    return this.cernerClient.getPatient(patientId);
  }
}
```

#### Option B: Manual Composition

```typescript
async callAPIWithFullResilience(request: ApiRequest): Promise<ApiResponse> {
  // Initialize circuit breaker
  const circuitBreakerRegistry = CircuitBreakerRegistry.getInstance();
  const circuitBreaker = circuitBreakerRegistry.getOrCreate(
    'my-api',
    CIRCUIT_BREAKER_CONFIGS.DEFAULT
  );

  try {
    // Layer 1: Circuit Breaker (outermost)
    const result = await circuitBreaker.execute(async () => {
      // Layer 2: Retry (middle)
      return await withRetry(async () => {
        // Layer 3: Timeout (innermost)
        return await withTimeout(
          () => this.httpService.post(endpoint, request),
          TIMEOUT_DURATIONS.STANDARD_API,
          'API call'
        );
      }, RETRY_CONFIGS.DEFAULT);
    });

    return result;
  } catch (error) {
    // Handle errors from all layers
    this.handleResilientErrors(error);
    throw error;
  }
}
```

### Pattern 6: Graceful Degradation (Non-Critical Operations)

**When to use**: Dashboard queries, care gap analysis, non-essential features

```typescript
async getPatientDashboard(patientId: string): Promise<DashboardDto> {
  const dashboard: Partial<DashboardDto> = {
    patientId,
    demographics: await this.getPatientDemographics(patientId) // CRITICAL - must succeed
  };

  // NON-CRITICAL: Recent vitals (show cached if real-time fails)
  try {
    dashboard.recentVitals = await withTimeout(
      () => this.vitalsService.getRecent(patientId),
      5000
    );
  } catch (error) {
    this.logger.warn('Failed to fetch real-time vitals, using cache', {
      patientId,
      error: error.message
    });
    dashboard.recentVitals = await this.cacheService.get(`vitals:${patientId}`);
  }

  // NON-CRITICAL: Care gaps (continue if fails)
  try {
    dashboard.careGaps = await this.careGapService.analyze(patientId);
  } catch (error) {
    this.logger.warn('Care gap analysis failed, omitting from dashboard', {
      patientId,
      error: error.message
    });
    dashboard.careGaps = [];
  }

  return dashboard as DashboardDto;
}
```

## Timeout Configuration

### Choosing the Right Timeout

| Operation Type | Timeout | Rationale |
|---------------|---------|-----------|
| Database queries | 10s | Local operation, should be fast |
| Cache lookups | 5s | In-memory or Redis, very fast |
| Fast APIs (verification, lookup) | 5s | Simple queries, minimal processing |
| Standard APIs (FHIR, HL7) | 30s | Complex queries, moderate processing |
| HIE networks | 45s | Multiple systems, network hops |
| Heavy processing (analytics) | 60s | Complex calculations, large datasets |
| Batch operations | 120s | Long-running operations |

### Example: Choosing Timeout by File

```typescript
// insurance-verification-services.ts - Fast clearinghouse API
@ResilientAPI()
async verifyEligibility(data: VerificationDto): Promise<EligibilityResponse> {
  return await withTimeout(
    () => this.clearinghouse.verifyEligibility(data),
    TIMEOUT_DURATIONS.INSURANCE, // 20 seconds
    'Insurance eligibility verification'
  );
}

// hie-integration-services.ts - Slow HIE network
@ResilientAPI()
async queryHIENetwork(criteria: QueryCriteria): Promise<HIEResponse> {
  return await withTimeout(
    () => this.hieClient.query(criteria),
    TIMEOUT_DURATIONS.HIE, // 45 seconds
    'HIE network query'
  );
}

// dashboard-apis.ts - Fast dashboard query
@ResilientDatabase()
async getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  return await withTimeout(
    () => this.database.queryMetrics(userId),
    TIMEOUT_DURATIONS.DATABASE, // 10 seconds
    'Dashboard metrics query'
  );
}
```

## Retry Logic

### Retryable vs Non-Retryable Errors

#### Retryable Errors (DO retry)
- Network errors: ECONNREFUSED, ETIMEDOUT, ENOTFOUND, ECONNRESET
- HTTP 5xx (server errors): 500, 502, 503, 504
- HTTP 408 (Request Timeout)
- HTTP 429 (Too Many Requests)
- Transient database connection errors

#### Non-Retryable Errors (DON'T retry)
- HTTP 4xx (client errors): 400, 401, 403, 404 (except 408, 429)
- Validation errors
- Business logic errors
- Authentication/authorization errors
- Data not found errors

### Custom Retry Conditions

```typescript
async operation(): Promise<Result> {
  return await withRetry(
    async () => {
      const response = await this.externalAPI.call();
      if (response.status === 'PROCESSING') {
        // Retry if still processing
        throw new Error('Still processing, retry');
      }
      return response;
    },
    {
      maxRetries: 3,
      baseDelay: 1000,
      shouldRetry: (error) => {
        // Custom retry logic
        if (error.message.includes('Still processing')) {
          return true;
        }
        // Default retry logic for network errors
        return error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT';
      }
    }
  );
}
```

## Circuit Breaker Pattern

### When to Use Circuit Breakers

✅ **DO use circuit breakers for:**
- External EHR systems (Epic, Cerner, athenahealth)
- Health Information Exchanges (HIE) networks
- E-prescribing services (Surescripts)
- Insurance clearinghouses
- Laboratory information systems
- Any external service that could cascade failures

❌ **DON'T use circuit breakers for:**
- Internal services
- Database queries (use connection pooling instead)
- Cache operations
- File system operations

### Circuit Breaker States

```
CLOSED → (5 failures) → OPEN → (60s timeout) → HALF_OPEN → (2 successes) → CLOSED
                                                    ↓ (1 failure)
                                                   OPEN
```

### Monitoring Circuit Breaker State

```typescript
// Get all circuit breakers
const registry = CircuitBreakerRegistry.getInstance();
const stats = registry.getAllStats();

// Log circuit breaker stats
this.logger.log('Circuit breaker stats', stats);

// Example output:
{
  'epic-api': {
    state: 'CLOSED',
    failureCount: 0,
    successCount: 150,
    totalRequests: 150,
    totalFailures: 0
  },
  'surescripts-network': {
    state: 'OPEN',
    failureCount: 5,
    successCount: 98,
    totalRequests: 103,
    totalFailures: 5,
    lastFailureTime: '2025-11-10T12:00:00Z'
  }
}
```

## Testing Strategies

### Unit Testing Error Handling

```typescript
describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    service = new MyService();
  });

  it('should handle timeout errors', async () => {
    // Mock timeout
    jest.spyOn(service, 'externalCall').mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve('data'), 10000); // Exceeds timeout
      });
    });

    await expect(service.operation()).rejects.toThrow(GatewayTimeoutException);
  });

  it('should retry on network errors', async () => {
    const mockCall = jest.spyOn(service, 'externalCall')
      .mockRejectedValueOnce(new Error('ECONNREFUSED'))
      .mockRejectedValueOnce(new Error('ECONNREFUSED'))
      .mockResolvedValueOnce({ success: true });

    const result = await service.operation();

    expect(mockCall).toHaveBeenCalledTimes(3); // Initial + 2 retries
    expect(result).toEqual({ success: true });
  });

  it('should NOT retry on validation errors', async () => {
    const mockCall = jest.spyOn(service, 'externalCall')
      .mockRejectedValue(new BadRequestException('Invalid data'));

    await expect(service.operation()).rejects.toThrow(BadRequestException);
    expect(mockCall).toHaveBeenCalledTimes(1); // No retries
  });

  it('should open circuit breaker after threshold', async () => {
    const service = new MyServiceWithCircuitBreaker();

    // Simulate 5 consecutive failures
    for (let i = 0; i < 5; i++) {
      await expect(service.operation()).rejects.toThrow();
    }

    // 6th call should fail fast with circuit breaker open
    await expect(service.operation()).rejects.toThrow(CircuitBreakerOpenError);
  });
});
```

### Integration Testing

```typescript
describe('Epic Integration (Integration)', () => {
  it('should handle Epic API timeout gracefully', async () => {
    // Start mock Epic server with slow responses
    const mockEpicServer = startMockServer({
      delay: 35000 // Exceeds 30s timeout
    });

    const service = new EpicIntegrationService();

    await expect(service.searchPatients({ name: 'John' }))
      .rejects.toThrow(GatewayTimeoutException);

    mockEpicServer.stop();
  });
});
```

## Monitoring & Observability

### Key Metrics to Track

1. **Error Rate by Service**
   ```typescript
   this.metricsService.incrementCounter('errors_total', {
     service: 'EpicIntegrationService',
     operation: 'searchPatients',
     errorType: error.name
   });
   ```

2. **Timeout Frequency**
   ```typescript
   if (isTimeoutError(error)) {
     this.metricsService.incrementCounter('timeouts_total', {
       service: 'EpicIntegrationService',
       endpoint: endpoint,
       timeout: TIMEOUT_DURATIONS.EPIC
     });
   }
   ```

3. **Retry Success/Failure Rates**
   ```typescript
   // In retry utility
   if (attempt > 0 && success) {
     this.metricsService.incrementCounter('retries_succeeded', {
       operation: operationName,
       attempt: attempt
     });
   }
   ```

4. **Circuit Breaker State Changes**
   ```typescript
   // In circuit breaker utility
   this.metricsService.gauge('circuit_breaker_state', {
     circuitBreaker: this.name,
     state: this.state,
     value: this.state === 'OPEN' ? 1 : 0
   });
   ```

### Alerting Thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error rate | >5% of requests | Page on-call engineer |
| Circuit breaker opens | Any | Page on-call engineer |
| Timeout errors | >10/minute | Alert team channel |
| Retry exhaustion | >5/minute | Alert team channel |

### Logging Best Practices

```typescript
// ✅ GOOD - Structured logging with context
this.logger.error('Failed to send EPCS prescription', {
  operation: 'sendEPCS',
  patientId: rxData.patientId,
  prescriberId: rxData.prescriberId,
  scheduleClass: rxData.scheduleClass,
  error: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString()
});

// ❌ BAD - Unstructured logging, no context
this.logger.error('Error: ' + error.message);

// ❌ CRITICAL - Logs PHI (HIPAA violation)
this.logger.error(`Failed for patient ${patient.firstName} ${patient.lastName}`);
```

## HIPAA Compliance

### PHI Protection in Errors

**NEVER log Protected Health Information (PHI)**:
- Patient names
- Medical Record Numbers (MRNs)
- Social Security Numbers
- Date of birth
- Addresses
- Phone numbers
- Email addresses
- DEA numbers
- Prescription details

**SAFE to log**:
- Patient ID (internal system ID only)
- Prescriber ID
- Medication ID (not medication name in some contexts)
- Operation names
- Error types
- Timestamps

### Safe Error Logging Examples

```typescript
// ✅ SAFE - Uses patient ID only
this.logger.error('Failed to update patient', {
  patientId: patient.id,
  operation: 'updatePatient',
  error: error.message
});

// ❌ UNSAFE - Logs PHI
this.logger.error(`Failed to update patient ${patient.firstName} ${patient.lastName}, SSN: ${patient.ssn}`);

// ✅ SAFE - DEA number not logged
this.logger.log('EPCS prescription sent', {
  prescriberId: rxData.prescriberId,
  deaNumberPresent: !!deaNumber, // Boolean flag only
  scheduleClass: rxData.scheduleClass
});

// ❌ UNSAFE - Logs actual DEA number
this.logger.log(`EPCS sent with DEA ${deaNumber}`);
```

### Audit Logging for Compliance

**Required for HIPAA compliance:**
- All PHI access
- All medication administration
- All controlled substance prescriptions
- All authentication/authorization events
- All data modifications

```typescript
// Audit log with structured data
await this.auditService.log({
  action: AuditAction.PHI_ACCESS,
  resource: 'patient',
  resourceId: patientId,
  userId: context.userId,
  userRole: context.userRole,
  ipAddress: context.ipAddress,
  success: true,
  timestamp: new Date()
});

// Audit log for failures
await this.auditService.log({
  action: AuditAction.MEDICATION_ADMINISTRATION_FAILED,
  resource: 'medication',
  resourceId: medicationId,
  patientId: patientId,
  userId: context.userId,
  success: false,
  errorMessage: error.message,
  timestamp: new Date()
});
```

## File-by-File Implementation Guide

### Priority 1: Patient Safety Critical (DONE)
- ✅ medication-administration-record-mar.ts
- ✅ e-prescribing-services-surescripts.ts

### Priority 2: High-Volume External APIs (NEXT)
Apply timeout + retry + circuit breaker:
- insurance-verification-services.ts
- hie-integration-services.ts
- patient-engagement-services.ts
- epic-ehr-integration-services.ts
- cerner-millennium-integration-services.ts
- athenahealth-quality-integration-services.ts

### Priority 3: Network Operations
Apply timeout + retry:
- hl7-v2-message-processors.ts
- fhir-resource-processors.ts
- laboratory-information-system-lis-services.ts
- document-exchange-modules.ts
- patient-data-exchange-modules.ts

### Priority 4: All Remaining Files
Apply basic try-catch error handling:
- All other 85+ files in downstream directory

## Quick Reference

### Minimal Error Handling (Every File)

```typescript
async operation(data: any): Promise<any> {
  try {
    // Validate
    if (!data.requiredField) {
      throw new BadRequestException('Field required');
    }

    // Execute
    const result = await this.performOperation(data);

    return result;
  } catch (error) {
    this.logger.error('Operation failed', {
      operation: 'operation_name',
      error: error.message
    });

    if (error instanceof BadRequestException) {
      throw error;
    }

    throw new InternalServerErrorException(
      `Operation failed: ${error.message}`
    );
  }
}
```

### Full Resilience (External APIs)

```typescript
@ResilientAPI('operation_name')
async callAPI(data: any): Promise<any> {
  try {
    // Decorator handles timeout + retry
    const result = await this.httpService.post(endpoint, data);

    this.logger.log('API call successful', { endpoint });
    return result;
  } catch (error) {
    this.logger.error('API call failed', {
      endpoint,
      error: error.message
    });

    if (isCircuitBreakerOpenError(error)) {
      throw new ServiceUnavailableException('Service unavailable');
    }

    throw new InternalServerErrorException('API call failed');
  }
}
```

## Support & Questions

For questions or issues with error handling patterns:
1. Review this README
2. Check example implementations in:
   - medication-administration-record-mar.ts
   - e-prescribing-services-surescripts.ts
3. Review shared utilities in `reuse/server/health/composites/shared/`

## Version

**Version**: 1.0.0
**Last Updated**: 2025-11-10
**Authors**: NestJS Providers Architect (Agent R8E4S1)
