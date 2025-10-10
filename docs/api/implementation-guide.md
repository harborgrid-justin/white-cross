# Health Records API Implementation Guide

## Overview

This guide provides practical implementation details for transitioning the current Health Records API to the SOA-compliant architecture specified in `health-records-api-spec.md`.

## Current Implementation Analysis

### Current Architecture (As-Is)

**Framework:** Hapi.js with TypeScript
**Authentication:** JWT via @hapi/jwt plugin
**Database:** PostgreSQL with Prisma ORM
**Route Pattern:** Mixed patterns (some `/api/health-records/student/{studentId}`, some student-centric)

### Key Issues Identified

1. **Inconsistent Resource Hierarchy**
   - Current: `/api/health-records/student/{studentId}`
   - Target: `/api/v1/students/{studentId}/health-records`

2. **No API Versioning**
   - All routes under `/api/*` without version prefix
   - Difficult to manage breaking changes

3. **Inconsistent Response Format**
   - Some responses: `{ success: true, data: { healthRecord } }`
   - Others: `{ success: true, data: result }`
   - No standardized error responses

4. **Missing HATEOAS Links**
   - No navigational links in responses
   - Client cannot discover related resources

5. **Limited Audit Logging**
   - Basic logging exists but incomplete
   - Missing comprehensive PHI access tracking

6. **No Rate Limiting**
   - API vulnerable to abuse

7. **Incomplete Pagination**
   - Basic pagination exists but missing:
     - Total pages calculation
     - Navigation links
     - Cursor-based option

## Implementation Phases

### Phase 1: Foundation (2 weeks)

#### 1.1 API Versioning

**Create version middleware:**

```typescript
// backend/src/middleware/versioning.ts
import { Request, ResponseToolkit } from '@hapi/hapi';

export const versionMiddleware = (request: Request, h: ResponseToolkit) => {
  // Extract version from URL path
  const pathParts = request.path.split('/');
  const versionMatch = pathParts.find(part => part.match(/^v\d+$/));

  if (!versionMatch) {
    throw new Error('API version required in path');
  }

  request.app.apiVersion = versionMatch;
  return h.continue;
};

// Validate API version
export const validateApiVersion = (request: Request, h: ResponseToolkit) => {
  const version = request.app.apiVersion;
  const supportedVersions = ['v1'];

  if (!supportedVersions.includes(version)) {
    return h.response({
      success: false,
      error: {
        code: 'UNSUPPORTED_API_VERSION',
        message: `API version ${version} is not supported. Supported versions: ${supportedVersions.join(', ')}`
      }
    }).code(400).takeover();
  }

  return h.continue;
};
```

**Update route registration:**

```typescript
// backend/src/routes/index.ts
import { Server } from '@hapi/hapi';
import { healthRecordRoutesV1 } from './v1/healthRecords';

export const registerRoutes = async (server: Server) => {
  // Register v1 routes
  server.route(healthRecordRoutesV1);

  // Keep legacy routes for backwards compatibility (temporary)
  server.route(legacyHealthRecordRoutes);
};
```

#### 1.2 Response Envelope Standardization

**Create response wrapper utility:**

```typescript
// backend/src/utils/responseWrapper.ts
import { ResponseToolkit } from '@hapi/hapi';
import { v4 as uuidv4 } from 'uuid';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    pagination?: PaginationMetadata;
    _links?: HateoasLinks;
    [key: string]: any;
  };
  timestamp: string;
  requestId: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface HateoasLinks {
  self: { href: string };
  first?: { href: string };
  previous?: { href: string };
  next?: { href: string };
  last?: { href: string };
  [key: string]: { href: string } | undefined;
}

export class ResponseWrapper {
  static success<T>(
    h: ResponseToolkit,
    data: T,
    statusCode: number = 200,
    meta?: any
  ): any {
    const response: ApiSuccessResponse<T> = {
      success: true,
      data,
      ...(meta && { meta }),
      timestamp: new Date().toISOString(),
      requestId: h.request.headers['x-request-id'] || uuidv4()
    };

    return h.response(response).code(statusCode);
  }

  static error(
    h: ResponseToolkit,
    code: string,
    message: string,
    statusCode: number = 500,
    details?: any
  ): any {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        ...(details && { details })
      },
      timestamp: new Date().toISOString(),
      requestId: h.request.headers['x-request-id'] || uuidv4()
    };

    return h.response(response).code(statusCode);
  }

  static validationError(
    h: ResponseToolkit,
    fields: Array<{ field: string; message: string; code: string; value?: any }>
  ): any {
    return this.error(
      h,
      'VALIDATION_ERROR',
      'Request validation failed',
      422,
      { fields }
    );
  }
}
```

