# Resilience Implementation Guide
## Step-by-Step Implementation for White Cross Frontend Services

---

## File Structure for New Resilience Modules

```
frontend/src/services/
├── core/
│   ├── ApiClient.ts (existing, needs enhancement)
│   ├── BaseApiService.ts (existing)
│   ├── ApiMonitoring.ts (existing)
│   ├── CircuitBreaker.ts (NEW)
│   ├── Bulkhead.ts (NEW)
│   ├── RateLimiter.ts (NEW)
│   ├── IdempotencyManager.ts (NEW)
│   ├── HealthMonitor.ts (NEW)
│   └── index.ts (update exports)
├── resilience/
│   ├── strategies/
│   │   ├── FallbackStrategy.ts (NEW)
│   │   ├── CacheStrategy.ts (NEW)
│   │   └── OfflineQueueStrategy.ts (NEW)
│   ├── handlers/
│   │   ├── ErrorHandler.ts (NEW)
│   │   ├── TimeoutHandler.ts (NEW)
│   │   └── FailureHandler.ts (NEW)
│   └── index.ts (NEW)
└── config/
    └── resilience.config.ts (NEW - configuration)
```

---

## Implementation Step 1: Circuit Breaker

### File: `frontend/src/services/core/CircuitBreaker.ts`

**Purpose:** Prevent cascading failures by failing fast when a service is degraded

**Key Methods:**
- `execute()` - Execute operation through circuit breaker
- `getState()` - Get current state
- `reset()` - Manual reset
- `getMetrics()` - Performance metrics

**Healthcare-Specific Configuration:**

```typescript
export const CIRCUIT_BREAKER_CONFIGS = {
  HEALTH_RECORDS: {
    failureThreshold: 5,
    errorRateThreshold: 0.5,
    windowSize: 60000,
    timeoutDuration: 30000,
    name: 'health-records',
  },
  MEDICATIONS: {
    failureThreshold: 3,
    errorRateThreshold: 0.3,
    windowSize: 60000,
    timeoutDuration: 10000,
    name: 'medications',
  },
  AUTHENTICATION: {
    failureThreshold: 2,
    errorRateThreshold: 0.2,
    windowSize: 60000,
    timeoutDuration: 5000,
    name: 'authentication',
  },
  EMERGENCY_ALERTS: {
    failureThreshold: 1,
    errorRateThreshold: 0.1,
    windowSize: 30000,
    timeoutDuration: 3000,
    name: 'emergency-alerts',
  },
};
```

**Integration Point in ApiClient:**

```typescript
public async get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const breaker = this.getCircuitBreakerForEndpoint(url);
  if (!breaker) {
    return this.executeRequest<T>(url, 'GET', config);
  }

  return breaker.execute(
    () => this.executeRequest<T>(url, 'GET', config),
    () => this.getFallbackResponse<T>(url)
  );
}
```

---

## Implementation Step 2: Bulkhead Isolation

### File: `frontend/src/services/core/Bulkhead.ts`

**Purpose:** Prevent resource exhaustion by isolating requests into separate pools

**Key Methods:**
- `execute()` - Execute with bulkhead control
- `getMetrics()` - Queue depth and utilization
- `drain()` - Wait for queue to empty

**Configuration by Operation Type:**

```typescript
export const BULKHEAD_CONFIGS = {
  CRITICAL_READ: {
    maxConcurrentRequests: 8,
    queueLimit: 50,
    timeout: 15000,
    name: 'critical-read',
  },
  CRITICAL_WRITE: {
    maxConcurrentRequests: 3,
    queueLimit: 20,
    timeout: 10000,
    name: 'critical-write',
  },
  STANDARD_OPERATIONS: {
    maxConcurrentRequests: 20,
    queueLimit: 100,
    timeout: 30000,
    name: 'standard',
  },
  BULK_OPERATIONS: {
    maxConcurrentRequests: 2,
    queueLimit: 5,
    timeout: 120000,
    name: 'bulk',
  },
};
```

**Integration Strategy:**

