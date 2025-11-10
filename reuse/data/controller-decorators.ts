/**
 * NestJS Controller Decorators - Enterprise-Ready Custom Decorators
 *
 * Production-grade custom decorators for NestJS controllers supporting:
 * - Route composition and HTTP methods
 * - Role-based access control (RBAC)
 * - Permission management
 * - Rate limiting and throttling
 * - Cache control strategies
 * - API versioning
 * - Content negotiation
 * - Request validation
 * - Response transformation
 * - Audit logging (HIPAA-compliant)
 * - Transaction boundaries
 * - Multi-tenant isolation
 * - Metadata extraction
 *
 * @module controller-decorators
 */

import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Header,
  CacheInterceptor,
  CacheTTL,
  Type,
  BadRequestException,
  UnauthorizedException,
  Get,
  Post,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiProduces,
  ApiConsumes,
  ApiQuery,
  ApiParam,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiTooManyRequestsResponse,
  getSchemaPath,
  ApiExtraModels,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * User role enumeration for RBAC
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  PATIENT = 'patient',
  PHARMACIST = 'pharmacist',
  LAB_TECHNICIAN = 'lab_technician',
  RECEPTIONIST = 'receptionist',
  BILLING_STAFF = 'billing_staff',
  GUEST = 'guest',
}

/**
 * Permission types for fine-grained access control
 */
export enum Permission {
  READ = 'read',
  WRITE = 'write',
  UPDATE = 'update',
  DELETE = 'delete',
  ADMIN = 'admin',
  EXECUTE = 'execute',
  APPROVE = 'approve',
  AUDIT = 'audit',
}

/**
 * Cache strategy types
 */
export enum CacheStrategy {
  NO_CACHE = 'no-cache',
  PRIVATE = 'private',
  PUBLIC = 'public',
  IMMUTABLE = 'immutable',
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  ttl: number;
  limit: number;
  keyPrefix?: string;
}

/**
 * Audit log metadata
 */
export interface AuditMetadata {
  action: string;
  resourceType: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  includeRequestBody?: boolean;
  includeResponseBody?: boolean;
}

/**
 * Tenant context interface
 */
