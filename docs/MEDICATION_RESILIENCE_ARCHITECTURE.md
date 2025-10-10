# Medication Module Resilience Architecture

**Version:** 1.0
**Last Updated:** 2025-10-10
**Classification:** CRITICAL SAFETY SYSTEM
**Compliance:** HIPAA, FDA 21 CFR Part 11

---

## Executive Summary

This document specifies a comprehensive resilience architecture for the medication management module. Given that this module handles life-critical medication administration, the architecture prioritizes **zero data loss** for administration records and **absolute safety** for medication operations.

### Critical Safety Requirements

1. **NEVER lose medication administration records** - Records are legal documents and safety evidence
2. **PREVENT duplicate administrations** - Duplicate dosing can be life-threatening
3. **FAIL-SAFE controlled substance tracking** - Regulatory and legal compliance mandatory
4. **MAINTAIN Five Rights validation** - Right patient, medication, dose, route, time
5. **ENSURE adverse reaction reporting** - Safety events must be captured immediately

---

## 1. Resilience Level Classification

### Level 1: CRITICAL (Zero-Loss Operations)

**Operations:**
- Medication administration logging
- Adverse reaction reporting
- Controlled substance witness recording
- Five Rights validation failures

**Requirements:**
- Queue-based persistence BEFORE acknowledgment
- Offline capability with local storage
- Automatic retry with exponential backoff (max 7 days)
- Dead Letter Queue (DLQ) for failed operations
- Real-time alerting on ANY failure
- Idempotency keys to prevent duplicates
- Write-ahead logging (WAL)

**SLA:**
- 99.999% durability (5 nines)
- Zero acceptable data loss
- Maximum 100ms local write latency
- Alert within 30 seconds of failure

---

### Level 2: HIGH (Business Critical Operations)

**Operations:**
- Prescription management (create/update)
- Controlled substance inventory tracking
- Medication allergy checks
- Drug interaction validation
- Prescription refill authorization

**Requirements:**
- Circuit breaker with health-based state transitions
- Retry with jitter (3 attempts, exponential backoff)
- Fallback to cached data where medically safe
- Alert on repeated failures (3+ consecutive)
- 5-minute timeout protection
- Request deduplication

**SLA:**
- 99.9% availability
- Maximum 3-second response time
- Alert on 3 consecutive failures
- Cache staleness < 5 minutes for read operations

---

### Level 3: STANDARD (Non-Critical Operations)

**Operations:**
- Inventory level queries
- Medication search
- Historical report generation
- Reminder notifications
- Expiration date checks

**Requirements:**
- Standard circuit breaker
- Limited retry (2 attempts)
- Graceful degradation with stale data
- 10-minute timeout protection
- Manual intervention alerts

**SLA:**
- 99% availability
- Maximum 10-second response time
- Stale data acceptable (up to 1 hour)

---

## 2. Circuit Breaker Specifications

### 2.1 Level 1 Circuit Breaker (Write Operations)

```typescript
interface Level1CircuitBreakerConfig {
  // Threshold settings
  failureThreshold: 1;           // Open after 1 failure (zero tolerance)
  successThreshold: 5;           // Require 5 successes to close
  timeout: 30000;                // 30 seconds

  // State transition
  halfOpenRequests: 1;           // Test with 1 request in half-open

  // Monitoring
  volumeThreshold: 1;            // Track from first request
  rollingWindowMs: 60000;        // 1 minute window

  // Fallback
  fallbackStrategy: 'QUEUE_LOCAL'; // Always queue locally

  // Alerting
  alertOnOpen: true;
  alertChannel: 'CRITICAL_OPS';  // Immediate SMS/Page
  escalationDelay: 60000;        // Escalate after 1 minute
}
```

**State Transitions:**
1. **CLOSED** → **OPEN**: After ANY database write failure
2. **OPEN** → **HALF_OPEN**: After 30 seconds (automatic retry)
3. **HALF_OPEN** → **CLOSED**: After 5 consecutive successes
4. **HALF_OPEN** → **OPEN**: On any failure

**Fallback Behavior:**
```typescript
// When circuit opens, immediately:
1. Write to local persistent queue (IndexedDB/SQLite)
2. Return success to user (operation queued)
3. Trigger background sync process
4. Alert operations team
5. Display "Offline Mode" indicator to user
```

---

### 2.2 Level 2 Circuit Breaker (Critical Reads/Writes)

```typescript
interface Level2CircuitBreakerConfig {
  // Threshold settings
  failureThreshold: 3;           // Open after 3 failures
  failurePercentage: 50;         // Or 50% failure rate
  successThreshold: 10;          // Require 10 successes to close
  timeout: 60000;                // 1 minute

  // State transition
  halfOpenRequests: 3;           // Test with 3 requests

  // Monitoring
  volumeThreshold: 10;           // Minimum 10 requests to calculate rate
  rollingWindowMs: 120000;       // 2 minute window

  // Fallback
  fallbackStrategy: 'CACHED_DATA_WITH_WARNING';
  cacheMaxAge: 300000;           // 5 minutes max staleness

  // Alerting
  alertOnOpen: true;
  alertChannel: 'HIGH_PRIORITY';
  escalationDelay: 300000;       // 5 minutes
}
```

---

### 2.3 Level 3 Circuit Breaker (Standard Operations)

