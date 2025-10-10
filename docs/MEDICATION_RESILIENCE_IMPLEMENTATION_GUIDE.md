# Medication Resilience Implementation Guide

**Version:** 1.0
**Last Updated:** 2025-10-10
**Prerequisites:** Node.js 18+, PostgreSQL 15+, Redis 7+

---

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install opossum          # Circuit breaker
npm install ioredis          # Redis client
npm install bull             # Queue management (alternative to custom)
npm install prom-client      # Prometheus metrics
```

### 2. Update Prisma Schema

Add idempotency tracking:

```prisma
// Add to schema.prisma
model MedicationLog {
  id             String   @id @default(cuid())
  dosageGiven    String
  timeGiven      DateTime
  administeredBy String
  notes          String?
  sideEffects    String?
  createdAt      DateTime @default(now())

  // NEW: Idempotency support
  idempotencyKey String?  @unique
  deviceId       String?
  syncStatus     String?  @default("SYNCED") // SYNCED, PENDING, FAILED

  // Relations
  studentMedication   StudentMedication @relation(fields: [studentMedicationId], references: [id])
  studentMedicationId String
  nurse               User              @relation(fields: [nurseId], references: [id])
  nurseId             String

  @@index([idempotencyKey])
  @@index([syncStatus])
  @@map("medication_logs")
}

// Add safety event tracking
model MedicationSafetyEvent {
  id              String   @id @default(cuid())
  eventType       String   // DUPLICATE_PREVENTED, ALLERGY_BLOCKED, WRONG_DOSE_BLOCKED
  severity        String   // CRITICAL, HIGH, MEDIUM
  description     String
  context         Json
  preventedAction Json
  studentId       String
  nurseId         String
  createdAt       DateTime @default(now())

  @@index([eventType, createdAt])
  @@index([studentId, createdAt])
  @@map("medication_safety_events")
}
```

Run migration:

```bash
npx prisma migrate dev --name add_medication_resilience
npx prisma generate
```

### 3. Configure Environment

```env
# .env

# Circuit Breaker Settings
CIRCUIT_BREAKER_ENABLED=true
CIRCUIT_BREAKER_TIMEOUT=5000
CIRCUIT_BREAKER_ERROR_THRESHOLD=3

# Queue Settings
MEDICATION_QUEUE_ENABLED=true
MEDICATION_QUEUE_SYNC_INTERVAL=30000
MEDICATION_QUEUE_BATCH_SIZE=10

# Redis for Idempotency
REDIS_URL=redis://localhost:6379
IDEMPOTENCY_TTL=86400

# Alerting
PAGERDUTY_API_KEY=your_key_here
ALERT_CRITICAL_CHANNEL=medication-critical
ALERT_HIGH_CHANNEL=medication-high

# Monitoring
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090
```

---

## Implementation Steps

### Step 1: Setup Circuit Breakers

Create circuit breaker instances in your service initialization:

```typescript
// backend/src/server.ts
import { CircuitBreakerFactory } from './utils/resilience/CircuitBreaker';

// Initialize circuit breakers on server start
const initializeCircuitBreakers = () => {
  const adminBreaker = CircuitBreakerFactory.createLevel1('medication_administration');
  const prescriptionBreaker = CircuitBreakerFactory.createLevel2('prescription_management');
  const inventoryBreaker = CircuitBreakerFactory.createLevel3('inventory_operations');

  // Setup monitoring
  adminBreaker.on('open', (data) => {
    logger.error('CRITICAL: Medication admin circuit opened', data);
    alertService.sendCritical('Medication administration circuit breaker opened', data);
  });

  adminBreaker.on('fallback', (data) => {
    logger.warn('Medication admin fallback executed', data);
    metricsService.incrementCounter('medication.admin.fallback');
  });

  // Metrics collection
  setInterval(() => {
    const stats = adminBreaker.getStats();
    metricsService.recordGauge('circuit_breaker.state', stats.state === 'CLOSED' ? 0 : 1, {
      breaker: 'medication_administration'
    });
  }, 10000);
};

