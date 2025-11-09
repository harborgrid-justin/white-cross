/**
 * LOC: NETROUT1234567
 * File: /reuse/san/network-routing-handlers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network routing implementations
 *   - NestJS request handlers
 *   - WebSocket gateways
 */
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
interface RouteValidationResult {
    valid: boolean;
    errors: string[];
    sanitized?: any;
}
interface QueryParamOptions {
    type: 'string' | 'number' | 'boolean' | 'array';
    required?: boolean;
    default?: any;
    min?: number;
    max?: number;
    enum?: any[];
    transform?: (value: any) => any;
}
interface RequestBodySchema {
    fields: Record<string, {
        type: string;
        required: boolean;
        validation?: any;
    }>;
    strict?: boolean;
}
interface FileUploadConfig {
    destination: string;
    maxSize: number;
    allowedMimeTypes: string[];
    filename?: (req: any, file: any) => string;
}
interface StreamConfig {
    bufferSize?: number;
    encoding?: BufferEncoding;
    highWaterMark?: number;
}
interface SSEConfig {
    eventName: string;
    interval?: number;
    retry?: number;
    transform?: (data: any) => any;
}
/**
 * Validates route parameter as network ID (UUID format).
 *
 * @param {any} value - Parameter value
 * @returns {RouteValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateNetworkIdParam('123e4567-e89b-12d3-a456-426614174000');
 * // Result: { valid: true, errors: [], sanitized: '123e4567-e89b-12d3-a456-426614174000' }
 * ```
 */
export declare const validateNetworkIdParam: (value: any) => RouteValidationResult;
/**
 * Validates route parameter as IP address.
 *
 * @param {any} value - Parameter value
 * @param {boolean} [allowCIDR=false] - Allow CIDR notation
 * @returns {RouteValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateIpAddressParam('192.168.1.1');
 * // Result: { valid: true, errors: [], sanitized: '192.168.1.1' }
 * ```
 */
export declare const validateIpAddressParam: (value: any, allowCIDR?: boolean) => RouteValidationResult;
/**
 * Validates route parameter as port number.
 *
 * @param {any} value - Parameter value
 * @returns {RouteValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePortParam('8080');
 * // Result: { valid: true, errors: [], sanitized: 8080 }
 * ```
 */
export declare const validatePortParam: (value: any) => RouteValidationResult;
/**
 * Validates route parameter as VLAN ID.
 *
 * @param {any} value - Parameter value
 * @returns {RouteValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateVlanIdParam('100');
 * // Result: { valid: true, errors: [], sanitized: 100 }
 * ```
 */
export declare const validateVlanIdParam: (value: any) => RouteValidationResult;
/**
 * Validates route parameter as VNI (VXLAN Network Identifier).
 *
 * @param {any} value - Parameter value
 * @returns {RouteValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateVniParam('10000');
 * // Result: { valid: true, errors: [], sanitized: 10000 }
 * ```
 */
export declare const validateVniParam: (value: any) => RouteValidationResult;
/**
 * Validates route parameter as MAC address.
 *
 * @param {any} value - Parameter value
 * @returns {RouteValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateMacAddressParam('00:1A:2B:3C:4D:5E');
 * // Result: { valid: true, errors: [], sanitized: '00:1a:2b:3c:4d:5e' }
 * ```
 */
export declare const validateMacAddressParam: (value: any) => RouteValidationResult;
/**
 * Validates route parameter as network type.
 *
 * @param {any} value - Parameter value
 * @returns {RouteValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateNetworkTypeParam('vlan');
 * // Result: { valid: true, errors: [], sanitized: 'vlan' }
 * ```
 */
export declare const validateNetworkTypeParam: (value: any) => RouteValidationResult;
/**
 * Creates a custom NestJS param decorator for validated route parameters.
 *
 * @param {Function} validator - Validation function
 * @param {string} paramName - Parameter name
 * @returns {ParameterDecorator} NestJS parameter decorator
 *
 * @example
 * ```typescript
 * const NetworkId = createValidatedParamDecorator(validateNetworkIdParam, 'networkId');
 * @Get(':id')
 * async getNetwork(@NetworkId() id: string) { ... }
 * ```
 */