```typescript
interface Level3CircuitBreakerConfig {
  failureThreshold: 5;
  failurePercentage: 60;
  successThreshold: 20;
  timeout: 120000;               // 2 minutes
  halfOpenRequests: 5;
  volumeThreshold: 20;
  rollingWindowMs: 300000;       // 5 minute window
  fallbackStrategy: 'STALE_DATA_ALLOWED';
  cacheMaxAge: 3600000;          // 1 hour staleness
  alertOnOpen: true;
  alertChannel: 'STANDARD_OPS';
}
```

---

## 3. Retry Policy Specifications

### 3.1 Level 1 Retry Policy (Critical Operations)

```typescript
interface Level1RetryPolicy {
  // Base configuration
  maxAttempts: Infinity;         // Never give up
  baseDelay: 1000;               // 1 second initial
  maxDelay: 3600000;             // 1 hour maximum
  exponentialBase: 2;
  jitterFactor: 0.3;             // 30% random jitter

  // Retry decision logic
  retryableErrors: [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNRESET',
    'PRISMA_CONNECTION_ERROR',
    'DATABASE_TIMEOUT'
  ];

  // Non-retryable errors (fail immediately)
  nonRetryableErrors: [
    'DUPLICATE_ADMINISTRATION',   // Already administered
    'MEDICATION_NOT_FOUND',
    'STUDENT_NOT_FOUND',
    'PRESCRIPTION_EXPIRED',
    'VALIDATION_ERROR'
  ];

  // Persistence
  persistRetryQueue: true;
  queueStorage: 'LOCAL_DB';      // SQLite/IndexedDB
  maxQueueSize: 10000;
  queuePersistenceDays: 7;

  // Dead Letter Queue
  dlqEnabled: true;
  dlqThreshold: 100;             // After 100 attempts (~7 days)
  dlqAlertImmediately: true;
}
```

**Retry Schedule Example:**
```
Attempt 1: Immediate
Attempt 2: 1s + jitter (0.7-1.3s)
Attempt 3: 2s + jitter (1.4-2.6s)
Attempt 4: 4s + jitter (2.8-5.2s)
Attempt 5: 8s + jitter (5.6-10.4s)
Attempt 6: 16s + jitter
Attempt 7: 32s + jitter
Attempt 8: 64s + jitter (~1 min)
Attempt 9: 128s + jitter (~2 min)
Attempt 10: 256s + jitter (~4 min)
Attempt 15: 1800s + jitter (~30 min)
Attempt 20: 3600s + jitter (~1 hour, max)
...continues at 1 hour intervals up to 7 days
```

---

### 3.2 Level 2 Retry Policy (High Priority)

```typescript
interface Level2RetryPolicy {
  maxAttempts: 3;
  baseDelay: 500;                // 500ms initial
  maxDelay: 5000;                // 5 seconds maximum
  exponentialBase: 2;
  jitterFactor: 0.2;

  retryableErrors: [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'DATABASE_TIMEOUT',
    'TRANSACTION_CONFLICT'
  ];

  nonRetryableErrors: [
    'VALIDATION_ERROR',
    'NOT_FOUND',
    'PERMISSION_DENIED',
    'DUPLICATE_KEY'
  ];

  persistRetryQueue: false;      // Memory-only
  circuitBreakerIntegration: true;
}
```

---

### 3.3 Level 3 Retry Policy (Standard)

```typescript
interface Level3RetryPolicy {
  maxAttempts: 2;
  baseDelay: 1000;
  maxDelay: 3000;
  exponentialBase: 1.5;
  jitterFactor: 0.1;
  retryableErrors: ['ECONNREFUSED', 'ETIMEDOUT'];
  nonRetryableErrors: ['*'];     // Most errors non-retryable
}
```

---

## 4. Timeout Specifications

### 4.1 Operation Timeouts

```typescript
const MEDICATION_TIMEOUTS = {
  // Level 1 Operations (Critical)
  medicationAdministrationLog: {
    database: 3000,              // 3s DB write
    total: 5000,                 // 5s total operation
    validation: 1000,            // 1s for Five Rights check
  },

  adverseReactionReport: {
    database: 3000,
    total: 5000,
    validation: 500,
  },

  controlledSubstanceLog: {
    database: 3000,
    total: 5000,
    witnessValidation: 2000,
  },

  // Level 2 Operations
  prescriptionCreate: {
    database: 5000,
    total: 10000,
    allergyCheck: 2000,
    interactionCheck: 3000,
    contraIndicationCheck: 2000,
  },

  prescriptionUpdate: {
    database: 5000,
    total: 10000,
  },

  // Level 3 Operations
  medicationSearch: {
    database: 5000,
    total: 10000,
  },

  reminderGeneration: {
    database: 8000,
    total: 15000,              // Can be complex query
  },

  inventoryCheck: {
    database: 3000,
    total: 5000,
  },
};
```

### 4.2 Timeout Implementation Pattern

```typescript
async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  operationName: string
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(
        `Operation '${operationName}' timed out after ${timeoutMs}ms`
      ));
    }, timeoutMs);
  });

  return Promise.race([operation, timeoutPromise]);
}
```

---

## 5. Offline Capability & Queue Architecture

### 5.1 Local Persistence Queue