```typescript
private determineBulkhead(endpoint: string, method: string): Bulkhead {
  // Emergency endpoints get critical-write
  if (endpoint.includes('/emergency') && method === 'POST') {
    return this.bulkheads.get('critical-write')!;
  }

  // Medication administration gets critical-write
  if (endpoint.includes('/medications') && endpoint.includes('administer')) {
    return this.bulkheads.get('critical-write')!;
  }

  // Allergies, critical alerts get critical-read
  if (endpoint.includes('/allergies') && method === 'GET') {
    return this.bulkheads.get('critical-read')!;
  }

  // Bulk imports/exports get bulk
  if (endpoint.includes('import') || endpoint.includes('export')) {
    return this.bulkheads.get('bulk-operations')!;
  }

  return this.bulkheads.get('standard-operations')!;
}
```

---

## Implementation Step 3: Request Deduplication

### File: `frontend/src/services/core/IdempotencyManager.ts`

**Purpose:** Prevent duplicate operations (critical for medications, appointments)

**Key Methods:**
- `executeIdempotent()` - Execute with deduplication
- `generateKey()` - Generate idempotency key
- `clearCache()` - Clear stored results

**Critical Operations Requiring Deduplication:**

```typescript
const IDEMPOTENT_OPERATIONS = {
  'POST:/medications/*/administer': {
    ttl: 300000,  // 5 minutes
    retryable: false,
  },
  'POST:/health-records': {
    ttl: 600000,  // 10 minutes
    retryable: false,
  },
  'POST:/appointments': {
    ttl: 300000,
    retryable: false,
  },
  'POST:/emergency-contacts/notify': {
    ttl: 60000,   // 1 minute
    retryable: false,
  },
};
```

**Usage Pattern:**

```typescript
// In HealthRecordsApi.createRecord()
async createRecord(data: HealthRecordCreate): Promise<HealthRecord> {
  const idempotencyKey = this.idempotencyManager.generateKey(
    'POST',
    '/health-records',
    { studentId: data.studentId, type: data.type }
  );

  return this.idempotencyManager.executeIdempotent(
    idempotencyKey,
    async () => {
      const response = await this.apiClient.post('/health-records', data, {
        headers: { 'Idempotency-Key': idempotencyKey }
      });
      return response.data;
    },
    { ttl: 600000 }  // Cache result for 10 minutes
  );
}
```

---

## Implementation Step 4: Operation-Specific Timeouts

### File: `frontend/src/constants/resilience.config.ts` (NEW)

**Purpose:** Replace global 30s timeout with intelligent, operation-specific timeouts

**Configuration:**

```typescript
export const OPERATION_TIMEOUTS = {
  // Emergency operations - must be quick
  EMERGENCY_ALERT_READ: 3000,        // 3s - user waiting
  EMERGENCY_ALERT_SEND: 5000,        // 5s - critical action

  // Medication operations - time-sensitive
  MEDICATION_CHECK_ALLERGY: 5000,     // 5s - safety critical
  MEDICATION_ADMINISTER: 8000,        // 8s - immediate feedback
  MEDICATION_INVENTORY: 10000,        // 10s - operational

  // Health record operations - important but not urgent
  HEALTH_RECORD_READ: 15000,          // 15s - retrieval
  HEALTH_RECORD_CREATE: 20000,        // 20s - more data
  HEALTH_RECORD_UPDATE: 20000,        // 20s - more data
  HEALTH_RECORD_DELETE: 15000,        // 15s - quick operation

  // Authentication - must be fast
  AUTH_LOGIN: 10000,                  // 10s - first interaction
  AUTH_TOKEN_REFRESH: 8000,           // 8s - must not block UI
  AUTH_LOGOUT: 5000,                  // 5s - can continue if fails

  // File operations - can take longer
  FILE_UPLOAD: 120000,                // 2 minutes - large files
  FILE_DOWNLOAD: 90000,               // 90s - expect large
  FILE_EXPORT: 120000,                // 2 minutes - report generation

  // Bulk operations - can take longer
  BULK_IMPORT: 120000,                // 2 minutes - batch operation
  BULK_UPDATE: 90000,                 // 90s - multiple records
  BULK_DELETE: 60000,                 // 1 minute - many items

  // Reporting/Analytics
  REPORT_GENERATE: 60000,             // 1 minute - server processing
  STATISTICS_QUERY: 45000,            // 45s - complex aggregation
  DASHBOARD_LOAD: 30000,              // 30s - multiple endpoints

  // General operations
  DEFAULT: 30000,                     // 30s - fallback
};

export const getTimeoutForOperation = (
  method: string,
  endpoint: string
): number => {
  // Match endpoint to timeout category
  if (endpoint.includes('/emergency') && endpoint.includes('alerts')) {
    return method === 'GET'
      ? OPERATION_TIMEOUTS.EMERGENCY_ALERT_READ
      : OPERATION_TIMEOUTS.EMERGENCY_ALERT_SEND;
  }

  if (endpoint.includes('/medications')) {
    if (endpoint.includes('allergies')) {
      return OPERATION_TIMEOUTS.MEDICATION_CHECK_ALLERGY;
    }
    if (endpoint.includes('administer')) {
      return OPERATION_TIMEOUTS.MEDICATION_ADMINISTER;
    }
    return OPERATION_TIMEOUTS.MEDICATION_INVENTORY;
  }

  // ... more patterns ...

  return OPERATION_TIMEOUTS.DEFAULT;
};
```