**Create pagination utility:**

```typescript
// backend/src/utils/pagination.ts
export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  baseUrl: string;
  queryParams?: Record<string, any>;
}

export class PaginationHelper {
  static buildMetadata(options: PaginationOptions): {
    pagination: PaginationMetadata;
    _links: HateoasLinks;
  } {
    const { page, limit, total, baseUrl, queryParams = {} } = options;
    const totalPages = Math.ceil(total / limit);

    const buildUrl = (pageNum: number) => {
      const params = new URLSearchParams({
        ...queryParams,
        page: pageNum.toString(),
        limit: limit.toString()
      });
      return `${baseUrl}?${params.toString()}`;
    };

    const pagination: PaginationMetadata = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };

    const _links: HateoasLinks = {
      self: { href: buildUrl(page) },
      first: { href: buildUrl(1) },
      last: { href: buildUrl(totalPages) }
    };

    if (pagination.hasPreviousPage) {
      _links.previous = { href: buildUrl(page - 1) };
    }

    if (pagination.hasNextPage) {
      _links.next = { href: buildUrl(page + 1) };
    }

    return { pagination, _links };
  }
}
```

#### 1.3 Request ID Middleware

```typescript
// backend/src/middleware/requestId.ts
import { Request, ResponseToolkit } from '@hapi/hapi';
import { v4 as uuidv4 } from 'uuid';

export const requestIdMiddleware = (request: Request, h: ResponseToolkit) => {
  // Use client-provided request ID or generate new one
  const requestId = request.headers['x-request-id'] || `req_${uuidv4()}`;
  request.headers['x-request-id'] = requestId;

  // Add to response headers
  h.response().header('X-Request-ID', requestId);

  return h.continue;
};
```

#### 1.4 Error Code Enum

```typescript
// backend/src/constants/errorCodes.ts
export enum ErrorCode {
  // Authentication & Authorization
  AUTH_TOKEN_MISSING = 'AUTH_TOKEN_MISSING',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_VALUE = 'INVALID_VALUE',
  INVALID_DATE = 'INVALID_DATE',
  FUTURE_DATE_NOT_ALLOWED = 'FUTURE_DATE_NOT_ALLOWED',

  // Business Logic
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  STUDENT_NOT_FOUND = 'STUDENT_NOT_FOUND',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
  DUPLICATE_ALLERGY = 'DUPLICATE_ALLERGY',
  INVALID_OPERATION = 'INVALID_OPERATION',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Server Errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.AUTH_TOKEN_MISSING]: 'Authentication token is required',
  [ErrorCode.AUTH_TOKEN_INVALID]: 'Authentication token is invalid',
  [ErrorCode.AUTH_TOKEN_EXPIRED]: 'Authentication token has expired',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions to perform this action',
  [ErrorCode.VALIDATION_ERROR]: 'Request validation failed',
  [ErrorCode.REQUIRED_FIELD]: 'Required field is missing',
  [ErrorCode.INVALID_FORMAT]: 'Invalid field format',
  [ErrorCode.INVALID_VALUE]: 'Invalid field value',
  [ErrorCode.INVALID_DATE]: 'Invalid date format',
  [ErrorCode.FUTURE_DATE_NOT_ALLOWED]: 'Future dates are not allowed',
  [ErrorCode.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ErrorCode.STUDENT_NOT_FOUND]: 'Student not found',
  [ErrorCode.RECORD_NOT_FOUND]: 'Health record not found',
  [ErrorCode.DUPLICATE_RESOURCE]: 'Resource already exists',
  [ErrorCode.DUPLICATE_ALLERGY]: 'Allergy already exists for this student',
  [ErrorCode.INVALID_OPERATION]: 'Invalid operation',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded. Please try again later.',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ErrorCode.DATABASE_ERROR]: 'Database error occurred',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable'
};
```

#### 1.5 Updated Route Example