```typescript
interface MedicationAdministrationQueue {
  // Storage
  storage: 'IndexedDB' | 'SQLite';  // Browser/Desktop vs Mobile
  databaseName: 'medication_admin_queue';
  tableName: 'pending_administrations';

  // Schema
  schema: {
    id: string;                  // UUID v4
    idempotencyKey: string;      // For deduplication
    operation: 'ADMINISTER';
    payload: MedicationAdministrationData;
    timestamp: number;           // Unix timestamp
    attempts: number;
    lastAttemptTime: number;
    status: 'PENDING' | 'SYNCING' | 'FAILED' | 'DLQ';
    errorLog: ErrorRecord[];
    nurseId: string;
    deviceId: string;
    offlineMode: boolean;
  };

  // Indexing
  indexes: ['idempotencyKey', 'status', 'timestamp', 'nurseId'];

  // Sync Strategy
  syncTriggers: [
    'NETWORK_RESTORED',
    'USER_ACTION',
    'PERIODIC_5_MIN',
    'APP_FOREGROUND'
  ];
}
```

### 5.2 Sync Mechanism

```typescript
class MedicationQueueSyncService {
  private syncInterval = 30000;  // 30 seconds
  private batchSize = 10;
  private concurrentSyncs = 3;

  async syncQueue(): Promise<SyncResult> {
    // 1. Check network connectivity
    if (!navigator.onLine) {
      return { status: 'OFFLINE', synced: 0 };
    }

    // 2. Get pending records (oldest first)
    const pending = await this.getPendingRecords(this.batchSize);

    // 3. Sync in parallel with concurrency limit
    const results = await Promise.allSettled(
      pending.map(record => this.syncRecord(record))
    );

    // 4. Handle results
    const synced = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected');

    // 5. Update queue status
    await this.updateQueueStatus(results);

    // 6. Alert on failures
    if (failed.length > 0) {
      await this.alertSyncFailures(failed);
    }

    return { status: 'COMPLETED', synced, failed: failed.length };
  }

  private async syncRecord(record: QueueRecord): Promise<void> {
    try {
      // Apply idempotency check
      const exists = await this.checkIfAlreadySynced(record.idempotencyKey);
      if (exists) {
        await this.markAsComplete(record.id);
        return;
      }

      // Attempt sync
      await withTimeout(
        this.apiClient.logAdministration(record.payload),
        5000,
        'Queue Sync'
      );

      // Mark complete
      await this.markAsComplete(record.id);

      // Log success
      logger.info('Queue record synced', {
        recordId: record.id,
        idempotencyKey: record.idempotencyKey
      });

    } catch (error) {
      // Increment attempt count
      await this.incrementAttempts(record.id);

      // Check if should move to DLQ
      if (record.attempts >= 100) {
        await this.moveToDLQ(record);
      }

      throw error;
    }
  }
}
```

### 5.3 Conflict Resolution

```typescript
enum ConflictResolutionStrategy {
  // For medication administration
  SERVER_WINS = 'SERVER_WINS',           // Server has authoritative record
  CLIENT_TIMESTAMP_WINS = 'CLIENT_WINS', // Use client timestamp as source of truth
  MANUAL_REVIEW = 'MANUAL_REVIEW',       // Requires nurse review
}

interface ConflictResolution {
  // Detect conflicts
  detectConflict(local: AdminRecord, server: AdminRecord): boolean {
    // Check if same medication, student, and time window
    if (local.studentMedicationId === server.studentMedicationId) {
      const timeDiff = Math.abs(
        new Date(local.administeredAt).getTime() -
        new Date(server.administeredAt).getTime()
      );

      // Within 1 hour = potential conflict
      if (timeDiff < 3600000) {
        return true;
      }
    }
    return false;
  }

  // Resolve conflicts
  async resolveConflict(
    local: AdminRecord,
    server: AdminRecord
  ): Promise<ResolvedRecord> {
    // Use client timestamp as authoritative
    // (Nurse physically administered medication)
    if (local.administeredAt < server.administeredAt) {
      return {
        action: 'KEEP_LOCAL',
        record: local,
        reason: 'Earlier administration time (client authoritative)',
      };
    } else {
      return {
        action: 'DISCARD_LOCAL',
        record: server,
        reason: 'Server has earlier record',
        requiresReview: true,  // Flag for nurse review
      };
    }
  }
}
```

---

## 6. Idempotency Implementation

### 6.1 Idempotency Key Generation

```typescript
class IdempotencyKeyGenerator {
  static generateAdministrationKey(data: {
    studentMedicationId: string;
    nurseId: string;
    scheduledTime: Date;
    deviceId: string;
  }): string {
    // Create deterministic key from operation parameters
    const components = [
      'MED_ADMIN',
      data.studentMedicationId,
      data.nurseId,
      data.scheduledTime.toISOString(),
      data.deviceId,
    ];

    // Hash to create compact key
    const hash = crypto
      .createHash('sha256')
      .update(components.join('|'))
      .digest('hex')
      .substring(0, 32);

    return `idmp_${hash}`;
  }

  static generateAdverseReactionKey(data: {
    studentMedicationId: string;
    reportedBy: string;
    reportedAt: Date;
  }): string {
    const components = [
      'ADVERSE_REACTION',
      data.studentMedicationId,
      data.reportedBy,
      data.reportedAt.toISOString(),
    ];

    const hash = crypto
      .createHash('sha256')
      .update(components.join('|'))
      .digest('hex')
      .substring(0, 32);

    return `idmp_${hash}`;
  }
}
```

### 6.2 Idempotency Middleware