app.on('ready', initializeCircuitBreakers);
```

### Step 2: Implement Idempotency Middleware

```typescript
// backend/src/middleware/idempotency.ts
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { logger } from '../utils/logger';

const redis = new Redis(process.env.REDIS_URL);
const IDEMPOTENCY_TTL = parseInt(process.env.IDEMPOTENCY_TTL || '86400');

export const idempotencyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only for POST/PUT/PATCH
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return next();
  }

  const idempotencyKey = req.headers['idempotency-key'] as string;

  if (!idempotencyKey) {
    return res.status(400).json({
      success: false,
      error: 'Idempotency-Key header required for this operation',
    });
  }

  // Check if already processed
  const cacheKey = `idempotency:${idempotencyKey}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    logger.info('Idempotent request detected', { idempotencyKey });

    const response = JSON.parse(cached);
    return res.status(response.statusCode || 200).json(response.body);
  }

  // Mark as processing
  await redis.set(`${cacheKey}:processing`, '1', 'EX', 60);

  // Store original send method
  const originalSend = res.send;
  const originalJson = res.json;

  // Override response methods to cache result
  res.send = function (body: any) {
    storeIdempotentResult(idempotencyKey, res.statusCode, body);
    return originalSend.call(this, body);
  };

  res.json = function (body: any) {
    storeIdempotentResult(idempotencyKey, res.statusCode, body);
    return originalJson.call(this, body);
  };

  next();
};

async function storeIdempotentResult(
  idempotencyKey: string,
  statusCode: number,
  body: any
): Promise<void> {
  const cacheKey = `idempotency:${idempotencyKey}`;

  await redis.set(
    cacheKey,
    JSON.stringify({ statusCode, body }),
    'EX',
    IDEMPOTENCY_TTL
  );

  await redis.del(`${cacheKey}:processing`);
}
```

### Step 3: Setup Offline Queue (Frontend)

```typescript
// frontend/src/services/medicationQueue.ts
import { IndexedDBStorage, MedicationQueue } from './resilience/MedicationQueue';
import { medicationsApi } from './modules/medicationsApi';

class MedicationQueueService {
  private queue?: MedicationQueue;
  private storage?: IndexedDBStorage;

  async initialize() {
    this.storage = new IndexedDBStorage();
    await this.storage.initialize();

    this.queue = new MedicationQueue(
      this.storage,
      {
        checkIfSynced: async (idempotencyKey) => {
          try {
            const response = await medicationsApi.checkIdempotency(idempotencyKey);
            return response.exists;
          } catch {
            return false;
          }
        },
        syncAdministration: async (payload, idempotencyKey) => {
          return await medicationsApi.logAdministration({
            ...payload,
            headers: {
              'Idempotency-Key': idempotencyKey,
            },
          });
        },
      },
      {
        syncIntervalMs: 30000,
        batchSize: 10,
        concurrency: 3,
        maxQueueSize: 10000,
        dlqThreshold: 100,
      }
    );

    await this.queue.initialize();

    // Setup event listeners
    this.queue.on('enqueued', (record) => {
      console.log('Medication queued for offline sync', record);
      this.showOfflineIndicator();
    });

    this.queue.on('synced', ({ synced, failed }) => {
      console.log(`Queue sync: ${synced} synced, ${failed} failed`);
      if (synced > 0) {
        this.showSyncSuccess(synced);
      }
    });

    this.queue.on('dlq', ({ record, message }) => {
      console.error('Record moved to DLQ:', message);
      this.showCriticalAlert(message);
    });

    this.queue.on('online', () => {
      this.hideOfflineIndicator();
    });

    this.queue.on('offline', () => {
      this.showOfflineIndicator();
    });
  }

  async enqueueAdministration(data: any, idempotencyKey: string) {
    if (!this.queue) throw new Error('Queue not initialized');

    return await this.queue.enqueue({
      operation: 'ADMINISTER',
      payload: data,
      idempotencyKey,
      nurseId: data.nurseId,
      deviceId: this.getDeviceId(),
    });
  }

  async getStats() {
    if (!this.queue) throw new Error('Queue not initialized');
    return await this.queue.getStats();
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  private showOfflineIndicator() {
    // Show offline banner in UI
    const banner = document.getElementById('offline-banner');
    if (banner) banner.style.display = 'block';
  }

  private hideOfflineIndicator() {
    const banner = document.getElementById('offline-banner');
    if (banner) banner.style.display = 'none';
  }

  private showSyncSuccess(count: number) {
    // Show success notification
    console.log(`Successfully synced ${count} medication records`);
  }

  private showCriticalAlert(message: string) {
    // Show critical alert modal
    alert(`CRITICAL: ${message}\nPlease contact IT support immediately.`);
  }
}

export const medicationQueueService = new MedicationQueueService();
```

