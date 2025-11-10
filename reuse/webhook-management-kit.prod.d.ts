/**
 * LOC: WHK1234567
 * File: /reuse/webhook-management-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Webhook delivery services
 *   - Event notification systems
 *   - Integration platforms
 *   - API webhook endpoints
 */
import { Sequelize } from 'sequelize';
/**
 * Webhook subscription configuration
 */
export interface WebhookSubscription {
    id: string;
    url: string;
    events: string[];
    secret: string;
    active: boolean;
    filters?: Record<string, any>;
    headers?: Record<string, string>;
    retryConfig?: RetryConfig;
    rateLimit?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Webhook delivery record
 */
export interface WebhookDelivery {
    id: string;
    subscriptionId: string;
    eventId: string;
    eventType: string;
    url: string;
    payload: any;
    status: 'pending' | 'delivered' | 'failed' | 'retrying' | 'dead_letter';
    attempts: number;
    maxAttempts: number;
    lastAttemptAt?: Date;
    nextRetryAt?: Date;
    responseStatus?: number;
    responseBody?: string;
    errorMessage?: string;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Webhook event payload
 */
export interface WebhookEvent {
    id: string;
    type: string;
    data: any;
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * Signature configuration for HMAC signing
 */
export interface SignatureConfig {
    algorithm: 'sha256' | 'sha512';
    header: string;
    timestampHeader?: string;
    includeTimestamp?: boolean;
    timestampTolerance?: number;
}
/**
 * Retry configuration with exponential backoff
 */
export interface RetryConfig {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    retryableStatusCodes: number[];
    timeout: number;
}
/**
 * Delivery result with detailed information
 */
export interface DeliveryResult {
    success: boolean;
    subscriptionId: string;
    deliveryId: string;
    status: number;
    responseBody?: string;
    error?: string;
    duration: number;
    attempt: number;
    willRetry: boolean;
    nextRetryAt?: Date;
}
/**
 * Batch delivery configuration
 */
export interface BatchConfig {
    maxSize: number;
    maxWaitTime: number;
    flushOnShutdown: boolean;
}
/**
 * Rate limit configuration per subscription
 */
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
}
/**
 * Dead letter queue configuration
 */
export interface DeadLetterConfig {
    maxRetries: number;
    retentionPeriod: number;
    notifyOnFailure: boolean;
    notificationUrl?: string;
}
/**
 * Circuit breaker state
 */
export interface CircuitBreakerState {
    subscriptionId: string;
    state: 'closed' | 'open' | 'half-open';
    failures: number;
    threshold: number;
    lastFailureAt?: Date;
    resetTimeout: number;
    nextResetAt?: Date;
}
/**
 * Delivery metrics and statistics
 */
export interface DeliveryMetrics {
    subscriptionId?: string;
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    retryingDeliveries: number;
    deadLetterDeliveries: number;
    averageLatency: number;
    p95Latency: number;
    p99Latency: number;
    successRate: number;
    period: {
        start: Date;
        end: Date;
    };
}
/**
 * Webhook verification challenge
 */
export interface WebhookVerificationChallenge {
    challenge: string;
    timestamp: Date;
    expiresAt: Date;
}
/**
 * Zod schema for webhook subscription creation/update
 */
export declare const WebhookSubscriptionSchema: any;
/**
 * Zod schema for webhook event
 */
export declare const WebhookEventSchema: any;
/**
 * Zod schema for signature configuration
 */
export declare const SignatureConfigSchema: any;
/**
 * Zod schema for delivery result
 */
export declare const DeliveryResultSchema: any;
/**
 * Sequelize model for Webhook Subscriptions with events, filters, and retry configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WebhookSubscription model
 *
 * @example
 * ```typescript
 * const WebhookSubscription = createWebhookSubscriptionModel(sequelize);
 * const subscription = await WebhookSubscription.create({
 *   url: 'https://example.com/webhooks',
 *   events: ['user.created', 'user.updated'],
 *   secret: 'whsec_abc123xyz',
 *   active: true
 * });
 * ```
 */
export declare const createWebhookSubscriptionModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        url: string;
        events: string[];
        secret: string;
        active: boolean;
        filters: Record<string, any>;
        headers: Record<string, string>;
        retryConfig: Record<string, any>;
        rateLimit: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Webhook Deliveries with status tracking and retry management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WebhookDelivery model
 *
 * @example
 * ```typescript
 * const WebhookDelivery = createWebhookDeliveryModel(sequelize);
 * const delivery = await WebhookDelivery.create({
 *   subscriptionId: 'sub-uuid',
 *   eventId: 'evt-uuid',
 *   eventType: 'user.created',
 *   url: 'https://example.com/webhooks',
 *   payload: { user: { id: 123, name: 'John' } },
 *   status: 'pending'
 * });
 * ```
 */
export declare const createWebhookDeliveryModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        subscriptionId: string;
        eventId: string;
        eventType: string;
        url: string;
        payload: any;
        status: string;
        attempts: number;
        maxAttempts: number;
        lastAttemptAt: Date | null;
        nextRetryAt: Date | null;
        responseStatus: number | null;
        responseBody: string | null;
        errorMessage: string | null;
        deliveredAt: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Webhook Events with type and payload storage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WebhookEvent model
 *
 * @example
 * ```typescript
 * const WebhookEvent = createWebhookEventModel(sequelize);
 * const event = await WebhookEvent.create({
 *   type: 'user.created',
 *   data: { user: { id: 123, name: 'John Doe' } },
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const createWebhookEventModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        type: string;
        data: any;
        timestamp: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Dead Letter Queue storing failed webhook deliveries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DeadLetterQueue model
 *
 * @example
 * ```typescript
 * const DeadLetterQueue = createDeadLetterQueueModel(sequelize);
 * const dlqItem = await DeadLetterQueue.create({
 *   deliveryId: 'del-uuid',
 *   subscriptionId: 'sub-uuid',
 *   eventId: 'evt-uuid',
 *   reason: 'Max retries exceeded',
 *   payload: { ... }
 * });
 * ```
 */
export declare const createDeadLetterQueueModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        deliveryId: string;
        subscriptionId: string;
        eventId: string;
        reason: string;
        payload: any;
        attempts: number;
        lastError: string;
        processedAt: Date | null;
        retryCount: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * @function generateHmacSignature
 * @description Generates HMAC-SHA256 signature for webhook payload
 * @param {any} payload - Webhook payload
 * @param {string} secret - HMAC secret key
 * @param {string} [algorithm='sha256'] - Hash algorithm
 * @returns {string} Hex-encoded HMAC signature
 *
 * @example
 * ```typescript
 * const signature = generateHmacSignature(
 *   { event: 'user.created', data: { id: 123 } },
 *   'whsec_abc123xyz',
 *   'sha256'
 * );
 * // Returns: 'a1b2c3d4e5f6...'
 * ```
 */
export declare const generateHmacSignature: (payload: any, secret: string, algorithm?: "sha256" | "sha512") => string;
/**
 * @function verifyHmacSignature
 * @description Verifies HMAC signature for webhook payload
 * @param {any} payload - Webhook payload
 * @param {string} signature - Provided signature
 * @param {string} secret - HMAC secret key
 * @param {string} [algorithm='sha256'] - Hash algorithm
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyHmacSignature(
 *   payload,
 *   'a1b2c3d4e5f6...',
 *   'whsec_abc123xyz'
 * );
 * if (isValid) {
 *   // Process webhook
 * }
 * ```
 */
export declare const verifyHmacSignature: (payload: any, signature: string, secret: string, algorithm?: "sha256" | "sha512") => boolean;
/**
 * @function createSignatureHeaders
 * @description Creates signature headers for webhook delivery
 * @param {any} payload - Webhook payload
 * @param {string} secret - HMAC secret key
 * @param {SignatureConfig} [config] - Signature configuration
 * @returns {Record<string, string>} Headers object with signature
 *
 * @example
 * ```typescript
 * const headers = createSignatureHeaders(
 *   { event: 'user.created' },
 *   'whsec_abc123xyz',
 *   { algorithm: 'sha256', includeTimestamp: true }
 * );
 * // Returns: { 'X-Webhook-Signature': '...', 'X-Webhook-Timestamp': '...' }
 * ```
 */
export declare const createSignatureHeaders: (payload: any, secret: string, config?: Partial<SignatureConfig>) => Record<string, string>;
/**
 * @function validateSignatureTimestamp
 * @description Validates webhook signature timestamp to prevent replay attacks
 * @param {number} timestamp - Provided timestamp (seconds)
 * @param {number} [tolerance=300] - Tolerance in seconds
 * @returns {boolean} True if timestamp is within tolerance
 *
 * @example
 * ```typescript
 * const isValid = validateSignatureTimestamp(1699999999, 300);
 * if (!isValid) {
 *   throw new Error('Timestamp too old - possible replay attack');
 * }
 * ```
 */
export declare const validateSignatureTimestamp: (timestamp: number, tolerance?: number) => boolean;
/**
 * @function generateWebhookSecret
 * @description Generates a cryptographically secure webhook secret
 * @param {number} [length=32] - Secret length in bytes
 * @returns {string} Base64-encoded secret with 'whsec_' prefix
 *
 * @example
 * ```typescript
 * const secret = generateWebhookSecret(32);
 * // Returns: 'whsec_abcdef123456...'
 * ```
 */
export declare const generateWebhookSecret: (length?: number) => string;
/**
 * @function rotateWebhookSecret
 * @description Rotates webhook secret for a subscription
 * @param {string} subscriptionId - Subscription identifier
 * @param {string} oldSecret - Current secret
 * @returns {Object} New secret and grace period end
 *
 * @example
 * ```typescript
 * const { newSecret, gracePeriodEnd } = rotateWebhookSecret(
 *   'sub-uuid',
 *   'whsec_old123'
 * );
 * // Allow both old and new secrets during grace period
 * ```
 */
export declare const rotateWebhookSecret: (subscriptionId: string, oldSecret: string) => {
    newSecret: string;
    oldSecret: string;
    gracePeriodEnd: Date;
};
/**
 * @function parseSignatureHeader
 * @description Parses webhook signature header (supports multiple formats)
 * @param {string} headerValue - Signature header value
 * @returns {Object} Parsed signature components
 *
 * @example
 * ```typescript
 * const parsed = parseSignatureHeader('t=1699999999,v1=abc123,v2=def456');
 * // Returns: { timestamp: 1699999999, signatures: { v1: 'abc123', v2: 'def456' } }
 * ```
 */
export declare const parseSignatureHeader: (headerValue: string) => {
    timestamp?: number;
    signatures: Record<string, string>;
};
/**
 * @function validateReplayProtection
 * @description Validates webhook against replay attacks using timestamp and nonce
 * @param {string} signature - Webhook signature
 * @param {number} timestamp - Webhook timestamp
 * @param {string} [nonce] - Optional nonce for additional security
 * @param {Set<string>} [processedNonces] - Set of processed nonces
 * @returns {boolean} True if webhook is valid and not a replay
 *
 * @example
 * ```typescript
 * const processedNonces = new Set<string>();
 * const isValid = validateReplayProtection(
 *   signature,
 *   timestamp,
 *   nonce,
 *   processedNonces
 * );
 * ```
 */
export declare const validateReplayProtection: (signature: string, timestamp: number, nonce?: string, processedNonces?: Set<string>) => boolean;
/**
 * @function deliverWebhook
 * @description Delivers webhook to endpoint with timeout
 * @param {string} url - Webhook endpoint URL
 * @param {any} payload - Event payload
 * @param {Record<string, string>} [headers] - Custom headers
 * @param {number} [timeout=30000] - Request timeout in milliseconds
 * @returns {Promise<DeliveryResult>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await deliverWebhook(
 *   'https://example.com/webhooks',
 *   { event: 'user.created', data: { id: 123 } },
 *   { 'X-Custom-Header': 'value' },
 *   30000
 * );
 * ```
 */
export declare const deliverWebhook: (url: string, payload: any, headers?: Record<string, string>, timeout?: number) => Promise<Partial<DeliveryResult>>;
/**
 * @function calculateRetryDelay
 * @description Calculates exponential backoff retry delay
 * @param {number} attempt - Attempt number (0-indexed)
 * @param {RetryConfig} config - Retry configuration
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateRetryDelay(2, {
 *   initialDelay: 1000,
 *   maxDelay: 300000,
 *   backoffMultiplier: 2
 * });
 * // Returns: 4000 (1000 * 2^2)
 * ```
 */
export declare const calculateRetryDelay: (attempt: number, config: RetryConfig) => number;
/**
 * @function deliverWebhookWithRetry
 * @description Delivers webhook with exponential backoff retry logic
 * @param {string} subscriptionId - Subscription identifier
 * @param {string} url - Webhook endpoint URL
 * @param {any} payload - Event payload
 * @param {Record<string, string>} headers - Headers including signature
 * @param {RetryConfig} retryConfig - Retry configuration
 * @returns {Promise<DeliveryResult>} Final delivery result
 *
 * @example
 * ```typescript
 * const result = await deliverWebhookWithRetry(
 *   'sub-uuid',
 *   'https://example.com/webhooks',
 *   { event: 'user.created' },
 *   signatureHeaders,
 *   { maxAttempts: 3, initialDelay: 1000, backoffMultiplier: 2 }
 * );
 * ```
 */
export declare const deliverWebhookWithRetry: (subscriptionId: string, url: string, payload: any, headers: Record<string, string>, retryConfig: RetryConfig) => Promise<DeliveryResult>;
/**
 * @function scheduleRetry
 * @description Schedules a webhook delivery retry
 * @param {string} deliveryId - Delivery identifier
 * @param {number} attempt - Current attempt number
 * @param {RetryConfig} config - Retry configuration
 * @returns {Date} Next retry timestamp
 *
 * @example
 * ```typescript
 * const nextRetry = scheduleRetry('del-uuid', 2, retryConfig);
 * // Schedule retry at returned timestamp
 * ```
 */
export declare const scheduleRetry: (deliveryId: string, attempt: number, config: RetryConfig) => Date;
/**
 * @function trackDeliveryAttempt
 * @description Records a webhook delivery attempt
 * @param {string} deliveryId - Delivery identifier
 * @param {number} attempt - Attempt number
 * @param {number} status - HTTP status code
 * @param {string} [error] - Error message if failed
 * @returns {Object} Delivery attempt record
 *
 * @example
 * ```typescript
 * const attempt = trackDeliveryAttempt('del-uuid', 1, 500, 'Internal Server Error');
 * ```
 */
export declare const trackDeliveryAttempt: (deliveryId: string, attempt: number, status: number, error?: string) => {
    deliveryId: string;
    attempt: number;
    timestamp: Date;
    status: number;
    error?: string;
};
/**
 * @function updateDeliveryStatus
 * @description Updates webhook delivery status
 * @param {Model} delivery - Delivery model instance
 * @param {string} status - New status
 * @param {Object} [details] - Additional details
 * @returns {Promise<Model>} Updated delivery
 *
 * @example
 * ```typescript
 * await updateDeliveryStatus(delivery, 'delivered', {
 *   responseStatus: 200,
 *   deliveredAt: new Date()
 * });
 * ```
 */
export declare const updateDeliveryStatus: (delivery: any, status: "pending" | "delivered" | "failed" | "retrying" | "dead_letter", details?: {
    responseStatus?: number;
    responseBody?: string;
    errorMessage?: string;
    deliveredAt?: Date;
    nextRetryAt?: Date;
}) => Promise<any>;
/**
 * @function checkCircuitBreaker
 * @description Checks circuit breaker state for a subscription
 * @param {string} subscriptionId - Subscription identifier
 * @param {Map<string, CircuitBreakerState>} circuitBreakers - Circuit breaker state map
 * @returns {boolean} True if circuit is closed (delivery allowed)
 *
 * @example
 * ```typescript
 * const circuitBreakers = new Map();
 * if (checkCircuitBreaker('sub-uuid', circuitBreakers)) {
 *   // Proceed with delivery
 * }
 * ```
 */
export declare const checkCircuitBreaker: (subscriptionId: string, circuitBreakers: Map<string, CircuitBreakerState>) => boolean;
/**
 * @function openCircuitBreaker
 * @description Opens circuit breaker after threshold failures
 * @param {string} subscriptionId - Subscription identifier
 * @param {Map<string, CircuitBreakerState>} circuitBreakers - Circuit breaker state map
 * @param {number} [resetTimeout=60000] - Reset timeout in milliseconds
 *
 * @example
 * ```typescript
 * openCircuitBreaker('sub-uuid', circuitBreakers, 60000);
 * // Circuit will remain open for 60 seconds
 * ```
 */
export declare const openCircuitBreaker: (subscriptionId: string, circuitBreakers: Map<string, CircuitBreakerState>, resetTimeout?: number) => void;
/**
 * @function closeCircuitBreaker
 * @description Closes circuit breaker after successful delivery
 * @param {string} subscriptionId - Subscription identifier
 * @param {Map<string, CircuitBreakerState>} circuitBreakers - Circuit breaker state map
 *
 * @example
 * ```typescript
 * closeCircuitBreaker('sub-uuid', circuitBreakers);
 * // Reset failure count and close circuit
 * ```
 */
export declare const closeCircuitBreaker: (subscriptionId: string, circuitBreakers: Map<string, CircuitBreakerState>) => void;
/**
 * @function getDeliveryHistory
 * @description Retrieves delivery history for a subscription
 * @param {Model} DeliveryModel - Delivery model
 * @param {string} subscriptionId - Subscription identifier
 * @param {number} [limit=50] - Number of records to retrieve
 * @returns {Promise<any[]>} Delivery history
 *
 * @example
 * ```typescript
 * const history = await getDeliveryHistory(WebhookDelivery, 'sub-uuid', 50);
 * ```
 */
export declare const getDeliveryHistory: (DeliveryModel: any, subscriptionId: string, limit?: number) => Promise<any[]>;
/**
 * @function cancelScheduledDelivery
 * @description Cancels a scheduled webhook delivery
 * @param {Model} delivery - Delivery model instance
 * @returns {Promise<Model>} Updated delivery
 *
 * @example
 * ```typescript
 * await cancelScheduledDelivery(delivery);
 * ```
 */
export declare const cancelScheduledDelivery: (delivery: any) => Promise<any>;
/**
 * @function createWebhookSubscription
 * @description Creates a new webhook subscription
 * @param {Model} SubscriptionModel - Subscription model
 * @param {Object} data - Subscription data
 * @returns {Promise<WebhookSubscription>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await createWebhookSubscription(WebhookSubscription, {
 *   url: 'https://example.com/webhooks',
 *   events: ['user.created', 'user.updated'],
 *   secret: generateWebhookSecret()
 * });
 * ```
 */
export declare const createWebhookSubscription: (SubscriptionModel: any, data: {
    url: string;
    events: string[];
    secret?: string;
    filters?: Record<string, any>;
    headers?: Record<string, string>;
    retryConfig?: Partial<RetryConfig>;
    rateLimit?: number;
    metadata?: Record<string, any>;
}) => Promise<any>;
/**
 * @function updateWebhookSubscription
 * @description Updates an existing webhook subscription
 * @param {Model} subscription - Subscription model instance
 * @param {Object} updates - Update data
 * @returns {Promise<WebhookSubscription>} Updated subscription
 *
 * @example
 * ```typescript
 * const updated = await updateWebhookSubscription(subscription, {
 *   events: ['user.created', 'user.updated', 'user.deleted'],
 *   active: true
 * });
 * ```
 */
export declare const updateWebhookSubscription: (subscription: any, updates: Partial<WebhookSubscription>) => Promise<any>;
/**
 * @function deleteWebhookSubscription
 * @description Deletes a webhook subscription
 * @param {Model} subscription - Subscription model instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteWebhookSubscription(subscription);
 * ```
 */
export declare const deleteWebhookSubscription: (subscription: any) => Promise<void>;
/**
 * @function getWebhookSubscription
 * @description Retrieves a webhook subscription by ID
 * @param {Model} SubscriptionModel - Subscription model
 * @param {string} id - Subscription identifier
 * @returns {Promise<WebhookSubscription | null>} Subscription or null
 *
 * @example
 * ```typescript
 * const subscription = await getWebhookSubscription(WebhookSubscription, 'sub-uuid');
 * ```
 */
export declare const getWebhookSubscription: (SubscriptionModel: any, id: string) => Promise<any | null>;
/**
 * @function listWebhookSubscriptions
 * @description Lists webhook subscriptions with filtering
 * @param {Model} SubscriptionModel - Subscription model
 * @param {Object} [filters] - Filter criteria
 * @returns {Promise<WebhookSubscription[]>} List of subscriptions
 *
 * @example
 * ```typescript
 * const subscriptions = await listWebhookSubscriptions(WebhookSubscription, {
 *   active: true,
 *   events: ['user.created']
 * });
 * ```
 */
export declare const listWebhookSubscriptions: (SubscriptionModel: any, filters?: {
    active?: boolean;
    events?: string[];
    url?: string;
}) => Promise<any[]>;
/**
 * @function validateWebhookUrl
 * @description Validates webhook URL format and accessibility
 * @param {string} url - Webhook URL
 * @returns {Promise<boolean>} True if URL is valid
 *
 * @example
 * ```typescript
 * const isValid = await validateWebhookUrl('https://example.com/webhooks');
 * ```
 */
export declare const validateWebhookUrl: (url: string) => Promise<boolean>;
/**
 * @function verifyWebhookEndpoint
 * @description Verifies webhook endpoint can receive webhooks (challenge-response)
 * @param {string} url - Webhook URL
 * @param {string} secret - Webhook secret
 * @returns {Promise<boolean>} True if endpoint verified
 *
 * @example
 * ```typescript
 * const verified = await verifyWebhookEndpoint(
 *   'https://example.com/webhooks',
 *   'whsec_abc123'
 * );
 * ```
 */
export declare const verifyWebhookEndpoint: (url: string, secret: string) => Promise<boolean>;
/**
 * @function filterEventsBySubscription
 * @description Filters events based on subscription criteria
 * @param {WebhookEvent} event - Webhook event
 * @param {WebhookSubscription} subscription - Subscription
 * @returns {boolean} True if event matches subscription
 *
 * @example
 * ```typescript
 * if (filterEventsBySubscription(event, subscription)) {
 *   // Deliver webhook
 * }
 * ```
 */
export declare const filterEventsBySubscription: (event: WebhookEvent, subscription: WebhookSubscription) => boolean;
/**
 * @function matchEventToSubscriptions
 * @description Finds all subscriptions matching an event
 * @param {WebhookEvent} event - Webhook event
 * @param {WebhookSubscription[]} subscriptions - All subscriptions
 * @returns {WebhookSubscription[]} Matching subscriptions
 *
 * @example
 * ```typescript
 * const matching = matchEventToSubscriptions(event, allSubscriptions);
 * // Deliver to all matching subscriptions
 * ```
 */
export declare const matchEventToSubscriptions: (event: WebhookEvent, subscriptions: WebhookSubscription[]) => WebhookSubscription[];
/**
 * @function batchWebhookEvents
 * @description Batches multiple webhook events for efficient delivery
 * @param {WebhookEvent[]} events - Array of events
 * @param {BatchConfig} config - Batch configuration
 * @returns {WebhookEvent[][]} Batched events
 *
 * @example
 * ```typescript
 * const batches = batchWebhookEvents(events, { maxSize: 10, maxWaitTime: 5000 });
 * ```
 */
export declare const batchWebhookEvents: (events: WebhookEvent[], config: BatchConfig) => WebhookEvent[][];
/**
 * @function deliverBatch
 * @description Delivers a batch of webhook events
 * @param {string} url - Webhook endpoint URL
 * @param {WebhookEvent[]} events - Events to deliver
 * @param {Record<string, string>} headers - Headers including signature
 * @param {number} [timeout=30000] - Request timeout
 * @returns {Promise<DeliveryResult>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await deliverBatch(
 *   'https://example.com/webhooks/batch',
 *   events,
 *   signatureHeaders
 * );
 * ```
 */
export declare const deliverBatch: (url: string, events: WebhookEvent[], headers: Record<string, string>, timeout?: number) => Promise<Partial<DeliveryResult>>;
/**
 * @function createBatchPayload
 * @description Creates a standardized batch payload
 * @param {WebhookEvent[]} events - Events to batch
 * @returns {Object} Batch payload
 *
 * @example
 * ```typescript
 * const payload = createBatchPayload(events);
 * ```
 */
export declare const createBatchPayload: (events: WebhookEvent[]) => {
    type: string;
    events: WebhookEvent[];
    count: number;
    timestamp: Date;
};
/**
 * @function checkBatchSize
 * @description Checks if batch has reached maximum size
 * @param {WebhookEvent[]} batch - Current batch
 * @param {number} maxSize - Maximum batch size
 * @returns {boolean} True if batch should be flushed
 *
 * @example
 * ```typescript
 * if (checkBatchSize(currentBatch, 10)) {
 *   await deliverBatch(...);
 * }
 * ```
 */
export declare const checkBatchSize: (batch: WebhookEvent[], maxSize: number) => boolean;
/**
 * @function prioritizeDeliveries
 * @description Prioritizes webhook deliveries based on criteria
 * @param {WebhookDelivery[]} deliveries - Deliveries to prioritize
 * @param {string} [strategy='fifo'] - Priority strategy
 * @returns {WebhookDelivery[]} Sorted deliveries
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeDeliveries(deliveries, 'priority');
 * ```
 */
export declare const prioritizeDeliveries: (deliveries: WebhookDelivery[], strategy?: "fifo" | "priority" | "latest") => WebhookDelivery[];
/**
 * @function throttleDelivery
 * @description Throttles webhook delivery based on rate limit
 * @param {string} subscriptionId - Subscription identifier
 * @param {Map<string, number[]>} rateLimits - Rate limit tracking map
 * @param {number} maxPerMinute - Maximum deliveries per minute
 * @returns {boolean} True if delivery is allowed
 *
 * @example
 * ```typescript
 * const rateLimits = new Map();
 * if (throttleDelivery('sub-uuid', rateLimits, 100)) {
 *   // Proceed with delivery
 * }
 * ```
 */
export declare const throttleDelivery: (subscriptionId: string, rateLimits: Map<string, number[]>, maxPerMinute: number) => boolean;
/**
 * @function scheduleDeliveryWindow
 * @description Schedules delivery within allowed time window
 * @param {Date} [startHour=0] - Window start hour (0-23)
 * @param {Date} [endHour=23] - Window end hour (0-23)
 * @returns {Date | null} Next available delivery time or null if in window
 *
 * @example
 * ```typescript
 * const nextWindow = scheduleDeliveryWindow(9, 17); // Business hours
 * if (nextWindow) {
 *   // Schedule for next window
 * }
 * ```
 */
export declare const scheduleDeliveryWindow: (startHour?: number, endHour?: number) => Date | null;
/**
 * @function validateIpWhitelist
 * @description Validates webhook delivery IP against whitelist
 * @param {string} ip - IP address
 * @param {string[]} whitelist - Allowed IP addresses/ranges
 * @returns {boolean} True if IP is whitelisted
 *
 * @example
 * ```typescript
 * if (validateIpWhitelist(req.ip, subscription.ipWhitelist)) {
 *   // Process webhook
 * }
 * ```
 */
export declare const validateIpWhitelist: (ip: string, whitelist: string[]) => boolean;
/**
 * @function checkRateLimit
 * @description Checks if subscription has exceeded rate limit
 * @param {string} subscriptionId - Subscription identifier
 * @param {Map<string, RateLimitEntry>} rateLimits - Rate limit state
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {boolean} True if within limit
 *
 * @example
 * ```typescript
 * if (!checkRateLimit('sub-uuid', rateLimits, { windowMs: 60000, maxRequests: 100 })) {
 *   throw new Error('Rate limit exceeded');
 * }
 * ```
 */
interface RateLimitEntry {
    count: number;
    resetTime: number;
}
export declare const checkRateLimit: (subscriptionId: string, rateLimits: Map<string, RateLimitEntry>, config: RateLimitConfig) => boolean;
/**
 * @function incrementRateLimit
 * @description Increments rate limit counter for subscription
 * @param {string} subscriptionId - Subscription identifier
 * @param {Map<string, RateLimitEntry>} rateLimits - Rate limit state
 * @param {RateLimitConfig} config - Rate limit configuration
 *
 * @example
 * ```typescript
 * incrementRateLimit('sub-uuid', rateLimits, config);
 * ```
 */
export declare const incrementRateLimit: (subscriptionId: string, rateLimits: Map<string, RateLimitEntry>, config: RateLimitConfig) => void;
/**
 * @function moveToDeadLetterQueue
 * @description Moves failed delivery to dead letter queue
 * @param {Model} DeadLetterModel - Dead letter queue model
 * @param {WebhookDelivery} delivery - Failed delivery
 * @param {string} reason - Failure reason
 * @returns {Promise<any>} DLQ entry
 *
 * @example
 * ```typescript
 * await moveToDeadLetterQueue(DeadLetterQueue, delivery, 'Max retries exceeded');
 * ```
 */
export declare const moveToDeadLetterQueue: (DeadLetterModel: any, delivery: WebhookDelivery, reason: string) => Promise<any>;
/**
 * @function processDeadLetterQueue
 * @description Processes items in dead letter queue
 * @param {Model} DeadLetterModel - Dead letter queue model
 * @param {number} [limit=100] - Number of items to process
 * @returns {Promise<any[]>} Processed DLQ items
 *
 * @example
 * ```typescript
 * const items = await processDeadLetterQueue(DeadLetterQueue, 100);
 * ```
 */
export declare const processDeadLetterQueue: (DeadLetterModel: any, limit?: number) => Promise<any[]>;
/**
 * @function retryDeadLetterItem
 * @description Retries a dead letter queue item
 * @param {Model} dlqItem - DLQ item
 * @param {Function} deliveryFn - Delivery function
 * @returns {Promise<boolean>} True if retry successful
 *
 * @example
 * ```typescript
 * const success = await retryDeadLetterItem(dlqItem, deliverWebhook);
 * ```
 */
export declare const retryDeadLetterItem: (dlqItem: any, deliveryFn: (url: string, payload: any, headers?: Record<string, string>) => Promise<any>) => Promise<boolean>;
/**
 * @function getDeliveryMetrics
 * @description Calculates delivery metrics for a subscription
 * @param {Model} DeliveryModel - Delivery model
 * @param {string} [subscriptionId] - Optional subscription filter
 * @param {Date} [startDate] - Start date for metrics
 * @param {Date} [endDate] - End date for metrics
 * @returns {Promise<DeliveryMetrics>} Delivery metrics
 *
 * @example
 * ```typescript
 * const metrics = await getDeliveryMetrics(
 *   WebhookDelivery,
 *   'sub-uuid',
 *   new Date('2025-01-01'),
 *   new Date()
 * );
 * ```
 */
export declare const getDeliveryMetrics: (DeliveryModel: any, subscriptionId?: string, startDate?: Date, endDate?: Date) => Promise<DeliveryMetrics>;
/**
 * @function logWebhookEvent
 * @description Logs webhook event for audit trail
 * @param {WebhookEvent} event - Webhook event
 * @param {string} action - Action performed
 * @param {any} [metadata] - Additional metadata
 * @returns {Object} Log entry
 *
 * @example
 * ```typescript
 * logWebhookEvent(event, 'delivered', { subscriptionId: 'sub-uuid' });
 * ```
 */
export declare const logWebhookEvent: (event: WebhookEvent, action: string, metadata?: any) => {
    timestamp: Date;
    eventId: string;
    eventType: string;
    action: string;
    metadata?: any;
};
/**
 * @function generateAuditLog
 * @description Generates audit log entry for webhook operations
 * @param {string} operation - Operation type
 * @param {string} userId - User performing operation
 * @param {any} details - Operation details
 * @returns {Object} Audit log entry
 *
 * @example
 * ```typescript
 * generateAuditLog('subscription.created', 'user-123', { subscriptionId: 'sub-uuid' });
 * ```
 */
export declare const generateAuditLog: (operation: string, userId: string, details: any) => {
    timestamp: Date;
    operation: string;
    userId: string;
    details: any;
};
/**
 * @function alertOnFailure
 * @description Sends alert when webhook delivery fails repeatedly
 * @param {WebhookDelivery} delivery - Failed delivery
 * @param {number} threshold - Failure threshold
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await alertOnFailure(delivery, 5);
 * ```
 */
export declare const alertOnFailure: (delivery: WebhookDelivery, threshold?: number) => Promise<void>;
/**
 * NestJS service for webhook management operations
 */
export declare class WebhookService {
    private readonly subscriptionModel;
    private readonly eventModel;
    private readonly deliveryModel;
    private readonly deadLetterModel;
    constructor(subscriptionModel: any, eventModel: any, deliveryModel: any, deadLetterModel: any);
    /**
     * Creates a new webhook subscription
     */
    createSubscription(data: any): Promise<any>;
    /**
     * Verifies webhook endpoint
     */
    verifyEndpoint(subscriptionId: string): Promise<boolean>;
    /**
     * Rotates webhook secret
     */
    rotateSecret(subscriptionId: string): Promise<any>;
    /**
     * Lists webhook subscriptions
     */
    listSubscriptions(filters?: any): Promise<any[]>;
    /**
     * Gets webhook subscription by ID
     */
    getSubscription(id: string): Promise<any>;
    /**
     * Updates webhook subscription
     */
    updateSubscription(id: string, updates: any): Promise<any>;
    /**
     * Deletes webhook subscription
     */
    deleteSubscription(id: string): Promise<void>;
}
/**
 * NestJS service for webhook delivery operations
 */
export declare class WebhookDeliveryService {
    private readonly subscriptionModel;
    private readonly deliveryModel;
    private readonly deadLetterModel;
    private circuitBreakers;
    private rateLimits;
    constructor(subscriptionModel: any, deliveryModel: any, deadLetterModel: any);
    /**
     * Processes webhook event and delivers to matching subscriptions
     */
    processEvent(event: WebhookEvent): Promise<DeliveryResult[]>;
    /**
     * Retries a failed delivery
     */
    retryDelivery(deliveryId: string): Promise<DeliveryResult>;
    /**
     * Gets delivery metrics
     */
    getMetrics(subscriptionId?: string, startDate?: Date, endDate?: Date): Promise<DeliveryMetrics>;
}
/**
 * NestJS controller for webhook management endpoints
 */
export declare class WebhookController {
    private readonly webhookService;
    private readonly deliveryService;
    constructor(webhookService: WebhookService, deliveryService: WebhookDeliveryService);
    /**
     * Create webhook subscription
     */
    createSubscription(data: any): Promise<any>;
    /**
     * List webhook subscriptions
     */
    listSubscriptions(filters: any): Promise<any[]>;
    /**
     * Get webhook subscription
     */
    getSubscription(id: string): Promise<any>;
    /**
     * Update webhook subscription
     */
    updateSubscription(id: string, updates: any): Promise<any>;
    /**
     * Delete webhook subscription
     */
    deleteSubscription(id: string): Promise<void>;
    /**
     * Verify webhook endpoint
     */
    verifyEndpoint(id: string): Promise<{
        verified: boolean;
    }>;
    /**
     * Rotate webhook secret
     */
    rotateSecret(id: string): Promise<any>;
    /**
     * List webhook deliveries
     */
    listDeliveries(filters: any): Promise<any[]>;
    /**
     * Retry webhook delivery
     */
    retryDelivery(id: string): Promise<DeliveryResult>;
    /**
     * Get webhook metrics
     */
    getMetrics(query: any): Promise<DeliveryMetrics>;
    /**
     * List dead letter queue items
     */
    listDeadLetterQueue(): Promise<any[]>;
}
export {};
//# sourceMappingURL=webhook-management-kit.prod.d.ts.map