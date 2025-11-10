/**
 * Infrastructure Services - Main Index
 * 
 * @module infrastructure
 * @description Enterprise-grade infrastructure services for modern cloud applications
 * 
 * @category Infrastructure
 * 
 * @example Import Everything
 * ```typescript
 * import * as Infrastructure from '@white-cross/reuse/infrastructure';
 * 
 * await Infrastructure.createJob(...);
 * await Infrastructure.sendEmail(...);
 * ```
 * 
 * @example Import Specific Categories
 * ```typescript
 * import * as Jobs from '@white-cross/reuse/infrastructure/background-jobs';
 * import * as Notifications from '@white-cross/reuse/infrastructure/notifications';
 * ```
 */

// Background Jobs & Scheduling
export * from './background-jobs';

// Notifications (Email, SMS, Push)
export * from './notifications';

// Payments (Stripe, PayPal, Square)
export * as Payments from '../payment-processing-kit.prod';

// File Storage (S3, Azure, GCP)
export * as Storage from '../file-storage-kit.prod';

// Webhooks
export * as Webhooks from '../webhook-management-kit.prod';

// Logging & Monitoring
export * as Logging from '../logging-monitoring-kit.prod';

// Rate Limiting
export * as RateLimiting from '../rate-limiting-kit.prod';

// Real-time Communication
export * as Realtime from '../realtime-communication-kit.prod';

// Search & Indexing
export * as Search from '../search-indexing-kit.prod';

/**
 * Infrastructure Categories
 * =========================
 * 
 * 1. **Background Jobs** (`./background-jobs/`)
 *    - Job queues, scheduling, retry logic
 *    - Circuit breakers, distributed locks, sagas
 *    
 * 2. **Notifications** (`./notifications/`)
 *    - Email (SendGrid, AWS SES, SMTP)
 *    - SMS (Twilio, AWS SNS)
 *    - Push (FCM, APNS)
 *    
 * 3. **Payments** (Stripe, PayPal, Square)
 *    - Payment intents, subscriptions
 *    - Refunds, disputes, webhooks
 *    
 * 4. **Storage** (S3, Azure Blob, GCP Storage)
 *    - File upload/download
 *    - Image resizing, video transcoding
 *    
 * 5. **Webhooks**
 *    - HMAC signing/verification
 *    - Retry logic, circuit breakers
 *    
 * 6. **Logging & Monitoring**
 *    - Structured logging (Winston/Pino)
 *    - Metrics (Prometheus), Tracing (OpenTelemetry)
 *    
 * 7. **Rate Limiting**
 *    - Token bucket, sliding window
 *    - DDoS protection, quotas
 *    
 * 8. **Real-time**
 *    - WebSockets, Socket.IO
 *    - Server-Sent Events (SSE)
 *    
 * 9. **Search**
 *    - Elasticsearch, OpenSearch
 *    - Full-text search, facets
 */

/**
 * Common Usage Patterns
 * =====================
 * 
 * ### Queue an Email for Background Delivery
 * ```typescript
 * import { createJob } from '@white-cross/reuse/infrastructure/background-jobs';
 * 
 * await createJob(emailQueue, {
 *   name: 'send-email',
 *   data: { to: 'user@example.com', subject: 'Welcome' },
 *   options: { attempts: 3 }
 * });
 * ```
 * 
 * ### Process a Payment
 * ```typescript
 * import { Payments } from '@white-cross/reuse/infrastructure';
 * 
 * const intent = await Payments.createPaymentIntent(5000, 'usd', {
 *   provider: 'stripe',
 *   customerId: 'cus_123'
 * });
 * ```
 * 
 * ### Upload File to S3
 * ```typescript
 * import { Storage } from '@white-cross/reuse/infrastructure';
 * 
 * const result = await Storage.uploadFile(file, 's3', bucketName);
 * ```
 * 
 * ### Deliver Webhook with Retry
 * ```typescript
 * import { Webhooks } from '@white-cross/reuse/infrastructure';
 * 
 * await Webhooks.deliverWebhook({
 *   url: 'https://example.com/webhook',
 *   payload: { event: 'user.created', data: {...} },
 *   signature: Webhooks.signWebhook(payload, secret)
 * });
 * ```
 */
