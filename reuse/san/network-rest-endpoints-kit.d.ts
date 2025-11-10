/**
 * LOC: NETREST1234567
 * File: /reuse/san/network-rest-endpoints-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network REST controllers
 *   - NestJS network services
 *   - Network API handlers
 */
/**
 * File: /reuse/san/network-rest-endpoints-kit.ts
 * Locator: WC-SAN-NETREST-001
 * Purpose: Comprehensive Network REST Endpoints Utilities - resource endpoints, actions, batch operations, search, export, import, webhooks, callbacks
 *
 * Upstream: Independent utility module for network REST endpoint patterns
 * Downstream: ../backend/*, Network controllers, REST handlers, SAN services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Express 4.x, Sequelize 6.x
 * Exports: 40 utility functions for network REST endpoints, CRUD operations, batch processing, webhooks, callbacks
 *
 * LLM Context: Comprehensive network REST endpoint utilities for implementing production-ready RESTful APIs for enterprise virtual networks.
 * Provides resource endpoints, action endpoints, batch operations, search capabilities, export/import handlers, webhook management,
 * and callback patterns. Essential for complete network management API implementation.
 */
import { Request, Response, NextFunction } from 'express';
import { Sequelize } from 'sequelize';
interface BatchOperation<T> {
    operations: Array<{
        operation: 'create' | 'update' | 'delete';
        data: T;
        id?: string;
    }>;
    options?: {
        continueOnError?: boolean;
        validateOnly?: boolean;
        parallel?: boolean;
    };
}
interface BatchOperationResult<T> {
    results: Array<{
        success: boolean;
        data?: T;
        error?: string;
        index: number;
    }>;
    summary: {
        total: number;
        successful: number;
        failed: number;
        duration: number;
    };
}
interface SearchQuery {
    query: string;
    fields?: string[];
    filters?: Record<string, any>;
    fuzzy?: boolean;
    limit?: number;
    offset?: number;
}
interface SearchResult<T> {
    items: Array<{
        item: T;
        score: number;
        highlights?: Record<string, string[]>;
    }>;
    total: number;
    maxScore: number;
}
interface ExportOptions {
    format: 'json' | 'csv' | 'xml' | 'yaml';
    fields?: string[];
    filters?: Record<string, any>;
    includeMetadata?: boolean;
    compress?: boolean;
}
interface ImportOptions {
    format: 'json' | 'csv' | 'xml' | 'yaml';
    validateOnly?: boolean;
    updateExisting?: boolean;
    skipErrors?: boolean;
}
interface ImportResult {
    imported: number;
    updated: number;
    skipped: number;
    errors: Array<{
        line: number;
        error: string;
        data?: any;
    }>;
}
interface WebhookPayload {
    event: string;
    timestamp: string;
    data: any;
    signature?: string;
}
interface CallbackConfig {
    callbackUrl: string;
    method: 'POST' | 'PUT';
    headers?: Record<string, string>;
    timeout?: number;
}
interface BulkUpdateOperation {
    ids: string[];
    updates: Record<string, any>;
    conditions?: Record<string, any>;
}
/**
 * Sequelize model for Network resources.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Network model
 *
 * @example
 * ```typescript
 * const Network = createNetworkModel(sequelize);
 * const network = await Network.create({
 *   name: 'Production Network',
 *   cidr: '10.0.0.0/16',
 *   vlanId: 100,
 *   status: 'active'
 * });
 * ```
 */
export declare const createNetworkModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        name: string;
        cidr: string;
        vlanId: number | null;
        status: "active" | "inactive" | "pending" | "error";
        description: string | null;
        tags: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Network actions/operations log.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkAction model
 *
 * @example
 * ```typescript
 * const NetworkAction = createNetworkActionModel(sequelize);
 * const action = await NetworkAction.create({
 *   networkId: 'uuid-123',
 *   action: 'activate',
 *   initiatedBy: 'user@example.com',
 *   parameters: { force: true }
 * });
 * ```
 */
export declare const createNetworkActionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        networkId: string;
        action: string;
        initiatedBy: string;
        parameters: Record<string, any>;
        status: "pending" | "in_progress" | "completed" | "failed";
        result: Record<string, any> | null;
        error: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Webhook configurations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Webhook model
 *
 * @example
 * ```typescript
 * const Webhook = createWebhookModel(sequelize);
 * const webhook = await Webhook.create({
 *   url: 'https://example.com/webhook',
 *   events: ['network.created', 'network.updated'],
 *   secret: 'webhook-secret-key',
 *   active: true
 * });
 * ```
 */