```typescript
// Backend middleware for idempotency
class IdempotencyMiddleware {
  private cache: Redis;
  private ttl = 86400;  // 24 hours

  async handle(request: Request, h: ResponseToolkit) {
    const idempotencyKey = request.headers['idempotency-key'];

    if (!idempotencyKey) {
      return Boom.badRequest('Idempotency-Key header required for this operation');
    }

    // Check if already processed
    const cached = await this.cache.get(`idp:${idempotencyKey}`);

    if (cached) {
      logger.info('Idempotent request detected', { idempotencyKey });

      // Return cached response
      return h.response(JSON.parse(cached)).code(200);
    }

    // Store request processing flag
    await this.cache.set(
      `idp:${idempotencyKey}:processing`,
      'true',
      'EX',
      60  // 60 second processing timeout
    );

    return h.continue;
  }

  async storeResult(idempotencyKey: string, result: any): Promise<void> {
    // Store successful result
    await this.cache.set(
      `idp:${idempotencyKey}`,
      JSON.stringify(result),
      'EX',
      this.ttl
    );

    // Remove processing flag
    await this.cache.del(`idp:${idempotencyKey}:processing`);
  }
}
```

---

## 7. Error Handling Standards

### 7.1 Error Classification

```typescript
enum MedicationErrorType {
  // Level 1: Safety Critical
  DUPLICATE_ADMINISTRATION = 'DUPLICATE_ADMINISTRATION',
  WRONG_PATIENT = 'WRONG_PATIENT',
  WRONG_MEDICATION = 'WRONG_MEDICATION',
  WRONG_DOSE = 'WRONG_DOSE',
  WRONG_ROUTE = 'WRONG_ROUTE',
  WRONG_TIME = 'WRONG_TIME',
  ALLERGY_CONFLICT = 'ALLERGY_CONFLICT',
  INTERACTION_DETECTED = 'INTERACTION_DETECTED',
  CONTRAINDICATION = 'CONTRAINDICATION',

  // Level 2: Operational Critical
  PRESCRIPTION_EXPIRED = 'PRESCRIPTION_EXPIRED',
  PRESCRIPTION_NOT_FOUND = 'PRESCRIPTION_NOT_FOUND',
  CONTROLLED_SUBSTANCE_NO_WITNESS = 'CONTROLLED_SUBSTANCE_NO_WITNESS',
  INVENTORY_INSUFFICIENT = 'INVENTORY_INSUFFICIENT',

  // Level 3: Infrastructure
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

class MedicationError extends Error {
  constructor(
    public type: MedicationErrorType,
    public level: 1 | 2 | 3,
    public message: string,
    public context: Record<string, any> = {},
    public retryable: boolean = false,
    public safetyEvent: boolean = false
  ) {
    super(message);
    this.name = 'MedicationError';
  }
}
```

### 7.2 Error Handling Patterns