export declare const createValidatedParamDecorator: (validator: (value: any) => RouteValidationResult, paramName: string) => any;
/**
 * Parses and validates query parameters based on options.
 *
 * @param {any} query - Query object
 * @param {Record<string, QueryParamOptions>} options - Parameter options
 * @returns {any} Parsed query parameters
 *
 * @example
 * ```typescript
 * const params = parseQueryParameters(req.query, {
 *   page: { type: 'number', default: 1, min: 1 },
 *   limit: { type: 'number', default: 10, min: 1, max: 100 }
 * });
 * ```
 */
export declare const parseQueryParameters: (query: any, options: Record<string, QueryParamOptions>) => any;
/**
 * Creates pagination query parameters object.
 *
 * @param {any} query - Query object
 * @returns {any} Pagination parameters
 *
 * @example
 * ```typescript
 * const pagination = createPaginationParams(req.query);
 * // Result: { page: 1, limit: 10, offset: 0 }
 * ```
 */
export declare const createPaginationParams: (query: any) => any;
/**
 * Creates sorting query parameters object.
 *
 * @param {any} query - Query object
 * @param {string[]} allowedFields - Allowed sort fields
 * @returns {any} Sorting parameters
 *
 * @example
 * ```typescript
 * const sorting = createSortingParams(req.query, ['name', 'createdAt']);
 * // Result: { sortBy: 'createdAt', order: 'DESC' }
 * ```
 */
export declare const createSortingParams: (query: any, allowedFields: string[]) => any;
/**
 * Creates filtering query parameters object.
 *
 * @param {any} query - Query object
 * @param {string[]} allowedFields - Allowed filter fields
 * @returns {any} Filter parameters
 *
 * @example
 * ```typescript
 * const filters = createFilterParams(req.query, ['status', 'type', 'enabled']);
 * // Result: { status: 'active', type: 'vlan', enabled: true }
 * ```
 */
export declare const createFilterParams: (query: any, allowedFields: string[]) => any;
/**
 * Creates date range query parameters.
 *
 * @param {any} query - Query object
 * @returns {any} Date range parameters
 *
 * @example
 * ```typescript
 * const dateRange = createDateRangeParams(req.query);
 * // Result: { startDate: Date, endDate: Date }
 * ```
 */
export declare const createDateRangeParams: (query: any) => any;
/**
 * Creates search query parameters with full-text search support.
 *
 * @param {any} query - Query object
 * @param {string[]} searchFields - Fields to search in
 * @returns {any} Search parameters
 *
 * @example
 * ```typescript
 * const search = createSearchParams(req.query, ['name', 'description']);
 * // Result: { q: 'search term', fields: ['name', 'description'] }
 * ```
 */
export declare const createSearchParams: (query: any, searchFields: string[]) => any;
/**
 * Validates and parses IP address range query parameter.
 *
 * @param {any} query - Query object
 * @returns {any} IP range parameters
 *
 * @example
 * ```typescript
 * const range = createIpRangeParams(req.query);
 * // Result: { startIp: '192.168.1.1', endIp: '192.168.1.255' }
 * ```
 */
export declare const createIpRangeParams: (query: any) => any;
/**
 * Creates network metrics query parameters.
 *
 * @param {any} query - Query object
 * @returns {any} Metrics parameters
 *
 * @example
 * ```typescript
 * const metrics = createMetricsParams(req.query);
 * // Result: { interval: '5m', aggregation: 'avg', metrics: ['bandwidth', 'latency'] }
 * ```
 */
export declare const createMetricsParams: (query: any) => any;
/**
 * Validates request body against schema.
 *
 * @param {any} body - Request body
 * @param {RequestBodySchema} schema - Validation schema
 * @returns {RouteValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRequestBody(req.body, {
 *   fields: {
 *     name: { type: 'string', required: true },
 *     vlanId: { type: 'number', required: true }
 *   }
 * });
 * ```
 */
export declare const validateRequestBody: (body: any, schema: RequestBodySchema) => RouteValidationResult;
/**
 * Parses and validates network configuration body.
 *
 * @param {any} body - Request body
 * @returns {any} Parsed configuration
 *
 * @example
 * ```typescript
 * const config = parseNetworkConfigBody(req.body);
 * ```
 */
export declare const parseNetworkConfigBody: (body: any) => any;
/**
 * Parses and validates route configuration body.
 *
 * @param {any} body - Request body
 * @returns {any} Parsed route configuration
 *
 * @example
 * ```typescript
 * const route = parseRouteConfigBody(req.body);
 * ```
 */
