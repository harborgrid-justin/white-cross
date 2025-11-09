"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Search = exports.Realtime = exports.RateLimiting = exports.Logging = exports.Webhooks = exports.Storage = exports.Payments = void 0;
// Background Jobs & Scheduling
__exportStar(require("./background-jobs"), exports);
// Notifications (Email, SMS, Push)
__exportStar(require("./notifications"), exports);
// Payments (Stripe, PayPal, Square)
exports.Payments = __importStar(require("../payment-processing-kit.prod"));
// File Storage (S3, Azure, GCP)
exports.Storage = __importStar(require("../file-storage-kit.prod"));
// Webhooks
exports.Webhooks = __importStar(require("../webhook-management-kit.prod"));
// Logging & Monitoring
exports.Logging = __importStar(require("../logging-monitoring-kit.prod"));
// Rate Limiting
exports.RateLimiting = __importStar(require("../rate-limiting-kit.prod"));
// Real-time Communication
exports.Realtime = __importStar(require("../realtime-communication-kit.prod"));
// Search & Indexing
exports.Search = __importStar(require("../search-indexing-kit.prod"));
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
//# sourceMappingURL=index.js.map