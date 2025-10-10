# Medication Resilience Testing Guide

**Version:** 1.0
**Last Updated:** 2025-10-10
**Related:** MEDICATION_RESILIENCE_ARCHITECTURE.md

---

## Overview

This guide provides comprehensive testing strategies for validating the resilience and safety mechanisms of the medication management module. Given the life-critical nature of medication administration, testing must be thorough and systematic.

---

## 1. Testing Levels

### 1.1 Unit Tests
- Circuit breaker state transitions
- Retry logic with various error types
- Timeout enforcement
- Idempotency key generation
- Five Rights validation
- Allergy checking
- Duplicate detection

### 1.2 Integration Tests
- Database failure scenarios
- Network interruption handling
- Queue sync mechanisms
- Circuit breaker with real dependencies
- End-to-end administration flow

### 1.3 Chaos Engineering Tests
- Random database failures
- Network partition scenarios
- Latency injection
- Resource exhaustion
- Cascading failures

### 1.4 Load Tests
- Concurrent administrations
- Queue backlog stress
- Circuit breaker under load
- Database connection pool exhaustion

### 1.5 Safety Validation Tests
- Five Rights violation prevention
- Duplicate administration blocking
- Allergy conflict detection
- Wrong dose/patient/medication prevention

---

## 2. Circuit Breaker Tests

### 2.1 State Transition Tests

```typescript
describe('Circuit Breaker State Transitions', () => {
  let breaker: CircuitBreaker;

  beforeEach(() => {
    breaker = CircuitBreakerFactory.createLevel1('test_breaker');
  });

  it('should remain closed on successful operations', async () => {
    for (let i = 0; i < 10; i++) {
      await breaker.execute(async () => 'success');
    }

    expect(breaker.getState()).toBe(CircuitState.CLOSED);
  });

  it('should open after failure threshold exceeded', async () => {
    // Level 1 breaker opens after 1 failure
    await expect(
      breaker.execute(async () => {
        throw new Error('Database failure');
      })
    ).rejects.toThrow();

    expect(breaker.getState()).toBe(CircuitState.OPEN);
  });

  it('should transition to half-open after timeout', async () => {
    // Open the circuit
    await expect(
      breaker.execute(async () => {
        throw new Error('Failure');
      })
    ).rejects.toThrow();

    expect(breaker.getState()).toBe(CircuitState.OPEN);

    // Wait for reset timeout (30 seconds for Level 1)
    await sleep(31000);

    // Next request should trigger half-open
    try {
      await breaker.execute(async () => 'success');
    } catch {}

    const stats = breaker.getStats();
    expect(stats.state).toBe(CircuitState.HALF_OPEN);
  });

  it('should close after success threshold in half-open', async () => {
    // Open the circuit
    breaker.forceOpen();
    await sleep(31000);

    // Execute 5 successful requests (success threshold for Level 1)
    for (let i = 0; i < 5; i++) {
      await breaker.execute(async () => `success ${i}`);
    }

    expect(breaker.getState()).toBe(CircuitState.CLOSED);
  });

  it('should re-open on failure in half-open state', async () => {
    breaker.forceOpen();
    await sleep(31000);

    // First request succeeds
    await breaker.execute(async () => 'success');
    expect(breaker.getState()).toBe(CircuitState.HALF_OPEN);

    // Second request fails
    await expect(
      breaker.execute(async () => {
        throw new Error('Failure');
      })
    ).rejects.toThrow();

    expect(breaker.getState()).toBe(CircuitState.OPEN);
  });
});
```

### 2.2 Fallback Execution Tests

