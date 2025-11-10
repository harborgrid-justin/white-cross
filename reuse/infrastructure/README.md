# Infrastructure Services

**Category**: Infrastructure & Platform Services
**Kits**: 7 production-ready categories
**Exports**: 450+ functions, classes, and utilities

---

## Overview

Infrastructure services provide enterprise-grade utilities for background processing, notifications, payments, storage, webhooks, and logging. These are the backbone services that power modern cloud-native applications.

---

## Categories

### 1. Background Jobs
**Location**: `infrastructure/background-jobs/`
**Source Kits**: 
- `background-jobs-kit.prod.ts`
- `background-jobs-scheduling-kit.ts`
- `queue-jobs-kit.ts`

**Features**:
- Bull/BullMQ queue integration
- Job scheduling with cron
- Priority queues
- Retry logic with exponential backoff
- Circuit breaker pattern
- Saga orchestration
- Distributed locks

**Common Functions**:
```typescript
import { 
  createJob, 
  scheduleJob, 
  JobQueue,
  CircuitBreaker,
  SagaOrchestrator 
} from '@white-cross/reuse/infrastructure/background-jobs';
```

---

### 2. Notifications
**Location**: `infrastructure/notifications/`
**Source Kits**:
- `notification-kit.prod.ts`
- `email-notification-kit-v2.ts`
- `email-notifications-kit.ts`

**Features**:
- Multi-channel (email, SMS, push)
- Template rendering
- Delivery tracking
- Queue-based delivery
- Provider abstraction (SendGrid, Twilio, FCM)

**Common Functions**:
```typescript
import {
  sendEmail,
  sendSMS,
  sendPush,
  renderTemplate,
  trackDelivery
} from '@white-cross/reuse/infrastructure/notifications';
```

---

### 3. Payments
**Location**: `infrastructure/payments/`
**Source Kits**:
- `payment-processing-kit.prod.ts`

**Features**:
- Stripe, PayPal, Square integration
- Payment intents
- Subscriptions & recurring billing
- Refunds & disputes
- 3D Secure (SCA)
- Fraud detection

**Common Functions**:
```typescript
import {
  createPaymentIntent,
  processPayment,
  createSubscription,
  refundPayment,
  handleWebhook
} from '@white-cross/reuse/infrastructure/payments';
```

---

### 4. Storage
**Location**: `infrastructure/storage/`
**Source Kits**:
- `file-storage-kit.prod.ts`
- `file-storage-kit-v2.ts`
- `file-storage-processing-kit.ts`

**Features**:
- Multi-cloud (AWS S3, Azure Blob, GCP)
- Image resizing
- Video transcoding
- Presigned URLs
- Virus scanning
- CDN integration

**Common Functions**:
```typescript
import {
  uploadFile,
  downloadFile,
  deleteFile,
  resizeImage,
  transcodeVideo,
  generatePresignedUrl
} from '@white-cross/reuse/infrastructure/storage';
```

---

### 5. Webhooks
**Location**: `infrastructure/webhooks/`
**Source Kits**:
- `webhook-management-kit.prod.ts`

**Features**:
- HMAC signing & verification
- Retry logic with backoff
- Circuit breaker
- Event filtering
- Dead letter queue
- Delivery tracking

**Common Functions**:
```typescript
import {
  signWebhook,
  verifyWebhook,
  deliverWebhook,
  retryWebhook,
  batchWebhooks
} from '@white-cross/reuse/infrastructure/webhooks';
```

---

### 6. Logging & Monitoring
**Location**: `infrastructure/logging/`
**Source Kits**:
- `logging-monitoring-kit.prod.ts`
- `logging-utils.ts`
- `error-monitoring-kit.ts`

**Features**:
- Structured logging (Winston/Pino)
- Prometheus metrics
- OpenTelemetry tracing
- Health checks
- PII redaction (HIPAA)
- Sentry integration

**Common Functions**:
```typescript
import {
  LoggerService,
  MetricsService,
  TracingService,
  HealthCheckService,
  redactPII
} from '@white-cross/reuse/infrastructure/logging';
```

---