```typescript
// backend/src/routes/v1/healthRecords.ts
import { ServerRoute } from '@hapi/hapi';
import { HealthRecordService } from '../../services/healthRecordService';
import { ResponseWrapper } from '../../utils/responseWrapper';
import { PaginationHelper } from '../../utils/pagination';
import { ErrorCode, ErrorMessages } from '../../constants/errorCodes';
import { HateoasHelper } from '../../utils/hateoas';
import Joi from 'joi';

const getStudentHealthRecordsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const filters: any = {};
    if (request.query.type) filters.type = request.query.type;
    if (request.query.dateFrom) filters.dateFrom = new Date(request.query.dateFrom);
    if (request.query.dateTo) filters.dateTo = new Date(request.query.dateTo);
    if (request.query.provider) filters.provider = request.query.provider;

    const result = await HealthRecordService.getStudentHealthRecords(
      studentId,
      page,
      limit,
      filters
    );

    // Build pagination metadata and links
    const baseUrl = `/api/v1/students/${studentId}/health-records`;
    const paginationMeta = PaginationHelper.buildMetadata({
      page,
      limit,
      total: result.pagination.total,
      baseUrl,
      queryParams: request.query
    });

    // Add HATEOAS links to each record
    const recordsWithLinks = result.records.map(record => ({
      ...record,
      _links: HateoasHelper.buildHealthRecordLinks(record.id, studentId)
    }));

    return ResponseWrapper.success(
      h,
      { records: recordsWithLinks },
      200,
      paginationMeta
    );
  } catch (error) {
    const err = error as Error;

    if (err.message === 'Student not found') {
      return ResponseWrapper.error(
        h,
        ErrorCode.STUDENT_NOT_FOUND,
        ErrorMessages[ErrorCode.STUDENT_NOT_FOUND],
        404
      );
    }

    return ResponseWrapper.error(
      h,
      ErrorCode.INTERNAL_SERVER_ERROR,
      ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR],
      500
    );
  }
};

export const healthRecordRoutesV1: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/v1/students/{studentId}/health-records',
    handler: getStudentHealthRecordsHandler,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required()
        }),
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          type: Joi.string().valid(
            'CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY',
            'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH',
            'DENTAL', 'VISION', 'HEARING'
          ).optional(),
          dateFrom: Joi.date().iso().optional(),
          dateTo: Joi.date().iso().optional(),
          provider: Joi.string().optional(),
          sortBy: Joi.string().valid('date', 'type', 'provider').optional(),
          sortOrder: Joi.string().valid('asc', 'desc').default('desc').optional()
        })
      },
      tags: ['api', 'health-records']
    }
  }
];
```

#### 1.6 HATEOAS Helper

```typescript
// backend/src/utils/hateoas.ts
export class HateoasHelper {
  static buildHealthRecordLinks(recordId: string, studentId: string) {
    return {
      self: {
        href: `/api/v1/health-records/${recordId}`
      },
      student: {
        href: `/api/v1/students/${studentId}`
      },
      'student-health-records': {
        href: `/api/v1/students/${studentId}/health-records`
      }
    };
  }

  static buildAllergyLinks(allergyId: string, studentId: string) {
    return {
      self: {
        href: `/api/v1/allergies/${allergyId}`
      },
      student: {
        href: `/api/v1/students/${studentId}`
      },
      'student-allergies': {
        href: `/api/v1/students/${studentId}/allergies`
      },
      verify: {
        href: `/api/v1/allergies/${allergyId}/verify`
      }
    };
  }

  static buildChronicConditionLinks(conditionId: string, studentId: string) {
    return {
      self: {
        href: `/api/v1/chronic-conditions/${conditionId}`
      },
      student: {
        href: `/api/v1/students/${studentId}`
      },
      'student-chronic-conditions': {
        href: `/api/v1/students/${studentId}/chronic-conditions`
      }
    };
  }
}
```

### Phase 2: Security Enhancements (2 weeks)

#### 2.1 Comprehensive Audit Logging

**Create audit logger service:**

