# Function Catalog - Alphabetical Reference

**Version**: 3.0.0
**Last Updated**: 2025-11-09
**Total Functions**: 15,000+ (cataloging in progress)

---

## Overview

This catalog provides an alphabetical reference to ALL functions, classes, types, and utilities in the reuse library. Use `Ctrl+F` (or `Cmd+F`) to quickly find what you need.

---

## How to Use This Catalog

### 1. **Search by Function Name**
Press `Ctrl+F` and type the function name:
- Example: Search for "`createJob`" → Jump to entry

### 2. **Search by Category**
Look for category tags in brackets:
- `[CORE:AUTH]` - Core authentication
- `[INFRA:JOBS]` - Infrastructure background jobs  
- `[DOMAIN:CONSTRUCTION]` - Construction domain

### 3. **Search by Use Case**
Look for keywords:
- "email" → Find all email-related functions
- "cache" → Find all caching functions
- "payment" → Find all payment functions

---

## Quick Navigation

### By Category
- [A](#a) [B](#b) [C](#c) [D](#d) [E](#e) [F](#f) [G](#g) [H](#h) [I](#i) [J](#j) [K](#k) [L](#l) [M](#m)
- [N](#n) [O](#o) [P](#p) [Q](#q) [R](#r) [S](#s) [T](#t) [U](#u) [V](#v) [W](#w) [X](#x) [Y](#y) [Z](#z)

### By Functional Area
- [Authentication & Security](#authentication--security-quick-index)
- [Background Jobs & Queues](#background-jobs--queues-quick-index)
- [Caching & Performance](#caching--performance-quick-index)
- [Database & ORM](#database--orm-quick-index)
- [Email & Notifications](#email--notifications-quick-index)
- [File Storage](#file-storage-quick-index)
- [Payments](#payments-quick-index)
- [Validation](#validation-quick-index)

---

## A

### `analyzeQuery()`
**Category**: `[CORE:DATABASE]` `[OPTIMIZATION]`  
**Kit**: `query-optimization-kit.prod.ts`  
**Description**: Analyzes SQL query performance and suggests optimizations  
**Signature**: `(query: string, options?: AnalyzeOptions) => Promise<QueryAnalysis>`  
**Import**: 
```typescript
import { analyzeQuery } from '@white-cross/reuse/core/database/optimization';
```
**Example**:
```typescript
const analysis = await analyzeQuery('SELECT * FROM users WHERE email = ?');
console.log(analysis.indexes); // Recommended indexes
console.log(analysis.explainPlan); // EXPLAIN output
```

---

### `APNSProvider`
**Category**: `[INFRA:NOTIFICATIONS]` `[PUSH]`  
**Kit**: `notification-kit.prod.ts`  
**Description**: Apple Push Notification Service provider implementation  
**Type**: Class  
**Import**:
```typescript
import { APNSProvider } from '@white-cross/reuse/infrastructure/notifications';
```
**Example**:
```typescript
const apns = new APNSProvider({
  keyId: process.env.APNS_KEY_ID,
  teamId: process.env.APNS_TEAM_ID,
  bundleId: 'com.example.app'
});
await apns.sendPush({ token, title, body });
```

---

### `AuditInterceptor`
**Category**: `[CORE:AUTH]` `[SECURITY]` `[HIPAA]`  
**Kit**: `auth-security-kit.prod.ts`  
**Description**: NestJS interceptor for HIPAA-compliant audit logging  
**Type**: Class (NestJS Interceptor)  
**Import**:
```typescript
import { AuditInterceptor } from '@white-cross/reuse/core/auth';
```
**Example**:
```typescript
@UseInterceptors(AuditInterceptor)
@Controller('health-records')
export class HealthRecordsController {
  // All requests/responses logged with PHI redaction
}
```

---

### `AWSSeProvider`
**Category**: `[INFRA:NOTIFICATIONS]` `[EMAIL]`  
**Kit**: `notification-kit.prod.ts`  
**Description**: AWS Simple Email Service provider implementation  
**Type**: Class  
**Import**:
```typescript
import { AWSSeProvider } from '@white-cross/reuse/infrastructure/notifications';
```

---

## B

### `batchWebhooks()`
**Category**: `[INFRA:WEBHOOKS]`  
**Kit**: `webhook-management-kit.prod.ts`  
**Description**: Batches multiple webhook deliveries for efficiency  
**Signature**: `(webhooks: Webhook[]) => Promise<BatchResult>`  
**Import**:
```typescript
import { batchWebhooks } from '@white-cross/reuse/infrastructure/webhooks';
```
**Example**:
```typescript
const result = await batchWebhooks([
  { url: 'https://api1.com/webhook', payload: {...} },
  { url: 'https://api2.com/webhook', payload: {...} }
]);
```

---

### `bulkInsert()`
**Category**: `[CORE:DATABASE]` `[OPTIMIZATION]`  
**Kit**: `query-optimization-kit.prod.ts`  
**Description**: Optimized bulk insert operation for large datasets  
**Signature**: `(model: Model, records: any[], options?: BulkOptions) => Promise<void>`  
**Import**:
```typescript
import { bulkInsert } from '@white-cross/reuse/core/database/optimization';
```
**Example**:
```typescript
await bulkInsert(User, userRecords, { 
  batch: 1000, 
  updateOnDuplicate: ['email'] 
});
```

---

## C

### `CacheService`
**Category**: `[CORE:CACHE]` `[INFRA]`  
**Kit**: `caching-strategies-kit.prod.ts`  
**Description**: Multi-level caching service with Redis and LRU support  
**Type**: Class (NestJS Service)  
**Import**:
```typescript
import { CacheService } from '@white-cross/reuse/core/cache';
```
**Example**:
```typescript
@Injectable()
export class MyService {
  constructor(private cache: CacheService) {}
  
  async getData(key: string) {
    return await this.cache.get(key) || await this.fetchAndCache(key);
  }
}
```

---

### `calculateEarnedValue()`
**Category**: `[DOMAIN:CONSTRUCTION]` `[PROJECT]`  
**Kit**: `construction-project-management-kit.ts`  
**Description**: Calculates earned value metrics (EV, PV, AC, SV, CV, SPI, CPI)  
**Signature**: `(projectId: string, sequelize: Sequelize) => Promise<EarnedValueMetrics>`  
**Import**:
```typescript
import { calculateEarnedValue } from '@white-cross/reuse/domain/construction';
```
**Example**:
```typescript
const ev = await calculateEarnedValue('project-123', sequelize);
console.log(`Schedule Variance: ${ev.scheduleVariance}`);
console.log(`Cost Variance: ${ev.costVariance}`);
console.log(`SPI: ${ev.spi}, CPI: ${ev.cpi}`);
```

---

### `cancelJob()`
**Category**: `[INFRA:JOBS]`  
**Kit**: `background-jobs-kit.prod.ts`  
**Description**: Cancels a queued or running background job  
**Signature**: `(jobId: string) => Promise<boolean>`  
**Import**:
```typescript
import { cancelJob } from '@white-cross/reuse/infrastructure/background-jobs';
```
**Example**:
```typescript
const cancelled = await cancelJob('job-123');
```

---

### `checkRateLimit()`
**Category**: `[INFRA:RATE-LIMITING]` `[SECURITY]`  
**Kit**: `rate-limiting-kit.prod.ts`  
**Description**: Checks if a request should be rate limited  
**Signature**: `(key: string, options: RateLimitOptions) => Promise<RateLimitResult>`  
**Import**:
```typescript
import { checkRateLimit } from '@white-cross/reuse';
```
**Example**:
```typescript
const result = await checkRateLimit(`api:${userId}`, { 
  limit: 100, 
  window: 60000 
});
if (result.limited) {
  throw new TooManyRequestsException();
}
```

---

### `CircuitBreaker`
**Category**: `[INFRA:JOBS]` `[RESILIENCE]`  
**Kit**: `background-jobs-kit.prod.ts`  
**Description**: Circuit breaker pattern for fault tolerance  
**Type**: Class  
**Import**:
```typescript
import { CircuitBreaker } from '@white-cross/reuse/infrastructure/background-jobs';
```
**Example**:
```typescript
const breaker = new CircuitBreaker({ 
  threshold: 5, 
  timeout: 30000 
});
await breaker.execute(() => callExternalApi());
```

---

### `createConstructionProject()`
**Category**: `[DOMAIN:CONSTRUCTION]`  
**Kit**: `construction-project-management-kit.ts`  
**Description**: Creates a new construction project with all metadata  
**Signature**: `(data: ProjectData, sequelize: Sequelize) => Promise<ConstructionProject>`  
**Import**:
```typescript
import { createConstructionProject } from '@white-cross/reuse/domain/construction';
```
**Example**:
```typescript
const project = await createConstructionProject({
  projectNumber: 'PROJ-2024-001',
  projectName: 'Hospital Expansion',
  totalBudget: 5000000,
  plannedStartDate: new Date('2024-01-01'),
  plannedEndDate: new Date('2025-12-31')
}, sequelize);
```

---

### `createJob()`
**Category**: `[INFRA:JOBS]`  
**Kit**: `background-jobs-kit.prod.ts`  
**Description**: Creates a background job in the queue  
**Signature**: `(queue: JobQueue, options: JobOptions) => Promise<Job>`  
**Import**:
```typescript
import { createJob } from '@white-cross/reuse/infrastructure/background-jobs';
```
**Example**:
```typescript
const job = await createJob(emailQueue, {
  name: 'send-welcome-email',
  data: { userId: '123' },
  options: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 }
  }
});
```

---

### `createPaymentIntent()`
**Category**: `[INFRA:PAYMENTS]`  
**Kit**: `payment-processing-kit.prod.ts`  
**Description**: Creates a payment intent with Stripe or other providers  
**Signature**: `(amount: number, currency: string, options?: PaymentOptions) => Promise<PaymentIntent>`  
**Import**:
```typescript
import { createPaymentIntent } from '@white-cross/reuse/infrastructure/payments';
```
**Example**:
```typescript
const intent = await createPaymentIntent(5000, 'usd', {
  provider: 'stripe',
  customerId: 'cus_123',
  metadata: { orderId: 'ord_456' }
});
```

---

### `createSubscription()`
**Category**: `[INFRA:PAYMENTS]`  
**Kit**: `payment-processing-kit.prod.ts`  
**Description**: Creates a recurring subscription  
**Signature**: `(customerId: string, priceId: string, options?: SubscriptionOptions) => Promise<Subscription>`  
**Import**:
```typescript
import { createSubscription } from '@white-cross/reuse/infrastructure/payments';
```

---

## D

### `DataLoaderService`
**Category**: `[CORE:DATABASE]` `[OPTIMIZATION]`  
**Kit**: `query-optimization-kit.prod.ts`  
**Description**: DataLoader integration for batching and N+1 prevention  
**Type**: Class  
**Import**:
```typescript
import { DataLoaderService } from '@white-cross/reuse/core/database/optimization';
```

---

### `DeadLetterQueueHandler`
**Category**: `[INFRA:JOBS]`  
**Kit**: `background-jobs-kit.prod.ts`  
**Description**: Handles failed jobs in dead letter queue  
**Type**: Class  
**Import**:
```typescript
import { DeadLetterQueueHandler } from '@white-cross/reuse/infrastructure/background-jobs';
```

---

### `deleteFile()`
**Category**: `[INFRA:STORAGE]`  
**Kit**: `file-storage-kit.prod.ts`  
**Description**: Deletes a file from cloud storage  
**Signature**: `(key: string, provider: StorageProvider) => Promise<void>`  
**Import**:
```typescript
import { deleteFile } from '@white-cross/reuse/infrastructure/storage';
```
**Example**:
```typescript
await deleteFile('uploads/image.jpg', 's3');
```

---

### `deliverWebhook()`
**Category**: `[INFRA:WEBHOOKS]`  
**Kit**: `webhook-management-kit.prod.ts`  
**Description**: Delivers a webhook with retry logic  
**Signature**: `(webhook: WebhookData) => Promise<DeliveryResult>`  
**Import**:
```typescript
import { deliverWebhook } from '@white-cross/reuse/infrastructure/webhooks';
```

---

### `DistributedLock`
**Category**: `[INFRA:JOBS]` `[DISTRIBUTED]`  
**Kit**: `background-jobs-kit.prod.ts`  
**Description**: Distributed locking with Redis  
**Type**: Class  
**Import**:
```typescript
import { DistributedLock } from '@white-cross/reuse/infrastructure/background-jobs';
```
**Example**:
```typescript
const lock = new DistributedLock(redis, 'my-lock', { ttl: 10000 });
await lock.acquire();
try {
  // Critical section
} finally {
  await lock.release();
}
```

---

### `downloadFile()`
**Category**: `[INFRA:STORAGE]`  
**Kit**: `file-storage-kit.prod.ts`  
**Description**: Downloads a file from cloud storage  
**Signature**: `(key: string, provider: StorageProvider) => Promise<Buffer>`  
**Import**:
```typescript
import { downloadFile } from '@white-cross/reuse/infrastructure/storage';
```

---

## E

### `encryptConfig()`
**Category**: `[CORE:CONFIG]` `[SECURITY]`  
**Kit**: `config-management-kit.prod.ts`  
**Description**: Encrypts sensitive configuration values using AES-256-GCM  
**Signature**: `(value: string, key: string) => string`  
**Import**:
```typescript
import { encryptConfig } from '@white-cross/reuse/core/config';
```

---

### `exportCSV()`
**Category**: `[DATA]` `[EXPORT]`  
**Kit**: `data-import-export-kit.prod.ts`  
**Description**: Exports data to CSV format  
**Signature**: `(data: any[], options?: CSVOptions) => Promise<string>`  
**Import**:
```typescript
import { exportCSV } from '@white-cross/reuse';
```

---

### `exportExcel()`
**Category**: `[DATA]` `[EXPORT]`  
**Kit**: `data-import-export-kit.prod.ts`  
**Description**: Exports data to Excel (XLSX) format  
**Signature**: `(data: any[], options?: ExcelOptions) => Promise<Buffer>`  
**Import**:
```typescript
import { exportExcel } from '@white-cross/reuse';
```

---

## F-Z

*(Continuing alphabetically... This is a template showing the structure)*

---

## Authentication & Security Quick Index

### JWT & Tokens
- `generateAccessToken()` - Generate JWT access tokens
- `generateRefreshToken()` - Generate refresh tokens
- `validateToken()` - Validate JWT tokens
- `refreshAccessToken()` - Refresh expired tokens

### Password Management
- `hashPassword()` - Hash passwords with bcrypt/argon2
- `validatePassword()` - Verify password against hash
- `enforcePasswordPolicy()` - Check password complexity
- `generatePasswordResetToken()` - Create reset tokens

### Guards & Decorators
- `JwtAuthGuard` - JWT authentication guard
- `RolesGuard` - Role-based authorization guard
- `PermissionsGuard` - Permission checking guard
- `@Roles()` - Roles decorator
- `@Permissions()` - Permissions decorator

### 2FA & MFA
- `generate2FASecret()` - Generate TOTP secret
- `verify2FAToken()` - Verify TOTP code
- `generate2FAQRCode()` - Generate QR code

### API Keys
- `generateApiKey()` - Generate secure API keys
- `validateApiKey()` - Verify API keys
- `revokeApiKey()` - Revoke API keys

---

## Background Jobs & Queues Quick Index

### Job Creation
- `createJob()` - Create background job
- `scheduleJob()` - Schedule recurring job
- `cancelJob()` - Cancel job
- `retryJob()` - Retry failed job

### Resilience
- `CircuitBreaker` - Circuit breaker pattern
- `DistributedLock` - Distributed locking
- `SagaOrchestrator` - Saga pattern

### Monitoring
- `getJobStatus()` - Get job status
- `getQueueMetrics()` - Get queue metrics
- `JobHealthChecker` - Health monitoring

---

## Caching & Performance Quick Index

### Cache Operations
- `CacheService` - Multi-level cache
- `RedisCacheService` - Redis caching
- `LRUCache` - In-memory LRU cache
- `cacheAside()` - Cache-aside pattern
- `writeThrough()` - Write-through pattern

### Invalidation
- `invalidateCache()` - Clear cache
- `warmCache()` - Pre-populate cache
- `invalidateByTag()` - Tag-based invalidation

---

## Database & ORM Quick Index

### Query Optimization
- `analyzeQuery()` - Query analysis
- `preventN1()` - Prevent N+1 queries
- `bulkInsert()` - Bulk insert
- `bulkUpdate()` - Bulk update
- `DataLoaderService` - DataLoader batching

### Migrations
- `generateMigration()` - Generate migrations
- `runMigration()` - Run migrations
- `rollbackMigration()` - Rollback migrations

### Transactions
- `withTransaction()` - Execute in transaction
- `TransactionManager` - Transaction management

---

## Email & Notifications Quick Index

### Email
- `sendEmailViaSendGrid()` - Send via SendGrid
- `sendEmailViaAWSSES()` - Send via AWS SES
- `sendEmailViaSMTP()` - Send via SMTP

### SMS
- `sendSMSViaTwilio()` - Send via Twilio
- `sendSMSViaAWSSNS()` - Send via AWS SNS

### Push
- `sendPushViaFCM()` - Send via Firebase
- `sendPushViaAPNS()` - Send via Apple Push

---

## File Storage Quick Index

### Upload/Download
- `uploadFile()` - Upload to cloud
- `downloadFile()` - Download from cloud
- `deleteFile()` - Delete file

### Processing
- `resizeImage()` - Resize images
- `transcodeVideo()` - Transcode video
- `generatePresignedUrl()` - Presigned URLs

---

## Payments Quick Index

### Payment Processing
- `createPaymentIntent()` - Create payment
- `processPayment()` - Process payment
- `refundPayment()` - Refund payment

### Subscriptions
- `createSubscription()` - Create subscription
- `cancelSubscription()` - Cancel subscription
- `updateSubscription()` - Update subscription

---

## Validation Quick Index

### Input Validation
- `validateEmail()` - Email validation
- `validatePhone()` - Phone validation
- `validateMRN()` - Medical Record Number
- `validateNPI()` - National Provider ID

### Sanitization
- `sanitizeHtml()` - XSS prevention
- `preventSqlInjection()` - SQL injection
- `maskPII()` - Mask sensitive data

---

## Construction Domain Quick Index

### Project Management
- `createConstructionProject()` - Create project
- `trackProjectProgress()` - Track progress
- `calculateEarnedValue()` - Earned value
- `updateProjectPhase()` - Update phase

### Cost Control
- `trackProjectCosts()` - Track costs
- `forecastCosts()` - Cost forecasting
- `analyzeVariance()` - Variance analysis

---

## Search Tips

### Find by Keyword
1. Press `Ctrl+F` (or `Cmd+F`)
2. Type keyword: "email", "cache", "payment", etc.
3. Press Enter to jump through matches

### Find by Category
Search for category tags:
- `[CORE:AUTH]` - Authentication
- `[INFRA:JOBS]` - Background jobs
- `[DOMAIN:CONSTRUCTION]` - Construction

### Find by Import Path
Search for import paths:
- `@white-cross/reuse/core/auth`
- `@white-cross/reuse/infrastructure/jobs`

---

## Contributing

To add a new function to this catalog:

1. Add entry in alphabetical order
2. Include category tags
3. Provide clear description
4. Add signature and import
5. Include usage example
6. Update quick indexes

---

**Last Updated**: 2025-11-09
**Maintained By**: Development Team
**Total Entries**: Growing continuously

**Navigation**: [← Back to Main](./README.md) | [Master Index →](./MASTER-INDEX.md) | [Navigation Guide →](./NAVIGATION.md)