export declare const createWebhookModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        url: string;
        events: string[];
        secret: string | null;
        active: boolean;
        retryPolicy: Record<string, any>;
        lastTriggeredAt: Date | null;
        failureCount: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a GET handler for fetching a single network resource.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/api/v1/networks/:id', createGetNetworkHandler(Network));
 * ```
 */
export declare const createGetNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Creates a GET handler for listing network resources with pagination.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/api/v1/networks', createListNetworksHandler(Network));
 * ```
 */
export declare const createListNetworksHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Creates a POST handler for creating a new network resource.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks', createCreateNetworkHandler(Network));
 * ```
 */
export declare const createCreateNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Creates a PUT handler for updating a network resource.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.put('/api/v1/networks/:id', createUpdateNetworkHandler(Network));
 * ```
 */
export declare const createUpdateNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Creates a PATCH handler for partial network resource updates.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.patch('/api/v1/networks/:id', createPatchNetworkHandler(Network));
 * ```
 */
export declare const createPatchNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Creates a DELETE handler for removing a network resource.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.delete('/api/v1/networks/:id', createDeleteNetworkHandler(Network));
 * ```
 */
export declare const createDeleteNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Creates a HEAD handler for checking network resource existence.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.head('/api/v1/networks/:id', createHeadNetworkHandler(Network));
 * ```
 */
export declare const createHeadNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Creates an OPTIONS handler for network resource endpoints.
 *
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.options('/api/v1/networks/:id', createOptionsNetworkHandler());
 * ```
 */
export declare const createOptionsNetworkHandler: () => (req: Request, res: Response) => void;
/**
 * Creates a POST handler for executing network actions.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @param {Model} NetworkActionModel - Sequelize NetworkAction model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/:id/actions/:action', createNetworkActionHandler(Network, NetworkAction));
 * ```
 */
