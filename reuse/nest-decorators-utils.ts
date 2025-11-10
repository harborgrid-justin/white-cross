/**
 * LOC: D8E9F0A1B2
 * File: /reuse/nest-decorators-utils.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *
 * DOWNSTREAM (imported by):
 *   - Controllers requiring custom decorators
 *   - DTOs with validation
 *   - Services with caching
 */

/**
 * File: /reuse/nest-decorators-utils.ts
 * Locator: WC-UTL-DEC-002
 * Purpose: NestJS Custom Decorators - Comprehensive decorator utilities
 *
 * Upstream: @nestjs/common, @nestjs/swagger, class-validator, class-transformer
 * Downstream: All NestJS components, DTOs, controllers, services, providers
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, Reflect Metadata
 * Exports: 40 custom decorator functions for methods, parameters, classes, properties
 *
 * LLM Context: Production-grade NestJS custom decorators for White Cross healthcare platform.
 * Provides comprehensive decorators for method enhancement, parameter validation, class configuration,
 * property transformation, metadata reflection, decorator composition, validation rules, data transformation,
 * caching strategies, and logging. HIPAA-compliant with audit trail support and PHI protection.
 */

import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
  UseGuards,
  UseInterceptors,
  UsePipes,
  HttpCode,
  HttpStatus,
  Header,
  ValidationPipe,
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Transform, Type, Expose, Exclude } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Audit log metadata structure
 */
export interface AuditLogMetadata {
  action: string;
  resource: string;
  description?: string;
  includeUser?: boolean;
  includeIp?: boolean;
  includeTimestamp?: boolean;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  ttl: number; // Time to live in seconds
  limit: number; // Maximum number of requests
}

/**
 * Role-based access configuration
 */
export type Role = string | string[];

/**
 * Cache options
 */
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string; // Custom cache key
  isPublic?: boolean;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  attempts: number;
  delay?: number; // Delay between retries in ms
  backoff?: 'fixed' | 'exponential';
}

/**
 * Timeout configuration
 */
export interface TimeoutConfig {
  duration: number; // Timeout duration in ms
  message?: string; // Custom timeout message
}

// ============================================================================
// METHOD DECORATORS
// ============================================================================

/**
 * Marks a controller method for audit logging with HIPAA compliance.
 * Automatically logs action, resource, user, IP, and timestamp.
 *
 * @param {AuditLogMetadata} metadata - Audit log configuration
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Post('medical-records')
 * @AuditLog({
 *   action: 'CREATE_MEDICAL_RECORD',
 *   resource: 'MedicalRecord',
 *   description: 'Created new medical record',
 *   includeUser: true,
 *   includeIp: true
 * })
 * async createMedicalRecord(@Body() dto: CreateMedicalRecordDto) {
 *   return this.medicalRecordsService.create(dto);
 * }
 * ```
 */
export function AuditLog(metadata: AuditLogMetadata): MethodDecorator {
  return SetMetadata('audit_log', metadata);
}

/**
 * Applies role-based access control to a method.
 * Works with RolesGuard to restrict access.
 *
 * @param {...string[]} roles - Allowed roles
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Get('admin-only')
 * @Roles('admin', 'superadmin')
 * async getAdminData() {
 *   return this.adminService.getData();
 * }
 * ```
 */
export function Roles(...roles: string[]): MethodDecorator {
  return SetMetadata('roles', roles);
}

/**
 * Applies permissions-based access control to a method.
 *
 * @param {...string[]} permissions - Required permissions
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Delete(':id')
 * @RequirePermissions('delete:medical-records', 'admin:full-access')
 * async deleteMedicalRecord(@Param('id') id: string) {
 *   return this.medicalRecordsService.remove(id);
 * }
 * ```
 */
export function RequirePermissions(...permissions: string[]): MethodDecorator {
  return SetMetadata('permissions', permissions);
}