### Step 4: Update Frontend Medication Administration

```typescript
// frontend/src/components/MedicationAdministration.tsx
import React, { useState } from 'react';
import { medicationQueueService } from '../services/medicationQueue';
import { IdempotencyKeyGenerator } from '../utils/idempotency';

export const MedicationAdministration: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queueStats, setQueueStats] = useState({ pending: 0 });

  useEffect(() => {
    // Initialize queue
    medicationQueueService.initialize();

    // Update queue stats periodically
    const interval = setInterval(async () => {
      const stats = await medicationQueueService.getStats();
      setQueueStats(stats);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAdminister = async (data: any) => {
    setIsSubmitting(true);

    try {
      // Generate idempotency key
      const idempotencyKey = IdempotencyKeyGenerator.generateAdministrationKey({
        studentMedicationId: data.studentMedicationId,
        nurseId: currentUser.id,
        scheduledTime: data.scheduledTime,
        deviceId: medicationQueueService.getDeviceId(),
      });

      // Check if online
      if (navigator.onLine) {
        // Try direct submission
        try {
          const result = await medicationsApi.logAdministration({
            ...data,
            headers: {
              'Idempotency-Key': idempotencyKey,
            },
          });

          showSuccess('Medication administered successfully');
          return result;

        } catch (error: any) {
          // If network error, queue locally
          if (error.message.includes('network') || error.message.includes('timeout')) {
            await medicationQueueService.enqueueAdministration(data, idempotencyKey);
            showWarning('Medication queued for sync (network issue)');
          } else {
            throw error;
          }
        }
      } else {
        // Offline - queue immediately
        await medicationQueueService.enqueueAdministration(data, idempotencyKey);
        showWarning('Medication queued for sync (offline)');
      }

    } catch (error: any) {
      showError(`Failed to administer medication: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {queueStats.pending > 0 && (
        <div className="offline-banner">
          {queueStats.pending} medication(s) pending sync
        </div>
      )}

      <MedicationForm
        onSubmit={handleAdminister}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
```

### Step 5: Setup Monitoring and Alerting

```typescript
// backend/src/utils/monitoring/metrics.ts
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

const register = new Registry();

// Medication metrics
export const medicationMetrics = {
  adminSuccess: new Counter({
    name: 'medication_admin_success_total',
    help: 'Total successful medication administrations',
    registers: [register],
  }),

  adminFailure: new Counter({
    name: 'medication_admin_failure_total',
    help: 'Total failed medication administrations',
    labelNames: ['error_type'],
    registers: [register],
  }),

  duplicatePrevented: new Counter({
    name: 'medication_duplicate_prevented_total',
    help: 'Total duplicate administrations prevented',
    registers: [register],
  }),

  allergyConflictPrevented: new Counter({
    name: 'medication_allergy_conflict_prevented_total',
    help: 'Total allergy conflicts prevented',
    labelNames: ['severity'],
    registers: [register],
  }),

  adminLatency: new Histogram({
    name: 'medication_admin_latency_seconds',
    help: 'Medication administration latency',
    buckets: [0.1, 0.5, 1, 3, 5, 10],
    registers: [register],
  }),

  queueSize: new Gauge({
    name: 'medication_queue_size',
    help: 'Current medication queue size',
    labelNames: ['status'],
    registers: [register],
  }),

  circuitBreakerState: new Gauge({
    name: 'medication_circuit_breaker_state',
    help: 'Circuit breaker state (0=closed, 1=open, 2=half-open)',
    labelNames: ['breaker'],
    registers: [register],
  }),
};