```typescript
class MedicationAdministrationHandler {
  async logAdministration(data: LogAdministrationRequest): Promise<MedicationLog> {
    const idempotencyKey = IdempotencyKeyGenerator.generateAdministrationKey({
      studentMedicationId: data.studentMedicationId,
      nurseId: data.nurseId,
      scheduledTime: new Date(data.scheduledTime),
      deviceId: request.deviceId,
    });

    try {
      // 1. Five Rights Validation (CRITICAL - must not fail)
      await this.validateFiveRights(data);

      // 2. Duplicate Check (CRITICAL)
      const duplicate = await this.checkDuplicate(
        data.studentMedicationId,
        data.scheduledTime,
        idempotencyKey
      );

      if (duplicate) {
        throw new MedicationError(
          MedicationErrorType.DUPLICATE_ADMINISTRATION,
          1,
          'Medication already administered within time window',
          { existingAdministration: duplicate },
          false,  // Not retryable
          true    // Safety event
        );
      }

      // 3. Allergy Check (CRITICAL)
      await this.checkAllergies(data.studentMedicationId);

      // 4. Drug Interaction Check (CRITICAL)
      await this.checkInteractions(data.studentMedicationId);

      // 5. Write to database with circuit breaker
      const result = await this.circuitBreaker.execute(
        async () => {
          return await prisma.medicationLog.create({
            data: {
              ...data,
              idempotencyKey,
              administeredAt: new Date(data.scheduledTime),
            },
          });
        },
        {
          fallback: async () => {
            // CRITICAL: Queue locally if DB fails
            await this.offlineQueue.enqueue({
              operation: 'ADMINISTER',
              payload: { ...data, idempotencyKey },
              timestamp: Date.now(),
            });

            // Return pending status
            return {
              id: idempotencyKey,
              status: 'PENDING_SYNC',
              ...data,
            };
          },
        }
      );

      // 6. Log successful administration
      logger.info('Medication administered', {
        id: result.id,
        studentMedicationId: data.studentMedicationId,
        nurseId: data.nurseId,
        idempotencyKey,
      });

      // 7. Trigger inventory update (async, non-blocking)
      this.eventBus.emit('medication:administered', result);

      return result;

    } catch (error) {
      // Enhanced error handling
      if (error instanceof MedicationError) {
        // Log safety events immediately
        if (error.safetyEvent) {
          await this.logSafetyEvent(error, data);
        }

        // Alert based on error level
        if (error.level === 1) {
          await this.alertCritical(error, data);
        }

        throw error;
      }

      // Unknown error - treat as critical
      const medicationError = new MedicationError(
        MedicationErrorType.DATABASE_ERROR,
        1,
        error.message || 'Unknown error during administration',
        { originalError: error },
        true,  // Retryable
        true   // Safety event (unknown errors are safety critical)
      );

      await this.logSafetyEvent(medicationError, data);
      throw medicationError;
    }
  }

  private async validateFiveRights(data: LogAdministrationRequest): Promise<void> {
    // Right Patient
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
    });
    if (!student) {
      throw new MedicationError(
        MedicationErrorType.WRONG_PATIENT,
        1,
        'Student not found',
        { studentId: data.studentId },
        false,
        true
      );
    }

    // Right Medication & Prescription
    const prescription = await prisma.studentMedication.findUnique({
      where: { id: data.studentMedicationId },
      include: { medication: true },
    });

    if (!prescription || !prescription.isActive) {
      throw new MedicationError(
        MedicationErrorType.PRESCRIPTION_EXPIRED,
        1,
        'Prescription not found or inactive',
        { studentMedicationId: data.studentMedicationId },
        false,
        true
      );
    }

    // Right Dose (validate against prescription)
    if (data.dosage !== prescription.dosage) {
      throw new MedicationError(
        MedicationErrorType.WRONG_DOSE,
        1,
        `Dose mismatch: prescribed ${prescription.dosage}, attempting ${data.dosage}`,
        { prescribed: prescription.dosage, attempted: data.dosage },
        false,
        true
      );
    }

    // Right Time (within acceptable window)
    const scheduledTime = new Date(data.scheduledTime);
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - scheduledTime.getTime());
    const maxVariance = 3600000; // 1 hour

    if (timeDiff > maxVariance) {
      throw new MedicationError(
        MedicationErrorType.WRONG_TIME,
        1,
        `Administration time outside acceptable window`,
        { scheduled: scheduledTime, actual: now, variance: timeDiff },
        false,
        true
      );
    }
  }

  private async checkDuplicate(
    studentMedicationId: string,
    scheduledTime: string,
    idempotencyKey: string
  ): Promise<MedicationLog | null> {
    // Check by idempotency key first
    const byKey = await prisma.medicationLog.findUnique({
      where: { idempotencyKey },
    });
    if (byKey) return byKey;

    // Check by time window (1 hour before/after)
    const scheduled = new Date(scheduledTime);
    const windowStart = new Date(scheduled.getTime() - 3600000);
    const windowEnd = new Date(scheduled.getTime() + 3600000);

    return await prisma.medicationLog.findFirst({
      where: {
        studentMedicationId,
        timeGiven: {
          gte: windowStart,
          lte: windowEnd,
        },
      },
    });
  }

  private async checkAllergies(studentMedicationId: string): Promise<void> {
    const prescription = await prisma.studentMedication.findUnique({
      where: { id: studentMedicationId },
      include: {
        medication: true,
        student: {
          include: {
            allergies: {
              where: { severity: { in: ['SEVERE', 'LIFE_THREATENING'] } },
            },
          },
        },
      },
    });

    if (!prescription) return;

    // Check for known allergies to this medication
    const allergyConflict = prescription.student.allergies.find(
      allergy => allergy.allergen.toLowerCase().includes(
        prescription.medication.name.toLowerCase()
      )
    );

    if (allergyConflict) {
      throw new MedicationError(
        MedicationErrorType.ALLERGY_CONFLICT,
        1,
        `Patient has ${allergyConflict.severity} allergy to ${allergyConflict.allergen}`,
        {
          medication: prescription.medication.name,
          allergen: allergyConflict.allergen,
          severity: allergyConflict.severity,
        },
        false,
        true
      );
    }
  }
}
```

---

## 8. Health Check Endpoints

### 8.1 Service Health Checks

```typescript
interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: ComponentHealth;
    cache: ComponentHealth;
    queue: ComponentHealth;
    circuitBreakers: CircuitBreakerHealth;
  };
  metrics: HealthMetrics;
}

interface ComponentHealth {
  status: 'up' | 'down' | 'degraded';
  latency?: number;
  error?: string;
  lastCheck: string;
}

// Endpoint: GET /api/health/medication
app.get('/api/health/medication', async (req, res) => {
  const health: HealthCheckResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: await checkDatabaseHealth(),
      cache: await checkCacheHealth(),
      queue: await checkQueueHealth(),
      circuitBreakers: await checkCircuitBreakerHealth(),
    },
    metrics: await getHealthMetrics(),
  };

  // Determine overall status
  const hasUnhealthy = Object.values(health.checks).some(
    check => check.status === 'down'
  );
  const hasDegraded = Object.values(health.checks).some(
    check => check.status === 'degraded'
  );

  if (hasUnhealthy) {
    health.status = 'unhealthy';
    res.status(503);
  } else if (hasDegraded) {
    health.status = 'degraded';
    res.status(200);
  } else {
    res.status(200);
  }

  res.json(health);
});

async function checkDatabaseHealth(): Promise<ComponentHealth> {
  const start = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: 'up',
      latency: Date.now() - start,
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'down',
      error: error.message,
      lastCheck: new Date().toISOString(),
    };
  }
}

async function checkCircuitBreakerHealth(): Promise<CircuitBreakerHealth> {
  const breakers = [
    { name: 'medication_admin', breaker: medicationAdminBreaker },
    { name: 'prescription_mgmt', breaker: prescriptionBreaker },
    { name: 'inventory_ops', breaker: inventoryBreaker },
  ];

  return {
    breakers: breakers.map(b => ({
      name: b.name,
      state: b.breaker.getState(),
      stats: b.breaker.getStats(),
    })),
  };
}
```

### 8.2 Readiness Check