export declare const parseRouteConfigBody: (body: any) => any;
/**
 * Parses and validates firewall rule body.
 *
 * @param {any} body - Request body
 * @returns {any} Parsed firewall rule
 *
 * @example
 * ```typescript
 * const rule = parseFirewallRuleBody(req.body);
 * ```
 */
export declare const parseFirewallRuleBody: (body: any) => any;
/**
 * Parses and validates QoS policy body.
 *
 * @param {any} body - Request body
 * @returns {any} Parsed QoS policy
 *
 * @example
 * ```typescript
 * const qos = parseQoSPolicyBody(req.body);
 * ```
 */
export declare const parseQoSPolicyBody: (body: any) => any;
/**
 * Parses bulk operation body with validation.
 *
 * @param {any} body - Request body
 * @param {RequestBodySchema} itemSchema - Schema for each item
 * @returns {any[]} Parsed items array
 *
 * @example
 * ```typescript
 * const items = parseBulkOperationBody(req.body, networkSchema);
 * ```
 */
export declare const parseBulkOperationBody: (body: any, itemSchema: RequestBodySchema) => any[];
/**
 * Sanitizes request body to remove dangerous content.
 *
 * @param {any} body - Request body
 * @returns {any} Sanitized body
 *
 * @example
 * ```typescript
 * const clean = sanitizeRequestBody(req.body);
 * ```
 */
export declare const sanitizeRequestBody: (body: any) => any;
/**
 * Transforms request body using custom transformers.
 *
 * @param {any} body - Request body
 * @param {Record<string, Function>} transformers - Field transformers
 * @returns {any} Transformed body
 *
 * @example
 * ```typescript
 * const transformed = transformRequestBody(req.body, {
 *   name: (v) => v.toLowerCase(),
 *   tags: (v) => v.split(',')
 * });
 * ```
 */
export declare const transformRequestBody: (body: any, transformers: Record<string, Function>) => any;
/**
 * Merges request body with defaults.
 *
 * @param {any} body - Request body
 * @param {any} defaults - Default values
 * @returns {any} Merged body
 *
 * @example
 * ```typescript
 * const merged = mergeBodyWithDefaults(req.body, {
 *   enabled: true,
 *   mtu: 1500
 * });
 * ```
 */
export declare const mergeBodyWithDefaults: (body: any, defaults: any) => any;
/**
 * Creates multer storage configuration for network config uploads.
 *
 * @param {FileUploadConfig} config - Upload configuration
 * @returns {any} Multer storage configuration
 *
 * @example
 * ```typescript
 * const storage = createNetworkConfigUploadStorage({
 *   destination: './uploads/configs',
 *   maxSize: 5 * 1024 * 1024,
 *   allowedMimeTypes: ['application/json', 'text/plain']
 * });
 * ```
 */
export declare const createNetworkConfigUploadStorage: (config: FileUploadConfig) => any;
/**
 * Validates uploaded network configuration file.
 *
 * @param {any} file - Uploaded file
 * @param {FileUploadConfig} config - Upload configuration
 * @returns {RouteValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateNetworkConfigFile(req.file, uploadConfig);
 * ```
 */
export declare const validateNetworkConfigFile: (file: any, config: FileUploadConfig) => RouteValidationResult;
/**
 * Parses uploaded network configuration file content.
 *
 * @param {string} filePath - Path to uploaded file
 * @param {string} format - File format (json, yaml, conf)
 * @returns {Promise<any>} Parsed configuration
 *
 * @example
 * ```typescript
 * const config = await parseNetworkConfigFile('/uploads/config.json', 'json');
 * ```
 */
export declare const parseNetworkConfigFile: (filePath: string, format: string) => Promise<any>;
/**
 * Creates file upload interceptor for network topology diagrams.
 *
 * @param {FileUploadConfig} config - Upload configuration
 * @returns {any} Upload interceptor
 *
 * @example
 * ```typescript
 * const interceptor = createTopologyDiagramUploadInterceptor({
 *   destination: './uploads/diagrams',
 *   maxSize: 10 * 1024 * 1024,
 *   allowedMimeTypes: ['image/png', 'image/svg+xml']
 * });
 * ```
 */
