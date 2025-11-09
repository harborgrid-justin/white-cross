/**
 * LOC: C7D8E9F0A1
 * File: /reuse/nest-controllers-utils.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/platform-express (v11.1.8)
 *   - class-transformer (v0.5.1)
 *   - class-validator (v0.14.2)
 *
 * DOWNSTREAM (imported by):
 *   - Controllers needing REST utilities
 *   - Dynamic route builders
 *   - Response formatting services
 */
/**
 * File: /reuse/nest-controllers-utils.ts
 * Locator: WC-UTL-CTRL-001
 * Purpose: NestJS Controller Utilities - Comprehensive REST controller helpers
 *
 * Upstream: @nestjs/common, @nestjs/platform-express, class-transformer, class-validator
 * Downstream: All NestJS controllers, REST API endpoints, dynamic route handlers
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, Express
 * Exports: 40 controller utility functions for routing, requests, responses, files, streaming
 *
 * LLM Context: Production-grade NestJS controller utilities for White Cross healthcare platform.
 * Provides comprehensive helpers for route parameter extraction, request handling, response formatting,
 * file uploads, streaming responses, route metadata, controller factories, dynamic route builders,
 * REST CRUD generators, and controller composition. HIPAA-compliant with audit logging integration.
 */
import { ExecutionContext, StreamableFile } from '@nestjs/common';
import { Response, Request } from 'express';
import { Readable } from 'stream';
import { ClassConstructor } from 'class-transformer';
/**
 * Pagination query parameters interface
 */
export interface PaginationQuery {
    page?: number;
    limit?: number;
    offset?: number;
}
/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
/**
 * Sort query parameters
 */