```typescript
// backend/src/services/auditLogService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuditLogData {
  userId: string;
  userRole: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'IMPORT';
  resource: string;
  resourceId?: string;
  studentId?: string;
  success: boolean;
  errorCode?: string;
  ipAddress: string;
  userAgent: string;
  schoolId?: string;
  districtId?: string;
  requestId: string;
  changes?: any;
  metadata?: any;
}

export class AuditLogService {
  static async log(data: AuditLogData): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          entityType: data.resource,
          entityId: data.resourceId,
          changes: data.changes,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          createdAt: new Date()
        }
      });

      // For PHI access, also log to separate PHI access log
      if (this.isPHI(data.resource)) {
        await this.logPHIAccess(data);
      }
    } catch (error) {
      // Critical: Audit logging should never fail silently
      console.error('CRITICAL: Audit logging failed', error);
      // Consider: Alert monitoring system
    }
  }

  private static isPHI(resource: string): boolean {
    const phiResources = [
      'health-records',
      'allergies',
      'chronic-conditions',
      'vaccinations',
      'vitals'
    ];
    return phiResources.includes(resource);
  }

  private static async logPHIAccess(data: AuditLogData): Promise<void> {
    // Separate, append-only PHI access log for HIPAA compliance
    // Could be separate database, file system, or audit service
    await prisma.$executeRaw`
      INSERT INTO phi_access_log (
        timestamp, user_id, user_role, action, resource_type,
        resource_id, student_id, ip_address, user_agent,
        school_id, district_id, request_id, success
      ) VALUES (
        NOW(), ${data.userId}, ${data.userRole}, ${data.action},
        ${data.resource}, ${data.resourceId}, ${data.studentId},
        ${data.ipAddress}, ${data.userAgent}, ${data.schoolId},
        ${data.districtId}, ${data.requestId}, ${data.success}
      )
    `;
  }

  static async getAuditTrail(filters: {
    studentId?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    action?: string;
    resource?: string;
  }): Promise<any[]> {
    // Build where clause
    const where: any = {};

    if (filters.studentId) {
      where.entityId = filters.studentId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.resource) {
      where.entityType = filters.resource;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    return prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 1000 // Limit for safety
    });
  }
}
```

**Create audit middleware:**

```typescript
// backend/src/middleware/audit.ts
import { Request, ResponseToolkit } from '@hapi/hapi';
import { AuditLogService } from '../services/auditLogService';

export const auditMiddleware = async (request: Request, h: ResponseToolkit) => {
  const startTime = Date.now();

  // After response is sent
  request.events.once('response', async () => {
    const user = request.auth.credentials as any;
    const duration = Date.now() - startTime;

    // Determine action from HTTP method
    const actionMap: Record<string, string> = {
      'GET': 'READ',
      'POST': 'CREATE',
      'PUT': 'UPDATE',
      'PATCH': 'UPDATE',
      'DELETE': 'DELETE'
    };

    const action = actionMap[request.method.toUpperCase()] || 'READ';

    // Extract resource info from path
    const pathParts = request.path.split('/');
    const resource = pathParts[3]; // e.g., /api/v1/health-records -> health-records
    const resourceId = pathParts[4] || undefined;

    // Extract student ID from params or payload
    const studentId = request.params?.studentId ||
                     (request.payload as any)?.studentId ||
                     undefined;

    await AuditLogService.log({
      userId: user?.userId || 'anonymous',
      userRole: user?.role || 'UNKNOWN',
      action: action as any,
      resource,
      resourceId,
      studentId,
      success: request.response.statusCode < 400,
      errorCode: request.response.statusCode >= 400
        ? (request.response.source as any)?.error?.code
        : undefined,
      ipAddress: request.info.remoteAddress,
      userAgent: request.headers['user-agent'] || 'unknown',
      schoolId: user?.schoolId,
      districtId: user?.districtId,
      requestId: request.headers['x-request-id'],
      metadata: {
        method: request.method,
        path: request.path,
        duration,
        statusCode: request.response.statusCode
      }
    });
  });

  return h.continue;
};
```

#### 2.2 Rate Limiting Implementation

