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

import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
  ParseUUIDPipe,
  ParseIntPipe,
  ParseArrayPipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  StreamableFile,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Request, Response } from 'express';
import { Observable, Subject, interval } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsEnum, IsOptional, IsArray, Min, Max, IsIP, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import * as multer from 'multer';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

interface WebSocketEventConfig {
  event: string;
  room?: string;
  broadcast?: boolean;
  transform?: (data: any) => any;
}

interface ApiVersionConfig {
  version: string;
  deprecated?: boolean;
  sunset?: Date;
  breaking?: boolean;
}

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
export const validateNetworkIdParam = (value: any): RouteValidationResult => {
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
export const validateIpAddressParam = (value: any, allowCIDR = false): RouteValidationResult => {
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
    const valid = testValue.split('.').every((part: string) => {
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
export const validatePortParam = (value: any): RouteValidationResult => {
  const port = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(port)) {
    return { valid: false, errors: ['Port must be a number'] };
  }

  if (port < 1 || port > 65535) {
    return { valid: false, errors: ['Port must be between 1 and 65535'] };
  }

  return { valid: true, errors: [], sanitized: port };
};

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
export const validateVlanIdParam = (value: any): RouteValidationResult => {
  const vlanId = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(vlanId)) {
    return { valid: false, errors: ['VLAN ID must be a number'] };
  }

  if (vlanId < 1 || vlanId > 4094) {
    return { valid: false, errors: ['VLAN ID must be between 1 and 4094'] };
  }

  return { valid: true, errors: [], sanitized: vlanId };
};

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
export const validateVniParam = (value: any): RouteValidationResult => {
  const vni = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(vni)) {
    return { valid: false, errors: ['VNI must be a number'] };
  }

  if (vni < 1 || vni > 16777215) {
    return { valid: false, errors: ['VNI must be between 1 and 16777215'] };
  }

  return { valid: true, errors: [], sanitized: vni };
};

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
export const validateMacAddressParam = (value: any): RouteValidationResult => {
  if (!value || typeof value !== 'string') {
    return { valid: false, errors: ['MAC address is required'] };
  }

  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

  if (!macRegex.test(value)) {
    return { valid: false, errors: ['Invalid MAC address format'] };
  }

  return { valid: true, errors: [], sanitized: value.toLowerCase().replace(/-/g, ':') };
};

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
export const validateNetworkTypeParam = (value: any): RouteValidationResult => {
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
export const createValidatedParamDecorator = (
  validator: (value: any) => RouteValidationResult,
  paramName: string,
) => {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.params[paramName];

    const result = validator(value);

    if (!result.valid) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.errors,
        field: paramName,
      });
    }

    return result.sanitized || value;
  })();
};

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
export const parseQueryParameters = (
  query: any,
  options: Record<string, QueryParamOptions>,
): any => {
  const result: any = {};
  const errors: string[] = [];

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
        } else {
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
        } else {
          value = Boolean(value);
        }
        break;

      case 'array':
        if (typeof value === 'string') {
          value = value.split(',').map(v => v.trim());
        } else if (!Array.isArray(value)) {
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
    throw new BadRequestException({
      message: 'Query parameter validation failed',
      errors,
    });
  }

  return result;
};

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
export const createPaginationParams = (query: any): any => {
  return parseQueryParameters(query, {
    page: { type: 'number', default: 1, min: 1 },
    limit: { type: 'number', default: 10, min: 1, max: 100 },
  });
};

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
export const createSortingParams = (query: any, allowedFields: string[]): any => {
  const { sortBy = allowedFields[0], order = 'ASC' } = query;

  if (!allowedFields.includes(sortBy)) {
    throw new BadRequestException({
      message: `Invalid sort field. Allowed fields: ${allowedFields.join(', ')}`,
    });
  }

  if (!['ASC', 'DESC'].includes(order.toUpperCase())) {
    throw new BadRequestException({
      message: 'Sort order must be ASC or DESC',
    });
  }

  return {
    sortBy,
    order: order.toUpperCase(),
  };
};

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
export const createFilterParams = (query: any, allowedFields: string[]): any => {
  const filters: any = {};

  Object.keys(query).forEach(key => {
    if (allowedFields.includes(key) && query[key] !== undefined) {
      filters[key] = query[key];
    }
  });

  return filters;
};

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
export const createDateRangeParams = (query: any): any => {
  const { startDate, endDate } = query;
  const result: any = {};

  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      throw new BadRequestException('Invalid startDate format');
    }
    result.startDate = start;
  }

  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      throw new BadRequestException('Invalid endDate format');
    }
    result.endDate = end;
  }

  if (result.startDate && result.endDate && result.startDate > result.endDate) {
    throw new BadRequestException('startDate must be before endDate');
  }

  return result;
};

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
export const createSearchParams = (query: any, searchFields: string[]): any => {
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
export const createIpRangeParams = (query: any): any => {
  const { startIp, endIp, cidr } = query;

  if (cidr) {
    const cidrResult = validateIpAddressParam(cidr, true);
    if (!cidrResult.valid) {
      throw new BadRequestException(cidrResult.errors[0]);
    }
    return { cidr: cidrResult.sanitized };
  }

  if (startIp || endIp) {
    const result: any = {};

    if (startIp) {
      const startResult = validateIpAddressParam(startIp);
      if (!startResult.valid) {
        throw new BadRequestException(`Invalid startIp: ${startResult.errors[0]}`);
      }
      result.startIp = startResult.sanitized;
    }

    if (endIp) {
      const endResult = validateIpAddressParam(endIp);
      if (!endResult.valid) {
        throw new BadRequestException(`Invalid endIp: ${endResult.errors[0]}`);
      }
      result.endIp = endResult.sanitized;
    }

    return result;
  }

  return null;
};

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
export const createMetricsParams = (query: any): any => {
  const validIntervals = ['1m', '5m', '15m', '30m', '1h', '6h', '24h'];
  const validAggregations = ['avg', 'min', 'max', 'sum', 'count'];

  return parseQueryParameters(query, {
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
export const validateRequestBody = (body: any, schema: RequestBodySchema): RouteValidationResult => {
  const errors: string[] = [];
  const sanitized: any = {};

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
export const parseNetworkConfigBody = (body: any): any => {
  const schema: RequestBodySchema = {
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

  const result = validateRequestBody(body, schema);

  if (!result.valid) {
    throw new BadRequestException({
      message: 'Invalid network configuration',
      errors: result.errors,
    });
  }

  return result.sanitized;
};

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
export const parseRouteConfigBody = (body: any): any => {
  const schema: RequestBodySchema = {
    fields: {
      destination: { type: 'string', required: true },
      gateway: { type: 'string', required: true },
      metric: { type: 'number', required: false },
      interface: { type: 'string', required: false },
      type: { type: 'string', required: false },
    },
  };

  const result = validateRequestBody(body, schema);

  if (!result.valid) {
    throw new BadRequestException({
      message: 'Invalid route configuration',
      errors: result.errors,
    });
  }

  return result.sanitized;
};

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
export const parseFirewallRuleBody = (body: any): any => {
  const schema: RequestBodySchema = {
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

  const result = validateRequestBody(body, schema);

  if (!result.valid) {
    throw new BadRequestException({
      message: 'Invalid firewall rule',
      errors: result.errors,
    });
  }

  // Validate action
  if (!['allow', 'deny'].includes(result.sanitized.action)) {
    throw new BadRequestException('Action must be "allow" or "deny"');
  }

  // Validate protocol
  if (!['tcp', 'udp', 'icmp', 'any'].includes(result.sanitized.protocol)) {
    throw new BadRequestException('Protocol must be tcp, udp, icmp, or any');
  }

  return result.sanitized;
};

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
export const parseQoSPolicyBody = (body: any): any => {
  const schema: RequestBodySchema = {
    fields: {
      name: { type: 'string', required: true },
      priority: { type: 'number', required: true },
      bandwidth: { type: 'object', required: true },
      latency: { type: 'object', required: false },
      trafficClass: { type: 'string', required: false },
    },
  };

  const result = validateRequestBody(body, schema);

  if (!result.valid) {
    throw new BadRequestException({
      message: 'Invalid QoS policy',
      errors: result.errors,
    });
  }

  return result.sanitized;
};

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
export const parseBulkOperationBody = (
  body: any,
  itemSchema: RequestBodySchema,
): any[] => {
  if (!body || !Array.isArray(body.items)) {
    throw new BadRequestException('Body must contain an "items" array');
  }

  const { items } = body;

  if (items.length === 0) {
    throw new BadRequestException('Items array cannot be empty');
  }

  if (items.length > 100) {
    throw new BadRequestException('Cannot process more than 100 items at once');
  }

  const validated = items.map((item: any, index: number) => {
    const result = validateRequestBody(item, itemSchema);
    if (!result.valid) {
      throw new BadRequestException({
        message: `Validation failed for item at index ${index}`,
        errors: result.errors,
      });
    }
    return result.sanitized;
  });

  return validated;
};

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
export const sanitizeRequestBody = (body: any): any => {
  if (typeof body === 'string') {
    return body
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  }

  if (Array.isArray(body)) {
    return body.map(item => sanitizeRequestBody(item));
  }

  if (typeof body === 'object' && body !== null) {
    const sanitized: any = {};
    Object.keys(body).forEach(key => {
      sanitized[key] = sanitizeRequestBody(body[key]);
    });
    return sanitized;
  }

  return body;
};

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
export const transformRequestBody = (
  body: any,
  transformers: Record<string, Function>,
): any => {
  const transformed = { ...body };

  Object.entries(transformers).forEach(([field, transformer]) => {
    if (transformed[field] !== undefined) {
      transformed[field] = transformer(transformed[field]);
    }
  });

  return transformed;
};

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
export const mergeBodyWithDefaults = (body: any, defaults: any): any => {
  return {
    ...defaults,
    ...body,
  };
};

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
export const createNetworkConfigUploadStorage = (config: FileUploadConfig): any => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, config.destination);
    },
    filename: (req, file, cb) => {
      if (config.filename) {
        cb(null, config.filename(req, file));
      } else {
        const timestamp = Date.now();
        const filename = `network-config-${timestamp}-${file.originalname}`;
        cb(null, filename);
      }
    },
  });
};

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
export const validateNetworkConfigFile = (
  file: any,
  config: FileUploadConfig,
): RouteValidationResult => {
  const errors: string[] = [];

  if (!file) {
    return { valid: false, errors: ['No file uploaded'] };
  }

  // Check file size
  if (file.size > config.maxSize) {
    errors.push(`File size exceeds maximum of ${config.maxSize} bytes`);
  }

  // Check MIME type
  if (!config.allowedMimeTypes.includes(file.mimetype)) {
    errors.push(
      `File type ${file.mimetype} not allowed. Allowed types: ${config.allowedMimeTypes.join(', ')}`,
    );
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
export const parseNetworkConfigFile = async (
  filePath: string,
  format: string,
): Promise<any> => {
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
  } catch (error: any) {
    throw new BadRequestException(`Failed to parse config file: ${error.message}`);
  }
};

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
export const createTopologyDiagramUploadInterceptor = (config: FileUploadConfig): any => {
  return {
    fileFilter: (req: any, file: any, cb: any) => {
      if (config.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Invalid file type'), false);
      }
    },
    limits: {
      fileSize: config.maxSize,
    },
    storage: createNetworkConfigUploadStorage(config),
  };
};

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
export const createNetworkMetricsStream = (
  dataSource: () => Promise<any>,
  config?: StreamConfig,
): any => {
  const { Readable } = require('stream');

  return new Readable({
    objectMode: true,
    highWaterMark: config?.highWaterMark || 16,
    async read() {
      try {
        const data = await dataSource();
        this.push(JSON.stringify(data) + '\n');
      } catch (error) {
        this.destroy(error as Error);
      }
    },
  });
};

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
export const createNetworkLogStream = (filePath: string, config?: StreamConfig): any => {
  return createReadStream(filePath, {
    encoding: config?.encoding || 'utf-8',
    highWaterMark: config?.highWaterMark || 64 * 1024,
  });
};

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
export const createNetworkDataTransformStream = (transformer: (data: any) => any): any => {
  const { Transform } = require('stream');

  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      try {
        const data = JSON.parse(chunk.toString());
        const transformed = transformer(data);
        callback(null, JSON.stringify(transformed) + '\n');
      } catch (error) {
        callback(error as Error);
      }
    },
  });
};

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
export const createNetworkDataWriteStream = (filePath: string, config?: StreamConfig): any => {
  return createWriteStream(filePath, {
    encoding: config?.encoding || 'utf-8',
    highWaterMark: config?.highWaterMark || 64 * 1024,
  });
};

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
export const createNetworkStatusSSE = (service: any, config: SSEConfig) => {
  return (req: Request, res: Response) => {
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
      } catch (error: any) {
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
export const createNetworkMetricsSSE = (service: any, networkId: string): Observable<any> => {
  return new Observable(observer => {
    const intervalId = setInterval(async () => {
      try {
        const metrics = await service.getMetrics(networkId);
        observer.next({
          data: metrics,
          type: 'metrics',
        });
      } catch (error) {
        observer.error(error);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  });
};

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
export const createNetworkAlertsSSE = (service: any) => {
  return (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const alertSubscription = service.subscribeToAlerts((alert: any) => {
      res.write(`event: alert\n`);
      res.write(`data: ${JSON.stringify(alert)}\n\n`);
    });

    req.on('close', () => {
      alertSubscription.unsubscribe();
      res.end();
    });
  };
};

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
export const createNetworkTopologySSE = (service: any, networkId: string): Observable<any> => {
  return new Observable(observer => {
    const checkChanges = async () => {
      try {
        const topology = await service.getTopology(networkId);
        observer.next({
          data: topology,
          type: 'topology',
        });
      } catch (error) {
        observer.error(error);
      }
    };

    const intervalId = setInterval(checkChanges, 10000);
    checkChanges(); // Initial check

    return () => clearInterval(intervalId);
  });
};

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
export const createNetworkEventsGateway = (): any => {
  @WebSocketGateway({
    namespace: 'network-events',
    cors: {
      origin: '*',
    },
  })
  class NetworkEventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private connections = new Map<string, Socket>();

    afterInit(server: Server) {
      console.log('NetworkEventsGateway initialized');
    }

    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
      this.connections.set(client.id, client);
    }

    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      this.connections.delete(client.id);
    }

    @SubscribeMessage('subscribe-network')
    handleSubscribeNetwork(@MessageBody() data: { networkId: string }, @ConnectedSocket() client: Socket) {
      client.join(`network:${data.networkId}`);
      return { event: 'subscribed', data: { networkId: data.networkId } };
    }

    @SubscribeMessage('unsubscribe-network')
    handleUnsubscribeNetwork(@MessageBody() data: { networkId: string }, @ConnectedSocket() client: Socket) {
      client.leave(`network:${data.networkId}`);
      return { event: 'unsubscribed', data: { networkId: data.networkId } };
    }

    emitNetworkEvent(networkId: string, event: string, data: any) {
      this.server.to(`network:${networkId}`).emit(event, data);
    }

    broadcastToAll(event: string, data: any) {
      this.server.emit(event, data);
    }
  }

  return NetworkEventsGateway;
};

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
export const emitNetworkStatusEvent = (gateway: any, networkId: string, status: any): void => {
  gateway.emitNetworkEvent(networkId, 'status-changed', {
    networkId,
    status,
    timestamp: new Date(),
  });
};

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
export const emitNetworkMetricsEvent = (gateway: any, networkId: string, metrics: any): void => {
  gateway.emitNetworkEvent(networkId, 'metrics-updated', {
    networkId,
    metrics,
    timestamp: new Date(),
  });
};

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
export const emitNetworkAlertEvent = (gateway: any, networkId: string, alert: any): void => {
  gateway.emitNetworkEvent(networkId, 'alert', {
    networkId,
    alert: {
      ...alert,
      timestamp: new Date(),
    },
  });
};

export default {
  // Route Parameter Validation
  validateNetworkIdParam,
  validateIpAddressParam,
  validatePortParam,
  validateVlanIdParam,
  validateVniParam,
  validateMacAddressParam,
  validateNetworkTypeParam,
  createValidatedParamDecorator,

  // Query Parameter Handling
  parseQueryParameters,
  createPaginationParams,
  createSortingParams,
  createFilterParams,
  createDateRangeParams,
  createSearchParams,
  createIpRangeParams,
  createMetricsParams,

  // Request Body Parsing
  validateRequestBody,
  parseNetworkConfigBody,
  parseRouteConfigBody,
  parseFirewallRuleBody,
  parseQoSPolicyBody,
  parseBulkOperationBody,
  sanitizeRequestBody,
  transformRequestBody,
  mergeBodyWithDefaults,

  // File Upload Handling
  createNetworkConfigUploadStorage,
  validateNetworkConfigFile,
  parseNetworkConfigFile,
  createTopologyDiagramUploadInterceptor,

  // Streaming Network Data
  createNetworkMetricsStream,
  createNetworkLogStream,
  createNetworkDataTransformStream,
  createNetworkDataWriteStream,

  // Server-Sent Events
  createNetworkStatusSSE,
  createNetworkMetricsSSE,
  createNetworkAlertsSSE,
  createNetworkTopologySSE,

  // WebSocket Gateway
  createNetworkEventsGateway,
  emitNetworkStatusEvent,
  emitNetworkMetricsEvent,
  emitNetworkAlertEvent,
};