### 7. Rate Limiting
**Location**: `infrastructure/rate-limiting/` (to be created)
**Source Kits**:
- `rate-limiting-kit.prod.ts`
- `rate-limit-throttle-kit.ts`

**Features**:
- Token bucket algorithm
- Sliding window
- Distributed rate limiting with Redis
- DDoS protection
- Quota management

**Common Functions**:
```typescript
import {
  RateLimitGuard,
  checkRateLimit,
  TokenBucketLimiter,
  SlidingWindowLimiter
} from '@white-cross/reuse/infrastructure/rate-limiting';
```

---

## Quick Start

### Import Entire Category
```typescript
import * as Infrastructure from '@white-cross/reuse/infrastructure';

// Use any function
await Infrastructure.sendEmail({ to: 'user@example.com', ... });
await Infrastructure.createJob(queue, { ... });
```

### Import Specific Subcategory
```typescript
import * as Jobs from '@white-cross/reuse/infrastructure/background-jobs';
import * as Notifications from '@white-cross/reuse/infrastructure/notifications';

await Jobs.createJob(...);
await Notifications.sendEmail(...);
```

### Import Individual Functions
```typescript
import { createJob, scheduleJob } from '@white-cross/reuse/infrastructure/background-jobs';
import { sendEmail, sendSMS } from '@white-cross/reuse/infrastructure/notifications';
```

---

## Common Patterns

### Pattern 1: Queue-Based Email Sending
```typescript
import { createJob } from '@white-cross/reuse/infrastructure/background-jobs';
import { sendEmail } from '@white-cross/reuse/infrastructure/notifications';

// Queue email for background delivery
await createJob(emailQueue, {
  name: 'send-email',
  data: {
    to: 'user@example.com',
    subject: 'Welcome',
    template: 'welcome-email',
    data: { name: 'John' }
  },
  options: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 }
  }
});
```

### Pattern 2: Payment with Webhook Verification
```typescript
import { processPayment } from '@white-cross/reuse/infrastructure/payments';
import { verifyWebhook } from '@white-cross/reuse/infrastructure/webhooks';

// Verify webhook signature
const isValid = verifyWebhook(req.body, req.headers['stripe-signature'], secret);

if (isValid) {
  await processPayment(webhookData);
}
```

### Pattern 3: File Upload with Processing
```typescript
import { uploadFile, resizeImage } from '@white-cross/reuse/infrastructure/storage';

// Upload and process image
const uploadedFile = await uploadFile(file, 's3', bucketName);
const resized = await resizeImage(uploadedFile.key, { width: 800, height: 600 });
```

---

## Best Practices

### Error Handling
Always use try-catch with infrastructure services:
```typescript
try {
  await sendEmail({ ... });
} catch (error) {
  logger.error('Failed to send email', { error, context });
  // Handle error appropriately
}
```

### Retry Logic
Configure appropriate retry strategies:
```typescript
await createJob(queue, {
  data: { ... },
  options: {
    attempts: 3,
    backoff: { 
      type: 'exponential', 
      delay: 5000 
    }
  }
});
```

### Monitoring
Track all infrastructure operations:
```typescript
const metric = await trackMetric('email.sent', 1, { provider: 'sendgrid' });
const trace = startTrace('payment.process');
```

---

## Dependencies

- **NestJS**: 10.x
- **Bull/BullMQ**: Job queues
- **Redis**: Caching, rate limiting, distributed locks
- **AWS SDK**: S3 storage
- **Azure SDK**: Azure Blob storage
- **SendGrid**: Email delivery
- **Twilio**: SMS delivery
- **Stripe**: Payment processing
- **Winston/Pino**: Logging
- **Prometheus**: Metrics
- **OpenTelemetry**: Tracing

---

## See Also

- [Background Jobs Guide](../docs/background-jobs-guide.md)
- [Notification Guide](../docs/notification-guide.md)
- [Payment Processing Guide](../docs/payment-processing-guide.md)
- [File Storage Guide](../docs/file-storage-guide.md)
- [Webhook Management Guide](../docs/webhook-management-guide.md)
- [Logging & Monitoring Guide](../docs/logging-monitoring-guide.md)

---

**Navigation**: [← Back to Main](../README.md) | [Core →](../core/README.md) | [Domain →](../domain/README.md)