```typescript
// backend/src/middleware/rateLimiter.ts
import { Request, ResponseToolkit } from '@hapi/hapi';
import Redis from 'ioredis';
import { ResponseWrapper } from '../utils/responseWrapper';
import { ErrorCode } from '../constants/errorCodes';

const redis = new Redis(process.env.REDIS_URL);

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  middleware = async (request: Request, h: ResponseToolkit) => {
    const user = request.auth.credentials as any;
    const key = `${this.config.keyPrefix}:${user?.userId || request.info.remoteAddress}`;

    try {
      // Increment request count
      const count = await redis.incr(key);

      // Set expiry on first request
      if (count === 1) {
        await redis.pexpire(key, this.config.windowMs);
      }

      // Get TTL for Retry-After header
      const ttl = await redis.pttl(key);
      const resetTime = Math.floor(Date.now() / 1000) + Math.ceil(ttl / 1000);

      // Set rate limit headers
      h.response().header('X-RateLimit-Limit', this.config.maxRequests.toString());
      h.response().header('X-RateLimit-Remaining', Math.max(0, this.config.maxRequests - count).toString());
      h.response().header('X-RateLimit-Reset', resetTime.toString());

      // Check if limit exceeded
      if (count > this.config.maxRequests) {
        const retryAfter = Math.ceil(ttl / 1000);

        return ResponseWrapper.error(
          h,
          ErrorCode.RATE_LIMIT_EXCEEDED,
          'Rate limit exceeded. Please try again later.',
          429,
          {
            limit: this.config.maxRequests,
            window: `${this.config.windowMs / 1000} seconds`,
            retryAfter
          }
        ).header('Retry-After', retryAfter.toString()).takeover();
      }

      return h.continue;
    } catch (error) {
      // If Redis fails, allow request but log error
      console.error('Rate limiter error:', error);
      return h.continue;
    }
  };
}

// Create rate limiters for different user types
export const userRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  keyPrefix: 'ratelimit:user'
});

export const adminRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 200,
  keyPrefix: 'ratelimit:admin'
});
```

#### 2.3 Enhanced RBAC

```typescript
// backend/src/middleware/authorization.ts
import { Request, ResponseToolkit } from '@hapi/hapi';
import { ResponseWrapper } from '../utils/responseWrapper';
import { ErrorCode } from '../constants/errorCodes';

export enum Permission {
  HEALTH_RECORDS_READ = 'health-records:read',
  HEALTH_RECORDS_CREATE = 'health-records:create',
  HEALTH_RECORDS_UPDATE = 'health-records:update',
  HEALTH_RECORDS_DELETE = 'health-records:delete',
  ALLERGIES_READ = 'allergies:read',
  ALLERGIES_MANAGE = 'allergies:manage',
  CHRONIC_CONDITIONS_READ = 'chronic-conditions:read',
  CHRONIC_CONDITIONS_MANAGE = 'chronic-conditions:manage',
  ADMIN_ACCESS = 'admin:access'
}

const RolePermissions: Record<string, Permission[]> = {
  ADMIN: [
    Permission.HEALTH_RECORDS_READ,
    Permission.HEALTH_RECORDS_CREATE,
    Permission.HEALTH_RECORDS_UPDATE,
    Permission.HEALTH_RECORDS_DELETE,
    Permission.ALLERGIES_READ,
    Permission.ALLERGIES_MANAGE,
    Permission.CHRONIC_CONDITIONS_READ,
    Permission.CHRONIC_CONDITIONS_MANAGE,
    Permission.ADMIN_ACCESS
  ],
  NURSE: [
    Permission.HEALTH_RECORDS_READ,
    Permission.HEALTH_RECORDS_CREATE,
    Permission.HEALTH_RECORDS_UPDATE,
    Permission.ALLERGIES_READ,
    Permission.ALLERGIES_MANAGE,
    Permission.CHRONIC_CONDITIONS_READ,
    Permission.CHRONIC_CONDITIONS_MANAGE
  ],
  SCHOOL_ADMIN: [
    Permission.HEALTH_RECORDS_READ,
    Permission.ALLERGIES_READ,
    Permission.CHRONIC_CONDITIONS_READ
  ],
  DISTRICT_ADMIN: [
    Permission.HEALTH_RECORDS_READ,
    Permission.ALLERGIES_READ,
    Permission.CHRONIC_CONDITIONS_READ
  ],
  VIEWER: [
    Permission.HEALTH_RECORDS_READ,
    Permission.ALLERGIES_READ,
    Permission.CHRONIC_CONDITIONS_READ
  ],
  COUNSELOR: [
    Permission.HEALTH_RECORDS_READ,
    Permission.HEALTH_RECORDS_CREATE
  ]
};

export const requirePermission = (...permissions: Permission[]) => {
  return (request: Request, h: ResponseToolkit) => {
    const user = request.auth.credentials as any;

    if (!user) {
      return ResponseWrapper.error(
        h,
        ErrorCode.AUTH_TOKEN_MISSING,
        'Authentication required',
        401
      ).takeover();
    }

    const userPermissions = RolePermissions[user.role] || [];
    const hasPermission = permissions.some(p => userPermissions.includes(p));

    if (!hasPermission) {
      return ResponseWrapper.error(
        h,
        ErrorCode.INSUFFICIENT_PERMISSIONS,
        'Insufficient permissions to perform this action',
        403,
        {
          required: permissions,
          userRole: user.role
        }
      ).takeover();
    }

    return h.continue;
  };
};

// Usage in routes:
// options: {
//   auth: 'jwt',
//   pre: [
//     { method: requirePermission(Permission.HEALTH_RECORDS_DELETE) }
//   ]
// }
```