/**
 * Enables caching for a method with optional TTL and custom key.
 *
 * @param {CacheOptions} options - Cache configuration
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Get('public-data')
 * @Cacheable({ ttl: 3600, isPublic: true })
 * async getPublicData() {
 *   return this.dataService.getPublic();
 * }
 * ```
 */
export function Cacheable(options?: CacheOptions): MethodDecorator {
  const decorators = [UseInterceptors(CacheInterceptor)];

  if (options?.ttl) {
    decorators.push(CacheTTL(options.ttl));
  }

  if (options?.key) {
    decorators.push(SetMetadata('cache_key', options.key));
  }

  if (options?.isPublic !== undefined) {
    decorators.push(SetMetadata('cache_public', options.isPublic));
  }

  return applyDecorators(...decorators);
}

/**
 * Invalidates cache after method execution.
 *
 * @param {string | string[]} keys - Cache keys to invalidate
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Post('users')
 * @InvalidateCache(['users_list', 'users_count'])
 * async createUser(@Body() dto: CreateUserDto) {
 *   return this.usersService.create(dto);
 * }
 * ```
 */
export function InvalidateCache(keys: string | string[]): MethodDecorator {
  const cacheKeys = Array.isArray(keys) ? keys : [keys];
  return SetMetadata('invalidate_cache', cacheKeys);
}

/**
 * Applies rate limiting to a method.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Post('login')
 * @RateLimit({ ttl: 60, limit: 5 })
 * async login(@Body() loginDto: LoginDto) {
 *   return this.authService.login(loginDto);
 * }
 * ```
 */
export function RateLimit(config: RateLimitConfig): MethodDecorator {
  return SetMetadata('rate_limit', config);
}

/**
 * Configures automatic retry for a method.
 *
 * @param {RetryConfig} config - Retry configuration
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Get('external-api')
 * @Retry({ attempts: 3, delay: 1000, backoff: 'exponential' })
 * async callExternalApi() {
 *   return this.httpService.get('https://api.example.com/data');
 * }
 * ```
 */
export function Retry(config: RetryConfig): MethodDecorator {
  return SetMetadata('retry', config);
}

/**
 * Sets a timeout for method execution.
 *
 * @param {TimeoutConfig} config - Timeout configuration
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Get('slow-operation')
 * @Timeout({ duration: 5000, message: 'Operation timed out' })
 * async slowOperation() {
 *   return this.slowService.process();
 * }
 * ```
 */
export function Timeout(config: TimeoutConfig): MethodDecorator {
  return SetMetadata('timeout', config);
}

/**
 * Marks a method as asynchronous operation that should be queued.
 *
 * @param {string} queueName - Queue name
 * @param {Record<string, any>} options - Queue options
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Post('export')
 * @QueueJob('exports', { priority: 10, delay: 1000 })
 * async queueExport(@Body() exportDto: ExportDto) {
 *   return this.exportService.queue(exportDto);
 * }
 * ```
 */
export function QueueJob(queueName: string, options?: Record<string, any>): MethodDecorator {
  return SetMetadata('queue_job', { queueName, options });
}

/**
 * Marks PHI (Protected Health Information) endpoint requiring extra security.
 *
 * @param {string} dataType - Type of PHI data
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Get('patients/:id/medical-history')
 * @PHIEndpoint('medical_history')
 * async getMedicalHistory(@Param('id') id: string) {
 *   return this.medicalHistoryService.findByPatient(id);
 * }
 * ```
 */
export function PHIEndpoint(dataType: string): MethodDecorator {
  return applyDecorators(
    SetMetadata('phi_endpoint', true),
    SetMetadata('phi_data_type', dataType),
    SetMetadata('requires_audit', true),
  );
}

// ============================================================================
// PARAMETER DECORATORS
// ============================================================================

/**
 * Validates and transforms UUID parameter.
 *
 * @param {string} property - Parameter name (default: 'id')
 * @returns {ParameterDecorator} Parameter decorator
 *
 * @example
 * ```typescript
 * @Get(':id')
 * async findOne(@UuidParam() id: string) {
 *   return this.service.findOne(id);
 * }
 * ```
 */
