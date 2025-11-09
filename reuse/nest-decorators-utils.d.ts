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
import { ValidationOptions } from 'class-validator';
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
    ttl: number;
    limit: number;
}
/**
 * Role-based access configuration
 */
export type Role = string | string[];
/**
 * Cache options
 */
export interface CacheOptions {
    ttl?: number;
    key?: string;
    isPublic?: boolean;
}
/**
 * Retry configuration
 */
export interface RetryConfig {
    attempts: number;
    delay?: number;
    backoff?: 'fixed' | 'exponential';
}
/**
 * Timeout configuration
 */
export interface TimeoutConfig {
    duration: number;
    message?: string;
}
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
export declare function AuditLog(metadata: AuditLogMetadata): MethodDecorator;
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
export declare function Roles(...roles: string[]): MethodDecorator;
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
export declare function RequirePermissions(...permissions: string[]): MethodDecorator;
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
export declare function Cacheable(options?: CacheOptions): MethodDecorator;
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
export declare function InvalidateCache(keys: string | string[]): MethodDecorator;
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
export declare function RateLimit(config: RateLimitConfig): MethodDecorator;
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
export declare function Retry(config: RetryConfig): MethodDecorator;
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
export declare function Timeout(config: TimeoutConfig): MethodDecorator;
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
export declare function QueueJob(queueName: string, options?: Record<string, any>): MethodDecorator;
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
export declare function PHIEndpoint(dataType: string): MethodDecorator;
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
export declare const UuidParam: any;
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
export declare const IntParam: any;
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
export declare const BooleanQuery: any;
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
export declare const ArrayQuery: any;
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
export declare const DateQuery: any;
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
export declare const Pagination: any;
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
export declare const SearchQuery: any;
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
export declare function ApiController(tag: string, description?: string): ClassDecorator;
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
export declare function AuthenticatedController(scheme?: string): ClassDecorator;
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
export declare function HIPAACompliant(resourceType: string): ClassDecorator;
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
export declare function VersionedController(versions: string | string[]): ClassDecorator;
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
export declare function RequiredProperty(description: string, example?: any): PropertyDecorator;
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
export declare function OptionalProperty(description: string, example?: any): PropertyDecorator;
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
export declare function ToLowerCase(): PropertyDecorator;
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
export declare function ToUpperCase(): PropertyDecorator;
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
export declare function Trim(): PropertyDecorator;
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
export declare function ToDate(): PropertyDecorator;
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
export declare function ToInt(): PropertyDecorator;
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
export declare function ToFloat(): PropertyDecorator;
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
export declare function ToBoolean(): PropertyDecorator;
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
export declare function ToArray(): PropertyDecorator;
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
export declare function IsPhoneNumber(validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function IsMedicalRecordNumber(validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function IsFutureDate(validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function IsPastDate(validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function Match(property: string, validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function IsInRange(min: number, max: number, validationOptions?: ValidationOptions): PropertyDecorator;
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
export declare function getMetadata<T = any>(key: string, target: any): T | undefined;
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
export declare function setMetadata(key: string, value: any, target: any): void;
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
export declare function hasMetadata(key: string, target: any): boolean;
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
export declare function getAllMetadataKeys(target: any): string[];
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
export declare function ApiEndpoint(summary: string, successStatus: number, responseType?: any): MethodDecorator;
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
export declare function ApiPaginatedEndpoint(summary: string, itemType: any): MethodDecorator;
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
export declare function SecureEndpoint(summary: string, phiType: string, roles: string[]): MethodDecorator;
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
export declare function LogExecutionTime(context?: string): MethodDecorator;
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
export declare function LogInput(includeBody?: boolean): MethodDecorator;
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
export declare function LogOutput(sanitizePHI?: boolean): MethodDecorator;
declare const _default: {
    AuditLog: typeof AuditLog;
    Roles: typeof Roles;
    RequirePermissions: typeof RequirePermissions;
    Cacheable: typeof Cacheable;
    InvalidateCache: typeof InvalidateCache;
    RateLimit: typeof RateLimit;
    Retry: typeof Retry;
    Timeout: typeof Timeout;
    QueueJob: typeof QueueJob;
    PHIEndpoint: typeof PHIEndpoint;
    UuidParam: any;
    IntParam: any;
    BooleanQuery: any;
    ArrayQuery: any;
    DateQuery: any;
    Pagination: any;
    SearchQuery: any;
    ApiController: typeof ApiController;
    AuthenticatedController: typeof AuthenticatedController;
    HIPAACompliant: typeof HIPAACompliant;
    VersionedController: typeof VersionedController;
    RequiredProperty: typeof RequiredProperty;
    OptionalProperty: typeof OptionalProperty;
    ToLowerCase: typeof ToLowerCase;
    ToUpperCase: typeof ToUpperCase;
    Trim: typeof Trim;
    ToDate: typeof ToDate;
    ToInt: typeof ToInt;
    ToFloat: typeof ToFloat;
    ToBoolean: typeof ToBoolean;
    ToArray: typeof ToArray;
    IsPhoneNumber: typeof IsPhoneNumber;
    IsMedicalRecordNumber: typeof IsMedicalRecordNumber;
    IsFutureDate: typeof IsFutureDate;
    IsPastDate: typeof IsPastDate;
    Match: typeof Match;
    IsInRange: typeof IsInRange;
    getMetadata: typeof getMetadata;
    setMetadata: typeof setMetadata;
    hasMetadata: typeof hasMetadata;
    getAllMetadataKeys: typeof getAllMetadataKeys;
    ApiEndpoint: typeof ApiEndpoint;
    ApiPaginatedEndpoint: typeof ApiPaginatedEndpoint;
    SecureEndpoint: typeof SecureEndpoint;
    LogExecutionTime: typeof LogExecutionTime;
    LogInput: typeof LogInput;
    LogOutput: typeof LogOutput;
};
export default _default;
//# sourceMappingURL=nest-decorators-utils.d.ts.map