### Phase 3: Testing Implementation

#### 3.1 Unit Tests

```typescript
// backend/tests/unit/utils/responseWrapper.test.ts
import { describe, it, expect } from '@jest/globals';
import { ResponseWrapper } from '../../../src/utils/responseWrapper';

describe('ResponseWrapper', () => {
  describe('success', () => {
    it('should create success response with correct structure', () => {
      const mockH = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn().mockReturnThis(),
        request: {
          headers: { 'x-request-id': 'test-123' }
        }
      };

      const data = { id: '1', name: 'Test' };
      ResponseWrapper.success(mockH as any, data, 200);

      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data,
          timestamp: expect.any(String),
          requestId: 'test-123'
        })
      );
      expect(mockH.code).toHaveBeenCalledWith(200);
    });
  });

  describe('error', () => {
    it('should create error response with correct structure', () => {
      const mockH = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn().mockReturnThis(),
        request: {
          headers: {}
        }
      };

      ResponseWrapper.error(
        mockH as any,
        'TEST_ERROR',
        'Test error message',
        400
      );

      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: {
            code: 'TEST_ERROR',
            message: 'Test error message'
          },
          timestamp: expect.any(String),
          requestId: expect.any(String)
        })
      );
      expect(mockH.code).toHaveBeenCalledWith(400);
    });
  });
});
```

#### 3.2 Integration Tests

```typescript
// backend/tests/integration/healthRecords.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { Server } from '@hapi/hapi';
import { initServer } from '../../src/server';

describe('Health Records API v1', () => {
  let server: Server;
  let authToken: string;

  beforeAll(async () => {
    server = await initServer();
    // Get auth token
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'test@example.com',
        password: 'testpassword'
      }
    });
    authToken = JSON.parse(loginResponse.payload).data.token;
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('GET /api/v1/students/{studentId}/health-records', () => {
    it('should return paginated health records', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/students/clx123/health-records?page=1&limit=20',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body).toMatchObject({
        success: true,
        data: {
          records: expect.any(Array)
        },
        meta: {
          pagination: {
            page: 1,
            limit: 20,
            total: expect.any(Number),
            totalPages: expect.any(Number),
            hasNextPage: expect.any(Boolean),
            hasPreviousPage: false
          },
          _links: expect.objectContaining({
            self: { href: expect.any(String) },
            first: { href: expect.any(String) }
          })
        },
        timestamp: expect.any(String),
        requestId: expect.any(String)
      });
    });

    it('should return 401 without authentication', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/students/clx123/health-records'
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('AUTH_TOKEN_MISSING');
    });

    it('should return 404 for non-existent student', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/students/nonexistent/health-records',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.payload);
      expect(body.error.code).toBe('STUDENT_NOT_FOUND');
    });
  });

  describe('POST /api/v1/health-records', () => {
    it('should create health record with valid data', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/health-records',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        payload: {
          studentId: 'clx123',
          type: 'CHECKUP',
          date: '2024-01-20T10:00:00Z',
          description: 'Annual physical examination',
          provider: 'Dr. Smith',
          vital: {
            temperature: 98.6,
            heartRate: 72
          }
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('id');
      expect(body.data._links).toHaveProperty('self');
    });

    it('should return validation error for invalid data', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/health-records',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        payload: {
          type: 'INVALID_TYPE',
          description: 'Too short'
        }
      });

      expect(response.statusCode).toBe(422);
      const body = JSON.parse(response.payload);
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.details.fields).toBeInstanceOf(Array);
    });
  });
});
```