```typescript
describe('Circuit Breaker Fallback', () => {
  it('should execute fallback when circuit is open', async () => {
    const breaker = CircuitBreakerFactory.createLevel1('fallback_test');
    breaker.forceOpen();

    const result = await breaker.execute(
      async () => {
        throw new Error('Should not execute');
      },
      {
        fallback: async () => ({
          status: 'QUEUED',
          message: 'Operation queued for later',
        }),
      }
    );

    expect(result.status).toBe('QUEUED');
  });

  it('should execute fallback on operation failure', async () => {
    const breaker = CircuitBreakerFactory.createLevel1('fallback_test_2');

    const result = await breaker.execute(
      async () => {
        throw new Error('Operation failed');
      },
      {
        fallback: async () => ({
          status: 'FALLBACK',
          data: 'Fallback data',
        }),
      }
    );

    expect(result.status).toBe('FALLBACK');
  });
});
```

### 2.3 Timeout Tests

```typescript
describe('Circuit Breaker Timeout', () => {
  it('should timeout slow operations', async () => {
    const breaker = CircuitBreakerFactory.createLevel1('timeout_test');

    await expect(
      breaker.execute(async () => {
        await sleep(10000); // 10 seconds, timeout is 5 seconds
        return 'Should not return';
      })
    ).rejects.toThrow(TimeoutError);
  });

  it('should not timeout fast operations', async () => {
    const breaker = CircuitBreakerFactory.createLevel1('timeout_test_2');

    const result = await breaker.execute(async () => {
      await sleep(100); // 100ms
      return 'success';
    });

    expect(result).toBe('success');
  });
});
```

---

## 3. Offline Queue Tests

### 3.1 Queue Operations Tests

```typescript
describe('Medication Queue Operations', () => {
  let queue: MedicationQueue;
  let storage: QueueStorage;

  beforeEach(async () => {
    storage = new IndexedDBStorage();
    await storage.initialize();
    await storage.clear();

    queue = new MedicationQueue(storage, mockSyncService);
    await queue.initialize();
  });

  it('should enqueue medication administration', async () => {
    const record = await queue.enqueue({
      operation: 'ADMINISTER',
      payload: { studentMedicationId: 'med-123', dosage: '500mg' },
      idempotencyKey: 'idmp_test_123',
      nurseId: 'nurse-1',
      deviceId: 'device-1',
    });

    expect(record.status).toBe('PENDING');
    expect(record.idempotencyKey).toBe('idmp_test_123');

    const stats = await queue.getStats();
    expect(stats.pending).toBe(1);
  });

  it('should sync records when online', async () => {
    // Mock online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    // Enqueue records
    await queue.enqueue({
      operation: 'ADMINISTER',
      payload: { studentMedicationId: 'med-123' },
      idempotencyKey: 'idmp_1',
      nurseId: 'nurse-1',
      deviceId: 'device-1',
    });

    // Sync
    const result = await queue.syncQueue();

    expect(result.status).toBe('COMPLETED');
    expect(result.synced).toBe(1);

    const stats = await queue.getStats();
    expect(stats.pending).toBe(0);
  });

  it('should not sync when offline', async () => {
    // Mock offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    await queue.enqueue({
      operation: 'ADMINISTER',
      payload: { studentMedicationId: 'med-123' },
      idempotencyKey: 'idmp_1',
      nurseId: 'nurse-1',
      deviceId: 'device-1',
    });

    const result = await queue.syncQueue();

    expect(result.status).toBe('OFFLINE');
    expect(result.synced).toBe(0);
  });
});
```

### 3.2 Dead Letter Queue Tests

```typescript
describe('Dead Letter Queue', () => {
  it('should move to DLQ after max attempts', async () => {
    const queue = new MedicationQueue(
      storage,
      {
        checkIfSynced: async () => false,
        syncAdministration: async () => {
          throw new Error('Persistent failure');
        },
      },
      { dlqThreshold: 3 }
    );

    await queue.initialize();

    const record = await queue.enqueue({
      operation: 'ADMINISTER',
      payload: { test: 'data' },
      idempotencyKey: 'idmp_dlq',
      nurseId: 'nurse-1',
      deviceId: 'device-1',
    });

    // Attempt sync 3 times
    for (let i = 0; i < 3; i++) {
      await queue.syncQueue();
    }

    const dlqRecords = await queue.getDLQRecords();
    expect(dlqRecords.length).toBe(1);
    expect(dlqRecords[0].id).toBe(record.id);
  });

  it('should allow manual retry from DLQ', async () => {
    // ... move record to DLQ ...

    const dlqRecords = await queue.getDLQRecords();
    const dlqRecord = dlqRecords[0];

    await queue.retryDLQRecord(dlqRecord.id);

    const stats = await queue.getStats();
    expect(stats.dlq).toBe(0);
    expect(stats.pending).toBe(1);
  });
});
```