export declare const createNetworkActionHandler: (NetworkModel: any, NetworkActionModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Creates a GET handler for retrieving network action status.
 *
 * @param {Model} NetworkActionModel - Sequelize NetworkAction model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/api/v1/networks/:id/actions/:actionId', createGetNetworkActionStatusHandler(NetworkAction));
 * ```
 */
export declare const createGetNetworkActionStatusHandler: (NetworkActionModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Creates a POST handler for activating a network.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/:id/activate', createActivateNetworkHandler(Network));
 * ```
 */
export declare const createActivateNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Creates a POST handler for deactivating a network.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/:id/deactivate', createDeactivateNetworkHandler(Network));
 * ```
 */
export declare const createDeactivateNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Creates a POST handler for validating network configuration.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/:id/validate', createValidateNetworkHandler(Network));
 * ```
 */
export declare const createValidateNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Executes batch operations on networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @param {BatchOperation<NetworkResource>} batch - Batch operation configuration
 * @returns {Promise<BatchOperationResult<NetworkResource>>} Batch operation results
 *
 * @example
 * ```typescript
 * const results = await executeBatchOperation(Network, {
 *   operations: [
 *     { operation: 'create', data: { name: 'Net1', cidr: '10.1.0.0/16' } },
 *     { operation: 'update', id: 'uuid-123', data: { status: 'active' } }
 *   ]
 * });
 * ```
 */
export declare const executeBatchOperation: <T>(NetworkModel: any, batch: BatchOperation<T>) => Promise<BatchOperationResult<T>>;
/**
 * Creates a POST handler for batch network operations.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/batch', createBatchNetworkHandler(Network));
 * ```
 */
export declare const createBatchNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Executes bulk update on multiple networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @param {BulkUpdateOperation} operation - Bulk update operation
 * @returns {Promise<{ updated: number; networks: any[] }>} Update results
 *
 * @example
 * ```typescript
 * const results = await executeBulkUpdate(Network, {
 *   ids: ['uuid-1', 'uuid-2', 'uuid-3'],
 *   updates: { status: 'active' }
 * });
 * ```
 */
export declare const executeBulkUpdate: (NetworkModel: any, operation: BulkUpdateOperation) => Promise<{
    updated: number;
    networks: any[];
}>;
/**
 * Creates a PUT handler for bulk network updates.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.put('/api/v1/networks/bulk', createBulkUpdateNetworkHandler(Network));
 * ```
 */
export declare const createBulkUpdateNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Performs full-text search on networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @param {SearchQuery} query - Search query
 * @returns {Promise<SearchResult<any>>} Search results
 *
 * @example
 * ```typescript
 * const results = await searchNetworks(Network, {
 *   query: 'production',
 *   fields: ['name', 'description'],
 *   limit: 20
 * });
 * ```
 */
export declare const searchNetworks: (NetworkModel: any, query: SearchQuery) => Promise<SearchResult<any>>;
/**
 * Creates a GET handler for network search.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/api/v1/networks/search', createSearchNetworksHandler(Network));
 * ```
 */
export declare const createSearchNetworksHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Creates a POST handler for advanced network search with filters.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/search', createAdvancedSearchNetworksHandler(Network));
 * ```
 */
export declare const createAdvancedSearchNetworksHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Exports networks in specified format.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @param {ExportOptions} options - Export options
 * @returns {Promise<string>} Exported data
 *
 * @example
 * ```typescript
 * const exported = await exportNetworks(Network, {
 *   format: 'csv',
 *   fields: ['id', 'name', 'cidr'],
 *   filters: { status: 'active' }
 * });
 * ```
 */
export declare const exportNetworks: (NetworkModel: any, options: ExportOptions) => Promise<string>;
/**
 * Creates a GET handler for exporting networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/api/v1/networks/export', createExportNetworksHandler(Network));
 * ```
 */
export declare const createExportNetworksHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Creates a POST handler for custom network export with filters.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/export', createCustomExportNetworksHandler(Network));
 * ```
 */
export declare const createCustomExportNetworksHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Imports networks from data.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @param {any[]} data - Import data array
 * @param {ImportOptions} options - Import options
 * @returns {Promise<ImportResult>} Import results
 *
 * @example
 * ```typescript
 * const results = await importNetworks(Network, networkData, {
 *   format: 'json',
 *   updateExisting: true,
 *   skipErrors: true
 * });
 * ```
 */
export declare const importNetworks: (NetworkModel: any, data: any[], options: ImportOptions) => Promise<ImportResult>;
/**
 * Creates a POST handler for importing networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/import', createImportNetworksHandler(Network));
 * ```
 */
export declare const createImportNetworksHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Parses CSV data for import.
 *
 * @param {string} csvData - CSV string data
 * @returns {any[]} Parsed data array
 *
 * @example
 * ```typescript
 * const data = parseCSVImport('id,name,cidr\n1,Net1,10.0.0.0/16');
 * // Result: [{ id: '1', name: 'Net1', cidr: '10.0.0.0/16' }]
 * ```
 */
export declare const parseCSVImport: (csvData: string) => any[];
/**
 * Creates a POST handler for registering webhooks.
 *
 * @param {Model} WebhookModel - Sequelize Webhook model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/webhooks', createRegisterWebhookHandler(Webhook));
 * ```
 */
export declare const createRegisterWebhookHandler: (WebhookModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Creates a DELETE handler for unregistering webhooks.
 *
 * @param {Model} WebhookModel - Sequelize Webhook model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.delete('/api/v1/webhooks/:id', createUnregisterWebhookHandler(Webhook));
 * ```
 */
export declare const createUnregisterWebhookHandler: (WebhookModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Triggers webhooks for an event.
 *
 * @param {Model} WebhookModel - Sequelize Webhook model
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await triggerWebhooks(Webhook, 'network.created', network);
 * ```
 */
export declare const triggerWebhooks: (WebhookModel: any, event: string, data: any) => Promise<void>;
/**
 * Generates HMAC signature for webhook payload.
 *
 * @param {WebhookPayload} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @returns {string} HMAC signature
 *
 * @example
 * ```typescript
 * const signature = generateWebhookSignature(payload, 'webhook-secret');
 * ```
 */
export declare const generateWebhookSignature: (payload: WebhookPayload, secret: string) => string;
/**
 * Verifies webhook signature.
 *
 * @param {string} signature - Received signature
 * @param {WebhookPayload} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @returns {boolean} Whether signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyWebhookSignature(req.headers['x-webhook-signature'], payload, secret);
 * ```
 */
export declare const verifyWebhookSignature: (signature: string, payload: WebhookPayload, secret: string) => boolean;
/**
 * Executes callback to external URL.
 *
 * @param {CallbackConfig} config - Callback configuration
 * @param {any} data - Callback data
 * @returns {Promise<{ success: boolean; response?: any; error?: string }>} Callback result
 *
 * @example
 * ```typescript
 * const result = await executeCallback({
 *   callbackUrl: 'https://example.com/callback',
 *   method: 'POST',
 *   headers: { 'Authorization': 'Bearer token' }
 * }, { status: 'completed' });
 * ```
 */
export declare const executeCallback: (config: CallbackConfig, data: any) => Promise<{
    success: boolean;
    response?: any;
    error?: string;
}>;
/**
 * Creates callback handler with retry logic.
 *
 * @param {CallbackConfig} config - Callback configuration
 * @param {number} [maxRetries=3] - Maximum retry attempts
 * @returns {Function} Callback handler function
 *
 * @example
 * ```typescript
 * const callback = createCallbackHandler({
 *   callbackUrl: 'https://example.com/callback',
 *   method: 'POST'
 * }, 3);
 * await callback({ status: 'completed' });
 * ```
 */
export declare const createCallbackHandler: (config: CallbackConfig, maxRetries?: number) => (data: any) => Promise<{
    success: boolean;
    attempts: number;
    error?: string;
}>;
/**
 * Validates callback URL for security.
 *
 * @param {string} url - Callback URL to validate
 * @param {string[]} [allowedDomains] - Allowed domains
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCallbackUrl('https://example.com/callback', ['example.com']);
 * if (!result.valid) {
 *   throw new Error(result.error);
 * }
 * ```
 */
export declare const validateCallbackUrl: (url: string, allowedDomains?: string[]) => {
    valid: boolean;
    error?: string;
};
/**
 * Creates a POST handler for linking resources to networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/:id/relationships/:resourceType', createLinkResourceHandler(Network));
 * ```
 */
export declare const createLinkResourceHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Creates a DELETE handler for unlinking resources from networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.delete('/api/v1/networks/:id/relationships/:resourceType/:resourceId', createUnlinkResourceHandler(Network));
 * ```
 */
export declare const createUnlinkResourceHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Creates a GET handler for retrieving network resource relationships.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/api/v1/networks/:id/relationships', createGetRelationshipsHandler(Network));
 * ```
 */
export declare const createGetRelationshipsHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
declare const _default: {
    createNetworkModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            name: string;
            cidr: string;
            vlanId: number | null;
            status: "active" | "inactive" | "pending" | "error";
            description: string | null;
            tags: string[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createNetworkActionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            networkId: string;
            action: string;
            initiatedBy: string;
            parameters: Record<string, any>;
            status: "pending" | "in_progress" | "completed" | "failed";
            result: Record<string, any> | null;
            error: string | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createWebhookModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            url: string;
            events: string[];
            secret: string | null;
            active: boolean;
            retryPolicy: Record<string, any>;
            lastTriggeredAt: Date | null;
            failureCount: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createGetNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    createListNetworksHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createCreateNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createUpdateNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    createPatchNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    createDeleteNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    createHeadNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    createOptionsNetworkHandler: () => (req: Request, res: Response) => void;
    createNetworkActionHandler: (NetworkModel: any, NetworkActionModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    createGetNetworkActionStatusHandler: (NetworkActionModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    createActivateNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    createDeactivateNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    createValidateNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    executeBatchOperation: <T>(NetworkModel: any, batch: BatchOperation<T>) => Promise<BatchOperationResult<T>>;
    createBatchNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    executeBulkUpdate: (NetworkModel: any, operation: BulkUpdateOperation) => Promise<{
        updated: number;
        networks: any[];
    }>;
    createBulkUpdateNetworkHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    searchNetworks: (NetworkModel: any, query: SearchQuery) => Promise<SearchResult<any>>;
    createSearchNetworksHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createAdvancedSearchNetworksHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    exportNetworks: (NetworkModel: any, options: ExportOptions) => Promise<string>;
    createExportNetworksHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createCustomExportNetworksHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    importNetworks: (NetworkModel: any, data: any[], options: ImportOptions) => Promise<ImportResult>;
    createImportNetworksHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    parseCSVImport: (csvData: string) => any[];
    createRegisterWebhookHandler: (WebhookModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createUnregisterWebhookHandler: (WebhookModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    triggerWebhooks: (WebhookModel: any, event: string, data: any) => Promise<void>;
    generateWebhookSignature: (payload: WebhookPayload, secret: string) => string;
    verifyWebhookSignature: (signature: string, payload: WebhookPayload, secret: string) => boolean;
    executeCallback: (config: CallbackConfig, data: any) => Promise<{
        success: boolean;
        response?: any;
        error?: string;
    }>;
    createCallbackHandler: (config: CallbackConfig, maxRetries?: number) => (data: any) => Promise<{
        success: boolean;
        attempts: number;
        error?: string;
    }>;
    validateCallbackUrl: (url: string, allowedDomains?: string[]) => {
        valid: boolean;
        error?: string;
    };
    createLinkResourceHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    createUnlinkResourceHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
    createGetRelationshipsHandler: (NetworkModel: any) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
};
export default _default;
//# sourceMappingURL=network-rest-endpoints-kit.d.ts.map