export const UuidParam = createParamDecorator((data: string = 'id', ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const value = request.params[data];

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(value)) {
    throw new Error(`Invalid UUID format for parameter: ${data}`);
  }

  return value;
});

/**
 * Parses and validates integer parameter.
 *
 * @param {string} property - Parameter name
 * @returns {ParameterDecorator} Parameter decorator
 *
 * @example
 * ```typescript
 * @Get('page/:pageNum')
 * async getPage(@IntParam('pageNum') page: number) {
 *   return this.service.getPage(page);
 * }
 * ```
 */
export const IntParam = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const value = request.params[data];
  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    throw new Error(`Invalid integer format for parameter: ${data}`);
  }

  return parsed;
});

/**
 * Parses boolean parameter from string values.
 *
 * @param {string} property - Parameter name
 * @returns {ParameterDecorator} Parameter decorator
 *
 * @example
 * ```typescript
 * @Get('list')
 * async getList(@BooleanQuery('active') active: boolean) {
 *   return this.service.findAll({ active });
 * }
 * ```
 */
export const BooleanQuery = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const value = request.query[data];

  if (value === undefined || value === null) {
    return undefined;
  }

  return value === 'true' || value === '1' || value === true;
});

/**
 * Parses array from comma-separated query parameter.
 *
 * @param {string} property - Parameter name
 * @returns {ParameterDecorator} Parameter decorator
 *
 * @example
 * ```typescript
 * @Get('filter')
 * async filter(@ArrayQuery('tags') tags: string[]) {
 *   // ?tags=urgent,medical,followup => ['urgent', 'medical', 'followup']
 *   return this.service.filterByTags(tags);
 * }
 * ```
 */
export const ArrayQuery = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const value = request.query[data];

  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return typeof value === 'string' ? value.split(',').map((v) => v.trim()) : [];
});

/**
 * Extracts date from query parameter with validation.
 *
 * @param {string} property - Parameter name
 * @returns {ParameterDecorator} Parameter decorator
 *
 * @example
 * ```typescript
 * @Get('appointments')
 * async getAppointments(@DateQuery('date') date: Date) {
 *   return this.appointmentsService.findByDate(date);
 * }
 * ```
 */