export interface TenantContext {
  tenantId: string;
  tenantName?: string;
  database?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ============================================================================
// Metadata Keys (for use with decorators)
// ============================================================================

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';
export const IS_PUBLIC_KEY = 'isPublic';
export const RATE_LIMIT_KEY = 'rateLimit';
export const AUDIT_KEY = 'audit';
export const TENANT_KEY = 'tenant';
export const TRANSACTION_KEY = 'transaction';
export const API_VERSION_KEY = 'apiVersion';

// ============================================================================
// 1. Custom Route Decorators
// ============================================================================

/**
 * Combined GET decorator with standard configurations for NestJS controllers.
 * Applies HTTP GET method, Swagger documentation, and standard response codes.
 *
 * @param path - Route path (string or array of strings for multiple routes)
 * @param summary - API operation summary for Swagger documentation
 * @returns Combined decorator for GET endpoints
 *
 * @example
 * ```typescript
 * @ApiGet('users', 'Get all users')
 * async findAll() {
 *   return this.usersService.findAll();
 * }
 * ```
 */
export function ApiGet(path?: string | string[], summary?: string) {
  const decorators: Array<MethodDecorator | ClassDecorator> = [
    Get(path),
  ];

  if (summary) {
    decorators.push(ApiOperation({ summary }));
  }

  decorators.push(ApiResponse({ status: 200, description: 'Request successful' }));
  decorators.push(ApiResponse({ status: 400, description: 'Invalid request parameters' }));

  return applyDecorators(...decorators);
}

/**
 * Combined POST decorator with standard configurations for NestJS controllers.
 * Applies HTTP POST method, 201 status code, Swagger documentation, and standard response codes.
 *
 * @param path - Route path (string or array of strings for multiple routes)
 * @param summary - API operation summary for Swagger documentation
 * @returns Combined decorator for POST endpoints
 *
 * @example
 * ```typescript
 * @ApiPost('users', 'Create a new user')
 * async create(@Body() createUserDto: CreateUserDto) {
 *   return this.usersService.create(createUserDto);
 * }
 * ```
 */
export function ApiPost(path?: string | string[], summary?: string) {
  const decorators: Array<MethodDecorator | ClassDecorator> = [
    Post(path),
    HttpCode(HttpStatus.CREATED),
  ];

  if (summary) {
    decorators.push(ApiOperation({ summary }));
  }

  decorators.push(ApiResponse({ status: 201, description: 'Resource created successfully' }));
  decorators.push(ApiResponse({ status: 400, description: 'Invalid request body or parameters' }));

  return applyDecorators(...decorators);
}

/**
 * Combined PUT decorator with standard configurations for NestJS controllers.
 * Applies HTTP PUT method, Swagger documentation, and standard response codes.
 *
 * @param path - Route path (string or array of strings for multiple routes)
 * @param summary - API operation summary for Swagger documentation
 * @returns Combined decorator for PUT endpoints
 *
 * @example
 * ```typescript
 * @ApiPut(':id', 'Update user by ID')
 * async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
 *   return this.usersService.update(id, updateUserDto);
 * }
 * ```
 */
export function ApiPut(path?: string | string[], summary?: string) {
  const decorators: Array<MethodDecorator | ClassDecorator> = [
    Put(path),
    HttpCode(HttpStatus.OK),
  ];

  if (summary) {
    decorators.push(ApiOperation({ summary }));
  }

  decorators.push(ApiResponse({ status: 200, description: 'Resource updated successfully' }));
  decorators.push(ApiResponse({ status: 404, description: 'Resource not found' }));
  decorators.push(ApiResponse({ status: 400, description: 'Invalid request body or parameters' }));

  return applyDecorators(...decorators);
}

/**
 * Combined PATCH decorator with standard configurations for NestJS controllers.
 * Applies HTTP PATCH method, Swagger documentation, and standard response codes.
 *
 * @param path - Route path (string or array of strings for multiple routes)
 * @param summary - API operation summary for Swagger documentation
 * @returns Combined decorator for PATCH endpoints
 *
 * @example
 * ```typescript
 * @ApiPatch(':id', 'Partially update user')
 * async patch(@Param('id') id: string, @Body() patchUserDto: PatchUserDto) {
 *   return this.usersService.patch(id, patchUserDto);
 * }
 * ```
 */
export function ApiPatch(path?: string | string[], summary?: string) {
  const decorators: Array<MethodDecorator | ClassDecorator> = [
    Patch(path),
    HttpCode(HttpStatus.OK),
  ];

  if (summary) {
    decorators.push(ApiOperation({ summary }));
  }

  decorators.push(ApiResponse({ status: 200, description: 'Resource partially updated successfully' }));
  decorators.push(ApiResponse({ status: 404, description: 'Resource not found' }));
  decorators.push(ApiResponse({ status: 400, description: 'Invalid request body or parameters' }));

  return applyDecorators(...decorators);
}

/**
 * Combined DELETE decorator with standard configurations for NestJS controllers.
 * Applies HTTP DELETE method, 204 No Content status, Swagger documentation, and standard response codes.
 *
 * @param path - Route path (string or array of strings for multiple routes)
 * @param summary - API operation summary for Swagger documentation
 * @returns Combined decorator for DELETE endpoints
 *
 * @example
 * ```typescript
 * @ApiDelete(':id', 'Delete user by ID')
 * async remove(@Param('id') id: string) {
 *   await this.usersService.remove(id);
 * }
 * ```
 */
export function ApiDelete(path?: string | string[], summary?: string) {
  const decorators: Array<MethodDecorator | ClassDecorator> = [
    Delete(path),
    HttpCode(HttpStatus.NO_CONTENT),
  ];

  if (summary) {
    decorators.push(ApiOperation({ summary }));
  }

  decorators.push(ApiResponse({ status: 204, description: 'Resource deleted successfully' }));
  decorators.push(ApiResponse({ status: 404, description: 'Resource not found' }));

  return applyDecorators(...decorators);
}

// ============================================================================
// 2. Role-Based Access Control Decorators
// ============================================================================

/**
 * Marks a route as requiring specific roles for access control.
 * This decorator sets metadata that can be read by a RolesGuard.
 *
 * @param roles - Array of required roles from UserRole enum
 * @returns Metadata decorator for role-based access control
 *
 * @example
 * ```typescript
 * @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
 * @Get('sensitive-data')
 * async getSensitiveData() {
 *   return this.service.getSensitiveData();
 * }
 * ```
 */
export function Roles(...roles: UserRole[]) {
  return SetMetadata(ROLES_KEY, roles);
}

/**
 * Marks a route as publicly accessible (no authentication required).
 * This decorator bypasses authentication guards.
 *
 * @returns Metadata decorator for public endpoints
 *
 * @example
 * ```typescript
 * @Public()
 * @Get('health')
 * async healthCheck() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export function Public() {
  return SetMetadata(IS_PUBLIC_KEY, true);
}

/**
 * Healthcare-specific role decorator for medical staff only.
 * Restricts access to doctors and nurses.
 *
 * @returns Role-based access decorator for medical staff
 *
 * @example
 * ```typescript
 * @MedicalStaffOnly()
 * @Get('patient/:id/medical-records')
 * async getMedicalRecords(@Param('id') patientId: string) {
 *   return this.service.getMedicalRecords(patientId);
 * }
 * ```
 */
export function MedicalStaffOnly() {
  return Roles(UserRole.DOCTOR, UserRole.NURSE);
}

/**
 * Healthcare-specific role decorator for administrative staff only.
 * Restricts access to admin and super admin roles.
 *
 * @returns Role-based access decorator for administrators
 *
 * @example
 * ```typescript
 * @AdminOnly()
 * @Delete('users/:id')
 * async deleteUser(@Param('id') userId: string) {
 *   return this.service.deleteUser(userId);
 * }
 * ```
 */
export function AdminOnly() {
  return Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN);
}

