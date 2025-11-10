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
interface IntegrationEvent {
    type: string;
    source: string;
    timestamp: Date;
    data: any;
    correlationId?: string;
}
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
export declare const registerWebhook: (config: Omit<WebhookConfig, "id" | "createdAt">) => WebhookConfig;
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
export declare const generateWebhookSignature: (payload: WebhookPayload, secret: string) => string;
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
export declare const verifyWebhookSignature: (receivedSignature: string, payload: WebhookPayload, secret: string) => boolean;
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
export declare const deliverWebhook: (webhook: WebhookConfig, payload: WebhookPayload) => Promise<WebhookDelivery>;
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
export declare const retryWebhookDelivery: (webhook: WebhookConfig, previousDelivery: WebhookDelivery) => Promise<WebhookDelivery>;
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
export declare const createWebhookHandlerMiddleware: (webhooks: WebhookConfig[]) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
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
export declare const filterWebhooksByEvent: (webhooks: WebhookConfig[], eventType: string) => WebhookConfig[];
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
export declare const broadcastWebhookEvent: (webhooks: WebhookConfig[], eventType: string, data: any) => Promise<WebhookDelivery[]>;
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
export declare const createEventSubscription: (subscription: Omit<EventSubscription, "id" | "createdAt">) => EventSubscription;
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
export declare const matchEventToSubscription: (event: IntegrationEvent, subscription: EventSubscription) => boolean;
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
export declare const notifySubscriber: (subscription: EventSubscription, event: IntegrationEvent) => Promise<boolean>;
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
export declare const createVirtualEventEmitter: () => EventEmitter;
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
export declare const subscribeToVirtualEvents: (emitter: EventEmitter, eventPattern: string, callback: (event: IntegrationEvent) => void) => (() => void);
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
export declare const publishIntegrationEvent: (emitter: EventEmitter, subscriptions: EventSubscription[], event: IntegrationEvent) => Promise<number>;
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
export declare const createThirdPartyConnector: (config: Omit<ThirdPartyConnector, "id" | "status">) => ThirdPartyConnector;
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
export declare const authenticateConnector: (connector: ThirdPartyConnector) => Promise<{
    success: boolean;
    sessionId?: string;
    error?: string;
}>;
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
export declare const executeConnectorRequest: (connector: ThirdPartyConnector, request: ExternalAPIRequest) => Promise<ExternalAPIResponse>;
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
export declare const transformConnectorResponse: (connectorResponse: any, connectorType: ThirdPartyConnector["type"]) => any;
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
export declare const validateConnectorHealth: (connector: ThirdPartyConnector) => Promise<{
    healthy: boolean;
    latencyMs?: number;
    error?: string;
}>;
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
export declare const createConnectorPool: (connectors: ThirdPartyConnector[]) => {
    getNextConnector: () => ThirdPartyConnector;
    getConnectorById: (id: string) => ThirdPartyConnector | undefined;
    getAllConnectors: () => ThirdPartyConnector[];
    getHealthyConnectors: () => Promise<ThirdPartyConnector[]>;
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
export declare const refreshConnectorAuth: (connector: ThirdPartyConnector) => Promise<{
    success: boolean;
    newToken?: string;
    expiresAt?: Date;
}>;
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
export declare const connectToVRealize: (baseUrl: string, username: string, password: string) => Promise<VRealizeConnection>;
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
export declare const queryVRealizeResources: (connection: VRealizeConnection, query: {
    resourceKind?: string;
    name?: string;
    adapterKind?: string;
    page?: number;
    pageSize?: number;
}) => Promise<any[]>;
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
export declare const getVRealizeResourceMetrics: (connection: VRealizeConnection, resourceId: string, metricKeys: string[]) => Promise<any>;
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
export declare const createVRealizeAlert: (connection: VRealizeConnection, alertDefinition: {
    name: string;
    description: string;
    resourceKind: string;
    symptomSet: any;
}) => Promise<any>;
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
export declare const subscribeToVRealizeNotifications: (connection: VRealizeConnection, subscription: {
    name: string;
    pluginId: string;
    url: string;
}) => Promise<any>;
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
export declare const transformVRealizeResource: (vRealizeResource: any) => any;
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
export declare const createVSphereSession: (vcenterUrl: string, username: string, password: string) => Promise<VSphereConnection>;
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
export declare const executeVSphereRequest: (session: VSphereConnection, endpoint: string, method?: string, body?: any) => Promise<any>;
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
export declare const listVSphereVMs: (session: VSphereConnection, filters?: {
    power_states?: string[];
    folders?: string[];
    names?: string[];
}) => Promise<any[]>;
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
export declare const powerOnVSphereVM: (session: VSphereConnection, vmId: string) => Promise<boolean>;
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
export declare const powerOffVSphereVM: (session: VSphereConnection, vmId: string) => Promise<boolean>;
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
export declare const getVSphereVMDetails: (session: VSphereConnection, vmId: string) => Promise<any>;
declare const _default: {
    registerWebhook: (config: Omit<WebhookConfig, "id" | "createdAt">) => WebhookConfig;
    generateWebhookSignature: (payload: WebhookPayload, secret: string) => string;
    verifyWebhookSignature: (receivedSignature: string, payload: WebhookPayload, secret: string) => boolean;
    deliverWebhook: (webhook: WebhookConfig, payload: WebhookPayload) => Promise<WebhookDelivery>;
    retryWebhookDelivery: (webhook: WebhookConfig, previousDelivery: WebhookDelivery) => Promise<WebhookDelivery>;
    createWebhookHandlerMiddleware: (webhooks: WebhookConfig[]) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    filterWebhooksByEvent: (webhooks: WebhookConfig[], eventType: string) => WebhookConfig[];
    broadcastWebhookEvent: (webhooks: WebhookConfig[], eventType: string, data: any) => Promise<WebhookDelivery[]>;
    createEventSubscription: (subscription: Omit<EventSubscription, "id" | "createdAt">) => EventSubscription;
    matchEventToSubscription: (event: IntegrationEvent, subscription: EventSubscription) => boolean;
    notifySubscriber: (subscription: EventSubscription, event: IntegrationEvent) => Promise<boolean>;
    createVirtualEventEmitter: () => EventEmitter;
    subscribeToVirtualEvents: (emitter: EventEmitter, eventPattern: string, callback: (event: IntegrationEvent) => void) => (() => void);
    publishIntegrationEvent: (emitter: EventEmitter, subscriptions: EventSubscription[], event: IntegrationEvent) => Promise<number>;
    createThirdPartyConnector: (config: Omit<ThirdPartyConnector, "id" | "status">) => ThirdPartyConnector;
    authenticateConnector: (connector: ThirdPartyConnector) => Promise<{
        success: boolean;
        sessionId?: string;
        error?: string;
    }>;
    executeConnectorRequest: (connector: ThirdPartyConnector, request: ExternalAPIRequest) => Promise<ExternalAPIResponse>;
    transformConnectorResponse: (connectorResponse: any, connectorType: ThirdPartyConnector["type"]) => any;
    validateConnectorHealth: (connector: ThirdPartyConnector) => Promise<{
        healthy: boolean;
        latencyMs?: number;
        error?: string;
    }>;
    createConnectorPool: (connectors: ThirdPartyConnector[]) => {
        getNextConnector: () => ThirdPartyConnector;
        getConnectorById: (id: string) => ThirdPartyConnector | undefined;
        getAllConnectors: () => ThirdPartyConnector[];
        getHealthyConnectors: () => Promise<ThirdPartyConnector[]>;
    };
    refreshConnectorAuth: (connector: ThirdPartyConnector) => Promise<{
        success: boolean;
        newToken?: string;
        expiresAt?: Date;
    }>;
    connectToVRealize: (baseUrl: string, username: string, password: string) => Promise<VRealizeConnection>;
    queryVRealizeResources: (connection: VRealizeConnection, query: {
        resourceKind?: string;
        name?: string;
        adapterKind?: string;
        page?: number;
        pageSize?: number;
    }) => Promise<any[]>;
    getVRealizeResourceMetrics: (connection: VRealizeConnection, resourceId: string, metricKeys: string[]) => Promise<any>;
    createVRealizeAlert: (connection: VRealizeConnection, alertDefinition: {
        name: string;
        description: string;
        resourceKind: string;
        symptomSet: any;
    }) => Promise<any>;
    subscribeToVRealizeNotifications: (connection: VRealizeConnection, subscription: {
        name: string;
        pluginId: string;
        url: string;
    }) => Promise<any>;
    transformVRealizeResource: (vRealizeResource: any) => any;
    createVSphereSession: (vcenterUrl: string, username: string, password: string) => Promise<VSphereConnection>;
    executeVSphereRequest: (session: VSphereConnection, endpoint: string, method?: string, body?: any) => Promise<any>;
    listVSphereVMs: (session: VSphereConnection, filters?: {
        power_states?: string[];
        folders?: string[];
        names?: string[];
    }) => Promise<any[]>;
    powerOnVSphereVM: (session: VSphereConnection, vmId: string) => Promise<boolean>;
    powerOffVSphereVM: (session: VSphereConnection, vmId: string) => Promise<boolean>;
    getVSphereVMDetails: (session: VSphereConnection, vmId: string) => Promise<any>;
};
export default _default;
//# sourceMappingURL=virtual-api-integration-kit.d.ts.map