**Integration into ApiClient:**

```typescript
public async get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const timeout = getTimeoutForOperation('GET', url);

  return this.instance.get<ApiResponse<T>>(url, {
    ...config,
    timeout,
  });
}
```

---

## Implementation Step 5: Health Monitoring

### File: `frontend/src/services/core/HealthMonitor.ts` (NEW)

**Purpose:** Proactively detect service degradation before circuit breaker triggers

**Key Methods:**
- `checkHealth()` - Check single endpoint
- `checkAllDependencies()` - Full health check
- `startPeriodicChecks()` - Background monitoring
- `getServiceStatus()` - Get current status

**Implementation:**

```typescript
interface ServiceHealth {
  serviceName: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  errorCount: number;
  errorRatePercent: number;
  consecutiveFailures: number;
  uptime: number;
}

export class HealthMonitor {
  private healthCache = new Map<string, ServiceHealth>();
  private checkIntervals = new Map<string, NodeJS.Timeout>();

  async checkHealth(endpoint: string, timeout = 5000): Promise<ServiceHealth> {
    const startTime = Date.now();

    try {
      await this.apiClient.get(endpoint, { timeout });

      return {
        serviceName: endpoint,
        status: 'healthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        errorCount: 0,
        errorRatePercent: 0,
        consecutiveFailures: 0,
        uptime: 100,
      };
    } catch (error) {
      const previousHealth = this.healthCache.get(endpoint);

      return {
        serviceName: endpoint,
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        errorCount: (previousHealth?.errorCount || 0) + 1,
        errorRatePercent: this.calculateErrorRate(endpoint),
        consecutiveFailures: (previousHealth?.consecutiveFailures || 0) + 1,
        uptime: this.calculateUptime(endpoint),
      };
    }
  }

  startPeriodicChecks(config: {
    interval: number;
    endpoints: Array<{ path: string; criticalityLevel: 'critical' | 'high' | 'medium' }>;
  }): void {
    config.endpoints.forEach(({ path, criticalityLevel }) => {
      const checkInterval = criticalityLevel === 'critical'
        ? config.interval
        : config.interval * 2;

      const timeout = setInterval(async () => {
        const health = await this.checkHealth(path);
        this.healthCache.set(path, health);

        // Alert if degraded
        if (health.status === 'degraded' || health.status === 'unhealthy') {
          this.alertServiceDegradation(health, criticalityLevel);
        }
      }, checkInterval);

      this.checkIntervals.set(path, timeout);
    });
  }

  private alertServiceDegradation(
    health: ServiceHealth,
    level: string
  ): void {
    // Emit event for UI to show warning
    window.dispatchEvent(new CustomEvent('service-health-degraded', {
      detail: { health, level }
    }));
  }
}
```

**Health Check Endpoints:**

```typescript
const HEALTH_CHECK_CONFIG = {
  interval: 30000,  // Check every 30 seconds
  endpoints: [
    {
      path: '/health',
      criticalityLevel: 'critical' as const,
    },
    {
      path: '/health-records/health',
      criticalityLevel: 'critical' as const,
    },
    {
      path: '/medications/health',
      criticalityLevel: 'critical' as const,
    },
    {
      path: '/auth/health',
      criticalityLevel: 'critical' as const,
    },
    {
      path: '/appointments/health',
      criticalityLevel: 'high' as const,
    },
  ],
};
```

---

## Implementation Step 6: Frontend Rate Limiting

### File: `frontend/src/services/core/RateLimiter.ts` (NEW)

**Purpose:** Enforce frontend rate limiting to prevent backend overload