### 3.3 Idempotency Tests

```typescript
describe('Queue Idempotency', () => {
  it('should not duplicate synced records', async () => {
    const syncedKeys = new Set<string>();

    const queue = new MedicationQueue(storage, {
      checkIfSynced: async (key) => syncedKeys.has(key),
      syncAdministration: async (payload, key) => {
        syncedKeys.add(key);
        return { id: 'log-1' };
      },
    });

    await queue.initialize();

    // Enqueue same record twice
    await queue.enqueue({
      operation: 'ADMINISTER',
      payload: { test: 'data' },
      idempotencyKey: 'idmp_same',
      nurseId: 'nurse-1',
      deviceId: 'device-1',
    });

    await queue.enqueue({
      operation: 'ADMINISTER',
      payload: { test: 'data' },
      idempotencyKey: 'idmp_same',
      nurseId: 'nurse-1',
      deviceId: 'device-1',
    });

    // Sync
    await queue.syncQueue();

    // Only one should be synced
    expect(syncedKeys.size).toBe(1);
  });
});
```

---

## 4. Safety Validation Tests

### 4.1 Five Rights Validation

```typescript
describe('Five Rights Validation', () => {
  it('should prevent wrong dose administration', async () => {
    const prescription = await createTestPrescription({
      dosage: '500mg',
    });

    await expect(
      ResilientMedicationService.logMedicationAdministration({
        studentMedicationId: prescription.id,
        nurseId: 'nurse-1',
        dosageGiven: '1000mg', // Wrong dose
        timeGiven: new Date(),
      })
    ).rejects.toThrow(MedicationError);
  });

  it('should prevent administration outside time window', async () => {
    const prescription = await createTestPrescription();

    const futureTime = new Date(Date.now() + 2 * 3600000); // 2 hours in future

    await expect(
      ResilientMedicationService.logMedicationAdministration({
        studentMedicationId: prescription.id,
        nurseId: 'nurse-1',
        dosageGiven: prescription.dosage,
        timeGiven: futureTime,
      })
    ).rejects.toThrow('time outside acceptable window');
  });

  it('should prevent expired prescription administration', async () => {
    const expiredPrescription = await createTestPrescription({
      endDate: new Date(Date.now() - 86400000), // Yesterday
    });

    await expect(
      ResilientMedicationService.logMedicationAdministration({
        studentMedicationId: expiredPrescription.id,
        nurseId: 'nurse-1',
        dosageGiven: expiredPrescription.dosage,
        timeGiven: new Date(),
      })
    ).rejects.toThrow('Prescription outside valid date range');
  });
});
```

### 4.2 Duplicate Prevention

```typescript
describe('Duplicate Administration Prevention', () => {
  it('should prevent duplicate within 1 hour window', async () => {
    const prescription = await createTestPrescription();

    // First administration
    await ResilientMedicationService.logMedicationAdministration({
      studentMedicationId: prescription.id,
      nurseId: 'nurse-1',
      dosageGiven: prescription.dosage,
      timeGiven: new Date(),
    });

    // Attempt duplicate 30 minutes later
    const duplicateTime = new Date(Date.now() + 30 * 60000);

    await expect(
      ResilientMedicationService.logMedicationAdministration({
        studentMedicationId: prescription.id,
        nurseId: 'nurse-1',
        dosageGiven: prescription.dosage,
        timeGiven: duplicateTime,
      })
    ).rejects.toThrow('already administered within time window');
  });

  it('should allow administration after 1 hour window', async () => {
    const prescription = await createTestPrescription();

    // First administration
    await ResilientMedicationService.logMedicationAdministration({
      studentMedicationId: prescription.id,
      nurseId: 'nurse-1',
      dosageGiven: prescription.dosage,
      timeGiven: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    });

    // Should succeed
    const result = await ResilientMedicationService.logMedicationAdministration({
      studentMedicationId: prescription.id,
      nurseId: 'nurse-1',
      dosageGiven: prescription.dosage,
      timeGiven: new Date(),
    });

    expect(result.id).toBeDefined();
  });
});
```