// Metrics endpoint
export const metricsHandler = async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};
```

### Step 6: Create Alert Service

```typescript
// backend/src/utils/alerting/alertService.ts
import axios from 'axios';
import { logger } from '../logger';

interface Alert {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  context?: Record<string, any>;
}

class AlertService {
  async sendCritical(title: string, context?: Record<string, any>) {
    await this.send({
      severity: 'CRITICAL',
      title,
      message: title,
      context,
    });
  }

  async sendHigh(title: string, context?: Record<string, any>) {
    await this.send({
      severity: 'HIGH',
      title,
      message: title,
      context,
    });
  }

  private async send(alert: Alert) {
    logger.error('ALERT', alert);

    // PagerDuty
    if (alert.severity === 'CRITICAL') {
      await this.sendPagerDuty(alert);
    }

    // Slack
    await this.sendSlack(alert);

    // Email
    if (alert.severity === 'CRITICAL' || alert.severity === 'HIGH') {
      await this.sendEmail(alert);
    }
  }

  private async sendPagerDuty(alert: Alert) {
    try {
      await axios.post(
        'https://events.pagerduty.com/v2/enqueue',
        {
          routing_key: process.env.PAGERDUTY_API_KEY,
          event_action: 'trigger',
          payload: {
            summary: alert.title,
            severity: alert.severity.toLowerCase(),
            source: 'medication-service',
            custom_details: alert.context,
          },
        }
      );
    } catch (error) {
      logger.error('Failed to send PagerDuty alert', error);
    }
  }

  private async sendSlack(alert: Alert) {
    const channel =
      alert.severity === 'CRITICAL'
        ? process.env.ALERT_CRITICAL_CHANNEL
        : process.env.ALERT_HIGH_CHANNEL;

    try {
      await axios.post(process.env.SLACK_WEBHOOK_URL!, {
        channel,
        text: `*${alert.severity}*: ${alert.title}`,
        attachments: [
          {
            color: alert.severity === 'CRITICAL' ? 'danger' : 'warning',
            fields: Object.entries(alert.context || {}).map(([key, value]) => ({
              title: key,
              value: JSON.stringify(value),
              short: true,
            })),
          },
        ],
      });
    } catch (error) {
      logger.error('Failed to send Slack alert', error);
    }
  }

  private async sendEmail(alert: Alert) {
    // Email implementation
  }
}

export const alertService = new AlertService();
```

---

## Database Schema Updates

Run these migrations:

```sql
-- Add idempotency and sync tracking
ALTER TABLE medication_logs
ADD COLUMN idempotency_key VARCHAR(255) UNIQUE,
ADD COLUMN device_id VARCHAR(255),
ADD COLUMN sync_status VARCHAR(50) DEFAULT 'SYNCED';

CREATE INDEX idx_medication_logs_idempotency ON medication_logs(idempotency_key);
CREATE INDEX idx_medication_logs_sync_status ON medication_logs(sync_status);

-- Create safety events table
CREATE TABLE medication_safety_events (
  id VARCHAR(255) PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  context JSONB NOT NULL,
  prevented_action JSONB NOT NULL,
  student_id VARCHAR(255) NOT NULL,
  nurse_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_safety_events_type_date (event_type, created_at),
  INDEX idx_safety_events_student (student_id, created_at)
);
```

---

## Configuration Examples

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Medication Resilience",
    "panels": [
      {
        "title": "Administration Success Rate",
        "targets": [
          {
            "expr": "rate(medication_admin_success_total[5m]) / (rate(medication_admin_success_total[5m]) + rate(medication_admin_failure_total[5m]))"
          }
        ]
      },
      {
        "title": "Queue Size",
        "targets": [
          {
            "expr": "medication_queue_size"
          }
        ]
      },
      {
        "title": "Circuit Breaker States",
        "targets": [
          {
            "expr": "medication_circuit_breaker_state"
          }
        ]
      }
    ]
  }
}
```

### Prometheus Alerts