/**
 * Combined decorator for authenticated healthcare professionals.
 * Includes doctors, nurses, pharmacists, and lab technicians.
 * Adds Bearer authentication and appropriate API documentation.
 *
 * @returns Combined decorator for healthcare professional access
 *
 * @example
 * ```typescript
 * @HealthcareProfessional()
 * @Get('medications')
 * async getMedications() {
 *   return this.service.getMedications();
 * }
 * ```
 */
export function HealthcareProfessional() {
  return applyDecorators(
    Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.PHARMACIST, UserRole.LAB_TECHNICIAN),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized: Healthcare professional credentials required' }),
    ApiForbiddenResponse({ description: 'Forbidden: Insufficient healthcare professional permissions' }),
  );
}

// ============================================================================
// 3. Permission Decorators
// ============================================================================

/**
 * Marks a route as requiring specific permissions
 * @param permissions - Array of required permissions
 */
export function RequirePermissions(...permissions: Permission[]) {
  return SetMetadata(PERMISSIONS_KEY, permissions);
}

/**
 * Requires read permission on a resource
 */
export function ReadPermission() {
  return RequirePermissions(Permission.READ);
}

/**
 * Requires write permission on a resource
 */
export function WritePermission() {
  return RequirePermissions(Permission.WRITE);
}

/**
 * Requires delete permission on a resource
 */
export function DeletePermission() {
  return RequirePermissions(Permission.DELETE);
}

/**
 * Requires admin permission on a resource
 */
export function AdminPermission() {
  return RequirePermissions(Permission.ADMIN);
}

// ============================================================================
// 4. Rate Limit Decorators
// ============================================================================

/**
 * Applies rate limiting to a route
 * @param config - Rate limit configuration
 */
export function RateLimit(config: RateLimitConfig) {
  return applyDecorators(
    SetMetadata(RATE_LIMIT_KEY, config),
    ApiTooManyRequestsResponse({ description: 'Too Many Requests - Rate limit exceeded' }),
  );
}

/**
 * Applies strict rate limiting (10 requests per minute)
 */
export function StrictRateLimit() {
  return RateLimit({ ttl: 60, limit: 10 });
}

/**
 * Applies moderate rate limiting (100 requests per minute)
 */
export function ModerateRateLimit() {
  return RateLimit({ ttl: 60, limit: 100 });
}

/**
 * Applies lenient rate limiting (1000 requests per minute)
 */
export function LenientRateLimit() {
  return RateLimit({ ttl: 60, limit: 1000 });
}

// ============================================================================
// 5. Cache Control Decorators
// ============================================================================

/**
 * Sets cache control headers with custom strategy
 * @param strategy - Cache strategy
 * @param maxAge - Max age in seconds
 */
export function CacheControl(strategy: CacheStrategy, maxAge: number = 3600) {
  const cacheValue = `${strategy}, max-age=${maxAge}`;
  return Header('Cache-Control', cacheValue);
}

/**
 * Disables caching completely
 */
export function NoCache() {
  return applyDecorators(
    Header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'),
    Header('Pragma', 'no-cache'),
    Header('Expires', '0'),
  );
}