```typescript
// Endpoint: GET /api/health/medication/ready
app.get('/api/health/medication/ready', async (req, res) => {
  // Check if service is ready to accept traffic

  const ready = {
    database: await isDatabaseReady(),
    migrations: await areMigrationsComplete(),
    cache: await isCacheReady(),
    queue: await isQueueReady(),
  };

  const isReady = Object.values(ready).every(v => v === true);

  if (isReady) {
    res.status(200).json({ ready: true, checks: ready });
  } else {
    res.status(503).json({ ready: false, checks: ready });
  }
});
```

---

## 9. Monitoring & Alerting

### 9.1 Critical Metrics

```typescript
const MEDICATION_METRICS = {
  // Administration Metrics
  'medication.admin.success': 'counter',
  'medication.admin.failure': 'counter',
  'medication.admin.duplicate_prevented': 'counter',
  'medication.admin.queue_size': 'gauge',
  'medication.admin.latency': 'histogram',
  'medication.admin.offline_mode': 'gauge',

  // Safety Metrics
  'medication.safety.allergy_conflict_prevented': 'counter',
  'medication.safety.interaction_prevented': 'counter',
  'medication.safety.wrong_patient_prevented': 'counter',
  'medication.safety.wrong_dose_prevented': 'counter',
  'medication.safety.five_rights_violation': 'counter',

  // Adverse Reactions
  'medication.adverse_reaction.reported': 'counter',
  'medication.adverse_reaction.severity': 'counter',  // labeled by severity

  // Circuit Breaker Metrics
  'medication.circuit_breaker.state': 'gauge',  // 0=closed, 1=open, 2=half-open
  'medication.circuit_breaker.opened': 'counter',
  'medication.circuit_breaker.fallback_executed': 'counter',

  // Queue Metrics
  'medication.queue.enqueued': 'counter',
  'medication.queue.synced': 'counter',
  'medication.queue.failed': 'counter',
  'medication.queue.dlq_size': 'gauge',
  'medication.queue.age_oldest': 'gauge',

  // Database Metrics
  'medication.db.query_latency': 'histogram',
  'medication.db.connection_errors': 'counter',
  'medication.db.transaction_failures': 'counter',
};
```

### 9.2 Alert Definitions

```typescript
const CRITICAL_ALERTS = [
  {
    name: 'MedicationAdministrationFailure',
    condition: 'medication.admin.failure > 0',
    severity: 'CRITICAL',
    channels: ['pagerduty', 'sms', 'slack'],
    escalation: {
      delay: 60,  // seconds
      recipients: ['on-call-nurse', 'tech-lead', 'cto'],
    },
    message: 'Medication administration logging failure detected',
    runbook: 'https://docs/runbooks/medication-admin-failure',
  },

  {
    name: 'MedicationQueueBacklog',
    condition: 'medication.queue.age_oldest > 300',  // 5 minutes
    severity: 'HIGH',
    channels: ['slack', 'email'],
    message: 'Medication administration queue has records older than 5 minutes',
    runbook: 'https://docs/runbooks/queue-backlog',
  },

  {
    name: 'MedicationCircuitBreakerOpen',
    condition: 'medication.circuit_breaker.state == 1',
    severity: 'CRITICAL',
    channels: ['pagerduty', 'sms'],
    message: 'Medication circuit breaker is OPEN - service degraded',
    runbook: 'https://docs/runbooks/circuit-breaker-open',
  },

  {
    name: 'MedicationDLQItems',
    condition: 'medication.queue.dlq_size > 0',
    severity: 'CRITICAL',
    channels: ['pagerduty', 'email'],
    message: 'Items in medication Dead Letter Queue require manual intervention',
    runbook: 'https://docs/runbooks/dlq-recovery',
  },

  {
    name: 'MedicationSafetyViolation',
    condition: 'medication.safety.five_rights_violation > 0',
    severity: 'CRITICAL',
    channels: ['pagerduty', 'sms', 'incident-management'],
    escalation: {
      immediate: ['chief-nursing-officer', 'compliance-officer'],
    },
    message: 'Five Rights violation detected in medication administration',
    requiresIncident: true,
  },

  {
    name: 'AdverseReactionSevere',
    condition: 'medication.adverse_reaction.severity{severity="SEVERE"} > 0',
    severity: 'CRITICAL',
    channels: ['pagerduty', 'sms'],
    escalation: {
      immediate: ['medical-director', 'on-call-nurse'],
    },
    message: 'Severe adverse reaction reported',
  },
];
```

### 9.3 Dashboard Requirements

```typescript
const MEDICATION_DASHBOARD = {
  title: 'Medication Module Health',

  panels: [
    {
      title: 'Administration Success Rate',
      type: 'graph',
      query: 'rate(medication.admin.success[5m]) / rate(medication.admin.total[5m])',
      threshold: {
        warning: 0.95,   // <95% success
        critical: 0.90,  // <90% success
      },
    },

    {
      title: 'Queue Status',
      type: 'multi-stat',
      metrics: [
        'medication.queue.size',
        'medication.queue.age_oldest',
        'medication.queue.dlq_size',
      ],
    },

    {
      title: 'Circuit Breaker States',
      type: 'state-timeline',
      metric: 'medication.circuit_breaker.state',
      labels: ['admin', 'prescription', 'inventory'],
    },

    {
      title: 'Safety Metrics',
      type: 'stat-panel',
      metrics: [
        'medication.safety.allergy_conflict_prevented',
        'medication.safety.interaction_prevented',
        'medication.safety.five_rights_violation',
      ],
    },

    {
      title: 'Adverse Reactions (24h)',
      type: 'bar-chart',
      query: 'sum by(severity)(medication.adverse_reaction.severity[24h])',
    },

    {
      title: 'Operation Latency',
      type: 'heatmap',
      metric: 'medication.admin.latency',
      buckets: [100, 500, 1000, 3000, 5000],
    },
  ],
};
```