export const DateQuery = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const value = request.query[data];

  if (!value) {
    return undefined;
  }

  const date = new Date(value as string);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format for parameter: ${data}`);
  }

  return date;
});

/**
 * Extracts and validates pagination parameters.
 *
 * @returns {ParameterDecorator} Parameter decorator
 *
 * @example
 * ```typescript
 * @Get('users')
 * async getUsers(@Pagination() pagination: { page: number; limit: number; offset: number }) {
 *   return this.usersService.findAll(pagination);
 * }
 * ```
 */
export const Pagination = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const page = Math.max(1, parseInt(request.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(request.query.limit as string) || 10));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
});

/**
 * Extracts sanitized search query.
 *
 * @param {string} property - Parameter name (default: 'q')
 * @returns {ParameterDecorator} Parameter decorator
 *
 * @example
 * ```typescript
 * @Get('search')
 * async search(@SearchQuery() query: string) {
 *   return this.searchService.search(query);
 * }
 * ```
 */
export const SearchQuery = createParamDecorator((data: string = 'q', ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const value = request.query[data] as string;

  if (!value) {
    return undefined;
  }

  // Sanitize search query
  return value.trim().replace(/[<>]/g, '');
});

// ============================================================================
// CLASS DECORATORS
// ============================================================================

/**
 * Applies common API documentation decorators to a controller.
 *
 * @param {string} tag - API tag for grouping
 * @param {string} description - Controller description
 * @returns {ClassDecorator} Class decorator
 *
 * @example
 * ```typescript
 * @ApiController('users', 'User management endpoints')
 * @Controller('users')
 * export class UsersController {
 *   // ...
 * }
 * ```
 */
export function ApiController(tag: string, description?: string): ClassDecorator {
  const decorators = [ApiTags(tag)];

  if (description) {
    decorators.push(SetMetadata('controller_description', description));
  }

  return applyDecorators(...decorators);
}

/**
 * Marks controller as requiring authentication.
 *
 * @param {string} scheme - Authentication scheme (default: 'bearer')
 * @returns {ClassDecorator} Class decorator
 *
 * @example
 * ```typescript
 * @AuthenticatedController()
 * @Controller('protected')
 * export class ProtectedController {
 *   // All routes require authentication
 * }
 * ```
 */
export function AuthenticatedController(scheme: string = 'bearer'): ClassDecorator {
  return applyDecorators(ApiBearerAuth(), SetMetadata('requires_auth', true));
}

/**
 * Applies HIPAA compliance settings to entire controller.
 *
 * @param {string} resourceType - Type of PHI resource
 * @returns {ClassDecorator} Class decorator
 *
 * @example
 * ```typescript
 * @HIPAACompliant('medical_records')
 * @Controller('medical-records')
 * export class MedicalRecordsController {
 *   // All routes are HIPAA-compliant with audit logging
 * }
 * ```
 */
export function HIPAACompliant(resourceType: string): ClassDecorator {
  return applyDecorators(
    SetMetadata('hipaa_compliant', true),
    SetMetadata('resource_type', resourceType),
    SetMetadata('audit_all_operations', true),
  );
}

/**
 * Applies versioning to controller.
 *
 * @param {string | string[]} versions - API versions
 * @returns {ClassDecorator} Class decorator
 *
 * @example
 * ```typescript
 * @VersionedController(['1', '2'])
 * @Controller('api')
 * export class ApiController {
 *   // Available at /v1/api and /v2/api
 * }
 * ```
 */
export function VersionedController(versions: string | string[]): ClassDecorator {
  return SetMetadata('versions', Array.isArray(versions) ? versions : [versions]);
}

// ============================================================================
// PROPERTY DECORATORS
// ============================================================================

/**
 * Marks property as required in DTO with API documentation.
 *
 * @param {string} description - Property description
 * @param {any} example - Example value
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class CreateUserDto {
 *   @RequiredProperty('User email address', 'user@example.com')
 *   email: string;
 * }
 * ```
 */
export function RequiredProperty(description: string, example?: any): PropertyDecorator {
  return applyDecorators(ApiProperty({ description, example, required: true }), Expose());
}

/**
 * Marks property as optional in DTO with API documentation.
 *
 * @param {string} description - Property description
 * @param {any} example - Example value
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class UpdateUserDto {
 *   @OptionalProperty('User phone number', '+1234567890')
 *   phone?: string;
 * }
 * ```
 */
export function OptionalProperty(description: string, example?: any): PropertyDecorator {
  return applyDecorators(ApiPropertyOptional({ description, example }), Expose());
}

/**
 * Transforms string to lowercase.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class UserDto {
 *   @ToLowerCase()
 *   email: string; // 'USER@EXAMPLE.COM' => 'user@example.com'
 * }
 * ```
 */
export function ToLowerCase(): PropertyDecorator {
  return Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value));
}

/**
 * Transforms string to uppercase.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class CodeDto {
 *   @ToUpperCase()
 *   code: string; // 'abc123' => 'ABC123'
 * }
 * ```
 */
export function ToUpperCase(): PropertyDecorator {
  return Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase() : value));
}

/**
 * Trims whitespace from string.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class UserDto {
 *   @Trim()
 *   name: string; // '  John Doe  ' => 'John Doe'
 * }
 * ```
 */
export function Trim(): PropertyDecorator {
  return Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));
}

/**
 * Transforms string to Date object.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class AppointmentDto {
 *   @ToDate()
 *   scheduledAt: Date; // '2024-01-01' => Date object
 * }
 * ```
 */
export function ToDate(): PropertyDecorator {
  return Transform(({ value }) => (value ? new Date(value) : value));
}

/**
 * Transforms value to integer.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class PaginationDto {
 *   @ToInt()
 *   page: number; // '5' => 5
 * }
 * ```
 */