export interface SortQuery {
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * Filter operators for dynamic filtering
 */
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between';
/**
 * File upload configuration
 */
export interface FileUploadConfig {
    maxSize?: number;
    allowedMimeTypes?: string[];
    destination?: string;
}
/**
 * API response envelope
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    timestamp: string;
    path?: string;
}
/**
 * Route metadata for dynamic routing
 */
export interface RouteMetadata {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    handler: string;
    guards?: any[];
    interceptors?: any[];
    pipes?: any[];
}
/**
 * CRUD operation configuration
 */
export interface CrudConfig<T> {
    entity: ClassConstructor<T>;
    createDto: ClassConstructor<any>;
    updateDto: ClassConstructor<any>;
    service: any;
    routePrefix?: string;
}
/**
 * Extracts the current authenticated user from the request.
 * Supports accessing specific user properties via data parameter.
 *
 * @param {keyof User | undefined} data - Optional property key to extract from user object
 * @param {ExecutionContext} ctx - Execution context
 * @returns {User | any} Complete user object or specific property value
 *
 * @example
 * ```typescript
 * @Get('profile')
 * async getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 *
 * @Post('posts')
 * async createPost(
 *   @CurrentUser('id') userId: string,
 *   @Body() createPostDto: CreatePostDto
 * ) {
 *   return this.postsService.create(userId, createPostDto);
 * }
 * ```
 */
export declare const CurrentUser: any;
/**
 * Extracts client IP address from the request.
 * Handles proxied requests by checking X-Forwarded-For header.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} Client IP address
 *
 * @example
 * ```typescript
 * @Post('login')
 * async login(
 *   @Body() loginDto: LoginDto,
 *   @IpAddress() ip: string
 * ) {
 *   await this.auditService.logLogin(loginDto.username, ip);
 *   return this.authService.login(loginDto);
 * }
 * ```
 */
export declare const IpAddress: any;
/**
 * Extracts User-Agent header from the request.
 * Useful for device tracking and analytics.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} User agent string
 *
 * @example
 * ```typescript
 * @Post('events')
 * async trackEvent(
 *   @Body() eventDto: EventDto,
 *   @UserAgent() userAgent: string
 * ) {
 *   return this.analyticsService.track(eventDto, { userAgent });
 * }
 * ```
 */
export declare const UserAgent: any;
/**
 * Extracts protocol (http/https) from the request.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} Protocol (http or https)
 *
 * @example
 * ```typescript
 * @Get('callback')
 * async handleCallback(
 *   @Protocol() protocol: string,
 *   @HostName() host: string
 * ) {
 *   const baseUrl = `${protocol}://${host}`;
 *   return this.callbackService.process(baseUrl);
 * }
 * ```
 */
export declare const Protocol: any;
/**
 * Extracts hostname from the request.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string} Hostname
 *
 * @example
 * ```typescript
 * @Get('links')
 * async generateLinks(@HostName() host: string) {
 *   return this.linkService.generateAbsoluteUrls(host);
 * }
 * ```
 */
export declare const HostName: any;
/**
 * Extracts Origin header from the request.
 * Useful for CORS validation and security checks.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string | undefined} Origin header value
 *
 * @example
 * ```typescript
 * @Post('sensitive-action')
 * async performAction(
 *   @Origin() origin: string,
 *   @Body() dto: ActionDto
 * ) {
 *   await this.securityService.validateOrigin(origin);
 *   return this.actionService.perform(dto);
 * }
 * ```
 */
export declare const Origin: any;
/**
 * Extracts Referer header from the request.
 *
 * @param {unknown} data - Not used
 * @param {ExecutionContext} ctx - Execution context
 * @returns {string | undefined} Referer header value
 *
 * @example
 * ```typescript
 * @Get('tracking')
 * async trackPageView(@Referer() referer: string) {
 *   return this.analyticsService.trackReferer(referer);
 * }
 * ```
 */
export declare const Referer: any;
/**
 * Extracts cookies from the request as an object.
 * Requires cookie-parser middleware.
 *
 * @param {string | undefined} data - Optional cookie name to extract
 * @param {ExecutionContext} ctx - Execution context
 * @returns {any} All cookies or specific cookie value
 *
 * @example
 * ```typescript
 * @Get('preferences')
 * async getPreferences(@Cookies('theme') theme: string) {
 *   return { theme: theme || 'light' };
 * }
 *
 * @Get('all-cookies')
 * async getAllCookies(@Cookies() cookies: Record<string, string>) {
 *   return cookies;
 * }
 * ```
 */
export declare const Cookies: any;
/**
 * Parses pagination query parameters with defaults and validation.
 *
 * @param {Request} req - Express request object
 * @param {number} defaultPage - Default page number (default: 1)
 * @param {number} defaultLimit - Default items per page (default: 10)
 * @param {number} maxLimit - Maximum allowed limit (default: 100)
 * @returns {PaginationQuery} Parsed and validated pagination parameters
 *
 * @example
 * ```typescript
 * @Get('users')
 * async getUsers(@Req() req: Request) {
 *   const pagination = parsePaginationParams(req, 1, 20, 100);
 *   return this.usersService.findAll(pagination);
 * }
 * ```
 */
export declare function parsePaginationParams(req: Request, defaultPage?: number, defaultLimit?: number, maxLimit?: number): PaginationQuery;
/**
 * Parses sort query parameters with validation.
 *
 * @param {Request} req - Express request object
 * @param {string} defaultSortBy - Default field to sort by
 * @param {('ASC' | 'DESC')} defaultOrder - Default sort order (default: 'ASC')
 * @param {string[]} allowedFields - List of allowed fields for sorting
 * @returns {SortQuery} Parsed and validated sort parameters
 *
 * @example
 * ```typescript
 * @Get('products')
 * async getProducts(@Req() req: Request) {
 *   const sort = parseSortParams(req, 'createdAt', 'DESC', ['name', 'price', 'createdAt']);
 *   return this.productsService.findAll(sort);
 * }
 * ```
 */
export declare function parseSortParams(req: Request, defaultSortBy?: string, defaultOrder?: 'ASC' | 'DESC', allowedFields?: string[]): SortQuery;
/**
 * Extracts search query from request with trimming and sanitization.
 *
 * @param {Request} req - Express request object
 * @param {string} queryParam - Query parameter name (default: 'search')
 * @returns {string | undefined} Sanitized search query
 *
 * @example
 * ```typescript
 * @Get('search')
 * async search(@Req() req: Request) {
 *   const query = extractSearchQuery(req);
 *   if (!query) {
 *     throw new BadRequestException('Search query is required');
 *   }
 *   return this.searchService.search(query);
 * }
 * ```
 */
export declare function extractSearchQuery(req: Request, queryParam?: string): string | undefined;
/**
 * Extracts multiple filters from query parameters.
 *
 * @param {Request} req - Express request object
 * @param {string[]} filterFields - List of allowed filter field names
 * @returns {Record<string, any>} Object with filter key-value pairs
 *
 * @example
 * ```typescript
 * @Get('patients')
 * async getPatients(@Req() req: Request) {
 *   const filters = extractFilters(req, ['status', 'grade', 'nurseId']);
 *   // filters = { status: 'active', grade: '10' }
 *   return this.patientsService.findAll(filters);
 * }
 * ```
 */
export declare function extractFilters(req: Request, filterFields: string[]): Record<string, any>;
/**
 * Validates request body against DTO class using class-validator.
 *
 * @template T - DTO class type
 * @param {ClassConstructor<T>} dtoClass - DTO class constructor
 * @param {any} body - Request body to validate
 * @returns {Promise<T>} Validated and transformed DTO instance
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * @Post('users')
 * async createUser(@Body() rawBody: any) {
 *   const dto = await validateRequestBody(CreateUserDto, rawBody);
 *   return this.usersService.create(dto);
 * }
 * ```
 */
export declare function validateRequestBody<T extends object>(dtoClass: ClassConstructor<T>, body: any): Promise<T>;
/**
 * Extracts date range from query parameters.
 *
 * @param {Request} req - Express request object
 * @param {string} startParam - Start date parameter name (default: 'startDate')
 * @param {string} endParam - End date parameter name (default: 'endDate')
 * @returns {{ startDate?: Date; endDate?: Date }} Date range object
 *
 * @example
 * ```typescript
 * @Get('appointments')
 * async getAppointments(@Req() req: Request) {
 *   const { startDate, endDate } = extractDateRange(req);
 *   return this.appointmentsService.findInRange(startDate, endDate);
 * }
 * ```
 */
export declare function extractDateRange(req: Request, startParam?: string, endParam?: string): {
    startDate?: Date;
    endDate?: Date;
};
/**
 * Creates a standardized success response envelope.
 *
 * @template T - Response data type
 * @param {T} data - Response data
 * @param {string} message - Optional success message
 * @param {string} path - Optional request path
 * @returns {ApiResponse<T>} Standardized API response
 *
 * @example
 * ```typescript
 * @Post('users')
 * async createUser(@Body() dto: CreateUserDto, @Req() req: Request) {
 *   const user = await this.usersService.create(dto);
 *   return createSuccessResponse(user, 'User created successfully', req.path);
 * }
 * ```
 */
export declare function createSuccessResponse<T>(data: T, message?: string, path?: string): ApiResponse<T>;
/**
 * Creates a standardized error response envelope.
 *
 * @param {string} error - Error message
 * @param {string} path - Optional request path
 * @param {any} details - Optional additional error details
 * @returns {ApiResponse} Standardized error response
 *
 * @example
 * ```typescript
 * @Get('users/:id')
 * async getUser(@Param('id') id: string, @Req() req: Request) {
 *   const user = await this.usersService.findOne(id);
 *   if (!user) {
 *     throw new NotFoundException(
 *       createErrorResponse('User not found', req.path)
 *     );
 *   }
 *   return user;
 * }
 * ```
 */
export declare function createErrorResponse(error: string, path?: string, details?: any): ApiResponse;
/**
 * Creates a paginated response with metadata.
 *
 * @template T - Data item type
 * @param {T[]} data - Array of data items
 * @param {number} total - Total number of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {PaginatedResponse<T>} Paginated response with metadata
 *
 * @example
 * ```typescript
 * @Get('students')
 * async getStudents(@Query() paginationQuery: PaginationQuery) {
 *   const { data, total } = await this.studentsService.findAll(paginationQuery);
 *   return createPaginatedResponse(data, total, paginationQuery.page, paginationQuery.limit);
 * }
 * ```
 */
export declare function createPaginatedResponse<T>(data: T[], total: number, page: number, limit: number): PaginatedResponse<T>;
/**
 * Transforms entity to DTO using class-transformer.
 *
 * @template T - DTO class type
 * @param {ClassConstructor<T>} dtoClass - DTO class constructor
 * @param {any} entity - Entity or plain object to transform
 * @returns {T} Transformed DTO instance
 *
 * @example
 * ```typescript
 * @Get('users/:id')
 * async getUser(@Param('id') id: string) {
 *   const user = await this.usersService.findOne(id);
 *   return transformToDto(UserResponseDto, user);
 * }
 * ```
 */
export declare function transformToDto<T extends object>(dtoClass: ClassConstructor<T>, entity: any): T;
/**
 * Transforms array of entities to DTOs.
 *
 * @template T - DTO class type
 * @param {ClassConstructor<T>} dtoClass - DTO class constructor
 * @param {any[]} entities - Array of entities to transform
 * @returns {T[]} Array of transformed DTO instances
 *
 * @example
 * ```typescript
 * @Get('users')
 * async getUsers() {
 *   const users = await this.usersService.findAll();
 *   return transformToDtoArray(UserResponseDto, users);
 * }
 * ```
 */
export declare function transformToDtoArray<T extends object>(dtoClass: ClassConstructor<T>, entities: any[]): T[];
/**
 * Sends file as download with proper headers.
 *
 * @param {Response} res - Express response object
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - Download filename
 * @param {string} mimeType - File MIME type
 *
 * @example
 * ```typescript
 * @Get('reports/:id/download')
 * async downloadReport(@Param('id') id: string, @Res() res: Response) {
 *   const report = await this.reportsService.generatePdf(id);
 *   sendFileDownload(res, report.buffer, `report-${id}.pdf`, 'application/pdf');
 * }
 * ```
 */
export declare function sendFileDownload(res: Response, buffer: Buffer, filename: string, mimeType: string): void;
/**
 * Sets cache headers on response.
 *
 * @param {Response} res - Express response object
 * @param {number} maxAge - Cache max age in seconds
 * @param {boolean} isPublic - Whether cache is public (default: false)
 *
 * @example
 * ```typescript
 * @Get('public-data')
 * async getPublicData(@Res() res: Response) {
 *   setCacheHeaders(res, 3600, true); // 1 hour, public cache
 *   const data = await this.dataService.getPublic();
 *   return res.json(data);
 * }
 * ```
 */
export declare function setCacheHeaders(res: Response, maxAge: number, isPublic?: boolean): void;
/**
 * Disables caching on response.
 *
 * @param {Response} res - Express response object
 *
 * @example
 * ```typescript
 * @Get('sensitive-data')
 * async getSensitiveData(@Res() res: Response) {
 *   disableCache(res);
 *   const data = await this.dataService.getSensitive();
 *   return res.json(data);
 * }
 * ```
 */
export declare function disableCache(res: Response): void;
/**
 * Validates uploaded file against configuration.
 *
 * @param {Express.Multer.File} file - Uploaded file
 * @param {FileUploadConfig} config - Upload configuration
 * @throws {BadRequestException} If file validation fails
 *
 * @example
 * ```typescript
 * @Post('upload')
 * @UseInterceptors(FileInterceptor('file'))
 * async uploadFile(@UploadedFile() file: Express.Multer.File) {
 *   validateUploadedFile(file, {
 *     maxSize: 5 * 1024 * 1024, // 5MB
 *     allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
 *   });
 *   return this.filesService.save(file);
 * }
 * ```
 */
export declare function validateUploadedFile(file: Express.Multer.File, config: FileUploadConfig): void;
/**
 * Generates unique filename with timestamp and random string.
 *
 * @param {string} originalName - Original filename
 * @param {string} prefix - Optional prefix (default: '')
 * @returns {string} Unique filename
 *
 * @example
 * ```typescript
 * @Post('avatar')
 * @UseInterceptors(FileInterceptor('avatar'))
 * async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
 *   const filename = generateUniqueFilename(file.originalname, 'avatar');
 *   // avatar-1699564800000-a1b2c3.jpg
 *   return this.filesService.save(file, filename);
 * }
 * ```
 */
export declare function generateUniqueFilename(originalName: string, prefix?: string): string;
/**
 * Extracts file extension from filename.
 *
 * @param {string} filename - Filename
 * @returns {string} File extension (lowercase, without dot)
 *
 * @example
 * ```typescript
 * const ext = getFileExtension('document.PDF'); // 'pdf'
 * const ext2 = getFileExtension('image.jpeg'); // 'jpeg'
 * ```
 */
export declare function getFileExtension(filename: string): string;
/**
 * Determines MIME type from file extension.
 *
 * @param {string} filename - Filename
 * @returns {string} MIME type
 *
 * @example
 * ```typescript
 * const mime = getMimeTypeFromExtension('document.pdf'); // 'application/pdf'
 * const mime2 = getMimeTypeFromExtension('image.jpg'); // 'image/jpeg'
 * ```
 */
export declare function getMimeTypeFromExtension(filename: string): string;
/**
 * Creates a StreamableFile from buffer.
 *
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - Optional filename for Content-Disposition header
 * @param {string} mimeType - Optional MIME type
 * @returns {StreamableFile} NestJS StreamableFile
 *
 * @example
 * ```typescript
 * @Get('download/:id')
 * async downloadFile(@Param('id') id: string) {
 *   const file = await this.filesService.getFile(id);
 *   return createStreamableFile(file.buffer, file.name, file.mimeType);
 * }
 * ```
 */
export declare function createStreamableFile(buffer: Buffer, filename?: string, mimeType?: string): StreamableFile;
/**
 * Creates a StreamableFile from readable stream.
 *
 * @param {Readable} stream - Readable stream
 * @param {string} filename - Optional filename for Content-Disposition header
 * @param {string} mimeType - Optional MIME type
 * @returns {StreamableFile} NestJS StreamableFile
 *
 * @example
 * ```typescript
 * @Get('export/:id')
 * async exportData(@Param('id') id: string) {
 *   const stream = await this.exportService.createCsvStream(id);
 *   return createStreamableFileFromStream(stream, 'export.csv', 'text/csv');
 * }
 * ```
 */
export declare function createStreamableFileFromStream(stream: Readable, filename?: string, mimeType?: string): StreamableFile;
/**
 * Sends Server-Sent Events (SSE) stream.
 *
 * @param {Response} res - Express response object
 * @param {() => void} setupFn - Function to set up event listeners
 *
 * @example
 * ```typescript
 * @Sse('notifications')
 * async streamNotifications(@Res() res: Response, @CurrentUser('id') userId: string) {
 *   sendServerSentEvents(res, () => {
 *     this.notificationsService.on('notification', (data) => {
 *       res.write(`data: ${JSON.stringify(data)}\n\n`);
 *     });
 *   });
 * }
 * ```
 */
export declare function sendServerSentEvents(res: Response, setupFn: () => void): void;
/**
 * Custom metadata key constants
 */
export declare const ROUTE_METADATA_KEY = "custom:route_metadata";
export declare const AUDIT_LOG_KEY = "custom:audit_log";
export declare const RATE_LIMIT_KEY = "custom:rate_limit";
/**
 * Sets custom route metadata.
 *
 * @param {RouteMetadata} metadata - Route metadata
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * @Get('sensitive')
 * @SetRouteMetadata({
 *   path: '/sensitive',
 *   method: 'GET',
 *   handler: 'getSensitiveData',
 *   guards: [AuthGuard, RolesGuard]
 * })
 * async getSensitiveData() {
 *   return this.dataService.getSensitive();
 * }
 * ```
 */
export declare function SetRouteMetadata(metadata: RouteMetadata): MethodDecorator;
/**
 * Retrieves route metadata from execution context.
 *
 * @param {ExecutionContext} context - Execution context
 * @returns {RouteMetadata | undefined} Route metadata if exists
 *
 * @example
 * ```typescript
 * // In an interceptor or guard
 * const metadata = getRouteMetadata(context);
 * if (metadata?.guards?.includes(AuthGuard)) {
 *   // Handle authentication
 * }
 * ```
 */
export declare function getRouteMetadata(context: ExecutionContext): RouteMetadata | undefined;
/**
 * Creates a base CRUD controller class dynamically.
 * Provides standard findAll, findOne, create, update, delete methods.
 *
 * @template T - Entity type
 * @param {CrudConfig<T>} config - CRUD configuration
 * @returns {any} Controller class
 *
 * @example
 * ```typescript
 * @Controller('users')
 * export class UsersController extends createCrudController({
 *   entity: User,
 *   createDto: CreateUserDto,
 *   updateDto: UpdateUserDto,
 *   service: UsersService,
 *   routePrefix: 'users'
 * }) {
 *   // Add custom endpoints here
 * }
 * ```
 */
export declare function createCrudController<T>(config: CrudConfig<T>): any;
/**
 * Builds query filter object from request parameters.
 *
 * @param {Request} req - Express request object
 * @param {Record<string, FilterOperator>} fieldOperators - Map of field names to operators
 * @returns {Record<string, any>} Query filter object
 *
 * @example
 * ```typescript
 * @Get('search')
 * async search(@Req() req: Request) {
 *   const filters = buildQueryFilter(req, {
 *     age: 'gte',
 *     name: 'like',
 *     status: 'eq'
 *   });
 *   // filters = { age: { $gte: 18 }, name: { $like: '%John%' }, status: 'active' }
 *   return this.service.search(filters);
 * }
 * ```
 */
export declare function buildQueryFilter(req: Request, fieldOperators: Record<string, FilterOperator>): Record<string, any>;
/**
 * Composes multiple decorators into a single decorator.
 *
 * @param {MethodDecorator[]} decorators - Array of decorators
 * @returns {MethodDecorator} Composed decorator
 *
 * @example
 * ```typescript
 * const AuthenticatedRoute = composeDecorators([
 *   UseGuards(AuthGuard),
 *   ApiBearerAuth(),
 *   ApiUnauthorizedResponse({ description: 'Unauthorized' })
 * ]);
 *
 * @Get('protected')
 * @AuthenticatedRoute
 * async getProtectedData() {
 *   return this.dataService.getProtected();
 * }
 * ```
 */
export declare function composeDecorators(decorators: MethodDecorator[]): MethodDecorator;
/**
 * Creates a standardized error handler for controllers.
 *
 * @param {Error} error - Error object
 * @param {string} entityName - Entity name for error messages
 * @returns {never} Throws appropriate HTTP exception
 * @throws {HttpException} Appropriate HTTP exception based on error type
 *
 * @example
 * ```typescript
 * @Get(':id')
 * async findOne(@Param('id') id: string) {
 *   try {
 *     return await this.usersService.findOne(id);
 *   } catch (error) {
 *     handleControllerError(error, 'User');
 *   }
 * }
 * ```
 */
export declare function handleControllerError(error: any, entityName: string): never;
/**
 * Wraps async controller method with error handling.
 *
 * @template T - Return type
 * @param {() => Promise<T>} fn - Async function to wrap
 * @param {string} entityName - Entity name for error messages
 * @returns {Promise<T>} Function result
 *
 * @example
 * ```typescript
 * @Get(':id')
 * async findOne(@Param('id') id: string) {
 *   return withErrorHandling(
 *     () => this.usersService.findOne(id),
 *     'User'
 *   );
 * }
 * ```
 */
export declare function withErrorHandling<T>(fn: () => Promise<T>, entityName: string): Promise<T>;
declare const _default: {
    CurrentUser: any;
    IpAddress: any;
    UserAgent: any;
    Protocol: any;
    HostName: any;
    Origin: any;
    Referer: any;
    Cookies: any;
    parsePaginationParams: typeof parsePaginationParams;
    parseSortParams: typeof parseSortParams;
    extractSearchQuery: typeof extractSearchQuery;
    extractFilters: typeof extractFilters;
    validateRequestBody: typeof validateRequestBody;
    extractDateRange: typeof extractDateRange;
    createSuccessResponse: typeof createSuccessResponse;
    createErrorResponse: typeof createErrorResponse;
    createPaginatedResponse: typeof createPaginatedResponse;
    transformToDto: typeof transformToDto;
    transformToDtoArray: typeof transformToDtoArray;
    sendFileDownload: typeof sendFileDownload;
    setCacheHeaders: typeof setCacheHeaders;
    disableCache: typeof disableCache;
    validateUploadedFile: typeof validateUploadedFile;
    generateUniqueFilename: typeof generateUniqueFilename;
    getFileExtension: typeof getFileExtension;
    getMimeTypeFromExtension: typeof getMimeTypeFromExtension;
    createStreamableFile: typeof createStreamableFile;
    createStreamableFileFromStream: typeof createStreamableFileFromStream;
    sendServerSentEvents: typeof sendServerSentEvents;
    SetRouteMetadata: typeof SetRouteMetadata;
    getRouteMetadata: typeof getRouteMetadata;
    createCrudController: typeof createCrudController;
    buildQueryFilter: typeof buildQueryFilter;
    composeDecorators: typeof composeDecorators;
    handleControllerError: typeof handleControllerError;
    withErrorHandling: typeof withErrorHandling;
};
export default _default;
//# sourceMappingURL=nest-controllers-utils.d.ts.map