**Key Methods:**
- `acquire()` - Request token
- `tryAcquire()` - Non-blocking attempt
- `reset()` - Reset bucket

**Implementation:**

```typescript
export class TokenBucket {
  private tokens: number;
  private lastRefillTime: number = Date.now();

  constructor(
    private capacity: number,
    private refillRate: number  // tokens per second
  ) {
    this.tokens = capacity;
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = (now - this.lastRefillTime) / 1000;
    const tokensToAdd = timePassed * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  async acquire(count: number = 1): Promise<boolean> {
    this.refill();

    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }

    // Wait for tokens
    const timeToWait = ((count - this.tokens) / this.refillRate) * 1000;
    await new Promise(resolve => setTimeout(resolve, timeToWait));

    this.refill();
    this.tokens -= count;
    return true;
  }

  tryAcquire(count: number = 1): boolean {
    this.refill();

    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }

    return false;
  }
}

export class RateLimiter {
  private buckets = new Map<string, TokenBucket>();

  constructor(private defaultLimit: number = 60) {}  // 60 req/min by default

  async checkLimit(endpoint: string): Promise<boolean> {
    // Per-endpoint rate limiting
    const key = this.getEndpointKey(endpoint);
    let bucket = this.buckets.get(key);

    if (!bucket) {
      // 60 requests per minute = 1 per second
      bucket = new TokenBucket(this.defaultLimit, this.defaultLimit / 60);
      this.buckets.set(key, bucket);
    }

    return bucket.tryAcquire(1);
  }

  private getEndpointKey(endpoint: string): string {
    // Extract resource type, not full URL
    const match = endpoint.match(/\/api\/([^/]+)/);
    return match ? match[1] : 'default';
  }
}
```

**Integration into ApiClient:**

```typescript
private async performRequest<T>(
  url: string,
  method: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  // Check rate limit first
  if (!await this.rateLimiter.checkLimit(url)) {
    throw new RateLimitError('Frontend rate limit exceeded');
  }

  return this.instance[method.toLowerCase()]<T>(url, config);
}
```

---

## Implementation Step 7: Error Handling Enhancement

### File: `frontend/src/services/resilience/handlers/ErrorHandler.ts` (NEW)

**Purpose:** Classify errors and apply appropriate recovery strategies

**Implementation:**

```typescript
export enum ErrorCategory {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  CIRCUIT_BREAKER_OPEN = 'CIRCUIT_BREAKER_OPEN',
  BULKHEAD_REJECTION = 'BULKHEAD_REJECTION',
}

export interface ClassifiedError {
  category: ErrorCategory;
  message: string;
  statusCode?: number;
  retryable: boolean;
  retryAfter?: number;
  fallbackAvailable: boolean;
  userMessage: string;
  loggable: boolean;
  context: Record<string, any>;
}

export class ErrorHandler {
  classify(error: any): ClassifiedError {
    if (error instanceof TimeoutError) {
      return {
        category: ErrorCategory.TIMEOUT_ERROR,
        message: error.message,
        retryable: true,
        retryAfter: 2000,
        fallbackAvailable: true,
        userMessage: 'Request took too long. Please try again.',
        loggable: true,
        context: { endpoint: error.endpoint },
      };
    }

    if (!error.response) {
      return {
        category: ErrorCategory.NETWORK_ERROR,
        message: error.message,
        retryable: true,
        retryAfter: 3000,
        fallbackAvailable: true,
        userMessage: 'Network connection error. Please check your connection.',
        loggable: true,
        context: { error: error.message },
      };
    }

    const status = error.response.status;

    if (status === 401) {
      return {
        category: ErrorCategory.AUTHENTICATION_ERROR,
        message: 'Authentication failed',
        statusCode: status,
        retryable: true,
        retryAfter: 1000,
        fallbackAvailable: false,
        userMessage: 'Your session has expired. Please login again.',
        loggable: true,
        context: {},
      };
    }

    if (status === 429) {
      return {
        category: ErrorCategory.RATE_LIMIT_ERROR,
        message: 'Too many requests',
        statusCode: status,
        retryable: true,
        retryAfter: 10000,  // 10 seconds
        fallbackAvailable: true,
        userMessage: 'Too many requests. Please wait a moment.',
        loggable: true,
        context: { retryAfter: error.response.headers['retry-after'] },
      };
    }

    if (status >= 500) {
      return {
        category: ErrorCategory.SERVER_ERROR,
        message: 'Server error',
        statusCode: status,
        retryable: true,
        retryAfter: 5000,
        fallbackAvailable: true,
        userMessage: 'Server is temporarily unavailable. Retrying...',
        loggable: true,
        context: { status },
      };
    }

    if (status >= 400 && status < 500) {
      if (status === 422) {
        return {
          category: ErrorCategory.VALIDATION_ERROR,
          message: 'Validation failed',
          statusCode: status,
          retryable: false,
          fallbackAvailable: false,
          userMessage: error.response.data?.message || 'Invalid input.',
          loggable: true,
          context: { errors: error.response.data?.errors },
        };
      }

      return {
        category: ErrorCategory.CLIENT_ERROR,
        message: 'Client error',
        statusCode: status,
        retryable: false,
        fallbackAvailable: false,
        userMessage: 'An error occurred. Please try again.',
        loggable: true,
        context: { status },
      };
    }

    return {
      category: ErrorCategory.SERVER_ERROR,
      message: 'Unknown error',
      retryable: true,
      retryAfter: 5000,
      fallbackAvailable: true,
      userMessage: 'An error occurred. Please try again.',
      loggable: true,
      context: { error: error.message },
    };
  }

  shouldCache(error: ClassifiedError): boolean {
    return [
      ErrorCategory.NETWORK_ERROR,
      ErrorCategory.SERVER_ERROR,
      ErrorCategory.TIMEOUT_ERROR,
      ErrorCategory.RATE_LIMIT_ERROR,
      ErrorCategory.CIRCUIT_BREAKER_OPEN,
    ].includes(error.category);
  }

  canUseFallback(error: ClassifiedError): boolean {
    return error.fallbackAvailable;
  }
}
```