---

## 10. Testing Strategy

### 10.1 Chaos Engineering Tests

```typescript
describe('Medication Resilience - Chaos Tests', () => {
  describe('Database Failure Scenarios', () => {
    it('should queue locally when database is unavailable', async () => {
      // Simulate database down
      await toxiproxy.disableDatabase();

      // Attempt administration
      const result = await medicationService.logAdministration({
        studentMedicationId: 'test-123',
        nurseId: 'nurse-456',
        dosage: '500mg',
        scheduledTime: new Date(),
      });

      // Should succeed with queued status
      expect(result.status).toBe('PENDING_SYNC');

      // Verify local queue
      const queue = await offlineQueue.getPending();
      expect(queue).toHaveLength(1);
      expect(queue[0].operation).toBe('ADMINISTER');

      // Restore database
      await toxiproxy.enableDatabase();

      // Wait for sync
      await wait(5000);

      // Verify synced to database
      const synced = await prisma.medicationLog.findUnique({
        where: { idempotencyKey: result.idempotencyKey },
      });
      expect(synced).toBeDefined();
    });

    it('should prevent duplicate when sync retries', async () => {
      // Create administration record
      const admin = await medicationService.logAdministration(testData);

      // Simulate duplicate sync attempt
      const duplicate = await medicationService.logAdministration({
        ...testData,
        // Same idempotency key
      });

      // Should return existing record
      expect(duplicate.id).toBe(admin.id);

      // Verify only one record in database
      const count = await prisma.medicationLog.count({
        where: { studentMedicationId: testData.studentMedicationId },
      });
      expect(count).toBe(1);
    });
  });

  describe('Network Failure Scenarios', () => {
    it('should handle intermittent network failures with retry', async () => {
      // Configure toxiproxy for 50% packet loss
      await toxiproxy.setLatency('database', { latency: 100, jitter: 50 });
      await toxiproxy.setPacketLoss('database', 0.5);

      // Should succeed after retries
      const result = await medicationService.logAdministration(testData);
      expect(result.id).toBeDefined();

      // Verify retry metrics
      const metrics = await getMetrics();
      expect(metrics['medication.admin.retries']).toBeGreaterThan(0);
    });

    it('should timeout slow operations', async () => {
      // Add 10 second latency
      await toxiproxy.setLatency('database', { latency: 10000 });

      // Should timeout and queue locally
      const start = Date.now();
      const result = await medicationService.logAdministration(testData);
      const duration = Date.now() - start;

      // Should timeout within 5 seconds
      expect(duration).toBeLessThan(6000);
      expect(result.status).toBe('PENDING_SYNC');
    });
  });

  describe('Circuit Breaker Behavior', () => {
    it('should open circuit after failure threshold', async () => {
      // Cause 3 consecutive failures
      await toxiproxy.disableDatabase();

      for (let i = 0; i < 3; i++) {
        await medicationService.logAdministration({
          ...testData,
          studentMedicationId: `test-${i}`,
        });
      }

      // Circuit should be open
      const state = medicationCircuitBreaker.getState();
      expect(state).toBe('OPEN');

      // Subsequent requests should fail fast
      const start = Date.now();
      await medicationService.logAdministration(testData);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);  // Fast fail
    });

    it('should transition to half-open and close on success', async () => {
      // Open circuit
      await openCircuitBreaker();

      // Wait for timeout
      await wait(30000);

      // Re-enable database
      await toxiproxy.enableDatabase();

      // Next request should succeed
      const result = await medicationService.logAdministration(testData);
      expect(result.id).toBeDefined();

      // After 5 successes, circuit should close
      for (let i = 0; i < 5; i++) {
        await medicationService.logAdministration({
          ...testData,
          studentMedicationId: `test-${i}`,
        });
      }

      expect(medicationCircuitBreaker.getState()).toBe('CLOSED');
    });
  });

  describe('Safety Validations', () => {
    it('should prevent duplicate administration', async () => {
      // First administration
      await medicationService.logAdministration(testData);

      // Attempt duplicate (within 1 hour)
      await expect(
        medicationService.logAdministration({
          ...testData,
          scheduledTime: new Date(Date.now() + 30 * 60000),  // 30 min later
        })
      ).rejects.toThrow(MedicationError);
    });

    it('should detect allergy conflicts', async () => {
      // Add severe allergy
      await prisma.allergy.create({
        data: {
          studentId: testStudent.id,
          allergen: 'Penicillin',
          severity: 'SEVERE',
        },
      });

      // Attempt to administer penicillin
      await expect(
        medicationService.logAdministration({
          ...testData,
          studentMedicationId: penicillinPrescription.id,
        })
      ).rejects.toThrow('allergy');
    });

    it('should validate Five Rights', async () => {
      // Wrong dose
      await expect(
        medicationService.logAdministration({
          ...testData,
          dosage: '1000mg',  // Prescribed was 500mg
        })
      ).rejects.toThrow('dose mismatch');

      // Wrong time (>1 hour variance)
      await expect(
        medicationService.logAdministration({
          ...testData,
          scheduledTime: new Date(Date.now() + 2 * 3600000),  // 2 hours future
        })
      ).rejects.toThrow('time outside acceptable window');
    });
  });
});
```

