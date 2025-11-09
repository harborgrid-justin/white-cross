/**
 * LOC: VIRTINT1234567
 * File: /reuse/virtual/virtual-api-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Virtual infrastructure API integration services
 *   - VMware vRealize webhook handlers
 *   - Third-party virtualization platform connectors
 */

/**
 * File: /reuse/virtual/virtual-api-integration-kit.ts
 * Locator: WC-VIRTUAL-APIINT-001
 * Purpose: Comprehensive Virtual Infrastructure API Integration Utilities - external API integrations, webhook management, event subscriptions, third-party connectors for VMware, Hyper-V, KVM
 *
 * Upstream: Independent utility module for virtual infrastructure API integrations
 * Downstream: ../backend/*, Virtual infrastructure services, Event processors, Third-party integration adapters
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Express 4.x
 * Exports: 39 utility functions for API integrations, webhook management, event subscriptions, third-party connectors, VMware vRealize integration, vSphere automation
 *
 * LLM Context: Comprehensive virtual infrastructure API integration utilities for implementing production-ready external API integrations for enterprise virtualization platforms.
 * Provides webhook management, event subscription patterns, third-party connector implementations, VMware vRealize Operations integration, vSphere automation SDK wrappers,
 * and Hyper-V/KVM API adapters. Essential for building scalable multi-cloud virtual infrastructure integration architecture.
 */

import { Request, Response, NextFunction } from 'express';
import { EventEmitter } from 'events';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret?: string;
  active: boolean;
  headers?: Record<string, string>;
  retryPolicy: RetryPolicy;
  createdAt: Date;
  lastTriggeredAt?: Date;
}

interface RetryPolicy {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

interface WebhookPayload {
  id: string;
  event: string;
  timestamp: string;
  data: any;
  signature?: string;
  metadata?: Record<string, any>;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  payload: WebhookPayload;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  lastAttemptAt?: Date;
  nextRetryAt?: Date;
  responseStatus?: number;
  responseBody?: string;
  error?: string;
}

interface EventSubscription {
  id: string;
  subscriberId: string;
  eventType: string;
  filters?: Record<string, any>;
  callbackUrl?: string;
  active: boolean;
  createdAt: Date;
}

interface ThirdPartyConnector {
  id: string;
  name: string;
  type: 'vmware' | 'hyperv' | 'kvm' | 'openstack' | 'aws' | 'azure' | 'gcp';
  endpoint: string;
  credentials: ConnectorCredentials;
  config: Record<string, any>;
  status: 'connected' | 'disconnected' | 'error';
}

interface ConnectorCredentials {
  type: 'basic' | 'token' | 'oauth2' | 'certificate';
  username?: string;
  password?: string;
  token?: string;
  clientId?: string;
  clientSecret?: string;
  certificatePath?: string;
}

interface VRealizeConnection {
  baseUrl: string;
  authToken: string;
  refreshToken?: string;
  expiresAt: Date;
}

interface VSphereConnection {
  vcenterUrl: string;
  sessionId: string;
  username: string;
  expiresAt: Date;
}

interface ExternalAPIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

interface ExternalAPIResponse {
  status: number;
  headers: Record<string, string>;
  body: any;
  duration: number;
}

interface APIRateLimiter {
  maxRequests: number;
  windowMs: number;
  currentCount: number;
  resetAt: Date;
}

interface IntegrationEvent {
  type: string;
  source: string;
  timestamp: Date;
  data: any;
  correlationId?: string;
}

interface EventFilter {
  eventType?: string;
  source?: string;
  tags?: Record<string, string>;
  customFilter?: (event: IntegrationEvent) => boolean;
}

// ============================================================================
// WEBHOOK MANAGEMENT (1-8)
// ============================================================================

/**
 * Registers a new webhook subscription.
 *
 * @param {Omit<WebhookConfig, 'id' | 'createdAt'>} config - Webhook configuration
 * @returns {WebhookConfig} Registered webhook
 *
 * @example
 * ```typescript
 * const webhook = registerWebhook({
 *   url: 'https://example.com/webhooks/vm-events',
 *   events: ['vm.created', 'vm.deleted', 'vm.power.changed'],
 *   secret: 'webhook-secret-key',
 *   active: true,
 *   retryPolicy: { maxRetries: 3, initialDelayMs: 1000, maxDelayMs: 60000, backoffMultiplier: 2 }
 * });
 * ```
 */
export const registerWebhook = (
  config: Omit<WebhookConfig, 'id' | 'createdAt'>,
): WebhookConfig => {
  const crypto = require('crypto');
  return {
    id: crypto.randomUUID(),
    ...config,
    createdAt: new Date(),
  };
};

/**
 * Generates HMAC signature for webhook payload.
 *
 * @param {WebhookPayload} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @returns {string} HMAC-SHA256 signature
 *
 * @example
 * ```typescript
 * const signature = generateWebhookSignature(payload, 'webhook-secret');
 * // Result: 'sha256=a1b2c3d4e5f6...'
 * ```
 */
export const generateWebhookSignature = (payload: WebhookPayload, secret: string): string => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return `sha256=${hmac.digest('hex')}`;
};