export function ToInt(): PropertyDecorator {
  return Transform(({ value }) => (value != null ? parseInt(value, 10) : value));
}

/**
 * Transforms value to float.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class MedicationDto {
 *   @ToFloat()
 *   dosage: number; // '2.5' => 2.5
 * }
 * ```
 */
export function ToFloat(): PropertyDecorator {
  return Transform(({ value }) => (value != null ? parseFloat(value) : value));
}

/**
 * Transforms value to boolean.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class SettingsDto {
 *   @ToBoolean()
 *   isActive: boolean; // 'true' => true, '1' => true, 'false' => false
 * }
 * ```
 */
export function ToBoolean(): PropertyDecorator {
  return Transform(({ value }) => {
    if (value === 'true' || value === '1' || value === 1 || value === true) {
      return true;
    }
    if (value === 'false' || value === '0' || value === 0 || value === false) {
      return false;
    }
    return value;
  });
}

/**
 * Transforms comma-separated string to array.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class FilterDto {
 *   @ToArray()
 *   tags: string[]; // 'urgent,medical,followup' => ['urgent', 'medical', 'followup']
 * }
 * ```
 */
export function ToArray(): PropertyDecorator {
  return Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }
    return value;
  });
}

// ============================================================================
// VALIDATION DECORATORS
// ============================================================================

/**
 * Validates that a string is a valid phone number.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class ContactDto {
 *   @IsPhoneNumber({ message: 'Invalid phone number format' })
 *   phone: string;
 * }
 * ```
 */
export function IsPhoneNumber(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          // Basic phone number validation (E.164 format)
          const phoneRegex = /^\+?[1-9]\d{1,14}$/;
          return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
        },
        defaultMessage() {
          return 'Phone number must be a valid format';
        },
      },
    });
  };
}

/**
 * Validates that a string is a valid medical record number format.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class PatientDto {
 *   @IsMedicalRecordNumber()
 *   mrn: string; // Must match MRN-XXXXXXXX format
 * }
 * ```
 */
export function IsMedicalRecordNumber(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isMedicalRecordNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          // Format: MRN-XXXXXXXX (8 alphanumeric characters)
          const mrnRegex = /^MRN-[A-Z0-9]{8}$/i;
          return mrnRegex.test(value);
        },
        defaultMessage() {
          return 'Medical record number must be in format MRN-XXXXXXXX';
        },
      },
    });
  };
}

/**
 * Validates that a date is in the future.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class AppointmentDto {
 *   @IsFutureDate({ message: 'Appointment must be in the future' })
 *   scheduledAt: Date;
 * }
 * ```
 */
export function IsFutureDate(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!(value instanceof Date) && typeof value !== 'string') return false;
          const date = value instanceof Date ? value : new Date(value);
          return date.getTime() > Date.now();
        },
        defaultMessage() {
          return 'Date must be in the future';
        },
      },
    });
  };
}

/**
 * Validates that a date is in the past.
 *
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class HealthRecordDto {
 *   @IsPastDate({ message: 'Date of birth must be in the past' })
 *   dateOfBirth: Date;
 * }
 * ```
 */
export function IsPastDate(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPastDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!(value instanceof Date) && typeof value !== 'string') return false;
          const date = value instanceof Date ? value : new Date(value);
          return date.getTime() < Date.now();
        },
        defaultMessage() {
          return 'Date must be in the past';
        },
      },
    });
  };
}

/**
 * Validates that a string matches another property value.
 *
 * @param {string} property - Property name to match
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class PasswordDto {
 *   @IsString()
 *   password: string;
 *
 *   @Match('password', { message: 'Passwords do not match' })
 *   confirmPassword: string;
 * }
 * ```
 */
export function Match(property: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName}`;
        },
      },
    });
  };
}

/**
 * Validates that a number is within a range.
 *
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @param {ValidationOptions} validationOptions - Validation options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * export class VitalSignsDto {
 *   @IsInRange(60, 200, { message: 'Heart rate must be between 60 and 200 bpm' })
 *   heartRate: number;
 * }
 * ```
 */