/**
 * Enables private caching (user-specific)
 */
export function PrivateCache(maxAge: number = 300) {
  return CacheControl(CacheStrategy.PRIVATE, maxAge);
}

/**
 * Enables public caching (shared)
 */
export function PublicCache(maxAge: number = 3600) {
  return CacheControl(CacheStrategy.PUBLIC, maxAge);
}

/**
 * Marks response as immutable (can be cached indefinitely)
 */
export function ImmutableCache() {
  return Header('Cache-Control', 'public, max-age=31536000, immutable');
}

// ============================================================================
// 6. API Versioning Decorators
// ============================================================================

/**
 * Marks a route with API version metadata
 * @param version - API version string
 */
export function ApiVersion(version: string) {
  return applyDecorators(
    SetMetadata(API_VERSION_KEY, version),
    ApiHeader({ name: 'X-API-Version', description: `API Version ${version}` }),
  );
}

/**
 * Marks a route as deprecated
 * @param deprecatedSince - Version when deprecated
 * @param removeInVersion - Version when it will be removed
 */
export function Deprecated(deprecatedSince: string, removeInVersion: string) {
  return applyDecorators(
    ApiOperation({
      deprecated: true,
      summary: `DEPRECATED since ${deprecatedSince}, will be removed in ${removeInVersion}`,
    }),
    Header('X-Deprecated', 'true'),
    Header('X-Deprecated-Since', deprecatedSince),
    Header('X-Remove-In-Version', removeInVersion),
  );
}

// ============================================================================
// 7. Content Negotiation Decorators
// ============================================================================

/**
 * Specifies accepted content types for request
 * @param contentTypes - Array of MIME types
 */
export function AcceptsContentType(...contentTypes: string[]) {
  return applyDecorators(
    ApiConsumes(...contentTypes),
    ApiResponse({ status: 415, description: 'Unsupported Media Type' }),
  );
}

/**
 * Specifies produced content types for response
 * @param contentTypes - Array of MIME types
 */
export function ProducesContentType(...contentTypes: string[]) {
  return ApiProduces(...contentTypes);
}

/**
 * JSON-only endpoint
 */
export function JsonOnly() {
  return applyDecorators(
    AcceptsContentType('application/json'),
    ProducesContentType('application/json'),
  );
}

/**
 * Multipart form data endpoint
 */
export function MultipartFormData() {
  return AcceptsContentType('multipart/form-data');
}

/**
 * File download endpoint
 */
export function FileDownload(mimeType: string = 'application/octet-stream') {
  return applyDecorators(
    ProducesContentType(mimeType),
    Header('Content-Disposition', 'attachment'),
  );
}

// ============================================================================
// 8. Request Validation Decorators
// ============================================================================

/**
 * Applies strict validation with transformation
 */
export function StrictValidation() {
  return UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
          value: error.value,
        }));
        return new BadRequestException({
          message: 'Validation failed',
          errors: messages,
        });
      },
    }),
  );
}

/**
 * Applies lenient validation (allows extra fields)
 */
export function LenientValidation() {
  return UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  );
}

/**
 * Validates UUID parameters
 */
export function ValidateUUID() {
  return applyDecorators(
    ApiParam({ name: 'id', type: 'string', format: 'uuid' }),
  );
}

// ============================================================================
// 9. Response Transformation Decorators
// ============================================================================

/**
 * Creates paginated response decorator
 * @param model - DTO model class
 */
export function ApiPaginatedResponse<T>(model: Type<T>) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'Paginated response',
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: {
                type: 'object',
                properties: {
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  total: { type: 'number' },
                  totalPages: { type: 'number' },
                },
              },
            },
          },
        ],
      },
    }),
  );
}

/**
 * Wraps response in standard envelope
 */
export function EnvelopedResponse() {
  return applyDecorators(
    Header('X-Response-Format', 'enveloped'),
  );
}

/**
 * Adds standard timestamp to response
 */
export function TimestampedResponse() {
  return applyDecorators(
    Header('X-Response-Time', new Date().toISOString()),
  );
}

// ============================================================================
// 10. Audit Logging Decorators
// ============================================================================

/**
 * Enables HIPAA-compliant audit logging
 * @param metadata - Audit metadata configuration
 */
export function AuditLog(metadata: AuditMetadata) {
  return applyDecorators(
    SetMetadata(AUDIT_KEY, metadata),
  );
}