export declare const createTopologyDiagramUploadInterceptor: (config: FileUploadConfig) => any;
/**
 * Creates a readable stream for network metrics data.
 *
 * @param {any} dataSource - Data source function
 * @param {StreamConfig} [config] - Stream configuration
 * @returns {ReadableStream} Readable stream
 *
 * @example
 * ```typescript
 * const stream = createNetworkMetricsStream(
 *   async () => await getMetrics(networkId),
 *   { bufferSize: 1024 }
 * );
 * ```
 */
export declare const createNetworkMetricsStream: (dataSource: () => Promise<any>, config?: StreamConfig) => any;
/**
 * Creates a file stream for network log export.
 *
 * @param {string} filePath - Path to log file
 * @param {StreamConfig} [config] - Stream configuration
 * @returns {StreamableFile} Streamable file
 *
 * @example
 * ```typescript
 * const stream = createNetworkLogStream('/var/log/network.log');
 * return new StreamableFile(stream);
 * ```
 */
export declare const createNetworkLogStream: (filePath: string, config?: StreamConfig) => any;
/**
 * Creates transform stream for network data processing.
 *
 * @param {Function} transformer - Transform function
 * @returns {TransformStream} Transform stream
 *
 * @example
 * ```typescript
 * const transform = createNetworkDataTransformStream(
 *   (data) => ({ ...data, processed: true })
 * );
 * ```
 */
export declare const createNetworkDataTransformStream: (transformer: (data: any) => any) => any;
/**
 * Creates write stream for network data persistence.
 *
 * @param {string} filePath - Output file path
 * @param {StreamConfig} [config] - Stream configuration
 * @returns {WritableStream} Writable stream
 *
 * @example
 * ```typescript
 * const writeStream = createNetworkDataWriteStream('/data/metrics.jsonl');
 * ```
 */
export declare const createNetworkDataWriteStream: (filePath: string, config?: StreamConfig) => any;
/**
 * Creates SSE handler for real-time network status updates.
 *
 * @param {any} service - Network service
 * @param {SSEConfig} config - SSE configuration
 * @returns {Function} SSE handler function
 *
 * @example
 * ```typescript
 * @Get('sse/status')
 * async streamStatus(@Req() req, @Res() res) {
 *   return createNetworkStatusSSE(this.service, { eventName: 'status', interval: 5000 })(req, res);
 * }
 * ```
 */
export declare const createNetworkStatusSSE: (service: any, config: SSEConfig) => (req: Request, res: Response) => void;
/**
 * Creates SSE handler for network metrics streaming.
 *
 * @param {any} service - Network service
 * @param {string} networkId - Network ID
 * @returns {Observable} RxJS observable for SSE
 *
 * @example
 * ```typescript
 * @Get(':id/sse/metrics')
 * streamMetrics(@Param('id') id: string): Observable<any> {
 *   return createNetworkMetricsSSE(this.service, id);
 * }
 * ```
 */
export declare const createNetworkMetricsSSE: (service: any, networkId: string) => Observable<any>;
/**
 * Creates SSE handler for network alerts streaming.
 *
 * @param {any} service - Network service
 * @returns {Function} SSE handler
 *
 * @example
 * ```typescript
 * @Get('sse/alerts')
 * streamAlerts(@Req() req, @Res() res) {
 *   return createNetworkAlertsSSE(this.service)(req, res);
 * }
 * ```
 */
export declare const createNetworkAlertsSSE: (service: any) => (req: Request, res: Response) => void;
/**
 * Creates SSE handler for network topology changes.
 *
 * @param {any} service - Network service
 * @param {string} networkId - Network ID
 * @returns {Observable} RxJS observable
 *
 * @example
 * ```typescript
 * @Get(':id/sse/topology')
 * streamTopology(@Param('id') id: string): Observable<any> {
 *   return createNetworkTopologySSE(this.service, id);
 * }
 * ```
 */
export declare const createNetworkTopologySSE: (service: any, networkId: string) => Observable<any>;
/**
 * Creates WebSocket gateway for network events.
 *
 * @returns {any} WebSocket gateway class
 *
 * @example
 * ```typescript
 * const NetworkEventsGateway = createNetworkEventsGateway();
 * ```
 */
export declare const createNetworkEventsGateway: () => any;
/**
 * Emits WebSocket event for network status change.
 *
 * @param {any} gateway - WebSocket gateway instance
 * @param {string} networkId - Network ID
 * @param {any} status - Status data
 *
 * @example
 * ```typescript
 * emitNetworkStatusEvent(this.gateway, networkId, { status: 'active' });
 * ```
 */