### 4.3 Allergy Detection

```typescript
describe('Allergy Conflict Detection', () => {
  it('should prevent administration with severe allergy', async () => {
    const student = await createTestStudent();
    await createAllergy({
      studentId: student.id,
      allergen: 'Penicillin',
      severity: 'SEVERE',
    });

    const penicillinMed = await createTestMedication({
      name: 'Penicillin V',
    });

    const prescription = await createTestPrescription({
      studentId: student.id,
      medicationId: penicillinMed.id,
    });

    await expect(
      ResilientMedicationService.logMedicationAdministration({
        studentMedicationId: prescription.id,
        nurseId: 'nurse-1',
        dosageGiven: prescription.dosage,
        timeGiven: new Date(),
      })
    ).rejects.toThrow('allergy');
  });

  it('should prevent prescription with allergy conflict', async () => {
    const student = await createTestStudent();
    await createAllergy({
      studentId: student.id,
      allergen: 'Penicillin',
      severity: 'LIFE_THREATENING',
    });

    const penicillinMed = await createTestMedication({
      name: 'Amoxicillin', // Penicillin-based
    });

    await expect(
      ResilientMedicationService.createPrescription({
        studentId: student.id,
        medicationId: penicillinMed.id,
        dosage: '500mg',
        frequency: '2x daily',
        route: 'oral',
        startDate: new Date(),
        prescribedBy: 'Dr. Smith',
      })
    ).rejects.toThrow('allergy');
  });
});
```

---

## 5. Chaos Engineering Tests

### 5.1 Database Failure Scenarios

```typescript
describe('Database Failure Resilience', () => {
  let toxiproxy: ToxiproxyClient;

  beforeAll(async () => {
    toxiproxy = new ToxiproxyClient('http://localhost:8474');
    await toxiproxy.createProxy('postgres', 'localhost:5432', 'localhost:15432');
  });

  it('should queue locally when database is down', async () => {
    // Disable database
    await toxiproxy.disableProxy('postgres');

    const result = await ResilientMedicationService.logMedicationAdministration({
      studentMedicationId: 'med-123',
      nurseId: 'nurse-1',
      dosageGiven: '500mg',
      timeGiven: new Date(),
    });

    expect(result.status).toBe('PENDING_SYNC');
    expect(result.queued).toBe(true);

    // Re-enable database
    await toxiproxy.enableProxy('postgres');

    // Wait for sync
    await sleep(5000);

    // Verify synced
    const log = await prisma.medicationLog.findFirst({
      where: { studentMedicationId: 'med-123' },
    });

    expect(log).toBeDefined();
  });

  it('should handle intermittent connection errors', async () => {
    // Add 50% packet loss
    await toxiproxy.addToxic('postgres', {
      type: 'latency',
      attributes: { latency: 100, jitter: 50 },
    });
    await toxiproxy.addToxic('postgres', {
      type: 'packet_loss',
      attributes: { probability: 0.5 },
    });

    // Should eventually succeed with retries
    const result = await ResilientMedicationService.logMedicationAdministration({
      studentMedicationId: 'med-123',
      nurseId: 'nurse-1',
      dosageGiven: '500mg',
      timeGiven: new Date(),
    });

    expect(result.id).toBeDefined();

    // Clean up
    await toxiproxy.removeToxic('postgres', 'latency');
    await toxiproxy.removeToxic('postgres', 'packet_loss');
  });
});
```

### 5.2 Network Partition Tests