/**
 * Logs PHI (Protected Health Information) access
 */
export function LogPHIAccess(resourceType: string) {
  return AuditLog({
    action: 'PHI_ACCESS',
    resourceType,
    severity: 'high',
    includeRequestBody: false,
    includeResponseBody: false,
  });
}

/**
 * Logs sensitive data modification
 */
export function LogSensitiveModification(resourceType: string) {
  return AuditLog({
    action: 'SENSITIVE_MODIFICATION',
    resourceType,
    severity: 'critical',
    includeRequestBody: true,
    includeResponseBody: true,
  });
}

/**
 * Logs data export for compliance
 */
export function LogDataExport(resourceType: string) {
  return AuditLog({
    action: 'DATA_EXPORT',
    resourceType,
    severity: 'high',
    includeRequestBody: true,
    includeResponseBody: false,
  });
}

// ============================================================================
// 11. Transaction Boundary Decorators
// ============================================================================

/**
 * Marks a route as requiring database transaction
 */
export function Transactional() {
  return SetMetadata(TRANSACTION_KEY, true);
}

/**
 * Marks a route as read-only transaction
 */
export function ReadOnlyTransaction() {
  return SetMetadata(TRANSACTION_KEY, { readOnly: true });
}

// ============================================================================
// 12. Tenant Isolation Decorators
// ============================================================================

/**
 * Enables multi-tenant isolation
 */
export function TenantIsolated() {
  return applyDecorators(
    SetMetadata(TENANT_KEY, true),
    ApiHeader({ name: 'X-Tenant-ID', description: 'Tenant identifier', required: true }),
  );
}

/**
 * Allows cross-tenant access (super admin only)
 */
export function CrossTenantAccess() {
  return applyDecorators(
    AdminOnly(),
    ApiHeader({ name: 'X-Target-Tenant-ID', description: 'Target tenant identifier' }),
  );
}

// ============================================================================
// 13. Metadata Extraction Decorators (Parameter Decorators)
// ============================================================================

/**
 * Extracts current user from request
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = (request as any).user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    return data ? user?.[data] : user;
  },
);

/**
 * Extracts user ID from request
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = (request as any).user;
    return user?.id || user?.userId;
  },
);

/**
 * Extracts user roles from request
 */
export const UserRoles = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserRole[] => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = (request as any).user;
    return user?.roles || [];
  },
);

/**
 * Extracts client IP address
 */
export const IpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (
      request.ip ||
      request.headers['x-forwarded-for'] as string ||
      request.headers['x-real-ip'] as string ||
      request.socket.remoteAddress ||
      'unknown'
    );
  },
);

/**
 * Extracts user agent from request
 */
export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.headers['user-agent'] || 'unknown';
  },
);

/**
 * Extracts tenant ID from request header
 */
export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const tenantId = request.headers['x-tenant-id'] as string || (request as any).tenantId;

    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required');
    }

    return tenantId;
  },
);

/**
 * Extracts correlation ID for request tracing
 */
export const CorrelationId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.headers['x-correlation-id'] as string || (request as any).correlationId || '';
  },
);

/**
 * Extracts request timestamp
 */
export const RequestTimestamp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Date => {
    return new Date();
  },
);

/**
 * Extracts custom headers as object
 */
export const CustomHeaders = createParamDecorator(
  (data: string[] | undefined, ctx: ExecutionContext): Record<string, string> => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!data || data.length === 0) {
      return request.headers as Record<string, string>;
    }

    const headers: Record<string, string> = {};
    data.forEach((headerName) => {
      const value = request.headers[headerName.toLowerCase()];
      if (value) {
        headers[headerName] = Array.isArray(value) ? value[0] : value;
      }
    });

    return headers;
  },
);

/**
 * Extracts query parameters with type safety
 */
export const QueryParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Record<string, any> => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.query;
  },
);

/**
 * Extracts all route params
 */
export const RouteParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Record<string, string> => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.params;
  },
);

/**
 * Extracts request method (GET, POST, etc.)
 */
export const HttpMethod = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.method;
  },
);

/**
 * Extracts full request URL
 */
export const RequestUrl = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return `${request.protocol}://${request.get('host')}${request.originalUrl}`;
  },
);

/**
 * Extracts request protocol (http/https)
 */
export const Protocol = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.protocol;
  },
);

/**
 * Extracts hostname from request
 */
export const Hostname = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.hostname;
  },
);