export declare const emitNetworkStatusEvent: (gateway: any, networkId: string, status: any) => void;
/**
 * Emits WebSocket event for network metrics update.
 *
 * @param {any} gateway - WebSocket gateway instance
 * @param {string} networkId - Network ID
 * @param {any} metrics - Metrics data
 *
 * @example
 * ```typescript
 * emitNetworkMetricsEvent(this.gateway, networkId, metricsData);
 * ```
 */
export declare const emitNetworkMetricsEvent: (gateway: any, networkId: string, metrics: any) => void;
/**
 * Emits WebSocket event for network alert.
 *
 * @param {any} gateway - WebSocket gateway instance
 * @param {string} networkId - Network ID
 * @param {any} alert - Alert data
 *
 * @example
 * ```typescript
 * emitNetworkAlertEvent(this.gateway, networkId, {
 *   severity: 'critical',
 *   message: 'High packet loss detected'
 * });
 * ```
 */
export declare const emitNetworkAlertEvent: (gateway: any, networkId: string, alert: any) => void;
declare const _default: {
    validateNetworkIdParam: (value: any) => RouteValidationResult;
    validateIpAddressParam: (value: any, allowCIDR?: boolean) => RouteValidationResult;
    validatePortParam: (value: any) => RouteValidationResult;
    validateVlanIdParam: (value: any) => RouteValidationResult;
    validateVniParam: (value: any) => RouteValidationResult;
    validateMacAddressParam: (value: any) => RouteValidationResult;
    validateNetworkTypeParam: (value: any) => RouteValidationResult;
    createValidatedParamDecorator: (validator: (value: any) => RouteValidationResult, paramName: string) => any;
    parseQueryParameters: (query: any, options: Record<string, QueryParamOptions>) => any;
    createPaginationParams: (query: any) => any;
    createSortingParams: (query: any, allowedFields: string[]) => any;
    createFilterParams: (query: any, allowedFields: string[]) => any;
    createDateRangeParams: (query: any) => any;
    createSearchParams: (query: any, searchFields: string[]) => any;
    createIpRangeParams: (query: any) => any;
    createMetricsParams: (query: any) => any;
    validateRequestBody: (body: any, schema: RequestBodySchema) => RouteValidationResult;
    parseNetworkConfigBody: (body: any) => any;
    parseRouteConfigBody: (body: any) => any;
    parseFirewallRuleBody: (body: any) => any;
    parseQoSPolicyBody: (body: any) => any;
    parseBulkOperationBody: (body: any, itemSchema: RequestBodySchema) => any[];
    sanitizeRequestBody: (body: any) => any;
    transformRequestBody: (body: any, transformers: Record<string, Function>) => any;
    mergeBodyWithDefaults: (body: any, defaults: any) => any;
    createNetworkConfigUploadStorage: (config: FileUploadConfig) => any;
    validateNetworkConfigFile: (file: any, config: FileUploadConfig) => RouteValidationResult;
    parseNetworkConfigFile: (filePath: string, format: string) => Promise<any>;
    createTopologyDiagramUploadInterceptor: (config: FileUploadConfig) => any;
    createNetworkMetricsStream: (dataSource: () => Promise<any>, config?: StreamConfig) => any;
    createNetworkLogStream: (filePath: string, config?: StreamConfig) => any;
    createNetworkDataTransformStream: (transformer: (data: any) => any) => any;
    createNetworkDataWriteStream: (filePath: string, config?: StreamConfig) => any;
    createNetworkStatusSSE: (service: any, config: SSEConfig) => (req: Request, res: Response) => void;
    createNetworkMetricsSSE: (service: any, networkId: string) => Observable<any>;
    createNetworkAlertsSSE: (service: any) => (req: Request, res: Response) => void;
    createNetworkTopologySSE: (service: any, networkId: string) => Observable<any>;
    createNetworkEventsGateway: () => any;
    emitNetworkStatusEvent: (gateway: any, networkId: string, status: any) => void;
    emitNetworkMetricsEvent: (gateway: any, networkId: string, metrics: any) => void;
    emitNetworkAlertEvent: (gateway: any, networkId: string, alert: any) => void;
};
export default _default;
//# sourceMappingURL=network-routing-handlers-kit.d.ts.map