export function IsInRange(
  min: number,
  max: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isInRange',
      target: object.constructor,
      propertyName,
      constraints: [min, max],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [min, max] = args.constraints;
          return typeof value === 'number' && value >= min && value <= max;
        },
        defaultMessage(args: ValidationArguments) {
          const [min, max] = args.constraints;
          return `${propertyName} must be between ${min} and ${max}`;
        },
      },
    });
  };
}

// ============================================================================
// METADATA REFLECTION HELPERS
// ============================================================================

/**
 * Retrieves metadata from a class or method.
 *
 * @template T - Metadata type
 * @param {string} key - Metadata key
 * @param {any} target - Target class or method
 * @returns {T | undefined} Metadata value
 *
 * @example
 * ```typescript
 * const roles = getMetadata<string[]>('roles', MyController.prototype.myMethod);
 * // ['admin', 'user']
 * ```
 */
export function getMetadata<T = any>(key: string, target: any): T | undefined {
  return Reflect.getMetadata(key, target);
}

/**
 * Sets metadata on a class or method.
 *
 * @param {string} key - Metadata key
 * @param {any} value - Metadata value
 * @param {any} target - Target class or method
 *
 * @example
 * ```typescript
 * setMetadata('custom_key', { value: 'data' }, MyClass.prototype.myMethod);
 * ```
 */
export function setMetadata(key: string, value: any, target: any): void {
  Reflect.defineMetadata(key, value, target);
}

/**
 * Checks if metadata exists on a target.
 *
 * @param {string} key - Metadata key
 * @param {any} target - Target class or method
 * @returns {boolean} True if metadata exists
 *
 * @example
 * ```typescript
 * if (hasMetadata('roles', MyController.prototype.myMethod)) {
 *   // Handle roles metadata
 * }
 * ```
 */
export function hasMetadata(key: string, target: any): boolean {
  return Reflect.hasMetadata(key, target);
}

/**
 * Retrieves all metadata keys from a target.
 *
 * @param {any} target - Target class or method
 * @returns {string[]} Array of metadata keys
 *
 * @example
 * ```typescript
 * const keys = getAllMetadataKeys(MyController.prototype.myMethod);
 * // ['roles', 'permissions', 'audit_log']
 * ```
 */
export function getAllMetadataKeys(target: any): string[] {
  return Reflect.getMetadataKeys(target) || [];
}

// ============================================================================
// DECORATOR COMPOSITION UTILITIES
// ============================================================================

/**
 * Composes API documentation decorators for a standard endpoint.
 *
 * @param {string} summary - Operation summary
 * @param {number} successStatus - Success HTTP status code
 * @param {any} responseType - Response DTO class
 * @returns {MethodDecorator} Composed decorator
 *
 * @example
 * ```typescript
 * @Get(':id')
 * @ApiEndpoint('Get user by ID', 200, UserResponseDto)
 * async findOne(@Param('id') id: string) {
 *   return this.usersService.findOne(id);
 * }
 * ```
 */
export function ApiEndpoint(
  summary: string,
  successStatus: number,
  responseType?: any,
): MethodDecorator {
  const decorators = [
    ApiOperation({ summary }),
    ApiResponse({
      status: successStatus,
      description: 'Success',
      ...(responseType && { type: responseType }),
    }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  ];

  return applyDecorators(...decorators);
}

/**
 * Composes decorators for a paginated list endpoint.
 *
 * @param {string} summary - Operation summary
 * @param {any} itemType - Item DTO class
 * @returns {MethodDecorator} Composed decorator
 *
 * @example
 * ```typescript
 * @Get()
 * @ApiPaginatedEndpoint('Get all users', UserResponseDto)
 * async findAll(@Pagination() pagination) {
 *   return this.usersService.findAll(pagination);
 * }
 * ```
 */
export function ApiPaginatedEndpoint(summary: string, itemType: any): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 10 }),
    ApiResponse({
      status: 200,
      description: 'Success',
      schema: {
        properties: {
          data: { type: 'array', items: { $ref: `#/components/schemas/${itemType.name}` } },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              page: { type: 'number' },
              limit: { type: 'number' },
              totalPages: { type: 'number' },
              hasNextPage: { type: 'boolean' },
              hasPreviousPage: { type: 'boolean' },
            },
          },
        },
      },
    }),
  );
}