### 10.2 Load Testing

```typescript
describe('Medication Resilience - Load Tests', () => {
  it('should handle 1000 concurrent administrations', async () => {
    const requests = Array.from({ length: 1000 }, (_, i) => ({
      studentMedicationId: `med-${i}`,
      nurseId: `nurse-${i % 10}`,
      dosage: '500mg',
      scheduledTime: new Date(),
    }));

    const results = await Promise.allSettled(
      requests.map(req => medicationService.logAdministration(req))
    );

    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Should achieve >99% success
    expect(succeeded / 1000).toBeGreaterThan(0.99);

    // Check no duplicates
    const logs = await prisma.medicationLog.findMany();
    const uniqueKeys = new Set(logs.map(l => l.idempotencyKey));
    expect(uniqueKeys.size).toBe(succeeded);
  });

  it('should maintain performance under database degradation', async () => {
    // Add 500ms latency
    await toxiproxy.setLatency('database', { latency: 500 });

    const start = Date.now();
    await medicationService.logAdministration(testData);
    const duration = Date.now() - start;

    // Should still complete within timeout
    expect(duration).toBeLessThan(5000);
  });
});
```

---

## 11. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Implement circuit breaker infrastructure
- [ ] Add timeout protection to all database operations
- [ ] Create error classification system
- [ ] Implement basic retry mechanism
- [ ] Add health check endpoints

### Phase 2: Offline Capability (Week 3-4)
- [ ] Implement local queue (IndexedDB/SQLite)
- [ ] Create sync service
- [ ] Add idempotency middleware
- [ ] Implement conflict resolution
- [ ] Add offline mode UI indicators

### Phase 3: Safety Validations (Week 5-6)
- [ ] Implement Five Rights validation
- [ ] Add duplicate prevention
- [ ] Create allergy check service
- [ ] Implement drug interaction detection
- [ ] Add contraindication validation

### Phase 4: Monitoring & Alerting (Week 7-8)
- [ ] Implement metrics collection
- [ ] Create dashboards
- [ ] Configure alert rules
- [ ] Set up escalation policies
- [ ] Create runbooks

### Phase 5: Testing & Validation (Week 9-10)
- [ ] Chaos engineering tests
- [ ] Load testing
- [ ] Safety validation tests
- [ ] End-to-end resilience testing
- [ ] Compliance audit

### Phase 6: Documentation & Training (Week 11-12)
- [ ] Complete technical documentation
- [ ] Create user guides
- [ ] Conduct nurse training
- [ ] Disaster recovery procedures
- [ ] Go-live checklist

---

## 12. Compliance & Audit Trail

### 12.1 HIPAA Compliance

All resilience mechanisms must maintain HIPAA compliance:

- **Encryption**: All queued data encrypted at rest (AES-256)
- **Access Logging**: Every queue access logged with user ID
- **Data Retention**: Queue data retained per HIPAA requirements (7 years)
- **Audit Trail**: All sync operations audited
- **PHI Protection**: No PHI in logs or metrics

### 12.2 FDA 21 CFR Part 11

For electronic medication records:

- **Electronic Signatures**: Idempotency keys serve as transaction signatures
- **Audit Trail**: Immutable log of all administration attempts
- **System Validation**: Comprehensive testing and validation
- **Access Control**: Role-based access to queue management
- **Data Integrity**: Checksums on queued records

---

## Appendix A: Configuration Examples

### Database Connection with Circuit Breaker

```typescript
// prisma/client.ts
import { PrismaClient } from '@prisma/client';
import CircuitBreaker from 'opossum';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Wrap Prisma operations in circuit breaker
const circuitBreakerOptions = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
  volumeThreshold: 10,
};

export const medicationBreaker = new CircuitBreaker(
  async (operation: () => Promise<any>) => operation(),
  circuitBreakerOptions
);

// Usage
export async function safeMedicationQuery<T>(
  operation: () => Promise<T>
): Promise<T> {
  return medicationBreaker.fire(operation);
}
```

### Queue Configuration

```typescript
// config/queue.ts
export const QUEUE_CONFIG = {
  storage: {
    type: process.env.PLATFORM === 'mobile' ? 'sqlite' : 'indexeddb',
    dbName: 'medication_queue',
    version: 1,
  },

  sync: {
    enabled: true,
    intervalMs: 30000,  // 30 seconds
    batchSize: 10,
    concurrency: 3,
    retryPolicy: {
      maxAttempts: Infinity,
      baseDelay: 1000,
      maxDelay: 3600000,
    },
  },

  dlq: {
    enabled: true,
    threshold: 100,  // attempts
    alertImmediately: true,
  },
};
```

---

## Appendix B: Monitoring Queries

### Prometheus Queries

```promql
# Administration success rate (last 5 minutes)
rate(medication_admin_success_total[5m]) /
  rate(medication_admin_total[5m])

# Queue backlog age
max(medication_queue_age_oldest_seconds)

# Circuit breaker state changes
changes(medication_circuit_breaker_state[1h])

# Safety violations (24h)
sum(medication_safety_five_rights_violation_total[24h])

# Adverse reactions by severity
sum by(severity)(medication_adverse_reaction_severity_total[24h])
```

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-10 | System Architect | Initial specification |

**Review Schedule:** Quarterly
**Next Review:** 2026-01-10
**Owner:** Chief Technology Officer
**Approvers:** Chief Nursing Officer, Compliance Officer, Chief Medical Officer
