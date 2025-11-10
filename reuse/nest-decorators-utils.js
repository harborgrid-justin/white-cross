"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchQuery = exports.Pagination = exports.DateQuery = exports.ArrayQuery = exports.BooleanQuery = exports.IntParam = exports.UuidParam = void 0;
exports.AuditLog = AuditLog;
exports.Roles = Roles;
exports.RequirePermissions = RequirePermissions;
exports.Cacheable = Cacheable;
exports.InvalidateCache = InvalidateCache;
exports.RateLimit = RateLimit;
exports.Retry = Retry;
exports.Timeout = Timeout;
exports.QueueJob = QueueJob;
exports.PHIEndpoint = PHIEndpoint;
exports.ApiController = ApiController;
exports.AuthenticatedController = AuthenticatedController;
exports.HIPAACompliant = HIPAACompliant;
exports.VersionedController = VersionedController;
exports.RequiredProperty = RequiredProperty;
exports.OptionalProperty = OptionalProperty;
exports.ToLowerCase = ToLowerCase;
exports.ToUpperCase = ToUpperCase;
exports.Trim = Trim;
exports.ToDate = ToDate;
exports.ToInt = ToInt;
exports.ToFloat = ToFloat;
exports.ToBoolean = ToBoolean;
exports.ToArray = ToArray;
exports.IsPhoneNumber = IsPhoneNumber;
exports.IsMedicalRecordNumber = IsMedicalRecordNumber;
exports.IsFutureDate = IsFutureDate;
exports.IsPastDate = IsPastDate;
exports.Match = Match;
exports.IsInRange = IsInRange;
exports.getMetadata = getMetadata;
exports.setMetadata = setMetadata;
exports.hasMetadata = hasMetadata;
exports.getAllMetadataKeys = getAllMetadataKeys;
exports.ApiEndpoint = ApiEndpoint;
exports.ApiPaginatedEndpoint = ApiPaginatedEndpoint;
exports.SecureEndpoint = SecureEndpoint;
exports.LogExecutionTime = LogExecutionTime;
exports.LogInput = LogInput;
exports.LogOutput = LogOutput;
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
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
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
function AuditLog(metadata) {
    return (0, common_1.SetMetadata)('audit_log', metadata);
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
function Roles(...roles) {
    return (0, common_1.SetMetadata)('roles', roles);
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
function RequirePermissions(...permissions) {
    return (0, common_1.SetMetadata)('permissions', permissions);
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
function Cacheable(options) {
    const decorators = [(0, common_1.UseInterceptors)(common_1.CacheInterceptor)];
    if (options?.ttl) {
        decorators.push((0, common_1.CacheTTL)(options.ttl));
    }
    if (options?.key) {
        decorators.push((0, common_1.SetMetadata)('cache_key', options.key));
    }
    if (options?.isPublic !== undefined) {
        decorators.push((0, common_1.SetMetadata)('cache_public', options.isPublic));
    }
    return (0, common_1.applyDecorators)(...decorators);
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
function InvalidateCache(keys) {
    const cacheKeys = Array.isArray(keys) ? keys : [keys];
    return (0, common_1.SetMetadata)('invalidate_cache', cacheKeys);
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
function RateLimit(config) {
    return (0, common_1.SetMetadata)('rate_limit', config);
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
function Retry(config) {
    return (0, common_1.SetMetadata)('retry', config);
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
function Timeout(config) {
    return (0, common_1.SetMetadata)('timeout', config);
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
function QueueJob(queueName, options) {
    return (0, common_1.SetMetadata)('queue_job', { queueName, options });
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
function PHIEndpoint(dataType) {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('phi_endpoint', true), (0, common_1.SetMetadata)('phi_data_type', dataType), (0, common_1.SetMetadata)('requires_audit', true));
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
exports.UuidParam = (0, common_1.createParamDecorator)((data = 'id', ctx) => {
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
exports.IntParam = (0, common_1.createParamDecorator)((data, ctx) => {
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
exports.BooleanQuery = (0, common_1.createParamDecorator)((data, ctx) => {
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
exports.ArrayQuery = (0, common_1.createParamDecorator)((data, ctx) => {
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
exports.DateQuery = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.query[data];
    if (!value) {
        return undefined;
    }
    const date = new Date(value);
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
exports.Pagination = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const page = Math.max(1, parseInt(request.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(request.query.limit) || 10));
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
exports.SearchQuery = (0, common_1.createParamDecorator)((data = 'q', ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.query[data];
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
function ApiController(tag, description) {
    const decorators = [(0, swagger_1.ApiTags)(tag)];
    if (description) {
        decorators.push((0, common_1.SetMetadata)('controller_description', description));
    }
    return (0, common_1.applyDecorators)(...decorators);
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
function AuthenticatedController(scheme = 'bearer') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, common_1.SetMetadata)('requires_auth', true));
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
function HIPAACompliant(resourceType) {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('hipaa_compliant', true), (0, common_1.SetMetadata)('resource_type', resourceType), (0, common_1.SetMetadata)('audit_all_operations', true));
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
function VersionedController(versions) {
    return (0, common_1.SetMetadata)('versions', Array.isArray(versions) ? versions : [versions]);
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
function RequiredProperty(description, example) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiProperty)({ description, example, required: true }), (0, class_transformer_1.Expose)());
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
function OptionalProperty(description, example) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiPropertyOptional)({ description, example }), (0, class_transformer_1.Expose)());
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
function ToLowerCase() {
    return (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value));
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
function ToUpperCase() {
    return (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.toUpperCase() : value));
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
function Trim() {
    return (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value));
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
function ToDate() {
    return (0, class_transformer_1.Transform)(({ value }) => (value ? new Date(value) : value));
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
function ToInt() {
    return (0, class_transformer_1.Transform)(({ value }) => (value != null ? parseInt(value, 10) : value));
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
function ToFloat() {
    return (0, class_transformer_1.Transform)(({ value }) => (value != null ? parseFloat(value) : value));
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
function ToBoolean() {
    return (0, class_transformer_1.Transform)(({ value }) => {
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
function ToArray() {
    return (0, class_transformer_1.Transform)(({ value }) => {
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
function IsPhoneNumber(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isPhoneNumber',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
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
function IsMedicalRecordNumber(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isMedicalRecordNumber',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
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
function IsFutureDate(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isFutureDate',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (!(value instanceof Date) && typeof value !== 'string')
                        return false;
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
function IsPastDate(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isPastDate',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (!(value instanceof Date) && typeof value !== 'string')
                        return false;
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
function Match(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'match',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args) {
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
function IsInRange(min, max, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isInRange',
            target: object.constructor,
            propertyName,
            constraints: [min, max],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [min, max] = args.constraints;
                    return typeof value === 'number' && value >= min && value <= max;
                },
                defaultMessage(args) {
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
function getMetadata(key, target) {
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
function setMetadata(key, value, target) {
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
function hasMetadata(key, target) {
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
function getAllMetadataKeys(target) {
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
function ApiEndpoint(summary, successStatus, responseType) {
    const decorators = [
        (0, swagger_1.ApiOperation)({ summary }),
        (0, swagger_1.ApiResponse)({
            status: successStatus,
            description: 'Success',
            ...(responseType && { type: responseType }),
        }),
        (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
        (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
        (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }),
    ];
    return (0, common_1.applyDecorators)(...decorators);
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
function ApiPaginatedEndpoint(summary, itemType) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }), (0, swagger_1.ApiResponse)({
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
    }));
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
function SecureEndpoint(summary, phiType, roles) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary }), (0, swagger_1.ApiBearerAuth)(), PHIEndpoint(phiType), Roles(...roles), AuditLog({
        action: 'ACCESS',
        resource: phiType,
        includeUser: true,
        includeIp: true,
        includeTimestamp: true,
    }));
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
function LogExecutionTime(context) {
    return (0, common_1.SetMetadata)('log_execution_time', context || 'Method');
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
function LogInput(includeBody = true) {
    return (0, common_1.SetMetadata)('log_input', includeBody);
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
function LogOutput(sanitizePHI = true) {
    return (0, common_1.SetMetadata)('log_output', { enabled: true, sanitizePHI });
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
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
    UuidParam: exports.UuidParam,
    IntParam: exports.IntParam,
    BooleanQuery: exports.BooleanQuery,
    ArrayQuery: exports.ArrayQuery,
    DateQuery: exports.DateQuery,
    Pagination: exports.Pagination,
    SearchQuery: exports.SearchQuery,
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
//# sourceMappingURL=nest-decorators-utils.js.map