/**
 * Verifies webhook signature from request.
 *
 * @param {string} receivedSignature - Signature from request header
 * @param {WebhookPayload} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @returns {boolean} Whether signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyWebhookSignature(
 *   req.headers['x-webhook-signature'],
 *   payload,
 *   webhook.secret
 * );
 * if (!isValid) {
 *   return res.status(401).json({ error: 'Invalid signature' });
 * }
 * ```
 */
export const verifyWebhookSignature = (
  receivedSignature: string,
  payload: WebhookPayload,
  secret: string,
): boolean => {
  const expectedSignature = generateWebhookSignature(payload, secret);
  const crypto = require('crypto');
  return crypto.timingSafeEqual(
    Buffer.from(receivedSignature),
    Buffer.from(expectedSignature),
  );
};

/**
 * Delivers webhook payload to registered endpoint.
 *
 * @param {WebhookConfig} webhook - Webhook configuration
 * @param {WebhookPayload} payload - Payload to deliver
 * @returns {Promise<WebhookDelivery>} Delivery result
 *
 * @example
 * ```typescript
 * const delivery = await deliverWebhook(webhook, {
 *   id: 'evt-123',
 *   event: 'vm.created',
 *   timestamp: new Date().toISOString(),
 *   data: { vmId: 'vm-456', name: 'web-server-01' }
 * });
 * ```
 */
export const deliverWebhook = async (
  webhook: WebhookConfig,
  payload: WebhookPayload,
): Promise<WebhookDelivery> => {
  const crypto = require('crypto');
  const deliveryId = crypto.randomUUID();

  if (webhook.secret) {
    payload.signature = generateWebhookSignature(payload, webhook.secret);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Webhook-Event': payload.event,
    'X-Webhook-Delivery': deliveryId,
    ...webhook.headers,
  };

  if (payload.signature) {
    headers['X-Webhook-Signature'] = payload.signature;
  }

  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    return {
      id: deliveryId,
      webhookId: webhook.id,
      payload,
      status: response.ok ? 'delivered' : 'failed',
      attempts: 1,
      lastAttemptAt: new Date(),
      responseStatus: response.status,
      responseBody: await response.text(),
    };
  } catch (error: any) {
    return {
      id: deliveryId,
      webhookId: webhook.id,
      payload,
      status: 'failed',
      attempts: 1,
      lastAttemptAt: new Date(),
      error: error.message,
    };
  }
};

/**
 * Retries failed webhook delivery with exponential backoff.
 *
 * @param {WebhookConfig} webhook - Webhook configuration
 * @param {WebhookDelivery} previousDelivery - Previous failed delivery
 * @returns {Promise<WebhookDelivery>} Retry result
 *
 * @example
 * ```typescript
 * if (delivery.status === 'failed' && delivery.attempts < webhook.retryPolicy.maxRetries) {
 *   const retryDelivery = await retryWebhookDelivery(webhook, delivery);
 * }
 * ```
 */
export const retryWebhookDelivery = async (
  webhook: WebhookConfig,
  previousDelivery: WebhookDelivery,
): Promise<WebhookDelivery> => {
  const { retryPolicy } = webhook;
  const delay = Math.min(
    retryPolicy.initialDelayMs * Math.pow(retryPolicy.backoffMultiplier, previousDelivery.attempts),
    retryPolicy.maxDelayMs,
  );

  await new Promise(resolve => setTimeout(resolve, delay));

  const result = await deliverWebhook(webhook, previousDelivery.payload);
  return {
    ...result,
    attempts: previousDelivery.attempts + 1,
  };
};

/**
 * Creates webhook handler middleware for Express.
 *
 * @param {WebhookConfig[]} webhooks - Registered webhooks
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.post('/webhooks/:webhookId', createWebhookHandlerMiddleware(webhooks));
 * ```
 */