```typescript
describe('Network Partition Resilience', () => {
  it('should handle complete network failure', async () => {
    // Mock offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    const result = await ResilientMedicationService.logMedicationAdministration({
      studentMedicationId: 'med-123',
      nurseId: 'nurse-1',
      dosageGiven: '500mg',
      timeGiven: new Date(),
    });

    expect(result.status).toBe('PENDING_SYNC');

    // Restore network
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    // Trigger network restored event
    window.dispatchEvent(new Event('online'));

    // Should sync automatically
    await sleep(2000);
  });
});
```

### 5.3 Cascading Failure Tests

```typescript
describe('Cascading Failure Prevention', () => {
  it('should isolate failures with circuit breaker', async () => {
    // Cause database failures
    await toxiproxy.disableProxy('postgres');

    // Multiple requests should fail
    for (let i = 0; i < 3; i++) {
      try {
        await ResilientMedicationService.logMedicationAdministration({
          studentMedicationId: `med-${i}`,
          nurseId: 'nurse-1',
          dosageGiven: '500mg',
          timeGiven: new Date(),
        });
      } catch {}
    }

    // Circuit should be open
    const breaker = CircuitBreakerFactory.getBreaker('medication_administration');
    expect(breaker?.getState()).toBe(CircuitState.OPEN);

    // Subsequent requests should fail fast
    const start = Date.now();
    try {
      await ResilientMedicationService.logMedicationAdministration({
        studentMedicationId: 'med-fast-fail',
        nurseId: 'nurse-1',
        dosageGiven: '500mg',
        timeGiven: new Date(),
      });
    } catch {}
    const duration = Date.now() - start;

    // Should fail in <100ms (fast fail)
    expect(duration).toBeLessThan(100);
  });
});
```

---

## 6. Load Testing

### 6.1 Concurrent Administration Tests

```typescript
describe('Load Tests', () => {
  it('should handle 1000 concurrent administrations', async () => {
    const prescriptions = await createTestPrescriptions(1000);

    const requests = prescriptions.map((p, i) => ({
      studentMedicationId: p.id,
      nurseId: `nurse-${i % 10}`,
      dosageGiven: p.dosage,
      timeGiven: new Date(Date.now() + i * 1000), // Stagger by 1 second
    }));

    const results = await Promise.allSettled(
      requests.map(req =>
        ResilientMedicationService.logMedicationAdministration(req)
      )
    );

    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Should achieve >99% success rate
    expect(succeeded / 1000).toBeGreaterThan(0.99);

    // Verify no duplicates
    const logs = await prisma.medicationLog.findMany();
    const uniqueKeys = new Set(logs.map(l => l.id));
    expect(uniqueKeys.size).toBe(succeeded);
  });
});
```

---

## 7. Performance Benchmarks

### 7.1 Target Metrics

```typescript
describe('Performance Benchmarks', () => {
  it('should log administration within 500ms (p95)', async () => {
    const prescription = await createTestPrescription();
    const latencies: number[] = [];

    for (let i = 0; i < 100; i++) {
      const start = Date.now();

      await ResilientMedicationService.logMedicationAdministration({
        studentMedicationId: prescription.id,
        nurseId: 'nurse-1',
        dosageGiven: prescription.dosage,
        timeGiven: new Date(Date.now() + i * 60000), // Different times
      });

      latencies.push(Date.now() - start);
    }

    const p95 = percentile(latencies, 95);
    expect(p95).toBeLessThan(500);
  });

  it('should sync queue within 2 seconds for 100 records', async () => {
    const queue = new MedicationQueue(storage, syncService);

    // Enqueue 100 records
    for (let i = 0; i < 100; i++) {
      await queue.enqueue({
        operation: 'ADMINISTER',
        payload: { test: i },
        idempotencyKey: `idmp_${i}`,
        nurseId: 'nurse-1',
        deviceId: 'device-1',
      });
    }

    const start = Date.now();
    await queue.syncQueue();
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(2000);
  });
});
```

---

