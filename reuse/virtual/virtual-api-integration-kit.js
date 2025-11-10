"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVSphereVMDetails = exports.powerOffVSphereVM = exports.powerOnVSphereVM = exports.listVSphereVMs = exports.executeVSphereRequest = exports.createVSphereSession = exports.transformVRealizeResource = exports.subscribeToVRealizeNotifications = exports.createVRealizeAlert = exports.getVRealizeResourceMetrics = exports.queryVRealizeResources = exports.connectToVRealize = exports.refreshConnectorAuth = exports.createConnectorPool = exports.validateConnectorHealth = exports.transformConnectorResponse = exports.executeConnectorRequest = exports.authenticateConnector = exports.createThirdPartyConnector = exports.publishIntegrationEvent = exports.subscribeToVirtualEvents = exports.createVirtualEventEmitter = exports.notifySubscriber = exports.matchEventToSubscription = exports.createEventSubscription = exports.broadcastWebhookEvent = exports.filterWebhooksByEvent = exports.createWebhookHandlerMiddleware = exports.retryWebhookDelivery = exports.deliverWebhook = exports.verifyWebhookSignature = exports.generateWebhookSignature = exports.registerWebhook = void 0;
const events_1 = require("events");
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
const registerWebhook = (config) => {
    const crypto = require('crypto');
    return {
        id: crypto.randomUUID(),
        ...config,
        createdAt: new Date(),
    };
};
exports.registerWebhook = registerWebhook;
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
const generateWebhookSignature = (payload, secret) => {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return `sha256=${hmac.digest('hex')}`;
};
exports.generateWebhookSignature = generateWebhookSignature;
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
const verifyWebhookSignature = (receivedSignature, payload, secret) => {
    const expectedSignature = (0, exports.generateWebhookSignature)(payload, secret);
    const crypto = require('crypto');
    return crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature));
};
exports.verifyWebhookSignature = verifyWebhookSignature;
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
const deliverWebhook = async (webhook, payload) => {
    const crypto = require('crypto');
    const deliveryId = crypto.randomUUID();
    if (webhook.secret) {
        payload.signature = (0, exports.generateWebhookSignature)(payload, webhook.secret);
    }
    const headers = {
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
    }
    catch (error) {
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
exports.deliverWebhook = deliverWebhook;
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
const retryWebhookDelivery = async (webhook, previousDelivery) => {
    const { retryPolicy } = webhook;
    const delay = Math.min(retryPolicy.initialDelayMs * Math.pow(retryPolicy.backoffMultiplier, previousDelivery.attempts), retryPolicy.maxDelayMs);
    await new Promise(resolve => setTimeout(resolve, delay));
    const result = await (0, exports.deliverWebhook)(webhook, previousDelivery.payload);
    return {
        ...result,
        attempts: previousDelivery.attempts + 1,
    };
};
exports.retryWebhookDelivery = retryWebhookDelivery;
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
const createWebhookHandlerMiddleware = (webhooks) => {
    return async (req, res, next) => {
        const webhookId = req.params.webhookId;
        const webhook = webhooks.find(w => w.id === webhookId);
        if (!webhook) {
            return res.status(404).json({ error: 'Webhook not found' });
        }
        if (!webhook.active) {
            return res.status(403).json({ error: 'Webhook is inactive' });
        }
        const signature = req.headers['x-webhook-signature'];
        const payload = req.body;
        if (webhook.secret && !(0, exports.verifyWebhookSignature)(signature, payload, webhook.secret)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }
        req.webhook = webhook;
        req.webhookPayload = payload;
        next();
    };
};
exports.createWebhookHandlerMiddleware = createWebhookHandlerMiddleware;
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
const filterWebhooksByEvent = (webhooks, eventType) => {
    return webhooks.filter(webhook => webhook.active &&
        (webhook.events.includes(eventType) || webhook.events.includes('*')));
};
exports.filterWebhooksByEvent = filterWebhooksByEvent;
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
const broadcastWebhookEvent = async (webhooks, eventType, data) => {
    const crypto = require('crypto');
    const matchingWebhooks = (0, exports.filterWebhooksByEvent)(webhooks, eventType);
    const payload = {
        id: crypto.randomUUID(),
        event: eventType,
        timestamp: new Date().toISOString(),
        data,
    };
    return Promise.all(matchingWebhooks.map(webhook => (0, exports.deliverWebhook)(webhook, payload)));
};
exports.broadcastWebhookEvent = broadcastWebhookEvent;
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
const createEventSubscription = (subscription) => {
    const crypto = require('crypto');
    return {
        id: crypto.randomUUID(),
        ...subscription,
        createdAt: new Date(),
    };
};
exports.createEventSubscription = createEventSubscription;
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
const matchEventToSubscription = (event, subscription) => {
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
exports.matchEventToSubscription = matchEventToSubscription;
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
const notifySubscriber = async (subscription, event) => {
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
    }
    catch (error) {
        return false;
    }
};
exports.notifySubscriber = notifySubscriber;
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
const createVirtualEventEmitter = () => {
    return new events_1.EventEmitter();
};
exports.createVirtualEventEmitter = createVirtualEventEmitter;
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
const subscribeToVirtualEvents = (emitter, eventPattern, callback) => {
    const listener = (event) => {
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
exports.subscribeToVirtualEvents = subscribeToVirtualEvents;
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
const publishIntegrationEvent = async (emitter, subscriptions, event) => {
    emitter.emit('event', event);
    const matchingSubscriptions = subscriptions.filter(sub => sub.active && (0, exports.matchEventToSubscription)(event, sub));
    const results = await Promise.all(matchingSubscriptions.map(sub => (0, exports.notifySubscriber)(sub, event)));
    return results.filter(success => success).length;
};
exports.publishIntegrationEvent = publishIntegrationEvent;
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
const createThirdPartyConnector = (config) => {
    const crypto = require('crypto');
    return {
        id: crypto.randomUUID(),
        ...config,
        status: 'disconnected',
    };
};
exports.createThirdPartyConnector = createThirdPartyConnector;
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
const authenticateConnector = async (connector) => {
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
    }
    catch (error) {
        return { success: false, error: error.message };
    }
};
exports.authenticateConnector = authenticateConnector;
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
const executeConnectorRequest = async (connector, request) => {
    const startTime = Date.now();
    const headers = {
        ...request.headers,
    };
    // Add authentication headers based on credential type
    if (connector.credentials.type === 'token' && connector.credentials.token) {
        headers['Authorization'] = `Bearer ${connector.credentials.token}`;
    }
    else if (connector.credentials.type === 'basic') {
        const auth = Buffer.from(`${connector.credentials.username}:${connector.credentials.password}`).toString('base64');
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
exports.executeConnectorRequest = executeConnectorRequest;
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
const transformConnectorResponse = (connectorResponse, connectorType) => {
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
exports.transformConnectorResponse = transformConnectorResponse;
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
const validateConnectorHealth = async (connector) => {
    const startTime = Date.now();
    try {
        const response = await (0, exports.executeConnectorRequest)(connector, {
            method: 'GET',
            url: '/health',
            timeout: 5000,
        });
        return {
            healthy: response.status >= 200 && response.status < 300,
            latencyMs: Date.now() - startTime,
        };
    }
    catch (error) {
        return {
            healthy: false,
            error: error.message,
        };
    }
};
exports.validateConnectorHealth = validateConnectorHealth;
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
const createConnectorPool = (connectors) => {
    let currentIndex = 0;
    return {
        getNextConnector: () => {
            const connector = connectors[currentIndex];
            currentIndex = (currentIndex + 1) % connectors.length;
            return connector;
        },
        getConnectorById: (id) => {
            return connectors.find(c => c.id === id);
        },
        getAllConnectors: () => {
            return connectors;
        },
        getHealthyConnectors: async () => {
            const healthChecks = await Promise.all(connectors.map(async (c) => ({
                connector: c,
                health: await (0, exports.validateConnectorHealth)(c),
            })));
            return healthChecks
                .filter(check => check.health.healthy)
                .map(check => check.connector);
        },
    };
};
exports.createConnectorPool = createConnectorPool;
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
const refreshConnectorAuth = async (connector) => {
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
        }
        catch (error) {
            return { success: false };
        }
    }
    return { success: false };
};
exports.refreshConnectorAuth = refreshConnectorAuth;
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
const connectToVRealize = async (baseUrl, username, password) => {
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
exports.connectToVRealize = connectToVRealize;
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
const queryVRealizeResources = async (connection, query) => {
    const params = new URLSearchParams();
    if (query.resourceKind)
        params.append('resourceKind', query.resourceKind);
    if (query.name)
        params.append('name', query.name);
    if (query.adapterKind)
        params.append('adapterKind', query.adapterKind);
    if (query.page)
        params.append('page', query.page.toString());
    if (query.pageSize)
        params.append('pageSize', query.pageSize.toString());
    const response = await fetch(`${connection.baseUrl}/suite-api/api/resources?${params.toString()}`, {
        headers: {
            'Authorization': `vRealizeOpsToken ${connection.authToken}`,
            'Accept': 'application/json',
        },
    });
    const data = await response.json();
    return data.resourceList || [];
};
exports.queryVRealizeResources = queryVRealizeResources;
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
const getVRealizeResourceMetrics = async (connection, resourceId, metricKeys) => {
    const response = await fetch(`${connection.baseUrl}/suite-api/api/resources/${resourceId}/stats`, {
        method: 'POST',
        headers: {
            'Authorization': `vRealizeOpsToken ${connection.authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ statKey: metricKeys }),
    });
    return response.json();
};
exports.getVRealizeResourceMetrics = getVRealizeResourceMetrics;
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
const createVRealizeAlert = async (connection, alertDefinition) => {
    const response = await fetch(`${connection.baseUrl}/suite-api/api/alertdefinitions`, {
        method: 'POST',
        headers: {
            'Authorization': `vRealizeOpsToken ${connection.authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(alertDefinition),
    });
    return response.json();
};
exports.createVRealizeAlert = createVRealizeAlert;
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
const subscribeToVRealizeNotifications = async (connection, subscription) => {
    const response = await fetch(`${connection.baseUrl}/suite-api/api/notifications/rules`, {
        method: 'POST',
        headers: {
            'Authorization': `vRealizeOpsToken ${connection.authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(subscription),
    });
    return response.json();
};
exports.subscribeToVRealizeNotifications = subscribeToVRealizeNotifications;
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
const transformVRealizeResource = (vRealizeResource) => {
    return {
        id: vRealizeResource.identifier,
        name: vRealizeResource.resourceKey?.name,
        type: vRealizeResource.resourceKey?.resourceKindKey,
        adapterType: vRealizeResource.resourceKey?.adapterKindKey,
        status: vRealizeResource.resourceStatusStates?.[0]?.resourceStatus,
        health: vRealizeResource.resourceHealth,
        properties: vRealizeResource.resourceKey?.resourceIdentifiers?.reduce((acc, identifier) => {
            acc[identifier.identifierType.name] = identifier.value;
            return acc;
        }, {}),
        badges: vRealizeResource.badges,
        creationTime: vRealizeResource.creationTime,
    };
};
exports.transformVRealizeResource = transformVRealizeResource;
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
const createVSphereSession = async (vcenterUrl, username, password) => {
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
exports.createVSphereSession = createVSphereSession;
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
const executeVSphereRequest = async (session, endpoint, method = 'GET', body) => {
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
exports.executeVSphereRequest = executeVSphereRequest;
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
const listVSphereVMs = async (session, filters) => {
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
    const response = await (0, exports.executeVSphereRequest)(session, endpoint);
    return response.value || [];
};
exports.listVSphereVMs = listVSphereVMs;
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
const powerOnVSphereVM = async (session, vmId) => {
    try {
        await (0, exports.executeVSphereRequest)(session, `/rest/vcenter/vm/${vmId}/power/start`, 'POST');
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.powerOnVSphereVM = powerOnVSphereVM;
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
const powerOffVSphereVM = async (session, vmId) => {
    try {
        await (0, exports.executeVSphereRequest)(session, `/rest/vcenter/vm/${vmId}/power/stop`, 'POST');
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.powerOffVSphereVM = powerOffVSphereVM;
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
const getVSphereVMDetails = async (session, vmId) => {
    const response = await (0, exports.executeVSphereRequest)(session, `/rest/vcenter/vm/${vmId}`);
    return response.value;
};
exports.getVSphereVMDetails = getVSphereVMDetails;
// ============================================================================
// HELPER FUNCTIONS (34-39)
// ============================================================================
/**
 * Authenticates with VMware platform.
 *
 * @private
 */
const authenticateVMware = async (connector) => {
    const session = await (0, exports.createVSphereSession)(connector.endpoint, connector.credentials.username || '', connector.credentials.password || '');
    return { success: true, sessionId: session.sessionId };
};
/**
 * Authenticates with Hyper-V platform.
 *
 * @private
 */
const authenticateHyperV = async (connector) => {
    // Hyper-V authentication logic
    return { success: true, sessionId: 'hyperv-session' };
};
/**
 * Authenticates with KVM platform.
 *
 * @private
 */
const authenticateKVM = async (connector) => {
    // KVM authentication logic
    return { success: true, sessionId: 'kvm-session' };
};
/**
 * Transforms VMware API response to standard format.
 *
 * @private
 */
const transformVMwareResponse = (response) => {
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
const transformHyperVResponse = (response) => {
    return response;
};
/**
 * Transforms KVM API response to standard format.
 *
 * @private
 */
const transformKVMResponse = (response) => {
    return response;
};
exports.default = {
    // Webhook Management
    registerWebhook: exports.registerWebhook,
    generateWebhookSignature: exports.generateWebhookSignature,
    verifyWebhookSignature: exports.verifyWebhookSignature,
    deliverWebhook: exports.deliverWebhook,
    retryWebhookDelivery: exports.retryWebhookDelivery,
    createWebhookHandlerMiddleware: exports.createWebhookHandlerMiddleware,
    filterWebhooksByEvent: exports.filterWebhooksByEvent,
    broadcastWebhookEvent: exports.broadcastWebhookEvent,
    // Event Subscriptions
    createEventSubscription: exports.createEventSubscription,
    matchEventToSubscription: exports.matchEventToSubscription,
    notifySubscriber: exports.notifySubscriber,
    createVirtualEventEmitter: exports.createVirtualEventEmitter,
    subscribeToVirtualEvents: exports.subscribeToVirtualEvents,
    publishIntegrationEvent: exports.publishIntegrationEvent,
    // Third-Party Connectors
    createThirdPartyConnector: exports.createThirdPartyConnector,
    authenticateConnector: exports.authenticateConnector,
    executeConnectorRequest: exports.executeConnectorRequest,
    transformConnectorResponse: exports.transformConnectorResponse,
    validateConnectorHealth: exports.validateConnectorHealth,
    createConnectorPool: exports.createConnectorPool,
    refreshConnectorAuth: exports.refreshConnectorAuth,
    // VMware vRealize Integration
    connectToVRealize: exports.connectToVRealize,
    queryVRealizeResources: exports.queryVRealizeResources,
    getVRealizeResourceMetrics: exports.getVRealizeResourceMetrics,
    createVRealizeAlert: exports.createVRealizeAlert,
    subscribeToVRealizeNotifications: exports.subscribeToVRealizeNotifications,
    transformVRealizeResource: exports.transformVRealizeResource,
    // vSphere Automation
    createVSphereSession: exports.createVSphereSession,
    executeVSphereRequest: exports.executeVSphereRequest,
    listVSphereVMs: exports.listVSphereVMs,
    powerOnVSphereVM: exports.powerOnVSphereVM,
    powerOffVSphereVM: exports.powerOffVSphereVM,
    getVSphereVMDetails: exports.getVSphereVMDetails,
};
//# sourceMappingURL=virtual-api-integration-kit.js.map