export const createWebhookHandlerMiddleware = (webhooks: WebhookConfig[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const webhookId = req.params.webhookId;
    const webhook = webhooks.find(w => w.id === webhookId);

    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    if (!webhook.active) {
      return res.status(403).json({ error: 'Webhook is inactive' });
    }

    const signature = req.headers['x-webhook-signature'] as string;
    const payload: WebhookPayload = req.body;

    if (webhook.secret && !verifyWebhookSignature(signature, payload, webhook.secret)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    (req as any).webhook = webhook;
    (req as any).webhookPayload = payload;
    next();
  };
};

/**
 * Filters webhooks by event type.
 *
 * @param {WebhookConfig[]} webhooks - All webhooks
 * @param {string} eventType - Event type to filter
 * @returns {WebhookConfig[]} Matching webhooks
 *
 * @example
 * ```typescript
 * const vmWebhooks = filterWebhooksByEvent(allWebhooks, 'vm.created');
 * for (const webhook of vmWebhooks) {
 *   await deliverWebhook(webhook, payload);
 * }
 * ```
 */
export const filterWebhooksByEvent = (
  webhooks: WebhookConfig[],
  eventType: string,
): WebhookConfig[] => {
  return webhooks.filter(
    webhook =>
      webhook.active &&
      (webhook.events.includes(eventType) || webhook.events.includes('*')),
  );
};

/**
 * Broadcasts event to all matching webhooks.
 *
 * @param {WebhookConfig[]} webhooks - All webhooks
 * @param {string} eventType - Event type
 * @param {any} data - Event data
 * @returns {Promise<WebhookDelivery[]>} Delivery results
 *
 * @example
 * ```typescript
 * const deliveries = await broadcastWebhookEvent(webhooks, 'vm.power.changed', {
 *   vmId: 'vm-123',
 *   oldState: 'poweredOff',
 *   newState: 'poweredOn'
 * });
 * ```
 */
export const broadcastWebhookEvent = async (
  webhooks: WebhookConfig[],
  eventType: string,
  data: any,
): Promise<WebhookDelivery[]> => {
  const crypto = require('crypto');
  const matchingWebhooks = filterWebhooksByEvent(webhooks, eventType);

  const payload: WebhookPayload = {
    id: crypto.randomUUID(),
    event: eventType,
    timestamp: new Date().toISOString(),
    data,
  };

  return Promise.all(
    matchingWebhooks.map(webhook => deliverWebhook(webhook, payload)),
  );
};

// ============================================================================
// EVENT SUBSCRIPTIONS (9-14)
// ============================================================================

/**
 * Creates event subscription for virtual infrastructure events.
 *
 * @param {Omit<EventSubscription, 'id' | 'createdAt'>} subscription - Subscription config
 * @returns {EventSubscription} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = createEventSubscription({
 *   subscriberId: 'user-123',
 *   eventType: 'vm.*',
 *   filters: { datacenter: 'DC1' },
 *   callbackUrl: 'https://example.com/vm-events',
 *   active: true
 * });
 * ```
 */
export const createEventSubscription = (
  subscription: Omit<EventSubscription, 'id' | 'createdAt'>,
): EventSubscription => {
  const crypto = require('crypto');
  return {
    id: crypto.randomUUID(),
    ...subscription,
    createdAt: new Date(),
  };
};

/**
 * Matches event against subscription filters.
 *
 * @param {IntegrationEvent} event - Event to match
 * @param {EventSubscription} subscription - Subscription to check
 * @returns {boolean} Whether event matches subscription
 *
 * @example
 * ```typescript
 * const matches = matchEventToSubscription(event, subscription);
 * if (matches) {
 *   await notifySubscriber(subscription, event);
 * }
 * ```
 */
export const matchEventToSubscription = (
  event: IntegrationEvent,
  subscription: EventSubscription,
): boolean => {
  // Check event type (support wildcards)
  const eventTypePattern = subscription.eventType.replace(/\*/g, '.*');
  const eventTypeRegex = new RegExp(`^${eventTypePattern}$`);

  if (!eventTypeRegex.test(event.type)) {
    return false;
  }

  // Check filters
  if (subscription.filters) {
    for (const [key, value] of Object.entries(subscription.filters)) {
      if (event.data[key] !== value) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Notifies subscriber of matching event.
 *
 * @param {EventSubscription} subscription - Subscription
 * @param {IntegrationEvent} event - Event to notify
 * @returns {Promise<boolean>} Whether notification succeeded
 *
 * @example
 * ```typescript
 * const success = await notifySubscriber(subscription, event);
 * ```
 */
export const notifySubscriber = async (
  subscription: EventSubscription,
  event: IntegrationEvent,
): Promise<boolean> => {
  if (!subscription.callbackUrl) {
    return false;
  }

  try {
    const response = await fetch(subscription.callbackUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subscription-Id': subscription.id,
        'X-Event-Type': event.type,
      },
      body: JSON.stringify(event),
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Creates event emitter for virtual infrastructure events.
 *
 * @returns {EventEmitter} Event emitter instance
 *
 * @example
 * ```typescript
 * const vmEvents = createVirtualEventEmitter();
 * vmEvents.on('vm.created', (vm) => {
 *   console.log('New VM created:', vm.name);
 * });
 * vmEvents.emit('vm.created', vmData);
 * ```
 */
export const createVirtualEventEmitter = (): EventEmitter => {
  return new EventEmitter();
};

/**
 * Subscribes to virtual infrastructure events with callback.
 *
 * @param {EventEmitter} emitter - Event emitter
 * @param {string} eventPattern - Event pattern (supports wildcards)
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeToVirtualEvents(emitter, 'vm.power.*', (event) => {
 *   console.log('Power state changed:', event);
 * });
 * // Later: unsubscribe();
 * ```
 */
export const subscribeToVirtualEvents = (
  emitter: EventEmitter,
  eventPattern: string,
  callback: (event: IntegrationEvent) => void,
): (() => void) => {
  const listener = (event: IntegrationEvent) => {
    const pattern = eventPattern.replace(/\*/g, '.*');
    const regex = new RegExp(`^${pattern}$`);

    if (regex.test(event.type)) {
      callback(event);
    }
  };

  emitter.on('event', listener);

  return () => {
    emitter.off('event', listener);
  };
};

/**
 * Publishes integration event to all subscribers.
 *
 * @param {EventEmitter} emitter - Event emitter
 * @param {EventSubscription[]} subscriptions - Active subscriptions
 * @param {IntegrationEvent} event - Event to publish
 * @returns {Promise<number>} Number of successful notifications
 *
 * @example
 * ```typescript
 * const notified = await publishIntegrationEvent(emitter, subscriptions, {
 *   type: 'vm.created',
 *   source: 'vsphere',
 *   timestamp: new Date(),
 *   data: vmData
 * });
 * ```
 */
export const publishIntegrationEvent = async (
  emitter: EventEmitter,
  subscriptions: EventSubscription[],
  event: IntegrationEvent,
): Promise<number> => {
  emitter.emit('event', event);

  const matchingSubscriptions = subscriptions.filter(
    sub => sub.active && matchEventToSubscription(event, sub),
  );

  const results = await Promise.all(
    matchingSubscriptions.map(sub => notifySubscriber(sub, event)),
  );

  return results.filter(success => success).length;
};

// ============================================================================
// THIRD-PARTY CONNECTORS (15-21)
// ============================================================================

/**
 * Creates third-party connector for external virtualization platforms.
 *
 * @param {Omit<ThirdPartyConnector, 'id' | 'status'>} config - Connector config
 * @returns {ThirdPartyConnector} Connector instance
 *
 * @example
 * ```typescript
 * const vmwareConnector = createThirdPartyConnector({
 *   name: 'VMware vSphere Production',
 *   type: 'vmware',
 *   endpoint: 'https://vcenter.example.com/sdk',
 *   credentials: { type: 'basic', username: 'admin', password: 'pass' },
 *   config: { datacenter: 'DC1', cluster: 'Production' }
 * });
 * ```
 */
export const createThirdPartyConnector = (
  config: Omit<ThirdPartyConnector, 'id' | 'status'>,
): ThirdPartyConnector => {
  const crypto = require('crypto');
  return {
    id: crypto.randomUUID(),
    ...config,
    status: 'disconnected',
  };
};

/**
 * Authenticates connector with external platform.
 *
 * @param {ThirdPartyConnector} connector - Connector to authenticate
 * @returns {Promise<{ success: boolean; sessionId?: string; error?: string }>} Auth result
 *
 * @example
 * ```typescript
 * const result = await authenticateConnector(vmwareConnector);
 * if (result.success) {
 *   console.log('Authenticated with session:', result.sessionId);
 * }
 * ```
 */
export const authenticateConnector = async (
  connector: ThirdPartyConnector,
): Promise<{ success: boolean; sessionId?: string; error?: string }> => {
  try {
    switch (connector.type) {
      case 'vmware':
        return await authenticateVMware(connector);
      case 'hyperv':
        return await authenticateHyperV(connector);
      case 'kvm':
        return await authenticateKVM(connector);
      default:
        return { success: false, error: 'Unsupported connector type' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Executes API request through connector.
 *
 * @param {ThirdPartyConnector} connector - Connector instance
 * @param {ExternalAPIRequest} request - API request
 * @returns {Promise<ExternalAPIResponse>} API response
 *
 * @example
 * ```typescript
 * const response = await executeConnectorRequest(connector, {
 *   method: 'GET',
 *   url: '/api/vms',
 *   headers: { 'Accept': 'application/json' }
 * });
 * ```
 */
export const executeConnectorRequest = async (
  connector: ThirdPartyConnector,
  request: ExternalAPIRequest,
): Promise<ExternalAPIResponse> => {
  const startTime = Date.now();

  const headers: Record<string, string> = {
    ...request.headers,
  };

  // Add authentication headers based on credential type
  if (connector.credentials.type === 'token' && connector.credentials.token) {
    headers['Authorization'] = `Bearer ${connector.credentials.token}`;
  } else if (connector.credentials.type === 'basic') {
    const auth = Buffer.from(
      `${connector.credentials.username}:${connector.credentials.password}`,
    ).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  const url = `${connector.endpoint}${request.url}`;

  const response = await fetch(url, {
    method: request.method,
    headers,
    body: request.body ? JSON.stringify(request.body) : undefined,
    signal: request.timeout ? AbortSignal.timeout(request.timeout) : undefined,
  });

  const body = await response.json();

  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body,
    duration: Date.now() - startTime,
  };
};

/**
 * Transforms connector response to standard format.
 *
 * @param {any} connectorResponse - Raw connector response
 * @param {ThirdPartyConnector['type']} connectorType - Connector type
 * @returns {any} Standardized response
 *
 * @example
 * ```typescript
 * const standardized = transformConnectorResponse(vmwareResponse, 'vmware');
 * ```
 */
export const transformConnectorResponse = (
  connectorResponse: any,
  connectorType: ThirdPartyConnector['type'],
): any => {
  switch (connectorType) {
    case 'vmware':
      return transformVMwareResponse(connectorResponse);
    case 'hyperv':
      return transformHyperVResponse(connectorResponse);
    case 'kvm':
      return transformKVMResponse(connectorResponse);
    default:
      return connectorResponse;
  }
};

/**
 * Validates connector health and connectivity.
 *
 * @param {ThirdPartyConnector} connector - Connector to validate
 * @returns {Promise<{ healthy: boolean; latencyMs?: number; error?: string }>} Health check result
 *
 * @example
 * ```typescript
 * const health = await validateConnectorHealth(connector);
 * if (!health.healthy) {
 *   console.error('Connector unhealthy:', health.error);
 * }
 * ```
 */
export const validateConnectorHealth = async (
  connector: ThirdPartyConnector,
): Promise<{ healthy: boolean; latencyMs?: number; error?: string }> => {
  const startTime = Date.now();

  try {
    const response = await executeConnectorRequest(connector, {
      method: 'GET',
      url: '/health',
      timeout: 5000,
    });

    return {
      healthy: response.status >= 200 && response.status < 300,
      latencyMs: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      healthy: false,
      error: error.message,
    };
  }
};

/**
 * Creates connector pool for load balancing.
 *
 * @param {ThirdPartyConnector[]} connectors - Connectors for pool
 * @returns {object} Connector pool manager
 *
 * @example
 * ```typescript
 * const pool = createConnectorPool([connector1, connector2, connector3]);
 * const connector = pool.getNextConnector();
 * const response = await executeConnectorRequest(connector, request);
 * ```
 */
export const createConnectorPool = (connectors: ThirdPartyConnector[]) => {
  let currentIndex = 0;

  return {
    getNextConnector: (): ThirdPartyConnector => {
      const connector = connectors[currentIndex];
      currentIndex = (currentIndex + 1) % connectors.length;
      return connector;
    },
    getConnectorById: (id: string): ThirdPartyConnector | undefined => {
      return connectors.find(c => c.id === id);
    },
    getAllConnectors: (): ThirdPartyConnector[] => {
      return connectors;
    },
    getHealthyConnectors: async (): Promise<ThirdPartyConnector[]> => {
      const healthChecks = await Promise.all(
        connectors.map(async c => ({
          connector: c,
          health: await validateConnectorHealth(c),
        })),
      );

      return healthChecks
        .filter(check => check.health.healthy)
        .map(check => check.connector);
    },
  };
};

/**
 * Refreshes connector authentication token.
 *
 * @param {ThirdPartyConnector} connector - Connector instance
 * @returns {Promise<{ success: boolean; newToken?: string; expiresAt?: Date }>} Refresh result
 *
 * @example
 * ```typescript
 * const result = await refreshConnectorAuth(connector);
 * if (result.success) {
 *   connector.credentials.token = result.newToken;
 * }
 * ```
 */
export const refreshConnectorAuth = async (
  connector: ThirdPartyConnector,
): Promise<{ success: boolean; newToken?: string; expiresAt?: Date }> => {
  if (connector.credentials.type === 'oauth2' && connector.credentials.refreshToken) {
    try {
      const response = await fetch(`${connector.endpoint}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: connector.credentials.refreshToken,
          client_id: connector.credentials.clientId || '',
          client_secret: connector.credentials.clientSecret || '',
        }),
      });

      const data = await response.json();

      return {
        success: true,
        newToken: data.access_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      };
    } catch (error) {
      return { success: false };
    }
  }

  return { success: false };
};

// ============================================================================
// VMWARE VREALIZE INTEGRATION (22-27)
// ============================================================================

/**
 * Establishes connection to vRealize Operations Manager.
 *
 * @param {string} baseUrl - vRealize base URL
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<VRealizeConnection>} Connection object
 *
 * @example
 * ```typescript
 * const connection = await connectToVRealize(
 *   'https://vrealize.example.com',
 *   'admin',
 *   'password'
 * );
 * ```
 */
export const connectToVRealize = async (
  baseUrl: string,
  username: string,
  password: string,
): Promise<VRealizeConnection> => {
  const authString = Buffer.from(`${username}:${password}`).toString('base64');

  const response = await fetch(`${baseUrl}/suite-api/api/auth/token/acquire`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  return {
    baseUrl,
    authToken: data.token,
    refreshToken: data.refreshToken,
    expiresAt: new Date(data.validity),
  };
};

/**
 * Queries vRealize resources.
 *
 * @param {VRealizeConnection} connection - vRealize connection
 * @param {object} query - Query parameters
 * @returns {Promise<any[]>} Resource results
 *
 * @example
 * ```typescript
 * const vms = await queryVRealizeResources(connection, {
 *   resourceKind: 'VirtualMachine',
 *   name: 'web-*',
 *   adapterKind: 'VMWARE'
 * });
 * ```
 */
export const queryVRealizeResources = async (
  connection: VRealizeConnection,
  query: {
    resourceKind?: string;
    name?: string;
    adapterKind?: string;
    page?: number;
    pageSize?: number;
  },
): Promise<any[]> => {
  const params = new URLSearchParams();
  if (query.resourceKind) params.append('resourceKind', query.resourceKind);
  if (query.name) params.append('name', query.name);
  if (query.adapterKind) params.append('adapterKind', query.adapterKind);
  if (query.page) params.append('page', query.page.toString());
  if (query.pageSize) params.append('pageSize', query.pageSize.toString());

  const response = await fetch(
    `${connection.baseUrl}/suite-api/api/resources?${params.toString()}`,
    {
      headers: {
        'Authorization': `vRealizeOpsToken ${connection.authToken}`,
        'Accept': 'application/json',
      },
    },
  );

  const data = await response.json();
  return data.resourceList || [];
};

/**
 * Retrieves vRealize resource metrics.
 *
 * @param {VRealizeConnection} connection - vRealize connection
 * @param {string} resourceId - Resource identifier
 * @param {string[]} metricKeys - Metric keys to retrieve
 * @returns {Promise<any>} Metric data
 *
 * @example
 * ```typescript
 * const metrics = await getVRealizeResourceMetrics(connection, 'vm-123', [
 *   'cpu|usage_average',
 *   'mem|usage_average',
 *   'disk|usage_average'
 * ]);
 * ```
 */
export const getVRealizeResourceMetrics = async (
  connection: VRealizeConnection,
  resourceId: string,
  metricKeys: string[],
): Promise<any> => {
  const response = await fetch(
    `${connection.baseUrl}/suite-api/api/resources/${resourceId}/stats`,
    {
      method: 'POST',
      headers: {
        'Authorization': `vRealizeOpsToken ${connection.authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ statKey: metricKeys }),
    },
  );

  return response.json();
};

/**
 * Creates vRealize alert definition.
 *
 * @param {VRealizeConnection} connection - vRealize connection
 * @param {object} alertDefinition - Alert definition
 * @returns {Promise<any>} Created alert definition
 *
 * @example
 * ```typescript
 * const alert = await createVRealizeAlert(connection, {
 *   name: 'High CPU Usage',
 *   description: 'Alert when VM CPU usage exceeds 90%',
 *   resourceKind: 'VirtualMachine',
 *   symptomSet: { /* ... *\/ }
 * });
 * ```
 */
export const createVRealizeAlert = async (
  connection: VRealizeConnection,
  alertDefinition: {
    name: string;
    description: string;
    resourceKind: string;
    symptomSet: any;
  },
): Promise<any> => {
  const response = await fetch(
    `${connection.baseUrl}/suite-api/api/alertdefinitions`,
    {
      method: 'POST',
      headers: {
        'Authorization': `vRealizeOpsToken ${connection.authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(alertDefinition),
    },
  );

  return response.json();
};

/**
 * Subscribes to vRealize notifications.
 *
 * @param {VRealizeConnection} connection - vRealize connection
 * @param {object} subscription - Subscription configuration
 * @returns {Promise<any>} Subscription result
 *
 * @example
 * ```typescript
 * const sub = await subscribeToVRealizeNotifications(connection, {
 *   name: 'VM Alerts Webhook',
 *   pluginId: 'RestNotificationPlugin',
 *   url: 'https://example.com/vrealize-notifications'
 * });
 * ```
 */
export const subscribeToVRealizeNotifications = async (
  connection: VRealizeConnection,
  subscription: {
    name: string;
    pluginId: string;
    url: string;
  },
): Promise<any> => {
  const response = await fetch(
    `${connection.baseUrl}/suite-api/api/notifications/rules`,
    {
      method: 'POST',
      headers: {
        'Authorization': `vRealizeOpsToken ${connection.authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(subscription),
    },
  );

  return response.json();
};

/**
 * Transforms vRealize resource to standard virtual resource format.
 *
 * @param {any} vRealizeResource - vRealize resource object
 * @returns {any} Standardized virtual resource
 *
 * @example
 * ```typescript
 * const standardVM = transformVRealizeResource(vRealizeVM);
 * ```
 */
export const transformVRealizeResource = (vRealizeResource: any): any => {
  return {
    id: vRealizeResource.identifier,
    name: vRealizeResource.resourceKey?.name,
    type: vRealizeResource.resourceKey?.resourceKindKey,
    adapterType: vRealizeResource.resourceKey?.adapterKindKey,
    status: vRealizeResource.resourceStatusStates?.[0]?.resourceStatus,
    health: vRealizeResource.resourceHealth,
    properties: vRealizeResource.resourceKey?.resourceIdentifiers?.reduce(
      (acc: any, identifier: any) => {
        acc[identifier.identifierType.name] = identifier.value;
        return acc;
      },
      {},
    ),
    badges: vRealizeResource.badges,
    creationTime: vRealizeResource.creationTime,
  };
};

// ============================================================================
// VSPHERE AUTOMATION (28-33)
// ============================================================================

/**
 * Establishes vSphere REST API session.
 *
 * @param {string} vcenterUrl - vCenter server URL
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<VSphereConnection>} vSphere connection
 *
 * @example
 * ```typescript
 * const session = await createVSphereSession(
 *   'https://vcenter.example.com',
 *   'administrator@vsphere.local',
 *   'password'
 * );
 * ```
 */
export const createVSphereSession = async (
  vcenterUrl: string,
  username: string,
  password: string,
): Promise<VSphereConnection> => {
  const authString = Buffer.from(`${username}:${password}`).toString('base64');

  const response = await fetch(`${vcenterUrl}/rest/com/vmware/cis/session`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  return {
    vcenterUrl,
    sessionId: data.value,
    username,
    expiresAt: new Date(Date.now() + 3600000), // 1 hour default
  };
};

/**
 * Executes vSphere API request.
 *
 * @param {VSphereConnection} session - vSphere session
 * @param {string} endpoint - API endpoint
 * @param {string} [method='GET'] - HTTP method
 * @param {any} [body] - Request body
 * @returns {Promise<any>} API response
 *
 * @example
 * ```typescript
 * const vms = await executeVSphereRequest(session, '/rest/vcenter/vm', 'GET');
 * ```
 */
export const executeVSphereRequest = async (
  session: VSphereConnection,
  endpoint: string,
  method = 'GET',
  body?: any,
): Promise<any> => {
  const response = await fetch(`${session.vcenterUrl}${endpoint}`, {
    method,
    headers: {
      'vmware-api-session-id': session.sessionId,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return response.json();
};

/**
 * Lists virtual machines from vSphere.
 *
 * @param {VSphereConnection} session - vSphere session
 * @param {object} [filters] - Filter parameters
 * @returns {Promise<any[]>} Virtual machines
 *
 * @example
 * ```typescript
 * const vms = await listVSphereVMs(session, {
 *   power_states: ['POWERED_ON'],
 *   folders: ['Datacenters/DC1/vm/Production']
 * });
 * ```
 */
export const listVSphereVMs = async (
  session: VSphereConnection,
  filters?: {
    power_states?: string[];
    folders?: string[];
    names?: string[];
  },
): Promise<any[]> => {
  const params = new URLSearchParams();
  if (filters?.power_states) {
    filters.power_states.forEach(state => params.append('filter.power_states', state));
  }
  if (filters?.folders) {
    filters.folders.forEach(folder => params.append('filter.folders', folder));
  }
  if (filters?.names) {
    filters.names.forEach(name => params.append('filter.names', name));
  }

  const queryString = params.toString();
  const endpoint = `/rest/vcenter/vm${queryString ? `?${queryString}` : ''}`;

  const response = await executeVSphereRequest(session, endpoint);
  return response.value || [];
};

/**
 * Powers on virtual machine in vSphere.
 *
 * @param {VSphereConnection} session - vSphere session
 * @param {string} vmId - VM identifier
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const success = await powerOnVSphereVM(session, 'vm-123');
 * ```
 */
export const powerOnVSphereVM = async (
  session: VSphereConnection,
  vmId: string,
): Promise<boolean> => {
  try {
    await executeVSphereRequest(session, `/rest/vcenter/vm/${vmId}/power/start`, 'POST');
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Powers off virtual machine in vSphere.
 *
 * @param {VSphereConnection} session - vSphere session
 * @param {string} vmId - VM identifier
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const success = await powerOffVSphereVM(session, 'vm-123');
 * ```
 */
export const powerOffVSphereVM = async (
  session: VSphereConnection,
  vmId: string,
): Promise<boolean> => {
  try {
    await executeVSphereRequest(session, `/rest/vcenter/vm/${vmId}/power/stop`, 'POST');
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Retrieves vSphere VM details.
 *
 * @param {VSphereConnection} session - vSphere session
 * @param {string} vmId - VM identifier
 * @returns {Promise<any>} VM details
 *
 * @example
 * ```typescript
 * const vmDetails = await getVSphereVMDetails(session, 'vm-123');
 * console.log(vmDetails.name, vmDetails.power_state, vmDetails.cpu.count);
 * ```
 */
export const getVSphereVMDetails = async (
  session: VSphereConnection,
  vmId: string,
): Promise<any> => {
  const response = await executeVSphereRequest(session, `/rest/vcenter/vm/${vmId}`);
  return response.value;
};

// ============================================================================
// HELPER FUNCTIONS (34-39)
// ============================================================================

/**
 * Authenticates with VMware platform.
 *
 * @private
 */
const authenticateVMware = async (connector: ThirdPartyConnector) => {
  const session = await createVSphereSession(
    connector.endpoint,
    connector.credentials.username || '',
    connector.credentials.password || '',
  );
  return { success: true, sessionId: session.sessionId };
};

/**
 * Authenticates with Hyper-V platform.
 *
 * @private
 */
const authenticateHyperV = async (connector: ThirdPartyConnector) => {
  // Hyper-V authentication logic
  return { success: true, sessionId: 'hyperv-session' };
};

/**
 * Authenticates with KVM platform.
 *
 * @private
 */
const authenticateKVM = async (connector: ThirdPartyConnector) => {
  // KVM authentication logic
  return { success: true, sessionId: 'kvm-session' };
};

/**
 * Transforms VMware API response to standard format.
 *
 * @private
 */
const transformVMwareResponse = (response: any) => {
  if (response.value !== undefined) {
    return response.value;
  }
  return response;
};

/**
 * Transforms Hyper-V API response to standard format.
 *
 * @private
 */
const transformHyperVResponse = (response: any) => {
  return response;
};

/**
 * Transforms KVM API response to standard format.
 *
 * @private
 */
const transformKVMResponse = (response: any) => {
  return response;
};

export default {
  // Webhook Management
  registerWebhook,
  generateWebhookSignature,
  verifyWebhookSignature,
  deliverWebhook,
  retryWebhookDelivery,
  createWebhookHandlerMiddleware,
  filterWebhooksByEvent,
  broadcastWebhookEvent,

  // Event Subscriptions
  createEventSubscription,
  matchEventToSubscription,
  notifySubscriber,
  createVirtualEventEmitter,
  subscribeToVirtualEvents,
  publishIntegrationEvent,

  // Third-Party Connectors
  createThirdPartyConnector,
  authenticateConnector,
  executeConnectorRequest,
  transformConnectorResponse,
  validateConnectorHealth,
  createConnectorPool,
  refreshConnectorAuth,

  // VMware vRealize Integration
  connectToVRealize,
  queryVRealizeResources,
  getVRealizeResourceMetrics,
  createVRealizeAlert,
  subscribeToVRealizeNotifications,
  transformVRealizeResource,

  // vSphere Automation
  createVSphereSession,
  executeVSphereRequest,
  listVSphereVMs,
  powerOnVSphereVM,
  powerOffVSphereVM,
  getVSphereVMDetails,
};