---

## Implementation Step 8: Offline Queue & Sync Strategy

### File: `frontend/src/services/resilience/strategies/OfflineQueueStrategy.ts` (NEW)

**Purpose:** Queue operations when offline and sync when connection recovers

**Key Methods:**
- `enqueueOperation()` - Add to offline queue
- `dequeueAndSync()` - Sync when connection recovers
- `getQueueStatus()` - Get queue stats

**Implementation:**

```typescript
export interface QueuedOperation {
  id: string;
  method: string;
  endpoint: string;
  data?: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  idempotencyKey?: string;
}

export class OfflineQueueStrategy {
  private queue: QueuedOperation[] = [];
  private db: IDBDatabase | null = null;
  private isSyncing = false;

  async initialize(): Promise<void> {
    // Initialize IndexedDB for persistent queue
    const request = indexedDB.open('white-cross-offline-queue', 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('operations')) {
        db.createObjectStore('operations', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      this.loadQueueFromDB();
    };
  }

  async enqueueOperation(operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const queued: QueuedOperation = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retryCount: 0,
      ...operation,
    };

    this.queue.push(queued);

    // Persist to IndexedDB
    if (this.db) {
      const tx = this.db.transaction(['operations'], 'readwrite');
      tx.objectStore('operations').add(queued);
    }
  }

  async dequeueAndSync(): Promise<{
    successful: number;
    failed: number;
    queued: number;
  }> {
    if (this.isSyncing || this.queue.length === 0) {
      return { successful: 0, failed: 0, queued: this.queue.length };
    }

    this.isSyncing = true;
    let successful = 0;
    let failed = 0;

    for (const operation of [...this.queue]) {
      try {
        await this.executeQueuedOperation(operation);
        successful++;
        this.removeFromQueue(operation.id);
      } catch (error) {
        operation.retryCount++;

        if (operation.retryCount > operation.maxRetries) {
          failed++;
          this.removeFromQueue(operation.id);
          // Notify user of permanent failure
          this.notifyPermanentFailure(operation);
        }
      }
    }

    this.isSyncing = false;

    return {
      successful,
      failed,
      queued: this.queue.length,
    };
  }

  private async executeQueuedOperation(operation: QueuedOperation): Promise<void> {
    const headers: Record<string, string> = {};

    if (operation.idempotencyKey) {
      headers['Idempotency-Key'] = operation.idempotencyKey;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${operation.endpoint}`, {
      method: operation.method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: operation.data ? JSON.stringify(operation.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  }

  private removeFromQueue(id: string): void {
    this.queue = this.queue.filter(op => op.id !== id);

    if (this.db) {
      const tx = this.db.transaction(['operations'], 'readwrite');
      tx.objectStore('operations').delete(id);
    }
  }

  private async loadQueueFromDB(): Promise<void> {
    if (!this.db) return;

    const tx = this.db.transaction(['operations'], 'readonly');
    const store = tx.objectStore('operations');
    const request = store.getAll();

    request.onsuccess = () => {
      this.queue = request.result || [];
    };
  }

  private notifyPermanentFailure(operation: QueuedOperation): void {
    window.dispatchEvent(new CustomEvent('offline-operation-failed', {
      detail: {
        operation,
        message: `Operation failed after ${operation.retryCount} retries. Please manually reconcile.`,
      }
    }));
  }

  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      isSyncing: this.isSyncing,
      operations: this.queue.map(op => ({
        id: op.id,
        method: op.method,
        endpoint: op.endpoint,
        retryCount: op.retryCount,
      })),
    };
  }
}
```

---

## Integration Checklist

### Phase 1: Foundation (Week 1)
- [ ] Create CircuitBreaker class
- [ ] Create Bulkhead class
- [ ] Add circuit breaker to ApiClient
- [ ] Add bulkhead to ApiClient
- [ ] Create resilience config
- [ ] Update ApiClient timeout logic

### Phase 2: Intelligence (Week 2)
- [ ] Create HealthMonitor class
- [ ] Create IdempotencyManager class
- [ ] Create RateLimiter class
- [ ] Integrate health monitoring into ApiClient
- [ ] Integrate deduplication for critical operations

### Phase 3: Recovery (Week 3)
- [ ] Create ErrorHandler class
- [ ] Create OfflineQueueStrategy class
- [ ] Integrate error handling
- [ ] Implement offline queue for critical operations

### Phase 4: Testing (Week 4)
- [ ] Unit tests for each component
- [ ] Integration tests
- [ ] Chaos engineering tests
- [ ] Load testing with failures

---

## Environment Configuration

### `.env.development`
```bash
VITE_RESILIENCE_ENABLED=true
VITE_CIRCUIT_BREAKER_ENABLED=true
VITE_BULKHEAD_ENABLED=true
VITE_HEALTH_CHECK_INTERVAL=30000
VITE_ENABLE_OFFLINE_QUEUE=true
```

### Feature Flags
```typescript
// Use environment-based feature flags
const FEATURES = {
  CIRCUIT_BREAKER: import.meta.env.VITE_CIRCUIT_BREAKER_ENABLED === 'true',
  BULKHEAD: import.meta.env.VITE_BULKHEAD_ENABLED === 'true',
  HEALTH_MONITORING: import.meta.env.VITE_HEALTH_CHECK_ENABLED === 'true',
  OFFLINE_QUEUE: import.meta.env.VITE_ENABLE_OFFLINE_QUEUE === 'true',
};
```

---

## Monitoring Dashboard Components

Recommended dashboard to display resilience metrics:

```typescript
// Component: ResilienceMonitor.tsx
<div>
  <CircuitBreakerStatus breakers={circuitBreakers} />
  <BulkheadStatus bulkheads={bulkheads} />
  <ServiceHealthStatus services={healthStatus} />
  <OfflineQueueStatus queue={offlineQueue} />
  <ErrorRateChart errors={errorMetrics} />
  <LatencyChart latencies={latencyMetrics} />
</div>
```

---

## Success Criteria

After implementing all phases:

1. Circuit breakers prevent >80% of cascading failures
2. Bulkheads maintain 99%+ uptime for critical operations
3. Medication administration never times out (8s SLA maintained)
4. Emergency alerts respond within 3s SLA 99% of time
5. System gracefully degrades (shows cached data vs errors)
6. Offline operations queue and sync successfully
7. No duplicate operations reach backend
8. Error rate stabilizes around 2% (within expected range)
9. Mean time to recovery (MTTR) < 2 minutes
10. System stays responsive even when backend is 50% degraded

---

## References

- Circuit Breaker Pattern: https://martinfowler.com/bliki/CircuitBreaker.html
- Bulkhead Pattern: https://martinfowler.com/bliki/Bulkhead.html
- Token Bucket Algorithm: https://en.wikipedia.org/wiki/Token_bucket
- Idempotency: https://developer.mozilla.org/en-US/docs/Glossary/idempotent
- HIPAA Compliance for Healthcare Apps: https://www.hhs.gov/hipaa/