```yaml
# alerts.yml
groups:
  - name: medication_resilience
    rules:
      - alert: MedicationAdminCircuitOpen
        expr: medication_circuit_breaker_state{breaker="medication_administration"} == 1
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Medication administration circuit breaker is OPEN"

      - alert: MedicationQueueBacklog
        expr: medication_queue_size{status="pending"} > 10
        for: 5m
        labels:
          severity: high
        annotations:
          summary: "Medication queue has {{ $value }} pending records"

      - alert: DuplicateAdministrationPrevented
        expr: increase(medication_duplicate_prevented_total[5m]) > 0
        labels:
          severity: high
        annotations:
          summary: "Duplicate medication administration prevented"
```

---

## Testing the Implementation

### Test Offline Capability

```typescript
// Test script
async function testOfflineCapability() {
  // 1. Disconnect network
  console.log('Disconnecting network...');
  await disconnectNetwork();

  // 2. Attempt administration
  console.log('Attempting medication administration (offline)...');
  const result = await medicationsApi.logAdministration({
    studentMedicationId: 'med-123',
    nurseId: 'nurse-1',
    dosageGiven: '500mg',
    scheduledTime: new Date(),
  });

  console.log('Result:', result);
  expect(result.status).toBe('PENDING_SYNC');

  // 3. Check queue
  const stats = await medicationQueueService.getStats();
  console.log('Queue stats:', stats);
  expect(stats.pending).toBe(1);

  // 4. Reconnect network
  console.log('Reconnecting network...');
  await reconnectNetwork();

  // 5. Wait for sync
  await sleep(5000);

  // 6. Verify synced
  const synced = await prisma.medicationLog.findFirst({
    where: { studentMedicationId: 'med-123' },
  });
  expect(synced).toBeDefined();
  console.log('✅ Offline capability test passed');
}
```

---

## Deployment Checklist

- [ ] Database migrations applied
- [ ] Redis configured and running
- [ ] Circuit breakers initialized on server start
- [ ] Idempotency middleware added to routes
- [ ] Frontend offline queue initialized
- [ ] Monitoring dashboards configured
- [ ] Alert rules configured
- [ ] PagerDuty integration tested
- [ ] Load tests passed
- [ ] Chaos tests passed
- [ ] Safety validation tests passed
- [ ] Documentation updated
- [ ] Team training completed

---

## Troubleshooting

### Circuit Breaker Stuck Open

```typescript
// Manual reset via API
app.post('/api/admin/circuit-breaker/:name/reset', requireAdmin, async (req, res) => {
  const { name } = req.params;
  const breaker = CircuitBreakerFactory.getBreaker(name);

  if (!breaker) {
    return res.status(404).json({ error: 'Breaker not found' });
  }

  breaker.forceClose();
  logger.info(`Circuit breaker ${name} manually reset`);

  res.json({ success: true, breaker: name, state: 'CLOSED' });
});
```

### Queue Not Syncing

```typescript
// Force sync via admin panel
app.post('/api/admin/queue/force-sync', requireAdmin, async (req, res) => {
  const result = await medicationQueue.syncQueue();

  res.json({
    success: true,
    result,
  });
});
```

### DLQ Recovery

```typescript
// Review and retry DLQ items
app.get('/api/admin/dlq', requireAdmin, async (req, res) => {
  const dlqRecords = await medicationQueue.getDLQRecords();

  res.json({
    count: dlqRecords.length,
    records: dlqRecords,
  });
});

app.post('/api/admin/dlq/:id/retry', requireAdmin, async (req, res) => {
  const { id } = req.params;

  await medicationQueue.retryDLQRecord(id);

  res.json({ success: true, message: 'Record reset for retry' });
});
```

---

## Performance Tuning

### Database Connection Pool

```typescript
// Optimize Prisma connection pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error', 'warn'],
  connectionLimit: 20, // Increase for high load
});
```

### Redis Connection Pool

```typescript
// Optimize Redis for idempotency checks
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,

  // Connection pooling
  connectionName: 'medication-service',

  // Performance
  enableOfflineQueue: true,
  connectTimeout: 10000,
});
```

---

## Document Control

**Version History:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-10 | Initial implementation guide |

**Next Review:** 2026-01-10
**Owner:** Technical Lead