/**
 * Composes decorators for a secure HIPAA-compliant endpoint.
 *
 * @param {string} summary - Operation summary
 * @param {string} phiType - Type of PHI data
 * @param {string[]} roles - Required roles
 * @returns {MethodDecorator} Composed decorator
 *
 * @example
 * ```typescript
 * @Get('medical-records/:id')
 * @SecureEndpoint('Get medical record', 'medical_record', ['doctor', 'nurse'])
 * async getMedicalRecord(@Param('id') id: string) {
 *   return this.medicalRecordsService.findOne(id);
 * }
 * ```
 */
export function SecureEndpoint(
  summary: string,
  phiType: string,
  roles: string[],
): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth(),
    PHIEndpoint(phiType),
    Roles(...roles),
    AuditLog({
      action: 'ACCESS',
      resource: phiType,
      includeUser: true,
      includeIp: true,
      includeTimestamp: true,
    }),
  );
}

// ============================================================================
// LOGGING DECORATORS
// ============================================================================

/**
 * Logs method execution time.
 *
 * @param {string} context - Logging context
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Get('heavy-computation')
 * @LogExecutionTime('DataProcessing')
 * async processData() {
 *   return this.dataService.heavyComputation();
 * }
 * ```
 */
export function LogExecutionTime(context?: string): MethodDecorator {
  return SetMetadata('log_execution_time', context || 'Method');
}

/**
 * Logs method input parameters.
 *
 * @param {boolean} includeBody - Whether to log request body (default: true)
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Post('users')
 * @LogInput()
 * async createUser(@Body() dto: CreateUserDto) {
 *   return this.usersService.create(dto);
 * }
 * ```
 */
export function LogInput(includeBody: boolean = true): MethodDecorator {
  return SetMetadata('log_input', includeBody);
}

/**
 * Logs method output (response).
 *
 * @param {boolean} sanitizePHI - Whether to sanitize PHI data in logs (default: true)
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Get('users/:id')
 * @LogOutput(true)
 * async getUser(@Param('id') id: string) {
 *   return this.usersService.findOne(id);
 * }
 * ```
 */
export function LogOutput(sanitizePHI: boolean = true): MethodDecorator {
  return SetMetadata('log_output', { enabled: true, sanitizePHI });
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Method Decorators
  AuditLog,
  Roles,
  RequirePermissions,
  Cacheable,
  InvalidateCache,
  RateLimit,
  Retry,
  Timeout,
  QueueJob,
  PHIEndpoint,

  // Parameter Decorators
  UuidParam,
  IntParam,
  BooleanQuery,
  ArrayQuery,
  DateQuery,
  Pagination,
  SearchQuery,

  // Class Decorators
  ApiController,
  AuthenticatedController,
  HIPAACompliant,
  VersionedController,

  // Property Decorators
  RequiredProperty,
  OptionalProperty,
  ToLowerCase,
  ToUpperCase,
  Trim,
  ToDate,
  ToInt,
  ToFloat,
  ToBoolean,
  ToArray,

  // Validation Decorators
  IsPhoneNumber,
  IsMedicalRecordNumber,
  IsFutureDate,
  IsPastDate,
  Match,
  IsInRange,

  // Metadata Reflection Helpers
  getMetadata,
  setMetadata,
  hasMetadata,
  getAllMetadataKeys,

  // Decorator Composition Utilities
  ApiEndpoint,
  ApiPaginatedEndpoint,
  SecureEndpoint,

  // Logging Decorators
  LogExecutionTime,
  LogInput,
  LogOutput,
};