### Phase 4: Frontend Integration

#### 4.1 Update API Client

```typescript
// frontend/src/services/api/healthRecordsApiV1.ts
import { apiInstance } from '../config/apiConfig';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    pagination?: PaginationMetadata;
    _links?: any;
  };
  timestamp: string;
  requestId: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
}

class HealthRecordsApiV1 {
  private baseUrl = '/api/v1';

  async getStudentHealthRecords(
    studentId: string,
    params?: {
      page?: number;
      limit?: number;
      type?: string;
      dateFrom?: string;
      dateTo?: string;
      provider?: string;
    }
  ): Promise<ApiResponse<{ records: HealthRecord[] }>> {
    const response = await apiInstance.get(
      `${this.baseUrl}/students/${studentId}/health-records`,
      { params }
    );
    return response.data;
  }

  async createHealthRecord(
    data: CreateHealthRecordRequest
  ): Promise<ApiResponse<HealthRecord>> {
    const response = await apiInstance.post(
      `${this.baseUrl}/health-records`,
      data
    );
    return response.data;
  }

  async updateHealthRecord(
    recordId: string,
    data: Partial<HealthRecord>
  ): Promise<ApiResponse<HealthRecord>> {
    const response = await apiInstance.patch(
      `${this.baseUrl}/health-records/${recordId}`,
      data
    );
    return response.data;
  }

  async deleteHealthRecord(recordId: string): Promise<void> {
    await apiInstance.delete(
      `${this.baseUrl}/health-records/${recordId}`
    );
  }
}

export const healthRecordsApiV1 = new HealthRecordsApiV1();
```

#### 4.2 Update React Query Hooks

```typescript
// frontend/src/hooks/useHealthRecords.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthRecordsApiV1 } from '../services/api/healthRecordsApiV1';

export const useStudentHealthRecords = (
  studentId: string,
  params?: {
    page?: number;
    limit?: number;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }
) => {
  return useQuery({
    queryKey: ['health-records', studentId, params],
    queryFn: () => healthRecordsApiV1.getStudentHealthRecords(studentId, params),
    enabled: !!studentId
  });
};

export const useCreateHealthRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: healthRecordsApiV1.createHealthRecord,
    onSuccess: (data) => {
      // Invalidate and refetch student health records
      queryClient.invalidateQueries({
        queryKey: ['health-records', data.data.studentId]
      });

      // Also invalidate health summary
      queryClient.invalidateQueries({
        queryKey: ['health-summary', data.data.studentId]
      });
    }
  });
};

export const useUpdateHealthRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recordId, data }: { recordId: string; data: Partial<HealthRecord> }) =>
      healthRecordsApiV1.updateHealthRecord(recordId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['health-records', data.data.studentId]
      });
    }
  });
};
```

## Database Migration Script

