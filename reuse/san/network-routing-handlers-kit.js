"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitNetworkAlertEvent = exports.emitNetworkMetricsEvent = exports.emitNetworkStatusEvent = exports.createNetworkEventsGateway = exports.createNetworkTopologySSE = exports.createNetworkAlertsSSE = exports.createNetworkMetricsSSE = exports.createNetworkStatusSSE = exports.createNetworkDataWriteStream = exports.createNetworkDataTransformStream = exports.createNetworkLogStream = exports.createNetworkMetricsStream = exports.createTopologyDiagramUploadInterceptor = exports.parseNetworkConfigFile = exports.validateNetworkConfigFile = exports.createNetworkConfigUploadStorage = exports.mergeBodyWithDefaults = exports.transformRequestBody = exports.sanitizeRequestBody = exports.parseBulkOperationBody = exports.parseQoSPolicyBody = exports.parseFirewallRuleBody = exports.parseRouteConfigBody = exports.parseNetworkConfigBody = exports.validateRequestBody = exports.createMetricsParams = exports.createIpRangeParams = exports.createSearchParams = exports.createDateRangeParams = exports.createFilterParams = exports.createSortingParams = exports.createPaginationParams = exports.parseQueryParameters = exports.createValidatedParamDecorator = exports.validateNetworkTypeParam = exports.validateMacAddressParam = exports.validateVniParam = exports.validateVlanIdParam = exports.validatePortParam = exports.validateIpAddressParam = exports.validateNetworkIdParam = void 0;
/**
 * File: /reuse/san/network-routing-handlers-kit.ts
 * Locator: WC-UTL-NETROUT-001
 * Purpose: Comprehensive Network Routing Handler Utilities - route validation, parameter handling, streaming, SSE, WebSocket
 *
 * Upstream: Independent utility module for network routing handler implementation
 * Downstream: ../backend/*, Network handlers, request processors, WebSocket services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/websockets 10.x, @nestjs/platform-socket.io 10.x
 * Exports: 40+ utility functions for routing handlers, parameter validation, body parsing, file uploads, streaming, SSE, WebSocket
 *
 * LLM Context: Comprehensive network routing handler utilities for implementing production-ready NestJS route handlers
 * for software-based enterprise virtual networks. Provides parameter validation, query handling, request body parsing,
 * file upload management, streaming network data, Server-Sent Events for real-time updates, WebSocket gateway for events,
 * and API versioning. Essential for robust network data flow management.
 */
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const rxjs_1 = require("rxjs");
const fs_1 = require("fs");
const multer = __importStar(require("multer"));
// ============================================================================
// ROUTE PARAMETER VALIDATION (1-8)
// ============================================================================
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
const validateNetworkIdParam = (value) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!value) {
        return { valid: false, errors: ['Network ID is required'] };
    }
    if (typeof value !== 'string') {
        return { valid: false, errors: ['Network ID must be a string'] };
    }
    if (!uuidRegex.test(value)) {
        return { valid: false, errors: ['Network ID must be a valid UUID'] };
    }
    return { valid: true, errors: [], sanitized: value.toLowerCase() };
};
exports.validateNetworkIdParam = validateNetworkIdParam;
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
const validateIpAddressParam = (value, allowCIDR = false) => {
    if (!value) {
        return { valid: false, errors: ['IP address is required'] };
    }
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv4CidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::)$/;
    let testValue = value;
    let isCIDR = false;
    if (allowCIDR && value.includes('/')) {
        if (!ipv4CidrRegex.test(value)) {
            return { valid: false, errors: ['Invalid CIDR notation'] };
        }
        const [ip, cidr] = value.split('/');
        testValue = ip;
        isCIDR = true;
        const cidrNum = parseInt(cidr, 10);
        if (cidrNum < 0 || cidrNum > 32) {
            return { valid: false, errors: ['CIDR must be between 0 and 32'] };
        }
    }
    if (ipv4Regex.test(testValue)) {
        const valid = testValue.split('.').every((part) => {
            const num = parseInt(part, 10);
            return num >= 0 && num <= 255;
        });
        if (!valid) {
            return { valid: false, errors: ['Invalid IPv4 address'] };
        }
        return { valid: true, errors: [], sanitized: value };
    }
    if (ipv6Regex.test(testValue)) {
        return { valid: true, errors: [], sanitized: value };
    }
    return { valid: false, errors: ['Invalid IP address format'] };
};
exports.validateIpAddressParam = validateIpAddressParam;
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
const validatePortParam = (value) => {
    const port = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(port)) {
        return { valid: false, errors: ['Port must be a number'] };
    }
    if (port < 1 || port > 65535) {
        return { valid: false, errors: ['Port must be between 1 and 65535'] };
    }
    return { valid: true, errors: [], sanitized: port };
};
exports.validatePortParam = validatePortParam;
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
const validateVlanIdParam = (value) => {
    const vlanId = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(vlanId)) {
        return { valid: false, errors: ['VLAN ID must be a number'] };
    }
    if (vlanId < 1 || vlanId > 4094) {
        return { valid: false, errors: ['VLAN ID must be between 1 and 4094'] };
    }
    return { valid: true, errors: [], sanitized: vlanId };
};
exports.validateVlanIdParam = validateVlanIdParam;
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
const validateVniParam = (value) => {
    const vni = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(vni)) {
        return { valid: false, errors: ['VNI must be a number'] };
    }
    if (vni < 1 || vni > 16777215) {
        return { valid: false, errors: ['VNI must be between 1 and 16777215'] };
    }
    return { valid: true, errors: [], sanitized: vni };
};
exports.validateVniParam = validateVniParam;
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
const validateMacAddressParam = (value) => {
    if (!value || typeof value !== 'string') {
        return { valid: false, errors: ['MAC address is required'] };
    }
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!macRegex.test(value)) {
        return { valid: false, errors: ['Invalid MAC address format'] };
    }
    return { valid: true, errors: [], sanitized: value.toLowerCase().replace(/-/g, ':') };
};
exports.validateMacAddressParam = validateMacAddressParam;
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
const validateNetworkTypeParam = (value) => {
    if (!value) {
        return { valid: false, errors: ['Network type is required'] };
    }
    const validTypes = ['vlan', 'vxlan', 'overlay', 'underlay', 'gre', 'mpls'];
    if (!validTypes.includes(value.toLowerCase())) {
        return {
            valid: false,
            errors: [`Network type must be one of: ${validTypes.join(', ')}`],
        };
    }
    return { valid: true, errors: [], sanitized: value.toLowerCase() };
};
exports.validateNetworkTypeParam = validateNetworkTypeParam;
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
const createValidatedParamDecorator = (validator, paramName) => {
    return (0, common_1.createParamDecorator)((data, ctx) => {
        const request = ctx.switchToHttp().getRequest();
        const value = request.params[paramName];
        const result = validator(value);
        if (!result.valid) {
            throw new common_1.BadRequestException({
                message: 'Validation failed',
                errors: result.errors,
                field: paramName,
            });
        }
        return result.sanitized || value;
    })();
};
exports.createValidatedParamDecorator = createValidatedParamDecorator;
// ============================================================================
// QUERY PARAMETER HANDLING (9-16)
// ============================================================================
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
const parseQueryParameters = (query, options) => {
    const result = {};
    const errors = [];
    Object.entries(options).forEach(([key, opts]) => {
        let value = query[key];
        // Handle required parameters
        if (opts.required && (value === undefined || value === null || value === '')) {
            errors.push(`Query parameter '${key}' is required`);
            return;
        }
        // Apply default if not provided
        if (value === undefined || value === null || value === '') {
            value = opts.default;
        }
        // Skip if still undefined after default
        if (value === undefined) {
            return;
        }
        // Type conversion
        switch (opts.type) {
            case 'number':
                const num = Number(value);
                if (isNaN(num)) {
                    errors.push(`Query parameter '${key}' must be a number`);
                }
                else {
                    if (opts.min !== undefined && num < opts.min) {
                        errors.push(`Query parameter '${key}' must be at least ${opts.min}`);
                    }
                    if (opts.max !== undefined && num > opts.max) {
                        errors.push(`Query parameter '${key}' must be at most ${opts.max}`);
                    }
                    value = num;
                }
                break;
            case 'boolean':
                if (typeof value === 'string') {
                    value = value.toLowerCase() === 'true' || value === '1';
                }
                else {
                    value = Boolean(value);
                }
                break;
            case 'array':
                if (typeof value === 'string') {
                    value = value.split(',').map(v => v.trim());
                }
                else if (!Array.isArray(value)) {
                    value = [value];
                }
                break;
            case 'string':
            default:
                value = String(value);
                break;
        }
        // Enum validation
        if (opts.enum && !opts.enum.includes(value)) {
            errors.push(`Query parameter '${key}' must be one of: ${opts.enum.join(', ')}`);
        }
        // Custom transformation
        if (opts.transform) {
            value = opts.transform(value);
        }
        result[key] = value;
    });
    if (errors.length > 0) {
        throw new common_1.BadRequestException({
            message: 'Query parameter validation failed',
            errors,
        });
    }
    return result;
};
exports.parseQueryParameters = parseQueryParameters;
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
const createPaginationParams = (query) => {
    return (0, exports.parseQueryParameters)(query, {
        page: { type: 'number', default: 1, min: 1 },
        limit: { type: 'number', default: 10, min: 1, max: 100 },
    });
};
exports.createPaginationParams = createPaginationParams;
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
const createSortingParams = (query, allowedFields) => {
    const { sortBy = allowedFields[0], order = 'ASC' } = query;
    if (!allowedFields.includes(sortBy)) {
        throw new common_1.BadRequestException({
            message: `Invalid sort field. Allowed fields: ${allowedFields.join(', ')}`,
        });
    }
    if (!['ASC', 'DESC'].includes(order.toUpperCase())) {
        throw new common_1.BadRequestException({
            message: 'Sort order must be ASC or DESC',
        });
    }
    return {
        sortBy,
        order: order.toUpperCase(),
    };
};
exports.createSortingParams = createSortingParams;
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
const createFilterParams = (query, allowedFields) => {
    const filters = {};
    Object.keys(query).forEach(key => {
        if (allowedFields.includes(key) && query[key] !== undefined) {
            filters[key] = query[key];
        }
    });
    return filters;
};
exports.createFilterParams = createFilterParams;
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
const createDateRangeParams = (query) => {
    const { startDate, endDate } = query;
    const result = {};
    if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
            throw new common_1.BadRequestException('Invalid startDate format');
        }
        result.startDate = start;
    }
    if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid endDate format');
        }
        result.endDate = end;
    }
    if (result.startDate && result.endDate && result.startDate > result.endDate) {
        throw new common_1.BadRequestException('startDate must be before endDate');
    }
    return result;
};
exports.createDateRangeParams = createDateRangeParams;
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
const createSearchParams = (query, searchFields) => {
    const { q, search } = query;
    const searchTerm = q || search;
    if (!searchTerm) {
        return null;
    }
    return {
        q: searchTerm.trim(),
        fields: searchFields,
        caseSensitive: false,
    };
};
exports.createSearchParams = createSearchParams;
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
const createIpRangeParams = (query) => {
    const { startIp, endIp, cidr } = query;
    if (cidr) {
        const cidrResult = (0, exports.validateIpAddressParam)(cidr, true);
        if (!cidrResult.valid) {
            throw new common_1.BadRequestException(cidrResult.errors[0]);
        }
        return { cidr: cidrResult.sanitized };
    }
    if (startIp || endIp) {
        const result = {};
        if (startIp) {
            const startResult = (0, exports.validateIpAddressParam)(startIp);
            if (!startResult.valid) {
                throw new common_1.BadRequestException(`Invalid startIp: ${startResult.errors[0]}`);
            }
            result.startIp = startResult.sanitized;
        }
        if (endIp) {
            const endResult = (0, exports.validateIpAddressParam)(endIp);
            if (!endResult.valid) {
                throw new common_1.BadRequestException(`Invalid endIp: ${endResult.errors[0]}`);
            }
            result.endIp = endResult.sanitized;
        }
        return result;
    }
    return null;
};
exports.createIpRangeParams = createIpRangeParams;
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
const createMetricsParams = (query) => {
    const validIntervals = ['1m', '5m', '15m', '30m', '1h', '6h', '24h'];
    const validAggregations = ['avg', 'min', 'max', 'sum', 'count'];
    return (0, exports.parseQueryParameters)(query, {
        interval: {
            type: 'string',
            default: '5m',
            enum: validIntervals,
        },
        aggregation: {
            type: 'string',
            default: 'avg',
            enum: validAggregations,
        },
        metrics: {
            type: 'array',
            default: ['bandwidth', 'latency', 'packetLoss'],
        },
    });
};
exports.createMetricsParams = createMetricsParams;
// ============================================================================
// REQUEST BODY PARSING (17-24)
// ============================================================================
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
const validateRequestBody = (body, schema) => {
    const errors = [];
    const sanitized = {};
    if (!body || typeof body !== 'object') {
        return { valid: false, errors: ['Request body must be an object'] };
    }
    // Validate required fields
    Object.entries(schema.fields).forEach(([field, config]) => {
        const value = body[field];
        if (config.required && (value === undefined || value === null)) {
            errors.push(`Field '${field}' is required`);
            return;
        }
        if (value !== undefined && value !== null) {
            sanitized[field] = value;
        }
    });
    // Check for unexpected fields in strict mode
    if (schema.strict) {
        Object.keys(body).forEach(key => {
            if (!schema.fields[key]) {
                errors.push(`Unexpected field '${key}'`);
            }
        });
    }
    return {
        valid: errors.length === 0,
        errors,
        sanitized: errors.length === 0 ? sanitized : undefined,
    };
};
exports.validateRequestBody = validateRequestBody;
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
const parseNetworkConfigBody = (body) => {
    const schema = {
        fields: {
            name: { type: 'string', required: true },
            type: { type: 'string', required: true },
            subnet: { type: 'string', required: true },
            gateway: { type: 'string', required: true },
            vlanId: { type: 'number', required: false },
            vni: { type: 'number', required: false },
            mtu: { type: 'number', required: false },
            enabled: { type: 'boolean', required: false },
        },
        strict: true,
    };
    const result = (0, exports.validateRequestBody)(body, schema);
    if (!result.valid) {
        throw new common_1.BadRequestException({
            message: 'Invalid network configuration',
            errors: result.errors,
        });
    }
    return result.sanitized;
};
exports.parseNetworkConfigBody = parseNetworkConfigBody;
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
const parseRouteConfigBody = (body) => {
    const schema = {
        fields: {
            destination: { type: 'string', required: true },
            gateway: { type: 'string', required: true },
            metric: { type: 'number', required: false },
            interface: { type: 'string', required: false },
            type: { type: 'string', required: false },
        },
    };
    const result = (0, exports.validateRequestBody)(body, schema);
    if (!result.valid) {
        throw new common_1.BadRequestException({
            message: 'Invalid route configuration',
            errors: result.errors,
        });
    }
    return result.sanitized;
};
exports.parseRouteConfigBody = parseRouteConfigBody;
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
const parseFirewallRuleBody = (body) => {
    const schema = {
        fields: {
            priority: { type: 'number', required: true },
            action: { type: 'string', required: true },
            protocol: { type: 'string', required: true },
            sourceIp: { type: 'string', required: true },
            destinationIp: { type: 'string', required: true },
            sourcePort: { type: 'number', required: false },
            destinationPort: { type: 'number', required: false },
            enabled: { type: 'boolean', required: false },
        },
    };
    const result = (0, exports.validateRequestBody)(body, schema);
    if (!result.valid) {
        throw new common_1.BadRequestException({
            message: 'Invalid firewall rule',
            errors: result.errors,
        });
    }
    // Validate action
    if (!['allow', 'deny'].includes(result.sanitized.action)) {
        throw new common_1.BadRequestException('Action must be "allow" or "deny"');
    }
    // Validate protocol
    if (!['tcp', 'udp', 'icmp', 'any'].includes(result.sanitized.protocol)) {
        throw new common_1.BadRequestException('Protocol must be tcp, udp, icmp, or any');
    }
    return result.sanitized;
};
exports.parseFirewallRuleBody = parseFirewallRuleBody;
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
const parseQoSPolicyBody = (body) => {
    const schema = {
        fields: {
            name: { type: 'string', required: true },
            priority: { type: 'number', required: true },
            bandwidth: { type: 'object', required: true },
            latency: { type: 'object', required: false },
            trafficClass: { type: 'string', required: false },
        },
    };
    const result = (0, exports.validateRequestBody)(body, schema);
    if (!result.valid) {
        throw new common_1.BadRequestException({
            message: 'Invalid QoS policy',
            errors: result.errors,
        });
    }
    return result.sanitized;
};
exports.parseQoSPolicyBody = parseQoSPolicyBody;
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
const parseBulkOperationBody = (body, itemSchema) => {
    if (!body || !Array.isArray(body.items)) {
        throw new common_1.BadRequestException('Body must contain an "items" array');
    }
    const { items } = body;
    if (items.length === 0) {
        throw new common_1.BadRequestException('Items array cannot be empty');
    }
    if (items.length > 100) {
        throw new common_1.BadRequestException('Cannot process more than 100 items at once');
    }
    const validated = items.map((item, index) => {
        const result = (0, exports.validateRequestBody)(item, itemSchema);
        if (!result.valid) {
            throw new common_1.BadRequestException({
                message: `Validation failed for item at index ${index}`,
                errors: result.errors,
            });
        }
        return result.sanitized;
    });
    return validated;
};
exports.parseBulkOperationBody = parseBulkOperationBody;
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
const sanitizeRequestBody = (body) => {
    if (typeof body === 'string') {
        return body
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .trim();
    }
    if (Array.isArray(body)) {
        return body.map(item => (0, exports.sanitizeRequestBody)(item));
    }
    if (typeof body === 'object' && body !== null) {
        const sanitized = {};
        Object.keys(body).forEach(key => {
            sanitized[key] = (0, exports.sanitizeRequestBody)(body[key]);
        });
        return sanitized;
    }
    return body;
};
exports.sanitizeRequestBody = sanitizeRequestBody;
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
const transformRequestBody = (body, transformers) => {
    const transformed = { ...body };
    Object.entries(transformers).forEach(([field, transformer]) => {
        if (transformed[field] !== undefined) {
            transformed[field] = transformer(transformed[field]);
        }
    });
    return transformed;
};
exports.transformRequestBody = transformRequestBody;
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
const mergeBodyWithDefaults = (body, defaults) => {
    return {
        ...defaults,
        ...body,
    };
};
exports.mergeBodyWithDefaults = mergeBodyWithDefaults;
// ============================================================================
// FILE UPLOAD HANDLING (25-28)
// ============================================================================
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
const createNetworkConfigUploadStorage = (config) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, config.destination);
        },
        filename: (req, file, cb) => {
            if (config.filename) {
                cb(null, config.filename(req, file));
            }
            else {
                const timestamp = Date.now();
                const filename = `network-config-${timestamp}-${file.originalname}`;
                cb(null, filename);
            }
        },
    });
};
exports.createNetworkConfigUploadStorage = createNetworkConfigUploadStorage;
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
const validateNetworkConfigFile = (file, config) => {
    const errors = [];
    if (!file) {
        return { valid: false, errors: ['No file uploaded'] };
    }
    // Check file size
    if (file.size > config.maxSize) {
        errors.push(`File size exceeds maximum of ${config.maxSize} bytes`);
    }
    // Check MIME type
    if (!config.allowedMimeTypes.includes(file.mimetype)) {
        errors.push(`File type ${file.mimetype} not allowed. Allowed types: ${config.allowedMimeTypes.join(', ')}`);
    }
    // Check file extension
    const allowedExtensions = ['.json', '.yaml', '.yml', '.conf', '.txt'];
    const fileExt = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
        errors.push(`File extension ${fileExt} not allowed`);
    }
    return {
        valid: errors.length === 0,
        errors,
        sanitized: file,
    };
};
exports.validateNetworkConfigFile = validateNetworkConfigFile;
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
const parseNetworkConfigFile = async (filePath, format) => {
    const fs = require('fs').promises;
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.parse(content);
            case 'yaml':
            case 'yml':
                // Would use yaml parser in production
                throw new Error('YAML parsing not implemented');
            case 'conf':
            case 'txt':
                return { raw: content };
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to parse config file: ${error.message}`);
    }
};
exports.parseNetworkConfigFile = parseNetworkConfigFile;
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
const createTopologyDiagramUploadInterceptor = (config) => {
    return {
        fileFilter: (req, file, cb) => {
            if (config.allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Invalid file type'), false);
            }
        },
        limits: {
            fileSize: config.maxSize,
        },
        storage: (0, exports.createNetworkConfigUploadStorage)(config),
    };
};
exports.createTopologyDiagramUploadInterceptor = createTopologyDiagramUploadInterceptor;
// ============================================================================
// STREAMING NETWORK DATA (29-32)
// ============================================================================
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
const createNetworkMetricsStream = (dataSource, config) => {
    const { Readable } = require('stream');
    return new Readable({
        objectMode: true,
        highWaterMark: config?.highWaterMark || 16,
        async read() {
            try {
                const data = await dataSource();
                this.push(JSON.stringify(data) + '\n');
            }
            catch (error) {
                this.destroy(error);
            }
        },
    });
};
exports.createNetworkMetricsStream = createNetworkMetricsStream;
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
const createNetworkLogStream = (filePath, config) => {
    return (0, fs_1.createReadStream)(filePath, {
        encoding: config?.encoding || 'utf-8',
        highWaterMark: config?.highWaterMark || 64 * 1024,
    });
};
exports.createNetworkLogStream = createNetworkLogStream;
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
const createNetworkDataTransformStream = (transformer) => {
    const { Transform } = require('stream');
    return new Transform({
        objectMode: true,
        transform(chunk, encoding, callback) {
            try {
                const data = JSON.parse(chunk.toString());
                const transformed = transformer(data);
                callback(null, JSON.stringify(transformed) + '\n');
            }
            catch (error) {
                callback(error);
            }
        },
    });
};
exports.createNetworkDataTransformStream = createNetworkDataTransformStream;
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
const createNetworkDataWriteStream = (filePath, config) => {
    return (0, fs_1.createWriteStream)(filePath, {
        encoding: config?.encoding || 'utf-8',
        highWaterMark: config?.highWaterMark || 64 * 1024,
    });
};
exports.createNetworkDataWriteStream = createNetworkDataWriteStream;
// ============================================================================
// SERVER-SENT EVENTS (SSE) (33-36)
// ============================================================================
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
const createNetworkStatusSSE = (service, config) => {
    return (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        const sendEvent = async () => {
            try {
                const data = await service.getStatus();
                const transformed = config.transform ? config.transform(data) : data;
                res.write(`event: ${config.eventName}\n`);
                res.write(`data: ${JSON.stringify(transformed)}\n`);
                res.write(`retry: ${config.retry || 10000}\n\n`);
            }
            catch (error) {
                res.write(`event: error\n`);
                res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            }
        };
        const intervalId = setInterval(sendEvent, config.interval || 5000);
        // Send initial event
        sendEvent();
        req.on('close', () => {
            clearInterval(intervalId);
            res.end();
        });
    };
};
exports.createNetworkStatusSSE = createNetworkStatusSSE;
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
const createNetworkMetricsSSE = (service, networkId) => {
    return new rxjs_1.Observable(observer => {
        const intervalId = setInterval(async () => {
            try {
                const metrics = await service.getMetrics(networkId);
                observer.next({
                    data: metrics,
                    type: 'metrics',
                });
            }
            catch (error) {
                observer.error(error);
            }
        }, 5000);
        return () => clearInterval(intervalId);
    });
};
exports.createNetworkMetricsSSE = createNetworkMetricsSSE;
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
const createNetworkAlertsSSE = (service) => {
    return (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const alertSubscription = service.subscribeToAlerts((alert) => {
            res.write(`event: alert\n`);
            res.write(`data: ${JSON.stringify(alert)}\n\n`);
        });
        req.on('close', () => {
            alertSubscription.unsubscribe();
            res.end();
        });
    };
};
exports.createNetworkAlertsSSE = createNetworkAlertsSSE;
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
const createNetworkTopologySSE = (service, networkId) => {
    return new rxjs_1.Observable(observer => {
        const checkChanges = async () => {
            try {
                const topology = await service.getTopology(networkId);
                observer.next({
                    data: topology,
                    type: 'topology',
                });
            }
            catch (error) {
                observer.error(error);
            }
        };
        const intervalId = setInterval(checkChanges, 10000);
        checkChanges(); // Initial check
        return () => clearInterval(intervalId);
    });
};
exports.createNetworkTopologySSE = createNetworkTopologySSE;
// ============================================================================
// WEBSOCKET GATEWAY (37-40)
// ============================================================================
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
const createNetworkEventsGateway = () => {
    let NetworkEventsGateway = (() => {
        let _classDecorators = [(0, websockets_1.WebSocketGateway)({
                namespace: 'network-events',
                cors: {
                    origin: '*',
                },
            })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _instanceExtraInitializers = [];
        let _server_decorators;
        let _server_initializers = [];
        let _server_extraInitializers = [];
        let _handleSubscribeNetwork_decorators;
        let _handleUnsubscribeNetwork_decorators;
        var NetworkEventsGateway = _classThis = class {
            constructor() {
                this.server = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _server_initializers, void 0));
                this.connections = (__runInitializers(this, _server_extraInitializers), new Map());
            }
            afterInit(server) {
                console.log('NetworkEventsGateway initialized');
            }
            handleConnection(client) {
                console.log(`Client connected: ${client.id}`);
                this.connections.set(client.id, client);
            }
            handleDisconnect(client) {
                console.log(`Client disconnected: ${client.id}`);
                this.connections.delete(client.id);
            }
            handleSubscribeNetwork(data, client) {
                client.join(`network:${data.networkId}`);
                return { event: 'subscribed', data: { networkId: data.networkId } };
            }
            handleUnsubscribeNetwork(data, client) {
                client.leave(`network:${data.networkId}`);
                return { event: 'unsubscribed', data: { networkId: data.networkId } };
            }
            emitNetworkEvent(networkId, event, data) {
                this.server.to(`network:${networkId}`).emit(event, data);
            }
            broadcastToAll(event, data) {
                this.server.emit(event, data);
            }
        };
        __setFunctionName(_classThis, "NetworkEventsGateway");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _server_decorators = [(0, websockets_1.WebSocketServer)()];
            _handleSubscribeNetwork_decorators = [(0, websockets_1.SubscribeMessage)('subscribe-network')];
            _handleUnsubscribeNetwork_decorators = [(0, websockets_1.SubscribeMessage)('unsubscribe-network')];
            __esDecorate(_classThis, null, _handleSubscribeNetwork_decorators, { kind: "method", name: "handleSubscribeNetwork", static: false, private: false, access: { has: obj => "handleSubscribeNetwork" in obj, get: obj => obj.handleSubscribeNetwork }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_classThis, null, _handleUnsubscribeNetwork_decorators, { kind: "method", name: "handleUnsubscribeNetwork", static: false, private: false, access: { has: obj => "handleUnsubscribeNetwork" in obj, get: obj => obj.handleUnsubscribeNetwork }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: obj => "server" in obj, get: obj => obj.server, set: (obj, value) => { obj.server = value; } }, metadata: _metadata }, _server_initializers, _server_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkEventsGateway = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkEventsGateway = _classThis;
    })();
    return NetworkEventsGateway;
};
exports.createNetworkEventsGateway = createNetworkEventsGateway;
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
const emitNetworkStatusEvent = (gateway, networkId, status) => {
    gateway.emitNetworkEvent(networkId, 'status-changed', {
        networkId,
        status,
        timestamp: new Date(),
    });
};
exports.emitNetworkStatusEvent = emitNetworkStatusEvent;
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
const emitNetworkMetricsEvent = (gateway, networkId, metrics) => {
    gateway.emitNetworkEvent(networkId, 'metrics-updated', {
        networkId,
        metrics,
        timestamp: new Date(),
    });
};
exports.emitNetworkMetricsEvent = emitNetworkMetricsEvent;
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
const emitNetworkAlertEvent = (gateway, networkId, alert) => {
    gateway.emitNetworkEvent(networkId, 'alert', {
        networkId,
        alert: {
            ...alert,
            timestamp: new Date(),
        },
    });
};
exports.emitNetworkAlertEvent = emitNetworkAlertEvent;
exports.default = {
    // Route Parameter Validation
    validateNetworkIdParam: exports.validateNetworkIdParam,
    validateIpAddressParam: exports.validateIpAddressParam,
    validatePortParam: exports.validatePortParam,
    validateVlanIdParam: exports.validateVlanIdParam,
    validateVniParam: exports.validateVniParam,
    validateMacAddressParam: exports.validateMacAddressParam,
    validateNetworkTypeParam: exports.validateNetworkTypeParam,
    createValidatedParamDecorator: exports.createValidatedParamDecorator,
    // Query Parameter Handling
    parseQueryParameters: exports.parseQueryParameters,
    createPaginationParams: exports.createPaginationParams,
    createSortingParams: exports.createSortingParams,
    createFilterParams: exports.createFilterParams,
    createDateRangeParams: exports.createDateRangeParams,
    createSearchParams: exports.createSearchParams,
    createIpRangeParams: exports.createIpRangeParams,
    createMetricsParams: exports.createMetricsParams,
    // Request Body Parsing
    validateRequestBody: exports.validateRequestBody,
    parseNetworkConfigBody: exports.parseNetworkConfigBody,
    parseRouteConfigBody: exports.parseRouteConfigBody,
    parseFirewallRuleBody: exports.parseFirewallRuleBody,
    parseQoSPolicyBody: exports.parseQoSPolicyBody,
    parseBulkOperationBody: exports.parseBulkOperationBody,
    sanitizeRequestBody: exports.sanitizeRequestBody,
    transformRequestBody: exports.transformRequestBody,
    mergeBodyWithDefaults: exports.mergeBodyWithDefaults,
    // File Upload Handling
    createNetworkConfigUploadStorage: exports.createNetworkConfigUploadStorage,
    validateNetworkConfigFile: exports.validateNetworkConfigFile,
    parseNetworkConfigFile: exports.parseNetworkConfigFile,
    createTopologyDiagramUploadInterceptor: exports.createTopologyDiagramUploadInterceptor,
    // Streaming Network Data
    createNetworkMetricsStream: exports.createNetworkMetricsStream,
    createNetworkLogStream: exports.createNetworkLogStream,
    createNetworkDataTransformStream: exports.createNetworkDataTransformStream,
    createNetworkDataWriteStream: exports.createNetworkDataWriteStream,
    // Server-Sent Events
    createNetworkStatusSSE: exports.createNetworkStatusSSE,
    createNetworkMetricsSSE: exports.createNetworkMetricsSSE,
    createNetworkAlertsSSE: exports.createNetworkAlertsSSE,
    createNetworkTopologySSE: exports.createNetworkTopologySSE,
    // WebSocket Gateway
    createNetworkEventsGateway: exports.createNetworkEventsGateway,
    emitNetworkStatusEvent: exports.emitNetworkStatusEvent,
    emitNetworkMetricsEvent: exports.emitNetworkMetricsEvent,
    emitNetworkAlertEvent: exports.emitNetworkAlertEvent,
};
//# sourceMappingURL=network-routing-handlers-kit.js.map