## 8. Test Utilities

### 8.1 Helper Functions

```typescript
// Test data creation
async function createTestStudent() {
  return prisma.student.create({
    data: {
      studentNumber: `STU${Date.now()}`,
      firstName: 'Test',
      lastName: 'Student',
      dateOfBirth: new Date('2010-01-01'),
      grade: '5',
      gender: 'MALE',
    },
  });
}

async function createTestMedication(data?: Partial<any>) {
  return prisma.medication.create({
    data: {
      name: data?.name || 'Test Medication',
      dosageForm: 'tablet',
      strength: '500mg',
      ...data,
    },
  });
}

async function createTestPrescription(data?: Partial<any>) {
  const student = data?.studentId
    ? await prisma.student.findUnique({ where: { id: data.studentId } })
    : await createTestStudent();

  const medication = data?.medicationId
    ? await prisma.medication.findUnique({ where: { id: data.medicationId } })
    : await createTestMedication();

  return prisma.studentMedication.create({
    data: {
      studentId: student!.id,
      medicationId: medication!.id,
      dosage: '500mg',
      frequency: '2x daily',
      route: 'oral',
      startDate: new Date(),
      prescribedBy: 'Dr. Test',
      ...data,
    },
  });
}

// Utility functions
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function percentile(arr: number[], p: number): number {
  const sorted = arr.sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[index];
}
```

---

## 9. Test Execution

### 9.1 Running Tests

```bash
# Unit tests
npm run test:unit -- src/utils/resilience

# Integration tests
npm run test:integration -- src/services/resilientMedicationService

# Chaos tests (requires toxiproxy)
docker run -d -p 8474:8474 -p 15432:15432 shopify/toxiproxy
npm run test:chaos

# Load tests
npm run test:load -- --workers=10

# Safety validation
npm run test:safety
```

### 9.2 Coverage Requirements

- **Unit Tests:** >95% code coverage
- **Integration Tests:** All critical paths covered
- **Chaos Tests:** All failure scenarios tested
- **Safety Tests:** 100% of safety validations tested

---

## 10. Continuous Testing

### 10.1 CI/CD Pipeline

```yaml
# .github/workflows/medication-resilience.yml
name: Medication Resilience Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    paths:
      - 'backend/src/services/medicationService.ts'
      - 'backend/src/services/resilientMedicationService.ts'
      - 'backend/src/utils/resilience/**'

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Unit Tests
        run: npm run test:unit -- --coverage

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
      redis:
        image: redis:7
    steps:
      - name: Run Integration Tests
        run: npm run test:integration

  chaos-tests:
    runs-on: ubuntu-latest
    services:
      toxiproxy:
        image: shopify/toxiproxy
    steps:
      - name: Run Chaos Tests
        run: npm run test:chaos

  safety-validation:
    runs-on: ubuntu-latest
    steps:
      - name: Run Safety Tests
        run: npm run test:safety
      - name: Verify 100% Safety Coverage
        run: |
          if [ "$(npm run test:safety -- --coverage --json | jq '.safety.percentage')" != "100" ]; then
            echo "Safety test coverage must be 100%"
            exit 1
          fi
```

### 10.2 Production Monitoring

```typescript
// Continuous production testing
class ProductionHealthCheck {
  async runHealthChecks(): Promise<void> {
    // Test circuit breaker states
    const breakers = CircuitBreakerFactory.getAllBreakers();
    for (const [name, breaker] of breakers) {
      const state = breaker.getState();
      if (state === CircuitState.OPEN) {
        await this.alertOpenCircuit(name);
      }
    }

    // Test queue health
    const queueStats = await medicationQueue.getStats();
    if (queueStats.dlq > 0) {
      await this.alertDLQItems(queueStats);
    }

    // Test database connectivity
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      await this.alertDatabaseDown(error);
    }
  }
}
```

---

## Document Control

**Version History:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-10 | Initial testing guide |

**Review Schedule:** Quarterly
**Next Review:** 2026-01-10
**Owner:** QA Lead