```typescript
// backend/scripts/migrateToV1.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  console.log('Starting migration to v1 API structure...');

  // 1. Create PHI access log table
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS phi_access_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
      user_id VARCHAR(255) NOT NULL,
      user_role VARCHAR(50) NOT NULL,
      action VARCHAR(50) NOT NULL,
      resource_type VARCHAR(100) NOT NULL,
      resource_id VARCHAR(255),
      student_id VARCHAR(255),
      ip_address VARCHAR(45),
      user_agent TEXT,
      school_id VARCHAR(255),
      district_id VARCHAR(255),
      request_id VARCHAR(255),
      success BOOLEAN NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  // 2. Create indexes for performance
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS idx_phi_access_student
    ON phi_access_log(student_id, timestamp DESC);
  `;

  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS idx_phi_access_user
    ON phi_access_log(user_id, timestamp DESC);
  `;

  // 3. Add soft delete columns to health records
  await prisma.$executeRaw`
    ALTER TABLE health_records
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(255);
  `;

  console.log('Migration completed successfully!');
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Deployment Checklist

### Pre-Deployment

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Security audit completed
- [ ] HIPAA compliance review completed
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] OpenAPI spec generated
- [ ] Changelog updated

### Deployment Steps

1. **Database Migration**
   ```bash
   npm run migrate:v1
   ```

2. **Deploy Backend (Blue-Green)**
   ```bash
   # Deploy new version alongside old
   npm run deploy:staging
   npm run test:staging
   npm run deploy:production
   ```

3. **Update Frontend**
   ```bash
   # Gradual rollout
   npm run build
   npm run deploy:cdn
   ```

4. **Monitor**
   - Check error rates
   - Monitor response times
   - Review audit logs
   - Check rate limit metrics

### Post-Deployment

- [ ] Smoke tests passed
- [ ] API health checks green
- [ ] Monitoring dashboards configured
- [ ] Alert rules active
- [ ] Documentation published
- [ ] Team training completed

### Rollback Plan

If issues detected:

1. **Immediate**: Route traffic back to old version
   ```bash
   npm run rollback
   ```

2. **Database**: Revert migrations if needed
   ```bash
   npm run migrate:down
   ```

3. **Frontend**: Revert CDN to previous version
   ```bash
   npm run deploy:rollback
   ```

## Performance Benchmarks

### Target Metrics

| Endpoint | p50 | p95 | p99 |
|----------|-----|-----|-----|
| GET /students/{id}/health-records | 50ms | 150ms | 300ms |
| POST /health-records | 100ms | 250ms | 500ms |
| GET /health-summary | 150ms | 400ms | 800ms |

### Load Testing Script

```bash
# Install k6
npm install -g k6

# Run load test
k6 run backend/tests/load/healthRecords.js
```

```javascript
// backend/tests/load/healthRecords.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% of requests under 300ms
    http_req_failed: ['rate<0.01'],   // Error rate under 1%
  },
};

const BASE_URL = 'https://api.whitecross.health/v1';
const AUTH_TOKEN = __ENV.AUTH_TOKEN;

export default function () {
  const headers = {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json',
  };

  // GET student health records
  const getResponse = http.get(
    `${BASE_URL}/students/clx123/health-records?page=1&limit=20`,
    { headers }
  );

  check(getResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

## Monitoring Setup

### Prometheus Metrics

```typescript
// backend/src/middleware/metrics.ts
import { Request, ResponseToolkit } from '@hapi/hapi';
import { register, Counter, Histogram } from 'prom-client';

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});

export const metricsMiddleware = (request: Request, h: ResponseToolkit) => {
  const startTime = Date.now();

  request.events.once('response', () => {
    const duration = (Date.now() - startTime) / 1000;
    const labels = {
      method: request.method,
      route: request.route.path,
      status: request.response.statusCode
    };

    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, duration);
  });

  return h.continue;
};

export const getMetrics = () => {
  return register.metrics();
};
```

## Security Hardening

### Environment Variables

```bash
# .env.production
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
DATABASE_URL=<encrypted-connection-string>
REDIS_URL=<redis-connection-string>
ENCRYPTION_KEY=<aes-256-key>
API_RATE_LIMIT=100
CORS_ORIGIN=https://app.whitecross.health
LOG_LEVEL=info
```

### Security Headers Configuration

```typescript
// backend/src/middleware/security.ts
import { Request, ResponseToolkit } from '@hapi/hapi';

export const securityHeaders = (request: Request, h: ResponseToolkit) => {
  h.response()
    .header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    .header('X-Content-Type-Options', 'nosniff')
    .header('X-Frame-Options', 'DENY')
    .header('X-XSS-Protection', '1; mode=block')
    .header('Content-Security-Policy', "default-src 'self'")
    .header('Referrer-Policy', 'strict-origin-when-cross-origin')
    .header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return h.continue;
};
```

## Conclusion

This implementation guide provides the complete blueprint for migrating to a SOA-compliant REST API architecture. Follow the phases sequentially, test thoroughly at each stage, and maintain backward compatibility until all clients have migrated.

Key success factors:
- **Comprehensive testing** at every phase
- **Gradual rollout** with feature flags
- **Continuous monitoring** of metrics
- **HIPAA compliance** throughout
- **Team communication** and training
- **Documentation** updates in parallel

For questions or issues during implementation, refer to:
- Full API Specification: `health-records-api-spec.md`
- OpenAPI Schema: `openapi-health-records-v1.yaml`
- Project Guidelines: `CLAUDE.md`
